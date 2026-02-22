import redis
import os

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")

try:
    redis_client = redis.from_url(redis_url, decode_responses=True)
    # Test connection
    redis_client.ping()
    REDIS_AVAILABLE = True
    print("✅ Redis connected successfully")
except Exception as e:
    redis_client = None
    REDIS_AVAILABLE = False
    print(f"⚠️ Redis not available - auto-save disabled: {str(e)}")


async def save_draft(user_id: str, article_id: str, title: str = None, content: str = None):
    """Auto-save draft to Redis with 48-hour expiration"""
    if not REDIS_AVAILABLE:
        return {"status": "Redis unavailable", "saved": False}
    
    try:
        key = f"draft:{user_id}:{article_id}"
        
        # Build update object from non-None values
        draft_data = {}
        if title is not None:
            draft_data["title"] = title
        if content is not None:
            draft_data["content"] = content
        
        # Get existing draft and merge
        existing = redis_client.get(key)
        if existing:
            import json
            merged = json.loads(existing)
            merged.update(draft_data)
            draft_data = merged
        else:
            draft_data["id"] = article_id
        
        # Add timestamp
        from datetime import datetime
        draft_data["last_auto_saved_at"] = datetime.utcnow().isoformat()
        
        # Save with 48-hour TTL
        import json
        redis_client.setex(key, 172800, json.dumps(draft_data))
        
        return {"status": "saved", "saved": True}
    except Exception as e:
        print(f"❌ Error saving draft to Redis: {str(e)}")
        return {"status": "error", "saved": False}


async def get_draft(user_id: str, article_id: str):
    """Retrieve draft from Redis"""
    if not REDIS_AVAILABLE:
        return None
    
    try:
        key = f"draft:{user_id}:{article_id}"
        draft = redis_client.get(key)
        if draft:
            import json
            return json.loads(draft)
        return None
    except Exception as e:
        print(f"❌ Error retrieving draft from Redis: {str(e)}")
        return None


async def clear_draft(user_id: str, article_id: str):
    """Clear draft from Redis after formal save"""
    if not REDIS_AVAILABLE:
        return False
    
    try:
        key = f"draft:{user_id}:{article_id}"
        redis_client.delete(key)
        return True
    except Exception as e:
        print(f"❌ Error clearing draft from Redis: {str(e)}")
        return False
