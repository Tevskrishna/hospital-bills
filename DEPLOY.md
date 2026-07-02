# Deploy to GitHub Pages

## Automatic (recommended)

Push to `main`. GitHub Actions will:

1. Run `npm test`
2. Build `dist/` with **minified + obfuscated** `js/app.min.js`
3. Deploy **only `dist/`** — readable `js/*.js` source files are **not** published

Live site: **https://tevskrishna.github.io/hospital-bills/**

## Manual build (before local verify)

```powershell
cd "c:\Users\Admin\Desktop\Hospital bills"
npm install
npm test
npm run build:production
# Serve dist locally:
cd dist
python -m http.server 8080
```

## One-time repo push

```powershell
.\PUSH-TO-GITHUB.ps1
```

## Code protection (important)

| What | Reality |
|------|---------|
| **Production site** | Ships one obfuscated `app.min.js` — very hard to read or copy logic |
| **This folder (dev)** | Full readable `js/` modules for maintenance |
| **Public GitHub repo** | Anyone who clones the repo still sees source — use a **private repo** if you need legal + technical lockdown |
| **100% block** | Impossible for any website — browsers must download runnable code |

Casual users inspecting DevTools will see scrambled code, not your module structure.