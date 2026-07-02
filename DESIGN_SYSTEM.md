# Design System — FamilyCare

> **Version:** v21 (Blinkit-inspired light theme)  
> **Last updated:** 2026-07-03  
> **Source of truth:** CSS variables in `index.html` `:root`

---

## Design Principles

1. **Mobile first** — hospital corridor, one hand, WhatsApp browser  
2. **Familiar** — patterns from Blinkit, Swiggy, Zomato (order history, bottom nav)  
3. **Calm** — light backgrounds, clear numbers, no blame colors for people  
4. **Bilingual** — Telugu + English together where family expects it  
5. **Accessible contrast** — dark text on white cards (WCAG target AA where possible)  

---

## Colors

### CSS Variables (`:root`)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#f2f3f4` | Page background |
| `--surface` | `#ffffff` | Topbar, bottom nav, modals |
| `--card` | `#ffffff` | Card backgrounds |
| `--card-soft` | `#fafafa` | Nested surfaces, table headers |
| `--card-border` | `#ededed` | Card borders, dividers |
| `--text` | `#282c3f` | Primary text (Swiggy dark) |
| `--muted` | `#686b78` | Secondary labels |
| `--teal` | `#0c831f` | **Primary brand** (Blinkit green) |
| `--teal-dim` | `#0c831f` | Primary buttons |
| `--gold` | `#fc8019` | Accent / Shivaji advance highlight |
| `--rose` | `#e23744` | Settlement balance (soft, not aggressive) |
| `--blue` | `#2563eb` | Kalyan branch accent |
| `--gold-dim` | `rgba(252,128,25,0.12)` | Warning/info tint backgrounds |

### Semantic colors

| Role | Color | Example |
|------|-------|---------|
| Primary CTA | `--teal` | Add bill, Save, Download |
| Success / credit | `#f0fdf4` bg + `--teal` text | Person card "receive" |
| Balance due | `#fff5f5` bg + `--rose` text | Settlement total box |
| Live indicator | `--teal` on `rgba(12,131,31,0.1)` | "● Live" pill |
| WhatsApp | `#22c55e` → `#16a34a` gradient | Share button |

### Person accents (fixed)

| Person | Color | Emoji |
|--------|-------|-------|
| Venky | `#0c831f` | 🙏 |
| Deepa | `#e23744` | 💛 |
| Kalyan | `#2563eb` | 💙 |

---

## Typography

### Font families

| Token | Stack | Usage |
|-------|-------|-------|
| `--font` | Inter, Noto Sans Telugu, system-ui | Body, labels, forms |
| `--display` | Outfit, Noto Sans Telugu, sans-serif | Headings, amounts, buttons |

**Loaded from Google Fonts:** Inter 400–700, Outfit 500–800, Noto Sans Telugu 400–700

### Scale

| Element | Size | Weight |
|---------|------|--------|
| Page title (topbar) | 1rem | 800 |
| Section label | 0.72rem uppercase | 700 |
| Mega total amount | clamp(2rem, 5.5vw, 2.6rem) | 800 |
| Card amount | 0.9–1.35rem | 800 |
| Body | 0.78–0.85rem | 400–600 |
| Caption / muted | 0.62–0.68rem | 500–600 |
| Bottom nav | 0.58rem | 600 |

### Numbers

- Always use `fmt()` → `₹` + `en-IN` locale  
- Amounts use `--display` font family  
- Fair share and totals: bold, primary green or dark text  

---

## Spacing

| Context | Value |
|---------|-------|
| Page horizontal padding | 16px |
| Card padding | 16–20px |
| Card gap (stack) | 12px |
| Section label margin | 16px top, 10px bottom |
| Grid gap (3-col paid) | 10px |
| Bottom nav height | `--nav-h: 64px` + safe area |
| Topbar offset (body) | `88px + safe-area-inset-top` |
| Border radius `--radius` | 16px |
| Pills / chips | 99px (full round) |
| Modal sheet top radius | 24px |

---

## Shadows

| Token | Value |
|-------|-------|
| `--shadow` | `0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)` |
| `--shadow-lg` | `0 8px 28px rgba(0,0,0,0.08)` |
| Primary button | `0 4px 16px rgba(12,131,31,0.25)` |
| FAB (+) | `0 6px 20px rgba(12,131,31,0.35)` |

---

## Buttons

### Primary (`btn-add-home`, `btn-block`, `ab-bill`)

```css
background: var(--teal);
color: #fff;
border-radius: 12px;
font-family: var(--display);
font-weight: 800;
padding: 16–18px;
```

### WhatsApp (`btn-wa-big`)

```css
background: linear-gradient(135deg, #22c55e, #16a34a);
border-radius: 18px;
padding: 18px 20px;
```

### Quick chips (`qa-chip`)

| Variant | Style |
|---------|-------|
| Default | White card, border, shadow |
| Primary (`qa-primary`) | Green fill, white text |

### Bottom nav

| Item | Style |
|------|-------|
| Tab | Icon + label, muted default |
| Active | `--teal` color |
| Center + | 52px green circle, elevated |

### Secondary (`home-link`)

Text only, green, centered — no background.

---

## Cards

### Standard (`.card`)

- White background, `--radius`, `--shadow`, `--card-border`  
- Padding 16px, margin-bottom 12px  

### Mega total (`.mega-total`)

- Left border 4px `--teal`  
- Left-aligned text  
- Large green total number  

### Person card (Share tab)

| State | Border | Background |
|-------|--------|------------|
| `receive` | green tint | `#f0fdf4` |
| `owe` | rose tint | `#fff5f5` |
| `ok` | gray | white |

Top accent bar 4px via `::before`.

### Care banner (`.care-banner`)

- White card, left green border  
- Live tag pill, discharge date right-aligned  

### Order history (Bills tab)

- Day header: `#f0fdf4` green tint  
- Items: avatar + who + note + amount row  

---

## Forms

### Fields (`.fld`)

```css
label: 0.72rem, 600, --muted
input/select: 12px 14px padding, 12px radius, #e2e8f0 border
focus: border --teal, box-shadow ring
```

### Add bill modal (`.add-sheet`)

- Bottom sheet on mobile, max-width 520px  
- White background, 24px top radius  
- Close button: 36px circle, `#f1f5f9`  

### Actions grid

| Button | Color |
|--------|-------|
| Save bill | `--teal-dim` (full width) |
| Shivaji advance | `--rose-dim` |
| Update status | `#6366f1` |

---

## Icons

| Source | Usage |
|--------|-------|
| Emoji | Primary icon system (🏥 🙏 💛 💙 ➕ 📊 💬 🩺) |
| `icons/icon.svg` | PWA / apple-touch-icon |
| Topbar logo | 40px green gradient box + 🏥 |

**No icon font library** — intentional simplicity.

---

## Animations

| Animation | Where | Duration |
|-----------|-------|----------|
| `splashPulse` | Splash logo | 1.5s loop |
| `fadePage` | Tab switch | 0.3s |
| `slideUp` | Modal open | 0.35s |
| `fadeDown` | Legacy hero | 0.8s |
| `.reveal` scroll | Below-fold sections | 0.7s on intersect |

### Rules

- Respect `prefers-reduced-motion` where implemented  
- **Target:** Remove particle canvas animation (dead code)  
- **Target:** No reveal delay on above-fold Home content  
- Tab switch: subtle fade only, no heavy motion  

---

## Mobile Behavior

| Pattern | Implementation |
|---------|----------------|
| Viewport | `width=device-width`, `maximum-scale=1` (zoom locked — a11y debt) |
| Safe areas | `env(safe-area-inset-top/bottom)` on body, nav, modal |
| Bottom nav | Fixed, 5 items, center + elevated |
| Horizontal scroll | Quick chips, `-webkit-overflow-scrolling: touch` |
| Sticky header | Fixed topbar, z-index 120 |
| Toast | Below topbar, top center |
| Modal | Bottom sheet align on mobile |
| Chat panel | Full-width bottom sheet; desktop: floating card |

### Touch targets

- Minimum **44px** for nav and primary buttons  
- Center + button: 52px  

---

## Loading States

### Current (v21)

| Element | Behavior |
|---------|----------|
| Splash | Full screen, fixed 600ms hide after load |
| Status chip | Text "Loading..." until `render()` |
| Grand total | Shows "—" until animated |
| `.reveal` | `opacity: 0` until scroll into view |

### Target (v22 — not yet implemented)

| Element | Target behavior |
|---------|-----------------|
| Splash | Hide when `loadData()` resolves |
| Mega total | Skeleton shimmer bar |
| Paid cards | 3 skeleton boxes |
| Care banner | Skeleton card |
| Bill history | Skeleton rows |

**Skeleton spec (planned):**
```css
background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
background-size: 200% 100%;
animation: shimmer 1.2s infinite;
border-radius: var(--radius);
```

---

## Empty States

| Location | Copy | CTA |
|----------|------|-----|
| Bill history | "No bills yet — tap + to add" | Implicit + button |
| Settlement (balanced) | "✓ అందరూ సమానం" | None |
| Share settlement | "ఎవరికీ ఎవరు డబ్బు ఇవ్వాల్సిన అవసరం లేదు" | None |

Empty states: centered, `--muted` text, inside `.card` when applicable.

---

## Error States

| Scenario | UX |
|----------|-----|
| GitHub save fail | `toast("⚠️ " + error)` or pending localStorage message |
| No token | `toast("📱 Saved on this phone — add token in Bills tab")` |
| OCR fail | Bot message: try brighter photo |
| Load fail | Falls back to localStorage merge silently |
| Wrong GitHub token format | `alert()` on save — **should migrate to toast** |
| Version stale | Red top banner → link to `refresh.html` |

### Tone for errors

- Informative, not alarming  
- Always suggest next step  
- Never blame user  

---

## Print

- Hide: nav, topbar, modals, splash, install banner  
- White background, no shadows  
- See `@media print` in `index.html`  

---

## Do Not Change Without Design Review

- Primary green `#0c831f` (brand)  
- Warm WhatsApp / settlement language  
- Bottom nav 5-tab structure  
- Person emoji mapping (Venky/Deepa/Kalyan)  

---

## Related Docs

- `PRODUCT_VISION.md` — tone and principles  
- `.cursor/rules/ui-ux.mdc` — enforcement rules  
- `ROADMAP.md` v22 — loading state improvements  
