/**
 * FamilyCare — care assistant chat (family info only, NOT medical advice)
 */
(function (global) {
  const FC = global.FC || (global.FC = {});
  const { esc, fmt, fmtDate } = FC.utils;
  const CHAT_CHIPS = FC.CHAT_CHIPS;
  const DISCLAIMER =
    "This information is for family communication only and does not replace medical advice. Always follow the treating doctor's instructions.";

  function loadTesseract() {
    if (window.Tesseract) return Promise.resolve(window.Tesseract);
    if (FC.state.tesseractReady) return FC.state.tesseractReady;
    FC.state.tesseractReady = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
      s.async = true;
      s.onload = () => resolve(window.Tesseract);
      s.onerror = () => reject(new Error("OCR library failed to load"));
      document.head.appendChild(s);
    });
    global.tesseractReady = FC.state.tesseractReady;
    return FC.state.tesseractReady;
  }

  function toggleChat(force) {
    FC.state.chatOpen = typeof force === "boolean" ? force : !FC.state.chatOpen;
    global.chatOpen = FC.state.chatOpen;
    document.getElementById("chatPanel").classList.toggle("open", FC.state.chatOpen);
    document.getElementById("chatOverlay").classList.toggle("open", FC.state.chatOpen);
    document.getElementById("chatFab").classList.toggle("open", FC.state.chatOpen);
    if (FC.state.chatOpen && !document.getElementById("chatMsgs").children.length) initChat();
  }

  function initChat() {
    const chips = document.getElementById("chatChips");
    chips.innerHTML = CHAT_CHIPS.map((c) => `<button class="chat-chip" onclick="askChip('${c.replace(/'/g, "\\'")}')">${c}</button>`).join("");
    addBotMsg(`నమస్కారం! 🙏 Family communication assistant for *${global.meta.patient}*.\n\n• Open the *Care* tab for the full Family Information Dashboard\n• I share notes Venky enters — not medical advice\n\n_${DISCLAIMER}_`);
  }

  function addBotMsg(text) {
    const el = document.createElement("div");
    el.className = "chat-msg bot";
    el.innerHTML = esc(text).replace(/\n/g, "<br>").replace(/\*(.*?)\*/g, "<strong>$1</strong>");
    document.getElementById("chatMsgs").appendChild(el);
    el.parentElement.scrollTop = el.parentElement.scrollHeight;
  }

  function addUserMsg(text) {
    const el = document.createElement("div");
    el.className = "chat-msg user";
    el.textContent = text;
    document.getElementById("chatMsgs").appendChild(el);
    el.parentElement.scrollTop = el.parentElement.scrollHeight;
  }

  function addTyping() {
    const el = document.createElement("div");
    el.className = "chat-msg bot";
    el.id = "chatTyping";
    el.innerHTML = '<span class="typing">Reading</span>...';
    document.getElementById("chatMsgs").appendChild(el);
    el.parentElement.scrollTop = el.parentElement.scrollHeight;
  }

  function removeTyping() {
    document.getElementById("chatTyping")?.remove();
  }

  function askChip(q) {
    document.getElementById("chatInput").value = q;
    sendChat();
  }

  function answerQuestion(q) {
    const total = totalBills();
    const fair = total / 3;
    const d = FC.familyDashboard?.getDashboard?.() || {};
    const cs = global.careStatus || {};

    if (/dashboard|summary|family info/i.test(q)) {
      return FC.familyDashboard?.getDashboardSummaryForChat?.() || `Open the Care tab for the Family Information Dashboard.\n\n_${DISCLAIMER}_`;
    }
    if (/doctor|update|counsell|డాక్టర్/i.test(q)) {
      const u = [d.doctorUpdate, d.doctorUpdateTe].filter(Boolean).join("\n") || "Not entered yet — Venky can update on Care tab.";
      return `📋 *Doctor's latest update (family notes)*\n\n${u}\n\n_${DISCLAIMER}_`;
    }
    if (/diet|food|tiffin|lunch|dinner|ఆహార|meal/i.test(q)) {
      const td = d.todayDiet || {};
      return `🍽️ *Today's diet guidance (family notes)*\n\n🌅 Tiffin: ${td.tiffin || "—"}\n☀️ Lunch: ${td.lunch || "—"}\n🌙 Dinner: ${td.dinner || "—"}\n${td.guidance ? "\n" + td.guidance : ""}\n\n_${DISCLAIMER}_`;
    }
    if (/question|ask doctor|ప్రశ్న/i.test(q)) {
      return `❓ *Questions to ask the doctor*\n\n${d.questionsForDoctor || "Not entered yet — add on Care tab."}\n\n_${DISCLAIMER}_`;
    }
    if (/test|report|ల్యాబ/i.test(q)) {
      return `🧪 *Tests (family notes)*\n\n*Completed:* ${d.testsCompleted || "—"}\n*Pending:* ${d.testsPending || "—"}\n\n_${DISCLAIMER}_`;
    }
    if (/medicine|tablet|మందు|rx/i.test(q)) {
      return `💊 *Medicines today (notes only)*\n\n${d.medicinesToday || "Not entered yet."}\n\n_Do not change medicines yourself._\n\n_${DISCLAIMER}_`;
    }
    if (/discharge|డిశ్చార్జ్|ఎప్పుడు/i.test(q)) {
      if (cs.riskLevel === "caution" || !cs.expectedDischarge) {
        return `📋 *Discharge (family notes)*\n\n${cs.dischargeNoteTe || cs.dischargeNote || "Not confirmed yet — follow doctor."}\n\n_${DISCLAIMER}_`;
      }
      return `📅 Expected discharge: ${fmtDate(cs.expectedDischarge)}\n\n${cs.dischargeNoteTe || cs.dischargeNote || ""}\n\n_${DISCLAIMER}_`;
    }
    if (/status|స్థితి|health|condition|concern/i.test(q)) {
      return `📋 *Current status (family notes)*\n\n${cs.condition || d.currentStatus || "—"}\n${cs.conditionTe || d.currentStatusTe || ""}\n\n*Concerns noted:* ${d.concerns || "—"}\n\n_${DISCLAIMER}_`;
    }
    if (/emergency|visitor|warning/i.test(q)) {
      return `🚨 *Emergency signs (from nurse/doctor — family notes)*\n${d.emergencySigns || "—"}\n\n*Visitor notes:*\n${d.visitorNotes || "—"}\n\n_${DISCLAIMER}_`;
    }
    if (/bill|spent|ఖర్చు|money|amount|మొత్తం|how much/i.test(q)) {
      return `💰 *Hospital spend till now:* ${fmt(total)}\n\nFair share (1/3 each): ${fmt(fair)}\n\nVenky: ${fmt(sumWho("Venky"))}\nDeepa: ${fmt(sumWho("Deepa"))}\nKalyan: ${fmt(sumWho("Kalyan"))}`;
    }
    if (/who paid|ఎవరు|venky|deepa|kalyan/i.test(q)) {
      return `👨‍👩‍👦 *Who paid at hospital:*\n\n🙏 Venky: ${fmt(sumWho("Venky"))}\n💛 Deepa: ${fmt(sumWho("Deepa"))}\n💙 Kalyan: ${fmt(sumWho("Kalyan"))}\n\nTotal: ${fmt(total)}`;
    }
    if (/prescription|rx|upload|photo/i.test(q)) {
      return `📷 Upload a hospital slip with the camera button below. I will read text for family notes only — not medical advice.\n\n_${DISCLAIMER}_`;
    }
    if (/thank|ధన్యవాద|ok|okay/i.test(q)) {
      return `🙏 For full details open the *Care* tab. For urgent help, speak to ward staff or Venky at the hospital.`;
    }
    return `I share *family notes* from the Care dashboard — not medical advice.\n\nTry:\n• Latest doctor update?\n• Today's diet?\n• Family dashboard summary\n\nOr open the *Care* tab ↑\n\n_${DISCLAIMER}_`;
  }

  function sendChat() {
    const input = document.getElementById("chatInput");
    const q = input.value.trim();
    if (!q) return;
    input.value = "";
    addUserMsg(q);
    addTyping();
    setTimeout(() => {
      removeTyping();
      addBotMsg(answerQuestion(q));
    }, 500 + Math.random() * 400);
  }

  function analyzePrescription(text) {
    const snippet = text.slice(0, 280) + (text.length > 280 ? "…" : "");
    return `📋 *Document text (family notes only)*\n\n_${snippet}_\n\nVenky can copy relevant lines into the Care dashboard. This is not medical advice.\n\n_${DISCLAIMER}_`;
  }

  async function uploadPrescription(input) {
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    if (!FC.state.chatOpen) toggleChat(true);
    addUserMsg("📷 Uploaded: " + file.name);
    addTyping();
    const ocrBar = document.getElementById("ocrProgress");
    ocrBar?.classList.add("show");
    try {
      const Tesseract = await loadTesseract();
      const { data: { text } } = await Tesseract.recognize(file, "eng+tel", { logger: () => {} });
      removeTyping();
      ocrBar?.classList.remove("show");
      const cleaned = text.replace(/\s+/g, " ").trim();
      if (!cleaned || cleaned.length < 8) {
        addBotMsg("Could not read text clearly. Venky can type notes directly on the Care tab.");
        return;
      }
      addBotMsg(analyzePrescription(cleaned));
      FCAnalytics.track("ocr_used");
    } catch (e) {
      removeTyping();
      ocrBar?.classList.remove("show");
      addBotMsg("Photo upload failed. Use the Care tab to type family notes.");
    }
  }

  FC.care = { toggleChat, initChat, sendChat, askChip, uploadPrescription, loadTesseract, analyzePrescription };
  global.toggleChat = toggleChat;
  global.initChat = initChat;
  global.sendChat = sendChat;
  global.askChip = askChip;
  global.uploadPrescription = uploadPrescription;
  global.loadTesseract = loadTesseract;
})(typeof window !== "undefined" ? window : global);
