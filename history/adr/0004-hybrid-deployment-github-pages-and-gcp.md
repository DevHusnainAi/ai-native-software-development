# ADR-0004: Hybrid Deployment Architecture (GitHub Pages + GCP)

**Status**: Accepted
**Date**: 2025-11-04
**Deciders**: Technical Team
**Feature**: 001-agentic-interface

## Context

The AI Native Software Development book project has two distinct components:
1. **Static content**: Docusaurus-based book with 49 chapters (already deployed on GitHub Pages)
2. **Dynamic backend**: FastAPI API for AI chat, session management, chapter context retrieval

We need to decide whether to:
- Migrate everything to GCP (unified hosting)
- Keep static content on GitHub Pages and only move backend to GCP (hybrid)
- Use a third-party solution (Netlify, Vercel)

## Decision Drivers

1. **Cost**: Minimize hosting costs (GitHub Pages is free)
2. **Performance**: Fast page loads for static content
3. **Simplicity**: Avoid unnecessary migration work
4. **CI/CD**: Maintain existing deployment pipeline
5. **Security**: HTTPS for both static and dynamic content
6. **CORS**: Cross-origin requests between domains

## Considered Options

### Option 1: Migrate Everything to GCP
**Pros**:
- Unified hosting (single domain, no CORS complexity)
- Centralized monitoring and logging
- Consistent infrastructure (all on GCP)
- Single deployment pipeline

**Cons**:
- **Costs money**: Cloud Storage + Cloud CDN = $10-20/month (GitHub Pages is free)
- **Migration overhead**: Move 5 existing chapters + CI/CD pipeline
- **Docusaurus build complexity**: Need Cloud Build integration
- **Unnecessary**: Static content doesn't need GCP's dynamic features

**Cost Analysis**:
```
Cloud Storage: $0.020/GB/month × 1 GB = $0.02
Cloud CDN (North America): $0.08/GB × 10 GB egress = $0.80
Cloud Load Balancer: $18/month (minimum)
Total: ~$20-30/month (vs $0 on GitHub Pages)
```

---

### Option 2: Hybrid (GitHub Pages + GCP) ✅ (CHOSEN)
**Pros**:
- **Free static hosting** (GitHub Pages = $0/month)
- **No migration needed** (keep existing Docusaurus setup)
- **Fast CDN**: GitHub Pages uses Fastly CDN (global, low latency)
- **Automatic HTTPS**: Both GitHub Pages and Cloud Run provide free SSL
- **Separation of concerns**: Static content (frontend) vs dynamic API (backend)
- **Existing CI/CD intact**: GitHub Actions already deploys to Pages

**Cons**:
- **CORS configuration required** (different domains)
- **Two domains to manage**: `panaversity.github.io` + `api.ai-native.panaversity.org`
- **Slight complexity**: Frontend calls backend across domains

**Cost Analysis**:
```
GitHub Pages: $0/month (free for public repos)
GCP Cloud Run (backend only): ~$30/month
Total: $30/month (vs $50/month if everything on GCP)
```

**CORS Configuration** (FastAPI):
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://panaversity.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### Option 3: Third-Party Platform (Netlify/Vercel)
**Pros**:
- Free tier for static sites
- Serverless functions (similar to Cloud Run)
- Automatic HTTPS
- Simple deployment (Git-based)

**Cons**:
- **Vendor lock-in** (not GCP-native)
- **No Gemini integration benefits** (still need GCP for Gemini API)
- **Function limits**: Netlify (10s timeout), Vercel (10s hobby, 60s pro)
- **Not cost-effective**: Still need GCP for AI backend, adding second platform

**Cost Analysis**:
```
Netlify Pro (if free tier exceeded): $19/month
GCP (for Gemini backend): $30/month
Total: $49/month (more expensive than hybrid)
```

---

### Option 4: Cloudflare Pages + Workers
**Pros**:
- Free tier (generous)
- Global CDN (Cloudflare's edge network)
- Workers for serverless functions
- Good DDoS protection

**Cons**:
- **Workers CPU time limits** (10ms free tier, 50ms paid)
- **Cold starts** (worse than Cloud Run for Python)
- **Not ideal for FastAPI** (Python runtime in Workers is experimental)
- **Still need GCP**: Gemini API requires GCP anyway

---

## Decision

**We chose Option 2: Hybrid Deployment (GitHub Pages + GCP Cloud Run)**

### Implementation

**Static Content** (GitHub Pages):
```yaml
# .github/workflows/deploy.yml (existing, no changes)
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docusaurus
        run: |
          cd book-source
          npm install
          npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./book-source/build
```

**Dynamic Backend** (GCP Cloud Run):
```bash
# Deploy FastAPI backend
gcloud run deploy agentic-backend \
  --source ./backend \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=projects/PROJECT_ID/secrets/gemini-key \
  --set-env-vars ALLOWED_ORIGINS=https://panaversity.github.io
```

**DNS Configuration**:
```
panaversity.github.io               → GitHub Pages (static book)
api.ai-native.panaversity.org       → Cloud Run (FastAPI backend)
```

**Frontend API Calls** (React):
```typescript
// src/config/api.ts
export const API_BASE_URL = 'https://api.ai-native.panaversity.org';

// src/components/AgenticChat.tsx
const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Send cookies for session management
  body: JSON.stringify({ session_id, message })
});
```

### Rationale

1. **Cost Savings**: $0 for static hosting vs $20-30/month on GCP
   - GitHub Pages free tier sufficient (public repo, <1 GB)
   - Only pay for dynamic backend ($30/month)
   - Total savings: $20-30/month

2. **No Migration Overhead**: Existing setup remains unchanged
   - 5 chapters already deployed to GitHub Pages
   - CI/CD pipeline (GitHub Actions) working perfectly
   - No need to learn Cloud Build or Cloud Storage

3. **Performance**: GitHub Pages uses Fastly CDN (global distribution)
   - 200+ edge locations worldwide
   - <100ms latency for most users
   - Auto-scaling for traffic spikes

4. **HTTPS Everywhere**: Both platforms provide free SSL
   - GitHub Pages: Automatic via Let's Encrypt
   - Cloud Run: Automatic via Google-managed certificates
   - No manual certificate management

5. **Separation of Concerns**: Logical boundary between static and dynamic
   - Static: Book content, images, CSS, JS
   - Dynamic: AI chat, session management, database queries
   - Clear architectural boundaries

6. **Developer Experience**: Simple debugging
   - Frontend changes: Push to GitHub (auto-deploys)
   - Backend changes: `gcloud run deploy` (single command)
   - No complex monolith deployment

## Consequences

### Positive
- ✅ Zero cost for static hosting (GitHub Pages free)
- ✅ No migration needed (existing Docusaurus setup preserved)
- ✅ Fast global CDN (Fastly via GitHub Pages)
- ✅ Automatic HTTPS on both domains
- ✅ Clear separation: static (frontend) vs dynamic (backend)
- ✅ Independent deployment pipelines (frontend and backend decouple)

### Negative
- ⚠️ CORS configuration required (frontend and backend on different domains)
- ⚠️ Two domains to manage (GitHub Pages + Cloud Run custom domain)
- ⚠️ Slight latency overhead (cross-origin requests, ~10-20ms)
- ⚠️ Cookie complexity (need SameSite=None for cross-domain cookies)

### Neutral
- 📝 Frontend calls backend via `https://api.ai-native.panaversity.org`
- 📝 CORS middleware configured in FastAPI (`allow_origins` whitelist)
- 📝 Session management via JWT (avoid cookie cross-domain issues)
- 📝 DNS: Need to configure custom domain for Cloud Run

## Validation

We will validate this decision by:
1. **Cost tracking**: Confirm GitHub Pages remains free (<1 GB, public repo)
2. **Performance**: Measure page load times (target: <2 seconds for book pages)
3. **API latency**: Measure cross-origin request overhead (target: <50ms added latency)
4. **CORS testing**: Verify no CORS errors in browser console
5. **Deployment velocity**: Confirm <5 minutes from commit to production (both frontend and backend)

## Security Considerations

**CORS Policy** (FastAPI):
```python
# Only allow requests from GitHub Pages domain
allow_origins=["https://panaversity.github.io"]

# For local development, add:
if os.getenv("ENV") == "development":
    allow_origins.append("http://localhost:3000")
```

**Session Management** (JWT instead of cookies):
```python
# Avoid cross-domain cookie issues
# Use JWT stored in localStorage instead
@app.post("/api/auth/login")
async def login():
    token = create_jwt(user_id)
    return {"access_token": token}

# Frontend stores token in localStorage
localStorage.setItem("access_token", token);

// Send token in Authorization header
fetch(API_BASE_URL, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
```

## References

- GitHub Pages Documentation: https://docs.github.com/en/pages
- Cloud Run Custom Domains: https://cloud.google.com/run/docs/mapping-custom-domains
- FastAPI CORS: https://fastapi.tiangolo.com/tutorial/cors/
- JWT Best Practices: https://tools.ietf.org/html/rfc8725

## Supersedes

None (initial decision)

## Superseded By

None (current)

## Migration Path (If Needed)

If GitHub Pages becomes insufficient (e.g., private repo requirement, >1 GB content):

**Option A: Migrate to GCP Cloud Storage + CDN**
```bash
# 1. Create storage bucket
gsutil mb gs://ai-native-book

# 2. Upload Docusaurus build
gsutil -m rsync -r ./book-source/build gs://ai-native-book

# 3. Enable Cloud CDN
gcloud compute backend-buckets create ai-native-book-backend \
  --gcs-bucket-name=ai-native-book \
  --enable-cdn
```

**Option B: Keep GitHub Pages, Use Cloudflare CDN**
- Free tier (no cost increase)
- Better DDoS protection
- Custom caching rules
- No code changes needed (just DNS update)
