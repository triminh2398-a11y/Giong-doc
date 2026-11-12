import * as THREE from './lib/three.module.js';
import { drawPerson, drawCrouch, drawDead, drawBird } from './toon3.js';
const W = 1080, H = 1920, FPS = 30;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t, lerp3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const M_ = { smooth: t => { t = clamp(t); return t * t * t * (t * (t * 6 - 15) + 10); }, easeOut: t => 1 - Math.pow(1 - clamp(t), 3), easeIn: t => Math.pow(clamp(t), 3),
  back: (t, s = 1.7) => { t = clamp(t) - 1; return t * t * ((s + 1) * t + s) + 1; }, lin: t => clamp(t) };
const spline = (pts, u) => { const n = pts.length - 1, x = clamp(u) * n, i = Math.min(n - 1, Math.floor(x)), t = x - i;
  const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n, i + 2)];
  return p1.map((_, k) => .5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t * t * t)); };
const canvas = document.getElementById('c');
const R = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true });
R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; R.outputColorSpace = THREE.SRGBColorSpace;
const S = new THREE.Scene();
const HORIZON = new THREE.Color('#cfe3f5'), TOP = new THREE.Color('#2d74d4');
S.fog = new THREE.Fog(HORIZON, 120, 1100);
const cam = new THREE.PerspectiveCamera(40, W / H, .08, 1500);
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
// ---------- materials ----------
const grad = (() => { const d = new Uint8Array([90, 90, 90, 255, 255, 255, 255, 255]); const t = new THREE.DataTexture(d, 2, 1); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
function paint(blot, seam, sd = 1, n = 70, fn) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); let s = sd; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  g.fillStyle = '#fff'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < n; i++) { g.globalAlpha = .16; g.fillStyle = blot; g.beginPath(); g.ellipse(r() * 256, r() * 256, 8 + r() * 30, 5 + r() * 16, r() * 3, 0, 7); g.fill(); }
  g.globalAlpha = .3; g.strokeStyle = seam; g.lineWidth = 2; for (let i = 0; i < n / 4; i++) { g.beginPath(); const x = r() * 256, y = r() * 256; g.moveTo(x, y); g.lineTo(x + (r() - .5) * 20, y + 10 + r() * 30); g.stroke(); }
  g.globalAlpha = 1; if (fn) fn(g);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t;
}
// Jrai grave-house roof pattern: red / white / black triangles and bands
const roofPat = (g) => { g.globalAlpha = 1; const cols = ['#b23a32', '#f2ead8', '#1d1820'];
  for (let row = 0; row < 4; row++) for (let i = 0; i < 8; i++) { g.fillStyle = cols[(i + row) % 3]; g.beginPath(); const x = i * 32, y = row * 64; g.moveTo(x, y + 64); g.lineTo(x + 16, y); g.lineTo(x + 32, y + 64); g.fill(); }
  g.fillStyle = '#1d1820'; for (let row = 0; row < 4; row++) g.fillRect(0, row * 64 + 58, 256, 6); };
const T = { rock: paint('#7c7290', '#4c4460', 3), grass: paint('#5d7f45', '#3f5a2e', 5, 140), wood: paint('#6a4a34', '#3a281c', 7), thatch: paint('#8a6a40', '#5a4024', 9, 120),
  dirt: paint('#9a5a32', '#6a3a1e', 13, 120), roofP: paint('#000', '#000', 2, 0, roofPat), wall: paint('#c9c0b0', '#9a9080', 17, 40), tile: paint('#b8b0a4', '#8a8478', 19, 30) };
const toon = (col, tex, rx = 1, ry = rx) => { const m = new THREE.MeshToonMaterial({ color: col, gradientMap: grad }); if (tex) { m.map = tex.clone(); m.map.needsUpdate = true; m.map.repeat.set(rx, ry); } return m; };
const M = { grass: toon('#8fbf5e', T.grass, 60), hill: toon('#7fae55', T.grass, 8), dirt: toon('#c27a48', T.dirt, 4, 20), mud: toon('#8a5a3a', T.dirt, 3),
  wood: toon('#9a6a48', T.wood, 2), woodDk: toon('#6a4630', T.wood, 2), thatch: toon('#c9a468', T.thatch, 3), roofP: toon('#ffffff', T.roofP, 2, 1), mound: toon('#a87850', T.dirt, 2),
  leaf: toon('#4f8a46'), leaf2: toon('#62a050'), leaf3: toon('#3f7040'), trunk: toon('#6a4a36'), bamboo: toon('#8ab04a'), mtn: toon('#7f93b0'), mtn2: toon('#a7b4cc'),
  wall: toon('#e8dfcf', T.wall, 2), floor: toon('#c9a07a', T.wood, 4), tile: toon('#d8d0c4', T.tile, 4), bed: toon('#6d8fb3'), sheet: toon('#f0ece4'), metal: toon('#5a6070'), truck: toon('#3f7fae'), truckDk: toon('#2d5b80'), tire: toon('#2a2a30'),
  lamp: new THREE.MeshBasicMaterial({ color: '#ffb35c' }), glass: new THREE.MeshBasicMaterial({ color: '#b9d4e6' }), black: new THREE.MeshBasicMaterial({ color: '#08070a' }) };
const add = (geo, mat, p = [0, 0, 0], s = [1, 1, 1], r = [0, 0, 0], shadow = true, parent = S) => { const m = new THREE.Mesh(geo, mat); m.position.set(...p); m.scale.set(...s); m.rotation.set(...r); m.castShadow = m.receiveShadow = shadow; parent.add(m); return m; };
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d), sph = (s = 12) => new THREE.SphereGeometry(1, s, Math.max(6, s * .6 | 0)), cyl = (a, b, h, n = 10) => new THREE.CylinderGeometry(a, b, h, n);
// ================= TÂY NGUYÊN (origin) =================
const ground = add(new THREE.PlaneGeometry(1600, 1600), M.grass, [0, 0, 0], [1, 1, 1], [-Math.PI / 2, 0, 0], false); ground.receiveShadow = true;
// red-dirt road from the far east to the forest edge, then a footpath to the graveyard
function ribbon(pts, w, mat, y = .02) { const L = [], Rr = []; for (let i = 0; i < pts.length; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz); L.push([pts[i][0] - dz / l * w, pts[i][1] + dx / l * w]); Rr.push([pts[i][0] + dz / l * w, pts[i][1] - dx / l * w]); }
  const sh = new THREE.Shape(); sh.moveTo(L[0][0], -L[0][1]); for (const p of L.slice(1)) sh.lineTo(p[0], -p[1]); for (const p of Rr.reverse()) sh.lineTo(p[0], -p[1]);
  const m = add(new THREE.ShapeGeometry(sh), mat, [0, y, 0], [1, 1, 1], [-Math.PI / 2, 0, 0], false); m.receiveShadow = true; return m; }
const ROAD = [[160, 60], [110, 52], [70, 40], [44, 22], [30, 8]];
ribbon(ROAD, 2.6, M.dirt);
for (let i = 0; i < 9; i++) add(sph(10), M.mud, [36 + rnd() * 30, -.25, 12 + rnd() * 26], [1.5 + rnd() * 2, .3, 1 + rnd()], [0, rnd() * 3, 0], false).receiveShadow = true;
const FOOT = [[30, 8], [22, 2], [14, -6], [8, -14], [4, -22], [2, -25]];
ribbon(FOOT, .8, M.dirt, .025);
// distant blue mountains + rolling hills
for (let i = 0; i < 22; i++) { const a = rnd() * Math.PI * 2, d = 420 + rnd() * 300, h = 70 + rnd() * 90; add(new THREE.ConeGeometry(110 + rnd() * 90, h, 7), i % 2 ? M.mtn : M.mtn2, [Math.sin(a) * d, h / 2 - 8, Math.cos(a) * d], [1, 1, 1], [0, rnd(), 0], false); }
for (let i = 0; i < 24; i++) { const a = rnd() * Math.PI * 2, d = 110 + rnd() * 220; add(sph(18), M.hill, [Math.sin(a) * d, -10, Math.cos(a) * d], [25 + rnd() * 40, 14 + rnd() * 10, 25 + rnd() * 30], [0, 0, 0], false); }
// ---- the forest graveyard (bãi nhà mồ) around (0,0,-30)
const NM = new THREE.Group(); NM.position.set(0, 0, -30); S.add(NM);
add(sph(20), M.mound, [0, -.2, 0], [3.2, .9, 2.6], [0, 0, 0], true, NM);
for (const [x, z] of [[-2.2, -1.6], [2.2, -1.6], [-2.2, 1.6], [2.2, 1.6]]) add(cyl(.12, .14, 3.6, 7), M.woodDk, [x, 1.8, z], [1, 1, 1], [0, 0, 0], true, NM);
const roof = add(new THREE.ConeGeometry(3.6, 4.2, 4, 1, true), M.roofP, [0, 5.2, 0], [1, 1, .62], [0, Math.PI / 4, 0], true, NM); roof.material.side = THREE.DoubleSide;
add(cyl(.05, .05, 2.2, 6), M.woodDk, [0, 8.2, 0], [1, 1, 1], [0, 0, 0], true, NM); // finial
// fence of carved posts
for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, x = Math.cos(a) * 4.6, z = Math.sin(a) * 3.6; if (z > 3.3 && Math.abs(x) < 1.2) continue; add(cyl(.11, .13, 1.4 + (i % 3) * .2, 6), M.wood, [x, .75, z], [1, 1, 1], [0, 0, 0], true, NM); }
// two older grave houses further in the forest (abandoned, leaning)
for (const [x, z, r] of [[-11, -38, .15], [10, -44, -.2]]) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.z = r * .3; S.add(g); add(sph(14), M.mound, [0, -.2, 0], [2.6, .7, 2], [0, 0, 0], true, g); const rf = add(new THREE.ConeGeometry(3, 3.4, 4, 1, true), M.thatch, [0, 3.6, 0], [1, 1, .62], [0, Math.PI / 4, 0], true, g); rf.material.side = THREE.DoubleSide; for (const [px, pz] of [[-1.8, -1.2], [1.8, -1.2], [-1.8, 1.2], [1.8, 1.2]]) add(cyl(.1, .12, 2.4, 6), M.woodDk, [px, 1.2, pz], [1, 1, 1], [0, 0, 0], true, g); }
const STUMP = add(cyl(.32, .36, .26, 12), new THREE.MeshToonMaterial({ color: '#d8b07a', gradientMap: grad }), [3.0, .13, -26.6], [1, 1, 1], [0, 0, 0], true); STUMP.visible = false;
// ---- the buôn (village) around (-40,0,30)
const BUON = [-40, 0, 30];
function nhaDai(x, z, ry, len = 14) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; S.add(g);
  for (let i = 0; i <= len / 2; i++) for (const pz of [-1.6, 1.6]) add(cyl(.12, .14, 1.8, 7), M.wood, [-len / 2 + i * 2, .9, pz], [1, 1, 1], [0, 0, 0], true, g);
  add(box(len, .2, 3.6), M.wood, [0, 1.85, 0], [1, 1, 1], [0, 0, 0], true, g); add(box(len, 1.6, 3.2), M.wood, [0, 2.75, 0], [1, 1, 1], [0, 0, 0], true, g);
  const rf = add(new THREE.CylinderGeometry(.01, 2.6, len + 1.2, 3, 1), M.thatch, [0, 4.5, 0], [1, 1, 1], [0, 0, Math.PI / 2], true, g); rf.rotation.x = Math.PI; rf.scale.set(1, 1, 1.0);
  for (const wx of [-len / 4, len / 4]) { const w = add(new THREE.PlaneGeometry(.9, .6), M.lamp, [wx, 2.8, 1.62], [1, 1, 1], [0, 0, 0], false, g); w.userData.flat = true; }
  add(box(.5, .14, 2.2), M.wood, [len / 2 + .6, 1, 0], [1, 1, 1], [0, 0, -.8], true, g); return g; }
nhaDai(-40, 22, .1); nhaDai(-30, 38, -.3, 12); nhaDai(-55, 34, .5, 16);
// nhà rông: tall axe-blade roof
{ const g = new THREE.Group(); g.position.set(-46, 0, 8); S.add(g); for (const [px, pz] of [[-2, -2], [2, -2], [-2, 2], [2, 2], [0, -2], [0, 2]]) add(cyl(.18, .2, 2.2, 8), M.wood, [px, 1.1, pz], [1, 1, 1], [0, 0, 0], true, g);
  add(box(5, .3, 5), M.wood, [0, 2.3, 0], [1, 1, 1], [0, 0, 0], true, g); add(box(4.4, 2, 4.4), M.wood, [0, 3.4, 0], [1, 1, 1], [0, 0, 0], true, g);
  const sh = new THREE.Shape(); sh.moveTo(-3.6, 0); sh.quadraticCurveTo(-1.2, 4, 0, 11); sh.quadraticCurveTo(1.2, 4, 3.6, 0); sh.closePath();
  add(new THREE.ExtrudeGeometry(sh, { depth: 4.6, bevelEnabled: false }), M.thatch, [0, 4.3, -2.3], [1, 1, 1], [0, 0, 0], true, g); }
// ---- instanced forest: tall trees + bamboo clumps, keeping clear patches
const segd = (x, z, P) => { let m = 1e9; for (let i = 0; i < P.length - 1; i++) { const [ax, az] = P[i], [bx, bz] = P[i + 1]; const dx = bx - ax, dz = bz - az; const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz))); m = Math.min(m, Math.hypot(x - ax - t * dx, z - az - t * dz)); } return m; };
function clear(x, z) { if (Math.hypot(x, z + 30) < 16 || (z > -30 && Math.abs(x) < 14 && z < -4)) return false; if (Math.hypot(x + 42, z - 22) < 27) return false; if (segd(x, z, ROAD) < 8 || segd(x, z, FOOT) < 6) return false; if (Math.hypot(x - 32, z - 10) < 12) return false; return true; }
{ const N = 520, tr = new THREE.InstancedMesh(cyl(.16, .26, 1, 6), M.trunk, N), cs = [M.leaf, M.leaf2, M.leaf3].map(m => new THREE.InstancedMesh(sph(10), m, N)); const o = new THREE.Object3D(); let n = 0, guard = 0;
  while (n < N && guard++ < 20000) { const x = (rnd() - .5) * 220, z = 60 - rnd() * 170; if (!clear(x, z)) continue; const near = Math.hypot(x, z + 30) < 30; if (!near && rnd() < .45) continue;
    const s = 1.2 + rnd() * 2; o.position.set(x, s * 1.8, z); o.scale.set(s, s * 3.6, s); o.rotation.set(0, 0, 0); o.updateMatrix(); tr.setMatrixAt(n, o.matrix);
    cs.forEach((c, k) => { o.position.set(x + (k - 1) * .6 * s, s * (3.8 + k * .5), z + (k % 2 - .5) * .6 * s); o.scale.set(s * (1.5 - k * .2), s * 1.05, s * (1.5 - k * .2)); o.updateMatrix(); c.setMatrixAt(n, o.matrix); }); n++; }
  for (const m of [tr, ...cs]) { m.count = n; m.castShadow = m.receiveShadow = true; S.add(m); } }
{ const N = 900, im = new THREE.InstancedMesh(cyl(.05, .06, 1, 5), M.bamboo, N); const o = new THREE.Object3D(); let n = 0, guard = 0;
  while (n < N && guard++ < 20000) { const cx = (rnd() - .5) * 160, cz = 50 - rnd() * 140; if (!clear(cx, cz)) continue; for (let k = 0; k < 12 && n < N; k++) { const h = 5 + rnd() * 4; o.position.set(cx + (rnd() - .5) * 1.2, h / 2, cz + (rnd() - .5) * 1.2); o.rotation.set((rnd() - .5) * .3, 0, (rnd() - .5) * .3); o.scale.set(1, h, 1); o.updateMatrix(); im.setMatrixAt(n++, o.matrix); } }
  im.count = n; im.castShadow = true; S.add(im); }
// grass tufts (flat sprites, never inked)
{ const c = document.createElement('canvas'); c.width = 64; c.height = 64; const g = c.getContext('2d'); g.strokeStyle = '#6a9a48'; g.lineWidth = 4; g.lineCap = 'round';
  for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(32 + (i - 4) * 3, 64); g.quadraticCurveTo(32 + (i - 4) * 4, 30, 32 + (i - 4) * 7, 8 + Math.abs(i - 4) * 5); g.stroke(); }
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; const mt = new THREE.MeshLambertMaterial({ map: tx, alphaTest: .4, side: THREE.DoubleSide });
  const geo = new THREE.PlaneGeometry(.5, .5); geo.translate(0, .25, 0); const im = new THREE.InstancedMesh(geo, mt, 3000); const o = new THREE.Object3D();
  for (let i = 0; i < 3000; i++) { const x = (rnd() - .5) * 60, z = 15 - rnd() * 60; o.position.set(x, 0, z); o.rotation.set(0, rnd() * 3, 0); o.scale.setScalar(.35 + rnd() * .5); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }
  im.userData.noink = true; S.add(im); }
// ================= scene dressing (v2): elephant grass, le bamboo bushes, carved posts, offerings, evening mist =================
const spriteTex = (w, h, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); fn(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
const crossed = (tex, w, h, N, place, opts = {}) => { const mt = new THREE.MeshLambertMaterial({ map: tex, alphaTest: .45, side: THREE.DoubleSide });
  const geo = new THREE.PlaneGeometry(w, h); geo.translate(0, h / 2, 0); const ims = [0, 1].map(() => new THREE.InstancedMesh(geo, mt, N)); const o = new THREE.Object3D(); let n = 0, guard = 0;
  while (n < N && guard++ < N * 40) { const p = place(); if (!p) continue; for (let k = 0; k < 2; k++) { o.position.set(p[0], 0, p[1]); o.rotation.set(0, p[2] + k * Math.PI / 2, 0); o.scale.setScalar(p[3]); o.updateMatrix(); ims[k].setMatrixAt(n, o.matrix); } n++; }
  for (const im of ims) { im.count = n; im.castShadow = !!opts.shadow; im.receiveShadow = true; im.userData.noink = true; S.add(im); } };
// cỏ tranh: tall pale-green blades with straw tips, thick around the clearing edge
const tallGrass = spriteTex(128, 256, (g, w, h) => { let s = 5; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 34; i++) { const x0 = 20 + r() * 88, lean = (r() - .5) * 70, top = 20 + r() * 90; const gr = g.createLinearGradient(0, h, 0, top); gr.addColorStop(0, '#3f5f2c'); gr.addColorStop(.6, ['#7ea04c', '#8fae58', '#6f9442'][i % 3]); gr.addColorStop(1, '#a89a5e');
    g.strokeStyle = gr; g.lineWidth = 3 + r() * 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0, h); g.quadraticCurveTo(x0 + lean * .3, (h + top) / 2, x0 + lean, top); g.stroke(); } });
crossed(tallGrass, 1.1, 1.7, 1400, () => { const a = rnd() * Math.PI * 2, d = 6.5 + Math.pow(rnd(), .7) * 26, x = Math.sin(a) * d, z = -30 + Math.cos(a) * d * .9; if (z > -22 && Math.abs(x) < 3) return null; return [x, z, rnd() * 3, .7 + rnd() * .7]; });
crossed(tallGrass, 1.1, 1.5, 900, () => { const x = (rnd() - .5) * 120, z = 30 - rnd() * 110; if (!clear(x, z) && Math.hypot(x, z + 30) > 6) return null; if (Math.hypot(x, z + 30) < 7) return null; return [x, z, rnd() * 3, .6 + rnd() * .6]; });
// bụi le: dense clumps of thin leaning bamboo with leaf sprays
const leBush = spriteTex(256, 384, (g, w, h) => { let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 22; i++) { const x0 = 100 + r() * 56, x1 = x0 + (r() - .5) * 220, y1 = 20 + r() * 120; g.strokeStyle = ['#6f8a3a', '#7f9a44', '#5c7430'][i % 3]; g.lineWidth = 4; g.beginPath(); g.moveTo(x0, h); g.quadraticCurveTo((x0 + x1) / 2, h * .5, x1, y1); g.stroke();
    for (let k = 0; k < 6; k++) { const t = .4 + k * .1, x = x0 + (x1 - x0) * t * t, y = h + (y1 - h) * t; g.fillStyle = ['#4f7a34', '#5f8c3c', '#3f6a2c'][k % 3]; g.beginPath(); g.ellipse(x + 12, y, 22, 6, (x1 > x0 ? -.4 : .4), 0, 7); g.fill(); g.beginPath(); g.ellipse(x - 12, y + 6, 20, 5, (x1 > x0 ? .5 : -.5), 0, 7); g.fill(); } } });
crossed(leBush, 4.2, 6.2, 160, () => { const a = rnd() * Math.PI * 2, d = 14 + rnd() * 40, x = Math.sin(a) * d, z = -30 + Math.cos(a) * d; if (z > -16 && Math.abs(x) < 8) return null; return [x, z, rnd() * 3, .7 + rnd() * .6]; }, { shadow: true });
// carved grave posts (cột nhà mồ) around the fence: tall posts topped with gourd knobs, horns and a bird
{ const TOP = new THREE.Group(); NM.add(TOP);
  for (let i = 0; i < 12; i++) { const a = (i + .5) / 12 * Math.PI * 2, x = Math.cos(a) * 5.4, z = Math.sin(a) * 4.3; if (z > 3.6 && Math.abs(x) < 2) continue; const h = 2.4 + (i % 3) * .5;
    add(cyl(.14, .17, h, 8), M.woodDk, [x, h / 2, z], [1, 1, 1], [0, 0, 0], true, TOP);
    add(sph(10), M.wood, [x, h + .16, z], [.24, .2, .24], [0, 0, 0], true, TOP); add(sph(10), M.wood, [x, h + .46, z], [.18, .16, .18], [0, 0, 0], true, TOP);
    if (i % 3 === 0) { for (const s of [-1, 1]) add(cyl(.03, .05, .5, 5), M.wood, [x + s * .16, h + .72, z], [1, 1, 1], [0, 0, s * .6], true, TOP); }
    else if (i % 3 === 1) add(new THREE.ConeGeometry(.12, .4, 6), M.wood, [x, h + .78, z], [1, 1, 1], [0, 0, 0], true, TOP);
    else { add(sph(8), M.wood, [x, h + .7, z], [.2, .1, .1], [0, a, 0], true, TOP); add(new THREE.ConeGeometry(.04, .14, 5), M.wood, [x + .2, h + .72, z], [1, 1, 1], [0, 0, -Math.PI / 2], true, TOP); }
    for (let k = 0; k < 3; k++) add(cyl(.18, .18, .05, 8), M.thatch, [x, .5 + k * .6, z], [1, 1, 1], [0, 0, 0], false, TOP); } // carved bands
  // offerings left at the mound: wine jars (ché), a gourd, bamboo pole with a white cloth
  const jar = toon('#6a3f2a', T.dirt, 1); for (const [x, z, s] of [[-1.8, 1.3, 1], [1.6, 1.4, .8], [-.6, 1.9, .7], [2.4, .2, .9]]) { add(sph(12), jar, [x, .32 * s, z], [.32 * s, .38 * s, .32 * s], [0, 0, 0], true, NM); add(cyl(.12 * s, .15 * s, .14 * s, 10), jar, [x, .72 * s, z], [1, 1, 1], [0, 0, 0], true, NM); }
  add(cyl(.04, .05, 4.2, 6), M.bamboo, [-3.0, 2.1, .6], [1, 1, 1], [0, 0, .06], true, NM);
  const cloth = add(new THREE.PlaneGeometry(.5, 1.4, 4, 8), toon('#ece6d6'), [-2.86, 3.3, .6], [1, 1, 1], [0, 0, 0], false, NM); cloth.material.side = THREE.DoubleSide; cloth.userData.cloth = true; window.CLOTH = cloth; }
// leaf litter + dirt clearing under the grave house
{ const litter = spriteTex(512, 512, (g, w, h) => { let s = 21; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; const gr = g.createRadialGradient(256, 256, 30, 256, 256, 256); gr.addColorStop(0, 'rgba(140,96,60,1)'); gr.addColorStop(.7, 'rgba(120,96,58,.85)'); gr.addColorStop(1, 'rgba(110,100,60,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 420; i++) { const a = r() * 7, d = Math.pow(r(), .6) * 230; g.fillStyle = ['#a36a3a', '#c48a48', '#7a5030', '#d4a45a'][i % 4]; g.globalAlpha = .6; g.beginPath(); g.ellipse(256 + Math.cos(a) * d, 256 + Math.sin(a) * d, 6 + r() * 6, 3, r() * 3, 0, 7); g.fill(); } });
  const m = add(new THREE.PlaneGeometry(24, 20), new THREE.MeshToonMaterial({ map: litter, transparent: true, gradientMap: grad, depthWrite: false }), [0, .03, -30], [1, 1, 1], [-Math.PI / 2, 0, 0], false); m.receiveShadow = true; m.userData.noink = true; }
// evening mist: soft camera-facing veils low over the ground (never inked, faded by the light preset)
const MISTS = []; { const mt = spriteTex(256, 128, (g, w, h) => { const gr = g.createRadialGradient(128, 64, 4, 128, 64, 128); gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.save(); g.scale(1, .5); g.fillRect(0, 0, w, h * 2); g.restore(); });
  for (let i = 0; i < 26; i++) { const a = rnd() * Math.PI * 2, d = 9 + rnd() * 30; const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: mt, transparent: true, depthWrite: false, opacity: .5, color: '#ffffff' }));
    m.position.set(Math.sin(a) * d, .5 + rnd() * 1.1, -30 + Math.cos(a) * d * .9); m.scale.set(9 + rnd() * 9, 2 + rnd() * 1.5, 1); m.userData.noink = true; m.userData.mist = true; S.add(m); MISTS.push(m); } }
// ---- the pickup truck at the forest edge
const TRUCK = new THREE.Group(); TRUCK.position.set(32, 0, 10); TRUCK.rotation.y = .93; S.add(TRUCK);
add(box(2, .6, 4.6), M.truck, [0, .85, 0], [1, 1, 1], [0, 0, 0], true, TRUCK); add(box(2, .5, .1), M.truck, [0, 1.4, 2.25], [1, 1, 1], [0, 0, 0], true, TRUCK); for (const x of [-.95, .95]) add(box(.1, .5, 2.6), M.truck, [x, 1.4, 1.0], [1, 1, 1], [0, 0, 0], true, TRUCK); add(box(2, .5, .1), M.truck, [0, 1.4, -.25], [1, 1, 1], [0, 0, 0], true, TRUCK); for (const x of [-.9, .9]) add(box(.08, .7, .08), M.truckDk, [x, 1.5, -1.95], [1, 1, 1], [0, 0, 0], true, TRUCK); add(box(1.9, .08, .08), M.truckDk, [0, 1.85, -1.95], [1, 1, 1], [0, 0, 0], true, TRUCK); add(box(1.9, .5, .1), M.truckDk, [0, 1.15, -2.25], [1, 1, 1], [0, 0, 0], true, TRUCK); add(box(.8, .5, .7), M.truckDk, [-.45, 1.1, -.6], [1, 1, 1], [0, 0, 0], true, TRUCK); add(box(.8, .5, .7), M.truckDk, [.45, 1.1, -.6], [1, 1, 1], [0, 0, 0], true, TRUCK);

for (const [x, z] of [[-1, -1.5], [1, -1.5], [-1, 1.5], [1, 1.5]]) add(cyl(.42, .42, .3, 14), M.tire, [x, .42, z], [1, 1, 1], [0, 0, Math.PI / 2], true, TRUCK);
TRUCK.children.forEach(c => { if (Math.abs(c.position.y - 1.1) < .01 && Math.abs(c.position.z + .6) < .01) c.userData.seat = true; });
const HEAD = [-.6, .6].map(x => { const l = add(new THREE.SphereGeometry(.12, 8, 6), M.lamp, [x, 1.2, -2.32], [1, 1, 1], [0, 0, 0], false, TRUCK); l.userData.flat = true; return l; });
// ================= SÀI GÒN APARTMENT (interior at x=300) =================
const APT = new THREE.Group(); APT.position.set(300, 0, 0); S.add(APT);
add(box(6, .1, 6), M.floor, [0, -.05, 0], [1, 1, 1], [0, 0, 0], true, APT);
for (const [p, r, w] of [[[0, 1.6, -3], [0, 0, 0], 6], [[-3, 1.6, 0], [0, Math.PI / 2, 0], 6], [[3, 1.6, 0], [0, -Math.PI / 2, 0], 6]]) { const m = add(new THREE.PlaneGeometry(w, 3.2), M.wall, p, [1, 1, 1], r, false, APT); m.receiveShadow = true; }
add(box(6, .1, 6), M.wall, [0, 3.2, 0], [1, 1, 1], [0, 0, 0], false, APT);
// window with a city skyline
{ const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#9fc6ea'); gr.addColorStop(1, '#f2d6b8'); g.fillStyle = gr; g.fillRect(0, 0, 512, 256);
  let s = 3; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 26; i++) { const w = 20 + r() * 40, h = 60 + r() * 150, x = r() * 512; g.fillStyle = ['#6c7a90', '#7f8ca2', '#58667c'][i % 3]; g.fillRect(x, 256 - h, w, h); g.fillStyle = '#ffe3a0'; for (let y = 256 - h + 8; y < 250; y += 16) for (let xx = x + 5; xx < x + w - 6; xx += 12) if (r() > .5) g.fillRect(xx, y, 5, 7); }
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; const m = add(new THREE.PlaneGeometry(2.4, 1.4), new THREE.MeshBasicMaterial({ map: tx }), [-1.2, 1.8, -2.98], [1, 1, 1], [0, 0, 0], false, APT); m.userData.flat = true; }
add(box(2.6, .12, .2), M.woodDk, [-1.2, 1.05, -2.92], [1, 1, 1], [0, 0, 0], true, APT);
// bed, side table + lamp, door, mirror
add(box(2.2, .45, 2.2), M.bed, [1.6, .25, -1.7], [1, 1, 1], [0, 0, 0], true, APT); add(box(2.1, .16, 2.1), M.sheet, [1.6, .55, -1.7], [1, 1, 1], [0, 0, 0], true, APT); add(box(1.6, .2, .5), M.sheet, [1.6, .7, -2.5], [1, 1, 1], [0, 0, 0], true, APT);
add(box(.5, .6, .5), M.woodDk, [-.1, .3, -2.6], [1, 1, 1], [0, 0, 0], true, APT); const APTLAMP = new THREE.PointLight('#ffd2a0', 0, 8, 1.4); APTLAMP.position.set(-.1, 1.2, -2.4); APT.add(APTLAMP);
add(box(1.0, 2.1, .08), M.woodDk, [2.98, 1.05, 1.2], [1, 1, 1], [0, -Math.PI / 2, 0], true, APT);
add(box(1.0, 1.6, .06), M.woodDk, [-2.97, 1.6, -.8], [1, 1, 1], [0, Math.PI / 2, 0], true, APT);
const MIRROR = add(new THREE.PlaneGeometry(.86, 1.46), new THREE.MeshBasicMaterial({ color: '#cfdde6' }), [-2.93, 1.6, -.8], [1, 1, 1], [0, Math.PI / 2, 0], false, APT); MIRROR.userData.flat = true;
// ================= sky, clouds, lights =================
const skyM = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { top: { value: TOP.clone() }, hor: { value: HORIZON.clone() }, sun: { value: new THREE.Vector3(0, 1, 0) }, disc: { value: new THREE.Color('#fff2d0') } },
  vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
  fragmentShader: 'uniform vec3 top,hor,sun,disc; varying vec3 vD; void main(){ float y=max(vD.y,0.); vec3 c=mix(hor,top,pow(y,.55)); float s=dot(normalize(vD),normalize(sun)); c=mix(c,disc,smoothstep(.9988,.9993,s)); c+=disc*.15*pow(max(s,0.),60.); gl_FragColor=vec4(c,1.); }' });
const sky = new THREE.Mesh(new THREE.SphereGeometry(1000, 32, 16), skyM); sky.userData.sky = true; S.add(sky);
const clouds = [];
{ const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#fff';
  for (const [x, y, r] of [[130, 170, 70], [210, 130, 90], [310, 120, 100], [390, 160, 70], [250, 180, 80], [170, 190, 60], [350, 190, 60]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  g.globalCompositeOperation = 'source-atop'; const gr = g.createLinearGradient(0, 60, 0, 256); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#c9cfe8'); g.fillStyle = gr; g.fillRect(0, 0, 512, 256);
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace;
  for (let i = 0; i < 18; i++) { const a = rnd() * Math.PI * 2, d = 700 + rnd() * 200; const m = new THREE.Mesh(new THREE.PlaneGeometry(1, .5), new THREE.MeshBasicMaterial({ map: tx, transparent: true, fog: false, depthWrite: false }));
    m.position.set(Math.sin(a) * d, 110 + rnd() * 170, Math.cos(a) * d); m.scale.setScalar(160 + rnd() * 160); m.userData.cloud = true; S.add(m); clouds.push(m); } }
const sun = new THREE.DirectionalLight('#fff', 2); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0006; S.add(sun, sun.target);
const hemi = new THREE.HemisphereLight('#fff', '#000', 1); S.add(hemi);
const lights = [];
S.traverse(o => { if (o.isMesh && o.material === M.lamp && o.parent && o.parent !== TRUCK) { } });
const PRE = {
  day: { az: 200, el: 50, sun: '#fff3df', si: 2.45, hs: '#d2e2f6', hg: '#a8905e', hi: 1.1, top: '#2d74d4', hor: '#cfe3f5', disc: '#fffbe8', gain: '#ffffff', lift: '#000000', sat: 1.12, vig: .2, tint: '#ffffff', fog: [120, 1300], cloud: '#ffffff', lamp: 0 },
  golden: { az: 220, el: 11, sun: '#ffb46a', si: 2.9, hs: '#a99bcc', hg: '#7a5040', hi: .98, top: '#6474c0', hor: '#ffc485', disc: '#fff0c8', gain: '#fff0e0', lift: '#000000', sat: 1.15, vig: .26, tint: '#ffe2c4', fog: [140, 1100], cloud: '#ffd9c0', lamp: 3 },
  night: { az: 160, el: 34, sun: '#b9c8ff', si: 1.55, hs: '#6a7cc0', hg: '#2c3450', hi: 1.2, top: '#0f1a44', hor: '#3d5596', disc: '#f4f6ff', gain: '#e6ecff', lift: '#05070f', sat: 1.08, vig: .32, tint: '#d0daff', fog: [60, 700], cloud: '#7d8cc0', lamp: 10 },
  dawn: { az: 120, el: 8, sun: '#ffc0b0', si: 1.9, hs: '#b6a8d8', hg: '#6a5060', hi: 1.05, top: '#5d6cab', hor: '#f2b8a8', disc: '#fff0e8', gain: '#fff0f0', lift: '#020204', sat: 1.08, vig: .28, tint: '#f4dede', fog: [80, 900], cloud: '#f0c8c8', lamp: 2 },
  room: { az: 230, el: 40, sun: '#fff3df', si: 1.2, hs: '#f2e6d6', hg: '#8a7060', hi: 1.35, top: '#2d74d4', hor: '#cfe3f5', disc: '#fffbe8', gain: '#fff8f0', lift: '#000000', sat: 1.1, vig: .24, tint: '#fff4ea', fog: [200, 1300], cloud: '#ffffff', lamp: 4 },
};
// ---------- passes ----------
const rtC = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
const rtN = new THREE.WebGLRenderTarget(W, H, { type: THREE.FloatType });
const rtI = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType });
const ndM = new THREE.ShaderMaterial({ vertexShader: `varying vec3 vN; varying float vD;
  void main(){ vec3 p=position; vec3 n=normal;
  #ifdef USE_INSTANCING
  p=(instanceMatrix*vec4(p,1.)).xyz; n=mat3(instanceMatrix)*n;
  #endif
  vec4 mv=modelViewMatrix*vec4(p,1.); vN=normalize(normalMatrix*n); vD=-mv.z; gl_Position=projectionMatrix*mv; }`,
  fragmentShader: 'varying vec3 vN; varying float vD; void main(){ gl_FragColor=vec4(normalize(vN)*.5+.5, vD); }' });
const cardND = new Map();
const cardNDMat = (map) => new THREE.ShaderMaterial({ uniforms: { map: { value: map } }, side: THREE.DoubleSide,
  vertexShader: 'varying vec2 vUv; varying float vD; void main(){ vUv=uv; vec4 mv=modelViewMatrix*vec4(position,1.); vD=-mv.z; gl_Position=projectionMatrix*mv; }',
  fragmentShader: 'uniform sampler2D map; varying vec2 vUv; varying float vD; void main(){ if(texture2D(map,vUv).a<.5) discard; gl_FragColor=vec4(0.,0.,0.,vD); }' });
const fsq = (frag, uniforms) => { const m = new THREE.ShaderMaterial({ uniforms, vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }', fragmentShader: frag }); const q = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), m); const sc = new THREE.Scene(); sc.add(q); return { m, sc }; };
const INKSH = `uniform sampler2D col, nd; uniform vec2 res; uniform float px, sat, vig, flash; uniform vec3 fogCol, lift, gain; varying vec2 vUv;
float edgeAt(vec2 uv, float r){
vec4 c = texture2D(nd, uv); if (dot(c.rgb,c.rgb) < .01) return 0.; float d = c.a; vec3 n = c.rgb*2.-1.;
float e = 0.; float rr = r * clamp(7./d, .62, 1.25);
for (int i=0;i<16;i++){ float a = float(i)*.785398 + (i>7 ? .39 : 0.); float k = i>7 ? .5 : 1.;
vec2 o = vec2(cos(a), sin(a))*rr*k/res; vec4 s = texture2D(nd, uv+o);
float ds = s.a; bool card = dot(s.rgb,s.rgb) < .01;
if (card && ds > 0.) continue;
if (card) ds = 1e4;
vec3 ns = s.rgb*2.-1.;
e = max(e, smoothstep(.006, .02, (ds - d)/d));
if (!card && abs(ds-d)/d < .06) e = max(e, smoothstep(.88, .72, dot(n, ns)) * .9);
}
return e * (1. - smoothstep(140., 520., d)*.8);
}
void main(){
vec3 c = texture2D(col, vUv).rgb;
float e = edgeAt(vUv, px);
c = mix(c, vec3(.012,.01,.014), e);
if (flash < -0.5) c = vec3(e);
float l = dot(c, vec3(.299,.587,.114)); c = mix(vec3(l), c, sat);
c = c*gain + lift;
vec2 q = vUv-.5; c *= 1. - vig*dot(q*vec2(1.,.75), q*vec2(1.,.75))*2.2;
c = mix(c, vec3(1.), flash);
gl_FragColor = vec4(c,1.); }`;
const DOF = `uniform sampler2D src, nd; uniform vec2 res; uniform float focus, cinf, near; varying vec2 vUv;
float coc(vec2 uv){ float d = texture2D(nd, uv).a; if (d <= 0.) d = 2000.; float k = 1. - focus/d; return k > 0. ? cinf*k : min(-k*cinf*near, cinf*1.4); }
void main(){
float c0 = coc(vUv);
if (cinf < .5 || c0 < .6) { gl_FragColor = linearToOutputTexel(vec4(texture2D(src, vUv).rgb, 1.)); return; }
vec3 acc = vec3(0.); float wsum = 0.;
for (int i=0;i<48;i++){ float fi = float(i); float r = sqrt((fi+.5)/48.); float a = fi*2.39996;
vec2 o = vec2(cos(a), sin(a))*r*c0/res; float cs = coc(vUv+o);
float w = smoothstep(r*c0-1.5, r*c0+.5, cs + .5);
acc += texture2D(src, vUv+o).rgb*w; wsum += w; }
gl_FragColor = linearToOutputTexel(vec4(acc/max(wsum,1e-3), 1.)); }`;
const ink = fsq(INKSH, { col: { value: rtC.texture }, nd: { value: rtN.texture }, res: { value: new THREE.Vector2(W, H) }, px: { value: 2.5 }, sat: { value: 1.12 }, vig: { value: .3 }, flash: { value: 0 }, fogCol: { value: HORIZON }, lift: { value: new THREE.Color('#05050c') }, gain: { value: new THREE.Color('#f2ecff') } });
const dof = fsq(DOF, { src: { value: rtI.texture }, nd: { value: rtN.texture }, res: { value: new THREE.Vector2(W, H) }, focus: { value: 4 }, cinf: { value: 0 }, near: { value: 1 } });

// ---------- story (pure functions of f) ----------
// ================= character cards =================
function makeCard(draw, hgt, { opacity = 1, design = 850 } = {}) {
  const c = document.createElement('canvas'); c.width = 1200; c.height = 2000; const g = c.getContext('2d'); g.scale(2, 2);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const u = hgt / design, h = 1000 * u, w = 600 * u; const geo = new THREE.PlaneGeometry(w, h); geo.translate(0, h / 2 - 25 * u, 0);
  const mat = new THREE.MeshBasicMaterial({ map: tex, alphaTest: .02, side: THREE.DoubleSide, transparent: opacity < 1, opacity, depthWrite: opacity >= 1 });
  const m = new THREE.Mesh(geo, mat); m.castShadow = opacity >= 1; m.userData.card = true; m.userData.ghost = opacity < 1; m.visible = false;
  m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: .5 });
  const blob = new THREE.Mesh(new THREE.CircleGeometry(.32 * hgt / 1.65, 24), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: .28, depthWrite: false }));
  blob.rotation.x = -Math.PI / 2; blob.scale.set(1, .55, 1); blob.userData.blob = true; blob.visible = false; S.add(m); S.add(blob);
  let key = ''; return { m, blob, draw, set(o) { const k = JSON.stringify(o, (_, v) => typeof v === 'number' ? Math.round(v * 20) / 20 : v); if (k !== key) { key = k; draw(g, o); tex.needsUpdate = true; } } };
}
const KH = { skin: '#f1cda8', hair: 'short', shirt: '#55688a', coat: true, pants: '#2c2f3d', seed: 2 };
const TU = { skin: '#f3d0ad', hair: 'cap', capCol: '#b23a32', shirt: '#c8543e', sleeve: 'short', pants: '#2e4466', pocket: 1, seed: 4 };
const GL = { skin: '#a97b55', hair: 'bald', age: 1, beard: 1, shirt: '#1f2233', vest: '#1f2233', stripe: '#b23a32', sleeve: 'none', loin: '#1f2233', pants: '#1f2233', arms: 'stick', prop: 'stick', tilt: 3, seed: 6 };
const VL = [{ skin: '#b98a62', hair: 'bun', shirt: '#24273a', stripe: '#b23a32', skirt: '#24273a', seed: 7 }, { skin: '#a4734c', hair: 'short', shirt: '#24273a', vest: '#24273a', stripe: '#b23a32', sleeve: 'none', loin: '#24273a', seed: 8 }, { skin: '#b07e56', hair: 'bun', shirt: '#2e2a3a', stripe: '#e8e0d0', skirt: '#2e2a3a', seed: 9 }, { skin: '#9a6a44', hair: 'short', shirt: '#2a2c3c', vest: '#2a2c3c', stripe: '#e8e0d0', sleeve: 'none', loin: '#2a2c3c', seed: 10 }, { skin: '#a8784f', hair: 'short', shirt: '#24273a', vest: '#24273a', stripe: '#b23a32', sleeve: 'none', loin: '#24273a', seed: 11 }, { skin: '#b5865c', hair: 'bun', shirt: '#24273a', stripe: '#b23a32', skirt: '#24273a', seed: 12 }];
const C = {
  kh: makeCard(drawPerson, 1.68), khC: makeCard(drawCrouch, 1.68 * .62, { design: 600 }), tu: makeCard(drawPerson, 1.64), tuW: makeCard(drawCrouch, 1.64 * .62, { design: 600 }),
  gl: makeCard(drawPerson, 1.6), st: makeCard(drawCrouch, 1.1, { design: 600 }), bird: makeCard(drawBird, .9, { design: 400 }),
  st2: makeCard(drawPerson, 1.5), st3: makeCard(drawPerson, 1.4), dead: makeCard(drawDead, 1.25, { opacity: .7, design: 700 }),
  v: [0, 1, 2, 3, 4, 5].map(() => makeCard(drawPerson, 1.58)),
};
const ALL = [C.kh, C.khC, C.tu, C.tuW, C.gl, C.st, C.bird, C.st2, C.st3, C.dead, ...C.v];
const NMW = (x, z) => [x, 0, z - 30];               // graveyard-local -> world
const AP = (x, z, y = 0) => [300 + x, y, z];          // apartment-local -> world
const TW = (x, y, z) => { const v = new THREE.Vector3(x, y, z); TRUCK.updateMatrixWorld(); return v.applyMatrix4(TRUCK.matrixWorld).toArray(); };
const STP = NMW(3.0, 3.4), BIRDP = NMW(-2.7, 3.6);
// ================= timeline =================
let TL = window.TL || null; // {key: [start, end]}, seconds
const ORDER = ['hook', 'title', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13', 's14', 's15', 's16', 's17', 's18', 'end', 'cta'];
function fakeTL(texts) { let t = 0; const o = {}; for (const k of ORDER) { const n = k === 'title' ? 0 : (texts[k] || '').split(/\s+/).length; const d = k === 'title' ? 2.6 : n * .27 + .55; o[k] = [t, t + d]; t += d; } o._end = t + 1.2; return o; }
const lineAt = t => { for (const k of ORDER) if (t >= TL[k][0] && t < TL[k][1]) return k; return t < TL.hook[0] ? 'hook' : 'cta'; };
// ================= shots =================
const blinkAt = (f, s) => { const per = 46 + (s * 17) % 31, ph = (f + s * 13) % per; return ph < 2 ? .5 : ph < 4 ? 1 : 0; };
const idle = (f, s) => ({ tilt: 1.2 * Math.sin((f + s * 7) * .05), headTilt: 1.5 * Math.sin((f + s * 5) * .037 + 1) });
// a shot = {light, set, cam:[{u,pos,look,fov,roll,ease}], dof:[cinf,target], act(u,f) -> cards}
function cam2(a, b, ease = 'smooth') { return [{ u: 0, ...a }, { u: 1, ease, ...b }]; }
const KHA = AP(.9, -1.4), KHB = AP(.9, .6), NMC = NMW(0, 0), STW = STP, KHP = NMW(2.0, 4.2), DEADP = NMW(.75, 4.0), TUP = NMW(-2.3, 4.0);
const KHG = [-39.1, 0, 14.2], GLG = [-40.4, 0, 14], mid = (a, b) => a.map((v, i) => (v + b[i]) / 2);
const R2 = (at, a, b) => [{ u: 0, at, ...a }, { u: 1, at, ease: b.ease || 'smooth', ...b }];
const walkP = (u) => spline(FOOT.map(q => [q[0], 0, q[1]]), .05 + u * .25);
const nightWalk = (u) => [lerp(22, 12, u), 0, lerp(3, -5, u)];
const runP = (u) => [lerp(23, 28.5, u), 0, lerp(2.5, 7.2, u)];
const SH = {
  hook: [{ light: 'room', cam: R2(KHB, { d: 3.6, h: 1.35, lh: 1.08, fov: 34 }, { d: 3.0, h: 1.35, lh: 1.1, fov: 32 }), dof: [14, 'kh'],
    act: (u, f) => ({ kh: { p: KHB, o: { ...KH, skin: '#ffe2c2', arms: 'hands', handWood: u > .35 ? 1 : u * 2, eye: u > .5 ? 'shock' : 'dot', mth: u > .5 ? 'O' : 'dash', brow: u > .5 ? -14 : 0, blink: blinkAt(f, 2), ...idle(f, 2) } }, st: { p: AP(2.3, 1.6) } }) }],
  title: [{ light: 'golden', cam: R2(NMC, { d: 30, h: 22, lh: 2, fov: 46 }, { d: 14, h: 5, lh: 2.4, fov: 40, ease: 'easeOut' }), dof: [0],
    act: () => ({ st: { p: STP }, bird: { p: BIRDP }, st2: { p: NMW(-3.8, 2.2), o: { skin: '#b07a48', wood: 1, arms: 'cheek', hair: 'bun' } }, st3: { p: NMW(4.2, 1.2), o: { wood: 1, arms: 'hang', hair: 'short' } } }) }],
  s1: [{ light: 'golden', cam: R2([-41, 0, 18], { d: 40, yaw: 35, h: 24, lh: 2, fov: 50 }, { d: 26, yaw: 20, h: 10, lh: 1.5, fov: 46 }), dof: [0],
    act: (u, f) => ({ v0: { p: [lerp(-42, -39, u), 0, lerp(17, 20, u)], o: { ...VL[0], step: f / 15 } }, v1: { p: [-37.5, 0, 16.5], o: { ...VL[1], arms: 'point', ...idle(f, 3) } }, v2: { p: [-36.5, 0, 17.2], o: { ...VL[2], mth: 'smile', ...idle(f, 4) } }, v3: { p: [-44, 0, 15], o: { ...VL[3], ...idle(f, 5) } } }) }],
  s2: [{ light: 'golden', cam: R2(NMW(0, 4.5), { d: 15, h: 2.4, lh: 1.4, fov: 44 }, { d: 13, h: 2.1, lh: 1.4, fov: 40 }), dof: [0], until: .55,
    act: (u, f) => { const r = {}; [[-2.6, 4.6], [-1.2, 5.1], [.4, 5.2], [1.8, 4.9], [3.1, 4.4], [-3.6, 3.8]].forEach(([x, z], i) => r['v' + i] = { p: NMW(x, z), o: { ...VL[i % 4], arms: 'cover', ...idle(f, i) } }); r.st = { p: STP }; r.bird = { p: BIRDP }; return r; } },
       { light: 'golden', cam: R2(NMC, { d: 18, h: 3, lh: 2, fov: 40 }, { d: 22, h: 3.5, lh: 2.2, fov: 40 }), dof: [0],
    act: (u, f) => { const r = {}; for (let i = 0; i < 4; i++) { const z = 6 + u * 10 + i * .8; r['v' + i] = { p: NMW(-2 + i * 1.3, z), o: { ...VL[i], step: (f + i * 5) / 15, ...idle(f, i) } }; } r.st = { p: STP }; r.bird = { p: BIRDP }; return r; } }],
  s3: [{ light: 'night', cam: R2(STP, { d: 3.2, yaw: -30, h: 1.0, lh: .6, fov: 32 }, { d: 2.5, yaw: 15, h: .9, lh: .6, fov: 28 }), dof: [7, 'st'],
    act: () => ({ st: { p: STP }, bird: { p: BIRDP }, st2: { p: NMW(-3.8, 2.2), o: { skin: '#b07a48', wood: 1, arms: 'cheek', hair: 'bun' } }, st3: { p: NMW(4.2, 1.2), o: { wood: 1, arms: 'hang', hair: 'short' } } }) }],
  s4: [{ light: 'day', cam: R2(mid(KHG, GLG), { d: 5.2, h: 1.5, lh: 1.2, fov: 38 }, { d: 4.6, h: 1.5, lh: 1.2, fov: 35 }), dof: [5, 'gl'], until: .3,
    act: (u, f) => ({ kh: { p: KHG, o: { ...KH, mth: 'smile', arms: 'reach', eye: 'dot', ...idle(f, 1) } }, gl: { p: GLG, o: { ...GL, mth: 'frown', brow: 8, headTilt: 7 * Math.sin(f * .25), blink: blinkAt(f, 5) } } }) },
       { light: 'day', cam: R2(GLG, { d: 2.4, yaw: -10, h: 1.45, lh: 1.3, fov: 32 }, { d: 2.0, yaw: -10, h: 1.45, lh: 1.32, fov: 30 }), dof: [9, 'gl'], until: .82,
    act: (u, f) => ({ gl: { p: GLG, o: { ...GL, mth: 'talk', open: .5 + .5 * Math.sin(f * .9), brow: 10, blink: blinkAt(f, 5), arms: u > .5 ? 'point' : 'hang', ...idle(f, 5) } } }) },
       { light: 'golden', cam: R2(STP, { d: 1.9, h: .9, lh: .65, fov: 30 }, { d: 1.5, h: .85, lh: .65, fov: 26 }), dof: [9, 'st'],
    act: () => ({ st: { p: STP }, bird: { p: BIRDP } }) }],
  s5: [{ light: 'room', cam: R2(AP(-.3, -.6), { d: 2.2, h: 1.45, lh: 1.35, fov: 32 }, { d: 1.7, h: 1.45, lh: 1.35, fov: 30 }), dof: [8, 'kh'], until: .35,
    act: (u, f) => ({ kh: { p: AP(-.3, -.6), o: { ...KH, mth: 'teeth', eye: 'lid', look: 1, brow: 6, ...idle(f, 1) } } }) },
       { light: 'night', cam: [{ u: 0, at: nightWalk, d: 5.5, yaw: 70, h: 1.9, lh: 1.1, fov: 42 }, { u: 1, at: nightWalk, d: 5, yaw: 50, h: 1.7, lh: 1.1, fov: 40 }], dof: [0],
    act: (u, f) => ({ kh: { p: nightWalk(u), o: { ...KH, arms: 'flash', prop: 'flash', step: f / 14, mth: 'dash' } }, tu: { p: [lerp(23.4, 13.4, u), 0, lerp(4.2, -3.8, u)], o: { ...TU, step: f / 14 + .5, eye: 'side', mth: 'wave', arms: 'flash', prop: 'flash' } } }) }],
  s6: [{ light: 'night', cam: R2(mid(NMW(2.3, 4.0), STP), { d: 3.8, yaw: 25, h: 1.2, lh: .6, fov: 34 }, { d: 3.3, yaw: 20, h: 1.1, lh: .6, fov: 30 }), dof: [6, 'st'], until: .45,
    act: (u, f) => ({ khC: { p: NMW(2.3, 4.0), o: { kind: 'person', shirt: '#c9b48a', pants: '#3a3a48', hair: 'short', peek: 1, shake: 1, t: f / 30 } }, st: { p: STP } }) },
       { light: 'night', cam: R2(TUP, { d: 2.6, yaw: -20, h: 1.45, lh: 1.25, fov: 32 }, { d: 2.1, yaw: -20, h: 1.45, lh: 1.25, fov: 28 }), dof: [7, 'tu'],
    act: (u, f) => ({ tu: { p: TUP, o: { ...TU, arms: 'pocket', prop: u < .6 ? 'bird' : null, eye: 'side', look: -1, mth: 'smile', ...idle(f, 3) } } }) }],
  s7: [{ light: 'room', cam: R2(AP(1.3, -.8), { d: 2.3, h: 1.45, lh: 1.3, fov: 32 }, { d: 1.8, h: 1.45, lh: 1.25, fov: 28 }), dof: [9, 'kh'], until: .62,
    act: (u, f) => ({ kh: { p: AP(1.3, -.8), o: { ...KH, arms: 'hands', handWood: u, eye: u > .5 ? 'shock' : 'dot', mth: u > .5 ? 'frown' : 'dash', brow: -6, ...idle(f, 2) } } }) },
       { light: 'room', cam: R2(AP(-.8, -.4), { d: 2.3, h: 1.45, lh: 1.3, fov: 34 }, { d: 1.9, h: 1.45, lh: 1.3, fov: 30 }), dof: [9, 'tu'],
    act: (u, f) => ({ tu: { p: AP(-.8, -.4), o: { ...TU, arms: 'hands', handWood: .6, eye: 'lid', mth: 'wave', brow: -8, ...idle(f, 3) } } }) }],
  s8: [{ light: 'room', cam: R2(AP(-1.2, -.8), { d: 1.7, yaw: -90, h: 1.55, lh: 1.5, fov: 30 }, { d: 1.35, yaw: -90, h: 1.55, lh: 1.52, fov: 24, roll: 3 }), dof: [9, 'kh'], mirror: true, kick: .62,
    act: (u, f) => ({ kh: { p: AP(-1.2, -.8), o: { ...KH, carve: M_.smooth((u - .35) / .4), eye: u > .55 ? 'shock' : 'dot', mth: u > .55 ? 'O' : 'dash', brow: u > .55 ? -16 : 0, blink: blinkAt(f, 2) } } }) }],
  s9: [{ light: 'room', cam: R2(AP(1.0, -.6), { d: 2.6, h: 1.5, lh: 1.3, fov: 34 }, { d: 2.2, h: 1.5, lh: 1.3, fov: 32 }), dof: [6, 'kh'], until: .28,
    act: (u, f) => ({ kh: { p: AP(1.0, -.6), o: { ...KH, arms: 'point', carve: .7, eye: 'squeeze', mth: 'teeth', brow: 12, ...idle(f, 2) } }, st: { p: AP(2.3, 1.6) } }) },
       { light: 'golden', truck: u => spline(ROAD.map(p => [p[0], 0, p[1]]), M_.smooth(.15 + u * .85)), camFollow: [-8, 3.6, 6.5], dof: [0], until: .8,
    act: () => ({ st: { inTruck: [0, .9, 1.4], scale: .6 } }) },
       { light: 'golden', cam: R2([32, 0, 10], { d: 9, yaw: 70, h: 2, lh: 1, fov: 40 }, { d: 7.5, yaw: 60, h: 1.7, lh: 1, fov: 36 }), dof: [0],
    act: () => ({ st: { inTruck: [0, .9, 1.4], scale: .6 } }) }],
  s10: [{ light: 'night', cam: [{ u: 0, at: walkP, d: 4.6, yaw: 60, h: 1.9, lh: 1.5, fov: 40 }, { u: 1, at: walkP, d: 4.2, yaw: 40, h: 1.8, lh: 1.5, fov: 40 }], dof: [0], until: .55,
    act: (u, f) => { const p = walkP(u); return { kh: { p, o: { ...KH, arms: 'carry', step: f / 16, eye: 'squeeze', mth: 'teeth', handWood: .8 } }, st: { p: [p[0], 1.45, p[2]], scale: .7, carried: true } }; } },
        { light: 'night', cam: [{ u: 0, pos: TW(-1.6, 2.6, -3.4), look: TW(-.4, 1.7, -1.0), fov: 34 }, { u: 1, pos: TW(-1.4, 2.5, -3.0), look: TW(-.4, 1.7, -1.0), fov: 30 }], dof: [5, 'tu'],
    act: (u, f) => ({ tu: { p: TW(-.4, .5, -1.0), o: { ...TU, arms: 'pocket', prop: 'bird', handWood: .7, eye: 'side', look: 1, mth: 'wave', brow: -10, ...idle(f, 3) } } }) }],
  s11: [{ light: 'night', cam: R2(mid(KHP, STP), { d: 5.2, yaw: 0, h: 1.5, lh: .9, fov: 38 }, { d: 4.6, yaw: 0, h: 1.45, lh: .9, fov: 34 }), dof: [5, 'kh'],
    act: (u, f) => ({ kh: { p: KHP, o: { ...KH, arms: 'hoe', prop: 'hoe', handWood: 1, eye: 'squeeze', mth: 'teeth', tilt: 6 * Math.sin(f * .35), brow: 10 } }, st: { p: STP, rise: M_.smooth(u * 1.4) } }) }],
  s12: [{ light: 'night', cam: R2(KHP, { d: 2.6, h: 1.45, lh: 1.3, fov: 34 }, { d: 1.9, h: 1.45, lh: 1.3, fov: 28, roll: -4, ease: 'easeOut' }), dof: [8, 'kh'], kick: .55,
    act: (u, f) => ({ kh: { p: KHP, o: { ...KH, arms: u > .5 ? 'cheek' : 'hoe', prop: u > .5 ? null : 'hoe', handWood: 1, eye: u > .5 ? 'shock' : 'dot', mth: u > .5 ? 'O' : 'dash', brow: -16 } }, st: { p: STP } }) }],
  s13: [{ light: 'night', cam: R2(mid(KHP, STP), { d: 5.6, h: 1.1, lh: .55, fov: 34 }, { d: 4.8, h: 1.0, lh: .55, fov: 30 }), dof: [5, 'khC'],
    act: () => ({ khC: { p: KHP, o: { kind: 'person', shirt: '#c9b48a', pants: '#3a3a48', hair: 'short', skin: '#c99a6a' } }, st: { p: STP } }) }],
  s14: [{ light: 'night', cam: R2(mid(KHP, DEADP), { d: 5.6, h: 1.0, lh: .6, fov: 34 }, { d: 4.8, h: 1.0, lh: .6, fov: 30 }), dof: [4, 'khC'], until: .45,
    act: (u, f) => ({ khC: { p: KHP, o: { kind: 'person', shirt: '#c9b48a', pants: '#3a3a48', hair: 'short', skin: '#c99a6a', shake: u > .5 ? 1 : 0, t: f / 30 } }, st: { p: STP }, dead: { p: DEADP, o: { reach: M_.smooth(u), scream: 0, headTilt: Math.floor(f / 4) % 2 ? 8 : -3 }, pop: true } }) },
        { light: 'night', cam: R2(DEADP, { d: 2.6, yaw: 10, h: .95, lh: .75, fov: 30 }, { d: 2.0, yaw: 10, h: .95, lh: .78, fov: 26, roll: 4 }), dof: [6, 'dead'], kick: .05,
    act: (u, f) => ({ dead: { p: DEADP, o: { reach: 1, scream: M_.smooth(u * 2), headTilt: Math.floor(f / 3) % 2 ? 10 : -4 } }, khC: { p: KHP, o: { kind: 'person', shirt: '#c9b48a', pants: '#3a3a48', hair: 'short', skin: '#c99a6a', shake: 1, t: f / 30 } } }) }],
  s15: [{ light: 'night', lightTo: ['dawn', .6], cam: R2(NMW(1.6, 3.5), { d: 8, h: 3, lh: .8, fov: 40 }, { d: 14, h: 7, lh: .8, fov: 42 }), dof: [0],
    act: (u, f) => ({ khC: { p: KHP, o: { kind: 'person', shirt: '#c9b48a', pants: '#3a3a48', hair: 'short', skin: '#c99a6a', shake: u < .5 ? 1 : 0, t: f / 30 } }, st: { p: STP }, dead: { p: DEADP, o: { reach: 1 - u }, fade: 1 - M_.smooth((u - .3) / .5) } }) }],
  s16: [{ light: 'dawn', cam: R2(KHP, { d: 2.4, h: 1.45, lh: 1.3, fov: 32 }, { d: 2.0, h: 1.45, lh: 1.3, fov: 28 }), dof: [7, 'kh'],
    act: (u, f) => ({ kh: { p: KHP, o: { ...KH, arms: u < .3 ? 'cover' : 'hands', handWood: .35, eye: 'lid', mth: 'frown', brow: -8, blink: blinkAt(f, 2) } }, st: { p: STP } }) }],
  s17: [{ light: 'dawn', cam: [{ u: 0, at: runP, d: 5, yaw: 150, h: 1.7, lh: 1.1, fov: 40 }, { u: 1, at: runP, d: 4.5, yaw: 130, h: 1.6, lh: 1.1, fov: 38 }], dof: [0], until: .4,
    act: (u, f) => ({ kh: { p: runP(u), o: { ...KH, step: f / 9, eye: 'shock', mth: 'O', brow: -14 } } }) },
        { light: 'dawn', cam: [{ u: 0, pos: TW(-2.2, 2.3, -3.4), look: TW(-.45, 1.85, -.75), fov: 32 }, { u: 1, pos: TW(-1.9, 2.2, -2.9), look: TW(-.45, 1.85, -.75), fov: 26, roll: -3, ease: 'easeOut' }], dof: [5, 'tuW'], kick: .1, noBody: true,
    act: () => ({ tuW: { p: TW(-.45, 1.32, -.75) } }) }],
  s18: [{ light: 'dawn', cam: [{ u: 0, pos: TW(-.9, 2.0, -2.8), look: TW(-.3, 1.55, -1.2), fov: 28 }, { u: 1, pos: TW(-.75, 1.95, -2.5), look: TW(-.3, 1.55, -1.2), fov: 22 }], dof: [6, 'bird'], noBody: true,
    act: () => ({ tuW: { p: TW(-.45, 1.32, -.75) }, bird: { p: TW(-.2, 1.32, -1.25), scale: .38 } }) }],
  end: [{ light: 'golden', cam: [{ u: 0, at: u => NMW(2.4, lerp(9, 5.2, M_.smooth(u * 1.2)) + .6), d: 7, yaw: 30, h: 2.5, lh: 1.2, fov: 40 }, { u: 1, at: u => NMW(2.4, lerp(9, 5.2, M_.smooth(u * 1.2)) + .6), d: 6.5, yaw: 20, h: 2.2, lh: 1.2, fov: 40 }], dof: [0], until: .6,
    act: (u, f) => { const r = {}; const z = lerp(9, 5.2, M_.smooth(u * 1.2)); [[1.4, 0], [3.4, 0], [1.4, 1.3], [3.4, 1.3]].forEach(([x, dz], i) => r['v' + i] = { p: NMW(x, z + dz), o: { ...VL[i], arms: 'cover', step: f / 16 + i * .25 } }); r.tuW = { p: NMW(2.4, z + .6), y: .9 }; r.st = { p: STP }; r.bird = { p: BIRDP }; return r; } },
       { light: 'golden', cam: [{ u: 0, at: u => [lerp(44, 54, u), 0, lerp(24, 32, u)], d: 8, yaw: -60, h: 2.5, lh: 1.2, fov: 42 }, { u: 1, at: u => [lerp(44, 54, u), 0, lerp(24, 32, u)], d: 10, yaw: -70, h: 3, lh: 1.2, fov: 42 }], dof: [0],
    act: (u, f) => ({ kh: { p: [lerp(44, 54, u), 0, lerp(24, 32, u)], o: { ...KH, step: f / 16, eye: 'lid', mth: 'frown', handWood: .35 } } }) }],
  cta: [{ light: 'night', cam: R2(mid(NMW(2.0, 3.9), STP), { d: 4.2, yaw: 15, h: 1.2, lh: .6, fov: 34 }, { d: 3.4, yaw: 10, h: 1.1, lh: .6, fov: 30 }), dof: [5, 'tuW'],
    act: () => ({ st: { p: STP }, tuW: { p: NMW(2.0, 3.9) }, bird: { p: NMW(1.6, 4.3), scale: .45 } }) }],
};
// ================= frame evaluation =================
const CARDKEY = { kh: C.kh, khC: C.khC, tu: C.tu, tuW: C.tuW, gl: C.gl, st: C.st, bird: C.bird, st2: C.st2, st3: C.st3, dead: C.dead };
C.v.forEach((c, i) => CARDKEY['v' + i] = c);
const DEF = { st: { kind: 'statue' }, tuW: { kind: 'statue', cap: 1, patch: '#c8583a' }, khC: { kind: 'person' }, bird: {}, dead: {}, st2: { wood: 1, arms: 'cheek', hair: 'bun' }, st3: { wood: 1, hair: 'short' } };
let curLight = '';
function applyLight(k) { if (k === curLight) return; curLight = k; const p = PRE[k];
  sun.color.set(p.sun); sun.intensity = p.si; hemi.color.set(p.hs); hemi.groundColor.set(p.hg); hemi.intensity = p.hi;
  skyM.uniforms.top.value.set(p.top); skyM.uniforms.hor.value.set(p.hor); skyM.uniforms.disc.value.set(p.disc);
  const az = p.az * Math.PI / 180, el = p.el * Math.PI / 180; skyM.uniforms.sun.value.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
  S.fog.color.set(p.hor); S.fog.near = p.fog[0]; S.fog.far = p.fog[1]; APTLAMP.intensity = k === 'room' ? 4 : 0;
  ink.m.uniforms.gain.value.set(p.gain); ink.m.uniforms.lift.value.set(p.lift); ink.m.uniforms.sat.value = p.sat; ink.m.uniforms.vig.value = p.vig;
  for (const c of ALL) c.m.material.color.set(c === C.dead ? '#d6e6f0' : p.tint); for (const c of clouds) c.material.color.set(p.cloud);
  for (const h of HEAD) h.visible = k === 'night'; }
const fix = (v, y) => (v[1] === 0 ? [v[0], y, v[2]] : v);
function pick(k, u) { const L = SH[k]; let a = 0; for (let i = 0; i < L.length; i++) { const b = L[i].until ?? 1; if (u < b || i === L.length - 1) return { sh: L[i], uu: clamp((u - a) / (b - a)), i, a, b }; a = b; } }
function camEval(sh, uu, fShot) {
  let c; const K = sh.cam;
  const relK = (k, uu) => { if (!k.at) return k; const at = typeof k.at === 'function' ? k.at(uu) : k.at; const y = (k.yaw || 0) * Math.PI / 180; return { ...k, pos: [at[0] + Math.sin(y) * k.d, (at[1] || 0) + k.h, at[2] + Math.cos(y) * k.d], look: [at[0], (at[1] || 0) + k.lh, at[2]] }; };
  if (K) { const a = relK(K[0], uu), b = relK(K[K.length - 1], uu), t = (M_[b.ease || 'smooth'])(uu);
    c = { pos: lerp3(a.at ? a.pos : fix(a.pos, a.y ?? 1.5), b.at ? b.pos : fix(b.pos, b.y ?? 1.5), t), look: lerp3(a.at ? a.look : fix(a.look, 1.2), b.at ? b.look : fix(b.look, 1.2), t), fov: lerp(a.fov, b.fov, t), roll: lerp(a.roll || 0, b.roll || 0, t) }; }
  c.fov *= 1 - .00012 * fShot;
  if (sh.kick !== undefined) { const d = fShot - Math.round(sh.kick * sh._len); if (d >= 0 && d < 7) { const s = (d % 2 ? -1 : 1) * .06 * (1 - d / 7); c.look = [c.look[0] + s * 3, c.look[1] + s * 2, c.look[2]]; c.roll += s * 20; } }
  return c; }
let LAST = null;
function frame(t) {
  const f = Math.round(t * FPS); const k = lineAt(t); const [la, lb] = TL[k]; const u = clamp((t - la) / (lb - la)); const P = pick(k, u), sh = P.sh, uu = P.uu;
  sh._len = Math.max(1, Math.round((lb - la) * (P.b - P.a) * FPS)); const fShot = Math.round((t - la - (lb - la) * P.a) * FPS);
  applyLight(sh.lightTo && uu > sh.lightTo[1] ? sh.lightTo[0] : sh.light);
  // truck
  if (sh.truck) { const p = sh.truck(uu), p2 = sh.truck(Math.min(1, uu + .01)); TRUCK.position.set(p[0], Math.abs(Math.sin(f * .9)) * .03, p[2]); TRUCK.rotation.y = Math.atan2(-(p2[0] - p[0]), -(p2[2] - p[2])) || TRUCK.rotation.y; }
  else { TRUCK.position.set(32, 0, 10); TRUCK.rotation.y = .93; }
  TRUCK.children.forEach(c => { c.visible = !sh.noBody || !!c.userData.seat; }); TRUCK.updateMatrixWorld(true);
  let c;
  if (sh.camFollow) { const o = new THREE.Vector3(...sh.camFollow).applyAxisAngle(new THREE.Vector3(0, 1, 0), TRUCK.rotation.y); c = { pos: TRUCK.position.clone().add(o).toArray(), look: [TRUCK.position.x, 1.2, TRUCK.position.z], fov: 42, roll: 0 }; }
  else c = camEval(sh, uu, fShot);
  cam.position.set(...c.pos); cam.up.set(0, 1, 0); cam.lookAt(...c.look); cam.rotateZ(c.roll * Math.PI / 180); cam.fov = c.fov; cam.updateProjectionMatrix(); sky.position.copy(cam.position);
  // mist faces the camera; cloth flutters
  for (const m of MISTS) { m.quaternion.copy(cam.quaternion); m.material.opacity = 0; m.visible = false; m.material.color.set(curLight === 'night' ? '#9fb2d6' : '#ffe0c0'); }
  if (window.CLOTH) { const pa = CLOTH.geometry.attributes.position; for (let i = 0; i < pa.count; i++) { const y = pa.getY(i); pa.setZ(i, Math.sin(f * .18 + y * 3) * .08 * (.7 - y)); } pa.needsUpdate = true; }
  // actors
  for (const cd of ALL) { cd.m.visible = false; cd.blob.visible = false; cd.m.scale.setScalar(1); }
  const A = sh.act(uu, f); const ki = ORDER.indexOf(k); STUMP.visible = ki >= ORDER.indexOf('s6') && ki < ORDER.indexOf('s11') && !(k === 's6' && P.i === 0 && uu < .8);
  for (const [name, a] of Object.entries(A)) { const cd = CARDKEY[name]; if (!cd || a.vis === false) continue;
    let p = a.inTruck ? TW(...a.inTruck) : a.p.slice(); if (a.y !== undefined) p[1] = a.y; if (a.rise !== undefined) p[1] = -1.0 * (1 - a.rise);
    cd.set({ ...(DEF[name] || {}), ...(a.o || {}) }); cd.m.position.set(...p); cd.m.visible = true;
    let sc = a.scale ?? 1; if (a.pop) sc *= M_.back(clamp(fShot / 6), 2.2); cd.m.scale.setScalar(Math.max(.001, sc));
    if (cd === C.dead) cd.m.material.opacity = .7 * (a.fade ?? 1) * (f % 19 < 2 ? .55 : 1);
    if (p[1] < .05 && !a.carried && cd !== C.dead) { cd.blob.visible = true; cd.blob.position.set(p[0], .02, p[2]); }
    cd.m.rotation.y = Math.atan2(cam.position.x - p[0], cam.position.z - p[2]); }
  // sun + shadow camera centred on the action
  const tgt = new THREE.Vector3(...c.look); const pr = PRE[curLight], az = pr.az * Math.PI / 180, el = pr.el * Math.PI / 180;
  sun.target.position.copy(tgt); sun.position.set(tgt.x + Math.sin(az) * Math.cos(el) * 70, tgt.y + Math.sin(el) * 70, tgt.z - Math.cos(az) * Math.cos(el) * 70);
  const ext = Math.min(40, Math.max(8, cam.position.distanceTo(tgt) * .9)); Object.assign(sun.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 1, far: 220 }); sun.shadow.camera.updateProjectionMatrix();
  // passes
  R.setRenderTarget(rtC); R.render(S, cam);
  const saved = []; S.traverse(o => { if (!o.isMesh) return; saved.push([o, o.material, o.visible]);
    if (o.userData.sky || o.userData.blob || o.userData.cloud || o.userData.noink || o.userData.ghost) o.visible = false;
    else if (o.userData.card) { if (!cardND.has(o)) cardND.set(o, cardNDMat(o.material.map)); const m = cardND.get(o); m.uniforms.map.value = o.material.map; o.material = m; }
    else o.material = ndM; });
  const fog = S.fog; S.fog = null; R.setClearColor(0x000000, 0); R.setRenderTarget(rtN); R.clear(); R.render(S, cam); S.fog = fog;
  for (const [o, m, v] of saved) { o.material = m; o.visible = v; }
  const fl = (k === 'title' && fShot < 6) ? 1 - fShot / 6 : 0; ink.m.uniforms.flash.value = fl;
  R.setRenderTarget(rtI); R.render(ink.sc, fsCam);
  const tg = sh.dof && sh.dof[1] ? CARDKEY[sh.dof[1]] : null; dof.m.uniforms.focus.value = tg ? cam.position.distanceTo(tg.m.position.clone().add(new THREE.Vector3(0, .9 * tg.m.scale.y, 0))) : 10; dof.m.uniforms.cinf.value = sh.dof ? sh.dof[0] || 0 : 0;
  R.setRenderTarget(null); R.render(dof.sc, fsCam);
  overlay(t, k, u, sh, uu);
}
const fsCam = new THREE.Camera();
// ================= 2D overlay: title, captions, mirror frame, disclaimer =================
const OV = document.getElementById('o'), og = OV.getContext('2d');
const TXT = window.TEXTS || {};
const CHUNKS = {};
for (const k of ORDER) { const s = TXT[k]; if (!s || k === 'title') continue; const w = s.split(/\s+/); const ch = []; let cur = [];
  for (const x of w) { cur.push(x); if (cur.length >= 3 || /[.,!?…]$/.test(x)) { ch.push(cur.join(' ')); cur = []; } } if (cur.length) ch.push(cur.join(' ')); CHUNKS[k] = ch; }
function chunkAt(k, t) { const ch = CHUNKS[k]; if (!ch) return null; const [a, b] = TL[k];
  const V = (window.VOX && window.VOX[k]) || [(window.SPEECH && window.SPEECH[k]) || [a + .05, b - .25]]; const tot = V.reduce((s, v) => s + v[1] - v[0], 0);
  let el = 0; for (const v of V) { if (t < v[0]) break; el += Math.min(t, v[1]) - v[0]; } if (t < V[0][0] || t > V[V.length - 1][1] + .35) return null;
  const W_ = ch.map(x => x.length + 6), S_ = W_.reduce((s, x) => s + x, 0); let acc = 0; for (let i = 0; i < ch.length; i++) { acc += W_[i] / S_ * tot; if (el <= acc + 1e-6) return ch[i]; } return ch[ch.length - 1]; }
function stroke(txt, x, y, size, fill = '#ffffff', w = 14, font = '900') { og.font = `${font} ${size}px "DejaVu Sans"`; og.textAlign = 'center'; og.lineJoin = 'round'; og.lineWidth = w; og.strokeStyle = '#000'; og.strokeText(txt, x, y); og.fillStyle = fill; og.fillText(txt, x, y); }
function overlay(t, k, u, sh, uu) {
  og.clearRect(0, 0, W, H);
  if (sh.mirror) { og.save(); og.strokeStyle = '#3a2a22'; og.lineWidth = 70; og.strokeRect(35, 35, W - 70, H - 70); og.strokeStyle = '#7a5a3e'; og.lineWidth = 14; og.strokeRect(70, 70, W - 140, H - 140); og.restore(); }
  if (k === 'title') { const lt = t - TL.title[0], d = TL.title[1] - TL.title[0]; const a = Math.min(clamp(lt / .25), clamp((d - lt) / .35)); const sc = M_.back(clamp(lt / .5), 1.4);
    og.save(); og.globalAlpha = a; og.translate(W / 2, H * .42); og.scale(sc, sc); og.shadowColor = 'rgba(255,90,60,.9)'; og.shadowBlur = 40;
    for (const [s, y, sz] of [['TƯỢNG', -40, 190], ['NHÀ MỒ', 150, 190]]) { og.font = `900 ${sz}px "DejaVu Serif"`; const tw = og.measureText(s).width; const fs = Math.min(sz, sz * 900 / tw); og.font = `900 ${fs}px "DejaVu Serif"`; og.textAlign = 'center'; og.lineJoin = 'round'; og.lineWidth = 22; og.strokeStyle = '#120806'; og.strokeText(s, 0, y); og.fillStyle = '#f6e8d4'; og.fillText(s, 0, y); }
    og.shadowBlur = 0; og.font = 'italic bold 50px "DejaVu Serif"'; og.globalAlpha = a * clamp((lt - .5) / .4); og.lineWidth = 10; og.strokeStyle = '#000'; og.strokeText('Đừng lấy gì của người chết', 0, 280); og.fillStyle = '#f0c8b8'; og.fillText('Đừng lấy gì của người chết', 0, 280); og.restore(); return; }
  const c = chunkAt(k, t); if (c) stroke(c.toUpperCase(), W / 2, H * .66, 84, k === 'hook' ? '#ffe9a8' : '#ffffff', 18);
  if (k === 'cta') { og.save(); og.globalAlpha = .55 * clamp((t - TL.cta[0]) / .6); og.font = 'italic 34px "DejaVu Sans"'; og.textAlign = 'center'; og.fillStyle = '#ffffff'; og.fillText('Câu chuyện chỉ là hư cấu', W / 2, H - 120); og.restore(); }
}
window.draw = t => { frame(t); };
window.renderFrame = f => frame(f / FPS);
(async () => {
  if (!TL) { try { const r = await fetch('tl.json'); if (r.ok) { const j = await r.json(); TL = j.TL; window.SPEECH = j.SPEECH; window.VOX = j.VOX; window.DUR = j.dur; const B = j.BEAT || {}; const fr = k => (B[k] - TL[k][0]) / (TL[k][1] - TL[k][0]); if (B.s8) SH.s8[0].kick = fr('s8'); if (B.s14) SH.s14[0].until = fr('s14'); if (B.s17) SH.s17[0].until = fr('s17'); } } catch (e) {} }
  if (!TL) TL = fakeTL(TXT);
  window.TLX = TL; window.DUR = window.DUR || TL._end || TL.cta[1] + 1; await document.fonts.ready; window.READY = true; window.ready = true; })();
window.C = C; window.camObj = cam;
