import smtplib
from email.message import EmailMessage
from app.config import settings

def send_email(to_email: str, subject: str, content: str, smtp_user: str = None, smtp_pass: str = None) -> bool:
    """Send an email using either user-specific credentials or default system settings."""
    user = smtp_user or settings.SMTP_USER
    password = smtp_pass or settings.SMTP_PASS
    
    if not settings.SMTP_HOST or not user or not password:
        print("SMTP credentials missing! Ensure Gmail integration is active.")
        return False

    msg = EmailMessage()
    msg.set_content(content)
    msg['Subject'] = subject
    msg['From'] = user
    msg['To'] = to_email

    try:
        # Using a timeout to prevent worker hangs
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(user, password)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"Error sending email from {user} to {to_email}: {e}")
        return False
