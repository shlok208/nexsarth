import os
import json
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/v1/gmail", tags=["Gmail"])

# Local persistence file to bypass Supabase schema restrictions
INTEGRATIONS_FILE = os.path.join(os.getcwd(), "user_integrations.json")

def load_integrations():
    if not os.path.exists(INTEGRATIONS_FILE):
        return {}
    try:
        with open(INTEGRATIONS_FILE, "r") as f:
            return json.load(f)
    except:
        return {}

def save_integrations(data):
    with open(INTEGRATIONS_FILE, "w") as f:
        json.dump(data, f, indent=2)

class GmailConnectReq(BaseModel):
    gmail_email: str
    app_password: str

@router.get("/status")
def get_gmail_status(current_user: dict = Depends(get_current_user)):
    """Check if the current user has a stored Gmail connection across sessions."""
    integrations = load_integrations()
    user_key = str(current_user["id"])
    
    if user_key in integrations and integrations[user_key].get("gmail_email"):
        return {
            "connected": True,
            "email": integrations[user_key]["gmail_email"]
        }
    
    return {"connected": False}

@router.post("/connect")
def connect_gmail(req: GmailConnectReq, current_user: dict = Depends(get_current_user)):
    """Save user-specific Gmail credentials locally (persistent across logouts)."""
    if not req.gmail_email or not req.app_password:
        raise HTTPException(status_code=400, detail="Missing Gmail credentials")
    
    try:
        integrations = load_integrations()
        user_key = str(current_user["id"])
        
        integrations[user_key] = {
            "gmail_email": req.gmail_email,
            "gmail_app_password": req.app_password
        }
        
        save_integrations(integrations)
        return {"status": "success", "message": "Galaxy link established. Integration persistent."}
    except Exception as e:
        print(f"Failed to establish link: {e}")
        raise HTTPException(status_code=500, detail="Could not write to local registry.")

@router.post("/disconnect")
def disconnect_gmail(current_user: dict = Depends(get_current_user)):
    """Terminate the user's Gmail link."""
    try:
        integrations = load_integrations()
        user_key = str(current_user["id"])
        
        if user_key in integrations:
            del integrations[user_key]
            save_integrations(integrations)
            
        return {"status": "success", "message": "Link terminated."}
    except Exception as e:
        print(f"Failed to terminate link: {e}")
        raise HTTPException(status_code=500, detail="Could not update local registry.")
