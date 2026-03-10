from typing import Annotated
from datetime import datetime, timedelta, timezone
from fastapi import status
from fastapi import Depends, HTTPException, APIRouter
from fastapi.security import  OAuth2PasswordRequestForm
from models.articles import ArticleResponse
from repos.article_repo import find_articles_by_owner
from db import get_db
from services.auth_service import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_active_user,
    authenticate_user,
    create_access_token,
    get_user_public_profile,
    login_user,
    signup_user,
    update_user_profile,
)
from models.auth import SignupRequest, User, Token, UpdateProfileRequest
from db import users_collection

router = APIRouter()

@router.post("/token", response_model=Token)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    return login_user(form_data.username, form_data.password)


@router.get("/users/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    # Re-fetch from DB to get bio, avatar, member_since
    user_doc = users_collection.find_one({"username": current_user.username})
    return User(
        username=user_doc["username"],
        email=user_doc.get("email"),
        disabled=user_doc.get("disabled"),
        bio=user_doc.get("bio"),
        avatar=user_doc.get("avatar"),
        member_since=user_doc.get("member_since"),
    )

@router.get("/users/{username}")
async def get_public_profile(username: str):
    profile = get_user_public_profile(username)
    if not profile:
        raise HTTPException(status_code=404, detail="User not found")
    return profile

@router.get("/users/{username}/articles", response_model=list[ArticleResponse])
async def get_user_published_articles(username: str):
    user = users_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    articles = find_articles_by_owner(username)
    return [a for a in articles if a.status == "published"]

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

@router.patch("/users/me/update-profile", response_model=User)
async def update_profile(
    payload: UpdateProfileRequest,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return update_user_profile(current_user.username, payload.bio, payload.avatar)