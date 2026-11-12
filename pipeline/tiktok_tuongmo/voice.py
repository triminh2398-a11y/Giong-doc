# Narration track + timeline for the 3D "Tượng nhà mồ" build: best of 3 takes per line (ASR match), pauses stretched like Ma Lai pacing.
import json, re, difflib, importlib.util, numpy as np
from scipy.io import wavfile
G = '/home/claude/giong-doc/'; D = G + 'pipeline/tiktok_tuongmo/'
spec = importlib.util.spec_from_file_location('pace', G + 'pipeline/lib/pace.py'); P = importlib.util.module_from_spec(spec); spec.loader.exec_module(P)
SR = 48000; ND = G + 'out/99_tm_n/clone_refs_mada8_wav/'
L = [l.split('|', 2) for l in open(D + 'script.txt', encoding='utf-8').read().strip().split('\n')]
J = json.load(open(G + 'jobs/99_tm_n.json')); J2 = json.load(open(G + 'jobs/99_tm_hook.json')); ND2 = G + 'out/99_tm_hook/clone_refs_mada8_wav/'
norm = lambda s: re.sub(r'[^\w\s]', '', s.lower()).split()
GAP = {'hook': .7, 's3': .6, 's4': .6, 's8': .8, 's12': .7, 's14': .7, 's15': .6, 's16': .6, 's17': .9, 's18': .6, 'end': .7}
out = [np.zeros(int(.3 * SR))]; t = .3; TL = {}; SPEECH = {}; picks = {}; VOX = {}
def vox(c, thr=30, gap=.12):
    n = int(.02 * SR); e = np.array([np.sqrt(np.mean(c[k:k + n] ** 2)) + 1e-7 for k in range(0, len(c) - n, n)]); db = 20 * np.log10(e); on = db > db.max() - thr; iv = []; k = 0
    while k < len(on):
        if on[k]:
            j = k
            while j < len(on) and on[j]: j += 1
            iv.append([k * .02, j * .02]); k = j
        else: k += 1
    m = []
    for a, b in iv:
        if m and a - m[-1][1] < gap: m[-1][1] = b
        else: m.append([a, b])
    return m
for k, sp, tx in L:
    if k == 'title':
        TL[k] = [t, t + 2.6]; out.append(np.zeros(int(2.6 * SR))); t += 2.6; continue
    best = None
    JJ, NDD = (J2, ND2) if k == 'hook' else (J, ND)
    for i, line in enumerate(JJ['lines']):
        if line != tx: continue
        f = NDD + f'{i:02d}'
        try: got = open(f + '.txt', encoding='utf-8').read()
        except Exception: got = ''
        r = difflib.SequenceMatcher(None, norm(tx), norm(got)).ratio()
        if best is None or r > best[0]: best = (r, f)
    picks[k] = round(best[0], 2)
    c = P.stretch_pauses(P.trim(P.load(best[1] + '.wav')), factor=1.3, extra=.06)
    g = GAP.get(k, .4); a = t; VOX[k] = [[a + x, a + y] for x, y in vox(c)]; out.append(c); t += len(c) / SR; SPEECH[k] = [a, t]; out.append(np.zeros(int(g * SR))); t += g; TL[k] = [a - (.15 if k != 'hook' else 0), t]
TL['cta'][1] += 1.5; out.append(np.zeros(int(1.5 * SR))); t += 1.5
# make TL contiguous
ks = [k for k, _, _ in L]
for i in range(1, len(ks)): TL[ks[i]][0] = TL[ks[i - 1]][1]
y = np.concatenate(out); wavfile.write(D + 'voice.wav', SR, (y / np.abs(y).max() * .9 * 32767).astype(np.int16))
BEAT = {}
for k, f in [('s8', .62), ('s14', .45), ('s17', .4)]:
    a, b = TL[k]; tgt = a + (b - a) * f; pauses = [(x[1], y[0]) for x, y in zip(VOX[k], VOX[k][1:]) if y[0] - x[1] > .2] + [(SPEECH[k][1], b)]
    p = min(pauses, key=lambda q: abs(q[0] - tgt)); BEAT[k] = round(p[0] + .05, 3)
print('BEAT', BEAT)
json.dump({'TL': TL, 'SPEECH': SPEECH, 'VOX': VOX, 'BEAT': BEAT, 'dur': t}, open(D + 'tl.json', 'w'), indent=0)
print('dur', round(t, 1), 'picks', picks)
