"use strict";

    const cacheName = 'GinkoBus-v1';
    const appShellFiles = [
    './index.html',
    './app.js',
    './style.css',
    './sw.js',
    './icons/icon-32.png',
    './icons/icon-64.png',
    './icons/icon-96.png',
    './icons/icon-128.png',
    './icons/icon-168.png',
    './icons/icon-180.png',
    './icons/icon-192.png',
    './icons/icon-256.png',
    './icons/icon-512.png'
    ];

    self.addEventListener('install', (e) => {
        console.log('[Service Worker] Install');
        e.waitUntil((async () => {
          const cache = await caches.open(cacheName);
          console.log('[Service Worker] Caching all: app shell and content');
          await cache.addAll(appShellFiles);
        })());
      });

      //Chercher cache ou ailleurs sur e.request.url 
      self.addEventListener('fetch', (e) => {

        if(appShellFiles.some(file=> e.request.url.endsWith(file.substr(2)) && !e.request.url.endsWith("app.js"))){
            console.log(`[Service Worker] Loading from cache: ${e.request.url}`);
            e.respondWith(caches.match(e.request));
        }else{
            e.respondWith(fetch(e.request)
                .then((response)=>{
                    return caches.open(cacheName).then((cache)=>{
                        console.log(`[Service Worker] Fetching from network and caching ressource: ${e.request.url}`);
                        cache.put(e.request,response.clone());
                        return response;
                    });
                }).catch(function(){
                    return cache.match(e.request).then((r)=>{
                        console.log(`[Service Worker] Looking  for ressources in cache: ${e.request.url}`);
                        return r;
                    });
                })
            );
        }
      });
