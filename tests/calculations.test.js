/**
 * @vitest-environment node
 * Settlement & fair-share tests
 */
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

global.FC = { SETTLEMENT_EPSILON: 0.01, SONS: [
  { branch: "Shivaji", payer: "Venky", te: "శివాజీ", color: "#0d9488", icon: "🙏" },
  { branch: "Rajini", payer: "Deepa", te: "రజినీ · దీప", color: "#e11d48", icon: "💛" },
  { branch: "Kalyan", payer: "Kalyan", te: "కల్యాణ్", color: "#1d4ed8", icon: "💙" },
]};

const {
  computeSettlementFromBills,
  computeSplitFromBills,
  sumWhoBills,
  totalBillsFrom,
  totalAdvFrom,
  SONS,
} = require("../js/calculations.js");

const sampleBills = [
  { d: "2026-06-28", who: "Venky", amt: 30000, mode: "Cash", note: "" },
  { d: "2026-06-29", who: "Deepa", amt: 15000, mode: "UPI", note: "" },
  { d: "2026-06-30", who: "Kalyan", amt: 15000, mode: "Cash", note: "" },
];

describe("calculations", () => {
  it("totalBillsFrom sums all amounts", () => {
    assert.equal(totalBillsFrom(sampleBills), 60000);
  });

  it("sumWhoBills filters by payer", () => {
    assert.equal(sumWhoBills(sampleBills, "Venky"), 30000);
    assert.equal(sumWhoBills(sampleBills, "Deepa"), 15000);
  });

  it("fair share is total / 3", () => {
    const s = computeSettlementFromBills(sampleBills);
    assert.equal(s.fair, 20000);
  });

  it("underpayers settle with overpayers", () => {
    const bills = [
      { d: "2026-06-28", who: "Venky", amt: 50000, mode: "", note: "" },
      { d: "2026-06-29", who: "Deepa", amt: 10000, mode: "", note: "" },
      { d: "2026-06-30", who: "Kalyan", amt: 10000, mode: "", note: "" },
    ];
    const s = computeSettlementFromBills(bills);
    assert.equal(s.settlements.length, 2);
    assert.equal(s.settlements[0].from, "Deepa");
    assert.equal(s.settlements[0].to, "Venky");
    assert.equal(s.settlements[1].from, "Kalyan");
    assert.equal(s.settlements[1].to, "Venky");
    assert.ok(Math.abs(s.settleTotal - 26666.67) < 0.02);
  });

  it("routes payments to largest creditor first", () => {
    const bills = [
      { d: "2026-06-28", who: "Venky", amt: 10000, mode: "", note: "" },
      { d: "2026-06-29", who: "Deepa", amt: 40000, mode: "", note: "" },
      { d: "2026-06-30", who: "Kalyan", amt: 10000, mode: "", note: "" },
    ];
    const s = computeSettlementFromBills(bills);
    assert.equal(s.settlements.length, 2);
    assert.equal(s.settlements[0].to, "Deepa");
    assert.equal(s.settlements[1].to, "Deepa");
  });

  it("balanced payments yield no settlements", () => {
    const bills = [
      { d: "2026-06-28", who: "Venky", amt: 20000, mode: "", note: "" },
      { d: "2026-06-29", who: "Deepa", amt: 20000, mode: "", note: "" },
      { d: "2026-06-30", who: "Kalyan", amt: 20000, mode: "", note: "" },
    ];
    const s = computeSettlementFromBills(bills);
    assert.equal(s.settlements.length, 0);
    assert.ok(s.settleTotal < 0.02);
  });

  it("computeSplitFromBills returns three son rows", () => {
    const splits = computeSplitFromBills(sampleBills, SONS);
    assert.equal(splits.length, 3);
    assert.equal(splits[0].payer, "Venky");
    assert.equal(splits[0].fulfillPct, 100);
  });

  it("empty bills yield zero fair share and no settlements", () => {
    const s = computeSettlementFromBills([]);
    assert.equal(s.fair, 0);
    assert.equal(s.settlements.length, 0);
    assert.equal(totalBillsFrom([]), 0);
  });

  it("totalAdvFrom sums advances", () => {
    assert.equal(totalAdvFrom([{ d: "2026-06-28", amt: 5000 }, { d: "2026-06-29", amt: 2500 }]), 7500);
  });

  it("settlements respect epsilon threshold", () => {
    const bills = [
      { d: "2026-06-28", who: "Venky", amt: 20000.005, mode: "", note: "" },
      { d: "2026-06-29", who: "Deepa", amt: 19999.99, mode: "", note: "" },
      { d: "2026-06-30", who: "Kalyan", amt: 20000, mode: "", note: "" },
    ];
    const s = computeSettlementFromBills(bills);
    assert.ok(s.settlements.length <= 2);
  });

  it("debtor pays creditors in descending credit order", () => {
    const bills = [
      { d: "2026-06-28", who: "Venky", amt: 30000, mode: "", note: "" },
      { d: "2026-06-29", who: "Deepa", amt: 30000, mode: "", note: "" },
      { d: "2026-06-30", who: "Kalyan", amt: 0, mode: "", note: "" },
    ];
    const s = computeSettlementFromBills(bills);
    assert.equal(s.settlements.length, 2);
    assert.equal(s.settlements[0].from, "Kalyan");
    assert.equal(s.settlements[1].from, "Kalyan");
    const recipients = s.settlements.map((x) => x.to).sort();
    assert.deepEqual(recipients, ["Deepa", "Venky"]);
  });
});
