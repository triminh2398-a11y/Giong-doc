// ===== char2: nhân vật 2D tỉ lệ thật, cel-shading, khung xương có khớp =====
const OUT2='#2a1d1a';let STY={head:1.15,eye:1.3,leg:1.06,torso:0.97,jaw:1.12,lw:1,soft:false,anime:true};
const PAL={skin:['#f2d3b6','#d8a988'],dead:['#b8b2c4','#8f86a2'],old:['#e9c9aa','#c99b7c']};
function cap(x1,y1,x2,y2,w1,w2){const a=Math.atan2(y2-y1,x2-x1),n=a+Math.PI/2;ctx.beginPath();ctx.moveTo(x1+Math.cos(n)*w1,y1+Math.sin(n)*w1);ctx.lineTo(x2+Math.cos(n)*w2,y2+Math.sin(n)*w2);ctx.arc(x2,y2,w2,n,n+Math.PI);ctx.lineTo(x1-Math.cos(n)*w1,y1-Math.sin(n)*w1);ctx.arc(x1,y1,w1,n+Math.PI,n+2*Math.PI);ctx.closePath()}
function shaded(path,base,dark,dx=8,dy=0,lw=3.5){lw*=STY.lw;if(STY.soft){ctx.save();path();ctx.fillStyle=base;ctx.fill();ctx.clip();ctx.globalAlpha=0.55;ctx.filter='blur(6px)';ctx.translate(-dx*1.5,-dy);ctx.beginPath();ctx.rect(-9999,-9999,19998,19998);path();ctx.fillStyle=dark;ctx.fill('evenodd');ctx.restore();return}ctx.save();path();ctx.fillStyle=dark;ctx.fill();ctx.clip();ctx.translate(-Math.abs(dx)*Math.sign(dx||1),-dy);path();ctx.fillStyle=base;ctx.fill();ctx.restore();if(lw){path();ctx.lineWidth=lw;ctx.strokeStyle=OUT2;ctx.lineJoin='round';ctx.stroke()}}
function limb(px,py,a1,a2,l1,l2,w,col,dark,o={}){
 const ex=px+Math.sin(a1)*l1,ey=py+Math.cos(a1)*l1,hx=ex+Math.sin(a1+a2)*l2,hy=ey+Math.cos(a1+a2)*l2;
 const path=()=>{ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(ex,ey);ctx.lineTo(hx,hy)};
 ctx.save();ctx.lineCap='round';ctx.lineJoin='round';if(!STY.soft){path();ctx.lineWidth=w*2+7*STY.lw;ctx.strokeStyle=OUT2;ctx.stroke()}path();ctx.lineWidth=w*2;ctx.strokeStyle=dark;ctx.stroke();
 ctx.translate(-w*0.35,0);path();ctx.lineWidth=w*1.3;ctx.strokeStyle=col;ctx.stroke();ctx.restore();
 return [hx,hy,a1+a2]}
function hand(x,y,a,skin,s=1,fist=0){ctx.save();ctx.translate(x,y);ctx.rotate(-a);ctx.scale(s,s);shaded(()=>{ctx.beginPath();ctx.ellipse(0,8,9,12,0,0,7)},skin[0],skin[1],3,0,3);
 if(fist<0.5){ctx.strokeStyle=OUT2;ctx.lineWidth=2;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(i*4,12);ctx.lineTo(i*4.5,20);ctx.stroke()}}ctx.restore()}
function face(o){const sk=o.skinP||PAL.skin,t=o.turn||0,em=o.em||'calm',fx=t*12;
 // head shape (oval with jaw)
 const hp=()=>{ctx.beginPath();ctx.moveTo(-30,-18);ctx.bezierCurveTo(-34,-60,34,-60,30,-18);ctx.bezierCurveTo(32,8,22*STY.jaw,34*STY.jaw,0+fx*0.3,42*STY.jaw);ctx.bezierCurveTo(-22*STY.jaw,34*STY.jaw,-32,8,-30,-18);ctx.closePath()};
 // ears
 for(const sd of [-1,1]){if(sd*t>0.6)continue;ctx.beginPath();ctx.ellipse(sd*31,-4,6,10,0,0,7);ctx.fillStyle=sk[1];ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=OUT2;ctx.stroke()}
 shaded(hp,sk[0],sk[1],-7+t*-4,2,3.5);
 if(o.blush!==false&&!o.dead){ctx.fillStyle='rgba(230,120,110,.18)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*17+fx,12,8,4,0,0,7);ctx.fill()}}
 if(o.wrinkles){ctx.strokeStyle='rgba(90,50,40,.45)';ctx.lineWidth=1.6;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*24+fx,0);ctx.quadraticCurveTo(sd*20+fx,8,sd*22+fx,14);ctx.stroke()}ctx.beginPath();ctx.moveTo(-10+fx,-30);ctx.lineTo(10+fx,-30);ctx.stroke()}
 // eyes
 const eo=o.eyes??1;for(const sd of [-1,1]){const ex=sd*13*(STY.eye>1.2?1.22:1)+fx-(sd*t>0?sd*t*3:0),ey=-6+(STY.eye>1.2?3:0),sc=(sd*t>0?1-t*0.25*sd:1);
  ctx.save();ctx.translate(ex,ey);ctx.scale(sc*(STY.eye>1.2?STY.eye*0.78:STY.eye),STY.eye*(STY.anime?1.2:1));
  if(o.hollow){ctx.beginPath();ctx.ellipse(0,0,8,6.5*eo,0,0,7);ctx.fillStyle='#050304';ctx.fill();ctx.beginPath();ctx.arc(0,0.5,1.6,0,7);ctx.fillStyle='#f4f0ff';ctx.fill()}
  else if(o.dead&&o.eyesWhite){ctx.beginPath();ctx.ellipse(0,0,8,5.5*eo,0,0,7);ctx.fillStyle='#e8e6ee';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=OUT2;ctx.stroke()}
  else if(eo<0.15){ctx.strokeStyle=OUT2;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-8,1);ctx.quadraticCurveTo(0,4,8,1);ctx.stroke()}
  else{const h=5.8*eo*(em==='fear'?1.25:1);ctx.beginPath();ctx.moveTo(-9,0);ctx.quadraticCurveTo(0,-h*1.35,9,0);ctx.quadraticCurveTo(0,h*1.1,-9,0);ctx.fillStyle='#fbf8f2';ctx.fill();ctx.save();ctx.clip();const big=STY.anime||STY.eye>1.3;const ir=(em==='fear'?3.2:4.6)*(big?1.45:1);ctx.beginPath();ctx.arc((o.look||0)*3,0.5,ir,0,7);ctx.fillStyle=o.iris||'#3b2418';ctx.fill();ctx.beginPath();ctx.arc((o.look||0)*3,0.5,ir*0.5,0,7);ctx.fillStyle='#120a08';ctx.fill();ctx.beginPath();ctx.arc((o.look||0)*3-1.5,-1.5,STY.anime?2:1.4,0,7);ctx.fillStyle='#fff';ctx.fill();if(STY.anime){ctx.beginPath();ctx.arc((o.look||0)*3+1.8,2.2,0.9,0,7);ctx.fill()}ctx.restore();
   ctx.lineWidth=big?3.2:2.6;ctx.strokeStyle=OUT2;ctx.beginPath();ctx.moveTo(-9.5,0.5);ctx.quadraticCurveTo(0,-h*1.4,9.5,0);ctx.stroke();if(!big){ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-8,1);ctx.quadraticCurveTo(0,h*1.15,8,0.5);ctx.stroke()}}
  ctx.restore();
  // brows
  const bi=em==='fear'?-6:em==='angry'?4:em==='sad'?-4:0;ctx.strokeStyle=o.browCol||'#2a1a14';ctx.lineWidth=3;ctx.lineCap='round';
  ctx.beginPath();const bx1=ex-9,bx2=ex+9,inner=sd<0?bx2:bx1,outer=sd<0?bx1:bx2;ctx.moveTo(outer,ey-12);ctx.quadraticCurveTo(ex,ey-16-(em==='fear'?3:0),inner,ey-13+bi*0.5-(em==='fear'?4:0)+(em==='angry'?3:0));ctx.stroke()}
 // nose
 ctx.strokeStyle='rgba(60,35,28,.75)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(2+fx*1.2,4);ctx.quadraticCurveTo(5+fx*1.2,13,0+fx*1.2,15);ctx.stroke();
 // mouth
 const m=o.mouth||'calm';ctx.lineWidth=2.4;ctx.strokeStyle=OUT2;ctx.beginPath();const my=26;
 if(m==='o'||m==='scream'){const r=m==='scream'?7:4.5;ctx.ellipse(fx,my+2,r*0.9,r*(m==='scream'?1.6:1.2),0,0,7);ctx.fillStyle='#5a2224';ctx.fill();ctx.stroke()}
 else if(m==='smile'){ctx.moveTo(-8+fx,my-1);ctx.quadraticCurveTo(fx,my+5,8+fx,my-1);ctx.stroke()}
 else if(m==='grin'){ctx.moveTo(-14+fx,my-2);ctx.quadraticCurveTo(fx,my+12,14+fx,my-2);ctx.quadraticCurveTo(fx,my+2,-14+fx,my-2);ctx.fillStyle='#f4efe6';ctx.fill();ctx.stroke()}
 else if(m==='frown'){ctx.moveTo(-7+fx,my+2);ctx.quadraticCurveTo(fx,my-3,7+fx,my+2);ctx.stroke()}
 else{ctx.moveTo(-6+fx,my);ctx.lineTo(6+fx,my);ctx.stroke()}
 if(o.beard){shaded(()=>{ctx.beginPath();ctx.moveTo(-12+fx,32);ctx.quadraticCurveTo(fx,90,6+fx,92);ctx.quadraticCurveTo(14+fx,60,12+fx,32);ctx.closePath()},'#ebe8e0','#c9c4b8',-3,0,2.5);ctx.strokeStyle='#d6d2c8';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-14+fx,22);ctx.quadraticCurveTo(-24+fx,30,-26+fx,40);ctx.moveTo(14+fx,22);ctx.quadraticCurveTo(24+fx,30,26+fx,40);ctx.stroke()}
 if(o.sweat){ctx.fillStyle='rgba(200,230,255,.9)';ctx.beginPath();ctx.ellipse(28,-20+o.sweat*26,3.5,6,0,0,7);ctx.fill()}
 if(o.tears){ctx.fillStyle='rgba(170,215,255,.85)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*13+fx,4+((o.tears*30+(sd>0?12:0))%26),2.5,4,0,0,7);ctx.fill()}}}
function hairBack(o){const st=o.hair||'short',c=o.hairCol||'#1c1412';if(st==='long'){shaded(()=>{ctx.beginPath();ctx.moveTo(-36,-30);ctx.quadraticCurveTo(-46,60,-40,190);ctx.quadraticCurveTo(0,210,40,190);ctx.quadraticCurveTo(46,60,36,-30);ctx.closePath()},c,'#0c0807',-6,0,3)}}
function hairFront(o){const st=o.hair||'short',c=o.hairCol||'#1c1412',dk='#0c0807';
 if(st==='short'){shaded(()=>{ctx.beginPath();ctx.moveTo(-33,-12);ctx.bezierCurveTo(-40,-66,34,-74,34,-14);ctx.lineTo(27,-26);ctx.lineTo(20,-16);ctx.lineTo(12,-30);ctx.lineTo(2,-20);ctx.lineTo(-8,-32);ctx.lineTo(-18,-20);ctx.lineTo(-26,-30);ctx.closePath()},c,dk,-6,2,3)}
 else if(st==='long'){shaded(()=>{ctx.beginPath();ctx.moveTo(-36,-6);ctx.bezierCurveTo(-42,-70,42,-70,36,-6);ctx.quadraticCurveTo(20,-36,2,-34);ctx.quadraticCurveTo(-18,-34,-36,-6);ctx.closePath()},c,dk,-5,2,3);ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-28,26,Math.PI*1.15,Math.PI*1.5);ctx.stroke()}
 else if(st==='bun'){shaded(()=>{ctx.beginPath();ctx.moveTo(-32,-10);ctx.bezierCurveTo(-38,-64,38,-64,32,-10);ctx.quadraticCurveTo(0,-40,-32,-10);ctx.closePath()},c,'#8a8680',-5,2,3);shaded(()=>{ctx.beginPath();ctx.arc(0,-58,16,0,7)},c,'#8a8680',-4,0,3)}
 else if(st==='bald'){ctx.fillStyle=c;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*30,-14);ctx.quadraticCurveTo(sd*36,-30,sd*28,-38);ctx.lineTo(sd*26,-12);ctx.fill()}}
 if(o.hairFace){ctx.fillStyle='rgba(12,8,8,.93)';for(let k=0;k<9;k++){const x=-34+k*8.5,len=70+((k*37)%30);if(k===3||k===4)continue;ctx.beginPath();ctx.moveTo(x-5,-30);ctx.quadraticCurveTo(x+Math.sin(k+(o.t||0))*4,10,x+(k-4)*2,len);ctx.lineTo(x+(k-4)*2+5,len);ctx.quadraticCurveTo(x+5,10,x+5,-30);ctx.fill()}}
 if(o.khandong){shaded(()=>{ctx.beginPath();ctx.ellipse(0,-40,38,18,0,0,7)},'#2c3550','#1b2238',-5,2,3);ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=2;for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(i*9,-55);ctx.lineTo(i*9+5,-26);ctx.stroke()}}
 if(o.khan){shaded(()=>{ctx.beginPath();ctx.rect(-36,-36,72,13)},'#f3efe6','#d6d0c2',-4,0,2.5)}}
// clothes: 'baba' shirt, 'aodai' long tunic, 'aothe' robe; pose angles
function figure(cx,fy,s,o={}){ctx.save();ctx.translate(cx,fy);ctx.scale(s*(o.flip?-1:1),s);ctx.lineJoin='round';ctx.lineCap='round';
 const sk=o.skinP||(o.dead?PAL.dead:PAL.skin),shirt=o.shirt||['#7a5a3a','#5b4128'],pants=o.pants||['#2e2b2a','#1d1b1a'],P=Object.assign({la:[0.12,-0.15],ra:[-0.12,0.15],ll:[0.04,0],rl:[-0.04,0]},o.pose||{});
 const sit=o.sit,hipY=(sit?-112:-176)*STY.leg,shY=hipY-120*STY.torso,ph=o.walk||0;
 if(o.walk!==undefined){P.ll=[Math.sin(ph)*0.45,Math.max(0,-Math.sin(ph))*0.6];P.rl=[-Math.sin(ph)*0.45,Math.max(0,Math.sin(ph))*0.6];P.la=[-Math.sin(ph)*0.35,-0.25];P.ra=[Math.sin(ph)*0.35,0.25]}
 if(sit){P.ll=[-1.45,1.45];P.rl=[-1.45,1.45]}
 ctx.save();ctx.translate(0,-(o.headY||0));ctx.translate(0,shY-(24*STY.torso+40*STY.head));ctx.rotate(o.tilt||0);ctx.scale(1.22*STY.head,1.22*STY.head);hairBack(o);ctx.restore();ctx.save();ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,4,62,12,0,0,7);ctx.fill();ctx.restore();
 // legs
 for(const [sd,L] of [[1,P.rl],[-1,P.ll]]){const [hx,hy]=limb(sd*16,hipY-8,L[0]*(sit?sd*0+1:1)*(sit?-1:1)*(sit?-1:1),L[1]*(sit?-1:1)*(sit?-1:1),88*STY.leg,84*STY.leg,14,pants[0],pants[1]);
  ctx.save();ctx.translate(hx,hy);shaded(()=>{ctx.beginPath();ctx.ellipse(sd*4+6,4,17,7,0,0,7)},o.feet||'#3a2e26','#241c17',3,0,3);ctx.restore()}
 // torso
 const robe=o.cloth==='aodai'||o.cloth==='aothe';
 if(robe){const len=o.cloth==='aodai'?150:190;for(const sd of [-1,1])shaded(()=>{ctx.beginPath();ctx.moveTo(sd*6,hipY-8);ctx.lineTo(sd*38,hipY-10);ctx.quadraticCurveTo(sd*(46+(o.flap||0)*sd*8),hipY+len*0.6,sd*42,hipY+(sit?40:len));ctx.lineTo(sd*4,hipY+(sit?40:len));ctx.closePath()},shirt[0],shirt[1],sd*5,0,3)}
 shaded(()=>{ctx.beginPath();ctx.moveTo(-46,shY+6);ctx.quadraticCurveTo(-48,shY+40,-36,hipY-50);ctx.quadraticCurveTo(-32,hipY-14,-38,hipY+(robe?2:6));ctx.lineTo(38,hipY+(robe?2:6));ctx.quadraticCurveTo(32,hipY-14,36,hipY-50);ctx.quadraticCurveTo(48,shY+40,46,shY+6);ctx.quadraticCurveTo(0,shY-6,-46,shY+6);ctx.closePath()},shirt[0],shirt[1],-10,0,3.5);
 // collar & buttons
 ctx.strokeStyle=OUT2;ctx.lineWidth=2.5;if(o.cloth==='aodai'||o.cloth==='aothe'){ctx.beginPath();ctx.moveTo(-12,shY+2);ctx.quadraticCurveTo(8,shY+24,22,shY+52);ctx.stroke();ctx.fillStyle=shirt[1];ctx.fillRect(-12,shY-10,24,12)}
 else{ctx.beginPath();ctx.moveTo(-14,shY);ctx.lineTo(0,shY+30);ctx.lineTo(14,shY);ctx.stroke();ctx.fillStyle='rgba(255,255,255,.5)';for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(0,shY+44+i*24,2.6,0,7);ctx.fill()}ctx.beginPath();ctx.moveTo(0,shY+30);ctx.lineTo(0,hipY);ctx.strokeStyle='rgba(42,29,26,.5)';ctx.stroke()}
 // neck + head
 shaded(()=>{ctx.beginPath();ctx.rect(-11,shY-24*STY.torso,22,28*STY.torso)},sk[0],sk[1],-5,0,3);
 if(o.scarf){shaded(()=>{ctx.beginPath();ctx.ellipse(0,shY-6,26,12,0,0,7)},'#f6f3ec','#d8d2c6',-4,0,3);shaded(()=>{ctx.beginPath();ctx.moveTo(10,shY);ctx.quadraticCurveTo(26+(o.wind||0)*30,shY+40,18+(o.wind||0)*60,shY+90);ctx.lineTo(6+(o.wind||0)*50,shY+88);ctx.quadraticCurveTo(14,shY+40,0,shY+4);ctx.closePath()},'#f6f3ec','#d8d2c6',-3,0,2.5)}
 if(o.headless){ctx.save();ctx.translate(0,shY-20);ctx.scale(1,0.4);ctx.beginPath();ctx.arc(0,0,11,0,7);ctx.fillStyle='#4a0f14';ctx.fill();ctx.lineWidth=5;ctx.strokeStyle='#7a1a20';ctx.stroke();ctx.restore()}
 else{ctx.save();ctx.translate(0,shY-(24*STY.torso+40*STY.head)-(o.headY||0));ctx.rotate(o.tilt||0);ctx.scale(1.22*STY.head,1.22*STY.head);face(Object.assign({skinP:sk},o));hairFront(o);ctx.restore()}
 // arms (front)
 for(const [sd,A] of [[-1,P.la],[1,P.ra]]){const [hx,hy,a]=limb(sd*38,shY+16,A[0]*1+sd*0.08,A[1],72*STY.torso,66*STY.torso,11,shirt[0],shirt[1]);hand(hx,hy,a,sk,1.1,o.fist||0)}
 ctx.restore()}
// presets
const CAST={
 lam:{hair:'short',shirt:['#8a6a46','#664c30'],pants:['#2f2c2a','#1e1c1a']},
 khoa:{hair:'short',hairCol:'#231a16',shirt:['#3f5268','#2b3a4c'],pants:['#262a30','#181b20']},
 thay:{hair:'bald',hairCol:'#cfcac0',beard:true,wrinkles:true,khandong:true,cloth:'aothe',shirt:['#2c3550','#1d243a'],skinP:PAL.old},
 batu:{hair:'bun',hairCol:'#b9b5ae',wrinkles:true,shirt:['#6e5a48','#544434'],pants:['#2a2624','#1a1716'],skinP:PAL.old,blush:false},
 tham:{hair:'long',cloth:'aodai',scarf:true,shirt:['#efe9dc','#d3cab8'],pants:['#efe9dc','#d3cab8']},
 ghost:{hair:'long',hairFace:true,dead:true,hollow:true,cloth:'aodai',shirt:['#e9e6ee','#c4bfcf'],pants:['#e9e6ee','#c4bfcf'],blush:false,skinP:['#d9d6e0','#aaa3bb']},
 corpse:{hair:'bald',hairCol:'#c9c4cc',wrinkles:true,beard:true,dead:true,eyesWhite:true,cloth:'aothe',shirt:['#2e2836','#1d1824'],blush:false}};
function ch(name,cx,fy,s,o={}){figure(cx,fy,s,Object.assign({},CAST[name],o))}
