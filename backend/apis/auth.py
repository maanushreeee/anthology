from typing import Annotated
from datetime import datetime, timedelta, timezone
from fastapi import status
from fastapi import Depends, HTTPException, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from db import get_db
from services.auth_service import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_active_user,
    authenticate_user,
    create_access_token,
    login_user,
    signup_user,
)
from models.auth import SignupRequest, User, Token
from db import users_collection

router = APIRouter()

@router.post("/token", response_model=Token)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    return login_user(form_data.username, form_data.password)


@router.get("/users/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user


@router.get("/users/me/items/")
async def read_own_items(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return [{"item_id": "Foo", "owner": current_user.username}]

@router.post("/signup")
def signup(payload: SignupRequest):
    return signup_user(
        username=payload.username,
        password=payload.password,
        email=payload.email,
    )