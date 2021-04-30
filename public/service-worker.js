const { response } = require("express");

// based off unit 18 Ins-12, need to reconfig files to cache
const FILES_TO_CACHE = [
    "/",
    "/db.js",
    "/index.html",
    "/index.js",
    "/manifest.webmanifest",
    "/style.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

//installer
self.addEventListener("install", function(evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("files are sucessfully pre-cached!");
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting()
});
//activater 
self.addEventListener("activate", function(evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("remove old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.Clients.claim();
});

//fetch
self.addEventListener("fetch", function(evt) {
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                .then(response => {
                    if (response.status === 200) {
                        cache.put(evt.request.url, response.clone());
                    }
                    return response;
                })
                .catch(err => {
                    return cache.match(event.request);
                });
            }).catch(err => console.log(err))
        );

        return;
    }
    evt.respondWith(
        caches.match(evt.request).then(function(response) {
            return response || fetch(evt.request);
        })
    )
});