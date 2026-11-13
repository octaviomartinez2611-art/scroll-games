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
  // Soltá: soltar cuando el punto de caída coincide con el vaso
  await run('rp_base', `if (g.it || g.wait > 0) return; var gg=900, w=Math.sqrt(gg/g.L), th=g.ang(), v=g.L*g.A*w*Math.cos(g.ph), x=g.ax+Math.sin(th)*g.L, y=g.ay+Math.cos(th)*g.L, vx=v*Math.cos(th), vy=-v*Math.sin(th); var d=g.cy3-6-y, t=(-vy+Math.sqrt(vy*vy+2*gg*d))/gg, lx=x+vx*t, cx=g.cups[0].x+g.cups[0].v*t*(1+Math.min(g.t,60)*0.01); if (Math.abs(lx-cx)<g.cw*0.25) g.act(0,0);`, 12);
  // Aros: tocar si la pelota cae debajo de un nivel y el aro de arriba tiene huecos alineados
  await run('ri_one', `var sy=g.by-g.cam; var next=null; for (var i=0;i<g.rg.length;i++){var r=g.rg[i]; if(!r.passed){ if(!next||r.y>next.y) next=r; }} if(!next){ if(sy>g.H*0.55) g.act(0,0); return;} var below=g.by-(next.y+next.R); var ok=g.gapOK(next.rot,next.gap*0.6,next.n,-Math.PI/2)&&g.gapOK(next.rot,next.gap*0.6,next.n,Math.PI/2); if (g.wait) { if (ok) g.act(0,0); return; } if (below>40 && !ok) { if (g.vy>150 && below<110) g.act(0,0); return; } if (g.vy>60) g.act(0,0);`, 15);
  // Rompe pisos: mantener mientras abajo no haya negro
  await run('sm_base', `var r=g.rows[0], n=r.d.length, si=Math.floor((((0.5 - r.off) % 1 + 1) % 1) * n) % n, r2=r.d[(si+ (r.sp>0?-1:1)+n)%n]; var bad=r.d[si]||r2; if (!bad && !g.holding) { g.holding=true; g.press(); } else if (bad && g.holding && g.fire<=0) { g.holding=false; }`, 10);
  // Volcadas: picar cuando la pelota está por debajo del aro
  await run('dk_base', `if (g.wait) { g.act(0,0); return; } if (g.y > g.hy - 40 && g.vy > 0) g.act(0,0);`, 12);
  // Puente: soltar cuando el palo llega al centro de la otra columna
  await run('br_base', `var tgt=g.nxt.x+g.nxt.w/2-(g.cur.x+g.cur.w); if (g.ph==='idle') { g.holding=true; g.press(); } else if (g.ph==='grow' && g.L>=tgt) { g.holding=false; g.release(0,0,false); }`, 12);
  // Pila de saltos: saltar cuando el bloque está cerca
  await run('sj_base', `if (g.blk && !g.blk.hit && Math.abs(g.blk.x-g.W/2) < g.bw/2+12+g.blk.v*0.28 && g.h<=0.5) g.act(0,0);`, 12);
  // Diagonal: doblar cuando el camino dobla
  await run('zz_base', `if (g.straight) return; var a=g.nodes[g.ni], b=g.nodes[g.ni+1]; if (!b) return; var sd=b.x>a.x?1:-1; if (sd!==g.d) g.act(0,0);`, 12);
  // Paredes: saltar si viene un pincho en mi pared
  await run('wj_base', `if (g.j>0) return; for (var i=0;i<g.obs.length;i++){var b=g.obs[i]; if(b.spk && b.s===g.s && b.y+b.L > g.py-60 && b.y < g.py+20){ g.act(0,0); return; }}`, 12);
  console.log(errs.slice(0,3)); await br.close();
})();
