# Áo Trắng Qua Hang — âm thanh (Mixkit sfxlib + vài tiếng tổng hợp: màn trập, bíp, bật lửa, kéo lê)
import json,subprocess,os,numpy as np
from scipy.io import wavfile
from scipy.signal import lfilter
D=os.path.dirname(os.path.abspath(__file__))+'/';SR=48000
DUR=10.0;N=int(DUR*SR);out=np.zeros((N,2));jt=np.zeros((N,2))
LIB='/home/claude/giong-doc/sfxlib/mixkit/';CACHE='/home/claude/sfxcache/';os.makedirs(CACHE,exist_ok=True)
rng=np.random.default_rng(7)
def load(i,rate=1.0):
    if isinstance(i,np.ndarray):return i
    w=CACHE+(f'{i}.wav' if rate==1 else f'{i}_{rate}.wav')
    if not os.path.exists(w):subprocess.run(['ffmpeg','-v','error','-y','-i',LIB+f'{i}-preview.mp3',*(['-af',f'asetrate={int(SR*rate)},aresample={SR}'] if rate!=1 else []),'-ar',str(SR),'-ac','2',w],check=True)
    r,x=wavfile.read(w);x=x.astype(float)/32768;return x/max(1e-6,np.abs(x).max())
def place(i,at,gn,dur=None,fi=.05,fo=.3,loop=False,buf=None,rate=1.0):
    x=load(i,rate).copy()
    if dur:
        n=int(dur*SR)
        if loop and len(x)<n:x=np.tile(x,(n//len(x)+1,1))
        x=x[:n].copy()
    n=len(x);a=min(int(fi*SR),n);b=min(int(fo*SR),n)
    if a:x[:a]*=np.linspace(0,1,a)[:,None]
    if b:x[-b:]*=np.linspace(1,0,b)[:,None]
    s=max(0,int(at*SR));m=min(n,N-s)
    if m>0:(out if buf is None else buf)[s:s+m]+=x[:m]*gn
st=lambda x:np.stack([x,x],1)
def env(n,a,d):t=np.arange(n)/SR;return np.minimum(1,t/a)*np.exp(-t/d)

from scipy.signal import lfilter
def burst(sec,col=-0.5,d=.05):
    n=int(sec*SR);x=lfilter([1,col],[1],rng.normal(0,1,n))*env(n,.004,d);return st(x/np.abs(x).max())
place(1789,0,.25,dur=DUR,fi=.5,fo=1,loop=True);place(1736,0,.2,dur=DUR,fi=1,fo=1,loop=True)
for i,ts_ in enumerate([0.233, 0.702, 1.172, 1.64, 2.108, 2.577]): place(burst(.16,-.2,.04),ts_,.42*(1-.5*max(0,(ts_-2.4)/1.2)))
place(burst(.16,-.2,.04),7.05,.5)  # a shuffle as he turns, a scuff on the recoil
place(burst(.12,.5,.03),3.4,.3); place(burst(.12,.5,.03),3.75,.2)  # lantern creak
mu=np.zeros((N,2));_o=out;out=mu
place(2510,0,.6,dur=7.0,fi=1.5,fo=.4,loop=True);place(497,6.2,.5,dur=.8,fi=.3,fo=.1)
place(682,7.0,.9,dur=3,fi=.02,fo=1.5,loop=True);place(786,6.98,.9,dur=3,fi=.02,fo=1)
out=_o
for i,dt,gn,du in [(788,-.01,.9,1.8),(1963,0,.7,1.5),(565,-.02,.8,1.6),(1704,-.02,.6,2.0)]:place(i,7.0+dt,gn,dur=du,fi=0,fo=.25,buf=jt)
import glob
vf=sorted(glob.glob('/home/claude/giong-doc/out/99_rig_k/*/0*.wav'))
V=np.zeros((N,2))
if vf:
    r,v=wavfile.read(vf[1]);v=v.astype(float)/32768;v=v if v.ndim==1 else v.mean(1)
    if r!=SR:
        import scipy.signal as ss;v=ss.resample(v,int(len(v)*SR/r))
    a=int(4.7*SR);m=min(len(v),N-a);V[a:a+m]=np.stack([v[:m],v[:m]],1)/max(1e-6,np.abs(v).max())*.9
mix=V+mu/max(1e-6,np.abs(mu).max())*.22+out/max(1e-6,np.abs(out).max())*.5+jt/max(1e-6,np.abs(jt).max())*.7
mix=mix/np.abs(mix).max()*.92;wavfile.write('mix3.wav',SR,(mix*32767).astype(np.int16));print('ok',bool(vf))
