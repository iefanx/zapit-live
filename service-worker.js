self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('zapit-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/paywall.css',
        '/app.js',
        '/logo.png',
        '/icon.png',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
