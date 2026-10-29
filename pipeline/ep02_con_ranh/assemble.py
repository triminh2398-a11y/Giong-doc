import json,shutil
D='/home/claude/ep2/';O='/home/claude/giong-doc/render/ep2/'
TL=json.load(open(D+'tl.json'))
for f in ['chars.js','flat.js']:shutil.copy(D+f,O+f)
main=''.join(open(D+f'main{i}.js').read()+'\n' for i in range(1,7))
open(O+'main.js','w').write(main)
html='''<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;background:#000;overflow:hidden}canvas{position:absolute;left:0;top:0}</style>
<script>const W=1080,H=1920;const cv=document.createElement('canvas');cv.width=512;cv.height=1024;let ctx=cv.getContext('2d');
const TL={starts:[],scenes:[],subs:[],dur:20};const L_=(ls,i,d=0)=>ls[i]??d;</script>
<script src="helpers.js"></script><script src="shots.js"></script><script src="chars.js"></script><script src="flat.js"></script>
<script>const TLD='''+json.dumps(TL,ensure_ascii=False)+''';</script>
<script type="importmap">{"imports":{"three":"./lib/three.module.js"}}</script></head><body>
<script type="module" src="main.js"></script></body></html>'''
open(O+'index.html','w').write(html);print('ok',TL['dur'])
