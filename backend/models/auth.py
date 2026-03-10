from pydantic import BaseModel
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None
    bio: str | None = None
    avatar: str | None = None
    member_since: datetime | None = None


class UserInDB(User):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None
    hashed_password: str
    

class SignupRequest(BaseModel):
    username: str
    password: str
    email: str | None = None

class UpdateProfileRequest(BaseModel):
    bio: str | None = None
    avatar: str | None = None
