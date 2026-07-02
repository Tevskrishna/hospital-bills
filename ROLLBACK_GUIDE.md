# Rollback Guide — v25 LTS

## When to rollback

- Settlement numbers wrong on production
- App blank / JS errors for all users
- Sync corrupting `data/bills.json`

## Fast rollback (GitHub Pages)

### Option A — Revert commit (preferred)

```bash
git log --oneline -5
git revert <bad-commit-sha>
git push origin main
```

GitHub Actions redeploys the previous working `dist/`.

### Option B — Redeploy previous tag

```bash
git checkout v24.1   # or last known good tag
npm ci && npm test && npm run build:production
# Manually upload dist/ via gh-pages branch if needed
git checkout main
```

### Option C — User-side cache only

If code is fine but users see old UI:

1. Share link: `https://tevskrishna.github.io/hospital-bills/refresh.html`
2. Or add `?b=25&t=<timestamp>` to URL

## Data rollback

Bills live in `data/bills.json` on GitHub. To restore:

1. GitHub → repo → `data/bills.json` → History
2. Restore previous commit of that file
3. Family apps refresh within ~60s

## Post-rollback

1. Document incident in `CHANGELOG.md` (maintenance section)
2. Add regression test if bug was testable
3. Do **not** change settlement logic without family sign-off

## Emergency contacts

- Repo owner: Tevskrishna
- On-call family admin: Venky (phone setup / token)
