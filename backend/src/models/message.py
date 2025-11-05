"""Chat message models."""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ChatMessage(BaseModel):
    """Chat message model."""
    id: str
    session_id: str
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime
    tool_calls: Optional[list] = None


class MessageCreate(BaseModel):
    """Message creation model."""
    session_id: str
    role: str
    content: str
    tool_calls: Optional[list] = None

