# ADR-0001: Use OpenAI SDK with Gemini Endpoint

**Status**: Accepted
**Date**: 2025-11-04
**Deciders**: Technical Team
**Feature**: 001-agentic-interface

## Context

We need to integrate an AI agent that provides contextual help to readers based on the current chapter content. The agent must:
- Understand and respond to natural language questions
- Generate code examples with explanations
- Create Mermaid diagrams for visual learning
- Support function calling (tools) for actions like inserting code into terminal
- Be cost-effective for an educational platform

## Decision Drivers

1. **Cost**: Educational platform needs to minimize AI API costs
2. **API Quality**: Need a well-documented, stable SDK
3. **Provider Flexibility**: Ability to switch AI providers without major refactoring
4. **Function Calling**: Support for tool/function calling is essential
5. **Developer Experience**: Easy to integrate and maintain

## Considered Options

### Option 1: OpenAI SDK with OpenAI API (GPT-4)
**Pros**:
- Best-in-class SDK (Python + TypeScript)
- Excellent documentation and community support
- Native function calling support
- Fast response times
- Reliable infrastructure

**Cons**:
- **Expensive**: ~$0.03 per 1K tokens (input) + $0.06 per 1K tokens (output)
- **Monthly cost**: Estimated $3,000-5,000 for 1,000 active users
- Requires OpenAI API key and billing

**Cost Analysis**:
```
1000 users × 50 messages/day × 2K tokens/message × 30 days = 3B tokens/month
Input: 1.5B tokens × $0.03/1K = $45,000
Output: 1.5B tokens × $0.06/1K = $90,000
Total: ~$135,000/month (unrealistic for educational platform)
```

---

### Option 2: Google Gemini SDK (Native)
**Pros**:
- **Free tier**: 2M tokens/day (60M tokens/month)
- **Generous**: Beyond free tier, $0.00125 per 1K tokens
- Good function calling support
- Native GCP integration
- Fast inference

**Cons**:
- Different API interface from OpenAI (less familiar)
- Smaller community and fewer examples
- Would require learning new SDK patterns
- Less mature ecosystem (fewer tools/libraries)

**Cost Analysis**:
```
First 60M tokens/month: FREE
Additional tokens: $0.00125/1K = ~$50/month for overages
Total: ~$50/month (with free tier)
```

---

### Option 3: OpenAI SDK with Gemini Endpoint (CHOSEN) ✅
**Pros**:
- **Best of both worlds**: OpenAI's excellent SDK + Gemini's free tier
- **Familiar API**: Use well-documented OpenAI patterns
- **Cost-effective**: Gemini's generous free tier ($0 for most usage)
- **Flexible**: Easy to switch back to OpenAI or other providers
- **Function calling**: Supported by both OpenAI SDK and Gemini API
- **Developer experience**: Leverage existing OpenAI tutorials and documentation

**Cons**:
- Requires using Gemini's OpenAI-compatible endpoint (additional configuration step)
- Slight differences in behavior between OpenAI and Gemini (edge cases)
- Dependent on Gemini maintaining OpenAI compatibility

**Cost Analysis**:
```
First 60M tokens/month: FREE (via Gemini)
OpenAI SDK: FREE (open-source library)
Total: ~$0/month for AI (only pay GCP infrastructure costs)
```

---

### Option 4: LangChain or LlamaIndex
**Pros**:
- Provider-agnostic abstraction layer
- Rich ecosystem of tools and integrations
- Easy to swap between models

**Cons**:
- **Heavy dependency**: Adds significant complexity
- **Overhead**: Extra layer of abstraction slows development
- **Overkill**: We only need chat + function calling, not full orchestration framework
- Still requires paying for underlying API (OpenAI or Gemini)

---

### Option 5: Self-hosted Open Source Model (Llama 3, Mistral)
**Pros**:
- No per-token costs
- Full control over model
- Data privacy

**Cons**:
- **Infrastructure cost**: GPU servers expensive (~$500-2,000/month)
- **Complexity**: Model deployment, scaling, monitoring
- **Performance**: Slower inference than managed APIs
- **Quality**: Open source models lag behind GPT-4 and Gemini
- **Function calling**: Limited or no support in open source models

---

## Decision

**We chose Option 3: OpenAI SDK with Gemini Endpoint**

### Implementation

```python
from openai import OpenAI

# Instead of pointing to OpenAI
client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

# Use OpenAI SDK API as normal
response = client.chat.completions.create(
    model="gemini-2.0-flash-exp",  # Gemini model name
    messages=[...],
    tools=[...],
    temperature=0.7
)
```

### Rationale

1. **Cost Savings**: Saves ~$3,000-5,000/month vs OpenAI GPT-4
2. **Familiar API**: Developers know OpenAI SDK patterns
3. **Easy Migration**: Can switch to OpenAI by changing 2 lines of code:
   ```python
   api_key=os.getenv("OPENAI_API_KEY")
   base_url=None  # Uses default OpenAI endpoint
   ```
4. **Function Calling**: Both support OpenAI's function calling format
5. **Free Tier**: Gemini's 2M tokens/day covers our educational use case
6. **GCP Native**: We're already using GCP for infrastructure, so Gemini fits naturally

## Consequences

### Positive
- ✅ Near-zero AI API costs (free tier sufficient for 1,000 users)
- ✅ Familiar developer experience (OpenAI SDK)
- ✅ Easy provider switching (change base_url only)
- ✅ Rich documentation and examples (OpenAI's resources apply)
- ✅ GCP ecosystem integration (unified billing, monitoring)

### Negative
- ⚠️ Dependency on Gemini maintaining OpenAI compatibility
- ⚠️ Potential subtle differences in behavior (need testing)
- ⚠️ If Gemini changes pricing, need to re-evaluate

### Neutral
- 📝 Need to document the base_url override clearly
- 📝 Need to test function calling thoroughly with Gemini backend
- 📝 Monitor token usage to stay within free tier limits

## Validation

We will validate this decision by:
1. **Cost monitoring**: Track token usage monthly (should be <60M tokens = free)
2. **Quality testing**: Compare Gemini responses to OpenAI baseline
3. **Function calling**: Test all tools (generate_diagram, insert_code, navigate) work correctly
4. **Performance**: Measure response latency (should be <3 seconds)
5. **Fallback plan**: Keep OpenAI credentials ready if Gemini fails

## References

- OpenAI SDK Documentation: https://github.com/openai/openai-python
- Gemini API OpenAI Compatibility: https://ai.google.dev/gemini-api/docs/openai
- Gemini Pricing: https://ai.google.dev/pricing
- OpenAI Pricing: https://openai.com/pricing

## Supersedes

None (initial decision)

## Superseded By

None (current)
