// sw.js
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Опционально: можно добавить кэширование для офлайн-доступа
self.addEventListener('fetch', event => {
  // пока оставляем пустым
});