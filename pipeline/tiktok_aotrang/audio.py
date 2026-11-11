# Áo Trắng Qua Hang — âm thanh (Mixkit sfxlib + vài tiếng tổng hợp: màn trập, bíp, bật lửa, kéo lê)
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
SC={k:(a,b) for k,a,b,ls in T['scenes']}
sp=lambda k:SC[k];S_=lambda k,f:SC[k][0]+(SC[k][1]-SC[k][0])*f
def bed(i,keys,g,rate=1.0):
    for k in keys:a,b=SC[k];place(i,a,g,dur=b-a+.3,fi=.6,fo=.6,loop=True,rate=rate)
HANG=['hook','hook2','title','day1','p1','day2','p2','day3','wake','cam','end','end2','cta','cta2']
bed(1789,['hook','hook2','title','show','lang','cta','cta2'],.16)        # dế chạng vạng / đêm
bed(1238,['intro','rule','day1','day2','day3','wake','end','end2'],.12) # rừng có chim
bed(2499,HANG+['inside','face','gm','push','drag'],.14)                 # hơi hang ẩm
bed(3179,['inside','face','gm','push','drag'],.35)                       # nước nhỏ giọt trong hang
bed(1330,['show','lang','lang2','lang3'],.32)                            # bếp lửa nhà sàn
bed(1736,['title','day3','end2'],.12)                                    # gió núi
# cò sà ngang rồi rơi
place(2432,S_('hook2',.25),.6,dur=2.0);place(565,S_('hook2',.78),.35,dur=1.0)
# máy ảnh hẹn giờ chụp
for k in range(5):place(BEEP,S_('day1',.45+k*.08),.5);place(SHUT,S_('day1',.47+k*.08),.8)
for k in range(3):place(BEEP,S_('hook',.3+k*.2),.35);place(SHUT,S_('hook',.32+k*.2),.55)
for key,n in [('p1',3),('p2',6),('cam',4)]:
    for k in range(n):place(CLICK,S_(key,.05+k*(.9/n)),.7)
for k in range(4):place(BEEP,S_('day3',.15+k*.08),.45);place(SHUT,S_('day3',.17+k*.08),.7)
for k in range(8):place(1270,S_('day3',.4+k*.07),.5,dur=.6)
# trong hang: đèn pin chập chờn tắt, bật lửa, lửa tàn
for k in range(4):place(CLICK,S_('inside',.18+k*.035),.8)
place(FLICK,S_('inside',.38),1.0);place(1345,S_('inside',.4),.35,dur=1.2)
place(2234,S_('inside',.2),.25,dur=3,rate=0.9)                          # tiếng thở nặng nề
place(2623,S_('inside',.8),.6,dur=2.5)                                  # vệt sáng lướt
place(565,S_('push',.7),.9,dur=1.5)                                     # ngã quỵ
place(drag(max(1,sp('drag')[1]-sp('drag')[0]-.5)),sp('drag')[0]+.2,.55,fi=.3,fo=.8)
place(drag(2.4),S_('cam',.2),.25,fi=.2,fo=.6)
for k in range(10):place(565,S_('end',.08+k*.09),.35,dur=.6,rate=0.8)   # xếp đá
place(2472,sp('end2')[0],.3,dur=sp('end2')[1]-sp('end2')[0],fi=1,fo=1.5,loop=True)
JT=[sp('title')[0]+.05,S_('face',.15)]
for t in JT:
    s0=int((t-.6)*SR);s1=int(t*SR);out[s0:s1]*=np.linspace(1,.2,s1-s0)[:,None]
# ===== nhạc: ma mị suốt truyện, cao trào riêng, kết lặng — không hộp nhạc =====
mu=np.zeros((N,2));hi=np.zeros((N,2));_out=out;out=mu
c0=sp('inside')[0];c1=sp('wake')[0]
place(2510,0,.5,dur=c0,fi=2,fo=3,loop=True);place(685,0,.25,dur=c0,fi=3,fo=3,loop=True)
place(685,c0,.5,dur=c1-c0,fi=1.5,fo=2,loop=True);place(2482,c1,.4,dur=sp('end')[0]-c1,fi=2,fo=2,loop=True)
place(2510,sp('end')[0],.35,dur=DUR-sp('end')[0],fi=2,fo=3,loop=True)
out=hi
place(497,sp('inside')[0],.5,dur=sp('face')[0]-sp('inside')[0],fi=1,fo=.3,loop=True)   # tim đập trong hang
place(682,sp('face')[0]-.2,.85,dur=c1-sp('face')[0],fi=.05,fo=1.5,loop=True)
place(577,sp('face')[0],.55,dur=min(6,c1-sp('face')[0]),fi=.05,fo=1,loop=True)
place(493,sp('push')[0],.65,dur=c1-sp('push')[0],fi=.1,fo=1.2,loop=True)
place(786,sp('face')[0]-.1,.8,dur=4,fi=.05,fo=1)
e1=sp('end2')[1];place(3081,sp('end2')[0],.7,dur=DUR-sp('end2')[0],fi=1,fo=2.5,loop=True);place(2630,e1-.4,.8,dur=4,fi=.1,fo=1.5)
for t in JT:
    s0=int((t-.6)*SR);s1=int(t*SR);mu[s0:s1]*=np.linspace(1,.1,s1-s0)[:,None];hi[s0:s1]*=np.linspace(1,.1,s1-s0)[:,None]
mu/=max(1e-6,np.abs(mu).max())*1.05;hi/=max(1e-6,np.abs(hi).max())*1.05
wavfile.write(D+'music.wav',SR,(mu*32767).astype(np.int16));wavfile.write(D+'music_hi.wav',SR,(hi*32767).astype(np.int16))
out=_out;out/=np.abs(out).max()*1.05
for t,g in [(JT[0],.75),(JT[1],1.0)]:
    for i,dt,gn,du in [(788,-.01,.9,1.8),(1963,0,.7,1.5),(565,-.02,.8,1.6),(677,0,.5,1.4),(1704,-.02,.6,2.0)]:place(i,t+dt,gn*g,dur=du,fi=0,fo=.25,buf=jt)
place(2623,S_('drag',.2),.5,dur=2,buf=jt)
jt/=np.abs(jt).max()*1.02
wavfile.write(D+'sfx.wav',SR,(out*32767).astype(np.int16));wavfile.write(D+'jump.wav',SR,(jt*32767).astype(np.int16));print('ok')
