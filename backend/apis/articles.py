from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime, timezone
from dependencies.current_user import get_current_user_id
from cache import save_draft, get_draft, clear_draft

from models.articles import ArticleCreate, ArticleResponse
from services.article_service import (
    complete_article,
    create_article,
    create_idea,
    delete_article,
    get_article_by_id,
    list_articles,
    list_articles_by_owner,
    list_articles_by_status,
    publish_article,
    update_article_status,
    update_article_content,
    update_article_title,
)
from services.publication_service import schedule_article

router = APIRouter()

class UpdateContent(BaseModel):
    new_content: str

class UpdateTitle(BaseModel):
    new_title: str

class PublishArticle(BaseModel):
    publish_at: datetime | None = None

class AutoSaveDraft(BaseModel):
    title: str | None = None
    content: str | None = None

# Create endpoints
@router.post("/create-article", response_model=ArticleResponse)
async def create(article: ArticleCreate, user_id: str = Depends(get_current_user_id)):
    return await create_article(article, user_id)

# Read endpoints
@router.get("/my-draft-articles", response_model=list[ArticleResponse])
async def list_my_articles(user_id: str = Depends(get_current_user_id)):
    articles = await list_articles_by_owner(user_id)
    return [a for a in articles if a.status == "draft"]

@router.get("/my-completed-articles", response_model=list[ArticleResponse])
async def list_my_completed_articles(user_id: str = Depends(get_current_user_id)):
    articles = await list_articles_by_owner(user_id)
    return [a for a in articles if a.status == "completed"]

@router.get("/my-published-articles", response_model=list[ArticleResponse])
async def list_my_published_articles(user_id: str = Depends(get_current_user_id)):
    articles = await list_articles_by_owner(user_id)
    return [a for a in articles if a.status == "published"]

@router.get("/{article_id}/draft-info")
async def get_draft_info(article_id: str, user_id: str = Depends(get_current_user_id)):
    """Check if there's an auto-saved draft for this article"""
    article = await get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    if article.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this article")
    
    draft = await get_draft(user_id, article_id)
    if draft:
        return {"has_draft": True, "draft": draft}
    return {"has_draft": False, "draft": None}

@router.get("/{article_id}", response_model=ArticleResponse)
async def get_one(article_id: str):
    article = await get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.get("/owner/{owner_id}", response_model=list[ArticleResponse])
async def get_articles_by_owner(owner_id: str = Depends(get_current_user_id)):
    print("Owner ID:", owner_id)
    return await list_articles_by_owner(owner_id)

@router.get("/{owner_id}/status/{status}", response_model=list[ArticleResponse])
async def get_articles_by_owner_and_status(owner_id: str = Depends(get_current_user_id), status: str = None):
    all_articles = await list_articles_by_owner(owner_id)
    filtered_articles = await list_articles_by_status(all_articles, status)
    return filtered_articles


# Update endpoints
@router.patch("/{article_id}/complete", response_model=ArticleResponse)
async def update_status(article_id: str, user_id: str = Depends(get_current_user_id)):
    article = await get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    if article.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this article")

    updated_article = await complete_article(article_id)
    return updated_article

@router.patch("/{article_id}/update-content", response_model=ArticleResponse)
async def update_content(article_id: str, payload: UpdateContent, user_id: str = Depends(get_current_user_id)):
    article = await get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    if article.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this article")

    updated_article = await update_article_content(article_id, payload.new_content)
    
    # Clear auto-save draft after successful save
    await clear_draft(user_id, article_id)
    
    return updated_article

@router.patch("/{article_id}/update-title", response_model=ArticleResponse)
async def update_title(article_id: str, payload: UpdateTitle, user_id: str = Depends(get_current_user_id)):    
    article = await get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    if article.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this article")

    updated_article = await update_article_title(article_id, payload.new_title)
    
    # Clear auto-save draft after successful save
    await clear_draft(user_id, article_id)
    
    return updated_article

# Auto-save endpoint
@router.post("/{article_id}/auto-save")
async def auto_save_article(
    article_id: str,
    payload: AutoSaveDraft,
    user_id: str = Depends(get_current_user_id),
):
    """Auto-save article draft to Redis (non-blocking)"""
    article = await get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    if article.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to auto-save this article")
    
    # Save to Redis
    result = await save_draft(user_id, article_id, payload.title, payload.content)
    return result

@router.post("/{article_id}/publish")
async def publish_article_endpoint(
    article_id: str,
    payload: PublishArticle,
    user_id: str = Depends(get_current_user_id),
):
    article = await get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    if article.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to publish this article")
    
    # If publish_at is provided and in the future, schedule it
    if payload.publish_at and payload.publish_at > datetime.now(timezone.utc):
        return await schedule_article(article_id, user_id, payload.publish_at)
    
    # Otherwise publish immediately
    return await publish_article(article_id, user_id)

# Delete endpoints
@router.delete("/{article_id}")
async def delete_article_endpoint(article_id: str, user_id: str = Depends(get_current_user_id)):
    article = await get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    if article.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this article")
    
    success = await delete_article(article_id)
    if not success:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"detail": "Article deleted successfully"}