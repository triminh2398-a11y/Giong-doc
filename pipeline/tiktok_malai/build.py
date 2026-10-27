import json, glob, os, re, difflib, sys, numpy as np, importlib.util
from scipy.io import wavfile
spec=importlib.util.spec_from_file_location('pace','/home/claude/pace.py');P=importlib.util.module_from_spec(spec);spec.loader.exec_module(P)
SR=48000;D='/home/claude/ml/'
S=json.load(open(D+'script2.json'));n=len(S)
OM='/home/claude/giong-doc/out/07_ml_mada8/clone_refs_mada8_wav/';OT='/home/claude/giong-doc/out/08_ml_myduyen/my_duyen/'
norm=lambda s:re.sub(r'[^\w\s]','',s.lower()).split()
real=os.path.exists(OM+'DONE') or os.path.exists('/home/claude/giong-doc/out/07_ml_mada8/DONE')
clips=[];pick=[];im=0;it=0
for i,(shot,spk,line) in enumerate(S):
    if real:
        if spk=='T': cands=[OT+'%02d'%(3*it+k) for k in range(3)];it+=1
        else: cands=[OM+'%02d'%(2*im+k) for k in range(2)];im+=1
        FX=[6,36,43];FD='/home/claude/giong-doc/out/09_ml_fix/clone_refs_mada8_wav/'
        if i in FX and os.path.exists(FD+'00.wav'): cands=[FD+'%02d'%(3*FX.index(i)+k) for k in range(3)]
        if i==6 and os.path.exists('/home/claude/giong-doc/out/10_ml_fix6/DONE'): cands=['/home/claude/giong-doc/out/10_ml_fix6/clone_refs_mada8_wav/%02d'%k for k in range(3)]
        best=None
        for f in cands:
            r=difflib.SequenceMatcher(None,norm(line),norm(open(f+'.txt').read() if os.path.exists(f+'.txt') else '')).ratio()
            if best is None or r>best[0]+0.02: best=(r,f)
        pick.append((i,round(best[0],2)));c=P.stretch_pauses(P.trim(P.load(best[1]+'.wav')),factor=1.4 if spk!='T' else 1.25,extra=0.06)
        if spk=='T': c=c*0.9
        clips.append(c)
    else: clips.append(np.zeros(int(SR*(len(line.split())*0.3+0.3))))
nd=[len(c)/SR for c in clips]
SG={1:3.0,16:0.9,17:1.4,21:0.9,26:0.8,35:1.7,42:1.4}
st=[0.5]
for i in range(n-1):
    same=S[i][0]==S[i+1][0];g=0.4 if same else SG.get(S[i][0],0.5)
    st.append(st[i]+nd[i]+g)
dur=st[-1]+nd[-1]+2.2
first={};last={}
for i,l in enumerate(S): first.setdefault(l[0],i);last[l[0]]=i
shots=sorted(first);cut={k:(0 if k==0 else st[first[k]]-0.12) for k in shots}
title=(st[last[1]]+nd[last[1]]+0.3,cut[2])
sc=[]
for j,k in enumerate(shots):
    a=cut[k];b=cut[shots[j+1]] if j<len(shots)-1 else dur
    if k==1:b=title[0]
    if k==43:sc.append(['END',a,b]);continue
    sc.append([k,a,b])
    if k==1: sc.append(['TITLE',title[0],title[1]])
subs=[]
for i,((shot,spk,txt),s0,d) in enumerate(zip(S,st,nd)):
    toks=txt.split();chunks=[];cur=[]
    for k,t in enumerate(toks):
        cur.append(t)
        if t[-1] in '.,?:' and len(cur)>=3 or len(cur)>=7 or k==len(toks)-1: chunks.append(cur);cur=[]
    if len(chunks)>1 and len(chunks[-1])<=2:
        last_=chunks.pop();chunks[-1]+=last_
    w=[len(' '.join(c))+(6 if c[-1][-1] in '.,?:' else 0) for c in chunks];tot=sum(w);t0=s0+0.03;dd=d-0.06
    for c,wi in zip(chunks,w):
        L=dd*wi/tot;s=' '.join(c).rstrip(',:.') if spk=='N' else ' '.join(c)
        if spk!='N': s='“'+s.rstrip(',')+'”'
        subs.append([round(t0,2),round(t0+L,2),s]+([spk] if spk!='N' else []));t0+=L
cut36=cut[36];cutEnd=cut[43]
TL=dict(starts=st,durs=nd,dur=round(dur,2),scenes=sc,subs=subs,cuts=[title[0],title[1],cut36,cutEnd],titleEnd=title[1],endStart=cutEnd)
json.dump(TL,open(D+'tl.json','w'),ensure_ascii=False)
h=open(D+'helpers.js').read();sh=open(D+'shots.js').read()
html='<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000;overflow:hidden}canvas{display:block}</style></head><body><canvas id="c" width="1080" height="1920"></canvas><script>\nconst TL='+json.dumps(TL,ensure_ascii=False)+';\nconst W=1080,H=1920;const cv=document.getElementById("c");const ctx=cv.getContext("2d");\n'+h+'\n'+sh+'\n</script></body></html>'
open(D+'ml.html','w').write(html)
if real:
    N=int(dur*SR);v=np.zeros(N)
    for c,s0 in zip(clips,st): i=int(s0*SR);v[i:i+len(c)]+=c[:N-i]
    v/=np.abs(v).max()*1.05;wavfile.write(D+'voice.wav',SR,(np.stack([v,v],1)*32767).astype(np.int16))
    print('picks',[p for p in pick if p[1]<0.8])
print('real' if real else 'provisional','dur',round(dur,1))
