"""
Run this script from your backend root:
    python seed_publications.py
"""

from pymongo import MongoClient
from datetime import datetime, timezone
from uuid import uuid4
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = MongoClient(MONGO_URI)
db = client["publishing_platform"]
publications_collection = db["publications"]

def now():
    return datetime.now(timezone.utc)

publications = [
    {
        "id": str(uuid4()),
        "owner_id": "johnny",
        "name": "The Examined Life",
        "created_at": datetime(2026, 1, 18, tzinfo=timezone.utc),
    },
    {
        "id": str(uuid4()),
        "owner_id": "anish25",
        "name": "Anish's Notebook",
        "created_at": datetime(2026, 1, 22, tzinfo=timezone.utc),
    },
    {
        "id": str(uuid4()),
        "owner_id": "sam_writes",
        "name": "Slow Observations",
        "created_at": datetime(2026, 1, 5, tzinfo=timezone.utc),
    },
    {
        "id": str(uuid4()),
        "owner_id": "priya_k",
        "name": "Health & Policy Notes",
        "created_at": datetime(2026, 1, 12, tzinfo=timezone.utc),
    },
    {
        "id": str(uuid4()),
        "owner_id": "leon_m",
        "name": "Built Environment",
        "created_at": datetime(2026, 1, 20, tzinfo=timezone.utc),
    },
    {
        "id": str(uuid4()),
        "owner_id": "zara_t",
        "name": "Folklore & Fiction",
        "created_at": datetime(2026, 2, 1, tzinfo=timezone.utc),
    },
    {
        "id": str(uuid4()),
        "owner_id": "dev_notes",
        "name": "Systems & Craft",
        "created_at": datetime(2026, 2, 8, tzinfo=timezone.utc),
    },
]

# Avoid duplicates
existing = {p["owner_id"] for p in publications_collection.find({}, {"owner_id": 1})}
to_insert = [p for p in publications if p["owner_id"] not in existing]

if to_insert:
    result = publications_collection.insert_many(to_insert)
    print(f"✅ Inserted {len(result.inserted_ids)} publications")
    for p in to_insert:
        print(f"  {p['owner_id']} → {p['name']}")
else:
    print("⚠️ All publications already exist, nothing inserted")

client.close()