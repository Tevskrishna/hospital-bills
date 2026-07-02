/**
 * FamilyCare — privacy-safe local analytics (v24)
 */
(function (global) {
  const FC = global.FC || (global.FC = {});
  const KEY = FC.FC_METRICS_KEY;
  const T0 = typeof performance !== "undefined" ? performance.now() : 0;

  const FCAnalytics = {
    track(event, extra) {
      try {
        const m = FC.utils.safeParseJson(localStorage.getItem(KEY), {});
        m[event] = (m[event] || 0) + 1;
        if (extra && extra.ms) m[event + "_ms"] = (m[event + "_ms"] || 0) + extra.ms;
        m.lastEvent = event;
        m.lastAt = Date.now();
        localStorage.setItem(KEY, JSON.stringify(m));
      } catch (e) { /* quota or private mode */ }
    },
    loadTime() {
      this.track("app_load", { ms: Math.round(performance.now() - T0) });
    },
    snapshot() {
      return FC.utils.safeParseJson(localStorage.getItem(KEY), {});
    },
  };

  FC.analytics = FCAnalytics;
  global.FCAnalytics = FCAnalytics;
})(typeof window !== "undefined" ? window : global);
