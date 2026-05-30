import os
import sys
import json
from datetime import datetime, timezone, timedelta

# ensure we can import backend packages
_parent = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(_parent, 'backend'))

from app.database import supabase
from app.enums import LeadStatus
from utils.email_sender import send_email
from services.lead_service import update_lead_status
from app.config import settings
from automation.email_templates import get_followup_email

# Local persistence file paths
GMAIL_FILE = os.path.join(_parent, "backend", "user_integrations.json")
SETTINGS_FILE = os.path.join(_parent, "backend", "user_settings.json")

def load_json(path):
    if not os.path.exists(path):
        return {}
    try:
        with open(path, "r") as f:
            return json.load(f)
    except:
        return {}

def process_followups():
    try:
        now = datetime.now(timezone.utc).isoformat()
        gmails = load_json(GMAIL_FILE)
        biz_settings = load_json(SETTINGS_FILE)
        
        # Follow_up_at < current time, exclude lost, qualified, converted, invalid
        response = supabase.table("leads").select("*") \
            .lte("follow_up_at", now) \
            .not_.in_("status", [LeadStatus.lost.value, LeadStatus.qualified.value, LeadStatus.converted.value, LeadStatus.invalid.value]) \
            .execute()
        
        leads_to_followup = response.data
        
        for lead in leads_to_followup:
            lead_id = lead["id"]
            assigned_user_id = lead.get("assigned_user_id")
            
            # Fetch user-specific credentials 
            smtp_user = None
            smtp_pass = None
            business_profile = None
            
            if assigned_user_id:
                u_key = str(assigned_user_id)
                # Gmail
                if u_key in gmails:
                    smtp_user = gmails[u_key].get("gmail_email")
                    smtp_pass = gmails[u_key].get("gmail_app_password")
                # Business Settings
                if u_key in biz_settings:
                    business_profile = biz_settings[u_key]

            if lead["followup_attempts"] >= settings.MAX_FOLLOWUPS:
                update_lead_status(supabase, lead_id, LeadStatus.lost, "Max followup attempts reached", assigned_user_id)
                print(f"Lead {lead_id} lost due to max followups.")
                continue

            # Send email with business profile context if available
            subject, body = get_followup_email(lead, lead["followup_attempts"] + 1, business_profile)
            sent = send_email(lead["email"], subject, body, smtp_user=smtp_user, smtp_pass=smtp_pass)
            
            if sent:
                # Add outbound conversation
                outbound_conv = {
                    "lead_id": lead_id,
                    "direction": "outbound",
                    "channel": "email",
                    "subject": subject,
                    "content": body
                }
                supabase.table("conversations").insert(outbound_conv).execute()
                
                if lead["status"] == LeadStatus.new.value:
                    update_lead_status(supabase, lead_id, LeadStatus.contacted, "Initial outreach sent", assigned_user_id)
                    
                new_attempts = lead["followup_attempts"] + 1
                new_follow_up_at = (datetime.now(timezone.utc) + timedelta(days=settings.FOLLOWUP_DAYS)).isoformat()
                
                supabase.table("leads").update({
                    "followup_attempts": new_attempts,
                    "follow_up_at": new_follow_up_at
                }).eq("id", lead_id).execute()
                
                print(f"Sent followup {new_attempts} to Lead {lead_id} from {smtp_user or 'system-fallback'}")
            else:
                print(f"Failed to send followup to {lead['email']} (Check SMTP)")
                
    except Exception as e:
        print(f"Error in process_followups: {e}")
        raise e
