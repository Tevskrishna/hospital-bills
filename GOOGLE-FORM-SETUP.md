# Google Form setup — 10 minutes (Venky only)

Family gets a **simple 4-question form** on their phone.  
Everyone can **download full history** from the website anytime.

---

## Step 1 — New Google Sheet
1. Open https://sheets.google.com  
2. Click **Blank spreadsheet**

## Step 2 — Apps Script
1. Menu **Extensions** → **Apps Script**  
2. Delete all code in the editor  
3. Open file `google-setup/Code.gs` from your Hospital bills folder  
4. **Select all** → Copy → Paste into Apps Script  
5. Click **Save** (disk icon)

## Step 3 — Run setup
1. Top dropdown: choose **`setupEverything`**  
2. Click **Run** ▶  
3. **Authorize** → your Google account → Allow  
4. Wait ~30 seconds — check your spreadsheet tabs: Bills, Advances, Summary, FullHistory, README

## Step 4 — Deploy Web App
1. In Apps Script: **Deploy** → **New deployment**  
2. Gear icon → type **Web app**  
3. Execute as: **Me**  
4. Who has access: **Anyone**  
5. **Deploy** → copy the **Web app URL**

## Step 5 — Copy links from README tab
Open spreadsheet → tab **README**:

| Copy this | Paste into `index.html` CONFIG as |
|-----------|-----------------------------------|
| Form link (row 3) | `formShareUrl` |
| Form embed (row 4) | `formEmbedUrl` |
| Web App URL (from step 4) | `apiUrl` |

Example in `index.html`:
```javascript
const CONFIG = {
  apiUrl: "https://script.google.com/macros/s/XXXX/exec",
  formEmbedUrl: "https://docs.google.com/forms/d/e/XXXX/viewform?embedded=true",
  formShareUrl: "https://docs.google.com/forms/d/e/XXXX/viewform",
};
```

## Step 6 — Push to GitHub
```powershell
cd "c:\Users\Admin\Desktop\Hospital bills"
git add index.html
git commit -m "Connect Google Form and live sync"
git push
```

Wait 2 minutes. Site updates automatically.

---

## Share with family (WhatsApp)

```
🏥 Hospital bills
View: https://tevskrishna.github.io/hospital-bills/

➕ New payment form:
[PASTE FORM LINK FROM README]

⬇ Download full history: open site → Download button
```

---

## Simple form (4 questions only)

1. **తేదీ / Date**  
2. **ఎవరు / Who** — Venky, Deepa, or Kalyan  
3. **మొత్తం ₹ / Amount**  
4. **How paid** — Cash, UPI, Credit Card, Other  

One payment = one submit. No confusion.

---

## Download full history

**On the website:** tap **⬇ Download full history CSV**  
- All bills from **28-Jun-2026** to today  
- Shivaji advances  
- Totals per person  
- Opens in Excel / Google Sheets  

**From Google (after setup):**  
`YOUR_WEB_APP_URL?format=csv`

**From Google Sheet:** tab **FullHistory** → File → Download → CSV

---

## Rules (no confusion)

| Person | Can do |
|--------|--------|
| Deepa / Kalyan | Add NEW payment via form only |
| Family | View site + download CSV |
| Venky | Fix mistakes in Google Sheet **Bills** tab |

Wrong entry? Venky edits the Sheet — family does not delete rows.

---

## Need help?

Send Venky (or Cursor) your 3 URLs from README — we paste them into GitHub for you.
