const CACHE_NAME = 'alphamarr-v4';
const URLS_TO_CACHE = ['./', './index.html', './manifest.json', './favicon.png', './icon-192.png', './icon-512.png', './apple-touch-icon-180.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Priorite au reseau : si internet est disponible, on charge TOUJOURS la
// derniere version en ligne (et on met le cache a jour au passage).
// Ce n'est qu'en l'absence totale de reseau qu'on ressort la version
// enregistree precedemment (mode hors-ligne).
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        var copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
