# Add bills from your phone (Venky) — no laptop needed

## Why laptop was needed before
GitHub Pages is **read-only**. The old "Save JSON" only downloaded a file — it never reached the family link.

## Fix: Google cloud (free, 15 min once)
After setup, you tap **➕** on your phone → bill saves → **whole family sees it** when they open the link.

---

## Setup (do once — can use phone browser + Google Sheets app)

### 1. Create Google Sheet
1. Open https://sheets.google.com → **Blank spreadsheet**
2. **Extensions** → **Apps Script**
3. Delete default code → paste all of `google-setup/Code.gs` from this project
4. **Save** → Run **`setupEverything`** → Authorize

### 2. Import current bills (one time)
In Apps Script, run this once from the editor (or use Run → import):
- After setup, open the site on laptop once with browser console, or ask Cursor to run `importAll` with your `bills.json`

**Easier:** In Apps Script, add a temporary function or run `importAllFromJson_` via doPost from browser after deploy.

**Simplest for Venky:** After deploy, open the hospital page → scroll to setup box → we'll push import via Cursor once you give the Web App URL.

### 3. Deploy Web App
1. **Deploy** → **New deployment** → **Web app**
2. Execute as: **Me**
3. Who has access: **Anyone**
4. **Deploy** → copy the URL (ends in `/exec`)

### 4. On your phone
1. Open https://tevskrishna.github.io/hospital-bills/
2. Scroll to **One-time setup** → paste Web App URL → **Save**
3. Tap green **➕** (bottom left) → PIN **7582** → add bill → **✓ Save bill**

You'll see: **✅ Saved! Family can refresh the link.**

---

## Daily use (30 seconds)
1. Open link from WhatsApp
2. Tap **➕** → enter date, who paid, amount
3. Tap **✓ Save bill**
4. Tap **WhatsApp** to share updated totals with family

---

## PIN
Default: **7582** — change in `google-setup/Code.gs` (`SYNC_PIN`) and `index.html` (`CONFIG.syncPin`) together.

---

## Without cloud setup (temporary)
Bills save **on your phone only**. Orange banner appears → tap **Copy new bills** → paste here in Cursor or WhatsApp.

---

## Same family link (never changes)
**https://tevskrishna.github.io/hospital-bills/**
