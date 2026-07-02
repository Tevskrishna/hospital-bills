# Deployment Guide — v25 LTS

## Overview

FamilyCare deploys to **GitHub Pages** via GitHub Actions. Production ships **`dist/` only** — readable JavaScript sources and dev tooling are not published.

## Automatic deployment (recommended)

```bash
git push origin main
```

Workflow: `.github/workflows/pages.yml`

1. `npm ci`
2. `npm test` (39 tests)
3. `npm run build:production`
4. Upload `dist/` to GitHub Pages

**Live URL:** https://tevskrishna.github.io/hospital-bills/

## Manual verification before push

```powershell
cd "c:\Users\Admin\Desktop\Hospital bills"
npm install
npm test
npm run build:production
cd dist
python -m http.server 8080
# Open http://localhost:8080
```

## What gets deployed

| Included in `dist/` | Excluded |
|---------------------|----------|
| `index.html`, `hospital-bills.html` | `js/config.js` … `js/app.js` (readable) |
| `css/*.css` (6 stylesheets) | `tests/` |
| `js/app.min.js` (obfuscated) | `scripts/` |
| `sw.js`, `manifest.json`, `data/`, `icons/` | Source maps (not generated) |

## Cache invalidation

- Cache bust query: `?b=25`
- Force refresh page: `/refresh.html`
- Service worker version: `familycare-v25-lts-prod` (production build)

## Environment

No server-side env vars. GitHub PAT is entered by family admin in the app (Bills tab).

## Rollback

See [ROLLBACK_GUIDE.md](ROLLBACK_GUIDE.md).
