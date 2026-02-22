from datetime import datetime
from typing import List, Optional
from uuid import uuid4

from models.articles import ArticleCreate, ArticleInDB, FindArticle
from repos.article_repo import (
    delete_article_by_id,
    find_articles_by_owner,
    insert_article,
    find_article_by_id,
    find_all_articles,
    update_article,
)
from services.publication_service import get_or_create_personal_publication

# Creation functions
async def create_idea(idea: ArticleCreate, user_id: str) -> ArticleInDB:
    now = datetime.utcnow()

    idea_in_db = ArticleInDB(
        id=str(uuid4()),
        owner_id=user_id,
        title=idea.title,
        content=idea.content,
        status='idea',
        created_at=now,
        updated_at=now,
    )

    insert_article(idea_in_db)
    return idea_in_db

async def create_article(article: ArticleCreate, user_id: str) -> ArticleInDB:
    now = datetime.utcnow()

    article_in_db = ArticleInDB(
        id=str(uuid4()),
        owner_id=user_id,
        title=article.title,
        content=article.content,
        status='draft',
        created_at=now,
        updated_at=now,
    )

    insert_article(article_in_db)
    return article_in_db

async def get_article_by_id(article_id: str) -> Optional[ArticleInDB]:
    return find_article_by_id(article_id)

async def get_articles_by_status(status: str) -> List[ArticleInDB]:
    all_articles = find_all_articles()
    return [article for article in all_articles if article.status == status]

# Listing functions
async def list_articles() -> List[ArticleInDB]:
    return find_all_articles()

async def list_articles_by_status(articles: List[ArticleInDB], status: str) -> List[ArticleInDB]:
    return [article for article in articles if article.status == status]

async def list_articles_by_owner(owner_id: str) -> List[ArticleInDB]:
    return find_articles_by_owner(owner_id)


# Update functions
async def update_article_status(article_id: str, new_status: str) -> Optional[ArticleInDB]:
    article = find_article_by_id(article_id)
    if not article:
        return None

    article.status = new_status
    article.updated_at = datetime.utcnow()
    update_article(article) 
    return article

async def complete_article(article_id: str) -> Optional[ArticleInDB]:
    article = find_article_by_id(article_id)
    if not article:
        return None
    
    update_data = {
        "status": "completed",
        "updated_at": datetime.utcnow(),
    }

    update_article(article_id, update_data)

    article.status = "completed"
    article.updated_at = datetime.utcnow()
    return article

async def convert_to_article(article_id: str) -> Optional[ArticleInDB]:
    article = find_article_by_id(article_id)
    if not article:
        return None
    
    update_data = {
        "status": "draft",
        "updated_at": datetime.utcnow(),
    }

    update_article(article_id, update_data)

    article.status = "draft"
    article.updated_at = update_data["updated_at"]
    return article


async def update_article_content(article_id: str, new_content: str) -> Optional[ArticleInDB]:
    article = find_article_by_id(article_id)
    if not article:
        return None

    update_data = {
        "content": new_content,
        "updated_at": datetime.utcnow(),
    }

    update_article(article_id, update_data)

    article.content = new_content
    article.updated_at = update_data["updated_at"]
    return article

async def update_article_title(
    article_id: str,
    new_title: str,
) -> Optional[ArticleInDB]:
    article = find_article_by_id(article_id)
    if not article:
        return None

    update_data = {
        "title": new_title,
        "updated_at": datetime.utcnow(),
    }

    update_article(article_id, update_data)

    article.title = new_title
    article.updated_at = update_data["updated_at"]

    return article

async def delete_article(article_id: str) -> bool:
    article = find_article_by_id(article_id)
    if not article:
        return False
    delete_article_by_id(article_id)
    return True

# Publish function
async def publish_article(article_id: str, user_id: str):
    # Fetch article
    article = await get_article_by_id(article_id)
    if not article:
        raise ValueError("Article not found")

    # Status check
    if article.status != "completed":
        raise ValueError("Only completed articles can be published")

    # Get or create personal publication
    publication = await get_or_create_personal_publication(user_id)

    # Update article
    update_data = {
        "status": "published",
        "publication_id": publication.id,
        "published_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    update_article(article_id, update_data)

    # Return updated article
    article.status = "published"
    article.publication_id = publication.id
    article.published_at = update_data["published_at"]
    article.updated_at = update_data["updated_at"]

    return article
