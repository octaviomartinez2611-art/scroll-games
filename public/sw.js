// Swipe Arcade sin internet: guarda la app en el teléfono.
// La página: primero la red (así llegan las novedades); si no hay internet o tarda más de 3 s, la guardada.
// /api/* nunca se guarda: cuenta, amigos y mensajes siempre van al servidor.
const CACHE = "sa-v1";
const FILES = ["/", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
function fromNet(req, key) {
  return fetch(req).then((r) => { if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(key || req, cp)); } return r; });
}
self.addEventListener("fetch", (e) => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== "GET" || u.origin !== location.origin || u.pathname.startsWith("/api/")) return;
  if (req.mode === "navigate" || u.pathname === "/" || u.pathname === "/index.html") {
    e.respondWith(new Promise((ok) => {
      let done = false; const fall = () => caches.match("/").then((c) => { if (!done && c) { done = true; ok(c); } });
      const t = setTimeout(fall, 3000);
      fromNet(req, "/").then((r) => { clearTimeout(t); if (!done) { done = true; ok(r); } }).catch(() => { clearTimeout(t); caches.match("/").then((c) => { if (!done) { done = true; ok(c || Response.error()); } }); });
    }));
    return;
  }
  e.respondWith(caches.match(req).then((c) => c || fromNet(req)));
});
