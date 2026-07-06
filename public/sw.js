// public/sw.js
const CACHE_NAME = 'the-benedictine-academy-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/about',
  '/academics',
  '/admission',
  '/admission/apply',
  '/e-learning',
  '/contact',
  '/FAQ',
  '/news',
  '/gallery',
  '/admin-portal/login',
  '/teacher-portal/login',
  '/student-portal/login',
  '/logo.jpg',
  '/1.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(url => cache.add(url))
      );
    }).catch((error) => {
      console.error('Service Worker: Cache failed', error);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    }).then(() => {
      console.log('Service Worker: Activated');
      return clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests and API calls
  if (!event.request.url.startsWith(self.location.origin) || event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response immediately, update cache in background
        fetch(event.request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      }).catch(() => {
        // Offline fallback – only for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('You are offline', { status: 503 });
      });
    })
  );
});