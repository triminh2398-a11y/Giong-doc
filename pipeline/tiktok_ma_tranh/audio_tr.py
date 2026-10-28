import json, numpy as np
from scipy import signal
from scipy.io import wavfile
SR = 48000; T = json.load(open('/home/claude/tr/tl.json')); DUR = T['dur']; N = int(DUR * SR); t = np.arange(N) / SR
rng = np.random.default_rng(5); out = np.zeros(N)
lp = lambda x, f: signal.sosfilt(signal.butter(2, f, 'low', fs=SR, output='sos'), x)
bp = lambda x, a, b: signal.sosfilt(signal.butter(2, [a, b], 'band', fs=SR, output='sos'), x)
SC = {}
for k, a, b, ls in T['scenes']: SC.setdefault(k, []).append((a, b, ls))
def mask(keys, f=0.4):
    m = np.zeros(N)
    for k in keys:
        for a, b, ls in SC.get(k, []):
            i0, i1 = int(a * SR), int(b * SR); m[i0:i1] = 1
    k = int(f * SR); c = np.cumsum(np.concatenate([np.zeros(k // 2 + 1), m, np.zeros(k)])); return (c[k:k + N] - c[:N]) / k
def place(x, at, g=1.0):
    i = int(at * SR); n = min(len(x), N - i)
    if n > 0 and i >= 0: out[i:i + n] += x[:n] * g
night = ['hook','hook2','procession','stilt','yard','mom','hold','sleep','wake','empty','inside','call']
day = ['village','shrine','loss','clothes','prints','oldman','oldman2','tracks','warn','clothes2']
out += bp(rng.standard_normal(N), 3800, 4300) * (np.sin(2 * np.pi * 23 * t) > 0.3) * 0.03 * mask(night)
out += lp(rng.standard_normal(N), 380) * 0.07 * mask(night + ['ash', 'three', 'porch'])
birds = np.zeros(N)
for k in range(int(DUR * 1.2)):
    i = rng.integers(0, N - SR); f = rng.uniform(2500, 4200); d = rng.uniform(0.06, 0.15); kk = np.arange(int(d * SR)) / SR
    birds[i:i + len(kk)] += np.sin(2 * np.pi * (f + 900 * np.sin(kk * 40)) * kk) * np.sin(np.pi * kk / d)
out += birds * 0.022 * mask(day)
out += bp(rng.standard_normal(N), 500, 2500) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.3 * t)) * 0.05 * mask(['clothes', 'oldman', 'clothes2'], 0.8)
dr = (np.sin(2 * np.pi * 55 * t) + 0.8 * np.sin(2 * np.pi * 58.3 * t) + 0.3 * np.sin(2 * np.pi * 110.6 * t))
out += dr * 0.06 * mask(['hook', 'hook2', 'title', 'procession', 'yard', 'empty', 'three', 'porch', 'call', 'final'], 1.0)
def growl(d=2.5):
    kk = np.arange(int(d * SR)) / SR; am = 0.6 + 0.4 * np.sin(2 * np.pi * 11 * kk) * np.sin(2 * np.pi * 2.3 * kk)
    x = lp(rng.standard_normal(len(kk)), 260) * 3 * am + np.sin(2 * np.pi * (70 + 15 * np.sin(kk * 9)) * kk) * 0.6 * am
    return x * np.sin(np.pi * kk / d) ** 0.6
for k, at, g in (('hook2', 0.8, 0.6), ('title', 0.2, 0.5), ('procession', 1.0, 0.35), ('yard', 0.5, 0.3), ('call', 0.6, 0.35), ('final', 0.3, 0.7)):
    for a, bb, ls in SC.get(k, []): place(growl(), a + at, g)
for k in ('empty', 'three'):
    for a, bb, ls in SC.get(k, []):
        for hb in np.arange(a + 0.4, bb - 0.3, 0.75):
            for d, g in ((0, 1), (0.17, 0.7)):
                kk = np.arange(int(0.25 * SR)) / SR; place(np.sin(2 * np.pi * 48 * kk) * np.exp(-kk * 22), hb + d, g * 0.45)
def sting(d=2.2):
    kk = np.arange(int(d * SR)) / SR
    return sum(np.sin(2 * np.pi * f * kk) for f in (233, 247, 311, 349, 466)) / 5 * np.exp(-kk * 1.4) + bp(rng.standard_normal(len(kk)), 200, 6000) * np.exp(-kk * 5) * 0.9 + np.sin(2 * np.pi * (52 - 18 * kk) * kk) * np.exp(-kk * 2.5)
place(sting(2.0), SC['hook2'][0][0] + 0.3, 0.5)
place(sting(2.4), SC['title'][0][0], 0.55)
place(sting(1.8), SC['empty'][0][0], 0.45)
place(sting(1.8), SC['three'][0][0] + SC['three'][0][2][1], 0.4)
place(sting(2.6), SC['final'][0][0], 0.7)
a, bb, ls = SC['wake'][0]; kk = np.arange(int(2.2 * SR)) / SR; place(bp(rng.standard_normal(len(kk)), 300, 1500) * np.sin(np.pi * kk / 2.2) ** 2, a + 0.1, 0.35)
out /= np.abs(out).max() * 1.1
wavfile.write('/home/claude/tr/sfx.wav', SR, (np.stack([out, out], 1) * 32767).astype(np.int16))
print('ok')
