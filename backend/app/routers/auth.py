import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from supabase import Client
from app.database import get_supabase, get_supabase_admin
from utils.auth import verify_password, get_password_hash, create_access_token, decode_access_token
from schemas.user_schema import UserCreate, UserResponse, Token, TokenData
from utils.setup_check import get_setup_status

# Removed unused Google Auth imports - now handled by Supabase
# from google.oauth2 import id_token
# from google.auth.transport import requests as google_requests
from app.config import settings

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

@router.post("/google", response_model=Token)
def google_auth(token: str, supabase: Client = Depends(get_supabase_admin)):
    """Authenticates a user via Supabase Google Session (ID Token verified by Supabase)."""
    try:
        # 1. Verify Supabase Session/Token
        # Token passed here is the Supabase access_token obtained on the frontend
        # using supabase.auth.signInWithIdToken()
        user_resp = supabase.auth.get_user(token)
        if not user_resp or not user_resp.user:
             raise HTTPException(status_code=401, detail="Invalid session provided by Neural Link")

        email = user_resp.user.email
        
        # 3. Find or create user in our custom table
        response = supabase.table("users").select("*").eq("email", email).execute()
        
        if not response.data:
            # Create user (random password since they use Google)
            new_user = {
                "email": email,
                "hashed_password": get_password_hash(os.urandom(24).hex())
            }
            response = supabase.table("users").insert(new_user).execute()
            if not response.data:
                raise HTTPException(status_code=500, detail="Failed to create user record in Nexus Galaxy")
            user = response.data[0]
        else:
            user = response.data[0]
            
        # 4. Return our standard application JWT
        access_token = create_access_token(data={"sub": user["email"]})
        return {"access_token": access_token, "token_type": "bearer"}
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Google/Supabase Login Error: {e}")
        raise HTTPException(status_code=500, detail=f"Authentication signal disrupted: {str(e)}")

async def get_current_user(token: str = Depends(oauth2_scheme), supabase: Client = Depends(get_supabase)):
    """Dependency to get the currently authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
    
    # Fetch user from Supabase (anon ok for reading own info, but we use email query)
    # Using admin just to be safe if RLS is tight on users table
    response = supabase.table("users").select("*").eq("email", email).execute()
    if not response.data:
        raise credentials_exception
    return response.data[0]

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, supabase: Client = Depends(get_supabase_admin)):
    """Registers a new user with email and password."""
    try:
        # Check if user exists
        existing = supabase.table("users").select("id").eq("email", user.email).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = get_password_hash(user.password)
        new_user = {
            "email": user.email,
            "hashed_password": hashed_password
        }
        response = supabase.table("users").insert(new_user).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create user record")
            
        return response.data[0]
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error during registration: {str(e)}")

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), supabase: Client = Depends(get_supabase_admin)):
    """Standard email/password login."""
    try:
        response = supabase.table("users").select("*").eq("email", form_data.username).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="Incorrect email or password")
        
        user = response.data[0]
        if not verify_password(form_data.password, user["hashed_password"]):
            raise HTTPException(status_code=400, detail="Incorrect email or password")
        
        access_token = create_access_token(data={"sub": user["email"]})
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during login")

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: dict = Depends(get_current_user)):
    """Returns the current user's profile."""
    return current_user

@router.get("/setup-status")
def read_setup_status(current_user: dict = Depends(get_current_user)):
    """Returns the user's setup status for the initial onboarding tour."""
    return get_setup_status(current_user["id"])
