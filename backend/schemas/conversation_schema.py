from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.enums import ConversationDirection

class ConversationBase(BaseModel):
    direction: ConversationDirection
    channel: Optional[str] = "email"
    content: Optional[str] = None
    subject: Optional[str] = None

class ConversationCreate(ConversationBase):
    pass

class ConversationResponse(ConversationBase):
    id: int
    lead_id: int
    message_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
