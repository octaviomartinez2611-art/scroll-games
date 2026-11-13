const { chromium } = require('playwright');
const PRE = ['ln_','kn_','ri_','tw_','sm_','zz_','sj_','hk_','dk_','br_','pt_','ah_','gk_','sh_','wj_','bg_','fh_','tr_','tu_','rp_'];
(async () => {
  const [a, b] = process.argv.slice(2).map(Number);
  const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 390, height: 760 } }); const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto('file://' + process.cwd() + '/test2.html'); await p.waitForTimeout(500);
  const ids = (await p.evaluate(() => __T.cat.map(c => c.id))).filter(i => PRE.includes(i.slice(0, 3))).sort().slice(a, b);
  const out = [];
  for (const id of ids) {
    const e0 = errs.length;
    await p.evaluate(id => __T.goTo(id), id); await p.waitForTimeout(400); if (!(await p.evaluate(() => !!__T.g()))) { await p.waitForTimeout(800); } if (!(await p.evaluate(() => !!__T.g()))) { out.push({ id, ctl: '?', s: -1, l: -1, st: 'nogame', a: 0, err: errs.slice(e0) }); continue; }
    const ctl = await p.evaluate(() => __T.g().ctl || 'tap');
    const t0 = Date.now(); let shot = false;
    while (Date.now() - t0 < 6000) {
      if (!shot && Date.now() - t0 > 2500) { await p.screenshot({ path: `nn_${id}.png` }); shot = true; }
      const x = 60 + Math.random() * 270;
      if (ctl === 'hold') { await p.mouse.move(195, 420); await p.mouse.down(); await p.waitForTimeout(200 + Math.random() * 500); await p.mouse.up(); await p.waitForTimeout(100 + Math.random() * 300); }
      else if (ctl === 'drag') { await p.mouse.move(195, 560); await p.mouse.down(); for (let k = 0; k < 6; k++) { await p.mouse.move(60 + Math.random() * 270, 560, { steps: 4 }); await p.waitForTimeout(80); } await p.mouse.up(); }
      else { await p.mouse.click(x, 450); await p.waitForTimeout(150 + Math.random() * 350); }
    }
    const st = await p.evaluate(() => { const g = __T.g(); return { s: g.score, l: g.lives, st: g.state, a: g.acts }; });
    out.push({ id, ctl, ...st, err: errs.slice(e0) });
  }
  console.log(JSON.stringify(out));
  await br.close();
})();
