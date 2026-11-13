# Narration (MaDa, best of 3 by ASR) + placeholder dialogue (VieNeu) -> voice.wav + tl.json. Dialogue gets swapped for ElevenLabs later (same keys).
import json, re, difflib, importlib.util, os, numpy as np
from scipy.io import wavfile
G = '/home/claude/giong-doc/'; D = G + 'pipeline/tiktok_congkieng/'
spec = importlib.util.spec_from_file_location('pace', G + 'pipeline/lib/pace.py'); P = importlib.util.module_from_spec(spec); spec.loader.exec_module(P)
SR = 48000
SRC = {'N': ('99_ck_n', 'clone_refs_mada8_wav'), 'ONG': ('99_ck_old', 'duc_tri'), 'THAY': ('99_ck_old', 'duc_tri'), 'KHANG': ('99_ck_yng', 'thai_son'), 'DUY': ('99_ck_yng', 'thai_son')}
L = [l.split('|', 2) for l in open(D + 'script.txt', encoding='utf-8').read().strip().split('\n')]
norm = lambda s: re.sub(r'[^\w\s]', '', s.lower()).split()
GAP = {'hook': .7, 's5': .6, 's6': .6, 's7': .5, 's9': .6, 's10': .8, 'end': .8}
out = [np.zeros(int(.3 * SR))]; t = .3; TL = {}; SPEECH = {}; VOX = {}; picks = {}; SPK = {}
def vox(c, thr=30, gap=.12):
    n = int(.02 * SR); e = np.array([np.sqrt(np.mean(c[k:k + n] ** 2)) + 1e-7 for k in range(0, len(c) - n, n)]); db = 20 * np.log10(e); on = db > db.max() - thr; iv = []; k = 0
    while k < len(on):
        if on[k]:
            j = k
            while j < len(on) and on[j]: j += 1
            iv.append([k * .02, j * .02]); k = j
        else: k += 1
    m = []
    for a, b in iv:
        if m and a - m[-1][1] < gap: m[-1][1] = b
        else: m.append([a, b])
    return m
for k, sp, tx in L:
    SPK[k] = sp
    if k == 'title':
        TL[k] = [t, t + 2.6]; out.append(np.zeros(int(2.6 * SR))); t += 2.6; continue
    job, vd = SRC[sp]; J = json.load(open(G + f'jobs/{job}.json')); best = None
    el = D + f'el/{k}.mp3'
    if sp != 'N' and os.path.exists(el):  # ElevenLabs take, if the owner sent one
        os.system(f'ffmpeg -v error -y -i {el} -ar {SR} -ac 1 /tmp/_el.wav'); best = (1.0, '/tmp/_el')
    else:
        for i, line in enumerate(J['lines']):
            if line != tx: continue
            f = G + f'out/{job}/{vd}/{i:02d}'
            try: got = open(f + '.txt', encoding='utf-8').read()
            except Exception: got = ''
            r = difflib.SequenceMatcher(None, norm(tx), norm(got)).ratio()
            if best is None or r > best[0]: best = (r, f)
    picks[k] = round(best[0], 2)
    c = P.trim(P.load(best[1] + '.wav'))
    if sp == 'N': c = P.stretch_pauses(c, factor=1.3, extra=.06)
    g = GAP.get(k, .35 if sp != 'N' else .4); a = t; VOX[k] = [[a + x, a + y] for x, y in vox(c)]; out.append(c * (1.0 if sp == 'N' else .95)); t += len(c) / SR; SPEECH[k] = [a, t]; out.append(np.zeros(int(g * SR))); t += g; TL[k] = [a - (.15 if k != 'hook' else 0), t]
TL['cta'][1] += 2.0; out.append(np.zeros(int(2.0 * SR))); t += 2.0
ks = [k for k, _, _ in L]
for i in range(1, len(ks)): TL[ks[i]][0] = TL[ks[i - 1]][1]
y = np.concatenate(out); wavfile.write(D + 'voice.wav', SR, (y / np.abs(y).max() * .9 * 32767).astype(np.int16))
BEAT = {}
for k, f in [('hook', .55), ('s6', .75), ('end', .5)]:
    a, b = TL[k]; tgt = a + (b - a) * f; pauses = [(x[1], y[0]) for x, y in zip(VOX[k], VOX[k][1:]) if y[0] - x[1] > .2] + [(SPEECH[k][1], b)]
    p = min(pauses, key=lambda q: abs(q[0] - tgt)); BEAT[k] = round(p[0] + .05, 3)
json.dump({'TL': TL, 'SPEECH': SPEECH, 'VOX': VOX, 'BEAT': BEAT, 'SPK': SPK, 'dur': t}, open(D + 'tl.json', 'w'), indent=0)
print('dur', round(t, 1), 'BEAT', BEAT, 'picks', picks)
