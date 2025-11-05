"""Health check endpoints."""
from fastapi import APIRouter
from ..config import settings

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "gemini_configured": settings.gemini_configured
    }

