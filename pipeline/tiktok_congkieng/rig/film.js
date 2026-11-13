// "Cổng làng treo dao gỗ" — full episode, drawn frame by frame from window.TL (line timings) and window.CAPS (captions).
const U = (k, t) => { const [a, b] = TL[k]; return clamp((t - a) / (b - a)); };
const at = t => { for (const k in TL) { const [a, b] = TL[k]; if (t >= a && t < b) return k; } return 'cta'; };
const idle = (t, seed = 1) => ({ bob: 1.4 * Math.sin(t * 2.2 + seed), head: 2 * Math.sin(t * .9 + seed * 2) + 1.2 * Math.sin(t * 2.1 + seed), brR: Math.sin(t * 2.2 + seed) });
const blinkAt = (t, seed = 1) => { const per = 2.6 + (seed % 3) * .5, ph = (t + seed * .7) % per; return ph < .1 ? 1 : 0; };
const talk = (t, on) => on ? Math.abs(Math.sin(t * 13)) * .85 : 0;
const speaking = (k, t) => { const [a, b] = TL[k]; return t > a + .15 && t < b - .4; };
// walking gait (same as the approved rig: heel kick, knee lift, elbows ~90)
function gaitPose(ph, w) {
  const leg = p => { const u = ((p / (2 * Math.PI)) % 1 + 1) % 1, th = 18 * Math.sin(2 * Math.PI * u), sp = ((u - .75) % 1 + 1) % 1, sw = sp < .5 ? sp / .5 : -1;
    const knee = sw >= 0 ? -105 * Math.sin(Math.PI * Math.pow(sw, .6)) - 6 : -4 - 6 * Math.sin(Math.PI * (sp - .5) / .5), foot = sw >= 0 ? (sw < .7 ? 22 * Math.sin(Math.PI * sw / .7) : -14 * Math.sin(Math.PI * (sw - .7) / .3)) : 0; return [th * w, knee * w - 4 * (1 - w), foot * w]; };
  const arm = p => [-26 * Math.sin(p) * w - 4, 82 * w + 16 * (1 - w)];
  const s = Math.sin(ph); return { legF: leg(ph), legB: leg(ph + Math.PI), armB: arm(ph), armF: arm(ph + Math.PI), bob: 5 * s * s * w, lean: 6 * w };
}
// camera: world drawn through a scale+translate around a focus point
function cam(fx, fy, z, sh = 0) { g.setTransform(z, 0, 0, z, W / 2 - fx * z + sh, H / 2 - fy * z + sh * .5); }
function vignette(a = .55) { g.setTransform(1, 0, 0, 1, 0, 0); const v = g.createRadialGradient(W / 2, H * .5, H * .25, W / 2, H * .5, H * .78); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,10,${a})`); g.fillStyle = v; g.fillRect(0, 0, W, H); }
function tint(c, a) { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = c; g.globalAlpha = a; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
const P0 = { ...P };
// the dead old man: same rig as the living, pale, white eyes when revealed; drawn on a layer at 70%
function ghostMan(x, y, sc, ex, alpha = .7) { const L = ghostMan.L || (ghostMan.L = document.createElement('canvas')); L.width = W; L.height = H; const lc = L.getContext('2d'); lc.setTransform(g.getTransform()); const keep = g; g = lc;
  castMember('ong', x, y, sc, ex); g = keep; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = alpha; g.drawImage(L, 0, 0); g.restore(); }
function whiteEyes(cx, cy, r) { for (const s of [-1, 1]) { g.fillStyle = '#e9ece8'; g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.ellipse(cx + s * r * 1.3, cy, r * .62, r * .74, 0, 0, 7); g.fill(); g.stroke(); } }
// interiors -----------------------------------------------------------------
function roomBG(t, lamp = .0) { g.fillStyle = '#1a1c26'; g.fillRect(-200, -200, W + 400, H + 400); g.fillStyle = '#23263a'; g.fillRect(-200, 0, W + 400, 860); // wall
  g.fillStyle = '#2b2a30'; g.fillRect(-200, 860, W + 400, 600); // floor
  // window with the mountains at night
  g.save(); g.translate(470, 330); g.fillStyle = '#0b1020'; g.fillRect(-120, -150, 240, 260); g.save(); g.beginPath(); g.rect(-120, -150, 240, 260); g.clip(); g.fillStyle = '#18213a'; g.beginPath(); g.moveTo(-130, 110); for (let x = -130; x <= 130; x += 20) g.lineTo(x, 20 - 40 * Math.sin(x * .02 + 1)); g.lineTo(130, 110); g.closePath(); g.fill(); g.restore();
  g.strokeStyle = '#4a4036'; g.lineWidth = 10; g.strokeRect(-120, -150, 240, 260); g.beginPath(); g.moveTo(0, -150); g.lineTo(0, 110); g.stroke(); g.restore();
  for (const [bx, w] of [[150, 260], [560, 260]]) { g.fillStyle = '#3c3a44'; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.roundRect(bx - w / 2, 880, w, 70, 8); g.fill(); g.stroke(); g.fillStyle = '#b8b2a6'; g.beginPath(); g.roundRect(bx - w / 2 + 6, 860, w - 12, 34, 10); g.fill(); g.stroke(); }
  if (lamp > 0) { const p = g.createRadialGradient(150, 820, 10, 150, 820, 300); p.addColorStop(0, `rgba(170,200,255,${.35 * lamp})`); p.addColorStop(1, 'rgba(170,200,255,0)'); g.fillStyle = p; g.fillRect(-200, 500, 700, 700); } }
// the photo on Vũ's phone: a miniature of the gate shot, the old man state changes
function photo(state, t) { // state: 'normal' | 'turned' | 'gone' — the gate shot Vũ took, framed on Khang and the old man
  g.save(); g.beginPath(); g.roundRect(-200, -350, 400, 700, 10); g.clip(); g.translate(-420, -900); highlandBG(2, 'dusk'); villageGate(380, 900, 2, 0);
  castMember('khang', 390, 1100, .78, { view: 'back' });
  if (state !== 'gone') castMember('ong', 480, 1100, .74, state === 'turned' ? { view: 'front', faceDir: 0, dead: true, head: 0, blink: 0, armF: [150, 40], bend: 4, lean: 0 } : { view: 'side', flip: -1, bend: 12, lean: 6, armF: [150, 40] });
  if (state === 'gone') { const sy = 1100 - 1.35 * .78 * 150, a = t > BEAT.end ? .8 : .45; g.save(); g.translate(450, sy + 10); g.rotate(.25); g.fillStyle = `rgba(35,30,40,${a})`; // five finger marks + palm on the shoulder
    for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(-12 + k * 8, 4 + Math.abs(k - 1.5) * 3, 3.2, 12, (k - 1.5) * .12, 0, 7); g.fill(); } g.beginPath(); g.ellipse(-22, 18, 3.2, 9, -.9, 0, 7); g.fill(); g.beginPath(); g.ellipse(0, 20, 12, 9, 0, 0, 7); g.fill(); g.restore(); }
  g.fillStyle = 'rgba(255,240,220,.06)'; g.fillRect(0, 0, 2000, 2000); g.restore(); }
function phoneShot(state, t, glow = 1) { g.fillStyle = '#05060a'; g.fillRect(-600, -600, W + 1200, H + 1200);
  g.save(); g.translate(W / 2, H * .46); g.rotate(-.02 + .008 * Math.sin(t * .8)); g.fillStyle = '#111'; g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.roundRect(-222, -380, 444, 760, 40); g.fill(); g.stroke(); photo(state, t);
  g.fillStyle = P0.skinD; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.roundRect(-250, 150, 70, 120, 34); g.fill(); g.stroke(); g.beginPath(); g.roundRect(180, 170, 70, 110, 34); g.fill(); g.stroke(); g.restore();
  const p = g.createRadialGradient(W / 2, H * .46, 50, W / 2, H * .46, 600); p.addColorStop(0, `rgba(150,180,255,${.12 * glow})`); p.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = p; g.fillRect(-600, -600, W + 1200, H + 1200); }
// captions + title -------------------------------------------------------------
function captions(t) { g.setTransform(1, 0, 0, 1, 0, 0); const c = CAPS.find(c => t >= c[0] && t < c[1]); if (!c) return;
  const dlg = c[3] !== 'N'; g.font = `900 ${dlg ? 50 : 54}px "DejaVu Sans"`; g.textAlign = 'center'; g.lineJoin = 'round'; const y = H * .7; const words = c[2]; let lines = [words]; if (g.measureText(words).width > W - 70) { const w = words.split(' '), h = Math.ceil(w.length / 2); lines = [w.slice(0, h).join(' '), w.slice(h).join(' ')]; }
  lines.forEach((s, i) => { g.lineWidth = 13; g.strokeStyle = '#000'; g.strokeText(s, W / 2, y + i * 62); g.fillStyle = dlg ? '#ffe28a' : '#ffffff'; g.fillText(s, W / 2, y + i * 62); }); }
function titleCard(t) { const u = U('title', t); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = `rgba(0,0,0,${.45 * Math.min(1, u * 5)})`; g.fillRect(0, 0, W, H);
  const s = 1 + .08 * (1 - sm(Math.min(1, u * 4))); g.save(); g.translate(W / 2, H * .45); g.scale(s, s); g.textAlign = 'center'; g.lineJoin = 'round';
  g.font = '900 76px "DejaVu Serif"'; for (const [txt, y] of [['CỔNG LÀNG', -40], ['TREO DAO GỖ', 50]]) { g.lineWidth = 14; g.strokeStyle = '#000'; g.strokeText(txt, 0, y); g.fillStyle = '#e8d6a8'; g.fillText(txt, 0, y); }
  g.restore(); }
// ------------------------------------------------------------------------------------------------
const C = (who, x, y, sc, ex = {}, t = 0, seed = 1) => { const id = idle(t, seed); castMember(who, x, y, sc, { bob: id.bob, head: (ex.head || 0) + id.head, blink: blinkAt(t, seed), ...ex, head: (ex.head || 0) + id.head }); };
window.draw = (t) => {
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); const k = at(t);
  if (k === 'hook' || k === 'title') { // night: gate in the wind, slow push; at the beat an old man is suddenly sitting there, white eyes
    const u = U('hook', t), z = lerp(.95, 1.35, sm(Math.min(1, (t - TL.hook[0]) / (TL.hook[1] - TL.hook[0])))) + (k === 'title' ? .05 * U('title', t) : 0);
    g.setTransform(1, 0, 0, 1, 0, 0); cam(380, 760, 1); highlandBG(t, 'night'); cam(380, lerp(760, 720, u), z); villageGate(380, 900, t, 1.6); rain(t, .25);
    if (t > BEAT.hook) { const a = Math.min(1, (t - BEAT.hook) * 6); g.fillStyle = '#5a5a5e'; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.ellipse(560, 902, 34, 14, 0, 0, 7); g.fill(); g.stroke();
      ghostMan(560, 896 + 52, .55, { view: 'front', faceDir: 0, legsFront: true, legF: [150, -150, 0], legB: [140, -146, 0], lean: -6, armF: [80, 70], armB: [76, 76], blink: 0, dead: true }, .7 * a); }
    tint('#0a1030', .25); vignette(.65); if (t > BEAT.hook && t < BEAT.hook + .08) tint('#ffffff', .35);
    if (k === 'title') titleCard(t); captions(t); return; }
  if (k === 's1' || k === 's2') { // the custom: dusk, the bản behind the gate, push to the hanging knives; then the shaman with smoke
    const u = k === 's1' ? U('s1', t) : U('s2', t);
    cam(380, 760, 1); highlandBG(t, 'dusk');
    if (k === 's1') { cam(380, lerp(780, 640, sm(u)), lerp(1, 1.9, sm(u))); villageGate(380, 900, t, 1); rain(t, .3); }
    else { cam(400, 760, 1.15); villageGate(380, 900, t, 1); C('thay', 380, 1060, .62, { view: 'front', faceDir: 0, armF: [70 + 30 * Math.sin(t * 2), 60], armB: [70 + 30 * Math.sin(t * 2 + 1), 60], mouth: Math.abs(Math.sin(t * 6)) * .4 }, t, 3);
      for (let i = 0; i < 6; i++) { const ph = (t * .4 + i / 6) % 1; g.fillStyle = `rgba(210,210,220,${.25 * (1 - ph)})`; g.beginPath(); g.ellipse(330 + Math.sin(ph * 6 + i) * 20, 1000 - ph * 260, 20 + ph * 50, 12 + ph * 30, 0, 0, 7); g.fill(); } rain(t, .25); }
    tint('#1a2030', .18); vignette(); captions(t); return; }
  if (['s3', 'O1', 's4', 'D1'].includes(k)) { // the arrival at the gate
    if (k === 's3') { const u = U('s3', t), ride = sm(clamp(u / .45)); cam(380, 900, 1); highlandBG(t, 'dusk'); cam(lerp(300, 380, ride), 900, .92); villageGate(380, 900, t, 1);
      g.fillStyle = '#5a5a5e'; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.ellipse(565, 902, 34, 14, 0, 0, 7); g.fill(); g.stroke();
      C('ong', 560, 948, .55, { view: 'side', flip: -1, legsFront: true, legF: [150, -150, 0], legB: [140, -146, 0], lean: -8, armF: u > .8 ? [150 + 20 * Math.sin(t * 8), 50] : [96, 76], armB: [90, 76], bend: 10 }, t, 5);
      const bx = lerp(-260, 140, ride), bump = (1 - ride) * 3 * Math.sin(t * 30);
      motorbike(bx, 1060 + bump, .8, 1, '#7a2a20'); C('khang', bx - 10, 1000 + bump, .66, { view: 'side', legF: [70, -70, 0], legB: [64, -66, 0], armF: [100, 30], armB: [96, 34], lean: 6 }, t, 1);
      motorbike(bx - 230, 1110 + bump, .8, 1, '#2a4a6a'); C('vu', bx - 236, 1050 + bump, .66, { view: 'side', legF: [70, -70, 0], legB: [64, -66, 0], armF: [100, 30], armB: [96, 34], lean: 6 }, t, 2); C('duy', bx - 290, 1040 + bump, .6, { view: 'side', legF: [70, -70, 0], legB: [64, -66, 0], armF: [40, 60], armB: [30, 60], lean: 4 }, t, 4);
      rain(t, .3); tint('#1a2030', .15); vignette(); captions(t); return; }
    if (k === 'O1') { const u = U('O1', t); cam(380, 760, 1); highlandBG(t, 'dusk'); cam(560, 760, lerp(2.0, 2.2, u)); villageGate(380, 900, t, 1);
      g.fillStyle = '#5a5a5e'; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.ellipse(565, 902, 34, 14, 0, 0, 7); g.fill(); g.stroke();
      C('ong', 560, 948, .55, { view: 'front', faceDir: 0, legsFront: true, legF: [150, -150, 0], legB: [140, -146, 0], lean: -6, armF: [150 + 25 * Math.sin(t * 7), 50], armB: [76, 76], mouth: talk(t, speaking('O1', t)) }, t, 5);
      rain(t, .3); tint('#1a2030', .15); vignette(); captions(t); return; }
    if (k === 's4') { // Khang walks over the rope (back view), the old man rises and lays a hand on his shoulder; Vũ (side) takes the photo, flash
      const u = U('s4', t), wk = clamp(u / .4), ph = wk * 4 * Math.PI, gp = gaitPose(ph, wk < 1 ? 1 : 0);
      cam(380, 760, 1); highlandBG(t, 'dusk'); cam(380, 820, 1.05); villageGate(380, 900, t, 1);
      const kx = 380, ky = lerp(1150, 960, sm(wk)), ksc = lerp(.72, .6, sm(wk));
      const up = sm(clamp((u - .35) / .25)); const ox = lerp(560, 450, up);
      if (up < .5) { g.fillStyle = '#5a5a5e'; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.ellipse(565, 902, 34, 14, 0, 0, 7); g.fill(); g.stroke(); }
      C('ong', ox, lerp(948, 960, up), lerp(.55, .58, up), up < .5 ? { view: 'side', flip: -1, legsFront: true, legF: [150, -150, 0], legB: [140, -146, 0], lean: -8 } : { view: 'side', flip: -1, bend: 12, lean: 6, armF: [150 * sm(clamp((u - .55) / .15)), 40] }, t, 5);
      C('khang', kx, ky, ksc, { view: 'back', ...gp, head: 0 }, t, 1);
      C('vu', 120, 1230, .82, { view: 'side', faceDir: 1, armF: [110, 60], armB: [100, 70] }, t, 2); g.fillStyle = '#111'; g.fillRect(205, 1018, 22, 36);
      rain(t, .3); tint('#1a2030', .15); vignette(); if (u > .93 && u < .97) tint('#ffffff', .7); captions(t); return; }
    if (k === 'D1') { const u = U('D1', t); cam(380, 760, 1); highlandBG(t, 'dusk'); cam(360, 980, 1.7); villageGate(380, 900, t, 1);
      C('duy', 300, 1160, .8, { view: 'three', faceDir: .3, look: .6, brow: 16, armF: [110, 10], armB: [-10, 20], mouth: talk(t, speaking('D1', t)) + .2 }, t, 4);
      rain(t, .3); tint('#1a2030', .15); vignette(); captions(t); return; } }
  if (k === 's5') { // they ride off; Vũ looks back; cut to the empty gate
    const u = U('s5', t);
    if (u < .55) { const r = sm(u / .55); cam(380, 900, 1); highlandBG(t, 'dusk'); cam(380 + r * 120, 900, .95); villageGate(380, 900, t, 1); const bx = lerp(200, 820, r);
      motorbike(bx, 1080, .8, 1, '#7a2a20'); C('khang', bx - 10, 1020, .66, { view: 'side', legF: [70, -70, 0], legB: [64, -66, 0], armF: [100, 30], armB: [96, 34], lean: 6 }, t, 1);
      motorbike(bx - 250, 1130, .8, 1, '#2a4a6a'); C('vu', bx - 256, 1070, .66, { view: u > .25 ? 'back' : 'side', legF: [70, -70, 0], legB: [64, -66, 0], armF: [100, 30], armB: [96, 34], lean: 6 }, t, 2); C('duy', bx - 310, 1060, .6, { view: 'side', legF: [70, -70, 0], legB: [64, -66, 0], armF: [40, 60], armB: [30, 60], lean: 4 }, t, 4); }
    else { cam(380, 760, 1); highlandBG(t, 'dusk'); cam(380, 820, lerp(1.25, 1.35, (u - .55) / .45)); villageGate(380, 900, t, 1.4); }
    rain(t, .3); tint('#1a2030', .18); vignette(); captions(t); return; }
  if (k === 's6') { // night, guesthouse: wooden knocking at the window; the photo; at the beat the old man has turned to the lens with white eyes
    const u = U('s6', t), photoT = TL.s6[0] + (TL.s6[1] - TL.s6[0]) * .42;
    if (t < photoT) { cam(W / 2, H / 2, 1); roomBG(t, .8); C('vu', 150, 905, .58, { view: 'front', faceDir: 0, legsFront: true, legF: [90, -10, 0], legB: [86, -12, 0], armF: [140, 40], armB: [134, 46], look: .5, brow: 10 }, t, 2);
      C('khang', 560, 905, .58, { view: 'back', legsFront: true, legF: [90, -10, 0], legB: [86, -12, 0] }, t, 1);
      if (Math.sin(t * 17) > .7) { g.strokeStyle = 'rgba(200,200,220,.5)'; g.lineWidth = 3; for (const dx of [-16, 0, 16]) { g.beginPath(); g.moveTo(600 + dx, 230); g.lineTo(612 + dx, 210); g.stroke(); } } }
    else { const zu = t > BEAT.s6 ? sm(clamp((t - BEAT.s6) / 1.5)) : 0; cam(lerp(W / 2, 420, zu), lerp(H / 2, 560, zu), (1 + .08 * U('s6', t)) * lerp(1, 2.6, zu)); phoneShot(t > BEAT.s6 ? 'turned' : 'normal', t); }
    tint('#0a1030', .25); vignette(.7); if (t > BEAT.s6 && t < BEAT.s6 + .1) tint('#ffffff', .4); captions(t); return; }
  if (k === 's7' || k === 'K1') { const u = U(k, t), sh = 2 * Math.sin(t * 40);
    if (k === 's7') { cam(W / 2, H / 2, 1); roomBG(t, .5); C('khang', 560 + sh * .3, 905, .58, { view: 'side', flip: -1, legsFront: true, legF: [90, -10, 0], legB: [86, -12, 0], armF: [40, 40], armB: [30, 50], blink: 1, head: -6, mouth: Math.abs(Math.sin(t * 9)) * .3 }, t, 1);
      C('vu', 150, 905, .58, { view: 'three', faceDir: .4, legsFront: true, legF: [90, -10, 0], legB: [86, -12, 0], shock: 1, mouth: .5, look: .8 }, t, 2); }
    else { cam(W / 2, H / 2, 1); roomBG(t, .5); cam(560, 700, 2.3 + .2 * u); C('khang', 560 + sh * .2, 905, .58, { view: 'front', faceDir: 0, legsFront: true, legF: [90, -10, 0], legB: [86, -12, 0], armF: [40, 40], armB: [30, 50], blink: 0, mouth: talk(t, speaking('K1', t)) * .6 }, t, 1); }
    tint('#0a1030', .28); vignette(.7); captions(t); return; }
  if (['s8', 'T1', 'T2'].includes(k)) { // morning at the gate: the shaman stays inside; Vũ hands him the phone
    const u = U(k, t); cam(380, 760, 1); highlandBG(t, 'dusk'); tint('#c8d8f0', .12);
    if (k === 's8') { cam(380, 880, 1.1); villageGate(380, 900, t, .6); C('thay', 330, 1000, .6, { view: 'side', faceDir: 1, armF: u > .6 ? [70, 30] : [10, 22] }, t, 3);
      C('vu', 500, 1080, .66, { view: 'side', flip: -1, armF: [lerp(10, 80, sm(clamp((u - .4) / .2))), 20] }, t, 2); C('khang', 600, 1110, .66, { view: 'three', faceDir: -.3, flip: -1, blink: 1, bend: 10, lean: 6 }, t, 1); C('duy', 660, 1150, .66, { view: 'three', faceDir: -.3, flip: -1 }, t, 4); }
    else { cam(330, 820, 2.1 + .1 * u); villageGate(380, 900, t, .6); C('thay', 330, 1000, .6, { view: k === 'T1' ? 'front' : 'three', faceDir: k === 'T1' ? 0 : .3, brow: 14, armF: k === 'T2' ? [120, 20] : [10, 22], mouth: talk(t, speaking(k, t)) }, t, 3); }
    vignette(.45); captions(t); return; }
  if (k === 's9' || k === 's10') { // the vigil: three men in a row outside the gate all night; a cold hand on Khang's shoulder; dawn creeps in
    const u = U(k, t), dawn = k === 's10' ? sm(u) : 0;
    cam(380, 760, 1); highlandBG(t, 'night'); if (dawn > 0) tint('#b0a0c0', .25 * dawn);
    cam(380, 900, lerp(1.05, 1.25, k === 's9' ? u : 1)); villageGate(380, 900, t, k === 's9' ? 2.2 : 2.2 * (1 - dawn));
    const sh = k === 's9' ? 1.5 * Math.sin(t * 37) : 0;
    C('vu', 250, 1120, .6, { view: 'front', faceDir: 0, armF: [20, 60], armB: [20, 60], blink: 0, brow: 12 }, t, 2); C('duy', 510, 1120, .6, { view: 'front', faceDir: 0, armF: [10, 22], armB: [10, 22], brow: 12 }, t, 4);
    C('khang', 380 + sh, 1130, .62, { view: 'front', faceDir: 0, armF: [40, 90], armB: [40, 90], blink: k === 's9' && u > .4 ? 1 : 0, brow: 14, bend: 6 * (k === 's9' ? u : 1 - dawn) }, t, 1);
    if (k === 's9' && u > .45) { const a = .7 * sm((u - .45) / .3); g.save(); g.globalAlpha = a; g.fillStyle = '#dfe3e0'; g.strokeStyle = INK; g.lineWidth = 2.5; for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(410 + i * 8, 1130 - 1.35 * .62 * 150 + 4, 4, 13, .2, 0, 7); g.fill(); g.stroke(); } g.restore(); }
    rain(t, .15 * (1 - dawn)); tint('#0a1030', .25 * (1 - dawn)); vignette(.6); captions(t); return; }
  if (k === 'end' || k === 'cta') { // the photo again: the old man is gone; a five-finger print stays on Khang's shoulder
    const u = U(k, t);
    if (k === 'end') { const zu = t > BEAT.end ? sm(clamp((t - BEAT.end) / 2)) : 0, z = lerp(1, 2.6, zu); cam(lerp(W / 2, 390, zu), lerp(H / 2, 690, zu), z); phoneShot('gone', t); tint('#0a1030', .15); vignette(.6); if (t > BEAT.end && t < BEAT.end + .08) tint('#ffffff', .35); }
    else { cam(380, 760, 1); highlandBG(t, 'dusk'); tint('#c8d8f0', .1); cam(380, 860, 1.0 + .1 * u); villageGate(380, 900, t, .8); C('khang', 380, 1180, .7, { view: 'back' }, t, 1); vignette(.6);
      g.setTransform(1, 0, 0, 1, 0, 0); g.font = '600 22px "DejaVu Sans"'; g.textAlign = 'center'; g.fillStyle = 'rgba(255,255,255,.75)'; g.fillText('Câu chuyện chỉ là hư cấu', W / 2, H - 70); }
    captions(t); return; }
};
window.READY = true;
