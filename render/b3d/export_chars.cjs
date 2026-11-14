const { chromium } = require('playwright'); const path = require('path'); const http = require('http'), fs = require('fs');
const root = '/home/claude/assets3d/CharacterCreator';
const MT = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css', '.wasm': 'application/wasm' };
const SKIN = '#c49a74';
const C = {
  luc:  { sex: 'male', values: { age: .05, weight: -.25, muscle: .2, height: -.35, eyeTilt: .5, noseWidth: .3, jawWidth: .2 }, colors: { skin: SKIN, hairColor: '#0e0c0c', browColor: '#0e0c0c', eyeColor: '#2a1a12' }, hair: 'short02', outfit: ['briefs', 'shirt', 'jeans'], clothColors: { shirt: { primary: '#4a3c2c' }, jeans: { primary: '#26272b' } } },
  dat:  { sex: 'male', values: { age: -.25, weight: -.35, height: -.4, eyeTilt: .5, noseWidth: .3 }, colors: { skin: '#caa27c', hairColor: '#0e0c0c', browColor: '#0e0c0c', eyeColor: '#2a1a12' }, hair: 'short04', outfit: ['briefs', 'tshirt', 'shorts'], clothColors: { tshirt: { primary: '#3e4c5a' }, shorts: { primary: '#3a342e' } } },
  thin: { sex: 'male', values: { age: .85, weight: -.45, muscle: -.4, height: -.45, eyeTilt: .4, noseWidth: .35 }, colors: { skin: '#b48a64', hairColor: '#c8c4bc', browColor: '#c8c4bc', eyeColor: '#2a1a12' }, hair: 'short04', outfit: ['briefs', 'shirt', 'jeans'], clothColors: { shirt: { primary: '#6a5a42' }, jeans: { primary: '#34302c' } } },
  ba1:  { sex: 'female', values: { age: .35, weight: -.1, height: -.5, eyeTilt: .5, noseWidth: .3 }, colors: { skin: '#c8a07a', hairColor: '#0e0c0c', browColor: '#0e0c0c', eyeColor: '#2a1a12' }, hair: 'ponytail01', outfit: ['panties', 'bra', 'shirt', 'skirt'], clothColors: { shirt: { primary: '#5a3438' }, skirt: { primary: '#1e1e22' } } },
  ong2: { sex: 'male', values: { age: .45, weight: .05, height: -.3, eyeTilt: .4, noseWidth: .35 }, colors: { skin: '#b08660', hairColor: '#1a1816', browColor: '#1a1816', eyeColor: '#2a1a12' }, hair: 'short02', outfit: ['briefs', 'shirt', 'jeans'], clothColors: { shirt: { primary: '#4e5640' }, jeans: { primary: '#2c2c2a' } } },
};
(async () => { const srv = http.createServer((q, r) => { let f = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(f)) f = path.join(root, 'output', decodeURIComponent(q.url.split('?')[0]).replace(/^\/web\//, '')); fs.readFile(f, (e, d) => { if (e) { console.log('404', q.url); r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': MT[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); }).listen(8841);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await b.newPage({ viewport: { width: 800, height: 800 } });
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('C', m.text().slice(0, 200)); });
  await p.goto('http://127.0.0.1:8841/web/index.html'); await p.waitForTimeout(15000); console.log(await p.evaluate(() => JSON.stringify({b: window.__booted, e: typeof window.__export, l: typeof window.__loadSettings}))); await p.waitForFunction(() => window.__booted && window.__export && window.__loadSettings, null, { timeout: 120000 });
  for (const [id, st] of Object.entries(C)) { if (process.argv[2] && !process.argv.slice(2).includes(id)) continue;
    await p.evaluate(s => window.__loadSettings({ format: 'charactercreator.character', version: 1, ...s, values: { gender: s.sex === 'female' ? -1 : 1, ...s.values } }), st); await p.waitForTimeout(1500);
    const arr = await p.evaluate(async () => { const ab = await window.__export({ shape: 'baked', animations: 'all', fps: 30, textureSize: 1024, merge: false }); return Array.from(new Uint8Array(ab)); });
    fs.writeFileSync(`/home/claude/b3dv/chars/${id}.glb`, Buffer.from(arr)); console.log(id, arr.length); }
  await b.close(); srv.close(); })();
