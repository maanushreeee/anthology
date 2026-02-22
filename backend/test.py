from db import get_db
from services.auth_service import get_password_hash
import asyncio
from datetime import datetime, timezone

async def create_test_user():
    db = get_db()
    user1 = {
        "username": "johnny",
        "full_name": "Dr. Johnny",
        "email": "johnny@example.com",
        "hashed_password": get_password_hash("password"),
        "disabled": False,
        "created_at": datetime.now(timezone.utc),
    }
    user2 = {
        "username": "alice",
        "full_name": "Alice Smith",
        "email": "alice@example.com",
        "hashed_password": get_password_hash("password"),
        "disabled": False,
        "created_at": datetime.now(timezone.utc),
    }

    db.users.insert_one(user1)
    db.users.insert_one(user2)
    print("User created!")

asyncio.run(create_test_user())