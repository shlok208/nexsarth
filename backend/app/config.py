import os
from pydantic_settings import BaseSettings

# Resolve .env file from the project root
_env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env")

class Settings(BaseSettings):
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    GOOGLE_CLIENT_ID: str = ""
    
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASS: str = ""
    
    FOLLOWUP_DAYS: int = 2
    MAX_FOLLOWUPS: int = 2

    class Config:
        env_file = _env_file
        extra = "ignore"

settings = Settings()
