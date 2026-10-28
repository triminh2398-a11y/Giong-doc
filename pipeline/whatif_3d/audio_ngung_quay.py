import numpy as np
from scipy import signal
from scipy.io import wavfile
SR=48000;DUR=60;N=DUR*SR;t=np.arange(N)/SR;rng=np.random.default_rng(7);out=np.zeros(N)
lp=lambda x,f:signal.sosfilt(signal.butter(2,f,'low',fs=SR,output='sos'),x)
bp=lambda x,a,b:signal.sosfilt(signal.butter(2,[a,b],'band',fs=SR,output='sos'),x)
cl=lambda x,a=0,b=1:np.clip(x,a,b);sm=lambda x:(lambda y:y*y*(3-2*y))(cl(x));seg=lambda t,a,b:cl((t-a)/(b-a))
def G(t):
    return np.where(t<4,0,np.where(t<14,0.3*sm(seg(t,4,14)),np.where(t<24,0.3+0.5*sm(seg(t,14,24)),np.where(t<36,0.8+1.0*sm(seg(t,24,36)),1.8+2.2*sm(seg(t,36,56))))))
g=G(t)
def place(x,at,gn=1):
    i=int(at*SR);n=min(len(x),N-i)
    if n>0:out[i:i+n]+=x[:n]*gn
# city ambience
amb=lp(rng.standard_normal(N),700)*0.5+bp(rng.standard_normal(N),900,2500)*0.12
out+=amb*0.25*(1-sm(seg(t,20,30)))
for k in range(30):
    at=rng.uniform(0,18);d=rng.uniform(0.06,0.14);kk=np.arange(int(d*SR))/SR;f=rng.uniform(2800,4200)
    place(np.sin(2*np.pi*(f+800*np.sin(kk*45))*kk)*np.sin(np.pi*kk/d),at,0.05)
# wind rising with g
wind=bp(rng.standard_normal(N),150,3000)*(0.6+0.4*np.sin(2*np.pi*0.23*t)*np.sin(2*np.pi*0.07*t))
out+=wind*cl(g/3.5)**1.3*0.9
out+=lp(rng.standard_normal(N),90)*cl((g-0.3)/3)*2.2
# deep drone
out+=(np.sin(2*np.pi*41*t)+0.6*np.sin(2*np.pi*43.5*t))*0.12*sm(seg(t,4,20))
# creaks / sliding (cup, table)
def scrape(d):
    kk=np.arange(int(d*SR))/SR;return bp(rng.standard_normal(len(kk)),600,3500)*(0.6+0.4*np.sin(2*np.pi*31*kk))*np.sin(np.pi*kk/d)
place(scrape(0.8),11.5,0.25);place(scrape(1.5),19,0.35);
kk=np.arange(int(0.5*SR))/SR;place(bp(rng.standard_normal(len(kk)),2500,9000)*np.exp(-kk*14),13.6,0.5)
# car alarms & crashes
def crash(d=1.5,lo=80):
    kk=np.arange(int(d*SR))/SR;return (lp(rng.standard_normal(len(kk)),lo*6)*2+np.sin(2*np.pi*lo*kk)*1.2)*np.exp(-kk*3)
def glass(d=1.2):
    kk=np.arange(int(d*SR))/SR;x=np.zeros(len(kk))
    for j in range(40):
        i=int(rng.uniform(0,0.7)*SR);n=int(0.08*SR);f=rng.uniform(3000,8000);k2=np.arange(n)/SR;x[i:i+n]+=np.sin(2*np.pi*f*k2)*np.exp(-k2*40)
    return x+bp(rng.standard_normal(len(kk)),3000,10000)*np.exp(-kk*6)
for at in [24.5,26,28.3,30.2]:place(crash(1.2,90),at,0.5)
for at in np.linspace(33,50,14)+rng.uniform(0,0.8,14):place(glass(),at,0.35)
for at in np.linspace(38,52,10)+rng.uniform(0,0.8,10):place(crash(2.5,45),at,0.9)
# wave roar
out+=(lp(rng.standard_normal(N),400)*3+bp(rng.standard_normal(N),300,5000)*1.2)*sm(seg(t,47.5,55.5))*0.8*(t<55.8)
# underwater
uw=lp(rng.standard_normal(N),250)*1.5*(t>=55.8)*(1-seg(t,58.5,60))
out+=uw
for k in range(40):
    at=rng.uniform(55.9,59.5);d=0.05;kk=np.arange(int(d*SR))/SR;f=rng.uniform(400,1200)
    place(np.sin(2*np.pi*(f+f*3*kk/d)*kk)*np.sin(np.pi*kk/d),at,0.15)
# muffle final transition: hit
place(crash(2.5,40),55.8,1.0)
# music sting at start
kk=np.arange(int(4*SR))/SR;place(sum(np.sin(2*np.pi*f*kk) for f in (110,164.8,220))*np.exp(-kk*0.8)*np.minimum(1,kk*4)/3,0.3,0.3)
out/=np.abs(out).max()*1.1
wavfile.write('sfx.wav',SR,(np.stack([out,out],1)*32767).astype(np.int16));print('ok')
