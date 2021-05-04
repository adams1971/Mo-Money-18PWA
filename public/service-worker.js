// const FILES_TO_CACHE = [
//   '/index.html',
//   '/styles.css',
//   '/index.js',
//   '/db.js',
//   '/icons/icon-192x192.png', 
//   '/icons/icon-512x512.png',
//   '/manifest.webmanifest',
// ];

// const CACHE_NAME = "cache-v1";
// const RUNTIME = "runtime";

// //installer
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches
//         .open(CACHE_NAME)
//         .then((cache) => cache.addAll(FILES_TO_CACHE))
//         .then(self.skipWaiting())
//   );
// });

// //activator- activates the cache event and removes old data
// self.addEventListener("activate", (event) => {
//   const currentCaches = [CACHE_NAME, RUNTIME];
//   event.waitUntil(
//     caches
//       .keys()
//       .then((cacheNames) => {
//         return cacheNames.filter(
//           (cacheName) => !currentCaches.includes(cacheName)
//         );
//       })
//       .then((cachesToDelete) => {
//         return Promise.all(
//           cachesToDelete.map((cacheToDelete) => {
//             return caches.delete(cacheToDelete);
//           })
//         );
//       })
//       .then(() => self.clients.claim())
//   );
// });

// //fetch
// self.addEventListener("fetch", event => {
//     // non GET requests are not cached and requests to other origins are not cached
//     if (
//         event.request.method !== "GET" ||
//         !event.request.url.startsWith(self.location.origin)
//     ) {
//         event.respondWith(fetch(event.request));
//         return;
//     }


//     // use cache first for all other requests for performance
//     event.respondWith(
//         caches.match(event.request).then(cachedResponse => {
//             if (cachedResponse) {
//                 return cachedResponse;
//             }

//             // request is not in cache. make network request and cache the response
//             return caches.open(RUNTIME).then(cache => {
//                 return fetch(event.request).then(response => {
//                     return cache.put(event.request, response.clone()).then(() => {
//                         return response;
//                     });
//                 });
//             });
//         })
//     );
// });

// // self.addEventListener(`fetch`, (event) => {
// //   if (event.request.url.includes(`/api/`)) {
// //     event.respondWith(
// //       caches
// //         .open(RUNTIME)
// //         .then((cache) =>
// //           fetch(event.request)
// //             .then((response) => {
// //               //if valid response, clone and store to cache
// //               if (response.status === 200) {
// //                 cache.put(event.request.url, response.clone());
// //               }
// //               return response;
// //             })
// //             //failed request- try to get from cache
// //             .catch(() => cache.match(event.request))
// //         )
// //         .catch((err) => console.log(err))
// //     );
// //   } else {
// //     event.respondWith(
// //       caches
// //         .match(event.request)
// //         .then((response) => response || fetch(event.request))
// //     );
// //   }
// // });
