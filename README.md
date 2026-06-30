# Mallareddy Hospital Bills — Venkateswara Rao Family

Live family tracker for hospital expenses. **Telugu + English**, WhatsApp-friendly, Google Form for Deepa/Kalyan to add payments.

## Live page (GitHub Pages)

After Pages is enabled: **https://tevskrishna.github.io/hospital-bills/**

## Quick links for family (WhatsApp)

| Link | Who uses it |
|------|-------------|
| GitHub Pages URL above | Everyone — view totals |
| Google Form (after setup) | Deepa, Kalyan — add payments |

## Daily workflow

1. Family submits payment via **Google Form** (optional)
2. Open the live page → tap **Refresh**
3. Tap **WhatsApp కు Copy** → paste in family group
4. Family replies **OK**

## One-time Google setup (Venky — 15 min)

1. [Create Google Sheet](https://sheets.google.com) → Extensions → Apps Script
2. Paste all of [`google-setup/Code.gs`](google-setup/Code.gs)
3. Run **`setupEverything`** → Authorize
4. Deploy → **Web app** → Execute as Me → Anyone → copy URL
5. Edit `index.html` → paste URLs in `CONFIG` at bottom → commit & push

Full steps: [SETUP-COMBINED.md](SETUP-COMBINED.md)

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main app (hosted on GitHub Pages) |
| `google-setup/Code.gs` | Google Sheet + Form automation |
| `hospitalbills.csv` | Backup data import |
| `SETUP-COMBINED.md` | Complete setup guide |

## Current totals (Jun 2026)

| Person | Amount |
|--------|--------|
| Venky | ₹5,980.44 |
| Deepa | ₹14,618.57 |
| Kalyan | ₹3,600.00 |
| **Total** | **₹24,199.01** |
| Shivaji → Venky | ₹7,509.00 |

---

Family: Shivaji (Venky) · Rajini (Deepa) · Kalyan — sons of Sri Venkateswara Rao
