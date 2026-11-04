# Ngải Thất Sơn — hiệu ứng THẬT từ sfxlib (Mixkit), jumpscare nhẹ kiểu Ma Lai
import json, subprocess, os, numpy as np
from scipy.io import wavfile
D=os.path.dirname(os.path.abspath(__file__))+'/'
SR=48000;T=json.load(open(D+'tl.json'));DUR=T['dur'];N=int(DUR*SR);out=np.zeros((N,2))
LIB='/home/claude/giong-doc/sfxlib/mixkit/';CACHE='/home/claude/sfxcache/';os.makedirs(CACHE,exist_ok=True)
SC={};[SC.setdefault(k,(a,b,ls)) for k,a,b,ls in T['scenes']]
ALL=[(k,a,b,ls) for k,a,b,ls in T['scenes']]
def load(i,rate=1.0):
    w=CACHE+(f'{i}.wav' if rate==1.0 else f'{i}_{rate}.wav')
    if not os.path.exists(w):
        af=['-af',f'asetrate={int(SR*rate)},aresample={SR}'] if rate!=1.0 else []
        subprocess.run(['ffmpeg','-v','error','-y','-i',LIB+f'{i}-preview.mp3',*af,'-ar',str(SR),'-ac','2',w],check=True)
    r,x=wavfile.read(w);x=x.astype(np.float64)/32768;return x/max(1e-6,np.abs(x).max())
def place(i,at,g=1.0,dur=None,fi=0.05,fo=0.3,loop=False,off=0,rate=1.0):
    x=load(i,rate);x=x[int(off*SR)%max(1,len(x)-SR):] if len(x)>SR else x
    if dur is not None:
        n=int(dur*SR)
        if loop and len(x)<n:x=np.tile(x,(n//len(x)+1,1))
        x=x[:n]
    x=x.copy();n=len(x);a=int(fi*SR);b=int(fo*SR)
    if n==0:return
    if a>0:x[:min(a,n)]*=np.linspace(0,1,min(a,n))[:,None]
    if b>0:x[-min(b,n):]*=np.linspace(1,0,min(b,n))[:,None]
    s=int(at*SR);m=min(n,N-s)
    if m>0 and s>=0:out[s:s+m]+=x[:m]*g
def bed(i,keys,g,fade=0.6,rate=1.0):
    for k,a,b,ls in ALL:
        if k in keys:place(i,a,g,dur=b-a+0.3,fi=fade,fo=fade,loop=True,off=(a*7)%5,rate=rate)
def span(k):a,b,ls=SC[k];return a,b
def S_(k,f):a,b=span(k);return a+(b-a)*f
INN_N=['hook','hook2','feed','odd2','odd3','thamask','loi2','shadow','end2','final','gfinal']
RAINS=['back','loi1','thamhug','rule2']
INN_D=['odd1','call','tu','realize','realize2','loi3','end']
MKT=['tham','rumor'];MKTN=['callbay']
MT_N=['title','mount','thay','thay2','thay3','thay4','tb5','tb6','run','follow','gl1','nturn','root','cut','fall','corpse','cta']
bed(3081,INN_N,0.2);bed(1789,INN_N,0.1);bed(2482,['hook','hook2','odd3','loi2','gfinal','final'],0.14)
bed(2399,RAINS,0.3);bed(1247,RAINS,0.2)
bed(1235,INN_D,0.05);bed(2482,['realize2','loi3'],0.12);bed(364,MKT,0.14);bed(375,MKT,0.08);bed(369,MKTN,0.12);bed(1789,MKTN,0.06)
bed(2414,MT_N,0.16);bed(1237,MT_N,0.14);bed(1157,['follow','gl1','nturn','root','cut','corpse'],0.12)
bed(494,['shadow','odd3','tu','realize','loi3','gl1','fall','gfinal'],0.22)
bed(2466,['title'],0.08)
place(1143,span('title')[0]+0.05,0.5)
place(2430,span('hook2')[0]+0.2,0.25,dur=3)
place(1230,span('mount')[0],0.3,dur=span('mount')[1]-span('mount')[0],loop=True)
place(1879,S_('feed',0.45),0.4,dur=3);place(2430,S_('feed',0.6),0.3,dur=3)
place(197,S_('back',0.18),0.55,dur=2.2);place(195,S_('back',0.33),0.4,dur=2);place(2395,S_('back',0.55),0.6,dur=5)
place(2234,S_('odd3',0.4),0.22,dur=4);place(2430,S_('odd3',0.45),0.3,dur=4,rate=0.8)
place(2151,S_('realize',0.0)+0.45,0.5,dur=0.8);place(493,span('realize')[0]+0.3,0.25,dur=span('realize2')[1]-span('realize')[0])
place(2484,S_('realize2',0.4),0.2,dur=4);place(2234,span('loi3')[0],0.18,dur=span('loi3')[1]-span('loi3')[0])
place(1274,span('run')[0],0.3,dur=span('nturn')[1]-span('run')[0],loop=True)
place(536,S_('follow',0.25),0.3,dur=span('nturn')[0]-S_('follow',0.25),loop=True,rate=0.85)
place(565,S_('nturn',0.8),0.6,dur=1.6);place(1704,S_('nturn',0.8),0.3,dur=1.5);place(2430,S_('nturn',0.81),0.35,dur=2)
place(2827,S_('root',0.2),0.25,dur=4);place(3167,S_('root',0.5),0.25,dur=3)
place(2363,S_('cut',0.42),0.55,dur=1);place(565,S_('cut',0.42),0.45,dur=1.4);place(3167,S_('cut',0.4),0.3,dur=1.5)
place(385,S_('fall',0.42),0.7,dur=1.5)
place(492,span('final')[0]+0.3,0.2,dur=4)
place(2234,span('gfinal')[0]+0.1,0.14,dur=span('gfinal')[1]-span('gfinal')[0])
place(2482,span('cta')[0],0.16,dur=span('cta')[1]-span('cta')[0])
JT=[S_('hook2',0.02)]
for t in JT:s0=int((t-0.7)*SR);s1=int(t*SR);out[s0:s1]*=np.linspace(1,0.15,s1-s0)[:,None]
a,b=span('fall');out[int(S_('fall',0.5)*SR):int(b*SR)]*=0.4   # sau tiếng huỵch: gần im lặng
out/=np.abs(out).max()*1.05
jt=np.zeros((N,2))
def jplace(i,t,g,dur):
    x=load(i);n=min(len(x),int(dur*SR));x=x[:n].copy();x[-int(0.25*SR):]*=np.linspace(1,0,int(0.25*SR))[:,None];s2=int(t*SR);m=min(n,N-s2);jt[s2:s2+m]+=x[:m]*g
for t in JT:jplace(788,t-0.01,0.6,1.6);jplace(1963,t,0.45,1.3);jplace(565,t-0.02,0.5,1.4);jplace(677,t,0.3,1.2)
jt/=np.abs(jt).max()*1.02
wavfile.write(D+'jump.wav',SR,(jt*32767).astype(np.int16))
wavfile.write(D+'sfx.wav',SR,(out*32767).astype(np.int16));print('ok',[round(t,1) for t in JT])
