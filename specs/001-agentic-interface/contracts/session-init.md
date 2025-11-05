# API Contract: Initialize Chat Session

**Endpoint**: `POST /api/v1/chat/init`

**Purpose**: Initialize a new chat session and receive a welcome message contextual to the current chapter.

---

## Request

### HTTP Method
`POST`

### URL
```
POST /api/v1/chat/init
```

### Headers
```
Content-Type: application/json
```

### Request Body Schema

```json
{
  "chapter_id": "string (optional, pattern: \\d{2}-[a-z0-9-]+)"
}
```

### Request Body Example

```json
{
  "chapter_id": "13-type-hints-and-annotations"
}
```

### Field Descriptions

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `chapter_id` | string | No | Matches `\d{2}-[a-z-]+` | Current chapter ID for contextual welcome |

### Validation Rules

- `chapter_id`:
  - **Optional**: Can be null or omitted
  - **Format**: Two digits, hyphen, lowercase letters/numbers/hyphens
  - **Examples**: `01-introduction`, `13-type-hints-and-annotations`

---

## Response

### Success Response (200 OK)

#### Response Body Schema

```json
{
  "session_id": "string (UUID v4)",
  "welcome_message": "string"
}
```

#### Response Body Examples

**With chapter context**:
```json
{
  "session_id": "a3f5b9c8-4d2e-4f1a-9b3c-7e8d6f5a4b3c",
  "welcome_message": "Welcome! I'm here to help you understand type hints and annotations in Python 3.13+. What would you like to know?"
}
```

**Without chapter context**:
```json
{
  "session_id": "b7d4e3a1-8f9c-4b2d-9e6a-3c5d7f8b9a1c",
  "welcome_message": "Hello! I'm your AI learning assistant. How can I help you today?"
}
```

#### Response Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `session_id` | string | Newly generated UUID v4 for session tracking |
| `welcome_message` | string | Contextual welcome message (generic or chapter-specific) |

---

### Error Responses

#### 404 Not Found - Chapter Not Found

**Cause**: `chapter_id` provided but chapter doesn't exist

```json
{
  "detail": "Chapter '99-nonexistent' not found",
  "code": "CHAPTER_NOT_FOUND",
  "timestamp": "2025-11-05T15:30:10Z"
}
```

#### 500 Internal Server Error

**Cause**: Server error during session initialization

```json
{
  "detail": "Failed to initialize session",
  "code": "INTERNAL_SERVER_ERROR",
  "timestamp": "2025-11-05T15:30:10Z"
}
```

---

## Behavior

### 1. Session ID Generation

- Generate UUID v4: `uuid.uuid4()`
- Format: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
- Unique per initialization call
- Not stored server-side (stateless API)

### 2. Welcome Message Generation

**If `chapter_id` provided**:
1. Validate chapter exists
2. Generate contextual message: "Welcome! I'm here to help you with [Chapter Topic]..."

**If `chapter_id` omitted**:
1. Return generic welcome: "Hello! I'm your AI learning assistant..."

**Future Enhancement**: Use AI to generate personalized welcome based on chapter content

---

## Usage

### When to Call

- User clicks "Try It Live" button (first time)
- User doesn't have a session_id yet
- Optional: Can skip and just send first message to `/chat/message` (session_id auto-generated)

### Client-Side Flow

```typescript
// Option 1: Initialize session explicitly
const initSession = async (chapterId: string) => {
  const response = await fetch('/api/v1/chat/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chapter_id: chapterId })
  });
  
  const { session_id, welcome_message } = await response.json();
  
  // Store session_id
  setSessionId(session_id);
  
  // Display welcome message
  addMessage({ role: 'assistant', content: welcome_message });
};

// Option 2: Skip init, let first chat message generate session_id
// (simpler, recommended for MVP)
```

---

## Testing

### Unit Tests (pytest)

```python
def test_session_init_with_chapter(client):
    response = client.post("/api/v1/chat/init", json={
        "chapter_id": "01-introduction"
    })
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert "welcome_message" in data
    assert len(data["session_id"]) == 36  # UUID format

def test_session_init_without_chapter(client):
    response = client.post("/api/v1/chat/init", json={})
    assert response.status_code == 200
    data = response.json()
    assert "Hello" in data["welcome_message"]

def test_session_init_chapter_not_found(client):
    response = client.post("/api/v1/chat/init", json={
        "chapter_id": "99-nonexistent"
    })
    assert response.status_code == 404
```

### Integration Test (curl)

```bash
curl -X POST http://localhost:8000/api/v1/chat/init \
  -H "Content-Type: application/json" \
  -d '{"chapter_id": "13-type-hints-and-annotations"}'
```

---

## Performance

| Metric | Target |
|--------|--------|
| Response time | <100ms (no AI call) |
| Availability | 99.9% |

---

## Security

- No sensitive data in request/response
- Session ID is client-managed (not server-stored)
- CORS-protected (only allowed origins)

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-05 | Initial API contract |
