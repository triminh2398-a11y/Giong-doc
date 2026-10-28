import json, subprocess, os, numpy as np
from scipy.io import wavfile
SR=48000;T=json.load(open('tl.json'));DUR=T['dur'];N=int(DUR*SR);out=np.zeros((N,2))
LIB='/home/claude/giong-doc/sfxlib/mixkit/';CACHE='/home/claude/tr/sfxcache/';os.makedirs(CACHE,exist_ok=True)
SC={k:(a,b,ls) for k,a,b,ls in T['scenes']}
def load(i):
    w=CACHE+f'{i}.wav'
    if not os.path.exists(w):subprocess.run(['ffmpeg','-v','error','-y','-i',LIB+f'{i}-preview.mp3','-ar',str(SR),'-ac','2',w],check=True)
    r,x=wavfile.read(w);x=x.astype(np.float64)/32768;return x/max(1e-6,np.abs(x).max())
def place(i,at,g=1.0,dur=None,fi=0.05,fo=0.3,loop=False,off=0):
    x=load(i)[int(off*SR):]
    if dur is not None:
        n=int(dur*SR)
        if loop and len(x)<n:x=np.tile(x,(n//len(x)+1,1))
        x=x[:n]
    x=x.copy();n=len(x);a=int(fi*SR);b=int(fo*SR)
    if a>0:x[:min(a,n)]*=np.linspace(0,1,min(a,n))[:,None]
    if b>0:x[-min(b,n):]*=np.linspace(1,0,min(b,n))[:,None]
    s=int(at*SR);m=min(n,N-s)
    if m>0:out[s:s+m]+=x[:m]*g
def bed(i,keys,g,fade=0.6):
    for k in keys:
        a,b,ls=SC[k];place(i,a,g,dur=b-a+0.3,fi=fade,fo=fade,loop=True,off=(a*7)%5)
night_ext=['hook','hook2','stilt','procession','call','final']
bed(2483,['hook','hook2','procession'],0.35);bed(1227,['stilt','call','final','yard'],0.3)
bed(2481,['hook','hook2','title','yard','call','final'],0.22)
bed(1235,['village','shrine','warn'],0.3);place(2462,SC['village'][0]+0.5,0.25,dur=3);place(1,SC['village'][0]+4,0.15)
bed(2450,['clothes','oldman','oldman2','clothes2'],0.3);bed(1232 if False else 1230,['loss'],0.35)
bed(1172,['mom','hold','sleep','wake','empty','inside'],0.3);bed(1330,['mom','hold','sleep','inside'],0.18)
bed(1162,['tracks','three','empty'],0.3);bed(1157,['ash','porch'],0.3);bed(2475,['ash'],0.2)
place(2462,SC['porch'][0]+0.3,0.3,dur=3);place(2462,SC['tracks'][0]+0.3,0.2,dur=3)
bed(3081,['prints','procession','oldman2'],0.25);bed(2746,['inside','call','final'],0.18)
# tiger
place(59,9.81,0.8,dur=2.2);place(13,SC['title'][0]+0.1,0.7,dur=2.5)
place(1957,SC['procession'][0]+SC['procession'][2][1]+0.2,0.5,dur=2);place(13,SC['final'][0]+0.2,0.8,dur=2.5)
# footsteps
place(1230,SC['loss'][0]+0.2,0.35,dur=4.5);place(1230,SC['ash'][0]+0.3,0.25,dur=3)
# owl, dog, heartbeat
place(2479,SC['stilt'][0]+SC['stilt'][2][1]+1.2,0.35);place(2466,SC['inside'][0]+1,0.25,dur=4)
bed(494,['three','empty'],0.4);place(491,SC['clothes2'][0],0.4,dur=4)
# door / wind / creaks
place(337,SC['yard'][0]+1.5,0.35);place(195,SC['empty'][0]+0.1,0.45,dur=3);place(1172,SC['wake'][0],0.5,dur=3.5)
place(2623,SC['wake'][0]+0.2,0.5);place(2623,SC['yard'][0]+SC['yard'][2][1]-0.5,0.4)
# hits / sweeps for reveals
place(2630,SC['hook2'][0],0.4,dur=3);place(1143,SC['title'][0],0.6);place(561,SC['final'][0],0.4,dur=4)
place(773,SC['prints'][0]+0.3,0.4);place(773,SC['three'][0]+SC['three'][2][1],0.4);place(2484,SC['empty'][0],0.4)
# jumpscares go to a separate track (added after loudness normalisation so they hit hard)
JT=[(6.08,0.8),(SC['mom'][0]-1.46,1.0),(SC['free'][0]-1.62,1.0),(SC['cta'][0]-0.59,0.9)];print('JT',JT)
for at,g in JT:
    s0=int((at-0.7)*SR);s1=int(at*SR);out[s0:s1]*=np.linspace(1,0.05,s1-s0)[:,None];out[s1:s1+int(0.8*SR)]*=0.2
out/=np.abs(out).max()*1.05
jt=np.zeros((N,2));
def jplace(i,at,g,dur,fi=0.0):
    x=load(i);n=min(len(x),int(dur*SR));x=x[:n].copy();x[-int(0.25*SR):]*=np.linspace(1,0,int(0.25*SR))[:,None];s2=int(at*SR);m=min(n,N-s2);jt[s2:s2+m]+=x[:m]*g
for at,g in JT:
    jplace(788,at-0.03,1.0*g,1.6);jplace(1963,at,0.9*g,1.3);jplace(677,at,0.6*g,1.0);jplace(565,at-0.02,0.8*g,1.2)
jt/=np.abs(jt).max()*1.02;wavfile.write('jump_real.wav',SR,(jt*32767).astype(np.int16))
wavfile.write('sfx_real.wav',SR,(out*32767).astype(np.int16));print('ok')
