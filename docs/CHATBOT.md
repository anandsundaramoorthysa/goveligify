# CheckMyEligibility — Chatbot Development Guide

> End-to-end technical reference for the AI assistant at `/chat`.

---

## Overview

The CheckMyEligibility chatbot helps Indian citizens discover government schemes they're eligible for. The user describes their situation in plain language and the bot replies with matching schemes, eligibility details, required documents, and a direct link to apply on the official portal.

The bot **never submits applications** — it only points users to the official government portal. This is intentional for trust, consent, and legal safety.

---

## Current Status

| Layer | Status |
|-------|--------|
| Chat UI (`/chat`) | Done — Phase 1 |
| API route (`POST /api/chat`) | Done — Phase 1 |
| Mock engine (keyword matching) | Done — Phase 1 |
| Real LLM engine (RAG + free providers) | Not started — Phase 2 |
| Scheme data (3,237 validated schemes) | Pending Console export |
| Vector store (RAG) | Pending Phase 2 |
| Scheme comparison feature | Planned — Phase 2 |
| Rejection/grievance guidance | Planned — Phase 2 |

---

## Architecture

```
Browser (/chat page)
  │
  └─ ChatScreen (React client component)
       │
       └─ fetch  POST /api/chat
                    │
                    └─ ChatEngine interface (src/lib/chat/engine.ts)
                           │
                           ├─ Phase 1: mockEngine (keyword matching, no LLM)
                           └─ Phase 2: ragEngine (Vercel AI SDK + free LLM providers + RAG)
```

The key architectural decision is the **`ChatEngine` interface** — all UI code only calls this interface, so the Phase 2 swap is purely an internal change. No UI rewrite needed.

---

## File Structure

```
src/
├── app/
│   ├── api/chat/route.ts          ← POST /api/chat endpoint
│   └── chat/page.tsx              ← /chat full-screen page
│
├── components/chat/
│   ├── ChatScreen.tsx             ← main orchestrator (100dvh client island)
│   ├── SchemeResultCard.tsx       ← scheme result cards with "Apply" link
│   └── screen/                   ← UI sub-components (bubbles, composer, chips…)
│
└── lib/chat/
    ├── engine.ts                  ← ChatEngine interface (the swap seam)
    ├── mockEngine.ts              ← Phase 1 — keyword intent matching
    ├── client.ts                  ← browser-side fetch wrapper
    ├── openChat.ts                ← chatHref() helper, ?q= deep-link
    ├── transcript.ts              ← localStorage persistence
    ├── translations.ts            ← multilingual strings (LangCode ready)
    ├── preferences.ts             ← user preferences (sound, etc.)
    └── sound.ts                   ← message sound (optional)
```

---

## Phase 1 — Mock Engine (Current)

### How it works

`src/lib/chat/mockEngine.ts` — deterministic, no network, no LLM.

1. Input is lowercased and checked against 10 intent definitions (farmer, student, senior, business, women, housing, health, disability, skill, banking).
2. Each intent has a list of keywords. First match wins.
3. Matched intent → pulls real `Scheme` objects from `searchSchemes()` (keyword search over sample data) → returns a `BotTurn` with a text reply, up to 3 scheme cards, and quick-reply chips.
4. If no intent matches: runs a loose `searchSchemes(text)` and returns whatever comes back.
5. If nothing at all matches: friendly fallback asking the user to describe their situation.
6. Certificate questions (`"income certificate"`, `"caste certificate"`, etc.) are routed to `/certificates` without scheme cards.

### BotTurn type

```ts
interface BotTurn {
  messages: { content: string }[];   // markdown text replies
  schemeResults?: Scheme[];          // rendered as result cards
  quickReplies?: QuickReply[];       // follow-up chips shown after reply
}
```

### Current limitations

- Only 18 sample schemes (clearly labelled "sample / preview") — not real data
- No LLM — can only match pre-written keywords, no understanding of nuanced queries
- No memory across turns (each `send()` is stateless)
- Only English

---

## API Route

**`POST /api/chat`** — `src/app/api/chat/route.ts`

Request body:
```json
{
  "message": "I'm a farmer looking for crop insurance",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

Response:
```json
{
  "messages": [{ "content": "Here are some schemes that may help..." }],
  "schemeResults": [ /* Scheme[] */ ],
  "quickReplies": [ /* { "label": "...", "send": "..." }[] */ ]
}
```

Security guards already in place:
- Body size capped at 64 KB
- Message capped at 2,000 characters
- History capped at 30 items (oldest trimmed)
- Invalid JSON → 400
- Oversized payload → 413

---

## Phase 2 — Real LLM Engine (Planned)

### Design principle

**$0 operating cost** — every piece of the Phase 2 stack must run entirely on free tiers. Speed is NOT a concern. Only zero operating cost matters.

### Provider chain (Vercel AI SDK)

```
User message
  │
  ▼
Vercel AI SDK  (`ai` npm package)
  │
  ├─ 1. Groq (free tier — Llama 3 / Mixtral)
  ├─ 2. Cerebras (free tier)
  ├─ 3. Google Gemini (free tier)
  ├─ 4. OpenRouter :free models
  └─ 5. Mistral / Cohere / HuggingFace (free tiers)
```

Auto-fallback: if provider 1 is rate-limited, try 2, then 3, etc. If all fail → farmer-friendly "busy" message (no emoji, Lucide clock icon). The mock engine acts as the final never-fail fallback so the site always works.

> **Note:** Vercel AI SDK (`ai`) is just a library — it calls the provider's API. It does NOT run any model itself. You need a **free provider API key**, not a Vercel key.

### Answer caching

Same scheme question → 1 model call for thousands of users. Cache key = normalized question hash. Drastically reduces free-tier consumption.

### RAG (Retrieval Augmented Generation)

```
User message
  │
  ▼
Embed query → search vector store → retrieve top-k matching schemes
  │
  ▼
Inject retrieved schemes into system prompt
  │
  ▼
LLM generates a grounded, accurate answer (not hallucinated)
```

RAG keeps prompts tiny, which saves tokens and fits free-tier limits.

### BYOK ("Bring Your Own Key")

When all free tiers are exhausted:
- Show a simple "busy, try again in a few minutes" message (for ordinary citizens / farmers who cannot create API keys)
- Offer `"Advanced: connect your own key"` as a quiet secondary option for technical users
- **Security rule:** A BYOK key lives **only in the user's browser (`localStorage`) and is never sent to or stored on the server**

### Rate limiting

Per-IP rate limiting to prevent abuse and protect free-tier quotas. Implementation: Upstash or Vercel WAF (to be added when LLM is live).

---

## Phase 2 — Special Chat Features (Planned)

### Feature A — Scheme Comparison

**Problem with existing tools (myScheme chatbot):** When asked "Compare Stand-Up India and MUDRA Loan, which is better for me?", the response lists facts for both schemes side-by-side but never asks who the user is, never filters by their eligibility, and ends with "consider factors like..." — leaving the decision entirely to the user.

**How GovEligify will do it:**

```
User: "Compare Stand-Up India and MUDRA loan, which is better for me?"
  │
  Bot: "Are you SC/ST or a woman entrepreneur?"  →  [Yes] [No]
  │
  Bot: "How much loan do you need?"  →  [Under ₹10 lakh] [₹10 lakh–₹1 crore] [More]
  │
  Bot: "Is this a new business or existing?"  →  [New] [Existing]
  │
  ▼
  Verdict: "MUDRA Loan (Kishore) is the right choice for you.
           Stand-Up India requires SC/ST or woman status — you don't qualify.
           For MUDRA, here's how to apply: [step-by-step]"
```

One clear answer with reasoning. Not a list that leaves the user to decide.

**Intent triggers:** "compare X and Y", "which is better X or Y", "X vs Y"

### Feature B — Rejection / Grievance Guidance

**Problem with existing tools (myScheme chatbot):** When asked "My PMAY application was rejected — how do I appeal?", the response gives generic steps that don't account for state (appeal process differs by state), rejection reason (the fix is completely different depending on the reason), or timing (most schemes have 30–60 day appeal windows). It also links to CPGRAMS (a generic GOI complaints portal) instead of the scheme-specific grievance portal.

**How GovEligify will do it:**

```
User: "My PMAY application was rejected, what do I do?"
  │
  Bot: "I'm sorry to hear that. Which state are you in?"  →  [state chips]
  │
  Bot: "What reason did they give?"
       →  [Income too high] [Already owns a house] [Name not in list]
          [Documents missing] [No reason given] [Other]
  │
  ▼
  State-specific + reason-specific action plan:
  - Exact office name and designation to contact
  - Real grievance portal URL (pmayg.nic.in / pmaymis.gov.in, not CPGRAMS)
  - Time limit for appeal (e.g. "within 30 days of rejection letter")
  - Step-by-step next action
```

**Intent triggers:** "rejected", "application failed", "appeal", "complaint", "grievance"

**Data needed:** A lookup JSON mapping scheme → state → grievance portal URL + district-level office designation + appeal deadline. This will be maintained alongside the Console validation work.

---

## Data Pipeline

The chatbot's knowledge comes from validated scheme data produced by the Console team.

```
Console (18 reviewers validate 3,237 schemes)
  │
  ▼
Export: validated-schemes.v1.json
  │
  ▼
SchemeProvider (src/lib/data.ts) ← the data swap seam
  │
  ├─ /explore and /explore/[slug] pages (auto-populate with all 3,237 schemes)
  ├─ /chat chatbot (scheme search + RAG source)
  └─ sitemap.ts (auto-generates URLs for all scheme pages)
```

**Step 0 (prerequisite for everything):** Export the Console's validated schemes → wire into `SchemeProvider` → all pages and the chatbot auto-populate. No page rewrites needed.

---

## Chat UI Features

`src/components/chat/ChatScreen.tsx` is a `100dvh` client island that provides:

- Welcome state with persona starters and example quick-reply chips
- `role="log"` conversation with `aria-live="polite"` for accessibility
- User + assistant message bubbles
- `SchemeResultCard` — scheme name, ministry, category badge, summary, and "Apply on the official portal" link (`rel="nofollow noopener"`)
- Fixed bottom composer (textarea, send button, stop button)
- Quick-reply chips after each assistant turn
- Typing indicator
- Scroll-to-bottom pill
- `?q=` deep-link — marketing pages pass a query via URL, the chat auto-sends it once on load
- `localStorage` transcript persistence — conversation survives page refresh
- `/` to focus composer, `Esc` to cancel a pending response

---

## Multilingual Support

The `Message` type already carries a `LangCode` field. Translations live in `src/lib/chat/translations.ts`. Phase 6 will add Hindi, Tamil, and regional language responses.

myScheme's chatbot supports only English + Hindi for voice input. GovEligify plans support for 10 languages (en, ta, hi, ml, kn, te, mr, ur, sa, bn) — a real differentiator for South Indian and regional users.

---

## Running Locally

```bash
# Install dependencies
pnpm install

# Start dev server (port 3000, or 3100 if 3000 is busy)
pnpm dev

# Open the chatbot
# http://localhost:3000/chat
```

The mock engine runs entirely locally — no API keys needed for Phase 1.

---

## Phase 2 Implementation Checklist

Before starting Phase 2 chat:

- [ ] Console validation sprint complete (3,237 schemes reviewed)
- [ ] `validated-schemes.v1.json` exported from Console
- [ ] SchemeProvider wired to real data (Step 0)

Phase 2 chat build order:

- [ ] Install `ai` (Vercel AI SDK) + provider packages (`@ai-sdk/groq`, etc.)
- [ ] Build provider-fallback `ragEngine` replacing `mockEngine` in `route.ts`
- [ ] Add system prompt + guardrails (scope to Indian government schemes)
- [ ] Add answer caching
- [ ] Add per-IP rate limiting
- [ ] Add "busy" farmer-friendly message (Lucide clock icon, no emoji)
- [ ] Add optional BYOK flow (localStorage only, never server-side)
- [ ] Embed scheme data into vector store (RAG)
- [ ] Wire RAG retrieval into `ragEngine`
- [ ] Build scheme comparison flow (Feature A)
- [ ] Build rejection/grievance guidance flow (Feature B)
- [ ] Add Hindi + Tamil busy-message translations

---

## Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| LLM provider | Chain of free tiers (Groq → Cerebras → Gemini → OpenRouter) | $0 operating cost, auto-fallback |
| SDK | Vercel AI SDK (`ai`) | Swap/chain providers in one line |
| BYOK key storage | localStorage only, never server | Security — we never touch user's API key |
| No application submission | Bot links to official portal only | Trust, consent, legal safety |
| Caching | Answer cache before LLM call | Conserves free-tier quota under traffic |
| Fallback | Mock engine as final fallback | Bot always responds, even if all LLMs fail |
| Language | English first, regional in Phase 6 | Types already carry LangCode |

---

## Related Documentation

- [Architecture overview](./ARCHITECTURE.md) — the two swap seams (data + chat)
- [Roadmap](./ROADMAP.md) — full phased plan from Phase 1 to Phase 7
- Console repo — internal validation tool where scheme data is produced
