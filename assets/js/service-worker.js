// Service Worker para PWA
const CACHE_NAME = 'tutorias-jordy-v1.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/js/app.js',
    '/assets/js/animations.js',
    '/assets/js/pricing.js',
    '/assets/js/form-handler.js',
    '/manifest.json',
    '/assets/img/favicon/favicon-32x32.png',
    '/assets/img/favicon/favicon-16x16.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});