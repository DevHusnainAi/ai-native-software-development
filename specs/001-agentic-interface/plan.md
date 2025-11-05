# Implementation Plan: Interactive Agentic Learning Interface

**Branch**: `001-agentic-interface` | **Date**: 2025-11-04 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-agentic-interface/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Transform static Docusaurus book into interactive learning platform with:
- AI chat assistant (context-aware per chapter)
- Live canvas for Mermaid diagrams

Technical approach: React frontend (GitHub Pages) + FastAPI backend (GCP Cloud Run).

**Note**: Terminal environment deferred to future enhancement (see spec.md Future Enhancements section).

## Technical Context

**Language/Version**: TypeScript 5.3 (frontend), Python 3.13+ (backend)

**Primary Dependencies**: 
- Frontend: React 19, mermaid 11.x, Docusaurus 3.9.2
- Backend: FastAPI 0.115+, openai 1.x (SDK with Gemini endpoint)

**Storage**: 
- Browser localStorage (chat history, session state)
- No database required for MVP

**Testing**: 
- Jest + React Testing Library (frontend)
- pytest (backend)

**Target Platform**: 
- Modern browsers (Chrome 87+, Firefox 89+, Safari 15.2+)
- GCP Cloud Run (backend deployment per ADR-0002)

**Project Type**: Web application (frontend + backend)

**Performance Goals**: 
- <2s interface activation
- <3s AI response (Gemini API)
- <1s diagram render (Mermaid.js)
- <500ms API latency (p95)

**Constraints**: 
- Gemini free tier (60M tokens/month)
- Modern browser required (Chrome 100+, Firefox 100+, Safari 15+)
- Hybrid deployment (GitHub Pages + GCP Cloud Run)

**Scale/Scope**: 
- 1,000 concurrent chat sessions
- 49 chapters with contextual AI
- Session-based state management (no user accounts in MVP)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Principle #14 (Planning-First)**: Spec exists and approved before planning
✅ **Principle #15 (Validation-Before-Trust)**: Testing strategy defined (Jest, pytest)
✅ **Principle #16 (Bilingual Development)**: Python (backend) + TypeScript (frontend)
✅ **Principle #17 (Production-Ready Deployment)**: GCP Cloud Run deployment strategy

**Status**: PASS - All constitutional gates satisfied

## Project Structure

### Documentation (this feature)

```text
specs/001-agentic-interface/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
book-source/
├── src/
│   ├── components/
│   │   ├── AgenticInterface.tsx         # Main orchestrator
│   │   ├── AgenticChat.tsx              # Chat with AI
│   │   ├── CanvasPanel.tsx              # Mermaid diagrams
│   │   ├── ErrorPopup.tsx               # Error handling
│   │   ├── TypingIndicator.tsx          # Loading state
│   │   ├── SuggestedPrompts.tsx         # Prompt suggestions
│   │   └── AIPersonaWelcome.tsx         # Welcome message
│   ├── services/
│   │   └── api.ts                       # Backend API client
│   ├── types/
│   │   └── agentic.ts                   # TypeScript types
│   ├── utils/
│   │   └── chapter.ts                   # Chapter ID extraction
│   ├── hooks/                           # (future: useChat, useCanvas)
│   ├── css/
│   │   ├── agentic-interface.css
│   │   └── agentic-chat-enhanced.css
│   └── theme/
│       └── Root.tsx                     # Docusaurus theme integration
├── package.json
├── tsconfig.json
└── docusaurus.config.ts

backend/
├── src/
│   ├── main.py                          # FastAPI app entry
│   ├── models/
│   │   ├── session.py                   # Session data model
│   │   └── message.py                   # Message data model
│   ├── services/
│   │   ├── gemini_client.py             # Gemini AI client
│   │   └── chapter_context.py           # Chapter content retrieval
│   ├── api/
│   │   ├── chat.py                      # Chat endpoints
│   │   └── health.py                    # Health check
│   └── config.py                        # Environment config
├── requirements.txt
├── Dockerfile
└── tests/
```

**Structure Decision**: Docusaurus-integrated frontend with React components + FastAPI backend. No terminal infrastructure (deferred to future). Chat state managed in browser localStorage. Hybrid deployment: GitHub Pages (frontend) + GCP Cloud Run (backend).

## Complexity Tracking

> **No violations detected** - Constitution check passed without justification needed.
