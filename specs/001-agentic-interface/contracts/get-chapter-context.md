# API Contract: Get Chapter Context

**Endpoint**: `GET /api/v1/chapter/{chapter_id}/context`

**Purpose**: Retrieve the full content of a chapter for debugging, testing, or direct use.

**Note**: This endpoint is primarily for development/debugging. In production, chapter context is automatically injected into chat messages.

---

## Request

### HTTP Method
`GET`

### URL Pattern
```
GET /api/v1/chapter/{chapter_id}/context
```

### Path Parameters

| Parameter | Type | Required | Constraints | Description |
|-----------|------|----------|-------------|-------------|
| `chapter_id` | string | Yes | Matches `\d{2}-[a-z0-9-]+` | Chapter identifier |

### URL Examples

```
GET /api/v1/chapter/01-introduction/context
GET /api/v1/chapter/13-type-hints-and-annotations/context
GET /api/v1/chapter/49-deployment-strategies/context
```

### Headers
None required (public endpoint for development)

---

## Response

### Success Response (200 OK)

#### Response Body Schema

```json
{
  "chapter_id": "string",
  "content": "string",
  "length": "number",
  "source_files": ["string"]
}
```

#### Response Body Example

```json
{
  "chapter_id": "13-type-hints-and-annotations",
  "content": "# Type Hints and Annotations\n\nPython 3.13 introduces powerful type hinting features...\n\n## Why Type Hints Matter\n\nType hints provide several benefits:\n1. IDE support\n2. Error prevention\n3. Self-documenting code\n\n...",
  "length": 45230,
  "source_files": [
    "book-source/docs/Part-04-Python-Fundamentals/13-type-hints/intro.md",
    "book-source/docs/Part-04-Python-Fundamentals/13-type-hints/examples.md"
  ]
}
```

#### Response Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `chapter_id` | string | Chapter identifier (echoed from request) |
| `content` | string | Full markdown content of chapter (frontmatter removed) |
| `length` | number | Character count of content |
| `source_files` | array | List of markdown files that were combined |

---

### Error Responses

#### 404 Not Found - Chapter Doesn't Exist

**Cause**: Chapter directory or files not found

```json
{
  "detail": "Chapter '99-nonexistent': No markdown files found",
  "code": "CHAPTER_NOT_FOUND",
  "timestamp": "2025-11-05T15:30:10Z"
}
```

#### 500 Internal Server Error

**Cause**: File system error, permission issue

```json
{
  "detail": "Error reading chapter content: Permission denied",
  "code": "INTERNAL_SERVER_ERROR",
  "timestamp": "2025-11-05T15:30:10Z"
}
```

---

## Behavior

### 1. Chapter Discovery

**Search Process**:
1. Normalize chapter_id (remove leading/trailing slashes, extract last segment)
2. Search `book-source/docs/` recursively for folder matching chapter_id
3. Find all `.md` files in matched folder (exclude `README.md`)
4. If exact match not found, try partial match (e.g., "type-hints" matches "13-type-hints-and-annotations")

### 2. Content Processing

**For each markdown file**:
1. Read file contents (UTF-8 encoding)
2. Remove YAML frontmatter (between `---`)
3. Remove code blocks (to reduce token count in AI context)
4. Clean up excessive whitespace (more than 2 consecutive newlines)
5. Trim leading/trailing whitespace

**Combine files**:
1. Sort files alphabetically
2. Join with section headers: `## {filename}`
3. Return combined content

### 3. Content Truncation

If combined content exceeds 50,000 characters:
1. Truncate at 50,000 chars
2. Append: `\n\n[Content truncated...]`
3. Return truncated version

---

## Usage

### Development/Debugging

```bash
# Check what context AI receives for a chapter
curl http://localhost:8000/api/v1/chapter/13-type-hints-and-annotations/context

# Verify chapter exists
curl -I http://localhost:8000/api/v1/chapter/01-introduction/context
```

### Testing AI Prompts

```python
# Get chapter context to test prompt engineering
import requests

response = requests.get('http://localhost:8000/api/v1/chapter/13-type-hints-and-annotations/context')
chapter_content = response.json()['content']

# Use in test prompt
prompt = f"""
You are an AI assistant. Use this chapter to answer questions:

{chapter_content}

Question: What are type hints?
"""
```

### Frontend (Not Recommended)

While this endpoint is publicly accessible, **frontend should NOT call it directly**. Instead, use `/chat/message` endpoint which automatically injects context.

**Why**:
- Reduces bandwidth (context sent only to backend, not to browser)
- Backend caches chapter content (faster)
- Simpler frontend logic

---

## Performance

| Metric | Target | Typical |
|--------|--------|---------|
| Response time | <500ms | ~100ms |
| Content size | <100 KB | ~30 KB |
| Cache hit rate | >90% | N/A (no cache in MVP) |

### Future: Caching

```python
from functools import lru_cache

@lru_cache(maxsize=50)  # Cache 50 chapters
async def get_chapter_context(chapter_id: str):
    # Load from filesystem
    ...
```

**Cache invalidation**: When chapter content updates (detected via file modification time)

---

## Security

### Considerations

- **Public endpoint**: No authentication required
- **Rate limiting**: Future enhancement to prevent abuse
- **Path traversal**: Prevent `../../../etc/passwd` attacks by validating chapter_id format
- **File access**: Only read `.md` files in `docs/` directory

### Validation

```python
import re

def validate_chapter_id(chapter_id: str):
    # Only allow alphanumeric, hyphens, underscores
    if not re.match(r'^[a-z0-9-_]+$', chapter_id, re.IGNORECASE):
        raise ValueError("Invalid chapter_id format")
    
    # Prevent path traversal
    if '..' in chapter_id or '/' in chapter_id:
        raise ValueError("Invalid chapter_id: path traversal detected")
```

---

## Testing

### Unit Tests (pytest)

```python
def test_get_chapter_context_success(client):
    response = client.get("/api/v1/chapter/01-introduction/context")
    assert response.status_code == 200
    data = response.json()
    assert data["chapter_id"] == "01-introduction"
    assert len(data["content"]) > 0
    assert data["length"] > 0

def test_get_chapter_context_not_found(client):
    response = client.get("/api/v1/chapter/99-nonexistent/context")
    assert response.status_code == 404

def test_get_chapter_context_path_traversal(client):
    response = client.get("/api/v1/chapter/../../../etc/passwd/context")
    assert response.status_code == 400  # Or 404
```

### Integration Test (curl)

```bash
# Success case
curl http://localhost:8000/api/v1/chapter/13-type-hints-and-annotations/context

# Chapter not found
curl http://localhost:8000/api/v1/chapter/99-fake/context

# Invalid format
curl http://localhost:8000/api/v1/chapter/invalid_format/context
```

---

## Example Response (Shortened)

```json
{
  "chapter_id": "13-type-hints-and-annotations",
  "content": "# Type Hints and Annotations\n\nPython 3.13+ introduces...\n\n## Introduction\n\nType hints help developers...\n\n## Basic Syntax\n\n```python\ndef greet(name: str) -> str:\n    return f\"Hello, {name}\"\n```\n\n## Advanced Features\n\n### Generic Types\n\nUse `list[int]`, `dict[str, int]`...\n\n## Common Mistakes\n\n1. Forgetting to import from `typing`\n2. Using runtime type checking...\n\n## Summary\n\nType hints provide IDE support, error prevention, and documentation.",
  "length": 3421,
  "source_files": [
    "book-source/docs/Part-04-Python-Fundamentals/13-type-hints/01-introduction.md",
    "book-source/docs/Part-04-Python-Fundamentals/13-type-hints/02-basic-syntax.md",
    "book-source/docs/Part-04-Python-Fundamentals/13-type-hints/03-advanced.md",
    "book-source/docs/Part-04-Python-Fundamentals/13-type-hints/04-common-mistakes.md"
  ]
}
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-05 | Initial API contract |

---

## Related Contracts

- [Send Chat Message](./chat-message.md) - Uses this context automatically
- [Session Init](./session-init.md) - Initialize chat session
