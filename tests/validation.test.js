const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

/* Minimal FC stub for validation module */
global.FC = {
  PAYERS: ["Venky", "Deepa", "Kalyan"],
  DEFAULT_META: { patient: "Test", hospital: "H", startDate: "2026-06-28" },
};
require("../js/validation.js");
const {
  validateBill,
  validateAdvance,
  isDuplicateBill,
  sanitizeBillRow,
  sanitizeAdvanceRow,
  normalizeApiJson,
  isValidIsoDate,
  isFutureDate,
} = require("../js/validation.js");

describe("validation", () => {
  it("accepts valid bill", () => {
    const r = validateBill({ d: "2026-06-28", who: "Venky", amt: "1500", mode: "Cash", note: "Lab" });
    assert.equal(r.ok, true);
    assert.equal(r.bill.amt, 1500);
  });

  it("rejects future date", () => {
    const r = validateBill({ d: "2099-12-31", who: "Venky", amt: "100", mode: "", note: "" });
    assert.equal(r.ok, false);
  });

  it("rejects negative amount", () => {
    const r = validateBill({ d: "2026-06-28", who: "Venky", amt: "-5", mode: "", note: "" });
    assert.equal(r.ok, false);
  });

  it("rejects invalid payer", () => {
    const r = validateBill({ d: "2026-06-28", who: "Shivaji", amt: "100", mode: "", note: "" });
    assert.equal(r.ok, false);
  });

  it("detects duplicate bills", () => {
    const bill = { d: "2026-06-28", who: "Venky", amt: 100, note: "" };
    assert.equal(isDuplicateBill([bill], { ...bill }), true);
    assert.equal(isDuplicateBill([bill], { ...bill, note: "Medicine" }), true);
    assert.equal(isDuplicateBill([bill], { ...bill, amt: 200 }), false);
  });

  it("normalizes corrupt API JSON safely", () => {
    const norm = normalizeApiJson({
      patient: "P",
      bills: [{ d: "bad", who: "Venky", amt: 10 }, { d: "2026-06-28", who: "Venky", amt: 100 }],
      advances: [{ d: "2026-06-28", amt: 500 }],
    });
    assert.equal(norm.bills.length, 1);
    assert.equal(norm.advances.length, 1);
  });

  it("validateAdvance requires positive amount", () => {
    assert.equal(validateAdvance({ d: "2026-06-28", amt: "0" }).ok, false);
    assert.equal(validateAdvance({ d: "2026-06-28", amt: "5000" }).ok, true);
  });

  it("sanitizeBillRow rejects invalid rows", () => {
    assert.equal(sanitizeBillRow(null), null);
    assert.equal(sanitizeBillRow({ d: "2026-06-28", who: "X", amt: 10 }), null);
    const ok = sanitizeBillRow({ d: "2026-06-28", who: "Venky", amt: "100.5", note: "x".repeat(600) });
    assert.equal(ok.amt, 100.5);
    assert.ok(ok.note.length <= 500);
  });

  it("sanitizeAdvanceRow validates shape", () => {
    assert.equal(sanitizeAdvanceRow({ d: "2026-06-28", amt: -1 }), null);
    assert.deepEqual(sanitizeAdvanceRow({ d: "2026-06-28", amt: 100 }), { d: "2026-06-28", amt: 100 });
  });

  it("isValidIsoDate validates calendar dates", () => {
    assert.equal(isValidIsoDate("2026-06-28"), true);
    assert.equal(isValidIsoDate("2026-13-01"), false);
    assert.equal(isFutureDate("2099-01-01"), true);
  });
});
