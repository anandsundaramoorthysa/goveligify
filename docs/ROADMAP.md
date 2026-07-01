# CheckMyEligibility — Development Roadmap

Student-focused AI assistant for Indian government education schemes.
MIT License · [github.com/anandsundaramoorthysa/checkmyeligibility](https://github.com/anandsundaramoorthysa/checkmyeligibility)

---

## Status Legend
- `[x]` Done
- `[ ]` Pending
- `[~]` In progress

---

## Foundation (Complete)

- [x] Brand identity — logo, palette (saffron / green / navy), typography (Sora + Inter)
- [x] Marketing site — Home, About, Explore, Certificates, How it works, FAQ, Privacy, Terms, 404
- [x] Chat UI shell — `/chat` full-screen assistant (bubbles, chips, composer, transcript persistence)
- [x] Mock chat engine — keyword intent matching over sample data (`src/lib/chat/mockEngine.ts`)
- [x] `/api/chat` route with payload guards (64 KB cap, 2000-char message, 30-item history)
- [x] SEO — JSON-LD, sitemap, robots.txt, OG images, canonical URLs
- [x] Security hardening — CSP, X-Frame-Options, HSTS, noreferrer on external links
- [x] Institutional attribution — Dept. of Data Science, Loyola College, Chennai
- [x] Domain `checkmyeligibility.in` purchased (26-Jun-2026)

---

## Phase 1 — Student Scholarship MVP

**Target audience:** Indian students (UG, PG, PhD, Diploma, Professional courses).
**Dataset:** 100–300 manually validated education schemes from official government portals.

### Data collection
- [ ] Collect 100–300 student scholarship schemes from:
  - National Scholarship Portal — [scholarships.gov.in](https://scholarships.gov.in/)
  - University Grants Commission — [ugc.gov.in](https://www.ugc.gov.in/)
  - AICTE — [aicte-india.org](https://www.aicte-india.org/)
  - Ministry of Education — [education.gov.in](https://www.education.gov.in/)
  - State government scholarship portals
- [ ] Use MyScheme for scheme discovery only — always verify on the official source portal
- [ ] Each scheme must include: name, ministry/department, category, eligibility, benefits, required documents, application dates, official URL, last verified date

### Backend — FastAPI on Railway
- [ ] Set up FastAPI (Python) project, deployed on Railway
- [ ] PostgreSQL + pgvector database
- [ ] Structured eligibility tables (filterable by course level, income, category, gender, state)
- [ ] `POST /api/chat` endpoint callable from the Next.js frontend
- [ ] Eligibility checking via structured DB queries (not RAG for basic eligibility)
- [ ] Scheme search and recommendation endpoint
- [ ] LiteLLM + OpenRouter integration for conversational explanations
- [ ] RAG pipeline for follow-up questions and nuanced scheme explanations (only where queries exceed structured logic)
- [ ] Answer caching (same question = 1 model call for many users)
- [ ] Per-IP rate limiting
- [ ] "Busy" fallback message when all providers are rate-limited

### Frontend — Next.js on Vercel
- [ ] Update chat quick-reply starters to student scenarios
- [ ] Integrate shadcn/ui component library
- [ ] Wire `/chat` → Next.js `/api/chat` proxy → FastAPI backend
- [ ] Update sample data to education/scholarship schemes
- [ ] Update marketing pages for student-focused audience

### Chat features
- [ ] Student eligibility chatbot (scholarship type, income bracket, course level, state, social category)
- [ ] Simplified scheme explanations in plain English
- [ ] Official source citations in every response
- [ ] Scheme comparison for student schemes (interactive chips → eligibility-aware verdict)
- [ ] Multilingual support (English + Tamil + Hindi)

---

## Phase 2 — Fellowships, Loans & Grants

- [ ] Student fellowships (UGC fellowships, DST, CSIR, ICMR JRF/SRF)
- [ ] Education loans (Pradhan Mantri Vidya Lakshmi, state bank education schemes)
- [ ] Research grants (project funding, conference travel grants for PhD students)
- [ ] Expand dataset to post-graduation funding schemes

---

## Phase 3 — Broader Education Schemes

- [ ] All education-related central and state government schemes
- [ ] Vocational training and skilling programmes linked to students
- [ ] Study-abroad and international exchange schemes
- [ ] State-specific hostel, transport subsidy, and stipend schemes

---

## Phase 4 — College Pilot & Expansion

- [ ] Pilot deployment with Loyola College and partner institutions
- [ ] Collect user feedback from students
- [ ] Refine eligibility logic and chatbot quality based on pilot results
- [ ] Expand to other beneficiary groups (farmers, senior citizens, etc.) after validating the student-MVP approach

---

## Infrastructure & Legal

- [x] Domain `checkmyeligibility.in` — Vercel
- [ ] FastAPI backend on Railway
- [ ] PostgreSQL + pgvector on Railway (managed)
- [ ] Hybrid data update pipeline — automated change detection on official pages → manual review → database update
- [ ] Legal/compliance review before monetising (DPDP, GODL/MyScheme terms)

---

## Data Source Policy

All scheme data comes only from official government websites. MyScheme is used for scheme discovery only — every scheme is always verified on the originating ministry or department portal. Every record stores the `lastVerifiedDate` and the `officialPortalUrl`.

Future updates use a hybrid approach: an automated job detects changes on official pages, flags modified schemes, and queues them for manual review before the database is updated.
