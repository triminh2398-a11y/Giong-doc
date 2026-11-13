const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await b.newPage({ viewport: { width: 720, height: 1280 } }); p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CERR', m.text()); });
  await p.goto('http://127.0.0.1:8765/index.html'); await p.waitForFunction(() => window.READY, null, { timeout: 60000 });
  for (const a of process.argv.slice(2)) { const [s, t] = a.split('@'); await p.evaluate(([s, t]) => render(s, +t), [s, t]); await p.screenshot({ path: `${s}_${t}.png` }); }
  await b.close(); })();
