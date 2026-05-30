from fastapi import APIRouter, Depends
from supabase import Client
from app.database import get_supabase
from app.routers.auth import get_current_user
from datetime import datetime, timedelta, timezone

router = APIRouter()

@router.get("/overview")
def get_stats_overview(
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    user_id = current_user["id"]
    
    # 1. Get total count for THIS USER
    total_res = supabase.table("leads").select("id", count="exact").eq("assigned_user_id", user_id).execute()
    total_leads = total_res.count if total_res.count is not None else 0
    
    # 2. Get status counts for THIS USER
    status_res = supabase.table("leads").select("status").eq("assigned_user_id", user_id).execute()
    
    stats_dict = {}
    for item in status_res.data:
        status = item["status"]
        stats_dict[status] = stats_dict.get(status, 0) + 1
    
    # 3. Calculate conversion rate 
    converted_count = stats_dict.get('converted', 0)
    conversion_rate = (converted_count / total_leads * 100) if total_leads > 0 else 0

    # 4. Intelligence Velocity (Last 7 Days - Dual Channel)
    seven_days_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    # Get created_at AND status to track daily generation vs loss
    velocity_res = supabase.table("leads")\
        .select("created_at, status")\
        .eq("assigned_user_id", user_id)\
        .gte("created_at", seven_days_ago)\
        .execute()
    
    # Initialize maps
    new_map = {}
    lost_map = {}
    now = datetime.now(timezone.utc)
    
    # We want to maintain chronological order for the last 7 days ending today
    ordered_labels = []
    for i in range(6, -1, -1):
        label = (now - timedelta(days=i)).strftime("%a")
        ordered_labels.append(label)
        new_map[label] = 0
        lost_map[label] = 0
        
    for item in velocity_res.data:
        try:
            # Handle potential Z or +00:00
            ts = item["created_at"].replace('Z', '+00:00')
            dt = datetime.fromisoformat(ts)
            day_label = dt.strftime("%a")
            
            if day_label in new_map:
                new_map[day_label] += 1
                if item["status"] == "lost":
                    lost_map[day_label] += 1
        except Exception as e:
            print(f"Date parse error: {e}")
            
    velocity_data = []
    for day in ordered_labels:
        velocity_data.append({
            "day": day, 
            "new": new_map.get(day, 0),
            "lost": lost_map.get(day, 0)
        })
    
    return {
        "total_leads": total_leads,
        "status_distribution": stats_dict,
        "conversion_rate": round(conversion_rate, 1),
        "daily_velocity": velocity_data
    }
