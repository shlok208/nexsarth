from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import leads, conversations, stats, gmail, auth, settings

app = FastAPI(title="Lead Management API")

import os

origins = [
    "http://localhost:3000",  # local development
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins += [u.strip().rstrip("/") for u in frontend_url.split(",")]
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def check_connectivity():
    from app.database import get_supabase_admin
    try:
        # Simple health check to Supabase
        supabase = get_supabase_admin()
        # Just check if we can reach the users table
        supabase.table("users").select("id", count="exact").limit(1).execute()
        print("✅ SUPABASE_CONNECTION: Active and reachable.")
    except Exception as e:
        print("\n" + "="*50)
        print("❌ SUPABASE_CONNECTION_ERROR")
        print(f"The system cannot reach your Supabase instance.")
        print(f"Details: {str(e)}")
        print("\nTROUBLESHOOTING:")
        print("1. Check your internet connection.")
        print("2. Verify if a Firewall or Proxy is blocking outgoing requests.")
        print("3. Check if your SUPABASE_URL in .env is correct.")
        print("="*50 + "\n")

app.include_router(leads.router, prefix="/api/v1/leads", tags=["Leads"])
app.include_router(conversations.router, prefix="/api/v1", tags=["Conversations"])
app.include_router(stats.router, prefix="/api/v1/stats", tags=["Stats"])
app.include_router(gmail.router)
app.include_router(auth.router)
app.include_router(settings.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
