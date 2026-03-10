from typing import Annotated
from datetime import datetime, timedelta, timezone
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from db import get_db
from models.auth import User, UserInDB, TokenData
from pwdlib import PasswordHash
import jwt
from jwt.exceptions import InvalidTokenError
from db import users_collection 
import os
from dotenv import load_dotenv

load_dotenv()


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

hashed_password = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_user(username: str):
    users = users_collection
    user = users.find_one({"username": username})
    if user:
        user_dict = user
        return UserInDB(**user_dict)
    return None


def authenticate_user( username: str, password: str):
    users = users_collection
    user = users.find_one({"username": username})
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user


def verify_password(plain_password: str, hashed_pwd: str) -> bool:
    return hashed_password.verify(plain_password, hashed_pwd)


def get_password_hash(password):
    return hashed_password.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def user_already_exists(username: str):
    user = get_user(username)
    if user:
        return True
    return False

def signup_user(username: str, password: str, email: str | None = None):
    if user_already_exists(username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists. Please login instead."
        )

    hashed_pwd = get_password_hash(password)

    user_doc = {
        "username": username,
        "email": email,
        "hashed_password": hashed_pwd,
        "disabled": False,
        "bio": None,
        "avatar": None,
        "member_since": datetime.now(timezone.utc),
    }

    users_collection.insert_one(user_doc)

    return User(
        username=username,
        email=email,
        disabled=False,
    )

def login_user(username: str, password: str) -> dict:
    user = authenticate_user(username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=access_token_expires,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

def update_user_profile(username: str, bio: str | None, avatar: str | None) -> User:
    update_data = {"$set": {}}
    if bio is not None:
        update_data["$set"]["bio"] = bio
    if avatar is not None:
        update_data["$set"]["avatar"] = avatar

    users_collection.update_one({"username": username}, update_data)

    updated = users_collection.find_one({"username": username})
    return User(
        username=updated["username"],
        email=updated.get("email"),
        disabled=updated.get("disabled"),
        bio=updated.get("bio"),
        avatar=updated.get("avatar"),
        member_since=updated.get("member_since"),
    )

def get_user_public_profile(username: str):
    user = users_collection.find_one({"username": username})
    if not user:
        return None
    return {
        "username": user["username"],
        "bio": user.get("bio"),
        "avatar": user.get("avatar"),
        "member_since": user.get("member_since"),
    }