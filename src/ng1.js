  /* ===== juegos clásicos ===== */
  function fillR(c, x, y, w, h, r, col) { c.fillStyle = col; rr(c, x, y, w, h, r); c.fill(); }
  function segDist(px, py, ax, ay, bx, by) {
    var dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy, t = l ? clamp(((px - ax) * dx + (py - ay) * dy) / l, 0, 1) : 0;
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }
  var BCOL = ["#ff4d6d", "#ffd23f", "#3ddc84", "#c77dff", "#ff9f1c"];

  /* Culebrita */
  var Snake = G("Snake", {
    ctl: "drag",
    init: function () { this.r = 9; this.len = 70; this.side = 0; this.restart(); this.place(); },
    restart: function () { this.hx = this.cx; this.hy = this.cy; this.ang = -PI / 2; this.tr = [{ x: this.hx, y: this.hy }]; },
    place: function () { this.food = { x: rnd(30, this.W - 80), y: rnd(this.pt + 30, this.H - this.pb - 40) }; },
    drag: function (x) { this.side = x < this.cx ? -1 : 1; },
    release: function () { this.side = 0; },
    step: function (dt) {
      var sp = 130 + Math.min(70, this.score * 2), i, tot = 0;
      this.ang += this.side * 3.0 * dt; this.hx += Math.cos(this.ang) * sp * dt; this.hy += Math.sin(this.ang) * sp * dt;
      this.tr.push({ x: this.hx, y: this.hy });
      for (i = this.tr.length - 1; i > 0; i--) { tot += Math.hypot(this.tr[i].x - this.tr[i - 1].x, this.tr[i].y - this.tr[i - 1].y); if (tot > this.len) { this.tr.splice(0, i - 1); break; } }
      if (Math.hypot(this.hx - this.food.x, this.hy - this.food.y) < this.r + 10) { this.add(1); S.hit(this.score); this.len += 24; this.place(); }
      if (this.invuln > 0) return;
      var dead = this.hx < this.r || this.hx > this.W - this.r || this.hy < this.pt || this.hy > this.H - this.pb;
      for (i = 0; i < this.tr.length - 16 && !dead; i += 2) if (Math.hypot(this.tr[i].x - this.hx, this.tr[i].y - this.hy) < this.r * 1.3) dead = true;
      if (dead) { this.hurt(); if (this.state !== "play") return; this.restart(); }
    },
    draw: function (now) {
      var c = this.ctx, i;
      c.fillStyle = RED; c.beginPath(); c.arc(this.food.x, this.food.y, 9, 0, TAU); c.fill();
      if (this.tr.length > 1) { c.strokeStyle = GRN; c.lineWidth = this.r * 2; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); c.moveTo(this.tr[0].x, this.tr[0].y); for (i = 1; i < this.tr.length; i++) c.lineTo(this.tr[i].x, this.tr[i].y); c.stroke(); c.lineCap = "butt"; }
      if (!this.blink()) { c.fillStyle = GRN; c.beginPath(); c.arc(this.hx, this.hy, this.r + 4, 0, TAU); c.fill(); face(c, this.hx, this.hy, this.r + 4, 0); }
      this.ghostHold(this.W * 0.22, this.H * 0.6, now);
    }
  });

  /* Ladrillos */
  var Brick = G("Brick", {
    ctl: "drag",
    init: function () { this.pw = 84; this.px = this.cx; this.tx = this.px; this.py = this.H - this.pb - 24; this.r = 8; this.sp = 340; this.stuck = true; this.bx = this.px; this.by = this.py - 16; this.vx = 0; this.vy = 0; this.build(); },
    build: function () {
      this.bricks = []; var cols = 7, bw = (this.W - 32) / cols, i, j;
      for (j = 0; j < 5; j++) for (i = 0; i < cols; i++) this.bricks.push({ x: 16 + i * bw, y: this.pt + 34 + j * 26, w: bw - 4, h: 20, c: BCOL[j] });
    },
    drag: function (x) { this.tx = clamp(x, this.pw / 2, this.W - this.pw / 2); },
    press: function () { if (this.stuck) { this.stuck = false; var a = rnd(-0.4, 0.4); this.vx = Math.sin(a) * this.sp; this.vy = -Math.cos(a) * this.sp; } },
    step: function (dt) {
      this.px += (this.tx - this.px) * Math.min(1, dt * 22);
      if (this.stuck) { this.bx = this.px; this.by = this.py - this.r - 8; return; }
      this.bx += this.vx * dt; this.by += this.vy * dt;
      if (this.bx < this.r) { this.bx = this.r; this.vx = Math.abs(this.vx); } if (this.bx > this.W - this.r) { this.bx = this.W - this.r; this.vx = -Math.abs(this.vx); }
      if (this.by < this.pt + 6) { this.by = this.pt + 6; this.vy = Math.abs(this.vy); }
      if (this.vy > 0 && this.by + this.r >= this.py && this.by + this.r <= this.py + 18 && Math.abs(this.bx - this.px) <= this.pw / 2 + this.r) {
        var a = clamp((this.bx - this.px) / (this.pw / 2), -1, 1) * 1.0; this.vx = Math.sin(a) * this.sp; this.vy = -Math.cos(a) * this.sp; this.by = this.py - this.r;
      }
      for (var i = 0; i < this.bricks.length; i++) {
        var b = this.bricks[i], nx = clamp(this.bx, b.x, b.x + b.w), ny = clamp(this.by, b.y, b.y + b.h);
        if (Math.hypot(this.bx - nx, this.by - ny) < this.r) {
          if (this.bx < b.x || this.bx > b.x + b.w) this.vx = -this.vx; else this.vy = -this.vy;
          this.bricks.splice(i, 1); this.add(1); S.hit(this.score); this.sp = Math.min(520, this.sp + 3);
          var s = Math.hypot(this.vx, this.vy) || 1; this.vx *= this.sp / s; this.vy *= this.sp / s; break;
        }
      }
      if (!this.bricks.length) { this.build(); this.stuck = true; }
      if (this.by > this.H - this.pb + 10) { this.hurt(); this.stuck = true; }
    },
    draw: function (now) {
      var c = this.ctx, i;
      for (i = 0; i < this.bricks.length; i++) { var b = this.bricks[i]; fillR(c, b.x, b.y, b.w, b.h, 4, b.c); }
      fillR(c, this.px - this.pw / 2, this.py, this.pw, 12, 6, "#fff");
      c.fillStyle = "#fff"; c.beginPath(); c.arc(this.bx, this.by, this.r, 0, TAU); c.fill();
      this.ghostDrag(this.py - 70, now);
    }
  });

  /* Frutas */
  var Slice = G("Slice", {
    ctl: "drag",
    init: function () { this.fr = []; this.hv = []; this.spawn = 0.6; this.trail = []; this.lx = null; this.ly = 0; },
    drag: function (x, y) {
      var px = this.lx, py = this.ly; this.lx = x; this.ly = y; this.trail.push({ x: x, y: y, t: 0 }); if (this.trail.length > 12) this.trail.shift();
      if (px === null) return;
      for (var i = 0; i < this.fr.length; i++) {
        var f = this.fr[i]; if (f.dead) continue;
        if (segDist(f.x, f.y, px, py, x, y) < f.r + 4) {
          f.dead = true;
          if (f.bomb) { this.hurt(); } else { this.add(1); S.hit(this.score); this.hv.push({ x: f.x, y: f.y, vx: -90, vy: -80, r: f.r, c: f.c, s: -1 }, { x: f.x, y: f.y, vx: 90, vy: -80, r: f.r, c: f.c, s: 1 }); }
        }
      }
    },
    release: function () { this.lx = null; },
    step: function (dt) {
      var i, f, g = 900;
      this.spawn -= dt;
      if (this.spawn <= 0) {
        this.spawn = Math.max(0.45, 1.0 - this.score * 0.01) + rnd(0, 0.4);
        var n = Math.random() < 0.3 ? 2 : 1;
        while (n--) {
          var h = (this.H - this.pb - this.pt) * rnd(0.55, 0.85), x = rnd(this.W * 0.2, this.W * 0.8);
          this.fr.push({ x: x, y: this.H - this.pb + 30, vx: (this.cx - x) * rnd(0.1, 0.4) + rnd(-30, 30), vy: -Math.sqrt(2 * g * h), r: rnd(22, 28), bomb: this.score >= 3 && Math.random() < 0.15, c: ["#ff9f1c", "#3ddc84", "#ff4d6d", "#ffd23f", "#c77dff"][ri(0, 5)], dead: false });
        }
      }
      for (i = this.fr.length - 1; i >= 0; i--) {
        f = this.fr[i]; f.vy += g * dt; f.x += f.vx * dt; f.y += f.vy * dt;
        if (f.vy > 0 && f.y > this.H - this.pb + 50) { if (!f.dead && !f.bomb) this.hurt(); this.fr.splice(i, 1); if (this.state !== "play") return; }
      }
      for (i = this.hv.length - 1; i >= 0; i--) { var q = this.hv[i]; q.vy += g * dt; q.x += q.vx * dt; q.y += q.vy * dt; if (q.y > this.H + 40) this.hv.splice(i, 1); }
      for (i = 0; i < this.trail.length; i++) this.trail[i].t += dt;
      while (this.trail.length && this.trail[0].t > 0.18) this.trail.shift();
    },
    after: function (dt) { this.step2 = 0; },
    draw: function (now) {
      var c = this.ctx, i, f;
      for (i = 0; i < this.hv.length; i++) { f = this.hv[i]; c.fillStyle = f.c; c.beginPath(); c.arc(f.x, f.y, f.r, f.s < 0 ? PI / 2 : -PI / 2, f.s < 0 ? PI * 1.5 : PI / 2); c.fill(); }
      for (i = 0; i < this.fr.length; i++) {
        f = this.fr[i]; if (f.dead) continue;
        c.fillStyle = f.bomb ? "#3a3a3a" : f.c; c.beginPath(); c.arc(f.x, f.y, f.r, 0, TAU); c.fill();
        if (f.bomb) { c.strokeStyle = "#ff4d6d"; c.lineWidth = 4; c.beginPath(); c.moveTo(f.x - 8, f.y - 8); c.lineTo(f.x + 8, f.y + 8); c.moveTo(f.x + 8, f.y - 8); c.lineTo(f.x - 8, f.y + 8); c.stroke(); }
      }
      if (this.trail.length > 1) {
        c.strokeStyle = "#fff"; c.lineWidth = 4; c.lineCap = "round"; c.beginPath(); c.moveTo(this.trail[0].x, this.trail[0].y);
        for (i = 1; i < this.trail.length; i++) c.lineTo(this.trail[i].x, this.trail[i].y); c.stroke(); c.lineCap = "butt";
      }
      this.ghostDrag(this.H * 0.55, now);
    }
  });

  /* Saltarín */
  var Jump = G("Jump", {
    ctl: "drag",
    init: function () {
      this.pw = 30; this.px = this.cx; this.tx = this.px; this.vy = -780; this.prog = 0; this.plats = [];
      var y = this.H - this.pb - 10; this.plats.push({ x: this.cx - 50, y: y, w: 100, m: 0, ph: 0, bx: this.cx - 50 }); this.top = y;
      this.py = y - 18; this.fill();
    },
    fill: function () { while (this.top > -60) { this.top -= rnd(62, 108); var w = 64, x = rnd(8, this.W - w - 8); this.plats.push({ x: x, y: this.top, w: w, m: (this.score > 8 && Math.random() < 0.25) ? rnd(30, 60) : 0, ph: rnd(0, 6), bx: x }); } },
    drag: function (x) { this.tx = clamp(x, 16, this.W - 16); },
    step: function (dt) {
      var i, p, prev = this.py;
      this.px += (this.tx - this.px) * Math.min(1, dt * 16);
      this.vy += 1800 * dt; this.py += this.vy * dt;
      for (i = 0; i < this.plats.length; i++) { p = this.plats[i]; if (p.m) { p.ph += dt * 1.6; p.x = clamp(p.bx + Math.sin(p.ph) * p.m, 4, this.W - p.w - 4); } }
      if (this.vy > 0) for (i = 0; i < this.plats.length; i++) {
        p = this.plats[i];
        if (prev + 16 <= p.y + 2 && this.py + 16 >= p.y && this.px + 10 > p.x && this.px - 10 < p.x + p.w) { this.vy = -780; this.py = p.y - 16; S.flip(); break; }
      }
      var lim = this.H * 0.42;
      if (this.py < lim) {
        var sh = lim - this.py; this.py = lim; this.top += sh; this.prog += sh;
        for (i = 0; i < this.plats.length; i++) this.plats[i].y += sh;
        while (this.prog >= 45) { this.prog -= 45; this.add(1); }
        this.plats = this.plats.filter(function (q, k, a) { return q.y < this.H + 30; }, this); this.fill();
      }
      if (this.py - 16 > this.H - this.pb + 30) {
        this.hurt(); if (this.state !== "play") return;
        var best = null; for (i = 0; i < this.plats.length; i++) { p = this.plats[i]; if (p.y < this.H * 0.75 && (!best || p.y > best.y)) best = p; }
        if (!best) { best = { x: this.cx - 50, y: this.H * 0.6, w: 100, m: 0, ph: 0, bx: this.cx - 50 }; this.plats.push(best); }
        this.px = best.x + best.w / 2; this.tx = this.px; this.py = best.y - 16; this.vy = -780;
      }
    },
    draw: function (now) {
      var c = this.ctx, i;
      for (i = 0; i < this.plats.length; i++) { var p = this.plats[i]; fillR(c, p.x, p.y, p.w, 10, 5, p.m ? "#ff9f1c" : "#3ddc84"); }
      if (!this.blink()) {
        fillR(c, this.px - 16, this.py - 18, 32, 36, 12, ORA); face(c, this.px, this.py - 2, 15, (this.tx - this.px) / 30);
      }
      this.ghostDrag(this.H * 0.7, now);
    }
  });

  /* Cruzá */
  var Cross = G("Cross", {
    ctl: "swipe",
    init: function () {
      this.cs = Math.floor(Math.min(this.W / 9, 52)); this.cols = Math.floor(this.W / this.cs); this.ox = Math.floor((this.W - this.cols * this.cs) / 2);
      this.lanes = []; this.row = 0; this.col = Math.floor(this.cols / 2); this.sx = this.col; this.sy = 0; this.maxRow = 0; this.cam = -2; this.clock = 0; this.fillL(40);
    },
    fillL: function (to) {
      while (this.lanes.length <= to) {
        var n = this.lanes.length, prev = this.lanes[n - 1], prev2 = this.lanes[n - 2], road = n >= 3 && Math.random() < 0.7 && !(prev && prev.road && prev2 && prev2.road);
        if (!road) { this.lanes.push({ road: false }); continue; }
        var k = ri(2, 4), span = this.cols + 5, cars = [], w = rnd(1.1, 1.9), i, o = rnd(0, span);
        for (i = 0; i < k; i++) cars.push((o + i * span / k + rnd(-0.4, 0.4)) % span);
        this.lanes.push({ road: true, dir: Math.random() < 0.5 ? 1 : -1, sp: rnd(1.3, 2.6) + Math.min(1.6, this.score * 0.04), cars: cars, w: w, span: span, col: BCOL[ri(0, 5)] });
      }
    },
    carX: function (l, i) { var v = (l.cars[i] + l.dir * l.sp * this.clock) % l.span; if (v < 0) v += l.span; return v - 2.5; },
    act: function (x) {
      var d = x < this.W / 3 ? -1 : x > this.W * 2 / 3 ? 1 : 0; this.acts++;
      if (d) this.col = clamp(this.col + d, 0, this.cols - 1);
      else { this.row++; if (this.row > this.maxRow) { this.maxRow = this.row; this.add(1); S.flip(); } this.fillL(this.row + 40); }
    },
    step: function (dt) {
      this.clock += dt; var k = Math.min(1, dt * 16); this.sx += (this.col - this.sx) * k; this.sy += (this.row - this.sy) * k; this.cam += (this.row - 2 - this.cam) * Math.min(1, dt * 6);
      var l = this.lanes[this.row];
      if (l.road && this.invuln <= 0) for (var i = 0; i < l.cars.length; i++) {
        var cx0 = this.carX(l, i);
        if (cx0 < this.col + 0.85 && cx0 + l.w > this.col + 0.15) {
          this.hurt(); if (this.state !== "play") return;
          var r = this.row; while (this.lanes[r].road) r--; this.row = r; this.col = Math.floor(this.cols / 2); this.sx = this.col; this.sy = this.row; break;
        }
      }
    },
    draw: function (now) {
      var c = this.ctx, cs = this.cs, r, i, r0 = Math.floor(this.cam) - 1, r1 = Math.ceil(this.cam + (this.H - this.pb) / cs) + 1, base = this.H - this.pb;
      for (r = r0; r <= r1; r++) {
        if (r < 0 || !this.lanes[r]) continue; var l = this.lanes[r], y = base - (r - this.cam + 1) * cs;
        c.fillStyle = l.road ? "#262626" : "#24402a"; c.fillRect(0, y, this.W, cs);
        if (l.road) for (i = 0; i < l.cars.length; i++) fillR(c, this.ox + this.carX(l, i) * cs, y + 6, l.w * cs, cs - 12, 5, l.col);
      }
      var py = base - (this.sy - this.cam + 1) * cs; if (!this.blink()) { fillR(c, this.ox + this.sx * cs + 6, py + 6, cs - 12, cs - 12, 10, YEL); face(c, this.ox + (this.sx + 0.5) * cs, py + cs / 2 + 2, (cs - 12) / 2, 0); }
      this.ghost(this.cx, this.H * 0.55, now);
    }
  });

  /* Catapulta */
  var Cata = G("Cata", {
    ctl: "hold",
    init: function () { this.gy = this.H - this.pb - 20; this.lx = 44; this.ly = this.gy - 24; this.p = 0; this.pd = 1; this.sh = null; this.newT(); },
    newT: function () { this.tx = this.lx + rnd(200, Math.min(330, this.W - 120 - this.lx)); },
    press: function () { if (!this.sh) { this.p = 0; this.pd = 1; } },
    release: function (x, y, cancel) {
      if (cancel || this.sh) return; var v = 300 + this.p * 300;
      this.sh = { x: this.lx, y: this.ly, vx: Math.cos(0.8) * v, vy: -Math.sin(0.8) * v }; this.p = 0; this.acts++; sfx(300, 0.15, "sine", 0.05, 1.6);
    },
    step: function (dt) {
      if (this.holding && !this.sh) { this.p += this.pd * dt * 0.7; if (this.p >= 1) { this.p = 1; this.pd = -1; } if (this.p <= 0) { this.p = 0; this.pd = 1; } }
      var s = this.sh; if (!s) return;
      s.vy += 900 * dt; s.x += s.vx * dt; s.y += s.vy * dt;
      if (s.y >= this.gy) {
        if (Math.abs(s.x - this.tx) <= 36) { this.good(1, this.tx, this.gy - 30, false); this.newT(); } else { this.lastMiss = s.x; this.hurt(); }
        this.sh = null;
      }
    },
    draw: function (now) {
      var c = this.ctx;
      c.fillStyle = "#262626"; c.fillRect(0, this.gy, this.W, this.H - this.gy);
      c.fillStyle = "#ff4d6d"; c.beginPath(); c.arc(this.tx, this.gy - 14, 14, 0, TAU); c.fill();
      c.fillStyle = "#fff"; c.beginPath(); c.arc(this.tx, this.gy - 14, 6, 0, TAU); c.fill();
      c.strokeStyle = "#fff"; c.lineWidth = 8; c.lineCap = "round"; c.beginPath(); c.moveTo(this.lx - 10, this.ly + 10); c.lineTo(this.lx + 14, this.ly - 8); c.stroke(); c.lineCap = "butt";
      fillR(c, this.lx - 20, this.gy - 12, 40, 12, 3, "#8a8a8a");
      fillR(c, this.lx - 30, this.gy + 14, 60, 8, 4, "rgba(255,255,255,0.15)"); fillR(c, this.lx - 30, this.gy + 14, 60 * this.p, 8, 4, "#ffd23f");
      if (this.sh) { c.fillStyle = "#fff"; c.beginPath(); c.arc(this.sh.x, this.sh.y, 8, 0, TAU); c.fill(); }
      this.ghostHold(this.lx + 120, this.ly - 60, now);
    }
  });
