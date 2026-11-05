// Gọi hồn trên mái nhà — thử phong cách toon (nét viền dày rung 12 fps, màu phẳng), dọc 1080×1920
import { clamp, lerp, seg, ss, hash, TAU } from './core/lib.js';
import { init, frame, push, pop, translate, rotate, scale, shape, fillOnly, stroke, ell, rect, spline, noodle, quad, dot, bands, g, W, H, INK, S } from './toon.js';
import { khoa, ba, sheet, useSet, C, SETS } from './chars.js';
import { room, lamp, ROOM, outside, EXT } from './sets.js';

const cv = document.getElementById('c'); init(cv);
for (const f of ['800 50px "Head"', '600 34px "Semi"']) await document.fonts.load(f, 'Đêm ơi bà Út ừ ạ ộ…');
const TL = await (await fetch('tl.json')).json();   // {dur, lines:[{id,who,t,d,text}], vox:[[a,b,who]], shots:[[t0,t1,name]], jump}
const DUR = TL.dur, L = Object.fromEntries(TL.lines.map(l => [l.id, l]));
// bảng màu ánh trăng cho người (đêm ngoài trời): đủ sáng để thấy mặt, lạnh
SETS.moon = { ...SETS.dim, skinK: '#9a9cc0', skinKs: '#6e7096', hair: '#1a1630', shirtK: '#4a5a9a', shirtKs: '#33407a', pants: '#26223a', pantsS: '#18152a', red: '#a03a4a', white: '#e8ecff', mouthIn: '#1a1230', tongue: '#6a4a6a' };
SETS.ghost = { ...SETS.lamp, skinB: '#c8d6c0', skinBs: '#93a490', socket: '#2e2838', hairB: '#bdbac4', hairBs: '#8a8696', shirtB: '#5a4a5e', shirtBs: '#3e3244' };

const E = (t, a, b) => ss(seg(t, a, b));
const two = t => Math.floor(t * 12 + 1e-6) / 12;
// khẩu hình: chỉ mở khi chính câu của nhân vật đó đang có tiếng
function lip(t, who) { for (const [a, b, w] of TL.vox) if (w === who && t >= a && t < b) { const f = Math.floor(t * 12); return [.2, .6, .35, .85, .15, .65][Math.floor(hash(f * 1.7 + 3) * 6)]; } return 0; }
const blink = (t, seed) => { const p = 3 + hash(seed) * 1.6, u = (t + hash(seed + 1) * 3) % p; return u < .17; };
function camera(cx, cy, z, w, h) { cx = clamp(cx, W / 2 / z, w - W / 2 / z); cy = clamp(cy, H / 2 / z, h - H / 2 / z); translate(W / 2, H / 2); scale(z); translate(-cx, -cy); }
function glowRings(x, y, r, col = '255,200,40', k = 1) { for (const [m, a] of [[2.6, .14], [1.6, .24]]) fillOnly(ell(x, y, r * m, r * m, 30), `rgba(${col},${a * k})`, { boil: .4 }); }

// —— áo trắng của bà (vật gọi hồn) treo ở tay ——
function shirt(x, y, s, t, flap = 1) {
  push(); translate(x, y); scale(s);
  const w = Math.sin(t * 9) * 18 * flap, w2 = Math.sin(t * 7 + 1) * 24 * flap;
  shape(spline([[-60, 0], [60, 0], [96 + w, 60], [84 + w2, 210], [-70 + w2, 220], [-90 + w, 70]]), { fill: '#f2efe4', lw: 6, shade: () => fillOnly(spline([[20, 0], [70, 0], [90 + w2, 220], [10 + w2, 220]]), '#c9c3b2', { boil: .4 }) });
  for (let k = 0; k < 3; k++) dot(4 + w * .3, 50 + k * 50, 4, '#b8b0a0');
  pop();
}
// —— ruộng lúa đêm ——
function rice(y0, rows, col, colS, t, h0 = 120, seed = 0) {
  for (let r = 0; r < rows; r++) {
    const y = y0 + r * 46, hh = h0 * (1 + r * .12);
    for (let k = 0; k < 13; k++) {
      const x = -60 + k * 92 + (hash(k * 3.3 + r * 7 + seed) - .5) * 40, sw = Math.sin(t * 1.3 + k * .7 + r) * 10;
      shape(spline([[x - 30, y + 20], [x - 22 + sw * .4, y - hh * .5], [x - 10 + sw, y - hh], [x + 4 + sw * .6, y - hh * .6], [x + 16 + sw, y - hh * .9], [x + 18 + sw * .4, y - hh * .3], [x + 34, y + 20]]), { fill: r % 2 ? colS : col, lw: 5, boil: .8 });
    }
  }
}
function field(t, { ghost = 0, gx = 540, gy = 1240, gs = 1, eyeGlow = 0, look = [0, 0], mouth = 0, near = false } = {}) {
  bands(['#070718', '#0c0e28', '#141a3c', '#1c2450'], -100, 1100, -100, W + 100);
  fillOnly(ell(820, 330, 70, 70, 40), '#e9e6cc', { boil: .4 }); glowRings(820, 330, 60, '230,230,200', .6);
  // rặng dừa / tre xa
  for (let k = 0; k < 9; k++) { const x = k * 140 - 40 + hash(k) * 60, top = 820 + hash(k * 5) * 120; shape(noodle([x, 1110], [x + 30, top], 20, 18, 10), { fill: '#05050f', lw: 4 }); for (let j = 0; j < 5; j++) { const a = -2.6 + j * .55; shape(noodle([x + 30, top], [x + 30 + Math.cos(a) * 120, top + Math.sin(a) * 50 + 60], -20, 16, 4), { fill: '#05050f', lw: 4 }); } }
  fillOnly(rect(-100, 1080, W + 200, 900), '#0e1a1c', { boil: 0 });
  rice(1100, 3, '#1a3030', '#142626', t, 70, 1);
  if (ghost > 0) {
    useSet('ghost'); push(); translate(gx, gy); scale(gs);
    if (ghost < 1) g.globalAlpha = ghost;
    ba({ x: 0, y: 0, rise: 0, lid: .15, look, headTilt: -.06 + .03 * Math.sin(t * .8), armF: { h: [10, 120], bend: 6 }, armB: { h: [-10, 120], bend: -6 }, mouth: { o: mouth } });
    g.globalAlpha = 1; pop();
    if (eyeGlow) { glowRings(gx + 10 * gs + 12 * gs, gy - 302 * gs, 9 * gs, '200,255,220', eyeGlow); glowRings(gx + 50 * gs + 12 * gs, gy - 304 * gs, 8 * gs, '200,255,220', eyeGlow); }
  }
  rice(1260, near ? 9 : 7, '#203a38', '#183030', t, near ? 260 : 190, 2);
}
// —— Út trên mái ——
const RIDGE = [700, 1430];
function utOnRoof(t, o = {}) {
  useSet('moon');
  const P = { x: 690, y: 1222, s: .92, face: -1, t, armF: o.armF ?? { h: [150, -115], bend: -30 }, armB: { h: [-30, 150], bend: 14 }, lean: o.lean ?? -.04, look: o.look ?? [-.4, -.3], brow: o.brow ?? .9, mouth: { o: lip(t, 'u') + (o.mo ?? 0), w: 1.1 }, blink: o.noBlink ? false : blink(t, 3), nerv: o.nerv ?? 0, pupil: o.pupil ?? 4, headTilt: o.tilt ?? -.12 };
  khoa(P);
  // tay phải giơ áo (face=-1 → lật ngang)
  const hx = P.x - (40 + P.armF.h[0]) * P.s, hy = P.y + (-184 + P.armF.h[1]) * P.s;
  shirt(hx, hy + 6, .62, t, 1);
  return P;
}

// —— shots ——
const SHOT = {
  ext(t, u) {
    useSet('dim'); push(); camera(700, lerp(1700, 1500, E(u, 0, 1)), lerp(.78, .9, ss(u)), EXT.w, EXT.h);
    outside(t, false); pop();
  },
  field(t, u, a, b) {
    const tj = TL.jump, k = t - tj;
    const up = k < 0 ? 0 : E(t, tj, tj + .25);
    push(); const z = lerp(1, 1.08, ss(u)); translate(W / 2, H / 2); scale(z); translate(-W / 2, -H / 2);
    field(t, { ghost: up > 0 ? 1 : 0, gx: 520, gy: lerp(1800, 1420, up), gs: 1.9, eyeGlow: up, look: [-.1, .1], near: true });
    pop();
  },
  roof(t, u) {
    push(); camera(lerp(700, 690, u), lerp(1420, 1250, ss(u)), lerp(.85, 1.25, ss(u)), EXT.w, EXT.h);
    outside(t, false); utOnRoof(t, { armF: { h: [lerp(40, 150, E(u, .3, .8)), lerp(130, -115, E(u, .3, .8))], bend: -30 }, look: [-.2, 0] });
    pop();
  },
  call(t, u) {
    push(); camera(640, lerp(1000, 980, u), lerp(1.75, 1.85, ss(u)), EXT.w, EXT.h);
    outside(t, false); utOnRoof(t, { armF: { h: [150 + 14 * Math.sin(t * 5), -115], bend: -30 }, look: [-.5, -.2], brow: 1.1 });
    pop();
  },
  listen(t, u) {
    // nhìn từ mái ra ruộng: im lặng rồi có tiếng "ơi…"; bóng bà đứng giữa ruộng, rất xa
    const ga = L.g ? E(t, L.g.t - .6, L.g.t + .4) : 0;
    field(t, { ghost: ga > 0 ? 1 : 0, gx: 360, gy: 1230, gs: .62, eyeGlow: ga, mouth: lip(t, 'g') * .5 });
  },
  turn(t, u) {
    // Út quay phắt về phía ruộng, rồi nhìn xuống mái nhà mình
    push(); camera(640, 960, 2.3, EXT.w, EXT.h);
    outside(t, false);
    const down = E(u, .55, .75);
    utOnRoof(t, { armF: { h: [lerp(150, 50, E(u, 0, .2)), lerp(-115, 120, E(u, 0, .2))], bend: -20 }, look: [lerp(-.8, .2, down), lerp(-.1, .9, down)], brow: 1.4, nerv: .7, pupil: 2.6, noBlink: true, mo: .25 });
    pop();
  },
  room(t, u) {
    useSet('lamp'); push(); camera(lerp(760, 330, ss(u)), lerp(1760, 1880, ss(u)), lerp(.75, 2.6, ss(u)), ROOM.w, ROOM.h);
    room(t, 'lamp'); lamp(t, 'lamp', { bend: .25 * Math.sin(t * 1.7) });
    const op = L.n5 ? E(two(t), L.n5.t + L.n5.d * .62, L.n5.t + L.n5.d * .62 + .5) : 0;
    const P = { x: 650, y: 1930, rise: -Math.PI / 2, lid: lerp(1, .05, op), look: [0, -.2], armF: { h: [0, 150], bend: 6 }, armB: { h: [0, 150], bend: -6 } };
    ba(P); sheet(P, .55);
    pop();
  },
};

// —— jumpscare: khung impact đen trắng 2 hình ——
function impact(t) {
  fillOnly(rect(-50, -50, W + 100, H + 100), '#f6f0e4', { boil: 0 });
  const cx = 540, cy = 900;
  for (let k = 0; k < 48; k++) { const a = k / 48 * TAU + hash(k + Math.floor(t * 24)) * .05, w = .02 + hash(k * 3) * .025; fillOnly([[cx + Math.cos(a) * 260, cy + Math.sin(a) * 260], [cx + Math.cos(a - w) * 2400, cy + Math.sin(a - w) * 2400], [cx + Math.cos(a + w) * 2400, cy + Math.sin(a + w) * 2400]], INK, { boil: .5 }); }
  useSet('ghost'); const keep = { ...C }; Object.assign(C, { skinB: INK, skinBs: INK, shirtB: INK, shirtBs: INK, hairB: INK, hairBs: INK, socket: INK, white: '#f6f0e4' });
  push(); translate(cx - 30 * 2.1, cy + 300 * 2.1); scale(2.1); ba({ x: 0, y: 0, rise: 0, lid: .1, mouth: { o: .7 } }); pop(); Object.assign(C, keep);
}

// —— phụ đề có nhãn người nói ——
const WHO = { n: ['Người kể', '#e0a640'], u: ['Út', '#6a8ae0'], g: ['???', '#7fc4a6'] };
function wrap(text, maxW) { g.font = '800 50px "Head"'; const ws = text.split(' '), out = []; let cur = ''; for (const w of ws) { const s = cur ? cur + ' ' + w : w; if (g.measureText(s).width > maxW && cur) { out.push(cur); cur = w; } else cur = s; } if (cur) out.push(cur); return out; }
const SUB_Y = 1500;
function hud(t) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  for (const s of TL.subs) if (t >= s[0] && t < s[1]) {
    const lines = wrap(s[2], 900), [who, col] = WHO[s[3]];
    g.save(); g.globalAlpha = Math.min(1, (t - s[0]) / .1, (s[1] - t) / .1);
    g.font = '600 34px "Semi"'; const pw = g.measureText(who).width + 36, py = SUB_Y - lines.length * 32 - 52;
    g.fillStyle = col; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.roundRect(W / 2 - pw / 2, py, pw, 48, 24); g.fill(); g.stroke();
    g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(who, W / 2, py + 26);
    g.font = '800 50px "Head"'; g.lineJoin = 'round';
    lines.forEach((l, i) => { const y = SUB_Y + (i - (lines.length - 1) / 2) * 62; g.lineWidth = 11; g.strokeStyle = INK; g.strokeText(l, W / 2, y); g.fillStyle = s[3] === 'g' ? '#c8ffd8' : '#ffffff'; g.fillText(l, W / 2, y); });
    g.restore();
  }
  const te = DUR - 2.4;
  if (t >= te) { g.save(); g.globalAlpha = seg(t, te, te + .5) * .55; g.font = '600 34px "Semi"'; g.textAlign = 'center'; g.fillStyle = '#d8d0c0'; g.fillText('Câu chuyện chỉ là hư cấu', W / 2, 1780); g.restore(); }
}

function render(t) {
  frame(t);
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  const sh = TL.shots.find(s => t >= s[0] && t < s[1]) || TL.shots[TL.shots.length - 1];
  const tj = TL.jump;
  if (t >= tj && t < tj + 2 / 24) impact(t);
  else SHOT[sh[2]](t, (t - sh[0]) / (sh[1] - sh[0]), sh[0], sh[1]);
  // cắt cảnh: 2 khung đen ngắn
  g.setTransform(1, 0, 0, 1, 0, 0);
  const d = Math.min(t - sh[0], sh[1] - t); if (d < .06 && sh[0] > 0) { g.fillStyle = `rgba(0,0,0,${1 - d / .06})`; g.fillRect(0, 0, W, H); }
  if (t > DUR - 1.2) { g.fillStyle = `rgba(0,0,0,${seg(t, DUR - 1.2, DUR) * .85})`; g.fillRect(0, 0, W, H); }
  hud(t);
}
window.render = render; window.DUR = DUR;
render(parseFloat(new URLSearchParams(location.search).get('t') ?? '3'));
window.READY = true;
