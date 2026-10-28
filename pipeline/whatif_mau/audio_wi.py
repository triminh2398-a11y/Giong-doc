import json, numpy as np
from scipy import signal
from scipy.io import wavfile
SR=48000;T=json.load(open('tl.json'));N=int(T['dur']*SR);t=np.arange(N)/SR;rng=np.random.default_rng(3);out=np.zeros(N)
SC={k:(a,b) for k,a,b in T['scenes']}
lp=lambda x,f:signal.sosfilt(signal.butter(2,f,'low',fs=SR,output='sos'),x)
bp=lambda x,a,b:signal.sosfilt(signal.butter(2,[a,b],'band',fs=SR,output='sos'),x)
def place(x,at,g=1):
    i=int(at*SR);n=min(len(x),N-i);out[i:i+n]+=x[:n]*g
# light pad music (chords)
chords=[(220,277.2,329.6),(196,246.9,293.7),(174.6,220,261.6),(196,246.9,329.6)]
for j in range(int(T['dur']/4)+1):
    kk=np.arange(int(4*SR))/SR;env=np.minimum(1,kk/0.6)*np.minimum(1,(4-kk)/0.8)
    x=sum(np.sin(2*np.pi*f*kk)+0.3*np.sin(2*np.pi*2*f*kk) for f in chords[j%4])*env/6
    pl=np.zeros_like(kk)
    for b in range(8):
        i=int(b*0.5*SR);f=chords[j%4][b%3]*2;n=int(0.4*SR);kk2=np.arange(n)/SR;pl[i:i+n]+=np.sin(2*np.pi*f*kk2)*np.exp(-kk2*7)*0.5
    place(x+pl*0.6,j*4,0.18)
def whoosh(d):
    kk=np.arange(int(d*SR))/SR;return bp(rng.standard_normal(len(kk)),300,3000)*np.sin(np.pi*kk/d)**2
a,b=SC['C'];ts=a+min(2.6,(b-a)*0.33)
kk=np.arange(int(1.2*SR))/SR;place(np.sin(2*np.pi*(70-30*kk)*kk)*np.exp(-kk*3)+lp(rng.standard_normal(len(kk)),400)*np.exp(-kk*4),ts,0.9)
kk=np.arange(int(0.5*SR))/SR;place(bp(signal.sawtooth(2*np.pi*900*kk),600,4000)*np.exp(-kk*6),ts-0.05,0.25)
place(whoosh(3),ts+0.2,0.6)
a,b=SC['D'];kk=np.arange(int((b-a)*SR))/SR;place(lp(rng.standard_normal(len(kk)),250)*np.minimum(1,kk/2)*3+bp(rng.standard_normal(len(kk)),400,2500)*np.minimum(1,kk/3)*0.6,a,0.5)
a,b=SC['E'];kk=np.arange(int(2.5*SR))/SR;place(np.sin(2*np.pi*55*kk)*np.exp(-kk*1.5)+lp(rng.standard_normal(len(kk)),200)*np.exp(-kk*2),a+0.6,0.8)
a,b=SC['A'];place(whoosh(2.5),a+0.1,0.35)
out/=np.abs(out).max()*1.1;wavfile.write('sfx.wav',SR,(np.stack([out,out],1)*32767).astype(np.int16));print('ok')
