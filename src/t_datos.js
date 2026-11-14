const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ viewport: { width: 390, height: 760 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const reqs = []; p.on('request', r => { if (r.url().includes('/api/state')) reqs.push({ enc: r.headers()['content-encoding'] || 'nada', bytes: (r.postDataBuffer() || Buffer.alloc(0)).length }); });
  const st304 = []; p.on('request', r => { if (r.url().includes('/api/friends')) st304.push(r.headers()['if-none-match'] ? 'revalida' : 'nuevo'); });
  await p.goto('http://localhost:8787'); await p.waitForTimeout(800);
  await p.fill('#lgName', 'dani'); await p.fill('#lgPin', '1234'); await p.click('#lgNew'); await p.waitForTimeout(1200);
  await p.click('#rLike'); await p.waitForTimeout(300);
  await p.evaluate(() => window.dispatchEvent(new Event('online'))); await p.waitForTimeout(1500);
  const tok = await p.evaluate(() => localStorage.getItem('sa-token'));
  const me = await p.evaluate(async (t) => (await fetch('/api/me', { headers: { 'x-token': t } })).json(), tok);
  await p.evaluate(async (t) => { await fetch('/api/friends', { headers: { 'x-token': t } }); await fetch('/api/friends', { headers: { 'x-token': t } }); }, tok);
  console.log('estado subido:', JSON.stringify(reqs), '· likes en el servidor:', Object.keys((me.state && me.state.likes) || {}).length, '· friends:', st304.join(','), '· errores', errs);
  await br.close();
})();
