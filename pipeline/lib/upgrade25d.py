# Nâng cấp chung cho engine 2.5D (11/11): chuyển động mượt hơn, đổ khối nhân vật, ma đáng sợ hơn.
# Dùng: python3 ../lib/upgrade25d.py <thư mục truyện>  (chạy SAU mkscenes.py)
import sys
D = sys.argv[1].rstrip('/') + '/'
s = open(D + 'scenes.part').read()
OLD_POST = s[s.index('function motionPost(kk,c,t){'):s.index('c.userData.o=c.userData.o0}', s.index('function motionPost(kk,c,t){'))]
NEW_POST = '''function motionPost(kk,c,t){const h=HSH(kk);const o=c.userData.o||{};
 if(o.crawl){c.rotateZ(1.3);}
 if(GHOST[kk]){const g=GLITCH(t,h);c.position.y+=0.03*Math.sin(t*1.2+h*6);c.rotateZ(0.04*Math.sin(t*0.5+h*3)+g*0.12);c.position.x+=g*0.05;c.material.opacity=0.7+0.06*Math.sin(t*23+h)*(g?1:0.3)}
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
import re as _re
s = _re.sub(r"grain\([^)]*\);", "", s)  # không nhiễu hạt
s = s.replace("vg.addColorStop(1,'rgba(0,0,0,.55)')", "vg.addColorStop(1,'rgba(0,0,0,.2)')")
open(D + 'scenes.part', 'w').write(s)
# bàn chân: thay bàn chân hình elip bằng đôi dép/giày có đế, mũi chân hướng ra ngoài
n = open(D + 'ng_chars.js').read()
if 'function shoe(' not in n:
    n += """
function shoe(sd,x,y,col,w=1){ctx.save();ctx.translate(x,y);ctx.scale(sd*w,w);ctx.fillStyle=col||'#2a2018';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-14,-6);ctx.quadraticCurveTo(-16,6,-6,7);ctx.lineTo(16,7);ctx.quadraticCurveTo(24,6,22,-1);ctx.quadraticCurveTo(14,-9,-2,-9);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='rgba(255,255,255,.18)';ctx.beginPath();ctx.ellipse(6,-4,8,2.5,0,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-14,4);ctx.lineTo(20,4);ctx.stroke();ctx.restore()}
"""
n = _re.sub(r"ctx\.fillStyle='(#[0-9a-f]{6})';ctx\.strokeStyle=INK;ctx\.lineWidth=3;ctx\.beginPath\(\);ctx\.ellipse\(sd\*(\(?[^,]+?\)?),4-?l?i?f?t?,1[4-7],[67],0,0,7\);ctx\.fill\(\);ctx\.stroke\(\)", lambda m: "shoe(sd,sd*%s,4,'%s')" % (m.group(2), m.group(1)), n)
open(D + 'ng_chars.js', 'w').write(n)
b = open(D + 'head.part').read()
# đổ khối: phủ gradient sáng trái/tối phải + viền sáng trên đầu, chỉ trong phần đã vẽ (source-atop)
if 'source-atop' not in b: b = b.replace("draw(T,m.userData.o);ctx=old;t.needsUpdate=true}", "draw(T,m.userData.o);const g=ctx.createLinearGradient(0,0,c.width,0);g.addColorStop(0,'rgba(255,240,220,.10)');g.addColorStop(0.45,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,10,30,.22)');ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='source-atop';ctx.fillStyle=g;ctx.fillRect(0,0,c.width,1024);const v=ctx.createLinearGradient(0,0,0,1024);v.addColorStop(0,'rgba(255,255,255,.06)');v.addColorStop(1,'rgba(0,0,20,.14)');ctx.fillStyle=v;ctx.fillRect(0,0,c.width,1024);ctx.restore();ctx=old;t.needsUpdate=true}", 1)
open(D + 'head.part', 'w').write(b)
print('upgrade25d ok')
