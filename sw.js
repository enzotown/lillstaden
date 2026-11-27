// Offline-cache: appen fungerar efter första besöket, även utan nät.
const CACHE = 'marre-lillstaden-v2';
const ASSETS = ["kotten.js", "delad.js", "engine.js", "icon-180.png", "icon-192.png", "icon-32.png", "icon-512.png", "icon.svg", "index.html", "lista.js", "p5.min.js", "rakna.js", "sagor-data.js", "sagor-p3.js", "sagor-p4.js", "sagor-p5.js", "sagor-ui.js", "scen-bageri.js", "scen-bibliotek.js", "scen-bondgard.js", "scen-brand.js", "scen-buss.js", "scen-djur.js", "scen-doktor.js", "scen-fiske.js", "scen-frisor.js", "scen-fritids.js", "scen-park.js", "scen-pizzeria.js", "scen-skola.js", "scen-tand.js", "varv.js"];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => {
      const copy = r.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return r;
    }).catch(() => caches.match(req).then((r) => r || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => {
    if (r && r.ok) {
      const copy = r.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
    }
    return r;
  })));
});
