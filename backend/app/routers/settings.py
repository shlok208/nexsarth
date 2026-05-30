import os
import json
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/v1/settings", tags=["Settings"])

# Local persistence file to bypass Supabase schema restrictions
SETTINGS_FILE = os.path.join(os.getcwd(), "user_settings.json")

def load_settings():
    if not os.path.exists(SETTINGS_FILE):
        return {}
    try:
        with open(SETTINGS_FILE, "r") as f:
            return json.load(f)
    except:
        return {}

def save_settings(data):
    with open(SETTINGS_FILE, "w") as f:
        json.dump(data, f, indent=2)

class BusinessProfileReq(BaseModel):
    name: str
    description: str
    services: str
    tagline: Optional[str] = None
    tone: str = "Professional"

@router.get("/profile")
def get_business_profile(current_user: dict = Depends(get_current_user)):
    """Fetch the current user's business context."""
    settings = load_settings()
    user_key = str(current_user["id"])
    
    if user_key in settings:
        return settings[user_key]
    
    return {
        "name": "",
        "description": "",
        "services": "",
        "tagline": "",
        "tone": "Professional"
    }

@router.post("/profile")
def update_business_profile(req: BusinessProfileReq, current_user: dict = Depends(get_current_user)):
    """Save the business identity to generate smarter automated followups."""
    try:
        settings = load_settings()
        user_key = str(current_user["id"])
        
        settings[user_key] = req.model_dump()
        
        save_settings(settings)
        return {"status": "success", "message": "Business Identity Updated Successfully."}
    except Exception as e:
        print(f"Failed to update profile: {e}")
        raise HTTPException(status_code=500, detail="Could not update the local identity registry.")
