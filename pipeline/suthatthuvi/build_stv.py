import json, os, re, difflib, sys, numpy as np, importlib.util
from scipy.io import wavfile
sys.path.insert(0, '/home/claude/ep1'); from tts_slug import slug
spec = importlib.util.spec_from_file_location('pace', '/home/claude/pace.py'); P = importlib.util.module_from_spec(spec); spec.loader.exec_module(P)
SR = 48000; D = os.path.dirname(os.path.abspath(__file__)) + '/'
S = json.load(open(D + 'script.json')); JOBS = sys.argv[1:] or ['30_stv1_mada']
MAP = {}
for job in JOBS:
    J = json.load(open(f'/home/claude/giong-doc/jobs/{job}.json')); vd = slug(J['voices'][0])
    for k, line in enumerate(J['lines']):
        f = f'/home/claude/giong-doc/out/{job}/{vd}/{k:02d}'
        if os.path.exists(f + '.wav'): MAP.setdefault(line, []).append(f)
norm = lambda s: re.sub(r'[^\w\s]', '', s.lower()).split()
real = all(l[1] in MAP for l in S); low = []
clips = []
for vis, text in S:
    if not real: clips.append(np.zeros(int(SR * (len(text.split()) * 0.3 + 0.3)))); continue
    best = None
    for f in MAP[text]:
        r = difflib.SequenceMatcher(None, norm(text), norm(open(f + '.txt').read() if os.path.exists(f + '.txt') else '')).ratio()
        if best is None or r > best[0] + 0.02: best = (r, f)
    if best[0] < 0.7: low.append((text[:40], round(best[0], 2)))
    clips.append(P.stretch_pauses(P.trim(P.load(best[1] + '.wav')), factor=1.2, extra=0.04))
nd = [len(c) / SR for c in clips]; n = len(S)
st = [0.6]
for i in range(n - 1):
    g = 0.35 if S[i][0] == S[i + 1][0] else 0.55
    if S[i + 1][0].startswith('chap') or S[i][0].startswith('chap'): g = 0.7
    st.append(st[i] + nd[i] + g)
dur = st[-1] + nd[-1] + 1.8
runs = []
for i, (vis, _) in enumerate(S):
    if runs and runs[-1][0] == vis and runs[-1][2] == i - 1: runs[-1][2] = i
    else: runs.append([vis, i, i])
sc = []
for j, (vis, a, b) in enumerate(runs):
    t0 = 0 if j == 0 else st[a] - 0.2; t1 = (st[runs[j + 1][1]] - 0.2) if j < len(runs) - 1 else dur
    nm, txt = (vis.split(':', 1) + [''])[:2]
    sc.append([nm, round(t0, 3), round(t1, 3), [round(st[q] - t0, 2) for q in range(a, b + 1)], txt])
subs = []
for (vis, txt), s0, d in zip(S, st, nd):
    toks = txt.split(); chunks = []; cur = []
    for k, t in enumerate(toks):
        cur.append(t)
        if (t[-1] in '.,?:!' and len(cur) >= 4) or len(cur) >= 9 or k == len(toks) - 1: chunks.append(cur); cur = []
    if len(chunks) > 1 and len(chunks[-1]) <= 2:
        last = chunks.pop(); chunks[-1] += last
    w = [len(' '.join(c)) + (6 if c[-1][-1] in '.,?:!' else 0) for c in chunks]; tot = sum(w); t0 = s0 + 0.03
    for c, wi in zip(chunks, w):
        L = (d - 0.06) * wi / tot; subs.append([round(t0, 2), round(t0 + L, 2), ' '.join(c).rstrip(',:.')]); t0 += L
TL = dict(dur=round(dur, 2), scenes=sc, subs=subs, starts=st)
json.dump(TL, open(D + 'tl.json', 'w'), ensure_ascii=False)
html = '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000;overflow:hidden}canvas{display:block}</style></head><body><canvas id="c" width="1920" height="1080"></canvas><script>\nconst TL=' + json.dumps(TL, ensure_ascii=False) + ';\nconst W=1920,H=1080;const cv=document.getElementById("c");const ctx=cv.getContext("2d");\n' + open(D + 'stv.js').read() + '\n</script></body></html>'
open(D + 'stv.html', 'w').write(html)
if real:
    N = int(dur * SR); v = np.zeros(N)
    for c, s0 in zip(clips, st): i = int(s0 * SR); v[i:i + len(c)] += c[:N - i]
    v /= np.abs(v).max() * 1.05; wavfile.write(D + 'voice.wav', SR, (np.stack([v, v], 1) * 32767).astype(np.int16)); print('low', low)
print('real' if real else 'provisional', 'dur', round(dur, 1), 'scenes', len(sc))
