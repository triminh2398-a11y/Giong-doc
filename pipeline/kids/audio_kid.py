import numpy as np, json, os
from scipy import signal
from scipy.io import wavfile
D = os.path.dirname(os.path.abspath(__file__)) + '/'
TL = json.load(open(D + 'tl.json'))
SR = 24000; DUR = TL['dur']; N = int(SR * DUR)
rng = np.random.default_rng(3)
L = np.zeros(N, np.float32); R = np.zeros(N, np.float32)
def place(sig, when, g=1.0, pan=0.0):
    i = int(max(when, 0) * SR); n = min(len(sig), N - i)
    if n <= 0: return
    x = (sig[:n] * g).astype(np.float32); L[i:i + n] += x * np.sqrt((1 - pan) / 2); R[i:i + n] += x * np.sqrt((1 + pan) / 2)
def tt_(d): return np.arange(int(d * SR)) / SR
def note(f, d=0.4, kind='pluck'):
    tt = tt_(d)
    if kind == 'pluck': return (np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(4 * np.pi * f * tt) + 0.2 * np.sin(6 * np.pi * f * tt)) * np.exp(-tt * 7)
    if kind == 'marimba': return (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * 4 * f * tt) * np.exp(-tt * 30)) * np.exp(-tt * 9)
    return np.sin(2 * np.pi * f * tt) * np.exp(-tt * 3)
# background music: I–V–vi–IV in C, 104 bpm, marimba arpeggio + soft bass
bpm = 104; beat = 60 / bpm
prog = [(261.6, 329.6, 392.0), (196.0, 246.9, 293.7), (220.0, 261.6, 329.6), (174.6, 220.0, 261.6)]
bar = 4 * beat; nb = int(DUR / bar) + 1
mel = [0, 1, 2, 1, 2, 1, 0, 2]
for b in range(nb):
    ch = prog[b % 4]; t0 = b * bar
    place(note(ch[0] / 2, bar * 0.9, 'pad'), t0, 0.10)
    for k in range(8):
        f = ch[mel[k]] * (2 if k in (3, 5) else 1)
        place(note(f, 0.35, 'marimba'), t0 + k * beat / 2, 0.045, -0.3 + 0.6 * (k % 2))
# duck music while counting down? keep; add ticks
def tick(hi=False):
    tt = tt_(0.06); return np.sin(2 * np.pi * (1800 if hi else 1300) * tt) * np.exp(-tt * 80)
for q in TL['qs']:
    for k in range(5): place(tick(k >= 3), q['tc0'] + k, 0.35)
    tt = tt_(0.8); ding = (np.sin(2 * np.pi * 1046.5 * tt) + np.sin(2 * np.pi * 1568 * tt) * 0.6) * np.exp(-tt * 4)
    place(ding, q['ta'] - 0.05, 0.35)
    for k in range(4):
        tk = q['to'] + (q['toEnd'] - q['to']) * k / 4; tt = tt_(0.12)
        place(np.sin(2 * np.pi * (500 + 300 * tt / 0.12) * tt) * np.exp(-tt * 25), tk - 0.1, 0.25)
    tt = tt_(0.4); place(signal.sosfilt(signal.butter(2, [400, 3000], 'bandpass', fs=SR, output='sos'), rng.standard_normal(len(tt))) * np.sin(np.pi * tt / 0.4) ** 2, q['tq'] - 0.5, 0.06)
def fanfare(t0, g=0.2):
    for k, f in enumerate((523.3, 659.3, 784.0, 1046.5)): place(note(f, 0.6, 'pluck'), t0 + k * 0.12, g)
if TL.get('mid'): fanfare(TL['mid'][0] + 0.1)
fanfare(0.3, 0.15)
# applause at outro
tt = tt_(3.0); ap = np.zeros(len(tt))
for _ in range(400):
    i = rng.integers(0, len(tt) - 300); ap[i:i + 300] += rng.standard_normal(300) * np.exp(-np.arange(300) / 40)
ap = signal.sosfilt(signal.butter(2, [800, 6000], 'bandpass', fs=SR, output='sos'), ap) * np.sin(np.pi * tt / 3.0)
place(ap / np.abs(ap).max(), TL['outro'] + 0.5, 0.25)
t = np.arange(N) / SR
fade = (np.clip((DUR - t) / 1.5, 0, 1) * np.clip(t / 0.5, 0, 1)).astype(np.float32)
out = np.stack([L * fade, R * fade], 1); out /= np.abs(out).max() * 1.12
wavfile.write(D + 'sfx.wav', SR, (out * 32767).astype(np.int16)); print('ok')
