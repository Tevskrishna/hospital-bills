/**
 * FamilyCare — DOM rendering (v24)
 */
(function (global) {
  const FC = global.FC || (global.FC = {});
  const { esc, fmt, fmtDate, getGreeting, ringSvg, monthLabel, animateValue } = FC.utils;
  const SONS = FC.SONS;
  const PAGE_VERSION = FC.PAGE_VERSION;

  function shortDate(iso) {
    if (!iso || typeof iso !== "string") return "—";
    const [y, m, d] = iso.split("-");
    const en = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mi = +m - 1;
    if (mi < 0 || mi > 11) return iso;
    return `${+d} ${en[mi]}`;
  }

  function renderTxnTable(bills, caption) {
    if (!bills.length) return "";
    const whoIcon = { Venky: "🙏", Deepa: "💛", Kalyan: "💙" };
    const total = bills.reduce((s, b) => s + b.amt, 0);
    const rows = bills.map((b) => `
      <tr>
        <td class="col-date">${shortDate(b.d)}</td>
        <td class="col-name">${whoIcon[b.who] || ""} ${esc(b.who)}</td>
        <td class="col-amt">${fmt(b.amt)}</td>
        <td class="col-note">${esc(b.note || b.mode || "—")}</td>
      </tr>`).join("");
    return `
      ${caption ? `<div class="txn-table-caption">${caption}</div>` : ""}
      <div class="txn-table-wrap">
        <table class="txn-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2">Total · ${bills.length} payment${bills.length === 1 ? "" : "s"}</td>
              <td class="col-amt">${fmt(total)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>`;
  }

  function getFilteredBills() {
    const q = (global.billSearchQuery || "").toLowerCase();
    const whoFilter = global.billFilterWho || "all";
    return global.data.bills.filter((b) => {
      if (whoFilter !== "all" && b.who !== whoFilter) return false;
      if (!q) return true;
      return [b.who, b.note, b.mode, String(b.amt), b.d].some((f) => String(f || "").toLowerCase().includes(q));
    });
  }

  function initReveal() {
    if (!FC.state.revealObserver) {
      FC.state.revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              FC.state.revealObserver.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
      );
    }
    document.querySelectorAll(".reveal:not(.visible)").forEach((el) => FC.state.revealObserver.observe(el));
  }

  function renderCareBanner() {
    const cs = global.careStatus;
    const caution = cs.riskLevel === "caution";
    const banner = document.getElementById("careBanner");
    if (banner) banner.classList.toggle("care-banner--caution", caution);

    const disc = cs.expectedDischarge ? fmtDate(cs.expectedDischarge) : null;
    const dischargeHtml = disc
      ? `<div class="dv">${disc.split(" · ")[0]}<br><span style="font-size:0.75rem;opacity:0.85">${disc.split(" · ").slice(1).join(" · ")}</span></div>`
      : `<div class="dv dv-pending">Under review<br><span style="font-size:0.72rem;opacity:0.85">డాక్టర్ నిర్ణయం</span></div>`;

    banner.innerHTML = `
    <div class="cb-row">
      <div>
        <span class="cb-tag">${caution ? "● Caution · Still under risk" : "● Live · నాన్నగారి స్థితి"}</span>
        <h3>${esc(cs.condition)}</h3>
        <div class="cb-te">${esc(cs.conditionTe || "")}</div>
        <div class="cb-meta">${esc(global.meta.hospital)} · ${esc(cs.ward || "Ward")} · Updated ${fmtDate(cs.lastUpdate || global.meta.startDate)} by ${esc(cs.lastUpdateBy || "Venky")}</div>
        ${cs.dischargeNoteTe ? `<div class="cb-note">${esc(cs.dischargeNoteTe)}</div>` : ""}
      </div>
      <div class="cb-discharge">
        <div class="dl">${caution ? "Discharge<br>review" : "Expected discharge<br>డిశ్చార్జ్"}</div>
        ${dischargeHtml}
      </div>
    </div>`;
    FC.ui?.syncAdminStatusFields?.();
  }

  function renderCareTimeline() {
    const el = document.getElementById("careTimeline");
    if (!el) return;
    const items = [
      `Admitted ${fmtDate(global.meta.startDate)}`,
      global.careStatus.condition ? esc(global.careStatus.condition) : "",
      global.careStatus.expectedDischarge ? `Expected discharge ${fmtDate(global.careStatus.expectedDischarge)}` : "",
      global.careStatus.lastUpdate ? `Last update ${fmtDate(global.careStatus.lastUpdate)} by ${esc(global.careStatus.lastUpdateBy || "Venky")}` : "",
    ].filter(Boolean);
    el.innerHTML = `<h4>Health timeline</h4>${items.map((t) => `<div class="care-tl-item">${t}</div>`).join("")}`;
  }

  function renderBillsList() {
    const bills = getFilteredBills();
    const whoIcon = { Venky: "🙏", Deepa: "💛", Kalyan: "💙" };
    const byMonth = {};
    bills.forEach((b) => {
      const mk = b.d.slice(0, 7);
      (byMonth[mk] = byMonth[mk] || {})[b.d] = (byMonth[mk][b.d] || []).concat(b);
    });
    let html = "";
    Object.keys(byMonth).sort().reverse().forEach((mk) => {
      const days = byMonth[mk];
      const monthTotal = Object.values(days).flat().reduce((s, b) => s + b.amt, 0);
      html += `<div class="month-group"><div class="month-head"><span>${monthLabel(mk + "-01")}</span><span class="mh-amt">${fmt(monthTotal)}</span></div>`;
      Object.keys(days).sort().reverse().forEach((d) => {
        const dayBills = days[d];
        const dayT = dayBills.reduce((s, b) => s + b.amt, 0);
        html += `<div class="order-day-head" style="border-radius:12px;margin-bottom:8px;border:1px solid var(--card-border)"><span>${fmtDate(d)}</span><span class="day-amt">${fmt(dayT)}</span></div>`;
        dayBills.forEach((b, i) => {
          const tag = b.mode ? esc(b.mode) : "";
          const note = b.note ? esc(b.note) : "";
          const hasNote = !!(b.note && b.note.trim());
          const billIdx = global.data.bills.indexOf(b);
          const id = "tx-" + d.replace(/-/g, "") + "-" + i;
          html += `<div class="txn-card" id="${id}">
          <div class="tx-ic">${whoIcon[b.who] || "💰"}</div>
          <div class="tx-body">
            <div class="tx-top">
              <div class="tx-who">${esc(b.who)}</div>
              <div class="tx-amt">${fmt(b.amt)}</div>
            </div>
            <div class="tx-meta">${tag || "Hospital payment"} · ${fmtDate(d)}</div>
            ${hasNote ? `<div class="tx-note">${note}</div><button class="tx-toggle" onclick="toggleTxn('${id}')" aria-expanded="false">Show note</button>` : ""}
            <button type="button" class="tx-delete no-print" onclick="deleteBill(${billIdx})" aria-label="Delete bill">🗑 Delete</button>
          </div>
        </div>`;
        });
      });
      html += "</div>";
    });
    document.getElementById("dayTable").innerHTML = html || `<div class="empty-state"><div class="es-ic">🔍</div><p>${global.data.bills.length ? "No bills match your search" : "No bills yet — tap + to add"}</p>${!global.data.bills.length ? '<button class="qa-chip qa-primary" onclick="openAddModal()">Add bill</button>' : ""}</div>`;
  }

  function renderHomeSummary(total, venky, deepa, kalyan, fair) {
    const s = computeSettlement(total);
    const payers = [
      { ic: "🙏", nm: "Venky", am: venky, c: "#087016", pct: total ? Math.round((venky / total) * 100) : 0 },
      { ic: "💛", nm: "Deepa", am: deepa, c: "#c62828", pct: total ? Math.round((deepa / total) * 100) : 0 },
      { ic: "💙", nm: "Kalyan", am: kalyan, c: "#1565c0", pct: total ? Math.round((kalyan / total) * 100) : 0 },
    ];
    document.getElementById("homeRings").innerHTML = payers.map((p) => `
    <div class="ring-card">
      ${ringSvg(p.pct, p.c)}
      <div class="rn">${p.ic} ${p.nm}</div>
      <div class="ra" style="color:${p.c}">${fmt(p.am)}</div>
    </div>`).join("");

    const el = document.getElementById("homeSettle");
    if (!s.settlements.length) {
      el.innerHTML = `<div class="settle-te-big"><strong>✓ అందరూ సమానం</strong></div>`;
    } else {
      el.innerHTML = `
      <div class="settle-hero">
        <h3>🤝 Fair adjustment · సమన్యయం</h3>
        <div class="settle-flow">
          ${s.settlements.map((x) => `
            <div class="settle-arrow">
              <div class="from"><div class="n">${esc(x.from)}</div></div>
              <div class="mid"><div class="arr">→</div><div class="val">${fmt(x.amt)}</div></div>
              <div class="to"><div class="n">${esc(x.to)}</div></div>
            </div>`).join("")}
        </div>
        <div class="settle-total-box">
          <div class="lbl">Balance to settle</div>
          <div class="val">${fmt(s.settleTotal)}</div>
        </div>
      </div>
      <button class="home-link" onclick="showPage('share')">Full share card for family →</button>`;
    }

    const today = new Date().toISOString().slice(0, 10);
    const hasToday = global.data.bills.some((b) => b.d === today);
    const latestDay = global.data.bills.length
      ? (hasToday ? today : global.data.bills.map((b) => b.d).sort().pop())
      : null;
    const dayBills = latestDay
      ? global.data.bills.filter((b) => b.d === latestDay).sort((a, b) => b.amt - a.amt)
      : [];
    const dayTotal = dayBills.reduce((s, b) => s + b.amt, 0);
    const caption = latestDay
      ? `${fmtDate(latestDay).split(" · ")[0]} · ${dayBills.length} payment${dayBills.length === 1 ? "" : "s"} · ${fmt(dayTotal)}`
      : "";
    document.getElementById("homeActivity").innerHTML = dayBills.length
      ? renderTxnTable(dayBills.sort((a, b) => a.who.localeCompare(b.who) || b.amt - a.amt), caption)
      : `<div class="empty-state"><div class="es-ic">📋</div><p>No bills yet</p><button class="qa-chip qa-primary" onclick="openAddModal()">Add first bill</button></div>`;
  }

  function renderShareHub(total, venky, deepa, kalyan) {
    const s = computeSettlement(total);
    document.getElementById("shareFair").textContent = fmt(s.fair);

    const people = [
      { key: "Venky", branch: "Shivaji · శివాజీ", emoji: "🙏", color: "#0d9488", paid: venky, extra: s.extra.Venky },
      { key: "Deepa", branch: "Rajini · రజినీ", emoji: "💛", color: "#e11d48", paid: deepa, extra: s.extra.Deepa },
      { key: "Kalyan", branch: "కల్యాణ్", emoji: "💙", color: "#1d4ed8", paid: kalyan, extra: s.extra.Kalyan },
    ];

    document.getElementById("personGrid").innerHTML = people.map((p) => {
      const owes = p.extra < -0.01;
      const receives = p.extra > 0.01;
      const cls = owes ? "owe" : receives ? "receive" : "ok";
      let badge, badgeTe;
      if (owes) {
        badge = `Balance ${fmt(Math.abs(p.extra))}`;
        badgeTe = `సమన్యయం ${fmt(Math.abs(p.extra))}`;
      } else if (receives) {
        badge = `Credit ${fmt(p.extra)}`;
        badgeTe = `తిరిగి వస్తుంది ${fmt(p.extra)}`;
      } else {
        badge = "SETTLED ✓";
        badgeTe = "పూర్తి ✓";
      }
      return `
      <div class="person-card ${cls}" style="--pc:${p.color}">
        <div class="emoji">${p.emoji}</div>
        <div class="name">${p.key}</div>
        <div class="branch">${p.branch}</div>
        <div class="paid-lbl">Paid at hospital · ఆసుపత్రిలో</div>
        <div class="paid-amt">${fmt(p.paid)}</div>
        <div class="status-badge">${badge}<br><span style="font-size:0.62rem;opacity:0.9">${badgeTe}</span></div>
      </div>`;
    }).join("");

    const hero = document.getElementById("settleHero");
    if (s.settlements.length) {
      hero.innerHTML = `
      <div class="settle-hero">
        <h3>🤝 Fair adjustment · సమన్యయం</h3>
        <div class="settle-flow">
          ${s.settlements.map((x) => `
            <div class="settle-arrow">
              <div class="from"><div class="n">${x.from}</div><div class="t">${x.fromTe} → ${x.toTe}</div></div>
              <div class="mid"><div class="arr">→</div><div class="val">${fmt(x.amt)}</div></div>
              <div class="to"><div class="n">${x.to}</div><div class="t">తిరిగి వస్తుంది</div></div>
            </div>`).join("")}
        </div>
        <div class="settle-total-box">
          <div class="lbl">Balance to settle · సమన్యయం</div>
          <div class="val">${fmt(s.settleTotal)}</div>
        </div>
      </div>
      <div class="settle-te-big">
        <strong>ఈ చెల్లింపులు పూర్తైతే అందరికి సమాన వాటా అవుతుంది — ${fmt(s.settleTotal)}</strong><br>
        ${s.settlements.map((x) => `<strong>${x.from}</strong> → ${x.to}: ${fmt(x.amt)}`).join("<br>")}
      </div>`;
    } else {
      hero.innerHTML = `<div class="settle-te-big"><strong>✓ అందరూ సమానం — ఎవరికీ ఎవరు డబ్బు ఇవ్వాల్సిన అవసరం లేదు</strong></div>`;
    }

    document.getElementById("shareNote").innerHTML =
      `<strong>గమనిక:</strong> ఎవరు తక్కువ చెల్లించారో వారు ఎక్కువ చెల్లించిన వారికి తిరిగి ఇవ్వాలి — fair 1/3 share. శివాజీ→వెంకీ అడ్వాన్స్ (₹${totalAdv().toLocaleString("en-IN")}) వేరు.`;
  }

  function render() {
    const total = totalBills();
    const venky = sumWho("Venky");
    const deepa = sumWho("Deepa");
    const kalyan = sumWho("Kalyan");
    const adv = totalAdv();
    const amounts = { Venky: venky, Deepa: deepa, Kalyan: kalyan };
    const last = global.data.bills.map((b) => b.d).sort().pop() || global.meta.startDate;
    const fair = total / 3;

    document.getElementById("greeting").textContent = getGreeting();
    document.getElementById("greetingSub").textContent = "Three sons · fair share · family care";
    document.getElementById("homePatientName").textContent = global.meta.patient;
    document.getElementById("homeHospitalSub").textContent = global.meta.hospital + " · " + (global.careStatus.ward || "Ward");
    document.getElementById("topbarPatient").textContent = global.meta.patient;
    document.getElementById("topbarSub").textContent = global.meta.hospital + " · " + (global.careStatus.ward || "Ward");
    document.getElementById("todayLabel").textContent =
      "Till " + fmtDate(last).split(" · ")[0] + " · Fair 1/3 split · v" + PAGE_VERSION;

    document.getElementById("statusBar").textContent = `Updated till ${fmtDate(last)}`;

    renderCareBanner();
    renderCareTimeline();
    animateValue(document.getElementById("grandTotal"), total);
    animateValue(document.getElementById("todaySpend"), todayExpense(), 800);
    document.getElementById("fairShareHome").textContent = fmt(fair);
    document.getElementById("billCount").textContent = String(global.data.bills.length);

    document.getElementById("familyHub").innerHTML = `
    <div class="father-node">
      <div class="father-avatar">👴</div>
      <h3>${esc(global.meta.patient)}</h3>
      <p>Our Father · మా నాన్నగారు · ${esc(global.meta.hospital)}</p>
    </div>
    <div class="connector"></div>
    <div class="sons-row">
      ${SONS.map((s) => `
        <div class="son-pill" style="--c:${s.color}">
          <div class="dot" style="background:${s.color}"></div>
          <div class="sn">${s.te}</div>
          <div class="sp">${s.payer}</div>
          <div class="sa" style="color:${s.color}">${fmt(amounts[s.payer])}</div>
        </div>`).join("")}
    </div>`;

    document.getElementById("sonCards").innerHTML = SONS.map((s) => {
      const amt = amounts[s.payer];
      const pct = total ? Math.round((amt / total) * 100) : 0;
      return `
      <div class="card" style="--c:${s.color}">
        <div class="card-head">
          <div><div class="tag-sm">${s.branch}'s son</div><h3>${s.payer}</h3></div>
          <div class="amt" style="color:${s.color}">${fmt(amt)}</div>
        </div>
        <div class="bar-track"><div class="bar-fill" data-w="${pct}" style="width:0;background:linear-gradient(90deg,${s.color},${s.color}88)"></div></div>
        <div class="bar-meta"><span>Hospital paid</span><span>${pct}% of total</span></div>
      </div>`;
    }).join("");

    requestAnimationFrame(() => {
      setTimeout(() => {
        document.querySelectorAll(".bar-fill").forEach((b) => { b.style.width = b.dataset.w + "%"; });
      }, 200);
    });

    document.getElementById("shivajiCard").innerHTML = `
    <div class="sec-title" style="margin-bottom:12px"><h2 style="color:#fff">Shivaji → Venky</h2><p style="color:rgba(255,255,255,0.5)">Bill management advances</p></div>
    <div class="row"><span>Total advances</span><span class="hi">${fmt(adv)}</span></div>
    <div class="row"><span>Venky paid at hospital</span><span>${fmt(venky)}</span></div>
    <div class="row"><span>Balance with Venky</span><span class="hi" style="color:${adv - venky >= 0 ? "#86efac" : "#fca5a5"}">${fmt(adv - venky)}</span></div>`;

    const splits = computeSplit(total);
    const settle = computeSettlement(total);
    const payTo = {};
    settle.settlements.forEach((x) => {
      if (!payTo[x.from]) payTo[x.from] = [];
      payTo[x.from].push(`${fmt(x.amt)} → ${x.to}`);
    });
    const receiveFrom = {};
    settle.settlements.forEach((x) => {
      if (!receiveFrom[x.to]) receiveFrom[x.to] = [];
      receiveFrom[x.to].push(`${x.from}: ${fmt(x.amt)}`);
    });
    document.getElementById("splitCards").innerHTML = splits.map((s) => {
      const owe = s.remaining > 0.01;
      const credit = s.remaining < -0.01;
      const remL = owe ? "మిగిలింది" : credit ? "ఎక్కువ" : "పూర్తి";
      const remV = owe ? fmt(s.remaining) : credit ? fmt(Math.abs(s.remaining)) : "✓";
      const remC = owe ? "owe" : credit ? "credit" : "";
      const extra = s.payer === "Venky" ? `<p style="font-size:0.68rem;color:var(--muted);margin-top:10px">Advance ${fmt(adv)} · Balance ${fmt(adv - venky)}</p>` : "";
      const settleHint = payTo[s.payer]?.length
        ? `<p class="split-settle-hint owe-hint">Pay: ${payTo[s.payer].join(" · ")}</p>`
        : receiveFrom[s.payer]?.length
          ? `<p class="split-settle-hint receive-hint">Receive: ${receiveFrom[s.payer].join(" · ")}</p>`
          : "";
      return `
      <div class="card split-card" style="--c:${s.color}">
        <div class="card-head">
          <div><div class="tag-sm">Paid by ${s.payer}</div><h3>${s.te}</h3></div>
        </div>
        <div class="split-metrics">
          <div class="metric"><div class="ml">వాటా 1/3</div><div class="mv">${fmt(s.fair)}</div></div>
          <div class="metric"><div class="ml">చెల్లించారు</div><div class="mv">${fmt(s.paid)}</div></div>
          <div class="metric"><div class="ml">${remL}</div><div class="mv ${remC}">${remV}</div></div>
        </div>
        <div class="bar-track"><div class="bar-fill" data-w="${s.fulfillPct}" style="background:${s.color}"></div></div>
        <div class="bar-meta"><span>${s.fulfillPct}% fulfilled</span></div>
        ${extra}
        ${settleHint}
      </div>`;
    }).join("");

    setTimeout(() => {
      document.querySelectorAll("#splitCards .bar-fill").forEach((b) => { b.style.width = b.dataset.w + "%"; });
    }, 300);

    const totalOwe = splits.filter((s) => s.remaining > 0.01).reduce((a, s) => a + s.remaining, 0);
    document.getElementById("splitTotal").innerHTML = totalOwe > 0.01
      ? `మొత్తం ఇంకా చెల్లించాల్సినది: <strong>${fmt(totalOwe)}</strong>`
      : `వాటా పూర్తి · All shares met ✓`;

    renderBillsList();
    renderHomeSummary(total, venky, deepa, kalyan, fair);
    renderShareHub(total, venky, deepa, kalyan);
    updateWaPreview?.();

    initReveal();
  }

  FC.render = { render, renderBillsList, renderCareBanner, renderCareTimeline, renderHomeSummary, renderShareHub, initReveal, getFilteredBills };
  global.render = render;
})(typeof window !== "undefined" ? window : global);
