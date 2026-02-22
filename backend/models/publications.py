from datetime import datetime
from pydantic import BaseModel


class PublicationCreate(BaseModel):
    name: str


class PublicationInDB(BaseModel):
    id: str
    owner_id: str
    name: str | None = None
    created_at: datetime


class PublicationResponse(BaseModel):
    id: str
    name: str
