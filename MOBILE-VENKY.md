# Add bills from phone — 2 minutes (Venky)

## Same link always
**https://tevskrishna.github.io/hospital-bills/**

---

## Setup (once, on your phone)

### Step 1 — GitHub token
1. Open: https://github.com/settings/personal-access-tokens/new
2. **Token name:** Hospital Bills  
3. **Expiration:** 90 days  
4. **Repository access:** Only **hospital-bills**  
5. **Permissions → Repository → Contents:** Read and write  
6. **Generate token** → copy it (you only see it once)

### Step 2 — Save on the hospital page
1. Open https://tevskrishna.github.io/hospital-bills/ on your phone  
2. Scroll to **2-minute phone setup**  
3. Paste token → **Save token**  
4. Green banner appears: **Mobile sync ON**

---

## Daily use (30 seconds)
1. Tap **➕** (bottom left)  
2. PIN: **7582**  
3. Date, who paid, amount → **✓ Save bill**  
4. Family refreshes the same link in ~1 minute  

---

## PIN
Default **7582** — change in `index.html` → `CONFIG.syncPin`

## Token safety
Token stays **only on your phone** (not in GitHub code). Never share it on WhatsApp.

---

## Alternative: Google Sheet
See `google-setup/Code.gs` and paste Web App URL under "Alternative" on the setup box.
