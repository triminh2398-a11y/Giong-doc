# Ngải Thất Sơn — ghép giọng, chọn bản biểu cảm, làm chậm giọng ma, sinh timeline + full.html
import subprocess, tempfile, sys, json, os, re, difflib, numpy as np, importlib.util
G='/home/claude/giong-doc/';sys.path.insert(0, G+'pipeline/lib')
from scipy.io import wavfile
from tts_slug import slug
from ghostfx import ghost
spec = importlib.util.spec_from_file_location('pace', G+'pipeline/lib/pace.py'); P = importlib.util.module_from_spec(spec); spec.loader.exec_module(P)
SR = 48000; D = G+'pipeline/tiktok_ngai/'; OUT=G+'render/ng/'
S = json.load(open(D + 'script.json'))
VS = {'N':'clone_refs_mada8_wav','TB':'duc_tri','TM':'my_duyen','L':'thai_son','GL':'thai_son','GTM':'my_duyen'}
FEM = {'TM','GTM'}
clean = lambda s: re.sub(r'\s*\[[^\]]*\]\s*', ' ', s).strip()
norm = lambda s: re.sub(r'[^\w\s]', '', s.lower()).split()
MAP = {}
for job in json.load(open(D+'jobs.json')):
    jf = G+f'jobs/{job}.json'
    if not os.path.exists(jf): continue
    J = json.load(open(jf)); vd = slug(J['voices'][0])
    for k, line in enumerate(J['lines']):
        f = G+f'out/{job}/{vd}/{k:02d}'
        if os.path.exists(f + '.wav'): MAP.setdefault((line, vd), []).append(f)
def ff(c, af):
    d = tempfile.mkdtemp(); a = d + '/a.wav'; b = d + '/b.wav'
    wavfile.write(a, SR, (c / max(1e-9, np.abs(c).max()) * 0.9 * 32767).astype(np.int16))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a, '-af', af, b], check=True)
    r, y = wavfile.read(b); y = y.astype(np.float64) / 32768
    return y if y.ndim == 1 else y.mean(1)
slow = lambda c: ff(c, f'asetrate={int(SR*0.92)},aresample={SR},atempo=0.82')
real = all((tx, VS[sp]) in MAP for _, sp, tx in S)
if not real: print('missing', [(i,sp,tx[:30]) for i,(_,sp,tx) in enumerate(S) if (tx,VS[sp]) not in MAP][:8])
clips = []; low = []
def expr(f):
    x = P.trim(P.load(f + '.wav')); n = int(0.03 * SR); e = np.array([np.sqrt(np.mean(x[k:k+n]**2)) + 1e-6 for k in range(0, len(x) - n, n)])
    e = 20 * np.log10(e); e = e[e > e.max() - 35]; return float(np.std(e)) if len(e) > 5 else 0
for i, (sh, sp, tx) in enumerate(S):
    if not real: clips.append(np.zeros(int(SR * (len(tx.split()) * 0.33 + 0.3)))); continue
    cands = []
    for f in MAP[(tx, VS[sp])]:
        r = difflib.SequenceMatcher(None, norm(clean(tx)), norm(open(f + '.txt').read() if os.path.exists(f + '.txt') else '')).ratio()
        cands.append((r, f))
    top = max(c[0] for c in cands)
    ok = [c for c in cands if c[0] >= top - 0.06]
    best = max(ok, key=lambda c: expr(c[1]) + 10 * c[0]) if sp != 'N' else max(cands)
    if best[0] < 0.75: low.append((i, round(best[0], 2), tx[:40]))
    c = P.stretch_pauses(P.trim(P.load(best[1] + '.wav')), factor=1.3 if sp not in FEM else 1.2, extra=0.05)
    if sp == 'GL': c = ghost(slow(c), 'far')
    elif sp == 'GTM': c = ghost(slow(c), 'ghost')
    elif sp in FEM: c = ff(c, 'atempo=0.93') * 0.9
    clips.append(c)
nd = [len(c) / SR for c in clips]
st = [0.3]
SLOW_IN = {'title','gl','silent','sick','voice','gtm','rooster','twist','realize','final','gfinal','end','cta','dig','cut2'}
for i in range(len(S) - 1):
    g = 0.32 if S[i][0] == S[i + 1][0] else 0.5
    if S[i + 1][0] in SLOW_IN: g = 0.85
    if S[i][0] == 'gfinal': g = 2.4
    if S[i][0] in ('end',): g = 1.6
    if S[i][0] in ('gl','tmda','gtm'): g = 1.1
    st.append(st[i] + nd[i] + g)
dur = st[-1] + nd[-1] + 1.8
runs = []
for i, l in enumerate(S):
    if runs and runs[-1][0] == l[0]: runs[-1][2] = i
    else: runs.append([l[0], i, i])
sc = []
for j, (k, a, b) in enumerate(runs):
    t0 = 0 if j == 0 else st[a] - 0.2
    t1 = (st[runs[j + 1][1]] - 0.2) if j < len(runs) - 1 else dur
    sc.append([k, round(t0, 3), round(t1, 3), [round(st[q] - t0, 2) for q in range(a, b + 1)]])
subs = []
for i, ((sh, sp, tx), s0, d) in enumerate(zip(S, st, nd)):
    toks = clean(tx).split(); chunks = []; cur = []
    for k, t in enumerate(toks):
        cur.append(t)
        if (t[-1] in '.,?!:' and len(cur) >= 3) or len(cur) >= 8 or k == len(toks) - 1: chunks.append(cur); cur = []
    if len(chunks) > 1 and len(chunks[-1]) <= 2: last = chunks.pop(); chunks[-1] += last
    w = [len(' '.join(c)) + 5 for c in chunks]; tot = sum(w); t0 = s0 + 0.03; dd = d - 0.06
    for c, wi in zip(chunks, w):
        L = dd * wi / tot; s = ' '.join(c)
        if c is chunks[-1]: L = max(0.5, s0 + dd - t0)
        subs.append([round(t0, 2), round(t0 + L, 2), s if sp == 'N' else '“' + s.strip('“”') + '”', sp]); t0 += L
TL = dict(dur=round(dur, 2), scenes=sc, subs=subs, starts=st, durs=nd, lines=[l[0] for l in S])
json.dump(TL, open(D + 'tl.json', 'w'), ensure_ascii=False)
html = ''.join(open(D + p).read() for p in ('head.part', 'body.part', 'over.part', 'scenes.part'))
open(OUT + 'index.html', 'w').write(html.replace('/*TLD*/null', json.dumps(TL, ensure_ascii=False)))
import shutil; shutil.copy(D + 'ng_chars.js', OUT)
if real:
    N = int(dur * SR); v = np.zeros(N)
    for c, s0 in zip(clips, st): i = int(s0 * SR); n = min(len(c), N - i); v[i:i + n] += c[:n]
    v /= np.abs(v).max() * 1.05; wavfile.write(D + 'voice.wav', SR, (np.stack([v, v], 1) * 32767).astype(np.int16))
    print('low', low)
print('real' if real else 'provisional', 'dur', round(dur, 1))
