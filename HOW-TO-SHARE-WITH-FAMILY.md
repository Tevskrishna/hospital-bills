# Best way to share hospital bills with family (no app install)

## My recommendation for your situation

| Option | Best for | Install? | Family can understand? | You can update daily? |
|--------|----------|----------|------------------------|------------------------|
| **1. Google Sheets (link)** | **BEST overall** | No — opens in browser | Yes — one simple page | Yes — from phone |
| **2. HTML file (hospital-bills.html)** | Quick start today | No — opens in Chrome | Yes — big numbers | Yes — on your phone only |
| **3. WhatsApp text + screenshot** | Daily habit | No | Very easy | You type/copy |
| Excel / LibreOffice | Your computer only | No | Hard for elders | Yes but charts break |
| Custom phone app | Long term | Yes — slow | Good | Yes |

---

## What I would do (step by step)

### Phase 1 — Today (5 minutes)
1. Open **`hospital-bills.html`** on your phone (Chrome).
2. Tap **Copy for WhatsApp** → paste in family group.
3. They read big numbers — no Excel needed.

### Phase 2 — This week (best long-term)
1. Create **Google Sheet** (free): https://sheets.google.com
2. Import data from `hospitalbills.csv` (in this folder).
3. Share link on WhatsApp → **View only** for family, **Edit** only for you (Venky).
4. Every day: add one row, screenshot the summary, send to group.

### Phase 3 — Optional later
- **Google Form**: family submits amount → auto goes to Sheet (they don't touch the sheet).
- **Notion / Airtable**: only if someone in family already uses it.

---

## Google Sheets setup (recommended)

1. Go to https://sheets.google.com → Blank spreadsheet.
2. Name it: `Mallareddy Hospital — Venkateswara Rao 2026`
3. File → Import → Upload → choose `hospitalbills.csv`
4. Add one tab only visible to family called **DAILY REPORT** with:
   - Total spend (big)
   - Venky / Deepa / Kalyan totals
   - Date-wise table
5. Share → Anyone with link → **Viewer** (family)
6. Share → Venky email → **Editor**

**Why Google Sheets beats Excel here:**
- Works on every phone browser
- No LibreOffice formula/chart problems
- One link in WhatsApp — no install
- You edit on phone; they only look

---

## For family who don't use computers

Send this message once:

> This is our grandfather's hospital bill tracker.
> **Total Spend** = all money we paid at hospital together.
> **Venky / Deepa / Kalyan** = who paid from their pocket that day.
> **Shivaji → Venky** = Papa Shivaji gave cash to Venky to pay bills.
> Every day Venky will send one message — please reply **OK** if correct.

---

## Files in this folder

| File | Use |
|------|-----|
| `hospital-bills.html` | Open in browser — simple view + WhatsApp copy |
| `hospitalbills.csv` | Import to Google Sheets |
| `hospitalbills.xlsx` | Backup for computer (LibreOffice/Excel) |
