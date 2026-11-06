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
NE=['hook','hook2','title','gt','night','strip','gt2','turn','pull','gh','cta']
NI=['sick','call','cover']
DAY=['rent','scare','chin','chin1','tam1','near','ha1','tam2','end']
DU=['swap','burn','near2','run','chin2','chin3','end2']
bed(1789,NE,.18);bed(1162,NE,.12);bed(2483,['hook','hook2','title','gt','strip','gt2','turn','gh'],.15)
bed(3081,NI,.16);bed(1789,NI,.08);bed(1234,DAY,.12);bed(1237,DAY,.06);bed(1227,DU,.12);bed(1157,['near2','chin3'],.08)
bed(494,['sick','call','strip','gt2','turn'],.22)
place(1143,sp('title')[0]+.05,.5)
for k in range(5):place(532,S_('rent',.1+k*.17),.15,dur=1.0)
for k in range(3):place(2430,S_('chin',.15+k*.18),.18,dur=1.2)
place(1329,S_('swap',.0),.25,dur=sp('burn')[1]-S_('swap',.0),fi=.5,fo=1.5)
for t in [S_('near2',.25),S_('near2',.5),S_('near2',.75)]:place(2430,t,.22,dur=1.0)
for t in [S_('sick',.55),S_('sick',.75)]:place(2430,t,.25,dur=1.4)
place(2430,S_('call',.2),.2,dur=1.5)
place(2484,S_('call',.5),.25,dur=4)
for k in range(6):place(532,S_('night',.05+k*.15),.18,dur=1.0)
for t in [S_('strip',.15),S_('strip',.35),S_('strip',.55)]:place(2430,t,.3,dur=1.0)
place(3167,S_('strip',.62),.3,dur=1.5)
place(2430,S_('turn',.05),.35,dur=2.5)
place(1326,S_('pull',.4),.5,dur=1.1,fo=.2);place(1705,S_('pull',.42),.35,dur=3);place(1330,S_('pull',.42),.4,dur=sp('pull')[1]-S_('pull',.42),fo=1.5)
place(963,S_('pull',.55),.25,dur=3,rate=0.8)
place(2462,S_('pull',.82),.55,dur=4)
place(1235,sp('morning')[0],.1,dur=sp('morning')[1]-sp('morning')[0],fi=1,fo=1)
place(2430,S_('morning',.1),.25,dur=1.5)
place(2483,sp('end2')[0]+(sp('end2')[1]-sp('end2')[0])*.4,.15,dur=6)
JT=[S_('hook2',.05),S_('gt',.5),S_('gt2',.35),S_('turn',.5)]
for t,d in [(x,.6) for x in JT]:
    s0=int((t-d)*SR);s1=int(t*SR);out[s0:s1]*=np.linspace(1,.15,s1-s0)[:,None]

# ===== NHẠC NỀN: ma mị suốt truyện; CAO TRÀO (bàn tay nắm chân) dồn dập; KẾT rùng rợn sau câu cuối của bé Na =====
mu=np.zeros((N,2));hi=np.zeros((N,2));_out=out
out=mu
c0=sp('night')[0];g0=sp('gt2')[0];c1=sp('pull')[1]
place(2510,0,.5,dur=c0,fi=2,fo=3,loop=True);place(685,0,.22,dur=c0,fi=3,fo=3,loop=True)
place(2746,0,.35,dur=c0,fi=3,fo=3,loop=True)
place(2510,sp('run')[0],.3,dur=sp('chin3')[1]-sp('run')[0],fi=2,fo=2,loop=True)
place(685,c0,.5,dur=c1-c0,fi=1.5,fo=2,loop=True)
place(559,sp('strip')[0],.4,dur=g0-sp('strip')[0],fi=.5,fo=.5,loop=True)
place(2482,sp('morning')[0],.4,dur=sp('end2')[0]-sp('morning')[0],fi=2,fo=2,loop=True)
# cao trào: lớp riêng, ít bị nén dưới giọng
out=hi
place(682,g0-.2,.9,dur=c1-g0+.2,fi=.05,fo=1.5,loop=True)          # trống trầm dồn dập
place(577,g0,.6,dur=min(6,c1-g0),fi=.05,fo=1,loop=True)           # trống cuộn
place(493,g0,.7,dur=c1-g0,fi=.1,fo=1.2,loop=True)                 # tim đập nhanh
place(786,g0-.1,.8,dur=4,fi=.05,fo=1)                             # dâng lên
place(678,S_('pull',.3),.7,dur=5,fi=.2,fo=1.5)                    # swell khi lấp hố
# kết rùng rợn: sau câu cuối của bé Na — hộp nhạc lạc giọng + organ + quét bóng tối, rồi lặng
e0=sp('gh')[0];e1=sp('gh')[1]
place(2746,e0-.5,.8,dur=DUR-e0+.5,fi=1.5,fo=2,loop=True)
place(3081,e0,.8,dur=DUR-e0,fi=1,fo=2.5,loop=True)
place(2630,e1-.4,.9,dur=4,fi=.1,fo=1.5)
place(2430,e1+.2,.3,dur=1.5)
for t,d in [(x,.6) for x in JT]:
    s0=int((t-d)*SR);s1=int(t*SR);mu[s0:s1]*=np.linspace(1,.1,s1-s0)[:,None];hi[s0:s1]*=np.linspace(1,.1,s1-s0)[:,None]
mu/=max(1e-6,np.abs(mu).max())*1.05;hi/=max(1e-6,np.abs(hi).max())*1.05
wavfile.write(D+'music.wav',SR,(mu*32767).astype(np.int16));wavfile.write(D+'music_hi.wav',SR,(hi*32767).astype(np.int16))
out=_out
out/=np.abs(out).max()*1.05
for t in JT:
    for i,dt,gn,du in [(788,-.01,.6,1.6),(1963,0,.45,1.3),(565,-.02,.5,1.4),(677,0,.3,1.2)]:place(i,t+dt,gn,dur=du,fi=0,fo=.25,buf=jt)
jt/=np.abs(jt).max()*1.02
wavfile.write(D+'sfx.wav',SR,(out*32767).astype(np.int16));wavfile.write(D+'jump.wav',SR,(jt*32767).astype(np.int16));print('ok')
