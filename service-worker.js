const CACHE_NAME = 'teste-pezinho-sus-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

/*
  IMPORTANTE:
  Durante desenvolvimento, NÃO cacheamos arquivos.
  Isso evita tela branca ao apertar F5.
*/
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
