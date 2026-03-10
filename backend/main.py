from fastapi import FastAPI
from contextlib import asynccontextmanager
from apis.ideas import router as ideas_router
from apis.articles import router as articles_router
from apis.auth import router as auth_router
from apis.publications import router as publications_router
from apis.feed import router as feed_router
from scheduler import scheduler, publish_scheduled_articles
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.add_job(publish_scheduled_articles, "interval", minutes=1)
    scheduler.start()
    yield
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "okay"}

app.include_router(articles_router, prefix="/articles", tags=["Articles"])
app.include_router(ideas_router, prefix="/ideas", tags=["Ideas"])
app.include_router(auth_router, tags=["Authentication"])
app.include_router(publications_router, prefix="/publications", tags=["Publications"])
app.include_router(feed_router, prefix="/feed", tags=["Feed"])