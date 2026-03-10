from typing import List, Optional

from db import articles_collection
from models.articles import ArticleInDB


def insert_article(article: ArticleInDB) -> None:
    articles_collection.insert_one(article.model_dump())

def find_article_by_id(article_id: str) -> Optional[ArticleInDB]:
    data = articles_collection.find_one({"id": article_id})
    if not data:
        return None
    return ArticleInDB(**data)

def find_all_articles() -> List[ArticleInDB]:
    articles = []
    for data in articles_collection.find():
        articles.append(ArticleInDB(**data))
    return articles

def find_articles_by_owner(owner_id: str) -> List[ArticleInDB]:
    articles = []
    for data in articles_collection.find({"owner_id": owner_id}):
        articles.append(ArticleInDB(**data))
    return articles

def update_article(article_id: str, update_data: dict | None) -> None:
    articles_collection.update_one({"id": article_id}, {"$set": update_data})

def find_articles_by_status(status: str) -> List[ArticleInDB]:
    articles = []
    for data in articles_collection.find({"status": status}):
        articles.append(ArticleInDB(**data))
    return articles

def delete_article_by_id(article_id: str) -> None:
    articles_collection.delete_one({"id": article_id})

def add_like(article_id: str, username: str) -> None:
    articles_collection.update_one(
        {"id": article_id},
        {"$addToSet": {"likes": username}}
    )

def remove_like(article_id: str, username: str) -> None:
    articles_collection.update_one(
        {"id": article_id},
        {"$pull": {"likes": username}}
    )