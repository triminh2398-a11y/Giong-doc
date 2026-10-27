const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const mode = process.argv[2] || 'stills';
  const browser = await chromium.launch();
  const page0 = 0; const page = await browser.newPage({ viewport: { width: +(process.env.VW||1920), height: +(process.env.VH||1080) } });
  await page.goto('file://' + path.resolve(__dirname, process.env.ANIM||'anim.html'));
  await page.evaluate(() => document.fonts.ready);
  if (mode === 'stills') {
    const times = process.argv.slice(3).map(Number);
    for (const t of times) {
      await page.evaluate(t => draw(t), t);
      await page.screenshot({ path: path.resolve(__dirname, `still_${t}.jpg`), type: 'jpeg', quality: 80 });
    }
  } else {
    const fps = 30, dur = await page.evaluate(() => DURATION);
    const out = path.resolve(__dirname, process.env.OUT||'video_only.mp4');
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const N = Math.round(dur * fps);
    for (let i = 0; i < N; i++) {
      await page.evaluate(t => draw(t), i / fps);
      const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 300 === 0) console.log('frame', i, '/', N);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
