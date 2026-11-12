
  /* --- Lanzamientos (mantener para cargar, soltar para tirar) --- */
  function mkLaunch(o) {
    var C = G("Launch_" + o.id, {
      ctl: "hold",
      init: function () { this.gy = this.H - this.pb - 20; this.lx = 44; this.ly = this.gy - 24; this.p = 0; this.pd = 1; this.sh = null; this.newT(); },
      rng: function (p) { var v = o.v0 + p * (o.v1 - o.v0); return o.roll ? v * v / (2 * o.mu) : v * v * Math.sin(2 * o.a) / o.g; },
      newT: function () { var R = this.rng(rnd(0.25, 0.85)); this.tx = Math.min(this.W - 90, this.lx + R); },
      press: function () { if (!this.sh) { this.p = 0; this.pd = 1; } },
      release: function (x, y, cancel) {
        if (cancel || this.sh) return; var v = o.v0 + this.p * (o.v1 - o.v0); this.acts++; sfx(300, 0.15, "sine", 0.05, 1.6);
        this.sh = o.roll ? { x: this.lx + 14, y: this.gy - 8, v: v } : { x: this.lx, y: this.ly, vx: Math.cos(o.a) * v, vy: -Math.sin(o.a) * v }; this.p = 0;
      },
      step: function (dt) {
        if (this.holding && !this.sh) { this.p += this.pd * dt * 0.7; if (this.p >= 1) { this.p = 1; this.pd = -1; } if (this.p <= 0) { this.p = 0; this.pd = 1; } }
        var s = this.sh; if (!s) return;
        if (o.roll) { s.x += s.v * dt; s.v -= o.mu * dt * (s.v / Math.max(s.v, 1)); if (s.v <= 1) { this.res(s.x - 0); } return; }
        s.vy += o.g * dt; s.x += s.vx * dt; s.y += s.vy * dt; if (s.y >= this.gy) this.res(s.x);
      },
      res: function (x) { var ok = Math.abs(x - this.tx) <= (o.tol || 36); this.sh = null; if (ok) { this.good(1, this.tx, this.gy - 30, false); this.newT(); } else this.hurt(); },
      draw: function (now) {
        var c = this.ctx; c.fillStyle = o.roll ? "#1f3d26" : "#262626"; c.fillRect(0, this.gy, this.W, this.H - this.gy);
        if (o.roll) { c.fillStyle = "#000"; c.beginPath(); c.arc(this.tx, this.gy - 4, (o.tol || 36) * 0.5 + 6, 0, TAU); c.fill(); c.fillStyle = "#fff"; c.fillRect(this.tx - 1.5, this.gy - 46, 3, 42); c.fillStyle = RED; c.fillRect(this.tx, this.gy - 46, 16, 10); }
        else { c.fillStyle = RED; c.beginPath(); c.arc(this.tx, this.gy - 14, 14, 0, TAU); c.fill(); c.fillStyle = "#fff"; c.beginPath(); c.arc(this.tx, this.gy - 14, 6, 0, TAU); c.fill(); }
        if (!o.roll) { c.strokeStyle = "#fff"; c.lineWidth = 8; c.lineCap = "round"; c.beginPath(); c.moveTo(this.lx - 10, this.ly + 10 + (o.a < 0.6 ? 6 : 0)); c.lineTo(this.lx + Math.cos(o.a) * 22, this.ly + 10 - Math.sin(o.a) * 22); c.stroke(); c.lineCap = "butt"; }
        fillR(c, this.lx - 20, this.gy - 12, 40, 12, 3, "#8a8a8a");
        fillR(c, this.lx - 30, this.gy + 14, 60, 8, 4, "rgba(255,255,255,0.15)"); fillR(c, this.lx - 30, this.gy + 14, 60 * this.p, 8, 4, YEL);
        if (this.sh) { c.fillStyle = "#fff"; c.beginPath(); c.arc(this.sh.x, this.sh.y, 8, 0, TAU); c.fill(); }
        this.ghostHold(this.lx + 120, this.ly - 60, now);
      }
    });
    reg("l_" + o.id, o.name, o.how, o.acc, C);
  }
  [
    { id: "can", name: "Cañón", how: "Mantené apretado para cargar y soltá. La bala tiene que caer en el blanco rojo.", a: 0.7, v0: 280, v1: 620, g: 900, acc: ORA },
    { id: "bow", name: "Arco", how: "Mantené apretado para tensar el arco y soltá. Flecha rápida y recta.", a: 0.35, v0: 380, v1: 760, g: 700, tol: 30, acc: GRN },
    { id: "hi", name: "Tiro en alto", how: "Mantené apretado para cargar. La pelota sube alto y cae en el blanco.", a: 1.15, v0: 320, v1: 640, g: 900, acc: PUR },
    { id: "golf", name: "Golf", how: "Mantené apretado para cargar y soltá. La bocha tiene que frenar en el hoyo.", roll: 1, mu: 220, v0: 170, v1: 330, tol: 30, acc: GRN },
    { id: "golf2", name: "Golf largo", how: "Hoyos más lejos y con menos margen. Mantené y soltá.", roll: 1, mu: 200, v0: 190, v1: 380, tol: 22, acc: YEL }
  ].forEach(mkLaunch);

  /* --- Dardos y platos --- */
  function mkDart(o) {
    var C = G("Dart_" + o.id, {
      init: function () { this.u = rnd(0, 6); this.mark = null; this.mk = 0; this.bx = this.cx - 38; this.by = this.cy - 20; this.chx = this.bx; this.chy = this.by; },
      act: function () {
        var d = Math.hypot(this.chx - this.bx, this.chy - this.by); this.acts++; this.mark = { x: this.chx, y: this.chy }; this.mk = 0.7;
        if (d < 22) { this.add(3); S.perfect(); } else if (d < 55) { this.add(2); S.hit(this.score); } else if (d < 92) { this.add(1); S.hit(this.score); } else this.hurt();
      },
      step: function (dt) {
        this.mk = Math.max(0, this.mk - dt); this.u += dt * (o.sp + Math.min(1.2, this.score * 0.03));
        this.chx = this.bx + Math.sin(this.u * 1.3) * o.ax + Math.sin(this.u * 2.3 + 1) * o.ax * 0.4; this.chy = this.by + Math.cos(this.u * 1.7) * o.ay + Math.sin(this.u * 2.9) * o.ay * 0.4;
      },
      draw: function (now) {
        var c = this.ctx; c.fillStyle = "#1c1c1c"; c.beginPath(); c.arc(this.bx, this.by, 100, 0, TAU); c.fill();
        c.fillStyle = "#2c2c2c"; c.beginPath(); c.arc(this.bx, this.by, 92, 0, TAU); c.fill(); c.fillStyle = "#1c1c1c"; c.beginPath(); c.arc(this.bx, this.by, 55, 0, TAU); c.fill(); c.fillStyle = RED; c.beginPath(); c.arc(this.bx, this.by, 22, 0, TAU); c.fill();
        if (this.mark && this.mk > 0) { c.fillStyle = YEL; c.beginPath(); c.arc(this.mark.x, this.mark.y, 6, 0, TAU); c.fill(); }
        c.strokeStyle = "#fff"; c.lineWidth = 3; c.beginPath(); c.moveTo(this.chx - 18, this.chy); c.lineTo(this.chx + 18, this.chy); c.moveTo(this.chx, this.chy - 18); c.lineTo(this.chx, this.chy + 18); c.stroke(); c.beginPath(); c.arc(this.chx, this.chy, 10, 0, TAU); c.stroke();
        this.ghost(this.cx - 38, this.cy + 150, now);
      }
    });
    reg("a_" + o.id, o.name, o.how, o.acc, C);
  }
  [
    { id: "d1", name: "Dardos", how: "Tocá cuando la mira pase por el centro del blanco.", sp: 1.0, ax: 80, ay: 70, acc: RED },
    { id: "d2", name: "Dardos locos", how: "La mira se mueve mucho más. Tocá en el momento justo.", sp: 1.7, ax: 100, ay: 90, acc: PNK },
    { id: "d3", name: "Diana lenta", how: "La mira va despacio. Apuntá al centro rojo.", sp: 0.6, ax: 70, ay: 60, acc: GRN }
  ].forEach(mkDart);
  function mkClay(o) {
    var C = G("Clay_" + o.id, {
      init: function () { this.ds = []; this.sp = 0.4; this.mx = this.cx - 38; this.fl = 0; },
      act: function () {
        this.acts++; this.fl = 0.12; var h = -1;
        for (var i = 0; i < this.ds.length; i++) if (Math.abs(this.ds[i].x - this.mx) < this.ds[i].r + 14) { h = i; break; }
        if (h >= 0) { this.ds.splice(h, 1); this.add(1); S.hit(this.score); } else this.hurt();
      },
      step: function (dt) {
        this.fl = Math.max(0, this.fl - dt); this.sp -= dt;
        if (this.sp <= 0 && this.ds.length < 2) { this.sp = rnd(0.9, 1.6); var d = Math.random() < 0.5 ? 1 : -1; this.ds.push({ x: d > 0 ? -30 : this.W + 30, y: rnd(this.pt + 80, this.cy + 40), vx: d * (o.v + Math.min(200, this.score * 5)), r: o.r }); }
        for (var i = this.ds.length - 1; i >= 0; i--) { var s = this.ds[i]; s.x += s.vx * dt; if (s.x < -60 || s.x > this.W + 60) this.ds.splice(i, 1); }
      },
      draw: function (now) {
        var c = this.ctx, i; c.fillStyle = this.fl > 0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"; c.fillRect(this.mx - 14, this.pt, 28, this.H - this.pt - this.pb);
        c.strokeStyle = "#fff"; c.lineWidth = 3; c.beginPath(); c.moveTo(this.mx, this.pt); c.lineTo(this.mx, this.H - this.pb); c.stroke();
        for (i = 0; i < this.ds.length; i++) { c.fillStyle = ORA; c.beginPath(); c.ellipse(this.ds[i].x, this.ds[i].y, this.ds[i].r, this.ds[i].r * 0.45, 0, 0, TAU); c.fill(); }
        this.ghost(this.mx, this.cy + 120, now);
      }
    });
    reg("z_" + o.id, o.name, o.how, o.acc, C);
  }
  [
    { id: "a", name: "Tiro al plato", how: "Tocá cuando el plato pase por la línea blanca. Si tocás de más, perdés una vida.", v: 220, r: 28, acc: ORA },
    { id: "b", name: "Platos veloces", how: "Los platos vuelan más rápido y son más chicos.", v: 340, r: 20, acc: RED }
  ].forEach(mkClay);
  var Bowl = G("Bowl", {
    ctl: "drag",
    init: function () { this.mx = this.cx - 38; this.ox = this.mx; this.ball = null; this.pins = 10; this.rs = 0; this.ly = this.H - this.pb - 40; this.ty = this.pt + 110; },
    drag: function (x) { if (!this.ball && this.rs <= 0) this.ox = clamp(x, this.mx - 120, this.mx + 120); },
    release: function (x, y, cancel) { if (cancel || this.ball || this.rs > 0) return; this.acts++; this.ball = { x: this.ox, y: this.ly, t: 0 }; },
    step: function (dt) {
      if (this.rs > 0) { this.rs -= dt; if (this.rs <= 0) this.pins = 10; }
      if (this.ball) {
        var b = this.ball; b.t += dt / 0.55; b.y = lerp(this.ly, this.ty + 40, Math.min(1, b.t));
        if (b.t >= 1) { var off = Math.abs(b.x - this.mx); this.ball = null; this.rs = 0.7; if (off < 16) { this.pins = 0; this.add(3); S.perfect(); } else if (off < 46) { this.pins = 3; this.add(2); S.hit(this.score); } else if (off < 80) { this.pins = 7; this.add(1); S.hit(this.score); } else { this.hurt(); } }
      }
    },
    draw: function (now) {
      var c = this.ctx, r, k, n = 0; fillR(c, this.mx - 130, this.pt + 20, 260, this.ly - this.pt, 8, "#1c1c1c");
      for (r = 0; r < 4; r++) for (k = 0; k <= r; k++) { n++; if (n <= this.pins) { c.fillStyle = "#fff"; c.beginPath(); c.arc(this.mx + (k - r / 2) * 26, this.ty + r * 24, 9, 0, TAU); c.fill(); } }
      if (!this.ball && this.rs <= 0) { c.fillStyle = "rgba(255,255,255,0.22)"; c.fillRect(this.ox - 1.5, this.ty + 90, 3, this.ly - this.ty - 90); }
      var b = this.ball; c.fillStyle = PUR; c.beginPath(); c.arc(b ? b.x : this.ox, b ? b.y : this.ly, 16, 0, TAU); c.fill();
      if (!this.ball && this.rs <= 0) this.ghostDrag(this.ly + 36, now);
    }
  });
  reg("a_bowl", "Bolos", "Arrastrá para apuntar y soltá para tirar la bocha. Más al centro, más pinos.", PUR, Bowl);

  /* --- Equilibrio (arrastrar para inclinar) --- */
  function mkBal(o) {
    var C = G("Bal_" + o.id, {
      ctl: "drag",
      init: function () { this.L = o.len; this.tilt = 0; this.tt = 0; this.balls = []; for (var i = 0; i < (o.n || 1); i++) this.balls.push({ s: (i - ((o.n || 1) - 1) / 2) * 40, v: 0 }); this.sec = 0; this.wt = 1.2; this.wa = 0; },
      drag: function (x) { this.tt = clamp((x - this.cx) / (this.W / 2), -1, 1) * 0.42; },
      release: function () { this.tt = 0; },
      step: function (dt) {
        this.tilt += (this.tt - this.tilt) * Math.min(1, dt * 7); this.sec += dt; if (this.sec >= 1) { this.sec -= 1; this.add(1); }
        if (o.wind) { this.wt -= dt; if (this.wt <= 0) { this.wt = rnd(1, 2.2); this.wa = rnd(-130, 130); } }
        var fall = false;
        for (var i = 0; i < this.balls.length; i++) {
          var b = this.balls[i]; b.v += (Math.sin(this.tilt) * 900 + this.wa) * dt; b.v *= (1 - o.fr * dt); b.s += b.v * dt; if (Math.abs(b.s) > this.L) fall = true;
        }
        if (fall) { this.hurt(); if (this.state !== "play") return; for (i = 0; i < this.balls.length; i++) { this.balls[i].s = (i - (this.balls.length - 1) / 2) * 40; this.balls[i].v = 0; } this.tilt = 0; this.wa = 0; }
      },
      draw: function (now) {
        var c = this.ctx, py = this.H - this.pb - 70, px = this.cx - 38;
        c.fillStyle = "#555"; c.beginPath(); c.moveTo(px, py + 6); c.lineTo(px + 22, py + 56); c.lineTo(px - 22, py + 56); c.closePath(); c.fill();
        c.save(); c.translate(px, py); c.rotate(this.tilt); fillR(c, -this.L, 0, this.L * 2, 10, 4, "#fff");
        for (var i = 0; i < this.balls.length; i++) { c.fillStyle = BCOL[i % 5]; c.beginPath(); c.arc(this.balls[i].s, -16, 16, 0, TAU); c.fill(); face(c, this.balls[i].s, -16, 16, this.balls[i].v / 120); }
        c.restore();
        if (o.wind) txt(c, this.wa > 20 ? "→" : this.wa < -20 ? "←" : "", px, this.pt + 60, 40, "rgba(255,255,255,0.5)");
        this.ghostDrag(py - 120, now);
      }
    });
    reg("b_" + o.id, o.name, o.how, o.acc, C);
  }
  [
    { id: "a", name: "Equilibrio", how: "Mantené apretado y arrastrá para inclinar la tabla. Que la bola no se caiga.", len: 130, fr: 0.5, acc: YEL },
    { id: "w", name: "Equilibrio con viento", how: "El viento empuja la bola. Inclinala para compensar.", len: 130, fr: 0.5, wind: 1, acc: GRN },
    { id: "s", name: "Tabla corta", how: "La tabla es más chica. Tenés poco margen.", len: 90, fr: 0.5, acc: RED },
    { id: "t", name: "Dos bolas", how: "Dos bolas sobre la misma tabla. Que ninguna se caiga.", len: 150, fr: 0.6, n: 2, acc: PUR },
    { id: "i", name: "Tabla resbalosa", how: "La bola casi no frena. Inclinala con cuidado.", len: 140, fr: 0.1, acc: PNK }
  ].forEach(mkBal);

  /* --- Seguir el camino (arrastrar) --- */
  function mkPath(o) {
    var C = G("Path_" + o.id, {
      ctl: "drag",
      init: function () { this.d = 0; this.px = this.cx - 38; this.tx = this.px; this.py = this.H - this.pb - 80; this.out = 0; this.acc = 0; },
      drag: function (x) { this.tx = clamp(x, 14, this.W - 14); },
      cen: function (d, hw) { var v = this.cx - 38 + o.amp * Math.sin(d * o.f1) + o.amp * 0.4 * Math.sin(d * o.f2 + 1.3); return clamp(v, hw + 6, this.W - 76 - hw); },
      wid: function (d) { return o.w + (o.wv || 0) * Math.sin(d * 0.012) - Math.min(30, this.score * 0.5); },
      step: function (dt) {
        this.d += (o.v + Math.min(110, this.score * 2.5)) * dt; this.px += (this.tx - this.px) * Math.min(1, dt * 18);
        var w = this.wid(this.d), ct = this.cen(this.d, w / 2), inside = Math.abs(this.px - ct) < w / 2 - 6;
        if (inside) { this.out = Math.max(0, this.out - dt); this.acc += dt; if (this.acc >= 0.8) { this.acc = 0; this.add(1); } }
        else { this.out += dt; if (this.out > 0.45) { this.hurt(); this.out = -0.6; if (this.state !== "play") return; } }
      },
      draw: function (now) {
        var c = this.ctx, y, bot = this.H - this.pb + 10;
        for (y = this.pt - 10; y < bot; y += 6) { var d = this.d + (this.py - y), w = this.wid(d), ct = this.cen(d, w / 2); c.fillStyle = "#262626"; c.fillRect(0, y, ct - w / 2, 7); c.fillRect(ct + w / 2, y, this.W - (ct + w / 2), 7); c.fillStyle = "#fff"; c.fillRect(ct - w / 2 - 2, y, 2, 7); c.fillRect(ct + w / 2, y, 2, 7); }
        if (!this.blink()) { c.fillStyle = o.col; c.beginPath(); c.arc(this.px, this.py, 14, 0, TAU); c.fill(); face(c, this.px, this.py, 14, (this.tx - this.px) / 30); }
        this.ghostDrag(this.py - 100, now);
      }
    });
    reg("h_" + o.id, o.name, o.how, o.col, C);
  }
  [
    { id: "wide", name: "Camino ancho", how: "Arrastrá el dedo para quedarte dentro del camino.", amp: 80, f1: 0.012, f2: 0.027, w: 170, v: 190, col: GRN },
    { id: "nar", name: "Camino angosto", how: "El camino es finito. Seguilo con cuidado.", amp: 80, f1: 0.011, f2: 0.025, w: 100, v: 170, col: YEL },
    { id: "zig", name: "Zigzag", how: "El camino cambia de lado seguido.", amp: 105, f1: 0.02, f2: 0.041, w: 140, v: 200, col: PUR },
    { id: "riv", name: "Río", how: "El río se ensancha y se angosta.", amp: 85, f1: 0.01, f2: 0.023, w: 150, wv: 40, v: 190, col: ORA },
    { id: "tur", name: "Autopista", how: "Corre rápido. No te salgas.", amp: 70, f1: 0.008, f2: 0.019, w: 150, v: 300, col: RED },
    { id: "ser", name: "Serpiente", how: "Curvas largas y suaves.", amp: 100, f1: 0.007, f2: 0.015, w: 120, v: 220, col: PNK }
  ].forEach(mkPath);

  /* --- Juegos de mesa contra la máquina --- */
  var Nim = G("Nim", {
    init: function () { this.reset2(); },
    reset2: function () { this.n = 15; this.turn = 1; this.wait = 0; this.pend = null; this.bt = []; },
    take: function (k, who) {
      this.n -= k;
      if (this.n <= 0) { this.n = 0; if (who === 1) { this.hurt(); } else { this.add(1); S.perfect(); } this.pend = "new"; this.wait = 0.8; return true; } return false;
    },
    act: function (x, y) {
      if (this.turn !== 1 || this.pend) return; var by = this.H - this.pb - 100;
      if (y < by || y > by + 80) return; var k = Math.floor((x - 12) / ((this.W - 100) / 3)) + 1; if (k < 1 || k > 3 || k > this.n) return; this.acts++;
      if (!this.take(k, 1)) { this.turn = 2; this.wait = 0.6; }
    },
    step: function (dt) {
      if (this.wait <= 0) return; this.wait -= dt; if (this.wait > 0) return;
      if (this.pend === "new") { this.reset2(); return; }
      if (this.turn === 2) { var k = (this.n - 1) % 4; if (k < 1 || k > 3 || Math.random() < 0.15) k = ri(1, Math.min(3, this.n) + 1); k = Math.min(k, this.n); if (!this.take(k, 2)) this.turn = 1; }
    },
    draw: function (now) {
      var c = this.ctx, i, bw = (this.W - 100) / 3, by = this.H - this.pb - 100;
      txt(c, "El que toma el último palito pierde", this.cx - 38, this.pt + 40, 17, "rgba(255,255,255,0.6)", "center", 600);
      for (i = 0; i < 15; i++) { var x = 30 + (i % 8) * 36 + (i >= 8 ? 18 : 0), y = this.cy - 60 + Math.floor(i / 8) * 90; if (i < this.n) fillR(c, x, y, 12, 70, 5, "#fff"); else fillR(c, x, y, 12, 70, 5, "rgba(255,255,255,0.06)"); }
      for (i = 1; i <= 3; i++) { var on = i <= this.n && this.turn === 1; fillR(c, 12 + (i - 1) * bw + 4, by, bw - 8, 80, 16, on ? "#262626" : "#141414"); txt(c, String(i), 12 + (i - 1) * bw + bw / 2, by + 41, 34, on ? "#fff" : "#555"); }
      this.ghost(12 + bw * 1.5, by + 40, now);
    }
  });
  reg("x_nim", "Palitos", "Hay 15 palitos. Sacá 1, 2 o 3 por turno. El que saca el último pierde.", ORA, Nim);
  var Bj = G("Bj", {
    init: function () { this.deal(); },
    deal: function () { this.me = [ri(1, 11), ri(1, 11)]; this.dl = [ri(1, 11)]; this.stand = false; this.res = 0; this.wait = 0; this.pend = false; },
    sum: function (a) { return a.reduce(function (s, v) { return s + v; }, 0); },
    act: function (x, y) {
      if (this.pend || this.res) return; var by = this.H - this.pb - 100, left = x < (this.W - 76) / 2 + 8; if (y < by || y > by + 80) return; this.acts++;
      if (left) { this.me.push(ri(1, 11)); if (this.sum(this.me) > 21) { this.fin(-1); } else if (this.sum(this.me) === 21) this.doStand(); }
      else this.doStand();
    },
    doStand: function () { this.stand = true; while (this.sum(this.dl) < 17) this.dl.push(ri(1, 11)); var m = this.sum(this.me), d = this.sum(this.dl); this.fin(d > 21 || m > d ? 1 : m < d ? -1 : 0); },
    fin: function (r) { this.res = r || 2; this.rr = r; this.pend = true; this.wait = 1.1; if (r > 0) { this.add(1); S.perfect(); } else if (r < 0) this.hurt(); },
    step: function (dt) { if (this.pend) { this.wait -= dt; if (this.wait <= 0 && this.state === "play") this.deal(); } },
    card: function (c, v, x, y, hid) { fillR(c, x, y, 64, 90, 10, hid ? "#333" : "#f2f2f2"); if (!hid) txt(c, String(v), x + 32, y + 46, 34, "#000"); },
    draw: function (now) {
      var c = this.ctx, i, uw = this.W - 76, by = this.H - this.pb - 100;
      txt(c, "Pasate de 21 y perdés", this.cx - 38, this.pt + 36, 17, "rgba(255,255,255,0.6)", "center", 600);
      txt(c, "Banca" + (this.stand ? " · " + this.sum(this.dl) : ""), 16, this.cy - 150, 16, "rgba(255,255,255,0.6)", "left", 600);
      for (i = 0; i < this.dl.length; i++) this.card(c, this.dl[i], 16 + i * 70, this.cy - 130);
      if (!this.stand) this.card(c, 0, 16 + this.dl.length * 70, this.cy - 130, true);
      txt(c, "Vos · " + this.sum(this.me), 16, this.cy - 10, 16, "rgba(255,255,255,0.6)", "left", 600);
      for (i = 0; i < this.me.length; i++) this.card(c, this.me[i], 16 + i * 62, this.cy + 10);
      fillR(c, 8, by, uw / 2 - 4, 80, 16, "#262626"); fillR(c, 8 + uw / 2 + 4, by, uw / 2 - 4, 80, 16, "#262626"); txt(c, "Pedir", 8 + uw / 4, by + 41, 24, "#fff"); txt(c, "Plantarse", 8 + uw * 0.75 + 4, by + 41, 24, "#fff");
      this.ghost(8 + uw / 4, by + 40, now);
    }
  });
  reg("x_21", "Veintiuna", "Sumá lo más cerca de 21 sin pasarte. Pedí cartas o plantate, y ganale a la banca.", GRN, Bj);
  var Dice = G("Dice", {
    init: function () { this.me = [1, 1]; this.cp = [1, 1]; this.roll = 0; this.res = 0; this.wait = 0; },
    act: function () { if (this.roll > 0 || this.wait > 0) return; this.roll = 0.6; this.acts++; },
    step: function (dt) {
      if (this.roll > 0) {
        this.roll -= dt; this.me = [ri(1, 7), ri(1, 7)]; this.cp = [ri(1, 7), ri(1, 7)];
        if (this.roll <= 0) { var a = this.me[0] + this.me[1], b = this.cp[0] + this.cp[1]; this.res = a > b ? 1 : a < b ? -1 : 0; this.wait = 1.0; if (this.res > 0) { this.add(1); S.perfect(); } else if (this.res < 0) this.hurt(); }
      } else if (this.wait > 0) { this.wait -= dt; if (this.wait <= 0) this.res = 0; }
    },
    die: function (c, v, x, y) {
      fillR(c, x, y, 70, 70, 12, "#f2f2f2"); c.fillStyle = "#000"; var P = { 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]] }[v];
      for (var i = 0; i < P.length; i++) { c.beginPath(); c.arc(x + 15 + P[i][0] * 20, y + 15 + P[i][1] * 20, 6, 0, TAU); c.fill(); }
    },
    draw: function (now) {
      var c = this.ctx, x = this.cx - 38 - 80;
      txt(c, "La máquina", this.cx - 38, this.cy - 150, 18, "rgba(255,255,255,0.6)", "center", 600); this.die(c, this.cp[0], x, this.cy - 130); this.die(c, this.cp[1], x + 90, this.cy - 130);
      txt(c, "Vos", this.cx - 38, this.cy + 10, 18, "rgba(255,255,255,0.6)", "center", 600); this.die(c, this.me[0], x, this.cy + 30); this.die(c, this.me[1], x + 90, this.cy + 30);
      txt(c, this.res > 0 ? "Ganaste" : this.res < 0 ? "Perdiste" : this.wait > 0 ? "Empate" : "Tocá para tirar", this.cx - 38, this.cy + 150, 24, "#fff", "center", 700);
      this.ghost(this.cx - 38, this.cy + 70, now);
    }
  });
  reg("x_dice", "Dados", "Tocá para tirar los dados. Gana la suma más alta.", PNK, Dice);

  /* --- Parejas --- */
  function mkPairs(o) {
    var C = G("Pairs_" + o.id, {
      init: function () {
        this.n = o.cols * o.rows; this.p = padLay(this, o.cols, o.rows); var syms = [], i; for (i = 0; i < this.n / 2; i++) { syms.push(i); syms.push(i); } this.sy = shuf(syms);
        this.open = []; this.done = {}; this.lock = 0; this.miss = 0; this.cnt = 0;
      },
      act: function (x, y) {
        if (this.lock > 0 || this.open.length >= 2) return; var i = padAt(this.p, x, y); if (i < 0 || this.done[i] || this.open.indexOf(i) >= 0) return; this.acts++; this.open.push(i); S.flip();
        if (this.open.length === 2) {
          var a = this.open[0], b = this.open[1];
          if (this.sy[a] === this.sy[b]) { this.done[a] = this.done[b] = 1; this.open = []; this.cnt++; this.add(1); S.hit(this.score); if (this.cnt === this.n / 2) this.lock = -1; }
          else { this.lock = 0.8; this.miss++; if (this.miss % 4 === 0) this.hurt(); }
        }
      },
      step: function (dt) {
        if (this.lock > 0) { this.lock -= dt; if (this.lock <= 0) { this.open = []; this.lock = 0; } }
        else if (this.lock === -1) { this.lock = 0.01; this.t3 = 0.7; }
        if (this.t3 > 0) { this.t3 -= dt; if (this.t3 <= 0) { this.t3 = 0; if (this.state === "play") this.init(); } }
      },
      draw: function (now) {
        var c = this.ctx, i; for (i = 0; i < this.n; i++) {
          var p = this.p[i], sh = this.open.indexOf(i) >= 0 || this.done[i]; fillR(c, p.x, p.y, p.s, p.s, 12, this.done[i] ? "#141414" : sh ? "#2a2a2a" : "#333");
          if (sh) { var v = this.sy[i]; if (o.kind === "num") txt(c, String(v + 1), p.x + p.s / 2, p.y + p.s / 2 + 1, p.s * 0.5, this.done[i] ? "#666" : "#fff"); else if (o.kind === "let") txt(c, "ABCDEFGHIJK"[v], p.x + p.s / 2, p.y + p.s / 2 + 1, p.s * 0.5, this.done[i] ? "#666" : "#fff"); else if (o.kind === "col") { c.fillStyle = this.done[i] ? "#444" : BCOL[v % 5]; c.beginPath(); c.arc(p.x + p.s / 2, p.y + p.s / 2, p.s * 0.28, 0, TAU); c.fill(); } else sh2(c, [0, 1, 2, 3, 6, 0, 1, 2][v], p.x + p.s / 2, p.y + p.s / 2, p.s * 0.27, this.done[i] ? "#555" : BCOL[(v + 1) % 5]); }
        }
        this.ghost(this.p[0].x + this.p[0].s / 2, this.p[0].y + this.p[0].s / 2, now);
      }
    });
    reg("y_" + o.id, o.name, o.how, o.acc, C);
  }
  [
    { id: "n", name: "Parejas de números", how: "Dá vuelta dos casillas. Si los números coinciden, se quedan.", cols: 3, rows: 4, kind: "num", acc: GRN },
    { id: "f", name: "Parejas de figuras", how: "Encontrá las figuras iguales. Cada cuatro errores perdés una vida.", cols: 4, rows: 4, kind: "sh", acc: PUR },
    { id: "c", name: "Parejas de colores", how: "Encontrá los colores iguales.", cols: 3, rows: 4, kind: "col", acc: ORA },
    { id: "l", name: "Parejas de letras", how: "Encontrá las letras iguales.", cols: 4, rows: 4, kind: "let", acc: PNK }
  ].forEach(mkPairs);
