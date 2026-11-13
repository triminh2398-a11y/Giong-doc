const { chromium } = require('playwright'); const path = require('path'); const { spawn } = require('child_process');
const N = +(process.env.N || 2), FPS = 30;
(async () => { const b = await chromium.launch(); const dur = +require('fs').readFileSync('data.js','utf8').match(/DURT\s*=\s*([0-9.]+)/)[1], total = Math.ceil(dur * FPS), per = Math.ceil(total / N);
  await Promise.all([...Array(N)].map(async (_, w) => { const p = await b.newPage({ viewport: { width: 720, height: 1280 } }); p.on('pageerror', e => console.log('ERR', e.message));
    await p.goto('file://' + path.resolve('index.html')); await p.waitForFunction(() => window.READY);
    const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-vf', 'scale=1080:1920:flags=lanczos', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', `seg${w}.mp4`], { stdio: ['pipe', 'inherit', 'inherit'] });
    const a = w * per, z = Math.min(total, a + per);
    for (let f = a; f < z; f++) { await p.evaluate(t => draw(t), f / FPS); const buf = await p.screenshot({ type: 'jpeg', quality: 95 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); if (f % 300 === 0) console.log('w' + w, f); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); }));
  await b.close(); console.log('done'); })();
