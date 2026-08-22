const CACHE_NAME = 'kiply-store-v2';

// Network-first strategy for same-origin static assets
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
    const url = new URL(request.url);

    // ONLY intercept same-origin GET requests
    // Let browser directly handle cross-origin, tracking scripts (Facebook, Google), APIs, and extensions
    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }

    // Skip Supabase API calls and admin portal API requests (always fresh data)
    if (url.pathname.startsWith('/api') || url.pathname.includes('supabase')) {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                // Cache successful responses for static assets
                if (response && response.ok && (url.pathname.match(/\.(js|css|woff2?|png|jpg|webp|svg|ico)$/) || url.pathname.includes('/assets/'))) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)).catch(() => {});
                }
                return response;
            })
            .catch(async () => {
                const cached = await caches.match(request);
                if (cached) {
                    return cached;
                }
                // Return clean offline response for navigation or error response for assets instead of undefined
                if (request.mode === 'navigate') {
                    const indexCached = await caches.match('/index.html');
                    if (indexCached) return indexCached;
                }
                return new Response('Network error occurred', {
                    status: 408,
                    headers: { 'Content-Type': 'text/plain' }
                });
            })
    );
});
