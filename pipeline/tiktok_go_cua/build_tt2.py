import sys, json, os, re, difflib, numpy as np, importlib.util
sys.path.insert(0, '/home/claude/ep1'); sys.path.insert(0, '/home/claude/char7')
from scipy.io import wavfile
from tts_slug import slug
from ghostfx import ghost
spec = importlib.util.spec_from_file_location('pace', '/home/claude/pace.py'); P = importlib.util.module_from_spec(spec); spec.loader.exec_module(P)
SR = 48000; D = '/home/claude/tt2/'
S = json.load(open(D + 'script.json'))
VS = {'N': 'clone_refs_mada8_wav', 'BC': 'ngoc_huyen', 'GBC': 'ngoc_huyen', 'NA': 'thuy_dung', 'GNA': 'thuy_dung', 'HU': 'hai_dang'}
FEM = {'BC', 'GBC', 'NA', 'GNA'}
norm = lambda s: re.sub(r'[^\w\s]', '', s.lower()).split()
MAP = {}
for job in ('30_go_cua_n', '31_go_cua_bc', '32_go_cua_na', '33_go_cua_hu', '34_go_cua_n2'):
    jf = f'/home/claude/giong-doc/jobs/{job}.json'
    if not os.path.exists(jf): continue
    J = json.load(open(jf)); vd = slug(J['voices'][0])
    for k, line in enumerate(J['lines']):
        f = f'/home/claude/giong-doc/out/{job}/{vd}/{k:02d}'
        if os.path.exists(f + '.wav'): MAP.setdefault((line, vd), []).append(f)
real = all(sp.startswith('SFX') or (tx, VS[sp]) in MAP for _, sp, tx in S)
clips = []; low = []
for i, (sh, sp, tx) in enumerate(S):
    if sp.startswith('SFX'): clips.append(np.zeros(int(SR * (3.4 if sp == 'SFX4' else 2.6)))); continue
    if not real: clips.append(np.zeros(int(SR * (len(tx.split()) * 0.32 + 0.3)))); continue
    best = None
    for f in MAP[(tx, VS[sp])]:
        r = difflib.SequenceMatcher(None, norm(tx), norm(open(f + '.txt').read() if os.path.exists(f + '.txt') else '')).ratio()
        if best is None or r > best[0] + 0.02: best = (r, f)
    if best[0] < 0.75: low.append((i, round(best[0], 2), tx[:40]))
    c = P.stretch_pauses(P.trim(P.load(best[1] + '.wav')), factor=1.3 if sp not in FEM else 1.2, extra=0.05)
    if sp in ('GNA', 'GBC'): c = ghost(c, 'far' if sh in ('knock', 'phone', 'knock2') else 'ghost')
    elif sp in FEM: c = c * 0.9
    clips.append(c)
nd = [len(c) / SR for c in clips]
st = [0.4]
for i in range(len(S) - 1):
    g = 0.38 if S[i][0] == S[i + 1][0] else 0.7
    if S[i + 1][1].startswith('SFX') or S[i][1].startswith('SFX'): g = 0.25
    if S[i + 1][0] == 'reveal': g = 1.2
    st.append(st[i] + nd[i] + g)
dur = st[-1] + nd[-1] + 1.5
runs = []
for i, l in enumerate(S):
    if runs and runs[-1][0] == l[0]: runs[-1][2] = i
    else: runs.append([l[0], i, i])
sc = []
for j, (k, a, b) in enumerate(runs):
    t0 = 0 if j == 0 else st[a] - 0.2
    t1 = (st[runs[j + 1][1]] - 0.2) if j < len(runs) - 1 else dur
    sc.append([k, round(t0, 3), round(t1, 3), [round(st[q] - t0, 2) for q in range(a, b + 1)]])
subs = []; knocks = []
for i, ((sh, sp, tx), s0, d) in enumerate(zip(S, st, nd)):
    if sp.startswith('SFX'):
        n = int(sp[3]); [knocks.append([round(s0 + 0.2 + q * 0.8, 2), i, n]) for q in range(n)]; continue
    toks = tx.split(); chunks = []; cur = []
    for k, t in enumerate(toks):
        cur.append(t)
        if (t[-1] in '.,?' and len(cur) >= 3) or len(cur) >= 8 or k == len(toks) - 1: chunks.append(cur); cur = []
    if len(chunks) > 1 and len(chunks[-1]) <= 2: last = chunks.pop(); chunks[-1] += last
    w = [len(' '.join(c)) + 5 for c in chunks]; tot = sum(w); t0 = s0 + 0.03; dd = (min(d, len(tx) * 0.09 + 0.6) if sp.startswith('G') else d) - 0.06
    for c, wi in zip(chunks, w):
        L = dd * wi / tot; s = ' '.join(c)
        subs.append([round(t0, 2), round(t0 + L, 2), s if sp == 'N' else '“' + s.strip('“”') + '”', sp]); t0 += L
first = {}
for k, a, b, ls in sc: first.setdefault(k, a)
TL = dict(dur=round(dur, 2), scenes=sc, subs=subs, knocks=knocks, sc=first, starts=st, durs=nd)
json.dump(TL, open(D + 'tl.json', 'w'), ensure_ascii=False)
lib = open('/home/claude/char7/char5.js').read()
html = '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000;overflow:hidden}canvas{display:block}</style></head><body><canvas id="c" width="1080" height="1920"></canvas><script>\nconst TL=' + json.dumps(TL, ensure_ascii=False) + ';const DURATION=TL.dur;\nconst W=1080,H=1920;const ctx=document.getElementById("c").getContext("2d");\n' + lib + '\n' + open(D + 'shots_tt2.js').read() + '\n</script></body></html>'
open(D + 'tt2.html', 'w').write(html)
if real:
    N = int(dur * SR); v = np.zeros(N)
    for c, s0 in zip(clips, st): i = int(s0 * SR); n = min(len(c), N - i); v[i:i + n] += c[:n]
    v /= np.abs(v).max() * 1.05; wavfile.write(D + 'voice.wav', SR, (np.stack([v, v], 1) * 32767).astype(np.int16))
    print('low', low)
print('real' if real else 'provisional', 'dur', round(dur, 1))
