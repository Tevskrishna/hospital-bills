/**
 * FamilyCare — cloud sync & data loading (v24)
 * GitHub sync behaviour frozen — same API contract as v1–v23.
 */
(function (global) {
  const FC = global.FC || (global.FC = {});
  const { CONFIG } = FC;
  const { fetchWithTimeout, friendlySyncError, safeParseJson } = FC.utils;
  const { normalizeApiJson } = FC.validation;
  const LS_KEY = FC.LS_KEY;

  function applyJson(json) {
    const norm = normalizeApiJson(json);
    if (!norm) return;
    global.meta.patient = norm.patient;
    global.meta.hospital = norm.hospital;
    global.meta.startDate = norm.startDate;
    global.data.bills = norm.bills;
    global.data.advances = norm.advances;
    if (norm.careStatus) {
      Object.assign(global.careStatus, norm.careStatus);
    }
    if (norm.familyDashboard && FC.familyDashboard?.ensureDashboard) {
      global.familyDashboard = FC.familyDashboard.ensureDashboard(norm.familyDashboard);
    }
    FC.storage.cacheSnapshot(buildPayload());
  }

  function mergeLocalStorage() {
    const local = safeParseJson(localStorage.getItem(LS_KEY), null);
    if (!local) return;
    (local.pendingBills || []).forEach((b) => {
      if (!global.data.bills.some((x) => x.d === b.d && x.who === b.who && Math.abs(x.amt - b.amt) < 0.001)) {
        global.data.bills.push(b);
      }
    });
    (local.pendingAdvances || []).forEach((a) => {
      if (!global.data.advances.some((x) => x.d === a.d && x.amt === a.amt)) global.data.advances.push(a);
    });
    if (local.careStatus) Object.assign(global.careStatus, local.careStatus);
    if (local.familyDashboard && FC.familyDashboard?.ensureDashboard) {
      global.familyDashboard = FC.familyDashboard.ensureDashboard({
        ...(global.familyDashboard || {}),
        ...local.familyDashboard,
      });
    }
  }

  function buildPayload() {
    return {
      patient: global.meta.patient,
      hospital: global.meta.hospital,
      startDate: global.meta.startDate,
      sons: [
        { name: "Shivaji", payer: "Venky", label: "శివాజీ కుమారుడు · Venky", color: "#2a9d8f" },
        { name: "Rajini", payer: "Deepa", label: "రజినీ కుమారుడు · Deepa", color: "#e76f51" },
        { name: "Kalyan", payer: "Kalyan", label: "కల్యాణ్ కుమారుడు", color: "#1b4965" },
      ],
      bills: global.data.bills,
      advances: global.data.advances,
      careStatus: global.careStatus,
      familyDashboard: FC.familyDashboard?.getDashboard?.() || global.familyDashboard || {},
    };
  }

  function jsonToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin);
  }

  async function loadData(silent) {
    const before = JSON.stringify({ b: global.data.bills, a: global.data.advances, c: global.careStatus });
    const cached = localStorage.getItem(LS_KEY);
    if (cached && !silent) {
      try {
        const j = JSON.parse(cached);
        if (j.bills) applyJson(j);
      } catch (e) { /* corrupt cache — skip */ }
    }

    if (CONFIG.apiUrl) {
      try {
        const url = CONFIG.apiUrl + (CONFIG.apiUrl.includes("?") ? "&" : "?") + "t=" + Date.now();
        const res = await fetchWithTimeout(url, { cache: "no-store" });
        if (res.ok) {
          applyJson(await res.json());
          updateSyncUI();
          if (silent && JSON.stringify({ b: global.data.bills, a: global.data.advances, c: global.careStatus }) !== before) {
            global.render?.();
          }
          return;
        }
      } catch (e) { /* fall through */ }
    }

    try {
      const res = await fetchWithTimeout("data/bills.json?v=" + Date.now(), { cache: "no-store" });
      if (res.ok) {
        applyJson(await res.json());
        mergeLocalStorage();
        updateSyncUI();
        if (silent && JSON.stringify({ b: global.data.bills, a: global.data.advances, c: global.careStatus }) !== before) {
          global.render?.();
        }
        return;
      }
    } catch (e) { /* offline */ }

    const snapshot = FC.storage.loadCachedSnapshot();
    if (snapshot && !global.data.bills.length) applyJson(snapshot);

    mergeLocalStorage();
    updateSyncUI();
    if (silent && JSON.stringify({ b: global.data.bills, a: global.data.advances, c: global.careStatus }) !== before) {
      global.render?.();
    }
  }

  function updateSyncUI() {
    const synced = !!(CONFIG.githubToken || CONFIG.apiUrl);
    document.getElementById("setupBox")?.style.setProperty("display", synced ? "none" : "block");
    const apiEl = document.getElementById("setupApiUrl");
    if (apiEl && CONFIG.apiUrl) apiEl.value = CONFIG.apiUrl;
  }

  async function saveToGitHub() {
    const token = CONFIG.githubToken || localStorage.getItem("hb_github_token");
    if (!token) return { ok: false, offline: true };
    const headers = {
      Authorization: "Bearer " + token,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    const jsonStr = JSON.stringify(buildPayload(), null, 2);
    const content = jsonToBase64(jsonStr);
    const url = `https://api.github.com/repos/${CONFIG.githubRepo}/contents/${CONFIG.githubPath}`;

    let sha = null;
    try {
      const getRes = await fetchWithTimeout(url, { headers });
      if (getRes.ok) sha = (await getRes.json()).sha;
      else if (getRes.status !== 404) {
        const err = await getRes.json().catch(() => ({}));
        return { ok: false, error: err.message || "GitHub read failed" };
      }
    } catch (e) {
      return { ok: false, error: String(e) };
    }

    try {
      const putRes = await fetchWithTimeout(url, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Mobile bill update " + new Date().toISOString().slice(0, 16),
          content,
          ...(sha ? { sha } : {}),
        }),
      });
      const result = await putRes.json().catch(() => ({}));
      if (!putRes.ok) return { ok: false, error: result.message || "GitHub save failed" };
      return { ok: true };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }

  async function cloudPost(action, payload) {
    if (!CONFIG.apiUrl) return { ok: false, offline: true };
    try {
      const res = await fetchWithTimeout(CONFIG.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ action, pin: CONFIG.syncPin, ...payload }),
      });
      return await res.json();
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }

  async function pushAllToCloud() {
    if (CONFIG.githubToken) {
      const gh = await saveToGitHub();
      if (gh.ok) return gh;
      if (!CONFIG.apiUrl) return gh;
    }
    if (CONFIG.apiUrl) {
      return cloudPost("importAll", {
        bills: global.data.bills,
        advances: global.data.advances,
        careStatus: global.careStatus,
        familyDashboard: FC.familyDashboard?.getDashboard?.() || global.familyDashboard || {},
      });
    }
    return { ok: false, offline: true };
  }

  async function registerBgSync() {
    try {
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        const reg = await navigator.serviceWorker.ready;
        await reg.sync.register("fc-pending-sync");
      }
    } catch (e) { /* unsupported */ }
  }

  async function flushPendingToCloud() {
    const pending = FC.storage.getLocalPending();
    const hasPending = (pending.pendingBills || []).length > 0 || (pending.pendingAdvances || []).length > 0;
    if (!hasPending || !(CONFIG.githubToken || CONFIG.apiUrl)) return;
    const r = await pushAllToCloud();
    if (r.ok) {
      FC.storage.clearLocalPending();
      FC.ui?.toast?.("✅ Pending bills synced for family", "success");
    }
  }

  function saveGithubToken() {
    const token = document.getElementById("setupGithubToken")?.value.trim();
    if (!token.startsWith("ghp_") && !token.startsWith("github_pat_")) {
      FC.ui?.toast?.("Paste the full token from GitHub (starts with ghp_ or github_pat_)");
      return;
    }
    localStorage.setItem("hb_github_token", token);
    CONFIG.githubToken = token;
    document.getElementById("setupGithubToken").value = "";
    FC.ui?.toast?.("Token saved! You can add bills from phone now.", "success");
    updateSyncUI();
  }

  function saveApiUrl() {
    const url = document.getElementById("setupApiUrl")?.value.trim();
    if (!url.startsWith("http")) {
      FC.ui?.toast?.("Paste the full Google Web App URL");
      return;
    }
    localStorage.setItem("hb_apiUrl", url);
    CONFIG.apiUrl = url;
    FC.ui?.toast?.("Cloud URL saved! Reloading...");
    setTimeout(() => location.reload(), 800);
  }

  function syncToastOnFailure(r) {
    const msg = friendlySyncError(r);
    FC.ui?.toast?.(msg || "Could not reach cloud — saved on this phone.");
  }

  FC.sync = {
    applyJson,
    mergeLocalStorage,
    buildPayload,
    loadData,
    updateSyncUI,
    saveToGitHub,
    cloudPost,
    pushAllToCloud,
    registerBgSync,
    flushPendingToCloud,
    saveGithubToken,
    saveApiUrl,
    syncToastOnFailure,
  };

  global.loadData = loadData;
  global.applyJson = applyJson;
  global.mergeLocalStorage = mergeLocalStorage;
  global.buildPayload = buildPayload;
  global.saveToGitHub = saveToGitHub;
  global.pushAllToCloud = pushAllToCloud;
  global.updateSyncUI = updateSyncUI;
  global.flushPendingToCloud = flushPendingToCloud;
  global.saveGithubToken = saveGithubToken;
  global.saveApiUrl = saveApiUrl;
  global.registerBgSync = registerBgSync;

  if (typeof module !== "undefined") {
    module.exports = {
      buildPayload,
      jsonToBase64,
      mergeLocalStorage,
      applyJson,
      cloudPost,
      pushAllToCloud,
    };
  }
})(typeof window !== "undefined" ? window : global);
