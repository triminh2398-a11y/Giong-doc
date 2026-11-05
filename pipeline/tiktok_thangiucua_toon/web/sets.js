// Sets (flat colour, boiling outlines): the room and the outside of the house. World units; the camera is applied by the caller.
import { lerp, hash, TAU } from './core/lib.js';
import { INK, push, pop, translate, rotate, scale, shape, fillOnly, stroke, ell, arc, spline, rr, rect, noodle, quad, dot, bands, g } from './toon.js';

export const ROOM = { w: 1700, h: 3000, floor: 2300, lamp: [150, 1790], bed: [260, 1060, 1960], win: [380, 1180, 620, 1460], beamY: 980 };
export const RS = {
  lamp: { roof: '#1e1218', beam: '#4a2e1e', beamS: '#2e1c12', wall: '#b07c48', wallS: '#86582f', wall2: '#6a4222', floor: '#5a3a26', floorS: '#3e2618', win: '#1c2656', winS: '#121a40', wood: '#8a5a30', woodS: '#5e3a1c', cloth: '#9a2a24', clothS: '#6a1a16', glow: 'rgba(255,190,90,.22)', glow2: 'rgba(255,170,70,.14)' },
  flash: { roof: '#0e1236', beam: '#2a3478', beamS: '#1a2058', wall: '#c8d6ff', wallS: '#7f90d0', wall2: '#5262a8', floor: '#6a78b8', floorS: '#3e4a88', win: '#ffffff', winS: '#c8d8ff', wood: '#8a9ad8', woodS: '#4e5ca0', cloth: '#7a6ab8', clothS: '#4a4288', glow: 'rgba(255,255,255,0)', glow2: 'rgba(255,255,255,0)' },
  dim: { roof: '#06050c', beam: '#141020', beamS: '#0a0812', wall: '#2a2638', wallS: '#1c1a28', wall2: '#141220', floor: '#16121e', floorS: '#0e0c14', win: '#121a3a', winS: '#0a1028', wood: '#221a24', woodS: '#140e16', cloth: '#2a1420', clothS: '#1a0c14', glow: 'rgba(0,0,0,0)', glow2: 'rgba(0,0,0,0)' },
};

export function room(t, set, opt = {}) {
  const R = RS[set], { w, h, floor } = ROOM;
  fillOnly(rect(-200, -200, w + 400, 1000 + 200), R.roof, { boil: 0 });
  // wall with hard shadow shapes away from the lamp
  shape(rect(-40, 960, w + 80, floor - 960), { fill: R.wall, lw: 6, shade: () => {
    fillOnly(spline([[700, 940], [w + 100, 940], [w + 100, floor + 10], [1100, floor + 10], [900, 1500]]), R.wallS, { boil: .5 });
    fillOnly(spline([[1300, 940], [w + 100, 940], [w + 100, floor + 10], [1500, floor + 10]]), R.wall2, { boil: .5 });
    for (let k = 0; k < 9; k++) { const x = hash(k * 3.1) * w, y = 1050 + hash(k * 7.7) * 1100; stroke(spline([[x, y], [x + 14, y + 40], [x - 6, y + 80], [x + 10, y + 120]], false), 3, { line: R.wallS }); }
  } });
  // posts and beams
  for (const x of [40, 1660]) shape(rect(x - 30, 960, 60, floor - 960), { fill: R.beam, lw: 6, shade: () => fillOnly(rect(x + 8, 960, 30, floor), R.beamS, { boil: .3 }) });
  for (let k = 0; k < 6; k++) { const x = -100 + k * 380; shape(noodle([x, 0], [x + 360, 960], 0, 40, 40), { fill: R.beam, lw: 6 }); }
  shape(rect(-60, ROOM.beamY - 30, w + 120, 60), { fill: R.beam, lw: 6, shade: () => fillOnly(rect(-60, ROOM.beamY + 10, w + 120, 30), R.beamS, { boil: .3 }) });
  // window with bars, rain outside
  const [x0, y0, x1, y1] = ROOM.win;
  shape(rect(x0, y0, x1 - x0, y1 - y0), { fill: R.win, lw: 8, shade: () => {
    if (set !== 'flash') for (let k = 0; k < 14; k++) { const ph = (t * 3 + hash(k)) % 1, xx = x0 + hash(k * 5) * (x1 - x0), yy = y0 + ph * (y1 - y0); stroke([[xx, yy], [xx - 6, yy + 34]], 3, { line: '#5a6ab0', boil: 0 }); }
    for (let k = 0; k < 3; k++) fillOnly(rect(x0 + 20 + k * 80, y0, 16, y1 - y0), R.winS, { boil: .3 });
  } });
  for (let k = 1; k < 4; k++) shape(rect(x0 + k * (x1 - x0) / 4 - 8, y0, 16, y1 - y0), { fill: R.wood, lw: 5 });
  // altar: table, cloth, portrait, incense
  shape(rect(1040, 1700, 480, 34), { fill: R.wood, lw: 6 });
  for (const x of [1060, 1480]) shape(rect(x, 1734, 28, floor - 1734), { fill: R.woodS, lw: 6 });
  shape(spline([[1100, 1734], [1460, 1734], [1440, 1880], [1120, 1880]]), { fill: R.cloth, lw: 6, shade: () => fillOnly(rect(1100, 1840, 400, 60), R.clothS, { boil: .3 }) });
  shape(rect(1190, 1380, 200, 260), { fill: R.woodS, lw: 7, shade: () => { fillOnly(rect(1214, 1404, 152, 212), set === 'flash' ? '#9aa8e0' : '#3a3036', { boil: .3 }); fillOnly(ell(1290, 1480, 40, 50, 20), set === 'flash' ? '#7a88c8' : '#2a2228', { boil: .3 }); fillOnly(spline([[1230, 1616], [1250, 1550], [1330, 1550], [1350, 1616]]), set === 'flash' ? '#7a88c8' : '#2a2228', { boil: .3 }); } });
  shape(spline([[1260, 1660], [1320, 1660], [1312, 1700], [1268, 1700]]), { fill: '#c89a48', lw: 5 });
  for (let k = 0; k < 3; k++) { const x = 1276 + k * 14; stroke([[x, 1660], [x + (k - 1) * 8, 1560]], 3); if (set !== 'dim') dot(x + (k - 1) * 8, 1558, 4, '#ff8a3a'); }
  for (const x of [1110, 1450]) shape(rect(x, 1610, 22, 90), { fill: '#e8dcc0', lw: 5 });
  // floor
  shape(rect(-60, floor, w + 120, h - floor + 60), { fill: R.floor, lw: 6, shade: () => { for (let k = 0; k < 6; k++) stroke([[-60, floor + 60 + k * 90], [w + 60, floor + 50 + k * 92]], 3, { line: R.floorS }); } });
  // the bamboo bed
  const [bx0, bx1, by] = ROOM.bed;
  fillOnly(ell((bx0 + bx1) / 2 + 60, floor + 20, (bx1 - bx0) * .6, 30, 30), R.floorS, { boil: .3 });
  for (const x of [bx0 + 20, bx1 - 50]) shape(rect(x, by + 40, 34, floor - by - 30), { fill: R.wood, lw: 6 });
  shape(rect(bx0, by, bx1 - bx0, 50), { fill: R.wood, lw: 7, shade: () => { for (let x = bx0 + 30; x < bx1; x += 44) stroke([[x, by + 4], [x, by + 46]], 3, { line: R.woodS }); } });
  // lamp table + Khoa's stool
  const [lx, ly] = ROOM.lamp;
  shape(rect(lx - 90, ly + 110, 180, 26), { fill: R.wood, lw: 6 });
  for (const x of [lx - 80, lx + 56]) shape(rect(x, ly + 136, 24, floor - ly - 136), { fill: R.woodS, lw: 6 });
  shape(rect(1300, 2080, 190, 24), { fill: R.wood, lw: 6 }); for (const x of [1310, 1460]) shape(rect(x, 2104, 22, floor - 2104), { fill: R.woodS, lw: 6 });
}
// the oil lamp — with the cat's eyes, the only glowing thing (flat translucent rings, never a gradient)
export function lamp(t, set, { alive = 1, bend = 0 } = {}) {
  const [x, y] = ROOM.lamp;
  if (alive > 0 && set !== 'dim') { const fl = 1 + .04 * Math.sin(t * 23); for (const [r, a] of [[260, .16], [150, .22]]) fillOnly(ell(x, y - 10, r * fl, r * fl, 40), `rgba(255,180,80,${a * alive})`, { boil: .4 }); }
  shape(spline([[x - 44, y + 110], [x + 44, y + 110], [x + 30, y + 70], [x - 30, y + 70]]), { fill: '#c08a3a', lw: 6 });
  shape(spline([[x - 22, y + 70], [x + 22, y + 70], [x + 26, y + 30], [x - 26, y + 30]]), { fill: '#d8a848', lw: 6 });
  if (alive > 0) {
    const h = (56 + 6 * Math.sin(t * 31)) * alive, tip = bend * 20;
    shape(spline([[x - 10, y + 28], [x + 10, y + 28], [x + 8 + tip * .5, y - h * .5], [x + tip, y - h], [x - 8 + tip * .5, y - h * .5]]), { fill: '#ffd060', lw: 5, shade: () => fillOnly(ell(x, y + 14, 6, 14, 10), '#ffffff', { boil: .2 }) });
  }
  shape(spline([[x - 20, y + 30], [x - 30, y - 10], [x - 18, y - 74], [x + 18, y - 74], [x + 30, y - 10], [x + 20, y + 30]]), { fill: 'rgba(220,235,255,.18)', lw: 4 });
}

// —— outside ——
export const EXT = { w: 1400, h: 3000, ground: 2300, roofCat: [930, 1450] };
export function outside(t, flash) {
  const { w, h, ground } = EXT;
  bands(flash ? ['#9ab0ff', '#b8c8ff', '#d8e2ff', '#eef2ff'] : ['#0a0a22', '#121436', '#1a1e48', '#242a5a'], -200, ground, -200, w + 200);
  // bamboo grove (flat silhouettes)
  for (let k = 0; k < 16; k++) { const x = hash(k * 2.7) * w, top = 900 + hash(k * 4.1) * 500; shape(noodle([x, ground], [x + (hash(k) - .5) * 200, top], (hash(k * 9) - .5) * 60, 22, 14), { fill: flash ? '#3a4a8a' : '#0c1028', lw: 5 });
    for (let j = 0; j < 4; j++) { const yy = top + j * 70, xx = x + (hash(k * 11 + j) - .5) * 220; shape(ell(xx, yy, 60, 14, 14), { fill: flash ? '#3a4a8a' : '#0c1028', lw: 4 }); } }
  // house
  const hx0 = 200, hx1 = 1200, eave = 1780, ridge = 1430;
  shape(rect(hx0 + 60, eave, hx1 - hx0 - 120, ground - eave), { fill: flash ? '#8a96c8' : '#3a3046', lw: 7, shade: () => fillOnly(rect(hx1 - 300, eave, 300, ground), flash ? '#5a66a0' : '#2a2234', { boil: .3 }) });
  shape(spline([[hx0 - 70, eave + 40], [(hx0 + hx1) / 2, ridge], [hx1 + 70, eave + 40], [hx1 + 30, eave + 70], [hx0 - 30, eave + 70]]), { fill: flash ? '#6a5aa8' : '#4a2a32', lw: 8, shade: () => {
    for (let k = 0; k < 16; k++) { const x = hx0 - 70 + k * 80; stroke([[x, eave + 70], [(hx0 + hx1) / 2 + (x - (hx0 + hx1) / 2) * .15, ridge + 20]], 4, { line: flash ? '#4a3a88' : '#2e1a20' }); } } });
  const wx = 760, wy = 1960;
  if (!flash) for (const [r, a] of [[220, .14], [140, .22]]) fillOnly(ell(wx + 100, wy + 90, r, r, 36), `rgba(255,190,90,${a})`, { boil: .4 });
  shape(rect(wx, wy, 200, 180), { fill: '#ffc85a', lw: 8, shade: () => { for (let k = 1; k < 4; k++) fillOnly(rect(wx + k * 50 - 6, wy, 12, 180), '#3a2214', { boil: .3 }); } });
  shape(rect(400, 2020, 170, ground - 2020), { fill: flash ? '#4a4a88' : '#1e1418', lw: 7 });
  // wet yard + reflection of the window
  shape(rect(-100, ground, w + 200, h - ground + 100), { fill: flash ? '#7a88c8' : '#101430', lw: 6, shade: () => {
    if (!flash) fillOnly(rect(wx + 10, ground + 40, 180, 140), 'rgba(255,200,90,.35)', { boil: .6 });
    for (let k = 0; k < 6; k++) stroke([[-100, ground + 60 + k * 100], [w + 100, ground + 60 + k * 100]], 3, { line: flash ? '#5a66a0' : '#1c2250' });
  } });
}
// rain on ones, screen space
export function rain(t, n = 160, col = 'rgba(170,190,255,.55)') {
  g.setTransform(1, 0, 0, 1, 0, 0); g.strokeStyle = col; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath();
  const f = Math.floor(t * 24);
  for (let i = 0; i < n; i++) { const x = hash(i * 1.3 + f * .17) * 1240 - 80, y = hash(i * 7.1 + f * .31) * 1920; g.moveTo(x, y); g.lineTo(x - 10, y + 46); }
  g.stroke();
}
