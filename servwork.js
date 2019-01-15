const cacheName ="Restaurant_Reviews_v1";

const cacheFiles = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg'
]

//installation
self.addEventListener('install', event => {
    console.log("Service Worker installed");
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('Service Worker: Catching files');
            cache.addAll(cacheFiles);
        })
        .then(() => self.skipWaiting())
    );
});

//call activate event
self.addEventListener('activate', event => {
    console.log('Service Worker activated');
    event.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !==cacheName) {
                        console.log('Service worker cleared old cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
})




//call fetch event

self.addEventListener('fetch', function(event) {
    console.log('Service Worker: Fetching');
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if(response) {
                console.log('Found ', event.request, ' in cache');
                return response;
            }
            else {
                console.log('Could not find ', event.request, ' in cache, Fetching!');
                return fetch(event.request)
                .then(function(response) {
                    const clonedResponse= response.clone();
                    caches.open(cacheName).then(function(cache) {
                        cache.put(event.request, clonedResponse);
                    })
                    return response;
                })
                .catch(function(error) {
                    console.error(error);
                })
            }
        })
    )
})

