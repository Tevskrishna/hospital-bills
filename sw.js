/* FamilyCare PWA v25 LTS — cache-first static, network-first data */
const CACHE_VERSION = "familycare-v25-lts";
const CSS_FILES = [
  "./css/theme.css",
  "./css/app.css",
  "./css/components.css",
  "./css/utilities.css",
  "./css/animations.css",
  "./css/responsive.css",
];
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./hospital-bills.html",
  "./offline.html",
  "./manifest.json",
  "./version.json",
  ...CSS_FILES,
  "./icons/icon.svg",
  "./icons/favicon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./js/config.js",
  "./js/utils.js",
  "./js/analytics.js",
  "./js/validation.js",
  "./js/calculations.js",
  "./js/storage.js",
  "./js/sync.js",
  "./js/ui.js",
  "./js/render.js",
  "./js/whatsapp.js",
  "./js/care.js",
  "./js/pwa.js",
  "./js/protect.js",
  "./js/app.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => Promise.resolve()))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isDataRequest(url) {
  return url.pathname.includes("/data/bills.json") || url.pathname.endsWith("/version.json");
}

async function networkFirst(request) {
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match("./offline.html");
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    if (request.mode === "navigate") {
      return caches.match("./offline.html") || caches.match("./index.html");
    }
    return new Response("", { status: 503, statusText: "Offline" });
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin && !url.hostname.includes("githubusercontent.com")) return;

  if (isDataRequest(url) || url.pathname.endsWith("version.json")) {
    event.respondWith(networkFirst(event.request));
    return;
  }
  if (event.request.mode === "navigate" || PRECACHE_URLS.some((p) => url.pathname.endsWith(p.replace("./", "")))) {
    event.respondWith(cacheFirst(event.request));
  }
});

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { title: "FamilyCare", body: "Family bill update available" };
  event.waitUntil(
    self.registration.showNotification(data.title || "FamilyCare", {
      body: data.body || "",
      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png",
      data: { url: "./" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || "./"));
});

self.addEventListener("sync", (event) => {
  if (event.tag === "fc-pending-sync") {
    event.waitUntil(
      self.clients.matchAll({ type: "window" }).then((list) => {
        list.forEach((c) => c.postMessage({ type: "FC_SYNC" }));
      })
    );
  }
});
