// PS1-style look test for "Vũng giữ xác": low-res render, wobbly vertex snapping, tiny nearest-filtered textures,
// segmented low-poly characters animated joint by joint, dark fog, 15-bit colour.
import * as THREE from 'three';
const OW = 720, OH = 1280, LW = 240, LH = 426; // output size / internal PS1 resolution
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true }); renderer.setPixelRatio(1); renderer.setSize(OW, OH); renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);
const RT = new THREE.WebGLRenderTarget(LW, LH, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter }); RT.texture.colorSpace = THREE.SRGBColorSpace;
const cam = new THREE.PerspectiveCamera(50, LW / LH, .1, 300);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x1a2132); scene.fog = new THREE.Fog(0x1a2132, 12, 80);
const R = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const lerp = (a, b, t) => a + (b - a) * t, clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
// ---- PS1 material: vertex snapped to the low-res pixel grid (the famous wobble), Lambert lighting, nearest textures
function psx(mat) { mat.onBeforeCompile = sh => { sh.vertexShader = sh.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
  vec2 grid = vec2(${LW / 2}.0, ${LH / 2}.0); gl_Position.xy = floor(gl_Position.xy / gl_Position.w * grid + .5) / grid * gl_Position.w;`); }; return mat; }
const L = (o) => psx(new THREE.MeshLambertMaterial(o));
function ptex(w, h, fn, rep) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.magFilter = t.minFilter = THREE.NearestFilter; t.generateMipmaps = false; t.colorSpace = THREE.SRGBColorSpace; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); } return t; }
const noise = (g, w, h, cols, n = 1) => { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { g.fillStyle = cols[(R(x * 31 + y * 7 + n) * cols.length) | 0]; g.fillRect(x, y, 1, 1); } };
// ---- textures (all tiny)
const T = {
  plank: ptex(32, 32, (g, w, h) => { noise(g, w, h, ['#4a3828', '#523e2c', '#45331f']); g.fillStyle = '#2a1e14'; for (let y = 0; y < h; y += 8) g.fillRect(0, y, w, 1); g.fillRect(14, 0, 1, 8); g.fillRect(4, 8, 1, 8); g.fillRect(22, 16, 1, 8); g.fillRect(10, 24, 1, 8); }, [4, 1]),
  weave: ptex(32, 32, (g, w, h) => { for (let y = 0; y < h; y += 4) for (let x = 0; x < w; x += 4) { g.fillStyle = ((x + y) / 4) % 2 ? '#6a5a40' : '#56482f'; g.fillRect(x, y, 4, 4); } }, [3, 2]),
  thatch: ptex(32, 32, (g, w, h) => { noise(g, w, h, ['#4a4230', '#3e3626', '#5a4e36']); g.fillStyle = '#2e281c'; for (let x = 0; x < w; x += 3) g.fillRect(x, 0, 1, h); }, [3, 2]),
  grass: ptex(32, 32, (g, w, h) => noise(g, w, h, ['#1e2a18', '#24321c', '#1a2414', '#2a3820']), [60, 60]),
  water: ptex(32, 32, (g, w, h) => { noise(g, w, h, ['#0e1820', '#101c26', '#0c141c']); g.fillStyle = '#2a3c4a'; for (let k = 0; k < 10; k++) g.fillRect((R(k) * w) | 0, (R(k + 5) * h) | 0, 3 + (R(k + 2) * 5 | 0), 1); }, [40, 40]),
  rock: ptex(16, 16, (g, w, h) => noise(g, w, h, ['#3a3a3a', '#444240', '#2e2e2e'])),
  bamboo: ptex(32, 64, (g, w, h) => { g.clearRect(0, 0, w, h); for (let k = 0; k < 4; k++) { g.fillStyle = ['#2e4a22', '#3a5a2a', '#24401c'][k % 3]; g.fillRect(8 + k * 5, 10, 2, h - 10); for (let y = 6; y < h - 8; y += 7) { g.fillRect(3 + k * 5 + (y % 2) * 6, y, 6, 2); } } }),
  mountain: ptex(128, 32, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#10141c'; g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 4) g.lineTo(x, 12 + 9 * Math.sin(x * .07) + 5 * Math.sin(x * .23)); g.lineTo(w, h); g.fill(); }),
};
// ---- ground, river, far mountains (billboard strips like PS1 skyboxes)
{ const gr = new THREE.Mesh(new THREE.PlaneGeometry(300, 300, 30, 30), L({ map: T.grass })); gr.rotation.x = -Math.PI / 2; gr.position.set(0, .05, 154); const p = gr.geometry.attributes.position; for (let i = 0; i < p.count; i++) if (p.getY(i) < -12 || true) {} scene.add(gr); }
const WATER = new THREE.Mesh(new THREE.PlaneGeometry(300, 120, 20, 20), psx(new THREE.MeshBasicMaterial({ map: T.water, color: 0xb8c8e0, transparent: true, opacity: .82, depthWrite: false }))); WATER.rotation.x = -Math.PI / 2; WATER.position.set(0, 0, -30); scene.add(WATER);
{ const bank = new THREE.Mesh(new THREE.PlaneGeometry(300, 60, 30, 6), L({ map: T.grass })); bank.rotation.x = -Math.PI / 2; bank.position.set(0, .1, -120); scene.add(bank); }
for (const [z, s, y] of [[-75, 1, 0], [-95, 1.4, 4]]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(260 * s, 40 * s), psx(new THREE.MeshBasicMaterial({ map: T.mountain, transparent: true, alphaTest: .5, fog: true }))); m.position.set(0, 18 * s + y - 6, z); scene.add(m); }
// stars
{ const g = new THREE.BufferGeometry(); const a = []; for (let i = 0; i < 160; i++) a.push((R(i) - .5) * 300, 40 + R(i + 1) * 60, -110); g.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0x8a90a8, size: 1, sizeAttenuation: false, fog: false }))); }
// ---- props
const box = (par, w, h, d, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); par.add(m); return m; };
const MP = L({ map: T.plank }), MW = L({ map: T.weave }), MT = L({ map: T.thatch, side: THREE.DoubleSide }), POST = L({ color: 0x2a1e14 });
// pier from the bank (z=+4) out over the water to z=-8
const PIER = new THREE.Group(); scene.add(PIER); box(PIER, 2.2, .14, 12, MP, 0, .6, -2); for (let z = 3; z >= -8; z -= 2.2) for (const x of [-1, 1]) box(PIER, .14, 1.6, .14, POST, x, -.1, z);
// lantern on a post at the pier end
box(PIER, .1, 1.8, .1, POST, -.95, 1.5, -7.6); const lamp = box(PIER, .2, .24, .2, new THREE.MeshBasicMaterial({ color: 0xffb060 }), -.95, 2.5, -7.6);
const LAMP = new THREE.PointLight(0xffa040, 10, 12, 1.4); LAMP.position.set(-.95, 2.3, -7.3); scene.add(LAMP);
// stilt houses on the near bank and across
function house(x, z, ry, lit) { const G = new THREE.Group(); G.position.set(x, 0, z); G.rotation.y = ry; scene.add(G); for (const px of [-2, 0, 2]) for (const pz of [-1.2, 1.2]) box(G, .14, 1.6, .14, POST, px, .8, pz);
  box(G, 4.6, 1.6, 2.8, MW, 0, 2.4, 0); for (const sd of [-1, 1]) { const r = new THREE.Mesh(new THREE.BoxGeometry(5.4, .12, 2.2), MT); r.position.set(0, 3.7, sd * .85); r.rotation.x = sd * .85; G.add(r); }
  const w = box(G, .6, .5, .05, new THREE.MeshBasicMaterial({ color: lit ? 0xd88a3a : 0x0a0806 }), .9, 2.5, 1.42); return G; }
house(-6, 7, .1, true); house(6, 8, -.2, false); house(-12, -70, Math.PI, true); house(8, -72, Math.PI + .2, true); house(22, -68, Math.PI - .1, false);
// bamboo sprites (camera-facing, like PS1 foliage)
const SPR = []; for (let i = 0; i < 40; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.bamboo, fog: true, color: 0x8a9a80 })); const near = i < 18; s.scale.set(3, 6, 1); s.position.set(near ? (i % 2 ? 1 : -1) * (4 + R(i) * 14) : (R(i) - .5) * 80, 3, near ? 5 + R(i + 1) * 6 : -66 - R(i + 2) * 6); scene.add(s); SPR.push(s); }
// rocks around the cove and the little shrine
for (let k = 0; k < 14; k++) { const m = new THREE.Mesh(new THREE.DodecahedronGeometry(.6 + R(k) * .9, 0), L({ map: T.rock })); m.position.set(-14 + k * 2.4 + R(k) * 2, .1, -18 - R(k + 4) * 4); scene.add(m); }
const SHR = new THREE.Group(); SHR.position.set(-5, 0, -16); scene.add(SHR); box(SHR, .8, .9, .7, L({ color: 0x5a5650 }), 0, .45, 0); const sr = new THREE.Mesh(new THREE.ConeGeometry(.75, .5, 4), L({ color: 0x4a2a20 })); sr.position.y = 1.15; sr.rotation.y = Math.PI / 4; SHR.add(sr);
box(SHR, .03, .2, .03, new THREE.MeshBasicMaterial({ color: 0xff5020 }), 0, 1.0, .36);
// the boat
function boatMesh() { const G = new THREE.Group(); const sh = new THREE.Shape(); sh.moveTo(-2.4, 0); sh.quadraticCurveTo(0, -.9, 2.5, .1); sh.lineTo(2.5, .3); sh.lineTo(-2.4, .3); const geo = new THREE.ExtrudeGeometry(sh, { depth: 1.1, bevelEnabled: false, steps: 1, curveSegments: 3 }); geo.translate(0, 0, -.55);
  G.add(new THREE.Mesh(geo, MP)); box(G, .1, .06, 1.0, POST, -1, .25, 0); box(G, .1, .06, 1.0, POST, 1.2, .25, 0); scene.add(G); return G; }
const BOAT = boatMesh();
// fishing rod + line
const ROD = new THREE.Mesh(new THREE.CylinderGeometry(.015, .03, 2.6, 4), L({ color: 0x5a4a30 })); scene.add(ROD);
const LINE = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: 0x9a9a9a })); scene.add(LINE);

// ---- low-poly people, one step up from boxes (late-PS1 look): tapered 6-8 sided limbs, round head with a painted face, hair cap, hands, sandals
function faceTex(kind) { return ptex(128, 64, (g, w, h) => { // wraps round the head: face centred at x=32 (front), back of head at x=96
  const dead = kind === 'dead', old = kind === 'old', sk = dead ? '#a8b0ae' : old ? '#946443' : '#b5835c', hairC = old ? '#7a7670' : dead ? '#0e1012' : '#16120f', px = (c, x, y, ww = 1, hh = 1) => { g.fillStyle = c; g.fillRect(x, y, ww, hh); };
  px(sk, 0, 0, w, h);
  px(dead ? 'rgba(60,80,80,.22)' : 'rgba(110,50,25,.16)', 19, 34, 26, 14); px('rgba(80,40,20,.14)', 17, 26, 4, 18); px('rgba(80,40,20,.14)', 43, 26, 4, 18); // cheeks, face sides
  px(hairC, 0, 0, w, old ? 14 : 18); px(hairC, 64, 0, 64, old ? 30 : 40); px(hairC, 8, 18, 6, 12); px(hairC, 50, 18, 6, 12); // hairline, back, sideburns
  if (!old) { for (let x = 16; x < 48; x += 4) px(hairC, x, 18, 3, 2 + ((x * 7) % 3)); } // ragged fringe edge
  const brow = dead ? '#3c4446' : old ? '#8a8478' : '#22160f'; px(brow, 19, 23, 9, 2); px(brow, 36, 23, 9, 2); px(brow, 23, 22, 5, 1); px(brow, 36, 22, 5, 1);
  if (dead) { px('#465052', 19, 26, 10, 6); px('#465052', 35, 26, 10, 6); px('#bfc4c0', 21, 28, 5, 2); px('#bfc4c0', 38, 28, 5, 2); }
  else { px('rgba(60,30,15,.35)', 19, 26, 10, 1); px('rgba(60,30,15,.35)', 35, 26, 10, 1); // upper lids
    px('#b4a490', 21, 27, 7, 3); px('#b4a490', 36, 27, 7, 3); px('#2a1810', 23, 27, 3, 3); px('#2a1810', 38, 27, 3, 3); px('#0c0806', 24, 28, 1, 1); px('#0c0806', 39, 28, 1, 1);
    px('rgba(60,30,15,.2)', 20, 30, 8, 1); px('rgba(60,30,15,.2)', 36, 30, 8, 1); } // lower lids
  px('rgba(70,35,20,.35)', 30, 29, 1, 8); px('rgba(255,220,190,.12)', 32, 29, 2, 8); px('rgba(70,35,20,.45)', 28, 37, 8, 2); px('rgba(40,20,10,.5)', 29, 38, 2, 1); px('rgba(40,20,10,.5)', 33, 38, 2, 1); // nose
  px(dead ? '#4e5658' : '#6e3a2c', 27, 43, 10, 1); px(dead ? '#5a6264' : '#8a4a38', 28, 44, 8, 2); px('rgba(40,20,10,.35)', 26, 43, 1, 1); px('rgba(40,20,10,.35)', 37, 43, 1, 1); // mouth, lower lip, corners
  if (old) { px('rgba(60,30,20,.4)', 20, 19, 24, 1); px('rgba(60,30,20,.35)', 22, 21, 20, 1); px('rgba(150,145,138,.35)', 20, 45, 24, 12); px('rgba(150,145,138,.3)', 26, 40, 12, 2); px(sk, 20, 0, 24, 9); }  // grey stubble, receding hairline
  if (!old && !dead) { px('rgba(30,20,15,.22)', 20, 46, 24, 10); px('rgba(30,20,15,.16)', 26, 40, 12, 2); } // stubble + moustache shadow
}); }
function clothTex(base, kind) { return ptex(32, 32, (g, w, h) => { noise(g, w, h, [base, base, shade(base, -.08), shade(base, .05)], kind.length);
  if (kind === 'shirt') { g.fillStyle = shade(base, -.3); g.fillRect(0, 0, 1, h); g.fillRect(w - 1, 0, 1, h); g.fillStyle = '#d0c8b8'; for (let y = 6; y < h; y += 7) g.fillRect(1, y, 1, 1); g.fillStyle = shade(base, -.2); g.fillRect(0, 0, w, 2); }
  if (kind === 'baba') { g.fillStyle = shade(base, -.07); g.fillRect(0, 0, 1, h); g.fillStyle = '#4a4036'; for (let y = 4; y < h; y += 6) g.fillRect(0, y, 1, 1); g.fillStyle = shade(base, -.12); g.fillRect(4, 22, 6, 1); g.fillRect(4, 22, 1, 6); g.fillRect(9, 22, 1, 6); g.fillRect(w - 10, 22, 6, 1); g.fillRect(w - 10, 22, 1, 6); g.fillRect(w - 5, 22, 1, 6); }
  if (kind === 'pants') { g.fillStyle = shade(base, -.25); g.fillRect(0, 0, w, 3); }
}); }
function shade(hex, k) { const n = parseInt(hex.slice(1), 16), f = v => Math.max(0, Math.min(255, Math.round(v * (1 + k * 2)))); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; }
function person(o) { const P = new THREE.Group(); scene.add(P); const S = o.s || 1, hx = c => '#' + new THREE.Color(c).getHexString();
  const skinC = o.dead ? 0xa8b0ae : o.old ? 0x946443 : 0xb5835c, skin = L({ color: skinC }), shirt = L({ map: clothTex(hx(o.shirt), o.baba ? 'baba' : 'shirt') }), sleeve = L({ map: clothTex(hx(o.shirt), 'sleeve') }), pants = L({ map: clothTex(hx(o.pants), 'pants') });
  const hairM = L({ color: o.old ? 0x7a7670 : o.dead ? 0x0e1012 : 0x16120f }), sandal = L({ color: 0x2a2018 });
  const J = (par, x, y, z) => { const g = new THREE.Group(); g.position.set(x, y, z); par.add(g); return g; };
  const add = (par, geo, mat, x, y, z, sx = 1, sy = 1, sz = 1) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); par.add(m); return m; };
  const cyl = (rt, rb, h, n = 6) => new THREE.CylinderGeometry(rt * S, rb * S, h * S, n);
  const hips = J(P, 0, .92 * S, 0); add(hips, cyl(.17, .16, .22, 8), pants, 0, 0, 0, 1.15, 1, .8);
  const spine = J(hips, 0, .1 * S, 0);
  add(spine, cyl(.23, .16, .56, 8), shirt, 0, .28 * S, 0, 1.1, 1, .68); // chest wider at the shoulders
  add(spine, new THREE.SphereGeometry(.1 * S, 6, 4), sleeve, -.21 * S, .5 * S, 0, 1, .8, 1); add(spine, new THREE.SphereGeometry(.1 * S, 6, 4), sleeve, .21 * S, .5 * S, 0, 1, .8, 1); // shoulder caps
  if (o.baba) add(spine, cyl(.2, .225, .27, 8), shirt, 0, -.085 * S, 0, 1.12, 1, .8); // bà ba hem hangs past the hips
  const neck = J(spine, 0, .58 * S, 0); add(neck, cyl(.055, .065, .12, 6), skin, 0, .02 * S, 0);
  if (!o.baba) add(neck, new THREE.CylinderGeometry(.09 * S, .11 * S, .05 * S, 8, 1, true), L({ color: o.shirt, side: THREE.DoubleSide }), 0, -.01 * S, .01 * S); // collar
  const head = add(neck, new THREE.SphereGeometry(.15 * S, 10, 8), L({ map: faceTex(o.dead ? 'dead' : o.old ? 'old' : 'n') }), 0, .21 * S, 0, .92, 1.12, 1); head.rotation.y = 0;
  add(neck, new THREE.SphereGeometry(.105 * S, 6, 4, 0, Math.PI * 2, Math.PI * .45, Math.PI * .45), skin, 0, .14 * S, .025 * S, 1, 1, 1); // jaw fill
  add(neck, new THREE.SphereGeometry(.03 * S, 4, 3), skin, -.14 * S, .2 * S, 0, .5, 1, .8); add(neck, new THREE.SphereGeometry(.03 * S, 4, 3), skin, .14 * S, .2 * S, 0, .5, 1, .8); // ears
  if (!o.old) { add(neck, new THREE.SphereGeometry(.158 * S, 8, 5, 0, Math.PI * 2, 0, Math.PI * .42), hairM, 0, .225 * S, -.012 * S, .96, 1.18, 1.05); // hair volume
    for (let k = -2; k <= 2; k++) { const f = add(neck, new THREE.BoxGeometry(.05 * S, .07 * S, .03 * S), hairM, k * .045 * S, .305 * S - Math.abs(k) * .006 * S, .125 * S - Math.abs(k) * .012 * S); f.rotation.set(-.5, k * .25, k * .15); } // fringe chunks
    for (const x of [-1, 1]) { const sd = add(neck, new THREE.BoxGeometry(.025 * S, .08 * S, .1 * S), hairM, x * .128 * S, .27 * S, -.01 * S); sd.rotation.z = x * -.2; } }
  else { add(neck, new THREE.SphereGeometry(.152 * S, 8, 4, 0, Math.PI * 2, 0, Math.PI * .3), hairM, 0, .22 * S, -.02 * S, .95, 1.1, 1); } // short grey hair, no beard
  if (o.scarf) { const kr = ptex(16, 4, (g, w, h) => { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { g.fillStyle = (x + y) % 2 ? '#1a1a1a' : '#d8d4c8'; g.fillRect(x, y, 1, 1); } }); kr.wrapS = THREE.RepeatWrapping; kr.repeat.set(2, 1);
    add(neck, new THREE.TorusGeometry(.085 * S, .03 * S, 4, 8), L({ map: kr }), 0, -.02 * S, .01 * S).rotation.x = Math.PI / 2; const tail = add(neck, new THREE.BoxGeometry(.06 * S, .16 * S, .02 * S), L({ map: kr }), .04 * S, -.11 * S, .1 * S); tail.rotation.z = .2; } // khăn rằn
  if (o.hat) add(neck, new THREE.ConeGeometry(.42 * S, .26 * S, 8), L({ color: 0xb8a070 }), 0, .46 * S, 0);
  const hand = (par, y, side) => { const h = J(par, 0, y, 0); add(h, new THREE.BoxGeometry(.075 * S, .1 * S, .035 * S), skin, 0, -.05 * S, 0); add(h, new THREE.BoxGeometry(.025 * S, .05 * S, .025 * S), skin, side * .045 * S, -.03 * S, .015 * S).rotation.z = side * .5; };
  const arm = (x, side) => { const a = J(spine, x, .5 * S, 0); add(a, o.baba ? cyl(.07, .068, .3) : cyl(.062, .05, .3), sleeve, 0, -.15 * S, 0); const b = J(a, 0, -.3 * S, 0); add(b, o.baba ? cyl(.066, .068, .27) : cyl(.048, .038, .27), o.longSleeve === false ? skin : sleeve, 0, -.135 * S, 0);
    add(b, cyl(.042, .038, .04), skin, 0, -.285 * S, 0); hand(b, -.3 * S, side); return [a, b]; };
  const leg = (x) => { const a = J(hips, x, -.06 * S, 0); add(a, cyl(.085, .065, .43), pants, 0, -.215 * S, 0); const b = J(a, 0, -.43 * S, 0); add(b, cyl(.062, .048, .36), pants, 0, -.18 * S, 0); // sole lands exactly at the root (y=0) so feet sit on the ground
    add(b, cyl(.04, .045, .04), skin, 0, -.36 * S, 0); add(b, new THREE.BoxGeometry(.1 * S, .045 * S, .2 * S), skin, 0, -.3875 * S, .045 * S); add(b, new THREE.BoxGeometry(.11 * S, .02 * S, .22 * S), sandal, 0, -.42 * S, .045 * S); return [a, b]; };
  const [uaL, faL] = arm(-.25 * S, -1), [uaR, faR] = arm(.25 * S, 1), [thL, shL] = leg(-.09 * S), [thR, shR] = leg(.09 * S);
  const rig = { P, hips, spine, neck, uaL, faL, uaR, faR, thL, shL, thR, shR, S, o }; if (o.ghost) P.traverse(m => { if (m.material) { const mm = Array.isArray(m.material) ? m.material : [m.material]; mm.forEach(x => { x.transparent = true; x.opacity = .7; x.depthWrite = false; }); } }); return rig; }
// poses in degrees: { torso lean, head tilt/turn, arms [shoulder pitch, shoulder roll, elbow], legs [hip, knee] }
function pose(r, p) { const d = THREE.MathUtils.degToRad, S = r.S;
  r.P.position.set(p.x || 0, (p.y || 0), p.z || 0); r.P.rotation.y = p.yaw || 0; r.hips.position.y = .92 * S + (p.bob || 0) - (p.sit ? .45 * S : 0);
  r.spine.rotation.set(d(p.lean || 0), d(p.twist || 0), d(p.side || 0)); r.neck.rotation.set(d(p.nod || 0), d(p.turn || 0), d(p.tilt || 0));
  const A = (ua, fa, a) => { ua.rotation.set(d(-(a[0] || 0)), 0, d(a[1] || 0)); fa.rotation.set(d(-(a[2] || 0)), 0, 0); };
  A(r.uaL, r.faL, p.armL || [0, -6, 8]); A(r.uaR, r.faR, p.armR || [0, 6, 8]);
  const G = (th, sh, l) => { th.rotation.set(d(-(l[0] || 0)), 0, 0); sh.rotation.set(d(l[1] || 0), 0, 0); }; G(r.thL, r.shL, p.legL || [0, 0]); G(r.thR, r.shR, p.legR || [0, 0]); }
function walk(ph, amp = 1) { const s = Math.sin(ph), c = Math.cos(ph); return { legL: [28 * s * amp, Math.max(0, -50 * c) * amp + 4], legR: [-28 * s * amp, Math.max(0, 50 * c) * amp + 4], armL: [-24 * s * amp, -8, 18], armR: [24 * s * amp, 8, 18], bob: .03 * Math.abs(Math.sin(ph)) * amp, lean: 4 }; }
// Lực: faded blue short-sleeve shirt, dark trousers; Thìn: earth-brown áo bà ba (not ivory, no goatee: keep clear of any real historical figure's look), black trousers, khăn rằn round the neck; the ghost is Lực himself, same clothes
const LUC = person({ shirt: 0x4a5866, pants: 0x2a2c30, longSleeve: false }), THIN = person({ shirt: 0x5e4630, pants: 0x1a1816, old: true, s: .95, scarf: true, baba: true }), GH = person({ shirt: 0x4a5866, pants: 0x2a2c30, longSleeve: false, dead: true, ghost: true });
const ALL = [LUC, THIN, GH];

// ---- post: 15-bit colour + light 4x4 ordered dither, nearest upscale
const post = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: { t: { value: RT.texture }, dith: { value: .6 } }, vertexShader: 'varying vec2 v; void main(){ v = uv; gl_Position = vec4(position.xy, 0., 1.); }',
  fragmentShader: `uniform sampler2D t; uniform float dith; varying vec2 v; float b(vec2 p){ int x=int(mod(p.x,4.)), y=int(mod(p.y,4.)); int i=x+y*4; float m[16]=float[16](0.,8.,2.,10.,12.,4.,14.,6.,3.,11.,1.,9.,15.,7.,13.,5.); return m[i]/16.-.5; }
  void main(){ vec2 px = floor(v * vec2(${LW}., ${LH}.)); vec3 c = texture2D(t, (px + .5) / vec2(${LW}., ${LH}.)).rgb; c = pow(c, vec3(1./2.2)); c += b(px) * dith / 32.; c = floor(c * 31. + .5) / 31.; gl_FragColor = vec4(c, 1.); }` }));
const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); postScene.add(post);
scene.add(new THREE.HemisphereLight(0x8a9ac0, 0x2a2a24, 2)); scene.add(new THREE.AmbientLight(0x404858, 1)); const moon = new THREE.DirectionalLight(0xa0b0e0, 1.6); moon.position.set(-10, 20, -10); scene.add(moon);

// ---- test shots
const cm = (p, l, fov = 50) => { cam.fov = fov; cam.position.set(...p); cam.lookAt(...l); cam.updateProjectionMatrix(); };
const SH = {
  // D: medium close-up, Lực and Thìn talking on the pier (the reference channel's most common framing)
  mcu: t => { GH.P.visible = false; LUC.P.visible = THIN.P.visible = true; ROD.visible = LINE.visible = false; BOAT.position.set(2.6, .05, -6);
    pose(LUC, { x: 0, y: .67, z: -6.5, yaw: .5, nod: 4 + 3 * Math.sin(t * 2), armL: [10, -8, 40], armR: [30 + 6 * Math.sin(t * 3), 6, 70], bob: .01 * Math.sin(t * 1.8) });
    pose(THIN, { x: .9, y: .67, z: -5.5, yaw: Math.PI + .6, lean: 8, nod: 6, armL: [0, -6, 10], armR: [0, 6, 10] });
    cm([1.7, 2.45, -3.2], [-.1, 2.15, -6.5], 30); },
  // A: Lực fishing alone in the cove at night
  fish: t => { GH.P.visible = false; THIN.P.visible = false; LUC.P.visible = true; BOAT.position.set(0, .05 + .03 * Math.sin(t * 1.3), -14); BOAT.rotation.set(.02 * Math.sin(t), .3, .02 * Math.sin(t * .8));
    const br = Math.sin(t * 1.8); pose(LUC, { x: -.4, y: BOAT.position.y + .1, z: -14.2, yaw: .3 + Math.PI / 2, sit: true, legL: [80, 85], legR: [76, 90], armL: [55, -10, 40 + 3 * br], armR: [60, 10, 34 + 3 * br], lean: 12 + 2 * br, nod: 6 + 3 * Math.sin(t * .6) });
    ROD.visible = LINE.visible = true; const hx = BOAT.position.x + .4, hz = BOAT.position.z - .4; ROD.position.set(hx + 1.0, 1.7, hz - .6); ROD.rotation.set(-.2, 0, -1.0);
    const tip = new THREE.Vector3(hx + 2.1, 2.3, hz - .9), a = LINE.geometry.attributes.position; a.setXYZ(0, tip.x, tip.y, tip.z); a.setXYZ(1, tip.x + .2, 0, tip.z - .3); a.needsUpdate = true;
    cm([3.2 - .05 * t, 1.8, -9.6 + .05 * t], [-.2, .9, -14], 46); },
  // B: Thìn walks along the pier toward Lực at dawn-dark
  walk: t => { GH.P.visible = false; LUC.P.visible = THIN.P.visible = true; ROD.visible = LINE.visible = false; BOAT.position.set(2.6, .05, -6); BOAT.rotation.set(0, .2, 0);
    pose(LUC, { x: 0, y: .67, z: -6.5, yaw: 0, nod: 4 * Math.sin(t * .7), armL: [0, -6, 10], armR: [0, 6, 10], bob: .01 * Math.sin(t * 1.8) });
    const wz = lerp(3, -4.6, clamp(t / 4)); pose(THIN, { x: 0, y: .67, z: wz, yaw: Math.PI, ...walk(t * 5.4, t < 4 ? 1 : 0), lean: 10 });
    cm([2.4, 1.7, -10.5], [0, 1.3, -4.5], 44); },
  // C: the reveal: Lực looks down off the pier; under the surface his own drowned face
  water: t => { LUC.P.visible = true; THIN.P.visible = false; GH.P.visible = true; ROD.visible = LINE.visible = false; BOAT.position.set(9, .05, -20);
    pose(LUC, { x: 0, y: .67, z: -7.4, yaw: Math.PI, lean: 38, nod: 34, armL: [20, -10, 20], armR: [20, 10, 20] });
    pose(GH, { x: 0, y: 0, z: 0, armL: [0, -20, 0], armR: [0, 20, 0] }); GH.P.position.set(.1, -.35, -9.6); GH.P.rotation.set(-Math.PI / 2, 0, Math.PI); GH.P.position.y = -.35 + .03 * Math.sin(t * 1.2);
    cm([3.6, 2.6, -5.2], [0, .3, -8.6], 48); },
};
window.render = (shot, t) => { WATER.material.map.offset.set(t * .01, t * .02); SPR.forEach((s, i) => s.position.x += 0); SH[shot](t);
  renderer.setRenderTarget(RT); renderer.render(scene, cam); renderer.setRenderTarget(null); renderer.render(postScene, postCam); };
window.READY = true;
