# Future Ideas Backlog

> Do NOT implement unless approved.  
> Last updated: 2026-07-03

## UX / Design

| ID | Idea | Value | Effort |
|----|------|-------|--------|
| IDEA-001 | Skeleton shimmer loaders on Home (total, paid cards, care banner) | Smoother perceived load | 3h |
| IDEA-002 | Pull-to-refresh on mobile | Familiar pattern like Blinkit | 3h |
| IDEA-003 | Haptic feedback on save bill success | Delight on mobile | 1h |
| IDEA-004 | Swiggy-orange accent mode toggle | User preference | 4h |
| IDEA-005 | Hospital logo in sticky header | Trust + branding | 2h |
| IDEA-006 | One-tap "Copy UPI settlement amount" per person | Faster Kalyan payments | 2h |
| IDEA-007 | Discharge countdown widget on Home | Reduces "when?" WhatsApp questions | 2h |

## Features

| ID | Idea | Value | Effort |
|----|------|-------|--------|
| IDEA-010 | Bill photo attach (store as base64 or GitHub asset) | Receipt proof for family | 1 day |
| IDEA-011 | Voice input for bill entry (Web Speech API) | Hands-free at hospital | 1 day |
| IDEA-012 | Push notification when bills update (FCM + backend) | Real-time without polling | 3 days |
| IDEA-013 | Multi-language toggle (Telugu / English / both) | Cleaner for mixed family | 4h |
| IDEA-014 | Export PDF receipt-style summary | For records | 1 day |
| IDEA-015 | Bill categories (pharmacy, room, lab, etc.) | Better breakdown | 1 day |

## AI / Automation

| ID | Idea | Value | Effort |
|----|------|-------|--------|
| IDEA-020 | Lazy-load Tesseract only when Care opens | Performance win | 1h |
| IDEA-021 | LLM care Q&A (optional, privacy risk) | Smarter chatbot | 2 days |
| IDEA-022 | Auto-categorize bills from note text | Less manual entry | 4h |
| IDEA-023 | OCR → auto-fill add-bill form from receipt photo | Faster entry | 1 day |
| IDEA-024 | WhatsApp share as formatted image card | Better family group UX | 1 day |

## Analytics / Ops

| ID | Idea | Value | Effort |
|----|------|-------|--------|
| IDEA-030 | Simple visit counter (privacy-safe Plausible) | Know family usage | 2h |
| IDEA-031 | Error logging (Sentry or console relay) | Catch mobile failures | 4h |
| IDEA-032 | Admin audit log (who added what when) | Dispute resolution | 1 day |
| IDEA-033 | Token expiry reminder in app | Security hygiene | 2h |

## Performance

| ID | Idea | Value | Effort |
|----|------|-------|--------|
| IDEA-040 | Partial render (`renderHome` only) | Faster updates | 4h |
| IDEA-041 | SHA-based poll (skip render if unchanged) | Less mobile CPU | 2h |
| IDEA-042 | Self-host fonts with `font-display: swap` | Faster first paint | 2h |
| IDEA-043 | Minify HTML/CSS/JS in CI | Smaller bundle | 4h |

## Architecture (needs approval)

| ID | Idea | Value | Effort |
|----|------|-------|--------|
| IDEA-050 | Serverless GitHub proxy (token never in browser) | Security | 2–3 days |
| IDEA-051 | Firebase Realtime DB sync | Instant family updates | 3–5 days |
| IDEA-052 | Extract `settlement.js` + unit tests | Maintainability | 1 day |
| IDEA-053 | Multi-family SaaS ("Tevs FamilyCare") | Product expansion | 2+ weeks |

## Notifications

| ID | Idea | Value | Effort |
|----|------|-------|--------|
| IDEA-060 | "New bill added" in-app toast for other devices | Awareness | 4h |
| IDEA-061 | Optional SMS via Twilio when total crosses threshold | Alert extended family | 2 days |
