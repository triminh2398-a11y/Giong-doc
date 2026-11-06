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
NI=['hook','hook2','title','water','check','hung2','hung3','tu2','night','gs','stop','turn','tu3','gs2','door','end2','gs3','cta']
DAY=['buy','hung','hung1','cam','offer','bowls','su1','su','find','end','morning']
bed(3081,NI,.2);bed(2505,DAY,.08);bed(2505,['tu1'],.25)
bed(2483,['hook2','gs','turn','gs2','gs3'],.15);bed(494,['night','stop'],.25)
place(1143,sp('title')[0]+.05,.6)
# tiếng nước chảy RÕ: vòi nước + nhỏ giọt
place(3126,S_('hook2',0),.8,dur=sp('hook2')[1]-sp('hook2')[0],fi=.3,fo=.8,loop=True)
place(3126,S_('water',.12),.95,dur=sp('check')[1]-S_('water',.12),fi=.4,fo=1.5,loop=True)
place(2826,S_('water',.3),.7,dur=3)
for k in range(8):place(2835,S_('water',.42+k*.03),.8,dur=.6,fo=.15)
place(2835,S_('water',.7),.9,dur=2.5);place(2835,S_('water',.82),.8,dur=2)
place(1879,S_('check',.55),.9,dur=4)
for k in range(5):place(1230,S_('check',.05+k*.1),.35,dur=.9)
place(3126,S_('cam',.3),.6,dur=sp('cam')[1]-S_('cam',.3),fi=.3,fo=.8,loop=True)
place(2835,S_('offer',.6),.5,dur=2)
place(2835,S_('night',.25),.6,dur=3)
place(2827,S_('gs',.1),.6,dur=3);place(2827,S_('turn',.3),.8,dur=3)
place(194,S_('door',.03),1.0,dur=2,fo=.5)
for k in range(5):place(2835,S_('door',.35+k*.08),.6-k*.08,dur=1.0)
place(2462,S_('door',.92),.4,dur=3)
place(3126,S_('end2',.4),.7,dur=sp('end2')[1]-S_('end2',.4),fi=.4,fo=1,loop=True)
place(2835,S_('end2',.7),.7,dur=2.5)
for k in range(4):place(2835,S_('leave2',.45+k*.1),.55,dur=.9)
JT=[S_('hook2',.05),S_('cam',.72),S_('gs',.3),S_('turn',.45)]
for t,d in [(x,.6) for x in JT]:
    s0=int((t-d)*SR);s1=int(t*SR);out[s0:s1]*=np.linspace(1,.2,s1-s0)[:,None]

# ===== NHẠC NỀN: ma mị suốt truyện; CAO TRÀO (bàn tay nắm chân) dồn dập; KẾT rùng rợn sau câu cuối của bé Na =====
mu=np.zeros((N,2));hi=np.zeros((N,2));_out=out
out=mu
c0=sp('night')[0];g0=sp('stop')[0];c1=sp('door')[1]
place(2510,0,.5,dur=c0,fi=2,fo=3,loop=True);place(685,0,.22,dur=c0,fi=3,fo=3,loop=True)
place(2746,0,.35,dur=c0,fi=3,fo=3,loop=True)
place(2510,sp('hung2')[0],.3,dur=sp('tu2')[1]-sp('hung2')[0],fi=2,fo=2,loop=True)
place(685,c0,.5,dur=c1-c0,fi=1.5,fo=2,loop=True)
place(559,sp('night')[0],.4,dur=g0-sp('night')[0],fi=.5,fo=.5,loop=True)
place(2482,sp('morning')[0],.4,dur=sp('end2')[0]-sp('morning')[0],fi=2,fo=2,loop=True)
# cao trào: lớp riêng, ít bị nén dưới giọng
out=hi
place(682,g0-.2,.9,dur=c1-g0+.2,fi=.05,fo=1.5,loop=True)          # trống trầm dồn dập
place(577,g0,.6,dur=min(6,c1-g0),fi=.05,fo=1,loop=True)           # trống cuộn
place(493,g0,.7,dur=c1-g0,fi=.1,fo=1.2,loop=True)                 # tim đập nhanh
place(786,g0-.1,.8,dur=4,fi=.05,fo=1)                             # dâng lên
place(678,S_('gs2',.2),.7,dur=5,fi=.2,fo=1.5)                    # swell khi lấp hố
# kết rùng rợn: sau câu cuối của bé Na — hộp nhạc lạc giọng + organ + quét bóng tối, rồi lặng
e0=sp('gs3')[0];e1=sp('leave2')[1]
place(2746,e0-.5,.8,dur=DUR-e0+.5,fi=1.5,fo=2,loop=True)
place(3081,e0,.8,dur=DUR-e0,fi=1,fo=2.5,loop=True)
place(2630,e1-.4,.9,dur=4,fi=.1,fo=1.5)
place(2835,e1+.3,.25,dur=2)
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
