import sys, json, re, difflib, numpy as np, importlib.util
from scipy.io import wavfile
spec = importlib.util.spec_from_file_location('pace', '/home/claude/pace.py'); P = importlib.util.module_from_spec(spec); spec.loader.exec_module(P)
SR = 48000; O = '/home/claude/giong-doc/out/41_whatif_mau/minh_duc/'
S = [l.split('|', 1) for l in open('script.txt').read().strip().split('\n')]
norm = lambda s: re.sub(r'[^\w\s]', '', s.lower()).split()
clips = []
for i, (k, tx) in enumerate(S):
    best = max(((difflib.SequenceMatcher(None, norm(tx), norm(open(f'{O}{i*3+j:02d}.txt').read())).ratio(), i*3+j) for j in range(3)))
    print(k, round(best[0], 2)); clips.append(P.trim(P.load(f'{O}{best[1]:02d}.wav')))
gap = {'A': 1.2, 'B': 1.0, 'C': 1.6, 'D': 1.4}
st = [0.8]
for i in range(len(S) - 1): st.append(st[i] + len(clips[i]) / SR + gap[S[i][0]])
dur = st[-1] + len(clips[-1]) / SR + 2.5
sc = [[k, 0 if i == 0 else round(st[i] - 0.4, 2), round(st[i + 1] - 0.4, 2) if i < len(S) - 1 else round(dur, 2)] for i, (k, _) in enumerate(S)]
subs = []
for (k, tx), s0, c in zip(S, st, clips):
    d = len(c) / SR; toks = tx.split(); ch = []; cur = []
    for j, t in enumerate(toks):
        cur.append(t)
        if (t[-1] in '.,?' and len(cur) >= 3) or len(cur) >= 9 or j == len(toks) - 1: ch.append(cur); cur = []
    if len(ch) > 1 and len(ch[-1]) <= 2: last = ch.pop(); ch[-1] += last
    w = [len(' '.join(x)) + 5 for x in ch]; t0 = s0
    for x, wi in zip(ch, w): L = d * wi / sum(w); subs.append([round(t0, 2), round(t0 + L, 2), ' '.join(x)]); t0 += L
TL = dict(dur=round(dur, 2), scenes=sc, subs=subs)
h = open('wi.html').read()
h = h.replace('<script src="three.min.js"></script><script>', '<script src="three.min.js"></script><script>window.TL=' + json.dumps(TL, ensure_ascii=False) + ';')
open('wi_tl.html', 'w').write(h)
N = int(dur * SR); v = np.zeros(N)
for c, s0 in zip(clips, st): i = int(s0 * SR); v[i:i + len(c)] += c[:N - i]
v /= np.abs(v).max() * 1.05; wavfile.write('voice.wav', SR, (np.stack([v, v], 1) * 32767).astype(np.int16))
json.dump(TL, open('tl.json', 'w'), ensure_ascii=False); print(sc, dur)
