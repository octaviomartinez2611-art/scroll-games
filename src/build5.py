s=open('swipe-arcade.html',encoding='utf-8').read()
b64=open('silent.b64').read()
def rep(old,new):
    global s
    assert s.count(old)==1,(s.count(old),old[:80]); s=s.replace(old,new)
i=s.index("  /* ---------- sound ---------- */"); j=s.index("  function vib(ms)")
s=s[:i]+'''  /* ---------- sound ---------- */
  /* Web Audio. En iPhone el sonido de la web se silencia con el botón de silencio: para que suene igual
     se marca la sesión como "playback" y se reproduce un audio mudo al primer toque. */
  var AC = null, MG = null, lastSfx = 0, SIL = null;
  function audioUp() {
    try {
      if (navigator.audioSession) navigator.audioSession.type = "playback";
      if (!AC) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return; AC = new C(); MG = AC.createGain(); MG.gain.value = 1.6; MG.connect(AC.destination); }
      if (AC.state !== "running") AC.resume();
      var b = AC.createBuffer(1, 1, 22050), src = AC.createBufferSource(); src.buffer = b; src.connect(AC.destination); src.start(0);
      if (!SIL) { SIL = new Audio("data:audio/wav;base64,''' + b64 + '''"); SIL.loop = true; SIL.volume = 0.01; }
      if (P.sound && SIL.paused) { var pr = SIL.play(); if (pr && pr.catch) pr.catch(function () {}); }
    } catch (e) {}
  }
  ["pointerdown", "touchend", "keydown"].forEach(function (ev) { window.addEventListener(ev, audioUp, true); });
  function sfx(f, d, type, vol, slide) {
    if (!P.sound) return;
    try {
      if (!AC) audioUp(); if (!AC) return;
      if (AC.state === "suspended") AC.resume();
      var t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain(); lastSfx = performance.now();
      o.type = type || "sine"; o.frequency.setValueAtTime(f, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f * slide), t + d);
      g.gain.setValueAtTime(vol || 0.08, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(MG); o.start(t); o.stop(t + d);
    } catch (e) {}
  }
'''+s[j:]
# every point makes a small sound (unless another sound just played)
rep('''  Game.prototype.add = function (n) {
    this.score += (n || 1);''','''  Game.prototype.add = function (n) {
    this.score += (n || 1); if (performance.now() - lastSfx > 90) S.hit(Math.min(this.score, 12));''')
# speaker button next to coins
rep('<div class="topr" id="topr"><span class="coins">','<div class="topr" id="topr"><button class="snd" id="sndTop" aria-label="Sonido"><svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path class="w" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/><path class="x" d="M15.5 9.5l5 5M20.5 9.5l-5 5"/></svg></button><span class="coins">')
rep('.topr { position: absolute;','.topr { display: flex; gap: 8px; align-items: center; position: absolute;')
rep('/* ---- sheets ---- */','''.snd { width: 34px; height: 34px; border-radius: 50%; background: rgba(255, 255, 255, 0.12); display: grid; place-items: center; }
.snd svg { width: 20px; height: 20px; fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.snd .x { display: none; }
.snd.off .x { display: inline; } .snd.off .w { display: none; }
/* ---- sheets ---- */''')
rep('  $("sndBtn").addEventListener("click", function () { P.sound = !P.sound; save(); renderProfile(); if (P.sound) S.hit(3); });',
'''  function sndUI() { $("sndTop").classList.toggle("off", !P.sound); $("sndTop").setAttribute("aria-pressed", String(P.sound)); if (SIL) { if (P.sound) { var pr = SIL.play(); if (pr && pr.catch) pr.catch(function () {}); } else SIL.pause(); } }
  function toggleSound() { P.sound = !P.sound; save(); sndUI(); if (view === "profile") renderProfile(); if (P.sound) { audioUp(); S.perfect(); } }
  $("sndBtn").addEventListener("click", toggleSound);
  $("sndTop").addEventListener("click", function (e) { e.stopPropagation(); toggleSound(); });
  sndUI();''')
open('swipe-arcade.html','w',encoding='utf-8').write(s)
open('chk.js','w').write(s[s.index('<script>')+8:s.rindex('</script>')]); print('ok')
s=open('swipe-arcade.html',encoding='utf-8').read()
def rep(old,new):
    global s
    assert s.count(old)==1,(s.count(old),old[:80]); s=s.replace(old,new)
# x2 speed: a small discreet button next to the speaker; the active game runs two steps per frame
rep('<div class="topr" id="topr"><button class="snd" id="sndTop"','<div class="topr" id="topr"><button class="spd" id="spdTop" aria-label="Velocidad x2" aria-pressed="false">2×</button><button class="snd" id="sndTop"')
rep('/* ---- sheets ---- */','''.spd { height: 26px; padding: 0 8px; border-radius: 999px; font: 700 12px/1 var(--body); color: rgba(255, 255, 255, 0.45); background: rgba(255, 255, 255, 0.06); }
.spd[aria-pressed="true"] { color: #000; background: #fff; }
/* ---- sheets ---- */''')
rep("        g.tick(dt); g.render(now); g.drawn = true;","        g.tick(dt); if (P.fast && g.state === \"play\") g.tick(dt); g.render(now); g.drawn = true;")
rep('  sndUI();','''  sndUI();
  function spdUI() { $("spdTop").setAttribute("aria-pressed", String(!!P.fast)); }
  $("spdTop").addEventListener("click", function (e) { e.stopPropagation(); P.fast = !P.fast; save(); spdUI(); sfx(P.fast ? 900 : 500, 0.1, "triangle", 0.06); });
  spdUI();''')
open('swipe-arcade.html','w',encoding='utf-8').write(s)
open('chk.js','w').write(s[s.index('<script>')+8:s.rindex('</script>')]); print('ok2')
s=open('swipe-arcade.html',encoding='utf-8').read()
def rep(old,new):
    global s
    assert s.count(old)==1,(s.count(old),old[:80]); s=s.replace(old,new)
# 2x moves to the rail, above the heart, bigger, and never hides
rep('<button class="spd" id="spdTop" aria-label="Velocidad x2" aria-pressed="false">2×</button>','')
rep('<div class="rail" id="rail">','<div class="rail" id="rail">\n      <button class="spd" id="spdTop" aria-label="Velocidad x2" aria-pressed="false">2×</button>')
rep('''.spd { height: 26px; padding: 0 8px; border-radius: 999px; font: 700 12px/1 var(--body); color: rgba(255, 255, 255, 0.45); background: rgba(255, 255, 255, 0.06); }''',
    '''.rail .spd { width: 46px; height: 46px; padding: 0; justify-content: center; border-radius: 50%; font: 700 17px/1 var(--body); color: #fff; background: rgba(255, 255, 255, 0.16); }''')
rep('.spd[aria-pressed="true"] { color: #000; background: #fff; }','.rail .spd[aria-pressed="true"] { color: #000; background: #fff; }')
rep('.rail.busy { opacity: 0; pointer-events: none; }','.rail button { transition: opacity 0.25s; }\n.rail.busy button:not(.spd) { opacity: 0; pointer-events: none; }')
# no coins anywhere
import re
s,n=re.subn(r'<span class="coins"><span class="coin"></span><span id="coinsN">0</span></span>','',s); assert n==1
rep('  function coinsUI() { $("coinsN").textContent = P.coins; }','  function coinsUI() {}')
rep('        <div class="stat"><b id="stCoins">0</b><span>Monedas</span></div>\n','')
rep(' $("stCoins").textContent = P.coins;','')
rep('.stats { display: grid; grid-template-columns: repeat(3, 1fr); }','.stats { display: grid; grid-template-columns: repeat(2, 1fr); }')
open('swipe-arcade.html','w',encoding='utf-8').write(s)
open('chk.js','w').write(s[s.index('<script>')+8:s.rindex('</script>')]); print('ok3')
s=open('swipe-arcade.html',encoding='utf-8').read()
def rep(old,new):
    global s
    assert s.count(old)==1,(s.count(old),old[:80]); s=s.replace(old,new)
# more room to play: the name goes up next to the hearts, smaller HUD, games use the whole height
rep("""'<div class="hud"><span class="hearts">' + HEART + HEART + HEART + '</span><div class="c">""",
    """'<div class="hud"><div class="l"><span class="hearts">' + HEART + HEART + HEART + '</span><b class="gname"></b></div><div class="c">""")
rep('''</div><div></div></div><div class="cap"><b></b></div>';''','''</div><div></div></div>';''')
rep('s.querySelector(".cap b").textContent = cfg.name;','s.querySelector(".gname").textContent = cfg.name;')
rep('.score { font: 600 52px/0.95 var(--display);','.score { font: 600 40px/0.95 var(--display);')
rep('.hearts { display: flex; gap: 4px; padding-top: 6px; }','''.hearts { display: flex; gap: 4px; padding-top: 4px; }
.hud .l { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.gname { font: 600 13px/1.15 var(--body); color: var(--dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 38vw; }''')
rep('.hearts svg { width: 22px; height: 22px;','.hearts svg { width: 18px; height: 18px;')
rep("this.pt = this.sec.querySelector(\".hud\").offsetHeight + 12; this.pb = 72;","this.pt = this.sec.querySelector(\".hud\").offsetHeight + 8; this.pb = 24;")
rep("c.save(); c.beginPath(); c.rect(0, 0, this.W, this.H - 46); c.clip();","c.save();")
rep('.tab { flex: 1; min-height: 52px;','.tab { flex: 1; min-height: 44px;')
rep('  padding: 14px max(16px, env(safe-area-inset-right, 0px)) 0 max(16px, env(safe-area-inset-left, 0px)); pointer-events: none;','  padding: 10px max(16px, env(safe-area-inset-right, 0px)) 0 max(16px, env(safe-area-inset-left, 0px)); pointer-events: none;')
open('swipe-arcade.html','w',encoding='utf-8').write(s)
open('chk.js','w').write(s[s.index('<script>')+8:s.rindex('</script>')]); print('ok4')
s=open('swipe-arcade.html',encoding='utf-8').read()
old="  CATALOG = CATALOG.concat(EXTRA);"
assert s.count(old)==1
s=s.replace(old,'  CATALOG = CATALOG.concat(EXTRA).filter(function (g) { return ["wheel", "x_21", "x_dice"].indexOf(g.id) < 0; }); /* sin juegos de apuestas */')
open('swipe-arcade.html','w',encoding='utf-8').write(s)
open('chk.js','w').write(s[s.index('<script>')+8:s.rindex('</script>')]); print('ok5')
s=open('swipe-arcade.html',encoding='utf-8').read()
def rep(old,new):
    global s
    assert s.count(old)==1,(s.count(old),old[:80]); s=s.replace(old,new)
# ---- color: cada juego tiene su fondo de color (plano) y sus paneles en el mismo tono ----
i=s.index('  function Game(sec, cfg) {'); j=s.index('  var CATALOG = [')
region=s[i:j]
for lits,tk in [(['"#111"','"#141414"','"#1a1a1a"','"#1c1c1c"'],'TH.p1'),(['"#1f1f1f"','"#222"','"#262626"'],'TH.p2'),(['"#2a2a2a"','"#2c2c2c"','"#333"','"#3a3a3a"'],'TH.p3'),(['"#444"','"#555"'],'TH.p4')]:
    for l in lits: region=region.replace(l,tk)
s=s[:i]+region+s[j:]
rep('  function Game(sec, cfg) {','''  /* Paletas: un tono por juego, lejos del color principal del juego para que todo se vea */
  var HUES = [268, 292, 318, 340, 356, 14, 28, 40, 132, 152, 166, 178];
  function hexHue(h) {
    if (!h || h[0] !== "#" || h.length < 7) return -1; var r = parseInt(h.substr(1, 2), 16) / 255, g = parseInt(h.substr(3, 2), 16) / 255, b = parseInt(h.substr(5, 2), 16) / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (d < 0.15) return -1;
    var hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return (hh * 60 + 360) % 360;
  }
  function themeFor(cfg) {
    var id = cfg.id || "", hs = 0, k; for (k = 0; k < id.length; k++) hs = (hs * 31 + id.charCodeAt(k)) >>> 0;
    var ah = hexHue(cfg.accent), ok = HUES.filter(function (h) { if (ah < 0) return true; var dd = Math.abs(h - ah) % 360; return Math.min(dd, 360 - dd) > 60; });
    var h = ok[hs % ok.length], sat = (h > 120 && h < 190) ? 45 : 55;
    function L(l) { return "hsl(" + h + "," + sat + "%," + l + "%)"; }
    return { bg: L(15), p1: L(20), p2: L(25), p3: L(31), p4: L(40) };
  }
  var TH = themeFor({ id: "x" });
  function Game(sec, cfg) {
    this.th = themeFor(cfg);''')
rep('''  Game.prototype.render = function (now) {
    var c = this.ctx, i;''','''  Game.prototype.render = function (now) {
    var c = this.ctx, i; TH = this.th;''')
rep('    s.cfg = cfg; feed.appendChild(s); slides.push(s); N = slides.length;','    s.cfg = cfg; s.style.background = themeFor(cfg).bg; feed.appendChild(s); slides.push(s); N = slides.length;')
open('swipe-arcade.html','w',encoding='utf-8').write(s)
open('chk.js','w').write(s[s.index('<script>')+8:s.rindex('</script>')]); print('ok6')
s=open('swipe-arcade.html',encoding='utf-8').read()
def rep(old,new):
    global s
    assert s.count(old)==1,(s.count(old),old[:80]); s=s.replace(old,new)
# ---- volumen tipo juguete: todo lo que dibuja un juego tiene una base sólida más oscura debajo (sin difuminado) ----
rep('    return { bg: L(15), p1: L(20), p2: L(25), p3: L(31), p4: L(40) };','    return { bg: L(15), p1: L(20), p2: L(25), p3: L(31), p4: L(40), deco: L(18), seed: hs };')
i=s.index("  Game.prototype.render = function (now) {"); j=s.index("  Game.prototype.hud = function () {")
s=s[:i]+'''  /* Render en capas:
     1) fondo con formas grandes y quietas en un tono apenas más claro que el fondo del juego
     2) el juego se dibuja en una capa aparte
     3) esa capa se copia oscurecida y corrida 4 px hacia abajo (la base sólida) y encima va la capa normal */
  var LAY = null, TMP = null;
  function layers(w, h) {
    if (!LAY) { LAY = document.createElement("canvas"); TMP = document.createElement("canvas"); }
    if (LAY.width !== w || LAY.height !== h) { LAY.width = TMP.width = w; LAY.height = TMP.height = h; }
  }
  function decor(c, g) {
    if (!g.deco) {
      var sd = g.th.seed || 1, rn = function () { sd = (sd * 1103515245 + 12345) & 0x7fffffff; return sd / 0x7fffffff; }, a = [], k;
      for (k = 0; k < 4; k++) a.push({ x: rn() * g.W, y: g.pt + rn() * (g.H - g.pt), r: 70 + rn() * 150, sq: rn() < 0.35, an: rn() * PI });
      g.deco = a;
    }
    c.fillStyle = g.th.deco;
    for (var i = 0; i < g.deco.length; i++) {
      var o = g.deco[i];
      if (o.sq) { c.save(); c.translate(o.x, o.y); c.rotate(o.an); rr(c, -o.r * 0.8, -o.r * 0.8, o.r * 1.6, o.r * 1.6, o.r * 0.35); c.fill(); c.restore(); }
      else { c.beginPath(); c.arc(o.x, o.y, o.r, 0, TAU); c.fill(); }
    }
  }
  Game.prototype.render = function (now) {
    var c = this.ctx, d = this.cv.width / this.W; TH = this.th;
    c.clearRect(0, 0, this.W, this.H); decor(c, this);
    layers(this.cv.width, this.cv.height);
    var L = LAY.getContext("2d"); L.setTransform(1, 0, 0, 1, 0, 0); L.clearRect(0, 0, LAY.width, LAY.height); L.setTransform(d, 0, 0, d, 0, 0);
    this.ctx = L; L.save(); try { this.draw(now); } finally { L.restore(); L.globalAlpha = 1; this.ctx = c; }
    var T = TMP.getContext("2d"); T.setTransform(1, 0, 0, 1, 0, 0); T.globalCompositeOperation = "copy"; T.drawImage(LAY, 0, 0);
    T.globalCompositeOperation = "source-atop"; T.fillStyle = "rgba(0,0,0,0.4)"; T.fillRect(0, 0, TMP.width, TMP.height); T.globalCompositeOperation = "source-over";
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(TMP, 0, Math.round(4 * d)); c.drawImage(LAY, 0, 0); c.restore();
  };
'''+s[j:]
s=s.replace("this.cv.width = Math.round(this.W * d); this.cv.height = Math.round(this.H * d);","this.cv.width = Math.round(this.W * d); this.cv.height = Math.round(this.H * d); this.deco = null;",1)
# el puntaje late un poquito cuando sumás
rep('''  Game.prototype.hud = function () {
    this.el.score.textContent = this.score;''','''  Game.prototype.hud = function () {
    var se = this.el.score;
    if (this.score > (this._ls || 0)) { se.style.transform = "scale(1.18)"; clearTimeout(this._bt); this._bt = setTimeout(function () { se.style.transform = ""; }, 110); }
    this._ls = this.score;
    this.el.score.textContent = this.score;''')
rep('.score { font: 600 40px/0.95 var(--display);','.score { transition: transform 0.11s ease-out; font: 600 40px/0.95 var(--display);')
open('swipe-arcade.html','w',encoding='utf-8').write(s)
open('chk.js','w').write(s[s.index('<script>')+8:s.rindex('</script>')]); print('ok7')
s=open('swipe-arcade.html',encoding='utf-8').read()
def rep(old,new,allow=False):
    global s
    n=s.count(old); assert n==1 or (allow and n>=1),(n,old[:80]); s=s.replace(old,new)
# ---- caras para los personajes y un escenario propio para cada juego ----
rep('    return { bg: L(15), p1: L(20), p2: L(25), p3: L(31), p4: L(40), deco: L(18), seed: hs };',
    '    return { bg: L(15), p1: L(20), p2: L(25), p3: L(31), p4: L(40), lt: L(52), deco: L(18), seed: hs, h: h };')
rep('  var TH = themeFor({ id: "x" });','''  var TH = themeFor({ id: "x" });
  /* Cara: ojos con pupilas que miran hacia donde se mueve el personaje y una sonrisa */
  function face(c, x, y, r, look) {
    var e = r * 0.3, ex = r * 0.36, ey = -r * 0.14, lk = Math.max(-1, Math.min(1, look || 0)) * e * 0.4;
    c.fillStyle = "#fff"; c.beginPath(); c.arc(x - ex, y + ey, e, 0, TAU); c.moveTo(x + ex + e, y + ey); c.arc(x + ex, y + ey, e, 0, TAU); c.fill();
    c.fillStyle = "#17121f"; c.beginPath(); c.arc(x - ex + lk, y + ey + e * 0.12, e * 0.52, 0, TAU); c.moveTo(x + ex + lk + e * 0.52, y + ey + e * 0.12); c.arc(x + ex + lk, y + ey + e * 0.12, e * 0.52, 0, TAU); c.fill();
    c.strokeStyle = "#17121f"; c.lineWidth = Math.max(1.6, r * 0.09); c.lineCap = "round"; c.beginPath(); c.arc(x, y + r * 0.2, r * 0.2, 0.15 * PI, 0.85 * PI); c.stroke(); c.lineCap = "butt";
  }
''')
# caras en juegos viejos
rep('ball(c, tx + this.mx * tw, ty, 22, inside ? "#3ddc84" : "#ff4d6d");','ball(c, tx + this.mx * tw, ty, 22, inside ? "#3ddc84" : "#ff4d6d"); face(c, tx + this.mx * tw, ty, 22, (this.tm - this.mx) * 6);')
rep('ball(c, this.cx, this.cy, Math.max(4, this.rad), inb ? "#3ddc84" : "#ff4d6d");','ball(c, this.cx, this.cy, Math.max(4, this.rad), inb ? "#3ddc84" : "#ff4d6d"); if (this.rad > 14) face(c, this.cx, this.cy, this.rad, 0);', True)
rep('''glossy(c, this.px - this.ps / 2, this.py - this.ps / 2, this.ps, this.ps, 12, "#ffffff", "#cfcfcf");
        c.fillStyle = this.cfg.accent; c.beginPath(); c.arc(this.px, this.py, this.ps * 0.17, 0, TAU); c.fill();''','''glossy(c, this.px - this.ps / 2, this.py - this.ps / 2, this.ps, this.ps, 12, "#ffd23f", "#ffd23f"); face(c, this.px, this.py + 1, this.ps / 2, (this.tx - this.px) / 30);''')
open('swipe-arcade.html','w',encoding='utf-8').write(s)
open('chk.js','w').write(s[s.index('<script>')+8:s.rindex('</script>')]); print('ok8')
s=open('swipe-arcade.html',encoding='utf-8').read()
def rep(old,new):
    global s
    assert s.count(old)==1,(s.count(old),old[:80]); s=s.replace(old,new)
# ---- escenarios relacionados con cada juego ----
rep('  /* Paletas: un tono por juego,', open('scenes.js',encoding='utf-8').read()+'\n  /* Paletas: un tono por juego,')
rep('    var h = ok[hs % ok.length], sat = (h > 120 && h < 190) ? 45 : 55;','    var scn = sceneOf(cfg), sc = SCENES[scn], h = sc.h, sat = sc.s;')
rep("    return { bg: L(15), p1: L(20), p2: L(25), p3: L(31), p4: L(40), lt: L(52), deco: L(18), seed: hs, h: h };","    return { bg: L(15), p1: L(20), p2: L(25), p3: L(31), p4: L(40), lt: L(52), deco: L(18), seed: hs || 1, h: h, scene: scn };")
i=s.index('  function decor(c, g) {'); j=s.index('  Game.prototype.render = function (now) {', i)
s=s[:i]+'''  function decor(c, g) {
    if (!g.bgc || g.bgc.width !== g.cv.width || g.bgc.height !== g.cv.height) {
      var d = g.cv.width / g.W, b = document.createElement("canvas"); b.width = g.cv.width; b.height = g.cv.height;
      var bc = b.getContext("2d"); bc.setTransform(d, 0, 0, d, 0, 0);
      var sd = g.th.seed, rn = function () { sd = (sd * 1103515245 + 12345) & 0x7fffffff; return sd / 0x7fffffff; };
      try { SCENES[g.th.scene].paint(bc, g.W, g.H, rn); } catch (e) { bc.fillStyle = g.th.bg; bc.fillRect(0, 0, g.W, g.H); }
      g.bgc = b;
    }
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(g.bgc, 0, 0); c.restore();
  }
'''+s[j:]
s=s.replace("this.deco = null;","this.deco = null; this.bgc = null;",1)
# ---- nombre abajo, transparente, no tapa ni bloquea el juego ----
rep('''<div class="l"><span class="hearts">' + HEART + HEART + HEART + '</span><b class="gname"></b></div>''','''<div class="l"><span class="hearts">' + HEART + HEART + HEART + '</span></div>''')
rep('''</div><div></div></div>';''','''</div><div></div></div><b class="gname"></b>';''')
rep('.gname { font: 600 13px/1.15 var(--body); color: var(--dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 38vw; }',
    '.gname { position: absolute; left: max(16px, env(safe-area-inset-left, 0px)); bottom: 12px; z-index: 2; pointer-events: none; font: 700 16px/1.15 var(--body); color: rgba(255, 255, 255, 0.85); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 62%; }')
# ---- buscador al elegir un juego para mandar ----
rep('<h2 id="pkT">Elegí un juego</h2><div id="pickList"','<h2 id="pkT">Elegí un juego</h2><input id="pickQ" class="pickq" placeholder="Buscar juego" autocomplete="off" aria-label="Buscar juego"><div id="pickList"')
rep('/* ---- sheets ---- */','.pickq { flex: none; background: var(--panel2); border: 0; border-radius: 12px; padding: 12px 14px; color: #fff; font: 500 16px/1.2 var(--body); user-select: text; -webkit-user-select: text; }\n.pickq:focus { outline: 2px solid var(--brand); }\n/* ---- sheets ---- */')
rep('  /* ---------- main loop ---------- */','''  function normTxt(t) { return String(t).toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, ""); }
  var HOW_BY_NAME = {}; CATALOG.forEach(function (g) { HOW_BY_NAME[g.name] = g.how || ""; });
  $("pickQ").addEventListener("input", function () {
    var q = normTxt(this.value.trim());
    [].forEach.call($("pickList").children, function (b) { var n = b.textContent; b.hidden = !!q && normTxt(n + " " + (HOW_BY_NAME[n] || "")).indexOf(q) < 0; });
  });
  $("chatGame").addEventListener("click", function () { $("pickQ").value = ""; [].forEach.call($("pickList").children, function (b) { b.hidden = false; }); });

  /* ---------- main loop ---------- */''')
open('swipe-arcade.html','w',encoding='utf-8').write(s)
open('chk.js','w').write(s[s.index('<script>')+8:s.rindex('</script>')]); print('ok8')
s=open('swipe-arcade.html',encoding='utf-8').read()
def rep(old,new):
    global s
    assert s.count(old)==1,(s.count(old),old[:80]); s=s.replace(old,new)
# ---- link directo a un juego: sitio/#id (guiones en vez de guion bajo, ej. #c-eggs) ----
rep('  /* ---------- main loop ---------- */','''  function openFromHash() { var h = (location.hash || "").slice(1).replace(/-/g, "_"); if (h && byId[h]) setTimeout(function () { goTo(h); }, 60); }
  window.addEventListener("hashchange", openFromHash); openFromHash();

  /* ---------- main loop ---------- */''')
open('swipe-arcade.html','w',encoding='utf-8').write(s)
open('chk.js','w').write(s[s.index('<script>')+8:s.rindex('</script>')]); print('ok9')
s=open('swipe-arcade.html',encoding='utf-8').read()
def rep(old,new):
    global s
    assert s.count(old)==1,(s.count(old),old[:80]); s=s.replace(old,new)
# ---- enganche: racha x2, rival entre amigos, récord, desafío del día ----
rep('  var UI = { onEnd: null };','''  var UI = { onEnd: null };
  var FB = {}; /* récords de los amigos: { amigo: { juego: puntos } } (lo llena la versión con servidor) */
  function rivalFor(id, sc) { var r = null; for (var n in FB) { var b = (FB[n] || {})[id] || 0; if (b > sc && (!r || b < r.best)) r = { name: n, best: b }; } return r; }
  function friendsPlayed(id) { for (var n in FB) if ((FB[n] || {})[id]) return true; return false; }
  function rankFor(id) { var a = [{ name: "Vos", best: P.best[id] || 0, me: 1 }]; for (var n in FB) if ((FB[n] || {})[id]) a.push({ name: n, best: FB[n][id] }); a.sort(function (x, y) { return y.best - x.best; }); return a; }''')
rep('''    this.score += n; this.combo++; this.acts++;''','''    this.score += n * (this.streak >= 10 ? 2 : 1); this.streak += n; this.combo++; this.acts++;''')
rep('''    this.score += (n || 1); if (performance.now() - lastSfx > 90) S.hit(Math.min(this.score, 12));''','''    var was = this.streak >= 10; this.score += (n || 1) * (was ? 2 : 1); this.streak += (n || 1);
    if (!was && this.streak >= 10) S.perfect(); else if (performance.now() - lastSfx > 90) S.hit(Math.min(this.streak, 12));''')
rep("this.lives--; stOf(this.cfg.id).h++; this.combo = 0;","this.lives--; stOf(this.cfg.id).h++; this.combo = 0; this.streak = 0;")
rep("this.pops = []; this.parts = []; this.rings = [];","this.pops = []; this.parts = []; this.rings = []; this.streak = 0; this._rv = undefined; this._ls = 0;")
rep('''    this.el.score.textContent = this.score; this.el.best.textContent = "Mejor " + this.best;''','''    var id = this.cfg.id, hot = this.streak >= 10, rv = rivalFor(id, this.score), top = Math.max(this.best, this.score), bt;
    if (this._rv && (!rv || rv.name !== this._rv) && this.state === "play") S.perfect();
    this._rv = rv ? rv.name : null;
    if (rv) bt = "Superá a " + rv.name + " · " + rv.best; else if (friendsPlayed(id) && top > 0) bt = "1º entre amigos · " + top; else if (this.newBest && this.score >= 3) bt = "Récord nuevo"; else bt = "Mejor " + this.best;
    se.classList.toggle("hot", hot); this.el.score.textContent = this.score; this.el.best.textContent = (hot ? "×2 · " : "") + bt;''')
rep('.best { font: 700 11px/1 var(--body);','.score.hot { color: var(--gold); }\n.best { white-space: nowrap; font: 700 11px/1 var(--body);')
# ranking en la hoja de ayuda
rep('$("shT").textContent = sl.cfg.name; $("shP").textContent = sl.cfg.how;','''$("shT").textContent = sl.cfg.name; $("shP").textContent = sl.cfg.how;
    var rk = $("shRank"), ra = rankFor(sl.cfg.id); rk.innerHTML = "";
    if (ra.length > 1) ra.slice(0, 6).forEach(function (r, i) { var d = document.createElement("div"); d.className = "rk" + (r.me ? " me" : ""); d.innerHTML = "<span>" + (i + 1) + "º " + esc(r.name) + "</span><b>" + r.best + "</b>"; rk.appendChild(d); });''')
import re
m=re.search(r'<p id="shP"[^>]*></p>',s); assert m
s=s.replace(m.group(0),m.group(0)+'<div id="shRank" class="rank"></div>',1)
rep('/* ---- sheets ---- */','''.rank { display: flex; flex-direction: column; gap: 6px; }
.rk { display: flex; justify-content: space-between; background: var(--panel2); border-radius: 10px; padding: 10px 12px; font: 600 15px/1 var(--body); }
.rk.me { outline: 2px solid var(--brand); }
.daily { display: flex; justify-content: space-between; align-items: center; background: var(--panel); border-radius: 16px; padding: 14px 16px; font: 600 15px/1.2 var(--body); width: 100%; text-align: left; }
.daily em { font-style: normal; color: var(--brand); font-weight: 700; }
/* ---- sheets ---- */''')
# desafío del día: el mismo juego para todos, primer juego del día
rep('  fillFeed(0);\n','''  function today() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function dailyGame() { var t = today(), h = 7, k; for (k = 0; k < t.length; k++) h = (h * 31 + t.charCodeAt(k)) >>> 0; return CATALOG[h % NG]; }
  if (P.dailyDay !== today()) { P.dailyDay = today(); addSlide(dailyGame()); slides[0].querySelector(".gname").textContent = "Desafío de hoy · " + dailyGame().name; }
  fillFeed(0);
''')
rep('<button class="toggle" id="sndBtn" aria-pressed="true">','<button class="daily" id="dailyBtn"><span>Desafío de hoy</span><em id="dailyName"></em></button>\n      <button class="toggle" id="sndBtn" aria-pressed="true">')
rep('  function renderProfile() {\n    var inf = xpInfo(P.xp);','  $("dailyBtn").addEventListener("click", function () { goTo(dailyGame().id); });\n  function renderProfile() {\n    var inf = xpInfo(P.xp); $("dailyName").textContent = dailyGame().name + " · " + (P.best[dailyGame().id] || 0);')
open('swipe-arcade.html','w',encoding='utf-8').write(s)
open('chk.js','w').write(s[s.index('<script>')+8:s.rindex('</script>')]); print('ok10')
s=open('swipe-arcade.html',encoding='utf-8').read()
def rep(old,new):
    global s
    assert s.count(old)==1,(s.count(old),old[:80]); s=s.replace(old,new)
# ---- sprites con detalle en todas las familias ----
rep('  var SCENE_BY = {};', open('sprites.js',encoding='utf-8').read()+'\n  var SCENE_BY = {};')
# atrapar
rep('''} else if (it.egg) { c.fillStyle = "#fff"; c.beginPath(); c.ellipse(it.x, it.y, 13, 17, 0, 0, TAU); c.fill(); } else if (it.bomb) { c.fillStyle = TH.p3; c.beginPath(); c.arc(it.x, it.y, 16, 0, TAU); c.fill(); c.strokeStyle = RED; c.lineWidth = 3; c.beginPath(); c.moveTo(it.x - 6, it.y - 6); c.lineTo(it.x + 6, it.y + 6); c.moveTo(it.x + 6, it.y - 6); c.lineTo(it.x - 6, it.y + 6); c.stroke(); } else sh2(c, it.s, it.x, it.y, it.r, it.col); }''',
'''} else if (it.egg) spEgg(c, it.x, it.y); else if (it.bomb) spBomb(c, it.x, it.y, 15); else if (it.s === 0 && it.col === YEL) spCoin(c, it.x, it.y, it.r); else if (it.s === 0 && it.col === GRY) spRock(c, it.x, it.y, it.r, "#8a8a8a", it.x * 7); else if (it.s === 1 && it.col === GRY) spRock(c, it.x, it.y, it.r, "#8a8a8a", it.x * 7); else if (it.s === 0 && it.col !== WHT && it.col !== "#2ec4b6") spFruit(c, it.x, it.y, it.r, it.col); else if (it.col === "#2ec4b6") { poly(c, [it.x - it.r * 0.8, it.y, it.x, it.y - it.r * 1.8, it.x + it.r * 0.8, it.y], it.col); dot(c, it.x, it.y, it.r * 0.8, it.col); } else sh2(c, it.s, it.x, it.y, it.r, it.col); }''')
# esquivar
rep('''          if (o.shape === 0) { c.beginPath(); c.arc(0, 0, z.w / 2, 0, TAU); c.fill(); } else if (o.shape === 2) { c.beginPath(); c.moveTo(0, z.h / 2); c.lineTo(z.w / 2, -z.h / 2); c.lineTo(-z.w / 2, -z.h / 2); c.closePath(); c.fill(); } else { c.fillRect(-z.w / 2, -z.h / 2, z.w, z.h); }''',
'''          var dk = DODGE_SP[o.id];
          if (dk === "rock") spRock(c, 0, 0, z.w / 2, o.col === GRY ? "#8a8a8a" : "#a9a9b3", z.w * 13);
          else if (dk === "fire") { c.restore(); spFire(c, z.x, z.y, z.w / 2); c.save(); }
          else if (dk === "flake") spFlake(c, 0, 0, z.w / 2);
          else if (dk === "saucer") spSaucer(c, 0, 0, z.w * 1.3, o.col);
          else if (dk === "bubble") { c.strokeStyle = "rgba(255,255,255,0.75)"; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, z.w / 2, 0, TAU); c.stroke(); dot(c, -z.w * 0.18, -z.w * 0.18, z.w * 0.08, "rgba(255,255,255,0.6)"); }
          else if (dk === "drop") { poly(c, [-z.w / 2, 0, 0, -z.w * 1.1, z.w / 2, 0], o.col); dot(c, 0, 0, z.w / 2, o.col); }
          else if (dk === "brick") spBrick(c, -z.w / 2, -z.h / 2, z.w, z.h, o.col);
          else if (dk === "saw") { c.restore(); spSaw(c, z.x, z.y, z.w / 2, z.t); c.save(); }
          else if (dk === "crate") spCrate(c, -z.w / 2, -z.h / 2, z.w, z.h);
          else if (dk === "column") { c.fillStyle = "#d9d4c7"; c.fillRect(-z.w / 2, -z.h / 2, z.w, z.h); c.fillStyle = "#b5ae9c"; for (var cx3 = -z.w / 2 + 5; cx3 < z.w / 2 - 2; cx3 += 8) c.fillRect(cx3, -z.h / 2 + 8, 2, z.h - 16); c.fillStyle = "#e9e4d7"; c.fillRect(-z.w / 2 - 4, -z.h / 2, z.w + 8, 8); c.fillRect(-z.w / 2 - 4, z.h / 2 - 8, z.w + 8, 8); }
          else if (dk === "arrow") spArrow(c, 0, 0, z.w, z.h);
          else if (dk === "leaf") spLeaf(c, 0, 0, z.w, z.h, o.col, z.t);
          else if (dk === "missile") spMissile(c, 0, 0, z.w, z.h);
          else if (dk === "spike") poly(c, [0, z.h / 2, z.w / 2, -z.h / 2, 0, -z.h / 4, -z.w / 2, -z.h / 2], "#d9dde3");
          else if (dk === "ninja") { c.restore(); spStar4(c, z.x, z.y, z.w / 2 + 2, z.t); c.save(); }
          else if (o.shape === 0) { c.beginPath(); c.arc(0, 0, z.w / 2, 0, TAU); c.fill(); } else if (o.shape === 2) { c.beginPath(); c.moveTo(0, z.h / 2); c.lineTo(z.w / 2, -z.h / 2); c.lineTo(-z.w / 2, -z.h / 2); c.closePath(); c.fill(); } else { c.fillRect(-z.w / 2, -z.h / 2, z.w, z.h); }''')
rep('  function mkDodge(o) {','''  var DODGE_SP = { met: "rock", big: "rock", hail: "rock", aval: "rock", wind: "rock", fire: "fire", cnn: "fire", snow: "flake", ufo: "saucer", bub: "bubble", acid: "drop", brk: "brick", bar: "brick", saw: "saw", cube: "crate", mix: "crate", col: "column", arr: "arrow", need: "arrow", leaf: "leaf", mis: "missile", rkt2: "missile", spk: "spike", ninja: "ninja" };
  function mkDodge(o) {''')
# corredores
rep('''          else if (b.type === "spike") { c.fillStyle = "#fff"; c.beginPath(); c.moveTo(b.x, this.gy); c.lineTo(b.x + b.w / 2, this.gy - b.h); c.lineTo(b.x + b.w, this.gy); c.closePath(); c.fill(); }
          else if (b.type === "fly") fillR(c, b.x, b.y, b.w, b.h, 6, RED);
          else fillR(c, b.x, this.gy - b.h, b.w, b.h, 4, b.type === "tall" ? ORA : "#f2f2f2");''','''          else if (b.type === "spike") spSpike(c, b.x, this.gy, b.w, b.h);
          else if (b.type === "fly") spBar(c, b.x, b.y, b.w, b.h);
          else if (b.type === "tall") spBrick(c, b.x, this.gy - b.h, b.w, b.h, ORA);
          else spCrate(c, b.x, this.gy - b.h, b.w, b.h);''')
# tiradores
rep('''          if (o.sh === 0) { c.beginPath(); c.arc(e.x, e.y, e.w / 2, 0, TAU); c.fill(); } else if (o.sh === 2) { c.beginPath(); c.moveTo(e.x, e.y + e.w / 2); c.lineTo(e.x + e.w / 2, e.y - e.w / 2); c.lineTo(e.x - e.w / 2, e.y - e.w / 2); c.closePath(); c.fill(); } else if (o.sh === 3) { c.beginPath(); c.ellipse(e.x, e.y, e.w / 2, e.w / 3.2, 0, 0, TAU); c.fill(); } else fillR(c, e.x - e.w / 2, e.y - e.w / 2, e.w, e.w, 6, col);''','''          var ec = e.fr ? GRN : (k < 1 ? mix(col.length === 7 ? col : "#ff4d6d", 0.35 * (1 - k)) : col);
          if (o.id === "bal") spBalloon(c, e.x, e.y, e.w / 2, ec); else if (o.id === "bug" || o.id === "swm") spBug(c, e.x, e.y, e.w / 2, ec);
          else if (o.sh === 0) spRock(c, e.x, e.y, e.w / 2, e.fr ? GRN : "#8a8a8a", e.w * 11); else if (o.sh === 2) spFighter(c, e.x, e.y, e.w, ec); else if (o.sh === 3) spSaucer(c, e.x, e.y, e.w, ec); else spTank(c, e.x, e.y, e.w, ec);''')
rep('''{ this.ctx.globalAlpha = this.fadeA(); c.fillStyle = "#fff"; c.beginPath(); c.moveTo(this.px, this.py - 16); c.lineTo(this.px + 16, this.py + 10); c.lineTo(this.px - 16, this.py + 10); c.closePath(); c.fill();  this.ctx.globalAlpha = 1; }''','''{ this.ctx.globalAlpha = this.fadeA(); spShip(c, this.px, this.py, 17);  this.ctx.globalAlpha = 1; }''')
rep('''{ this.ctx.globalAlpha = this.fadeA(); c.fillStyle = "#fff"; c.beginPath(); c.moveTo(this.px, this.py - 14); c.lineTo(this.px + 18, this.py + 10); c.lineTo(this.px - 18, this.py + 10); c.closePath(); c.fill();  this.ctx.globalAlpha = 1; }''','''{ this.ctx.globalAlpha = this.fadeA(); spShip(c, this.px, this.py, 17);  this.ctx.globalAlpha = 1; }''')
# vuelo
rep('''if (b.t === "pipe") { fillR(c, b.x, -30, b.w, b.gy - this.gap / 2 + 30, 6, GRN); fillR(c, b.x, b.gy + this.gap / 2, b.w, this.H, 6, GRN); }''','''if (b.t === "pipe") { spPipe(c, b.x, -30, b.w, b.gy - this.gap / 2 + 30, false); spPipe(c, b.x, b.gy + this.gap / 2, b.w, this.H, true); }''')
rep('''          else { c.fillStyle = YEL; c.beginPath(); c.arc(b.x, b.y, b.r, 0, TAU); c.fill(); }
        }
        { this.ctx.globalAlpha = this.fadeA(); c.fillStyle = o.col; c.beginPath(); c.arc(this.bx, this.by, this.r, 0, TAU);''','''          else spCoin(c, b.x, b.y, b.r);
        }
        { this.ctx.globalAlpha = this.fadeA(); c.fillStyle = o.col; c.beginPath(); c.arc(this.bx, this.by, this.r, 0, TAU);''')
# pista: mano que toca
rep('''    var c = this.ctx; c.fillStyle = "rgba(255,255,255,0.9)"; c.beginPath(); c.arc(x, y, 16, 0, TAU); c.fill();
    c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.arc(x, y, 6, 0, TAU); c.fill();''','''    var c = this.ctx, k = (now % 900) / 900, pr = k < 0.3 ? k / 0.3 : 1; c.globalAlpha = 0.92; spHand(c, x + 4, y + 22 - 6 * Math.sin(pr * PI)); c.globalAlpha = 1;''')
open('swipe-arcade.html','w',encoding='utf-8').write(s)
open('chk.js','w').write(s[s.index('<script>')+8:s.rindex('</script>')]); print('ok11')
import re
s=open('swipe-arcade.html',encoding='utf-8').read()
a=s.index('var Ship = G("Ship"'); b=s.index('\n  });', a)
seg=s[a:b]
seg=seg.replace('this.sy = this.H - this.pb + 10;','this.sy = this.H - this.pb - 46;')
seg=seg.replace('c.fillStyle = e.c; c.beginPath(); c.moveTo(e.x, e.y + 17); c.lineTo(e.x + 17, e.y - 8); c.lineTo(e.x + 8, e.y - 15); c.lineTo(e.x - 8, e.y - 15); c.lineTo(e.x - 17, e.y - 8); c.closePath(); c.fill();','spFighter(c, e.x, e.y, 36, e.c);')
seg,n=re.subn(r'\{ this\.ctx\.globalAlpha = this\.fadeA\(\); c\.fillStyle = vgrad\(c, this\.sy - 22.*?this\.ctx\.globalAlpha = 1; \}','{ this.ctx.globalAlpha = this.fadeA(); spShip(c, this.sx, this.sy, 19); this.ctx.globalAlpha = 1; }',seg,flags=re.S)
assert n==1
s=s[:a]+seg+s[b:]
open('swipe-arcade.html','w',encoding='utf-8').write(s)
open('chk.js','w').write(s[s.index('<script>')+8:s.rindex('</script>')]); print('ok12')
