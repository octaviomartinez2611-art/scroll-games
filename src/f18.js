
  /* ===== 100 copias de juegos conocidos (8/8) ===== */

  /* 86. Pista de autitos */
  regD("slotcar", "Pista de autitos", "Mantené apretado para acelerar y soltá antes de las curvas cerradas. Si entrás muy rápido, el auto se sale.", "#ff4d6d", G("Slotcar", {
    ctl: "hold",
    init: function () { var N = 360, k, cx = this.W / 2, cy = this.cy, rx = this.W * 0.36, ry = (this.H - this.pt - this.pb) * 0.38; this.P = []; for (k = 0; k < N; k++) { var u = k / N * TAU; this.P.push({ x: cx + rx * Math.sin(2 * u) * 0.95, y: cy + ry * Math.sin(u) }); } this.L = [0]; for (k = 1; k <= N; k++) { var a = this.P[k - 1], b = this.P[k % N]; this.L.push(this.L[k - 1] + Math.hypot(b.x - a.x, b.y - a.y)); } this.tot = this.L[N]; this.K = []; for (k = 0; k < N; k++) { var p0 = this.P[(k - 3 + N) % N], p1 = this.P[k], p2 = this.P[(k + 3) % N], a1 = Math.atan2(p1.y - p0.y, p1.x - p0.x), a2 = Math.atan2(p2.y - p1.y, p2.x - p1.x); this.K.push(Math.abs(k3adiff(a2, a1)) / (Math.hypot(p2.x - p0.x, p2.y - p0.y) / 2 + 0.01)); } this.s = 0; this.v = 0; this.fly = 0; this.lt = 9; this.rs = this.tot * 0.5; this.rv = 0; },
    at: function (s) { s = ((s % this.tot) + this.tot) % this.tot; var lo = 0, hi = this.P.length; while (hi - lo > 1) { var m = (lo + hi) >> 1; if (this.L[m] <= s) lo = m; else hi = m; } var a = this.P[lo], b = this.P[(lo + 1) % this.P.length], f = (s - this.L[lo]) / (this.L[lo + 1] - this.L[lo] || 1); return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, a: Math.atan2(b.y - a.y, b.x - a.x), k: this.K[lo] }; },
    safe: function (k) { return Math.min(520, Math.sqrt(1400 / Math.max(k, 0.0001))); },
    step: function (dt) {
      if (this.fly > 0) { this.fly -= dt; this.fx += Math.cos(this.fa) * 200 * dt; this.fy += Math.sin(this.fa) * 200 * dt; if (this.fly <= 0) { this.v = 0; } return; }
      this.v += (this.holding ? 320 : -260) * dt; this.v = clamp(this.v, 0, 520);
      var s0 = this.s; this.s += this.v * dt; var q = this.at(this.s);
      if (this.v > this.safe(q.k) * 1.05) { this.hurt(); this.fly = 0.6; this.fx = q.x; this.fy = q.y; this.fa = q.a; this.s -= 40; return; }
      if (Math.floor(s0 / this.tot) !== Math.floor(this.s / this.tot)) { this.good(this.lt > 3 ? 3 : 2, q.x, q.y, this.lt > 3); this.lt = 9; }
      this.lt -= dt; if (this.lt <= 0) { this.hurt(); this.lt = 9; }
      var rq = this.at(this.rs); this.rv += (Math.min(330, this.safe(this.at(this.rs + 60).k) * 0.9) - this.rv) * Math.min(1, dt * 2); this.rs += this.rv * dt;
    },
    car: function (c, x, y, a, col) { c.save(); c.translate(x, y); c.rotate(a); fillR(c, -15, -8, 30, 16, 5, col); c.fillStyle = "#2b2b33"; c.fillRect(-2, -6, 8, 12); c.restore(); },
    draw: function (now) {
      var c = this.ctx, i, N = this.P.length;
      c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = "#2b2b33"; c.lineWidth = 46; c.beginPath(); for (i = 0; i <= N; i++) { var p = this.P[i % N]; if (i) c.lineTo(p.x, p.y); else c.moveTo(p.x, p.y); } c.stroke();
      for (i = 0; i < N; i += 6) { var p2 = this.P[i]; if (this.K[i] > 0.012) dot(c, p2.x, p2.y, 25, i % 12 ? "#ff4d6d" : "#f2f2f2"); }
      c.strokeStyle = "#55555f"; c.lineWidth = 38; c.beginPath(); for (i = 0; i <= N; i++) { var p3 = this.P[i % N]; if (i) c.lineTo(p3.x, p3.y); else c.moveTo(p3.x, p3.y); } c.stroke();
      c.strokeStyle = "#c0c4cc"; c.lineWidth = 2; c.beginPath(); for (i = 0; i <= N; i++) { var p4 = this.P[i % N]; if (i) c.lineTo(p4.x, p4.y); else c.moveTo(p4.x, p4.y); } c.stroke(); c.lineCap = "butt"; c.lineJoin = "miter";
      var st = this.at(0); c.fillStyle = "#f2f2f2"; c.save(); c.translate(st.x, st.y); c.rotate(st.a); c.fillRect(-2, -19, 4, 38); c.restore();
      var rq = this.at(this.rs); this.car(c, rq.x, rq.y, rq.a, "#3ddc84");
      c.globalAlpha = this.fly > 0 ? 0.5 : this.fadeA(); if (this.fly > 0) this.car(c, this.fx, this.fy, this.fa + (0.6 - this.fly) * 8, "#ff4d6d"); else { var q = this.at(this.s); this.car(c, q.x, q.y, q.a, "#ff4d6d"); } c.globalAlpha = 1;
      fillR(c, 16, this.pt + 2, this.W - 92, 7, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (this.W - 92) * clamp(this.v / 520, 0, 1), 7, 4, "#ff4d6d");
      fillR(c, 16, this.pt + 13, this.W - 92, 5, 3, "rgba(255,255,255,0.12)"); fillR(c, 16, this.pt + 13, (this.W - 92) * clamp(this.lt / 9, 0, 1), 5, 3, "#f2f2f2");
      this.ghostHold(this.W * 0.5, this.H - this.pb - 50, now);
    }
  }), "table");

  /* 87. Bolas de feria */
  regD("skee", "Bolas de feria", "Apretá donde querés tirar y mantené para cargar. Soltá con la fuerza justa: el centro vale más.", "#ff9f1c", G("Skee", {
    ctl: "hold",
    init: function () { this.tx = this.W / 2; this.ty = this.pt + 150; this.y0 = this.H - this.pb - 50; this.round(); this.b = null; this.ch = 0; this.pw = 0; this.ax = this.W / 2; },
    round: function () { this.balls = 9; this.pts = 0; this.goal = 12; },
    press: function (x) { if (!this.b && this.balls > 0) { this.ch = 1; this.pw = 0; this.ax = clamp(x, 40, this.W - 40); this.acts++; } },
    release: function () { if (this.ch) { this.ch = 0; var p = 0.5 - 0.5 * Math.cos(this.pw * 2.8); this.b = { x0: this.ax, k: 0, ly: this.y0 - 40 - p * (this.y0 - this.ty + 30), lx: this.ax + (this.ax - this.W / 2) * -0.1 }; this.balls--; sfx(200, 0.2, "sine", 0.04, 1.5); } },
    step: function (dt) {
      if (this.ch) this.pw += dt;
      if (this.b) { this.b.k += dt / 0.8; if (this.b.k >= 1) { var d = Math.hypot(this.b.lx - this.tx, this.b.ly - this.ty), n = 0; if (this.b.ly < this.ty - 60 && Math.abs(this.b.lx - this.W / 2) > this.W * 0.22) n = 4; else if (d < 18) n = 3; else if (d < 44) n = 2; else if (d < 70) n = 1; if (n >= 3) this.good(n, this.b.lx, this.b.ly, true); else if (n) this.add(n); this.pts += n; this.b = null; if (this.balls <= 0) { if (this.pts < this.goal) this.hurt(); else this.good(2, this.W / 2, this.cy, true); this.goal = Math.min(22, this.goal + (this.pts >= this.goal ? 2 : 0)); this.round(); } } }
    },
    draw: function (now) {
      var c = this.ctx, W = this.W, tx = this.tx, ty = this.ty;
      poly(c, [W * 0.25, this.y0 + 30, W * 0.75, this.y0 + 30, W * 0.62, ty + 90, W * 0.38, ty + 90], "#c98a4a"); c.fillStyle = "#8a5a2b"; for (var i = 1; i < 6; i++) { var yy = ty + 90 + (this.y0 + 30 - ty - 90) * i / 6; c.fillRect(W * 0.3, yy, W * 0.4, 2); }
      fillR(c, W * 0.12, ty - 110, W * 0.76, 220, 16, "#55555f"); dot(c, tx, ty, 70, "#ff9f1c"); dot(c, tx, ty, 58, "#2b2b33"); dot(c, tx, ty, 44, "#ffd23f"); dot(c, tx, ty, 32, "#2b2b33"); dot(c, tx, ty, 18, "#ff4d6d"); dot(c, tx, ty, 10, "#2b2b33"); dot(c, W * 0.2, ty - 80, 14, "#ff5fd2"); dot(c, W * 0.2, ty - 80, 8, "#2b2b33"); dot(c, W * 0.8, ty - 80, 14, "#ff5fd2"); dot(c, W * 0.8, ty - 80, 8, "#2b2b33");
      if (this.b) { var k = this.b.k, x = this.b.x0 + (this.b.lx - this.b.x0) * k, y = this.y0 + (this.b.ly - this.y0) * k - Math.sin(Math.max(0, k - 0.6) / 0.4 * PI) * 40 * (k > 0.6 ? 1 : 0), r = 14 - 6 * k; dot(c, x, y, r, "#f2f2f2"); }
      else if (this.balls > 0) dot(c, this.ch ? this.ax : W / 2, this.y0, 14, "#f2f2f2");
      if (this.ch) { var p = 0.5 - 0.5 * Math.cos(this.pw * 2.8); fillR(c, 16, this.pt + 2, W - 92, 8, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (W - 92) * p, 8, 4, "#ff9f1c"); }
      for (i = 0; i < this.balls; i++) dot(c, 20 + i * 14, this.H - this.pb - 14, 5, "#f2f2f2");
      fillR(c, W - 80, this.H - this.pb - 22, 56, 10, 5, "rgba(255,255,255,0.15)"); fillR(c, W - 80, this.H - this.pb - 22, 56 * clamp(this.pts / this.goal, 0, 1), 10, 5, "#3ddc84");
      this.ghostHold(W * 0.5, this.y0 - 30, now);
    }
  }), "arcade");

  /* 88. Sapito */
  regD("sapito", "Sapito", "Tocá para tirar la piedra. Después tocá justo cada vez que toca el agua para que rebote de nuevo.", "#9aa1ab", G("Sapito", {
    init: function () { this.wy = this.cy + 80; this.start(); },
    start: function () { this.ph = 0; this.st = { x: 60, y: this.wy - 60, vx: 0, vy: 0 }; this.n = 0; this.tapT = -1; this.wait = 0; this.cam = 0; this.spl = []; },
    act: function () { this.acts++; if (this.ph === 0) { this.ph = 1; this.st.vx = 420; this.st.vy = -260; sfx(300, 0.06, "sine", 0.05, 1.5); return; } if (this.ph === 1) this.tapT = this.t; },
    step: function (dt) {
      var s = this.st, i;
      if (this.ph === 1) { var y0 = s.y; s.vy += 900 * dt; s.x += s.vx * dt; s.y += s.vy * dt; this.cam = Math.max(0, s.x - this.W * 0.35);
        if (y0 < this.wy && s.y >= this.wy) { var ok = this.tapT > 0 && this.t - this.tapT < 0.1; if (!ok) { this.pend = this.t; } else this.skip(); }
        if (this.pend && s.y >= this.wy) { if (this.tapT > this.pend && this.tapT - this.pend < 0.07) { this.pend = 0; this.skip(); } else if (this.t - this.pend > 0.07) { this.pend = 0; this.ph = 2; this.wait = 1; this.spl.push({ x: s.x, t: 0.6 }); if (this.n < 2) this.hurt(); else this.good(1, this.W / 2, this.cy, false); } }
      }
      else if (this.ph === 2) { s.y += 60 * dt; this.wait -= dt; if (this.wait <= 0) this.start(); }
      for (i = 0; i < this.spl.length; i++) this.spl[i].t -= dt; k1fil(this.spl, function (p) { return p.t <= 0; });
    },
    skip: function () { var s = this.st; s.y = this.wy - 1; s.vy = -Math.abs(s.vy) * 0.78; s.vx *= 0.93; this.n++; this.add(1); this.tapT = -1; this.spl.push({ x: s.x, t: 0.4 }); sfx(500 + this.n * 40, 0.05, "triangle", 0.05, 1.3); if (Math.abs(s.vy) < 90) s.vy = -90; },
    draw: function (now) {
      var c = this.ctx, i, cam = this.cam, wy = this.wy;
      c.fillStyle = "#2c8aa0"; c.fillRect(0, wy, this.W, this.H - wy); c.fillStyle = "rgba(255,255,255,0.25)"; for (i = 0; i < 8; i++) { var x = ((i * 90 - cam * 0.6) % (this.W + 90) + this.W + 90) % (this.W + 90) - 45; c.fillRect(x, wy + 18 + (i % 3) * 30, 40, 3); }
      c.fillStyle = "#8a6a4a"; c.fillRect(-cam - 20, wy - 10, 100, 40);
      for (i = 0; i < this.spl.length; i++) { var p = this.spl[i]; c.strokeStyle = "rgba(255,255,255,0.7)"; c.lineWidth = 2; c.beginPath(); c.ellipse(p.x - cam, wy + 2, 30 * (1 - p.t), 6 * (1 - p.t), 0, 0, TAU); c.stroke(); }
      if (this.ph === 0) { buddy(c, 40, wy - 40, 14, "#f2b48a", 1); fillR(c, 30, wy - 26, 20, 26, 6, "#ff9f1c"); }
      var s = this.st; k1ell(c, s.x - cam, s.y, 10, 5, "#9aa1ab"); k1ell(c, s.x - cam - 2, s.y - 1, 5, 2, "#c0c4cc");
      if (this.ph === 1) { var tl = (wy - s.y); if (s.vy > 0 && tl < 60) { c.fillStyle = "rgba(255,210,63,0.4)"; c.fillRect(s.x - cam - 20, wy - 3, 40, 6); } }
      for (i = 0; i < this.n; i++) dot(c, 20 + i * 12, this.pt + 20, 4, "#f2f2f2");
      this.ghost(this.W * 0.6, this.cy, now);
    }
  }), "beach");

  /* 89. Territorio */
  regD("territorio", "Territorio", "Tocá del lado al que querés doblar. Salí de tu zona y volvé para agrandarla. Que nadie toque tu línea.", "#ff5fd2", G("Territorio", {
    init: function () { this.cs = 14; this.C = Math.floor((this.W - 8) / this.cs); this.R = Math.floor((this.H - this.pt - this.pb - 8) / this.cs); this.ox = (this.W - this.C * this.cs) / 2; this.oy = this.pt + 4; this.lvl = 0; this.board(); },
    board: function () { this.g = new Uint8Array(this.C * this.R); this.tr = new Uint8Array(this.C * this.R); this.bots = []; this.me = this.mk(1, Math.floor(this.C / 2), this.R - 6); this.bots.push(this.mk(2, 5, 5)); this.bots.push(this.mk(3, this.C - 6, Math.floor(this.R / 2))); this.acc = 0; this.wantD = null; },
    mk: function (id, c, r) { for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) this.g[(r + dy) * this.C + c + dx] = id; return { id: id, c: c, r: r, d: [0, -1], trail: [], st: 0, n: 0, hc: c, hr: r }; },
    act: function (x, y) { var b = this.me, hx = this.ox + (b.c + 0.5) * this.cs, hy = this.oy + (b.r + 0.5) * this.cs; this.wantD = b.d[0] ? [0, y < hy ? -1 : 1] : [x < hx ? -1 : 1, 0]; this.acts++; },
    die: function (b) { for (var i = 0; i < b.trail.length; i++) this.tr[b.trail[i]] = 0; b.trail = []; if (b.id === 1) { this.hurt(); var k; for (k = 0; k < this.g.length; k++) if (this.g[k] === 1) { b.c = k % this.C; b.r = Math.floor(k / this.C); } b.d = [0, -1]; } else { for (var k2 = 0; k2 < this.g.length; k2++) if (this.g[k2] === b.id) this.g[k2] = 0; this.good(3, this.ox + b.c * this.cs, this.oy + b.r * this.cs, true); var nb = this.mk(b.id, b.id === 2 ? 5 : this.C - 6, b.id === 2 ? 5 : Math.floor(this.R / 2)); this.bots[this.bots.indexOf(b)] = nb; } },
    claim: function (b) { var C = this.C, k, i, n0 = 0; for (i = 0; i < b.trail.length; i++) { this.g[b.trail[i]] = b.id; this.tr[b.trail[i]] = 0; } b.trail = []; var seen = new Uint8Array(this.g.length), st = []; for (k = 0; k < this.g.length; k++) { var c = k % C, r = Math.floor(k / C); if ((c === 0 || r === 0 || c === C - 1 || r === this.R - 1) && this.g[k] !== b.id) { seen[k] = 1; st.push(k); } } while (st.length) { k = st.pop(); var cc = k % C, nb = [cc > 0 ? k - 1 : -1, cc < C - 1 ? k + 1 : -1, k - C, k + C]; for (i = 0; i < 4; i++) { var q = nb[i]; if (q >= 0 && q < this.g.length && !seen[q] && this.g[q] !== b.id) { seen[q] = 1; st.push(q); } } } for (k = 0; k < this.g.length; k++) if (!seen[k] && this.g[k] !== b.id) { this.g[k] = b.id; n0++; } return n0; },
    move: function (b) { var nc = b.c + b.d[0], nr = b.r + b.d[1]; if (nc < 0 || nr < 0 || nc >= this.C || nr >= this.R) { this.die(b); return; } var k = nr * this.C + nc, t = this.tr[k]; if (t) { if (t === b.id) { this.die(b); return; } var vic = t === 1 ? this.me : this.bots.filter(function (q) { return q.id === t; })[0]; if (vic) this.die(vic); if (b.id === 1 && t !== 1) { } } b.c = nc; b.r = nr; if (this.g[k] !== b.id) { this.tr[k] = b.id; b.trail.push(k); } else if (b.trail.length) { var got = this.claim(b) + 0; if (b.id === 1) { this.add(Math.max(1, Math.round((got + 4) / 12))); var mine = 0; for (var q = 0; q < this.g.length; q++) if (this.g[q] === 1) mine++; if (mine / this.g.length > 0.45) { this.lvl++; this.good(5, this.W / 2, this.cy, true); this.board(); } } } },
    brain: function (b) { b.n--; var home = this.g[b.r * this.C + b.c] === b.id; if (b.st === 0 && home && b.n <= 0) { b.st = 1; b.n = ri(3, 8); b.d = pickOf([[1, 0], [-1, 0], [0, 1], [0, -1]]); } else if (b.st === 1 && b.n <= 0) { b.st = 2; b.n = ri(3, 7); b.d = Math.random() < 0.5 ? [b.d[1], -b.d[0]] : [-b.d[1], b.d[0]]; } else if (b.st === 2 && b.n <= 0) { b.st = 3; } if (b.st === 3) { var dx = b.hc - b.c, dy = b.hr - b.r, nd = Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy) || 1]; if (nd[0] !== -b.d[0] || nd[1] !== -b.d[1]) b.d = nd; if (home) { b.st = 0; b.n = ri(2, 6); } } var nc = b.c + b.d[0], nr = b.r + b.d[1]; if (nc < 0 || nr < 0 || nc >= this.C || nr >= this.R || this.tr[nr * this.C + nc] === b.id) b.d = [b.d[1], -b.d[0]]; },
    step: function (dt) { this.acc += dt * (8 + Math.min(this.t, 90) * 0.03); while (this.acc >= 1) { this.acc -= 1; if (this.wantD) { this.me.d = this.wantD; this.wantD = null; } this.move(this.me); for (var i = 0; i < this.bots.length; i++) { this.brain(this.bots[i]); this.move(this.bots[i]); } } },
    draw: function (now) {
      var c = this.ctx, k, cs = this.cs, cols = [null, "#ff5fd2", "#3ddc84", "#ffd23f"], tcol = [null, "#ffb3e6", "#a8f0c6", "#fff0a8"];
      c.fillStyle = "rgba(255,255,255,0.06)"; c.fillRect(this.ox, this.oy, this.C * cs, this.R * cs);
      for (k = 0; k < this.g.length; k++) { var x = this.ox + (k % this.C) * cs, y = this.oy + Math.floor(k / this.C) * cs; if (this.g[k]) { c.fillStyle = cols[this.g[k]]; c.fillRect(x, y, cs + 0.5, cs + 0.5); } if (this.tr[k]) { c.fillStyle = tcol[this.tr[k]]; c.fillRect(x + 2, y + 2, cs - 4, cs - 4); } }
      var all = [this.me].concat(this.bots); for (k = 0; k < all.length; k++) { var b = all[k], bx = this.ox + (b.c + 0.5) * cs, by = this.oy + (b.r + 0.5) * cs; c.globalAlpha = b.id === 1 ? this.fadeA() : 1; fillR(c, bx - 9, by - 9, 18, 18, 5, "#2b2b33"); fillR(c, bx - 7, by - 7, 14, 14, 4, cols[b.id]); c.globalAlpha = 1; }
      this.ghost(this.ox + this.me.c * cs + 60, this.oy + this.me.r * cs, now);
    }
  }), "arcade");

  /* 90. Subibaja */
  regD("subibaja", "Subibaja", "Arrastrá el subibaja para que el payaso que cae aterrice en la punta de arriba. Así sale volando el otro a reventar globos.", "#ff5fd2", G("Subibaja", {
    ctl: "drag",
    init: function () { this.gy = this.H - this.pb - 50; this.sx = this.W / 2; this.tx = this.sx; this.dn = -1; this.fly = { x: this.W / 2 + 50, y: this.pt + 120, vx: 0, vy: 0 }; this.rows = []; for (var r = 0; r < 3; r++) { var row = { y: this.pt + 40 + r * 34, off: 0, v: (r % 2 ? -1 : 1) * (40 + r * 15), b: [] }; for (var k = 0; k < 10; k++) row.b.push(1); this.rows.push(row); } },
    drag: function (x) { this.tx = x; },
    step: function (dt) {
      var i, f = this.fly; this.sx += (this.tx - this.sx) * Math.min(1, dt * 12); this.sx = clamp(this.sx, 60, this.W - 60);
      for (i = 0; i < this.rows.length; i++) { var rw = this.rows[i]; rw.off = (rw.off + rw.v * dt + this.W) % this.W; }
      f.vy += 420 * dt; f.x += f.vx * dt; f.y += f.vy * dt; if (f.x < 14 || f.x > this.W - 14) { f.vx = -f.vx; f.x = clamp(f.x, 14, this.W - 14); } if (f.y < this.pt + 20) { f.y = this.pt + 20; f.vy = Math.abs(f.vy); }
      for (i = 0; i < this.rows.length; i++) { var row = this.rows[i]; if (Math.abs(f.y - row.y) < 16) for (var k = 0; k < row.b.length; k++) { if (!row.b[k]) continue; var bx = (row.off + k * this.W / 10) % this.W; if (Math.abs(bx - f.x) < 18) { row.b[k] = 0; this.add(1); if (f.vy < 0) f.vy *= 0.85; } } if (row.b.every(function (v) { return !v; })) { this.good(3, this.W / 2, row.y, true); for (k = 0; k < row.b.length; k++) row.b[k] = 1; } }
      var upX = this.sx - this.dn * 50, upY = this.gy - 40;
      if (f.vy > 0 && f.y > upY - 10) { if (Math.abs(f.x - upX) < 26) { this.dn = -this.dn; var nx = this.sx - this.dn * 50; this.fly = { x: nx, y: this.gy - 40, vx: rnd(-50, 50), vy: -Math.min(720, 520 + Math.min(this.t, 120) * 1.5) }; sfx(300, 0.08, "triangle", 0.05, 1.6); } else if (f.y > this.gy) { this.hurt(); this.fly = { x: this.sx - this.dn * 50 + rnd(-80, 80), y: this.pt + 120, vx: rnd(-30, 30), vy: 0 }; } }
    },
    draw: function (now) {
      var c = this.ctx, i, k, gy = this.gy, sx = this.sx, cols = ["#ff4d6d", "#ffd23f", "#3ddc84"];
      for (i = 0; i < this.rows.length; i++) { var row = this.rows[i]; for (k = 0; k < row.b.length; k++) if (row.b[k]) spBalloon(c, (row.off + k * this.W / 10) % this.W, row.y, 11, cols[i]); }
      c.fillStyle = "#c98a4a"; c.fillRect(0, gy, this.W, this.H - gy);
      poly(c, [sx - 14, gy, sx + 14, gy, sx, gy - 24], "#9aa1ab"); var a = this.dn * 0.32; c.save(); c.translate(sx, gy - 24); c.rotate(-a); fillR(c, -60, -5, 120, 10, 4, "#ff4d6d"); c.restore();
      var lowX = sx + this.dn * 50, lowY = gy - 24 + Math.sin(a) * 50 * this.dn * this.dn; buddy(c, lowX, lowY - 30, 13, "#ff9f1c"); fillR(c, lowX - 10, lowY - 20, 20, 18, 5, "#c77dff");
      var f = this.fly; c.globalAlpha = this.fadeA(); fillR(c, f.x - 10, f.y - 4, 20, 18, 5, "#3ddc84"); buddy(c, f.x, f.y - 14, 13, "#ffd23f"); poly(c, [f.x - 8, f.y - 24, f.x, f.y - 42, f.x + 8, f.y - 24], "#ff5fd2"); c.globalAlpha = 1;
      this.ghostDrag(gy - 70, now);
    }
  }), "circus");

  /* 91. Submarino */
  regD("submarino", "Submarino", "Tocá donde querés ir. Dispara solo. Rescatá buzos y subí a respirar antes de que se acabe el aire.", "#ffd23f", G("Submarino", {
    init: function () { this.sy0 = this.pt + 60; this.x = this.W / 2; this.y = this.sy0 + 10; this.tx = this.x; this.ty = this.y; this.f = 1; this.o2 = 1; this.dv = 0; this.en = []; this.bu = []; this.ne = 1; this.ft = 0; },
    act: function (x, y) { this.tx = x; this.ty = clamp(y, this.sy0, this.H - this.pb - 30); this.acts++; },
    step: function (dt) {
      var i, j, dx = this.tx - this.x, dy = this.ty - this.y, d = Math.hypot(dx, dy); if (d > 2) { this.x += dx / d * Math.min(d, 140 * dt); this.y += dy / d * Math.min(d, 140 * dt); if (Math.abs(dx) > 4) this.f = dx > 0 ? 1 : -1; }
      var surf = this.y < this.sy0 + 14; if (surf) { if (this.o2 < 0.98 && this.dv > 0) { this.good(this.dv, this.x, this.y, this.dv >= 4); this.dv = 0; } this.o2 = Math.min(1, this.o2 + dt * 0.8); } else { this.o2 -= dt * 0.055; if (this.o2 <= 0) { this.hurt(); this.o2 = 1; this.y = this.sy0; this.ty = this.y; } }
      this.ft -= dt; if (this.ft <= 0 && !surf) { this.ft = 0.55; this.bu.push({ x: this.x + this.f * 24, y: this.y + 4, v: this.f * 400 }); }
      this.ne -= dt; if (this.ne <= 0) { this.ne = Math.max(0.5, 1.3 - this.t * 0.007) * rnd(0.7, 1.3); var L = Math.random() < 0.5, lane = this.sy0 + 70 + ri(0, 5) * ((this.H - this.pb - this.sy0 - 110) / 5); this.en.push({ x: L ? -30 : this.W + 30, y: lane, v: (L ? 1 : -1) * rnd(60, 120), k: Math.random() < 0.3 ? "dv" : "sh" }); }
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; e.x += e.v * dt; if (e.x < -60 || e.x > this.W + 60) e.gone = 1; if (Math.abs(e.x - this.x) < 30 && Math.abs(e.y - this.y) < 18) { e.gone = 1; if (e.k === "dv") { if (this.dv < 6) { this.dv++; sfx(700, 0.05, "triangle", 0.04, 1.3); } } else this.hurt(); } }
      for (i = 0; i < this.bu.length; i++) { var b = this.bu[i]; b.x += b.v * dt; if (b.x < -20 || b.x > this.W + 20) b.gone = 1; for (j = 0; j < this.en.length; j++) { var q = this.en[j]; if (!q.gone && q.k === "sh" && Math.abs(q.x - b.x) < 22 && Math.abs(q.y - b.y) < 14) { q.gone = 1; b.gone = 1; this.add(1); break; } } }
      k1fil(this.en, function (e) { return e.gone; }); k1fil(this.bu, function (b) { return b.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, W = this.W;
      c.fillStyle = "rgba(120,200,230,0.25)"; c.fillRect(0, this.pt, W, this.sy0 - this.pt); c.fillStyle = "#f2f2f2"; c.fillRect(0, this.sy0 - 2, W, 3);
      for (i = 0; i < this.en.length; i++) { var e = this.en[i], f = e.v > 0 ? 1 : -1; if (e.k === "sh") { k1ell(c, e.x, e.y, 26, 11, "#9aa1ab"); poly(c, [e.x - 4 * f, e.y - 8, e.x - 10 * f, e.y - 22, e.x + 8 * f, e.y - 8], "#9aa1ab"); poly(c, [e.x - 22 * f, e.y, e.x - 36 * f, e.y - 10, e.x - 36 * f, e.y + 10], "#9aa1ab"); dot(c, e.x + 16 * f, e.y - 3, 2.5, "#2b2b33"); } else { buddy(c, e.x, e.y, 10, "#f2b48a", f); c.fillStyle = "#2b2b33"; c.fillRect(e.x - 20 * f, e.y - 3, 14 * f, 6); } }
      for (i = 0; i < this.bu.length; i++) fillR(c, this.bu[i].x - 6, this.bu[i].y - 2, 12, 4, 2, "#fff3b0");
      c.globalAlpha = this.fadeA(); k1ell(c, this.x, this.y, 28, 13, "#ffd23f"); fillR(c, this.x - 8, this.y - 22, 16, 12, 4, "#ffd23f"); dot(c, this.x + this.f * 12, this.y - 2, 5, "#9ad0e0"); dot(c, this.x - this.f * 30, this.y, 6, "#c99a00"); c.globalAlpha = 1;
      for (i = 0; i < this.dv; i++) buddy(c, 20 + i * 18, this.H - this.pb - 16, 6, "#f2b48a");
      fillR(c, 16, this.pt + 2, W - 92, 8, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (W - 92) * clamp(this.o2, 0, 1), 8, 4, this.o2 < 0.25 ? "#ff4d6d" : "#f2f2f2");
      this.ghost(this.x + 70, this.y + 60, now);
    }
  }), "sea");

  /* 92. Frená el tren */
  regD("tren", "Frená el tren", "Mantené apretado para frenar. Soltá para seguir andando. Pará justo con la trompa en la línea amarilla.", "#3ddc84", G("Tren", {
    ctl: "hold",
    init: function () { this.gy = this.H - this.pb - 120; this.next(true); },
    next: function (first) { this.x = 0; this.v = rnd(260, 360) + Math.min(this.t, 120) * 0.8; this.stop = rnd(1300, 2100); this.ph = 0; this.wait = 0; this.res = 0; },
    step: function (dt) {
      if (this.ph === 1) { this.wait -= dt; if (this.wait <= 0) this.next(); return; }
      this.v -= (this.holding ? 300 : 12) * dt; if (this.v <= 0) { this.v = 0; this.ph = 1; this.wait = 1.1; var e = Math.abs(this.x - this.stop); if (e < 8) this.good(3, this.W / 2, this.cy, true); else if (e < 25) this.good(2, this.W / 2, this.cy, false); else if (e < 60) this.add(1); else this.hurt(); }
      this.x += this.v * dt; if (this.x > this.stop + 260) { this.ph = 1; this.wait = 1; this.hurt(); }
    },
    draw: function (now) {
      var c = this.ctx, W = this.W, gy = this.gy, front = W * 0.62, cam = this.x - front, i;
      c.fillStyle = "#6b5a48"; c.fillRect(0, gy + 10, W, this.H - gy); c.fillStyle = "#8a6a4a"; for (var x = -((cam % 40) + 40) % 40; x < W; x += 40) c.fillRect(x, gy + 14, 22, 8); c.fillStyle = "#c0c4cc"; c.fillRect(0, gy + 10, W, 4);
      var px = this.stop - cam; fillR(c, px - 380, gy - 10, 440, 20, 3, "#c8c3b6"); c.fillStyle = "#ffd23f"; c.fillRect(px - 2, gy - 30, 4, 40); fillR(c, px - 250, gy - 150, 10, 140, 3, "#9aa1ab"); fillR(c, px - 300, gy - 170, 220, 24, 5, "#ff4d6d"); buddy(c, px + 30, gy - 30, 10, "#f2b48a", -1);
      for (i = 0; i < 3; i++) { var bx = front - 20 - i * 130; fillR(c, bx - 110, gy - 70, 112, 66, 10, i ? "#3ddc84" : "#ff9f1c"); for (var w = 0; w < 3; w++) { c.fillStyle = "#fff3b0"; c.fillRect(bx - 100 + w * 34, gy - 58, 24, 22); } dot(c, bx - 90, gy - 2, 9, "#2b2b33"); dot(c, bx - 20, gy - 2, 9, "#2b2b33"); }
      fillR(c, front - 30, gy - 70, 30, 66, 12, "#ff9f1c"); dot(c, front - 8, gy - 20, 5, "#fff3b0");
      fillR(c, 16, this.pt + 2, W - 92, 7, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (W - 92) * clamp(this.v / 450, 0, 1), 7, 4, "#3ddc84");
      this.ghostHold(W * 0.5, this.cy, now);
    }
  }), "city");

  /* 93. Arpón */
  regD("arpon", "Arpón", "Arrastrá para moverte y soltá para tirar el arpón para arriba. Partí las pelotas hasta romperlas todas.", "#ff4d6d", G("Arpon", {
    ctl: "drag",
    init: function () { this.fy = this.H - this.pb - 40; this.px = this.W / 2; this.tx = this.px; this.hp = null; this.lvl = 0; this.mk(); },
    mk: function () { this.bl = []; for (var k = 0; k <= Math.min(2, this.lvl); k++) this.bl.push({ x: 60 + k * 120, y: this.pt + 120, r: 30, vx: pickOf([-1, 1]) * 80, vy: 0 }); },
    drag: function (x) { this.tx = x; },
    release: function () { if (!this.hp) { this.hp = { x: this.px, top: this.fy }; this.acts++; sfx(500, 0.06, "sawtooth", 0.03, 1.8); } },
    step: function (dt) {
      var i; this.px += clamp(this.tx - this.px, -260 * dt, 260 * dt); this.px = clamp(this.px, 16, this.W - 16);
      if (this.hp) { this.hp.top -= 650 * dt; if (this.hp.top < this.pt) this.hp = null; }
      for (i = 0; i < this.bl.length; i++) { var b = this.bl[i]; b.vy += 600 * dt; b.x += b.vx * dt; b.y += b.vy * dt; if (b.y + b.r > this.fy) { b.y = this.fy - b.r; b.vy = -Math.sqrt(2 * 600 * (120 + b.r * 7)); } if (b.x < b.r || b.x > this.W - b.r) { b.vx = -b.vx; b.x = clamp(b.x, b.r, this.W - b.r); }
        if (this.hp && Math.abs(b.x - this.hp.x) < b.r && b.y + b.r > this.hp.top) { b.dead = 1; this.hp = null; this.add(1); if (b.r > 10) { this.bl.push({ x: b.x - 4, y: b.y, r: b.r * 0.62, vx: -90, vy: -260 }); this.bl.push({ x: b.x + 4, y: b.y, r: b.r * 0.62, vx: 90, vy: -260 }); } }
        if (!b.dead && Math.abs(b.x - this.px) < b.r + 10 && b.y + b.r > this.fy - 34) { this.hurt(); b.vx = (b.x < this.px ? -1 : 1) * Math.abs(b.vx); b.vy = -400; } }
      k1fil(this.bl, function (b) { return b.dead; });
      if (!this.bl.length) { this.good(3, this.W / 2, this.cy, true); this.lvl++; this.mk(); }
    },
    draw: function (now) {
      var c = this.ctx, i, cols = ["#ff4d6d", "#3ddc84", "#ffd23f"];
      c.fillStyle = "#c98a4a"; c.fillRect(0, this.fy, this.W, this.H - this.fy);
      if (this.hp) { c.strokeStyle = "#d9dde3"; c.lineWidth = 2; c.beginPath(); for (var y = this.fy; y > this.hp.top; y -= 8) c.lineTo(this.hp.x + ((y / 8) % 2 ? 3 : -3), y); c.stroke(); poly(c, [this.hp.x - 7, this.hp.top + 10, this.hp.x, this.hp.top - 6, this.hp.x + 7, this.hp.top + 10], "#d9dde3"); }
      for (i = 0; i < this.bl.length; i++) { var b = this.bl[i]; dot(c, b.x, b.y, b.r, cols[Math.round(b.r) % 3]); dot(c, b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, "rgba(255,255,255,0.55)"); }
      c.globalAlpha = this.fadeA(); fillR(c, this.px - 11, this.fy - 30, 22, 30, 7, "#c77dff"); buddy(c, this.px, this.fy - 38, 11, "#f2b48a"); c.globalAlpha = 1;
      this.ghostDrag(this.fy - 80, now);
    }
  }), "beach");

  /* 94. Agujero en la pared */
  regD("pared", "Agujero en la pared", "Arrastrá a los costados para pararte justo donde está el agujero de la pared que viene.", "#c77dff", G("Pared", {
    ctl: "drag",
    init: function () { this.px = 0; this.tx = 0; this.wl = []; this.nw = 0.8; this.gy = this.H - this.pb - 70; this.hy = this.pt + 120; },
    drag: function (x) { this.tx = clamp((x / this.W - 0.5) * 2.2, -0.85, 0.85); },
    step: function (dt) {
      var i, v = 0.48 + Math.min(this.t, 120) * 0.004; this.px += (this.tx - this.px) * Math.min(1, dt * 10);
      this.nw -= dt; if (this.nw <= 0) { this.nw = Math.max(0.95, 1.9 - this.t * 0.01); var w = Math.max(0.3, 0.5 - this.t * 0.0015); this.wl.push({ z: 1, hx: rnd(-0.85 + w / 2, 0.85 - w / 2), w: w, col: pickOf(["#c77dff", "#ff4d6d", "#3ddc84", "#ff9f1c"]) }); }
      for (i = 0; i < this.wl.length; i++) { var q = this.wl[i], z0 = q.z; q.z -= v * dt; if (z0 > 0.06 && q.z <= 0.06 && !q.done) { q.done = 1; var e = Math.abs(this.px - q.hx); if (e < q.w / 2 - 0.1) this.good(e < 0.05 ? 2 : 1, this.W / 2, this.gy - 80, e < 0.05); else { q.hit = 1; this.hurt(); } } if (q.z < -0.15) q.gone = 1; }
      k1fil(this.wl, function (q) { return q.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, W = this.W, gy = this.gy, hy = this.hy;
      poly(c, [W * 0.4, hy, W * 0.6, hy, W, gy + 40, 0, gy + 40], "#8a6a4a");
      var pw = W * 0.45, px = W / 2 + this.px * pw;
      for (i = this.wl.length - 1; i >= 0; i--) { var q = this.wl[i]; if (q.z < 0.06 && !q.hit) continue; var s = 0.15 + 0.85 * (1 - q.z), cy = hy + (gy - hy) * (1 - q.z), ww = W * 1.1 * s, hh = 210 * s, cx = W / 2, hx = cx + q.hx * pw * s, hw = q.w * pw * s; c.fillStyle = q.hit ? "#a3203c" : q.col; c.fillRect(cx - ww / 2, cy - hh, hx - hw / 2 - (cx - ww / 2), hh); c.fillRect(hx + hw / 2, cy - hh, cx + ww / 2 - hx - hw / 2, hh); c.fillRect(hx - hw / 2, cy - hh, hw, hh * 0.08); }
      c.globalAlpha = this.fadeA(); fillR(c, px - 16, gy - 70, 32, 46, 8, "#ffd23f"); c.strokeStyle = "#2b2b33"; c.lineWidth = 6; c.beginPath(); c.moveTo(px - 7, gy - 26); c.lineTo(px - 9, gy); c.moveTo(px + 7, gy - 26); c.lineTo(px + 9, gy); c.stroke(); buddy(c, px, gy - 84, 15, "#f2b48a"); c.globalAlpha = 1;
      this.ghostDrag(gy + 20, now);
    }
  }), "circus");

  /* 95. Sortija */
  regD("sortija", "Sortija", "La calesita gira. Tocá justo cuando pasás debajo de la sortija para sacarla.", "#ffd23f", G("Sortija", {
    init: function () { this.ox = this.W / 2; this.oy = this.cy + 60; this.R = this.W * 0.38; this.gotRev = false; },
    act: function () { this.acts++; this.trying = 0.15; var p = this.hp(), ry = this.ry; if (Math.abs(p.x - this.ox) < 16 && Math.abs(p.y - 50 - ry) < 18 && p.front) { this.good(3, this.ox, ry, true); this.miss = 0; this.gotRev = true; sfx(800, 0.1, "triangle", 0.05, 1.3); } },
    hp: function () { var a = this.ang; return { x: this.ox + Math.sin(a) * this.R, y: this.oy + Math.cos(a) * 26 - Math.sin(a * 3 + 1) * 16, front: Math.cos(a) > 0, sc: 0.75 + 0.25 * Math.cos(a) }; },
    step: function (dt) {
      var sp = 1.1 + Math.min(this.t, 120) * 0.006, a0 = this.ang || 0; this.ang = a0 + sp * dt; this.trying -= dt; this.rgT -= dt;
      this.jig = (this.jig || 0) - dt; if (this.jig <= 0) { this.jig = rnd(0.3, 0.8); this.rt = rnd(-20, 20); } this.ry0 = this.ry0 || this.oy - 90; this.ryo = (this.ryo || 0) + ((this.rt || 0) - (this.ryo || 0)) * Math.min(1, dt * 4); this.ry = this.oy - 40 + this.ryo;
      if (Math.floor((a0 + PI) / TAU) !== Math.floor((this.ang + PI) / TAU)) { if (!this.gotRev) { this.miss = (this.miss || 0) + 1; if (this.miss >= 3) { this.miss = 0; this.hurt(); } } this.gotRev = false; }
    },
    draw: function (now) {
      var c = this.ctx, W = this.W, ox = this.ox, oy = this.oy, R = this.R, i;
      poly(c, [ox - R - 20, oy - 150, ox, oy - 210, ox + R + 20, oy - 150], "#ff4d6d"); for (i = 0; i < 6; i++) { c.fillStyle = i % 2 ? "#f2f2f2" : "#ff4d6d"; c.fillRect(ox - R - 20 + i * (2 * R + 40) / 6, oy - 150, (2 * R + 40) / 6, 16); }
      fillR(c, ox - 6, oy - 150, 12, 180, 4, "#ffd23f"); k1ell(c, ox, oy + 40, R + 24, 30, "#8a5a2b"); k1ell(c, ox, oy + 34, R + 20, 26, "#c98a4a");
      var p = this.hp(); var draw = function (back) { if (back !== !p.front) return; c.fillStyle = "#d9dde3"; c.fillRect(p.x - 2, oy - 150, 4, p.y - oy + 150 - 30); fillR(c, p.x - 22 * p.sc, p.y - 20 * p.sc, 44 * p.sc, 26 * p.sc, 10, "#f2f2f2"); dot(c, p.x + 20 * p.sc, p.y - 22 * p.sc, 10 * p.sc, "#f2f2f2"); buddy(c, p.x, p.y - 36 * p.sc, 11 * p.sc, "#f2b48a"); };
      draw(true);
      var ry = this.ry || oy - 40; k1ln(c, W - 30, this.pt + 40, ox + 10, ry - 20, 3, "#8a5a2b"); k1ln(c, ox + 10, ry - 20, ox, ry - 8, 2, "#f2f2f2"); c.strokeStyle = "#ffd23f"; c.lineWidth = 4; c.beginPath(); c.arc(ox, ry, 9, 0, TAU); c.stroke(); buddy(c, W - 34, this.pt + 60, 14, "#f2b48a", -1);
      c.globalAlpha = this.fadeA(); draw(false); c.globalAlpha = 1;
      for (i = 0; i < 3 - (this.miss || 0); i++) dot(c, 24 + i * 14, this.H - this.pb - 16, 5, "#ffd23f");
      this.ghost(ox + 40, ry + 60, now);
    }
  }), "circus");

  /* 96. Hamburguesería */
  regD("hamburgueseria", "Hamburguesería", "Tocá hacia donde querés caminar. Pasá por arriba de cada ingrediente para tirarlo al plato. Escapá de las salchichas.", "#ff9f1c", G("Hamburgueseria", {
    init: function () { this.C = 9; this.F = 4; this.s = Math.floor(this.W / this.C); this.ox = (this.W - this.s * this.C) / 2; this.fh = (this.H - this.pt - this.pb - 140) / (this.F - 1); this.oy = this.pt + 60; this.lad = [[0, 4, 8], [1, 3, 5, 7], [0, 2, 4, 6, 8]]; this.lvl = 0; this.board(); },
    board: function () { var cols = [1, 4, 7], k, f; this.ing = []; var kinds = ["#e0b070", "#3ddc84", "#8a5a2b", "#d9a85e"]; for (k = 0; k < 3; k++) for (f = 0; f < this.F; f++) this.ing.push({ c: cols[k], f: f, kind: f, m: [0, 0, 0], col: kinds[f], fall: 0 }); this.plate = [0, 0, 0]; this.p = { c: 4, f: 3, y: 0, d: [0, 0], k: 0, want: [0, 0] }; this.p.y = this.fy(3); this.en = [{ c: 0, f: 0, y: this.fy(0), d: [1, 0], k: 0 }, { c: 8, f: 1, y: this.fy(1), d: [-1, 0], k: 0 }]; },
    fy: function (f) { return this.oy + f * this.fh; },
    ladAt: function (c, f, dir) { var lf = dir < 0 ? f - 1 : f; if (lf < 0 || lf >= this.F - 1) return false; return this.lad[lf].indexOf(c) >= 0; },
    act: function (x, y) { var px = this.ox + (this.p.c + 0.5) * this.s, py = this.p.y; this.p.want = k1dir(x, y, px, py); this.acts++; },
    stepE: function (e, sp, dt, isP) {
      if (e.k > 0) { e.k -= dt * sp; if (e.d[1]) e.y += e.d[1] * this.fh * dt * sp; if (e.k <= 0) { e.k = 0; if (e.d[0]) e.c += e.d[0]; else { e.f += e.d[1]; e.y = this.fy(e.f); } return true; } return false; }
      return true;
    },
    canGo: function (e, d) { if (d[0]) return e.c + d[0] >= 0 && e.c + d[0] < this.C; return this.ladAt(e.c, e.f, d[1]); },
    go: function (e, d) { e.d = d; e.k = 1; },
    step: function (dt) {
      var i, p = this.p, sp = 7, esp = 3.2 + this.lvl * 0.4 + Math.min(this.t, 120) * 0.01;
      if (this.stepE(p, p.d[1] ? sp * 0.45 : sp, dt, true)) { if (p.d[0] || p.d[1]) this.walk(); if ((p.want[0] || p.want[1]) && this.canGo(p, p.want)) this.go(p, p.want); else if ((p.d[0] || p.d[1]) && this.canGo(p, p.d) && !(p.want[0] || p.want[1])) this.go(p, p.d); else if (p.want[0] || p.want[1]) { if (this.canGo(p, p.d) && (p.d[0] || p.d[1])) this.go(p, p.d); else p.d = [0, 0]; } }
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; if (this.stepE(e, e.d[1] ? esp * 0.45 : esp, dt)) { var opts = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(function (d) { return this.canGo(e, d) && !(d[0] === -e.d[0] && d[1] === -e.d[1]); }, this); if (!opts.length) opts = [[-e.d[0], -e.d[1]]]; var best = opts[0], bd = 1e9; for (var j = 0; j < opts.length; j++) { var d = opts[j], dd = Math.abs(e.c + d[0] - p.c) + Math.abs(e.f + d[1] - p.f) * 3 + Math.random() * 2; if (dd < bd) { bd = dd; best = d; } } this.go(e, best); }
        var ex = this.ox + (e.c + (e.d[0] * (1 - e.k))) * this.s, pxx = this.ox + (p.c + p.d[0] * (1 - p.k)) * this.s; if (Math.abs(ex - pxx) < this.s * 0.6 && Math.abs(e.y - p.y) < 20) { if (!this.hurt()) { p.c = 4; p.f = 3; p.y = this.fy(3); p.k = 0; p.d = [0, 0]; } return; } }
      for (i = 0; i < this.ing.length; i++) { var g = this.ing[i]; if (g.fall > 0) { g.fall -= dt; if (g.fall <= 0) { g.f++; g.m = [0, 0, 0]; if (g.f >= this.F) { var col = [1, 4, 7].indexOf(g.c); g.done = 1; this.plate[col]++; this.add(2); if (this.plate[col] === this.F) this.good(5, this.ox + g.c * this.s, this.H - this.pb - 40, true); } else { for (var j2 = 0; j2 < this.ing.length; j2++) { var o = this.ing[j2]; if (o !== g && !o.done && o.c === g.c && o.f === g.f && o.fall <= 0) { o.fall = 0.3; } } } } } }
      k1fil(this.ing, function (g) { return g.done; });
      if (!this.ing.length) { this.lvl++; this.board(); }
    },
    walk: function () { var p = this.p; for (var i = 0; i < this.ing.length; i++) { var g = this.ing[i]; if (g.f === p.f && g.fall <= 0 && p.c >= g.c - 1 && p.c <= g.c + 1) { g.m[p.c - g.c + 1] = 1; if (g.m[0] && g.m[1] && g.m[2]) { g.fall = 0.3; sfx(300, 0.06, "square", 0.04, 0.7); } } } },
    draw: function (now) {
      var c = this.ctx, i, f, s = this.s;
      for (f = 0; f < this.F - 1; f++) for (i = 0; i < this.lad[f].length; i++) { var lx = this.ox + (this.lad[f][i] + 0.5) * s; c.fillStyle = "#9aa1ab"; c.fillRect(lx - 10, this.fy(f), 3, this.fh); c.fillRect(lx + 7, this.fy(f), 3, this.fh); for (var y = this.fy(f) + 10; y < this.fy(f + 1); y += 14) c.fillRect(lx - 10, y, 20, 3); }
      for (f = 0; f < this.F; f++) fillR(c, this.ox, this.fy(f) + 4, s * this.C, 8, 3, "#ff4d6d");
      for (i = 0; i < 3; i++) { var px = this.ox + ([1, 4, 7][i] + 0.5) * s; fillR(c, px - s * 1.5, this.H - this.pb - 24, s * 3, 10, 5, "#f2f2f2"); for (var k = 0; k < this.plate[i]; k++) fillR(c, px - s * 1.3, this.H - this.pb - 34 - k * 9, s * 2.6, 9, 4, ["#e0b070", "#3ddc84", "#8a5a2b", "#d9a85e"][k]); }
      for (i = 0; i < this.ing.length; i++) { var g = this.ing[i], gy = this.fy(g.f) - 6 + (g.fall > 0 ? (0.3 - g.fall) / 0.3 * this.fh : 0); for (var m = 0; m < 3; m++) fillR(c, this.ox + (g.c - 1 + m) * s + 1, gy - (g.m[m] ? -3 : 0), s - 2, 10, g.kind === 0 ? 8 : 3, g.col); }
      for (i = 0; i < this.en.length; i++) { var e = this.en[i], ex = this.ox + (e.c + e.d[0] * (1 - e.k) + 0.5) * s; fillR(c, ex - 8, e.y - 30, 16, 30, 8, "#ff4d6d"); dot(c, ex - 3, e.y - 22, 2.5, "#fff"); dot(c, ex + 3, e.y - 22, 2.5, "#fff"); }
      var p = this.p, pxp = this.ox + (p.c + p.d[0] * (1 - p.k) + 0.5) * s; c.globalAlpha = this.fadeA(); fillR(c, pxp - 9, p.y - 22, 18, 22, 6, "#f2f2f2"); buddy(c, pxp, p.y - 30, 9, "#f2b48a"); fillR(c, pxp - 9, p.y - 46, 18, 10, 4, "#f2f2f2"); c.globalAlpha = 1;
      this.ghost(pxp + 50, p.y - 20, now);
    }
  }), "kitchen");

  /* 97. Mazmorra al ritmo */
  regD("mazmorra", "Mazmorra al ritmo", "Tocá hacia donde querés moverte, pero solo al ritmo del corazón. Pisá a los bichos para eliminarlos.", "#ff4d6d", G("Mazmorra", {
    init: function () { this.C = 7; this.R = 9; this.s = Math.floor(Math.min(this.W / this.C, (this.H - this.pt - this.pb - 90) / this.R)); this.ox = (this.W - this.s * this.C) / 2; this.oy = this.pt + 20; this.bt = 0.5; this.bk = 0; this.pc = 3; this.pr = 6; this.en = []; this.gm = []; this.moved = -1; this.beatN = 0; this.ne = 2; },
    act: function (x, y) { this.acts++; var ph = this.bk / this.bt, off = Math.min(ph, 1 - ph) * this.bt; if (off > 0.13 || this.moved === this.near()) { sfx(120, 0.05, "square", 0.03, 0.6); return; } this.moved = this.near(); var d = k1dir(x, y, this.ox + (this.pc + 0.5) * this.s, this.oy + (this.pr + 0.5) * this.s), nc = clamp(this.pc + d[0], 0, this.C - 1), nr = clamp(this.pr + d[1], 0, this.R - 1); for (var i = 0; i < this.en.length; i++) { var e = this.en[i]; if (e.c === nc && e.r === nr) { e.hp--; if (e.hp <= 0) { e.dead = 1; this.add(e.big ? 2 : 1); } sfx(200, 0.05, "square", 0.05, 0.6); return; } } this.pc = nc; this.pr = nr; for (i = 0; i < this.gm.length; i++) if (this.gm[i].c === nc && this.gm[i].r === nr) { this.gm[i].got = 1; this.add(1); } sfx(330, 0.04, "triangle", 0.04, 1.2); },
    near: function () { return this.bk / this.bt < 0.5 ? this.beatN : this.beatN + 1; },
    beat: function () { var i; this.beatN++; this.ne--; if (this.ne <= 0) { this.ne = Math.max(2, 5 - Math.floor(this.t / 20)); var c = ri(0, this.C), r = ri(0, 3); if (!(c === this.pc && r === this.pr)) this.en.push({ c: c, r: r, hp: Math.random() < 0.25 ? 2 : 1, big: 0, ph: 0 }); } if (Math.random() < 0.25 && this.gm.length < 3) this.gm.push({ c: ri(0, this.C), r: ri(0, this.R) });
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; e.ph++; if (e.ph % (e.hp > 1 ? 2 : 1)) continue; var d = Math.abs(this.pc - e.c) > Math.abs(this.pr - e.r) ? [Math.sign(this.pc - e.c), 0] : [0, Math.sign(this.pr - e.r)]; if (Math.random() < 0.3) d = pickOf([[1, 0], [-1, 0], [0, 1], [0, -1]]); var nc = clamp(e.c + d[0], 0, this.C - 1), nr = clamp(e.r + d[1], 0, this.R - 1); if (nc === this.pc && nr === this.pr) { this.hurt(); continue; } var occ = this.en.some(function (o) { return o !== e && o.c === nc && o.r === nr; }); if (!occ) { e.c = nc; e.r = nr; } } },
    step: function (dt) { this.bt = Math.max(0.36, 0.5 - this.t * 0.001); this.bk += dt; if (this.bk >= this.bt) { this.bk -= this.bt; this.beat(); } k1fil(this.en, function (e) { return e.dead; }); k1fil(this.gm, function (g) { return g.got; }); },
    draw: function (now) {
      var c = this.ctx, s = this.s, r, cc, i, pulse = 1 - this.bk / this.bt;
      for (r = 0; r < this.R; r++) for (cc = 0; cc < this.C; cc++) { var on = (r + cc + this.beatN) % 2 === 0; c.fillStyle = on ? "#5a2d82" : "#3a1d59"; c.fillRect(this.ox + cc * s + 1, this.oy + r * s + 1, s - 2, s - 2); }
      for (i = 0; i < this.gm.length; i++) gem(c, this.ox + (this.gm[i].c + 0.5) * s, this.oy + (this.gm[i].r + 0.5) * s, 9, "#ffd23f");
      for (i = 0; i < this.en.length; i++) { var e = this.en[i], ex = this.ox + (e.c + 0.5) * s, ey = this.oy + (e.r + 0.5) * s, sq = 1 + 0.12 * pulse; k1ell(c, ex, ey + 4, s * 0.34 * sq, s * 0.28 / sq, e.hp > 1 ? "#ff9f1c" : "#3ddc84"); face(c, ex, ey + 2, s * 0.22, 0); }
      var px = this.ox + (this.pc + 0.5) * s, py = this.oy + (this.pr + 0.5) * s; c.globalAlpha = this.fadeA(); fillR(c, px - 10, py - 6, 20, 22, 6, "#ffd23f"); buddy(c, px, py - 12, 11, "#f2b48a"); c.globalAlpha = 1;
      var hy = this.H - this.pb - 40, hx = this.W / 2, hs = 14 + pulse * 6; dot(c, hx - hs * 0.5, hy - hs * 0.2, hs * 0.6, "#ff4d6d"); dot(c, hx + hs * 0.5, hy - hs * 0.2, hs * 0.6, "#ff4d6d"); poly(c, [hx - hs * 1.05, hy, hx + hs * 1.05, hy, hx, hy + hs * 1.1], "#ff4d6d");
      for (i = 1; i <= 3; i++) { var off = (i - this.bk / this.bt) * 50; fillR(c, hx - 40 - off, hy - 10, 6, 20, 3, "#f2f2f2"); fillR(c, hx + 34 + off, hy - 10, 6, 20, 3, "#f2f2f2"); }
      this.ghost(px + 40, py - 50, now);
    }
  }), "cave");

  /* 98. Pozo */
  regD("pozo", "Pozo", "Mantené apretado para disparar hacia abajo y frenar la caída; moviendo el dedo te corrés. Soltá para caer. Pisá a los bichos.", "#ff4d6d", G("Pozo", {
    ctl: "hold",
    init: function () { this.x = this.W / 2; this.y = 0; this.vy = 0; this.am = 8; this.ft = 0; this.tx = this.x; this.cam = 0; this.ld = []; this.en = []; this.bu = []; this.ny = 200; this.dd = 0; },
    drag: function (x) { this.tx = clamp(x, 34, this.W - 34); },
    press: function () { this.acts++; },
    gen: function () { while (this.ny < this.cam + this.H * 2) { var L = Math.random() < 0.5, w = rnd(60, 130); this.ld.push({ x: L ? 20 : this.W - 20 - w, w: w, y: this.ny }); if (Math.random() < 0.5) this.en.push({ x: rnd(50, this.W - 50), y: this.ny + rnd(60, 140), vx: rnd(-60, 60), k: "bat", hp: 1 }); if (Math.random() < 0.3) this.en.push({ x: L ? 30 + w / 2 : this.W - 30 - w / 2, y: this.ny - 14, vx: 0, k: "snail", hp: 2, ld: this.ld[this.ld.length - 1] }); this.ny += rnd(150, 240); } },
    step: function (dt) {
      var i, j; this.gen();
      if (this.holding) { this.x += clamp(this.tx - this.x, -260 * dt, 260 * dt); this.ft -= dt; if (this.ft <= 0 && this.am > 0) { this.ft = 0.11; this.am--; this.vy = Math.min(this.vy, 40); this.vy -= 110; this.bu.push({ x: this.x, y: this.y + 18 }); sfx(700, 0.03, "square", 0.03, 0.6); } }
      this.vy += 900 * dt; this.vy = Math.min(this.vy, 520); var y0 = this.y; this.y += this.vy * dt;
      for (i = 0; i < this.ld.length; i++) { var l = this.ld[i]; if (this.vy > 0 && y0 + 14 <= l.y && this.y + 14 >= l.y && this.x > l.x - 6 && this.x < l.x + l.w + 6) { this.y = l.y - 14; this.vy = 0; this.am = 8; } }
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; if (e.k === "bat") { e.x += e.vx * dt; e.y += Math.sin(this.t * 4 + i) * 30 * dt; if (e.x < 30 || e.x > this.W - 30) e.vx = -e.vx; } if (Math.abs(e.x - this.x) < 22 && Math.abs(e.y - this.y) < 22 && !e.dead) { if (this.vy > 60 && this.y < e.y - 6) { e.dead = 1; this.add(2); this.vy = -320; this.am = 8; } else { this.hurt(); this.vy = -200; } } }
      for (i = 0; i < this.bu.length; i++) { var b = this.bu[i]; b.y += 700 * dt; if (b.y > this.y + this.H) b.gone = 1; for (j = 0; j < this.en.length; j++) { var q = this.en[j]; if (!q.dead && Math.abs(q.x - b.x) < 18 && Math.abs(q.y - b.y) < 16) { q.hp--; b.gone = 1; if (q.hp <= 0) { q.dead = 1; this.add(1); } break; } } for (j = 0; j < this.ld.length; j++) { var l2 = this.ld[j]; if (b.y > l2.y && b.y < l2.y + 16 && b.x > l2.x && b.x < l2.x + l2.w) b.gone = 1; } }
      this.cam += (this.y - this.H * 0.35 - this.cam) * Math.min(1, dt * 6); if (this.y > this.dd + 200) { this.dd += 200; this.add(1); }
      var cm = this.cam; k1fil(this.en, function (e) { return e.dead || e.y < cm - 100; }); k1fil(this.bu, function (b) { return b.gone; }); k1fil(this.ld, function (l) { return l.y < cm - 100; });
    },
    draw: function (now) {
      var c = this.ctx, i, cam = this.cam - this.pt, W = this.W;
      c.fillStyle = "#3a1d59"; c.fillRect(0, this.pt, 20, this.H); c.fillRect(W - 20, this.pt, 20, this.H);
      for (i = 0; i < this.ld.length; i++) { var l = this.ld[i]; fillR(c, l.x, l.y - cam, l.w, 16, 3, "#7a3cff"); }
      for (i = 0; i < this.en.length; i++) { var e = this.en[i], ey = e.y - cam; if (e.k === "bat") { var fl = Math.sin(now / 70 + i) * 7; poly(c, [e.x - 6, ey, e.x - 22, ey - 8 + fl, e.x - 14, ey + 6], "#ff4d6d"); poly(c, [e.x + 6, ey, e.x + 22, ey - 8 + fl, e.x + 14, ey + 6], "#ff4d6d"); dot(c, e.x, ey, 10, "#ff4d6d"); dot(c, e.x - 3, ey - 2, 2.5, "#fff"); dot(c, e.x + 3, ey - 2, 2.5, "#fff"); } else { dot(c, e.x, ey, 13, "#ff9f1c"); dot(c, e.x, ey, 7, "#c06a00"); dot(c, e.x + 12, ey + 6, 6, "#3ddc84"); } }
      for (i = 0; i < this.bu.length; i++) fillR(c, this.bu[i].x - 2, this.bu[i].y - cam - 6, 4, 12, 2, "#fff3b0");
      var py = this.y - cam; c.globalAlpha = this.fadeA(); fillR(c, this.x - 10, py - 4, 20, 18, 5, "#f2f2f2"); buddy(c, this.x, py - 10, 10, "#f2b48a"); fillR(c, this.x - 12, py + 12, 24, 6, 3, "#ff4d6d"); c.globalAlpha = 1;
      for (i = 0; i < 8; i++) fillR(c, W - 16, this.pt + 10 + i * 12, 8, 9, 2, i < this.am ? "#ff4d6d" : "rgba(255,255,255,0.15)");
      this.ghostHold(W * 0.5, this.H - this.pb - 70, now);
    }
  }), "cave");

  /* 99. Arreá las ovejas */
  regD("ovejas", "Arreá las ovejas", "Tocá donde querés que vaya el perro. Las ovejas se alejan de él: metelas en el corral de arriba.", "#3ddc84", G("Ovejas", {
    init: function () { this.pen = { x: this.W / 2 - 70, y: this.pt + 30, w: 140, h: 90 }; this.round(); },
    round: function () { this.dx = this.W / 2; this.dy = this.H - this.pb - 60; this.tx = this.dx; this.ty = this.dy; this.sh = []; for (var k = 0; k < 6; k++) this.sh.push({ x: rnd(40, this.W - 40), y: rnd(this.cy - 40, this.H - this.pb - 120), vx: 0, vy: 0, in: 0, wt: 0 }); this.tl = 30; this.n = 0; },
    act: function (x, y) { this.tx = x; this.ty = clamp(y, this.pt + 20, this.H - this.pb - 20); this.acts++; },
    step: function (dt) {
      var i, p = this.pen, dx = this.tx - this.dx, dy = this.ty - this.dy, d = Math.hypot(dx, dy); if (d > 3) { this.dx += dx / d * Math.min(d, 190 * dt); this.dy += dy / d * Math.min(d, 190 * dt); }
      this.tl -= dt; if (this.tl <= 0) { if (this.n < 4) this.hurt(); this.round(); return; }
      for (i = 0; i < this.sh.length; i++) { var s = this.sh[i]; if (s.in) { s.x += (p.x + 20 + (i % 3) * 45 - s.x) * dt * 2; s.y += (p.y + 30 + Math.floor(i / 3) * 34 - s.y) * dt * 2; continue; }
        var ex = s.x - this.dx, ey = s.y - this.dy, ed = Math.hypot(ex, ey); if (ed < 110 && ed > 0) { s.vx += ex / ed * 520 * dt * (1 - ed / 110) * 2; s.vy += ey / ed * 520 * dt * (1 - ed / 110) * 2; } else { s.wt -= dt; if (s.wt <= 0) { s.wt = rnd(1, 3); s.vx += rnd(-30, 30); s.vy += rnd(-30, 30); } }
        s.vx *= (1 - 2.5 * dt); s.vy *= (1 - 2.5 * dt); capS(s, 150); s.x = clamp(s.x + s.vx * dt, 20, this.W - 20); s.y = clamp(s.y + s.vy * dt, this.pt + 20, this.H - this.pb - 20);
        if (s.y < p.y + p.h + 4 && (s.x < p.x + 4 || s.x > p.x + p.w - 4) && s.y < p.y + p.h) s.y = p.y + p.h + 4;
        if (s.x > p.x + 10 && s.x < p.x + p.w - 10 && s.y < p.y + p.h - 10) { s.in = 1; this.n++; this.add(1); sfx(500, 0.06, "triangle", 0.05, 1.2); if (this.n >= this.sh.length) { this.good(3, this.W / 2, this.cy, true); this.round(); return; } } }
    },
    draw: function (now) {
      var c = this.ctx, i, p = this.pen;
      c.fillStyle = "#2f8f4e"; c.fillRect(0, this.pt, this.W, this.H); c.fillStyle = "#36a058"; for (i = 0; i < 20; i++) dot(c, (i * 73) % this.W, this.pt + 60 + (i * 131) % (this.H - this.pt - 100), 14, "#36a058");
      c.fillStyle = "#c98a4a"; c.fillRect(p.x - 6, p.y - 6, 6, p.h + 6); c.fillRect(p.x + p.w, p.y - 6, 6, p.h + 6); c.fillRect(p.x - 6, p.y - 6, p.w + 12, 6); for (i = 0; i < 4; i++) { c.fillRect(p.x - 40, p.y + p.h - 4, 40, 4); c.fillRect(p.x + p.w, p.y + p.h - 4, 40, 4); }
      for (i = 0; i < this.sh.length; i++) { var s = this.sh[i]; dot(c, s.x - 8, s.y - 2, 10, "#f2f2f2"); dot(c, s.x + 6, s.y - 4, 10, "#f2f2f2"); dot(c, s.x, s.y + 4, 11, "#f2f2f2"); dot(c, s.x + (s.vx > 0 ? 14 : -14), s.y - 2, 7, "#2b2b33"); }
      c.globalAlpha = this.fadeA(); k1ell(c, this.dx, this.dy, 16, 10, "#8a5a2b"); dot(c, this.dx + 14, this.dy - 6, 9, "#8a5a2b"); dot(c, this.dx + 17, this.dy - 8, 2.5, "#fff"); c.fillStyle = "#f2f2f2"; c.fillRect(this.dx - 16, this.dy - 4, 4, 4); c.globalAlpha = 1;
      fillR(c, 16, this.H - this.pb - 12, this.W - 92, 5, 3, "rgba(255,255,255,0.12)"); fillR(c, 16, this.H - this.pb - 12, (this.W - 92) * clamp(this.tl / 30, 0, 1), 5, 3, this.tl < 8 ? "#ff4d6d" : "#f2f2f2");
      this.ghost(this.dx + 50, this.dy - 50, now);
    }
  }), "farm");

  /* 100. Carrera de caballitos */
  regD("caballitos", "Carrera de caballitos", "La flecha va y viene. Tocá para tirar la bola cuando apunta al hoyo rojo: tu caballo avanza más. Llegá primero.", "#ffd23f", G("Caballitos", {
    init: function () { this.lvl = 0; this.race(); },
    race: function () { this.D = 20; this.hs = [{ x: 0, col: "#ffd23f", me: 1 }]; for (var k = 0; k < 3; k++) this.hs.push({ x: 0, col: ["#ff4d6d", "#3ddc84", "#c77dff"][k], t: rnd(0.4, 1), r: 0.55 + this.lvl * 0.05 + k * 0.04 }); this.ar = 0; this.b = null; this.ph = 1; this.wait = 0; this.fin = 0; },
    holes: function () { var W = this.W; return [{ x: W * 0.15, v: 1, col: "#3ddc84" }, { x: W * 0.32, v: 2, col: "#ffd23f" }, { x: W * 0.5, v: 3, col: "#ff4d6d" }, { x: W * 0.68, v: 2, col: "#ffd23f" }, { x: W * 0.85, v: 1, col: "#3ddc84" }]; },
    act: function () { if (this.b || this.ph !== 1) return; this.acts++; var ax = this.W / 2 + Math.sin(this.ar) * this.W * 0.42; this.b = { x: ax, k: 0 }; sfx(250, 0.1, "sine", 0.04, 1.4); },
    step: function (dt) {
      var i; if (this.ph === 2) { this.wait -= dt; if (this.wait <= 0) { this.lvl++; this.race(); } return; }
      this.ar += dt * (2.2 + this.lvl * 0.15);
      if (this.b) { this.b.k += dt / 0.45; if (this.b.k >= 1) { var H = this.holes(), best = H[0], bd = 1e9; for (i = 0; i < H.length; i++) { var d = Math.abs(H[i].x - this.b.x); if (d < bd) { bd = d; best = H[i]; } } var v = bd < 24 ? best.v : 0; this.hs[0].x += v; if (v === 3) this.good(1, best.x, this.H - this.pb - 120, true); this.b = null; } }
      for (i = 1; i < 4; i++) { var h = this.hs[i]; h.t -= dt; if (h.t <= 0) { h.t = rnd(0.7, 1.1); h.x += Math.random() < h.r ? pickOf([1, 2, 2, 3]) : 0; } }
      var win = -1; for (i = 0; i < 4; i++) if (this.hs[i].x >= this.D && win < 0) win = i;
      if (win >= 0) { var me = this.hs[0].x, place = 1; for (i = 1; i < 4; i++) if (this.hs[i].x > me) place++; if (win === 0 || place === 1) this.good(3, this.W / 2, this.cy, true); else if (place === 2) this.add(1); else this.hurt(); this.ph = 2; this.wait = 1.4; }
    },
    draw: function (now) {
      var c = this.ctx, i, W = this.W, top = this.pt + 60, lh = 54, H2 = this.holes();
      for (i = 0; i < 4; i++) { c.fillStyle = i % 2 ? "#c98a4a" : "#b87a3e"; c.fillRect(0, top + i * lh, W, lh); }
      c.fillStyle = "#f2f2f2"; c.fillRect(W - 50, top, 4, lh * 4);
      for (i = 0; i < 4; i++) { var h = this.hs[i], hx = 20 + (W - 90) * Math.min(1, h.x / this.D), hy = top + i * lh + lh * 0.6, bob = Math.sin(now / 120 + i) * 2; k1ell(c, hx, hy + bob, 18, 10, h.col); dot(c, hx + 16, hy - 10 + bob, 8, h.col); c.fillStyle = h.col; c.fillRect(hx - 12, hy + 6, 4, 12); c.fillRect(hx + 8, hy + 6, 4, 12); if (h.me) star(c, hx, hy - 20, 7, "#fff"); }
      var by = this.H - this.pb - 120; fillR(c, 10, by - 50, W - 20, 150, 14, "#55555f");
      for (i = 0; i < H2.length; i++) { dot(c, H2[i].x, by, 20, H2[i].col); dot(c, H2[i].x, by, 13, "#2b2b33"); }
      var ax = W / 2 + Math.sin(this.ar) * W * 0.42, ay = by + 80; if (!this.b) poly(c, [ax, ay - 20, ax - 10, ay, ax + 10, ay], "#f2f2f2");
      if (this.b) { var k = this.b.k; dot(c, this.b.x, ay - (ay - by) * k, 11 - 3 * k, "#f2f2f2"); }
      this.ghost(W * 0.5, ay + 10, now);
    }
  }), "arcade");
