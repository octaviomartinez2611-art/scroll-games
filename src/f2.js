
  /* --- Preguntas rápidas (elegir una opción) --- */
  function T(x) { return { t: String(x), k: String(x) }; }
  function numOpts(c, n, lo, hi) {
    var s = [c], g = 0; while (s.length < n && g++ < 60) { var d = ri(1, 5) * (Math.random() < 0.5 ? -1 : 1), v = c + d; if (v >= (lo === undefined ? 0 : lo) && (hi === undefined || v <= hi) && s.indexOf(v) < 0) s.push(v); }
    while (s.length < n) s.push(c + s.length + 5);
    return s;
  }
  function Q(q, correct, wrongs, ex) {
    var opts = shuf([correct].concat(wrongs)), a = 0; for (var i = 0; i < opts.length; i++) if (opts[i].k === correct.k) a = i;
    var r = { q: q, o: opts, a: a }; if (ex) for (var k in ex) r[k] = ex[k]; return r;
  }
  function numQ(q, c, n, ex, lo, hi) { var all = numOpts(c, n || 3, lo, hi); return Q(q, T(c), all.slice(1).map(T), ex); }
  function listQ(q, c, pool, n, ex) { var w = shuf(pool.filter(function (x) { return x !== c; })).slice(0, (n || 3) - 1); return Q(q, T(c), w.map(T), ex); }
  function mkQuiz(o) {
    var C = G("Quiz_" + o.id, {
      init: function () { this.wait = 0; this.next(); },
      next: function () { this.q = o.gen(this.score); this.tm = Math.max(2.6, (o.t || 6) - this.score * 0.06); this.tl = this.tm; this.res = -1; this.lay(); },
      lay: function () {
        var n = this.q.o.length, uw = this.W - 76, cols = n <= 3 ? n : 2, rows = Math.ceil(n / cols), gap = 10; this.bw = (uw - gap * (cols - 1)) / cols; this.bh = n <= 3 ? 100 : 84; this.bx = []; this.by0 = this.H - this.pb - rows * (this.bh + gap) - 6;
        for (var i = 0; i < n; i++) this.bx.push({ x: 8 + (i % cols) * (this.bw + gap), y: this.by0 + Math.floor(i / cols) * (this.bh + gap) });
      },
      act: function (x, y) {
        if (this.wait > 0) return;
        for (var i = 0; i < this.bx.length; i++) { var b = this.bx[i]; if (x >= b.x && x <= b.x + this.bw && y >= b.y && y <= b.y + this.bh) { this.pick(i); return; } }
      },
      pick: function (i) { this.res = i; this.acts++; this.wait = 0.35; if (i === this.q.a) { this.add(1); S.hit(this.score); } else this.hurt(); },
      step: function (dt) {
        if (this.wait > 0) { this.wait -= dt; if (this.wait <= 0 && this.state === "play") this.next(); return; }
        this.tl -= dt; if (this.tl <= 0) { this.res = -2; this.wait = 0.35; this.hurt(); }
      },
      draw: function (now) {
        var c = this.ctx, q = this.q, i, cy = (this.pt + this.by0) / 2 + 10;
        fillR(c, 20, this.pt + 4, this.W - 100, 6, 3, "rgba(255,255,255,0.12)"); fillR(c, 20, this.pt + 4, (this.W - 100) * clamp(this.tl / this.tm, 0, 1), 6, 3, "#fff");
        if (q.dots) { c.fillStyle = "#fff"; for (i = 0; i < q.pts.length; i++) { c.beginPath(); c.arc(this.cx - 40 + q.pts[i][0] * 150 - 75, cy + q.pts[i][1] * 90 - 40, 9, 0, TAU); c.fill(); } txt(c, q.q, this.cx - 40, cy - 90, 20, "rgba(255,255,255,0.7)", "center", 600); }
        else if (q.poly) { c.strokeStyle = "#fff"; c.lineWidth = 6; c.lineJoin = "round"; c.beginPath(); for (i = 0; i < q.poly; i++) { var a = -PI / 2 + i * TAU / q.poly; c.lineTo(this.cx - 40 + Math.cos(a) * 60, cy + Math.sin(a) * 60); } c.closePath(); c.stroke(); txt(c, q.q, this.cx - 40, cy - 95, 20, "rgba(255,255,255,0.7)", "center", 600); }
        else if (q.clock) { var cx0 = this.cx - 40; c.strokeStyle = "#fff"; c.lineWidth = 5; c.beginPath(); c.arc(cx0, cy, 66, 0, TAU); c.stroke(); for (i = 0; i < 12; i++) { var aa = i * PI / 6; c.lineWidth = 3; c.beginPath(); c.moveTo(cx0 + Math.sin(aa) * 56, cy - Math.cos(aa) * 56); c.lineTo(cx0 + Math.sin(aa) * 64, cy - Math.cos(aa) * 64); c.stroke(); } var ma = q.clock.m / 60 * TAU, ha = (q.clock.h % 12 + q.clock.m / 60) / 12 * TAU; c.lineWidth = 6; c.beginPath(); c.moveTo(cx0, cy); c.lineTo(cx0 + Math.sin(ha) * 34, cy - Math.cos(ha) * 34); c.stroke(); c.lineWidth = 4; c.beginPath(); c.moveTo(cx0, cy); c.lineTo(cx0 + Math.sin(ma) * 52, cy - Math.cos(ma) * 52); c.stroke(); txt(c, q.q, this.cx - 40, cy - 90, 20, "rgba(255,255,255,0.7)", "center", 600); }
        else { var sz = clamp(520 / Math.max(6, q.q.length), 22, 54); txt(c, q.q, this.cx - 38, cy, sz, "#fff", "center", 700); }
        for (i = 0; i < q.o.length; i++) {
          var b = this.bx[i], op = q.o[i], bg = "#1f1f1f"; if (this.res >= 0 || this.res === -2) { if (i === q.a) bg = "#1d5a37"; else if (i === this.res) bg = "#6a1f2b"; }
          fillR(c, b.x, b.y, this.bw, this.bh, 16, bg);
          if (op.col) { if (op.r) { c.fillStyle = op.col; c.beginPath(); c.arc(b.x + this.bw / 2, b.y + this.bh / 2, op.r, 0, TAU); c.fill(); } else sh2(c, op.sh || 0, b.x + this.bw / 2, b.y + this.bh / 2, 26, op.col); }
          else txt(c, op.t, b.x + this.bw / 2, b.y + this.bh / 2 + 1, clamp(this.bw * 1.5 / Math.max(3, op.t.length), 18, 38), "#fff", "center", 700);
        }
      }
    });
    reg("q_" + o.id, o.name, o.how, o.acc, C);
  }
  function sc(s, a, b) { return Math.floor(a + Math.min(b - a, s * 0.4)); }
  var MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"], DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  var CAPS = [["Argentina", "Buenos Aires"], ["Chile", "Santiago"], ["Uruguay", "Montevideo"], ["Brasil", "Brasilia"], ["Perú", "Lima"], ["Colombia", "Bogotá"], ["México", "Ciudad de México"], ["España", "Madrid"], ["Francia", "París"], ["Italia", "Roma"], ["Alemania", "Berlín"], ["Portugal", "Lisboa"], ["Japón", "Tokio"], ["Egipto", "El Cairo"], ["Cuba", "La Habana"], ["Paraguay", "Asunción"], ["Venezuela", "Caracas"], ["Ecuador", "Quito"], ["Canadá", "Ottawa"], ["Rusia", "Moscú"], ["Grecia", "Atenas"], ["Inglaterra", "Londres"]];
  var ANTO = [["alto", "bajo"], ["grande", "chico"], ["día", "noche"], ["frío", "calor"], ["rápido", "lento"], ["abrir", "cerrar"], ["subir", "bajar"], ["lleno", "vacío"], ["nuevo", "viejo"], ["fuerte", "débil"], ["dulce", "amargo"], ["feliz", "triste"], ["limpio", "sucio"], ["duro", "blando"], ["cerca", "lejos"], ["luz", "oscuridad"]];
  var ENG = [["perro", "dog"], ["gato", "cat"], ["casa", "house"], ["agua", "water"], ["libro", "book"], ["sol", "sun"], ["luna", "moon"], ["rojo", "red"], ["verde", "green"], ["pan", "bread"], ["leche", "milk"], ["mesa", "table"], ["silla", "chair"], ["amigo", "friend"], ["escuela", "school"], ["manzana", "apple"], ["árbol", "tree"], ["cielo", "sky"], ["mano", "hand"], ["ojo", "eye"]];
  var LEGS = [["perro", 4], ["pájaro", 2], ["araña", 8], ["pulpo", 8], ["hormiga", 6], ["serpiente", 0], ["gallina", 2], ["vaca", 4], ["caracol", 0], ["abeja", 6], ["gato", 4], ["pez", 0]];
  var PLAN = ["Mercurio", "Venus", "Tierra", "Marte", "Júpiter", "Saturno", "Urano", "Neptuno"];
  var WORDS = ["MESA", "CASA", "PERRO", "GATO", "LIBRO", "SILLA", "PLAYA", "NUBE", "CAMPO", "FLOR", "ARBOL", "RADIO", "TREN", "AVION", "LUNA", "PAN", "QUESO", "RELOJ", "VASO", "PLATO"];
  var ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
  function isPrime(n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
  function yn(q, ans, ex) { return Q(q, T(ans ? "Sí" : "No"), [T(ans ? "No" : "Sí")], ex); }
  [
    ["sum", "Sumas", "Elegí el resultado de la suma antes de que se acabe el tiempo.", GRN, function (s) { var a = ri(2, sc(s, 9, 30)), b = ri(2, sc(s, 9, 30)); return numQ(a + " + " + b, a + b); }],
    ["sub", "Restas", "Elegí el resultado de la resta.", ORA, function (s) { var a = ri(5, sc(s, 15, 50)), b = ri(1, a); return numQ(a + " − " + b, a - b); }],
    ["mul", "Tablas", "Elegí el resultado de la multiplicación.", PUR, function (s) { var a = ri(2, sc(s, 9, 12) + 1), b = ri(2, 10); return numQ(a + " × " + b, a * b, 3, 0, 0); }],
    ["div", "Divisiones", "Elegí el resultado de la división.", RED, function (s) { var b = ri(2, 9), c = ri(2, sc(s, 9, 12)); return numQ(b * c + " ÷ " + b, c); }],
    ["big3", "El mayor", "Elegí el número más grande.", YEL, function (s) { var v = [ri(1, 99), ri(1, 99), ri(1, 99)]; while (v[0] === v[1] || v[1] === v[2] || v[0] === v[2]) v = [ri(1, 99), ri(1, 99), ri(1, 99)]; var m = Math.max.apply(null, v); return Q("¿Cuál es el mayor?", T(m), v.filter(function (x) { return x !== m; }).map(T)); }],
    ["sml3", "El menor", "Elegí el número más chico.", GRN, function (s) { var v = [ri(1, 99), ri(1, 99), ri(1, 99)]; while (v[0] === v[1] || v[1] === v[2] || v[0] === v[2]) v = [ri(1, 99), ri(1, 99), ri(1, 99)]; var m = Math.min.apply(null, v); return Q("¿Cuál es el menor?", T(m), v.filter(function (x) { return x !== m; }).map(T)); }],
    ["mid3", "El del medio", "Elegí el número que queda en el medio.", PNK, function (s) { var v = [ri(1, 99), ri(1, 99), ri(1, 99)]; while (v[0] === v[1] || v[1] === v[2] || v[0] === v[2]) v = [ri(1, 99), ri(1, 99), ri(1, 99)]; var so = v.slice().sort(function (a, b) { return a - b; }); return Q("¿Cuál está en el medio?", T(so[1]), [T(so[0]), T(so[2])]); }],
    ["par", "Par o impar", "Decidí si el número es par o impar.", ORA, function (s) { var n = ri(1, sc(s, 30, 200)); return Q(String(n), T(n % 2 ? "Impar" : "Par"), [T(n % 2 ? "Par" : "Impar")]); }],
    ["m3", "Múltiplos de 3", "¿El número es múltiplo de 3?", PUR, function (s) { var n = ri(3, sc(s, 40, 120)); return yn(n + " ¿múltiplo de 3?", n % 3 === 0); }],
    ["prim", "Números primos", "¿El número es primo?", RED, function (s) { var n = ri(2, sc(s, 30, 60)); return yn(n + " ¿es primo?", isPrime(n)); }],
    ["sadd", "Serie que suma", "Elegí el número que sigue en la serie.", YEL, function (s) { var a = ri(1, 9), d = ri(2, 6); return numQ(a + ", " + (a + d) + ", " + (a + 2 * d) + ", ?", a + 3 * d); }],
    ["smul", "Serie que duplica", "Elegí el número que sigue en la serie.", GRN, function (s) { var a = ri(1, 4), k = pickOf([2, 3]); return numQ(a + ", " + a * k + ", " + a * k * k + ", ?", a * k * k * k); }],
    ["half", "La mitad", "Elegí la mitad del número.", PNK, function (s) { var n = ri(2, sc(s, 20, 100)) * 2; return numQ("Mitad de " + n, n / 2); }],
    ["dbl", "El doble", "Elegí el doble del número.", ORA, function (s) { var n = ri(2, sc(s, 20, 80)); return numQ("Doble de " + n, n * 2); }],
    ["to10", "Hasta 10", "¿Cuánto falta para llegar a 10?", PUR, function (s) { var a = ri(1, 10); return numQ(a + " + ? = 10", 10 - a); }],
    ["to100", "Hasta 100", "¿Cuánto falta para llegar a 100?", RED, function (s) { var a = ri(1, 19) * 5; return numQ(a + " + ? = 100", 100 - a, 3, 0, 0, 100); }],
    ["cmp", "Mayor, menor o igual", "Elegí el signo correcto entre las dos cuentas.", YEL, function (s) { var a = ri(1, 9), b = ri(1, 9), c = ri(1, 9), d = ri(1, 9), x = a + b, y = c + d, r = x > y ? ">" : x < y ? "<" : "="; return Q(a + "+" + b + "  ?  " + c + "+" + d, T(r), [">", "<", "="].filter(function (z) { return z !== r; }).map(T)); }],
    ["miss", "Número que falta", "Completá la cuenta con el número que falta.", GRN, function (s) { var a = ri(5, 20), b = ri(1, a); return numQ(a + " − ? = " + (a - b), b); }],
    ["sqr", "Cuadrados", "Elegí el cuadrado del número.", ORA, function (s) { var n = ri(2, sc(s, 9, 14)); return numQ(n + "²", n * n); }],
    ["mod", "Resto", "Elegí el resto de la división.", PNK, function (s) { var b = ri(2, 9), a = ri(b + 1, 60); return numQ("Resto de " + a + " ÷ " + b, a % b, 3, 0, 0, b - 1 > 2 ? 99 : 99); }],
    ["col", "Elegí el color", "Tocá el círculo del color que dice arriba.", RED, function () { var cs = shuf(CNAMES).slice(0, 4), t = cs[0]; return Q("Elegí el " + t[0], { col: t[1], sh: 0, k: t[0] }, cs.slice(1).map(function (z) { return { col: z[1], sh: 0, k: z[0] }; })); }],
    ["shp", "Elegí la forma", "Tocá la forma que dice arriba.", PUR, function () { var ks = shuf([0, 1, 2, 3]); return Q("Elegí el " + SHN[ks[0]], { col: "#fff", sh: ks[0], k: "s" + ks[0] }, ks.slice(1).map(function (k) { return { col: "#fff", sh: k, k: "s" + k }; })); }],
    ["dots", "Contá los puntos", "Contá los puntos y elegí cuántos hay.", YEL, function (s) { var n = ri(3, sc(s, 9, 15)), pts = []; for (var i = 0; i < n; i++) { var p; do { p = [Math.random(), Math.random()]; } while (pts.some(function (q) { return Math.hypot((q[0] - p[0]) * 150, (q[1] - p[1]) * 90) < 22; })); pts.push(p); } return numQ("¿Cuántos puntos?", n, 3, { dots: n, pts: pts }, 1); }],
    ["bigc", "Más grande", "Tocá el círculo más grande.", GRN, function () { var a = ri(14, 34), b = a + ri(5, 14); if (Math.random() < 0.5) { var t = a; a = b; b = t; } return Q("¿Cuál es el más grande?", { col: "#fff", r: Math.max(a, b), k: "r" + Math.max(a, b) }, [{ col: "#fff", r: Math.min(a, b), k: "r" + Math.min(a, b) }]); }],
    ["side", "Contá los lados", "Contá los lados de la figura.", ORA, function () { var n = ri(3, 9); return numQ("¿Cuántos lados?", n, 3, { poly: n }, 3, 9); }],
    ["vow", "Vocal o consonante", "¿La letra es vocal o consonante?", PNK, function () { var l = pickOf("ABCDEFGHIJLMNOPRSTUVZ".split("")); return Q(l, T(VOW.indexOf(l) >= 0 ? "Vocal" : "Consonante"), [T(VOW.indexOf(l) >= 0 ? "Consonante" : "Vocal")]); }],
    ["alp", "Abecedario", "Elegí la letra que va primero en el abecedario.", PUR, function () { var L = "ABCDEFGHIJLMNOPRSTUVZ".split(""), a = pickOf(L), b = pickOf(L); while (a === b) b = pickOf(L); var f = a < b ? a : b; return Q("¿Cuál va primero?", T(f), [T(f === a ? b : a)]); }],
    ["mis", "Letra que falta", "Elegí la letra que falta en la palabra.", RED, function () { var w = pickOf(WORDS), i = ri(0, w.length), L = w[i], wr = shuf("ABCDEILMNOPRSTU".split("").filter(function (x) { return x !== L; })).slice(0, 2); return Q(w.slice(0, i) + "_" + w.slice(i + 1), T(L), wr.map(T)); }],
    ["len", "Cuántas letras", "Contá las letras de la palabra.", YEL, function () { var w = pickOf(WORDS); return numQ(w, w.length, 3, 0, 2, 9); }],
    ["fl", "Primera letra", "Elegí con qué letra empieza la palabra.", GRN, function () { var w = pickOf(WORDS), L = w[0], wr = shuf("ABCDEILMNOPRSTUV".split("").filter(function (x) { return x !== L; })).slice(0, 2); return Q(w, T(L), wr.map(T)); }],
    ["cap", "Capitales", "Elegí la capital del país.", ORA, function () { var p = pickOf(CAPS); return listQ(p[0], p[1], CAPS.map(function (x) { return x[1]; })); }],
    ["mes", "Qué mes sigue", "Elegí el mes que viene después.", PNK, function () { var i = ri(0, 12); return listQ("Después de " + MESES[i], MESES[(i + 1) % 12], MESES); }],
    ["dia", "Qué día sigue", "Elegí el día que viene después.", PUR, function () { var i = ri(0, 7); return listQ("Después del " + DIAS[i].toLowerCase(), DIAS[(i + 1) % 7], DIAS); }],
    ["rom", "Números romanos", "Elegí qué número es.", RED, function (s) { var n = ri(1, 21); return numQ(ROMAN[n - 1], n, 3, 0, 1, 20); }],
    ["clk", "Qué hora es", "Mirá el reloj y elegí la hora.", YEL, function () { var h = ri(1, 13), m = pickOf([0, 15, 30, 45]), fmt = function (hh, mm) { return hh + ":" + (mm < 10 ? "0" + mm : mm); }, c = fmt(h, m), w = []; while (w.length < 2) { var x = fmt(ri(1, 13), pickOf([0, 15, 30, 45])); if (x !== c && w.indexOf(x) < 0) w.push(x); } return Q("¿Qué hora es?", T(c), w.map(T), { clock: { h: h, m: m } }); }],
    ["ant", "Antónimos", "Elegí lo contrario de la palabra.", GRN, function () { var p = pickOf(ANTO), a = Math.random() < 0.5 ? 0 : 1; return listQ("Contrario de " + p[a], p[1 - a], ANTO.map(function (x) { return x[0]; }).concat(ANTO.map(function (x) { return x[1]; }))); }],
    ["eng", "En inglés", "Elegí cómo se dice en inglés.", ORA, function () { var p = pickOf(ENG); return listQ(p[0], p[1], ENG.map(function (x) { return x[1]; })); }],
    ["leg", "Patas", "Elegí cuántas patas tiene.", PNK, function () { var p = pickOf(LEGS); return numQ(p[0], p[1], 3, 0, 0, 10); }],
    ["pla", "Planetas", "Elegí qué número de planeta es, contando desde el Sol.", PUR, function () { var i = ri(0, 8); return numQ(PLAN[i], i + 1, 3, 0, 1, 8); }],
    ["dmo", "Días del mes", "Elegí cuántos días tiene el mes.", RED, function () { var i = ri(0, 12), d = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i]; return Q(MESES[i], T(d), [28, 30, 31].filter(function (x) { return x !== d; }).map(T)); }]
  ].forEach(function (v) { mkQuiz({ id: v[0], name: v[1], how: v[2], acc: v[3], gen: v[4] }); });
