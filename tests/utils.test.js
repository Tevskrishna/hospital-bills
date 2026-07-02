const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { esc, fmt, fmtDate, safeParseJson, friendlySyncError } = require("../js/utils.js");

describe("utils", () => {
  it("esc escapes HTML", () => {
    assert.equal(esc('<script>"'), "&lt;script&gt;&quot;");
  });

  it("fmt formats INR", () => {
    assert.match(fmt(1234.5), /₹1,234\.50/);
  });

  it("fmtDate handles invalid input", () => {
    assert.equal(fmtDate(""), "—");
    assert.equal(fmtDate("2026-06-28"), "28 జూన్ · 28 Jun 2026");
  });

  it("safeParseJson returns fallback on corrupt JSON", () => {
    assert.deepEqual(safeParseJson("{bad", { x: 1 }), { x: 1 });
    assert.deepEqual(safeParseJson('{"a":1}', {}), { a: 1 });
  });

  it("friendlySyncError never exposes raw GitHub message", () => {
    const msg = friendlySyncError({ ok: false, error: "Bad credentials" });
    assert.ok(!msg.includes("Bad credentials"));
    assert.match(msg, /token/i);
  });

  it("friendlySyncError handles offline and rate limit", () => {
    assert.match(friendlySyncError({ offline: true }), /phone/i);
    assert.match(friendlySyncError({ ok: false, error: "API rate limit exceeded" }), /wait/i);
    assert.equal(friendlySyncError({ ok: true }), "");
  });
});
