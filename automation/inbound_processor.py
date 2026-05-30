from datetime import datetime, timezone, timedelta
import os
import sys

# ensure we can import backend packages
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'backend'))

from app.database import supabase
from app.enums import LeadStatus
from utils.sentiment import analyze_sentiment
from services.lead_service import update_lead_status
from app.config import settings

def process_inbound():
    try:
        # Find all unprocessed inbound conversations
        # This replaces the inefficient lead-based loop
        conv_resp = supabase.table("conversations").select("*").eq("direction", "inbound").eq("processed", False).execute()
        unprocessed_convs = conv_resp.data
        
        for conv in unprocessed_convs:
            lead_id = conv["lead_id"]
            conv_id = conv["id"]
            
            # Fetch lead info
            lead_resp = supabase.table("leads").select("*").eq("id", lead_id).execute()
            if not lead_resp.data:
                continue
            lead = lead_resp.data[0]
                
            sentiment_data = analyze_sentiment(conv["content"] or "")
            sentiment = sentiment_data["sentiment"]
            score = sentiment_data["score"]
            
            if score >= 71: # Positive
                update_lead_status(supabase, lead_id, LeadStatus.qualified, f"Qualified - Sentiment: {sentiment}, Score: {score}", score=score)
                print(f"Lead {lead_id} marked as qualified (Score: {score}).")
            elif score <= 30: # Negative
                update_lead_status(supabase, lead_id, LeadStatus.lost, f"Lost - Sentiment: {sentiment}, Score: {score}", score=score)
                print(f"Lead {lead_id} marked as lost (Score: {score}).")
            else: # Intermediate / Neutral
                if lead["status"] != LeadStatus.responded.value:
                    update_lead_status(supabase, lead_id, LeadStatus.responded, f"Responded - Sentiment: {sentiment}, Score: {score}", score=score)
                else:
                    # Just update the score if status is already responded
                    supabase.table("leads").update({"score": score}).eq("id", lead_id).execute()
                
                # set follow_up_at = now + X days
                follow_up_at = (datetime.now(timezone.utc) + timedelta(days=settings.FOLLOWUP_DAYS)).isoformat()
                supabase.table("leads").update({"follow_up_at": follow_up_at, "score": score}).eq("id", lead_id).execute()
                print(f"Lead {lead_id} marked as responded, followup scheduled (Score: {score}).")
                
            # Mark conversation as processed
            supabase.table("conversations").update({"processed": True}).eq("id", conv_id).execute()
            
    except Exception as e:
        print(f"Error in process_inbound: {e}")
        raise e
