import json, subprocess, os, numpy as np
from scipy.io import wavfile
SR=48000;T=json.load(open('/home/claude/ep2/tl.json'));DUR=T['dur'];N=int(DUR*SR);out=np.zeros((N,2))
LIB='/home/claude/giong-doc/sfxlib/mixkit/';CACHE='/home/claude/ep2/sfxcache/';os.makedirs(CACHE,exist_ok=True)
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
INN_N=['hook','cuoi2','mamuoi','vongdem','vongdem2','chet','chet2','dauchàm','matlai','ten2','vai2','bau2','vai','sanh3','tay','tay2','doi','doi2','goi','thay3','ket2','ket3','bau3','mo3','lóng2']
INN_D=['nhangay','bantho','vongngay','chet2b','lai','thay','thay2','lóng','twist2','sang','ket']
EXT_N=['hook3','batho','buitre','buitre2','buitre3','jump2','buitre4','goi2']
GRAVE_N=['hook2','modem','jump1','modem2','tra','tra2','tra3','jump4','tra4','final']
DAY=['xom','cuoi','bau','xom2','namco','thaynoi','cach','baba','baba2','hoiky','twist','momuoi','sangmo']
RAIN=['sanh','sanh2','chet3','rach']
DUSK=['moday','mo2','sang2']
FLAT=['title','cta0','ctamid','cta','chap1','chap2','chap3','chap4','chap5']
# nền
bed(1172,INN_N,0.16);bed(2475,INN_N,0.2);bed(1330,INN_N,0.07)
bed(1235,INN_D,0.12);bed(2472,INN_D,0.08)
bed(2459,EXT_N,0.28);bed(2483,EXT_N,0.18);bed(40,['hook3','goi2'],0.2)
bed(1157,GRAVE_N,0.3);bed(2482,GRAVE_N,0.18);bed(2475,GRAVE_N,0.14)
bed(1235,DAY,0.26);bed(2454,['xom','cuoi','namco'],0.14);bed(2472,DAY,0.12)
bed(1247,RAIN,0.42);bed(2394,RAIN,0.2);bed(1182,['rach'],0.3)
bed(1227,DUSK,0.22);bed(1157,DUSK,0.12)
bed(3081,FLAT,0.3);bed(2746,['title','chap1','chap2','chap3','chap4','chap5','final'],0.14)
bed(2746,['twist','twist2','hoiky','doi2','thay3','tra2','tra3'],0.08)
# âm sắc riêng
place(1143,SC['title'][0]+0.05,0.7);place(700,SC['title'][0]+0.4,0.22,dur=SC['title'][1]-SC['title'][0])
for c in ['chap1','chap2','chap3','chap4','chap5']:place(682,SC[c][0]+0.05,0.45,dur=SC[c][1]-SC[c][0]+0.6,fo=0.8)
for k in ['xom','bau','ket']:place(2462,SC[k][0]+0.6,0.22,dur=3)
place(2462,at('tay2',4,0.6),0.16,dur=3,rate=0.95);place(2462,SC['sang'][0]+0.4,0.22,dur=3)
# võng kẽo kẹt
for k,g in [('vongdem',0.32),('vongdem2',0.4),('hook',0.25),('matlai',0.2),('goi',0.15),('thay3',0.15)]:
    a,b,ls=SC[k];place(3076,a+0.2,g,dur=b-a,loop=True,fi=0.5,fo=0.5)
place(3076,at('mo3',3,0.1),0.35,dur=5,loop=True)
place(3076,SC['buitre2'][0]+0.2,0.25,dur=SC['buitre2'][1]-SC['buitre2'][0],loop=True)
place(3179,at('vongdem2',3,0.6),0.3,dur=4)
# tiếng ru hộp nhạc
place(700,at('vongdem',1,0.0),0.10,dur=8,fo=2);place(700,at('ket3',1,0.0),0.16,dur=10,fo=2,rate=0.92);place(700,SC['final'][0],0.2,dur=SC['final'][1]-SC['final'][0]+0.5,fo=2,rate=0.9)
# tiếng trẻ con cười rợn (chậm, trầm)
for k,si,g in [('vongdem2',1,0.4),('modem',3,0.35),('thay2',1,0.35),('buitre3',2,0.5),('thay3',5,0.45),('goi2',5,0.3),('tra3',1,0.3)]:
    place(431,at(k,si,0.4),g,dur=3,rate=0.78)
place(413,at('tra3',3,0.2),0.3,dur=3,rate=0.85);place(2265,at('ket2',0,1.0),0.12,dur=3,rate=0.82)
# tim đập
for k in ['modem','buitre2','tra3','mo3','rach']:a,b,ls=SC[k];place(494,a+0.3,0.35,dur=b-a,loop=True,fi=1.0,fo=1.0)
# ma xuất hiện: whoosh
for k,si in [('hook2',1),('buitre2',1),('bau3',1),('rach',2),('goi2',1),('tra3',1),('modem',1),('vongdem2',2)]:place(2623,at(k,si,0.0),0.45)
# cú, chó
place(2466,SC['batho'][0]+1.5,0.25);place(2466,SC['tra'][0]+0.5,0.25);place(2466,SC['buitre'][0]+2,0.22)
place(1,SC['modem2'][0]+0.3,0.3);place(1,at('namco',4,0.5),0.15)
# cửa, sàn
place(195,at('matlai',3,-0.6),0.4);place(337,SC['tra'][0]+0.2,0.35);place(195,SC['tra'][0]+1.0,0.3)
# chén bể, roi gãy
place(677,at('thaynoi',5,1.6),0.6);place(565,at('thay2',3,0.0),0.55);place(773,at('thay2',3,0.05),0.4)
# bước chân
place(1230,SC['tra'][0]+0.3,0.3,dur=SC['tra'][1]-SC['tra'][0]);place(532,SC['buitre'][0]+0.3,0.25,dur=4);place(1232,at('buitre4',0,0),0.25,dur=3)
place(1232,at('twist2',0,-0.8),0.3,dur=2.5);place(1230,at('goi2',0,0),0.3,dur=5)
# nước, sông
place(1311,at('goi2',4,0.2),0.6);place(1180,at('goi2',4,0.3),0.4);place(1308,at('goi2',1,0),0.3,dur=6,loop=True);place(2454,SC['goi2'][0],0.2,dur=SC['goi2'][1]-SC['goi2'][0])
place(1311,at('lóng2',2,0.5),0.2);place(1182,at('lóng2',2,0.2),0.25,dur=3)
# sấm
for k in ['sanh','chet3','rach']:place(2395,SC[k][0]+2.0,0.5,dur=6)
place(2395,at('rach',3,0.8),0.45,dur=6)
# gió lặng ở tra3: hạ bed bằng cách thêm gió trước rồi cắt
place(1162,SC['tra2'][0],0.3,dur=SC['tra2'][1]-SC['tra2'][0]+0.5)
# quét / va chạm khi lộ chuyện
place(2630,SC['hoiky'][0]+SC['hoiky'][2][4],0.45,dur=4);place(773,at('hoiky',4,0.3),0.4)
place(2630,at('twist2',2,0),0.4,dur=4);place(561,SC['sang'][0],0.25,dur=5)
place(2484,SC['final'][0]+SC['final'][2][1],0.45);place(773,at('final',1,0.6),0.4)
place(2630,SC['hook'][0]+0.2,0.25,dur=5)
# im lặng ở tra3 "gió ngừng"
a0=int(at('tra3',0,0.3)*SR);a1=int(at('tra3',1,0)*SR);out[a0:a1]*=np.linspace(1,0.15,a1-a0)[:,None]
# jumpscare
JT=[j[0] for j in T['jumps']];print('JT',JT)
for t in JT:
    s0=int((t-0.7)*SR);s1=int(t*SR);out[s0:s1]*=np.linspace(1,0.04,s1-s0)[:,None];out[s1:s1+int(0.9*SR)]*=0.2
out/=np.abs(out).max()*1.05
jt=np.zeros((N,2))
def jplace(i,t,g,dur,rate=1.0):
    x=load(i,rate);n=min(len(x),int(dur*SR));x=x[:n].copy();x[-int(0.25*SR):]*=np.linspace(1,0,int(0.25*SR))[:,None];s2=int(t*SR);m=min(n,N-s2);jt[s2:s2+m]+=x[:m]*g
for t in JT:
    jplace(788,t-0.03,1.0,1.6);jplace(1963,t,0.9,1.3);jplace(677,t,0.6,1.0);jplace(565,t-0.02,0.8,1.2);jplace(431,t+0.05,0.5,1.2,rate=0.7)
jt/=np.abs(jt).max()*1.02;wavfile.write('/home/claude/ep2/jump_real.wav',SR,(jt*32767).astype(np.int16))
wavfile.write('/home/claude/ep2/sfx_real.wav',SR,(out*32767).astype(np.int16));print('ok')
