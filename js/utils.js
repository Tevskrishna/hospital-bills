/**
 * FamilyCare — utilities (v24)
 */
(function (global) {
  const FC = global.FC || (global.FC = {});

  function esc(s) {
    return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function fmt(n) {
    return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function fmtDate(iso) {
    if (!iso || typeof iso !== "string") return "—";
    const parts = iso.split("-");
    if (parts.length < 3) return iso;
    const [y, m, d] = parts;
    const en = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const te = ["జన", "ఫిబ్ర", "మార్చి", "ఏప్రి", "మే", "జూన్", "జులై", "ఆగ", "సెప్టె", "అక్టో", "నవ", "డిసె"];
    const mi = +m - 1;
    if (mi < 0 || mi > 11) return iso;
    return `${d} ${te[mi]} · ${d} ${en[mi]} ${y}`;
  }

  function csvEsc(s) {
    const t = String(s ?? "");
    return t.includes(",") ? '"' + t.replace(/"/g, '""') + '"' : t;
  }

  function monthLabel(iso) {
    const [y, m] = String(iso).split("-");
    const en = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return en[+m - 1] + " " + y;
  }

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning 🙏";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }

  function ringSvg(pct, color) {
    const r = 24;
    const c = 2 * Math.PI * r;
    const offset = c - (Math.min(100, Math.max(0, pct)) / 100) * c;
    return `<svg viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="${r}" fill="none" stroke="#f0f0f0" stroke-width="5"/><circle cx="28" cy="28" r="${r}" fill="none" stroke="${color}" stroke-width="5" stroke-dasharray="${c}" stroke-dashoffset="${offset}" stroke-linecap="round" transform="rotate(-90 28 28)" style="transition:stroke-dashoffset 1s var(--ease-out)"/></svg>`;
  }

  function haptic(ms) {
    if (navigator.vibrate) navigator.vibrate(ms || 8);
  }

  function safeParseJson(str, fallback) {
    try {
      const v = JSON.parse(str);
      return v !== null && typeof v === "object" ? v : fallback;
    } catch {
      return fallback;
    }
  }

  function fetchWithTimeout(url, options, timeoutMs) {
    const ms = timeoutMs || FC.FETCH_TIMEOUT_MS || 15000;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), ms);
    return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id));
  }

  /** Map sync errors to family-friendly messages — never expose raw API text */
  function friendlySyncError(result) {
    if (result?.offline) return "Saved on this phone — add token in Bills tab to sync with family.";
    if (result?.ok) return "";
    const raw = String(result?.error || "").toLowerCase();
    if (raw.includes("401") || raw.includes("bad credentials") || raw.includes("token")) {
      return "GitHub token needs updating — open Bills tab → Phone setup.";
    }
    if (raw.includes("rate limit") || raw.includes("403")) {
      return "Too many sync attempts — please wait a minute and try again.";
    }
    if (raw.includes("abort") || raw.includes("timeout") || raw.includes("network")) {
      return "Network slow or offline — bill saved on this phone.";
    }
    return "Could not reach cloud — bill saved on this phone.";
  }

  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function animateValue(el, end, duration) {
    if (!el) return;
    const dur = duration || 1200;
    const start = 0;
    const t0 = performance.now();
    function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(start + (end - start) * ease);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  FC.utils = { esc, fmt, fmtDate, csvEsc, monthLabel, getGreeting, ringSvg, haptic, safeParseJson, fetchWithTimeout, friendlySyncError, debounce, animateValue };

  global.esc = esc;
  global.fmt = fmt;
  global.fmtDate = fmtDate;
  global.csvEsc = csvEsc;
  global.monthLabel = monthLabel;
  global.getGreeting = getGreeting;
  global.ringSvg = ringSvg;
  global.haptic = haptic;
  global.animateValue = animateValue;

  if (typeof module !== "undefined") {
    module.exports = {
      esc,
      fmt,
      fmtDate,
      safeParseJson,
      friendlySyncError,
      debounce,
    };
  }
})(typeof window !== "undefined" ? window : global);
