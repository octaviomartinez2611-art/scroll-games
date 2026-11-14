  /* Algoritmo del feed (versión 2): aprende qué te gusta y te lo trae al toque.
     1. Cuánto te gustó cada juego (gusto): segundos jugados, veces que seguiste jugando después de perder,
        veces que quedaste cerca de tu récord o lo rompiste, like, guardado y enviado suman; pasarlo sin tocar resta.
        Se divide por las veces que te apareció (lo que importa es cuánto te engancha cada vez, no cuántas veces salió).
     2. Parecidos: lo que te gusta de un juego se contagia a los de su misma familia (todas las versiones de Carriles)
        y a los que se juegan igual (arrastrar, tocar, mantener, deslizar). Así un juego nuevo ya sale con tu gusto estimado.
     3. Descubrir: los juegos que nunca viste tienen un empujón que se achica a medida que ves más juegos.
     4. Que no canse: no repite los últimos 15, baja juegos de la misma familia que acabás de ver y alterna controles.
     5. Ni muy fácil ni muy frustrante: si nunca perdés baja un poco, si morís siempre en segundos baja un poco,
        si quedás cerca de tu récord sube (estás por superarlo).
     6. Vuelve lo que te gusta: tus favoritos reaparecen si hace más de un día que no los ves. Los juegos de tus amigos suben un poco.
     7. Se adapta en el momento: cada vez que pasás de juego se recalculan los que vienen. Si estás pasando todo rápido,
        te muestra más tus favoritos; si estás enganchado, te muestra más juegos nuevos.
     8. Lo viejo pesa menos: cada día lo aprendido se achica un 3 %, así tus gustos pueden cambiar.
     9. Aprende de todos (TR, del servidor): qué juegos enganchan a todo el mundo (pop) y qué juegos les gustan a las
        mismas personas (nb: "a los que les gusta este también les gusta…"). Un jugador nuevo arranca con los mejores.
    10. La mayoría de lo que aparece es lo que predice que te gusta; una parte chica es para descubrir, y esa parte
        se achica a medida que te conoce (de 35 % al principio a 12 %). */
  var TR = { pop: {}, nb: {} };
  function famOf(id) { var u = id.indexOf("_"); return u > 0 ? id.slice(0, u) : "1:" + id; }
  function ctlOf(g) { return (g.ctor && g.ctor.prototype && g.ctor.prototype.ctl) || "tap"; }
  (function decay() { var now = Date.now(), d = P.decayAt ? Math.floor((now - P.decayAt) / 864e5) : 0; if (!P.decayAt) { P.decayAt = now; return; } if (d < 1) return; var f = Math.pow(0.97, Math.min(d, 60)), k, s, q; for (k in P.st) { s = P.st[k]; for (q in s) if (q !== "ls" && typeof s[q] === "number") s[q] *= f; } P.decayAt = now; })();
  function rawE(id) {
    var s = P.st[id]; if (!s) return 0;
    var e = Math.min(s.t, 3000) / 40 + 0.8 * s.r + 1.2 * (s.nb || 0) + 0.8 * (s.rec || 0) - 1.5 * s.k;
    if (P.likes[id]) e += 4; if (P.saved[id]) e += 6;
    return e;
  }
  function viewsOf(id) { var s = P.st[id]; if (!s) return 0; return Math.max(s.n || 0, s.t > 2 || s.k > 0 ? 1 : 0); }
  var RECENT_FAST = [];
  function scoreAll() {
    var fam = {}, ctl = {}, glob = { e: 0, n: 0 }, i, g, id, e, n, f, c, totalViews = 0;
    for (i = 0; i < CATALOG.length; i++) {
      g = CATALOG[i]; id = g.id; e = rawE(id); n = viewsOf(id); totalViews += n;
      f = famOf(id); c = ctlOf(g);
      (fam[f] = fam[f] || { e: 0, n: 0 }); fam[f].e += e; fam[f].n += n;
      (ctl[c] = ctl[c] || { e: 0, n: 0 }); ctl[c].e += e; ctl[c].n += n;
      glob.e += e; glob.n += n;
    }
    var P0 = 0.6, gE = (glob.e + 3 * P0) / (glob.n + 3), out = {}, cf = {}, cfd = {}, h, j, me;
    for (i = 0; i < CATALOG.length; i++) { h = CATALOG[i].id; n = viewsOf(h); if (!n) continue; me = rawE(h) / n; var nbs = TR.nb && TR.nb[h]; if (me > 0.8 && nbs) for (j = 0; j < nbs.length; j++) { cf[nbs[j][0]] = (cf[nbs[j][0]] || 0) + nbs[j][1] * me; cfd[nbs[j][0]] = (cfd[nbs[j][0]] || 0) + nbs[j][1]; } }
    for (i = 0; i < CATALOG.length; i++) {
      g = CATALOG[i]; id = g.id; f = fam[famOf(id)]; c = ctl[ctlOf(g)]; n = viewsOf(id);
      var fE = (f.e + 2 * gE) / (f.n + 2), cE = (c.e + 3 * gE) / (c.n + 3), pp = TR.pop && TR.pop[id] !== undefined ? TR.pop[id] : gE, cfE = cfd[id] ? cf[id] / cfd[id] : fE, pri = 0.4 * fE + 0.2 * cE + 0.25 * cfE + 0.15 * pp;
      var own = (rawE(id) + 2 * pri) / (n + 2), s = P.st[id];
      if (s && s.l >= 2) { if ((s.q || 0) / s.l > 0.6) own -= 0.4; if (s.t / (s.h + 1) > 60) own -= 0.3; }
      out[id] = { own: own, pri: pri, n: n };
    }
    out._views = totalViews;
    return out;
  }
  function pickNext(upto) {
    var lim = upto === undefined ? slides.length : upto, recent = {}, lastF = [], k, tot = 0, sc = scoreAll(), now = Date.now();
    for (k = Math.max(0, lim - 15); k < lim; k++) recent[slides[k].cfg.id] = 1;
    for (k = Math.max(0, lim - 4); k < lim; k++) lastF.push(famOf(slides[k].cfg.id));
    var lastC = []; for (k = Math.max(0, lim - 3); k < lim; k++) lastC.push(ctlOf(slides[k].cfg));
    var fast = RECENT_FAST.length >= 4 && RECENT_FAST.slice(-5).filter(function (v) { return v < 4; }).length >= 4, T = fast ? 0.28 : 0.38;
    var eps = Math.max(0.1, 0.35 - sc._views * 0.006), unseen = CATALOG.some(function (g) { return !recent[g.id] && sc[g.id].n === 0; }), explore = unseen && Math.random() < eps, any = false;
    var ws = CATALOG.map(function (g) {
      var q = sc[g.id]; if (recent[g.id]) return 0;
      var w = explore ? (q.n === 0 ? Math.exp(Math.min(q.pri, 6) / 0.6) : 0) : Math.exp(Math.min(q.own, 6) / T), f = famOf(g.id), c = ctlOf(g), s = P.st[g.id], same = 0, j;
      for (j = 0; j < lastF.length; j++) if (lastF[j] === f) same++;
      w *= Math.pow(0.6, same);
      if (lastC.length === 3 && lastC[0] === c && lastC[1] === c && lastC[2] === c) w *= 0.6;
      if (s && s.ls && q.own > 1.2 && now - s.ls > 864e5) w *= 1.3;
      if (friendsPlayed(g.id)) w *= 1.25;
      if (w > 0) any = true; tot += w; return w;
    });
    if (!any) return CATALOG[ri(0, NG)];
    var r = Math.random() * tot;
    for (k = 0; k < ws.length; k++) { r -= ws[k]; if (r <= 0) return CATALOG[k]; }
    return CATALOG[ri(0, NG)];
  }
