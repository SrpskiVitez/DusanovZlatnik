const CACHE_NAME = "dusanov-zlatnik-cache-v2";

const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./scr/script.js",
  "./pic/logo_500_tra.png",
  "./favicon-32x32.png",
  "./favicon-16x16.png",
  "./android-chrome-192x192.png",
  "./android-chrome-512x512.png",
  "./offline.html"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(response => {
        return response || caches.match("./offline.html");
      })
    )
  );
});
