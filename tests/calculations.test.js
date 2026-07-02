/**
 * @vitest-environment node
 * Settlement & fair-share regression tests — logic frozen v1–v24
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

  it("Kalyan owes Venky when Venky paid most extra", () => {
    const bills = [
      { d: "2026-06-28", who: "Venky", amt: 50000, mode: "", note: "" },
      { d: "2026-06-29", who: "Deepa", amt: 10000, mode: "", note: "" },
      { d: "2026-06-30", who: "Kalyan", amt: 10000, mode: "", note: "" },
    ];
    const s = computeSettlementFromBills(bills);
    assert.ok(s.kalyanOwes > 0);
    assert.equal(s.settlements.length, 1);
    assert.equal(s.settlements[0].from, "Kalyan");
    assert.equal(s.settlements[0].to, "Venky");
  });

  it("Venky never pays Deepa — no cross-settlement between them", () => {
    const bills = [
      { d: "2026-06-28", who: "Venky", amt: 10000, mode: "", note: "" },
      { d: "2026-06-29", who: "Deepa", amt: 40000, mode: "", note: "" },
      { d: "2026-06-30", who: "Kalyan", amt: 10000, mode: "", note: "" },
    ];
    const s = computeSettlementFromBills(bills);
    s.settlements.forEach((x) => {
      const pair = [x.from, x.to].sort().join("-");
      assert.notEqual(pair, "Deepa-Venky", "Venky must never pay Deepa directly");
      assert.notEqual(pair, "Venky-Deepa", "Venky must never pay Deepa directly");
    });
  });

  it("balanced payments yield no settlements", () => {
    const bills = [
      { d: "2026-06-28", who: "Venky", amt: 20000, mode: "", note: "" },
      { d: "2026-06-29", who: "Deepa", amt: 20000, mode: "", note: "" },
      { d: "2026-06-30", who: "Kalyan", amt: 20000, mode: "", note: "" },
    ];
    const s = computeSettlementFromBills(bills);
    assert.equal(s.settlements.length, 0);
    assert.ok(s.kalyanOwes < 0.02);
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
    assert.ok(s.settlements.length <= 1);
  });

  it("Kalyan pays creditors in descending credit order", () => {
    const bills = [
      { d: "2026-06-28", who: "Venky", amt: 30000, mode: "", note: "" },
      { d: "2026-06-29", who: "Deepa", amt: 30000, mode: "", note: "" },
      { d: "2026-06-30", who: "Kalyan", amt: 0, mode: "", note: "" },
    ];
    const s = computeSettlementFromBills(bills);
    assert.equal(s.settlements.length, 2);
    assert.equal(s.settlements[0].to, "Deepa");
    assert.equal(s.settlements[1].to, "Venky");
  });
});
