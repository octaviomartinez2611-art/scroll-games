// Arma netlify/lib/catalog.mjs (id → nombre de cada juego) para que el servidor pueda nombrar juegos en los avisos.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => {
  const br = await chromium.launch(); const p = await br.newPage();
  await p.goto('file://' + path.join(__dirname, 'swipe-arcade.html')); await p.waitForTimeout(600);
  const cat = await p.evaluate(() => window.TOKI_CAT());
  const o = {}; cat.forEach(([id, n]) => { o[id] = n; });
  fs.writeFileSync(path.join(__dirname, '../netlify/lib/catalog.mjs'), '// Generado por src/mkcat.cjs: no editar a mano.\nexport default ' + JSON.stringify(o) + ';\n');
  console.log('catálogo:', cat.length, 'juegos'); await br.close();
})().catch((e) => { console.log('mkcat: no se pudo armar el catálogo', String(e).slice(0, 120)); });
