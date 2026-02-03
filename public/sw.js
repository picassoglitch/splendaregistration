/* Minimal offline cache for a small event companion PWA.
   Replace/extend with Workbox later if desired. */

// Bump this to invalidate older caches on deploys.
const CACHE_NAME = "ss2026-v4";
// Only cache immutable/static assets. Avoid caching HTML to prevent hydration mismatches after updates.
const CORE_ASSETS = ["/splash.png"];

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
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, fresh.clone());
      return fresh;
    })(),
  );
});

