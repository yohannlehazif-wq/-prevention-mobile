const VERSION = "restev85-v2026-08-21-01";
const APP_ROOT = "/-prevention-mobile/";

const APP_SHELL = [
  APP_ROOT,
  APP_ROOT + "index.html",
  APP_ROOT + "manifest.webmanifest"
];

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(VERSION)
      .then(cache => cache.addAll(APP_SHELL))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(names =>
        Promise.all(
          names
            .filter(name => name !== VERSION)
            .map(name => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, {
        cache: "no-store"
      })
        .then(response => {
          const copy = response.clone();

          caches.open(VERSION)
            .then(cache => cache.put(APP_ROOT + "index.html", copy));

          return response;
        })
        .catch(() =>
          caches.match(APP_ROOT + "index.html")
        )
    );

    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cached => {
        const networkRequest = fetch(request)
          .then(response => {
            if (
              response &&
              response.ok &&
              new URL(request.url).origin === self.location.origin
            ) {
              const copy = response.clone();

              caches.open(VERSION)
                .then(cache => cache.put(request, copy));
            }

            return response;
          });

        return cached || networkRequest;
      })
  );
});
