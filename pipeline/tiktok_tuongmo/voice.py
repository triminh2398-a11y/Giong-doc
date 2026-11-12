# Narration track + timeline for the 3D "Tượng nhà mồ" build: best of 3 takes per line (ASR match), pauses stretched like Ma Lai pacing.
import json, re, difflib, importlib.util, numpy as np
from scipy.io import wavfile
G = '/home/claude/giong-doc/'; D = G + 'pipeline/tiktok_tuongmo/'
spec = importlib.util.spec_from_file_location('pace', G + 'pipeline/lib/pace.py'); P = importlib.util.module_from_spec(spec); spec.loader.exec_module(P)
SR = 48000; ND = G + 'out/99_tm_n/clone_refs_mada8_wav/'
L = [l.split('|', 2) for l in open(D + 'script.txt', encoding='utf-8').read().strip().split('\n')]
J = json.load(open(G + 'jobs/99_tm_n.json'))
norm = lambda s: re.sub(r'[^\w\s]', '', s.lower()).split()
GAP = {'hook': .7, 's3': .6, 's4': .6, 's8': .8, 's12': .7, 's14': .7, 's15': .6, 's16': .6, 's17': .9, 's18': .6, 'end': .7}
out = [np.zeros(int(.3 * SR))]; t = .3; TL = {}; SPEECH = {}; picks = {}
for k, sp, tx in L:
    if k == 'title':
        TL[k] = [t, t + 2.6]; out.append(np.zeros(int(2.6 * SR))); t += 2.6; continue
    best = None
    for i, line in enumerate(J['lines']):
        if line != tx: continue
        f = ND + f'{i:02d}'
        try: got = open(f + '.txt', encoding='utf-8').read()
        except Exception: got = ''
        r = difflib.SequenceMatcher(None, norm(tx), norm(got)).ratio()
        if best is None or r > best[0]: best = (r, f)
    picks[k] = round(best[0], 2)
    c = P.stretch_pauses(P.trim(P.load(best[1] + '.wav')), factor=1.3, extra=.06)
    g = GAP.get(k, .4); a = t; out.append(c); t += len(c) / SR; SPEECH[k] = [a, t]; out.append(np.zeros(int(g * SR))); t += g; TL[k] = [a - (.15 if k != 'hook' else 0), t]
TL['cta'][1] += 1.5; out.append(np.zeros(int(1.5 * SR))); t += 1.5
# make TL contiguous
ks = [k for k, _, _ in L]
for i in range(1, len(ks)): TL[ks[i]][0] = TL[ks[i - 1]][1]
y = np.concatenate(out); wavfile.write(D + 'voice.wav', SR, (y / np.abs(y).max() * .9 * 32767).astype(np.int16))
json.dump({'TL': TL, 'SPEECH': SPEECH, 'dur': t}, open(D + 'tl.json', 'w'), indent=0)
print('dur', round(t, 1), 'picks', picks)
