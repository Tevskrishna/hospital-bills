/**
 * FamilyCare — WhatsApp share (compact family summary)
 */
(function (global) {
  const FC = global.FC || (global.FC = {});
  const { fmt } = FC.utils;

  /** Round to whole rupees for a cleaner WhatsApp read */
  function waShort(amt) {
    return "₹" + Math.round(amt).toLocaleString("en-IN");
  }

  function buildWaText() {
    const t = totalBills();
    const v = sumWho("Venky");
    const d = sumWho("Deepa");
    const k = sumWho("Kalyan");
    const fair = t / 3;
    const s = computeSettlement(t);
    const patient = global.meta?.patient || "Sri Venkateswara Rao";
    const hospital = global.meta?.hospital || "Mallareddy Hospital";
    const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    let settle = "";
    if (s.settlements.length) {
      settle = "\nSettle:\n" + s.settlements.map((x) => `${x.from} → ${x.to} ${waShort(x.amt)}`).join("\n");
    } else {
      settle = "\n✓ All balanced — no payments needed between sons";
    }

    return `🙏 Hospital bills — ${patient}
${hospital} · ${date}
Total: ${fmt(t)} | Fair share each: ${fmt(fair)}

Venky ${waShort(v)} | Deepa ${waShort(d)} | Kalyan ${waShort(k)}${settle}

Details: https://tevskrishna.github.io/hospital-bills/
Reply OK if correct 🙏`;
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
      toast("Copied — ready to paste in WhatsApp!", "success");
      const cs = document.getElementById("copySuccess");
      if (cs) {
        cs.classList.add("show");
        setTimeout(() => cs.classList.remove("show"), 2500);
      }
    }).catch(() => prompt("Copy:", text));
  }

  FC.whatsapp = { buildWaText, updateWaPreview, copyWhatsApp, waShort };
  global.buildWaText = buildWaText;
  global.updateWaPreview = updateWaPreview;
  global.copyWhatsApp = copyWhatsApp;
})(typeof window !== "undefined" ? window : global);
