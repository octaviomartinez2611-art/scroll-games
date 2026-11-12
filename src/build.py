import re
base=open('swipe-arcade.bak.html',encoding='utf-8').read()
pat=open('pat.html',encoding='utf-8').read()
def block(s,start):
    i=s.index(start); j=s.index("\n  /* ",i+5)
    return i,j
def get(s,start):
    i,j=block(s,start); return s[i:j]
def getto(s,start,end):
    i=s.index(start); j=s.index(end,i); return s[i:j]
def swap(s,start,new):
    i,j=block(s,start); return s[:i]+new+s[j:]
def rep(s,old,new):
    assert s.count(old)==1,old[:70]; return s.replace(old,new)
s=base
# base proto additions + reset/tick
s=rep(s,"this.combo = 0; this.acts = 0; this.hint = false; this.newBest = false; this.drawn = false;",
        "this.combo = 0; this.acts = 0; this.hint = false; this.newBest = false; this.drawn = false; this.holding = false; this.ctlT = 0;")
s=rep(s,"this.t += dt; this.invuln = Math.max(0, this.invuln - dt); this.shake = Math.max(0, this.shake - dt);",
        "this.t += dt; this.invuln = Math.max(0, this.invuln - dt); this.shake = Math.max(0, this.shake - dt); if (this.holding) this.ctlT += dt;")
addon=getto(pat,"  Game.prototype.pdown","  Game.prototype.render = function (now) {")
s=rep(s,"  Game.prototype.render = function (now) {",addon+"  Game.prototype.render = function (now) {")
# Esquivá + Basket (movement versions)
s=swap(s,"  /* Esquivá */",get(pat,"  /* Esquivá (arrastrar) */"))
s=swap(s,"  /* Basket */",get(pat,"  /* Basket (arrastrar y soltar) */"))
# new games
def ren(txt,old,new): return txt.replace('var %s = G("%s"'%(old,old),'var %s = G("%s"'%(new,new))
new=""
new+=get(pat,"  /* Seguime (arrastrar) */")+"\n"
new+=ren(get(pat,"  /* Cohete (mantener apretado) */"),"Hop","Rocket")+"\n"
new+=ren(get(pat,"  /* Gravedad (mantener apretado) */"),"Grav","Ceil")+"\n"
new+=ren(get(pat,"  /* Aguantá (mantener apretado) */"),"Hold","Balloon")+"\n"
i=pat.index("  /* Anzuelo (arrastrar + mantener) */"); j=pat.index("  /* ================= catalog",i)
new+=ren(pat[i:j],"Fish","Boat")+"\n"
mark="  /* ================= catalog"
k=s.index(mark); s=s[:k]+new+s[k:]
# catalog
s=rep(s,'how: "Tocá el lado izquierdo o derecho para cambiar de carril.", accent: "#ff6a3d"','how: "Arrastrá el dedo a izquierda y derecha para pasar por los huecos.", accent: "#ff6a3d"')
s=rep(s,'how: "Tocá para tirar. Apuntá un poco adelantado, el aro se mueve.", accent: "#ff8a1f"','how: "Arrastrá para elegir dónde tirar y soltá para lanzar. El aro se mueve, apuntá adelantado.", accent: "#ff8a1f"')
s=rep(s,'accent: "#ffd23f", ctor: Fish }\n  ];','''accent: "#ffd23f", ctor: Fish },
    { id: "follow", name: "Seguime", how: "Arrastrá el dedo para mantener la bolita dentro de la zona amarilla.", accent: "#ffd23f", ctor: Follow },
    { id: "rocket", name: "Cohete", how: "Mantené apretado para subir y soltá para bajar. Pasá por los huecos.", accent: "#b9f36b", ctor: Rocket },
    { id: "ceil", name: "Techo", how: "Mantené apretado para ir al techo y soltá para volver al piso. Pasá entre los pinchos.", accent: "#ffb43a", ctor: Ceil },
    { id: "balloon", name: "Globo", how: "Mantené apretado para inflar y soltá para desinflar. Quedate entre los dos aros.", accent: "#ff4d6d", ctor: Balloon },
    { id: "boat", name: "Pescador", how: "Arrastrá para mover el bote. Mantené apretado para bajar el anzuelo y soltá para subir. Evitá los erizos.", accent: "#4dd2ff", ctor: Boat }
  ];''')
# input block
i=pat.index("  /* ---------- input: tap, drag, hold and swipe ---------- */"); j=pat.index('  window.addEventListener("keydown"')
inp=pat[i:j]
i2=s.index("  /* ---------- input ---------- */"); j2=s.index('  window.addEventListener("keydown"')
s=s[:i2]+inp+s[j2:]
s=rep(s,'''    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); g = activeGame(); if (g) g.tap(g.W / 2, g.H / 2); }''',
'''    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); g = activeGame(); if (!g) return; if (g.ctl === "hold" && g.state === "play") { if (!g.holding) g.pdown(g.W / 2, g.H / 2); } else g.tap(g.W / 2, g.H / 2); }''')
s=rep(s,'  window.addEventListener("resize", function () {','  window.addEventListener("keyup", function (e) { if (e.key === " ") { var g = activeGame(); if (g && g.ctl === "hold") g.pup(0, 0, false); } });\n  window.addEventListener("resize", function () {')

# --- no strip, no toasts, quick restart ---
s=rep(s,'this.restartAt = this.overAt + 2800;','this.restartAt = this.overAt + 1100;')
s=rep(s,'  function toast(m) { var t = $("toast");','  function toast(m) { return; var t = $("toast");')
s=rep(s,'    if (show) $("sAuto").style.transform = "scaleX(" + clamp((ag.restartAt - now) / 2800, 0, 1) + ")";\n    if (show !== !strip.hidden) strip.hidden = !show;\n','')
s=rep(s,'    var r = g.result, pct = function (x) { return Math.round(x.rem / x.need * 100) + "%"; };','    coinsUI(); return;\n    var r = g.result, pct = function (x) { return Math.round(x.rem / x.need * 100) + "%"; };')
# chat game card stripe
s=rep(s,' border-left: 5px solid var(--a, #fff); }',' }')
# profile photo
s=rep(s,'<div class="avatar" id="avatar">J</div>','<label class="avwrap"><div class="avatar" id="avatar">J</div><input type="file" id="photoIn" accept="image/*" hidden><span class="avedit">Cambiar foto</span></label>')
s=rep(s,'.pf .avatar {','.avwrap { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; }\n.avedit { font: 700 12px/1 var(--body); color: var(--dim); letter-spacing: 0.04em; }\n.pf .avatar { background-size: cover !important; background-position: center !important; overflow: hidden;')
s=rep(s,'$("nameIn").value = P.name; $("avatar").textContent = (P.name.trim()[0] || "J").toUpperCase();','$("nameIn").value = P.name; paintAv();')
s=rep(s,'$("avatar").textContent = (P.name.trim()[0] || "J").toUpperCase(); save(); });','paintAv(); save(); });')
s=rep(s,'  /* profile */\n','''  /* profile */
  function paintAv() {
    var a = $("avatar");
    if (P.photo) { a.style.backgroundImage = "url(" + P.photo + ")"; a.textContent = ""; }
    else { a.style.backgroundImage = ""; a.textContent = (P.name.trim()[0] || "J").toUpperCase(); }
  }
  $("photoIn").addEventListener("change", function () {
    var f = this.files && this.files[0]; if (!f) return; var self = this, rd = new FileReader();
    rd.onload = function () {
      var im = new Image();
      im.onload = function () {
        var c = document.createElement("canvas"), n = 192, m = Math.min(im.width, im.height); c.width = c.height = n;
        c.getContext("2d").drawImage(im, (im.width - m) / 2, (im.height - m) / 2, m, m, 0, 0, n, n);
        try { P.photo = c.toDataURL("image/jpeg", 0.82); save(); } catch (e) {}
        paintAv(); self.value = "";
      };
      im.src = rd.result;
    };
    rd.readAsDataURL(f);
  });
''')
open('swipe-arcade.html','w',encoding='utf-8').write(s)
js=s[s.index('<script>')+8:s.rindex('</script>')]
open('chk.js','w').write(js)
print("ok")
