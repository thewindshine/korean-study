const CACHE = 'hankongbu-v1';
const ASSETS = [
  '/korean-study/',
  '/korean-study/index.html',
  '/korean-study/manifest.json',
  '/korean-study/icon-192.svg',
  '/korean-study/icon-512.svg',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Always use network for Anthropic API calls
  if (e.request.url.includes('anthropic.com')) return;
  // Network-first for fonts, cache-first for app assets
  if (e.request.url.includes('fonts.g')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
