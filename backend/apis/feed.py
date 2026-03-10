from fastapi import APIRouter, HTTPException
from repos.article_repo import find_articles_by_status, find_article_by_id
from db import users_collection

router = APIRouter()

def attach_author(article) -> dict:
    user = users_collection.find_one({"username": article.owner_id})
    return {
        "id": article.id,
        "title": article.title,
        "content": article.content,
        "published_at": article.published_at,
        "author_username": article.owner_id,
        "author_avatar": user.get("avatar") if user else None,
        "likes": article.likes or [],
    }

@router.get("/")
async def get_feed():
    articles = find_articles_by_status("published")
    articles.sort(key=lambda a: a.published_at or 0, reverse=True)
    return [attach_author(a) for a in articles]

@router.get("/{article_id}")
async def get_feed_article(article_id: str):
    article = find_article_by_id(article_id)
    if not article or article.status != "published":
        raise HTTPException(status_code=404, detail="Article not found")
    return attach_author(article)