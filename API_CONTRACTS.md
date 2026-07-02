# API Contracts — FamilyCare

> **Last updated:** 2026-07-03  
> **Base URL (read):** `https://tevskrishna.github.io/hospital-bills/`  
> **Write:** GitHub Contents API (primary) or Google Apps Script (optional)

---

## Overview

| API | Auth | Used by |
|-----|------|---------|
| Static JSON | None | All users (read) |
| `version.json` | None | All users (update check) |
| GitHub Contents API | Bearer PAT | Venky phone (write) |
| Google Apps Script | PIN `0000` | Optional legacy path |

---

## 1. Static JSON — Read bills

### Request

```http
GET /data/bills.json?v=1719999999999
Cache-Control: no-cache (client-side timestamp bust)
```

### Response `200 OK`

```json
{
  "patient": "Sri Venkateswara Rao",
  "hospital": "Mallareddy Hospital",
  "startDate": "2026-06-28",
  "sons": [
    {
      "name": "Shivaji",
      "payer": "Venky",
      "label": "శివాజీ కుమారుడు · Venky",
      "color": "#2a9d8f"
    }
  ],
  "bills": [
    {
      "d": "2026-07-02",
      "who": "Venky",
      "amt": 3300,
      "mode": "UPI",
      "note": "pharmacy"
    }
  ],
  "advances": [
    { "d": "2026-06-28", "amt": 3009 }
  ],
  "careStatus": {
    "ward": "General Ward",
    "condition": "Stable, under observation",
    "conditionTe": "స్థిరంగా ఉన్నారు, పర్యవేక్షణలో",
    "expectedDischarge": "2026-07-03",
    "dischargeNote": "Doctor will confirm after reports",
    "dischargeNoteTe": "రిపోర్ట్స్ వచ్చాక డాక్టర్ నిర్ణయిస్తారు",
    "lastUpdate": "2026-07-02",
    "lastUpdateBy": "Venky"
  }
}
```

### Bill object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `d` | string | yes | ISO date `YYYY-MM-DD` |
| `who` | string | yes | `Venky` \| `Deepa` \| `Kalyan` |
| `amt` | number | yes | Amount in INR |
| `mode` | string | no | `Cash`, `UPI`, `Credit Card`, or `""` |
| `note` | string | no | Free text description |

### Advance object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `d` | string | yes | ISO date |
| `amt` | number | yes | Shivaji → Venky advance amount |

### Client usage

```javascript
const res = await fetch("data/bills.json?v=" + Date.now());
const json = await res.json();
applyJson(json);
```

---

## 2. Version check

### Request

```http
GET /version.json?t=1719999999999
```

### Response `200 OK`

```json
{
  "build": "2026-07-03-v21",
  "label": "v21"
}
```

### Client behavior

If `v.build !== PAGE_VERSION` → show red update banner linking to `refresh.html`.

---

## 3. GitHub Contents API — Write bills

### 3a. Get current file (for SHA)

```http
GET https://api.github.com/repos/Tevskrishna/hospital-bills/contents/data/bills.json
Authorization: Bearer github_pat_xxxx
Accept: application/vnd.github+json
X-GitHub-Api-Version: 2022-11-28
```

### Response `200 OK` (excerpt)

```json
{
  "name": "bills.json",
  "path": "data/bills.json",
  "sha": "abc123...",
  "content": "base64...",
  "encoding": "base64"
}
```

### 3b. Put updated file

```http
PUT https://api.github.com/repos/Tevskrishna/hospital-bills/contents/data/bills.json
Authorization: Bearer github_pat_xxxx
Content-Type: application/json
```

### Request body

```json
{
  "message": "Mobile bill update 2026-07-03T14:30",
  "content": "<base64-encoded JSON string>",
  "sha": "abc123..."
}
```

### `content` encoding

Client uses `jsonToBase64(JSON.stringify(buildPayload(), null, 2))`.

### `buildPayload()` shape

Same as static JSON response (section 1).

### Response `200 OK`

```json
{
  "content": { "sha": "newsha..." },
  "commit": { "sha": "commitsha..." }
}
```

### Error responses

| Status | Meaning |
|--------|---------|
| 401 | Invalid or expired token |
| 404 | File not found (first upload omits `sha`) |
| 409 | SHA mismatch — concurrent edit |

### Client wrapper

```javascript
const result = await saveToGitHub();
// { ok: true } | { ok: false, error: "...", offline?: true }
```

---

## 4. Google Apps Script — Optional

**Base URL:** User-configured Web App URL stored in `localStorage.hb_apiUrl`

### 4a. GET — Export JSON

```http
GET {apiUrl}?t=1719999999999
```

### Response `200 OK`

```json
{
  "updated": "2026-07-03T10:00:00.000Z",
  "patient": "Sri Venkateswara Rao",
  "hospital": "Mallareddy Hospital",
  "startDate": "2026-06-28",
  "bills": [ /* same as static */ ],
  "advances": [ /* same as static */ ],
  "careStatus": { /* same as static */ }
}
```

### 4b. GET — Export CSV

```http
GET {apiUrl}?format=csv
```

### Response `200 OK`

```text
Mallareddy Hospital — Venkateswara Rao — Full history from 2026-06-28
Generated,2026-07-03 10:00

Date,Type,Paid By,Amount,Payment Mode / Notes
2026-07-02,Hospital bill,Venky,3300,UPI — pharmacy
...
```

### 4c. POST — Generic envelope

```http
POST {apiUrl}
Content-Type: text/plain
```

```json
{
  "action": "<actionName>",
  "pin": "0000",
  ...
}
```

### Response (all POST actions)

```json
{ "ok": true }
```

```json
{ "ok": false, "error": "Wrong PIN" }
```

---

### 4d. POST — `addBill`

```json
{
  "action": "addBill",
  "pin": "0000",
  "bill": {
    "d": "2026-07-03",
    "who": "Deepa",
    "amt": 500,
    "mode": "UPI",
    "note": "pharmacy"
  }
}
```

---

### 4e. POST — `addAdvance`

```json
{
  "action": "addAdvance",
  "pin": "0000",
  "advance": {
    "d": "2026-07-03",
    "amt": 1000
  }
}
```

---

### 4f. POST — `updateCareStatus`

```json
{
  "action": "updateCareStatus",
  "pin": "0000",
  "careStatus": {
    "ward": "General Ward",
    "condition": "Stable",
    "conditionTe": "స్థిరంగా",
    "expectedDischarge": "2026-07-05",
    "dischargeNote": "Doctor confirmed",
    "dischargeNoteTe": "డాక్టర్ నిర్ణయించారు",
    "lastUpdate": "2026-07-03",
    "lastUpdateBy": "Venky"
  }
}
```

---

### 4g. POST — `importAll`

Replaces entire sheet data from client state.

```json
{
  "action": "importAll",
  "pin": "0000",
  "bills": [ /* array */ ],
  "advances": [ /* array */ ],
  "careStatus": { /* object */ }
}
```

### Client wrapper

```javascript
await cloudPost("importAll", {
  bills: data.bills,
  advances: data.advances,
  careStatus
});
```

---

## 5. External CDN

### Tesseract.js

```html
<script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
```

```javascript
const { data: { text } } = await Tesseract.recognize(file, "eng+tel");
```

No request/response contract — client-side only.

---

## 6. localStorage (client-only)

Not HTTP APIs but part of data contract:

| Key | Shape |
|-----|-------|
| `hb_github_token` | string `github_pat_*` or `ghp_*` |
| `hb_apiUrl` | string URL |
| `hospitalBillsLocal` | `{ pendingBills?: Bill[], pendingAdvances?: Advance[], careStatus?: object }` |

---

## Polling behavior

```javascript
setInterval(() => loadData(true), 60000);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") loadData(true);
});
```

Silent reload compares JSON snapshot before calling `render()`.

---

## Error handling summary

| Layer | On failure |
|-------|------------|
| `loadData` | Fall through to localStorage merge |
| `saveToGitHub` | Return `{ ok: false, error }`, save pending locally |
| `cloudPost` | Return `{ ok: false, error }` |
| Network offline | Pending bills in `hospitalBillsLocal` |

---

## Related docs

- `PROJECT_CONTEXT.md` — schema and business rules  
- `ARCHITECTURE_DECISIONS.md` — why GitHub JSON + PAT  
- `google-setup/Code.gs` — server implementation  
