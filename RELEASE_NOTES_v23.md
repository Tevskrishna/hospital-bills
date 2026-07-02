# Release Notes — v23 (Production QA)

**Build:** `2026-07-03-v23`

## Summary

Final production polish pass: Lighthouse fixes, full PWA, accessibility, dead code removal, analytics (no PII), and 100-case test plan.

## Lighthouse fixes

| Issue | Fix | Impact |
|-------|-----|--------|
| `maximum-scale=1` | Removed — zoom allowed | A11y +4 |
| Missing meta description | Added + Open Graph | SEO +4 |
| No main landmark | `<main id="main">` | A11y |
| Low contrast live pill | Darker green on light bg | A11y |
| favicon 404 | `icons/favicon.svg` | Best practices |
| Render-blocking fonts | Async preload | Performance |
| ~170 lines dead CSS | Removed ambient/hero/particles | Performance |
| Console SW unregister | Proper `sw.js` registration | PWA |

## PWA

- Service worker: cache-first static, network-first `bills.json`
- `offline.html` fallback
- Manifest: icons 192/512, shortcuts (Add bill, Share)
- Background sync hook for pending bills
- Push-ready architecture in `sw.js`

## UX micro-interactions

- FAB rotates 45° when add sheet open
- Bottom sheet spring animation
- `.pressable` scale on tap
- Haptic feedback (`navigator.vibrate`) on key actions
- Success toast with checkmark

## Analytics (local only, no PII)

Counts stored in `localStorage` key `fc_metrics_v1`:

- `app_load`, `bill_added`, `sync_success`, `sync_failure`
- `ocr_used`, `whatsapp_copy`, `pwa_installed`, `version_mismatch`

## Assets

- `icons/icon-1024.png`, `icon-512.png`, `icon-192.png`, `apple-touch-icon.png`
- `assets/og-preview.png`
- `icons/favicon.svg`

## Business logic

**Unchanged** — `computeSettlement()`, `computeSplit()`, fair share, WhatsApp message content.

## Upgrade

Open `refresh.html` or visit with `?b=23`.
