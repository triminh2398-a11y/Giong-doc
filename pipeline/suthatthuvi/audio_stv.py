import numpy as np, json, os, subprocess
from scipy import signal
from scipy.io import wavfile
D = os.path.dirname(os.path.abspath(__file__)) + '/'
TL = json.load(open(D + 'tl.json')); SR = 24000; DUR = TL['dur']; N = int(SR * DUR)
rng = np.random.default_rng(1); L = np.zeros(N, np.float32); R = np.zeros(N, np.float32)
def place(sig, when, g=1.0, pan=0.0):
    i = int(max(when, 0) * SR); n = min(len(sig), N - i)
    if n <= 0: return
    x = (sig[:n] * g).astype(np.float32); L[i:i + n] += x * np.sqrt((1 - pan) / 2); R[i:i + n] += x * np.sqrt((1 + pan) / 2)
def tt_(d): return np.arange(int(d * SR)) / SR
bp = lambda x, lo, hi: signal.sosfilt(signal.butter(2, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
MUS = os.environ.get('MUSIC', '/home/claude/music/market_theme.mp3')
raw = subprocess.run(['ffmpeg', '-v', 'error', '-stream_loop', '-1', '-i', MUS, '-t', str(DUR), '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
m = np.frombuffer(raw, np.float32).reshape(-1, 2)[:N]; L[:len(m)] += m[:, 0] * 0.16; R[:len(m)] += m[:, 1] * 0.16
for nm, a, b, ls, txt in TL['scenes']:
    if a > 0.5:
        tt = tt_(0.35); place(bp(rng.standard_normal(len(tt)), 600, 5000) * np.sin(np.pi * tt / 0.35) ** 2, a - 0.1, 0.10, rng.uniform(-.5, .5))
    if nm == 'chap':
        tt = tt_(1.0); place((np.sin(2 * np.pi * 880 * tt) + 0.6 * np.sin(2 * np.pi * 1318 * tt)) * np.exp(-tt * 5), a + 0.1, 0.18)
    if nm in ('big', 'host'):
        tt = tt_(0.12); place(np.sin(2 * np.pi * (400 + 2500 * tt) * tt) * np.exp(-tt * 25), a + 0.15, 0.18)
    if nm == 'knife_cells':
        tt = tt_(0.3); place(signal.sosfilt(signal.butter(2, 1500, 'highpass', fs=SR, output='sos'), rng.standard_normal(len(tt))) * np.exp(-tt * 20), a + 0.85, 0.35)
t = np.arange(N) / SR; fade = (np.clip((DUR - t) / 1.5, 0, 1) * np.clip(t / 0.3, 0, 1)).astype(np.float32)
out = np.stack([L * fade, R * fade], 1); out /= np.abs(out).max() * 1.12
wavfile.write(D + 'sfx.wav', SR, (out * 32767).astype(np.int16)); print('ok')
