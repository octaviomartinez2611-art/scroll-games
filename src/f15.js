
  /* ===== 100 copias de juegos conocidos (5/8) ===== */

  /* 49. Cubito */
  regD("cubito", "Cubito", "Tocá para saltar los pinchos. Cuando sos nave, mantené apretado para subir y soltá para bajar.", "#3ddc84", G("Cubito", {
    ctl: "hold",
    init: function () { this.gy = this.H - this.pb - 110; this.top = this.pt + 70; this.cx0 = this.W * 0.25; this.s = 0; this.y = this.gy; this.vy = 0; this.mode = 0; this.mt = 10; this.ob = []; this.nx = 400; this.rot = 0; this.on = true; },
    press: function () { this.acts++; if (this.mode === 0 && this.on) this.jump(); },
    jump: function () { this.vy = -620; this.on = false; sfx(500, 0.04, "square", 0.03, 1.4); },
    gen: function () { while (this.nx < this.s + this.W + 300) { if (this.mode === 0) { var q = Math.random(); if (q < 0.55) { var n = ri(1, 3); for (var k = 0; k < n; k++) this.ob.push({ x: this.nx + k * 30, t: "sp" }); this.nx += n * 30; } else { var w = ri(2, 4) * 40, h = pickOf([40, 70]); this.ob.push({ x: this.nx, w: w, h: h, t: "bl" }); if (Math.random() < 0.5) this.ob.push({ x: this.nx + w + 50, t: "sp" }); this.nx += w + 50; } this.nx += rnd(160, 260); } else { var g = rnd(this.top + 90, this.gy - 90); this.ob.push({ x: this.nx, gy2: g, gh: 150 - Math.min(this.t, 100) * 0.3, t: "col" }); this.nx += 170; } } },
    step: function (dt) {
      var i, v = 290 + Math.min(this.t, 120) * 1.3; this.s += v * dt;
      this.mt -= dt; if (this.mt <= 0) { this.mode = 1 - this.mode; this.mt = this.mode ? 7 : 11; var s0 = this.s + this.W * 0.75; k1fil(this.ob, function (o) { return o.x > s0; }); this.nx = this.s + this.W * 0.75 + 200; this.ob.push({ x: this.s + this.W * 0.75 + 40, t: "pt" }); }
      this.gen();
      if (this.mode === 0) { this.vy += 2400 * dt; this.y += this.vy * dt; if (!this.on) this.rot += dt * 7; }
      else { this.vy += (this.holding ? -1800 : 1500) * dt; this.vy = clamp(this.vy, -420, 420); this.y += this.vy * dt; this.rot = this.vy * 0.0015; if (this.y < this.top + 14) { this.y = this.top + 14; this.vy = 0; } }
      var fl = this.gy; this.on = false;
      var px = this.s + this.cx0, hit = false;
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i];
        if (o.t === "bl" && px + 14 > o.x && px - 14 < o.x + o.w) { var tp = this.gy - o.h; if (this.y - this.vy * dt <= tp + 4) fl = Math.min(fl, tp); else if (this.y > tp + 6) hit = true; }
        if (o.t === "sp" && Math.abs(px - o.x - 15) < 18 && this.y > this.gy - 24) hit = true;
        if (o.t === "col" && Math.abs(px - o.x) < 26 && (this.y - 12 < o.gy2 - o.gh / 2 || this.y + 12 > o.gy2 + o.gh / 2)) hit = true;
        if (!o.sc && o.x + (o.w || 30) < px - 20 && o.t !== "pt") { o.sc = 1; if (!o.hitd) this.add(1); } }
      if (this.y >= fl) { this.y = fl; this.vy = 0; this.on = true; this.rot = Math.round(this.rot / (PI / 2)) * (PI / 2); if (this.mode === 0 && this.holding) this.jump(); }
      if (hit) { this.hurt(); var s1 = this.s + this.cx0 + 260; for (i = 0; i < this.ob.length; i++) if (this.ob[i].x < s1) this.ob[i].hitd = 1; k1fil(this.ob, function (o) { return o.x < s1 && o.x > s1 - 600; }); this.y = this.mode ? (this.top + this.gy) / 2 : this.gy; this.vy = 0; }
      var s2 = this.s; k1fil(this.ob, function (o) { return o.x + (o.w || 30) < s2 - 50; });
    },
    draw: function (now) {
      var c = this.ctx, i, s = this.s, gy = this.gy, W = this.W;
      c.fillStyle = "#1f8a4c"; c.fillRect(0, gy, W, this.H - gy); c.fillStyle = "#3ddc84"; c.fillRect(0, gy, W, 4);
      if (this.mode) { c.fillStyle = "#1f8a4c"; c.fillRect(0, this.pt, W, this.top - this.pt); }
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i], x = o.x - s;
        if (o.t === "sp") poly(c, [x, gy, x + 15, gy - 28, x + 30, gy], "#f2f2f2");
        else if (o.t === "bl") { fillR(c, x, gy - o.h, o.w, o.h, 3, "#2b2b33"); c.strokeStyle = "#3ddc84"; c.lineWidth = 2; c.strokeRect(x + 2, gy - o.h + 2, o.w - 4, o.h - 4); }
        else if (o.t === "col") { c.fillStyle = "#2b2b33"; c.fillRect(x - 24, this.top, 48, o.gy2 - o.gh / 2 - this.top); c.fillRect(x - 24, o.gy2 + o.gh / 2, 48, gy - o.gy2 - o.gh / 2); c.fillStyle = "#3ddc84"; c.fillRect(x - 24, o.gy2 - o.gh / 2 - 4, 48, 4); c.fillRect(x - 24, o.gy2 + o.gh / 2, 48, 4); }
        else if (o.t === "pt") { k1ell(c, x, (this.top + gy) / 2, 18, (gy - this.top) / 2 - 10, "rgba(255,95,210,0.35)"); c.strokeStyle = "#ff5fd2"; c.lineWidth = 4; c.beginPath(); c.ellipse(x, (this.top + gy) / 2, 18, (gy - this.top) / 2 - 10, 0, 0, TAU); c.stroke(); } }
      c.globalAlpha = this.fadeA(); c.save(); c.translate(this.cx0, this.y - 14); c.rotate(this.rot);
      if (this.mode === 0) { fillR(c, -14, -14, 28, 28, 3, "#ffd23f"); c.fillStyle = "#2b2b33"; c.fillRect(-8, -6, 5, 5); c.fillRect(3, -6, 5, 5); c.fillRect(-7, 4, 14, 3); }
      else { poly(c, [-18, 8, 20, 4, 6, -10, -14, -8], "#ff5fd2"); fillR(c, -8, -14, 14, 10, 3, "#ffd23f"); }
      c.restore(); c.globalAlpha = 1;
      this.ghostHold(W * 0.7, this.cy, now);
    }
  }), "arcade");

  /* 50. Hélice */
  regD("helice", "Hélice", "Tocá para cambiar de lado. Pasá por el hueco de cada viga sin tocar los martillos.", "#ffd23f", G("Helice", {
    init: function () { this.x = this.W / 2; this.vx = 0; this.dir = 1; this.py = this.H - this.pb - 170; this.s = 0; this.gs = []; this.ny = this.py - 240; },
    act: function () { this.dir = -this.dir; this.acts++; sfx(420, 0.04, "triangle", 0.04, 1.3); },
    step: function (dt) {
      var i, v = 120 + Math.min(this.t, 120) * 0.9; this.s += v * dt;
      this.vx += this.dir * 900 * dt; this.vx = clamp(this.vx, -250, 250); this.x += this.vx * dt;
      if (this.x < 14 || this.x > this.W - 14) { this.hurt(); this.x = clamp(this.x, 30, this.W - 30); this.vx = 0; }
      while (this.ny + this.s > this.pt - 60) { this.gs.push({ wy: this.ny, gx: rnd(90, this.W - 90), gw: 130 }); this.ny -= 230; }
      for (i = 0; i < this.gs.length; i++) { var g = this.gs[i], y = g.wy + this.s, a = Math.sin(this.t * 3 + i) * 0.8;
        if (!g.done && Math.abs(y - this.py) < 12 && (this.x < g.gx - g.gw / 2 + 12 || this.x > g.gx + g.gw / 2 - 12)) { g.done = 1; this.hurt(); }
        for (var k = -1; k <= 1; k += 2) { var hx = g.gx + k * g.gw / 2 + Math.sin(a) * 50, hy = y + Math.cos(a) * 50; if (!g.done && Math.hypot(hx - this.x, hy - this.py) < 26) { g.done = 1; this.hurt(); } }
        if (!g.done && y > this.py + 14) { g.done = 1; this.add(1); } }
      var s = this.s, H = this.H; k1fil(this.gs, function (g) { return g.wy + s > H + 60; });
    },
    draw: function (now) {
      var c = this.ctx, i, W = this.W;
      for (i = 0; i < this.gs.length; i++) { var g = this.gs[i], y = g.wy + this.s, a = Math.sin(this.t * 3 + i) * 0.8;
        fillR(c, 0, y - 8, g.gx - g.gw / 2, 16, 3, "#ff4d6d"); fillR(c, g.gx + g.gw / 2, y - 8, W - g.gx - g.gw / 2, 16, 3, "#ff4d6d"); c.fillStyle = "#a3203c"; for (var x = 6; x < W; x += 24) if (x < g.gx - g.gw / 2 || x > g.gx + g.gw / 2) c.fillRect(x, y - 3, 12, 6);
        for (var k = -1; k <= 1; k += 2) { var px = g.gx + k * g.gw / 2, hx = px + Math.sin(a) * 50, hy = y + Math.cos(a) * 50; k1ln(c, px, y, hx, hy, 3, "#9aa1ab"); fillR(c, hx - 16, hy - 10, 32, 20, 4, "#55555f"); } }
      var px2 = this.x, py = this.py, sp = Math.sin(now / 30) * 18; c.globalAlpha = this.fadeA(); k1ln(c, px2 - sp, py - 30, px2 + sp, py - 30, 4, "#d9dde3"); c.fillStyle = "#9aa1ab"; c.fillRect(px2 - 2, py - 30, 4, 12); buddy(c, px2, py - 4, 14, "#ffd23f", this.dir); fillR(c, px2 - 15, py - 22, 30, 7, 3, "#ff4d6d"); c.globalAlpha = 1;
      this.ghost(W * 0.6, py + 60, now);
    }
  }), "sky");

  /* 51. Plataformas que suben */
  regD("plataformas", "Plataformas que suben", "Arrastrá la bola a los costados para caer en las plataformas. No toques los pinchos de arriba ni las plataformas rojas.", "#ff9f1c", G("Plataformas", {
    ctl: "drag",
    init: function () { this.x = this.W / 2; this.tx = this.x; this.y = this.cy; this.vy = 0; this.r = 12; this.pl = []; this.np = 0; this.on = null; var y = this.cy + 30; while (y < this.H) { this.pl.push(this.plat(y, y === this.cy + 30 ? this.W / 2 : null)); y += 90; } },
    plat: function (y, x) { var bad = x == null && this.t > 4 && Math.random() < 0.18; return { x: x != null ? x : rnd(50, this.W - 50), y: y, w: rnd(70, 110), bad: bad, gem: !bad && Math.random() < 0.35 }; },
    drag: function (x) { this.tx = x; },
    step: function (dt) {
      var i, v = 70 + Math.min(this.t, 120) * 0.6; this.x += (this.tx - this.x) * Math.min(1, dt * 10); this.x = clamp(this.x, this.r, this.W - this.r);
      for (i = 0; i < this.pl.length; i++) this.pl[i].y -= v * dt;
      var last = this.pl[this.pl.length - 1]; if (!last || last.y < this.H - 90) this.pl.push(this.plat(this.H + 10));
      var pt = this.pt; k1fil(this.pl, function (p) { return p.y < pt - 20; });
      this.vy += 900 * dt; var ny = this.y + this.vy * dt, land = null;
      for (i = 0; i < this.pl.length; i++) { var p = this.pl[i]; if (Math.abs(this.x - p.x) < p.w / 2 + 4 && this.y + this.r <= p.y + 6 && ny + this.r >= p.y - v * dt - 1) { land = p; break; } }
      if (land) { this.y = land.y - this.r; this.vy = 0; if (land !== this.on) { this.on = land; if (land.bad) { this.hurt(); land.bad = false; } else this.add(1); if (land.gem) { land.gem = false; this.add(1); } } } else { this.y = ny; this.on = null; }
      if (this.y - this.r < this.pt + 26) { this.hurt(); this.y = this.cy; this.vy = 0; }
      if (this.y > this.H - this.pb + 20) { this.hurt(); this.y = this.pt + 80; this.vy = 0; }
    },
    draw: function (now) {
      var c = this.ctx, i, W = this.W;
      for (i = 0; i < W; i += 20) poly(c, [i, this.pt + 8, i + 10, this.pt + 26, i + 20, this.pt + 8], "#d9dde3"); c.fillStyle = "#9aa1ab"; c.fillRect(0, this.pt, W, 8);
      for (i = 0; i < this.pl.length; i++) { var p = this.pl[i]; fillR(c, p.x - p.w / 2, p.y, p.w, 12, 5, p.bad ? "#ff4d6d" : "#3ddc84"); if (p.bad) for (var k = p.x - p.w / 2 + 4; k < p.x + p.w / 2 - 6; k += 12) poly(c, [k, p.y, k + 6, p.y - 9, k + 12, p.y], "#ff8fa3"); if (p.gem) gem(c, p.x, p.y - 14, 8, "#ffd23f"); }
      c.globalAlpha = this.fadeA(); dot(c, this.x, this.y, this.r, "#ff9f1c"); dot(c, this.x - 4, this.y - 4, 4, "#ffd9a8"); c.globalAlpha = 1;
      this.ghostDrag(this.H - this.pb - 60, now);
    }
  }), "cave");

  /* 52. Pisos que se caen */
  regD("pisos", "Pisos que se caen", "Tocá donde querés caminar. Cada baldosa que pisás se cae al ratito. No te quedes sin piso.", "#ff5fd2", G("Pisos", {
    init: function () { this.lay(); },
    lay: function () { this.r = 24; this.tl = []; var dx = this.r * 1.75, dy = this.r * 1.52, x, y, row = 0; for (y = this.pt + 50; y < this.H - this.pb - 30; y += dy, row++) for (x = 30 + (row % 2) * dx / 2; x < this.W - 20; x += dx) this.tl.push({ x: x, y: y, st: 0, t: 0 }); this.px = this.W / 2; this.py = this.cy; this.tx = this.px; this.ty = this.py; this.stars = []; this.ns = 1; this.sv = 0; this.fall = 0; },
    act: function (x, y) { this.tx = x; this.ty = y; this.acts++; },
    under: function () { var b = null, bd = 1e9; for (var i = 0; i < this.tl.length; i++) { var t = this.tl[i], d = Math.hypot(t.x - this.px, t.y - this.py); if (d < bd) { bd = d; b = t; } } return bd < this.r * 1.05 ? b : null; },
    step: function (dt) {
      var i; if (this.fall > 0) { this.fall -= dt; if (this.fall <= 0) this.lay(); return; }
      var dx = this.tx - this.px, dy = this.ty - this.py, d = Math.hypot(dx, dy); if (d > 3) { this.px += dx / d * Math.min(d, 140 * dt); this.py += dy / d * Math.min(d, 140 * dt); }
      for (i = 0; i < this.tl.length; i++) { var t = this.tl[i]; if (t.st === 1) { t.t -= dt; if (t.t <= 0) t.st = 2; } }
      var u = this.under(); if (!u || u.st === 2) { this.hurt(); this.fall = 0.7; return; } if (u.st === 0) { u.st = 1; u.t = Math.max(0.35, 0.7 - this.t * 0.004); }
      this.sv += dt; if (this.sv > 2) { this.sv = 0; this.add(1); }
      this.ns -= dt; if (this.ns <= 0) { this.ns = rnd(1, 2); var ok = this.tl.filter(function (t) { return t.st === 0; }); if (ok.length) this.stars.push(pickOf(ok)); }
      for (i = 0; i < this.stars.length; i++) { var s = this.stars[i]; if (s.st === 2) s.gone = 1; else if (Math.hypot(s.x - this.px, s.y - this.py) < 18) { s.gone = 1; this.good(1, s.x, s.y, false); } }
      k1fil(this.stars, function (s) { return s.gone; });
    },
    hex: function (c, x, y, r, col) { var p = []; for (var k = 0; k < 6; k++) { var a = PI / 6 + k * TAU / 6; p.push(x + Math.cos(a) * r, y + Math.sin(a) * r); } poly(c, p, col); },
    draw: function (now) {
      var c = this.ctx, i;
      for (i = 0; i < this.tl.length; i++) { var t = this.tl[i]; if (t.st === 2) continue; var sh = t.st === 1 ? Math.sin(now / 25 + i) * 1.5 : 0; this.hex(c, t.x + sh, t.y, this.r - 2, t.st === 1 ? "#ff8fd0" : "#ff5fd2"); this.hex(c, t.x + sh, t.y - 3, this.r - 6, t.st === 1 ? "#ffb3e2" : "#ff87dd"); }
      for (i = 0; i < this.stars.length; i++) star(c, this.stars[i].x, this.stars[i].y - 4, 10, "#ffd23f");
      var fy = this.fall > 0 ? (0.7 - this.fall) * 200 : 0; c.globalAlpha = this.fall > 0 ? 0.5 : this.fadeA(); fillR(c, this.px - 9, this.py - 22 + fy, 18, 20, 7, "#ffd23f"); buddy(c, this.px, this.py - 28 + fy, 10, "#ffd23f"); c.globalAlpha = 1;
      this.ghost(this.px + 70, this.py + 30, now);
    }
  }), "sky");

  /* 53. Balero */
  regD("balero", "Balero", "Tocá para tirar la bocha. Tocá otra vez cuando baja con el agujero mirando para abajo.", "#c98a4a", G("Balero", {
    init: function () { this.sx = this.W / 2; this.sy = this.H - this.pb - 150; this.ph = 0; this.by = this.sy + 60; this.bx = this.sx + 20; this.vy = 0; this.ang = 0; this.w = 0; this.lvl = 0; this.wait = 0; },
    act: function () {
      this.acts++;
      if (this.ph === 0 && this.wait <= 0) { this.ph = 1; this.by = this.sy + 20; this.bx = this.sx; this.vy = -rnd(620, 700); this.w = pickOf([-1, 1]) * rnd(5, 8 + this.lvl * 0.5); this.ang = rnd(0, TAU); sfx(300, 0.06, "sine", 0.05, 1.5); return; }
      if (this.ph === 1) { var near = this.vy > 0 && this.by > this.sy - 120 && this.by < this.sy - 16; if (!near) return; var e = Math.abs(k3adiff(this.ang, PI / 2)); if (e < 0.45) { this.good(e < 0.16 ? 2 : 1, this.sx, this.sy - 40, e < 0.16); this.ph = 2; this.wait = 0.5; this.lvl++; sfx(700, 0.08, "triangle", 0.05, 0.8); } else { this.ph = 3; this.vy = 120; this.hurt(); this.wait = 0.8; } }
    },
    step: function (dt) {
      this.wait -= dt;
      if (this.ph === 1) { this.vy += 1250 * dt; this.by += this.vy * dt; this.ang += this.w * dt; if (this.by > this.sy - 10) { this.ph = 3; this.hurt(); this.wait = 0.8; } }
      else if (this.ph === 2) { this.by += (this.sy - 22 - this.by) * Math.min(1, dt * 10); this.ang = PI / 2; if (this.wait <= 0) { this.ph = 0; this.by = this.sy + 60; this.bx = this.sx + 20; } }
      else if (this.ph === 3) { this.vy += 900 * dt; this.by = Math.min(this.sy + 60, this.by + this.vy * dt); if (this.wait <= 0) { this.ph = 0; this.by = this.sy + 60; } }
    },
    draw: function (now) {
      var c = this.ctx, sx = this.sx, sy = this.sy, R = 26;
      c.strokeStyle = "#f2efe6"; c.lineWidth = 2; c.beginPath(); c.moveTo(sx + 6, sy + 30); c.quadraticCurveTo((sx + this.bx) / 2 + 20, Math.max(sy + 30, this.by) + 20, this.bx, this.by); c.stroke();
      fillR(c, sx - 7, sy - 14, 14, 140, 6, "#c98a4a"); fillR(c, sx - 16, sy + 20, 32, 14, 6, "#8a5a2b"); c.fillStyle = "#e0b070"; c.fillRect(sx - 3, sy - 14, 6, 6);
      c.globalAlpha = this.fadeA(); dot(c, this.bx, this.by, R, "#ff4d6d"); c.fillStyle = "#a3203c"; c.beginPath(); c.arc(this.bx, this.by, R, 0, TAU); c.arc(this.bx, this.by, R * 0.72, 0, TAU, true); c.fill();
      var hx = this.bx + Math.cos(this.ang) * R * 0.7, hy = this.by + Math.sin(this.ang) * R * 0.7; dot(c, hx, hy, 7, "#2b2b33"); c.globalAlpha = 1;
      if (this.ph === 1 && this.vy > 0) { c.fillStyle = "rgba(255,210,63,0.2)"; c.fillRect(sx - 40, sy - 120, 80, 104); }
      this.ghost(sx + 70, sy - 60, now);
    }
  }), "school");

  /* 54. Skate */
  regD("skate", "Skate", "Tocá para saltar los obstáculos. En el aire, tocá de nuevo para hacer una prueba, pero terminala antes de caer.", "#ff9f1c", G("Skate", {
    init: function () { this.gy = this.H - this.pb - 100; this.x = this.W * 0.28; this.h = 0; this.vy = 0; this.tr = 0; this.trs = 0; this.ob = []; this.nx = 1; this.s = 0; },
    act: function () { this.acts++; if (this.h <= 0) { this.vy = 560; this.h = 0.01; this.trs = 0; sfx(380, 0.05, "triangle", 0.05, 1.3); } else if (this.tr <= 0) { this.tr = 0.36; sfx(600, 0.04, "square", 0.03, 1.5); } },
    step: function (dt) {
      var i, v = 260 + Math.min(this.t, 120) * 1.6; this.s += v * dt;
      if (this.tr > 0) { this.tr -= dt; if (this.tr <= 0) this.trs++; }
      if (this.h > 0) { this.h += this.vy * dt; this.vy -= 1500 * dt; if (this.h <= 0) { this.h = 0; this.vy = 0; if (this.tr > 0) { this.tr = 0; this.hurt(); } else if (this.trs > 0) { this.good(this.trs, this.x, this.gy - 60, this.trs > 1); } this.trs = 0; } }
      this.nx -= dt; if (this.nx <= 0) { this.nx = rnd(0.9, 1.7) * Math.max(0.6, 1 - this.t * 0.004); var q = Math.random(); this.ob.push(q < 0.4 ? { x: this.W + 30, w: 20, h: 28, k: "cone" } : q < 0.75 ? { x: this.W + 30, w: 70, h: 30, k: "bench" } : { x: this.W + 30, w: 40, h: 0, k: "hole" }); }
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i]; o.x -= v * dt; if (!o.done && o.x < this.x + 16 && o.x + o.w > this.x - 16) { if ((o.k === "hole" && this.h <= 0) || (o.k !== "hole" && this.h < o.h - 4)) { o.done = 1; this.hurt(); } } if (!o.done && o.x + o.w < this.x - 16) { o.done = 1; this.add(1); } if (o.x < -100) o.gone = 1; }
      k1fil(this.ob, function (o) { return o.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, gy = this.gy;
      c.fillStyle = "#9aa1ab"; c.fillRect(0, gy, this.W, this.H - gy); c.fillStyle = "#7d8590"; for (i = 0; i < 10; i++) c.fillRect(((i * 70 - this.s) % this.W + this.W) % this.W, gy + 4, 3, 60);
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i]; if (o.k === "cone") { poly(c, [o.x, gy, o.x + o.w / 2, gy - o.h, o.x + o.w, gy], "#ff9f1c"); c.fillStyle = "#f2f2f2"; c.fillRect(o.x + 5, gy - 14, o.w - 10, 4); } else if (o.k === "bench") { fillR(c, o.x, gy - o.h, o.w, 8, 3, "#c98a4a"); c.fillStyle = "#55555f"; c.fillRect(o.x + 6, gy - o.h + 8, 5, o.h - 8); c.fillRect(o.x + o.w - 11, gy - o.h + 8, 5, o.h - 8); } else { c.fillStyle = "#2b2b33"; c.fillRect(o.x, gy, o.w, 30); } }
      var x = this.x, y = gy - this.h, spin = this.tr > 0 ? (1 - this.tr / 0.36) * TAU : 0; c.globalAlpha = this.fadeA();
      c.save(); c.translate(x, y - 6); c.rotate(spin); fillR(c, -24, -3, 48, 6, 3, "#ff4d6d"); dot(c, -16, 5, 4, "#f2f2f2"); dot(c, 16, 5, 4, "#f2f2f2"); c.restore();
      c.strokeStyle = "#2b2b33"; c.lineWidth = 5; c.beginPath(); c.moveTo(x - 6, y - 10); c.lineTo(x - 2, y - 30); c.moveTo(x + 8, y - 10); c.lineTo(x + 2, y - 30); c.stroke(); fillR(c, x - 10, y - 54, 20, 26, 7, "#3ddc84"); buddy(c, x, y - 64, 11, "#f2b48a", 1); fillR(c, x - 12, y - 76, 24, 7, 3, "#ffd23f"); c.globalAlpha = 1;
      this.ghost(this.W * 0.6, this.cy, now);
    }
  }), "city");

  /* 55. Hipopótamos */
  regD("hipos", "Hipopótamos", "Tocá para que tu hipopótamo estire el cuello y se coma las bolitas que pasan adelante. Comé más que los otros.", "#c77dff", G("Hipos", {
    init: function () { this.ox = this.W / 2; this.oy = this.cy; this.R = Math.min(this.W, this.H - this.pt - this.pb) * 0.42; this.hp = []; var cols = ["#c77dff", "#ff9f1c", "#3ddc84", "#ffd23f"]; for (var k = 0; k < 4; k++) this.hp.push({ a: PI / 2 + k * PI / 2, col: cols[k], ch: 0, cd: 0, n: 0, ai: rnd(0.5, 1.2) }); this.round(); },
    round: function () { this.ms = []; for (var k = 0; k < 14; k++) { var a = rnd(0, TAU), sp = rnd(70, 120); this.ms.push({ x: this.ox + rnd(-40, 40), y: this.oy + rnd(-40, 40), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp }); } for (k = 0; k < 4; k++) this.hp[k].n = 0; this.wait = 0; },
    chomp: function (h) { if (h.cd > 0) return; h.ch = 0.25; h.cd = 0.4; var hx = this.ox + Math.cos(h.a) * this.R * 0.62, hy = this.oy + Math.sin(h.a) * this.R * 0.62; for (var i = 0; i < this.ms.length; i++) { var m = this.ms[i]; if (!m.gone && Math.hypot(m.x - hx, m.y - hy) < 48) { m.gone = 1; h.n++; if (h === this.hp[0]) this.add(1); } } },
    act: function () { this.acts++; this.chomp(this.hp[0]); sfx(200, 0.06, "square", 0.04, 0.6); },
    step: function (dt) {
      var i, k; if (this.wait > 0) { this.wait -= dt; if (this.wait <= 0) this.round(); return; }
      for (k = 0; k < 4; k++) { var h = this.hp[k]; h.ch -= dt; h.cd -= dt; if (k) { h.ai -= dt; if (h.ai <= 0) { h.ai = rnd(0.45, 1.1) * Math.max(0.6, 1 - this.t * 0.003); this.chomp(h); } } }
      for (i = 0; i < this.ms.length; i++) { var m = this.ms[i]; if (m.gone) continue; m.x += m.vx * dt; m.y += m.vy * dt; var dx = m.x - this.ox, dy = m.y - this.oy, d = Math.hypot(dx, dy); if (d > this.R - 10) { var nx = dx / d, ny = dy / d, vn = m.vx * nx + m.vy * ny; m.vx -= 2 * vn * nx; m.vy -= 2 * vn * ny; m.x = this.ox + nx * (this.R - 10); m.y = this.oy + ny * (this.R - 10); var a = Math.atan2(m.vy, m.vx) + rnd(-0.3, 0.3), s = Math.hypot(m.vx, m.vy); m.vx = Math.cos(a) * s; m.vy = Math.sin(a) * s; } }
      k1fil(this.ms, function (m) { return m.gone; });
      if (!this.ms.length) { var me = this.hp[0].n, mx = 0, mn = 99; for (k = 1; k < 4; k++) { mx = Math.max(mx, this.hp[k].n); mn = Math.min(mn, this.hp[k].n); } if (me > mx) this.good(3, this.ox, this.oy, true); else if (me < mn) this.hurt(); this.wait = 1; }
    },
    draw: function (now) {
      var c = this.ctx, i, k, R = this.R;
      dot(c, this.ox, this.oy, R + 10, "#f2f2f2"); dot(c, this.ox, this.oy, R, "#ffe1ef");
      for (i = 0; i < this.ms.length; i++) { dot(c, this.ms[i].x, this.ms[i].y, 8, "#f2f2f2"); dot(c, this.ms[i].x - 2, this.ms[i].y - 2, 3, "#fff"); }
      for (k = 0; k < 4; k++) { var h = this.hp[k], ext = h.ch > 0 ? 0.6 : 0.95, hx = this.ox + Math.cos(h.a) * R * ext, hy = this.oy + Math.sin(h.a) * R * ext, bx = this.ox + Math.cos(h.a) * (R + 46), by = this.oy + Math.sin(h.a) * (R + 46); c.globalAlpha = k === 0 ? this.fadeA() : 1; k1ln(c, bx, by, hx, hy, 34, h.col); dot(c, bx, by, 42, h.col); dot(c, hx, hy, 26, h.col); var mo = h.ch > 0 ? 14 : 4; dot(c, hx - Math.cos(h.a) * 12, hy - Math.sin(h.a) * 12, mo, "#2b2b33"); dot(c, hx + Math.cos(h.a + 1.4) * 12, hy + Math.sin(h.a + 1.4) * 12, 4, "#fff"); dot(c, hx + Math.cos(h.a - 1.4) * 12, hy + Math.sin(h.a - 1.4) * 12, 4, "#fff"); c.globalAlpha = 1; }
      for (k = 0; k < 4; k++) { var hh = this.hp[k]; for (i = 0; i < hh.n; i++) dot(c, 18 + k * ((this.W - 90) / 4) + (i % 7) * 9, this.pt + 6 + Math.floor(i / 7) * 9, 3.5, hh.col); }
      this.ghost(this.ox + 60, this.H - this.pb - 80, now);
    }
  }), "table");

  /* 56. Torre que tambalea */
  regD("jenga", "Torre que tambalea", "Mantené apretado para sacar el bloque. Si la torre se mueve mucho, soltá y esperá que se calme.", "#c98a4a", G("Jenga", {
    ctl: "hold",
    init: function () { this.n = 14; this.lvl = 0; this.pick(); this.w = 0; },
    pick: function () { this.row = ri(1, this.n - 3); this.side = pickOf([-1, 1]); this.pr = 0; this.rate = 0.55 + (1 - this.row / this.n) * 0.4 + this.lvl * 0.04; },
    press: function () { this.acts++; },
    step: function (dt) {
      if (this.fallT > 0) { this.fallT -= dt; if (this.fallT <= 0) { this.n = 14; this.w = 0; this.pick(); } return; }
      if (this.holding) { this.pr += 0.42 * dt; this.w += this.rate * dt; } else this.w = Math.max(0, this.w - 0.75 * dt);
      if (Math.random() < dt * 0.25) this.w += 0.12;
      if (this.w >= 1) { this.hurt(); this.fallT = 0.9; return; }
      if (this.pr >= 1) { this.good(this.w > 0.7 ? 2 : 1, this.W / 2, this.cy, this.w > 0.7); this.n = Math.min(20, this.n + 1); this.lvl++; this.pick(); }
    },
    draw: function (now) {
      var c = this.ctx, W = this.W, bh = 22, bw = 120, by = this.H - this.pb - 40, k, sway = Math.sin(now / 90) * this.w * 10, tilt = this.fallT > 0 ? (0.9 - this.fallT) * 1.6 : 0;
      c.fillStyle = "#8a6a4a"; c.fillRect(0, by, W, this.H - by);
      c.save(); c.translate(W / 2, by); c.rotate(tilt);
      for (k = 0; k < this.n; k++) { var y = -(k + 1) * bh, off = sway * k / this.n, out = k === this.row ? this.side * this.pr * bw * 1.1 : 0; if (k % 2 === 0) { fillR(c, -bw / 2 + off + out, y, bw, bh - 2, 3, k === this.row ? "#ffd23f" : "#e0b070"); c.fillStyle = "#c98a4a"; c.fillRect(-bw / 2 + off + out + 4, y + bh - 6, bw - 8, 3); } else { for (var j = -1; j <= 1; j++) { var o2 = k === this.row && j === 0 ? this.side * this.pr * bw * 1.1 : 0; fillR(c, j * bw / 3 - bw / 6 + off + 1 + o2, y, bw / 3 - 2, bh - 2, 3, k === this.row && j === 0 ? "#ffd23f" : "#d9a85e"); } } }
      c.restore();
      fillR(c, 16, this.pt + 2, W - 92, 8, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (W - 92) * clamp(this.w, 0, 1), 8, 4, this.w > 0.7 ? "#ff4d6d" : "#ffd23f");
      this.ghostHold(W * 0.78, this.cy, now);
    }
  }), "table");

  /* 57. Cinchada */
  regD("cinchada", "Cinchada", "Tocá cuando la rayita pasa por el centro verde para tirar fuerte de la soga. Traé el pañuelo a tu lado.", "#3ddc84", G("Cinchada", {
    init: function () { this.lvl = 0; this.round(); },
    round: function () { this.p = 0; this.k = 0; this.opp = 0.06 + this.lvl * 0.012; this.flash = 0; },
    act: function () { this.acts++; var e = Math.abs(Math.sin(this.k)); if (e < 0.18) { this.p += e < 0.07 ? 0.2 : 0.13; this.flash = 0.15; sfx(300, 0.05, "square", 0.05, 1.3); } else { this.p -= 0.04; sfx(120, 0.05, "sine", 0.04, 0.7); } },
    step: function (dt) {
      this.k += dt * (3.2 + this.lvl * 0.15); this.flash -= dt; this.p -= this.opp * dt * (1 + 0.5 * Math.sin(this.t * 1.7));
      if (this.p >= 1) { this.good(3, this.W / 2, this.cy, true); this.lvl++; this.round(); } else if (this.p <= -1) { this.hurt(); this.round(); }
    },
    draw: function (now) {
      var c = this.ctx, W = this.W, cy = this.cy, i, off = -this.p * W * 0.25;
      c.fillStyle = "#3ddc84"; c.fillRect(0, cy + 30, W, this.H - cy); c.fillStyle = "#ff4d6d"; c.fillRect(W / 2 - 2, cy + 30, 4, 80);
      k1ln(c, -20, cy + 6, W + 20, cy + 6, 6, "#c98a4a"); var fx = W / 2 + off; poly(c, [fx - 8, cy + 6, fx + 8, cy + 6, fx, cy + 34], "#ff4d6d");
      for (i = 0; i < 3; i++) { var lx = W / 2 + off + 60 + i * 44, rx = W / 2 + off - 60 - i * 44, lean = this.flash > 0 ? 10 : 4; fillR(c, lx - 9, cy - 6, 18, 34, 6, "#3ddc84"); buddy(c, lx + lean, cy - 14, 11, "#f2b48a", 1); fillR(c, rx - 9, cy - 6, 18, 34, 6, "#c77dff"); buddy(c, rx - 4, cy - 14, 11, "#f2b48a", -1); }
      var bw = W - 120, bx = 30, byy = this.H - this.pb - 120; fillR(c, bx, byy, bw, 30, 15, "rgba(255,255,255,0.12)"); fillR(c, bx + bw / 2 - bw * 0.09, byy, bw * 0.18, 30, 8, "rgba(61,220,132,0.6)"); var mx = bx + bw / 2 + Math.cos(this.k) * bw / 2 * (Math.sin(this.k) >= 0 ? 1 : 1); c.fillStyle = "#f2f2f2"; c.fillRect(bx + bw / 2 + Math.cos(this.k + PI / 2) * (bw / 2 - 6) - 3, byy - 6, 6, 42);
      this.ghost(W / 2, byy + 70, now);
    }
  }), "farm");

  /* 58. Metegol */
  regD("metegol", "Metegol", "Arrastrá a los costados para mover tus jugadores verdes. Meté la pelota en el arco de arriba.", "#3ddc84", G("Metegol", {
    ctl: "drag",
    init: function () { this.x0 = 14; this.x1 = this.W - 14; this.y0 = this.pt + 20; this.y1 = this.H - this.pb - 20; this.gw = 110; this.mo = 0; this.to = 0; this.ao = 0; this.serve(); },
    serve: function () { this.b = { x: this.W / 2, y: (this.y0 + this.y1) / 2, vx: rnd(-80, 80), vy: pickOf([-1, 1]) * 140 }; },
    drag: function (x) { this.to = clamp((x - this.W / 2) / (this.W / 2), -1, 1); },
    rods: function () { var h = this.y1 - this.y0, W = this.W, mo = this.mo * W * 0.22, ao = this.ao * W * 0.22; return [{ y: this.y1 - h * 0.07, xs: [W / 2], o: mo * 0.5, me: 1 }, { y: this.y1 - h * 0.25, xs: [W * 0.32, W * 0.68], o: mo, me: 1 }, { y: this.y0 + h * 0.4, xs: [W * 0.22, W * 0.5, W * 0.78], o: mo, me: 1 }, { y: this.y0 + h * 0.07, xs: [W / 2], o: ao * 0.5 }, { y: this.y0 + h * 0.25, xs: [W * 0.32, W * 0.68], o: ao }, { y: this.y1 - h * 0.4, xs: [W * 0.22, W * 0.5, W * 0.78], o: ao }]; },
    step: function (dt) {
      var b = this.b, i, j; this.mo += (this.to - this.mo) * Math.min(1, dt * 12); var want = clamp((b.x - this.W / 2) / (this.W * 0.22), -1, 1); this.ao += clamp(want - this.ao, -dt * (1.6 + Math.min(this.t, 90) * 0.01), dt * (1.6 + Math.min(this.t, 90) * 0.01));
      b.x += b.vx * dt; b.y += b.vy * dt; b.vx *= (1 - 0.15 * dt); b.vy *= (1 - 0.15 * dt);
      if (b.x < this.x0 + 8) { b.x = this.x0 + 8; b.vx = Math.abs(b.vx); } if (b.x > this.x1 - 8) { b.x = this.x1 - 8; b.vx = -Math.abs(b.vx); }
      var inG = Math.abs(b.x - this.W / 2) < this.gw / 2;
      if (b.y < this.y0 + 8) { if (inG) { this.good(2, b.x, b.y, true); this.serve(); return; } b.y = this.y0 + 8; b.vy = Math.abs(b.vy); }
      if (b.y > this.y1 - 8) { if (inG) { this.hurt(); this.serve(); return; } b.y = this.y1 - 8; b.vy = -Math.abs(b.vy); }
      var R = this.rods(); for (i = 0; i < R.length; i++) for (j = 0; j < R[i].xs.length; j++) { var mx = R[i].xs[j] + R[i].o, my = R[i].y; if (Math.abs(b.x - mx) < 16 && Math.abs(b.y - my) < 14) { var s = R[i].me ? -1 : 1, sp = Math.max(260, Math.hypot(b.vx, b.vy)) * 1.05; b.vy = s * Math.min(560, sp); b.vx = (b.x - mx) * 9 + rnd(-30, 30); b.y = my + s * 15; sfx(260, 0.04, "square", 0.04, 1.2); } }
      if (Math.hypot(b.vx, b.vy) < 50) { b.vx += rnd(-40, 40); b.vy += rnd(-40, 40); }
    },
    draw: function (now) {
      var c = this.ctx, W = this.W, i, j, R = this.rods();
      fillR(c, this.x0 - 6, this.y0 - 6, this.x1 - this.x0 + 12, this.y1 - this.y0 + 12, 8, "#8a5a2b"); c.fillStyle = "#2f8f4e"; c.fillRect(this.x0, this.y0, this.x1 - this.x0, this.y1 - this.y0);
      c.strokeStyle = "rgba(255,255,255,0.5)"; c.lineWidth = 2; c.beginPath(); c.moveTo(this.x0, (this.y0 + this.y1) / 2); c.lineTo(this.x1, (this.y0 + this.y1) / 2); c.stroke(); c.beginPath(); c.arc(W / 2, (this.y0 + this.y1) / 2, 40, 0, TAU); c.stroke();
      c.fillStyle = "#f2f2f2"; c.fillRect(W / 2 - this.gw / 2, this.y0 - 6, this.gw, 6); c.fillRect(W / 2 - this.gw / 2, this.y1, this.gw, 6);
      for (i = 0; i < R.length; i++) { c.fillStyle = "#c0c4cc"; c.fillRect(0, R[i].y - 2, W, 4); for (j = 0; j < R[i].xs.length; j++) { var mx = R[i].xs[j] + R[i].o; fillR(c, mx - 9, R[i].y - 12, 18, 24, 6, R[i].me ? "#3ddc84" : "#ff4d6d"); dot(c, mx, R[i].y, 6, "#f2b48a"); } }
      soccer(c, this.b.x, this.b.y, 8);
      this.ghostDrag(this.y1 - 60, now);
    }
  }), "table");

  /* 59. Tenis */
  regD("tenis", "Tenis", "Arrastrá a los costados para ponerte donde viene la pelota. Le pegás solo. Según dónde te pega en la raqueta, sale para un lado.", "#ffd23f", G("Tenis", {
    ctl: "drag",
    init: function () { this.cl = this.W * 0.1; this.cr = this.W * 0.9; this.ct = this.pt + 60; this.cb = this.H - this.pb - 60; this.px = this.W / 2; this.tx = this.px; this.ax = this.W / 2; this.rally = 0; this.serve(1); },
    serve: function (toMe) { var y = toMe ? this.ct + 20 : this.cb - 20; this.b = { x: this.W / 2 + rnd(-40, 40), y: y, z: 40, vx: rnd(-60, 60), vy: toMe ? 330 : -330, vz: 200, bn: 0 }; this.rally = 0; },
    drag: function (x) { this.tx = x; },
    step: function (dt) {
      var b = this.b; this.px += clamp(this.tx - this.px, -420 * dt, 420 * dt); this.px = clamp(this.px, 20, this.W - 20);
      var aiT = b.vy < 0 ? b.x + (Math.random() < 0.02 ? rnd(-60, 60) : 0) : this.W / 2; this.ax += clamp(aiT - this.ax, -(180 + Math.min(this.t, 90)) * dt, (180 + Math.min(this.t, 90)) * dt);
      b.x += b.vx * dt; b.y += b.vy * dt; b.vz -= 700 * dt; b.z += b.vz * dt; if (b.z < 0) { b.z = 0; b.vz = Math.abs(b.vz) * 0.72; var midY = (this.ct + this.cb) / 2; if ((b.vy > 0 && b.y > midY) || (b.vy < 0 && b.y < midY)) b.bn++; }
      var sp = 330 + Math.min(this.rally, 12) * 14;
      if (b.vy > 0 && b.y > this.cb - 110 && b.y < this.cb + 12 && b.z < 90 && Math.abs(b.x - this.px) < 40) { var off = (b.x - this.px) / 40; b.vy = -sp; b.vx = off * 200 + (this.W / 2 - b.x) * 0.3; b.vz = 230; b.bn = 0; this.rally++; this.add(1); sfx(330, 0.05, "square", 0.04, 1.4); }
      if (b.vy < 0 && b.y < this.ct + 100 && b.y > this.ct - 12 && b.z < 90 && Math.abs(b.x - this.ax) < 30 + Math.max(0, 8 - this.rally)) { b.vy = sp; b.vx = (rnd(this.cl + 30, this.cr - 30) - b.x) * sp / (this.cb - this.ct); b.vz = 230; b.bn = 0; sfx(300, 0.05, "square", 0.04, 1.2); }
      if (b.y > this.cb + 40) { this.hurt(); this.serve(1); }
      else if (b.y < this.ct - 40) { if (b.x < this.cl - 10 || b.x > this.cr + 10) this.hurt(); else this.good(2, b.x, this.ct, true); this.serve(1); }
    },
    draw: function (now) {
      var c = this.ctx, W = this.W, b = this.b, my = (this.ct + this.cb) / 2;
      c.fillStyle = "#c8553d"; c.fillRect(this.cl - 14, this.ct - 30, this.cr - this.cl + 28, this.cb - this.ct + 60); c.strokeStyle = "#f2f2f2"; c.lineWidth = 3; c.strokeRect(this.cl, this.ct, this.cr - this.cl, this.cb - this.ct); c.beginPath(); c.moveTo(W / 2, this.ct + 60); c.lineTo(W / 2, this.cb - 60); c.moveTo(this.cl, this.ct + 60); c.lineTo(this.cr, this.ct + 60); c.moveTo(this.cl, this.cb - 60); c.lineTo(this.cr, this.cb - 60); c.stroke();
      c.fillStyle = "#2b2b33"; c.fillRect(this.cl - 18, my - 3, this.cr - this.cl + 36, 6);
      buddy(c, this.ax, this.ct - 6, 14, "#ff4d6d"); c.strokeStyle = "#55555f"; c.lineWidth = 3; c.beginPath(); c.arc(this.ax + 18, this.ct + 6, 10, 0, TAU); c.stroke();
      k1ell(c, b.x, b.y, 7, 3, "rgba(0,0,0,0.3)"); dot(c, b.x, b.y - b.z * 0.4, 7, "#d4f53c");
      c.globalAlpha = this.fadeA(); buddy(c, this.px, this.cb + 8, 15, "#3ddc84"); c.strokeStyle = "#f2f2f2"; c.lineWidth = 3; c.beginPath(); c.arc(this.px + 20, this.cb - 6, 12, 0, TAU); c.stroke(); c.globalAlpha = 1;
      this.ghostDrag(this.cb + 30, now);
    }
  }), "court");

  /* 60. Cabezones */
  regD("cabezones", "Cabezones", "Mantené a la izquierda o a la derecha para moverte. Tocá rápido para saltar. Meté goles en el arco de la derecha.", "#ff9f1c", G("Cabezones", {
    ctl: "hold",
    init: function () { this.gy = this.H - this.pb - 60; this.gw = 40; this.gh = 130; this.side = 0; this.pT = 0; this.kick(); },
    kick: function () { this.me = { x: this.W * 0.28, y: this.gy, vy: 0, vx: 0 }; this.ai = { x: this.W * 0.72, y: this.gy, vy: 0, vx: 0 }; this.b = { x: this.W / 2, y: this.gy - 220, vx: rnd(-40, 40), vy: 0 }; },
    press: function (x) { this.side = x < this.W / 2 ? -1 : 1; this.pT = 0; this.acts++; },
    release: function () { if (this.pT < 0.2 && this.me.y >= this.gy) this.me.vy = -560; },
    pl: function (p, dt) { p.vy += 1500 * dt; p.y += p.vy * dt; if (p.y > this.gy) { p.y = this.gy; p.vy = 0; } p.x = clamp(p.x + p.vx * dt, this.gw + 24, this.W - this.gw - 24); },
    hit: function (p) { var b = this.b, hx = p.x, hy = p.y - 50, dx = b.x - hx, dy = b.y - hy, d = Math.hypot(dx, dy); if (d < 44 && d > 0) { var nx = dx / d, ny = dy / d; b.x = hx + nx * 44; b.y = hy + ny * 44; var vn = (b.vx - p.vx) * nx + (b.vy - p.vy) * ny; if (vn < 0) { b.vx -= 1.8 * vn * nx; b.vy -= 1.8 * vn * ny; } b.vx += p.vx * 0.5; b.vy += Math.min(0, p.vy) * 0.5 - 60; } },
    step: function (dt) {
      var b = this.b, me = this.me, ai = this.ai; this.pT += dt;
      me.vx = this.holding && this.pT > 0.12 ? this.side * 230 : 0; this.pl(me, dt);
      var tgt = b.x > this.W * 0.45 ? b.x + 10 : this.W * 0.75; ai.vx = clamp((tgt - ai.x) * 4, -(170 + Math.min(this.t, 90)), 170 + Math.min(this.t, 90)); if (ai.y >= this.gy && Math.abs(b.x - ai.x) < 70 && b.y < this.gy - 70 && Math.random() < 0.08) ai.vy = -520; this.pl(ai, dt);
      b.vy += 900 * dt; b.vx *= (1 - 0.2 * dt); b.x += b.vx * dt; b.y += b.vy * dt; if (b.y > this.gy - 12) { b.y = this.gy - 12; b.vy = -Math.abs(b.vy) * 0.7; } if (b.y < this.pt + 12) { b.y = this.pt + 12; b.vy = Math.abs(b.vy); }
      this.hit(me); this.hit(ai); var spd = Math.hypot(b.vx, b.vy); if (spd > 900) { b.vx *= 900 / spd; b.vy *= 900 / spd; }
      var top = this.gy - this.gh;
      if (b.x < this.gw) { if (b.y > top) { this.hurt(); this.kick(); return; } b.x = this.gw; b.vx = Math.abs(b.vx); }
      if (b.x > this.W - this.gw) { if (b.y > top) { this.good(2, this.W - 40, this.gy - 60, true); this.kick(); return; } b.x = this.W - this.gw; b.vx = -Math.abs(b.vx); }
      if (b.y < top + 12 && (b.x < this.gw + 10 || b.x > this.W - this.gw - 10)) b.vy = Math.abs(b.vy) * 0.5 + 40;
    },
    head: function (c, p, col, f) { c.fillStyle = "#2b2b33"; c.fillRect(p.x - 10, p.y - 22, 8, 22); c.fillRect(p.x + 2, p.y - 22, 8, 22); fillR(c, p.x - 14, p.y - 36, 28, 18, 6, col); dot(c, p.x, p.y - 56, 30, "#f2b48a"); face(c, p.x + f * 4, p.y - 56, 24, f); c.fillStyle = col; c.beginPath(); c.arc(p.x, p.y - 60, 31, PI, 0); c.fill(); },
    draw: function (now) {
      var c = this.ctx, W = this.W, gy = this.gy, top = gy - this.gh;
      c.fillStyle = "#3ddc84"; c.fillRect(0, gy, W, this.H - gy);
      c.strokeStyle = "#f2f2f2"; c.lineWidth = 4; c.strokeRect(2, top, this.gw, this.gh); c.strokeRect(W - this.gw - 2, top, this.gw, this.gh); c.fillStyle = "rgba(255,255,255,0.15)"; c.fillRect(2, top, this.gw, this.gh); c.fillRect(W - this.gw - 2, top, this.gw, this.gh);
      this.head(c, this.ai, "#ff4d6d", -1); c.globalAlpha = this.fadeA(); this.head(c, this.me, "#3ddc84", 1); c.globalAlpha = 1;
      soccer(c, this.b.x, this.b.y, 12);
      this.ghostHold(W * 0.75, this.cy, now);
    }
  }), "court");
