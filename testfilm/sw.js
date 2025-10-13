const CACHE_NAME = 'filmoteka-v1.2';
const urlsToCache = [
  '/filmoteka/',
  '/filmoteka/index.html',
  '/filmoteka/manifest.json',
  '/filmoteka/favicon/favicon-16.png',
  '/filmoteka/favicon/favicon-32.png',
  '/filmoteka/favicon/favicon-180.png',
  '/filmoteka/favicon/favicon-192.png',
  '/filmoteka/favicon/favicon-256.png',
  '/filmoteka/favicon/favicon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});