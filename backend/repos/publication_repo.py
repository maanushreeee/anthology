from typing import List, Optional

from db import publications_collection
from models.publications import ArticleInDB


def find_publication_by_id(publication_id: str) -> Optional[ArticleInDB]:
    data = publications_collection.find_one({"id": publication_id})
    if not data:
        return None
    return ArticleInDB(**data)

def find_all_publications() -> List[ArticleInDB]:
    publications = []
    for data in publications_collection.find():
        publications.append(ArticleInDB(**data))
    return publications

def find_publications_by_owner(owner_id: str) -> List[ArticleInDB]:
    publications = []
    for data in publications_collection.find({"owner_id": owner_id}):
        publications.append(ArticleInDB(**data))
    return publications

def delete_publication_by_id(publication_id: str) -> None:
    publications_collection.delete_one({"id": publication_id})