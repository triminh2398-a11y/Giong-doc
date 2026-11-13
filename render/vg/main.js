// "Vũng giữ xác" — 2.5D: three.js river sets + the 2D rig characters drawn into cards every frame.
import * as THREE from 'three';
import { Water } from './Water.js';
const TLD = window.TLD, BEAT = TLD.beat;
const RW = 720, RH = 1280;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); renderer.setPixelRatio(1); renderer.setSize(RW, RH);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25; renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);
const ov = document.createElement('canvas'); ov.width = RW; ov.height = RH; document.body.appendChild(ov); const g2 = ov.getContext('2d');
const cam = new THREE.PerspectiveCamera(40, RW / RH, 0.05, 900); cam.layers.enable(1);
const R = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, t) => a + (b - a) * t, sm = t => { t = clamp(t); return t * t * (3 - 2 * t); }, seg = (t, a, b) => clamp((t - a) / (b - a));
function ctex(w, h, fn, rep) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } t.anisotropy = 8; return t; }
const M = o => new THREE.MeshStandardMaterial(Object.assign({ roughness: .92, metalness: 0 }, o));
const cutM = (t, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ map: t, transparent: true, alphaTest: .4, side: THREE.DoubleSide, roughness: 1 }, o));
function boxIn(par, w, h, d, m, x, y, z, cast = true) { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = cast; b.receiveShadow = true; par.add(b); return b; }
const glowT = ctex(64, 64, g => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });
const mistT = ctex(128, 64, (g) => { const r = g.createRadialGradient(64, 32, 0, 64, 32, 60); r.addColorStop(0, 'rgba(255,255,255,.9)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.save(); g.scale(1, .5); g.fillRect(0, 0, 128, 128); g.restore(); });
const hsh = (x, y) => { const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return v - Math.floor(v); };
const vn = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); return lerp(lerp(hsh(xi, yi), hsh(xi + 1, yi), u), lerp(hsh(xi, yi + 1), hsh(xi + 1, yi + 1), u), v); };
const fbm = (x, y) => { let a = 0, f = 1, w = .5; for (let k = 0; k < 5; k++) { a += w * vn(x * f, y * f); f *= 2.03; w *= .5; } return a; };
const ss = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

// =============================== the river: still cove in the middle, the bến on the near bank, mountains on the far bank ===============================
const ext = new THREE.Scene(); ext.fog = new THREE.Fog(0x2a3450, 30, 380);
const skyC = { night: ['#04070f', '#141c34', '#243052'], dawn: ['#1c2540', '#4a546c', '#646e84'], rain: ['#2a3040', '#4a5262', '#6a7280'], day: ['#7a9cc0', '#a8bcd0', '#d0d0c8'] };
const SKY = {}; for (const k in skyC) SKY[k] = ctex(16, 512, (g, w, h) => { const q = g.createLinearGradient(0, 0, 0, h); q.addColorStop(0, skyC[k][0]); q.addColorStop(.55, skyC[k][1]); q.addColorStop(1, skyC[k][2]); g.fillStyle = q; g.fillRect(0, 0, w, h); });
// river runs along x; water from z=-28 to z=+24; near bank (bến, houses) z>24; far bank rises into mountains z<-28
function terrH(x, z) { const wig = 3 * Math.sin(x * .03) + 2 * fbm(x * .02, 1); const zn = z - wig;
  if (zn > 22) { const u = ss(22, 30, zn); return lerp(-1.5, .4, u) + u * (2.2 * fbm(x * .05, z * .05) + ss(60, 140, zn) * (30 + 50 * fbm(x * .01 + 4, z * .01))); }
  if (zn < -26) { const d = -26 - zn; return lerp(-1.5, 0, ss(0, 4, d)) + ss(2, 70, d) * (20 + 60 * fbm(x * .012, z * .012)) + ss(40, 160, d) * 70 * fbm(x * .006 + 2, z * .006); }
  return -1.6; }
function terrCol(x, z, h) { const n = fbm(x * .08, z * .08); if (h < .2) return [.30 + .05 * n, .26 + .04 * n, .19]; let c = [.17 + .07 * n, .30 + .1 * n, .14]; const far = ss(60, 220, Math.abs(z)); return [lerp(c[0], .14, far), lerp(c[1], .18, far), lerp(c[2], .26, far)]; }
const grassT = ctex(512, 512, (g, w, h) => { g.fillStyle = '#c8c8c8'; g.fillRect(0, 0, w, h); for (let k = 0; k < 9000; k++) { const v = 150 + R(k) * 105 | 0; g.strokeStyle = `rgb(${v},${v},${v})`; g.lineWidth = 1.5; const x = R(k * 3) * w, y = R(k * 7) * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (R(k) - .5) * 4, y - 4 - R(k + 2) * 7); g.stroke(); } }, [110, 110]);
{ const geo = new THREE.PlaneGeometry(700, 700, 260, 260); geo.rotateX(-Math.PI / 2); const p = geo.attributes.position, col = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), h = terrH(x, z); p.setY(i, h); col.set(terrCol(x, z, h), i * 3); }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.computeVertexNormals(); const m = new THREE.Mesh(geo, M({ map: grassT, vertexColors: true })); m.receiveShadow = true; m.castShadow = true; ext.add(m); }
const waterNormals = new THREE.TextureLoader().load('tex/waternormals.jpg', t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; });
const WATER = new Water(new THREE.PlaneGeometry(700, 700), { textureWidth: 1024, textureHeight: 1024, waterNormals, sunDirection: new THREE.Vector3(-.3, .8, -.5).normalize(), sunColor: 0x9ab0e0, waterColor: 0x0c1a22, distortionScale: 1.1, fog: true });
WATER.rotation.x = -Math.PI / 2; WATER.position.y = 0; ext.add(WATER);
// rocks ringing the cove, the half-sunk shrine
const rockM = M({ color: 0x4a4a46, roughness: 1, flatShading: true });
for (let k = 0; k < 26; k++) { const a = k / 26 * Math.PI * 2, r = 11 + R(k) * 3; const x = Math.cos(a) * r * 1.4, z = Math.sin(a) * r - 2; if (z > 14) continue; const s = .5 + R(k + 3) * 1.4; const m = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), rockM); m.position.set(x, -.2 + s * .3, z); m.rotation.set(R(k), R(k + 1) * 3, 0); m.castShadow = m.receiveShadow = true; ext.add(m); }
const woodT = ctex(256, 256, (g, w, h) => { g.fillStyle = '#5a4430'; g.fillRect(0, 0, w, h); for (let k = 0; k < 14; k++) { g.fillStyle = k % 2 ? '#4e3a28' : '#634a34'; g.fillRect(0, k * h / 14, w, h / 14 - 2); } for (let k = 0; k < 80; k++) { g.strokeStyle = 'rgba(30,20,10,.35)'; g.beginPath(); const y = R(k) * h; g.moveTo(0, y); g.lineTo(w, y + (R(k + 1) - .5) * 6); g.stroke(); } }, [2, 2]);
const weaveT = ctex(256, 256, (g, w, h) => { g.fillStyle = '#8a7048'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) for (let x = 0; x < w; x += 16) { const o = ((x + y) / 16) % 2; g.fillStyle = o ? '#9a7e52' : '#76603c'; g.fillRect(x + 1, y + 1, 14, 14); } g.fillStyle = 'rgba(30,20,10,.22)'; g.fillRect(0, 0, w, h); }, [3, 2]);
const thatchT = ctex(256, 256, (g, w, h) => { g.fillStyle = '#6a5c40'; g.fillRect(0, 0, w, h); for (let k = 0; k < 500; k++) { g.strokeStyle = `rgba(${R(k) > .5 ? 140 : 40},${R(k) > .5 ? 120 : 32},${R(k) > .5 ? 80 : 18},.55)`; g.lineWidth = 2; const x = R(k * 3) * w, y = R(k * 5) * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (R(k) - .5) * 6, y + 30); g.stroke(); } });
const postM = M({ color: 0x3a2c1e }), plankM = M({ map: woodT }), wallM = M({ map: weaveT }), roofM = M({ map: thatchT, side: THREE.DoubleSide });
const SHRINE = new THREE.Group(); SHRINE.position.set(9, -.55, -5); SHRINE.rotation.set(.08, -.5, .12); ext.add(SHRINE);
{ const stM = M({ color: 0x7a746a, roughness: 1 }); boxIn(SHRINE, 1.3, 1.4, 1.1, stM, 0, .7, 0); const rf = new THREE.Mesh(new THREE.ConeGeometry(1.1, .7, 4), M({ color: 0x5a3a2a })); rf.rotation.y = Math.PI / 4; rf.position.y = 1.75; rf.castShadow = true; SHRINE.add(rf);
  boxIn(SHRINE, .7, .55, .05, M({ color: 0x1a1210 }), 0, .95, .56); const bowl = new THREE.Mesh(new THREE.CylinderGeometry(.14, .1, .12, 12), M({ color: 0x8a8070 })); bowl.position.set(0, 1.46, .4); SHRINE.add(bowl); }
const INC = []; for (let k = 0; k < 3; k++) { const s = new THREE.Mesh(new THREE.CylinderGeometry(.008, .008, .32, 4), M({ color: 0xc04030, emissive: 0x401008 })); s.position.set(-.04 + k * .04, 1.62, .4); SHRINE.add(s); const e = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, color: 0xff7030, transparent: true, depthWrite: false })); e.scale.setScalar(.12); e.position.set(-.04 + k * .04, 1.78, .4); SHRINE.add(e); INC.push(e); }
const SMOKE = []; for (let i = 0; i < 10; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, color: 0xd8d8e0, transparent: true, opacity: 0, depthWrite: false })); ext.add(s); SMOKE.push(s); }
// the bến: a plank pier into the water, posts, lanterns, moored boats
const PIER = new THREE.Group(); PIER.position.set(-7, 0, 0); ext.add(PIER);
for (let z = 26; z > 13; z -= .5) { const b = new THREE.Mesh(new THREE.BoxGeometry(2.6, .1, .45), plankM); b.position.set(R(z) * .05, .55, z); b.rotation.y = (R(z * 3) - .5) * .03; b.castShadow = b.receiveShadow = true; PIER.add(b); }
for (let z = 26; z > 13; z -= 2.2) for (const x of [-1.25, 1.25]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.09, .1, 2.6, 7), postM); p.position.set(x, -.6, z); p.castShadow = true; PIER.add(p); }
const LAMPS = []; for (const [x, z] of [[-1.3, 14], [1.3, 20]]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 1.6, 6), postM); p.position.set(x, 1.3, z); PIER.add(p); const l = new THREE.Mesh(new THREE.BoxGeometry(.22, .3, .22), new THREE.MeshStandardMaterial({ color: 0x402010, emissive: 0xffa040, emissiveIntensity: 2 })); l.position.set(x, 2.15, z); PIER.add(l); const pl = new THREE.PointLight(0xffa050, 6, 9, 1.6); pl.position.set(x, 2.1, z); PIER.add(pl); LAMPS.push([l, pl]); }
// boat (ghe): lofted hull
function hullGeo(L = 5.6, W = 1.25, H = .55) { const nl = 24, nr = 10, pos = [], idx = [];
  for (let i = 0; i <= nl; i++) { const u = i / nl * 2 - 1, wv = W / 2 * Math.pow(1 - Math.pow(Math.abs(u), 2.4), .55), sheer = H + .25 * Math.pow(Math.abs(u), 3);
    for (let j = 0; j <= nr; j++) { const v = j / nr * Math.PI; const x = Math.cos(v) * wv, y = sheer - Math.sin(v) * H * (1 - .3 * Math.abs(u)); pos.push(u * L / 2, y, x); } }
  for (let i = 0; i < nl; i++) for (let j = 0; j < nr; j++) { const a = i * (nr + 1) + j, b = a + nr + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; }
const hullM = M({ map: woodT, side: THREE.DoubleSide });
function boat(scn) { const G = new THREE.Group(); const h = new THREE.Mesh(hullGeo(), hullM); h.castShadow = h.receiveShadow = true; G.add(h); for (const x of [-1.2, 0, 1.3]) boxIn(G, .12, .06, 1.1, plankM, x, .42, 0); scn.add(G); return G; }
const GHE = boat(ext), GHE2 = boat(ext), MOOR = [boat(ext), boat(ext)];
MOOR[0].position.set(-3.6, -.08, 19.5); MOOR[0].rotation.y = Math.PI / 2 + .1; MOOR[1].position.set(-2.4, -.08, 16.5); MOOR[1].rotation.y = Math.PI / 2 - .15;
// rod + line from a hand point
const rodM = M({ color: 0x5a4a30 }), lineM = new THREE.LineBasicMaterial({ color: 0xc8c8c8, transparent: true, opacity: .6 });
function rod(scn) { const G = new THREE.Group(); const r = new THREE.Mesh(new THREE.CylinderGeometry(.012, .025, 2.6, 5), rodM); r.position.y = 1.3; G.add(r); const lg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]); const ln = new THREE.Line(lg, lineM); scn.add(ln); G.userData.line = ln; scn.add(G); return G; }
const ROD = rod(ext), ROD2 = rod(ext);
function setRod(R_, base, tilt, yaw, bend, tipTo) { R_.visible = true; R_.position.set(...base); R_.rotation.set(0, yaw, -tilt); R_.children[0].rotation.z = 0; R_.children[0].scale.set(1, 1, 1); R_.updateMatrixWorld(); const tip = new THREE.Vector3(0, 2.6, 0).applyMatrix4(R_.matrixWorld); tip.y -= bend; const a = R_.userData.line.geometry.attributes.position; a.setXYZ(0, tip.x, tip.y, tip.z); a.setXYZ(1, tipTo[0], tipTo[1], tipTo[2]); a.needsUpdate = true; R_.userData.line.visible = true; }
// riverside stilt houses + plants
const WINS = [];
function stilt(x, z, ry, s = 1, lit = false) { const G = new THREE.Group(); G.position.set(x, terrH(x, z), z); G.rotation.y = ry; G.scale.setScalar(s); ext.add(G);
  for (const px of [-2.4, 0, 2.4]) for (const pz of [-1.4, 1.4]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.1, .12, 1.8, 7), postM); p.position.set(px, .9, pz); p.castShadow = true; G.add(p); }
  boxIn(G, 5.4, .14, 3.4, postM, 0, 1.8, 0); boxIn(G, 5.0, 1.8, 3.0, wallM, 0, 2.7, 0);
  for (const sd of [-1, 1]) { const r = new THREE.Mesh(new THREE.BoxGeometry(6.6, .2, 2.7), roofM); r.position.set(0, 4.15, sd * 1.0); r.rotation.x = sd * .9; r.castShadow = r.receiveShadow = true; G.add(r); }
  const wm = new THREE.MeshStandardMaterial({ color: 0x1a1410, emissive: 0xffa050, emissiveIntensity: 0 }); const w = new THREE.Mesh(new THREE.PlaneGeometry(.7, .55), wm); w.position.set(.9, 2.8, 1.52); G.add(w); if (lit) WINS.push(wm); return G; }
stilt(-14, 33, .05, 1, true); stilt(-2, 35, -.1, 1); stilt(10, 34, .15, 1, true); stilt(-26, 34, .2, .9, true); stilt(22, 36, -.2, .9); stilt(-6, -36, Math.PI + .1, .9, true); stilt(14, -38, Math.PI - .2, .8);
const bambooT = ctex(256, 512, (g, w, h) => { const leaf = (x, y, a, L) => { g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(L * .5, -5, L, 0); g.quadraticCurveTo(L * .5, 5, 0, 0); g.fill(); g.restore(); };
  for (let k = 0; k < 6; k++) { const x0 = 70 + k * 24 + R(k) * 10, x1 = x0 + (k - 2.5) * 26; g.strokeStyle = ['#5a7a3a', '#4a6a2e', '#6a8a44'][k % 3]; g.lineWidth = 6; g.beginPath(); g.moveTo(x0, h); g.quadraticCurveTo(x0 + (k - 2.5) * 4, h * .5, x1, 20 + R(k) * 30); g.stroke();
    for (let j = 0; j < 7; j++) { const y = 30 + j * 46 + R(k * 7 + j) * 20, xx = lerp(x1, x0, y / h), sd = j % 2 ? 1 : -1; for (let q = 0; q < 4; q++) { g.fillStyle = ['#56783a', '#46682e', '#668a46', '#3e5a28'][(q + j) % 4]; leaf(xx, y, sd > 0 ? .25 + q * .28 : Math.PI - .25 - q * .28, 30 + R(j * 4 + q + k) * 14); } } } });
const PLANTS = []; function plant(tex, x, z, w, h) { const G = new THREE.Group(); G.position.set(x, terrH(x, z) - .05, z); const mt = cutM(tex); for (const ry of [0, Math.PI / 2]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mt); p.position.y = h / 2; p.rotation.y = ry + R(x * 7 + z) * .5; p.castShadow = true; G.add(p); } ext.add(G); PLANTS.push(G); return G; }
for (let i = 0; i < 26; i++) { const x = -60 + i * 4.8 + R(i) * 2, z = (i % 2 ? 29 : -31) + R(i + 1) * 3 * (i % 2 ? 1 : -1); if (Math.abs(x + 7) < 3 && z > 0) continue; const s = 1 + R(i + 2) * .5; plant(bambooT, x, z, 3.2 * s, 6.4 * s); }
const leafCols = [0x1e3a22, 0x26442a, 0x2e5230, 0x223a26]; const barkM = M({ color: 0x3a2e24 });
function tree(x, z, s = 1, seed = 0) { const G = new THREE.Group(); G.position.set(x, terrH(x, z) - .1, z); G.scale.setScalar(s); ext.add(G); const th = 2.6 + R(seed) * 1.6; const t = new THREE.Mesh(new THREE.CylinderGeometry(.12, .2, th, 7), barkM); t.position.y = th / 2; t.castShadow = true; G.add(t);
  for (let k = 0; k < 6; k++) { const c = new THREE.Mesh(new THREE.IcosahedronGeometry(.9 + R(seed + k) * .7, 1), M({ color: leafCols[(seed + k) % 4], flatShading: true })); c.position.set((R(seed * 3 + k) - .5) * 1.8, th + (R(seed + k * 7) - .2) * 1.2, (R(seed * 5 + k) - .5) * 1.8); c.scale.y = .8; c.castShadow = true; G.add(c); } }
for (let i = 0; i < 90; i++) { const x = (R(i) - .5) * 240, z = i % 2 ? 40 + R(i + 1) * 40 : -36 - R(i + 1) * 60; tree(x, z, .9 + R(i + 2) * .8, i); }
const MIST = []; for (let i = 0; i < 40; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: mistT, color: 0x8a94b0, transparent: true, opacity: .25, depthWrite: false })); s.scale.set(14 + R(i) * 14, 2 + R(i + 2) * 2, 1); s.position.set((R(i + 5) - .5) * 120, .6 + R(i + 9) * 2.4, (R(i + 11) - .5) * 44); ext.add(s); MIST.push(s); }
const STARS = new THREE.Points(new THREE.BufferGeometry().setFromPoints([...Array(400)].map((_, i) => new THREE.Vector3((R(i) - .5) * 800, 120 + R(i + 1) * 200, -300 - R(i + 2) * 100))), new THREE.PointsMaterial({ color: 0xdde4ff, size: 1.6, sizeAttenuation: false, fog: false })); ext.add(STARS);
const MOON = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, color: 0xdfe8ff, fog: false })); MOON.scale.setScalar(26); MOON.position.set(-90, 150, -330); ext.add(MOON);
// lights
const hemi = new THREE.HemisphereLight(0x6a7ab0, 0x1a1a14, .9); ext.add(hemi);
const moon = new THREE.DirectionalLight(0x9ab0ff, 1.3); moon.position.set(-20, 30, -20); moon.castShadow = true; moon.shadow.mapSize.set(2048, 2048); Object.assign(moon.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, far: 90 }); moon.shadow.bias = -.0004; ext.add(moon);
const fillE = new THREE.PointLight(0xa8b8ff, 0, 10, 1.4); ext.add(fillE);
function mood(m) { ext.background = SKY[m]; ext.fog.color.set({ night: 0x141c34, dawn: 0x6a7288, rain: 0x4a5262, day: 0xa8bcd0 }[m]); ext.fog.near = m === 'night' ? 25 : 40; ext.fog.far = m === 'night' ? 300 : 420;
  hemi.intensity = { night: .9, dawn: 1.2, rain: 1.1, day: 1.6 }[m]; hemi.color.set({ night: 0x6a7ab0, dawn: 0xb0a8c0, rain: 0x9aa4b4, day: 0xe0ecff }[m]);
  moon.intensity = { night: 1.3, dawn: .9, rain: .5, day: 2.4 }[m]; moon.color.set({ night: 0x9ab0ff, dawn: 0xf0c8b0, rain: 0xb0b8c8, day: 0xfff4e0 }[m]); moon.position.set(m === 'dawn' ? 40 : m === 'day' ? 10 : -20, m === 'dawn' ? 10 : 30, m === 'night' ? -20 : 10);
  WATER.material.uniforms.sunColor.value.set({ night: 0x9ab0e0, dawn: 0xc8c0c0, rain: 0x8090a0, day: 0xffffff }[m]); WATER.material.uniforms.waterColor.value.set({ night: 0x0c1a22, dawn: 0x16222c, rain: 0x24303a, day: 0x2a4e5c }[m]);
  STARS.visible = MOON.visible = m === 'night'; MIST.forEach(s => s.material.color.set(m === 'night' ? 0x6a7490 : 0xc8ccd8)); MIST.forEach(s => s.material.opacity = m === 'day' ? .1 : .28);
  WINS.forEach(w => w.emissiveIntensity = m === 'night' ? 1.6 : m === 'dawn' ? .8 : 0); LAMPS.forEach(([l, pl]) => { l.material.emissiveIntensity = m === 'night' ? 2 : m === 'dawn' ? .8 : 0; pl.intensity = m === 'night' ? 6 : m === 'dawn' ? 2 : 0; }); fillE.intensity = 0; }

// =============================== Lực's hut ===============================
const hut = new THREE.Scene(); hut.background = new THREE.Color(0x05060a);
{ const fl = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), M({ map: woodT })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; hut.add(fl);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(6, 2.6), M({ map: weaveT, side: THREE.DoubleSide })); back.position.set(0, 1.3, -2); back.receiveShadow = true; hut.add(back);
  for (const sd of [-1, 1]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 2.6), M({ map: weaveT, side: THREE.DoubleSide })); w.rotation.y = -sd * Math.PI / 2; w.position.set(sd * 3, 1.3, .2); w.receiveShadow = true; hut.add(w); }
  const door = new THREE.Mesh(new THREE.PlaneGeometry(1, 1.9), new THREE.MeshBasicMaterial({ color: 0x182238 })); door.position.set(-2.98, .95, .6); door.rotation.y = Math.PI / 2; hut.add(door); }
const matT = ctex(256, 256, (g, w, h) => { g.fillStyle = '#b89a62'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 6) { g.fillStyle = y % 12 ? 'rgba(120,90,50,.25)' : 'rgba(255,240,200,.15)'; g.fillRect(0, y, w, 3); } g.strokeStyle = '#7a2a20'; g.lineWidth = 8; g.strokeRect(10, 10, w - 20, h - 20); });
{ const mt = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.0), M({ map: matT })); mt.rotation.x = -Math.PI / 2; mt.position.set(1.4, .01, -.6); mt.receiveShadow = true; hut.add(mt);
  const pil = new THREE.Mesh(new THREE.BoxGeometry(.6, .14, .3), M({ color: 0xc8c0a8 })); pil.position.set(1.4, .07, -1.45); hut.add(pil);
  const net = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.4), cutM(ctex(128, 128, (g, w, h) => { g.strokeStyle = '#a8a090'; g.lineWidth = 2; for (let k = 0; k < 14; k++) { g.beginPath(); g.moveTo(k * 10, 0); g.lineTo(k * 10 + 30, h); g.stroke(); g.beginPath(); g.moveTo(k * 10 + 30, 0); g.lineTo(k * 10, h); g.stroke(); } }))); net.position.set(-1.2, 1.6, -1.95); hut.add(net); }
const footT = ctex(64, 128, (g) => { g.fillStyle = 'rgba(10,14,20,.75)'; g.beginPath(); g.ellipse(32, 72, 15, 34, 0, 0, 7); g.fill(); for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(20 + k * 6, 30 - Math.abs(k - 1) * 2, 4, 0, 7); g.fill(); } });
const FOOT = []; for (let k = 0; k < 9; k++) { const f = new THREE.Mesh(new THREE.PlaneGeometry(.14, .28), new THREE.MeshStandardMaterial({ map: footT, transparent: true, roughness: .15, metalness: .2, depthWrite: false })); const u = k / 8; f.rotation.x = -Math.PI / 2; f.rotation.z = -1.25 + (k % 2 ? .1 : -.1); f.position.set(lerp(-2.7, 1.2, u) + (k % 2 ? .1 : -.1) * 0, .012, lerp(.6, -.4, u) + (k % 2 ? .12 : -.12)); hut.add(f); FOOT.push(f); }
const hutHemi = new THREE.HemisphereLight(0x4a5a8a, 0x100c08, .5); hut.add(hutHemi);
const lamp = new THREE.PointLight(0xffb060, 3.5, 7, 1.5); lamp.position.set(.4, .5, .4); lamp.castShadow = true; hut.add(lamp);
{ const l = new THREE.Mesh(new THREE.CylinderGeometry(.06, .08, .14, 10), M({ color: 0x5a4a30 })); l.position.set(.4, .07, .4); hut.add(l); const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, color: 0xffb050, transparent: true, depthWrite: false })); f.scale.setScalar(.3); f.position.set(.4, .25, .4); hut.add(f); }
const doorL = new THREE.SpotLight(0x8aa0e0, 10, 8, .5, .6); doorL.position.set(-3.6, 1.4, .6); doorL.target.position.set(0, 0, 0); hut.add(doorL); hut.add(doorL.target);

// =============================== characters: rig cards ===============================
const CARD_H = 2.7, SC = 1.5;
function card(scn, who, opts = {}) { const c = document.createElement('canvas'); c.width = 1024; c.height = 1024; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; const gh = !!opts.ghost;
  const mat = new THREE.MeshStandardMaterial({ map: t, transparent: true, alphaTest: .3, side: THREE.DoubleSide, roughness: 1, emissive: gh ? 0x6a7a80 : 0xffffff, emissiveMap: t, emissiveIntensity: gh ? .55 : .16, opacity: gh ? .7 : 1, depthWrite: !gh });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(CARD_H, CARD_H), mat); m.castShadow = !gh; m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: t, alphaTest: .4 });
  if (opts.noReflect) { m.layers.set(1); } // Lực has no reflection in the water
  m.userData.paint = (o) => { const x = c.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, 1024, 1024); RIG.set(x); RIG.castMember(who, 512, 1000, SC, o);
    if (opts.headOnly) { x.clearRect(0, 655, 1024, 369); const r = x.createLinearGradient(0, 560, 0, 655); r.addColorStop(0, 'rgba(0,0,0,0)'); r.addColorStop(1, 'rgba(0,0,0,1)'); x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = r; x.fillRect(0, 560, 1024, 95); x.restore(); }
    x.save(); x.globalCompositeOperation = 'source-atop'; const q = x.createLinearGradient(0, 0, 1024, 0); q.addColorStop(0, 'rgba(255,240,220,.08)'); q.addColorStop(.45, 'rgba(0,0,0,0)'); q.addColorStop(1, 'rgba(10,10,30,.22)'); x.fillStyle = q; x.fillRect(0, 0, 1024, 1024);
    if (o.wet) { x.fillStyle = 'rgba(20,40,60,.18)'; x.fillRect(0, 0, 1024, 1024); } x.restore(); t.needsUpdate = true; };
  m.visible = false; scn.add(m); return m; }
const CE = { luc: card(ext, 'luc', { noReflect: true }), dat: card(ext, 'dat'), thin: card(ext, 'thin'), khach: card(ext, 'khach'), ba1: card(ext, 'ba1'), ba2: card(ext, 'ba2'), ong2: card(ext, 'ong2'), face: card(ext, 'luc', { ghost: true, headOnly: true }), datg: card(ext, 'dat', { ghost: true }) };
const CH = { luc: card(hut, 'luc') };
const ALLC = [...Object.values(CE), ...Object.values(CH)];
function put(c, x, z, o = {}, y = 0) { c.visible = true; c.position.set(x, y + CARD_H / 2 - (24 / 1024) * CARD_H, z); c.userData.o = o; }
const _r = new THREE.Vector3();
function orient(c, cmr) { const o = c.userData.o; if (o.face === undefined) return; cmr.updateMatrixWorld(); _r.setFromMatrixColumn(cmr.matrixWorld, 0);
  const fx = Math.sin(o.face), fz = Math.cos(o.face), side = fx * _r.x + fz * _r.z >= 0 ? 1 : -1; let tx = cmr.position.x - c.position.x, tz = cmr.position.z - c.position.z; const L = Math.hypot(tx, tz) || 1; const ca = (fx * tx + fz * tz) / L;
  o.view = ca > .85 ? 'front' : ca > .3 ? 'three' : ca > -.35 ? 'side' : 'back'; o.flip = o.view === 'front' || o.view === 'back' ? 1 : side; if (o.view === 'three' && o.faceDir === undefined) o.faceDir = .25; }
let CT = [0, 0, 0];
const cm = (p, l, fov = 40) => { cam.fov = fov; cam.position.set(...p); cam.lookAt(...l); cam.updateProjectionMatrix(); CT = l; };

// =============================== acting: keyframed poses + automatic secondary motion ===============================
let NOW = 0;
// pose tracks: keys = [[t, {pose}], ...] in shot-local seconds; arrays/numbers are blended with an ease, other values switch at the key
function act(lt, keys) { if (lt <= keys[0][0]) return { ...keys[0][1] }; for (let i = 0; i < keys.length - 1; i++) { const [a, A] = keys[i], [b, B] = keys[i + 1]; if (lt < b) { const u = sm((lt - a) / (b - a)); return mix(A, B, u); } } return { ...keys[keys.length - 1][1] }; }
function mix(A, B, u) { const o = { ...A, ...B }; for (const k in o) { const a = A[k], b = B[k]; if (a === undefined || b === undefined) { o[k] = u < .5 ? (a !== undefined ? a : b) : (b !== undefined ? b : a); continue; }
  if (typeof a === 'number' && typeof b === 'number') o[k] = lerp(a, b, u); else if (Array.isArray(a) && Array.isArray(b)) o[k] = a.map((v, i) => lerp(v, b[i] ?? v, u)); else o[k] = u < .5 ? a : b; } return o; }
const talkE = sp => { let e = 0; for (const [a, b, s] of TLD.vox) if (s === sp) e = Math.max(e, sm((NOW - a) / .15) * sm((b - NOW) / .2)); return e; };
const mouthOf = sp => { for (const [a, b, s] of TLD.vox) if (s === sp && NOW >= a && NOW < b) return .25 + .6 * Math.abs(Math.sin(NOW * 12.5)) * (.6 + .4 * Math.sin(NOW * 3.1)); return 0; };
// life layer: breathing (shoulders/arms), slow weight shift, head drift, blinks with double-blinks, talk gestures (beat gestures on stressed syllables)
function life(o, seed, sp) { const br = Math.sin(NOW * 1.9 + seed), sway = Math.sin(NOW * .55 + seed * 1.7), te = sp ? talkE(sp) : 0, beat = te * Math.max(0, Math.sin(NOW * 4.2 + seed)) ;
  const out = { ...o }; out.bob = (o.bob || 0) + 1.6 * br; out.lean = (o.lean || 0) + 1.2 * sway; out.head = (o.head || 0) + 2.2 * Math.sin(NOW * .8 + seed * 2) + 1.2 * Math.sin(NOW * 2.3 + seed) + te * 3 * Math.sin(NOW * 7.3);
  const ab = o.armB || [-6, 16], af = o.armF || [10, 22]; out.armB = [ab[0] + 2.2 * br, ab[1] + 3 * br]; out.armF = [af[0] - 2.2 * br + (o.gest === false ? 0 : beat * 26), af[1] + 3 * br + beat * 30];
  if (o.blink === undefined) { const per = 3.1 + (seed % 3) * .7, ph = (NOW + seed * .9) % per; out.blink = ph < .09 || (seed % 2 && ph > .22 && ph < .3) ? 1 : 0; }
  if (sp && out.mouth === undefined) out.mouth = mouthOf(sp); if (sp && te > 0 && out.brow === undefined) out.brow = 6 * te * Math.max(0, Math.sin(NOW * 2.4)); return out; }
function gait(ph, w) { const leg = p => { const u = ((p / (2 * Math.PI)) % 1 + 1) % 1, th = 18 * Math.sin(2 * Math.PI * u), sp = ((u - .75) % 1 + 1) % 1, sw = sp < .5 ? sp / .5 : -1; const knee = sw >= 0 ? -105 * Math.sin(Math.PI * Math.pow(sw, .6)) - 6 : -4 - 6 * Math.sin(Math.PI * (sp - .5) / .5), foot = sw >= 0 ? (sw < .7 ? 22 * Math.sin(Math.PI * sw / .7) : -14 * Math.sin(Math.PI * (sw - .7) / .3)) : 0; return [th * w, knee * w - 4 * (1 - w), foot * w]; };
  const arm = p => [-26 * Math.sin(p) * w - 4, 82 * w + 16 * (1 - w)]; const s = Math.sin(ph); return { legF: leg(ph), legB: leg(ph + Math.PI), armB: arm(ph), armF: arm(ph + Math.PI), bob: 5 * s * s * w, lean: 6 * w }; }
// sitting in a boat (cross-legged-ish, knees up), rowing, fishing poses
const BOATSIT = { legsFront: true, legF: [120, -130, 0], legB: [112, -126, 0], lean: 4 };
const FISH = { ...BOATSIT, armF: [64, 26], armB: [58, 30], gest: false };

// =============================== boat + water motion ===============================
const bob = (G, x, z, ry, s) => { G.visible = true; G.position.set(x, -.08 + .04 * Math.sin(NOW * 1.3 + s), z); G.rotation.set(.025 * Math.sin(NOW * 1.1 + s), ry, .03 * Math.sin(NOW * .9 + s * 2)); };
function hideAll() { ALLC.forEach(c => c.visible = false); GHE.visible = GHE2.visible = false; ROD.visible = ROD2.visible = false; ROD.userData.line.visible = ROD2.userData.line.visible = false; PROPS.forEach(p => p.visible = false); SMOKE.forEach(s => s.material.opacity = 0); }
// props on the hook / at the bến
const sandalT = ctex(128, 256, g => { g.fillStyle = '#c84a5a'; g.strokeStyle = '#1a1014'; g.lineWidth = 4; g.beginPath(); g.ellipse(64, 128, 46, 112, 0, 0, 7); g.fill(); g.stroke(); g.lineWidth = 12; g.strokeStyle = '#a83848'; g.beginPath(); g.moveTo(24, 60); g.lineTo(64, 96); g.lineTo(104, 60); g.stroke(); g.fillStyle = 'rgba(40,80,40,.7)'; for (let k = 0; k < 9; k++) { g.beginPath(); g.ellipse(20 + R(k) * 90, 30 + R(k + 3) * 200, 4, 20, R(k) * 3, 0, 7); g.fill(); } });
const combT = ctex(256, 96, g => { g.fillStyle = '#8a5a30'; g.strokeStyle = '#1a1014'; g.lineWidth = 3; g.beginPath(); g.roundRect(10, 10, 236, 30, 10); g.fill(); g.stroke(); for (let k = 0; k < 22; k++) { g.fillRect(16 + k * 10.5, 38, 6, 48); g.strokeRect(16 + k * 10.5, 38, 6, 48); } });
const watchT = ctex(128, 256, g => { g.fillStyle = '#5a4a3a'; g.fillRect(44, 0, 40, 256); g.fillStyle = '#8a7a5a'; g.strokeStyle = '#1a1014'; g.lineWidth = 4; g.beginPath(); g.arc(64, 128, 46, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#c8c0a0'; g.beginPath(); g.arc(64, 128, 36, 0, 7); g.fill(); g.strokeStyle = '#2a2018'; g.beginPath(); g.moveTo(64, 128); g.lineTo(64, 100); g.moveTo(64, 128); g.lineTo(84, 136); g.stroke(); g.fillStyle = 'rgba(140,60,20,.5)'; for (let k = 0; k < 20; k++) { g.beginPath(); g.arc(30 + R(k) * 70, 90 + R(k + 2) * 80, 3 + R(k) * 5, 0, 7); g.fill(); } });
const hatT = ctex(256, 160, g => { g.fillStyle = '#c8b07a'; g.strokeStyle = '#1a1014'; g.lineWidth = 4; g.beginPath(); g.moveTo(10, 140); g.lineTo(128, 10); g.lineTo(246, 140); g.quadraticCurveTo(128, 160, 10, 140); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#0a0c10'; g.beginPath(); g.moveTo(150, 60); g.lineTo(200, 110); g.lineTo(160, 120); g.closePath(); g.fill(); g.fillStyle = 'rgba(40,80,40,.6)'; for (let k = 0; k < 8; k++) { g.beginPath(); g.ellipse(40 + R(k) * 170, 60 + R(k + 3) * 80, 4, 16, R(k) * 3, 0, 7); g.fill(); } });
const mkProp = (t, w, h) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), cutM(t)); m.castShadow = true; m.visible = false; ext.add(m); return m; };
const PROPS = [mkProp(sandalT, .12, .25), mkProp(combT, .2, .08), mkProp(watchT, .1, .2), mkProp(hatT, .42, .26)];
const SHROUD = new THREE.Mesh(new THREE.CapsuleGeometry(.24, 1.2, 6, 12), M({ map: matT })); SHROUD.rotation.z = Math.PI / 2; SHROUD.scale.set(1, 1, .55); SHROUD.castShadow = true; SHROUD.visible = false; ext.add(SHROUD); PROPS.push(SHROUD);
const GRAVES = new THREE.Group(); ext.add(GRAVES); GRAVES.visible = false; for (const dx of [-.9, .9]) { const m = new THREE.Mesh(new THREE.SphereGeometry(.8, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), M({ color: 0x5a4a34 })); m.scale.set(1, .55, 1.5); m.position.set(dx, 0, 0); m.castShadow = m.receiveShadow = true; GRAVES.add(m); boxIn(GRAVES, .35, .5, .08, M({ color: 0x8a847a }), dx, .55, -1.1); } PROPS.push(GRAVES);
function smoke(x, y, z) { SMOKE.forEach((s, i) => { const p = (NOW * .18 + i / 10) % 1; s.position.set(x + Math.sin(p * 6 + i) * .06, y + p * 1.2, z); s.scale.setScalar(.12 + p * .5); s.material.opacity = .2 * Math.sin(p * Math.PI); }); }

// =============================== shots ===============================
const S = {}; let TITLE = 0, CTA = 0, FLASH = 0, RAIN = 0, SHAKE = 0, FADE = 0;
const OUT = 0, IN = Math.PI;
// Lực fishing from his boat at the cove; returns hook point
function fishing(x, z, ry, pull = 0, item = -1, seed = 1, extra = {}) { bob(GHE, x, z, ry, seed); const by = GHE.position.y;
  const o = life({ face: ry - Math.PI / 2, ...FISH, armF: [64 + 40 * pull, 26 - 20 * pull], armB: [58 + 36 * pull, 30 - 16 * pull], lean: 4 - 10 * pull, ...extra }, 1, 'LUC'); put(CE.luc, x + Math.sin(ry) * .2, z + Math.cos(ry) * .2, o, by + .22);
  const fx = Math.cos(ry), fz = -Math.sin(ry); const base = [x + fx * .35, by + .9, z + fz * .35]; const hook = [x + fx * 3.6, -.02 + pull * .9, z + fz * 3.6];
  setRod(ROD, base, 1.05 - pull * .5, ry, pull * .25, hook); if (item >= 0) { const P_ = PROPS[item]; P_.visible = true; P_.position.set(hook[0], hook[1] - .12, hook[2]); P_.rotation.set(0, NOW * .7, .2 * Math.sin(NOW * 3)); } return hook; }
S.hook = (lt, D) => { mood('night'); const p = sm(lt / D); fishing(0, 0, .25, NOW > BEAT.hook - 1.2 ? sm((NOW - BEAT.hook + 1.2) / .8) * .5 : 0, -1, 1);
  if (NOW >= BEAT.hook) FACE = { p: [1.2, -.05, 1.6], s: 4.6 };
  if (NOW >= BEAT.hook) cm([2.4, 2.4, 6.8], [1.2, -.7, 1.6], 38); else cm([lerp(6, 3.4, p), lerp(3.2, 1.6, p), lerp(12, 6.2, p)], [1, .8, 0], 40); return 'ext'; };
S.title = (lt, D) => { mood('night'); TITLE = 1; smoke(9, 1.0, -4.6); cm([2, 2.6, lerp(16, 14.5, sm(lt / D))], [6, 1.2, -4], 40); return 'ext'; };
S.s1 = (lt, D) => { mood('night'); const p = sm(lt / D); cm([lerp(-40, -8, p), lerp(40, 6, p), lerp(60, 22, p)], [2, 0, -3], lerp(50, 42, p)); return 'ext'; };
S.s2 = (lt, D) => { mood('night'); const u = lt / D; const bx = lerp(-16, 6.4, sm(clamp(u / .45))); bob(GHE2, bx, -2.6, 0, 3); put(CE.ong2, bx - .9, -2.6, life({ face: Math.PI / 2, ...BOATSIT, armF: u > .5 ? [120, 30] : [70, 30] }, 4), GHE2.position.y + .22); smoke(9, 1.0, -4.6);
  cm([lerp(-6, 2, u), 1.8, 8], [lerp(-6, 7, u), .9, -3.5], 40); return 'ext'; };
S.s3 = (lt, D) => { const u = lt / D; if (u < .55) { mood('rain'); RAIN = .3; const flip = sm(seg(u, .25, .45)); bob(GHE, 0, 0, .25, 2); GHE.rotation.z += flip * Math.PI * .95; GHE.position.y -= flip * .3;
    if (flip < .35) { put(CE.luc, -.6, .2, life({ face: -Math.PI / 2 + .25, ...BOATSIT, armF: [90, 30] }, 1), .14); put(CE.dat, .7, -.2, life({ face: Math.PI / 2 + .25, ...BOATSIT, armF: [80, 40] }, 2), .14); }
    cm([4, 2, 9], [0, .8, 0], 40); return 'ext'; }
  mood('night'); const p = sm(seg(u, .55, 1)); fishing(lerp(-6, 0, p), lerp(6, 0, p), .25, 0, -1, 1); cm([-2, 2.2, 10], [0, .8, 0], 40); return 'ext'; };
S.L1 = (lt, D) => { mood('night'); fishing(0, 0, .25, 0, -1, 1, { look: -.4, head: -6 }); cm([.8, 1.2, 3.2], [.1, .95, 0], 34); return 'ext'; };
S.s4 = (lt, D) => { mood('night'); const u = lt / D, pull = sm(seg(NOW, BEAT.s4 - 2.5, BEAT.s4 - .3)); fishing(0, 0, .25, pull, NOW > BEAT.s4 - .6 ? 0 : -1, 1, NOW > BEAT.s4 ? { shock: 1, look: .5 } : {});
  if (NOW > BEAT.s4 - .2) cm([2.6, .9, 1.6], [3.2, .85, -.85], 30); else cm([4.5, 1.8, 6], [1.2, .7, 0], 40); return 'ext'; };
// morning at the bến: villagers round a covered body; Lực stands at the edge, nobody looks at him
// the body lies at the bank end of the pier; the camera stands out on the pier looking back at the bank and the houses
function benCrowd(u, who = 0) { mood('dawn'); SHROUD.visible = true; SHROUD.position.set(-6.8, .82, 23); const cry = 2 * Math.sin(NOW * 6);
  put(CE.ba1, -7.4, 22.5, life({ face: 1.0, bend: 26, lean: 14, legsFront: true, legF: [80, -150, 0], legB: [70, -140, 0], armF: [120, 60 + cry * 6], armB: [100, 70], head: 10 + cry, blink: 1 }, 5), .08);
  put(CE.ba2, -5.9, 23.7, life({ face: -2.2, armF: [30, 90], armB: [20, 60], look: .6 }, 6), .58); put(CE.ong2, -6.3, 21.9, life({ face: -.4, armF: [10, 22], look: .5 }, 4), .58); put(CE.thin, -5.5, 22.7, life({ face: -1.8 }, 7), .58); }
const LUCB = [-8.7, 21.3];
S.s5 = (lt, D) => { const u = lt / D; benCrowd(u); put(CE.luc, ...LUCB, life({ face: .9, look: .3, brow: 4, armF: [8, 20] }, 1), .58);
  if (u < .55) cm([-5.6, 2.1, 30.4], [-7.1, 1.0, 22.4], 40); else cm([-9.4, 1.55, 25.6], [-8.6, 1.3, 21.3], 34); return 'ext'; };
S.s6 = (lt, D) => { mood('night'); const u = lt / D;
  if (u < .3) { const it = u < .15 ? 1 : 2; fishing(0, 0, .25, .5, it, 1); cm([2.6, .9, 1.6], [3.2, .85, -.85], 30); return 'ext'; }
  // the stranger's boat beside Lực's; he looks down at the water: only his own reflection
  fishing(0, 0, .25, 0, -1, 1); const k = sm(seg(u, .85, 1)); bob(GHE2, lerp(1.4, 8, k * k), 2.4, .25, 4); put(CE.khach, GHE2.position.x - .2, 2.6, life({ face: u > .55 ? Math.PI : -Math.PI / 2 + .25, ...BOATSIT, look: u > .55 ? .8 : 0, shock: u > .7 ? 1 : 0, armF: [64, 26] }, 8), GHE2.position.y + .22);
  if (u > .55 && u < .85) cm([-4.6, 1.0, 3.4], [.6, .2, 2.0], 40); else cm([-6.5, 1.6, 4.2], [.6, .8, 1.2], 40); return 'ext'; };
S.s7 = (lt, D) => { const u = lt / D; if (u < .45) { mood('dawn'); put(CE.thin, -6.4, 22.4, life({ face: -2.44, look: .2, armB: [-6, 16], armF: [-4, 18] }, 7), .58); put(CE.luc, -8.6, 19.8, life({ face: .6 }, 1), .58);
    cm([-11.2, 1.7, 15.6], [-6.8, 1.3, 22.2], 34); return 'ext'; }
  const p = sm(seg(u, .45, 1)); FOOT.forEach((f, i) => f.visible = i / FOOT.length < p * 1.3); cm([-1.2, 2.4, 2.6], [0, 0, -.2], 46); return 'hut'; };
S.s8 = (lt, D) => { const u = lt / D; if (u < .3) { mood('night'); fishing(0, 0, .25, sm(seg(u, 0, .2)) * .6, u > .12 ? 3 : -1, 1); cm([2.6, .9, 1.6], [3.2, .85, -.85], 30); return 'ext'; }
  benCrowd(u); put(CE.luc, -7.3, 22.0, life({ face: .9, bend: 30, lean: 16, legsFront: true, legF: [80, -150, 0], legB: [70, -140, 0], armF: [150, 50], armB: [120, 60], head: 14, blink: 1, mouth: .5 }, 1), .1);
  cm([-5.8, 1.9, 29.8], [-7, .9, 22.4], 38); return 'ext'; };
S.L2 = (lt, D) => { benCrowd(0); put(CE.luc, ...LUCB, life({ face: .1, armF: [100, 40], armB: [60, 30], brow: 14, shock: .6 }, 1, 'LUC'), .58); cm([-8.9, 1.5, 24.8], [-8.7, 1.25, 21.3], 32); return 'ext'; };
S.s9 = (lt, D) => { const u = lt / D; benCrowd(0); const wk = seg(u, 0, .3); put(CE.thin, lerp(-5.5, -7.6, sm(wk)), lerp(22.7, 22.2, sm(wk)), life({ face: -2.26, ...(wk > 0 && wk < 1 ? gait(wk * 3 * Math.PI, .6) : {}) }, 7), .58);
  if (NOW < BEAT.s9look) { put(CE.luc, ...LUCB, life({ face: .5, look: .2 }, 1), .58); cm([-8.0, 1.7, 27.0], [-8.0, 1.25, 21.6], 36); return 'ext'; }
  // looking down off the pier: no reflection, only his own drowned face under the water
  put(CE.luc, -8.1, 20.4, life({ face: -Math.PI / 2 - .5, bend: 30, lean: 18, head: 20, look: .4 }, 1), .58); if (NOW >= BEAT.s9) FACE = { p: [-9.6, -.05, 19.8], s: 5.2 };
  cm([-11.0, 3.4, 17.0], [-9.4, .2, 19.8], 44); return 'ext'; };
S.TH1 = (lt, D) => { benCrowd(0); put(CE.thin, -7.6, 22.2, life({ face: -2.26, armF: [40, 40] }, 7, 'THIN'), .58); cm([-9.7, 1.45, 19.6], [-7.6, 1.15, 22.2], 34); return 'ext'; };
S.TH2 = (lt, D) => { benCrowd(0); const u = lt / D; put(CE.thin, -7.6, 22.2, life({ face: -2.26, armF: u > .3 ? [70, 30] : [20, 30] }, 7, 'THIN'), .58); put(CE.luc, ...LUCB, life({ face: .7, blink: u > .7 ? 1 : 0, head: 8 }, 1), .58);
  cm([-6.6, 1.6, 27.2], [-8.1, 1.25, 21.8], 36); return 'ext'; };
S.end = (lt, D) => { const u = lt / D; if (u < .5) { mood('day'); GRAVES.visible = true; GRAVES.position.set(-18, terrH(-18, 30), 30); smoke(-18, terrH(-18, 30) + .5, 28.8); cm([-15, 2.2, 25], [-18, .8, 30], 38); return 'ext'; }
  mood('night'); bob(GHE, 0, 0, .25 + .05 * NOW, 1); setRod(ROD, [.3, .45, -.1], 1.3, .25, 0, [3.2, -.02, -.8]); cm([lerp(6, 4, sm(seg(u, .5, 1))), 2.2, 10], [0, .5, 0], 40); return 'ext'; };
S.cta = (lt, D) => { mood('night'); CTA = 1; bob(GHE, 0, 0, .25, 1); setRod(ROD, [.3, .45, -.1], 1.3, .25, 0, [3.2, -.02, -.8]); cm([3, 2.6, 13], [0, 1.2, 0], 40); return 'ext'; };
const JUMPS = [BEAT.hook, BEAT.s9];

// the drowned face under the surface: drawn as an overlay at a projected water point, 70%, tinted and rippling
const FC = document.createElement('canvas'); FC.width = 1024; FC.height = 1024; let FACE = null;
function drownedFace() { if (!FACE) return; const v = new THREE.Vector3(...FACE.p).project(cam); if (v.z > 1) return; const sx = (v.x * .5 + .5) * RW, sy = (-v.y * .5 + .5) * RH; const dist = cam.position.distanceTo(new THREE.Vector3(...FACE.p));
  const x = FC.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, 1024, 1024); RIG.set(x); RIG.castMember('luc', 512, 1000, 1.5, { view: 'front', faceDir: 0, dead: true, blink: 0, head: 0, look: 0 });
  x.clearRect(0, 690, 1024, 334); x.globalCompositeOperation = 'source-atop'; x.fillStyle = 'rgba(225,232,236,.5)'; x.fillRect(0, 0, 1024, 1024); x.fillStyle = 'rgba(40,80,110,.25)'; x.fillRect(0, 0, 1024, 1024); x.globalCompositeOperation = 'source-over';
  const sc = FACE.s * 900 / dist, wob = 1 + .03 * Math.sin(NOW * 2.3); g2.save(); g2.globalAlpha = .7 * (FACE.a ?? 1); g2.translate(sx, sy); g2.scale(sc * wob / 1024, sc * .8 / wob / 1024); g2.drawImage(FC, -512, -515); g2.restore();
  g2.save(); g2.globalAlpha = .25 * (FACE.a ?? 1); g2.strokeStyle = '#b8d0e8'; g2.lineWidth = 2; for (let k = 0; k < 3; k++) { const r = ((NOW * .4 + k / 3) % 1); g2.beginPath(); g2.ellipse(sx, sy, sc * (.3 + r * .5), sc * .62 * (.3 + r * .5) * .5, 0, 0, 7); g2.stroke(); } g2.restore(); }
// =============================== overlay ===============================
function rain(a) { g2.strokeStyle = `rgba(210,220,235,${a})`; g2.lineWidth = 1.2; for (let i = 0; i < 160; i++) { const x = ((i * 97) % RW + NOW * 50) % RW, y = ((i * 211) + NOW * 1100) % RH; g2.beginPath(); g2.moveTo(x, y); g2.lineTo(x - 7, y + 26); g2.stroke(); } }
function subs(t) { for (const [a, b, str, sp] of TLD.subs) { if (t < a || t >= b) continue; g2.save(); g2.textAlign = 'center'; g2.lineJoin = 'round'; g2.font = 'bold 42px "DejaVu Sans"';
  const ws = str.split(' '); const L = []; let c = ''; for (const w of ws) { const tt = c ? c + ' ' + w : w; if (g2.measureText(tt).width > 620 && c) { L.push(c); c = w; } else c = tt; } if (c) L.push(c); const lh = 54, y0 = 1010 - (L.length - 1) * lh / 2;
  const col = sp === 'N' ? '#ffffff' : sp === 'LUC' ? '#9ad0ff' : '#ffd76a'; L.forEach((l, i) => { g2.lineWidth = 9; g2.strokeStyle = '#000'; g2.strokeText(l, RW / 2, y0 + i * lh); g2.fillStyle = col; g2.fillText(l, RW / 2, y0 + i * lh); }); g2.restore(); } }
function fit(s, maxW, size, font) { g2.font = `${font} ${size}px "DejaVu Serif"`; const w = g2.measureText(s).width; g2.font = `${font} ${Math.min(size, size * maxW / w)}px "DejaVu Serif"`; }
function titleTxt(lt, a) { g2.save(); g2.globalAlpha = a; g2.textAlign = 'center'; g2.lineJoin = 'round'; g2.shadowColor = 'rgba(80,160,255,.6)'; g2.shadowBlur = 24; g2.fillStyle = '#cfe4ff';
  for (const [s, y] of [['VŨNG', 560], ['GIỮ XÁC', 690]]) { fit(s, 620, 130, 'bold'); g2.lineWidth = 10; g2.strokeStyle = '#000'; g2.strokeText(s, RW / 2, y); g2.fillText(s, RW / 2, y); }
  g2.shadowBlur = 0; fit('Thứ cắn câu... không phải cá', 600, 40, 'italic bold'); g2.fillStyle = '#f0e4c8'; g2.globalAlpha = a * sm(seg(lt, .5, 1.1)); g2.lineWidth = 6; g2.strokeStyle = '#000'; g2.strokeText('Thứ cắn câu... không phải cá', RW / 2, 790); g2.fillText('Thứ cắn câu... không phải cá', RW / 2, 790); g2.restore(); }
function ctaTxt(a) { g2.save(); g2.globalAlpha = a * .6; g2.textAlign = 'center'; g2.font = 'italic 24px "DejaVu Sans"'; g2.fillStyle = '#e0e0e0'; g2.fillText('Câu chuyện chỉ là hư cấu', RW / 2, RH - 60); g2.restore();
  g2.save(); g2.globalAlpha = a; g2.textAlign = 'center'; g2.lineJoin = 'round'; g2.lineWidth = 10; g2.strokeStyle = '#000'; fit('BẠN CÓ DÁM NGỒI CÂU?', 640, 66, '900'); g2.strokeText('BẠN CÓ DÁM NGỒI CÂU?', RW / 2, 250); g2.fillStyle = '#8ac8ff'; g2.fillText('BẠN CÓ DÁM NGỒI CÂU?', RW / 2, 250);
  g2.font = 'bold 32px "DejaVu Sans"'; g2.lineWidth = 6; g2.strokeText('Theo dõi @chuyendongtaykimco', RW / 2, 316); g2.fillStyle = '#fff'; g2.fillText('Theo dõi @chuyendongtaykimco', RW / 2, 316); g2.restore(); }
const SCN = { ext, hut };

// =============================== frame ===============================
window.draw = (t) => { NOW = t; const sc = TLD.scenes.find(s => t >= s[1] && t < s[2]) || TLD.scenes[TLD.scenes.length - 1]; const [k, a, b] = sc; const lt = t - a, D = b - a;
  hideAll(); FACE = null; FOOT.forEach(f => f.visible = true); TITLE = 0; CTA = 0; FLASH = 0; RAIN = 0; SHAKE = 0; g2.clearRect(0, 0, RW, RH);
  const mode = S[k](lt, D);
  let JF = -1; for (const tj of JUMPS) { const dt = t - tj; if (dt < 0 || dt > 1.3) continue; const z = dt < .1 ? dt / .1 * .45 : .45 * Math.max(0, 1 - (dt - .1) / 1.2); const tv = new THREE.Vector3(...CT); cam.position.lerp(tv, z); if (dt < .5) { const a2 = .05 * (1 - dt / .5); cam.position.x += (R(t * 977) - .5) * a2 * 2; cam.position.y += (R(t * 631) - .5) * a2 * 2; } cam.lookAt(tv); JF = dt; }
  for (const c of ALLC) if (c.visible) { orient(c, cam); c.rotation.y = Math.atan2(cam.position.x - c.position.x, cam.position.z - c.position.z); if (c === CE.face) { c.lookAt(cam.position.x, c.position.y, cam.position.z); c.rotateX(-1.1); c.rotateY(Math.PI); } c.userData.paint(c.userData.o); }
  PLANTS.forEach((p, i) => p.rotation.z = .03 * Math.sin(t * 1.2 + i)); MIST.forEach((s, i) => s.position.x = ((R(i + 5) - .5) * 120 + t * .5 + 60) % 120 - 60); INC.forEach((e, i) => e.material.opacity = .7 + .3 * Math.sin(t * 7 + i));
  WATER.material.uniforms.time.value = t * .35;
  renderer.render(SCN[mode], cam);
  const vg = g2.createRadialGradient(RW / 2, RH / 2, RH * .3, RW / 2, RH / 2, RH * .78); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.22)'); g2.fillStyle = vg; g2.fillRect(0, 0, RW, RH);
  drownedFace(); if (RAIN && mode === 'ext') rain(RAIN);
  if (JF >= 0 && JF < .3) { if (JF < .06) { g2.fillStyle = 'rgba(255,255,255,.5)'; g2.fillRect(0, 0, RW, RH); } else { g2.fillStyle = `rgba(0,40,80,${.35 * (1 - JF / .3)})`; g2.fillRect(0, 0, RW, RH); } }
  if (TITLE) titleTxt(lt, sm(seg(lt, .1, .6))); if (CTA) ctaTxt(sm(seg(lt, .1, .6)));
  const d = Math.min(t - a, b - t); if (d < .08 && a > 0) { g2.fillStyle = `rgba(0,0,0,${1 - d / .08})`; g2.fillRect(0, 0, RW, RH); }
  if (k !== 'title') subs(t); };
document.fonts.ready.then(() => { window.READY = true; });
