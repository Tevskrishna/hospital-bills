/**
 * FamilyCare — financial calculations (v24)
 * BUSINESS LOGIC FROZEN — identical to v1–v23 settlement rules.
 */
(function (global) {
  const FC = global.FC || (global.FC = {});
  const EPS = FC.SETTLEMENT_EPSILON || 0.01;
  const SONS = FC.SONS;

  function sumWhoBills(bills, who) {
    return bills.filter((b) => b.who === who).reduce((s, b) => s + b.amt, 0);
  }

  function totalBillsFrom(bills) {
    return bills.reduce((s, b) => s + b.amt, 0);
  }

  function totalAdvFrom(advances) {
    return advances.reduce((s, a) => s + a.amt, 0);
  }

  function computeSplitFromBills(bills, sons) {
    const total = totalBillsFrom(bills);
    const fair = total / 3;
    const paid = {
      Venky: sumWhoBills(bills, "Venky"),
      Deepa: sumWhoBills(bills, "Deepa"),
      Kalyan: sumWhoBills(bills, "Kalyan"),
    };
    return sons.map((s) => {
      const p = paid[s.payer];
      const remaining = fair - p;
      const fulfillPct = fair > 0 ? Math.min(100, Math.round((p / fair) * 100)) : 0;
      return { ...s, fair, paid: p, remaining, fulfillPct };
    });
  }

  function computeSettlementFromBills(bills) {
    const total = totalBillsFrom(bills);
    const fair = total / 3;
    const paid = {
      Venky: sumWhoBills(bills, "Venky"),
      Deepa: sumWhoBills(bills, "Deepa"),
      Kalyan: sumWhoBills(bills, "Kalyan"),
    };
    const extra = {
      Venky: paid.Venky - fair,
      Deepa: paid.Deepa - fair,
      Kalyan: paid.Kalyan - fair,
    };
    const remaining = {
      Venky: fair - paid.Venky,
      Deepa: fair - paid.Deepa,
      Kalyan: fair - paid.Kalyan,
    };
    const PAYER_TE = { Venky: "వెంకీ", Deepa: "దీప", Kalyan: "కల్యాణ్" };

    const creditors = Object.keys(paid)
      .filter((w) => extra[w] > EPS)
      .map((w) => ({ who: w, amt: extra[w] }))
      .sort((a, b) => b.amt - a.amt);
    const debtors = Object.keys(paid)
      .filter((w) => extra[w] < -EPS)
      .map((w) => ({ who: w, amt: -extra[w] }))
      .sort((a, b) => b.amt - a.amt);

    const settlements = [];
    const cred = creditors.map((c) => ({ ...c }));
    const debt = debtors.map((d) => ({ ...d }));
    let ci = 0;
    let di = 0;
    while (ci < cred.length && di < debt.length) {
      const pay = Math.min(cred[ci].amt, debt[di].amt);
      if (pay > EPS) {
        settlements.push({
          from: debt[di].who,
          fromTe: PAYER_TE[debt[di].who],
          to: cred[ci].who,
          toTe: PAYER_TE[cred[ci].who],
          amt: pay,
        });
        cred[ci].amt -= pay;
        debt[di].amt -= pay;
        if (cred[ci].amt < EPS) ci++;
        if (debt[di].amt < EPS) di++;
      } else break;
    }

    const settleTotal = settlements.reduce((s, x) => s + x.amt, 0);
    return {
      fair,
      paid,
      extra,
      remaining,
      settlements,
      settleTotal,
      kalyanOwes: Math.max(0, remaining.Kalyan),
    };
  }

  /* Browser wrappers — use global data (unchanged behaviour) */
  function sumWho(w) {
    return sumWhoBills(global.data.bills, w);
  }
  function totalBills() {
    return totalBillsFrom(global.data.bills);
  }
  function totalAdv() {
    return totalAdvFrom(global.data.advances);
  }
  function todayExpense() {
    const today = new Date().toISOString().slice(0, 10);
    return global.data.bills.filter((b) => b.d === today).reduce((s, b) => s + b.amt, 0);
  }
  function computeSplit(total) {
    return computeSplitFromBills(global.data.bills, SONS);
  }
  function computeSettlement(total) {
    return computeSettlementFromBills(global.data.bills);
  }

  FC.calc = {
    sumWhoBills,
    totalBillsFrom,
    totalAdvFrom,
    computeSplitFromBills,
    computeSettlementFromBills,
    sumWho,
    totalBills,
    totalAdv,
    todayExpense,
    computeSplit,
    computeSettlement,
  };

  global.sumWho = sumWho;
  global.totalBills = totalBills;
  global.totalAdv = totalAdv;
  global.todayExpense = todayExpense;
  global.computeSplit = computeSplit;
  global.computeSettlement = computeSettlement;

  if (typeof module !== "undefined") {
    module.exports = {
      sumWhoBills,
      totalBillsFrom,
      totalAdvFrom,
      computeSplitFromBills,
      computeSettlementFromBills,
      SONS,
    };
  }
})(typeof window !== "undefined" ? window : global);
