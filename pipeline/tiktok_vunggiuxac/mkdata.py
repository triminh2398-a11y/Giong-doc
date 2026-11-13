# tl.json + script.txt -> render/vg/data.js (window.TLD: scenes, subs, vox, beat)
import json, re
G = '/home/claude/giong-doc/'; D = G + 'pipeline/tiktok_vunggiuxac/'
T = json.load(open(D + 'tl.json')); L = [l.split('|', 2) for l in open(D + 'script.txt', encoding='utf-8').read().strip().split('\n')]
scenes = [[k, round(T['TL'][k][0], 3), round(T['TL'][k][1], 3)] for k, _, _ in L]
subs = []
for k, sp, tx in L:
    if k == 'title': continue
    parts = [p.strip() for p in re.split(r'(?<=[.,!?…])\s+', tx) if p.strip()]
    ch = []
    for p in parts:
        w = p.split()
        while len(w) > 8: ch.append(' '.join(w[:6])); w = w[6:]
        if w: ch.append(' '.join(w))
    a, b = T['SPEECH'][k]; tot = sum(len(c) for c in ch); t = a
    for c in ch:
        d = (b - a) * len(c) / tot; subs.append([round(t, 3), round(t + d, 3), c.upper(), sp]); t += d
vox = [[round(x, 3), round(y, 3), T['SPK'][k]] for k in T['VOX'] for x, y in T['VOX'][k] if T['SPK'][k] != 'N']
open(G + 'render/vg/data.js', 'w').write('window.TLD=' + json.dumps({'scenes': scenes, 'subs': subs, 'vox': vox, 'beat': T['BEAT'], 'speech': T['SPEECH'], 'dur': T['dur']}, ensure_ascii=False) + ';')
print(len(subs), 'subs', round(T['dur'], 2))
