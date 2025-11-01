const CACHE_NAME = 'pwa-tarea-20';
const API_CACHE_NAME = 'api-data-v20';
const API_URL_BASE = 'https://pwapi-21z1.onrender.com/api/tareas'; 

const urlsToCache = [
    '/',
    'index.html',
    'app.js',
    'app.css',
    'manifest.webmanifest',
    'icono2.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SW: Cache abierta, añadiendo archivos.');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    if (requestUrl.href === API_URL_BASE) {
        event.respondWith(
            caches.open(API_CACHE_NAME).then(cache => {
                return fetch(event.request)
                    .then(networkResponse => {
                        if (networkResponse.ok) {
                            cache.put(event.request, networkResponse.clone()); 
                        }
                        return networkResponse;
                    })
                    .catch(async () => {
                        const cachedResponse = await cache.match(event.request);
                        
                        if (cachedResponse) {
                            console.log('Sin conexion, devolviendo datos de caché.');
                            return cachedResponse;
                        }
                        console.log('SW: Sin red y sin caché de datos.');
                        return new Response("No hay datos disponibles sin conexión y sin caché previa.", {
                            status: 503,
                            statusText: "Service Unavailable"
                        });
                    });
            })
        );
    } 
    else {
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request);
            })
        );
    }
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME, API_CACHE_NAME]; 
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});