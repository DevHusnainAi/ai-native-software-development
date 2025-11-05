# Backend API for Agentic Interface

FastAPI backend for the interactive agentic learning interface.

## Setup

1. **Install uv** (if not already installed):

   ```bash
   # macOS/Linux
   curl -LsSf https://astral.sh/uv/install.sh | sh

   # Windows
   powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```

2. **Install dependencies:**

   ```bash
   uv sync
   ```

3. **Create `.env` file:**

   ```bash
   # Create .env file manually
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
   echo "GEMINI_MODEL=gemini-2.5-flash" >> .env
   ```

4. **Run locally:**

   ```bash
   uv run uvicorn src.main:app --reload
   ```

5. **Run with Docker Compose:**

   ```bash
   # From project root
   docker compose up -d

   # Or from backend directory
   cd backend
   docker compose up -d
   ```

6. **Run with Docker:**
   ```bash
   docker build -t agentic-backend .
   docker run -p 8000:8000 --env-file .env agentic-backend
   ```

## API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /api/v1/chat/init` - Initialize chat session
- `POST /api/v1/chat/message` - Send chat message

## Environment Variables

- `GEMINI_API_KEY` - Your Gemini API key (required)
- `GEMINI_MODEL` - Gemini model to use (default: gemini-2.5-flash)
- `DATABASE_URL` - PostgreSQL connection string (optional, for future)
- `SECRET_KEY` - Secret key for JWT/sessions (change in production)

## Development

**Run tests:**

```bash
uv run pytest
```

**Add new dependency:**

```bash
uv add package-name
```

**Lock dependencies:**

```bash
uv lock
```

## Structure

```
backend/
├── src/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Configuration
│   ├── models/              # Pydantic models
│   ├── services/            # Business logic
│   │   ├── gemini_client.py # Gemini AI client
│   │   └── chapter_context.py
│   └── api/                 # API routes
├── tests/                   # Test files
├── pyproject.toml           # uv project configuration
├── compose.yaml             # Docker Compose configuration
├── requirements.txt         # Legacy (for reference)
└── Dockerfile
```
