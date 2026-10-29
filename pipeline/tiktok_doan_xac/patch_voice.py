import json,re,difflib,subprocess,tempfile,sys,numpy as np
sys.path[:0]=['/home/claude/ep1','/home/claude/char7']
from scipy.io import wavfile
from ghostfx import ghost
import importlib.util
spec=importlib.util.spec_from_file_location('pace','/home/claude/pace.py');P=importlib.util.module_from_spec(spec);spec.loader.exec_module(P)
SR=48000;T=json.load(open('tl.json'));S=json.load(open('script.json'))
r,v=wavfile.read('voice.wav');v=v.astype(float)/32768
G='/home/claude/giong-doc/out/'
norm=lambda s:re.sub(r'[^\w\s]','',s.lower()).split()
def expr(x):
    n=int(0.03*SR);e=np.array([np.sqrt(np.mean(x[k:k+n]**2))+1e-6 for k in range(0,len(x)-n,n)]);e=20*np.log10(e);e=e[e>e.max()-35];return float(np.std(e)) if len(e)>5 else 0
def slow(c):
    d=tempfile.mkdtemp();a=d+'/a.wav';b=d+'/b.wav'
    wavfile.write(a,SR,(c/max(1e-9,np.abs(c).max())*0.9*32767).astype(np.int16))
    subprocess.run(['ffmpeg','-v','error','-y','-i',a,'-af',f'asetrate={int(SR*0.92)},aresample={SR},atempo=0.9',b],check=True)
    _,y=wavfile.read(b);y=y.astype(float)/32768;return y if y.ndim==1 else y.mean(1)
def fit(c,avail):
    if len(c)/SR<=avail:return c
    d=tempfile.mkdtemp();a=d+'/a.wav';b=d+'/b.wav';wavfile.write(a,SR,(c/np.abs(c).max()*0.9*32767).astype(np.int16))
    subprocess.run(['ffmpeg','-v','error','-y','-i',a,'-af',f'atempo={min(1.35,len(c)/SR/avail):.3f}',b],check=True)
    _,y=wavfile.read(b);y=y.astype(float)/32768;return y if y.ndim==1 else y.mean(1)
JOB={'K':('78_demo_ts','thai_son'),'GCH':('77_tx_cha_mt','minh_triet')}
FORCE={'Mai... con...':1,'Bốn? Hồi tối... rõ ràng là ba mà!':1,'Lá số của ba... Mai để trên bàn thờ!':4}
FFILE={'Ba...?':'79_tx_phuc_ts_ba/thai_son/01'}
for i,(sh,sp,tx) in enumerate(S):
    if sp not in JOB:continue
    job,vd=JOB[sp];J=json.load(open(f'/home/claude/giong-doc/jobs/{job}.json'))
    ks=[k for k,l in enumerate(J['lines']) if l==tx]
    if tx in FFILE:src=G+FFILE[tx]
    elif tx in FORCE:src=f'{G}{job}/{vd}/{FORCE[tx]:02d}'
    else:
        c=[(difflib.SequenceMatcher(None,norm(tx),norm(open(f'{G}{job}/{vd}/{k:02d}.txt').read())).ratio(),k) for k in ks];top=max(c)[0]
        best=max([q for q in c if q[0]>=top-0.06],key=lambda q:expr(P.trim(P.load(f'{G}{job}/{vd}/{q[1]:02d}.wav')))+10*q[0])[1];src=f'{G}{job}/{vd}/{best:02d}'
    x=P.stretch_pauses(P.trim(P.load(src+'.wav')),factor=1.3,extra=0.05)
    if sp=='GCH':x=ghost(slow(x),'ghost')
    st=T['starts'][i];od=T['durs'][i];nxt=T['starts'][i+1] if i+1<len(S) else T['dur'];avail=nxt-st-0.12
    x=fit(x,avail)
    a=int(st*SR);b=a+int(od*SR);old=v[a:b,0];rms_old=np.sqrt(np.mean(old**2))+1e-9
    x=x*rms_old/(np.sqrt(np.mean(x**2))+1e-9)
    v[a:b]=0;n=len(x);v[a:a+n,0]+=x;v[a:a+n,1]+=x
    print(i,tx,src[-20:],round(od,2),round(n/SR,2),round(avail,2))
v/=max(1,np.abs(v).max()/0.97);wavfile.write('voice2.wav',SR,(v*32767).astype(np.int16))
