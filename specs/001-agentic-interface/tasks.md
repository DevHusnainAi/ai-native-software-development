# Tasks: Interactive Agentic Learning Interface

**Feature**: 001-agentic-interface
**Input**: Design documents from `/specs/001-agentic-interface/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Not explicitly requested in spec - no test tasks included in MVP

**Organization**: Tasks grouped by user story to enable independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Web application structure (per plan.md):
- Frontend: `book-source/src/`
- Backend: `backend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and environment configuration

- [ ] T001 Verify Gemini API key is configured in backend/.env
- [ ] T002 Install backend dependencies via pip install -r backend/requirements.txt
- [ ] T003 [P] Install frontend dependencies via npm install in book-source/
- [ ] T004 [P] Verify TypeScript configuration in book-source/tsconfig.json supports React 19
- [ ] T005 Run backend health check: uvicorn src.main:app --reload and verify http://localhost:8000/health
- [ ] T006 [P] Run frontend dev server: npm start in book-source/ and verify http://localhost:3000

**Checkpoint**: Development environment ready - both backend and frontend running locally

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Verify backend CORS configuration in backend/src/config.py allows http://localhost:3000
- [ ] T008 Verify Gemini client initialization in backend/src/services/gemini_client.py works with OpenAI SDK
- [ ] T009 [P] Verify chapter context retrieval in backend/src/services/chapter_context.py can read from book-source/docs/
- [ ] T010 Verify API contract types in book-source/src/types/agentic.ts match backend models
- [ ] T011 Verify API client in book-source/src/services/api.ts points to correct endpoint (localhost:8000 for dev)

**Checkpoint**: Foundation ready - backend API functional, frontend can communicate with backend

---

## Phase 3: User Story 1 - Reader Activates Interactive Learning (Priority: P1) 🎯 MVP

**Goal**: User can toggle between reading mode and interactive mode with visible chat/canvas panels

**Independent Test**: Navigate to any chapter, click "Try It Live" button, verify interface appears with chat and canvas panels, click "Back to Reading" to return to normal view

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create AgenticInterface component in book-source/src/components/AgenticInterface.tsx with toggle state management
- [ ] T013 [P] [US1] Create ErrorPopup component in book-source/src/components/ErrorPopup.tsx with dismiss functionality
- [ ] T014 [P] [US1] Add CSS layout for split-screen interface in book-source/src/css/agentic-interface.css
- [ ] T015 [US1] Integrate AgenticInterface into Docusaurus theme via book-source/src/theme/Root.tsx
- [ ] T016 [US1] Add "Try It Live" button to chapter pages (inject via Root.tsx or custom plugin)
- [ ] T017 [US1] Implement toggle logic to show/hide agentic interface panels
- [ ] T018 [US1] Add responsive layout breakpoints in CSS for mobile (tabbed view: Book | Chat | Canvas)
- [ ] T019 [US1] Implement chapter ID extraction in book-source/src/utils/chapter.ts using useLocation hook
- [ ] T020 [US1] Verify interface persists across chapter navigation (state management in AgenticInterface)
- [ ] T021 [US1] Add browser resize handler for panel adjustment in AgenticInterface.tsx

**Checkpoint**: Interface toggle works - user can activate/deactivate agentic interface on any chapter

---

## Phase 4: User Story 2 - AI Chat Assistant Provides Contextual Help (Priority: P1)

**Goal**: User can ask questions and receive AI responses contextual to current chapter

**Independent Test**: Activate interface on any chapter, type a question, verify AI response references chapter content within 3 seconds

### Implementation for User Story 2

- [ ] T022 [P] [US2] Create ChatMessage type in book-source/src/types/agentic.ts
- [ ] T023 [P] [US2] Create AgenticChat component in book-source/src/components/AgenticChat.tsx with message history display
- [ ] T024 [P] [US2] Create TypingIndicator component in book-source/src/components/TypingIndicator.tsx for loading state
- [ ] T025 [P] [US2] Create AIPersonaWelcome component in book-source/src/components/AIPersonaWelcome.tsx with welcome message
- [ ] T026 [P] [US2] Create SuggestedPrompts component in book-source/src/components/SuggestedPrompts.tsx with prompt suggestions
- [ ] T027 [P] [US2] Add CSS styling for chat interface in book-source/src/css/agentic-chat-enhanced.css
- [ ] T028 [US2] Implement chat message submission in AgenticChat.tsx calling backend API
- [ ] T029 [US2] Implement session initialization via POST /api/v1/chat/init in book-source/src/services/api.ts
- [ ] T030 [US2] Implement message sending via POST /api/v1/chat/message in book-source/src/services/api.ts
- [ ] T031 [US2] Add session ID state management in AgenticInterface.tsx (store in React state)
- [ ] T032 [US2] Implement chat history persistence to localStorage with key pattern agentic-chat-{chapterId}
- [ ] T033 [US2] Add chat history restoration logic on component mount in AgenticChat.tsx
- [ ] T034 [US2] Implement "Clear Chat" button in AgenticChat.tsx to reset conversation
- [ ] T035 [US2] Add error handling for API failures in AgenticChat.tsx with ErrorPopup integration
- [ ] T036 [US2] Add retry logic with exponential backoff for failed API calls in book-source/src/services/api.ts
- [ ] T037 [US2] Verify AI responses include chapter context via backend/src/services/chapter_context.py
- [ ] T038 [US2] Add loading state (TypingIndicator) during AI response generation

**Checkpoint**: Chat fully functional - user can send messages, receive AI responses, persist history across sessions

---

## Phase 5: User Story 3 - Live Canvas Renders Diagrams (Priority: P2)

**Goal**: AI-generated Mermaid diagrams automatically render in canvas panel with zoom controls

**Independent Test**: Ask AI to "draw a diagram showing [concept]", verify Mermaid diagram renders in canvas within 1 second, test zoom controls

### Implementation for User Story 3

- [ ] T039 [P] [US3] Create CanvasPanel component in book-source/src/components/CanvasPanel.tsx with Mermaid rendering
- [ ] T040 [P] [US3] Add Mermaid.js initialization in CanvasPanel.tsx with theme configuration
- [ ] T041 [P] [US3] Implement zoom controls (buttons + mouse wheel) in CanvasPanel.tsx
- [ ] T042 [P] [US3] Implement pan/drag functionality for large diagrams in CanvasPanel.tsx
- [ ] T043 [US3] Add Mermaid syntax extraction from AI responses in AgenticChat.tsx (regex: ```mermaid\n([\s\S]*?)```)
- [ ] T044 [US3] Implement auto-render when Mermaid syntax detected in AI message
- [ ] T045 [US3] Pass extracted Mermaid syntax to CanvasPanel via React props
- [ ] T046 [US3] Implement diagram error handling for invalid Mermaid syntax in CanvasPanel.tsx
- [ ] T047 [US3] Add user-friendly error message display in canvas for syntax errors
- [ ] T048 [US3] Implement diagram state management (active diagram, zoom level, pan offset)
- [ ] T049 [US3] Add empty state display when no diagram is available in CanvasPanel.tsx

**Checkpoint**: Canvas fully functional - AI-generated diagrams render automatically, zoom/pan works

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories

- [ ] T050 [P] Add API base URL environment detection in book-source/src/services/api.ts (localhost vs production)
- [ ] T051 [P] Verify all components handle mobile responsive layout (tabbed view for small screens)
- [ ] T052 [P] Add comprehensive error logging to browser console for debugging
- [ ] T053 [P] Optimize chat history virtual scrolling for performance (100+ messages)
- [ ] T054 [P] Add conversation summarization logic if context window exceeds limits (future enhancement placeholder)
- [ ] T055 Verify session cleanup for sessions older than 30 days in localStorage (future enhancement)
- [ ] T056 [P] Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] T057 [P] Validate accessibility (keyboard navigation, screen reader support)
- [ ] T058 Run quickstart.md validation: Follow all setup steps and verify they work
- [ ] T059 Verify all success criteria from spec.md are met (SC-001 through SC-010)
- [ ] T060 [P] Create deployment documentation for GitHub Pages (frontend) and GCP Cloud Run (backend)

**Final Checkpoint**: All user stories independently functional, production-ready

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - Can proceed in parallel if team capacity allows
  - Or sequentially in priority order: US1 → US2 → US3
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - Integrates with US1 (AgenticInterface) but independently testable
- **User Story 3 (P2)**: Can start after Foundational - Integrates with US2 (chat) but independently testable

### Within Each User Story

- Components marked [P] can be created in parallel
- Integration tasks depend on component completion
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup (Phase 1)**: T002-T006 all marked [P] (backend deps, frontend deps, verifications)
- **Foundational (Phase 2)**: T009, T010, T011 can run in parallel
- **User Story 1**: T012-T014 components + CSS can run in parallel
- **User Story 2**: T022-T027 components + types can run in parallel
- **User Story 3**: T039-T042 component + controls can run in parallel
- **Polish (Phase 6)**: T050-T057 all marked [P]

---

## Parallel Example: User Story 2 (Chat)

```bash
# Launch all component creation for User Story 2 together:
Task: "Create ChatMessage type in book-source/src/types/agentic.ts"
Task: "Create AgenticChat component in book-source/src/components/AgenticChat.tsx"
Task: "Create TypingIndicator component in book-source/src/components/TypingIndicator.tsx"
Task: "Create AIPersonaWelcome component in book-source/src/components/AIPersonaWelcome.tsx"
Task: "Create SuggestedPrompts component in book-source/src/components/SuggestedPrompts.tsx"
Task: "Add CSS styling in book-source/src/css/agentic-chat-enhanced.css"

# Then integrate sequentially:
Task: "Implement chat message submission calling backend API"
Task: "Implement session initialization via POST /api/v1/chat/init"
# etc...
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup ✅
2. Complete Phase 2: Foundational ✅
3. Complete Phase 3: User Story 1 (Interface Toggle)
4. Complete Phase 4: User Story 2 (Chat)
5. **STOP and VALIDATE**: Test interface toggle + chat independently
6. Deploy/demo if ready

**Note**: User Story 3 (Canvas) is P2 - can be deferred post-MVP

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Interface works!)
3. Add User Story 2 → Test independently → Deploy/Demo (Chat works! - MVP!)
4. Add User Story 3 → Test independently → Deploy/Demo (Canvas works!)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Interface Toggle)
   - Developer B: User Story 2 (Chat Assistant)
   - Developer C: User Story 3 (Canvas)
3. Stories complete and integrate independently

---

## Notes

- **[P] tasks**: Different files, no dependencies - safe to parallelize
- **[Story] label**: Maps task to specific user story for traceability
- **Backend already implemented**: Most backend code exists (FastAPI, Gemini client, chapter context)
- **Frontend partially implemented**: AgenticInterface, AgenticChat, CanvasPanel components exist but need integration fixes
- **Key integration gap**: Canvas auto-rendering from AI Mermaid syntax (T043-T045)
- **No test tasks**: Tests not requested in spec - focus on implementation
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Verify success criteria from spec.md at each checkpoint

---

## Current Implementation Status

**Already Implemented** (verify and integrate):
- ✅ Backend API (FastAPI, Gemini client, chapter context)
- ✅ Frontend components (AgenticInterface, AgenticChat, CanvasPanel, ErrorPopup, etc.)
- ✅ API contracts documented
- ✅ LocalStorage persistence for chat history

**Key Gaps to Address**:
- ⚠️ Canvas integration with chat (auto-detect Mermaid, auto-render)
- ⚠️ Session persistence verification
- ⚠️ Mobile responsive layout (tabbed view)
- ⚠️ Error handling and retry logic
- ⚠️ Production deployment configuration

**Focus Tasks**: T043-T049 (Canvas integration) are critical for US3 completion
