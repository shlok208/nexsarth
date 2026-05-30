def analyze_sentiment(text: str) -> dict:
    """
    Analyzes sentiment and returns both a label and a numeric score (0-100).
    0-30: negative, 31-70: intermediate/neutral, 71-100: positive
    """
    text_lower = text.lower()
    
    # Base score
    score = 50
    
    # Positive triggers
    positives = {
        "interested": 20,
        "yes": 15,
        "let's talk": 25,
        "let’s talk": 25,
        "ready": 20,
        "schedule": 25,
        "demo": 25,
        "call": 15,
        "phone": 10,
        "meeting": 25,
        "pricing": 15,
        "price": 10,
        "cost": 10,
        "how": 5,
        "when": 5,
        "thank": 10,
        "thanks": 5,
        "great": 10,
        "awesome": 10,
        "good": 5,
    }
    
    # Negative triggers
    negatives = {
        "not interested": -30,
        "stop": -40,
        "unsubscribe": -40,
        "no thanks": -20,
        "later": -15,
        "busy": -10,
        "no": -15,
        "never": -25,
        "remove": -30,
        "bad": -10,
        "useless": -20,
    }
    
    # Simple keyword matching
    for kw, val in positives.items():
        if kw in text_lower:
            score += val
            
    for kw, val in negatives.items():
        if kw in text_lower:
            score += val
            
    # Normalize score to 0-100
    score = max(0, min(100, score))
    
    sentiment = "neutral"
    if score >= 71:
        sentiment = "positive"
    elif score <= 30:
        sentiment = "negative"
    else:
        sentiment = "intermediate"
        
    return {"sentiment": sentiment, "score": score}
