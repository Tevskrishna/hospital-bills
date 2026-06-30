# Combined setup: Hosted page + Telugu + Google Form
## Options 2 + 3 + 4 together — ~20 minutes once

You get:
- **One link** on WhatsApp (hosted page) — family opens in browser, no install
- **Telugu + English** on every screen
- **Google Form** — Deepa / Kalyan add payments themselves → auto goes to Google Sheet → page updates

---

## PART A — Google Sheet + Form (15 min)

### Step 1: Create Google Sheet
1. Open https://sheets.google.com → **Blank spreadsheet**
2. **Extensions** → **Apps Script**
3. Delete any code in `Code.gs`
4. Open file `google-setup/Code.gs` from this folder → **copy all** → paste in Apps Script
5. Click **Save** (disk icon)
6. Run **`setupEverything`** (dropdown at top → Run)
7. Click **Authorize** → choose your Google account → Allow

### Step 2: Deploy Web App (live data for the page)
1. In Apps Script: **Deploy** → **New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. **Deploy** → copy the **Web app URL**

### Step 3: Copy links from README tab
Open your spreadsheet → tab **README**:
- **Form share link** → send to Deepa, Kalyan on WhatsApp
- **Form embed URL** → for the web page
- **Web app URL** → for the web page

### Step 4: Paste into hospital-bills.html
Open `hospital-bills.html` in Notepad. Find `CONFIG` at bottom:

```javascript
const CONFIG = {
  apiUrl: "PASTE_WEB_APP_URL_HERE",
  formEmbedUrl: "PASTE_FORM_URL?embedded=true",
  formShareUrl: "PASTE_FORM_URL_WITHOUT_embedded",
};
```

Save the file.

---

## PART B — Host online (free link) (5 min)

Pick **one** method:

### Method 1: Netlify Drop (easiest — no account needed)
1. Go to https://app.netlify.com/drop
2. Drag **`hospital-bills.html`** onto the page
3. You get a link like `https://random-name.netlify.app/hospital-bills.html`
4. Rename to `index.html` before drop if you want shorter URL

### Method 2: tiiny.host
1. Go to https://tiiny.host
2. Upload `hospital-bills.html` as zip
3. Get short link

### Method 3: GitHub Pages (permanent, free)
1. Create GitHub account → New repository `hospital-bills`
2. Upload `hospital-bills.html` renamed as **`index.html`**
3. Settings → Pages → Source: main branch
4. Link: `https://YOUR_USERNAME.github.io/hospital-bills/`

### Method 4: Google Sites (if you prefer Google only)
1. https://sites.google.com → New site
2. Embed → insert **Embed code** → paste iframe of your Netlify URL
3. Or embed Google Form directly + link to sheet Summary tab

---

## PART C — Daily WhatsApp workflow

### For Venky (you)
1. Open your **hosted link** on phone
2. Tap **Refresh** after family submits form
3. Tap **WhatsApp కు Copy** → paste in family group
4. Optional: screenshot the page

### For Deepa / Kalyan / family
1. Bookmark the **hosted page** OR form link
2. Scroll to **బిల్ చేర్చండి** section → fill form
3. Or open form link directly from WhatsApp
4. Read daily summary Venky sends → reply **OK**

---

## What each piece does

| Piece | Role |
|-------|------|
| `hospital-bills.html` | Beautiful Telugu page + WhatsApp copy |
| Google Apps Script | Sheet + Form + auto-import form → Bills tab |
| Web App URL | Page pulls latest totals from Google |
| Google Form | Family adds payments without touching Excel |
| Hosted link | One URL for everyone — no file sending |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Page shows offline | Paste `apiUrl` in CONFIG and re-upload HTML |
| Form not showing | Paste `formEmbedUrl` in CONFIG |
| Form submit not in sheet | Re-run `setupEverything` or check Form trigger in Apps Script |
| CORS / fetch error | Web app must be deployed as **Anyone** |
| Family can't read Telugu | English subtitles are under every Telugu heading |

---

## Files in this folder

```
hospital-bills.html      ← main page (host this)
google-setup/Code.gs     ← paste into Google Apps Script
hospitalbills.csv        ← backup import
SETUP-COMBINED.md        ← this file
```

After setup, share **one message** on WhatsApp:

> 🏥 Grandfather hospital bills — live tracker  
> 📊 View: YOUR_HOSTED_LINK  
> ➕ Add payment: YOUR_FORM_LINK  
> Every day Venky sends summary — reply OK if correct
