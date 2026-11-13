// "Cổng làng treo dao gỗ" — 2.5D: three.js sets + the 2D rig characters drawn into cards every frame.
import * as THREE from 'three';
const TLD = window.TLD, BEAT = TLD.beat;
const RW = 720, RH = 1280;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); renderer.setPixelRatio(1); renderer.setSize(RW, RH);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2; renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);
const ov = document.createElement('canvas'); ov.width = RW; ov.height = RH; document.body.appendChild(ov); const g2 = ov.getContext('2d');
const cam = new THREE.PerspectiveCamera(40, RW / RH, 0.05, 600);
const R = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, t) => a + (b - a) * t, sm = t => { t = clamp(t); return t * t * (3 - 2 * t); }, seg = (t, a, b) => clamp((t - a) / (b - a));
function ctex(w, h, fn, rep) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } t.anisotropy = 8; return t; }
const M = o => new THREE.MeshStandardMaterial(Object.assign({ roughness: .92, metalness: 0 }, o));
const cutM = (t, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ map: t, transparent: true, alphaTest: .4, side: THREE.DoubleSide, roughness: 1 }, o));
function boxIn(par, w, h, d, m, x, y, z, cast = true) { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = cast; b.receiveShadow = true; par.add(b); return b; }
const glowT = ctex(64, 64, g => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });
const mistT = ctex(128, 64, (g) => { const r = g.createRadialGradient(64, 32, 0, 64, 32, 60); r.addColorStop(0, 'rgba(255,255,255,.9)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.save(); g.scale(1, .5); g.fillRect(0, 0, 128, 128); g.restore(); });

// =============================== OUTSIDE: the bản, its gate, the road and the mountains ===============================
const ext = new THREE.Scene();
const skyT = { dusk: ['#3e4a66', '#7a8098', '#a8a0a4'], night: ['#060a18', '#1a2440', '#2c3654'], noon: ['#7aa0c8', '#b4c8dc', '#dcdcd4'], dawn: ['#1a2238', '#4a4a66', '#8a7a86'] };
const SKY = {}; for (const k in skyT) SKY[k] = ctex(16, 512, (g, w, h) => { const q = g.createLinearGradient(0, 0, 0, h); q.addColorStop(0, skyT[k][0]); q.addColorStop(.55, skyT[k][1]); q.addColorStop(1, skyT[k][2]); g.fillStyle = q; g.fillRect(0, 0, w, h); });
ext.fog = new THREE.Fog(0x7a8098, 30, 230);
const grassT = ctex(512, 512, (g, w, h) => { g.fillStyle = '#4b5a37'; g.fillRect(0, 0, w, h); for (let k = 0; k < 5000; k++) { g.strokeStyle = R(k) > .6 ? '#5f7044' : R(k + 1) > .5 ? '#3c4a2c' : '#55663d'; g.lineWidth = 2; const x = R(k * 3) * w, y = R(k * 7) * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (R(k) - .5) * 4, y - 6 - R(k + 2) * 8); g.stroke(); } }, [30, 30]);
{ const gr = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), M({ map: grassT })); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; ext.add(gr); }
const mudT = ctex(256, 512, (g, w, h) => { g.fillStyle = '#6e5238'; g.fillRect(0, 0, w, h); for (let k = 0; k < 900; k++) { g.fillStyle = `rgba(${R(k) > .5 ? 120 : 50},${R(k) > .5 ? 96 : 36},${R(k) > .5 ? 70 : 24},.5)`; g.beginPath(); g.ellipse(R(k * 3) * w, R(k * 5) * h, 3 + R(k) * 8, 2 + R(k + 1) * 4, 0, 0, 7); g.fill(); } g.strokeStyle = 'rgba(40,28,18,.6)'; g.lineWidth = 5; for (const x of [.38, .62]) { g.beginPath(); g.moveTo(w * x, 0); for (let y = 0; y <= h; y += 16) g.lineTo(w * x + Math.sin(y * .05) * 4, y); g.stroke(); }
  const e = g.createLinearGradient(0, 0, w, 0); e.addColorStop(0, 'rgba(75,90,55,1)'); e.addColorStop(.14, 'rgba(75,90,55,0)'); e.addColorStop(.86, 'rgba(75,90,55,0)'); e.addColorStop(1, 'rgba(75,90,55,1)'); g.fillStyle = e; g.fillRect(0, 0, w, h); }, [1, 10]);
{ const mud = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 100), M({ map: mudT, roughness: .7 })); mud.rotation.x = -Math.PI / 2; mud.position.set(0, .01, 0); mud.receiveShadow = true; ext.add(mud); }
const PUD = []; for (let k = 0; k < 7; k++) { const p = new THREE.Mesh(new THREE.CircleGeometry(.3 + R(k) * .35, 20), M({ color: 0x8a94aa, roughness: .08, metalness: .3 })); p.rotation.x = -Math.PI / 2; p.scale.y = .55; p.position.set((R(k + 3) - .5) * 2, .015, 9 - k * 3.2); ext.add(p); PUD.push(p); }
function ridge(par, z, col, amp, seed, w, x0 = 0) { const c = document.createElement('canvas'); c.width = 1024; c.height = 256; const g = c.getContext('2d'); g.fillStyle = col; g.beginPath(); g.moveTo(0, 256); for (let x = 0; x <= 1024; x += 8) g.lineTo(x, 256 - (110 + 90 * Math.sin(x * .006 + seed) + 40 * Math.sin(x * .021 + seed * 3) + 14 * Math.sin(x * .07 + seed)) * amp); g.lineTo(1024, 256); g.fill(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w / 4), new THREE.MeshBasicMaterial({ map: t, transparent: true, fog: true })); m.position.set(x0, w / 8 - 2, z); par.add(m); return m; }
const RIDGES = [ridge(ext, -150, '#3e4860', 1.1, 1, 420), ridge(ext, -110, '#353e52', 1.0, 4, 340), ridge(ext, -75, '#2c3444', .85, 7, 260), ridge(ext, 120, '#353e52', 1.0, 2, 340)]; RIDGES[3].rotation.y = Math.PI;
const MIST = []; for (let i = 0; i < 28; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: mistT, color: 0xc8d0de, transparent: true, opacity: .32, depthWrite: false })); s.scale.set(26 + R(i) * 20, 5 + R(i + 2) * 4, 1); s.position.set((R(i + 5) - .5) * 160, 2 + R(i + 9) * 9, -40 - R(i + 11) * 90); ext.add(s); MIST.push(s); }
// stilt houses with firewood stacks, water jars and hanging corn under the eaves
const woodT = ctex(256, 256, (g, w, h) => { g.fillStyle = '#5a4430'; g.fillRect(0, 0, w, h); for (let k = 0; k < 16; k++) { g.fillStyle = k % 2 ? '#4e3a28' : '#634a34'; g.fillRect(k * w / 16, 0, w / 16 - 2, h); } for (let k = 0; k < 60; k++) { g.strokeStyle = 'rgba(30,20,10,.35)'; g.beginPath(); const x = R(k) * w; g.moveTo(x, 0); g.lineTo(x + (R(k + 1) - .5) * 6, h); g.stroke(); } });
const thatchT = ctex(256, 256, (g, w, h) => { g.fillStyle = '#7a6a48'; g.fillRect(0, 0, w, h); for (let k = 0; k < 500; k++) { g.strokeStyle = `rgba(${R(k) > .5 ? 150 : 40},${R(k) > .5 ? 130 : 32},${R(k) > .5 ? 90 : 18},.55)`; g.lineWidth = 2; const x = R(k * 3) * w, y = R(k * 5) * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (R(k) - .5) * 6, y + 30); g.stroke(); } });
const postM = M({ color: 0x3e2e20 }), wallM = M({ map: woodT }), roofM = M({ map: thatchT, side: THREE.DoubleSide }), jarM = M({ color: 0x5a3a26, roughness: .5 }), cornM = M({ color: 0xd8a830, roughness: .8 }), logM = M({ color: 0x6a4a2c });
const WINS = [];
function stilt(x, z, ry, s = 1, lit = false) { const G = new THREE.Group(); G.position.set(x, 0, z); G.rotation.y = ry; G.scale.setScalar(s); ext.add(G);
  for (const px of [-2.6, -.9, .9, 2.6]) for (const pz of [-1.6, 1.6]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.11, .13, 1.9, 8), postM); p.position.set(px, .95, pz); p.castShadow = true; G.add(p); }
  boxIn(G, 5.8, .14, 3.8, postM, 0, 1.9, 0); boxIn(G, 5.4, 1.9, 3.4, wallM, 0, 2.9, 0);
  for (const sd of [-1, 1]) { const r = new THREE.Mesh(new THREE.PlaneGeometry(7, 2.9), roofM); r.position.set(0, 4.55, sd * 1.15); r.rotation.x = sd * -.95; r.castShadow = r.receiveShadow = true; G.add(r); }
  for (const sd of [-1, 1]) { const tri = new THREE.Shape(); tri.moveTo(-1.7, 0); tri.lineTo(1.7, 0); tri.lineTo(0, 1.6); const gm = new THREE.Mesh(new THREE.ShapeGeometry(tri), wallM); gm.position.set(sd * 2.7, 3.85, 0); gm.rotation.y = Math.PI / 2; G.add(gm); }
  const wm = new THREE.MeshStandardMaterial({ color: 0x1a1410, emissive: 0xff9a40, emissiveIntensity: 0 }); const win = new THREE.Mesh(new THREE.PlaneGeometry(.8, .6), wm); win.position.set(1, 3.0, 1.71); G.add(win); if (lit) WINS.push(wm);
  for (let k = 0; k < 6; k++) boxIn(G, .8, .06, .06, postM, -1.6, .3 + k * .3, 2.1 + k * -.05); for (const sx of [-2, -1.2]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 2.1, 6), postM); l.position.set(sx, .95, 2.0); l.rotation.x = -.15; G.add(l); }
  for (let k = 0; k < 9; k++) { const l = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 1.3, 6), logM); l.rotation.z = Math.PI / 2; l.position.set(.8, .1 + Math.floor(k / 3) * .14, -1 + (k % 3) * .15); l.castShadow = true; G.add(l); }
  for (let k = 0; k < 2; k++) { const j = new THREE.Mesh(new THREE.SphereGeometry(.28, 12, 10), jarM); j.scale.y = 1.25; j.position.set(2.0 + k * .6, .34, 1.9); j.castShadow = true; G.add(j); }
  for (let k = 0; k < 5; k++) { const c = new THREE.Mesh(new THREE.CapsuleGeometry(.06, .22, 4, 8), cornM); c.position.set(-2.2 + k * .22, 3.55 - (k % 2) * .06, 1.95); G.add(c); }
  return G; }
stilt(-8.5, -20, .25, 1, true); stilt(7.5, -24, -.3, 1, true); stilt(-1, -34, .05, 1.1, true); stilt(15, -15, -.6, .9); stilt(-17, -30, .4, 1, true);
// bamboo, grass tufts, a bamboo fence along the road
const bambooT = ctex(256, 512, (g, w, h) => { g.clearRect(0, 0, w, h); const leaf = (x, y, a, L) => { g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(L * .5, -5, L, 0); g.quadraticCurveTo(L * .5, 5, 0, 0); g.fill(); g.restore(); };
  for (let k = 0; k < 6; k++) { const x0 = 70 + k * 24 + R(k) * 10, x1 = x0 + (k - 2.5) * 26; g.strokeStyle = ['#5a7a3a', '#4a6a2e', '#6a8a44'][k % 3]; g.lineWidth = 6; g.beginPath(); g.moveTo(x0, h); g.quadraticCurveTo(x0 + (k - 2.5) * 4, h * .5, x1, 20 + R(k) * 30); g.stroke();
    g.strokeStyle = 'rgba(30,40,20,.5)'; g.lineWidth = 2; for (let y = h - 40; y > 60; y -= 46) { const xx = lerp(x1, x0, y / h); g.beginPath(); g.moveTo(xx - 4, y); g.lineTo(xx + 4, y); g.stroke(); }
    for (let j = 0; j < 7; j++) { const y = 30 + j * 46 + R(k * 7 + j) * 20, xx = lerp(x1, x0, y / h), sd = j % 2 ? 1 : -1; for (let q = 0; q < 4; q++) { g.fillStyle = ['#56783a', '#46682e', '#668a46', '#3e5a28'][(q + j) % 4]; leaf(xx, y, sd > 0 ? .25 + q * .28 : Math.PI - .25 - q * .28, 30 + R(j * 4 + q + k) * 14); } } } });
const tuftT = ctex(128, 128, (g, w, h) => { g.clearRect(0, 0, w, h); for (let k = 0; k < 14; k++) { g.strokeStyle = ['#56693c', '#46582f', '#64784a'][k % 3]; g.lineWidth = 4; g.beginPath(); g.moveTo(w / 2 + (k - 7) * 2, h); g.quadraticCurveTo(w / 2 + (k - 7) * 5, h * .5, w / 2 + (k - 7) * 8, 8 + R(k) * 40); g.stroke(); } });
const PLANTS = []; function plant(par, tex, x, z, w, h) { const G = new THREE.Group(); G.position.set(x, 0, z); const mt = cutM(tex); for (const ry of [0, Math.PI / 2]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mt); p.position.y = h / 2; p.rotation.y = ry + R(x * 7 + z) * .5; p.castShadow = true; G.add(p); } par.add(G); PLANTS.push(G); return G; }
for (const [x, z, s] of [[-5.2, -4.5, 1.2], [5.6, -5, 1.1], [-9, -9, 1.4], [9.5, -12, 1.3], [-4, -18, 1.2], [3.8, -22, 1.4], [-12, -3, 1.2], [11, -2, 1.1], [-7, 12, 1.3], [8, 16, 1.2]]) plant(ext, bambooT, x, z, 3.2 * s, 6.4 * s);
for (let i = 0; i < 200; i++) { const x = (R(i) - .5) * 30, z = 18 - R(i + 3) * 48; if (Math.abs(x) < 2.2) continue; plant(ext, tuftT, x, z, .7, .6); }
{ const fM = M({ color: 0x8a7a50 }); for (const sd of [-1, 1]) for (let k = 0; k < 14; k++) { const z = -2.2 - k * .9; const p = new THREE.Mesh(new THREE.CylinderGeometry(.035, .04, 1.1, 6), fM); p.position.set(sd * (2.5 + k * .05), .55, z); p.castShadow = true; ext.add(p); }
  for (const sd of [-1, 1]) for (const y of [.4, .8]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, 12.6, 6), fM); r.rotation.x = Math.PI / 2; r.rotation.y = sd * .05; r.position.set(sd * 2.85, y, -8.3); r.castShadow = true; ext.add(r); } }
// the gate
const GATE = new THREE.Group(); ext.add(GATE);
const gpM = M({ color: 0x4a3828 });
for (const x of [-1.9, 1.9]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.13, .16, 3.6, 10), gpM); p.position.set(x, 1.8, 0); p.castShadow = p.receiveShadow = true; GATE.add(p); }
for (const [y, w] of [[3.35, 4.6], [3.0, 4.2]]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, w, 8), gpM); c.rotation.z = Math.PI / 2; c.position.set(0, y, 0); c.castShadow = true; GATE.add(c); }
const taleoT = ctex(256, 256, (g) => { g.translate(128, 128); g.strokeStyle = '#c8b07a'; g.lineCap = 'round'; for (let k = 0; k < 8; k++) { g.rotate(Math.PI / 4); g.lineWidth = 10; g.beginPath(); g.moveTo(-110, 0); g.lineTo(110, 0); g.stroke(); } g.lineWidth = 7; for (const r of [40, 75]) { g.beginPath(); for (let k = 0; k <= 8; k++) { const a = k * Math.PI / 4; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.stroke(); } });
const taleoM = cutM(taleoT);
{ const t = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), taleoM); t.position.set(0, 3.95, 0); t.castShadow = true; GATE.add(t); const st = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .7, 6), gpM); st.position.set(0, 3.5, 0); GATE.add(st); }
const ROPE = new THREE.Group(); GATE.add(ROPE);
{ const pts = []; for (let k = 0; k <= 20; k++) { const u = k / 20; pts.push(new THREE.Vector3(lerp(-1.9, 1.9, u), .75 - Math.sin(u * Math.PI) * .14, .25)); } const rope = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, .018, 6), M({ color: 0x9a8058 })); rope.castShadow = true; ROPE.add(rope);
  for (let k = 1; k < 6; k++) { const u = k / 6, t = new THREE.Mesh(new THREE.PlaneGeometry(.24, .24), taleoM); t.position.set(lerp(-1.9, 1.9, u), .75 - Math.sin(u * Math.PI) * .14 - .02, .26); ROPE.add(t); } }
const knifeT = ctex(64, 256, (g) => { g.fillStyle = '#c9a36a'; g.strokeStyle = '#3a2a18'; g.lineWidth = 3; g.beginPath(); g.moveTo(22, 6); g.lineTo(42, 6); g.lineTo(44, 70); g.lineTo(50, 74); g.lineTo(48, 200); g.quadraticCurveTo(40, 246, 30, 250); g.quadraticCurveTo(18, 230, 16, 200); g.lineTo(14, 74); g.lineTo(20, 70); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#8a6a40'; g.fillRect(20, 6, 24, 64); g.strokeRect(20, 6, 24, 64); g.strokeStyle = 'rgba(80,56,30,.5)'; g.lineWidth = 2; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(24 + k * 3, 90); g.lineTo(22 + k * 4, 230); g.stroke(); } });
const wingT = ctex(128, 128, (g) => { g.translate(64, 10); for (let k = 0; k < 9; k++) { g.fillStyle = k % 2 ? '#6a4a2c' : '#8a6238'; g.strokeStyle = '#2a1a10'; g.lineWidth = 2; g.beginPath(); g.ellipse(-30 + k * 7, 40 + Math.abs(k - 4) * 4, 7, 40 - Math.abs(k - 4) * 3, (k - 4) * .12, 0, 7); g.fill(); g.stroke(); } g.fillStyle = '#5a3a20'; g.beginPath(); g.ellipse(0, 6, 18, 8, 0, 0, 7); g.fill(); });
const HANG = []; { const kM = cutM(knifeT), wM = cutM(wingT); for (let k = 0; k < 11; k++) { const piv = new THREE.Group(); piv.position.set(-1.7 + k * .34, 2.95, 0); GATE.add(piv); const len = .18 + R(k) * .12;
  const str = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, len, 4), M({ color: 0x8a7050 })); str.position.y = -len / 2; piv.add(str);
  const isW = k % 3 === 1; const p = new THREE.Mesh(new THREE.PlaneGeometry(isW ? .34 : .16, isW ? .34 : .62), isW ? wM : kM); p.position.y = -len - (isW ? .17 : .31); p.castShadow = true; piv.add(p); const p2 = p.clone(); p2.rotation.y = Math.PI / 2; p2.scale.x = .35; piv.add(p2); HANG.push(piv); } }
const SEAT = new THREE.Mesh(new THREE.CylinderGeometry(.36, .42, .42, 12), M({ color: 0x6a6a68, roughness: 1 })); SEAT.scale.z = .8; SEAT.position.set(2.7, .21, .6); SEAT.castShadow = SEAT.receiveShadow = true; ext.add(SEAT);
// incense stand just inside the gate (the shaman's)
const ALTAR = new THREE.Group(); ALTAR.position.set(-1.2, 0, -1.1); ext.add(ALTAR); boxIn(ALTAR, .7, .06, .5, postM, 0, .8, 0); for (const [x, z] of [[-.3, -.2], [.3, -.2], [-.3, .2], [.3, .2]]) boxIn(ALTAR, .05, .8, .05, postM, x, .4, z);
{ const b = new THREE.Mesh(new THREE.CylinderGeometry(.12, .09, .1, 12), M({ color: 0x8a8070 })); b.position.set(0, .88, 0); ALTAR.add(b); for (let k = 0; k < 3; k++) { const s = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, .3, 4), M({ color: 0xc04030, emissive: 0x401008 })); s.position.set(-.03 + k * .03, 1.05, 0); ALTAR.add(s); } }
const SMOKE = []; for (let i = 0; i < 12; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, color: 0xd8d8e0, transparent: true, opacity: 0, depthWrite: false })); ext.add(s); SMOKE.push(s); }
// lights
const hemi = new THREE.HemisphereLight(0xb8c4dc, 0x3a3a2c, 1.25); ext.add(hemi);
const sun = new THREE.DirectionalLight(0xffd8b0, 1.5); sun.position.set(-14, 16, 12); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, far: 70 }); sun.shadow.bias = -.0004; ext.add(sun);
const fillE = new THREE.PointLight(0xc8d0ff, 0, 9, 1.4); ext.add(fillE);
function extMode(m) { ext.background = SKY[m]; const f = { dusk: 0x7a8098, night: 0x1a2440, noon: 0xb4c8dc, dawn: 0x4a4a66 }[m]; ext.fog.color.set(f); ext.fog.near = m === 'night' ? 14 : 30;
  hemi.intensity = { dusk: 1.25, night: .95, noon: 1.5, dawn: 1.0 }[m]; hemi.color.set({ dusk: 0xb8c4dc, night: 0x6a7ab0, noon: 0xe0ecff, dawn: 0x9a9ab8 }[m]);
  sun.intensity = { dusk: 1.5, night: 1.1, noon: 2.6, dawn: .6 }[m]; sun.color.set({ dusk: 0xffd8b0, night: 0x9ab0ff, noon: 0xfff4e0, dawn: 0xc8b0c0 }[m]); sun.position.set(m === 'noon' ? 6 : -14, m === 'noon' ? 24 : 16, 12);
  MIST.forEach(s => s.material.opacity = m === 'noon' ? .18 : m === 'night' ? .2 : .32); MIST.forEach(s => s.material.color.set(m === 'night' ? 0x5a6a8a : 0xc8d0de));
  WINS.forEach(w => w.emissiveIntensity = m === 'night' || m === 'dawn' ? 1.6 : m === 'dusk' ? .7 : 0); fillE.intensity = 0; }

// =============================== INSIDE: the guesthouse room in the town ===============================
const room = new THREE.Scene(); room.background = new THREE.Color(0x05060a);
const plasterT = ctex(256, 256, (g, w, h) => { g.fillStyle = '#7a7a70'; g.fillRect(0, 0, w, h); for (let k = 0; k < 400; k++) { g.fillStyle = `rgba(${R(k) > .5 ? 140 : 50},${R(k) > .5 ? 140 : 50},${R(k) > .5 ? 130 : 46},.12)`; g.beginPath(); g.arc(R(k * 3) * w, R(k * 5) * h, 4 + R(k) * 14, 0, 7); g.fill(); } g.fillStyle = 'rgba(60,50,40,.25)'; g.fillRect(0, h * .78, w, h * .22); }, [3, 1]);
const tileFT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { g.fillStyle = (x + y) % 2 ? '#8a7a66' : '#7e705e'; g.fillRect(x * 64, y * 64, 64, 64); g.strokeStyle = 'rgba(30,24,18,.6)'; g.strokeRect(x * 64, y * 64, 64, 64); } }, [6, 6]);
{ const fl = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), M({ map: tileFT })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; room.add(fl);
  const wm = M({ map: plasterT, side: THREE.DoubleSide });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(6, 2.8), wm); back.position.set(0, 1.4, -2); back.receiveShadow = true; room.add(back);
  for (const sd of [-1, 1]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 2.8), wm); w.rotation.y = -sd * Math.PI / 2; w.position.set(sd * 3, 1.4, .2); w.receiveShadow = true; room.add(w); }
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(6, 5), M({ color: 0x4a4a46 })); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, 2.8, 0); room.add(ceil); }
// window on the back wall: night mountains and rain behind glass, wooden shutters that rattle
const winOutT = ctex(256, 256, (g, w, h) => { const q = g.createLinearGradient(0, 0, 0, h); q.addColorStop(0, '#0a1020'); q.addColorStop(1, '#25304a'); g.fillStyle = q; g.fillRect(0, 0, w, h); g.fillStyle = '#121a2c'; g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 8) g.lineTo(x, h * .55 - 50 * Math.sin(x * .02 + 1) - 20 * Math.sin(x * .07)); g.lineTo(w, h); g.fill(); });
const WIN = new THREE.Group(); WIN.position.set(.9, 1.55, -1.98); room.add(WIN);
{ const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.0), new THREE.MeshBasicMaterial({ map: winOutT })); WIN.add(glass); const fr = M({ color: 0x4a3a2a }); for (const [w, h, x, y] of [[1.25, .07, 0, .53], [1.25, .07, 0, -.53], [.07, 1.1, -.6, 0], [.07, 1.1, .6, 0], [.05, 1.0, 0, 0]]) boxIn(WIN, w, h, .08, fr, x, y, .03); }
const SHUT = []; { const sm_ = M({ color: 0x5a4632 }); for (const sd of [-1, 1]) { const piv = new THREE.Group(); piv.position.set(sd * .62, 0, .06); WIN.add(piv); const s = new THREE.Mesh(new THREE.BoxGeometry(.56, 1.05, .04), sm_); s.position.x = sd * .28; s.castShadow = true; piv.add(s); for (let k = 0; k < 6; k++) boxIn(piv, .5, .025, .05, M({ color: 0x3a2a1c }), sd * .28, -.4 + k * .16, .03, false); piv.userData.sd = sd; SHUT.push(piv); } }
const bedM = M({ color: 0x5a4030 }), sheetM = M({ color: 0x8a8a96 }), blanketM = M({ color: 0x6a3a44 });
const BEDS = [[-1.5, -.9], [1.6, -.6]].map(([x, z]) => { const G = new THREE.Group(); G.position.set(x, 0, z); room.add(G); boxIn(G, 1.3, .38, 2.0, bedM, 0, .19, 0); boxIn(G, 1.2, .14, 1.9, sheetM, 0, .45, 0); boxIn(G, .9, .14, .36, M({ color: 0xc8c8c0 }), 0, .58, -.75);
  const bl = new THREE.Mesh(new THREE.CapsuleGeometry(.32, .9, 6, 12), blanketM); bl.rotation.x = Math.PI / 2; bl.scale.set(1.2, 1, .6); bl.position.set(0, .62, .25); bl.castShadow = true; G.add(bl); G.userData.bl = bl; return G; });
{ const bagM = M({ color: 0x2e4a3a }), helM = M({ color: 0x1a1a22, roughness: .35 }); for (const [x, z, c] of [[-2.4, .4, 0x2e4a3a], [2.5, .7, 0x4a3226]]) { const b = new THREE.Mesh(new THREE.CapsuleGeometry(.22, .3, 4, 10), M({ color: c })); b.position.set(x, .38, z); b.castShadow = true; room.add(b); }
  for (const [x, z] of [[-.2, .8], [.25, .95], [.05, 1.25]]) { const h = new THREE.Mesh(new THREE.SphereGeometry(.17, 14, 10, 0, Math.PI * 2, 0, Math.PI / 1.6), helM); h.position.set(x, .02, z); h.rotation.x = .3; h.castShadow = true; room.add(h); } }
const roomHemi = new THREE.HemisphereLight(0x5a6a9a, 0x1a1410, .55); room.add(roomHemi);
const moonR = new THREE.SpotLight(0x8aa4ff, 18, 12, .6, .6, 1.2); moonR.position.set(1.2, 2.2, -3.2); moonR.target.position.set(0, 0, 1); moonR.castShadow = true; room.add(moonR); room.add(moonR.target);
const phoneL = new THREE.PointLight(0xa8c4ff, 0, 2.5, 1.6); room.add(phoneL);
const bulbL = new THREE.PointLight(0xffd8a0, 0, 8, 1.4); bulbL.position.set(0, 2.5, .2); bulbL.castShadow = true; room.add(bulbL);

// =============================== THE PASS: town roofs in front, the mountain road above; the slope that gives way ===============================
const pass = new THREE.Scene(); pass.background = SKY.dawn; pass.fog = new THREE.Fog(0x2a3048, 20, 160);
const slopeT = ctex(512, 512, (g, w, h) => { g.fillStyle = '#2a3428'; g.fillRect(0, 0, w, h); for (let k = 0; k < 3000; k++) { g.fillStyle = `rgba(${R(k) > .5 ? 60 : 20},${R(k) > .5 ? 74 : 26},${R(k) > .5 ? 50 : 18},.6)`; g.fillRect(R(k * 3) * w, R(k * 7) * h, 4, 4); } g.strokeStyle = '#4a4036'; g.lineWidth = 14; g.beginPath(); g.moveTo(0, h * .8); g.lineTo(w * .55, h * .62); g.lineTo(w * .1, h * .42); g.lineTo(w * .7, h * .22); g.lineTo(w, h * .12); g.stroke(); });
const SLOPE = new THREE.Mesh(new THREE.PlaneGeometry(90, 60, 30, 20), M({ map: slopeT })); { const p = SLOPE.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, 4 * Math.sin(p.getX(i) * .1) * Math.cos(p.getY(i) * .12)); SLOPE.geometry.computeVertexNormals(); } SLOPE.rotation.x = -.55; SLOPE.position.set(0, 20, -70); SLOPE.receiveShadow = true; pass.add(SLOPE);
ridge(pass, -120, '#1e2638', 1.2, 3, 400); ridge(pass, -95, '#1a2030', 1.0, 5, 320);
const SLIDE = new THREE.Group(); SLIDE.position.set(6, 22, -66); pass.add(SLIDE); const dirtM = M({ color: 0x8a6a48, emissive: 0x2a1a0a, emissiveIntensity: .5 });
for (let k = 0; k < 40; k++) { const r = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4 + R(k) * 2.8, 0), dirtM); r.position.set((R(k + 1) - .5) * 14, (R(k + 2) - .5) * 6, (R(k + 3)) * 3); r.userData.v = [(R(k + 4) - .5) * 4, -6 - R(k + 5) * 8, 3 + R(k + 6) * 5]; r.castShadow = true; SLIDE.add(r); }
const DUST = []; for (let i = 0; i < 30; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: mistT, color: 0xa08a70, transparent: true, opacity: 0, depthWrite: false })); pass.add(s); DUST.push(s); }
const TOWN = new THREE.Group(); pass.add(TOWN); const TWIN = [];
for (let k = 0; k < 9; k++) { const x = -14 + k * 3.6 + R(k) * 1.5, z = -8 - R(k + 2) * 8, h = 1.6 + R(k + 3) * 1.6; boxIn(TOWN, 3, h, 3, M({ color: 0x2a2a30 }), x, h / 2, z); const roof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.2, 4), M({ color: 0x3a2a24 })); roof.rotation.y = Math.PI / 4; roof.position.set(x, h + .6, z); TOWN.add(roof);
  const wm = new THREE.MeshStandardMaterial({ color: 0x1a1410, emissive: 0xffb060, emissiveIntensity: R(k + 9) > .4 ? 1.4 : 0 }); const w = new THREE.Mesh(new THREE.PlaneGeometry(.7, .6), wm); w.position.set(x + .5, h * .6, z + 1.52); TOWN.add(w); TWIN.push(wm); }
const pHemi = new THREE.HemisphereLight(0x8a9ac8, 0x202020, 1.6); pass.add(pHemi); const pMoon = new THREE.DirectionalLight(0xb0c0f0, 2.2); pMoon.position.set(-20, 30, 10); pMoon.castShadow = true; Object.assign(pMoon.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, far: 200 }); pass.add(pMoon);
const pFlash = new THREE.PointLight(0xffe0c0, 0, 120, 1.2); pFlash.position.set(6, 30, -50); pass.add(pFlash);

// =============================== PHONE close-up: the photo is a real render of the gate from where Vũ stood ===============================
const phoneS = new THREE.Scene(); phoneS.background = new THREE.Color(0x04050a);
const RT = new THREE.WebGLRenderTarget(540, 960, { samples: 4 }); RT.texture.colorSpace = THREE.SRGBColorSpace;
const photoCam = new THREE.PerspectiveCamera(36, 540 / 960, .05, 600);
const PHONE = new THREE.Group(); phoneS.add(PHONE);
{ const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.92, .08), M({ color: 0x15161a, roughness: .35, metalness: .3 })); PHONE.add(body);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(.9, 1.6), new THREE.MeshBasicMaterial({ map: RT.texture, toneMapped: false })); scr.position.z = .045; PHONE.add(scr); }
const handT = ctex(256, 512, (g, w, h) => { g.fillStyle = '#c9a07e'; g.strokeStyle = '#16141c'; g.lineWidth = 6; g.beginPath(); g.moveTo(40, h); g.lineTo(60, 220); g.quadraticCurveTo(70, 150, 120, 140); g.lineTo(200, 150); g.quadraticCurveTo(232, 170, 214, 196); g.lineTo(150, 214); g.lineTo(190, 470); g.lineTo(200, h); g.closePath(); g.fill(); g.stroke(); g.fillStyle = 'rgba(120,80,50,.25)'; g.fillRect(40, 300, 160, 212); });
for (const sd of [-1, 1]) { const hnd = new THREE.Mesh(new THREE.PlaneGeometry(.55, 1.1), cutM(handT)); hnd.position.set(sd * .52, -.75, .07); hnd.scale.x = sd; PHONE.add(hnd); }
phoneS.add(new THREE.HemisphereLight(0x8090b0, 0x101010, .7)); const phGlow = new THREE.PointLight(0xa8c4ff, 2, 4); phGlow.position.set(0, 0, 1); phoneS.add(phGlow);

// =============================== characters: the 2D rig drawn into cards ===============================
const CARD_H = 2.7, SC = 1.5;
const PRINT = (x, cx, cy, s) => { x.save(); x.translate(cx, cy); x.scale(s, s); x.rotate(.25); x.fillStyle = 'rgba(30,26,36,.82)'; for (let k = 0; k < 4; k++) { x.beginPath(); x.ellipse(-12 + k * 8, 4 + Math.abs(k - 1.5) * 3, 3.2, 12, (k - 1.5) * .12, 0, 7); x.fill(); } x.beginPath(); x.ellipse(-22, 18, 3.2, 9, -.9, 0, 7); x.fill(); x.beginPath(); x.ellipse(0, 20, 12, 9, 0, 0, 7); x.fill(); x.restore(); };
function card(scn, who, ghost = false) { const c = document.createElement('canvas'); c.width = 1024; c.height = 1024; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const mat = new THREE.MeshStandardMaterial({ map: t, transparent: true, alphaTest: .4, side: THREE.DoubleSide, roughness: 1, emissive: ghost ? 0x6a7a80 : 0xffffff, emissiveMap: t, emissiveIntensity: ghost ? .5 : .16, opacity: ghost ? .72 : 1, depthWrite: !ghost });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(CARD_H, CARD_H), mat); m.castShadow = !ghost; m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: t, alphaTest: .4 });
  m.userData.paint = (o) => { const x = c.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, 1024, 1024); RIG.set(x);
    if (who === 'bike1' || who === 'bike2') { const fl = o.flip || 1; RIG.motorbike(512, 1000, 2.9, fl, who === 'bike1' ? '#7a2a20' : '#2a4a6a'); const rp = { view: 'side', flip: fl, legF: [70, -70, 0], legB: [64, -66, 0], armF: [55, -15], armB: [50, -10], lean: 6 };
      if (who === 'bike1') RIG.castMember('khang', 512 - 10 * fl, 822, SC * .95, { ...rp, ...(o.k || {}) }); else { RIG.castMember('duy', 512 - 80 * fl, 818, SC * .9, { ...rp, armF: [40, 60], armB: [30, 60], lean: 4, ...(o.d || {}) }); RIG.castMember('vu', 512 - 6 * fl, 822, SC * .95, { ...rp, ...(o.v || {}) }); } }
    else RIG.castMember(who, 512, 1000, SC, o);
    if (o.print) PRINT(x, 512 + o.print[0], 1000 + o.print[1], 2.4);
    // light from the left, a little shade on the right (only where drawn)
    x.save(); x.globalCompositeOperation = 'source-atop'; const q = x.createLinearGradient(0, 0, 1024, 0); q.addColorStop(0, 'rgba(255,240,220,.10)'); q.addColorStop(.45, 'rgba(0,0,0,0)'); q.addColorStop(1, 'rgba(10,10,30,.2)'); x.fillStyle = q; x.fillRect(0, 0, 1024, 1024); x.restore(); t.needsUpdate = true; };
  m.visible = false; scn.add(m); return m; }
const CAST = ['khang', 'vu', 'duy', 'ong', 'thay', 'bike1', 'bike2'];
const CE = {}, CR = {}; for (const k of CAST) CE[k] = card(ext, k); CE.ghost = card(ext, 'ong', true); for (const k of ['khang', 'vu', 'duy']) CR[k] = card(room, k);
const ALLC = [...Object.values(CE), ...Object.values(CR)];
function put(c, x, z, o = {}, y = 0) { c.visible = true; c.position.set(x, y + CARD_H / 2 - (24 / 1024) * CARD_H, z); c.userData.o = o; }
const cm = (p, l, fov = 40) => { cam.fov = fov; cam.position.set(...p); cam.lookAt(...l); cam.updateProjectionMatrix(); CT = l; };
let CT = [0, 0, 0];
// helpers for acting
let NOW = 0; const idle = (s) => ({ bob: 1.4 * Math.sin(NOW * 2.2 + s), head: 2 * Math.sin(NOW * .9 + s * 2) + 1.2 * Math.sin(NOW * 2.1 + s), blink: ((NOW + s * .7) % (2.6 + (s % 3) * .5)) < .1 ? 1 : 0 });
const TK = sp => { for (const [a, b, s] of TLD.vox) if (s === sp && NOW >= a && NOW < b) return Math.abs(Math.sin(NOW * 13)) * .85; return 0; };
function gait(ph, w) { const leg = p => { const u = ((p / (2 * Math.PI)) % 1 + 1) % 1, th = 18 * Math.sin(2 * Math.PI * u), sp = ((u - .75) % 1 + 1) % 1, sw = sp < .5 ? sp / .5 : -1; const knee = sw >= 0 ? -105 * Math.sin(Math.PI * Math.pow(sw, .6)) - 6 : -4 - 6 * Math.sin(Math.PI * (sp - .5) / .5), foot = sw >= 0 ? (sw < .7 ? 22 * Math.sin(Math.PI * sw / .7) : -14 * Math.sin(Math.PI * (sw - .7) / .3)) : 0; return [th * w, knee * w - 4 * (1 - w), foot * w]; };
  const arm = p => [-26 * Math.sin(p) * w - 4, 82 * w + 16 * (1 - w)]; const s = Math.sin(ph); return { legF: leg(ph), legB: leg(ph + Math.PI), armB: arm(ph), armF: arm(ph + Math.PI), bob: 5 * s * s * w, lean: 6 * w }; }
const SIT = { legsFront: true, legF: [150, -150, 0], legB: [140, -146, 0], lean: -6 };
const BEDSIT = { legsFront: true, legF: [90, -10, 0], legB: [86, -12, 0] };
// the old man's photo state is drawn by rendering the gate set from Vũ's spot into RT
function shootPhoto(state) { const vis = ALLC.map(c => c.visible), ov_ = ALLC.map(c => c.userData.o); ALLC.forEach(c => c.visible = false); extMode('dusk');
  put(CE.khang, .1, -.3, { view: 'back', print: state === 'gone' ? [72, -282] : null });
  if (state !== 'gone') put(CE.ong, .64, -.35, state === 'turned' ? { view: 'front', faceDir: 0, dead: true, armF: [24, 30], armB: [10, 22], bend: 6 } : state === 'point' ? { view: 'three', faceDir: 0, dead: true, armF: [120, -10], armB: [10, 22], bend: 2 } : { view: 'side', flip: -1, bend: 12, lean: 6, armF: [150, 40] });
  photoCam.position.set(.42, 1.35, 3.6); photoCam.lookAt(.4, 1.15, -.3); photoCam.updateProjectionMatrix();
  for (const c of [CE.khang, CE.ong]) if (c.visible) { c.rotation.y = Math.atan2(photoCam.position.x - c.position.x, photoCam.position.z - c.position.z); c.userData.paint(c.userData.o); }
  HANG.forEach((p, i) => { p.rotation.z = .1 * Math.sin(i); }); renderer.setRenderTarget(RT); renderer.render(ext, photoCam); renderer.setRenderTarget(null);
  ALLC.forEach((c, i) => { c.visible = vis[i]; c.userData.o = ov_[i]; }); }
let PHOTO_STATE = null;
function phoneShot(state, lt, D, z0 = 2.6, z1 = 2.2, aim = [0, 0]) { if (PHOTO_STATE !== state) { shootPhoto(state); PHOTO_STATE = state; } PHONE.rotation.set(-.08, .1 + .02 * Math.sin(NOW * .7), -.03); PHONE.position.set(0, -.05, 0); const q = sm(lt / D); cm([aim[0], aim[1] + .05, lerp(z0, z1, q)], [aim[0], aim[1], 0], 40); return 'phone'; }

// =============================== shots ===============================
const S = {}; let MODE = 'ext', TITLE = 0, CTA = 0, FLASH = 0, RAIN = 0, RED = 0, BLACK = 0, SHAKE = 0;
const ST = k => TLD.scenes.find(s => s[0] === k);
const dusk = () => { extMode('dusk'); RAIN = .26; };
S.hook = (lt, D) => { extMode('night'); fillE.intensity = 1.6; fillE.position.set(0, 2.2, 3); const p = sm(lt / D);
  // first sentence: slow push through the rain to the gate; second: the dead man is standing in the gateway
  if (NOW >= BEAT.hook - .05) { put(CE.ghost, 0, -.2, { view: 'front', faceDir: 0, dead: true, armF: [8, 20], armB: [8, 20], bend: 4, ...idle(5), blink: 0 }); }
  cm([lerp(.6, .1, p), lerp(2.0, 1.6, p), lerp(13, 5.2, p)], [0, lerp(2.2, 1.55, p), 0], 40); RAIN = .22; return 'ext'; };
S.title = (lt, D) => { extMode('night'); fillE.intensity = 1.6; fillE.position.set(0, 2.2, 3); TITLE = 1; cm([0, 1.8, lerp(7.5, 6.8, sm(lt / D))], [0, 2.4, 0], 42); RAIN = .22; return 'ext'; };
S.s1 = (lt, D) => { dusk(); const p = sm(lt / D); cm([lerp(-3, .3, p), lerp(7, 2.4, p), lerp(30, 4.5, p)], [0, lerp(3, 2.6, p), 0], lerp(46, 38, p)); return 'ext'; };
S.s2 = (lt, D) => { dusk(); put(CE.thay, -.5, -1.4, { view: 'front', faceDir: .1, armF: [70 + 30 * Math.sin(NOW * 2), 60], armB: [70 + 30 * Math.sin(NOW * 2 + 1), 60], ...idle(3) }); smoke(true); const p = sm(lt / D); cm([lerp(1.2, .4, p), 1.6, lerp(6, 4.2, p)], [-.6, 1.5, -1.2], 40); return 'ext'; };
S.s3 = (lt, D) => { dusk(); const u = lt / D, ride = sm(clamp(u / .5)); const bz = lerp(26, 5.2, ride), bump = (1 - ride) * .02 * Math.sin(NOW * 30);
  const bx = lerp(0, -1.5, sm(seg(u, .4, .55))); put(CE.bike1, bx - .3, bz, { flip: -1, k: idle(1) }, bump); put(CE.bike2, bx + .2, bz + 2.4, { flip: -1, v: idle(2), d: idle(4) }, bump);
  put(CE.ong, 2.7, 1.0, { view: 'three', faceDir: -.3, flip: -1, ...SIT, armF: u > .78 ? [150 + 20 * Math.sin(NOW * 8), 50] : [96, 76], armB: [90, 76], bend: 10, ...idle(5) }, -.21);
  if (u < .62) cm([7.5, 1.7, bz + 2.4], [0, 1.1, bz + 1.4], 44); else cm([lerp(-.6, -.3, u), 1.65, 8.6], [1.3, 1.3, .5], 44); return 'ext'; };
S.O1 = (lt, D) => { dusk(); put(CE.ong, 2.7, 1.0, { view: 'front', faceDir: 0, ...SIT, armF: [150 + 25 * Math.sin(NOW * 7), 50], armB: [76, 76], mouth: TK('ONG'), ...idle(5) }, -.21); cm([2.5, 1.38, lerp(4.9, 4.6, lt / D)], [2.7, 1.2, 1.0], 34); return 'ext'; };
S.s4 = (lt, D) => { dusk(); const u = lt / D, wk = clamp(u / .4), gp = gait(wk * 4 * Math.PI, wk < 1 ? 1 : 0);
  put(CE.khang, 0, lerp(3.2, -.3, sm(wk)), { view: 'back', ...gp, ...idle(1), bob: gp.bob });
  const up = sm(seg(u, .38, .6)); put(CE.ong, lerp(2.7, .75, up), lerp(1.0, -.35, up), up < .5 ? { view: 'three', faceDir: -.3, flip: -1, ...SIT, ...idle(5) } : { view: 'side', flip: -1, bend: 12, lean: 6, armF: [150 * sm(seg(u, .6, .72)), 40], ...idle(5) }, up < .5 ? -.21 : 0);
  if (u < .8) cm([.3 - .2 * u, 1.6, 7.2], [.3, 1.3, 0], 40); else { put(CE.vu, -1.4, 5.0, { view: 'side', flip: 1, armF: [110, 60], armB: [100, 70], ...idle(2) }); cm([-2.9, 1.55, 8.8], [-.5, 1.35, 2.0], 42); }
  if (u > .94 && u < .975) FLASH = .75; return 'ext'; };
S.D1 = (lt, D) => { dusk(); put(CE.duy, -1.2, 4.6, { view: 'three', faceDir: .3, look: .6, brow: 16, armF: [110, 10], armB: [-10, 20], mouth: TK('DUY') + .15, ...idle(4) }); cm([-1.0, 1.42, 7.4], [-1.2, 1.3, 4.6], 34); return 'ext'; };
S.s5 = (lt, D) => { dusk(); const u = lt / D; if (u < .58) { const r = sm(u / .58); const bz = lerp(5.5, 24, r); put(CE.bike1, -.5, bz, { flip: 1, k: idle(1) }); put(CE.bike2, .7, bz - 2.2, { flip: 1, v: { view: u > .25 ? 'back' : 'side', ...idle(2) }, d: idle(4) });
    cm([7, 1.7, lerp(6, 16, r)], [0, 1.2, lerp(6, 20, r)], 42); } else { cm([.2, 1.7, lerp(8, 7, (u - .58) / .42)], [.3, 1.5, 0], 40); } return 'ext'; };
S.s6 = (lt, D) => { const u = lt / D; if (u < .42) { MODE = 'room'; roomNight(); BEDS[0].userData.bl.visible = true; BEDS[1].userData.bl.visible = false;
    put(CR.vu, 1.6, -.6, { view: 'three', faceDir: -.2, ...BEDSIT, armF: [150, 50], armB: [140, 56], look: .3, brow: 10, ...idle(2) }, .3); phoneL.intensity = 2.2; phoneL.position.set(1.5, 1.3, -.1);
    knock(1); cm([.0, 1.55, 2.5], [1.2, 1.15, -.7], 44); return 'room'; }
  return phoneShot(NOW >= BEAT.s6 ? 'turned' : 'normal', lt - D * .42, D * .58, 2.7, NOW >= BEAT.s6 ? 1.55 : 2.3, NOW >= BEAT.s6 ? [.1, .12] : [0, 0]); };
S.s7 = (lt, D) => phoneShot(NOW >= BEAT.s7 ? 'point' : 'turned', lt, D, 2.6, 2.3, [.04, .1]);
S.V1 = (lt, D) => { roomNight(); BEDS[0].userData.bl.visible = false; BEDS[1].userData.bl.visible = false; bulbL.intensity = 0;
  put(CR.vu, .3, .2, { view: 'three', faceDir: -.3, flip: -1, armF: [150, 60], armB: [40, 30], brow: 14, look: -.5, mouth: TK('VU'), ...idle(2) });
  put(CR.khang, -1.5, -.9, { view: 'three', faceDir: .3, ...BEDSIT, shock: 1, mouth: .3, ...idle(1) }, .3); put(CR.duy, -1.1, -1.25, { view: 'front', faceDir: .2, ...BEDSIT, look: .5, ...idle(4) }, .3);
  phoneL.intensity = 2; phoneL.position.set(.5, 1.4, .6); knock(1); cm([1.6, 1.5, 3.2], [-.3, 1.2, -.4], 44); return 'room'; };
S.s8 = (lt, D) => { const a = ST('s8')[1]; if (NOW < BEAT.boom) { roomNight(); BEDS[0].userData.bl.visible = false; BEDS[1].userData.bl.visible = false;
    const k = NOW < BEAT.knockoff ? 1 + 1.5 * sm((NOW - a) / (BEAT.knockoff - a)) : 0; knock(k);
    for (const [kk, x, f] of [['duy', -1.75, .3], ['khang', -1.3, .1], ['vu', -.85, -.1]]) put(CR[kk], x, -.75, { view: 'front', faceDir: f, ...BEDSIT, armF: [20, 90], armB: [20, 90], brow: 12, look: .6, blink: 0, ...(NOW > BEAT.knockoff ? { look: .9 } : {}) }, .3);
    phoneL.intensity = 1.2; phoneL.position.set(-1.3, 1.0, .2); cm([.9 + .1 * Math.sin(NOW * .3), 1.35, 2.6], [-1.3, 1.1, -.8], 44); return 'room'; }
  // the boom: the slope above the town gives way
  const d = NOW - BEAT.boom; SHAKE = d < 2.5 ? .9 * (1 - d / 2.5) : .1; FLASH = d < .08 ? .4 : 0; slide(d); cm([0, 3, 4], [5, 19, -60], 46); return 'pass'; };
S.s9 = (lt, D) => { extMode('noon'); const u = lt / D;
  put(CE.thay, .1, -.7, { view: u < .55 ? 'three' : 'side', faceDir: .3, armF: u > .7 ? [70, 30] : [10, 22], ...idle(3) });
  put(CE.vu, .45, 1.1, { view: 'side', flip: -1, armF: [lerp(10, 80, sm(seg(u, .5, .65))), 20], ...idle(2) }); put(CE.khang, 1.4, 1.7, { view: 'three', faceDir: -.3, flip: -1, ...idle(1) }); put(CE.duy, -1.0, 1.9, { view: 'three', faceDir: .3, ...idle(4) });
  put(CE.bike1, 3.2, 5.5, { flip: -1 }); put(CE.bike2, -3.0, 6.2, { flip: 1, v: { view: 'side' }, d: { view: 'side' } });
  cm([lerp(3.4, 2.6, u), 1.7, lerp(7.2, 6.4, u)], [.3, 1.3, .3], 42); return 'ext'; };
S.T1 = (lt, D) => { extMode('noon'); put(CE.thay, .1, -.7, { view: 'front', faceDir: 0, brow: 14, armF: [10, 22], mouth: TK('THAY'), ...idle(3) }); cm([.25, 1.5, lerp(2.4, 2.2, lt / D)], [.1, 1.35, -.7], 34); return 'ext'; };
S.T2 = (lt, D) => { extMode('noon'); const u = lt / D; put(CE.thay, .1, -.7, { view: 'three', faceDir: .3, brow: 14, armF: u > .35 && u < .7 ? [120, 20] : [10, 22], mouth: TK('THAY'), ...idle(3) }); put(CE.vu, 2.6, -.2, { view: 'three', faceDir: -.4, flip: -1, ...idle(2) });
  cm([lerp(1.9, 1.6, u), 1.55, 3.4], [.1, 1.35, -.7], 36); return 'ext'; };
S.end = (lt, D) => { const z = NOW > BEAT.end ? lerp(2.4, 1.15, sm((NOW - BEAT.end) / 2.4)) : 2.4; return phoneShot('gone', lt, D, z, z, NOW > BEAT.end ? [-.1 * sm((NOW - BEAT.end) / 2.4), -.29 * sm((NOW - BEAT.end) / 2.4)] : [0, 0]); };
S.cta = (lt, D) => { extMode('dusk'); RAIN = .1; CTA = 1; put(CE.khang, 0, 2.6, { view: 'back', ...idle(1) }); cm([0, 1.7, lerp(8, 7.4, lt / D)], [0, 1.9, 0], 42); return 'ext'; };
function roomNight() { MODE = 'room'; bulbL.intensity = 0; moonR.intensity = 18; roomHemi.intensity = .55; }
function knock(k) { SHUT.forEach((s, i) => { s.rotation.y = s.userData.sd * (k > 0 ? .06 * k * Math.max(0, Math.sin(NOW * 21 + i * 2)) : 0); }); }
function smoke(on) { SMOKE.forEach((s, i) => { const p = (NOW * .18 + i / 12) % 1; s.position.set(-1.2 + Math.sin(p * 6 + i) * .08, 1.15 + p * 1.4, -1.1); s.scale.setScalar(.15 + p * .6); s.material.opacity = on ? .22 * Math.sin(p * Math.PI) : 0; }); }
function slide(d) { const p = clamp(d / 3.5); SLIDE.children.forEach(r => { const v = r.userData.v; r.position.x += 0; r.userData.p0 = r.userData.p0 || r.position.clone(); r.position.set(r.userData.p0.x + v[0] * p, r.userData.p0.y + v[1] * p * 1.6, r.userData.p0.z + v[2] * p); r.rotation.set(p * 3 + r.userData.p0.x, p * 2, 0); });
  DUST.forEach((s, i) => { const q = clamp((d - i * .05) / 4); s.position.set(6 + (R(i) - .5) * 22 * (.4 + q), 14 + R(i + 3) * 6 - q * 4, -60 + R(i + 5) * 8); s.scale.set(10 + q * 22, 6 + q * 12, 1); s.material.opacity = d > 0 ? .75 * Math.sin(Math.min(1, q * 1.5) * Math.PI * .5) * (1 - clamp((d - 6) / 4)) : 0; });
  pFlash.intensity = d < 0 ? 0 : 3 * Math.max(0, 1 - d / 1.2); }
const JUMPS = [BEAT.hook, BEAT.s6];

// =============================== overlay ===============================
function rain(a) { g2.strokeStyle = `rgba(210,220,235,${a})`; g2.lineWidth = 1.2; for (let i = 0; i < 160; i++) { const x = ((i * 97) % RW + NOW * 50) % RW, y = ((i * 211) + NOW * 1100) % RH; g2.beginPath(); g2.moveTo(x, y); g2.lineTo(x - 7, y + 26); g2.stroke(); } }
function subs(t) { for (const [a, b, str, sp] of TLD.subs) { if (t < a || t >= b) continue; const al = 1; g2.save(); g2.globalAlpha = al; g2.textAlign = 'center'; g2.lineJoin = 'round'; g2.font = 'bold 42px "DejaVu Sans"';
  const ws = str.split(' '); const L = []; let c = ''; for (const w of ws) { const tt = c ? c + ' ' + w : w; if (g2.measureText(tt).width > 620 && c) { L.push(c); c = w; } else c = tt; } if (c) L.push(c); const lh = 54, y0 = 1010 - (L.length - 1) * lh / 2;
  const col = sp === 'ONG' ? '#ff5050' : sp === 'N' ? '#ffffff' : '#ffd76a'; L.forEach((l, i) => { g2.lineWidth = 9; g2.strokeStyle = '#000'; g2.strokeText(l, RW / 2, y0 + i * lh); g2.fillStyle = col; g2.fillText(l, RW / 2, y0 + i * lh); }); g2.restore(); } }
function fit(s, maxW, size, font) { g2.font = `${font} ${size}px "DejaVu Serif"`; const w = g2.measureText(s).width; g2.font = `${font} ${Math.min(size, size * maxW / w)}px "DejaVu Serif"`; }
function titleTxt(lt, a) { g2.save(); g2.globalAlpha = a; g2.textAlign = 'center'; g2.lineJoin = 'round'; g2.shadowColor = 'rgba(255,0,0,.7)'; g2.shadowBlur = 24; g2.fillStyle = '#d42a2a';
  for (const [s, y] of [['CỔNG LÀNG', 560], ['TREO DAO GỖ', 680]]) { fit(s, 620, 112, 'bold'); g2.lineWidth = 10; g2.strokeStyle = '#000'; g2.strokeText(s, RW / 2, y); g2.fillText(s, RW / 2, y); }
  g2.shadowBlur = 0; fit('Thấy cổng này... đừng bước qua', 600, 42, 'italic bold'); g2.fillStyle = '#f0e4c8'; g2.globalAlpha = a * sm(seg(lt, .5, 1.1)); g2.lineWidth = 6; g2.strokeStyle = '#000'; g2.strokeText('Thấy cổng này... đừng bước qua', RW / 2, 790); g2.fillText('Thấy cổng này... đừng bước qua', RW / 2, 790); g2.restore(); }
function ctaTxt(a) { g2.save(); g2.globalAlpha = a * .6; g2.textAlign = 'center'; g2.font = 'italic 24px "DejaVu Sans"'; g2.fillStyle = '#e0e0e0'; g2.fillText('Câu chuyện chỉ là hư cấu', RW / 2, RH - 60); g2.restore();
  g2.save(); g2.globalAlpha = a; g2.textAlign = 'center'; g2.lineJoin = 'round'; g2.lineWidth = 10; g2.strokeStyle = '#000'; fit('BẠN CÓ DÁM BƯỚC QUA?', 640, 66, '900'); g2.strokeText('BẠN CÓ DÁM BƯỚC QUA?', RW / 2, 250); g2.fillStyle = '#ff2a2a'; g2.fillText('BẠN CÓ DÁM BƯỚC QUA?', RW / 2, 250);
  g2.font = 'bold 32px "DejaVu Sans"'; g2.lineWidth = 6; g2.strokeText('Theo dõi @chuyendongtaykimco', RW / 2, 316); g2.fillStyle = '#fff'; g2.fillText('Theo dõi @chuyendongtaykimco', RW / 2, 316); g2.restore(); }
const SCN = { ext, room, pass, phone: phoneS };
window.dbgPhoto = st => { PHOTO_STATE = null; ALLC.forEach(c => c.visible = false); phoneShot(st, 0, 1, 2.7, 2.7); renderer.render(phoneS, cam); g2.clearRect(0, 0, RW, RH); };

// =============================== frame ===============================
window.draw = (t) => { NOW = t; const sc = TLD.scenes.find(s => t >= s[1] && t < s[2]) || TLD.scenes[TLD.scenes.length - 1]; const [k, a, b] = sc; const lt = t - a, D = b - a;
  ALLC.forEach(c => c.visible = false); TITLE = 0; CTA = 0; FLASH = 0; RAIN = 0; RED = 0; BLACK = 0; SHAKE = 0; MODE = 'ext'; smoke(false); SLIDE.children.forEach(r => { if (r.userData.p0) r.position.copy(r.userData.p0); }); DUST.forEach(s => s.material.opacity = 0); g2.clearRect(0, 0, RW, RH);
  const mode = S[k](lt, D);
  // jumpscares: camera snaps toward what it looks at, shakes, white flash then a red wash
  let JF = -1; for (const tj of JUMPS) { const dt = t - tj; if (dt < 0 || dt > 1.3) continue; const z = dt < .1 ? dt / .1 * .45 : .45 * Math.max(0, 1 - (dt - .1) / 1.2); const tv = new THREE.Vector3(...CT); cam.position.lerp(tv, z); if (dt < .5) { const a2 = .05 * (1 - dt / .5); cam.position.x += (R(t * 977) - .5) * a2 * 2; cam.position.y += (R(t * 631) - .5) * a2 * 2; } cam.lookAt(tv); JF = dt; }
  if (SHAKE) { cam.position.x += (R(t * 977) - .5) * SHAKE; cam.position.y += (R(t * 631) - .5) * SHAKE * .6; }
  for (const c of ALLC) if (c.visible) { c.rotation.y = Math.atan2(cam.position.x - c.position.x, cam.position.z - c.position.z); c.userData.paint(c.userData.o); const br = .01 * Math.sin(t * 2.2 + c.position.x * 3); c.scale.set(1, 1 + br, 1); }
  HANG.forEach((p, i) => { const w = k === 'hook' || k === 'title' ? 1.6 : k === 'cta' ? .8 : k.startsWith('T') || k === 's9' ? .4 : 1; p.rotation.z = w * (.12 * Math.sin(t * 2.1 + i * .9) + .05 * Math.sin(t * 5.3 + i)); p.rotation.x = w * .08 * Math.sin(t * 1.7 + i * 1.3); });
  PLANTS.forEach((p, i) => p.rotation.z = .03 * Math.sin(t * 1.2 + i)); MIST.forEach((s, i) => s.position.x = ((R(i + 5) - .5) * 160 + t * .6 + 80) % 160 - 80);
  renderer.render(SCN[mode], cam);
  const vg = g2.createRadialGradient(RW / 2, RH / 2, RH * .3, RW / 2, RH / 2, RH * .78); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.22)'); g2.fillStyle = vg; g2.fillRect(0, 0, RW, RH);
  if (RAIN && mode === 'ext') rain(RAIN);
  if (FLASH) { g2.fillStyle = `rgba(235,240,255,${FLASH})`; g2.fillRect(0, 0, RW, RH); }
  if (JF >= 0 && JF < .3) { if (JF < .06) { g2.fillStyle = 'rgba(255,255,255,.55)'; g2.fillRect(0, 0, RW, RH); } else { g2.fillStyle = `rgba(160,0,0,${.3 * (1 - JF / .3)})`; g2.fillRect(0, 0, RW, RH); } }
  if (TITLE) titleTxt(lt, sm(seg(lt, .1, .6)));
  if (CTA) ctaTxt(sm(seg(lt, .1, .6)));
  const d = Math.min(t - a, b - t); if (d < .08 && a > 0) { g2.fillStyle = `rgba(0,0,0,${1 - d / .08})`; g2.fillRect(0, 0, RW, RH); }
  if (k !== 'title') subs(t); };
document.fonts.ready.then(() => { window.READY = true; });
