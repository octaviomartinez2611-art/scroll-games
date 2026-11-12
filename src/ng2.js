
  /* 4 en línea */
  var Four = G("Four", {
    init: function () {
      this.cols = 7; this.rows = 6; this.cs = Math.floor(Math.min((this.W - 76) / 7, (this.H - this.pt - this.pb - 90) / 6));
      this.ox = Math.floor((this.W - 76 - 7 * this.cs) / 2) + 8; this.oy = this.pt + 56; this.newGame();
    },
    newGame: function () { this.b = []; for (var r = 0; r < 6; r++) this.b.push(new Array(7).fill(0)); this.turn = 1; this.wait = 0; this.pend = null; },
    drop: function (c, p) { for (var r = this.rows - 1; r >= 0; r--) if (!this.b[r][c]) { this.b[r][c] = p; return r; } return -1; },
    free: function (c) { return !this.b[0][c]; },
    win: function (p) {
      var b = this.b, r, c, d, ds = [[0, 1], [1, 0], [1, 1], [1, -1]];
      for (r = 0; r < 6; r++) for (c = 0; c < 7; c++) { if (b[r][c] !== p) continue; for (d = 0; d < 4; d++) { var k = 1; while (k < 4) { var rr2 = r + ds[d][0] * k, cc = c + ds[d][1] * k; if (rr2 < 0 || rr2 > 5 || cc < 0 || cc > 6 || b[rr2][cc] !== p) break; k++; } if (k === 4) return true; } }
      return false;
    },
    full: function () { for (var c = 0; c < 7; c++) if (this.free(c)) return false; return true; },
    act: function (x) {
      if (this.turn !== 1 || this.pend) return; var c = Math.floor((x - this.ox) / this.cs); if (c < 0 || c > 6 || !this.free(c)) return;
      this.drop(c, 1); this.acts++; S.flip();
      if (this.win(1)) { this.add(1); S.perfect(); this.pend = "new"; this.wait = 0.7; }
      else if (this.full()) { this.pend = "new"; this.wait = 0.5; } else { this.turn = 2; this.wait = 0.45; }
    },
    ai: function () {
      var cands = [], c, r, best = -1;
      for (c = 0; c < 7; c++) if (this.free(c)) cands.push(c);
      for (var p = 2; p >= 1; p--) for (var i = 0; i < cands.length; i++) { c = cands[i]; r = this.drop(c, p); var w = this.win(p); this.b[r][c] = 0; if (w) return c; }
      if (Math.random() < 0.2) return cands[ri(0, cands.length)];
      var wts = cands.map(function (k) { return 4 - Math.abs(k - 3) + Math.random() * 2; }), bi = 0; for (i = 1; i < wts.length; i++) if (wts[i] > wts[bi]) bi = i;
      return cands[bi];
    },
    step: function (dt) {
      if (this.wait > 0) { this.wait -= dt; if (this.wait > 0) return;
        if (this.pend === "new") { this.pend = null; this.newGame(); return; }
        if (this.pend === "lose") { this.pend = "new"; this.wait = 0.5; return; }
        if (this.turn === 2) {
          this.drop(this.ai(), 2); S.flip();
          if (this.win(2)) { this.hurt(); this.pend = "lose"; this.wait = 0.5; } else if (this.full()) { this.pend = "new"; this.wait = 0.4; } else this.turn = 1;
        }
      }
    },
    draw: function (now) {
      var c = this.ctx, cs = this.cs, r, k;
      fillR(c, this.ox - 6, this.oy - 6, 7 * cs + 12, 6 * cs + 12, 10, "#222");
      for (r = 0; r < 6; r++) for (k = 0; k < 7; k++) {
        var v = this.b[r][k]; c.fillStyle = v === 1 ? "#ff4d6d" : v === 2 ? "#ffd23f" : "#000"; c.beginPath(); c.arc(this.ox + (k + 0.5) * cs, this.oy + (r + 0.5) * cs, cs * 0.4, 0, TAU); c.fill();
      }
      c.fillStyle = this.turn === 1 ? "#ff4d6d" : "#ffd23f"; c.beginPath(); c.arc(this.ox + 3.5 * cs, this.oy - 30, 11, 0, TAU); c.fill();
      this.ghost(this.ox + 3.5 * cs, this.oy + 3 * cs, now);
    }
  });

  /* Ta-Te-Ti */
  var Ttt = G("Ttt", {
    init: function () { this.cs = Math.floor(Math.min((this.W - 76) / 3, 108)); this.ox = Math.floor((this.W - 76 - 3 * this.cs) / 2) + 8; this.oy = Math.floor(this.cy - 1.5 * this.cs); this.newGame(); },
    newGame: function () { this.b = [0, 0, 0, 0, 0, 0, 0, 0, 0]; this.turn = 1; this.wait = 0; this.pend = null; },
    L: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
    won: function (p) { var b = this.b; return this.L.some(function (l) { return b[l[0]] === p && b[l[1]] === p && b[l[2]] === p; }); },
    act: function (x, y) {
      if (this.turn !== 1 || this.pend) return; var c = Math.floor((x - this.ox) / this.cs), r = Math.floor((y - this.oy) / this.cs); if (c < 0 || c > 2 || r < 0 || r > 2) return;
      var i = r * 3 + c; if (this.b[i]) return; this.b[i] = 1; this.acts++; S.flip();
      if (this.won(1)) { this.add(1); S.perfect(); this.pend = "new"; this.wait = 0.7; }
      else if (this.b.indexOf(0) < 0) { this.pend = "new"; this.wait = 0.6; } else { this.turn = 2; this.wait = 0.4; }
    },
    ai: function () {
      var e = [], i, p, w; for (i = 0; i < 9; i++) if (!this.b[i]) e.push(i);
      for (p = 2; p >= 1; p--) for (w = 0; w < e.length; w++) { this.b[e[w]] = p; var ok = this.won(p); this.b[e[w]] = 0; if (ok) return e[w]; }
      if (Math.random() < 0.15) return e[ri(0, e.length)];
      if (!this.b[4]) return 4; var cs = [0, 2, 6, 8].filter(function (k) { return !this.b[k]; }, this); if (cs.length) return cs[ri(0, cs.length)];
      return e[ri(0, e.length)];
    },
    step: function (dt) {
      if (this.wait <= 0) return; this.wait -= dt; if (this.wait > 0) return;
      if (this.pend === "new") { this.pend = null; this.newGame(); return; }
      if (this.pend === "lose") { this.pend = "new"; this.wait = 0.5; return; }
      if (this.turn === 2) {
        this.b[this.ai()] = 2; S.flip();
        if (this.won(2)) { this.hurt(); this.pend = "lose"; this.wait = 0.4; } else if (this.b.indexOf(0) < 0) { this.pend = "new"; this.wait = 0.5; } else this.turn = 1;
      }
    },
    draw: function (now) {
      var c = this.ctx, cs = this.cs, i, r, k;
      c.strokeStyle = "rgba(255,255,255,0.35)"; c.lineWidth = 4; c.beginPath();
      for (i = 1; i < 3; i++) { c.moveTo(this.ox + i * cs, this.oy + 8); c.lineTo(this.ox + i * cs, this.oy + 3 * cs - 8); c.moveTo(this.ox + 8, this.oy + i * cs); c.lineTo(this.ox + 3 * cs - 8, this.oy + i * cs); } c.stroke();
      for (i = 0; i < 9; i++) {
        if (!this.b[i]) continue; var x = this.ox + (i % 3 + 0.5) * cs, y = this.oy + (Math.floor(i / 3) + 0.5) * cs, s = cs * 0.28;
        if (this.b[i] === 1) { c.strokeStyle = "#fff"; c.lineWidth = 8; c.lineCap = "round"; c.beginPath(); c.moveTo(x - s, y - s); c.lineTo(x + s, y + s); c.moveTo(x + s, y - s); c.lineTo(x - s, y + s); c.stroke(); c.lineCap = "butt"; }
        else { c.strokeStyle = "#ff4d6d"; c.lineWidth = 8; c.beginPath(); c.arc(x, y, s * 1.1, 0, TAU); c.stroke(); }
      }
      this.ghost(this.ox + 1.5 * cs, this.oy + 1.5 * cs, now);
    }
  });

  /* Buscaminas */
  var Mines = G("Mines", {
    init: function () { this.cols = 7; this.rows = 9; this.cs = Math.floor(Math.min((this.W - 76) / 7, (this.H - this.pt - this.pb - 20) / 9)); this.ox = Math.floor((this.W - 76 - 7 * this.cs) / 2) + 8; this.oy = this.pt + 8; this.newBoard(); },
    newBoard: function () { this.cells = []; for (var i = 0; i < 63; i++) this.cells.push({ m: false, o: false, n: 0, x: false }); this.placed = false; this.pend = 0; this.safeLeft = 63 - 9; },
    nb: function (i) { var r = Math.floor(i / 7), c = i % 7, o = []; for (var a = -1; a <= 1; a++) for (var b = -1; b <= 1; b++) { if (!a && !b) continue; var rr2 = r + a, cc = c + b; if (rr2 >= 0 && rr2 < 9 && cc >= 0 && cc < 7) o.push(rr2 * 7 + cc); } return o; },
    place: function (first) {
      var ban = this.nb(first).concat([first]), n = 0, i;
      while (n < 9) { i = ri(0, 63); if (ban.indexOf(i) >= 0 || this.cells[i].m) continue; this.cells[i].m = true; n++; }
      for (i = 0; i < 63; i++) this.cells[i].n = this.nb(i).filter(function (k) { return this.cells[k].m; }, this).length;
      this.placed = true;
    },
    open: function (i) {
      var st = [i], c, k, nb;
      while (st.length) { k = st.pop(); c = this.cells[k]; if (c.o || c.m) continue; c.o = true; this.safeLeft--; if (c.n === 0) { nb = this.nb(k); for (var j = 0; j < nb.length; j++) st.push(nb[j]); } }
    },
    act: function (x, y) {
      if (this.pend > 0) return; var c = Math.floor((x - this.ox) / this.cs), r = Math.floor((y - this.oy) / this.cs); if (c < 0 || c > 6 || r < 0 || r > 8) return;
      var i = r * 7 + c, cell = this.cells[i]; if (cell.o || cell.x) return; this.acts++;
      if (!this.placed) this.place(i);
      if (cell.m) { cell.x = true; this.hurt(); return; }
      this.open(i); this.add(1); S.hit(this.score);
      if (this.safeLeft <= 0) { this.add(5); S.perfect(); this.pend = 0.8; }
    },
    step: function (dt) { if (this.pend > 0) { this.pend -= dt; if (this.pend <= 0) this.newBoard(); } },
    draw: function (now) {
      var c = this.ctx, cs = this.cs, i, NC = ["", "#3ddc84", "#ffd23f", "#ff9f1c", "#ff4d6d", "#c77dff", "#ff5fd2", "#fff", "#fff"];
      for (i = 0; i < 63; i++) {
        var cell = this.cells[i], x = this.ox + (i % 7) * cs, y = this.oy + Math.floor(i / 7) * cs;
        fillR(c, x + 1.5, y + 1.5, cs - 3, cs - 3, 4, cell.x ? "#ff4d6d" : cell.o ? "#141414" : "#3a3a3a");
        if (cell.o && cell.n) txt(c, String(cell.n), x + cs / 2, y + cs / 2 + 1, cs * 0.5, NC[cell.n]);
        if (cell.x) { c.fillStyle = "#000"; c.beginPath(); c.arc(x + cs / 2, y + cs / 2, cs * 0.2, 0, TAU); c.fill(); }
      }
      this.ghost(this.ox + 3.5 * cs, this.oy + 4.5 * cs, now);
    }
  });

  /* Piedra, papel o tijera */
  var Rps = G("Rps", {
    init: function () { this.bw = Math.floor((this.W - 76 - 20) / 3); this.bx0 = 8; this.by = this.cy + 70; this.bh = 110; this.mine = -1; this.opp = -1; this.t = 0; this.rev = 0; },
    sym: function (c, k, x, y, s, col) {
      c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 7; c.lineCap = "round";
      if (k === 0) { c.beginPath(); c.arc(x, y, s * 0.8, 0, TAU); c.fill(); }
      else if (k === 1) { c.beginPath(); rr(c, x - s * 0.7, y - s * 0.9, s * 1.4, s * 1.8, 6); c.stroke(); }
      else { c.beginPath(); c.moveTo(x - s * 0.7, y - s * 0.8); c.lineTo(x + s * 0.7, y + s * 0.8); c.moveTo(x + s * 0.7, y - s * 0.8); c.lineTo(x - s * 0.7, y + s * 0.8); c.stroke(); }
      c.lineCap = "butt";
    },
    act: function (x, y) {
      if (this.rev > 0 || y < this.by || y > this.by + this.bh) return; var k = Math.floor((x - this.bx0) / (this.bw + 10)); if (k < 0 || k > 2) return;
      this.mine = k; this.opp = ri(0, 3); this.rev = 0.9; this.acts++;
      var r = (k - this.opp + 3) % 3; // 1 = win, 2 = lose
      if (r === 1) { this.add(1); S.hit(this.score); } else if (r === 2) this.hurt();
    },
    step: function (dt) { if (this.rev > 0) { this.rev -= dt; if (this.rev <= 0) { this.mine = -1; this.opp = -1; } } },
    draw: function (now) {
      var c = this.ctx, i, N = ["Piedra", "Papel", "Tijera"];
      fillR(c, this.cx - 64 - 20, this.cy - 120, 128, 128, 18, "#1a1a1a");
      if (this.opp >= 0) this.sym(c, this.opp, this.cx - 20, this.cy - 56, 34, "#ff4d6d"); else txt(c, "?", this.cx - 20, this.cy - 54, 54, "rgba(255,255,255,0.3)");
      for (i = 0; i < 3; i++) {
        var x = this.bx0 + i * (this.bw + 10);
        fillR(c, x, this.by, this.bw, this.bh, 14, this.mine === i ? "#333" : "#1c1c1c");
        this.sym(c, i, x + this.bw / 2, this.by + 44, 22, "#fff"); txt(c, N[i], x + this.bw / 2, this.by + 90, 15, "rgba(255,255,255,0.7)", "center", 700);
      }
      this.ghost(this.bx0 + this.bw / 2, this.by + this.bh / 2, now);
    }
  });

  /* Apagá las luces */
  var Lights = G("Lights", {
    init: function () { this.cs = Math.floor(Math.min((this.W - 76) / 4, 92)); this.ox = Math.floor((this.W - 76 - 4 * this.cs) / 2) + 8; this.oy = Math.floor(this.cy - 2 * this.cs) + 10; this.newP(); },
    newP: function () {
      this.b = new Array(16).fill(0); var n = 3 + Math.min(5, Math.floor(this.score / 2)), done = [], k;
      while (done.length < n) { k = ri(0, 16); if (done.indexOf(k) < 0) { done.push(k); this.flip(k); } }
      if (this.b.every(function (v) { return !v; })) this.flip(5);
      this.tl = 25; this.tm = 25;
    },
    flip: function (i) { var r = Math.floor(i / 4), c = i % 4, d = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]; for (var k = 0; k < 5; k++) { var a = r + d[k][0], b = c + d[k][1]; if (a >= 0 && a < 4 && b >= 0 && b < 4) this.b[a * 4 + b] ^= 1; } },
    act: function (x, y) {
      var c = Math.floor((x - this.ox) / this.cs), r = Math.floor((y - this.oy) / this.cs); if (c < 0 || c > 3 || r < 0 || r > 3) return;
      this.flip(r * 4 + c); this.acts++; S.flip();
      if (this.b.every(function (v) { return !v; })) { this.add(1); S.perfect(); this.newP(); }
    },
    step: function (dt) { this.tl -= dt; if (this.tl <= 0) { this.hurt(); if (this.state !== "play") return; this.newP(); } },
    draw: function (now) {
      var c = this.ctx, cs = this.cs, i;
      fillR(c, this.ox, this.oy - 24, 4 * cs, 8, 4, "rgba(255,255,255,0.12)"); fillR(c, this.ox, this.oy - 24, 4 * cs * Math.max(0, this.tl / this.tm), 8, 4, "#fff");
      for (i = 0; i < 16; i++) fillR(c, this.ox + (i % 4) * cs + 3, this.oy + Math.floor(i / 4) * cs + 3, cs - 6, cs - 6, 10, this.b[i] ? "#ffd23f" : "#262626");
      this.ghost(this.ox + 1.5 * cs, this.oy + 1.5 * cs, now);
    }
  });

  /* Burbujas */
  var Bub = G("Bub", {
    ctl: "drag",
    init: function () {
      this.cols = 9; this.rad = Math.floor((this.W - 24) / 18); this.rh = Math.round(this.rad * 1.74); this.ox = Math.floor((this.W - 18 * this.rad) / 2); this.top = this.pt + 8; this.base = 0; this.g = {};
      this.sx = this.cx; this.sy = this.H - this.pb - 34; this.limit = Math.floor((this.sy - 70 - this.top) / this.rh); this.aim = 0; this.shot = null; this.shots = 0;
      for (var r = 0; r < 5; r++) for (var c = 0; c < this.nc(r); c++) this.g[r + "," + c] = ri(0, 4);
      this.cur = this.pick();
    },
    nc: function (r) { return (((r % 2) + 2) % 2) ? 8 : 9; },
    px: function (r, c) { return this.ox + this.rad + c * 2 * this.rad + ((((r % 2) + 2) % 2) ? this.rad : 0); },
    py: function (r) { return this.top + this.rad + (r - this.base) * this.rh; },
    pick: function () { var s = {}, k, a = []; for (k in this.g) s[this.g[k]] = 1; for (k in s) a.push(+k); return a.length ? a[ri(0, a.length)] : ri(0, 4); },
    nbs: function (r, c) {
      var odd = ((r % 2) + 2) % 2, o = [[r, c - 1], [r, c + 1]], d = odd ? [c, c + 1] : [c - 1, c], out = [], i;
      o.push([r - 1, d[0]], [r - 1, d[1]], [r + 1, d[0]], [r + 1, d[1]]);
      for (i = 0; i < o.length; i++) if (o[i][1] >= 0 && o[i][1] < this.nc(o[i][0])) out.push(o[i]);
      return out;
    },
    drag: function (x) { this.aim = clamp((x - this.cx) / (this.W / 2) * 1.25, -1.25, 1.25); },
    release: function (x, y, cancel) { if (cancel || this.shot) return; this.shot = { x: this.sx, y: this.sy, vx: Math.sin(this.aim) * 640, vy: -Math.cos(this.aim) * 640, c: this.cur }; this.cur = this.pick(); this.acts++; },
    snap: function () {
      var s = this.shot, r0 = Math.round((s.y - this.top - this.rad) / this.rh) + this.base, best = null, bd = 1e9, r, c, i, k;
      for (r = r0 - 1; r <= r0 + 1; r++) for (c = 0; c < this.nc(r); c++) {
        if (this.g[r + "," + c] !== undefined || r < this.base) continue;
        var ok = r === this.base; if (!ok) { var n = this.nbs(r, c); for (i = 0; i < n.length; i++) if (this.g[n[i][0] + "," + n[i][1]] !== undefined) { ok = true; break; } }
        if (!ok) continue; var d = Math.hypot(this.px(r, c) - s.x, this.py(r) - s.y); if (d < bd) { bd = d; best = [r, c]; }
      }
      this.shot = null; if (!best) return;
      this.g[best[0] + "," + best[1]] = s.c; this.resolve(best[0], best[1], s.c); this.shots++;
      if (this.shots % 6 === 0) this.descend();
      if (!Object.keys(this.g).length) { for (r = this.base; r < this.base + 4; r++) for (c = 0; c < this.nc(r); c++) this.g[r + "," + c] = ri(0, 4); }
    },
    resolve: function (r, c, col) {
      var seen = {}, st = [[r, c]], cl = [], n, i, k;
      seen[r + "," + c] = 1;
      while (st.length) { n = st.pop(); cl.push(n); var nb = this.nbs(n[0], n[1]); for (i = 0; i < nb.length; i++) { k = nb[i][0] + "," + nb[i][1]; if (!seen[k] && this.g[k] === col) { seen[k] = 1; st.push(nb[i]); } } }
      if (cl.length < 3) return;
      for (i = 0; i < cl.length; i++) delete this.g[cl[i][0] + "," + cl[i][1]];
      var cnt = cl.length, conn = {}; st = [];
      for (k in this.g) { var p = k.split(","); if (+p[0] === this.base) { conn[k] = 1; st.push([+p[0], +p[1]]); } }
      while (st.length) { n = st.pop(); nb = this.nbs(n[0], n[1]); for (i = 0; i < nb.length; i++) { k = nb[i][0] + "," + nb[i][1]; if (this.g[k] !== undefined && !conn[k]) { conn[k] = 1; st.push(nb[i]); } } }
      for (k in this.g) if (!conn[k]) { delete this.g[k]; cnt++; }
      this.add(cnt); S.hit(this.score);
    },
    descend: function () {
      this.base--; for (var c = 0; c < this.nc(this.base); c++) this.g[this.base + "," + c] = ri(0, 4);
      for (var k in this.g) { if (+k.split(",")[0] - this.base >= this.limit) { this.hurt(); for (var k2 in this.g) if (+k2.split(",")[0] - this.base >= this.limit - 3) delete this.g[k2]; break; } }
    },
    step: function (dt) {
      var s = this.shot; if (!s) return; var n = 2, i, k;
      while (n-- && this.shot) {
        s.x += s.vx * dt / 2; s.y += s.vy * dt / 2;
        if (s.x < this.ox + this.rad) { s.x = this.ox + this.rad; s.vx = Math.abs(s.vx); } if (s.x > this.ox + 17 * this.rad + this.rad) { s.x = this.ox + 18 * this.rad - this.rad; s.vx = -Math.abs(s.vx); }
        if (s.y <= this.top + this.rad) { this.snap(); break; }
        for (k in this.g) { var p = k.split(","); if (Math.hypot(this.px(+p[0], +p[1]) - s.x, this.py(+p[0]) - s.y) < this.rad * 1.85) { this.snap(); break; } }
      }
    },
    draw: function (now) {
      var c = this.ctx, k, p;
      for (k in this.g) { p = k.split(","); c.fillStyle = BCOL[this.g[k]]; c.beginPath(); c.arc(this.px(+p[0], +p[1]), this.py(+p[0]), this.rad - 1.5, 0, TAU); c.fill(); }
      c.fillStyle = "rgba(255,255,255,0.12)"; c.fillRect(this.ox, this.top + this.limit * this.rh + this.rad + 4, 18 * this.rad, 2);
      if (this.holding && !this.shot) { c.strokeStyle = "rgba(255,255,255,0.4)"; c.lineWidth = 3; c.setLineDash([4, 10]); c.beginPath(); c.moveTo(this.sx, this.sy); c.lineTo(this.sx + Math.sin(this.aim) * 160, this.sy - Math.cos(this.aim) * 160); c.stroke(); c.setLineDash([]); }
      if (this.shot) { c.fillStyle = BCOL[this.shot.c]; c.beginPath(); c.arc(this.shot.x, this.shot.y, this.rad - 1.5, 0, TAU); c.fill(); }
      else { c.fillStyle = BCOL[this.cur]; c.beginPath(); c.arc(this.sx, this.sy, this.rad - 1.5, 0, TAU); c.fill(); }
      this.ghostDrag(this.sy + 40, now);
    }
  });

  /* Globito */
  var Keep = G("Keep", {
    init: function () { this.r = 36; this.reset2(); },
    reset2: function () { this.bx = this.cx; this.by = this.pt + 60; this.vx = 0; this.vy = 0; },
    act: function (x, y) {
      if (Math.hypot(x - this.bx, y - this.by) > this.r + 50) return;
      this.vy = -520; this.vx = clamp((this.bx - x) * 5, -260, 260); this.add(1); this.acts++; S.hit(this.score);
    },
    step: function (dt) {
      this.vy += 650 * dt; this.bx += this.vx * dt; this.by += this.vy * dt;
      if (this.bx < this.r) { this.bx = this.r; this.vx = Math.abs(this.vx) * 0.8; } if (this.bx > this.W - this.r) { this.bx = this.W - this.r; this.vx = -Math.abs(this.vx) * 0.8; }
      if (this.by < this.r + 40) { this.by = this.r + 40; this.vy = Math.abs(this.vy) * 0.5; }
      if (this.by > this.H - this.pb + 20) { this.hurt(); if (this.state !== "play") return; this.reset2(); }
    },
    draw: function (now) {
      var c = this.ctx, x = this.bx, y = this.by, r = this.r;
      c.strokeStyle = "rgba(255,255,255,0.5)"; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y + r + 8); c.lineTo(x - this.vx * 0.05, y + r + 50); c.stroke();
      c.fillStyle = "#ff4d6d"; c.beginPath(); c.ellipse(x, y, r * 0.88, r, 0, 0, TAU); c.fill();
      c.beginPath(); c.moveTo(x - 6, y + r + 8); c.lineTo(x + 6, y + r + 8); c.lineTo(x, y + r - 2); c.closePath(); c.fill();
      this.ghost(x, y + 10, now);
    }
  });

  /* Invasores */
  var Inv = G("Inv", {
    ctl: "drag",
    init: function () { this.px = this.cx; this.tx = this.px; this.py = this.H - this.pb - 18; this.bul = []; this.eb = []; this.fire = 0; this.efire = 1.2; this.wave = 0; this.newWave(); },
    newWave: function () { this.al = []; for (var j = 0; j < 4; j++) for (var i = 0; i < 6; i++) this.al.push({ i: i, j: j }); this.gx = 0; this.gy = 0; this.dir = 1; this.spd = 40 + this.wave * 12; },
    drag: function (x) { this.tx = clamp(x, 20, this.W - 20); },
    apos: function (a) { return { x: 40 + a.i * 46 + this.gx, y: this.pt + 34 + a.j * 34 + this.gy }; },
    step: function (dt) {
      var i, j, a, p; this.px += (this.tx - this.px) * Math.min(1, dt * 20);
      this.gx += this.dir * this.spd * dt; var mn = 1e9, mx = -1e9, lowest = -1e9;
      for (i = 0; i < this.al.length; i++) { p = this.apos(this.al[i]); mn = Math.min(mn, p.x); mx = Math.max(mx, p.x); lowest = Math.max(lowest, p.y); }
      if (mx + 16 > this.W - 8 && this.dir > 0 || mn - 16 < 8 && this.dir < 0) { this.dir = -this.dir; this.gy += 16; }
      if (lowest + 12 >= this.py - 14) { this.hurt(); if (this.state !== "play") return; this.newWave(); return; }
      this.fire -= dt; if (this.fire <= 0) { this.fire = 0.45; this.bul.push({ x: this.px, y: this.py - 14 }); }
      this.efire -= dt; if (this.efire <= 0 && this.al.length) { this.efire = Math.max(0.5, 1.3 - this.wave * 0.1); p = this.apos(this.al[ri(0, this.al.length)]); this.eb.push({ x: p.x, y: p.y + 10 }); }
      for (i = this.bul.length - 1; i >= 0; i--) {
        var b = this.bul[i]; b.y -= 520 * dt; var hitI = -1;
        for (j = 0; j < this.al.length; j++) { p = this.apos(this.al[j]); if (Math.abs(b.x - p.x) < 15 && Math.abs(b.y - p.y) < 11) { hitI = j; break; } }
        if (hitI >= 0) { this.al.splice(hitI, 1); this.bul.splice(i, 1); this.add(1); S.hit(this.score); if (!this.al.length) { this.wave++; this.newWave(); this.bul = []; this.eb = []; } }
        else if (b.y < -10) this.bul.splice(i, 1);
      }
      for (i = this.eb.length - 1; i >= 0; i--) {
        var e = this.eb[i]; e.y += 230 * dt;
        if (this.invuln <= 0 && e.y > this.py - 10 && e.y < this.py + 10 && Math.abs(e.x - this.px) < 16) { this.eb.splice(i, 1); this.hurt(); if (this.state !== "play") return; }
        else if (e.y > this.H) this.eb.splice(i, 1);
      }
    },
    draw: function (now) {
      var c = this.ctx, i, p;
      for (i = 0; i < this.al.length; i++) { p = this.apos(this.al[i]); fillR(c, p.x - 15, p.y - 10, 30, 20, 5, BCOL[this.al[i].j]); c.fillStyle = "#000"; c.fillRect(p.x - 8, p.y - 4, 4, 5); c.fillRect(p.x + 4, p.y - 4, 4, 5); }
      c.fillStyle = "#fff"; for (i = 0; i < this.bul.length; i++) c.fillRect(this.bul[i].x - 2, this.bul[i].y - 8, 4, 14);
      c.fillStyle = "#ff4d6d"; for (i = 0; i < this.eb.length; i++) c.fillRect(this.eb[i].x - 2, this.eb[i].y - 6, 4, 12);
      if (!this.blink()) { c.fillStyle = "#fff"; c.beginPath(); c.moveTo(this.px, this.py - 14); c.lineTo(this.px + 18, this.py + 10); c.lineTo(this.px - 18, this.py + 10); c.closePath(); c.fill(); }
      this.ghostDrag(this.py - 80, now);
    }
  });

  /* Asteroides */
  var Aster = G("Aster", {
    ctl: "drag",
    init: function () { this.ang = -PI / 2; this.side = 0; this.bul = []; this.rocks = []; this.fire = 0.3; this.spawn = 0.8; },
    drag: function (x) { this.side = x < this.cx ? -1 : 1; },
    release: function () { this.side = 0; },
    addRock: function (x, y, vx, vy, r) { this.rocks.push({ x: x, y: y, vx: vx, vy: vy, r: r }); },
    step: function (dt) {
      var i, j, b, k; this.ang += this.side * 3.4 * dt;
      this.fire -= dt; if (this.fire <= 0) { this.fire = 0.32; this.bul.push({ x: this.cx + Math.cos(this.ang) * 16, y: this.cy + Math.sin(this.ang) * 16, vx: Math.cos(this.ang) * 560, vy: Math.sin(this.ang) * 560, t: 0 }); }
      this.spawn -= dt;
      if (this.spawn <= 0) {
        this.spawn = Math.max(0.5, 1.2 - this.score * 0.01); var a = rnd(0, TAU), d = Math.max(this.W, this.H) * 0.62, sp = rnd(50, 95) + Math.min(60, this.score);
        var tx = this.cx + rnd(-60, 60), ty = this.cy + rnd(-60, 60), sx = this.cx + Math.cos(a) * d, sy = this.cy + Math.sin(a) * d, l = Math.hypot(tx - sx, ty - sy);
        this.addRock(sx, sy, (tx - sx) / l * sp, (ty - sy) / l * sp, rnd(18, 30));
      }
      for (i = this.bul.length - 1; i >= 0; i--) { b = this.bul[i]; b.x += b.vx * dt; b.y += b.vy * dt; b.t += dt; if (b.t > 1.2) this.bul.splice(i, 1); }
      for (i = this.rocks.length - 1; i >= 0; i--) {
        var r = this.rocks[i]; r.x += r.vx * dt; r.y += r.vy * dt; var gone = false;
        for (j = this.bul.length - 1; j >= 0; j--) {
          b = this.bul[j];
          if (Math.hypot(b.x - r.x, b.y - r.y) < r.r) {
            this.bul.splice(j, 1); gone = true; this.add(1); S.hit(this.score);
            if (r.r > 20) for (k = 0; k < 2; k++) { var aa = rnd(0, TAU); this.addRock(r.x, r.y, r.vx * 0.7 + Math.cos(aa) * 70, r.vy * 0.7 + Math.sin(aa) * 70, r.r * 0.6); }
            break;
          }
        }
        if (!gone && this.invuln <= 0 && Math.hypot(r.x - this.cx, r.y - this.cy) < r.r + 12) { gone = true; this.hurt(); if (this.state !== "play") return; }
        if (gone) this.rocks.splice(i, 1);
      }
    },
    draw: function (now) {
      var c = this.ctx, i;
      c.fillStyle = "#8a8a8a"; for (i = 0; i < this.rocks.length; i++) { var r = this.rocks[i]; c.beginPath(); c.arc(r.x, r.y, r.r, 0, TAU); c.fill(); }
      c.fillStyle = "#fff"; for (i = 0; i < this.bul.length; i++) { c.beginPath(); c.arc(this.bul[i].x, this.bul[i].y, 3, 0, TAU); c.fill(); }
      if (!this.blink()) { c.save(); c.translate(this.cx, this.cy); c.rotate(this.ang); c.fillStyle = "#fff"; c.beginPath(); c.moveTo(16, 0); c.lineTo(-12, 11); c.lineTo(-8, 0); c.lineTo(-12, -11); c.closePath(); c.fill(); c.restore(); }
      this.ghostHold(this.cx - this.W * 0.28, this.cy + 120, now);
    }
  });

  /* Alunizaje */
  var Land = G("Land", {
    ctl: "drag",
    init: function () { this.gy = this.H - this.pb - 10; this.tx = this.cx; this.pw = 100; this.newRound(); },
    newRound: function () { this.x = rnd(60, this.W - 60); this.y = this.pt + 30; this.vx = 0; this.vy = 0; this.padx = rnd(16, this.W - 16 - this.pw); },
    drag: function (x) { this.tx = x; },
    step: function (dt) {
      var thr = this.holding;
      this.vy = clamp(this.vy + (thr ? -250 : 150) * dt, -260, 320);
      if (thr) this.vx += clamp(this.tx - this.x, -90, 90) * 2.4 * dt; else this.vx *= (1 - 0.25 * dt);
      this.vx = clamp(this.vx, -140, 140); this.x += this.vx * dt; this.y += this.vy * dt;
      if (this.x < 14) { this.x = 14; this.vx = 0; } if (this.x > this.W - 14) { this.x = this.W - 14; this.vx = 0; } if (this.y < this.pt - 10) { this.y = this.pt - 10; this.vy = 0; }
      if (this.y + 14 >= this.gy) {
        var onPad = this.x - 10 >= this.padx && this.x + 10 <= this.padx + this.pw, soft = this.vy < 130 && Math.abs(this.vx) < 70;
        if (onPad && soft) { this.good(1, this.x, this.gy - 40, false); } else this.hurt();
        if (this.state === "play") this.newRound();
      }
    },
    draw: function (now) {
      var c = this.ctx, x = this.x, y = this.y;
      c.fillStyle = "#262626"; c.fillRect(0, this.gy, this.W, this.H - this.gy); fillR(c, this.padx, this.gy - 3, this.pw, 6, 2, "#3ddc84");
      if (this.holding && this.state === "play") { c.fillStyle = "#ff9f1c"; c.beginPath(); c.moveTo(x - 7, y + 12); c.lineTo(x + 7, y + 12); c.lineTo(x, y + 26 + Math.random() * 8); c.closePath(); c.fill(); }
      c.strokeStyle = "#fff"; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 10, y + 6); c.lineTo(x - 15, y + 14); c.moveTo(x + 10, y + 6); c.lineTo(x + 15, y + 14); c.stroke();
      fillR(c, x - 12, y - 12, 24, 20, 6, "#fff");
      this.ghostHold(this.cx, this.H * 0.5, now);
    }
  });

  /* Plinko */
  var Plink = G("Plink", {
    init: function () {
      this.sp = Math.floor((this.W - 72) / 8); this.x0 = 12; this.top = this.pt + 70; this.rh = this.sp * 0.85; this.pegs = [];
      for (var j = 0; j < 8; j++) { var n = j % 2 ? 7 : 8; for (var i = 0; i < n; i++) this.pegs.push({ x: this.x0 + this.sp * (j % 2 ? i + 1 : i + 0.5), y: this.top + j * this.rh }); }
      this.slotY = this.top + 7 * this.rh + 26; this.vals = [6, 3, 1, 0, 0, 1, 3, 6]; this.ball = null;
    },
    act: function (x) { if (this.ball) return; this.ball = { x: clamp(x, this.x0 + 10, this.x0 + 8 * this.sp - 10), y: this.top - 28, vx: rnd(-6, 6), vy: 0 }; this.acts++; },
    step: function (dt) {
      var b = this.ball; if (!b) return;
      for (var n = 0; n < 3; n++) {
        var h = dt / 3; b.vy += 900 * h; b.x += b.vx * h; b.y += b.vy * h;
        if (b.x < this.x0 + 7) { b.x = this.x0 + 7; b.vx = Math.abs(b.vx) * 0.6; } if (b.x > this.x0 + 8 * this.sp - 7) { b.x = this.x0 + 8 * this.sp - 7; b.vx = -Math.abs(b.vx) * 0.6; }
        for (var i = 0; i < this.pegs.length; i++) {
          var p = this.pegs[i], dx = b.x - p.x, dy = b.y - p.y, d = Math.hypot(dx, dy);
          if (d < 11 && d > 0) { var nx = dx / d, ny = dy / d, dot = b.vx * nx + b.vy * ny; b.x = p.x + nx * 11; b.y = p.y + ny * 11; if (dot < 0) { b.vx -= 1.55 * dot * nx; b.vy -= 1.55 * dot * ny; b.vx += rnd(-14, 14); } }
        }
        if (b.y > this.slotY) {
          var k = clamp(Math.floor((b.x - this.x0) / this.sp), 0, 7), v = this.vals[k]; this.ball = null;
          if (v) { this.add(v); S.hit(v + 3); } else this.hurt();
          return;
        }
      }
    },
    draw: function (now) {
      var c = this.ctx, i;
      c.fillStyle = "#fff"; for (i = 0; i < this.pegs.length; i++) { c.beginPath(); c.arc(this.pegs[i].x, this.pegs[i].y, 4, 0, TAU); c.fill(); }
      for (i = 0; i < 8; i++) { fillR(c, this.x0 + i * this.sp + 2, this.slotY, this.sp - 4, 40, 6, this.vals[i] ? "#222" : "#4a1a22"); txt(c, String(this.vals[i]), this.x0 + (i + 0.5) * this.sp, this.slotY + 21, 18, this.vals[i] ? "#fff" : "#ff4d6d"); }
      if (this.ball) { c.fillStyle = "#ffd23f"; c.beginPath(); c.arc(this.ball.x, this.ball.y, 7, 0, TAU); c.fill(); }
      else this.ghost(this.x0 + this.sp * 1, this.top - 10, now);
    }
  });

