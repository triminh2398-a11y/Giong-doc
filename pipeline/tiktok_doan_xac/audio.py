import json, subprocess, os, numpy as np
from scipy.io import wavfile
SR=48000;T=json.load(open('tl.json'));DUR=T['dur'];N=int(DUR*SR);out=np.zeros((N,2))
LIB='/home/claude/giong-doc/sfxlib/mixkit/';CACHE='/home/claude/tr/sfxcache/';os.makedirs(CACHE,exist_ok=True)
SC={};[SC.setdefault(k,(a,b,ls)) for k,a,b,ls in T['scenes']]
ALL=[(k,a,b,ls) for k,a,b,ls in T['scenes']]
ST,DU,LN=T['starts'],T['durs'],T['lines']
def lend(k):i=max(j for j,q in enumerate(LN) if q==k);return ST[i]+DU[i]
def load(i):
    w=CACHE+f'{i}.wav'
    if not os.path.exists(w):subprocess.run(['ffmpeg','-v','error','-y','-i',LIB+f'{i}-preview.mp3','-ar',str(SR),'-ac','2',w],check=True)
    r,x=wavfile.read(w);x=x.astype(np.float64)/32768;return x/max(1e-6,np.abs(x).max())
def place(i,at,g=1.0,dur=None,fi=0.05,fo=0.3,loop=False,off=0):
    x=load(i);x=x[int(off*SR)%max(1,len(x)-SR):] if len(x)>SR else x
    if dur is not None:
        n=int(dur*SR)
        if loop and len(x)<n:x=np.tile(x,(n//len(x)+1,1))
        x=x[:n]
    x=x.copy();n=len(x);a=int(fi*SR);b=int(fo*SR)
    if a>0:x[:min(a,n)]*=np.linspace(0,1,min(a,n))[:,None]
    if b>0:x[-min(b,n):]*=np.linspace(1,0,min(b,n))[:,None]
    s=int(at*SR);m=min(n,N-s)
    if m>0 and s>=0:out[s:s+m]+=x[:m]*g
def bed(i,keys,g,fade=0.6):
    for k,a,b,ls in ALL:
        if k in keys:place(i,a,g,dur=b-a+0.3,fi=fade,fo=fade,loop=True,off=(a*7)%5)
def span(k):a,b,ls=SC[k];return a,b
# --- nền: mưa lớn ngoài trời đêm đầu, mưa nhỏ ngoài vách khi ở trong quán
storm=['hook','hook2','title','bell']
bed(2400,storm,0.42);bed(2413,storm,0.18)
inside_night=['herder','rules','rules2','mai','rooster','midnight','count','fourth','hat','father','herder2','herder3','maicome','breath','grab','fight','idea','crow','fall']
bed(1253,inside_night,0.16);bed(3081,inside_night,0.22)
bed(2746,['count','fourth','hat','father','breath','grab'],0.16)
bed(1238,['inn','thread'],0.18);place(2472,span('thread')[0]+0.2,0.12,dur=5)
bed(1157,['dusk','mark','mark2','final','final2','cta'],0.24);bed(1162,['empty','final2'],0.22)
bed(1789,['final','cta'],0.12);place(2466,span('final')[0]+1.0,0.3)
place(2405,span('title')[0]+0.05,0.6,dur=4);place(2395,span('bell')[0]+0.5,0.35,dur=5)
# --- chuông leng keng của thầy dắt xác
def bells(t0,t1,g,step=1.7):
    t=t0
    while t<t1-0.4:place(936,t,g,dur=1.2,fo=0.5);t+=step
bells(0.3,span('hook2')[1],0.32);bells(span('bell')[0]+0.4,span('bell')[1],0.36);bells(span('dusk')[0]+0.3,span('dusk')[1],0.22)
bells(span('final')[0]+1.5,span('final')[1],0.1,2.4);bells(span('final2')[0],span('final2')[1]-0.8,0.14,2.0)
# --- tiếng nhảy "bịch" theo nhịp hop() (chạm đất mỗi pi/3.4 s)
def hops(t0,t1,g,n=3):
    k=int(np.ceil(t0*3.4/np.pi))
    while k*np.pi/3.4<t1:
        t=k*np.pi/3.4
        for j in range(n):place(3058,t+j*0.06,g*(0.8**j),dur=0.35,fo=0.15)
        k+=1
for sc,g in [('hook',0.3),('hook2',0.35),('bell',0.3),('dusk',0.2),('final2',0.16)]:a,b=span(sc);hops(a,b,g)
# --- trong quán
place(195,span('herder')[0]+0.1,0.4,dur=3);place(337,span('midnight')[0]+0.4,0.4);place(337,span('midnight')[0]+2.6,0.35)
place(337,span('count')[0]+0.5,0.3);bed(494,['count','fourth','hat'],0.35);bed(493,['breath'],0.4)
place(773,span('fourth')[0]+SC['fourth'][2][-1]+2.6,0.5);place(2630,span('hook2')[0]+0.1,0.4,dur=3);place(1143,span('title')[0],0.6)
place(2462,span('rooster')[0]+1.2,0.35,dur=1.6)  # Phúc giả tiếng gà chọc em
place(2234,span('grab')[0]+1.3,0.45,dur=3);place(2623,span('herder2')[0]+0.1,0.4)
fa,fb=span('fight')
for t in np.arange(fa+0.9,fb,2.2):place(1340,t,0.45,dur=1.2);place(1330,t,0.3,dur=1.3)
bells(fa+0.2,fb,0.3,0.9)
place(2462,lend('crow')+0.15,0.85,dur=2.0)  # tiếng gáy của Phúc
place(2498,span('fall')[0]+0.45,0.8,dur=1.5);place(2182,span('fall')[0]+0.5,0.6,dur=1.0)
place(195,span('empty')[0]+0.1,0.4,dur=3);place(561,span('final2')[0],0.4,dur=4)
# --- jumpscare: hạ nền 0,7s trước, track riêng cộng sau loudnorm (khớp JUMPS trong index.html)
JT=[(lend('hook2')+0.05,0.8),(SC['father'][0]-0.75,1.0),(SC['grab'][0]+1.2,1.0),(lend('final2')+0.05,0.95)];print('JT',[round(a,2) for a,_ in JT])
for at,g in JT:
    s0=int((at-0.7)*SR);s1=int(at*SR);out[s0:s1]*=np.linspace(1,0.05,s1-s0)[:,None];out[s1:s1+int(0.8*SR)]*=0.2
out/=np.abs(out).max()*1.05
jt=np.zeros((N,2))
def jplace(i,at,g,dur):
    x=load(i);n=min(len(x),int(dur*SR));x=x[:n].copy();x[-int(0.25*SR):]*=np.linspace(1,0,int(0.25*SR))[:,None];s2=int(at*SR);m=min(n,N-s2);jt[s2:s2+m]+=x[:m]*g
for at,g in JT:
    jplace(788,at-0.03,1.0*g,1.6);jplace(1963,at,0.9*g,1.3);jplace(677,at,0.6*g,1.0);jplace(565,at-0.02,0.8*g,1.2)
jt/=np.abs(jt).max()*1.02;wavfile.write('jump.wav',SR,(jt*32767).astype(np.int16))
wavfile.write('sfx.wav',SR,(out*32767).astype(np.int16));json.dump(JT,open('jt.json','w'));print('ok')
