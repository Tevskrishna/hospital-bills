const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");

function mockLocalStorage() {
  const store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
}

function loadSync() {
  ["../js/config.js", "../js/utils.js", "../js/validation.js", "../js/storage.js", "../js/sync.js"].forEach((p) => {
    delete require.cache[require.resolve(p)];
  });
  global.localStorage = mockLocalStorage();
  require("../js/config.js");
  require("../js/utils.js");
  global.FC.utils = require("../js/utils.js");
  require("../js/validation.js");
  global.FC.validation = require("../js/validation.js");
  require("../js/storage.js");
  global.FC.storage = require("../js/storage.js");
  global.meta = { patient: "P", hospital: "H", startDate: "2026-06-28" };
  global.data = { bills: [{ d: "2026-06-28", who: "Venky", amt: 100, mode: "", note: "" }], advances: [] };
  global.careStatus = { ward: "General Ward" };
  require("../js/sync.js");
  return require("../js/sync.js");
}

describe("sync helpers", () => {
  beforeEach(() => {
    global.localStorage = mockLocalStorage();
  });

  it("jsonToBase64 encodes UTF-8 JSON", () => {
    const { jsonToBase64 } = loadSync();
    const b64 = jsonToBase64('{"telugu":"నమస్కారం"}');
    const decoded = new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)));
    assert.equal(decoded, '{"telugu":"నమస్కారం"}');
  });

  it("buildPayload includes frozen sons structure", () => {
    const { buildPayload } = loadSync();
    const p = buildPayload();
    assert.equal(p.sons.length, 3);
    assert.equal(p.bills.length, 1);
    assert.equal(p.patient, "P");
    assert.ok(p.careStatus);
  });

  it("mergeLocalStorage adds pending bills without duplicates", () => {
    const { mergeLocalStorage } = loadSync();
    localStorage.setItem(
      "hospitalBillsLocal",
      JSON.stringify({
        pendingBills: [
          { d: "2026-06-28", who: "Venky", amt: 100, note: "" },
          { d: "2026-06-29", who: "Deepa", amt: 50, note: "" },
        ],
      })
    );
    mergeLocalStorage();
    assert.equal(global.data.bills.length, 2);
    mergeLocalStorage();
    assert.equal(global.data.bills.length, 2);
  });

  it("applyJson sanitizes invalid bill rows", () => {
    const { applyJson } = loadSync();
    applyJson({
      patient: "X",
      hospital: "Y",
      startDate: "2026-06-28",
      bills: [{ d: "bad", who: "Venky", amt: 10 }, { d: "2026-06-28", who: "Deepa", amt: 200, mode: "", note: "" }],
      advances: [{ d: "2026-06-28", amt: 500 }],
    });
    assert.equal(global.data.bills.length, 1);
    assert.equal(global.data.bills[0].who, "Deepa");
    assert.equal(global.data.advances.length, 1);
  });

  it("cloudPost returns offline without apiUrl", async () => {
    const { cloudPost } = loadSync();
    global.FC.CONFIG.apiUrl = "";
    const r = await cloudPost("importAll", { bills: [] });
    assert.equal(r.offline, true);
  });

  it("pushAllToCloud returns offline when unconfigured", async () => {
    const { pushAllToCloud } = loadSync();
    global.FC.CONFIG.apiUrl = "";
    global.FC.CONFIG.githubToken = "";
    const r = await pushAllToCloud();
    assert.equal(r.offline, true);
  });
});
