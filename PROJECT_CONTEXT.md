# PROJECT_CONTEXT.md — FamilyCare Hospital Bills

> **Permanent memory for all coding sessions.** Read this first before any change.

## Overview

Static family PWA for tracking **Sri Venkateswara Rao** hospital bills at **Mallareddy Hospital**.

Three sons share costs equally (1/3 each):

| Branch | Payer at hospital |
|--------|-------------------|
| Shivaji | Venky |
| Rajini | Deepa |
| Kalyan | Kalyan |

**Live URL (never change for family):** https://tevskrishna.github.io/hospital-bills/  
**GitHub repo:** `Tevskrishna/hospital-bills`  
**Current build:** `2026-07-03-v21` (see `version.json` + `PAGE_VERSION` in `index.html`)

## Architecture

```
Browser (index.html SPA)
    │ GET  data/bills.json
    │ GET  version.json
    │ PUT  GitHub Contents API (Venky phone only, via PAT)
    ▼
GitHub Pages (static hosting)
    └── data/bills.json  ← source of truth
```

**Optional path:** Google Apps Script (`google-setup/Code.gs`) → Google Sheet  
Not primary; used if `CONFIG.apiUrl` is set in localStorage.

**No backend server. No SQL database. No user accounts.**

## Folder Purpose

| Path | Role |
|------|------|
| `index.html` | **Production app** — entire UI, CSS, JS (~2,160 lines) |
| `hospital-bills.html` | Mirror of `index.html` — must stay synced manually |
| `data/bills.json` | Source of truth for bills, advances, careStatus |
| `version.json` | Build ID; triggers update banner when stale |
| `refresh.html` | Cache-bust page — clears SW/caches, redirects to latest |
| `sw.js` | Self-destruct service worker (fixes stuck old versions) |
| `manifest.json` | PWA metadata |
| `icons/icon.svg` | App icon |
| `google-setup/Code.gs` | Optional Google Sheets + Form backend |
| `.github/workflows/pages.yml` | Auto-deploy on push to `main` |
| `PUSH-TO-GITHUB.ps1` | Manual deploy script |
| `*.md` guides | Human setup docs (some outdated — check against app) |
| `create_hospitalbills.py` | Offline Excel tool — not wired to live app |

## Coding Conventions

- **Vanilla JS** — no build step, no framework, no modules
- **Global state:** `data`, `meta`, `careStatus`, `CONFIG`
- **`render()`** is the central UI refresh — call after any data change
- **`loadData(silent)`** fetches JSON; polls every 60s + on tab visible
- **`fmt(n)`** → INR currency; **`fmtDate(iso)`** → bilingual date string
- **Version bumps:** update together:
  1. `PAGE_VERSION` in `index.html`
  2. `version.json`
  3. `refresh.html` `?b=` param
  4. `<head>` cache-bust script `?b=` param
  5. Copy `index.html` → `hospital-bills.html`
- **Commits:** only when user asks
- **Powered by Tevs** footer — keep unless user removes

## Business Rules

1. **Fair share:** `totalBills() / 3` per son's branch
2. **Payers at hospital:** Venky, Deepa, Kalyan only
3. **Settlement:** When Kalyan underpaid → pays Deepa + Venky (by credit order). **Venky never pays Deepa.**
4. **Advances:** Shivaji→Venky in `advances[]` — separate from 3-way split
5. **WhatsApp tone:** Warm, respectful Telugu. No "owes", "MUST PAY", or "తీర్పు"
6. **Same URL always** for family
7. **Family sync delay:** ~30–90s after GitHub PUT (Pages deploy)

## Tab Structure (v17+)

| Tab | Content |
|-----|---------|
| **Home** | Quick chips, care status, total, who paid, settlement, add bill |
| **Bills** | Family hub, contributions, fair share, order-style history, CSV download, token setup |
| **+** (center) | Add bill modal |
| **Share** | Person cards, settlement, WhatsApp copy |
| **Care** | Rule-based chatbot + Tesseract OCR for prescriptions |

## Data Schema (`data/bills.json`)

```json
{
  "patient": "string",
  "hospital": "string",
  "startDate": "YYYY-MM-DD",
  "sons": [{ "name", "payer", "label", "color" }],
  "bills": [{ "d": "YYYY-MM-DD", "who": "Venky|Deepa|Kalyan", "amt": number, "mode": "", "note": "" }],
  "advances": [{ "d": "YYYY-MM-DD", "amt": number }],
  "careStatus": {
    "ward", "condition", "conditionTe",
    "expectedDischarge", "dischargeNote", "dischargeNoteTe",
    "lastUpdate", "lastUpdateBy"
  }
}
```

## API Contracts

### GitHub Contents API (primary write)

- **GET/PUT** `https://api.github.com/repos/Tevskrishna/hospital-bills/contents/data/bills.json`
- **Auth:** `Authorization: Bearer {github_pat}` from `localStorage.hb_github_token`
- **Body:** full `buildPayload()` JSON, base64-encoded, with `sha` from prior GET

### Static read

- **GET** `./data/bills.json?v={timestamp}` — cache-busted

### Google Apps Script (optional)

- **GET** `{apiUrl}` → JSON export
- **GET** `{apiUrl}?format=csv` → CSV export
- **POST** `{ action, pin: "0000", ... }` → `{ ok, error? }`
- Actions: `addBill`, `addAdvance`, `updateCareStatus`, `importAll`

## localStorage Keys

| Key | Purpose |
|-----|---------|
| `hb_github_token` | GitHub PAT for mobile sync |
| `hb_apiUrl` | Google Web App URL (optional) |
| `hospitalBillsLocal` | Pending bills when offline / no token |
| `hb_pin_ok` | Legacy — unused (PIN removed from UI) |

## Known Limitations

- All financial data is **public** on GitHub Pages
- GitHub PAT on device = security risk if phone compromised
- No concurrent edit protection (last PUT wins)
- Chatbot is regex rules + OCR — **not medical advice**
- Tesseract loaded from CDN on every page load
- `index.html` monolith — hard to test and maintain
- Particle animation runs though ambient layer is hidden
- PIN UI removed but `MOBILE-VENKY.md` and `Code.gs` still reference PIN

## Deployment

```powershell
cd "c:\Users\Admin\Desktop\Hospital bills"
# Edit index.html, bump version, then:
Copy-Item index.html hospital-bills.html -Force
git add -A && git commit -m "..." && git push origin main
```

GitHub Actions deploys Pages automatically.  
**Cache stuck?** → https://tevskrishna.github.io/hospital-bills/refresh.html

## Documentation Index

| Doc | Purpose |
|-----|---------|
| `PROJECT_CONTEXT.md` | **Read first** — architecture, schema, workflow |
| `PRODUCT_VISION.md` | Mission, users, principles, success metrics |
| `ROADMAP.md` | Current / next / 3mo / 6mo releases |
| `ARCHITECTURE_DECISIONS.md` | ADRs (why we built it this way) |
| `DESIGN_SYSTEM.md` | Colors, typography, components, states |
| `API_CONTRACTS.md` | All APIs with examples |
| `CONTRIBUTING.md` | How to work on this project |
| `KNOWN_LIMITATIONS.md` | Accepted trade-offs |
| `HEALTH.md` | Health scores |
| `TECH_DEBT.md` | Prioritized debt |
| `IDEAS.md` | Future backlog (not approved) |
| `CHANGELOG.md` | Release history |
| `.cursor/rules/` | Cursor AI enforcement rules |

## Technical Owner Workflow (mandatory — every request)

**Before implementing anything (automatic, no wait):**
1. Requirement validation — restate, business/user/technical impact
2. Impact analysis — affected files table + regression risks
3. Implementation plan — phases, smallest safe change
4. Code review before coding — search for existing helpers, no duplication
5. Implement — reuse, extend, backward compatible
6. Self-review — score Correctness/Performance/Readability/Security/A11y/Maintainability /10
7. Regression checklist — desktop, mobile, offline, slow network, empty states
8. Update docs — `CHANGELOG.md`, `HEALTH.md`, `TECH_DEBT.md` when applicable
9. End with exactly 5 improvements — **wait for approval before implementing**
10. If better solution exists than requested — present both options, wait for decision

## Session Workflow (mandatory)

1. Read this file + relevant `.cursor/rules/`
2. Run steps 1–4 above before any code change
3. Smallest safe change only
4. Update docs per step 8
5. End session with 5 ranked improvements — wait for approval
