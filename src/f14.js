
  /* ===== 100 copias de juegos conocidos (4/8) ===== */

  /* 37. Círculos */
  regD("circulos", "Círculos", "Tocá cada círculo justo cuando el aro de afuera lo alcanza.", "#ff5fd2", G("Circulos", {
    init: function () { this.cs = []; this.nc = 0.6; this.R = 34; },
    act: function (x, y) { var i, best = null; for (i = 0; i < this.cs.length; i++) { var q = this.cs[i]; if (!q.done && Math.hypot(x - q.x, y - q.y) < this.R + 8 && (!best || q.T - q.t < best.T - best.t)) best = q; } this.acts++; if (!best) return; var e = Math.abs(best.t - best.T); best.done = 1; best.fx = 0.2; if (e < 0.08) this.good(2, best.x, best.y, true); else if (e < 0.22) this.add(1); else { best.bad = 1; this.hurt(); } },
    step: function (dt) {
      var i, T = Math.max(0.65, 1.15 - this.t * 0.004);
      this.nc -= dt; if (this.nc <= 0) { this.nc = Math.max(0.35, 0.8 - this.t * 0.004) * rnd(0.8, 1.3); var last = this.cs.length ? this.cs[this.cs.length - 1] : null, x, y, k = 0; do { x = last && !last.done ? clamp(last.x + rnd(-130, 130), 50, this.W - 80) : rnd(50, this.W - 80); y = last && !last.done ? clamp(last.y + rnd(-130, 130), this.pt + 60, this.H - this.pb - 60) : rnd(this.pt + 60, this.H - this.pb - 60); } while (last && Math.hypot(x - last.x, y - last.y) < 80 && k++ < 10); this.cs.push({ x: x, y: y, t: 0, T: T, col: pickOf(["#ff5fd2", "#3ddc84", "#ffd23f", "#ff9f1c", "#c77dff"]) }); }
      for (i = 0; i < this.cs.length; i++) { var q = this.cs[i]; q.t += dt; if (q.done) { q.fx -= dt; if (q.fx <= 0) q.gone = 1; } else if (q.t > q.T + 0.25) { q.done = 1; q.bad = 1; q.fx = 0.25; this.hurt(); } }
      k1fil(this.cs, function (q) { return q.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, R = this.R;
      for (i = this.cs.length - 1; i >= 0; i--) { var q = this.cs[i]; if (q.done) { c.globalAlpha = Math.max(0, q.fx * 4); dot(c, q.x, q.y, R, q.bad ? "#55555f" : "#f2f2f2"); c.globalAlpha = 1; continue; } dot(c, q.x, q.y, R, q.col); dot(c, q.x, q.y, R * 0.55, "rgba(255,255,255,0.35)"); var rr = R * (1 + 2 * Math.max(0, 1 - q.t / q.T)); c.strokeStyle = "#f2f2f2"; c.lineWidth = 3; c.beginPath(); c.arc(q.x, q.y, rr, 0, TAU); c.stroke(); }
      if (this.cs.length && !this.cs[0].done) this.ghost(this.cs[0].x + 10, this.cs[0].y, now);
    }
  }), "arcade");

  /* 38. Surfista de cubos */
  regD("cubos", "Surfista de cubos", "Arrastrá a los costados. Juntá cubos para hacer la torre más alta y pasar por arriba de las paredes.", "#ffd23f", G("Cubos", {
    ctl: "drag",
    init: function () { this.hy = this.pt + (this.H - this.pt - this.pb) * 0.3; this.by = this.H - this.pb - 30; this.bx = 0; this.tx = 0; this.n = 1; this.dist = 0; this.it = []; this.nz = 400; this.left = []; },
    drag: function (x) { this.tx = clamp((x / this.W - 0.5) * 2.6, -0.85, 0.85); },
    rh: function (s) { return this.W * 0.42 * s + 2; },
    step: function (dt) {
      var i, v = 300 + Math.min(this.t, 120) * 1.6; this.dist += v * dt; this.bx += (this.tx - this.bx) * Math.min(1, dt * 8);
      while (this.nz < this.dist + 1500) { if (Math.random() < 0.38) { var h = ri(1, Math.min(4, 1 + Math.floor(this.t / 15)) + 1), l0 = pickOf([-1, -0.33, 0.33]), w = pickOf([0.67, 0.67, 1.34]); this.it.push({ z: this.nz, wall: 1, h: h, l0: l0, l1: Math.min(1, l0 + w) }); } else { var lx = rnd(-0.75, 0.75); for (var k = 0; k < ri(1, 4); k++) this.it.push({ z: this.nz + k * 40, cube: 1, lx: lx }); } this.nz += rnd(220, 360); }
      for (i = 0; i < this.it.length; i++) { var o = this.it[i], dz = o.z - this.dist; if (!o.done && dz < 8) { if (o.cube) { if (Math.abs(o.lx - this.bx) < 0.2) { o.done = 1; o.gone = 1; this.n = Math.min(14, this.n + 1); this.add(1); } else if (dz < -20) o.done = 1; } else { o.done = 1; if (this.bx > o.l0 && this.bx < o.l1) { if (this.n > o.h) { this.n -= o.h; this.good(1, this.W / 2, this.by - 100, false); } else { this.n = 1; this.hurt(); } } } } if (dz < -100) o.gone = 1; }
      k1fil(this.it, function (o) { return o.gone; });
    },
    draw: function (now) {
      var c = this.ctx, y, i, W = this.W;
      for (y = this.hy; y < this.by + 40; y += 4) { var s = (y - this.hy) / (this.by - this.hy) + 0.002, dz = 80 / s - 80, z = this.dist + dz, cx = W / 2, hw = this.rh(s); c.fillStyle = Math.floor(z / 80) % 2 ? "#4ad6e8" : "#3cc4d6"; c.fillRect(cx - hw, y, hw * 2, 4.5); c.fillStyle = "#f2f2f2"; c.fillRect(cx - hw - 4, y, 4, 4.5); c.fillRect(cx + hw, y, 4, 4.5); }
      var os = this.it.slice().sort(function (a, b) { return b.z - a.z; });
      for (i = 0; i < os.length; i++) { var o = os[i], dz2 = o.z - this.dist; if (dz2 < 0) continue; var s2 = 80 / (80 + dz2), yy = this.hy + s2 * (this.by - this.hy), rh = this.rh(s2), cxx = W / 2, cs = 0.2 * rh;
        if (o.cube) { var xx = cxx + o.lx * rh; fillR(c, xx - cs / 2, yy - cs, cs, cs, 3, "#ffd23f"); c.fillStyle = "#c99a00"; c.fillRect(xx - cs / 2, yy - cs * 0.25, cs, cs * 0.25); }
        else { var x0 = cxx + o.l0 * rh, x1 = cxx + o.l1 * rh, hh = o.h * 0.2 * rh * 0.9; fillR(c, x0, yy - hh, x1 - x0, hh, 3, "#ff4d6d"); c.fillStyle = "#a3203c"; for (var k = 1; k < o.h; k++) c.fillRect(x0, yy - hh * k / o.h, x1 - x0, 2); } }
      var cs0 = 0.2 * this.rh(1) * 0.8, bx = W / 2 + this.bx * this.rh(1); c.globalAlpha = this.fadeA(); for (i = 0; i < this.n; i++) { fillR(c, bx - cs0 / 2, this.by - (i + 1) * cs0 * 0.9, cs0, cs0 * 0.9, 4, "#ffd23f"); c.fillStyle = "#c99a00"; c.fillRect(bx - cs0 / 2, this.by - i * cs0 * 0.9 - 6, cs0, 6); } buddy(c, bx, this.by - this.n * cs0 * 0.9 - 14, 14, "#ff5fd2"); c.globalAlpha = 1;
      this.ghostDrag(this.by - 40, now);
    }
  }), "beach");

  /* 39. Tumba */
  regD("tumba", "Tumba", "Tocá hacia donde querés deslizarte: vas hasta chocar una pared. Subí juntando puntos antes de que te alcance la lava.", "#ffd23f", G("Tumba", {
    init: function () { this.C = 9; this.s = Math.floor(this.W / this.C); this.ox = (this.W - this.s * this.C) / 2; this.g = {}; this.top = -1; this.cc = 4; this.gen(40); this.pc = 4; this.pr = 1; this.d = [0, 0]; this.acc = 0; this.lava = -4; this.cam = 0; this.hi = 1; },
    gen: function (upto) { while (this.top < upto) { var r = ++this.top, row = []; for (var c = 0; c < this.C; c++) row.push(1); this.g[r] = row; if (r < 3) { for (c = 1; c < this.C - 1; c++) row[c] = 0; continue; } row[this.cc] = 0; if (Math.random() < 0.45) { var nc = ri(1, this.C - 1); for (c = Math.min(nc, this.cc); c <= Math.max(nc, this.cc); c++) row[c] = 0; this.cc = nc; } if (Math.random() < 0.25) { var a = ri(1, this.C - 1), b = ri(1, this.C - 1); for (c = Math.min(a, b); c <= Math.max(a, b); c++) row[c] = 0; } for (c = 0; c < this.C; c++) if (!row[c] && Math.random() < 0.5) row[c] = 2; } },
    cell: function (c, r) { if (c < 0 || c >= this.C || r < 0) return 1; this.gen(r + 2); return this.g[r][c]; },
    act: function (x, y) { if (this.d[0] || this.d[1]) return; var px = this.ox + (this.pc + 0.5) * this.s, py = this.sy(this.pr) + this.s / 2, d = k1dir(x, y, px, py); this.d = [d[0], -d[1]]; this.acts++; sfx(380, 0.04, "triangle", 0.04, 1.4); },
    sy: function (r) { return this.H - this.pb - 40 - (r - this.cam + 1) * this.s; },
    step: function (dt) {
      if (this.d[0] || this.d[1]) { this.acc += dt * 20; while (this.acc >= 1) { this.acc -= 1; var nc = this.pc + this.d[0], nr = this.pr + this.d[1]; if (this.cell(nc, nr) === 1) { this.d = [0, 0]; this.acc = 0; break; } this.pc = nc; this.pr = nr; if (this.g[nr][nc] === 2) { this.g[nr][nc] = 0; this.add(1); } if (nr > this.hi) this.hi = nr; } }
      this.lava += dt * (0.55 + Math.min(this.t, 120) * 0.006); if (this.lava < this.pr - 14) this.lava = this.pr - 14;
      if (this.lava >= this.pr - 0.2) { this.hurt(); this.lava = this.pr - 6; }
      this.cam += (this.pr - 4 - this.cam) * Math.min(1, dt * 5);
      for (var k in this.g) if (+k < this.cam - 8) delete this.g[k];
    },
    draw: function (now) {
      var c = this.ctx, s = this.s, r, cc, r0 = Math.max(0, Math.floor(this.cam) - 2), r1 = Math.floor(this.cam) + Math.ceil((this.H - this.pt) / s) + 1;
      for (r = r0; r <= r1; r++) { var y = this.sy(r); if (y < this.pt - s) continue; for (cc = 0; cc < this.C; cc++) { var v = this.cell(cc, r), x = this.ox + cc * s; if (v === 1) { fillR(c, x, y, s, s, 2, "#5a2d82"); c.fillStyle = "#7a3cff"; c.fillRect(x + 3, y + 3, s - 6, 4); } else if (v === 2) dot(c, x + s / 2, y + s / 2, 4, "#ffd23f"); } }
      var ly = this.sy(this.lava) + s; c.fillStyle = "#ff6a00"; c.fillRect(0, ly, this.W, this.H - ly); c.fillStyle = "#ffd23f"; for (var i = 0; i < this.W; i += 30) c.fillRect(i + Math.sin(now / 200 + i) * 6, ly + 4, 16, 4);
      var px = this.ox + (this.pc + 0.5) * s, py = this.sy(this.pr) + s / 2; c.globalAlpha = this.fadeA(); fillR(c, px - s * 0.4, py - s * 0.4, s * 0.8, s * 0.8, 6, "#ffd23f"); dot(c, px - 6, py - 3, 4, "#2b2b33"); dot(c, px + 6, py - 3, 4, "#2b2b33"); c.fillStyle = "#2b2b33"; c.fillRect(px - 7, py + 6, 14, 3); c.globalAlpha = 1;
      this.ghost(px, py - 80, now);
    }
  }), "cave");

  /* 40. Luz roja, luz verde */
  regD("luzroja", "Luz roja, luz verde", "Mantené apretado para correr mientras la muñeca mira para atrás. Cuando se da vuelta, soltá y quedate quieto.", "#ff4d6d", G("Luzroja", {
    ctl: "hold",
    init: function () { this.lvl = 0; this.round(); },
    round: function () { this.y = 0; this.ph = "g"; this.tm = rnd(1.5, 3); this.tl = 25; this.np = []; for (var k = 0; k < 5; k++) this.np.push({ x: rnd(0.1, 0.9), y: 0, v: rnd(0.04, 0.08), out: 0, col: pickOf(["#3ddc84", "#3ddc84", "#ff5fd2"]) }); },
    step: function (dt) {
      var i, sp = 0.075 + this.lvl * 0.006; this.tm -= dt; this.tl -= dt;
      if (this.tm <= 0) { if (this.ph === "g") { this.ph = "w"; this.tm = 0.4; } else if (this.ph === "w") { this.ph = "r"; this.tm = rnd(1.2, 2.4); this.gr = 0.18; } else { this.ph = "g"; this.tm = rnd(1.2, 3.2) * Math.max(0.6, 1 - this.lvl * 0.06); } }
      if (this.holding) this.y += sp * dt;
      if (this.ph === "r") { this.gr -= dt; if (this.holding && this.gr <= 0) { this.hurt(); this.y = Math.max(0, this.y - 0.15); this.ph = "g"; this.tm = rnd(1.5, 2.5); } }
      for (i = 0; i < this.np.length; i++) { var p = this.np[i]; if (p.out) continue; if (this.ph !== "r") p.y += p.v * dt; else if (Math.random() < 0.004) p.out = 1; }
      if (this.y >= 1) { this.lvl++; this.good(3, this.W / 2, this.pt + 100, true); this.round(); }
      else if (this.tl <= 0) { this.hurt(); this.round(); }
    },
    draw: function (now) {
      var c = this.ctx, W = this.W, fy = this.pt + 150, by = this.H - this.pb - 60, i, Y = function (v) { return by - (by - fy) * v; };
      c.fillStyle = "#e8c98a"; c.fillRect(0, fy - 20, W, this.H - fy); c.fillStyle = "#ff4d6d"; c.fillRect(0, fy, W, 5);
      fillR(c, W / 2 - 10, this.pt + 30, 20, 90, 6, "#8a5a2b");
      var back = this.ph === "g"; fillR(c, W / 2 - 26, this.pt + 70, 52, 70, 18, "#ff9f1c"); dot(c, W / 2, this.pt + 60, 22, "#f2b48a"); if (back || this.ph === "w") { dot(c, W / 2, this.pt + 52, 20, "#2b2b33"); dot(c, W / 2 - 14, this.pt + 46, 8, "#2b2b33"); dot(c, W / 2 + 14, this.pt + 46, 8, "#2b2b33"); } else { face(c, W / 2, this.pt + 62, 20, 0); dot(c, W / 2 - 14, this.pt + 42, 8, "#2b2b33"); dot(c, W / 2 + 14, this.pt + 42, 8, "#2b2b33"); }
      dot(c, W - 70, this.pt + 40, 14, this.ph === "g" ? "#3ddc84" : "#55555f"); dot(c, W - 104, this.pt + 40, 14, this.ph !== "g" ? "#ff4d6d" : "#55555f");
      for (i = 0; i < this.np.length; i++) { var p = this.np[i]; c.globalAlpha = p.out ? 0.3 : 1; fillR(c, p.x * W - 8, Y(p.y) - 22, 16, 22, 5, p.col); dot(c, p.x * W, Y(p.y) - 28, 7, "#f2b48a"); c.globalAlpha = 1; }
      var mx = W * 0.5, my = Y(this.y), ph = this.holding ? Math.sin(now / 60) * 6 : 0; c.globalAlpha = this.fadeA(); c.strokeStyle = "#2b2b33"; c.lineWidth = 5; c.beginPath(); c.moveTo(mx - 4, my - 4); c.lineTo(mx - 4 - ph, my + 10); c.moveTo(mx + 4, my - 4); c.lineTo(mx + 4 + ph, my + 10); c.stroke(); fillR(c, mx - 11, my - 30, 22, 28, 6, "#3ddc84"); buddy(c, mx, my - 38, 10, "#f2b48a"); c.globalAlpha = 1;
      fillR(c, 16, this.pt + 2, W - 92, 5, 3, "rgba(255,255,255,0.12)"); fillR(c, 16, this.pt + 2, (W - 92) * clamp(this.tl / 25, 0, 1), 5, 3, this.tl < 6 ? "#ff4d6d" : "#f2f2f2");
      this.ghostHold(W * 0.75, by - 40, now);
    }
  }), "desert");

  /* 41. Dinosaurio */
  regD("dino", "Dinosaurio", "Tocá a la derecha para saltar los cactus. Mantené a la izquierda para agacharte cuando viene un pájaro.", "#d9dde3", G("Dino", {
    ctl: "hold",
    init: function () { this.gy = this.H - this.pb - 120; this.dx = 70; this.h = 0; this.vy = 0; this.duck = false; this.ob = []; this.nx = 1.2; this.s = 0; },
    press: function (x) { this.acts++; if (x >= this.W / 2) { this.duck = false; if (this.h <= 0) { this.vy = 600; this.h = 0.01; sfx(520, 0.05, "square", 0.03, 1.4); } } else this.duck = true; },
    release: function () { this.duck = false; },
    step: function (dt) {
      var i, v = 300 + Math.min(this.t, 120) * 2.2; this.s += v * dt;
      if (this.h > 0) { this.h += this.vy * dt; this.vy -= (this.duck ? 3600 : 1800) * dt; if (this.h <= 0) { this.h = 0; this.vy = 0; } }
      this.nx -= dt; if (this.nx <= 0) { this.nx = rnd(0.8, 1.6) * Math.max(0.55, 1 - this.t * 0.004); if (this.t > 8 && Math.random() < 0.3) this.ob.push({ x: this.W + 40, bird: 1, y: 44 + rnd(0, 14), w: 40, hh: 20 }); else { var n = ri(1, 4); this.ob.push({ x: this.W + 40, w: 16 * n + 6, hh: rnd(34, 52), n: n }); } }
      var hb = this.duck && this.h <= 0 ? 26 : 50;
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i]; o.x -= v * dt; if (o.hit || o.sc) { if (o.x < -60) o.gone = 1; continue; } var ox0 = o.x, ox1 = o.x + o.w, dx0 = this.dx - 16, dx1 = this.dx + 22; if (ox1 > dx0 && ox0 < dx1) { var bot = this.h, top = this.h + hb, ob0 = o.bird ? o.y : 0, ob1 = o.bird ? o.y + o.hh : o.hh; if (top > ob0 + 4 && bot < ob1 - 4) { o.hit = 1; this.hurt(); } } if (ox1 < dx0 && !o.hit) { o.sc = 1; this.add(1); } }
      k1fil(this.ob, function (o) { return o.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, gy = this.gy, col = "#d9dde3";
      c.fillStyle = col; c.fillRect(0, gy, this.W, 3); for (i = 0; i < 12; i++) { var px = ((i * 53 - this.s) % this.W + this.W) % this.W; c.fillRect(px, gy + 10 + (i % 3) * 6, 6 + (i % 4) * 3, 3); }
      for (i = 0; i < this.ob.length; i++) { var o = this.ob[i]; if (o.bird) { var by = gy - o.y - o.hh, fl = Math.floor(now / 160) % 2; c.fillStyle = col; c.fillRect(o.x + 6, by + 8, 30, 8); c.fillRect(o.x, by + 6, 10, 6); c.fillRect(o.x + 14, fl ? by - 6 : by + 14, 10, 12); } else for (var k = 0; k < o.n; k++) { var cx = o.x + 3 + k * 16; c.fillStyle = "#3ddc84"; c.fillRect(cx + 4, gy - o.hh, 8, o.hh); c.fillRect(cx, gy - o.hh * 0.7, 4, 10); c.fillRect(cx + 12, gy - o.hh * 0.55, 4, 10); c.fillRect(cx, gy - o.hh * 0.7 + 6, 4, 4); } }
      var x = this.dx, y = gy - this.h, d = this.duck && this.h <= 0, leg = this.h <= 0 ? Math.floor(now / 90) % 2 : 0; c.globalAlpha = this.fadeA(); c.fillStyle = col;
      if (d) { c.fillRect(x - 16, y - 26, 44, 18); c.fillRect(x + 20, y - 30, 18, 14); c.fillStyle = "#2b2b33"; c.fillRect(x + 30, y - 27, 3, 3); c.fillStyle = col; } else { c.fillRect(x - 12, y - 36, 26, 22); c.fillRect(x + 4, y - 52, 22, 16); c.fillRect(x - 20, y - 32, 10, 8); c.fillRect(x + 12, y - 28, 6, 4); c.fillStyle = "#2b2b33"; c.fillRect(x + 12, y - 48, 3, 3); c.fillStyle = col; }
      c.fillRect(x - 6, y - 14, 5, leg ? 8 : 14); c.fillRect(x + 4, y - 14, 5, leg ? 14 : 8); c.globalAlpha = 1;
      this.ghostHold(this.W * 0.75, gy - 90, now);
    }
  }), "desert");

  /* 42. Atrapá al bicho */
  regD("bicho", "Atrapá al bicho", "Arrastrá para apuntar y soltá para tirar la bola. Cuanto más chico el aro, más puntos.", "#ff4d6d", G("Bicho", {
    ctl: "drag",
    init: function () { this.ax = this.W / 2; this.by0 = this.H - this.pb - 70; this.ball = null; this.lvl = 0; this.mon(); },
    mon: function () { this.m = { x: this.W / 2, y: this.pt + 180, vx: (60 + this.lvl * 12) * pickOf([-1, 1]), col: pickOf(["#ffd23f", "#3ddc84", "#c77dff", "#ff9f1c", "#ff5fd2"]), hop: 0 }; this.rg = 0; this.miss = 0; },
    drag: function (x) { if (!this.ball) this.ax = clamp(x, 20, this.W - 20); },
    release: function () { if (!this.ball) { this.ball = { x: this.ax, k: 0 }; this.acts++; sfx(400, 0.08, "sine", 0.05, 1.6); } },
    step: function (dt) {
      var m = this.m; m.x += m.vx * dt; if (m.x < 50 || m.x > this.W - 70) { m.vx = -m.vx; m.x = clamp(m.x, 50, this.W - 70); } m.hop += dt * 5; this.rg = (this.rg + dt * 0.7) % 1;
      if (this.ball) { var b = this.ball; b.k += dt / 0.55; if (b.k >= 1) { var rr = 1 - this.rg, d = Math.abs(b.x - m.x); if (d < 30) { if (rr < 0.35) this.good(3, m.x, m.y, true); else if (rr < 0.7) this.good(2, m.x, m.y, false); else this.add(1); this.lvl++; this.mon(); } else { this.miss++; if (this.miss >= 3) { this.hurt(); this.mon(); } } this.ball = null; } }
    },
    draw: function (now) {
      var c = this.ctx, m = this.m, my = m.y - Math.abs(Math.sin(m.hop)) * 12, rr = 1 - this.rg;
      k1ell(c, m.x, m.y + 30, 34, 8, "rgba(0,0,0,0.2)");
      c.strokeStyle = rr < 0.35 ? "#3ddc84" : rr < 0.7 ? "#ffd23f" : "#ff4d6d"; c.lineWidth = 4; c.beginPath(); c.arc(m.x, my, 24 + 50 * rr, 0, TAU); c.stroke();
      poly(c, [m.x - 20, my - 12, m.x - 14, my - 38, m.x - 4, my - 16], m.col); poly(c, [m.x + 20, my - 12, m.x + 14, my - 38, m.x + 4, my - 16], m.col); buddy(c, m.x, my, 24, m.col); dot(c, m.x - 14, my + 6, 4, "#ff4d6d"); dot(c, m.x + 14, my + 6, 4, "#ff4d6d");
      var bx = this.ball ? this.ball.x : this.ax, k = this.ball ? this.ball.k : 0, by = this.by0 + (m.y - this.by0) * k - Math.sin(k * PI) * 80, r = 18 - 8 * k;
      if (!this.ball) { c.strokeStyle = "rgba(255,255,255,0.35)"; c.setLineDash([6, 8]); c.beginPath(); c.moveTo(this.ax, this.by0); c.lineTo(this.ax, m.y); c.stroke(); c.setLineDash([]); }
      c.save(); c.beginPath(); c.arc(bx, by, r, PI, 0); c.closePath(); c.fillStyle = "#ff4d6d"; c.fill(); c.beginPath(); c.arc(bx, by, r, 0, PI); c.closePath(); c.fillStyle = "#f2f2f2"; c.fill(); c.restore(); c.fillStyle = "#2b2b33"; c.fillRect(bx - r, by - 1.5, r * 2, 3); dot(c, bx, by, r * 0.3, "#2b2b33"); dot(c, bx, by, r * 0.18, "#f2f2f2");
      for (var i = 0; i < 3 - this.miss; i++) dot(c, 24 + i * 16, this.H - this.pb - 20, 5, "#ff4d6d");
      this.ghostDrag(this.by0 - 20, now);
    }
  }), "garden");

  /* 43. Bollo de papel */
  regD("bollo", "Bollo de papel", "Arrastrá para elegir desde dónde tirar y soltá. Fijate el viento: te corre el papel.", "#f2f2f2", G("Bollo", {
    ctl: "drag",
    init: function () { this.ax = this.W / 2; this.y0 = this.H - this.pb - 60; this.binY = this.pt + 170; this.binX = this.W / 2; this.lvl = 0; this.wind = 0; this.newW(); this.p = null; },
    newW: function () { this.wind = this.lvl < 1 ? rnd(-0.3, 0.3) : rnd(-1, 1); },
    drag: function (x) { if (!this.p) this.ax = clamp(x, 20, this.W - 20); },
    release: function () { if (!this.p) { this.p = { x0: this.ax, k: 0 }; this.acts++; sfx(250, 0.08, "sine", 0.04, 1.4); } },
    px: function (p) { return p.x0 + (this.binX - this.W / 2) * 0 + this.wind * 150 * p.k * p.k; },
    step: function (dt) {
      if (this.lvl >= 3) this.binX = this.W / 2 + Math.sin(this.t * 0.6) * this.W * 0.25;
      if (this.p) { this.p.k += dt / 0.9; if (this.p.k >= 1) { var d = Math.abs(this.px(this.p) - this.binX); if (d < 26) { this.good(d < 8 ? 2 : 1, this.binX, this.binY, d < 8); this.lvl++; this.newW(); } else this.hurt(); this.p = null; } }
    },
    draw: function (now) {
      var c = this.ctx, W = this.W;
      c.fillStyle = "#8a6a4a"; c.fillRect(0, this.binY + 30, W, 10);
      fillR(c, this.binX - 32, this.binY - 30, 64, 60, 6, "#9aa1ab"); k1ell(c, this.binX, this.binY - 30, 32, 9, "#55555f"); c.fillStyle = "#7d8590"; for (var i = -2; i <= 2; i++) c.fillRect(this.binX + i * 12 - 1, this.binY - 18, 3, 44);
      var ww = this.wind; fillR(c, W / 2 - 60, this.pt + 40, 120, 26, 13, "rgba(255,255,255,0.12)"); var L = ww * 50; k1ln(c, W / 2, this.pt + 53, W / 2 + L, this.pt + 53, 5, "#3ddc84"); if (Math.abs(L) > 4) poly(c, [W / 2 + L + Math.sign(L) * 10, this.pt + 53, W / 2 + L, this.pt + 45, W / 2 + L, this.pt + 61], "#3ddc84");
      fillR(c, W / 2 - 4, this.pt + 70, 8, 30, 3, "#d9dde3"); var fl = Math.abs(ww); poly(c, [W / 2 + 4, this.pt + 70, W / 2 + 4 + 36 * ww, this.pt + 78 + (1 - fl) * 8, W / 2 + 4, this.pt + 88], "#ff4d6d");
      var p = this.p, x = p ? this.px(p) : this.ax, k = p ? p.k : 0, y = this.y0 + (this.binY - 40 - this.y0) * k - Math.sin(k * PI) * 160, r = 16 - 9 * k;
      if (!p) { c.strokeStyle = "rgba(255,255,255,0.3)"; c.setLineDash([5, 8]); c.beginPath(); c.moveTo(x, this.y0); c.lineTo(x, this.binY); c.stroke(); c.setLineDash([]); }
      dot(c, x, y, r, "#f2f2f2"); k1ln(c, x - r * 0.5, y - r * 0.2, x + r * 0.3, y + r * 0.4, 1.5, "#c0c4cc"); k1ln(c, x + r * 0.2, y - r * 0.6, x - r * 0.1, y + r * 0.1, 1.5, "#c0c4cc");
      this.ghostDrag(this.y0, now);
    }
  }), "school");

  /* 44. Yeti y pingüino */
  regD("yeti", "Yeti y pingüino", "Tocá cuando el pingüino pasa por delante del yeti para pegarle fuerte y mandarlo lejos.", "#f2f2f2", G("Yeti", {
    init: function () { this.gy = this.H - this.pb - 70; this.yx = 90; this.lvl = 0; this.drop(); },
    drop: function () { this.ph = 0; this.p = { x: this.yx + 20, y: this.pt + 20, vx: 0, vy: 0, a: 0 }; this.cam = 0; this.sw = 0; this.dist = 0; this.wait = 0; },
    act: function () { if (this.ph !== 0 || this.sw > 0) return; this.sw = 0.25; this.acts++; var zy = this.gy - 70, e = Math.abs(this.p.y - zy); if (e < 60) { var q = 1 - e / 60, sp = 500 + 700 * q; this.p.vx = sp * Math.cos(-0.65); this.p.vy = sp * Math.sin(-0.65); this.ph = 1; this.q = q; sfx(150, 0.1, "square", 0.06, 2); } },
    step: function (dt) {
      var p = this.p; this.sw -= dt;
      if (this.ph === 0) { p.vy += 500 * dt; p.y += p.vy * dt; if (p.y > this.gy - 10) { this.hurt(); this.drop(); } }
      else if (this.ph === 1) { p.vy += 600 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.a += dt * 8; if (p.y > this.gy - 10) { p.y = this.gy - 10; p.vy = -Math.abs(p.vy) * 0.45; p.vx *= 0.7; if (p.vx < 40) { this.ph = 2; this.wait = 1.1; this.dist = p.x - this.yx; var n = Math.max(1, Math.floor(this.dist / 300)); this.good(n, this.W / 2, this.cy, this.q > 0.85); } } this.cam = Math.max(0, p.x - this.W * 0.4); }
      else { this.wait -= dt; if (this.wait <= 0) this.drop(); }
    },
    draw: function (now) {
      var c = this.ctx, cam = this.cam, gy = this.gy, i, p = this.p;
      c.fillStyle = "#f2f6fa"; c.fillRect(0, gy, this.W, this.H - gy);
      for (i = Math.floor(cam / 300); i < (cam + this.W) / 300 + 1; i++) { var fx = i * 300 + this.yx - cam; if (i > 0) flag(c, fx, gy - 14, i % 2 ? "#ff4d6d" : "#3ddc84"); }
      var yx = this.yx - cam; fillR(c, yx - 10, this.pt + 10, 60, 14, 4, "#d9dde3");
      fillR(c, yx - 34, gy - 110, 56, 110, 22, "#f2f2f2"); dot(c, yx - 6, gy - 116, 24, "#f2f2f2"); dot(c, yx - 6, gy - 112, 14, "#9ad0e0"); face(c, yx - 6, gy - 112, 12, 1);
      c.save(); c.translate(yx + 10, gy - 70); c.rotate(this.sw > 0 ? -1.2 + (0.25 - this.sw) * 9 : -1.6); fillR(c, -5, -70, 10, 74, 4, "#8a5a2b"); c.restore();
      c.fillStyle = "rgba(255,210,63,0.15)"; c.fillRect(yx + 2, gy - 130, 40, 120);
      var px = p.x - cam; c.save(); c.translate(px, p.y); c.rotate(this.ph ? p.a : 0); k1ell(c, 0, 0, 10, 14, "#2b2b33"); k1ell(c, 0, 3, 6, 9, "#f2f2f2"); dot(c, -3, -7, 2, "#fff"); dot(c, 3, -7, 2, "#fff"); poly(c, [-3, -3, 3, -3, 0, 2], "#ff9f1c"); c.restore();
      this.ghost(this.W * 0.6, this.cy, now);
    }
  }), "snow");

  /* 45. Golpeá al monstruo */
  regD("monstruo", "Golpeá al monstruo", "Tocá rápido para pegarle. Cuando saca los pinchos, no lo toques.", "#c77dff", G("Monstruo", {
    init: function () { this.lvl = 0; this.mon(); },
    mon: function () { this.mh = 22 + this.lvl * 6; this.hp = this.mh; this.tl = 10; this.sp = 0; this.st = rnd(1.5, 3); this.warn = 0; this.col = pickOf(["#c77dff", "#3ddc84", "#ff9f1c", "#ff5fd2", "#ffd23f"]); this.hitT = 0; },
    act: function (x, y) { this.acts++; if (this.sp > 0) { this.hurt(); this.sp = 0; this.st = rnd(1.5, 2.5); return; } this.hp--; this.hitT = 0.08; sfx(160 + rnd(0, 60), 0.04, "square", 0.04, 0.7); if (this.hp % 4 === 0) this.add(1); if (this.hp <= 0) { this.good(3, this.W / 2, this.cy, true); this.lvl++; this.mon(); } },
    step: function (dt) {
      this.tl -= dt; this.hitT -= dt; if (this.tl <= 0) { this.hurt(); this.mon(); return; }
      if (this.sp > 0) { this.sp -= dt; if (this.sp <= 0) this.st = rnd(1.2, 3) * Math.max(0.5, 1 - this.lvl * 0.05); }
      else if (this.warn > 0) { this.warn -= dt; if (this.warn <= 0) this.sp = rnd(0.7, 1.3); }
      else { this.st -= dt; if (this.st <= 0) this.warn = Math.max(0.3, 0.55 - this.lvl * 0.02); }
    },
    draw: function (now) {
      var c = this.ctx, cx = this.W / 2, cy = this.cy + 20, r = 90 + this.lvl * 2, sq = this.hitT > 0 ? 0.92 : 1, k;
      if (this.sp > 0) for (k = 0; k < 14; k++) { var a = k * TAU / 14, x1 = cx + Math.cos(a) * r * 0.9, y1 = cy + Math.sin(a) * r * 0.85; poly(c, [x1 + Math.cos(a + 1.6) * 12, y1 + Math.sin(a + 1.6) * 12, cx + Math.cos(a) * (r + 40), cy + Math.sin(a) * (r + 36), x1 + Math.cos(a - 1.6) * 12, y1 + Math.sin(a - 1.6) * 12], "#f2f2f2"); }
      k1ell(c, cx, cy, r * sq, r * 0.9 / sq, this.warn > 0 ? "#ff4d6d" : this.col);
      dot(c, cx - 34, cy - 24, 22, "#fff"); dot(c, cx + 34, cy - 24, 22, "#fff"); dot(c, cx - 30, cy - 20, 10, "#2b2b33"); dot(c, cx + 30, cy - 20, 10, "#2b2b33");
      c.fillStyle = "#2b2b33"; c.fillRect(cx - 40, cy + 28, 80, 20); c.fillStyle = "#f2f2f2"; for (k = 0; k < 5; k++) poly(c, [cx - 40 + k * 16, cy + 28, cx - 32 + k * 16, cy + 40, cx - 24 + k * 16, cy + 28], "#f2f2f2");
      fillR(c, 16, this.pt + 2, this.W - 92, 9, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (this.W - 92) * this.hp / this.mh, 9, 4, "#ff4d6d");
      fillR(c, 16, this.pt + 15, this.W - 92, 5, 3, "rgba(255,255,255,0.12)"); fillR(c, 16, this.pt + 15, (this.W - 92) * clamp(this.tl / 10, 0, 1), 5, 3, "#f2f2f2");
      this.ghost(cx + 30, cy + 20, now);
    }
  }), "volcano");

  /* 46. Gancho de curva */
  regD("gancho", "Gancho de curva", "Mantené apretado para engancharte al poste en cada curva. Soltá cuando quedes derecho en la pista.", "#ff9f1c", G("Gancho", {
    ctl: "hold",
    init: function () { this.v = 230; this.track(); },
    track: function () { this.seg = []; this.x = this.W / 2; this.y = this.H - this.pb - 120; var x = this.x, y = this.y + 200, d = [0, -1]; this.seg.push({ x1: x, y1: y, x2: x, y2: y - 520, d: d }); this.vx = 0; this.vy = -1; this.att = null; this.cur = 0; this.more(); this.pass = 0; this.off = 0; },
    more: function () { while (this.seg.length < this.cur + 6) { var L = this.seg[this.seg.length - 1], nd; if (L.d[1] === -1) nd = pickOf([[1, 0], [-1, 0]]); else nd = [0, -1]; var len = nd[1] ? rnd(260, 420) : rnd(200, 320), R = 60; var sx = L.x2, sy = L.y2; this.seg.push({ x1: sx, y1: sy, x2: sx + nd[0] * len, y2: sy + nd[1] * len, d: nd, px: sx + nd[0] * R - L.d[0] * R, py: sy + nd[1] * R - L.d[1] * R }); } },
    dSeg: function (s) { var dx = s.x2 - s.x1, dy = s.y2 - s.y1, L2 = dx * dx + dy * dy, t = clamp(((this.x - s.x1) * dx + (this.y - s.y1) * dy) / L2, 0, 1); return Math.hypot(this.x - s.x1 - dx * t, this.y - s.y1 - dy * t); },
    press: function () { this.acts++; var n = this.seg[this.cur + 1]; if (n && Math.hypot(this.x - n.px, this.y - n.py) < 170) { var r = Math.hypot(this.x - n.px, this.y - n.py), cr = this.vx * (n.py - this.y) - this.vy * (n.px - this.x); this.att = { x: n.px, y: n.py, r: r, s: cr > 0 ? 1 : -1, a: Math.atan2(this.y - n.py, this.x - n.px) }; } },
    release: function () { this.att = null; },
    step: function (dt) {
      var i; this.v = 230 + Math.min(this.t, 120) * 1.2;
      if (this.att && this.holding) { var A = this.att; A.a += A.s * this.v / A.r * dt; this.x = A.x + Math.cos(A.a) * A.r; this.y = A.y + Math.sin(A.a) * A.r; this.vx = -Math.sin(A.a) * A.s; this.vy = Math.cos(A.a) * A.s; }
      else { this.x += this.vx * this.v * dt; this.y += this.vy * this.v * dt; }
      var on = false; for (i = Math.max(0, this.cur - 1); i < Math.min(this.seg.length, this.cur + 3); i++) { var s = this.seg[i], d = this.dSeg(s); if (d < 36) { on = true; if (i > this.cur && !this.att) { this.cur = i; this.add(1); this.more(); var ss = this.seg[i]; this.vx += (ss.d[0] - this.vx) * 0.5; this.vy += (ss.d[1] - this.vy) * 0.5; var m = Math.hypot(this.vx, this.vy); this.vx /= m; this.vy /= m; } } } var nn = this.seg[this.cur + 1]; if (nn && Math.hypot(this.x - nn.x1, this.y - nn.y1) < 70) on = true;
      if (!on) { this.off += dt; if (this.off > 0.12) { this.off = 0; this.hurt(); var s2 = this.seg[this.cur]; this.x = s2.x1 + (s2.x2 - s2.x1) * 0.3; this.y = s2.y1 + (s2.y2 - s2.y1) * 0.3; this.vx = s2.d[0]; this.vy = s2.d[1]; this.att = null; } } else this.off = 0;
      if (!this.att) { var sc = this.seg[this.cur], dd = Math.abs(this.vx * sc.d[1] - this.vy * sc.d[0]); if (dd < 0.3) { this.vx += (sc.d[0] - this.vx) * dt * 4; this.vy += (sc.d[1] - this.vy) * dt * 4; var mm = Math.hypot(this.vx, this.vy); this.vx /= mm; this.vy /= mm; } }
    },
    draw: function (now) {
      var c = this.ctx, i, ox = this.W / 2 - this.x, oy = this.H - this.pb - 180 - this.y;
      c.save(); c.translate(ox, oy);
      c.strokeStyle = "#55555f"; c.lineWidth = 76; c.lineCap = "round"; c.beginPath(); for (i = Math.max(0, this.cur - 1); i < this.seg.length; i++) { var s = this.seg[i]; c.moveTo(s.x1, s.y1); c.lineTo(s.x2, s.y2); } c.stroke();
      c.strokeStyle = "#f2f2f2"; c.lineWidth = 3; c.setLineDash([16, 18]); c.beginPath(); for (i = Math.max(0, this.cur - 1); i < this.seg.length; i++) { var s2 = this.seg[i]; c.moveTo(s2.x1, s2.y1); c.lineTo(s2.x2, s2.y2); } c.stroke(); c.setLineDash([]); c.lineCap = "butt";
      for (i = this.cur + 1; i < this.seg.length; i++) { var s3 = this.seg[i]; dot(c, s3.px, s3.py, 10, "#ffd23f"); dot(c, s3.px, s3.py, 5, "#ff9f1c"); }
      if (this.att) k1ln(c, this.x, this.y, this.att.x, this.att.y, 3, "#ffd23f");
      c.globalAlpha = this.fadeA(); c.save(); c.translate(this.x, this.y); c.rotate(Math.atan2(this.vy, this.vx) + PI / 2); fillR(c, -11, -18, 22, 36, 6, "#ff4d6d"); c.fillStyle = "#2b2b33"; c.fillRect(-8, -10, 16, 8); c.restore(); c.globalAlpha = 1;
      c.restore();
      this.ghostHold(this.W * 0.7, this.H - this.pb - 60, now);
    }
  }), "road");

  /* 47. Escalones */
  regD("escalones", "Escalones", "La mira sube y baja sola. Tocá cuando apunte al bandido. A la cabeza vale más.", "#3ddc84", G("Escalones", {
    init: function () { this.st = 46; this.side = -1; this.lvl = 0; this.cam = 0; this.camT = 0; this.ph = 0; this.ang = 0; this.aimT = 0; this.enemy(); },
    enemy: function () { this.ex = this.side < 0 ? this.W - 70 : 70; this.ey = this.py() - this.st * ri(2, 5); this.ph = 0; this.aimT = 0; this.ang = 0; this.sh = 0; this.dead = 0; this.fire = -1; },
    py: function () { return this.H - this.pb - 140 - this.lvl * 0; },
    px: function () { return this.side < 0 ? 70 : this.W - 70; },
    act: function () { if (this.ph !== 0) return; this.acts++; this.sh = 0.12; var x0 = this.px(), y0 = this.py() - 30, dir = -this.side, a = this.ang, dx = Math.cos(a) * dir, dy = -Math.sin(a), t = (this.ex - x0) / dx, yy = y0 + dy * t, hy = this.ey - 40, by = this.ey - 18; sfx(500, 0.05, "square", 0.05, 0.5);
      if (Math.abs(yy - hy) < 9) { this.good(2, this.ex, hy, true); this.win(); } else if (Math.abs(yy - by) < 15) { this.add(1); this.win(); } else { this.ph = 2; this.fire = 0.5; } },
    win: function () { this.ph = 1; this.dead = 1; this.wt = 0.7; },
    step: function (dt) {
      this.sh -= dt;
      if (this.ph === 0) { this.aimT += dt * (1.6 + this.lvl * 0.08); this.ang = 0.9 * (0.5 - 0.5 * Math.cos(this.aimT)); }
      else if (this.ph === 1) { this.wt -= dt; if (this.wt <= 0) { var rise = this.py() - this.ey; this.camT += rise; this.side = -this.side; this.lvl++; this.enemy(); } }
      else { this.fire -= dt; if (this.fire <= 0 && this.fire > -1) { this.fire = -1; this.hurt(); this.ph = 0; this.aimT = 0; } }
      this.cam = this.camT;
    },
    draw: function (now) {
      var c = this.ctx, i, W = this.W, off = this.cam - this.camT, base = this.py() - off;
      for (i = -4; i < 18; i++) { var y = base - i * this.st; c.fillStyle = i % 2 ? "#3a3a44" : "#33333c"; c.fillRect(0, y, W, this.st); }
      fillR(c, this.side < 0 ? 0 : W - 120, base, 120, this.st, 3, "#8a6a4a"); fillR(c, this.side < 0 ? W - 130 : 0, this.ey - off, 130, this.st, 3, "#8a6a4a");
      var x0 = this.px(), y0 = base - 30, dir = -this.side, ex = this.ex, ey = this.ey - off;
      if (!this.dead) { c.globalAlpha = 1; fillR(c, ex - 12, ey - 30, 24, 30, 6, "#2b2b33"); buddy(c, ex, ey - 40, 12, "#f2b48a", this.side); c.fillStyle = "#2b2b33"; c.fillRect(ex - 16, ey - 54, 32, 5); c.fillRect(ex - 9, ey - 64, 18, 11); c.fillStyle = "#2b2b33"; c.fillRect(ex - 6, ey - 44, 12, 4); }
      if (this.ph === 0) { c.strokeStyle = "rgba(255,77,109,0.8)"; c.lineWidth = 2; c.setLineDash([8, 8]); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + Math.cos(this.ang) * dir * W, y0 - Math.sin(this.ang) * W); c.stroke(); c.setLineDash([]); }
      c.globalAlpha = this.fadeA(); fillR(c, x0 - 12, y0, 24, 30, 6, "#3ddc84"); buddy(c, x0, y0 - 10, 12, "#f2b48a", dir); c.save(); c.translate(x0, y0 + 4); c.rotate(dir > 0 ? -this.ang : PI + this.ang); fillR(c, 4, -4, 22, 8, 3, "#55555f"); c.restore(); c.globalAlpha = 1;
      this.ghost(W / 2, this.cy, now);
    }
  }), "city");

  /* 48. Héroe saltarín */
  regD("heroe", "Héroe saltarín", "El héroe salta solo. Tocá para que se tire hacia adelante: rompe a los bichos, pero cuidado con los pozos.", "#ffd23f", G("Heroe", {
    init: function () { this.gy = this.H - this.pb - 110; this.x = 80; this.y = this.gy; this.vy = 0; this.da = 0; this.pf = [{ x0: 0, x1: 360 }]; this.nx = 360; this.en = []; this.dd = 80; this.chk = 40; },
    more: function () { while (this.nx < this.x + this.W * 2) { var gap = rnd(40, 90) + Math.min(this.t, 100) * 0.4, len = rnd(140, 300); var x0 = this.nx + gap; this.pf.push({ x0: x0, x1: x0 + len }); if (Math.random() < 0.7) this.en.push({ x: x0 + rnd(40, len - 30), h: 0, vy: 0, big: Math.random() < 0.3 }); this.nx = x0 + len; } },
    ground: function (x) { for (var i = 0; i < this.pf.length; i++) if (x > this.pf[i].x0 - 6 && x < this.pf[i].x1 + 6) return true; return false; },
    act: function () { if (this.da <= 0 && !this.fall) { this.da = 0.13; this.vy = 0; this.acts++; sfx(260, 0.06, "sawtooth", 0.04, 1.6); } },
    step: function (dt) {
      var i; this.more();
      if (this.fall) { this.fall -= dt; this.y += 400 * dt; if (this.fall <= 0) { this.fall = 0; this.x = this.chk; this.y = this.gy - 40; this.vy = 0; } return; }
      if (this.da > 0) { this.da -= dt; this.x += 760 * dt; } else { this.vy += 1500 * dt; this.y += this.vy * dt; }
      if (this.y >= this.gy && this.vy >= 0) { if (this.ground(this.x)) { this.y = this.gy; this.vy = -470; for (i = 0; i < this.pf.length; i++) if (this.x > this.pf[i].x0 && this.x < this.pf[i].x1) this.chk = this.pf[i].x0 + 30; } else if (this.y > this.gy + 30) { this.hurt(); this.fall = 0.5; } }
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; e.vy += 1300 * dt; e.h -= e.vy * dt; if (e.h <= 0) { e.h = 0; e.vy = -rnd(220, 380); } var ey = this.gy - e.h, er = e.big ? 22 : 15; if (!e.dead && Math.abs(e.x - this.x) < er + 14 && Math.abs(ey - er - (this.y - 16)) < er + 16) { if (this.da > 0 || (this.vy > 0 && this.y - 16 < ey - er)) { e.dead = 1; this.good(e.big ? 2 : 1, e.x, ey, false); if (this.da <= 0) this.vy = -420; } else { this.hurt(); this.x -= 40; } } }
      if (this.x > this.dd + 120) { this.dd += 120; this.add(1); }
      var x0 = this.x; k1fil(this.en, function (e) { return e.dead || e.x < x0 - 300; }); k1fil(this.pf, function (p) { return p.x1 < x0 - 400; });
    },
    draw: function (now) {
      var c = this.ctx, i, cam = this.x - this.W * 0.3, gy = this.gy;
      for (i = 0; i < this.pf.length; i++) { var p = this.pf[i]; fillR(c, p.x0 - cam, gy, p.x1 - p.x0, 70, 10, "#3ddc84"); c.fillStyle = "#8a5a2b"; c.fillRect(p.x0 - cam + 6, gy + 18, p.x1 - p.x0 - 12, 52); }
      for (i = 0; i < this.en.length; i++) { var e = this.en[i], er = e.big ? 22 : 15, ey = gy - e.h - er; k1ell(c, e.x - cam, ey, er * 1.1, er, e.big ? "#ff4d6d" : "#c77dff"); face(c, e.x - cam, ey, er * 0.8, -1); }
      var px = this.x - cam; c.globalAlpha = this.fall ? 0.5 : this.fadeA(); fillR(c, px - 15, this.y - 32, 30, 30, 6, "#ffd23f"); face(c, px, this.y - 18, 12, 1); fillR(c, px - 17, this.y - 36, 34, 8, 3, "#9aa1ab"); if (this.da > 0) { c.fillStyle = "#d9dde3"; c.fillRect(px + 14, this.y - 20, 22, 5); } c.globalAlpha = 1;
      this.ghost(this.W * 0.6, this.cy, now);
    }
  }), "sky");
