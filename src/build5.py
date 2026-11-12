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
