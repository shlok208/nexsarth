from fastapi import APIRouter, Depends
from supabase import Client
from typing import List

from app.database import get_supabase
from schemas.conversation_schema import ConversationResponse
from services.lead_service import get_lead_conversations

router = APIRouter()

@router.get("/leads/{id}/conversations", response_model=List[ConversationResponse])
def read_lead_conversations(id: int, supabase: Client = Depends(get_supabase)):
    return get_lead_conversations(supabase, lead_id=id)
