import json,os,shutil
G='/home/claude/giong-doc/';D=G+'pipeline/tiktok_chucu/';OUT=G+'render/cc/';os.makedirs(OUT,exist_ok=True)
S=json.load(open(D+'script.json'));sc=[];t=0;st=[]
for k,sp,tx in S:
    st.append(t)
    if sc and sc[-1][0]==k: sc[-1][2]=t+4;sc[-1][3].append(round(t-sc[-1][1],2))
    else: sc.append([k,t,t+4,[0]])
    t+=4
TL=dict(dur=t,scenes=sc,subs=[[st[i],st[i]+3.5,S[i][2][:40],S[i][1]] for i in range(len(S))],starts=st,durs=[4]*len(S),lines=[l[0] for l in S],vox=[[st[i],st[i]+3,S[i][1]] for i in range(len(S)) if S[i][1]!='N'])
html=''.join(open(D+p).read() for p in ('head.part','body.part','over.part','scenes.part'))
open(OUT+'index.html','w').write(html.replace('/*TLD*/null',json.dumps(TL,ensure_ascii=False)))
shutil.copy(D+'ng_chars.js',OUT)
for f in ('helpers.js','shots.js','shots_tr.js','bm_chars.js'):shutil.copy(G+'render/ng2/'+f,OUT)
if not os.path.exists(OUT+'lib'):shutil.copytree(G+'render/ng2/lib',OUT+'lib')
sj=open(OUT+'shots.js').read();open(OUT+'shots.js','w').write(sj.replace('if(!o.headless&&!o.old&&!o.back)','if(!o.headless&&!o.old&&!o.back&&!o.bun)'))
json.dump({k:[a,b] for k,a,b,_ in sc},open('/tmp/claude-0/fsc.json','w'))
