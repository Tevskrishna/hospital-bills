# Architecture Decision Records (ADR)

> Log of significant technical decisions for FamilyCare.  
> Format: Decision #NNN  
> **Last updated:** 2026-07-03

---

## ADR-001 — Keep Vanilla JavaScript instead of React

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-28 |
| **Owner** | Technical Owner |

### Context

Family needed a live bill tracker deployable to GitHub Pages quickly, editable by one developer (Venky/Tevs), usable on mobile without build tooling. The app started as a single HTML file and grew through rapid family-driven iterations.

### Options considered

1. **Vanilla JavaScript** — single `index.html`, no build step  
2. **React** — component model, Vite build, npm ecosystem  
3. **Vue** — lighter than React, still requires build  

### Decision

**Vanilla JavaScript** in a single-file SPA (`index.html`).

### Reason

- Zero build pipeline → push to GitHub = instant family update  
- Works on GitHub Pages static hosting without Node on server  
- Venky can open one file and understand the whole app  
- Family URL must never break; static deploy is predictable  
- Scope is ~50 bills, 3 users — framework overhead not justified yet  

### Consequences

**Positive:**
- Fastest path from idea to family WhatsApp link  
- No npm vulnerabilities or build failures  
- Easy for Cursor/AI to edit one file  
- Works offline as static files  

**Negative:**
- 2,160-line monolith — harder to test and review  
- No component isolation — `render()` touches all tabs  
- Duplication risk (`index.html` / `hospital-bills.html`)  
- Refactor to React later = full rewrite cost  

---

## ADR-002 — JSON file on GitHub Pages as database

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-28 |
| **Owner** | Technical Owner |

### Context

Need shared read access for all family members and write access from Venky's phone without paying for a database.

### Options considered

1. **`data/bills.json` on GitHub Pages**  
2. **Google Sheets as primary store**  
3. **Firebase Realtime Database**  
4. **Supabase Postgres**  

### Decision

**`data/bills.json`** committed to repo, served by GitHub Pages. Writes via GitHub Contents API.

### Reason

- Same repo = same deploy = same URL  
- JSON diffable in git history  
- Free at family scale  
- Google Sheets kept as optional fallback (`Code.gs`)  

### Consequences

**Positive:** Simple, free, version history in git  
**Negative:** Public data, last-write-wins, ~30–90s deploy delay, no query API  

---

## ADR-003 — GitHub PAT in localStorage for mobile writes

| Field | Value |
|-------|-------|
| **Status** | Accepted (interim) |
| **Date** | 2026-07-01 |
| **Owner** | Technical Owner |

### Context

Venky needed to add bills from phone without laptop. No backend exists to hold secrets.

### Options considered

1. **PAT in `localStorage` on Venky's phone**  
2. **Google Apps Script with PIN**  
3. **Serverless proxy (Cloudflare Worker)**  
4. **Manual: copy JSON via WhatsApp**  

### Decision

**GitHub fine-grained PAT** stored in `localStorage` key `hb_github_token`.

### Reason

- Works immediately without new infrastructure  
- Token scoped to single repo Contents only  
- Family read path unchanged (no token needed)  

### Consequences

**Positive:** Mobile sync works in ~2 min setup  
**Negative:** P0 security risk (TD-001); XSS could exfiltrate token; planned replacement in 6-month roadmap (ADR future)  

---

## ADR-004 — Same URL forever (no versioned deploy URLs)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-29 |
| **Owner** | Technical Owner |

### Context

Family was confused when given new links after each deploy. Elderly users bookmark one URL.

### Options considered

1. **Fixed URL** `tevskrishna.github.io/hospital-bills/`  
2. **Versioned URLs** per deploy  
3. **Custom domain** `familycare.tevs.in`  

### Decision

**Fixed GitHub Pages URL** always. Cache bust via `refresh.html` and `?b=` param internally only.

### Reason

Family explicitly requested one link. Internal cache bust must not change shared URL.

### Consequences

**Positive:** Zero family re-training per release  
**Negative:** Aggressive cache-busting needed (`sw.js` self-destruct, `refresh.html`)  

---

## ADR-005 — Tab-based navigation (Home / Bills / Share / Care)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-03 |
| **Owner** | Technical Owner |

### Context

Single long scrolling page was overwhelming. User asked for Blinkit/Swiggy-style simple home + detail pages.

### Options considered

1. **Long scroll with section anchors**  
2. **Client-side tab pages** (`showPage()`)  
3. **Separate HTML files per page**  

### Decision

**Client-side tabs** with bottom nav in one `index.html`.

### Reason

- Keeps single-file architecture (ADR-001)  
- Familiar mobile pattern (Blinkit/Swiggy)  
- Home stays simple; power users go to Bills tab  

### Consequences

**Positive:** Clear IA, faster mental model  
**Negative:** Full `render()` still updates all tabs; hidden tab DOM rebuilt  

---

## ADR-006 — Self-destructing service worker

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-02 |
| **Owner** | Technical Owner |

### Context

Family stuck on v12 due to aggressive SW caching old `index.html`.

### Options considered

1. **Proper SW cache strategy**  
2. **Remove SW entirely**  
3. **SW that clears itself and unregisters**  

### Decision

**Self-destruct SW** (`sw.js`) — clears all caches, unregisters, reloads clients.

### Reason

- Faster fix than correct cache versioning  
- Family had already lost trust in "refresh"  
- PWA install less critical than seeing latest bills  

### Consequences

**Positive:** Cache incidents stopped  
**Negative:** No offline app shell; PWA benefit reduced  

---

## ADR-007 — Rule-based chatbot + Tesseract OCR (not LLM)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-01 |
| **Owner** | Technical Owner |

### Context

Family wanted care Q&A and prescription upload without API costs or privacy risk.

### Options considered

1. **Regex/rule-based answers from `careStatus` + bill data**  
2. **OpenAI / Gemini API**  
3. **No chatbot**  

### Decision

**Rule-based chatbot** + **client-side Tesseract.js** for OCR.

### Reason

- Free, works offline for Q&A  
- No PHI sent to third-party AI  
- OCR useful for prescription photos at hospital  

### Consequences

**Positive:** No API keys, predictable answers  
**Negative:** Not truly intelligent; Tesseract heavy; not medical advice  

---

## ADR-008 — Blinkit-inspired light theme (v20)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-03 |
| **Owner** | Technical Owner |

### Context

Dark "futuristic" UI felt heavy on mobile WhatsApp browser. User requested Amazon/Blinkit/Swiggy style.

### Options considered

1. **Keep dark theme**  
2. **Blinkit green light theme**  
3. **Swiggy orange theme**  

### Decision

**Light theme** with `#0c831f` primary (Blinkit-inspired), white cards, sticky header.

### Reason

- Familiar to Indian mobile users  
- Better readability in bright hospital environments  
- Matches consumer app mental model  

### Consequences

**Positive:** UX score 7/10  
**Negative:** Dark mode removed; some legacy CSS remains  

---

## ADR-009 — Warm WhatsApp tone (no blame language)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-03 |
| **Owner** | Technical Owner |

### Context

Share message used "owes", "MUST PAY", "తీర్పు" — felt harsh in family WhatsApp group.

### Decision

Rewrite `copyWhatsApp()` and UI badges to use "సమన్యయం", "Balance", "Credit", respectful Telugu.

### Reason

Product principle: respect over blame. Reduces family conflict.

### Consequences

**Positive:** Family psychological safety  
**Negative:** Slightly longer message text  

---

## ADR Template (for future decisions)

```markdown
## ADR-NNN — Title

| Field | Value |
|-------|-------|
| **Status** | Proposed / Accepted / Deprecated |
| **Date** | YYYY-MM-DD |
| **Owner** | Technical Owner |

### Context
Why this decision was needed.

### Options considered
1. Option A
2. Option B

### Decision
Chosen option.

### Reason
Why.

### Consequences
**Positive:** ...
**Negative:** ...
```

---

## Pending decisions (not yet approved)

| ID | Topic | Notes |
|----|-------|-------|
| ADR-010 | Serverless GitHub write proxy | Would replace PAT in browser |
| ADR-011 | Extract settlement.js + tests | Minor architecture change |
| ADR-012 | Remove `hospital-bills.html` duplicate | CI or delete |
