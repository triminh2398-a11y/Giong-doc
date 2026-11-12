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
// cave / rock outcrop (world space, right side)
const ROCK = layer(900, 1100, (x) => { x.fillStyle = '#2a2f3a'; x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(40, 1100); x.bezierCurveTo(10, 700, 120, 300, 380, 160); x.bezierCurveTo(600, 60, 860, 200, 900, 380); x.lineTo(900, 1100); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = 'rgba(70,78,92,.5)'; for (let i = 0; i < 22; i++) { x.beginPath(); x.ellipse(120 + rnd() * 700, 300 + rnd() * 700, 40 + rnd() * 60, 20 + rnd() * 30, rnd(), 0, 7); x.fill(); }
  x.fillStyle = '#050408'; x.beginPath(); x.moveTo(250, 1100); x.lineTo(250, 760); x.bezierCurveTo(250, 560, 560, 560, 560, 760); x.lineTo(560, 1100); x.fill();
  const gr = x.createLinearGradient(0, 600, 0, 1100); gr.addColorStop(0, 'rgba(5,4,8,0)'); gr.addColorStop(1, 'rgba(5,4,8,.6)'); x.fillStyle = gr; x.fillRect(200, 600, 420, 500); });
// ---------------- skeletal rig ----------------
// bones: angles in degrees, 0 = straight down, positive = clockwise (toward facing direction)
const P = { skin: '#e6cbb2', skinD: '#c9a88e', jacket: '#3a4256', jacketD: '#2a3042', pants: '#262a36', scarf: '#7a3a3a', hair: '#14121a', shoe: '#18161c' };
function limb(len, w0, w1, col, colD) { // tapered capsule along +y
  g.beginPath(); g.moveTo(-w0, 0); g.quadraticCurveTo(-w0 - 2, len * .5, -w1, len); g.arc(0, len, w1, Math.PI, 0, true); g.quadraticCurveTo(w0 + 2, len * .5, w0, 0); g.arc(0, 0, w0, 0, Math.PI, true); g.closePath();
  const gr = g.createLinearGradient(-w0, 0, w0, 0); gr.addColorStop(0, col); gr.addColorStop(1, colD); g.fillStyle = gr; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); }
function bone(ang, len, draw, child) { g.save(); g.rotate(rad(-ang)); draw && draw(); if (child) { g.translate(0, len); child(); } g.restore(); }
function face(o) {
  const d = o.faceDir, ex = d * 26, R = 74;
  // head shape
  g.beginPath(); g.ellipse(0, 0, R, R * 1.05, 0, 0, 7); const gr = g.createRadialGradient(-20 + d * 10, -20, 10, 0, 0, R * 1.1); gr.addColorStop(0, P.skin); gr.addColorStop(1, P.skinD); g.fillStyle = gr; g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke();
  // ear on the far side
  g.beginPath(); g.ellipse(-d * 64 - (d >= 0 ? 4 : -4), 8, 11, 16, 0, 0, 7); g.fillStyle = P.skinD; g.fill(); g.stroke();
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
function character(o) {
  g.save(); g.translate(o.x, o.y); g.scale(1.35 * o.flip, 1.35); g.scale(1 + o.squash * .06, 1 - o.squash * .08);
  const hipY = -o.legLen; g.translate(0, hipY + o.bob); g.rotate(rad(o.lean));
  const leg = (a) => bone(a[0], 72, () => limb(72, 15, 12, P.pants, '#1c1f28'), () => bone(a[1], 70, () => limb(70, 12, 10, P.pants, '#1c1f28'), () => bone(a[2] || 0, 0, () => { g.beginPath(); g.ellipse(10, 6, 22, 11, 0, 0, 7); g.fillStyle = P.shoe; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); })));
  const arm = (a, hand) => bone(a[0], 64, () => limb(64, 13, 11, P.jacket, P.jacketD), () => bone(a[1], 58, () => limb(58, 11, 9, P.jacket, P.jacketD), () => { g.beginPath(); g.arc(0, 6, 11, 0, 7); g.fillStyle = P.skin; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); hand && hand(); }));
  // far limbs (dimmer)
  g.save(); g.filter = 'brightness(.72)'; leg(o.legB); g.translate(0, -118); arm(o.armB); g.restore();
  leg(o.legF);
  // torso
  g.save(); g.rotate(rad(-o.spine)); g.beginPath(); g.moveTo(-34, 0); g.quadraticCurveTo(-40, -70, -30, -124); g.quadraticCurveTo(0, -136, 32, -124); g.quadraticCurveTo(40, -70, 36, 0); g.quadraticCurveTo(0, 10, -34, 0); g.closePath();
  const gr = g.createLinearGradient(-34, 0, 36, 0); gr.addColorStop(0, P.jacket); gr.addColorStop(1, P.jacketD); g.fillStyle = gr; g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke();
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(4, -120); g.lineTo(2, -4); g.stroke();
  // scarf + spring tail
  g.save(); g.translate(0, -124); g.beginPath(); g.ellipse(0, 0, 36, 13, 0, 0, 7); g.fillStyle = P.scarf; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
  g.save(); g.translate(-18, 4); g.rotate(rad(o.scarf)); g.beginPath(); g.moveTo(-8, 0); g.quadraticCurveTo(-14, 40, -6, 70); g.lineTo(10, 66); g.quadraticCurveTo(4, 36, 8, 0); g.closePath(); g.fill(); g.stroke(); g.restore(); g.restore();
  // front arm holds the lantern
  g.save(); g.translate(0, -118); arm(o.armF, () => { g.save(); g.translate(0, 14); g.rotate(rad(-(o.lean - o.armF[0] - o.armF[1]) + o.lanternSwing)); lantern(o); g.restore(); }); g.restore();
  // neck + head
  g.translate(0, -132); g.rotate(rad(-o.neck)); g.fillStyle = P.skinD; g.fillRect(-10, -14, 20, 18); g.translate(0, -70); g.rotate(rad(-o.head)); face(o);
  g.restore(); g.restore();
}
function lantern(o) { g.save(); g.strokeStyle = '#2a2420'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 44); g.stroke();
  g.translate(0, 44); g.fillStyle = '#3a2e22'; g.fillRect(-16, 0, 32, 8); const fl = .85 + .15 * Math.sin(o.t * 23) * Math.sin(o.t * 7);
  const gl = g.createRadialGradient(0, 30, 2, 0, 30, 26); gl.addColorStop(0, `rgba(255,236,170,${fl})`); gl.addColorStop(1, 'rgba(255,150,60,.85)'); g.fillStyle = gl; g.beginPath(); g.roundRect(-14, 8, 28, 44, 8); g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
  g.fillStyle = '#3a2e22'; g.fillRect(-16, 50, 32, 7); g.restore(); }
// ---------------- performance (pure functions of t; springs integrated from t=0) ----------------
const walkEnd = 3.0, stopEnd = 3.6;
function rootX(t) { if (t < walkEnd) return lerp(-120, 300, t / walkEnd * (1 - .12 * t / walkEnd)); const x3 = lerp(-120, 300, .88); return x3 + 26 * back(seg(t, walkEnd, stopEnd), 1.2) - (t > 7 ? 70 * back(seg(t, 7.0, 7.35), 2.5) : 0); }
function pose(t) {
  const walking = t < walkEnd, ph = rootX(Math.min(t, walkEnd)) / 150 * Math.PI * 2, w = walking ? 1 : 1 - sm(seg(t, walkEnd, stopEnd));
  const s = Math.sin(ph), c = Math.cos(ph);
  const o = { t, x: rootX(t), y: 1040, flip: 1, legLen: 142, bob: -7 * Math.abs(c) * w + 3 * Math.sin(t * 2) * (1 - w), lean: 4 * w,
    legF: [26 * s * w, -40 * Math.max(0, -s) * w - 6, 0], legB: [-26 * s * w, -40 * Math.max(0, s) * w - 6, 0],
    armB: [-24 * s * w + 6, -18], armF: [10 * s * w - 25, -55], spine: 2 * w, neck: 0, head: 1.5 * Math.sin(t * 1.7),
    faceDir: .55, look: .3, blink: 0, brow: 0, mouth: 0, shock: 0, squash: 0, tuft: 0, scarf: 0, lanternSwing: 0, lanternWorld: 0 };
  // stop: settle, then turn the head toward the cave (right) and the viewer
  const turn = sm(seg(t, 3.7, 4.4)); o.faceDir = lerp(.55, .15, turn); o.look = lerp(.3, .9, turn); o.head += -6 * turn;
  // speaks "Ai... ai đó?" (mouth flaps follow syllable rhythm)
  const sp = seg(t, 4.7, 6.1); if (sp > 0 && sp < 1) { o.mouth = Math.abs(Math.sin(t * 13)) * (Math.sin(sp * Math.PI * 3) > -.4 ? .9 : .1); o.brow = 10; }
  const B = [1.2, 4.55, 6.5]; for (const b of B) { const d = Math.abs(t - b); if (d < .07) o.blink = 1; }
  // startle at 7.0: squash, jump back, arms up, eyes wide
  const st = seg(t, 7.0, 7.25); if (t > 7.0) { o.shock = 1; o.squash = Math.sin(st * Math.PI) * 1.4; o.armB = [lerp(o.armB[0], 120, back(st)), -60]; o.armF = [lerp(o.armF[0], 50, back(st)), -90]; o.lean = -8 * back(st); o.head -= 6; o.mouth = .9; o.brow = 18; o.faceDir = .1; o.look = 1; o.legF[0] = -10; o.legB[0] = 18; }
  return o;
}
function springs(T) { // integrate secondary motion deterministically
  let la = 0, lv = 0, ta = 0, tv = 0, sa = 0, sv = 0, pv = 0; const dt = 1 / 120;
  for (let t = 0; t <= T; t += dt) { const v = (rootX(t + dt) - rootX(t)) / dt, acc = (v - pv) / dt; pv = v;
    lv += (-60 * la - 4 * lv - acc * .5) * dt; la += lv * dt; tv += (-90 * ta - 6 * tv - acc * .25) * dt; ta += tv * dt; sv += (-40 * sa - 3 * sv + acc * .35) * dt; sa += sv * dt; }
  return { lantern: clamp(la, -40, 40), tuft: clamp(ta, -30, 30), scarf: clamp(18 + sa + pv * .03, -10, 60) }; }
// ---------------- ghost: eyes in the cave dark, then a pale face at 70% ----------------
function ghost(t, wx, wy) { const a = sm(seg(t, 6.2, 6.9)); if (a <= 0) return; const jit = Math.floor(t * 12); const dx = (jit % 3 - 1) * 1.5;
  g.save(); g.translate(wx + dx, wy);
  const fa = .7 * sm(seg(t, 7.6, 8.6)); if (fa > 0) { g.globalAlpha = fa; // gaunt pale face emerging from the dark
    const gr = g.createRadialGradient(0, 10, 10, 0, 10, 90); gr.addColorStop(0, '#b9c6c0'); gr.addColorStop(.7, '#8d9a94'); gr.addColorStop(1, 'rgba(60,70,70,0)'); g.fillStyle = gr; g.beginPath(); g.ellipse(0, 14, 58, 78, rad(8 * Math.sin(jit * .7)), 0, 7); g.fill();
    for (const s of [-1, 1]) { const sg = g.createRadialGradient(s * 21, 4, 2, s * 21, 4, 26); sg.addColorStop(0, 'rgba(0,0,0,.95)'); sg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = sg; g.beginPath(); g.ellipse(s * 21, 4 + (s > 0 ? 4 : 0), 24, 28, 0, 0, 7); g.fill(); }
    const mh = 30 + 20 * sm(seg(t, 8.3, 8.8)); g.fillStyle = '#050304'; g.beginPath(); g.ellipse(2, 56, 9, mh * .5, .05, 0, 7); g.fill();
    g.fillStyle = 'rgba(20,18,24,.9)'; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 50, -50); g.quadraticCurveTo(s * 70, 60, s * 52, 160); g.lineTo(s * 70, 165); g.quadraticCurveTo(s * 86, 40, s * 58, -60); g.fill(); }
    g.globalAlpha = 1; }
  for (const s of [-1, 1]) { const ex = s * 21, ey = 4 + (s > 0 ? 4 : 0); const hl = g.createRadialGradient(ex, ey, 0, ex, ey, 30); hl.addColorStop(0, `rgba(190,255,220,${.55 * a})`); hl.addColorStop(1, 'rgba(190,255,220,0)'); g.fillStyle = hl; g.fillRect(ex - 30, ey - 30, 60, 60);
    g.fillStyle = `rgba(230,255,240,${a})`; g.beginPath(); g.ellipse(ex, ey, 4.5, 3.2 + (t > 7.6 ? 1 : 0), 0, 0, 7); g.fill(); }
  g.restore(); }
// ---------------- frame ----------------
const MIST = layer(2200, 400, (x, w, h) => { for (let i = 0; i < 40; i++) { const gr = x.createRadialGradient(0, 0, 0, 0, 0, 1); x.save(); x.translate(rnd() * w, 120 + rnd() * 220); x.scale(160 + rnd() * 200, 30 + rnd() * 30); const r = x.createRadialGradient(0, 0, 0, 0, 0, 1); r.addColorStop(0, 'rgba(170,184,200,.22)'); r.addColorStop(1, 'rgba(170,184,200,0)'); x.fillStyle = r; x.beginPath(); x.arc(0, 0, 1, 0, 7); x.fill(); x.restore(); } });
window.draw = (t) => {
  const o = pose(t), sp = springs(t); o.tuft = sp.tuft; o.scarf = sp.scarf; o.lanternSwing = sp.lantern;
  // camera: follow the walk, then drift right, then push in on the ghost eyes
  const camX = lerp(clamp(o.x, 140, 330), 500, sm(seg(t, 6.0, 7.0))), push = 1 + .9 * sm(seg(t, 7.4, 9.0)), focus = [lerp(camX, 735, sm(seg(t, 7.4, 9.0))), lerp(720, 820, sm(seg(t, 7.4, 9.0)))];
  const shake = t > 7.0 && t < 7.4 ? (1 - seg(t, 7, 7.4)) * 10 * Math.sin(t * 90) : 0;
  g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(SKY, 0, 0);
  const view = (par) => { g.setTransform(push, 0, 0, push, W / 2 - focus[0] * push * par - (1 - par) * 0 + shake, H / 2 - focus[1] * push + shake * .5); };
  view(.15); g.drawImage(FAR, -200 + focus[0] * .85 * (1 - .15) * 0, 0); view(.45); g.drawImage(MID, -300, 0);
  view(1); g.drawImage(GROUND, -400, 860); g.drawImage(ROCK, 330, 0);
  ghost(t, 735, 830);
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
