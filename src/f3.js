
  /* --- Puntería de tiempo (parar en la zona) --- */
  function mkTime(o) {
    var C = G("Time_" + o.id, {
      init: function () { this.u = rnd(0, 6); this.zw = o.zw || 0.22; this.pos = 0.5; this.zc = 0.5; this.rz(); },
      rz: function () { this.zc = rnd(this.zw / 2 + 0.06, 1 - this.zw / 2 - 0.06); },
      act: function () {
        var d = Math.abs(this.pos - this.zc); this.acts++;
        if (d <= this.zw / 2) { this.add(d < this.zw * 0.15 ? 2 : 1); if (d < this.zw * 0.15) S.perfect(); else S.hit(this.score); this.zw = Math.max(0.07, this.zw * 0.95); this.rz(); }
        else this.hurt();
      },
      step: function (dt) {
        this.u += dt * (o.sp + Math.min(o.sp, this.score * 0.02));
        var f = this.u % 2; this.pos = o.saw ? this.u % 1 : (f < 1 ? f : 2 - f);
        if (o.sin) this.pos = 0.5 - 0.5 * Math.cos(this.u * PI);
      },
      draw: function (now) {
        var c = this.ctx, cx = this.cx - 30, cy = this.cy, p = this.pos, z0 = this.zc - this.zw / 2, z1 = this.zc + this.zw / 2, tw = this.W - 100;
        if (o.type === "bar") {
          fillR(c, 24, cy - 28, tw, 56, 14, "#1f1f1f"); fillR(c, 24 + z0 * tw, cy - 28, this.zw * tw, 56, 14, o.zc || GRN); fillR(c, 24 + p * tw - 3, cy - 40, 6, 80, 3, "#fff");
        } else if (o.type === "vert") {
          var h = this.H - this.pb - this.pt - 120, y0 = this.pt + 60; fillR(c, cx - 30, y0, 60, h, 14, "#1f1f1f"); fillR(c, cx - 30, y0 + (1 - z1) * h, 60, this.zw * h, 14, o.zc || GRN);
          if (o.fill) fillR(c, cx - 22, y0 + (1 - p) * h, 44, p * h, 8, "#fff"); else fillR(c, cx - 44, y0 + (1 - p) * h - 3, 88, 6, 3, "#fff");
        } else if (o.type === "ring") {
          c.lineWidth = 26; c.strokeStyle = "#1f1f1f"; c.beginPath(); c.arc(cx, cy, 90, 0, TAU); c.stroke(); c.strokeStyle = o.zc || GRN; c.beginPath(); c.arc(cx, cy, 90, -PI / 2 + z0 * TAU, -PI / 2 + z1 * TAU); c.stroke();
          var a = -PI / 2 + p * TAU; c.strokeStyle = "#fff"; c.lineWidth = 6; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * 104, cy + Math.sin(a) * 104); c.stroke();
        } else if (o.type === "arc") {
          var px = cx, py = this.pt + 40, L = 200, am = 0.9, ang = -am + p * 2 * am; c.lineWidth = 22; c.strokeStyle = "#1f1f1f"; c.beginPath(); c.arc(px, py, L, PI / 2 - am, PI / 2 + am); c.stroke();
          c.strokeStyle = o.zc || GRN; c.beginPath(); c.arc(px, py, L, PI / 2 - am + z0 * 2 * am, PI / 2 - am + z1 * 2 * am); c.stroke();
          var bx = px + Math.sin(ang) * L, by = py + Math.cos(ang) * L; c.strokeStyle = "rgba(255,255,255,0.4)"; c.lineWidth = 2; c.beginPath(); c.moveTo(px, py); c.lineTo(bx, by); c.stroke(); c.fillStyle = "#fff"; c.beginPath(); c.arc(bx, by, 16, 0, TAU); c.fill();
        } else if (o.type === "shrink") {
          var rt = 200 * (1 - this.zc), R = 200 * (1 - p), tol = this.zw * 100; c.lineWidth = 8; c.strokeStyle = "#1f1f1f"; c.beginPath(); c.arc(cx, cy, rt, 0, TAU); c.stroke();
          c.strokeStyle = o.zc || GRN; c.lineWidth = 4; c.beginPath(); c.arc(cx, cy, Math.max(2, rt + tol), 0, TAU); c.stroke(); c.beginPath(); c.arc(cx, cy, Math.max(2, rt - tol), 0, TAU); c.stroke();
          c.strokeStyle = "#fff"; c.lineWidth = 6; c.beginPath(); c.arc(cx, cy, Math.max(2, R), 0, TAU); c.stroke();
        }
        this.ghost(this.cx, this.cy + 150, now);
      }
    });
    reg("p_" + o.id, o.name, o.how, o.acc, C);
  }
  [
    { id: "bar", name: "Frená la barra", how: "Tocá cuando la raya blanca esté en la zona verde.", type: "bar", sp: 0.8, acc: GRN },
    { id: "barf", name: "Barra veloz", how: "Igual, pero la raya va más rápido.", type: "bar", sp: 1.4, acc: YEL },
    { id: "snip", name: "Francotirador", how: "La zona es chiquita. Esperá el momento y tocá.", type: "bar", sp: 1.0, zw: 0.12, acc: RED },
    { id: "lift", name: "Elevador", how: "Tocá cuando el elevador pase por la franja verde.", type: "vert", sp: 0.9, acc: ORA },
    { id: "therm", name: "Termómetro", how: "Tocá cuando la línea llegue a la zona verde.", type: "vert", sp: 1.3, acc: PUR },
    { id: "cup", name: "Llená el vaso", how: "El vaso se llena y se vacía. Tocá cuando el nivel esté en la zona.", type: "vert", fill: 1, sp: 0.8, acc: PNK },
    { id: "needle", name: "Aguja", how: "Tocá cuando la aguja pase por el tramo verde del círculo.", type: "ring", saw: 1, sp: 0.5, acc: GRN },
    { id: "secs", name: "Segundero", how: "Igual que la aguja, pero más rápida.", type: "ring", saw: 1, sp: 0.85, acc: YEL },
    { id: "pend", name: "Péndulo", how: "Tocá cuando la bola pase por el tramo verde.", type: "arc", sp: 0.8, acc: RED },
    { id: "pendf", name: "Péndulo loco", how: "El péndulo es veloz y la zona chica.", type: "arc", sp: 1.3, zw: 0.14, acc: PUR },
    { id: "shr", name: "Círculo que se achica", how: "Tocá cuando el círculo blanco coincida con el aro verde.", type: "shrink", saw: 1, sp: 0.45, acc: ORA },
    { id: "shrf", name: "Aros veloces", how: "El círculo se achica rápido. Tocá justo en el aro.", type: "shrink", saw: 1, sp: 0.8, acc: PNK }
  ].forEach(function (v) { v.zc = GRN; mkTime(v); });

  /* --- Corredores (tocar para saltar) --- */
  function mkRun(o) {
    var C = G("Run_" + o.id, {
      ctl: "hold",
      init: function () { this.gx = this.W * 0.22; this.gy = this.H - this.pb + 14; this.ps = 34; this.py = this.gy - this.ps; this.vy = 0; this.onG = true; this.jumps = 0; this.obs = []; this.spawn = 1.2; this.scroll = 0; },
      press: function () { if (this.onG) { this.vy = -o.jv; this.onG = false; this.jumps = 1; sfx(500, 0.1, "sine", 0.05, 1.5); } else if (o.dbl && this.jumps < 2) { this.vy = -o.jv * 0.9; this.jumps = 2; sfx(650, 0.1, "sine", 0.05, 1.5); } this.acts++; },
      sp: function () { return o.sp + Math.min(150, this.score * 3); },
      step: function (dt) {
        this.vy += o.g * ((this.holding && this.vy < 0) ? 0.6 : 1) * dt; this.py += this.vy * dt; var v = this.sp();
        if (this.py >= this.gy - this.ps) { this.py = this.gy - this.ps; this.vy = 0; this.onG = true; this.jumps = 0; } else this.onG = false;
        this.scroll += v * dt; this.spawn -= dt;
        if (this.spawn <= 0) {
          var tp = pickOf(o.types), ob = { type: tp, x: this.W + 20, p: false };
          if (tp === "block") { ob.w = rnd(26, 40); ob.h = rnd(30, 62); } else if (tp === "spike") { ob.w = 32; ob.h = 30; } else if (tp === "tall") { ob.w = 26; ob.h = rnd(80, 96); } else if (tp === "pit") { ob.w = rnd(70, 100); ob.h = 0; } else if (tp === "fly") { ob.w = 56; ob.h = 14; ob.y = this.gy - rnd(64, 84); }
          this.obs.push(ob); this.spawn = (rnd(0.9, 1.6) * (260 / v)) + 0.3 + (tp === "pit" ? ob.w / v : 0);
        }
        for (var i = this.obs.length - 1; i >= 0; i--) {
          var b = this.obs[i]; b.x -= v * dt; if (!b.p && b.x + b.w < this.gx - this.ps / 2) { b.p = true; this.add(1); }
          if (this.invuln <= 0) {
            var hit = false, l = this.gx - this.ps / 2 + 5, r = this.gx + this.ps / 2 - 5;
            if (b.type === "pit") hit = this.onG && this.gx > b.x + 4 && this.gx < b.x + b.w - 4;
            else if (b.type === "fly") hit = r > b.x && l < b.x + b.w && this.py < b.y + b.h && this.py + this.ps > b.y;
            else hit = r > b.x + 3 && l < b.x + b.w - 3 && this.py + this.ps - 4 > this.gy - b.h;
            if (hit) { this.hurt(); if (this.state !== "play") return; }
          }
          if (b.x < -120) this.obs.splice(i, 1);
        }
      },
      idle: function (dt) { this.scroll += 120 * dt; },
      draw: function (now) {
        var c = this.ctx, i; c.fillStyle = "#262626"; c.fillRect(0, this.gy, this.W, this.H - this.gy);
        for (i = 0; i < this.obs.length; i++) {
          var b = this.obs[i];
          if (b.type === "pit") { c.fillStyle = "#000"; c.fillRect(b.x, this.gy, b.w, this.H - this.gy); }
          else if (b.type === "spike") { c.fillStyle = "#fff"; c.beginPath(); c.moveTo(b.x, this.gy); c.lineTo(b.x + b.w / 2, this.gy - b.h); c.lineTo(b.x + b.w, this.gy); c.closePath(); c.fill(); }
          else if (b.type === "fly") fillR(c, b.x, b.y, b.w, b.h, 6, RED);
          else fillR(c, b.x, this.gy - b.h, b.w, b.h, 4, b.type === "tall" ? ORA : "#f2f2f2");
        }
        if (!this.blink()) { c.fillStyle = o.col || ORA; if (o.round) { c.beginPath(); c.arc(this.gx, this.py + this.ps / 2, this.ps / 2, 0, TAU); c.fill(); } else fillR(c, this.gx - this.ps / 2, this.py, this.ps, this.ps, 8, o.col || ORA); face(c, this.gx + 3, this.py + this.ps / 2, this.ps / 2, 1); }
        this.ghost(this.gx + 100, this.py - 40, now);
      }
    });
    reg("r_" + o.id, o.name, o.how, o.col, C);
  }
  [
    { id: "box", name: "Cajas", how: "Apretá para saltar las cajas. Si mantenés, saltás más alto.", types: ["block"], sp: 250, g: 3000, jv: 700, col: GRN },
    { id: "spk", name: "Pinchos del piso", how: "Apretá para saltar los pinchos. Si mantenés, saltás más alto.", types: ["spike"], sp: 260, g: 3000, jv: 680, col: PNK, round: 1 },
    { id: "wall", name: "Murallas", how: "Mantené apretado para saltar alto las murallas.", types: ["tall"], sp: 240, g: 2600, jv: 760, col: ORA },
    { id: "pit", name: "Pozos", how: "Apretá para saltar los pozos. Si mantenés, llegás más lejos.", types: ["pit"], sp: 270, g: 3000, jv: 720, col: YEL },
    { id: "low", name: "Bajo vuelo", how: "Hay barras en el aire: no saltes cuando vengan. Saltá solo las cajas.", types: ["block", "fly"], sp: 250, g: 3000, jv: 700, col: RED },
    { id: "mix", name: "Obstáculos", how: "Cajas, pinchos y pozos. Apretá para saltar, mantené para ir más alto.", types: ["block", "spike", "pit"], sp: 260, g: 3000, jv: 700, col: PUR },
    { id: "dbl", name: "Doble salto", how: "Apretá otra vez en el aire para dar un segundo salto.", types: ["tall", "block", "pit"], sp: 250, g: 3000, jv: 640, dbl: 1, col: GRN },
    { id: "moon", name: "Luna", how: "Hay poca gravedad: saltás alto y flotás.", types: ["block", "spike"], sp: 240, g: 1300, jv: 520, col: "#e6e6e6", round: 1 },
    { id: "turbo", name: "Turbo", how: "Corre rápido desde el principio.", types: ["block", "spike", "pit"], sp: 380, g: 3200, jv: 720, col: RED },
    { id: "mara", name: "Maratón", how: "De todo un poco: cajas, pinchos, pozos y barras voladoras.", types: ["block", "spike", "pit", "fly", "tall"], sp: 270, g: 3000, jv: 710, col: ORA }
  ].forEach(mkRun);

  /* --- Tiradores (arrastrar, dispara solo) --- */
  function mkShoot(o) {
    var C = G("Shoot_" + o.id, {
      ctl: "drag",
      init: function () { this.px = this.cx; this.tx = this.px; this.py = this.H - this.pb - 18; this.bul = []; this.en = []; this.eb = []; this.fire = 0; this.spawn = 0.6; this.t2 = 0; },
      drag: function (x) { this.tx = clamp(x, 18, this.W - 18); },
      step: function (dt) {
        var i, j, e; this.px += (this.tx - this.px) * Math.min(1, dt * 20); this.t2 += dt;
        this.fire -= dt; if (this.fire <= 0) { this.fire = o.fi || 0.34; this.bul.push({ x: this.px, y: this.py - 14 }); }
        this.spawn -= dt;
        if (this.spawn <= 0) {
          this.spawn = Math.max(o.min || 0.35, o.iv - this.score * 0.01); var tp = pickOf(o.types), n = o.pack ? ri(2, 5) : 1;
          while (n--) { var w = tp.w + rnd(-4, 4); this.en.push({ x: rnd(w, this.W - w), y: -w, w: w, hp: tp.hp, hp0: tp.hp, v: tp.v + rnd(-15, 15) + Math.min(80, this.score), ph: rnd(0, 6), fr: tp.fr ? 1 : 0, sh: rnd(1, 3), x0: 0 }); this.en[this.en.length - 1].x0 = this.en[this.en.length - 1].x; }
        }
        for (i = this.bul.length - 1; i >= 0; i--) { var b = this.bul[i]; b.y -= 560 * dt; if (b.y < -10) this.bul.splice(i, 1); }
        for (i = this.en.length - 1; i >= 0; i--) {
          e = this.en[i]; e.y += e.v * dt; e.ph += dt * 3; if (o.sway) e.x = clamp(e.x0 + Math.sin(e.ph) * o.sway, e.w, this.W - e.w);
          if (o.shoot) { e.sh -= dt; if (e.sh <= 0 && e.y > 0 && e.y < this.py - 150) { e.sh = rnd(1.4, 2.6); this.eb.push({ x: e.x, y: e.y + e.w / 2 }); } }
          var dead = false;
          for (j = this.bul.length - 1; j >= 0; j--) { b = this.bul[j]; if (Math.abs(b.x - e.x) < e.w / 2 + 3 && Math.abs(b.y - e.y) < e.w / 2 + 6) { this.bul.splice(j, 1); e.hp--; if (e.hp <= 0) { dead = true; break; } } }
          if (dead) { this.en.splice(i, 1); if (e.fr) { this.hurt(); if (this.state !== "play") return; } else { this.add(o.pts || 1); S.hit(this.score); } continue; }
          if (!e.fr && this.invuln <= 0 && Math.abs(e.x - this.px) < e.w / 2 + 12 && Math.abs(e.y - this.py) < e.w / 2 + 10) { this.en.splice(i, 1); this.hurt(); if (this.state !== "play") return; continue; }
          if (e.y > this.py + 20) { this.en.splice(i, 1); if (!e.fr) { this.hurt(); if (this.state !== "play") return; } }
        }
        for (i = this.eb.length - 1; i >= 0; i--) { var q = this.eb[i]; q.y += 260 * dt; if (this.invuln <= 0 && Math.abs(q.x - this.px) < 16 && Math.abs(q.y - this.py) < 14) { this.eb.splice(i, 1); this.hurt(); if (this.state !== "play") return; } else if (q.y > this.H) this.eb.splice(i, 1); }
      },
      draw: function (now) {
        var c = this.ctx, i;
        for (i = 0; i < this.en.length; i++) {
          var e = this.en[i], col = e.fr ? GRN : o.col, k = e.hp / e.hp0; c.fillStyle = k < 1 ? mix(col.length === 7 ? col : "#ff4d6d", 0.35 * (1 - k)) : col;
          if (o.sh === 0) { c.beginPath(); c.arc(e.x, e.y, e.w / 2, 0, TAU); c.fill(); } else if (o.sh === 2) { c.beginPath(); c.moveTo(e.x, e.y + e.w / 2); c.lineTo(e.x + e.w / 2, e.y - e.w / 2); c.lineTo(e.x - e.w / 2, e.y - e.w / 2); c.closePath(); c.fill(); } else if (o.sh === 3) { c.beginPath(); c.ellipse(e.x, e.y, e.w / 2, e.w / 3.2, 0, 0, TAU); c.fill(); } else fillR(c, e.x - e.w / 2, e.y - e.w / 2, e.w, e.w, 6, col);
        }
        c.fillStyle = "#fff"; for (i = 0; i < this.bul.length; i++) c.fillRect(this.bul[i].x - 2, this.bul[i].y - 8, 4, 14);
        c.fillStyle = RED; for (i = 0; i < this.eb.length; i++) c.fillRect(this.eb[i].x - 3, this.eb[i].y - 6, 6, 12);
        if (!this.blink()) { c.fillStyle = "#fff"; c.beginPath(); c.moveTo(this.px, this.py - 16); c.lineTo(this.px + 16, this.py + 10); c.lineTo(this.px - 16, this.py + 10); c.closePath(); c.fill(); }
        this.ghostDrag(this.py - 80, now);
      }
    });
    reg("s_" + o.id, o.name, o.how, o.col, C);
  }
  [
    { id: "met", name: "Rocas al aire", how: "Arrastrá la nave. Dispara sola. Rompé las rocas antes de que bajen.", sh: 0, col: GRY, types: [{ w: 34, hp: 1, v: 110 }, { w: 48, hp: 2, v: 90 }], iv: 0.9 },
    { id: "tank", name: "Tanques", how: "Los tanques aguantan varios disparos. No dejes que lleguen abajo.", sh: 1, col: ORA, types: [{ w: 44, hp: 4, v: 55 }], iv: 1.5, min: 0.9, pts: 2 },
    { id: "ufo", name: "Platillos enemigos", how: "Los platillos se mueven en zigzag y te disparan.", sh: 3, col: PNK, types: [{ w: 44, hp: 2, v: 70 }], iv: 1.3, min: 0.7, sway: 90, shoot: 1 },
    { id: "bal", name: "Globos al blanco", how: "Reventá los globos antes de que se escapen abajo.", sh: 0, col: RED, types: [{ w: 54, hp: 1, v: 60 }], iv: 0.9, fi: 0.3 },
    { id: "bug", name: "Insectos", how: "Pequeños y rápidos. Dispará y movete.", sh: 0, col: GRN, types: [{ w: 22, hp: 1, v: 150 }], iv: 0.55, min: 0.3, sway: 50 },
    { id: "swm", name: "Enjambre", how: "Vienen muchos juntos. Barré con la nave.", sh: 1, col: YEL, types: [{ w: 22, hp: 1, v: 120 }], iv: 1.2, min: 0.8, pack: 1, fi: 0.22 },
    { id: "boss", name: "Jefes", how: "Aparecen enemigos enormes que aguantan muchos disparos.", sh: 1, col: PUR, types: [{ w: 100, hp: 14, v: 28 }, { w: 30, hp: 1, v: 110 }], iv: 1.6, min: 0.9, pts: 3 },
    { id: "frd", name: "No disparés a los verdes", how: "Los verdes son amigos: si les pegás perdés una vida.", sh: 0, col: RED, types: [{ w: 36, hp: 1, v: 110 }, { w: 36, hp: 1, v: 110, fr: 1 }], iv: 0.7 },
    { id: "bom", name: "Bombardeo", how: "Los enemigos tiran bombas. Esquivalas y dispará.", sh: 2, col: ORA, types: [{ w: 34, hp: 1, v: 65 }], iv: 1.0, min: 0.6, shoot: 1 },
    { id: "rkt", name: "Cohetes", how: "Cohetes finos y veloces caen desde arriba.", sh: 2, col: RED, types: [{ w: 24, hp: 1, v: 200 }], iv: 0.6, min: 0.35, fi: 0.28 }
  ].forEach(mkShoot);

  /* --- Paletas (arrastrar) --- */
  function mkPad(o) {
    var C = G("Pad_" + o.id, {
      ctl: "drag",
      init: function () { this.pw = o.pw || 84; this.px = this.cx; this.tx = this.px; this.py = this.H - this.pb - 24; this.balls = []; for (var i = 0; i < (o.n || 1); i++) this.balls.push(this.mkB()); this.sp = o.sp || 320; },
      mkB: function () { var a = rnd(-0.5, 0.5); return { x: rnd(60, this.W - 60), y: this.pt + 40, vx: Math.sin(a) * (o.sp || 320), vy: Math.cos(a) * (o.sp || 320), r: 9 }; },
      drag: function (x) { this.tx = clamp(x, this.pw / 2, this.W - this.pw / 2); },
      step: function (dt) {
        this.px += (this.tx - this.px) * Math.min(1, dt * 22);
        for (var i = 0; i < this.balls.length; i++) {
          var b = this.balls[i]; if (o.g) b.vy += o.g * dt; b.x += b.vx * dt; b.y += b.vy * dt;
          if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx); } if (b.x > this.W - b.r) { b.x = this.W - b.r; b.vx = -Math.abs(b.vx); } if (b.y < this.pt + 4) { b.y = this.pt + 4; b.vy = Math.abs(b.vy); }
          if (b.vy > 0 && b.y + b.r >= this.py && b.y + b.r <= this.py + 20 && Math.abs(b.x - this.px) <= this.pw / 2 + b.r) {
            var a = clamp((b.x - this.px) / (this.pw / 2), -1, 1) * 1.05, s = Math.min(560, Math.hypot(b.vx, b.vy) + (o.acc || 0) + 4); if (o.jit) a += rnd(-0.5, 0.5);
            b.vx = Math.sin(a) * s; b.vy = -Math.max(Math.cos(a) * s, s * 0.45); b.y = this.py - b.r; this.add(1); S.hit(this.score); if (o.shr) this.pw = Math.max(44, this.pw - o.shr);
          }
          if (b.y > this.H - this.pb + 16) { this.hurt(); if (this.state !== "play") return; this.balls[i] = this.mkB(); if (o.shr) this.pw = o.pw || 84; }
        }
      },
      draw: function (now) {
        var c = this.ctx, i; fillR(c, this.px - this.pw / 2, this.py, this.pw, 12, 6, "#fff"); c.fillStyle = o.col;
        for (i = 0; i < this.balls.length; i++) { c.beginPath(); c.arc(this.balls[i].x, this.balls[i].y, this.balls[i].r, 0, TAU); c.fill(); }
        this.ghostDrag(this.py - 80, now);
      }
    });
    reg("w_" + o.id, o.name, o.how, o.col, C);
  }
  [
    { id: "two", name: "Doble pelota", how: "Arrastrá la paleta. Hay dos pelotas, no dejes caer ninguna.", n: 2, col: YEL },
    { id: "gr", name: "Frontón", how: "La pelota cae con gravedad. Arrastrá la paleta para devolverla.", g: 500, sp: 300, col: ORA },
    { id: "acc", name: "Cada vez más rápido", how: "La pelota acelera en cada golpe.", acc: 14, col: RED },
    { id: "mini", name: "Paleta mini", how: "La paleta es chiquita y la pelota rápida.", pw: 50, sp: 380, col: PUR },
    { id: "wild", name: "Pelota loca", how: "La pelota rebota para cualquier lado.", jit: 1, col: PNK },
    { id: "shr", name: "Paleta que se achica", how: "La paleta se achica en cada golpe. Si perdés la pelota vuelve a su tamaño.", shr: 5, col: GRN }
  ].forEach(mkPad);

  /* --- Vuelo (mantener para subir) --- */
  function mkFly(o) {
    var C = G("Fly_" + o.id, {
      ctl: "hold",
      init: function () { this.bx = this.W * 0.28; this.r = 17; this.ground = this.H - this.pb + 14; this.mid = this.pt + (this.ground - this.pt) / 2; this.by = this.mid; this.vy = 0; this.waiting = true; this.obs = []; this.spawn = 0.5; this.gap = clamp(this.H * (o.gap || 0.3), 150, 260); },
      press: function () { this.waiting = false; },
      step: function (dt) {
        if (this.waiting) { this.by = this.mid + Math.sin(this.t * 4) * 8; return; }
        this.vy += (this.holding ? -o.th : o.g) * dt; this.vy = clamp(this.vy, -o.vm, o.vm * 1.2); this.by += this.vy * dt;
        var sp = o.sp + Math.min(80, this.score * 2); this.spawn -= dt;
        if (this.by < this.r + this.pt - 20) { this.by = this.r + this.pt - 20; this.vy = 0; }
        if (this.spawn <= 0) {
          this.spawn = o.iv * (160 / sp) + 0.2; var tp = pickOf(o.types), yy = rnd(this.pt + 50, this.ground - 50);
          if (tp === "pipe") { var m = this.pt + this.gap / 2 + 12, M = this.ground - this.gap / 2 - 12; this.obs.push({ t: "pipe", x: this.W + 10, gy: rnd(m, Math.max(m + 1, M)), w: 56, p: 0 }); }
          else if (tp === "mine") this.obs.push({ t: "mine", x: this.W + 20, y: yy, r: rnd(16, 26) });
          else if (tp === "ring") this.obs.push({ t: "ring", x: this.W + 30, y: yy, r: 50, p: 0 });
          else this.obs.push({ t: "coin", x: this.W + 20, y: yy, r: 12 });
        }
        for (var i = this.obs.length - 1; i >= 0; i--) {
          var b = this.obs[i]; b.x -= sp * dt; var hit = false;
          if (b.t === "pipe") { if (!b.p && b.x + b.w < this.bx) { b.p = 1; this.add(1); } hit = this.bx + this.r > b.x && this.bx - this.r < b.x + b.w && (this.by - this.r < b.gy - this.gap / 2 || this.by + this.r > b.gy + this.gap / 2); }
          else if (b.t === "mine") { if (!b.p && b.x + b.r < this.bx) { b.p = 1; this.add(1); } hit = Math.hypot(b.x - this.bx, b.y - this.by) < b.r + this.r - 3; }
          else if (b.t === "ring") { if (!b.p && b.x < this.bx) { b.p = 1; if (Math.abs(b.y - this.by) < b.r - 6) { this.add(1); S.hit(this.score); } else { hit = true; } } }
          else if (Math.hypot(b.x - this.bx, b.y - this.by) < b.r + this.r) { this.obs.splice(i, 1); this.add(1); S.hit(this.score); continue; }
          if (hit && this.invuln <= 0) { this.hurt(); if (this.state !== "play") return; if (b.t !== "pipe") this.obs.splice(i, 1); else this.by = b.gy; this.vy = 0; continue; }
          if (b.x < -90) this.obs.splice(i, 1);
        }
        if (this.by + this.r > this.ground && this.invuln <= 0) { this.hurt(); if (this.state !== "play") return; this.by = this.mid; this.vy = 0; } else if (this.by + this.r > this.ground) { this.by = this.ground - this.r; this.vy = -150; }
      },
      after: function (dt) { if (this.by + this.r < this.ground) { this.vy += 1450 * dt; this.by = Math.min(this.ground - this.r, this.by + this.vy * dt); } },
      draw: function (now) {
        var c = this.ctx, i; c.fillStyle = "#262626"; c.fillRect(0, this.ground, this.W, this.H - this.ground);
        for (i = 0; i < this.obs.length; i++) {
          var b = this.obs[i];
          if (b.t === "pipe") { fillR(c, b.x, -30, b.w, b.gy - this.gap / 2 + 30, 6, GRN); fillR(c, b.x, b.gy + this.gap / 2, b.w, this.H, 6, GRN); }
          else if (b.t === "mine") { c.fillStyle = "#3a3a3a"; c.beginPath(); c.arc(b.x, b.y, b.r, 0, TAU); c.fill(); c.strokeStyle = RED; c.lineWidth = 3; c.beginPath(); for (var k = 0; k < 8; k++) { var a = k * TAU / 8; c.moveTo(b.x + Math.cos(a) * b.r, b.y + Math.sin(a) * b.r); c.lineTo(b.x + Math.cos(a) * (b.r + 7), b.y + Math.sin(a) * (b.r + 7)); } c.stroke(); }
          else if (b.t === "ring") { c.strokeStyle = b.p ? "#555" : YEL; c.lineWidth = 6; c.beginPath(); c.ellipse(b.x, b.y, 10, b.r, 0, 0, TAU); c.stroke(); }
          else { c.fillStyle = YEL; c.beginPath(); c.arc(b.x, b.y, b.r, 0, TAU); c.fill(); }
        }
        if (!this.blink()) { c.fillStyle = o.col; c.beginPath(); c.arc(this.bx, this.by, this.r, 0, TAU); c.fill(); face(c, this.bx + 2, this.by, this.r, 1); if (this.holding && this.state === "play") { c.fillStyle = ORA; c.beginPath(); c.moveTo(this.bx - 6, this.by + 12); c.lineTo(this.bx + 6, this.by + 12); c.lineTo(this.bx, this.by + 22 + Math.random() * 8); c.closePath(); c.fill(); } }
        this.ghostHold(this.bx, this.by + 80, now);
      }
    });
    reg("f_" + o.id, o.name, o.how, o.col, C);
  }
  [
    { id: "sub", name: "Submarino", how: "Mantené apretado para subir y soltá para bajar. Esquivá las minas.", types: ["mine"], th: 1900, g: 1100, vm: 320, sp: 150, iv: 1.0, col: YEL },
    { id: "drone", name: "Dron", how: "Mantené apretado para subir. Pasá por el medio de los aros.", types: ["ring"], th: 1900, g: 1150, vm: 330, sp: 140, iv: 1.3, col: GRN },
    { id: "heli", name: "Helicóptero", how: "Mantené apretado para subir. Pasá por los huecos angostos.", types: ["pipe"], th: 2000, g: 1250, vm: 340, sp: 160, iv: 1.15, gap: 0.26, col: ORA },
    { id: "jet", name: "Jetpack", how: "Subí con la mochila, juntá monedas y esquivá las minas.", types: ["coin", "coin", "mine"], th: 2000, g: 1200, vm: 340, sp: 160, iv: 0.8, col: PNK },
    { id: "bal", name: "Globo aerostático", how: "Mantené apretado para subir despacio. Pasá por los huecos.", types: ["pipe"], th: 1500, g: 800, vm: 260, sp: 130, iv: 1.3, gap: 0.34, col: RED },
    { id: "comet", name: "Cometa", how: "Las minas vienen rápido. Mantené apretado para subir.", types: ["mine"], th: 2100, g: 1300, vm: 360, sp: 230, iv: 0.8, col: PUR },
    { id: "glide", name: "Planeador", how: "Pasá por los aros suaves. Mantené para subir.", types: ["ring", "coin"], th: 1700, g: 950, vm: 280, sp: 120, iv: 1.2, col: "#e6e6e6" },
    { id: "cave", name: "Cueva", how: "Pasá por el túnel ancho. Mantené para subir.", types: ["pipe"], th: 1900, g: 1150, vm: 320, sp: 190, iv: 0.95, gap: 0.38, col: YEL }
  ].forEach(mkFly);
