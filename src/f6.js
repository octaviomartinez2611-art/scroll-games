
  /* ===== tanda 3: 100 variantes más ===== */
  var CONS = "BCDFGHJLMNPRST".split("");
  [
    ["rmb", "Solo rombos", "Atrapá solamente los rombos.", PUR, function () { var k = ri(0, 4); return dItem(WHT, k, k === 3); }],
    ["sq", "Solo cuadrados", "Atrapá solamente los cuadrados.", ORA, function () { var k = ri(0, 4); return dItem(WHT, k, k === 1); }],
    ["gt10", "Caen mayores a 10", "Atrapá los números mayores que 10.", GRN, function () { var n = ri(1, 21); return dItem(WHT, 0, n > 10, { n: n }); }],
    ["lt4", "Menores a 4", "Atrapá los números menores que 4.", RED, function () { var n = ri(1, 10); return dItem(WHT, 0, n < 4, { n: n }); }],
    ["x4", "Múltiplos de 4", "Atrapá los múltiplos de 4.", YEL, function () { var n = ri(1, 25); return dItem(WHT, 0, n % 4 === 0, { n: n }); }],
    ["pri", "Primos que caen", "Atrapá solamente los números primos.", PNK, function () { var n = ri(1, 30); return dItem(WHT, 0, isPrime(n), { n: n }); }],
    ["vow", "Vocales que caen", "Atrapá las vocales y dejá pasar las consonantes.", PUR, function () { var y = Math.random() < 0.45; return dItem(WHT, 0, y, { n: y ? pickOf(VOW.split("")) : pickOf(CONS) }); }],
    ["con", "Consonantes que caen", "Atrapá las consonantes y dejá pasar las vocales.", GRN, function () { var y = Math.random() < 0.55; return dItem(WHT, 0, y, { n: y ? pickOf(CONS) : pickOf(VOW.split("")) }); }],
    ["drop", "Goteras", "Atrapá cada gota. Si se cae una, perdés una vida.", "#2ec4b6", function () { return dItem("#2ec4b6", 0, true, { r: 12 }); }, 1],
    ["fast", "Estrellas fugaces", "Caen rápido. Atrapá las estrellas, esquivá las rocas.", YEL, function () { return Math.random() < 0.7 ? dItem(YEL, 6, true, { k: 1.6 }) : dItem(GRY, 0, false, { k: 1.3 }); }]
  ].forEach(function (v) { mkCatch({ id: v[0], name: v[1], how: v[2], acc: v[3], gen: v[4], miss: v[5], draw: dDraw }); });
  [
    { id: "bub", name: "Burbujas gigantes", how: "Burbujas enormes que bajan despacio y se mueven de costado.", col: PUR, shape: 0, w: [60, 90], sq: 1, iv: 1.0, min: 0.7, v: 130, sway: 140 },
    { id: "rkt2", name: "Lluvia de cohetes", how: "Cohetes rápidos caen en punta. Esquivalos.", col: ORA, shape: 2, w: [18, 22], h: [40, 48], iv: 0.5, min: 0.3, v: 420 },
    { id: "acid", name: "Lluvia ácida", how: "Muchas gotas verdes. Encontrá por dónde pasar.", col: GRN, shape: 0, w: [10, 14], sq: 1, iv: 0.18, min: 0.12, v: 330, dr: 30 },
    { id: "cube", name: "Cubos", how: "Cubos que giran mientras caen.", col: YEL, shape: 1, sq: 1, w: [36, 56], iv: 0.75, v: 230, spin: 1, dr: 30 },
    { id: "col", name: "Columnas", how: "Columnas largas que caen. Metete en el hueco.", col: "#d9d9d9", shape: 1, w: [26, 40], h: [140, 220], iv: 0.7, v: 260 },
    { id: "ninja", name: "Estrellas ninja", how: "Estrellitas que giran y caen rápido.", col: "#e6e6e6", shape: 2, w: [22, 26], h: [22, 26], iv: 0.35, min: 0.22, v: 360, spin: 1, dr: 50 },
    { id: "wind", name: "Viento fuerte", how: "Las piedras vuelan de costado con el viento.", col: GRY, shape: 0, w: [22, 34], sq: 1, iv: 0.5, v: 220, dr: 160 },
    { id: "laser", name: "Láseres", how: "Salí de la línea roja: el láser cae rápido.", col: RED, strike: 1, w: [40, 40], h: [40, 40], iv: 0.75, min: 0.45, v: 0 },
    { id: "aval", name: "Avalancha", how: "Caen muchas piedras juntas. Buscá el hueco.", col: "#cfcfcf", shape: 0, w: [26, 40], sq: 1, iv: 1.0, min: 0.7, v: 240, n: [3, 4] },
    { id: "need", name: "Agujas", how: "Agujas finitas y muy rápidas.", col: "#fff", shape: 1, w: [4, 5], h: [50, 70], iv: 0.3, min: 0.18, v: 520 }
  ].forEach(mkDodge);
  [
    ["pur", "Solo violetas", "Tocá solamente los violetas.", PUR, function () { var c = pickOf(CC); return tg(c, 0, c === PUR); }, 0.7, 1.8, 0],
    ["t3", "Tocá múltiplos de 3", "Tocá solamente los múltiplos de 3.", ORA, function () { var n = ri(1, 31); return tg(WHT, 0, n % 3 === 0, { txt: n }); }, 0.75, 2.1, 0],
    ["pri", "Primos al toque", "Tocá solamente los números primos.", RED, function () { var n = ri(1, 30); return tg(WHT, 0, isPrime(n), { txt: n }); }, 0.75, 2.2, 0],
    ["con", "Consonantes", "Tocá solamente las consonantes.", GRN, function () { var l = pickOf(LET); return tg(WHT, 0, VOW.indexOf(l) < 0, { txt: l }); }, 0.75, 2.0, 0],
    ["sq", "Tocá los cuadrados", "Tocá solamente los cuadrados.", YEL, function () { var k = ri(0, 4); return tg(WHT, k, k === 1); }, 0.7, 1.8, 0],
    ["st", "Estrellitas", "Tocá solamente las estrellas.", YEL, function () { var k = pickOf([0, 1, 2, 6, 6]); return tg(k === 6 ? YEL : WHT, k, k === 6); }, 0.7, 1.8, 0],
    ["gry", "Nada de grises", "Tocá los de color. Los grises no.", PNK, function () { var g = Math.random() < 0.65; return tg(g ? pickOf([RED, GRN, YEL, PUR, ORA]) : GRY, 0, g); }, 0.75, 1.8, 0],
    ["bub", "Reventá burbujas", "Reventá las burbujas que flotan antes de que se vayan.", PUR, function () { return tg(PUR, 0, true, { r: 30 }); }, 0.8, 2.6, 1, 1.2, 1],
    ["g50", "Mayores a 50", "Tocá los números mayores que 50.", GRN, function () { var n = ri(1, 100); while (n === 50) n = ri(1, 100); return tg(WHT, 0, n > 50, { txt: n }); }, 0.75, 2.1, 0],
    ["gfast", "Verde relámpago", "Los verdes duran muy poco. Tocalos rápido, los rojos no.", GRN, function () { var g = Math.random() < 0.6; return tg(g ? GRN : RED, 0, g); }, 0.55, 1.0, 0, 0.6]
  ].forEach(function (v) { mkTap({ id: v[0], name: v[1], how: v[2], acc: v[3], gen: v[4], iv: v[5], life: v[6], miss: v[7], minLife: v[8] || 0.8, move: v[9] }); });
  var CENG = [["rojo", "red"], ["azul", "blue"], ["verde", "green"], ["amarillo", "yellow"], ["negro", "black"], ["blanco", "white"], ["rosa", "pink"], ["naranja", "orange"], ["violeta", "purple"], ["gris", "gray"]];
  var NENG = [["uno", "one"], ["dos", "two"], ["tres", "three"], ["cuatro", "four"], ["cinco", "five"], ["seis", "six"], ["siete", "seven"], ["ocho", "eight"], ["nueve", "nine"], ["diez", "ten"]];
  var AENG = [["perro", "dog"], ["gato", "cat"], ["caballo", "horse"], ["vaca", "cow"], ["pájaro", "bird"], ["pez", "fish"], ["oso", "bear"], ["conejo", "rabbit"], ["ratón", "mouse"], ["cerdo", "pig"]];
  var CONT = [["Argentina", "América"], ["Brasil", "América"], ["México", "América"], ["Canadá", "América"], ["España", "Europa"], ["Francia", "Europa"], ["Italia", "Europa"], ["Alemania", "Europa"], ["Portugal", "Europa"], ["Japón", "Asia"], ["China", "Asia"], ["India", "Asia"], ["Corea del Sur", "Asia"], ["Egipto", "África"], ["Nigeria", "África"], ["Kenia", "África"], ["Marruecos", "África"], ["Australia", "Oceanía"]];
  var PLU = [["lápiz", "lápices"], ["pez", "peces"], ["luz", "luces"], ["flor", "flores"], ["camión", "camiones"], ["árbol", "árboles"], ["mano", "manos"], ["papel", "papeles"], ["ratón", "ratones"], ["voz", "voces"], ["casa", "casas"], ["reloj", "relojes"]];
  var HEAVY = [["elefante", "ratón"], ["auto", "bicicleta"], ["piano", "guitarra"], ["vaca", "gato"], ["camión", "moto"], ["sandía", "uva"], ["ballena", "delfín"], ["mesa", "lápiz"], ["caballo", "perro"], ["roca", "pluma"]];
  [
    ["sum3", "Sumas de tres", "Sumá los tres números.", GRN, function (s) { var a = ri(1, 10), b = ri(1, 10), c = ri(1, sc(s, 10, 20)); return numQ(a + " + " + b + " + " + c, a + b + c); }],
    ["sub2", "Restas grandes", "Restas con números de dos cifras.", ORA, function () { var a = ri(30, 100), b = ri(10, a); return numQ(a + " − " + b, a - b); }],
    ["mul7", "Tablas difíciles", "Tablas del 6 al 9.", PUR, function () { var a = ri(6, 10), b = ri(3, 10); return numQ(a + " × " + b, a * b); }],
    ["pct", "Porcentajes", "Calculá el porcentaje.", RED, function () { var b = ri(1, 11) * 20, p = pickOf([10, 25, 50]); return numQ(p + "% de " + b, b * p / 100); }],
    ["third", "Un tercio", "Elegí la tercera parte del número.", YEL, function () { var n = ri(2, 16) * 3; return numQ("Un tercio de " + n, n / 3); }],
    ["big4", "El mayor de cuatro", "Elegí el número más grande de los cuatro.", GRN, function () { var v = []; while (v.length < 4) { var x = ri(10, 100); if (v.indexOf(x) < 0) v.push(x); } var m = Math.max.apply(null, v); return Q("¿Cuál es el mayor?", T(m), v.filter(function (x) { return x !== m; }).map(T)); }],
    ["rnd", "Redondeo", "Redondeá a la decena más cercana.", PNK, function () { var n = ri(11, 99); while (n % 10 === 5) n = ri(11, 99); var c = Math.round(n / 10) * 10; return Q("Redondeá " + n, T(c), [T(c - 10), T(c + 10)]); }],
    ["dec", "Decenas", "¿Cuántas decenas tiene el número?", ORA, function () { var n = ri(10, 100); return numQ(n + " → decenas", Math.floor(n / 10), 3, 0, 1, 10); }],
    ["prev", "El anterior", "Elegí el número que va justo antes.", PUR, function () { var n = ri(10, 1000); return numQ("Antes del " + n, n - 1); }],
    ["nextn", "El siguiente", "Elegí el número que va justo después.", RED, function () { var n = ri(10, 1000); return numQ("Después del " + n, n + 1); }],
    ["hmin", "Horas y minutos", "Pasá las horas a minutos.", YEL, function () { var h = ri(1, 6), c = h * 60; return Q(h + (h === 1 ? " hora" : " horas") + " = ? min", T(c), [T(c + 30), T(c - 30 > 0 ? c - 30 : c + 60)]); }],
    ["chg", "El vuelto", "Pagás con 100. ¿Cuánto te dan de vuelto?", GRN, function () { var p = ri(1, 20) * 5, c = 100 - p; return Q("Cuesta " + p + ", pagás 100", T(c), [T(c + 5), T(c > 10 ? c - 10 : c + 10)]); }],
    ["ceng", "Colores en inglés", "Elegí cómo se dice el color en inglés.", PNK, function () { var p = pickOf(CENG); return listQ(p[0], p[1], CENG.map(function (x) { return x[1]; })); }],
    ["neng", "Números en inglés", "Elegí cómo se dice el número en inglés.", ORA, function () { var p = pickOf(NENG); return listQ(p[0], p[1], NENG.map(function (x) { return x[1]; })); }],
    ["aeng", "Animales en inglés", "Elegí cómo se dice el animal en inglés.", PUR, function () { var p = pickOf(AENG); return listQ(p[0], p[1], AENG.map(function (x) { return x[1]; })); }],
    ["cont", "Continentes", "Elegí en qué continente está el país.", RED, function () { var p = pickOf(CONT); return listQ(p[0], p[1], ["América", "Europa", "Asia", "África", "Oceanía"]); }],
    ["plu", "Plurales", "Elegí el plural correcto.", YEL, function () { var p = pickOf(PLU), w = [p[0] + "s", p[0] + "es", p[0] + "ses"].filter(function (x) { return x !== p[1]; }).slice(0, 2); return Q(p[0], T(p[1]), w.map(T)); }],
    ["sign", "Qué signo va", "Elegí el signo que hace bien la cuenta.", GRN, function () { var a, b, r, op, g = 0; do { a = ri(2, 10); b = ri(2, 10); op = ri(0, 3); r = [a + b, a - b, a * b][op]; } while ((a + b === a * b || a - b === a * b || a + b === a - b) && g++ < 20); var S2 = ["+", "−", "×"]; return Q(a + " ? " + b + " = " + r, T(S2[op]), S2.filter(function (x, i) { return i !== op; }).map(T)); }],
    ["hplus", "Más tarde", "Calculá qué hora va a ser.", ORA, function () { var h = ri(1, 13), k = ri(1, 6), f = function (x) { return ((x - 1 + 120) % 12 + 1) + ":00"; }; return Q("Son las " + h + ":00. En " + k + " h:", T(f(h + k)), [T(f(h + k + 1)), T(f(h + k - 1))]); }],
    ["week", "Semanas", "¿Cuántos días hay en esas semanas?", PNK, function () { var n = ri(2, 9); return numQ(n + " semanas = ? días", n * 7); }],
    ["heavy", "Qué pesa más", "Elegí lo que pesa más.", PUR, function () { var p = pickOf(HEAVY); return Q("¿Qué pesa más?", T(p[0]), [T(p[1])]); }]
  ].forEach(function (v) { mkQuiz({ id: v[0], name: v[1], how: v[2], acc: v[3], gen: v[4] }); });
  var VERD = ["zanahoria", "papa", "lechuga", "cebolla", "zapallo", "brócoli", "espinaca", "pepino", "berenjena", "acelga"], MAM = ["perro", "gato", "vaca", "caballo", "ballena", "mono", "oso", "conejo", "delfín", "león"], NOMAM = ["pájaro", "pez", "serpiente", "rana", "hormiga", "tortuga", "lagarto", "abeja", "pulpo", "gallina"], PAIS = ["Argentina", "Chile", "Perú", "Brasil", "México", "España", "Italia", "Japón", "Uruguay", "Francia"], CIU = ["Córdoba", "Rosario", "Mendoza", "Madrid", "París", "Roma", "Lima", "Tokio", "Montevideo", "Santiago"];
  [
    ["g100", "Mayor que 100", "Derecha si es mayor que 100, izquierda si no.", GRN, "Menor", "Mayor", function () { var n = ri(1, 200); while (n === 100) n = ri(1, 200); return { t: String(n), yes: n > 100 }; }],
    ["imp", "Impares a la derecha", "Impares a la derecha, pares a la izquierda.", PNK, "Par", "Impar", function () { var n = ri(1, 100); return { t: String(n), yes: n % 2 === 1 }; }],
    ["m3", "Múltiplos de 3 al costado", "Derecha si es múltiplo de 3.", ORA, "No", "Sí", function () { var n = ri(1, 60); return { t: String(n), yes: n % 3 === 0 }; }],
    ["veg", "Fruta o verdura", "Fruta a la derecha, verdura a la izquierda.", GRN, "Verdura", "Fruta", function () { var y = Math.random() < 0.5; return { t: pickOf(y ? FRUTAS : VERD), yes: y }; }],
    ["mam", "Mamífero o no", "Mamíferos a la derecha, los demás a la izquierda.", ORA, "No", "Mamífero", function () { var y = Math.random() < 0.5; return { t: pickOf(y ? MAM : NOMAM), yes: y }; }],
    ["pais", "País o ciudad", "País a la derecha, ciudad a la izquierda.", RED, "Ciudad", "País", function () { var y = Math.random() < 0.5; return { t: pickOf(y ? PAIS : CIU), yes: y }; }],
    ["rest", "¿Está bien la resta?", "Derecha si la resta está bien, izquierda si está mal.", PUR, "Mal", "Bien", function () { var a = ri(5, 30), b = ri(1, a), ok = Math.random() < 0.5, r = ok ? a - b : a - b + pickOf([-2, -1, 1, 2]); return { t: a + " − " + b + " = " + r, yes: ok }; }],
    ["yp", "Amarillo o violeta", "Amarillo a la derecha, violeta a la izquierda.", YEL, "Violeta", "Amarillo", function () { var y = Math.random() < 0.5; return { sh: 0, r: 38, col: y ? YEL : PUR, yes: y }; }, 2.2],
    ["tc", "Triángulo o círculo", "Triángulo a la derecha, círculo a la izquierda.", GRN, "Círculo", "Triángulo", function () { var y = Math.random() < 0.5; return { sh: y ? 2 : 0, r: 34, col: "#fff", yes: y }; }, 2.4],
    ["dd", "Dígitos iguales", "Derecha si los dos dígitos son iguales (como 44).", PNK, "Distintos", "Iguales", function () { var y = Math.random() < 0.4, n = y ? ri(1, 10) * 11 : ri(10, 100); if (!y) while (n % 11 === 0) n = ri(10, 100); return { t: String(n), yes: y }; }]
  ].forEach(function (v) { mkDec({ id: v[0], name: v[1], how: v[2], acc: v[3], l: v[4], r: v[5], gen: v[6], t: v[7] }); });
  [
    ["yel", "Solo amarillo", "Tocá solamente cuando aparezca el amarillo.", YEL, "Tocá solo el amarillo", function () { var g = Math.random() < 0.4; return { sh: 0, col: g ? YEL : pickOf([RED, GRN, PUR]), go: g }; }],
    ["zero", "El cero", "Tocá solamente cuando aparezca el 0.", PUR, "Tocá solo el 0", function () { var g = Math.random() < 0.35; return { t: String(g ? 0 : ri(1, 10)), go: g }; }],
    ["tri", "Triángulos al vuelo", "Tocá solamente cuando aparezca un triángulo.", GRN, "Tocá solo el triángulo", function () { var k = ri(0, 4); return { sh: k, col: "#fff", go: k === 2 }; }],
    ["dif", "Cambió", "Tocá cuando la figura sea distinta a la anterior.", ORA, "Tocá si cambió", function (pv) { var sh = pv && Math.random() < 0.5 ? pv.sh : ri(0, 4); return { sh: sh, col: "#fff", go: !!pv && sh !== pv.sh }; }],
    ["odd", "Impares al vuelo", "Tocá solamente cuando el número sea impar.", PNK, "Tocá solo los impares", function () { var n = ri(1, 30); return { t: String(n), go: n % 2 === 1 }; }],
    ["x", "La equis", "Tocá solamente cuando aparezca la X.", RED, "Tocá solo la X", function () { var g = Math.random() < 0.35; return { t: g ? "X" : pickOf("ABKMNVYZ".split("")), go: g }; }],
    ["sml", "El chiquito", "Tocá solamente cuando el círculo sea chico.", GRN, "Tocá solo los chicos", function () { var g = Math.random() < 0.45; return { sh: 0, r: g ? 28 : 80, col: g ? GRN : GRY, go: g }; }],
    ["nost", "Menos la estrella", "Tocá siempre, menos cuando aparece la estrella.", YEL, "Tocá todo menos la estrella", function () { var s = Math.random() < 0.3; return { sh: s ? 6 : pickOf([0, 1, 2, 3]), col: s ? YEL : "#fff", go: !s }; }]
  ].forEach(function (v) { mkGo({ id: v[0], name: v[1], how: v[2], acc: v[3], hint: v[4], gen: v[5] }); });
  [
    { id: "barw", name: "Barra tranquila", how: "Una barra lenta con zona grande. Tocá cuando esté en la zona.", type: "bar", sp: 0.55, zw: 0.3, acc: GRN },
    { id: "cupf", name: "Vaso rápido", how: "El vaso se llena y vacía rápido. Tocá en la zona.", type: "vert", fill: 1, sp: 1.3, acc: PNK },
    { id: "prec", name: "Reloj preciso", how: "La aguja va lenta pero la zona es mínima.", type: "ring", saw: 1, sp: 0.35, zw: 0.1, acc: YEL },
    { id: "swing", name: "Hamaca", how: "La hamaca va y viene. Tocá cuando pase por el tramo verde.", type: "arc", sp: 0.6, zw: 0.26, acc: ORA },
    { id: "shrs", name: "Aro lento", how: "El círculo se achica despacio. Tocá cuando coincida con el aro.", type: "shrink", saw: 1, sp: 0.3, acc: PUR },
    { id: "ease", name: "Barra que frena", how: "La raya frena en los bordes y acelera en el medio.", type: "bar", sin: 1, sp: 0.9, acc: RED }
  ].forEach(function (v) { v.zc = GRN; mkTime(v); });
  [
    { id: "hurd", name: "Vallas", how: "Muchas vallas bajitas. Apretá para saltar.", types: ["block"], sp: 290, g: 3200, jv: 640, col: YEL },
    { id: "giant", name: "Gigantes", how: "Murallas y cajas. Mantené apretado para las altas.", types: ["tall", "block"], sp: 250, g: 2700, jv: 740, col: PUR, round: 1 },
    { id: "sprint", name: "Sprint", how: "Muy rápido y solo cajas. Apretá para saltar.", types: ["block"], sp: 430, g: 3400, jv: 740, col: GRN },
    { id: "float", name: "Flotador", how: "Poca gravedad y murallas altas.", types: ["tall", "spike"], sp: 230, g: 1400, jv: 560, col: "#e6e6e6" },
    { id: "pitfly", name: "Pozos y barras", how: "Saltá los pozos pero no saltes cuando vengan barras en el aire.", types: ["pit", "fly"], sp: 260, g: 3000, jv: 700, col: RED },
    { id: "dturbo", name: "Doble turbo", how: "Rápido y con doble salto: apretá otra vez en el aire.", types: ["tall", "pit", "block"], sp: 360, g: 3200, jv: 660, dbl: 1, col: ORA, round: 1 }
  ].forEach(mkRun);
  [
    { id: "rain", name: "Lluvia de rocas", how: "Caen rocas en grupo. Dispará y movete.", sh: 0, col: GRY, types: [{ w: 28, hp: 1, v: 120 }], iv: 1.1, min: 0.7, pack: 1, fi: 0.24 },
    { id: "zz", name: "Naves zigzag", how: "Naves que zigzaguean y disparan.", sh: 2, col: PNK, types: [{ w: 34, hp: 2, v: 75 }], iv: 1.1, min: 0.6, sway: 110, shoot: 1 },
    { id: "hard", name: "Bloques duros", how: "Bloques que aguantan cinco disparos.", sh: 1, col: YEL, types: [{ w: 50, hp: 5, v: 45 }], iv: 1.6, min: 1.0, pts: 3, fi: 0.22 },
    { id: "frd2", name: "Cuidado con los amigos", how: "Hay muchos verdes amigos. Dispará solo a los rojos.", sh: 0, col: RED, types: [{ w: 34, hp: 1, v: 100 }, { w: 34, hp: 1, v: 100, fr: 1 }, { w: 34, hp: 1, v: 100, fr: 1 }], iv: 0.6 },
    { id: "fast", name: "Ataque veloz", how: "Enemigos chicos y muy rápidos.", sh: 2, col: ORA, types: [{ w: 22, hp: 1, v: 240 }], iv: 0.55, min: 0.3, fi: 0.22 },
    { id: "fort", name: "Fortaleza", how: "Gigantes que disparan. Aguantá y rompelos.", sh: 1, col: PUR, types: [{ w: 90, hp: 12, v: 30 }], iv: 2.2, min: 1.4, shoot: 1, pts: 4, fi: 0.22 }
  ].forEach(mkShoot);
  [
    { id: "night", name: "Vuelo nocturno", how: "Tubos y minas. Mantené apretado para subir.", types: ["pipe", "mine"], th: 1900, g: 1150, vm: 330, sp: 160, iv: 1.1, col: PUR },
    { id: "ringm", name: "Aros y minas", how: "Pasá por los aros y esquivá las minas.", types: ["ring", "mine"], th: 1900, g: 1150, vm: 330, sp: 150, iv: 1.0, col: ORA },
    { id: "tight", name: "Túnel angosto", how: "Huecos chicos y rápidos. Mantené apretado para subir.", types: ["pipe"], th: 2100, g: 1300, vm: 350, sp: 200, iv: 1.0, gap: 0.24, col: RED },
    { id: "coins", name: "Lluvia de monedas", how: "Juntá todas las monedas que puedas. Hay pocas minas.", types: ["coin", "coin", "coin", "mine"], th: 1800, g: 1100, vm: 320, sp: 150, iv: 0.6, col: GRN }
  ].forEach(mkFly);
  [
    { id: "lab", name: "Laberinto", how: "Curvas cerradas y camino angosto.", amp: 95, f1: 0.026, f2: 0.05, w: 110, v: 170, col: YEL },
    { id: "mount", name: "Montaña", how: "Curvas largas que van de un lado al otro.", amp: 120, f1: 0.009, f2: 0.02, w: 130, v: 210, col: GRN },
    { id: "ice", name: "Pista de hielo", how: "Rápido y ancho. No te salgas.", amp: 90, f1: 0.012, f2: 0.03, w: 170, v: 330, col: "#e6e6e6" },
    { id: "belt", name: "Cinta", how: "La cinta se angosta mucho en algunas partes.", amp: 80, f1: 0.012, f2: 0.028, w: 140, wv: 55, v: 190, col: PNK }
  ].forEach(mkPath);
  mkSeq({ id: "s42", name: "Secuencia 4×2", how: "Mirá el orden en que se prenden y repetilo.", cols: 4, rows: 2, acc: PNK });
  mkCells({ id: "c43", name: "Posiciones 4×3", how: "Memorizá las casillas que se iluminan y tocalas.", cols: 4, rows: 3, k0: 3, acc: GRN });
  mkPairs({ id: "n2", name: "Parejas grandes", how: "Veinte casillas. Encontrá los números iguales.", cols: 4, rows: 5, kind: "num", acc: YEL });
  mkLaunch({ id: "moon", name: "Tiro lunar", how: "Poca gravedad: la pelota vuela lejos. Mantené y soltá.", a: 0.75, v0: 170, v1: 380, g: 380, acc: "#e6e6e6" });
  mkLaunch({ id: "mini", name: "Minigolf", how: "Hoyos cerca y chiquitos. Mantené para cargar y soltá.", roll: 1, mu: 300, v0: 160, v1: 300, tol: 24, acc: GRN });
  mkBal({ id: "f", name: "Equilibrio extremo", how: "Tabla corta, resbalosa y con viento.", len: 110, fr: 0.25, wind: 1, acc: RED });
  mkClay({ id: "g", name: "Platos gigantes", how: "Platos grandes y lentos. Ideal para calentar.", v: 160, r: 40, acc: YEL });
