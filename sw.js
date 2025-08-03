const CACHE_NAME = "dusanov-zlatnik-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./scr/script.js",
  "./pic/logo_500_tra.png",
  "./favicon-32x32.png",
  "./favicon-16x16.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
