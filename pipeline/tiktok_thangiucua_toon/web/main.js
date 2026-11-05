// THẦN GIỮ CỦA — bản toon (nét viền dày rung, màu phẳng), dọc 1080×1920. Không khí âm u: lớp phủ tối + chỉ đèn/mắt ma phát sáng + sương.
import { clamp, lerp, seg, ss, hash, TAU } from './core/lib.js';
import { init, frame, push, pop, translate, rotate, scale, shape, fillOnly, stroke, ell, rect, spline, noodle, quad, dot, bands, g, W, H, INK, S, tx, zoom } from './toon.js';
import { khoa, ba, useSet, C, SETS, hand } from './chars.js';
import { room, lamp, ROOM } from './sets.js';

const cv = document.getElementById('c'); init(cv);
for (const f of ['800 50px "Head"', '600 34px "Semi"']) await document.fonts.load(f, 'Đêm ơi bà Út ừ ạ ộ…');
const TL = await (await fetch('tl.json')).json();
const DUR = TL.dur;
const E = (t, a, b) => ss(seg(t, a, b));
let NOW = 0;
function lip(who) { for (const [a, b, w] of TL.vox) if (w === who && NOW >= a && NOW < b) { const f = Math.floor(NOW * 12); return [.25, .65, .4, .85, .2, .7][Math.floor(hash(f * 1.7 + 3) * 6)]; } return 0; }
const blink = (seed) => { const p = 3.2 + hash(seed) * 1.8, u = (NOW + hash(seed + 1) * 3) % p; return u < .14; };
function camera(cx, cy, z) { translate(W / 2, H / 2); scale(z); translate(-cx, -cy); }
let FX = [];   // các thứ phát sáng, vẽ SAU lớp phủ tối
const glow = (x, y, r, col, a = 1) => { const [sx, sy] = tx(x, y); FX.push([sx, sy, r * zoom(), col, a]); };
function drawFX() { for (const [x, y, r, col, a] of FX) for (const [m, k] of [[2.6, .12], [1.6, .2], [.8, .3]]) fillOnly(ell(x, y, r * m, r * m, 30), `rgba(${col},${k * a})`, { boil: .4 }); }

// —— nhân vật (bảng màu riêng, thở / chớp mắt / lắc đầu nhẹ liên tục cho mượt) ——
const PAL = {
  lanh: { shirtK: '#6a5238', shirtKs: '#4a3826', pants: '#24222a', pantsS: '#16141a', red: '#6a5238', skinK: '#d9a77a', skinKs: '#b07c52', hair: '#16121c' },
  man: { shirtK: '#7a4a72', shirtKs: '#583454', pants: '#22202a', pantsS: '#141218', red: '#7a4a72', skinK: '#efcaa6', skinKs: '#c99c78', hair: '#120e16' },
  na: { shirtK: '#d47a88', shirtKs: '#a85666', pants: '#3a3048', pantsS: '#2a2234', red: '#d47a88', skinK: '#f2d2b2', skinKs: '#cfa684', hair: '#120e16' },
  naSick: { shirtK: '#b07080', shirtKs: '#865262', pants: '#3a3048', pantsS: '#2a2234', red: '#b07080', skinK: '#c9d2c4', skinKs: '#9eab9a', hair: '#120e16' },
  tu: { shirtK: '#5a3e28', shirtKs: '#3e2a1a', pants: '#2a2420', pantsS: '#1a1612', red: '#5a3e28', skinK: '#d6bc9a', skinKs: '#ad9272', hair: '#d8d6cc' },
  boy: { shirtK: '#93a892', shirtKs: '#6e846e', pants: '#3a2a20', pantsS: '#2a1a14', red: '#93a892', skinK: '#93a892', skinKs: '#6e846e', hair: '#0c0a0e' },
};
const CH = {
  lanh: o => ({ pal: PAL.lanh, hairStyle: 'mop', ...o }),
  man: o => ({ pal: PAL.man, hairStyle: 'long', earring: true, ...o }),
  na: o => ({ pal: o.sick ? PAL.naSick : PAL.na, hairStyle: 'pig', s: .62 * (o.s ?? 1), ...o, s: .62 * (o.s ?? 1) }),
  tu: o => ({ pal: PAL.tu, hairStyle: 'old', beard: true, ...o }),
  boy: o => ({ pal: PAL.boy, hairStyle: 'bald', ghostEyes: true, s: .64, ...o }),
};
const SEED = { lanh: 1, man: 2, na: 3, tu: 4, boy: 5 };
function person(kind, o) {
  const P = CH[kind](o), sd = SEED[kind];
  const br = Math.sin(NOW * 2.1 + sd) * 4;
  P.y = (P.y ?? 0) + br * (P.s ?? 1); P.t = NOW;
  P.headTilt = (P.headTilt ?? 0) + Math.sin(NOW * .8 + sd * 2) * .035 + (P.talk ? Math.sin(NOW * 5.5 + sd) * .05 : 0);
  if (kind !== 'boy' && P.blink === undefined) P.blink = blink(sd);
  if (P.talk && !P.armF) P.armF = { h: [30 + 40 * Math.max(0, Math.sin(NOW * 2.6 + sd)), 140 - 70 * Math.max(0, Math.sin(NOW * 2.6 + sd))], bend: 20 };
  if (P.walk !== undefined) { P.step = Math.sin(P.walk); P.y -= Math.abs(Math.sin(P.walk)) * 10 * (P.s ?? 1); if (!P.armF) P.armF = { h: [20 + 30 * Math.sin(P.walk), 140], bend: 16 }; if (!P.armB) P.armB = { h: [-10 - 30 * Math.sin(P.walk), 140], bend: -14 }; }
  if (kind === 'boy') glow(P.x + 30 * (P.face ?? 1) * P.s, P.y - 330 * P.s, 120 * P.s, '150,255,180', .5);
  khoa(P);
  if (kind === 'boy') { const s = P.s, f = P.face ?? 1; for (const dx of [12, 56]) glow(P.x + (14 + dx) * f * s, P.y - 326 * s, 10 * s, '255,40,30', 1); }
  return P;
}
// tay cầm vật: vị trí bàn tay trước (gần đúng) theo P
const handF = P => { const s = P.s ?? 1, f = P.face ?? 1, h = (P.armF || { h: [10, 150] }).h; return [P.x + (40 + h[0]) * s * f, P.y + (-184 + h[1]) * s]; };

// —— đạo cụ ——
function jar(x, y, s = 1, { open = false, glowA = 0 } = {}) {
  push(); translate(x, y); scale(s);
  shape(spline([[-40, -150], [40, -150], [92, -100], [104, -30], [70, 0], [-70, 0], [-104, -30], [-92, -100]]), { fill: '#5a3a24', lw: 7, shade: () => { fillOnly(spline([[30, -150], [100, -100], [104, -30], [60, 0], [70, -80]]), '#3e2818', { boil: .4 }); fillOnly(ell(-50, -90, 14, 30, 12), 'rgba(255,230,190,.18)', { boil: .3 }); } });
  if (!open) shape(ell(0, -152, 46, 14, 20), { fill: '#c8a24a', lw: 6 });
  else { shape(ell(0, -152, 46, 14, 20), { fill: '#120c08', lw: 6 }); for (let k = 0; k < 5; k++) fillOnly(rect(-30 + k * 13, -160 - (k % 2) * 6, 16, 6), '#f0c840', { boil: .2 }); }
  shape(rect(-22, -110, 44, 70), { fill: '#c03a2e', lw: 5, shade: () => { for (let k = 0; k < 4; k++) stroke([[-14, -96 + k * 14], [14, -92 + k * 14]], 3, { line: '#3a0a08' }); } });
  pop();
  if (glowA) glow(x, y - 160 * s, 90 * s, '255,210,110', glowA);
}
function bellAt(x, y, s = 1, shake = 1) {
  push(); translate(x, y); scale(s); rotate(Math.sin(NOW * 14) * .25 * shake);
  stroke([[0, -26], [0, -6]], 4, { line: '#8a1a1a' });
  shape(spline([[-16, 0], [16, 0], [20, 26], [-20, 26]]), { fill: '#c8a040', lw: 5 }); dot(0, 30, 5, '#3a2a10');
  pop(); glow(x, y + 14 * s, 30 * s, '255,220,120', .6);
}
function hoe(hx, hy, ang, s = 1) { push(); translate(hx, hy); rotate(ang); scale(s); shape(noodle([0, -30], [0, 220], 0, 14, 14), { fill: '#6a4a28', lw: 5 }); shape(spline([[-10, 200], [70, 214], [64, 250], [-10, 232]]), { fill: '#8a9098', lw: 5 }); pop(); }

// —— bối cảnh: sân / nền nhà cũ (WORLD 1400×3000, mặt đất y=2300) ——
const GY = 2300, HX = 560, HY = 2370;   // tâm hố
const SKY = { night: ['#05060e', '#090b18', '#0e1222', '#141a2c'], day: ['#7c8a96', '#8e9ca6', '#a2aeb4', '#b4bec0'], dusk: ['#1c1424', '#2e1e30', '#4a2c3a', '#6a3c40'] };
function yard(mode, { hole = true, filled = false, house = true } = {}) {
  bands(SKY[mode], -200, GY, -200, 1600);
  if (mode === 'night') { fillOnly(ell(1080, 700, 60, 60, 30), '#d8d6c4', { boil: .4 }); glow(1080, 700, 60, '200,210,230', .35); }
  const sil = mode === 'day' ? '#4a5650' : mode === 'dusk' ? '#1e1420' : '#04050a';
  for (let k = 0; k < 9; k++) { const x = k * 170 - 60 + hash(k) * 60, top = 1500 + hash(k * 5) * 220; shape(noodle([x, GY], [x + 30, top], 20, 22, 12), { fill: sil, lw: 4 }); for (let j = 0; j < 6; j++) { const a = -2.7 + j * .55; shape(noodle([x + 30, top], [x + 30 + Math.cos(a) * 150, top + Math.sin(a) * 60 + 70], -24, 18, 4), { fill: sil, lw: 4 }); } }
  if (house) { const hx0 = 900, hx1 = 1420, eave = 1900, ridge = 1640, wc = mode === 'day' ? '#7a6248' : mode === 'dusk' ? '#3e2e2e' : '#1e1820';
    shape(rect(hx0 + 30, eave, hx1 - hx0, GY - eave), { fill: wc, lw: 7 });
    shape(spline([[hx0 - 40, eave + 30], [(hx0 + hx1) / 2 + 60, ridge], [hx1 + 120, eave + 30], [hx1 + 100, eave + 60], [hx0 - 20, eave + 60]]), { fill: mode === 'day' ? '#8a7a4a' : mode === 'dusk' ? '#3a2a20' : '#1a140e', lw: 8 });
    shape(rect(1080, 2040, 120, 110), { fill: mode === 'night' ? '#ffc060' : '#3a2a1a', lw: 6 }); if (mode === 'night') glow(1140, 2095, 70, '255,180,80', .7); }
  const gc = mode === 'day' ? '#5e5040' : mode === 'dusk' ? '#2e2420' : '#16120e';
  fillOnly(rect(-200, GY, 1800, 1000), gc, { boil: 0 });
  // nền nhà cũ: viền gạch + đất
  shape(spline([[150, 2310], [1000, 2300], [1060, 2470], [90, 2480]]), { fill: mode === 'day' ? '#6e5a44' : mode === 'dusk' ? '#3a2c24' : '#1e1812', lw: 7, shade: () => { for (let k = 0; k < 12; k++) fillOnly(rect(150 + k * 72, 2302, 60, 16), mode === 'day' ? '#8a4a32' : '#4a2a20', { boil: .3 }); } });
  if (hole && !filled) { shape(ell(HX, HY, 150, 42, 30), { fill: '#050304', lw: 7 }); }
  if (filled) shape(ell(HX, HY, 150, 42, 30), { fill: mode === 'day' ? '#4a3a2a' : '#2a1e16', lw: 6 });
  for (let k = 0; k < 4; k++) shape(ell(820 + k * 50, 2360 + (k % 2) * 20, 50, 18, 16), { fill: gc, lw: 5 });
}
// che phần thân dưới miệng hố (đất phía trước)
function holeLip(mode) { const gc = mode === 'day' ? '#6e5a44' : mode === 'dusk' ? '#3a2c24' : '#1e1812'; fillOnly(spline([[HX - 170, HY + 2], [HX + 170, HY + 2], [HX + 420, 2900], [HX - 420, 2900]]), gc, { boil: .3 }); stroke(quad([HX - 150, HY], [HX, HY + 52], [HX + 150, HY]), 7); }
function fog(y0, a = .18, n = 6) { for (let k = 0; k < n; k++) { const x = ((hash(k) * 1800 + NOW * (20 + k * 6)) % 2200) - 400; fillOnly(ell(x, y0 + hash(k + 3) * 260, 360, 46, 30), `rgba(150,170,180,${a})`, { boil: .6 }); } }
// —— am thầy Tư ——
function hut() {
  fillOnly(rect(-200, -200, 1600, 3400), '#1a1210', { boil: 0 });
  for (let k = 0; k < 9; k++) shape(rect(k * 160 - 40, 1200, 150, 1100), { fill: k % 2 ? '#2e2018' : '#34241a', lw: 5 });
  shape(rect(-100, 2300, 1600, 800), { fill: '#20160f', lw: 6 });
  shape(rect(820, 1820, 420, 30), { fill: '#5a3a22', lw: 6 }); shape(rect(830, 1850, 400, 120), { fill: '#8a2a22', lw: 6 });
  for (const x of [880, 1140]) shape(rect(x, 1460, 70, 170), { fill: '#d8b84a', lw: 5, shade: () => { for (let k = 0; k < 4; k++) stroke([[x + 10, 1490 + k * 30], [x + 60, 1500 + k * 30]], 3, { line: '#8a1a14' }); } });
  const lx = 1000, ly = 1780; shape(rect(lx - 26, ly - 20, 52, 20), { fill: '#c08a3a', lw: 5 }); shape(spline([[lx - 8, ly - 20], [lx + 8, ly - 20], [lx + 2 * Math.sin(NOW * 9), ly - 70]]), { fill: '#ffd060', lw: 4 }); glow(lx, ly - 46, 120, '255,170,70', .9);
}
// —— đường lên núi ——
function trail(p) {
  bands(SKY.night, -200, 2300, -200, 1600); fillOnly(ell(260, 600, 50, 50, 30), '#d8d6c4', { boil: .4 }); glow(260, 600, 50, '200,210,230', .3);
  for (let k = 0; k < 10; k++) { const x = (k * 190 + 40 - p * 300) % 1700 - 150; shape(noodle([x, 2400], [x + 20, 1500 + hash(k) * 300], 10, 40, 20), { fill: '#05060a', lw: 4 }); shape(ell(x + 20, 1500 + hash(k) * 300, 160, 120, 20), { fill: '#060a0c', lw: 4 }); }
  fillOnly(rect(-200, 2300, 1800, 900), '#12100e', { boil: 0 });
  shape(spline([[300, 2300], [800, 2300], [1300, 3000], [-200, 3000]]), { fill: '#2a241e', lw: 6 });
}

// —— shots theo key cảnh (lt = giây trong cảnh, D = độ dài cảnh, u = lt/D) ——
const SC = TL.scenes;
const sAt = k => SC.find(s => s[0] === k);
let MODE = 'night', GLOOM = .35, JUMP = 0, RED = 0;
const SHOT = {
  hook(lt, D, u) { MODE = 'night'; push(); camera(lerp(700, 600, ss(u)), lerp(2050, 2280, ss(u)), lerp(.75, 1.5, ss(u))); yard('night'); jar(HX + 10, HY + 14, .9, { glowA: .5 }); glow(HX, HY - 30, 160, '150,255,180', .25 + .15 * Math.sin(NOW * 3)); fog(2150, .14); pop(); },
  hook2(lt, D, u) { MODE = 'night';
    if (lt < D * .6) { const up = E(lt, 0, .35); push(); camera(HX, 2230, 2.0); yard('night'); person('boy', { x: HX - 20, y: lerp(2600, 2380, up), face: 1, look: [.2, -.1], tilt: 0 }); holeLip('night'); pop(); RED = .12 * (1 - E(lt, 0, D * .6)); }
    else { push(); camera(HX + 40, 2280, lerp(2.4, 2.8, E(lt, D * .6, D))); yard('night'); jar(HX + 10, HY + 14, .9, { glowA: .9 }); pop(); } },
  title(lt, D, u) { MODE = 'night'; push(); camera(HX + 20, 2250, lerp(2.6, 2.9, u)); yard('night'); jar(HX + 10, HY + 14, .9, { glowA: 1 }); fog(2200, .12); pop(); },
  dig(lt, D, u) { MODE = 'day'; GLOOM = .18; const hit = u > .72; push(); camera(lerp(760, 640, ss(u)), lerp(2050, 2150, ss(u)), lerp(.8, 1.15, ss(u))); yard('day', { hole: u > .3 });
    if (hit) jar(HX, HY + 30, .7);
    person('man', { x: 230, y: GY - 236, face: 1, look: [.5, .1] });
    const sw = hit ? 0 : Math.sin(NOW * 3); const P = person('lanh', { x: HX + 230, y: GY - 236, face: -1, armF: hit ? { h: [60, 60], bend: 10 } : { h: [40 + 50 * sw, -60 + 150 * Math.max(0, sw)], bend: -20 }, brow: hit ? 1.3 : .5, pupil: hit ? 2.6 : 4 });
    const [hx, hy] = handF(P); hoe(hx, hy, hit ? -.6 : -1.4 + 1.1 * Math.max(0, sw), 1); pop(); },
  dig2(lt, D, u) { MODE = 'day'; GLOOM = .2; const o = u > .35; push(); camera(HX + 120, 2280, lerp(3.0, 3.6, ss(u))); yard('day'); jar(HX + 120, HY + 40, 1, { open: o, glowA: o ? .9 : 0 }); if (o) bellAt(HX + 200, HY + 30, 1.2, .2); pop(); },
  man1(lt, D, u) { MODE = 'day'; GLOOM = .2; push(); camera(330, 1880, lerp(1.9, 2.1, u)); yard('day'); person('man', { x: 330, y: GY - 236, face: 1, look: [.4, 0], brow: 1.1, mouth: { o: lip('MA') }, talk: lip('MA') > 0 || true }); pop(); },
  lanh1(lt, D, u) { MODE = 'day'; GLOOM = .2; push(); camera(620, 1880, lerp(1.9, 2.1, u)); yard('day'); const P = person('lanh', { x: 640, y: GY - 236, face: -1, look: [-.3, 0], armF: { h: [10, 120], bend: 10 }, armB: { h: [20, 120], bend: -10 }, mouth: { o: lip('LA'), sm: .4 } }); jar(P.x - 30, P.y - 40, .55); pop(); },
  hide(lt, D, u) { if (u < .5) { MODE = 'lamp'; GLOOM = .25; useSet('lamp'); push(); camera(700, 2000, 1.1); room(NOW, 'lamp'); lamp(NOW, 'lamp'); jar(lerp(700, 560, E(u, 0, .4)), 2280, .55); person('lanh', { x: 860, y: 2064, face: -1, lean: .3, armF: { h: [-60, 160], bend: 10 }, look: [-.5, .5] }); pop(); }
    else { MODE = 'day'; GLOOM = .25; push(); camera(lerp(900, 700, E(u, .5, 1)), 2000, 1.0); yard('day', { hole: true }); person('lanh', { x: lerp(1000, 400, E(u, .5, 1)), y: GY - 236, face: -1, walk: NOW * 6, look: [-.3, 0] }); pop(); } },
  na1(lt, D, u) { MODE = 'lamp'; GLOOM = .4; useSet('lamp'); push(); camera(lerp(760, 700, u), 1950, 1.05); room(NOW, 'lamp'); lamp(NOW, 'lamp'); person('na', { x: 640, y: 1960, face: -1, seat: 1, look: [-.6, .6], mouth: { o: Math.sin(NOW * 9) > .3 && Math.sin(NOW * .9) > 0 ? .4 : 0 } }); person('man', { x: 1120, y: 2064, face: -1, look: [-.6, .1] }); pop(); },
  na2(lt, D, u) { MODE = 'lamp'; GLOOM = .4; useSet('lamp'); push(); camera(660, 1740, lerp(2.4, 2.6, u)); room(NOW, 'lamp'); const P = person('na', { x: 640, y: 1960, face: 1, seat: 1, look: [.5, 0], mouth: { o: lip('NA'), sm: .5 }, armF: u > .6 ? { h: [90, 40], bend: 20 } : undefined }); if (u > .6) { const [hx, hy] = handF(P); bellAt(hx, hy + 10, .9, 1); } pop(); },
  bell(lt, D, u) { MODE = 'lamp'; GLOOM = .4; useSet('lamp'); if (u < .45) { push(); camera(720, 1880, 4.2); room(NOW, 'lamp'); const P = person('na', { x: 640, y: 1960, face: 1, seat: 1, armF: { h: [90, 40], bend: 20 } }); const [hx, hy] = handF(P); bellAt(hx, hy + 10, .9, 1.5); pop(); }
    else { push(); camera(1250, 1760, lerp(2.0, 2.4, E(u, .45, 1))); room(NOW, 'lamp'); person('man', { x: 1250, y: 2064, face: -1, look: [-.6, 0], brow: 1.4, pupil: 2.4 }); pop(); } },
  odd(lt, D, u) { useSet('lamp'); if (u < .45) { MODE = 'dim'; GLOOM = .5; push(); camera(560, 2180, 2.2); room(NOW, 'dim'); jar(560, 2290, .55, { glowA: .7 + .3 * Math.sin(NOW * 3) }); bellAt(640, 2240, .8, 2); pop(); }
    else { MODE = 'lamp'; GLOOM = .3; push(); camera(1290, 1660, lerp(2.6, 3.0, E(u, .45, 1))); room(NOW, 'lamp'); for (let k = 0; k < 5; k++) { push(); translate(1150 + k * 60, 1712); rotate(hash(k) - .5); hand(0, 0, -1.5, 16, '#3a2614'); pop(); } pop(); } },
  sick(lt, D, u) { MODE = 'dim'; GLOOM = .5; useSet('lamp'); push(); camera(640, u < .5 ? 1740 : 1900, 2.4); room(NOW, 'dim');
    if (u < .5) person('na', { x: 640, y: 1960, face: 1, seat: 1, sick: true, lid: .55, look: [0, .3] });
    else person('na', { x: 640, y: 2140, face: -1, seat: 1, sick: true, dirt: true, look: [-.2, .2], pupil: 2.6, brow: .2 });
    glow(560, 1100, 140, '150,170,220', .3); pop(); },
  tu(lt, D, u) { MODE = 'night'; GLOOM = .3; push(); camera(700, 2050, 1.0); trail(u); person('man', { x: lerp(300, 820, u), y: 2300 - 236 + lerp(0, -40, u), face: 1, walk: NOW * 6, cheekTear: true }); person('na', { x: lerp(200, 720, u), y: 2300 - 236 * .62, face: 1, walk: NOW * 6 + 1, sick: true }); fog(2100, .16); pop(); },
  tu1(lt, D, u) { MODE = 'lamp'; GLOOM = .35; push(); camera(lerp(720, 700, u), 1820, lerp(1.6, 1.8, u)); hut(); person('tu', { x: 700, y: 2064, face: 1, look: [.3, 0], mouth: { o: lip('TU') }, talk: true }); pop(); },
  tu2(lt, D, u) { MODE = 'lamp'; GLOOM = .4; push(); camera(720, 1740, lerp(2.2, 2.6, u)); hut(); person('tu', { x: 700, y: 2064, face: 1, look: [.1, 0], brow: 1.3, pupil: 2.6, mouth: { o: lip('TU') }, talk: true }); pop(); },
  tu3(lt, D, u) { MODE = 'lamp'; GLOOM = .35; push(); camera(u < .55 ? 760 : 700, u < .55 ? 1880 : 1740, u < .55 ? 1.5 : 2.3); hut(); person('tu', { x: 700, y: 2064, face: 1, look: [.4, 0], mouth: { o: lip('TU') }, talk: true, armF: u < .55 ? { h: [60, -140], bend: -20 } : undefined }); pop(); },
  miss(lt, D, u) { MODE = 'day'; GLOOM = .3; useSet('lamp'); push(); camera(u < .5 ? 1000 : 1100, 1820, u < .5 ? 2.0 : 1.2); room(NOW, 'lamp'); person('man', { x: 1000, y: 2064, face: 1, brow: 1.4, pupil: 2.4, look: [.3, 0] }); person('lanh', { x: 1380, y: 2064, face: -1, look: [-.2, .7], brow: 1.2 }); pop(); },
  earring(lt, D, u) { MODE = 'lamp'; GLOOM = .4; useSet('lamp'); if (u < .55) { push(); camera(1000, 1740, 2.3); room(NOW, 'lamp'); person('man', { x: 1000, y: 2064, face: 1, armF: { h: [70, -150], bend: -30 }, armB: { h: [-100, -140], bend: 30 }, cheekTear: true, lid: .3 }); pop(); }
    else { push(); camera(820, 2180, 3.2); room(NOW, 'lamp'); jar(820, 2290, .7, { open: true, glowA: .8 }); dot(800, 2120, 7, '#e8c040'); dot(840, 2126, 7, '#e8c040'); pop(); } },
  night(lt, D, u) { MODE = 'night'; GLOOM = .35; push(); camera(lerp(1000, 760, u), 2050, 1.0); yard('night'); const x = lerp(1250, 760, u);
    const P = person('lanh', { x, y: GY - 236, face: -1, walk: NOW * 5, armF: { h: [-10, 110], bend: 10 }, armB: { h: [-40, 110], bend: -10 } }); jar(x - 40, GY - 236 - 40, .5);
    person('man', { x: x + 260, y: GY - 236, face: -1, walk: NOW * 5 }); person('na', { x: x + 380, y: GY - 236 * .62, face: -1, walk: NOW * 5 + 1, sick: true }); fog(2150, .16); pop(); },
  call(lt, D, u) { MODE = 'night'; GLOOM = .4; if (u < .5) { push(); camera(620, 2080, 1.2); yard('night'); jar(HX + 230, HY + 10, .55); person('lanh', { x: HX + 330, y: GY - 236, face: -1, look: [-.6, .7], brow: 1.3 }); person('man', { x: 240, y: GY - 236, face: 1, look: [.5, .5] }); person('na', { x: 140, y: GY - 236 * .62, face: 1, sick: true }); pop(); }
    else { push(); camera(HX, HY - 40, 3.2); yard('night'); pop(); glow(W / 2, H / 2 + 120, 220, '120,255,160', .25 + .1 * Math.sin(NOW * 4)); } },
  gm(lt, D, u) { MODE = 'night'; GLOOM = .45; push(); camera(HX, HY - 40, lerp(3.2, 3.8, u)); yard('night'); pop(); glow(W / 2, H / 2 + 120, 240, '120,255,160', .3 + .15 * Math.sin(NOW * 3)); },
  nayes(lt, D, u) { MODE = 'night'; GLOOM = .35; const cov = u > .5; push(); camera(220, 1960, 2.2); yard('night'); person('man', { x: 260, y: GY - 236, face: 1, armF: cov ? { h: [-20, -10], bend: 30 } : undefined, brow: 1.4, pupil: 2.6 }); person('na', { x: 180, y: GY - 236 * .62, face: 1, mouth: { o: !cov && u > .2 ? .6 : 0 }, covered: cov, look: [.6, .4] }); pop(); },
  bell2(lt, D, u) { MODE = 'night'; GLOOM = .35; const st = u > .4; if (!st) { push(); camera(640, 2080, 1.2); yard('night'); const sw = Math.sin(NOW * 4); const P = person('lanh', { x: HX + 260, y: GY - 236, face: -1, armF: { h: [40 + 50 * sw, -60 + 150 * Math.max(0, sw)], bend: -20 } }); const [hx, hy] = handF(P); hoe(hx, hy, -1.4 + 1.1 * Math.max(0, sw), 1); person('na', { x: 160, y: GY - 236 * .62, face: 1, sick: true }); pop(); }
    else { push(); camera(170, 2150, 3.6); yard('night'); const P = person('na', { x: 160, y: GY - 236 * .62, face: 1, sick: true, armF: { h: [70, 60], bend: 10 }, armB: { h: [40, 60], bend: -10 }, brow: .2 }); const [hx, hy] = handF(P); bellAt(hx - 10, hy + 6, .8, .2); pop(); } },
  boy(lt, D, u) { MODE = 'night'; GLOOM = .45; const up = E(u, .3, .6); push(); camera(HX, lerp(2320, 2250, up), lerp(2.6, 2.2, up)); yard('night'); person('boy', { x: HX - 20, y: lerp(2560, 2420, up), face: 1, look: [.3, -.6], headTilt: lerp(.4, 0, up), armF: u > .6 ? { h: [90, -60], bend: -10 } : undefined }); holeLip('night'); pop(); },
  gb(lt, D, u) { MODE = 'night'; GLOOM = .45; push(); camera(HX + 20, 2210, lerp(2.6, 2.9, u)); yard('night'); person('boy', { x: HX - 20, y: 2420, face: 1, look: [.4, -.5], armF: { h: [90 + 10 * Math.sin(NOW * 2), -60], bend: -10 }, mouth: { o: lip('GB') } }); holeLip('night'); pop(); },
  pry(lt, D, u) { MODE = 'night'; GLOOM = .4; const drop = u > .45, grab = u > .6; push(); camera(420, 2180, 1.5); yard('night');
    person('boy', { x: HX - 20, y: 2430, face: -1, look: [-.6, -.3], armF: { h: [90, -40], bend: -10 } }); holeLip('night');
    const sink = grab ? 40 * E(u, .6, 1) : 0; person('man', { x: 330, y: GY - 196 + sink, face: 1, seat: 1, brow: grab ? 1.5 : 1.1, pupil: grab ? 2 : 3, armF: { h: [80, 40], bend: 10 }, mouth: { o: grab ? .7 : 0 } });
    if (!drop) bellAt(430, 2160, .8, 1); else bellAt(HX - 40, lerp(2200, 2400, E(u, .45, .6)), .8, 2);
    if (grab) { push(); translate(400, 2290 + sink); rotate(-.6); hand(0, 0, -.6, 26, '#93a892', { claw: true }); pop(); }
    pop(); if (grab && u < .75) RED = .25 * (1 - seg(u, .6, .75)); },
  pull(lt, D, u) { MODE = u > .8 ? 'dusk' : 'night'; GLOOM = .35; push(); camera(450, 2100, 1.3); yard('night', { filled: u > .6 });
    person('man', { x: 330, y: GY - 196, face: 1, seat: 1, brow: 1.4, cheekTear: true }); const P = person('lanh', { x: 140, y: GY - 236, face: 1, armF: { h: [150, 30], bend: 0 }, brow: 1.4 }); pop(); },
  let(lt, D, u) { MODE = 'dusk'; GLOOM = .3; push(); camera(470, 2230, lerp(3.2, 3.6, u)); yard('dusk', { filled: true }); person('man', { x: 330, y: GY - 196, face: 1, seat: 1, lid: .4 }); for (let k = 0; k < 5; k++) fillOnly(ell(458 + k * 11, 2268 + Math.abs(k - 2) * 4, 4, 13, 8), '#141018', { boil: .3 }); pop(); },
  end(lt, D, u) { MODE = 'day'; GLOOM = .2; useSet('lamp'); push(); camera(900, 1900, 1.0); room(NOW, 'lamp'); person('na', { x: lerp(500, 800, u), y: 2300 - 236 * .62, face: 1, walk: NOW * 4, smile: true, mouth: { o: 0, sm: .6 } }); person('man', { x: 1250, y: 2064, face: -1, look: [-.5, .2], lid: .3 }); pop(); },
  end2(lt, D, u) { MODE = 'dusk'; GLOOM = .3; push(); camera(lerp(760, 600, u), 2100, lerp(1.0, 1.4, u)); yard('dusk', { filled: true }); person('na', { x: HX + 40, y: HY - 120, face: -1, seat: 1, look: [-.4, .8] }); fog(2200, .12); pop(); },
  na3(lt, D, u) { MODE = 'dusk'; GLOOM = .35; push(); camera(HX + 60, 2120, lerp(2.6, 2.9, u)); yard('dusk', { filled: true }); person('na', { x: HX + 40, y: HY - 120, face: -1, seat: 1, look: [-.4, .9], mouth: { o: lip('NA') * .7 }, lid: .3 }); pop(); },
  cta(lt, D, u) { MODE = 'night'; GLOOM = .35; push(); camera(HX + 60, 2250, lerp(2.0, 2.3, u)); yard('night', { filled: true }); fog(2250, .16); pop(); glow(W / 2, H / 2 + 200, 160, '150,255,180', .2); },
};

// —— chữ ——
const WHO = { N: ['Người kể', '#e0a640'], MA: ['Mận', '#c47ab8'], LA: ['Lành', '#6a8ae0'], NA: ['Bé Na', '#f0a0b0'], TU: ['Thầy Tư', '#d8c070'], GM: ['???', '#7fc4a6'], GB: ['???', '#7fc4a6'] };
function wrap(text, maxW) { g.font = '800 50px "Head"'; const ws = text.split(' '), out = []; let cur = ''; for (const w of ws) { const s = cur ? cur + ' ' + w : w; if (g.measureText(s).width > maxW && cur) { out.push(cur); cur = w; } else cur = s; } if (cur) out.push(cur); return out; }
const SUB_Y = 1520;
function hud(t, k, lt) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (k !== 'title') for (const s of TL.subs) if (t >= s[0] && t < s[1]) {
    const lines = wrap(s[2].replace(/[“”]/g, ''), 920), [who, col] = WHO[s[3]] || WHO.N;
    g.save(); g.globalAlpha = Math.min(1, (t - s[0]) / .12, (s[1] - t) / .12);
    g.font = '600 34px "Semi"'; const pw = g.measureText(who).width + 36, py = SUB_Y - lines.length * 32 - 52;
    g.fillStyle = col; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.roundRect(W / 2 - pw / 2, py, pw, 48, 24); g.fill(); g.stroke();
    g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(who, W / 2, py + 26);
    g.font = '800 50px "Head"'; g.lineJoin = 'round';
    lines.forEach((l, i) => { const y = SUB_Y + (i - (lines.length - 1) / 2) * 62; g.lineWidth = 11; g.strokeStyle = INK; g.strokeText(l, W / 2, y); g.fillStyle = s[3].startsWith('G') ? '#c8ffd8' : '#ffffff'; g.fillText(l, W / 2, y); });
    g.restore();
  }
  if (k === 'title') { const a = ss(seg(lt, .1, .6)); g.save(); g.globalAlpha = a; g.textAlign = 'center'; g.lineJoin = 'round';
    for (const [s, y, sz] of [['THẦN', 640, 170], ['GIỮ CỦA', 820, 170]]) { g.font = `800 ${sz}px "Head"`; g.lineWidth = 18; g.strokeStyle = INK; g.strokeText(s, W / 2, y); g.fillStyle = '#e8402e'; g.fillText(s, W / 2, y); }
    g.font = '600 46px "Semi"'; g.lineWidth = 8; g.strokeText('Của ai chôn, người đó giữ', W / 2, 920); g.fillStyle = '#f0e4c8'; g.fillText('Của ai chôn, người đó giữ', W / 2, 920); g.restore(); }
  if (k === 'cta') { const a = ss(seg(lt, .1, .6)); g.save(); g.globalAlpha = a; g.textAlign = 'center'; g.lineJoin = 'round'; g.font = '800 74px "Head"'; g.lineWidth = 14; g.strokeStyle = INK; g.strokeText('BẠN CÓ DÁM MANG VỀ?', W / 2, 420); g.fillStyle = '#e8402e'; g.fillText('BẠN CÓ DÁM MANG VỀ?', W / 2, 420);
    g.font = '600 40px "Semi"'; g.lineWidth = 8; g.strokeText('Theo dõi @chuyendongtaykimco', W / 2, 500); g.fillStyle = '#fff'; g.fillText('Theo dõi @chuyendongtaykimco', W / 2, 500);
    g.globalAlpha = a * .55; g.font = '600 32px "Semi"'; g.fillStyle = '#d8d0c0'; g.fillText('Câu chuyện chỉ là hư cấu', W / 2, 1840); g.restore(); }
}
function impact() {
  fillOnly(rect(-50, -50, W + 100, H + 100), '#f2ece0', { boil: 0 });
  const cx = 540, cy = 900;
  for (let k = 0; k < 48; k++) { const a = k / 48 * TAU + hash(k + Math.floor(NOW * 24)) * .05, w = .02 + hash(k * 3) * .025; fillOnly([[cx + Math.cos(a) * 280, cy + Math.sin(a) * 280], [cx + Math.cos(a - w) * 2400, cy + Math.sin(a - w) * 2400], [cx + Math.cos(a + w) * 2400, cy + Math.sin(a + w) * 2400]], INK, { boil: .5 }); }
  const keep = { ...PAL.boy }; Object.assign(PAL.boy, { skinK: INK, skinKs: INK, shirtK: INK, shirtKs: INK, pants: INK, pantsS: INK, red: INK });
  push(); khoa({ ...CH.boy({}), x: cx - 20, y: cy + 330 * 1.7, s: 1.7, face: 1, t: NOW }); pop(); Object.assign(PAL.boy, keep);
}

function render(t) {
  NOW = t; frame(t); FX = []; GLOOM = .35; RED = 0;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  const sc = SC.find(s => t >= s[1] && t < s[2]) || SC[SC.length - 1]; const [k, a, b] = sc; const lt = t - a, D = b - a;
  const h2 = sAt('hook2'), tj = h2[1] + (h2[2] - h2[1]) * .04;
  useSet('lamp');
  if (t >= tj && t < tj + 2 / 24) impact();
  else {
    (SHOT[k] || SHOT.cta)(lt, D, lt / D);
    // không khí âm u: lớp phủ tối lạnh + viền tối; rồi mới vẽ những thứ phát sáng
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = `rgba(8,12,26,${GLOOM})`; g.fillRect(0, 0, W, H);
    const vg = g.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .72); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    drawFX();
    if (RED) { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = `rgba(150,0,0,${RED})`; g.fillRect(0, 0, W, H); }
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
  const d = Math.min(t - a, b - t); if (d < .1 && a > 0) { g.fillStyle = `rgba(0,0,0,${1 - d / .1})`; g.fillRect(0, 0, W, H); }
  if (t > DUR - 1.0) { g.fillStyle = `rgba(0,0,0,${seg(t, DUR - 1.0, DUR) * .9})`; g.fillRect(0, 0, W, H); }
  hud(t, k, lt);
}
window.render = render; window.DUR = DUR;
render(parseFloat(new URLSearchParams(location.search).get('t') ?? '3'));
window.READY = true;
