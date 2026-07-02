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

function loadStorage() {
  delete require.cache[require.resolve("../js/utils.js")];
  delete require.cache[require.resolve("../js/storage.js")];
  global.FC = { LS_KEY: "hospitalBillsLocal" };
  require("../js/utils.js");
  global.FC.utils = require("../js/utils.js");
  require("../js/storage.js");
  return require("../js/storage.js");
}

describe("storage", () => {
  beforeEach(() => {
    global.localStorage = mockLocalStorage();
  });

  it("getLocalPending returns empty object when missing", () => {
    const s = loadStorage();
    assert.deepEqual(s.getLocalPending(), {});
  });

  it("getLocalPending returns empty object on corrupt JSON", () => {
    localStorage.setItem("hospitalBillsLocal", "{not json");
    const s = loadStorage();
    assert.deepEqual(s.getLocalPending(), {});
  });

  it("saveLocalPending merges patches", () => {
    const s = loadStorage();
    s.saveLocalPending({ pendingBills: [{ d: "2026-06-28", who: "Venky", amt: 100 }] });
    s.saveLocalPending({ careStatus: { condition: "Stable" } });
    const p = s.getLocalPending();
    assert.equal(p.pendingBills.length, 1);
    assert.equal(p.careStatus.condition, "Stable");
  });

  it("clearLocalPending removes key", () => {
    const s = loadStorage();
    s.saveLocalPending({ pendingBills: [] });
    s.clearLocalPending();
    assert.equal(localStorage.getItem("hospitalBillsLocal"), null);
  });

  it("cacheSnapshot and loadCachedSnapshot round-trip", () => {
    const s = loadStorage();
    const payload = { patient: "P", bills: [{ d: "2026-06-28", who: "Venky", amt: 1 }] };
    s.cacheSnapshot(payload);
    assert.deepEqual(s.loadCachedSnapshot(), payload);
  });

  it("loadCachedSnapshot returns null on corrupt cache", () => {
    localStorage.setItem("hospitalBillsLocal_cache", "{bad");
    const s = loadStorage();
    assert.equal(s.loadCachedSnapshot(), null);
  });
});
