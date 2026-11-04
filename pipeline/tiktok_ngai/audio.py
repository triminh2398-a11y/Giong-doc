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
INN_N=['hook','hook2','feed','night','gl','night2','tmda','silent','twist','tmtwist','realize','final','gfinal','final2']
INN_D=['tham','tham2','loi2','sick','call','home','tmhome','relief','end']
MKT=['loi','rich'];MKTN=['greed','greed2']
MT_DUSK=['mount','thay','thay2','thay3','thay4','tbcall','tbcall2']
MT_N=['title','climb','root','voice','gtm','voice2','dig','cut','cut2','cta']
bed(3081,INN_N,0.2);bed(1789,INN_N,0.1);bed(2482,['hook','hook2','gl','silent','gfinal','final2'],0.14)
bed(1235,INN_D,0.06);bed(364,MKT,0.16);bed(375,MKT,0.1);bed(369,MKTN,0.12);bed(1789,MKTN,0.06)
bed(1227,MT_DUSK,0.14);bed(2414,MT_N,0.16);bed(1237,MT_N,0.14);bed(1157,['voice','gtm','voice2','cut','cut2'],0.12)
bed(1210,['rooster'],0.12);bed(494,['gl','silent','gtm','voice2','cut','realize','gfinal','final2'],0.22)
bed(2466,['title','climb'],0.08)
place(1143,span('title')[0]+0.05,0.5)
place(2430,span('hook2')[0]+0.2,0.25,dur=3)          # lá ngải xào xạc
place(1230,span('mount')[0],0.3,dur=span('mount')[1]-span('mount')[0],loop=True)
place(2430,S_('feed',0.5),0.3,dur=3);place(1879,S_('feed',0.35),0.35,dur=2.4)   # nhỏ máu + lá rung
place(2430,S_('tham2',0.55),0.15,dur=2.5)
place(2484,S_('greed2',0.5),0.12,dur=3)
place(2430,span('gl')[0],0.35,dur=4);place(2234,span('gl')[0]+0.3,0.18,dur=4)
place(337,S_('night2',0.3),0.3,dur=1.5);place(337,S_('night2',0.65),0.25,dur=1.5)
place(2430,S_('silent',0.3),0.4,dur=span('silent')[1]-S_('silent',0.3),loop=True,rate=0.8)  # rễ bò sột soạt
place(337,S_('silent',0.5),0.25,dur=2,rate=0.85)
place(2484,S_('sick',0.62),0.2,dur=4)
for c in ['climb','voice','voice2']:place(1230,span(c)[0],0.35,dur=span(c)[1]-span(c)[0],loop=True,rate=0.9)
place(2827,S_('root',0.3),0.25,dur=4);place(3167,S_('root',0.6),0.25,dur=3)
place(1222,S_('voice',0.35),0.3,dur=span('voice')[1]-S_('voice',0.35),loop=True,rate=0.85)   # tiếng bước chân phía sau
place(1222,span('voice2')[0],0.25,dur=span('voice2')[1]-span('voice2')[0],loop=True,rate=0.85)
place(2234,span('gtm')[0]+0.2,0.2,dur=4)
place(537,span('dig')[0]+0.5,0.35,dur=4)             # cào đất
place(2827,span('cut')[0]+0.3,0.3,dur=span('cut')[1]-span('cut')[0],loop=True)
place(1495,S_('cut2',0.55),0.5,dur=1.2);place(565,S_('cut2',0.86),0.55,dur=1.6);place(2363,S_('cut2',0.87),0.35,dur=1)
place(2462,span('rooster')[0]+0.2,0.6,dur=4.5)
place(2464,span('home')[0],0.12,dur=span('relief')[1]-span('home')[0],loop=True)
place(2484,span('twist')[0]+0.5,0.15,dur=4);place(2430,S_('realize',0.5),0.25,dur=3)
place(492,span('final')[0]+0.3,0.2,dur=4)
place(2234,span('gfinal')[0]+0.1,0.14,dur=span('gfinal')[1]-span('gfinal')[0])
place(2430,S_('end',0.1),0.18,dur=3);place(2462,S_('end',0.05),0.18,dur=3)   # sáng hôm sau, gà gáy xa
place(2482,span('cta')[0],0.16,dur=span('cta')[1]-span('cta')[0])
# im lặng trước khoảnh khắc ma hiện (jump nhẹ)
JT=[span('hook2')[0]+0.2,S_('gl',0.05),S_('silent',0.3),S_('voice',0.45),S_('gtm',0.3)]
for t in JT:s0=int((t-0.7)*SR);s1=int(t*SR);out[s0:s1]*=np.linspace(1,0.15,s1-s0)[:,None]
a,b=span('final2');out[int(S_('final2',0.7)*SR):int(b*SR)]*=0.35   # lúc "dạ" — nền gần im
out/=np.abs(out).max()*1.05
jt=np.zeros((N,2))
def jplace(i,t,g,dur):
    x=load(i);n=min(len(x),int(dur*SR));x=x[:n].copy();x[-int(0.25*SR):]*=np.linspace(1,0,int(0.25*SR))[:,None];s2=int(t*SR);m=min(n,N-s2);jt[s2:s2+m]+=x[:m]*g
for t in JT:jplace(565,t-0.02,0.55,1.4);jplace(677,t,0.3,1.2);jplace(2630,t,0.25,2.0)
jt/=np.abs(jt).max()*1.02;wavfile.write(D+'jump.wav',SR,(jt*32767).astype(np.int16))
wavfile.write(D+'sfx.wav',SR,(out*32767).astype(np.int16));print('ok',[round(t,1) for t in JT])
