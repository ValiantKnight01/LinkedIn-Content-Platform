import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import connect_db, disconnect_db
from .routes import themes, posts
from .utils.security import verify_api_key


@asynccontextmanager
async def lifespan(app: FastAPI):
    connect_db()
    yield
    disconnect_db()


app = FastAPI(title="PostGenerator API", version="0.1.0", lifespan=lifespan)

# Configure CORS
allowed_origin = os.getenv("CORS_ALLOWED_DOMAINS")
allowed_origins = [allowed_origin] if allowed_origin else []

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(themes.router, dependencies=[Depends(verify_api_key)])
app.include_router(posts.router, dependencies=[Depends(verify_api_key)])


@app.get("/")
async def root():
    return {"status": "ok", "message": "PostGenerator API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
