// API de Swipe Arcade: cuentas (usuario + PIN), estado del jugador, amigos, mensajes y reportes.
// Todo se guarda en Netlify Blobs, con claves separadas para no pisar datos entre escrituras:
//   u/<usuario>              cuenta (salt + hash del PIN)
//   s/<token>                sesión
//   st/<usuario>             estado del jugador (algoritmo, likes, guardados, récords, foto)
//   f/<usuario>/<amigo>      amistad (una clave por lado)
//   m/<a~b>/<tiempo>-<rand>  un mensaje por clave (solo se agregan, nunca se reescriben)
//   r/<tiempo>-<rand>        reporte de un mensaje
//   agg/trends               gustos de todos juntos (sin nombres), se recalcula cada 10 minutos
import { getStore } from "@netlify/blobs";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

const NAME = /^[a-z0-9_.]{3,16}$/;
const J = (d, s = 200) => Response.json(d, { status: s });
const store = () => getStore({ name: "arcade", consistency: "strong" });
const hashPin = (pin, salt) => scryptSync(pin, salt, 32).toString("hex");
const conv = (a, b) => (a < b ? a + "~" + b : b + "~" + a);
const rid = () => Date.now().toString().padStart(14, "0") + "-" + randomBytes(3).toString("hex");
const same = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && timingSafeEqual(x, y); };

async function newSession(st, u) { const t = randomBytes(24).toString("hex"); await st.setJSON("s/" + t, { u, t: Date.now() }); return t; }
// La sesión también se guarda en una cookie de un año: así el navegador te recuerda aunque borre el almacenamiento de la página.
const COOKIE = (t) => "sa=" + t + "; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax";
function tokenOf(req) {
  const h = req.headers.get("x-token");
  if (h) return h;
  const m = (req.headers.get("cookie") || "").match(/(?:^|;\s*)sa=([a-f0-9]{48})/);
  return m ? m[1] : "";
}
const withCookie = (d, t) => new Response(JSON.stringify(d), { status: 200, headers: { "content-type": "application/json", "set-cookie": COOKIE(t) } });
async function who(req, st) {
  const t = tokenOf(req);
  if (!/^[a-f0-9]{48}$/.test(t)) return null;
  const s = await st.get("s/" + t, { type: "json" });
  return s ? s.u : null;
}
// Aprendizaje colectivo (como "a los que les gusta esto también les gusta…"):
// por cada jugador mira cuánto lo enganchó cada juego por vez que le apareció; con eso arma
// pop = qué tan bueno es cada juego para todos, y nb = juegos que les gustan a las mismas personas.
function engOf(s, likes, saved, id) {
  const n = Math.max(s.n || 0, (s.t > 2 || s.k > 0) ? 1 : 0); if (!n) return null;
  const e = Math.min(s.t || 0, 3000) / 40 + 0.8 * (s.r || 0) + 1.2 * (s.nb || 0) + 0.8 * (s.rec || 0) - 1.5 * (s.k || 0) + (likes[id] ? 4 : 0) + (saved[id] ? 6 : 0);
  return e / n;
}
export function computeTrends(states) {
  const sum = {}, cnt = {}, liked = [];
  for (const P of states) {
    if (!P || !P.st) continue;
    const L = P.likes || {}, S = P.saved || {}, mine = [];
    for (const id in P.st) { const e = engOf(P.st[id] || {}, L, S, id); if (e === null) continue; sum[id] = (sum[id] || 0) + e; cnt[id] = (cnt[id] || 0) + 1; if (e > 0.8) mine.push([id, e]); }
    mine.sort((a, b) => b[1] - a[1]); liked.push(mine.slice(0, 40).map((x) => x[0]));
  }
  const pop = {}; for (const id in sum) pop[id] = +(sum[id] / (cnt[id] + 2)).toFixed(3);
  const lc = {}, co = {};
  for (const L of liked) {
    for (const a of L) lc[a] = (lc[a] || 0) + 1;
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const a = L[i], b = L[j]; (co[a] = co[a] || {})[b] = (co[a][b] || 0) + 1; (co[b] = co[b] || {})[a] = (co[b][a] || 0) + 1; }
  }
  const nb = {};
  for (const a in co) { const arr = []; for (const b in co[a]) { const sm = co[a][b] / Math.sqrt(lc[a] * lc[b]); if (co[a][b] >= 2 && sm > 0.15) arr.push([b, +sm.toFixed(3)]); } arr.sort((x, y) => y[1] - x[1]); if (arr.length) nb[a] = arr.slice(0, 15); }
  return { pop, nb, users: liked.length };
}
async function isFriend(st, a, b) { return (await st.get("f/" + a + "/" + b)) !== null; }

export default async (req) => {
  const st = store(), url = new URL(req.url), path = url.pathname.replace(/^\/api\//, ""), m = req.method;
  let body = {};
  if (m !== "GET") { try { body = await req.json(); } catch { body = {}; } }
  try {
    if (path === "register" && m === "POST") {
      const name = String(body.name || "").trim().toLowerCase(), pin = String(body.pin || "");
      if (!NAME.test(name)) return J({ error: "El usuario tiene que tener de 3 a 16 caracteres: letras, números, punto o guion bajo." }, 400);
      if (!/^\d{4,6}$/.test(pin)) return J({ error: "El PIN tiene que ser de 4 a 6 números." }, 400);
      const salt = randomBytes(16).toString("hex");
      const { modified } = await st.setJSON("u/" + name, { name, salt, hash: hashPin(pin, salt), created: Date.now() }, { onlyIfNew: true });
      if (!modified) return J({ error: "Ese usuario ya existe. Probá otro." }, 409);
      const tk = await newSession(st, name);
      return withCookie({ token: tk, name, state: null, admin: false }, tk);
    }
    if (path === "login" && m === "POST") {
      const name = String(body.name || "").trim().toLowerCase(), pin = String(body.pin || "");
      const fk = "x/" + name, fail = NAME.test(name) ? await st.get(fk, { type: "json" }) : null;
      if (fail && fail.n >= 8 && Date.now() - fail.t < 600000) return J({ error: "Demasiados intentos. Esperá 10 minutos." }, 429);
      const user = NAME.test(name) ? await st.get("u/" + name, { type: "json" }) : null;
      if (!user || !/^\d{4,6}$/.test(pin) || !same(hashPin(pin, user.salt), user.hash)) {
        if (user) await st.setJSON(fk, { n: fail && Date.now() - fail.t < 600000 ? fail.n + 1 : 1, t: Date.now() });
        return J({ error: "Usuario o PIN incorrectos." }, 401);
      }
      if (fail) await st.delete(fk);
      const tk = await newSession(st, name);
      return withCookie({ token: tk, name, state: await st.get("st/" + name, { type: "json" }), admin: !!user.admin }, tk);
    }

    if (path === "trends" && m === "GET") {
      const c = await st.get("agg/trends", { type: "json" });
      if (c && Date.now() - c.at < 10 * 60 * 1000) return J(c.data);
      const { blobs } = await st.list({ prefix: "st/" });
      const states = await Promise.all(blobs.map((b) => st.get(b.key, { type: "json" }).catch(() => null)));
      const data = computeTrends(states);
      await st.setJSON("agg/trends", { at: Date.now(), data });
      return J(data);
    }
    const me = await who(req, st);
    if (!me) return J({ error: "Tenés que entrar de nuevo." }, 401);

    if (path === "me" && m === "GET") {
      const user = await st.get("u/" + me, { type: "json" });
      const tk = tokenOf(req);
      return withCookie({ token: tk, name: me, state: await st.get("st/" + me, { type: "json" }), admin: !!(user && user.admin) }, tk);
    }
    if (path === "logout" && m === "POST") {
      await st.delete("s/" + tokenOf(req));
      return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json", "set-cookie": "sa=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax" } });
    }
    if (path === "state" && m === "PUT") {
      const s = JSON.stringify(body.state || {});
      if (s.length > 400000) return J({ error: "Datos demasiado grandes." }, 413);
      await st.set("st/" + me, s);
      return J({ ok: true });
    }
    if (path === "friends" && m === "GET") {
      const pre = "f/" + me + "/", { blobs } = await st.list({ prefix: pre });
      const friends = await Promise.all(blobs.map(async (b) => {
        const n = b.key.slice(pre.length), { blobs: ms } = await st.list({ prefix: "m/" + conv(me, n) + "/" });
        const keys = ms.map((x) => x.key).sort(), lastKey = keys[keys.length - 1] || "";
        return { name: n, lastKey, last: lastKey ? await st.get(lastKey, { type: "json" }) : null };
      }));
      friends.sort((a, b) => (b.lastKey > a.lastKey ? 1 : -1));
      return J({ friends });
    }
    if (path === "bests" && m === "GET") {
      const pre = "f/" + me + "/", { blobs } = await st.list({ prefix: pre }), bests = {};
      await Promise.all(blobs.map(async (b) => { const n = b.key.slice(pre.length), s = await st.get("st/" + n, { type: "json" }); bests[n] = (s && s.best) || {}; }));
      return J({ bests });
    }
    if (path === "friends" && m === "POST") {
      const n = String(body.name || "").trim().replace(/^@/, "").toLowerCase();
      if (n === me) return J({ error: "No te podés agregar a vos mismo." }, 400);
      if (!NAME.test(n) || (await st.get("u/" + n)) === null) return J({ error: "No existe ningún usuario con ese nombre." }, 404);
      const { blobs } = await st.list({ prefix: "f/" + me + "/" });
      if (blobs.length >= 60) return J({ error: "Llegaste al máximo de amigos." }, 400);
      await st.setJSON("f/" + me + "/" + n, { t: Date.now() });
      await st.setJSON("f/" + n + "/" + me, { t: Date.now() });
      return J({ ok: true, name: n });
    }
    if (path === "friends" && m === "DELETE") {
      const n = String(body.name || "").toLowerCase();
      if (NAME.test(n)) await st.delete("f/" + me + "/" + n);
      return J({ ok: true });
    }
    if (path === "msgs" && m === "GET") {
      const n = String(url.searchParams.get("with") || "").toLowerCase(), after = String(url.searchParams.get("after") || "");
      if (!NAME.test(n) || !(await isFriend(st, me, n))) return J({ error: "No son amigos." }, 403);
      const { blobs } = await st.list({ prefix: "m/" + conv(me, n) + "/" });
      const keys = blobs.map((b) => b.key).filter((k) => k > after).sort().slice(-60);
      const msgs = (await Promise.all(keys.map(async (k) => { const v = await st.get(k, { type: "json" }); return v ? { k, ...v } : null; }))).filter(Boolean);
      return J({ msgs });
    }
    if (path === "msgs" && m === "POST") {
      const n = String(body.to || "").toLowerCase();
      if (!NAME.test(n) || !(await isFriend(st, me, n))) return J({ error: "No son amigos." }, 403);
      const msg = { from: me, t: Date.now() };
      if (body.game) { if (!/^[a-z0-9_]{1,24}$/.test(String(body.game))) return J({ error: "Juego inválido." }, 400); msg.game = String(body.game); }
      else { const text = String(body.text || "").trim().slice(0, 300); if (!text) return J({ error: "Mensaje vacío." }, 400); msg.text = text; }
      const k = "m/" + conv(me, n) + "/" + rid();
      await st.setJSON(k, msg);
      return J({ msg: { k, ...msg } });
    }
    if (path === "report" && m === "POST") {
      const n = String(body.with || "").toLowerCase(), k = String(body.k || "");
      if (!NAME.test(n) || !k.startsWith("m/" + conv(me, n) + "/")) return J({ error: "Reporte inválido." }, 400);
      const msg = await st.get(k, { type: "json" });
      if (!msg) return J({ error: "Ese mensaje ya no existe." }, 404);
      await st.setJSON("r/" + rid(), { by: me, k, msg, t: Date.now() });
      return J({ ok: true });
    }
    if (path === "admin" && m === "POST") {
      const code = Netlify.env.get("ADMIN_CODE");
      if (!code || !same(String(body.code || ""), code)) return J({ error: "Código incorrecto." }, 403);
      const user = await st.get("u/" + me, { type: "json" });
      user.admin = true; await st.setJSON("u/" + me, user);
      return J({ ok: true });
    }
    const user = await st.get("u/" + me, { type: "json" });
    const admin = !!(user && user.admin);
    if (path === "reports" && m === "GET") {
      if (!admin) return J({ error: "Solo administradores." }, 403);
      const { blobs } = await st.list({ prefix: "r/" });
      const keys = blobs.map((b) => b.key).sort().slice(-100);
      const reports = (await Promise.all(keys.map(async (r) => { const v = await st.get(r, { type: "json" }); return v ? { r, ...v } : null; }))).filter(Boolean);
      return J({ reports });
    }
    if (path === "resolve" && m === "POST") {
      if (!admin) return J({ error: "Solo administradores." }, 403);
      const r = String(body.r || ""); if (!r.startsWith("r/")) return J({ error: "Inválido." }, 400);
      const rep = await st.get(r, { type: "json" });
      if (rep && body.del && String(rep.k).startsWith("m/")) await st.delete(rep.k);
      await st.delete(r);
      return J({ ok: true });
    }
    return J({ error: "No encontrado." }, 404);
  } catch (e) {
    console.error(e);
    return J({ error: "Error del servidor. Probá de nuevo." }, 500);
  }
};

export const config = { path: "/api/*" };
