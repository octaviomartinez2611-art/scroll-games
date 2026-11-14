const { chromium } = require('playwright');
const B = 'http://localhost:8787';
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ viewport: { width: 390, height: 760 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const api = (path, method, body, tok) => p.evaluate(async ([path, method, body, tok]) => { const r = await fetch('/api/' + path, { method, headers: { 'content-type': 'application/json', ...(tok ? { 'x-token': tok } : {}) }, body: body ? JSON.stringify(body) : undefined }); return r.json(); }, [path, method, body, tok]);
  await p.goto(B); await p.waitForTimeout(800);
  await api('register', 'POST', { name: 'beto', pin: '1234' });
  // entrar como ana desde la pantalla de login
  await p.fill('#lgName', 'ana'); await p.fill('#lgPin', '1234'); await p.click('#lgNew'); await p.waitForTimeout(800);
  const tok = await p.evaluate(() => localStorage.getItem('sa-token'));
  await api('friends', 'POST', { name: 'beto' }, tok);
  await p.evaluate(() => navigator.serviceWorker.ready); await p.reload(); await p.waitForTimeout(1200);
  console.log('1. con internet: cuenta', await p.evaluate(() => localStorage.getItem('sa-me')), '· app guardada en el teléfono:', await p.evaluate(async () => !!(await caches.match('/'))));
  // sin internet
  await ctx.setOffline(true);
  await p.reload(); await p.waitForTimeout(1500);
  const off = await p.evaluate(() => { const c = document.querySelector('.slide canvas'); return { carga: !!c, login: !document.getElementById('login').hidden }; });
  await p.waitForTimeout(1500);
  const draws = await p.evaluate(() => { const c = [...document.querySelectorAll('canvas')].find(x => x.width > 100); if (!c) return 0; const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 400) if (d[i] + d[i + 1] + d[i + 2] > 60) n++; return n; });
  await p.mouse.click(195, 450); await p.mouse.click(120, 450); await p.waitForTimeout(800);
  await p.evaluate(() => { const P = JSON.parse(localStorage.getItem('swipe-arcade-v3')); }); 
  // jugar sin internet: anotar algo en el estado (como si hubiera jugado)
  await p.evaluate(() => { window.__mark = Date.now(); });
  console.log('2. sin internet: abre', off.carga, '· pide entrar', off.login, '· el juego dibuja', draws > 50, '· errores', errs.length);
  // mandar un mensaje sin internet
  await p.click('.tab[data-v="friends"]'); await p.waitForTimeout(400);
  const amigos = await p.evaluate(() => document.querySelectorAll('.frow').length);
  await p.click('.frow'); await p.waitForTimeout(300);
  await p.fill('#chatIn', 'hola sin internet'); await p.press('#chatIn', 'Enter'); await p.waitForTimeout(500);
  const pend = await p.evaluate(() => ({ burbuja: !!document.querySelector('.bub.pend'), nota: (document.querySelector('.pendnote') || {}).textContent, out: JSON.parse(localStorage.getItem('sa-out') || '[]').length }));
  console.log('3. amigos guardados', amigos, '· mensaje esperando', JSON.stringify(pend));
  const best0 = await p.evaluate(() => { const P = JSON.parse(localStorage.getItem('swipe-arcade-v3')); return P.ts; });
  // vuelve internet
  await ctx.setOffline(false); await p.evaluate(() => window.dispatchEvent(new Event('online'))); await p.waitForTimeout(2500);
  const msgs = await api('msgs?with=ana&after=', 'GET', null, (await api('login', 'POST', { name: 'beto', pin: '1234' })).token);
  const after = await p.evaluate(() => ({ out: JSON.parse(localStorage.getItem('sa-out') || '[]').length, pend: !!document.querySelector('.bub.pend') }));
  console.log('4. volvió internet: pendientes', after.out, '· burbuja gris', after.pend, '· a beto le llegó:', JSON.stringify((msgs.msgs || []).map(m => m.text)));
  console.log('errores', errs);
  await br.close();
})();
