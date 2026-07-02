# Changelog

All notable changes to FamilyCare Hospital Bills.  
Format based on [Keep a Changelog](https://keepachangelog.com/).

---

## [2026-07-03-v25-lts] — Final LTS release 🧊

### Added
- External CSS (`css/` × 6 files) — identical appearance, maintainable
- 39 automated tests; LTS release guides (deploy, rollback, maintenance, checklist, audit)
- Production `dist/` deploy with obfuscated bundle + CSS

### Changed
- Version `2026-07-03-v25-lts`, cache `b=25`, SW `familycare-v25-lts`
- Removed unused CSS variables and dead imports

### Frozen
- UI, settlement, fair share, WhatsApp, GitHub sync — **no changes**

### Policy
Maintenance-only until 2031. No new features.

---

## [2026-07-03-v24.1] — Code protection

- Obfuscated production build, proprietary LICENSE, `dist/`-only deploy

---

## [2026-07-03-v24] — Enterprise Hardening

### Added
- Modular JavaScript (`js/`): config, utils, validation, calculations, storage, sync, ui, render, whatsapp, care, pwa, app
- Automated test suite (`tests/`) — 19 regression tests, coverage report via `npm test`
- Input validation: dates, amounts, duplicates, corrupt JSON sanitization
- User-friendly sync error messages (no raw GitHub API text)
- Cached snapshot fallback when offline; fetch timeouts on all network calls
- Service worker precaches all `js/` modules (cache `familycare-v24`)

### Fixed
- Removed ~1,150 lines duplicate inline JavaScript from `index.html`
- IntersectionObserver memory leak in `initReveal()` (reuses single observer)
- Duplicate `.app-nav` CSS and duplicate `focus-visible` rules
- Stray `</script>` tag; debounced bill search filter
- Replaced `alert()` validation with accessible toast messages

### Business logic
Unchanged — settlement, fair share, GitHub sync, WhatsApp message content frozen

---

## [2026-07-03-v23] — Production QA & PWA

### Added
- Full PWA: service worker, offline page, manifest shortcuts, install flow
- `TEST_PLAN.md` (100 manual test cases), `RELEASE_NOTES_v23.md`
- Local analytics (`fc_metrics_v1`) — no personal data
- App icons, OG preview, favicon, robots.txt
- Skip link, main landmark, aria-current nav, system fonts for performance

### Fixed
- Lighthouse: SEO 100, Best Practices 100, a11y contrast, tablist ARIA
- Removed ~200 lines dead CSS (ambient, hero, particles, tables, admin)
- Service worker no longer self-destructs

### Business logic
Unchanged

---

## [2026-07-03-v22] — Premium consumer-grade redesign

### Added
- Home dashboard: greeting, patient card, gradient hero, progress rings, recent activity
- Bills: search, filter chips, monthly grouping, premium transaction cards with expandable notes
- Share: live WhatsApp preview + animated copy confirmation
- Care: health timeline, emergency card, OCR progress, typing animation
- Floating add FAB, pull-to-refresh, splash progress tied to `loadData()`
- `esc()` XSS helper; lazy-loaded Tesseract.js

### Changed
- Glassmorphism bottom nav, premium toast with success state
- Removed particle animation (`initParticles`) for battery/performance

### Files
- `index.html`, `hospital-bills.html`, `version.json`, `refresh.html`

### Breaking changes
None — business logic and settlement rules unchanged

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
