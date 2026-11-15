
  /* ===== 100 copias de juegos conocidos (3/8) ===== */
  function k3fish(c, x, y, r, col, f) { poly(c, [x - f * r * 0.8, y, x - f * r * 1.5, y - r * 0.6, x - f * r * 1.5, y + r * 0.6], col); k1ell(c, x, y, r, r * 0.66, col); dot(c, x + f * r * 0.45, y - r * 0.15, Math.max(1.5, r * 0.16), "#fff"); dot(c, x + f * r * 0.5, y - r * 0.15, Math.max(1, r * 0.08), "#2b2b33"); }
  function k3adiff(a, b) { var d = ((a - b) % TAU + TAU) % TAU; return d > PI ? d - TAU : d; }

  /* 25. Pez come pez */
  regD("pezgrande", "Pez come pez", "Tocá donde querés nadar. Comé los peces más chicos que vos. Los rojos más grandes te comen.", "#ff9f1c", G("Pezgrande", {
    init: function () { this.px = this.W / 2; this.py = this.cy; this.tx = this.px; this.ty = this.py; this.sz = 14; this.f = 1; this.fs = []; this.nf = 0.2; },
    act: function (x, y) { this.tx = x; this.ty = clamp(y, this.pt + 20, this.H - this.pb - 20); this.acts++; },
    step: function (dt) {
      var i, dx = this.tx - this.px, dy = this.ty - this.py, d = Math.hypot(dx, dy), sp = Math.max(110, 175 - this.sz); if (d > 3) { this.px += dx / d * Math.min(d, sp * dt); this.py += dy / d * Math.min(d, sp * dt); if (Math.abs(dx) > 4) this.f = dx > 0 ? 1 : -1; }
      this.nf -= dt; if (this.nf <= 0 && this.fs.length < 14) { this.nf = rnd(0.4, 0.9); var L = Math.random() < 0.5, r = clamp(this.sz * rnd(0.4, 1.7), 6, 70); this.fs.push({ x: L ? -r * 2 : this.W + r * 2, y: rnd(this.pt + 30, this.H - this.pb - 30), r: r, v: (L ? 1 : -1) * rnd(40, 100), col: pickOf(["#3ddc84", "#ffd23f", "#c77dff", "#ff5fd2"]) }); }
      for (i = 0; i < this.fs.length; i++) { var q = this.fs[i]; q.x += q.v * dt; q.y += Math.sin(this.t * 2 + i) * 12 * dt; if (q.x < -160 || q.x > this.W + 160) q.gone = 1;
        if (!q.gone && Math.hypot(q.x - this.px, q.y - this.py) < this.sz + q.r * 0.6) { if (q.r < this.sz * 0.92) { q.gone = 1; this.add(1); this.sz = Math.min(56, this.sz + q.r * 0.12); sfx(500 - this.sz * 3, 0.05, "sine", 0.05, 1.3); if (this.sz >= 54) { this.good(5, this.px, this.py, true); this.sz = 14; } } else if (q.r > this.sz * 1.08) { this.hurt(); this.px -= q.v * 0.3; } } }
      k1fil(this.fs, function (q) { return q.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i;
      for (i = 0; i < this.fs.length; i++) { var q = this.fs[i]; k3fish(c, q.x, q.y, q.r, q.r > this.sz * 1.08 ? "#ff4d6d" : q.col, q.v > 0 ? 1 : -1); }
      c.globalAlpha = this.fadeA(); k3fish(c, this.px, this.py, this.sz, "#ff9f1c", this.f); c.globalAlpha = 1;
      fillR(c, 16, this.pt + 2, this.W - 92, 7, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (this.W - 92) * clamp((this.sz - 14) / 40, 0, 1), 7, 4, "#ff9f1c");
      this.ghost(this.px + 70, this.py + 40, now);
    }
  }), "sea");

  /* 26. Víbora */
  regD("vibora", "Víbora", "Mantené a la izquierda o a la derecha para doblar. Comé puntitos y hacé que las otras choquen contra vos.", "#3ddc84", G("Vibora", {
    ctl: "hold",
    init: function () { this.side = 1; this.food = []; for (var k = 0; k < 40; k++) this.addF(); this.me = this.snake(this.W / 2, this.H - this.pb - 120, -PI / 2, "#3ddc84", 60); this.ai = [this.snake(80, this.pt + 120, 0, "#ff5fd2", 70), this.snake(this.W - 80, this.cy, PI, "#ffd23f", 70)]; },
    snake: function (x, y, a, col, L) { var s = { x: x, y: y, a: a, col: col, L: L, tr: [] }; for (var k = 0; k < L / 4; k++) s.tr.push({ x: x - Math.cos(a) * k * 4, y: y - Math.sin(a) * k * 4 }); return s; },
    addF: function (x, y) { this.food.push({ x: x !== undefined ? x : rnd(16, this.W - 16), y: y !== undefined ? y : rnd(this.pt + 16, this.H - this.pb - 16), col: pickOf(["#ff4d6d", "#ffd23f", "#c77dff", "#ff9f1c", "#f2f2f2"]) }); },
    press: function (x) { this.side = x < this.W / 2 ? -1 : 1; this.acts++; },
    mv: function (s, dt, sp) { s.x += Math.cos(s.a) * sp * dt; s.y += Math.sin(s.a) * sp * dt; if (s.x < 10 || s.x > this.W - 10) { s.a = PI - s.a; s.x = clamp(s.x, 10, this.W - 10); } if (s.y < this.pt + 10 || s.y > this.H - this.pb - 10) { s.a = -s.a; s.y = clamp(s.y, this.pt + 10, this.H - this.pb - 10); } var h = s.tr[0]; if (Math.hypot(s.x - h.x, s.y - h.y) >= 4) { s.tr.unshift({ x: s.x, y: s.y }); while (s.tr.length > s.L / 4) s.tr.pop(); } },
    hits: function (h, s) { for (var k = 3; k < s.tr.length; k++) if (Math.abs(s.tr[k].x - h.x) < 10 && Math.abs(s.tr[k].y - h.y) < 10) return true; return false; },
    step: function (dt) {
      var i, j, me = this.me;
      if (this.holding) me.a += this.side * 3.6 * dt; this.mv(me, dt, 125);
      for (i = 0; i < this.ai.length; i++) { var s = this.ai[i]; if (s.dead) { s.dead -= dt; if (s.dead <= 0) this.ai[i] = this.snake(pickOf([40, this.W - 40]), rnd(this.pt + 60, this.H - this.pb - 60), rnd(0, TAU), s.col, 70); continue; }
        var best = null, bd = 1e9; for (j = 0; j < this.food.length; j++) { var dd = Math.hypot(this.food[j].x - s.x, this.food[j].y - s.y); if (dd < bd) { bd = dd; best = this.food[j]; } }
        var want = best ? Math.atan2(best.y - s.y, best.x - s.x) : s.a; for (j = 0; j < me.tr.length; j += 3) { var px = me.tr[j].x - s.x, py = me.tr[j].y - s.y; if (px * px + py * py < 1600 && Math.cos(Math.atan2(py, px) - s.a) > 0.5) { want = s.a + (k3adiff(Math.atan2(py, px), s.a) > 0 ? -1.5 : 1.5); break; } }
        s.a += clamp(k3adiff(want, s.a), -2.6 * dt, 2.6 * dt); this.mv(s, dt, 105 + Math.min(this.t, 90) * 0.3);
        if (this.hits(s, me)) { s.dead = 2; this.good(3, s.x, s.y, true); for (j = 0; j < s.tr.length; j += 4) this.addF(s.tr[j].x, s.tr[j].y); continue; }
        if (this.hits(me, s)) { this.hurt(); me.L = Math.max(40, me.L * 0.6); me.x = this.W / 2; me.y = this.H - this.pb - 120; me.a = -PI / 2; me.tr = [{ x: me.x, y: me.y }]; } }
      for (j = 0; j < this.food.length; j++) { var f = this.food[j]; if (Math.abs(f.x - me.x) < 13 && Math.abs(f.y - me.y) < 13) { f.gone = 1; me.L += 6; this.add(1); continue; } for (i = 0; i < this.ai.length; i++) { var a2 = this.ai[i]; if (!a2.dead && Math.abs(f.x - a2.x) < 12 && Math.abs(f.y - a2.y) < 12) { f.gone = 1; a2.L = Math.min(220, a2.L + 5); break; } } }
      k1fil(this.food, function (f) { return f.gone; }); while (this.food.length < 40) this.addF();
    },
    drawS: function (c, s, alpha) { c.globalAlpha = alpha; for (var k = s.tr.length - 1; k >= 0; k -= 2) dot(c, s.tr[k].x, s.tr[k].y, 7, s.col); var hx = s.x, hy = s.y; dot(c, hx, hy, 9, s.col); dot(c, hx + Math.cos(s.a - 0.6) * 5, hy + Math.sin(s.a - 0.6) * 5, 3, "#fff"); dot(c, hx + Math.cos(s.a + 0.6) * 5, hy + Math.sin(s.a + 0.6) * 5, 3, "#fff"); c.globalAlpha = 1; },
    draw: function (now) {
      var c = this.ctx, i;
      for (i = 0; i < this.food.length; i++) dot(c, this.food[i].x, this.food[i].y, 4, this.food[i].col);
      for (i = 0; i < this.ai.length; i++) if (!this.ai[i].dead) this.drawS(c, this.ai[i], 1);
      this.drawS(c, this.me, this.fadeA());
      this.ghostHold(this.W * 0.75, this.H - this.pb - 60, now);
    }
  }), "garden");

  /* 27. Agujero */
  regD("agujero", "Agujero", "Tocá donde querés mover el agujero. Tragate todo lo que sea más chico. Crecé antes de que se acabe el tiempo.", "#2b2b33", G("Agujero", {
    init: function () { this.lvl = 0; this.start(); },
    start: function () { this.hx = this.W / 2; this.hy = this.cy; this.tx = this.hx; this.ty = this.hy; this.r = 20; this.tl = 35; this.ob = []; for (var k = 0; k < 34; k++) this.addO(); },
    addO: function () { var q = Math.random(), o = { x: rnd(20, this.W - 20), y: rnd(this.pt + 20, this.H - this.pb - 20), sw: 0 }; if (q < 0.4) { o.k = "p"; o.s = 7; } else if (q < 0.65) { o.k = "t"; o.s = 14; } else if (q < 0.85) { o.k = "c"; o.s = 22; o.col = pickOf(["#ff4d6d", "#ffd23f", "#3ddc84", "#c77dff"]); } else { o.k = "b"; o.s = 40; o.col = pickOf(["#ff9f1c", "#ff5fd2", "#d9dde3"]); } if (Math.hypot(o.x - this.hx, o.y - this.hy) < this.r + o.s + 10) o.x = (o.x + this.W / 2) % this.W; this.ob.push(o); },
    act: function (x, y) { this.tx = x; this.ty = clamp(y, this.pt + 10, this.H - this.pb - 10); this.acts++; },
    step: function (dt) {
      var i, dx = this.tx - this.hx, dy = this.ty - this.hy, d = Math.hypot(dx, dy); if (d > 3) { this.hx += dx / d * Math.min(d, 150 * dt); this.hy += dy / d * Math.min(d, 150 * dt); }
      this.tl -= dt; if (this.tl <= 0) { this.hurt(); this.start(); return; }
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i]; if (o.sw > 0) { o.sw += dt * 3; if (o.sw >= 1) o.gone = 1; continue; } if (o.s < this.r * 0.9 && Math.hypot(o.x - this.hx, o.y - this.hy) < this.r - o.s * 0.3) { o.sw = 0.01; this.add(1); this.r = Math.min(110, this.r + o.s * 0.06); sfx(300 + o.s * 6, 0.05, "sine", 0.04, 0.6); } }
      k1fil(this.ob, function (o) { return o.gone; }); while (this.ob.length < 30) this.addO();
      if (this.r >= 90) { this.lvl++; this.good(5, this.hx, this.hy, true); this.start(); }
    },
    draw: function (now) {
      var c = this.ctx, i;
      c.fillStyle = "#55555f"; for (i = 0; i < 4; i++) { c.fillRect(0, this.pt + 90 + i * 160, this.W, 34); c.fillRect(40 + i * 110, this.pt, 30, this.H); }
      k1ell(c, this.hx, this.hy, this.r, this.r * 0.8, "#111117"); c.strokeStyle = "#3a3a44"; c.lineWidth = 4; c.beginPath(); c.ellipse(this.hx, this.hy, this.r, this.r * 0.8, 0, 0, TAU); c.stroke();
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i], sc = 1 - o.sw, x = o.sw > 0 ? o.x + (this.hx - o.x) * o.sw : o.x, y = o.sw > 0 ? o.y + (this.hy - o.y) * o.sw : o.y; if (sc <= 0) continue;
        if (o.k === "p") buddy(c, x, y, 7 * sc, "#f2b48a"); else if (o.k === "t") { dot(c, x, y, 13 * sc, "#2f8f4e"); dot(c, x - 3, y - 3, 6 * sc, "#3ddc84"); } else if (o.k === "c") carV(c, x, y, 22 * sc, 38 * sc, o.col); else { fillR(c, x - 30 * sc, y - 30 * sc, 60 * sc, 60 * sc, 4, o.col); c.fillStyle = "#2b2b33"; for (var w = 0; w < 4; w++) c.fillRect(x - 22 * sc + (w % 2) * 26 * sc, y - 22 * sc + Math.floor(w / 2) * 26 * sc, 18 * sc, 16 * sc); } }
      fillR(c, 16, this.pt + 2, this.W - 92, 7, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (this.W - 92) * clamp((this.r - 20) / 70, 0, 1), 7, 4, "#3ddc84");
      fillR(c, 16, this.pt + 13, this.W - 92, 5, 3, "rgba(255,255,255,0.12)"); fillR(c, 16, this.pt + 13, (this.W - 92) * clamp(this.tl / 35, 0, 1), 5, 3, this.tl < 8 ? "#ff4d6d" : "#f2f2f2");
      this.ghost(this.hx + 70, this.hy + 40, now);
    }
  }), "city");

  /* 28. Cañón de bolas */
  regD("canonbolas", "Cañón de bolas", "Arrastrá el cañón a los costados. Dispara solo. Rompé las bolas: las grandes se parten en dos.", "#ff4d6d", G("Canonbolas", {
    ctl: "drag",
    init: function () { this.fy = this.H - this.pb - 40; this.px = this.W / 2; this.tx = this.px; this.bl = []; this.bu = []; this.ft = 0; this.nb = 0.5; },
    drag: function (x) { this.tx = x; },
    ball: function (x, y, r, vx) { return { x: x, y: y, r: r, hp: Math.round(r * 0.75), vx: vx, vy: 0, col: pickOf(["#3ddc84", "#ffd23f", "#c77dff", "#ff9f1c", "#ff5fd2"]) }; },
    step: function (dt) {
      var i, j; this.px += (this.tx - this.px) * Math.min(1, dt * 14); this.px = clamp(this.px, 20, this.W - 20);
      this.ft -= dt; if (this.ft <= 0) { this.ft = 0.08; this.bu.push({ x: this.px + rnd(-3, 3), y: this.fy - 40 }); }
      this.nb -= dt; if (this.nb <= 0 && this.bl.length < 2 + Math.floor(this.t / 25)) { this.nb = 2.5; var L = Math.random() < 0.5; this.bl.push(this.ball(L ? -30 : this.W + 30, this.pt + rnd(40, 140), rnd(22, 40), (L ? 1 : -1) * rnd(50, 90))); }
      for (i = 0; i < this.bl.length; i++) { var b = this.bl[i]; b.vy += 520 * dt; b.x += b.vx * dt; b.y += b.vy * dt; if (b.y + b.r > this.fy) { b.y = this.fy - b.r; b.vy = -(360 + b.r * 4); } if ((b.x < b.r && b.vx < 0) || (b.x > this.W - b.r && b.vx > 0)) { if (b.x > -b.r && b.x < this.W + b.r) b.vx = -b.vx; }
        if (Math.abs(b.x - this.px) < b.r + 16 && b.y + b.r > this.fy - 40) { this.hurt(); b.vy = -500; b.vx = (b.x < this.px ? -1 : 1) * Math.abs(b.vx); } }
      for (i = 0; i < this.bu.length; i++) { var u = this.bu[i]; u.y -= 720 * dt; if (u.y < this.pt) u.gone = 1;
        for (j = 0; j < this.bl.length; j++) { var q = this.bl[j]; if (!q.dead && Math.hypot(q.x - u.x, q.y - u.y) < q.r) { u.gone = 1; q.hp--; if (q.hp <= 0) { q.dead = 1; this.add(1); if (q.r > 15) { this.bl.push(this.ball(q.x - 6, q.y, q.r * 0.7, -Math.abs(q.vx) - 20)); this.bl.push(this.ball(q.x + 6, q.y, q.r * 0.7, Math.abs(q.vx) + 20)); this.bl[this.bl.length - 1].vy = this.bl[this.bl.length - 2].vy = -300; } } break; } } }
      k1fil(this.bl, function (b) { return b.dead; }); k1fil(this.bu, function (u) { return u.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i;
      c.fillStyle = "#6b4a2b"; c.fillRect(0, this.fy, this.W, this.H - this.fy);
      for (i = 0; i < this.bu.length; i++) dot(c, this.bu[i].x, this.bu[i].y, 3.5, "#fff3b0");
      for (i = 0; i < this.bl.length; i++) { var b = this.bl[i], k = b.hp / Math.max(1, Math.round(b.r * 0.75)); dot(c, b.x, b.y, b.r, b.col); dot(c, b.x, b.y, b.r * (0.35 + 0.5 * (1 - k)), "rgba(0,0,0,0.18)"); dot(c, b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.22, "rgba(255,255,255,0.5)"); }
      c.globalAlpha = this.fadeA(); fillR(c, this.px - 8, this.fy - 46, 16, 30, 4, "#9aa1ab"); fillR(c, this.px - 22, this.fy - 22, 44, 18, 6, "#ff4d6d"); dot(c, this.px - 13, this.fy - 4, 7, "#2b2b33"); dot(c, this.px + 13, this.fy - 4, 7, "#2b2b33"); c.globalAlpha = 1;
      this.ghostDrag(this.fy - 90, now);
    }
  }), "desert");

  /* 29. Rompe vidrios */
  regD("vidrios", "Rompe vidrios", "Tocá los vidrios para tirarles una bola antes de chocarlos.", "#d9dde3", G("Vidrios", {
    init: function () { this.ox = this.W / 2; this.oy = this.cy - 20; this.F = this.W * 0.5; this.pn = []; this.bs = []; this.np = 0.5; this.dist = 0; this.cd = 0; },
    act: function (x, y) { if (this.cd > 0) return; this.cd = 0.15; this.bs.push({ dx: (x - this.ox) / this.F, dy: (y - this.oy) / this.F, z: 0.2, t: 0 }); this.acts++; sfx(300, 0.05, "sine", 0.05, 1.6); },
    sx: function (X, z) { return this.ox + X / z * this.F; }, sy: function (Y, z) { return this.oy + Y / z * this.F; },
    step: function (dt) {
      var i, j, v = 1.3 + Math.min(this.t, 120) * 0.012; this.dist += v * dt; this.cd -= dt;
      this.np -= dt; if (this.np <= 0) { this.np = Math.max(0.9, 1.9 - this.t * 0.01) * rnd(0.8, 1.2); var w = rnd(0.7, 1.3), h = rnd(0.7, 1.3); this.pn.push({ X: rnd(-1.4 + w / 2, 1.4 - w / 2), Y: rnd(-1.2 + h / 2, 1.2 - h / 2), w: w, h: h, z: 7 }); }
      for (i = 0; i < this.pn.length; i++) { var p = this.pn[i]; p.z -= v * dt; if (p.br) { p.br -= dt; if (p.br <= 0) p.gone = 1; continue; } if (p.z < 0.35) { p.gone = 1; this.hurt(); } }
      for (i = 0; i < this.bs.length; i++) { var b = this.bs[i], z0 = b.z; b.z += 7 * dt; b.t += dt; if (b.z > 8) { b.gone = 1; continue; }
        for (j = 0; j < this.pn.length; j++) { var q = this.pn[j]; if (q.br || q.gone) continue; if (z0 <= q.z && b.z >= q.z) { var X = b.dx * q.z, Y = b.dy * q.z + 0.15 * b.t * b.t; if (Math.abs(X - q.X) < q.w / 2 && Math.abs(Y - q.Y) < q.h / 2) { q.br = 0.18; b.gone = 1; this.add(1); sfx(1200, 0.08, "triangle", 0.04, 0.5); break; } } } }
      k1fil(this.pn, function (p) { return p.gone; }); k1fil(this.bs, function (b) { return b.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, k, W = this.W;
      c.strokeStyle = "rgba(255,255,255,0.18)"; c.lineWidth = 2;
      for (k = 0; k < 7; k++) { var z = 1 + ((k - this.dist * 1.2) % 7 + 7) % 7; c.strokeRect(this.sx(-1.6, z), this.sy(-1.4, z), 3.2 / z * this.F, 2.8 / z * this.F); }
      var ps = this.pn.slice().sort(function (a, b) { return b.z - a.z; });
      for (i = 0; i < ps.length; i++) { var p = ps[i], x0 = this.sx(p.X - p.w / 2, p.z), y0 = this.sy(p.Y - p.h / 2, p.z), ww = p.w / p.z * this.F, hh = p.h / p.z * this.F; if (p.br) { c.strokeStyle = "#f2f2f2"; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + ww, y0 + hh); c.moveTo(x0 + ww, y0); c.lineTo(x0, y0 + hh); c.moveTo(x0 + ww / 2, y0); c.lineTo(x0 + ww / 2, y0 + hh); c.stroke(); continue; } c.fillStyle = "rgba(220,245,255,0.28)"; c.fillRect(x0, y0, ww, hh); c.strokeStyle = "#f2f2f2"; c.lineWidth = Math.max(1, 4 / p.z); c.strokeRect(x0, y0, ww, hh); k1ln(c, x0 + ww * 0.15, y0 + hh * 0.2, x0 + ww * 0.3, y0 + hh * 0.08, Math.max(1, 3 / p.z), "rgba(255,255,255,0.7)"); }
      for (i = 0; i < this.bs.length; i++) { var b = this.bs[i]; dot(c, this.sx(b.dx * b.z, b.z), this.sy(b.dy * b.z + 0.15 * b.t * b.t, b.z), Math.max(2, 10 / b.z), "#c0c4cc"); }
      this.ghost(W * 0.5, this.cy, now);
    }
  }), "build");

  /* 30. Túnel */
  regD("tunel", "Túnel", "Arrastrá a los costados para girar el túnel. Pasá por donde no hay pared.", "#ff9f1c", G("Tunel", {
    ctl: "drag",
    init: function () { this.n = 8; this.ox = this.W / 2; this.oy = this.cy; this.R = Math.hypot(this.W, this.H - this.pt) * 0.55; this.r0 = 12; this.rot = 0; this.ob = []; this.no = 0.6; this.dist = 0; },
    drag: function (x) { this.rot = (x / this.W) * TAU * 1.1; },
    rad: function (d) { return this.r0 + (this.R - this.r0) * Math.pow(d, 2.6); },
    q: function (c, d1, d2, k, col) { var a1 = this.rot + k * TAU / this.n, a2 = a1 + TAU / this.n, r1 = this.rad(d1), r2 = this.rad(d2), ox = this.ox, oy = this.oy; poly(c, [ox + Math.cos(a1) * r1, oy + Math.sin(a1) * r1, ox + Math.cos(a2) * r1, oy + Math.sin(a2) * r1, ox + Math.cos(a2) * r2, oy + Math.sin(a2) * r2, ox + Math.cos(a1) * r2, oy + Math.sin(a1) * r2], col); },
    bot: function () { return Math.floor((((PI / 2 - this.rot) % TAU) + TAU) % TAU / (TAU / this.n)); },
    step: function (dt) {
      var i, v = 0.42 + Math.min(this.t, 120) * 0.003; this.dist += v * dt;
      this.no -= dt; if (this.no <= 0) { this.no = Math.max(0.6, 1.2 - this.t * 0.005); var sol = [], g = ri(0, this.n), n = ri(3, 6); for (var k = 0; k < this.n; k++) sol.push(0); for (k = 0; k < n; k++) sol[(g + 1 + k) % this.n] = 1; this.ob.push({ d: 0, sol: sol, col: pickOf(["#ff4d6d", "#3ddc84", "#ffd23f", "#c77dff"]) }); }
      var b = this.bot(), pd = 0.86;
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i], d0 = o.d; o.d += v * dt; if (!o.hit && d0 < pd && o.d >= pd) { if (o.sol[b]) { o.hit = 1; this.hurt(); } else this.add(1); } if (o.d > 1.05) o.gone = 1; }
      k1fil(this.ob, function (o) { return o.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, k;
      for (k = 0; k < this.n; k++) this.q(c, 0, 1.1, k, k % 2 ? "#2b1d3a" : "#33244a");
      c.strokeStyle = "rgba(255,255,255,0.12)"; c.lineWidth = 2; for (i = 0; i < 8; i++) { var d = ((i / 8 + this.dist) % 1); c.beginPath(); for (k = 0; k <= this.n; k++) { var a = this.rot + k * TAU / this.n, r = this.rad(d); if (k) c.lineTo(this.ox + Math.cos(a) * r, this.oy + Math.sin(a) * r); else c.moveTo(this.ox + Math.cos(a) * r, this.oy + Math.sin(a) * r); } c.stroke(); }
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i]; if (o.hit) continue; for (k = 0; k < this.n; k++) if (o.sol[k]) this.q(c, o.d, o.d + 0.05, k, o.col); }
      var pr = this.rad(0.86); c.globalAlpha = this.fadeA(); dot(c, this.ox, this.oy + pr - 14, 11, "#f2f2f2"); dot(c, this.ox - 3, this.oy + pr - 17, 4, "#fff"); c.globalAlpha = 1;
      this.ghostDrag(this.H - this.pb - 50, now);
    }
  }), "space");

  /* 31. Pendiente */
  regD("pendiente", "Pendiente", "Arrastrá a los costados para que la bola siga la pista. Esquivá los bloques rojos.", "#3ddc84", G("Pendiente", {
    ctl: "drag",
    init: function () { this.hy = this.pt + (this.H - this.pt - this.pb) * 0.28; this.by = this.H - this.pb - 20; this.bx = 0; this.tx = 0; this.dist = 0; this.ob = []; this.nz = 600; this.fall = 0; },
    drag: function (x) { this.tx = (x / this.W - 0.5) * 2.6; },
    cen: function (z) { return Math.sin(z * 0.0021) * 1.1 + Math.sin(z * 0.0057 + 1) * 0.5; },
    wid: function () { return Math.max(0.55, 0.95 - this.t * 0.003); },
    rh: function (s) { return this.W * 0.42 * s + 2; },
    step: function (dt) {
      var i, v = 340 + Math.min(this.t, 120) * 2; this.dist += v * dt;
      if (this.fall > 0) { this.fall -= dt; if (this.fall <= 0) this.bx = this.cen(this.dist); return; }
      this.bx += (this.tx - this.bx) * Math.min(1, dt * 5);
      if (Math.abs(this.bx - this.cen(this.dist)) > this.wid() / 2 + 0.05) { this.hurt(); this.fall = 0.6; return; }
      while (this.nz < this.dist + 1600) { this.ob.push({ z: this.nz, lx: rnd(-0.35, 0.35) }); this.nz += rnd(220, 420) * Math.max(0.55, 1 - this.t * 0.004); }
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i], dz = o.z - this.dist; if (!o.done && dz < 10 && dz > -10) { o.done = 1; if (Math.abs(this.cen(o.z) + o.lx * this.wid() - this.bx) < 0.2) this.hurt(); else this.add(1); } if (dz < -80) o.gone = 1; }
      k1fil(this.ob, function (o) { return o.gone; });
    },
    draw: function (now) {
      var c = this.ctx, y, i, w = this.wid();
      for (y = this.hy; y < this.by + 40; y += 4) { var s = (y - this.hy) / (this.by - this.hy) + 0.002, dz = 80 / s - 80, z = this.dist + dz, cx = this.W / 2 + (this.cen(z) - this.bx) * this.rh(s), hw = w / 2 * this.rh(s) * 1.0; c.fillStyle = Math.floor(z / 70) % 2 ? "#3ddc84" : "#2fbf6f"; c.fillRect(cx - hw, y, hw * 2, 4.5); c.fillStyle = "#1f8a4c"; c.fillRect(cx - hw - 3, y, 3, 4.5); c.fillRect(cx + hw, y, 3, 4.5); }
      var os = this.ob.slice().sort(function (a, b) { return b.z - a.z; });
      for (i = 0; i < os.length; i++) { var o = os[i], dz2 = o.z - this.dist; if (dz2 < 0) continue; var s2 = 80 / (80 + dz2), yy = this.hy + s2 * (this.by - this.hy), xx = this.W / 2 + (this.cen(o.z) + o.lx * w - this.bx) * this.rh(s2), sz = 40 * s2 + 3; fillR(c, xx - sz / 2, yy - sz, sz, sz, 3, "#ff4d6d"); c.fillStyle = "#a3203c"; c.fillRect(xx - sz / 2, yy - sz * 0.3, sz, sz * 0.3); }
      var fy = this.fall > 0 ? (0.6 - this.fall) * 300 : 0; c.globalAlpha = this.fall > 0 ? 0.5 : this.fadeA(); dot(c, this.W / 2, this.by - 14 + fy, 15, "#f2f2f2"); dot(c, this.W / 2 - 5, this.by - 19 + fy, 5, "#fff"); c.globalAlpha = 1;
      this.ghostDrag(this.by - 90, now);
    }
  }), "space");

  /* 32. Gelatina */
  regD("gelatina", "Gelatina", "Mantené apretado para estirarte alto y fino. Soltá para quedar bajo y ancho. Pasá justo por el hueco.", "#ff5fd2", G("Gelatina", {
    ctl: "hold",
    init: function () { this.k = 0; this.wl = []; this.nw = 1; this.gy = this.H - this.pb - 80; },
    step: function (dt) {
      var i, v = 0.5 + Math.min(this.t, 120) * 0.004; this.k = clamp(this.k + (this.holding ? 2.6 : -2.6) * dt, 0, 1);
      this.nw -= dt; if (this.nw <= 0) { this.nw = Math.max(1.0, 2 - this.t * 0.01); this.wl.push({ z: 1, need: pickOf([0, 0.25, 0.5, 0.75, 1]) }); }
      for (i = 0; i < this.wl.length; i++) { var w = this.wl[i], z0 = w.z; w.z -= v * dt; if (z0 > 0.08 && w.z <= 0.08 && !w.done) { w.done = 1; var e = Math.abs(this.k - w.need); if (e < 0.2) this.good(e < 0.07 ? 2 : 1, this.W / 2, this.gy - 100, e < 0.07); else { w.hit = 1; this.hurt(); } } if (w.z < -0.1) w.gone = 1; }
      k1fil(this.wl, function (w) { return w.gone; });
    },
    shp: function (k) { return { w: 130 - 96 * k, h: 34 + 120 * k }; },
    draw: function (now) {
      var c = this.ctx, i, W = this.W, gy = this.gy;
      c.fillStyle = "#ffe1ef"; poly(c, [W * 0.3, this.pt + 120, W * 0.7, this.pt + 120, W, gy + 80, 0, gy + 80], "#f6c8dc");
      for (i = this.wl.length - 1; i >= 0; i--) { var w = this.wl[i]; if (w.z < 0.08 && !w.hit) continue; var sc = 0.12 + 0.88 * (1 - w.z), cy = this.pt + 120 + (gy - this.pt - 120) * (1 - w.z), sh = this.shp(w.need), ww = W * 0.9 * sc, hh = 260 * sc, hx = sh.w * 1.12 * sc, hhh = sh.h * 1.06 * sc;
        c.fillStyle = w.hit ? "#a3203c" : "#7a3cff"; c.fillRect(W / 2 - ww / 2, cy - hh, ww / 2 - hx / 2, hh); c.fillRect(W / 2 + hx / 2, cy - hh, ww / 2 - hx / 2, hh); c.fillRect(W / 2 - hx / 2, cy - hh, hx, hh - hhh); }
      var s = this.shp(this.k), wob = Math.sin(now / 90) * 3; c.globalAlpha = this.fadeA(); fillR(c, W / 2 - s.w / 2 - wob, gy - s.h, s.w + wob * 2, s.h, 14, "#ff5fd2"); fillR(c, W / 2 - s.w / 2 + 6, gy - s.h + 6, s.w * 0.3, s.h * 0.25, 6, "rgba(255,255,255,0.4)"); face(c, W / 2, gy - s.h * 0.6, Math.min(16, s.w * 0.3), 0); c.globalAlpha = 1;
      this.ghostHold(W * 0.8, this.cy, now);
    }
  }), "kitchen");

  /* 33. Protegé el globo */
  regD("globito", "Protegé el globo", "Arrastrá el escudo a los costados y empujá todo lo que cae. Que nada toque el globo.", "#ff4d6d", G("Globito", {
    ctl: "drag",
    init: function () { this.bx = this.W / 2; this.by = this.H - this.pb - 90; this.sx = this.W / 2; this.tx = this.sx; this.syy = this.by - 150; this.ob = []; this.no = 0.5; },
    drag: function (x) { this.tx = x; },
    step: function (dt) {
      var i, j, v = 80 + Math.min(this.t, 120) * 0.9; this.sx += (this.tx - this.sx) * Math.min(1, dt * 16); this.sx = clamp(this.sx, 20, this.W - 20);
      this.no -= dt; if (this.no <= 0) { this.no = Math.max(0.5, 1.4 - this.t * 0.008) * rnd(0.7, 1.3); var n = Math.random() < 0.3 ? ri(3, 6) : 1, x0 = rnd(30, this.W - 30); for (j = 0; j < n; j++) this.ob.push({ x: n > 1 ? clamp(x0 + (j - n / 2) * 30, 15, this.W - 15) : x0, y: this.pt - 20 - (n > 1 ? 0 : 0), r: n > 1 ? 13 : rnd(14, 24), vx: 0, vy: 0, col: pickOf(["#55555f", "#9aa1ab", "#c77dff", "#ffd23f"]) }); }
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i]; o.vx *= (1 - 2 * dt); o.vy *= (1 - 2 * dt); o.x += o.vx * dt; o.y += (v + o.vy) * dt; if (o.x < o.r) { o.x = o.r; o.vx = Math.abs(o.vx); } if (o.x > this.W - o.r) { o.x = this.W - o.r; o.vx = -Math.abs(o.vx); }
        var dx = o.x - this.sx, dy = o.y - this.syy, d = Math.hypot(dx, dy); if (d < o.r + 26 && d > 0) { var nx = dx / d, ny = dy / d; o.x = this.sx + nx * (o.r + 26); o.y = this.syy + ny * (o.r + 26); o.vx += nx * 300; o.vy += ny * 200 - v * 0.6; }
        if (!o.hit && Math.hypot(o.x - this.bx, o.y - (this.by - 10)) < o.r + 26) { o.hit = 1; o.gone = 1; this.hurt(); }
        if (o.y > this.H + 30) { o.gone = 1; this.add(1); } if (o.y < this.pt - 200) o.gone = 1; }
      for (i = 0; i < this.ob.length; i++) for (j = i + 1; j < this.ob.length; j++) { var a = this.ob[i], b = this.ob[j], ddx = b.x - a.x, ddy = b.y - a.y, dd = Math.hypot(ddx, ddy), m = a.r + b.r; if (dd < m && dd > 0) { var px = ddx / dd * (m - dd) / 2, py = ddy / dd * (m - dd) / 2; a.x -= px; a.y -= py; b.x += px; b.y += py; } }
      k1fil(this.ob, function (o) { return o.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i;
      k1ln(c, this.bx, this.by + 20, this.bx + Math.sin(now / 300) * 6, this.by + 70, 2, "#d9dde3");
      spBalloon(c, this.bx, this.by, 28, "#ff4d6d");
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i]; fillR(c, o.x - o.r, o.y - o.r, o.r * 2, o.r * 2, 4, o.col); }
      c.globalAlpha = this.fadeA(); dot(c, this.sx, this.syy, 26, "#f2f2f2"); dot(c, this.sx, this.syy, 18, "#d9dde3"); c.globalAlpha = 1;
      this.ghostDrag(this.syy, now);
    }
  }), "sky");

  /* 34. Gomera */
  regD("gomera", "Gomera", "Mantené apretado para cargar y soltá con la fuerza justa. Voltealas torres con los bichos verdes.", "#ff4d6d", G("Gomera", {
    ctl: "hold",
    init: function () { this.gy = this.H - this.pb - 50; this.sx0 = 70; this.sy0 = this.gy - 70; this.lvl = 0; this.level(); },
    level: function () { this.tw = []; var n = Math.min(3, 1 + Math.floor(this.lvl / 2)), k; for (k = 0; k < n; k++) { var x = n === 1 ? this.W * 0.72 : this.W * 0.52 + k * (this.W * 0.4) / (n - 1); this.tw.push({ x: clamp(x + rnd(-12, 12), this.W * 0.45, this.W - 40), nb: ri(1, 4), a: 0, fall: 0, pig: 1 }); } this.birds = 3; this.bd = null; this.pw = 0; this.ch = 0; this.wait = 0; },
    press: function () { if (!this.bd && this.wait <= 0) { this.ch = 1; this.pw = 0; this.acts++; } },
    release: function () { if (this.ch) { this.ch = 0; var p = (0.5 - 0.5 * Math.cos(this.pw * 2.6)), sp = 200 + 440 * p, a = -0.72; this.bd = { x: this.sx0, y: this.sy0, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp }; this.birds--; sfx(220, 0.1, "sawtooth", 0.04, 1.8); } },
    step: function (dt) {
      var i; if (this.ch) this.pw += dt; this.wait -= dt;
      if (this.bd) { var b = this.bd; b.vy += 520 * dt; b.x += b.vx * dt; b.y += b.vy * dt;
        for (i = 0; i < this.tw.length; i++) { var t = this.tw[i]; if (t.fall) continue; var top = this.gy - t.nb * 30; if (Math.abs(b.x - t.x) < 22 && b.y > top - 22 && b.y < this.gy) { t.fall = 1; if (t.pig) { t.pig = 0; this.good(2, t.x, top, false); } b.vx *= 0.3; } }
        if (b.y > this.gy - 8 || b.x > this.W + 30 || b.x < -30) { this.bd = null; this.wait = 0.5; } }
      for (i = 0; i < this.tw.length; i++) if (this.tw[i].fall) this.tw[i].a = Math.min(PI / 2, this.tw[i].a + dt * 3);
      if (!this.bd && this.wait <= 0) { var alive = this.tw.some(function (t) { return t.pig; }); if (!alive) { this.lvl++; this.good(3, this.W / 2, this.cy, true); this.level(); } else if (this.birds <= 0) { this.hurt(); this.level(); } }
    },
    draw: function (now) {
      var c = this.ctx, i, k; c.fillStyle = "#3ddc84"; c.fillRect(0, this.gy, this.W, this.H - this.gy); c.fillStyle = "#2fbf6f"; c.fillRect(0, this.gy, this.W, 6);
      for (i = 0; i < this.tw.length; i++) { var t = this.tw[i]; c.save(); c.translate(t.x + 14, this.gy); c.rotate(t.a); for (k = 0; k < t.nb; k++) { fillR(c, -28, -30 * (k + 1), 28, 28, 3, "#c98a4a"); c.fillStyle = "#8a5a2b"; c.fillRect(-26, -30 * (k + 1) + 12, 24, 3); } if (t.pig) { dot(c, -14, -30 * t.nb - 16, 15, "#3ddc84"); face(c, -14, -30 * t.nb - 16, 13, -1); } c.restore(); }
      c.fillStyle = "#8a5a2b"; c.fillRect(this.sx0 - 4, this.sy0, 8, this.gy - this.sy0); c.fillRect(this.sx0 - 16, this.sy0 - 10, 6, 18); c.fillRect(this.sx0 + 10, this.sy0 - 10, 6, 18);
      for (k = 0; k < this.birds - (this.bd ? 0 : 1); k++) dot(c, 24 + k * 22, this.gy - 10, 9, "#ff4d6d");
      if (this.ch) { var p = (0.5 - 0.5 * Math.cos(this.pw * 2.6)); k1ln(c, this.sx0, this.sy0, this.sx0 - 30 * p, this.sy0 + 20 * p, 4, "#6b4423"); fillR(c, 16, this.pt + 2, this.W - 92, 8, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (this.W - 92) * p, 8, 4, "#ff4d6d"); }
      var bx = this.bd ? this.bd.x : this.sx0 - (this.ch ? 20 : 0), by = this.bd ? this.bd.y : this.sy0 - 6;
      if (this.bd || this.birds > 0) { c.globalAlpha = this.fadeA(); dot(c, bx, by, 12, "#ff4d6d"); face(c, bx, by, 10, 1); poly(c, [bx + 10, by - 2, bx + 18, by + 2, bx + 10, by + 5], "#ffd23f"); c.globalAlpha = 1; }
      this.ghostHold(this.W * 0.5, this.cy, now);
    }
  }), "farm");

  /* 35. Subida */
  regD("subida", "Subida", "Mantené a la derecha para acelerar y a la izquierda para frenar. En el aire, girás el auto. No te des vuelta y juntá nafta.", "#ff9f1c", G("Subida", {
    ctl: "hold",
    init: function () { this.x = 60; this.v = 0; this.y = 0; this.vy = 0; this.air = false; this.ang = 0; this.fuel = 1; this.dd = 0; this.side = 1; this.cans = []; this.nc = 600; this.y = this.hg(this.x); this.cam = 0; this.rot = 0; },
    hg: function (x) { var a = 1 + Math.min(x, 20000) / 6000; return this.H - this.pb - 120 + Math.sin(x * 0.004) * 60 * a + Math.sin(x * 0.011 + 2) * 22 * a - Math.sin(x * 0.0013) * 40; },
    sl: function (x) { return (this.hg(x + 2) - this.hg(x - 2)) / 4; },
    press: function (x) { this.side = x < this.W / 2 ? -1 : 1; this.acts++; },
    step: function (dt) {
      var gas = this.holding && this.side > 0 && this.fuel > 0, brk = this.holding && this.side < 0;
      this.fuel -= dt * (gas ? 0.05 : 0.012); if (this.fuel <= 0) { this.fo = (this.fo || 0) + dt; if (this.fo > 3) { this.fo = 0; this.hurt(); this.fuel = 1; } }
      if (!this.air) { var s = this.sl(this.x), a = Math.atan(s); this.ang += k3adiff(a, this.ang) * Math.min(1, dt * 12); this.v += ((gas ? 300 : 0) - (brk ? 300 * Math.sign(this.v || 1) : 0) - 520 * Math.sin(a) - this.v * 0.25) * dt; if (brk && Math.abs(this.v) < 20) this.v *= 0.8;
        var vyg = this.v * s, nx = this.x + this.v * dt, need = (this.v * this.sl(nx) - vyg) / dt; this.x = nx; this.y = this.hg(this.x); if (need > 1100 && this.v > 150) { this.air = true; this.vy = vyg; this.rot = 0; } }
      else { this.vy += 1000 * dt; this.x += this.v * dt; this.y += this.vy * dt; var w = (gas ? -2.6 : brk ? 2.6 : 0) * dt; this.ang += w; this.rot += w; var g = this.hg(this.x); if (this.y >= g) { this.y = g; this.air = false; var sa = Math.atan(this.sl(this.x)); if (Math.abs(k3adiff(this.ang, sa)) > 1.0) { this.hurt(); this.ang = sa; this.v *= 0.2; } else if (Math.abs(this.rot) > 5.5) this.good(3, this.W * 0.35, this.y - 60, true); this.v *= 0.92; } }
      this.v = clamp(this.v, -150, 520);
      if (this.x > this.dd + 120) { this.dd += 120; this.add(1); }
      while (this.nc < this.x + this.W) { this.cans.push({ x: this.nc }); this.nc += rnd(900, 1400); }
      for (var i = 0; i < this.cans.length; i++) { var cn = this.cans[i]; if (!cn.got && Math.abs(cn.x - this.x) < 26) { cn.got = 1; this.fuel = 1; sfx(700, 0.08, "triangle", 0.05, 1.3); } }
      var xx = this.x; k1fil(this.cans, function (q) { return q.got || q.x < xx - 400; });
      this.cam = this.x - this.W * 0.35;
    },
    draw: function (now) {
      var c = this.ctx, x, i, cam = this.cam;
      c.fillStyle = "#8a5a2b"; c.beginPath(); c.moveTo(0, this.H); for (x = 0; x <= this.W; x += 6) c.lineTo(x, this.hg(cam + x)); c.lineTo(this.W, this.H); c.closePath(); c.fill();
      c.strokeStyle = "#3ddc84"; c.lineWidth = 8; c.beginPath(); for (x = 0; x <= this.W; x += 6) { if (x) c.lineTo(x, this.hg(cam + x) + 2); else c.moveTo(x, this.hg(cam) + 2); } c.stroke();
      for (i = 0; i < this.cans.length; i++) { var cx2 = this.cans[i].x - cam, cy2 = this.hg(this.cans[i].x); fillR(c, cx2 - 9, cy2 - 26, 18, 24, 3, "#ff4d6d"); c.fillStyle = "#ffd23f"; c.fillRect(cx2 - 5, cy2 - 20, 10, 4); }
      var px = this.x - cam; c.globalAlpha = this.fadeA(); c.save(); c.translate(px, this.y - 14); c.rotate(this.ang); fillR(c, -34, -18, 68, 18, 6, "#ff9f1c"); fillR(c, -8, -36, 26, 20, 5, "#ffd23f"); c.fillStyle = "#2b2b33"; c.fillRect(-2, -32, 16, 12); buddy(c, 4, -26, 7, "#f2b48a", 1); dot(c, -22, 2, 11, "#2b2b33"); dot(c, 22, 2, 11, "#2b2b33"); dot(c, -22, 2, 4, "#9aa1ab"); dot(c, 22, 2, 4, "#9aa1ab"); c.restore(); c.globalAlpha = 1;
      fillR(c, 16, this.pt + 2, this.W - 92, 8, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (this.W - 92) * clamp(this.fuel, 0, 1), 8, 4, this.fuel < 0.25 ? "#ff4d6d" : "#ffd23f");
      this.ghostHold(this.W * 0.78, this.H - this.pb - 50, now);
    }
  }), "farm");

  /* 36. Moto acrobática */
  regD("motoacro", "Moto acrobática", "En el aire, mantené apretado para dar la vuelta. Soltá a tiempo para caer con las dos ruedas.", "#ffd23f", G("Motoacro", {
    ctl: "hold",
    init: function () { this.base = this.H - this.pb - 90; this.x = 40; this.y = this.base; this.vy = 0; this.air = false; this.ang = 0; this.rot = 0; this.rp = []; this.nr = 360; this.fall = 0; },
    mkR: function () { var gap = rnd(90, 150) + Math.min(this.t, 100) * 0.6, hh = rnd(50, 80); this.rp.push({ x0: this.nr, x1: this.nr + 90, h: hh, g1: this.nr + 90 + gap, g2: this.nr + 90 + gap + 140 }); this.nr += 90 + gap + 140 + rnd(160, 320); },
    hg: function (x) { for (var i = 0; i < this.rp.length; i++) { var r = this.rp[i]; if (x >= r.x0 && x < r.x1) return this.base - r.h * (x - r.x0) / 90; if (x >= r.x1 && x < r.g1) return this.base + 400; if (x >= r.g1 && x < r.g2) return this.base - r.h * 0.7 * (1 - (x - r.g1) / 140); } return this.base; },
    step: function (dt) {
      var v = 250 + Math.min(this.t, 120) * 1.2;
      while (this.nr < this.x + this.W * 2) this.mkR();
      if (this.fall > 0) { this.fall -= dt; if (this.fall <= 0) { var xx = this.x; for (var i = 0; i < this.rp.length; i++) if (this.rp[i].g2 > xx) { this.x = this.rp[i].g2 + 20; break; } this.y = this.base; this.air = false; this.ang = 0; } return; }
      this.x += v * dt;
      if (!this.air) { var g = this.hg(this.x); if (g > this.y + 6) { this.air = true; this.vy = -v * Math.tan(-this.ang) * 0.9; this.rot = 0; } else { this.y = g; var a = Math.atan2(this.hg(this.x + 3) - this.hg(this.x - 3), 6); this.ang += k3adiff(a, this.ang) * Math.min(1, dt * 14); } }
      if (this.air) { this.vy += 900 * dt; this.y += this.vy * dt; if (this.holding) { this.ang -= 4.6 * dt; this.rot -= 4.6 * dt; } else this.ang += k3adiff(Math.atan2(this.vy, v), this.ang) * Math.min(1, dt * 2.5); var g2 = this.hg(this.x); if (this.y > this.base + 120) { this.hurt(); this.fall = 0.6; return; } if (this.y >= g2 && g2 < this.base + 300) { this.y = g2; this.air = false; var sa = Math.atan2(this.hg(this.x + 3) - this.hg(this.x - 3), 6); if (Math.abs(k3adiff(this.ang, sa)) > 0.8) { this.hurt(); this.ang = sa; } else { var n = Math.floor(Math.abs(this.rot) / TAU + 0.2); if (n > 0) this.good(2 * n, this.W * 0.3, this.y - 60, true); else this.add(1); } } }
      var x0 = this.x; k1fil(this.rp, function (r) { return r.g2 < x0 - 400; });
    },
    draw: function (now) {
      var c = this.ctx, x, i, cam = this.x - this.W * 0.3;
      c.fillStyle = "#c98a4a"; c.beginPath(); c.moveTo(0, this.H); for (x = 0; x <= this.W; x += 4) c.lineTo(x, Math.min(this.H, this.hg(cam + x))); c.lineTo(this.W, this.H); c.closePath(); c.fill();
      c.strokeStyle = "#8a5a2b"; c.lineWidth = 5; c.beginPath(); for (x = 0; x <= this.W; x += 4) { var y = this.hg(cam + x); if (y > this.H) { c.stroke(); c.beginPath(); continue; } c.lineTo(x, y); } c.stroke();
      for (i = 0; i < this.rp.length; i++) { var r = this.rp[i]; c.fillStyle = "#ffd23f"; c.fillRect(r.x1 - cam - 4, this.base - r.h, 4, r.h); }
      var px = this.x - cam, fy = this.fall > 0 ? (0.6 - this.fall) * 400 : 0; c.globalAlpha = this.fall > 0 ? 0.5 : this.fadeA(); c.save(); c.translate(px, this.y - 14 + fy); c.rotate(this.ang); dot(c, -20, 4, 11, "#2b2b33"); dot(c, 20, 4, 11, "#2b2b33"); dot(c, -20, 4, 4, "#9aa1ab"); dot(c, 20, 4, 4, "#9aa1ab"); poly(c, [-20, 0, 6, -14, 24, -6, 20, 2, -6, 0], "#ff4d6d"); fillR(c, -8, -30, 14, 18, 5, "#ffd23f"); buddy(c, 2, -38, 9, "#ff9f1c", 1); c.restore(); c.globalAlpha = 1;
      this.ghostHold(this.W * 0.7, this.cy, now);
    }
  }), "desert");
