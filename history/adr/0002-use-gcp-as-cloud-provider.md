# ADR-0002: Use GCP as Cloud Provider

**Status**: Accepted
**Date**: 2025-11-04
**Deciders**: Technical Team
**Feature**: 001-agentic-interface

## Context

We need a cloud provider to host the FastAPI backend that serves as the OpenAI SDK endpoint (routing to Gemini). The backend handles:
- AI chat session management
- Function calling orchestration (diagrams, code insertion)
- Chapter context retrieval
- User session persistence

The book's static content is already deployed on GitHub Pages (free), so we only need cloud infrastructure for the backend API.

## Decision Drivers

1. **Gemini Integration**: Native API access without additional proxies
2. **Cost**: Educational platform budget constraints
3. **Simplicity**: Minimal operational overhead
4. **Scalability**: Handle 1,000+ concurrent users
5. **Developer Experience**: Easy deployment and monitoring

## Considered Options

### Option 1: AWS (Amazon Web Services)
**Pros**:
- Market leader with extensive services
- Lambda for serverless functions
- Well-documented Python support
- Global CDN (CloudFront)
- Mature ecosystem

**Cons**:
- **No native Gemini integration** (requires proxy configuration)
- More expensive for small workloads ($50-100/month baseline)
- Steeper learning curve (IAM, VPC, etc.)
- Billing complexity

**Cost Analysis**:
```
Lambda: 1M requests/month × $0.20/1M = $0.20
API Gateway: 1M requests × $3.50/1M = $3.50
DynamoDB (sessions): $5/month
Total: ~$50-80/month (with hidden costs)
```

---

### Option 2: Microsoft Azure
**Pros**:
- Azure Functions for serverless
- Good Python support
- Enterprise integration (Active Directory)
- Global presence

**Cons**:
- **No native Gemini integration** (requires proxy)
- More expensive than GCP for equivalent services
- Complex pricing model
- Less popular for Python/AI workloads

**Cost Analysis**:
```
Azure Functions: 1M executions × $0.20/1M = $0.20
API Management: $45/month (basic tier)
Cosmos DB: $24/month (minimum)
Total: ~$70-100/month
```

---

### Option 3: Google Cloud Platform (GCP) ✅ (CHOSEN)
**Pros**:
- **Native Gemini API access** (no proxy needed)
- **Unified billing**: Gemini + infrastructure on one bill
- **Cloud Run**: Serverless containers with generous free tier
- **Simple pricing**: Pay-per-use with no baseline costs
- **Fast deployment**: `gcloud run deploy` single command
- **Automatic HTTPS**: Free SSL certificates
- **Global CDN**: Built-in via Cloud Load Balancing
- **Python-native**: First-class FastAPI support

**Cons**:
- Smaller ecosystem than AWS (fewer third-party integrations)
- Less mature enterprise tooling (compared to Azure)
- Vendor lock-in for Gemini (but easy to migrate backend)

**Cost Analysis**:
```
Cloud Run:
  - 2M requests/month × $0.40/1M = $0.80
  - 180,000 vCPU-seconds (free tier covers most)
  - 360,000 GB-seconds memory (free tier covers most)

Cloud SQL (PostgreSQL for sessions):
  - Shared-core instance: $9.37/month
  - 10 GB storage: $1.70/month

Total: ~$12-30/month (well within free/low-cost tiers)
```

---

### Option 4: Self-Hosted (VPS like DigitalOcean, Linode)
**Pros**:
- Predictable monthly cost ($5-12/month for basic VPS)
- Full control over environment
- No vendor lock-in

**Cons**:
- **Manual infrastructure management** (security patches, monitoring, backups)
- **No auto-scaling** (manual server resizing)
- **Single point of failure** (no built-in redundancy)
- **No native Gemini integration benefits**
- **Operational burden**: DevOps becomes full-time job

**Cost Analysis**:
```
DigitalOcean Droplet: $12/month (2 vCPU, 2 GB RAM)
Managed PostgreSQL: $15/month
Total: ~$27/month + ops time
```

---

## Decision

**We chose Option 3: Google Cloud Platform (GCP)**

### Implementation

**Backend Deployment** (Cloud Run):
```bash
# Deploy FastAPI backend
gcloud run deploy agentic-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=projects/PROJECT_ID/secrets/gemini-key
```

**Database** (Cloud SQL PostgreSQL):
```bash
# Create managed PostgreSQL instance
gcloud sql instances create agentic-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1
```

**Secrets Management** (Secret Manager):
```bash
# Store Gemini API key securely
echo -n "YOUR_GEMINI_KEY" | gcloud secrets create gemini-key \
  --data-file=-
```

### Rationale

1. **Native Gemini Integration**: GCP provides direct API access without proxy configuration
   - Gemini endpoint: `https://generativelanguage.googleapis.com/v1beta/openai/`
   - Same project billing (consolidated costs)
   - No cross-cloud latency

2. **Cost Efficiency**: $12-30/month vs $50-100/month (AWS/Azure)
   - Cloud Run free tier: 2M requests/month
   - No baseline infrastructure costs (serverless)
   - Pay-per-use model aligns with educational traffic patterns

3. **Developer Experience**: Single-command deployment
   - `gcloud run deploy` handles: build, push, deploy, HTTPS, CDN
   - No VPC, security groups, load balancers to configure
   - Automatic scaling (0 to N containers)

4. **Operational Simplicity**: Managed services eliminate DevOps overhead
   - Cloud Run: No servers to patch
   - Cloud SQL: Automated backups, HA, patches
   - Secret Manager: Encrypted key storage

5. **Scalability**: Handles 1,000+ concurrent users automatically
   - Cloud Run scales to 1,000 containers per service
   - Global load balancing included
   - No manual capacity planning

## Consequences

### Positive
- ✅ Minimal monthly costs (~$12-30 vs $50-100 on AWS/Azure)
- ✅ Native Gemini API access (no proxy overhead)
- ✅ Unified GCP billing (infrastructure + AI costs together)
- ✅ Fast deployment cycles (CI/CD via Cloud Build)
- ✅ Automatic HTTPS and CDN (no configuration needed)
- ✅ Serverless architecture (zero maintenance when idle)

### Negative
- ⚠️ Vendor lock-in for Gemini (mitigated: OpenAI SDK abstraction allows migration)
- ⚠️ Smaller third-party ecosystem than AWS
- ⚠️ Less enterprise tooling than Azure (not relevant for educational project)

### Neutral
- 📝 Team needs to learn GCP CLI and Console (well-documented)
- 📝 Hybrid architecture: GitHub Pages (static) + GCP (dynamic)
- 📝 Cross-origin requests require CORS configuration

## Validation

We will validate this decision by:
1. **Cost monitoring**: Track monthly GCP spend (target: <$30/month)
2. **Performance**: API response times <500ms (p95)
3. **Availability**: 99.5% uptime (Cloud Run SLA)
4. **Deployment velocity**: <5 minutes from commit to production
5. **Gemini integration**: Zero proxy-related latency issues

## References

- GCP Cloud Run Pricing: https://cloud.google.com/run/pricing
- Gemini API on GCP: https://ai.google.dev/gemini-api/docs/openai
- Cloud Run Documentation: https://cloud.google.com/run/docs
- Cloud SQL Pricing: https://cloud.google.com/sql/pricing

## Supersedes

None (initial decision)

## Superseded By

None (current)
