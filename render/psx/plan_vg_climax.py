# Plan for the PS1 test segment of "Vũng giữ xác": s9 + TH1 + TH2 (timeline seconds from tl.json), one entry per frame.
import json, subprocess, numpy as np
P = '/home/claude/giong-doc/pipeline/tiktok_vunggiuxac/'
tl = json.load(open(P + 'tl.json')); TL, VOX = tl['TL'], tl['VOX']
T0, T1, FPS = TL['s9'][0], TL['TH2'][1], 30
sr = 16000; a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', P + 'voice.wav', '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'], capture_output=True).stdout, np.int16) / 32768
def rms(t): i = int(t * sr); w = a[i:i + sr // FPS]; return float(np.sqrt((w ** 2).mean())) if len(w) else 0
pk = max(rms(T0 + k / FPS) for k in range(int((T1 - T0) * FPS))) or 1
lines = {l.split('|')[0]: l.split('|')[2].strip() for l in open(P + 'script.txt', encoding='utf-8') if l.count('|') >= 2}
# captions: split each line into short chunks, timed across its voiced phrases (VOX) by character count
caps = []
for key in ('s9', 'TH1', 'TH2'):
    words = lines[key].split(); chunks, cur = [], []
    for w in words:
        cur.append(w)
        if len(' '.join(cur)) > 26 or w[-1] in '.?!,…': chunks.append(' '.join(cur)); cur = []
    if cur: chunks.append(' '.join(cur))
    s, e = TL[key][0], VOX[key][-1][1]; tot = sum(len(c) for c in chunks); t = s
    for c in chunks: d = (e - s) * len(c) / tot; caps.append((t, t + d, c)); t += d
# shots: (start, end, shot, local-time offset)
SH = [(TL['s9'][0], 143.2, 'walk', 0), (143.2, 146.0, 'water', 0), (146.0, TL['TH1'][0], 'face', 0), (TL['TH1'][0], TL['TH2'][0], 'mcu2', 0), (TL['TH2'][0], 161.9, 'mcu', 0), (161.9, T1, 'mcu2', 7)]
fr = []
for k in range(int((T1 - T0) * FPS)):
    T = T0 + k / FPS; sh = next(x for x in SH if x[0] <= T < x[1]) if T < SH[-1][1] else SH[-1]
    talking = any(TL[n][0] <= T < TL[n][1] for n in ('TH1', 'TH2'))
    m = min(1, rms(T) / pk * 2.2) if talking else 0
    cap = next((c for s, e, c in caps if s <= T < e), '')
    fr.append({'shot': sh[2], 't': round(T - sh[0] + sh[3], 4), 'mouth': {'THIN': m}, 'cap': cap})
json.dump({'t0': T0, 't1': T1, 'frames': fr}, open('vg_climax_plan.json', 'w'), ensure_ascii=False)
print(len(fr), 'frames', round(T1 - T0, 2), 's'); print(*caps, sep='\n')
