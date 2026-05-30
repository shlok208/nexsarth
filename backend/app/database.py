from supabase import create_client, Client
from app.config import settings

# Initialize Supabase clients
# Use anon key for general client (subject to RLS)
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# Use service role key for administrative client (bypasses RLS)
supabase_admin: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

def get_supabase() -> Client:
    return supabase

def get_supabase_admin() -> Client:
    """Dependency for administrative tasks like user registration bypasses RLS."""
    return supabase_admin
