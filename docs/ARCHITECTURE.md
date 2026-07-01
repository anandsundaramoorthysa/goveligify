<p align="center">
  <img src="../public/brand/favicon.svg" alt="CheckMyEligibility logo" width="72" height="72" />
</p>

# Architecture

This document explains how CheckMyEligibility is structured — the two **swap seams** that let the mock chatbot become a real AI assistant without rewriting the UI, and the Phase 2 split between the Next.js frontend and the FastAPI backend.

## High-level overview

```
Browser
  │
  ├── Marketing pages (SSG on Vercel)
  │     └── SchemeProvider (src/lib/data.ts) → src/data/*
  │
  └── /chat (client)
        └── fetch  POST /api/chat  (Next.js proxy on Vercel)
                        └── FastAPI backend (Railway)
                               ├── PostgreSQL + pgvector
                               └── LiteLLM → OpenRouter (free LLM providers)
```

## Tech stack

| Layer | Technology | Host |
|-------|-----------|------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui | Vercel |
| Backend API | FastAPI (Python) | Railway |
| Database | PostgreSQL + pgvector | Railway |
| AI / LLM | LiteLLM + OpenRouter | Provider APIs (free tiers) |
| Eligibility logic | Structured PostgreSQL queries | Railway |
| RAG | pgvector (only where structured queries are insufficient) | Railway |

## Routing & layout

- `src/app/layout.tsx` — root layout: fonts (`next/font`), global JSON-LD, and `<SiteShell>`.
- `src/components/layout/SiteShell.tsx` — a client wrapper that renders the marketing **Header + Footer** on normal routes, but renders `/chat` **full-bleed** (its own slim header, no marketing chrome) so the assistant can fill the viewport.
- Marketing sections live in `src/components/marketing/*` and shared primitives in `src/components/ui/*` and `src/components/layout/*`.

## Seam 1 — Data (`SchemeProvider`)

Everything that needs scheme data goes through **one async interface**, so the backing store can change without touching callers.

```ts
// src/lib/data.ts
getAllSchemes(): Promise<Scheme[]>
getSchemeBySlug(slug): Promise<Scheme | null>
filterSchemes({ category?, state?, text? }): Promise<Scheme[]>
searchSchemes(text): Scheme[]   // sync keyword match — used by the mock bot
```

- **Types** live in `src/lib/types.ts` (`Scheme`, `EligibilityCriterion`, `RequiredDocument`, …). These are the contract the backend pipeline must satisfy.
- **Now:** typed sample education schemes in `src/data/schemes.ts` (clearly labelled `source: "sample"`).
- **Phase 2:** provider implementation swaps to query the FastAPI backend. All pages and the bot keep working unchanged because they only know the interface.

## Seam 2 — Chat (`ChatEngine`)

The chat UI never calls an engine directly. It calls the Next.js API proxy, which forwards to FastAPI.

```
ChatScreen (client)
  └─ src/lib/chat/client.ts  → fetch POST /api/chat  (Next.js route — Vercel)
        └─ src/app/api/chat/route.ts  → forwards to FastAPI on Railway
              └─ FastAPI /chat endpoint
                    ├── Structured eligibility query (PostgreSQL)
                    ├── LiteLLM + OpenRouter (LLM response)
                    └── pgvector RAG (only where needed)
```

The `ChatEngine` interface in `src/lib/chat/engine.ts` defines the contract:
- `greeting(): BotTurn` — the opening assistant turn
- `send(input, history): Promise<BotTurn>` — produces the assistant reply

Currently: `mockEngine` (keyword matching, no LLM, no network).
Phase 2: the route.ts forwards to FastAPI which handles LLM + DB.

## Eligibility checking approach

Eligibility checking uses **structured PostgreSQL queries first, RAG only where needed**.

```
User: "I'm a 2nd year engineering student in Tamil Nadu, SC category, family income ₹2 lakh"
  │
  ▼
FastAPI parses entities:
  - course_level: "undergraduate"
  - state: "tamil-nadu"
  - category: "SC"
  - income: 200000
  │
  ▼
PostgreSQL query: WHERE course_level IN ('UG','any')
                    AND (state = 'tamil-nadu' OR state = 'all-india')
                    AND (category = 'SC' OR category = 'all')
                    AND max_income >= 200000
  │
  ▼
Matching schemes → LiteLLM formats a plain-language response with official URL citations
```

RAG (pgvector similarity search) is only used for:
- Follow-up questions about specific scheme details
- Nuanced queries that can't be answered by structured filters alone

## The chat UI

`src/components/chat/ChatScreen.tsx` is the orchestrator (a `100dvh` client island):

- Welcome state with persona/example starter chips (student-focused)
- Centred conversation (`role="log"`, `aria-live="polite"`) of user/assistant bubbles
- `SchemeResultCard`s for matched schemes (with "Apply on the official portal" link, `rel="nofollow noopener"`)
- Fixed bottom composer, follow-up chips, a typing indicator, and a scroll-to-bottom pill
- `?q=` deep-link (auto-asks once), `/` to focus and `Esc` to stop, `localStorage` transcript persistence

## SEO

- Per-page metadata via `src/lib/seo/metadata.ts` (`buildMetadata`) with canonical URLs and OpenGraph/Twitter cards.
- `src/app/sitemap.ts` and `src/app/robots.ts` generate `sitemap.xml` / `robots.txt`.
- `/chat` is excluded from sitemap (`noindex`) — it is a dynamic session, not a crawlable page.
- JSON-LD emitters in `src/lib/seo/jsonld.ts` (`Organization`, `WebSite`, `GovernmentService`, `FAQPage`, `BreadcrumbList`).

## Design system

- **Palette:** Indian flag — saffron `#FF9933`, white, India-green `#138808`, navy `#0A3D91`/`#000080` as Tailwind tokens.
- **Type:** Sora (display) + Inter (body) via `next/font`.
- **Icons:** `lucide-react` only — no emojis in the product.
- **Components:** shadcn/ui on top of Tailwind for standard UI primitives; custom components for brand-specific UI.

## Why this shape

The two seams (**SchemeProvider** for data, **ChatEngine / FastAPI** for chat) de-risk development: the Next.js UI is fully deployed and working now. The FastAPI backend can be built and tested independently. The `/api/chat` route acts as the bridge — in Phase 1 it calls the local mock, in Phase 2 it proxies to Railway. No UI rewrite needed at any stage.

Eligibility-first (structured DB query before LLM) keeps the bot fast, accurate, and cost-efficient — the LLM is only invoked for language generation and explanation, not for decision-making.
