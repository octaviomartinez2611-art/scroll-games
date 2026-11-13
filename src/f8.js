
  /* ===== Tanda dopamina (2/2) ===== */

  /* --- 11. Teclas: tocá la tecla de cada columna antes de que se escape --- */
  function mkTiles(o) {
    var C = G("Tiles_" + o.id, {
      init: function () { this.n = o.n || 4; this.x0 = 12; this.cw = (this.W - 12 - 60) / this.n; this.tH = (o.tl || 0.22) * (this.H - this.pt - this.pb); this.tiles = []; this.lc = -1; this.lastY = this.pt + this.tH; },
      v: function () { var v = (o.v || 250) * (1 + Math.min(this.t, 90) * (o.ramp || 0.01)); if (o.wave) v *= 0.8 + 0.3 * Math.sin(this.t); return v; },
      step: function (dt) {
        var v = this.v(), i; for (i = 0; i < this.tiles.length; i++) this.tiles[i].y += v * dt; this.lastY += v * dt;
        while (this.lastY > this.pt) {
          var y = this.lastY - this.tH, cc = ri(0, this.n); if (cc === this.lc) cc = (cc + ri(1, this.n)) % this.n; this.lc = cc;
          this.tiles.push({ c: cc, y: y, col: o.multi ? pickOf(["#ff4d6d", "#ffd23f", "#3ddc84", "#c77dff", "#ff9f1c", "#ff5fd2"]) : null });
          if (o.dbl && Math.random() < 0.3) this.tiles.push({ c: (cc + ri(1, this.n)) % this.n, y: y });
          this.lastY = y;
        }
        for (i = 0; i < this.tiles.length; i++) { var t = this.tiles[i]; if (!t.done && t.y + this.tH * 0.6 > this.H - this.pb) { t.done = true; t.miss = true; this.hurt(); } }
        var H = this.H; this.tiles = this.tiles.filter(function (q) { return q.y < H + 20; });
      },
      act: function (x) {
        var col = Math.floor((x - this.x0) / this.cw); if (col < 0 || col >= this.n) return; this.acts++;
        var best = null, i; for (i = 0; i < this.tiles.length; i++) { var t = this.tiles[i]; if (t.c === col && !t.done && t.y + this.tH > this.pt + 20 && (!best || t.y > best.y)) best = t; }
        if (best) { best.done = true; this.add(1); sfx([262, 330, 392, 523, 659][col % 5] * (o.hi ? 2 : 1), 0.18, "triangle", 0.08); } else this.hurt();
      },
      draw: function (now) {
        var c = this.ctx, i, x0 = this.x0, cw = this.cw, th = this.tH;
        fillR(c, x0, 0, cw * this.n, this.H, 0, o.bg || "rgba(255,255,255,0.92)");
        c.fillStyle = "rgba(0,0,0,0.12)"; for (i = 1; i < this.n; i++) c.fillRect(x0 + cw * i - 1, 0, 2, this.H);
        for (i = 0; i < this.tiles.length; i++) {
          var t = this.tiles[i], x = x0 + t.c * cw;
          if (t.done) { if (t.miss) fillR(c, x + 3, t.y + 3, cw - 6, th - 6, 10, "#ff4d6d"); else fillR(c, x + 3, t.y + 3, cw - 6, th - 6, 10, "rgba(0,0,0,0.08)"); continue; }
          fillR(c, x + 3, t.y + 3, cw - 6, th - 6, 10, t.col || o.tc || "#17121f"); fillR(c, x + cw * 0.3, t.y + th - 18, cw * 0.4, 6, 3, "rgba(255,255,255,0.35)");
        }
        var low = null; for (i = 0; i < this.tiles.length; i++) if (!this.tiles[i].done && (!low || this.tiles[i].y > low.y)) low = this.tiles[i];
        if (low) this.ghost(x0 + low.c * cw + cw / 2, low.y + th / 2, now);
      }
    });
    regD("pt_" + o.id, o.name, o.how, o.acc, C, o.scene || "arcade");
  }
  [
    { id: "base", name: "Teclas", how: "Tocá cada tecla negra antes de que llegue abajo. No toques donde no hay.", acc: "#17121f" },
    { id: "fast", name: "Teclas veloces", how: "Las teclas bajan rapidísimo.", v: 380, acc: "#ff4d6d" },
    { id: "three", name: "Tres teclas", how: "Tres columnas y mucha velocidad.", n: 3, v: 340, acc: "#ffd23f" },
    { id: "five", name: "Cinco teclas", how: "Cinco columnas angostas. Mirá bien.", n: 5, acc: "#c77dff" },
    { id: "dbl", name: "Teclas dobles", how: "A veces bajan dos juntas. Tocá las dos.", dbl: 1, acc: "#3ddc84" },
    { id: "acc", name: "Teclas sin freno", how: "Cada vez más rápido, sin parar.", ramp: 0.03, v: 200, acc: "#ff9f1c" },
    { id: "short", name: "Teclas cortitas", how: "Teclas chicas y muchas. Dedos rápidos.", tl: 0.14, v: 230, hi: 1, acc: "#ff5fd2" },
    { id: "neon", name: "Teclas de colores", how: "Teclas de todos los colores sobre fondo negro.", multi: 1, bg: "rgba(10,8,20,0.88)", acc: "#ff5fd2" },
    { id: "wave", name: "Teclas en ola", how: "La velocidad sube y baja como una ola.", wave: 1, v: 290, acc: "#3ddc84" },
    { id: "pro", name: "Teclas pro", how: "Cinco columnas, dobles y rápidas.", n: 5, dbl: 1, v: 330, acc: "#ff4d6d", scene: "space" }
  ].forEach(mkTiles);

  /* --- 12. Hockey de mesa: arrastrá tu paleta y hacé goles --- */
  function mkHockey(o) {
    var C = G("Hockey_" + o.id, {
      ctl: "drag",
      init: function () { var W = this.W; this.l = 12; this.r = W - 12; this.top = this.pt + 4; this.bot = this.H - this.pb - 4; this.gw = Math.min(W * (o.gw || 0.42), 230); this.mr = o.mr || 26; this.mx = W / 2; this.my = this.bot - 70; this.mvx = 0; this.ax = W / 2; this.ay = this.top + 64; this.pk = []; for (var k = 0; k < (o.np || 1); k++) this.serve(k); },
      serve: function (k) { var p = this.pk[k] || (this.pk[k] = {}), a = rnd(-0.5, 0.5), s = (o.v || 260) * 0.8; p.x = this.W / 2 + (k ? 50 : 0); p.y = (this.top + this.bot) / 2; p.vx = Math.sin(a) * s; p.vy = Math.cos(a) * s; p.r = 15; p.cd = 0; },
      drag: function (x) { var nx = clamp(x, this.l + this.mr, this.r - this.mr); this.mvx = (nx - this.mx) * 40; this.mx = nx; },
      hit: function (p, mx, my, mvx, me) {
        var dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy), R = p.r + this.mr; if (d >= R || d === 0) return;
        var nx = dx / d, ny = dy / d; p.x = mx + nx * R; p.y = my + ny * R; var vn = p.vx * nx + p.vy * ny; if (vn < 0) { p.vx -= 2 * vn * nx; p.vy -= 2 * vn * ny; }
        p.vx += mvx * 0.3; var sp = Math.hypot(p.vx, p.vy), base = o.v || 260, mxs = base * 2.2, mns = base * 1.05; if (sp > mxs) { p.vx *= mxs / sp; p.vy *= mxs / sp; } if (sp < mns) { p.vx *= mns / sp; p.vy *= mns / sp; }
        if (me) { if (p.vy > -150) p.vy = -Math.abs(p.vy) - 150; if (p.cd <= 0) { this.add(1); sfx(500, 0.06, "square", 0.05); } p.cd = 0.3; } else if (p.vy < 150) p.vy = Math.abs(p.vy) + 150;
      },
      step: function (dt) {
        var i, W = this.W, gl = W / 2 - this.gw / 2, gr = W / 2 + this.gw / 2; this.mvx *= 0.8;
        for (i = 0; i < this.pk.length; i++) {
          var p = this.pk[i]; p.cd -= dt; if (o.spin) p.vx += Math.sin(this.t * 3 + i) * 160 * dt;
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.x < this.l + p.r) { p.x = this.l + p.r; p.vx = Math.abs(p.vx); } if (p.x > this.r - p.r) { p.x = this.r - p.r; p.vx = -Math.abs(p.vx); }
          var inG = p.x > gl && p.x < gr;
          if (p.y < this.top + p.r) { if (inG) { this.good(3, p.x, p.y, true); this.serve(i); continue; } p.y = this.top + p.r; p.vy = Math.abs(p.vy); }
          if (p.y > this.bot - p.r) { if (inG) { this.hurt(); this.serve(i); continue; } p.y = this.bot - p.r; p.vy = -Math.abs(p.vy); }
          this.hit(p, this.mx, this.my, this.mvx, true); this.hit(p, this.ax, this.ay, 0, false);
        }
        var tg = this.pk[0]; for (i = 1; i < this.pk.length; i++) if (this.pk[i].y < tg.y) tg = this.pk[i];
        var want = tg.vy < 0 || tg.y < this.cy ? tg.x : W / 2, ai = (o.ai || 190) * dt; this.ax += clamp(want - this.ax, -ai, ai); this.ax = clamp(this.ax, this.l + this.mr, this.r - this.mr);
      },
      draw: function (now) {
        var c = this.ctx, W = this.W, i;
        fillR(c, this.l, this.top, this.r - this.l, this.bot - this.top, 20, o.rink || "#eef3fa");
        c.fillStyle = "rgba(255,77,109,0.5)"; c.fillRect(this.l, this.cy - 2, this.r - this.l, 4); c.strokeStyle = "rgba(255,77,109,0.5)"; c.lineWidth = 3; c.beginPath(); c.arc(W / 2, this.cy, 46, 0, TAU); c.stroke();
        fillR(c, W / 2 - this.gw / 2, this.top - 4, this.gw, 10, 4, "#17121f"); fillR(c, W / 2 - this.gw / 2, this.bot - 6, this.gw, 10, 4, "#17121f");
        for (i = 0; i < this.pk.length; i++) { dot(c, this.pk[i].x, this.pk[i].y, 15, "#17121f"); dot(c, this.pk[i].x, this.pk[i].y, 9, "#3a3a44"); }
        dot(c, this.ax, this.ay, this.mr, "#c77dff"); dot(c, this.ax, this.ay, this.mr * 0.45, "#8f4fd6");
        dot(c, this.mx, this.my, this.mr, "#ff4d6d"); dot(c, this.mx, this.my, this.mr * 0.45, "#c0304e");
        this.ghostDrag(this.my, now);
      }
    });
    regD("ah_" + o.id, o.name, o.how, o.acc, C, o.scene || "court");
  }
  [
    { id: "base", name: "Hockey de mesa", how: "Arrastrá tu paleta roja. Cada golpe suma y cada gol suma tres.", acc: "#ff4d6d" },
    { id: "fast", name: "Disco veloz", how: "El disco vuela. Reflejos rápidos.", v: 380, acc: "#ff9f1c" },
    { id: "wide", name: "Arcos gigantes", how: "Arcos enormes de los dos lados. Muchos goles.", gw: 0.62, acc: "#3ddc84" },
    { id: "hard", name: "Rival difícil", how: "La paleta violeta se mueve muy rápido.", ai: 320, acc: "#c77dff" },
    { id: "two", name: "Dos discos", how: "Dos discos al mismo tiempo. Cuidá tu arco.", np: 2, acc: "#ffd23f" },
    { id: "small", name: "Paleta chiquita", how: "Tu paleta es chica. Apuntá bien.", mr: 18, acc: "#ff5fd2" },
    { id: "ice", name: "Hockey sobre hielo", how: "Hielo de verdad: el disco no frena nunca.", v: 320, rink: "#dff4ff", acc: "#f2f2f2", scene: "snow" },
    { id: "easy", name: "Rival dormido", how: "El rival es lento. Hacé todos los goles que puedas.", ai: 110, acc: "#3ddc84" },
    { id: "spin", name: "Disco con efecto", how: "El disco dobla en el aire.", spin: 1, acc: "#ff9f1c" },
    { id: "mix", name: "Hockey loco", how: "Dos discos rápidos con efecto.", np: 2, v: 330, spin: 1, acc: "#ff4d6d", scene: "arcade" }
  ].forEach(mkHockey);

  /* --- 13. Arquero: arrastrá para atajar los tiros --- */
  function soccer(c, x, y, r) { dot(c, x, y, r, "#f2f2f2"); poly(c, [x, y - r * 0.35, x + r * 0.33, y - r * 0.1, x + r * 0.2, y + r * 0.3, x - r * 0.2, y + r * 0.3, x - r * 0.33, y - r * 0.1], "#17121f"); }
  function mkKeep(o) {
    var C = G("Keeper_" + o.id, {
      ctl: "drag",
      init: function () { this.gy = this.H - this.pb - 70; this.gw = Math.min(this.W - 40, o.gw || 300); this.g0 = (this.W - this.gw) / 2; this.kw = o.kw || 84; this.kx = this.W / 2; this.balls = []; this.next = 0.9; this.sx = this.W / 2; },
      drag: function (x) { this.kx = clamp(x, this.g0, this.g0 + this.gw); },
      shoot: function () { var tx = rnd(this.g0 + 12, this.g0 + this.gw - 12), sx = this.W / 2 + rnd(-90, 90), b = { sx: sx, sy: this.pt + 60, tx: tx, t: 0, T: (o.T || 1.0) * rnd(0.85, 1.15), cv: o.curve ? rnd(-1, 1) * o.curve : 0 }; this.sx = sx; if (o.defl && Math.random() < 0.55) { b.def = true; b.tx2 = clamp(tx + (Math.random() < 0.5 ? -1 : 1) * rnd(80, 140), this.g0 + 12, this.g0 + this.gw - 12); } this.balls.push(b); sfx(160, 0.12, "sine", 0.08, 0.6); },
      pos: function (b, t) { var k = Math.min(1, t / b.T), tx = b.def && k > 0.5 ? b.tx + (b.tx2 - b.tx) * Math.min(1, (k - 0.5) / 0.3) : b.tx, x = b.sx + (tx - b.sx) * k + Math.sin(k * PI) * b.cv * 110, y = b.sy + (this.gy - b.sy) * k; if (o.lob) y -= Math.sin(k * PI) * 150; return { x: x, y: y, r: 7 + 10 * k }; },
      step: function (dt) {
        var i; this.next -= dt; if (this.next <= 0) { var n = o.multi ? ri(1, o.multi + 1) : 1; for (i = 0; i < n; i++) this.shoot(); this.next = (o.iv || 1.4) * Math.max(0.55, 1 - this.t * 0.006); }
        for (i = 0; i < this.balls.length; i++) { var b = this.balls[i]; b.t += dt; if (b.t >= b.T && !b.done) { b.done = true; var p = this.pos(b, b.T); if (Math.abs(p.x - this.kx) < this.kw / 2 + p.r) this.good(1, p.x, p.y); else this.hurt(); } }
        this.balls = this.balls.filter(function (q) { return !q.done; });
      },
      draw: function (now) {
        var c = this.ctx, i, g0 = this.g0, gw = this.gw, gy = this.gy;
        c.fillStyle = "rgba(255,255,255,0.18)"; c.fillRect(g0, gy - 70, gw, 90); c.strokeStyle = "rgba(255,255,255,0.35)"; c.lineWidth = 1; for (i = 1; i < 10; i++) { c.beginPath(); c.moveTo(g0 + gw * i / 10, gy - 70); c.lineTo(g0 + gw * i / 10, gy + 20); c.stroke(); }
        c.fillStyle = "#f2f2f2"; c.fillRect(g0 - 7, gy - 74, 7, 100); c.fillRect(g0 + gw, gy - 74, 7, 100); c.fillRect(g0 - 7, gy - 74, gw + 14, 7);
        buddy(c, this.sx, this.pt + 40, 15, o.rc || "#3ddc84");
        var bs = this.balls.slice().sort(function (a, b) { return a.t / a.T - b.t / b.T; });
        var kx = this.kx, kw = this.kw; c.globalAlpha = this.fadeA(); fillR(c, kx - kw / 2, gy - 30, kw, 26, 10, o.kc || "#ffd23f"); dot(c, kx - kw / 2, gy - 22, 9, "#f2f2f2"); dot(c, kx + kw / 2, gy - 22, 9, "#f2f2f2"); buddy(c, kx, gy - 42, 13, "#f2b48a"); c.globalAlpha = 1;
        for (i = 0; i < bs.length; i++) { var p = this.pos(bs[i], bs[i].t); soccer(c, p.x, p.y, p.r); }
        this.ghostDrag(gy - 20, now);
      }
    });
    regD("gk_" + o.id, o.name, o.how, o.acc, C, o.scene || "court");
  }
  [
    { id: "base", name: "Arquero", how: "Arrastrá al arquero a los costados y atajá cada pelota.", acc: "#ffd23f" },
    { id: "fast", name: "Tiros fuertes", how: "Pelotazos muy rápidos. Atajalos igual.", T: 0.7, acc: "#ff4d6d" },
    { id: "curve", name: "Tiros con comba", how: "La pelota dobla en el aire.", curve: 1, acc: "#c77dff" },
    { id: "rush", name: "Tiros seguidos", how: "Pelotas sin descanso, una atrás de otra.", iv: 0.75, acc: "#ff9f1c" },
    { id: "small", name: "Arquero petiso", how: "El arquero es chico y el arco grande.", kw: 60, acc: "#3ddc84" },
    { id: "wide", name: "Arco gigante", how: "Un arco enorme. Corré de palo a palo.", gw: 380, acc: "#ff5fd2" },
    { id: "defl", name: "Rebote engañoso", how: "Algunas pelotas se desvían a mitad de camino.", defl: 1, acc: "#ff4d6d" },
    { id: "rain", name: "Lluvia de pelotas", how: "Vienen de a dos o tres juntas, más lentas.", multi: 3, T: 1.3, iv: 1.8, acc: "#ffd23f", scene: "storm" },
    { id: "lob", name: "Globitos", how: "Tiros por arriba que caen de golpe.", lob: 1, T: 1.2, acc: "#3ddc84" },
    { id: "mix", name: "Penales locos", how: "Comba, desvíos y tiros rápidos.", curve: 0.8, defl: 1, T: 0.85, acc: "#ff9f1c", scene: "arcade" }
  ].forEach(mkKeep);

  /* --- 14. Escudo: arrastrá para girar el escudo y proteger el planeta --- */
  function mkShield(o) {
    var C = G("Shield_" + o.id, {
      ctl: "drag",
      init: function () { this.px = this.W / 2; this.py = this.cy; this.Rp = 34; this.Rs = o.Rs || 76; this.ang = -PI / 2; this.lx = null; this.ms = []; this.next = 0.9; this.D = Math.hypot(this.W, this.H) * 0.55; },
      drag: function (x) { if (this.lx !== null) this.ang += (x - this.lx) * 0.024; this.lx = x; },
      release: function () { this.lx = null; },
      cov: function (a) { var arc = o.arc || 1.35; return adiff(a, this.ang) < arc / 2 || (o.two && adiff(a, this.ang + PI) < arc / 2); },
      step: function (dt) {
        var i; this.next -= dt;
        if (this.next <= 0) { var n = o.burst ? ri(2, 4) : 1, a0 = rnd(0, TAU); for (i = 0; i < n; i++) this.ms.push({ a: o.burst ? a0 + i * rnd(0.5, 0.9) : rnd(0, TAU), d: this.D, v: (o.v || 140) * (1 + Math.min(this.t, 60) * 0.012) * rnd(0.85, 1.2), w: o.spin ? rnd(-0.9, 0.9) : 0, r: o.small ? 8 : rnd(10, 15), k: ri(1, 99) }); this.next = (o.iv || 1.0) * (o.burst ? 2.1 : 1) * Math.max(0.45, 1 - this.t * 0.008); }
        for (i = 0; i < this.ms.length; i++) { var m = this.ms[i]; m.d -= m.v * dt; m.a += m.w * dt; if (!m.dead && m.d <= this.Rs + m.r && m.d > this.Rs - 8 && this.cov(m.a)) { m.dead = true; this.add(1); } if (!m.dead && m.d <= this.Rp + m.r) { m.dead = true; this.hurt(); } }
        this.ms = this.ms.filter(function (q) { return !q.dead; });
      },
      draw: function (now) {
        var c = this.ctx, i, arc = o.arc || 1.35;
        c.strokeStyle = "rgba(255,255,255,0.12)"; c.lineWidth = 2; c.beginPath(); c.arc(this.px, this.py, this.Rs, 0, TAU); c.stroke();
        buddy(c, this.px, this.py, this.Rp, o.pc || "#3ddc84");
        c.strokeStyle = o.sc || "#f2f2f2"; c.lineWidth = 10; c.lineCap = "round"; c.beginPath(); c.arc(this.px, this.py, this.Rs, this.ang - arc / 2, this.ang + arc / 2); c.stroke();
        if (o.two) { c.beginPath(); c.arc(this.px, this.py, this.Rs, this.ang + PI - arc / 2, this.ang + PI + arc / 2); c.stroke(); } c.lineCap = "butt";
        for (i = 0; i < this.ms.length; i++) { var m = this.ms[i], x = this.px + Math.cos(m.a) * m.d, y = this.py + Math.sin(m.a) * m.d; if (o.fire) spFire(c, x, y + m.r * 0.4, m.r * 0.8); else spRock(c, x, y, m.r, "#8a8a8a", m.k); }
        this.ghostDrag(this.H - this.pb - 50, now);
      }
    });
    regD("sh_" + o.id, o.name, o.how, o.acc, C, o.scene || "space");
  }
  [
    { id: "base", name: "Escudo", how: "Arrastrá a los costados para girar el escudo. Que ninguna roca toque el planeta.", acc: "#3ddc84" },
    { id: "two", name: "Doble escudo", how: "Dos escudos, uno de cada lado, más chicos.", two: 1, arc: 1.0, acc: "#c77dff" },
    { id: "fast", name: "Rocas veloces", how: "Las rocas llegan muy rápido.", v: 220, acc: "#ff4d6d" },
    { id: "spin", name: "Rocas en espiral", how: "Las rocas giran mientras se acercan.", spin: 1, acc: "#ffd23f" },
    { id: "small", name: "Escudo chico", how: "El escudo es cortito. Movete rápido.", arc: 0.9, acc: "#ff9f1c" },
    { id: "swarm", name: "Enjambre de rocas", how: "Muchas rocas chiquitas y seguidas.", small: 1, iv: 0.5, v: 120, acc: "#ff5fd2" },
    { id: "wave", name: "Oleadas", how: "Las rocas vienen en grupos.", burst: 1, acc: "#3ddc84" },
    { id: "sun", name: "Lluvia de fuego", how: "Bolas de fuego contra tu planeta.", fire: 1, pc: "#3ddc84", sc: "#ffd23f", acc: "#ff9f1c", scene: "volcano" },
    { id: "big", name: "Escudo gigante", how: "Un escudo enorme, pero todo es muy rápido.", arc: 2.2, v: 280, iv: 0.6, acc: "#f2f2f2" },
    { id: "mix", name: "Escudo loco", how: "Oleadas en espiral contra doble escudo.", two: 1, arc: 1.0, spin: 1, burst: 1, acc: "#ff4d6d", scene: "storm" }
  ].forEach(mkShield);

  /* --- 15. Paredes: tocá para saltar de una pared a la otra --- */
  function mkWall(o) {
    var C = G("Wall_" + o.id, {
      init: function () { this.s = -1; this.j = 0; this.py = this.H - this.pb - 170; this.obs = []; this.next = 200; this.off = 0; this.ww = 22; },
      xs: function (s) { return s < 0 ? this.ww + 16 : this.W - this.ww - 16; },
      act: function () { if (this.j > 0) return; this.j = 0.001; this.acts++; sfx(560, 0.06, "triangle", 0.05, 1.5); },
      v: function () { return (o.v || 230) * (1 + Math.min(this.t, 60) * (o.ramp || 0.01)); },
      px: function () { if (this.j <= 0) return this.xs(this.s); var k = Math.min(1, this.j / (o.jt || 0.24)); return this.xs(this.s) + (this.xs(-this.s) - this.xs(this.s)) * k; },
      step: function (dt) {
        var v = this.v(), i, jt = o.jt || 0.24; this.off = (this.off + v * dt) % 40;
        if (this.j > 0) { this.j += dt; if (this.j >= jt) { this.j = 0; this.s = -this.s; } }
        this.next -= v * dt;
        if (this.next <= 0) {
          var side = Math.random() < 0.5 ? -1 : 1, L = o.long ? rnd(90, 130) : rnd(44, 70); this.obs.push({ spk: true, s: side, y: this.pt - L, L: L });
          if (o.mid && Math.random() < 0.45) this.obs.push({ mid: true, x: this.W / 2, y: this.pt - L - 60, ph: rnd(0, TAU) });
          if (o.gems && Math.random() < 0.7) this.obs.push({ gem: true, s: -side, y: this.pt - L / 2 });
          this.next = (o.gap || 190) * rnd(0.8, 1.3);
        }
        var x = this.px(), y = this.py, onWall = this.j === 0;
        for (i = 0; i < this.obs.length; i++) {
          var b = this.obs[i]; b.y += v * dt; if (b.mid) b.x = this.W / 2 + Math.sin(this.t * 2.2 + b.ph) * 60;
          if (b.dead) continue;
          if (b.gem && Math.abs(b.y - y) < 26 && Math.abs(this.xs(b.s) - x) < 26) { b.dead = true; this.good(1, x, y); }
          if (b.spk && onWall && b.s === this.s && y > b.y - 14 && y < b.y + b.L + 14) { b.dead = true; this.hurt(); }
          if (b.mid && Math.hypot(b.x - x, b.y - y) < 30) { b.dead = true; this.hurt(); }
          if (b.spk && !b.cnt && b.y > y + 30) { b.cnt = true; this.add(1); }
        }
        var H = this.H; this.obs = this.obs.filter(function (q) { return q.y < H + 140 && !(q.dead && !q.spk); });
      },
      draw: function (now) {
        var c = this.ctx, i, W = this.W, ww = this.ww, y;
        c.fillStyle = o.wc || "#55555f"; c.fillRect(0, 0, ww, this.H); c.fillRect(W - ww, 0, ww, this.H);
        c.fillStyle = "rgba(0,0,0,0.25)"; for (y = -40 + this.off; y < this.H; y += 40) { c.fillRect(0, y, ww, 3); c.fillRect(W - ww, y, ww, 3); }
        for (i = 0; i < this.obs.length; i++) {
          var b = this.obs[i];
          if (b.spk) { for (y = b.y; y < b.y + b.L; y += 16) { if (o.fire) spFire(c, b.s < 0 ? ww + 8 : W - ww - 8, y + 12, 7); else if (b.s < 0) poly(c, [ww, y, ww + 18, y + 8, ww, y + 16], "#d9dde3"); else poly(c, [W - ww, y, W - ww - 18, y + 8, W - ww, y + 16], "#d9dde3"); } }
          else if (b.mid && !b.dead) spBug(c, b.x, b.y, 14, "#ff4d6d");
          else if (b.gem && !b.dead) gem(c, this.xs(b.s), b.y, 11, "#ff5fd2");
        }
        c.globalAlpha = this.fadeA(); buddy(c, this.px(), this.py, 15, o.col || "#ffd23f", -this.s); c.globalAlpha = 1;
        this.ghost(W / 2, this.py - 40, now);
      }
    });
    regD("wj_" + o.id, o.name, o.how, o.acc, C, o.scene || "cave");
  }
  [
    { id: "base", name: "Paredes", how: "Tocá para saltar a la otra pared. No caigas sobre los pinchos.", acc: "#ffd23f" },
    { id: "fast", name: "Paredes veloces", how: "Subís muy rápido. Saltá a tiempo.", v: 330, acc: "#ff4d6d" },
    { id: "mid", name: "Bichos en el medio", how: "Hay bichos volando en el medio. Saltá cuando no estén.", mid: 1, acc: "#3ddc84", scene: "garden" },
    { id: "gem", name: "Paredes con gemas", how: "Juntá las gemas de las paredes.", gems: 1, acc: "#ff5fd2" },
    { id: "long", name: "Pinchos largos", how: "Tiras de pinchos larguísimas.", long: 1, gap: 230, acc: "#c77dff" },
    { id: "dense", name: "Muchos pinchos", how: "Pinchos uno atrás de otro.", gap: 130, acc: "#ff9f1c" },
    { id: "ice", name: "Paredes de hielo", how: "Cada vez más rápido por las paredes de hielo.", ramp: 0.025, wc: "#bfe3f2", col: "#ff9f1c", acc: "#f2f2f2", scene: "snow" },
    { id: "lava", name: "Paredes de fuego", how: "Las paredes tienen fuego en vez de pinchos.", fire: 1, wc: "#4a1f14", acc: "#ff9f1c", scene: "volcano" },
    { id: "slow", name: "Salto pesado", how: "El salto es lento. Calculá antes.", jt: 0.42, v: 200, acc: "#f2f2f2" },
    { id: "mix", name: "Paredes locas", how: "Rápido, con bichos y gemas.", mid: 1, gems: 1, v: 290, acc: "#ff4d6d", scene: "build" }
  ].forEach(mkWall);

  /* --- 16. Pila de comida: arrastrá el plato y apilá lo que cae --- */
  function mkPile(o) {
    var C = G("Pile_" + o.id, {
      ctl: "drag",
      init: function () { this.px = this.W / 2; this.py = this.H - this.pb - 40; this.st = []; this.it = []; this.next = 0.6; this.iw = o.iw || 76; },
      drag: function (x) { this.px = clamp(x, 40, this.W - 40); },
      topX: function () { return this.st.length ? this.px + this.st[this.st.length - 1].dx : this.px; },
      topY: function () { var y = this.py; for (var i = 0; i < this.st.length; i++) y -= this.st[i].h; return y; },
      step: function (dt) {
        var i; this.next -= dt;
        if (this.next <= 0) { var bad = o.bad && Math.random() < o.bad, pc = pickOf(o.pcs); this.it.push({ x: rnd(40, this.W - 40), y: this.pt - 20, v: (o.v || 190) * rnd(0.9, 1.15) * (1 + Math.min(this.t, 60) * 0.01), bad: bad, col: pc[0], h: pc[1], vx: o.wind ? rnd(-1, 1) * o.wind : 0 }); this.next = (o.iv || 1.05) * Math.max(0.6, 1 - this.t * 0.006); }
        var ty = this.topY(), tx = this.topX();
        for (i = 0; i < this.it.length; i++) {
          var it = this.it[i]; it.y += it.v * dt; it.x += it.vx * dt; if (it.x < 30 || it.x > this.W - 30) it.vx = -it.vx;
          if (!it.miss && it.y + it.h / 2 >= ty) {
            if (Math.abs(it.x - tx) < this.iw * 0.75) { it.dead = true; if (it.bad) this.hurt(); else { this.st.push({ dx: it.x - this.px, h: it.h, col: it.col }); this.add(1); if (this.st.length >= (o.full || 8)) { this.good(3, tx, ty, true); this.st = []; } else if (Math.abs(it.x - this.px) > this.iw * 1.1) { this.st = []; this.hurt(); } } ty = this.topY(); tx = this.topX(); }
            else it.miss = true;
          }
          if (!it.dead && it.y > this.H + 30) { it.dead = true; if (!it.bad) this.hurt(); }
        }
        this.it = this.it.filter(function (q) { return !q.dead; });
      },
      piece: function (c, x, y, h, col, bad) {
        var w = this.iw; if (bad) { spBomb(c, x, y, 14); return; }
        if (o.crate) { spCrate(c, x - w / 2, y - h / 2, w, h); return; }
        if (o.scoop) { dot(c, x, y, h * 0.62, col); dot(c, x - h * 0.2, y - h * 0.2, h * 0.14, "rgba(255,255,255,0.35)"); return; }
        fillR(c, x - w / 2, y - h / 2, w, h, Math.min(h / 2, 9), col); c.fillStyle = "rgba(255,255,255,0.22)"; c.fillRect(x - w / 2 + 8, y - h / 2 + 2, w - 16, 2);
        if (col === "#d99a55") for (var k = 0; k < 5; k++) dot(c, x - w / 3 + k * w / 6, y - h * 0.15, 1.8, "#fff6e6");
      },
      draw: function (now) {
        var c = this.ctx, i, y = this.py;
        c.fillStyle = o.plate || "#e9e4d7"; c.beginPath(); c.ellipse(this.px, this.py + 6, this.iw * 0.75, 9, 0, 0, TAU); c.fill();
        for (i = 0; i < this.st.length; i++) { var s = this.st[i]; this.piece(c, this.px + s.dx, y - s.h / 2, s.h, s.col, false); y -= s.h; }
        for (i = 0; i < this.it.length; i++) this.piece(c, this.it[i].x, this.it[i].y, this.it[i].h, this.it[i].col, this.it[i].bad);
        var full = o.full || 8; for (i = 0; i < full; i++) dot(c, 16, this.H - this.pb - 20 - i * 14, 4, i < this.st.length ? "#ffd23f" : "rgba(255,255,255,0.25)");
        this.ghostDrag(this.py, now);
      }
    });
    regD("bg_" + o.id, o.name, o.how, o.acc, C, o.scene || "kitchen");
  }
  var BURG = [["#d99a55", 14], ["#6b3b1a", 12], ["#3ddc84", 6], ["#ffd23f", 6], ["#ff4d6d", 7]];
  [
    { id: "burger", name: "Hamburguesa", how: "Arrastrá el plato y atajá cada ingrediente. Con ocho armás la hamburguesa.", pcs: BURG, acc: "#d99a55" },
    { id: "pan", name: "Panqueques", how: "Apilá los panqueques. Si se te cae uno, perdés una vida.", pcs: [["#e0a458", 10], ["#d18f45", 10], ["#ffd23f", 5]], full: 10, acc: "#ffd23f" },
    { id: "cake", name: "Torta alta", how: "Juntá los pisos de la torta sin que se caigan.", pcs: [["#ff8fa3", 16], ["#6b3b1a", 16], ["#fff6e6", 14]], iw: 90, acc: "#ff8fa3" },
    { id: "ice", name: "Helado de bochas", how: "Atajá las bochas de helado arriba del cucurucho.", pcs: [["#ff8fa3", 24], ["#fff6e6", 24], ["#6b3b1a", 24], ["#3ddc84", 24]], scoop: 1, iw: 54, plate: "#d99a55", acc: "#ff8fa3", scene: "beach" },
    { id: "book", name: "Pila de libros", how: "Apilá los libros que caen. Ojo que se tuercen.", pcs: [["#ff4d6d", 14], ["#ffd23f", 14], ["#3ddc84", 14], ["#c77dff", 14]], iw: 92, acc: "#c77dff", scene: "build" },
    { id: "box", name: "Mudanza", how: "Atajá las cajas una arriba de la otra.", pcs: [["#c98a4a", 30]], crate: 1, iw: 70, full: 6, acc: "#c98a4a", scene: "city" },
    { id: "fast", name: "Hamburguesa rápida", how: "Los ingredientes caen rápido.", pcs: BURG, v: 290, iv: 0.8, acc: "#ff4d6d" },
    { id: "bad", name: "Cuidado con las bombas", how: "Entre los ingredientes caen bombas. Esquivalas.", pcs: BURG, bad: 0.25, acc: "#2b2b33" },
    { id: "wind", name: "Ingredientes con viento", how: "El viento los mueve de costado.", pcs: BURG, wind: 70, acc: "#3ddc84", scene: "storm" },
    { id: "tall", name: "Torre de comida", how: "Catorce pisos para terminar. ¿Llegás?", pcs: BURG.concat([["#e0a458", 10]]), full: 14, acc: "#ff9f1c" }
  ].forEach(mkPile);

  /* --- 17. Bomberos: arrastrá y mantené para apagar el fuego --- */
  function mkFire(o) {
    var C = G("Fire_" + o.id, {
      ctl: "drag",
      init: function () { this.cols = o.cols || 4; this.rows = o.rows || 4; this.bx = 18; this.bw = this.W - 36 - 44; this.by = this.pt + 20; this.bh = (this.H - this.pt - this.pb) * 0.55; this.win = []; for (var r = 0; r < this.rows; r++) for (var k = 0; k < this.cols; k++) this.win.push({ r: r, c: k, f: 0, on: false }); this.next = 0.4; this.fx = this.W / 2; this.fy = this.H - this.pb - 46; this.deb = []; this.dn = 2; },
      drag: function (x) { this.fx = clamp(x, 24, this.W - 24); },
      wx: function (w) { var cw = this.bw / this.cols; return this.bx + w.c * cw + cw / 2; },
      wy: function (w) { var rh = this.bh / this.rows; return this.by + w.r * rh + rh / 2; },
      step: function (dt) {
        var i; this.next -= dt;
        if (this.next <= 0) { var off = this.win.filter(function (q) { return !q.on; }); if (off.length) { var w = pickOf(off); w.on = true; w.f = 0.15; } this.next = (o.iv || 1.5) * Math.max(0.5, 1 - this.t * 0.01); }
        for (i = 0; i < this.win.length; i++) { var q = this.win[i]; if (!q.on) continue; q.f += (o.gr || 0.11) * dt; if (q.f >= 1) { this.hurt(); q.f = 0.45; } }
        this.sx = this.fx + (o.wind ? Math.sin(this.t * 0.7) * o.wind : 0); this.hitY = this.by - 10;
        if (this.holding) {
          var cw = this.bw / this.cols, col = Math.floor((this.sx - this.bx) / cw), best = null;
          if (col >= 0 && col < this.cols) for (i = 0; i < this.win.length; i++) { var w2 = this.win[i]; if (w2.c === col && w2.on && (!best || w2.r > best.r)) best = w2; }
          if (best) { this.hitY = this.wy(best); best.f -= (o.ext || 0.9) * dt; if (best.f <= 0) { best.on = false; best.f = 0; this.good(1, this.wx(best), this.wy(best)); } }
        }
        if (o.deb) { this.dn -= dt; if (this.dn <= 0) { this.deb.push({ x: rnd(30, this.W - 30), y: this.by + this.bh, v: 0 }); this.dn = rnd(1.2, 2.4); } for (i = 0; i < this.deb.length; i++) { var d = this.deb[i]; d.v += 900 * dt; d.y += d.v * dt; if (!d.dead && Math.abs(d.x - this.fx) < 26 && Math.abs(d.y - this.fy) < 24) { d.dead = true; this.hurt(); } } var H = this.H; this.deb = this.deb.filter(function (q) { return !q.dead && q.y < H; }); }
      },
      draw: function (now) {
        var c = this.ctx, i, cw = this.bw / this.cols, rh = this.bh / this.rows;
        if (o.tree) { for (i = 0; i < this.win.length; i++) { var t = this.win[i]; tree(c, this.wx(t), this.wy(t), Math.min(cw, rh) * 0.8); } }
        else { fillR(c, this.bx, this.by, this.bw, this.H - this.by, 6, o.bc || "#8a4a3a"); for (i = 0; i < this.win.length; i++) { var q = this.win[i]; fillR(c, this.bx + q.c * cw + cw * 0.18, this.by + q.r * rh + rh * 0.18, cw * 0.64, rh * 0.64, 4, q.on ? "#3a1a10" : (o.night ? "#ffd23f" : "#2b2b33")); } }
        for (i = 0; i < this.win.length; i++) { var w = this.win[i]; if (w.on) spFire(c, this.wx(w), this.wy(w) + rh * 0.2, 5 + 12 * w.f); }
        for (i = 0; i < this.deb.length; i++) spBrick(c, this.deb[i].x - 14, this.deb[i].y - 8, 28, 16, "#c0573e");
        if (this.holding) { c.strokeStyle = "#7fe3e0"; c.lineWidth = 7; c.lineCap = "round"; c.beginPath(); c.moveTo(this.fx, this.fy - 16); c.lineTo(this.sx, this.hitY); c.stroke(); c.lineCap = "butt"; }
        c.globalAlpha = this.fadeA(); buddy(c, this.fx, this.fy, 15, "#f2b48a"); fillR(c, this.fx - 17, this.fy - 22, 34, 9, 4, "#ff4d6d"); c.globalAlpha = 1;
        this.ghostDrag(this.fy, now);
      }
    });
    regD("fh_" + o.id, o.name, o.how, o.acc, C, o.scene || "city");
  }
  [
    { id: "base", name: "Bomberos", how: "Arrastrá al bombero debajo del fuego. Mientras apretás, tira agua.", acc: "#ff4d6d" },
    { id: "big", name: "Edificio grande", how: "Cinco pisos y cinco ventanas por piso.", cols: 5, rows: 5, iv: 1.2, acc: "#ff9f1c" },
    { id: "fast", name: "Incendio veloz", how: "El fuego crece rapidísimo.", gr: 0.2, acc: "#ff4d6d" },
    { id: "wind", name: "Agua con viento", how: "El viento tuerce el chorro de agua.", wind: 50, acc: "#3ddc84", scene: "storm" },
    { id: "deb", name: "Caen ladrillos", how: "Apagá el fuego y esquivá los ladrillos que caen.", deb: 1, acc: "#ffd23f" },
    { id: "tree", name: "Incendio en el bosque", how: "Apagá los árboles que se prenden fuego.", tree: 1, acc: "#3ddc84", scene: "forest" },
    { id: "weak", name: "Manguera chica", how: "Tirás poca agua. Quedate quieto debajo del fuego.", ext: 0.5, gr: 0.08, acc: "#ff9f1c" },
    { id: "many", name: "Fuegos por todos lados", how: "Aparecen fuegos muy seguido.", iv: 0.8, gr: 0.08, acc: "#ff5fd2" },
    { id: "night", name: "Noche de fuego", how: "De noche las ventanas están prendidas. Apagá el fuego.", night: 1, bc: "#3a3a44", acc: "#ffd23f" },
    { id: "mix", name: "Bomberos locos", how: "Viento, ladrillos y fuego rápido.", wind: 40, deb: 1, gr: 0.15, acc: "#ff4d6d", scene: "volcano" }
  ].forEach(mkFire);

  /* --- 18. Cama elástica: arrastrá la cama para que reboten hasta la ambulancia --- */
  function mkTramp(o) {
    var C = G("Tramp_" + o.id, {
      ctl: "drag",
      init: function () { this.tw = o.tw || 96; this.tx = this.W / 2; this.ty = this.H - this.pb - 50; this.ps = []; this.next = 0.4; },
      drag: function (x) { this.tx = clamp(x, this.tw / 2, this.W - this.tw / 2); },
      step: function (dt) {
        var i, g = o.g || 520; this.next -= dt;
        if (this.next <= 0) { this.ps.push({ x: 40, y: this.pt + 70, vx: (o.vx || 80) * rnd(0.85, 1.2) * (o.mix ? rnd(0.7, 1.5) : 1), vy: -60, col: pickOf(["#ff4d6d", "#ffd23f", "#3ddc84", "#c77dff", "#ff9f1c", "#ff5fd2"]) }); this.next = (o.iv || 2.4) * Math.max(0.5, 1 - this.t * 0.008); }
        for (i = 0; i < this.ps.length; i++) {
          var p = this.ps[i], py = p.y; p.vy += g * dt; if (o.wind) p.vx += Math.sin(this.t * 0.7) * o.wind * dt; p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.vy > 0 && py < this.ty - 10 && p.y >= this.ty - 10 && Math.abs(p.x - this.tx) < this.tw / 2 + 8) { p.y = this.ty - 10; p.vy = -Math.sqrt(2 * g * Math.max(120, this.ty - 10 - (this.pt + 90))); this.add(1); sfx(420, 0.1, "sine", 0.06, 1.8); }
          if (p.y > this.H - this.pb + 10) { p.dead = true; this.hurt(); }
          else if (p.x > this.W - 34) { p.dead = true; this.good(2, p.x, p.y, true); }
          else if (p.x < 10) p.vx = Math.abs(p.vx);
        }
        this.ps = this.ps.filter(function (q) { return !q.dead; });
      },
      draw: function (now) {
        var c = this.ctx, i;
        fillR(c, -6, this.pt + 80, 40, this.H, 4, "#8a4a3a"); fillR(c, 6, this.pt + 100, 16, 20, 3, "#2b2b33");
        fillR(c, this.W - 34, this.H - this.pb - 70, 40, 60, 6, "#f2f2f2"); c.fillStyle = "#ff4d6d"; c.fillRect(this.W - 20, this.H - this.pb - 52, 12, 4); c.fillRect(this.W - 16, this.H - this.pb - 56, 4, 12);
        for (i = 0; i < this.ps.length; i++) { var p = this.ps[i]; if (o.ball) spBeach(c, p.x, p.y, 13); else buddy(c, p.x, p.y, 12, p.col, 1); }
        c.fillStyle = "#55555f"; c.fillRect(this.tx - this.tw / 2 + 6, this.ty, 5, 22); c.fillRect(this.tx + this.tw / 2 - 11, this.ty, 5, 22);
        fillR(c, this.tx - this.tw / 2, this.ty - 4, this.tw, 9, 4, o.tc || "#ff4d6d");
        this.ghostDrag(this.ty + 10, now);
      }
    });
    regD("tr_" + o.id, o.name, o.how, o.acc, C, o.scene || "city");
  }
  [
    { id: "base", name: "Cama elástica", how: "Arrastrá la cama para que cada uno rebote hasta la ambulancia.", acc: "#ff4d6d" },
    { id: "many", name: "Mucha gente", how: "Saltan muchos seguidos. Que no caiga ninguno.", iv: 1.4, acc: "#ffd23f" },
    { id: "fast", name: "Saltos largos", how: "Saltan más rápido hacia la derecha.", vx: 120, acc: "#ff9f1c" },
    { id: "small", name: "Cama chiquita", how: "La cama es cortita. Movete bien.", tw: 62, acc: "#c77dff" },
    { id: "ball", name: "Pelotas rebotonas", how: "Hacé rebotar las pelotas hasta la otra punta.", ball: 1, acc: "#ff5fd2", scene: "beach" },
    { id: "wind", name: "Rebotes con viento", how: "El viento los empuja para atrás y para adelante.", wind: 40, acc: "#3ddc84", scene: "storm" },
    { id: "heavy", name: "Saltos pesados", how: "Caen rápido. Llegá a tiempo.", g: 800, vx: 100, acc: "#ff4d6d" },
    { id: "moon", name: "Rebotes lunares", how: "En la luna caen despacito.", g: 280, vx: 60, acc: "#c77dff", scene: "moon" },
    { id: "mix", name: "Lluvia de saltarines", how: "Cada uno salta a su velocidad.", mix: 1, iv: 1.6, acc: "#3ddc84" },
    { id: "circus", name: "Circo", how: "Los acróbatas saltan del trampolín al otro lado.", tc: "#ffd23f", iv: 1.8, acc: "#ffd23f", scene: "circus" }
  ].forEach(mkTramp);

  /* --- 19. Torreta: la torreta gira sola, tocá para disparar --- */
  function mkTurret(o) {
    var C = G("Turret_" + o.id, {
      init: function () { this.x = this.W / 2; this.y = this.cy; this.a = 0; this.dir = 1; this.bs = []; this.es = []; this.next = 0.8; this.D = Math.hypot(this.W, this.H) * 0.55; },
      act: function () { var n = o.tri ? 3 : 1, k; for (k = 0; k < n; k++) { var a = this.a + (k - (n - 1) / 2) * 0.22; this.bs.push({ x: this.x + Math.cos(a) * 30, y: this.y + Math.sin(a) * 30, vx: Math.cos(a) * 660, vy: Math.sin(a) * 660 }); } if (o.rev) this.dir = -this.dir; this.acts++; sfx(720, 0.05, "square", 0.04, 0.6); },
      step: function (dt) {
        var i, k; this.a += this.dir * (o.rs || 2.4) * dt; this.next -= dt;
        if (this.next <= 0) { this.es.push({ a: rnd(0, TAU), d: this.D, v: (o.v || 70) * (1 + Math.min(this.t, 60) * 0.015) * rnd(0.85, 1.2), hp: o.hp || 1, r: o.small ? 11 : 17, k: ri(1, 99) }); this.next = (o.iv || 1.1) * Math.max(0.4, 1 - this.t * 0.008); }
        for (i = 0; i < this.bs.length; i++) { var b = this.bs[i]; b.x += b.vx * dt; b.y += b.vy * dt; }
        for (i = 0; i < this.es.length; i++) {
          var e = this.es[i]; e.d -= e.v * dt; var ex = this.x + Math.cos(e.a) * e.d, ey = this.y + Math.sin(e.a) * e.d;
          for (k = 0; k < this.bs.length; k++) { var q = this.bs[k]; if (!q.dead && Math.hypot(q.x - ex, q.y - ey) < e.r + 6) { q.dead = true; e.hp--; if (e.hp <= 0) { e.dead = true; this.add(1); break; } } }
          if (!e.dead && e.d < 28 + e.r) { e.dead = true; this.hurt(); }
        }
        var W = this.W, H = this.H; this.bs = this.bs.filter(function (q) { return !q.dead && q.x > -20 && q.x < W + 20 && q.y > -20 && q.y < H + 20; }); this.es = this.es.filter(function (q) { return !q.dead; });
      },
      draw: function (now) {
        var c = this.ctx, i;
        c.strokeStyle = "rgba(255,255,255,0.14)"; c.lineWidth = 2; c.setLineDash([6, 8]); c.beginPath(); c.moveTo(this.x, this.y); c.lineTo(this.x + Math.cos(this.a) * 220, this.y + Math.sin(this.a) * 220); c.stroke(); c.setLineDash([]);
        for (i = 0; i < this.es.length; i++) { var e = this.es[i], ex = this.x + Math.cos(e.a) * e.d, ey = this.y + Math.sin(e.a) * e.d; if (o.skin === "bug") spBug(c, ex, ey, e.r, "#ff4d6d"); else if (o.skin === "ufo") spSaucer(c, ex, ey, e.r * 2.6, "#3ddc84"); else if (o.skin === "rock") spRock(c, ex, ey, e.r, "#8a8a8a", e.k); else { buddy(c, ex, ey, e.r, e.hp > 1 ? "#c77dff" : "#ff4d6d", -Math.cos(e.a)); } }
        for (i = 0; i < this.bs.length; i++) dot(c, this.bs[i].x, this.bs[i].y, 5, "#ffd23f");
        c.save(); c.translate(this.x, this.y); c.rotate(this.a); fillR(c, 6, -7, 34, 14, 5, "#55555f"); c.restore();
        dot(c, this.x, this.y, 22, o.col || "#3ddc84"); dot(c, this.x, this.y, 9, "#17121f");
        this.ghost(this.x + 60, this.y + 70, now);
      }
    });
    regD("tu_" + o.id, o.name, o.how, o.acc, C, o.scene || "space");
  }
  [
    { id: "base", name: "Torreta", how: "La torreta gira sola. Tocá para disparar cuando apunte a un enemigo.", acc: "#3ddc84" },
    { id: "fast", name: "Torreta veloz", how: "Gira muy rápido. Tocá en el momento justo.", rs: 4, acc: "#ff4d6d" },
    { id: "rev", name: "Torreta loca", how: "Cada disparo cambia el sentido del giro.", rev: 1, acc: "#c77dff" },
    { id: "tri", name: "Triple disparo", how: "Cada toque tira tres balas en abanico.", tri: 1, iv: 0.8, acc: "#ffd23f" },
    { id: "tank", name: "Enemigos duros", how: "Los violetas necesitan dos disparos.", hp: 2, iv: 1.3, acc: "#c77dff" },
    { id: "swarm", name: "Enjambre alrededor", how: "Muchos enemigos chiquitos y rápidos.", small: 1, iv: 0.6, v: 90, acc: "#ff9f1c" },
    { id: "slow", name: "Torreta lenta", how: "Gira despacio y vienen muchos.", rs: 1.4, iv: 0.8, v: 55, acc: "#f2f2f2" },
    { id: "bug", name: "Torreta en la huerta", how: "Defendé la huerta de los bichos.", skin: "bug", acc: "#3ddc84", scene: "garden" },
    { id: "ufo", name: "Ataque de platillos", how: "Platillos de todos lados. Derribalos.", skin: "ufo", acc: "#ff5fd2" },
    { id: "rock", name: "Lluvia de meteoros", how: "Rocas desde todas las direcciones.", skin: "rock", iv: 0.8, tri: 1, rs: 3, acc: "#ff9f1c", scene: "moon" }
  ].forEach(mkTurret);

  /* --- 20. Soltá: tocá para soltar lo que se balancea y que caiga en el vaso --- */
  function mkSwing(o) {
    var C = G("Swing_" + o.id, {
      init: function () { this.ax0 = this.W / 2; this.ax = this.ax0; this.ay = this.pt + 20; this.avx = 0; this.L = o.L || 150; this.A = 0.95; this.ph = 0; this.it = null; this.cw = o.cw || 74; this.cy3 = this.H - this.pb - 50; this.wait = 0; this.cups = [{ x: this.W * 0.3, v: o.cv || 90 }]; if (o.two) this.cups.push({ x: this.W * 0.7, v: -(o.cv || 90) }); },
      ang: function () { return this.A * Math.sin(this.ph); },
      act: function () { if (this.it || this.wait > 0) return; var w = Math.sqrt((o.g || 900) / this.L), th = this.ang(), v = this.L * this.A * w * Math.cos(this.ph); this.it = { x: this.ax + Math.sin(th) * this.L, y: this.ay + Math.cos(th) * this.L, vx: v * Math.cos(th) + this.avx, vy: -v * Math.sin(th) }; this.acts++; sfx(340, 0.08, "triangle", 0.05, 0.7); },
      step: function (dt) {
        var i, g = o.g || 900; this.ph += Math.sqrt(g / this.L) * dt;
        if (o.amove) { this.ax = this.ax0 + Math.sin(this.t * 0.8) * 80; this.avx = Math.cos(this.t * 0.8) * 64; }
        for (i = 0; i < this.cups.length; i++) { var q = this.cups[i]; q.x += q.v * dt * (1 + Math.min(this.t, 60) * 0.01); if (q.x < this.cw / 2 + 10) { q.x = this.cw / 2 + 10; q.v = Math.abs(q.v); } if (q.x > this.W - this.cw / 2 - 10) { q.x = this.W - this.cw / 2 - 10; q.v = -Math.abs(q.v); } }
        if (this.wait > 0) this.wait -= dt;
        var it = this.it; if (!it) return; var py = it.y;
        it.vy += g * dt; if (o.wind) it.vx += Math.sin(this.t * 0.6) * o.wind * dt; it.x += it.vx * dt; it.y += it.vy * dt;
        if (py < this.cy3 - 6 && it.y >= this.cy3 - 6) for (i = 0; i < this.cups.length; i++) { var cp = this.cups[i]; if (Math.abs(it.x - cp.x) < this.cw / 2 - 4) { if (Math.abs(it.x - cp.x) < this.cw * 0.18) this.good(2, cp.x, this.cy3, true); else this.add(1); this.it = null; this.wait = 0.3; return; } }
        if (it.y > this.H - this.pb + 10 || it.x < -40 || it.x > this.W + 40) { this.hurt(); this.it = null; this.wait = 0.3; }
      },
      thing: function (c, x, y) { if (o.skin === "candy") { poly(c, [x - 14, y - 7, x - 22, y - 12, x - 22, y + 12, x - 14, y + 7], "#ffd23f"); poly(c, [x + 14, y - 7, x + 22, y - 12, x + 22, y + 12, x + 14, y + 7], "#ffd23f"); dot(c, x, y, 13, "#ff5fd2"); } else if (o.skin === "fruit") spFruit(c, x, y, 13, "#ff4d6d"); else buddy(c, x, y, 13, o.col || "#ffd23f"); },
      draw: function (now) {
        var c = this.ctx, i, th = this.ang(), ix = this.ax + Math.sin(th) * this.L, iy = this.ay + Math.cos(th) * this.L;
        c.fillStyle = "#55555f"; c.fillRect(this.ax - 30, this.ay - 8, 60, 8);
        if (!this.it && this.wait <= 0) { c.strokeStyle = "#f2efe6"; c.lineWidth = 3; c.beginPath(); c.moveTo(this.ax, this.ay); c.lineTo(ix, iy); c.stroke(); this.thing(c, ix, iy); }
        if (this.it) this.thing(c, this.it.x, this.it.y);
        for (i = 0; i < this.cups.length; i++) { var x = this.cups[i].x, y = this.cy3, w = this.cw; poly(c, [x - w / 2, y - 8, x + w / 2, y - 8, x + w / 2 - 10, y + 40, x - w / 2 + 10, y + 40], o.cc || "#ff4d6d"); c.fillStyle = "#f2f2f2"; c.fillRect(x - w / 2 - 3, y - 12, w + 6, 6); c.fillStyle = "rgba(255,255,255,0.3)"; c.fillRect(x - w / 2 + 12, y, 5, 30); }
        this.ghost(this.W / 2 + 70, this.cy, now);
      }
    });
    regD("rp_" + o.id, o.name, o.how, o.acc, C, o.scene || "circus");
  }
  [
    { id: "base", name: "Soltá", how: "Tocá para soltar lo que se balancea. Tiene que caer adentro del vaso.", acc: "#ff4d6d" },
    { id: "fast", name: "Vaso escurridizo", how: "El vaso se mueve rápido. Calculá dónde va a estar.", cv: 170, acc: "#ff9f1c" },
    { id: "small", name: "Vaso chiquito", how: "El vaso es angosto. Puntería fina.", cw: 50, acc: "#c77dff" },
    { id: "long", name: "Soga larga", how: "La soga es larga y se balancea lento.", L: 230, acc: "#3ddc84" },
    { id: "short", name: "Soga cortita", how: "La soga es corta y se balancea rapidísimo.", L: 80, acc: "#ffd23f" },
    { id: "two", name: "Dos vasos", how: "Dos vasos que se cruzan. Cualquiera vale.", two: 1, cv: 120, acc: "#ff5fd2" },
    { id: "wind", name: "Soltá con viento", how: "El viento desvía lo que cae.", wind: 60, acc: "#3ddc84", scene: "storm" },
    { id: "moon", name: "Soltá en la luna", how: "Poca gravedad: todo cae despacio.", g: 420, L: 150, acc: "#c77dff", scene: "moon" },
    { id: "candy", name: "Caramelos", how: "Soltá los caramelos adentro del frasco.", skin: "candy", cc: "#3ddc84", acc: "#ff5fd2", scene: "kitchen" },
    { id: "mix", name: "Soltá loco", how: "El gancho se mueve, el vaso también.", amove: 1, cv: 120, skin: "fruit", acc: "#ff9f1c", scene: "farm" }
  ].forEach(mkSwing);
