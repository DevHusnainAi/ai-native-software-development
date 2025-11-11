"""ChatKit session management - Simplified version for React + Tailwind integration.

This module provides endpoints for ChatKit frontend integration:
- Session creation with JWT-based authentication
- Message handling that routes to existing Gemini chat logic
- No OpenAI Agents SDK required - pure JWT implementation
"""

import uuid
from datetime import datetime, timedelta
from typing import Optional

import jwt
from fastapi import APIRouter, Body, HTTPException
from pydantic import BaseModel

from ..config import settings

router = APIRouter()


class SessionRequest(BaseModel):
    """ChatKit session creation request."""

    chapter_id: Optional[str] = None


class SessionResponse(BaseModel):
    """ChatKit session response with client secret."""

    client_secret: str
    expires_in: int
    session_id: str


class MessageRequest(BaseModel):
    """ChatKit message request."""

    message: str
    client_secret: str
    chapter_id: Optional[str] = None


class MessageResponse(BaseModel):
    """ChatKit message response."""

    response: str
    session_id: str


@router.post("/chatkit/session", response_model=SessionResponse)
async def create_chatkit_session(request: SessionRequest):
    """
    Generate ChatKit client secret for frontend authentication.

    This creates a JWT token that the frontend uses to authenticate
    with the chat backend. The token includes:
    - Unique session ID for conversation continuity
    - Optional chapter ID for contextual learning
    - Expiration time (1 hour)

    Args:
        request: Session request with optional chapter_id

    Returns:
        Client secret (JWT token), expiration time, and session ID

    Raises:
        HTTPException: If session creation fails
    """
    try:
        # Generate unique session ID
        session_id = str(uuid.uuid4())

        # Create JWT payload
        payload = {
            "session_id": session_id,
            "chapter_id": request.chapter_id,
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
        }

        # Sign token using GEMINI_API_KEY as secret (first 32 chars for consistency)
        secret_key = settings.GEMINI_API_KEY[:32]
        client_secret = jwt.encode(payload, secret_key, algorithm="HS256")

        return SessionResponse(
            client_secret=client_secret,
            expires_in=3600,  # 1 hour in seconds
            session_id=session_id,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to create ChatKit session: {str(e)}"
        )


@router.post("/chatkit/message", response_model=MessageResponse)
async def chatkit_message(request: MessageRequest):
    """
    Handle ChatKit messages and route to existing Gemini chat logic.

    This endpoint:
    1. Verifies the client secret (JWT token)
    2. Extracts session and chapter context
    3. Routes to your existing Gemini chat service
    4. Returns AI response in ChatKit-compatible format

    Args:
        request: Message request with text, client secret, and optional chapter_id

    Returns:
        AI response text and session ID

    Raises:
        HTTPException: If token is invalid/expired or message processing fails
    """
    try:
        # Verify and decode JWT token
        secret_key = settings.GEMINI_API_KEY[:32]
        payload = jwt.decode(request.client_secret, secret_key, algorithms=["HS256"])

        # Extract session context
        session_id = payload.get("session_id")
        chapter_id = request.chapter_id or payload.get("chapter_id")

        # Use existing chat services
        from ..services.chapter_context import get_chapter_context
        from ..services.gemini_client import get_gemini_client

        # Get Gemini client
        client = get_gemini_client()

        # Get chapter context if available
        context = await get_chapter_context(chapter_id) if chapter_id else None

        # Send message to Gemini with full pedagogical intelligence
        result = await client.chat(
            message=request.message,
            session_id=session_id,
            context=context,
            enable_teaching_mode=True,  # Activates teaching metadata
        )

        return MessageResponse(response=result["response"], session_id=session_id)

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Session expired. Please refresh the page to create a new session.",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401, detail="Invalid session token. Please refresh the page."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing message: {str(e)}"
        )


@router.get("/chatkit/health")
async def chatkit_health():
    """
    Health check endpoint for ChatKit integration.

    Returns:
        Status and configuration info
    """
    return {
        "status": "healthy",
        "service": "chatkit",
        "gemini_configured": settings.gemini_configured,
        "version": "1.0.0",
    }
