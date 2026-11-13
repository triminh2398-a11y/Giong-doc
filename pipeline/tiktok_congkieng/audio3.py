# Cổng làng treo dao gỗ — âm thanh: mưa chiều, gió núi đêm, dao gỗ gõ lách cách, máy ảnh, xe máy, nhịp tim
import json,subprocess,os,numpy as np
from scipy.io import wavfile
from scipy.signal import lfilter
D=os.path.dirname(os.path.abspath(__file__))+'/';SR=48000
T=json.load(open(D+'tl3.json'));DUR=T['dur'];N=int(DUR*SR);out=np.zeros((N,2));jt=np.zeros((N,2))
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
SHUT=st(np.concatenate([rng.normal(0,1,int(.012*SR))*env(int(.012*SR),.001,.004),np.zeros(int(.05*SR)),rng.normal(0,1,int(.03*SR))*env(int(.03*SR),.001,.008)]));SHUT=lfilter([1,-0.6],[1],SHUT,axis=0);SHUT/=np.abs(SHUT).max()
BEEP=st(np.sin(2*np.pi*2400*np.arange(int(.07*SR))/SR)*env(int(.07*SR),.003,.05));BEEP/=np.abs(BEEP).max()
FLICK=st(np.concatenate([rng.normal(0,1,int(.02*SR))*env(int(.02*SR),.001,.006),rng.normal(0,.35,int(.25*SR))*env(int(.25*SR),.01,.09)]));FLICK=lfilter([1],[1,-0.85],FLICK,axis=0);FLICK/=np.abs(FLICK).max()
CLICK=st(rng.normal(0,1,int(.015*SR))*env(int(.015*SR),.001,.003));CLICK/=np.abs(CLICK).max()
def drag(sec):
    n=int(sec*SR);x=lfilter([1],[1,-0.97],rng.normal(0,1,n));m=0.5+0.5*np.abs(np.sin(np.arange(n)/SR*2*np.pi*0.9));x=x*m;return st(x/np.abs(x).max())

SC={k:tuple(v) for k,v in T['TL'].items()};B=T['BEAT']
sp=lambda k:SC[k];S_=lambda k,f:SC[k][0]+(SC[k][1]-SC[k][0])*f
def bed(i,keys,g,rate=1.0):
    for k in keys:a,b=SC[k];place(i,a,g,dur=b-a+.3,fi=.6,fo=.6,loop=True,rate=rate)
def gong(f0=118,dur=3.5,seed=0):
    n=int(dur*SR);t=np.arange(n)/SR;x=np.zeros(n)
    for r,a,d in [(1,1,2.2),(2.03,.6,1.6),(2.76,.45,1.2),(3.91,.3,.8),(5.2,.15,.5)]:x+=a*np.sin(2*np.pi*f0*r*t+seed)*np.exp(-t/d)*(1+.15*np.sin(2*np.pi*3.3*t))
    x+=rng.normal(0,.3,n)*np.exp(-t/.03);return st(x/np.abs(x).max())
def burst(sec,col=-0.5,d=.05):
    n=int(sec*SR);x=lfilter([1,col],[1],rng.normal(0,1,n))*env(n,.005,d);return st(x/np.abs(x).max())
def saw(sec):
    n=int(sec*SR);t=np.arange(n)/SR;x=lfilter([1,-.3],[1],rng.normal(0,1,n))*(.35+.65*np.abs(np.sin(2*np.pi*2.2*t)))**2;return st(x/np.abs(x).max())
def engine(sec):
    n=int(sec*SR);t=np.arange(n)/SR;x=np.sign(np.sin(2*np.pi*38*t))*.6+np.sin(2*np.pi*76*t)*.4;x=lfilter([1],[1,-.96],x+rng.normal(0,.2,n));return st(x/np.abs(x).max())
def crackle(sec,rate=18):
    n=int(sec*SR);x=np.zeros(n)
    for k in range(int(sec*rate)):
        s=int(rng.uniform(0,n-2000));m=int(rng.uniform(300,1500));x[s:s+m]+=rng.normal(0,1,m)*env(m,.0005,.004)*rng.uniform(.3,1)
    x=lfilter([1,-.8],[1],x);return st(x/max(1e-6,np.abs(x).max()))

def clacks(sec,rate=3.0,seed=1):  # wooden knives knocking together in the wind
    r=np.random.default_rng(seed);n=int(sec*SR);x=np.zeros(n);t=0
    while t<sec-.2:
        t+=r.exponential(1/rate);s=int(t*SR)
        for j in range(r.integers(1,4)):
            s2=s+int(j*r.uniform(.04,.09)*SR);m=int(.05*SR)
            if s2+m<n:f=r.uniform(380,620);tt=np.arange(m)/SR;x[s2:s2+m]+=np.sin(2*np.pi*f*tt)*np.exp(-tt/.012)*r.uniform(.4,1)+r.normal(0,.3,m)*np.exp(-tt/.004)
    return st(x/max(1e-6,np.abs(x).max()))
def rumble(sec,seed=5):
    r=np.random.default_rng(seed);n=int(sec*SR);t=np.arange(n)/SR;x=lfilter([1],[1,-.995],r.normal(0,1,n));x=lfilter([1],[1,-.98],x)
    e=np.minimum(1,t/.15)*np.exp(-np.maximum(0,t-1.2)/2.2)*(1+.4*np.abs(np.sin(2*np.pi*1.7*t)));x=x*e;return st(x/np.abs(x).max())
bed(2483,['hook','title'],.2)                                   # đêm, rừng
bed(1253,['s1','s2','s3','O1','s4','D1','s5'],.2)               # mưa chiều
bed(1157,['s6','s7','V1','s8'],.18)                             # gió núi đêm ngoài nhà nghỉ
bed(2427,['s9','T1','T2'],.12)                                  # trưa, gió nhẹ
bed(1157,['end','cta'],.1)
place(clacks(sp('hook')[1]-.5,2.2,1),.5,.5,fi=.5,fo=.8)
place(clacks(sp('s3')[1]-sp('s3')[0],1.2,2),sp('s3')[0],.25,fi=.5,fo=.5)
place(engine(sp('s3')[1]-sp('s3')[0]),sp('s3')[0],.3,dur=(sp('s3')[1]-sp('s3')[0])*.5,fi=1.5,fo=1.2)   # xe chạy tới
place(SHUT,S_('s4',.95),.8)                                     # Vũ bấm máy (chớp đèn)
place(engine(4),S_('s5',.03),.35,fi=.3,fo=2)                    # nổ máy đi
place(clacks(sp('s6')[1]-sp('s6')[0],2.5,3),sp('s6')[0],.55,fi=.2,fo=.5)   # gõ ngoài cửa sổ
place(BEEP,S_('s6',.42),.35)                                    # mở điện thoại
place(clacks(sp('V1')[1]-sp('V1')[0],3,6),sp('V1')[0],.5)
k0=sp('s8')[0];k1=B['knockoff']
x=clacks(k1-k0,3.0,7);ramp=np.linspace(.5,1.0,len(x))[:,None];place(x*ramp,k0,.7,fi=.2,fo=.05)   # gõ dồn dập rồi tắt hẳn
place(clacks(1.2,9,8),k1-1.2,.8,fi=0,fo=.02)
place(497,k0,.4,dur=k1-k0,fi=1,fo=.3,loop=True)                 # tim đập
bm=B['boom']
place(rumble(7),bm,1.0,fi=0,fo=2);place(1296,bm-.05,.9,dur=6,fi=0,fo=2);place(1278,bm,.7,dur=4,fi=0,fo=1.5)
place(clacks(sp('s9')[1]-sp('s9')[0],.8,4),sp('s9')[0],.2,fi=.6,fo=.2)
JT=[sp('title')[0]+.05,B['hook'],B['s6']]
for t in JT+[bm]:
    s0=int((t-.6)*SR);s1=int(t*SR);out[s0:s1]*=np.linspace(1,.2,s1-s0)[:,None]
mu=np.zeros((N,2));hi=np.zeros((N,2));_out=out;out=mu
c0=sp('s6')[0];c1=sp('s9')[0];c2=sp('end')[0]
place(2510,0,.5,dur=c0,fi=2,fo=3,loop=True);place(685,0,.2,dur=c0,fi=3,fo=3,loop=True)
place(685,c0,.5,dur=bm-c0,fi=1.5,fo=.5,loop=True)
place(2482,c1,.4,dur=c2-c1,fi=2,fo=2,loop=True)
place(3081,c2,.55,dur=DUR-c2,fi=1,fo=2.5,loop=True)
out=hi
place(682,k0,.6,dur=bm-k0,fi=1,fo=.2,loop=True)                 # lớp dồn dập trước tiếng ầm
place(2630,sp('cta')[1]-2.5,.8,dur=3,fi=.1,fo=1.5)
for t in JT+[bm]:
    s0=int((t-.6)*SR);s1=int(t*SR);mu[s0:s1]*=np.linspace(1,.1,s1-s0)[:,None];hi[s0:s1]*=np.linspace(1,.1,s1-s0)[:,None]
mu/=max(1e-6,np.abs(mu).max())*1.05;hi/=max(1e-6,np.abs(hi).max())*1.05
out=_out;out/=np.abs(out).max()*1.05
for t,g in zip(JT,[.8,.9,1.0]):
    for i,dt,gn,du in [(788,-.01,.9,1.8),(1963,0,.7,1.5),(565,-.02,.8,1.6),(677,0,.5,1.4),(1704,-.02,.6,2.0)]:place(i,t+dt,gn*g,dur=du,fi=0,fo=.25,buf=jt)
jt/=np.abs(jt).max()*1.02
r,v=wavfile.read(D+'voice3.wav');v=v.astype(float)/32768;v=np.pad(v,(0,max(0,N-len(v))))[:N];V=np.stack([v,v],1)
e=np.abs(v);k=int(.05*SR);e=np.convolve(e,np.ones(k)/k,'same');duck=1-.45*np.clip(e/(np.percentile(e[e>1e-4],80)+1e-9),0,1)
rms=lambda x:np.sqrt(np.mean(x[np.abs(x)>.02]**2))
mix=V+mu*duck[:,None]*(.32*rms(v)/rms(mu))+hi*duck[:,None]*(.35*rms(v)/max(1e-9,rms(hi)))+out*.55+jt*.5*(1-.4*duck[:,None])
mix=mix/np.abs(mix).max()*.95
wavfile.write(D+'mix3.wav',SR,(mix*32767).astype(np.int16));print('ok',round(DUR,1))
