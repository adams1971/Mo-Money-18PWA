const FILES_TO_CACHE = [
  "/",
  "db.js",
  "index.html",
  "index.js",
  "manifest.webmanifest",
  "style.css",
  "icons/icon-192x192.png", "/icons/icon-512x512.png",
];

const CACHE_NAME = "cache-v1";
const RUNTIME = "runtime";

//installer
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
        .open(CACHE_NAME)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
        .then(self.skipWaiting())
  );
});

//activator- activates the cache event and removes old data
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

//fetch
self.addEventListener(`fetch`, (event) => {
  if (event.request.url.includes(`/api/`)) {
    event.respondWith(
      caches
        .open(RUNTIME)
        .then((cache) =>
          fetch(event.request)
            .then((response) => {
              //if valid response, clone and store to cache
              if (response.status === 200) {
                cache.put(event.request.url, response.clone());
              }
              return response;
            })
            //failed request- try to get from cache
            .catch(() => cache.match(event.request))
        )
        .catch((err) => console.log(err))
    );
  } else {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});
