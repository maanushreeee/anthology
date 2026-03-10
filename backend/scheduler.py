from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime, timezone
from email_service import send_publish_email
from repos.article_repo import find_articles_by_status, update_article
from services.publication_service import get_or_create_personal_publication
from db import users_collection

scheduler = AsyncIOScheduler()

async def publish_scheduled_articles():
    print("⏰ Scheduler running:", datetime.now(timezone.utc))
    articles = find_articles_by_status("scheduled")
    print(f"Found {len(articles)} scheduled articles")
    now = datetime.now(timezone.utc)

    for article in articles:
        if article.scheduled_publish_at:
            publish_at = article.scheduled_publish_at
            if publish_at.tzinfo is None:
                publish_at = publish_at.replace(tzinfo=timezone.utc)
            
            if publish_at <= now:
                print(f"Publishing article: {article.id}")
                publication = await get_or_create_personal_publication(article.owner_id)
                update_article(article.id, {
                    "status": "published",
                    "publication_id": publication.id,
                    "published_at": now,
                    "updated_at": now,
                })
                print(f"✅ Published article: {article.id}")

                user = users_collection.find_one({"username": article.owner_id})
                if user and user.get("email"):
                    send_publish_email(user["email"], article.owner_id, article.title)