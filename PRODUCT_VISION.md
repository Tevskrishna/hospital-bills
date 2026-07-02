# Product Vision — FamilyCare Hospital Bills

> **Product:** FamilyCare (internal name)  
> **Brand footer:** Powered by Tevs  
> **Live URL:** https://tevskrishna.github.io/hospital-bills/  
> **Owner:** Technical Owner  
> **Last updated:** 2026-07-03

---

## Mission

Help one family stay **united, informed, and fair** while caring for a hospitalized parent — by making hospital spending **transparent, equal, and easy to share** on mobile, in Telugu and English, without arguments over money.

---

## Target Users

### Primary

| User | Role | Needs |
|------|------|-------|
| **Venky** (Shivaji's son) | Admin + hospital presence | Add bills from phone, sync for family, share WhatsApp updates, update care status |
| **Deepa** (Rajini's wife) | Contributor + verifier | See totals, confirm fair split, trust the numbers |
| **Kalyan** | Contributor + settler | See what he paid vs fair share, know how to settle respectfully |

### Secondary

| User | Role | Needs |
|------|------|-------|
| Extended family | Observers | One link, clear summary, no app install required |
| Future Tevs clients | Template users | Same product pattern for other families (future) |

### Not target users (today)

- Hospital billing departments  
- Insurance companies  
- Multi-tenant SaaS customers at scale  

---

## Problems Solved

| Problem | How FamilyCare solves it |
|---------|--------------------------|
| "Who paid how much?" scattered in WhatsApp | Single live dashboard with per-person totals |
| Unfair or confusing 3-way split | Automatic 1/3 fair share + settlement math |
| Family fights over amounts | Warm share cards + respectful WhatsApp message |
| Venky needs laptop to update | Mobile bill entry via GitHub sync |
| Care updates lost in chat | Care banner + chatbot for discharge/status |
| New link every deploy | **Same URL forever** for the family |
| Telugu + English family | Bilingual labels, dates, and share text |

---

## Core Principles

1. **One link forever** — family bookmark never changes  
2. **Mobile first** — hospital corridor usage, one-thumb flows  
3. **Numbers don't lie** — show paid, fair share, and adjustment separately  
4. **Respect over blame** — language matters; no "owes" or "MUST PAY"  
5. **Simple beats clever** — no login for viewers, no app store required  
6. **Venky admin, family read** — one writer, many readers  
7. **Offline tolerant** — pending bills saved locally until sync works  
8. **Honest limitations** — not medical advice; OCR may be wrong  

---

## Non-Goals

| Non-goal | Reason |
|----------|--------|
| Full hospital EMR / billing system | Out of scope; family tracker only |
| Private/encrypted financial data | Chosen architecture is public JSON on GitHub Pages |
| Real-time sub-second sync | GitHub Pages deploy latency accepted (~30–90s) |
| Multi-family SaaS (v1) | Single patient, single family hardcoded |
| Medical diagnosis AI | Care chatbot is informational only |
| Payment processing / UPI integration | Family settles outside the app |
| User accounts & roles | Token-on-device is the only "admin" gate |
| Native iOS/Android apps | PWA + browser is sufficient for now |

---

## Success Metrics

### Family health (primary)

| Metric | Target | How to measure |
|--------|--------|----------------|
| Family agrees on numbers | 100% OK replies in WhatsApp | Qualitative — Venky reports |
| Bill entry latency | < 30 seconds from hospital | Time to tap Save |
| Family sees updates | < 2 minutes after Venky saves | Manual check |
| Zero amount disputes | 0 fights attributed to wrong math | Family feedback |
| Link retention | Same URL used by all 3 branches | No confusion about "new link" |

### Product quality (secondary)

| Metric | Current | Target (3 mo) |
|--------|---------|----------------|
| Health score (overall) | 4.2/10 | 7/10 |
| UX score | 7/10 | 9/10 |
| Security score | 3/10 | 6/10 |
| Testing score | 1/10 | 6/10 |
| Mobile load feel | "Sometimes slow" | Skeleton + < 3s interactive |

### Usage (if analytics added later)

| Metric | Notes |
|--------|-------|
| Weekly active family members | ≥ 3 during hospital stay |
| Bills added per week | Tracks engagement |
| WhatsApp share copies | Share button usage |

---

## Product Identity

- **Name:** FamilyCare  
- **Tagline (internal):** మూడు కుమారుల సేవ · Three sons united  
- **Visual language:** Blinkit/Swiggy-inspired light consumer app (v20+)  
- **Tone:** Warm, family-safe Telugu + clear English numbers  

---

## Relationship to Other Docs

| Doc | Purpose |
|-----|---------|
| `ROADMAP.md` | When we build what |
| `PROJECT_CONTEXT.md` | How the code works today |
| `DESIGN_SYSTEM.md` | Visual and interaction standards |
| `KNOWN_LIMITATIONS.md` | Accepted trade-offs |
