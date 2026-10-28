import json, numpy as np
from scipy import signal
from scipy.io import wavfile
SR = 48000; T = json.load(open('/home/claude/tt2/tl.json')); DUR = T['dur']; N = int(DUR * SR); t = np.arange(N) / SR
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
    k = int(f * SR); return np.convolve(m, np.ones(k) / k, 'same')
def place(x, at, g=1.0):
    i = int(at * SR); n = min(len(x), N - i)
    if n > 0 and i >= 0: out[i:i + n] += x[:n] * g
night = ['hook', 'night1', 'knock', 'door', 'phone', 'crack', 'night2', 'knock2', 'open']
day = ['rent', 'morning', 'after']
out += bp(rng.standard_normal(N), 3800, 4300) * (np.sin(2 * np.pi * 23 * t) > 0.3) * 0.035 * mask(['hook', 'night1', 'night2'])
out += lp(rng.standard_normal(N), 450) * 0.06 * mask(night)
birds = np.zeros(N)
for k in range(int(DUR * 1.5)):
    i = rng.integers(0, N - SR); f = rng.uniform(2500, 4200); d = rng.uniform(0.06, 0.15); kk = np.arange(int(d * SR)) / SR
    birds[i:i + len(kk)] += np.sin(2 * np.pi * (f + 900 * np.sin(kk * 40)) * kk) * np.sin(np.pi * kk / d)
out += birds * 0.025 * mask(day)
dr = (np.sin(2 * np.pi * 55 * t) + 0.8 * np.sin(2 * np.pi * 58.3 * t) + 0.3 * np.sin(2 * np.pi * 110.6 * t))
out += dr * 0.06 * mask(['knock', 'door', 'phone', 'crack', 'knock2', 'open'], 1.0)
# clock ticks
for k in ('night1', 'night2'):
    for a, b, ls in SC.get(k, []):
        for tk in np.arange(a + 0.3, b, 1.0):
            kk = np.arange(int(0.03 * SR)) / SR; place(bp(rng.standard_normal(len(kk)), 2000, 6000) * np.exp(-kk * 200), tk, 0.25)
# knocks on wood
for tk, i, n in T['knocks']:
    kk = np.arange(int(0.35 * SR)) / SR
    x = np.sin(2 * np.pi * 95 * kk) * np.exp(-kk * 28) + bp(rng.standard_normal(len(kk)), 300, 1800) * np.exp(-kk * 45) * 0.8
    place(x, tk, 1.0)
# heartbeat in crack + open
for k in ('crack', 'open'):
    for a, b, ls in SC.get(k, []):
        for hb in np.arange(a + 0.5, b - 0.3, 0.75):
            for d, g in ((0, 1), (0.17, 0.7)):
                kk = np.arange(int(0.25 * SR)) / SR; place(np.sin(2 * np.pi * 48 * kk) * np.exp(-kk * 22), hb + d, g * 0.45)
# stingers: feet reveal, ghost reveal, title
def sting(d=2.2):
    kk = np.arange(int(d * SR)) / SR
    return sum(np.sin(2 * np.pi * f * kk) for f in (233, 247, 311, 349, 466)) / 5 * np.exp(-kk * 1.4) + bp(rng.standard_normal(len(kk)), 200, 6000) * np.exp(-kk * 5) * 0.9 + np.sin(2 * np.pi * (52 - 18 * kk) * kk) * np.exp(-kk * 2.5)
a, b, ls = SC['crack'][0]; place(sting(), a + ls[1], 0.55)
a, b, ls = SC['reveal'][0]; place(sting(2.6), a + ls[0] - 0.1, 0.9)
a, b, ls = SC['open'][0]; place(sting(1.8), a + ls[3], 0.4)
place(sting(2.0), SC['title'][0][0], 0.5)
# door creak when opening
a, b, ls = SC['open'][0]; kk = np.arange(int(1.2 * SR)) / SR; f = 120 + 60 * np.sin(kk * 6)
place(bp(signal.sawtooth(2 * np.pi * np.cumsum(f) / SR) * (1 + 0.5 * np.sin(2 * np.pi * 23 * kk)), 400, 2600) * np.sin(np.pi * kk / 1.2), a + 0.2, 0.25)
out /= np.abs(out).max() * 1.1
wavfile.write('/home/claude/tt2/sfx.wav', SR, (np.stack([out, out], 1) * 32767).astype(np.int16))
print('ok')
