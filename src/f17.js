
  /* ===== 100 copias de juegos conocidos (7/8) ===== */

  /* 73. Ascensor */
  regD("ascensor", "Ascensor", "El ascensor sube y baja solo. Tocá para tirar una flecha y reventá los globos de los lobos antes de que lleguen abajo.", "#ff9f1c", G("Ascensor", {
    init: function () { this.ex = 64; this.top = this.pt + 80; this.bot = this.H - this.pb - 80; this.ey = this.cy; this.ph = 0; this.ar = []; this.wf = []; this.nw = 1; this.cd = 0; },
    act: function () { if (this.cd > 0) return; this.cd = 0.3; this.ar.push({ x: this.ex + 26, y: this.ey }); this.acts++; sfx(600, 0.04, "triangle", 0.04, 0.6); },
    step: function (dt) {
      var i, j; this.ph += dt * (1.1 + Math.min(this.t, 120) * 0.006); this.ey = this.top + (this.bot - this.top) * (0.5 - 0.5 * Math.cos(this.ph)); this.cd -= dt;
      this.nw -= dt; if (this.nw <= 0) { this.nw = Math.max(0.7, 1.8 - this.t * 0.01) * rnd(0.7, 1.3); this.wf.push({ x: rnd(140, this.W - 80), y: this.pt - 20, v: rnd(28, 50) + Math.min(this.t, 120) * 0.25, fall: 0, col: pickOf(["#ff4d6d", "#ffd23f", "#3ddc84", "#c77dff"]) }); }
      for (i = 0; i < this.ar.length; i++) { var a = this.ar[i]; a.x += 520 * dt; if (a.x > this.W + 20) a.gone = 1; for (j = 0; j < this.wf.length; j++) { var w = this.wf[j]; if (!w.fall && Math.abs(a.x - w.x) < 16 && Math.abs(a.y - (w.y - 34)) < 18) { w.fall = 1; a.gone = 1; this.add(1); sfx(900, 0.05, "square", 0.03, 0.4); break; } } }
      for (i = 0; i < this.wf.length; i++) { var q = this.wf[i]; if (q.fall) { q.y += 380 * dt; if (q.y > this.H) q.gone = 1; } else { q.y += q.v * dt; if (q.y > this.bot + 50) { q.gone = 1; this.hurt(); } } }
      k1fil(this.ar, function (a) { return a.gone; }); k1fil(this.wf, function (w) { return w.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, W = this.W;
      c.fillStyle = "#6b4423"; c.fillRect(0, this.pt, 30, this.H); c.fillStyle = "#2f8f4e"; c.fillRect(0, this.bot + 50, W, this.H);
      k1ln(c, this.ex, this.pt, this.ex, this.ey - 30, 2, "#d9dde3");
      for (i = 0; i < this.wf.length; i++) { var w = this.wf[i]; if (!w.fall) { k1ln(c, w.x, w.y - 18, w.x, w.y - 6, 1.5, "#d9dde3"); spBalloon(c, w.x, w.y - 34, 16, w.col); } buddy(c, w.x, w.y, 12, "#8a8a99", 1); poly(c, [w.x - 10, w.y - 9, w.x - 6, w.y - 20, w.x - 2, w.y - 10], "#8a8a99"); poly(c, [w.x + 10, w.y - 9, w.x + 6, w.y - 20, w.x + 2, w.y - 10], "#8a8a99"); }
      for (i = 0; i < this.ar.length; i++) { var a = this.ar[i]; k1ln(c, a.x - 22, a.y, a.x, a.y, 3, "#c98a4a"); poly(c, [a.x + 6, a.y, a.x - 2, a.y - 5, a.x - 2, a.y + 5], "#d9dde3"); }
      c.globalAlpha = this.fadeA(); fillR(c, this.ex - 18, this.ey - 12, 44, 32, 6, "#c98a4a"); buddy(c, this.ex + 4, this.ey - 22, 14, "#ffb3c1", 1); dot(c, this.ex + 16, this.ey - 20, 4, "#ff8fa3"); c.globalAlpha = 1;
      this.ghost(W * 0.5, this.cy, now);
    }
  }), "forest");

  /* 74. Safari de fotos */
  regD("safari", "Safari de fotos", "Tocá a los animales para sacarles foto. Si saltan mirando a la cámara, la foto vale más. Tenés pocas fotos por rollo.", "#3ddc84", G("Safari", {
    init: function () { this.roll(); },
    roll: function () { this.film = 10; this.pts = 0; this.an = []; for (var k = 0; k < 5; k++) this.an.push({ x: 50 + k * (this.W - 120) / 4, y: this.pt + 200 + (k % 2) * 180 + rnd(0, 60), st: 0, tm: rnd(0.5, 2.5), col: pickOf(["#ffd23f", "#ff9f1c", "#c77dff", "#ff5fd2", "#3ddc84"]), big: Math.random() < 0.3 }); this.flash = 0; this.wait = 0; },
    act: function (x, y) { if (this.film <= 0) return; this.film--; this.flash = 0.08; this.acts++; sfx(1200, 0.04, "square", 0.03, 0.5); var best = null; for (var i = 0; i < this.an.length; i++) { var a = this.an[i]; if (a.st > 0 && Math.hypot(a.x - x, a.y - 30 - y) < 46) best = a; } if (best) { if (best.st === 2) { this.good(2, best.x, best.y - 40, true); this.pts += 2; } else { this.add(1); this.pts += 1; } best.st = 0; best.tm = rnd(1, 2.5); } if (this.film <= 0) this.wait = 1; },
    step: function (dt) {
      var i; this.flash -= dt;
      if (this.wait > 0) { this.wait -= dt; if (this.wait <= 0) { if (this.pts < 7) this.hurt(); this.roll(); } return; }
      for (i = 0; i < this.an.length; i++) { var a = this.an[i]; a.tm -= dt; if (a.tm <= 0) { if (a.st === 0) { a.st = 1; a.tm = rnd(0.5, 1.1); } else if (a.st === 1) { if (Math.random() < 0.55) { a.st = 2; a.tm = Math.max(0.35, 0.7 - this.t * 0.003); } else { a.st = 0; a.tm = rnd(0.6, 2); } } else { a.st = 0; a.tm = rnd(0.6, 2); } } }
    },
    draw: function (now) {
      var c = this.ctx, i, W = this.W;
      for (i = 0; i < this.an.length; i++) { var a = this.an[i], r = a.big ? 26 : 20, up = a.st === 2 ? 46 : a.st === 1 ? 18 : 0;
        if (up > 0) { var y = a.y - up; poly(c, [a.x - r * 0.8, y - r * 0.5, a.x - r * 0.5, y - r * 1.4, a.x - r * 0.15, y - r * 0.7], a.col); poly(c, [a.x + r * 0.8, y - r * 0.5, a.x + r * 0.5, y - r * 1.4, a.x + r * 0.15, y - r * 0.7], a.col); dot(c, a.x, y, r, a.col); if (a.st === 2) face(c, a.x, y, r * 0.85, 0); else { dot(c, a.x, y - 2, r * 0.7, a.col); } }
        dot(c, a.x - 30, a.y + 6, 24, "#2f8f4e"); dot(c, a.x + 30, a.y + 6, 24, "#2f8f4e"); dot(c, a.x, a.y, 30, "#3ddc84"); dot(c, a.x - 10, a.y - 10, 10, "#5ee89e"); }
      for (i = 0; i < this.film; i++) fillR(c, 18 + i * 14, this.H - this.pb - 30, 10, 16, 2, "#f2f2f2");
      c.strokeStyle = "rgba(255,255,255,0.35)"; c.lineWidth = 3; var m = 26; c.beginPath(); c.moveTo(m, this.pt + m + 30); c.lineTo(m, this.pt + m); c.lineTo(m + 30, this.pt + m); c.moveTo(W - m - 70, this.pt + m); c.lineTo(W - m - 40, this.pt + m); c.lineTo(W - m - 40, this.pt + m + 30); c.stroke();
      if (this.flash > 0) { c.fillStyle = "rgba(255,255,255,0.3)"; c.fillRect(0, this.pt, W, this.H); }
      var a0 = this.an.find(function (a) { return a.st === 2; }); if (a0) this.ghost(a0.x + 10, a0.y - 40, now);
    }
  }), "forest");

  /* 75. Cuadradito */
  regD("cuadradito", "Cuadradito", "Tocá donde querés ir. Llevá el cuadrado a la zona verde de la derecha sin tocar los puntos rojos.", "#ff4d6d", G("Cuadradito", {
    init: function () { this.x0 = 18; this.x1 = this.W - 18; this.y0 = this.pt + 110; this.y1 = this.H - this.pb - 110; this.lvl = 0; this.room(); },
    room: function () { this.px = this.x0 + 30; this.py = (this.y0 + this.y1) / 2; this.tx = this.px; this.ty = this.py; this.ds = []; var n = 5 + Math.min(4, this.lvl), k, mode = this.lvl % 3, L = this.x0 + 70, R = this.x1 - 70; for (k = 0; k < n; k++) { var x = L + (k + 0.5) * (R - L) / n; if (mode === 0) this.ds.push({ m: 0, x: x, y: 0, ph: k % 2 ? 0 : PI, sp: 1.6 + this.lvl * 0.15 }); else if (mode === 1) this.ds.push({ m: 1, x: 0, y: this.y0 + (k + 0.5) * (this.y1 - this.y0) / n, ph: k * 0.8, sp: 1.4 + this.lvl * 0.12 }); else this.ds.push({ m: 2, a: k * TAU / n, r: 40 + (k % 3) * 40, sp: 1.2 + this.lvl * 0.1 }); } this.t0 = 0; },
    act: function (x, y) { this.tx = x; this.ty = y; this.acts++; },
    dp: function (d) { var L = this.x0 + 70, R = this.x1 - 70, cy = (this.y0 + this.y1) / 2, cx = (L + R) / 2; if (d.m === 0) return { x: d.x, y: this.y0 + 14 + (this.y1 - this.y0 - 28) * (0.5 + 0.5 * Math.sin(this.t0 * d.sp + d.ph)) }; if (d.m === 1) return { x: L + (R - L) * (0.5 + 0.5 * Math.sin(this.t0 * d.sp + d.ph)), y: d.y }; return { x: cx + Math.cos(d.a + this.t0 * d.sp) * d.r, y: cy + Math.sin(d.a + this.t0 * d.sp) * d.r }; },
    step: function (dt) {
      var i; this.t0 += dt; var dx = this.tx - this.px, dy = this.ty - this.py, d = Math.hypot(dx, dy); if (d > 2) { this.px += dx / d * Math.min(d, 115 * dt); this.py += dy / d * Math.min(d, 115 * dt); } this.px = clamp(this.px, this.x0 + 10, this.x1 - 10); this.py = clamp(this.py, this.y0 + 10, this.y1 - 10);
      for (i = 0; i < this.ds.length; i++) { var p = this.dp(this.ds[i]); if (Math.abs(p.x - this.px) < 18 && Math.abs(p.y - this.py) < 18) { this.hurt(); this.px = this.x0 + 30; this.py = (this.y0 + this.y1) / 2; this.tx = this.px; this.ty = this.py; return; } }
      if (this.px > this.x1 - 55) { this.good(3, this.px, this.py, true); this.lvl++; this.room(); }
    },
    draw: function (now) {
      var c = this.ctx, i, W = this.W;
      c.fillStyle = "#f2f2f2"; c.fillRect(this.x0 - 4, this.y0 - 4, this.x1 - this.x0 + 8, this.y1 - this.y0 + 8);
      for (var yy = this.y0; yy < this.y1; yy += 26) for (var xx = this.x0; xx < this.x1; xx += 26) { c.fillStyle = ((xx - this.x0) / 26 + (yy - this.y0) / 26) % 2 ? "#e6e1f5" : "#f7f5ff"; c.fillRect(xx, yy, Math.min(26, this.x1 - xx), Math.min(26, this.y1 - yy)); }
      c.fillStyle = "#b6f0c8"; c.fillRect(this.x0, this.y0, 60, this.y1 - this.y0); c.fillRect(this.x1 - 60, this.y0, 60, this.y1 - this.y0);
      for (i = 0; i < this.ds.length; i++) { var p = this.dp(this.ds[i]); dot(c, p.x, p.y, 10, "#2b2b33"); dot(c, p.x, p.y, 7, "#ff4d6d"); }
      c.globalAlpha = this.fadeA(); fillR(c, this.px - 10, this.py - 10, 20, 20, 2, "#2b2b33"); fillR(c, this.px - 7, this.py - 7, 14, 14, 2, "#ff4d6d"); c.globalAlpha = 1;
      this.ghost(this.px + 60, this.py + 20, now);
    }
  }), "arcade");

  /* 76. Gusano gigante */
  regD("gusano", "Gusano gigante", "Mantené apretado para subir y saltar fuera de la tierra. Soltá para volver a bajar. Comete lo que anda por arriba antes de que te dé hambre.", "#c98a4a", G("Gusano", {
    ctl: "hold",
    init: function () { this.gy = this.cy - 40; this.x = 0; this.y = this.gy + 120; this.a = 0; this.vx = 260; this.vy = 0; this.tr = []; this.food = []; this.nf = 0.5; this.hun = 1; },
    step: function (dt) {
      var i, sp = 260 + Math.min(this.t, 120) * 1.2;
      if (this.y > this.gy) { var want = this.holding ? -1.05 : 0.7; this.a += clamp(want - this.a, -3 * dt, 3 * dt); this.vx = Math.cos(this.a) * sp; this.vy = Math.sin(this.a) * sp; if (this.y > this.H - this.pb - 20) { this.a = -Math.abs(this.a) - 0.1; } }
      else { this.vy += 900 * dt; this.a = Math.atan2(this.vy, this.vx); }
      this.x += this.vx * dt; this.y += this.vy * dt; this.y = Math.min(this.y, this.H - this.pb - 15);
      this.tr.unshift({ x: this.x, y: this.y }); if (this.tr.length > 24) this.tr.pop();
      this.hun -= dt * 0.07; if (this.hun <= 0) { this.hun = 1; this.hurt(); }
      this.nf -= dt; if (this.nf <= 0) { this.nf = rnd(0.6, 1.4); var q = Math.random(); this.food.push(q < 0.15 ? { x: this.x + this.W + 40, y: this.pt + rnd(60, 140), k: "pl", v: -60 } : { x: this.x + this.W + 40, y: this.gy, k: q < 0.6 ? "p" : q < 0.85 ? "cow" : "car", v: rnd(-40, 40) }); }
      for (i = 0; i < this.food.length; i++) { var f = this.food[i]; f.x += f.v * dt; var fy = f.k === "pl" ? f.y : f.y - (f.k === "p" ? 14 : 18); if (Math.hypot(f.x - this.x, fy - this.y) < (f.k === "car" ? 34 : 26)) { f.gone = 1; this.hun = Math.min(1, this.hun + 0.25); this.good(f.k === "pl" ? 3 : f.k === "car" ? 2 : 1, f.x - this.x + this.W * 0.3, fy, f.k === "pl"); } if (f.x < this.x - this.W) f.gone = 1; }
      k1fil(this.food, function (f) { return f.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, cam = this.x - this.W * 0.3, gy = this.gy;
      c.fillStyle = "#8a5a2b"; c.fillRect(0, gy, this.W, this.H - gy); c.fillStyle = "#3ddc84"; c.fillRect(0, gy - 6, this.W, 8); c.fillStyle = "#6b4423"; for (i = 0; i < 10; i++) { var rx = ((i * 97 - cam * 1) % (this.W + 40) + this.W + 40) % (this.W + 40) - 20; dot(c, rx, gy + 60 + (i % 3) * 70, 8, "#6b4423"); }
      for (i = 0; i < this.food.length; i++) { var f = this.food[i], fx = f.x - cam; if (f.k === "p") buddy(c, fx, gy - 14, 10, "#f2b48a"); else if (f.k === "cow") { k1ell(c, fx, gy - 18, 22, 13, "#f2f2f2"); dot(c, fx - 6, gy - 20, 5, "#2b2b33"); dot(c, fx + 20, gy - 24, 8, "#f2f2f2"); c.fillStyle = "#f2f2f2"; c.fillRect(fx - 16, gy - 8, 4, 8); c.fillRect(fx + 10, gy - 8, 4, 8); } else if (f.k === "car") spCar(c, fx - 28, gy - 26, 56, 26, "#ff4d6d", 1); else { poly(c, [fx - 26, f.y, fx + 22, f.y - 4, fx + 26, f.y + 4], "#d9dde3"); poly(c, [fx - 4, f.y - 2, fx + 4, f.y - 16, fx + 10, f.y], "#9aa1ab"); } }
      c.globalAlpha = this.fadeA(); for (i = this.tr.length - 1; i >= 0; i -= 2) dot(c, this.tr[i].x - cam, this.tr[i].y, 15 - i * 0.25, i % 4 ? "#c98a4a" : "#b07a3f"); var hx = this.x - cam, hy = this.y; dot(c, hx, hy, 18, "#c98a4a"); dot(c, hx + Math.cos(this.a) * 10, hy + Math.sin(this.a) * 10, 9, "#2b2b33"); dot(c, hx + Math.cos(this.a - 1.2) * 10, hy + Math.sin(this.a - 1.2) * 10, 3, "#fff"); c.globalAlpha = 1;
      fillR(c, 16, this.pt + 2, this.W - 92, 8, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (this.W - 92) * clamp(this.hun, 0, 1), 8, 4, this.hun < 0.3 ? "#ff4d6d" : "#3ddc84");
      this.ghostHold(this.W * 0.7, this.H - this.pb - 60, now);
    }
  }), "desert");

  /* 77. Fútbol loco */
  regD("futbolloco", "Fútbol loco", "Tocá para que tu jugador salte y patee. Se tambalea solo: elegí bien el momento. Hacé gol a la derecha.", "#3ddc84", G("Futbolloco", {
    init: function () { this.gy = this.H - this.pb - 50; this.gw = 36; this.gh = 150; this.kick(); },
    kick: function () { this.me = { x: this.W * 0.3, y: this.gy, vy: 0, a: 0, va: 1.2, col: "#3ddc84", f: 1 }; this.ai = { x: this.W * 0.7, y: this.gy, vy: 0, a: 0, va: -1.2, col: "#ff4d6d", f: -1, cd: 0.8 }; this.b = { x: this.W / 2, y: this.gy - 260, vx: 0, vy: 0 }; },
    jmp: function (p) { if (p.y >= this.gy) { p.vy = -560; p.va += p.f * 7; } },
    act: function () { this.acts++; this.jmp(this.me); sfx(300, 0.05, "square", 0.04, 1.4); },
    pl: function (p, dt) { p.va += (-p.a * 9 + Math.sin(this.t * 2.3 + p.x) * 3) * dt; p.va *= (1 - 0.6 * dt); p.a += p.va * dt; p.a = clamp(p.a, -1.4, 1.4); p.vy += 1500 * dt; p.y += p.vy * dt; p.x += Math.sin(p.a) * 140 * dt * (p.y < this.gy ? 1.6 : 0.6); if (p.y > this.gy) { p.y = this.gy; p.vy = 0; } p.x = clamp(p.x, this.gw + 20, this.W - this.gw - 20);
      var hx = p.x + Math.sin(p.a) * 90, hy = p.y - Math.cos(p.a) * 90; if (segHit(this.b, 12, p.x, p.y, hx, hy, 0.6, p.f * 120 + Math.cos(p.a) * p.va * 60, -120)) sfx(220, 0.04, "square", 0.04, 1.2); var dx = this.b.x - hx, dy = this.b.y - hy, d = Math.hypot(dx, dy); if (d < 30 && d > 0) { this.b.x = hx + dx / d * 30; this.b.y = hy + dy / d * 30; this.b.vx += dx / d * 200; this.b.vy += dy / d * 200; } },
    step: function (dt) {
      var b = this.b, ai = this.ai; this.pl(this.me, dt); ai.cd -= dt; if (ai.cd <= 0) { ai.cd = rnd(0.6, 1.4) * Math.max(0.6, 1 - this.t * 0.004); if (Math.abs(b.x - ai.x) < 140) this.jmp(ai); } this.pl(ai, dt);
      b.vy += 900 * dt; b.vx *= (1 - 0.25 * dt); b.x += b.vx * dt; b.y += b.vy * dt; if (b.y > this.gy - 12) { b.y = this.gy - 12; b.vy = -Math.abs(b.vy) * 0.65; b.vx *= 0.9; } if (b.y < this.pt + 12) { b.y = this.pt + 12; b.vy = Math.abs(b.vy); } capS(b, 950);
      var top = this.gy - this.gh;
      if (b.x < this.gw) { if (b.y > top) { this.hurt(); this.kick(); return; } b.x = this.gw; b.vx = Math.abs(b.vx); }
      if (b.x > this.W - this.gw) { if (b.y > top) { this.good(2, this.W - 40, this.gy - 60, true); this.kick(); return; } b.x = this.W - this.gw; b.vx = -Math.abs(b.vx); }
    },
    guy: function (c, p) { var hx = p.x + Math.sin(p.a) * 90, hy = p.y - Math.cos(p.a) * 90, mx = p.x + Math.sin(p.a) * 45, my = p.y - Math.cos(p.a) * 45; c.lineCap = "round"; k1ln(c, p.x, p.y, mx, my, 12, "#2b2b33"); k1ln(c, mx, my, hx, hy, 22, p.col); c.lineCap = "butt"; dot(c, hx, hy - 4, 16, "#f2b48a"); face(c, hx, hy - 4, 13, p.f); },
    draw: function (now) {
      var c = this.ctx, W = this.W, gy = this.gy, top = gy - this.gh;
      c.fillStyle = "#3ddc84"; c.fillRect(0, gy, W, this.H - gy); c.fillStyle = "#2fbf6f"; for (var i = 0; i < W; i += 60) c.fillRect(i, gy, 30, this.H - gy);
      c.strokeStyle = "#f2f2f2"; c.lineWidth = 4; c.strokeRect(2, top, this.gw, this.gh); c.strokeRect(W - this.gw - 2, top, this.gw, this.gh);
      this.guy(c, this.ai); c.globalAlpha = this.fadeA(); this.guy(c, this.me); c.globalAlpha = 1;
      soccer(c, this.b.x, this.b.y, 12);
      this.ghost(W * 0.5, this.cy, now);
    }
  }), "court");

  /* 78. Persecución */
  regD("persecucion", "Persecución", "Mantené a la izquierda o a la derecha para doblar. Escapá de los patrulleros y hacé que choquen contra los edificios.", "#ff4d6d", G("Persecucion", {
    ctl: "hold",
    init: function () { this.cs = 90; this.x = 45; this.y = 45; this.a = -PI / 2; this.side = 1; this.cops = []; this.nc = 2; this.sv = 0; },
    bld: function (i, j) { if (((i % 3) + 3) % 3 === 0 || ((j % 3) + 3) % 3 === 0) return false; var h = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return (h - Math.floor(h)) < 0.7; },
    solid: function (x, y) { return this.bld(Math.floor(x / this.cs), Math.floor(y / this.cs)); },
    press: function (x) { this.side = x < this.W / 2 ? -1 : 1; this.acts++; },
    step: function (dt) {
      var i, v = 200 + Math.min(this.t, 120) * 0.7; if (this.holding) this.a += this.side * 3.2 * dt;
      var nx = this.x + Math.cos(this.a) * v * dt, ny = this.y + Math.sin(this.a) * v * dt; if (this.solid(nx, ny)) { this.hurt(); this.a += PI; } else { this.x = nx; this.y = ny; }
      this.nc -= dt; if (this.nc <= 0 && this.cops.length < 2 + Math.floor(this.t / 20)) { this.nc = 3; var aa = rnd(0, TAU); this.cops.push({ x: this.x + Math.cos(aa) * 420, y: this.y + Math.sin(aa) * 420, a: aa + PI }); }
      for (i = 0; i < this.cops.length; i++) { var p = this.cops[i], want = Math.atan2(this.y - p.y, this.x - p.x); p.a += clamp(k3adiff(want, p.a), -2.4 * dt, 2.4 * dt); var cx = p.x + Math.cos(p.a) * v * 1.02 * dt, cy = p.y + Math.sin(p.a) * v * 1.02 * dt; if (this.solid(cx, cy)) { p.dead = 1; this.good(2, this.W / 2 + p.x - this.x, this.cy + p.y - this.y, true); continue; } p.x = cx; p.y = cy; if (Math.hypot(p.x - this.x, p.y - this.y) < 24) { this.hurt(); p.a += PI; } if (Math.hypot(p.x - this.x, p.y - this.y) > 900) p.dead = 1; }
      for (i = 0; i < this.cops.length; i++) for (var j = i + 1; j < this.cops.length; j++) if (Math.hypot(this.cops[i].x - this.cops[j].x, this.cops[i].y - this.cops[j].y) < 22) { this.cops[i].dead = this.cops[j].dead = 1; this.good(3, this.W / 2, this.cy, true); }
      k1fil(this.cops, function (p) { return p.dead; });
      this.sv += dt; if (this.sv > 2) { this.sv = 0; this.add(1); }
    },
    draw: function (now) {
      var c = this.ctx, cs = this.cs, ox = this.W / 2 - this.x, oy = this.cy - this.y, i0 = Math.floor(-ox / cs) - 1, j0 = Math.floor((this.pt - oy) / cs) - 1, i, j;
      c.fillStyle = "#55555f"; c.fillRect(0, this.pt, this.W, this.H);
      for (i = i0; i < i0 + this.W / cs + 3; i++) for (j = j0; j < j0 + (this.H - this.pt) / cs + 3; j++) { var x = i * cs + ox, y = j * cs + oy; if (this.bld(i, j)) { var h = Math.abs(Math.sin(i * 12.9 + j * 78.2)); fillR(c, x + 3, y + 3, cs - 6, cs - 6, 6, h < 0.33 ? "#ff9f1c" : h < 0.66 ? "#c77dff" : "#3ddc84"); c.fillStyle = "rgba(0,0,0,0.2)"; c.fillRect(x + 14, y + 14, cs - 28, cs - 28); } else if ((((i % 3) + 3) % 3 === 0) && (((j % 3) + 3) % 3 !== 0)) { c.fillStyle = "rgba(255,255,255,0.4)"; c.fillRect(x + cs / 2 - 2, y + 20, 4, 30); } }
      for (i = 0; i < this.cops.length; i++) { var p = this.cops[i]; c.save(); c.translate(p.x + ox, p.y + oy); c.rotate(p.a + PI / 2); fillR(c, -10, -17, 20, 34, 5, "#f2f2f2"); c.fillStyle = "#2b2b33"; c.fillRect(-10, -4, 20, 8); c.fillStyle = Math.floor(now / 150) % 2 ? "#ff4d6d" : "#ffd23f"; c.fillRect(-8, -2, 7, 4); c.restore(); }
      c.globalAlpha = this.fadeA(); c.save(); c.translate(this.W / 2, this.cy); c.rotate(this.a + PI / 2); fillR(c, -10, -17, 20, 34, 5, "#ff4d6d"); c.fillStyle = "#2b2b33"; c.fillRect(-8, -10, 16, 7); c.restore(); c.globalAlpha = 1;
      this.ghostHold(this.W * 0.75, this.H - this.pb - 60, now);
    }
  }), "city");

  /* 79. Inflador */
  regD("inflador", "Inflador", "Mantené del lado del bicho para inflarlo hasta que explote. Si soltás antes, se desinfla.", "#ff4d6d", G("Inflador", {
    ctl: "hold",
    init: function () { this.ty = this.cy + 40; this.en = []; this.ne = 1; this.side = 1; },
    press: function (x) { this.side = x < this.W / 2 ? -1 : 1; this.acts++; },
    tgt: function () { var b = null, bd = 170; for (var i = 0; i < this.en.length; i++) { var e = this.en[i]; if (e.s === this.side && e.d < bd) { bd = e.d; b = e; } } return b; },
    step: function (dt) {
      var i; this.ne -= dt; if (this.ne <= 0) { this.ne = Math.max(0.9, 2.2 - this.t * 0.012) * rnd(0.7, 1.3); this.en.push({ s: pickOf([-1, 1]), d: this.W / 2 + 20, v: rnd(40, 60) + Math.min(this.t, 120) * 0.35, inf: 0, fire: Math.random() < 0.3 }); }
      var tg = this.holding ? this.tgt() : null;
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; if (e === tg) { e.inf += dt / 0.55; if (e.inf >= 1) { e.gone = 1; this.add(e.fire ? 2 : 1); sfx(120, 0.15, "sawtooth", 0.05, 0.4); } } else { e.inf = Math.max(0, e.inf - dt * 0.8); if (e.inf < 0.1) e.d -= e.v * dt; } if (e.fire && e.d < 110 && e.inf < 0.1) { e.ft = (e.ft || 0) + dt; if (e.ft > 1.2) { e.ft = 0; this.hurt(); } } if (e.d < 26) { e.gone = 1; this.hurt(); } }
      k1fil(this.en, function (e) { return e.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, W = this.W, cx = W / 2, ty = this.ty;
      c.fillStyle = "#c98a4a"; c.fillRect(0, this.pt, W, this.H); c.fillStyle = "#b07a3f"; c.fillRect(0, this.pt + 120, W, 140); c.fillStyle = "#8a5a2b"; c.fillRect(0, ty + 120, W, this.H);
      c.fillStyle = "#2b1d3a"; c.fillRect(0, ty - 34, W, 68);
      var tg = this.holding ? this.tgt() : null; if (tg) k1ln(c, cx, ty, cx + tg.s * tg.d, ty, 4, "#f2f2f2");
      for (i = 0; i < this.en.length; i++) { var e = this.en[i], ex = cx + e.s * e.d, r = 18 + e.inf * 24; if (e.fire) { k1ell(c, ex, ty, r * 1.2, r, "#3ddc84"); dot(c, ex - e.s * r * 0.9, ty - 4, r * 0.4, "#3ddc84"); if ((e.ft || 0) > 0.6) poly(c, [ex - e.s * r, ty, ex - e.s * (r + 60), ty - 14, ex - e.s * (r + 60), ty + 14], "#ff9f1c"); } else dot(c, ex, ty, r, "#ff4d6d"); dot(c, ex - e.s * r * 0.3, ty - r * 0.25, r * 0.35, "#fff3b0"); dot(c, ex - e.s * r * 0.35, ty - r * 0.25, r * 0.18, "#2b2b33"); }
      c.globalAlpha = this.fadeA(); fillR(c, cx - 12, ty - 20, 24, 34, 7, "#f2f2f2"); buddy(c, cx, ty - 28, 12, "#f2b48a", this.side); dot(c, cx, ty - 36, 9, "#ff4d6d"); c.globalAlpha = 1;
      this.ghostHold(W * 0.78, ty + 80, now);
    }
  }), "cave");

  /* 80. Línea que barre */
  regD("linea", "Línea que barre", "Una línea sube y baja. Tocá cada nota justo cuando la línea pasa por encima.", "#c77dff", G("Linea", {
    init: function () { this.y0 = this.pt + 40; this.y1 = this.H - this.pb - 40; this.ph = 0; this.ns = []; this.gauge = 1; this.nt = 0.3; },
    ly: function (ph) { var k = ph % 2; return k < 1 ? this.y1 - (this.y1 - this.y0) * k : this.y0 + (this.y1 - this.y0) * (k - 1); },
    act: function (x, y) { this.acts++; var i, b = null, bd = 1e9, ly = this.ly(this.ph); for (i = 0; i < this.ns.length; i++) { var n = this.ns[i]; if (n.done) continue; var d = Math.hypot(n.x - x, n.y - y); if (d < 48 && Math.abs(n.y - ly) < bd) { bd = Math.abs(n.y - ly); b = n; } } if (!b) return; b.done = 1; b.fx = 0.2; if (bd < 16) this.good(2, b.x, b.y, true); else if (bd < 40) this.add(1); else { b.bad = 1; this.miss(); return; } this.gauge = Math.min(1, this.gauge + 0.05); },
    miss: function () { this.gauge -= 0.34; if (this.gauge <= 0) { this.hurt(); this.gauge = 1; } },
    step: function (dt) {
      var i, per = Math.max(1.5, 2.4 - this.t * 0.006), ph0 = this.ph; this.ph += dt / per;
      this.nt -= dt; if (this.nt <= 0) { this.nt = Math.max(0.28, 0.55 - this.t * 0.002) * rnd(0.8, 1.3); var fut = this.ph + 0.4, y = this.ly(fut); this.ns.push({ x: rnd(40, this.W - 80), y: y, hit: fut, col: pickOf(["#ff5fd2", "#3ddc84", "#ffd23f", "#ff9f1c"]) }); }
      for (i = 0; i < this.ns.length; i++) { var n = this.ns[i]; if (n.done) { n.fx -= dt; if (n.fx <= 0) n.gone = 1; } else if (this.ph > n.hit + 0.06) { n.done = 1; n.bad = 1; n.fx = 0.2; this.miss(); } }
      k1fil(this.ns, function (n) { return n.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, W = this.W, ly = this.ly(this.ph);
      for (i = 0; i < this.ns.length; i++) { var n = this.ns[i], left = n.hit - this.ph; if (n.done) { c.globalAlpha = Math.max(0, n.fx * 5); dot(c, n.x, n.y, 24, n.bad ? "#55555f" : "#f2f2f2"); c.globalAlpha = 1; continue; } var sc = clamp(1 - left / 0.4, 0.3, 1); dot(c, n.x, n.y, 24 * sc, n.col); dot(c, n.x, n.y, 12 * sc, "rgba(255,255,255,0.45)"); c.strokeStyle = "#f2f2f2"; c.lineWidth = 2; c.beginPath(); c.arc(n.x, n.y, 26, -PI / 2, -PI / 2 + TAU * sc); c.stroke(); }
      c.fillStyle = "#f2f2f2"; c.fillRect(0, ly - 2, W, 4); c.fillStyle = "rgba(255,255,255,0.12)"; c.fillRect(0, ly - 14, W, 28);
      fillR(c, 16, this.pt + 2, W - 92, 7, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (W - 92) * clamp(this.gauge, 0, 1), 7, 4, this.gauge < 0.4 ? "#ff4d6d" : "#3ddc84");
      var n0 = this.ns.find(function (n) { return !n.done; }); if (n0) this.ghost(n0.x + 10, n0.y, now);
    }
  }), "arcade");

  /* 81. Detrás de la caja */
  regD("cobertura", "Detrás de la caja", "Mantené apretado sobre un robot para asomarte y dispararle. Soltá para esconderte cuando se pone rojo.", "#ff9f1c", G("Cobertura", {
    ctl: "hold",
    init: function () { this.win = []; var cols = 3, rows = 3, k; for (k = 0; k < cols * rows; k++) this.win.push({ x: this.W * (0.2 + (k % cols) * 0.3), y: this.pt + 110 + Math.floor(k / cols) * 120, st: 0, tm: rnd(0.5, 3) }); this.shotT = 0; this.sx = 0; this.sy = 0; },
    press: function (x, y) { this.acts++; this.shotT = 0.1; this.sx = x; this.sy = y; sfx(150, 0.06, "square", 0.05, 0.5); for (var i = 0; i < this.win.length; i++) { var w = this.win[i]; if (w.st > 0 && Math.abs(x - w.x) < 40 && Math.abs(y - w.y) < 44) { w.st = 0; w.tm = rnd(0.8, 2.5); this.add(1); return; } } },
    step: function (dt) {
      var i; this.shotT -= dt;
      for (i = 0; i < this.win.length; i++) { var w = this.win[i]; w.tm -= dt; if (w.tm > 0) continue; if (w.st === 0) { w.st = 1; w.tm = rnd(0.7, 1.4); } else if (w.st === 1) { w.st = 2; w.tm = Math.max(0.45, 0.8 - this.t * 0.003); } else { if (this.holding) this.hurt(); w.st = 1; w.tm = rnd(0.8, 1.6); } }
    },
    draw: function (now) {
      var c = this.ctx, i, W = this.W, up = this.holding;
      fillR(c, 20, this.pt + 50, W - 40, 380, 8, "#8a8a99");
      for (i = 0; i < this.win.length; i++) { var w = this.win[i]; fillR(c, w.x - 42, w.y - 46, 84, 92, 6, "#2b2b33"); if (w.st > 0) { fillR(c, w.x - 22, w.y - 20, 44, 44, 8, "#9aa1ab"); dot(c, w.x - 9, w.y - 2, 6, w.st === 2 ? "#ff4d6d" : "#ffd23f"); dot(c, w.x + 9, w.y - 2, 6, w.st === 2 ? "#ff4d6d" : "#ffd23f"); c.fillStyle = "#55555f"; c.fillRect(w.x - 2, w.y - 34, 4, 14); dot(c, w.x, w.y - 36, 5, w.st === 2 ? "#ff4d6d" : "#3ddc84"); } }
      if (this.shotT > 0) { dot(c, this.sx, this.sy, 10, "#fff3b0"); }
      var cy = up ? this.H - this.pb - 90 : this.H - this.pb - 30; fillR(c, W * 0.15, cy, W * 0.7, 200, 6, "#c98a4a"); c.strokeStyle = "#8a5a2b"; c.lineWidth = 6; c.strokeRect(W * 0.15 + 6, cy + 6, W * 0.7 - 12, 120); k1ln(c, W * 0.15 + 6, cy + 6, W * 0.85 - 6, cy + 126, 6, "#8a5a2b");
      if (!up) { c.fillStyle = "rgba(0,0,0,0.25)"; c.fillRect(0, this.pt, W, this.H); }
      var w0 = this.win.find(function (w) { return w.st === 1; }); if (w0) this.ghost(w0.x + 10, w0.y, now);
    }
  }), "city");

  /* 82. Motocross */
  regD("motocross", "Motocross", "Mantené apretado para el turbo y saltar más lejos. Si el motor se calienta demasiado, se para.", "#ff4d6d", G("Motocross", {
    ctl: "hold",
    init: function () { this.gy = this.H - this.pb - 110; this.x = 0; this.v = 260; this.heat = 0; this.air = 0; this.h = 0; this.vy = 0; this.rp = []; this.nx = 500; this.stall = 0; this.rv = []; for (var k = 0; k < 3; k++) this.rv.push({ x: 200 + k * 260, v: rnd(270, 330), col: ["#3ddc84", "#ffd23f", "#c77dff"][k], pass: 0 }); },
    gen: function () { while (this.nx < this.x + this.W * 2) { var big = Math.random() < 0.5 + Math.min(0.3, this.t * 0.004); this.rp.push({ x: this.nx, h: big ? 50 : 30, mud: big ? rnd(150, 210) : rnd(60, 100) }); this.nx += rnd(520, 760); } },
    step: function (dt) {
      var i; this.gen();
      if (this.stall > 0) { this.stall -= dt; this.v = Math.max(60, this.v - 400 * dt); this.heat = Math.max(0, this.heat - dt * 0.5); }
      else { var turbo = this.holding; this.v += ((turbo ? 430 : 270) - this.v) * Math.min(1, dt * 2); this.heat += (turbo ? 0.32 : -0.28) * dt; this.heat = Math.max(0, this.heat); if (this.heat >= 1) { this.heat = 0.6; this.stall = 1.3; this.hurt(); } }
      this.x += this.v * dt;
      if (this.air) { this.vy -= 1100 * dt; this.h += this.vy * dt; if (this.h <= 0) { this.h = 0; this.air = 0; var r = this.cur; if (r && this.x < r.x + 60 + r.mud) { this.hurt(); this.v = 120; } else if (r) this.add(1); } }
      else for (i = 0; i < this.rp.length; i++) { var q = this.rp[i]; if (!q.done && this.x >= q.x + 60) { q.done = 1; this.cur = q; this.air = 1; this.h = q.h; this.vy = this.v * 0.9; } }
      for (i = 0; i < this.rv.length; i++) { var b = this.rv[i]; b.x += b.v * dt; if (!b.pass && b.x < this.x - 30) { b.pass = 1; this.add(1); } if (b.x < this.x - this.W) { b.x = this.x + this.W + rnd(100, 400); b.pass = 0; b.v = rnd(260, 340); } }
      var x0 = this.x; k1fil(this.rp, function (q) { return q.x + 300 < x0 - 300; });
    },
    bike: function (c, x, y, col, a) { c.save(); c.translate(x, y); c.rotate(a); dot(c, -18, 0, 10, "#2b2b33"); dot(c, 18, 0, 10, "#2b2b33"); dot(c, -18, 0, 4, "#9aa1ab"); dot(c, 18, 0, 4, "#9aa1ab"); poly(c, [-18, -4, 4, -16, 20, -8, 16, -2, -4, -4], col); fillR(c, -8, -30, 14, 18, 5, col); dot(c, 0, -36, 9, "#f2f2f2"); c.restore(); },
    draw: function (now) {
      var c = this.ctx, i, cam = this.x - this.W * 0.3, gy = this.gy;
      c.fillStyle = "#c98a4a"; c.fillRect(0, gy, this.W, this.H - gy); c.fillStyle = "#e0b070"; c.fillRect(0, gy, this.W, 5);
      for (i = 0; i < this.rp.length; i++) { var q = this.rp[i], rx = q.x - cam; poly(c, [rx, gy, rx + 60, gy - q.h, rx + 60, gy], "#8a5a2b"); c.fillStyle = "#5c3a1c"; c.fillRect(rx + 60, gy, q.mud, 12); for (var k = 0; k < 3; k++) dot(c, rx + 70 + k * q.mud / 3, gy + 4, 6, "#4a2e15"); fillR(c, rx + 66 + q.mud, gy - 18, 24, 18, 3, "#ffd23f"); }
      for (i = 0; i < this.rv.length; i++) this.bike(c, this.rv[i].x - cam, gy - 10, this.rv[i].col, 0);
      c.globalAlpha = this.fadeA(); this.bike(c, this.x - cam, gy - 10 - this.h, "#ff4d6d", this.air ? -this.vy * 0.0008 : 0); c.globalAlpha = 1;
      fillR(c, 16, this.pt + 2, this.W - 92, 8, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (this.W - 92) * clamp(this.heat, 0, 1), 8, 4, this.heat > 0.75 ? "#ff4d6d" : "#ff9f1c");
      this.ghostHold(this.W * 0.7, this.cy, now);
    }
  }), "desert");

  /* 83. Escalador */
  regD("escalador", "Escalador", "Tocá izquierda y derecha alternando para trepar. Deslizá a un costado para cambiar de columna y esquivar las macetas.", "#ffd23f", G("Escalador", {
    ctl: "swipe",
    init: function () { this.col = 1; this.cx2 = 1; this.s = 0; this.last = -1; this.py = this.H - this.pb - 160; this.pots = []; this.np = 2; this.fl = 0; this.reach = 0; },
    X: function (k) { return this.W * (0.22 + k * 0.28); },
    act: function (x) { this.acts++; if (x === 1) { this.col = Math.max(0, this.col - 1); return; } if (x === this.W - 1) { this.col = Math.min(2, this.col + 1); return; } var s = x < this.W / 2 ? 0 : 1; if (s !== this.last) { this.s += 22; this.last = s; this.reach = 0.12; if (this.s >= this.fl + 88) { this.fl += 88; this.add(1); } sfx(250 + (this.s % 88), 0.03, "triangle", 0.03, 1.1); } },
    step: function (dt) {
      var i; this.cx2 += (this.col - this.cx2) * Math.min(1, dt * 12); this.reach -= dt;
      this.np -= dt; if (this.np <= 0) { this.np = Math.max(0.7, 1.8 - this.t * 0.01) * rnd(0.7, 1.3); this.pots.push({ k: ri(0, 3), y: this.pt - 20, warn: 0.7 }); }
      var lane = Math.round(this.cx2);
      for (i = 0; i < this.pots.length; i++) { var p = this.pots[i]; if (p.warn > 0) { p.warn -= dt; continue; } p.y += 420 * dt; if (!p.done && p.k === lane && Math.abs(p.y - (this.py - 30)) < 26) { p.done = 1; p.gone = 1; this.hurt(); } if (p.y > this.H) p.gone = 1; }
      k1fil(this.pots, function (p) { return p.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, k, W = this.W, off = this.s % 88;
      fillR(c, W * 0.06, this.pt, W * 0.88, this.H, 0, "#8a8a99");
      for (var y = -88 + off; y < this.H; y += 88) for (k = 0; k < 3; k++) { var x = this.X(k); fillR(c, x - 28, y + 10, 56, 64, 4, "#2b2b33"); c.fillStyle = "#3a3a44"; c.fillRect(x - 28, y + 40, 56, 4); c.fillStyle = "#c0c4cc"; c.fillRect(x - 32, y + 74, 64, 6); }
      for (i = 0; i < this.pots.length; i++) { var p = this.pots[i], px = this.X(p.k); if (p.warn > 0) { k1ell(c, px, this.py - 30, 24, 8, "rgba(0,0,0,0.35)"); poly(c, [px - 12, this.pt + 10, px + 12, this.pt + 10, px, this.pt + 30], "#ff4d6d"); } else { fillR(c, px - 14, p.y - 12, 28, 24, 4, "#c8553d"); dot(c, px, p.y - 18, 10, "#3ddc84"); } }
      var cx = W * (0.22 + this.cx2 * 0.28), py = this.py, up = this.reach > 0 ? 1 : 0, L = this.last === 0;
      c.globalAlpha = this.fadeA(); k1ln(c, cx - 8, py - 30, cx - 22, py - 60 - (L ? 10 * up : 0), 6, "#f2b48a"); k1ln(c, cx + 8, py - 30, cx + 22, py - 60 - (!L ? 10 * up : 0), 6, "#f2b48a"); fillR(c, cx - 12, py - 36, 24, 34, 8, "#ffd23f"); c.strokeStyle = "#2b2b33"; c.lineWidth = 6; c.beginPath(); c.moveTo(cx - 6, py - 4); c.lineTo(cx - 10, py + 20); c.moveTo(cx + 6, py - 4); c.lineTo(cx + 10, py + 20); c.stroke(); buddy(c, cx, py - 46, 12, "#f2b48a"); c.globalAlpha = 1;
      this.ghost(this.last === 0 ? W * 0.72 : W * 0.28, py + 60, now);
    }
  }), "build");

  /* 84. Sillas musicales */
  regD("sillas", "Sillas musicales", "Mientras suena la música, esperá. Cuando se corta, tocá rápido una silla libre antes que los demás.", "#ff5fd2", G("Sillas", {
    init: function () { this.ox = this.W / 2; this.oy = this.cy; this.R = Math.min(this.W, this.H - this.pt - this.pb) * 0.34; this.round(6); },
    round: function (n) { this.n = n; this.kids = []; for (var k = 0; k < n; k++) this.kids.push({ a: k * TAU / n, me: k === 0, col: k === 0 ? "#3ddc84" : pickOf(["#ff4d6d", "#ffd23f", "#c77dff", "#ff9f1c"]), seat: -1, tx: 0, ty: 0, x: 0, y: 0, dl: 0 }); this.ch = []; for (k = 0; k < n - 1; k++) this.ch.push({ a: k * TAU / (n - 1) + 0.3, by: -1 }); this.mus = rnd(2.5, 5); this.ph = 0; this.wait = 0; this.stun = 0; this.spin = 0; },
    cxy: function (a, r) { return { x: this.ox + Math.cos(a) * r, y: this.oy + Math.sin(a) * r }; },
    act: function (x, y) {
      this.acts++; if (this.ph === 0) { this.stun = 0.6; return; } if (this.ph !== 1 || this.stun > 0) return; var me = this.kids[0]; if (me.seat >= 0 || me.go) return;
      var b = -1, bd = 60; for (var i = 0; i < this.ch.length; i++) { var p = this.cxy(this.ch[i].a, this.R * 0.55); var d = Math.hypot(p.x - x, p.y - y); if (d < bd && this.ch[i].by < 0) { bd = d; b = i; } } if (b >= 0) { me.go = 1; me.tc = b; }
    },
    step: function (dt) {
      var i, k; this.stun -= dt;
      if (this.wait > 0) { this.wait -= dt; if (this.wait <= 0) { if (this.nextN <= 1) { this.good(5, this.ox, this.oy, true); this.round(6); } else if (this.nextN < 0) this.round(6); else this.round(this.nextN); } return; }
      if (this.ph === 0) { this.spin += dt * 1.2; this.mus -= dt; for (k = 0; k < this.kids.length; k++) { var p = this.cxy(this.kids[k].a + this.spin, this.R); this.kids[k].x = p.x; this.kids[k].y = p.y; } if (Math.floor(this.t * 4) !== Math.floor((this.t - dt) * 4)) sfx(pickOf([392, 440, 523, 587]), 0.1, "triangle", 0.03, 1); if (this.mus <= 0) { this.ph = 1; for (k = 1; k < this.kids.length; k++) this.kids[k].dl = rnd(0.25, 0.6) * Math.max(0.5, 1 - this.t * 0.004); } return; }
      for (k = 0; k < this.kids.length; k++) { var q = this.kids[k]; if (q.seat >= 0) continue; if (!q.me) { q.dl -= dt; if (q.dl > 0) continue; if (!q.go) { var b = -1, bd = 1e9; for (i = 0; i < this.ch.length; i++) if (this.ch[i].by < 0) { var cp = this.cxy(this.ch[i].a, this.R * 0.55), d = Math.hypot(cp.x - q.x, cp.y - q.y); if (d < bd) { bd = d; b = i; } } if (b < 0) continue; q.go = 1; q.tc = b; } }
        if (!q.go) continue; if (this.ch[q.tc].by >= 0) { q.go = 0; continue; } var tp = this.cxy(this.ch[q.tc].a, this.R * 0.55), dx = tp.x - q.x, dy = tp.y - q.y, dd = Math.hypot(dx, dy), sp = q.me ? 420 : 260; if (dd < sp * dt) { q.x = tp.x; q.y = tp.y; this.ch[q.tc].by = k; q.seat = q.tc; if (q.me) this.add(1); } else { q.x += dx / dd * sp * dt; q.y += dy / dd * sp * dt; } }
      var free = this.ch.filter(function (c) { return c.by < 0; }).length; if (free === 0) { var meSat = this.kids[0].seat >= 0; if (!meSat) { this.hurt(); this.nextN = -1; } else { this.good(1, this.ox, this.oy, false); this.nextN = this.n - 1; } this.wait = 1.1; }
    },
    draw: function (now) {
      var c = this.ctx, i;
      dot(c, this.ox, this.oy, this.R + 30, "rgba(255,255,255,0.06)");
      for (i = 0; i < this.ch.length; i++) { var p = this.cxy(this.ch[i].a, this.R * 0.55); fillR(c, p.x - 16, p.y - 14, 32, 30, 5, this.ch[i].by >= 0 ? "#8a5a2b" : "#c98a4a"); fillR(c, p.x - 16, p.y - 26, 32, 12, 4, "#e0b070"); }
      for (i = 0; i < this.kids.length; i++) { var q = this.kids[i]; c.globalAlpha = q.me ? (this.stun > 0 ? 0.5 : this.fadeA()) : 1; fillR(c, q.x - 10, q.y - 4, 20, 24, 6, q.col); buddy(c, q.x, q.y - 12, 11, "#f2b48a"); c.globalAlpha = 1; }
      if (this.ph === 0) { var nx = this.ox + Math.sin(now / 200) * 20; c.fillStyle = "#f2f2f2"; c.fillRect(nx - 8, this.oy - 30, 4, 26); dot(c, nx - 10, this.oy - 4, 7, "#f2f2f2"); c.fillRect(nx + 10, this.oy - 34, 4, 26); dot(c, nx + 8, this.oy - 8, 7, "#f2f2f2"); c.fillRect(nx - 8, this.oy - 34, 22, 5); }
      if (this.ph === 1 && this.kids[0].seat < 0) { var fc = this.ch.find(function (c) { return c.by < 0; }); if (fc) { var pp = this.cxy(fc.a, this.R * 0.55); this.ghost(pp.x + 6, pp.y, now); } }
    }
  }), "school");

  /* 85. Carrera de embolsados */
  regD("embolsados", "Carrera de embolsados", "Tocá justo cuando tu corredor toca el piso para dar el próximo salto. Si tocás en el aire, te caés.", "#ff9f1c", G("Embolsados", {
    init: function () { this.lvl = 0; this.race(); },
    race: function () { this.D = 45; this.rs = [{ x: 0, hop: 0, hp: 0, me: 1, col: "#3ddc84", fall: 0, wait: 0 }]; for (var k = 0; k < 3; k++) this.rs.push({ x: 0, hop: 0, hp: rnd(0, 1), col: ["#ff4d6d", "#ffd23f", "#c77dff"][k], rate: 0.95 + this.lvl * 0.06 + k * 0.05 }); this.fin = 0; this.over2 = 0; this.ph = 0; this.ready = 1.2; },
    act: function () { if (this.ph !== 1) return; var me = this.rs[0]; this.acts++; if (me.fall > 0) return; if (me.hop <= 0) { me.hop = 0.5; me.boost = me.wait < 0.15 ? 1.25 : 1; if (me.boost > 1) sfx(600, 0.04, "triangle", 0.04, 1.3); else sfx(400, 0.04, "triangle", 0.03, 1.1); } else if (me.hop > 0.1) { me.fall = 0.8; me.hop = 0; sfx(120, 0.1, "square", 0.04, 0.6); } },
    step: function (dt) {
      var i, me = this.rs[0];
      if (this.ph === 0) { this.ready -= dt; if (this.ready <= 0) this.ph = 1; return; }
      if (this.ph === 2) { this.over2 -= dt; if (this.over2 <= 0) { this.lvl++; this.race(); } return; }
      if (me.fall > 0) me.fall -= dt; else if (me.hop > 0) { me.hop -= dt; me.x += 3.8 * (me.boost || 1) * dt; if (me.hop <= 0) { me.hop = 0; me.wait = 0; } } else me.wait += dt;
      for (i = 1; i < 4; i++) { var r = this.rs[i]; r.hp += dt * r.rate * 2; r.x += r.rate * 3.2 * dt; if (r.x >= this.D && !r.done) { r.done = 1; this.fin++; } }
      if (me.x >= this.D) { var pl = this.fin + 1; if (pl === 1) this.good(3, this.W / 2, this.cy, true); else if (pl === 2) this.add(1); else this.hurt(); this.ph = 2; this.over2 = 1.4; }
      else if (this.fin >= 3) { this.lt = (this.lt || 0) + dt; if (this.lt > 2) { this.lt = 0; this.hurt(); this.ph = 2; this.over2 = 1.2; } }
    },
    draw: function (now) {
      var c = this.ctx, i, me = this.rs[0], sc = 30, cam = me.x * sc - this.W * 0.3, top = this.pt + 170, lh = 70;
      for (i = 0; i < 4; i++) { c.fillStyle = i % 2 ? "#3ddc84" : "#36c776"; c.fillRect(0, top + i * lh, this.W, lh); }
      var fx = this.D * sc - cam; c.fillStyle = "#f2f2f2"; c.fillRect(fx, top, 6, lh * 4); flag(c, fx + 3, top - 10, "#ff4d6d");
      for (i = 3; i >= 0; i--) { var r = this.rs[i], rx = r.x * sc - cam, ry = top + (3 - i) * lh + lh * 0.8, jump; if (r.me) jump = r.hop > 0 ? Math.sin((1 - r.hop / 0.5) * PI) * 34 : 0; else jump = Math.abs(Math.sin(r.hp * PI)) * 30; c.globalAlpha = r.me ? (r.fall > 0 ? 0.5 : this.fadeA()) : 1; c.save(); c.translate(rx, ry - jump); if (r.me && r.fall > 0) c.rotate(1.3); fillR(c, -14, -34, 28, 34, 8, "#c98a4a"); c.fillStyle = "#8a5a2b"; c.fillRect(-14, -30, 28, 4); fillR(c, -10, -46, 20, 14, 5, r.col); buddy(c, 0, -54, 10, "#f2b48a", 1); c.restore(); c.globalAlpha = 1; }
      if (this.ph === 0) for (i = 0; i < 3; i++) dot(c, this.W / 2 + (i - 1) * 40, this.pt + 90, 14, this.ready < 0.4 * (2 - i) + 0.01 ? "#ff4d6d" : "#55555f");
      this.ghost(this.W * 0.6, this.cy + 120, now);
    }
  }), "farm");
