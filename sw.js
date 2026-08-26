/* ゼロから筋トレ — オフライン用サービスワーカー
   全ファイルをキャッシュして、電波がなくても動くようにする。 */
const CACHE = 'zerokintore-v1';
const ASSETS = ['./','./index.html','./manifest.json','./icon-180.png','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(a => c.add(a)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;
  // network-first: 更新があれば取り込み、オフラインならキャッシュを返す
  // cache:'no-cache' = ブラウザのHTTPキャッシュを信用せず、毎回サーバーに「変わった？」と聞く（古い版を掴む事故を防ぐ）
  e.respondWith(
    fetch(req, { cache: 'no-cache' }).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); return res; })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
