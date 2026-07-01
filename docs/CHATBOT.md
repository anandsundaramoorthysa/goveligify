# CheckMyEligibility — Chatbot Development Guide

> End-to-end technical reference for the AI assistant at `/chat`.

---

## Overview

The CheckMyEligibility chatbot helps **Indian students** (UG, PG, PhD, Diploma, Professional courses) discover government schemes — scholarships, fellowships, education loans, and grants — they are eligible for.

The user describes their situation in plain language and the bot replies with matching schemes, eligibility details, required documents, and a direct link to apply on the official government portal.

The bot **never submits applications** — it only points users to the official government portal. This is intentional for trust, consent, and legal safety.

---

## Current Status

| Layer | Status |
|-------|--------|
| Chat UI (`/chat`) | Done |
| API route (`POST /api/chat`) | Done — mock only |
| Mock engine (keyword matching, student intents) | Done |
| FastAPI backend (Python, Railway) | Not started — Phase 1 |
| PostgreSQL + pgvector | Not started — Phase 1 |
| LiteLLM + OpenRouter integration | Not started — Phase 1 |
| Student eligibility structured queries | Not started — Phase 1 |
| RAG pipeline | Not started — Phase 1 |
| Scheme comparison feature | Planned — Phase 1 |
| Multilingual (Tamil, Hindi) | Planned — Phase 1 |

---

## Architecture

```
Browser (/chat page)
  │
  └─ ChatScreen (React client component)
       │
       └─ fetch  POST /api/chat  (Next.js proxy on Vercel)
                    │
                    └─ FastAPI backend (Railway)
                           ├─ PostgreSQL structured eligibility query
                           ├─ LiteLLM → OpenRouter (LLM response generation)
                           └─ pgvector RAG (follow-up / nuanced queries only)
```

**Now (Phase 1 mock):** `/api/chat` calls `mockEngine` locally — no FastAPI, no DB, no LLM.
**Phase 1 real:** `/api/chat` proxies to FastAPI on Railway.

---

## Target Audience

**Primary:** Indian students.
- Undergraduate (UG)
- Postgraduate (PG)
- PhD / Research scholars
- Diploma students
- Professional course students (engineering, medical, law, etc.)

**Why students first?**
Students frequently search for scholarships, fellowships, and grants scattered across multiple government portals. They are comfortable using AI chatbots, and a student-focused MVP is easier to validate before expanding to other beneficiary groups.

---

## File Structure

```
src/
├── app/
│   ├── api/chat/route.ts          ← POST /api/chat (proxy to FastAPI in Phase 1)
│   └── chat/page.tsx              ← /chat full-screen page
│
├── components/chat/
│   ├── ChatScreen.tsx             ← main orchestrator (100dvh client island)
│   ├── SchemeResultCard.tsx       ← scheme result cards with "Apply" link
│   └── screen/                   ← UI sub-components (bubbles, composer, chips…)
│
└── lib/chat/
    ├── engine.ts                  ← ChatEngine interface (the swap seam)
    ├── mockEngine.ts              ← current — keyword intent matching (student intents)
    ├── client.ts                  ← browser-side fetch wrapper
    ├── openChat.ts                ← chatHref() helper, ?q= deep-link
    ├── transcript.ts              ← localStorage persistence
    └── translations.ts            ← multilingual strings (LangCode ready)
```

---

## Current Mock Engine

`src/lib/chat/mockEngine.ts` — deterministic, no network, no LLM. Covers student-focused intents:

| Intent | Keywords |
|--------|---------|
| Scholarship seeker | scholarship, merit, financial aid, award |
| SC/ST student | sc, st, dalit, tribal, scheduled caste/tribe |
| Minority student | minority, muslim, christian, sikh, obc |
| Girl / women in education | girl, women, female student |
| Education loan | education loan, study loan, vidya lakshmi |
| Fellowship / PhD | fellowship, phd, mphil, jrf, srf, research, ugc |
| Differently-abled student | disability, disabled, divyang, saksham |
| Technical education | engineering, medical, aicte, polytechnic, diploma |
| NE / Hill region | northeast, assam, manipur, ishan, hill area |
| Postgraduate | postgraduate, pg, masters, mtech, mba, msc |

---

## Tech Stack

### Frontend (Vercel)
- Next.js 14 + TypeScript
- Tailwind CSS + shadcn/ui
- `ChatEngine` interface as the abstraction seam

### Backend (Railway)
- FastAPI (Python)
- LiteLLM + OpenRouter (free model providers)

### Database (Railway)
- PostgreSQL (structured eligibility data)
- pgvector (vector embeddings for RAG)

### Eligibility Logic
Eligibility checking uses **structured PostgreSQL queries first**, RAG only for nuanced follow-ups.

```
User describes situation → FastAPI extracts entities
  (course_level, state, category, income, gender, disability)
  │
  ▼
PostgreSQL: WHERE conditions match → returns eligible schemes
  │
  ▼
LiteLLM → OpenRouter: formats plain-language response with citations
```

---

## Phase 1 — FastAPI Backend Plan

### API endpoints (FastAPI)

```
POST /chat
  body: { message: str, history: list[dict] }
  returns: { messages, schemeResults, quickReplies }

GET /schemes?category=&state=&income=&course_level=
  returns: list of matching schemes

GET /schemes/{id}
  returns: full scheme detail
```

### Database schema (PostgreSQL)

```sql
CREATE TABLE schemes (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  ministry      TEXT,
  category      TEXT,            -- 'scholarship', 'fellowship', 'loan', 'grant'
  course_level  TEXT[],          -- ['UG', 'PG', 'PhD', 'Diploma', 'any']
  gender        TEXT,            -- 'female', 'male', 'any'
  social_category TEXT[],        -- ['SC', 'ST', 'OBC', 'Minority', 'General']
  max_income    INTEGER,         -- annual family income ceiling in ₹
  state         TEXT[],          -- ['all-india', 'tamil-nadu', …]
  benefits      TEXT,
  documents     JSONB,
  official_url  TEXT NOT NULL,
  open_date     DATE,
  close_date    DATE,
  last_verified DATE NOT NULL,
  embedding     vector(1536)     -- pgvector for RAG
);
```

### LiteLLM + OpenRouter

```python
from litellm import completion

response = completion(
    model="openrouter/meta-llama/llama-3-8b-instruct:free",
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT},
        *history,
        {"role": "user", "content": user_message}
    ]
)
```

Free models via OpenRouter — auto-fallback if one is rate-limited.

### RAG (pgvector)

Used only for follow-up questions and nuanced queries that go beyond structured filters:

```python
embedding = embed(user_message)
results = db.execute(
    "SELECT * FROM schemes ORDER BY embedding <-> $1 LIMIT 5",
    [embedding]
)
```

---

## Data Sources

Collect data only from official government websites:

| Source | URL | Type |
|--------|-----|------|
| National Scholarship Portal | scholarships.gov.in | Central scholarships |
| University Grants Commission | ugc.gov.in | Higher education fellowships |
| AICTE | aicte-india.org | Technical education scholarships |
| Ministry of Education | education.gov.in | Education policy schemes |
| State scholarship portals | (state-specific) | State-level scholarships |
| MyScheme | myscheme.gov.in | Discovery only — verify on source |

---

## MVP Scope

Phase 1 release:
- 100–300 validated student education schemes
- Student eligibility chatbot (scholarship, fellowship, loan, grant)
- Multilingual text (English + Tamil + Hindi)
- Simplified explanations with official citations
- Scheme comparison (interactive chips → eligibility-aware verdict)
- Search and recommendations

---

## Running Locally (Phase 1 Mock)

```bash
pnpm install
pnpm dev
# http://localhost:3000/chat
```

The mock engine runs entirely locally — no API keys or external services needed.

---

## Running FastAPI Backend (Phase 2)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# http://localhost:8000
```

Set environment variables:
```
DATABASE_URL=postgresql://...
OPENROUTER_API_KEY=sk-...
```

---

## Related Documentation

- [Architecture](./ARCHITECTURE.md) — full stack diagram and swap seams
- [Roadmap](./ROADMAP.md) — phased plan (Phase 1 → Phase 4)
