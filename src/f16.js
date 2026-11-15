
  /* ===== 100 copias de juegos conocidos (6/8) ===== */
  function k6bounce(a, b, rr, e) { var dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy); if (d >= rr || d === 0) return false; var nx = dx / d, ny = dy / d, ov = (rr - d) / 2; a.x -= nx * ov; a.y -= ny * ov; b.x += nx * ov; b.y += ny * ov; var rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (rv < 0) { var j = -(1 + e) * rv / 2; a.vx -= j * nx; a.vy -= j * ny; b.vx += j * nx; b.vy += j * ny; } return true; }

  /* 61. Sumo */
  regD("sumo", "Sumo", "La flecha gira sola. Tocá para embestir hacia donde apunta. Sacá a los otros del círculo sin salirte.", "#ff4d6d", G("Sumo", {
    init: function () { this.ox = this.W / 2; this.oy = this.cy; this.R = Math.min(this.W, this.H - this.pt - this.pb) * 0.42; this.me = this.wr(0, this.R * 0.4, "#3ddc84"); this.en = [this.wr(0, -this.R * 0.4, "#ff4d6d")]; this.aim = 0; },
    wr: function (dx, dy, col) { return { x: this.ox + dx, y: this.oy + dy, vx: 0, vy: 0, col: col, cd: rnd(0.8, 1.6), a: 0 }; },
    act: function () { this.acts++; this.me.vx += Math.cos(this.aim) * 520; this.me.vy += Math.sin(this.aim) * 520; sfx(200, 0.08, "square", 0.05, 1.4); },
    step: function (dt) {
      var i, all = [this.me].concat(this.en); this.aim += dt * (2.4 + Math.min(this.t, 90) * 0.01);
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; e.cd -= dt; e.a = Math.atan2(this.me.y - e.y, this.me.x - e.x); if (e.cd <= 0) { e.cd = rnd(0.9, 1.8) * Math.max(0.55, 1 - this.t * 0.004); var toC = Math.hypot(e.x - this.ox, e.y - this.oy) > this.R * 0.7 ? Math.atan2(this.oy - e.y, this.ox - e.x) : e.a + rnd(-0.3, 0.3); e.vx += Math.cos(toC) * 470; e.vy += Math.sin(toC) * 470; } }
      for (i = 0; i < all.length; i++) { var w = all[i]; w.x += w.vx * dt; w.y += w.vy * dt; w.vx *= (1 - 2.2 * dt); w.vy *= (1 - 2.2 * dt); }
      for (i = 0; i < all.length; i++) for (var j = i + 1; j < all.length; j++) k6bounce(all[i], all[j], 46, 0.9);
      if (Math.hypot(this.me.x - this.ox, this.me.y - this.oy) > this.R) { this.hurt(); this.me.x = this.ox; this.me.y = this.oy + this.R * 0.4; this.me.vx = this.me.vy = 0; }
      for (i = 0; i < this.en.length; i++) { var q = this.en[i]; if (Math.hypot(q.x - this.ox, q.y - this.oy) > this.R + 6) { this.good(2, q.x, q.y, true); var a = rnd(0, TAU); this.en[i] = this.wr(Math.cos(a) * this.R * 0.5, Math.sin(a) * this.R * 0.5, pickOf(["#ff4d6d", "#c77dff", "#ff9f1c"])); } }
      if (this.t > 25 && this.en.length < 2) this.en.push(this.wr(-this.R * 0.4, -this.R * 0.3, "#c77dff"));
    },
    draw: function (now) {
      var c = this.ctx, i, R = this.R;
      dot(c, this.ox, this.oy, R + 16, "#c98a4a"); dot(c, this.ox, this.oy, R, "#e8c98a"); c.strokeStyle = "#f2f2f2"; c.lineWidth = 4; c.beginPath(); c.arc(this.ox, this.oy, R, 0, TAU); c.stroke(); c.fillStyle = "#8a5a2b"; c.fillRect(this.ox - 30, this.oy - 2, 20, 4); c.fillRect(this.ox + 10, this.oy - 2, 20, 4);
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; dot(c, e.x, e.y, 23, e.col); face(c, e.x, e.y, 18, Math.cos(e.a) > 0 ? 1 : -1); c.fillStyle = "#2b2b33"; c.fillRect(e.x - 23, e.y + 6, 46, 7); }
      var m = this.me; c.globalAlpha = this.fadeA(); dot(c, m.x, m.y, 23, m.col); face(c, m.x, m.y, 18, Math.cos(this.aim) > 0 ? 1 : -1); c.fillStyle = "#2b2b33"; c.fillRect(m.x - 23, m.y + 6, 46, 7); c.globalAlpha = 1;
      var ax = m.x + Math.cos(this.aim) * 44, ay = m.y + Math.sin(this.aim) * 44; k1ln(c, m.x + Math.cos(this.aim) * 26, m.y + Math.sin(this.aim) * 26, ax, ay, 4, "#ffd23f"); poly(c, [ax + Math.cos(this.aim) * 10, ay + Math.sin(this.aim) * 10, ax + Math.cos(this.aim + 2.3) * 9, ay + Math.sin(this.aim + 2.3) * 9, ax + Math.cos(this.aim - 2.3) * 9, ay + Math.sin(this.aim - 2.3) * 9], "#ffd23f");
      this.ghost(this.W * 0.5, this.H - this.pb - 60, now);
    }
  }), "court");

  /* 62. Autitos */
  regD("autitos", "Autitos", "El auto acelera solo. Mantené apretado para doblar en las curvas. Completá cada vuelta antes de que se acabe el tiempo.", "#ffd23f", G("Autitos", {
    ctl: "hold",
    init: function () { this.ox = this.W / 2; this.oy = this.cy + 10; this.rx = this.W * 0.36; this.ry = (this.H - this.pt - this.pb) * 0.38; this.tw = 38; this.x = this.ox + this.rx; this.y = this.oy; this.a = -PI / 2; this.v = 0; this.lt = 10; this.tq = this.th2(); this.ai = []; for (var k = 0; k < 3; k++) this.ai.push({ th: -0.4 - k * 0.5, sp: 0.9 + k * 0.07, off: (k - 1) * 14, col: ["#ff4d6d", "#3ddc84", "#c77dff"][k] }); },
    th2: function () { return Math.atan2((this.y - this.oy) / this.ry, (this.x - this.ox) / this.rx); },
    pos: function (th, off) { var x = Math.cos(th), y = Math.sin(th), nx = x / this.rx, ny = y / this.ry, m = Math.hypot(nx, ny); return { x: this.ox + this.rx * x + nx / m * off, y: this.oy + this.ry * y + ny / m * off }; },
    rho: function (x, y) { return Math.hypot((x - this.ox) / this.rx, (y - this.oy) / this.ry); },
    step: function (dt) {
      var i, vmax = 230 + Math.min(this.t, 120) * 0.8, off = Math.abs(this.rho(this.x, this.y) - 1) * Math.min(this.rx, this.ry) > this.tw;
      this.v += ((off ? 90 : vmax) - this.v) * Math.min(1, dt * (off ? 3 : 0.9)); if (this.holding) this.a -= 2.9 * dt;
      this.x += Math.cos(this.a) * this.v * dt; this.y += Math.sin(this.a) * this.v * dt; this.x = clamp(this.x, 10, this.W - 10); this.y = clamp(this.y, this.pt + 10, this.H - this.pb - 10);
      var th0 = this.tq; this.tq = this.th2(); if (th0 < 0.3 && th0 >= 0 && this.tq < 0 && this.tq > -0.3) { this.good(this.lt > 3 ? 3 : 2, this.x, this.y, this.lt > 3); this.lt = Math.max(6, 10 - this.t * 0.02); }
      this.lt -= dt; if (this.lt <= 0) { this.hurt(); this.lt = 10; }
      for (i = 0; i < this.ai.length; i++) { var a = this.ai[i]; a.th -= dt * a.sp * (vmax / Math.max(this.rx, this.ry)) * 0.8; var p = this.pos(a.th, a.off); if (Math.hypot(p.x - this.x, p.y - this.y) < 24) { this.v *= 0.5; this.x += (this.x - p.x) * 0.3; this.y += (this.y - p.y) * 0.3; } }
    },
    draw: function (now) {
      var c = this.ctx, i, k, ox = this.ox, oy = this.oy;
      k1ell(c, ox, oy, this.rx + this.tw + 10, this.ry + this.tw + 10, "#f2f2f2"); k1ell(c, ox, oy, this.rx + this.tw, this.ry + this.tw, "#55555f"); k1ell(c, ox, oy, this.rx - this.tw, this.ry - this.tw, "#f2f2f2"); k1ell(c, ox, oy, this.rx - this.tw - 8, this.ry - this.tw - 8, "#2f8f4e");
      c.strokeStyle = "rgba(255,255,255,0.4)"; c.lineWidth = 2; c.setLineDash([14, 14]); c.beginPath(); c.ellipse(ox, oy, this.rx, this.ry, 0, 0, TAU); c.stroke(); c.setLineDash([]);
      for (k = 0; k < 6; k++) { c.fillStyle = k % 2 ? "#2b2b33" : "#f2f2f2"; c.fillRect(ox + this.rx - this.tw + k * this.tw / 3, oy - 4, this.tw / 3, 8); }
      for (i = 0; i < this.ai.length; i++) { var a = this.ai[i], p = this.pos(a.th, a.off), p2 = this.pos(a.th - 0.05, a.off); c.save(); c.translate(p.x, p.y); c.rotate(Math.atan2(p2.y - p.y, p2.x - p.x) + PI / 2); fillR(c, -9, -15, 18, 30, 5, a.col); c.fillStyle = "#2b2b33"; c.fillRect(-7, -8, 14, 7); c.restore(); }
      c.globalAlpha = this.fadeA(); c.save(); c.translate(this.x, this.y); c.rotate(this.a + PI / 2); fillR(c, -10, -16, 20, 32, 5, "#ffd23f"); c.fillStyle = "#2b2b33"; c.fillRect(-8, -9, 16, 7); c.restore(); c.globalAlpha = 1;
      fillR(c, 16, this.pt + 2, this.W - 92, 7, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (this.W - 92) * clamp(this.lt / 10, 0, 1), 7, 4, this.lt < 3 ? "#ff4d6d" : "#ffd23f");
      this.ghostHold(this.ox, this.oy, now);
    }
  }), "road");

  /* 63. Billar */
  regD("billar", "Billar", "La línea gira sola. Tocá para tirar cuando apunte bien. Metí las bolas de color, no la blanca.", "#3ddc84", G("Billar", {
    init: function () { this.x0 = 30; this.x1 = this.W - 30; this.y0 = this.pt + 40; this.y1 = this.H - this.pb - 40; this.r = 11; this.aim = -PI / 2; this.rack(); },
    rack: function () { this.bs = [{ x: this.W / 2, y: this.y1 - 90, vx: 0, vy: 0, cue: 1, n: 0 }]; var k = 0, cx = this.W / 2, cy = this.y0 + 130, cols = ["#ffd23f", "#ff4d6d", "#c77dff", "#ff9f1c", "#3ddc84", "#a3203c"]; for (var row = 0; row < 3; row++) for (var j = 0; j <= row; j++) { this.bs.push({ x: cx + (j - row / 2) * this.r * 2.1, y: cy - row * this.r * 1.85, vx: 0, vy: 0, col: cols[k], n: k + 1 }); k++; } this.shots = 9; this.moving = false; this.pot = 0; },
    pockets: function () { var mx = (this.y0 + this.y1) / 2; return [[this.x0, this.y0], [this.x1, this.y0], [this.x0, mx], [this.x1, mx], [this.x0, this.y1], [this.x1, this.y1]]; },
    act: function () { if (this.moving) return; var q = this.bs[0]; q.vx = Math.cos(this.aim) * 620; q.vy = Math.sin(this.aim) * 620; this.moving = true; this.shots--; this.pot = 0; this.acts++; sfx(250, 0.06, "square", 0.05, 0.8); },
    step: function (dt) {
      var i, j, P = this.pockets(), sub = 3;
      if (!this.moving) { this.aim += dt * 1.1; return; }
      for (var s = 0; s < sub; s++) { var h = dt / sub;
        for (i = 0; i < this.bs.length; i++) { var b = this.bs[i]; b.x += b.vx * h; b.y += b.vy * h; b.vx *= (1 - 0.9 * h); b.vy *= (1 - 0.9 * h); if (b.x < this.x0 + this.r) { b.x = this.x0 + this.r; b.vx = Math.abs(b.vx) * 0.85; } if (b.x > this.x1 - this.r) { b.x = this.x1 - this.r; b.vx = -Math.abs(b.vx) * 0.85; } if (b.y < this.y0 + this.r) { b.y = this.y0 + this.r; b.vy = Math.abs(b.vy) * 0.85; } if (b.y > this.y1 - this.r) { b.y = this.y1 - this.r; b.vy = -Math.abs(b.vy) * 0.85; }
          for (j = 0; j < P.length; j++) if (Math.hypot(b.x - P[j][0], b.y - P[j][1]) < 24) { b.in = 1; break; } }
        for (i = 0; i < this.bs.length; i++) for (j = i + 1; j < this.bs.length; j++) k6bounce(this.bs[i], this.bs[j], this.r * 2, 0.95); }
      for (i = 0; i < this.bs.length; i++) { var q = this.bs[i]; if (!q.in) continue; if (q.cue) { q.in = 0; q.x = this.W / 2; q.y = this.y1 - 90; q.vx = q.vy = 0; this.hurt(); } else { q.gone = 1; this.pot++; this.add(1); } }
      k1fil(this.bs, function (b) { return b.gone; });
      var still = this.bs.every(function (b) { return Math.hypot(b.vx, b.vy) < 6; }); if (still) { this.bs.forEach(function (b) { b.vx = b.vy = 0; }); this.moving = false; if (this.bs.length === 1) { this.good(3, this.W / 2, this.cy, true); this.rack(); } else if (this.shots <= 0) { this.hurt(); this.rack(); } }
    },
    draw: function (now) {
      var c = this.ctx, i, P = this.pockets();
      fillR(c, this.x0 - 18, this.y0 - 18, this.x1 - this.x0 + 36, this.y1 - this.y0 + 36, 14, "#8a5a2b"); c.fillStyle = "#2f8f4e"; c.fillRect(this.x0, this.y0, this.x1 - this.x0, this.y1 - this.y0);
      for (i = 0; i < P.length; i++) dot(c, P[i][0], P[i][1], 16, "#111117");
      var q = this.bs[0]; if (!this.moving) { c.strokeStyle = "rgba(255,255,255,0.6)"; c.lineWidth = 2; c.setLineDash([6, 6]); c.beginPath(); c.moveTo(q.x, q.y); c.lineTo(q.x + Math.cos(this.aim) * 170, q.y + Math.sin(this.aim) * 170); c.stroke(); c.setLineDash([]); k1ln(c, q.x - Math.cos(this.aim) * 18, q.y - Math.sin(this.aim) * 18, q.x - Math.cos(this.aim) * 150, q.y - Math.sin(this.aim) * 150, 6, "#e0b070"); }
      for (i = 0; i < this.bs.length; i++) { var b = this.bs[i]; if (b.cue) { dot(c, b.x, b.y, this.r, "#f2f2f2"); dot(c, b.x - 3, b.y - 3, 3, "#fff"); } else spPool(c, b.x, b.y, this.r, b.n); }
      for (i = 0; i < this.shots; i++) dot(c, 24 + i * 12, this.H - this.pb - 12, 4, "#f2f2f2");
      this.ghost(this.W * 0.6, this.cy, now);
    }
  }), "pub");

  /* 64. Curling */
  regD("curling", "Curling", "Mantené para cargar fuerza y soltá. Mientras se desliza, mantené para barrer: va más lejos y dobla menos. Dejala en el centro.", "#ff4d6d", G("Curling", {
    ctl: "hold",
    init: function () { this.hx = this.W / 2; this.hy = this.pt + 140; this.sy0 = this.H - this.pb - 50; this.old = []; this.throwN = 0; this.newS(); },
    newS: function () { this.s = { x: this.W / 2, y: this.sy0, vx: 0, vy: 0 }; this.ph = 0; this.pw = 0; this.curl = pickOf([-1, 1]) * rnd(0.6, 1); this.wait = 0; },
    press: function () { this.acts++; if (this.ph === 0) { this.ph = 1; this.pw = 0; } },
    release: function () { if (this.ph === 1) { var p = 0.5 - 0.5 * Math.cos(this.pw * 2.2); this.s.vy = -(150 + 260 * p); this.ph = 2; sfx(180, 0.15, "sine", 0.05, 0.8); } },
    step: function (dt) {
      var s = this.s, i;
      if (this.ph === 1) this.pw += dt;
      else if (this.ph === 2) { var sw = this.holding; s.vy *= (1 - (sw ? 0.28 : 0.55) * dt); s.vx += this.curl * (sw ? 1 : 3.5) * dt * (1 - Math.min(1, Math.abs(s.vy) / 500)); s.x += s.vx * dt; s.y += s.vy * dt;
        for (i = 0; i < this.old.length; i++) k6bounce(s, this.old[i], 28, 0.8);
        for (i = 0; i < this.old.length; i++) { var o = this.old[i]; o.x += o.vx * dt; o.y += o.vy * dt; o.vx *= (1 - 1.5 * dt); o.vy *= (1 - 1.5 * dt); }
        if (Math.abs(s.vy) < 6 || s.y < this.pt + 10 || s.x < 10 || s.x > this.W - 10) { this.ph = 3; this.wait = 0.8; var d = Math.hypot(s.x - this.hx, s.y - this.hy); if (d < 18) this.good(3, s.x, s.y, true); else if (d < 45) this.good(2, s.x, s.y, false); else if (d < 76) this.add(1); else this.hurt(); } }
      else if (this.ph === 3) { this.wait -= dt; if (this.wait <= 0) { if (Math.hypot(s.x - this.hx, s.y - this.hy) < 90) this.old.push({ x: s.x, y: s.y, vx: 0, vy: 0 }); this.throwN++; if (this.old.length > 3) this.old.shift(); this.newS(); } }
    },
    draw: function (now) {
      var c = this.ctx, W = this.W, s = this.s, i;
      c.fillStyle = "#eaf4f8"; c.fillRect(W * 0.12, this.pt, W * 0.76, this.H - this.pt - this.pb);
      dot(c, this.hx, this.hy, 76, "#ff4d6d"); dot(c, this.hx, this.hy, 60, "#eaf4f8"); dot(c, this.hx, this.hy, 45, "#ffd23f"); dot(c, this.hx, this.hy, 18, "#eaf4f8"); dot(c, this.hx, this.hy, 6, "#ff4d6d");
      c.fillStyle = "#ff4d6d"; c.fillRect(W * 0.12, this.sy0 - 70, W * 0.76, 3);
      for (i = 0; i < this.old.length; i++) { var o = this.old[i]; dot(c, o.x, o.y, 14, "#9aa1ab"); dot(c, o.x, o.y, 9, "#c77dff"); }
      dot(c, s.x, s.y, 14, "#9aa1ab"); dot(c, s.x, s.y, 9, "#3ddc84"); fillR(c, s.x - 3, s.y - 12, 6, 10, 3, "#2b2b33");
      if (this.ph < 2) { var ax = W / 2 + this.curl * 40; poly(c, [ax, this.sy0 - 100, ax - this.curl * 14, this.sy0 - 108, ax - this.curl * 14, this.sy0 - 92], "rgba(0,0,0,0.35)"); k1ln(c, W / 2, this.sy0 - 100, ax - this.curl * 10, this.sy0 - 100, 3, "rgba(0,0,0,0.35)"); }
      if (this.ph === 1) { var p = 0.5 - 0.5 * Math.cos(this.pw * 2.2); fillR(c, 16, this.pt + 2, W - 92, 8, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (W - 92) * p, 8, 4, "#ff4d6d"); }
      if (this.ph === 2 && this.holding) { var bx = s.x + Math.sin(now / 50) * 14; fillR(c, bx - 16, s.y - 34, 32, 6, 3, "#ff9f1c"); }
      this.ghostHold(W * 0.7, this.sy0 - 40, now);
    }
  }), "snow");

  /* 65. Patos */
  regD("patos", "Patos", "Tocá los patos para cazarlos antes de que se escapen. Tenés tres tiros por tanda.", "#3ddc84", G("Patos", {
    init: function () { this.gy = this.H - this.pb - 120; this.wave(); },
    wave: function () { this.dk = []; for (var k = 0; k < 2; k++) this.dk.push({ x: rnd(60, this.W - 60), y: this.gy + 10, vx: pickOf([-1, 1]) * rnd(90, 140), vy: -rnd(110, 160), ct: rnd(0.4, 0.8), st: 0, t: 0, col: pickOf(["#3ddc84", "#c98a4a", "#c77dff"]), dly: k * 0.7 }); this.shots = 3; this.wt = 0; this.fl = 0; },
    act: function (x, y) { if (this.shots <= 0 || this.wt > 0) return; this.shots--; this.fl = 0.06; this.acts++; sfx(100, 0.12, "sawtooth", 0.06, 0.5); for (var i = 0; i < this.dk.length; i++) { var d = this.dk[i]; if (d.st === 0 && d.dly <= 0 && Math.hypot(d.x - x, d.y - y) < 32) { d.st = 1; d.vy = 0; d.ft = 0.4; this.add(Math.abs(d.vx) > 170 ? 2 : 1); return; } } },
    step: function (dt) {
      var i, sp = 1 + Math.min(this.t, 120) * 0.008; this.fl -= dt;
      if (this.wt > 0) { this.wt -= dt; if (this.wt <= 0) this.wave(); return; }
      var done = true, esc = 0;
      for (i = 0; i < this.dk.length; i++) { var d = this.dk[i]; if (d.dly > 0) { d.dly -= dt; done = false; continue; }
        if (d.st === 0) { d.t += dt; d.ct -= dt; if (d.ct <= 0) { d.ct = rnd(0.4, 0.9); d.vx = pickOf([-1, 1]) * rnd(90, 180) * sp; d.vy = -rnd(60, 160) * sp; } d.x += d.vx * dt; d.y += d.vy * dt; if (d.x < 20 || d.x > this.W - 20) { d.vx = -d.vx; d.x = clamp(d.x, 20, this.W - 20); } if (d.y > this.gy - 20 && d.vy > 0) d.vy = -d.vy; if (d.t > 5.5 || (this.shots <= 0 && d.t > 1)) { d.st = 2; } if (d.y < this.pt + 30 && d.t < 5.5) d.vy = Math.abs(d.vy); done = false; }
        else if (d.st === 1) { d.ft -= dt; if (d.ft <= 0) { d.vy += 900 * dt; d.y += d.vy * dt; } if (d.y < this.gy + 20) done = false; }
        else { d.y -= 300 * dt; if (d.y > this.pt - 40) done = false; else esc++; } }
      if (done) { if (this.dk.some(function (d) { return d.st === 2; })) this.hurt(); this.wt = 0.6; }
    },
    duck: function (c, d, now) { var f = d.vx > 0 ? 1 : -1, x = d.x, y = d.y; if (d.st === 1) { k1ell(c, x, y, 16, 12, d.col); dot(c, x, y - 14, 8, "#2f8f4e"); return; } var wf = Math.sin(now / 60 + x) * 10; k1ell(c, x, y, 18, 11, d.col); poly(c, [x - 4, y - 2, x - 10 * f, y - 18 - wf, x + 8 * f, y - 4], "#8a5a2b"); dot(c, x + 16 * f, y - 10, 8, "#2f8f4e"); poly(c, [x + 22 * f, y - 11, x + 32 * f, y - 8, x + 22 * f, y - 6], "#ff9f1c"); dot(c, x + 18 * f, y - 12, 2, "#fff"); },
    draw: function (now) {
      var c = this.ctx, i, gy = this.gy;
      for (i = 0; i < this.dk.length; i++) if (this.dk[i].dly <= 0) this.duck(c, this.dk[i], now);
      c.fillStyle = "#2f8f4e"; c.fillRect(0, gy, this.W, this.H - gy); for (i = 0; i < this.W; i += 26) poly(c, [i, gy, i + 13, gy - 22, i + 26, gy], "#3ddc84"); tree(c, 60, gy - 60, 70);
      for (i = 0; i < 3; i++) fillR(c, 20 + i * 18, this.H - this.pb - 34, 10, 22, 3, i < this.shots ? "#ff4d6d" : "rgba(255,255,255,0.2)");
      if (this.fl > 0) { c.fillStyle = "rgba(255,255,255,0.15)"; c.fillRect(0, this.pt, this.W, this.H); }
      var d0 = this.dk.find(function (d) { return d.st === 0 && d.dly <= 0; }); if (d0) this.ghost(d0.x + 10, d0.y + 10, now);
    }
  }), "forest");

  /* 66. Tambor */
  regD("tambor", "Tambor", "Cuando la nota llega al aro: rojas, tocá a la izquierda; amarillas, tocá a la derecha.", "#ff4d6d", G("Tambor", {
    init: function () { this.hx = 80; this.ly = this.pt + 200; this.ns = []; this.nt = 0.8; this.gauge = 1; this.v = 280; this.fx = 0; this.fxc = "#fff"; },
    act: function (x) { var k = x < this.W / 2 ? 0 : 1, i, best = null, bd = 1e9; this.acts++; sfx(k ? 520 : 160, 0.08, k ? "triangle" : "square", 0.06, 0.8); this.hit = { k: k, t: 0.1 };
      for (i = 0; i < this.ns.length; i++) { var n = this.ns[i]; if (n.done) continue; var d = Math.abs(n.x - this.hx); if (d < bd) { bd = d; best = n; } }
      if (!best || bd > 50) return; var e = bd / this.v; if (best.k !== k && !best.big) { best.done = 1; this.miss(); return; } best.done = 1; if (e < 0.06) { this.good(2, this.hx, this.ly, true); } else if (e < 0.15) this.add(1); else { this.miss(); return; } this.gauge = Math.min(1, this.gauge + 0.05); },
    miss: function () { this.gauge -= 0.34; if (this.gauge <= 0) { this.hurt(); this.gauge = 1; } },
    step: function (dt) {
      var i; this.v = 280 + Math.min(this.t, 120) * 1.4; if (this.hit) { this.hit.t -= dt; if (this.hit.t <= 0) this.hit = null; }
      this.nt -= dt; if (this.nt <= 0) { var beat = Math.max(0.24, 0.42 - this.t * 0.001); this.nt = beat * pickOf([1, 1, 2, 0.5]); this.ns.push({ x: this.W + 20, k: Math.random() < 0.55 ? 0 : 1, big: Math.random() < 0.1 }); }
      for (i = 0; i < this.ns.length; i++) { var n = this.ns[i]; n.x -= this.v * dt; if (!n.done && n.x < this.hx - 50) { n.done = 1; this.miss(); } if (n.x < -30) n.gone = 1; }
      k1fil(this.ns, function (n) { return n.gone || (n.done && n.x > -30 && n.dn); }); for (i = 0; i < this.ns.length; i++) if (this.ns[i].done && this.ns[i].x > this.hx - 50) this.ns[i].dn = 1;
    },
    draw: function (now) {
      var c = this.ctx, i, W = this.W, ly = this.ly;
      fillR(c, 0, ly - 40, W, 80, 0, "rgba(0,0,0,0.3)"); c.fillStyle = "rgba(255,255,255,0.2)"; c.fillRect(0, ly - 40, W, 3); c.fillRect(0, ly + 37, W, 3);
      c.strokeStyle = "#f2f2f2"; c.lineWidth = 4; c.beginPath(); c.arc(this.hx, ly, 30, 0, TAU); c.stroke(); dot(c, this.hx, ly, 20, "rgba(255,255,255,0.15)");
      for (i = this.ns.length - 1; i >= 0; i--) { var n = this.ns[i]; if (n.done) continue; var r = n.big ? 34 : 24; dot(c, n.x, ly, r + 3, "#f2f2f2"); dot(c, n.x, ly, r, n.k ? "#ffd23f" : "#ff4d6d"); dot(c, n.x - r * 0.3, ly - r * 0.3, r * 0.25, "rgba(255,255,255,0.5)"); }
      var dy = this.H - this.pb - 170, dr = Math.min(W * 0.4, 150); dot(c, W / 2, dy, dr + 12, "#8a5a2b"); c.fillStyle = this.hit && this.hit.k === 1 ? "#fff3b0" : "#ffd23f"; c.beginPath(); c.arc(W / 2, dy, dr, 0, TAU); c.fill(); c.fillStyle = this.hit && this.hit.k === 0 ? "#ff8fa3" : "#ff4d6d"; c.beginPath(); c.arc(W / 2, dy, dr * 0.68, 0, TAU); c.fill(); c.fillStyle = "rgba(0,0,0,0.25)"; c.fillRect(W / 2 - 2, dy - dr - 12, 4, dr * 2 + 24);
      fillR(c, 16, this.pt + 2, W - 92, 7, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 2, (W - 92) * clamp(this.gauge, 0, 1), 7, 4, this.gauge < 0.4 ? "#ff4d6d" : "#3ddc84");
      this.ghost(W * 0.3, dy, now);
    }
  }), "school");

  /* 67. Quemado */
  regD("quemado", "Quemado", "Deslizá a los costados para esquivar la pelota. Si tocás justo cuando te llega, la atajás y se la devolvés.", "#ff9f1c", G("Quemado", {
    ctl: "swipe",
    init: function () { this.ln = 1; this.lx = 1; this.py = this.H - this.pb - 100; this.kids = []; for (var k = 0; k < 3; k++) this.kids.push({ l: k, out: 0, col: pickOf(["#ff4d6d", "#c77dff", "#3ddc84"]) }); this.bl = []; this.nt = 1.2; this.catchT = 0; },
    X: function (l) { return this.W * (0.2 + l * 0.3); },
    act: function (x) { this.acts++; if (x === 1) this.ln = Math.max(0, this.ln - 1); else if (x === this.W - 1) this.ln = Math.min(2, this.ln + 1); else this.catchT = 0.18; },
    step: function (dt) {
      var i; this.lx += (this.ln - this.lx) * Math.min(1, dt * 14); this.catchT -= dt; var lane = Math.round(this.lx);
      this.nt -= dt; if (this.nt <= 0) { var ok = this.kids.filter(function (k) { return !k.out; }); if (ok.length) { var kd = pickOf(ok); this.bl.push({ from: kd, l: kd.l, y: this.pt + 110, wind: 0.45, v: 380 + Math.min(this.t, 120) * 3 }); } this.nt = Math.max(0.6, 1.4 - this.t * 0.008) * rnd(0.8, 1.2); }
      for (i = 0; i < this.bl.length; i++) { var b = this.bl[i]; if (b.wind > 0) { b.wind -= dt; continue; } if (b.back) { b.y -= 700 * dt; if (b.y < this.pt + 110) { b.gone = 1; b.from.out = 2.5; this.good(2, this.X(b.l), this.pt + 100, true); } continue; } b.y += b.v * dt;
        if (b.y > this.py - 30 && b.y < this.py + 20 && b.l === lane && !b.done) { if (this.catchT > 0) { b.back = 1; sfx(700, 0.06, "triangle", 0.05, 1.3); } else { b.done = 1; b.gone = 1; this.hurt(); } }
        else if (b.y > this.py + 20 && !b.done) { b.done = 1; this.add(1); } if (b.y > this.H) b.gone = 1; }
      for (i = 0; i < this.kids.length; i++) if (this.kids[i].out > 0) this.kids[i].out = Math.max(0, this.kids[i].out - dt);
      k1fil(this.bl, function (b) { return b.gone; });
    },
    draw: function (now) {
      var c = this.ctx, i, W = this.W;
      c.fillStyle = "#c8553d"; c.fillRect(0, this.pt + 40, W, this.H); c.strokeStyle = "#f2f2f2"; c.lineWidth = 3; c.beginPath(); c.moveTo(0, this.cy); c.lineTo(W, this.cy); c.stroke(); c.strokeRect(10, this.pt + 50, W - 20, this.H - this.pb - this.pt - 60);
      for (i = 0; i < this.kids.length; i++) { var k = this.kids[i], kx = this.X(k.l), ky = this.pt + 110; c.globalAlpha = k.out > 0 ? 0.25 : 1; fillR(c, kx - 12, ky - 4, 24, 30, 7, k.col); buddy(c, kx, ky - 14, 12, "#f2b48a"); c.globalAlpha = 1; }
      for (i = 0; i < this.bl.length; i++) { var b = this.bl[i], bx = this.X(b.l), by = b.wind > 0 ? this.pt + 86 : b.y; dot(c, bx, by, b.wind > 0 ? 10 : 13, "#ff4d6d"); dot(c, bx - 4, by - 4, 4, "#ff8fa3"); }
      var px = W * (0.2 + this.lx * 0.3); c.globalAlpha = this.fadeA(); fillR(c, px - 14, this.py - 8, 28, 34, 8, "#ffd23f"); buddy(c, px, this.py - 18, 13, "#f2b48a"); if (this.catchT > 0) { dot(c, px - 18, this.py - 30, 7, "#f2b48a"); dot(c, px + 18, this.py - 30, 7, "#f2b48a"); } c.globalAlpha = 1;
      this.ghost(px + 40, this.py - 60, now);
    }
  }), "court");

  /* 68. Plomero */
  regD("plomero", "Plomero", "Corre solo. Tocá para saltar (mantené para más alto). Pisá a los bichos y rompé los bloques desde abajo.", "#ff4d6d", G("Plomero", {
    ctl: "hold",
    init: function () { this.gy = this.H - this.pb - 90; this.x = this.W * 0.28; this.y = this.gy; this.vy = 0; this.s = 0; this.gp = []; this.pp = []; this.bk = []; this.en = []; this.nx = this.W + 100; this.on = true; this.dd = 0; },
    press: function () { this.acts++; if (this.on) { this.vy = -600; this.on = false; sfx(500, 0.05, "square", 0.04, 1.5); } },
    release: function () { if (this.vy < -220) this.vy = -220; },
    gen: function () { while (this.nx < this.s + this.W + 200) { var q = Math.random(); if (q < 0.2) { this.gp.push({ x0: this.nx, x1: this.nx + rnd(60, 90) }); this.nx += 90; } else if (q < 0.45) this.pp.push({ x: this.nx, w: 50, h: pickOf([44, 64]) }); else if (q < 0.75) this.en.push({ x: this.nx, vx: -60 }); else { var n = ri(1, 4); for (var k = 0; k < n; k++) this.bk.push({ x: this.nx + k * 34, y: this.gy - 120, q: Math.random() < 0.5, used: 0 }); } this.nx += rnd(180, 300); } },
    gap: function (x) { for (var i = 0; i < this.gp.length; i++) if (x > this.gp[i].x0 + 8 && x < this.gp[i].x1 - 8) return true; return false; },
    step: function (dt) {
      var i, v = 180 + Math.min(this.t, 120) * 1.1, px; this.s += v * dt; this.gen(); px = this.s + this.x;
      this.vy += 1600 * dt; var py0 = this.y; this.y += this.vy * dt; var fl = this.gap(px) ? this.H + 100 : this.gy;
      for (i = 0; i < this.pp.length; i++) { var p = this.pp[i]; if (px + 12 > p.x && px - 12 < p.x + p.w) { var tp = this.gy - p.h; if (py0 <= tp + 2) fl = Math.min(fl, tp); else if (!p.hit && this.y > tp + 4) { p.hit = 1; this.hurt(); } } }
      for (i = 0; i < this.bk.length; i++) { var b = this.bk[i]; if (px + 10 > b.x && px - 10 < b.x + 34) { if (this.vy < 0 && py0 - 40 >= b.y + 30 && this.y - 40 < b.y + 30) { this.vy = 60; this.y = b.y + 70; if (b.q && !b.used) { b.used = 1; this.good(1, b.x + 17 - this.s, b.y, false); } } else if (this.vy >= 0 && py0 <= b.y + 1 && this.y >= b.y) fl = Math.min(fl, b.y); } }
      this.on = false; if (this.y >= fl) { this.y = fl; this.vy = 0; this.on = true; }
      if (this.y > this.gy + 80) { this.hurt(); this.y = this.gy - 200; this.vy = 0; var s1 = px + 200; this.gp = this.gp.filter(function (g) { return g.x0 > s1 || g.x1 < px - 300; }); }
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; e.x += e.vx * dt; if (e.dead) continue; if (Math.abs(e.x - px) < 24 && this.y > this.gy - 44) { if (this.vy > 0 && py0 < this.gy - 18) { e.dead = 1; this.vy = -420; this.add(1); } else { e.dead = 1; this.hurt(); } } }
      if (this.s > this.dd + 150) { this.dd += 150; this.add(1); }
      var s0 = this.s; k1fil(this.en, function (e) { return e.x < s0 - 60; }); k1fil(this.pp, function (p) { return p.x + p.w < s0 - 60; }); k1fil(this.bk, function (b) { return b.x < s0 - 80; }); k1fil(this.gp, function (g) { return g.x1 < s0 - 60; });
    },
    draw: function (now) {
      var c = this.ctx, i, s = this.s, gy = this.gy, W = this.W;
      c.fillStyle = "#c8553d"; c.fillRect(0, gy, W, this.H - gy); c.fillStyle = "#a3402c"; for (var x = -((s) % 30); x < W; x += 30) c.fillRect(x, gy + 4, 2, 60); c.fillStyle = "#3ddc84"; c.fillRect(0, gy, W, 5);
      for (i = 0; i < this.gp.length; i++) { var g = this.gp[i]; c.fillStyle = "#17121f"; c.fillRect(g.x0 - s, gy, g.x1 - g.x0, this.H - gy); }
      for (i = 0; i < this.pp.length; i++) { var p = this.pp[i]; spPipe(c, p.x - s, gy - p.h, p.w, p.h, true); }
      for (i = 0; i < this.bk.length; i++) { var b = this.bk[i], bx = b.x - s; if (b.q) { fillR(c, bx, b.y, 32, 30, 3, b.used ? "#8a6a4a" : "#ffd23f"); if (!b.used) { dot(c, bx + 16, b.y + 15, 6, "#c99a00"); } } else spBrick(c, bx, b.y, 32, 30, "#c8553d"); }
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; if (e.dead) continue; var ex = e.x - s; c.fillStyle = "#c98a4a"; c.beginPath(); c.arc(ex, gy - 12, 16, PI, 0); c.fill(); c.fillRect(ex - 16, gy - 14, 32, 8); c.fillStyle = "#2b2b33"; c.fillRect(ex - 12, gy - 6, 9, 6); c.fillRect(ex + 3, gy - 6, 9, 6); dot(c, ex - 6, gy - 18, 3, "#fff"); dot(c, ex + 6, gy - 18, 3, "#fff"); }
      var px = this.x, py = this.y; c.globalAlpha = this.fadeA(); fillR(c, px - 10, py - 26, 20, 22, 5, "#7a3cff"); c.fillStyle = "#6b4423"; c.fillRect(px - 10, py - 6, 8, 6); c.fillRect(px + 2, py - 6, 8, 6); buddy(c, px, py - 36, 11, "#f2b48a", 1); fillR(c, px - 13, py - 50, 22, 8, 3, "#ff4d6d"); c.fillRect(px - 4, py - 34, 12, 3); c.globalAlpha = 1;
      this.ghostHold(W * 0.7, this.cy, now);
    }
  }), "garden");

  /* 69. Pesca pesca */
  regD("pescapesca", "Pesca pesca", "La pecera gira. Tocá para bajar la caña cuando el pez que pasa por abajo tiene la boca abierta.", "#ff5fd2", G("Pescapesca", {
    init: function () { this.ox = this.W / 2; this.oy = this.cy; this.R = Math.min(this.W, this.H - this.pt - this.pb) * 0.36; this.lvl = 0; this.round(); },
    round: function () { this.fs = []; for (var k = 0; k < 8; k++) this.fs.push({ a: k * TAU / 8, ph: rnd(0, TAU), col: pickOf(["#ff5fd2", "#ffd23f", "#3ddc84", "#ff9f1c", "#c77dff"]) }); this.rot = 0; this.tl = 25; this.drop = 0; this.stun = 0; this.got = 0; },
    rodA: function () { return PI / 2; },
    open: function (f) { return Math.sin(this.t * 2.2 + f.ph) > 0.35 - Math.min(0.3, this.lvl * 0.04); },
    act: function () { if (this.drop > 0 || this.stun > 0) return; this.acts++; this.drop = 0.3; var best = null, bd = 0.28; for (var i = 0; i < this.fs.length; i++) { var f = this.fs[i]; if (f.got) continue; var d = Math.abs(k3adiff(f.a + this.rot, this.rodA())); if (d < bd) { bd = d; best = f; } } if (best && this.open(best)) { best.got = 1; this.got++; this.add(1); sfx(700, 0.08, "triangle", 0.05, 1.2); if (this.got >= this.fs.length) { this.good(3, this.ox, this.oy, true); this.lvl++; this.round(); } } else { this.stun = 0.6; sfx(140, 0.06, "sine", 0.04, 0.7); } },
    step: function (dt) { this.rot += dt * (0.5 + this.lvl * 0.06); this.drop -= dt; this.stun -= dt; this.tl -= dt; if (this.tl <= 0) { this.hurt(); this.round(); } },
    draw: function (now) {
      var c = this.ctx, i, R = this.R, ox = this.ox, oy = this.oy;
      dot(c, ox, oy, R + 30, "#ff4d6d"); dot(c, ox, oy, R + 18, "#ffd23f"); dot(c, ox, oy, R + 6, "#3fb7c9");
      for (i = 0; i < this.fs.length; i++) { var f = this.fs[i]; if (f.got) continue; var a = f.a + this.rot, x = ox + Math.cos(a) * R * 0.78, y = oy + Math.sin(a) * R * 0.78; dot(c, x, y, 20, f.col); dot(c, x, y - 2, 13, this.open(f) ? "#2b2b33" : f.col); if (!this.open(f)) k1ln(c, x - 10, y - 2, x + 10, y - 2, 3, "#2b2b33"); dot(c, x - 10, y - 14, 4, "#fff"); dot(c, x + 10, y - 14, 4, "#fff"); }
      var ra = this.rodA(), tx = ox + Math.cos(ra) * R * 0.78, ty = oy + Math.sin(ra) * R * 0.78, len = this.drop > 0 ? 0 : 50;
      k1ln(c, this.W - 30, this.H - this.pb - 20, tx + 60, ty + len - 70, 6, "#c98a4a"); k1ln(c, tx + 60, ty + len - 70, tx, ty - 10 + len * 0.2, 2, "#f2f2f2"); dot(c, tx, ty - 6 + len * 0.2, 5, this.stun > 0 ? "#9aa1ab" : "#ff4d6d");
      for (i = 0; i < this.got; i++) dot(c, 24 + i * 14, this.H - this.pb - 16, 5, "#ffd23f");
      fillR(c, 16, this.pt + 2, this.W - 92, 6, 3, "rgba(255,255,255,0.12)"); fillR(c, 16, this.pt + 2, (this.W - 92) * clamp(this.tl / 25, 0, 1), 6, 3, this.tl < 6 ? "#ff4d6d" : "#f2f2f2");
      this.ghost(tx + 40, ty + 60, now);
    }
  }), "table");

  /* 70. Clavijas */
  regD("clavijas", "Clavijas", "Arrastrá para apuntar el cañón y soltá para tirar. Pegale a todas las clavijas naranjas.", "#ff9f1c", G("Clavijas", {
    ctl: "drag",
    init: function () { this.cx0 = this.W / 2; this.cy0 = this.pt + 40; this.aim = PI / 2; this.board(); },
    board: function () { this.pg = []; var rows = 7, k, r; for (r = 0; r < rows; r++) for (k = 0; k < 6; k++) { var x = 40 + k * (this.W - 80) / 5 + (r % 2 ? (this.W - 80) / 10 : 0); if (x > this.W - 30) continue; this.pg.push({ x: x + rnd(-6, 6), y: this.pt + 140 + r * ((this.H - this.pb - this.pt - 260) / (rows - 1)), or: 0, lit: 0 }); } for (k = 0; k < 8; k++) pickOf(this.pg).or = 1; this.balls = 6; this.b = null; this.bkx = this.W / 2; this.bkv = 90; },
    drag: function (x) { if (!this.b) this.aim = clamp(PI - (x / this.W) * PI, 0.2, PI - 0.2); },
    release: function () { if (!this.b && this.balls > 0) { this.b = { x: this.cx0, y: this.cy0, vx: Math.cos(this.aim) * 420, vy: Math.sin(this.aim) * 420 }; this.balls--; this.acts++; sfx(300, 0.06, "square", 0.04, 1.4); } },
    step: function (dt) {
      var i, by = this.H - this.pb - 26; this.bkx += this.bkv * dt; if (this.bkx < 50 || this.bkx > this.W - 50) this.bkv = -this.bkv;
      if (this.b) { var b = this.b; for (var s = 0; s < 3; s++) { var h = dt / 3; b.vy += 560 * h; b.x += b.vx * h; b.y += b.vy * h; if (b.x < 10) { b.x = 10; b.vx = Math.abs(b.vx); } if (b.x > this.W - 10) { b.x = this.W - 10; b.vx = -Math.abs(b.vx); }
          for (i = 0; i < this.pg.length; i++) { var p = this.pg[i], dx = b.x - p.x, dy = b.y - p.y, d = Math.hypot(dx, dy); if (d < 17 && d > 0) { var nx = dx / d, ny = dy / d; b.x = p.x + nx * 17; b.y = p.y + ny * 17; var vn = b.vx * nx + b.vy * ny; if (vn < 0) { b.vx -= 1.75 * vn * nx; b.vy -= 1.75 * vn * ny; } if (!p.lit) { p.lit = 1; if (p.or) this.add(1); sfx(500 + i * 10, 0.03, "triangle", 0.03, 1.2); } } } }
        if (b.y > by - 10 && Math.abs(b.x - this.bkx) < 40) { this.balls++; this.good(1, b.x, by, true); this.endB(); } else if (b.y > this.H - this.pb + 10) this.endB(); }
    },
    endB: function () { this.b = null; k1fil(this.pg, function (p) { return p.lit; }); var left = this.pg.some(function (p) { return p.or; }); if (!left) { this.good(5, this.W / 2, this.cy, true); this.board(); } else if (this.balls <= 0) { this.hurt(); this.board(); } },
    draw: function (now) {
      var c = this.ctx, i, by = this.H - this.pb - 26;
      for (i = 0; i < this.pg.length; i++) { var p = this.pg[i]; dot(c, p.x, p.y, 9, p.lit ? (p.or ? "#fff3b0" : "#f2d9ff") : (p.or ? "#ff9f1c" : "#c77dff")); dot(c, p.x - 3, p.y - 3, 3, "rgba(255,255,255,0.6)"); }
      fillR(c, this.bkx - 40, by - 6, 80, 22, 8, "#3ddc84"); c.fillStyle = "#1f8a4c"; c.fillRect(this.bkx - 34, by, 68, 4);
      if (!this.b) { c.strokeStyle = "rgba(255,255,255,0.4)"; c.setLineDash([5, 7]); c.lineWidth = 2; c.beginPath(); c.moveTo(this.cx0, this.cy0); c.lineTo(this.cx0 + Math.cos(this.aim) * 110, this.cy0 + Math.sin(this.aim) * 110); c.stroke(); c.setLineDash([]); }
      c.save(); c.translate(this.cx0, this.cy0); c.rotate(this.aim - PI / 2); fillR(c, -9, -4, 18, 34, 5, "#9aa1ab"); c.restore(); dot(c, this.cx0, this.cy0, 16, "#55555f");
      if (this.b) dot(c, this.b.x, this.b.y, 8, "#f2f2f2");
      for (i = 0; i < this.balls; i++) dot(c, 20 + i * 14, this.pt + 20, 5, "#f2f2f2");
      this.ghostDrag(this.cy0 + 70, now);
    }
  }), "arcade");

  /* 71. Pulpo */
  regD("pulpo", "Pulpo", "Tocá a la derecha para avanzar y a la izquierda para volver. Agarrá el tesoro y llevalo al bote sin que te toque un tentáculo.", "#c77dff", G("Pulpo", {
    init: function () { this.pos = 0; this.carry = 0; this.tn = []; for (var k = 0; k < 3; k++) this.tn.push({ L: 0, d: 1, tm: rnd(0.2, 0.8), cov: k + 2 }); },
    P: function (i) { var t = i / 5; return { x: 50 + t * (this.W - 200), y: this.pt + 110 + t * (this.H - this.pb - this.pt - 230) }; },
    act: function (x) { this.acts++; if (x >= this.W / 2) { if (this.pos < 5) this.pos++; else { this.carry++; sfx(700, 0.05, "triangle", 0.04, 1.3); } } else if (this.pos > 0) { this.pos--; if (this.pos === 0 && this.carry > 0) { this.good(this.carry, 50, this.pt + 90, this.carry >= 3); this.carry = 0; } } sfx(300, 0.03, "sine", 0.03, 1); },
    step: function (dt) {
      var i, sp = Math.max(0.22, 0.5 - this.t * 0.002);
      for (i = 0; i < this.tn.length; i++) { var q = this.tn[i]; q.tm -= dt; if (q.tm <= 0) { q.tm = sp * rnd(0.7, 1.3); q.L += q.d; if (q.L >= 3) { q.L = 3; q.d = -1; } if (q.L <= 0) { q.L = 0; q.d = 1; q.tm += rnd(0, 0.8); } } if (q.L === 3 && this.pos === q.cov) { this.hurt(); this.pos = 0; this.carry = 0; } }
    },
    draw: function (now) {
      var c = this.ctx, i, k, W = this.W, ox = W - 70, oy = this.H - this.pb - 70;
      fillR(c, 10, this.pt + 70, 90, 22, 10, "#c98a4a"); c.fillStyle = "#8a5a2b"; c.fillRect(48, this.pt + 30, 4, 40);
      for (i = 1; i <= 4; i++) { var p = this.P(i); fillR(c, p.x - 18, p.y + 16, 36, 8, 4, "rgba(255,255,255,0.25)"); }
      var tp = this.P(5); fillR(c, tp.x - 22, tp.y + 2, 44, 28, 5, "#c98a4a"); c.fillStyle = "#ffd23f"; c.fillRect(tp.x - 18, tp.y - 4, 36, 10); dot(c, tp.x - 8, tp.y - 6, 5, "#ffd23f"); dot(c, tp.x + 6, tp.y - 8, 5, "#ff5fd2");
      for (i = 0; i < this.tn.length; i++) { var q = this.tn[i], tg = this.P(q.cov); for (k = 1; k <= q.L; k++) { var f = k / 3, x = ox + (tg.x - ox) * f, y = oy + (tg.y + 10 - oy) * f + Math.sin(now / 200 + k + i) * 6; dot(c, x, y, 16 - k * 2, q.L === 3 ? "#ff5fd2" : "#c77dff"); } }
      dot(c, ox, oy, 54, "#c77dff"); dot(c, ox - 18, oy - 10, 12, "#fff"); dot(c, ox + 18, oy - 10, 12, "#fff"); dot(c, ox - 16, oy - 8, 5, "#2b2b33"); dot(c, ox + 20, oy - 8, 5, "#2b2b33");
      var pp = this.pos === 0 ? { x: 50, y: this.pt + 56 } : this.P(this.pos); c.globalAlpha = this.fadeA(); fillR(c, pp.x - 10, pp.y - 6, 20, 24, 6, "#ffd23f"); dot(c, pp.x, pp.y - 14, 11, "#9aa1ab"); dot(c, pp.x, pp.y - 14, 7, "#bfe9ff"); for (k = 0; k < this.carry; k++) dot(c, pp.x + 14, pp.y + 10 - k * 6, 4, "#ffd23f"); c.globalAlpha = 1;
      this.ghost(W * 0.75, this.cy, now);
    }
  }), "sea");

  /* 72. Malabares */
  regD("malabares", "Malabares", "Tocá a la izquierda o a la derecha para mover esa mano adentro o afuera. Que cada pelota caiga en una mano.", "#ffd23f", G("Malabares", {
    init: function () { this.hy = this.H - this.pb - 150; this.hand = [1, 1]; this.sx = [this.W * 0.18, this.W * 0.36, this.W * 0.64, this.W * 0.82]; this.bs = [this.ball(0, 0.4), this.ball(1, 1.1)]; },
    ball: function (tr, delay) { return { tr: tr, from: tr ? 1 : 0, k: -delay / 1.4, col: pickOf(["#ff4d6d", "#3ddc84", "#ff9f1c", "#c77dff"]) }; },
    act: function (x) { var h = x < this.W / 2 ? 0 : 1; this.hand[h] = 1 - this.hand[h]; this.acts++; sfx(400, 0.03, "sine", 0.03, 1); },
    spot: function (b, end) { var a = b.tr ? [1, 2] : [0, 3], s = end ? (b.from === a[0] ? a[1] : a[0]) : b.from; return s; },
    step: function (dt) {
      var i, T = Math.max(0.75, 1.3 - this.t * 0.004);
      if (this.score >= 12 && this.bs.length < 3) this.bs.push(this.ball(0, 0.8));
      for (i = 0; i < this.bs.length; i++) { var b = this.bs[i]; b.k += dt / (b.tr ? T * 0.75 : T); if (b.k >= 1) { var s = this.spot(b, true), side = s < 2 ? 0 : 1, need = (s === 1 || s === 2) ? 1 : 0; if (this.hand[side] === need) { this.add(1); sfx(500, 0.03, "triangle", 0.03, 1.2); } else this.hurt(); b.from = s; b.k = 0; } }
    },
    draw: function (now) {
      var c = this.ctx, i, W = this.W, hy = this.hy;
      fillR(c, W / 2 - 30, hy - 20, 60, 120, 20, "#ff4d6d"); buddy(c, W / 2, hy - 50, 30, "#f2b48a"); c.fillStyle = "#ffd23f"; poly(c, [W / 2 - 24, hy - 72, W / 2, hy - 120, W / 2 + 24, hy - 72], "#ffd23f");
      for (i = 0; i < 2; i++) { var hx = this.sx[i ? (this.hand[1] ? 2 : 3) : (this.hand[0] ? 1 : 0)]; k1ln(c, W / 2 + (i ? 24 : -24), hy, hx, hy + 20, 10, "#ff4d6d"); dot(c, hx, hy + 22, 14, "#f2b48a"); }
      for (i = 0; i < 4; i++) dot(c, this.sx[i], hy + 50, 5, "rgba(255,255,255,0.25)");
      for (i = 0; i < this.bs.length; i++) { var b = this.bs[i]; if (b.k < 0) continue; var a = this.sx[this.spot(b, false)], e = this.sx[this.spot(b, true)], h = b.tr ? 170 : 290, x = a + (e - a) * b.k, y = hy + 10 - Math.sin(b.k * PI) * h; dot(c, x, y, 12, b.col); dot(c, x - 4, y - 4, 4, "rgba(255,255,255,0.5)"); }
      this.ghost(W * 0.25, hy + 80, now);
    }
  }), "circus");
