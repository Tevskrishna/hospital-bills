# Final Release Checklist — v25 LTS

**Build:** `2026-07-03-v25-lts`  
**Release type:** Long-Term Support (bugfix-only after this tag)

## Pre-release

- [x] All 39 automated tests pass (`npm test`)
- [x] Production build succeeds (`npm run build:production`)
- [x] Business logic unchanged (settlement, fair share, WhatsApp, GitHub sync)
- [x] UI appearance unchanged (CSS extracted, not redesigned)
- [x] Version bumped: `config.js`, `version.json`, cache bust `b=25`
- [x] Service worker cache: `familycare-v25-lts`
- [x] CSS externalized to `css/` (6 files)
- [x] Obfuscated production bundle (`dist/js/app.min.js`)
- [x] Documentation updated

## Deploy steps

1. Merge to `main`
2. GitHub Actions runs tests + build + deploys `dist/`
3. Verify live: https://tevskrishna.github.io/hospital-bills/
4. Open `/refresh.html` on one test device to confirm cache update
5. Smoke test: load home, add bill (dev), copy WhatsApp, offline mode

## Post-release

- [ ] Tag git: `v25-lts`
- [ ] Announce to family (WhatsApp)
- [ ] Freeze feature development — maintenance mode only

## Sign-off

| Role | Status |
|------|--------|
| CTO / Release Manager | Approved for LTS |
| Business logic frozen | Yes |
| P0/P1 blockers | None |
