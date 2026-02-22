from typing import Annotated
from fastapi import Depends
from services.auth_service import get_current_active_user
from models.auth import User


async def get_current_user_id(
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> str:
    return current_user.username
