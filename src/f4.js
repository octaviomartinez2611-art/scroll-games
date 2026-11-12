
  /* --- Memoria: secuencias y posiciones --- */
  function padLay(g, cols, rows) {
    var uw = g.W - 76, gap = 10, s = Math.min(100, (uw - gap * (cols - 1)) / cols, (g.H - g.pt - g.pb - 100 - gap * (rows - 1)) / rows), w = cols * s + (cols - 1) * gap, h = rows * s + (rows - 1) * gap;
    var x0 = 8 + (uw - w) / 2, y0 = g.cy - h / 2 + 10, p = [];
    for (var i = 0; i < cols * rows; i++) p.push({ x: x0 + (i % cols) * (s + gap), y: y0 + Math.floor(i / cols) * (s + gap), s: s });
    return p;
  }
  function padAt(p, x, y) { for (var i = 0; i < p.length; i++) if (x >= p[i].x && x <= p[i].x + p[i].s && y >= p[i].y && y <= p[i].y + p[i].s) return i; return -1; }
  function mkSeq(o) {
    var C = G("Seq_" + o.id, {
      init: function () { this.n = o.cols * o.rows; this.p = padLay(this, o.cols, o.rows); this.seq = []; this.lit = -1; this.fl = 0; this.addStep(); },
      addStep: function () { this.seq.push(ri(0, this.n)); this.replay(0.8); },
      replay: function (d) { this.phase = "show"; this.si = 0; this.tm = d; this.lit = -1; this.inp = 0; },
      act: function (x, y) {
        if (this.phase !== "input") return; var i = padAt(this.p, x, y); if (i < 0) return; this.acts++; this.fl = 0.15; this.fi = i; sfx(300 + i * 60, 0.15, "triangle", 0.06);
        if (i === this.seq[this.inp]) { this.inp++; if (this.inp === this.seq.length) { this.add(1); this.phase = "gap"; this.tm = 0.7; } }
        else { this.hurt(); if (this.state === "play") this.replay(1.0); }
      },
      step: function (dt) {
        this.fl = Math.max(0, this.fl - dt);
        if (this.phase === "input") return; this.tm -= dt; if (this.tm > 0) return;
        if (this.phase === "gap") { this.addStep(); return; }
        if (this.lit !== -1) { this.lit = -1; this.tm = 0.2; if (this.si >= this.seq.length) this.phase = "input"; }
        else if (this.si < this.seq.length) { this.lit = this.seq[this.si++]; this.tm = Math.max(0.3, 0.6 - this.score * 0.012); sfx(300 + this.lit * 60, 0.2, "triangle", 0.06); }
      },
      draw: function (now) {
        var c = this.ctx, i; for (i = 0; i < this.n; i++) {
          var p = this.p[i], col = o.cols2 ? BCOL[i % 5] : BCOL[i % 5], on = this.lit === i || (this.fl > 0 && this.fi === i);
          fillR(c, p.x, p.y, p.s, p.s, 16, on ? col : mix(col, 0.6, 0)); if (o.nums) txt(c, String(i + 1), p.x + p.s / 2, p.y + p.s / 2 + 1, p.s * 0.45, on ? "#000" : "rgba(255,255,255,0.7)");
          if (!on) { c.fillStyle = "rgba(0,0,0,0.4)"; rr(c, p.x, p.y, p.s, p.s, 16); c.fill(); }
        }
        txt(c, this.phase === "input" ? "Tu turno" : "Mirá", this.cx - 38, this.p[0].y - 28, 20, "rgba(255,255,255,0.7)", "center", 600);
        if (this.phase === "input") this.ghost(this.p[0].x + this.p[0].s / 2, this.p[0].y + this.p[0].s / 2, now);
      }
    });
    reg("m_" + o.id, o.name, o.how, o.acc, C);
  }
  [
    { id: "s2", name: "Secuencia 2×2", how: "Mirá el orden en que se prenden y repetilo tocando.", cols: 2, rows: 2, acc: GRN },
    { id: "s3", name: "Secuencia 3×3", how: "Mirá el orden en que se prenden las casillas y repetilo.", cols: 3, rows: 3, acc: PUR },
    { id: "sn", name: "Secuencia de números", how: "Mirá qué números se prenden y repetí el orden.", cols: 3, rows: 3, nums: 1, acc: YEL },
    { id: "s32", name: "Secuencia 3×2", how: "Mirá el orden y repetilo tocando las casillas.", cols: 3, rows: 2, acc: ORA }
  ].forEach(mkSeq);
  function mkCells(o) {
    var C = G("Cells_" + o.id, {
      init: function () { this.n = o.cols * o.rows; this.p = padLay(this, o.cols, o.rows); this.k = o.k0; this.rounds = 0; this.nr(); },
      nr: function () { var a = shuf(Array.apply(null, { length: this.n }).map(function (_, i) { return i; })); this.tg = a.slice(0, this.k); this.found = {}; this.cnt = 0; this.phase = "show"; this.tm = 1.0 + 0.12 * this.k; this.wrong = -1; },
      act: function (x, y) {
        if (this.phase !== "input") return; var i = padAt(this.p, x, y); if (i < 0 || this.found[i]) return; this.acts++;
        if (this.tg.indexOf(i) >= 0) { this.found[i] = 1; this.cnt++; S.hit(this.cnt); if (this.cnt === this.k) { this.add(1); this.rounds++; if (this.rounds % 2 === 0 && this.k < this.n * 0.55) this.k++; this.phase = "gap"; this.tm = 0.6; } }
        else { this.wrong = i; this.hurt(); if (this.state === "play") { this.phase = "gap2"; this.tm = 0.7; } }
      },
      step: function (dt) {
        if (this.phase === "input") return; this.tm -= dt; if (this.tm > 0) return;
        if (this.phase === "show") { this.phase = "input"; } else if (this.phase === "gap") this.nr(); else if (this.phase === "gap2") { this.phase = "show"; this.tm = 1.0; this.found = {}; this.cnt = 0; this.wrong = -1; }
      },
      draw: function (now) {
        var c = this.ctx, i; for (i = 0; i < this.n; i++) {
          var p = this.p[i], on = this.phase === "show" && this.tg.indexOf(i) >= 0 || this.found[i], col = on ? YEL : this.wrong === i ? RED : "#262626"; fillR(c, p.x + 2, p.y + 2, p.s - 4, p.s - 4, 10, col);
        }
        txt(c, this.phase === "show" ? "Memorizá" : "Tocá las casillas", this.cx - 38, this.p[0].y - 24, 20, "rgba(255,255,255,0.7)", "center", 600);
        if (this.phase === "input") this.ghost(this.p[0].x + this.p[0].s / 2, this.p[0].y + this.p[0].s / 2, now);
      }
    });
    reg("e_" + o.id, o.name, o.how, o.acc, C);
  }
  [
    { id: "c3", name: "Posiciones 3×3", how: "Memorizá qué casillas se iluminan y tocalas todas, en cualquier orden.", cols: 3, rows: 3, k0: 3, acc: YEL },
    { id: "c4", name: "Posiciones 4×4", how: "Se iluminan varias casillas un momento. Después tocalas.", cols: 4, rows: 4, k0: 4, acc: PNK },
    { id: "c5", name: "Posiciones 5×5", how: "Un tablero grande. Memorizá las casillas y tocalas.", cols: 5, rows: 5, k0: 4, acc: PUR }
  ].forEach(mkCells);

  /* --- Decidir deslizando a izquierda o derecha --- */
  function mkDec(o) {
    var C = G("Dec_" + o.id, {
      ctl: "swipe",
      init: function () { this.cur = null; this.fb = 0; this.next(); },
      next: function () { var pv = this.cur; this.cur = o.gen(pv); this.tm = Math.max(1.6, (o.t || 3.2) - this.score * 0.04); this.tl = this.tm; },
      act: function (x) {
        if (this.fb > 0) return; var right = x >= this.cx; this.acts++; this.fb = 0.18; this.last = right ? 1 : -1;
        if (this.cur.yes === right) { this.add(1); S.hit(this.score); } else this.hurt();
      },
      step: function (dt) {
        if (this.fb > 0) { this.fb -= dt; if (this.fb <= 0 && this.state === "play") this.next(); return; }
        this.tl -= dt; if (this.tl <= 0) { this.fb = 0.18; this.last = 0; this.hurt(); }
      },
      draw: function (now) {
        var c = this.ctx, cd = this.cur, y = this.cy - 20, ox = this.fb > 0 ? this.last * 40 : 0;
        txt(c, o.l, 56, this.H - this.pb - 40, 17, "rgba(255,255,255,0.6)", "center", 600); txt(c, o.r, this.W - 120, this.H - this.pb - 40, 17, "rgba(255,255,255,0.6)", "center", 600);
        fillR(c, 20, this.pt + 4, this.W - 100, 6, 3, "rgba(255,255,255,0.12)"); fillR(c, 20, this.pt + 4, (this.W - 100) * clamp(this.tl / this.tm, 0, 1), 6, 3, "#fff");
        fillR(c, this.cx - 38 - 115 + ox, y - 90, 230, 180, 22, "#1c1c1c");
        var x = this.cx - 38 + ox;
        if (cd.arrow) { c.strokeStyle = "#fff"; c.lineWidth = 12; c.lineCap = "round"; c.lineJoin = "round"; var d = cd.arrow; c.beginPath(); c.moveTo(x - 36 * d, y); c.lineTo(x + 36 * d, y); c.moveTo(x + 14 * d, y - 22); c.lineTo(x + 36 * d, y); c.lineTo(x + 14 * d, y + 22); c.stroke(); c.lineCap = "butt"; }
        else if (cd.t !== undefined) txt(c, cd.t, x, y, clamp(340 / Math.max(5, cd.t.length), 20, 60), cd.col || "#fff", "center", 700);
        else sh2(c, cd.sh || 0, x, y, cd.r || 34, cd.col || "#fff");
        if (cd.sub) txt(c, cd.sub, x, y + 64, 16, "rgba(255,255,255,0.5)", "center", 600);
        this.ghostDrag(this.H - this.pb - 90, now, true);
      }
    });
    reg("k_" + o.id, o.name, o.how, o.acc, C);
  }
  var FRUTAS = ["manzana", "pera", "banana", "naranja", "uva", "frutilla", "durazno", "sandía", "limón", "cereza"], COSAS = ["mesa", "libro", "zapato", "lápiz", "silla", "auto", "reloj", "puerta", "gorra", "llave"], ANIM = ["perro", "gato", "vaca", "pato", "caballo", "oso", "tigre", "mono", "loro", "tortuga"], NOAN = ["mesa", "piedra", "libro", "nube", "taza", "silla", "mochila", "puerta", "lápiz", "cama"];
  var WARM = [RED, ORA, YEL, PNK], COOL = [GRN, PUR, "#2ec4b6"];
  function same(prop) { return function (pv) { var c = {}; if (pv && Math.random() < 0.4) { for (var k in pv) c[k] = pv[k]; } else { c.sh = ri(0, 4); c.col = pickOf([RED, YEL, GRN, PUR, ORA]); c.r = 32; } c.yes = !!pv && (prop === "sh" ? c.sh === pv.sh : prop === "col" ? c.col === pv.col : c.t === pv.t); if (prop === "t") { c.t = pv && Math.random() < 0.4 ? pv.t : pickOf("ABCDEFGHJKLMNPRST".split("")); c.yes = !!pv && c.t === pv.t; c.sh = undefined; } if (prop === "col") c.sh = 0; if (prop === "sh") c.col = "#fff"; return c; }; }
  [
    ["g50", "Mayor que 50", "Deslizá a la derecha si el número es mayor que 50, a la izquierda si no.", GRN, "Menor", "Mayor", function () { var n = ri(1, 100); while (n === 50) n = ri(1, 100); return { t: String(n), yes: n > 50 }; }],
    ["par", "Pares a la derecha", "Pares a la derecha, impares a la izquierda.", ORA, "Impar", "Par", function () { var n = ri(1, 100); return { t: String(n), yes: n % 2 === 0 }; }],
    ["bsh", "¿Misma forma?", "Deslizá a la derecha si la forma es igual a la anterior, a la izquierda si cambió.", PUR, "Distinta", "Igual", same("sh")],
    ["bco", "¿Mismo color?", "Deslizá a la derecha si el color es igual al anterior.", RED, "Distinto", "Igual", same("col")],
    ["blt", "¿Misma letra?", "Deslizá a la derecha si la letra es igual a la anterior.", YEL, "Distinta", "Igual", same("t")],
    ["vow", "Vocales a la derecha", "Vocales a la derecha, consonantes a la izquierda.", PNK, "Consonante", "Vocal", function () { var l = pickOf("ABCDEFGHIJLMNOPRSTUVZ".split("")); return { t: l, yes: VOW.indexOf(l) >= 0 }; }],
    ["pri", "Primos a la derecha", "Primos a la derecha, los demás a la izquierda.", RED, "No primo", "Primo", function () { var n = ri(2, 40); return { t: String(n), yes: isPrime(n) }; }],
    ["fru", "Fruta o no", "Fruta a la derecha, otra cosa a la izquierda.", GRN, "Otra cosa", "Fruta", function () { var y = Math.random() < 0.5; return { t: pickOf(y ? FRUTAS : COSAS), yes: y }; }],
    ["ani", "Animal o no", "Animal a la derecha, otra cosa a la izquierda.", ORA, "Otra cosa", "Animal", function () { var y = Math.random() < 0.5; return { t: pickOf(y ? ANIM : NOAN), yes: y }; }],
    ["cal", "Colores cálidos", "Cálidos a la derecha (rojo, naranja, amarillo, rosa), fríos a la izquierda.", RED, "Frío", "Cálido", function () { var y = Math.random() < 0.5; return { sh: 0, r: 38, col: pickOf(y ? WARM : COOL), yes: y }; }],
    ["arr", "Seguí la flecha", "Deslizá hacia donde apunta la flecha.", YEL, "←", "→", function () { var d = Math.random() < 0.5 ? 1 : -1; return { arrow: d, yes: d > 0 }; }, 2.4],
    ["arv", "Flechas al revés", "Deslizá hacia el lado contrario al que apunta la flecha.", PNK, "←", "→", function () { var d = Math.random() < 0.5 ? 1 : -1; return { arrow: d, yes: d < 0 }; }, 2.6],
    ["s10", "Suma mayor a 10", "Derecha si la suma da más de 10, izquierda si da 10 o menos.", PUR, "10 o menos", "Más de 10", function () { var a = ri(1, 10), b = ri(1, 10); return { t: a + " + " + b, yes: a + b > 10 }; }],
    ["rv", "Rojo o verde", "Rojo a la derecha, verde a la izquierda.", RED, "Verde", "Rojo", function () { var y = Math.random() < 0.5; return { sh: 0, r: 38, col: y ? RED : GRN, yes: y }; }, 2.2],
    ["gc", "Grande o chico", "Grande a la derecha, chico a la izquierda.", ORA, "Chico", "Grande", function () { var y = Math.random() < 0.5; return { sh: 0, r: y ? 46 : 18, col: "#fff", yes: y }; }, 2.4],
    ["cc", "Círculo o cuadrado", "Círculo a la derecha, cuadrado a la izquierda.", GRN, "Cuadrado", "Círculo", function () { var y = Math.random() < 0.5; return { sh: y ? 0 : 1, r: 34, col: "#fff", yes: y }; }, 2.4],
    ["nl", "Número o letra", "Número a la derecha, letra a la izquierda.", PNK, "Letra", "Número", function () { var y = Math.random() < 0.5; return { t: y ? String(ri(0, 10)) : pickOf("ABCDEFGHJKLMNPRST".split("")), yes: y }; }, 2.4],
    ["m5", "Mayor que 5", "Derecha si el número es mayor que 5, izquierda si es menor.", YEL, "Menor", "Mayor", function () { var n = ri(1, 10); while (n === 5) n = ri(1, 10); return { t: String(n), yes: n > 5 }; }, 2.4],
    ["x5", "¿Múltiplo de 5?", "Derecha si es múltiplo de 5.", PUR, "No", "Sí", function () { var n = ri(1, 60); return { t: String(n), yes: n % 5 === 0 }; }],
    ["rnd", "Redondo o con puntas", "Redondo a la derecha, con puntas a la izquierda.", RED, "Con puntas", "Redondo", function () { var y = Math.random() < 0.5; return { sh: y ? 0 : pickOf([2, 3, 6]), r: 34, col: "#fff", yes: y }; }, 2.4]
  ].forEach(function (v) { mkDec({ id: v[0], name: v[1], how: v[2], acc: v[3], l: v[4], r: v[5], gen: v[6], t: v[7] }); });

  /* --- Reflejos: tocar solo cuando corresponde --- */
  function mkGo(o) {
    var C = G("Go_" + o.id, {
      init: function () { this.cur = null; this.pv = null; this.t = 0; this.dur = 1.2; this.tapped = false; },
      act: function () { if (!this.cur || this.tapped) return; this.tapped = true; this.acts++; if (this.cur.go) { this.add(1); S.hit(this.score); } else this.hurt(); },
      step: function (dt) {
        this.t += dt;
        if (!this.cur) { if (this.t >= 0.35) { this.cur = o.gen(this.pv); this.pv = this.cur; this.t = 0; this.tapped = false; this.dur = Math.max(0.55, 1.3 - this.score * 0.02); } return; }
        if (this.t >= this.dur) { var m = this.cur.go && !this.tapped; this.cur = null; this.t = 0; if (m) this.hurt(); }
      },
      draw: function (now) {
        var c = this.ctx, cd = this.cur, x = this.cx - 38;
        txt(c, o.hint, x, this.pt + 40, 20, "rgba(255,255,255,0.65)", "center", 600);
        if (!cd) { c.strokeStyle = "rgba(255,255,255,0.15)"; c.lineWidth = 4; c.beginPath(); c.arc(x, this.cy, 56, 0, TAU); c.stroke(); return; }
        if (cd.t !== undefined) txt(c, cd.t, x, this.cy, 110, cd.col || "#fff", "center", 700); else sh2(c, cd.sh || 0, x, this.cy, cd.r || 62, cd.col || "#fff");
        this.ghost(x, this.cy + 150, now);
      }
    });
    reg("g_" + o.id, o.name, o.how, o.acc, C);
  }
  [
    ["grn", "Verde ya", "Tocá solamente cuando aparezca el círculo verde.", GRN, "Tocá solo el verde", function () { var g = Math.random() < 0.45; return { sh: 0, col: g ? GRN : pickOf([RED, YEL, PUR]), go: g }; }],
    ["star", "Estrella", "Tocá solamente cuando aparezca una estrella.", YEL, "Tocá solo la estrella", function () { var g = Math.random() < 0.4; return { sh: g ? 6 : pickOf([0, 1, 2, 3]), col: g ? YEL : "#fff", go: g }; }],
    ["sev", "El siete", "Tocá solamente cuando aparezca el 7.", ORA, "Tocá solo el 7", function () { var g = Math.random() < 0.35; return { t: String(g ? 7 : pickOf([1, 2, 3, 4, 5, 6, 8, 9])), go: g }; }],
    ["a", "Vocales al vuelo", "Tocá solamente cuando aparezca una vocal.", PNK, "Tocá solo las vocales", function () { var l = pickOf("AEIOUBCDFGLMNPRST".split("")); return { t: l, go: VOW.indexOf(l) >= 0 }; }],
    ["rep", "Igual al anterior", "Tocá cuando la figura sea igual a la anterior.", PUR, "Tocá si es igual a la anterior", function (pv) { var same2 = pv && Math.random() < 0.35, sh = same2 ? pv.sh : ri(0, 4); return { sh: sh, col: "#fff", go: !!pv && sh === pv.sh }; }],
    ["red", "No toques el rojo", "Tocá siempre, menos cuando aparece el rojo.", RED, "Tocá todo menos el rojo", function () { var r = Math.random() < 0.3; return { sh: 0, col: r ? RED : pickOf([GRN, YEL, PUR, ORA]), go: !r }; }],
    ["par", "Pares al vuelo", "Tocá solamente cuando el número sea par.", GRN, "Tocá solo los pares", function () { var n = ri(1, 30); return { t: String(n), go: n % 2 === 0 }; }],
    ["big", "El gran círculo", "Tocá solamente cuando el círculo sea grande.", YEL, "Tocá solo los grandes", function () { var g = Math.random() < 0.45; return { sh: 0, r: g ? 80 : 34, col: g ? YEL : GRY, go: g }; }]
  ].forEach(function (v) { mkGo({ id: v[0], name: v[1], how: v[2], acc: v[3], hint: v[4], gen: v[5] }); });
