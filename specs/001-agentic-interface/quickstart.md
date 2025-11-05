# Quickstart Guide: Interactive Agentic Learning Interface

**Feature**: 001-agentic-interface
**Date**: 2025-11-05
**Phase**: Phase 1 - Developer Setup

## Overview

This guide helps developers set up the local development environment for the agentic interface. You'll run both the frontend (Docusaurus) and backend (FastAPI) locally.

**Prerequisites**:
- Node.js 20+ installed
- Python 3.13+ installed
- Git installed
- Code editor (VS Code recommended)

---

## Quick Start (TL;DR)

```bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
export GEMINI_API_KEY="your-key-here"  # Windows: set GEMINI_API_KEY=your-key-here
uvicorn src.main:app --reload

# Terminal 2: Frontend
cd book-source
npm install
npm start

# Open browser: http://localhost:3000
# Navigate to any chapter and look for agentic interface
```

---

## Step-by-Step Setup

### 1. Clone Repository

```bash
git clone https://github.com/panaversity/ai-native-software-development.git
cd ai-native-software-development
git checkout 001-agentic-interface  # Or main if merged
```

---

### 2. Backend Setup (FastAPI)

#### 2.1 Create Virtual Environment

```bash
cd backend
python -m venv venv
```

**Activate virtual environment**:
- **Linux/Mac**: `source venv/bin/activate`
- **Windows (CMD)**: `venv\Scripts\activate.bat`
- **Windows (PowerShell)**: `venv\Scripts\Activate.ps1`

You should see `(venv)` prefix in your terminal.

#### 2.2 Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Expected packages**:
- fastapi==0.115.0
- uvicorn[standard]==0.30.0
- openai==1.12.0
- python-dotenv==1.0.0
- pydantic==2.9.0

#### 2.3 Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

#### 2.4 Set Environment Variables

**Option A: Create `.env` file** (recommended):

```bash
# backend/.env
GEMINI_API_KEY=AIzaSyC...your-key-here
GEMINI_MODEL=gemini-2.5-flash
ALLOWED_ORIGINS=http://localhost:3000,https://ai-native.panaversity.org
```

**Option B: Export manually**:

```bash
# Linux/Mac
export GEMINI_API_KEY="AIzaSyC...your-key-here"

# Windows CMD
set GEMINI_API_KEY=AIzaSyC...your-key-here

# Windows PowerShell
$env:GEMINI_API_KEY="AIzaSyC...your-key-here"
```

#### 2.5 Verify Configuration

```bash
python -c "from src.config import settings; print('Gemini configured:', settings.gemini_configured)"
```

Expected output: `Gemini configured: True`

#### 2.6 Run Backend Server

```bash
uvicorn src.main:app --reload
```

**Expected output**:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

#### 2.7 Test Backend API

Open browser to http://localhost:8000/docs

You should see Swagger UI with endpoints:
- `POST /api/v1/chat/message`
- `POST /api/v1/chat/init`
- `GET /api/v1/chapter/{chapter_id}/context`
- `GET /health`

**Test health endpoint**:
```bash
curl http://localhost:8000/health
```

Expected: `{"status":"healthy"}`

**Test chat endpoint**:
```bash
curl -X POST http://localhost:8000/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is Python?",
    "chapter_id": "01-ai-development-revolution"
  }'
```

Expected: JSON response with AI answer

---

### 3. Frontend Setup (Docusaurus + React)

#### 3.1 Install Dependencies

```bash
cd book-source
npm install
```

**Expected packages**:
- @docusaurus/core@3.9.2
- react@19.0.0
- mermaid@11.4.1
- @xterm/xterm@5.5.0 (may be removed in future)

#### 3.2 Configure API Endpoint

The frontend already points to `http://localhost:8000` in development (see `book-source/src/services/api.ts`):

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.ai-native.panaversity.org'
  : 'http://localhost:8000';
```

No changes needed for local development.

#### 3.3 Run Frontend Server

```bash
npm start
```

**Expected output**:
```
[INFO] Starting the development server...
[SUCCESS] Docusaurus website is running at: http://localhost:3000/

✔ Client
  Compiled successfully in 5.23s
```

#### 3.4 Verify Frontend

1. Open http://localhost:3000
2. Navigate to any chapter (e.g., "Part 1 > Chapter 1")
3. Look for the agentic interface on the right side of the page
4. If not visible, check browser console for errors

---

## Directory Structure

```
ai-native-software-development/
├── backend/                    # FastAPI backend
│   ├── src/
│   │   ├── main.py            # FastAPI app entry point
│   │   ├── config.py          # Environment configuration
│   │   ├── api/
│   │   │   ├── chat.py        # Chat endpoints
│   │   │   └── health.py      # Health check
│   │   ├── models/
│   │   │   ├── message.py     # Pydantic models
│   │   │   └── session.py
│   │   └── services/
│   │       ├── gemini_client.py    # Gemini API client
│   │       └── chapter_context.py  # Chapter content retrieval
│   ├── tests/                 # Backend tests
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Container image
│   └── .env.example           # Environment template
│
├── book-source/                # Docusaurus frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AgenticInterface.tsx   # Main orchestrator
│   │   │   ├── AgenticChat.tsx        # Chat UI
│   │   │   ├── CanvasPanel.tsx        # Mermaid diagrams
│   │   │   ├── ErrorPopup.tsx         # Error handling
│   │   │   ├── TypingIndicator.tsx    # Loading state
│   │   │   ├── SuggestedPrompts.tsx   # Prompt suggestions
│   │   │   └── AIPersonaWelcome.tsx   # Welcome message
│   │   ├── services/
│   │   │   └── api.ts         # Backend API client
│   │   ├── types/
│   │   │   └── agentic.ts     # TypeScript types
│   │   ├── utils/
│   │   │   └── chapter.ts     # Chapter ID extraction
│   │   ├── css/
│   │   │   ├── agentic-interface.css
│   │   │   └── agentic-chat-enhanced.css
│   │   └── theme/
│   │       └── Root.tsx       # Docusaurus theme integration
│   ├── docs/                  # Book chapters (markdown)
│   ├── package.json
│   └── docusaurus.config.ts
│
└── specs/001-agentic-interface/   # This feature's specs
    ├── spec.md
    ├── plan.md
    ├── research.md
    ├── data-model.md
    ├── quickstart.md (this file)
    └── contracts/
```

---

## Testing the Integration

### 1. Activate Agentic Interface

1. Run both backend and frontend
2. Navigate to http://localhost:3000
3. Go to any chapter
4. The agentic interface should be visible on the right side

**If not visible**:
- Check browser console for errors
- Verify backend is running (http://localhost:8000/health)
- Check CORS configuration in `backend/src/config.py`

### 2. Test Chat Functionality

1. Type a question in the chat input: "What is this chapter about?"
2. Click "Send" or press Enter
3. Verify:
   - ✅ Typing indicator appears
   - ✅ AI response appears within 3 seconds
   - ✅ Response references chapter content
   - ✅ Message persists in chat history

**If not working**:
- Check Network tab in DevTools for API call
- Look for CORS errors (red text in console)
- Verify Gemini API key is set correctly

### 3. Test Canvas (Diagram Rendering)

1. Ask AI: "Draw a diagram showing how this works"
2. Verify:
   - ✅ AI generates Mermaid syntax in response
   - ✅ Diagram renders in canvas panel
   - ✅ Zoom controls work

**If diagram doesn't render**:
- Check for Mermaid syntax errors in response
- Look for canvas errors in browser console
- Try asking: "Generate a simple flowchart"

### 4. Test Session Persistence

1. Send a few chat messages
2. Close browser tab
3. Reopen http://localhost:3000 and navigate to same chapter
4. Verify chat history is restored

**If history not restored**:
- Check LocalStorage in DevTools (Application tab)
- Look for keys like `agentic-chat-{chapterId}`
- Verify chapter ID is being extracted correctly

---

## Common Issues & Fixes

### Backend Issues

#### Issue: "ModuleNotFoundError: No module named 'src'"

**Fix**: Make sure you're running `uvicorn src.main:app` from the `backend/` directory

#### Issue: "Gemini API key not configured"

**Fix**: 
```bash
# Check if env var is set
echo $GEMINI_API_KEY  # Linux/Mac
echo %GEMINI_API_KEY%  # Windows

# Set it if missing
export GEMINI_API_KEY="your-key-here"
```

#### Issue: "CORS error: No 'Access-Control-Allow-Origin' header"

**Fix**: Verify `ALLOWED_ORIGINS` in `backend/src/config.py` includes `http://localhost:3000`

#### Issue: "Chapter not found"

**Fix**: Make sure `book-source/docs/` directory exists relative to `backend/` folder

---

### Frontend Issues

#### Issue: "Cannot find module 'mermaid'"

**Fix**: 
```bash
cd book-source
npm install
```

#### Issue: "API call fails with 404"

**Fix**: 
- Verify backend is running: http://localhost:8000/docs
- Check `API_BASE_URL` in `book-source/src/services/api.ts`

#### Issue: "Chat history not persisting"

**Fix**:
- Check browser's LocalStorage quota (may be disabled in incognito mode)
- Clear LocalStorage and try again: `localStorage.clear()`

#### Issue: "Diagram not rendering"

**Fix**:
- Check browser console for Mermaid errors
- Verify Mermaid syntax is valid: https://mermaid.live/
- Try asking AI to regenerate diagram

---

## Development Workflow

### Making Changes to Backend

1. Edit code in `backend/src/`
2. Uvicorn auto-reloads (if using `--reload` flag)
3. Test changes at http://localhost:8000/docs
4. Write tests in `backend/tests/`
5. Run tests: `pytest`

### Making Changes to Frontend

1. Edit code in `book-source/src/`
2. Docusaurus hot-reloads automatically
3. Check browser console for errors
4. Write tests in `book-source/tests/` (future)
5. Build for production: `npm run build`

### Testing End-to-End

1. Start both backend and frontend
2. Open http://localhost:3000
3. Test full user journey:
   - Activate interface
   - Send chat message
   - View AI response
   - Request diagram
   - Verify diagram renders
   - Navigate to different chapter
   - Verify interface persists

---

## Running Tests

### Backend Tests (pytest)

```bash
cd backend
pytest
```

**Test files**:
- `tests/test_chat.py` - Chat endpoints
- `tests/test_gemini.py` - Gemini client
- `tests/test_chapter_context.py` - Chapter retrieval

### Frontend Tests (Jest) - Future

```bash
cd book-source
npm test
```

---

## Building for Production

### Backend (Docker)

```bash
cd backend
docker build -t agentic-backend .
docker run -p 8000:8000 \
  -e GEMINI_API_KEY="your-key" \
  agentic-backend
```

### Frontend (Docusaurus)

```bash
cd book-source
npm run build
npm run serve  # Preview production build
```

---

## Debugging Tips

### Enable Verbose Logging

**Backend**:
```python
# backend/src/main.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Frontend**:
```typescript
// book-source/src/services/api.ts
console.log('[API] Request:', { message, chapter_id });
console.log('[API] Response:', response);
```

### Inspect Network Traffic

1. Open DevTools (F12)
2. Go to "Network" tab
3. Filter by "XHR" or "Fetch"
4. Look for calls to `/api/v1/chat/message`
5. Check request payload and response

### Check LocalStorage

1. Open DevTools (F12)
2. Go to "Application" tab
3. Expand "Local Storage" > `http://localhost:3000`
4. Look for keys starting with `agentic-`

### Monitor Backend Logs

Backend logs appear in terminal where `uvicorn` is running:
```
INFO:     127.0.0.1:53042 - "POST /api/v1/chat/message HTTP/1.1" 200 OK
```

---

## Next Steps

1. ✅ Local environment set up
2. ⏳ Review `contracts/` directory for API specs
3. ⏳ Run `/sp.tasks` to generate implementation tasks
4. ⏳ Begin implementing missing features (canvas integration, etc.)
5. ⏳ Write tests for new features
6. ⏳ Deploy to staging environment

---

## Getting Help

- **Backend issues**: Check `backend/README.md` (if exists)
- **Frontend issues**: Check `book-source/README.md` (if exists)
- **API documentation**: http://localhost:8000/docs (Swagger UI)
- **Questions**: Open issue in GitHub repository

---

## Environment Variables Reference

### Backend (`.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | Yes | - | Google Gemini API key |
| `GEMINI_MODEL` | No | `gemini-2.5-flash` | Model to use |
| `GEMINI_BASE_URL` | No | `https://generativelanguage.googleapis.com/v1beta/openai/` | API endpoint |
| `ALLOWED_ORIGINS` | No | `http://localhost:3000,...` | CORS allowed origins |
| `DATABASE_URL` | No | - | PostgreSQL URL (future) |

### Frontend (environment variables)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Auto-set | `development` | Environment mode |
| `API_BASE_URL` | No | Auto-detected | Backend API URL |

---

## Success Criteria

You've successfully set up the environment when:
- ✅ Backend responds at http://localhost:8000/health
- ✅ Frontend loads at http://localhost:3000
- ✅ Chat messages get AI responses
- ✅ Diagrams render in canvas
- ✅ Chat history persists across page reloads
- ✅ No CORS errors in browser console

**Ready to start implementing!** 🚀
