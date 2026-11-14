const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ viewport: { width: 390, height: 760 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + process.cwd() + '/test2.html'); await p.waitForTimeout(600);
  // jugador con favoritos claros (Carriles, Rueda de flechas, Paredes) y un día de uso
  await p.evaluate(() => { const T = __T, P = T.P; P.st = {}; P.dailyDay = new Date().toISOString().slice(0, 10); T.cat.forEach(g => { const f = T.fam(g.id); if (f === 'ln' || f === 'kn' || f === 'wj') P.st[g.id] = { t: 300, l: 8, h: 20, r: 6, k: 0, n: 5, ls: Date.now() - 2 * 864e5 }; }); P.hist = []; localStorage.setItem(Object.keys(localStorage).find(k => k.startsWith('swipe-arcade')) || 'swipe-arcade-v3', JSON.stringify(P)); });
  const key = await p.evaluate(() => Object.keys(localStorage).find(k => k.startsWith('swipe-arcade')));
  const sessions = [];
  for (let s = 0; s < 5; s++) {
    await p.reload(); await p.waitForTimeout(900);
    const ids = [];
    for (let k = 0; k < 5; k++) { ids.push(await p.evaluate(() => __T.slides[Math.round(__T.feed.scrollTop / __T.feed.clientHeight)].cfg.id)); await p.evaluate(() => { const f = __T.feed; f.scrollTop = (Math.round(f.scrollTop / f.clientHeight) + 1) * f.clientHeight; }); await p.waitForTimeout(700); }
    sessions.push(ids);
  }
  const names = await p.evaluate(() => Object.fromEntries(__T.cat.map(c => [c.id, c.name])));
  sessions.forEach((s, i) => console.log('entrada ' + (i + 1) + ':', s.map(id => names[id]).join(' · ')));
  const first = sessions.map(s => s[0]); const all = sessions.flat();
  console.log('primer juego distinto en cada entrada:', new Set(first).size, 'de', first.length, '· juegos repetidos entre entradas:', all.length - new Set(all).size, '· key', key, '· errores', errs.slice(0, 2));
  await br.close();
})();
