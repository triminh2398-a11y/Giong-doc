const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 720, height: 1280 } }); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve('index.html')); await p.waitForFunction(() => window.READY);
  let times = process.argv[2] ? process.argv[2].split(',').map(Number) : await p.evaluate(() => { const o = []; for (const k in TL) { const [a, b] = TL[k]; o.push(+(a + (b - a) * .5).toFixed(2)); } for (const k in BEAT) o.push(+(BEAT[k] + .4).toFixed(2)); return o.sort((a, b) => a - b); });
  fs.mkdirSync('st', { recursive: true }); for (const f of fs.readdirSync('st')) fs.unlinkSync('st/' + f);
  for (const t of times) { await p.evaluate(t => draw(t), t); await p.screenshot({ path: `st/${String(t.toFixed(2)).padStart(7, '0')}.png` }); }
  console.log(times.join(' ')); console.log([...new Set(errs)].slice(0, 10).join('\n')); await b.close(); })();
