# Venky — Daily routine (5–10 minutes)

## YES — publish to family now!

Share this link on WhatsApp:

**https://tevskrishna.github.io/hospital-bills/**

---

## Every day (your workflow)

1. **Check hospital group** — note new payments from screenshots
2. **Open the site** on your phone → tap **"Venky: Add today's bills"**
3. Fill: Date, Who paid, Amount, Cash/UPI/Card
4. Tap **"+ Add bill"** for each payment
5. Tap **"Save & Download JSON"** → saves `bills.json`
6. **Push to GitHub** (see below) OR send file to Cursor to push
7. Tap **WhatsApp** button → paste summary in family group
8. Family replies **OK** if their amount is correct

---

## Push updated data to GitHub (2 ways)

### Way A — Tell Cursor
> "I added new bills, please push bills.json to GitHub"

### Way B — Yourself
1. Replace `data/bills.json` in your Hospital bills folder with downloaded file
2. Run in PowerShell:
```powershell
cd "c:\Users\Admin\Desktop\Hospital bills"
git add data/bills.json
git commit -m "Update hospital bills"
git push
```
3. Family sees update in ~2 minutes

---

## WhatsApp message (daily)

```
🏥 Mallareddy Hospital — Venkateswara Rao garu
Updated: [today's date]

📊 https://tevskrishna.github.io/hospital-bills/

Please check YOUR amount and reply OK
```

Or use the **WhatsApp** button on the site.

---

## Family rules (send once)

- This page shows all hospital payments from screenshots
- Check your name and amount
- Reply **OK** if correct
- If something missing → tell Venky on WhatsApp
- Do not edit the page yourself

---

## You do NOT need

- Google Form (optional later)
- Excel / LibreOffice
- App install

Just: **add bills → push → WhatsApp → family confirms**
