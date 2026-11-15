// Una vez por día (18 h de Argentina) le manda a cada uno un juego elegido por el algoritmo.
import { getStore } from "@netlify/blobs";
import { pushTo, pickFor, recoText } from "../lib/push.mjs";
import CAT from "../lib/catalog.mjs";

export default async () => {
  const st = getStore({ name: "arcade", consistency: "strong" }), now = Date.now(), day = Math.floor(now / 86400000);
  const tr = ((await st.get("agg/trends", { type: "json" })) || {}).data || {};
  const { blobs } = await st.list({ prefix: "p/" });
  let n = 0;
  for (const b of blobs) {
    const user = b.key.slice(2);
    try {
      const last = await st.get("pr/" + user, { type: "json" });
      if (last && now - last.t < 20 * 3600 * 1000) continue;
      const P = (await st.get("st/" + user, { type: "json" })) || {};
      if (P.ts && now - P.ts < 20 * 60 * 1000) continue; // está jugando ahora
      const r = pickFor(P, tr, CAT); if (!r) continue;
      if (await pushTo(st, user, { title: "Toki", body: recoText(CAT, r, day + user.length), game: r.id, tag: "reco" })) n++;
      await st.setJSON("pr/" + user, { t: now, id: r.id });
    } catch (e) { console.error(user, e); }
  }
  console.log("avisos del día:", n);
  return new Response("ok");
};
export const config = { schedule: "0 21 * * *" };
