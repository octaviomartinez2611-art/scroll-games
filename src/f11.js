
  /* ===== 100 copias de juegos conocidos (1/8): arcade clásico ===== */
  function k1dir(x, y, px, py) { var dx = x - px, dy = y - py; return Math.abs(dx) > Math.abs(dy) ? [dx > 0 ? 1 : -1, 0] : [0, dy > 0 ? 1 : -1]; }
  function k1ln(c, x1, y1, x2, y2, w, col) { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); }
  function k1fil(a, f) { for (var i = a.length - 1; i >= 0; i--) if (f(a[i])) a.splice(i, 1); }
  function k1ell(c, x, y, rx, ry, col) { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, TAU); c.fill(); }

  /* 1. Comilón (laberinto con fantasmas) */
  regD("comilon", "Comilón", "Tocá hacia donde querés ir. Comé todos los puntos y escapá de los fantasmas.", "#ffd23f", G("Comilon", {
    init: function () {
      this.mz = ["###########", "#....#....#", "#o##.#.##o#", "#.........#", "#.##.#.##.#", "#....#....#", "####.#.####", "#....G....#", "#.##.#.##.#", "#o.#.P.#.o#", "##.#.#.#.##", "#.........#", "###########"];
      this.R = this.mz.length; this.C = 11; this.s = Math.floor(Math.min((this.W - 16) / this.C, (this.H - this.pt - this.pb - 20) / this.R));
      this.ox = (this.W - this.s * this.C) / 2; this.oy = this.pt + 10; this.lv = 0; this.fill();
    },
    fill: function () {
      this.dots = {}; this.nd = 0; var r, c;
      for (r = 0; r < this.R; r++) for (c = 0; c < this.C; c++) { var ch = this.mz[r][c]; if (ch === "." || ch === "o") { this.dots[r * 20 + c] = ch === "o" ? 2 : 1; this.nd++; } if (ch === "P") this.home = [c, r]; if (ch === "G") this.gh0 = [c, r]; }
      this.place();
    },
    place: function () {
      this.pl = { c: this.home[0], r: this.home[1], d: [0, 0], p: 0 }; this.want = [0, 0]; this.fr = 0; this.gs = [];
      var cols = ["#ff4d6d", "#ff5fd2", "#ff9f1c"]; for (var k = 0; k < 3; k++) this.gs.push({ c: this.gh0[0], r: this.gh0[1], d: [k === 1 ? -1 : 1, 0], p: 0, col: cols[k], wait: k * 1.6 });
    },
    open: function (c, r) { return r >= 0 && r < this.R && c >= 0 && c < this.C && this.mz[r][c] !== "#"; },
    pos: function (e) { return { x: this.ox + (e.c + e.d[0] * e.p + 0.5) * this.s, y: this.oy + (e.r + e.d[1] * e.p + 0.5) * this.s }; },
    act: function (x, y) {
      var q = this.pos(this.pl), d = this.pl.d; this.want = k1dir(x, y, q.x, q.y); this.acts++;
      if ((d[0] || d[1]) && d[0] === -this.want[0] && d[1] === -this.want[1]) { this.pl.c += d[0]; this.pl.r += d[1]; this.pl.d = this.want; this.pl.p = 1 - this.pl.p; }
    },
    step: function (dt) {
      var pl = this.pl, k, sp = 4.2 + this.lv * 0.3;
      if (!pl.d[0] && !pl.d[1]) { if ((this.want[0] || this.want[1]) && this.open(pl.c + this.want[0], pl.r + this.want[1])) pl.d = this.want; }
      else { pl.p += sp * dt; if (pl.p >= 1) { pl.p -= 1; pl.c += pl.d[0]; pl.r += pl.d[1]; this.eat(); if ((this.want[0] || this.want[1]) && this.open(pl.c + this.want[0], pl.r + this.want[1])) pl.d = this.want; if (!this.open(pl.c + pl.d[0], pl.r + pl.d[1])) { pl.d = [0, 0]; pl.p = 0; } } }
      this.fr = Math.max(0, this.fr - dt);
      var q = this.pos(pl);
      for (k = 0; k < this.gs.length; k++) {
        var g = this.gs[k]; if (g.wait > 0) { g.wait -= dt; continue; }
        g.p += (this.fr > 0 ? 2.3 : 3 + this.lv * 0.35 + Math.min(this.t, 90) * 0.01) * dt;
        if (g.p >= 1) { g.p -= 1; g.c += g.d[0]; g.r += g.d[1]; this.steer(g); }
        var gq = this.pos(g);
        if (Math.hypot(gq.x - q.x, gq.y - q.y) < this.s * 0.6) {
          if (this.fr > 0) { this.good(3, gq.x, gq.y, true); g.c = this.gh0[0]; g.r = this.gh0[1]; g.p = 0; g.wait = 2; }
          else { if (!this.hurt()) this.place(); return; }
        }
      }
    },
    steer: function (g) {
      var ds = [[1, 0], [-1, 0], [0, 1], [0, -1]], best = null, bd = 1e9, opts = [], i;
      for (i = 0; i < 4; i++) { var d = ds[i]; if (d[0] === -g.d[0] && d[1] === -g.d[1]) continue; if (this.open(g.c + d[0], g.r + d[1])) opts.push(d); }
      if (!opts.length) { g.d = [-g.d[0], -g.d[1]]; return; }
      if (Math.random() < 0.3) { g.d = pickOf(opts); return; }
      for (i = 0; i < opts.length; i++) { var dd = Math.hypot(g.c + opts[i][0] - this.pl.c, g.r + opts[i][1] - this.pl.r) * (this.fr > 0 ? -1 : 1); if (dd < bd) { bd = dd; best = opts[i]; } }
      g.d = best;
    },
    eat: function () { var key = this.pl.r * 20 + this.pl.c, v = this.dots[key]; if (!v) return; delete this.dots[key]; this.nd--; this.add(1); if (v === 2) this.fr = 6; if (this.nd <= 0) { this.lv++; this.good(5, this.W / 2, this.H / 2, true); this.fill(); } },
    draw: function (now) {
      var c = this.ctx, s = this.s, r, cc, k;
      for (r = 0; r < this.R; r++) for (cc = 0; cc < this.C; cc++) { var x = this.ox + cc * s, y = this.oy + r * s; if (this.mz[r][cc] === "#") fillR(c, x + 2, y + 2, s - 4, s - 4, 6, "#7a3cff"); else { var v = this.dots[r * 20 + cc]; if (v) dot(c, x + s / 2, y + s / 2, v === 2 ? s * 0.22 : s * 0.09, "#ffe7a8"); } }
      for (k = 0; k < this.gs.length; k++) {
        var g = this.gs[k], gq = this.pos(g), col = this.fr > 0 ? (this.fr < 1.5 ? "#f2f2f2" : "#9aa1ab") : g.col, R = s * 0.4;
        c.fillStyle = col; c.beginPath(); c.arc(gq.x, gq.y - R * 0.1, R, PI, 0); c.lineTo(gq.x + R, gq.y + R * 0.8);
        for (var w = 0; w < 4; w++) c.lineTo(gq.x + R - (w + 0.5) * R / 2, gq.y + R * (w % 2 ? 0.8 : 0.45)); c.lineTo(gq.x - R, gq.y + R * 0.8); c.closePath(); c.fill();
        dot(c, gq.x - R * 0.35, gq.y - R * 0.15, R * 0.28, "#fff"); dot(c, gq.x + R * 0.35, gq.y - R * 0.15, R * 0.28, "#fff");
        dot(c, gq.x - R * 0.35 + g.d[0] * 2, gq.y - R * 0.15 + g.d[1] * 2, R * 0.13, "#2b2b33"); dot(c, gq.x + R * 0.35 + g.d[0] * 2, gq.y - R * 0.15 + g.d[1] * 2, R * 0.13, "#2b2b33");
      }
      var q = this.pos(this.pl), dd = this.pl.d[0] || this.pl.d[1] ? this.pl.d : (this.want[0] || this.want[1] ? this.want : [1, 0]), a = Math.atan2(dd[1], dd[0]), m = 0.3 + 0.25 * Math.sin(now / 70);
      c.globalAlpha = this.fadeA(); c.fillStyle = "#ffd23f"; c.beginPath(); c.moveTo(q.x, q.y); c.arc(q.x, q.y, s * 0.42, a + m, a + TAU - m); c.closePath(); c.fill(); c.globalAlpha = 1;
      this.ghost(q.x + 50, q.y - 60, now);
    }
  }), "arcade");

  /* 2. Defensa antimisiles */
  regD("misil", "Defensa antimisiles", "Tocá el cielo para hacer explotar los misiles antes de que caigan en la ciudad.", "#ff9f1c", G("Misil", {
    init: function () { this.gy = this.H - this.pb - 40; this.ms = []; this.bx = []; this.sh = []; this.nm = 1; this.cities = []; for (var k = 0; k < 4; k++) this.cities.push({ x: this.W * (0.14 + k * 0.24), dead: 0 }); },
    act: function (x, y) { y = Math.min(y, this.gy - 40); this.sh.push({ x: this.W / 2, y: this.gy - 20, tx: x, ty: y }); this.acts++; sfx(500, 0.05, "square", 0.04, 1.6); },
    step: function (dt) {
      var i, j, sp = 45 + Math.min(this.t, 120) * 0.7;
      this.nm -= dt; if (this.nm <= 0) { this.nm = Math.max(0.5, 2 - this.t * 0.012) * rnd(0.6, 1.2); var tg = pickOf(this.cities), x0 = rnd(10, this.W - 10); this.ms.push({ x0: x0, y0: this.pt, x: x0, y: this.pt, tx: tg.x + rnd(-14, 14), v: sp * rnd(0.8, 1.3) }); }
      for (i = 0; i < this.sh.length; i++) { var s = this.sh[i], dx = s.tx - s.x, dy = s.ty - s.y, d = Math.hypot(dx, dy), st = 950 * dt; if (d <= st) { this.bx.push({ x: s.tx, y: s.ty, t: 0, r: 0 }); s.done = 1; } else { s.x += dx / d * st; s.y += dy / d * st; } }
      k1fil(this.sh, function (s) { return s.done; });
      for (i = 0; i < this.bx.length; i++) { var b = this.bx[i]; b.t += dt; b.r = 48 * Math.sin(Math.min(1, b.t / 0.9) * PI); }
      k1fil(this.bx, function (b) { return b.t > 0.9; });
      for (i = 0; i < this.ms.length; i++) {
        var m = this.ms[i], ddx = m.tx - m.x0, ddy = this.gy - m.y0, L = Math.hypot(ddx, ddy); m.x += ddx / L * m.v * dt; m.y += ddy / L * m.v * dt;
        for (j = 0; j < this.bx.length; j++) if (Math.hypot(m.x - this.bx[j].x, m.y - this.bx[j].y) < this.bx[j].r + 4) { m.dead = 1; this.add(1); this.bx.push({ x: m.x, y: m.y, t: 0.3, r: 10 }); break; }
        if (!m.dead && m.y >= this.gy) { m.dead = 1; this.bx.push({ x: m.x, y: this.gy, t: 0.35, r: 10 }); for (j = 0; j < this.cities.length; j++) if (Math.abs(this.cities[j].x - m.x) < 32) this.cities[j].dead = 6; this.hurt(); }
      }
      k1fil(this.ms, function (m) { return m.dead; });
      for (i = 0; i < this.cities.length; i++) this.cities[i].dead = Math.max(0, this.cities[i].dead - dt);
    },
    draw: function (now) {
      var c = this.ctx, i, gy = this.gy;
      c.fillStyle = "#6b4a2b"; c.fillRect(0, gy, this.W, this.H - gy);
      for (i = 0; i < this.cities.length; i++) { var ct = this.cities[i]; if (ct.dead > 0) { fillR(c, ct.x - 26, gy - 8, 52, 8, 2, "#55555f"); continue; } fillR(c, ct.x - 26, gy - 26, 16, 26, 2, "#ffd23f"); fillR(c, ct.x - 8, gy - 40, 16, 40, 2, "#ff9f1c"); fillR(c, ct.x + 10, gy - 20, 16, 20, 2, "#ff5fd2"); c.fillStyle = "#2b2b33"; c.fillRect(ct.x - 4, gy - 34, 8, 6); c.fillRect(ct.x - 4, gy - 22, 8, 6); }
      poly(c, [this.W / 2 - 22, gy, this.W / 2 + 22, gy, this.W / 2 + 8, gy - 24, this.W / 2 - 8, gy - 24], "#9aa1ab"); c.fillStyle = "#d9dde3"; c.fillRect(this.W / 2 - 3, gy - 36, 6, 14);
      for (i = 0; i < this.ms.length; i++) { var m = this.ms[i]; k1ln(c, m.x0, m.y0, m.x, m.y, 2, "rgba(255,77,109,0.6)"); dot(c, m.x, m.y, 4, "#ff4d6d"); }
      for (i = 0; i < this.sh.length; i++) { var s = this.sh[i]; k1ln(c, this.W / 2, gy - 36, s.x, s.y, 2, "#d9dde3"); }
      for (i = 0; i < this.bx.length; i++) { var b = this.bx[i]; if (b.r > 1) { dot(c, b.x, b.y, b.r, "#ffd23f"); dot(c, b.x, b.y, b.r * 0.6, "#fff3b0"); } }
      this.ghost(this.W * 0.5, this.pt + 200, now);
    }
  }), "city");

  /* 3. Ciempiés */
  regD("ciempies", "Ciempiés", "Arrastrá a los costados. Dispara solo. Rompé el ciempiés antes de que llegue abajo.", "#3ddc84", G("Ciempies", {
    ctl: "drag",
    init: function () {
      this.cs = 26; this.cols = Math.floor(this.W / this.cs); this.ox = (this.W - this.cols * this.cs) / 2; this.rows = Math.floor((this.H - this.pt - this.pb - 20) / this.cs); this.oy = this.pt + 6;
      this.px = this.W / 2; this.tx = this.px; this.bul = []; this.fire = 0; this.mu = {}; for (var k = 0; k < 24; k++) this.mu[ri(2, this.rows - 5) * 100 + ri(0, this.cols)] = 2; this.wave = 0; this.spawn();
    },
    spawn: function () { this.sg = []; for (var k = 0; k < 9; k++) this.sg.push({ c: -k - 1, r: 0, d: 1, p: 0, up: 0 }); this.wave++; },
    drag: function (x) { this.tx = x; },
    blk: function (c, r) { return this.mu[r * 100 + c] > 0; },
    sx: function (s) { return this.ox + (s.c + s.d * s.p + 0.5) * this.cs; },
    sy: function (s) { return this.oy + (s.r + 0.5) * this.cs; },
    step: function (dt) {
      var i, j, s, sp = 6 + this.wave * 0.6 + Math.min(this.t, 90) * 0.03, by = this.oy + (this.rows - 0.5) * this.cs;
      this.px += (this.tx - this.px) * Math.min(1, dt * 14); this.px = clamp(this.px, 14, this.W - 14);
      this.fire -= dt; if (this.fire <= 0) { this.fire = 0.13; this.bul.push({ x: this.px, y: by - 14 }); }
      for (i = 0; i < this.sg.length; i++) {
        s = this.sg[i]; s.p += sp * dt;
        while (s.p >= 1) { s.p -= 1; s.c += s.d; var nc = s.c + s.d; if (s.c >= 0 && (nc < 0 || nc >= this.cols || this.blk(nc, s.r))) { s.r += s.up ? -1 : 1; if (s.r >= this.rows - 1) s.up = 1; else if (s.up && s.r <= this.rows - 5) s.up = 0; s.d = -s.d; } }
        if (Math.abs(this.sx(s) - this.px) < this.cs * 0.7 && Math.abs(this.sy(s) - by) < this.cs * 0.6) { if (!this.hurt()) this.spawn(); return; }
      }
      for (i = 0; i < this.bul.length; i++) {
        var b = this.bul[i]; b.y -= 720 * dt; if (b.y < this.pt) { b.gone = 1; continue; }
        var bc = Math.floor((b.x - this.ox) / this.cs), br = Math.floor((b.y - this.oy) / this.cs);
        if (this.blk(bc, br)) { this.mu[br * 100 + bc]--; b.gone = 1; continue; }
        for (j = 0; j < this.sg.length; j++) { s = this.sg[j]; if (Math.abs(this.sx(s) - b.x) < this.cs * 0.55 && Math.abs(this.sy(s) - b.y) < this.cs * 0.55) { if (s.c >= 0 && s.c < this.cols && s.r < this.rows - 1) this.mu[s.r * 100 + s.c] = 2; this.sg.splice(j, 1); this.add(1); b.gone = 1; break; } }
      }
      k1fil(this.bul, function (b) { return b.gone; });
      if (!this.sg.length) { this.good(3, this.W / 2, this.cy, true); this.spawn(); }
    },
    draw: function (now) {
      var c = this.ctx, i, cs = this.cs, by = this.oy + (this.rows - 0.5) * cs;
      for (var key in this.mu) { var hp = this.mu[key]; if (hp <= 0) continue; var mx = this.ox + (key % 100 + 0.5) * cs, my = this.oy + (Math.floor(key / 100) + 0.5) * cs; c.fillStyle = "#f2e6c8"; c.fillRect(mx - 4, my, 8, 9); c.fillStyle = hp > 1 ? "#ff4d6d" : "#ff9fb0"; c.beginPath(); c.arc(mx, my + 2, 11, PI, 0); c.fill(); dot(c, mx - 4, my - 3, 2.5, "#fff"); dot(c, mx + 4, my - 5, 2, "#fff"); }
      for (i = 0; i < this.bul.length; i++) fillR(c, this.bul[i].x - 2, this.bul[i].y - 7, 4, 12, 2, "#fff3b0");
      for (i = this.sg.length - 1; i >= 0; i--) { var s = this.sg[i], x = this.sx(s), y = this.sy(s), lg = Math.sin(now / 80 + i) * 3; k1ln(c, x - 6, y + 6, x - 9, y + 12 + lg, 2, "#1f8a4c"); k1ln(c, x + 6, y + 6, x + 9, y + 12 - lg, 2, "#1f8a4c"); dot(c, x, y, cs * 0.46, i === 0 ? "#3ddc84" : "#2fbf6f"); if (i === 0) face(c, x, y, cs * 0.42, s.d); }
      c.globalAlpha = this.fadeA(); fillR(c, this.px - 14, by - 6, 28, 16, 6, "#ff9f1c"); c.fillStyle = "#ffd23f"; c.fillRect(this.px - 3, by - 18, 6, 14); c.globalAlpha = 1;
      this.ghostDrag(by - 70, now);
    }
  }), "garden");

  /* 4. Barriles */
  regD("barril", "Barriles", "Tocá para saltar los barriles. Llegá hasta arriba por las escaleras.", "#ff4d6d", G("Barril", {
    init: function () { var top = this.pt + 90, bot = this.H - this.pb - 30; this.gy = []; for (var k = 0; k < 4; k++) this.gy.push(bot - k * (bot - top) / 3); this.lad = [this.W * 0.82, this.W * 0.18, this.W * 0.82]; this.bs = []; this.nb = 1.5; this.start(); },
    start: function () { this.lv = 0; this.x = 30; this.h = 0; this.vy = 0; this.climb = -1; },
    act: function () { if (this.h <= 0 && this.climb < 0) { this.vy = 440; this.h = 0.01; this.acts++; sfx(520, 0.06, "triangle", 0.05, 1.4); } },
    step: function (dt) {
      var i, sp = 140 + Math.min(this.t, 100) * 1.1;
      if (this.climb >= 0) { this.climb += dt / 0.7; if (this.climb >= 1) { this.climb = -1; this.lv++; this.add(1); if (this.lv >= 3) { this.good(3, this.x, this.gy[3], true); this.start(); } } }
      else { this.x += (this.lv % 2 ? -1 : 1) * 95 * dt; var L = this.lad[this.lv]; if (Math.abs(this.x - L) < 4 && this.h <= 0) { this.x = L; this.climb = 0; } this.x = clamp(this.x, 16, this.W - 16); }
      if (this.h > 0) { this.h += this.vy * dt; this.vy -= 1400 * dt; if (this.h <= 0) { this.h = 0; this.vy = 0; } }
      this.nb -= dt; if (this.nb <= 0) { this.nb = Math.max(1.1, 2.6 - this.t * 0.012) * rnd(0.7, 1.3); this.bs.push({ lv: 3, x: 56, d: 1, f: 0 }); }
      for (i = 0; i < this.bs.length; i++) {
        var b = this.bs[i]; if (b.f > 0) { b.f -= dt; if (b.f <= 0) b.lv--; continue; }
        b.x += b.d * sp * dt; b.rot = (b.rot || 0) + b.d * dt * 8;
        if (b.x > this.W - 14 || b.x < 14) { if (b.lv === 0) { b.gone = 1; continue; } b.f = 0.35; b.d = -b.d; b.x = clamp(b.x, 14, this.W - 14); continue; }
        if (b.lv === this.lv && this.climb < 0) { if (Math.abs(b.x - this.x) < 18 && this.h < 18) { b.gone = 1; this.hurt(); } else if (!b.sc && this.h >= 18 && Math.abs(b.x - this.x) < 12) { b.sc = 1; this.add(1); } }
      }
      k1fil(this.bs, function (b) { return b.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, k, W = this.W;
      for (k = 0; k < 3; k++) { var lx = this.lad[k]; c.fillStyle = "#3ddc84"; c.fillRect(lx - 12, this.gy[k + 1], 4, this.gy[k] - this.gy[k + 1]); c.fillRect(lx + 8, this.gy[k + 1], 4, this.gy[k] - this.gy[k + 1]); for (var y = this.gy[k + 1] + 10; y < this.gy[k]; y += 14) c.fillRect(lx - 10, y, 20, 3); }
      for (k = 0; k < 4; k++) { var g = this.gy[k]; fillR(c, 6, g, W - 12, 12, 2, "#ff4d6d"); c.fillStyle = "#a3203c"; for (var x = 14; x < W - 12; x += 22) c.fillRect(x, g + 4, 10, 4); }
      buddy(c, 34, this.gy[3] - 26, 22, "#8a5a2b"); dot(c, 34, this.gy[3] - 18, 12, "#c98a4a");
      star(c, W - 40, this.gy[3] - 26, 14, "#ffd23f");
      for (i = 0; i < this.bs.length; i++) { var b = this.bs[i], by = b.f > 0 ? this.gy[b.lv] + (this.gy[b.lv - 1] - this.gy[b.lv]) * (1 - b.f / 0.35) : this.gy[b.lv]; c.save(); c.translate(b.x, by - 12); c.rotate(b.rot || 0); dot(c, 0, 0, 12, "#c98a4a"); c.strokeStyle = "#6b4423"; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 8, 0, TAU); c.stroke(); k1ln(c, -10, 0, 10, 0, 3, "#6b4423"); c.restore(); }
      var py = this.climb >= 0 ? this.gy[this.lv] + (this.gy[this.lv + 1] - this.gy[this.lv]) * this.climb : this.gy[this.lv] - this.h;
      c.globalAlpha = this.fadeA(); c.fillStyle = "#2b2b33"; c.fillRect(this.x - 7, py - 12, 5, 12); c.fillRect(this.x + 2, py - 12, 5, 12); buddy(c, this.x, py - 24, 13, "#ff9f1c", this.lv % 2 ? -1 : 1); c.fillStyle = "#ff4d6d"; c.fillRect(this.x - 13, py - 38, 26, 6); c.globalAlpha = 1;
      this.ghost(this.x + 40, py - 70, now);
    }
  }), "build");

  /* 5. Motos de luz */
  regD("motoluz", "Motos de luz", "Tocá del lado al que querés doblar. No choques con ninguna estela.", "#ff5fd2", G("Motoluz", {
    init: function () { this.cs = 10; this.C = Math.floor((this.W - 12) / this.cs); this.R = Math.floor((this.H - this.pt - this.pb - 12) / this.cs); this.ox = (this.W - this.C * this.cs) / 2; this.oy = this.pt + 6; this.arena(); },
    arena: function () { this.g = new Int8Array(this.C * this.R); this.bk = [{ c: Math.floor(this.C / 2), r: this.R - 6, d: [0, -1], id: 1, col: "#ff5fd2" }]; this.bk.push(this.ai(2, "#3ddc84")); this.bk.push(this.ai(3, "#ffd23f")); this.acc = 0; this.surv = 0; this.wantD = null; },
    ai: function (id, col) { for (var k = 0; k < 60; k++) { var c = ri(4, this.C - 4), r = ri(4, Math.floor(this.R * 0.55)), d = pickOf([[1, 0], [-1, 0], [0, 1]]), b = { c: c, r: r, d: d, id: id, col: col }; if (this.free(c, r) && this.look(b, d) > 6) return b; } return { c: 2, r: 2, d: [1, 0], id: id, col: col, dead: 1, gone: 1, wait: 2 }; },
    free: function (c, r) { return c >= 0 && r >= 0 && c < this.C && r < this.R && !this.g[r * this.C + c]; },
    look: function (b, d) { var n = 0, c = b.c, r = b.r; for (var k = 0; k < 14; k++) { c += d[0]; r += d[1]; if (!this.free(c, r)) break; n++; } return n; },
    act: function (x, y) { var b = this.bk[0], hx = this.ox + (b.c + 0.5) * this.cs, hy = this.oy + (b.r + 0.5) * this.cs; this.wantD = b.d[0] ? [0, y < hy ? -1 : 1] : [x < hx ? -1 : 1, 0]; this.acts++; sfx(330, 0.04, "square", 0.03, 1.3); },
    step: function (dt) { this.acc += dt * (11 + Math.min(this.t, 60) * 0.06); while (this.acc >= 1) { this.acc -= 1; if (this.tick1()) return; } },
    tick1: function () {
      var i, b;
      if (this.wantD) { this.bk[0].d = this.wantD; this.wantD = null; }
      for (i = 1; i < this.bk.length; i++) { b = this.bk[i]; if (b.dead) continue; var ah = this.look(b, b.d); if (ah < 3 || Math.random() < 0.04) { var L = [b.d[1], -b.d[0]], Rr = [-b.d[1], b.d[0]], la = this.look(b, L), ra = this.look(b, Rr); if (Math.max(la, ra) > ah) b.d = la >= ra ? L : Rr; } }
      for (i = 0; i < this.bk.length; i++) { b = this.bk[i]; if (b.dead) continue; this.g[b.r * this.C + b.c] = b.id; var nc = b.c + b.d[0], nr = b.r + b.d[1]; if (!this.free(nc, nr)) b.dead = 1; else { b.c = nc; b.r = nr; } }
      if (this.bk[0].dead) { if (!this.hurt()) this.arena(); return true; }
      for (i = 1; i < this.bk.length; i++) { b = this.bk[i]; if (b.dead && !b.gone) { b.gone = 1; b.wait = 1.5; this.good(3, this.ox + b.c * this.cs, this.oy + b.r * this.cs, true); for (var k = 0; k < this.g.length; k++) if (this.g[k] === b.id) this.g[k] = 0; } else if (b.gone) { b.wait -= 1 / 11; if (b.wait <= 0) this.bk[i] = this.ai(b.id, b.col); } }
      this.surv++; if (this.surv % 15 === 0) this.add(1);
      return false;
    },
    draw: function (now) {
      var c = this.ctx, k, cs = this.cs, cols = [null, "#ff5fd2", "#3ddc84", "#ffd23f"];
      c.strokeStyle = "rgba(255,255,255,0.18)"; c.lineWidth = 2; c.strokeRect(this.ox - 2, this.oy - 2, this.C * cs + 4, this.R * cs + 4);
      for (k = 0; k < this.g.length; k++) { var v = this.g[k]; if (v) { c.fillStyle = cols[v]; c.fillRect(this.ox + (k % this.C) * cs + 2, this.oy + Math.floor(k / this.C) * cs + 2, cs - 4, cs - 4); } }
      for (k = 0; k < this.bk.length; k++) { var b = this.bk[k]; if (b.gone) continue; c.globalAlpha = k === 0 ? this.fadeA() : 1; fillR(c, this.ox + b.c * cs - 3, this.oy + b.r * cs - 3, cs + 6, cs + 6, 4, b.col); dot(c, this.ox + (b.c + 0.5) * cs, this.oy + (b.r + 0.5) * cs, 3, "#fff"); c.globalAlpha = 1; }
      var p = this.bk[0]; this.ghost(this.ox + p.c * cs + 70, this.oy + p.r * cs - 20, now);
    }
  }), "arcade");

  /* 6. Pirámide de cubos */
  regD("piramide", "Pirámide de cubos", "Tocá en diagonal hacia donde querés saltar. Pintá todos los cubos sin caerte.", "#ff9f1c", G("Piramide", {
    init: function () { this.N = 6; this.w = Math.min(58, (this.W - 20) / this.N); this.h = this.w; this.top = this.pt + 70; this.lv = 0; this.board(); },
    board: function () { this.cl = []; for (var r = 0; r < this.N; r++) { this.cl.push([]); for (var c = 0; c <= r; c++) this.cl[r].push(0); } this.left = this.N * (this.N + 1) / 2; this.pr = 0; this.pc = 0; this.fr = { r: 0, c: 0 }; this.hop = 0; this.balls = []; this.nb = 2; },
    xy: function (r, c) { return { x: this.W / 2 + (c - r / 2) * this.w, y: this.top + r * this.h * 0.75 }; },
    act: function (x, y) { if (this.hop > 0) return; var p = this.xy(this.pr, this.pc), dn = y > p.y - 10, rt = x > p.x; this.fr = { r: this.pr, c: this.pc }; this.pr += dn ? 1 : -1; this.pc += dn ? (rt ? 1 : 0) : (rt ? 0 : -1); this.hop = 0.22; this.acts++; sfx(440, 0.05, "triangle", 0.05, 1.3); },
    step: function (dt) {
      var i;
      if (this.hop > 0) { this.hop -= dt; if (this.hop <= 0) { this.hop = 0; if (this.pr < 0 || this.pr >= this.N || this.pc < 0 || this.pc > this.pr) { this.pr = 0; this.pc = 0; this.hurt(); } else if (!this.cl[this.pr][this.pc]) { this.cl[this.pr][this.pc] = 1; this.left--; this.add(1); if (this.left <= 0) { this.lv++; this.good(5, this.W / 2, this.top, true); this.board(); } } } }
      var bt = Math.max(0.32, 0.6 - this.lv * 0.04);
      this.nb -= dt; if (this.nb <= 0) { this.nb = Math.max(0.9, 2.6 - this.lv * 0.3 - this.t * 0.01); this.balls.push({ r: -1, c: 0, h: bt, fr: { r: -2, c: 0 } }); }
      for (i = 0; i < this.balls.length; i++) {
        var b = this.balls[i]; b.T = bt; b.h -= dt;
        if (b.h <= 0) { b.fr = { r: b.r, c: b.c }; b.r++; if (b.r > 0 && Math.random() < 0.5) b.c++; b.h = bt; if (b.r >= this.N) b.gone = 1; }
        if (!b.gone && this.hop <= 0 && b.h < bt * 0.5 && b.r === this.pr && b.c === this.pc) { b.gone = 1; this.hurt(); }
      }
      k1fil(this.balls, function (b) { return b.gone; });
    },
    lerpP: function (fr, r, c, k) { var a = this.xy(fr.r, fr.c), b = this.xy(r, c); return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k - Math.sin(k * PI) * 26 }; },
    draw: function (now) {
      var c = this.ctx, r, cc, i, w = this.w, h = this.h;
      for (r = 0; r < this.N; r++) for (cc = 0; cc <= r; cc++) { var p = this.xy(r, cc), x = p.x, y = p.y; poly(c, [x - w / 2, y, x, y + h * 0.25, x, y + h * 0.8, x - w / 2, y + h * 0.55], "#7a3cff"); poly(c, [x + w / 2, y, x, y + h * 0.25, x, y + h * 0.8, x + w / 2, y + h * 0.55], "#4b1fa8"); poly(c, [x, y - h * 0.25, x + w / 2, y, x, y + h * 0.25, x - w / 2, y], this.cl[r][cc] ? "#ffd23f" : "#c77dff"); }
      for (i = 0; i < this.balls.length; i++) { var b = this.balls[i], q = this.lerpP(b.fr, b.r, b.c, 1 - b.h / b.T); dot(c, q.x, q.y - 10, 10, "#ff4d6d"); dot(c, q.x - 3, q.y - 13, 3, "#ffb3c1"); }
      var pp = this.hop > 0 ? this.lerpP(this.fr, this.pr, this.pc, 1 - this.hop / 0.22) : this.xy(this.pr, this.pc);
      c.globalAlpha = this.fadeA(); buddy(c, pp.x, pp.y - 16, 13, "#ff9f1c", 1); k1ell(c, pp.x + 12, pp.y - 14, 8, 5, "#ff9f1c"); c.globalAlpha = 1;
      this.ghost(pp.x + 40, pp.y + 50, now);
    }
  }), "space");

  /* 7. Mostrador */
  regD("mostrador", "Mostrador", "Tocá una barra para mandar un licuado. Que ningún cliente llegue a tu lado.", "#c98a4a", G("Mostrador", {
    init: function () { this.N = 4; var top = this.pt + 80, bot = this.H - this.pb - 60; this.ys = []; for (var k = 0; k < this.N; k++) this.ys.push(top + k * (bot - top) / (this.N - 1)); this.row = 0; this.cu = []; this.dr = []; this.br = []; this.nc = 1; this.cd = 0; this.stun = 0; this.x0 = 50; this.x1 = this.W - 70; },
    act: function (x, y) { var best = 0, bd = 1e9; for (var k = 0; k < this.N; k++) { var d = Math.abs(y - this.ys[k]); if (d < bd) { bd = d; best = k; } } this.row = best; if (this.cd > 0 || this.stun > 0) return; this.cd = 0.18; this.dr.push({ k: best, x: this.x0 + 24 }); this.acts++; sfx(380, 0.05, "sine", 0.05, 0.7); },
    step: function (dt) {
      var i, j, cs = 22 + Math.min(this.t, 120) * 0.25; this.cd -= dt; this.stun -= dt;
      this.nc -= dt; if (this.nc <= 0) { this.nc = Math.max(0.6, 2.2 - this.t * 0.012) * rnd(0.6, 1.3); this.cu.push({ k: ri(0, this.N), x: this.x1, col: pickOf(["#ff4d6d", "#3ddc84", "#ffd23f", "#c77dff", "#ff9f1c"]), bk: 0 }); }
      for (i = 0; i < this.cu.length; i++) { var u = this.cu[i]; if (u.bk) { u.x += 280 * dt; if (u.x > this.W + 24) u.gone = 1; } else { u.x -= cs * dt; if (u.x < this.x0 + 36) { u.gone = 1; this.hurt(); } } }
      for (i = 0; i < this.dr.length; i++) { var d = this.dr[i]; d.x += 430 * dt; for (j = 0; j < this.cu.length; j++) { var v = this.cu[j]; if (!v.gone && !v.bk && v.k === d.k && Math.abs(v.x - d.x) < 22) { v.bk = 1; d.gone = 1; this.add(1); break; } } if (!d.gone && d.x > this.x1 + 6) { d.gone = 1; this.stun = 0.8; this.br.push({ k: d.k, t: 0.8 }); sfx(900, 0.08, "square", 0.03, 0.5); } }
      for (i = 0; i < this.br.length; i++) this.br[i].t -= dt;
      k1fil(this.cu, function (u) { return u.gone; }); k1fil(this.dr, function (d) { return d.gone; }); k1fil(this.br, function (b) { return b.t <= 0; });
    },
    draw: function (now) {
      var c = this.ctx, i, k;
      for (k = 0; k < this.N; k++) { var y = this.ys[k]; fillR(c, this.x0, y, this.x1 - this.x0 + 20, 14, 4, "#c98a4a"); c.fillStyle = "#8a5a2b"; c.fillRect(this.x0, y + 14, this.x1 - this.x0 + 20, 24); fillR(c, 6, y - 30, 22, 44, 4, "#9aa1ab"); dot(c, 17, y - 18, 5, "#ff4d6d"); }
      for (i = 0; i < this.br.length; i++) { var bb = this.br[i]; poly(c, [this.x1, this.ys[bb.k] - 2, this.x1 + 8, this.ys[bb.k] - 12, this.x1 + 14, this.ys[bb.k] - 3, this.x1 + 22, this.ys[bb.k] - 10, this.x1 + 26, this.ys[bb.k] - 1], "#ff5fd2"); }
      for (i = 0; i < this.cu.length; i++) { var u = this.cu[i]; buddy(c, u.x, this.ys[u.k] - 20, 14, u.col, -1); }
      for (i = 0; i < this.dr.length; i++) { var d = this.dr[i], dy = this.ys[d.k]; fillR(c, d.x - 6, dy - 18, 12, 18, 3, "#ff5fd2"); c.fillStyle = "#fff3b0"; c.fillRect(d.x - 6, dy - 18, 12, 4); }
      var by = this.ys[this.row]; c.globalAlpha = this.stun > 0 ? 0.5 : this.fadeA(); buddy(c, this.x0 - 8, by - 22, 15, "#f2b48a", 1); c.fillStyle = "#f2f2f2"; c.fillRect(this.x0 - 18, by - 8, 20, 10); c.globalAlpha = 1;
      this.ghost(this.W * 0.5, this.ys[1] - 30, now);
    }
  }), "pub");

  /* 8. Repartidor de diarios */
  regD("diarios", "Repartidor de diarios", "Tocá para tirar el diario cuando el buzón rojo esté a tu altura. Las casas grises no lo quieren.", "#ff4d6d", G("Diarios", {
    init: function () { this.py = this.H - this.pb - 150; this.px = this.W * 0.66; this.mbx = this.W * 0.3; this.s = 0; this.hs = []; this.ny = this.py - 120; this.pp = []; this.cd = 0; while (this.ny > this.pt - 200) this.house(); },
    house: function () { this.hs.push({ wy: this.ny, sub: Math.random() < 0.65, col: pickOf(["#ff9f1c", "#3ddc84", "#c77dff", "#ff5fd2", "#ffd23f"]), off: rnd(-14, 14) }); this.ny -= rnd(150, 200); },
    act: function () { if (this.cd > 0) return; this.cd = 0.25; this.pp.push({ x: this.px - 14, wy: this.py - this.s, r: 0 }); this.acts++; sfx(260, 0.05, "triangle", 0.04, 0.8); },
    step: function (dt) {
      var i, j, v = 140 + Math.min(this.t, 100) * 1.4; this.s += v * dt; this.cd -= dt;
      while (this.ny + this.s > this.pt - 220) this.house();
      for (i = 0; i < this.pp.length; i++) { var p = this.pp[i]; p.x -= 640 * dt; p.r += dt * 14; if (p.x <= this.mbx + 14 && !p.done) { p.done = 1; for (j = 0; j < this.hs.length; j++) { var h = this.hs[j], d = Math.abs(p.wy - (h.wy + h.off)); if (d < 20 && h.sub && !h.got) { h.got = 1; this.good(d < 7 ? 2 : 1, this.mbx, this.py, d < 7); p.gone = 1; } } } if (p.x < -20) p.gone = 1; }
      k1fil(this.pp, function (p) { return p.gone; });
      for (i = 0; i < this.hs.length; i++) { var hh = this.hs[i]; if (hh.sub && !hh.got && hh.wy + hh.off + this.s > this.py + 40) { hh.got = 1; this.hurt(); } }
      var H = this.H, s = this.s; k1fil(this.hs, function (h) { return h.wy + s > H + 120; });
    },
    draw: function (now) {
      var c = this.ctx, i, s = this.s;
      c.fillStyle = "#3a3a44"; c.fillRect(this.W * 0.5, this.pt, this.W * 0.5, this.H); c.fillStyle = "#c8c3b6"; c.fillRect(this.W * 0.42, this.pt, this.W * 0.08, this.H);
      c.fillStyle = "#f2f2f2"; for (var y = ((s % 60) + 60) % 60 - 60; y < this.H; y += 60) c.fillRect(this.W * 0.75 - 3, y, 6, 30);
      for (i = 0; i < this.hs.length; i++) { var h = this.hs[i], y2 = h.wy + s, my = y2 + h.off, col = h.sub ? h.col : "#55555f"; fillR(c, 6, y2 - 60, this.W * 0.2, 110, 4, col); poly(c, [2, y2 - 60, 6 + this.W * 0.1, y2 - 100, 10 + this.W * 0.2, y2 - 60], h.sub ? "#a3203c" : "#3a3a44"); c.fillStyle = "#2b2b33"; c.fillRect(20, y2 - 30, 18, 18); c.fillStyle = "#8a5a2b"; c.fillRect(this.mbx - 2, my, 4, 22); fillR(c, this.mbx - 12, my - 12, 24, 14, 5, h.sub ? "#d9dde3" : "#9aa1ab"); if (h.sub) { c.fillStyle = h.got ? "#3ddc84" : "#ff4d6d"; c.fillRect(this.mbx + 10, my - 18, 4, 14); } }
      for (i = 0; i < this.pp.length; i++) { var p = this.pp[i]; c.save(); c.translate(p.x, p.wy + s); c.rotate(p.r); fillR(c, -8, -4, 16, 8, 3, "#f2f2f2"); c.restore(); }
      c.globalAlpha = this.fadeA(); var px = this.px, py = this.py; c.strokeStyle = "#2b2b33"; c.lineWidth = 3; c.beginPath(); c.arc(px, py + 20, 9, 0, TAU); c.arc(px, py - 16, 9, 0, TAU); c.stroke(); c.fillStyle = "#ff4d6d"; c.fillRect(px - 3, py - 14, 6, 34); buddy(c, px, py, 12, "#f2b48a", -1); c.globalAlpha = 1;
      this.ghost(this.W * 0.75, this.py - 60, now);
    }
  }), "city");

  /* 9. Justa */
  regD("justa", "Justa", "Tocá a la izquierda o a la derecha para aletear hacia ese lado. Caele encima a los otros jinetes.", "#ffd23f", G("Justa", {
    init: function () { var b = this.H - this.pb; this.lava = b - 26; this.pf = [{ x: -10, y: b - 120, w: this.W * 0.36 }, { x: this.W * 0.66, y: b - 120, w: this.W * 0.36 }, { x: this.W * 0.25, y: b - 290, w: this.W * 0.5 }, { x: -10, y: b - 450, w: this.W * 0.32 }, { x: this.W * 0.7, y: b - 450, w: this.W * 0.32 }]; this.p = this.rider(this.W / 2, this.pf[2].y - 2, "#ffd23f"); this.en = []; this.ne = 1.5; },
    rider: function (x, y, col) { return { x: x, y: y, vx: 0, vy: 0, col: col, f: 1, ai: 0 }; },
    act: function (x) { var s = x < this.W / 2 ? -1 : 1; this.p.vy = Math.max(-420, Math.min(this.p.vy, 0) - 270); this.p.vx += s * 95; this.p.f = s; this.acts++; sfx(300, 0.04, "square", 0.03, 1.5); },
    phys: function (e, dt) { e.vy += 640 * dt; e.vx *= (1 - 0.7 * dt); e.vx = clamp(e.vx, -260, 260); e.x += e.vx * dt; var py = e.y; e.y += e.vy * dt; if (e.x < 0) e.x += this.W; if (e.x > this.W) e.x -= this.W; if (e.y < this.pt + 24) { e.y = this.pt + 24; e.vy = 40; } for (var i = 0; i < this.pf.length; i++) { var q = this.pf[i]; if (e.vy > 0 && py <= q.y && e.y >= q.y && e.x > q.x - 6 && e.x < q.x + q.w + 6) { e.y = q.y; e.vy = 0; e.vx *= 0.9; } } },
    step: function (dt) {
      var i, p = this.p; this.phys(p, dt);
      if (p.y > this.lava) { this.hurt(); p.x = this.W / 2; p.y = this.pf[2].y - 2; p.vx = p.vy = 0; }
      this.ne -= dt; if (this.ne <= 0 && this.en.length < 2 + Math.min(3, Math.floor(this.t / 25))) { this.ne = 2.2; var L = Math.random() < 0.5; this.en.push(this.rider(L ? 10 : this.W - 10, this.pt + 60 + rnd(0, 120), pickOf(["#ff4d6d", "#c77dff", "#3ddc84"]))); }
      for (i = 0; i < this.en.length; i++) {
        var e = this.en[i]; e.ai -= dt; if (e.ai <= 0) { e.ai = rnd(0.25, 0.6); if (e.y > p.y - 40 + rnd(-70, 30)) e.vy = Math.max(-380, Math.min(e.vy, 0) - 240); e.vx += (p.x > e.x ? 1 : -1) * rnd(30, 80); e.f = e.vx > 0 ? 1 : -1; }
        this.phys(e, dt); if (e.y > this.lava) { e.y = this.lava - 1; e.vy = -320; }
        if (Math.abs(e.x - p.x) < 30 && Math.abs(e.y - p.y) < 28) { if (p.y < e.y - 5) { e.gone = 1; this.good(2, e.x, e.y, false); p.vy = -220; } else if (e.y < p.y - 5) { if (!this.hurt()) { p.vy = -300; p.vx = (p.x - e.x) * 6; } } else { p.vx = (p.x - e.x) * 8; e.vx = -p.vx; } }
      }
      k1fil(this.en, function (e) { return e.gone; });
    },
    rid: function (c, e, now) { var x = e.x, y = e.y; c.fillStyle = "#c98a4a"; c.fillRect(x - 6, y - 10, 3, 10); c.fillRect(x + 3, y - 10, 3, 10); k1ell(c, x, y - 18, 16, 10, "#f2efe6"); var fl = e.vy < 0 ? -12 : 4; poly(c, [x - 4, y - 20, x - 20 * e.f, y - 20 + fl, x + 4, y - 16], "#d9d3c2"); dot(c, x + 14 * e.f, y - 26, 6, "#f2efe6"); poly(c, [x + 19 * e.f, y - 27, x + 26 * e.f, y - 25, x + 19 * e.f, y - 23], "#ff9f1c"); buddy(c, x - 2 * e.f, y - 36, 9, e.col, e.f); k1ln(c, x - 6 * e.f, y - 30, x + 30 * e.f, y - 40, 3, "#d9dde3"); },
    draw: function (now) {
      var c = this.ctx, i;
      c.fillStyle = "#ff6a00"; c.fillRect(0, this.lava, this.W, this.H - this.lava); c.fillStyle = "#ffd23f"; for (i = 0; i < this.W; i += 40) c.fillRect(i + ((now / 30) % 40), this.lava + 6, 18, 4);
      for (i = 0; i < this.pf.length; i++) { var q = this.pf[i]; fillR(c, q.x, q.y, q.w, 14, 5, "#8a6a4a"); c.fillStyle = "#5c4430"; c.fillRect(q.x + 6, q.y + 10, q.w - 12, 4); }
      for (i = 0; i < this.en.length; i++) this.rid(c, this.en[i], now);
      c.globalAlpha = this.fadeA(); this.rid(c, this.p, now); c.globalAlpha = 1;
      this.ghost(this.p.x + 50, this.p.y - 60, now);
    }
  }), "volcano");

  /* 10. Recortá */
  regD("recorta", "Recortá", "Tocá hacia donde querés ir. Salí del borde y volvé para quedarte con ese pedazo. Que la bola no toque tu línea.", "#2ec4b6", G("Recorta", {
    init: function () { this.cs = 13; this.C = Math.floor((this.W - 10) / this.cs); this.R = Math.floor((this.H - this.pt - this.pb - 10) / this.cs); this.ox = (this.W - this.C * this.cs) / 2; this.oy = this.pt + 5; this.lv = 0; this.lvl(); },
    lvl: function () { var C = this.C, R = this.R, k; this.g = new Uint8Array(C * R); for (k = 0; k < C * R; k++) { var c = k % C, r = (k / C) | 0; if (c === 0 || r === 0 || c === C - 1 || r === R - 1) this.g[k] = 1; } this.pc = (C / 2) | 0; this.pr = R - 1; this.d = [0, 0]; this.trail = []; this.acc = 0; this.bl = []; for (k = 0; k <= Math.min(2, this.lv); k++) this.bl.push({ x: rnd(C * 0.3, C * 0.7), y: rnd(R * 0.3, R * 0.6), vx: pickOf([-1, 1]) * rnd(6, 9), vy: pickOf([-1, 1]) * rnd(6, 9) }); this.cnt(); },
    cnt: function () { var n = 0; for (var k = 0; k < this.g.length; k++) if (this.g[k] === 1) n++; this.fl = n / this.g.length; return n; },
    act: function (x, y) { this.d = k1dir(x, y, this.ox + (this.pc + 0.5) * this.cs, this.oy + (this.pr + 0.5) * this.cs); this.acts++; },
    cell: function (x, y) { var c = Math.floor(x), r = Math.floor(y); if (c < 0 || r < 0 || c >= this.C || r >= this.R) return 1; return this.g[r * this.C + c]; },
    miss: function () { for (var i = 0; i < this.trail.length; i++) this.g[this.trail[i]] = 0; if (this.trail.length) { this.pc = this.sp[0]; this.pr = this.sp[1]; } this.trail = []; this.d = [0, 0]; this.hurt(); },
    close: function () {
      var C = this.C, k, i, n0 = this.cnt(); for (i = 0; i < this.trail.length; i++) this.g[this.trail[i]] = 1; this.trail = [];
      var seen = new Uint8Array(this.g.length), st = [];
      for (i = 0; i < this.bl.length; i++) { var s0 = Math.floor(this.bl[i].y) * C + Math.floor(this.bl[i].x); if (!this.g[s0] && !seen[s0]) { seen[s0] = 1; st.push(s0); } }
      while (st.length) { k = st.pop(); var c = k % C, nb = [c > 0 ? k - 1 : -1, c < C - 1 ? k + 1 : -1, k - C, k + C]; for (i = 0; i < 4; i++) { var q = nb[i]; if (q >= 0 && q < this.g.length && !this.g[q] && !seen[q]) { seen[q] = 1; st.push(q); } } }
      for (k = 0; k < this.g.length; k++) if (!this.g[k] && !seen[k]) this.g[k] = 1;
      var gain = this.cnt() - n0; this.add(Math.max(1, Math.round(gain / 18)));
      if (this.fl >= 0.75) { this.lv++; this.good(5, this.W / 2, this.cy, true); this.lvl(); }
    },
    step: function (dt) {
      var i;
      this.acc += dt * 11;
      while (this.acc >= 1) { this.acc -= 1; if (!this.d[0] && !this.d[1]) break; var nc = this.pc + this.d[0], nr = this.pr + this.d[1]; if (nc < 0 || nr < 0 || nc >= this.C || nr >= this.R || this.g[nr * this.C + nc] === 2) { this.d = [0, 0]; break; } var was = this.g[this.pr * this.C + this.pc]; this.pc = nc; this.pr = nr; var k = nr * this.C + nc; if (this.g[k] === 0) { if (!this.trail.length && was === 1) this.sp = [this.pc - this.d[0], this.pr - this.d[1]]; this.g[k] = 2; this.trail.push(k); } else if (this.g[k] === 1 && this.trail.length) { this.close(); this.d = [0, 0]; break; } }
      for (i = 0; i < this.bl.length; i++) {
        var b = this.bl[i], nx = b.x + b.vx * dt, ny; var cx = this.cell(nx, b.y); if (cx === 2) { this.miss(); return; } if (cx === 1) b.vx = -b.vx; else b.x = nx;
        ny = b.y + b.vy * dt; var cy = this.cell(b.x, ny); if (cy === 2) { this.miss(); return; } if (cy === 1) b.vy = -b.vy; else b.y = ny;
        if (this.trail.length && Math.hypot(b.x - this.pc - 0.5, b.y - this.pr - 0.5) < 1.2) { this.miss(); return; }
      }
    },
    draw: function (now) {
      var c = this.ctx, k, cs = this.cs;
      for (k = 0; k < this.g.length; k++) { var v = this.g[k]; if (v) { c.fillStyle = v === 1 ? "#2ec4b6" : "#ffd23f"; c.fillRect(this.ox + (k % this.C) * cs, this.oy + Math.floor(k / this.C) * cs, cs + 0.5, cs + 0.5); } }
      for (k = 0; k < this.bl.length; k++) { var b = this.bl[k]; buddy(c, this.ox + b.x * cs, this.oy + b.y * cs, 11, "#ff4d6d"); }
      c.globalAlpha = this.fadeA(); dot(c, this.ox + (this.pc + 0.5) * cs, this.oy + (this.pr + 0.5) * cs, 8, "#fff"); dot(c, this.ox + (this.pc + 0.5) * cs, this.oy + (this.pr + 0.5) * cs, 4, "#ff5fd2"); c.globalAlpha = 1;
      fillR(c, 16, this.pt - 4, (this.W - 92), 5, 3, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt - 4, (this.W - 92) * clamp((this.fl - 0.1) / 0.65, 0, 1), 5, 3, "#ffd23f");
      this.ghost(this.ox + this.pc * cs, this.oy + this.pr * cs - 80, now);
    }
  }), "arcade");

  /* 11. Taladro */
  regD("taladro", "Taladro", "Tocá a la izquierda, a la derecha o al medio para picar hacia abajo. Juntá aire y cuidado con las rocas.", "#ff5fd2", G("Taladro", {
    init: function () { this.N = 7; this.s = this.W / this.N; this.rows = {}; this.pc = 3; this.pr = 2; this.cam = 0; this.air = 1; this.deep = 2; this.ft = 0; this.rt = 0; },
    row: function (r) { if (this.rows[r]) return this.rows[r]; var a = []; for (var c = 0; c < this.N; c++) { var v = 0, q = Math.random(); if (r > 3) { if (q < 0.62) v = 1; else if (q < 0.7) v = 2; else if (q < 0.75) v = 3; else if (q < 0.84) v = 4; } a.push({ v: v, hp: 3, col: ri(0, 4), wob: 0 }); } this.rows[r] = a; return a; },
    at: function (c, r) { if (c < 0 || c >= this.N) return { v: 9 }; return this.row(r)[c]; },
    dig: function (c, r) { var q = this.at(c, r); if (q.v === 1) { q.v = 0; sfx(200, 0.05, "square", 0.04, 0.7); return false; } if (q.v === 2) { q.hp--; sfx(150, 0.05, "square", 0.04, 0.7); if (q.hp <= 0) q.v = 0; return false; } return q.v === 0 || q.v === 3; },
    act: function (x) { this.acts++; var dc = x < this.W / 3 ? -1 : x > this.W * 2 / 3 ? 1 : 0, dr = dc ? 0 : 1; if (this.dig(this.pc + dc, this.pr + dr)) { this.pc += dc; this.pr += dr; this.grab(); } },
    grab: function () { var q = this.at(this.pc, this.pr); if (q.v === 3) { q.v = 0; this.air = Math.min(1, this.air + 0.35); this.add(1); } if (this.pr > this.deep) { this.add(this.pr - this.deep); this.deep = this.pr; } },
    step: function (dt) {
      var c, r;
      this.air -= dt * (0.04 + Math.min(this.deep, 300) * 0.0002); if (this.air <= 0) { this.air = 1; this.hurt(); }
      this.ft -= dt; if (this.ft <= 0) { this.ft = 0.11; var b = this.at(this.pc, this.pr + 1); if (b.v === 0 || b.v === 3) { this.pr++; this.grab(); } }
      this.rt -= dt; if (this.rt <= 0) { this.rt = 0.12; for (r = this.pr + 1; r >= Math.floor(this.cam) - 1; r--) for (c = 0; c < this.N; c++) { var q = this.at(c, r); if (q.v !== 4) continue; var u = this.at(c, r + 1); if (u.v === 0 || (c === this.pc && r + 1 === this.pr)) { q.wob += 0.12; if (q.wob > 0.5) { if (c === this.pc && r + 1 === this.pr) { q.v = 0; this.hurt(); } else { u.v = 4; u.wob = 0.6; q.v = 0; q.wob = 0; } } } else q.wob = 0; } }
      this.cam += (this.pr - 3 - this.cam) * Math.min(1, dt * 6);
      for (var k in this.rows) if (k < this.cam - 4) delete this.rows[k];
    },
    draw: function (now) {
      var c = this.ctx, s = this.s, r, cc, oy = this.pt + 10, cols = ["#ff4d6d", "#3ddc84", "#ffd23f", "#c77dff"];
      var r0 = Math.floor(this.cam) - 1, r1 = r0 + Math.ceil((this.H - this.pt) / s) + 2;
      for (r = r0; r <= r1; r++) for (cc = 0; cc < this.N; cc++) { var q = this.at(cc, r), x = cc * s, y = oy + (r - this.cam) * s; if (y > this.H - this.pb) continue; var wx = q.wob > 0 ? Math.sin(now / 30) * 2 : 0;
        if (q.v === 1) fillR(c, x + 2, y + 2, s - 4, s - 4, 8, cols[q.col]); else if (q.v === 2) { fillR(c, x + 2, y + 2, s - 4, s - 4, 6, "#9aa1ab"); k1ln(c, x + 12, y + 12, x + s - 12, y + s - 12, 4, "#55555f"); k1ln(c, x + s - 12, y + 12, x + 12, y + s - 12, 4, "#55555f"); } else if (q.v === 3) { dot(c, x + s / 2, y + s / 2, s * 0.3, "#f2f2f2"); dot(c, x + s / 2 - 5, y + s / 2 - 5, s * 0.1, "#fff"); } else if (q.v === 4) spRock(c, x + s / 2 + wx, y + s / 2, s * 0.42, "#8a8a99", cc * 7 + r); }
      var px = (this.pc + 0.5) * s, py = oy + (this.pr - this.cam + 0.5) * s;
      c.globalAlpha = this.fadeA(); buddy(c, px, py, s * 0.32, "#ff5fd2", 1); fillR(c, px - s * 0.3, py - s * 0.42, s * 0.6, s * 0.18, 5, "#ffd23f"); poly(c, [px - 6, py + s * 0.28, px + 6, py + s * 0.28, px, py + s * 0.48], "#d9dde3"); c.globalAlpha = 1;
      fillR(c, 16, this.pt + 2, this.W - 92, 8, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (this.W - 92) * clamp(this.air, 0, 1), 8, 4, this.air < 0.3 ? "#ff4d6d" : "#f2f2f2");
      this.ghost(px, py + 70, now);
    }
  }), "cave");

  /* 12. Minero de oro */
  regD("minero", "Minero de oro", "Tocá para tirar el gancho cuando apunte al oro. Las piedras pesan y no valen. Llená la barra antes de que se acabe el tiempo.", "#ffd23f", G("Minero", {
    init: function () { this.ax = this.W / 2; this.ay = this.pt + 70; this.a = 0; this.sw = 0; this.len = 30; this.ph = 0; this.got = null; this.goal = 6; this.round(); },
    round: function () {
      this.items = []; var k, tries;
      for (k = 0; k < 10; k++) { var q = Math.random(), it; if (q < 0.35) it = { v: 1, r: 13, w: 1.5 }; else if (q < 0.55) it = { v: 3, r: 26, w: 4 }; else if (q < 0.7) it = { v: 2, r: 9, w: 1, gem: 1 }; else it = { v: 0, r: rnd(16, 24), w: 4.5, rock: 1 };
        for (tries = 0; tries < 12; tries++) { it.x = rnd(30, this.W - 30); it.y = rnd(this.ay + 130, this.H - this.pb - 30); var ok = true; for (var j = 0; j < this.items.length; j++) if (Math.hypot(it.x - this.items[j].x, it.y - this.items[j].y) < it.r + this.items[j].r + 10) ok = false; if (ok) break; } this.items.push(it); }
      this.sc0 = 0; this.tl = 25;
    },
    act: function () { if (this.ph === 0) { this.ph = 1; this.acts++; sfx(300, 0.08, "sawtooth", 0.03, 1.5); } },
    tip: function () { return { x: this.ax + Math.sin(this.a) * this.len, y: this.ay + Math.cos(this.a) * this.len }; },
    step: function (dt) {
      var i, p; this.tl -= dt;
      if (this.ph === 0) { this.sw += dt * 1.7; this.a = Math.sin(this.sw) * 1.25; }
      else if (this.ph === 1) { this.len += 440 * dt; p = this.tip(); for (i = 0; i < this.items.length; i++) { var it = this.items[i]; if (Math.hypot(p.x - it.x, p.y - it.y) < it.r + 8) { this.got = it; this.ph = 2; break; } } if (p.x < 0 || p.x > this.W || p.y > this.H - this.pb) this.ph = 2; }
      else { this.len -= (this.got ? 400 / this.got.w : 650) * dt; if (this.got) { p = this.tip(); this.got.x = p.x; this.got.y = p.y + this.got.r * 0.6; } if (this.len <= 30) { this.len = 30; this.ph = 0; if (this.got) { var v = this.got.v; this.items.splice(this.items.indexOf(this.got), 1); this.got = null; if (v) { this.add(v); this.sc0 += v; } if (this.sc0 >= this.goal) { this.good(3, this.ax, this.ay, true); this.goal = Math.min(16, this.goal + 2); this.round(); return; } if (!this.items.length) this.round(); } } }
      if (this.tl <= 0) { this.hurt(); this.round(); }
    },
    draw: function (now) {
      var c = this.ctx, i, p = this.tip();
      c.fillStyle = "#c98a4a"; c.fillRect(0, this.ay - 6, this.W, 8);
      buddy(c, this.ax + 40, this.ay - 26, 16, "#f2b48a", -1); fillR(c, this.ax + 24, this.ay - 46, 32, 8, 3, "#ff4d6d"); fillR(c, this.ax - 14, this.ay - 26, 28, 22, 4, "#8a5a2b");
      for (i = 0; i < this.items.length; i++) { var it = this.items[i]; if (it.rock) spRock(c, it.x, it.y, it.r, "#8a8a99", i); else if (it.gem) gem(c, it.x, it.y, it.r + 2, "#ff5fd2"); else { poly(c, [it.x - it.r, it.y + it.r * 0.3, it.x - it.r * 0.6, it.y - it.r * 0.7, it.x + it.r * 0.4, it.y - it.r * 0.9, it.x + it.r, it.y - it.r * 0.1, it.x + it.r * 0.7, it.y + it.r * 0.8, it.x - it.r * 0.4, it.y + it.r * 0.9], "#ffd23f"); poly(c, [it.x - it.r * 0.5, it.y - it.r * 0.4, it.x, it.y - it.r * 0.6, it.x + it.r * 0.1, it.y - it.r * 0.1], "#fff3b0"); } }
      k1ln(c, this.ax, this.ay, p.x, p.y, 2, "#2b2b33");
      c.save(); c.translate(p.x, p.y); c.rotate(-this.a); var op = this.got ? 0.3 : 0.7; c.strokeStyle = "#d9dde3"; c.lineWidth = 4; c.lineCap = "round"; c.beginPath(); c.moveTo(0, 0); c.lineTo(-10 * op - 4, 12); c.moveTo(0, 0); c.lineTo(10 * op + 4, 12); c.stroke(); c.lineCap = "butt"; c.restore();
      fillR(c, 16, this.pt + 2, this.W - 92, 7, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (this.W - 92) * clamp(this.sc0 / this.goal, 0, 1), 7, 4, "#ffd23f");
      fillR(c, 16, this.pt + 13, this.W - 92, 5, 3, "rgba(255,255,255,0.12)"); fillR(c, 16, this.pt + 13, (this.W - 92) * clamp(this.tl / 25, 0, 1), 5, 3, this.tl < 6 ? "#ff4d6d" : "#f2f2f2");
      this.ghost(this.ax, this.ay + 120, now);
    }
  }), "desert");
