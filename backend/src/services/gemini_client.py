"""Gemini AI client using OpenAI SDK with Gemini endpoint.

Enhanced with pedagogical intelligence from .claude/skills/ library:
- Detects user learning intent (explainer, debugger, code_reviewer, etc.)
- Applies appropriate teaching methodologies based on proficiency level (CEFR A1-C2)
- Manages cognitive load (max 2-5 new concepts based on proficiency)
- Uses evidence-based learning strategies (Bloom's taxonomy, CLT, etc.)
"""
from openai import AsyncOpenAI
from typing import Optional, Dict, Any, List

from ..config import settings
from .teaching_context import get_teaching_context
from .session_manager import get_session_manager


class GeminiClient:
    """Client for interacting with Gemini via OpenAI SDK."""

    def __init__(self):
        """Initialize Gemini client with OpenAI-compatible endpoint."""
        if not settings.gemini_configured:
            raise ValueError("GEMINI_API_KEY not configured")

        # Create AsyncOpenAI client pointing to Gemini endpoint
        self.client = AsyncOpenAI(
            api_key=settings.GEMINI_API_KEY,
            base_url=settings.GEMINI_BASE_URL,
        )

    async def chat(
        self,
        message: str,
        session_id: Optional[str] = None,
        context: Optional[str] = None,
        tools: Optional[list] = None,
        enable_teaching_mode: bool = True,
        max_history: int = 10
    ) -> Dict[str, Any]:
        """
        Send a chat message to Gemini with pedagogical enhancement and conversation history.

        Implements OpenAI Agents SDK session pattern:
        1. Retrieves conversation history from session
        2. Prepends history to current message
        3. Sends to AI with full context
        4. Stores both user message and AI response

        Args:
            message: User message
            session_id: Session ID for conversation context (required for history)
            context: Optional chapter context to include
            tools: Optional function calling tools
            enable_teaching_mode: Apply pedagogical intelligence (default True)
            max_history: Maximum number of previous messages to include (default 10)

        Returns:
            Dict with:
                - response: AI response text
                - teaching_metadata: Pedagogical context (skills activated, proficiency, etc.)
        """
        teaching_ctx = get_teaching_context()
        session_mgr = get_session_manager()
        teaching_metadata = {}

        # Detect pedagogical intent if teaching mode enabled
        if enable_teaching_mode:
            intent = teaching_ctx.detect_user_intent(message)
            teaching_metadata = {
                "activated_skills": intent["activated_skills"],
                "ai_pattern": intent["ai_pattern"],
                "proficiency_level": intent["proficiency_level"],
                "cognitive_load_limit": teaching_ctx.PROFICIENCY_LEVELS[intent["proficiency_level"]]["max_new_concepts"],
                "next_steps": teaching_ctx.suggest_next_steps(intent)
            }

            # Build pedagogically-enhanced system prompt
            system_prompt = teaching_ctx.build_system_prompt(context, intent)
        else:
            # Fallback to simple system prompt
            system_prompt = "You are a helpful AI learning assistant."
            if context:
                system_prompt += f"\n\nUse the following chapter context to answer questions accurately:\n\n{context}"

        # Build messages with conversation history (if session_id provided)
        if session_id:
            # Use session manager to build messages with history
            messages = session_mgr.build_messages_with_history(
                session_id=session_id,
                current_message=message,
                system_prompt=system_prompt,
                max_history=max_history
            )
        else:
            # No session - stateless request
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ]

        # Prepare request
        request_params = {
            "model": settings.GEMINI_MODEL,
            "messages": messages,
            "temperature": 0.7,
        }

        # Add tools if provided
        if tools:
            request_params["tools"] = tools

        # Call Gemini API
        response = await self.client.chat.completions.create(**request_params)

        # Extract response text
        response_text = ""
        if response.choices and len(response.choices) > 0:
            response_text = response.choices[0].message.content or "Sorry, I couldn't generate a response."
        else:
            response_text = "Sorry, I couldn't generate a response."

        # Store conversation in session (if session_id provided)
        if session_id:
            # Store user message
            session_mgr.add_message(
                session_id=session_id,
                role="user",
                content=message
            )

            # Store assistant response with teaching metadata
            session_mgr.add_message(
                session_id=session_id,
                role="assistant",
                content=response_text,
                teaching_metadata=teaching_metadata if teaching_metadata else None
            )

        return {
            "response": response_text,
            "teaching_metadata": teaching_metadata
        }

    def chat_sync(
        self,
        message: str,
        context: Optional[str] = None
    ) -> str:
        """
        Synchronous version of chat (for testing).

        Args:
            message: User message
            context: Optional chapter context

        Returns:
            AI response text
        """
        import asyncio

        # Run async version
        try:
            loop = asyncio.get_event_loop()
            return loop.run_until_complete(self.chat(message, context))
        except RuntimeError:
            # If no event loop exists, create one
            return asyncio.run(self.chat(message, context))


# Singleton instance
_gemini_client: Optional[GeminiClient] = None


def get_gemini_client() -> GeminiClient:
    """Get or create Gemini client instance."""
    global _gemini_client
    if _gemini_client is None:
        _gemini_client = GeminiClient()
    return _gemini_client
