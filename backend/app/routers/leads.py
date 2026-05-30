from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client
from typing import List, Optional

from app.database import get_supabase_admin
from schemas.lead_schema import LeadCreate, LeadResponse, LeadUpdate, StatusHistoryResponse
from services.lead_service import get_leads, get_lead, create_lead, create_leads_bulk, update_lead_status, get_lead_status_history
from app.enums import LeadStatus
from app.routers.auth import get_current_user
from utils.setup_check import is_setup_complete

router = APIRouter()

@router.get("", response_model=List[LeadResponse])
def read_leads(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    status: Optional[LeadStatus] = None,
    sort_by: str = "created_at",
    sort_desc: bool = True,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_admin)
):
    return get_leads(supabase, user_id=current_user["id"], skip=skip, limit=limit, search=search, status=status, sort_by=sort_by, sort_desc=sort_desc)

@router.post("", response_model=LeadResponse)
def create_new_lead(lead: LeadCreate, current_user: dict = Depends(get_current_user), supabase: Client = Depends(get_supabase_admin)):
    if not is_setup_complete(current_user["id"]):
        raise HTTPException(status_code=403, detail="Setup Incomplete. Please finish your Business Profile and connect Google integration first.")
    return create_lead(supabase=supabase, lead=lead, user_id=current_user["id"])

@router.post("/bulk")
def create_new_leads_bulk(leads: List[LeadCreate], current_user: dict = Depends(get_current_user), supabase: Client = Depends(get_supabase_admin)):
    if not is_setup_complete(current_user["id"]):
        raise HTTPException(status_code=403, detail="Setup Incomplete. Please finish your Business Profile and connect Google integration first.")
    return create_leads_bulk(supabase=supabase, leads=leads, user_id=current_user["id"])

@router.get("/{id}", response_model=LeadResponse)
def read_lead(id: int, current_user: dict = Depends(get_current_user), supabase: Client = Depends(get_supabase_admin)):
    lead_data = get_lead(supabase, lead_id=id, user_id=current_user["id"])
    if lead_data is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead_data

@router.delete("/{id}")
def delete_lead_endpoint(id: int, current_user: dict = Depends(get_current_user), supabase: Client = Depends(get_supabase_admin)):
    from services.lead_service import delete_lead
    return delete_lead(supabase, lead_id=id, user_id=current_user["id"])

@router.put("/{id}/status", response_model=LeadResponse)
def update_lead_status_endpoint(
    id: int, 
    status: LeadStatus, 
    current_user: dict = Depends(get_current_user), 
    supabase: Client = Depends(get_supabase_admin)
):
    # Verify ownership
    lead_data = get_lead(supabase, lead_id=id, user_id=current_user["id"])
    if not lead_data:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    return update_lead_status(supabase, lead_id=id, new_status=status, reason="Manual status update", user_id=current_user["id"])

@router.get("/{id}/status-history", response_model=List[StatusHistoryResponse])
def read_lead_status_history(id: int, supabase: Client = Depends(get_supabase_admin)):
    return get_lead_status_history(supabase, lead_id=id)
