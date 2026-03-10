from uuid import uuid4
from datetime import datetime, timezone
from typing import Optional

from repos.article_repo import find_article_by_id, update_article
from models.publications import PublicationInDB
from db import publications_collection


async def get_or_create_personal_publication(user_id: str, name: Optional[str] = None) -> PublicationInDB:
    """
    Returns the user's personal publication.
    Creates it if it doesn't exist.
    """

    publication = publications_collection.find_one(
        {"owner_id": user_id}
    )

    if publication:
        # Remove MongoDB's _id field if present
        pub_dict = {k: v for k, v in publication.items() if k != "_id"}
        return PublicationInDB(**pub_dict)

    publication = PublicationInDB(
        id=str(uuid4()),
        owner_id=user_id,
        name=name,
        created_at=datetime.utcnow(),
    )

    publications_collection.insert_one(publication.dict())
    return publication

async def get_publication_by_id(publication_id: str) -> PublicationInDB | None:
    data = publications_collection.find_one({"id": publication_id})
    if not data:
        return None
    # Remove MongoDB's _id field if present
    data_dict = {k: v for k, v in data.items() if k != "_id"}
    return PublicationInDB(**data_dict)

async def list_publications() -> list[PublicationInDB]:
    publications = []
    for data in publications_collection.find():
        # Remove MongoDB's _id field if present
        data_dict = {k: v for k, v in data.items() if k != "_id"}
        publications.append(PublicationInDB(**data_dict))
    return publications

async def list_publications_by_owner(owner_id: str) -> list[PublicationInDB]:
    publications = []
    for data in publications_collection.find({"owner_id": owner_id}):
        # Remove MongoDB's _id field if present
        data_dict = {k: v for k, v in data.items() if k != "_id"}
        publications.append(PublicationInDB(**data_dict))
    return publications


async def update_publication_name(publication_id: str, name: str) -> PublicationInDB:
    """Update the publication name."""
    result = publications_collection.find_one_and_update(
        {"id": publication_id},
        {"$set": {"name": name}},
        return_document=True
    )
    if not result:
        raise ValueError("Publication not found")
    
    # Remove MongoDB's _id field if present
    result_dict = {k: v for k, v in result.items() if k != "_id"}
    return PublicationInDB(**result_dict)


async def schedule_article(article_id: str, user_id: str, publish_at: datetime):
    article = find_article_by_id(article_id)

    if not article:
        raise ValueError("Article not found")
    if article.owner_id != user_id:
        raise ValueError("Not allowed")
    if article.status != "completed":
        raise ValueError("Only completed articles can be scheduled")
    if publish_at <= datetime.now(timezone.utc):
        raise ValueError("Publish time must be in the future")

    # Ensure publication exists before scheduling
    publication = await get_or_create_personal_publication(user_id)

    update_article(article_id, {
        "status": "scheduled",
        "scheduled_publish_at": publish_at,
        "publication_id": publication.id,
        "updated_at": datetime.now(timezone.utc),
    })

    article.status = "scheduled"
    article.scheduled_publish_at = publish_at
    article.publication_id = publication.id
    return article

