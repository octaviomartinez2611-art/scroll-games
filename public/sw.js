// Toki sin internet: guarda la app en el teléfono.
// La página: se abre al toque con la versión guardada y, mientras jugás, se baja la nueva en segundo plano
// (la novedad aparece la próxima vez que abrís). Si todavía no hay nada guardado, va a la red.
// /api/* nunca se guarda: cuenta, amigos y mensajes siempre van al servidor.
const CACHE = "sa-v3";
const FILES = ["/", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
function fromNet(req, key) {
  return fetch(key ? new Request(key, { cache: "no-cache", credentials: "same-origin" }) : req).then((r) => { if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(key || req, cp)); } return r; });
}
self.addEventListener("fetch", (e) => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== "GET" || u.origin !== location.origin || u.pathname.startsWith("/api/")) return;
  if (req.mode === "navigate" || u.pathname === "/" || u.pathname === "/index.html") {
    const net = fromNet(req, "/");
    e.waitUntil(net.catch(() => {}));
    e.respondWith(caches.match("/").then((c) => c || net).catch(() => net));
    return;
  }
  e.respondWith(caches.match(req).then((c) => c || fromNet(req)));
});
