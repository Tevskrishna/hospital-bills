# Technical Debt Register

> Do NOT fix immediately unless prioritized and approved.  
> Last updated: 2026-07-03

## Priority Legend

| Priority | Meaning |
|----------|---------|
| **P0** | Critical — security or data loss risk |
| **P1** | High — affects reliability or major UX |
| **P2** | Medium — maintainability or performance |
| **P3** | Low — cleanup, nice-to-have |

---

## Open Items

### P0 — Critical

| ID | Issue | Location | Notes |
|----|-------|----------|-------|
| TD-001 | GitHub PAT stored in `localStorage` | `index.html` `saveGithubToken`, `saveToGitHub` | Token theft = full repo write access |
| TD-002 | User `note` field injected via `innerHTML` without escaping | `index.html` `dayTable`, `render()` templates | XSS if malicious note entered |
| TD-003 | All financial data public on GitHub Pages | `data/bills.json` | By design for family; privacy risk if URL spreads |

### P1 — High

| ID | Issue | Location | Notes |
|----|-------|----------|-------|
| TD-004 | No concurrent edit protection | `saveToGitHub()` | Two phones editing = last write wins, data loss |
| TD-005 | `index.html` / `hospital-bills.html` duplicate | Both files | Manual sync; drift risk |
| TD-006 | Tesseract.js loaded on every page load | `<script src=tesseract>` | ~1–2 MB even if Care never used |
| TD-007 | Particle animation runs while ambient hidden | `initParticles()` | Wastes CPU/battery on mobile |
| TD-008 | No loading skeletons; splash fixed 600ms | `hideSplash()`, `.reveal` | Feels broken on slow networks |
| TD-009 | Docs outdated (PIN, totals, setup location) | `README.md`, `MOBILE-VENKY.md` | Confuses Venky setup |

### P2 — Medium

| ID | Issue | Location | Notes |
|----|-------|----------|-------|
| TD-010 | Full `render()` on every data change | `render()` | Rebuilds all tabs even when on Home |
| TD-011 | 60s poll without ETag/SHA check | `setInterval(loadData)` | Unnecessary fetches |
| TD-012 | Cache-bust `?b=` hardcoded separately from `PAGE_VERSION` | `<head>` script + `version.json` | Easy to forget one |
| TD-013 | Dead code: PIN modal, `PIN_KEY`, `adminOpen`, `saveJson()` | `index.html` | Removed from UX but code remains |
| TD-014 | Hidden `dock` nav still in HTML | `index.html` | Dead markup |
| TD-015 | Hidden `chat-fab` with CSS override | `index.html` | Care via bottom nav only |
| TD-016 | Google backend optional but half-integrated | `Code.gs`, `CONFIG.apiUrl` | Two sync paths confuse |
| TD-017 | No bill unique ID | `bills.json` schema | Duplicates possible on merge |
| TD-018 | `alert()` still used in some paths | `saveGithubToken`, legacy | Should use `toast()` |
| TD-019 | Monolithic 2,160-line file | `index.html` | Hard to review and test |

### P3 — Low

| ID | Issue | Location | Notes |
|----|-------|----------|-------|
| TD-020 | `package.json` unused for real build | `package.json` | Only `python -m http.server` |
| TD-021 | Excel/Python tools disconnected | `create_hospitalbills.py` | Separate workflow |
| TD-022 | `maximum-scale=1` blocks zoom | `<meta viewport>` | Accessibility concern |
| TD-023 | Chat messages unbounded in DOM | `addBotMsg()` | Long sessions could slow DOM |
| TD-024 | `syncPin: "0000"` in client CONFIG | `index.html` | PIN UI removed |

---

## Resolved (archive)

| ID | Issue | Resolved |
|----|-------|----------|
| TD-R01 | Orange ugly sync banner | v19 — removed |
| TD-R02 | Harsh WhatsApp settlement tone | v21 — warm Telugu message |
| TD-R03 | Long scrolling single page | v17 — tab navigation |
| TD-R04 | Service worker caching old versions | Self-destruct `sw.js` + `refresh.html` |
| TD-R05 | Dark futuristic UI hard to read on mobile | v20 — Blinkit light theme |

---

## Debt Paydown Order (recommended)

1. TD-002 (XSS escape) + TD-006 (lazy Tesseract) + TD-007 (remove particles) + TD-008 (skeletons)
2. TD-005 (single HTML file or CI sync)
3. TD-001 (serverless proxy for GitHub writes — needs architecture approval)
4. TD-004 (optimistic locking / bill IDs)
5. TD-019 (extract settlement math to testable module — needs approval)
