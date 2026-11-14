const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 390, height: 760 } }); const errs=[]; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + process.cwd() + '/test2.html'); await p.waitForTimeout(600);
  const r = await p.evaluate(() => {
    const T = __T, LOVE = { kn: 1, sj: 1, ln: 1 };
    function play(id, st) { const s = st[id] || (st[id] = { t: 0, l: 0, h: 0, r: 0, k: 0, n: 0 }); s.n++; if (LOVE[T.fam(id)]) { s.t += 40; s.r += 2; s.l += 3; s.h += 9; } else { s.k++; } }
    // algoritmo nuevo
    T.P.st = {}; T.P.likes = {}; T.P.saved = {};
    const newPicks = []; for (let k = 0; k < 80; k++) { const g = T.pick(); T.add(g); newPicks.push(g.id); play(g.id, T.P.st); }
    // algoritmo viejo (copiado) con el mismo jugador
    const st = {}, oldPicks = [];
    function wOld(g) { const s = st[g.id]; let w; if (!s || s.t < 3) w = 1.6; else { w = 0.5 + 0.35 * Math.log(1 + s.t / 20) + 0.6 * Math.log(1 + s.r); if (s.t / (s.h + 1) > 45) w *= 0.5; w *= Math.pow(0.7, Math.min(6, s.k)); } return w; }
    for (let k = 0; k < 80; k++) { const rec = new Set(oldPicks.slice(-10)); let tot = 0; const ws = T.cat.map(g => { const w = rec.has(g.id) ? 0 : wOld(g); tot += w; return w; }); let x = Math.random() * tot, pick = T.cat[0]; for (let i = 0; i < ws.length; i++) { x -= ws[i]; if (x <= 0) { pick = T.cat[i]; break; } } oldPicks.push(pick.id); play(pick.id, st); }
    const frac = (a, i0, i1) => a.slice(i0, i1).filter(id => LOVE[T.fam(id)]).length / (i1 - i0);
    let maxRun = 0, run = 0, prev = null; for (const id of newPicks) { const f = T.fam(id); run = f === prev ? run + 1 : 1; prev = f; maxRun = Math.max(maxRun, run); }
    return { nuevo: [frac(newPicks, 0, 20), frac(newPicks, 20, 40), frac(newPicks, 40, 60), frac(newPicks, 60, 80)], viejo: [frac(oldPicks, 0, 20), frac(oldPicks, 20, 40), frac(oldPicks, 40, 60), frac(oldPicks, 60, 80)], azar: 30 / T.cat.length, maxMismaFamiliaSeguida: maxRun, ultimos: newPicks.slice(-12) };
  });
  console.log(JSON.stringify(r)); console.log(errs.slice(0, 3)); await br.close();
})();
