const OFFLINE_INDEX = 'neterror.html'

const OFFLINE_URLS = [
  OFFLINE_INDEX,
  'neterror.css',
  'neterror.js',
  'neterror/default_100_percent/100-disabled.png',
  'neterror/default_100_percent/100-error-offline.png',
  'neterror/default_100_percent/100-offline-sprite.png',
  'neterror/default_200_percent/200-disabled.png',
  'neterror/default_200_percent/200-error-offline.png',
  'neterror/default_200_percent/200-offline-sprite.png',
]

const RUNTIME_CACHE = 'cache-v1'

const PRECACHE_URLS = OFFLINE_URLS.concat(
  [
    'style.css',
    'app.js'
  ]
)

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(RUNTIME_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  )
})

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [RUNTIME_CACHE]
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName))
      })
      .then(cachesToDelete => {
        return Promise.all(cachesToDelete.map(cacheToDelete => {
          return caches.delete(cacheToDelete)
        }))
      })
      .then(() => {
        if ('navigationPreload' in self.registration) {
          return self.registration.navigationPreload.enable()
        } else {
          return Promise.resolve()
        }
      })
      .then(() => self.clients.claim())
  )
})

// The fetch handler serves responses resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        // First, try to use the navigation preload response if it's supported.
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }
        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        // catch is only triggered if an exception is thrown, which is likely
        // due to a network error.
        // If fetch() returns a valid HTTP response with a response code in
        // the 4xx or 5xx range, the catch() will NOT be called.
        const cache = await caches.open(RUNTIME_CACHE);
        const cachedResponse = await cache.match(OFFLINE_INDEX);
        return cachedResponse;
      }
    })());
  } else {
    event.respondWith(
      caches
        .match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse
          }
          return caches.open(RUNTIME_CACHE).then(cache => {
            return fetch(event.request)
              .then(response => {
                // Put a copy of the response in the runtime cache.
                return cache.put(event.request, response.clone()).then(() => {
                  return response;
                })
              })
          })
        })
    )
  }
})