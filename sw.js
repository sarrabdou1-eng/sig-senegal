const CACHE_NAME = 'sig-senegal-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/app.css',
  '/css/leaflet.css',
  '/css/L.Control.Layers.Tree.css',
  '/css/L.Control.Locate.min.css',
  '/css/qgis2web.css',
  '/css/fontawesome-all.min.css',
  '/css/MarkerCluster.css',
  '/css/MarkerCluster.Default.css',
  '/css/leaflet.photon.css',
  '/css/leaflet-measure.css',
  '/js/app.js',
  '/js/config.js',
  '/js/utils.js',
  '/js/leaflet.js',
  '/js/L.Control.Layers.Tree.min.js',
  '/js/L.Control.Locate.min.js',
  '/js/leaflet.rotatedMarker.js',
  '/js/leaflet.pattern.js',
  '/js/leaflet-hash.js',
  '/js/Autolinker.min.js',
  '/js/rbush.min.js',
  '/js/labelgun.min.js',
  '/js/labels.js',
  '/js/leaflet.photon.js',
  '/js/leaflet-measure.js',
  '/js/leaflet.markercluster.js',
  '/js/qgis2web_expressions.js',
  '/data/Region_0.js',
  '/data/Departement_1.js',
  '/data/Arrondissement_2.js',
  '/data/Routes_3.js',
  '/data/Hydrographie_4.js',
  '/data/localites_5.js',
  '/manifest.json'
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