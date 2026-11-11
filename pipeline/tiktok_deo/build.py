# Ngải Thất Sơn (bản ngải kêu người) — người kể VieNeu MaDa + thoại ElevenLabs.
# Timeline dựng theo độ dài THẬT của từng clip; khẩu hình chỉ mở trong lúc câu thoại đó có tiếng (TLD.vox).
import subprocess, tempfile, sys, json, os, re, difflib, numpy as np, importlib.util
G = '/home/claude/giong-doc/'; sys.path.insert(0, G + 'pipeline/lib')
from scipy.io import wavfile
from ghostfx import ghost
spec = importlib.util.spec_from_file_location('pace', G + 'pipeline/lib/pace.py'); P = importlib.util.module_from_spec(spec); spec.loader.exec_module(P)
SR = 48000; D = G + 'pipeline/tiktok_deo/'; OUT = G + 'render/dc/'; os.makedirs(OUT, exist_ok=True)
S = json.load(open(D + 'script.json'))
PICK = json.load(open(D + 'pick.json')) if os.path.exists(D + 'pick.json') else {}
clean = lambda s: re.sub(r'\s*\[[^\]]*\]\s*', ' ', s).strip()
norm = lambda s: re.sub(r'[^\w\s]', '', s.lower()).split()
NMAP = {}
for job in ('99_dc_n',):
    if not os.path.exists(G + f'jobs/{job}.json'): continue
    J = json.load(open(G + f'jobs/{job}.json')); ND = G + f'out/{job}/clone_refs_mada8_wav/'
    for k, line in enumerate(J['lines']):
        f = ND + f'{k:02d}'
        if os.path.exists(f + '.wav'): NMAP.setdefault(line, []).append(f)
def ff(c, af):
    d = tempfile.mkdtemp(); a = d + '/a.wav'; b = d + '/b.wav'
    wavfile.write(a, SR, (c / max(1e-9, np.abs(c).max()) * 0.9 * 32767).astype(np.int16))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a, '-af', af, b], check=True)
    r, y = wavfile.read(b); y = y.astype(np.float64) / 32768
    return y if y.ndim == 1 else y.mean(1)
def loadmp3(f):
    d = tempfile.mkdtemp(); w = d + '/x.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-ar', str(SR), '-ac', '1', w], check=True)
    r, y = wavfile.read(w); return y.astype(np.float64) / 32768
def expr(x):
    n = int(0.03 * SR); e = np.array([np.sqrt(np.mean(x[k:k+n]**2)) + 1e-6 for k in range(0, len(x) - n, n)])
    e = 20 * np.log10(e); e = e[e > e.max() - 35]; return float(np.std(e)) if len(e) > 5 else 0
rms = lambda x: np.sqrt(np.mean(x[np.abs(x) > 0.02 * np.abs(x).max()]**2))
def vox(c, thr=26, gap=0.14):
    n = int(0.02 * SR); e = np.array([np.sqrt(np.mean(c[k:k+n]**2)) + 1e-7 for k in range(0, len(c) - n, n)]); db = 20 * np.log10(e)
    on = db > db.max() - thr; iv = []; k = 0
    while k < len(on):
        if on[k]:
            j = k
            while j < len(on) and on[j]: j += 1
            iv.append([k * 0.02, j * 0.02]); k = j
        else: k += 1
    m = []
    for a, b in iv:
        if m and a - m[-1][1] < gap: m[-1][1] = b
        else: m.append([a, b])
    return [x for x in m if x[1] - x[0] > 0.06]
clips = []; info = []
for i, (sh, sp, tx) in enumerate(S):
    if sp == 'N':
        cands = []
        for f in NMAP.get(tx, []):
            got = open(f + '.txt').read() if os.path.exists(f + '.txt') else ''
            cands.append((difflib.SequenceMatcher(None, norm(clean(tx)), norm(got)).ratio(), f))
        if not cands: clips.append(np.zeros(int(SR * (len(tx.split()) * 0.33 + 0.3)))); info.append('MISSING'); continue
        r, f = max(cands); info.append(round(r, 2))
        if sh == 'title': clips.append(np.zeros(int(SR * 3.2))); continue
        c = P.stretch_pauses(P.trim(P.load(f + '.wav')), factor=1.3, extra=0.06)
    else:
        job, vd = {'OS': ('99_dc_os', 'thai_son'), 'GT': ('99_dc_gt', 'thuc_oan')}[sp]
        J2 = json.load(open(G + f'jobs/{job}.json')); base = G + f'out/{job}/'
        vd = [d for d in os.listdir(base) if os.path.isdir(base + d)][0]
        cands = []
        for k, line in enumerate(J2['lines']):
            if line != tx: continue
            f = base + vd + f'/{k:02d}'
            if not os.path.exists(f + '.wav'): continue
            got = open(f + '.txt').read() if os.path.exists(f + '.txt') else ''
            cands.append((difflib.SequenceMatcher(None, norm(clean(tx)), norm(got)).ratio(), f))
        r, f = max(cands); info.append(round(r, 2))
        c = P.stretch_pauses(P.trim(P.load(f + '.wav')), factor=1.2, extra=0.05)
        if sp == 'GT': c = ghost(ff(c, f'asetrate={int(SR*0.94)},aresample={SR},atempo=0.92'), 'ghost')
    clips.append(c)
# cân âm lượng thoại theo người kể
nr = np.median([rms(c) for c, (_, sp, _) in zip(clips, S) if sp == 'N' and np.abs(c).max() > 0])
for k, (_, sp, _) in enumerate(S):
    if sp != 'N' and np.abs(clips[k]).max() > 0: clips[k] = clips[k] * (nr / rms(clips[k])) * (0.9 if sp in ('GT',) else 1.0)
nd = [len(c) / SR for c in clips]
SLOW_IN = {'title', 'intro', 'dawn', 'mother', 'end', 'end2', 'cta'}
st = [0.3]
for i in range(len(S) - 1):
    g = 0.3 if S[i][0] == S[i + 1][0] else 0.5
    if S[i + 1][0] in SLOW_IN: g = 0.85
    if S[i][0] == 'end2': g = 2.0
    if S[i][0] in ('ask', 'spk', 'face', 'brake'): g = 0.8
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
VOX = []
for (sh, sp, tx), s0, c in zip(S, st, clips):
    if sp != 'N':
        for a, b in vox(c): VOX.append([round(s0 + a, 2), round(s0 + b, 2), sp])
subs = []
for i, ((sh, sp, tx), s0, d) in enumerate(zip(S, st, nd)):
    if sp != 'N':
        iv = [v for v in VOX if v[0] >= s0 - 0.01 and v[1] <= s0 + d + 0.01]
        if iv: s0, d = iv[0][0], iv[-1][1] - iv[0][0]
    toks = clean(tx).split(); chunks = []; cur = []
    for k, t in enumerate(toks):
        cur.append(t)
        if t[-1] in '.,?!:' or len(cur) >= 2 or k == len(toks) - 1: chunks.append(cur); cur = []
    
    w = [len(' '.join(c)) + 5 for c in chunks]; tot = sum(w); t0 = s0 + 0.03; dd = d - 0.06
    for c, wi in zip(chunks, w):
        L = dd * wi / tot; s = ' '.join(c)
        if c is chunks[-1]: L = max(0.5, s0 + dd - t0)
        subs.append([round(t0, 2), round(t0 + L, 2), s if sp == 'N' else '“' + s.strip('“”') + '”', sp]); t0 += L
TL = dict(dur=round(dur, 2), scenes=sc, subs=subs, starts=st, durs=nd, lines=[l[0] for l in S], vox=VOX)
json.dump(TL, open(D + 'tl.json', 'w'), ensure_ascii=False)
html = ''.join(open(D + p).read() for p in ('head.part', 'body.part', 'over.part', 'scenes.part'))
open(OUT + 'index.html', 'w').write(html.replace('/*TLD*/null', json.dumps(TL, ensure_ascii=False)))
import shutil
shutil.copy(D + 'ng_chars.js', OUT)
for f in ('helpers.js', 'shots.js', 'shots_tr.js', 'bm_chars.js'): shutil.copy(G + 'render/ng2/' + f, OUT)
if not os.path.exists(OUT + 'lib'): shutil.copytree(G + 'render/ng2/lib', OUT + 'lib')
sj = open(OUT + 'shots.js').read(); open(OUT + 'shots.js', 'w').write(sj.replace('if(!o.headless&&!o.old&&!o.back)', 'if(!o.headless&&!o.old&&!o.back&&!o.bun)'))
N = int(dur * SR); v = np.zeros(N)
for c, s0 in zip(clips, st): i = int(s0 * SR); n = min(len(c), N - i); v[i:i + n] += c[:n]
v /= np.abs(v).max() * 1.05; wavfile.write(D + 'voice.wav', SR, (np.stack([v, v], 1) * 32767).astype(np.int16))
print('dur', round(dur, 1), 'scenes', len(sc)); print([(S[i][0], x) for i, x in enumerate(info) if not isinstance(x, float) or x < 0.8])
