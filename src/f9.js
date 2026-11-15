
  /* ===== Tanda 30 mecánicas nuevas (1/2): cada juego es una mecánica distinta, sin versiones ===== */
  function segHit(b, r, x1, y1, x2, y2, e, ix, iy) {
    var dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1, t = clamp(((b.x - x1) * dx + (b.y - y1) * dy) / L2, 0, 1), px = x1 + dx * t, py = y1 + dy * t, ddx = b.x - px, ddy = b.y - py, d = Math.hypot(ddx, ddy);
    if (d >= r || d === 0) return false; var nx = ddx / d, ny = ddy / d; b.x = px + nx * r; b.y = py + ny * r; var vn = b.vx * nx + b.vy * ny;
    if (vn < 0) { b.vx -= (1 + e) * vn * nx; b.vy -= (1 + e) * vn * ny; } if (ix || iy) { b.vx += ix || 0; b.vy += iy || 0; } return true;
  }
  function capS(b, m) { var s = Math.hypot(b.vx, b.vy); if (s > m) { b.vx *= m / s; b.vy *= m / s; } }

  /* 1. Pinball: tocá a la izquierda o a la derecha para mover cada paleta */
  regD("pinb", "Pinball", "Tocá a la izquierda o a la derecha para mover cada paleta. Pegale a los hongos.", "#ff5fd2", G("Pinb", {
    init: function () { this.fy = this.H - this.pb - 70; this.L = Math.min(84, this.W * 0.22); this.fl = [0, 0]; this.bm = [{ x: this.W * 0.3, y: this.pt + 150, c: 0 }, { x: this.W * 0.7, y: this.pt + 150, c: 0 }, { x: this.W * 0.5, y: this.pt + 240, c: 0 }]; this.serve(); },
    serve: function () { this.b = { x: this.W * 0.5 + rnd(-40, 40), y: this.pt + 60, vx: rnd(-90, 90), vy: 0 }; },
    act: function (x) { this.fl[x < this.W / 2 ? 0 : 1] = 0.16; this.acts++; sfx(300, 0.05, "square", 0.04, 1.4); },
    piv: function (k) { return { x: k ? this.W * 0.73 : this.W * 0.27, y: this.fy }; },
    ang: function (k) { var up = this.fl[k] > 0, a = up ? -0.42 : 0.45; return k ? PI - a : a; },
    step: function (dt) {
      var b = this.b, k, i, sub = 3; this.fl[0] = Math.max(0, this.fl[0] - dt); this.fl[1] = Math.max(0, this.fl[1] - dt);
      for (var s = 0; s < sub; s++) {
        var h = dt / sub; b.vy += 900 * h; b.x += b.vx * h; b.y += b.vy * h; var r = 11;
        if (b.x < r) { b.x = r; b.vx = Math.abs(b.vx) * 0.8; } if (b.x > this.W - r) { b.x = this.W - r; b.vx = -Math.abs(b.vx) * 0.8; } if (b.y < this.pt + r) { b.y = this.pt + r; b.vy = Math.abs(b.vy) * 0.8; }
        segHit(b, r, 0, this.fy - 110, this.piv(0).x - 4, this.fy, 0.3); segHit(b, r, this.W, this.fy - 110, this.piv(1).x + 4, this.fy, 0.3);
        for (k = 0; k < 2; k++) { var p = this.piv(k), a = this.ang(k), ex = p.x + Math.cos(a) * this.L, ey = p.y + Math.sin(a) * this.L, up = this.fl[k] > 0.08; if (segHit(b, r + 6, p.x, p.y, ex, ey, 0.25) && up) { b.vy -= 620; b.vx += (k ? -1 : 1) * -120 + (b.x - p.x) * (k ? -1 : 1) * 1.2; } }
        for (i = 0; i < this.bm.length; i++) { var m = this.bm[i], dx = b.x - m.x, dy = b.y - m.y, d = Math.hypot(dx, dy); if (d < 30 + r && d > 0) { var nx = dx / d, ny = dy / d; b.x = m.x + nx * (30 + r); b.y = m.y + ny * (30 + r); var vn = b.vx * nx + b.vy * ny; b.vx -= 2 * vn * nx; b.vy -= 2 * vn * ny; b.vx += nx * 220; b.vy += ny * 220; if (m.c <= 0) { this.add(1); m.c = 0.25; sfx(700, 0.06, "triangle", 0.05); } } }
        capS(b, 1100);
      }
      for (i = 0; i < this.bm.length; i++) this.bm[i].c -= dt;
      if (b.y > this.H - this.pb + 10) { this.hurt(); this.serve(); }
    },
    draw: function (now) {
      var c = this.ctx, k, i;
      c.strokeStyle = "#55555f"; c.lineWidth = 8; c.lineCap = "round"; c.beginPath(); c.moveTo(0, this.fy - 110); c.lineTo(this.piv(0).x - 4, this.fy); c.moveTo(this.W, this.fy - 110); c.lineTo(this.piv(1).x + 4, this.fy); c.stroke();
      for (i = 0; i < this.bm.length; i++) { var m = this.bm[i]; dot(c, m.x, m.y, 30, m.c > 0 ? "#ffd23f" : "#ff5fd2"); dot(c, m.x, m.y, 18, m.c > 0 ? "#fff3b0" : "#c13a9f"); dot(c, m.x, m.y, 7, "#fff"); }
      for (k = 0; k < 2; k++) { var p = this.piv(k), a = this.ang(k); c.strokeStyle = "#ff4d6d"; c.lineWidth = 14; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x + Math.cos(a) * this.L, p.y + Math.sin(a) * this.L); c.stroke(); dot(c, p.x, p.y, 6, "#fff"); }
      c.lineCap = "butt"; dot(c, this.b.x, this.b.y, 11, "#d9dde3"); dot(c, this.b.x - 3, this.b.y - 3, 3, "#fff");
      this.ghost(this.W * 0.25, this.fy + 30, now);
    }
  }), "arcade");

  /* 2. Tobogán: mantené para bajar las lomas con fuerza, soltá para volar */
  regD("sled", "Tobogán", "Mantené apretado para tirarte en las bajadas y soltá en las subidas para volar. Caé justo en una bajada.", "#3ddc84", G("Sled", {
    ctl: "hold",
    init: function () { this.wx = 0; this.vx = 260; this.y = 0; this.vy = 0; this.air = false; this.px = this.W * 0.3; this.tm = 14; this.dist = 0; this.base = this.H - this.pb - 160; },
    gy: function (x) { return this.base + Math.sin(x * 0.006) * 70 + Math.sin(x * 0.0023 + 1) * 45; },
    sl: function (x) { return (this.gy(x + 2) - this.gy(x - 2)) / 4; },
    step: function (dt) {
      var x = this.wx + this.px, g = this.gy(x), s = this.sl(x);
      if (!this.air) {
        this.y = g; this.vx += (s * (this.holding ? 1100 : 420) - 30) * dt; this.vx = clamp(this.vx, 140, 820); this.vy = this.vx * s;
        if (!this.holding && s < -0.12 && this.vx > 330) { this.air = true; this.vy = this.vx * s * 1.1; }
      } else {
        this.vy += (this.holding ? 2200 : 900) * dt; this.y += this.vy * dt;
        if (this.y >= g) { this.y = g; this.air = false; var want = this.vx * s; if (s > 0.05 && Math.abs(this.vy - want) < 260) { this.vx *= 1.12; this.tm = Math.min(16, this.tm + 2); this.good(2, this.px, g, true); } else { this.vx *= 0.65; } }
      }
      this.wx += this.vx * dt; this.dist += this.vx * dt; if (this.dist > 400) { this.dist -= 400; this.add(1); this.tm = Math.min(16, this.tm + 0.4); }
      this.tm -= dt; if (this.tm <= 0) { this.tm = 10; this.hurt(); }
    },
    draw: function (now) {
      var c = this.ctx, x, W = this.W;
      c.fillStyle = "#2f8f4e"; c.beginPath(); c.moveTo(0, this.H); for (x = 0; x <= W; x += 8) c.lineTo(x, this.gy(this.wx + x)); c.lineTo(W, this.H); c.closePath(); c.fill();
      c.strokeStyle = "#f2f2f2"; c.lineWidth = 6; c.beginPath(); for (x = 0; x <= W; x += 8) c.lineTo(x, this.gy(this.wx + x) - 3); c.stroke();
      var a = Math.atan2(this.air ? this.vy : this.vx * this.sl(this.wx + this.px), this.vx);
      c.save(); c.translate(this.px, this.y - 14); c.rotate(a); fillR(c, -18, 8, 36, 7, 3, "#ff4d6d"); c.restore();
      c.globalAlpha = this.fadeA(); buddy(c, this.px, this.y - 20, 13, "#ffd23f", 1); c.globalAlpha = 1;
      fillR(c, 16, this.pt + 8, W - 92, 8, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 8, (W - 92) * clamp(this.tm / 16, 0, 1), 8, 4, this.tm < 4 ? "#ff4d6d" : "#ffd23f");
      this.ghostHold(W * 0.65, this.cy - 60, now);
    }
  }), "snow");

  /* 3. Paracaidista: arrastrá para guiarlo y caer arriba del bote */
  regD("chute", "Paracaidista", "Arrastrá a los costados para guiarlo. Esquivá los pájaros y caé arriba del bote.", "#ff9f1c", G("Chute", {
    ctl: "drag",
    init: function () { this.tx = this.W / 2; this.jump(); this.birds = []; this.nb = 1; this.boat = { x: this.W / 2, v: 50 }; },
    jump: function () { this.x = rnd(60, this.W - 60); this.y = this.pt + 20; this.wind = rnd(-40, 40); this.st = []; for (var k = 0; k < 3; k++) this.st.push({ x: rnd(40, this.W - 40), y: this.pt + 120 + k * 120 }); },
    drag: function (x) { this.tx = x; },
    step: function (dt) {
      var i, sp = 85 + Math.min(this.t, 60) * 0.8; this.wind += rnd(-30, 30) * dt;
      this.x += (this.tx - this.x) * Math.min(1, dt * 3) + this.wind * dt; this.x = clamp(this.x, 20, this.W - 20); this.y += sp * dt;
      this.boat.x += this.boat.v * dt; if (this.boat.x < 60 || this.boat.x > this.W - 60) this.boat.v = -this.boat.v;
      this.nb -= dt; if (this.nb <= 0) { var L = Math.random() < 0.5; this.birds.push({ x: L ? -20 : this.W + 20, y: rnd(this.pt + 100, this.H - this.pb - 140), v: (L ? 1 : -1) * rnd(70, 140) }); this.nb = rnd(1.2, 2.2) * Math.max(0.5, 1 - this.t * 0.01); }
      for (i = 0; i < this.birds.length; i++) { var b = this.birds[i]; b.x += b.v * dt; if (!b.hit && Math.hypot(b.x - this.x, b.y - this.y) < 26) { b.hit = true; this.hurt(); } }
      var W = this.W; this.birds = this.birds.filter(function (q) { return q.x > -40 && q.x < W + 40; });
      for (i = 0; i < this.st.length; i++) { var s = this.st[i]; if (!s.got && Math.hypot(s.x - this.x, s.y - this.y) < 24) { s.got = true; this.add(1); } }
      var by = this.H - this.pb - 40;
      if (this.y >= by - 10) { var d = Math.abs(this.x - this.boat.x); if (d < 46) this.good(d < 14 ? 3 : 2, this.x, by, d < 14); else this.hurt(); this.jump(); }
    },
    draw: function (now) {
      var c = this.ctx, i, by = this.H - this.pb - 40;
      c.fillStyle = "#1f7fa8"; c.fillRect(0, by + 8, this.W, this.H); fillR(c, this.boat.x - 46, by - 4, 92, 18, 8, "#f2f2f2"); c.fillStyle = "#ff4d6d"; c.fillRect(this.boat.x - 46, by + 6, 92, 6); dot(c, this.boat.x, by - 4, 8, "#ffd23f");
      for (i = 0; i < this.st.length; i++) if (!this.st[i].got) starG(c, this.st[i].x, this.st[i].y);
      for (i = 0; i < this.birds.length; i++) { var b = this.birds[i]; dot(c, b.x, b.y, 10, "#2b2b33"); poly(c, [b.x - 4, b.y - 2, b.x - 16, b.y - 12 + Math.sin(now / 80) * 6, b.x + 2, b.y - 4], "#2b2b33"); dot(c, b.x + (b.v > 0 ? 7 : -7), b.y - 2, 2, "#fff"); }
      c.globalAlpha = this.fadeA(); c.fillStyle = "#ff9f1c"; c.beginPath(); c.arc(this.x, this.y - 40, 30, PI, 0); c.closePath(); c.fill(); c.strokeStyle = "#f2efe6"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(this.x - 28, this.y - 40); c.lineTo(this.x - 6, this.y - 8); c.moveTo(this.x + 28, this.y - 40); c.lineTo(this.x + 6, this.y - 8); c.stroke(); buddy(c, this.x, this.y, 11, "#f2b48a"); c.globalAlpha = 1;
      this.ghostDrag(this.H - this.pb - 120, now);
    }
  }), "sky");

  /* 4. Saltar la soga: tocá para saltar cuando pasa la soga */
  regD("rope", "Saltar la soga", "Tocá para saltar justo cuando la soga pasa por abajo. Cada vez gira más rápido.", "#ff4d6d", G("Rope", {
    init: function () { this.gy = this.H - this.pb - 90; this.h = 0; this.vy = 0; this.ph = PI; this.w = 3.6; },
    act: function () { if (this.h <= 0) { this.vy = 470; this.acts++; sfx(520, 0.06, "triangle", 0.05, 1.4); } },
    step: function (dt) {
      if (this.h > 0 || this.vy > 0) { this.h += this.vy * dt; this.vy -= 1500 * dt; if (this.h < 0) { this.h = 0; this.vy = 0; } }
      var w = this.w * (1 + Math.min(this.t, 60) * 0.012), p0 = this.ph; this.ph += w * dt;
      if (Math.floor(p0 / TAU) !== Math.floor(this.ph / TAU)) { if (this.h > 10) this.add(1); else this.hurt(); }
    },
    draw: function (now) {
      var c = this.ctx, cx = this.W / 2, ay = this.gy - 70, low = ay + 70 * Math.cos(this.ph) + 0;
      fillR(c, 0, this.gy, this.W, 10, 0, "#8a6a3a");
      var cy2 = ay + 140 * Math.cos(this.ph); c.strokeStyle = Math.sin(this.ph) > 0 ? "rgba(255,255,255,0.45)" : "#ffd23f"; c.lineWidth = 5;
      buddy(c, 40, this.gy - 40, 14, "#c77dff"); buddy(c, this.W - 40, this.gy - 40, 14, "#3ddc84");
      if (Math.sin(this.ph) > 0) { c.beginPath(); c.moveTo(52, ay); c.quadraticCurveTo(cx, cy2, this.W - 52, ay); c.stroke(); }
      c.globalAlpha = this.fadeA(); c.fillStyle = "#2b2b33"; c.fillRect(cx - 8, this.gy - this.h - 26, 5, 24); c.fillRect(cx + 3, this.gy - this.h - 26, 5, 24); buddy(c, cx, this.gy - this.h - 40, 15, "#ff9f1c"); c.globalAlpha = 1;
      if (Math.sin(this.ph) <= 0) { c.strokeStyle = "#ffd23f"; c.beginPath(); c.moveTo(52, ay); c.quadraticCurveTo(cx, cy2, this.W - 52, ay); c.stroke(); }
      this.ghost(cx + 60, this.gy - 120, now);
    }
  }), "school");

  /* 5. Grúa: arrastrá la garra, soltá para bajar y agarrar un premio */
  regD("claw", "Grúa de peluches", "Arrastrá para mover la garra y soltá para bajarla. Agarrá un peluche.", "#c77dff", G("Claw", {
    ctl: "drag",
    init: function () { this.cx2 = this.W / 2; this.cy0 = this.pt + 40; this.cy2 = this.cy0; this.ph = "aim"; this.got = null; this.floor = this.H - this.pb - 60; this.toys = []; for (var k = 0; k < 6; k++) this.addToy(); },
    addToy: function () { this.toys.push({ x: rnd(110, this.W - 30), r: rnd(16, 24), col: pickOf(["#ff4d6d", "#ffd23f", "#3ddc84", "#ff9f1c", "#ff5fd2", "#f2f2f2"]), v: 0 }); },
    drag: function (x) { if (this.ph === "aim") this.cx2 = clamp(x, 100, this.W - 24); },
    release: function () { if (this.ph === "aim" && this.holding !== undefined) { this.ph = "down"; this.acts++; sfx(240, 0.12, "sine", 0.05, 0.7); } },
    step: function (dt) {
      var i, sp = Math.min(30, this.t * 0.6); for (i = 0; i < this.toys.length; i++) { var t = this.toys[i]; if (t === this.got) continue; t.x -= sp * dt; if (t.x < 110) t.x = this.W - 30; }
      if (this.ph === "down") { this.cy2 += 320 * dt; var best = null; for (i = 0; i < this.toys.length; i++) { var q = this.toys[i]; if (Math.abs(q.x - this.cx2) < q.r * 0.8 && this.cy2 + 16 >= this.floor - q.r * 2) best = q; } if (best) { this.got = best; this.ph = "up"; } else if (this.cy2 >= this.floor - 20) { this.ph = "up"; this.got = null; } }
      else if (this.ph === "up") { this.cy2 -= 300 * dt; if (this.got) { this.got.x = this.cx2; } if (this.cy2 <= this.cy0) { this.cy2 = this.cy0; if (this.got) this.ph = "carry"; else { this.hurt(); this.ph = "aim"; } } }
      else if (this.ph === "carry") { this.cx2 -= 260 * dt; this.got.x = this.cx2; if (this.cx2 <= 50) { this.toys.splice(this.toys.indexOf(this.got), 1); this.good(this.got.r < 19 ? 2 : 1, 50, this.floor, this.got.r < 19); this.got = null; this.addToy(); this.ph = "aim"; this.cx2 = this.W / 2; } }
    },
    draw: function (now) {
      var c = this.ctx, i, x = this.cx2, y = this.cy2;
      fillR(c, 8, this.pt + 20, this.W - 16, 8, 3, "#55555f"); fillR(c, 14, this.floor - 10, 72, this.H, 6, "#3a3a44"); c.fillStyle = "#17121f"; c.fillRect(24, this.floor - 4, 52, 20);
      for (i = 0; i < this.toys.length; i++) { var t = this.toys[i], ty = t === this.got ? y + 26 + t.r : this.floor - t.r; dot(c, t.x - t.r * 0.6, ty - t.r * 0.8, t.r * 0.35, t.col); dot(c, t.x + t.r * 0.6, ty - t.r * 0.8, t.r * 0.35, t.col); buddy(c, t.x, ty, t.r, t.col); }
      c.fillStyle = "#9aa1ab"; c.fillRect(x - 2, this.pt + 28, 4, y - this.pt - 28); fillR(c, x - 16, y - 8, 32, 14, 5, "#d9dde3");
      var op = this.ph === "down" ? 1 : 0.4; c.strokeStyle = "#d9dde3"; c.lineWidth = 5; c.lineCap = "round"; c.beginPath(); c.moveTo(x - 10, y + 6); c.lineTo(x - 10 - 10 * op, y + 26); c.moveTo(x + 10, y + 6); c.lineTo(x + 10 + 10 * op, y + 26); c.stroke(); c.lineCap = "butt";
      this.ghostDrag(this.cy, now);
    }
  }), "arcade");

  /* 6. Leñador: tocá a un lado del tronco para hachar sin que te pegue una rama */
  regD("lumber", "Leñador", "Tocá a la izquierda o a la derecha para hachar. Que no te caiga una rama encima. Hachá rápido.", "#c98a4a", G("Lumber", {
    init: function () { this.side = -1; this.seg = []; for (var k = 0; k < 9; k++) this.push(k < 2); this.tm = 6; this.hit = 0; },
    push: function (safe) { var last = this.seg.length ? this.seg[this.seg.length - 1].br : 0, br = 0; if (!safe && last === 0 && Math.random() < 0.6) br = Math.random() < 0.5 ? -1 : 1; this.seg.push({ br: br }); },
    act: function (x) {
      var s = x < this.W / 2 ? -1 : 1; this.side = s; this.acts++; this.hit = 0.1;
      if (this.seg[0].br === s) { this.hurt(); this.seg[0].br = 0; return; }
      this.seg.shift(); this.push(false); this.add(1); this.tm = Math.min(6, this.tm + 0.35); sfx(180, 0.06, "square", 0.05, 0.6);
      if (this.seg[0].br === s) { this.hurt(); this.seg[0].br = 0; }
    },
    step: function (dt) { this.hit = Math.max(0, this.hit - dt); this.tm -= dt * (1 + Math.min(this.t, 90) * 0.02); if (this.tm <= 0) { this.tm = 6; this.hurt(); } },
    draw: function (now) {
      var c = this.ctx, cx = this.W / 2, base = this.H - this.pb - 70, sh = 64, k;
      fillR(c, 0, base, this.W, 12, 0, "#6b4423");
      for (k = 0; k < this.seg.length; k++) { var y = base - (k + 1) * sh; fillR(c, cx - 28, y, 56, sh - 2, 4, k % 2 ? "#a86a35" : "#b5793f"); var b = this.seg[k].br; if (b) { fillR(c, b < 0 ? cx - 110 : cx + 28, y + 20, 82, 16, 6, "#8a5a2b"); dot(c, b < 0 ? cx - 112 : cx + 112, y + 26, 14, "#3ddc84"); } }
      var px = cx + this.side * 70; c.globalAlpha = this.fadeA(); buddy(c, px, base - 26, 18, "#ff4d6d", -this.side); c.save(); c.translate(px - this.side * 18, base - 30); c.rotate(this.side * (this.hit > 0 ? -1.2 : -0.3)); c.fillStyle = "#6b4423"; c.fillRect(-3, -34, 6, 34); fillR(c, -this.side * 4 - 10, -40, 20, 12, 3, "#d9dde3"); c.restore(); c.globalAlpha = 1;
      fillR(c, cx - 80, this.pt + 10, 160, 10, 5, "rgba(255,255,255,0.15)"); fillR(c, cx - 80, this.pt + 10, 160 * clamp(this.tm / 6, 0, 1), 10, 5, this.tm < 2 ? "#ff4d6d" : "#3ddc84");
      this.ghost(cx + 90, base - 40, now);
    }
  }), "forest");

  /* 7. Pájaro entre pinchos: tocá para aletear y rebotar entre las paredes */
  regD("spikeb", "Pájaro entre pinchos", "Tocá para aletear. El pájaro rebota de pared en pared: no toques los pinchos.", "#ffd23f", G("Spikeb", {
    init: function () { this.x = this.W / 2; this.y = this.cy; this.vx = 150; this.vy = 0; this.wait = true; this.sp = []; this.mk(1); this.cand = null; },
    mk: function (side) { var n = Math.min(6, 2 + Math.floor(this.score / 4)), top = this.pt + 50, bot = this.H - this.pb - 50, sl = Math.floor((bot - top) / 46), used = {}; this.sp = []; this.spSide = side; for (var k = 0; k < n; k++) { var i = ri(0, sl); if (used[i]) continue; used[i] = 1; this.sp.push(top + i * 46); } if (!this.cand && Math.random() < 0.5) this.cand = { x: rnd(80, this.W - 80), y: rnd(top + 30, bot - 30) }; },
    act: function () { this.wait = false; this.vy = -360; this.acts++; sfx(640, 0.05, "triangle", 0.04, 1.3); },
    step: function (dt) {
      if (this.wait) return; var r = 15, top = this.pt + 26, bot = this.H - this.pb - 26;
      this.vy += 1000 * dt; this.x += this.vx * dt; this.y += this.vy * dt;
      var wall = this.vx > 0 ? this.W - 22 - r : 22 + r;
      if ((this.vx > 0 && this.x >= wall) || (this.vx < 0 && this.x <= wall)) { this.x = wall; var hit = false; for (var k = 0; k < this.sp.length; k++) if (this.y > this.sp[k] - 6 && this.y < this.sp[k] + 46) hit = true; this.vx = -this.vx * (1 + 0.004); if (hit) this.hurt(); else this.add(1); this.mk(this.vx > 0 ? 1 : -1); }
      if (this.y < top || this.y > bot) { this.hurt(); this.y = this.cy; this.vy = 0; this.wait = true; }
      if (this.cand && Math.hypot(this.cand.x - this.x, this.cand.y - this.y) < 26) { this.good(2, this.x, this.y); this.cand = null; }
    },
    draw: function (now) {
      var c = this.ctx, k, W = this.W, top = this.pt + 20, bot = this.H - this.pb - 20, x;
      c.fillStyle = "#3a3a44"; c.fillRect(0, 0, 22, this.H); c.fillRect(W - 22, 0, 22, this.H);
      for (x = 0; x < W; x += 24) { poly(c, [x, top, x + 12, top + 18, x + 24, top], "#d9dde3"); poly(c, [x, bot, x + 12, bot - 18, x + 24, bot], "#d9dde3"); }
      for (k = 0; k < this.sp.length; k++) { var y = this.sp[k]; if (this.spSide > 0) poly(c, [W - 22, y, W - 50, y + 20, W - 22, y + 40], "#ff4d6d"); else poly(c, [22, y, 50, y + 20, 22, y + 40], "#ff4d6d"); }
      if (this.cand) { dot(c, this.cand.x, this.cand.y, 11, "#ff5fd2"); dot(c, this.cand.x, this.cand.y, 4, "#fff"); }
      c.globalAlpha = this.fadeA(); buddy(c, this.x, this.y, 15, "#ffd23f", this.vx > 0 ? 1 : -1); poly(c, [this.x + (this.vx > 0 ? 14 : -14), this.y, this.x + (this.vx > 0 ? 24 : -24), this.y + 4, this.x + (this.vx > 0 ? 14 : -14), this.y + 7], "#ff9f1c"); c.globalAlpha = 1;
      this.ghost(W / 2, this.cy + 60, now);
    }
  }), "cave");

  /* 8. Dúo: mantené a la izquierda o a la derecha para girar las dos bolitas */
  regD("duo", "Dúo", "Mantené apretado a la izquierda o a la derecha para girar las dos bolitas. Esquivá los bloques.", "#ff5fd2", G("Duo", {
    ctl: "drag",
    init: function () { this.a = 0; this.lx = this.W / 2; this.R = 64; this.ox = this.W / 2; this.oy = this.H - this.pb - 150; this.bl = []; this.next = 0.8; },
    drag: function (x) { this.lx = x; },
    step: function (dt) {
      if (this.holding) this.a += (this.lx < this.W / 2 ? -1 : 1) * 4.2 * dt;
      var v = 210 * (1 + Math.min(this.t, 60) * 0.012), i, k; this.next -= dt;
      if (this.next <= 0) { var w = rnd(60, 150), side = ri(0, 3); var x = side === 0 ? this.ox - this.R - 10 : side === 1 ? this.ox + 10 : this.ox - w / 2; if (side === 0) x = this.ox - w + 6; this.bl.push({ x: x, y: this.pt - 30, w: w, h: 24 }); this.next = rnd(0.7, 1.1) * Math.max(0.55, 1 - this.t * 0.006); }
      var p = [[this.ox + Math.cos(this.a) * this.R, this.oy + Math.sin(this.a) * this.R], [this.ox - Math.cos(this.a) * this.R, this.oy - Math.sin(this.a) * this.R]];
      for (i = 0; i < this.bl.length; i++) { var b = this.bl[i]; b.y += v * dt; if (b.dead) continue; for (k = 0; k < 2; k++) if (p[k][0] > b.x - 12 && p[k][0] < b.x + b.w + 12 && p[k][1] > b.y - 12 && p[k][1] < b.y + b.h + 12) { b.dead = true; this.hurt(); break; } if (!b.dead && !b.cnt && b.y > this.oy + this.R + 20) { b.cnt = true; this.add(1); } }
      var H = this.H; this.bl = this.bl.filter(function (q) { return q.y < H + 40 && !q.dead; });
    },
    draw: function (now) {
      var c = this.ctx, i; c.strokeStyle = "rgba(255,255,255,0.18)"; c.lineWidth = 3; c.beginPath(); c.arc(this.ox, this.oy, this.R, 0, TAU); c.stroke();
      for (i = 0; i < this.bl.length; i++) fillR(c, this.bl[i].x, this.bl[i].y, this.bl[i].w, this.bl[i].h, 6, "#f2f2f2");
      c.globalAlpha = this.fadeA(); dot(c, this.ox + Math.cos(this.a) * this.R, this.oy + Math.sin(this.a) * this.R, 13, "#ff4d6d"); dot(c, this.ox - Math.cos(this.a) * this.R, this.oy - Math.sin(this.a) * this.R, 13, "#3ddc84"); c.globalAlpha = 1;
      this.ghostHold(this.W * 0.25, this.oy + 90, now);
    }
  }), "space");

  /* 9. Salto entre planetas: tocá para salir disparado hacia el planeta de arriba */
  regD("planet", "Salto entre planetas", "Girás alrededor de un planeta. Tocá para salir disparado y caer en el siguiente.", "#c77dff", G("Planet", {
    init: function () { this.pl = []; this.cam = 0; var y = this.H - this.pb - 120; for (var k = 0; k < 6; k++) { this.addP(y); y -= rnd(170, 220); } this.on = this.pl[0]; this.th0 = 0; this.dir = 1; this.fly = null; this.last = 0; },
    addP: function (y) { var r = rnd(22, 34); this.pl.push({ x: this.pl.length ? clamp(this.pl[this.pl.length - 1].x + rnd(-150, 150), 60, this.W - 60) : this.W / 2, y: y, r: r, i: this.pl.length, col: pickOf(["#ff4d6d", "#ffd23f", "#3ddc84", "#ff9f1c", "#ff5fd2", "#c77dff"]) }); },
    act: function () { if (this.fly || !this.on) return; var p = this.on, R = p.r + 22, x = p.x + Math.cos(this.th0) * R, y = p.y + Math.sin(this.th0) * R, s = 330; this.fly = { x: x, y: y, vx: -Math.sin(this.th0) * s * this.dir, vy: Math.cos(this.th0) * s * this.dir }; this.on = null; this.acts++; sfx(520, 0.08, "triangle", 0.05, 1.6); },
    step: function (dt) {
      var i, w = 2.6 * (1 + Math.min(this.t, 60) * 0.01);
      if (this.on) { this.th0 += w * this.dir * dt; var p = this.on, R = p.r + 22; this.px = p.x + Math.cos(this.th0) * R; this.py = p.y + Math.sin(this.th0) * R; }
      else { var f = this.fly; f.x += f.vx * dt; f.y += f.vy * dt; this.px = f.x; this.py = f.y;
        for (i = 0; i < this.pl.length; i++) { var q = this.pl[i]; if (q === this.prev) continue; if (Math.hypot(q.x - f.x, q.y - f.y) < q.r + 30) { this.on = q; this.fly = null; this.th0 = Math.atan2(f.y - q.y, f.x - q.x); this.dir = -this.dir; if (q.i > this.last) { this.add(q.i - this.last > 1 ? 2 : 1); this.last = q.i; } break; } }
        if (this.fly && (f.x < -30 || f.x > this.W + 30 || f.y - this.cam > this.H + 30 || f.y - this.cam < -60)) { this.hurt(); var back = null; for (i = 0; i < this.pl.length; i++) if (this.pl[i].i === this.last) back = this.pl[i]; this.on = back || this.pl[0]; this.fly = null; this.th0 = 0; }
      }
      if (this.on) this.prev = this.on;
      var tg = (this.on ? this.on.y : this.py) - (this.H - this.pb - 140); if (tg < this.cam) this.cam += (tg - this.cam) * Math.min(1, dt * 4);
      while (this.pl[this.pl.length - 1].y > this.cam - 260) this.addP(this.pl[this.pl.length - 1].y - rnd(170, 220));
      var cam = this.cam, H = this.H, keep = this.on; this.pl = this.pl.filter(function (q) { return q === keep || q.y - cam < H + 80; });
    },
    draw: function (now) {
      var c = this.ctx, i, cam = this.cam;
      for (i = 0; i < this.pl.length; i++) { var q = this.pl[i]; c.strokeStyle = "rgba(255,255,255,0.12)"; c.lineWidth = 2; c.beginPath(); c.arc(q.x, q.y - cam, q.r + 22, 0, TAU); c.stroke(); dot(c, q.x, q.y - cam, q.r, q.col); dot(c, q.x - q.r * 0.3, q.y - cam - q.r * 0.25, q.r * 0.22, "rgba(0,0,0,0.18)"); }
      c.globalAlpha = this.fadeA(); buddy(c, this.px, this.py - cam, 10, "#f2f2f2"); c.globalAlpha = 1;
      this.ghost(this.W / 2 + 60, this.H - this.pb - 60, now);
    }
  }), "space");

  /* 10. Salto de esquí: mantené en la rampa y soltá justo al final */
  regD("skijump", "Salto de esquí", "Mantené apretado en la rampa para agarrar velocidad y soltá justo al final. Pasá la línea roja.", "#f2f2f2", G("Skijump", {
    ctl: "hold",
    init: function () { this.K = 140; this.round(); },
    round: function () { this.ph = "wait"; this.s = 0; this.v = 0; this.rel = -1; this.fx = 0; this.fy = 0; this.vx = 0; this.vy = 0; this.land = 0; this.wt = 0.6; },
    lip: function () { return { x: this.W * 0.42, y: this.cy + 10 }; },
    press: function () { if (this.ph === "wait") { this.ph = "ramp"; this.acts++; } },
    release: function () { if (this.ph === "ramp") this.rel = this.s; },
    hill: function (x) { var L = this.lip(); return L.y + 40 + (x - L.x) * 0.5; },
    step: function (dt) {
      var L = this.lip();
      if (this.ph === "wait") { this.wt -= dt; return; }
      if (this.ph === "ramp") { this.v += (this.holding ? 520 : 300) * dt; this.s += this.v * dt / 420; if (this.s >= 1) { var q = this.rel < 0 ? 0.5 : this.rel > 0.86 ? 1 : 0.6; this.ph = "air"; this.fx = L.x; this.fy = L.y; this.vx = this.v * 0.75 * (0.7 + 0.3 * q); this.vy = -this.v * 0.32 * q; } return; }
      if (this.ph === "air") { this.vy += 420 * dt; this.fx += this.vx * dt; this.fy += this.vy * dt; if (this.fy >= this.hill(this.fx) || this.fx > this.W - 10) { if (this.fx > this.W - 10) this.fx = this.W - 10; this.ph = "done"; this.land = this.fx - L.x; this.wt = 0.9; var m = Math.round(this.land / 2); if (this.land >= this.K) { this.add(Math.min(5, 1 + Math.floor((this.land - this.K) / 40))); this.K = Math.min(this.W * 0.5, this.K + 8); } else this.hurt(); } return; }
      if (this.ph === "done") { this.wt -= dt; if (this.wt <= 0) this.round(); }
    },
    draw: function (now) {
      var c = this.ctx, L = this.lip(), sx = 10, sy = this.pt + 30, kx = L.x + this.K;
      c.strokeStyle = "#f2f2f2"; c.lineWidth = 8; c.lineCap = "round"; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(L.x - 60, L.y + 20, L.x, L.y); c.stroke(); c.lineCap = "butt";
      c.fillStyle = "#eef3fa"; c.beginPath(); c.moveTo(L.x - 10, L.y + 40); c.lineTo(this.W, this.hill(this.W)); c.lineTo(this.W, this.H); c.lineTo(L.x - 10, this.H); c.closePath(); c.fill();
      c.fillStyle = "#ff4d6d"; c.fillRect(kx - 2, this.hill(kx) - 30, 4, 36);
      var px, py; if (this.ph === "ramp" || this.ph === "wait") { var t = this.s, a = 1 - t; px = a * a * sx + 2 * a * t * (L.x - 60) + t * t * L.x; py = a * a * sy + 2 * a * t * (L.y + 20) + t * t * L.y - 14; } else { px = this.fx; py = this.fy - 14; }
      c.globalAlpha = this.fadeA(); c.fillStyle = "#ff4d6d"; c.fillRect(px - 16, py + 10, 32, 4); buddy(c, px, py - (this.holding && this.ph === "ramp" ? -4 : 0), 12, "#ff9f1c", 1); c.globalAlpha = 1;
      this.ghostHold(this.W * 0.7, this.pt + 120, now);
    }
  }), "snow");

  /* 11. Baldosas: arrastrá la pelota para que pique arriba de cada baldosa */
  regD("tiles", "Baldosas", "La pelota pica sola. Arrastrá a los costados para que caiga siempre arriba de una baldosa.", "#3ddc84", G("Tiles", {
    ctl: "drag",
    init: function () { this.x = this.W / 2; this.T = 0.62; this.k = 1; this.landY = this.H - this.pb - 150; this.rows = []; this.tw = 84; for (var i = 1; i <= 8; i++) this.rows.push({ k: i, x: i < 3 ? this.W / 2 : rnd(50, this.W - 50), col: pickOf(["#ff4d6d", "#ffd23f", "#3ddc84", "#c77dff", "#ff9f1c"]) }); this.clock = 0; },
    drag: function (x) { this.x = clamp(x, 20, this.W - 20); },
    step: function (dt) {
      this.clock += dt; var T = this.T;
      if (this.clock >= this.k * T) { var r = this.rows.shift(), d = Math.abs(this.x - r.x); if (d < this.tw / 2 + 6) this.good(d < 12 ? 2 : 1, r.x, this.landY, d < 12); else this.hurt(); this.k++; var last = this.rows[this.rows.length - 1]; this.rows.push({ k: last.k + 1, x: clamp(last.x + rnd(-170, 170), 50, this.W - 50), col: pickOf(["#ff4d6d", "#ffd23f", "#3ddc84", "#c77dff", "#ff9f1c"]) }); this.tw = Math.max(52, this.tw - 0.6); }
    },
    draw: function (now) {
      var c = this.ctx, i, sp = 150, T = this.T;
      for (i = this.rows.length - 1; i >= 0; i--) { var r = this.rows[i], y = this.landY - (r.k * T - this.clock) / T * sp; if (y < -20) continue; fillR(c, r.x - this.tw / 2, y - 7, this.tw, 14, 6, r.col); }
      var ph = (this.clock % T) / T, by = this.landY - Math.sin(ph * PI) * 120 - 14;
      c.globalAlpha = this.fadeA(); dot(c, this.x, by, 13, "#f2f2f2"); c.globalAlpha = 1;
      this.ghostDrag(this.landY + 60, now);
    }
  }), "arcade");

  /* 12. Penales: tocá para patear cuando la mira esté lejos del arquero */
  regD("penal", "Penales", "La mira va y viene. Tocá para patear adonde no llegue el arquero.", "#ffd23f", G("Penal", {
    init: function () { this.gl = this.W * 0.12; this.gr = this.W * 0.88; this.gy = this.pt + 110; this.aim = 0.5; this.ad = 1; this.kx = this.W / 2; this.ball = null; this.wait = 0; },
    act: function () { if (this.ball || this.wait > 0) return; var tx = this.gl + (this.gr - this.gl) * this.aim; this.ball = { t: 0, tx: tx }; this.dive = Math.random() < 0.35 ? clamp(tx + rnd(-30, 30), this.gl, this.gr) : rnd(this.gl + 20, this.gr - 20); this.acts++; sfx(160, 0.12, "sine", 0.08, 0.6); },
    step: function (dt) {
      var sp = 0.9 * (1 + Math.min(this.t, 60) * 0.015); this.aim += this.ad * sp * dt; if (this.aim > 1) { this.aim = 1; this.ad = -1; } if (this.aim < 0) { this.aim = 0; this.ad = 1; }
      if (this.wait > 0) { this.wait -= dt; if (this.wait <= 0) this.kx = this.W / 2; return; }
      if (this.ball) { this.ball.t += dt / 0.45; this.kx += (this.dive - this.kx) * Math.min(1, dt * 7);
        if (this.ball.t >= 1) { var d = Math.abs(this.ball.tx - this.kx); if (d < 40) this.hurt(); else { var corner = Math.min(this.ball.tx - this.gl, this.gr - this.ball.tx) < 30; this.good(corner ? 2 : 1, this.ball.tx, this.gy, corner); } this.ball = null; this.wait = 0.5; } }
      else this.kx += (this.W / 2 + Math.sin(this.t * 2) * 30 - this.kx) * Math.min(1, dt * 3);
    },
    draw: function (now) {
      var c = this.ctx, gl = this.gl, gr = this.gr, gy = this.gy;
      c.fillStyle = "rgba(255,255,255,0.15)"; c.fillRect(gl, gy - 80, gr - gl, 100); c.fillStyle = "#f2f2f2"; c.fillRect(gl - 6, gy - 86, 6, 110); c.fillRect(gr, gy - 86, 6, 110); c.fillRect(gl - 6, gy - 86, gr - gl + 12, 6);
      fillR(c, this.kx - 36, gy - 30, 72, 22, 9, "#c77dff"); dot(c, this.kx - 38, gy - 22, 8, "#f2f2f2"); dot(c, this.kx + 38, gy - 22, 8, "#f2f2f2"); buddy(c, this.kx, gy - 44, 12, "#f2b48a");
      var ax = gl + (gr - gl) * this.aim; c.strokeStyle = "#ff4d6d"; c.lineWidth = 3; c.beginPath(); c.arc(ax, gy - 20, 12, 0, TAU); c.moveTo(ax - 18, gy - 20); c.lineTo(ax + 18, gy - 20); c.moveTo(ax, gy - 38); c.lineTo(ax, gy - 2); c.stroke();
      var sx = this.W / 2, sy = this.H - this.pb - 90; if (this.ball) { var k = this.ball.t; soccer(c, sx + (this.ball.tx - sx) * k, sy + (gy - 20 - sy) * k - Math.sin(k * PI) * 30, 13 - 5 * k); } else if (this.wait <= 0) soccer(c, sx, sy, 13);
      buddy(c, sx, sy + 46, 15, "#ff4d6d");
      this.ghost(sx + 60, sy, now);
    }
  }), "court");

  /* 13. Vóley: arrastrá para devolver la pelota por arriba de la red */
  regD("volley", "Vóley", "Arrastrá a los costados para cabecear la pelota y pasarla por arriba de la red.", "#ff9f1c", G("Volley", {
    ctl: "drag",
    init: function () { this.fl = this.H - this.pb - 30; this.px = this.W * 0.25; this.ax = this.W * 0.75; this.serve(-1); },
    serve: function (side) { this.b = { x: side < 0 ? this.W * 0.25 : this.W * 0.75, y: this.cy - 80, vx: 0, vy: -100 }; this.wait = 0.6; },
    drag: function (x) { this.px = clamp(x, 26, this.W / 2 - 34); },
    head: function (hx, me) { var b = this.b, hy = this.fl - 30, dx = b.x - hx, dy = b.y - hy, d = Math.hypot(dx, dy); if (d < 40 && d > 0 && b.vy > -50) { var nx = dx / d, ny = dy / d; b.x = hx + nx * 40; b.y = hy + ny * 40; b.vy = -560 - Math.random() * 80; b.vx = (me ? 1 : -1) * (150 + Math.abs(dx) * 4) * (me ? 1 : 1); if (me) { b.vx = 120 + (b.x - hx + 20) * 6; this.add(1); sfx(420, 0.06, "triangle", 0.05); } else b.vx = -(120 + (hx - b.x + 20) * 6); } },
    step: function (dt) {
      var b = this.b; if (this.wait > 0) { this.wait -= dt; return; }
      b.vy += 700 * dt; b.x += b.vx * dt; b.y += b.vy * dt; var r = 14, nx = this.W / 2;
      if (b.x < r) { b.x = r; b.vx = Math.abs(b.vx); } if (b.x > this.W - r) { b.x = this.W - r; b.vx = -Math.abs(b.vx); }
      if (b.y > this.fl - 100 && Math.abs(b.x - nx) < r + 4) { b.vx = (b.x < nx ? -1 : 1) * Math.abs(b.vx) * 0.6; b.x = nx + (b.x < nx ? -r - 4 : r + 4); }
      this.head(this.px, true);
      var target = b.x > nx ? b.x + 10 : this.W * 0.75, ai = (200 + Math.min(this.t, 60) * 2) * dt; this.ax += clamp(target - this.ax, -ai, ai); this.ax = clamp(this.ax, nx + 34, this.W - 26); this.head(this.ax, false);
      if (b.y > this.fl - r) { if (b.x < nx) { this.hurt(); this.serve(-1); } else { this.good(3, b.x, b.y, true); this.serve(-1); } }
    },
    draw: function (now) {
      var c = this.ctx; fillR(c, 0, this.fl, this.W, 30, 0, "#e9d6a0"); c.fillStyle = "#f2f2f2"; c.fillRect(this.W / 2 - 3, this.fl - 100, 6, 100); c.fillStyle = "rgba(255,255,255,0.5)"; c.fillRect(this.W / 2 - 3, this.fl - 100, 6, 40);
      c.globalAlpha = this.fadeA(); buddy(c, this.px, this.fl - 30, 24, "#ff4d6d", 1); c.globalAlpha = 1; buddy(c, this.ax, this.fl - 30, 24, "#c77dff", -1);
      spBeach(c, this.b.x, this.b.y, 14);
      this.ghostDrag(this.fl - 30, now);
    }
  }), "beach");

  /* 14. Samurái: tocá del lado donde llega el ninja, justo cuando está cerca */
  regD("samurai", "Samurái", "Los ninjas vienen de los dos lados. Tocá de ese lado justo cuando están cerca.", "#ff4d6d", G("Samurai", {
    init: function () { this.en = []; this.next = 1; this.stun = 0; this.cut = 0; this.cs = 1; this.gy = this.H - this.pb - 80; },
    act: function (x) { if (this.stun > 0) return; var s = x < this.W / 2 ? -1 : 1, cx = this.W / 2, best = null, i; this.cs = s; this.cut = 0.12; this.acts++;
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; if (e.s === s && Math.abs(e.x - cx) < 96 && (!best || Math.abs(e.x - cx) < Math.abs(best.x - cx))) best = e; }
      if (best) { best.dead = true; this.add(1); sfx(900, 0.05, "sawtooth", 0.04, 0.4); } else { this.stun = 0.45; sfx(120, 0.1, "square", 0.04); } },
    step: function (dt) {
      var i, cx = this.W / 2; this.stun = Math.max(0, this.stun - dt); this.cut = Math.max(0, this.cut - dt); this.next -= dt;
      if (this.next <= 0) { var s = Math.random() < 0.5 ? -1 : 1; this.en.push({ s: s, x: s < 0 ? -20 : this.W + 20, v: rnd(90, 150) * (1 + Math.min(this.t, 60) * 0.015) }); this.next = rnd(0.6, 1.3) * Math.max(0.45, 1 - this.t * 0.008); }
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; e.x -= e.s * e.v * dt; if (!e.dead && Math.abs(e.x - cx) < 26) { e.dead = true; this.hurt(); } }
      this.en = this.en.filter(function (q) { return !q.dead; });
    },
    draw: function (now) {
      var c = this.ctx, i, cx = this.W / 2, gy = this.gy; fillR(c, 0, gy + 18, this.W, 8, 0, "#55555f");
      c.strokeStyle = "rgba(255,77,109,0.25)"; c.lineWidth = 2; c.beginPath(); c.moveTo(cx - 96, gy - 40); c.lineTo(cx - 96, gy + 18); c.moveTo(cx + 96, gy - 40); c.lineTo(cx + 96, gy + 18); c.stroke();
      for (i = 0; i < this.en.length; i++) { var e = this.en[i]; dot(c, e.x, gy, 16, "#2b2b33"); fillR(c, e.x - 14, gy - 6, 28, 7, 3, "#ff4d6d"); dot(c, e.x + (e.s < 0 ? 6 : -6), gy - 3, 2.5, "#fff"); }
      c.globalAlpha = this.stun > 0 ? 0.5 : this.fadeA(); buddy(c, cx, gy - 4, 20, "#f2f2f2", this.cs); fillR(c, cx - 18, gy - 26, 36, 8, 3, "#c0304e");
      c.save(); c.translate(cx + this.cs * 16, gy); c.rotate(this.cs * (this.cut > 0 ? 1.3 : -0.6)); fillR(c, -2, -46, 4, 46, 2, "#d9dde3"); c.fillStyle = "#6b4423"; c.fillRect(-3, -6, 6, 12); c.restore(); c.globalAlpha = 1;
      this.ghost(cx + 110, gy - 60, now);
    }
  }), "city");

  /* 15. Montaña rusa: mantené para acelerar; en las curvas rojas, despacio */
  regD("coaster", "Montaña rusa", "Mantené apretado para acelerar y soltá para frenar. Subí las lomas y pasá las curvas rojas despacio.", "#ff4d6d", G("Coaster", {
    ctl: "hold",
    init: function () { this.wx = 0; this.v = 160; this.px = this.W * 0.3; this.base = this.H - this.pb - 150; this.dist = 0; this.zones = []; this.nz = 600; },
    gy: function (x) { return this.base + Math.sin(x * 0.005) * 80 + Math.sin(x * 0.013 + 2) * 20; },
    sl: function (x) { return (this.gy(x + 2) - this.gy(x - 2)) / 4; },
    step: function (dt) {
      var x = this.wx + this.px, s = this.sl(x), i;
      this.v += (s * 900 + (this.holding ? 260 : -160)) * dt; this.v = Math.min(this.v, 620);
      if (this.v < 20 && s < -0.05) { this.hurt(); this.v = 200; }
      this.v = Math.max(this.v, 0); this.wx += this.v * dt; this.dist += this.v * dt; if (this.dist > 350) { this.dist -= 350; this.add(1); }
      while (this.nz < this.wx + this.W + 200) { this.zones.push({ x: this.nz, w: 140, max: 230, done: false }); this.nz += rnd(500, 800); }
      for (i = 0; i < this.zones.length; i++) { var z = this.zones[i]; if (!z.done && x > z.x && x < z.x + z.w && this.v > z.max) { z.done = true; this.hurt(); this.v = 120; } if (!z.done && x > z.x + z.w) { z.done = true; this.good(2, this.px, this.gy(x), true); } }
      var wx = this.wx; this.zones = this.zones.filter(function (q) { return q.x + q.w > wx - 50; });
    },
    draw: function (now) {
      var c = this.ctx, x, i, W = this.W;
      c.strokeStyle = "#8a5a2b"; c.lineWidth = 3; for (x = -(this.wx % 40); x < W; x += 40) { c.beginPath(); c.moveTo(x, this.gy(this.wx + x)); c.lineTo(x, this.H); c.stroke(); }
      c.strokeStyle = "#d9dde3"; c.lineWidth = 7; c.beginPath(); for (x = 0; x <= W; x += 6) c.lineTo(x, this.gy(this.wx + x)); c.stroke();
      for (i = 0; i < this.zones.length; i++) { var z = this.zones[i]; c.strokeStyle = z.done ? "rgba(255,77,109,0.3)" : "#ff4d6d"; c.lineWidth = 9; c.beginPath(); for (x = z.x - this.wx; x <= z.x + z.w - this.wx; x += 6) c.lineTo(x, this.gy(this.wx + x)); c.stroke(); }
      var X = this.wx + this.px, a = Math.atan(this.sl(X)); c.save(); c.translate(this.px, this.gy(X) - 14); c.rotate(a); fillR(c, -22, -8, 44, 18, 6, "#ffd23f"); dot(c, -12, 12, 5, "#2b2b33"); dot(c, 12, 12, 5, "#2b2b33"); c.restore();
      c.globalAlpha = this.fadeA(); buddy(c, this.px, this.gy(X) - 34, 11, "#f2b48a", 1); c.globalAlpha = 1;
      fillR(c, 16, this.pt + 10, 120, 8, 4, "rgba(255,255,255,0.15)"); fillR(c, 16, this.pt + 10, 120 * this.v / 620, 8, 4, this.v > 230 ? "#ff4d6d" : "#3ddc84");
      this.ghostHold(W * 0.65, this.pt + 90, now);
    }
  }), "circus");
