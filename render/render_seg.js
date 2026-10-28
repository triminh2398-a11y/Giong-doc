const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const [html, out, i0, i1, vw, vh] = process.argv.slice(2);
  const browser = await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const http=require('http'),fs=require('fs');const root=path.resolve(path.dirname(html));
  const srv=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}const ext=path.extname(f);r.writeHead(200,{'Content-Type':{'.html':'text/html','.js':'text/javascript','.glb':'model/gltf-binary','.jpg':'image/jpeg','.png':'image/png'}[ext]||'application/octet-stream'});r.end(d)})}).listen(8800);
  const page = await browser.newPage({ viewport: { width: +vw, height: +vh } });
  page.on('pageerror', e => console.log('PAGEERR', e.message));
  await page.goto('http://localhost:8800/' + path.basename(html));
  await page.waitForFunction(() => typeof draw === 'function' && (window.READY === undefined || window.READY === true), { timeout: 180000 });
  await page.evaluate(() => document.fonts.ready);
  const fps = 30;
  let FF='ffmpeg';try{FF=require('ffmpeg-static')||'ffmpeg'}catch(e){}
  const ff = spawn(FF, ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  // warm-up: first WebGL frame can be black
  for (let k = 0; k < 3; k++) { await page.evaluate(t => draw(t), +i0 / fps); await page.screenshot({ type: 'jpeg', quality: 10 }); }
  for (let i = +i0; i < +i1; i++) {
    await page.evaluate(t => draw(t), i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 90 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 600 === 0) console.log('frame', i);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close(); srv.close();
})();
