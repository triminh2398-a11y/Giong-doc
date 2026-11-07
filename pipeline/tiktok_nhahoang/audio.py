# Thần giữ của — tiếng động thật (sfxlib Mixkit)
import json,subprocess,os,numpy as np
from scipy.io import wavfile
D=os.path.dirname(os.path.abspath(__file__))+'/';SR=48000
T=json.load(open(D+'tl.json'));DUR=T['dur'];N=int(DUR*SR);out=np.zeros((N,2));jt=np.zeros((N,2))
LIB='/home/claude/giong-doc/sfxlib/mixkit/';CACHE='/home/claude/sfxcache/';os.makedirs(CACHE,exist_ok=True)
def load(i,rate=1.0):
    w=CACHE+(f'{i}.wav' if rate==1 else f'{i}_{rate}.wav')
    if not os.path.exists(w):subprocess.run(['ffmpeg','-v','error','-y','-i',LIB+f'{i}-preview.mp3',*(['-af',f'asetrate={int(SR*rate)},aresample={SR}'] if rate!=1 else []),'-ar',str(SR),'-ac','2',w],check=True)
    r,x=wavfile.read(w);x=x.astype(float)/32768;return x/max(1e-6,np.abs(x).max())
def place(i,at,gn,dur=None,fi=.05,fo=.3,loop=False,buf=None,rate=1.0):
    x=load(i,rate)
    if dur:
        n=int(dur*SR)
        if loop and len(x)<n:x=np.tile(x,(n//len(x)+1,1))
        x=x[:n].copy()
    n=len(x);a=min(int(fi*SR),n);b=min(int(fo*SR),n)
    if a:x[:a]*=np.linspace(0,1,a)[:,None]
    if b:x[-b:]*=np.linspace(1,0,b)[:,None]
    s=max(0,int(at*SR));m=min(n,N-s);(out if buf is None else buf)[s:s+m]+=x[:m]*gn
SC={k:(a,b) for k,a,b,ls in T['scenes']}
sp=lambda k:SC[k];S_=lambda k,f:SC[k][0]+(SC[k][1]-SC[k][0])*f
def bed(i,keys,g,rate=1.0):
    for k in keys:a,b=SC[k];place(i,a,g,dur=b-a+.3,fi=.6,fo=.6,loop=True,rate=rate)
NI=['hook2','first','cry','night1','night2','gm']
NE=['hook','title','run','end','cta']
DAY=['intro','thay','thay1','cycle','grand','leave']
bed(1789,NE,.22);bed(1162,NE,.15);bed(2483,NE+['night2','gm'],.15);bed(3081,NI,.2);bed(1789,NI,.06);bed(1234,DAY,.12);bed(1237,DAY,.08);bed(1227,['turns'],.14)
bed(494,['night1','night2'],.25)
place(1143,sp('title')[0]+.05,.6)
CRY=465
def cry(t,g,d=3,r=1.4):place(CRY,t,g,dur=d,rate=r,fi=.3,fo=.8)
cry(S_('hook',.55),.45,4);cry(S_('hook2',.0),.7,3)
for k in range(4):place(1230,S_('first',.15+k*.08),.45,dur=.8)
place(199,S_('first',.45),.8,dur=2.5)
place(153,S_('first',.78),.9,dur=2);place(565,S_('first',.78),.4,dur=1.2)
cry(S_('cry',.15),.55,4);cry(S_('cry',.6),.7,4,1.5)
place(2653,S_('thay',.3),.25,dur=3)
cry(S_('cycle',.7),.6,3)
cry(S_('night1',.0),.8,4,1.45);place(2430,S_('night1',.5),.3,dur=1.5)
cry(S_('night2',.15),.85,6,1.4)
for k in range(5):place(1230,S_('run',.05+k*.07),.4,dur=.7)
place(532,S_('run',.1),.4,dur=3)
cry(S_('end',.5),.5,5)
cry(S_('cta',.3),.35,4)
JT=[S_('hook2',.06),S_('gm',.3)]
for t,d in [(x,.6) for x in JT]:
    s0=int((t-d)*SR);s1=int(t*SR);out[s0:s1]*=np.linspace(1,.2,s1-s0)[:,None]

# ===== NHẠC NỀN: ma mị suốt truyện; CAO TRÀO (bàn tay nắm chân) dồn dập; KẾT rùng rợn sau câu cuối của bé Na =====
mu=np.zeros((N,2));hi=np.zeros((N,2));_out=out
out=mu
c0=sp('night1')[0];g0=sp('night2')[0];c1=sp('run')[1]
place(2510,0,.5,dur=c0,fi=2,fo=3,loop=True);place(685,0,.22,dur=c0,fi=3,fo=3,loop=True)
place(2746,0,.35,dur=c0,fi=3,fo=3,loop=True)
place(2510,sp('thay')[0],.3,dur=sp('turns')[1]-sp('thay')[0],fi=2,fo=2,loop=True)
place(685,c0,.5,dur=c1-c0,fi=1.5,fo=2,loop=True)
place(559,sp('night1')[0],.4,dur=g0-sp('night1')[0],fi=.5,fo=.5,loop=True)
place(2482,sp('leave')[0],.4,dur=sp('end')[0]-sp('leave')[0],fi=2,fo=2,loop=True)
# cao trào: lớp riêng, ít bị nén dưới giọng
out=hi
place(682,g0-.2,.9,dur=c1-g0+.2,fi=.05,fo=1.5,loop=True)          # trống trầm dồn dập
place(577,g0,.6,dur=min(6,c1-g0),fi=.05,fo=1,loop=True)           # trống cuộn
place(493,g0,.7,dur=c1-g0,fi=.1,fo=1.2,loop=True)                 # tim đập nhanh
place(786,g0-.1,.8,dur=4,fi=.05,fo=1)                             # dâng lên
place(678,S_('gm',.2),.7,dur=5,fi=.2,fo=1.5)                    # swell khi lấp hố
# kết rùng rợn: sau câu cuối của bé Na — hộp nhạc lạc giọng + organ + quét bóng tối, rồi lặng
e0=sp('end')[0];e1=sp('end')[1]
place(2746,e0-.5,.8,dur=DUR-e0+.5,fi=1.5,fo=2,loop=True)
place(3081,e0,.8,dur=DUR-e0,fi=1,fo=2.5,loop=True)
place(2630,e1-.4,.9,dur=4,fi=.1,fo=1.5)
cry(e1+.3,.3,3)
for t,d in [(x,.6) for x in JT]:
    s0=int((t-d)*SR);s1=int(t*SR);mu[s0:s1]*=np.linspace(1,.1,s1-s0)[:,None];hi[s0:s1]*=np.linspace(1,.1,s1-s0)[:,None]
mu/=max(1e-6,np.abs(mu).max())*1.05;hi/=max(1e-6,np.abs(hi).max())*1.05
wavfile.write(D+'music.wav',SR,(mu*32767).astype(np.int16));wavfile.write(D+'music_hi.wav',SR,(hi*32767).astype(np.int16))
out=_out
out/=np.abs(out).max()*1.05
for t in JT:
    for i,dt,gn,du in [(788,-.01,.9,1.8),(1963,0,.7,1.5),(565,-.02,.8,1.6),(677,0,.5,1.4),(1704,-.02,.6,2.0)]:place(i,t+dt,gn,dur=du,fi=0,fo=.25,buf=jt)
jt/=np.abs(jt).max()*1.02
wavfile.write(D+'sfx.wav',SR,(out*32767).astype(np.int16));wavfile.write(D+'jump.wav',SR,(jt*32767).astype(np.int16));print('ok')
