self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open("zapit-cache").then((cache) => {
        return cache.addAll([
          "/",
          "logo.png",
          "paywall.css",
          "app.js",
        ]);
      })
    );
  });
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  
