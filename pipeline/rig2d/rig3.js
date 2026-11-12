// 2D skeletal rig demo: bone hierarchy (FK), procedural walk, springs for lantern/scarf/hair, face swaps, glowing-eyes ghost.
const W = 720, H = 1280, FPS = 30, DUR = 10;
const cv = document.getElementById('c'); let g = cv.getContext('2d');
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
  const d = o.faceDir, ex = d * 18, hx = -d * 6, G_ = !!o.ghost, HS = o.hair || 'short';
  const HAIR = G_ ? '#15141a' : HS === 'white' ? '#d9d6cf' : P.hair;
  if (HS === 'shroud') { // whole head wrapped in a dark cloth: no face at all (villagers at the end)
    const C = '#2a2630'; g.beginPath(); g.moveTo(-62, 70); g.bezierCurveTo(-80, -40, -40, -96, 0, -96); g.bezierCurveTo(40, -96, 80, -40, 62, 70); g.quadraticCurveTo(0, 84, -62, 70); g.closePath(); g.fillStyle = C; g.fill(); g.strokeStyle = INK; g.lineWidth = 3.2; g.stroke();
    g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 2; for (const k of [-30, -8, 14, 34]) { g.beginPath(); g.moveTo(k * .5, -80); g.quadraticCurveTo(k, 0, k * 1.2, 70); g.stroke(); }
    g.fillStyle = 'rgba(120,40,36,.8)'; g.fillRect(-58, 40, 116, 6); return; }
  if (G_) { // long, lank, matted hair hanging behind the head and past the shoulders, ragged ends
    g.beginPath(); g.moveTo(hx - 66, -10); g.bezierCurveTo(hx - 80, -70, hx - 40, -96, hx, -96); g.bezierCurveTo(hx + 40, -96, hx + 80, -70, hx + 66, -10);
    const ends = [[74, 120], [62, 104], [56, 150], [44, 112], [34, 140]]; g.quadraticCurveTo(hx + 84, 60, hx + ends[0][0], ends[0][1]); for (const [ax, ay] of ends.slice(1)) g.lineTo(hx + ax, ay);
    g.lineTo(hx - 30, 136); g.lineTo(hx - 42, 108); g.lineTo(hx - 54, 156); g.lineTo(hx - 62, 100); g.lineTo(hx - 76, 126); g.quadraticCurveTo(hx - 86, 60, hx - 66, -10); g.closePath();
    g.fillStyle = HAIR; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
  } else { for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * 52 + d * 4, 18, 9, 13, 0, 0, 7); g.fillStyle = P.skinD; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); } } // ears
  // face
  g.beginPath(); if (HS === 'white') g.ellipse(d * 2, 4, 54, 72, 0, 0, 7); else g.ellipse(d * 4, 16, 52, 58, 0, 0, 7);
  if (G_) g.fillStyle = '#dfe3e0'; else { const gr = g.createRadialGradient(-14 + d * 10, 0, 8, 0, 14, 62); gr.addColorStop(0, P.skin); gr.addColorStop(1, P.skinD); g.fillStyle = gr; }
  g.fill(); g.strokeStyle = INK; g.lineWidth = 3.2; g.stroke();
  // eyes: the living have pupils; the dead stare with empty grey-white eyes in black-ringed sockets
  for (const s of [-1, 1]) { const x = ex + s * 21 * (1 - Math.abs(d) * .25), y = 16, sc = 1 - (s === Math.sign(-d) ? Math.abs(d) * .25 : 0);
    g.fillStyle = G_ ? 'rgba(20,20,28,.75)' : 'rgba(60,40,60,.35)'; g.beginPath(); g.ellipse(x, y + 5, (G_ ? 20 : 17) * sc, G_ ? 21 : 17, 0, 0, 7); g.fill();
    if (o.blink > .5) { g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 11 * sc, y + 2); g.quadraticCurveTo(x, y + 7, x + 11 * sc, y + 2); g.stroke(); continue; }
    const big = o.shock ? 1.22 : 1; g.fillStyle = G_ ? '#c9cfcc' : '#f2eee8'; g.beginPath(); g.ellipse(x, y, 12 * sc * big, 14.5 * big, 0, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 2.5; g.stroke();
    if (G_) { g.fillStyle = 'rgba(40,44,50,.35)'; g.beginPath(); g.arc(x, y + 1, 2.2, 0, 7); g.fill(); continue; }
    g.fillStyle = '#1a1420'; g.beginPath(); g.ellipse(x + o.look * 5 * sc, y + 2, (o.shock ? 4 : 6.5) * sc, o.shock ? 4.5 : 8, 0, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(x + o.look * 5 * sc - 2, y - 2, 2.1, 0, 7); g.fill(); }
  // brows (none on the dead)
  if (!G_) { g.strokeStyle = INK; g.lineWidth = 3.5; g.lineCap = 'round'; for (const s of [-1, 1]) { const x = ex + s * 21; g.beginPath(); g.moveTo(x - 10, -4 + s * o.brow * .25 - (o.shock ? 6 : 0)); g.lineTo(x + 10, -4 - s * o.brow * .25 - (o.shock ? 6 : 0)); g.stroke(); } }
  // nose + mouth
  g.strokeStyle = INK; g.lineWidth = 2.5; g.beginPath(); g.moveTo(ex + d * 6, 30); g.lineTo(ex + d * 9, 39); g.lineTo(ex + d * 3, 41); g.stroke();
  const mo = o.mouth; g.fillStyle = G_ ? '#0a0809' : '#4a2028'; g.beginPath(); g.ellipse(ex + d * 4, 56 + (G_ ? mo * 6 : 0), 8 + mo * 3, 2 + mo * (G_ ? 16 : 10), 0, 0, 7); if (mo > .08) g.fill(); g.stroke();
  if (G_) { // matted crown + a few lank strands down the sides of the face (face stays clear)
    g.beginPath(); g.moveTo(hx - 64, 6); g.bezierCurveTo(hx - 80, -66, hx - 40, -98, hx, -98); g.bezierCurveTo(hx + 40, -98, hx + 80, -66, hx + 64, 6);
    g.lineTo(hx + 52, -14); g.lineTo(hx + 40, 4); g.quadraticCurveTo(hx + 30, -40, hx + 4, -48); g.lineTo(hx, -30); g.lineTo(hx - 6, -48); g.quadraticCurveTo(hx - 30, -40, hx - 42, 6); g.lineTo(hx - 52, -12); g.closePath();
    g.fillStyle = HAIR; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
    g.strokeStyle = HAIR; g.lineWidth = 5; g.lineCap = 'round'; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(hx + s * 46, -10); g.quadraticCurveTo(hx + s * 54, 40, hx + s * 46, 92); g.stroke(); g.lineWidth = 3.5; g.beginPath(); g.moveTo(hx + s * 38, 0); g.quadraticCurveTo(hx + s * 50, 50, hx + s * 40, 70); g.stroke(); g.lineWidth = 5; }
    g.strokeStyle = 'rgba(140,150,165,.3)'; g.lineWidth = 1.6; for (const k of [-34, -12, 14, 36]) { g.beginPath(); g.moveTo(hx + k * .3, -92); g.quadraticCurveTo(hx + k, -60, hx + k * 1.4, -20); g.stroke(); }
    return; }
  if (HS === 'white') { // old age: heavy lids, eye bags, sunken cheeks, deep lines, bushy white brows, balding crown, long thin white beard
    const W_ = 'rgba(70,40,30,.55)'; g.strokeStyle = W_; g.lineWidth = 2.2; g.lineCap = 'round';
    for (const s of [-1, 1]) { const x = ex + s * 21;
      g.fillStyle = P.skinD; g.beginPath(); g.moveTo(x - 14, 8); g.quadraticCurveTo(x, -2, x + 14, 8); g.lineTo(x + 14, 12); g.quadraticCurveTo(x, 6, x - 14, 12); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 2.5; g.stroke(); // drooping upper lid
      g.strokeStyle = W_; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 10, 30); g.quadraticCurveTo(x, 35, x + 10, 30); g.stroke(); // eye bag
      g.beginPath(); g.moveTo(x + s * 15, 12); g.lineTo(x + s * 22, 8); g.moveTo(x + s * 15, 18); g.lineTo(x + s * 23, 19); g.stroke(); // crow's feet
      g.beginPath(); g.moveTo(ex + s * 12, 40); g.quadraticCurveTo(ex + s * 22, 52, ex + s * 18, 64); g.stroke(); // nasolabial fold
      const cg = g.createRadialGradient(ex + s * 32, 46, 2, ex + s * 32, 46, 16); cg.addColorStop(0, 'rgba(70,40,30,.35)'); cg.addColorStop(1, 'rgba(70,40,30,0)'); g.fillStyle = cg; g.fillRect(ex + s * 32 - 16, 30, 32, 32); } // sunken cheeks
    for (const yy of [-28, -20, -12]) { g.beginPath(); g.moveTo(ex - 22, yy); g.quadraticCurveTo(ex, yy - 4, ex + 22, yy); g.stroke(); } // forehead
    g.fillStyle = '#ece9e2'; g.strokeStyle = INK; g.lineWidth = 2; for (const s of [-1, 1]) { const x = ex + s * 21; g.beginPath(); g.moveTo(x - 13, -2); g.quadraticCurveTo(x, -12 - 2, x + 13, -2 + s * 2); g.quadraticCurveTo(x, -6, x - 13, -2); g.fill(); g.stroke(); } // bushy white brows
    g.fillStyle = '#ece9e2'; g.beginPath(); g.moveTo(ex - 16, 60); g.quadraticCurveTo(ex - 10, 100, ex + 2, 118); g.quadraticCurveTo(ex + 12, 98, ex + 16, 60); g.quadraticCurveTo(ex, 70, ex - 16, 60); g.closePath(); g.fill(); g.stroke(); // beard
    g.strokeStyle = 'rgba(150,150,150,.6)'; g.lineWidth = 1.5; for (const k of [-6, 0, 6]) { g.beginPath(); g.moveTo(ex + k, 68); g.lineTo(ex + k * .6 + 1, 108); g.stroke(); }
    g.fillStyle = 'rgba(90,55,35,.35)'; for (const [sx, sy] of [[-26, -34], [18, -40], [30, 48]]) { g.beginPath(); g.arc(ex + sx, sy, 3, 0, 7); g.fill(); } // age spots
    // balding: bare crown, thin white hair only around the sides and back
    g.fillStyle = '#ece9e2'; g.strokeStyle = INK; g.lineWidth = 2.5; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(hx + s * 30, -66); g.bezierCurveTo(hx + s * 58, -60, hx + s * 64, -24, hx + s * 56, 14); g.lineTo(hx + s * 48, 4); g.lineTo(hx + s * 50, -14); g.lineTo(hx + s * 44, -30); g.quadraticCurveTo(hx + s * 44, -50, hx + s * 24, -60); g.closePath(); g.fill(); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.ellipse(hx - 8, -62, 16, 8, -.3, 0, 7); g.fill(); // shine on the bald crown
    return; }
  if (HS === 'bun') { // women: hair drawn back smooth, middle part, a bun at the nape
    g.beginPath(); g.arc(hx - 52, -30, 24, 0, 7); g.fillStyle = HAIR; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
    g.beginPath(); g.moveTo(hx - 54, 10); g.bezierCurveTo(hx - 64, -60, hx - 30, -86, hx + 2, -86); g.bezierCurveTo(hx + 40, -86, hx + 66, -60, hx + 54, 10); g.quadraticCurveTo(hx + 42, -40, hx + 2, -50); g.quadraticCurveTo(hx - 40, -40, hx - 54, 10); g.closePath(); g.fillStyle = HAIR; g.fill(); g.stroke(); return; }
  // men's short hair: close crop over the crown, side part, short spiky fringe, ears showing
  g.beginPath(); g.moveTo(hx - 56, 8); g.bezierCurveTo(hx - 66, -56, hx - 34, -84, hx + 4, -84); g.bezierCurveTo(hx + 44, -84, hx + 66, -56, hx + 56, 8);
  g.lineTo(hx + 50, -8); g.lineTo(hx + 46, -20); const fr = [[34, -30], [26, -22], [16, -34], [6, -24], [-6, -36], [-16, -26], [-28, -34], [-36, -22], [-46, -24]]; for (const [fx, fy] of fr) g.lineTo(hx + fx, fy);
  g.lineTo(hx - 50, -8); g.closePath(); g.fillStyle = HAIR; g.fill(); g.strokeStyle = INK; g.lineWidth = 3.2; g.stroke();
  g.strokeStyle = 'rgba(130,140,160,.3)'; g.lineWidth = 2; g.beginPath(); g.moveTo(hx - 18, -80); g.quadraticCurveTo(hx - 24, -60, hx - 30, -38); g.stroke(); g.beginPath(); g.moveTo(hx + 10, -80); g.quadraticCurveTo(hx + 22, -60, hx + 30, -36); g.stroke();
  if (HS === 'cap') { const CC = '#a3332c'; g.fillStyle = CC; g.strokeStyle = INK; g.lineWidth = 3.2; g.beginPath(); g.moveTo(hx - 58, -26); g.bezierCurveTo(hx - 62, -80, hx + 56, -92, hx + 58, -26); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = shade(CC, .7); g.beginPath(); g.moveTo(hx + 20 * Math.sign(d || 1), -30); g.quadraticCurveTo(hx + 70 * Math.sign(d || 1), -34, hx + 84 * Math.sign(d || 1), -20); g.quadraticCurveTo(hx + 50 * Math.sign(d || 1), -14, hx + 10 * Math.sign(d || 1), -22); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.arc(hx, -80, 4, 0, 7); g.fill(); }
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
  // outline only along the two sides, starting below the shoulder, so the sleeve grows out of the coat with no visible joint
  const from = Math.round(N * (fleshLimb.seam || 0)); g.strokeStyle = INK; g.lineWidth = 3; g.lineCap = 'round';
  for (const side of [L, R]) { g.beginPath(); g.moveTo(...side[from]); for (let i = from + 1; i <= N; i++) g.lineTo(...side[i]); g.stroke(); }
  if (!fleshLimb.seam) { g.beginPath(); g.moveTo(...L[0]); g.lineTo(...R[0]); g.stroke(); }
  // crease on the inside of the bend
  const m = 9; g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(...L[m - 2]); g.quadraticCurveTo(...L[m], ...L[m + 2].map((v, k) => v + (S[m][k] - L[m][k]) * .35)); g.stroke();
  return { end: p[2], dir: Math.atan2(p[2][0] - p[1][0], p[2][1] - p[1][1]) };
}
function shade(hex, k) { const n = parseInt(hex.slice(1), 16), f = v => Math.max(0, Math.min(255, Math.round(v * k))); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => f(v).toString(16).padStart(2, '0')).join(''); }
function cuffHand(e, dark, skin) { g.save(); g.translate(...e.end); g.rotate(-e.dir);
  g.fillStyle = dark; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.roundRect(-13, -6, 26, 9, 3); g.fill(); g.stroke();
  g.fillStyle = skin; g.beginPath(); g.ellipse(0, 12, 10, 12, 0, 0, 7); g.fill(); g.stroke();
  g.beginPath(); g.ellipse(9, 6, 4.5, 7, -.5, 0, 7); g.fill(); g.stroke(); g.restore(); }
function boot(e, dark, fa = 0) { g.save(); g.translate(...e.end); g.rotate(rad(fa)); g.fillStyle = dark ? '#121015' : P.shoe; g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath(); g.roundRect(-13, -12, 26, 10, 3); g.fillStyle = dark ? '#191b22' : '#2c303c'; g.fill(); g.stroke(); // pant hem
  g.fillStyle = dark ? '#121015' : P.shoe; g.beginPath(); g.moveTo(-14, -3); g.quadraticCurveTo(-16, 10, -10, 12); g.lineTo(30, 12); g.quadraticCurveTo(32, 2, 18, -1); g.quadraticCurveTo(4, -6, -14, -3); g.fill(); g.stroke();
  g.strokeStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.moveTo(-10, 9); g.lineTo(28, 9); g.stroke(); g.restore(); }
function character(o) {
  g.save(); g.translate(o.x, o.y + o.bob * 1.35); const SC = 1.35 * (o.sc || 1); g.scale(SC * o.flip, SC); g.scale(1 + o.squash * .06, 1 - o.squash * .08);
  const T = o.lean + o.spine, L1 = 37, L2 = 35, A1 = 33, A2 = 31, bd = o.bend || 0;
  const hip = [0, -(L1 + L2) + 2], chest0 = add2(hip, 180 + T, 74 + (o.bob || 0) * .4), chest = [chest0[0] + bd, chest0[1]], neck = add2(chest, 180 + T + bd * .6, 6);
  const leg = (q, x) => { const h = [hip[0] + x, hip[1] + 6], k = add2(h, q[0] + o.lean * .3, L1), f = add2(k, q[0] + q[1] + o.lean * .3, L2); return [h, k, f]; };
  const arm = (q, sh) => { const e = add2(sh, q[0] + o.lean, A1), hd = add2(e, q[0] + q[1] + o.lean, A2); return [sh, e, hd]; };
  const LB = leg(o.legB, -9), LF = leg(o.legF, 9), AB = arm(o.armB, [chest[0] - 10, chest[1] + 14]), AF = arm(o.armF, [chest[0] + 10, chest[1] + 14]);
  let late = null;
  if (o.ghost) { // the dead wear a long, dirty-white burial robe crossed at the chest, wide ragged sleeves, no feet showing
    const RB = '#d2d6d1', RBD = '#a7ada8', RBS = '#8e948f', tt = o.t;
    const thinHand = (e) => { g.save(); g.translate(...e.end); g.rotate(-e.dir); g.fillStyle = P.skinD; g.strokeStyle = INK; g.lineWidth = 2.5;
      g.beginPath(); g.ellipse(0, 10, 6, 9, 0, 0, 7); g.fill(); g.stroke(); for (const k of [-4, 0, 4]) { g.beginPath(); g.moveTo(k, 16); g.quadraticCurveTo(k * 1.4, 28, k * .8 + 1, 34); g.strokeStyle = INK; g.lineWidth = 4.5; g.stroke(); g.strokeStyle = P.skinD; g.lineWidth = 2.2; g.stroke(); } g.restore(); };
    const ragCuff = (e, col) => { g.save(); g.translate(...e.end); g.rotate(-e.dir); g.fillStyle = col; g.strokeStyle = INK; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-20, -6); g.lineTo(20, -6); for (let k = 0; k <= 6; k++) g.lineTo(20 - k * 6.6, 4 + (k % 2) * 7 + Math.sin(tt * 3 + k) * 1.5); g.closePath(); g.fill(); g.stroke(); g.restore(); };
    fleshLimb.seam = .32; const eb = fleshLimb(AB, [15, 17, 20], RBD, RBS, 0); thinHand(eb); ragCuff(eb, RBD);
    g.save(); g.translate(...hip); g.rotate(rad(T));
    const R_ = () => { g.beginPath(); g.moveTo(-30 + bd, -74); g.quadraticCurveTo(bd, -84, 30 + bd, -74); g.quadraticCurveTo(46, -10, 54, 70);
      for (let k = 0; k <= 10; k++) { const xx = 54 - k * 10.8, yy = 74 + (k % 2 ? 12 : 0) + 4 * Math.sin(tt * 2.2 + k * .9); g.lineTo(xx + 3 * Math.sin(tt * 1.7 + k), yy); }
      g.quadraticCurveTo(-46, -10, -30 + bd, -74); g.closePath(); };
    R_(); g.fillStyle = RB; g.fill();
    g.save(); R_(); g.clip(); g.fillStyle = RBD; g.beginPath(); g.moveTo(10 + bd, -90); g.quadraticCurveTo(26, 0, 22, 100); g.lineTo(70, 100); g.lineTo(70, -90); g.fill();
    g.fillStyle = 'rgba(110,100,80,.22)'; for (const [sx, sy, sr] of [[-20, 30, 12], [14, 54, 9], [-34, 62, 7], [26, -20, 8]]) { g.beginPath(); g.ellipse(sx, sy, sr * 1.3, sr, .4, 0, 7); g.fill(); } // old stains
    g.strokeStyle = 'rgba(60,64,62,.45)'; g.lineWidth = 2; for (const fx of [-26, -8, 12, 32]) { g.beginPath(); g.moveTo(fx * .5 + bd * .5, -40); g.quadraticCurveTo(fx, 20, fx * 1.25 + 2 * Math.sin(tt * 2 + fx), 78); g.stroke(); } // folds
    g.restore(); R_(); g.strokeStyle = INK; g.lineWidth = 3.2; g.stroke();
    g.strokeStyle = INK; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-24 + bd, -76); g.quadraticCurveTo(0 + bd * .5, -40, 30, -6); g.stroke(); // crossed front
    g.beginPath(); g.moveTo(-36, 6); g.quadraticCurveTo(0, 14, 40, 4); g.strokeStyle = 'rgba(40,40,44,.6)'; g.lineWidth = 4; g.stroke(); // cloth tie at the waist
    g.restore();
    const ef = fleshLimb(AF, [15, 17, 21], RB, RBD, 0); fleshLimb.seam = 0; thinHand(ef); ragCuff(ef, RB);
  } else {
    // ---- the living: outfit is data (top, sleeves, bottom, feet, trim) so every character can be dressed for the script ----
    const F = Object.assign({ top: 'coat', sleeve: 'long', bottom: 'pants', feet: 'boots', col: P.jacket, colD: P.jacketD, bot: '#1e2028', botD: '#15161c', trim: null }, o.outfit || {});
    const skinArm = (A, back) => fleshLimb(A, [10.5, 9.5, 8.5], back ? P.skinD : P.skin, P.skinD, 1);
    const roundHand = (e, skin) => { g.save(); g.translate(...e.end); g.rotate(-e.dir); g.fillStyle = skin; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.ellipse(0, 6, 9.5, 11, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.ellipse(8, 2, 4, 6.5, -.5, 0, 7); g.fill(); g.stroke(); g.restore(); };
    const bareFoot = (e) => { g.save(); g.translate(...e.end); g.fillStyle = P.skinD; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(-10, -4); g.quadraticCurveTo(-12, 9, -6, 10); g.lineTo(24, 10); g.quadraticCurveTo(28, 2, 14, -2); g.closePath(); g.fill(); g.stroke(); g.restore(); };
    const arm = (A, back) => { const c = back ? F.colD : F.col, cd = back ? shade(F.colD, .8) : F.colD;
      if (F.sleeve === 'long') { fleshLimb.seam = .32; const e = fleshLimb(A, [14, 13, 13], c, back ? cd : c, 1.5); fleshLimb.seam = 0; cuffHand(e, shade(c, .75), back ? P.skinD : P.skin); return e; }
      // hand first, then the arm over it with open ends, so wrist and shoulder flow into the hand and the garment (no separate blobs)
      const pre = { end: A[2], dir: Math.atan2(A[2][0] - A[1][0], A[2][1] - A[1][1]) }; roundHand(pre, back ? P.skinD : P.skin);
      fleshLimb.seam = .3; const e = skinArm(A, back); fleshLimb.seam = 0;
      if (F.sleeve === 'none') { g.save(); g.translate(...A[0]); g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.arc(0, 4, 13, .1 * Math.PI, .9 * Math.PI); g.stroke(); g.restore(); } // just the armhole edge line
      if (F.sleeve === 'short') { const m = [A[0], [lerp(A[0][0], A[1][0], .55), lerp(A[0][1], A[1][1], .55)], [lerp(A[0][0], A[1][0], .95), lerp(A[0][1], A[1][1], .95)]]; fleshLimb.seam = .5; fleshLimb(m, [14, 14, 14], c, c, 0); fleshLimb.seam = 0; }
      return e; };
    const leg = (Lg, back, fa) => { if (F.bottom === 'pants') { const e = fleshLimb(Lg, [17, 16, 15], back ? F.botD : F.bot, back ? shade(F.botD, .8) : F.botD, 1); boot(e, back ? 1 : 0, fa); return; }
      const e = fleshLimb(Lg, [12, 11, 9.5], back ? P.skinD : P.skin, P.skinD, 1.5); if (F.feet === 'bare') bareFoot(e); else boot(e, back ? 1 : 0, fa); };
    if (!o.handsFront) arm(AB, true); if (F.bottom !== 'skirt' && !o.legsFront) { leg(LB, true, o.legB[2] || 0); leg(LF, false, o.legF[2] || 0); }
    g.save(); g.translate(...hip); g.rotate(rad(T));
    if (F.bottom === 'skirt') { // long woven wrap skirt to the ankles with bands; bare feet peek out
      for (const s of [-1, 1]) { g.save(); g.translate(s * 12, 66); g.fillStyle = P.skinD; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.ellipse(6, 4, 14, 6, 0, 0, 7); g.fill(); g.stroke(); g.restore(); }
      const S_ = () => { g.beginPath(); g.moveTo(-36, -6); g.lineTo(36, -6); g.quadraticCurveTo(44, 30, 42, 64); g.quadraticCurveTo(0, 70, -42, 64); g.quadraticCurveTo(-44, 30, -36, -6); g.closePath(); };
      S_(); g.fillStyle = F.bot; g.fill(); g.save(); S_(); g.clip(); (F.trim || []).forEach((c, k) => { g.fillStyle = c; g.fillRect(-50, 30 + k * 9, 100, 5); }); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(14, -10, 40, 80); g.restore(); S_(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); }
    const hem = { coat: 24, tee: 12, vest: 6, blouse: 6 }[F.top] ?? 12;
    const J = () => { g.beginPath(); g.moveTo(-40, hem); g.quadraticCurveTo(-42 + bd * .4, -24, -32 + bd, -70); g.quadraticCurveTo(-18 + bd, -80, bd, -80); g.quadraticCurveTo(18 + bd, -80, 32 + bd, -70); g.quadraticCurveTo(42 + bd * .4, -24, 40, hem); g.quadraticCurveTo(0, hem + 6, -40, hem); g.closePath(); };
    J(); g.fillStyle = F.col; g.fill();
    g.save(); J(); g.clip(); g.fillStyle = F.colD; g.beginPath(); g.moveTo(12 + bd, -90); g.quadraticCurveTo(20 + bd * .6, -20, 16, 60); g.lineTo(60, 60); g.lineTo(60, -90); g.fill();
    if (F.trim && F.top !== 'coat') F.trim.forEach((c, k) => { g.fillStyle = c; g.fillRect(-50, hem - 16 + k * 7, 100, 4.5); });
    if (F.top === 'vest') { g.fillStyle = P.skin; g.beginPath(); g.moveTo(bd - 6, -80); g.lineTo(bd + 6, -80); g.lineTo(6, hem + 6); g.lineTo(-6, hem + 6); g.closePath(); g.fill(); } // open front shows the chest
    g.restore(); J(); g.strokeStyle = INK; g.lineWidth = 3.2; g.stroke();
    if (F.top === 'coat') {
      g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(4 + bd, -76); g.quadraticCurveTo(5 + bd * .5, -20, 4, 27); g.stroke();
      g.fillStyle = '#1c1a22'; for (let k = 0; k < 4; k++) { const yy = -62 + k * 22; g.beginPath(); g.arc(9 + bd * (1 - (yy + 76) / 120), yy, 2.6, 0, 7); g.fill(); }
      g.fillStyle = 'rgba(0,0,0,.18)'; g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.roundRect(-31, -6, 20, 16, 3); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-32, -1); g.lineTo(-10, -1); g.stroke();
      g.strokeStyle = INK; g.lineWidth = 2.5; g.fillStyle = shade(F.col, 1.15); g.beginPath(); g.moveTo(bd - 16, -78); g.quadraticCurveTo(bd, -70, bd + 16, -78); g.lineTo(bd + 14, -84); g.quadraticCurveTo(bd, -78, bd - 14, -84); g.closePath(); g.fill(); g.stroke();
    } else if (F.top === 'tee') { g.strokeStyle = INK; g.lineWidth = 2.5; g.beginPath(); g.moveTo(bd - 14, -79); g.quadraticCurveTo(bd, -64, bd + 14, -79); g.stroke();
      g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.roundRect(-30, -54, 16, 14, 3); g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.stroke(); // chest pocket (the wooden bird hides here)
    } else { g.strokeStyle = INK; g.lineWidth = 2.5; g.beginPath(); g.moveTo(bd - 8, -80); g.lineTo(-6, hem + 4); g.moveTo(bd + 8, -80); g.lineTo(6, hem + 4); g.stroke(); }
    if (F.bottom === 'loin') { // loincloth flap over the hips with woven bands
      g.fillStyle = F.bot; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(-38, hem - 2); g.lineTo(38, hem - 2); g.lineTo(34, hem + 14); g.lineTo(12, hem + 16); g.lineTo(8, hem + 44); g.lineTo(-10, hem + 44); g.lineTo(-14, hem + 16); g.lineTo(-34, hem + 14); g.closePath(); g.fill(); g.stroke();
      (F.trim || []).forEach((c, k) => { g.fillStyle = c; g.fillRect(-9, hem + 22 + k * 7, 16, 4); }); }
    g.restore();
    if (o.stick) { g.strokeStyle = INK; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(AF[2][0] + 2, AF[2][1] - 14); g.lineTo(AF[2][0] + 10, 4); g.stroke(); g.strokeStyle = '#6b4a2e'; g.lineWidth = 5; g.stroke(); } // walking stick, gripped by the front hand
    if (o.legsFront) { leg(LB, true, o.legB[2] || 0); leg(LF, false, o.legF[2] || 0); }
    if (o.handsFront) late = () => { arm(AB, true); arm(AF, false); }; else arm(AF, false);
  }
  if (!o.ghost && !o.noLantern) { g.save(); g.translate(...AF[2]); g.translate(0, 4); g.rotate(rad(o.lanternSwing)); lantern(o); g.restore(); }
  // neck + head
  if (o.prop === 'hoe') { const h = AF[2], k = [AF[2][0] - 22, AF[2][1] - 30], tip = [h[0] + 34, -6], dx = tip[0] - k[0], dy = tip[1] - k[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
    g.strokeStyle = INK; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(k[0] - ux * 20, k[1] - uy * 20); g.lineTo(...tip); g.stroke(); g.strokeStyle = '#7a5638'; g.lineWidth = 5; g.stroke();
    g.save(); g.translate(...tip); g.rotate(Math.atan2(uy, ux) - Math.PI / 2); g.fillStyle = '#6f747c'; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(-4, -4); g.lineTo(6, -4); g.lineTo(10, 26); g.lineTo(-14, 26); g.closePath(); g.fill(); g.stroke(); g.restore(); }
  if (o.prop === 'mirror') { const h = AF[2]; g.save(); g.translate(h[0] + 10, h[1] - 24); g.fillStyle = '#5a4a3a'; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.roundRect(-14, -26, 28, 44, 5); g.fill(); g.stroke(); g.fillStyle = '#9fb2bf'; g.beginPath(); g.roundRect(-10, -22, 20, 36, 3); g.fill(); g.restore(); }
  // neck + head
  g.save(); g.translate(...neck); g.rotate(rad(T * .5 - o.neck)); g.translate(0, -66); g.rotate(rad(-o.head)); face(o); g.restore();
  if (late) late();
  if (o.prop === 'statue') { // the wooden grave statue carried on the shoulder, both hands holding it
    g.save(); g.translate(chest[0] - 46, chest[1] - 70); g.rotate(rad(-14)); g.fillStyle = '#7a5638'; g.strokeStyle = INK; g.lineWidth = 3;
    g.beginPath(); g.roundRect(-22, 20, 44, 26, 5); g.fill(); g.stroke(); g.beginPath(); g.ellipse(0, -10, 28, 36, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.ellipse(0, -64, 25, 27, 0, 0, 7); g.fill(); g.stroke();
    g.fillStyle = '#6a4a30'; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * 11, -62, 12, 17, s * .15, 0, 7); g.fill(); g.stroke(); } g.restore(); }
  if (o.woodHands) { for (const hh of [AF[2], AB[2]]) { g.strokeStyle = 'rgba(90,55,30,.75)'; g.lineWidth = 1.8; for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(hh[0] - 7, hh[1] + 2 + k * 5); g.quadraticCurveTo(hh[0], hh[1] + 6 + k * 5, hh[0] + 7, hh[1] + 3 + k * 5); g.stroke(); } } }
  g.restore();
}
// temporal smoothing + follow-through: every joint is a weighted average of nearby times, limbs and head trail the body slightly
function smoothPose(t) { const ks = [-3, -2, -1, 0, 1, 2, 3], wt = ks.map(k => Math.exp(-k * k / 4)), h = 1 / 60;
  const avg = (tt) => { const ps = ks.map(k => pose(Math.max(0, tt + k * h))), sw = wt.reduce((a, b) => a + b), out = { ...ps[3] };
    for (const key in out) { const v = out[key]; if (typeof v === 'number') out[key] = ps.reduce((a, p, i) => a + p[key] * wt[i], 0) / sw; else if (Array.isArray(v)) out[key] = v.map((_, j) => ps.reduce((a, p, i) => a + p[key][j] * wt[i], 0) / sw); }
    return out; };
  const o = avg(t), lag = avg(Math.max(0, t - .06)), lagH = avg(Math.max(0, t - .04));
  o.armB = lag.armB; o.armF = lag.armF; o.head = lagH.head; o.faceDir = lagH.faceDir; o.blink = pose(t).blink; o.mouth = pose(t).mouth; o.shock = pose(t).shock; return o; }
function lantern(o) { g.save(); g.strokeStyle = '#2a2420'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 18); g.stroke();
  g.translate(0, 18); g.fillStyle = '#3a2e22'; g.fillRect(-16, 0, 32, 8); const fl = .85 + .15 * Math.sin(o.t * 23) * Math.sin(o.t * 7);
  const gl = g.createRadialGradient(0, 30, 2, 0, 30, 26); gl.addColorStop(0, `rgba(255,236,170,${fl})`); gl.addColorStop(1, 'rgba(255,150,60,.85)'); g.fillStyle = gl; g.beginPath(); g.roundRect(-14, 8, 28, 44, 8); g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
  g.fillStyle = '#3a2e22'; g.fillRect(-16, 50, 32, 7); g.restore(); }
// ---------------- performance (pure functions of t; springs integrated from t=0) ----------------
const walkEnd = 0, stopEnd = 0;
const jumpT = 7.0;
const V0 = 125, WSTOP = 3.5, STRIDE = 110; // walk speed px/s, eases to a stop by WSTOP
const vel = t => V0 * (1 - sm(seg(t, 2.5, WSTOP)));
function walkX(t) { let x = -80, n = 80, h = Math.min(t, WSTOP) / n; for (let i = 0; i < n; i++) x += vel((i + .5) * h) * h; return x; }
function rootX(t) { // walks in, eases to a stop, slow weight shift; flinches back at the scare with anticipation + overshoot
  const idle = sm(seg(t, 3.3, 4.3));
  const pre = t > 6.82 ? 8 * Math.sin(seg(t, 6.82, 7.0) * Math.PI / 2) * (1 - seg(t, 7.0, 7.1)) : 0;
  return walkX(t) + 5 * Math.sin((t - 3.3) * 1.1) * idle * (1 - seg(t, 6.6, 7)) + pre - (t > jumpT ? 42 * back(seg(t, jumpT, jumpT + .4), 1.6) : 0); }
function pose(t) {
  const w = vel(t) / V0, ph = (walkX(t) + 80) / STRIDE * Math.PI * 2, s = Math.sin(ph), c = Math.cos(ph);
  // gait for one leg at phase u (0..1): thigh swings ±24; swing phase (thigh travelling forward) bends the knee hard and lifts the foot,
  // stance keeps the leg nearly straight so the planted foot stays put; the foot rolls toe-down at lift and toe-up at heel strike
  const gait = (p) => { const u = ((p / (2 * Math.PI)) % 1 + 1) % 1, th = 18 * Math.sin(2 * Math.PI * u), sp = ((u - .75) % 1 + 1) % 1, sw = sp < .5 ? sp / .5 : -1;
    const knee = sw >= 0 ? -105 * Math.sin(Math.PI * Math.pow(sw, .6)) - 6 : -4 - 6 * Math.sin(Math.PI * (sp - .5) / .5), foot = sw >= 0 ? (sw < .7 ? 22 * Math.sin(Math.PI * sw / .7) : -14 * Math.sin(Math.PI * (sw - .7) / .3)) : 0;
    return [th, knee, foot]; };
  const gF = gait(ph), gB = gait(ph + Math.PI);
  // arms swing against the legs; the elbow bends more as the arm comes forward
  const armSw = (p) => { const a = -26 * Math.sin(p); return [a, 82 + 14 * Math.max(0, -Math.sin(p))]; }; // brisk walk: elbows held near 90, fists pump
  const aB = armSw(ph), aF = armSw(ph + Math.PI);
  // holds: during key beats the idle noise almost stops so the acting reads (anticipation -> action -> HOLD -> settle)
  const win = (a, b, e = .12) => sm(seg(t, a - e, a)) * (1 - sm(seg(t, b, b + e))), hm = 1 - .85 * Math.max(win(4.25, 4.7), win(6.2, 6.75));
  const br = Math.sin(t * 2.3) * (1 - w) * hm, sway = Math.sin(t * 1.1) * (1 - w) * hm;
  const o = { t, x: rootX(t), y: 1040, flip: 1, bob: 1.8 * br + 5 * s * s * w, lean: 1.5 * sway + 8 * w, bend: 3 + 2 * br + 3 * w,
    legF: [lerp(6 + 2 * sway, gF[0], w), lerp(-4, gF[1], w), gF[2] * w], legB: [lerp(-8 + 2 * sway, gB[0], w), lerp(-3, gB[1], w), gB[2] * w],
    armB: [lerp(-6 + 3 * br, aB[0] - 4, w), lerp(16 + 2 * br, aB[1], w)], armF: [lerp(4 + 2 * sway, aF[0] * .5 + 6, w), lerp(58 + 3 * br, 44 + aF[1] * .12, w)], spine: 0, neck: 0, head: (2 * Math.sin(t * .9) + 1.2 * Math.sin(t * 2.1)) * hm,
    faceDir: .5, look: .2, blink: 0, brow: 0, mouth: 0, shock: 0, squash: 0, tuft: 0, scarf: 0, lanternSwing: 0 };
  // a slow, eased head turn toward the grave house, the body follows a beat later (overlap)
  const turn = clamp(back(seg(t, 3.25, 4.05), 1.1), 0, 1.08), body = sm(seg(t, 3.5, 4.5));
  o.head += 3 * Math.sin(Math.PI * seg(t, 2.95, 3.3)); // anticipation: a small dip away before the turn
  o.faceDir = lerp(.5, .2, turn); o.look = lerp(.2, .9, turn); o.head += -7 * turn + 2.5 * Math.sin(ph) * w; o.lean += 3 * body; o.bend += 5 * body;
  o.armF[0] += 8 * body; o.armF[1] += 6 * body; // lifts the lantern toward the house
  const sp = seg(t, 4.7, 6.1); if (sp > 0 && sp < 1) { o.mouth = Math.abs(Math.sin(t * 13)) * (Math.sin(sp * Math.PI * 3) > -.4 ? .85 : .1); o.brow = 10; }
  if (t > 6.2 && t < 7) { const f = sm(seg(t, 6.2, 6.32)); o.head += 3 * (1 - sm(seg(t, 6.32, 6.9))); o.brow = 10 + 6 * f; o.look = .9 + .1 * f; o.bend -= 4 * f; o.head += -3 * f; }
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
      // full body (chibi, like the living characters): a long dark burial robe to the ankles, long sleeves, thin pale hands, bare feet
      const SK = '#8f9a95', RB = '#23252c', RBL = '#2e313a';
      for (const s of [-1, 1]) { ctx.fillStyle = SK; ctx.beginPath(); ctx.ellipse(s * 22, 214, 11, 6, 0, 0, 7); ctx.fill(); } // feet
      ctx.fillStyle = RB; ctx.beginPath(); ctx.moveTo(-14, 112); ctx.quadraticCurveTo(-44, 118, -50, 150); ctx.quadraticCurveTo(-60, 190, -58, 210); ctx.quadraticCurveTo(0, 218, 58, 210); ctx.quadraticCurveTo(60, 190, 50, 150); ctx.quadraticCurveTo(44, 118, 14, 112); ctx.closePath(); ctx.fill();
      ctx.fillStyle = RBL; ctx.beginPath(); ctx.moveTo(-14, 112); ctx.quadraticCurveTo(-44, 118, -50, 150); ctx.quadraticCurveTo(-60, 190, -58, 210); ctx.quadraticCurveTo(-30, 214, -18, 213); ctx.quadraticCurveTo(-24, 160, -6, 116); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 2; for (const xx of [-20, 4, 26]) { ctx.beginPath(); ctx.moveTo(xx * .6, 130); ctx.quadraticCurveTo(xx, 170, xx * 1.15, 210); ctx.stroke(); } // cloth folds
      for (const s of [-1, 1]) { ctx.fillStyle = RB; ctx.beginPath(); ctx.moveTo(s * 30, 120); ctx.quadraticCurveTo(s * 58, 140, s * 56, 196); ctx.lineTo(s * 40, 198); ctx.quadraticCurveTo(s * 40, 150, s * 24, 132); ctx.closePath(); ctx.fill(); // sleeves
        ctx.fillStyle = SK; ctx.beginPath(); ctx.moveTo(s * 42, 196); ctx.quadraticCurveTo(s * 47, 214, s * 50, 226); ctx.lineTo(s * 55, 225); ctx.quadraticCurveTo(s * 56, 210, s * 55, 196); ctx.closePath(); ctx.fill(); } // long thin fingers
      ctx.fillStyle = '#7d8984'; ctx.fillRect(-10, 104, 20, 40);
      // hair mass behind, middle-parted, frames the face
      ctx.fillStyle = '#1d1f26'; ctx.beginPath(); ctx.moveTo(0, -108); ctx.bezierCurveTo(-92, -106, -98, 40, -86, 190); ctx.lineTo(-76, 176); ctx.lineTo(-66, 200); ctx.lineTo(-54, 168); ctx.lineTo(-48, 110); ctx.lineTo(48, 110); ctx.lineTo(54, 172); ctx.lineTo(66, 204); ctx.lineTo(76, 174); ctx.lineTo(88, 192); ctx.bezierCurveTo(100, 40, 92, -106, 0, -108); ctx.fill();
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
// the dead of the grave house: tall, gaunt, hunched in the doorway (reference-style creature, not chibi)
function ghostTall(ctx, t) {
  const sg = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a))), io = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  const INK = '#0e0d12', SK = '#8d9a90', SKD = '#66736b', SKL = '#a7b3aa', HAIR = '#23242c';
  const mo = io(sg(t, 8.5, 9.1)), grip = io(sg(t, 7.9, 8.5)), br = Math.sin(t * 2.1);
  const line = (pts, w = 3, c = INK) => { ctx.beginPath(); ctx.moveTo(...pts[0]); for (let i = 1; i < pts.length; i++) ctx.lineTo(...pts[i]); ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); };
  const shape = (fn, fill, w = 3) => { ctx.beginPath(); fn(); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.stroke(); };
  // long hair falling behind the shoulders
  shape(() => { ctx.moveTo(-46, -40); ctx.bezierCurveTo(-60, -110, 60, -110, 46, -40); ctx.bezierCurveTo(78, 40, 88, 140, 74, 210); ctx.lineTo(60, 190); ctx.lineTo(52, 222); ctx.lineTo(40, 170); ctx.lineTo(-40, 170); ctx.lineTo(-50, 226); ctx.lineTo(-62, 186); ctx.lineTo(-76, 206); ctx.bezierCurveTo(-90, 140, -80, 40, -46, -40); }, HAIR);
  for (const s of [-1, 1]) for (let k = 0; k < 4; k++) line([[s * (40 + k * 6), -50 + k * 6], [s * (62 + k * 5), 60], [s * (56 + k * 6), 180 + k * 8]], 1.6, 'rgba(150,165,180,.35)');
  // left arm hangs long past the knee, fingers curled, dark nails
  const armL = [[-58, 96], [-88, 170], [-92, 252]];
  shape(() => { ctx.moveTo(-66, 90); ctx.quadraticCurveTo(-104, 170, -102, 254); ctx.lineTo(-84, 254); ctx.quadraticCurveTo(-82, 172, -50, 104); }, SK);
  for (let k = 0; k < 4; k++) { const fx = -104 + k * 7; line([[fx, 252], [fx - 2, 276 + (k % 2) * 6], [fx + 3, 286 + (k % 2) * 6]], 4.5, SKD); line([[fx + 3, 284 + (k % 2) * 6], [fx + 5, 292 + (k % 2) * 6]], 3.5, '#151317'); }
  // legs: thin, knees bent, feet splayed (partly behind the fence)
  for (const s of [-1, 1]) shape(() => { ctx.moveTo(s * 14, 232); ctx.quadraticCurveTo(s * 40, 256, s * 30, 296); ctx.lineTo(s * 56, 304); ctx.lineTo(s * 54, 312); ctx.lineTo(s * 16, 310); ctx.quadraticCurveTo(s * 18, 262, s * 2, 240); }, SKD);
  // emaciated torso: narrow waist, ribs, collarbones; breathes slowly
  shape(() => { ctx.moveTo(-24, 66); ctx.quadraticCurveTo(-66, 74, -68, 100); ctx.quadraticCurveTo(-50, 150, -36, 214); ctx.lineTo(36, 214); ctx.quadraticCurveTo(50, 150, 68, 100); ctx.quadraticCurveTo(66, 74, 24, 66); }, SK);
  ctx.save(); ctx.beginPath(); ctx.moveTo(10, 70); ctx.quadraticCurveTo(70, 90, 40, 214); ctx.lineTo(80, 214); ctx.lineTo(80, 60); ctx.closePath(); ctx.fillStyle = 'rgba(40,50,46,.35)'; ctx.fill(); ctx.restore();
  for (let k = 0; k < 4; k++) { const y = 118 + k * 15 + br; line([[-34 + k * 2, y], [-14, y + 6], [-4, y + 2]], 2.2, 'rgba(14,13,18,.65)'); line([[34 - k * 2, y], [14, y + 6], [4, y + 2]], 2.2, 'rgba(14,13,18,.65)'); }
  line([[-44, 84], [-10, 90]], 2.4, 'rgba(14,13,18,.7)'); line([[44, 84], [10, 90]], 2.4, 'rgba(14,13,18,.7)'); line([[0, 100], [0, 180]], 2, 'rgba(14,13,18,.4)');
  // tattered woven Jrai skirt: dark with faded red bands, ragged hem
  shape(() => { ctx.moveTo(-40, 196); ctx.lineTo(40, 196); ctx.lineTo(48, 252); for (let k = 0; k < 8; k++) ctx.lineTo(48 - k * 12 - 6, 252 + (k % 2 ? 16 : 4)); ctx.lineTo(-48, 252); }, '#24212a');
  ctx.fillStyle = 'rgba(122,42,38,.85)'; ctx.fillRect(-42, 206, 84, 7); ctx.fillRect(-45, 232, 90, 5);
  line([[-40, 196], [40, 196]], 3);
  // right arm reaches up and grips the door frame (long fingers wrap the post)
  const hx = lerp(70, 150, grip), hy = lerp(150, 70, grip);
  shape(() => { ctx.moveTo(56, 86); ctx.quadraticCurveTo(lerp(110, 120, grip), lerp(140, 84, grip), hx - 6, hy + 8); ctx.lineTo(hx + 10, hy + 14); ctx.quadraticCurveTo(lerp(124, 136, grip), lerp(150, 96, grip), 66, 104); }, SK);
  for (let k = 0; k < 4; k++) { const fy = hy - 8 + k * 8; line([[hx + 2, fy], [hx + 16, fy - 3], [hx + 20, fy + 6]], 4.5, SKD); line([[hx + 20, fy + 6], [hx + 18, fy + 12]], 3.5, '#151317'); } // fingers curl around the door post
  // long thin neck
  shape(() => { ctx.moveTo(-13, 30); ctx.lineTo(-15, 74); ctx.lineTo(15, 74); ctx.lineTo(13, 30); }, SKD, 2.5);
  line([[-6, 40], [-8, 66]], 2, 'rgba(14,13,18,.5)'); line([[6, 40], [8, 66]], 2, 'rgba(14,13,18,.5)');
  // head: long gaunt skull-like face, hair framing it
  ctx.save(); ctx.rotate(-.08 + .03 * Math.sin(t * .9));
  shape(() => { ctx.moveTo(0, -62); ctx.bezierCurveTo(36, -62, 44, -24, 40, 4); ctx.bezierCurveTo(36, 34, 18, 54, 0, 56); ctx.bezierCurveTo(-18, 54, -36, 34, -40, 4); ctx.bezierCurveTo(-44, -24, -36, -62, 0, -62); }, SKL);
  for (const s of [-1, 1]) { const cg = ctx.createRadialGradient(s * 22, 26, 2, s * 22, 26, 18); cg.addColorStop(0, 'rgba(40,50,46,.6)'); cg.addColorStop(1, 'rgba(40,50,46,0)'); ctx.fillStyle = cg; ctx.fillRect(s * 22 - 18, 8, 36, 36); } // hollow cheeks
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 16, -2, 14, 15, s * .15, 0, 7); ctx.fillStyle = '#0a090c'; ctx.fill(); } // deep sockets
  line([[-2, 10], [-4, 24], [2, 25]], 2.4, 'rgba(14,13,18,.7)');
  const mh = 6 + 26 * mo; ctx.beginPath(); ctx.ellipse(0, 38 + mh * .35, 7 + 3 * mo, mh * .5, 0, 0, 7); ctx.fillStyle = '#060507'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke();
  line([[-30, -26], [-8, -20]], 2, 'rgba(14,13,18,.5)'); line([[30, -26], [8, -20]], 2, 'rgba(14,13,18,.5)'); // brow ridge
  // hair over the crown, parted, stringy locks down the temples (face stays clear)
  shape(() => { ctx.moveTo(-2, -66); ctx.bezierCurveTo(-34, -70, -50, -40, -46, 6); ctx.lineTo(-38, -8); ctx.lineTo(-34, 16); ctx.bezierCurveTo(-36, -30, -22, -50, -2, -54); }, HAIR, 2.5);
  for (const s of [-1, 1]) line([[s * 4, -62], [s * 30, -50], [s * 40, -6]], 1.6, 'rgba(150,165,180,.4)');
  shape(() => { ctx.moveTo(2, -66); ctx.bezierCurveTo(34, -70, 50, -40, 46, 6); ctx.lineTo(38, -8); ctx.lineTo(34, 16); ctx.bezierCurveTo(36, -30, 22, -50, 2, -54); }, HAIR, 2.5);
  ctx.restore();
}
function ghostPose(t) { const fl = 3 * Math.sin(t * 1.6);
  return { t, x: 632, y: 1040 + fl - 6, sc: .66, flip: -1, ghost: true, bob: 0, lean: -2, spine: 0, bend: 0, squash: 0, legF: [3, -2, 0], legB: [-3, -2, 0],
    armB: [-4 + 2 * Math.sin(t * 1.3), 8], armF: [4 + 2 * Math.sin(t * 1.1 + 1), 6], neck: 0, head: 9 + 3 * Math.sin(t * .8), faceDir: -.05, look: 0, blink: 0, brow: 0,
    mouth: .15 + .85 * sm(seg(t, 8.5, 9.1)), shock: 0, scarf: 0, lanternSwing: 0 }; }
function ghostLayer(t, fa) { const L = ghostLayer.L || (ghostLayer.L = document.createElement('canvas')); L.width = W; L.height = H; const lc = L.getContext('2d'); lc.setTransform(g.getTransform());
  const keep = g, pal = { ...P }; g = lc; Object.assign(P, { skin: '#dfe3e0', skinD: '#b8bfbb', jacket: '#3b3e46', jacketD: '#2b2d34', pants: '#24262c', hair: '#15141a', shoe: '#2a2c30' }); character(ghostPose(t)); Object.assign(P, pal); g = keep;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = fa; g.drawImage(L, 0, 0); g.restore(); }
function ghost(t, wx, wy) { const a = sm(seg(t, 6.2, 6.9)); if (a <= 0) return; const jit = Math.floor(t * 12); const dx = (jit % 3 - 1) * 1.5;
  g.save(); g.translate(wx + dx, wy);
  const fa = .7 * sm(seg(t, 7.6, 8.6)); if (fa > 0 && false) { const L = ghost.L || (ghost.L = document.createElement('canvas')); L.width = 560; L.height = 720; const lc = L.getContext('2d'); lc.translate(260, 200); ghostTall(lc, t); g.save(); g.translate(0, 2 * Math.sin(t * 1.6)); g.rotate(rad(jit % 7 < 3 ? 3 : -2) * seg(t, 8.2, 8.4)); g.scale(.62, .62); g.globalAlpha = fa; g.drawImage(L, -260, -200); g.restore(); g.globalAlpha = 1; }
  for (const s of [-1, 1]) { const ex = s * 18, ey = 4; const hl = g.createRadialGradient(ex, ey, 0, ex, ey, 30); hl.addColorStop(0, `rgba(110,255,170,${(fa > 0 ? .35 : .55) * a})`); hl.addColorStop(1, 'rgba(110,255,170,0)'); g.globalAlpha = 1 - sm(seg(t, 7.6, 8.3)); g.fillStyle = hl; g.fillRect(ex - 30, ey - 30, 60, 60);
    g.fillStyle = `rgba(200,255,215,${a})`; g.beginPath(); g.ellipse(ex, ey, fa > 0 ? 3 : 4.5, fa > 0 ? 2.6 : 3.2, 0, 0, 7); g.fill(); }
  g.restore(); }
// ---------------- frame ----------------
const MIST = layer(2200, 400, (x, w, h) => { for (let i = 0; i < 40; i++) { const gr = x.createRadialGradient(0, 0, 0, 0, 0, 1); x.save(); x.translate(rnd() * w, 120 + rnd() * 220); x.scale(160 + rnd() * 200, 30 + rnd() * 30); const r = x.createRadialGradient(0, 0, 0, 0, 0, 1); r.addColorStop(0, 'rgba(170,184,200,.22)'); r.addColorStop(1, 'rgba(170,184,200,0)'); x.fillStyle = r; x.beginPath(); x.arc(0, 0, 1, 0, 7); x.fill(); x.restore(); } });
window.draw = (t) => {
  const o = smoothPose(t), sp = springs(t); o.tuft = sp.tuft; o.scarf = sp.scarf; o.lanternSwing = sp.lantern;
  // camera: follow the walk, then drift right, then push in on the ghost eyes
  const cut = t >= 7.6, cw = sm(seg(t, 0, 7.6)), cc = sm(seg(t, 7.6, 9.4)); const push = cut ? lerp(1.75, 2.0, cc) : lerp(.9, .96, cw); const focus = cut ? [640, lerp(930, 905, cc)] : [lerp(clamp(walkX(Math.max(0, t - .5)) + 230, 250, 420), 420, sm(seg(t, 2.4, 4.4))) + 25 * cw, lerp(720, 735, cw)];
  const shake = t > 7.0 && t < 7.4 ? (1 - seg(t, 7, 7.4)) * 10 * Math.sin(t * 90) : 0;
  g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(SKY, 0, 0);
  const view = (par) => { g.setTransform(push, 0, 0, push, W / 2 - focus[0] * push * par - (1 - par) * 0 + shake, H / 2 - focus[1] * push + shake * .5); };
  view(.15); g.drawImage(FAR, -200 + focus[0] * .85 * (1 - .15) * 0, 0); view(.45); g.drawImage(MID, -300, 0);
  view(1); g.drawImage(GROUND, -400, 860); g.drawImage(ROCK, 250, 165, 765, 935);
  ghost(t, 632, 862); { const fa = .7 * sm(seg(t, 7.6, 8.6)); if (fa > 0) ghostLayer(t, fa); }
  // character + lantern light pool
  const lx = o.x + 40, ly = o.y - 150; const pool = g.createRadialGradient(lx, ly, 10, lx, ly, 320); pool.addColorStop(0, 'rgba(255,190,110,.32)'); pool.addColorStop(1, 'rgba(255,190,110,0)');
  character(o);
  g.globalCompositeOperation = 'lighter'; g.fillStyle = pool; g.fillRect(lx - 340, ly - 340, 680, 680); g.globalCompositeOperation = 'source-over';
  g.globalAlpha = .55; g.drawImage(MIST, -600 + (t * 30) % 600, 860); g.globalAlpha = 1;
  // grade: cold tint + vignette, then blackout at the end
  g.setTransform(1, 0, 0, 1, 0, 0); const v = g.createRadialGradient(W / 2, H * .55, H * .25, W / 2, H * .55, H * .75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,8,.55)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
  if (t > 7.0 && t < 7.08) { g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(0, 0, W, H); }
  const bo = sm(seg(t, 9.2, 9.6)); if (bo > 0) { g.fillStyle = `rgba(0,0,0,${bo})`; g.fillRect(0, 0, W, H); }
  // subtitle
  const sub = t > 4.7 && t < 6.3 ? 'AI... AI ĐÓ?' : null; if (sub) { g.font = '900 64px "DejaVu Sans"'; g.textAlign = 'center'; g.lineJoin = 'round'; g.lineWidth = 14; g.strokeStyle = '#000'; g.strokeText(sub, W / 2, H * .8); g.fillStyle = '#fff'; g.fillText(sub, W / 2, H * .8); }
};
window.READY = true;
// ---------------- character design sheet (rendered on demand by sheet.cjs) ----------------
window.sheet = (who) => {
  g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#2a3040'; g.fillRect(0, 0, W, H); const gr = g.createRadialGradient(W / 2, H * .5, 50, W / 2, H * .5, 700); gr.addColorStop(0, 'rgba(255,255,255,.06)'); gr.addColorStop(1, 'rgba(0,0,0,.3)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const base = { t: 0, y: 0, flip: 1, bob: 0, lean: 0, spine: 0, bend: 3, squash: 0, legF: [6, -4, 0], legB: [-8, -3, 0], armB: [-6, 16], armF: [10, 22], neck: 0, head: 0, faceDir: .25, look: .1, blink: 0, brow: 0, mouth: 0, shock: 0, scarf: 0, lanternSwing: 0, noLantern: true };
  const C = {
    khai: { label: 'Khải – dân buôn đồ cổ Sài Gòn', pal: {}, o: { hair: 'short', outfit: { top: 'coat' } } },
    tung: { label: 'Tùng – bạn đi cùng', pal: { skin: '#e8c7a8' }, o: { hair: 'cap', outfit: { top: 'tee', sleeve: 'short', col: '#b8523f', colD: '#8e3c2f', bot: '#2e4466', botD: '#22334d', feet: 'boots' } } },
    gia: { label: 'Già làng Jrai', pal: { skin: '#a97b55', skinD: '#87603f' }, o: { hair: 'white', bend: 14, lean: 7, head: -6, stick: true, armF: [24, 30], legF: [10, -12, 0], legB: [-6, -10, 0], outfit: { top: 'vest', sleeve: 'none', col: '#1f2233', colD: '#171a28', trim: ['#a3332c', '#e8e0d0', '#a3332c'], bottom: 'loin', bot: '#1f2233', feet: 'bare' } } },
    danNam: { label: 'Dân làng (nam)', pal: { skin: '#b9875e', skinD: '#986a45', hair: '#121016' }, o: { hair: 'short', outfit: { top: 'vest', sleeve: 'none', col: '#26293a', colD: '#1c1f2c', trim: ['#a3332c', '#e8e0d0'], bottom: 'loin', bot: '#26293a', feet: 'bare' } } },
    danNu: { label: 'Dân làng (nữ)', pal: { skin: '#c08f66', skinD: '#9c6f4a' }, o: { hair: 'bun', outfit: { top: 'blouse', sleeve: 'long', col: '#22253a', colD: '#1a1c2c', trim: ['#a3332c', '#e8e0d0', '#a3332c'], bottom: 'skirt', bot: '#22253a', trim: ['#a3332c', '#e8e0d0', '#a3332c'] } } },
    ma: { label: 'Người chết nhà mồ (ma, mờ 70%)', pal: { skin: '#dfe3e0', skinD: '#b8bfbb', hair: '#15141a' }, o: { ghost: true, flip: -1, faceDir: -.05, head: 9, mouth: .5, armB: [-4, 8], armF: [4, 6] } },
    trum: { label: 'Dân làng trùm kín mặt (cảnh cuối)', pal: { skin: '#b9875e', skinD: '#986a45' }, o: { hair: 'shroud', outfit: { top: 'vest', sleeve: 'none', col: '#26293a', colD: '#1c1f2c', trim: ['#a3332c'], bottom: 'loin', bot: '#26293a', feet: 'bare' } } },
  }[who];
  const pal = { ...P }; Object.assign(P, C.pal);
  const o = { ...base, ...C.o, x: W / 2, y: H * .72, sc: 1.25 };
  if (o.ghost) { const L = document.createElement('canvas'); L.width = W; L.height = H; const keep = g; g = L.getContext('2d'); character(o); g = keep; g.save(); g.globalAlpha = .7; g.drawImage(L, 0, 0); g.restore(); } else character(o); Object.assign(P, pal);
  g.setTransform(1, 0, 0, 1, 0, 0); g.font = "700 26px DejaVu Sans"; g.textAlign = 'center'; g.fillStyle = '#e9e6de'; g.fillText(C.label, W / 2, H * .86);
};

window.poses = (who) => {
  g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#2a3040'; g.fillRect(0, 0, W, H);
  const base = { t: 0, flip: 1, bob: 0, lean: 0, spine: 0, bend: 3, squash: 0, legF: [6, -4, 0], legB: [-8, -3, 0], armB: [-6, 16], armF: [10, 22], neck: 0, head: 0, faceDir: .25, look: .1, blink: 0, brow: 0, mouth: 0, shock: 0, scarf: 0, lanternSwing: 0, noLantern: true };
  const SIT = { y: 94, legsFront: true, legF: [160, -165, 0], legB: [150, -160, 0], bend: 6, lean: -25 };
  const set = {
    khai: { pal: {}, hair: 'short', outfit: { top: 'coat' }, list: [
      ['Đi bộ', { legF: [16, -8, 0], legB: [-14, -70, 18], armB: [-24, 84], armF: [20, 84], lean: 7, bob: 3 }],
      ['Vác tượng', { prop: 'statue', handsFront: true, armF: [170, 70], armB: [180, 60], lean: 4, bend: -4, legF: [12, -10, 0], legB: [-10, -6, 0], head: 6, brow: 10 }],
      ['Cầm cuốc đào đất', { prop: 'hoe', armF: [40, 20], armB: [30, 40], lean: -16, bend: 14, head: -10, legF: [18, -16, 0], legB: [-16, -4, 0], brow: 10, woodHands: true }],
      ['Soi gương hoảng sợ', { prop: 'mirror', armF: [70, 100], armB: [10, 30], shock: 1, mouth: .7, brow: 18, look: .8, lean: -6, bend: -4 }],
      ['Nhìn tay hóa gỗ', { armF: [60, 70], armB: [50, 80], head: 14, look: .4, lean: 6, bend: 10, brow: 14, mouth: .2, woodHands: true }],
      ['Ngồi bó gối ôm mặt', { ...SIT, handsFront: true, armF: [160, 120], armB: [166, 112], head: -15, blink: 1 }],
    ] },
    tung: { pal: { skin: '#e8c7a8' }, hair: 'cap', outfit: { top: 'tee', sleeve: 'short', col: '#b8523f', colD: '#8e3c2f', bot: '#2e4466', botD: '#22334d' }, list: [
      ['Nhét chim gỗ vào túi', { handsFront: true, armF: [20, 150], armB: [-4, 12], head: -4, look: -.4, faceDir: .1, mouth: 0, brow: -6 }],
      ['Than tay tê cứng', { armF: [70, 80], armB: [60, 90], head: 10, brow: 14, mouth: .4, woodHands: true }],
      ['Ngồi sợ trên xe', { ...SIT, lean: -10, armF: [120, 70], armB: [114, 76], head: 0, brow: 18, look: .6, blink: 0 }],
      ['Hóa gỗ, ôm mặt', { ...SIT, handsFront: true, armF: [160, 120], armB: [166, 112], head: -15, blink: 1, wood: true }],
    ] },
    gia: { pal: { skin: '#a97b55', skinD: '#87603f' }, hair: 'white', outfit: { top: 'vest', sleeve: 'none', col: '#1f2233', colD: '#171a28', trim: ['#a3332c', '#e8e0d0', '#a3332c'], bottom: 'loin', bot: '#1f2233', feet: 'bare' }, list: [
      ['Chống gậy', { stick: true, bend: 14, lean: 7, head: -6, armF: [24, 30], legF: [10, -12, 0], legB: [-6, -10, 0] }],
      ['Lắc đầu từ chối', { stick: true, bend: 14, lean: 7, head: -14, faceDir: -.2, armF: [24, 30], legF: [10, -12, 0], legB: [-6, -10, 0], brow: -10 }],
      ['Giơ tay cảnh báo', { bend: 10, lean: 4, armF: [120, 40], armB: [-4, 12], head: -4, brow: -14, mouth: .5, legF: [10, -12, 0], legB: [-6, -10, 0] }],
    ] } }[who];
  const pal = { ...P }; Object.assign(P, set.pal); const n = set.list.length, cols = n > 4 ? 3 : 2, rows = Math.ceil(n / cols), cw = W / cols, ch = H / rows;
  set.list.forEach(([label, p], i) => { const cx = (i % cols + .5) * cw, cy = (Math.floor(i / cols) + .78) * ch;
    if (p.wood) { const keep = { ...P }; Object.assign(P, { skin: '#9a6e46', skinD: '#7a5636' }); character({ ...base, hair: set.hair, outfit: { ...set.outfit, col: '#8a6040', colD: '#6e4c32', bot: '#7a5638', botD: '#5e432b' }, ...p, x: cx, y: cy + (p.y || 0) * .62, sc: .62 }); Object.assign(P, keep); }
    else character({ ...base, hair: set.hair, outfit: set.outfit, ...p, x: cx, y: cy + (p.y || 0) * .62, sc: .62 });
    g.setTransform(1, 0, 0, 1, 0, 0); g.font = '700 22px DejaVu Sans'; g.textAlign = 'center'; g.fillStyle = '#e9e6de'; g.fillText(label, cx, cy + 40); });
  Object.assign(P, pal); };
window.poseTest = (list) => { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#2a3040'; g.fillRect(0, 0, W, H);
  const base = { t: 0, flip: 1, bob: 0, lean: 0, spine: 0, bend: 3, squash: 0, legF: [6, -4, 0], legB: [-8, -3, 0], armB: [-6, 16], armF: [10, 22], neck: 0, head: 0, faceDir: .25, look: .1, blink: 1, brow: 0, mouth: 0, shock: 0, scarf: 0, lanternSwing: 0, noLantern: true, hair: 'short', outfit: { top: 'coat' } };
  list.forEach((p, i) => { const cx = (i % 3 + .5) * W / 3, cy = (Math.floor(i / 3) + .78) * H / 2; character({ ...base, ...p, x: cx, y: cy + (p.y || 0) * .62, sc: .62 }); g.setTransform(1, 0, 0, 1, 0, 0); g.font = '16px DejaVu Sans'; g.fillStyle = '#fff'; g.textAlign = 'center'; g.fillText(JSON.stringify(p).slice(0, 60), cx, cy + 40); }); };
