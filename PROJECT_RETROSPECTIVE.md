# Project Retrospective — FamilyCare Hospital Bills

**Final release:** v25 LTS (`2026-07-03-v25-lts`)  
**Purpose:** Capture lessons for future projects (CareerSetu, Health OS, enterprise templates)

---

## 1. What went well

- **Real problem, real users.** A family hospital bill tracker with Telugu + English had immediate daily value — motivation stayed high.
- **Incremental releases (v20→v25).** Each version had a single theme (UI, PWA, hardening, protection, LTS) instead of endless mixed changes.
- **Frozen business logic early.** Settlement rules (`total ÷ 3`, Kalyan settles to creditors, Venky never pays Deepa) were locked and regression-tested — zero math regressions after v24.
- **Documentation as a deliverable.** README, CHANGELOG, TEST_PLAN, deploy/rollback/maintenance guides made the project feel like a product, not a demo.
- **Cursor + rules workflow.** `.cursor/rules/` for architecture, security, release process kept AI assistance aligned across sessions.
- **Static-first architecture.** GitHub Pages + JSON + optional GitHub sync = zero server cost, fast deploy, family can use one URL forever.
- **WhatsApp as the integration layer.** One-tap warm Telugu message beat building notifications or a backend.

---

## 2. What went wrong

- **Monolith phase lasted too long.** ~2,400-line `index.html` with inline CSS/JS made v24 modularization painful; should have split modules at v20.
- **Duplicate file drift.** `index.html` and `hospital-bills.html` had to be manually synced — caused near-misses.
- **Accidental deletions during cleanup.** Removing dead CSS once deleted `fmt()` and broke the app until caught in QA.
- **Over-iteration temptation.** Multiple “one more polish” passes (v22 UI, v23 PWA, v24 enterprise) — user correctly stopped at v25 LTS.
- **Public repo + obfuscation mismatch.** Obfuscated `dist/` protects the live site; public GitHub still exposes readable source unless repo is private.
- **No E2E automation.** 39 unit tests are strong for math/validation; browser flows still rely on manual TEST_PLAN.

---

## 3. Biggest technical challenges

| Challenge | Resolution |
|-----------|------------|
| Settlement fairness across 3 sons with different payers | Pure functions + unit tests; frozen spec in API_CONTRACTS |
| Mobile sync without a backend | GitHub Contents API + localStorage pending queue + background sync |
| PWA cache invalidation on GitHub Pages | `version.json`, `?b=25` cache bust, `refresh.html`, SW version bumps |
| XSS from bill notes | `esc()` on all user-derived HTML |
| CSS extraction without visual change | Sequential slice into 6 files preserving cascade order |
| Production code protection | `dist/` + obfuscated bundle; readable `js/` excluded from deploy |

---

## 4. Biggest UX improvements

- **Blinkit/Swiggy-style mobile shell** (v20) — sticky header, bottom nav, light theme.
- **Home dashboard** (v22) — rings, recent activity, settlement hero at a glance.
- **Live WhatsApp preview** (v22) — family sees exact message before copy.
- **Care assistant + OCR** — prescription upload reduced “call Venky for every slip” friction.
- **Pull-to-refresh + offline shell** — felt native on phones without an app store.
- **Warm Telugu tone in share message** — reduced family disputes; “OK reply” culture.

---

## 5. Architecture decisions that paid off

1. **JSON as source of truth** (`data/bills.json`) — simple, diffable, GitHub-native.
2. **IIFE modules + `FC` namespace** — no build step required for dev; globals for HTML `onclick` handlers.
3. **`dist/`-only production deploy** — obfuscation + smaller attack surface for casual copiers.
4. **GitHub Actions: test → build → deploy** — every push is gated.
5. **Service worker: cache-first static, network-first data** — offline UI works; bills refresh when online.
6. **Lazy Tesseract** — OCR only when Care tab used; saved ~1–2 MB on every load.

---

## 6. Mistakes to avoid next time

- Don’t keep inline CSS/JS past ~500 lines — extract early.
- Don’t redesign UI and refactor logic in the same release.
- Don’t expose raw API errors to users (`r.error` in toasts was a lesson).
- Don’t skip tests for “obvious” math — settlement bugs destroy family trust.
- Don’t chase Lighthouse 100 at the expense of shipping — 86 Performance + 100 a11y was enough.
- Don’t create v26 “just for fun” — freeze and move on.

---

## 7. Estimated development timeline

| Phase | Approx. duration | Output |
|-------|------------------|--------|
| v1–v19 Core tracker + sync | Weeks 1–4 | Working bills, CSV, GitHub sync |
| v20 Consumer UI | Week 5 | Mobile-first redesign |
| v21 WhatsApp tone | Week 5 | Family-safe messaging |
| v22 Premium dashboard | Week 6 | Home, FAB, lazy OCR |
| v23 PWA + QA | Week 7 | SW, offline, Lighthouse, TEST_PLAN |
| v24 Enterprise hardening | Week 8 | Modules, 19→39 tests, validation |
| v24.1 Code protection | Week 8 | Obfuscated dist build |
| v25 LTS | Week 9 | CSS extract, docs, freeze |

**Total:** ~9 weeks part-time (with AI-assisted Cursor workflow), single developer + family feedback.

---

## 8. Lessons learned

- **Ship for one user first** (Venky at hospital), then generalize for three sons.
- **Bilingual copy is a feature**, not decoration — Telugu labels reduced support calls.
- **Documentation is portfolio content** — reviewers read DEPLOYMENT_GUIDE before code.
- **LTS means saying no** — roadmap frozen; maintenance backlog only.
- **Portfolio value ≠ feature count** — 9.5/10 static app beats half-finished “platform.”

---

## 9. Reusable components for future projects

Copy or adapt from this repo:

| Asset | Path |
|-------|------|
| Module layout | `js/config.js`, `utils.js`, `validation.js`, `sync.js`, `render.js`, `app.js` |
| CSS structure | `css/theme|app|components|utilities|animations|responsive.css` |
| Test pattern | `tests/*.test.js` + `npm test` |
| Production build | `scripts/build-production.js` |
| PWA shell | `sw.js`, `manifest.json`, `offline.html`, `refresh.html` |
| Release docs | `DEPLOYMENT_GUIDE`, `ROLLBACK_GUIDE`, `MAINTENANCE_GUIDE`, `FINAL_RELEASE_CHECKLIST` |
| Cursor rules | `.cursor/rules/*.mdc` |
| CI pipeline | `.github/workflows/pages.yml` |
| Code protection | `js/protect.js` + obfuscated bundle |
| Privacy-safe analytics | `js/analytics.js` (`fc_metrics_v1`, no PII) |

**Next step:** Extract into `enterprise-web-app-template` repo (separate from this family app).

---

## 10. Checklist for starting the next project

### Before writing code
- [ ] Define **frozen business rules** in one doc (like settlement spec)
- [ ] Choose **static vs backend** deliberately
- [ ] Set up **`.cursor/rules/`** from day one
- [ ] Create **CHANGELOG.md** and **ROADMAP.md** (with explicit “won’t do” list)

### Week 1
- [ ] HTML shell + external CSS (not inline)
- [ ] `js/config.js` + `utils.js` + one feature module
- [ ] `npm test` with at least one test
- [ ] GitHub Pages workflow stub

### Before first “real” release
- [ ] `esc()` or framework-safe rendering for user input
- [ ] Friendly error messages (no raw API text)
- [ ] PWA manifest + basic SW
- [ ] TEST_PLAN.md (even manual)

### Before calling it “production”
- [ ] Unit tests on core logic (90%+ on pure functions)
- [ ] `dist/` or equivalent production build
- [ ] Deploy / rollback / maintenance guides
- [ ] Tag LTS and **stop feature work**

### Portfolio
- [ ] Live demo URL
- [ ] 2–3 minute video (dashboard → core flow → offline/PWA)
- [ ] Architecture diagram in README
- [ ] Link from portfolio site

---

## Closing

Hospital Bills v25 LTS is **done**. It is a portfolio piece, an engineering reference, and a template for the next product — not a platform to extend forever.

**Next investment:** CareerSetu or Health OS — bigger scope, same discipline.

🧊 *Maintenance mode. No v26.*
