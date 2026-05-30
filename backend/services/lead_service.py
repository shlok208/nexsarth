from supabase import Client
from typing import List, Optional
from fastapi import HTTPException
from app.enums import LeadStatus
from schemas.lead_schema import LeadCreate
from datetime import datetime, timezone

def get_leads(supabase: Client, user_id: int, skip: int = 0, limit: int = 100, search: Optional[str] = None, status: Optional[LeadStatus] = None, sort_by: str = "created_at", sort_desc: bool = True):
    query = supabase.table("leads").select("*").eq("assigned_user_id", user_id)
    
    if search:
        # Supabase or filter: or(first_name.ilike.%search%,last_name.ilike.%search%...)
        search_filter = f"first_name.ilike.*{search}*,last_name.ilike.*{search}*,email.ilike.*{search}*,company.ilike.*{search}*"
        query = query.or_(search_filter)
        
    if status:
        query = query.eq("status", status.value if hasattr(status, "value") else status)
        
    query = query.order(sort_by, desc=sort_desc)
    query = query.range(skip, skip + limit - 1)
    
    response = query.execute()
    return response.data

def get_lead(supabase: Client, lead_id: int, user_id: int):
    response = supabase.table("leads").select("*").eq("id", lead_id).eq("assigned_user_id", user_id).execute()
    return response.data[0] if response.data else None

def create_lead(supabase: Client, lead: LeadCreate, user_id: Optional[int] = None):
    # Check if lead already exists for this specific user
    if user_id:
        existing = supabase.table("leads").select("id").eq("email", lead.email).eq("assigned_user_id", user_id).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Lead with this email already exists in your account")
    else:
        existing = supabase.table("leads").select("id").eq("email", lead.email).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Lead with this email already exists")

    lead_dict = lead.model_dump()
    lead_dict["status"] = LeadStatus.new.value
    # Set immediate followup so worker picks it up instantly
    lead_dict["follow_up_at"] = datetime.now(timezone.utc).isoformat()
    
    if user_id:
        lead_dict["assigned_user_id"] = user_id
    
    response = supabase.table("leads").insert(lead_dict).execute()
    new_lead = response.data[0]
    
    # Log status history
    log_status_change(supabase, new_lead["id"], None, LeadStatus.new, reason="Lead created manually", user_id=user_id)
    
    return new_lead

def create_leads_bulk(supabase: Client, leads: List[LeadCreate], user_id: int):
    created_count = 0
    errors = []
    
    for idx, lead in enumerate(leads):
        try:
            # Check if exists -> Scoped to user to prevent cross-account duplicate errors
            existing = supabase.table("leads").select("id").eq("email", lead.email).eq("assigned_user_id", user_id).execute()
            if existing.data:
                errors.append({"row": idx + 1, "email": lead.email, "error": "Email already exists in your account"})
                continue
                
            lead_dict = lead.model_dump()
            lead_dict["status"] = LeadStatus.new.value
            # Set immediate followup for bulk imports too
            lead_dict["follow_up_at"] = datetime.now(timezone.utc).isoformat()
            lead_dict["assigned_user_id"] = user_id
            
            response = supabase.table("leads").insert(lead_dict).execute()
            new_lead = response.data[0]
            
            log_status_change(supabase, new_lead["id"], None, LeadStatus.new, reason="Imported via CSV")
            created_count += 1
        except Exception as e:
            errors.append({"row": idx + 1, "email": lead.email, "error": str(e)})
            
    return {"successful": created_count, "failed": len(errors), "errors": errors}

def update_lead_status(supabase: Client, lead_id: int, new_status: LeadStatus, reason: Optional[str] = None, user_id: Optional[int] = None, score: Optional[int] = None):
    # Get current status
    lead_resp = supabase.table("leads").select("status").eq("id", lead_id).execute()
    if not lead_resp.data:
        return None
        
    old_status = lead_resp.data[0]["status"]
    
    # Compare raw status strings or values
    new_status_val = new_status.value if hasattr(new_status, "value") else new_status
    
    # Update lead
    update_data = {"status": new_status_val}
    if score is not None:
        update_data["score"] = score
        
    supabase.table("leads").update(update_data).eq("id", lead_id).execute()
    
    # Log change only if status actually changed or score is new
    if old_status != new_status_val:
        log_status_change(supabase, lead_id, old_status, new_status, reason, user_id)
        
    # Return full lead
    full_lead = supabase.table("leads").select("*").eq("id", lead_id).execute()
    return full_lead.data[0] if full_lead.data else None

def delete_lead(supabase: Client, lead_id: int, user_id: int):
    """Effectively remove a lead from the registry, including all related events."""
    try:
        # Verify ownership first
        lead = get_lead(supabase, lead_id, user_id)
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found or unauthorized")

        # Cascading removal in Supabase should be handled by RLS/Keys,
        # but we'll manually cleanup to ensure a clean mission wipe.
        supabase.table("conversations").delete().eq("lead_id", lead_id).execute()
        supabase.table("status_history").delete().eq("lead_id", lead_id).execute()
        
        # Finally delete lead
        response = supabase.table("leads").delete().eq("id", lead_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Lead not found or already purged.")
            
        return {"status": "success", "message": f"Lead {lead_id} purged from Galaxy Records."}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Purge error: {e}")
        raise HTTPException(status_code=500, detail="Neural registry purge failed.")

def log_status_change(supabase: Client, lead_id: int, from_status: Optional[LeadStatus], to_status: LeadStatus, reason: Optional[str] = None, user_id: Optional[int] = None):
    history_entry = {
        "lead_id": lead_id,
        "from_status": from_status.value if from_status and hasattr(from_status, "value") else from_status,
        "to_status": to_status.value if to_status and hasattr(to_status, "value") else to_status,
        "reason": reason,
        "changed_by_user_id": user_id
    }
    supabase.table("status_history").insert(history_entry).execute()

def get_lead_status_history(supabase: Client, lead_id: int):
    response = supabase.table("status_history").select("*").eq("lead_id", lead_id).order("created_at", desc=True).execute()
    return response.data

def get_lead_conversations(supabase: Client, lead_id: int):
    response = supabase.table("conversations").select("*").eq("lead_id", lead_id).order("created_at", desc=True).execute()
    return response.data
