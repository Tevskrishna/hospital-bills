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

  function isoToday() {
    return new Date().toISOString().slice(0, 10);
  }

  function shortDayLabel(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    const en = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${+d} ${en[+m - 1]}`;
  }

  /** Prefer today; if no bills today, use latest bill date */
  function dayFocusBills() {
    const bills = global.data?.bills || [];
    const today = isoToday();
    const todayBills = bills.filter((b) => b.d === today);
    if (todayBills.length) return { day: today, bills: todayBills, isToday: true };
    if (!bills.length) return { day: today, bills: [], isToday: true };
    const day = bills.map((b) => b.d).sort().pop();
    return { day, bills: bills.filter((b) => b.d === day), isToday: false };
  }

  function buildDaySection() {
    const { day, bills, isToday } = dayFocusBills();
    const label = isToday ? `Today (${shortDayLabel(day)})` : `Latest day (${shortDayLabel(day)})`;
    if (!bills.length) return `${label}: no payments yet`;

    const dayTotal = bills.reduce((s, b) => s + b.amt, 0);
    const byWho = {};
    bills.forEach((b) => {
      if (!byWho[b.who]) byWho[b.who] = [];
      byWho[b.who].push(b);
    });
    const order = ["Venky", "Deepa", "Kalyan"];
    const lines = order
      .filter((w) => byWho[w])
      .map((w) => {
        const rows = byWho[w];
        const sub = rows.reduce((s, b) => s + b.amt, 0);
        const detail = rows
          .map((b) => (b.note ? `${b.note} ${waShort(b.amt)}` : waShort(b.amt)))
          .join(", ");
        return `${w} ${waShort(sub)} — ${detail}`;
      });

    return `${label}: ${fmt(dayTotal)} · ${bills.length} payment${bills.length === 1 ? "" : "s"}
${lines.join("\n")}`;
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

${buildDaySection()}

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

  FC.whatsapp = { buildWaText, updateWaPreview, copyWhatsApp, waShort, buildDaySection, dayFocusBills };
  global.buildWaText = buildWaText;
  global.updateWaPreview = updateWaPreview;
  global.copyWhatsApp = copyWhatsApp;
})(typeof window !== "undefined" ? window : global);
