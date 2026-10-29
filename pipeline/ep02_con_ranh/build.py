import subprocess, tempfile, sys, json, os, re, difflib, numpy as np
sys.path.insert(0, '/home/claude/ep2')
from scipy.io import wavfile
from tts_slug import slug
from ghostfx import ghost
import pace as P
SR = 48000; D = '/home/claude/ep2/'; G = '/home/claude/giong-doc/'
S = [l.rstrip('\n').split('|', 2) for l in open(G + 'pipeline/ep02_con_ranh/script.txt') if l.strip()]
VS = {'N': 'clone_refs_mada8_wav', 'H': 'my_duyen', 'GH': 'my_duyen', 'L': 'adam', 'BT': 'thuy_dung', 'BA': 'kim_thanh', 'TH': 'thai_son', 'NAM': 'minh_triet', 'BE': 'thuc_doan', 'GBE': 'thuc_doan'}
FEM = {'H', 'GH', 'BT', 'BA', 'BE', 'GBE'}
norm = lambda s: re.sub(r'[^\w\s]', '', s.lower()).split()
MAP = {}
for jf in sorted(os.listdir(G + 'jobs')):
    if not re.match(r'(5\d_cr_|6\d_cr_)', jf): continue
    job = jf[:-5]; J = json.load(open(G + 'jobs/' + jf)); vd = slug(J['voices'][0])
    for k, line in enumerate(J['lines']):
        f = f'{G}out/{job}/{vd}/{k:02d}'
        if os.path.exists(f + '.wav'): MAP.setdefault((line, vd), []).append(f)
def slow(c):
    d = tempfile.mkdtemp(); a = d + '/a.wav'; b = d + '/b.wav'
    wavfile.write(a, SR, (c / max(1e-9, np.abs(c).max()) * 0.9 * 32767).astype(np.int16))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a, '-af', f'asetrate={int(SR*0.92)},aresample={SR},atempo=0.9', b], check=True)
    r, y = wavfile.read(b); y = y.astype(np.float64) / 32768
    return y if y.ndim == 1 else y.mean(1)
real = all((tx, VS[sp]) in MAP for _, sp, tx in S)
missing = [(i, sp, tx[:30]) for i, (_, sp, tx) in enumerate(S) if (tx, VS[sp]) not in MAP]
clips = []; low = []; pick = []
def expr(f):
    x = P.trim(P.load(f + '.wav')); n = int(0.03 * SR); e = np.array([np.sqrt(np.mean(x[k:k+n]**2)) + 1e-6 for k in range(0, len(x) - n, n)])
    e = 20 * np.log10(e); e = e[e > e.max() - 35]; return float(np.std(e)) if len(e) > 5 else 0
BAD = json.load(open(D + 'bad.json')) if os.path.exists(D + 'bad.json') else []
for i, (sh, sp, tx) in enumerate(S):
    if (tx, VS[sp]) not in MAP: clips.append(np.zeros(int(SR * (len(tx.split()) * 0.33 + 0.3)))); pick.append(None); continue
    cands = []
    for f in MAP[(tx, VS[sp])]:
        if f in BAD: continue
        r = difflib.SequenceMatcher(None, norm(tx), norm(open(f + '.txt').read() if os.path.exists(f + '.txt') else '')).ratio()
        x = P.trim(P.load(f + '.wav')); dur = len(x) / SR
        if dur > len(tx.split()) * 0.75 + 2: r -= 0.3   # runaway generation
        cands.append((r, f))
    top = max(c[0] for c in cands)
    ok = [c for c in cands if c[0] >= top - 0.06]
    best = max(ok, key=lambda c: expr(c[1]) + 10 * c[0]) if sp != 'N' else max(cands)
    if best[0] < 0.75: low.append((i, sp, round(best[0], 2), tx[:50]))
    pick.append(best[1])
    c = P.stretch_pauses(P.trim(P.load(best[1] + '.wav')), factor=1.3 if sp not in FEM else 1.2, extra=0.05)
    if sp.startswith('G'): c = ghost(slow(c), 'far' if sp == 'GH' else 'ghost')
    elif sp in FEM: c = c * 0.9
    clips.append(c)
nd = [len(c) / SR for c in clips]
JX = {('hook2', 0), ('vongdem2', 1), ('matlai', 3), ('rach', 3), ('goi2', 2)}
first = {}
for i, l in enumerate(S): first.setdefault(l[0], i)
JXI = {first[k] + n for k, n in JX}
st = [0.5]
for i in range(len(S) - 1):
    a, b = S[i][0], S[i + 1][0]
    g = 0.4 if a == b else 0.75
    if b.startswith('jump') or i + 1 in JXI: g = 1.7
    if b.startswith('chap') or b in ('title', 'ctamid', 'cta0', 'final'): g = 1.3
    if a.startswith('chap') or a == 'title': g = 1.1
    st.append(st[i] + nd[i] + g)
dur = st[-1] + nd[-1] + 2.0
runs = []
for i, l in enumerate(S):
    if runs and runs[-1][0] == l[0]: runs[-1][2] = i
    else: runs.append([l[0], i, i])
sc = []
for j, (k, a, b) in enumerate(runs):
    t0 = 0 if j == 0 else st[a] - 0.25
    if k.startswith('jump'): t0 = st[a] - 1.15
    t1 = (st[runs[j + 1][1]] - (1.15 if runs[j+1][0].startswith('jump') else 0.25)) if j < len(runs) - 1 else dur
    sc.append([k, round(t0, 3), round(t1, 3), [round(st[q] - t0, 2) for q in range(a, b + 1)], a])
subs = []
for i, ((sh, sp, tx), s0, d) in enumerate(zip(S, st, nd)):
    toks = tx.split(); chunks = []; cur = []
    for k, t in enumerate(toks):
        cur.append(t)
        if (t[-1] in '.,?!' and len(cur) >= 3) or len(cur) >= 9 or k == len(toks) - 1: chunks.append(cur); cur = []
    if len(chunks) > 1 and len(chunks[-1]) <= 2: last = chunks.pop(); chunks[-1] += last
    w = [len(' '.join(c)) + 5 for c in chunks]; tot = sum(w); t0 = s0 + 0.03; dd = (min(d, len(tx) * 0.13 + 0.9) if sp.startswith('G') else d) - 0.06
    for c, wi in zip(chunks, w):
        L = dd * wi / tot; s = ' '.join(c)
        subs.append([round(t0, 2), round(t0 + L, 2), s if sp == 'N' else '“' + s.strip('“”') + '”', sp]); t0 += L
JUMPS = sorted([[round(st[a] - 1.0, 2), k] for k, a, b in runs if k.startswith('jump')] + [[round(st[i] - 1.0, 2), S[i][0]] for i in JXI])
TL = dict(spk=[x[1] for x in S], dur=round(dur, 2), scenes=sc, subs=subs, starts=[round(x, 2) for x in st], jumps=JUMPS)
json.dump(TL, open(D + 'tl.json', 'w'), ensure_ascii=False)
json.dump(pick, open(D + 'pick.json', 'w'))
if real:
    N = int(dur * SR); v = np.zeros(N)
    for c, s0 in zip(clips, st): i = int(s0 * SR); n = min(len(c), N - i); v[i:i + n] += c[:n]
    v /= np.abs(v).max() * 1.05; wavfile.write(D + 'voice.wav', SR, (np.stack([v, v], 1) * 32767).astype(np.int16))
print('low', low); print('missing', len(missing))
print('real' if real else 'provisional', 'dur', round(dur, 1), 'min', round(dur / 60, 2))
