/**
 * FamilyCare — AI Care Guide (family education, not a real doctor)
 * @description Explains current situation + 7-day soft diet plan for Venky to share with family.
 * Always confirm with treating doctor before changing food or medicines.
 */
(function (global) {
  const FC = global.FC || (global.FC = {});
  const { esc } = FC.utils;

  const DISCLAIMER =
    "⚠️ This is family education only — NOT a real doctor. Confirm every meal and medicine with the treating doctor at Mallareddy Hospital before giving.";

  const SITUATION = {
    title: "What the doctor is telling us",
    titleTe: "డాక్టర్ ఏమి చెబుతున్నారు",
    points: [
      {
        en: "Lung fluid (pleural effusion) is still being treated — this causes heavy breathing and cough until it improves.",
        te: "ఛాతీలో lung fluid (నీరు) ఇంకా ఉంది — అందుకే శ్వాస కష్టం, దగ్గు వస్తున్నాయి.",
      },
      {
        en: "Blood infection / sepsis is being controlled with IV antibiotics — weakness (ayasam) is expected while recovering.",
        te: "రక్తంలో infection — antibiotics IV లో ongoing. Doctor: ఇంకా ayasam ga unnaru (బలహీనంగా ఉన్నారు).",
      },
      {
        en: "BP and sugar must stay controlled — wrong food or missed medicine can worsen breathing and urine frequency.",
        te: "BP, sugar control చాలా ముఖ్యం — తప్పు food/medicine వల్ల urine ఎక్కువ, gas, breathing worse avvochu.",
      },
      {
        en: "Bloating, gas, and frequent urine — eat small portions, low salt, avoid fried food until doctor clears.",
        te: "Gas, bloating, urine ekkuva — chinna chinna portions, less salt, fry items avoid cheyandi.",
      },
      {
        en: "Doctor counselling: risk is NOT over yet — stay in hospital until lung fluid and infection markers improve.",
        te: "Doctor counselling: inka apayam undi — lung fluid, infection taggaka discharge kadu.",
      },
    ],
  };

  const RECOVERY = {
    title: "How recovery usually happens",
    titleTe: "Recovery ela avtundi",
    steps: [
      "Complete all IV antibiotics & medicines on time — do not skip.",
      "Deep breathing exercises only if physiotherapist/doctor approves.",
      "Sleep with head slightly raised (2 pillows) — helps breathing.",
      "Small sips of warm water; fluid limit as nurse advises (lung fluid).",
      "Monitor: fever, worse breathlessness, confusion, less urine → tell nurse immediately.",
      "Rest between short walks in room when doctor allows.",
      "Family: calm updates only — avoid stress arguments near patient.",
    ],
    stepsTe: [
      "Medicines time ki teeyandi — skip cheyakandi.",
      "Doctor cheppina ventane leg lung exercises / physiotherapy.",
      "Tala 2 pillows ekkuva — swasa ki help.",
      "Warm water chinna sips — nurse cheppina fluid limit follow.",
      "Fever, swasa ekkuva, confusion, urine taggite — nurse ki ventane cheppandi.",
      "Doctor allow chesina ventane room lo slow walk.",
      "Family stress tagginchandi — patient deggara arguments avoid.",
    ],
  };

  /** 7-day soft diet — low salt, diabetic-friendly, easy digest, anti-gas */
  const MEAL_PLAN = [
    { day: "Day 1 · Fri", tiffin: "2 soft idli + thin sambar (less salt) + weak tea no sugar", lunch: "Small rice + thin moong dal + lauki (sorakaya) curry steamed", dinner: "Ragi malt (no sugar) + 1 soft chapati + bottle gourd soup" },
    { day: "Day 2 · Sat", tiffin: "Oats upma (minimal oil, vegetables) + 1 boiled egg white if doctor OK", lunch: "Half rice + rasam (less salt, no chilli) + steamed beans carrot", dinner: "Khichdi (rice + moong, soft) + curd 2 spoons if no gas" },
    { day: "Day 3 · Sun", tiffin: "Soft dosa (1) + coconut chutney minimal + warm water", lunch: "Small rice + dal + palakura pappu (spinach, light)", dinner: "Vegetable soup (carrot, beans) + 1 idli or soft roti" },
    { day: "Day 4 · Mon", tiffin: "Ragi idli (2) + sambar | avoid fried tiffin", lunch: "Half rice + fish curry light OR dal if veg + cabbage poriyal (soft)", dinner: "Milk rice (paal biyyam, less sugar) small bowl + banana half if sugar OK" },
    { day: "Day 5 · Tue", tiffin: "Upma with rava (soft, less oil) + weak coffee no sugar", lunch: "Small rice + tomato rasam (mild) + steamed pumpkin", dinner: "Soft chapati (1) + mixed veg soup + moong dal" },
    { day: "Day 6 · Wed", tiffin: "Idli (2) + chutney + warm jeera water (gas relief)", lunch: "Half rice + dal + ridge gourd (beerakaya) curry", dinner: "Khichdi + curd rice small (only if no bloating)" },
    { day: "Day 7 · Thu", tiffin: "Oats / ragi porridge (no sugar) + soaked almonds (2) if doctor OK", lunch: "Small rice + rasam + soft boiled vegetables", dinner: "Light soup + 1 idli — early dinner before 7:30 PM" },
  ];

  const AVOID = [
    "Fried items, bajji, pakodi, chips",
    "Pickle, papad, extra salt on table",
    "Sweet lassi, juices, cold drinks, ice cream",
    "Large meals — causes gas & breathlessness",
    "Heavy dal / rajma / chana until gas settles",
    "Smoking area, strong masala, leftover food",
  ];

  function getSituationText() {
    let t = `🩺 *${SITUATION.title}*\n_${SITUATION.titleTe}_\n\n`;
    SITUATION.points.forEach((p) => {
      t += `• ${p.en}\n  _${p.te}_\n\n`;
    });
    return t + DISCLAIMER;
  }

  function getRecoveryText() {
    let t = `💪 *${RECOVERY.title}*\n_${RECOVERY.titleTe}_\n\n`;
    RECOVERY.steps.forEach((s, i) => {
      t += `${i + 1}. ${s}\n   _${RECOVERY.stepsTe[i]}_\n`;
    });
    return t + "\n" + DISCLAIMER;
  }

  function getMealPlanText() {
    let t = `🍽️ *7-day soft diet plan* (tiffin · lunch · dinner)\n_Low salt · sugar control · easy digest · less gas_\n\n`;
    MEAL_PLAN.forEach((d) => {
      t += `*${d.day}*\n🌅 ${d.tiffin}\n☀️ ${d.lunch}\n🌙 ${d.dinner}\n\n`;
    });
    t += `*Avoid:* ${AVOID.slice(0, 4).join("; ")}\n\n${DISCLAIMER}`;
    return t;
  }

  function renderCareGuide() {
    const el = document.getElementById("careGuide");
    if (!el) return;

    const situationHtml = SITUATION.points
      .map((p) => `<li><strong>${esc(p.en)}</strong><br><span class="cg-te">${esc(p.te)}</span></li>`)
      .join("");

    const recoveryHtml = RECOVERY.steps
      .map((s, i) => `<li>${esc(s)}<br><span class="cg-te">${esc(RECOVERY.stepsTe[i])}</span></li>`)
      .join("");

    const mealsHtml = MEAL_PLAN.map((d) => `
      <div class="cg-day">
        <div class="cg-day-head">${esc(d.day)}</div>
        <div class="cg-meal"><span>🌅 Tiffin</span>${esc(d.tiffin)}</div>
        <div class="cg-meal"><span>☀️ Lunch</span>${esc(d.lunch)}</div>
        <div class="cg-meal"><span>🌙 Dinner</span>${esc(d.dinner)}</div>
      </div>`).join("");

    const avoidHtml = AVOID.map((a) => `<li>${esc(a)}</li>`).join("");

    el.innerHTML = `
      <div class="care-guide reveal">
        <div class="cg-header">
          <span class="cg-badge">🩺 AI Care Guide · వైద్య సహాయం</span>
          <h3>${esc(SITUATION.title)}</h3>
          <p class="cg-sub">${esc(SITUATION.titleTe)}</p>
        </div>
        <p class="cg-disclaimer">${esc(DISCLAIMER)}</p>
        <ul class="cg-list">${situationHtml}</ul>
        <h4 class="cg-sec">${esc(RECOVERY.title)} · ${esc(RECOVERY.titleTe)}</h4>
        <ol class="cg-list cg-ol">${recoveryHtml}</ol>
        <h4 class="cg-sec">🍽️ 1 week daily food · 7 రోజుల bhojanam</h4>
        <p class="cg-note">Small portions · warm food · less salt · no fry · confirm with doctor</p>
        <div class="cg-meals">${mealsHtml}</div>
        <h4 class="cg-sec">❌ Avoid until doctor clears</h4>
        <ul class="cg-list cg-avoid">${avoidHtml}</ul>
        <button type="button" class="home-link" onclick="toggleChat(true); askChip('Explain today diet')">Ask Care Assistant →</button>
      </div>`;
  }

  FC.careGuide = {
    SITUATION,
    RECOVERY,
    MEAL_PLAN,
    getSituationText,
    getRecoveryText,
    getMealPlanText,
    renderCareGuide,
  };

  global.renderCareGuide = renderCareGuide;
})(typeof window !== "undefined" ? window : global);
