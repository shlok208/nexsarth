from typing import Any, Union, Optional

def get_followup_email(lead: Union[Any, dict], attempt_number: int, profile: Optional[dict] = None) -> tuple[str, str]:
    """Generates a branded, context-aware email based on the user's business profile."""
    
    # Handle both object and dictionary for the lead
    if isinstance(lead, dict):
        first_name = lead.get("first_name") or "there"
        company_name = lead.get("company") or "your company"
    else:
        first_name = getattr(lead, "first_name", None) or "there"
        company_name = getattr(lead, "company", None) or "your company"
    
    # Handle user's business profile details with safe fallbacks
    if profile:
        biz_name = profile.get("name") or "the team"
        biz_description = profile.get("description") or ""
        biz_services = profile.get("services") or "our offerings"
        biz_tagline = profile.get("tagline") or ""
        biz_tone = (profile.get("tone") or "Professional").lower()
    else:
        biz_name = "the team"
        biz_description = ""
        biz_services = "our offerings"
        biz_tagline = ""
        biz_tone = "professional"

    # Dynamic Greetings / Tones
    if biz_tone == "friendly":
        greeting = f"Hi {first_name}!"
        sign_off = f"Cheers,\n\n{biz_name}"
    elif biz_tone == "direct":
        greeting = f"{first_name},"
        sign_off = f"Best,\n\n{biz_name}"
    else:
        greeting = f"Dear {first_name},"
        sign_off = f"Sincerely,\n\n{biz_name}"

    if attempt_number == 1:
        # First email: Intro & Vision
        subject = f"Welcome to {biz_name} - Our Shared Vision"
        body = f"{greeting}\n\nThank you for reaching out to us at {biz_name}.\n\n{biz_description}\n\nCurrently, we provide: {biz_services}\n\n{biz_tagline}\n\nLooking forward to seeing you soon!\n\n{sign_off}"
    elif attempt_number == 2:
        # Second email: Following Up
        subject = f"Quick check-in from {biz_name}"
        body = f"{greeting}\n\nI'm following up to make sure you saw my last message about our vision for {biz_name}.\n\nAre you still interested in exploring our {biz_services}? I'd love to chat further about how we can help {company_name}.\n\n{sign_off}"
    else:
        # Third email: Final check-out
        subject = "Final Check-in"
        body = f"{greeting}\n\nI haven't heard back from you, so I'll assume that prioritizing our services isn't on your roadmap right now. If things change at {company_name}, please feel free to reach out anytime.\n\n{sign_off}"

    return subject, body
