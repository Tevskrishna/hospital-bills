/**
 * FamilyCare — Family Information Dashboard (NOT medical advice)
 * @description Family communication board for Venky to update; synced with family.
 */
(function (global) {
  const FC = global.FC || (global.FC = {});
  const { esc, fmtDate } = FC.utils;

  const DISCLAIMER =
    "This information is for family communication only and does not replace medical advice. Always follow the treating doctor's instructions.";

  const DEFAULT_DASHBOARD = {
    dashboardDate: "",
    currentStatus: "Still in hospital — doctor says still weak (ayasam). Under close watch.",
    currentStatusTe: "ఇంకా hospital lo — doctor: ayasam ga unnaru. Close watch lo unnaru.",
    doctorUpdate: "Doctor counselling: risk not fully over yet. Lung fluid issue ongoing. BP & sugar monitored.",
    doctorUpdateTe: "డాక్టర్ counselling: inka apayam undi. Lung fluid issue ongoing. BP, sugar monitor chestunnaru.",
    concerns: "Heavy breathing · cough · bloating/gas · frequent urine · blood infection treatment · lung fluid",
    concernsTe: "శ్వాస కష్టం · దగ్గు · gas/bloating · urine ekkuva · blood infection · lung fluid",
    todayDiet: {
      tiffin: "",
      lunch: "",
      dinner: "",
      guidance: "Enter only what nurse/doctor approved for today",
    },
    medicinesToday: "Notes only — list medicines nurse gave today (do not change doses yourself)",
    testsCompleted: "",
    testsPending: "",
    questionsForDoctor: "• When will lung fluid improve?\n• Discharge criteria?\n• Today's diet limits for BP/sugar?",
    emergencySigns: "Note any warning signs the nurse/doctor told the family to watch for. Call ward staff immediately if patient suddenly worsens.",
    visitorNotes: "Keep visits short and calm. Confirm visiting hours with ward.",
    lastUpdated: "2026-07-03",
    lastUpdatedBy: "Venky",
  };

  function todayIso() {
    return new Date().toISOString().slice(0, 10);
  }

  function ensureDashboard(raw) {
    const base = { ...DEFAULT_DASHBOARD, todayDiet: { ...DEFAULT_DASHBOARD.todayDiet } };
    if (!raw || typeof raw !== "object") return base;
    return {
      ...base,
      ...raw,
      todayDiet: { ...base.todayDiet, ...(raw.todayDiet || {}) },
    };
  }

  function getDashboard() {
    return ensureDashboard(global.familyDashboard);
  }

  function disclaimerBlock() {
    return `<p class="fd-disclaimer" role="note">${esc(DISCLAIMER)}</p>`;
  }

  function section(title, titleTe, bodyHtml, editable) {
    return `
      <section class="fd-section">
        <div class="fd-sec-head">
          <h4>${esc(title)}${titleTe ? ` <span class="fd-te">${esc(titleTe)}</span>` : ""}</h4>
        </div>
        ${disclaimerBlock()}
        <div class="fd-body">${bodyHtml}</div>
        ${editable ? `<button type="button" class="fd-edit-hint no-print" onclick="openFamilyDashboardEdit()">✏️ Update</button>` : ""}
      </section>`;
  }

  function textBlock(text) {
    const t = String(text || "").trim();
    if (!t) return `<p class="fd-empty">Not updated yet — Venky can add from hospital.</p>`;
    return `<div class="fd-text">${esc(t).replace(/\n/g, "<br>")}</div>`;
  }

  function renderFamilyDashboard() {
    const el = document.getElementById("familyDashboard");
    if (!el) return;

    const d = getDashboard();
    const cs = global.careStatus || {};
    const updated = d.lastUpdated ? fmtDate(d.lastUpdated) : "—";
    const by = d.lastUpdatedBy || "Venky";
    const dietDate = d.dashboardDate ? fmtDate(d.dashboardDate) : "Today";

    el.innerHTML = `
      <div class="family-dashboard reveal">
        <header class="fd-header">
          <span class="fd-badge">📋 Family Information Dashboard</span>
          <h2>Care updates · కుటుంబ సమాచారం</h2>
          <p class="fd-meta">Last updated ${updated} by ${esc(by)} · ${esc(global.meta?.hospital || "Hospital")} · ${esc(cs.ward || "Ward")}</p>
          ${disclaimerBlock()}
          <button type="button" class="btn-block fd-edit-btn no-print" onclick="openFamilyDashboardEdit()">✏️ Update family notes (Venky)</button>
        </header>

        ${section(
          "Current status",
          "ప్రస్తుత స్థితి",
          `<p class="fd-status-en">${esc(cs.condition || d.currentStatus)}</p>
           <p class="fd-te">${esc(cs.conditionTe || d.currentStatusTe || "")}</p>`,
          false
        )}

        ${section("Doctor's latest update", "డాక్టర్ అప్డేట్", textBlock(d.doctorUpdate + (d.doctorUpdateTe ? "\n" + d.doctorUpdateTe : "")), true)}

        ${section("Current concerns (family notes)", "ప్రస్తుత concerns", textBlock(d.concerns + (d.concernsTe ? "\n" + d.concernsTe : "")), true)}

        ${section(
          "Today's diet guidance",
          "ఈ రోజు ఆహారం",
          `<p class="fd-diet-date">${esc(dietDate)}</p>
           <div class="fd-diet-grid">
             <div><span>🌅 Tiffin</span>${textBlock(d.todayDiet.tiffin)}</div>
             <div><span>☀️ Lunch</span>${textBlock(d.todayDiet.lunch)}</div>
             <div><span>🌙 Dinner</span>${textBlock(d.todayDiet.dinner)}</div>
           </div>
           ${d.todayDiet.guidance ? `<p class="fd-note">${esc(d.todayDiet.guidance)}</p>` : ""}`,
          true
        )}

        ${section("Medicines prescribed today (notes only)", "ఈ రోజు మందులు — notes", textBlock(d.medicinesToday), true)}

        ${section("Tests completed today", "పూర్తైన tests", textBlock(d.testsCompleted), true)}

        ${section("Tests pending", "Pending tests", textBlock(d.testsPending), true)}

        ${section("Questions to ask the doctor", "డాక్టర్ ని అడగాల్సిన ప్రశ్నలు", textBlock(d.questionsForDoctor), true)}

        ${section("Emergency warning signs (from nurse/doctor)", "Emergency signs", textBlock(d.emergencySigns), true)}

        ${section("Visitor notes", "Visitor notes", textBlock(d.visitorNotes), true)}

        <div class="fd-footer no-print">
          <button type="button" class="qa-chip" onclick="toggleChat(true)">💬 Care chat</button>
          <button type="button" class="qa-chip" onclick="showPage('home')">🏠 Home</button>
        </div>
      </div>`;
  }

  function getDashboardSummaryForChat() {
    const d = getDashboard();
    const cs = global.careStatus || {};
    return `📋 *Family Dashboard summary*\n\n*Status:* ${cs.condition || d.currentStatus}\n\n*Doctor update:* ${(d.doctorUpdate || "Not entered").slice(0, 200)}\n\n*Today's diet:*\n🌅 ${d.todayDiet.tiffin || "—"}\n☀️ ${d.todayDiet.lunch || "—"}\n🌙 ${d.todayDiet.dinner || "—"}\n\n_Open Care tab for full details._\n\n_${DISCLAIMER}_`;
  }

  FC.familyDashboard = {
    DISCLAIMER,
    DEFAULT_DASHBOARD,
    ensureDashboard,
    getDashboard,
    renderFamilyDashboard,
    getDashboardSummaryForChat,
  };

  global.renderFamilyDashboard = renderFamilyDashboard;
  global.ensureFamilyDashboard = ensureDashboard;
})(typeof window !== "undefined" ? window : global);
