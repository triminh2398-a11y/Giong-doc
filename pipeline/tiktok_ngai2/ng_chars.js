// ===== NGẢI THẤT SƠN (An Giang) — nhân vật nét Ma Lai =====
const R0=i=>{const x=Math.sin(i*91.7+17.3)*43758.5;return x-Math.floor(x)};
const HPW=(sd,a)=>[sd*38-92*Math.sin(a),-210+92*Math.cos(a)];
const HPP=(sd,a)=>[sd*40-92*Math.sin(a),-210+92*Math.cos(a)];
// lá ngải: lá dài, gân đỏ như mạch máu
function ngaiLeaf(len,w,ang,T,k,pulse=0){ctx.save();ctx.rotate(ang+Math.sin(T*2.2+k)*0.04);ctx.fillStyle='#2f5a2c';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(w,-len*0.45,0,-len);ctx.quadraticCurveTo(-w,-len*0.45,0,0);ctx.fill();ctx.stroke();
 ctx.strokeStyle=`rgba(${200+55*pulse},30,40,.95)`;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-len*0.95);ctx.stroke();ctx.lineWidth=1.2;for(let j=1;j<6;j++){const y=-len*j/6;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(0,y);ctx.quadraticCurveTo(sd*w*0.35,y-len*0.04,sd*w*0.6,y-len*0.1);ctx.stroke()}}ctx.restore()}
// chậu ngải 2D (cầm trên tay): x,y = đáy chậu
function potDraw(x,y,s,T,o={}){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const pulse=o.pulse??(0.5+0.5*Math.sin(T*3));if(o.glow)halo(0,-60,170,'255,40,40',0.3*o.glow);
 const L=o.small?[[70,-0.5],[85,-0.15],[78,0.25],[62,0.6]]:[[120,-0.7],[150,-0.35],[165,-0.05],[150,0.3],[125,0.65],[100,-1.0],[95,0.95]];
 L.forEach(([l,a],k)=>{ctx.save();ctx.translate(0,-50);ngaiLeaf(l*(o.small?0.8:1),l*0.16,a,T,k,pulse);ctx.restore()});
 if(o.shoot){ctx.save();ctx.translate(14,-52);ctx.rotate(0.25+Math.sin(T*3)*0.05);ctx.fillStyle='#b01822';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(10,-30,0,-60*o.shoot);ctx.quadraticCurveTo(-10,-30,0,0);ctx.fill();ctx.stroke();ctx.restore()}
 ctx.fillStyle='#a8542e';ctx.strokeStyle=INK;ctx.lineWidth=3.5;const w=o.small?36:52;ctx.beginPath();ctx.moveTo(-w,-52);ctx.lineTo(w,-52);ctx.lineTo(w*0.72,0);ctx.lineTo(-w*0.72,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#8a4022';ctx.fillRect(-w-4,-58,2*w+8,12);ctx.strokeRect(-w-4,-58,2*w+8,12);
 ctx.fillStyle='rgba(255,220,180,.15)';ctx.fillRect(-w*0.6,-44,10,38);ctx.restore()}
// rễ ngải quấn (từ điểm a tới điểm b), q = độ dài 0..1
function rootLine(x0,y0,x1,y1,q,T,k=0,lw=5){ctx.save();ctx.lineCap='round';ctx.strokeStyle='#5a2a1a';ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x0,y0);const n=14;for(let i=1;i<=n*q;i++){const t=i/n;const x=lerp(x0,x1,t)+Math.sin(t*9+k+T*1.5)*10*(1-t*0.5),y=lerp(y0,y1,t)+Math.cos(t*7+k)*6;ctx.lineTo(x,y)}ctx.stroke();ctx.strokeStyle='rgba(190,40,40,.7)';ctx.lineWidth=lw*0.35;ctx.stroke();ctx.restore()}
function drip(x,y,T,k=0,n=3){for(let i=0;i<n;i++){const p=((T*0.9+i/n+k*0.37)%1);ctx.fillStyle='#9a0a12';ctx.beginPath();ctx.ellipse(x+(i-1)*4,y+p*60,3,5,0,0,7);ctx.fill()}}
// Lợi: áo sơ mi nâu bạc, quần đen. o.pot ôm chậu trước ngực; o.roots rễ quấn tay; o.bandage tay quấn giẻ; o.phone; o.knife; o.bite; o.dig (quỳ, tay chống xuống)
function loi(x,y,s,o={}){const T=o.T||0;let armA=o.armA||[undefined,undefined];if(o.pot)armA=[-0.08,0.08];if(o.knife)armA=[armA[0],-2.6];if(o.reach)armA=[undefined,-1.1];if(o.hug)armA=[-1.2,1.2];
 person(x,y,s,Object.assign({shirt:'#6a5238',pants:'#1e1e22',skin:'#d8c4a8',hair:'#151515'},o,{armA}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){for(let k=0;k<3;k++)circ(0,-190+k*26,3,'#d8d0b8')}
 if(o.bite){ctx.fillStyle='#9a0a12';ctx.fillRect(-3,-243,3,10+((T*15)%8))}
 if(o.tears){ctx.strokeStyle='rgba(170,210,240,.9)';ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*21,-262);ctx.lineTo(sd*22,-240+(T*20)%12);ctx.stroke()}}
 if(o.pot){potDraw(0,-100,0.55,T,{glow:o.glow||0.4,shoot:o.shoot});for(const sd of [-1,1]){const [hx,hy]=HPP(sd,sd*0.08);circ(hx,hy,9,'#d8c4a8',INK,3)}}
 if(o.wet){ctx.fillStyle='rgba(150,190,220,.85)';for(let k=0;k<6;k++){const p=((T*1.3+k/6)%1);ctx.beginPath();ctx.ellipse(-40+k*16,-236+p*70,2.5,4,0,0,7);ctx.fill()}ctx.fillStyle='rgba(20,30,40,.25)';ctx.fillRect(-40,-222,80,110)}
 if(o.mud){ctx.fillStyle='rgba(70,48,26,.75)';for(let k=0;k<9;k++){ctx.beginPath();ctx.ellipse(-34+R0(k)*68,-220+R0(k+3)*120,6+R0(k+5)*9,4+R0(k+7)*7,R0(k)*3,0,7);ctx.fill()}for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(-30+R0(k+11)*60,-300+R0(k+13)*50,4+R0(k)*6,3+R0(k+2)*4,0,0,7);ctx.fill()}}
 if(o.roots){const q=o.roots;for(const sd of [-1,1]){const [hx,hy]=HPP(sd,sd>0?0.95:-0.95);rootLine(sd*10,-140,hx+sd*14,hy-6,q,T,sd*3,5);rootLine(sd*-6,-140,hx,hy+10,q*0.9,T,sd*5+1,4);if(q>0.8)drip(hx,hy+10,T,sd)}}
 if(o.bandage){const sd=o.bandage;const a=armA[sd>0?1:0]??sd*0.1;const [hx,hy]=HPP(sd,a);ctx.fillStyle='#e8e0cc';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(hx,hy+4,17,22,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='rgba(150,10,18,.85)';ctx.beginPath();ctx.ellipse(hx+3,hy+10,10,12,0,0,7);ctx.fill();ctx.strokeStyle='rgba(120,100,80,.6)';ctx.lineWidth=2;for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(hx-16,hy-8+k*9);ctx.lineTo(hx+16,hy-4+k*9);ctx.stroke()}}
 if(o.knife){const [hx,hy]=HPP(1,-2.6);ctx.save();ctx.translate(hx,hy);ctx.rotate(-0.4);ctx.fillStyle='#3a2a1a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.fillRect(-6,-30,12,34);ctx.strokeRect(-6,-30,12,34);ctx.fillStyle='#c8ccd0';ctx.beginPath();ctx.moveTo(-8,-30);ctx.lineTo(10,-30);ctx.lineTo(16,-120);ctx.quadraticCurveTo(-4,-90,-8,-30);ctx.fill();ctx.stroke();if(o.glint)halo(10,-100,60,'255,255,255',0.5*o.glint);ctx.restore()}
 if(o.money){const [hx,hy]=HPP(1,armA[1]??-0.6);ctx.save();ctx.translate(hx,hy-10);ctx.rotate(0.3);for(let k=0;k<4;k++){ctx.fillStyle=['#3a8a6a','#c88a3a','#2a7a9a','#3a8a6a'][k];ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.save();ctx.rotate(k*0.18-0.3);ctx.fillRect(-12,-44,24,44);ctx.strokeRect(-12,-44,24,44);ctx.restore()}ctx.restore()}
 if(o.pale){ctx.globalAlpha=0.35;circ(0,-278,58,'#9ab0a8');ctx.globalAlpha=1}
 ctx.restore()}
// Thắm: áo bà ba tím, tóc dài cột sau. o.sick (tái, môi tím), o.point (chỉ tay), o.water (bình tưới)
function tham(x,y,s,o={}){const T=o.T||0;const arm=(o.arm||[undefined,undefined]).slice();if(o.point)arm[1]=-1.75;if(o.water)arm[0]=1.2;if(o.pot){arm[0]=-0.08;arm[1]=0.08}if(o.phone)arm[1]=3.32;if(o.phoneLap){arm[0]=-0.25;arm[1]=0.25}if(o.reachDown!==undefined)arm[0]=o.reachDown;
 const skin=o.sick?'#d4d8cc':'#efdcc8';
 woman(x,y,s,Object.assign({shirt:o.tang?'#e8e4d8':'#7a4a72',pants:'#1c1a22',skin,smile:!!o.smileF},o,{arm,mouth:o.mouth,phone:undefined}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){ctx.strokeStyle=HAIR;ctx.lineWidth=14;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(48,-268);ctx.quadraticCurveTo(70,-210,56,-150);ctx.stroke()}
 else{ctx.strokeStyle=HAIR;ctx.lineWidth=18;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,-250);ctx.quadraticCurveTo(6,-200,0,-140);ctx.stroke()}
 if(o.sick&&!o.back){ctx.fillStyle='rgba(70,40,90,.35)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*21,-262,17,12,0,0,7);ctx.fill()}ctx.fillStyle='#6a4a7a';ctx.fillRect(-9,-246,18,4)}
 if(o.tears){ctx.strokeStyle='rgba(170,210,240,.9)';ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*20,-262);ctx.lineTo(sd*21,-240+(T*20)%12);ctx.stroke()}}
 if(o.tang){ctx.fillStyle='#f4f2ea';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();ctx.rect(-58,-318,116,16);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(52,-310);ctx.quadraticCurveTo(70,-280,64,-236);ctx.lineTo(56,-238);ctx.quadraticCurveTo(60,-282,46,-306);ctx.fill();ctx.stroke()}
 if(o.pot){potDraw(0,-100,0.55,T,{glow:o.glow??0.4,pulse:o.pulse});for(const sd of [-1,1]){const [hx,hy]=HPW(sd,sd*0.08);circ(hx,hy,8,skin,INK,3)}}
 if(o.phone){const [hx,hy]=HPW(1,3.32);ctx.fillStyle='#1a1a1e';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.fillRect(hx-6,hy-22,13,30);ctx.strokeRect(hx-6,hy-22,13,30);circ(hx,hy,8,skin,INK,3)}
 if(o.phoneLap){ctx.fillStyle='#1a1a1e';ctx.fillRect(-16,-136,32,20);if(o.glowPh!==0)halo(0,-150,90,'170,200,255',0.35);ctx.fillStyle='rgba(190,215,255,.9)';ctx.fillRect(-13,-133,26,14);for(const sd of [-1,1]){const [hx,hy]=HPW(sd,sd*0.25);circ(hx,hy,8,skin,INK,3)}}
 if(o.dropPhone!==undefined){const p=o.dropPhone;ctx.save();ctx.translate(-26+p*10,-112+p*112);ctx.rotate(p*2.2);ctx.fillStyle='#1a1a1e';ctx.fillRect(-7,-14,14,28);ctx.restore()}
 if(o.bite){ctx.fillStyle='#9a0a12';ctx.fillRect(-4,-246,3,8+((T*12)%8))}
 if(o.roots!==undefined){const a=arm[0]??-0.12;const [hx,hy]=HPW(-1,a);const q=o.roots;rootLine(hx-20,-6,hx,hy+4,q,T,1,6);rootLine(hx+14,-4,hx-4,hy-2,q*0.9,T,4,4);rootLine(hx-4,-2,hx+6,hy+8,q*0.8,T,7,3);
  ctx.strokeStyle='#14110c';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(hx+2,hy+6,6,3,0,0,7);ctx.stroke();if(o.blood)drip(hx,hy+8,T,1,3)}
 if(o.bandage){const a=arm[0]??-0.12;const [hx,hy]=HPW(-1,a);ctx.fillStyle='#e8e0cc';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(hx,hy+2,11,14,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='rgba(150,10,18,.8)';ctx.beginPath();ctx.ellipse(hx+2,hy+8,5,6,0,0,7);ctx.fill()}
 if(o.sprout){const a=arm[0]??-0.12;const [hx,hy]=HPW(-1,a);halo(hx,hy-10,50,'255,30,30',0.35*o.sprout);ctx.save();ctx.translate(hx+2,hy-4);ctx.rotate(-0.2+Math.sin(T*2)*0.06);ctx.fillStyle='#b01822';ctx.strokeStyle=INK;ctx.lineWidth=1.5;const L=52*o.sprout;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(7,-L*0.5,0,-L);ctx.quadraticCurveTo(-7,-L*0.5,0,0);ctx.fill();ctx.stroke();ctx.strokeStyle='#ff6060';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-L*0.9);ctx.stroke();ctx.restore()}
 if(o.water){const [hx,hy]=HP(-1,1.2);ctx.save();ctx.translate(hx-30,hy);ctx.scale(-1,1);ctx.fillStyle='#4a7a9a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.fillRect(-4,-10,40,34);ctx.strokeRect(-4,-10,40,34);ctx.beginPath();ctx.moveTo(36,0);ctx.lineTo(70,-22);ctx.stroke();ctx.fillStyle='rgba(170,210,240,.8)';for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(72+k*3,-16+((T*80+k*20)%60),2,4,0,0,7);ctx.fill()}ctx.restore()}
 ctx.restore()}
// Thầy Bảy: ông già râu bạc, áo dài nâu, khăn trắng
function thayBay(x,y,s,o={}){const T=o.T||0;const armA=o.armA||[undefined,undefined];if(o.pot){armA[0]=-0.08;armA[1]=0.08}
 person(x,y,s,Object.assign({beard:true,hair:'#b8b6ae',shirt:'#5a3e28',pants:'#2a2420',skin:'#cdbca4',robe:true,khan:true},o,{armA,phone:o.phone}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(o.mouth==='o'&&!o.back){ctx.fillStyle='#2a1414';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-247,7,9,0,0,7);ctx.fill();ctx.stroke()}
 if(!o.back){ctx.strokeStyle='#d8c8a0';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-196,26,0.2,Math.PI-0.2);ctx.stroke();for(let k=0;k<9;k++)circ(Math.cos(0.3+k*0.32)*26,-196+Math.sin(0.3+k*0.32)*26,4.5,'#6a3a1a',INK,1.5)}
 if(o.pot){potDraw(0,-100,0.55,T,{glow:0.3});for(const sd of [-1,1]){const [hx,hy]=HPP(sd,sd*0.08);circ(hx,hy,9,'#cdbca4',INK,3)}}
 ctx.restore()}
// ma Thắm (ngải giả dạng): da xám xanh, gân đỏ, tóc rũ, mắt hốc
// mặt ma kiểu Ma Lai: mặt lộ rõ, hốc mắt đen + đồng tử đỏ phát sáng, miệng toác răng, máu chảy; tóc chỉ ở sau/hai bên (không che mặt)
function ghostFace(T,o={}){const R0=58,sk=o.skin||'#b8c0b2',open=o.open??0.7;
 halo(0,10,170,'255,40,40',0.14*(o.glow??1));
 circ(0,0,R0,sk,INK,4);
 ctx.fillStyle='rgba(40,60,50,.3)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*36,26,11,18,sd*0.3,0,7);ctx.fill()}
 // tóc: chỏm trên + mái rẽ ngôi giữa ôm hai bên má (không che mắt)
 ctx.fillStyle=HAIR;ctx.beginPath();ctx.arc(0,0,R0+3,Math.PI*0.96,Math.PI*2.04);ctx.quadraticCurveTo(R0*0.55,-R0*0.55,4,-R0*0.62);ctx.quadraticCurveTo(-R0*0.55,-R0*0.55,-R0-3,R0*0.08);ctx.fill();
 for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*(R0-6),-20);ctx.quadraticCurveTo(sd*(R0+6),30,sd*(R0-2),R0+20);ctx.lineTo(sd*(R0+12),R0+30);ctx.quadraticCurveTo(sd*(R0+16),0,sd*(R0+2),-30);ctx.fill()}
 // gân đỏ ngải bò trên mặt + vết nứt
 ctx.strokeStyle='rgba(185,20,30,.85)';ctx.lineWidth=1.8;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*12,48);ctx.quadraticCurveTo(sd*34,26,sd*48,-4);ctx.stroke();ctx.beginPath();ctx.moveTo(sd*32,26);ctx.lineTo(sd*50,30);ctx.stroke();ctx.beginPath();ctx.moveTo(sd*40,10);ctx.lineTo(sd*52,4);ctx.stroke()}
 ctx.strokeStyle='rgba(60,30,40,.45)';ctx.lineWidth=1.5;for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(-30+k*20,-34);ctx.lineTo(-26+k*20+rnd(k)*8,-18);ctx.lineTo(-29+k*20,-6);ctx.stroke()}
 // hốc mắt đen sâu + đồng tử đỏ
 for(const sd of [-1,1]){ctx.fillStyle='#030303';ctx.beginPath();ctx.ellipse(sd*21,8,16,o.closed?3:19,sd*0.15,0,7);ctx.fill();
  if(!o.closed){halo(sd*21+(o.look||0)*5,10,14,'255,60,40',0.7);circ(sd*21+(o.look||0)*5,10,3.4,'#ff3020')}
  ctx.fillStyle='#6a0a10';const len=14+((T*18+sd*7)%26);ctx.fillRect(sd*21-2,24,4,len);circ(sd*21,24+len,3.5,'#6a0a10')}
 // miệng toác răng
 const mh=12+open*9;ctx.fillStyle='#120404';ctx.beginPath();ctx.moveTo(-34,26);ctx.quadraticCurveTo(0,34,34,26);ctx.quadraticCurveTo(0,26+mh*2,-34,26);ctx.fill();
 ctx.fillStyle='#d6d2c0';for(let k=-4;k<=4;k++){ctx.beginPath();ctx.moveTo(k*7-3,30);ctx.lineTo(k*7+3,30);ctx.lineTo(k*7,40);ctx.fill();const yb=26+mh*0.95-Math.abs(k)*1.8;ctx.beginPath();ctx.moveTo(k*7-3,yb+6);ctx.lineTo(k*7+3,yb+6);ctx.lineTo(k*7,yb-4);ctx.fill()}
 ctx.fillStyle='#5a0a0e';for(let k=0;k<3;k++){const x=-12+k*12,len=14+((T*30+k*17)%40);ctx.fillRect(x-2,26+mh,4,len);circ(x,26+mh+len,4,'#5a0a0e')}}
// ma Thắm (ngải giả dạng): da xám xanh, gân đỏ, tóc dài sau lưng, mặt lộ rõ
function maTham(x,fy,s,T,o={}){ctx.save();ctx.globalAlpha=o.a??0.95;if(o.glow!==0)halo(x,fy-280*s,280*s,'255,40,50',0.2);
 woman(x,fy,s,{shirt:'#4a2a48',pants:'#1a1018',dress:true,skin:'#a9b4a6',creepy:true,grin:0.3,eyes:1,t:T,arm:o.arm});
 ctx.translate(x,fy);ctx.scale(s,s);
 ctx.strokeStyle='rgba(170,20,30,.85)';ctx.lineWidth=2;for(let k=0;k<6;k++){ctx.beginPath();ctx.moveTo(-18+k*7,-214);ctx.quadraticCurveTo(-24+k*9,-190,-14+k*6+Math.sin(T+k)*3,-160);ctx.stroke()}
 ctx.translate(0,-278);ctx.rotate(o.tilt??Math.sin(T*0.7)*0.06);ghostFace(T,{open:o.open??(0.45+0.25*Math.sin(T*2.2)),closed:o.closed,look:o.look});
 ctx.restore();
 if(o.eyes2){ctx.save();ctx.globalAlpha=o.eyes2;ctx.translate(x,fy);ctx.scale(s,s);ctx.translate(0,-278);for(const sd of [-1,1]){halo(sd*21,10,40,'255,40,30',0.7);circ(sd*21,10,4.5,'#ff3020')}ctx.restore()}}
// ma Lợi (ngải giả giọng): mờ, tái, mắt hốc
function maLoi(x,y,s,T,o={}){ctx.save();ctx.globalAlpha=o.a??0.8;halo(x,y-280*s,240*s,'255,40,50',0.16);person(x,y,s,{shirt:'#3a2e24',pants:'#141416',skin:'#a9b4a6',hair:'#0c0c0c',eyes:0.01,mouth:o.mouth});ctx.translate(x,y);ctx.scale(s,s);ctx.translate(0,-278);
 ctx.fillStyle='rgba(0,0,0,.95)';ctx.beginPath();ctx.ellipse(-21,6,16,17,0,0,7);ctx.ellipse(21,6,16,17,0,0,7);ctx.fill();ctx.fillStyle='#ff3030';ctx.beginPath();ctx.arc(-21,8,3.5,0,7);ctx.arc(21,8,3.5,0,7);ctx.fill();ctx.fillStyle='#000';ctx.fillRect(-10,30,20,12)
 ctx.strokeStyle='rgba(170,20,30,.85)';ctx.lineWidth=2;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*12,46);ctx.quadraticCurveTo(sd*34,22,sd*46,-8);ctx.stroke()}ctx.restore()}
// khách chợ
function khach(x,y,s,o={}){const T=o.T||0;if(o.w)woman(x,y,s,Object.assign({shirt:o.c||'#3a6a8a',pants:'#22222a',skin:'#e8d4bc',smile:true},o));else person(x,y,s,Object.assign({shirt:o.c||'#8a6a3a',pants:'#2a2a2e',skin:'#d8c4a8'},o));
 if(o.bag){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const sd=o.w?-1:1;ctx.fillStyle='#e8e0d0';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(sd*52-18,-118,36,40,6);ctx.fill();ctx.stroke();circ(sd*52-6,-104,6,'#e8a020');circ(sd*52+6,-100,6,'#d02a2a');ctx.restore()}}
