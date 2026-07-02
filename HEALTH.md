# Project Health Score

> Last updated: 2026-07-03 (post architecture review, v21)  
> Reviewer: Chief Architect session

| Dimension | Score | Trend |
|-----------|-------|-------|
| **Architecture** | 5/10 | → |
| **Performance** | 4/10 | → |
| **Security** | 3/10 | → |
| **UX** | 7/10 | ↑ |
| **Accessibility** | 5/10 | → |
| **Maintainability** | 4/10 | → |
| **Testing** | 1/10 | — |
| **Scalability** | 4/10 | → |
| **Code Quality** | 5/10 | → |
| **Overall** | **4.2/10** | |

---

## Architecture — 5/10

**Why:** Clear static-site + JSON pattern works for one family. Monolithic 2,160-line `index.html` is the entire system. No modules, no separation of concerns. Duplicate `hospital-bills.html`. Optional Google backend half-integrated.

**Strengths:** Simple deploy, no server cost, family can use one URL forever.  
**Weaknesses:** Cannot scale to multi-family without rewrite. High coupling.

---

## Performance — 4/10

**Why:** ~98 KB single HTML file. Tesseract.js loads on every visit (~1–2 MB). Particle `requestAnimationFrame` loop runs while ambient is hidden. Full `render()` rebuilds all tabs. Fixed 600ms splash unrelated to load. 60s polling without change detection. Three Google Font families block render.

**Strengths:** Static assets on CDN. JSON payload small (~10 KB).  
**Weaknesses:** Low-end Android WhatsApp browser will feel sluggish.

---

## Security — 3/10

**Why:** GitHub PAT in `localStorage`. All bills public. `innerHTML` with user-supplied `note` fields (XSS risk). Google sync PIN `0000` in client + server. No CSP headers. No rate limiting.

**Strengths:** No server to compromise. Token not committed to repo.  
**Weaknesses:** Critical for any expansion beyond trusted family.

---

## UX — 7/10

**Why:** v20 Blinkit-style light theme is a big improvement. Tab navigation clear. Warm WhatsApp message (v21). Quick action chips. Order-style bill history.

**Weaknesses:** Loading feels abrupt (no skeletons). `.reveal` hides above-fold content. Setup box buried in Bills tab. No pull-to-refresh.

---

## Accessibility — 5/10

**Why:** Some `aria-label` on buttons. Telugu + English content. Bottom nav has text labels.

**Weaknesses:** No focus trap in modal. Settlement arrows not announced. Color-only status in person cards. No `aria-current` on active tab.

---

## Maintainability — 4/10

**Why:** One file holds CSS, HTML, JS. Manual sync of two HTML files. Dead code (PIN modal, dock, particles, `saveJson`). Docs outdated (`README.md`, `MOBILE-VENKY.md`).

**Strengths:** No build toolchain to break. Easy for one person to deploy.  
**Weaknesses:** Every change risks regression across 2,160 lines.

---

## Testing — 1/10

**Why:** Zero automated tests. Settlement math manually verified. No CI checks beyond Pages deploy.

**Strengths:** Small domain logic could be tested easily.  
**Weaknesses:** Any edit to `computeSettlement` is blind.

---

## Scalability — 4/10

**Why:** Full JSON rewrite per bill. ~50 bills fine; thousands would lag. Single patient hardcoded in meta. GitHub API rate limits unlikely at family scale.

**Strengths:** Adequate for current hospital stay duration.  
**Weaknesses:** Multi-family SaaS would need new architecture.

---

## Code Quality — 5/10

**Why:** Readable function names. Consistent `fmt`/`render` patterns. Silent `catch {}` everywhere. Globals. Mixed Telugu/English intentional.

**Strengths:** Works reliably for stated use case.  
**Weaknesses:** No linting, no types, no separation.

---

## Target Scores (6-month horizon)

| Dimension | Target |
|-----------|--------|
| Architecture | 7 |
| Performance | 8 |
| Security | 6 |
| UX | 9 |
| Accessibility | 7 |
| Maintainability | 7 |
| Testing | 6 |
| Scalability | 5 |
| Code Quality | 7 |
