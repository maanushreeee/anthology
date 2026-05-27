"""
Run this script from your backend root:
    python seed_users.py

All users are created with password: Password123
"""

from pymongo import MongoClient
from datetime import datetime, timezone
from pwdlib import PasswordHash
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = MongoClient(MONGO_URI)
db = client["publishing_platform"]
users_collection = db["users"]

password_hasher = PasswordHash.recommended()
DEFAULT_PASSWORD = "Password123"
hashed_pwd = password_hasher.hash(DEFAULT_PASSWORD)

users = [
    {
        "username": "sam_writes",
        "email": "sam@example.com",
        "hashed_password": hashed_pwd,
        "disabled": False,
        "bio": "Essayist and occasional poet. Writing about nature, science, and the spaces between.",
        "avatar": None,
        "member_since": datetime(2026, 1, 5, tzinfo=timezone.utc),
    },
    {
        "username": "priya_k",
        "email": "priya@example.com",
        "hashed_password": hashed_pwd,
        "disabled": False,
        "bio": "Researcher by day, writer by night. Interested in health, policy, and storytelling.",
        "avatar": None,
        "member_since": datetime(2026, 1, 12, tzinfo=timezone.utc),
    },
    {
        "username": "leon_m",
        "email": "leon@example.com",
        "hashed_password": hashed_pwd,
        "disabled": False,
        "bio": "Architect and urban thinker. Writing about cities, design, and how space shapes people.",
        "avatar": None,
        "member_since": datetime(2026, 1, 20, tzinfo=timezone.utc),
    },
    {
        "username": "zara_t",
        "email": "zara@example.com",
        "hashed_password": hashed_pwd,
        "disabled": False,
        "bio": "Fiction writer and reader. Obsessed with folklore, mythology, and the uncanny.",
        "avatar": None,
        "member_since": datetime(2026, 2, 1, tzinfo=timezone.utc),
    },
    {
        "username": "dev_notes",
        "email": "dev@example.com",
        "hashed_password": hashed_pwd,
        "disabled": False,
        "bio": "Software engineer writing about systems, tools, and the philosophy of building things.",
        "avatar": None,
        "member_since": datetime(2026, 2, 8, tzinfo=timezone.utc),
    },
]

# Avoid duplicates
existing = {u["username"] for u in users_collection.find({}, {"username": 1})}
to_insert = [u for u in users if u["username"] not in existing]

if to_insert:
    result = users_collection.insert_many(to_insert)
    print(f"✅ Inserted {len(result.inserted_ids)} users")
else:
    print("⚠️ All users already exist, nothing inserted")

print("\nCredentials:")
for u in users:
    print(f"  username: {u['username']}  |  password: {DEFAULT_PASSWORD}")

client.close()