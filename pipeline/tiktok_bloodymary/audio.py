import json, subprocess, os, numpy as np
from scipy.io import wavfile
SR=48000;T=json.load(open('tl.json'));DUR=T['dur'];N=int(DUR*SR);out=np.zeros((N,2))
LIB='/home/claude/giong-doc/sfxlib/mixkit/';CACHE='/home/claude/tr/sfxcache/';os.makedirs(CACHE,exist_ok=True)
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
def at(k,si=0,off=0.0):return SC[k][0]+SC[k][2][si]+off
ALLK=[k for k,a,b,ls in ALL]
def S_(k,f):a,b=span(k);return a+(b-a)*f
DORM=[k for k in ALLK if k not in ('dorm','origin','origin2','skull','keep','yearly','final')]
bed(3081,DORM,0.22);bed(2482,['hook','hook2','title','stairs','step','man','vy2','change','change2','cta'],0.12)
bed(2746,['origin','origin2','skull'],0.16);bed(1157,['origin','origin2','skull'],0.12)
bed(369,['dorm'],0.15);bed(2482,['dorm'],0.18);bed(2504,['thao','vy','rules','rules2','rules3','silence','gone','video'],0.05)
bed(1172,['candle','closer','whisper','rule1','scream','phone','plan','flip','thaoin','choice','choice2','name'],0.22)
bed(494,['man','vy2','change','change2'],0.28);bed(493,['closer','whisper','rule1','choice','choice2'],0.3)
bed(2500,['keep','yearly','final'],0.2);bed(3081,['keep','yearly','final'],0.18)
place(1143,span('title')[0]+0.05,0.55)
place(2596,S_('stairs',0.22),0.45,dur=1.5);place(543,S_('stairs',0.7),0.3,dur=3,rate=0.8)   # cúp điện + bắt đầu bước lên
place(543,span('step')[0],0.32,dur=span('step')[1]-span('step')[0],loop=True,rate=0.75,fo=1.0)  # bước chân trên bậc đá
place(543,span('man')[0],0.25,dur=2.0,rate=0.75)
place(428,span('thaolaugh')[0]+0.4,0.3,dur=3)                                   # Thảo cười khúc khích
place(2484,S_('change',0.3),0.2,dur=4)
place(1346,S_('candle',0.29),0.5,dur=1.2)                                        # nến phụt tắt
place(1879,span('closer')[0],0.3,dur=span('closer')[1]-span('closer')[0],loop=True)  # nước nhỏ giọt (bàn tay ướt)
place(2234,span('whisper')[0]+0.1,0.22,dur=4)
place(392,S_('scream',0.38),0.5,dur=1.3,fo=0.05,rate=1.45)                      # tiếng hét thất thanh rồi im bặt
place(2920,S_('scream',0.55),0.5,dur=1.0);place(2364,S_('scream',0.62),0.35,dur=0.5);place(2364,S_('scream',0.68),0.25,dur=0.5)  # điện thoại rơi, lăn
place(197,span('thaoin')[0]+0.2,0.35,dur=span('thaoin')[1]-span('thaoin')[0],loop=True,rate=1.3)   # đập tay vô gương
place(677,span('thaoin')[0]+0.3,0.3,dur=3);place(197,span('choice')[0],0.3,dur=3,rate=1.3)
place(2231,S_('choice',0.35),0.22,dur=4)
place(2364,S_('silence',0.33),0.4,dur=0.5)                                       # đèn bật lại
place(2566,span('video')[0]+0.2,0.18,dur=span('video')[1]-span('video')[0]);place(677,S_('video',0.75),0.35,dur=2.5)
place(3167,span('keep')[0]+0.5,0.25,dur=3)
for q in range(3):place(197,S_('yearly',0.62)+q*0.85,0.32,dur=0.6,rate=0.85,fo=0.2)  # cốc... cốc... cốc
for q in range(3):place(197,span('final')[0]+0.5+q*1.1,0.22,dur=0.6,rate=0.85,fo=0.2)
place(197,span('final')[1]+0.3,0.18,dur=0.6,rate=0.85,fo=0.2)
ca,cb=span('candle');a0=int(S_('candle',0.3)*SR);out[a0:int((ca+(cb-ca)*0.4)*SR)]*=0.2   # tắt nến: im một nhịp
a0=int(S_('scream',0.5)*SR);out[a0:int(S_('scream',0.56)*SR)]*=0.1
# jumpscare nhẹ kiểu Ma Lai: lửa xanh, mặt rữa, bàn tay trên vai
JT=[S_('change',0.72),S_('candle',0.3),S_('closer',0.55)]
for t in JT:s0=int((t-0.6)*SR);s1=int(t*SR);out[s0:s1]*=np.linspace(1,0.3,s1-s0)[:,None]
out/=np.abs(out).max()*1.05
jt=np.zeros((N,2))
def jplace(i,t,g,dur):
    x=load(i);n=min(len(x),int(dur*SR));x=x[:n].copy();x[-int(0.25*SR):]*=np.linspace(1,0,int(0.25*SR))[:,None];s2=int(t*SR);m=min(n,N-s2);jt[s2:s2+m]+=x[:m]*g
for t in JT:jplace(565,t-0.02,0.5,1.4);jplace(677,t,0.3,1.2);jplace(2630,t,0.25,2.0)
jt/=np.abs(jt).max()*1.02;wavfile.write('jump.wav',SR,(jt*32767).astype(np.int16))
wavfile.write('sfx.wav',SR,(out*32767).astype(np.int16));print('ok',JT)
