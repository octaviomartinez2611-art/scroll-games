  /* ===== fábricas de juegos: cada una arma muchas variantes con reglas distintas ===== */
  var EXTRA = [];
  function reg(id, name, how, accent, cls) { EXTRA.push({ id: id, name: name, how: how, accent: accent, ctor: cls }); }
  var RED = "#ff4d6d", YEL = "#ffd23f", GRN = "#3ddc84", PUR = "#c77dff", ORA = "#ff9f1c", PNK = "#ff5fd2", GRY = "#8a8a8a", WHT = "#ffffff";
  var CNAMES = [["rojo", RED], ["amarillo", YEL], ["verde", GRN], ["violeta", PUR], ["naranja", ORA], ["rosa", PNK]];
  function pickOf(a) { return a[ri(0, a.length)]; }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = ri(0, i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function star(c, x, y, r, col) {
    c.fillStyle = col; c.beginPath();
    for (var i = 0; i < 10; i++) { var a = -PI / 2 + i * PI / 5, rr2 = i % 2 ? r * 0.45 : r; c.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); }
    c.closePath(); c.fill();
  }
  function sh2(c, k, x, y, r, col) { if (k === 6) star(c, x, y, r * 1.15, col); else shape(c, k % 6 === 5 ? 0 : k, x, y, r, col); }
  var SHN = ["círculo", "cuadrado", "triángulo", "rombo"];

  /* --- Atrapar --- */
  function mkCatch(o) {
    var C = G("Catch_" + o.id, {
      ctl: "drag",
      init: function () { this.bw = o.bw || 74; this.px = this.cx; this.tx = this.px; this.py = this.H - this.pb - 12; this.its = []; this.sp = 0; },
      drag: function (x) { this.tx = clamp(x, this.bw / 2, this.W - this.bw / 2); },
      mkItem: function () { var it = o.gen(); it.x = rnd(24, this.W - 24); it.y = -26; it.r = it.r || 18; return it; },
      step: function (dt) {
        this.px += (this.tx - this.px) * Math.min(1, dt * 22); this.sp -= dt;
        if (this.sp <= 0) { this.sp = Math.max(0.42, (o.iv || 0.95) - this.score * 0.01); this.its.push(this.mkItem()); }
        var v = (o.v || 210) + Math.min(170, this.score * 3.5);
        for (var i = this.its.length - 1; i >= 0; i--) {
          var it = this.its[i]; it.y += v * dt * (it.k || 1);
          if (it.y > this.py - 16 && it.y < this.py + 14 && Math.abs(it.x - this.px) < this.bw / 2 + it.r * 0.5) {
            this.its.splice(i, 1);
            if (it.good) { this.add(1); S.hit(this.score); } else { this.hurt(); if (this.state !== "play") return; }
          } else if (it.y > this.H) {
            this.its.splice(i, 1); if (it.good && o.miss) { this.hurt(); if (this.state !== "play") return; }
          }
        }
      },
      draw: function (now) {
        var c = this.ctx, i; fillR(c, this.px - this.bw / 2, this.py - 4, this.bw, 20, 6, "#fff");
        for (i = 0; i < this.its.length; i++) o.draw(c, this.its[i]);
        this.ghostDrag(this.py - 90, now);
      }
    });
    reg("c_" + o.id, o.name, o.how, o.acc, C);
  }
  function dItem(col, s, good, extra) { var it = { col: col, s: s, good: good }; if (extra) for (var k in extra) it[k] = extra[k]; return it; }
  function dDraw(c, it) { if (it.n !== undefined) { c.fillStyle = "#222"; c.beginPath(); c.arc(it.x, it.y, 20, 0, TAU); c.fill(); txt(c, String(it.n), it.x, it.y + 1, 22, "#fff"); } else if (it.egg) { c.fillStyle = "#fff"; c.beginPath(); c.ellipse(it.x, it.y, 13, 17, 0, 0, TAU); c.fill(); } else if (it.bomb) { c.fillStyle = "#3a3a3a"; c.beginPath(); c.arc(it.x, it.y, 16, 0, TAU); c.fill(); c.strokeStyle = RED; c.lineWidth = 3; c.beginPath(); c.moveTo(it.x - 6, it.y - 6); c.lineTo(it.x + 6, it.y + 6); c.moveTo(it.x + 6, it.y - 6); c.lineTo(it.x - 6, it.y + 6); c.stroke(); } else sh2(c, it.s, it.x, it.y, it.r, it.col); }
  var CC = [RED, YEL, GRN, PUR];
  var cvars = [
    ["coins", "Monedas", "Arrastrá la canasta y juntá las monedas. Las piedras grises restan una vida.", YEL, function () { return Math.random() < 0.78 ? dItem(YEL, 0, true) : dItem(GRY, 1, false); }],
    ["fruit", "Fruta madura", "Atrapá la fruta y esquivá las bombas.", ORA, function () { return Math.random() < 0.8 ? dItem(pickOf([RED, ORA, GRN, YEL]), 0, true) : dItem("#333", 0, false, { bomb: 1 }); }],
    ["eggs", "Huevos", "Atrapá todos los huevos. Si se cae uno, perdés una vida.", WHT, function () { return dItem(WHT, 0, true, { egg: 1 }); }, 1],
    ["stars", "Estrellas", "Juntá las estrellas y esquivá los pinchos.", YEL, function () { return Math.random() < 0.75 ? dItem(YEL, 6, true) : dItem(GRY, 2, false); }],
    ["pizza", "Delivery", "Atrapá los pedidos. Si se cae uno perdés una vida. Evitá las bolsas negras.", ORA, function () { return Math.random() < 0.8 ? dItem(ORA, 0, true) : dItem("#333", 1, false); }, 1],
    ["onlyred", "Solo rojos", "Atrapá solamente los rojos.", RED, function () { var c = pickOf(CC); return dItem(c, 0, c === RED); }],
    ["onlygrn", "Solo verdes", "Atrapá solamente los verdes.", GRN, function () { var c = pickOf(CC); return dItem(c, 0, c === GRN); }],
    ["notred", "Todo menos rojo", "Atrapá todo lo que no sea rojo.", PUR, function () { var c = pickOf(CC); return dItem(c, 0, c !== RED); }],
    ["even", "Solo pares", "Atrapá solamente los números pares.", GRN, function () { var n = ri(1, 10); return dItem(WHT, 0, n % 2 === 0, { n: n }); }],
    ["odd", "Solo impares", "Atrapá solamente los números impares.", PNK, function () { var n = ri(1, 10); return dItem(WHT, 0, n % 2 === 1, { n: n }); }],
    ["gt5", "Mayores a 5", "Atrapá los números mayores que 5.", ORA, function () { var n = ri(1, 10); return dItem(WHT, 0, n > 5, { n: n }); }],
    ["x3", "Caen múltiplos de 3", "Atrapá los múltiplos de 3.", PUR, function () { var n = ri(1, 13); return dItem(WHT, 0, n % 3 === 0, { n: n }); }],
    ["circ", "Solo círculos", "Atrapá solamente los círculos.", YEL, function () { var k = ri(0, 4); return dItem(WHT, k, k === 0); }],
    ["tri", "Solo triángulos", "Atrapá solamente los triángulos.", GRN, function () { var k = ri(0, 4); return dItem(WHT, k, k === 2); }],
    ["notsq", "Todo menos cuadrados", "Atrapá todo lo que no sea un cuadrado.", RED, function () { var k = ri(0, 4); return dItem(WHT, k, k !== 1); }],
    ["onlystar", "Solo estrellas", "Entre las formas, atrapá solamente las estrellas.", YEL, function () { var k = pickOf([0, 1, 2, 3, 6, 6]); return dItem(WHT, k, k === 6); }]
  ];
  cvars.forEach(function (v) { mkCatch({ id: v[0], name: v[1], how: v[2], acc: v[3], gen: v[4], miss: v[5], draw: dDraw }); });

  /* --- Esquivar --- */
  function mkDodge(o) {
    var C = G("Dodge_" + o.id, {
      ctl: "drag",
      init: function () { this.px = this.cx; this.tx = this.px; this.pr = 14; this.py = this.H - this.pb - 22; this.hz = []; this.sp = 0.6; },
      drag: function (x) { this.tx = clamp(x, this.pr, this.W - this.pr); },
      step: function (dt) {
        this.px += (this.tx - this.px) * Math.min(1, dt * 24); this.sp -= dt;
        if (this.sp <= 0) {
          this.sp = Math.max(o.min || 0.3, o.iv - this.score * 0.008); var n = o.n ? ri(o.n[0], o.n[1] + 1) : 1;
          while (n--) { var w = rnd(o.w[0], o.w[1]), h = o.sq ? w : rnd(o.h[0], o.h[1]); var hz = { x: rnd(w / 2, this.W - w / 2), y: -h, w: w, h: h, vx: rnd(-(o.dr || 0), o.dr || 0), vy: o.v + Math.min(180, this.score * 3), p: false, t: 0 }; if (o.strike) { hz.warn = 0.9; hz.y = 0; hz.h = this.H; hz.w = 46; hz.on = 0.3; } this.hz.push(hz); }
        }
        for (var i = this.hz.length - 1; i >= 0; i--) {
          var z = this.hz[i]; z.t += dt;
          if (o.strike) {
            if (z.warn > 0) { z.warn -= dt; continue; } z.on -= dt;
            if (z.on <= 0) { this.hz.splice(i, 1); this.add(1); continue; }
            if (this.invuln <= 0 && Math.abs(this.px - z.x) < z.w / 2 + this.pr - 4) { this.hurt(); if (this.state !== "play") return; }
            continue;
          }
          z.y += z.vy * dt; z.x += z.vx * dt + (o.sway ? Math.sin(z.t * 3) * o.sway * dt : 0);
          if (o.home) z.x += clamp(this.px - z.x, -1, 1) * o.home * dt;
          if (this.invuln <= 0) {
            var nx = clamp(this.px, z.x - z.w / 2, z.x + z.w / 2), ny = clamp(this.py, z.y - z.h / 2, z.y + z.h / 2), sh = o.shape === 0 ? Math.min(z.w, z.h) / 2 - 2 : 0;
            if (Math.hypot(this.px - nx, this.py - ny) < this.pr - 3 + (o.shape === 0 ? 0 : -2) - (o.shape === 0 ? 0 : 0)) { if (o.shape !== 0 || Math.hypot(this.px - z.x, this.py - z.y) < z.w / 2 + this.pr - 4) { this.hz.splice(i, 1); this.hurt(); if (this.state !== "play") return; continue; } }
          }
          if (z.y - z.h > this.H) { this.hz.splice(i, 1); this.add(1); }
        }
      },
      draw: function (now) {
        var c = this.ctx, i;
        for (i = 0; i < this.hz.length; i++) {
          var z = this.hz[i];
          if (o.strike) { if (z.warn > 0) { c.fillStyle = "rgba(255,77,109,0.25)"; c.fillRect(z.x - 2, 0, 4, this.H); } else { c.fillStyle = "#fff"; c.fillRect(z.x - z.w / 2, 0, z.w, this.H); } continue; }
          c.fillStyle = o.col; c.save(); c.translate(z.x, z.y); if (o.spin) c.rotate(z.t * 4);
          if (o.shape === 0) { c.beginPath(); c.arc(0, 0, z.w / 2, 0, TAU); c.fill(); } else if (o.shape === 2) { c.beginPath(); c.moveTo(0, z.h / 2); c.lineTo(z.w / 2, -z.h / 2); c.lineTo(-z.w / 2, -z.h / 2); c.closePath(); c.fill(); } else { c.fillRect(-z.w / 2, -z.h / 2, z.w, z.h); }
          c.restore();
        }
        if (!this.blink()) { c.fillStyle = "#fff"; c.beginPath(); c.arc(this.px, this.py, this.pr, 0, TAU); c.fill(); }
        this.ghostDrag(this.py - 100, now);
      }
    });
    reg("d_" + o.id, o.name, o.how, o.col, C);
  }
  [
    { id: "met", name: "Meteoritos", how: "Arrastrá la bolita y esquivá las rocas que caen.", col: GRY, shape: 0, w: [26, 50], sq: 1, iv: 0.85, v: 230, dr: 40 },
    { id: "brk", name: "Ladrillos que caen", how: "Arrastrá y esquivá los ladrillos.", col: ORA, shape: 1, w: [34, 70], h: [24, 30], iv: 0.8, v: 260 },
    { id: "fire", name: "Bolas de fuego", how: "Arrastrá y esquivá las bolas de fuego, son rápidas.", col: RED, shape: 0, w: [20, 28], sq: 1, iv: 0.6, v: 380, dr: 30 },
    { id: "snow", name: "Nevada", how: "Esquivá los copos, hay muchos.", col: "#e6e6e6", shape: 0, w: [14, 22], sq: 1, iv: 0.25, min: 0.16, v: 170, dr: 20, n: [1, 2] },
    { id: "ray", name: "Rayos", how: "Salí de la línea roja antes de que caiga el rayo.", col: YEL, strike: 1, w: [40, 40], h: [40, 40], iv: 1.1, min: 0.6, v: 0 },
    { id: "arr", name: "Flechas", how: "Esquivá las flechas que caen rápido.", col: "#d9d9d9", shape: 1, w: [6, 8], h: [40, 60], iv: 0.45, min: 0.25, v: 440 },
    { id: "leaf", name: "Hojas", how: "Esquivá las hojas, se mueven de costado.", col: GRN, shape: 2, w: [28, 36], h: [30, 36], iv: 0.6, v: 190, sway: 120, dr: 20 },
    { id: "big", name: "Piedras gigantes", how: "Pocas pero enormes. Buscá el hueco.", col: GRY, shape: 0, w: [90, 130], sq: 1, iv: 1.4, min: 0.9, v: 190 },
    { id: "mix", name: "Lluvia mezclada", how: "Cae de todo. Arrastrá y esquivá.", col: PUR, shape: 1, w: [18, 60], h: [18, 60], iv: 0.4, min: 0.25, v: 250, dr: 40 },
    { id: "saw", name: "Sierras", how: "Esquivá las sierras que giran.", col: "#d9d9d9", shape: 1, sq: 1, w: [34, 50], iv: 0.7, v: 240, spin: 1 },
    { id: "mis", name: "Misiles", how: "Esquivá los misiles, se desvían hacia vos.", col: RED, shape: 2, w: [22, 26], h: [38, 44], iv: 0.9, v: 210, home: 90 },
    { id: "hail", name: "Granizo", how: "Caen en grupos. Encontrá por dónde pasar.", col: "#cfcfcf", shape: 0, w: [16, 22], sq: 1, iv: 0.8, v: 260, n: [3, 5] },
    { id: "bar", name: "Vigas", how: "Esquivá las vigas anchas.", col: YEL, shape: 1, w: [120, 190], h: [20, 24], iv: 0.9, v: 240 },
    { id: "ufo", name: "Platillos", how: "Esquivá los platillos que zigzaguean.", col: PNK, shape: 0, w: [36, 44], sq: 1, iv: 0.8, v: 200, sway: 220 },
    { id: "spk", name: "Pinchos", how: "Esquivá los pinchos que caen.", col: "#fff", shape: 2, w: [24, 34], h: [34, 44], iv: 0.55, v: 300 },
    { id: "cnn", name: "Balas", how: "Muchas balas chicas y rápidas.", col: ORA, shape: 0, w: [10, 14], sq: 1, iv: 0.22, min: 0.14, v: 400, dr: 60 }
  ].forEach(mkDodge);

  /* --- Tocar blancos (aparecen y hay que decidir) --- */
  function mkTap(o) {
    var C = G("Tap_" + o.id, {
      init: function () { this.tg = []; this.sp = 0.5; },
      spot: function () {
        for (var t = 0; t < 20; t++) {
          var x = rnd(34, this.W - 80), y = rnd(this.pt + 40, this.H - this.pb - 150), ok = true;
          for (var i = 0; i < this.tg.length; i++) if (Math.hypot(this.tg[i].x - x, this.tg[i].y - y) < 70) ok = false;
          if (ok) return { x: x, y: y };
        }
        return { x: rnd(34, this.W - 80), y: rnd(this.pt + 40, this.H - this.pb - 150) };
      },
      act: function (x, y) {
        var best = -1, bd = 1e9;
        for (var i = 0; i < this.tg.length; i++) { var t = this.tg[i], d = Math.hypot(t.x - x, t.y - y); if (d < t.r + 14 && d < bd) { bd = d; best = i; } }
        if (best < 0) return; var tg = this.tg[best]; this.tg.splice(best, 1); this.acts++;
        if (tg.good) { this.add(1); S.hit(this.score); } else this.hurt();
      },
      step: function (dt) {
        this.sp -= dt;
        if (this.sp <= 0 && this.tg.length < 4) {
          this.sp = Math.max(0.35, (o.iv || 0.8) - this.score * 0.008); var t = o.gen(), p = this.spot();
          t.x = p.x; t.y = p.y; t.r = t.r || 28; t.life = Math.max(o.minLife || 0.9, (o.life || 2.0) - this.score * 0.03); t.t = 0; t.vx = o.move ? rnd(-70, 70) : 0; t.vy = o.move ? rnd(-70, 70) : 0; this.tg.push(t);
        }
        for (var i = this.tg.length - 1; i >= 0; i--) {
          var g = this.tg[i]; g.t += dt; g.x += g.vx * dt; g.y += g.vy * dt;
          if (g.x < 30 || g.x > this.W - 76) g.vx = -g.vx; if (g.y < this.pt + 30 || g.y > this.H - this.pb - 140) g.vy = -g.vy;
          if (g.t >= g.life) { this.tg.splice(i, 1); if (g.good && o.miss !== 0) { this.hurt(); if (this.state !== "play") return; } }
        }
      },
      draw: function (now) {
        var c = this.ctx, i;
        for (i = 0; i < this.tg.length; i++) {
          var t = this.tg[i], k = 1 - t.t / t.life; c.globalAlpha = k < 0.25 ? 0.4 + k : 1;
          if (t.face) { c.fillStyle = YEL; c.beginPath(); c.arc(t.x, t.y, t.r, 0, TAU); c.fill(); c.strokeStyle = "#000"; c.lineWidth = 3; c.beginPath(); c.arc(t.x, t.y + (t.face > 0 ? 2 : 12), 11, t.face > 0 ? 0.2 : PI + 0.4, t.face > 0 ? PI - 0.2 : TAU - 0.4); c.stroke(); c.fillStyle = "#000"; c.beginPath(); c.arc(t.x - 8, t.y - 8, 3, 0, TAU); c.arc(t.x + 8, t.y - 8, 3, 0, TAU); c.fill(); }
          else if (t.txt !== undefined) { c.fillStyle = "#262626"; c.beginPath(); c.arc(t.x, t.y, t.r, 0, TAU); c.fill(); txt(c, String(t.txt), t.x, t.y + 1, t.r * 0.9, "#fff"); }
          else if (t.bomb) dDraw(c, { x: t.x, y: t.y, bomb: 1 });
          else sh2(c, t.s || 0, t.x, t.y, t.r * 0.85, t.col);
          c.globalAlpha = 1;
        }
        this.ghost(this.cx - 30, this.cy, now);
      }
    });
    reg("t_" + o.id, o.name, o.how, o.acc, C);
  }
  function tg(col, s, good, ex) { var t = { col: col, s: s, good: good }; if (ex) for (var k in ex) t[k] = ex[k]; return t; }
  var LET = "ABCDEFGHIJLMNOPRSTUV".split(""), VOW = "AEIOU";
  [
    ["dots", "Puntos veloces", "Tocá cada punto antes de que desaparezca.", YEL, function () { return tg(YEL, 0, true); }, 0.7, 1.6, 1.0],
    ["gr", "Verde sí, rojo no", "Tocá los verdes. No toques los rojos.", GRN, function () { var g = Math.random() < 0.65; return tg(g ? GRN : RED, 0, g); }, 0.8, 1.8, 0],
    ["bomb", "No toques la bomba", "Tocá todo menos las bombas.", RED, function () { return Math.random() < 0.7 ? tg(pickOf([YEL, GRN, ORA, PUR]), 0, true) : tg("#333", 0, false, { bomb: 1 }); }, 0.8, 1.8, 0],
    ["yel", "Solo amarillos", "Tocá solamente los amarillos.", YEL, function () { var c = pickOf(CC); return tg(c, 0, c === YEL); }, 0.7, 1.8, 0],
    ["tri", "Triángulos", "Tocá solamente los triángulos.", GRN, function () { var k = ri(0, 4); return tg(WHT, k, k === 2); }, 0.7, 1.8, 0],
    ["cir", "Círculos", "Tocá solamente los círculos.", PNK, function () { var k = ri(0, 4); return tg(WHT, k, k === 0); }, 0.7, 1.8, 0],
    ["ev", "Números pares", "Tocá solamente los pares.", GRN, function () { var n = ri(1, 20); return tg(WHT, 0, n % 2 === 0, { txt: n }); }, 0.75, 2.0, 0],
    ["od", "Números impares", "Tocá solamente los impares.", ORA, function () { var n = ri(1, 20); return tg(WHT, 0, n % 2 === 1, { txt: n }); }, 0.75, 2.0, 0],
    ["g5", "Mayores a 10", "Tocá los números mayores que 10.", PUR, function () { var n = ri(1, 21); return tg(WHT, 0, n > 10, { txt: n }); }, 0.75, 2.0, 0],
    ["l5", "Menores a 10", "Tocá los números menores que 10.", RED, function () { var n = ri(1, 21); return tg(WHT, 0, n < 10, { txt: n }); }, 0.75, 2.0, 0],
    ["m5", "Múltiplos de 5", "Tocá los múltiplos de 5.", YEL, function () { var n = ri(1, 31); return tg(WHT, 0, n % 5 === 0, { txt: n }); }, 0.75, 2.2, 0],
    ["face", "Caras", "Tocá las caras contentas. Las tristes no.", YEL, function () { var g = Math.random() < 0.6; return tg(YEL, 0, g, { face: g ? 1 : -1 }); }, 0.8, 1.8, 0],
    ["big", "Las grandes", "Tocá solamente los círculos grandes.", GRN, function () { var g = Math.random() < 0.5; return tg(g ? PUR : GRY, 0, g, { r: g ? 38 : 20 }); }, 0.75, 1.8, 0],
    ["sml", "Las chicas", "Tocá solamente los círculos chicos.", ORA, function () { var g = Math.random() < 0.5; return tg(g ? ORA : GRY, 0, g, { r: g ? 20 : 38 }); }, 0.75, 1.8, 0],
    ["fast", "Relámpago", "Aparecen y se van enseguida. Tocalos.", RED, function () { return tg(pickOf(CC), 0, true); }, 0.55, 0.9, 1.0, 0.65],
    ["fly", "Moscas", "Se mueven. Tocalas antes de que se vayan.", GRN, function () { return tg(GRY, 0, true, { r: 22 }); }, 0.8, 2.2, 1.2, 0.9, 1],
    ["vow", "Vocales", "Tocá solamente las vocales.", PNK, function () { var l = pickOf(LET); return tg(WHT, 0, VOW.indexOf(l) >= 0, { txt: l }); }, 0.75, 2.0, 0],
    ["rdrop", "Gotas rojas", "Tocá solamente las rojas, las demás no.", RED, function () { var c = pickOf(CC), g = c === RED; return tg(c, 0, g); }, 0.65, 1.7, 0]
  ].forEach(function (v) { mkTap({ id: v[0], name: v[1], how: v[2], acc: v[3], gen: v[4], iv: v[5], life: v[6], miss: v[7], minLife: v[8] || 0.8, move: v[9] }); });
