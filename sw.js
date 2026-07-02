// 清除所有舊快取，讓頁面永遠從網路載入最新版本
const CACHE = 'hankongbu-v0';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 不快取任何東西，全部走網路
self.addEventListener('fetch', () => {});
