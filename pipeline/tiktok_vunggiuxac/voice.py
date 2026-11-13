# v3 (2.5D): narration MaDa (best of takes by ASR, hook/title slower), dialogue VieNeu placeholders by the PIPELINE voice table
# (young men Adam, shaman Thái Sơn, dead old man Đức Trí slowed + ghostfx). An ElevenLabs file el/<key>.mp3 replaces a take.
# Writes voice.wav + tl.json {TL, SPEECH, VOX, BEAT, SPK, dur}.
import json, re, difflib, importlib.util, os, sys, subprocess, tempfile, numpy as np
from scipy.io import wavfile
G = '/home/claude/giong-doc/'; D = G + 'pipeline/tiktok_vunggiuxac/'; sys.path.insert(0, G + 'pipeline/lib')
from ghostfx import ghost
spec = importlib.util.spec_from_file_location('pace', G + 'pipeline/lib/pace.py'); P = importlib.util.module_from_spec(spec); spec.loader.exec_module(P)
SR = 48000
SRC = {'N': [('99_vg_n', 'clone_refs_mada8_wav')], 'LUC': [('99_vg_luc', 'minh_triet')], 'THIN': [('99_vg_thin', 'thai_son')],
       'DUY': [('99_ck3_yng', 'adam')], 'VU': [('99_ck3_yng', 'adam')], 'THAY': [('99_ck3_thay', 'thai_son')]}
L = [l.split('|', 2) for l in open(D + 'script.txt', encoding='utf-8').read().strip().split('\n')]
norm = lambda s: re.sub(r'[^\w\s]', '', s.lower()).split()
def ff(c, af):
    d = tempfile.mkdtemp(); a = d + '/a.wav'; b = d + '/b.wav'
    wavfile.write(a, SR, (c / max(1e-9, np.abs(c).max()) * .9 * 32767).astype(np.int16))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a, '-af', af, b], check=True)
    r, y = wavfile.read(b); y = y.astype(np.float64) / 32768; return y if y.ndim == 1 else y.mean(1)
def vox(c, thr=26, gap=.14):
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
    return [x for x in m if x[1] - x[0] > .06]
GAP = {'hook': .8, 'title': .7, 's3': .6, 's5': .6, 's7': .6, 's8': .6, 's9': .5, 'TH2': .6, 'end': .9}
out = [np.zeros(int(.3 * SR))]; t = .3; TL = {}; SPEECH = {}; VOX = {}; picks = {}; SPK = {}
for k, sp, tx in L:
    SPK[k] = sp; best = None; el = D + f'el/{k}.mp3'
    if sp != 'N' and os.path.exists(el):
        os.system(f'ffmpeg -v error -y -i {el} -ar {SR} -ac 1 /tmp/_el.wav'); best = (1.0, '/tmp/_el')
    else:
        for job, vd in SRC[sp]:
            if not os.path.exists(G + f'jobs/{job}.json'): continue
            J = json.load(open(G + f'jobs/{job}.json'))
            for i, line in enumerate(J['lines']):
                if line != tx: continue
                f = G + f'out/{job}/{vd}/{i:02d}'
                if not os.path.exists(f + '.wav'): continue
                try: got = open(f + '.txt', encoding='utf-8').read()
                except Exception: got = ''
                r = difflib.SequenceMatcher(None, norm(tx), norm(got)).ratio()
                if best is None or r > best[0]: best = (r, f)
    if best is None: raise SystemExit(f'no take for {k}')
    picks[k] = round(best[0], 2); c = P.trim(P.load(best[1] + '.wav'))
    if sp == 'N':
        c = P.stretch_pauses(c, factor=1.3, extra=.06); c = ff(c, 'atempo=0.86' if k in ('hook', 'title') else 'atempo=0.94')
    elif sp == 'ONG':
        if not os.path.exists(el): c = ff(c, f'asetrate={int(SR * .92)},aresample={SR},atempo=0.9')
        c = ghost(c)
    a = t; VOX[k] = [[a + x, a + y] for x, y in vox(c)]; out.append(c * (1.0 if sp == 'N' else .95)); t += len(c) / SR; SPEECH[k] = [a, t]
    g = GAP.get(k, .35 if sp != 'N' else .45); out.append(np.zeros(int(g * SR))); t += g; TL[k] = [a - (.15 if k != 'hook' else 0), t]
TL['cta'][1] += 2.5; out.append(np.zeros(int(2.5 * SR))); t += 2.5
ks = [k for k, _, _ in L]
for i in range(1, len(ks)): TL[ks[i]][0] = TL[ks[i - 1]][1]
y = np.concatenate(out); wavfile.write(D + 'voice.wav', SR, (y / np.abs(y).max() * .9 * 32767).astype(np.int16))
def pauses(k): return [(x[1], y[0]) for x, y in zip(VOX[k], VOX[k][1:]) if y[0] - x[1] > .22]
BEAT = {}
for k, f in [('hook', .6), ('s4', .45), ('s9', .45), ('s6', .62)]:
    a, b = TL[k]; tgt = a + (b - a) * f; ps = pauses(k) + [(SPEECH[k][1], b)]
    BEAT[k] = round(min(ps, key=lambda q: abs(q[0] - tgt))[0] + .05, 3)
pp = [p[0] for p in pauses('s9')]
if len(pp) >= 4: BEAT['s9look'] = round(pp[1] + .05, 3); BEAT['s9'] = round(pp[3] + .05, 3)
for k in ('s3', 's9'): print(k, 'pauses', [round(p[0] - SPEECH[k][0], 2) for p in pauses(k)], 'len', round(SPEECH[k][1] - SPEECH[k][0], 2))
json.dump({'TL': TL, 'SPEECH': SPEECH, 'VOX': VOX, 'BEAT': BEAT, 'SPK': SPK, 'dur': t}, open(D + 'tl.json', 'w'), indent=0)
print('dur', round(t, 1), 'BEAT', BEAT, 'picks', picks)
