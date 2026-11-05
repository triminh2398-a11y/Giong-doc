// Cast for Quỷ nhập tràng (toon): Khoa (lanky, worried), Bà (the corpse), the black cat, the big corpse hand.
// Origin = hip for people (y down), face = 1 faces right. Palettes come from the current lighting set (C).
import { clamp, lerp, hash, TAU } from './core/lib.js';
import { INK, push, pop, translate, rotate, scale, shape, fillOnly, stroke, ell, arc, spline, rr, rect, noodle, quad, dot } from './toon.js';

export const SETS = {
  lamp: { skinK: '#e3a874', skinKs: '#b97a4e', hair: '#2a1f2e', shirtK: '#3f5a9a', shirtKs: '#2c3f70', pants: '#2b2530', pantsS: '#1a161e', red: '#e0322c',
    skinB: '#b9c4a6', skinBs: '#8a977c', socket: '#4e4250', hairB: '#a9a3a8', hairBs: '#7c7680', shirtB: '#7a4a2e', shirtBs: '#55311d', sheet: '#efe6d2', sheetS: '#c9bda2',
    cat: '#211b2c', catS: '#120e18', white: '#fbf6ea', mouthIn: '#3a1020', tongue: '#c9506a' },
  flash: { skinK: '#c9d6f0', skinKs: '#7f90c4', hair: '#141a3a', shirtK: '#8aa4e8', shirtKs: '#4a64b0', pants: '#202850', pantsS: '#121838', red: '#ff6a8a',
    skinB: '#e6f0ff', skinBs: '#9aaad8', socket: '#3a3a78', hairB: '#f0f4ff', hairBs: '#a8b4e0', shirtB: '#6a6aa8', shirtBs: '#424a88', sheet: '#ffffff', sheetS: '#a8b8e8',
    cat: '#0c0e24', catS: '#06081a', white: '#ffffff', mouthIn: '#141838', tongue: '#7a7ac8' },
  dim: { skinK: '#5a5878', skinKs: '#3e3c5a', hair: '#141020', shirtK: '#2a3058', shirtKs: '#1c2040', pants: '#16121e', pantsS: '#0e0c14', red: '#6a2a3a',
    skinB: '#4e5a5e', skinBs: '#363e46', socket: '#1e1a2a', hairB: '#4a4858', hairBs: '#34323e', shirtB: '#2e2230', shirtBs: '#1e1620', sheet: '#5a5a70', sheetS: '#3e3e54',
    cat: '#0a0810', catS: '#050408', white: '#9a98b0', mouthIn: '#0e0a14', tongue: '#3a2a3a' },
};
export let C = SETS.lamp;
export const useSet = k => { C = SETS[k]; };

// —— face parts ——
function eye(cx, cy, rx, ry, { lid = 0, look = [0, 0], pupil = 4.5, skin, closed = false, lw = 6, jitter = 0, dead = false, cat = 0 } = {}) {
  if (closed) { stroke(arc(cx, cy + ry * .15, rx * .8, ry * .45, Math.PI * .1, Math.PI * .9, 14), lw); return; }
  shape(ell(cx, cy, rx, ry, 36), {
    fill: cat ? '#ffcc22' : dead ? '#dfe4d6' : C.white, lw, shade: () => {
      const px = cx + look[0] * rx * .55 + jitter, py = cy + look[1] * ry * .5;
      if (cat) { fillOnly(ell(px, py, Math.max(2, rx * .14), ry * .82 * cat, 16), INK, { boil: .2 }); fillOnly(ell(px - rx * .3, py - ry * .35, rx * .12, ry * .1, 8), '#fff8d0', { boil: 0 }); }
      else if (dead) { fillOnly(ell(px, py, rx * .5, ry * .5, 20), 'rgba(120,130,120,.35)', { boil: .2 }); dot(px, py, 2.2); }
      else dot(px, py, pupil);
      if (lid > 0) { const yl = cy - ry + lid * 2 * ry; fillOnly([[cx - rx * 1.3, cy - ry * 1.4], [cx + rx * 1.3, cy - ry * 1.4], [cx + rx * 1.3, yl], [cx - rx * 1.3, yl + ry * .08]], skin, { boil: .5 }); stroke([[cx - rx * 1.2, yl + ry * .08], [cx + rx * 1.2, yl]], lw); }
    }
  });
}
function mouth(cx, cy, mw, { o = 0, w = 1, sm = 0, lw = 6, teeth = true, few = false } = {}) {
  const hw = mw * w / 2, k = mw * .22, lc = [cx - hw, cy - sm * k], rc = [cx + hw, cy - sm * k];
  if (o < .07) { stroke(quad(lc, [cx, cy + sm * k * 1.2], rc, 12), lw); return; }
  const h = o * mw * .62;
  const P = [...quad(lc, [cx, cy - h * .25], rc, 12), ...quad(rc, [cx, cy + h + sm * k * .6], lc, 14)];
  shape(P, { fill: C.mouthIn, lw, shade: () => {
    if (few) { for (const dx of [-hw * .45, hw * .2]) fillOnly(rect(cx + dx, cy - h * .3, hw * .22, h * .38), '#d8d2b8', { boil: .3 }); }
    else if (teeth && o > .22) fillOnly(rect(cx - hw * 1.2, cy - h, hw * 2.4, h * .32 + 6), C.white, { boil: .3 });
    fillOnly(ell(cx + hw * .15, cy + h * .95, hw * .6, h * .45, 20), C.tongue, { boil: .3 });
  } });
}
export function hand(x, y, ang, r = 18, col, { fist = false, claw = false, lw = 6 } = {}) {
  push(); translate(x, y); rotate(ang);
  if (claw) {
    shape(spline([[-r * .6, -r * .8], [r * .6, -r * .9], [r * .9, r * .2], [-r * .7, r * .7]]), { fill: col, lw });
    for (let k = 0; k < 4; k++) { const a = -.6 + k * .4; shape(noodle([r * .7, -r * .5 + k * r * .45], [r * 1.9 + Math.cos(a) * r * .3, -r * .9 + k * r * .65], 4, r * .42, r * .22), { fill: col, lw: lw * .8 }); }
  } else {
    const pts = fist ? spline([[-r * .6, -r * .8], [r * .7, -r * .9], [r * 1.1, -r * .1], [r * .8, r * .8], [-r * .5, r * .9], [-r * .9, 0]])
      : spline([[-r * .5, -r * .85], [r * .5, -r * 1.05], [r * 1.35, -r * .75], [r * 1.05, -r * .3], [r * 1.5, -r * .1], [r * 1.1, r * .3], [r * 1.35, r * .7], [r * .6, r * .95], [-r * .6, r * .8], [-r * .95, 0]]);
    shape(pts, { fill: col, lw });
  }
  pop();
}
const sweat = (x, y, s = 1) => shape(spline([[x, y - 16 * s], [x + 9 * s, y + 4 * s], [x, y + 12 * s], [x - 9 * s, y + 4 * s]]), { fill: '#bfe9ff', lw: 5 });
function arm(sh, a, fill, shade, skin, opt = {}) {
  const hp = [sh[0] + a.h[0], sh[1] + a.h[1]];
  shape(noodle(sh, hp, a.bend ?? 0, opt.w0 || 40, opt.w1 || 30), { fill, lw: 7, shade: () => fillOnly(noodle([sh[0] + 6, sh[1] + 6], [hp[0] + 6, hp[1] + 6], a.bend ?? 0, 18, 12), shade, { boil: .3 }) });
  hand(hp[0], hp[1], Math.atan2(hp[1] - sh[1], hp[0] - sh[0]), opt.r || 18, skin, { fist: a.fist, claw: opt.claw });
  return hp;
}

// —— Khoa ——
// P: {x,y(hip),s,face,seat,lean,headTilt,lid,look,brow,mouth:{o,w,sm},blink,armF,armB,step,nerv,t,sweat,pupil,eyeS}
export function khoa(P) {
  if (P.pal) { const keep = { ...C }; Object.assign(C, P.pal); const q = { ...P }; delete q.pal; khoa(q); Object.assign(C, keep); return; }
  const f = P.face ?? 1, ner = P.nerv ?? 0, jit = ner ? (hash(Math.floor((P.t || 0) * 12) * 3.3) - .5) * 8 * ner : 0;
  push(); translate(P.x + jit, P.y); scale((P.s ?? 1) * f, P.s ?? 1);
  // legs
  const st = P.step || 0;
  const legs = P.seat ? [[[-14, 0], [120, 6], [126, 200]], [[14, 0], [146, 0], [156, 204]]] : [[[-16, 0], [-10 - 30 * st, 120], [-6 - 46 * st, 236]], [[16, 0], [20 + 30 * st, 120], [26 + 46 * st, 236]]];
  for (const [h, k, a] of legs) {
    shape(noodle(h, k, 0, 46, 40), { fill: C.pants, lw: 7 }); shape(noodle(k, a, 0, 40, 34), { fill: C.pants, lw: 7, shade: () => fillOnly(rect(-300, a[1] - 40, 600, 20), C.pantsS, { boil: .3 }) });
    shape(spline([[a[0] - 22, a[1] + 14], [a[0] - 14, a[1] - 8], [a[0] + 20, a[1] - 4], [a[0] + 46, a[1] + 10], [a[0] + 40, a[1] + 20]]), { fill: C.skinK, lw: 6 });
  }
  push(); rotate(P.lean ?? 0);
  const shB = [-44, -186], shF = [40, -184];
  arm(shB, P.armB || { h: [-6, 150], bend: -14 }, C.shirtKs, C.pantsS, C.skinKs);
  // áo bà ba
  shape(spline([[-30, -214], [-62, -196], [-70, -110], [-74, 24], [0, 30], [72, 22], [70, -110], [60, -196], [30, -214]]), { fill: C.shirtK, lw: 7, shade: () => {
    fillOnly(spline([[30, -230], [90, -200], [90, 40], [40, 40], [50, -100]]), C.shirtKs, { boil: .4 });
    for (let k = 0; k < 4; k++) dot(14, -170 + k * 44, 5, C.white);
  } });
  stroke([[2, -212], [8, 26]], 5);
  shape(noodle([6, -212], [12, -246], 2, 30, 28), { fill: C.skinK, lw: 6 });
  push(); translate(14, -318); rotate(P.headTilt ?? 0); headKhoa(P, ner); pop();
  const hp = arm(shF, P.armF || { h: [10, 150], bend: 14 }, C.shirtK, C.shirtKs, C.skinK);
  // the red thread on the wrist (his one colour)
  const sh = shF, wv = [hp[0] - (hp[0] - sh[0]) * .12, hp[1] - (hp[1] - sh[1]) * .12];
  shape(ell(wv[0], wv[1], 13, 7, 12), { fill: C.red, lw: 4 });
  pop();
  if (P.sweat != null) sweat(-60, -400 + ((P.sweat % 1) * 30), 1);
  pop();
}
function headKhoa(P, ner) {
  if (P.hairStyle === 'long') shape(spline([[-70, -60], [-104, 40], [-96, 190], [-40, 230], [20, 190], [40, 80], [10, -60]]), { fill: C.hair, lw: 7 });
  shape(ell(-62, 8, 15, 22, 16), { fill: C.skinK, lw: 6 });
  shape(spline([[-6, -86], [50, -80], [74, -40], [78, 20], [64, 66], [20, 88], [-28, 80], [-62, 44], [-70, -20], [-52, -68]]), { fill: C.skinK, lw: 7, shade: () => fillOnly(spline([[-80, 0], [-40, 30], [0, 92], [-80, 92]]), C.skinKs, { boil: .3 }) });
  const hs = P.hairStyle || 'mop';
  if (hs === 'mop') {
    shape(spline([[-76, 10], [-84, -50], [-50, -104], [10, -116], [64, -96], [88, -54], [70, -50], [52, -70], [40, -48], [22, -70], [6, -46], [-14, -66], [-30, -40], [-50, -20], [-58, 20]]), { fill: C.hair, lw: 7 });
    stroke(spline([[0, -110], [-10, -140], [14, -150], [24, -132]], false), 6);
  } else if (hs === 'long' || hs === 'pig') {
    shape(spline([[-80, 10], [-86, -50], [-50, -106], [14, -116], [66, -98], [86, -56], [60, -70], [20, -78], [-20, -66], [-56, -30], [-62, 20]]), { fill: C.hair, lw: 7 });
    if (hs === 'pig') for (const [x, y] of [[-92, 10], [86, -6]]) { shape(spline([[x - 16, y - 30], [x + 16, y - 34], [x + 20, y + 40], [x, y + 70], [x - 20, y + 40]]), { fill: C.hair, lw: 6 }); shape(ell(x, y - 34, 12, 10, 12), { fill: '#d0304a', lw: 5 }); }
  } else if (hs === 'bald') {
    shape(spline([[-6, -112], [-26, -150], [-4, -168], [16, -150], [10, -112]]), { fill: C.hair, lw: 6 });
  } else if (hs === 'old') {
    shape(spline([[-76, 6], [-82, -46], [-40, -96], [20, -104], [70, -86], [84, -50], [60, -62], [0, -74], [-56, -40], [-62, 10]]), { fill: '#d8d6cc', lw: 6 });
    shape(spline([[-84, -40], [-40, -78], [30, -84], [86, -60], [88, -36], [30, -58], [-40, -52], [-86, -18]]), { fill: '#efeee6', lw: 6 });
  }
  const lid = P.blink ? 1 : clamp(P.lid ?? .12, 0, 1), look = P.look || [0, 0], es = P.eyeS ?? 1;
  const sh = ner ? (hash(Math.floor((P.t || 0) * 24) * 1.7) - .5) * 3 * ner : 0;
  if (P.ghostEyes) { for (const [x, y, rx, ry] of [[12, -8, 30, 34], [56, -10, 22, 30]]) { shape(ell(x, y, rx * es, ry * es, 30), { fill: '#06040a', lw: 5 }); dot(x + (look[0] || 0) * 6, y + 2, 5, '#ff2a1e'); stroke([[x, y + ry * .9], [x + 2, y + ry * .9 + 30 + 14 * Math.sin((P.t || 0) * 2 + x)]], 4, { line: '#5a0a10' }); } }
  else {
  eye(12, -8, 30 * es, 34 * es, { lid, look, pupil: P.pupil ?? 4, skin: C.skinK, closed: P.closed, jitter: sh });
  eye(56, -10, 22 * es, 30 * es, { lid, look, pupil: (P.pupil ?? 4) * .9, skin: C.skinK, closed: P.closed, jitter: sh });
  }
  const br = P.brow ?? .5;   // worried: inner ends up
  stroke([[-16, -50 + br * 2], [26, -56 - br * 10]], 7); stroke([[44, -56 - br * 10], [74, -48 + br * 2]], 6);
  shape(spline([[66, 4], [86, 24], [70, 32]]), { fill: C.skinK, lw: 6 });
  const m = P.mouth || {};
  if (P.beard) shape(spline([[10, 50], [70, 44], [74, 90], [48, 170], [30, 120], [8, 92]]), { fill: '#efeee6', lw: 6, shade: () => fillOnly(spline([[30, 60], [60, 60], [50, 150]]), '#cfccc0', { boil: .3 }) });
  mouth(46, 52, 40, { o: m.o || 0, w: m.w ?? 1, sm: m.sm ?? -.3, lw: 5 });
  if (P.dirt) { fillOnly(ell(44, 60, 30, 14, 14), '#3a2614', { boil: .4 }); for (let k = 0; k < 3; k++) fillOnly(ell(36 + k * 9, 80 + k * 6, 4, 6, 8), '#3a2614', { boil: .3 }); }
  if (P.cheekTear) for (const x of [10, 54]) stroke([[x, 22], [x + 2, 58 + ((P.t || 0) * 30) % 16]], 4, { line: '#9ad0f0' });
  if (P.earring) { dot(-62, 36, 7, '#e8c040'); }
  if (P.covered) shape(spline([[0, 30], [90, 24], [96, 70], [10, 80]]), { fill: '#e3a874', lw: 6 });
  if (P.khan) shape(spline([[-84, -40], [-40, -100], [40, -110], [92, -70], [90, -44], [40, -74], [-40, -66], [-80, -16]]), { fill: '#f4f2ea', lw: 6 });
}

// —— Bà ——
// P: {x,y(hip),s,rise (torso angle: −π/2 lying head-left … 0 upright), headTilt, dead, catEyes(0..1), lid, mouth, armF, armB, look, sil}
export function ba(P) {
  push(); translate(P.x, P.y); scale(P.s ?? 1, P.s ?? 1);
  // legs straight along the bed
  for (const dy of [-6, 8]) shape(noodle([0, dy], [300, dy + 4], 0, 44, 34), { fill: C.shirtBs, lw: 7 });
  push(); rotate(P.rise ?? 0);
  const shB = [-36, -176], shF = [34, -172];
  arm(shB, P.armB || { h: [6, 140], bend: -10 }, C.shirtBs, C.shirtBs, C.skinBs, { w0: 34, w1: 24, r: 16, claw: true });
  shape(spline([[-26, -198], [-56, -180], [-62, -90], [-60, 20], [0, 26], [58, 18], [56, -96], [52, -180], [26, -198]]), { fill: C.shirtB, lw: 7, shade: () => {
    fillOnly(spline([[-90, -210], [-30, -200], [-40, 30], [-90, 30]]), C.shirtBs, { boil: .4 });
    for (let k = 0; k < 4; k++) dot(10, -160 + k * 40, 4.5, '#d8c8a8');
  } });
  shape(noodle([2, -196], [8, -226], 2, 26, 24), { fill: C.skinB, lw: 6 });
  push(); translate(12, -296); rotate(P.headTilt ?? 0); headBa(P); pop();
  arm(shF, P.armF || { h: [10, 140], bend: 10 }, C.shirtB, C.shirtBs, C.skinB, { w0: 34, w1: 24, r: 16, claw: true });
  pop();
  pop();
}
function headBa(P) {
  // bun at the back
  shape(ell(-70, -30, 32, 28, 22), { fill: C.hairB, lw: 6, shade: () => fillOnly(ell(-60, -20, 20, 18, 14), C.hairBs, { boil: .3 }) });
  shape(spline([[-4, -78], [46, -72], [66, -36], [70, 16], [56, 58], [22, 80], [-20, 74], [-54, 40], [-62, -16], [-46, -60]]), { fill: C.skinB, lw: 7, shade: () => {
    fillOnly(spline([[-70, -10], [-30, 20], [0, 84], [-70, 84]]), C.skinBs, { boil: .3 });
    fillOnly(ell(32, 34, 18, 10, 12), C.skinBs, { boil: .3 });   // sunken cheek
  } });
  // hair combed back, a few loose strands
  shape(spline([[-60, -6], [-66, -48], [-36, -84], [10, -90], [52, -74], [36, -64], [0, -70], [-30, -56], [-44, -24]]), { fill: C.hairB, lw: 6 });
  stroke(spline([[-20, -70], [-30, -20], [-40, 30], [-34, 70]], false), 3.5, { line: C.hairBs });
  stroke(spline([[24, -76], [40, -40], [36, 0]], false), 3.5, { line: C.hairBs });
  // sunken sockets
  for (const [x, y, rx, ry] of [[10, -6, 32, 34], [50, -8, 24, 30]]) fillOnly(ell(x, y + 6, rx * .98, ry * .95, 24), C.socket, { boil: .6 });
  const look = P.look || [0, 0];
  eye(10, -6, 26, 28, { lid: P.lid ?? .2, look, skin: C.socket, dead: P.dead !== false && !P.catEyes, cat: P.catEyes || 0, pupil: 2.5, lw: 5 });
  eye(50, -8, 19, 24, { lid: P.lid ?? .2, look, skin: C.socket, dead: P.dead !== false && !P.catEyes, cat: P.catEyes || 0, pupil: 2.5, lw: 5 });
  stroke([[-14, -46], [24, -36]], 5); stroke([[38, -38], [66, -46]], 5);
  for (const y of [-58, -66]) stroke(arc(20, y + 4, 26, 4, Math.PI * 1.1, Math.PI * 1.9, 8), 3, { line: C.skinBs });
  shape(spline([[58, 6], [76, 26], [62, 34]]), { fill: C.skinB, lw: 5 });
  stroke(quad([28, 36], [24, 50], [32, 62], 6), 3.5, { line: C.skinBs });
  const m = P.mouth || {};
  mouth(40, 58, 34, { o: m.o || 0, sm: -.5, lw: 5, few: true });
}

// sheet over Bà: cover 1 = over the head, 0 = only the lap; drawn in the same space as ba() (origin = hip)
export function sheet(P, cover, drape = 200) {
  push(); translate(P.x, P.y); scale(P.s ?? 1, P.s ?? 1);
  const a = P.rise ?? 0, c = Math.cos(a), s = Math.sin(a);
  const R = (x, y) => [x * c - y * s, x * s + y * c];
  const L = 400 * cover, pts = [];
  pts.push([-120, 70]);
  pts.push(R(-70, -L)); pts.push(R(0, -L - 16)); pts.push(R(84, -L));
  for (const [y0, th] of [[-330, 96], [-250, 70], [-160, 90], [-60, 80]]) if (-y0 < L) pts.push(R(th, y0));
  pts.push([120, -44], [210, -40], [300, -50], [330, -66], [352, -30], [360, 60], [366, drape], [120, drape + 14], [-110, drape]);
  shape(spline(pts), { fill: C.sheet, lw: 7, shade: () => { for (const x of [60, 200]) fillOnly([[x, 40], [x + 30, 40], [x + 40, drape + 20], [x - 4, drape + 20]], C.sheetS, { boil: .4 }); fillOnly(rect(-200, drape - 30, 700, 60), C.sheetS, { boil: .4 }); } });
  pop();
}

// —— the cat ——  kind: sit | lie | leap | arch ; eyes 0..1 ; glow: yellow possessed eyes
export function cat(x, y, s, kind, { eyes = 1, glow = false, face = 1, flat = null } = {}) {
  push(); translate(x, y); scale(s * face, s);
  const F = flat || C.cat, Sh = flat || C.catS, lw = flat ? 0 : 7, o = flat ? { stroke: false } : {};
  const body = { sit: [[-60, 0], [-70, -70], [-40, -130], [10, -140], [40, -90], [46, 0]], lie: [[-150, 0], [-140, -50], [-60, -70], [30, -60], [70, -26], [74, 0]], leap: [[-160, -30], [-90, -76], [10, -84], [80, -60], [100, -30], [20, -4], [-120, 0]], arch: [[-130, 80], [-140, -40], [-70, -150], [20, -150], [90, -60], [96, 80], [64, 80], [44, 4], [-84, 4], [-104, 80]] }[kind];
  const tail = { sit: [[-56, -10], [-110, -20], [-120, -70], [-96, -100]], lie: [[-140, -10], [-190, 0], [-230, 10], [-250, 40]], leap: [[-150, -30], [-210, -50], [-260, -40], [-300, -60]], arch: [[-126, 0], [-160, -70], [-160, -160], [-128, -210]] }[kind];
  shape(noodle(tail[0], tail[3], 20, 22, 12), { fill: F, lw, ...o });
  if (kind === 'leap') for (const [a, b] of [[[-130, -20], [-210, 40]], [[-100, -10], [-180, 60]], [[60, -40], [170, -10]], [[40, -30], [160, 14]]]) shape(noodle(a, b, 0, 26, 18), { fill: F, lw, ...o });
  shape(spline(body), { fill: F, lw, ...o, shade: flat ? null : () => fillOnly(ell(-20, -20, 80, 30, 20), Sh, { boil: .3 }) });
  const hc = { sit: [16, -168], lie: [70, -74], leap: [100, -80], arch: [110, -70] }[kind];
  const [hx, hy] = hc;
  shape([[hx - 46, hy + 22], [hx - 50, hy - 30], [hx - 40, hy - 74], [hx - 16, hy - 38], [hx + 14, hy - 40], [hx + 34, hy - 76], [hx + 48, hy - 28], [hx + 46, hy + 24], [hx, hy + 40]], { fill: F, lw, ...o });
  const E = [];
  if (!flat && eyes > .02) for (const ex of [hx - 18, hx + 22]) {
    shape(ell(ex, hy - 2, 14, 15 * eyes, 20), { fill: glow ? '#ffcc22' : C.white, lw: 5, shade: () => glow ? fillOnly(ell(ex, hy - 2, 2.6, 13 * eyes, 10), INK, { boil: .2 }) : dot(ex + 3, hy - 2, 3) });
    E.push([ex, hy - 2]);
  }
  pop();
  return E;
}

// —— the big corpse hand (inserts): long bony fingers, dark nails; curl per finger 0..1 ——
export function bigHand(curl = [0, 0, 0, 0, 0], { sleeve = true } = {}) {
  if (sleeve) shape(spline([[-560, -86], [-80, -78], [-60, 84], [-560, 96]]), { fill: C.shirtB, lw: 7, shade: () => fillOnly(rect(-600, 40, 600, 60), C.shirtBs, { boil: .3 }) });
  shape(spline([[-90, -56], [20, -64], [96, -46], [110, 10], [96, 54], [10, 66], [-90, 58]]), { fill: C.skinB, lw: 7, shade: () => {
    fillOnly(rect(-120, 30, 260, 50), C.skinBs, { boil: .3 });
    for (const y of [-30, -6, 18]) stroke(quad([-40, y * .5], [30, y * .9], [92, y], 6), 3.5, { line: C.skinBs });
  } });
  const base = [[96, -40], [106, -14], [106, 12], [96, 38]], len = [120, 136, 128, 100];
  for (let k = 3; k >= 0; k--) {
    const c = curl[k + 1] ?? 0, p0 = base[k], L = len[k];
    const kn = [p0[0] + L * .5 * Math.cos(c * .9), p0[1] + L * .5 * Math.sin(c * .9)];
    const tip = [kn[0] + L * .55 * Math.cos(c * 2.2), kn[1] + L * .55 * Math.sin(c * 2.2)];
    shape(noodle(p0, kn, 0, 26, 22), { fill: C.skinB, lw: 6 });
    shape(noodle(kn, tip, 0, 22, 14), { fill: C.skinB, lw: 6 });
    const na = c * 2.2; shape(spline([[tip[0] - 8 * Math.cos(na), tip[1] - 8 * Math.sin(na)], [tip[0] + 18 * Math.cos(na) - 6 * Math.sin(na), tip[1] + 18 * Math.sin(na) + 6 * Math.cos(na)], [tip[0] + 26 * Math.cos(na), tip[1] + 26 * Math.sin(na)]]), { fill: '#3a3428', lw: 4 });
    stroke(arc(kn[0], kn[1], 9, 9, Math.PI * .6 + c, Math.PI * 1.4 + c, 6), 3, { line: C.skinBs });
  }
  const c0 = curl[0] ?? 0, t1 = [20 + 60 * Math.cos(1 - c0), 56 + 60 * Math.sin(1 - c0)];
  shape(noodle([10, 50], t1, -8, 30, 18), { fill: C.skinB, lw: 6 });
}
