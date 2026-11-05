import { init, frame, push, pop, translate, scale, fillOnly, rect, ell, g, W, H, INK, S } from './toon.js';
import { fig, jar, bell, useSet, dimPal } from './chars.js';
const cv = document.getElementById('c'); init(cv); cv.width = 1920; cv.height = 1500;
await document.fonts.load('800 50px "Head"', 'ĐỨA');
const PALS = {
  man: { skin: '#e0a878', skinS: '#b27a52', hair: '#221a24', shirt: '#7a5a3a', shirtS: '#5a3f26', pants: '#26222c', pantsS: '#18151d' },
  woman: { skin: '#eab48a', skinS: '#bd845e', hair: '#1a1420', shirt: '#7a4a7e', shirtS: '#58325c', pants: '#221d28', pantsS: '#15121a' },
  girl: { skin: '#f0c098', skinS: '#c8906a', hair: '#1a1420', shirt: '#d0607a', shirtS: '#a04058', pants: '#3a3050', pantsS: '#26203a' },
  old: { skin: '#d8a880', skinS: '#a87a56', hair: '#e8e4dc', shirt: '#5a3e28', shirtS: '#3e2a1a', pants: '#2a2420', pantsS: '#1a1612' },
  boy: { skin: '#a8bca8', skinS: '#7a8e7a', hair: '#0c0c10', shirt: '#a8bca8', shirtS: '#7a8e7a', pants: '#3a2a20', pantsS: '#26180f' },
};
const ROWS = [
  { name: 'A. Toon gốc — đầu to, mắt to tròn, màu tươi', o: {}, dim: 0, bg: '#2a2230' },
  { name: 'B. Toon u ám — màu tái lạnh, mắt thâm quầng, ánh trăng', o: { lid: .32, brow: 1.1, bags: true }, dim: .38, bg: '#121626' },
  { name: 'C. Toon tỉ lệ thật — đầu nhỏ, mắt nhỏ, nét nghiêm', o: { hs: .78, eyeS: .62, lid: .2 }, dim: .22, bg: '#1e1a24' },
];
const CAST = [['man', 'Lành'], ['woman', 'Mận'], ['girl', 'Bé Na'], ['old', 'Thầy Tư'], ['boy', 'Thần giữ của']];
const MODE = new URLSearchParams(location.search).get('m') || 'body';
window.draw = () => {
  frame(1.0); S.amp = 1.4;
  g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#0a0a0e'; g.fillRect(0, 0, 1920, 1500);
  useSet('lamp');
  ROWS.forEach((r, ri) => {
    const y0 = ri * 500;
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = r.bg; g.fillRect(0, y0 + 4, 1920, 492);
    CAST.forEach(([k, label], ci) => {
      const x = 200 + ci * 380, pal = r.dim ? dimPal(PALS[k], r.dim, [24, 30, 56]) : PALS[k];
      const face = MODE === 'face'; const P = Object.assign({ kind: k, pal, x: face ? x - 40 : x, y: face ? y0 + 950 : y0 + 330, s: face ? 2.1 : .5, face: 1, t: 1, look: [.2, 0], armF: { h: [10, 150], bend: 14 }, armB: { h: [-6, 150], bend: -14 } }, r.o);
      if (k === 'boy') Object.assign(P, { armF: { h: [80, -40], bend: 20 }, mouth: { o: .25 } });
      if (face && k === 'girl') P.y = y0 + 700; else if (face && k === 'boy') P.y = y0 + 690; else if (k === 'girl') P.y = y0 + 400; else if (k === 'boy') P.y = y0 + 395;
      if (face) { g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.beginPath(); g.rect(x - 160, y0 + 60, 360, 390); g.clip(); }
      if (k === 'old') P.brow = .2;
      fig(P); if (face) g.restore();
      if (!face && k === 'man' && ri === 0) jar(x + 110, y0 + 450, .45, {});
      if (!face && k === 'girl' && ri === 0) bell(x + 60, y0 + 330, .8, 1, 0);
      g.setTransform(1, 0, 0, 1, 0, 0); g.font = '800 30px "Head"'; g.textAlign = 'center'; g.fillStyle = '#f0e8d8'; g.fillText(label, x + 20, y0 + 480);
    });
    g.setTransform(1, 0, 0, 1, 0, 0); g.font = '800 34px "Head"'; g.textAlign = 'left'; g.fillStyle = '#ffd060'; g.fillText(r.name, 24, y0 + 46);
  });
};
draw(); window.READY = true;
