import re
s=open('swipe-arcade.html',encoding='utf-8').read()
fam=''.join(open(f,encoding='utf-8').read() for f in ['f1.js','f2.js','f3.js','f4.js','f5.js','f6.js','f7.js','f8.js'])
k=s.index("  /* ================= catalog"); s=s[:k]+fam+"\n"+s[k:]
def rep(old,new):
    global s
    assert s.count(old)==1,(s.count(old),old[:70]); s=s.replace(old,new)
rep("  var byId = {}; CATALOG.forEach(function (g) { byId[g.id] = g; });",
"""  CATALOG = CATALOG.concat(EXTRA);
  (function () { var sd = 20260; function rn() { sd = (sd * 1103515245 + 12345) & 0x7fffffff; return sd / 0x7fffffff; } for (var q = CATALOG.length - 1; q > 0; q--) { var w = Math.floor(rn() * (q + 1)), tt = CATALOG[q]; CATALOG[q] = CATALOG[w]; CATALOG[w] = tt; } })();
  var byId = {}; CATALOG.forEach(function (g) { byId[g.id] = g; });""")
rep("N = NG * 4;","N = NG * 2;")
for a,b in [('name: "Plinko"','name: "Bolitas"'),('name: "Simón"','name: "Secuencia"'),('name: "Buscaminas"','name: "Minas"'),('name: "4 en línea"','name: "Cuatro seguidas"'),('name: "Dino"','name: "Corredor"'),('name: "Asteroides"','name: "Meteoritos"')]:
    rep(a,b)
open('swipe-arcade.html','w',encoding='utf-8').write(s)
open('chk.js','w').write(s[s.index('<script>')+8:s.rindex('</script>')]); print('ok')
