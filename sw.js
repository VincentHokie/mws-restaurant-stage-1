/*
    All the interactions that concern the cache come from and are
    written in this file
*/


const expectedCaches = ['static-v1'];

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open("static-v1").then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/restaurant.html',
          '/css/styles.css',
          '/js/main.js',
          '/js/dbhelper.js',
          '/js/htmlHelper.js',
          '/js/restaurant_info.js',
        ]);
      }).catch((error) => {
        console.log("error", error)
      })
    );
  });

  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(keys => Promise.all(
        keys.map(key => {
          if (!expectedCaches.includes(key)) {
            return caches.delete(key);
          }
        })
      )).then(() => {
        console.log('New cache now ready to handle fetches!');
      })
    );
  });

  self.addEventListener('fetch', (event) => {

    if((event.request.url.indexOf('http') === 0))
      event.respondWith(
        caches.match(event.request).then((resp) => {
          return resp || fetch(event.request).then((response) => {
            let responseClone = response.clone();
            caches.open("static-v1").then((cache) => {
              cache.put(event.request, responseClone);
            });
    
            return response;
          });
        }).catch(() => {
          return caches.match('/img/1.jpg');
        })
      );
  });