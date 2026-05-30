import enum

class LeadStatus(str, enum.Enum):
    new = "new"
    contacted = "contacted"
    responded = "responded"
    qualified = "qualified"
    converted = "converted"
    lost = "lost"
    invalid = "invalid"

class ConversationDirection(str, enum.Enum):
    inbound = "inbound"
    outbound = "outbound"
