from fastapi import APIRouter, HTTPException, Depends, Query
from repos.article_repo import find_articles_by_status, find_article_by_id
from db import users_collection
from dependencies.current_user import get_optional_user_id

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
        "tags": article.tags or [],
    }

@router.get("/")
async def get_feed(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=9, ge=1, le=50),
    tag: str | None = Query(default=None),
    current_username: str | None = Depends(get_optional_user_id),
):
    articles = find_articles_by_status("published")
    print(f"Total published articles in DB: {len(articles)}")

    articles.sort(key=lambda a: a.published_at or 0, reverse=True)

    filtered = [a for a in articles if a.owner_id != current_username]
    print(f"After filtering out '{current_username}': {len(filtered)}")

    if tag:
        filtered = [a for a in filtered if tag in (a.tags or [])]
        print(f"After tag filter '{tag}': {len(filtered)}")

    total = len(filtered)
    paginated = filtered[skip: skip + limit]
    print(f"skip={skip} limit={limit} → returning {len(paginated)} articles")

    return {
        "total": total,
        "articles": [attach_author(a) for a in paginated],
    }

@router.get("/{article_id}")
async def get_feed_article(article_id: str):
    article = find_article_by_id(article_id)
    if not article or article.status != "published":
        raise HTTPException(status_code=404, detail="Article not found")
    return attach_author(article)