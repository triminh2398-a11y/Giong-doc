const { chromium } = require('playwright'); const path = require('path'); const http = require('http'), fs = require('fs'); const { spawn } = require('child_process');
(async () => { const root = __dirname; const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg' }[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); }).listen(8814);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await b.newPage({ viewport: { width: 720, height: 1280 } });
  await p.goto('http://127.0.0.1:8814/index.html'); await p.waitForFunction(() => window.READY);
  const [a, z, out] = [+process.argv[2], +process.argv[3], process.argv[4]];
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = Math.round(a * 30); f < z * 30; f++) { await p.evaluate(t => draw(t), f / 30); ff.stdin.write(await p.screenshot({ type: 'jpeg', quality: 92 })); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); srv.close(); })();
