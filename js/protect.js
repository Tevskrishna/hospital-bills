/**
 * FamilyCare — production-only code protection (v24.1)
 * Deters casual copying; does not block determined reverse engineers.
 * Skipped on localhost so development stays normal.
 */
(function (global) {
  if (/localhost|127\.0\.0\.1/.test(location.hostname)) return;

  const NOTICE =
    "© FamilyCare Hospital Bills · Proprietary software.\n" +
    "Unauthorized copying, redistribution, or reuse is prohibited.";

  try {
    console.log("%c" + NOTICE, "color:#b91c1c;font-size:13px;font-weight:700;line-height:1.5");
  } catch (e) { /* ignore */ }

  document.addEventListener("contextmenu", (e) => {
    const el = e.target;
    if (!el || typeof el.closest !== "function") return;
    if (el.closest("input, textarea, button, select, [contenteditable], #waPreview, .wa-preview")) return;
    e.preventDefault();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "F12") e.preventDefault();
    if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) {
      e.preventDefault();
    }
    if (e.ctrlKey && (e.key === "u" || e.key === "U")) e.preventDefault();
    if (e.ctrlKey && (e.key === "s" || e.key === "S")) e.preventDefault();
  });

  document.addEventListener("dragstart", (e) => {
    if (e.target && e.target.tagName === "IMG") e.preventDefault();
  });
})(typeof window !== "undefined" ? window : global);
