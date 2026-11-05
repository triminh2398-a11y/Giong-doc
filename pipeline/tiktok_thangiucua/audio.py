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
NE=['hook','hook2','title','night','call','gm','nayes','bell2','boy','gb','pry','pull','cta']
NI=['na1','na2','bell','odd','sick','earring']
DAY=['dig','dig2','man1','lanh1']
bed(1789,NE,.18);bed(1162,NE,.12);bed(2482,['hook','hook2','title','call','gm','boy','gb','pry'],.15)
bed(3081,NI,.16);bed(1789,NI,.08);bed(1235,['hide','miss','end'],.06);bed(1234,DAY,.12)
bed(2414,['tu','tu1','tu2','tu3'],.14);bed(1237,['tu','tu1','tu2','tu3'],.1);bed(1227,['let','end2','na3'],.12)
bed(494,['bell','sick','gm','boy','pry','pull'],.22)
place(1143,sp('title')[0]+.05,.5)
for k in range(3):place(1269,S_('dig',.15+k*.2),.3,dur=1.2)          # cuốc đất
place(565,S_('dig',.72),.35,dur=1.2)                                     # chạm hũ
place(364,sp('hide')[0]+(sp('hide')[1]-sp('hide')[0])*.5,.12,dur=4)
# lục lạc: dùng chuông nhỏ (bell) nếu có, nếu không dùng 2836 tiếng ly chạm
BELL=2836
for t in [S_('na2',.6),S_('bell',.1),S_('bell',.25),S_('odd',.1),S_('odd',.3),S_('bell2',.5),S_('pry',.45),S_('na3',.8)]:place(BELL,t,.35,dur=1.0,rate=1.3)
place(1230,sp('tu')[0],.3,dur=sp('tu')[1]-sp('tu')[0],loop=True)
place(1230,sp('night')[0],.3,dur=sp('night')[1]-sp('night')[0],loop=True)
place(2234,sp('gm')[0],.2,dur=sp('gm')[1]-sp('gm')[0]+.5)
for k in range(3):place(1269,S_('bell2',.05+k*.12),.3,dur=1.0)
place(2484,S_('boy',.3),.25,dur=4)
place(565,S_('pry',.6),.5,dur=1.4);place(3167,S_('pry',.6),.35,dur=1.5)
for k in range(4):place(1269,S_('pull',.05+k*.15),.3,dur=1.0)
place(2462,S_('pull',.8),.55,dur=4)
place(492,sp('let')[0]+.3,.25,dur=4)
place(BELL,S_('cta',.1),.2,dur=1.2,rate=1.2)
JT=[S_('hook2',.04),S_('gm',.62),S_('boy',.45),S_('pry',.6)]
for t,d in [(x,.6) for x in JT]:
    s0=int((t-d)*SR);s1=int(t*SR);out[s0:s1]*=np.linspace(1,.15,s1-s0)[:,None]

# ===== NHẠC NỀN: ma mị suốt truyện, dồn dập ở cao trào (trộn riêng, nép dưới giọng) =====
mu=np.zeros((N,2));_out=out
out=mu
c0=sp('night')[0];c1=sp('pull')[1]
place(700,0,.55,dur=c0,fi=2,fo=3,loop=True,rate=0.82)          # hộp nhạc ru con, chậm & trầm -> rợn
place(2746,0,.35,dur=c0,fi=3,fo=3,loop=True)                    # organ trầm
place(2510,sp('tu')[0],.3,dur=sp('miss')[1]-sp('tu')[0],fi=2,fo=2,loop=True)
place(685,c0,.55,dur=c1-c0,fi=1.5,fo=2,loop=True)                # bass hồi hộp
place(682,c0+2,.5,dur=c1-c0-2,fi=2,fo=2,loop=True)               # trống trầm dồn dập
place(559,sp('boy')[0],.45,dur=c1-sp('boy')[0],fi=.5,fo=2,loop=True)  # trống tim kinh dị
place(786,S_('pry',.3),.5,dur=4,fi=.2,fo=1)                      # cao trào dâng lên
place(700,sp('pull')[1]+.5,.4,dur=DUR-sp('pull')[1]-.5,fi=3,fo=3,loop=True,rate=0.78)  # kết: hộp nhạc lạc giọng
for t,d in [(x,.6) for x in JT]:
    s0=int((t-d)*SR);s1=int(t*SR);mu[s0:s1]*=np.linspace(1,.1,s1-s0)[:,None]
mu/=max(1e-6,np.abs(mu).max())*1.05
wavfile.write(D+'music.wav',SR,(mu*32767).astype(np.int16))
out=_out
out/=np.abs(out).max()*1.05
for t in JT:
    for i,dt,gn,du in [(788,-.01,.6,1.6),(1963,0,.45,1.3),(565,-.02,.5,1.4),(677,0,.3,1.2)]:place(i,t+dt,gn,dur=du,fi=0,fo=.25,buf=jt)
jt/=np.abs(jt).max()*1.02
wavfile.write(D+'sfx.wav',SR,(out*32767).astype(np.int16));wavfile.write(D+'jump.wav',SR,(jt*32767).astype(np.int16));print('ok')
