import json, subprocess, os, numpy as np
from scipy.io import wavfile
SR=48000;T=json.load(open('/home/claude/ep3/tl.json'));DUR=T['dur'];N=int(DUR*SR);out=np.zeros((N,2))
LIB='/home/claude/giong-doc/sfxlib/mixkit/';CACHE='/home/claude/ep3/sfxcache/';os.makedirs(CACHE,exist_ok=True)
SC={}
for k,a,b,ls,li in T['scenes']: SC[k]=(a,b,ls)
def load(i,rate=1.0):
    w=CACHE+f'{i}_{rate}.wav'
    if not os.path.exists(w):
        af=['-af',f'asetrate={int(SR*rate)},aresample={SR}'] if rate!=1.0 else []
        subprocess.run(['ffmpeg','-v','error','-y','-i',LIB+f'{i}-preview.mp3',*af,'-ar',str(SR),'-ac','2',w],check=True)
    r,x=wavfile.read(w);x=x.astype(np.float64)/32768;return x/max(1e-6,np.abs(x).max())
def place(i,at,g=1.0,dur=None,fi=0.05,fo=0.3,loop=False,off=0,rate=1.0):
    x=load(i,rate)[int(off*SR):]
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
def bed(i,keys,g,fade=0.7,rate=1.0):
    for k in keys:
        if k not in SC: print('nokey',k);continue
        a,b,ls=SC[k];place(i,a,g,dur=b-a+0.4,fi=fade,fo=fade,loop=True,off=(a*7)%5,rate=rate)
def at(k,si=0,off=0.0):return SC[k][0]+SC[k][2][si]+off
keys=list(SC)
def dur(k):return SC[k][1]-SC[k][0]
def rng(k,a=0,b=None):
    A=SC[k][0]+SC[k][2][a]-0.2 if a>0 else SC[k][0]
    B=(SC[k][0]+SC[k][2][b]-0.2) if (b is not None and b<len(SC[k][2])) else SC[k][1]
    return A,B
def thau(A,B,g=0.35,per=0.68,rate=1.0):
    t=A;k=0
    while t<B-0.1:
        place(1797,t+(R(k)-0.5)*0.04,g*(0.85+0.3*R(k+7)),dur=0.6,fi=0.002,fo=0.2,rate=rate*(0.97+0.06*R(k+3)));t+=per;k+=1
def R(i):
    x=np.sin(i*127.1+311.7)*43758.5453;return x-np.floor(x)
FN=['hook','hook2','dem2','vong','dem3','biarung','dem5','dem6','dem7','jump5','nhan','nhan2','tam']
FD=['keo','rung','anong','keota2','luat','mieu','mieu2']
FW=['keota','mieu3','truoc','truoc2','jump1','sang3','jump2','go','xac','dom','tl','tl2','jump6','ma','ma2','ra','ra2','bia','bia2']
DAY=['xom','nha','loc','loc2','xom2','banam','ve','ve2','mat','la2','sang4','banam2','hoa']
INN_N=['dem4','thuy','an']
EXT_N=['dem1','jump3','cuu','cuu2','chuoc','cuoi','cuoi2','final','la','la3','sau2','jump4']
FLAT=['title','cta0','ctamid','cta1','chap1','chap2','chap3','chap4','chap5']
bed(2414,FN,0.26);bed(1241,FN,0.14);bed(1157,FN,0.12)
bed(1235,FD,0.22);bed(40,FD,0.18)
bed(1220,FW,0.24);bed(1157,FW,0.14);bed(40,FW,0.08)
bed(1235,DAY,0.22);bed(2472,DAY,0.1)
bed(1172,INN_N,0.16);bed(2475,INN_N,0.18);bed(1330,INN_N,0.06)
bed(1235,['nha2','sau'],0.14)
bed(2483,EXT_N,0.2);bed(1241,EXT_N,0.12);bed(2475,EXT_N,0.12)
bed(3081,FLAT,0.28);bed(2746,['title','chap1','chap2','chap3','chap4','chap5'],0.14)
bed(1227,['hook3'],0.2)
place(1143,SC['title'][0]+0.05,0.7);place(1797,SC['title'][0]+0.3,0.5,dur=1.2);place(1797,SC['title'][0]+1.0,0.4,dur=1.2)
for c in ['chap1','chap2','chap3','chap4','chap5']:place(682,SC[c][0]+0.05,0.45,dur=dur(c)+0.6,fo=0.8);place(1797,SC[c][0]+0.4,0.35,dur=1)
for k in ['xom','nha','hoa','sau']:place(2462,SC[k][0]+0.6,0.2,dur=3)
# ong
for k in ['keo','anong','keota','keota2','rung']:a,b=rng(k);place(1926,a+0.2,0.22 if k!='keota' else 0.3,dur=b-a,loop=True,fi=0.6,fo=0.8)
place(42,at('anong',0,0.5),0.3,dur=4);place(1328,at('anong',0,0.2),0.25,dur=3)
# đuốc
for k in ['dem2','vong','dem3','biarung','dem5','dem6','dem7','tam','go','xac','dom','tl','jump6','ma','ma2','ra','cuu','cuu2','truoc','mieu3']:a,b=rng(k);place(1329,a,0.12,dur=b-a,loop=True,fi=0.4,fo=0.4)
# tiếng thau
thau(*rng('hook2'),0.32);thau(*rng('hook3',0,1),0.32)
thau(*rng('dem2'),0.34);thau(*rng('dem2'),0.24,per=0.81,rate=0.92)
thau(*rng('vong'),0.3);thau(*rng('vong'),0.2,per=0.77,rate=0.9)
thau(*rng('dem3'),0.32);thau(*rng('dem3'),0.22,per=0.73,rate=1.05)
thau(*rng('sang3'),0.3,per=0.9);thau(rng('biarung',4)[0],SC['biarung'][1],0.3)
thau(*rng('dem5'),0.12,per=0.7);thau(*rng('dem6'),0.1,per=0.7);thau(SC['dem7'][0],at('dem7',1,-1.0),0.09,per=0.7)
thau(SC['nhan'][0],at('nhan',1,-0.3),0.34,per=0.66);thau(at('nhan',3,-0.1),SC['nhan'][1],0.42,per=0.5)
thau(SC['nhan2'][0],at('nhan2',0,1.2),0.4,per=0.5);place(1311,at('nhan2',0,1.25),0.45)
thau(at('nhan2',2,0.3),SC['nhan2'][1],0.45,per=0.42)
thau(at('tam',1,0.6),SC['tam'][1],0.12,per=0.45)
for k in ['go','xac','dom','tl','tl2']:thau(*rng(k),0.05,per=0.55)
thau(*rng('ma2'),0.16,per=0.38);thau(*rng('ra'),0.14,per=0.45);thau(*rng('ra2'),0.2,per=0.45)
thau(SC['bia'][0],at('bia',3,0.6),0.3,per=0.45);place(1800,at('bia',3,0.8),0.5,dur=2.5)
thau(rng('final',2)[0],rng('final',4)[1],0.22,per=0.75)
# lội nước
for k in ['rung','dem5','ra','ra2']:a,b=rng(k);place(536,a+0.3,0.3,dur=b-a-0.3,loop=True,fi=0.3,fo=0.5)
for k in ['truoc','dem6','mieu3']:a,b=rng(k);place(536,a+0.3,0.18,dur=b-a-0.3,loop=True,fi=0.3,fo=0.5)
place(536,at('dem6',4,-0.5),0.0,dur=0.1)
place(537,at('la3',0,0.3),0.0,dur=0.1)
# nhai bùn
for k,si,d in [('sang3',3,9),('jump2',0,6),('jump3',2,6),('cuoi',2,5),('cuoi2',0,3)]:place(2252,at(k,si,0.1),0.32,dur=d,loop=True,fi=0.3,fo=0.6,rate=0.85)
# chó gầm gừ
for k,si in [('dem1',3),('la2',3),('sau2',1)]:place(59,at(k,si,0.2),0.3,dur=3,rate=0.9)
place(54,at('la2',3,1.2),0.2,dur=2)
# thì thầm, tim đập
place(302,at('jump5',0,0.5),0.3,dur=4);place(302,at('bia2',1,0.5),0.25,dur=3)
for k in ['truoc2','jump1','dem7','jump5','tl','ra','ra2','jump4','cuoi2']:a,b=rng(k);place(494,a+0.3,0.3,dur=b-a,loop=True,fi=1.0,fo=1.0)
# ma xuất hiện / gió rít
for k,si in [('keota2',4),('hook',0),('truoc2',1),('dem3',4),('jump4',3),('jump6',0),('bia2',2),('final',4)]:place(2623,at(k,si,0.0),0.4)
place(2234,at('tam',2,0.1),0.4,dur=3);place(2231,at('jump6',1,0.0),0.3,dur=4);place(2234,at('ma',0,0.0),0.35,dur=4);place(307,at('ma2',1,0.2),0.35,dur=2.5)
# chén bể, cửa
place(2934,at('an',2,0.2),0.5);place(677,at('an',2,0.35),0.45);place(195,at('jump4',0,0.3),0.35)
place(1311,at('chuoc',0,0.5),0.25);place(1308,at('chuoc',0,0),0.25,dur=dur('chuoc'),loop=True)
place(1311,at('dom',0,0.2),0.2);place(1308,at('dom',0,0.2),0.18,dur=4)
place(2466,SC['dem1'][0]+SC['dem1'][2][2]+0.5,0.25);place(2466,SC['cuoi'][0]+1,0.22);place(2466,SC['final'][0]+1,0.2)
place(2462,at('bia2',3,0.5),0.25,dur=3)
# vọng tiếng Lộc nhiều phía: thêm whoosh
for si in [2,4]:place(2630,at('vong',si,0.0),0.25,dur=3)
# kết: lặng dần
a0=int(at('final',1,-1.0)*SR);a1=int(at('final',1,0)*SR);out[a0:a1]*=np.linspace(1,0.25,a1-a0)[:,None]
S=[l.rstrip('\n').split('|',2) for l in open('/home/claude/giong-doc/pipeline/ep03_ma_giau/script.txt') if l.strip()]
EMO=json.load(open('/home/claude/ep3/emo.json'));STL=T['starts']
for i,e in EMO.items():
    i=int(i);t0=STL[i];t1=STL[i+1] if i+1<len(STL) else t0+4
    if e=='cry':place(469,t0-0.2,0.12,dur=t1-t0+0.3,fi=0.4,fo=0.6)
JT=[j[0] for j in T['jumps']];print('JT',JT)
for t in JT:
    s0=int((t-0.7)*SR);s1=int(t*SR);out[s0:s1]*=np.linspace(1,0.15,s1-s0)[:,None];out[s1:s1+int(0.9*SR)]*=0.5
out/=np.abs(out).max()*1.05
jt=np.zeros((N,2))
def jplace(i,t,g,dur,rate=1.0):
    x=load(i,rate);n=min(len(x),int(dur*SR));x=x[:n].copy();x[-int(0.25*SR):]*=np.linspace(1,0,int(0.25*SR))[:,None];s2=int(t*SR);m=min(n,N-s2);jt[s2:s2+m]+=x[:m]*g
for t in JT:
    jplace(788,t-0.02,0.6,1.4);jplace(1963,t,0.45,1.6);jplace(565,t,0.5,1.4);jplace(677,t+0.02,0.3,1.0)
jt/=np.abs(jt).max()*1.02;wavfile.write('/home/claude/ep3/jump.wav',SR,(jt*32767).astype(np.int16))
wavfile.write('/home/claude/ep3/sfx.wav',SR,(out*32767).astype(np.int16));print('ok')
