const { chromium } = require('playwright');
const src = require('fs').readFileSync('/home/claude/scroll-games/netlify/functions/api.mjs', 'utf8');
const a = src.indexOf('function engOf'), b = src.indexOf('async function isFriend');
const computeTrends = new Function(src.slice(a, b).replace('export function computeTrends', 'function computeTrends') + '; return computeTrends;')();
(async () => {
const CL = [{ kn: 1, sj: 1, ln: 1, dk: 1 }, { ah: 1, gk: 1, tw: 1, bg: 1 }, { c: 1, d: 1, r: 1, f: 1 }];
const fam = (id) => { const u = id.indexOf('_'); return u > 0 ? id.slice(0, u) : '1:' + id; };
const br = await chromium.launch(); const p = await br.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.goto('file://' + process.cwd() + '/test2.html'); await p.waitForTimeout(600);
const ids = await p.evaluate(() => __T.cat.map(c => c.id));
const states = [];
for (let u = 0; u < 30; u++) { const love = CL[u % 3], st = {}, likes = {}; for (let k = 0; k < 70; k++) { const id = ids[Math.floor(Math.random() * ids.length)]; const s = st[id] || (st[id] = { t: 0, l: 0, h: 0, r: 0, k: 0, n: 0 }); s.n++; if (love[fam(id)] && Math.random() > 0.1) { s.t += 40; s.r += 2; if (Math.random() < 0.2) likes[id] = 1; } else s.k++; } states.push({ st, likes, saved: {} }); }
const TR = computeTrends(states);
const run = (useTR) => p.evaluate(({ TR, useTR }) => {
  const T = __T, LOVE = { kn: 1, sj: 1, ln: 1, dk: 1 }; T.setTR(useTR ? TR : { pop: {}, nb: {} });
  T.P.st = {}; T.P.likes = {}; T.P.saved = {}; T.slides.length = 0;
  const picks = []; for (let k = 0; k < 80; k++) { const g = T.pick(); T.slides.push({ cfg: g }); picks.push(g.id); const s = T.P.st[g.id] || (T.P.st[g.id] = { t: 0, l: 0, h: 0, r: 0, k: 0, n: 0 }); s.n++; if (LOVE[T.fam(g.id)]) { s.t += 40; s.r += 2; } else s.k++; }
  const f = (a, b) => picks.slice(a, b).filter(id => LOVE[T.fam(id)]).length / (b - a);
  return [f(0, 10), f(10, 20), f(20, 40), f(40, 60), f(60, 80)];
}, { TR, useTR });
const avg = (rs) => rs[0].map((_, i) => Math.round(100 * rs.reduce((a, r) => a + r[i], 0) / rs.length) + '%');
const a = [], b = []; for (let k = 0; k < 6; k++) { a.push(await run(true)); b.push(await run(false)); }
console.log('vecinos aprendidos:', Object.keys(TR.nb).length, 'juegos');
console.log('juegos 1-10, 11-20, 21-40, 41-60, 61-80');
console.log('con lo que aprendió de todos:', avg(a).join(' '));
console.log('solo con tus datos:          ', avg(b).join(' '));
console.log('al azar:                     ', Math.round(100 * 40 / ids.length) + '%');
console.log(errs.slice(0, 3)); await br.close();
})();
