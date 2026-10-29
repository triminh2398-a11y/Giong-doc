import json,numpy as np,subprocess,os,sys,tempfile
sys.path[:0]=['/home/claude/char7']
from scipy.io import wavfile
from ghostfx import ghost
import importlib.util
spec=importlib.util.spec_from_file_location('pace','/home/claude/pace.py');P=importlib.util.module_from_spec(spec);spec.loader.exec_module(P)
SR=48000;X=278.481;SH=3.0
r,b=wavfile.read('base2.wav');b=b.astype(float)/32768
def load(i):
  w=f'/home/claude/tr/sfxcache/{i}.wav'
  if not os.path.exists(w):subprocess.run(['ffmpeg','-v','error','-y','-i',f'/home/claude/giong-doc/sfxlib/mixkit/{i}-preview.mp3','-ar','48000','-ac','2',w],check=True)
  r,x=wavfile.read(w);x=x.astype(float)/32768;return x/np.abs(x).max()
a=int(X*SR);out=np.concatenate([b[:a],np.zeros((int(SH*SR),2)),b[a:]]);N=len(out)
def pl(x,at,g,d=None,fo=0.4):
  if d:x=x[:int(d*SR)]
  x=x.copy();n=int(fo*SR);x[-n:]*=np.linspace(1,0,n)[:,None];s=int(at*SR);m=min(len(x),N-s);out[s:s+m]+=x[:m]*g
for i,g in [(3081,0.10),(1162,0.08),(494,0.12)]:pl(load(i),276.4,g,d=5.6,fo=1.2)
pl(load(195),276.35,0.22,d=2.4)
JT=json.load(open('jt.json'))
for at,_ in JT[:3]:
  for i,g,d in [(565,0.28,1.4),(677,0.15,1.2),(2630,0.12,2.0)]:pl(load(i),at,g,d)
x=P.stretch_pauses(P.trim(P.load('/home/claude/giong-doc/out/80_tx_mai_anhoi/my_duyen/00.wav')),factor=1.6,extra=0.15)
d=tempfile.mkdtemp();wavfile.write(d+'/a.wav',SR,(x/np.abs(x).max()*0.9*32767).astype(np.int16))
subprocess.run(['ffmpeg','-v','error','-y','-i',d+'/a.wav','-af',f'asetrate={int(SR*0.9)},aresample={SR},atempo=0.8',d+'/b.wav'],check=True)
_,y=wavfile.read(d+'/b.wav');y=y.astype(float)/32768;y=y if y.ndim==1 else y.mean(1)
y=ghost(y,'ghost');y=y/np.abs(y).max()*0.55
pl(np.stack([y,y],1),276.9,1.0,d=4.2,fo=1.4)
out=np.clip(out,-0.98,0.98);wavfile.write('mix9.wav',SR,(out*32767).astype(np.int16));print(N/SR)
