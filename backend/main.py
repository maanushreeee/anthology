from fastapi import FastAPI
import fastapi
from apis.ideas import router as ideas_router
from apis.articles import router as articles_router
from apis.auth import router as auth_router
from apis.publications import router as publications_router

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)



@app.get("/")
async def root():
    return {"status": "okay"}

# Routers
app.include_router(articles_router, prefix="/articles", tags=["Articles"])
app.include_router(ideas_router, prefix="/ideas", tags=["Ideas"])
app.include_router(auth_router, tags=["Authentication"])
app.include_router(publications_router, prefix="/publications", tags=["Publications"])