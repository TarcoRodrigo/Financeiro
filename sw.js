var CACHE='fx86-v1';
var LISTA=['./','./index.html','./style.css','./app.js','./manifest.json','./icone-192.png','./icone-512.png'];
function abrirCache(){return caches.open(CACHE);}
self.addEventListener('install',function(ev){ev.waitUntil(abrirCache().then(function(cache){return cache.addAll(LISTA);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(ev){ev.waitUntil(caches.keys().then(function(nomes){return Promise.all(nomes.filter(function(n){return n!==CACHE;}).map(function(n){return caches.delete(n);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(ev){if(ev.request.method!=='GET')return;ev.respondWith(caches.match(ev.request).then(function(resp){return resp||fetch(ev.request);}));});
