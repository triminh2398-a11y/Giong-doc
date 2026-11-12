// Bean-style character cards for "Tượng nhà mồ" (spec v2). Design space 600x1000, soles at y=975.
// Ink: plum, thicker on the side away from the light (light from upper-left). Every body part is drawn
// "ink first, fill second" in one pass so limbs, hands and torso read as ONE silhouette (no seams at wrists).
export const INK = '#241726';
const rad = d => d * Math.PI / 180;
const U = 2.36;                         // 1 spec unit (head width / 100) in design px
const OW = 5 * U;                       // outline width
const hex = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; };
const mix = (a, b, t) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; };
export const dk = (h, k = .72) => { const [r, g, b] = hex(h); return `rgb(${r * k | 0},${g * k | 0},${b * k | 0})`; };
class Pen {
  constructor(g) { this.g = g; this.parts = []; }
  // queue a part: fn builds the path; fill = colour or [base, dark]; w = ink width
  part(fn, fill, w = OW, box) { this.parts.push({ fn, fill, w, box }); return this; }
  ell(cx, cy, rx, ry, rot = 0) { return () => { this.g.beginPath(); this.g.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2); }; }
  stroke(pts) { return () => { const g = this.g; g.beginPath(); g.moveTo(...pts[0]); for (let i = 1; i < pts.length - 1; i++) { const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]; g.quadraticCurveTo(...pts[i], ...m); } g.lineTo(...pts[pts.length - 1]); }; }
  poly(pts) { return () => { const g = this.g; g.beginPath(); g.moveTo(...pts[0]); for (const p of pts.slice(1)) g.lineTo(...p); g.closePath(); }; }
  // flush the queue: one ink pass (thicker toward lower-right), then fills on top
  flush() {
    const g = this.g, P = this.parts; this.parts = [];
    for (const q of P) { if (q.fill === null) continue; g.save(); q.fn(); g.lineJoin = g.lineCap = 'round'; g.strokeStyle = INK;
      if (q.fill && q.fill.line) { g.lineWidth = q.fill.line + q.w * 2; g.stroke(); g.translate(2.2, 2.6); q.fn(); g.stroke(); }
      else { g.lineWidth = q.w * 2; g.stroke(); g.translate(2.2, 2.6); q.fn(); g.stroke(); g.fillStyle = INK; g.fill(); }
      g.restore(); }
    for (const q of P) { if (q.fill === null) continue; g.save(); q.fn(); const f = q.fill;
      if (f && f.line) { g.strokeStyle = f.col; g.lineWidth = f.line; g.lineCap = g.lineJoin = 'round'; g.stroke(); }
      else { g.fillStyle = Array.isArray(f) ? this.grad(f, q.box) : f; g.fill(); }
      g.restore(); }
  }
  grad([a, b], box = [200, 200, 400, 600]) { const gr = this.g.createLinearGradient(box[0], box[1], box[2], box[3]); gr.addColorStop(0, a); gr.addColorStop(.5, a); gr.addColorStop(1, b); return gr; }
  // immediate helpers (detail strokes on top)
  line(pts, col, w) { const g = this.g; this.stroke(pts)(); g.strokeStyle = col; g.lineWidth = w; g.lineCap = g.lineJoin = 'round'; g.stroke(); }
  dot(x, y, r, col) { const g = this.g; g.beginPath(); g.arc(x, y, r, 0, 7); g.fillStyle = col; g.fill(); }
  fillInk(fn, col, w = 4) { const g = this.g; fn(); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = w; g.lineJoin = 'round'; g.stroke(); }
}
// superellipse head blob with slight egg + per-seed asymmetry
function headPath(cx, cy, rx, ry, seed = 1, n = 2.25) { return (g) => { g.beginPath(); for (let i = 0; i <= 72; i++) { const a = i / 72 * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
  const egg = 1 + .06 * s, asym = 1 + .018 * Math.sin(a * 2 + seed);
  const x = cx + rx * Math.sign(c) * Math.pow(Math.abs(c), 2 / n) * asym, y = cy + ry * Math.sign(s) * Math.pow(Math.abs(s), 2 / n) * egg; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.closePath(); }; }
function grain(g, x0, y0, x1, y1, amt = 1, seed = 1) {
  if (amt <= 0) return; g.save(); g.globalCompositeOperation = 'source-atop'; g.globalAlpha = .5 * Math.min(1, amt);
  g.strokeStyle = '#4e321c'; g.lineWidth = 3.2;
  for (let i = 0; i < 24; i++) { const x = x0 + (i + .5) / 24 * (x1 - x0); g.beginPath(); g.moveTo(x, y0); for (let y = y0; y <= y1; y += 26) g.lineTo(x + 7 * Math.sin(y * .028 + i * seed), y); g.stroke(); }
  g.globalAlpha = .35 * Math.min(1, amt); for (let i = 0; i < 6; i++) { const x = x0 + ((i * 97 + seed * 31) % (x1 - x0)), y = y0 + ((i * 151 + seed * 17) % (y1 - y0)); g.beginPath(); g.ellipse(x, y, 9, 15, .3, 0, 7); g.stroke(); }
  g.restore();
}
// soft shading over everything already drawn (light from upper-left), kept inside the silhouette
function shadeOver(g, k = .2) { g.save(); g.globalCompositeOperation = 'source-atop'; const gr = g.createLinearGradient(180, 120, 470, 900);
  gr.addColorStop(0, 'rgba(255,240,220,.10)'); gr.addColorStop(.5, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(20,10,30,${k})`); g.fillStyle = gr; g.fillRect(0, 0, 600, 1000); g.restore(); }
// ---------- face ----------
function face(p, cx, cy, o) {
  const { eye = 'dot', mth = 'dash', brow = 0, look = 0, blink = 0, open = 0, age = 0, sweat = 0 } = o; const g = p.g, E = 13 * U;
  // dark rings under the eyes (channel look)
  for (const s of [-1, 1]) { const gr = g.createRadialGradient(cx + s * E, cy + 8, 4, cx + s * E, cy + 8, 30); gr.addColorStop(0, 'rgba(70,40,70,.30)'); gr.addColorStop(1, 'rgba(70,40,70,0)'); g.fillStyle = gr; g.fillRect(cx + s * E - 32, cy - 24, 64, 64); }
  for (const s of [-1, 1]) {
    const x = cx + s * E, y = cy;
    if (blink > .5 || eye === 'closed') { p.line([[x - 15, y + 1], [x, y + 8], [x + 15, y + 1]], INK, 6.5); continue; }
    if (eye === 'shock') { p.fillInk(() => { g.beginPath(); g.ellipse(x, y, 19, 23, 0, 0, 7); }, '#ffffff', 5); p.dot(x + look * 5, y + 3, 5.5, INK); continue; }
    if (eye === 'squeeze') { const d = s; p.line([[x - 14 * d, y - 8], [x + 8 * d, y], [x - 14 * d, y + 8]], INK, 6.5); continue; }
    if (eye === 'lid' || age) { g.beginPath(); g.ellipse(x + look * 6, y + 2, 10, 12.5, 0, 0, 7); g.fillStyle = INK; g.fill(); p.dot(x + look * 6 - 3, y - 3, 3, '#fff');
      g.beginPath(); g.moveTo(x - 17, y - 2); g.quadraticCurveTo(x, y - 9, x + 17, y - 2); g.lineTo(x + 17, y - 18); g.lineTo(x - 17, y - 18); g.closePath(); g.fillStyle = o._skin; g.fill(); p.line([[x - 16, y - 2], [x, y - 7], [x + 16, y - 2]], INK, 5.5); continue; }
    g.beginPath(); g.ellipse(x + look * 6, y, 10, 13, 0, 0, 7); g.fillStyle = INK; g.fill(); p.dot(x + look * 6 - 3, y - 4, 3.2, '#ffffff');
  }
  // tapered brows; angle carries the mood
  for (const s of [-1, 1]) { const x0 = cx + s * (E - 16), x1 = cx + s * (E + 16), y0 = cy - 36 + brow * .5, y1 = cy - 38 - brow * .5;
    g.beginPath(); g.moveTo(x0, y0 - 3); g.lineTo(x1, y1 - 2); g.lineTo(x1, y1 + 2); g.lineTo(x0, y0 + 4); g.closePath(); g.fillStyle = age ? '#e9e4da' : INK; g.fill(); if (age) { g.strokeStyle = INK; g.lineWidth = 2; g.stroke(); } }
  const my = cy + 54;
  if (mth === 'smile') p.line([[cx - 17, my - 3], [cx, my + 7], [cx + 17, my - 3]], INK, 5.5);
  else if (mth === 'frown') p.line([[cx - 15, my + 6], [cx, my - 3], [cx + 15, my + 6]], INK, 5.5);
  else if (mth === 'wave') p.line([[cx - 17, my], [cx - 8, my - 5], [cx, my], [cx + 8, my - 5], [cx + 17, my]], INK, 5);
  else if (mth === 'O') p.fillInk(() => { g.beginPath(); g.ellipse(cx, my + 4, 11 + open * 2, 15 + open * 5, 0, 0, 7); }, '#5a1f2a', 5);
  else if (mth === 'teeth') { p.fillInk(() => { g.beginPath(); g.roundRect(cx - 22, my - 6, 44, 18, 6); }, '#ffffff', 5); for (const k of [-11, 0, 11]) p.line([[cx + k, my - 5], [cx + k, my + 11]], INK, 3); }
  else if (mth === 'talk') p.fillInk(() => { g.beginPath(); g.ellipse(cx, my + 2, 12, 3 + open * 10, 0, 0, 7); }, '#5a1f2a', 5);
  else p.line([[cx - 12, my], [cx + 12, my]], INK, 5.5);
  if (sweat) { g.beginPath(); g.moveTo(cx + 92, cy - 56); g.quadraticCurveTo(cx + 104, cy - 30, cx + 92, cy - 22); g.quadraticCurveTo(cx + 80, cy - 30, cx + 92, cy - 56); g.fillStyle = '#bfe3ff'; g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke(); }
  if (age) { const W_ = 'rgba(80,40,30,.55)'; for (const yy of [-64, -54]) p.line([[cx - 30, cy + yy], [cx, cy + yy - 4], [cx + 30, cy + yy]], W_, 3);
    for (const s of [-1, 1]) { p.line([[cx + s * (E - 10), cy + 26], [cx + s * E, cy + 30], [cx + s * (E + 10), cy + 26]], W_, 3); p.line([[cx + s * 16, cy + 30], [cx + s * 26, cy + 52]], W_, 3); p.line([[cx + s * (E + 20), cy - 4], [cx + s * (E + 30), cy - 8]], W_, 2.5); } }
}
// ---------- standing / sitting person ----------
// o: skin, hair:'short'|'cap'|'bun'|'bald'|'scarf', hairCol, shirt, shirtD, pants, vest, stripe, skirt, loin, coat, sleeve:'long'|'short'|'none',
//    arms:'hang'|'hands'|'cover'|'cheek'|'carry'|'point'|'pocket'|'reach'|'stick'|'wipe', wood 0..1, handWood 0..1, step, tilt, headTilt, beard, prop, sit, blanket
export function drawPerson(g, o) {
  const p = new Pen(g); g.clearRect(0, 0, 600, 1000);
  const { skin = '#ffe2c2', hair = 'short', hairCol = '#1e1a22', shirt = '#5b6f8e', pants = '#2f3242', vest = null, stripe = null, skirt = null, loin = null, coat = false, sleeve = 'long',
    arms = 'hang', wood = 0, handWood = 0, step = 0, tilt = 0, headTilt = 0, beard = 0, prop = null, sit = 0, bob = 0 } = o;
  const W = wood > .5, S = W ? '#b07a48' : skin, SD = dk(S, .8), SH = W ? '#a06c3e' : shirt, SHD = W ? '#7e5230' : (o.shirtD || dk(shirt, .74)), PA = W ? '#8e5c34' : pants;
  o._skin = S;
  g.save(); g.translate(300, 975); g.rotate(rad(tilt)); g.translate(-300, -975 + bob * 400);
  const lk = Math.sin(step * Math.PI * 2), lift = Math.max(0, Math.sin(step * Math.PI * 2 + Math.PI / 2));
  // ----- legs: thin curved strokes in a darker shade of the outfit; stance leg planted, swing leg lifts (knee bends, heel kicks back)
  const legW = 5.8 * U * 2.1, legC = skirt && !W ? S : (loin && !W ? S : dk(PA, .9));
  if (!sit) {
    for (const [x, ph] of [[268, 0], [332, Math.PI]]) { const s_ = Math.sin(step * Math.PI * 2 + ph), sw = Math.max(0, Math.cos(step * Math.PI * 2 + ph)) * (o.walk ? 1 : 0);
      const foot = [x + s_ * 30 * (o.walk ? 1 : 0), 948 - sw * 34], knee = [x + s_ * 14 * (o.walk ? 1 : 0) - sw * 16, 800 - sw * 10];
      p.part(p.stroke([[x, 640], knee, foot]), { line: legW, col: legC }, OW * .8);
      p.part(p.ell(foot[0] + 8, foot[1] + 8, 27, 15, sw * -.4), W ? '#7a4e2c' : (loin || skirt ? S : '#2e2224'), OW * .8); }
  } else { // seated on the bed/floor: thighs forward, hidden under blanket when present
    for (const x of [262, 338]) p.part(p.stroke([[x, 650], [x + 40, 720], [x + 70, 790]]), { line: legW, col: legC }, OW * .8);
  }
  // ----- skirt / loincloth / tunic skirt
  if (skirt && !W) p.part(p.poly([[226, 590], [374, 590], [392, 930], [208, 930]]), [skirt, dk(skirt, .7)], OW, [220, 600, 400, 930]);
  // ----- torso: egg blob + tunic skirt below
  const torso = () => { g.beginPath(); g.moveTo(300, 388); g.bezierCurveTo(392, 388, 410, 520, 404, 600); g.quadraticCurveTo(412, 650, 398, (coat ? 704 : 662)); g.quadraticCurveTo(300, (coat ? 720 : 680), 202, (coat ? 704 : 662)); g.quadraticCurveTo(188, 650, 196, 600); g.bezierCurveTo(190, 520, 208, 388, 300, 388); g.closePath(); };
  // ----- arms: thin strokes ending in round dot hands, drawn in the same ink pass as the torso so nothing looks detached
  const SHL = [[226, 440], [374, 440]];
  const A = { hang: [[204, 648], [396, 648]], hands: [[266, 392], [334, 392]], cover: [[264, 266], [336, 266]], cheek: [[218, 300], [382, 300]], carry: [[214, 330], [386, 330]],
    point: [[204, 648], [490, 420]], flash: [[204, 648], [430, 470]], hoe: [[250, 560], [360, 500]], pocket: [[204, 648], [338, 520]], reach: [[204, 648], [480, 520]], stick: [[204, 648], [420, 640]], wipe: [[204, 648], [340, 330]], hip: [[180, 600], [420, 600]] }[arms] || [[204, 648], [396, 648]];
  const armC = sleeve === 'long' ? SH : S, armCD = sleeve === 'long' ? SHD : SD, handC = (handWood > .5 || W) ? '#b07a48' : S;
  const front = ['hands', 'cover', 'cheek', 'wipe'].includes(arms);
  const queueArms = () => { for (let i = 0; i < 2; i++) { const a = SHL[i], h = A[i], m = [(a[0] + h[0]) / 2 + (i ? 26 : -26), (a[1] + h[1]) / 2 + 8];
    p.part(p.stroke([a, m, h]), { line: 5.2 * U * 2.2, col: i ? armC : armCD }, OW * .8);
    p.part(p.ell(h[0], h[1], 17, 17), handC, OW * .8); } };
  if (!front) queueArms();
  p.part(torso, [SH, SHD], OW, [200, 380, 420, 700]);
  p.flush();
  // torso details
  if (!W) {
    if (sleeve === 'short') for (const [x, s] of [[226, -1], [374, 1]]) p.fillInk(() => { g.beginPath(); g.ellipse(x + s * 6, 470, 30, 40, s * .3, 0, 7); }, s < 0 ? SHD : SH, 5);
    if (coat) { p.line([[300, 400], [300, 704]], dk(SH, .55), 4); for (let k = 0; k < 4; k++) p.dot(312, 450 + k * 56, 6, dk(SH, .45));
      for (const s of [-1, 1]) { p.fillInk(() => { g.beginPath(); g.roundRect(300 + s * 58 - 24, 590, 48, 40, 7); }, dk(SH, .9), 4); p.line([[300 + s * 58 - 24, 604], [300 + s * 58 + 24, 604]], INK, 3); }
      for (const s of [-1, 1]) p.fillInk(p.poly([[300 + s * 6, 396], [300 + s * 56, 400], [300 + s * 18, 448]]), s < 0 ? dk(SH, 1.12) : SHD, 4.5); }
    else if (!vest) { p.line([[262, 404], [300, 436], [338, 404]], INK, 5); if (o.pocket) { p.fillInk(() => { g.beginPath(); g.roundRect(326, 470, 40, 36, 6); }, SHD, 4); } }
    if (vest) { for (const s of [-1, 1]) { p.fillInk(p.poly([[300 + s * 10, 396], [300 + s * 82, 416], [300 + s * 96, 660], [300 + s * 16, 668]]), s < 0 ? vest : dk(vest, .8), 5); }
      if (stripe) for (const s of [-1, 1]) { p.line([[300 + s * 20, 620], [300 + s * 94, 616]], stripe, 10); p.line([[300 + s * 20, 640], [300 + s * 95, 636]], '#efe6d2', 5); } }
    else if (stripe) { p.line([[200, 610], [400, 610]], stripe, 12); p.line([[200, 632], [400, 632]], '#efe6d2', 5); }
    if (!coat && !vest) p.line([[204, 640], [396, 640]], dk(PA, .7), 9); // belt line
  }
  if (loin && !W) { p.fillInk(p.poly([[250, 650], [350, 650], [340, 780], [312, 790], [288, 790], [260, 780]]), loin, 5); if (stripe) { p.line([[266, 700], [334, 700]], stripe, 8); p.line([[268, 716], [332, 716]], '#efe6d2', 4); } }
  // ----- props in hands
  if (prop === 'stick') { const h = A[1]; p.line([[h[0] + 4, h[1] - 30], [h[0] + 18, 970]], INK, 16); p.line([[h[0] + 4, h[1] - 30], [h[0] + 18, 970]], '#7a5236', 8); p.dot(h[0], h[1], 17, handC); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); }
  if (prop === 'flash') { const h = A[1]; g.save(); g.translate(h[0], h[1]); g.rotate(-.5); p.fillInk(() => { g.beginPath(); g.roundRect(-12, -56, 24, 64, 6); }, '#3a3a44', 4.5); p.fillInk(() => { g.beginPath(); g.roundRect(-15, -62, 30, 12, 4); }, '#ffe9a8', 4); g.restore(); p.dot(h[0], h[1], 17, handC); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); }
  if (prop === 'hoe') { p.line([[224, 640], [410, 300]], INK, 18); p.line([[224, 640], [410, 300]], '#8a6040', 10); p.fillInk(p.poly([[400, 286], [446, 300], [430, 336], [404, 318]]), '#70757e', 4.5); for (const h of A) { p.dot(h[0], h[1], 17, handC); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); } }
  if (prop === 'bird') { const h = A[1]; p.fillInk(() => { g.beginPath(); g.ellipse(h[0] - 4, h[1] - 22, 24, 15, -.2, 0, 7); }, '#a87a4c', 5); p.dot(h[0] + 16, h[1] - 32, 9, '#a87a4c'); }
  // ----- head (tilts separately about the neck)
  g.save(); g.translate(300, 400); g.rotate(rad(headTilt)); g.translate(-300, -400);
  const HC = W ? '#7a4e2c' : (hair === 'bald' ? '#ece7dc' : hairCol), HX = 300, HY = 262, RX = 118, RY = 116;
  if (hair === 'bun') p.part(p.ell(300, 128, 40, 36), HC, OW * .9);
  p.part(() => headPath(HX, HY, RX, RY, o.seed || 1)(g), [S, SD], OW, [190, 160, 420, 400]);
  p.flush();
  // hair shapes
  if (hair === 'short') { p.fillInk(() => { g.beginPath(); g.moveTo(186, 228); g.bezierCurveTo(176, 118, 424, 118, 414, 228); g.lineTo(404, 214); g.lineTo(396, 190);
    const fr = [[374, 200], [360, 176], [340, 196], [318, 170], [296, 194], [272, 172], [252, 196], [230, 180], [214, 200], [200, 214]]; for (const q of fr) g.lineTo(...q); g.closePath(); }, HC, 6);
    for (const s of [-1, 1]) p.fillInk(() => { g.beginPath(); g.moveTo(300 + s * 114, 214); g.quadraticCurveTo(300 + s * 120, 236, 300 + s * 112, 262); g.lineTo(300 + s * 104, 236); g.closePath(); }, HC, 4); // sideburns
    p.line([[258, 140], [242, 174]], 'rgba(255,255,255,.14)', 5); }
  if (hair === 'bun') p.fillInk(() => { g.beginPath(); g.moveTo(186, 250); g.bezierCurveTo(176, 126, 424, 126, 414, 250); g.quadraticCurveTo(400, 186, 300, 176); g.quadraticCurveTo(200, 186, 186, 250); g.closePath(); }, HC, 6);
  if (hair === 'cap') { const CC = W ? '#8e5c34' : (o.capCol || '#b23a32'); p.fillInk(() => { g.beginPath(); g.moveTo(186, 236); g.bezierCurveTo(186, 112, 414, 112, 414, 236); g.closePath(); }, CC, 6);
    p.fillInk(() => { g.beginPath(); g.moveTo(360, 228); g.quadraticCurveTo(456, 224, 480, 246); g.quadraticCurveTo(440, 258, 380, 250); g.closePath(); }, dk(CC, .78), 5); p.dot(300, 124, 7, dk(CC, .6)); }
  if (hair === 'bald') { for (const s of [-1, 1]) p.fillInk(() => { g.beginPath(); g.moveTo(300 + s * 70, 168); g.bezierCurveTo(300 + s * 122, 176, 300 + s * 130, 236, 300 + s * 118, 300); g.lineTo(300 + s * 104, 290); g.lineTo(300 + s * 108, 250); g.lineTo(300 + s * 96, 214); g.quadraticCurveTo(300 + s * 92, 186, 300 + s * 60, 176); g.closePath(); }, HC, 5);
    g.beginPath(); g.ellipse(262, 176, 30, 13, -.35, 0, 7); g.fillStyle = 'rgba(255,255,255,.22)'; g.fill(); }
  if (hair === 'scarf') { p.fillInk(() => { g.beginPath(); g.moveTo(182, 300); g.bezierCurveTo(170, 110, 430, 110, 418, 300); g.quadraticCurveTo(300, 270, 182, 300); g.closePath(); }, W ? '#8e5c34' : '#2a2430', 6); if (stripe) p.line([[190, 282], [410, 282]], stripe, 8); }
  if (W) grain(g, 176, 130, 424, 400, 1, 2);
  if (hair !== 'shroud') face(p, 300, 272, { ...o, age: o.age || 0 });
  if (o.carve > 0) { g.save(); g.globalAlpha = Math.min(1, o.carve); for (const [a, b] of [[[226, 214], [256, 320]], [[374, 214], [346, 320]], [[270, 352], [330, 352]], [[236, 200], [364, 200]], [[282, 296], [252, 346]], [[318, 296], [348, 346]]]) p.line([a, b], '#6a4024', 5.5); g.restore(); }
  if (hair === 'shroud') p.fillInk(() => { g.beginPath(); g.moveTo(176, 420); g.bezierCurveTo(150, 90, 450, 90, 424, 420); g.quadraticCurveTo(300, 446, 176, 420); g.closePath(); }, '#2a2630', 6);
  if (beard && !W) p.fillInk(() => { g.beginPath(); g.moveTo(268, 318); g.quadraticCurveTo(276, 400, 300, 430); g.quadraticCurveTo(324, 400, 332, 318); g.quadraticCurveTo(300, 336, 268, 318); g.closePath(); }, '#efeae0', 4.5);
  g.restore();
  if (front) { queueArms(); p.flush(); }
  if (o.blanket) { const BC = o.blanket; p.part(() => { g.beginPath(); g.moveTo(110, 1000); g.lineTo(110, 700); g.bezierCurveTo(160, 640, 250, 660, 300, 676); g.bezierCurveTo(370, 650, 450, 640, 490, 700); g.lineTo(490, 1000); g.closePath(); }, [BC, dk(BC, .78)], OW, [110, 640, 490, 1000]); p.flush();
    for (const [a, b] of [[[170, 720], [210, 990]], [[300, 700], [310, 990]], [[420, 712], [400, 990]]]) p.line([a, [(a[0] + b[0]) / 2 + 10, (a[1] + b[1]) / 2], b], dk(BC, .7), 4); }
  if (handWood > 0 && !W) { g.save(); g.globalAlpha = Math.min(1, handWood); for (const h of A) { g.save(); g.beginPath(); g.arc(h[0], h[1], 17, 0, 7); g.clip(); g.fillStyle = 'rgba(176,122,72,.85)'; g.fillRect(h[0] - 20, h[1] - 20, 40, 40); g.strokeStyle = '#5a3a22'; g.lineWidth = 2.2; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(h[0] - 18, h[1] + k * 7); g.quadraticCurveTo(h[0], h[1] + k * 7 + 4, h[0] + 18, h[1] + k * 7); g.stroke(); } g.restore(); } g.restore(); }
  if (W) grain(g, 176, 380, 424, 975, 1, 3);
  shadeOver(g, .18);
  g.restore();
}
// ---------- crouching mourner (wood statue, or a live person in the same pose) ----------
export function drawCrouch(g, o) {
  if ((o.kind || 'statue') === 'statue') return drawStatue(g, o);
  const p = new Pen(g); g.clearRect(0, 0, 600, 1000);
  const { kind = 'statue', skin = '#ffe2c2', shirt = '#7a8a6a', pants = '#3b3f52', hairCol = '#1e1a22', wood = kind === 'statue' ? 1 : 0, peek = 0, cut = 0, shake = 0 } = o;
  const Wd = wood > .5, C = Wd ? '#a8743f' : shirt, P = Wd ? '#94643a' : pants, S = Wd ? '#b5804a' : skin, H = Wd ? '#8a5a32' : hairCol;
  g.save(); g.translate(shake * Math.sin((o.t || 0) * 40), 0);
  if (kind === 'statue') p.part(p.poly([[226, 975], [374, 975], [362, 898], [238, 898]]), cut ? '#c89a62' : '#6e4628', OW);
  for (const s of [-1, 1]) { p.part(p.ell(300 + s * 62, 904, 40, 19), Wd ? '#8e5c34' : '#2e2224', OW * .8); p.part(p.stroke([[300 + s * 62, 896], [300 + s * 72, 724]]), { line: 46, col: P }, OW * .8); }
  p.part(() => { g.beginPath(); g.moveTo(226, 604); g.quadraticCurveTo(300, 560, 374, 604); g.lineTo(388, 862); g.quadraticCurveTo(300, 884, 212, 862); g.closePath(); }, [C, dk(C, .72)], OW, [220, 600, 390, 880]);
  p.part(() => { g.beginPath(); g.roundRect(204, 714, 192, 80, 40); }, [P, dk(P, .75)], OW, [204, 714, 396, 794]);
  const hy = 520 - peek * 10;
  p.part(() => headPath(300, hy, 106, 108, 3)(g), [S, dk(S, .78)], OW, [200, 420, 400, 620]);
  p.flush();
  if (Wd) { g.save(); headPath(300, hy, 106, 108, 3)(g); g.clip(); g.beginPath(); g.ellipse(300, hy - 76, 124, 62, 0, 0, 7); g.fillStyle = H; g.fill(); g.restore(); }
  else p.fillInk(() => { g.beginPath(); g.moveTo(196, hy - 8); g.bezierCurveTo(186, hy - 134, 414, hy - 134, 404, hy - 8); g.quadraticCurveTo(300, hy - 70, 196, hy - 8); g.closePath(); }, H, 6);
  const sl = peek * 40;
  for (const s of [-1, 1]) p.part(p.stroke([[300 + s * 80, 618], [300 + s * 98, 690], [300 + s * (42 + sl), hy + 40]]), { line: 30, col: C }, OW * .8);
  for (const s of [-1, 1]) p.part(p.ell(300 + s * (34 + sl), hy + 20 + peek * 30, 44, 60), S, OW * .8);
  p.flush();
  for (const s of [-1, 1]) for (let k = -1; k <= 1; k++) p.line([[300 + s * (34 + sl) + k * 15, hy - 28 + peek * 30], [300 + s * (34 + sl) + k * 15, hy - 4 + peek * 30]], 'rgba(36,23,38,.55)', 3.5);
  if (o.stare && peek > .25) { const a = Math.min(1, (peek - .25) / .35); g.save(); g.globalAlpha = a; for (const s of [-1, 1]) { const ex = 300 + s * 30, ey = hy + 6;
      g.beginPath(); g.ellipse(ex, ey, 17, 21, 0, 0, 7); g.fillStyle = '#030204'; g.fill();
      const gl = g.createRadialGradient(ex, ey, 0, ex, ey, 12); gl.addColorStop(0, 'rgba(235,245,240,1)'); gl.addColorStop(1, 'rgba(235,245,240,0)'); g.fillStyle = gl; g.beginPath(); g.arc(ex + (o.look || 0) * 3, ey + 3, 4.2, 0, 7); g.fill(); } g.restore(); } // hollow wooden eyes with a pale stare
  if (peek > .3 && !Wd) { g.save(); g.globalAlpha = (peek - .3) / .7; for (const s of [-1, 1]) { p.fillInk(() => { g.beginPath(); g.ellipse(300 + s * 30, hy + 10, 12, 16, 0, 0, 7); }, '#fff', 4); p.dot(300 + s * 30, hy + 12, 5, INK); } g.restore(); }
  if (Wd) { grain(g, 186, 400, 414, 975, 1, 5); for (const s of [-1, 1]) p.line([[300 + s * 20, hy + 72], [300 + s * 52, hy + 92]], '#5e3c20', 5); }
  shadeOver(g, .22);
  g.restore();
}
export function drawBird(g) { const p = new Pen(g); g.clearRect(0, 0, 600, 1000); p.part(p.ell(300, 900, 90, 50, -.15), ['#b07a48', '#7a5030'], OW); p.part(p.ell(380, 840, 40, 36), '#b07a48', OW); p.flush(); p.fillInk(p.poly([[414, 836], [450, 846], [414, 852]]), '#8a5a32', 4); p.dot(388, 832, 6, INK); grain(g, 200, 800, 430, 960, .8, 4); }
export function drawDead(g, o) {
  const p = new Pen(g); g.clearRect(0, 0, 600, 1000);
  const { reach = 0, scream = 0, headTilt = 0 } = o; const SK = '#dfe3e0', SKD = '#b6bdb9', RB = '#d2d6d1', RBD = '#a2a8a3', HR = '#141218';
  // robe body crouched, knees up, ragged hem
  p.part(() => { g.beginPath(); g.moveTo(214, 600); g.quadraticCurveTo(300, 560, 386, 600); g.lineTo(406, 900); for (let k = 0; k <= 8; k++) g.lineTo(406 - k * 24, 900 + (k % 2 ? 26 : 6)); g.lineTo(194, 900); g.closePath(); }, [RB, RBD], OW, [200, 580, 410, 930]);
  p.part(() => { g.beginPath(); g.roundRect(206, 714, 188, 82, 40); }, [RB, RBD], OW, [206, 714, 394, 796]);
  // hair mass behind the head
  const hx = 300, hy = 470;
  p.part(() => { g.beginPath(); g.moveTo(hx - 118, hy + 40); g.bezierCurveTo(hx - 140, hy - 150, hx + 140, hy - 150, hx + 118, hy + 40); for (const [x, y] of [[120, 160], [100, 130], [86, 190], [66, 140], [-60, 150], [-80, 196], [-96, 130], [-118, 170]]) g.lineTo(hx + x, hy + y); g.closePath(); }, HR, OW);
  // reaching arm (toward the person beside it, screen-right)
  const rx = 300 + 110 + reach * 150, ry = 640 - reach * 60;
  p.part(p.stroke([[370, 620], [(370 + rx) / 2 + 10, (620 + ry) / 2 + 20], [rx, ry]]), { line: 26, col: RB }, OW * .8);
  p.part(p.ell(rx + 6, ry, 15, 13), SKD, OW * .7);
  p.flush();
  for (let k = 0; k < 4; k++) p.line([[rx + 14, ry - 10 + k * 7], [rx + 38, ry - 12 + k * 8]], INK, 7), p.line([[rx + 14, ry - 10 + k * 7], [rx + 38, ry - 12 + k * 8]], SKD, 3.5);
  g.save(); g.translate(hx, hy + 60); g.rotate(rad(headTilt)); g.translate(-hx, -hy - 60);
  p.part(() => headPath(hx, hy, 100, 106, 9)(g), SK, OW); p.flush();
  for (const s of [-1, 1]) { const gr = g.createRadialGradient(hx + s * 30, hy, 4, hx + s * 30, hy, 34); gr.addColorStop(0, 'rgba(20,18,26,.85)'); gr.addColorStop(1, 'rgba(20,18,26,0)'); g.fillStyle = gr; g.fillRect(hx + s * 30 - 36, hy - 36, 72, 72);
    p.fillInk(() => { g.beginPath(); g.ellipse(hx + s * 30, hy - 2, 16, 19, 0, 0, 7); }, '#c9cfcc', 4); p.dot(hx + s * 30, hy, 3, 'rgba(40,44,50,.4)'); } // empty eyes
  p.fillInk(() => { g.beginPath(); g.ellipse(hx, hy + 56 + scream * 10, 9 + scream * 6, 4 + scream * 22, 0, 0, 7); }, '#0a0809', 4);
  // lank strands over the crown and down the cheeks (face stays clear)
  p.fillInk(() => { g.beginPath(); g.moveTo(hx - 104, hy + 20); g.bezierCurveTo(hx - 124, hy - 130, hx + 124, hy - 130, hx + 104, hy + 20); g.lineTo(hx + 84, hy - 20); g.lineTo(hx + 70, hy + 10); g.quadraticCurveTo(hx + 54, hy - 64, hx + 4, hy - 76); g.lineTo(hx, hy - 54); g.lineTo(hx - 6, hy - 76); g.quadraticCurveTo(hx - 54, hy - 64, hx - 70, hy + 10); g.lineTo(hx - 84, hy - 20); g.closePath(); }, HR, 5);
  for (const s of [-1, 1]) p.line([[hx + s * 80, hy - 10], [hx + s * 92, hy + 60], [hx + s * 80, hy + 130]], HR, 9);
  g.restore();
  shadeOver(g, .2);
}
// ---------- weathered Jrai grave statue: hewn with an adze, faceted planes, cracks and lichen (not a soft toy) ----------
export function drawStatue(g, o) {
  g.clearRect(0, 0, 600, 1000);
  const { peek = 0, cut = 0, shake = 0, stare = 0 } = o; let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const B = '#665040', L = '#866a52', D = '#3f3128', K = '#160f12';
  const poly = (pts, fill, w = 4) => { g.beginPath(); g.moveTo(...pts[0]); for (const p of pts.slice(1)) g.lineTo(...p); g.closePath(); g.fillStyle = fill; g.fill(); if (w) { g.strokeStyle = K; g.lineWidth = w; g.lineJoin = 'miter'; g.stroke(); } };
  g.save(); g.translate(shake * Math.sin((o.t || 0) * 40), 0);
  poly([[222, 975], [378, 975], [370, 906], [230, 900]], cut ? '#b08a5c' : D, 5);                       // stump plinth
  for (const sx of [-1, 1]) { poly([[300 + sx * 30, 906], [300 + sx * 92, 906], [300 + sx * 96, 876], [300 + sx * 34, 872]], D);   // feet
    poly([[300 + sx * 36, 880], [300 + sx * 88, 880], [300 + sx * 82, 730], [300 + sx * 40, 724]], sx < 0 ? D : B); }          // shins
  poly([[228, 880], [372, 880], [364, 600], [300, 572], [236, 600]], B, 5);                              // hunched torso
  poly([[300, 572], [364, 600], [372, 880], [318, 880]], D, 0);                                            // shaded side plane
  for (const sx of [-1, 1]) poly([[300 + sx * 18, 752], [300 + sx * 100, 744], [300 + sx * 104, 806], [300 + sx * 20, 812]], sx < 0 ? L : B); // knees
  // long angular head, jaw resting on the hands
  const hy = 470; poly([[236, hy - 104], [364, hy - 110], [376, hy - 40], [356, hy + 96], [300, hy + 118], [244, hy + 96], [224, hy - 40]], B, 5);
  poly([[300, hy - 108], [364, hy - 110], [376, hy - 40], [356, hy + 96], [300, hy + 118]], D, 0);
  poly([[230, hy - 52], [370, hy - 56], [366, hy - 38], [234, hy - 34]], L, 3);                           // heavy brow ledge
  // carved face (visible only between the parting hands)
  const gap = peek * 46;
  if (peek > .05) { g.save(); g.beginPath(); g.rect(300 - gap - 6, hy - 40, (gap + 6) * 2, 170); g.clip();
    for (const sx of [-1, 1]) { g.beginPath(); g.ellipse(300 + sx * 30, hy - 4, 18, 13, sx * .15, 0, 7); g.fillStyle = '#050304'; g.fill(); }
    if (stare) for (const sx of [-1, 1]) { const gl = g.createRadialGradient(300 + sx * 30, hy - 3, 0, 300 + sx * 30, hy - 3, 7); gl.addColorStop(0, 'rgba(230,240,235,1)'); gl.addColorStop(1, 'rgba(230,240,235,0)'); g.fillStyle = gl; g.beginPath(); g.arc(300 + sx * 30, hy - 3, 5, 0, 7); g.fill(); }
    poly([[294, hy + 2], [306, hy + 2], [310, hy + 52], [290, hy + 52]], L, 3);                          // nose ridge
    g.strokeStyle = K; g.lineWidth = 5; g.beginPath(); g.moveTo(268, hy + 86); g.lineTo(300, hy + 78); g.lineTo(332, hy + 86); g.stroke(); g.restore(); }
  // forearms rise from the knees, flat hands spread over the face; fingers are carved grooves
  for (const sx of [-1, 1]) { const hx = 300 + sx * (40 + gap);
    poly([[300 + sx * 70, 760], [300 + sx * 112, 752], [hx + sx * 40, hy + 60], [hx - sx * 6, hy + 70]], sx < 0 ? L : B);
    poly([[hx - 36, hy - 70], [hx + 36, hy - 74], [hx + 40, hy + 72], [hx - 34, hy + 78]], sx < 0 ? L : B);
    g.strokeStyle = 'rgba(22,15,18,.7)'; g.lineWidth = 3.5; for (const k of [-18, 0, 18]) { g.beginPath(); g.moveTo(hx + k, hy - 66); g.lineTo(hx + k + 2, hy - 18); g.stroke(); } }
  // adze marks, cracks, lichen
  g.save(); g.globalCompositeOperation = 'source-atop';
  g.strokeStyle = 'rgba(30,20,16,.35)'; g.lineWidth = 2.4; for (let i = 0; i < 70; i++) { const x = 215 + r() * 170, y = 360 + r() * 540; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 10 + r() * 8, y + 4 + r() * 6); g.stroke(); }
  g.strokeStyle = 'rgba(14,9,10,.75)'; g.lineWidth = 2; for (let i = 0; i < 6; i++) { let x = 240 + r() * 120, y = 380 + r() * 400; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (r() - .5) * 8; y += 14 + r() * 10; g.lineTo(x, y); } g.stroke(); }
  for (let i = 0; i < 14; i++) { g.fillStyle = `rgba(${120 + r() * 30 | 0},${130 + r() * 30 | 0},${100 + r() * 20 | 0},.25)`; g.beginPath(); g.ellipse(220 + r() * 160, 380 + r() * 520, 4 + r() * 9, 3 + r() * 6, r() * 3, 0, 7); g.fill(); }
  const gr = g.createLinearGradient(0, 360, 0, 975); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.35)'); g.fillStyle = gr; g.fillRect(0, 0, 600, 1000);
  g.restore();
  if (o.cap) { poly([[230, 372], [370, 366], [376, 330], [300, 300], [226, 334]], '#8e3a2e', 4); poly([[350, 360], [430, 368], [424, 382], [352, 378]], '#6e2c22', 3); }
  if (o.patch) { g.save(); g.globalAlpha = .85; for (const [x, y, rr] of [[262, 650], [342, 760], [246, 820], [356, 640]].map((q, i) => [...q, 24 - i * 3])) { g.beginPath(); g.ellipse(x, y, rr, rr * .8, 0, 0, 7); g.fillStyle = o.patch; g.fill(); } g.restore(); }
  g.restore();
}
