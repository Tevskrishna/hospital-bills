/**
 * FamilyCare — WhatsApp share (v24)
 * MESSAGE LOGIC FROZEN — identical to v21+ warm Telugu tone.
 */
(function (global) {
  const FC = global.FC || (global.FC = {});
  const { fmt } = FC.utils;

  function buildWaText() {
    const t = totalBills();
    const v = sumWho("Venky");
    const d = sumWho("Deepa");
    const k = sumWho("Kalyan");
    const fair = t / 3;
    const s = computeSettlement(t);
    const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    const paidLine = (te, amt, extra) => {
      if (extra > 0.01) return `${te} — ${fmt(amt)} (ఎక్కువ చెల్లించారు 🙏)`;
      if (extra < -0.01) return `${te} — ${fmt(amt)}`;
      return `${te} — ${fmt(amt)} ✓`;
    };

    let settle = "";
    if (s.settlements.length) {
      const credits = [];
      if (s.extra.Venky > 0.01) credits.push(`వెంకీకి తిరిగి: ${fmt(s.extra.Venky)}`);
      if (s.extra.Deepa > 0.01) credits.push(`దీపకు తిరిగి: ${fmt(s.extra.Deepa)}`);
      settle = `\n*సమన్యయం — అందరికి సమానం చేయడానికి* 🙏\n`;
      settle += `(ఎవరు ఎక్కువ చెల్లించారో వారికి తిరిగి ఇవ్వడం మాత్రమే)\n\n`;
      if (credits.length) settle += credits.join("\n") + "\n\n";
      settle += `కల్యాణ్ గారు ఈ విధంగా పంపితే అందరికి సరిపోతుంది:\n`;
      s.settlements.forEach((x) => {
        settle += `→ ${x.toTe} గారికి: ${fmt(x.amt)}\n`;
      });
      settle += `(మొత్తం: ${fmt(s.kalyanOwes)})\n`;
    } else {
      settle = `\n✓ అందరూ సమాన వాటా పూర్తి — ఎవరికీ ఎవరు డబ్బు ఇవ్వాల్సిన అవసరం లేదు 🙏\n`;
    }

    return `🙏 నమస్కారం అందరికీ,

నాన్నగారు *శ్రీ వెంకటేశ్వర రావు* — మల్లారెడ్డి ఆసుపత్రి ఖర్చుల సారాంశం.
మూడు కుమారులు కలిసి సమానంగా భాగస్వామ్యం చేస్తున్నాం 🙏

📅 ${date}
💚 మొత్తం ఖర్చు: *${fmt(t)}*
📊 ప్రతి ఒక్కరి వాటా (1/3): ${fmt(fair)}

*ఆసుపత్రిలో ఎవరు ఎంత చెల్లించారు:*
${paidLine("🙏 వెంకీ", v, s.extra.Venky)}
${paidLine("💛 దీప", d, s.extra.Deepa)}
${paidLine("💙 కల్యాణ్", k, s.extra.Kalyan)}
${settle}
పూర్తి వివరాలు:
https://tevskrishna.github.io/hospital-bills/

దయచేసి చూసి సరిగా అనిపిస్తే *OK* అని reply చేయండి 🙏
ఏ సందేహం ఉంటే కాల్ చేయండి.

— వెంకీ (శివాజీ)`;
  }

  function updateWaPreview() {
    const el = document.getElementById("waPreview");
    if (el) el.textContent = buildWaText();
  }

  function copyWhatsApp() {
    const text = buildWaText();
    haptic(10);
    navigator.clipboard.writeText(text).then(() => {
      FCAnalytics.track("whatsapp_copy");
      toast("Copied — warm message ready for WhatsApp!", "success");
      const cs = document.getElementById("copySuccess");
      if (cs) {
        cs.classList.add("show");
        setTimeout(() => cs.classList.remove("show"), 2500);
      }
    }).catch(() => prompt("Copy:", text));
  }

  FC.whatsapp = { buildWaText, updateWaPreview, copyWhatsApp };
  global.buildWaText = buildWaText;
  global.updateWaPreview = updateWaPreview;
  global.copyWhatsApp = copyWhatsApp;
})(typeof window !== "undefined" ? window : global);
