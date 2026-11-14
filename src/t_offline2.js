const { chromium } = require('playwright');
const B = 'http://localhost:8787';
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext(); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto(B); await p.waitForTimeout(800);
  await p.fill('#lgName', 'caro'); await p.fill('#lgPin', '1234'); await p.click('#lgNew'); await p.waitForTimeout(1500);
  await p.evaluate(() => navigator.serviceWorker.ready); await p.waitForTimeout(21000); // deja que suba el estado
  await ctx.setOffline(true);
  // "jugó" sin internet: récord nuevo guardado en el teléfono
  await p.evaluate(() => { const P = JSON.parse(localStorage.getItem('swipe-arcade-v3')); P.best = P.best || {}; P.best.kn_log = 99; P.ts = Date.now() + 1000; localStorage.setItem('swipe-arcade-v3', JSON.stringify(P)); });
  await p.reload(); await p.waitForTimeout(1500);
  await ctx.setOffline(false); await p.evaluate(() => window.dispatchEvent(new Event('online'))); await p.waitForTimeout(3000);
  const tok = await p.evaluate(() => localStorage.getItem('sa-token'));
  const me = await p.evaluate(async (t) => (await fetch('/api/me', { headers: { 'x-token': t } })).json(), tok);
  const local = await p.evaluate(() => JSON.parse(localStorage.getItem('swipe-arcade-v3')).best.kn_log);
  console.log('récord hecho sin internet → en el teléfono:', local, '· en el servidor:', me.state && me.state.best && me.state.best.kn_log, '· errores', errs);
  await br.close();
})();
