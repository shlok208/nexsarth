import imaplib
import email
import email.utils
from email.header import decode_header
import json
import os
import sys
from datetime import datetime, timezone, timedelta

# Absolute project root discovery
_project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_backend_path = os.path.join(_project_root, 'backend')
if _backend_path not in sys.path:
    sys.path.append(_backend_path)

try:
    from app.database import supabase
    from app.enums import LeadStatus
except ImportError as e:
    print(f"CRITICAL: Failed to import backend packages from {_backend_path}: {e}")

GMAIL_FILE = os.path.join(_backend_path, "user_integrations.json")

def load_json(path):
    if not os.path.exists(path):
        return {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return {}

def sync_inbound_emails():
    """ Fetches recent emails from leads for all across the user integrations. """
    gmails = load_json(GMAIL_FILE)
    if not gmails:
        print("Worker: No Gmail integrations discovered in local registry.")
        return
        
    for user_id_str, creds in gmails.items():
        email_user = creds.get("gmail_email")
        email_pass = creds.get("gmail_app_password")
        
        if not email_user or not email_pass:
            print(f"Worker: Skipping User {user_id_str} due to missing credentials.")
            continue
            
        try:
            print(f"Worker: Syncing {email_user} for incoming lead signals...")
            
            # Connect to IMAP
            mail = imaplib.IMAP4_SSL("imap.gmail.com", timeout=15)
            mail.login(email_user, email_pass)
            mail.select("INBOX")
            
            # Search criteria - look for messages from the last 2 days
            # This is more robust than just 'UNSEEN' during debugging
            since_date = (datetime.now(timezone.utc) - timedelta(days=2)).strftime("%d-%b-%Y")
            status, messages = mail.search(None, f'(SINCE "{since_date}")')
            
            if status != "OK":
                mail.logout()
                continue
                
            msg_ids = messages[0].split()
            if not msg_ids:
                print(f"Worker: No recent signals found for {email_user} since {since_date}.")
                mail.logout()
                continue
                
            # Fetch all leads for this user to match them
            leads_resp = supabase.table("leads").select("id", "email").eq("assigned_user_id", int(user_id_str)).execute()
            if not leads_resp.data:
                mail.logout()
                continue

            leads_map = {lead["email"].lower().strip(): lead["id"] for lead in leads_resp.data}
            
            # We process from newest to oldest for efficiency if needed, but here we do all
            for m_id in reversed(msg_ids):
                # Fetch message headers
                status, msg_data = mail.fetch(m_id, "(RFC822)")
                for response_part in msg_data:
                    if isinstance(response_part, tuple):
                        msg = email.message_from_bytes(response_part[1])
                        
                        # Get sender info
                        from_ = msg.get("From")
                        if not from_:
                            continue
                        sender_email = email.utils.parseaddr(from_)[1].lower().strip()
                        
                        # message_id for duplicate check
                        msg_uid = msg.get("Message-ID")
                        
                        # Check if sender is one of our leads
                        if sender_email in leads_map:
                            lead_id = leads_map[sender_email]
                            
                            # Check if already processed in database
                            existing = supabase.table("conversations").select("id").eq("message_id", msg_uid).execute()
                            if existing.data:
                                # We skip if found, but we keep looking at other msg_ids
                                continue
                                
                            # Decode subject
                            subject = ""
                            if msg["Subject"]:
                                decoded_parts = decode_header(msg["Subject"])
                                for part, encoding in decoded_parts:
                                    if isinstance(part, bytes):
                                        subject += part.decode(encoding if encoding else "utf-8", errors="replace")
                                    else:
                                        subject += part
                            
                            # Extract body
                            body = ""
                            if msg.is_multipart():
                                for part in msg.walk():
                                    if part.get_content_type() == "text/plain":
                                        payload = part.get_payload(decode=True)
                                        if payload:
                                           body = payload.decode(errors="replace")
                                        break
                            else:
                                payload = msg.get_payload(decode=True)
                                if payload:
                                   body = payload.decode(errors="replace")
                            
                            # Insert into database
                            inbound_conv = {
                                "lead_id": lead_id,
                                "direction": "inbound",
                                "channel": "email",
                                "subject": subject,
                                "content": body,
                                "message_id": msg_uid
                            }
                            supabase.table("conversations").insert(inbound_conv).execute()
                            print(f"Worker: SIGNAL INTERCEPTED from {sender_email}. Inbound transmission saved.")
            
            mail.logout()
        except Exception as e:
            print(f"Worker Error: Nexus Link failed for {email_user}: {e}")

if __name__ == "__main__":
    sync_inbound_emails()
