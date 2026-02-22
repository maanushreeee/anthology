from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from models.articles import ArticleResponse
from services.article_service import list_articles_by_owner, get_article_by_id
from dependencies.current_user import get_current_user_id

from models.publications import PublicationResponse
from services.publication_service import (
    schedule_article,
    list_publications_by_owner,
    get_publication_by_id,
    get_or_create_personal_publication,
    update_publication_name,
)
from datetime import datetime

router = APIRouter()

class CreatePublication(BaseModel):
    name: str

class UpdatePublicationName(BaseModel):
    name: str

class ScheduleArticle(BaseModel):
    publish_at: datetime

@router.post("/create", response_model=PublicationResponse)
async def create_publication(
    payload: CreatePublication,
    user_id: str = Depends(get_current_user_id),
):
    publication = await get_or_create_personal_publication(user_id, payload.name)
    return publication

@router.patch("/{publication_id}/update-name", response_model=PublicationResponse)
async def update_publication_name_endpoint(
    publication_id: str,
    payload: UpdatePublicationName,
    user_id: str = Depends(get_current_user_id),
):
    publication = await get_publication_by_id(publication_id)
    if not publication:
        raise HTTPException(status_code=404, detail="Publication not found")
    if publication.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this publication")
    
    updated_publication = await update_publication_name(publication_id, payload.name)
    return updated_publication

@router.get("/my-publications", response_model=list[PublicationResponse])
async def list_my_publications(user_id: str = Depends(get_current_user_id)):
    publications = await list_publications_by_owner(user_id)
    return publications

@router.get("/{publication_id}", response_model=PublicationResponse)
async def get_publication(publication_id: str):
    publication = await get_publication_by_id(publication_id)
    if not publication:
        raise HTTPException(status_code=404, detail="Publication not found")
    return publication


@router.get("/{owner_id}/publications", response_model=list[PublicationResponse])
async def list_publications_by_ownerid(
    owner_id: str,
):
    return await list_publications_by_owner(owner_id)

@router.post("/{article_id}/schedule")
async def schedule_publish(
    article_id: str,
    payload: ScheduleArticle,
    user_id: str = Depends(get_current_user_id),
):
    article = await get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    if article.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to schedule this article")
    
    return await schedule_article(article_id, user_id, payload.publish_at)