"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .api import chat, health

app = FastAPI(
    title="Agentic Interface API",
    description="Backend API for interactive agentic learning interface",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["health"])
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Agentic Interface API",
        "version": "1.0.0",
        "status": "running"
    }

