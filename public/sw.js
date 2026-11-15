// Toki sin internet: guarda la app en el teléfono.
// La página: se abre al toque con la versión guardada y, mientras jugás, se baja la nueva en segundo plano
// (la novedad aparece la próxima vez que abrís). Si todavía no hay nada guardado, va a la red.
// /api/* nunca se guarda: cuenta, amigos y mensajes siempre van al servidor.
const CACHE = "sa-v4";
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

// Avisos: mensajes de amigos y el juego del día. Al tocar el aviso abre el chat o el juego.
self.addEventListener("push", (e) => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Toki", { body: d.body || "", icon: "/icon-192.png", badge: "/icon-192.png", tag: d.tag || undefined, renotify: !!d.tag, data: { chat: d.chat || null, game: d.game || null } }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close(); const d = e.notification.data || {};
  const url = d.chat ? "/?chat=" + encodeURIComponent(d.chat) : d.game ? "/#" + String(d.game).replace(/_/g, "-") : "/";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
    for (const c of cs) if ("focus" in c) { c.postMessage(d); return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
