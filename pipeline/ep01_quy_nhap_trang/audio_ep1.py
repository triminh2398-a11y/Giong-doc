import numpy as np, json
from scipy import signal
from scipy.io import wavfile
TL = json.load(open('/home/claude/ep1/tl.json'))
SR = 24000; DUR = TL['dur']; N = int(SR * DUR)
rng = np.random.default_rng(7)
t = (np.arange(N) / SR).astype(np.float32)
L = np.zeros(N, np.float32); R = np.zeros(N, np.float32); SEND = np.zeros(N, np.float32)
SC = {}
for k, a, b, ls in TL['scenes']: SC.setdefault(k, (a, b, ls))
def sc(k): return SC[k]
def at(k, i=0, off=0.0):
    a, b, ls = SC[k]; return a + (ls[i] if i < len(ls) else ls[-1]) + off
def env(a, b, fi=0.5, fo=0.5):
    return np.clip((t - a) / max(fi, 1e-3), 0, 1) * np.clip((b - t) / max(fo, 1e-3), 0, 1) * ((t >= a) & (t <= b))
def bp(x, lo, hi, o=4): return signal.sosfilt(signal.butter(o, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def lp(x, f, o=4): return signal.sosfilt(signal.butter(o, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f, o=4): return signal.sosfilt(signal.butter(o, f, 'highpass', fs=SR, output='sos'), x)
def add(x, g=1.0, pan=0.0, send=0.0):
    global L, R, SEND
    L += x * g * np.sqrt((1 - pan) / 2); R += x * g * np.sqrt((1 + pan) / 2); SEND += x * g * send
def place(sig, when, g=1.0, pan=0.0, send=0.0):
    i = int(max(when, 0) * SR); n = min(len(sig), N - i)
    if n <= 0: return
    x = sig[:n] * g
    L[i:i + n] += x * np.sqrt((1 - pan) / 2); R[i:i + n] += x * np.sqrt((1 + pan) / 2); SEND[i:i + n] += x * send
def nz(d): return rng.standard_normal(int(d * SR)).astype(np.float32)
def tt_(d): return np.arange(int(d * SR)) / SR
def boom(dur=3.0, f=48):
    tt = tt_(dur); return np.sin(2 * np.pi * (f * np.exp(-tt * 0.6)) * tt) * np.exp(-tt * 1.4) + lp(nz(dur), 400) * np.exp(-tt * 9) * 0.6
def thunder(d=4.0):
    tt = tt_(d); x = lp(nz(d), 900) * (np.exp(-tt * 1.2) * (1 + 0.6 * np.sin(2 * np.pi * 3 * tt))) + bp(nz(d), 1500, 5000) * np.exp(-tt * 12) * 0.6
    return x / np.abs(x).max()
def whoosh(d=0.5):
    tt = tt_(d); return bp(nz(d), 300, 3000) * np.sin(np.pi * tt / d) ** 2
def mask(keys, fi=0.3, fo=0.3):
    m = np.zeros(N, np.float32)
    for k, a, b, ls in TL['scenes']:
        if k in keys: m = np.maximum(m, env(a, b, fi, fo))
    return m
def loud_slice(x, a, b):
    m = env(a, b, 0.3, 0.3); return x * m
STORY = [k for k, a, b, ls in TL['scenes']]
night1 = ['night1_hall', 'night1_rain', 'night1_roof', 'night1_steps', 'night1_drink', 'night1_sound', 'night1_hand']
night2 = ['night2_storm', 'night2_smell', 'lamp_out', 'dark_hall', 'relight', 'call_name', 'khoa_answer', 'cat_in', 'cat_jump', 'silence', 'finger', 'khoa_laugh', 'sit_up', 'corpse_face', 'corpse_stand', 'corpse_altar', 'remember_rule', 'khoa_run', 'khoa_caught', 'hide_altar', 'corpse_near']
# rain beds
rain = hp(lp(np.concatenate([nz(30)] * int(np.ceil(DUR / 30)))[:N], 9000), 400).astype(np.float32)
drops = np.zeros(N, np.float32); idx = rng.integers(0, N, int(DUR * 25)); drops[idx] = rng.uniform(0.3, 1, len(idx)); drops = bp(drops, 2000, 7000).astype(np.float32)
rmask = mask(['village_flood', 'mansion', 'khoa'] + night1, 1, 1) * 0.55 + mask(night2[:7] + ['khoa_answer', 'call_name', 'khoa_caught', 'hide_altar'], 1, 1) * 1.0 + mask(['funeral', 'night2_smell', 'cat_in', 'cat_jump', 'finger', 'sit_up', 'corpse_stand', 'remember_rule', 'khoa_run', 'corpse_near', 'corpse_face', 'khoa_laugh'], 1, 1) * 0.5
rmask = rmask * (1 - mask(['silence'], 0.6, 1.5) * 0.9)
add(rain * rmask, 0.06, -0.2, 0.1); add(drops * rmask, 0.05, 0.3)
# crickets on dry nights
cm = mask(['cold_cats', 'cold_corpse', 'mother', 'lam_home', 'night1_dawn'], 1, 1) * 0.6
for k, (f0, rate, pan) in enumerate(((4300, 22, -0.6), (4900, 27, 0.5))):
    c = bp(np.concatenate([nz(20)] * int(np.ceil(DUR / 20)))[:N], f0 - 150, f0 + 150, 2).astype(np.float32)
    am = (np.sin(2 * np.pi * rate * t) > 0.3) * (np.sin(2 * np.pi * (0.7 + k * 0.23) * t + k) > -0.2)
    add(c * am * cm, 0.06, pan)
# dread drone
d = np.sin(2 * np.pi * 55 * t) + 0.8 * np.sin(2 * np.pi * 58.4 * t) + 0.3 * np.sin(2 * np.pi * 110.7 * t)
dread = mask(['cold_corpse', 'title', 'cu_thach', 'mango_tree'] + night1, 1, 1) * 0.5 + mask(night2 + ['rooster'], 1, 2) * 1.0
add(d * dread * (0.8 + 0.2 * np.sin(2 * np.pi * 0.17 * t)), 0.06, 0, 0.15)
# rising cluster in climax
cl_ = sum(np.sin(2 * np.pi * f * t) for f in (293.7, 311.1, 329.6, 349.2))
a0 = sc('corpse_near')[0]; b0 = at('rooster', 0)
add(bp(cl_, 150, 3000) * np.clip((t - a0) / (b0 - a0), 0, 1) ** 2 * (t < b0), 0.05, 0, 0.4)
# stings
place(boom(3.0, 44), 0.2, 0.6, 0, 0.6)
place(boom(4.0, 38), sc('title')[0] + 0.2, 0.9, 0, 0.8)
place(boom(3.0, 50), at('cold_corpse', 1), 0.5, 0, 0.6)
place(boom(4.0, 40), at('sit_up', 0), 0.8, 0, 0.7)
place(boom(3.0, 44), at('corpse_face', 1), 0.6, 0, 0.6)
place(boom(4.0, 36), at('cat_jump', 2, 1.6), 0.7, 0, 0.7)
# v2 scenes
cm2 = mask(['epilogue'], 1, 1) * 0.5
add(bp(np.concatenate([nz(20)] * int(np.ceil(DUR / 20)))[:N], 4500, 4800, 2).astype(np.float32) * (np.sin(2 * np.pi * 24 * t) > 0.3) * cm2, 0.05, -0.4)
for k in range(10):  # scratching on the door
    tt = tt_(0.35); sc_ = bp(nz(0.35), 1500, 5000) * np.sin(np.pi * tt / 0.35) * (1 + 0.6 * np.sin(2 * np.pi * 30 * tt))
    place(sc_, at('night1_steps', 4, 0.3 + k * 0.62), 0.22, 0.5, 0.2)
for k in range(8):  # footsteps outside
    tt = tt_(0.2); place(lp(nz(0.2), 400) * np.exp(-tt * 20), at('night1_steps', 0, 0.4 + k * 0.7), 0.25, -0.5 + k * 0.12, 0.3)
place(boom(3.0, 46), at('ruin', 6, 0), 0.6, 0, 0.6)
tt = tt_(1.2); place(bp(nz(1.2), 300, 3000) * np.exp(-tt * 4) * 1.5 + np.sin(2 * np.pi * 180 * tt) * np.exp(-tt * 9), at('corpse_altar', 1, 0.85), 0.5, 0.3, 0.4)
place(boom(4.0, 40), at('corpse_altar', 2, 0), 0.6, 0, 0.7)
place(boom(4.0, 36), at('epilogue', 7, 0.2), 0.7, 0, 0.8)
# whoosh on cuts
for k, a, b, ls in TL['scenes']:
    if a > 1: place(whoosh(0.45), a - 0.25, 0.035, rng.uniform(-.4, .4), 0.2)
# thunder
for k, offs in (('night2_storm', [0.6, 2.4, 4.1, 6.8, 9.2]), ('khoa_caught', [1.2, 3.6]), ('hide_altar', [0.8, 3.2, 6.0, 8.5])):
    a = sc(k)[0]
    for o in offs:
        if a + o < sc(k)[1]: place(thunder(4.0), a + o + 0.15, 0.35, rng.uniform(-.5, .5), 0.5)
place(thunder(4.0), at('night1_roof', 2, 0.1), 0.3, 0, 0.5)
# groan "hự"
def groan(d=1.2, f=85):
    tt = tt_(d); s = signal.sawtooth(2 * np.pi * (f + 10 * np.sin(2 * np.pi * 3 * tt)) * tt) * np.sin(np.pi * tt / d) ** 1.5
    return bp(s + 0.3 * nz(d), 120, 900)
place(groan(1.0), at('night1_sound', 1, -0.6), 0.25, 0, 0.3)
place(groan(2.4, 70), at('corpse_face', 2, 0.3), 0.3, 0, 0.4)
# lamp gust + matches + creak
place(bp(nz(1.5), 200, 2000) * np.sin(np.pi * tt_(1.5) / 1.5), at('lamp_out', 0, 0.5), 0.25, 0, 0.3)
for o in (0.6, 1.6):
    place(hp(nz(0.15), 3000) * np.exp(-tt_(0.15) * 30), at('dark_hall', 1, o), 0.3, 0.3)
place(hp(nz(0.3), 2500) * np.exp(-tt_(0.3) * 8), sc('relight')[0] + 0.05, 0.3, 0.3)
def creak(d=1.0):
    tt = tt_(d); f = 180 + 60 * np.sin(2 * np.pi * 1.3 * tt); s = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR) * (np.sin(2 * np.pi * 23 * tt) > 0) * np.sin(np.pi * tt / d)
    return bp(s, 300, 2500)
place(creak(1.2), at('dark_hall', 2, 0.3), 0.12, 0, 0.4)
place(creak(2.5), at('sit_up', 0, 0.4), 0.14, 0, 0.4)
# basket lid clack
def knock():
    tt = tt_(0.25); return (np.sin(2 * np.pi * 170 * tt) + 0.5 * np.sin(2 * np.pi * 310 * tt)) * np.exp(-tt * 30) + lp(nz(0.25), 2000) * np.exp(-tt * 90) * 0.5
place(knock(), at('khoa_answer', 3, 0.05), 0.5, 0.4, 0.4)
# bone cracks
for k in range(7): place(hp(nz(0.04), 2000) * np.exp(-tt_(0.04) * 80), at('finger', 2, 0.2 + k * 0.22), 0.4, -0.2, 0.2)
# hops / thuds
def thud(): tt = tt_(0.3); return np.sin(2 * np.pi * 60 * tt) * np.exp(-tt * 18) + lp(nz(0.3), 300) * np.exp(-tt * 25) * 0.6
for k in ('khoa_run',):
    a, b, ls = sc(k); t0 = a + ls[2] if len(ls) > 2 else a
    x = t0
    while x < b: place(thud(), x, 0.7, 0, 0.3); x += np.pi / 3.2
a, b, ls = sc('hide_altar'); x = a + 0.4
while x < b: place(thud(), x, 0.45, rng.uniform(-.6, .6), 0.3); x += 1.1
place(boom(1.0, 120) * 0.6, at('khoa_caught', 0, 0.2), 0.5, -0.3, 0.3)
place(boom(2.0, 60), at('collapse', 1, 0.5), 0.7, 0, 0.5)
# heartbeat
for k in ('call_name', 'hide_altar', 'corpse_near'):
    a, b, ls = sc(k); bt = a + 0.3; bpm = 70
    while bt < b:
        for off, g in ((0, 1.0), (0.16, 0.7)):
            tt = tt_(0.25); place(np.sin(2 * np.pi * (52 - 20 * tt) * tt) * np.exp(-tt * 18) * g, bt + off, 0.45)
        bpm = min(130, bpm + 3); bt += 60 / bpm
# water drip
place(np.sin(2 * np.pi * 1400 * tt_(0.1) * (1 + tt_(0.1) * 3)) * np.exp(-tt_(0.1) * 40), at('corpse_near', 2, 0.6), 0.25, 0, 0.6)
# rooster
def rooster():
    tt = tt_(1.4); f = np.interp(tt, [0, .15, .4, 1.0, 1.4], [500, 800, 950, 880, 600])
    s = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR) * np.interp(tt, [0, .05, 1.2, 1.4], [0, 1, .8, 0]); return bp(s, 500, 4500)
for k, offs in (('rooster', [0.2, 1.8, 3.0]), ('night1_dawn', [0.3])):
    for o in offs: place(rooster(), sc(k)[0] + o, 0.08 if o == offs[0] else 0.05, rng.uniform(-.5, .5), 0.5)
# birds in daytime
for k in ('ba_tu', 'khoa', 'khoa_cat', 'mother_day', 'morning', 'mother', 'thay_morning', 'night1_dawn'):
    if k not in SC: continue
    a, b, ls = sc(k)
    for _ in range(int((b - a) / 1.5)):
        when = a + rng.random() * (b - a - 0.3); tt = tt_(0.18); f = 2800 + rng.random() * 1500
        place(np.sin(2 * np.pi * (f + 900 * np.sin(2 * np.pi * 12 * tt)) * tt) * np.sin(np.pi * tt / 0.18), when, 0.018, rng.uniform(-.6, .6), 0.4)
# bell chime on subscribe cards
def bell(f=440, d=3.0):
    tt = tt_(d); return sum(np.sin(2 * np.pi * f * m * tt) * np.exp(-tt * (1.2 + m)) / m for m in (1, 2.01, 2.76, 4.1))
for k in ('midroll', 'outro'):
    if k in SC: place(bell(880, 2.5), sc(k)[0] + 1.0, 0.05, 0.3, 0.5)
# reverb
irn = int(2.8 * SR); it = np.arange(irn) / SR
for side in (0, 1):
    ir = rng.standard_normal(irn) * np.exp(-it * 2.2); ir = lp(ir, 5000); ir /= np.sqrt((ir ** 2).sum())
    wet = signal.oaconvolve(SEND, ir.astype(np.float32))[:N]
    if side == 0: L += wet * 0.5
    else: R += wet * 0.5
fade = np.clip((DUR - t) / 1.5, 0, 1) * np.clip(t / 0.05, 0, 1)
out = np.stack([L * fade, R * fade], 1); out /= np.abs(out).max() * 1.12
wavfile.write('/home/claude/ep1/sfx.wav', SR, (out * 32767).astype(np.int16)); print('ok')
