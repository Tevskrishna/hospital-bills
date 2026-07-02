/**
 * FamilyCare — input & data validation (v24)
 * Does not alter settlement rules — only guards data shape.
 */
(function (global) {
  const FC = global.FC || (global.FC = {});
  const { PAYERS } = FC;

  const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

  function isValidIsoDate(d) {
    if (!ISO_DATE.test(d)) return false;
    const t = new Date(d + "T12:00:00");
    return !isNaN(t.getTime()) && t.toISOString().slice(0, 10) === d;
  }

  function isFutureDate(d) {
    return d > new Date().toISOString().slice(0, 10);
  }

  function validateBill({ d, who, amt, mode, note }) {
    if (!d || !isValidIsoDate(d)) return { ok: false, error: "Please enter a valid date." };
    if (isFutureDate(d)) return { ok: false, error: "Date cannot be in the future." };
    if (!who || !PAYERS.includes(who)) return { ok: false, error: "Please select who paid." };
    const amount = parseFloat(amt);
    if (!Number.isFinite(amount) || amount <= 0) return { ok: false, error: "Amount must be greater than zero." };
    if (amount > 10000000) return { ok: false, error: "Amount seems too large — please check." };
    if (note && String(note).length > 500) return { ok: false, error: "Note is too long (max 500 characters)." };
    if (mode && String(mode).length > 50) return { ok: false, error: "Payment type is too long." };
    return { ok: true, bill: { d, who, amt: amount, mode: mode || "", note: String(note || "").trim() } };
  }

  function validateAdvance({ d, amt }) {
    if (!d || !isValidIsoDate(d)) return { ok: false, error: "Please enter a valid date." };
    const amount = parseFloat(amt);
    if (!Number.isFinite(amount) || amount <= 0) return { ok: false, error: "Advance amount must be greater than zero." };
    return { ok: true, advance: { d, amt: amount } };
  }

  function isDuplicateBill(bills, bill) {
    return bills.some(
      (b) => b.d === bill.d && b.who === bill.who && Math.abs(b.amt - bill.amt) < 0.001 && (b.note || "") === (bill.note || "")
    );
  }

  function sanitizeBillRow(b) {
    if (!b || typeof b !== "object") return null;
    const who = PAYERS.includes(b.who) ? b.who : null;
    const amt = parseFloat(b.amt);
    const d = typeof b.d === "string" && isValidIsoDate(b.d) ? b.d : null;
    if (!who || !d || !Number.isFinite(amt) || amt <= 0) return null;
    return { d, who, amt, mode: String(b.mode || ""), note: String(b.note || "").slice(0, 500) };
  }

  function sanitizeAdvanceRow(a) {
    if (!a || typeof a !== "object") return null;
    const amt = parseFloat(a.amt);
    const d = typeof a.d === "string" && isValidIsoDate(a.d) ? a.d : null;
    if (!d || !Number.isFinite(amt) || amt <= 0) return null;
    return { d, amt };
  }

  function normalizeApiJson(json) {
    if (!json || typeof json !== "object") return null;
    const bills = Array.isArray(json.bills) ? json.bills.map(sanitizeBillRow).filter(Boolean) : [];
    const advances = Array.isArray(json.advances) ? json.advances.map(sanitizeAdvanceRow).filter(Boolean) : [];
    return {
      patient: String(json.patient || FC.DEFAULT_META.patient).slice(0, 200),
      hospital: String(json.hospital || FC.DEFAULT_META.hospital).slice(0, 200),
      startDate: isValidIsoDate(json.startDate) ? json.startDate : FC.DEFAULT_META.startDate,
      bills,
      advances,
      careStatus: json.careStatus && typeof json.careStatus === "object" ? json.careStatus : undefined,
    };
  }

  FC.validation = {
    isValidIsoDate,
    isFutureDate,
    validateBill,
    validateAdvance,
    isDuplicateBill,
    sanitizeBillRow,
    sanitizeAdvanceRow,
    normalizeApiJson,
  };

  if (typeof module !== "undefined") {
    module.exports = {
      isValidIsoDate,
      isFutureDate,
      validateBill,
      validateAdvance,
      isDuplicateBill,
      sanitizeBillRow,
      sanitizeAdvanceRow,
      normalizeApiJson,
      PAYERS,
    };
  }
})(typeof window !== "undefined" ? window : global);
