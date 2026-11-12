const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => { const [mode, arg] = process.argv.slice(2); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 720, height: 1280 } }); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.resolve(process.env.PAGE||'index.html')); await p.waitForFunction(() => window.READY); fs.mkdirSync('fr', { recursive: true });
  const T = mode === 'stills' ? arg.split(',').map(Number) : [...Array(300).keys()].map(i => i / 30);
  for (const [i, t] of T.entries()) { await p.evaluate(t => draw(t), t); await p.screenshot({ path: mode === 'stills' ? `st_${t.toFixed(2)}.png` : `fr/${String(i).padStart(4, '0')}.png` }); }
  await b.close(); })();
