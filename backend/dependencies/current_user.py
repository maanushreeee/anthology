import os
from typing import Annotated
from fastapi import Depends
import jwt
from fastapi.security import OAuth2PasswordBearer
from services.auth_service import get_current_active_user, get_current_user
from models.auth import User
from dotenv import load_dotenv
from datetime import datetime, timezone

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

async def get_current_user_id(
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> str:
    return current_user.username
