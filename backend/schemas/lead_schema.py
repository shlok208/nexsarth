from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.enums import LeadStatus

class LeadBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None

class LeadCreate(LeadBase):
    pass

class LeadUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    status: Optional[LeadStatus] = None

class LeadResponse(LeadBase):
    id: int
    status: LeadStatus
    score: int = 0
    followup_attempts: int
    follow_up_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    assigned_user_id: Optional[int] = None

    class Config:
        from_attributes = True

class StatusHistoryResponse(BaseModel):
    id: int
    lead_id: int
    from_status: Optional[LeadStatus]
    to_status: LeadStatus
    reason: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
