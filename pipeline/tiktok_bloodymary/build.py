import subprocess, tempfile
import sys, json, os, re, difflib, numpy as np, importlib.util
sys.path.insert(0, '/home/claude/ep1'); sys.path.insert(0, '/home/claude/char7')
from scipy.io import wavfile
from tts_slug import slug
from ghostfx import ghost
spec = importlib.util.spec_from_file_location('pace', '/home/claude/pace.py'); P = importlib.util.module_from_spec(spec); spec.loader.exec_module(P)
SR = 48000; D = '/home/claude/bm/'
S = json.load(open(D + 'script.json'))
VS = {'N':'clone_refs_mada8_wav','VY':'my_duyen','TT':'thuy_dung','FT':'thuy_dung','GMA':'kim_thanh','GTT':'thuy_dung'}
FEM = {'VY', 'TT', 'GTT', 'FT'}
clean = lambda s: re.sub(r'\s*\[[^\]]*\]\s*', ' ', s).strip()
EMO = {('thao','TT'):'happy',('vy','VY'):'worry',('rules3','TT'):'happy',('vy2','VY'):'fear',('thaoin','GTT'):'cry',('name','VY'):'cry',('found2','TT'):'worry',('final','GTT'):'cry',('behind2','FT'):'calm'}
TEMPO = {'happy':0.93,'worry':0.88,'fear':0.9,'cry':0.85,'calm':0.82}
def tempo(c, f, rate=1.0):
    d = tempfile.mkdtemp(); a = d + '/a.wav'; o = d + '/b.wav'
    wavfile.write(a, SR, (c / max(1e-9, np.abs(c).max()) * 0.9 * 32767).astype(np.int16))
    af = (f'asetrate={int(SR*rate)},aresample={SR},' if rate != 1.0 else '') + f'atempo={f}'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a, '-af', af, o], check=True)
    r, y = wavfile.read(o); y = y.astype(np.float64) / 32768
    return y if y.ndim == 1 else y.mean(1)
norm = lambda s: re.sub(r'[^\w\s]', '', s.lower()).split()
MAP = {}
for job in tuple(json.load(open(D+'jobs.json'))):
    jf = f'/home/claude/giong-doc/jobs/{job}.json'
    if not os.path.exists(jf): continue
    J = json.load(open(jf)); vd = slug(J['voices'][0])
    for k, line in enumerate(J['lines']):
        f = f'/home/claude/giong-doc/out/{job}/{vd}/{k:02d}'
        if os.path.exists(f + '.wav') and not f.endswith('90_bm_vy/my_duyen/11'): MAP.setdefault((line, vd), []).append(f)
def l_far(i): return False
def slow(c):
    d = tempfile.mkdtemp(); a = d + '/a.wav'; b = d + '/b.wav'
    wavfile.write(a, SR, (c / max(1e-9, np.abs(c).max()) * 0.9 * 32767).astype(np.int16))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a, '-af', f'asetrate={int(SR*0.92)},aresample={SR},atempo=0.9', b], check=True)
    r, y = wavfile.read(b); y = y.astype(np.float64) / 32768
    return y if y.ndim == 1 else y.mean(1)
real = all(sp.startswith('SFX') or (tx, VS[sp]) in MAP or (sh, sp) in {('thao','TT'),('rules3','TT'),('prank','TT'),('thaoin','GTT'),('found2','TT'),('final','GTT'),('behind2','FT'),('vy','VY'),('vy2','VY'),('name','VY'),('whisper','GMA')} for sh, sp, tx in S)
clips = []; low = []
ELM = {('thao','TT'):'T1',('rules3','TT'):'T2',('prank','TT'):'T3',('thaoin','GTT'):'T4',('found2','TT'):'T5',('final','GTT'):'T6',('behind2','FT'):'T7',('vy','VY'):'V1',('vy2','VY'):'V2',('name','VY'):'V3',('whisper','GMA'):'M1'}
def eload(p):
    d = tempfile.mkdtemp(); o = d + '/a.wav'; subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ar',str(SR),'-ac','1',o],check=True)
    r, y = wavfile.read(o); return y.astype(np.float64) / 32768
def eexpr(x):
    n = int(0.03 * SR); e = np.array([np.sqrt(np.mean(x[k:k+n]**2)) + 1e-6 for k in range(0, len(x) - n, n)]); e = 20*np.log10(e); e = e[e > e.max()-35]; return float(np.std(e))
for i, (sh, sp, tx) in enumerate(S):
    if (sh, sp) in ELM:
        fs = [D+'el/'+ELM[(sh,sp)]+s+'.mp3' for s in ('_a','_b') if os.path.exists(D+'el/'+ELM[(sh,sp)]+s+'.mp3')]
        c = max((P.trim(eload(f)) for f in fs), key=eexpr)
        if sp == 'GMA': c = ghost(c, 'ghost')
        elif sp == 'GTT': c = ghost(c, 'far')
        elif sp == 'FT': c = tempo(c, 0.95, 0.96)
        else: c = c * 0.9
        clips.append(c); continue
    if sp.startswith('SFX'): clips.append(np.zeros(int(SR * (3.4 if sp == 'SFX4' else 2.6)))); continue
    if not real: clips.append(np.zeros(int(SR * (len(tx.split()) * 0.32 + 0.3)))); continue
    cands = []
    for f in MAP[(tx, VS[sp])]:
        r = difflib.SequenceMatcher(None, norm(clean(tx)), norm(open(f + '.txt').read() if os.path.exists(f + '.txt') else '')).ratio()
        cands.append((r, f))
    top = max(c[0] for c in cands)
    def expr(f):
        x = P.trim(P.load(f + '.wav')); n = int(0.03 * SR); e = np.array([np.sqrt(np.mean(x[k:k+n]**2)) + 1e-6 for k in range(0, len(x) - n, n)])
        e = 20 * np.log10(e); e = e[e > e.max() - 35]; return float(np.std(e)) if len(e) > 5 else 0
    ok = [c for c in cands if c[0] >= top - 0.06]
    best = max(ok, key=lambda c: expr(c[1]) + 10 * c[0]) if sp != 'N' else max(cands)
    if best[0] < 0.75: low.append((i, round(best[0], 2), tx[:40]))
    c = P.stretch_pauses(P.trim(P.load(best[1] + '.wav')), factor=1.3 if sp not in FEM else 1.2, extra=0.05)
    em = EMO.get((sh, sp))
    if em: c = P.stretch_pauses(c, factor=1.35, extra=0.12)
    if sp == 'FT': c = tempo(c, TEMPO['calm'], 0.96)
    elif sp in ('TT', 'GTT', 'VY') and sh != 'prank': c = tempo(c, TEMPO[em] if em else (0.9 if sp != 'VY' else 0.95))
    if sp == 'GMA': c = ghost(slow(c), 'ghost')
    elif sp == 'GTT': c = ghost(c, 'far')
    elif sp in FEM: c = c * 0.9
    clips.append(c)
nd = [len(c) / SR for c in clips]
st = [0.4]
for i in range(len(S) - 1):
    g = 0.38 if S[i][0] == S[i + 1][0] else 0.7
    if S[i + 1][1].startswith('SFX') or S[i][1].startswith('SFX'): g = 0.25
    if S[i + 1][0] in ('title', 'change', 'candle', 'whisper', 'scream', 'thaoin', 'final', 'silence', 'odd', 'realize', 'behind', 'behind2'): g = 1.0
    if S[i][0] == 'behind2': g = 2.2
    if S[i][0] == 'final': g = 1.6
    if S[i][0] in ('candle', 'name'): g = 1.4
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
    toks = clean(tx).split(); chunks = []; cur = []
    for k, t in enumerate(toks):
        cur.append(t)
        if (t[-1] in '.,?' and len(cur) >= 3) or len(cur) >= 8 or k == len(toks) - 1: chunks.append(cur); cur = []
    if len(chunks) > 1 and len(chunks[-1]) <= 2: last = chunks.pop(); chunks[-1] += last
    gaps = []
    cl = clips[i]; n = int(0.02*SR); en = np.array([np.sqrt(np.mean(cl[k:k+n]**2)) for k in range(0, max(1,len(cl)-n), n)]); thr = en.max()*0.06; q = 0
    while q < len(en):
        if en[q] < thr:
            r = q
            while r < len(en) and en[r] < thr: r += 1
            if (r-q)*0.02 >= 0.12 and q > 0 and r < len(en): gaps.append(s0 + (q+r)/2*0.02)
            q = r
        else: q += 1
    w = [len(' '.join(c)) + 5 for c in chunks]; tot = sum(w); t0 = s0 + 0.03; dd = (min(d, len(clean(tx)) * 0.13 + 0.9) if sp.startswith('G') else d) - 0.06
    for c, wi in zip(chunks, w):
        L = dd * wi / tot; s = ' '.join(c)
        if c is not chunks[-1] and gaps:
            gt = min(gaps, key=lambda g: abs(g - (t0 + L)))
            if abs(gt - (t0 + L)) < 0.7 and gt > t0 + 0.4: L = gt - t0
        if c is chunks[-1]: L = max(0.5, s0 + dd - t0)
        subs.append([round(t0, 2), round(t0 + L, 2), s if sp == 'N' else '“' + s.strip('“”') + '”', sp]); t0 += L
first = {}
for k, a, b, ls in sc: first.setdefault(k, a)
TL = dict(dur=round(dur, 2), scenes=sc, subs=subs, knocks=knocks, sc=first, starts=st, durs=nd, lines=[l[0] for l in S])
json.dump(TL, open(D + 'tl.json', 'w'), ensure_ascii=False)
open(D+'full.html','w').write(open(D+'index.html').read().replace('/*TLD*/null',json.dumps(TL,ensure_ascii=False)))
if real:
    N = int(dur * SR); v = np.zeros(N)
    for c, s0 in zip(clips, st): i = int(s0 * SR); n = min(len(c), N - i); v[i:i + n] += c[:n]
    v /= np.abs(v).max() * 1.05; wavfile.write(D + 'voice.wav', SR, (np.stack([v, v], 1) * 32767).astype(np.int16))
    print('low', low)
print('real' if real else 'provisional', 'dur', round(dur, 1))
