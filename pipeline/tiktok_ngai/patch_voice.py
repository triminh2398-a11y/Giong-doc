# Ngải Thất Sơn — chèn thoại ElevenLabs (el/<mã>_a|_b.mp3) vào voice.wav, GIỮ timeline (không render lại hình)
import json,os,subprocess,tempfile,sys,numpy as np
G='/home/claude/giong-doc/';sys.path.insert(0,G+'pipeline/lib')
from scipy.io import wavfile
from ghostfx import ghost
SR=48000;D=G+'pipeline/tiktok_ngai/'
T=json.load(open(D+'tl.json'));S=json.load(open(D+'script.json'))
MAP={6:'B1',7:'B2',8:'B3',12:'T1',13:'L1',17:'G3',19:'T2',23:'B4',24:'B5',28:'G1',35:'T3',38:'T4',41:'G2'}
r,v=wavfile.read(D+'voice.wav');v=v.astype(float)/32768
def ff(c,af):
    d=tempfile.mkdtemp();a=d+'/a.wav';b=d+'/b.wav';wavfile.write(a,SR,(c/max(1e-9,np.abs(c).max())*0.9*32767).astype(np.int16))
    subprocess.run(['ffmpeg','-v','error','-y','-i',a,'-af',af,b],check=True);_,y=wavfile.read(b);y=y.astype(float)/32768;return y if y.ndim==1 else y.mean(1)
def load(p):
    d=tempfile.mkdtemp();o=d+'/a.wav';subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ar',str(SR),'-ac','1',o],check=True);_,y=wavfile.read(o);return y.astype(float)/32768
def trim(x):
    e=np.abs(x);idx=np.where(e>e.max()*0.02)[0];return x[max(0,idx[0]-int(0.03*SR)):idx[-1]+int(0.1*SR)] if len(idx) else x
def expr(x):
    n=int(0.03*SR);e=np.array([np.sqrt(np.mean(x[k:k+n]**2))+1e-6 for k in range(0,len(x)-n,n)]);e=20*np.log10(e);e=e[e>e.max()-35];return float(np.std(e))
NEW={}
for i,code in MAP.items():
    sp=S[i][1];fs=[D+f'el/{code}_{t}.mp3' for t in 'ab' if os.path.exists(D+f'el/{code}_{t}.mp3')]
    c=max((trim(load(f)) for f in fs),key=expr)
    if sp=='GL':c=ghost(c,'far')
    elif sp=='GTM':c=ghost(c,'ghost')
    st=T['starts'][i];od=T['durs'][i];nxt=T['starts'][i+1] if i+1<len(T['starts']) else T['dur'];avail=nxt-st-0.12
    f=1.0
    if len(c)/SR>avail:f=min(1.3,len(c)/SR/avail);c=ff(c,f'atempo={f:.3f}')
    a=int(st*SR);seg=v[a:int((nxt-0.05)*SR),0];on=seg[np.abs(seg)>0.01];ro=np.sqrt(np.mean(on**2)) if len(on) else 0.1
    o2=c[np.abs(c)>0.01];c=c*ro/(np.sqrt(np.mean(o2**2))+1e-9)
    NEW[i]=(st,len(c)/SR,c.copy());v[a:int((nxt-0.05)*SR)]=0;n=min(len(c),len(v)-a);v[a:a+n,0]+=c[:n];v[a:a+n,1]+=c[:n]
    print(i,code,sp,'cũ',round(od,2),'mới',round(len(c)/SR,2),'ô',round(avail,2),'nhanh',round(f,2),len(fs),'bản')
v/=max(1,np.abs(v).max()/0.97);wavfile.write(D+'voice_el.wav',SR,(v*32767).astype(np.int16));print('ok')

# căn lại phụ đề các câu đã thay (theo chỗ ngắt hơi thật) -> tl_el.json
S2=[list(x) for x in T['subs']]
for i,(st,d,c) in NEW.items():
    nxt=T['starts'][i+1] if i+1<len(T['starts']) else T['dur'];sp=S[i][1]
    idx=[k for k,x in enumerate(S2) if st-0.06<=x[0]<nxt-0.05 and x[3]==sp]
    if not idx:continue
    w=[len(S2[k][2])+5 for k in idx];tot=sum(w);n=int(0.02*SR)
    en=np.array([np.sqrt(np.mean(c[q:q+n]**2)) for q in range(0,max(1,len(c)-n),n)]);thr=en.max()*0.06;gaps=[];q=0
    while q<len(en):
        if en[q]<thr:
            r2=q
            while r2<len(en) and en[r2]<thr:r2+=1
            if (r2-q)*0.02>=0.12 and q>0 and r2<len(en):gaps.append(st+(q+r2)/2*0.02)
            q=r2
        else:q+=1
    t0=st+0.03;dd=(min(d,len(' '.join(S2[k][2] for k in idx))*0.13+0.9) if sp.startswith('G') else d)-0.06
    for j,(k,wi) in enumerate(zip(idx,w)):
        L=dd*wi/tot
        if j<len(idx)-1 and gaps:
            g=min(gaps,key=lambda g:abs(g-(t0+L)))
            if abs(g-(t0+L))<0.7 and g>t0+0.4:L=g-t0
        if j==len(idx)-1:L=max(0.5,st+dd-t0)
        S2[k][0]=round(t0,2);S2[k][1]=round(t0+L,2);t0+=L
T2=dict(T);T2['subs']=S2;json.dump(T2,open(D+'tl_el.json','w'),ensure_ascii=False)
print('ranges',[(round(NEW[i][0],2),round(T['starts'][i+1] if i+1<len(T['starts']) else T['dur'],2)) for i in NEW])
