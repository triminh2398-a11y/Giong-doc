// Render a frame plan (from plan_*.py) to an mp4: node seq.cjs plan.json out.mp4
const { chromium } = require('playwright'); const path = require('path'), http = require('http'), fs = require('fs'); const { spawn } = require('child_process');
(async () => { const [planF, out] = process.argv.slice(2); const plan = JSON.parse(fs.readFileSync(planF, 'utf8')); const root = __dirname;
  const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.js': 'text/javascript' }[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); }).listen(0);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await b.newPage({ viewport: { width: 720, height: 1280 } }); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto(`http://127.0.0.1:${srv.address().port}/index.html`); await p.waitForFunction(() => window.READY, null, { timeout: 60000 });
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (const f of plan.frames) { await p.evaluate(f => { window.MOUTH = f.mouth || {}; window.CAP = f.cap || ''; render(f.shot, f.t); }, f); ff.stdin.write(await p.screenshot({ type: 'jpeg', quality: 92 })); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); srv.close(); })();
