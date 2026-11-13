const { chromium } = require('playwright'); const path = require('path'); const http = require('http'), fs = require('fs');
(async () => { const root = __dirname; const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg' }[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); }).listen(8813);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await b.newPage({ viewport: { width: 720, height: 1280 } }); p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('C', m.text().slice(0, 200)); });
  await p.goto('http://127.0.0.1:8813/index.html'); await p.waitForFunction(() => window.READY && typeof draw === 'function', null, { timeout: 60000 });
  let ts = process.argv[2]; if (ts === 'mid') ts = (await p.evaluate(() => TLD.scenes.map(s => ((s[1] + s[2]) / 2).toFixed(2)))).join(',');
  fs.mkdirSync(path.join(root, 'st'), { recursive: true });
  for (const t of ts.split(',')) { await p.evaluate(t => draw(t), +t); await p.screenshot({ path: path.join(root, 'st', String((+t).toFixed(2)).padStart(7, '0') + '.png') }); }
  await b.close(); srv.close(); })();
