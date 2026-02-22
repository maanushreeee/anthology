from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

db = client["publishing_platform"]

articles_collection = db["articles"]
publications_collection = db["publications"]
users_collection = db["users"]

def get_db():
    return db
