const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 512, height: 512 } });
  const svg = fs.readFileSync('logo.svg', 'utf8');
  for (const n of [512, 192]) {
    await p.setViewportSize({ width: n, height: n });
    await p.setContent(`<body style="margin:0;background:#000;display:grid;place-items:center;width:${n}px;height:${n}px">${svg.replace('<svg ', `<svg style="width:${Math.round(n * 0.74)}px;height:auto" `)}</body>`);
    await p.screenshot({ path: `netlify-app/public/icon-${n}.png` });
  }
  await p.setViewportSize({ width: 600, height: 300 }); await p.setContent(`<body style="margin:0;background:#000;display:grid;place-items:center;height:300px">${svg.replace('<svg ', '<svg style="width:420px;height:auto" ')}</body>`); await p.screenshot({ path: 'logo_prev.png' });
  await br.close(); })();
