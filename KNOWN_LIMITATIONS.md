# Known Limitations

> Intentionally accepted trade-offs for FamilyCare v21.  
> **Not bugs** — documented constraints until approved for change.  
> **Last updated:** 2026-07-03

---

## How to Read This Document

| Label | Meaning |
|-------|---------|
| **Accepted** | We know; fix is not scheduled |
| **Interim** | Accepted now; replacement planned in ROADMAP |
| **By design** | Product/architecture choice |

Each item links to tech debt ID where applicable.

---

## Data & Privacy

### L1 — All bill data is public (By design)

Anyone with the URL can read `data/bills.json` including amounts, names, and care status.

**Why accepted:** GitHub Pages static hosting; family shares one link.  
**Mitigation:** Do not publish URL outside trusted family.  
**Future:** Private backend (ADR-010 pending).

---

### L2 — No encryption at rest (By design)

JSON stored in public git repo unencrypted.

**Why accepted:** Simplicity, free hosting, git history as audit trail.

---

### L3 — No concurrent edit protection (Accepted)

Two devices writing simultaneously → last GitHub PUT wins; earlier edit lost.

**Why accepted:** Single admin (Venky) in practice.  
**Tech debt:** TD-004  
**Future:** Bill UUIDs + merge logic or real-time DB.

---

### L4 — No bill unique IDs (Accepted)

Bills identified by `{d, who, amt, note}` tuple. Duplicates possible on `mergeLocalStorage`.

**Tech debt:** TD-017

---

## Security

### L5 — GitHub PAT stored in browser localStorage (Interim)

Token on Venky's phone enables writes. XSS or shared device = token exposure.

**Why accepted:** No backend to hold secrets; fastest mobile sync.  
**Tech debt:** TD-001 (P0)  
**Future:** Serverless proxy (6-month roadmap).

---

### L6 — User note field XSS risk (Interim — fix planned v22)

Bill `note` rendered via `innerHTML` without escaping.

**Tech debt:** TD-002 (P0)  
**Status:** Known; fix scheduled next release.

---

### L7 — Google sync PIN is `0000` (Accepted if Google path used)

Weak authentication for optional Google POST API.

**Why accepted:** Optional path; family-scale threat model.  
**Note:** PIN UI removed from app; Google path rarely used.

---

## Sync & Performance

### L8 — ~30–90 second family sync delay (By design)

After Venky saves, GitHub Pages must redeploy before others see `bills.json`.

**Why accepted:** Static hosting trade-off.  
**Mitigation:** 60s client poll + visibility refresh.  
**User messaging:** "Family sees it in ~1 min."

---

### L9 — 60-second polling for all users (Accepted)

Every open tab fetches full JSON every minute.

**Why accepted:** Simple; JSON is small (~10 KB).  
**Tech debt:** TD-011  
**Future:** SHA/ETag comparison before render.

---

### L10 — No true offline app (Accepted)

Service worker self-destructs; no cached app shell.

**Why accepted:** ADR-006 — cache incidents worse than offline.  
**Mitigation:** Pending bills in localStorage until sync.

---

## Application Architecture

### L11 — Single 2,160-line monolith (Interim)

All HTML, CSS, JS in one file.

**Why accepted:** ADR-001 — zero build step.  
**Tech debt:** TD-019  
**Future:** Extract modules with tests (6-month).

---

### L12 — Duplicate `hospital-bills.html` (Accepted)

Manual copy of `index.html`; drift risk.

**Tech debt:** TD-005

---

### L13 — Full `render()` on every change (Accepted)

All tabs' DOM rebuilt even when viewing Home only.

**Tech debt:** TD-010

---

## UI / UX

### L14 — No skeleton loaders yet (Interim — v22 planned)

Splash uses fixed 600ms; content may flash or show "—".

**Tech debt:** TD-008  
**Roadmap:** Next release.

---

### L15 — `.reveal` hides below-fold content until scroll (Accepted)

IntersectionObserver animation can delay visibility.

**Why accepted:** Visual polish on Bills tab.  
**Issue:** Should not apply to critical Home above-fold (fix planned).

---

### L16 — Zoom disabled on mobile (Accepted)

`maximum-scale=1` in viewport meta.

**Why accepted:** Prevent accidental pinch-zoom layout breaks.  
**Accessibility debt:** Low vision users cannot zoom.

---

### L17 — No dark mode (By design)

v20 switched to light theme only.

**ADR:** ADR-008

---

## Care & AI

### L18 — Chatbot is not AI (By design)

Rule-based regex answers from `careStatus` and bill totals.

**ADR:** ADR-007  
**Not medical advice.** Always defer to doctor.

---

### L19 — OCR accuracy limited (Accepted)

Tesseract client-side; Telugu+English mixed scripts often partial.

**Mitigation:** Bot warns to confirm with doctor/Venky.

---

### L20 — Tesseract loaded on every page load (Interim — v22 planned)

~1–2 MB CDN download even if Care tab never opened.

**Tech debt:** TD-006

---

## Operations

### L21 — No automated tests (Accepted)

Settlement math verified manually.

**Health score:** Testing 1/10  
**Roadmap:** 3-month goal.

---

### L22 — No error logging / analytics (Accepted)

Failures silent in `catch {}` or toast only.

**Future:** IDEA-031

---

### L23 — Documentation drift (Interim)

`README.md`, `MOBILE-VENKY.md` reference PIN and old setup.

**Tech debt:** TD-009

---

### L24 — Particle animation still runs (Accepted)

CPU used though `.ambient` is `display: none`.

**Tech debt:** TD-007 — remove in v22.

---

## Product Scope

### L25 — Single patient hardcoded (By design)

Sri Venkateswara Rao / Mallareddy Hospital in meta.

**Future:** Config-driven template (6-month).

---

### L26 — Settlement algorithm assumes Kalyan underpays (Accepted)

`computeSettlement` optimized for current family payment pattern.

**Risk:** If payment balance shifts, logic may need generalization.

---

### L27 — No payment / UPI integration (By design)

App shows amounts; family transfers money outside app.

**Non-goal:** See `PRODUCT_VISION.md`

---

## When to Remove a Limitation

1. Add ADR if architecture changes  
2. Update this file — move item to "Resolved"  
3. Update `TECH_DEBT.md` and `CHANGELOG.md`  
4. Bump version and regression test  

---

## Resolved Limitations (archive)

| ID | Was | Resolved in |
|----|-----|-------------|
| — | Service worker stuck on old versions | v16 + self-destruct SW |
| — | Harsh WhatsApp blame language | v21 |
| — | Single long scrolling page | v17 tabs |
| — | Ugly orange sync banner | v19 |

---

## Related Docs

- `TECH_DEBT.md` — prioritized fix list  
- `ARCHITECTURE_DECISIONS.md` — why limitations exist  
- `ROADMAP.md` — when we plan to address interim items  
- `HEALTH.md` — dimension scores  
