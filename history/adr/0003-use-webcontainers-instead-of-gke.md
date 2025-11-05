# ADR-0003: Defer Terminal Environment to Future Enhancement

**Status**: Superseded by MVP scope reduction
**Original Decision**: Use WebContainers Instead of GKE Autopilot
**Date**: 2025-11-04 (Original), 2025-11-05 (Revised)
**Deciders**: Technical Team
**Feature**: 001-agentic-interface

## Revision Note (2025-11-05)

**Decision**: Terminal environment (whether WebContainers or GKE) is **deferred to future enhancement**.

**MVP Scope**: Chat + Canvas only (no terminal execution).

**Rationale**:
- Focus MVP on core value: AI-assisted learning through contextual chat and visual diagrams
- Terminal adds complexity without validating primary hypothesis (AI tutoring effectiveness)
- Users can execute code examples using ChatGPT, Claude, local environments, or StackBlitz
- Faster time-to-market: Ship chat + canvas in weeks vs months with terminal
- Reduces risk: Validate AI chat value before investing in terminal infrastructure

**Original ADR preserved below for future reference when terminal is re-introduced.**

---

## Context

The agentic interface requires isolated terminal environments for each user to practice coding exercises. Requirements:
- Execute code locally (Node.js/JavaScript initially, Python future consideration)
- Persistent file system across browser sessions
- No cross-user contamination (security isolation)
- Low latency (<2 seconds for command execution)
- Support 1,000+ concurrent users
- Cost-effective for educational platform

Initial architecture proposed GKE Autopilot (Kubernetes) with one pod per user. This ADR evaluates whether Kubernetes is necessary or if a simpler solution exists.

## Decision Drivers

1. **Cost**: Educational budget constraints (<$50/month target)
2. **Simplicity**: Minimize operational complexity
3. **Security**: Zero cross-user file access
4. **Performance**: Fast terminal response times
5. **Scalability**: Handle traffic spikes (exam periods, course launches)
6. **MVP Speed**: Ship feature in weeks, not months

## Considered Options

### Option 1: GKE Autopilot with Pod-per-User
**Pros**:
- Full Linux environment (Ubuntu)
- Python + Node.js pre-installed
- True multi-user isolation (Kubernetes namespaces)
- Production-grade orchestration
- Persistent volumes for file storage
- Can run any language/tool

**Cons**:
- **Expensive**: ~$440/month baseline (see cost analysis below)
- **Complex**: Requires Kubernetes expertise
- **Slow startup**: 10-30 seconds to spin up new pod
- **Operational overhead**: Monitoring, scaling policies, pod lifecycle management
- **Overkill for MVP**: Full Kubernetes for browser-based learning

**Cost Analysis**:
```
GKE Autopilot cluster management: $73/month
Pods (100 concurrent users):
  - 100 pods × 0.5 vCPU × $0.04/vCPU-hour × 730 hours = $1,460/month
  - 100 pods × 1 GB RAM × $0.004/GB-hour × 730 hours = $292/month
Persistent volumes (100 users × 5 GB): $20/month
Networking (egress): $50/month

Total: ~$1,895/month (for 100 concurrent users)

Optimized (using spot instances + aggressive eviction):
  - ~$440/month (still 15× more expensive than alternatives)
```

---

### Option 2: Cloud Run Jobs (Ephemeral Containers)
**Pros**:
- Serverless (no baseline cost)
- Scales to zero
- Simple deployment
- Per-second billing

**Cons**:
- **No persistent state** (containers are ephemeral)
- **Slow cold starts** (5-10 seconds)
- **Connection management complex** (WebSocket to ephemeral container)
- **Not designed for interactive sessions** (batch jobs, not terminals)
- **Max 1 hour execution** (hard limit)

**Cost Analysis**:
```
1,000 users × 10 minutes/session × 30 days = 5,000 container-hours/month
5,000 hours × $0.18/vCPU-hour = $900/month
(Still expensive, no persistence benefit)
```

---

### Option 3: WebContainers (Browser-Based Node.js via WASM) ✅ (CHOSEN)
**Pros**:
- **Zero server cost** (runs in user's browser)
- **Instant startup** (<1 second)
- **Perfect isolation** (each user's environment is sandboxed in their browser)
- **Persistent storage** (browser IndexedDB, survives sessions)
- **No backend needed** (terminal logic runs client-side)
- **Infinite scalability** (scales with number of browsers, not servers)
- **Production-ready**: Powers StackBlitz, used by millions

**Cons**:
- **Node.js only** (no Python support currently)
- **Browser dependency** (requires modern browser with WASM support)
- **Limited system access** (no true shell, simulated filesystem)
- **Educational trade-off**: Teaches concepts with JavaScript, not Python

**Cost Analysis**:
```
Server cost: $0/month (runs in browser)
Backend cost: ~$30/month (Cloud Run for chat API only, not terminals)
Total: $30/month (93% cheaper than GKE)
```

**Technical Capabilities**:
- ✅ npm/pnpm package installation
- ✅ File system operations (read/write/delete)
- ✅ Terminal emulation (xterm.js integration)
- ✅ Port forwarding (preview running apps)
- ✅ Persistent across sessions (IndexedDB)
- ❌ Python (current limitation, may change in future)
- ❌ System-level commands (no apt, no docker)

---

### Option 4: E2B (Cloud-Based Code Execution Sandbox)
**Pros**:
- Python + Node.js support
- API-driven (simple integration)
- Secure sandboxing
- Pre-built terminal integration

**Cons**:
- **Expensive**: $0.015/minute per sandbox = $9/hour
- **Third-party dependency** (startup risk)
- **Not free tier available**
- **Requires backend proxy** (can't call from browser directly)

**Cost Analysis**:
```
1,000 users × 10 minutes/session × 30 days = 300,000 minutes/month
300,000 minutes × $0.015/minute = $4,500/month
(45× more expensive than WebContainers)
```

---

### Option 5: Shared Backend Terminal Server (ttyd/gotty)
**Pros**:
- Centralized management
- Real Linux environment
- Low per-user overhead

**Cons**:
- **Security nightmare**: Shared filesystem, potential privilege escalation
- **Session management complex**: User authentication, isolation
- **Single point of failure**: One server crash affects all users
- **Resource contention**: Users compete for CPU/memory

**Cost Analysis**:
```
VM (16 vCPU, 32 GB RAM): $200/month
(Still need session isolation, operational overhead)
```

---

## Decision

**We chose Option 3: WebContainers (Browser-Based Node.js via WASM)**

### Implementation

**Frontend Integration** (React):
```typescript
import { WebContainer } from '@webcontainer/api';

// Boot WebContainer in browser
const webcontainer = await WebContainer.boot();

// Spawn shell
const shellProcess = await webcontainer.spawn('jsh', {
  terminal: { cols: 80, rows: 24 }
});

// Connect to xterm.js
shellProcess.output.pipeTo(
  new WritableStream({
    write(data) { terminal.write(data); }
  })
);

// Persist files in IndexedDB (automatic)
await webcontainer.fs.writeFile('hello.js', 'console.log("Hello World");');
```

**No Backend Required** for terminal execution (only backend needed for AI chat).

### Rationale

1. **Cost Efficiency**: $0 for terminal infrastructure vs $440+/month
   - Terminals run in user's browser (zero server cost)
   - Backend only handles chat API (~$30/month)
   - 93% cost reduction vs GKE

2. **Perfect Security Isolation**: Browser sandboxing = zero cross-user risk
   - Each user's WebContainer is isolated by browser security model
   - No shared filesystem (impossible for users to access each other's files)
   - No privilege escalation vulnerabilities

3. **Instant Startup**: <1 second vs 10-30 seconds (GKE pod startup)
   - WebAssembly boots instantly
   - No container image pulling
   - No network round-trips

4. **Infinite Scalability**: Scales with browsers, not servers
   - 1 user = 1 browser = 1 WebContainer
   - 10,000 users = 10,000 browsers = $0 additional cost
   - No server capacity planning needed

5. **Production-Ready**: Proven technology (StackBlitz, millions of users)
   - WebContainers power StackBlitz (1M+ developers)
   - Battle-tested across browsers
   - Active maintenance by StackBlitz team

6. **MVP-Friendly**: Ship in weeks, not months
   - No Kubernetes learning curve
   - No DevOps infrastructure setup
   - Pure frontend integration (React components)

### Educational Trade-Off: JavaScript Instead of Python

**Pedagogical Impact**:
- Book teaches **concepts**, not syntax
- Specification-Driven Development works in any language
- JavaScript teaches same fundamentals: variables, functions, async, APIs
- Students can apply concepts to Python independently

**Future Migration Path**:
- If Python becomes critical: Migrate to E2B or GKE later
- If WebContainers add Python support: Zero migration needed
- Spec-first methodology remains unchanged

**Quote from requirements**: "System MUST have Python 3.13+ pre-installed"
**Revised after cost/complexity analysis**: Accept Node.js-only for MVP, re-evaluate based on user feedback.

## Consequences

### Positive
- ✅ Zero infrastructure cost for terminals ($0 vs $440/month)
- ✅ Instant startup (<1 second vs 10-30 seconds)
- ✅ Perfect security isolation (browser sandboxing)
- ✅ Infinite scalability (no server capacity limits)
- ✅ No operational overhead (no Kubernetes, no pods, no monitoring)
- ✅ Persistent file storage (IndexedDB survives browser sessions)
- ✅ Production-ready technology (StackBlitz proven at scale)

### Negative
- ⚠️ No Python support (Node.js/JavaScript only)
- ⚠️ Browser dependency (requires modern browser with WASM)
- ⚠️ Limited system commands (no apt, sudo, docker)
- ⚠️ Educational compromise (teaches concepts with JS instead of Python)

### Neutral
- 📝 Requires modern browser (Chrome 87+, Firefox 89+, Safari 15.2+)
- 📝 Files stored in browser (5-10 MB typical, 50+ MB possible)
- 📝 Network-only features require backend proxy (external API calls)

## Validation

We will validate this decision by:
1. **User feedback**: Survey students on JavaScript vs Python preference
2. **Completion rates**: Track exercise completion (target: 70%+ finish terminal exercises)
3. **Performance**: Measure startup time (target: <1 second) and command execution latency (target: <100ms)
4. **Browser compatibility**: Test across Chrome, Firefox, Safari (target: 95%+ support)
5. **Migration trigger**: If 50%+ users request Python, re-evaluate E2B or GKE
6. **Cost savings**: Confirm $0 terminal infrastructure cost vs original $440/month budget

## References

- WebContainers Documentation: https://webcontainers.io/
- StackBlitz WebContainers: https://blog.stackblitz.com/posts/introducing-webcontainers/
- xterm.js (Terminal Emulator): https://xtermjs.org/
- Browser WASM Support: https://caniuse.com/wasm

## Supersedes

None (initial decision)

## Superseded By

None (current)

## Future Considerations

**If Python becomes critical**:
- Evaluate Pyodide (Python in WASM) - emerging, not production-ready
- Migrate to E2B (cost: $4,500/month for 1,000 users)
- Migrate to GKE Autopilot (cost: $440+/month)

**If WebContainers add Python**:
- Zero migration needed (just update curriculum examples)

**If browser compatibility becomes issue**:
- Provide fallback: "Open in StackBlitz" links (offload to StackBlitz platform)
