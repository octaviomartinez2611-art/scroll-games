
  /* ===== 100 copias de juegos conocidos (2/8) ===== */
  function k2car(c, x, y, w, col) { var h = w * 0.62; fillR(c, x - w / 2, y - h, w, h, w * 0.12, col); fillR(c, x - w * 0.36, y - h * 0.92, w * 0.72, h * 0.34, w * 0.08, "#2b2b33"); c.fillStyle = "#1c1c22"; c.fillRect(x - w * 0.52, y - h * 0.3, w * 0.14, h * 0.34); c.fillRect(x + w * 0.38, y - h * 0.3, w * 0.14, h * 0.34); dot(c, x - w * 0.32, y - h * 0.38, w * 0.07, "#ffd23f"); dot(c, x + w * 0.32, y - h * 0.38, w * 0.07, "#ffd23f"); }

  /* 13. Ruta */
  regD("ruta", "Ruta", "Arrastrá a los costados para manejar. Pasá a los autos sin chocar y no te salgas en las curvas.", "#ff4d6d", G("Ruta", {
    ctl: "drag",
    init: function () { this.hy = this.pt + (this.H - this.pt - this.pb) * 0.3; this.by = this.H - this.pb; this.px = 0; this.tx = 0; this.v = 200; this.dist = 0; this.cur = 0; this.ct = 1; this.ctg = 0; this.cars = []; this.ncar = 1; },
    drag: function (x) { this.tx = (x / this.W - 0.5) * 2.4; },
    rh: function (s) { return this.W * 0.48 * s + 6; },
    cxs: function (s) { return this.W / 2 + this.cur * this.W * 0.7 * (1 - s) * (1 - s) - this.px * this.rh(s); },
    sy: function (s) { return this.hy + s * (this.by - this.hy); },
    step: function (dt) {
      var i; this.ct -= dt; if (this.ct <= 0) { this.ct = rnd(2, 4); this.ctg = pickOf([-1, -0.6, 0, 0, 0.6, 1]); }
      this.cur += (this.ctg - this.cur) * Math.min(1, dt * 0.8);
      var vmax = 330 + Math.min(this.t, 100) * 1.5; this.v += ((Math.abs(this.px) > 1 ? vmax * 0.45 : vmax) - this.v) * Math.min(1, dt * 0.8);
      this.px += ((this.tx - this.px) * 3 - this.cur * this.v / 300 * 0.9) * dt; this.px = clamp(this.px, -1.6, 1.6);
      this.dist += this.v * dt;
      this.ncar -= dt; if (this.ncar <= 0) { this.ncar = rnd(0.9, 1.9) * Math.max(0.5, 1 - this.t * 0.005); this.cars.push({ dz: 900, lx: pickOf([-0.6, 0, 0.6]) + rnd(-0.1, 0.1), v: rnd(110, 190), col: pickOf(["#3ddc84", "#ffd23f", "#c77dff", "#ff9f1c", "#f2f2f2"]) }); }
      for (i = 0; i < this.cars.length; i++) { var q = this.cars[i]; q.dz -= (this.v - q.v) * dt; if (!q.hit && q.dz > -6 && q.dz < 14 && Math.abs(q.lx - this.px) < 0.36) { q.hit = 1; q.gone = 1; this.v *= 0.3; this.hurt(); } if (q.dz < 0 && !q.sc && !q.hit) { q.sc = 1; this.add(1); } if (q.dz < -60 || q.dz > 1400) q.gone = 1; }
      k1fil(this.cars, function (q) { return q.gone; });
    },
    draw: function (now) {
      var c = this.ctx, y, i;
      for (y = this.hy; y < this.by; y += 4) { var s = (y - this.hy) / (this.by - this.hy) + 0.002, dz = 60 / s - 60, st = Math.floor((this.dist + dz) / 60) % 2, cx = this.cxs(s), rh = this.rh(s);
        c.fillStyle = st ? "#2f8f4e" : "#287a43"; c.fillRect(0, y, this.W, 4.5); c.fillStyle = st ? "#ff4d6d" : "#f2f2f2"; c.fillRect(cx - rh * 1.12, y, rh * 2.24, 4.5); c.fillStyle = st ? "#55555f" : "#4c4c56"; c.fillRect(cx - rh, y, rh * 2, 4.5); if (st) { c.fillStyle = "#f2f2f2"; c.fillRect(cx - rh * 0.03, y, rh * 0.06, 4.5); } }
      var cs = this.cars.slice().sort(function (a, b) { return b.dz - a.dz; });
      for (i = 0; i < cs.length; i++) { var q = cs[i]; if (q.dz < -10) continue; var s2 = 60 / (60 + Math.max(0, q.dz)); k2car(c, this.cxs(s2) + q.lx * this.rh(s2), this.sy(s2), 90 * s2 + 6, q.col); }
      c.globalAlpha = this.fadeA(); k2car(c, this.W / 2, this.by - 14, 96, "#ff4d6d"); c.globalAlpha = 1;
      this.ghostDrag(this.by - 120, now);
    }
  }), "road");

  /* 14. Patrulla lunar */
  regD("patrulla", "Patrulla lunar", "Tocá a la izquierda para saltar los pozos y a la derecha para disparar a las rocas y los platillos.", "#c77dff", G("Patrulla", {
    init: function () { this.gy = this.H - this.pb - 70; this.bx = this.W * 0.24; this.h = 0; this.vy = 0; this.s = 0; this.ob = []; this.nx = this.W + 100; this.uf = []; this.bm = []; this.bl = []; this.cd = 0; this.nu = 4; },
    act: function (x) { this.acts++; if (x < this.W / 2) { if (this.h <= 0) { this.vy = 470; this.h = 0.01; sfx(420, 0.07, "triangle", 0.05, 1.4); } } else if (this.cd <= 0) { this.cd = 0.22; this.bl.push({ x: this.bx + 26, y: this.gy - 22 - this.h, vx: 600, vy: 0 }); this.bl.push({ x: this.bx, y: this.gy - 30 - this.h, vx: 0, vy: -600 }); sfx(700, 0.04, "square", 0.03, 1.5); } },
    step: function (dt) {
      var i, j, v = 170 + Math.min(this.t, 100) * 1.3; this.s += v * dt; this.cd -= dt;
      if (this.h > 0) { this.h += this.vy * dt; this.vy -= 1350 * dt; if (this.h <= 0) { this.h = 0; this.vy = 0; } }
      while (this.nx < this.s + this.W + 200) { var pit = Math.random() < 0.5; this.ob.push(pit ? { wx: this.nx, w: rnd(48, 72), pit: 1 } : { wx: this.nx, w: 28, rock: 1, r: rnd(12, 17) }); this.nx += rnd(240, 420) * Math.max(0.6, 1 - this.t * 0.004); }
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i], sx = o.wx - this.s;
        if (o.pit && !o.hit && this.h <= 0 && this.bx > sx + 8 && this.bx < sx + o.w - 8) { o.hit = 1; this.hurt(); }
        if (o.rock && !o.hit && this.h < o.r * 1.4 && Math.abs(sx - this.bx) < o.r + 14) { o.hit = 1; this.hurt(); }
        if (!o.sc && !o.hit && sx + o.w < this.bx - 20) { o.sc = 1; this.add(1); } }
      var s = this.s; k1fil(this.ob, function (o) { return o.wx + o.w - s < -40 || o.dead; });
      this.nu -= dt; if (this.nu <= 0) { this.nu = rnd(3, 6); this.uf.push({ x: this.W + 30, y: this.pt + rnd(80, 200), vx: -rnd(60, 110), bt: rnd(0.5, 1.5) }); }
      for (i = 0; i < this.uf.length; i++) { var u = this.uf[i]; u.x += u.vx * dt; u.y += Math.sin(this.t * 3 + i) * 30 * dt; u.bt -= dt; if (u.bt <= 0) { u.bt = rnd(1, 2); this.bm.push({ x: u.x, y: u.y + 10 }); } if (u.x < -40) u.gone = 1; }
      for (i = 0; i < this.bm.length; i++) { var b = this.bm[i]; b.y += 230 * dt; if (b.y > this.gy) b.gone = 1; else if (Math.abs(b.x - this.bx) < 22 && Math.abs(b.y - (this.gy - 16 - this.h)) < 18) { b.gone = 1; this.hurt(); } }
      for (i = 0; i < this.bl.length; i++) { var q = this.bl[i]; q.x += q.vx * dt; q.y += q.vy * dt; if (q.x > this.W + 10 || q.y < this.pt) q.gone = 1;
        for (j = 0; j < this.uf.length; j++) { var u2 = this.uf[j]; if (!u2.gone && Math.abs(q.x - u2.x) < 24 && Math.abs(q.y - u2.y) < 14) { u2.gone = 1; q.gone = 1; this.good(2, u2.x, u2.y, false); } }
        for (j = 0; j < this.ob.length; j++) { var o2 = this.ob[j]; if (o2.rock && !o2.hit && Math.abs(q.x - (o2.wx - this.s)) < o2.r + 4 && Math.abs(q.y - (this.gy - o2.r)) < o2.r + 4) { o2.dead = 1; q.gone = 1; this.add(1); } } }
      k1fil(this.uf, function (u) { return u.gone; }); k1fil(this.bm, function (b) { return b.gone; }); k1fil(this.bl, function (b) { return b.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, gy = this.gy, W = this.W;
      c.fillStyle = "#6e5a8a"; for (i = 0; i < 4; i++) { var mx = ((i * 160 - this.s * 0.2) % (W + 200) + W + 200) % (W + 200) - 100; poly(c, [mx - 90, gy, mx, gy - 90 - i * 10, mx + 90, gy], "#4a3d63"); }
      c.fillStyle = "#9a8ab8"; c.fillRect(0, gy, W, this.H - gy);
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i], sx = o.wx - this.s; if (o.pit) { c.fillStyle = "#1a1426"; c.fillRect(sx, gy, o.w, this.H - gy); } else spRock(c, sx, gy - o.r + 2, o.r, "#c8b8e0", i + Math.floor(o.wx)); }
      for (i = 0; i < this.uf.length; i++) spSaucer(c, this.uf[i].x, this.uf[i].y, 46, "#3ddc84");
      for (i = 0; i < this.bm.length; i++) dot(c, this.bm[i].x, this.bm[i].y, 5, "#ff4d6d");
      for (i = 0; i < this.bl.length; i++) dot(c, this.bl[i].x, this.bl[i].y, 4, "#fff3b0");
      var by = gy - this.h; c.globalAlpha = this.fadeA(); fillR(c, this.bx - 26, by - 26, 52, 16, 6, "#ffd23f"); fillR(c, this.bx - 10, by - 38, 22, 14, 5, "#ff9f1c"); c.fillStyle = "#d9dde3"; c.fillRect(this.bx + 2, by - 48, 3, 12); for (i = -1; i <= 1; i++) { dot(c, this.bx + i * 18, by - 8, 8, "#2b2b33"); dot(c, this.bx + i * 18, by - 8, 3, "#9aa1ab"); } c.globalAlpha = 1;
      this.ghost(W * 0.25, gy - 120, now);
    }
  }), "moon");

  /* 15. Tubo */
  regD("tubo", "Tubo", "Arrastrá a los costados para girar por el borde del tubo. Dispara solo. Que nadie llegue al borde.", "#ff5fd2", G("Tubo", {
    ctl: "drag",
    init: function () { this.n = 14; this.cxx = this.W / 2; this.cyy = (this.pt + this.H - this.pb) / 2; this.R = Math.min(this.W, this.H - this.pt - this.pb) * 0.46; this.r0 = this.R * 0.12; this.pa = PI / 2; this.en = []; this.sh = []; this.ne = 1; this.ft = 0; },
    drag: function (x) { this.pa = PI / 2 + (x / this.W - 0.5) * TAU * 0.98; },
    lane: function () { var w = TAU / this.n; return ((Math.round((this.pa - w / 2) / w) % this.n) + this.n) % this.n; },
    rad: function (d) { return this.r0 + (this.R - this.r0) * Math.pow(d, 1.6); },
    pt2: function (k, d) { var a = k * TAU / this.n, r = this.rad(d); return { x: this.cxx + Math.cos(a) * r, y: this.cyy + Math.sin(a) * r }; },
    step: function (dt) {
      var i, j, L = this.lane();
      this.ft -= dt; if (this.ft <= 0) { this.ft = 0.16; this.sh.push({ k: L, d: 1 }); }
      this.ne -= dt; if (this.ne <= 0) { this.ne = Math.max(0.45, 1.6 - this.t * 0.012) * rnd(0.6, 1.3); this.en.push({ k: ri(0, this.n), d: 0.02, v: rnd(0.1, 0.17) + Math.min(this.t, 100) * 0.0015, zig: Math.random() < 0.3 ? 1 : 0, zt: 1 }); }
      for (i = 0; i < this.sh.length; i++) { var s = this.sh[i]; s.d -= 2.3 * dt; if (s.d < 0) s.gone = 1; for (j = 0; j < this.en.length; j++) { var e = this.en[j]; if (!e.gone && e.k === s.k && s.d <= e.d + 0.05 && s.d >= e.d - 0.1) { e.gone = 1; s.gone = 1; this.add(1); break; } } }
      for (i = 0; i < this.en.length; i++) { var e2 = this.en[i]; e2.d += e2.v * dt; if (e2.zig) { e2.zt -= dt; if (e2.zt <= 0) { e2.zt = 0.9; e2.k = (e2.k + pickOf([-1, 1]) + this.n) % this.n; } } if (e2.d >= 1) { e2.gone = 1; this.hurt(); } }
      k1fil(this.sh, function (s) { return s.gone; }); k1fil(this.en, function (e) { return e.gone; });
    },
    draw: function (now) {
      var c = this.ctx, k, i, n = this.n, L = this.lane();
      var a0 = this.pt2(L, 1), a1 = this.pt2(L + 1, 1), b0 = this.pt2(L, 0), b1 = this.pt2(L + 1, 0); poly(c, [a0.x, a0.y, a1.x, a1.y, b1.x, b1.y, b0.x, b0.y], "rgba(255,95,210,0.16)");
      c.strokeStyle = "#c77dff"; c.lineWidth = 2; for (k = 0; k < n; k++) { var p = this.pt2(k, 0), q = this.pt2(k, 1); c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); c.stroke(); }
      c.beginPath(); for (k = 0; k <= n; k++) { var o = this.pt2(k, 1); if (k) c.lineTo(o.x, o.y); else c.moveTo(o.x, o.y); } c.stroke(); c.beginPath(); for (k = 0; k <= n; k++) { var o2 = this.pt2(k, 0); if (k) c.lineTo(o2.x, o2.y); else c.moveTo(o2.x, o2.y); } c.stroke();
      for (i = 0; i < this.sh.length; i++) { var s = this.sh[i], sp = this.pt2(s.k + 0.5, s.d); dot(c, sp.x, sp.y, 2 + 3 * s.d, "#fff3b0"); }
      for (i = 0; i < this.en.length; i++) { var e = this.en[i], ep = this.pt2(e.k + 0.5, e.d), r = 4 + 14 * e.d; c.save(); c.translate(ep.x, ep.y); c.rotate((e.k + 0.5) * TAU / n); poly(c, [-r, -r, r, 0, -r, r, -r * 0.4, 0], e.zig ? "#3ddc84" : "#ff4d6d"); c.restore(); }
      var m = this.pt2(L + 0.5, 1.04), a = (L + 0.5) * TAU / n; c.globalAlpha = this.fadeA(); c.save(); c.translate(m.x, m.y); c.rotate(a); poly(c, [12, 0, -10, -16, -4, 0, -10, 16], "#ffd23f"); c.restore(); c.globalAlpha = 1;
      this.ghostDrag(this.H - this.pb - 50, now);
    }
  }), "space");

  /* 16. Sobreviví */
  regD("sobrevivi", "Sobreviví", "Tocá donde querés caminar. Disparás solo. Juntá las gemas y que no te alcancen.", "#c77dff", G("Sobrevivi", {
    init: function () { this.px = this.W / 2; this.py = this.cy; this.tx = this.px; this.ty = this.py; this.en = []; this.gm = []; this.bo = []; this.ft = 0; this.ne = 0.6; this.lvG = 0; this.ng = 0; },
    act: function (x, y) { this.tx = x; this.ty = clamp(y, this.pt + 20, this.H - this.pb - 20); this.acts++; },
    step: function (dt) {
      var i, j, dx = this.tx - this.px, dy = this.ty - this.py, d = Math.hypot(dx, dy); if (d > 3) { this.px += dx / d * Math.min(d, 155 * dt); this.py += dy / d * Math.min(d, 155 * dt); }
      this.ne -= dt; if (this.ne <= 0 && this.en.length < 60) { this.ne = Math.max(0.22, 1.1 - this.t * 0.012); var sd = ri(0, 4), ex = sd === 0 ? -10 : sd === 1 ? this.W + 10 : rnd(0, this.W), ey = sd === 2 ? this.pt - 10 : sd === 3 ? this.H - this.pb + 10 : rnd(this.pt, this.H - this.pb); this.en.push({ x: ex, y: ey, hp: this.t > 40 && Math.random() < 0.4 ? 2 : 1, v: rnd(38, 64) + Math.min(this.t, 120) * 0.15, oc: 0 }); }
      this.ft -= dt; if (this.ft <= 0) { var best = null, bd = 260; for (i = 0; i < this.en.length; i++) { var dd = Math.hypot(this.en[i].x - this.px, this.en[i].y - this.py); if (dd < bd) { bd = dd; best = this.en[i]; } } if (best) { this.ft = Math.max(0.22, 0.65 - this.lvG * 0.06); this.bo.push({ x: this.px, y: this.py, vx: (best.x - this.px) / bd * 430, vy: (best.y - this.py) / bd * 430, t: 0 }); sfx(800, 0.03, "square", 0.02, 1.4); } }
      var no = Math.min(4, Math.floor(this.lvG / 2));
      for (i = 0; i < this.en.length; i++) { var e = this.en[i], ex2 = this.px - e.x, ey2 = this.py - e.y, ed = Math.hypot(ex2, ey2) || 1; e.x += ex2 / ed * e.v * dt; e.y += ey2 / ed * e.v * dt; e.oc -= dt;
        if (ed < 20) { this.hurt(); e.x -= ex2 / ed * 40; e.y -= ey2 / ed * 40; }
        for (j = 0; j < no; j++) { var oa = this.t * 3 + j * TAU / no, ox = this.px + Math.cos(oa) * 52, oy = this.py + Math.sin(oa) * 52; if (e.oc <= 0 && Math.hypot(e.x - ox, e.y - oy) < 18) { e.hp--; e.oc = 0.4; e.x -= ex2 / ed * 20; e.y -= ey2 / ed * 20; } }
        if (e.hp <= 0 && !e.dead) { e.dead = 1; this.gm.push({ x: e.x, y: e.y }); } }
      for (i = 0; i < this.bo.length; i++) { var b = this.bo[i]; b.x += b.vx * dt; b.y += b.vy * dt; b.t += dt; if (b.t > 1) b.gone = 1; for (j = 0; j < this.en.length; j++) { var e3 = this.en[j]; if (!e3.dead && Math.abs(e3.x - b.x) < 14 && Math.abs(e3.y - b.y) < 14) { e3.hp--; b.gone = 1; if (e3.hp <= 0) { e3.dead = 1; this.gm.push({ x: e3.x, y: e3.y }); } break; } } }
      for (i = 0; i < this.gm.length; i++) { var g = this.gm[i], gx = this.px - g.x, gy = this.py - g.y, gd = Math.hypot(gx, gy); if (gd < 75) { g.x += gx / (gd || 1) * 320 * dt; g.y += gy / (gd || 1) * 320 * dt; } if (gd < 16) { g.gone = 1; this.add(1); this.ng++; if (this.ng % 8 === 0) { this.lvG++; S.perfect(); } } }
      k1fil(this.en, function (e) { return e.dead; }); k1fil(this.bo, function (b) { return b.gone; }); k1fil(this.gm, function (g) { return g.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, no = Math.min(4, Math.floor(this.lvG / 2));
      for (i = 0; i < this.gm.length; i++) gem(c, this.gm[i].x, this.gm[i].y, 7, "#3ddc84");
      for (i = 0; i < this.en.length; i++) { var e = this.en[i], fl = Math.sin(now / 90 + i) * 5; poly(c, [e.x - 6, e.y, e.x - 20, e.y - 8 + fl, e.x - 14, e.y + 4], "#5a2d82"); poly(c, [e.x + 6, e.y, e.x + 20, e.y - 8 + fl, e.x + 14, e.y + 4], "#5a2d82"); dot(c, e.x, e.y, e.hp > 1 ? 12 : 10, e.hp > 1 ? "#ff4d6d" : "#c77dff"); dot(c, e.x - 4, e.y - 2, 2.5, "#fff"); dot(c, e.x + 4, e.y - 2, 2.5, "#fff"); }
      for (i = 0; i < this.bo.length; i++) dot(c, this.bo[i].x, this.bo[i].y, 4, "#fff3b0");
      for (i = 0; i < no; i++) { var oa = this.t * 3 + i * TAU / no; dot(c, this.px + Math.cos(oa) * 52, this.py + Math.sin(oa) * 52, 8, "#ffd23f"); }
      c.globalAlpha = this.fadeA(); poly(c, [this.px - 14, this.py + 16, this.px + 14, this.py + 16, this.px + 9, this.py - 2, this.px - 9, this.py - 2], "#ff4d6d"); buddy(c, this.px, this.py - 6, 12, "#f2b48a"); c.globalAlpha = 1;
      dot(c, this.tx, this.ty, 3, "rgba(255,255,255,0.4)");
      this.ghost(this.px + 70, this.py + 40, now);
    }
  }), "cave");

  /* 17. Hexágono */
  regD("hexagono", "Hexágono", "Mantené a la izquierda o a la derecha para girar. Pasá por los huecos de las paredes.", "#ffd23f", G("Hexagono", {
    ctl: "hold",
    init: function () { this.ox = this.W / 2; this.oy = this.cy; this.pa = PI / 2; this.side = 1; this.rot = 0; this.rv = 0.7; this.walls = []; this.nw = 0; this.pr = 70; this.ft = 4; },
    press: function (x) { this.side = x < this.W / 2 ? -1 : 1; this.acts++; },
    step: function (dt) {
      var i, sp = 150 + Math.min(this.t, 120) * 1.3;
      if (this.holding) this.pa += this.side * 5.4 * dt;
      this.ft -= dt; if (this.ft <= 0) { this.ft = rnd(3, 6); this.rv = -this.rv * rnd(0.9, 1.3); this.rv = clamp(this.rv, -1.6, 1.6); }
      this.rot += this.rv * dt;
      this.nw -= dt; if (this.nw <= 0) { this.nw = Math.max(0.55, 1.15 - this.t * 0.006); var g = ri(0, 6), sol = [1, 1, 1, 1, 1, 1]; sol[g] = 0; if (Math.random() < 0.4) sol[(g + 1) % 6] = 0; if (Math.random() < 0.25) sol[(g + 3) % 6] = 0; this.walls.push({ r: Math.max(this.W, this.H) * 0.72, sol: sol }); }
      var k = Math.floor(((((this.pa - this.rot) % TAU) + TAU) % TAU) / (TAU / 6));
      for (i = 0; i < this.walls.length; i++) { var w = this.walls[i]; w.r -= sp * dt; if (!w.hit && w.r < this.pr + 6 && w.r + 18 > this.pr - 6 && w.sol[k]) { w.hit = 1; this.hurt(); } if (!w.sc && !w.hit && w.r + 18 < this.pr - 6) { w.sc = 1; this.add(1); } }
      k1fil(this.walls, function (w) { return w.r + 18 < 26; });
    },
    hexQ: function (c, r1, r2, k, col) { var a1 = this.rot + k * TAU / 6, a2 = a1 + TAU / 6, ox = this.ox, oy = this.oy; poly(c, [ox + Math.cos(a1) * r1, oy + Math.sin(a1) * r1, ox + Math.cos(a2) * r1, oy + Math.sin(a2) * r1, ox + Math.cos(a2) * r2, oy + Math.sin(a2) * r2, ox + Math.cos(a1) * r2, oy + Math.sin(a1) * r2], col); },
    draw: function (now) {
      var c = this.ctx, i, k, big = Math.max(this.W, this.H);
      for (k = 0; k < 6; k++) this.hexQ(c, 0, big, k, k % 2 ? "rgba(255,210,63,0.10)" : "rgba(255,210,63,0.04)");
      for (i = 0; i < this.walls.length; i++) { var w = this.walls[i]; if (w.hit) continue; for (k = 0; k < 6; k++) if (w.sol[k]) this.hexQ(c, Math.max(26, w.r), Math.max(26, w.r + 18), k, "#ffd23f"); }
      for (k = 0; k < 6; k++) this.hexQ(c, 0, 26, k, "#ff9f1c");
      var px = this.ox + Math.cos(this.pa) * this.pr, py = this.oy + Math.sin(this.pa) * this.pr; c.globalAlpha = this.fadeA(); c.save(); c.translate(px, py); c.rotate(this.pa); poly(c, [10, 0, -6, -8, -6, 8], "#ff4d6d"); c.restore(); c.globalAlpha = 1;
      this.ghostHold(this.W * 0.75, this.H - this.pb - 90, now);
    }
  }), "arcade");

  /* 18. 100 metros */
  regD("cienm", "100 metros", "Tocá rápido izquierda y derecha, alternando. Si tocás dos veces el mismo lado, tropezás. Llegá primero.", "#3ddc84", G("Cienm", {
    init: function () { this.lvl = 0; this.race(); },
    race: function () { this.ph = 0; this.pt0 = 1.2; this.D = 100; this.run = [{ x: 0, v: 0, col: "#ff4d6d", me: 1 }]; for (var k = 0; k < 3; k++) this.run.push({ x: 0, v: 0, vt: 7.6 + this.lvl * 0.35 + k * 0.35 + rnd(-0.2, 0.2), col: pickOf(["#3ddc84", "#ffd23f", "#c77dff", "#ff9f1c"]) }); this.last = -1; this.fin = 0; this.wait = 0; },
    act: function (x) { if (this.ph !== 1) return; var s = x < this.W / 2 ? 0 : 1, me = this.run[0]; this.acts++; if (s !== this.last) { me.v = Math.min(11, me.v + 1.35); this.last = s; sfx(260 + me.v * 30, 0.03, "square", 0.03, 1.2); } else me.v *= 0.55; },
    step: function (dt) {
      var i, me = this.run[0];
      if (this.ph === 0) { this.pt0 -= dt; if (this.pt0 <= 0) this.ph = 1; return; }
      if (this.ph === 2) { this.wait -= dt; if (this.wait <= 0) { this.lvl++; this.race(); } return; }
      me.v = Math.max(0, me.v - me.v * 0.8 * dt); me.x += me.v * dt;
      for (i = 1; i < 4; i++) { var r = this.run[i]; r.v += (r.vt - r.v) * Math.min(1, dt * 1.5); r.x += r.v * dt; if (r.x >= this.D && !r.done) { r.done = 1; this.fin++; } }
      if (me.x >= this.D) { var place = this.fin + 1; if (place === 1) this.good(3, this.W / 2, this.cy, true); else if (place === 2) this.add(1); else this.hurt(); this.ph = 2; this.wait = 1.4; }
      else if (this.fin >= 3) { this.wt2 = (this.wt2 || 0) + dt; if (this.wt2 > 2.5) { this.wt2 = 0; this.hurt(); this.ph = 2; this.wait = 1.2; } }
    },
    draw: function (now) {
      var c = this.ctx, i, me = this.run[0], sc = 34, cam = me.x * sc - this.W * 0.3, top = this.pt + 160, lh = 64;
      for (i = 0; i < 4; i++) { c.fillStyle = i % 2 ? "#c8553d" : "#b94a34"; c.fillRect(0, top + i * lh, this.W, lh); }
      c.fillStyle = "#f2f2f2"; for (i = 0; i <= 4; i++) c.fillRect(0, top + i * lh - 1, this.W, 2);
      for (var m = Math.floor(cam / sc / 10) * 10; m < (cam + this.W) / sc; m += 10) { var lx = m * sc - cam; c.fillStyle = "rgba(255,255,255,0.35)"; c.fillRect(lx, top, 2, lh * 4); }
      var fx = this.D * sc - cam; for (i = 0; i < 16; i++) { c.fillStyle = i % 2 ? "#2b2b33" : "#f2f2f2"; c.fillRect(fx, top + i * lh / 4, 8, lh / 4); c.fillRect(fx + 8, top + i * lh / 4, 8, lh / 4); c.fillStyle = i % 2 ? "#f2f2f2" : "#2b2b33"; c.fillRect(fx + 8, top + i * lh / 4, 8, lh / 4); }
      for (i = 3; i >= 0; i--) { var r = this.run[i], rx = r.x * sc - cam, ry = top + (3 - i) * lh + lh * 0.62, ph = r.x * 3.2; c.globalAlpha = r.me ? this.fadeA() : 1; c.strokeStyle = "#2b2b33"; c.lineWidth = 5; c.lineCap = "round"; c.beginPath(); c.moveTo(rx, ry - 6); c.lineTo(rx + Math.sin(ph) * 12, ry + 14); c.moveTo(rx, ry - 6); c.lineTo(rx - Math.sin(ph) * 12, ry + 14); c.stroke(); c.lineCap = "butt"; fillR(c, rx - 8, ry - 24, 16, 20, 6, r.col); buddy(c, rx + 2, ry - 34, 10, "#f2b48a", 1); c.globalAlpha = 1; }
      if (this.ph === 0) { for (i = 0; i < 3; i++) dot(c, this.W / 2 + (i - 1) * 40, this.pt + 90, 14, this.pt0 < 0.4 * (2 - i) + 0.01 ? "#ff4d6d" : "#55555f"); }
      else if (this.ph === 1 && this.t < 30) for (i = 0; i < 3; i++) dot(c, this.W / 2 + (i - 1) * 40, this.pt + 90, 14, "#3ddc84");
      fillR(c, this.W * 0.06, this.H - this.pb - 140, this.W * 0.4, 110, 18, this.last === 0 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.18)"); fillR(c, this.W * 0.54, this.H - this.pb - 140, this.W * 0.4, 110, 18, this.last === 1 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.18)");
      this.ghost(this.last === 0 ? this.W * 0.74 : this.W * 0.26, this.H - this.pb - 100, now);
    }
  }), "court");

  /* 19. Boxeo */
  regD("boxeo", "Boxeo", "Tocá el lado que no cubre para pegarle. Cuando prepara un golpe, tocá el otro lado para esquivar.", "#ff4d6d", G("Boxeo", {
    init: function () { this.lvl = 0; this.foe(); this.pf = [0, 0]; },
    foe: function () { this.hp = 0; this.st = "guard"; this.gs = pickOf([-1, 1]); this.tm = rnd(0.8, 1.4); this.col = pickOf(["#3ddc84", "#c77dff", "#ff9f1c", "#ffd23f"]); this.stun = 0; this.fl = 0; this.op = 0; },
    act: function (x) {
      var s = x < this.W / 2 ? -1 : 1; this.acts++; if (this.stun > 0) return; this.pf[s < 0 ? 0 : 1] = 0.14;
      if (this.st === "wind") { if (s !== this.as) { this.st = "open"; this.tm = 0.9; sfx(600, 0.05, "sine", 0.05, 1.5); } else { this.st = "guard"; this.tm = 1; this.hurt(); } return; }
      if (this.st === "open") { this.st = "guard"; this.tm = rnd(0.7, 1.2); this.hit(2); return; }
      if (s !== this.gs) this.hit(1); else { this.stun = 0.3; sfx(120, 0.06, "square", 0.04, 0.8); }
    },
    hit: function (n) { this.add(n); this.hp += n; this.fl = 0.22; this.gs = pickOf([-1, 1]); sfx(200, 0.06, "square", 0.05, 0.6); if (this.hp >= 14) { this.good(5, this.W / 2, this.cy, true); this.lvl++; this.foe(); } },
    step: function (dt) {
      this.stun -= dt; this.fl -= dt; this.pf[0] -= dt; this.pf[1] -= dt; this.tm -= dt;
      if (this.tm <= 0) {
        if (this.st === "guard") { this.st = "wind"; this.as = pickOf([-1, 1]); this.tm = Math.max(0.38, 0.7 - this.lvl * 0.05 - this.t * 0.002); }
        else if (this.st === "wind") { this.hurt(); this.st = "guard"; this.tm = rnd(0.9, 1.5); }
        else { this.st = "guard"; this.gs = pickOf([-1, 1]); this.tm = rnd(0.7, 1.4); }
      }
    },
    draw: function (now) {
      var c = this.ctx, W = this.W, cx = W / 2, fy = this.pt + 230, k;
      c.fillStyle = "#ff4d6d"; for (k = 0; k < 3; k++) c.fillRect(0, this.pt + 120 + k * 26, W, 4);
      var sh = this.fl > 0 ? 10 : 0, lean = this.st === "wind" ? this.as * 8 : 0;
      fillR(c, cx - 70 + lean, fy + 40, 140, 160, 40, this.col); buddy(c, cx + lean + sh, fy, 50, "#f2b48a"); fillR(c, cx - 42 + lean, fy - 54, 84, 18, 8, "#ff4d6d");
      for (k = -1; k <= 1; k += 2) { var gx, gy, r = 30, col = "#c41e3a";
        if (this.st === "wind" && k === this.as) { gx = cx + k * 96; gy = fy - 40; r = 24; col = "#ff4d6d"; }
        else if (this.st === "guard" && k === this.gs) { gx = cx + k * 22; gy = fy - 6; r = 34; }
        else if (this.st === "open") { gx = cx + k * 110; gy = fy + 90; }
        else { gx = cx + k * 80; gy = fy + 70; }
        dot(c, gx, gy, r, col); dot(c, gx - r * 0.3, gy - r * 0.3, r * 0.3, "#ff8fa3"); }
      for (k = 0; k < 2; k++) { var s = k ? 1 : -1, ext = this.pf[k] > 0 ? 1 : 0; dot(c, cx + s * (ext ? 40 : 110), this.H - this.pb - (ext ? 180 : 70), ext ? 36 : 42, "#3ddc84"); }
      fillR(c, 16, this.pt + 2, W - 92, 7, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (W - 92) * (1 - this.hp / 14), 7, 4, this.col);
      this.ghost(cx + (this.st === "guard" ? -this.gs : -(this.as || 1)) * 90, this.cy + 120, now);
    }
  }), "court");

  /* 20. Kung fu */
  regD("kungfu", "Kung fu", "Tocá del lado del enemigo cuando esté cerca para patearlo. Si pateás al aire, te quedás quieto un ratito.", "#ffd23f", G("Kungfu", {
    init: function () { this.gy = this.H - this.pb - 90; this.en = []; this.ne = 1; this.stun = 0; this.kick = 0; this.ks = 1; },
    act: function (x) {
      var s = x < this.W / 2 ? -1 : 1, i, best = null, bd = 88; this.acts++; if (this.stun > 0) return; this.kick = 0.16; this.ks = s;
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; if (e.s === s && e.d < bd) { bd = e.d; best = e; } }
      if (best) { best.gone = 1; this.add(1); sfx(240, 0.06, "square", 0.05, 0.6); } else { this.stun = 0.35; sfx(120, 0.06, "sine", 0.04, 0.7); }
    },
    step: function (dt) {
      var i; this.stun -= dt; this.kick -= dt;
      this.ne -= dt; if (this.ne <= 0) { this.ne = Math.max(0.42, 1.4 - this.t * 0.012) * rnd(0.6, 1.3); var run = Math.random() < 0.25 + Math.min(0.3, this.t * 0.004); this.en.push({ s: pickOf([-1, 1]), d: this.W / 2 + 30, v: run ? rnd(170, 210) : rnd(70, 110), run: run, col: run ? "#ff4d6d" : "#c77dff" }); }
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; e.d -= e.v * dt; if (e.d < 26) { e.gone = 1; this.hurt(); } }
      k1fil(this.en, function (e) { return e.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, cx = this.W / 2, gy = this.gy;
      c.fillStyle = "#8a5a2b"; c.fillRect(0, gy, this.W, this.H - gy); c.fillStyle = "#6b4423"; for (i = 0; i < this.W; i += 48) c.fillRect(i, gy, 3, this.H - gy);
      c.fillStyle = "rgba(255,210,63,0.12)"; c.fillRect(cx - 88, gy - 2, 176, 6);
      for (i = 0; i < this.en.length; i++) { var e = this.en[i], ex = cx + e.s * e.d, ph = Math.sin(now / (e.run ? 60 : 110) + i) * 8; c.strokeStyle = "#2b2b33"; c.lineWidth = 5; c.beginPath(); c.moveTo(ex, gy - 30); c.lineTo(ex + ph, gy); c.moveTo(ex, gy - 30); c.lineTo(ex - ph, gy); c.stroke(); fillR(c, ex - 10, gy - 58, 20, 30, 6, e.col); buddy(c, ex, gy - 70, 12, "#f2b48a", -e.s); c.fillStyle = "#2b2b33"; c.fillRect(ex - 12, gy - 74, 24, 5); }
      c.globalAlpha = this.stun > 0 ? 0.5 : this.fadeA(); c.strokeStyle = "#f2f2f2"; c.lineWidth = 7; c.lineCap = "round"; c.beginPath(); c.moveTo(cx, gy - 34); c.lineTo(cx - 10, gy); if (this.kick > 0) { c.moveTo(cx, gy - 34); c.lineTo(cx + this.ks * 70, gy - 46); } else { c.moveTo(cx, gy - 34); c.lineTo(cx + 10, gy); } c.stroke(); c.lineCap = "butt"; fillR(c, cx - 12, gy - 66, 24, 34, 8, "#f2f2f2"); c.fillStyle = "#2b2b33"; c.fillRect(cx - 12, gy - 42, 24, 5); buddy(c, cx, gy - 78, 13, "#f2b48a", this.ks); c.fillStyle = "#ff4d6d"; c.fillRect(cx - 14, gy - 86, 28, 5); c.globalAlpha = 1;
      this.ghost(cx + 70, gy - 140, now);
    }
  }), "city");

  /* 21. Galaxia */
  regD("galaxia", "Galaxia", "Arrastrá la nave a los costados. Dispara sola. Cuidado con los que bajan en picada.", "#ff5fd2", G("Galaxia", {
    ctl: "drag",
    init: function () { this.px = this.W / 2; this.tx = this.px; this.by = this.H - this.pb - 50; this.bu = []; this.eb = []; this.ft = 0; this.wave = 0; this.mk(); },
    mk: function () { this.en = []; var cols = Math.min(6, Math.floor((this.W - 40) / 52)); for (var r = 0; r < 4; r++) for (var c = 0; c < cols; c++) this.en.push({ r: r, c: c, st: 0, col: ["#ff4d6d", "#ff9f1c", "#c77dff", "#3ddc84"][r] }); this.cols = cols; this.nd = 2; this.wave++; },
    slot: function (e) { var sp = 52, x0 = (this.W - (this.cols - 1) * sp) / 2; return { x: x0 + e.c * sp + Math.sin(this.t * 0.9) * 22, y: this.pt + 60 + e.r * 38 }; },
    drag: function (x) { this.tx = x; },
    step: function (dt) {
      var i, j; this.px += (this.tx - this.px) * Math.min(1, dt * 12); this.px = clamp(this.px, 20, this.W - 20);
      this.ft -= dt; if (this.ft <= 0 && this.bu.length < 2) { this.ft = 0.28; this.bu.push({ x: this.px, y: this.by - 20 }); }
      this.nd -= dt; if (this.nd <= 0) { this.nd = Math.max(0.7, 2.4 - this.t * 0.02 - this.wave * 0.1); var form = this.en.filter(function (e) { return e.st === 0; }); if (form.length) { var e = pickOf(form), s = this.slot(e); e.st = 1; e.k = 0; e.x0 = s.x; e.y0 = s.y; e.tgx = this.px; e.dir = pickOf([-1, 1]); e.shot = 0; } }
      for (i = 0; i < this.en.length; i++) { var q = this.en[i];
        if (q.st === 0) { var s2 = this.slot(q); q.x = s2.x; q.y = s2.y; }
        else if (q.st === 1) { q.k += dt / (2.4 - Math.min(1, this.t * 0.006)); q.x = q.x0 + (q.tgx - q.x0) * q.k + Math.sin(q.k * PI * 3) * 70 * q.dir; q.y = q.y0 + q.k * (this.by + 90 - q.y0); if (!q.shot && q.k > 0.3) { q.shot = 1; this.eb.push({ x: q.x, y: q.y }); } if (q.k >= 1) { q.st = 2; q.y = this.pt - 20; } }
        else { var s3 = this.slot(q), dx = s3.x - q.x, dy = s3.y - q.y, d = Math.hypot(dx, dy); if (d < 6) q.st = 0; else { q.x += dx / d * 220 * dt; q.y += dy / d * 220 * dt; } }
        if (q.st === 1 && Math.abs(q.x - this.px) < 22 && Math.abs(q.y - this.by) < 20) { q.dead = 1; this.hurt(); } }
      for (i = 0; i < this.bu.length; i++) { var b = this.bu[i]; b.y -= 640 * dt; if (b.y < this.pt) b.gone = 1; for (j = 0; j < this.en.length; j++) { var e2 = this.en[j]; if (!e2.dead && Math.abs(e2.x - b.x) < 16 && Math.abs(e2.y - b.y) < 14) { e2.dead = 1; b.gone = 1; if (e2.st === 1) this.good(2, e2.x, e2.y, false); else this.add(1); break; } } }
      for (i = 0; i < this.eb.length; i++) { var eb = this.eb[i]; eb.y += 270 * dt; if (eb.y > this.H) eb.gone = 1; else if (Math.abs(eb.x - this.px) < 14 && Math.abs(eb.y - this.by) < 14) { eb.gone = 1; this.hurt(); } }
      k1fil(this.en, function (e) { return e.dead; }); k1fil(this.bu, function (b) { return b.gone; }); k1fil(this.eb, function (b) { return b.gone; });
      if (!this.en.length) { this.good(3, this.W / 2, this.cy, true); this.mk(); }
    },
    draw: function (now) {
      var c = this.ctx, i;
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; if (e.x === undefined) continue; spBug(c, e.x, e.y, 13, e.col); }
      for (i = 0; i < this.bu.length; i++) fillR(c, this.bu[i].x - 2, this.bu[i].y - 8, 4, 14, 2, "#fff3b0");
      for (i = 0; i < this.eb.length; i++) dot(c, this.eb[i].x, this.eb[i].y, 4, "#ff4d6d");
      c.globalAlpha = this.fadeA(); spFighter(c, this.px, this.by, 40, "#f2f2f2"); c.globalAlpha = 1;
      this.ghostDrag(this.by - 70, now);
    }
  }), "space");

  /* 22. Bombita */
  regD("bombita", "Bombita", "Tocá al lado del muñeco para moverte y tocalo a él para dejar una bomba. Rompé ladrillos y atrapá a los globos.", "#ff9f1c", G("Bombita", {
    init: function () { this.C = 9; this.R = 11; this.s = Math.floor(Math.min(this.W / this.C, (this.H - this.pt - this.pb - 10) / this.R)); this.ox = (this.W - this.s * this.C) / 2; this.oy = this.pt + 6; this.lvl = 0; this.board(); },
    board: function () { var r, c; this.g = []; for (r = 0; r < this.R; r++) { this.g.push([]); for (c = 0; c < this.C; c++) { var v = (c % 2 === 1 && r % 2 === 1) ? 1 : 0; if (!v && !(c < 2 && r > this.R - 3) && Math.random() < 0.42) v = 2; this.g[r].push(v); } } this.pc = 0; this.pr = this.R - 1; this.mv = 0; this.fr = [0, this.R - 1]; this.bombs = []; this.fl = []; this.en = []; var n = 3 + Math.min(4, this.lvl), tries = 0; while (this.en.length < n && tries++ < 300) { c = ri(0, this.C); r = ri(0, this.R); if (!this.g[r][c] && c + (this.R - 1 - r) > 5) this.en.push({ c: c, r: r, fc: c, fr: r, k: 1, d: [1, 0] }); } },
    free: function (c, r) { if (c < 0 || r < 0 || c >= this.C || r >= this.R || this.g[r][c]) return false; for (var i = 0; i < this.bombs.length; i++) if (this.bombs[i].c === c && this.bombs[i].r === r) return false; return true; },
    cxy: function (c, r) { return { x: this.ox + (c + 0.5) * this.s, y: this.oy + (r + 0.5) * this.s }; },
    act: function (x, y) {
      this.acts++; var p = this.cxy(this.pc, this.pr);
      if (Math.abs(x - p.x) < this.s * 0.6 && Math.abs(y - p.y) < this.s * 0.6) { if (this.bombs.length < 2 && this.free(this.pc, this.pr)) { this.bombs.push({ c: this.pc, r: this.pr, t: 1.8 }); sfx(200, 0.05, "sine", 0.05, 0.8); } return; }
      if (this.mv > 0) return; var d = k1dir(x, y, p.x, p.y); if (this.free(this.pc + d[0], this.pr + d[1]) || this.flAt(this.pc + d[0], this.pr + d[1])) { this.fr = [this.pc, this.pr]; this.pc += d[0]; this.pr += d[1]; this.mv = 0.12; }
    },
    flAt: function (c, r) { for (var i = 0; i < this.fl.length; i++) if (this.fl[i].c === c && this.fl[i].r === r) return true; return false; },
    boom: function (b) { var ds = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]], i, k; sfx(90, 0.25, "sawtooth", 0.06, 0.5);
      for (i = 0; i < 5; i++) for (k = (i ? 1 : 0); k <= (i ? 2 : 0); k++) { var c = b.c + ds[i][0] * k, r = b.r + ds[i][1] * k; if (c < 0 || r < 0 || c >= this.C || r >= this.R || this.g[r][c] === 1) break; this.fl.push({ c: c, r: r, t: 0.45 }); for (var j = 0; j < this.bombs.length; j++) if (this.bombs[j] !== b && this.bombs[j].c === c && this.bombs[j].r === r) this.bombs[j].t = Math.min(this.bombs[j].t, 0.05); if (this.g[r][c] === 2) { this.g[r][c] = 0; this.add(1); break; } } },
    step: function (dt) {
      var i; this.mv = Math.max(0, this.mv - dt);
      for (i = 0; i < this.bombs.length; i++) { var b = this.bombs[i]; b.t -= dt; if (b.t <= 0 && !b.done) { b.done = 1; this.boom(b); } }
      k1fil(this.bombs, function (b) { return b.done; });
      for (i = 0; i < this.fl.length; i++) this.fl[i].t -= dt; k1fil(this.fl, function (f) { return f.t <= 0; });
      if (this.flAt(this.pc, this.pr)) this.hurt();
      var ev = Math.max(0.32, 0.6 - this.lvl * 0.04);
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; e.k += dt / ev; if (e.k >= 1) { e.k = 0; e.fc = e.c; e.fr = e.r; var opts = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(function (d) { return this.free(e.c + d[0], e.r + d[1]); }, this); if (opts.length) { if (!this.free(e.c + e.d[0], e.r + e.d[1]) || Math.random() < 0.3) e.d = pickOf(opts); e.c += e.d[0]; e.r += e.d[1]; } }
        if (this.flAt(e.c, e.r) || this.flAt(e.fc, e.fr) && e.k < 0.5) { e.dead = 1; this.good(3, this.cxy(e.c, e.r).x, this.cxy(e.c, e.r).y, true); }
        else if (e.c === this.pc && e.r === this.pr && e.k > 0.4) this.hurt(); }
      k1fil(this.en, function (e) { return e.dead; });
      if (!this.en.length) { this.lvl++; this.board(); }
    },
    draw: function (now) {
      var c = this.ctx, s = this.s, r, cc, i;
      for (r = 0; r < this.R; r++) for (cc = 0; cc < this.C; cc++) { var x = this.ox + cc * s, y = this.oy + r * s, v = this.g[r][cc]; c.fillStyle = (r + cc) % 2 ? "#2f8f4e" : "#36a058"; c.fillRect(x, y, s, s); if (v === 1) fillR(c, x + 2, y + 2, s - 4, s - 4, 6, "#9aa1ab"); else if (v === 2) spBrick(c, x + 2, y + 2, s - 4, s - 4, "#c8553d"); }
      for (i = 0; i < this.fl.length; i++) { var f = this.fl[i]; fillR(c, this.ox + f.c * s + 4, this.oy + f.r * s + 4, s - 8, s - 8, 8, "#ff9f1c"); fillR(c, this.ox + f.c * s + 12, this.oy + f.r * s + 12, s - 24, s - 24, 6, "#ffd23f"); }
      for (i = 0; i < this.bombs.length; i++) { var b = this.cxy(this.bombs[i].c, this.bombs[i].r); spBomb(c, b.x, b.y + 2, s * 0.32); }
      for (i = 0; i < this.en.length; i++) { var e = this.en[i], a = this.cxy(e.fc, e.fr), bb = this.cxy(e.c, e.r), ex = a.x + (bb.x - a.x) * e.k, ey = a.y + (bb.y - a.y) * e.k; dot(c, ex, ey, s * 0.36, "#ff5fd2"); face(c, ex, ey, s * 0.32, e.d[0]); }
      var k = this.mv > 0 ? 1 - this.mv / 0.12 : 1, p0 = this.cxy(this.fr[0], this.fr[1]), p1 = this.cxy(this.pc, this.pr), px = p0.x + (p1.x - p0.x) * k, py = p0.y + (p1.y - p0.y) * k;
      c.globalAlpha = this.fadeA(); buddy(c, px, py, s * 0.34, "#f2f2f2"); dot(c, px, py - s * 0.38, s * 0.1, "#ff4d6d"); c.globalAlpha = 1;
      this.ghost(px + s, py - s * 0.2, now);
    }
  }), "garden");

  /* 23. Surfista de vías */
  regD("vias", "Surfista de vías", "Deslizá a los costados para cambiar de vía. Tocá para saltar las vallas. Los trenes no se saltan.", "#ffd23f", G("Vias", {
    ctl: "swipe",
    init: function () { this.ln = 1; this.lx = 1; this.py = this.H - this.pb - 110; this.air = 0; this.ob = []; this.nr = 0.8; this.sc2 = 0; },
    X: function (l) { return this.W * (0.22 + l * 0.28); },
    act: function (x) { this.acts++; if (x === 1) this.ln = Math.max(0, this.ln - 1); else if (x === this.W - 1) this.ln = Math.min(2, this.ln + 1); else if (this.air <= 0) { this.air = 0.62; sfx(420, 0.07, "triangle", 0.05, 1.4); } },
    step: function (dt) {
      var i, v = 300 + Math.min(this.t, 120) * 2.2; this.sc2 += v * dt; this.air -= dt; this.lx += (this.ln - this.lx) * Math.min(1, dt * 14);
      this.nr -= dt; if (this.nr <= 0) { this.nr = Math.max(0.55, 1.1 - this.t * 0.004) * rnd(0.8, 1.2); var free = ri(0, 3), used = 0;
        for (var l = 0; l < 3; l++) { if (l === free) { if (Math.random() < 0.5) this.ob.push({ l: l, y: -40, h: 24, gm: 1 }); continue; } var blocked = this.ob.some(function (o) { return o.tr && o.y < 40; }); var q = Math.random(); if (q < 0.4 && used < 1 && !blocked) { this.ob.push({ l: l, y: -260, h: 240, tr: 1, col: pickOf(["#ff4d6d", "#3ddc84", "#c77dff"]) }); used++; } else if (q < 0.75) this.ob.push({ l: l, y: -30, h: 22, bar: 1 }); } }
      var lane = Math.round(this.lx);
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i]; o.y += v * dt; if (o.l !== lane || o.done) { if (o.y > this.H) o.gone = 1; continue; } var ov = o.y + o.h > this.py - 20 && o.y < this.py + 20;
        if (ov) { if (o.gm) { o.done = 1; o.gone = 1; this.add(1); } else if (o.tr || (o.bar && this.air <= 0)) { o.done = 1; this.hurt(); } else if (o.bar && !o.sc) { o.sc = 1; this.add(1); } }
        if (o.y > this.H) o.gone = 1; }
      k1fil(this.ob, function (o) { return o.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, l, W = this.W;
      c.fillStyle = "#6b5a48"; c.fillRect(0, this.pt, W, this.H);
      for (l = 0; l < 3; l++) { var x = this.X(l); c.fillStyle = "#8a6a4a"; for (var y = (this.sc2 % 30) - 30; y < this.H; y += 30) c.fillRect(x - 34, y, 68, 8); c.fillStyle = "#c8c3b6"; c.fillRect(x - 24, this.pt, 5, this.H); c.fillRect(x + 19, this.pt, 5, this.H); }
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i], ox = this.X(o.l); if (o.tr) { fillR(c, ox - 36, o.y, 72, o.h, 10, o.col); c.fillStyle = "#2b2b33"; c.fillRect(ox - 26, o.y + o.h - 46, 52, 22); for (var w = o.y + 16; w < o.y + o.h - 60; w += 34) { c.fillStyle = "#fff3b0"; c.fillRect(ox - 26, w, 18, 16); c.fillRect(ox + 8, w, 18, 16); } dot(c, ox - 22, o.y + o.h - 12, 5, "#ffd23f"); dot(c, ox + 22, o.y + o.h - 12, 5, "#ffd23f"); } else if (o.bar) { for (var k = 0; k < 4; k++) { c.fillStyle = k % 2 ? "#f2f2f2" : "#ff4d6d"; c.fillRect(ox - 34 + k * 17, o.y, 17, 12); } c.fillStyle = "#55555f"; c.fillRect(ox - 32, o.y + 12, 4, 10); c.fillRect(ox + 28, o.y + 12, 4, 10); } else if (o.gm && !o.done) gem(c, ox, o.y + 12, 10, "#ffd23f"); }
      var px = W * (0.22 + this.lx * 0.28), lift = this.air > 0 ? Math.sin((1 - this.air / 0.62) * PI) : 0, sz = 1 + lift * 0.35;
      k1ell(c, px, this.py + 18, 18, 6, "rgba(0,0,0,0.3)");
      c.globalAlpha = this.fadeA(); fillR(c, px - 13 * sz, this.py - 6 * sz - lift * 20, 26 * sz, 26 * sz, 8, "#ff9f1c"); buddy(c, px, this.py - 16 * sz - lift * 20, 13 * sz, "#f2b48a"); fillR(c, px - 14 * sz, this.py - 30 * sz - lift * 20, 28 * sz, 8, 3, "#ff4d6d"); c.globalAlpha = 1;
      this.ghost(px + 40, this.py - 70, now);
    }
  }), "city");

  /* 24. Templo */
  regD("templo", "Templo", "Deslizá hacia el lado de la curva justo cuando llegás. Tocá para saltar las raíces.", "#3ddc84", G("Templo", {
    ctl: "swipe",
    init: function () { this.ry = this.H - this.pb - 170; this.pw = 120; this.s = 0; this.ev = []; this.nd = 500; this.air = 0; this.lean = 0; },
    act: function (x) {
      this.acts++;
      if (x === 1 || x === this.W - 1) { var d = x === 1 ? -1 : 1, i; this.lean = d * 0.3; for (i = 0; i < this.ev.length; i++) { var e = this.ev[i]; if (e.turn && !e.done) { var ey = this.ry - (e.wy - this.s); if (Math.abs(ey - this.ry) < 60) { e.done = 1; if (e.dir === d) { this.good(1, this.W / 2, this.ry, true); this.turn(); } else { this.hurt(); this.turn(); } return; } } } return; }
      if (this.air <= 0) { this.air = 0.6; sfx(420, 0.07, "triangle", 0.05, 1.4); }
    },
    turn: function () { var s = this.s; this.ev = this.ev.filter(function (e) { return e.wy - s < -200; }); this.nd = this.s + rnd(380, 520); },
    step: function (dt) {
      var i, v = 260 + Math.min(this.t, 120) * 1.8; this.s += v * dt; this.air -= dt; this.lean *= (1 - dt * 6);
      if (this.nd < this.s + this.H) { var last = this.ev.length ? this.ev[this.ev.length - 1] : null; if (!(last && last.turn)) { if (Math.random() < 0.45) this.ev.push({ wy: this.nd, turn: 1, dir: pickOf([-1, 1]) }); else this.ev.push({ wy: this.nd, root: 1 }); } this.nd += rnd(260, 380); }
      for (i = 0; i < this.ev.length; i++) { var e = this.ev[i], ey = this.ry - (e.wy - this.s);
        if (e.root && !e.done && Math.abs(ey - this.ry) < 16) { e.done = 1; if (this.air <= 0) this.hurt(); else this.add(1); }
        if (e.turn && !e.done && ey > this.ry + 60) { e.done = 1; this.hurt(); this.turn(); return; } }
    },
    draw: function (now) {
      var c = this.ctx, i, W = this.W, cx = W / 2, pw = this.pw, turnE = null;
      for (i = 0; i < this.ev.length; i++) if (this.ev[i].turn && !this.ev[i].done) { turnE = this.ev[i]; break; }
      var topY = turnE ? this.ry - (turnE.wy - this.s) - pw / 2 : this.pt;
      c.fillStyle = "#1f6b3a"; c.fillRect(0, this.pt, W, this.H);
      for (i = 0; i < 10; i++) { var ty = ((i * 120 + this.s) % 1200) - 60; tree(c, 40, ty, 40); tree(c, W - 40, ty + 60, 40); }
      c.fillStyle = "#9a8f80"; c.fillRect(cx - pw / 2, Math.max(this.pt, topY), pw, this.H - Math.max(this.pt, topY));
      c.fillStyle = "#7d7366"; for (var y = (this.s % 40) - 40; y < this.H; y += 40) if (y > topY) c.fillRect(cx - pw / 2, y, pw, 3);
      if (turnE) { c.fillStyle = "#9a8f80"; var bx = turnE.dir > 0 ? cx - pw / 2 : 0; c.fillRect(bx, topY, turnE.dir > 0 ? W - bx : cx + pw / 2, pw); c.fillStyle = "#7d7366"; for (var x = 0; x < W; x += 40) if ((turnE.dir > 0 && x > cx - pw / 2) || (turnE.dir < 0 && x < cx + pw / 2)) c.fillRect(x, topY, 3, pw); poly(c, [cx + turnE.dir * 30, topY + pw / 2 - 16, cx + turnE.dir * 52, topY + pw / 2, cx + turnE.dir * 30, topY + pw / 2 + 16], "rgba(255,255,255,0.5)"); }
      for (i = 0; i < this.ev.length; i++) { var e = this.ev[i]; if (!e.root) continue; var ey = this.ry - (e.wy - this.s); if (ey < topY) continue; c.strokeStyle = "#6b4423"; c.lineWidth = 9; c.lineCap = "round"; c.beginPath(); c.moveTo(cx - pw / 2 + 4, ey); c.quadraticCurveTo(cx, ey - 14, cx + pw / 2 - 4, ey + 2); c.stroke(); c.lineCap = "butt"; }
      var lift = this.air > 0 ? Math.sin((1 - this.air / 0.6) * PI) : 0;
      c.globalAlpha = this.fadeA(); c.save(); c.translate(cx, this.ry); c.rotate(this.lean); var ph = Math.sin(now / 70) * 8; c.strokeStyle = "#2b2b33"; c.lineWidth = 6; c.lineCap = "round"; c.beginPath(); c.moveTo(-6, 0); c.lineTo(-6, 14 + ph); c.moveTo(6, 0); c.lineTo(6, 14 - ph); c.stroke(); c.lineCap = "butt"; var sz = 1 + lift * 0.3; fillR(c, -12 * sz, -20 * sz, 24 * sz, 24 * sz, 8, "#c98a4a"); buddy(c, 0, -26 * sz, 12 * sz, "#f2b48a"); c.restore(); c.globalAlpha = 1;
      this.ghost(cx + 60, this.ry - 60, now);
    }
  }), "forest");
