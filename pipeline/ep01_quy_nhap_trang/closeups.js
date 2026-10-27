// ===== Close-up inserts (char5 faces) =====
const CUL=[
 ['cold_corpse',1,'corpse',{}],['khoa',1,'khoa',{talk:1,em:'calm',mouth:'smirk'}],['thay_rules',1,'thay',{talk:1}],['thay_rules',3,'thay',{talk:1,em:'angry'}],
 ['night1_steps',3,'lam',{em:'fear',sweat:1}],['night1_steps',5,'lam',{em:'fear',talk:1,sweat:1}],['night1_sound',2,'corpse',{}],['night1_sound',4,'khoa',{talk:1,em:'closed'}],
 ['ba_tu',2,'batu',{talk:1,n:3}],['ba_tu',0,'batu',{talk:1,n:2,em:'sad'}],['khoa_cat',1,'khoa',{talk:1,day:1}],
 ['ruin',6,'ghost',{day:1}],['ruin',7,'lam',{em:'fear',sweat:1,day:1}],['mother_day',2,'me',{talk:1,em:'sad',day:1}],
 ['lamp_out',1,'lam',{em:'fear',dark:1}],['call_name',2,'lam',{em:'fear'}],['call_name',4,'lam',{em:'fear',sweat:1}],
 ['khoa_answer',1,'khoa',{talk:1,em:'angry'}],['khoa_laugh',0,'khoa',{talk:1,em:'fear',sweat:1}],
 ['corpse_face',1,'corpse',{em:'white'}],['corpse_face',2,'corpse',{em:'white',mouth:'o'}],
 ['corpse_altar',2,'ghost',{window:1}],['corpse_altar',3,'ghost',{window:1}],
 ['remember_rule',2,'lam',{em:'fear',hand:1}],['corpse_near',2,'lam',{em:'fear',sweat:1,tear:1}],['corpse_near',3,'lam',{em:'fear',sweat:1,mouth:'teeth'}],
 ['thay_morning',1,'thay',{talk:1,em:'sad',day:1}],['epilogue',7,'khoa',{talk:1,em:'fear',sweat:1}]];
const CUF={lam:{hair:'messy',skin:'#d7c2c0',skin2:'#b9a2a6',sh:'#6a6070'},khoa:{hair:'short',skin:'#dcc4b8',skin2:'#c0a69c',sh:'#4a5a72'},
 thay:Object.assign({},CAST5.thay,{sh:'#2c3048',skin2:'#bca898'}),batu:Object.assign({},CAST5.batu,{sh:'#5e5456',skin2:'#bca498'}),me:Object.assign({},CAST5.me,{sh:'#56606e'}),
 corpse:Object.assign({},CAST5.corpse,{sh:'#2c2834'}),ghost:Object.assign({},CAST5.ghost,{sh:'#e2e2e8'})};
function cuBG(o,T){if(o.window){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#141320');g.addColorStop(1,'#26232f');ctx.fillStyle=g;ctx.fillRect(-500,-500,W+1000,H+1000);return}
 if(o.day){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#8a8696');g.addColorStop(1,'#5e5a6a');ctx.fillStyle=g;ctx.fillRect(-500,-500,W+1000,H+1000);ctx.fillStyle='rgba(40,50,40,.35)';for(let i=0;i<5;i++){ctx.save();ctx.translate(1500+i*60,900);ctx.rotate(-0.4+i*0.25);ctx.beginPath();ctx.ellipse(0,-260,40,260,0,0,7);ctx.fill();ctx.restore()}return}
 ctx.fillStyle=o.dark?'#0c0a0c':'#2e2420';ctx.fillRect(-500,-500,W+1000,H+1000);if(!o.dark){for(let x=0;x<W;x+=130){ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(x+124,0,6,H)}}}
function cuDraw(kind,o,lt,D,T){const f=CUF[kind];cuBG(o,T);
 const z=1+0.05*Math.min(1,lt/Math.max(D,1)),sw=Math.sin(T*0.9)*4;ctx.save();ctx.translate(960+sw,500+(kind==='ghost'?-10:0));ctx.rotate(kind==='ghost'?-0.2:(o.em==='fear'?Math.sin(T*23)*0.004:0));ctx.scale(2.35*z,2.35*z);
 // shoulders
 const sh=f.sh;q(()=>{ctx.moveTo(-200,330);ctx.quadraticCurveTo(-190,200,-92,168);ctx.lineTo(-34,152);ctx.lineTo(34,152);ctx.lineTo(92,168);ctx.quadraticCurveTo(190,200,200,330);ctx.closePath()},sh,2.6);
 if(kind==='lam'||kind==='khoa'){q(()=>{ctx.moveTo(-34,152);ctx.lineTo(0,214);ctx.lineTo(34,152)},'#1a161e',2)}else ln([[-30,152],[20,230],[56,300]],2.2);
 const blink=(kind!=='ghost'&&kind!=='corpse'&&((T*0.37)%1)<0.04);
 let mouth=o.mouth;if(o.talk&&!mouth)mouth=Math.sin(lt*13)>0.1?'teeth':undefined;if(mouth==='smirk')mouth=Math.sin(lt*13)>0.1?'teeth':undefined;
 const em=blink?'closed':(o.em||f.em||'calm');
 face5(Object.assign({},f,{em,mouth,sweat:o.sweat,skipBack:false,look:kind==='lam'?Math.sin(T*0.7)*0.4:0}));
 if(o.tear){ctx.fillStyle='rgba(200,220,240,.8)';ctx.beginPath();ctx.ellipse(-40,30+((lt*20)%40),4,8,0,0,7);ctx.fill()}
 if(o.hand){q(()=>{ctx.ellipse(0,70,60,40,0,0,7)},'#d7c2c0',2.6);for(let i=-2;i<=2;i++)ln([[i*18,40],[i*18,62]],1.6)}
 ctx.restore();
 if(o.window){ctx.strokeStyle='rgba(220,225,240,.32)';ctx.lineWidth=2;for(let i=0;i<300;i++){const x=rnd(i)*W,y=(rnd(i+300)*H+T*900)%H;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-6,y+30);ctx.stroke()}ctx.fillStyle='#1a1410';for(const x of [120,520,1340,1760])ctx.fillRect(x,-500,46,H+1000);ctx.fillRect(-500,-500,W+1000,540)}
 // light
 ctx.save();ctx.globalCompositeOperation='multiply';const lx=o.day?960:(kind==='ghost'?960:1500),ly=o.day?300:(kind==='ghost'?820:700);
 const r=ctx.createRadialGradient(lx,ly,80,lx,ly,1300);r.addColorStop(0,o.day?'#ffffff':(kind==='ghost'||kind==='corpse'?'#d0d4e4':'#ffe0c0'));r.addColorStop(1,o.dark?'#0a0810':(o.day?'#a8a4b4':'#2a2430'));ctx.fillStyle=r;ctx.fillRect(-500,-500,W+1000,H+1000);ctx.restore()}
for(const k of new Set(CUL.map(c=>c[0]))){const orig=SH[k];if(!orig)continue;
 SH[k]=(lt,D,T,ls)=>{for(const [sk,i,kind,o] of CUL){if(sk!==k)continue;if(o.n&&o.n!==ls.length)continue;const a=ls[i];if(a===undefined)continue;const b=ls[i+1]??D;
   if(lt>=a-0.15&&lt<b-0.1){ctx.save();cuDraw(kind,o,lt-a,b-a,T);ctx.restore();return}}
  orig(lt,D,T,ls)}}
