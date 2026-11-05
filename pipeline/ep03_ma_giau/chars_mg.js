// ===== EP3 MA GIẤU RỪNG U MINH — nhân vật nét Ma Lai =====
// tay person: vai (sd*40,-210), dài 96 ; woman: vai (sd*38,-210), dài 92
const handP=(sd,a,L=96,sx=40)=>[sd*sx-L*Math.sin(a),-210+L*Math.cos(a)];
function inS(x,fy,s,fn){ctx.save();ctx.translate(x,fy);ctx.scale(s,s);ctx.lineJoin='round';ctx.lineCap='round';fn();ctx.restore()}
function torchAt(hx,hy,T,k=1){// đuốc: cán từ tay chéo lên, ngọn lửa trên
 ctx.save();ctx.translate(hx,hy);ctx.rotate(0.25);ctx.strokeStyle=INK;ctx.lineWidth=13;ctx.beginPath();ctx.moveTo(0,40);ctx.lineTo(0,-120);ctx.stroke();ctx.strokeStyle='#6a4a26';ctx.lineWidth=8;ctx.stroke();
 ctx.fillStyle='#3a2a16';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-128,14,22,0,0,7);ctx.fill();ctx.stroke();
 const f=1+Math.sin(T*15)*0.12+Math.sin(T*9.3)*0.1;halo(0,-170,170,'255,170,80',0.45*k);
 ctx.fillStyle='#ff7a20';ctx.beginPath();ctx.moveTo(-20,-140);ctx.quadraticCurveTo(-26,-190*f,Math.sin(T*7)*8,-230*f);ctx.quadraticCurveTo(26,-190*f,20,-140);ctx.fill();
 ctx.fillStyle='#ffd060';ctx.beginPath();ctx.moveTo(-10,-142);ctx.quadraticCurveTo(-12,-175*f,Math.sin(T*9)*5,-196*f);ctx.quadraticCurveTo(12,-175*f,10,-142);ctx.fill();ctx.restore();ctx.lineWidth=4}
function bucketAt(hx,hy,o={}){// thùng thiếc xách
 ctx.save();ctx.translate(hx,hy);ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,26,34,Math.PI*1.05,Math.PI*1.95);ctx.stroke();
 poly([[-38,24],[38,24],[32,112],[-32,112]],o.col||'#8a8e90',INK,4);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(-28,34,10,70);
 ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=3;for(const y of [50,86]){ctx.beginPath();ctx.moveTo(-35,y);ctx.lineTo(35,y);ctx.stroke()}
 if(o.honey){ctx.fillStyle='#e0a020';ctx.beginPath();ctx.ellipse(0,26,36,8,0,0,7);ctx.fill();ctx.fillStyle='rgba(224,160,32,.9)';ctx.fillRect(20,26,6,30)}ctx.restore()}
function thauAt(cx,cy,r=58){// cái thau đồng nhìn chính diện
 const g=ctx.createRadialGradient(cx-r*0.3,cy-r*0.3,4,cx,cy,r);g.addColorStop(0,'#f6d77a');g.addColorStop(0.6,'#c99a3a');g.addColorStop(1,'#7a5418');
 ctx.fillStyle=g;ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(90,60,10,.7)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,r*0.72,0,7);ctx.stroke();
 ctx.fillStyle='rgba(255,250,220,.5)';ctx.beginPath();ctx.ellipse(cx-r*0.35,cy-r*0.35,r*0.18,r*0.08,-0.7,0,7);ctx.fill()}
function stickAt(hx,hy,a,len=110){ctx.save();ctx.translate(hx,hy);ctx.rotate(a);ctx.strokeStyle=INK;ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,len);ctx.stroke();ctx.strokeStyle='#7a5a32';ctx.lineWidth=7;ctx.stroke();circ(0,len,9,'#5a3a1a',INK,3);ctx.restore()}
function mudMouth(dy=-244,w=1){ctx.fillStyle='#1c140c';ctx.beginPath();ctx.ellipse(0,dy+2,22*w,14,0,0,7);ctx.fill();
 ctx.fillStyle='rgba(28,20,12,.9)';for(const [x,l] of [[-12,40],[2,62],[14,34]]){ctx.fillRect(x-3,dy+8,7,l);circ(x,dy+8+l,5,'rgba(28,20,12,.9)')}
 ctx.fillStyle='#3a5a24';ctx.beginPath();ctx.ellipse(16,dy-2,10,4,0.5,0,7);ctx.fill();ctx.fillStyle='#c89a30';ctx.fillRect(-20,dy-4,8,6)}
function mustache(){ctx.strokeStyle=INK;ctx.lineWidth=6;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*3,-252);ctx.quadraticCurveTo(sd*18,-254,sd*24,-236);ctx.stroke()}}
function khanCo(){ctx.fillStyle=krFill();ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-34,-222);ctx.quadraticCurveTo(0,-200,34,-222);ctx.lineTo(30,-206);ctx.quadraticCurveTo(0,-186,-30,-206);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.moveTo(14,-206);ctx.lineTo(28,-150);ctx.lineTo(12,-152);ctx.lineTo(4,-200);ctx.closePath();ctx.fill();ctx.stroke()}
function paleEyes(dy=-272,col='255,70,50'){for(const sd of [-1,1]){ctx.fillStyle='#030303';ctx.beginPath();ctx.ellipse(sd*21,dy,15,17,0,0,7);ctx.fill();halo(sd*21,dy+2,16,col,0.6);circ(sd*21,dy+2,3,'#ff3020')}}
// ---- Ba Tâm ----
function tam(x,fy,s,o={}){const T=o.t||0;const arm=[o.armL??(o.thau?-0.5:0.1),o.armR??(o.torch?-2.3:o.bucket?-0.22:-0.1)];
 if(o.gonk){arm[1]=-1.2-0.9*Math.max(0,Math.sin(T*9))}
 person(x,fy,s,{shirt:'#5c4630',pants:'#24211c',skin:o.fake?'#b9b8a8':'#b8a088',eyes:o.eyes,look:o.look,mouth:o.mouth,back:o.back,sit:o.sit,armA:arm,tilt:o.tilt,phase:o.phase});
 inS(x,fy,s,()=>{if(!o.back){mustache();if(o.mud)mudMouth(-244,1);if(o.fake&&o.smile){ctx.strokeStyle='#3a1a10';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,-252,18,0.4,Math.PI-0.4);ctx.stroke()}}khanCo();
  if(o.torch){const [hx,hy]=handP(1,arm[1]);torchAt(hx,hy,T)}
  if(o.bucket){const [hx,hy]=handP(1,arm[1]);bucketAt(hx,hy-20,{honey:o.honey})}
  if(o.thau){thauAt(0,-150,60);circ(-6,-140,9,SKIN,INK,3)}
  if(o.gonk){const [hx,hy]=handP(1,arm[1]);stickAt(hx,hy,-2.2+arm[1]*0.4)}
  if(o.cui){const [hx,hy]=handP(-1,arm[0]);ctx.fillStyle='#b8a060';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(hx,hy+10,16,46,0.2,0,7);ctx.fill();ctx.stroke();
   for(let k=0;k<5;k++){const p=(T*0.5+k*0.2)%1;ctx.fillStyle=`rgba(230,230,225,${0.45*(1-p)})`;ctx.beginPath();ctx.arc(hx-10+Math.sin(T+k)*14,hy-40-p*240,16+p*40,0,7);ctx.fill()}}
  if(o.mark){ctx.fillStyle='rgba(20,14,10,.85)';for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(-64+k*8,-150+k*3,4,16,0.3,0,7);ctx.fill()}}})}
// ---- Sáu Lộc ----
function loc(x,fy,s,o={}){const T=o.t||0;const arm=[o.armL??(o.cui?0.25:0.1),o.armR??(o.bucket?-0.22:-0.1)];
 const fake=o.fake;person(x,fy,s,{shirt:o.wet?'#4a4e50':'#6b7072',pants:'#2c2c2c',skin:fake?'#a9b2a4':o.pale?'#b2b6ac':'#bcae96',eyes:fake?0.01:o.eyes,look:o.look,mouth:o.mouth,back:o.back,sit:o.sit,armA:arm,tilt:o.tilt,hair:'#1a1a1a',phase:o.phase});
 inS(x,fy,s,()=>{if(!o.back){if(fake){paleEyes(-272,'255,60,40')}if(o.mud)mudMouth(-244,1.1);if(o.grin){ctx.fillStyle='#120606';ctx.beginPath();ctx.moveTo(-30,-250);ctx.quadraticCurveTo(0,-240,30,-250);ctx.quadraticCurveTo(0,-214,-30,-250);ctx.fill();ctx.fillStyle='#d8d0b8';for(let k=-3;k<=3;k++)ctx.fillRect(k*7-2,-248,4,7)}}
  if(o.bucket){const [hx,hy]=handP(1,arm[1]);bucketAt(hx,hy-20,{honey:o.honey})}
  if(o.cui){const [hx,hy]=handP(-1,arm[0]);ctx.fillStyle='#b8a060';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(hx,hy+10,16,46,0.2,0,7);ctx.fill();ctx.stroke()}
  if(fake||o.muddy){ctx.fillStyle='rgba(30,22,14,.55)';for(let k=0;k<7;k++){ctx.beginPath();ctx.ellipse(-30+rnd(k)*60,-200+rnd(k+3)*180,6+rnd(k+1)*10,10+rnd(k+2)*14,0,0,7);ctx.fill()}}})}
// ---- thím Ba Nhàn ----
function nhan(x,fy,s,o={}){const T=o.t||0;let arm=o.arm||[0.12,-0.12];if(o.thau)arm=[-0.55,o.gonk?(-2.5+1.4*Math.max(0,Math.sin(T*9))):-0.3];
 woman(x,fy,s,{shirt:'#7a3434',pants:'#1a1a1c',skin:'#d0c4b0',eyes:o.eyes,look:o.look,mouth:o.mouth,smile:o.smile??false,back:o.back,sit:o.sit,arm,t:T,tilt:o.tilt,old:o.old});
 inS(x,fy,s,()=>{if(!o.back&&!o.old){ctx.fillStyle=HAIR;circ(0,-338,22,HAIR,INK,3);if(o.ear!==false){circ(-56,-262,5,'#f0c040',INK,1.5);circ(56,-262,5,'#f0c040',INK,1.5)}}
  if(o.old&&!o.back){/* tóc bạc */}
  if(o.thau){thauAt(0,-150,60);circ(-4,-138,8,SKIN,INK,3);if(o.gonk!==undefined){const [hx,hy]=handP(1,arm[1],92,38);stickAt(hx,hy,arm[1]*0.5-1.4,100)}}
  if(o.blood){ctx.fillStyle='rgba(150,10,14,.85)';for(const [hx,hy] of [handP(-1,arm[0],92,38),handP(1,arm[1],92,38)]){ctx.beginPath();ctx.arc(hx,hy,10,0,7);ctx.fill();ctx.fillRect(hx-2,hy,4,18)}}
  if(o.tear){ctx.fillStyle='rgba(190,215,235,.9)';for(const sd of [-1,1]){const k=(T*0.8+(sd>0?0.5:0))%1;ctx.beginPath();ctx.ellipse(sd*20,-250+k*40,5,8,0,0,7);ctx.fill()}}
  if(o.bowl){const [hx,hy]=handP(1,arm[1],92,38);ctx.fillStyle='#e8e2d6';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.arc(hx,hy-4,22,0,Math.PI);ctx.closePath();ctx.fill();ctx.stroke()}})}
// ---- Hai Thủy ----
function thuy(x,fy,s,o={}){const T=o.t||0;woman(x,fy,s,{shirt:'#a8cce0',pants:'#1c1c22',skin:o.pale?'#c0c4bc':'#e2d8c8',eyes:o.eyes,look:o.look,mouth:o.mouth,smile:o.smile??false,back:o.back,sit:o.sit,arm:o.arm||[0.12,-0.12],t:T,tilt:o.tilt});
 inS(x,fy,s,()=>{if(o.mud&&!o.back)mudMouth(-246,0.9);if(o.mam){thauAt(0,-150,52);circ(-4,-138,8,SKIN,INK,3)}
  if(o.tear){ctx.fillStyle='rgba(190,215,235,.9)';for(const sd of [-1,1]){const k=(T*0.8+(sd>0?0.5:0))%1;ctx.beginPath();ctx.ellipse(sd*20,-250+k*40,5,8,0,0,7);ctx.fill()}}})}
// ---- bà Năm Lụa ----
function bnl(x,fy,s,o={}){const T=o.t||0;const arm=[0.12,o.point?-1.6:-0.35];woman(x,fy,s,{old:true,shirt:'#1e1e26',pants:'#121216',skin:'#cfc6b4',eyes:o.eyes??0.7,look:o.look,mouth:o.mouth,smile:false,back:o.back,arm,t:T,sit:o.sit});
 inS(x,fy,s,()=>{if(!o.point&&!o.sit){const [hx,hy]=handP(1,arm[1],92,38);ctx.strokeStyle=INK;ctx.lineWidth=11;ctx.beginPath();ctx.moveTo(hx,hy-20);ctx.lineTo(hx+14,0);ctx.stroke();ctx.strokeStyle='#6a4a2a';ctx.lineWidth=6;ctx.stroke();circ(hx,hy,8,SKIN,INK,3)}
  if(!o.back){ctx.fillStyle='#e8e6e0';ctx.beginPath();ctx.arc(0,-278,60,Math.PI*1.02,Math.PI*1.98);ctx.quadraticCurveTo(0,-306,-58,-284);ctx.fill();circ(0,-348,20,'#e0ded8',INK,3)}})}
// ---- chị Sáu Hoa ----
function hoa(x,fy,s,o={}){woman(x,fy,s,{shirt:'#5c6a48',pants:'#1c1c20',skin:'#d4c8b4',eyes:o.eyes,look:o.look,mouth:o.mouth,smile:false,back:o.back,sit:o.sit,arm:o.arm,t:o.t||0,tilt:o.tilt});
 if(o.tear)inS(x,fy,s,()=>{ctx.fillStyle='rgba(190,215,235,.9)';for(const sd of [-1,1]){const k=((o.t||0)*0.8+(sd>0?0.5:0))%1;ctx.beginPath();ctx.ellipse(sd*20,-250+k*40,5,8,0,0,7);ctx.fill()}})}
// ---- dân xóm ----
function danNam(x,fy,s,o={}){const arm=[0.1,o.torch?-2.3:-0.1];person(x,fy,s,{shirt:o.shirt||'#4a5048',pants:'#26262a',skin:'#b8a48c',armA:arm,back:o.back,hair:o.hair,eyes:o.eyes,look:o.look});if(o.torch)inS(x,fy,s,()=>{const [hx,hy]=handP(1,arm[1]);torchAt(hx,hy,o.t||0)})}
function danNu(x,fy,s,o={}){const T=o.t||0;const arm=o.thau?[-0.55,-2.5+1.4*Math.max(0,Math.sin(T*9+(o.ph||0)))]:[0.12,-0.12];woman(x,fy,s,{shirt:o.shirt||'#6a5a44',pants:'#1c1c20',skin:'#d0c4b0',arm,t:T,old:o.old,smile:false,back:o.back,eyes:o.eyes});
 if(o.thau)inS(x,fy,s,()=>{thauAt(0,-150,54);circ(-4,-138,8,SKIN,INK,3);const [hx,hy]=handP(1,arm[1],92,38);stickAt(hx,hy,arm[1]*0.5-1.4,100)})}
// ---- con Mực ----
function muc(x,fy,s,o={}){inS(x,fy,s,()=>{const T=o.t||0,gr=o.growl;ctx.fillStyle='#16161a';ctx.strokeStyle=INK;ctx.lineWidth=4;
 for(const lx of [-50,-30,30,50]){ctx.beginPath();ctx.rect(lx-6,-50,12,50);ctx.fill()}
 ctx.beginPath();ctx.ellipse(0,-66,66,30,0,0,7);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-60,-76);ctx.quadraticCurveTo(-90,gr?-60:-110,-100,gr?-40:-120);ctx.lineWidth=10;ctx.strokeStyle='#16161a';ctx.stroke();
 ctx.save();ctx.translate(60,gr?-80:-96);circ(0,0,30,'#16161a',INK,4);poly([[-20,-20],[-8,-52],[4,-22]],'#16161a',INK,3);poly([[6,-22],[20,-50],[24,-16]],'#16161a',INK,3);
 ctx.fillStyle='#1a1a1e';ctx.beginPath();ctx.ellipse(28,8,22,13,0,0,7);ctx.fill();circ(44,4,5,'#000');circ(12,-6,5,'#e8e4d0');circ(13,-6,2.5,'#000');
 if(gr){ctx.fillStyle='#f0ece0';for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(18+k*7,16);ctx.lineTo(22+k*7,16);ctx.lineTo(20+k*7,24);ctx.fill()}}ctx.restore()})}
// ---- MA RỪNG (ma giấu): cao lêu nghêu, da vỏ tràm, tay dài tới gối ----
function maRung(x,fy,s,T,o={}){ctx.save();ctx.translate(x,fy);ctx.scale(s,s);ctx.lineJoin='round';ctx.lineCap='round';ctx.globalAlpha=o.a??1;
 const sk='#8e8f84',bark='#b8b4a2';halo(0,-420,300,'170,40,40',0.12*(o.glow??1));
 const cr=o.crouch,top=cr?-300:-520,hy=top-56;
 // tóc dài sau lưng
 ctx.fillStyle='#0a0a0c';const sw=Math.sin(T*1.2)*6;ctx.beginPath();ctx.moveTo(-58,hy-10);ctx.quadraticCurveTo(-96,hy+160,-70+sw,hy+(cr?220:330));ctx.lineTo(70+sw,hy+(cr?220:330));ctx.quadraticCurveTo(96,hy+160,58,hy-10);ctx.fill();
 // chân
 if(cr){for(const sd of [-1,1]){ctx.strokeStyle=INK;ctx.lineWidth=24;ctx.beginPath();ctx.moveTo(sd*16,top+170);ctx.lineTo(sd*70,-120);ctx.lineTo(sd*34,-6);ctx.stroke();ctx.strokeStyle=sk;ctx.lineWidth=16;ctx.stroke()}}
 else for(const sd of [-1,1]){const st=o.walk?Math.sin(T*2+sd)*0.08:0;ctx.save();ctx.translate(sd*16,top+200);ctx.rotate(st);ctx.strokeStyle=INK;ctx.lineWidth=24;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(sd*6,-top-206);ctx.stroke();ctx.strokeStyle=sk;ctx.lineWidth=16;ctx.stroke();ctx.restore()}
 // thân gầy, sườn
 ctx.fillStyle=sk;ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-40,top+6);ctx.lineTo(40,top+6);ctx.lineTo(26,top+210);ctx.lineTo(-26,top+210);ctx.closePath();ctx.fill();ctx.stroke();
 if(!o.back){ctx.strokeStyle='rgba(30,30,26,.55)';ctx.lineWidth=3;for(let k=0;k<6;k++)for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*4,top+30+k*22);ctx.quadraticCurveTo(sd*22,top+24+k*22,sd*32,top+36+k*22);ctx.stroke()}}
 // vỏ tràm bong + bùn
 ctx.fillStyle=bark;for(let k=0;k<7;k++){const yy=top+20+rnd(k)*180,xx=-30+rnd(k+4)*60;ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx+10,yy+4);ctx.lineTo(xx+6,yy+36);ctx.lineTo(xx-4,yy+30);ctx.fill()}
 ctx.fillStyle='rgba(28,20,12,.7)';for(let k=0;k<6;k++){ctx.beginPath();ctx.ellipse(-30+rnd(k+9)*60,top+120+rnd(k+2)*100,8,16,0,0,7);ctx.fill()}
 // tay dài (tới gối)
 const arms=o.arms||[0.12,-0.12];for(const sd of [-1,1]){const a=arms[sd>0?1:0];ctx.save();ctx.translate(sd*38,top+20);ctx.rotate(a);ctx.strokeStyle=INK;ctx.lineWidth=20;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,330);ctx.stroke();ctx.strokeStyle=sk;ctx.lineWidth=13;ctx.stroke();
  ctx.strokeStyle=INK;ctx.lineWidth=5;for(let f=-2;f<=2;f++){ctx.beginPath();ctx.moveTo(f*4,330);ctx.quadraticCurveTo(f*10,370,f*8+3,400+Math.abs(f)*-6);ctx.stroke()}
  if(o.mudHand&&sd===o.mudHand){circ(0,350,18,'#24180e',INK,2)}ctx.restore()}
 // đầu
 ctx.fillStyle=sk;ctx.fillRect(-12,top-10,24,20);ctx.save();ctx.translate(0,hy);ctx.rotate(o.tilt??Math.sin(T*0.6)*0.05);
 if(o.back){circ(0,0,58,'#0a0a0c',INK,4)}else{ghostFace(T,{skin:'#c8ccc0',open:o.open??(0.5+0.3*Math.sin(T*2)),look:o.look,closed:o.closed,glow:o.glow});
  if(o.wide){ctx.fillStyle='#0a0202';ctx.beginPath();ctx.moveTo(-56,22);ctx.quadraticCurveTo(0,44,56,22);ctx.quadraticCurveTo(0,96,-56,22);ctx.fill();ctx.fillStyle='#d8d4c2';for(let k=-6;k<=6;k++){ctx.beginPath();ctx.moveTo(k*8-3,28);ctx.lineTo(k*8+3,28);ctx.lineTo(k*8,40);ctx.fill()}}}
 ctx.restore();ctx.restore()}
// ---- xác Sáu Lộc (nằm sấp nghiêng trong bụi) ----
function locCorpse(){ctx.save();ctx.translate(256,980);ctx.scale(2.6,2.6);person(0,0,1,{shirt:'#4a4e50',pants:'#2c2c2c',skin:'#8f9a88',eyes:0.01,tilt:0.3});mudMouth(-244,1.2);
 ctx.fillStyle='rgba(30,22,14,.6)';for(let k=0;k<10;k++){ctx.beginPath();ctx.ellipse(-40+rnd(k)*80,-260+rnd(k+3)*250,8+rnd(k+1)*12,12+rnd(k+2)*16,0,0,7);ctx.fill()}ctx.restore()}
