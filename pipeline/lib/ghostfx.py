import numpy as np
from scipy import signal
SR=48000
def _ir(dur,decay,seed,bright=6000):
    rng=np.random.default_rng(seed);n=int(dur*SR);t=np.arange(n)/SR
    ir=rng.standard_normal(n)*np.exp(-t*decay);ir=signal.sosfilt(signal.butter(2,bright,'low',fs=SR,output='sos'),ir);ir[0]+=1.0;return ir/np.abs(ir).max()
def pitch(x,semi):
    f=2**(semi/12);y=signal.resample(x,int(len(x)/f));return signal.resample(y,len(x)) if False else y
def ghost(x,kind='ghost'):
    """kind 'ghost': close eerie voice (reverb + low double + whisper); 'far': calling from outside (distant, echoing)"""
    x=x.astype(np.float64);pad=np.zeros(int(SR*3.5));xx=np.concatenate([x,pad])
    rng=np.random.default_rng(7)
    if kind=='far':
        d=signal.sosfilt(signal.butter(2,[250,3200],'band',fs=SR,output='sos'),xx)
        wet=signal.oaconvolve(d,_ir(3.0,1.6,1,4000))[:len(xx)]
        echo=np.zeros_like(xx)
        for k,(dl,g) in enumerate(((0.34,0.45),(0.68,0.28),(1.02,0.16))):i=int(dl*SR);echo[i:]+=d[:len(xx)-i]*g
        y=0.35*d+0.55*wet/np.abs(wet).max()*np.abs(d).max()+0.5*echo
    else:
        low=pitch(x,-4);low=np.concatenate([low,np.zeros(len(xx)-len(low))])[:len(xx)]
        env=np.abs(signal.hilbert(xx));env=signal.sosfilt(signal.butter(2,30,'low',fs=SR,output='sos'),env)
        whisper=signal.sosfilt(signal.butter(2,[2500,9000],'band',fs=SR,output='sos'),rng.standard_normal(len(xx)))*env*1.2
        dry=xx+0.45*low+0.35*whisper
        wet=signal.oaconvolve(dry,_ir(2.6,2.0,3,7000))[:len(xx)];wet=wet/np.abs(wet).max()*np.abs(dry).max()
        pre=np.zeros_like(xx);i=int(0.09*SR);pre[i:]=dry[:len(xx)-i]
        y=0.6*dry+0.6*wet+0.25*pre
    # trim trailing silence below -60dB
    a=np.abs(y);thr=a.max()*0.001;last=np.nonzero(a>thr)[0][-1]+int(0.1*SR);y=y[:last]
    return y/np.abs(y).max()*np.abs(x).max()*1.1
