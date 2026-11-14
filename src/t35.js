// feed real: deslizar, jugar un rato en algunos, pasar rápido otros; ver que se recalcula y no hay errores
const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 390, height: 760 } }); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + process.cwd() + '/test2.html'); await p.waitForTimeout(700);
  const seen = [];
  for (let k = 0; k < 14; k++) {
    const before = await p.evaluate(() => __T.slides.map(s => s.cfg.id).join(','));
    await p.evaluate(() => { const f = __T.feed; f.scrollTop = Math.round(f.scrollTop / f.clientHeight + 1) * f.clientHeight; });
    await p.waitForTimeout(k % 3 === 0 ? 2500 : 600);
    const st = await p.evaluate(() => { const g = __T.g(); return { id: g && g.cfg.id, n: __T.slides.length, idx: Math.round(__T.feed.scrollTop / __T.feed.clientHeight) }; });
    seen.push(st.id);
    if (k === 5) console.log('antes', before.split(',').slice(-4).join(' '), '\ndespues', (await p.evaluate(() => __T.slides.map(s => s.cfg.id).join(','))).split(',').slice(-4).join(' '));
  }
  const st = await p.evaluate(() => { const o = {}; for (const id in __T.P.st) { const s = __T.P.st[id]; if (s.n) o[id] = { n: s.n, k: Math.round(s.k), t: Math.round(s.t) }; } return o; });
  console.log('vistos', seen.join(' ')); console.log(JSON.stringify(st).slice(0, 400)); console.log('errores', errs.slice(0, 3));
  await br.close();
})();
