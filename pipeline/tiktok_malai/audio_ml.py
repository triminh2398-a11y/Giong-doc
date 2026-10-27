import numpy as np, json
from scipy import signal
from scipy.io import wavfile
TL = json.load(open('/home/claude/ml/tl.json'))
SR = 48000; DUR = TL['dur']; N = int(SR * DUR)
rng = np.random.default_rng(5)
t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N); SEND = np.zeros(N)
ST = TL['starts']; SC = {str(n): (a, b) for n, a, b in TL['scenes']}
def sc(n): return SC[str(n)]
def env(a, b, fi=0.5, fo=0.5):
    return np.clip((t - a) / max(fi, 1e-3), 0, 1) * np.clip((b - t) / max(fo, 1e-3), 0, 1) * ((t >= a) & (t <= b))
def bp(x, lo, hi, o=4): return signal.sosfilt(signal.butter(o, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def lp(x, f, o=4): return signal.sosfilt(signal.butter(o, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f, o=4): return signal.sosfilt(signal.butter(o, f, 'highpass', fs=SR, output='sos'), x)
def add(x, g=1.0, pan=0.0, send=0.0):
    global L, R, SEND
    L += x * g * np.sqrt((1 - pan) / 2); R += x * g * np.sqrt((1 + pan) / 2); SEND += x * g * send
def place(sig, at, g=1.0, pan=0.0, send=0.0):
    x = np.zeros(N); i = int(max(at, 0) * SR); n = min(len(sig), N - i)
    if n > 0: x[i:i + n] = sig[:n]
    add(x, g, pan, send)
white = lambda: rng.standard_normal(N)
def nz(d): return rng.standard_normal(int(d * SR))
def tt_(d): return np.arange(int(d * SR)) / SR
def boom(dur=3.0, f=48):
    tt = tt_(dur); return np.sin(2 * np.pi * (f * np.exp(-tt * 0.6)) * tt) * np.exp(-tt * 1.4) + lp(nz(dur), 400) * np.exp(-tt * 9) * 0.6
def whoosh(d=0.5):
    tt = tt_(d); x = nz(d); e = np.sin(np.pi * tt / d) ** 2
    return bp(x, 300, 3000) * e
def bell(f=440, d=3.0):
    tt = tt_(d); return sum(np.sin(2 * np.pi * f * m * tt) * np.exp(-tt * (1.2 + m)) / m for m in (1, 2.01, 2.76, 4.1))
def mask(names):
    m = np.zeros(N)
    for n in names:
        if str(n) in SC: a, b = sc(n); m = np.maximum(m, env(a, b, 0.2, 0.2))
    return m

night = mask([0, 1, 2, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 27, 29, 30, 32, 33, 40, 42])
for k, (f0, rate, pan) in enumerate(((4300, 22, -0.6), (4700, 27, 0.5), (5100, 19, 0.1))):
    c = bp(white(), f0 - 150, f0 + 150, 2)
    am = (np.sin(2 * np.pi * rate * t) > 0.3) * (np.sin(2 * np.pi * (0.7 + k * 0.23) * t + k) > -0.2)
    add(c * am * night, 0.07, pan)
wind = bp(white(), 200, 900) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * t + 1))
add(wind, 0.035, 0.2, 0.2)
add(lp(white(), 250) * mask([8, 9, 11, 12, 13, 14, 15, 16, 17, 23, 27, 28, 29, 30, 32, 33, 38, 39]), 0.05)
# dread drone, stronger in horror stretches
d = np.sin(2 * np.pi * 55 * t) + 0.8 * np.sin(2 * np.pi * 58.4 * t) + 0.3 * np.sin(2 * np.pi * 110.7 * t)
dread = 0.35 + 0.65 * mask([0, 1, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 27, 28, 29, 30, 33, 34, 35, 39, 42])
add(d * dread * (0.8 + 0.2 * np.sin(2 * np.pi * 0.17 * t)) * (1 - mask([3, 22, 31, 36, 41]) * 0.8), 0.06, 0, 0.15)
# ghost glassy tone when the head is on screen
gl = np.sin(2 * np.pi * 932 * t) + np.sin(2 * np.pi * 988 * t) + 0.5 * np.sin(2 * np.pi * 1397 * t)
add(gl * mask([0, 1, 'TITLE', 19, 20, 21, 29, 33, 'END']), 0.010, 0.2, 0.6)
# stings
place(boom(3.0, 44), 0.05, 0.7, 0, 0.6)
place(boom(2.5, 60), sc(1)[0], 0.5, 0, 0.6)
place(boom(4.0, 38), sc('TITLE')[0], 0.9, 0, 0.8)
place(boom(4.0, 40), sc(17)[0], 0.9, 0, 0.7)
place(boom(3.0, 50), sc(20)[0], 0.6, 0, 0.6)
place(boom(4.0, 36), sc(35)[1], 0.9, 0, 0.8)
jump = sc(42)[1] - 0.9
place(boom(3.5, 42), jump, 1.0, 0, 0.7)
tt = tt_(1.2); place(bp(signal.sawtooth(2 * np.pi * (900 + 600 * tt) * tt), 600, 5000) * np.exp(-tt * 3), jump, 0.18, 0, 0.8)
place(boom(3.0, 40), sc('END')[0] + 0.1, 0.5, 0, 0.8)
# subliminal flash stingers
FLASHES=[sc(k)[0]+(sc(k)[1]-sc(k)[0])*0.55 for k in (8,12,18,27,38)]
for f in FLASHES:
    tt=tt_(0.5);place(bp(nz(0.5),400,6000)*np.exp(-tt*9)+np.sin(2*np.pi*(1800-900*tt)*tt)*np.exp(-tt*7)*0.5,f,0.25,0,0.6)
# whooshes on cuts
for n, a, b in TL['scenes']:
    if a > 1: place(whoosh(0.45), a - 0.3, 0.05, rng.uniform(-.4, .4), 0.2)
# wedding bells & drum
a, b = sc(3)
for i in range(5): place(bell(523 if i % 2 else 659, 2.5), a + 0.2 + i * 0.7, 0.07, rng.uniform(-.5, .5), 0.5)
for i in range(int((b - a) / 0.5)): place(boom(0.3, 120) * 0.5, a + i * 0.5, 0.12, 0, 0.1)
# crows
a, b = sc(7)
for i in range(4):
    tt = tt_(0.35); cw = bp(signal.sawtooth(2 * np.pi * (420 - 120 * tt) * tt) + 0.4 * nz(0.35), 300, 2500) * np.sin(np.pi * tt / 0.35)
    place(cw, a + 0.3 + i * 0.9, 0.06, rng.uniform(-.7, .7), 0.5)
# baby cry
def cry(d=1.4):
    tt = tt_(d); f = 480 + 80 * np.sin(np.pi * tt / d) + 15 * np.sin(2 * np.pi * 7 * tt)
    s = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / d) ** 0.7
    return bp(s, 500, 4000)
for n, g in ((9, 0.07), (21, 0.035)):
    a, b = sc(n); k = a + 0.2
    while k < b - 0.6: place(cry(1.3), k, g, 0.3, 0.4); k += 1.7
# heartbeat
for n in (16, 17, 30):
    a, b = sc(n); bt = a + 0.1
    while bt < b:
        for off, g in ((0, 1.0), (0.16, 0.7)):
            tt = tt_(0.25); place(np.sin(2 * np.pi * (52 - 20 * tt) * tt) * np.exp(-tt * 18) * g, bt + off, 0.5)
        bt += 0.62
# rustle
a, b = sc(18)
for i in range(10):
    tt = tt_(0.25); place(bp(nz(0.25), 2000, 7000) * np.sin(np.pi * tt / 0.25), a + 0.4 + i * 0.35 + rng.random() * 0.1, 0.05, 0.4, 0.4)
# tear "xoet"
a, b = sc(28); tt = tt_(0.7)
x = nz(0.7); sw = bp(x, 800, 6000) * np.exp(-tt * 4) * (1 + np.sin(2 * np.pi * 60 * tt)) / 2
place(sw, a + 0.3, 0.35, 0, 0.5)
# rooster
a, b = sc(26)
def rooster():
    tt = tt_(1.4); f = np.interp(tt, [0, .15, .4, 1.0, 1.4], [500, 800, 950, 880, 600])
    s = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR) * np.interp(tt, [0, .05, 1.2, 1.4], [0, 1, .8, 0])
    return bp(s, 500, 4500)
place(rooster(), a + 0.3, 0.08, 0.2, 0.5)
# knocks
a, b = sc(37)
def knock():
    tt = tt_(0.25); return (np.sin(2 * np.pi * 170 * tt) + 0.5 * np.sin(2 * np.pi * 310 * tt)) * np.exp(-tt * 30) + lp(nz(0.25), 2000) * np.exp(-tt * 90) * 0.5
for k in (0.4, 0.8, 1.2, 2.2, 2.6): place(knock(), a + k, 0.6, 0, 0.4)
# day birds
for n in (6, 22, 24, 36, 41):
    if str(n) not in SC: continue
    a, b = sc(n)
    for k in range(5):
        at = a + rng.random() * (b - a - 0.3); tt = tt_(0.18); f = 2800 + rng.random() * 1500
        place(np.sin(2 * np.pi * (f + 900 * np.sin(2 * np.pi * 12 * tt)) * tt) * np.sin(np.pi * tt / 0.18), at, 0.02, rng.uniform(-.6, .6), 0.4)
# flashback warm pad
a, b = sc(31)
pad = sum(np.sin(2 * np.pi * f * t) for f in (220, 277.2, 329.6))
add(pad * env(a, b, 0.6, 0.6), 0.02, 0, 0.6)
# end pad
a, b = sc('END')
add(d * env(a, DUR, 1, 1), 0.05, 0, 0.3)

irn = int(2.8 * SR); it = np.arange(irn) / SR
for side in (0, 1):
    ir = rng.standard_normal(irn) * np.exp(-it * 2.2); ir = lp(ir, 5000); ir /= np.sqrt((ir ** 2).sum())
    wet = signal.fftconvolve(SEND, ir)[:N]
    if side == 0: L += wet * 0.5
    else: R += wet * 0.5
c0 = sc(35)[1]; L[int((c0 - 0.06) * SR):int(c0 * SR)] = 0; R[int((c0 - 0.06) * SR):int(c0 * SR)] = 0
fade = np.clip((DUR - t) / 0.8, 0, 1) * np.clip(t / 0.05, 0, 1)
out = np.stack([L * fade, R * fade], 1); out /= np.abs(out).max() * 1.12
wavfile.write('/home/claude/ml/sfx.wav', SR, (out * 32767).astype(np.int16)); print('ok')
