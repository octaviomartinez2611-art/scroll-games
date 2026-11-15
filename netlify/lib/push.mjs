// Avisos al teléfono (Web Push). La clave del servidor se genera sola la primera vez y queda guardada
// en Blobs (cfg/vapid); nunca va al repo. Suscripciones: p/<usuario> = lista de teléfonos (máx. 5).
import webpush from "web-push";

const SUBJECT = "https://swipe-arcade-juegos.netlify.app";
export async function vapid(st) {
  let v = await st.get("cfg/vapid", { type: "json" });
  if (!v) { const k = webpush.generateVAPIDKeys(); const r = await st.setJSON("cfg/vapid", k, { onlyIfNew: true }); v = r.modified ? k : await st.get("cfg/vapid", { type: "json" }); }
  return v;
}
export async function addSub(st, user, sub) {
  const list = ((await st.get("p/" + user, { type: "json" })) || []).filter((s) => s.endpoint !== sub.endpoint);
  list.push({ endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } });
  await st.setJSON("p/" + user, list.slice(-5));
}
export async function rmSub(st, user, endpoint) {
  const list = ((await st.get("p/" + user, { type: "json" })) || []).filter((s) => s.endpoint !== endpoint);
  if (list.length) await st.setJSON("p/" + user, list); else await st.delete("p/" + user);
}
export async function pushTo(st, user, payload) {
  const subs = await st.get("p/" + user, { type: "json" });
  if (!subs || !subs.length) return 0;
  const v = await vapid(st); webpush.setVapidDetails(SUBJECT, v.publicKey, v.privateKey);
  const keep = []; let sent = 0;
  for (const s of subs) {
    try { await webpush.sendNotification(s, JSON.stringify(payload), { TTL: 12 * 3600, timeout: 5000 }); keep.push(s); sent++; }
    catch (e) { if (e.statusCode !== 404 && e.statusCode !== 410) keep.push(s); }
  }
  if (keep.length !== subs.length) { if (keep.length) await st.setJSON("p/" + user, keep); else await st.delete("p/" + user); }
  return sent;
}

// "Voz del algoritmo": elige un juego que todavía no jugaste y que le gusta a la gente con tus gustos.
const fam = (id) => (id.indexOf("_") > 0 ? id.slice(0, id.indexOf("_")) : id);
export function pickFor(P, tr, cat) {
  const st = (P && P.st) || {}, L = (P && P.likes) || {}, S = (P && P.saved) || {}, hist = new Set(((P && P.hist) || []).slice(-60));
  const mine = [];
  for (const id in st) {
    if (!cat[id]) continue; const s = st[id] || {}, n = Math.max(s.n || 0, 1);
    mine.push([id, (Math.min(s.t || 0, 3000) / 40 + 0.8 * (s.r || 0) + 1.2 * (s.nb || 0) + 0.8 * (s.rec || 0) - 1.5 * (s.k || 0) + (L[id] ? 4 : 0) + (S[id] ? 6 : 0)) / n]);
  }
  mine.sort((a, b) => b[1] - a[1]); const top = mine.slice(0, 6).filter((x) => x[1] > 0.5);
  const pop = (tr && tr.pop) || {}, nb = (tr && tr.nb) || {}, cand = [];
  for (const id in cat) {
    if ((st[id] && (st[id].n || 0) > 0) || hist.has(id)) continue;
    let sc = (pop[id] || 0) * 0.6, why = null, wb = 0;
    for (const [g, e] of top) {
      for (const [b, w] of nb[g] || []) if (b === id) { const v = w * e; sc += v; if (v > wb) { wb = v; why = g; } }
      if (fam(g) === fam(id)) { const v = 0.4 * e; sc += v; if (v > wb) { wb = v; why = g; } }
    }
    cand.push([id, sc + Math.random() * 0.3, why]);
  }
  if (!cand.length) return null;
  cand.sort((a, b) => b[1] - a[1]); const q = Math.random(), c = cand[Math.min(cand.length - 1, q < 0.55 ? 0 : q < 0.8 ? 1 : q < 0.92 ? 2 : 3)];
  return { id: c[0], why: c[2] };
}
export function recoText(cat, r, day) {
  const n = cat[r.id], w = r.why && cat[r.why];
  const A = w
    ? ["Como te enganchó " + w + ", este te va a encantar: " + n, "Si te gustó " + w + ", probá " + n + ". Es para vos.", "El algoritmo encontró uno para vos: " + n + ". Parecido a " + w + "."]
    : ["Juego nuevo para vos: " + n + ". Te va a encantar.", n + " está enganchando a todos. ¿Te animás?", "El algoritmo te eligió " + n + ". Probalo."];
  return A[day % A.length];
}

// Más avisos en el día: además del juego nuevo, "volvé a tu favorito" y "rompé tu récord".
function engs(P, cat) {
  const st = (P && P.st) || {}, L = (P && P.likes) || {}, S = (P && P.saved) || {}, out = [];
  for (const id in st) { if (!cat[id]) continue; const s = st[id] || {}, n = Math.max(s.n || 0, 1); out.push([id, (Math.min(s.t || 0, 3000) / 40 + 0.8 * (s.r || 0) + 1.2 * (s.nb || 0) + 0.8 * (s.rec || 0) - 1.5 * (s.k || 0) + (L[id] ? 4 : 0) + (S[id] ? 6 : 0)) / n, s.ls || 0]); }
  return out.sort((a, b) => b[1] - a[1]);
}
export function favFor(P, cat, now, skip) { const c = engs(P, cat).filter((x) => x[1] > 0.8 && now - x[2] > 6 * 3600e3 && !skip.has(x[0])).slice(0, 5); return c.length ? c[Math.floor(Math.random() * c.length)][0] : null; }
export function recFor(P, cat, skip) { const b = (P && P.best) || {}, c = Object.keys(b).filter((id) => cat[id] && b[id] >= 5 && !skip.has(id)).sort((x, y) => b[y] - b[x]).slice(0, 6); return c.length ? c[Math.floor(Math.random() * c.length)] : null; }
export function favText(cat, id, k) { const n = cat[id]; return ["Hace rato no jugás " + n + ". Tu favorito te espera.", "¿Una de " + n + "? Siempre te engancha.", n + " te extraña. Una partidita y listo."][k % 3]; }
export function recText(cat, id, best, k) { const n = cat[id]; return ["Tu récord en " + n + " es " + best + ". ¿Hoy lo rompés?", "Estás a nada de superar tu récord en " + n + " (" + best + ").", "Hoy es el día: tu récord de " + n + " (" + best + ") puede caer."][k % 3]; }
