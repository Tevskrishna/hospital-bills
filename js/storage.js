/**
 * FamilyCare — localStorage persistence (v24)
 */
(function (global) {
  const FC = global.FC || (global.FC = {});
  const LS_KEY = FC.LS_KEY;

  function getLocalPending() {
    return FC.utils.safeParseJson(localStorage.getItem(LS_KEY), {});
  }

  function saveLocalPending(patch) {
    const cur = getLocalPending();
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ ...cur, ...patch }));
      FC.sync?.updateSyncUI?.();
    } catch {
      FC.ui?.toast?.("Storage full — free space on phone and try again.");
    }
  }

  function clearLocalPending() {
    try {
      localStorage.removeItem(LS_KEY);
    } catch (e) { /* ignore */ }
    FC.sync?.updateSyncUI?.();
  }

  function cacheSnapshot(payload) {
    try {
      localStorage.setItem(LS_KEY + "_cache", JSON.stringify(payload));
    } catch (e) { /* ignore */ }
  }

  function loadCachedSnapshot() {
    return FC.utils.safeParseJson(localStorage.getItem(LS_KEY + "_cache"), null);
  }

  FC.storage = { getLocalPending, saveLocalPending, clearLocalPending, cacheSnapshot, loadCachedSnapshot };
  global.getLocalPending = getLocalPending;
  global.saveLocalPending = saveLocalPending;
  global.clearLocalPending = clearLocalPending;

  if (typeof module !== "undefined") {
    module.exports = {
      getLocalPending,
      saveLocalPending,
      clearLocalPending,
      cacheSnapshot,
      loadCachedSnapshot,
    };
  }
})(typeof window !== "undefined" ? window : global);
