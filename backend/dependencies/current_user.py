from typing import Annotated
from fastapi import Depends
from jwt.exceptions import InvalidTokenError
from fastapi.security import OAuth2PasswordBearer
from services.auth_service import get_current_active_user
from models.auth import User
from dotenv import load_dotenv

load_dotenv()

async def get_current_user_id(
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> str:
    return current_user.username

oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

async def get_optional_user_id(token: str = Depends(oauth2_scheme_optional)) -> str | None:
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except Exception:
        return None