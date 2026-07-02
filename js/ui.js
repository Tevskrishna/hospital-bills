/**
 * FamilyCare — UI helpers, modals, navigation (v24)
 */
(function (global) {
  const FC = global.FC || (global.FC = {});
  const { esc, haptic, csvEsc, debounce, friendlySyncError } = FC.utils;
  const { validateBill, validateAdvance, isDuplicateBill } = FC.validation;

  function toast(msg, type) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.innerHTML = (type === "success" ? '<span class="toast-ic">✓</span> ' : "") + esc(msg);
    el.classList.toggle("success", type === "success");
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 3200);
  }

  function openAddModal() {
    document.getElementById("aDate").value = new Date().toISOString().slice(0, 10);
    syncAdminStatusFields();
    document.getElementById("addModal").classList.add("open");
    document.getElementById("addFabPremium")?.classList.add("open");
    document.getElementById("addModal").setAttribute("aria-hidden", "false");
    haptic(6);
  }

  function closeAddModal() {
    document.getElementById("addModal").classList.remove("open");
    document.getElementById("addFabPremium")?.classList.remove("open");
    document.getElementById("addModal").setAttribute("aria-hidden", "true");
  }

  function syncAdminStatusFields() {
    const d = document.getElementById("aDischarge");
    if (!d) return;
    d.value = global.careStatus.expectedDischarge || "";
    document.getElementById("aCondition").value = global.careStatus.condition || "";
    document.getElementById("aConditionTe").value = global.careStatus.conditionTe || "";
    document.getElementById("aDischargeNote").value = global.careStatus.dischargeNote || "";
  }

  async function addBill() {
    const d = document.getElementById("aDate").value;
    const who = document.getElementById("aWho").value;
    const amt = document.getElementById("aAmt").value;
    const mode = document.getElementById("aMode").value;
    const note = document.getElementById("aNote").value.trim();

    const v = validateBill({ d, who, amt, mode, note });
    if (!v.ok) return toast(v.error);

    if (isDuplicateBill(global.data.bills, v.bill)) {
      return toast("This bill looks like a duplicate — check date, amount, and payer.");
    }

    const bill = v.bill;
    global.data.bills.push(bill);
    FCAnalytics.track("bill_added");
    document.getElementById("aAmt").value = "";
    document.getElementById("aNote").value = "";
    global.render();
    closeAddModal();
    toast("Saving...");

    const r = await FC.sync.pushAllToCloud();
    if (r.ok) {
      FCAnalytics.track("sync_success");
      toast("Saved! Family sees it in ~1 min.", "success");
      FC.storage.clearLocalPending();
    } else {
      FCAnalytics.track("sync_failure");
      await FC.sync.registerBgSync();
      const p = FC.storage.getLocalPending();
      FC.storage.saveLocalPending({ pendingBills: [...(p.pendingBills || []), bill] });
      FC.sync.syncToastOnFailure(r);
    }
  }

  async function addAdvance() {
    const d = document.getElementById("aDate").value;
    const raw = prompt("Shivaji → Venky amount (₹)");
    if (raw === null) return;
    const v = validateAdvance({ d, amt: raw });
    if (!v.ok) return toast(v.error);

    const advance = v.advance;
    global.data.advances.push(advance);
    global.render();
    closeAddModal();
    toast("Saving...");

    const r = await FC.sync.pushAllToCloud();
    if (r.ok) toast("Advance saved for family!", "success");
    else {
      const p = FC.storage.getLocalPending();
      FC.storage.saveLocalPending({ pendingAdvances: [...(p.pendingAdvances || []), advance] });
      FC.sync.syncToastOnFailure(r);
    }
  }

  async function saveStatus() {
    global.careStatus.expectedDischarge = document.getElementById("aDischarge").value || global.careStatus.expectedDischarge;
    global.careStatus.condition = document.getElementById("aCondition").value.trim() || global.careStatus.condition;
    global.careStatus.conditionTe = document.getElementById("aConditionTe").value.trim() || global.careStatus.conditionTe;
    global.careStatus.dischargeNote = document.getElementById("aDischargeNote").value.trim() || global.careStatus.dischargeNote;
    global.careStatus.lastUpdate = new Date().toISOString().slice(0, 10);
    global.careStatus.lastUpdateBy = "Venky";
    FC.render?.renderCareBanner?.();
    closeAddModal();

    const r = await FC.sync.pushAllToCloud();
    if (r.ok) toast("Status updated for family!", "success");
    else {
      FC.storage.saveLocalPending({ careStatus: global.careStatus });
      toast("Status saved on this phone — complete setup in Bills tab.");
    }
  }

  function downloadHistory() {
    const start = global.meta.startDate;
    const today = new Date().toISOString().slice(0, 10);
    const fair = totalBills() / 3;
    let csv = `Hospital Bills - ${global.meta.patient}\nPeriod,${start} to ${today}\n\nDate,Paid By,Amount,Mode,Notes\n`;
    [...global.data.bills].sort((a, b) => a.d.localeCompare(b.d)).forEach((b) => {
      csv += [b.d, b.who, b.amt, csvEsc(b.mode), csvEsc(b.note)].join(",") + "\n";
    });
    csv += `\nTOTAL,${totalBills()}\n\nFAIR SHARE\nSon,Fair,Paid,Remaining\n`;
    [["Shivaji/Venky", sumWho("Venky")], ["Rajini/Deepa", sumWho("Deepa")], ["Kalyan", sumWho("Kalyan")]].forEach(([n, p]) => {
      csv += `${n},${fair.toFixed(2)},${p.toFixed(2)},${(fair - p).toFixed(2)}\n`;
    });
    csv += `\nShivaji Advances\nDate,Amount\n`;
    global.data.advances.forEach((a) => { csv += `${a.d},${a.amt}\n`; });
    const el = document.createElement("a");
    el.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    el.download = `hospital-bills-${start}-to-${today}.csv`;
    el.click();
  }

  function showPage(tab) {
    document.querySelectorAll(".app-page").forEach((p) => p.classList.remove("active"));
    const page = document.getElementById("page-" + tab);
    page?.classList.add("active");
    document.querySelectorAll(".app-nav button[data-nav]").forEach((b) => {
      const active = b.dataset.nav === tab;
      b.classList.toggle("active", active);
      if (active) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
    const fab = document.getElementById("addFabPremium");
    if (fab) fab.classList.toggle("hide", tab === "share");
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
    if (tab === "care") global.toggleChat?.(true);
  }

  function hideSplash() {
    requestAnimationFrame(() => {
      document.getElementById("splash")?.classList.add("hide");
    });
  }

  const filterBills = debounce(() => {
    FC.state.billSearchQuery = document.getElementById("billSearch")?.value || "";
    global.billSearchQuery = FC.state.billSearchQuery;
    FC.render?.renderBillsList?.();
  }, FC.FILTER_DEBOUNCE_MS);

  function setBillFilter(who, btn) {
    FC.state.billFilterWho = who;
    global.billFilterWho = who;
    document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
    btn?.classList.add("active");
    FC.render?.renderBillsList?.();
  }

  function toggleTxn(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const open = el.classList.toggle("expanded");
    const btn = el.querySelector(".tx-toggle");
    if (btn) {
      btn.textContent = open ? "Hide note" : "Show note";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }
  }

  FC.ui = { toast, openAddModal, closeAddModal, syncAdminStatusFields, addBill, addAdvance, saveStatus, downloadHistory, showPage, hideSplash, filterBills, setBillFilter, toggleTxn };

  global.toast = toast;
  global.openAddModal = openAddModal;
  global.closeAddModal = closeAddModal;
  global.syncAdminStatusFields = syncAdminStatusFields;
  global.addBill = addBill;
  global.addAdvance = addAdvance;
  global.saveStatus = saveStatus;
  global.downloadHistory = downloadHistory;
  global.showPage = showPage;
  global.hideSplash = hideSplash;
  global.filterBills = filterBills;
  global.setBillFilter = setBillFilter;
  global.toggleTxn = toggleTxn;
})(typeof window !== "undefined" ? window : global);
