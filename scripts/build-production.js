#!/usr/bin/env node
/**
 * Production build: bundle → minify → obfuscate → dist/
 * Deploy dist/ only — readable js/*.js sources are NOT shipped to GitHub Pages.
 */
const fs = require("fs");
const path = require("path");
const { minify } = require("terser");
const JavaScriptObfuscator = require("javascript-obfuscator");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const JS_ORDER = [
  "config.js",
  "utils.js",
  "analytics.js",
  "validation.js",
  "calculations.js",
  "storage.js",
  "sync.js",
  "ui.js",
  "render.js",
  "whatsapp.js",
  "care.js",
  "family-dashboard.js",
  "pwa.js",
  "protect.js",
  "app.js",
];

const COPY_DIRS = ["css", "data", "icons", "assets"];
const COPY_FILES = [
  "manifest.json",
  "version.json",
  "offline.html",
  "refresh.html",
  "robots.txt",
  "LICENSE",
];

function rimraf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((name) => copyRecursive(path.join(src, name), path.join(dest, name)));
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function patchHtml(html) {
  const loader = `<script src="js/app.min.js"></script>`;
  return html.replace(
    /<script src="js\/config\.js"><\/script>[\s\S]*?<script src="js\/app\.js"><\/script>/,
    loader
  );
}

function patchSw(sw, buildId) {
  const cacheVer = "familycare-" + String(buildId).replace(/[^a-zA-Z0-9.-]/g, "-") + "-prod";
  const css = [
    "./css/theme.css", "./css/app.css", "./css/components.css",
    "./css/utilities.css", "./css/animations.css", "./css/responsive.css",
  ].map((c) => `  "${c}",`).join("\n");
  const precache = `const CACHE_VERSION = "${cacheVer}";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./hospital-bills.html",
  "./offline.html",
  "./manifest.json",
  "./version.json",
${css}
  "./icons/icon.svg",
  "./icons/favicon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./js/app.min.js",
];`;
  return sw.replace(/const CACHE_VERSION = [\s\S]*?const PRECACHE_URLS = \[[\s\S]*?\];/, precache);
}

async function buildBundle() {
  const parts = JS_ORDER.map((file) => {
    const p = path.join(ROOT, "js", file);
    if (!fs.existsSync(p)) throw new Error("Missing: js/" + file);
    return fs.readFileSync(p, "utf8");
  });
  const bundled = parts.join("\n;/* --- */\n");

  const min = await minify(bundled, {
    compress: { drop_console: false, passes: 2 },
    mangle: { toplevel: false },
    format: { comments: false },
  });
  if (min.error) throw min.error;

  const obf = JavaScriptObfuscator.obfuscate(min.code, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.4,
    deadCodeInjection: false,
    debugProtection: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: "hexadecimal",
    renameGlobals: false,
    selfDefending: true,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayEncoding: ["base64"],
    stringArrayThreshold: 0.8,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
  });

  return obf.getObfuscatedCode();
}

async function main() {
  console.log("Building production bundle…");
  rimraf(DIST);
  fs.mkdirSync(path.join(DIST, "js"), { recursive: true });

  const bundle = await buildBundle();
  fs.writeFileSync(path.join(DIST, "js", "app.min.js"), bundle, "utf8");
  console.log("  js/app.min.js", (bundle.length / 1024).toFixed(1), "KB");

  for (const file of ["index.html", "hospital-bills.html"]) {
    const src = path.join(ROOT, file);
    if (!fs.existsSync(src)) continue;
    const out = patchHtml(fs.readFileSync(src, "utf8"));
    fs.writeFileSync(path.join(DIST, file), out, "utf8");
  }

  const version = JSON.parse(fs.readFileSync(path.join(ROOT, "version.json"), "utf8"));
  const sw = patchSw(fs.readFileSync(path.join(ROOT, "sw.js"), "utf8"), version.build);
  fs.writeFileSync(path.join(DIST, "sw.js"), sw, "utf8");

  COPY_DIRS.forEach((d) => copyRecursive(path.join(ROOT, d), path.join(DIST, d)));
  COPY_FILES.forEach((f) => {
    const src = path.join(ROOT, f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(DIST, f));
  });

  fs.writeFileSync(path.join(DIST, ".nojekyll"), "");

  console.log("Done → dist/ (readable js/ sources excluded)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
