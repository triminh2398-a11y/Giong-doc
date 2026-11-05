# tiếng động thật (sfxlib Mixkit) theo timeline tl.json → sfx.wav, jump.wav
import json,subprocess,os,numpy as np
from scipy.io import wavfile
D=os.path.dirname(os.path.abspath(__file__))+'/';SR=48000
T=json.load(open(D+'web/tl.json'));DUR=T['dur'];N=int(DUR*SR);out=np.zeros((N,2));jt=np.zeros((N,2))
LIB='/home/claude/giong-doc/sfxlib/mixkit/';CACHE='/home/claude/sfxcache/';os.makedirs(CACHE,exist_ok=True)
def load(i):
    w=CACHE+f'{i}.wav'
    if not os.path.exists(w):subprocess.run(['ffmpeg','-v','error','-y','-i',LIB+f'{i}-preview.mp3','-ar',str(SR),'-ac','2',w],check=True)
    r,x=wavfile.read(w);x=x.astype(float)/32768;return x/max(1e-6,np.abs(x).max())
def place(i,at,gn,dur=None,fi=.05,fo=.3,loop=False,buf=None):
    x=load(i)
    if dur:
        n=int(dur*SR)
        if loop and len(x)<n:x=np.tile(x,(n//len(x)+1,1))
        x=x[:n].copy()
    n=len(x);a=min(int(fi*SR),n);b=min(int(fo*SR),n)
    if a:x[:a]*=np.linspace(0,1,a)[:,None]
    if b:x[-b:]*=np.linspace(1,0,b)[:,None]
    s=int(at*SR);m=min(n,N-s);(out if buf is None else buf)[s:s+m]+=x[:m]*gn
SH={k:(a,b) for a,b,k in T['shots']};L={l['id']:l for l in T['lines']}
ra=SH['room'][0]
place(1789,0,.18,dur=ra,fi=1,fo=.6,loop=True);place(1162,0,.16,dur=ra,fi=1,fo=.6,loop=True)
place(2430,SH['field'][0],.25,dur=SH['field'][1]-SH['field'][0],loop=True)
place(337,SH['roof'][0]+.4,.35,dur=2);place(337,SH['roof'][0]+1.5,.25,dur=2)
place(1157,SH['listen'][0],.25,dur=SH['listen'][1]-SH['listen'][0]+.5,loop=True)
place(2430,L['g']['t']-.3,.18,dur=2.5)
place(494,SH['turn'][0],.35,dur=SH['turn'][1]-SH['turn'][0]+.4,loop=True)
place(2482,ra,.3,dur=DUR-ra,fi=.6,fo=1.2,loop=True);place(3081 if os.path.exists(LIB+'3081-preview.mp3') else 2482,ra,.12,dur=DUR-ra,fi=.6,fo=1)
eo=L['n5']['t']+L['n5']['d']*.62;place(677,eo,.35,dur=2.5);place(492,eo+.1,.3,dur=3)
# im lặng trước cú dọa + trước tiếng "ơi"
for t,d in [(T['jump'],.7),(L['g']['t'],.9)]:
    s0=int((t-d)*SR);s1=int(t*SR);out[s0:s1]*=np.linspace(1,.12,s1-s0)[:,None]
out/=np.abs(out).max()*1.05
tj=T['jump']
for i,dt,gn,du in [(788,-.01,.6,1.6),(1963,0,.45,1.3),(565,-.02,.5,1.4),(677,0,.3,1.2)]:place(i,tj+dt,gn,dur=du,fi=0,fo=.25,buf=jt)
jt/=np.abs(jt).max()*1.02
wavfile.write(D+'sfx.wav',SR,(out*32767).astype(np.int16));wavfile.write(D+'jump.wav',SR,(jt*32767).astype(np.int16));print('ok')
