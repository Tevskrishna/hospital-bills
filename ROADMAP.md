# Product Roadmap — FamilyCare

> **Current release:** v21 (`2026-07-03-v21`)  
> **Last updated:** 2026-07-03  
> **Owner:** Technical Owner

---

## Current Release — v21 (shipped)

**Theme:** Family-safe communication + consumer mobile UI

| Feature | Status |
|---------|--------|
| Tab navigation (Home / Bills / Share / Care) | ✅ |
| Blinkit-style light theme + sticky header | ✅ |
| Quick action chips on Home | ✅ |
| Order-style bill history | ✅ |
| GitHub mobile sync (PAT) | ✅ |
| Fair 1/3 split + settlement math | ✅ |
| Warm WhatsApp share message | ✅ |
| Care status banner + rule-based chatbot | ✅ |
| Prescription OCR (Tesseract) | ✅ |
| Auto-refresh every 60s | ✅ |
| PWA manifest + install prompt | ✅ |
| Powered by Tevs footer | ✅ |
| Governance docs + Cursor rules | ✅ |

**Known gaps in current release:**  
No skeleton loaders, XSS hardening pending, Tesseract eager-loaded, no automated tests.

---

## Next Release — v22 (recommended)

**Theme:** Production polish — quality without new features

**Goal:** Raise health score from 4.2 → 5.5

| Priority | Item | Effort | Ref |
|----------|------|--------|-----|
| P0 | Escape user content in DOM (`note` XSS) | 2h | TD-002 |
| P0 | Lazy-load Tesseract on Care tab only | 1h | TD-006 |
| P1 | Skeleton loaders + splash tied to `loadData()` | 4h | IDEA-001 |
| P1 | Remove dead particle animation | 30m | TD-007 |
| P1 | Update outdated docs (`README`, `MOBILE-VENKY`) | 1h | TD-009 |
| P2 | `toast()` instead of remaining `alert()` | 30m | TD-018 |
| P2 | Partial `renderHome()` to reduce jank | 4h | IDEA-040 |

**Exit criteria for v22:**
- [ ] Home shows skeleton within 100ms on slow 3G
- [ ] No XSS via bill `note` field
- [ ] Care tab still works with lazy Tesseract
- [ ] `CHANGELOG.md` updated
- [ ] Regression checklist passed

---

## 3-Month Goals (Q3 2026)

**Theme:** Trust + maintainability

| Goal | Outcome |
|------|---------|
| **Settlement math tested** | Unit tests for `computeSettlement` / `computeSplit` |
| **Security baseline** | XSS fixed; token handling documented; optional expiry reminder |
| **Single source HTML** | Eliminate `hospital-bills.html` drift (CI check or remove) |
| **Health score ≥ 7/10** | UX 9, Security 6, Testing 6, Performance 8 |
| **Accessibility pass** | Focus trap in modal, `aria-current` on nav, contrast audit |
| **Loading excellence** | Pull-to-refresh, shimmer, no reveal flash on Home |

**Not in 3-month scope (unless approved):**
- Serverless GitHub proxy  
- Firebase real-time sync  
- Multi-family SaaS  

---

## 6-Month Goals (Q4 2026)

**Theme:** Platform readiness (optional expansion)

| Goal | Outcome |
|------|---------|
| **Modular codebase** | Extract `settlement.js`, `sync.js` with tests (minimal build) |
| **Serverless write proxy** | PAT never in browser (IDEA-050) |
| **Bill IDs + merge safety** | Optimistic locking or UUID per bill |
| **PDF / image share** | Receipt-style export for family records |
| **Tevs FamilyCare template** | Second family deployable with config only |
| **CI pipeline** | Lint + test on PR before Pages deploy |

---

## Future Ideas (backlog — not scheduled)

See `IDEAS.md` for full backlog. Highlights:

| Horizon | Ideas |
|---------|-------|
| UX | Discharge countdown, UPI amount copy, hospital logo in header |
| Features | Bill categories, voice entry, bill photo attach |
| AI | OCR → auto-fill bill form; optional LLM Q&A (privacy review) |
| Ops | Audit log, visit analytics, push notifications |
| Platform | Multi-family SaaS under Tevs brand |

**Rule:** Nothing from Future moves to Next Release without explicit approval.

---

## Release Cadence

| Type | When | Version bump |
|------|------|--------------|
| Hotfix | Family-blocking bug | v22.1 |
| Minor | Polish, UX, security | v22, v23… |
| Major | Architecture change | v2.0.0 (requires ADR) |

Deploy: push to `main` → GitHub Actions → Pages (~1–2 min)

---

## Roadmap Review Schedule

| When | Action |
|------|--------|
| After each release | Update Current / Next in this file |
| Monthly | Review 3-month goals vs HEALTH.md |
| On architecture change | New ADR in `ARCHITECTURE_DECISIONS.md` |
