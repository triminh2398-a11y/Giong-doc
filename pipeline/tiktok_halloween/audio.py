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
EXT=['title','samhain','turnip','village','scarf','cta']
SEA=['samhain','village','liam','footprints','footprints2','truth','cta']
INN=['hook','grandma','rules','rules2','rules3','forbid','maeve','nora','setup','midnight','steps','liamin','sit','ring','nora2','noraspeak','yearly','final','final2']
COLD=['blue','rot','grab','plan','back','trick','trick2','bite','candle']
bed(1157,EXT+['footprints','footprints2','truth'],0.22);bed(1189,SEA,0.3);bed(2482,['samhain','title','cta'],0.14)
bed(1330,INN+['relief','dark'],0.14);bed(3081,INN+COLD,0.2);bed(2746,['hook','midnight','steps','liamin','sit','ring','nora2']+COLD+['final','final2'],0.13)
bed(1162,COLD,0.18);bed(1059,['midnight','yearly','final'],0.12)
bed(493,['back','trick','trick2','bite'],0.32);bed(494,['steps','liamin','final','final2'],0.25)
place(1143,span('title')[0]+0.05,0.6);place(1329,span('turnip')[0]+0.2,0.25,dur=span('turnip')[1]-span('turnip')[0])
place(1069,at('midnight',0,0.3),0.55,dur=8,fo=1.5)                               # đồng hồ điểm 12 tiếng
place(195,at('midnight',0,(span('midnight')[1]-span('midnight')[0])*0.45),0.5,dur=3)  # cửa sau tự mở
place(2413,at('midnight',0,(span('midnight')[1]-span('midnight')[0])*0.5),0.3,dur=4)  # gió biển lùa vào
place(536,span('steps')[0]+0.2,0.45,dur=span('steps')[1]-span('steps')[0],loop=True)  # bước chân ướt lép nhép
place(536,span('liamin')[0],0.3,dur=3)
for k in ['liamin','sit','ring','nora2']:place(3179,span(k)[0]+0.3,0.25,dur=span(k)[1]-span(k)[0],loop=True)  # nước nhỏ giọt
place(1340,span('blue')[0]+0.1,0.5,dur=1.5);place(194,at('blue',0,(span('blue')[1]-span('blue')[0])*0.35),0.55,dur=1.5)  # lửa xanh + cửa đóng sầm
place(2231,span('grab')[0]+0.2,0.3,dur=3)
place(536,span('back')[0]+0.4,0.22,dur=span('back')[1]-span('back')[0],loop=True,rate=0.9);place(3179,span('back')[0],0.35,dur=span('back')[1]-span('back')[0],loop=True)
place(2623,span('bite')[0]+0.4,0.35)
place(1346,span('candle')[1]-0.7,0.4,dur=1.2)   # tiếng thổi tắt nến
ca,cb=span('candle');a0=int((cb-0.5)*SR);out[a0:int((span('dark')[0]+1.2)*SR)]*=0.15   # tối om, im lặng
place(1232,at('dark',0,1.5),0.3,dur=2.5)
place(1069,at('final',0,0.2),0.4,dur=6,fo=1.5);place(195,at('final',0,0.8),0.45,dur=3)
place(536,at('final',0,2.5),0.3,dur=3,rate=1.25)  # bước chân nhỏ, ướt
place(3179,span('final2')[0],0.3,dur=span('final2')[1]-span('final2')[0]+1.5,loop=True)
place(2630,span('rot')[0]+0.5,0.25,dur=3);place(561,span('footprints')[0],0.2,dur=5)
# jumpscare nhẹ kiểu Ma Lai: lửa xanh, mặt rữa, bàn tay trên vai
JT=[span('blue')[0]+0.1,span('rot')[0]+0.5,at('bite',0,1.2)]
for t in JT:s0=int((t-0.6)*SR);s1=int(t*SR);out[s0:s1]*=np.linspace(1,0.3,s1-s0)[:,None]
out/=np.abs(out).max()*1.05
jt=np.zeros((N,2))
def jplace(i,t,g,dur):
    x=load(i);n=min(len(x),int(dur*SR));x=x[:n].copy();x[-int(0.25*SR):]*=np.linspace(1,0,int(0.25*SR))[:,None];s2=int(t*SR);m=min(n,N-s2);jt[s2:s2+m]+=x[:m]*g
for t in JT:jplace(565,t-0.02,0.55,1.4);jplace(677,t,0.3,1.2);jplace(2630,t,0.25,2.0)
jt/=np.abs(jt).max()*1.02;wavfile.write('jump.wav',SR,(jt*32767).astype(np.int16))
wavfile.write('sfx.wav',SR,(out*32767).astype(np.int16));print('ok',JT)
