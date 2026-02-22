from fastapi import APIRouter, Depends, HTTPException
from models.articles import ArticleCreate, ArticleResponse
from services.article_service import (
    convert_to_article,
    create_idea,
    list_articles_by_owner,
    update_article_content,
    get_article_by_id,
    update_article_title,
)
from dependencies.current_user import get_current_user_id
from pydantic import BaseModel

router = APIRouter()

class UpdateIdea(BaseModel):
    content: str

class UpdateTitle(BaseModel):
    new_title: str

@router.post("/create-idea", response_model=ArticleResponse)
async def create_idea_endpoint(idea: ArticleCreate, user_id: str = Depends(get_current_user_id)):
    return await create_idea(idea, user_id)

@router.get("/", response_model=list[ArticleResponse])
async def list_all_ideas(user_id: str = Depends(get_current_user_id)):
    articles = await list_articles_by_owner(user_id)
    return [a for a in articles if a.status == "idea"]

@router.get("/my-ideas", response_model=list[ArticleResponse])
async def list_my_ideas(user_id: str = Depends(get_current_user_id)):
    articles = await list_articles_by_owner(user_id)
    return [a for a in articles if a.status == "idea"]

@router.patch("/{idea_id}/update-content", response_model=ArticleResponse)
async def update_idea(idea_id: str, payload: UpdateIdea, user_id: str = Depends(get_current_user_id)):
    article = await get_article_by_id(idea_id)
    if not article or article.status != "idea":
        raise HTTPException(status_code=404, detail="Idea not found")
    if article.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this idea")

    return await update_article_content(idea_id, payload.content)

@router.patch("/{idea_id}/update-title", response_model=ArticleResponse)
async def update_title(idea_id: str, payload: UpdateTitle, user_id: str = Depends(get_current_user_id)):    
    article = await get_article_by_id(idea_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    if article.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this idea")

    updated_article = await update_article_title(idea_id, payload.new_title)
    return updated_article

@router.patch("/{article_id}/convert-to-article", response_model=ArticleResponse)
async def update_status(article_id: str, user_id: str = Depends(get_current_user_id)):
    article = await get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    updated_article = await convert_to_article(article_id)
    return updated_article
