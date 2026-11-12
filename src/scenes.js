  /* ===== Escenarios: cada juego tiene un fondo relacionado con lo que se juega ===== */
  function hsl(h, s, l, a) { return a === undefined ? "hsl(" + h + "," + s + "%," + l + "%)" : "hsla(" + h + "," + s + "%," + l + "%," + a + ")"; }
  function poly(c, pts, col) { c.fillStyle = col; c.beginPath(); c.moveTo(pts[0], pts[1]); for (var i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]); c.closePath(); c.fill(); }
  function dot(c, x, y, r, col) { c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }
  function hills(c, W, H, y0, amp, n, col, rn) { c.fillStyle = col; c.beginPath(); c.moveTo(0, H); var ph = rn() * 6; for (var x = 0; x <= W + 10; x += 10) c.lineTo(x, y0 - Math.abs(Math.sin(x / W * Math.PI * n + ph)) * amp); c.lineTo(W, H); c.closePath(); c.fill(); }
  function stars(c, W, H, n, rn, maxY) { for (var i = 0; i < n; i++) dot(c, rn() * W, rn() * (maxY || H), 0.6 + rn() * 1.4, "rgba(255,255,255," + (0.15 + rn() * 0.45).toFixed(2) + ")"); }
  function cloud(c, x, y, s, col) { dot(c, x, y, 22 * s, col); dot(c, x + 24 * s, y - 10 * s, 26 * s, col); dot(c, x + 50 * s, y, 20 * s, col); c.fillStyle = col; c.fillRect(x, y, 50 * s, 20 * s); }
  function planks(c, W, H, w, col, vertical) { c.fillStyle = col; for (var p = w; p < (vertical ? W : H); p += w) { if (vertical) c.fillRect(p, 0, 2, H); else c.fillRect(0, p, W, 2); } }
  var SCENES = {
    space: { h: 255, s: 40, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(255, 40, 9); c.fillRect(0, 0, W, H); stars(c, W, H, 90, rn);
      var px = rn() < 0.5 ? W * 0.22 : W * 0.78, py = H * (0.18 + rn() * 0.2), pr = 34 + rn() * 26;
      dot(c, px, py, pr, hsl(300, 35, 26)); dot(c, px - pr * 0.3, py - pr * 0.25, pr * 0.22, hsl(300, 30, 22));
      c.strokeStyle = hsl(30, 40, 38); c.lineWidth = 4; c.beginPath(); c.ellipse(px, py, pr * 1.6, pr * 0.35, -0.3, 0, TAU); c.stroke();
      dot(c, W * 0.15 + rn() * W * 0.7, H * 0.7, 10 + rn() * 8, hsl(20, 35, 28));
    } },
    moon: { h: 250, s: 25, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(250, 35, 9); c.fillRect(0, 0, W, H); stars(c, W, H * 0.7, 70, rn);
      dot(c, W * 0.75, H * 0.2, 26, hsl(200, 10, 70)); hills(c, W, H, H * 0.82, 30, 2, hsl(250, 8, 24), rn);
      for (var i = 0; i < 5; i++) { c.fillStyle = hsl(250, 8, 18); c.beginPath(); c.ellipse(rn() * W, H * (0.86 + rn() * 0.1), 14 + rn() * 16, 5, 0, 0, TAU); c.fill(); }
    } },
    sky: { h: 280, s: 35, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(280, 35, 20); c.fillRect(0, 0, W, H); c.fillStyle = hsl(330, 40, 24); c.fillRect(0, H * 0.55, W, H * 0.45);
      dot(c, W * (0.2 + rn() * 0.6), H * 0.58, 46, hsl(30, 75, 55));
      for (var i = 0; i < 5; i++) cloud(c, rn() * W - 30, H * (0.12 + rn() * 0.4), 0.7 + rn() * 0.6, hsl(280, 25, 30));
      hills(c, W, H, H * 0.78, 50, 1.5, hsl(150, 25, 18), rn); hills(c, W, H, H * 0.88, 30, 2.5, hsl(150, 28, 13), rn);
    } },
    sea: { h: 185, s: 50, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(185, 55, 13); c.fillRect(0, 0, W, H); c.fillStyle = "rgba(255,255,255,0.035)";
      for (var i = 0; i < 4; i++) { var x = rn() * W; poly(c, [x, 0, x + 50, 0, x - 60, H, x - 130, H], "rgba(255,255,255,0.03)"); }
      for (i = 0; i < 18; i++) { c.strokeStyle = "rgba(255,255,255,0.14)"; c.lineWidth = 2; c.beginPath(); c.arc(rn() * W, rn() * H, 3 + rn() * 7, 0, TAU); c.stroke(); }
      c.fillStyle = hsl(40, 35, 26); c.beginPath(); c.moveTo(0, H); for (var xx = 0; xx <= W; xx += 20) c.lineTo(xx, H - 34 - Math.sin(xx / 40) * 6); c.lineTo(W, H); c.fill();
      c.strokeStyle = hsl(140, 45, 24); c.lineWidth = 7; c.lineCap = "round";
      for (i = 0; i < 6; i++) { var sx = rn() * W, hh = 60 + rn() * 90; c.beginPath(); c.moveTo(sx, H - 30); for (var k = 1; k <= 6; k++) c.lineTo(sx + Math.sin(k * 1.3) * 10, H - 30 - hh * k / 6); c.stroke(); }
      c.lineCap = "butt";
    } },
    city: { h: 255, s: 30, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(250, 35, 11); c.fillRect(0, 0, W, H); stars(c, W, H * 0.4, 30, rn); dot(c, W * 0.8, H * 0.14, 24, hsl(50, 40, 80));
      var x = 0; while (x < W) { var bw = 34 + rn() * 50, bh = H * (0.25 + rn() * 0.35); c.fillStyle = hsl(250, 22, 16 + rn() * 4); c.fillRect(x, H - bh, bw - 4, bh);
        for (var wy = H - bh + 10; wy < H - 10; wy += 16) for (var wx = x + 6; wx < x + bw - 12; wx += 12) if (rn() < 0.3) { c.fillStyle = hsl(45, 80, 60, 0.45); c.fillRect(wx, wy, 5, 7); }
        x += bw; }
    } },
    storm: { h: 240, s: 20, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(240, 20, 13); c.fillRect(0, 0, W, H); for (var i = 0; i < 7; i++) cloud(c, rn() * W - 40, H * (0.05 + rn() * 0.2), 1 + rn() * 0.8, hsl(240, 15, 22));
      c.strokeStyle = "rgba(255,255,255,0.08)"; c.lineWidth = 2; for (i = 0; i < 60; i++) { var x = rn() * W, y = rn() * H; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 6, y + 18); c.stroke(); }
      var lx = W * (0.2 + rn() * 0.6); poly(c, [lx, H * 0.2, lx + 14, H * 0.2, lx - 2, H * 0.32, lx + 12, H * 0.32, lx - 16, H * 0.5, lx - 4, H * 0.36, lx - 16, H * 0.36], hsl(50, 70, 60, 0.35));
      hills(c, W, H, H * 0.9, 20, 3, hsl(240, 15, 9), rn);
    } },
    volcano: { h: 12, s: 45, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(10, 45, 11); c.fillRect(0, 0, W, H);
      for (var i = 0; i < 40; i++) dot(c, rn() * W, rn() * H * 0.8, 1 + rn() * 2, hsl(25, 90, 55, 0.25 + rn() * 0.3));
      var vx = W * (0.3 + rn() * 0.4); poly(c, [vx - W * 0.55, H, vx - 40, H * 0.55, vx + 40, H * 0.55, vx + W * 0.55, H], hsl(10, 25, 18));
      poly(c, [vx - 40, H * 0.55, vx + 40, H * 0.55, vx + 18, H * 0.62, vx - 4, H * 0.58, vx - 22, H * 0.63], hsl(20, 90, 45));
      dot(c, vx - 30, H * 0.45, 26, hsl(10, 10, 22, 0.8)); dot(c, vx + 6, H * 0.38, 34, hsl(10, 10, 20, 0.8));
    } },
    snow: { h: 265, s: 25, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(265, 30, 18); c.fillRect(0, 0, W, H);
      for (var m = 0; m < 3; m++) { var mx = rn() * W, mw = 160 + rn() * 140, top = H * (0.45 + rn() * 0.15); poly(c, [mx - mw, H, mx, top, mx + mw, H], hsl(265, 18, 28)); poly(c, [mx - mw * 0.22, top + (H - top) * 0.22, mx, top, mx + mw * 0.22, top + (H - top) * 0.22, mx + 8, top + (H - top) * 0.17, mx - 8, top + (H - top) * 0.2], "rgba(255,255,255,0.7)"); }
      c.fillStyle = hsl(265, 15, 42); c.fillRect(0, H - 26, W, 26); for (var i = 0; i < 60; i++) dot(c, rn() * W, rn() * H, 1 + rn() * 2, "rgba(255,255,255,0.35)");
    } },
    forest: { h: 150, s: 35, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(150, 35, 12); c.fillRect(0, 0, W, H); dot(c, W * 0.2 + rn() * W * 0.6, H * 0.16, 30, hsl(50, 40, 70, 0.6));
      function tree(x, base, s, col) { poly(c, [x - 30 * s, base, x, base - 70 * s, x + 30 * s, base], col); poly(c, [x - 24 * s, base - 40 * s, x, base - 105 * s, x + 24 * s, base - 40 * s], col); c.fillStyle = hsl(25, 30, 15); c.fillRect(x - 4 * s, base, 8 * s, 14 * s); }
      for (var i = 0; i < 9; i++) tree(rn() * W, H * 0.7, 0.8 + rn() * 0.5, hsl(150, 30, 17));
      for (i = 0; i < 6; i++) tree(rn() * W, H * 0.92, 1.1 + rn() * 0.6, hsl(150, 38, 21));
      c.fillStyle = hsl(150, 30, 9); c.fillRect(0, H * 0.94, W, H * 0.06);
    } },
    garden: { h: 105, s: 35, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(105, 38, 17); c.fillRect(0, 0, W, H);
      for (var i = 0; i < 70; i++) { var x = rn() * W, y = rn() * H; c.strokeStyle = hsl(105, 40, 24); c.lineWidth = 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 3, y - 8); c.moveTo(x, y); c.lineTo(x + 3, y - 9); c.stroke(); }
      for (i = 0; i < 10; i++) { var fx = rn() * W, fy = rn() * H, col = rn() < 0.5 ? hsl(330, 60, 60, 0.6) : hsl(48, 80, 60, 0.6); for (var p = 0; p < 5; p++) dot(c, fx + Math.cos(p * 1.26) * 5, fy + Math.sin(p * 1.26) * 5, 3.5, col); dot(c, fx, fy, 2.5, hsl(40, 80, 80, 0.7)); }
      for (i = 0; i < 4; i++) { var bx = rn() * W, by = rn() * H; dot(c, bx, by, 26, hsl(105, 35, 21)); dot(c, bx + 24, by + 6, 20, hsl(105, 35, 21)); }
    } },
    farm: { h: 40, s: 35, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(30, 35, 22); c.fillRect(0, 0, W, H); dot(c, W * 0.78, H * 0.16, 30, hsl(45, 80, 60, 0.8));
      hills(c, W, H, H * 0.62, 30, 1.2, hsl(100, 30, 20), rn);
      var bx = W * (0.1 + rn() * 0.3), by = H * 0.6; c.fillStyle = hsl(355, 45, 28); c.fillRect(bx, by - 60, 80, 60); poly(c, [bx - 8, by - 60, bx + 40, by - 95, bx + 88, by - 60], hsl(355, 40, 22)); c.fillStyle = hsl(30, 30, 85, 0.6); c.fillRect(bx + 28, by - 36, 24, 36);
      c.fillStyle = hsl(30, 35, 30); for (var x = 0; x < W; x += 30) c.fillRect(x, H * 0.72, 6, 34); c.fillRect(0, H * 0.74, W, 5); c.fillRect(0, H * 0.79, W, 5);
      c.fillStyle = hsl(100, 32, 16); c.fillRect(0, H * 0.8, W, H * 0.2);
    } },
    kitchen: { h: 28, s: 40, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(28, 40, 22); c.fillRect(0, 0, W, H); planks(c, W, H, 56, hsl(28, 40, 17), true);
      c.strokeStyle = hsl(28, 40, 26); c.lineWidth = 2; for (var i = 0; i < 14; i++) { c.beginPath(); c.ellipse(rn() * W, rn() * H, 12 + rn() * 24, 4 + rn() * 6, 0, 0, TAU); c.stroke(); }
      c.strokeStyle = hsl(28, 30, 15); c.lineWidth = 6; rr(c, 14, 14, W - 28, H - 28, 24); c.stroke();
    } },
    road: { h: 250, s: 10, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(250, 8, 16); c.fillRect(0, 0, W, H); c.fillStyle = hsl(250, 8, 24); c.fillRect(0, 0, 18, H); c.fillRect(W - 18, 0, 18, H);
      c.fillStyle = "rgba(255,255,255,0.22)"; for (var l = 1; l < 4; l++) for (var y = 0; y < H; y += 46) c.fillRect(W * l / 4 - 2, y, 4, 24);
      for (var i = 0; i < 6; i++) { c.fillStyle = hsl(250, 8, 13); c.beginPath(); c.ellipse(rn() * W, rn() * H, 20, 8, 0, 0, TAU); c.fill(); }
    } },
    desert: { h: 22, s: 45, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(20, 45, 20); c.fillRect(0, 0, W, H); c.fillStyle = hsl(330, 35, 22); c.fillRect(0, 0, W, H * 0.35);
      var sx = W * (0.2 + rn() * 0.6); dot(c, sx, H * 0.5, 60, hsl(40, 85, 58)); c.fillStyle = hsl(20, 45, 20); for (var k = 0; k < 4; k++) c.fillRect(sx - 70, H * 0.5 + 10 + k * 12, 140, 4);
      for (var i = 0; i < 3; i++) { var mx = rn() * W, mw = 60 + rn() * 70, mh = 50 + rn() * 70; poly(c, [mx - mw, H * 0.72, mx - mw * 0.6, H * 0.72 - mh, mx + mw * 0.6, H * 0.72 - mh, mx + mw, H * 0.72], hsl(15, 35, 14)); }
      c.fillStyle = hsl(15, 35, 14); c.fillRect(0, H * 0.72, W, H * 0.28);
      for (i = 0; i < 3; i++) { var cx2 = rn() * W, cy2 = H * 0.72; c.fillStyle = hsl(130, 25, 20); c.fillRect(cx2 - 5, cy2 - 46, 10, 46); c.fillRect(cx2 - 18, cy2 - 30, 8, 18); c.fillRect(cx2 - 18, cy2 - 16, 18, 6); c.fillRect(cx2 + 10, cy2 - 36, 8, 20); c.fillRect(cx2 + 4, cy2 - 22, 14, 6); }
    } },
    build: { h: 40, s: 30, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(35, 28, 15); c.fillRect(0, 0, W, H);
      var x0 = W * (0.55 + rn() * 0.3); c.fillStyle = hsl(45, 70, 40, 0.5); c.fillRect(x0, H * 0.15, 10, H * 0.85); c.fillRect(x0 - W * 0.55, H * 0.15, W * 0.7, 10); c.fillRect(x0 - W * 0.4, H * 0.15, 3, H * 0.25); c.fillRect(x0 - W * 0.4 - 12, H * 0.4, 26, 14);
      for (var i = 0; i < 4; i++) { var bx = rn() * W * 0.8, bw = 50 + rn() * 50, bh = H * (0.15 + rn() * 0.25); c.strokeStyle = hsl(35, 20, 24); c.lineWidth = 4; c.strokeRect(bx, H - bh, bw, bh); for (var y = H - bh; y < H; y += 26) { c.beginPath(); c.moveTo(bx, y); c.lineTo(bx + bw, y); c.stroke(); } }
      for (var s2 = -20; s2 < W; s2 += 28) poly(c, [s2, H, s2 + 14, H - 14, s2 + 28, H - 14, s2 + 14, H], hsl(48, 80, 45, 0.6));
    } },
    court: { h: 28, s: 45, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(28, 45, 24); c.fillRect(0, 0, W, H); planks(c, W, H, 34, hsl(28, 45, 20), true);
      c.strokeStyle = "rgba(255,255,255,0.28)"; c.lineWidth = 4; c.strokeRect(16, 16, W - 32, H - 32); c.beginPath(); c.moveTo(16, H / 2); c.lineTo(W - 16, H / 2); c.stroke();
      c.beginPath(); c.arc(W / 2, H / 2, 54, 0, TAU); c.stroke(); c.strokeRect(W / 2 - 60, 16, 120, H * 0.18); c.beginPath(); c.arc(W / 2, 16 + H * 0.18, 60, 0, PI); c.stroke();
    } },
    lane: { h: 30, s: 45, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(20, 25, 12); c.fillRect(0, 0, W, H); c.fillStyle = hsl(32, 50, 32); c.fillRect(W * 0.12, 0, W * 0.76, H); planks(c, W, H, 18, hsl(32, 45, 27), true);
      c.fillStyle = hsl(20, 25, 12); c.fillRect(0, 0, W * 0.12, H); c.fillRect(W * 0.88, 0, W * 0.12, H);
      for (var i = 0; i < 5; i++) poly(c, [W * (0.3 + i * 0.1), H * 0.7, W * (0.3 + i * 0.1) - 7, H * 0.7 + 18, W * (0.3 + i * 0.1) + 7, H * 0.7 + 18], hsl(0, 0, 100, 0.25));
    } },
    pub: { h: 20, s: 35, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(20, 35, 17); c.fillRect(0, 0, W, H); planks(c, W, H, 44, hsl(20, 35, 13), false);
      for (var i = 0; i < 12; i++) dot(c, rn() * W, rn() * H, 2, hsl(20, 30, 10));
      c.fillStyle = hsl(150, 20, 12); rr(c, 18, H * 0.72, 90, 70, 8); c.fill(); c.fillStyle = "rgba(255,255,255,0.18)"; c.font = "600 14px " + DISPLAY; c.textAlign = "left"; c.fillText("301", 32, H * 0.72 + 28); c.fillText("180", 32, H * 0.72 + 50);
    } },
    golf: { h: 115, s: 40, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(115, 40, 20); c.fillRect(0, 0, W, H); for (var y = 0; y < H; y += 60) { c.fillStyle = hsl(115, 40, 23); c.fillRect(0, y, W, 30); }
      for (var i = 0; i < 5; i++) { var tx = rn() * W, ty = H * (0.1 + rn() * 0.3); dot(c, tx, ty, 26, hsl(130, 35, 15)); dot(c, tx + 18, ty + 8, 20, hsl(130, 35, 15)); }
      c.fillStyle = hsl(45, 45, 45, 0.6); c.beginPath(); c.ellipse(W * (0.2 + rn() * 0.6), H * 0.5, 50, 18, 0, 0, TAU); c.fill();
    } },
    school: { h: 160, s: 25, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(25, 35, 20); c.fillRect(0, 0, W, H); c.fillStyle = hsl(160, 25, 15); c.fillRect(10, 10, W - 20, H - 20);
      var sym = ["2+2", "x²", "÷", "π", "√9", "7×8", "a+b", "=", "%", "10", "∑", "3/4"]; c.fillStyle = "rgba(255,255,255,0.07)"; c.textAlign = "center";
      for (var i = 0; i < 16; i++) { c.font = "600 " + Math.round(18 + rn() * 22) + "px " + DISPLAY; c.fillText(sym[Math.floor(rn() * sym.length)], 30 + rn() * (W - 60), 40 + rn() * (H - 80)); }
      c.fillStyle = hsl(25, 35, 26); c.fillRect(10, H - 22, W - 20, 12); c.fillStyle = "rgba(255,255,255,0.6)"; c.fillRect(40, H - 28, 26, 6);
    } },
    table: { h: 150, s: 40, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(25, 40, 18); c.fillRect(0, 0, W, H); c.fillStyle = hsl(150, 40, 17); rr(c, 12, 12, W - 24, H - 24, 26); c.fill();
      c.strokeStyle = hsl(150, 40, 21); c.lineWidth = 2; rr(c, 26, 26, W - 52, H - 52, 18); c.stroke();
      for (var i = 0; i < 8; i++) { c.save(); c.translate(rn() * W, rn() * H); c.rotate(rn() * PI); c.strokeStyle = hsl(150, 40, 21); c.strokeRect(-16, -22, 32, 44); c.restore(); }
    } },
    arcade: { h: 290, s: 45, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(285, 45, 11); c.fillRect(0, 0, W, H); stars(c, W, H * 0.5, 40, rn);
      var hy = H * 0.58; dot(c, W / 2, hy, 70, hsl(330, 70, 45)); c.fillStyle = hsl(285, 45, 11); for (var k = 0; k < 5; k++) c.fillRect(W / 2 - 80, hy - 50 + k * 14, 160, 3 + k);
      c.fillStyle = hsl(285, 45, 11); c.fillRect(0, hy, W, H - hy); c.strokeStyle = hsl(300, 70, 50, 0.35); c.lineWidth = 2;
      for (var i = -8; i <= 8; i++) { c.beginPath(); c.moveTo(W / 2 + i * 20, hy); c.lineTo(W / 2 + i * 120, H); c.stroke(); }
      for (var j = 1; j < 9; j++) { var y = hy + (H - hy) * Math.pow(j / 9, 1.8); c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    } },
    workshop: { h: 30, s: 20, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(30, 18, 13); c.fillRect(0, 0, W, H);
      function gear(x, y, r, col) { c.fillStyle = col; c.beginPath(); for (var t = 0; t < 24; t++) { var a = t * TAU / 24, rr2 = t % 2 ? r : r * 1.18; c.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } c.closePath(); c.fill(); dot(c, x, y, r * 0.35, hsl(30, 18, 13)); }
      for (var i = 0; i < 6; i++) gear(rn() * W, rn() * H, 24 + rn() * 46, hsl(30, 15, 18 + rn() * 4));
      for (i = 0; i < 20; i++) dot(c, rn() * W, rn() * H, 3, hsl(30, 15, 24));
    } },
    circus: { h: 352, s: 45, paint: function (c, W, H, rn) {
      for (var x = 0, k = 0; x < W; x += 34, k++) { c.fillStyle = k % 2 ? hsl(352, 50, 22) : hsl(352, 45, 15); c.fillRect(x, 0, 34, H); }
      c.fillStyle = hsl(352, 40, 12); c.beginPath(); c.moveTo(0, 0); for (var xx = 0; xx <= W; xx += 40) c.quadraticCurveTo(xx + 20, 40, xx + 40, 0); c.fill();
      c.fillStyle = hsl(40, 50, 28); c.beginPath(); c.ellipse(W / 2, H * 0.95, W * 0.6, 50, 0, 0, TAU); c.fill(); c.fillStyle = hsl(352, 30, 14); c.beginPath(); c.ellipse(W / 2, H * 0.97, W * 0.5, 34, 0, 0, TAU); c.fill();
      for (var i = 0; i < 10; i++) dot(c, rn() * W, 14 + rn() * 20, 3, hsl(48, 80, 60, 0.6));
    } },
    cave: { h: 28, s: 22, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(25, 22, 10); c.fillRect(0, 0, W, H);
      for (var x = 0; x < W; x += 26 + rn() * 20) { var h = 30 + rn() * 90; poly(c, [x, 0, x + 26, 0, x + 13, h], hsl(25, 18, 18)); }
      for (x = 0; x < W; x += 30 + rn() * 26) { var h2 = 20 + rn() * 60; poly(c, [x, H, x + 30, H, x + 15, H - h2], hsl(25, 18, 16)); }
      for (var i = 0; i < 6; i++) { var gx = rn() * W, gy = H * (0.2 + rn() * 0.6), col = rn() < 0.5 ? hsl(280, 50, 40, 0.5) : hsl(170, 50, 38, 0.5); poly(c, [gx, gy - 14, gx + 7, gy, gx, gy + 8, gx - 7, gy], col); }
    } },
    beach: { h: 30, s: 45, paint: function (c, W, H, rn) {
      c.fillStyle = hsl(15, 50, 26); c.fillRect(0, 0, W, H); dot(c, W * (0.2 + rn() * 0.6), H * 0.42, 52, hsl(40, 85, 58));
      c.fillStyle = hsl(175, 45, 22); c.fillRect(0, H * 0.46, W, H * 0.24); c.fillStyle = "rgba(255,255,255,0.15)"; for (var i = 0; i < 10; i++) c.fillRect(rn() * W, H * (0.5 + rn() * 0.17), 24 + rn() * 30, 3);
      c.fillStyle = hsl(38, 40, 34); c.fillRect(0, H * 0.7, W, H * 0.3); for (i = 0; i < 30; i++) dot(c, rn() * W, H * (0.72 + rn() * 0.27), 1.5, hsl(38, 30, 26));
      var px = rn() < 0.5 ? 30 : W - 30; c.strokeStyle = hsl(25, 35, 20); c.lineWidth = 8; c.beginPath(); c.moveTo(px, H * 0.85); c.quadraticCurveTo(px + 10, H * 0.6, px - 6, H * 0.45); c.stroke();
      for (var k = 0; k < 5; k++) { c.strokeStyle = hsl(130, 35, 20); c.lineWidth = 6; c.beginPath(); c.moveTo(px - 6, H * 0.45); c.quadraticCurveTo(px - 6 + Math.cos(k * 1.2) * 30, H * 0.4, px - 6 + Math.cos(k * 1.2 + 0.4) * 55, H * 0.45 + Math.sin(k) * 14); c.stroke(); }
    } }
  };
  var SCENE_OF = {
    space: "ship inv aster rocket orbit s_met s_tank s_ufo s_boss s_frd s_bom s_rkt s_rain s_zz s_hard s_frd2 s_fast s_fort d_ufo d_met f_comet",
    moon: "land r_moon l_moon r_float",
    sky: "hop jump ceil cata s_bal z_a z_b z_g f_drone f_heli f_jet f_bal f_glide f_ringm f_coins f_tight balloon d_big b_w",
    sea: "fish boat bub f_sub d_bub t_bub",
    city: "f_night d_mis d_rkt2 d_laser c_pizza c_drop d_cnn d_need",
    storm: "d_ray d_hail d_acid d_mix d_arr d_wind d_aval",
    volcano: "d_fire d_spk d_ninja",
    snow: "d_snow",
    forest: "d_leaf l_bow l_can l_hi t_fly s_bug s_swm h_lab h_ser",
    garden: "snake moles c_onlystar t_face t_gr t_rdrop t_gfast h_wide h_nar h_zig h_riv h_mount h_belt",
    farm: "c_eggs c_fruit catch c_coins",
    kitchen: "slice",
    road: "cross dodge h_tur h_ice",
    desert: "run r_box r_spk r_wall r_pit r_low r_mix r_dbl r_turbo r_mara r_hurd r_giant r_sprint r_pitfly r_dturbo",
    build: "stack d_brk d_bar d_saw d_cube d_col",
    court: "pong hoop brick w_two w_gr w_acc w_mini w_wild w_shr",
    lane: "a_bowl",
    pub: "a_d1 a_d2 a_d3 aim",
    golf: "l_golf l_golf2 l_mini",
    table: "pairs simon cups four ttt mines rps lights plink x_nim",
    arcade: "pop rhythm light follow",
    workshop: "timing clock hold",
    circus: "b_a b_s b_t b_i b_f",
    cave: "f_cave",
    beach: ""
  };
  var SCENE_BY = {}; (function () { for (var k in SCENE_OF) SCENE_OF[k].split(" ").forEach(function (id) { if (id) SCENE_BY[id] = k; }); })();
  var SCENE_PREFIX = { c_: "farm", d_: "storm", t_: "arcade", q_: "school", p_: "workshop", r_: "desert", s_: "space", w_: "court", f_: "sky", m_: "table", e_: "table", k_: "school", g_: "arcade", l_: "forest", a_: "pub", z_: "sky", b_: "circus", h_: "garden", x_: "table", y_: "table" };
  function sceneOf(cfg) { var id = cfg.id || ""; if (SCENE_BY[id]) return SCENE_BY[id]; if (/^(hilo|more|truth|stroop)$/.test(id)) return "school"; if (id === "keep") return "beach"; return SCENE_PREFIX[id.slice(0, 2)] || "arcade"; }
