# Gọi hồn trên mái nhà (toon) — ghép giọng thật, dựng timeline theo độ dài thật, xuất web/tl.json + voice.wav
import json, os, re, sys, difflib, subprocess, tempfile, numpy as np, importlib.util
from scipy.io import wavfile
G='/home/claude/giong-doc/';sys.path.insert(0,G+'pipeline/lib')
from ghostfx import ghost
spec=importlib.util.spec_from_file_location('pace',G+'pipeline/lib/pace.py');P=importlib.util.module_from_spec(spec);spec.loader.exec_module(P)
SR=48000;D=os.path.dirname(os.path.abspath(__file__))+'/'
LINES=[('n1','n',0,'99_toon_n'),('n2','n',1,'99_toon_n'),('n3','n',2,'99_toon_n'),('u','u',0,'99_toon_u'),('g','g',0,'99_toon_g'),('n4','n',3,'99_toon_n'),('n5','n',4,'99_toon_n')]
norm=lambda s:re.sub(r'[^\w\s]','',s.lower()).split()
def takes(job,idx):
    J=json.load(open(G+f'jobs/{job}.json'));vd=os.listdir(G+f'out/{job}');vd=[x for x in vd if not x.startswith('DONE')][0]
    txt=sorted(set(J['lines']),key=J['lines'].index)[idx];fs=[G+f'out/{job}/{vd}/{k:02d}' for k,l in enumerate(J['lines']) if l==txt]
    return txt,[f for f in fs if os.path.exists(f+'.wav')]
def ff(c,af):
    d=tempfile.mkdtemp();a=d+'/a.wav';b=d+'/b.wav';wavfile.write(a,SR,(c/max(1e-9,np.abs(c).max())*.9*32767).astype(np.int16))
    subprocess.run(['ffmpeg','-v','error','-y','-i',a,'-af',af,b],check=True);r,y=wavfile.read(b);y=y.astype(float)/32768;return y if y.ndim==1 else y.mean(1)
def expr(x):
    n=int(.03*SR);e=np.array([np.sqrt(np.mean(x[k:k+n]**2))+1e-6 for k in range(0,len(x)-n,n)]);e=20*np.log10(e);e=e[e>e.max()-35];return float(np.std(e)) if len(e)>5 else 0
def vox(c,thr=26,gap=.14):
    n=int(.02*SR);e=np.array([np.sqrt(np.mean(c[k:k+n]**2))+1e-7 for k in range(0,len(c)-n,n)]);db=20*np.log10(e);on=db>db.max()-thr;iv=[];k=0
    while k<len(on):
        if on[k]:
            j=k
            while j<len(on) and on[j]:j+=1
            iv.append([k*.02,j*.02]);k=j
        else:k+=1
    m=[]
    for a,b in iv:
        if m and a-m[-1][1]<gap:m[-1][1]=b
        else:m.append([a,b])
    return [x for x in m if x[1]-x[0]>.06]
clips=[];texts=[]
for lid,who,idx,job in LINES:
    txt,fs=takes(job,idx);texts.append(txt)
    sc=[]
    for f in fs:
        got=open(f+'.txt').read() if os.path.exists(f+'.txt') else ''
        r=difflib.SequenceMatcher(None,norm(txt),norm(got)).ratio();x=P.trim(P.load(f+'.wav'));sc.append((r+(expr(x)*.05 if who!='n' else 0),r,f,x))
    s,r,f,x=max(sc);print(lid,round(r,2),os.path.basename(os.path.dirname(f)),os.path.basename(f))
    if who=='n':x=P.stretch_pauses(x,factor=1.25,extra=.05)
    if who=='u':x=ff(x,'atempo=0.95')
    if who=='g':x=ghost(ff(x,f'asetrate={int(SR*.9)},aresample={SR},atempo=0.8'),'far')
    clips.append(x)
nr=np.median([np.sqrt(np.mean(c**2)) for c,(l,w,_,_) in zip(clips,LINES) if w=='n'])
for k,(l,w,_,_) in enumerate(LINES):
    if w!='n':clips[k]=clips[k]*nr/np.sqrt(np.mean(clips[k]**2))*(.8 if w=='g' else 1.05)
gap={'n1':.35,'n2':.7,'n3':.4,'u':1.3,'g':.9,'n4':.5,'n5':0}
st=[.6];
for k in range(len(LINES)-1):st.append(st[k]+len(clips[k])/SR+gap[LINES[k][0]])
dur=st[-1]+len(clips[-1])/SR+3.2
ls=[dict(id=l[0],who=l[1],t=round(s,2),d=round(len(c)/SR,2),text=re.sub(r'\s+',' ',x)) for l,s,c,x in zip(LINES,st,clips,texts)]
VOX=[[round(s+a,2),round(s+b,2),l[1]] for l,s,c in zip(LINES,st,clips) if l[1]!='n' for a,b in vox(c)]
S={l['id']:l for l in ls}
shots=[[0,S['n2']['t']-.15,'ext'],[S['n2']['t']-.15,S['n3']['t']-.2,'field'],[S['n3']['t']-.2,S['u']['t']-.25,'roof'],[S['u']['t']-.25,S['g']['t']-1.0,'call'],
       [S['g']['t']-1.0,S['n4']['t']+S['n4']['d']*.35,'listen'],[S['n4']['t']+S['n4']['d']*.35,S['n5']['t']-.2,'turn'],[S['n5']['t']-.2,dur,'room']]
jump=S['n2']['t']+S['n2']['d']*.42
subs=[]
for l in ls:
    a,b=l['t'],l['t']+l['d']
    if l['who']!='n':
        iv=[v for v in VOX if v[2]==l['who'] and v[0]>=a-.01 and v[1]<=b+.01]
        if iv:a,b=iv[0][0],iv[-1][1]
    subs.append([round(a,2),round(max(b+.25,a+1.2),2),l['text'] if l['who']=='n' else '“'+l['text']+'”',l['who']])
TL=dict(dur=round(dur,2),lines=ls,vox=VOX,shots=[[round(a,2),round(b,2),n] for a,b,n in shots],jump=round(jump,2),subs=subs)
json.dump(TL,open(D+'web/tl.json','w'),ensure_ascii=False,indent=0)
N=int(dur*SR);v=np.zeros(N)
for c,s in zip(clips,st):i=int(s*SR);v[i:i+len(c)]+=c[:N-i]
v/=np.abs(v).max()*1.05;wavfile.write(D+'voice.wav',SR,(np.stack([v,v],1)*32767).astype(np.int16))
print('dur',round(dur,1),'jump',round(jump,1))
