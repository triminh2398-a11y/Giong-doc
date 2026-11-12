# Tượng Nhà Mồ — âm thanh (Mixkit sfxlib + chiêng, cưa, gỗ nứt, máy xe, cuốc đất tổng hợp)
import json,subprocess,os,numpy as np
from scipy.io import wavfile
from scipy.signal import lfilter
D=os.path.dirname(os.path.abspath(__file__))+'/';SR=48000
T=json.load(open(D+'tl.json'));DUR=T['dur'];N=int(DUR*SR);out=np.zeros((N,2));jt=np.zeros((N,2))
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
NIGHT=['s5','s6','s10','s11','s12','s13','s14','s15','cta']
bed(1238,['s1','s4'],.12)                     # rừng ban ngày, chim
bed(1789,NIGHT,.16)                           # dế đêm
bed(1736,['title','s2','s3','s9','end'],.12)  # gió cao nguyên
bed(1238,['s16','s17','s18'],.08)             # rạng sáng
# chiêng trong lễ bỏ mả
for k in range(6):place(gong(118+k%2*14,3,k),S_('s2',.04+k*.09),.32)
place(gong(96,4),S_('s3',.1),.18)
# cưa tượng (không thấy lưỡi cưa trên hình), Tùng nhét con chim
place(saw(max(1,(sp('s6')[1]-sp('s6')[0])*.4)),S_('s6',.03),.45,fi=.1,fo=.3)
place(burst(.25,.6,.06),S_('s6',.44),.6)
# dằm gỗ, ngón tay cứng
place(crackle(1.2,10),S_('s7',.3),.35);place(crackle(1.6,14),S_('s8',.55),.4)
# xe chạy, sình lầy
place(engine(sp('s9')[1]-S_('s9',.28)),S_('s9',.28),.35,fi=.8,fo=1.2)
for k in range(14):place(burst(.18,-.2,.05),S_('s10',.05+k*.035),.32)   # bước chân vác tượng
for k in range(9):place(burst(.22,.4,.08),S_('s11',.08+k*.1),.55)       # cuốc đất
# chiêng ma: không còn ai đánh
for k in range(4):place(gong(84,5,k*.7),S_('s12',.5+k*.12),.9 if k==0 else .55)
for k in range(5):place(gong(80,5,k),S_('s13',.0)+k*1.9,.32)
for k in range(5):place(gong(78,5,k),S_('s14',.0)+k*1.7,.38)
for k in range(3):place(gong(76,6,k),S_('s15',.0)+k*1.8,.3*(1-k*.3))
place(crackle(sp('s14')[1]-B['s14'],26),B['s14'],.55,fi=.1,fo=.4)   # tay gỗ răng rắc
place(2234,S_('s14',.05),.25,dur=4,rate=0.85)                              # hơi thở lạnh
place(burst(.5,-.1,.15),S_('s17',.05),.3)
B=T['BEAT'];JT=[sp('title')[0]+.05,B['s8'],B['s14'],B['s17']]+([B['hook']] if 'hook' in B else [])
for t in JT:
    s0=int((t-.6)*SR);s1=int(t*SR);out[s0:s1]*=np.linspace(1,.2,s1-s0)[:,None]
mu=np.zeros((N,2));hi=np.zeros((N,2));_out=out;out=mu
c0=sp('s12')[0];c1=sp('s16')[0]
place(2510,0,.5,dur=c0,fi=2,fo=3,loop=True);place(685,0,.22,dur=c0,fi=3,fo=3,loop=True)
place(685,c0,.5,dur=c1-c0,fi=1.5,fo=2,loop=True);place(2482,c1,.4,dur=sp('end')[0]-c1,fi=2,fo=2,loop=True)
place(3081,sp('end')[0],.6,dur=DUR-sp('end')[0],fi=1,fo=2.5,loop=True)
out=hi
place(497,sp('s12')[0],.5,dur=sp('s14')[0]-sp('s12')[0],fi=1,fo=.3,loop=True)
place(682,sp('s14')[0]-.2,.85,dur=c1-sp('s14')[0],fi=.05,fo=1.5,loop=True)
place(577,B['s14'],.55,dur=min(6,c1-B['s14']),fi=.05,fo=1,loop=True)
place(786,B['s14']-.1,.8,dur=4,fi=.05,fo=1)
place(2630,sp('cta')[1]-2.5,.8,dur=3,fi=.1,fo=1.5)
for t in JT:
    s0=int((t-.6)*SR);s1=int(t*SR);mu[s0:s1]*=np.linspace(1,.1,s1-s0)[:,None];hi[s0:s1]*=np.linspace(1,.1,s1-s0)[:,None]
mu/=max(1e-6,np.abs(mu).max())*1.05;hi/=max(1e-6,np.abs(hi).max())*1.05
out=_out;out/=np.abs(out).max()*1.05
for t,g in zip(JT,[.75,.8,1.0,.9]):
    for i,dt,gn,du in [(788,-.01,.9,1.8),(1963,0,.7,1.5),(565,-.02,.8,1.6),(677,0,.5,1.4),(1704,-.02,.6,2.0)]:place(i,t+dt,gn*g,dur=du,fi=0,fo=.25,buf=jt)
jt/=np.abs(jt).max()*1.02
# ===== mix: voice on top, music ~ -8 dB under the voice and ducked while it speaks, sfx clear, stings never mask words =====
r,v=wavfile.read(D+'voice.wav');v=v.astype(float)/32768;v=np.pad(v,(0,max(0,N-len(v))))[:N];V=np.stack([v,v],1)
e=np.abs(v);k=int(.05*SR);e=np.convolve(e,np.ones(k)/k,'same');duck=1-.45*np.clip(e/(np.percentile(e[e>1e-4],80)+1e-9),0,1)
rms=lambda x:np.sqrt(np.mean(x[np.abs(x)>.02]**2))
mix=V+mu*duck[:,None]*(.32*rms(v)/rms(mu))+hi*duck[:,None]*(.35*rms(v)/max(1e-9,rms(hi)))+out*.55+jt*.5*(1-.4*duck[:,None])
mix=mix/np.abs(mix).max()*.95
wavfile.write(D+'mix.wav',SR,(mix*32767).astype(np.int16));print('ok',round(DUR,1))
