# Gọi hồn trên mái nhà — bản 2.5D: người kể MaDa, Út ElevenLabs, tiếng bà VieNeu (chậm + vang). Timeline theo độ dài thật.
import json,os,re,sys,difflib,subprocess,tempfile,shutil,numpy as np,importlib.util
from scipy.io import wavfile
G='/home/claude/giong-doc/';sys.path.insert(0,G+'pipeline/lib')
from ghostfx import ghost
spec=importlib.util.spec_from_file_location('pace',G+'pipeline/lib/pace.py');P=importlib.util.module_from_spec(spec);spec.loader.exec_module(P)
SR=48000;D=os.path.dirname(os.path.abspath(__file__))+'/';OUT=G+'render/gh25/';os.makedirs(OUT,exist_ok=True)
norm=lambda s:re.sub(r'[^\w\s]','',s.lower()).split()
def ff(c,af):
    d=tempfile.mkdtemp();a=d+'/a.wav';b=d+'/b.wav';wavfile.write(a,SR,(c/max(1e-9,np.abs(c).max())*.9*32767).astype(np.int16))
    subprocess.run(['ffmpeg','-v','error','-y','-i',a,'-af',af,b],check=True);r,y=wavfile.read(b);y=y.astype(float)/32768;return y if y.ndim==1 else y.mean(1)
def mp3(f):
    d=tempfile.mkdtemp();w=d+'/x.wav';subprocess.run(['ffmpeg','-v','error','-y','-i',f,'-ar',str(SR),'-ac','1',w],check=True);r,y=wavfile.read(w);return y.astype(float)/32768
def take(job,idx):
    J=json.load(open(G+f'jobs/{job}.json'));vd=[x for x in os.listdir(G+f'out/{job}') if not x.startswith('DONE')][0]
    txt=sorted(set(J['lines']),key=J['lines'].index)[idx];best=None
    for k,l in enumerate(J['lines']):
        if l!=txt:continue
        f=G+f'out/{job}/{vd}/{k:02d}';r=difflib.SequenceMatcher(None,norm(txt),norm(open(f+'.txt').read())).ratio()
        if best is None or r>best[0]:best=(r,f)
    return txt,P.trim(P.load(best[1]+'.wav'))
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
L=[];
for lid,idx in [('n1',0),('n2',1),('n3',2)]:t,c=take('99_toon_n',idx);L.append([lid,'N',t,P.stretch_pauses(c,factor=1.25,extra=.05)])
L.append(['u','U','Bà nội ơi… về đi bà ơi!',P.trim(mp3(D+'el/u_a.mp3'))])
t,c=take('99_toon_g',0);L.append(['g','G',t,ghost(ff(c,f'asetrate={int(SR*.9)},aresample={SR},atempo=0.8'),'far')])
for lid,idx in [('n4',3),('n5',4)]:t,c=take('99_toon_n',idx);L.append([lid,'N',t,P.stretch_pauses(c,factor=1.25,extra=.05)])
nr=np.median([np.sqrt(np.mean(x[3]**2)) for x in L if x[1]=='N'])
for x in L:
    if x[1]!='N':x[3]=x[3]*nr/np.sqrt(np.mean(x[3]**2))*(.8 if x[1]=='G' else 1.05)
gap={'n1':.35,'n2':.7,'n3':.4,'u':1.3,'g':.9,'n4':.5,'n5':0}
st=[.6]
for k in range(len(L)-1):st.append(st[k]+len(L[k][3])/SR+gap[L[k][0]])
nd=[len(x[3])/SR for x in L];dur=st[-1]+nd[-1]+3.2
I={x[0]:k for k,x in enumerate(L)};T=lambda k:st[I[k]];Dd=lambda k:nd[I[k]]
cuts=[0,T('n2')-.15,T('n3')-.2,T('u')-.25,T('g')-1.0,T('n4')+Dd('n4')*.35,T('n5')-.2,dur];names=['ext','field','roof','call','listen','turn','room']
sc=[[n,round(cuts[i],3),round(cuts[i+1],3),[round(s-cuts[i],2) for s in st if cuts[i]<=s<cuts[i+1]]] for i,n in enumerate(names)]
jt=T('n2')+Dd('n2')*.42;jumpF=(jt-cuts[1])/(cuts[2]-cuts[1])
ot=T('n5')+Dd('n5')*.62;openF=(ot-cuts[6])/(cuts[7]-cuts[6])
VOX=[[round(s+a,2),round(s+b,2),x[1]] for x,s in zip(L,st) if x[1]!='N' for a,b in vox(x[3])]
subs=[]
for x,s,d in zip(L,st,nd):
    a,b=s,s+d
    if x[1]!='N':
        iv=[v for v in VOX if v[2]==x[1] and a-.01<=v[0] and v[1]<=b+.01]
        if iv:a,b=iv[0][0],iv[-1][1]
    txt=re.sub(r'\s+',' ',x[2]);subs.append([round(a,2),round(max(b+.25,a+1.2),2),txt if x[1]=='N' else '“'+txt+'”',x[1]])
TL=dict(dur=round(dur,2),scenes=sc,subs=subs,vox=VOX,starts=st,durs=nd,lines=[x[0] for x in L],jumpF=round(jumpF,3),openF=round(openF,3))
json.dump(TL,open(D+'tl.json','w'),ensure_ascii=False)
html=''.join(open(D+p).read() for p in ('head.part','body.part','over.part','scenes.part'))
open(OUT+'index.html','w').write(html.replace('/*TLD*/null',json.dumps(TL,ensure_ascii=False)))
shutil.copy(D+'ng_chars.js',OUT)
for f in ('helpers.js','shots.js','shots_tr.js','bm_chars.js'):shutil.copy(G+'render/ng2/'+f,OUT)
if not os.path.exists(OUT+'lib'):shutil.copytree(G+'render/ng2/lib',OUT+'lib')
N=int(dur*SR);v=np.zeros(N)
for x,s in zip(L,st):i=int(s*SR);v[i:i+len(x[3])]+=x[3][:N-i]
v/=np.abs(v).max()*1.05;wavfile.write(D+'voice.wav',SR,(np.stack([v,v],1)*32767).astype(np.int16))
print('dur',round(dur,1),'jumpF',round(jumpF,2),[s[:3] for s in sc])
