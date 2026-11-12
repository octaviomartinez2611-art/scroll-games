import re
s=open('swipe-arcade.html',encoding='utf-8').read()
ng=open('ng1.js',encoding='utf-8').read()+open('ng2.js',encoding='utf-8').read()
def rep(old,new,cnt=1):
    global s
    assert s.count(old)>=1,old[:70]
    if cnt==1: assert s.count(old)==1,('dup',old[:70])
    s=s.replace(old,new)
# peloteo draws a ball
ng=ng.replace('''c.fillStyle = "#ff4d6d"; c.beginPath(); c.ellipse(x, y, r * 0.88, r, 0, 0, TAU); c.fill();
      c.beginPath(); c.moveTo(x - 6, y + r + 8); c.lineTo(x + 6, y + r + 8); c.lineTo(x, y + r - 2); c.closePath(); c.fill();''','''c.fillStyle = "#ff4d6d"; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();''')
ng=ng.replace('''      c.strokeStyle = "rgba(255,255,255,0.5)"; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y + r + 8); c.lineTo(x - this.vx * 0.05, y + r + 50); c.stroke();\n''','')
ng=ng.replace('/* Globito */','/* Peloteo */')
k=s.index("  /* ================= catalog")
s=s[:k]+ng+"\n"+s[k:]
new=[("snake","Culebrita","Mantené apretado a la izquierda o a la derecha para girar. Comé sin chocar.","#3ddc84","Snake"),
("brick","Ladrillos","Arrastrá el dedo para mover la paleta y rompé los ladrillos.","#ff9f1c","Brick"),
("slice","Frutas","Deslizá el dedo sobre las frutas para cortarlas. Evitá las bombas.","#ff9f1c","Slice"),
("jump","Saltarín","Arrastrá para moverte y subí saltando de plataforma en plataforma.","#3ddc84","Jump"),
("cross","Cruzá","Tocá para avanzar y deslizá a un costado para moverte. Esquivá los autos.","#ffd23f","Cross"),
("cata","Catapulta","Mantené apretado para cargar y soltá para tirar. Acertale al blanco rojo.","#ff4d6d","Cata"),
("four","4 en línea","Tocá una columna para soltar tu ficha. Juntá cuatro seguidas.","#ff4d6d","Four"),
("ttt","Ta-Te-Ti","Tocá un casillero para poner tu cruz. Hacé tres en línea.","#ffffff","Ttt"),
("mines","Buscaminas","Tocá los casilleros para descubrirlos. Los números dicen cuántas minas hay alrededor.","#ffd23f","Mines"),
("rps","Piedra, papel o tijera","Elegí una opción. La piedra le gana a la tijera, la tijera al papel y el papel a la piedra.","#ff4d6d","Rps"),
("lights","Apagá las luces","Tocá un casillero para cambiar ese y los de al lado. Apagalas todas antes de que se acabe el tiempo.","#ffd23f","Lights"),
("bub","Burbujas","Arrastrá para apuntar y soltá para disparar. Juntá tres del mismo color.","#c77dff","Bub"),
("keep","Peloteo","Tocá la pelota para que no se caiga.","#ff4d6d","Keep"),
("inv","Invasores","Arrastrá la nave. Dispara sola. Esquivá los disparos.","#3ddc84","Inv"),
("aster","Asteroides","Mantené apretado a la izquierda o a la derecha para girar la nave. Dispara sola.","#ffffff","Aster"),
("land","Alunizaje","Mantené apretado para encender el motor y arrastrá hacia donde querés ir. Aterrizá despacio en la zona verde.","#ff9f1c","Land"),
("plink","Plinko","Tocá donde querés soltar la bola. Evitá el 0.","#ffd23f","Plink")]
ent=",\n".join('    { id: "%s", name: "%s", how: "%s", accent: "%s", ctor: %s }'%n for n in new)
rep('ctor: Boat }\n  ];','ctor: Boat },\n'+ent+'\n  ];')

# ---------- plain look ----------
s=re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>\n','',s)
SYS='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
rep('--display: "Bricolage Grotesque", system-ui, sans-serif;','--display: %s;'%SYS)
rep('--body: "Figtree", system-ui, sans-serif;','--body: %s;'%SYS)
rep("""var DISPLAY = '"Bricolage Grotesque", system-ui, sans-serif';""","var DISPLAY = '%s';"%SYS.replace('"','\\"') if False else "var DISPLAY = '-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif';")
rep("background: #000 radial-gradient(rgba(255, 255, 255, 0.06) 1.2px, transparent 1.7px) 0 0 / 26px 26px;","background: #000;")
s=re.sub(r'text-shadow: [^;]+;','',s)
s=re.sub(r' filter: drop-shadow\([^;]+\);','',s)
s=re.sub(r'letter-spacing: [^;]+;','',s)
s=s.replace('text-transform: uppercase;','')
s=re.sub(r' animation: rise [^;]+;','',s)
s=re.sub(r'\.rail #rLike\.pulse svg \{[^}]*\}\n','',s)
s=re.sub(r'@keyframes pulse \{[^}]*\{[^}]*\} \}\n','',s)
s=re.sub(r'@keyframes rise \{[^}]*\{[^}]*\} \}\n','',s)
s=s.replace('font: 800','font: 700').replace('(w || 800)','(w || 700)').replace('"800 34px "','"700 34px "')
s=re.sub(r'\.rail span \{[^}]*\}','.rail span { display: none; }',s)
rep('.coin { width: 18px; height: 18px; border-radius: 50%; display: inline-block; flex: none; background: radial-gradient(circle at 35% 30%, #fff1a8, #ffc21a 60%, #d98a0b); box-shadow: inset 0 0 0 2px rgba(120, 70, 0, 0.35); }','.coin { width: 16px; height: 16px; border-radius: 50%; display: inline-block; flex: none; background: #ffc21a; }')
rep('background: linear-gradient(90deg, var(--brand), var(--gold)); transition: width 0.9s cubic-bezier(.2, .8, .2, 1); }','background: var(--brand); }')
rep('background: radial-gradient(circle at 30% 25%, #fff1a8, var(--gold) 55%, #f08a1b); }','background: #8a8a8a; }')
s=re.sub(r'\.tile::before \{[^}]*\}\n','',s)
rep('<span>Minijuego</span>','')
for a,b in [('Jugar','Jugar'),('Amigos','Amigos'),('Perfil','Perfil')]:
    rep('</svg>%s</button>'%a,'</svg></button>')
rep('<button class="tab" data-v="play"','<button class="tab" data-v="play" aria-label="Jugar"')
rep('<button class="tab" data-v="friends"','<button class="tab" data-v="friends" aria-label="Amigos"')
rep('<button class="tab" data-v="profile"','<button class="tab" data-v="profile" aria-label="Perfil"')
rep('"MEJOR "','"Mejor "')

# helpers
rep('''  function glossy(c, x, y, w, h, r, top, bot) {
    c.fillStyle = vgrad(c, y, y + h, top, bot); rr(c, x, y, w, h, r); c.fill();
    c.fillStyle = "rgba(255,255,255,0.22)"; rr(c, x + 2, y + 2, w - 4, Math.max(2, h * 0.36), r * 0.8); c.fill();
  }''','''  function glossy(c, x, y, w, h, r, top, bot) { c.fillStyle = top; rr(c, x, y, w, h, r); c.fill(); }''')
i=s.index("  function ball(c, x, y, r, col) {"); j=s.index("  function txt(",i)
s=s[:i]+'  function ball(c, x, y, r, col) { c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }\n'+s[j:]
rep('Game.prototype.pop = function (x, y, t, col) { if (this.pops.length < 12) this.pops.push({ x: x, y: y, t: 0, txt: t, c: col }); };','Game.prototype.pop = function () {};')
rep('Game.prototype.ring = function (x, y, col) { this.rings.push({ x: x, y: y, t: 0, c: col }); };','Game.prototype.ring = function () {};')
i=s.index("  Game.prototype.burst = function"); j=s.index("  Game.prototype.fxStep",i)
s=s[:i]+'  Game.prototype.burst = function () {};\n'+s[j:]
rep('this.shake = 0.3; this.invuln = 1.2;','this.shake = 0; this.invuln = 1.2;')
i=s.index("  Game.prototype.ghost = function"); j=s.index("  Game.prototype.pdown",i)
s=s[:i]+'''  Game.prototype.ghost = function (x, y, now) {
    if (!this.hint || this.state !== "play" || this.acts >= 3) return;
    var c = this.ctx; c.fillStyle = "rgba(255,255,255,0.9)"; c.beginPath(); c.arc(x, y, 16, 0, TAU); c.fill();
    c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.arc(x, y, 6, 0, TAU); c.fill();
  };
'''+s[j:]
i=s.index("  Game.prototype.ghostHold = function"); j=s.index("  Game.prototype.render",i)
s=s[:i]+'''  Game.prototype.ghostHold = function (x, y, now) {
    if (!this.ctlHint()) return; var c = this.ctx;
    c.fillStyle = "rgba(255,255,255,0.9)"; c.beginPath(); c.arc(x, y, 15, 0, TAU); c.fill();
    c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.arc(x, y, 6, 0, TAU); c.fill();
  };
'''+s[j:]
s=s.replace('.score { font: 700 64px/0.95 var(--display);','.score { font: 600 52px/0.95 var(--display);').replace('.cap b { font: 700 19px/1.1 var(--display);','.cap b { font: 600 16px/1.1 var(--display);')
open('swipe-arcade.html','w',encoding='utf-8').write(s)
js=s[s.index('<script>')+8:s.rindex('</script>')]
open('chk.js','w').write(js); print("ok", s.count('ctor:'))
