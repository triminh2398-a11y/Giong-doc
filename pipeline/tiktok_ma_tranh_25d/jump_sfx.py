import numpy as np
from scipy import signal
from scipy.io import wavfile
SR,x=wavfile.read('sfx.wav');x=x.astype(np.float64)/32768;N=len(x);out=x.copy()
rng=np.random.default_rng(11)
bp=lambda s,a,b:signal.sosfilt(signal.butter(2,[a,b],'band',fs=SR,output='sos'),s)
lp=lambda s,f:signal.sosfilt(signal.butter(2,f,'low',fs=SR,output='sos'),s)
def place(s,at,g):
    i=int(at*SR);n=min(len(s),N-i);out[i:i+n,0]+=s[:n]*g;out[i:i+n,1]+=s[:n]*g
def scream(d=1.0):
    k=np.arange(int(d*SR))/SR;f=900+500*np.sin(2*np.pi*7*k)+300*k
    tone=sum(np.sin(2*np.pi*np.cumsum(f*m)/SR)/m for m in (1,1.5,2.3,3.1))
    s=(tone*0.5+bp(rng.standard_normal(len(k)),1500,6000)*1.5)*np.exp(-k*2.2)*np.minimum(1,k*200)
    hit=(np.sin(2*np.pi*(60-30*k)*k)*2+lp(rng.standard_normal(len(k)),300)*3)*np.exp(-k*5)
    return s+hit
def roar(d=1.8):
    k=np.arange(int(d*SR))/SR;am=0.6+0.4*np.sin(2*np.pi*9*k);return (lp(rng.standard_normal(len(k)),500)*4*am+np.sin(2*np.pi*(90+20*np.sin(k*6))*k)*1.5*am)*np.sin(np.pi*k/d)**0.5
for at,g in [(6.08,0.6),(79.3,1.0),(155.3,1.0),(165.75,0.7)]:place(scream(),at,g)
place(roar(),9.81,0.9);place(roar(2.2),160.9,0.9)
out/=max(1,np.abs(out).max()*1.05)
wavfile.write('sfx_jump.wav',SR,(out*32767).astype(np.int16));print('ok',N/SR)
