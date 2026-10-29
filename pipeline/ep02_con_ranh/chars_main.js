// ===== EP2 CON RANH CON LỘN — nhân vật nét Ma Lai =====
const CROSS='#2a4f8a';
function khanRan(w,h){const c=document.createElement('canvas');c.width=64;c.height=64;const g=c.getContext('2d');g.fillStyle='#e8e2d2';g.fillRect(0,0,64,64);g.fillStyle='#1a1a1e';for(let i=0;i<4;i++)for(let j=0;j<4;j++)if((i+j)%2===0)g.fillRect(i*16,j*16,16,16);g.fillStyle='rgba(26,26,30,.5)';for(let i=0;i<4;i++){g.fillRect(i*16+6,0,4,64);g.fillRect(0,i*16+6,64,4)}return c}
const KR=khanRan();let KRP=null;
function krFill(){if(!KRP||KRP._ctx!==ctx){KRP=ctx.createPattern(KR,'repeat');KRP._ctx=ctx}return KRP}
function bundle(x,y,s,o={}){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(o.rot||0);
 ctx.fillStyle=krFill();ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,0,46,24,0,0,7);ctx.fill();ctx.stroke();
 const fx=o.flip?34:-30;circ(fx,-2,17,o.dead?'#c8ccc4':'#e6d8c8',INK,3);
 const sd=o.flip?1:-1;ctx.fillStyle=INK;
 if(o.stare||o.dead){for(const k of [-1,1]){circ(fx+k*6,-4,3.2,'#050505')}}else{ctx.lineWidth=1.6;for(const k of [-1,1]){ctx.beginPath();ctx.arc(fx+k*6,-4,3,0.2,Math.PI-0.2);ctx.stroke()}}
 if(o.grin){ctx.strokeStyle='#3a1010';ctx.lineWidth=2;ctx.beginPath();ctx.arc(fx,4,6,0.3,Math.PI-0.3);ctx.stroke()}
 ctx.restore()}
function redBand(x,fy,s){ctx.save();ctx.translate(x,fy);ctx.scale(s,s);ctx.fillStyle='#b01818';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.rect(-61,-318,122,18);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(56,-310);ctx.lineTo(84,-290);ctx.lineTo(78,-270);ctx.lineTo(54,-296);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
function heldStick(x,fy,s,a=-0.5,len=170,col='#5a3a1a',w=6){ctx.save();ctx.translate(x,fy);ctx.scale(s,s);ctx.translate(48,-118);ctx.rotate(a);ctx.strokeStyle=INK;ctx.lineWidth=w+4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,20);ctx.lineTo(0,-len);ctx.stroke();ctx.strokeStyle=col;ctx.lineWidth=w;ctx.stroke();ctx.restore()}
function handLamp(x,fy,s,T){ctx.save();ctx.translate(x,fy);ctx.scale(s,s);ctx.translate(-62,-150);halo(0,-30,120,'255,190,110',0.35);poly([[-16,0],[16,0],[12,-14],[-12,-14]],'#5a4632',INK,2);ctx.globalAlpha=.6;ctx.fillStyle='#e8ecd8';ctx.beginPath();ctx.ellipse(0,-30,13,20,0,0,7);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.stroke();const f=1+Math.sin(T*13)*0.15;ctx.fillStyle='#ffcf70';ctx.beginPath();ctx.ellipse(0,-30,3.5,8*f,0,0,7);ctx.fill();ctx.restore()}
function incense(x,fy,s,T){ctx.save();ctx.translate(x,fy);ctx.scale(s,s);for(let k=-1;k<=1;k++){ctx.strokeStyle='#a86a2a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(4+k*5,-150);ctx.lineTo(8+k*8,-215);ctx.stroke();circ(8+k*8,-216,3,'#ff6a20');ctx.strokeStyle='rgba(220,220,220,.4)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(8+k*8,-218);ctx.quadraticCurveTo(14+k*8+Math.sin(T*2+k)*10,-260,10+k*8,-300);ctx.stroke()}ctx.restore()}
function hien(x,fy,s,o={}){const oo=Object.assign({shirt:o.wed?'#b8262a':'#8a4a3a',pants:'#1c1c20',dress:!!o.wed,t:o.t||0,smile:!!(o.wed||o.happy)},o);if(o.baby||o.hold)oo.arm=[-0.95,0.95];if(o.belly)oo.dress=true;
 woman(x,fy,s,oo);if(o.belly){ctx.save();ctx.translate(x,fy);ctx.scale(s,s);ctx.fillStyle=oo.shirt;ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,-130,52,46,0,0,7);ctx.fill();ctx.stroke();ctx.restore()}
 if(o.baby){ctx.save();ctx.translate(x,fy);ctx.scale(s,s);bundle(0,-160,1.15,{stare:o.stare,grin:o.grin,dead:o.dead,flip:o.flipb});for(const sd of [-1,1])circ(sd*34,-160,8,SKIN,INK,3);ctx.restore()}
 if(o.fan){ctx.save();ctx.translate(x,fy);ctx.scale(s,s);ctx.translate(60,-130+Math.sin((o.t||0)*6)*8);ctx.fillStyle='#c9b27a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,44,-2.3,-0.8);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
 if(o.tear){ctx.fillStyle='rgba(190,215,235,.9)';for(const sd of [-1,1]){const k=((o.t||0)*0.8+(sd>0?0.5:0))%1;ctx.beginPath();ctx.ellipse(x+sd*20*s,fy+(-278+26+k*40)*s,5*s,8*s,0,0,7);ctx.fill()}}}
function loi(x,fy,s,o={}){person(x,fy,s,Object.assign({shirt:o.wed?'#1e3a6a':'#3c5060',pants:'#24262b',skin:o.sick?'#b4bab0':undefined},o));if(o.lamp)handLamp(x,fy,s,o.t||0);if(o.oar)heldStick(x,fy,s,0.45,260,'#6a4a2a',8)}
function batu(x,fy,s,o={}){const oo=Object.assign({old:true,shirt:'#2a2a32',pants:'#141418',smile:false},o);if(o.baby)oo.arm=[-0.95,0.95];woman(x,fy,s,oo);if(o.baby){ctx.save();ctx.translate(x,fy);ctx.scale(s,s);bundle(0,-160,1.15,{stare:true,grin:false});ctx.restore()}if(o.knife){ctx.save();ctx.translate(x,fy);ctx.scale(s,s);ctx.translate(50,-138);ctx.rotate(0.3);ctx.fillStyle='#4a3020';ctx.fillRect(-4,-10,8,30);poly([[-6,-10],[8,-10],[18,-90],[2,-96]],'#9aa0a6',INK,2.5);ctx.restore()}
 if(o.hoe){heldStick(x,fy,s,-0.25,200,'#6a4a2a',7);ctx.save();ctx.translate(x,fy);ctx.scale(s,s);ctx.translate(48,-118);ctx.rotate(-0.25);poly([[-4,-196],[40,-188],[38,-170],[-4,-178]],'#7a7e84',INK,2.5);ctx.restore()}
 if(o.incense)incense(x,fy,s,o.t||0)}
function batho(x,fy,s,o={}){woman(x,fy,s,Object.assign({old:true,shirt:'#6a5236',pants:'#1c1c20',smile:false},o));if(o.lamp)handLamp(x,fy,s,o.t||0);
 if(o.baby){ctx.save();ctx.translate(x,fy);ctx.scale(s,s);bundle(0,-160,1.15,{stare:true});ctx.restore()}
 if(o.up){ctx.save();ctx.translate(x,fy);ctx.scale(s,s);bundle(0,-300,1.15,{stare:true});ctx.restore()}}
function thayBay(x,fy,s,o={}){person(x,fy,s,Object.assign({shirt:'#151515',pants:'#151515',robe:true,beard:true,hair:'#8a8882',skin:'#d4cfc3'},o));redBand(x,fy,s);if(o.stick!==false)heldStick(x,fy,s,o.broken?1.0:0.35,o.broken?80:170,'#7a5a2a',5)}
function namco(x,fy,s,o={}){person(x,fy,s,Object.assign({shirt:'#5a5a46',pants:'#2a2a26',hair:'#6a6a66'},o))}
function bamuoi(x,fy,s,o={}){woman(x,fy,s,Object.assign({old:true,shirt:'#5a5048',pants:'#1c1c20',smile:false,skin:'#c8c6b8'},o))}
// đứa trẻ 5 tuổi (người sống)
function kid(x,fy,s,o={}){ctx.save();ctx.translate(x,fy);ctx.scale(s,s);ctx.lineJoin='round';ctx.lineCap='round';const sh=o.shirt||'#6a7a5a',pa=o.pants||'#2a2c30';
 if(!o.sit){for(const sd of [-1,1]){ctx.fillStyle=pa;ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.rect(sd*12-9,-70,18,68);ctx.fill();ctx.stroke();ctx.fillStyle='#222';ctx.beginPath();ctx.ellipse(sd*14,0,12,5,0,0,7);ctx.fill()}}
 else{ctx.fillStyle=pa;ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,-30,56,22,0,0,7);ctx.fill();ctx.stroke()}
 const top=o.sit?-150:-170;poly([[-30,top],[30,top],[34,top+100],[-34,top+100]],sh,INK,4);
 for(const sd of [-1,1]){ctx.save();ctx.translate(sd*30,top+12);ctx.rotate(o.armA?o.armA[sd>0?1:0]:sd*0.15);ctx.strokeStyle=INK;ctx.lineWidth=18;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,64);ctx.stroke();ctx.strokeStyle=sh;ctx.lineWidth=12;ctx.stroke();circ(0,68,7,SKIN,INK,3);ctx.restore()}
 ctx.fillStyle=SKIN;ctx.fillRect(-8,top-8,16,12);const hy=top-48;ctx.save();ctx.translate(0,hy);ctx.rotate(o.tilt||0);circ(0,0,50,'#d6cfc2',INK,4);
 if(o.back){ctx.save();ctx.beginPath();ctx.arc(0,0,50,0,7);ctx.clip();ctx.fillStyle=HAIR;ctx.fillRect(-50,-50,100,70);ctx.restore();circ(0,0,50,null,INK,4)}
 else{ctx.fillStyle=HAIR;ctx.beginPath();ctx.arc(0,0,52,Math.PI*1.05,Math.PI*1.95);for(let i=0;i<=6;i++)ctx.lineTo(48-i*16,-18+(i%2?8:0));ctx.closePath();ctx.fill();
  const eo=o.eyes??1;for(const sd of [-1,1]){if(eo<0.15){ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sd*18-9,8);ctx.lineTo(sd*18+9,8);ctx.stroke()}else{ctx.save();ctx.translate(sd*18,6);ctx.scale(1,eo);circ(0,0,12,'#f4f2ea',INK,3);circ((o.look||0)*4,1,o.empty?5:3.4,INK);ctx.restore()}}
  ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();if(o.mouth==='o'){ctx.ellipse(0,28,4,6,0,0,7)}else if(o.smile){ctx.arc(0,20,9,0.5,Math.PI-0.5)}else{ctx.moveTo(-6,28);ctx.lineTo(6,28)}ctx.stroke()}
 ctx.restore();ctx.restore()}
// ---------- con ranh: đứa trẻ chết đuối, da trắng bệch, dấu chàm chữ thập vai trái ----------
const RSKIN='#c3ccc6';
function ranh(x,fy,s,T,o={}){const bob=o.still?0:Math.sin(T*1.6)*3;ctx.save();ctx.translate(x,fy+bob*s);ctx.scale(s,s);ctx.lineJoin='round';ctx.lineCap='round';ctx.globalAlpha=o.a??1;
 halo(0,-120,190,'140,255,190',0.16*(o.glow??1));
 const crouch=o.crouch;const top=crouch?-120:-176,sk=RSKIN;
 // chân
 if(crouch){for(const sd of [-1,1]){ctx.strokeStyle=INK;ctx.lineWidth=20;ctx.beginPath();ctx.moveTo(sd*14,top+96);ctx.lineTo(sd*40,-30);ctx.lineTo(sd*22,-4);ctx.stroke();ctx.strokeStyle=sk;ctx.lineWidth=13;ctx.stroke()}}
 else{for(const sd of [-1,1]){ctx.strokeStyle=INK;ctx.lineWidth=19;ctx.beginPath();ctx.moveTo(sd*13,top+96);ctx.lineTo(sd*12+Math.sin(T+sd)*1.5,-6);ctx.stroke();ctx.strokeStyle=sk;ctx.lineWidth=12;ctx.stroke()}
  ctx.fillStyle='#2a2a26';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.rect(-30,top+78,60,26);ctx.fill();ctx.stroke()}
 // thân ở trần
 ctx.fillStyle=sk;ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-30,top+6);ctx.lineTo(30,top+6);ctx.lineTo(28,top+86);ctx.quadraticCurveTo(0,top+96,-28,top+86);ctx.closePath();ctx.fill();ctx.stroke();
 if(!o.back){ctx.strokeStyle='rgba(60,80,76,.5)';ctx.lineWidth=2;for(let k=0;k<4;k++){for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*4,top+24+k*11);ctx.quadraticCurveTo(sd*16,top+20+k*11,sd*24,top+28+k*11);ctx.stroke()}}}
 // dấu chữ thập vai trái (nhìn trước: bên phải khung; nhìn sau: bên trái)
 const cx=o.back?-18:18;ctx.strokeStyle=CROSS;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(cx-8,top+18);ctx.lineTo(cx+8,top+18);ctx.moveTo(cx,top+9);ctx.lineTo(cx,top+28);ctx.stroke();
 // nước nhỏ giọt
 ctx.fillStyle='rgba(170,200,210,.8)';for(let k=0;k<4;k++){const f=(T*0.9+k*0.27)%1;ctx.beginPath();ctx.ellipse(-24+k*16,top+90+f*80,2.5,5,0,0,7);ctx.fill()}
 // tay
 const arm=(sd,ang,len,beck,nof)=>{ctx.save();ctx.translate(sd*28,top+14);ctx.rotate(ang);ctx.strokeStyle=INK;ctx.lineWidth=15;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,len);ctx.stroke();ctx.strokeStyle=sk;ctx.lineWidth=9;ctx.stroke();ctx.translate(0,len);circ(0,0,7,sk,INK,3);const cr=beck?0.6+0.5*Math.sin(T*3.2):0.2;
  for(let f=0;f<4;f++){if(nof&&f===(sd>0?3:0))continue;ctx.save();ctx.rotate((f-1.5)*0.24);ctx.strokeStyle=INK;ctx.lineWidth=4.5;ctx.beginPath();ctx.moveTo(0,3);ctx.quadraticCurveTo(0,18,-cr*12,26+f%2*3);ctx.stroke();ctx.strokeStyle=sk;ctx.lineWidth=2.2;ctx.stroke();ctx.restore()}
  if(nof&&o.wrap){circ(sd*4,6,6,'#eee',INK,2)}ctx.restore()};
 const nofL=!!o.nofinger;
 if(o.dig){arm(-1,-0.7+Math.sin(T*9)*0.3,96,false,false);arm(1,0.7-Math.sin(T*9+1)*0.3,96,false,nofL)}
 else if(o.reach){arm(-1,-1.2,110,true,false);arm(1,1.2,110,true,nofL)}
 else{arm(-1,0.12+Math.sin(T*0.9)*0.03,104,false,false);if(o.beckon)arm(1,-2.0+Math.sin(T*3.2)*0.3,92,true,nofL);else arm(1,-0.12,104,false,nofL)}
 // đầu
 ctx.save();ctx.translate(0,top-52);ctx.rotate(o.tilt??(0.16+Math.sin(T*0.7)*0.05));ctx.scale(0.86,0.86);
 if(o.back){circ(0,0,58,RSKIN,INK,4);ctx.fillStyle=HAIR;ctx.beginPath();ctx.arc(0,0,60,Math.PI*0.9,Math.PI*2.1);ctx.lineTo(56,30);ctx.quadraticCurveTo(0,20,-56,30);ctx.closePath();ctx.fill()}
 else if(o.calm){circ(0,0,58,RSKIN,INK,4);ctx.fillStyle=HAIR;ctx.beginPath();ctx.arc(0,0,60,Math.PI*1.0,Math.PI*2.0);for(let i=0;i<=6;i++)ctx.lineTo(56-i*18.6,-16+(i%2?10:0));ctx.closePath();ctx.fill();for(const sd of [-1,1]){ctx.fillStyle='#050505';ctx.beginPath();ctx.ellipse(sd*21,8,13,15,0,0,7);ctx.fill();circ(sd*21,9,2.5,'#dfe');}ctx.strokeStyle='#2a1010';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,26,13,0.35,Math.PI-0.35);ctx.stroke()}
 else scaryFace(T,{look:o.look,open:o.open});
 ctx.restore();ctx.globalAlpha=1;ctx.restore()}
