# Nâng cấp chung cho engine 2.5D (11/11): chuyển động mượt hơn, đổ khối nhân vật, ma đáng sợ hơn.
# Dùng: python3 ../lib/upgrade25d.py <thư mục truyện>  (chạy SAU mkscenes.py)
import sys
D = sys.argv[1].rstrip('/') + '/'
s = open(D + 'scenes.part').read()
OLD_POST = s[s.index('function motionPost(kk,c,t){'):s.index('c.userData.o=c.userData.o0}', s.index('function motionPost(kk,c,t){'))]
NEW_POST = '''function motionPost(kk,c,t){const h=HSH(kk);const o=c.userData.o||{};
 if(o.crawl){c.rotateZ(1.3);}
 if(GHOST[kk]){const g=GLITCH(t,h);c.position.y+=0.03*Math.sin(t*1.2+h*6);c.rotateZ(0.04*Math.sin(t*0.5+h*3)+g*0.12);c.position.x+=g*0.05;c.material.opacity=0.92+0.08*Math.sin(t*23+h)*(g?1:0.3)}
 else{const br=0.012*Math.sin(t*2.2+h*9);c.position.x+=0.012*Math.sin(t*0.7+h*5);c.scale.set(1,1+br,1);c.position.y+=0.98*br;c.rotateZ(0.012*Math.sin(t*0.9+h*4));
  if(o.walk!==undefined){const b=Math.abs(Math.sin(o.walk));c.position.y+=0.035*b;c.scale.y*=1-0.015*b;c.rotateZ(0.025*Math.sin(o.walk))}
  if(speaking(kk))c.rotateZ(0.025*Math.sin(t*4.2+h)*Math.max(0,Math.sin(t*1.3+h)));
  const d=startleAt(t);if(d>=0){const k=1-d/0.7;c.position.x+=0.035*Math.sin(d*55)*k;c.scale.y*=1-0.05*k*Math.max(0,1-d*4)+0.03*k*Math.max(0,d*4-1)}}
 '''
s = s.replace(OLD_POST, NEW_POST)
# GLITCH: ma giật kiểu stop-motion vài khung mỗi ~2–3s
s = s.replace('function motionPre(kk,c,t){', 'const GLITCH=(t,h)=>{const per=2.3+h*1.4,u=(t+h*11)%per;return u<0.09?(u<0.045?1:-1):0};\nfunction motionPre(kk,c,t){', 1)
# vung tay khi đi cho cả nhân vật dùng arm (woman) lẫn armA (person)
s = s.replace("if(o.walk!==undefined&&(kk==='", "if(o.walk!==undefined&&!o.pot){for(const key of ['arm','armA']){const a=(o[key]||[undefined,undefined]).slice();if(a[0]===undefined)a[0]=-0.12+0.34*Math.sin(o.walk);if(a[1]===undefined)a[1]=0.12+0.34*Math.sin(o.walk);o[key]=a}}\n if(false&&o.walk!==undefined&&(kk==='", 1)
open(D + 'scenes.part', 'w').write(s)
b = open(D + 'head.part').read()
# đổ khối: phủ gradient sáng trái/tối phải + viền sáng trên đầu, chỉ trong phần đã vẽ (source-atop)
if 'source-atop' not in b: b = b.replace("draw(T,m.userData.o);ctx=old;t.needsUpdate=true}", "draw(T,m.userData.o);const g=ctx.createLinearGradient(0,0,c.width,0);g.addColorStop(0,'rgba(255,240,220,.10)');g.addColorStop(0.45,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,10,30,.22)');ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='source-atop';ctx.fillStyle=g;ctx.fillRect(0,0,c.width,1024);const v=ctx.createLinearGradient(0,0,0,1024);v.addColorStop(0,'rgba(255,255,255,.06)');v.addColorStop(1,'rgba(0,0,20,.14)');ctx.fillStyle=v;ctx.fillRect(0,0,c.width,1024);ctx.restore();ctx=old;t.needsUpdate=true}", 1)
open(D + 'head.part', 'w').write(b)
print('upgrade25d ok')
