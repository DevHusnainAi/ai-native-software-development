"""Session management for maintaining conversation context.

Implements session-based conversation history similar to OpenAI Agents SDK:
- Automatically retrieves conversation history before each message
- Automatically persists new messages after each response
- Supports SQLite-based storage for persistence
- Enables multi-turn conversations with full context

Reference: https://openai.github.io/openai-agents-python/sessions/
"""

import sqlite3
import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime
import os


class SessionManager:
    """Manages conversation sessions with SQLite storage."""

    def __init__(self, db_path: Optional[str] = None):
        """
        Initialize session manager.

        Args:
            db_path: Path to SQLite database file. If None, uses backend/sessions.db
        """
        if db_path is None:
            # Default to backend/sessions.db
            backend_dir = Path(__file__).parent.parent.parent
            db_path = backend_dir / "sessions.db"

        self.db_path = str(db_path)
        self._init_database()

    def _init_database(self):
        """Create sessions table if it doesn't exist."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS conversation_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                teaching_metadata TEXT,
                timestamp TEXT NOT NULL,
                UNIQUE(session_id, id)
            )
        """)

        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_session_id
            ON conversation_history(session_id)
        """)

        conn.commit()
        conn.close()

    def get_conversation_history(
        self,
        session_id: str,
        limit: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Retrieve conversation history for a session.

        Args:
            session_id: Session identifier
            limit: Optional limit on number of messages to retrieve (most recent)

        Returns:
            List of messages in chronological order
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        if limit:
            cursor.execute("""
                SELECT role, content, teaching_metadata, timestamp
                FROM conversation_history
                WHERE session_id = ?
                ORDER BY id DESC
                LIMIT ?
            """, (session_id, limit))

            # Reverse to get chronological order
            rows = cursor.fetchall()[::-1]
        else:
            cursor.execute("""
                SELECT role, content, teaching_metadata, timestamp
                FROM conversation_history
                WHERE session_id = ?
                ORDER BY id ASC
            """, (session_id,))

            rows = cursor.fetchall()

        conn.close()

        # Convert to list of dicts
        messages = []
        for role, content, metadata_json, timestamp in rows:
            message = {
                "role": role,
                "content": content,
                "timestamp": timestamp
            }

            if metadata_json:
                try:
                    message["teaching_metadata"] = json.loads(metadata_json)
                except json.JSONDecodeError:
                    pass

            messages.append(message)

        return messages

    def add_message(
        self,
        session_id: str,
        role: str,
        content: str,
        teaching_metadata: Optional[Dict[str, Any]] = None
    ):
        """
        Add a message to conversation history.

        Args:
            session_id: Session identifier
            role: Message role ('user' or 'assistant')
            content: Message content
            teaching_metadata: Optional pedagogical metadata
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        metadata_json = None
        if teaching_metadata:
            metadata_json = json.dumps(teaching_metadata)

        timestamp = datetime.utcnow().isoformat()

        cursor.execute("""
            INSERT INTO conversation_history (session_id, role, content, teaching_metadata, timestamp)
            VALUES (?, ?, ?, ?, ?)
        """, (session_id, role, content, metadata_json, timestamp))

        conn.commit()
        conn.close()

    def clear_session(self, session_id: str):
        """
        Clear all messages for a session.

        Args:
            session_id: Session identifier
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            DELETE FROM conversation_history
            WHERE session_id = ?
        """, (session_id,))

        conn.commit()
        conn.close()

    def get_message_count(self, session_id: str) -> int:
        """
        Get number of messages in a session.

        Args:
            session_id: Session identifier

        Returns:
            Message count
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT COUNT(*) FROM conversation_history
            WHERE session_id = ?
        """, (session_id,))

        count = cursor.fetchone()[0]
        conn.close()

        return count

    def build_messages_with_history(
        self,
        session_id: str,
        current_message: str,
        system_prompt: str,
        max_history: int = 10
    ) -> List[Dict[str, str]]:
        """
        Build messages array with conversation history for API call.

        This implements the OpenAI Agents SDK pattern:
        1. Retrieve conversation history
        2. Prepend to current message
        3. Include system prompt

        Args:
            session_id: Session identifier
            current_message: Current user message
            system_prompt: System prompt to use
            max_history: Maximum number of previous messages to include

        Returns:
            List of messages ready for API call: [system, history..., current]
        """
        # Get conversation history (limit to max_history)
        history = self.get_conversation_history(session_id, limit=max_history)

        # Build messages array
        messages = [{"role": "system", "content": system_prompt}]

        # Add conversation history
        for msg in history:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })

        # Add current user message
        messages.append({
            "role": "user",
            "content": current_message
        })

        return messages

    def session_exists(self, session_id: str) -> bool:
        """
        Check if a session has any messages.

        Args:
            session_id: Session identifier

        Returns:
            True if session has messages, False otherwise
        """
        return self.get_message_count(session_id) > 0


# Singleton instance
_session_manager: Optional[SessionManager] = None


def get_session_manager() -> SessionManager:
    """Get or create session manager instance."""
    global _session_manager
    if _session_manager is None:
        _session_manager = SessionManager()
    return _session_manager
