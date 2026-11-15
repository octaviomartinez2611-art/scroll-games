// Avisos del algoritmo varias veces por día (10, 13, 16, 19 y 21 h de Argentina): rota entre
// un juego nuevo para vos, volver a tu favorito y romper tu récord. Nunca de noche.
import { getStore } from "@netlify/blobs";
import { pushTo, pickFor, recoText, favFor, recFor, favText, recText } from "../lib/push.mjs";
import CAT from "../lib/catalog.mjs";

export default async () => {
  const st = getStore({ name: "arcade", consistency: "strong" }), now = Date.now(), slot = Math.floor(now / 3600e3);
  const tr = ((await st.get("agg/trends", { type: "json" })) || {}).data || {};
  const { blobs } = await st.list({ prefix: "p/" });
  let n = 0;
  for (const b of blobs) {
    const user = b.key.slice(2);
    try {
      const last = (await st.get("pr/" + user, { type: "json" })) || { t: 0, ids: [] };
      if (now - last.t < 2 * 3600e3) continue;
      const P = (await st.get("st/" + user, { type: "json" })) || {};
      if (P.ts && now - P.ts < 20 * 60 * 1000) continue; // está jugando ahora
      const skip = new Set(last.ids || []), k = slot + user.length, kinds = ["reco", "fav", "reco", "rec"];
      let msg = null;
      for (let i = 0; i < 4 && !msg; i++) {
        const kind = kinds[(k + i) % 4];
        if (kind === "reco") { const r = pickFor(P, tr, CAT); if (r && !skip.has(r.id)) msg = { id: r.id, body: recoText(CAT, r, k) }; }
        else if (kind === "fav") { const id = favFor(P, CAT, now, skip); if (id) msg = { id, body: favText(CAT, id, k) }; }
        else { const id = recFor(P, CAT, skip); if (id) msg = { id, body: recText(CAT, id, P.best[id], k) }; }
      }
      if (!msg) continue;
      if (await pushTo(st, user, { title: "Toki", body: msg.body, game: msg.id, tag: "reco" })) n++;
      await st.setJSON("pr/" + user, { t: now, ids: (last.ids || []).concat(msg.id).slice(-12) });
    } catch (e) { console.error(user, e); }
  }
  console.log("avisos:", n);
  return new Response("ok");
};
export const config = { schedule: "0 0,13,16,19,22 * * *" };
