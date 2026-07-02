/**
 * FamilyCare — care assistant chat & OCR (v24)
 */
(function (global) {
  const FC = global.FC || (global.FC = {});
  const { esc, fmt, fmtDate } = FC.utils;
  const CHAT_CHIPS = FC.CHAT_CHIPS;
  const DISCLAIMER_SHORT = "Not medical advice — follow Mallareddy Hospital doctor.";

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
    addBotMsg(`నమస్కారం! 🙏 Family care assistant for *${global.meta.patient}*.\n\n• Scroll Home for *AI Care Guide* + 7-day diet\n• Ask about status, recovery, breathing, discharge\n• Upload prescription 📷\n\n⚠️ Always follow the hospital doctor — this is family education only.`);
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
    const disc = global.careStatus.expectedDischarge ? fmtDate(global.careStatus.expectedDischarge) : "not set yet";

    if (/discharge|డిశ్చార్జ్|ఎప్పుడు|when.*out|leave hospital/i.test(q)) {
      if (global.careStatus.riskLevel === "caution") {
        return `⚠️ *Discharge not confirmed yet*\n\n${global.careStatus.dischargeNoteTe || global.careStatus.dischargeNote || ""}\n\nDoctor is still treating lung fluid & infection. Venky will update when discharge is safe.\n\n_${DISCLAIMER_SHORT}_`;
      }
      const daysLeft = global.careStatus.expectedDischarge
        ? Math.ceil((new Date(global.careStatus.expectedDischarge) - new Date()) / 86400000)
        : null;
      let msg = `📅 *Expected discharge:* ${disc}\n\n${global.careStatus.dischargeNoteTe || global.careStatus.dischargeNote || ""}`;
      if (daysLeft !== null) {
        if (daysLeft > 0) msg += `\n\n⏳ About *${daysLeft} day(s)* from today — subject to doctor's approval.`;
        else if (daysLeft === 0) msg += `\n\n✅ Discharge may be *today* — confirm with Venky or the ward nurse.`;
        else msg += `\n\n📌 Expected date has passed — Venky will update after doctor confirms.`;
      }
      return msg + `\n\nLast updated: ${fmtDate(global.careStatus.lastUpdate)}`;
    }
    if (/status|స్థితి|health|condition|ఎలా|how is|ayasam|apayam/i.test(q)) {
      return FC.careGuide?.getSituationText?.() || `💚 *Health status*\n${global.careStatus.condition}\n${global.careStatus.conditionTe || ""}`;
    }
    if (/diet|food|eat|tiffin|lunch|dinner|bhojanam|ఆహార|food plan|meal/i.test(q)) {
      return FC.careGuide?.getMealPlanText?.() || "Scroll down on Home for the 7-day meal plan.";
    }
    if (/recover|recovery|heal|breathing|swasa|dagg|cough|lung|fluid|infection|gas|bloat|urine/i.test(q)) {
      if (/breath|swasa|lung|fluid|dagg|cough/i.test(q)) {
        return `🫁 *Breathing & lung fluid*\n\nFluid around lungs makes breathing heavy and causes cough. Hospital is treating with medicines & sometimes drainage. Sit upright, small meals, less salt.\n\n${FC.careGuide?.getRecoveryText?.() || ""}`;
      }
      return FC.careGuide?.getRecoveryText?.() || global.careStatus.dischargeNote;
    }
    if (/bill|spent|ఖర్చు|money|amount|మొత్తం|how much/i.test(q)) {
      return `💰 *Hospital spend till now:* ${fmt(total)}\n\nFair share (1/3 each): ${fmt(fair)}\n\nVenky: ${fmt(sumWho("Venky"))}\nDeepa: ${fmt(sumWho("Deepa"))}\nKalyan: ${fmt(sumWho("Kalyan"))}\n\nFull details on the main page ↓`;
    }
    if (/who paid|ఎవరు|venky|deepa|kalyan/i.test(q)) {
      return `👨‍👩‍👦 *Who paid at hospital:*\n\n🙏 Venky (Shivaji): ${fmt(sumWho("Venky"))}\n💛 Deepa (Rajini): ${fmt(sumWho("Deepa"))}\n💙 Kalyan: ${fmt(sumWho("Kalyan"))}\n\nTotal: ${fmt(total)}`;
    }
    if (/prescription|మందు|medicine|tablet|rx/i.test(q)) {
      return `📷 Tap the *camera button* below and upload a photo of the prescription or hospital slip. I'll read the text and summarize it for you.`;
    }
    if (/thank|ధన్యవాద|ok|okay/i.test(q)) {
      return `🙏 Happy to help! Share this page with family on WhatsApp. For urgent updates, contact Venky at the hospital.`;
    }
    return `I can help with:\n• Status & doctor update (స్థితి)\n• 7-day soft diet plan 🍽️\n• Recovery & breathing tips\n• Discharge (when doctor clears)\n• Bills & prescription 📷\n\n_${DISCLAIMER_SHORT}_`;
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
    const lower = text.toLowerCase();
    const meds = [];
    const medPatterns = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+\d+\s*mg\b/g) || [];
    medPatterns.slice(0, 6).forEach((m) => meds.push(m));

    let msg = `📋 *Read from your document:*\n\n`;
    if (meds.length) msg += `💊 Possible medicines:\n${meds.map((m) => "• " + m).join("\n")}\n\n`;

    if (/discharge|discharged|fit for discharge/i.test(lower)) {
      msg += `✅ Document mentions *discharge* — discuss with doctor for exact timing.\n\n`;
    }
    if (/admit|admitted|ip number|uhid/i.test(lower)) {
      msg += `🏥 Admission/hospital reference found in document.\n\n`;
    }
    if (/bp|blood pressure|sugar|glucose|hb|hemoglobin/i.test(lower)) {
      msg += `📊 Vitals or lab values may be present — show to doctor for interpretation.\n\n`;
    }

    const snippet = text.slice(0, 280) + (text.length > 280 ? "…" : "");
    msg += `📝 *Extracted text (preview):*\n_${snippet}_\n\n`;
    msg += `⚠️ OCR may have errors. *Not medical advice* — confirm with Venky or the treating doctor.\n\nCurrent status: ${global.careStatus.condition}`;
    if (global.careStatus.expectedDischarge) msg += `\nExpected discharge: ${fmtDate(global.careStatus.expectedDischarge)}`;
    return msg;
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
        addBotMsg("Could not read text clearly. Try a brighter photo, closer to the paper. You can still ask me about status or discharge!");
        return;
      }
      addBotMsg(analyzePrescription(cleaned));
      FCAnalytics.track("ocr_used");
    } catch (e) {
      removeTyping();
      ocrBar?.classList.remove("show");
      addBotMsg("Photo upload failed on this device. You can still ask: *ఎప్పుడు డిశ్చార్జ్?* or *నాన్నగారి స్థితి?*");
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
