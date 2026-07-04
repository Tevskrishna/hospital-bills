/**
 * FamilyCare — application bootstrap (v24)
 */
(function (global) {
  const FC = global.FC || (global.FC = {});

  function boot() {
    document.body.classList.add("app-loading");
    const dateEl = document.getElementById("aDate");
    if (dateEl) dateEl.value = new Date().toISOString().slice(0, 10);

    FC.pwa.initPwa();

    loadData()
      .then(() => {
        document.body.classList.remove("app-loading");
        render();
        hideSplash();
        FCAnalytics.loadTime();
        flushPendingToCloud();
      })
      .catch(() => {
        document.body.classList.remove("app-loading");
        render();
        hideSplash();
      });

    setInterval(() => loadData(true), 20000);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") loadData(true);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  FC.app = { boot };
})(typeof window !== "undefined" ? window : global);
