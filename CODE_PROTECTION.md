# Code Protection

## What was implemented (v24.1)

### Production deploy (`dist/` only)
- All JavaScript merged into **one file**: `js/app.min.js`
- **Minified** (terser) then **obfuscated** (javascript-obfuscator)
- Readable `js/config.js`, `js/sync.js`, etc. are **not uploaded** to GitHub Pages
- Service worker caches only `app.min.js`

### Client deterrents (production host only)
- Copyright warning in browser console
- Right-click disabled (except inputs, buttons, WhatsApp preview)
- Blocks F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S
- Image drag disabled

Skipped on `localhost` so you can still develop normally.

### Legal
- `LICENSE` — proprietary, no-clone terms

## Commands

```bash
npm run build:production   # creates dist/
```

GitHub Actions runs tests + build and deploys `dist/` on every push to `main`.

## Honest limits (read this)

| Threat | Protected? |
|--------|------------|
| Casual user copies from DevTools | **Hard** — sees obfuscated mess |
| Competitor clones live site assets | **Harder** — no module names or comments |
| Someone clones your **GitHub repo** | **Not protected** if repo is public |
| Determined engineer with time | **Not fully blockable** — all web apps run code in the browser |

**For strongest lock:** make the GitHub repository **private**. Obfuscation protects the live site; privacy protects the source repo.

## What we did NOT do (on purpose)

- No UI redesign
- No business logic changes
- Did not block copy/paste in WhatsApp share area
- Did not use `debugProtection` loops (breaks phones, easy to bypass)
