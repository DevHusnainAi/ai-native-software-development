"""Session models."""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class Session(BaseModel):
    """User session model."""
    session_id: str
    user_id: Optional[str] = None
    chapter_id: Optional[str] = None
    created_at: datetime
    last_active: datetime


class SessionCreate(BaseModel):
    """Session creation model."""
    user_id: Optional[str] = None
    chapter_id: Optional[str] = None

