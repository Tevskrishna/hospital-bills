# Technical Debt Register — v25 LTS

> **Policy:** Bugfix-only. New debt should not be introduced.  
> Last updated: 2026-07-03 (v25 LTS)

## Resolved in v23–v25 ✅

| ID | Issue | Resolved |
|----|-------|----------|
| TD-002 | XSS via unescaped notes | `esc()` everywhere |
| TD-005 | Monolithic inline JS | Modular `js/` |
| TD-006 | Tesseract eager load | Lazy load in `care.js` |
| TD-007 | Particle animation | Removed |
| TD-008 | Splash tied to loadData | Fixed v22 |
| TD-010 | Inline CSS 1000+ lines | Extracted to `css/` |
| TD-011 | No automated tests | 39 tests |
| TD-012 | No production build | `npm run build:production` |

## Open — Accepted for family LTS

### P2 — Medium (documented, not blocking)

| ID | Issue | Notes |
|----|-------|-------|
| TD-001 | GitHub PAT in localStorage | Accepted; optional proxy in maintenance backlog |
| TD-003 | Public bills.json | By design for family URL sharing |
| TD-004 | Last-write-wins sync | Accepted for 3-user scale |
| TD-013 | No E2E browser tests | Manual TEST_PLAN.md |
| TD-014 | No CSP on GitHub Pages | Platform limitation |

### P3 — Low

| ID | Issue | Notes |
|----|-------|-------|
| TD-015 | `prompt()` for advance amount | Works; modal optional in maintenance |
| TD-016 | duplicate `hospital-bills.html` | Kept in sync with index.html |

## Do not fix without family sign-off

- Settlement algorithm (`js/calculations.js`)
- WhatsApp message (`js/whatsapp.js`)
- Fair share divisor (always 3)
