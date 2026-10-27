import json, os, re, glob, subprocess, sys, time
from vieneu import Vieneu
def slug(s): return re.sub(r'[^a-z0-9]+','_',s.lower().encode('ascii','ignore').decode()).strip('_') or 'v'
tts = Vieneu()
for job in sorted(glob.glob('jobs/*.json')):
    name = os.path.splitext(os.path.basename(job))[0]
    if os.path.exists(f'out/{name}/DONE'): continue
    J = json.load(open(job, encoding='utf-8'))
    for v in J['voices']:
        vdir = f'out/{name}/{slug(v)}'; os.makedirs(vdir, exist_ok=True)
        for i, line in enumerate(J['lines']):
            t0 = time.time()
            if v.startswith('clone:'):
                a = tts.infer(text=line, ref_audio=v[6:])
            else:
                a = tts.infer(text=line, voice=v)
            tts.save(a, f'{vdir}/{i:02d}.wav')
            subprocess.run(['ffmpeg','-y','-v','error','-i',f'{vdir}/{i:02d}.wav','-b:a','160k',f'{vdir}/{i:02d}.mp3'], check=True)
            os.remove(f'{vdir}/{i:02d}.wav'); print(name, v, i, round(time.time()-t0,1), flush=True)
    open(f'out/{name}/DONE','w').write('ok')
