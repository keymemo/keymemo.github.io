let version = '20171205';

var dataCacheName = 'keymemo-' + version;
var cacheName = 'keymemo-next' + version;
var filesToCache = [
  '/index.html',
  '/manifest.json',
  '/scripts/CryptoJS/cipher-core.js',
  '/scripts/CryptoJS/core.js',
  '/scripts/CryptoJS/evpkdf.js',
  '/scripts/CryptoJS/aes.js',
  '/scripts/scripts.js',
  '/scripts/passwords.js',
  '/scripts/FileSaver.js',
  '/scripts/develop.js',
  '/scripts/settings.js',
  '/images/logo-drive.png',
  '/images/icons/icon-128x128.png',
  '/images/icons/icon-144x144.png',
  '/images/icons/icon-152x152.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-256x256.png',
  '/favicon.png',
  '/styles/style.css'
];

self.addEventListener('install', function (e) {
    //    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            //            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    //  console.log('[Service Worker] Fetch', e.request.url);
    var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
    if (e.request.url.indexOf(dataUrl) > -1) {
        e.respondWith(
            caches.open(dataCacheName).then(function (cache) {
                return fetch(e.request).then(function (response) {
                    cache.put(e.request.url, response.clone());
                    return response;
                });
            })
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                return response || fetch(e.request);
            })
        );
    }
});



self.addEventListener('beforeinstallprompt', function (e) {
    // beforeinstallprompt Event fired

    // e.userChoice will return a Promise.
    // For more details read: https://developers.google.com/web/fundamentals/getting-started/primers/promises
    e.userChoice.then(function (choiceResult) {

        console.log(choiceResult.outcome);

        if (choiceResult.outcome == 'dismissed') {
            console.log('User cancelled home screen install');
        } else {
            console.log('User added to home screen');
        }
    });
});




self.addEventListener('message', function (event) {
    var data = event.data;
    //    console.log("SW-> command: ", data.command);

    // возвращаем dataCacheName
    if (data.command == "get_version_soft") {
        //        console.log("Page<-answer: ", version);
        event.ports[0].postMessage({
            "message": version
        });
    }
});
