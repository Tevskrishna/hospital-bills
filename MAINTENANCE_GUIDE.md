# Maintenance Guide — v25 LTS

## Support policy

| Allowed | Not allowed |
|---------|-------------|
| Bug fixes | New features |
| Security patches | UI redesign |
| Dependency updates (dev) | Settlement logic changes |
| Copy/validation fixes | WhatsApp message tone changes |
| PWA/cache fixes | Architecture rewrites |

**Support window:** 5 years from 2026-07-03 (bugfix-only).

## Monthly checklist

- [ ] Run `npm test` locally
- [ ] Verify live site loads (home + share tab)
- [ ] Check `data/bills.json` size / validity
- [ ] Rotate GitHub PAT if exposed or staff change

## Bug fix workflow

1. Branch from `main`: `fix/short-description`
2. Write failing test if possible (calculations/validation/storage/sync helpers)
3. Fix with minimal diff
4. `npm test && npm run build:production`
5. PR → merge → auto-deploy

## File map (where to look)

| Symptom | Module |
|---------|--------|
| Wrong settlement | `js/calculations.js` — **frozen, extreme caution** |
| Sync failed | `js/sync.js`, token in localStorage |
| UI not updating | `js/render.js` |
| WhatsApp text | `js/whatsapp.js` — **frozen** |
| Styles | `css/*.css` |
| Offline | `sw.js`, `offline.html` |

## Testing

```bash
npm test                 # 39 unit tests
npm run test:coverage    # calculations ~90%, validation 100%, storage ~96%
```

Browser E2E: follow `TEST_PLAN.md` manually (no Playwright in LTS scope).

## Version bumps (patch only)

1. `js/config.js` → `FC.PAGE_VERSION`
2. `version.json`
3. `refresh.html` cache param if needed
4. `sw.js` → `CACHE_VERSION` suffix `-patchN` if cache break required
5. `CHANGELOG.md`

## Production build

Never edit `dist/` by hand. Always:

```bash
npm run build:production
```

## Known accepted limitations

See `KNOWN_LIMITATIONS.md` and `TECH_DEBT.md` (P2/P3 items deferred from LTS).
