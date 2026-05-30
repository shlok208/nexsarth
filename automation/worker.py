import time
import sys
import os

# Add the parent directory and backend directory to sys.path
_project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(_project_root)
sys.path.append(os.path.join(_project_root, 'backend'))

from automation.inbound_processor import process_inbound
from automation.followup_processor import process_followups
from automation.gmail_sync import sync_inbound_emails

def run_worker():
    print("Starting Automation Worker...")
    try:
        while True:
            try:
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Syncing Gmail Inbox...")
                sync_inbound_emails()

                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Running inbound processor...")
                process_inbound()
                
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Running followup processor...")
                process_followups()
                
            except Exception as e:
                # Handle connection errors gracefully without crashing the loop
                if "getaddrinfo failed" in str(e):
                    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Network Error: No internet or Supabase offline. Will retry.")
                else:
                    print(f"Error in automation worker: {e}")
                
            # Changed to 10 seconds for "immediate" feel as requested
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Cycle complete. Sleeping for 10 seconds...")
            time.sleep(10) 
    except KeyboardInterrupt:
        print("\n[!] Automation Worker terminated by user. Shutting down safely...")
        sys.exit(0)

if __name__ == "__main__":
    run_worker()
