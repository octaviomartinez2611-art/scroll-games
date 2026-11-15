
  /* ===== Tanda 30 mecánicas nuevas (2/2) ===== */

  /* 16. Ladrón: mantené para caminar; frená cuando los láseres están prendidos */
  regD("heist", "Ladrón", "Mantené apretado para caminar y soltá para frenar. Cruzá cuando los láseres están apagados.", "#ff4d6d", G("Heist", {
    ctl: "hold",
    init: function () { this.lvl = 0; this.room(); },
    room: function () { this.x = 24; this.ls = []; var n = 3 + Math.min(this.lvl, 4), gap = (this.W - 90) / n; for (var k = 0; k < n; k++) this.ls.push({ x: 60 + gap * (k + 0.5), per: rnd(1.4, 2.4) * Math.max(0.6, 1 - this.lvl * 0.05), off: rnd(0, 2), duty: 0.5, mv: this.lvl > 3 && Math.random() < 0.4 ? rnd(20, 40) : 0, ph: rnd(0, TAU) }); this.rt = 0; },
    on: function (l) { return ((this.t + l.off) % l.per) / l.per < l.duty; },
    lx: function (l) { return l.x + (l.mv ? Math.sin(this.t * 1.5 + l.ph) * l.mv : 0); },
    step: function (dt) {
      this.rt += dt; if (this.holding) { this.x += 110 * dt; }
      for (var k = 0; k < this.ls.length; k++) { var l = this.ls[k]; if (this.on(l) && Math.abs(this.lx(l) - this.x) < 12) { this.hurt(); this.x = 24; this.rt = 0; break; } }
      if (this.x >= this.W - 30) { this.lvl++; this.add(this.rt < 6 ? 3 : 2); this.room(); }
    },
    draw: function (now) {
      var c = this.ctx, gy = this.cy + 80, k; fillR(c, 0, gy + 22, this.W, 10, 0, "#3a3a44"); fillR(c, this.W - 26, gy - 50, 22, 72, 4, "#3ddc84");
      for (k = 0; k < this.ls.length; k++) { var l = this.ls[k], x = this.lx(l), on = this.on(l); c.fillStyle = "#55555f"; c.fillRect(x - 6, this.pt + 60, 12, 10); c.fillRect(x - 6, gy + 12, 12, 10); if (on) { c.fillStyle = "#ff2d4a"; c.fillRect(x - 2, this.pt + 70, 4, gy + 12 - this.pt - 70); } else { c.fillStyle = "rgba(255,45,74,0.18)"; c.fillRect(x - 1, this.pt + 70, 2, gy + 12 - this.pt - 70); } }
      c.globalAlpha = this.fadeA(); c.fillStyle = "#17121f"; c.fillRect(this.x - 8, gy, 6, 20); c.fillRect(this.x + 2, gy, 6, 20); buddy(c, this.x, gy - 12, 14, "#2b2b33", 1); fillR(c, this.x - 12, gy - 16, 24, 6, 3, "#f2f2f2"); c.globalAlpha = 1;
      this.ghostHold(this.W * 0.5, gy + 70, now);
    }
  }), "build");

  /* 17. Laberinto giratorio: arrastrá para girar el laberinto y llevar la bolita a la salida */
  regD("rmaze", "Laberinto giratorio", "Arrastrá a los costados para girar el laberinto. La bolita cae sola: llevala al agujero.", "#ffd23f", G("Rmaze", {
    ctl: "drag",
    init: function () { this.n = 5; this.lvl = 0; this.make(); },
    make: function () {
      var n = this.n, cs = Math.min(46, (this.W - 60) / n), seen = [], wl = [], k, i, j; this.cs = cs; this.a = 0; this.lx = null; this.tm = 30;
      var H = [], V = []; for (i = 0; i <= n; i++) { H.push([]); V.push([]); for (j = 0; j <= n; j++) { H[i].push(true); V[i].push(true); } }
      for (i = 0; i < n; i++) { seen.push([]); for (j = 0; j < n; j++) seen[i].push(false); }
      var st = [[0, 0]]; seen[0][0] = true;
      while (st.length) { var cur = st[st.length - 1], cx = cur[0], cy = cur[1], nb = []; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var x = cx + d[0], y = cy + d[1]; if (x >= 0 && y >= 0 && x < n && y < n && !seen[x][y]) nb.push([x, y, d]); }); if (!nb.length) { st.pop(); continue; } var p = pickOf(nb); seen[p[0]][p[1]] = true; if (p[2][0]) V[Math.max(cx, p[0])][cy] = false; else H[cx][Math.max(cy, p[1])] = false; st.push([p[0], p[1]]); }
      this.seg = []; var o = -n * cs / 2;
      for (i = 0; i < n; i++) for (j = 0; j <= n; j++) if (H[i][j]) this.seg.push([o + i * cs, o + j * cs, o + (i + 1) * cs, o + j * cs]);
      for (i = 0; i <= n; i++) for (j = 0; j < n; j++) if (V[i][j]) this.seg.push([o + i * cs, o + j * cs, o + i * cs, o + (j + 1) * cs]);
      this.b = { x: o + cs / 2, y: o + cs / 2, vx: 0, vy: 0 }; this.ex = { x: o + (n - 0.5) * cs, y: o + (n - 0.5) * cs };
    },
    drag: function (x) { if (this.lx !== null) this.a += (x - this.lx) * 0.012; this.lx = x; },
    release: function () { this.lx = null; },
    step: function (dt) {
      var b = this.b, r = this.cs * 0.22, k, s, sub = 4; this.tm -= dt;
      for (s = 0; s < sub; s++) { var h = dt / sub; b.vx += Math.sin(this.a) * 700 * h; b.vy += Math.cos(this.a) * 700 * h; b.vx *= 0.995; b.vy *= 0.995; capS(b, 500); b.x += b.vx * h; b.y += b.vy * h; for (k = 0; k < this.seg.length; k++) { var q = this.seg[k]; segHit(b, r + 2, q[0], q[1], q[2], q[3], 0.2); } }
      if (Math.hypot(b.x - this.ex.x, b.y - this.ex.y) < this.cs * 0.3) { this.good(3 + Math.max(0, Math.floor(this.tm / 10)), this.W / 2, this.cy, true); this.lvl++; this.n = Math.min(8, 5 + Math.floor(this.lvl / 2)); this.make(); }
      else if (this.tm <= 0) { this.hurt(); this.make(); }
    },
    draw: function (now) {
      var c = this.ctx, k, cs = this.cs, n = this.n; c.save(); c.translate(this.W / 2, this.cy); c.rotate(-this.a);
      fillR(c, -n * cs / 2 - 8, -n * cs / 2 - 8, n * cs + 16, n * cs + 16, 12, "rgba(255,255,255,0.08)");
      dot(c, this.ex.x, this.ex.y, cs * 0.32, "#17121f"); c.strokeStyle = "#ffd23f"; c.lineWidth = 3; c.beginPath(); c.arc(this.ex.x, this.ex.y, cs * 0.32, 0, TAU); c.stroke();
      c.strokeStyle = "#c77dff"; c.lineWidth = 7; c.lineCap = "round"; c.beginPath(); for (k = 0; k < this.seg.length; k++) { var q = this.seg[k]; c.moveTo(q[0], q[1]); c.lineTo(q[2], q[3]); } c.stroke(); c.lineCap = "butt";
      dot(c, this.b.x, this.b.y, cs * 0.22, "#f2f2f2"); c.restore();
      fillR(c, this.W / 2 - 80, this.pt + 10, 160, 8, 4, "rgba(255,255,255,0.15)"); fillR(c, this.W / 2 - 80, this.pt + 10, 160 * clamp(this.tm / 30, 0, 1), 8, 4, this.tm < 8 ? "#ff4d6d" : "#ffd23f");
      this.ghostDrag(this.H - this.pb - 50, now);
    }
  }), "table");

  /* 18. Panqueques: tocá cada sartén cuando el panqueque está dorado */
  regD("pancake", "Panqueques", "Tocá cada sartén cuando el panqueque está dorado. Si se quema o lo das vuelta crudo, perdés una vida.", "#ffd23f", G("Pancake", {
    init: function () { this.pans = []; var cols = 2, rows = 2, w = (this.W - 40) / cols, h = Math.min(170, (this.H - this.pt - this.pb - 60) / rows); for (var r = 0; r < rows; r++) for (var k = 0; k < cols; k++) this.pans.push({ x: 20 + w * (k + 0.5), y: this.pt + 90 + h * (r + 0.5), c: -rnd(0.2, 1.5), sp: rnd(0.22, 0.32) }); },
    act: function (x, y) {
      var best = null, bd = 1e9, i; for (i = 0; i < this.pans.length; i++) { var p = this.pans[i], d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = p; } } if (!best || bd > 110) return; this.acts++;
      if (best.c < 0) return; if (best.c < 0.68) { this.hurt(); } else if (best.c <= 1.02) { var pf = best.c > 0.82 && best.c < 0.96; this.good(pf ? 2 : 1, best.x, best.y, pf); sfx(500, 0.08, "triangle", 0.05, 1.5); } else { this.hurt(); }
      best.c = -rnd(0.3, 1.0); best.sp = rnd(0.22, 0.34) * (1 + Math.min(this.t, 90) * 0.01);
    },
    step: function (dt) { for (var i = 0; i < this.pans.length; i++) { var p = this.pans[i]; p.c += p.sp * dt; if (p.c > 1.25) { this.hurt(); p.c = -0.6; } } },
    draw: function (now) {
      var c = this.ctx, i; for (i = 0; i < this.pans.length; i++) { var p = this.pans[i]; c.fillStyle = "#3a3a44"; c.save(); c.translate(p.x, p.y); c.rotate(0.6); c.fillRect(46, -6, 54, 12); c.restore(); dot(c, p.x, p.y, 56, "#2b2b33"); dot(c, p.x, p.y, 48, "#3a3a44");
        if (p.c >= 0) { var col = p.c < 0.68 ? "#f6e3b4" : p.c <= 1.02 ? "#e0a458" : p.c < 1.15 ? "#8a5a2b" : "#3a2a1a"; dot(c, p.x, p.y, 40, col); if (p.c >= 0.68 && p.c <= 1.02) { dot(c, p.x - 12, p.y - 8, 4, "#c98a4a"); dot(c, p.x + 10, p.y + 6, 3, "#c98a4a"); } } }
      this.ghost(this.pans[0].x, this.pans[0].y, now);
    }
  }), "kitchen");

  /* 19. Semáforos: tocá para cambiar el semáforo y que los autos no choquen */
  regD("traffic", "Semáforos", "Tocá para cambiar qué calle tiene verde. Que no choquen ni se amontonen.", "#3ddc84", G("Traffic", {
    init: function () { this.cxi = this.W / 2; this.cyi = this.cy; this.rw = 56; this.gH = true; this.cars = []; this.nh = 0.5; this.nv = 1.2; },
    act: function () { this.gH = !this.gH; this.acts++; S.flip(); },
    step: function (dt) {
      var i, j, rw = this.rw, x0 = this.cxi - rw / 2, x1 = this.cxi + rw / 2, y0 = this.cyi - rw / 2, y1 = this.cyi + rw / 2, rate = Math.max(0.8, 2.2 - this.t * 0.02);
      this.nh -= dt; if (this.nh <= 0) { this.cars.push({ d: "h", p: -40, v: rnd(110, 150), col: pickOf(["#ff4d6d", "#ffd23f", "#ff9f1c", "#f2f2f2"]) }); this.nh = rnd(0.7, 1.4) * rate; }
      this.nv -= dt; if (this.nv <= 0) { this.cars.push({ d: "v", p: this.pt - 40, v: rnd(110, 150), col: pickOf(["#c77dff", "#3ddc84", "#ff5fd2", "#f2f2f2"]) }); this.nv = rnd(0.8, 1.6) * rate; }
      var wait = { h: 0, v: 0 };
      for (i = 0; i < this.cars.length; i++) {
        var c = this.cars[i], green = c.d === "h" ? this.gH : !this.gH, stop = c.d === "h" ? x0 - 22 : y0 - 22, front = c.p + 20, lead = 1e9;
        for (j = 0; j < this.cars.length; j++) { var o = this.cars[j]; if (o !== c && o.d === c.d && o.p > c.p) lead = Math.min(lead, o.p - c.p); }
        var np = c.p + c.v * dt; if (!green && front <= stop && np + 20 > stop) np = stop - 20; if (lead < 52) np = Math.min(np, c.p + Math.max(0, lead - 52)); if (np - c.p < 1) wait[c.d]++; c.p = np;
      }
      var inH = null, inV = null; for (i = 0; i < this.cars.length; i++) { var q = this.cars[i]; if (q.d === "h" && q.p + 20 > x0 && q.p - 20 < x1) inH = q; if (q.d === "v" && q.p + 20 > y0 && q.p - 20 < y1) inV = q; }
      if (inH && inV) { this.hurt(); inH.dead = inV.dead = true; }
      if (wait.h >= 6 || wait.v >= 6) { this.hurt(); var d = wait.h >= 6 ? "h" : "v"; this.cars = this.cars.filter(function (q) { return q.d !== d; }); }
      var W = this.W, H = this.H, me = this; this.cars = this.cars.filter(function (q) { var out = q.d === "h" ? q.p > W + 30 : q.p > H + 30; if (out && !q.dead) me.add(1); return !out && !q.dead; });
    },
    draw: function (now) {
      var c = this.ctx, i, rw = this.rw, cx = this.cxi, cy = this.cyi;
      c.fillStyle = "#3a3a44"; c.fillRect(0, cy - rw / 2, this.W, rw); c.fillRect(cx - rw / 2, 0, rw, this.H);
      c.fillStyle = "rgba(255,255,255,0.4)"; for (i = 0; i < this.W; i += 30) if (Math.abs(i - cx) > rw) c.fillRect(i, cy - 2, 16, 4); for (i = 0; i < this.H; i += 30) if (Math.abs(i - cy) > rw) c.fillRect(cx - 2, i, 4, 16);
      fillR(c, cx - rw / 2 - 30, cy - rw / 2 - 44, 20, 38, 5, "#17121f"); dot(c, cx - rw / 2 - 20, cy - rw / 2 - 34, 6, this.gH ? "#4a1f24" : "#ff3b3b"); dot(c, cx - rw / 2 - 20, cy - rw / 2 - 16, 6, this.gH ? "#3ddc84" : "#1f4a2e");
      fillR(c, cx + rw / 2 + 10, cy - rw / 2 - 44, 20, 38, 5, "#17121f"); dot(c, cx + rw / 2 + 20, cy - rw / 2 - 34, 6, !this.gH ? "#4a1f24" : "#ff3b3b"); dot(c, cx + rw / 2 + 20, cy - rw / 2 - 16, 6, !this.gH ? "#3ddc84" : "#1f4a2e");
      for (i = 0; i < this.cars.length; i++) { var q = this.cars[i]; if (q.d === "h") spCar(c, q.p - 22, cy - 2, 44, 24, q.col, 1); else { c.save(); c.translate(cx + 12, q.p); c.rotate(PI / 2); spCar(c, -22, -12, 44, 24, q.col, 1); c.restore(); } }
      this.ghost(cx + 80, cy + 80, now);
    }
  }), "city");

  /* 20. Avión de paquetes: tocá para soltar el paquete y que caiga en la chimenea */
  regD("drop", "Avión de paquetes", "Tocá para soltar un paquete desde el avión. Que caiga en las chimeneas.", "#ff9f1c", G("Drop", {
    init: function () { this.px = -40; this.v = 150; this.pk = []; this.houses = []; this.mk(); },
    mk: function () { this.houses = []; var n = 3, w = (this.W - 40) / n; for (var k = 0; k < n; k++) this.houses.push({ x: 20 + w * k + rnd(10, w - 90), w: 70, h: rnd(60, 120), cx: 0, done: false }); this.houses.forEach(function (h) { h.cx = h.x + h.w * rnd(0.2, 0.7); }); },
    act: function () { if (this.px < 0 || this.px > this.W) return; this.pk.push({ x: this.px, y: this.pt + 66, vx: this.v, vy: 0 }); this.acts++; sfx(300, 0.08, "sine", 0.05, 0.6); },
    step: function (dt) {
      var i, k, gy = this.H - this.pb - 20; this.px += this.v * dt; if (this.px > this.W + 60) { this.px = -60; this.v = 150 * (1 + Math.min(this.t, 60) * 0.012); if (this.houses.every(function (h) { return h.done; })) this.mk(); else { var left = this.houses.filter(function (h) { return !h.done; }).length; this.hurt(); this.mk(); } }
      for (i = 0; i < this.pk.length; i++) { var p = this.pk[i]; p.vy += 600 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.995;
        for (k = 0; k < this.houses.length; k++) { var h = this.houses[k], top = gy - h.h; if (!p.dead && p.y >= top - 30 && p.y <= top - 10 && Math.abs(p.x - h.cx) < 12 && !h.done) { p.dead = true; h.done = true; this.good(2, p.x, p.y, true); } else if (!p.dead && p.y >= top && p.x > h.x && p.x < h.x + h.w) { p.dead = true; } }
        if (!p.dead && p.y >= gy) p.dead = true; }
      this.pk = this.pk.filter(function (q) { return !q.dead; });
    },
    draw: function (now) {
      var c = this.ctx, i, gy = this.H - this.pb - 20; fillR(c, 0, gy, this.W, 30, 0, "#3a6b3a");
      for (i = 0; i < this.houses.length; i++) { var h = this.houses[i], top = gy - h.h; fillR(c, h.x, top, h.w, h.h, 3, "#c98a4a"); poly(c, [h.x - 8, top, h.x + h.w / 2, top - 26, h.x + h.w + 8, top], "#a3203c"); fillR(c, h.cx - 9, top - 34, 18, 24, 2, h.done ? "#3ddc84" : "#8a4a3a"); fillR(c, h.x + h.w / 2 - 9, gy - 26, 18, 26, 3, "#55555f"); fillR(c, h.x + 10, top + 14, 16, 14, 2, "#ffd23f"); }
      for (i = 0; i < this.pk.length; i++) { fillR(c, this.pk[i].x - 9, this.pk[i].y - 9, 18, 18, 3, "#c98a4a"); c.fillStyle = "#ff4d6d"; c.fillRect(this.pk[i].x - 1.5, this.pk[i].y - 9, 3, 18); }
      var x = this.px, y = this.pt + 50; fillR(c, x - 34, y - 9, 68, 18, 9, "#f2f2f2"); poly(c, [x - 6, y, x + 10, y, x - 14, y + 26], "#ff4d6d"); poly(c, [x - 30, y - 6, x - 38, y - 22, x - 24, y - 6], "#ff4d6d"); dot(c, x + 20, y - 2, 4, "#5bc0eb");
      this.ghost(this.W / 2, this.cy, now);
    }
  }), "sky");

  /* 21. Dos autos: tocá a la izquierda o a la derecha para cambiar de carril cada auto */
  regD("twocars", "Dos autos", "Manejás dos autos a la vez. Tocá a la izquierda o a la derecha para mover cada uno. Juntá los círculos y esquivá los cuadrados.", "#ff4d6d", G("Twocars", {
    init: function () { this.lane = [0, 1]; this.px = [0, 0]; this.ob = []; this.next = 0.5; this.lw = (this.W - 70) / 4; this.px[0] = this.lx(0); this.px[1] = this.lx(3); },
    lx: function (i) { return 8 + this.lw * (i + 0.5); },
    act: function (x) { var k = x < this.W / 2 ? 0 : 1; this.lane[k] = 1 - this.lane[k]; this.acts++; S.flip(); },
    step: function (dt) {
      var v = 240 * (1 + Math.min(this.t, 60) * 0.015), i, py = this.H - this.pb - 80; this.next -= dt;
      for (var k = 0; k < 2; k++) this.px[k] += (this.lx(k * 2 + this.lane[k]) - this.px[k]) * Math.min(1, dt * 18);
      if (this.next <= 0) { for (k = 0; k < 2; k++) if (Math.random() < 0.75) this.ob.push({ k: k, l: k * 2 + ri(0, 2), y: this.pt - 30 - rnd(0, 60), circ: Math.random() < 0.5 }); this.next = rnd(0.6, 0.9) * Math.max(0.55, 1 - this.t * 0.006); }
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i]; o.y += v * dt; if (o.dead) continue; var x = this.lx(o.l); if (Math.abs(o.y - py) < 28 && Math.abs(x - this.px[o.k]) < this.lw * 0.4) { o.dead = true; if (o.circ) this.add(1); else this.hurt(); } else if (o.y > py + 40 && o.circ) { o.dead = true; this.hurt(); } }
      var H = this.H; this.ob = this.ob.filter(function (q) { return !q.dead && q.y < H + 30; });
    },
    draw: function (now) {
      var c = this.ctx, i, py = this.H - this.pb - 80, w = this.lw * 4;
      fillR(c, 8, 0, w, this.H, 0, "#2b2b33"); c.fillStyle = "#f2f2f2"; c.fillRect(8 + w / 2 - 2, 0, 4, this.H); c.fillStyle = "rgba(255,255,255,0.3)"; c.fillRect(8 + this.lw - 1, 0, 2, this.H); c.fillRect(8 + this.lw * 3 - 1, 0, 2, this.H);
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i], x = this.lx(o.l), col = o.k ? "#ffd23f" : "#ff4d6d"; if (o.circ) { dot(c, x, o.y, 15, col); dot(c, x, o.y, 7, "#2b2b33"); } else fillR(c, x - 15, o.y - 15, 30, 30, 5, col); }
      c.globalAlpha = this.fadeA(); carV(c, this.px[0], py, 30, 48, "#ff4d6d"); carV(c, this.px[1], py, 30, 48, "#ffd23f"); c.globalAlpha = 1;
      this.ghost(this.W * 0.25, py - 60, now);
    }
  }), "road");

  /* 22. Bateo: tocá para batear cuando la pelota llega */
  regD("bat", "Bateo", "Tocá para batear justo cuando la pelota llega a vos. Si la dejás pasar, perdés una vida.", "#f2f2f2", G("Bat", {
    init: function () { this.ball = null; this.wait = 1; this.sw = 0; this.hitB = null; this.zy = this.H - this.pb - 120; },
    act: function () { if (this.sw > 0) return; this.sw = 0.22; this.acts++; var b = this.ball; if (b && !b.done) { var d = this.zy - b.y; if (Math.abs(d) < 34) { b.done = true; var pf = Math.abs(d) < 10; this.good(pf ? 3 : 1, this.W / 2, this.zy, pf); this.hitB = { x: this.W / 2, y: this.zy, vx: rnd(-200, 200), vy: pf ? -900 : -600 }; this.ball = null; this.wait = 0.8; sfx(pf ? 900 : 600, 0.08, "square", 0.06, 0.5); } } },
    step: function (dt) {
      this.sw = Math.max(0, this.sw - dt);
      if (this.hitB) { var h = this.hitB; h.vy += 500 * dt; h.x += h.vx * dt; h.y += h.vy * dt; if (h.y < -40 || h.y > this.H) this.hitB = null; }
      if (!this.ball) { this.wait -= dt; if (this.wait <= 0) { var sp = rnd(320, 520) * (1 + Math.min(this.t, 60) * 0.01); this.ball = { y: this.pt + 90, v: sp, cv: Math.random() < 0.3 ? rnd(-1, 1) : 0, slow: Math.random() < 0.2 }; } return; }
      var b = this.ball; b.y += b.v * (b.slow && b.y > this.cy - 60 && b.y < this.cy + 20 ? 0.45 : 1) * dt;
      if (b.y > this.zy + 40) { this.hurt(); this.ball = null; this.wait = 0.8; }
    },
    draw: function (now) {
      var c = this.ctx, cx = this.W / 2; buddy(c, cx, this.pt + 70, 16, "#c77dff");
      c.strokeStyle = "rgba(255,255,255,0.25)"; c.lineWidth = 2; c.strokeRect(cx - 30, this.zy - 34, 60, 68);
      if (this.ball) { var b = this.ball, k = (b.y - this.pt - 90) / (this.zy - this.pt - 90); spBallLines(c, cx + Math.sin(k * PI) * b.cv * 50, b.y, 7 + 5 * k, "#f2f2f2"); }
      if (this.hitB) dot(c, this.hitB.x, this.hitB.y, 8, "#f2f2f2");
      c.save(); c.translate(cx + 40, this.zy + 20); c.rotate(this.sw > 0 ? -2.4 + (this.sw / 0.22) * 1.6 : -0.6); fillR(c, -5, -70, 10, 70, 5, "#c98a4a"); c.restore();
      c.globalAlpha = this.fadeA(); buddy(c, cx + 50, this.zy + 40, 16, "#ff4d6d", -1); c.globalAlpha = 1;
      this.ghost(cx - 60, this.zy, now);
    }
  }), "court");

  /* 23. Pong circular: arrastrá para girar la paleta alrededor del círculo */
  regD("cpong", "Pong circular", "Arrastrá a los costados para girar la paleta. Que la pelota no se escape del círculo.", "#3ddc84", G("Cpong", {
    ctl: "drag",
    init: function () { this.R = Math.min(this.W / 2 - 20, 150); this.a = PI / 2; this.lx = null; this.serve(); },
    serve: function () { var a = rnd(0, TAU); this.b = { x: 0, y: 0, vx: Math.cos(a) * 170, vy: Math.sin(a) * 170 }; this.wait = 0.6; },
    drag: function (x) { if (this.lx !== null) this.a += (x - this.lx) * 0.022; this.lx = x; },
    release: function () { this.lx = null; },
    step: function (dt) {
      if (this.wait > 0) { this.wait -= dt; return; } var b = this.b; b.x += b.vx * dt; b.y += b.vy * dt; var d = Math.hypot(b.x, b.y), arc = 0.9;
      if (d > this.R - 16) { var ang = Math.atan2(b.y, b.x); if (adiff(ang, this.a) < arc / 2) { var nx = b.x / d, ny = b.y / d, vn = b.vx * nx + b.vy * ny; if (vn > 0) { b.vx -= 2 * vn * nx; b.vy -= 2 * vn * ny; var off = ((ang - this.a + PI * 3) % TAU) - PI; var s = Math.hypot(b.vx, b.vy) * 1.04, na = Math.atan2(b.vy, b.vx) + off * 0.8; b.vx = Math.cos(na) * Math.min(s, 520); b.vy = Math.sin(na) * Math.min(s, 520); this.add(1); sfx(500, 0.05, "square", 0.04); } b.x = nx * (this.R - 17); b.y = ny * (this.R - 17); } else if (d > this.R + 10) { this.hurt(); this.serve(); } }
    },
    draw: function (now) {
      var c = this.ctx, cx = this.W / 2, cy = this.cy; c.strokeStyle = "rgba(255,255,255,0.15)"; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, this.R, 0, TAU); c.stroke();
      c.strokeStyle = "#3ddc84"; c.lineWidth = 12; c.lineCap = "round"; c.beginPath(); c.arc(cx, cy, this.R, this.a - 0.45, this.a + 0.45); c.stroke(); c.lineCap = "butt";
      dot(c, cx + this.b.x, cy + this.b.y, 10, "#f2f2f2"); dot(c, cx, cy, 4, "rgba(255,255,255,0.2)");
      this.ghostDrag(this.H - this.pb - 50, now);
    }
  }), "arcade");

  /* 24. Bungee: mantené para caer, soltá para que el elástico te frene antes del piso */
  regD("bungee", "Bungee", "Mantené apretado para caer y soltá para que el elástico te frene. Cuanto más cerca del agua, más puntos. No toques el agua.", "#ff9f1c", G("Bungee", {
    ctl: "hold",
    init: function () { this.top = this.pt + 60; this.y = 0; this.v = 0; this.ph = "ready"; this.maxd = 0; this.gnd = this.H - this.pb - 60 - this.top; this.st = []; this.mkStars(); },
    mkStars: function () { this.st = []; for (var k = 0; k < 3; k++) this.st.push({ x: this.W / 2 + rnd(-10, 10), d: this.gnd * rnd(0.55, 0.9) }); },
    press: function () { if (this.ph === "ready") { this.ph = "fall"; this.maxd = 0; this.acts++; } },
    release: function () { if (this.ph === "fall") this.ph = "spring"; },
    step: function (dt) {
      var i; if (this.ph === "ready") return;
      if (this.ph === "fall") { this.v += 900 * dt; }
      else { var L0 = 40, k = 34; this.v += (900 - (this.y > L0 ? k * (this.y - L0) : 0)) * dt - this.v * 0.9 * dt; }
      this.y += this.v * dt; this.maxd = Math.max(this.maxd, this.y);
      for (i = 0; i < this.st.length; i++) { var s = this.st[i]; if (!s.got && Math.abs(this.y - s.d) < 18) { s.got = true; this.add(1); } }
      if (this.y >= this.gnd - 12) { this.hurt(); this.reset2(); return; }
      if (this.ph === "spring" && this.v < 0 && this.y < 50) { var pts = Math.floor(this.maxd / this.gnd * 6); if (this.maxd > this.gnd * 0.8) this.good(pts, this.W / 2, this.top + this.maxd, true); else this.add(Math.max(0, pts - 2)); this.reset2(); }
    },
    reset2: function () { this.ph = "ready"; this.y = 0; this.v = 0; this.mkStars(); },
    draw: function (now) {
      var c = this.ctx, x = this.W / 2, y = this.top + this.y, i; fillR(c, x - 60, this.top - 14, 120, 14, 4, "#55555f");
      c.fillStyle = "#1f7fa8"; c.fillRect(0, this.top + this.gnd, this.W, this.H);
      c.fillStyle = "rgba(255,77,109,0.35)"; c.fillRect(0, this.top + this.gnd * 0.8, this.W, 3);
      for (i = 0; i < this.st.length; i++) if (!this.st[i].got) starG(c, this.st[i].x, this.top + this.st[i].d);
      c.strokeStyle = this.ph === "fall" ? "rgba(255,210,63,0.5)" : "#ffd23f"; c.lineWidth = 3; c.beginPath(); c.moveTo(x, this.top); if (this.ph === "fall") { c.quadraticCurveTo(x + 30, this.top + this.y * 0.5, x, y - 12); } else c.lineTo(x, y - 12); c.stroke();
      c.globalAlpha = this.fadeA(); buddy(c, x, y, 13, "#ff9f1c"); c.globalAlpha = 1;
      this.ghostHold(x + 80, this.cy, now);
    }
  }), "sea");

  /* 25. Boomerang: tocá a un lado para tirar el boomerang y bajar los pájaros */
  regD("boomer", "Boomerang", "Tocá a la izquierda o a la derecha para tirar el boomerang hacia ese lado. Bajá los pájaros antes de que lleguen abajo.", "#c98a4a", G("Boomer", {
    init: function () { this.bm = null; this.birds = []; this.next = 0.6; this.py = this.H - this.pb - 60; },
    act: function (x) { if (this.bm) return; this.bm = { t: 0, dir: x < this.W / 2 ? -1 : 1 }; this.acts++; sfx(400, 0.1, "sawtooth", 0.03, 1.5); },
    pos: function () { var b = this.bm, t = b.t, cx = this.W / 2; return { x: cx + b.dir * Math.sin(t * PI) * (this.W * 0.42) * (1 - t * 0.3), y: this.py - Math.sin(t * PI) * (this.py - this.pt - 60) * 0.95 + Math.sin(t * TAU) * 20 }; },
    step: function (dt) {
      var i; this.next -= dt;
      if (this.next <= 0) { this.birds.push({ x: rnd(30, this.W - 30), y: this.pt - 10, v: rnd(40, 70) * (1 + Math.min(this.t, 60) * 0.012), ph: rnd(0, TAU) }); this.next = rnd(1.0, 1.8) * Math.max(0.5, 1 - this.t * 0.008); }
      if (this.bm) { this.bm.t += dt / 1.3; var p = this.pos(); for (i = 0; i < this.birds.length; i++) { var b = this.birds[i]; if (!b.dead && Math.hypot(b.x - p.x, b.y - p.y) < 26) { b.dead = true; this.add(1); } } if (this.bm.t >= 1) this.bm = null; }
      for (i = 0; i < this.birds.length; i++) { var q = this.birds[i]; q.y += q.v * dt; q.x += Math.sin(this.t * 2 + q.ph) * 30 * dt; if (!q.dead && q.y > this.py - 20) { q.dead = true; this.hurt(); } }
      this.birds = this.birds.filter(function (q) { return !q.dead; });
    },
    draw: function (now) {
      var c = this.ctx, i; for (i = 0; i < this.birds.length; i++) { var b = this.birds[i]; dot(c, b.x, b.y, 11, "#2b2b33"); poly(c, [b.x - 4, b.y - 2, b.x - 18, b.y - 12 + Math.sin(now / 90 + b.ph) * 6, b.x + 2, b.y - 4], "#2b2b33"); poly(c, [b.x + 4, b.y - 2, b.x + 18, b.y - 12 + Math.sin(now / 90 + b.ph) * 6, b.x - 2, b.y - 4], "#2b2b33"); dot(c, b.x, b.y + 2, 2, "#ff9f1c"); }
      var bx = this.W / 2, by = this.py - 20; if (this.bm) { var p = this.pos(); bx = p.x; by = p.y; }
      c.save(); c.translate(bx, by); c.rotate(this.bm ? now / 60 : -0.5); c.fillStyle = "#c98a4a"; c.beginPath(); c.moveTo(-18, -4); c.lineTo(0, -6); c.lineTo(4, 14); c.lineTo(-2, 14); c.lineTo(-2, 2); c.lineTo(-18, 4); c.closePath(); c.fill(); c.restore();
      c.globalAlpha = this.fadeA(); buddy(c, this.W / 2, this.py + 10, 16, "#3ddc84"); c.globalAlpha = 1;
      this.ghost(this.W * 0.75, this.py - 40, now);
    }
  }), "desert");

  /* 26. Rampa: el skater sube solo; tocá en el aire para hacer un truco, antes de caer */
  regD("halfpipe", "Rampa", "El skater va y viene solo. Tocá cuando está en el aire para hacer un truco, pero con tiempo: si cae a mitad del truco, se cae.", "#ff5fd2", G("Halfpipe", {
    init: function () { this.ph = 0; this.trick = 0; this.did = false; this.fallen = 0; },
    air: function () { return Math.abs(Math.sin(this.ph)) > 0.82; },
    act: function () { if (this.fallen > 0 || this.trick > 0) return; this.acts++; if (this.air() && !this.did) { this.trick = 0.36; this.did = true; sfx(700, 0.08, "triangle", 0.05, 1.5); } else if (!this.air()) { this.hurt(); this.fallen = 0.8; } },
    step: function (dt) {
      if (this.fallen > 0) { this.fallen -= dt; return; }
      var w = 2.2 * (1 + Math.min(this.t, 60) * 0.008), wasAir = this.air(); this.ph += w * dt;
      if (this.trick > 0) { this.trick -= dt; if (this.trick <= 0) { this.trick = 0; if (this.air()) { this.add(2); } } }
      if (wasAir && !this.air()) { if (this.trick > 0) { this.hurt(); this.trick = 0; this.fallen = 0.8; } this.did = false; }
    },
    draw: function (now) {
      var c = this.ctx, cx = this.W / 2, R = this.W * 0.42, cy = this.cy - 40;
      c.strokeStyle = "#c98a4a"; c.lineWidth = 14; c.beginPath(); c.arc(cx, cy, R, 0.1, PI - 0.1); c.stroke(); c.fillStyle = "#8a5a2b"; c.fillRect(cx - R - 20, cy + Math.sin(0.1) * R - 4, 26, this.H); c.fillRect(cx + R - 6, cy + Math.sin(0.1) * R - 4, 26, this.H);
      var s = Math.sin(this.ph), a = PI / 2 - s * 1.45, x = cx + Math.cos(a) * (R - 18), y = cy + Math.sin(a) * (R - 18), lift = this.air() ? (Math.abs(s) - 0.82) / 0.18 * 70 : 0; y -= lift;
      c.save(); c.translate(x, y); c.rotate(a - PI / 2 + (this.trick > 0 ? (1 - this.trick / 0.36) * TAU : 0)); fillR(c, -18, 10, 36, 6, 3, "#ff5fd2"); dot(c, -11, 18, 3, "#2b2b33"); dot(c, 11, 18, 3, "#2b2b33"); c.restore();
      c.globalAlpha = this.fallen > 0 ? 0.5 : this.fadeA(); buddy(c, x, y - 6, 12, "#ffd23f", s > 0 ? 1 : -1); c.globalAlpha = 1;
      this.ghost(cx, cy + R + 40, now);
    }
  }), "city");

  /* 27. Palo en equilibrio: arrastrá para mantener el palo parado */
  regD("broom", "Palo en equilibrio", "Arrastrá a los costados para mantener el palo parado sobre la mano. Si se cae, perdés una vida.", "#ffd23f", G("Broom", {
    ctl: "drag",
    init: function () { this.hx = this.W / 2; this.pv = this.W / 2; this.bt = 0; this.w = 0; this.L = 150; this.acc2 = 0; this.tt = 0; this.wind = 0; },
    drag: function (x) { this.hx = clamp(x, 30, this.W - 30); },
    step: function (dt) {
      var prev = this.pv; this.pv += (this.hx - this.pv) * Math.min(1, dt * 20); var vel = (this.pv - prev) / Math.max(dt, 1e-3); var acc = (vel - (this.lastV || 0)) / Math.max(dt, 1e-3); this.lastV = vel;
      this.wind = Math.sin(this.t * 0.7) * 0.8 + Math.sin(this.t * 1.9) * 0.4;
      var g = 9.8 * 40 / this.L * (1 + Math.min(this.t, 60) * 0.01); this.w += (g * Math.sin(this.bt) - clamp(acc, -6000, 6000) / this.L * Math.cos(this.bt) * 0.9 + this.wind * 0.3) * dt; this.w *= 0.99; this.bt += this.w * dt;
      this.tt += dt; if (this.tt >= 1) { this.tt -= 1; this.add(1); }
      if (Math.abs(this.bt) > 1.1) { this.hurt(); this.bt = 0; this.w = 0; }
    },
    draw: function (now) {
      var c = this.ctx, hy = this.H - this.pb - 120, tx = this.pv + Math.sin(this.bt) * this.L, ty = hy - Math.cos(this.bt) * this.L;
      c.strokeStyle = "#c98a4a"; c.lineWidth = 8; c.lineCap = "round"; c.beginPath(); c.moveTo(this.pv, hy); c.lineTo(tx, ty); c.stroke(); c.lineCap = "butt";
      c.save(); c.translate(tx, ty); c.rotate(this.bt); poly(c, [-16, -4, 16, -4, 22, -30, -22, -30], "#ffd23f"); c.restore();
      c.globalAlpha = this.fadeA(); dot(c, this.pv, hy + 8, 14, "#f2b48a"); fillR(c, this.pv - 8, hy + 14, 16, 60, 6, "#f2b48a"); c.globalAlpha = 1;
      this.ghostDrag(hy + 50, now);
    }
  }), "circus");

  /* 28. Bola de nieve: arrastrá para juntar nieve y crecer; los árboles te achican */
  regD("snowball", "Bola de nieve", "Arrastrá a los costados. Pasá por la nieve para crecer y esquivá los árboles: si sos más grande que un árbol, lo aplastás.", "#f2f2f2", G("Snowball", {
    ctl: "drag",
    init: function () { this.x = this.W / 2; this.tx = this.W / 2; this.r = 18; this.ob = []; this.next = 0.3; this.y = this.pt + 150; },
    drag: function (x) { this.tx = x; },
    step: function (dt) {
      var v = 200 * (1 + Math.min(this.t, 60) * 0.012), i; this.x += (this.tx - this.x) * Math.min(1, dt * 8) ; this.x = clamp(this.x, this.r, this.W - this.r); this.next -= dt;
      if (this.next <= 0) { var tr = Math.random() < 0.55; this.ob.push({ x: rnd(20, this.W - 20), y: this.H + 30, tr: tr, s: tr ? rnd(16, 34) : rnd(12, 20) }); this.next = rnd(0.25, 0.5); }
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i]; o.y -= v * dt; if (o.dead) continue; if (Math.hypot(o.x - this.x, o.y - this.y) < this.r + o.s * 0.6) { o.dead = true; if (!o.tr) { this.r = Math.min(46, this.r + 2.2); this.add(1); } else if (this.r > o.s * 1.2) { this.good(2, o.x, o.y); this.r = Math.max(10, this.r - 1); } else { this.r -= 8; if (this.r < 12) { this.hurt(); this.r = 18; } else sfx(140, 0.1, "square", 0.04); } } }
      this.r = Math.max(10, this.r - 0.6 * dt);
      this.ob = this.ob.filter(function (q) { return q.y > -40 && !q.dead; });
    },
    draw: function (now) {
      var c = this.ctx, i; for (i = 0; i < this.ob.length; i++) { var o = this.ob[i]; if (o.tr) tree(c, o.x, o.y, o.s * 1.4); else { dot(c, o.x, o.y, o.s, "#ffffff"); dot(c, o.x - o.s * 0.3, o.y + o.s * 0.2, o.s * 0.6, "#e2ecf7"); } }
      c.globalAlpha = this.fadeA(); dot(c, this.x, this.y, this.r, "#ffffff"); dot(c, this.x - this.r * 0.3, this.y + this.r * 0.25, this.r * 0.35, "#dde7f2"); dot(c, this.x + this.r * 0.35, this.y - this.r * 0.2, this.r * 0.22, "#dde7f2"); c.globalAlpha = 1;
      this.ghostDrag(this.y + 90, now);
    }
  }), "snow");

  /* 29. Platos chinos: tocá cada palo para que el plato siga girando */
  regD("plates", "Platos chinos", "Los platos van perdiendo vueltas y se tambalean. Tocá cada palo para hacerlos girar antes de que se caigan.", "#ff9f1c", G("Plates", {
    init: function () { this.pl = []; this.add2(); this.add2(); this.add2(); this.nt = 18; },
    add2: function () { this.pl.push({ s: rnd(0.7, 1), d: rnd(0.11, 0.16), ph: rnd(0, TAU) }); this.lay(); },
    lay: function () { var n = this.pl.length, w = (this.W - 40) / n; for (var k = 0; k < n; k++) this.pl[k].x = 20 + w * (k + 0.5); },
    act: function (x) { var best = null, bd = 1e9; for (var k = 0; k < this.pl.length; k++) { var d = Math.abs(this.pl[k].x - x); if (d < bd) { bd = d; best = this.pl[k]; } } if (!best) return; this.acts++; if (best.s < 0.25) this.good(2, best.x, this.cy, true); else if (best.s < 0.55) this.add(1); best.s = 1; sfx(600, 0.06, "triangle", 0.04, 1.4); },
    step: function (dt) {
      for (var k = 0; k < this.pl.length; k++) { var p = this.pl[k]; p.s -= p.d * (1 + Math.min(this.t, 90) * 0.01) * dt; p.ph += (2 + p.s * 14) * dt; if (p.s <= 0) { this.hurt(); p.s = 1; } }
      if (this.t > this.nt && this.pl.length < 5) { this.nt += 18; this.add2(); }
    },
    draw: function (now) {
      var c = this.ctx, k, base = this.H - this.pb - 40, top = this.cy - 40;
      for (k = 0; k < this.pl.length; k++) { var p = this.pl[k], wob = (1 - p.s) * 0.5 * Math.sin(p.ph * 0.6); c.strokeStyle = "#d9dde3"; c.lineWidth = 4; c.beginPath(); c.moveTo(p.x, base); c.lineTo(p.x + Math.sin(wob) * (base - top), top); c.stroke();
        c.save(); c.translate(p.x + Math.sin(wob) * (base - top), top); c.rotate(wob * 1.4); var col = p.s < 0.25 ? "#ff4d6d" : p.s < 0.55 ? "#ffd23f" : "#f2f2f2"; c.fillStyle = col; c.beginPath(); c.ellipse(0, -4, 34, 9, 0, 0, TAU); c.fill(); c.fillStyle = "rgba(0,0,0,0.15)"; c.beginPath(); c.ellipse(Math.cos(p.ph) * 18, -5, 6, 3, 0, 0, TAU); c.fill(); c.restore(); }
      fillR(c, 0, base, this.W, 10, 0, "#8a5a2b");
      this.ghost(this.pl[0].x, top + 60, now);
    }
  }), "circus");

  /* 30. Clavados: mantené para girar rápido y soltá para entrar derecho al agua */
  regD("dive", "Clavados", "Mantené apretado para dar vueltas y soltá para abrirte. Tenés que entrar al agua derecho, de cabeza.", "#5ce1e6", G("Dive", {
    ctl: "hold",
    init: function () { this.reset2(); },
    reset2: function () { this.ph = "ready"; this.y = 0; this.vy = 0; this.a = 0; this.rot = 0; this.wt = 0.5; },
    press: function () { if (this.ph === "ready" && this.wt <= 0) { this.ph = "air"; this.vy = -420; this.acts++; } },
    step: function (dt) {
      if (this.ph === "ready") { this.wt -= dt; return; }
      if (this.ph === "done") { this.wt -= dt; if (this.wt <= 0) this.reset2(); return; }
      var sp = this.holding ? 9 : 1.2; this.a += sp * dt; this.rot += sp * dt; this.vy += 900 * dt; this.y += this.vy * dt;
      var water = this.H - this.pb - 90 - (this.pt + 110);
      if (this.y >= water) { var err = adiff(this.a, PI); var flips = Math.floor((this.rot + 0.6) / TAU); if (err < 0.5) { this.good(1 + flips * 2, this.W / 2, this.y, err < 0.2); } else this.hurt(); this.ph = "done"; this.wt = 0.8; }
    },
    draw: function (now) {
      var c = this.ctx, bx = this.W * 0.3, by = this.pt + 110, wy = this.H - this.pb - 90; fillR(c, 0, by + 14, bx + 30, 10, 3, "#f2f2f2"); c.fillStyle = "#55555f"; c.fillRect(10, by + 24, 16, this.H);
      c.fillStyle = "#1f9fb8"; c.fillRect(0, wy + 12, this.W, this.H); c.fillStyle = "rgba(255,255,255,0.3)"; c.fillRect(0, wy + 12, this.W, 4);
      var x = this.ph === "ready" ? bx : bx + Math.min(110, (this.y + 200) * 0.25), y = by + this.y;
      c.save(); c.translate(x, y); c.rotate(this.a); c.globalAlpha = this.fadeA(); fillR(c, -7, -6, 14, 30, 6, "#ff4d6d"); buddy(c, 0, -14, 10, "#f2b48a"); c.globalAlpha = 1; c.restore();
      this.ghostHold(this.W * 0.7, this.cy, now);
    }
  }), "sea");
