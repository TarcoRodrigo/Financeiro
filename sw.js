const CACHE='fx85-v8';
const ASSETS=['./','./index.html','./style.css','./app.js','./manifest.json','./icone-192.png','./icone-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c){return c.addAll(ASSETS);})
      .then(function(){return self.skipWaiting();})
  );
});
self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    }).then(function(){return self.clients.claim();})
  );
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request);}));
});
