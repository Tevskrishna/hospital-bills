/**
 * FamilyCare — PWA, install, pull-to-refresh, version check (v24)
 */
(function (global) {
  const FC = global.FC || (global.FC = {});
  const PAGE_VERSION = FC.PAGE_VERSION;

  function promptInstall() {
    if (FC.state.deferredInstall) {
      FC.state.deferredInstall.prompt();
      FC.state.deferredInstall = null;
      document.getElementById("installBanner")?.classList.remove("show");
      FCAnalytics.track("pwa_install_prompt");
    } else {
      FC.ui?.toast?.("Safari: Share → Add to Home Screen · Chrome: Menu → Install app");
    }
  }

  async function checkLiveVersion() {
    try {
      const res = await FC.utils.fetchWithTimeout("version.json?t=" + Date.now(), { cache: "no-store" });
      if (!res.ok) return;
      const v = await res.json();
      if (v.build && v.build !== PAGE_VERSION) {
        document.getElementById("updateBanner")?.classList.add("show");
        FCAnalytics.track("version_mismatch");
      }
    } catch (e) { /* offline */ }
  }

  function initPullRefresh() {
    let startY = 0;
    let pulling = false;
    const ptr = document.getElementById("ptrIndicator");
    const threshold = 72;
    document.addEventListener("touchstart", (e) => {
      if (window.scrollY <= 0 && !document.getElementById("chatPanel")?.classList.contains("open")) {
        startY = e.touches[0].clientY;
        pulling = true;
      }
    }, { passive: true });
    document.addEventListener("touchmove", (e) => {
      if (!pulling) return;
      const dy = e.touches[0].clientY - startY;
      if (dy > 20 && dy < threshold * 2) ptr?.classList.add("show");
      else if (dy <= 20) ptr?.classList.remove("show");
    }, { passive: true });
    document.addEventListener("touchend", (e) => {
      if (!pulling) return;
      pulling = false;
      const dy = (e.changedTouches[0]?.clientY || 0) - startY;
      ptr?.classList.remove("show");
      if (dy > threshold && window.scrollY <= 0) {
        ptr.textContent = "Refreshing…";
        ptr?.classList.add("show");
        loadData(true).then(() => {
          render();
          ptr.textContent = "✓ Updated";
          setTimeout(() => { ptr?.classList.remove("show"); ptr.textContent = "↓ Pull to refresh"; }, 800);
        });
      }
    }, { passive: true });
  }

  function handleDeepLinks() {
    const p = new URLSearchParams(location.search);
    if (p.get("tab") === "share") showPage("share");
    if (p.get("action") === "add") setTimeout(openAddModal, 400);
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
    navigator.serviceWorker.addEventListener("message", (e) => {
      if (e.data?.type === "FC_SYNC") flushPendingToCloud();
    });
  }

  function initPwa() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      FC.state.deferredInstall = e;
      global.deferredInstall = e;
      document.getElementById("installBanner")?.classList.add("show");
    });
    window.addEventListener("appinstalled", () => FCAnalytics.track("pwa_installed"));

    registerServiceWorker();
    initPullRefresh();
    handleDeepLinks();

    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => checkLiveVersion(), { timeout: 3000 });
    } else {
      setTimeout(checkLiveVersion, 2000);
    }
  }

  FC.pwa = { promptInstall, checkLiveVersion, initPullRefresh, initPwa };
  global.promptInstall = promptInstall;
})(typeof window !== "undefined" ? window : global);
