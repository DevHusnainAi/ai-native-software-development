# Session Management: Conversation Context System

The backend now maintains **full conversation context** across multiple turns, following the [OpenAI Agents SDK session pattern](https://openai.github.io/openai-agents-python/sessions/).

---

## 🎯 Problem Solved

**Before**: Each request was stateless - the agent had no memory of previous messages.

**After**: The agent maintains conversation history and remembers context across the entire session.

---

## 🏗️ Architecture

### **1. Session Manager (`session_manager.py`)**

**Purpose**: SQLite-based storage for conversation history

**Database Schema**:
```sql
CREATE TABLE conversation_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,  -- 'user' or 'assistant'
    content TEXT NOT NULL,
    teaching_metadata TEXT,  -- JSON pedagogical metadata
    timestamp TEXT NOT NULL
)
```

**Key Methods**:
- `get_conversation_history(session_id, limit)`: Retrieve history
- `add_message(session_id, role, content, teaching_metadata)`: Store message
- `build_messages_with_history(session_id, current_message, system_prompt, max_history)`: Build API request with history
- `clear_session(session_id)`: Delete all messages
- `session_exists(session_id)`: Check if session has messages

---

### **2. Enhanced Gemini Client (`gemini_client.py`)**

**OpenAI Agents SDK Pattern**:
1. **Pre-run retrieval**: Automatically retrieves conversation history
2. **Prepends to current**: Adds history before current message
3. **Post-run storage**: Stores both user message and AI response

**Implementation**:
```python
# Before sending to API
messages = session_mgr.build_messages_with_history(
    session_id=session_id,
    current_message=message,
    system_prompt=system_prompt,
    max_history=10  # Last 10 messages
)

# After receiving response
session_mgr.add_message(session_id, "user", message)
session_mgr.add_message(session_id, "assistant", response, metadata)
```

---

### **3. Chat API Endpoints (`chat.py`)**

**New Endpoints**:

#### `GET /api/v1/chat/history/{session_id}`
Get conversation history for a session.

**Response**:
```json
{
  "session_id": "abc-123",
  "message_count": 5,
  "messages": [
    {
      "role": "user",
      "content": "What is a Python variable?",
      "timestamp": "2025-01-01T12:00:00"
    },
    {
      "role": "assistant",
      "content": "A variable is a named container...",
      "timestamp": "2025-01-01T12:00:05",
      "teaching_metadata": {
        "activated_skills": ["technical-clarity"],
        "proficiency_level": "A1"
      }
    }
  ]
}
```

#### `DELETE /api/v1/chat/history/{session_id}`
Clear conversation history for a session.

**Response**:
```json
{
  "session_id": "abc-123",
  "status": "cleared",
  "message": "Conversation history cleared successfully"
}
```

---

## 🔄 Conversation Flow

### **Multi-Turn Example**

**Turn 1**:
```
User: "What is a Python list?"
Agent: "A list is an ordered collection of items..."
```
✅ Stored in SQLite: `session-123`

**Turn 2**:
```
User: "How do I add items to it?"
```

**What happens**:
1. Session manager retrieves Turn 1 (user + assistant)
2. Builds messages array: `[system, turn1_user, turn1_assistant, turn2_user]`
3. Sends to Gemini API with full context
4. Agent responds: "You can add items using .append()... **As I mentioned**, a list is..."
5. Stores Turn 2 (user + assistant)

✅ Agent remembers context from Turn 1!

**Turn 3**:
```
User: "Show me an example"
```

**What happens**:
1. Retrieves Turn 1 + Turn 2 (4 messages)
2. Builds messages: `[system, turn1_user, turn1_assistant, turn2_user, turn2_assistant, turn3_user]`
3. Agent responds with example relevant to previous conversation
4. Stores Turn 3

✅ Full conversation context maintained!

---

## 📊 Storage Details

### **Database Location**
- Path: `backend/sessions.db` (SQLite)
- Auto-created on first use
- Persistent across server restarts

### **Message Limit**
- Default: Last 10 messages per session (5 turns)
- Configurable via `max_history` parameter
- Prevents context window overflow

### **Teaching Metadata Storage**
- Stored as JSON in `teaching_metadata` column
- Includes: activated skills, proficiency level, AI pattern, next steps
- Retrievable for analytics/debugging

---

## 🧪 Testing Multi-Turn Conversations

### **Start Backend**
```bash
cd backend
python -m uvicorn src.main:app --reload --port 8000
```

### **Test Conversation Context**

**Turn 1**:
```bash
curl -X POST http://localhost:8000/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is a Python variable?",
    "session_id": "test-session-123"
  }'

# Response: "A variable is a named container that stores a value..."
```

**Turn 2** (reference to previous context):
```bash
curl -X POST http://localhost:8000/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I create one?",
    "session_id": "test-session-123"
  }'

# Expected: Agent understands "one" = variable (from Turn 1 context)
# Response: "To create a variable in Python, you assign a value using =..."
```

**Turn 3** (further reference):
```bash
curl -X POST http://localhost:8000/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Show me an example",
    "session_id": "test-session-123"
  }'

# Expected: Agent provides variable example (remembers topic)
# Response: "Here's an example of creating a variable: name = 'Alice'"
```

### **Check Conversation History**
```bash
curl -X GET http://localhost:8000/api/v1/chat/history/test-session-123

# Returns all 3 turns with timestamps and metadata
```

### **Clear Session**
```bash
curl -X DELETE http://localhost:8000/api/v1/chat/history/test-session-123

# Clears all messages for test-session-123
```

---

## 🎓 Pedagogical Benefits

### **Enables Natural Teaching Conversations**

**Without context** (stateless):
```
User: "What is OOP?"
Agent: "Object-Oriented Programming is..."

User: "How do I use it in Python?"
Agent: "To use object-oriented programming in Python..." (repeats definition)
```

**With context** (session-based):
```
User: "What is OOP?"
Agent: "Object-Oriented Programming is..."

User: "How do I use it in Python?"
Agent: "To use OOP in Python, you define classes. Let me build on what we just discussed about objects..."
```

### **Supports Scaffolded Learning**

The agent can:
- Reference previous explanations
- Build progressively on concepts
- Recall student's proficiency level across turns
- Maintain continuity in exercises and examples

### **Enables Socratic Dialogue**

```
User: "I'm confused about decorators"
Agent: "What part is confusing? Is it the syntax or how they modify behavior?"

User: "How they modify behavior"
Agent: "Great! Let's focus on that. Remember when we discussed functions as objects earlier? Decorators use that concept..."
```

---

## 🔐 Session ID Best Practices

### **Frontend Implementation**

**Initialize session once**:
```typescript
// On component mount or chapter load
const initSession = async () => {
  const response = await fetch('/api/v1/chat/init', {
    method: 'POST',
    body: JSON.stringify({ chapter_id: chapterId })
  });
  const { session_id } = await response.json();
  setSessionId(session_id);  // Store in state
};
```

**Use same session for all messages**:
```typescript
const sendMessage = async (message: string) => {
  const response = await fetch('/api/v1/chat/message', {
    method: 'POST',
    body: JSON.stringify({
      message,
      session_id: sessionId,  // Same session for entire conversation
      chapter_id: chapterId
    })
  });
};
```

**Clear session when needed**:
```typescript
const resetConversation = async () => {
  await fetch(`/api/v1/chat/history/${sessionId}`, {
    method: 'DELETE'
  });
  // Optionally init new session
  await initSession();
};
```

---

## 📈 Performance Considerations

### **Message Limit**
- Default: 10 messages (5 turns)
- Prevents context window overflow (Gemini has ~1M token limit, but best practice is < 10k tokens)
- Older messages automatically excluded

### **Storage**
- SQLite is lightweight and fast
- Indexed by `session_id` for quick retrieval
- No external dependencies (Redis, PostgreSQL)

### **Context Window Management**
```
System Prompt: ~500 tokens
Chapter Context: ~5,000 tokens (limited to 50k chars)
Conversation History: ~1,000 tokens (10 messages)
Current Message: ~100 tokens
Total: ~6,600 tokens (well within limits)
```

---

## 🚀 Future Enhancements

1. **Session Expiry**: Auto-delete sessions older than X days
2. **User Profiles**: Link sessions to user accounts
3. **Session Branching**: Fork conversations at any point
4. **Analytics**: Track teaching effectiveness across sessions
5. **Export**: Download conversation history as markdown/PDF
6. **Compressed Storage**: Use embeddings for older messages to save space

---

## 📖 API Reference

### **POST /api/v1/chat/message**
Send message with conversation context.

**Request**:
```json
{
  "message": "What is a variable?",
  "session_id": "abc-123",  // Required for context
  "chapter_id": "preface-agent-native"
}
```

**Response**:
```json
{
  "response": "A variable is...",
  "session_id": "abc-123",
  "teaching_metadata": {
    "activated_skills": ["technical-clarity"],
    "ai_pattern": "explainer",
    "proficiency_level": "A1",
    "cognitive_load_limit": 2,
    "next_steps": [...]
  }
}
```

### **GET /api/v1/chat/history/{session_id}**
Retrieve conversation history.

**Parameters**:
- `session_id` (path): Session identifier
- `limit` (query, optional): Max number of messages

**Response**:
```json
{
  "session_id": "abc-123",
  "message_count": 5,
  "messages": [
    {
      "role": "user",
      "content": "...",
      "timestamp": "2025-01-01T12:00:00"
    },
    {
      "role": "assistant",
      "content": "...",
      "timestamp": "2025-01-01T12:00:05",
      "teaching_metadata": {...}
    }
  ]
}
```

### **DELETE /api/v1/chat/history/{session_id}**
Clear conversation history.

**Response**:
```json
{
  "session_id": "abc-123",
  "status": "cleared",
  "message": "Conversation history cleared successfully"
}
```

---

## 🔗 References

- [OpenAI Agents SDK - Sessions](https://openai.github.io/openai-agents-python/sessions/)
- `backend/src/services/session_manager.py`: Session storage implementation
- `backend/src/services/gemini_client.py`: Integration with Gemini API
- `backend/src/api/chat.py`: REST API endpoints
- `backend/PEDAGOGICAL_INTEGRATION.md`: Teaching methodologies

---

**Result**: The AI agent now maintains full conversation context, enabling natural multi-turn teaching conversations with continuity and coherence! 🎓💬
