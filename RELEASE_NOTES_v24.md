# Release Notes — v24 Enterprise Hardening

**Build:** `2026-07-03-v24`  
**Date:** 3 July 2026

## Summary

v24 is a **maintainability and production-quality release**. No UI redesign. No business logic changes. The monolithic inline script (~1,150 lines) is now 13 focused modules with automated regression tests.

## What Changed

### Architecture
| Module | Responsibility |
|--------|----------------|
| `js/config.js` | Version, constants, shared state |
| `js/utils.js` | Formatting, XSS escape, fetch timeout, debounce |
| `js/validation.js` | Bill/advance validation, JSON sanitization |
| `js/calculations.js` | Fair share & settlement (frozen) |
| `js/storage.js` | localStorage pending queue |
| `js/sync.js` | GitHub / Google sync, loadData |
| `js/ui.js` | Toasts, modals, navigation, forms |
| `js/render.js` | DOM rendering |
| `js/whatsapp.js` | WhatsApp message (frozen tone) |
| `js/care.js` | Care chat & OCR |
| `js/pwa.js` | Service worker, install, pull-to-refresh |
| `js/app.js` | Bootstrap |

### Error Handling
- Corrupt `localStorage` and invalid API JSON are sanitized, not crashed
- GitHub/network failures show family-friendly messages
- OCR failures show guided fallback (no stack traces)

### Performance
- Debounced bill search (200ms)
- Single IntersectionObserver instance (no leak on re-render)
- Removed duplicate CSS (~15 lines)

### Testing
```bash
npm test           # 19 tests
npm run test:coverage
```

## Upgrade Path

1. Deploy to GitHub Pages
2. Users on old cache: open `/refresh.html` or wait for update banner
3. Cache bust param: `?b=24`

## Frozen (unchanged)

- Fair share = total ÷ 3
- Settlement: Kalyan → Venky/Deepa only; Venky never pays Deepa
- Shivaji→Venky advances separate from 3-way split
- WhatsApp message content and tone
- GitHub API write contract
