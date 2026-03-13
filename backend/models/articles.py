from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ArticleCreate(BaseModel):
    title: str 
    content: str 


class FindArticle(BaseModel):
    id: str
    
class ArticleInDB(BaseModel):
    id: str
    owner_id: str
    title: str
    content: str
    status: str
    created_at: datetime
    updated_at: datetime
    publication_id: str | None = None
    published_at: datetime | None = None
    scheduled_publish_at: Optional[datetime] = None
    publication_id: Optional[str] = None
    published_at: Optional[datetime] = None
    likes: list[str] = []
    tags: list[str] = []


class ArticleResponse(BaseModel):
    id: str
    owner_id: str
    title: str
    content: str
    status: str
    created_at: datetime
    updated_at: datetime
    publication_id: str | None = None
    published_at: datetime | None = None
    scheduled_publish_at: datetime | None = None
    likes: list[str] = []
    tags: list[str] = []

class UpdateContent(BaseModel):
    new_content: str

class UpdateTitle(BaseModel):
    new_title: str

class PublishArticle(BaseModel):
    publish_at: datetime | None = None

class AutoSaveDraft(BaseModel):
    title: str | None = None
    content: str | None = None

class UpdateTags(BaseModel):
    tags: list[str]

