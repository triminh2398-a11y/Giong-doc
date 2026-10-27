import json, os, re, glob, time, traceback
os.makedirs('out', exist_ok=True)
LOG = open('out/log.txt', 'a', encoding='utf-8')
def log(*a):
    s = ' '.join(str(x) for x in a); print(s, flush=True); LOG.write(s + '\n'); LOG.flush()
def slug(s):
    import unicodedata
    s = unicodedata.normalize('NFD', s); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn').replace('đ', 'd').replace('Đ', 'D')
    return re.sub(r'[^a-z0-9]+', '_', s.lower()).strip('_') or 'v'
try:
    from vieneu import Vieneu
    import soundfile as sf
    tts = Vieneu()
    log('loaded', type(tts).__name__)
except Exception:
    log(traceback.format_exc()); raise SystemExit(0)
for job in sorted(glob.glob('jobs/*.json')):
    name = os.path.splitext(os.path.basename(job))[0]
    if os.path.exists(f'out/{name}/DONE'): continue
    J = json.load(open(job, encoding='utf-8'))
    for v in J['voices']:
        vdir = f'out/{name}/{slug(v)}'; os.makedirs(vdir, exist_ok=True)
        for i, line in enumerate(J['lines']):
            t0 = time.time()
            try:
                kw = J.get('kw', {})
                a = tts.infer(text=line, ref_audio=v[6:], **kw) if v.startswith('clone:') else tts.infer(text=line, voice=v, **kw)
                sr = getattr(tts, 'sample_rate', 48000)
                try: tts.save(a, f'{vdir}/{i:02d}.wav')
                except Exception: sf.write(f'{vdir}/{i:02d}.wav', a, sr)
                log(name, v, i, 'ok', round(time.time() - t0, 1))
            except Exception:
                log(name, v, i, 'FAIL', traceback.format_exc())
    if J.get('asr'):
        try:
            from faster_whisper import WhisperModel
            wm = WhisperModel('small', device='cpu', compute_type='int8')
            for f in sorted(glob.glob(f'out/{name}/*/*.wav')):
                segs, _ = wm.transcribe(f, language='vi', beam_size=5)
                open(f[:-4] + '.txt', 'w', encoding='utf-8').write(' '.join(x.text.strip() for x in segs))
            log(name, 'asr ok')
        except Exception:
            log(name, 'ASR FAIL', traceback.format_exc())
    open(f'out/{name}/DONE', 'w').write('ok')
