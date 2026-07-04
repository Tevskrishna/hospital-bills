/**
 * FamilyCare — PWA, install, pull-to-refresh, version check (v24)
 */
(function (global) {
  const FC = global.FC || (global.FC = {});
  const PAGE_VERSION = FC.PAGE_VERSION;

  function isInstalledPwa() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  }

  function dismissInstall() {
    try {
      localStorage.setItem("fc_install_dismiss", "1");
    } catch (e) { /* ignore */ }
    document.getElementById("installBanner")?.classList.remove("show");
  }

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
        if (!sessionStorage.getItem("fc_auto_update")) {
          sessionStorage.setItem("fc_auto_update", "1");
          setTimeout(() => {
            location.replace("./refresh.html");
          }, 2000);
        }
      }
    } catch (e) { /* offline */ }
  }

  function setPtrMessage(msg) {
    const ptr = document.getElementById("ptrIndicator");
    if (!ptr) return;
    ptr.textContent = msg;
    ptr.setAttribute("aria-hidden", msg ? "false" : "true");
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
      if (dy > 20 && dy < threshold * 2) {
        setPtrMessage("↓ Pull to refresh");
        ptr?.classList.add("show");
      } else if (dy <= 20) {
        ptr?.classList.remove("show");
        setPtrMessage("");
      }
    }, { passive: true });
    document.addEventListener("touchend", (e) => {
      if (!pulling) return;
      pulling = false;
      const dy = (e.changedTouches[0]?.clientY || 0) - startY;
      ptr?.classList.remove("show");
      if (dy > threshold && window.scrollY <= 0) {
        setPtrMessage("Refreshing…");
        ptr?.classList.add("show");
        loadData(true).then(() => {
          render();
          FC.sync?.updateWriteAccessUI?.();
          checkLiveVersion();
          navigator.serviceWorker?.getRegistration()?.then((r) => r?.update());
          setPtrMessage("✓ Updated");
          setTimeout(() => {
            ptr?.classList.remove("show");
            setPtrMessage("");
          }, 800);
        });
      } else {
        setPtrMessage("");
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
    if (!isInstalledPwa()) {
      try {
        if (!localStorage.getItem("fc_install_dismiss")) {
          window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            FC.state.deferredInstall = e;
            global.deferredInstall = e;
            document.getElementById("installBanner")?.classList.add("show");
          });
        }
      } catch (err) { /* private mode */ }
    }
    window.addEventListener("appinstalled", () => FCAnalytics.track("pwa_installed"));

    registerServiceWorker();
    initPullRefresh();
    handleDeepLinks();

    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => checkLiveVersion(), { timeout: 2000 });
    } else {
      setTimeout(checkLiveVersion, 1500);
    }
  }

  FC.pwa = { promptInstall, dismissInstall, checkLiveVersion, initPullRefresh, initPwa };
  global.promptInstall = promptInstall;
  global.dismissInstall = dismissInstall;
})(typeof window !== "undefined" ? window : global);
