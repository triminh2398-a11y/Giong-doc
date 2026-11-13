const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 720, height: 1280 } }); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.resolve('index.html')); await p.waitForFunction(() => window.READY);
  for (const w of ['scene', 'cast']) { await p.evaluate(w => sheetCK(w), w); await p.screenshot({ path: `ck_${w}.png` }); }
  await b.close(); })();
