const CACHE_NAME = 'kiply-admin-v1';

// Network-first strategy: always try network, fall back to cache
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(
                names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-GET requests and Supabase API calls (always fresh data)
    if (request.method !== 'GET' || request.url.includes('supabase.co')) {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                // Cache successful responses for static assets
                if (response.ok && (request.url.match(/\.(js|css|woff2?|png|jpg|svg)$/) || request.url.includes('/assets/'))) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return response;
            })
            .catch(() => caches.match(request))
    );
});
