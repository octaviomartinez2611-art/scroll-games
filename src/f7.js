
  /* ===== Tanda dopamina (1/2): mecánicas nuevas de acción, 10 versiones de cada una ===== */
  function regD(id, name, how, acc, cls, scene) { reg(id, name, how, acc, cls); if (scene && typeof SCENE_BY !== "undefined") SCENE_BY[id] = scene; }
  function adiff(a, b) { var d = (a - b) % TAU; if (d < 0) d += TAU; if (d > PI) d = TAU - d; return d; }
  function gem(c, x, y, r, col) { col = col || "#2ec4b6"; poly(c, [x, y - r, x + r * 0.85, y - r * 0.15, x, y + r, x - r * 0.85, y - r * 0.15], col); poly(c, [x, y - r, x + r * 0.85, y - r * 0.15, x, y - r * 0.15], "rgba(255,255,255,0.35)"); }
  function buddy(c, x, y, r, col, look) { dot(c, x, y, r, col); face(c, x, y, r, look || 0); }
  function wseg(c, a, w, W, y, h, col) { if (w <= 0) return; a = ((a % W) + W) % W; c.fillStyle = col; if (a + w <= W) c.fillRect(a, y, w, h); else { c.fillRect(a, y, W - a, h); c.fillRect(0, y, a + w - W, h); } }
  function inWrap(u, a, w, W) { var d = ((u - a) % W + W) % W; return d < w; }
  function starG(c, x, y) { star(c, x, y, 13, "#ffd23f"); }
  function carV(c, x, y, w, h, col) {
    c.fillStyle = "#17121f"; c.fillRect(x - w / 2 - 3, y - h * 0.34, 6, h * 0.22); c.fillRect(x + w / 2 - 3, y - h * 0.34, 6, h * 0.22); c.fillRect(x - w / 2 - 3, y + h * 0.12, 6, h * 0.22); c.fillRect(x + w / 2 - 3, y + h * 0.12, 6, h * 0.22);
    fillR(c, x - w / 2, y - h / 2, w, h, 9, col); fillR(c, x - w * 0.34, y - h * 0.3, w * 0.68, h * 0.2, 4, "rgba(255,255,255,0.8)"); fillR(c, x - w * 0.34, y + h * 0.16, w * 0.68, h * 0.14, 4, "rgba(0,0,0,0.25)");
  }
  function tree(c, x, y, s) { c.fillStyle = "#6b4423"; c.fillRect(x - s * 0.12, y + s * 0.3, s * 0.24, s * 0.35); poly(c, [x, y - s * 0.75, x + s * 0.55, y + s * 0.35, x - s * 0.55, y + s * 0.35], "#2f8f4e"); poly(c, [x, y - s * 0.75, x + s * 0.38, y - s * 0.05, x - s * 0.38, y - s * 0.05], "#3ddc84"); }
  function flag(c, x, y, col) { c.fillStyle = "#f2f2f2"; c.fillRect(x - 1.5, y - 22, 3, 36); poly(c, [x + 1.5, y - 22, x + 22, y - 15, x + 1.5, y - 8], col); }

  /* --- 1. Carriles: deslizá para cambiar de carril --- */
  var LANE_T = {
    car: { road: "#2b2b33", line: "rgba(255,255,255,0.55)", me: function (c, x, y) { carV(c, x, y, 34, 56, "#ff4d6d"); }, bad: function (c, x, y, w, k) { carV(c, x, y, 34, 56, ["#ffd23f", "#c77dff", "#3ddc84", "#ff9f1c", "#f2f2f2"][k % 5]); } },
    night: { road: "#17121f", line: "rgba(255,210,63,0.6)", me: function (c, x, y) { carV(c, x, y, 34, 56, "#f2f2f2"); poly(c, [x - 12, y - 28, x - 30, y - 120, x + 30, y - 120, x + 12, y - 28], "rgba(255,240,180,0.13)"); }, bad: function (c, x, y, w, k) { carV(c, x, y, 34, 56, ["#ff4d6d", "#c77dff", "#ff9f1c"][k % 3]); dot(c, x - 10, y + 26, 4, "#ff3b3b"); dot(c, x + 10, y + 26, 4, "#ff3b3b"); } },
    ski: { road: "#eef3fa", line: "rgba(120,140,170,0.35)", me: function (c, x, y) { c.fillStyle = "#ff4d6d"; c.fillRect(x - 12, y - 6, 5, 34); c.fillRect(x + 7, y - 6, 5, 34); buddy(c, x, y, 15, "#ff9f1c"); }, bad: function (c, x, y, w, k) { if (k % 3) tree(c, x, y, 38); else spRock(c, x, y, 18, "#8a8a8a", k * 7 + 3); } },
    surf: { road: "#1f7fa8", line: "rgba(255,255,255,0.3)", me: function (c, x, y) { c.fillStyle = "#ffd23f"; c.beginPath(); c.ellipse(x, y + 8, 12, 30, 0, 0, TAU); c.fill(); c.fillStyle = "#ff4d6d"; c.fillRect(x - 1.5, y - 18, 3, 52); buddy(c, x, y - 4, 13, "#f2b48a"); }, bad: function (c, x, y, w, k) { spRock(c, x, y, 20, "#6b6b75", k * 5 + 1); c.fillStyle = "rgba(255,255,255,0.6)"; c.fillRect(x - 22, y + 16, 44, 4); } },
    city: { road: "#3a3a44", line: "rgba(255,255,255,0.4)", me: function (c, x, y, t) { c.fillStyle = "#2b2b33"; c.fillRect(x - 9, y + 8, 6, 18 + Math.sin(t / 80) * 4); c.fillRect(x + 3, y + 8, 6, 18 - Math.sin(t / 80) * 4); buddy(c, x, y - 2, 16, "#3ddc84"); }, bad: function (c, x, y, w) { spBar(c, x - w * 0.42, y - 9, w * 0.84, 18); c.fillStyle = "#d9dde3"; c.fillRect(x - w * 0.36, y + 9, 5, 18); c.fillRect(x + w * 0.36 - 5, y + 9, 5, 18); } },
    space: { road: "rgba(10,8,30,0.55)", line: "rgba(255,255,255,0.18)", me: function (c, x, y) { spShip(c, x, y, 20); }, bad: function (c, x, y, w, k) { spRock(c, x, y, 19, "#8a8a8a", k * 9 + 2); }, good: function (c, x, y) { gem(c, x, y, 13, "#c77dff"); } },
    lava: { road: "#4a1f14", line: "rgba(255,159,28,0.45)", me: function (c, x, y) { fillR(c, x - 20, y + 6, 40, 12, 5, "#55555f"); buddy(c, x, y - 6, 15, "#ffd23f"); }, bad: function (c, x, y) { spFire(c, x, y + 10, 14); }, good: function (c, x, y) { gem(c, x, y, 13, "#2ec4b6"); } },
    farm: { road: "#8a6a3a", line: "rgba(255,255,255,0.25)", me: function (c, x, y) { fillR(c, x - 15, y - 24, 30, 48, 12, "#f2f2f2"); dot(c, x - 6, y + 4, 6, "#2b2b33"); dot(c, x + 7, y - 10, 5, "#2b2b33"); buddy(c, x, y - 26, 12, "#f2d2b6"); }, bad: function (c, x, y) { spCrate(c, x - 20, y - 20, 40, 40); }, good: function (c, x, y) { spFruit(c, x, y, 12, "#ff4d6d"); } }
  };
  function mkLane(o) {
    var T = LANE_T[o.th], C = G("Lane_" + o.id, {
      ctl: "swipe",
      init: function () { this.n = o.n || 3; this.lw = Math.min(this.W - 24, 380) / this.n; this.x0 = (this.W - this.lw * this.n) / 2; this.li = (this.n - 1) >> 1; this.px = this.lx(this.li); this.py = this.H - this.pb - 90; this.obs = []; this.next = 120; this.off = 0; },
      lx: function (i) { return this.x0 + this.lw * (i + 0.5); },
      act: function (x) { this.li = clamp(this.li + (x < this.W / 2 ? -1 : 1), 0, this.n - 1); this.acts++; S.flip(); },
      v: function () { var v = (o.v || 320) * (1 + Math.min(this.t, 60) * (o.ramp || 0.012)); if (o.wave) v *= 0.75 + 0.35 * Math.sin(this.t * 0.8); return v; },
      spawn: function () {
        var n = this.n, k, lanes = []; for (k = 0; k < n; k++) lanes.push(k); lanes = shuf(lanes);
        var nb = ri(1, n); if (o.many) nb = n - 1; var y = this.pt - 60, mustDone = false;
        for (k = 0; k < n; k++) {
          var l = lanes[k];
          if (k < nb) this.obs.push({ x: this.lx(l), y: y, bad: true, k: ri(0, 9), to: o.zig && Math.random() < 0.45 ? clamp(l + (Math.random() < 0.5 ? -1 : 1), 0, n - 1) : -1 });
          else if (o.must ? !mustDone : Math.random() < (o.gem || 0.45)) { this.obs.push({ x: this.lx(l), y: y, bad: false }); mustDone = true; }
        }
      },
      step: function (dt) {
        var v = this.v(), i, ob; this.off = (this.off + v * dt) % 60;
        this.next -= v * dt; if (this.next <= 0) { this.spawn(); this.next = (o.gap || 250) * rnd(0.85, 1.25); }
        this.px += (this.lx(this.li) - this.px) * Math.min(1, dt * 16);
        for (i = 0; i < this.obs.length; i++) {
          ob = this.obs[i]; ob.y += v * dt;
          if (ob.to >= 0 && ob.y > this.pt + (this.py - this.pt) * 0.25) ob.x += (this.lx(ob.to) - ob.x) * Math.min(1, dt * 5);
          if (Math.abs(ob.y - this.py) < (ob.bad ? 46 : 34) && Math.abs(ob.x - this.px) < this.lw * 0.42) { ob.dead = true; if (ob.bad) this.hurt(); else this.good(1, ob.x, ob.y); }
          else if (ob.y > this.py + 50 && !ob.done) { ob.done = true; if (ob.bad) this.add(1); else if (o.must) this.hurt(); }
        }
        var H = this.H; this.obs = this.obs.filter(function (b) { return b.y < H + 60 && !b.dead; });
      },
      draw: function (now) {
        var c = this.ctx, i, x0 = this.x0, w = this.lw * this.n, y;
        c.fillStyle = T.road; c.fillRect(x0 - 6, 0, w + 12, this.H);
        c.fillStyle = "#f2f2f2"; c.fillRect(x0 - 6, 0, 4, this.H); c.fillRect(x0 + w + 2, 0, 4, this.H);
        c.fillStyle = T.line; for (i = 1; i < this.n; i++) for (y = -60 + this.off; y < this.H; y += 60) c.fillRect(x0 + this.lw * i - 2, y, 4, 30);
        for (i = 0; i < this.obs.length; i++) { var b = this.obs[i]; if (b.bad) T.bad(c, b.x, b.y, this.lw, b.k, now); else if (o.must) flag(c, b.x, b.y, "#ff4d6d"); else (T.good || starG)(c, b.x, b.y, now); }
        c.globalAlpha = this.fadeA(); T.me(c, this.px, this.py, now); c.globalAlpha = 1;
        this.ghost(this.W * 0.72, this.py - 100, now);
      }
    });
    regD("ln_" + o.id, o.name, o.how, o.acc, C, o.scene);
  }
  [
    { id: "car", name: "Carriles", how: "Deslizá o tocá a un costado para cambiar de carril. Esquivá los autos y juntá estrellas.", th: "car", acc: "#ff4d6d", scene: "road" },
    { id: "night", name: "Ruta de noche", how: "De noche y más rápido. Cambiá de carril y esquivá.", th: "night", v: 400, acc: "#ffd23f", scene: "city" },
    { id: "ski", name: "Esquí", how: "Bajá la montaña cambiando de carril. Esquivá árboles y piedras.", th: "ski", v: 300, acc: "#ff9f1c", scene: "snow" },
    { id: "surf", name: "Surf", how: "Cambiá de ola con un deslizamiento. Las rocas te tiran.", th: "surf", v: 290, wave: 1, acc: "#ffd23f", scene: "sea" },
    { id: "city", name: "Persecución", how: "Las vallas se cruzan de carril a último momento. Esquivalas.", th: "city", zig: 1, acc: "#3ddc84", scene: "city" },
    { id: "space", name: "Hiperespacio", how: "Cinco carriles y rocas a toda velocidad. Juntá gemas.", th: "space", n: 5, v: 380, acc: "#c77dff", scene: "space" },
    { id: "lava", name: "Río de lava", how: "Navegá la lava cambiando de carril. Esquivá el fuego.", th: "lava", many: 1, gap: 300, acc: "#ff9f1c", scene: "volcano" },
    { id: "gate", name: "Slalom", how: "Pasá por todas las banderas. Si se te escapa una, perdés una vida.", th: "ski", must: 1, gap: 220, v: 280, acc: "#ff4d6d", scene: "snow" },
    { id: "farm", name: "Carrito de la granja", how: "Esquivá las cajas y juntá frutas por los carriles.", th: "farm", gem: 0.7, acc: "#ff4d6d", scene: "farm" },
    { id: "turbo", name: "Turbo total", how: "Cuatro carriles y cada vez más rápido. ¿Hasta dónde llegás?", th: "car", n: 4, ramp: 0.03, v: 300, acc: "#ffd23f", scene: "road" }
  ].forEach(mkLane);

  /* --- 2. Flechas a la rueda: tocá para clavar sin chocar las otras --- */
  function knifeL(c, hc) { poly(c, [0, 0, 4, 7, 4, 26, -4, 26, -4, 7], "#e6e8ee"); c.fillStyle = "#55555f"; c.fillRect(-7, 26, 14, 4); fillR(c, -4.5, 30, 9, 22, 3, hc || "#8a5a2b"); }
  function mkKnife(o) {
    var C = G("Knife_" + o.id, {
      init: function () { this.R = o.R || 72; this.wx = this.W / 2; this.wy = this.pt + 70 + this.R; this.rot = 0; this.lvl = 0; this.fly = null; this.by = this.H - this.pb - 70; this.brk = 0; this.drop = []; this.wheel(); },
      wheel: function () { var k; this.st = []; this.ap = []; this.left = (o.need || 7) + Math.min(this.lvl, 4); for (k = 0; k < (o.pre || 0) + Math.min(this.lvl, 3); k++) this.st.push(k * TAU / 5 + rnd(-0.3, 0.3)); for (k = 0; k < (o.apples || 0); k++) this.ap.push(k * TAU / (o.apples) + rnd(0.3, 0.8)); this.spd = (o.sp || 2.0) * (1 + this.lvl * 0.1); this.dir = this.lvl % 2 ? -1 : 1; },
      act: function () { if (this.fly || this.brk > 0) return; this.fly = { y: this.by }; this.acts++; sfx(520, 0.06, "square", 0.04, 1.6); },
      w: function () { var s = this.spd * this.dir; if (o.wob) s *= 0.3 + 1.3 * Math.abs(Math.sin(this.t * 1.1)); if (o.flip && Math.sin(this.t * 0.8) < 0) s = -s; return s; },
      step: function (dt) {
        var i; this.rot += this.w() * dt;
        for (i = 0; i < this.drop.length; i++) { var d = this.drop[i]; d.vy += 1600 * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.a += 9 * dt; }
        var H = this.H; this.drop = this.drop.filter(function (d) { return d.y < H + 80; });
        if (this.brk > 0) { this.brk -= dt; if (this.brk <= 0) { this.lvl++; this.wheel(); } return; }
        if (!this.fly) return; this.fly.y -= (o.kv || 1700) * dt;
        if (this.fly.y > this.wy + this.R) return;
        var a = PI / 2 - this.rot, hit = false; this.fly = null;
        for (i = 0; i < this.st.length; i++) if (adiff(a, this.st[i]) < (o.tol || 0.19)) hit = true;
        if (hit) { this.drop.push({ x: this.wx, y: this.wy + this.R + 10, vx: rnd(-180, 180), vy: 200, a: 0 }); this.hurt(); return; }
        this.st.push(a); this.left--;
        var got = false; for (i = 0; i < this.ap.length; i++) if (adiff(a, this.ap[i]) < 0.26) { this.ap.splice(i, 1); got = true; break; }
        if (got) this.good(2, this.wx, this.wy + this.R, true); else this.add(1);
        if (this.left <= 0) { this.brk = 0.6; this.add(3); S.perfect(); }
      },
      draw: function (now) {
        var c = this.ctx, i, R = this.R, x = this.wx, y = this.wy, sk = o.skin || "log", A;
        if (this.brk > 0) c.globalAlpha = Math.max(0, this.brk / 0.6);
        for (i = 0; i < this.st.length; i++) { A = this.st[i] + this.rot; c.save(); c.translate(x + Math.cos(A) * (R - 14), y + Math.sin(A) * (R - 14)); c.rotate(A - PI / 2); knifeL(c, o.hc); c.restore(); }
        if (sk === "log") { dot(c, x, y, R, "#a86a35"); dot(c, x, y, R * 0.86, "#c98a4a"); c.strokeStyle = "#8a5a2b"; c.lineWidth = 3; c.beginPath(); c.arc(x, y, R * 0.58, 0, TAU); c.stroke(); c.beginPath(); c.arc(x, y, R * 0.3, 0, TAU); c.stroke(); c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(this.rot) * R * 0.8, y + Math.sin(this.rot) * R * 0.8); c.stroke(); }
        else if (sk === "pizza") { dot(c, x, y, R, "#d99a55"); dot(c, x, y, R * 0.86, "#ff6b3d"); dot(c, x, y, R * 0.78, "#ffd27a"); for (i = 0; i < 7; i++) { A = this.rot + i * TAU / 7; dot(c, x + Math.cos(A) * R * 0.5, y + Math.sin(A) * R * 0.5, R * 0.12, "#c0392b"); } }
        else if (sk === "target") { dot(c, x, y, R, "#f2f2f2"); dot(c, x, y, R * 0.75, "#ff4d6d"); dot(c, x, y, R * 0.5, "#f2f2f2"); dot(c, x, y, R * 0.25, "#ff4d6d"); for (i = 0; i < 8; i++) { A = this.rot + i * TAU / 8; c.fillStyle = "rgba(0,0,0,0.18)"; c.fillRect(x + Math.cos(A) * R * 0.88 - 3, y + Math.sin(A) * R * 0.88 - 3, 6, 6); } }
        else { dot(c, x, y, R, "#e0a000"); dot(c, x, y, R * 0.84, "#ffd23f"); for (i = 0; i < 6; i++) { A = this.rot + i * TAU / 6; star(c, x + Math.cos(A) * R * 0.55, y + Math.sin(A) * R * 0.55, 8, "#fff3b0"); } }
        for (i = 0; i < this.ap.length; i++) { A = this.ap[i] + this.rot; var ax = x + Math.cos(A) * (R + 12), ay = y + Math.sin(A) * (R + 12); spFruit(c, ax, ay, 10, "#ff4d6d"); }
        c.globalAlpha = 1;
        c.save(); c.translate(x, this.fly ? this.fly.y : this.by); if (this.brk <= 0 || this.fly) knifeL(c, o.hc); c.restore();
        for (i = 0; i < this.drop.length; i++) { var d = this.drop[i]; c.save(); c.translate(d.x, d.y); c.rotate(d.a); knifeL(c, o.hc); c.restore(); }
        for (i = 0; i < this.left; i++) fillR(c, 16, this.H - this.pb - 26 - i * 12, 18, 6, 3, "rgba(255,255,255,0.75)");
        this.ghost(x + 50, this.by, now);
      }
    });
    regD("kn_" + o.id, o.name, o.how, o.acc, C, o.scene || "workshop");
  }
  [
    { id: "log", name: "Rueda de flechas", how: "Tocá para tirar. Clavalas en la rueda sin pegarle a las que ya están.", acc: "#ff9f1c" },
    { id: "wob", name: "Rueda loca", how: "La rueda frena y acelera de golpe. Elegí el momento.", wob: 1, acc: "#ff4d6d" },
    { id: "flip", name: "Ida y vuelta", how: "La rueda cambia de sentido. Tirá cuando haya lugar.", flip: 1, acc: "#c77dff" },
    { id: "app", name: "Manzanas en la rueda", how: "Pegale a las manzanas del borde para sumar doble.", apples: 3, acc: "#3ddc84", scene: "farm" },
    { id: "pre", name: "Ya clavadas", how: "La rueda arranca con flechas. Encontrá los huecos.", pre: 3, acc: "#ffd23f" },
    { id: "fast", name: "Rueda veloz", how: "Gira muy rápido. Tirá sin pensar.", sp: 3.4, acc: "#ff4d6d" },
    { id: "small", name: "Rueda chiquita", how: "Poco lugar para clavar. Cada flecha cuenta.", R: 54, need: 6, acc: "#ff9f1c" },
    { id: "pizza", name: "Pizza voladora", how: "Clavá los palitos en la pizza que gira.", skin: "pizza", apples: 2, acc: "#ffd23f", scene: "kitchen", hc: "#ff4d6d" },
    { id: "target", name: "Blanco giratorio", how: "Un blanco enorme que gira. Diez flechas para romperlo.", skin: "target", R: 96, need: 10, sp: 1.7, acc: "#ff4d6d", scene: "circus" },
    { id: "gold", name: "Rueda de oro", how: "Frena, cambia de sentido y tiene manzanas. Todo junto.", skin: "gold", wob: 1, flip: 1, apples: 2, pre: 1, acc: "#ffd23f", scene: "circus" }
  ].forEach(mkKnife);

  /* --- 3. Aros giratorios: tocá para subir y pasá por el hueco --- */
  function mkRing(o) {
    var SP = o.spacing || 340, C = G("Ring_" + o.id, {
      init: function () { this.bx = this.W / 2; this.by = this.H - this.pb - 70; this.vy = 0; this.cam = 0; this.wait = true; this.rg = []; this.stars = []; this.ny = this.by - 250; this.resp = this.by; this.gen(); },
      gen: function () {
        while (this.ny > this.cam - 400) {
          var r = { y: this.ny, R: o.R || 70, rot: rnd(0, TAU), sp: (o.sp || 0.95) * (o.alt ? (this.rg.length % 2 ? -1 : 1) : (Math.random() < 0.5 ? -1 : 1)), gap: o.gap || 2.0, n: o.four ? 4 : 2, inner: !!o.dbl, col: pickOf(["#ff4d6d", "#ffd23f", "#3ddc84", "#c77dff", "#ff9f1c", "#ff5fd2"]) };
          if (o.mix) { r.n = Math.random() < 0.35 ? 4 : 2; r.inner = r.n === 2 && Math.random() < 0.35; r.sp *= rnd(0.7, 1.5); r.gap = r.n === 4 ? 0.8 : rnd(1.3, 1.6); }
          this.rg.push(r); if (o.stars) this.stars.push({ y: this.ny + SP / 2 }); this.ny -= SP;
        }
      },
      act: function () { this.wait = false; this.vy = -(o.jump || 470); this.acts++; sfx(620, 0.05, "triangle", 0.04, 1.3); },
      gapOK: function (rot, gap, n, a) { var d = a - rot; for (var k = 0; k < n; k++) if (adiff(d, k * TAU / n) < gap / 2) return true; return false; },
      step: function (dt) {
        var i, k, br = 11, r;
        for (i = 0; i < this.rg.length; i++) { r = this.rg[i]; var s = r.sp; if (o.wob) s *= 0.2 + 1.5 * Math.abs(Math.sin(this.t * 1.2 + i)); r.rot += s * dt; }
        if (this.wait) return;
        this.vy += (o.g || 1150) * dt; this.by += this.vy * dt;
        if (this.by - this.cam < this.H * 0.5) this.cam = this.by - this.H * 0.5;
        this.gen();
        for (i = 0; i < this.rg.length; i++) {
          r = this.rg[i];
          var pts = [[r.y - r.R, -PI / 2, 0], [r.y + r.R, PI / 2, 0]];
          if (r.inner) { pts.push([r.y - r.R * 0.6, -PI / 2, 1]); pts.push([r.y + r.R * 0.6, PI / 2, 1]); }
          for (k = 0; k < pts.length; k++) if (Math.abs(this.by - pts[k][0]) < br + 6) {
            var ok = pts[k][2] ? this.gapOK(-r.rot * 1.3, r.gap, 2, pts[k][1]) : this.gapOK(r.rot, r.gap, r.n, pts[k][1]);
            if (!ok) this.hurt();
          }
          if (!r.passed && this.by < r.y) { r.passed = true; this.add(1); this.resp = r.y - SP / 2; }
        }
        for (i = 0; i < this.stars.length; i++) { var s2 = this.stars[i]; if (!s2.got && Math.abs(this.by - s2.y) < 22) { s2.got = true; this.good(1, this.bx, s2.y - this.cam); } }
        if (this.by - this.cam > this.H - this.pb + 20) { this.hurt(); this.by = this.resp; this.vy = 0; this.wait = true; this.cam = this.by - this.H * 0.5; }
        var cam = this.cam, H = this.H; this.rg = this.rg.filter(function (q) { return q.y - q.R - cam < H + 40; });
        this.stars = this.stars.filter(function (q) { return !q.got && q.y - cam < H + 40; });
      },
      arcs: function (c, x, y, R, rot, gap, n, col, lw) {
        c.strokeStyle = col; c.lineWidth = lw; c.lineCap = "round";
        for (var k = 0; k < n; k++) { c.beginPath(); c.arc(x, y, R, rot + k * TAU / n + gap / 2, rot + (k + 1) * TAU / n - gap / 2); c.stroke(); }
        c.lineCap = "butt";
      },
      draw: function (now) {
        var c = this.ctx, i, x = this.W / 2;
        for (i = 0; i < this.rg.length; i++) { var r = this.rg[i], y = r.y - this.cam; this.arcs(c, x, y, r.R, r.rot, r.gap, r.n, r.col, 13); if (r.inner) this.arcs(c, x, y, r.R * 0.6, -r.rot * 1.3, r.gap, 2, "#f2f2f2", 10); }
        for (i = 0; i < this.stars.length; i++) starG(c, x, this.stars[i].y - this.cam);
        c.globalAlpha = this.fadeA(); buddy(c, x, this.by - this.cam, 12, o.bc || "#f2f2f2"); c.globalAlpha = 1;
        this.ghost(x + 60, this.by - this.cam + 10, now);
      }
    });
    regD("ri_" + o.id, o.name, o.how, o.acc, C, o.scene || "arcade");
  }
  [
    { id: "one", name: "Aros giratorios", how: "Tocá para subir. Pasá por los huecos de cada aro cuando queden arriba y abajo.", acc: "#ff5fd2" },
    { id: "fast", name: "Aros a mil", how: "Los aros giran rapidísimo. Tocá en el momento justo.", sp: 1.9, gap: 1.9, acc: "#ff4d6d" },
    { id: "two", name: "Aros en cruz", how: "Cada aro tiene cuatro huecos.", four: 1, gap: 0.95, sp: 0.8, acc: "#3ddc84" },
    { id: "dbl", name: "Aros dobles", how: "Un aro adentro de otro, girando al revés.", dbl: 1, R: 84, sp: 0.9, acc: "#c77dff" },
    { id: "wob", name: "Aros que frenan", how: "Giran, frenan y vuelven a girar. Esperá el momento.", wob: 1, acc: "#ffd23f" },
    { id: "alt", name: "Para un lado y para el otro", how: "Un aro gira a la derecha y el siguiente a la izquierda.", alt: 1, sp: 2, acc: "#ff9f1c" },
    { id: "tiny", name: "Hueco finito", how: "Los huecos son chiquitos. Hace falta puntería.", gap: 1.4, sp: 0.8, acc: "#ff4d6d" },
    { id: "star", name: "Aros con estrellas", how: "Juntá las estrellas que hay entre los aros.", stars: 1, acc: "#ffd23f", scene: "sky" },
    { id: "moon", name: "Aros en la luna", how: "Poca gravedad: subís alto y caés despacio.", g: 600, jump: 310, acc: "#c77dff", scene: "moon" },
    { id: "mix", name: "Aros mezclados", how: "Cada aro es distinto: dobles, con dos huecos, rápidos.", mix: 1, acc: "#3ddc84", scene: "space" }
  ].forEach(mkRing);

  /* --- 4. Caída por la torre: arrastrá para mover los pisos y caé por los huecos --- */
  function mkTower(o) {
    var C = G("Tower_" + o.id, {
      ctl: "drag",
      init: function () { this.rows = []; this.off = 0; this.ov = 0; this.lx = null; this.by = this.pt + 40; this.vy = 0; this.cam = 0; this.ny = this.pt + 150; this.chain = 0; this.gen(); },
      gen: function () {
        var W = this.W;
        while (this.ny < this.cam + this.H + 200) {
          var n = this.rows.length, gw = (o.gw || 0.25) * W, r = { y: this.ny, gx: rnd(0, W), gw: gw, reds: [], sh: 0, ms: o.move ? rnd(40, 90) * (Math.random() < 0.5 ? -1 : 1) : 0, col: pickOf(o.cols || ["#ff9f1c", "#ffd23f", "#3ddc84", "#c77dff", "#ff5fd2"]) };
          if (o.two) r.g2 = r.gx + W / 2;
          var span = o.two ? W / 2 - gw : W - gw, nr = n < 2 ? 0 : (Math.random() < (o.red || 0.6) ? 1 : 0) + (Math.random() < (o.red2 || 0.15) ? 1 : 0);
          for (var k = 0; k < nr; k++) { var rw = rnd(0.1, 0.18) * W, st = rnd(0.06, 0.94) * Math.max(0, span - rw - 0.08 * W) + 0.04 * W; if (span - rw > 0.1 * W) r.reds.push({ x: r.gx + gw + st, w: rw }); }
          this.rows.push(r); this.ny += (o.gapY || 135);
        }
      },
      drag: function (x) { if (this.lx !== null) { var d = (x - this.lx) * (o.sens || 1.1); this.off += d; this.ov = d * 50; } this.lx = x; },
      release: function () { this.lx = null; if (!o.inert) this.ov = 0; },
      step: function (dt) {
        var i, k, W = this.W, br = 13, bx = W / 2;
        if (o.inert && !this.holding) { this.off += this.ov * dt; this.ov *= Math.pow(0.93, dt * 60); }
        for (i = 0; i < this.rows.length; i++) this.rows[i].sh += this.rows[i].ms * dt;
        var py = this.by; this.vy = Math.min(this.vy + (o.g || 1500) * dt, 900); this.by += this.vy * dt;
        for (i = 0; i < this.rows.length; i++) {
          var r = this.rows[i]; if (r.gone || r.passed) continue;
          if (py + br <= r.y + 2 && this.by + br > r.y) {
            var u = bx - this.off - r.sh, inGap = inWrap(u, r.gx, r.gw, W) || (r.g2 !== undefined && inWrap(u, r.g2, r.gw, W));
            if (inGap) { r.passed = true; this.chain++; this.add(this.chain >= 3 ? 2 : 1); }
            else if (this.chain >= (o.fireN || 3)) { r.gone = true; this.chain = 0; this.good(2, bx, r.y - this.cam, true); }
            else { var red = false; for (k = 0; k < r.reds.length; k++) if (inWrap(u, r.reds[k].x, r.reds[k].w, W)) red = true; if (red) this.hurt(); this.by = r.y - br; this.vy = -(o.bounce || 540); this.chain = 0; }
            break;
          }
        }
        var target = this.by - (this.pt + (this.H - this.pt - this.pb) * 0.3); if (target > this.cam) this.cam += (target - this.cam) * Math.min(1, dt * 7);
        this.gen(); var cam = this.cam; this.rows = this.rows.filter(function (q) { return q.y > cam - 60; });
      },
      draw: function (now) {
        var c = this.ctx, i, k, W = this.W;
        for (i = 0; i < this.rows.length; i++) {
          var r = this.rows[i]; if (r.gone) continue; var y = r.y - this.cam; if (y > this.H + 20) break; var a = r.gx + this.off + r.sh;
          if (r.g2 === undefined) wseg(c, a + r.gw, W - r.gw, W, y, 16, r.col);
          else { wseg(c, a + r.gw, W / 2 - r.gw, W, y, 16, r.col); wseg(c, a + W / 2 + r.gw, W / 2 - r.gw, W, y, 16, r.col); }
          for (k = 0; k < r.reds.length; k++) wseg(c, r.reds[k].x + this.off + r.sh, r.reds[k].w, W, y, 16, "#ff2d4a");
        }
        c.globalAlpha = this.fadeA(); buddy(c, W / 2, this.by - this.cam, 13, this.chain >= (o.fireN || 3) ? "#ff9f1c" : "#f2f2f2"); c.globalAlpha = 1;
        this.ghostDrag(this.H - this.pb - 60, now);
      }
    });
    regD("tw_" + o.id, o.name, o.how, o.acc, C, o.scene || "sky");
  }
  [
    { id: "base", name: "Caída por la torre", how: "Arrastrá a los costados para mover los pisos. Caé por los huecos y no toques lo rojo.", acc: "#ff9f1c" },
    { id: "red", name: "Pisos rojos", how: "Mucho rojo en cada piso. Movelos bien antes de caer.", red: 0.95, red2: 0.6, acc: "#ff4d6d" },
    { id: "move", name: "Pisos que giran", how: "Cada piso se mueve solo. Acomodalos al vuelo.", move: 1, acc: "#c77dff" },
    { id: "thin", name: "Huecos chicos", how: "Los huecos son angostos. Apuntá bien.", gw: 0.17, acc: "#ffd23f" },
    { id: "fast", name: "Caída libre", how: "Caés más rápido y rebotás menos.", g: 2100, bounce: 600, acc: "#3ddc84" },
    { id: "wide", name: "Huecos gigantes", how: "Huecos grandes pero mucho rojo alrededor.", gw: 0.36, red: 1, red2: 0.8, acc: "#ff5fd2" },
    { id: "two", name: "Dos huecos por piso", how: "Cada piso tiene dos huecos. Caé por cualquiera.", two: 1, gw: 0.18, red: 0.7, acc: "#3ddc84" },
    { id: "ice", name: "Pisos resbalosos", how: "Los pisos siguen moviéndose cuando soltás.", inert: 1, acc: "#f2f2f2", scene: "snow" },
    { id: "fire", name: "Caída en llamas", how: "Con dos caídas seguidas rompés el piso que sigue.", fireN: 2, red: 0.9, acc: "#ff9f1c", scene: "volcano" },
    { id: "storm", name: "Torre en tormenta", how: "Pisos que se mueven, rojo y caída rápida.", move: 1, red: 0.9, g: 1900, acc: "#c77dff", scene: "storm" }
  ].forEach(mkTower);

  /* --- 5. Rompe pisos: mantené apretado para romper, soltá en lo negro --- */
  function mkSmash(o) {
    var C = G("Smash_" + o.id, {
      ctl: "hold",
      init: function () { this.rows = []; this.k = 0; for (var i = 0; i < 26; i++) this.addRow(); this.tm = 0; this.lock = false; this.fire = 0; this.chain = 0; this.bt = 0; this.drop = 0; },
      addRow: function () {
        var n = o.seg || 8, d = [], i, nd = Math.round(n * Math.min(0.6, (o.dark || 0.25) + this.k * 0.004)); for (i = 0; i < n; i++) d.push(false);
        if (this.k >= 3) { if (o.stripe) { for (i = 0; i < n; i += 2) if (Math.random() < 0.7) d[i] = true; } else { var st = ri(0, n); for (i = 0; i < nd; i++) d[(st + i) % n] = true; } }
        this.rows.push({ d: d, off: rnd(0, 1), sp: (o.sp || 0.22) * (o.rev && this.k % 2 ? -1 : 1) * (o.mix ? rnd(0.6, 1.8) : 1), col: pickOf(o.cols || ["#ff4d6d", "#ff9f1c", "#ffd23f", "#c77dff", "#ff5fd2", "#3ddc84"]) }); this.k++;
      },
      press: function () { this.lock = false; this.chain = 0; },
      step: function (dt) {
        var i, r; for (i = 0; i < Math.min(14, this.rows.length); i++) { r = this.rows[i]; var s = r.sp; if (o.wave) s *= 1.7 * Math.sin(this.t * 0.9 + i * 0.4); r.off = ((r.off + s * dt) % 1 + 1) % 1; }
        if (this.fire > 0) this.fire -= dt; this.bt += dt; if (this.drop > 0) this.drop = Math.max(0, this.drop - dt);
        if (!this.holding || this.lock) return;
        this.tm -= dt; if (this.tm > 0) return; this.tm = o.rate || 0.09;
        r = this.rows[0]; var n = r.d.length, si = Math.floor((((0.5 - r.off) % 1 + 1) % 1) * n) % n;
        if (r.d[si] && this.fire <= 0) { this.lock = true; this.chain = 0; this.hurt(); return; }
        this.rows.shift(); this.addRow(); this.drop = o.rate || 0.09; this.chain++;
        this.add(this.fire > 0 ? 2 : 1);
        if (this.chain === (o.fireN || 12)) { this.fire = 1.6; S.perfect(); }
      },
      draw: function (now) {
        var c = this.ctx, top = this.pt + 150, hg = o.hg || 26, gp = 10, i, j, W = this.W, rate = o.rate || 0.09;
        for (i = 0; i < this.rows.length; i++) {
          var y = top + i * (hg + gp) + (this.drop > 0 ? (this.drop / rate) * (hg + gp) : 0); if (y > this.H) break; var r = this.rows[i], n = r.d.length;
          for (j = 0; j < n; j++) wseg(c, ((j / n + r.off) % 1) * W + 1, W / n - 2, W, y, hg, r.d[j] ? "#17121f" : (this.fire > 0 ? "#ff9f1c" : r.col));
        }
        var by = this.holding && !this.lock ? top - 15 : top - 15 - Math.abs(Math.sin(this.bt * 6)) * 46;
        c.globalAlpha = this.fadeA(); buddy(c, W / 2, by, 14, this.fire > 0 ? "#ff9f1c" : "#f2f2f2"); c.globalAlpha = 1;
        var fn = o.fireN || 12, fl = this.fire > 0 ? 1 : Math.min(1, this.chain / fn);
        fillR(c, 14, top, 8, 140, 4, "rgba(255,255,255,0.15)"); fillR(c, 14, top + 140 * (1 - fl), 8, 140 * fl, 4, "#ff9f1c");
        this.ghostHold(W / 2 + 80, top - 70, now);
      }
    });
    regD("sm_" + o.id, o.name, o.how, o.acc, C, o.scene || "build");
  }
  [
    { id: "base", name: "Rompe pisos", how: "Mantené apretado para romper pisos. Soltá cuando abajo haya negro.", acc: "#ff4d6d" },
    { id: "fast", name: "Pisos que vuelan", how: "Los pisos giran rápido. Reflejos al máximo.", sp: 0.45, acc: "#ff9f1c" },
    { id: "dark", name: "Mucho negro", how: "Casi medio piso es negro. Soltá a tiempo.", dark: 0.42, acc: "#c77dff" },
    { id: "rev", name: "Contramano", how: "Cada piso gira para el lado contrario del anterior.", rev: 1, sp: 0.3, acc: "#3ddc84" },
    { id: "fire", name: "Martillo de fuego", how: "Con seis pisos seguidos te prendés fuego y rompés todo.", fireN: 6, acc: "#ff9f1c", scene: "volcano" },
    { id: "slow", name: "Martillo lento", how: "Rompés despacio, pero los pisos giran rápido.", rate: 0.16, sp: 0.4, acc: "#ffd23f" },
    { id: "stripe", name: "Rayas", how: "Pisos con rayas negras. Pasá por las de color.", stripe: 1, seg: 12, acc: "#ff5fd2" },
    { id: "wave", name: "Pisos en ola", how: "Los pisos van y vienen como una ola.", wave: 1, acc: "#3ddc84", scene: "sea" },
    { id: "big", name: "Bloques gigantes", how: "Pocos bloques grandes y gruesos.", seg: 4, hg: 34, dark: 0.3, acc: "#ffd23f" },
    { id: "mix", name: "Caos de pisos", how: "Cada piso a su velocidad. No hay dos iguales.", mix: 1, sp: 0.3, dark: 0.3, acc: "#c77dff", scene: "storm" }
  ].forEach(mkSmash);

  /* --- 6. Diagonal: tocá para cambiar de lado y no te salgas del camino --- */
  function mkZig(o) {
    var C = G("Zig_" + o.id, {
      init: function () { this.D = Math.random() < 0.5 ? 1 : -1; this.nodes = [{ x: this.W / 2, y: 0 }, { x: this.W / 2, y: -90 }]; this.gems = []; this.x = this.W / 2; this.y = 0; this.cam = -(this.H - this.pb - 130); this.ni = 0; this.gen(); this.d = this.D; this.straight = true; },
      gen: function () {
        var W = this.W;
        while (this.nodes[this.nodes.length - 1].y > this.cam - 300) {
          var L = this.nodes[this.nodes.length - 1], dir = (this.nodes.length % 2) ? this.D : -this.D, len = rnd(o.l0 || 60, o.l1 || 170), lim = dir > 0 ? W - 36 - L.x : L.x - 36;
          if (len > lim) len = Math.max(lim, 26);
          var N = { x: L.x + dir * len, y: L.y - len }; this.nodes.push(N);
          if (Math.random() < (o.gems || 0.35)) { var f = rnd(0.3, 0.7); this.gems.push({ x: L.x + (N.x - L.x) * f, y: L.y + (N.y - L.y) * f }); }
        }
      },
      act: function () { if (this.straight) return; this.d = -this.d; this.acts++; S.flip(); },
      v: function () { return (o.v || 170) * (1 + Math.min(this.t, 80) * (o.ramp || 0.008)); },
      step: function (dt) {
        var v = this.v(), i, w = o.w || 46;
        if (this.straight) { this.y -= v * dt; if (this.y <= this.nodes[1].y) { this.y = this.nodes[1].y; this.straight = false; this.ni = 1; this.d = this.nodes[2].x > this.nodes[1].x ? 1 : -1; } }
        else { this.x += this.d * v * 0.7071 * dt; this.y -= v * 0.7071 * dt; }
        this.cam = this.y - (this.H - this.pb - 130); this.gen();
        while (this.ni < this.nodes.length - 1 && this.y < this.nodes[this.ni + 1].y) { this.ni++; this.add(1); }
        if (!this.straight) {
          var best = 1e9, bx = this.x, bd = this.d;
          for (i = Math.max(1, this.ni - 1); i < Math.min(this.nodes.length - 1, this.ni + 2); i++) {
            var a = this.nodes[i], b = this.nodes[i + 1], t = clamp((a.y - this.y) / (a.y - b.y), 0, 1), ex = a.x + (b.x - a.x) * t, ey = a.y + (b.y - a.y) * t, dd = Math.hypot(this.x - ex, this.y - ey) * (t > 0 && t < 1 ? 0.7071 : 1);
            if (dd < best) { best = dd; bx = ex; bd = b.x > a.x ? 1 : -1; }
          }
          if (best > w / 2 + 2) { this.hurt(); this.x = bx; this.d = bd; }
        }
        for (i = 0; i < this.gems.length; i++) { var g = this.gems[i]; if (!g.got && Math.hypot(g.x - this.x, g.y - this.y) < 24) { g.got = true; this.good(1, g.x, g.y - this.cam); } }
        while (this.nodes.length > 4 && this.nodes[1].y > this.cam + this.H + 100) { this.nodes.shift(); this.ni--; }
        var cam = this.cam, H = this.H; this.gems = this.gems.filter(function (g) { return !g.got && g.y - cam < H + 40; });
      },
      draw: function (now) {
        var c = this.ctx, i, w = o.w || 46, cam = this.cam;
        c.lineJoin = "round"; c.lineCap = "round";
        c.strokeStyle = o.edge || "#17121f"; c.lineWidth = w + 10; c.beginPath(); for (i = 0; i < this.nodes.length; i++) c.lineTo(this.nodes[i].x, this.nodes[i].y - cam); c.stroke();
        c.strokeStyle = o.col || "#f2efe6"; c.lineWidth = w; c.beginPath(); for (i = 0; i < this.nodes.length; i++) c.lineTo(this.nodes[i].x, this.nodes[i].y - cam); c.stroke();
        c.lineJoin = "miter"; c.lineCap = "butt";
        for (i = 0; i < this.gems.length; i++) gem(c, this.gems[i].x, this.gems[i].y - cam, 11, o.gc || "#ff5fd2");
        c.globalAlpha = this.fadeA(); buddy(c, this.x, this.y - cam, 12, o.bc || "#ff4d6d", this.d); c.globalAlpha = 1;
        this.ghost(this.W * 0.72, this.y - cam - 40, now);
      }
    });
    regD("zz_" + o.id, o.name, o.how, o.acc, C, o.scene || "sky");
  }
  [
    { id: "base", name: "Diagonal", how: "Tocá para doblar. Seguí el camino sin caerte.", acc: "#ff4d6d" },
    { id: "fast", name: "Diagonal veloz", how: "El mismo camino, mucho más rápido.", v: 240, acc: "#ff9f1c" },
    { id: "thin", name: "Camino finito", how: "El camino es angosto. Doblá justo en la esquina.", w: 30, acc: "#c77dff" },
    { id: "short", name: "Curvas cortas", how: "Curvas una atrás de otra. Tocá rápido.", l0: 34, l1: 80, v: 150, acc: "#3ddc84" },
    { id: "gem", name: "Camino de gemas", how: "Lleno de gemas. Juntalas todas.", gems: 0.9, acc: "#ff5fd2", scene: "cave" },
    { id: "turbo", name: "Diagonal turbo", how: "Arranca tranqui y acelera sin parar.", ramp: 0.025, v: 140, acc: "#ffd23f" },
    { id: "snow", name: "Pista de nieve", how: "Bajá doblando por la pista blanca.", col: "#ffffff", edge: "#6b7d99", bc: "#ff9f1c", acc: "#f2f2f2", scene: "snow" },
    { id: "long", name: "Rectas largas", how: "Rectas largas a toda velocidad. No te duermas.", l0: 120, l1: 230, v: 260, acc: "#ffd23f", scene: "desert" },
    { id: "lava", name: "Puente sobre lava", how: "Un camino oscuro sobre la lava. Doblá a tiempo.", col: "#55555f", edge: "#ff6a3d", bc: "#ffd23f", acc: "#ff6a3d", scene: "volcano" },
    { id: "mix", name: "Diagonal loca", how: "Curvas cortas y rectas largas mezcladas.", l0: 30, l1: 220, v: 190, w: 40, acc: "#3ddc84", scene: "space" }
  ].forEach(mkZig);

  /* --- 7. Pila de saltos: tocá para saltar arriba del bloque que viene --- */
  function mkSJ(o) {
    var C = G("SJ_" + o.id, {
      init: function () { this.n = 0; this.bh = o.bh || 30; this.bw = o.bw || 96; this.h = 0; this.vy = 0; this.blk = null; this.wait = 0.7; this.base = this.H - this.pb - 150; this.sh = 0; this.cols = o.cols || ["#ff9f1c", "#ff5fd2", "#3ddc84", "#ffd23f", "#c77dff"]; this.side = 1; },
      act: function () { if (this.h <= 0.5) { this.vy = o.jump || 560; this.acts++; sfx(560, 0.07, "triangle", 0.05, 1.5); } },
      step: function (dt) {
        var g = o.g || 1700; if (this.h > 0 || this.vy > 0) { this.h += this.vy * dt; this.vy -= g * dt; if (this.h <= 0) { this.h = 0; this.vy = 0; } }
        if (this.sh > 0) this.sh = Math.max(0, this.sh - dt * 220);
        if (!this.blk) { this.wait -= dt; if (this.wait <= 0) { var side = o.both ? (Math.random() < 0.5 ? -1 : 1) : (this.side = -this.side); var v = (o.v || 300) * (1 + Math.min(this.n, 40) * 0.015) * (o.var ? rnd(0.7, 1.5) : 1); this.blk = { x: side < 0 ? -this.bw / 2 : this.W + this.bw / 2, dir: -side, v: v, col: this.cols[this.n % this.cols.length] }; } return; }
        var b = this.blk; b.x += b.dir * b.v * dt; var cx = this.W / 2;
        if (!b.hit && Math.abs(b.x - cx) < this.bw / 2 + 12 && this.h < this.bh - 2) { b.hit = true; this.hurt(); }
        if (b.hit) { if (b.x < -this.bw || b.x > this.W + this.bw) { this.blk = null; this.wait = 0.3; } return; }
        if ((b.dir > 0 && b.x >= cx) || (b.dir < 0 && b.x <= cx)) {
          this.n++; var hh = this.h; this.h = Math.max(0, this.h - this.bh); this.sh = this.bh; this.blk = null; this.wait = o.rush ? 0.12 : 0.4;
          if (hh < this.bh + 36 && hh >= this.bh) this.good(2, cx, this.base, true); else this.add(1);
        }
      },
      draw: function (now) {
        var c = this.ctx, top = this.base - this.sh, cx = this.W / 2, i, bw = this.bw, bh = this.bh;
        for (i = 0; i < this.n + 6; i++) { var y = top + i * bh; if (y > this.H) break; var col = this.cols[(this.n - 1 - i + 100 * this.cols.length) % this.cols.length]; this.block(c, cx, y, col); }
        if (this.blk) this.block(c, this.blk.x, this.base - bh, this.blk.col);
        c.globalAlpha = this.fadeA(); buddy(c, cx, top - this.h - 15, 15, o.me || "#f2f2f2"); c.globalAlpha = 1;
        this.ghost(cx + 70, top - 60, now);
      },
      block: function (c, x, y, col) {
        var bw = this.bw, bh = this.bh;
        if (o.skin === "box") spCrate(c, x - bw / 2, y, bw, bh);
        else if (o.skin === "cake") { fillR(c, x - bw / 2, y, bw, bh, 6, col); fillR(c, x - bw / 2, y, bw, 8, 4, "#fff6e6"); for (var k = 0; k < 4; k++) dot(c, x - bw / 2 + 12 + k * (bw - 24) / 3, y + 8, 4, "#fff6e6"); }
        else if (o.skin === "cloud") { dot(c, x - bw * 0.25, y + bh / 2, bh * 0.6, "#f2f2f2"); dot(c, x + bw * 0.2, y + bh / 2, bh * 0.7, "#f2f2f2"); fillR(c, x - bw / 2, y + bh * 0.3, bw, bh * 0.7, bh * 0.35, "#f2f2f2"); }
        else { fillR(c, x - bw / 2, y, bw, bh, 6, col); c.fillStyle = "rgba(255,255,255,0.25)"; c.fillRect(x - bw / 2 + 6, y + 4, bw - 12, 4); }
      }
    });
    regD("sj_" + o.id, o.name, o.how, o.acc, C, o.scene || "city");
  }
  [
    { id: "base", name: "Pila de saltos", how: "Tocá para saltar y caer arriba del bloque que viene.", acc: "#ff9f1c" },
    { id: "fast", name: "Bloques veloces", how: "Los bloques vienen rápido. Saltá a tiempo.", v: 420, acc: "#ff4d6d" },
    { id: "both", name: "De los dos lados", how: "Vienen de cualquier lado. Mirá bien.", both: 1, acc: "#c77dff" },
    { id: "rush", name: "Uno atrás de otro", how: "Sin descanso: un bloque atrás del otro.", rush: 1, acc: "#3ddc84" },
    { id: "var", name: "Velocidad sorpresa", how: "Cada bloque viene a una velocidad distinta.", var: 1, both: 1, acc: "#ffd23f" },
    { id: "tall", name: "Bloques altos", how: "Bloques altos: tenés que saltar antes.", bh: 46, jump: 640, acc: "#ff5fd2" },
    { id: "cake", name: "Torta de pisos", how: "Armá la torta más alta saltando cada piso.", skin: "cake", cols: ["#ff8fa3", "#6b3b1a", "#ffd27a", "#3ddc84"], acc: "#ff8fa3", scene: "kitchen" },
    { id: "box", name: "Torre de cajas", how: "Saltá arriba de cada caja que llega.", skin: "box", bh: 38, acc: "#c98a4a", scene: "build" },
    { id: "cloud", name: "Saltos en las nubes", how: "Poca gravedad: saltás despacio sobre las nubes.", skin: "cloud", g: 900, jump: 420, v: 240, acc: "#f2f2f2", scene: "sky" },
    { id: "crazy", name: "Pila loca", how: "De los dos lados, rápido y con velocidad sorpresa.", both: 1, var: 1, v: 360, acc: "#ff4d6d", scene: "arcade" }
  ].forEach(mkSJ);

  /* --- 8. Ganchos: mantené para agarrarte, soltá para volar --- */
  function mkHook(o) {
    var GAP = o.gap || 190, C = G("Hook_" + o.id, {
      ctl: "hold",
      init: function () { this.hooks = []; this.stars = []; this.saws = []; this.nx = 110; this.camx = 0; this.gen(); var h = this.hooks[0]; this.at = h; this.px = h.x - 50; this.py = h.y + 100; this.L = Math.hypot(50, 100); this.vx = 160; this.vy = 0; this.lastI = 0; },
      gen: function () {
        while (this.nx < this.camx + this.W + 320) {
          var y = this.pt + rnd(40, 150); this.hooks.push({ x: this.nx, y0: y, y: y, i: this.hooks.length, ph: rnd(0, TAU) });
          if (this.hooks.length > 1 && o.stars && Math.random() < 0.75) this.stars.push({ x: this.nx - GAP / 2, y: this.pt + rnd(170, 300) });
          if (this.hooks.length > 2 && o.saw && Math.random() < 0.55) this.saws.push({ x: this.nx - GAP / 2, y: this.pt + rnd(200, 340) });
          this.nx += GAP * rnd(0.85, 1.2);
        }
      },
      press: function () {
        var best = null, bd = 1e9, i; for (i = 0; i < this.hooks.length; i++) { var h = this.hooks[i], d = Math.hypot(h.x - this.px, h.y - this.py); if (h.x > this.px - 40 && d < (o.range || 330) && d < bd) { bd = d; best = h; } }
        if (!best) return; this.at = best; this.L = clamp(bd, 60, o.maxL || 260); this.acts++; S.flip();
        if (best.i > this.lastI) { this.add(best.i - this.lastI > 1 ? 2 : 1); this.lastI = best.i; }
      },
      release: function () { this.at = null; },
      step: function (dt) {
        var i, g = o.g || 900;
        if (o.mv) for (i = 0; i < this.hooks.length; i++) this.hooks[i].y = this.hooks[i].y0 + Math.sin(this.t * 1.6 + this.hooks[i].ph) * 45;
        this.vy += g * dt; this.px += this.vx * dt; this.py += this.vy * dt;
        if (this.at) { var dx = this.px - this.at.x, dy = this.py - this.at.y, d = Math.hypot(dx, dy); if (d > this.L) { var nx = dx / d, ny = dy / d; this.px = this.at.x + nx * this.L; this.py = this.at.y + ny * this.L; var rv = this.vx * nx + this.vy * ny; if (rv > 0) { this.vx -= rv * nx; this.vy -= rv * ny; } } if (o.boost) this.vx += o.boost * dt; }
        var sp = Math.hypot(this.vx, this.vy); if (sp > 900) { this.vx *= 900 / sp; this.vy *= 900 / sp; }
        if (this.py < this.pt + 10) { this.py = this.pt + 10; if (this.vy < 0) this.vy = 0; }
        if (this.py > this.H - this.pb - 30) { this.hurt(); this.respawn(); }
        for (i = 0; i < this.stars.length; i++) { var s = this.stars[i]; if (!s.got && Math.hypot(s.x - this.px, s.y - this.py) < 26) { s.got = true; this.good(1, s.x - this.camx, s.y); } }
        for (i = 0; i < this.saws.length; i++) if (Math.hypot(this.saws[i].x - this.px, this.saws[i].y - this.py) < 30) { if (this.hurt()) return; }
        var tg = this.px - this.W * 0.35; this.camx += (tg - this.camx) * Math.min(1, dt * 5); this.gen();
        var cx = this.camx; this.hooks = this.hooks.filter(function (h) { return h.x > cx - 300; }); this.stars = this.stars.filter(function (s) { return !s.got && s.x > cx - 60; }); this.saws = this.saws.filter(function (s) { return s.x > cx - 60; });
      },
      respawn: function () { var h = null, i; for (i = 0; i < this.hooks.length; i++) if (this.hooks[i].i >= this.lastI) { h = this.hooks[i]; break; } h = h || this.hooks[0]; this.at = h; this.px = h.x - 40; this.py = h.y + 100; this.L = Math.hypot(40, 100); this.vx = 150; this.vy = 0; },
      draw: function (now) {
        var c = this.ctx, ox = -this.camx, i, x;
        for (x = -((this.camx % 24) + 24) % 24 - 24; x < this.W + 24; x += 24) spSpike(c, x, this.H - this.pb, 24, 20);
        for (i = 0; i < this.saws.length; i++) spSaw(c, this.saws[i].x + ox, this.saws[i].y, 20, now / 1000);
        for (i = 0; i < this.stars.length; i++) starG(c, this.stars[i].x + ox, this.stars[i].y);
        for (i = 0; i < this.hooks.length; i++) { var h = this.hooks[i]; if (o.vine) { c.fillStyle = "#2f8f4e"; c.fillRect(h.x + ox - 2, 0, 4, h.y); dot(c, h.x + ox, h.y, 8, "#3ddc84"); } else { dot(c, h.x + ox, h.y, 10, "#d9dde3"); dot(c, h.x + ox, h.y, 4, "#55555f"); } }
        if (this.at) { c.strokeStyle = o.vine ? "#3ddc84" : "#f2efe6"; c.lineWidth = 3; c.beginPath(); c.moveTo(this.at.x + ox, this.at.y); c.lineTo(this.px + ox, this.py); c.stroke(); }
        c.globalAlpha = this.fadeA(); buddy(c, this.px + ox, this.py, 14, o.col || "#ff9f1c", this.vx > 0 ? 1 : -1); c.globalAlpha = 1;
        this.ghostHold(this.W * 0.6, this.cy, now);
      }
    });
    regD("hk_" + o.id, o.name, o.how, o.acc, C, o.scene || "sky");
  }
  [
    { id: "base", name: "Ganchos", how: "Mantené apretado para agarrarte al gancho y soltá para volar. No toques el piso.", acc: "#ff9f1c" },
    { id: "far", name: "Ganchos lejanos", how: "Los ganchos están más separados. Volá lejos.", gap: 250, range: 380, acc: "#ff4d6d" },
    { id: "star", name: "Ganchos con estrellas", how: "Juntá las estrellas mientras te balanceás.", stars: 1, acc: "#ffd23f" },
    { id: "saw", name: "Sierras en el aire", how: "Hay sierras entre los ganchos. Pasales por arriba.", saw: 1, acc: "#ff4d6d", scene: "build" },
    { id: "move", name: "Ganchos que bailan", how: "Los ganchos suben y bajan. Agarralos al vuelo.", mv: 1, acc: "#c77dff" },
    { id: "moon", name: "Columpio lunar", how: "Poca gravedad: volás alto y lento.", g: 480, acc: "#c77dff", scene: "moon" },
    { id: "fast", name: "Columpio turbo", how: "Gravedad fuerte y más impulso. Todo rápido.", g: 1300, boost: 160, acc: "#3ddc84" },
    { id: "short", name: "Soga corta", how: "La soga es cortita. Más saltos, más rápidos.", maxL: 120, gap: 160, acc: "#ff5fd2" },
    { id: "vine", name: "Lianas", how: "Agarrate de las lianas de la selva y saltá.", vine: 1, col: "#f2b48a", acc: "#3ddc84", scene: "forest" },
    { id: "mix", name: "Ganchos locos", how: "Ganchos que bailan, sierras y estrellas.", mv: 1, saw: 1, stars: 1, acc: "#ffd23f", scene: "storm" }
  ].forEach(mkHook);

  /* --- 9. Volcadas: tocá para hacer picar la pelota y meterla en el aro --- */
  function mkDunk(o) {
    var C = G("Dunk_" + o.id, {
      init: function () { this.br = 13; this.x = this.W / 2; this.y = this.cy; this.vy = 0; this.wait = true; this.hw = o.hw || 36; this.side = -1; this.hoop(); this.vx = this.side * (o.vx || 150); this.touch = false; },
      hoop: function () { this.side = -this.side; this.hx0 = this.side < 0 ? 26 + this.hw : this.W - 26 - this.hw - 30; this.hy0 = rnd(this.pt + 110, this.H - this.pb - 200); this.hx = this.hx0; this.hy = this.hy0; },
      act: function () { this.wait = false; this.vy = -(o.jump || 430); this.acts++; sfx(380, 0.07, "triangle", 0.05, 1.4); },
      step: function (dt) {
        if (o.mv) this.hy = this.hy0 + Math.sin(this.t * 1.6) * 60;
        if (o.sl) this.hx = this.hx0 + (Math.sin(this.t * 1.3) * 0.5 + 0.5) * 70 * -this.side;
        if (this.wait) return;
        if (o.wind) this.vx += Math.sin(this.t * 0.6) * o.wind * dt;
        var py = this.y, br = this.br, W = this.W, k;
        this.vy += (o.g || 1000) * dt; this.x += this.vx * dt; this.y += this.vy * dt;
        if (this.x < br) { this.x = br; this.vx = Math.abs(this.vx); } if (this.x > W - br) { this.x = W - br; this.vx = -Math.abs(this.vx); }
        if (this.y < this.pt + br) { this.y = this.pt + br; this.vy = Math.abs(this.vy) * 0.3; }
        for (k = -1; k <= 1; k += 2) { var rx = this.hx + k * this.hw, dx = this.x - rx, dy = this.y - this.hy, d = Math.hypot(dx, dy); if (d < br + 4 && d > 0) { var nx = dx / d, ny = dy / d, vn = this.vx * nx + this.vy * ny; this.x = rx + nx * (br + 4); this.y = this.hy + ny * (br + 4); if (vn < 0) { this.vx -= 1.6 * vn * nx; this.vy -= 1.6 * vn * ny; } this.touch = true; } }
        if (py < this.hy && this.y >= this.hy && Math.abs(this.x - this.hx) < this.hw - 4) { if (!this.touch) this.good(2, this.hx, this.hy, true); else this.add(1); this.touch = false; this.hoop(); this.vx = this.side * Math.abs(this.vx); }
        if (this.y > this.H - this.pb - br) { this.hurt(); this.x = W / 2; this.y = this.cy; this.vy = 0; this.wait = true; this.touch = false; }
      },
      draw: function (now) {
        var c = this.ctx, hx = this.hx, hy = this.hy, hw = this.hw, bx = this.side < 0 ? hx - hw - 12 : hx + hw + 6;
        fillR(c, bx, hy - 74, 6, 92, 3, "#f2f2f2"); c.fillStyle = "#9aa1ab"; c.fillRect(this.side < 0 ? 0 : bx + 6, hy - 30, this.side < 0 ? bx : this.W - bx - 6, 5);
        c.strokeStyle = "rgba(255,255,255,0.75)"; c.lineWidth = 2; for (var k = 0; k <= 4; k++) { c.beginPath(); c.moveTo(hx - hw + k * hw / 2, hy); c.lineTo(hx - hw * 0.6 + k * hw * 0.3, hy + 34); c.stroke(); }
        c.globalAlpha = this.fadeA(); spBallLines(c, this.x, this.y, this.br, o.bc || "#ff8a3d"); c.globalAlpha = 1;
        fillR(c, hx - hw - 4, hy - 3, hw * 2 + 8, 7, 3, "#ff4d6d");
        this.ghost(this.x + 40, this.y + 30, now);
      }
    });
    regD("dk_" + o.id, o.name, o.how, o.acc, C, o.scene || "court");
  }
  [
    { id: "base", name: "Volcadas", how: "Tocá para que la pelota pique hacia arriba. Metela en el aro desde arriba.", acc: "#ff9f1c" },
    { id: "small", name: "Aro chiquito", how: "El aro es más chico. Si no toca el aro, vale doble.", hw: 27, acc: "#ff4d6d" },
    { id: "move", name: "Aro que sube y baja", how: "El aro no se queda quieto.", mv: 1, acc: "#c77dff" },
    { id: "slide", name: "Aro que se corre", how: "El aro se mueve a los costados.", sl: 1, acc: "#3ddc84" },
    { id: "fast", name: "Pelota rápida", how: "La pelota cruza la cancha muy rápido.", vx: 240, acc: "#ffd23f" },
    { id: "heavy", name: "Pelota pesada", how: "Cae rápido y salta fuerte.", g: 1600, jump: 560, acc: "#ff4d6d" },
    { id: "moon", name: "Volcadas lunares", how: "En la luna la pelota flota.", g: 520, jump: 300, acc: "#c77dff", scene: "moon" },
    { id: "wind", name: "Volcadas con viento", how: "El viento empuja la pelota de un lado al otro.", wind: 120, acc: "#f2f2f2", scene: "storm" },
    { id: "beach", name: "Volcadas en la playa", how: "Una pelota de playa liviana y un aro móvil.", g: 800, jump: 380, mv: 1, bc: "#ff5fd2", acc: "#ffd23f", scene: "beach" },
    { id: "mix", name: "Volcadas locas", how: "Aro chico que se mueve y pelota rápida.", hw: 30, mv: 1, sl: 1, vx: 200, acc: "#ff5fd2", scene: "arcade" }
  ].forEach(mkDunk);

  /* --- 10. Puente: mantené para estirar el palo, soltá para cruzar --- */
  function mkBridge(o) {
    var C = G("Bridge_" + o.id, {
      ctl: "hold",
      init: function () { this.top = this.H - this.pb - 170; this.cur = { x: 20, w: 80 }; this.nxt = this.mk(this.cur); this.L = 0; this.ph = "idle"; this.a = 0; this.camx = 0; this.mx = this.cur.x + this.cur.w - 14; this.fall = 0; this.gd = 1; },
      mk: function (cur) { var w = rnd(o.w0 || 40, o.w1 || 90), d = rnd(o.d0 || 50, o.d1 || 210); d = Math.min(d, this.W - 60 - cur.w - w); d = Math.max(d, 30); var x = cur.x + cur.w + d; return { x: x, w: w, bx: x, ph: rnd(0, TAU) }; },
      press: function () { if (this.ph === "idle") { this.ph = "grow"; this.L = 0; this.gd = 1; } },
      release: function () { if (this.ph === "grow") { this.ph = "rot"; this.a = 0; this.acts++; sfx(300, 0.1, "square", 0.04, 0.8); } },
      step: function (dt) {
        var gs = o.gs || 380;
        if (o.move && (this.ph === "idle" || this.ph === "grow")) this.nxt.x = this.nxt.bx + Math.sin(this.t * 1.5 + this.nxt.ph) * 36;
        if (this.ph === "grow") { if (o.osc) { this.L += this.gd * gs * dt; if (this.L > this.W * 0.85) this.gd = -1; if (this.L < 0) { this.L = 0; this.gd = 1; } } else this.L = Math.min(this.L + gs * dt, this.W * 1.2); }
        else if (this.ph === "rot") { this.a = Math.min(1, this.a + dt / 0.26); if (this.a >= 1) { var tip = this.cur.x + this.cur.w + this.L, n = this.nxt; if (tip >= n.x && tip <= n.x + n.w) { this.ph = "walk"; this.tx = n.x + n.w - 14; if (Math.abs(tip - (n.x + n.w / 2)) < 7) this.good(2, 0, 0, true); else this.add(1); } else { this.ph = "fail"; this.tx = tip; } } }
        else if (this.ph === "walk" || this.ph === "fail") { this.mx += 300 * dt; if (this.mx >= this.tx) { this.mx = this.tx; if (this.ph === "walk") { this.cur = { x: this.nxt.x, w: this.nxt.w }; this.nxt = this.mk(this.cur); this.ph = "idle"; this.L = 0; } else { this.ph = "drop"; this.fall = 0; } } }
        else if (this.ph === "drop") { this.fall += dt; if (this.fall > 0.55) { this.hurt(); this.ph = "idle"; this.L = 0; this.mx = this.cur.x + this.cur.w - 14; } }
        var tg = this.cur.x - 30; this.camx += (tg - this.camx) * Math.min(1, dt * 6);
      },
      pillar: function (c, x, w, mid) { fillR(c, x, this.top, w, this.H - this.top + 10, 4, o.pc || "#2b2b33"); c.fillStyle = o.cap || "#3ddc84"; c.fillRect(x, this.top, w, 6); if (mid) { c.fillStyle = "#ff4d6d"; c.fillRect(x + w / 2 - 4, this.top, 8, 6); } },
      draw: function (now) {
        var c = this.ctx, ox = -this.camx, ang;
        this.pillar(c, this.cur.x + ox, this.cur.w, false); this.pillar(c, this.nxt.x + ox, this.nxt.w, true);
        if (this.ph === "idle" || this.ph === "grow") ang = -PI / 2; else if (this.ph === "rot") ang = -PI / 2 + this.a * PI / 2; else if (this.ph === "drop") ang = Math.min(PI / 2, this.fall * 6); else ang = 0;
        c.save(); c.translate(this.cur.x + this.cur.w + ox, this.top); c.rotate(ang); c.fillStyle = o.sc || "#c98a4a"; c.fillRect(0, -3, this.L, 6); c.restore();
        var yy = this.top - 14 + (this.ph === "drop" ? this.fall * this.fall * 2400 : 0);
        c.globalAlpha = this.fadeA(); buddy(c, this.mx + ox, yy, 13, o.col || "#ff9f1c", 1); c.globalAlpha = 1;
        this.ghostHold(this.W * 0.6, this.top - 140, now);
      }
    });
    regD("br_" + o.id, o.name, o.how, o.acc, C, o.scene || "city");
  }
  [
    { id: "base", name: "Puente", how: "Mantené apretado para estirar el palo y soltá. Tiene que llegar justo a la otra columna.", acc: "#ff9f1c" },
    { id: "fast", name: "Palo veloz", how: "El palo crece muy rápido. Soltá antes.", gs: 620, acc: "#ff4d6d" },
    { id: "thin", name: "Columnas finitas", how: "Las columnas son angostas. Precisión total.", w0: 18, w1: 40, acc: "#c77dff" },
    { id: "far", name: "Muy lejos", how: "Las columnas están lejos y son chicas.", d0: 150, d1: 260, w0: 24, w1: 50, acc: "#ffd23f" },
    { id: "move", name: "Columna que baila", how: "La columna de enfrente se mueve.", move: 1, acc: "#3ddc84" },
    { id: "osc", name: "Palo que sube y baja", how: "El palo crece y se achica. Soltá en el momento justo.", osc: 1, gs: 420, acc: "#ff5fd2" },
    { id: "slow", name: "Palo lento", how: "Crece despacio, pero las columnas son finitas.", gs: 220, w0: 16, w1: 34, acc: "#f2f2f2" },
    { id: "night", name: "Puente de noche", how: "Cruzá los edificios de noche.", pc: "#17121f", cap: "#ffd23f", acc: "#ffd23f", scene: "city" },
    { id: "forest", name: "Puente de troncos", how: "Cruzá entre los troncos del bosque.", pc: "#6b4423", cap: "#3ddc84", sc: "#8a5a2b", col: "#ffd23f", acc: "#3ddc84", scene: "forest" },
    { id: "pro", name: "Puente pro", how: "Columnas finitas que se mueven y palo rápido.", w0: 18, w1: 36, move: 1, gs: 520, acc: "#ff4d6d", scene: "storm" }
  ].forEach(mkBridge);
