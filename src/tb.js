const { chromium } = require('playwright');
const BOTS = {
  misil: `if(!g._c||g.t-g._c>0.35){var m=g.ms.slice().sort((a,b)=>b.y-a.y)[0]; if(m){g._c=g.t; var L=Math.hypot(m.tx-m.x0,g.gy-m.y0); g.act(m.x+(m.tx-m.x0)/L*m.v*0.35, m.y+(g.gy-m.y0)/L*m.v*0.35);}}`,
  metegol: `g.drag(g.b.x);`,
  tenis: `g.drag(g.b.x+8);`,
  slotcar: `var m=520; for(var d=0;d<360;d+=20){var q=g.at(g.s+d); m=Math.min(m, Math.sqrt(Math.max(0, Math.pow(g.safe(q.k)*0.95,2)+2*260*d)));} g.holding = g.v < m*0.97;`,
  gancho: `var n=g.seg[g.cur+1]; if(n&&!g.att&&Math.hypot(g.x-n.px,g.y-n.py)<80){g.holding=true;g.press();} if(g.att){var nn=g.seg[g.cur+1]; if(nn&&g.vx*nn.d[0]+g.vy*nn.d[1]>0.985){g.holding=false;g.release();}}`,
  territorio: `if(!g._c||g.t-g._c>0.55){g._c=g.t; g._i=((g._i||0)+1)%4; g.wantD=[[0,-1],[1,0],[0,1],[-1,0]][g._i];}`,
  hamburgueseria: `if(!g._c||g.t-g._c>0.5){g._c=g.t; var d=[[1,0],[-1,0],[0,1],[0,-1]][Math.floor(Math.random()*4)]; g.p.want=d;}`,
  tren: `g.holding = (g.stop-g.x) <= g.v*g.v/600 + 3;`,
  cinchada: `if(Math.abs(Math.sin(g.k))<0.05 && (!g._c||g.t-g._c>0.2)){g._c=g.t; g.act();}`,
  sortija: `var p=g.hp(); if(p.front&&Math.abs(p.x-g.ox)<6&&(!g._c||g.t-g._c>0.5)){g._c=g.t;g.act();}`,
  billar: `if(!g.moving){var q=g.bs[0],b=g.bs[1]; if(b){var a=Math.atan2(b.y-q.y,b.x-q.x); var d=((g.aim-a)%(2*Math.PI)+2*Math.PI)%(2*Math.PI); if(d<0.03||d>2*Math.PI-0.03) g.act();}}`,
  caballitos: `if(Math.abs(Math.sin(g.ar))<0.04&&!g.b) g.act();`,
  embolsados: `var me=g.rs[0]; if(g.ph===1&&me.hop<=0&&me.fall<=0) g.act();`,
  pescapesca: `var AD=(a,b)=>{var d=((a-b)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);return d>Math.PI?d-2*Math.PI:d;}; for(var f of g.fs){if(!f.got&&Math.abs(AD(f.a+g.rot,Math.PI/2))<0.1&&g.open(f)&&g.drop<=0&&g.stun<=0){g.act();break;}}`,
  yeti: `if(g.ph===0&&Math.abs(g.p.y-(g.gy-70))<6) g.act();`,
  skee: `if(!g.b&&!g.ch&&g.balls>0){g.press(g.W/2);g.holding=true;} if(g.ch){var tp=(g.y0-40-g.ty)/(g.y0-g.ty+30), p=0.5-0.5*Math.cos(g.pw*2.8); if(Math.abs(p-tp)<0.02){g.holding=false;g.release();}}`,
  tumba: `if(!g.d[0]&&!g.d[1]){var o=[[0,1],[1,0],[-1,0],[0,-1]]; for(var d of o){ if(g.cell(g.pc+d[0],g.pr+d[1])!==1 && !(d[1]===-1)){g.d=d;break;}}}`,
  circulos: `for(var q of g.cs){if(!q.done&&Math.abs(q.t-q.T)<0.03){g.act(q.x,q.y);}}`,
  curling: `if(g.ph===0){g.holding=true;g.press();} var tp=((g.sy0-g.hy)*0.55-150)/260; if(g.ph===1&&(0.5-0.5*Math.cos(g.pw*2.2))>tp){g.holding=false;g.release();} if(g.ph===2){g.holding=false;}`,
};
(async () => {
  const ids = (process.argv[2] || Object.keys(BOTS).join(',')).split(',');
  const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 390, height: 760 } }); const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto('file://' + process.cwd() + '/test2.html'); await p.waitForTimeout(500);
  for (const id of ids) {
    await p.evaluate(id => __T.goTo(id), id); await p.waitForTimeout(600);
    const r = await p.evaluate(async ([code, ms]) => { const g = __T.g(); g.inp = true; if (g.state !== 'play') g.tap(10, 300); const f = new Function('g', code); let hi = 0, deaths = 0, lastL = g.lives; await new Promise(res => { const t0 = performance.now(); (function lp() { try { if (g.state === 'over') { deaths++; g.tap(10, 300); } if (g.state === 'play') f(g); } catch (e) { console.log(e); } hi = Math.max(hi, g.score); if (performance.now() - t0 < ms) requestAnimationFrame(lp); else res(); })(); }); return { s: g.score, hi, l: g.lives, over: deaths }; }, [BOTS[id], 14000]);
    console.log(id, JSON.stringify(r));
  }
  if (errs.length) console.log('ERR', errs.slice(0, 5));
  await br.close();
})();
