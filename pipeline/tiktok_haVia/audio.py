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
NE=['hook','hook2','title','fall','cross','night','call','ans','count','ninth','call9','two','ghost','run','end2','cta']
NI=['sick','door','gt2']
DAY=['me','tu1','tu2','dawn','end']
bed(1789,NE,.22);bed(1162,NE,.12);bed(2483,['hook','hook2','cross','two','ghost','run','gt2','end2'],.16);bed(3081,NI,.2);bed(1234,DAY,.1)
bed(3126,['hook','fall','cross','night','call','ans','count','ninth','call9','two','ghost','end2'],.18)
bed(494,['ninth','call9','two'],.3)
for k in range(5):place(1274,S_('fall',.1+k*.15),.3,dur=1.0)
place(565,S_('cross',.35),.8,dur=1.5);place(1311,S_('cross',.85),.7,dur=2)
for k in range(3):place(1230,S_('sick',.1+k*.1),.4,dur=.8)
place(1311,S_('ans',.4),.45,dur=1.5)
for k in range(7):place(1311,S_('count',.08+k*.12),.3,dur=1.0)
place(1311,S_('ghost',.05),.8,dur=2)
for k in range(10):place(1230,S_('run',.03+k*.09),.55,dur=.7)
for k in range(6):place(1922,S_('run',.4+k*.09),.6,dur=.7)
place(194,S_('door',.05),1.0,dur=2)
for k in range(6):place(197,S_('door',.4+k*.1),.8,dur=1.0)
for k in range(5):place(197,S_('gt2',.05+k*.18),.7,dur=1.0)
place(2462,S_('dawn',.02),.6,dur=4)
JT=[S_('hook2',.6),sp('title')[0]+.05,S_('cross',.62),S_('ghost',.3)]
for t,d in [(x,.6) for x in JT]:
    s0=int((t-d)*SR);s1=int(t*SR);out[s0:s1]*=np.linspace(1,.2,s1-s0)[:,None]

# ===== NHẠC NỀN: ma mị suốt truyện; CAO TRÀO (bàn tay nắm chân) dồn dập; KẾT rùng rợn sau câu cuối của bé Na =====
mu=np.zeros((N,2));hi=np.zeros((N,2));_out=out
out=mu
c0=sp('ninth')[0];g0=sp('two')[0];c1=sp('gt2')[1]
place(2510,0,.5,dur=c0,fi=2,fo=3,loop=True);place(685,0,.22,dur=c0,fi=3,fo=3,loop=True)
place(2746,0,.35,dur=c0,fi=3,fo=3,loop=True)
place(2510,sp('me')[0],.3,dur=sp('tu2')[1]-sp('me')[0],fi=2,fo=2,loop=True)
place(685,c0,.5,dur=c1-c0,fi=1.5,fo=2,loop=True)
place(559,sp('ninth')[0],.4,dur=g0-sp('ninth')[0],fi=.5,fo=.5,loop=True)
place(2482,sp('dawn')[0],.4,dur=sp('end2')[0]-sp('dawn')[0],fi=2,fo=2,loop=True)
# cao trào: lớp riêng, ít bị nén dưới giọng
out=hi
place(682,g0-.2,.9,dur=c1-g0+.2,fi=.05,fo=1.5,loop=True)          # trống trầm dồn dập
place(577,g0,.6,dur=min(6,c1-g0),fi=.05,fo=1,loop=True)           # trống cuộn
place(493,g0,.7,dur=c1-g0,fi=.1,fo=1.2,loop=True)                 # tim đập nhanh
place(786,g0-.1,.8,dur=4,fi=.05,fo=1)                             # dâng lên
place(678,S_('ghost',.2),.7,dur=5,fi=.2,fo=1.5)                    # swell khi lấp hố
# kết rùng rợn: sau câu cuối của bé Na — hộp nhạc lạc giọng + organ + quét bóng tối, rồi lặng
e0=sp('end2')[0];e1=sp('end2')[1]
place(2746,e0-.5,.8,dur=DUR-e0+.5,fi=1.5,fo=2,loop=True)
place(3081,e0,.8,dur=DUR-e0,fi=1,fo=2.5,loop=True)
place(2630,e1-.4,.9,dur=4,fi=.1,fo=1.5)
place(1311,e1+.3,.3,dur=2)
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
