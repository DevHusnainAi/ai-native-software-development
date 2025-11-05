"""Chat API endpoints with pedagogical intelligence.

Enhanced with teaching methodologies from .claude/skills/:
- Returns pedagogical metadata (activated skills, proficiency level, cognitive load)
- Provides next learning steps based on user intent
- Applies evidence-based teaching strategies
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from ..services.gemini_client import get_gemini_client
from ..services.chapter_context import get_chapter_context
from ..services.session_manager import get_session_manager

router = APIRouter()


class ChatMessage(BaseModel):
    """Chat message request model."""
    message: str
    chapter_id: Optional[str] = None
    session_id: Optional[str] = None


class TeachingMetadata(BaseModel):
    """Pedagogical metadata for AI response."""
    activated_skills: List[str] = []
    ai_pattern: Optional[str] = None
    proficiency_level: str = "B1"
    cognitive_load_limit: int = 4
    next_steps: List[str] = []


class ChatResponse(BaseModel):
    """Chat response model with teaching metadata."""
    response: str
    session_id: str
    teaching_metadata: Optional[TeachingMetadata] = None


@router.post("/chat/message", response_model=ChatResponse)
async def send_message(request: ChatMessage):
    """
    Send a message to the AI agent with pedagogical enhancement.

    Args:
        request: Chat message with optional chapter context

    Returns:
        AI agent response with teaching metadata (activated skills, proficiency level, next steps)
    """
    try:
        gemini_client = get_gemini_client()

        # Get chapter context if chapter_id provided
        context = None
        if request.chapter_id:
            context = await get_chapter_context(request.chapter_id)

        # Generate or use session ID
        session_id = request.session_id or f"session-{hash(request.message) % 10000}"

        # Send message to Gemini with conversation history
        result = await gemini_client.chat(
            message=request.message,
            session_id=session_id,  # Enable conversation memory
            context=context,
            enable_teaching_mode=True  # Enable pedagogical intelligence
        )

        # Build teaching metadata
        teaching_metadata = None
        if result.get("teaching_metadata"):
            metadata = result["teaching_metadata"]
            teaching_metadata = TeachingMetadata(
                activated_skills=metadata.get("activated_skills", []),
                ai_pattern=metadata.get("ai_pattern"),
                proficiency_level=metadata.get("proficiency_level", "B1"),
                cognitive_load_limit=metadata.get("cognitive_load_limit", 4),
                next_steps=metadata.get("next_steps", [])
            )

        return ChatResponse(
            response=result["response"],
            session_id=session_id,
            teaching_metadata=teaching_metadata
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat message: {str(e)}"
        )


@router.post("/chat/init")
async def init_chat(chapter_id: Optional[str] = None):
    """
    Initialize a new chat session.

    Args:
        chapter_id: Optional chapter ID for context

    Returns:
        Session ID and welcome message
    """
    import uuid

    session_id = str(uuid.uuid4())

    # Generate welcome message if chapter context available
    welcome_message = "Hello! I'm your AI learning assistant. How can I help you today?"
    if chapter_id:
        context = await get_chapter_context(chapter_id)
        if context:
            welcome_message = f"Welcome! I'm here to help you with this chapter. What would you like to know?"

    return {
        "session_id": session_id,
        "welcome_message": welcome_message
    }


@router.get("/chat/history/{session_id}")
async def get_conversation_history(session_id: str, limit: Optional[int] = None):
    """
    Get conversation history for a session.

    Args:
        session_id: Session identifier
        limit: Optional limit on number of messages

    Returns:
        List of messages with timestamps
    """
    try:
        session_mgr = get_session_manager()
        history = session_mgr.get_conversation_history(session_id, limit=limit)

        return {
            "session_id": session_id,
            "message_count": len(history),
            "messages": history
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving conversation history: {str(e)}"
        )


@router.delete("/chat/history/{session_id}")
async def clear_conversation_history(session_id: str):
    """
    Clear conversation history for a session.

    Args:
        session_id: Session identifier

    Returns:
        Success message
    """
    try:
        session_mgr = get_session_manager()
        session_mgr.clear_session(session_id)

        return {
            "session_id": session_id,
            "status": "cleared",
            "message": "Conversation history cleared successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error clearing conversation history: {str(e)}"
        )


@router.get("/chapter/{chapter_id}/context")
async def get_chapter_context_endpoint(chapter_id: str):
    """
    Get chapter context directly.

    Args:
        chapter_id: Chapter identifier

    Returns:
        Chapter content
    """
    try:
        context = await get_chapter_context(chapter_id)
        if context is None:
            raise HTTPException(
                status_code=404,
                detail=f"Chapter {chapter_id} not found"
            )
        return {
            "chapter_id": chapter_id,
            "content": context,
            "length": len(context)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving chapter context: {str(e)}"
        )
