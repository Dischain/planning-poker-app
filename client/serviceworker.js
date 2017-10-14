var CACHE_NAME = 'react-pp-cache-v1';

var urlsToCache = [
  '/',
  '/css/main.css',
  '/build/bundle.js'
];

self.addEventListener('install', (event) => {
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          var responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));

          return response;
        });
      })
    );
});
