import re
s=open('swipe-arcade.html',encoding='utf-8').read()
def rep(old,new):
    global s
    assert s.count(old)==1,(s.count(old),old[:80]); s=s.replace(old,new)
rep('name: "Meteoritos", how: "Mantené apretado a la izquierda','name: "Rocas espaciales", how: "Mantené apretado a la izquierda')

# --- stats storage ---
rep('  function save() { try {','  if (!P.st) P.st = {};\n  function stOf(id) { return P.st[id] || (P.st[id] = { t: 0, l: 0, h: 0, r: 0, k: 0 }); }\n  function save() { try {')
rep("    this.lives--; this.combo = 0;","    this.lives--; stOf(this.cfg.id).h++; this.combo = 0;")
rep("    var id = this.cfg.id, xp = this.score;","    var id = this.cfg.id, xp = this.score; stOf(id).l++;")

# --- no blinking: fade instead ---
rep("  Game.prototype.blink = function () { return this.invuln > 0 && Math.floor(this.invuln * 14) % 2 === 0; };",
    "  Game.prototype.blink = function () { return false; };\n  Game.prototype.fadeA = function () { return this.invuln > 0 ? 0.4 : 1; };")
out=[]; i=0; key="if (!this.blink())"; n=0
while True:
    j=s.find(key,i)
    if j<0: out.append(s[i:]); break
    out.append(s[i:j]); k=j+len(key)
    while s[k]==' ': k+=1
    if s[k]=='{':
        d=0; m=k
        while True:
            if s[m]=='{': d+=1
            elif s[m]=='}':
                d-=1
                if d==0: break
            m+=1
        body=s[k+1:m]; end=m+1
    else:
        d=0; m=k
        while True:
            ch=s[m]
            if ch in '([': d+=1
            elif ch in ')]': d-=1
            elif ch==';' and d==0: break
            m+=1
        body=s[k:m+1]; end=m+1
    out.append("{ this.ctx.globalAlpha = this.fadeA();"+body+" this.ctx.globalAlpha = 1; }"); n+=1; i=end
s=''.join(out); print('fades',n)

# --- caption sits on black: games never draw under it ---
rep("    c.clearRect(0, 0, this.W, this.H); c.save();","    c.clearRect(0, 0, this.W, this.H); c.save(); c.beginPath(); c.rect(0, 0, this.W, this.H - 46); c.clip();")

# --- feed algorithm ---
i=s.index("  var NG = CATALOG.length, N = NG * 2;"); j=s.index("  function activeIdx()")
s=s[:i]+r'''  var NG = CATALOG.length, N = 0;
  var HEART = '<svg viewBox="0 0 24 24"><path d="M12 21C12 21 3 15.5 3 9.2C3 6.3 5.2 4.5 7.6 4.5C9.5 4.5 11.1 5.6 12 7.2C12.9 5.6 14.5 4.5 16.4 4.5C18.8 4.5 21 6.3 21 9.2C21 15.5 12 21 12 21Z"/></svg>';
  var feed = $("feed"), slides = [], cache = {};
  /* Algoritmo del feed.
     Cada juego tiene un peso; el próximo juego se sortea según esos pesos.
     - Sin probar: peso alto, para que vayas descubriendo juegos.
     - Tiempo jugado y veces que perdiste y seguiste jugando: suben el peso (te engancha).
     - Si casi nunca perdés (pasás mucho tiempo por vida perdida), baja: te resulta fácil.
     - Si lo pasás de largo enseguida sin jugar, baja.
     - Me gusta lo multiplica por 3 y guardado por 4.
     Los últimos 10 juegos mostrados no se repiten. Lo aprendido se guarda en este dispositivo (P.st). */
  function weight(g) {
    var st = P.st[g.id], w;
    if (!st || st.t < 3) w = 1.6;
    else {
      w = 0.5 + 0.35 * Math.log(1 + st.t / 20) + 0.6 * Math.log(1 + st.r);
      if (st.t / (st.h + 1) > 45) w *= 0.5;
      w *= Math.pow(0.7, Math.min(6, st.k));
    }
    if (P.likes[g.id]) w *= 3;
    if (P.saved[g.id]) w *= 4;
    return w;
  }
  function pickNext() {
    var recent = {}, k, tot = 0;
    for (k = Math.max(0, slides.length - 10); k < slides.length; k++) recent[slides[k].cfg.id] = 1;
    var ws = CATALOG.map(function (g) { var w = recent[g.id] ? 0 : weight(g); tot += w; return w; });
    var r = Math.random() * tot;
    for (k = 0; k < ws.length; k++) { r -= ws[k]; if (r <= 0) return CATALOG[k]; }
    return CATALOG[ri(0, NG)];
  }
  function addSlide(cfg) {
    var i = slides.length, s = document.createElement("section");
    s.className = "slide"; s.dataset.i = i;
    s.innerHTML = '<div class="hud"><span class="hearts">' + HEART + HEART + HEART + '</span><div class="c"><span class="score">0</span><span class="best">Mejor 0</span></div><div></div></div><div class="cap"><b></b></div>';
    s.querySelector(".cap b").textContent = cfg.name;
    s.cfg = cfg; feed.appendChild(s); slides.push(s); N = slides.length;
  }
  function fillFeed(a) { while (slides.length < a + 4) addSlide(pickNext()); }
  function trimAfter(a) { while (slides.length > a + 1) { var sl = slides.pop(); drop(slides.length); sl.remove(); } N = slides.length; }
  fillFeed(0);
  function ensure(i) {
    if (i < 0 || i >= N) return null;
    if (!cache[i]) { var sl = slides[i], cv = document.createElement("canvas"); sl.insertBefore(cv, sl.firstChild); cache[i] = new sl.cfg.ctor(sl, sl.cfg); }
    return cache[i];
  }
  function drop(i) { var g = cache[i]; if (!g) return; g.cv.remove(); delete cache[i]; }
'''+s[j:]
rep("  function goTo(id) { setView(\"play\"); feed.scrollTop = firstIndex(id) * feed.clientHeight; }",
    "  function goTo(id) { setView(\"play\"); var a = activeIdx(); trimAfter(a); addSlide(byId[id]); fillFeed(a + 1); feed.scrollTop = (a + 1) * feed.clientHeight; }")

# --- frame: stats, skips, retries, rail ---
rep("    if (act !== lastAct) { lastAct = act; syncRail(); }",
"""    if (act !== lastAct) {
      if (lastAct >= 0 && slides[lastAct]) { var pst = stOf(slides[lastAct].cfg.id), pg = cache[lastAct]; if (viewT < 3 && (!pg || pg.acts === 0)) pst.k++; else if (viewT > 10 && pst.k > 0) pst.k--; }
      lastAct = act; viewT = 0; fillFeed(act); syncRail(); railEl.classList.remove("busy"); save();
    }
    viewT += dt;""")
rep("        if (g.state === \"over\" && now > g.restartAt) { g.reset(); g.begin(); }",
    "        if (g.state === \"over\" && now > g.restartAt) { stOf(g.cfg.id).r++; g.reset(); g.begin(); }\n        if (g.state === \"play\") { stOf(g.cfg.id).t += dt; saveT += dt; if (saveT > 5) { saveT = 0; save(); } }")
rep("  var last = performance.now();","  var last = performance.now(), viewT = 0, saveT = 0;")

# rail hides while you play, comes back when you stop touching
rep("/* ---------- input: tap, drag, hold and swipe ---------- */","""/* ---------- rail: se esconde mientras jugás ---------- */
  var railEl = $("rail"), railT = 0;
  feed.addEventListener("pointerdown", function () { if (view !== "play") return; railEl.classList.add("busy"); clearTimeout(railT); });
  function railLater() { if (!railEl.classList.contains("busy")) return; clearTimeout(railT); railT = setTimeout(function () { railEl.classList.remove("busy"); }, 1000); }
  window.addEventListener("pointerup", railLater); window.addEventListener("pointercancel", railLater);
  /* ---------- input: tap, drag, hold and swipe ---------- */""")
s=s.replace(".rail {\n  position: absolute;",".rail {\n  transition: opacity 0.25s;\n  position: absolute;",1)
rep("/* ---- sheets ---- */",".rail.busy { opacity: 0; pointer-events: none; }\n/* ---- sheets ---- */")
open('swipe-arcade.html','w',encoding='utf-8').write(s)
open('chk.js','w').write(s[s.index('<script>')+8:s.rindex('</script>')]); print('ok')
