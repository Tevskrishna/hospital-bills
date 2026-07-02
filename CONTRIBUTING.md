# Contributing to FamilyCare

> Thank you for helping evolve this family product.  
> **Maintainer:** Tevskrishna / Technical Owner  
> **Last updated:** 2026-07-03

---

## Before You Start

1. Read **`PROJECT_CONTEXT.md`** — how the app works today  
2. Read **`PRODUCT_VISION.md`** — what we're building and why  
3. Read **`ARCHITECTURE_DECISIONS.md`** — decisions already made  
4. Check **`ROADMAP.md`** — what's planned vs out of scope  
5. Review **`.cursor/rules/`** — coding, UX, security, release standards  

---

## Who Can Contribute

| Contributor | Typical changes |
|-------------|-----------------|
| **Technical Owner (AI/human)** | Features, fixes, docs, architecture proposals |
| **Venky** | Bill data, care status, token setup, family feedback |
| **Family** | UX feedback, WhatsApp copy review — not code |

---

## Development Setup

### Prerequisites

- Git  
- GitHub account with access to `Tevskrishna/hospital-bills`  
- Optional: Python 3 for local static server  

### Local run

```powershell
cd "c:\Users\Admin\Desktop\Hospital bills"
python -m http.server 8080
# Open http://localhost:8080/index.html
```

Or use `npm start` (same python server).

### No build step

There is no `npm install`, webpack, or TypeScript compile. Edit `index.html` directly.

---

## Workflow (mandatory)

### 1. Requirement validation

Restate the change in one sentence. Identify business, user, and technical impact.

### 2. Impact analysis

| Affected File | Reason | Risk | Change size |
|---------------|--------|------|-------------|

List regressions, security, mobile, and accessibility impacts.

### 3. Implementation plan

Phases + **smallest safe change**. Wait for approval on architecture changes.

### 4. Code before coding

Search for existing helpers (`fmt`, `toast`, `render*`, `computeSettlement`). **Do not duplicate.**

### 5. Implement

- Reuse > extend > compose  
- Backward compatible `bills.json` schema  
- No unnecessary abstractions  

### 6. Self-review

Score /10: Correctness, Performance, Readability, Security, Accessibility, Maintainability.  
Explain anything below 8.

### 7. Regression checklist

- [ ] Desktop Chrome  
- [ ] Mobile / WhatsApp browser  
- [ ] Home, Bills, Share, Care tabs  
- [ ] Add bill + sync  
- [ ] Offline / no token path  
- [ ] Empty states  
- [ ] Slow network behavior  

### 8. Documentation

Update when applicable:

| File | When |
|------|------|
| `CHANGELOG.md` | Any behavioral change |
| `PROJECT_CONTEXT.md` | Schema, API, rules change |
| `HEALTH.md` | Score shift ≥ 1 |
| `TECH_DEBT.md` | New or resolved debt |
| `ARCHITECTURE_DECISIONS.md` | New ADR |
| `DESIGN_SYSTEM.md` | Visual/token change |
| `API_CONTRACTS.md` | API shape change |
| `ROADMAP.md` | Release scope change |

### 9. Version bump (user-visible changes)

See `.cursor/rules/release-process.mdc`:

1. `PAGE_VERSION` in `index.html`  
2. `version.json`  
3. `refresh.html` `?b=`  
4. `<head>` cache script `?b=`  
5. `Copy-Item index.html hospital-bills.html -Force`  

### 10. Commit & deploy

Commits only when explicitly requested.

```powershell
git add index.html hospital-bills.html version.json refresh.html [docs]
git commit -m "Description (v22)."
git push origin main
```

GitHub Actions deploys Pages automatically.

---

## Code Style

### JavaScript

- Vanilla ES6+ in `index.html` `<script>`  
- Use `fmt()`, `toast()`, existing render functions  
- Escape user content before `innerHTML`  
- Prefer `toast()` over `alert()`  

### CSS

- Use `:root` CSS variables — see `DESIGN_SYSTEM.md`  
- Mobile-first, safe-area insets  
- Match Blinkit light theme unless design review approves change  

### Telugu copy

- Warm, respectful tone for family-facing strings  
- No blame language in settlement/share contexts  

---

## What NOT to Do

| Don't | Why |
|-------|-----|
| Commit GitHub tokens or secrets | Security |
| Change family URL | Product principle |
| Break `bills.json` schema without migration | Family clients |
| Add React/framework without ADR | Architecture decision |
| Remove working features silently | Backward compatibility |
| Implement `IDEAS.md` items without approval | Scope control |
| Force-push `main` | Deployment safety |

---

## Architecture Changes

Require **ADR** in `ARCHITECTURE_DECISIONS.md` and explicit approval.

If your approach differs from the request, present:

1. Requested approach  
2. Recommended approach  
3. Pros / cons / risks  

**Wait for decision.** Do not surprise with rewrites.

---

## Testing

No automated suite yet. Manual regression required every change.

**Priority for first tests:** `computeSettlement`, `computeSplit`, `fmt`

See `.cursor/rules/testing.mdc`.

---

## File Map (quick reference)

| Want to change… | Edit… |
|-----------------|-------|
| UI / logic | `index.html` |
| Bill data (manual) | `data/bills.json` |
| Google backend | `google-setup/Code.gs` |
| Deploy | `.github/workflows/pages.yml` |
| PWA | `manifest.json`, `sw.js` |

---

## Getting Help

| Question | Doc |
|----------|-----|
| How does sync work? | `PROJECT_CONTEXT.md`, `API_CONTRACTS.md` |
| Why vanilla JS? | `ARCHITECTURE_DECISIONS.md` ADR-001 |
| What's planned? | `ROADMAP.md` |
| Known issues? | `TECH_DEBT.md`, `KNOWN_LIMITATIONS.md` |
| Visual standards? | `DESIGN_SYSTEM.md` |

---

## Session End

Every coding session ends with **exactly 5 ranked improvements** — not implemented until approved.

See `.cursor/rules/documentation.mdc`.
