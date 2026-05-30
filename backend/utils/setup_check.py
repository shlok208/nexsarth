def is_setup_complete(user_id: int) -> bool:
    from app.routers.settings import load_settings
    from app.routers.gmail import load_integrations
    user_key = str(user_id)
    
    # Check Business Profile
    settings = load_settings()
    has_business_profile = False
    if user_key in settings and settings[user_key].get("name") and settings[user_key].get("description"):
        has_business_profile = True
        
    # Check Gmail Integration
    integrations = load_integrations()
    has_gmail = False
    if user_key in integrations and integrations[user_key].get("gmail_email"):
        has_gmail = True
        
    return has_business_profile and has_gmail

def get_setup_status(user_id: int) -> dict:
    from app.routers.settings import load_settings
    from app.routers.gmail import load_integrations
    user_key = str(user_id)
    
    # Check Business Profile
    settings = load_settings()
    has_business_profile = False
    if user_key in settings and settings[user_key].get("name") and settings[user_key].get("description"):
        has_business_profile = True
        
    # Check Gmail Integration
    integrations = load_integrations()
    has_gmail = False
    if user_key in integrations and integrations[user_key].get("gmail_email"):
        has_gmail = True
        
    return {
        "business_profile_complete": has_business_profile,
        "gmail_connected": has_gmail,
        "is_complete": has_business_profile and has_gmail
    }
