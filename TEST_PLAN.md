# FamilyCare Hospital Bills PWA — Manual Test Plan (v23)

**Build:** `2026-07-03-v23` (`PAGE_VERSION` / `version.json`)  
**URL:** https://tevskrishna.github.io/hospital-bills/  
**Scope:** Verify existing behavior only — no business-logic changes.  
**Preconditions (unless noted):** Fresh load of live URL or local `index.html`; `data/bills.json` available; device clock set correctly.

---

## Desktop (15)

### TC-001: Initial Home load on Chrome desktop
**Priority:** P0  
**Steps:**
1. Open https://tevskrishna.github.io/hospital-bills/ in Chrome on a desktop (≥1280px wide).
2. Wait for splash/loading to finish.
3. Observe Home tab content without interacting.
**Expected:** Home tab is active; patient name (Sri Venkateswara Rao), hospital (Mallareddy Hospital), grand total, fair 1/3 share, bill count, care banner, and three son contribution cards render with INR formatting. Footer shows build label including `v23`.

### TC-002: Bottom navigation tab switching
**Priority:** P0  
**Steps:**
1. From Home, click **Bills**.
2. Click **Share**.
3. Click **Home**.
4. Click **Care** (🩺).
**Expected:** Each tab shows its page or panel; only one main view is visible at a time; active nav item is highlighted; Care opens the chat assistant overlay.

### TC-003: Center “+” opens Add Bill modal
**Priority:** P0  
**Steps:**
1. On any tab, click the center **+** button in bottom nav.
2. Inspect modal fields.
**Expected:** Add Bill modal opens with date, payer (Venky/Deepa/Kalyan), amount, optional mode/note, and Save/Cancel actions. Background is dimmed.

### TC-004: Add Bill — valid entry (local only, no token)
**Priority:** P1  
**Steps:**
1. Open Add Bill modal.
2. Set today’s date, payer **Deepa**, amount **100**, note `Desktop test`.
3. Tap **Save bill**.
4. Return to Home and Bills tabs.
**Expected:** Modal closes; new bill appears in Bills history (newest first); Home totals and Deepa paid amount increase by ₹100. If no GitHub token, bill is stored in `localStorage` pending sync (no cloud PUT).

### TC-005: Add Bill — validation for empty amount
**Priority:** P1  
**Steps:**
1. Open Add Bill modal.
2. Leave amount empty or zero.
3. Attempt to save.
**Expected:** Bill is not saved; user receives inline feedback (alert or validation) and modal stays open.

### TC-006: Quick action chips on Home
**Priority:** P1  
**Steps:**
1. On Home, locate horizontal quick-action chips.
2. Tap **📊 All bills**.
3. Navigate back to Home; tap **💬 Share**.
4. Navigate back to Home; tap **🩺 Care**.
**Expected:** Chips navigate to Bills, Share, and Care assistant respectively without page reload.

### TC-007: Bills tab — family hub and split cards
**Priority:** P0  
**Steps:**
1. Open **Bills** tab.
2. Scroll through family hub, son cards, fair-share split cards, Shivaji advances card, and bill history.
**Expected:** Father node shows patient + hospital; each son pill shows payer and amount paid; fair share = total ÷ 3 on split cards; Shivaji→Venky advances shown separately from 3-way split; bill list is order-style newest first with date, payer, amount.

### TC-008: Bills tab — CSV download
**Priority:** P1  
**Steps:**
1. On Bills tab, find CSV export/download control.
2. Click download.
3. Open downloaded file.
**Expected:** CSV downloads with bill rows matching on-screen history (dates, who, amounts).

### TC-009: Share tab — person cards and settlement hero
**Priority:** P0  
**Steps:**
1. Open **Share** tab.
2. Review person cards for Venky, Deepa, Kalyan.
3. Review settlement hero section.
**Expected:** Each card shows paid amount and badge (Balance / Credit / SETTLED ✓) with Telugu subtitle; settlement section shows “Fair adjustment · సమన్యయం” when Kalyan owes, or all-settled message when balanced; note clarifies Venky never pays Deepa and Shivaji advances are separate.

### TC-010: Care banner and health timeline on Home
**Priority:** P1  
**Steps:**
1. On Home, read care status banner.
2. Scroll to health timeline section.
**Expected:** Banner shows live tag, condition (EN + TE), ward, hospital, last update by; timeline lists ward, condition, expected discharge, and last update when present in `careStatus`.

### TC-011: Sticky topbar patient context
**Priority:** P2  
**Steps:**
1. On Home, note topbar text.
2. Scroll down several screens.
3. Switch to Bills and Share.
**Expected:** Sticky topbar remains visible with patient name and hospital · ward subtitle on all main tabs.

### TC-012: URL deep link `?tab=share`
**Priority:** P1  
**Steps:**
1. Open https://tevskrishna.github.io/hospital-bills/?tab=share in a new tab.
**Expected:** App loads directly on Share tab with share content rendered.

### TC-013: Version mismatch banner
**Priority:** P2  
**Steps:**
1. With browser devtools, throttle or mock `version.json` to return a build newer than cached `PAGE_VERSION` (or use stale SW cache if reproducible).
2. Reload app.
**Expected:** Update banner appears with link to `refresh.html`; app remains usable.

### TC-014: Keyboard — Escape closes modals
**Priority:** P2  
**Steps:**
1. Open Add Bill modal.
2. Press **Escape** (if supported) or click outside overlay.
3. Open Care chat; click overlay or ✕.
**Expected:** Modals/panels close without saving; underlying tab state preserved.

### TC-015: Print layout hides chrome
**Priority:** P2  
**Steps:**
1. Open Share or Home.
2. Open browser Print Preview (Ctrl+P).
**Expected:** Bottom nav, chat FAB, and non-print elements (`no-print`) are hidden; readable content remains for sharing/printing.

---

## Android (15)

### TC-016: Chrome Android — first load and install prompt
**Priority:** P0  
**Steps:**
1. Open live URL in Chrome on Android phone.
2. Wait for full load.
3. Check for PWA install affordance (menu → Install app / Add to Home screen).
**Expected:** App loads mobile layout; bottom nav respects safe area; install option available per Chrome PWA criteria.

### TC-017: Android — bottom nav thumb reach
**Priority:** P0  
**Steps:**
1. Hold phone one-handed.
2. Tap each bottom nav item including center **+**.
**Expected:** All nav targets are ≥44px touch targets; no mis-taps between adjacent tabs.

### TC-018: Android — Home scroll and grand total animation
**Priority:** P1  
**Steps:**
1. On Home, observe grand total on load.
2. Add a bill (or pull fresh data) and return to Home.
**Expected:** Total animates/counts up; today spend and fair share update; no horizontal overflow on 360px width.

### TC-019: Android — Add Bill from center +
**Priority:** P0  
**Steps:**
1. Tap **+** in bottom nav.
2. Fill payer **Kalyan**, amount **250**, save.
**Expected:** Modal fits screen; keyboard does not obscure Save; bill saves and UI refreshes.

### TC-020: Android — Bills history scroll performance
**Priority:** P1  
**Steps:**
1. Open Bills tab with full history.
2. Fling-scroll through entire list.
**Expected:** Smooth scroll; rows show date, payer chip/color, amount; sticky sections do not jump erratically.

### TC-021: Android — Share tab WhatsApp copy button
**Priority:** P0  
**Steps:**
1. Open Share tab.
2. Tap copy/share control for WhatsApp text.
3. Paste into WhatsApp (or Notes).
**Expected:** Clipboard receives warm Telugu/English family message with totals and settlement lines; no “owes” or “MUST PAY” wording.

### TC-022: Android — Care tab opens full-screen chat
**Priority:** P1  
**Steps:**
1. Tap **Care** in bottom nav (or FAB).
2. Type a question; send.
**Expected:** Chat panel slides open over content; overlay dims background; messages scroll; close returns to prior tab.

### TC-023: Android — Care quick chips
**Priority:** P1  
**Steps:**
1. Open Care assistant.
2. Tap chip **ఎప్పుడు డిశ్చార్జ్?**
3. Tap **Who paid how much?**
**Expected:** Bot replies with discharge info and payer breakdown respectively; responses match Home/Bills numbers.

### TC-024: Android — rotate portrait ↔ landscape
**Priority:** P2  
**Steps:**
1. On Home, rotate device to landscape and back.
2. Open Add Bill modal and rotate again.
**Expected:** Layout reflows without clipped nav; modal remains usable; no duplicate modals.

### TC-025: Android — Chrome “Add to Home screen” launch
**Priority:** P1  
**Steps:**
1. Install PWA to home screen.
2. Launch from icon (not browser tab).
**Expected:** Opens standalone/fullscreen-ish without browser URL bar; same v23 build loads from start URL.

### TC-026: Android — back gesture behavior
**Priority:** P1  
**Steps:**
1. Open Care chat.
2. System back gesture/button.
3. Open Add Bill modal; system back again.
**Expected:** Back closes chat/modal first; does not exit app until main view has no overlay open.

### TC-027: Android — token setup UI on Bills
**Priority:** P1  
**Steps:**
1. On Bills, locate GitHub token / sync setup section.
2. Enter an invalid token format; save.
3. Clear and leave empty; save.
**Expected:** UI persists token in localStorage when saved; invalid token shows error on sync attempt; empty clears cloud write path.

### TC-028: Android — pending bills badge after offline add
**Priority:** P1  
**Steps:**
1. Enable airplane mode.
2. Add bill ₹50 Venky.
3. Disable airplane mode with valid token configured.
**Expected:** Bill visible immediately offline; after reconnect, `flushPendingToCloud` syncs or status indicates pending/synced per app rules.

### TC-029: Android — pull-to-refresh not breaking SPA
**Priority:** P2  
**Steps:**
1. On Home, pull down browser refresh gesture (if enabled).
**Expected:** Page reloads cleanly; data re-fetched; no stuck splash.

### TC-030: Android — soft keyboard on chat input
**Priority:** P2  
**Steps:**
1. Open Care; focus chat input.
2. Type Telugu + English mix; send.
**Expected:** Input visible above keyboard; send works; user message appears right-aligned.

---

## iPhone / iOS Safari (15)

### TC-031: iOS Safari — initial load safe areas
**Priority:** P0  
**Steps:**
1. Open live URL in Safari on iPhone (notch device).
2. Observe bottom nav and top content.
**Expected:** Bottom nav clears home indicator (`safe-area-inset-bottom`); no content hidden under notch; v23 loads.

### TC-032: iOS — tab bar fixed on scroll
**Priority:** P0  
**Steps:**
1. On Home, scroll to footer.
2. Tap **Bills** without scrolling to top first.
**Expected:** Bottom nav stays fixed; tab switch works from any scroll position.

### TC-033: iOS — Add to Home Screen
**Priority:** P1  
**Steps:**
1. Safari Share → **Add to Home Screen**.
2. Launch from icon.
**Expected:** Standalone launch with manifest icon; opens to Home; status bar styled per `manifest.json`.

### TC-034: iOS — date input in Add Bill
**Priority:** P1  
**Steps:**
1. Open Add Bill modal.
2. Tap date field.
**Expected:** iOS date picker appears; selected date reflected in field; saves correctly.

### TC-035: iOS — Share tab copy to clipboard
**Priority:** P0  
**Steps:**
1. Share tab → copy WhatsApp text.
2. Paste in iMessage or Notes.
**Expected:** iOS clipboard permission prompt if needed; full message pasted; settlement math matches on-screen Share tab.

### TC-036: iOS — Care overlay scroll
**Priority:** P1  
**Steps:**
1. Open Care; send several messages / use chips.
2. Scroll chat history.
**Expected:** Chat scrolls inside panel; body behind overlay does not scroll (scroll lock).

### TC-037: iOS — camera upload for OCR
**Priority:** P1  
**Steps:**
1. Care tab → tap camera/upload.
2. Choose **Take Photo** or **Photo Library** with a prescription image.
**Expected:** iOS picker opens; after selection, OCR progress shows; bot returns summary or friendly failure if unreadable.

### TC-038: iOS — 100vh / address bar resize
**Priority:** P2  
**Steps:**
1. Scroll down to collapse Safari toolbar.
2. Open Care panel full height.
**Expected:** Chat panel not clipped; close button reachable; no permanent gap under nav.

### TC-039: iOS — private browsing localStorage
**Priority:** P2  
**Steps:**
1. Open URL in Private tab.
2. Add bill without token.
3. Close tab; reopen private tab.
**Expected:** Behavior matches Safari private mode limits; app does not crash; user informed if persistence blocked.

### TC-040: iOS — link to refresh.html from update banner
**Priority:** P2  
**Steps:**
1. If update banner visible, tap refresh link.
2. Complete refresh flow.
**Expected:** `refresh.html` clears SW/cache and redirects to latest app build.

### TC-041: iOS — landscape on iPhone
**Priority:** P2  
**Steps:**
1. Rotate to landscape on Home and Share.
**Expected:** Readable layout; horizontal scroll chips still swipeable; no overlapping nav.

### TC-042: iOS — double-tap zoom not breaking buttons
**Priority:** P2  
**Steps:**
1. Double-tap near nav buttons (if zoom occurs).
2. Tap **Share** once.
**Expected:** Single intentional tap registers; nav remains usable (viewport meta prevents excessive zoom on inputs).

### TC-043: iOS — VoiceOver focus order on Home
**Priority:** P2  
**Steps:**
1. Enable VoiceOver.
2. Swipe through topbar, totals, chips, bottom nav.
**Expected:** Logical focus order; tabs announced; center + has accessible label.

### TC-044: iOS — returning from background
**Priority:** P1  
**Steps:**
1. Load app; note totals.
2. Background Safari 2+ minutes; foreground.
3. Wait up to 60s.
**Expected:** `visibilitychange` triggers data poll; totals refresh if `bills.json` changed on server.

### TC-045: iOS — `?tab=share` in standalone PWA
**Priority:** P2  
**Steps:**
1. Open installed PWA via link with `?tab=share` (e.g., from WhatsApp).
**Expected:** Lands on Share tab inside standalone shell.

---

## Tablet (8)

### TC-046: iPad Safari — layout at 768px
**Priority:** P1  
**Steps:**
1. Open app on iPad (or responsive 768×1024).
2. Review Home grid/cards.
**Expected:** Cards use available width without excessive single-column stretch; bottom nav centered/max-width per design.

### TC-047: Android tablet — split view not supported gracefully
**Priority:** P2  
**Steps:**
1. Open in Samsung split-screen with another app at 50% width.
**Expected:** App remains functional; nav and modals usable at reduced width.

### TC-048: Tablet — Bills + Share data consistency
**Priority:** P0  
**Steps:**
1. Note Venky/Deepa/Kalyan paid on Bills.
2. Switch to Share.
**Expected:** Paid amounts and fair share identical across tabs (same `render()` data).

### TC-049: Tablet — horizontal quick chips scroll
**Priority:** P2  
**Steps:**
1. On Home, swipe quick-action chip row horizontally.
**Expected:** Chips scroll smoothly; no vertical page scroll hijack.

### TC-050: Tablet — Care panel width
**Priority:** P1  
**Steps:**
1. Open Care on 10" tablet.
2. Upload image for OCR.
**Expected:** Chat panel max-width readable; not full ultra-wide strip; OCR progress visible.

### TC-051: Tablet — pointer hover states (if mouse)
**Priority:** P2  
**Steps:**
1. On iPad with trackpad or Android tablet with mouse, hover nav and cards.
**Expected:** `pressable`/hover styles appear where defined; clicks still work.

### TC-052: Tablet — print from Share
**Priority:** P2  
**Steps:**
1. Share tab → system print.
**Expected:** Person cards and settlement print legibly in portrait/landscape preview.

### TC-053: Tablet — rotation mid-modal
**Priority:** P2  
**Steps:**
1. Open Add Bill on tablet landscape.
2. Rotate to portrait before save.
**Expected:** Modal re-centers; entered values preserved.

---

## Offline / PWA (12)

### TC-054: Service worker registers on load
**Priority:** P1  
**Steps:**
1. Load app online.
2. DevTools → Application → Service Workers (or `chrome://serviceworker-internals`).
**Expected:** `sw.js` registers for scope; self-destruct SW behavior documented in project does not block first load.

### TC-055: Offline — read cached shell
**Priority:** P0  
**Steps:**
1. Load app online once.
2. Go offline.
3. Reload installed PWA or tab.
**Expected:** App shell loads offline; last fetched `bills.json` data shown or empty state with friendly message if never cached.

### TC-056: Offline — add bill queues locally
**Priority:** P0  
**Steps:**
1. Offline with no network.
2. Add bill ₹75 Kalyan.
3. Inspect UI / localStorage (`hospitalBillsLocal`).
**Expected:** Bill appears in UI; pending local queue stored; no GitHub PUT attempted.

### TC-057: Online — flush pending queue
**Priority:** P0  
**Steps:**
1. After TC-056, go online with valid GitHub token on device.
2. Wait for auto flush or trigger sync if UI provides it.
**Expected:** `flushPendingToCloud` pushes queued bills; pending cleared on success; family sees update after Pages deploy delay (~30–90s).

### TC-058: manifest.json — installability fields
**Priority:** P1  
**Steps:**
1. Fetch `/manifest.json`.
2. Verify `name`, `short_name`, `start_url`, `display`, icons.
**Expected:** Fields present; `start_url` points to app root; icon path resolves.

### TC-059: refresh.html cache bust
**Priority:** P1  
**Steps:**
1. Visit https://tevskrishna.github.io/hospital-bills/refresh.html
2. Allow redirect.
**Expected:** SW unregistered/caches cleared; lands on latest `index.html` with current `?b=` bust param.

### TC-060: Offline — Care chat without network
**Priority:** P1  
**Steps:**
1. Offline after initial load.
2. Open Care; ask **How much spent so far?**
**Expected:** Rule-based answers work from local `data`; no network required for chat logic.

### TC-061: Offline — OCR fails gracefully
**Priority:** P1  
**Steps:**
1. Offline.
2. Attempt prescription upload in Care.
**Expected:** Tesseract CDN load fails; user sees friendly error, not blank screen or uncaught exception.

### TC-062: PWA — launch without prior session
**Priority:** P2  
**Steps:**
1. Install PWA; clear site data.
2. Launch offline immediately (never loaded online).
**Expected:** Graceful degradation — shell may load but data fetch fails with empty/loading state, not crash.

### TC-063: Online — 60s poll interval
**Priority:** P2  
**Steps:**
1. Keep app open on Home.
2. On another device, update `bills.json` on GitHub (deploy).
3. Wait up to 60 seconds without switching tabs.
**Expected:** App picks up new totals automatically via `loadData` poll.

### TC-064: visibilitychange refresh
**Priority:** P1  
**Steps:**
1. Background tab 1 minute.
2. Foreground tab.
**Expected:** Silent `loadData` runs; UI updates if remote JSON newer.

### TC-065: localStorage survives normal reload
**Priority:** P1  
**Steps:**
1. Save GitHub token (test token) in setup.
2. Reload page.
**Expected:** Token restored from `hb_github_token`; setup field populated.

---

## Slow network (8)

### TC-066: Slow 3G — Home skeleton/shimmer
**Priority:** P1  
**Steps:**
1. DevTools throttle Slow 3G.
2. Hard reload Home.
**Expected:** Skeleton/shimmer on critical fields (grand total, paid, care banner) until `loadData` completes; no permanent blank state.

### TC-067: Slow 3G — splash tied to loadData
**Priority:** P1  
**Steps:**
1. Throttle network; reload.
2. Observe splash duration.
**Expected:** Splash dismisses when data load finishes, not fixed arbitrary long timeout only.

### TC-068: Slow network — bills.json cache bust
**Priority:** P2  
**Steps:**
1. Slow network reload.
2. Monitor network for `./data/bills.json?v=...`
**Expected:** Request includes timestamp query param; returns 200 with JSON body.

### TC-069: Slow network — Add Bill save responsiveness
**Priority:** P1  
**Steps:**
1. Slow 3G online.
2. Add bill and save.
**Expected:** UI updates optimistically/local immediately; cloud sync may lag but user is not blocked on PUT for closing modal.

### TC-070: Slow network — Share tab usable before images/fonts complete
**Priority:** P2  
**Steps:**
1. Throttle; open Share tab early during load.
**Expected:** Text totals and person cards render; no layout thrash blocking copy button.

### TC-071: Slow network — Tesseract load timeout UX
**Priority:** P2  
**Steps:**
1. Throttle; open Care; upload prescription.
**Expected:** OCR progress indicator shows during load; failure message if CDN exceeds reasonable wait.

### TC-072: Slow network — version.json check non-blocking
**Priority:** P2  
**Steps:**
1. Throttle; reload.
**Expected:** App usable while `version.json` fetch pending; banner appears later if mismatch detected.

### TC-073: Intermittent network — pending retry
**Priority:** P1  
**Steps:**
1. Add bill online; disconnect during PUT (devtools offline mid-request).
2. Reconnect.
**Expected:** Pending bills remain; retry on reconnect/`FC_SYNC` message without duplicate rows in UI.

---

## GitHub sync (8)

### TC-074: Save valid GitHub PAT
**Priority:** P0  
**Steps:**
1. On Bills setup, paste valid `github_pat` with repo contents scope.
2. Save token.
**Expected:** Token stored in `localStorage.hb_github_token`; `CONFIG.githubToken` set; sync enabled indicator on.

### TC-075: PUT bills.json — happy path
**Priority:** P0  
**Steps:**
1. With valid token, add unique note bill on test device.
2. Wait for sync success UI/toast if shown.
3. Verify raw GitHub `data/bills.json` on repo.
**Expected:** New bill in JSON; commit via Contents API; SHA updated on subsequent GET.

### TC-076: GET before PUT — SHA handling
**Priority:** P1  
**Steps:**
1. Perform two rapid saves from same device.
**Expected:** Second PUT includes updated `sha`; no 409 conflict error shown to user.

### TC-077: Invalid / revoked token error
**Priority:** P1  
**Steps:**
1. Save invalid token.
2. Add bill to trigger sync.
**Expected:** User-visible error; local data retained; no silent data loss.

### TC-078: No token — local-only mode
**Priority:** P0  
**Steps:**
1. Clear token.
2. Add bill.
**Expected:** No GitHub API calls; bill in `hospitalBillsLocal` pending queue only.

### TC-079: Multi-device — read after Pages deploy
**Priority:** P1  
**Steps:**
1. Device A syncs new bill.
2. Wait 30–90s for GitHub Pages.
3. Device B hard refresh.
**Expected:** Device B shows new bill and updated totals.

### TC-080: Concurrent edit — last PUT wins
**Priority:** P2  
**Steps:**
1. Two devices with tokens edit different fields offline.
2. Both sync online within seconds.
**Expected:** Documented behavior: later PUT overwrites full JSON; no merge conflict UI; tester records which device prevailed.

### TC-081: Optional Google `apiUrl` path (if configured)
**Priority:** P2  
**Steps:**
1. Set `hb_apiUrl` in localStorage to deployed Apps Script URL.
2. Add bill.
**Expected:** POST to Google endpoint succeeds (`ok: true`); UI treats as synced per `CONFIG.apiUrl` branch.

---

## OCR / Care (6)

### TC-082: Care welcome message on first open
**Priority:** P1  
**Steps:**
1. Clear chat messages (fresh session).
2. Open Care.
**Expected:** Bot greeting mentions patient name, camera upload, and medical disclaimer (follow doctor).

### TC-083: OCR — clear English prescription photo
**Priority:** P1  
**Steps:**
1. Upload well-lit photo of printed prescription with medicine names.
**Expected:** OCR progress bar shows; bot returns `analyzePrescription` summary with readable drug/text snippets.

### TC-084: OCR — blurry image rejection
**Priority:** P1  
**Steps:**
1. Upload dark/blurry image with &lt;8 chars OCR result.
**Expected:** Bot message: cannot read clearly; suggests brighter/closer photo; app stable.

### TC-085: Chat — discharge question Telugu
**Priority:** P0  
**Steps:**
1. Ask **ఎప్పుడు డిశ్చార్జ్?**
**Expected:** Reply includes `careStatus.expectedDischarge`, Telugu/English notes, days-left logic, last updated date.

### TC-086: Chat — health status question
**Priority:** P1  
**Steps:**
1. Ask **నాన్నగారి స్థితి ఏమిటి?**
**Expected:** Condition EN+TE, hospital, ward, admission date from `meta`/`careStatus`.

### TC-087: Chat — unknown question fallback
**Priority:** P2  
**Steps:**
1. Send gibberish question.
**Expected:** Fallback lists capabilities (discharge, status, bills, prescription upload); no crash.

---

## WhatsApp / Share (5)

### TC-088: buildWaText — tone and vocabulary
**Priority:** P0  
**Steps:**
1. Copy WhatsApp message from Share.
2. Search text for forbidden terms: `owes`, `MUST PAY`, `తీర్పు`.
**Expected:** None found; tone warm/respectful; uses సమన్యయం framing for adjustments.

### TC-089: WhatsApp text — totals match UI
**Priority:** P0  
**Steps:**
1. Record grand total and per-person paid on Share.
2. Copy message; compare figures.
**Expected:** Venky/Deepa/Kalyan amounts and fair 1/3 match exactly (same `fmt()` values).

### TC-090: WhatsApp text — settlement lines when Kalyan underpaid
**Priority:** P0  
**Steps:**
1. Use dataset where Kalyan paid &lt; fair share and others overpaid.
2. Copy message.
**Expected:** Message lists amounts to Deepa/Venky (credit order); total settlement equals `kalyanOwes`; no Venky→Deepa payment line.

### TC-091: WhatsApp text — all settled scenario
**Priority:** P1  
**Steps:**
1. Use balanced or Kalyan-not-owing dataset (or mental check against current data).
2. Copy message.
**Expected:** Celebratory balanced copy; no settlement payment lines when `settlements.length === 0`.

### TC-092: Share note — Shivaji advance called out separately
**Priority:** P1  
**Steps:**
1. Read footer note on Share tab and in copied message if included.
**Expected:** Shivaji→Venky advance total mentioned as separate from 3-way hospital split.

---

## Settlement math regression (8)

### TC-093: Fair share = total ÷ 3
**Priority:** P0  
**Steps:**
1. Sum all `data.bills` amounts manually (or from CSV).
2. Compare to Home “fair share” and Share `shareFair`.
**Expected:** Fair share = total ÷ 3, INR rounded/display consistent with `fmt()`.

### TC-094: sumWho attribution — payer only
**Priority:** P0  
**Steps:**
1. For each bill row, attribute amount to `who` field only.
2. Compare Venky/Deepa/Kalyan totals on Bills.
**Expected:** Matches `sumWho()`; son branches (Shivaji/Rajini) map to payers Venky/Deepa/Kalyan only.

### TC-095: Kalyan underpays — pays Deepa first when Deepa credit higher
**Priority:** P0  
**Steps:**
1. Construct or identify data: Deepa extra &gt; Venky extra &gt; 0; Kalyan paid &lt; fair.
2. Read Share settlement arrows.
**Expected:** `computeSettlement` routes Kalyan payments to Deepa before Venky per credit sort; amounts sum to `kalyanOwes`.

### TC-096: Venky never pays Deepa
**Priority:** P0  
**Steps:**
1. Review settlement hero, WhatsApp text, and Share note across current production data and edge-case samples.
**Expected:** No settlement row with `from: Venky` and `to: Deepa`; note explicitly states mutual non-payment between Venky and Deepa.

### TC-097: All paid equal — no settlement rows
**Priority:** P0  
**Steps:**
1. When each payer within ₹0.01 of fair share, open Share.
**Expected:** `settlements` empty; Telugu all-equal message; badges show SETTLED ✓ or equivalent.

### TC-098: Shivaji advances excluded from 3-way fair share
**Priority:** P0  
**Steps:**
1. Note `advances[]` total on Shivaji card.
2. Confirm fair share still uses `totalBills()` only (sum of bills, not advances).
**Expected:** Fair share denominator excludes advances; Shivaji card shows balance `adv - venky` separately.

### TC-099: fulfillPct on split cards 0–100%
**Priority:** P1  
**Steps:**
1. For each son split card, compare paid vs fair.
2. Check progress/fulfill percentage.
**Expected:** `fulfillPct = min(100, round(paid/fair*100))`; caps at 100% when overpaid.

### TC-100: Extra credit/debit labels (మిగిలింది / ఎక్కువ)
**Priority:** P1  
**Steps:**
1. Identify one overpaid and one underpaid payer.
2. Read split cards on Bills.
**Expected:** Underpaid shows owe label మిగిలింది with positive remainder; overpaid shows ఎక్కువ credit with absolute value; exact fair shows పూర్తి ✓.

---

## Test summary

| Section | Count | TC range |
|---------|------:|----------|
| Desktop | 15 | TC-001 – TC-015 |
| Android | 15 | TC-016 – TC-030 |
| iPhone / iOS Safari | 15 | TC-031 – TC-045 |
| Tablet | 8 | TC-046 – TC-053 |
| Offline / PWA | 12 | TC-054 – TC-065 |
| Slow network | 8 | TC-066 – TC-073 |
| GitHub sync | 8 | TC-074 – TC-081 |
| OCR / Care | 6 | TC-082 – TC-087 |
| WhatsApp / Share | 5 | TC-088 – TC-092 |
| Settlement math regression | 8 | TC-093 – TC-100 |
| **Total** | **100** | |

**Sign-off:** Tester _______________ Date _______________ Build verified: `2026-07-03-v23`
