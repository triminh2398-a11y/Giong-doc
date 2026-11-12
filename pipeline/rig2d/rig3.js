// 2D skeletal rig demo: bone hierarchy (FK), procedural walk, springs for lantern/scarf/hair, face swaps, glowing-eyes ghost.
const W = 720, H = 1280, FPS = 30, DUR = 10;
const cv = document.getElementById('c'), g = cv.getContext('2d');
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, t) => a + (b - a) * t, rad = d => d * Math.PI / 180;
const sm = t => { t = clamp(t); return t * t * t * (t * (t * 6 - 15) + 10); };
const back = (t, s = 1.7) => { t = clamp(t) - 1; return t * t * ((s + 1) * t + s) + 1; };
const seg = (t, a, b) => clamp((t - a) / (b - a));
const INK = '#16141c';
let RS = 11; const rnd = () => (RS = (RS * 16807) % 2147483647) / 2147483647;
// ---------------- background (painted once into layers) ----------------
function layer(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); return c; }
const SKY = layer(W, H, (x, w, h) => { const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#141a26'); gr.addColorStop(.55, '#2a3446'); gr.addColorStop(1, '#3a4252'); x.fillStyle = gr; x.fillRect(0, 0, w, h);
  x.fillStyle = 'rgba(230,236,240,.9)'; x.beginPath(); x.arc(540, 230, 46, 0, 7); x.fill(); const hl = x.createRadialGradient(540, 230, 40, 540, 230, 220); hl.addColorStop(0, 'rgba(200,214,230,.25)'); hl.addColorStop(1, 'rgba(200,214,230,0)'); x.fillStyle = hl; x.fillRect(300, 0, 480, 480); });
const FAR = layer(1600, H, (x, w) => { x.fillStyle = '#232a38'; x.beginPath(); x.moveTo(0, 760); for (let i = 0; i <= 16; i++) x.lineTo(i * 100, 640 + Math.sin(i * 1.7) * 60 + (i % 3) * 25); x.lineTo(w, H); x.lineTo(0, H); x.fill(); });
const MID = layer(1800, H, (x, w) => { for (let i = 0; i < 40; i++) { const tx = i * 46 + rnd() * 20, th = 260 + rnd() * 220, base = 860; x.fillStyle = i % 2 ? '#1b212c' : '#1f2632';
  x.fillRect(tx - 5, base - th, 10, th); for (let k = 0; k < 4; k++) { x.beginPath(); x.ellipse(tx + (rnd() - .5) * 30, base - th + k * 34, 34 + rnd() * 20, 26 + rnd() * 10, 0, 0, 7); x.fill(); } }
  x.fillStyle = '#1a1f29'; x.fillRect(0, 850, w, 40); });
const GROUND = layer(2000, 520, (x, w, h) => { const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2c3340'); gr.addColorStop(1, '#1c2029'); x.fillStyle = gr; x.fillRect(0, 0, w, h);
  x.fillStyle = '#3a3f4a'; x.beginPath(); x.moveTo(0, 150); x.bezierCurveTo(500, 120, 900, 170, 1400, 140); x.lineTo(2000, 150); x.lineTo(2000, 230); x.bezierCurveTo(1400, 220, 900, 250, 0, 240); x.fill();
  for (let i = 0; i < 260; i++) { x.strokeStyle = ['#283020', '#2f3826', '#22291c'][i % 3]; x.lineWidth = 2; const gx = rnd() * w, gy = 40 + rnd() * (h - 40); x.beginPath(); x.moveTo(gx, gy); x.lineTo(gx + (rnd() - .5) * 8, gy - 10 - rnd() * 18); x.stroke(); } });
// Jrai grave house (world space, right side): tall patterned roof, dark doorway, fence, statues covering their faces
const ROCK = layer(900, 1100, (x) => { x.strokeStyle = INK; x.lineJoin = 'round';
  x.fillStyle = 'rgba(0,0,0,.35)'; x.beginPath(); x.ellipse(450, 1030, 400, 40, 0, 0, 7); x.fill();
  // walls + doorway
  x.fillStyle = '#2b2622'; x.lineWidth = 4; x.beginPath(); x.rect(230, 700, 440, 330); x.fill(); x.stroke();
  for (let i = 0; i < 9; i++) { x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 2; x.beginPath(); x.moveTo(240 + i * 50, 705); x.lineTo(240 + i * 50, 1025); x.stroke(); }
  x.fillStyle = '#050408'; x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.rect(330, 740, 240, 290); x.fill(); x.stroke();
  // steep roof with muted triangle rows
  x.save(); x.beginPath(); x.moveTo(120, 720); x.lineTo(450, 110); x.lineTo(780, 720); x.closePath(); x.clip();
  x.fillStyle = '#2e2629'; x.fillRect(100, 100, 700, 640);
  const cols = ['#6a3c36', '#8c8272', '#3a3034'];
  for (let row = 0; row < 9; row++) { const y0 = 140 + row * 66, y1 = y0 + 66; for (let k = -1; k < 14; k++) { const cx = 120 + k * 52 + (row % 2) * 26; x.fillStyle = cols[(k + row * 2 + 9) % 3]; x.beginPath(); x.moveTo(cx - 20, y1); x.lineTo(cx, y0 + 6); x.lineTo(cx + 20, y1); x.closePath(); x.fill(); } x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(100, y1 - 4, 700, 4); }
  x.restore(); x.strokeStyle = INK; x.lineWidth = 5; x.beginPath(); x.moveTo(120, 720); x.lineTo(450, 110); x.lineTo(780, 720); x.closePath(); x.stroke();
  x.lineWidth = 6; x.beginPath(); x.moveTo(450, 110); x.lineTo(450, 40); x.stroke();
  // fence posts
  for (let i = 0; i < 12; i++) { const px = 70 + i * 70, ph = 70 + (i % 3) * 14; x.fillStyle = '#3a2f26'; x.beginPath(); x.roundRect(px - 9, 1040 - ph, 18, ph + 10, 6); x.fill(); x.lineWidth = 3; x.stroke(); }
  // grave statues: crouching figures with both hands over the face
  const statue = (sx, sc) => { x.save(); x.translate(sx, 1040); x.scale(sc, sc); x.fillStyle = '#7a5638'; x.strokeStyle = INK; x.lineWidth = 3.5;
    x.beginPath(); x.roundRect(-30, -40, 60, 40, 6); x.fill(); x.stroke();
    x.beginPath(); x.ellipse(0, -100, 40, 58, 0, 0, 7); x.fill(); x.stroke();
    x.beginPath(); x.ellipse(0, -186, 36, 40, 0, 0, 7); x.fill(); x.stroke();
    x.fillStyle = '#6a4a30'; for (const s of [-1, 1]) { x.beginPath(); x.ellipse(s * 15, -184, 17, 24, s * .15, 0, 7); x.fill(); x.stroke(); }
    x.strokeStyle = 'rgba(30,20,12,.5)'; x.lineWidth = 2; for (let k = 0; k < 5; k++) { x.beginPath(); x.moveTo(-28, -130 + k * 14); x.quadraticCurveTo(0, -122 + k * 14, 28, -130 + k * 14); x.stroke(); }
    x.restore(); };
  statue(175, .9); statue(820, 1); });
// ---------------- skeletal rig ----------------
// bones: angles in degrees, 0 = straight down, positive = clockwise (toward facing direction)
const P = { skin: '#e6cbb2', skinD: '#c9a88e', jacket: '#4a5470', jacketD: '#353d54', pants: '#262a36', scarf: '#7a3a3a', hair: '#14121a', shoe: '#18161c' };
function limb(len, w0, w1, col, colD) { // tapered capsule along +y
  g.beginPath(); g.moveTo(-w0, 0); g.quadraticCurveTo(-w0 - 2, len * .5, -w1, len); g.arc(0, len, w1, Math.PI, 0, true); g.quadraticCurveTo(w0 + 2, len * .5, w0, 0); g.arc(0, 0, w0, 0, Math.PI, true); g.closePath();
  const gr = g.createLinearGradient(-w0, 0, w0, 0); gr.addColorStop(0, col); gr.addColorStop(1, colD); g.fillStyle = gr; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); }
function bone(ang, len, draw, child) { g.save(); g.rotate(rad(-ang)); draw && draw(); if (child) { g.translate(0, len); child(); } g.restore(); }
function face(o) {
  const d = o.faceDir, ex = d * 26, R = 74;
  // ear peeks out behind the head on the far side
  if (Math.abs(d) > .15) { g.beginPath(); g.ellipse(-Math.sign(d) * (R - 4), 10, 12, 17, 0, 0, 7); g.fillStyle = P.skinD; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); }
  // head shape
  g.beginPath(); g.ellipse(0, 0, R, R * 1.05, 0, 0, 7); const gr = g.createRadialGradient(-20 + d * 10, -20, 10, 0, 0, R * 1.1); gr.addColorStop(0, P.skin); gr.addColorStop(1, P.skinD); g.fillStyle = gr; g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke();
  // ear on the far side

  // eyes with dark rings
  for (const s of [-1, 1]) { const x = ex + s * 27 * (1 - Math.abs(d) * .25), y = 6, sc = 1 - (s === Math.sign(-d) ? Math.abs(d) * .25 : 0);
    g.fillStyle = 'rgba(60,40,60,.35)'; g.beginPath(); g.ellipse(x, y + 6, 20 * sc, 20, 0, 0, 7); g.fill();
    if (o.blink > .5) { g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 13 * sc, y + 2); g.quadraticCurveTo(x, y + 8, x + 13 * sc, y + 2); g.stroke(); continue; }
    const big = o.shock ? 1.25 : 1; g.fillStyle = '#f2eee8'; g.beginPath(); g.ellipse(x, y, 14 * sc * big, 17 * big, 0, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 2.5; g.stroke();
    g.fillStyle = '#1a1420'; g.beginPath(); g.ellipse(x + o.look * 6 * sc, y + 2, (o.shock ? 4.5 : 7.5) * sc, o.shock ? 5 : 9, 0, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(x + o.look * 6 * sc - 2, y - 3, 2.4, 0, 7); g.fill(); }
  // brows
  g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = 'round'; for (const s of [-1, 1]) { const x = ex + s * 27; g.beginPath(); g.moveTo(x - 12, -22 + s * o.brow * .3 - (o.shock ? 8 : 0)); g.lineTo(x + 12, -22 - s * o.brow * .3 - (o.shock ? 8 : 0)); g.stroke(); }
  // nose + mouth
  g.lineWidth = 2.5; g.beginPath(); g.moveTo(ex + d * 6, 22); g.lineTo(ex + d * 10, 32); g.lineTo(ex + d * 3, 34); g.stroke();
  const mo = o.mouth; g.fillStyle = '#4a2028'; g.beginPath(); g.ellipse(ex + d * 4, 50, 9 + mo * 3, 2 + mo * 11, 0, 0, 7); if (mo > .08) { g.fill(); } g.stroke();
  // hair: cap + bangs + a spring tuft
  g.fillStyle = P.hair; g.beginPath(); g.ellipse(-d * 4, -34, R + 4, R * .72, 0, Math.PI * 1.02, Math.PI * 1.98); g.quadraticCurveTo(R * .7 + d * 10, -6, R * .4, -24); for (let k = 0; k < 5; k++) { const bx = R * .4 - k * 30; g.quadraticCurveTo(bx - 14, -6 + (k % 2) * 6, bx - 30, -26); } g.quadraticCurveTo(-R - 6, 0, -R - 2, -20); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
  g.save(); g.translate(-d * 10, -R * .95); g.rotate(rad(o.tuft)); g.beginPath(); g.moveTo(-6, 6); g.quadraticCurveTo(-4, -26, 14, -34); g.quadraticCurveTo(4, -12, 8, 6); g.fill(); g.restore();
}
// joint positions by forward kinematics (0 deg = straight down, + = toward facing side), then each limb is stroked as ONE continuous path
const dirv = a => [Math.sin(rad(a)), Math.cos(rad(a))];
const add2 = (p, a, l) => { const d = dirv(a); return [p[0] + d[0] * l, p[1] + d[1] * l]; };
function stroke3(pts, w, col, ink = 3) { g.lineCap = 'round'; g.lineJoin = 'round';
  const path = () => { g.beginPath(); g.moveTo(...pts[0]); g.quadraticCurveTo(...pts[1], (pts[1][0] + pts[2][0]) / 2, (pts[1][1] + pts[2][1]) / 2); g.lineTo(...pts[2]); };
  path(); g.strokeStyle = INK; g.lineWidth = w + ink * 2; g.stroke(); path(); g.strokeStyle = col; g.lineWidth = w; g.stroke(); }
// fleshy limb: a filled, tapered tube along a smooth curve through the joint, with a shaded far side and a crease at the bend
function fleshLimb(p, w, col, colD, bulge = 0) {
  const N = 18, L = [], R = [], S = [];
  for (let i = 0; i <= N; i++) { const u = i / N, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u;
    const x = a * p[0][0] + b * p[1][0] + c * p[2][0], y = a * p[0][1] + b * p[1][1] + c * p[2][1];
    const tx = 2 * (1 - u) * (p[1][0] - p[0][0]) + 2 * u * (p[2][0] - p[1][0]), ty = 2 * (1 - u) * (p[1][1] - p[0][1]) + 2 * u * (p[2][1] - p[1][1]), l = Math.hypot(tx, ty) || 1;
    const nx = -ty / l, ny = tx / l, ww = (u < .5 ? lerp(w[0], w[1], u * 2) : lerp(w[1], w[2], u * 2 - 1)) + bulge * Math.sin(Math.min(1, u * 2) * Math.PI);
    L.push([x + nx * ww, y + ny * ww]); R.push([x - nx * ww, y - ny * ww]); S.push([x - nx * ww * .15, y - ny * ww * .15]); }
  const poly = (A, B) => { g.beginPath(); g.moveTo(...A[0]); for (const q of A) g.lineTo(...q); for (let i = B.length - 1; i >= 0; i--) g.lineTo(...B[i]); g.closePath(); };
  g.lineJoin = 'round'; poly(L, R); g.fillStyle = col; g.fill();
  poly(S, R); g.fillStyle = colD; g.fill();
  poly(L, R); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
  // crease on the inside of the bend
  const m = 9; g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(...L[m - 2]); g.quadraticCurveTo(...L[m], ...L[m + 2].map((v, k) => v + (S[m][k] - L[m][k]) * .35)); g.stroke();
  return { end: p[2], dir: Math.atan2(p[2][0] - p[1][0], p[2][1] - p[1][1]) };
}
function cuffHand(e, dark, skin) { g.save(); g.translate(...e.end); g.rotate(-e.dir);
  g.fillStyle = dark; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.roundRect(-13, -6, 26, 9, 3); g.fill(); g.stroke();
  g.fillStyle = skin; g.beginPath(); g.ellipse(0, 12, 10, 12, 0, 0, 7); g.fill(); g.stroke();
  g.beginPath(); g.ellipse(9, 6, 4.5, 7, -.5, 0, 7); g.fill(); g.stroke(); g.restore(); }
function boot(e, dark) { g.save(); g.translate(...e.end); g.fillStyle = dark ? '#121015' : P.shoe; g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath(); g.roundRect(-13, -12, 26, 10, 3); g.fillStyle = dark ? '#191b22' : '#2c303c'; g.fill(); g.stroke(); // pant hem
  g.fillStyle = dark ? '#121015' : P.shoe; g.beginPath(); g.moveTo(-14, -3); g.quadraticCurveTo(-16, 10, -10, 12); g.lineTo(30, 12); g.quadraticCurveTo(32, 2, 18, -1); g.quadraticCurveTo(4, -6, -14, -3); g.fill(); g.stroke();
  g.strokeStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.moveTo(-10, 9); g.lineTo(28, 9); g.stroke(); g.restore(); }
function character(o) {
  g.save(); g.translate(o.x, o.y + o.bob * 1.35); g.scale(1.35 * o.flip, 1.35); g.scale(1 + o.squash * .06, 1 - o.squash * .08);
  const T = o.lean + o.spine, L1 = 54, L2 = 52, A1 = 44, A2 = 42, bd = o.bend || 0;
  const hip = [0, -(L1 + L2) + 2], chest0 = add2(hip, 180 + T, 88 + (o.bob || 0) * .4), chest = [chest0[0] + bd, chest0[1]], neck = add2(chest, 180 + T + bd * .6, 6);
  const leg = (q, x) => { const h = [hip[0] + x, hip[1] + 6], k = add2(h, q[0] + o.lean * .3, L1), f = add2(k, q[0] + q[1] + o.lean * .3, L2); return [h, k, f]; };
  const arm = (q, sh) => { const e = add2(sh, q[0] + o.lean, A1), hd = add2(e, q[0] + q[1] + o.lean, A2); return [sh, e, hd]; };
  const LB = leg(o.legB, -9), LF = leg(o.legF, 9), AB = arm(o.armB, [chest[0] - 14, chest[1] + 12]), AF = arm(o.armF, [chest[0] + 12, chest[1] + 12]);
  // back arm + back leg (in shadow)
  cuffHand(fleshLimb(AB, [15, 13.5, 12], '#3a4258', '#2c3244', 1.5), '#262b3a', P.skinD);
  boot(fleshLimb(LB, [16, 14, 13], '#1c1f28', '#15171e', 1.5), 1);
  // front leg
  boot(fleshLimb(LF, [16, 14, 13], P.pants, '#1c1f29', 1.5), 0);
  // jacket: full body with shoulders, a hem that covers the hips, collar, zip, pocket and a shaded side
  g.save(); g.translate(...hip); g.rotate(rad(T));
  const J = () => { g.beginPath(); g.moveTo(-36, 22); g.quadraticCurveTo(-46 + bd * .5, -40, -38 + bd, -86); g.quadraticCurveTo(-22 + bd, -100, bd, -100); g.quadraticCurveTo(22 + bd, -100, 38 + bd, -86); g.quadraticCurveTo(46 + bd * .5, -40, 38, 22); g.quadraticCurveTo(0, 30, -36, 22); g.closePath(); };
  J(); g.fillStyle = P.jacket; g.fill();
  g.save(); J(); g.clip(); g.fillStyle = P.jacketD; g.beginPath(); g.moveTo(14 + bd, -110); g.quadraticCurveTo(22 + bd * .6, -40, 16, 40); g.lineTo(60, 40); g.lineTo(60, -110); g.fill();
  g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(-50, 8, 100, 30); // hem band
  g.restore(); J(); g.strokeStyle = INK; g.lineWidth = 3.2; g.stroke();
  g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.moveTo(-34, 9); g.quadraticCurveTo(0, 16, 36, 9); g.stroke();
  g.strokeStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.moveTo(2 + bd, -92); g.quadraticCurveTo(3 + bd * .5, -40, 2, 24); g.stroke(); // zip
  g.fillStyle = '#3e4660'; g.strokeStyle = INK; g.lineWidth = 2.2; g.beginPath(); g.roundRect(-30 + bd * .3, -30, 20, 18, 3); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-30 + bd * .3, -25); g.lineTo(-10 + bd * .3, -25); g.stroke(); // pocket
  for (const s of [-1, 1]) { g.fillStyle = s < 0 ? '#56607e' : '#3e4660'; g.beginPath(); g.moveTo(bd + s * 4, -98); g.lineTo(bd + s * 24, -94); g.lineTo(bd + s * 8, -74); g.closePath(); g.fill(); g.stroke(); } // collar
  g.beginPath(); g.ellipse(bd, -97, 22, 8, 0, 0, 7); g.fillStyle = P.scarf; g.fill(); g.stroke();
  g.save(); g.translate(-12 + bd, -94); g.rotate(rad(o.scarf)); g.beginPath(); g.moveTo(-7, 0); g.quadraticCurveTo(-12, 34, -5, 58); g.lineTo(8, 55); g.quadraticCurveTo(3, 30, 7, 0); g.closePath(); g.fillStyle = P.scarf; g.fill(); g.stroke(); g.restore();
  g.restore();
  // front arm with the lantern
  const fa = fleshLimb(AF, [15, 13.5, 12], P.jacket, P.jacketD, 1.5); cuffHand(fa, '#2c3244', P.skin);
  g.save(); g.translate(...AF[2]); g.translate(0, 4); g.rotate(rad(o.lanternSwing)); lantern(o); g.restore();
  // neck + head
  g.save(); g.translate(...neck); g.rotate(rad(T * .5 - o.neck)); g.fillStyle = P.skinD; g.fillRect(-8, -12, 16, 16); g.strokeStyle = INK; g.lineWidth = 2.5; g.strokeRect(-8, -12, 16, 16);
  g.translate(0, -64); g.rotate(rad(-o.head)); face(o); g.restore();
  g.restore();
}
// temporal smoothing + follow-through: every joint is a weighted average of nearby times, limbs and head trail the body slightly
function smoothPose(t) { const ks = [-3, -2, -1, 0, 1, 2, 3], wt = ks.map(k => Math.exp(-k * k / 4)), h = 1 / 60;
  const avg = (tt) => { const ps = ks.map(k => pose(Math.max(0, tt + k * h))), sw = wt.reduce((a, b) => a + b), out = { ...ps[3] };
    for (const key in out) { const v = out[key]; if (typeof v === 'number') out[key] = ps.reduce((a, p, i) => a + p[key] * wt[i], 0) / sw; else if (Array.isArray(v)) out[key] = v.map((_, j) => ps.reduce((a, p, i) => a + p[key][j] * wt[i], 0) / sw); }
    return out; };
  const o = avg(t), lag = avg(Math.max(0, t - .06)), lagH = avg(Math.max(0, t - .04));
  o.armB = lag.armB; o.armF = lag.armF; o.head = lagH.head; o.faceDir = lagH.faceDir; o.blink = pose(t).blink; o.mouth = pose(t).mouth; o.shock = pose(t).shock; return o; }
function lantern(o) { g.save(); g.strokeStyle = '#2a2420'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 44); g.stroke();
  g.translate(0, 44); g.fillStyle = '#3a2e22'; g.fillRect(-16, 0, 32, 8); const fl = .85 + .15 * Math.sin(o.t * 23) * Math.sin(o.t * 7);
  const gl = g.createRadialGradient(0, 30, 2, 0, 30, 26); gl.addColorStop(0, `rgba(255,236,170,${fl})`); gl.addColorStop(1, 'rgba(255,150,60,.85)'); g.fillStyle = gl; g.beginPath(); g.roundRect(-14, 8, 28, 44, 8); g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
  g.fillStyle = '#3a2e22'; g.fillRect(-16, 50, 32, 7); g.restore(); }
// ---------------- performance (pure functions of t; springs integrated from t=0) ----------------
const walkEnd = 0, stopEnd = 0;
const jumpT = 7.0;
const V0 = 118, WSTOP = 3.5; // walk speed px/s, eases to a stop by WSTOP
const vel = t => V0 * (1 - sm(seg(t, 2.5, WSTOP)));
function walkX(t) { let x = -110, n = 80, h = Math.min(t, WSTOP) / n; for (let i = 0; i < n; i++) x += vel((i + .5) * h) * h; return x; }
function rootX(t) { // walks in, eases to a stop, slow weight shift; flinches back at the scare with anticipation + overshoot
  const idle = sm(seg(t, 3.3, 4.3));
  const pre = t > 6.82 ? 8 * Math.sin(seg(t, 6.82, 7.0) * Math.PI / 2) * (1 - seg(t, 7.0, 7.1)) : 0;
  return walkX(t) + 5 * Math.sin((t - 3.3) * 1.1) * idle * (1 - seg(t, 6.6, 7)) + pre - (t > jumpT ? 42 * back(seg(t, jumpT, jumpT + .4), 1.6) : 0); }
function pose(t) {
  const w = vel(t) / V0, ph = (walkX(t) + 110) / 150 * Math.PI * 2, s = Math.sin(ph), c = Math.cos(ph);
  const br = Math.sin(t * 2.3) * (1 - w), sway = Math.sin(t * 1.1) * (1 - w);
  const o = { t, x: rootX(t), y: 1040, flip: 1, bob: 1.8 * br - 7 * Math.abs(c) * w, lean: 1.5 * sway + 5 * w, bend: 3 + 2 * br + 3 * w,
    legF: [lerp(6 + 2 * sway, 26 * s, w), lerp(-4, -40 * Math.max(0, -s) - 6, w), 0], legB: [lerp(-8 + 2 * sway, -26 * s, w), lerp(-3, -40 * Math.max(0, s) - 6, w), 0],
    armB: [lerp(-6 + 3 * br, -24 * s - 4, w), lerp(16 + 2 * br, 22, w)], armF: [lerp(18 + 2 * sway, 10 * s + 18, w), 30], spine: 0, neck: 0, head: 2 * Math.sin(t * .9) + 1.2 * Math.sin(t * 2.1),
    faceDir: .5, look: .2, blink: 0, brow: 0, mouth: 0, shock: 0, squash: 0, tuft: 0, scarf: 0, lanternSwing: 0 };
  // a slow, eased head turn toward the grave house, the body follows a beat later (overlap)
  const turn = sm(seg(t, 3.2, 4.2)), body = sm(seg(t, 3.5, 4.5));
  o.faceDir = lerp(.5, .2, turn); o.look = lerp(.2, .9, turn); o.head += -7 * turn + 2.5 * Math.sin(ph) * w; o.lean += 3 * body; o.bend += 5 * body;
  o.armF[0] += 8 * body; o.armF[1] += 6 * body; // lifts the lantern toward the house
  const sp = seg(t, 4.7, 6.1); if (sp > 0 && sp < 1) { o.mouth = Math.abs(Math.sin(t * 13)) * (Math.sin(sp * Math.PI * 3) > -.4 ? .85 : .1); o.brow = 10; }
  if (t > 6.2 && t < 7) { const f = sm(seg(t, 6.2, 6.8)); o.brow = 10 + 6 * f; o.look = .9 + .1 * f; o.bend -= 4 * f; o.head += -3 * f; }
  for (const b of [1.4, 3.1, 4.5, 6.5]) if (Math.abs(t - b) < .06) o.blink = 1;
  // startle: crouch a hair (anticipation), then recoil with overshoot and a slow settle
  if (t > 6.82) { const an = seg(t, 6.82, 7.0); o.squash = .5 * Math.sin(an * Math.PI / 2) * (t < 7 ? 1 : 0); }
  if (t > jumpT) { const st = seg(t, jumpT, jumpT + .4), se = back(st, 1.6), rel = sm(seg(t, 7.6, 9)); o.shock = 1; o.squash = Math.sin(st * Math.PI) * 1.1;
    o.armB = [lerp(o.armB[0], 140 - 20 * rel, se), 34]; o.armF = [lerp(o.armF[0], 150 - 20 * rel, se), 28]; o.lean = -9 * se + 2 * Math.sin(t * 9) * (1 - rel); o.bend = -6 * se; o.head -= 5; o.mouth = .8; o.brow = 18; o.faceDir = .1; o.look = 1; o.legF[0] = -8; o.legB[0] = 16; }
  return o;
}
function springs(T) { // integrate secondary motion deterministically
  let la = 0, lv = 0, ta = 0, tv = 0, sa = 0, sv = 0, pv = 0; const dt = 1 / 120;
  for (let t = 0; t <= T; t += dt) { const v = (rootX(t + dt) - rootX(t)) / dt, acc = (v - pv) / dt; pv = v;
    lv += (-60 * la - 3 * lv - acc * .9) * dt; la += lv * dt; tv += (-90 * ta - 6 * tv - acc * .25) * dt; ta += tv * dt; sv += (-40 * sa - 3 * sv + acc * .35) * dt; sa += sv * dt; }
  return { lantern: clamp(la, -40, 40), tuft: clamp(ta, -30, 30), scarf: clamp(18 + sa + pv * .03, -10, 60) }; }
// ---------------- ghost: eyes in the cave dark, then a pale face at 70% ----------------
function ghostB(ctx, t) { const ev = { face: 7.6 }; const seg = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a))); const ease = { inOutQuad: x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2 };
      const V = 'B';
      // body: thin shoulders in a dark cloth, so it reads as a person, not a floating mask
      ctx.fillStyle = '#16171c'; ctx.beginPath(); ctx.moveTo(-50, 108); ctx.lineTo(50, 108); ctx.quadraticCurveTo(70, 150, 112, 300); ctx.lineTo(-112, 300); ctx.quadraticCurveTo(-70, 150, -50, 108); ctx.fill();
      ctx.fillStyle = '#7d8984'; ctx.fillRect(-10, 104, 20, 40);
      // hair mass behind, middle-parted, frames the face
      ctx.fillStyle = '#1d1f26'; ctx.beginPath(); ctx.moveTo(0, -108); ctx.bezierCurveTo(-92, -106, -98, 40, -92, 290); ctx.lineTo(-80, 262); ctx.lineTo(-70, 300); ctx.lineTo(-56, 250); ctx.lineTo(-48, 110); ctx.lineTo(48, 110); ctx.lineTo(54, 270); ctx.lineTo(68, 306); ctx.lineTo(80, 258); ctx.lineTo(94, 290); ctx.bezierCurveTo(100, 40, 92, -106, 0, -108); ctx.fill();
      // human face: cheekbones, tapering jaw
      const gr = ctx.createLinearGradient(0, -80, 0, 130); gr.addColorStop(0, '#b3bdb7'); gr.addColorStop(1, '#8a9590'); ctx.fillStyle = gr;
      ctx.beginPath(); ctx.moveTo(0, -84); ctx.bezierCurveTo(44, -84, 56, -44, 56, -4); ctx.bezierCurveTo(56, 40, 46, 84, 26, 110); ctx.quadraticCurveTo(0, 130, -26, 110); ctx.bezierCurveTo(-46, 84, -56, 40, -56, -4); ctx.bezierCurveTo(-56, -44, -44, -84, 0, -84); ctx.fill();
      // hair cap over the crown, parted in the middle, hairline low on the forehead
      ctx.fillStyle = '#1d1f26'; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * 1, -100); ctx.bezierCurveTo(s * 58, -104, s * 70, -50, s * 64, 10); ctx.lineTo(s * 52, 8); ctx.bezierCurveTo(s * 48, -30, s * 30, -50, s * 1, -58); ctx.closePath(); ctx.fill(); }
      ctx.strokeStyle = 'rgba(110,120,135,.35)'; ctx.lineWidth = 2; for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(s * (6 + k * 10), -96 + k * 8); ctx.bezierCurveTo(s * (40 + k * 8), -90 + k * 6, s * (58 + k * 3), -40, s * (60 + k * 4), 4); ctx.stroke(); }
      // dark-ringed, hollow eyes (channel look): grey rings, pale eyes, tiny pupils
      for (const s of [-1, 1]) { const ex = s * 22, ey = 6;
        const rg = ctx.createRadialGradient(ex, ey + 4, 4, ex, ey + 4, 26); rg.addColorStop(0, 'rgba(24,28,32,.85)'); rg.addColorStop(1, 'rgba(24,28,32,0)'); ctx.fillStyle = rg; ctx.beginPath(); ctx.ellipse(ex, ey + 4, 24, 22, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#c9d2cc'; ctx.beginPath(); ctx.moveTo(ex - 13, ey); ctx.quadraticCurveTo(ex, ey - 9, ex + 13, ey); ctx.quadraticCurveTo(ex, ey + 7, ex - 13, ey); ctx.fill();
        ctx.strokeStyle = '#1b1d20'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(ex - 14, ey); ctx.quadraticCurveTo(ex, ey - 10, ex + 14, ey); ctx.stroke();
        const lid = V === 'X' && globalThis.GX ? (globalThis.GX.lid || 0) : 0; if (lid) { ctx.fillStyle = '#8f9a95'; ctx.beginPath(); ctx.moveTo(ex - 15, ey + 8); ctx.quadraticCurveTo(ex, ey + 8 - lid * 18, ex + 15, ey + 8); ctx.lineTo(ex + 15, ey + 10); ctx.lineTo(ex - 15, ey + 10); ctx.fill(); } }
      ctx.strokeStyle = 'rgba(40,48,50,.5)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-1, 22); ctx.lineTo(-4, 50); ctx.lineTo(3, 52); ctx.stroke();
      const mo = ease.inOutQuad(seg(t, ev.face + .9, ev.face + 1.5));
      if (V === 'A') { // lips barely parted, a thin dark gap
        ctx.fillStyle = '#6f7a76'; ctx.beginPath(); ctx.ellipse(0, 80, 15, 5, 0, 0, 7); ctx.fill();
        ctx.strokeStyle = '#111215'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-14, 80); ctx.lineTo(14, 80); ctx.stroke();
        ctx.fillStyle = '#060506'; ctx.beginPath(); ctx.ellipse(0, 80, 5 + 4 * mo, 1.5 + 4 * mo, 0, 0, 7); ctx.fill();
      } else if (V === 'B') { // jaw slowly hangs open: grey lips around a dark hollow
        const h = 6 + 30 * mo; ctx.fillStyle = '#6f7a76'; ctx.beginPath(); ctx.ellipse(0, 78 + h * .4, 14, h * .5 + 5, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#060506'; ctx.beginPath(); ctx.ellipse(0, 78 + h * .4, 10, h * .5, 0, 0, 7); ctx.fill();
      }
      if (V === 'X') { // expression sheet for the ear-to-ear mouth
        const X = globalThis.GX || {}, uL = X.uL || 0, uR = X.uR || 0, g = X.gap || 0, wv = X.wave || 0;
        const mid = 80 + (X.mid || 0);
        ctx.fillStyle = '#060506'; ctx.beginPath(); ctx.moveTo(-50, 72 - uL);
        for (let i = 1; i <= 20; i++) { const u = i / 20, xx = -50 + 100 * u, yy = (72 - uL) * (1 - u) * (1 - u) + 2 * u * (1 - u) * mid + (72 - uR) * u * u + Math.sin(u * 28) * wv * Math.sin(u * Math.PI); ctx.lineTo(xx, yy); }
        for (let i = 19; i >= 0; i--) { const u = i / 20, xx = -50 + 100 * u, top = (72 - uL) * (1 - u) * (1 - u) + 2 * u * (1 - u) * mid + (72 - uR) * u * u; ctx.lineTo(xx, top + 2 + g * Math.sin(u * Math.PI) + Math.sin(u * 28 + 1) * wv * Math.sin(u * Math.PI)); }
        ctx.fill();
      }
      if (V === 'D' || V === 'E') { // ear-to-ear mouth: a thin seam across the face that slowly gapes; D straight, E corners curling up
        const up = V === 'E' ? 22 : 0, g = 2 + 16 * mo;
        ctx.fillStyle = '#060506'; ctx.beginPath(); ctx.moveTo(-50, 70 - up); ctx.quadraticCurveTo(-30, 80, 0, 80); ctx.quadraticCurveTo(30, 80, 50, 70 - up);
        ctx.quadraticCurveTo(30, 82 + g * .6, 0, 82 + g); ctx.quadraticCurveTo(-30, 82 + g * .6, -50, 70 - up); ctx.fill();
        ctx.strokeStyle = 'rgba(60,70,72,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-50, 70 - up); ctx.quadraticCurveTo(-30, 80, 0, 80); ctx.quadraticCurveTo(30, 80, 50, 70 - up); ctx.stroke();
      }
      if (V === 'C') { // lower face sinks into shadow: only the eyes and brow are lit
        const sg = ctx.createLinearGradient(0, 30, 0, 110); sg.addColorStop(0, 'rgba(9,8,11,0)'); sg.addColorStop(1, 'rgba(9,8,11,.95)'); ctx.fillStyle = sg; ctx.fillRect(-60, 30, 120, 100);
      }
}
function ghost(t, wx, wy) { const a = sm(seg(t, 6.2, 6.9)); if (a <= 0) return; const jit = Math.floor(t * 12); const dx = (jit % 3 - 1) * 1.5;
  g.save(); g.translate(wx + dx, wy);
  const fa = .7 * sm(seg(t, 7.6, 8.6)); if (fa > 0) { const L = ghost.L || (ghost.L = document.createElement('canvas')); L.width = 420; L.height = 560; const lc = L.getContext('2d'); lc.translate(210, 160); ghostB(lc, t); g.save(); g.rotate(rad(jit % 7 < 3 ? 6 : -3) * seg(t, 8.2, 8.4)); g.scale(.6, .6); g.globalAlpha = fa; g.drawImage(L, -210, -160); g.restore(); g.globalAlpha = 1; }
  for (const s of [-1, 1]) { const ex = s * (fa > 0 ? 13 : 18), ey = fa > 0 ? 3.6 : 4 + (s > 0 ? 4 : 0); const hl = g.createRadialGradient(ex, ey, 0, ex, ey, 30); hl.addColorStop(0, `rgba(190,255,220,${(fa > 0 ? .12 : .55) * a})`); hl.addColorStop(1, 'rgba(190,255,220,0)'); g.fillStyle = hl; g.fillRect(ex - 30, ey - 30, 60, 60);
    g.fillStyle = `rgba(230,255,240,${a})`; g.beginPath(); g.ellipse(ex, ey, fa > 0 ? 2.2 : 4.5, fa > 0 ? 2.2 : 3.2, 0, 0, 7); g.fill(); }
  g.restore(); }
// ---------------- frame ----------------
const MIST = layer(2200, 400, (x, w, h) => { for (let i = 0; i < 40; i++) { const gr = x.createRadialGradient(0, 0, 0, 0, 0, 1); x.save(); x.translate(rnd() * w, 120 + rnd() * 220); x.scale(160 + rnd() * 200, 30 + rnd() * 30); const r = x.createRadialGradient(0, 0, 0, 0, 0, 1); r.addColorStop(0, 'rgba(170,184,200,.22)'); r.addColorStop(1, 'rgba(170,184,200,0)'); x.fillStyle = r; x.beginPath(); x.arc(0, 0, 1, 0, 7); x.fill(); x.restore(); } });
window.draw = (t) => {
  const o = smoothPose(t), sp = springs(t); o.tuft = sp.tuft; o.scarf = sp.scarf; o.lanternSwing = sp.lantern;
  // camera: follow the walk, then drift right, then push in on the ghost eyes
  const cut = t >= 7.6, cw = sm(seg(t, 0, 7.6)), cc = sm(seg(t, 7.6, 9.4)); const push = cut ? lerp(2.1, 2.45, cc) : lerp(.9, .96, cw); const focus = cut ? [632, lerp(915, 905, cc)] : [lerp(clamp(walkX(Math.max(0, t - .5)) + 230, 250, 420), 420, sm(seg(t, 2.4, 4.4))) + 25 * cw, lerp(720, 735, cw)];
  const shake = t > 7.0 && t < 7.4 ? (1 - seg(t, 7, 7.4)) * 10 * Math.sin(t * 90) : 0;
  g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(SKY, 0, 0);
  const view = (par) => { g.setTransform(push, 0, 0, push, W / 2 - focus[0] * push * par - (1 - par) * 0 + shake, H / 2 - focus[1] * push + shake * .5); };
  view(.15); g.drawImage(FAR, -200 + focus[0] * .85 * (1 - .15) * 0, 0); view(.45); g.drawImage(MID, -300, 0);
  view(1); g.drawImage(GROUND, -400, 860); g.drawImage(ROCK, 250, 165, 765, 935);
  ghost(t, 632, 905);
  // character + lantern light pool
  const lx = o.x + 40, ly = o.y - 150; const pool = g.createRadialGradient(lx, ly, 10, lx, ly, 320); pool.addColorStop(0, 'rgba(255,190,110,.32)'); pool.addColorStop(1, 'rgba(255,190,110,0)');
  character(o);
  g.globalCompositeOperation = 'lighter'; g.fillStyle = pool; g.fillRect(lx - 340, ly - 340, 680, 680); g.globalCompositeOperation = 'source-over';
  g.globalAlpha = .9; g.drawImage(MIST, -600 + (t * 30) % 600, 820); g.globalAlpha = 1;
  // grade: cold tint + vignette, then blackout at the end
  g.setTransform(1, 0, 0, 1, 0, 0); const v = g.createRadialGradient(W / 2, H * .55, H * .25, W / 2, H * .55, H * .75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,8,.55)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
  if (t > 7.0 && t < 7.08) { g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(0, 0, W, H); }
  const bo = sm(seg(t, 9.2, 9.6)); if (bo > 0) { g.fillStyle = `rgba(0,0,0,${bo})`; g.fillRect(0, 0, W, H); }
  // subtitle
  const sub = t > 4.7 && t < 6.3 ? 'AI... AI ĐÓ?' : null; if (sub) { g.font = '900 64px "DejaVu Sans"'; g.textAlign = 'center'; g.lineJoin = 'round'; g.lineWidth = 14; g.strokeStyle = '#000'; g.strokeText(sub, W / 2, H * .8); g.fillStyle = '#fff'; g.fillText(sub, W / 2, H * .8); }
};
window.READY = true;
