// bots simples: comprueban que se puede ganar puntos jugando bien
const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 390, height: 760 } }); const errs=[]; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + process.cwd() + '/test2.html'); await p.waitForTimeout(500);
  async function run(id, botSrc, secs) {
    await p.evaluate(id => __T.goTo(id), id); await p.waitForTimeout(300);
    await p.evaluate(src => { window.__bot = new Function('g', src); window.__bi = setInterval(() => { const g = __T.g(); if (g && g.state === 'play') { g.inp = true; window.__bot(g); } }, 16); }, botSrc);
    await p.waitForTimeout(secs * 1000);
    const r = await p.evaluate(() => { clearInterval(window.__bi); const g = __T.g(); return g.score + ' pts, vidas ' + g.lives + ', ' + g.state; });
    console.log(id, r);
  }
  await run('planet', `if (!g.on) return; var p=g.on, nx=null; for (var i=0;i<g.pl.length;i++){var q=g.pl[i]; if(q.y<p.y-60 && (!nx||q.y>nx.y)) nx=q;} if(!nx) return; var tvx=-Math.sin(g.th0)*g.dir, tvy=Math.cos(g.th0)*g.dir, R=p.r+22, x=p.x+Math.cos(g.th0)*R, y=p.y+Math.sin(g.th0)*R, dx=nx.x-x, dy=nx.y-y, d=Math.hypot(dx,dy); if ((tvx*dx+tvy*dy)/d > 0.985) g.act(0,0);`, 12);
  await run('rope', `var w=g.w*(1+Math.min(g.t,60)*0.012); var to=(Math.PI*2 - (g.ph % (Math.PI*2)))/w; if (to < 0.3 && g.h<=0) g.act(0,0);`, 12);
  await run('dive', `if (g.ph==='ready') { if (g.wt<=0) { g.holding=true; g.press(); } return; } if (g.ph!=='air') return; var water=g.H-g.pb-90-(g.pt+110), tl=(-g.vy+Math.sqrt(g.vy*g.vy+2*900*(water-g.y)))/900, need=((Math.PI - g.a)%(Math.PI*2)+Math.PI*2)%(Math.PI*2); g.holding = need > 1.2*tl + 0.15;`, 12);
  await run('halfpipe', `var s=Math.abs(Math.sin(g.ph)); if (g.air() && !g.did && Math.cos(g.ph)*Math.sin(g.ph)>0 && s>0.83 && s<0.9) g.act(0,0);`, 12);
  await run('heist', `var x=g.x, danger=false; for (var i=0;i<g.ls.length;i++){var l=g.ls[i], lx=g.lx(l); if (lx>x-14 && lx<x+40){ var t2=g.t+0.35; var on2=((t2+l.off)%l.per)/l.per<l.duty; if (g.on(l)||on2) danger=true; }} if (!danger && !g.holding) { g.holding=true; } else if (danger && g.holding) { g.holding=false; }`, 14);
  await run('pancake', `for (var i=0;i<g.pans.length;i++){var p=g.pans[i]; if (p.c>0.86 && p.c<0.95) g.act(p.x,p.y);}`, 12);
  await run('lumber', `var s = g.seg[1].br===-1 ? 1 : g.seg[1].br===1 ? -1 : g.side; if (g.seg[0].br===s) s=-s; if (Math.random()<0.15) g.act(s<0?10:g.W-10, 400);`, 10);
  console.log(errs.slice(0,3)); await br.close();
})();
