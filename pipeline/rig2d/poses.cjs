const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 720, height: 1280 } }); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.resolve('index3.html')); await p.waitForFunction(() => window.READY);
  for (const w of process.argv.slice(2)) { await p.evaluate(w => poses(w), w); await p.screenshot({ path: `po_${w}.png` }); }
  await b.close(); })();
