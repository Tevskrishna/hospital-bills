# Changelog

All notable changes to FamilyCare Hospital Bills.  
Format based on [Keep a Changelog](https://keepachangelog.com/).

---

## [2026-07-03-v21] — Warm WhatsApp tone

### Changed
- WhatsApp share message rewritten in respectful Telugu — no "owes" / "MUST PAY"
- Share page badges: "Balance" / "Credit" instead of harsh labels
- Settlement section titled "Fair adjustment · సమన్యయం"

### Files
- `index.html`, `hospital-bills.html`, `version.json`, `refresh.html`

### Breaking changes
None

### Migration
Open `refresh.html` if stuck on older version

### Testing
Manual — WhatsApp copy reviewed for tone

### Known limitations
Settlement logic unchanged; only messaging softened

---

## [2026-07-03-v20] — Blinkit/Swiggy UI redesign

### Changed
- Light consumer-app theme (green primary, white cards)
- Sticky top header (patient + hospital)
- Quick action chips on Home
- Order-style bill history (newest first)
- Hidden ambient/particle background layer

### Files
- `index.html`, `hospital-bills.html`, `manifest.json`, `version.json`, `refresh.html`

### Breaking changes
None

### Testing
Manual mobile visual check

### Known limitations
Particle JS still runs; Tesseract still eager-loaded; no skeleton loaders

---

## [2026-07-03-v19] — Remove sync banners

### Removed
- Orange "phone only" sync banner
- Green "cloud OK" banner

### Added
- Auto-refresh every 60s + on tab visible

### Files
- `index.html`, `hospital-bills.html`, `version.json`, `refresh.html`

---

## [2026-07-03-v18] — Powered by Tevs

### Added
- Footer branding "Powered by Tevs" linking to GitHub

### Files
- `index.html`, `hospital-bills.html`, `version.json`, `refresh.html`

---

## [2026-07-03-v17] — Tab page navigation

### Changed
- Split into Home / Bills / Share tabs with bottom nav
- Home simplified: total, paid, settlement, add bill
- Full details moved to Bills tab

### Files
- `index.html`, `hospital-bills.html`, `version.json`, `refresh.html`

---

## Earlier versions (summary)

| Version | Highlight |
|---------|-----------|
| v14–v16 | Settlement clarity, share UI redesign, cache bust fixes |
| v8–v13 | Care chatbot, GitHub mobile sync, PIN removed, PWA |
| v1–v7 | Initial tracker, fair split, WhatsApp share, Google Form setup |

---

## Governance docs added (2026-07-03)

### Added
- `PROJECT_CONTEXT.md` — permanent project memory
- `HEALTH.md` — dimension health scores
- `TECH_DEBT.md` — prioritized debt register
- `IDEAS.md` — future backlog (not implemented)
- `CHANGELOG.md` — this file
- `.cursor/rules/` — 8 Cursor rules (architecture, coding, UX, security, performance, testing, documentation, release)

### Reason
Establish Technical Owner workflow for production-grade evolution

### Testing
Documentation only — no app code changed

---

## [2026-07-03] — Product documentation suite

### Added
- `PRODUCT_VISION.md` — mission, users, principles, metrics
- `ROADMAP.md` — current through 6-month goals
- `ARCHITECTURE_DECISIONS.md` — ADR-001 through ADR-009
- `DESIGN_SYSTEM.md` — colors, typography, components, states
- `API_CONTRACTS.md` — all APIs with request/response examples
- `CONTRIBUTING.md` — developer workflow
- `KNOWN_LIMITATIONS.md` — 27 accepted limitations
- `PROJECT_CONTEXT.md` — documentation index updated

### Reason
Establish long-term Technical Owner product memory

### Breaking changes
None

### Testing
Documentation review only
