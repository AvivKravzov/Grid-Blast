const CACHE_NAME = 'grid-blast-cache-v1';
const urlsToCache = [
    './index.html',
    './manifest.json',
    // הוסף את כל קבצי האייקונים שלך לכאן:
    './icon-72.png',
    './icon-192.png',
    './icon-512.png',
    'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap' // חשוב לשמור את הפונט החיצוני
];

// שלב ההתקנה: פתיחת המטמון ושמירת נכסים
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// שלב ה-Fetch: מנסה להביא נכסים מהמטמון לפני רשת
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // המשאב נמצא במטמון - מחזירים אותו
        if (response) {
          return response;
        }
        // לא נמצא במטמון - מנסים להביא מהרשת
        return fetch(event.request);
      }
    )
  );
});

// שלב אקטיבציה: מוחק מטמונים ישנים
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
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