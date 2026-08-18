/* Minimal service worker for PWA installability.
   Network-only: does not cache or intercept API, auth, or app data. */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Leave every request to the network.
});
