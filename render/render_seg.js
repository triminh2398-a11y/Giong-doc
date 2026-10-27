const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const [html, out, i0, i1, vw, vh] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: +vw, height: +vh } });
  page.on('pageerror', e => console.log('PAGEERR', e.message));
  await page.goto('file://' + path.resolve(html));
  await page.evaluate(() => document.fonts.ready);
  const fps = 30;
  let FF='ffmpeg';try{FF=require('ffmpeg-static')||'ffmpeg'}catch(e){}
  const ff = spawn(FF, ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = +i0; i < +i1; i++) {
    await page.evaluate(t => draw(t), i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 90 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 600 === 0) console.log('frame', i);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close();
})();
