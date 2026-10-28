import sys; sys.path.insert(0, "/home/claude/ep1")
import json, os, re, difflib, numpy as np, importlib.util
from scipy.io import wavfile
spec = importlib.util.spec_from_file_location('pace', '/home/claude/pace.py'); P = importlib.util.module_from_spec(spec); spec.loader.exec_module(P)
SR = 48000; D = '/home/claude/ep1/'
S = json.load(open(D + 'script.json')); n = len(S)
OM = '/home/claude/giong-doc/out/13_qnt_mada/clone_refs_mada8_wav/'; OT = '/home/claude/giong-doc/out/14_qnt_myduyen/my_duyen/'
FIX = json.load(open(D + 'fix.json')) if os.path.exists(D + 'fix.json') else {}
norm = lambda s: re.sub(r'[^\w\s]', '', s.lower()).split()
MAP = {}
for job in ('13_qnt_mada', '14_qnt_myduyen', '15_qnt_more', '16_qnt_more_t', '17_qnt_v2_mada', '18_qnt_v2_t', '19_qnt_v2_title', '20_qnt_k', '21_qnt_th', '22_qnt_bt', '23_qnt_me', '24_qnt_bt2', '25_qnt_k2', '26_qnt_n2'):
    jf = f'/home/claude/giong-doc/jobs/{job}.json'
    if not os.path.exists(jf): continue
    J = json.load(open(jf)); from tts_slug import slug
    vd = slug(J['voices'][0])
    for k, line in enumerate(J['lines']):
        f = f'/home/claude/giong-doc/out/{job}/{vd}/{k:02d}'
        if os.path.exists(f + '.wav'): MAP.setdefault((line, vd), []).append(f)
VS = {'N': 'clone_refs_mada8_wav', 'M': 'clone_refs_mada8_wav', 'T': 'my_duyen', 'G': 'my_duyen', 'K': 'hai_dang', 'TH': 'thien_minh', 'BT': 'ngoc_huyen', 'ME': 'mai_anh'}
FEM = {'T', 'G', 'BT', 'ME'}
key = lambda l: (l[2], VS[l[1]])
missing = [l for l in S if key(l) not in MAP]; print('missing', len(missing))
real = not missing
clips = []; pick = []
for i, (shot, spk, line) in enumerate(S):
    if real:
        best = None
        for f in MAP[key(S[i])]:
            r = difflib.SequenceMatcher(None, norm(line), norm(open(f + '.txt').read() if os.path.exists(f + '.txt') else '')).ratio()
            if best is None or r > best[0] + 0.02: best = (r, f)
        pick.append((i, round(best[0], 2)))
        c = P.stretch_pauses(P.trim(P.load(best[1] + '.wav')), factor=1.4 if spk not in FEM else 1.25, extra=0.06)
        if spk in FEM: c = c * 0.9
        clips.append(c)
    else: clips.append(np.zeros(int(SR * (len(line.split()) * 0.3 + 0.3))))
nd = [len(c) / SR for c in clips]
LONG = {'Hự.': 1.2, 'Nhưng đã muộn.': 0.9, 'Lạnh như đá.': 1.0, 'Ngón tay trỏ': 1.0, 'Cái xác bắt đầu ngồi dậy.': 1.0, 'Một lần. Hai lần.': 1.2,
        'Anh không còn nín thở được nữa.': 1.2, 'không chịu nhắm.': 1.0, 'Ngọn đèn đầu giường phụt tắt.': 1.2, 'Lạnh quá.': 1.6, 'Là giọng mẹ anh.': 1.0,
        'rồi biến mất vào bóng tối.': 1.4, 'như một khúc gỗ.': 1.4, 'Mưa cũng như ngừng rơi.': 1.4, 'Người ta gọi đó là quỷ nhập tràng.': 1.0, 'vẫn còn đứng ngoài cửa.': 1.8, 'Bên ngoài chỉ còn tiếng mưa.': 1.2, 'rột, rột, rột, chậm rãi, như móng tay ai đó.': 1.0, 'Không có ai.': 0.9}
CHAP = {'title': 1.2, 'village_flood': 1.4, 'night1_hall': 1.6, 'midroll': 1.0, 'night2_storm': 1.6, 'epilogue': 1.8, 'ruin': 1.2, 'outro': 1.2, 'end_card': 1.0}
st = [1.0]
for i in range(n - 1):
    g = 0.55 if S[i][0] == S[i + 1][0] else 0.95
    for k, v in LONG.items():
        if S[i][2].endswith(k) or S[i][2].startswith(k): g = max(g, v)
    if S[i + 1][0] != S[i][0] and S[i + 1][0] in CHAP: g = max(g, CHAP[S[i + 1][0]])
    st.append(st[i] + nd[i] + g)
dur = st[-1] + nd[-1] + 3.0
order = []
for i, l in enumerate(S):
    if not order or order[-1][0] != l[0] or True and order[-1][0] != l[0]: order.append([l[0], i])
    # contiguous runs
runs = []
for i, l in enumerate(S):
    if runs and runs[-1][0] == l[0] and runs[-1][2] == i - 1: runs[-1][2] = i
    else: runs.append([l[0], i, i])
sc = []
for j, (k, a, b) in enumerate(runs):
    t0 = 0 if j == 0 else st[a] - 0.25
    t1 = (st[runs[j + 1][1]] - 0.25) if j < len(runs) - 1 else dur
    ls = [round(st[q] - t0, 2) for q in range(a, b + 1)]
    sc.append([k, round(t0, 3), round(t1, 3), ls])
subs = []
for i, ((shot, spk, txt), s0, d) in enumerate(zip(S, st, nd)):
    toks = txt.split(); chunks = []; cur = []
    for k, t in enumerate(toks):
        cur.append(t)
        if t[-1] in '.,?:' and len(cur) >= 4 or len(cur) >= 10 or k == len(toks) - 1: chunks.append(cur); cur = []
    if len(chunks) > 1 and len(chunks[-1]) <= 2:
        last = chunks.pop(); chunks[-1] += last
    w = [len(' '.join(c)) + (6 if c[-1][-1] in '.,?:' else 0) for c in chunks]; tot = sum(w); t0 = s0 + 0.03; dd = d - 0.06
    for c, wi in zip(chunks, w):
        L = dd * wi / tot; s = ' '.join(c).rstrip(',:.') if spk == 'N' else ' '.join(c)
        if spk != 'N': s = '“' + s.rstrip(',') + '”'
        subs.append([round(t0, 2), round(t0 + L, 2), s] + ([('T' if spk in FEM else 'M')] if spk != 'N' else [])); t0 += L
cuts = [s[1] for s in sc if s[0] in ('title', 'village_flood', 'midroll', 'night2_storm', 'ruin', 'epilogue', 'outro')]
TL = dict(starts=st, durs=nd, dur=round(dur, 2), scenes=sc, subs=subs, cuts=cuts)
json.dump(TL, open(D + 'tl.json', 'w'), ensure_ascii=False)
parts = [open('/home/claude/ml/helpers.js').read(), open(D + 'lib_ml.js').read(), open(D + 'lib_clock.js').read(), open(D + 'shots169_v1.js').read(), open(D + 'shots_new.js').read(), open(D + 'adapt0.js').read()]
html = '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000;overflow:hidden}canvas{display:block}</style></head><body><canvas id="c" width="1920" height="1080"></canvas><script>\nconst TL=' + json.dumps(TL, ensure_ascii=False) + ';\nconst W=1920,H=1080;const cv=document.getElementById("c");const ctx=cv.getContext("2d");\n' + '\n'.join(parts) + '\n</script></body></html>'
open(D + 'ep1.html', 'w').write(html)
if real:
    N = int(dur * SR); v = np.zeros(N)
    for c, s0 in zip(clips, st): i = int(s0 * SR); v[i:i + len(c)] += c[:N - i]
    v /= np.abs(v).max() * 1.05; wavfile.write(D + 'voice.wav', SR, (np.stack([v, v], 1) * 32767).astype(np.int16))
    print('low', [p for p in pick if p[1] < 0.75])
print('real' if real else 'provisional', 'dur', round(dur, 1), 'scenes', len(sc))
