import json, os, re, difflib, sys, numpy as np, importlib.util
from scipy.io import wavfile
sys.path.insert(0, '/home/claude/ep1'); from tts_slug import slug
spec = importlib.util.spec_from_file_location('pace', '/home/claude/pace.py'); P = importlib.util.module_from_spec(spec); spec.loader.exec_module(P)
SR = 48000; D = os.path.dirname(os.path.abspath(__file__)) + '/'
Q = json.load(open(D + 'quiz.json')); JOBS = sys.argv[1:] or ['20_kid1_maianh']
MAP = {}
for job in JOBS:
    J = json.load(open(f'/home/claude/giong-doc/jobs/{job}.json')); vd = slug(J['voices'][0])
    for k, line in enumerate(J['lines']):
        f = f'/home/claude/giong-doc/out/{job}/{vd}/{k:02d}'
        if os.path.exists(f + '.wav'): MAP.setdefault(line, []).append(f)
norm = lambda s: re.sub(r'[^\w\s]', '', s.lower()).split()
real = all(l[1] in MAP for l in Q['lines'])
low = []
def clip(text):
    if not real: return np.zeros(int(SR * (len(text.split()) * 0.32 + 0.3)))
    best = None
    for f in MAP[text]:
        r = difflib.SequenceMatcher(None, norm(text), norm(open(f + '.txt').read() if os.path.exists(f + '.txt') else '')).ratio()
        if best is None or r > best[0] + 0.02: best = (r, f)
    if best[0] < 0.7: low.append((text[:40], round(best[0], 2)))
    return P.stretch_pauses(P.trim(P.load(best[1] + '.wav')), factor=1.15, extra=0.04)
lines = Q['lines']; it = iter(lines)
place = []; speak = []; t = 0.8
def say(text, gap):
    global t
    c = clip(text); s = t; place.append((c, s)); d = len(c) / SR; speak.append([round(s, 2), round(s + d, 2)]); t = s + d + gap; return s, d
for k, l in enumerate([l for l in lines if l[0] == 'intro']): say(l[1], 0.45)
introEnd = t + 0.6; t = introEnd + 0.3
qs = []; mid = None; outro = None
byid = {l[0]: l[1] for l in lines}
for i, q in enumerate(Q['questions']):
    tq, _ = say(byid[f'q{i}'], 0.35)
    to, d = say(byid[f'o{i}'], 0.4); toEnd = to + d
    tc0 = t; tc1 = tc0 + 5.0; t = tc1 + 0.25
    ta, _ = say(byid[f'a{i}'], 0.3)
    te, d = say(byid[f'e{i}'], 0.9); tend = te + d + 0.8; t = tend + 0.5
    qs.append(dict(tq=tq, to=to, toEnd=toEnd, tc0=tc0, tc1=tc1, ta=ta, te=te, tend=tend))
    if i == 9 and 'mid' in byid:
        m0 = t; say(byid['mid'], 0.8); mid = [m0, t]; t += 0.3
outro = t
for l in [l for l in lines if l[0] == 'outro']: say(l[1], 0.6)
dur = t + 2.0
TL = dict(title=Q['title'], questions=Q['questions'], qs=qs, introEnd=introEnd, mid=mid, outro=outro, dur=round(dur, 2), speak=speak)
json.dump(TL, open(D + 'tl.json', 'w'), ensure_ascii=False)
html = '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000;overflow:hidden}canvas{display:block}</style></head><body><canvas id="c" width="1920" height="1080"></canvas><script>\nconst TL=' + json.dumps(TL, ensure_ascii=False) + ';\nconst W=1920,H=1080;const cv=document.getElementById("c");const ctx=cv.getContext("2d");\n' + open(D + 'kid.js').read() + '\n</script></body></html>'
open(D + 'kid.html', 'w').write(html)
if real:
    N = int(dur * SR); v = np.zeros(N)
    for c, s in place: i = int(s * SR); v[i:i + len(c)] += c[:N - i]
    v /= np.abs(v).max() * 1.05; wavfile.write(D + 'voice.wav', SR, (np.stack([v, v], 1) * 32767).astype(np.int16))
    print('low', low)
print('real' if real else 'provisional', 'dur', round(dur, 1))
