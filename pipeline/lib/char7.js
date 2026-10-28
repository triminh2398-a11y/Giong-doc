// char5 — Korean horror-animation style: thin ink lines, near-real proportions, muted flat colors
const INK5='#141014';
let LWK=1;
function q(fn,fill,lw=2.6,col=INK5){ctx.beginPath();fn();if(fill){ctx.fillStyle=fill;ctx.fill()}if(lw){ctx.lineWidth=lw*LWK;ctx.strokeStyle=col;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke()}}
function ln(pts,lw=2.4,col=INK5){ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++){const p=pts[i];if(p.length===4)ctx.quadraticCurveTo(p[0],p[1],p[2],p[3]);else ctx.lineTo(p[0],p[1])}ctx.lineWidth=lw*LWK;ctx.strokeStyle=col;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke()}
// face5: unit = head ~ 200 px tall (centered at 0,0). o: skin, hair, em('fear','calm','grin','dead'), look, sweat, mouth
function face5(o={}){const sk=o.skin||'#dcc6c0',sk2=o.skin2||'#c4aaa6',hc=o.hairCol||'#141118',em=o.em||'calm',lk=o.look||0;
 if(o.back){q(()=>{ctx.moveTo(-32,96);ctx.lineTo(-38,160);ctx.lineTo(38,160);ctx.lineTo(32,96)},sk2,2.4);for(const sd of [-1,1])q(()=>{ctx.moveTo(sd*82,-8);ctx.quadraticCurveTo(sd*106,-20,sd*104,10);ctx.quadraticCurveTo(sd*100,40,sd*80,40)},sk,2.4);
  q(()=>{ctx.moveTo(-84,-60);ctx.quadraticCurveTo(-92,30,-60,100);ctx.quadraticCurveTo(0,124,60,100);ctx.quadraticCurveTo(92,30,84,-60);ctx.quadraticCurveTo(0,-118,-84,-60)},o.hair==='bald'?sk:hc,2.6);
  if(o.hair==='short')q(()=>{ctx.moveTo(-90,-10);ctx.quadraticCurveTo(-104,-122,-10,-130);ctx.quadraticCurveTo(96,-130,94,-20);ctx.quadraticCurveTo(70,-70,20,-72);ctx.quadraticCurveTo(-30,-80,-66,-60);ctx.quadraticCurveTo(-84,-40,-90,-10)},hc,2.4);
 if(o.hair==='bun'){q(()=>{ctx.moveTo(-92,10);ctx.quadraticCurveTo(-108,-122,0,-128);ctx.quadraticCurveTo(108,-122,92,10);ctx.quadraticCurveTo(84,-50,40,-74);ctx.quadraticCurveTo(0,-84,-40,-74);ctx.quadraticCurveTo(-84,-50,-92,10)},hc,2.4);q(()=>ctx.arc(70,-104,28,0,7),hc,2.4)}
 if(o.hair==='bald'){ctx.fillStyle=hc;ctx.beginPath();ctx.ellipse(0,70,70,30,0,0,Math.PI);ctx.fill()}
  if(o.hair==='long')q(()=>ctx.rect(-80,40,160,220),hc,2.4);if(o.hair==='bun')q(()=>ctx.arc(0,-40,30,0,7),hc,2.4);
  if(o.khandong)q(()=>ctx.ellipse(0,-78,92,34,0,0,7),'#2a3048',2.4);if(o.khan)q(()=>ctx.rect(-90,-70,180,26),'#ece8e0',2.2);return}
 // back hair
 if(o.hair==='long'&&!o.skipBack){q(()=>{ctx.moveTo(-96,-40);ctx.quadraticCurveTo(-140,120,-120,330);ctx.lineTo(120,330);ctx.quadraticCurveTo(140,120,96,-40);ctx.closePath()},hc,2.4)}
 // neck
 q(()=>{ctx.moveTo(-32,96);ctx.quadraticCurveTo(-30,130,-38,160);ctx.lineTo(38,160);ctx.quadraticCurveTo(30,130,32,96)},sk2,2.4);
 // ears
 if(o.hair!=='long')for(const sd of [-1,1])q(()=>{ctx.moveTo(sd*82,-8);ctx.quadraticCurveTo(sd*106,-20,sd*104,10);ctx.quadraticCurveTo(sd*100,40,sd*80,40)},sk,2.4);
 // head (real-ish: wide cheekbones, longer jaw)
 const hp=()=>{ctx.moveTo(-84,-60);ctx.quadraticCurveTo(-92,10,-80,40);ctx.quadraticCurveTo(-62,96,-18,116);ctx.quadraticCurveTo(0,122,18,116);ctx.quadraticCurveTo(62,96,80,40);ctx.quadraticCurveTo(92,10,84,-60);ctx.quadraticCurveTo(0,-118,-84,-60);ctx.closePath()};
 q(hp,sk,2.8);
 if(o.cel){ctx.save();ctx.beginPath();hp();ctx.clip();ctx.fillStyle='rgba(90,50,60,.22)';ctx.beginPath();ctx.moveTo(30,-120);ctx.quadraticCurveTo(70,0,20,130);ctx.lineTo(140,130);ctx.lineTo(140,-120);ctx.fill();ctx.fillStyle='rgba(90,50,60,.18)';ctx.beginPath();ctx.ellipse(0,-40,80,18,0,0,7);ctx.fill();ctx.restore()}
 // soft side shade + cheek highlight
 ctx.save();ctx.beginPath();hp();ctx.clip();ctx.fillStyle=sk2;ctx.beginPath();ctx.ellipse(-96,30,40,120,0.1,0,7);ctx.fill();ctx.restore();
 if(o.ghostShade){ctx.save();ctx.beginPath();hp();ctx.clip();const g=ctx.createLinearGradient(0,-120,0,40);g.addColorStop(0,'rgba(40,40,70,.4)');g.addColorStop(1,'rgba(40,40,70,0)');ctx.fillStyle=g;ctx.fillRect(-100,-130,200,170);ctx.strokeStyle='rgba(50,50,100,.4)';ctx.lineWidth=1.4;for(const [x,y,d] of [[-70,-30,1],[66,-16,-1],[-64,60,1]]){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+9*d,y+11);ctx.lineTo(x+5*d,y+24);ctx.moveTo(x+9*d,y+11);ctx.lineTo(x+18*d,y+14);ctx.stroke()}ctx.restore()}
 if(o.sweat){ctx.fillStyle='rgba(255,255,255,.55)';for(const [x,y,h] of [[-56,40,22],[60,30,16],[40,-40,14]]){ctx.beginPath();ctx.ellipse(x,y,3.5,h,0.15,0,7);ctx.fill()}}
 if(o.dead){ctx.fillStyle='rgba(30,20,30,.5)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*36,0,30,26,0,0,7);ctx.fill()}}
 // eyes
 for(const sd of [-1,1]){const ex=sd*36,ey=0;
  if(em==='grin'||o.hollowRed){const sg=ctx.createRadialGradient(ex,ey,10,ex,ey,42);sg.addColorStop(0,'rgba(25,10,20,.85)');sg.addColorStop(1,'rgba(25,10,20,0)');ctx.fillStyle=sg;ctx.beginPath();ctx.ellipse(ex,ey+2,44,40,0,0,7);ctx.fill();
   q(()=>ctx.ellipse(ex,ey,22,20,0,0,7),'#0c0608',2);q(()=>ctx.ellipse(ex,ey,12,11,0,0,7),'#7a0e12',0);
   ctx.strokeStyle='rgba(220,40,40,.55)';ctx.lineWidth=1;for(let k=0;k<6;k++){const a=k*1.05;ctx.beginPath();ctx.moveTo(ex+Math.cos(a)*12,ey+Math.sin(a)*11);ctx.lineTo(ex+Math.cos(a+0.25)*6,ey+Math.sin(a+0.25)*5);ctx.stroke()}
   q(()=>ctx.ellipse(ex,ey,3,3,0,0,7),'#030202',0);ctx.fillStyle='rgba(255,255,255,.45)';ctx.beginPath();ctx.arc(ex+4,ey-4,1.8,0,7);ctx.fill();
   ctx.strokeStyle='rgba(20,6,10,.8)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(ex-2,ey+20);ctx.quadraticCurveTo(ex-4,ey+52,ex+1,ey+84+sd*8);ctx.stroke();continue}
  if(o.bug&&em!=='closed'&&em!=='white'&&em!=='grin'){const r=em==='fear'?27:23,pr=em==='fear'?5:7.5;
   q(()=>ctx.ellipse(ex,ey,r*0.9,r,0,0,7),'#f6f2ea',2.6);ctx.save();ctx.beginPath();ctx.ellipse(ex,ey,r*0.9,r,0,0,7);ctx.clip();ctx.fillStyle='rgba(120,100,110,.25)';ctx.fillRect(ex-r,ey-r,2*r,r*0.55);ctx.restore();
   q(()=>ctx.arc(ex+lk*7,ey+2,pr,0,7),'#120c0e',0);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ex+lk*7+2,ey-1,1.8,0,7);ctx.fill();
   ln([[ex-r*0.95,ey-r*0.2],[ex,ey-r*1.25,ex+r*0.95,ey-r*0.25]],em==='fear'?2.4:4.4);
   if(em==='fear'){ln([[ex-r*0.7,ey+r*1.1],[ex,ey+r*1.3,ex+r*0.7,ey+r*1.1]],1.4,'rgba(20,16,20,.5)')}
   const bi=em==='fear'?-14:em==='angry'?10:0;ln([[ex+sd*32,ey-r-14-(em==='fear'?8:0)],[ex+sd*6,ey-r-20,ex-sd*18,ey-r-12+bi]],6,hc);continue}
  if(em==='white'){q(()=>{ctx.moveTo(ex-24,ey+2);ctx.quadraticCurveTo(ex,ey-18,ex+24,ey);ctx.quadraticCurveTo(ex,ey+12,ex-24,ey+2)},'#eceae2',2);ln([[ex-26,ey+2],[ex,ey-20,ex+26,ey-1]],4);continue}
  if(em==='closed'){ln([[ex-22,ey+2],[ex,ey+8,ex+22,ey+1]],3);continue}
  const open=em==='fear'?16:em==='dead'?3:10;
  q(()=>{ctx.moveTo(ex-24,ey+2);ctx.quadraticCurveTo(ex,ey-open*1.5,ex+24,ey);ctx.quadraticCurveTo(ex,ey+open*0.9,ex-24,ey+2)},'#f2ece6',2);
  if(em!=='dead'){const ir=em==='fear'?6:9;q(()=>ctx.ellipse(ex+lk*8,ey+(em==='fear'?0:1),ir,ir,0,0,7),'#1a1214',0);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ex+lk*8+2,ey-2,1.8,0,7);ctx.fill()}
  // heavy upper lid
  ln([[ex-26,ey+2],[ex,ey-open*1.6,ex+26,ey-1]],4.2);
  ln([[ex-18,ey+open*0.9+4],[ex,ey+open*1.1+6,ex+18,ey+open*0.9+3]],1.4,'rgba(20,16,20,.6)');
  // brows
  const bi=em==='fear'?-12:em==='angry'?10:0;ln([[ex+sd*30,ey-34-(em==='fear'?6:0)],[ex+sd*6,ey-40,ex-sd*16,ey-34+bi]],5,hc);
  if(em==='fear'){ln([[sd*6,-56],[sd*10,-46,sd*4,-38]],1.6,'rgba(20,16,20,.55)')}}
 // nose
 ln([[4,-6],[10,30,2,40]],2.2);ln([[-12,42],[-4,48,4,44]],2.2);ln([[10,40],[16,44,14,48]],1.8);
 // mouth
if(em==='grin'){const mo=()=>{ctx.moveTo(-64,54);ctx.quadraticCurveTo(0,140,64,54);ctx.quadraticCurveTo(0,82,-64,54)};q(mo,'#0b0406',2.6);
  ctx.save();ctx.beginPath();mo();ctx.clip();ctx.fillStyle='#3a0a10';ctx.beginPath();ctx.ellipse(0,74,70,16,0,0,7);ctx.fill();
  for(let i=-54;i<=54;i+=9){const y0=62+Math.abs(i)*-0.18+(1-Math.abs(i)/64)*16,h=10+((i*37)%7+7)%7;q(()=>{ctx.moveTo(i-4,y0-4);ctx.lineTo(i-4,y0+h);ctx.quadraticCurveTo(i,y0+h+3,i+4,y0+h-1);ctx.lineTo(i+4,y0-4)},'#e6dcc6',1)}
  for(let i=-36;i<=36;i+=9){const y0=104-Math.abs(i)*0.35,h=8+((i*13)%5+5)%5;q(()=>{ctx.moveTo(i-4,y0+4);ctx.lineTo(i-4,y0-h);ctx.lineTo(i+4,y0-h+2);ctx.lineTo(i+4,y0+4)},'#d6ccb4',1)}
  ctx.restore();for(const sd of [-1,1])ln([[sd*64,54],[sd*74,44]],2);
  q(()=>{ctx.moveTo(56,66);ctx.quadraticCurveTo(60,96,54,122);ctx.lineTo(61,122);ctx.quadraticCurveTo(66,92,62,62)},'#5a0a10',0)}
 else if(o.mouth==='teeth'||em==='fear'){q(()=>{ctx.moveTo(-26,74);ctx.quadraticCurveTo(0,62,26,74);ctx.quadraticCurveTo(0,90,-26,74)},'#2a1212',2.4);q(()=>{ctx.moveTo(-22,73);ctx.quadraticCurveTo(0,66,22,73);ctx.lineTo(20,78);ctx.quadraticCurveTo(0,72,-20,78);ctx.closePath()},'#f2ece4',1.4)}
 else if(o.mouth==='o')q(()=>ctx.ellipse(0,76,12,17,0,0,7),'#1e0a0c',2.4);
 else ln([[-20,76],[0,72,20,77]],2.6);
 // hair front
 if(o.hair==='messy'){q(()=>{ctx.moveTo(-90,-20);ctx.quadraticCurveTo(-110,-120,-20,-132);ctx.quadraticCurveTo(80,-140,102,-50);ctx.quadraticCurveTo(100,-20,90,-6);ctx.lineTo(80,-44);ctx.lineTo(66,-24);ctx.lineTo(54,-62);ctx.lineTo(36,-40);ctx.lineTo(24,-74);ctx.lineTo(4,-44);ctx.lineTo(-10,-78);ctx.lineTo(-26,-46);ctx.lineTo(-46,-74);ctx.lineTo(-58,-40);ctx.lineTo(-74,-60);ctx.lineTo(-82,-16);ctx.closePath()},hc,2.4);
  ctx.strokeStyle='rgba(120,110,140,.5)';ctx.lineWidth=2;for(const [x,y] of [[-40,-110],[10,-118],[50,-100]]){ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+14,y+10,x+18,y+28);ctx.stroke()}}
 if(o.hair==='long'){q(()=>{ctx.moveTo(-100,40);ctx.quadraticCurveTo(-112,-120,0,-130);ctx.quadraticCurveTo(112,-120,100,40);ctx.quadraticCurveTo(86,-40,52,-70);ctx.quadraticCurveTo(0,-90,-52,-70);ctx.quadraticCurveTo(-86,-40,-100,40)},hc,2.4);
  ctx.fillStyle=hc;for(const [x,w,l,c] of [[-66,12,170,-14],[-46,7,130,8],[-8,4,90,4],[54,10,170,16],[72,13,200,-6]]){ctx.beginPath();ctx.moveTo(x-w/2,-62);ctx.quadraticCurveTo(x+c,40,x+c*0.6,l);ctx.quadraticCurveTo(x+c+w*0.6,40,x+w/2,-62);ctx.fill()}}
 if(o.hair==='short')q(()=>{ctx.moveTo(-90,-10);ctx.quadraticCurveTo(-104,-122,-10,-130);ctx.quadraticCurveTo(96,-130,94,-20);ctx.quadraticCurveTo(70,-70,20,-72);ctx.quadraticCurveTo(-30,-80,-66,-60);ctx.quadraticCurveTo(-84,-40,-90,-10)},hc,2.4);
 if(o.hair==='bun'){q(()=>{ctx.moveTo(-92,10);ctx.quadraticCurveTo(-108,-122,0,-128);ctx.quadraticCurveTo(108,-122,92,10);ctx.quadraticCurveTo(84,-50,40,-74);ctx.quadraticCurveTo(0,-84,-40,-74);ctx.quadraticCurveTo(-84,-50,-92,10)},hc,2.4);q(()=>ctx.arc(70,-104,28,0,7),hc,2.4)}
 if(o.hair==='bald'){ctx.fillStyle=hc;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*86,-30);ctx.quadraticCurveTo(sd*96,10,sd*82,30);ctx.lineTo(sd*76,-20);ctx.fill()}ln([[-30,-70],[0,-76,30,-70]],1.4,'rgba(60,40,40,.4)')}
 if(o.beard){q(()=>{ctx.moveTo(-20,96);ctx.quadraticCurveTo(-10,190,4,210);ctx.quadraticCurveTo(14,170,20,96);ctx.quadraticCurveTo(0,108,-20,96)},'#e8e4dc',2)}
 if(o.wrinkles){for(const sd of [-1,1]){ln([[sd*66,10],[sd*72,30,sd*64,50]],1.4,'rgba(60,40,40,.5)');ln([[sd*30,46],[sd*40,64,sd*34,86]],1.6,'rgba(60,40,40,.5)')}ln([[-30,-60],[0,-64,30,-60]],1.4,'rgba(60,40,40,.5)');ln([[-26,-50],[0,-54,26,-50]],1.4,'rgba(60,40,40,.5)')}
 if(o.khandong){q(()=>ctx.ellipse(0,-80,94,34,0,0,7),'#2a3048',2.4);ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=2*LWK;for(let i=-4;i<=4;i++){ctx.beginPath();ctx.moveTo(i*18,-108);ctx.lineTo(i*18+8,-52);ctx.stroke()}}
 if(o.khan)q(()=>ctx.rect(-92,-74,184,28),'#ece8e0',2.2);
}
// ---------- full body ----------
function limb5(x,y,a1,a2,l1,l2,w,col){const kx=x+Math.sin(a1)*l1,ky=y+Math.cos(a1)*l1,a=a1+a2,ex=kx+Math.sin(a)*l2,ey=ky+Math.cos(a)*l2;
 ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(kx,ky);ctx.lineTo(ex,ey);ctx.lineWidth=w+4;ctx.strokeStyle=INK5;ctx.stroke();ctx.lineWidth=w;ctx.strokeStyle=col;ctx.stroke();return [ex,ey,a]}
function fig5(x,fy,s,o={}){ctx.save();ctx.translate(x,fy);ctx.scale(s*(o.flip?-1:1),s);
 const sh=o.shirt||'#6e6266',pa=o.pants||'#2a2830',sk=o.skin||'#dcc6c0',sit=o.sit,tall=o.tall||1;
 const hipY=sit?-96:-168*tall,shY=hipY-118*tall,P=Object.assign({la:[0.12,-0.12],ra:[-0.12,0.12],ll:[0.05,0],rl:[-0.05,0]},o.pose||{});
 if(o.walk!==undefined){const p=o.walk;P.ll=[Math.sin(p)*0.4,Math.max(0,-Math.sin(p))*0.4];P.rl=[-Math.sin(p)*0.4,Math.max(0,Math.sin(p))*0.4];P.la=[-Math.sin(p)*0.35,-0.15];P.ra=[Math.sin(p)*0.35,0.15]}
 if(o.shadow!==false){ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,3,46,8,0,0,7);ctx.fill()}
 // legs
 for(const [sd,L] of [[1,P.rl],[-1,P.ll]]){let ex,ey;
  if(sit){ex=sd*20;ey=0;limb5(sd*13,hipY,0,0,20,76,19,pa);ctx.lineWidth=23;ctx.strokeStyle=INK5;ctx.beginPath();ctx.moveTo(sd*13,hipY);ctx.lineTo(sd*18,hipY+18);ctx.stroke();ctx.lineWidth=19;ctx.strokeStyle=pa;ctx.stroke()}
  else[ex,ey]=limb5(sd*13,hipY,L[0],L[1],84*tall,82*tall,19,pa);
  q(()=>ctx.ellipse(ex+sd*2+5,ey,14,7,0,0,7),o.feet||'#1a1418',2)}
 const robe=o.cloth==='aothe'||o.cloth==='aodai';
 if(robe){const len=o.cloth==='aodai'?120:150;q(()=>{ctx.moveTo(-30,hipY-6);ctx.lineTo(30,hipY-6);ctx.lineTo(38,hipY+(sit?40:len));ctx.lineTo(-38,hipY+(sit?40:len));ctx.closePath()},o.skirt||sh,2.2);ln([[0,hipY],[0,hipY+(sit?36:len-4)]],1.4,'rgba(20,16,20,.5)')}
 if(o.hair==='long'&&!o.back){ctx.save();ctx.translate(0,shY-34);ctx.rotate(o.tilt||0);ctx.scale(0.28,0.28);q(()=>{ctx.moveTo(-96,-40);ctx.quadraticCurveTo(-140,120,-120,330);ctx.lineTo(120,330);ctx.quadraticCurveTo(140,120,96,-40);ctx.closePath()},o.hairCol||'#141118',2.4*2.6);ctx.restore()}
 // torso
 const tp=()=>{ctx.moveTo(-36,shY+8);ctx.quadraticCurveTo(-40,shY+60,-30,hipY+4);ctx.lineTo(30,hipY+4);ctx.quadraticCurveTo(40,shY+60,36,shY+8);ctx.quadraticCurveTo(0,shY-4,-36,shY+8);ctx.closePath()};
 q(tp,sh,2.2);ctx.save();ctx.beginPath();tp();ctx.clip();ctx.fillStyle='rgba(0,0,0,.14)';ctx.fillRect(14,shY,30,hipY-shY+8);ctx.restore();
 if(!o.back){if(robe){ln([[-10,shY+2],[8,shY+30],[22,shY+70]],1.6)}else{ln([[-10,shY+2],[0,shY+18],[10,shY+2]],1.6);ln([[0,shY+18],[0,hipY]],1.4);ctx.fillStyle='#e6e0d6';for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,shY+34+i*24,1.8,0,7);ctx.fill()}}}
 // arms
 const arm=(sd,A)=>{const [hx,hy]=limb5(sd*32,shY+12,A[0],A[1],58*tall,54*tall,15,sh);q(()=>ctx.ellipse(hx,hy+4,7,10,0,0,7),sk,2);if(o.claws){ctx.strokeStyle=INK5;ctx.lineWidth=1.6;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(hx+i*3,hy+10);ctx.lineTo(hx+i*4,hy+24);ctx.stroke()}}};
 if(o.back){arm(-1,P.la);arm(1,P.ra)}
 // head
 if(!o.headless){ctx.save();ctx.translate(0,shY-36);ctx.rotate(o.tilt||0);ctx.scale(0.28,0.28);const k=LWK;LWK=2.5;face5(Object.assign({},o,{skin:sk,skipBack:true}));LWK=k;ctx.restore()}
 if(!o.back){arm(-1,P.la);arm(1,P.ra)}
 ctx.restore()}
const CAST5={
 lam:{hair:'messy',shirt:'#6a6070',pants:'#2a2830'},
 khoa:{hair:'short',shirt:'#4a5a72',pants:'#262a34'},
 thay:{hair:'bald',hairCol:'#d6d2ca',beard:true,wrinkles:true,khandong:true,cloth:'aothe',shirt:'#2c3048',skin:'#d8c4b4'},
 batu:{hair:'bun',hairCol:'#b8b2ae',wrinkles:true,shirt:'#5e5456',pants:'#2a2628',skin:'#d8c2b4'},
 me:{hair:'bun',hairCol:'#1a1418',shirt:'#56606e',pants:'#2a2628'},
 quan:{hair:'short',khandong:true,cloth:'aothe',shirt:'#4a3a48'},
 cuthach:{hair:'bald',hairCol:'#d8d4cc',beard:true,wrinkles:true,khandong:true,cloth:'aothe',shirt:'#5a2a30',skin:'#d8c4b4'},
 dan:{hair:'short',shirt:'#3e3c46',pants:'#222028'},
 codau:{hair:'long',shirt:'#e8e4ea',pants:'#e8e4ea',cloth:'aodai'},
 ghost:{hair:'long',em:'grin',ghostShade:true,skin:'#eceef2',skin2:'#c2c4d2',hairCol:'#0b0a0e',cloth:'aodai',shirt:'#e2e2e8',pants:'#e2e2e8',skirt:'#e2e2e8',claws:true,tall:1.08},
 corpse:{hair:'bald',hairCol:'#c4c0c8',wrinkles:true,em:'closed',dead:true,cloth:'aothe',shirt:'#2c2834',skin:'#b9bdb4',skin2:'#9a9e98'}};
function c5(n,x,fy,s,o={}){fig5(x,fy,s,Object.assign({},CAST5[n],o))}
