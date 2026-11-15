const { chromium } = require('playwright');
(async () => {
  const ids = process.argv[2].split(','); const dur = +(process.argv[3] || 5000);
  const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 390, height: 760 } }); const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 300)));
  await p.goto('file://' + process.cwd() + '/test2.html'); await p.waitForTimeout(500);
  const out = [];
  for (const id of ids) {
    const e0 = errs.length;
    await p.evaluate(id => __T.goTo(id), id); await p.waitForTimeout(500);
    if (!(await p.evaluate(() => !!__T.g()))) await p.waitForTimeout(800);
    if (!(await p.evaluate(() => !!__T.g()))) { out.push({ id, st: 'nogame', err: errs.slice(e0) }); continue; }
    const ctl = await p.evaluate(() => __T.g().ctl || 'tap');
    const t0 = Date.now(); let shot = false;
    while (Date.now() - t0 < dur) {
      if (!shot && Date.now() - t0 > 2200) { await p.screenshot({ path: `nk_${id}.png` }); shot = true; }
      const x = 40 + Math.random() * 270, y = 200 + Math.random() * 450;
      if (ctl === 'hold') { await p.mouse.move(x, y); await p.mouse.down(); await p.waitForTimeout(150 + Math.random() * 600); await p.mouse.up(); await p.waitForTimeout(80 + Math.random() * 300); }
      else if (ctl === 'drag') { await p.mouse.move(195, 560); await p.mouse.down(); for (let k = 0; k < 5; k++) { await p.mouse.move(40 + Math.random() * 310, 560, { steps: 4 }); await p.waitForTimeout(70); } await p.mouse.up(); }
      else if (ctl === 'swipe' && Math.random() < 0.4) { const sx = 195; await p.mouse.move(sx, 500); await p.mouse.down(); await p.mouse.move(sx + (Math.random() < 0.5 ? -90 : 90), 505, { steps: 5 }); await p.mouse.up(); await p.waitForTimeout(200); }
      else { await p.mouse.click(x, y); await p.waitForTimeout(120 + Math.random() * 300); }
    }
    const st = await p.evaluate(() => { const g = __T.g(); return { s: g.score, l: g.lives, st: g.state, a: g.acts, t: Math.round(g.t) }; });
    out.push({ id, ctl, ...st, err: errs.slice(e0) });
  }
  for (const o of out) console.log(JSON.stringify(o));
  await br.close();
})();
