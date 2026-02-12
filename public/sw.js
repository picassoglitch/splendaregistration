/* Minimal offline cache for a small event companion PWA.
   Replace/extend with Workbox later if desired. */

// Bump this to invalidate older caches on deploys.
const CACHE_NAME = "ss2026-v7";
// Only cache immutable/static assets. Avoid caching HTML to prevent hydration mismatches after updates.
const CORE_ASSETS = [
  "/splash.png",
  "/logo-sweet-smart-2026.png",
  "/event-map.png",
  "/outfit1day1f.png",
  "/outfit1day1m.png",
  "/outfit2day1f.png",
  "/outfit2day1m.png",
  "/outfit1day2f.png",
  "/outfit1day2m.png",
  "/outfit2day2f.png",
  "/outfit2day2m.png",
  "/outfit3day2f.png",
  "/outfit3day2m.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(CORE_ASSETS);
      self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k)),
      );
      self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Never cache Next.js build assets (prevents broken deploys when chunk names change).
  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(fetch(req, { cache: "no-store" }));
    return;
  }

  // Never cache API responses (roles/config/auth gating must always be fresh)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(req));
    return;
  }

  // Never cache HTML / navigations. This prevents serving stale HTML after deploys (hydration mismatch).
  const accept = req.headers.get("accept") || "";
  const isHtml = req.mode === "navigate" || accept.includes("text/html");
  if (isHtml) {
    event.respondWith(fetch(req));
    return;
  }

  // Cache-first for static assets.
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      const fresh = await fetch(req);
      // Only cache successful responses; never store 404/500 responses.
      if (fresh && fresh.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
      }
      return fresh;
    })(),
  );
});

