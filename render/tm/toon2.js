// Flat cartoon cards for "Tượng nhà mồ". Design space 600x1000, soles at y=975.
export const INK = '#241726';
const rad = d => d * Math.PI / 180;
class Pen {
  constructor(g) { this.g = g; }
  curve(pts) { const g = this.g; g.beginPath(); g.moveTo(...pts[0]); for (let i = 1; i < pts.length - 1; i++) { const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]; g.quadraticCurveTo(...pts[i], ...m); } g.lineTo(...pts[pts.length - 1]); }
  line(pts, col, w) { const g = this.g; this.curve(pts); g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(); }
  inkLine(pts, col, w) { this.line(pts, INK, w + 10); this.line(pts, col, w); }
  fillInk(col, w = 10) { const g = this.g; g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = w; g.lineJoin = 'round'; g.stroke(); }
  ell(cx, cy, rx, ry, rot = 0) { this.g.beginPath(); this.g.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2); }
  dot(x, y, r, col) { this.ell(x, y, r, r); this.g.fillStyle = col; this.g.fill(); }
  shade(col, dk, x0, y0, x1, y1) { const gr = this.g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, col); gr.addColorStop(.55, col); gr.addColorStop(1, dk); return gr; }
  poly(pts) { const g = this.g; g.beginPath(); g.moveTo(...pts[0]); for (const p of pts.slice(1)) g.lineTo(...p); g.closePath(); }
}
const dk = (hex, k = .72) => { const n = parseInt(hex.slice(1), 16); const r = (n >> 16) * k, g = (n >> 8 & 255) * k, b = (n & 255) * k; return `rgb(${r | 0},${g | 0},${b | 0})`; };
// wood grain lines over whatever is drawn (source-atop)
function grain(g, x0, y0, x1, y1, amt = 1, seed = 1) {
  if (amt <= 0) return; g.save(); g.globalCompositeOperation = 'source-atop'; g.globalAlpha = .55 * Math.min(1, amt);
  g.strokeStyle = '#5a3a22'; g.lineWidth = 3;
  for (let i = 0; i < 26; i++) { const x = x0 + (i + .5) / 26 * (x1 - x0); g.beginPath(); g.moveTo(x, y0); for (let y = y0; y <= y1; y += 30) g.lineTo(x + 6 * Math.sin(y * .03 + i * seed), y); g.stroke(); }
  g.restore();
}
// ---------- face ----------
function face(p, cx, cy, o) {
  const { eye = 'dot', mth = 'dash', brow = 0, look = 0, blink = 0, open = 0, carve = 0 } = o; const g = p.g;
  for (const s of [-1, 1]) {
    const x = cx + s * 31, y = cy;
    if (blink > .5 || eye === 'closed') { p.line([[x - 14, y + 2], [x, y + 7], [x + 14, y + 2]], INK, 6); continue; }
    if (eye === 'shock') { p.ell(x, y, 17, 21); p.fillInk('#ffffff', 5); p.dot(x + look * 4, y + 2, 5, INK); continue; }
    if (eye === 'squeeze') { p.line([[x - 15, y - 6], [x + s * 10, y], [x - 15, y + 6]].map(([X, Y]) => [s > 0 ? 2 * x - X : X, Y]), INK, 6); continue; }
    if (eye === 'lid') { p.dot(x + look * 6, y + 3, 9, INK); p.line([[x - 14, y - 2], [x + 14, y - 2]], INK, 5); continue; }
    p.ell(x + look * 6, y, 9, 12); g.fillStyle = INK; g.fill(); p.dot(x + look * 6 - 3, y - 4, 3, '#ffffff');
  }
  for (const s of [-1, 1]) p.line([[cx + s * 16, cy - 38 + brow * .45], [cx + s * 48, cy - 38 - brow * .45]], INK, 6);
  const my = cy + 56;
  if (mth === 'smile') p.line([[cx - 16, my - 3], [cx, my + 6], [cx + 16, my - 3]], INK, 5);
  else if (mth === 'frown') p.line([[cx - 14, my + 5], [cx, my - 3], [cx + 14, my + 5]], INK, 5);
  else if (mth === 'wave') p.line([[cx - 16, my], [cx - 8, my - 4], [cx, my], [cx + 8, my - 4], [cx + 16, my]], INK, 5);
  else if (mth === 'O') { p.ell(cx, my + 4, 11, 15 + open * 4); p.fillInk('#5a1f2a', 5); }
  else if (mth === 'teeth') { p.ell(cx, my + 2, 20, 9); p.fillInk('#ffffff', 5); p.line([[cx - 18, my + 2], [cx + 18, my + 2]], INK, 3); }
  else if (mth === 'talk') { p.ell(cx, my + 2, 11, 3 + open * 9); p.fillInk('#5a1f2a', 5); }
  else p.line([[cx - 11, my], [cx + 11, my]], INK, 5);
  if (carve > 0) { g.save(); g.globalAlpha = Math.min(1, carve); for (const [a, b] of [[[cx - 70, cy - 60], [cx - 40, cy + 40]], [[cx + 70, cy - 60], [cx + 42, cy + 40]], [[cx - 30, cy + 80], [cx + 30, cy + 80]], [[cx - 60, cy - 70], [cx + 60, cy - 70]], [[cx - 20, cy + 20], [cx - 50, cy + 70]]]) p.line([a, b], '#7a4a2a', 5); g.restore(); }
}
// ---------- standing person ----------
// o: skin, hair:'short'|'cap'|'scarf'|'bun'|'grey', shirt, pants, vest, stripe (Jrai red stripe), skirt, arms:'hang'|'cover'|'carry'|'flash'|'hoe'|'hands'|'point'|'cheek'|'pocket', wood (0..1), step, tilt, headTilt
export function drawPerson(g, o) {
  const p = new Pen(g); g.clearRect(0, 0, 600, 1000);
  const { skin = '#f1c9a5', hair = 'short', hairCol = '#1e1a22', shirt = '#5f7f9a', pants = '#3b3f52', vest = null, stripe = null, skirt = null, arms = 'hang', wood = 0, step = 0, tilt = 0, headTilt = 0, mustache = 0, prop = null, handWood = 0 } = o;
  const W = wood > .5; const S = W ? '#b07a48' : skin, SD = dk(S), SH = W ? '#a06c3e' : shirt, PA = W ? '#8e5c34' : pants;
  g.save(); g.translate(300, 975); g.rotate(rad(tilt)); g.translate(-300, -975);
  const lk = Math.sin(step * Math.PI * 2) * 24;
  // legs
  if (skirt && !W) { g.beginPath(); g.moveTo(232, 560); g.lineTo(220, 900); g.lineTo(380, 900); g.lineTo(368, 560); g.closePath(); g.fillStyle = p.shade(skirt, dk(skirt), 230, 600, 380, 900); g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke(); if (stripe) { p.line([[224, 860], [376, 860]], stripe, 10); p.line([[226, 830], [374, 830]], '#e8e2d0', 5); } }
  for (const [x, k] of [[272, lk], [328, -lk]]) {
    p.inkLine([[x, 600], [x + k * .4, 780], [x + k, 940]], skirt && !W ? S : PA, skirt ? 15 : 34);
    p.ell(x + k + 6, 955, 30, 15); p.fillInk(W ? '#7a4e2c' : (skirt ? S : '#3a2a22'), 7);
  }
  // torso
  g.beginPath(); g.moveTo(222, 420); g.quadraticCurveTo(300, 392, 378, 420); g.lineTo(384, 610); g.quadraticCurveTo(300, 628, 216, 610); g.closePath();
  g.fillStyle = p.shade(SH, dk(SH), 220, 420, 384, 620); g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke();
  if (stripe && !W) { p.line([[220, 470], [380, 470]], stripe, 12); p.line([[219, 492], [381, 492]], '#e8e2d0', 5); p.line([[300, 410], [300, 610]], stripe, 6); }
  if (vest && !W) { for (const s of [-1, 1]) { p.poly([[300 + s * 8, 410], [300 + s * 78, 422], [300 + s * 84, 612], [300 + s * 14, 618]]); p.fillInk(vest, 8); p.ell(300 + s * 46, 520, 16, 12); p.fillInk(dk(vest), 4); } }
  p.line([[220, 600], [380, 600]], W ? '#6a4426' : '#2a2328', 9); // belt
  // arms
  const SHL = [[228, 432], [372, 432]];
  const A = { hang: [[200, 640], [400, 640]], cover: [[262, 262], [338, 262]], cheek: [[238, 300], [362, 300]], carry: [[220, 330], [378, 330]], flash: [[205, 640], [430, 470]], hoe: [[250, 520], [350, 470]], hands: [[262, 380], [338, 380]], point: [[200, 640], [480, 400]], pocket: [[200, 640], [355, 570]], reach: [[200, 640], [470, 520]] }[arms];
  const drawArms = () => { for (let i = 0; i < 2; i++) { const a = SHL[i], h = A[i]; const m = [(a[0] + h[0]) / 2 + (i ? 22 : -22), (a[1] + h[1]) / 2 + 10]; p.inkLine([a, m, h], SH, 26); const hc = (handWood > .5 || W) ? '#b07a48' : S; p.dot(h[0], h[1], 15, hc); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); if (handWood > 0 && !W) { g.save(); g.globalAlpha = Math.min(1, handWood); for (let k = -1; k <= 1; k++) p.line([[h[0] - 9, h[1] + k * 6 - 4], [h[0] + 9, h[1] + k * 6 + 2]], '#6a4426', 3); g.restore(); } } };
  if (arms !== 'cover' && arms !== 'cheek' && arms !== 'hands') drawArms();
  // props in hands
  if (prop === 'flash') { const h = A[1]; g.save(); g.translate(h[0], h[1]); g.rotate(-.5); g.beginPath(); g.roundRect(-10, -50, 20, 60, 5); p.fillInk('#3a3a44', 5); g.restore(); }
  if (prop === 'hoe') { p.inkLine([[230, 600], [400, 300]], '#8a6040', 10); p.poly([[392, 288], [430, 300], [418, 330], [396, 316]]); p.fillInk('#70757e', 5); }
  if (prop === 'bird') { const h = A[1]; p.ell(h[0], h[1] - 10, 22, 14); p.fillInk('#a87a4c', 5); p.dot(h[0] + 18, h[1] - 18, 8, '#a87a4c'); }
  // neck + head
  g.save(); g.translate(300, 410); g.rotate(rad(headTilt)); g.translate(-300, -410);
  p.inkLine([[300, 360], [300, 420]], S, 30);
  if (hair === 'bun' || hair === 'grey') { p.dot(300, 140, 34, hair === 'grey' ? '#c9c6cc' : hairCol); }
  p.ell(300, 270, 110, 118); g.fillStyle = p.shade(S, SD, 230, 200, 380, 370); g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke();
  const HC = W ? '#7a4e2c' : (hair === 'grey' ? '#c9c6cc' : hairCol);
  if (hair === 'short' || hair === 'grey' || hair === 'bun') { g.beginPath(); g.moveTo(192, 250); g.bezierCurveTo(186, 128, 414, 128, 408, 250); g.quadraticCurveTo(380, 196, 330, 200); g.quadraticCurveTo(300, 178, 262, 204); g.quadraticCurveTo(214, 200, 192, 250); g.closePath(); p.fillInk(HC, 9); }
  if (hair === 'cap') { g.beginPath(); g.moveTo(190, 236); g.bezierCurveTo(196, 128, 404, 128, 410, 236); g.closePath(); p.fillInk(W ? '#8e5c34' : (o.capCol || '#4d6a3a'), 9); p.poly([[380, 226], [470, 236], [466, 252], [404, 246]]); p.fillInk(W ? '#8e5c34' : (o.capCol || '#4d6a3a'), 7); }
  if (hair === 'scarf') { g.beginPath(); g.moveTo(190, 236); g.bezierCurveTo(196, 140, 404, 140, 410, 236); g.lineTo(410, 252); g.lineTo(190, 252); g.closePath(); p.fillInk(W ? '#8e5c34' : '#2a2430', 8); p.line([[192, 232], [408, 232]], W ? '#6a4426' : (stripe || '#b23a32'), 8); }
  if (W) { grain(g, 180, 130, 420, 400, 1, 2); }
  face(p, 300, 280, o);
  if (mustache && !W) p.line([[272, 322], [300, 316], [328, 322]], '#2a2228', 7);
  g.restore();
  if (arms === 'cover' || arms === 'cheek' || arms === 'hands') drawArms();
  if (W) grain(g, 180, 400, 420, 960, 1, 3);
  g.restore();
}
// ---------- crouching figure (squatting, knees up, both hands over the face) ----------
// kind: 'statue' (carved wood mourner) | 'person' (live person, same pose) ; peek: hands slipping 0..1
export function drawCrouch(g, o) {
  const p = new Pen(g); g.clearRect(0, 0, 600, 1000);
  const { kind = 'statue', skin = '#f1c9a5', shirt = '#7a8a6a', pants = '#3b3f52', hair = 'short', hairCol = '#1e1a22', wood = kind === 'statue' ? 1 : 0, peek = 0, cut = 0, shake = 0 } = o;
  const C = wood > .5 ? '#a8743f' : shirt, P = wood > .5 ? '#94643a' : pants, S = wood > .5 ? '#b5804a' : skin, H = wood > .5 ? '#8a5a32' : hairCol;
  g.save(); g.translate(shake * Math.sin((o.t || 0) * 40), 0);
  if (kind === 'statue') { p.poly([[230, 975], [370, 975], [360, 900], [240, 900]]); p.fillInk(cut ? '#c89a62' : '#7a4e2c', 8); }
  // feet + shins (knees up)
  for (const s of [-1, 1]) { p.ell(300 + s * 60, 905, 38, 18); p.fillInk(wood > .5 ? '#8e5c34' : '#3a2a22', 7); p.inkLine([[300 + s * 60, 900], [300 + s * 70, 720]], P, 44); }
  // torso (bent forward)
  g.beginPath(); g.moveTo(228, 600); g.quadraticCurveTo(300, 560, 372, 600); g.lineTo(384, 860); g.quadraticCurveTo(300, 880, 216, 860); g.closePath(); g.fillStyle = p.shade(C, dk(C), 220, 600, 384, 870); g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke();
  // knees in front
  g.beginPath(); g.roundRect(206, 716, 188, 76, 38); p.fillInk(P, 9); p.line([[300, 724], [300, 784]], dk(P, .6), 4);
  // head bowed onto the hands
  const hy = 520 - peek * 10;
  p.ell(300, hy, 104, 110); g.fillStyle = p.shade(S, dk(S), 230, 440, 380, 620); g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke();
  if (wood > .5) { p.ell(300, hy - 6, 104, 104); g.save(); g.clip(); p.ell(300, hy - 70, 120, 60); g.fillStyle = H; g.fill(); g.restore(); }
  else { g.beginPath(); g.moveTo(198, hy - 10); g.bezierCurveTo(190, hy - 130, 410, hy - 130, 402, hy - 10); g.quadraticCurveTo(300, hy - 70, 198, hy - 10); g.closePath(); p.fillInk(H, 9); }
  // arms from shoulders to the face, hands covering it
  const sl = peek * 40;
  for (const s of [-1, 1]) { p.inkLine([[300 + s * 78, 616], [300 + s * 96, 690], [300 + s * (40 + sl), hy + 40]], C, 30); }
  for (const s of [-1, 1]) { p.ell(300 + s * (34 + sl), hy + 20 + peek * 30, 42, 58); p.fillInk(S, 8); for (let k = -1; k <= 1; k++) p.line([[300 + s * (34 + sl) + k * 14, hy - 26 + peek * 30], [300 + s * (34 + sl) + k * 14, hy + 4 + peek * 30]], dk(S, .6), 4); }
  if (peek > .3 && wood < .5) { g.save(); g.globalAlpha = (peek - .3) / .7; for (const s of [-1, 1]) p.ell(300 + s * 30, hy + 10, 12, 16), p.fillInk('#ffffff', 4), p.dot(300 + s * 30, hy + 12, 5, INK); g.restore(); }
  if (wood > .5) { grain(g, 190, 400, 410, 975, 1, 5); for (const s of [-1, 1]) p.line([[300 + s * 20, hy + 70], [300 + s * 50, hy + 90]], '#6a4426', 5); }
  if (o.cap) { g.beginPath(); g.moveTo(194, hy - 30); g.bezierCurveTo(200, hy - 140, 400, hy - 140, 406, hy - 30); g.closePath(); p.fillInk(o.capCol || '#94643a', 9); p.poly([[380, hy - 40], [470, hy - 30], [466, hy - 14], [404, hy - 20]]); p.fillInk(o.capCol || '#94643a', 7); grain(g, 190, hy - 150, 480, hy - 10, .8, 9); }
  if (o.patch) { g.save(); g.globalAlpha = .9; for (const [x, y, r] of [[250, 640, 26], [350, 780, 30], [232, 820, 20], [372, 660, 18]]) { p.ell(x, y, r, r * .8); g.fillStyle = o.patch; g.fill(); } g.restore(); }
  g.restore();
}
// ---------- the dead (ghost of an old Jrai man) ----------
export function drawDead(g, o) {
  const p = new Pen(g); g.clearRect(0, 0, 600, 1000);
  const { pose = 'crouch', scream = 0, headTilt = 0, reach = 0 } = o;
  const SK = '#a7b3a8', SKD = '#6c7a6e', CL = '#2a2630';
  g.save();
  // crouched body, black Jrai cloth with a red stripe
  if (pose === 'crouch') {
    for (const s of [-1, 1]) { p.inkLine([[300 + s * 60, 900], [300 + s * 70, 720]], SK, 34); }
    g.beginPath(); g.moveTo(222, 590); g.quadraticCurveTo(300, 550, 378, 590); g.lineTo(388, 870); g.quadraticCurveTo(300, 890, 212, 870); g.closePath(); p.fillInk(CL, 10);
    p.line([[214, 700], [386, 700]], '#7a2a2a', 10);
    g.beginPath(); g.roundRect(208, 720, 184, 72, 36); p.fillInk(CL, 9); p.line([[214, 756], [386, 756]], '#7a2a2a', 8);
  }
  // long thin arms reaching sideways (toward Khải)
  p.inkLine([[378, 610], [460 + reach * 40, 640], [520 + reach * 50, 600 - reach * 40]], SK, 20);
  for (let k = -1; k <= 1; k++) p.line([[520 + reach * 50, 600 - reach * 40], [548 + reach * 50, 592 - reach * 40 + k * 12]], SKD, 6);
  p.inkLine([[222, 610], [200, 720], [230, 800]], SK, 20);
  // head: long gaunt face, stringy grey hair hanging beside it (never over it), small staring eyes in deep sockets
  g.save(); g.translate(300, 560); g.rotate(rad(headTilt)); g.translate(-300, -560);
  p.inkLine([[300, 510], [300, 575]], SK, 22);
  for (const s of [-1, 1]) for (let k = 0; k < 5; k++) p.line([[300 + s * (60 + k * 8), 330 + k * 4], [300 + s * (82 + k * 6), 440], [300 + s * (76 + k * 9), 560 + k * 14]], k % 2 ? '#8e8a92' : '#bdb9c2', 5);
  g.beginPath(); g.moveTo(300, 296); g.bezierCurveTo(372, 296, 386, 380, 376, 450); g.bezierCurveTo(366, 520, 330, 552, 300, 552); g.bezierCurveTo(270, 552, 234, 520, 224, 450); g.bezierCurveTo(214, 380, 228, 296, 300, 296); g.closePath();
  g.fillStyle = p.shade(SK, SKD, 230, 320, 380, 540); g.fill(); g.strokeStyle = INK; g.lineWidth = 9; g.stroke();
  g.save(); g.clip(); g.fillStyle = 'rgba(40,50,48,.28)'; for (const s of [-1, 1]) { p.ell(300 + s * 52, 470, 22, 40); g.fill(); } p.ell(300, 300, 90, 26); g.fillStyle = 'rgba(30,30,36,.35)'; g.fill(); g.restore();
  g.beginPath(); g.moveTo(232, 352); g.quadraticCurveTo(300, 300, 368, 352); g.quadraticCurveTo(300, 330, 232, 352); p.fillInk('#bdb9c2', 6);
  for (const [s, dy] of [[-1, 0], [1, 7]]) { const x = 300 + s * 34, y = 418 + dy;
    p.ell(x, y, 26, 20); g.fillStyle = 'rgba(20,14,26,.75)'; g.fill();
    p.ell(x, y + 1, 13, 10 + scream * 3); g.fillStyle = '#050307'; g.fill();
    p.dot(x + (o.look || 0) * 3, y + 1, 2.6, '#e8eef0'); }
  p.line([[294, 440], [290, 470], [298, 474]], SKD, 4);
  p.ell(300, 505 + scream * 12, 13 + scream * 3, 3 + scream * 30); g.fillStyle = '#0c0608'; g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
  for (const s of [-1, 1]) p.line([[300 + s * 14, 506 + scream * 10], [300 + s * 24, 516 + scream * 12]], SKD, 4);
  g.restore(); g.restore();
}
// ---------- wooden bird (small grave statue) ----------
export function drawBird(g) {
  const p = new Pen(g); g.clearRect(0, 0, 600, 1000);
  p.poly([[270, 975], [330, 975], [322, 760], [278, 760]]); p.fillInk('#8e5c34', 8);
  p.ell(300, 700, 110, 70); p.fillInk('#a8743f', 9); p.ell(400, 640, 44, 40); p.fillInk('#a8743f', 8); p.poly([[440, 630], [490, 645], [440, 655]]); p.fillInk('#7a4e2c', 6); p.dot(410, 632, 7, INK);
  p.poly([[200, 690], [140, 640], [190, 720]]); p.fillInk('#94643a', 7); grain(g, 180, 600, 500, 975, 1, 7);
}
