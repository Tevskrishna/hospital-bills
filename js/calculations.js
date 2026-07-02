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
    const settlements = [];
    const kalyanOwes = Math.max(0, fair - paid.Kalyan);
    if (kalyanOwes > EPS) {
      const creditors = [
        { who: "Deepa", te: "దీప", amt: extra.Deepa },
        { who: "Venky", te: "వెంకీ", amt: extra.Venky },
      ]
        .filter((c) => c.amt > EPS)
        .sort((a, b) => b.amt - a.amt);
      let left = kalyanOwes;
      creditors.forEach((c) => {
        const pay = Math.min(left, c.amt);
        if (pay > EPS) {
          settlements.push({
            from: "Kalyan",
            fromTe: "కల్యాణ్",
            to: c.who,
            toTe: c.te,
            amt: pay,
            why: c.who === "Deepa" ? "Deepa paid the most extra" : "Venky paid a little extra",
          });
          left -= pay;
        }
      });
    }
    return { fair, paid, extra, settlements, kalyanOwes };
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
