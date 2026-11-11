let DRY=true;
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
function loi(x,y,s,o={}){const T=o.T||0;let armA=o.armA||[undefined,undefined];if(o.pot||o.jar)armA=[-0.08,0.08];if(o.knife)armA=[armA[0],-2.6];if(o.reach)armA=[undefined,-1.1];if(o.hug)armA=[-1.2,1.2];
 person(x,y,s,Object.assign({shirt:'#6a5238',pants:'#1e1e22',skin:o.pale?'#a8b2a6':'#d8c4a8',hair:'#151515'},o,{armA}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){for(let k=0;k<3;k++)circ(0,-190+k*26,3,'#d8d0b8')}
 if(o.bite){ctx.fillStyle='#9a0a12';ctx.fillRect(-3,-243,3,10+((T*15)%8))}
 if(o.tears){ctx.strokeStyle='rgba(170,210,240,.9)';ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*21,-262);ctx.lineTo(sd*22,-240+(T*20)%12);ctx.stroke()}}
 if(o.pot){potDraw(0,-100,0.55,T,{glow:o.glow||0.4,shoot:o.shoot});for(const sd of [-1,1]){const [hx,hy]=HPP(sd,sd*0.08);circ(hx,hy,9,'#d8c4a8',INK,3)}}
 if(o.jar){ctx.save();ctx.translate(0,-100);ctx.fillStyle='#5a3a22';ctx.strokeStyle=INK;ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(-14,-62);ctx.quadraticCurveTo(-40,-50,-36,-20);ctx.quadraticCurveTo(-32,4,-18,8);ctx.lineTo(18,8);ctx.quadraticCurveTo(32,4,36,-20);ctx.quadraticCurveTo(40,-50,14,-62);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#c8a24a';ctx.fillRect(-15,-68,30,8);ctx.fillStyle='#b8302a';ctx.fillRect(-7,-46,14,28);ctx.restore();for(const sd of [-1,1]){const [hx,hy]=HPP(sd,sd*0.08);circ(hx,hy,9,'#d8c4a8',INK,3)}}
 if(o.hoe){const a=o.hoe;ctx.save();ctx.translate(...HPP(1,armA[1]??-2.4));ctx.rotate(a);ctx.fillStyle='#6a4a28';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.fillRect(-5,-10,10,150);ctx.strokeRect(-5,-10,10,150);ctx.fillStyle='#8a9098';ctx.beginPath();ctx.moveTo(-6,130);ctx.lineTo(44,140);ctx.lineTo(40,160);ctx.lineTo(-6,150);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
 if(o.wet){ctx.fillStyle='rgba(150,190,220,.85)';for(let k=0;k<6;k++){const p=((T*1.3+k/6)%1);ctx.beginPath();ctx.ellipse(-40+k*16,-236+p*70,2.5,4,0,0,7);ctx.fill()}ctx.fillStyle='rgba(20,30,40,.25)';ctx.fillRect(-40,-222,80,110)}
 if(o.mud){ctx.fillStyle='rgba(70,48,26,.75)';for(let k=0;k<9;k++){ctx.beginPath();ctx.ellipse(-34+R0(k)*68,-220+R0(k+3)*120,6+R0(k+5)*9,4+R0(k+7)*7,R0(k)*3,0,7);ctx.fill()}}
 if(o.roots){const q=o.roots;for(const sd of [-1,1]){const [hx,hy]=HPP(sd,sd>0?0.95:-0.95);rootLine(sd*10,-140,hx+sd*14,hy-6,q,T,sd*3,5);rootLine(sd*-6,-140,hx,hy+10,q*0.9,T,sd*5+1,4);if(q>0.8)drip(hx,hy+10,T,sd)}}
 if(o.bandage){const sd=o.bandage;const a=armA[sd>0?1:0]??sd*0.1;const [hx,hy]=HPP(sd,a);ctx.fillStyle='#e8e0cc';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(hx,hy+4,17,22,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='rgba(150,10,18,.85)';ctx.beginPath();ctx.ellipse(hx+3,hy+10,10,12,0,0,7);ctx.fill();ctx.strokeStyle='rgba(120,100,80,.6)';ctx.lineWidth=2;for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(hx-16,hy-8+k*9);ctx.lineTo(hx+16,hy-4+k*9);ctx.stroke()}}
 if(o.knife){const [hx,hy]=HPP(1,-2.6);ctx.save();ctx.translate(hx,hy);ctx.rotate(-0.4);ctx.fillStyle='#3a2a1a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.fillRect(-6,-30,12,34);ctx.strokeRect(-6,-30,12,34);ctx.fillStyle='#c8ccd0';ctx.beginPath();ctx.moveTo(-8,-30);ctx.lineTo(10,-30);ctx.lineTo(16,-120);ctx.quadraticCurveTo(-4,-90,-8,-30);ctx.fill();ctx.stroke();if(o.glint)halo(10,-100,60,'255,255,255',0.5*o.glint);ctx.restore()}
 if(o.money){const [hx,hy]=HPP(1,armA[1]??-0.6);ctx.save();ctx.translate(hx,hy-10);ctx.rotate(0.3);for(let k=0;k<4;k++){ctx.fillStyle=['#3a8a6a','#c88a3a','#2a7a9a','#3a8a6a'][k];ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.save();ctx.rotate(k*0.18-0.3);ctx.fillRect(-12,-44,24,44);ctx.strokeRect(-12,-44,24,44);ctx.restore()}ctx.restore()}
 ctx.restore()}
// Thắm: áo bà ba tím, tóc dài cột sau. o.sick (tái, môi tím), o.point (chỉ tay), o.water (bình tưới)
function tham(x,y,s,o={}){const T=o.T||0;const arm=(o.arm||[undefined,undefined]).slice();if(o.point)arm[1]=-1.75;if(o.water)arm[0]=1.2;if(o.pot){arm[0]=-0.08;arm[1]=0.08}if(o.phone)arm[1]=3.32;if(o.ears){arm[0]=-3.32;arm[1]=3.32}if(o.cover)arm[1]=-1.35;if(o.carry)arm[1]=0.62;if(o.phoneLap){arm[0]=-0.25;arm[1]=0.25}if(o.reachDown!==undefined)arm[0]=o.reachDown;
 const skin=o.sick?'#d4d8cc':'#efdcc8';
 woman(x,y,s,Object.assign({shirt:o.tang?'#e8e4d8':'#7a4a72',pants:'#1c1a22',skin,smile:!!o.smileF},o,{arm,mouth:o.mouth,phone:undefined}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){ctx.strokeStyle=HAIR;ctx.lineWidth=14;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(48,-268);ctx.quadraticCurveTo(70,-210,56,-150);ctx.stroke()}
 else{ctx.strokeStyle=HAIR;ctx.lineWidth=18;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,-250);ctx.quadraticCurveTo(6,-200,0,-140);ctx.stroke()}
 if(o.sick&&!o.back){ctx.fillStyle='rgba(70,40,90,.35)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*21,-262,17,12,0,0,7);ctx.fill()}ctx.fillStyle='#6a4a7a';ctx.fillRect(-9,-246,18,4)}
 if(o.tears){ctx.strokeStyle='rgba(170,210,240,.9)';ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*20,-262);ctx.lineTo(sd*21,-240+(T*20)%12);ctx.stroke()}}
 if(o.walk!==undefined&&!o.sit){for(const sd of [-1,1]){const lift=Math.max(0,Math.sin(o.walk+(sd>0?Math.PI:0)))*12;ctx.fillStyle='#1a1418';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*22,2-lift,16,7,0,0,7);ctx.fill();ctx.stroke()}}
 if(o.earring){for(const sd of [-1,1]){circ(sd*56,-262,6,'#e8c040',INK,2)}}
 if(o.ankle){ctx.fillStyle='#e6c4a0';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.fillRect(-44,-34,40,32);ctx.strokeRect(-44,-34,40,32);ctx.fillStyle='rgba(30,12,30,.95)';for(let k=0;k<5;k++){ctx.beginPath();ctx.ellipse(-38+k*7,-18+Math.abs(k-2)*3,3,10,0.25,0,7);ctx.fill()}}
 if(o.grab){ctx.fillStyle='#8a9a8a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(-26,6,22,12,0,0,7);ctx.fill();ctx.stroke();for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(-40+k*9,-4,4,12,0,0,7);ctx.fill();ctx.stroke()}}
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
 if(!o.noTeeth){ctx.fillStyle='#d6d2c0';}else{ctx.fillStyle='rgba(0,0,0,0)';}for(let k=-4;k<=4;k++){ctx.beginPath();ctx.moveTo(k*7-3,30);ctx.lineTo(k*7+3,30);ctx.lineTo(k*7,40);ctx.fill();const yb=26+mh*0.95-Math.abs(k)*1.8;ctx.beginPath();ctx.moveTo(k*7-3,yb+6);ctx.lineTo(k*7+3,yb+6);ctx.lineTo(k*7,yb-4);ctx.fill()}
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

// ===== Gọi hồn: Út (cháu trai), bà nội (xác), bà ma =====
function ut(x,y,s,o={}){const T=o.T||0;let armA=(o.armA||[undefined,undefined]).slice();if(o.shirtUp!==undefined)armA[1]=-2.75+0.12*Math.sin(T*(o.wave?7:1.5));
 person(x,y,s,Object.assign({shirt:'#3a5a8a',pants:'#22242a',skin:'#dcc6a8',hair:'#121212'},o,{armA}));
 if(o.shirtUp!==undefined){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const [hx,hy]=HPP(1,armA[1]);const w=Math.sin(T*8)*10*(o.wave?1.6:0.6),w2=Math.sin(T*6+1)*14*(o.wave?1.6:0.6);
  ctx.fillStyle='#f2eee2';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(hx-8,hy);ctx.lineTo(hx+44,hy-4);ctx.quadraticCurveTo(hx+70+w,hy+30,hx+66+w2,hy+92);ctx.lineTo(hx+6+w2,hy+98);ctx.quadraticCurveTo(hx-4+w,hy+40,hx-8,hy);ctx.fill();ctx.stroke();
  ctx.fillStyle='#bdb6a4';for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(hx+26+w*0.4,hy+20+k*24,3,0,7);ctx.fill()}circ(hx,hy,9,'#dcc6a8',INK,3);ctx.restore()}
 if(o.tears){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle='rgba(170,210,240,.9)';ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*21,-262);ctx.lineTo(sd*22,-240+(T*20)%12);ctx.stroke()}ctx.restore()}}
function baNoi(x,y,s,o={}){woman(x,y,s,Object.assign({old:true,shirt:'#5a4a3e',pants:'#1c1a1e',skin:o.dead?'#b8c2b2':'#e2cdb4',smile:false},o))}
function baMa(x,fy,s,T,o={}){ctx.save();ctx.globalAlpha=o.a??0.95;halo(x,fy-280*s,240*s,'170,255,200',0.14);
 woman(x,fy,s,{old:true,shirt:'#3e3440',pants:'#16121a',skin:'#b4c4b0',creepy:true,grin:o.grin??0.15,eyes:1,t:T,arm:o.arm,look:o.look});
 ctx.translate(x,fy);ctx.scale(s,s);ctx.translate(0,-278);for(const sd of [-1,1]){halo(sd*20,6,26,'200,255,220',0.5);circ(sd*20,6,3,'#e8fff0')}
 if(o.mouth==='o'){ctx.fillStyle='#0a0406';ctx.beginPath();ctx.ellipse(0,30,9,12,0,0,7);ctx.fill()}ctx.restore()}

// ===== THẦN GIỮ CỦA =====
// lục lạc đồng nhỏ (vẽ tại tay)
function bellDraw(x,y,s,T,shake=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(Math.sin(T*14)*0.25*shake);ctx.strokeStyle='#8a1a1a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(0,-2);ctx.stroke();
 circ(0,8,11,'#c8a040',INK,3);ctx.fillStyle='#7a5a1a';ctx.fillRect(-9,9,18,3);circ(0,15,3,'#2a1a08');halo(0,8,26,'255,220,120',0.25);ctx.restore()}
// bé Na: 5 tuổi, tóc hai bím, áo bông hồng
function na(x,y,s,o={}){const T=o.T||0;const sc=s*0.62;const arm=(o.arm||[undefined,undefined]).slice();if(o.bell)arm[1]=-0.5;if(o.clutch){arm[0]=-0.25;arm[1]=0.25}
 woman(x,y,sc,Object.assign({shirt:'#c86a7a',pants:'#3a3048',skin:o.sick?'#c8d0c4':'#f0dcc8',smile:!!o.smileF},o,{arm,mouth:o.mouth}));
 ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);
 if(!o.back){for(const sd of [-1,1]){ctx.fillStyle=HAIR;ctx.beginPath();ctx.ellipse(sd*62,-252,16,30,sd*0.3,0,7);ctx.fill();circ(sd*58,-282,7,'#d03040')}}
 if(o.sick&&!o.back){ctx.fillStyle='rgba(70,40,90,.35)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*20,-262,15,10,0,0,7);ctx.fill()}}
 if(o.dirt){ctx.fillStyle='#3a2a18';ctx.beginPath();ctx.ellipse(0,-246,16,9,0,0,7);ctx.fill();for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(-10+k*7,-232+k*3,3,5,0,0,7);ctx.fill()}}
 if(o.bell){const [hx,hy]=HPW(1,arm[1]);bellDraw(hx,hy+12,1.3,T,o.bellShake??1);circ(hx,hy,8,o.sick?'#c8d0c4':'#f0dcc8',INK,3)}
 if(o.clutch){bellDraw(0,-112,1.4,T,0.2);for(const sd of [-1,1]){const [hx,hy]=HPW(sd,sd*0.25);circ(hx,hy,8,'#f0dcc8',INK,3)}}
 if(!o.back){for(const sd of [-1,1]){const lift=o.walk!==undefined?Math.max(0,Math.sin(o.walk+(sd>0?Math.PI:0)))*12:0;ctx.fillStyle='#c84050';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*(o.sit?26:22),3-lift,17,7,0,0,7);ctx.fill();ctx.stroke()}}
 if(o.covered){ctx.fillStyle='#efdcc8';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(6,-246,30,18,0.1,0,7);ctx.fill();ctx.stroke()}
 ctx.restore()}
// ma thần giữ của: thằng nhỏ trọc đầu chừa chỏm, da xám xanh, bùn đất, mắt hốc đen đồng tử đỏ (kiểu Ma Lai, mặt lộ rõ)
function boyGhost(x,fy,s,T,o={}){const sc=s*0.66;ctx.save();ctx.globalAlpha=o.a??0.96;halo(x,fy-280*sc,230*sc,'255,60,60',0.16);
 ctx.translate(x,fy);ctx.scale(sc,sc);
 const armR=o.reach?-1.3+0.15*Math.sin(T*2):0.12;
 // thân ở trần, gầy, xương sườn
 ctx.fillStyle='#8a9a8a';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-36,-222);ctx.lineTo(36,-222);ctx.lineTo(30,-110);ctx.lineTo(-30,-110);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.strokeStyle='rgba(40,50,40,.6)';ctx.lineWidth=2.5;for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(-26,-200+k*16);ctx.quadraticCurveTo(0,-192+k*16,26,-200+k*16);ctx.stroke()}
 ctx.fillStyle='#3a2a20';ctx.fillRect(-32,-112,64,40);ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.strokeRect(-32,-112,64,40);// quần cụt
 for(const sd of [-1,1]){ctx.save();ctx.translate(sd*16,-72);ctx.fillStyle='#8a9a8a';ctx.fillRect(-9,0,18,70);ctx.strokeRect(-9,0,18,70);ctx.restore()}
 for(const sd of [-1,1]){ctx.save();ctx.translate(sd*36,-214);ctx.rotate(sd>0?armR:-0.12);ctx.strokeStyle=INK;ctx.lineWidth=18;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,84);ctx.stroke();ctx.strokeStyle='#8a9a8a';ctx.lineWidth=11;ctx.stroke();circ(0,88,9,'#8a9a8a',INK,3);ctx.fillStyle='#2a1a10';ctx.fillRect(-7,90,14,5);ctx.restore()}
 ctx.fillStyle='rgba(60,42,24,.7)';for(let k=0;k<7;k++){ctx.beginPath();ctx.ellipse(-28+R0(k)*56,-210+R0(k+4)*120,5+R0(k+2)*7,4+R0(k+6)*5,0,0,7);ctx.fill()}
 ctx.translate(0,-272);ctx.rotate(o.tilt??Math.sin(T*0.6)*0.08);
 // đầu trọc + chỏm tóc
 circ(0,0,54,'#a8b8a8',INK,4);ctx.fillStyle='#0c0c0c';ctx.beginPath();ctx.ellipse(0,-50,14,10,0,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-4,-56);ctx.quadraticCurveTo(-18,-80,-8,-88);ctx.quadraticCurveTo(4,-74,6,-56);ctx.fill();
 ctx.strokeStyle='rgba(185,20,30,.8)';ctx.lineWidth=1.8;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*10,44);ctx.quadraticCurveTo(sd*30,24,sd*44,-4);ctx.stroke()}
 for(const sd of [-1,1]){ctx.fillStyle='#030303';ctx.beginPath();ctx.ellipse(sd*20,6,14,17,sd*0.15,0,7);ctx.fill();halo(sd*20+(o.look||0)*4,8,13,'255,60,40',0.7);circ(sd*20+(o.look||0)*4,8,3.2,'#ff3020');
  ctx.fillStyle='#4a0a0e';const len=10+((T*16+sd*7)%22);ctx.fillRect(sd*20-2,20,4,len)}
 if(o.mouth==='o'){ctx.fillStyle='#120404';ctx.beginPath();ctx.ellipse(0,30,11,14,0,0,7);ctx.fill()}else{ctx.fillStyle='#120404';ctx.beginPath();ctx.moveTo(-18,28);ctx.quadraticCurveTo(0,40,18,28);ctx.quadraticCurveTo(0,34,-18,28);ctx.fill()}
 ctx.restore()}
// ===== tạo hình RIÊNG cho Thần giữ của (khác vợ chồng Lợi–Thắm, thầy Bảy) =====
// Lành: người làm thuê, da sạm, tóc cắt ngắn, ria mép, áo thun xanh rêu xắn tay, khăn rằn quấn cổ
function khanRan(x,y,w,h){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();for(let i=0;i<w/8;i++)for(let j=0;j<h/8;j++){ctx.fillStyle=(i+j)%2?'#1a1a1a':'#e8e4d8';ctx.fillRect(x+i*8,y+j*8,8,8)}ctx.restore();ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.strokeRect(x,y,w,h)}
function lanh(x,y,s,o={}){const T=o.T||0;let armA=(o.armA||[undefined,undefined]).slice();if(o.jar)armA=[-0.08,0.08];if(o.reach)armA=[undefined,-1.1];
 person(x,y,s,Object.assign({shirt:'#4a3a2a',pants:'#22201c',skin:'#c8946a',hair:'#141414'},o,{armA}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){ctx.fillStyle='#141414';ctx.beginPath();ctx.moveTo(-18,-252);ctx.quadraticCurveTo(0,-258,18,-252);ctx.quadraticCurveTo(10,-246,0,-248);ctx.quadraticCurveTo(-10,-246,-18,-252);ctx.fill();}
 if(o.hoe){const a=o.hoe;ctx.save();ctx.translate(...HPP(1,armA[1]??-2.4));ctx.rotate(a);ctx.fillStyle='#6a4a28';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.fillRect(-5,-10,10,150);ctx.strokeRect(-5,-10,10,150);ctx.fillStyle='#8a9098';ctx.beginPath();ctx.moveTo(-6,130);ctx.lineTo(44,140);ctx.lineTo(40,160);ctx.lineTo(-6,150);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
 if(o.jar){ctx.save();ctx.translate(0,-100);ctx.fillStyle='#5a3a22';ctx.strokeStyle=INK;ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(-14,-62);ctx.quadraticCurveTo(-40,-50,-36,-20);ctx.quadraticCurveTo(-32,4,-18,8);ctx.lineTo(18,8);ctx.quadraticCurveTo(32,4,36,-20);ctx.quadraticCurveTo(40,-50,14,-62);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#c8a24a';ctx.fillRect(-15,-68,30,8);ctx.fillStyle='#b8302a';ctx.fillRect(-7,-46,14,28);ctx.restore();for(const sd of [-1,1]){const [hx,hy]=HPP(sd,sd*0.08);circ(hx,hy,9,'#c8946a',INK,3)}}
 if(o.tears){ctx.strokeStyle='rgba(170,210,240,.9)';ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*21,-262);ctx.lineTo(sd*22,-240+(T*20)%12);ctx.stroke()}}
 ctx.restore()}
// Mận: áo bà ba xanh dương, khăn rằn đỏ quấn đầu kiểu miền Tây, tóc dài thắt bím một bên
function man(x,y,s,o={}){const T=o.T||0;const arm=(o.arm||[undefined,undefined]).slice();if(o.ears){arm[0]=-3.32;arm[1]=3.32}if(o.cover)arm[1]=-1.35;if(o.carry)arm[1]=0.62;
 woman(x,y,s,Object.assign({shirt:'#7a5236',pants:'#1c1c24',skin:'#e6c4a0',smile:false},o,{arm,mouth:o.mouth}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){for(let k=0;k<4;k++)circ(0,-200+k*22,3,'#e8dcc8')}
 if(o.carry){const T2=T;na(36,-96,1.0,{sit:true,sick:o.carrySick,eyes:o.carryEyes??0.6,look:-1,T:T2,arm:[0.4,undefined]});ctx.save();ctx.translate(38,-210);ctx.rotate(0.62);ctx.strokeStyle=INK;ctx.lineWidth=22;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,90);ctx.stroke();ctx.strokeStyle='#7a5236';ctx.lineWidth=15;ctx.stroke();ctx.restore();const hx=38-92*Math.sin(0.62),hy=-210+92*Math.cos(0.62);circ(hx,hy,9,'#e6c4a0',INK,3)}
 if(!o.sit&&o.walk===undefined){for(const sd of [-1,1]){ctx.fillStyle='#2a2018';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*22,4,17,7,0,0,7);ctx.fill();ctx.stroke()}}
 if(o.sit){for(const sd of [-1,1]){ctx.fillStyle='#2a2018';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*25+4,2,17,7,0,0,7);ctx.fill();ctx.stroke()}}
 if(o.tears){ctx.strokeStyle='rgba(170,210,240,.9)';ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*20,-262);ctx.lineTo(sd*21,-240+(T*20)%12);ctx.stroke()}}
 if(o.earring){for(const sd of [-1,1])circ(sd*56,-262,6,'#e8c040',INK,2)}
 if(o.ankle){ctx.fillStyle='#e6c4a0';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.fillRect(-44,-34,40,32);ctx.strokeRect(-44,-34,40,32);ctx.fillStyle='rgba(30,12,30,.95)';for(let k=0;k<5;k++){ctx.beginPath();ctx.ellipse(-38+k*7,-18+Math.abs(k-2)*3,3,10,0.25,0,7);ctx.fill()}}
 if(o.grab){ctx.fillStyle='#8a9a8a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(-26,6,22,12,0,0,7);ctx.fill();ctx.stroke();for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(-40+k*9,-4,4,12,0,0,7);ctx.fill();ctx.stroke()}}
 if(o.walk!==undefined&&!o.sit){for(const sd of [-1,1]){const lift=Math.max(0,Math.sin(o.walk+(sd>0?Math.PI:0)))*12;ctx.fillStyle='#1a1418';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*22,2-lift,16,7,0,0,7);ctx.fill();ctx.stroke()}}
 ctx.restore()}
// thầy Tư: gầy, áo dài đen, khăn đóng đen, râu dê đen điểm bạc, dải vải đỏ + lá bùa vàng trước ngực
function thayTu(x,y,s,o={}){const T=o.T||0;const armA=(o.armA||[undefined,undefined]).slice();
 person(x,y,s,Object.assign({shirt:'#22222a',pants:'#141418',skin:'#a8845e',hair:'#9a968e'},o,{armA}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){ctx.save();ctx.translate(0,-278);ctx.fillStyle='#b8946e';ctx.beginPath();ctx.arc(0,0,57,Math.PI*1.12,Math.PI*1.88);ctx.lineTo(40,-22);ctx.lineTo(-40,-22);ctx.closePath();ctx.fill();ctx.fillStyle='#d8d4cc';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*50,-10,10,22,sd*0.3,0,7);ctx.fill()}ctx.strokeStyle='rgba(90,60,40,.5)';ctx.lineWidth=2;for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(-22,-30+k*6);ctx.quadraticCurveTo(0,-34+k*6,22,-30+k*6);ctx.stroke()}ctx.restore();
  ctx.fillStyle='#2a2626';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-9,-224);ctx.quadraticCurveTo(-5,-200,1,-184);ctx.quadraticCurveTo(7,-200,10,-224);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='rgba(60,40,30,.35)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*36,-258,10,16,0,0,7);ctx.fill()}
  for(let k=0;k<11;k++){const a2=0.25+k*0.24;circ(Math.cos(a2)*34,-206+Math.sin(a2)*30,4.5,'#7a4a20',INK,1.5)}
  ctx.fillStyle='#8a2a1a';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-10,-170);ctx.lineTo(10,-170);ctx.lineTo(8,-146);ctx.lineTo(-8,-146);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#e8c23a';ctx.fillRect(-5,-164,10,12)}
 ctx.restore()}

// ===== BÙ NHÌN MẶC ÁO NGƯỜI — tạo hình riêng =====
// bà ba: thân áo có hàng nút + 2 túi (vẽ chồng lên thân áo của person/woman)
function babaDeco(sd0,col='#e8dcc8'){for(let k=0;k<5;k++)circ(0,-208+k*20,3,col);ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=2.5;for(const sd of [-1,1]){ctx.strokeRect(sd*24-10,-150,20,16)}}
function strawTuft(x,y,ang,len,n=7,T=0,col='#d8b860'){ctx.save();ctx.translate(x,y);ctx.rotate(ang);for(let k=0;k<n;k++){const a=(k-(n-1)/2)*0.16+Math.sin(T*2+k)*0.04;ctx.strokeStyle=k%2?col:'#b8963c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.sin(a)*len*(0.7+R0(k+x)*0.4),Math.cos(a)*len*(0.7+R0(k+y)*0.4));ctx.stroke()}ctx.restore()}
// Tâm: trai làm ruộng, tóc húi cua, mày rậm, áo bà ba xám tro, quần đen xắn ống
function tam(x,y,s,o={}){const T=o.T||0;let armA=(o.armA||[undefined,undefined]).slice();if(o.reach)armA=[undefined,-1.15];if(o.bundle)armA=[-0.08,0.08];
 const skin=o.pale?'#c2b8a0':'#c99a72';
 person(x,y,s,Object.assign({shirt:'#6b707a',pants:'#1c1c20',skin,hair:'#121212'},o,{armA}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){babaDeco();ctx.fillStyle='#121212';for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*8,-298);ctx.quadraticCurveTo(sd*21,-306,sd*34,-298);ctx.lineTo(sd*34,-293);ctx.quadraticCurveTo(sd*21,-299,sd*8,-293);ctx.fill()}
  for(const sd of [-1,1]){ctx.fillStyle=skin;ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.fillRect(sd*16-11,-6,22,10);ctx.strokeRect(sd*16-11,-6,22,10)}}
 if(o.pale&&!o.back){ctx.fillStyle='rgba(60,50,30,.3)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*21,-262,17,12,0,0,7);ctx.fill()}ctx.strokeStyle='rgba(90,70,40,.5)';ctx.lineWidth=1.5;for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(-40+k*24,-300);ctx.lineTo(-34+k*24,-280);ctx.stroke()}}
 if(o.straw){strawTuft(-22,-226,2.6,26,6,T);strawTuft(22,-226,-2.6,26,6,T);if(o.straw>1){strawTuft(-46,-130,0.3,22,5,T);strawTuft(46,-130,-0.3,22,5,T)}}
 if(o.vomit){strawTuft(0,-244,0,60,9,T);}
 if(o.covered){ctx.fillStyle='#e2c4a2';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(4,-244,32,18,0.1,0,7);ctx.fill();ctx.stroke()}
 if(o.bundle){ctx.fillStyle='#8a7a5a';ctx.strokeStyle=INK;ctx.lineWidth=3.5;ctx.beginPath();ctx.ellipse(0,-120,52,34,0,0,7);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-10,-152);ctx.lineTo(10,-152);ctx.lineTo(0,-170);ctx.closePath();ctx.fill();ctx.stroke();for(const sd of [-1,1]){const [hx,hy]=HPP(sd,sd*0.08);circ(hx,hy,9,skin,INK,3)}}
 if(o.shirtIn){const [hx,hy]=HPP(1,armA[1]??-1.15);ctx.save();ctx.translate(hx,hy);ctx.fillStyle='#6b707a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(40,-6);ctx.lineTo(46,60);ctx.lineTo(4,64);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
 ctx.restore()}
// Hạnh: tóc dài thả, mái ngang, áo bà ba xanh rêu đậm, quần đen
const HANH_SHIRT='#2f5f58';
function hanh(x,y,s,o={}){const T=o.T||0;const arm=(o.arm||[undefined,undefined]).slice();if(o.lamp)arm[1]=-0.55;if(o.cover)arm[1]=-1.35;if(o.unbutton){arm[0]=-0.75;arm[1]=0.75}if(o.comb)arm[1]=-0.95;if(o.shirtHold){arm[0]=-1.0;arm[1]=1.0}if(o.bundle){arm[0]=-0.08;arm[1]=0.08}
 const skin=o.pale?'#d8d0c0':'#ecd0b2';
 woman(x,y,s,Object.assign({shirt:HANH_SHIRT,pants:'#18181e',skin,smile:false},o,{arm,mouth:o.mouth}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){babaDeco();ctx.fillStyle=HAIR;ctx.beginPath();ctx.moveTo(-50,-300);ctx.quadraticCurveTo(0,-318,50,-300);ctx.lineTo(48,-288);ctx.quadraticCurveTo(0,-300,-48,-288);ctx.closePath();ctx.fill()}
 if(!o.sit){for(const sd of [-1,1]){const lift=o.walk!==undefined?Math.max(0,Math.sin(o.walk+(sd>0?Math.PI:0)))*12:0;ctx.fillStyle='#2a2018';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*22,4-lift,17,7,0,0,7);ctx.fill();ctx.stroke()}}
 else{for(const sd of [-1,1]){ctx.fillStyle='#2a2018';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*25+4,2,17,7,0,0,7);ctx.fill();ctx.stroke()}}
 if(o.tears){ctx.strokeStyle='rgba(170,210,240,.9)';ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*20,-262);ctx.lineTo(sd*21,-240+(T*20)%12);ctx.stroke()}}
 if(o.lamp){const [hx,hy]=HPW(1,-0.55);lamp(hx+4,hy+46,0.9,T);circ(hx,hy,8,skin,INK,3)}
 if(o.comb){const [hx,hy]=HPW(1,-0.95);ctx.save();ctx.translate(hx+4,hy-6);ctx.rotate(-0.3);ctx.fillStyle='#3a2a1a';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.fillRect(-22,-8,44,10);ctx.strokeRect(-22,-8,44,10);for(let k=0;k<10;k++)ctx.fillRect(-20+k*4.4,2,2.5,14);ctx.restore();circ(hx,hy,8,skin,INK,3)}
 if(o.shirtHold){ctx.save();ctx.translate(0,-150);ctx.fillStyle='#6b707a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-70,-20);ctx.lineTo(70,-20);ctx.lineTo(60,70);ctx.lineTo(-60,70);ctx.closePath();ctx.fill();ctx.stroke();strawTuft(-60,70,0.2,24,5,T);ctx.restore()}
 if(o.bundle){ctx.fillStyle='#6a5a7a';ctx.strokeStyle=INK;ctx.lineWidth=3.5;ctx.beginPath();ctx.ellipse(0,-118,46,30,0,0,7);ctx.fill();ctx.stroke();for(const sd of [-1,1]){const [hx,hy]=HPW(sd,sd*0.08);circ(hx,hy,8,skin,INK,3)}}
 ctx.restore()}
// bà Chín: bà già nhỏ thó, tóc bạc cắt ngắn ngang gáy, nếp nhăn, môi đỏ trầu, áo bà ba đen, gậy tre
function baChin(x,y,s,o={}){const T=o.T||0;const arm=(o.arm||[undefined,undefined]).slice();if(arm[0]===undefined)arm[0]=-0.42;if(o.point)arm[1]=-1.6;
 woman(x,y,s,Object.assign({old:true,shirt:'#26242a',pants:'#141418',skin:'#d6b896',smile:false},o,{arm}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 const hy=-278;if(!o.back){ctx.save();ctx.globalCompositeOperation='destination-out';ctx.fillRect(-34,hy-56-44,68,42);ctx.restore();
  ctx.fillStyle='#c8c6c0';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,hy,60,Math.PI*1.0,Math.PI*2.0);ctx.lineTo(60,hy+30);ctx.quadraticCurveTo(52,hy+6,46,hy-8);ctx.quadraticCurveTo(0,hy-26,-46,hy-8);ctx.quadraticCurveTo(-52,hy+6,-60,hy+30);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle='rgba(80,50,30,.55)';ctx.lineWidth=2;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*36,hy+20);ctx.quadraticCurveTo(sd*40,hy+32,sd*34,hy+42);ctx.stroke();ctx.beginPath();ctx.moveTo(sd*30,hy+2);ctx.lineTo(sd*42,hy-2);ctx.stroke()}
  ctx.beginPath();ctx.moveTo(-18,hy-30);ctx.quadraticCurveTo(0,hy-34,18,hy-30);ctx.stroke();
  ctx.fillStyle='#8a1a1e';ctx.fillRect(-9,hy+30,18,5);babaDeco(0,'#9a9690')}
 for(const sd of [-1,1]){ctx.fillStyle='#2a2018';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*22,4,16,7,0,0,7);ctx.fill();ctx.stroke()}
 {const [hx,hy2]=HPW(-1,arm[0]);ctx.strokeStyle='#8a7a3a';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(hx,hy2-20);ctx.lineTo(hx-18,4);ctx.stroke();ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.stroke();circ(hx,hy2,8,'#d6b896',INK,3)}
 ctx.restore()}
// BÙ NHÌN: cọc tre chữ thập, áo bà ba căng trên đòn ngang, rơm lòi cổ/tay, đầu bao bố khâu chỉ, nón lá rách
// o.shirt màu áo (null = trần, chỉ rơm); o.face 'sack' | 'tam' ; o.eyes2 (mắt đỏ phát sáng); o.bulge (áo phồng như có người bên trong); o.open (áo mở, thấy da người); o.turn (xoay đầu)
function scarecrow(x,y,s,T,o={}){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.lineJoin='round';
 if(o.glow)halo(0,-280,260,'255,40,40',0.12*o.glow);
 // cọc
 ctx.fillStyle='#6a5a3a';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.fillRect(-8,-250,16,250);ctx.strokeRect(-8,-250,16,250);
 const sw=Math.sin(T*0.9)*0.03;ctx.rotate(sw);
 // đòn ngang
 ctx.fillRect(-170,-224,340,12);ctx.strokeRect(-170,-224,340,12);
 // rơm ở hai đầu tay + chân áo
 for(const sd of [-1,1])strawTuft(sd*150,-212,sd*-1.35,44,8,T);
 strawTuft(-30,-104,0.15,40,6,T);strawTuft(30,-104,-0.15,40,6,T);strawTuft(0,-104,0,46,7,T);
 const sh=o.shirt;
 if(sh){const b=o.bulge?14:0;
  // tay áo dang ngang
  for(const sd of [-1,1]){ctx.fillStyle=sh;ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(sd*36,-236-b*0.3);ctx.lineTo(sd*148,-232);ctx.lineTo(sd*150,-196);ctx.lineTo(sd*40,-186);ctx.closePath();ctx.fill();ctx.stroke()}
  // thân áo (rách nếu o.torn)
  ctx.beginPath();ctx.moveTo(-42-b,-238);ctx.lineTo(42+b,-238);ctx.quadraticCurveTo(50+b*1.6,-170,46+b,-104);ctx.lineTo(-46-b,-104);ctx.quadraticCurveTo(-50-b*1.6,-170,-42-b,-238);ctx.closePath();ctx.fillStyle=sh;ctx.fill();ctx.stroke();
  if(o.open){ctx.fillStyle='#c8a888';ctx.beginPath();ctx.moveTo(-6,-236);ctx.lineTo(6,-236);ctx.quadraticCurveTo(22,-170,14,-106);ctx.lineTo(-14,-106);ctx.quadraticCurveTo(-22,-170,-6,-236);ctx.fill();ctx.strokeStyle='rgba(90,40,30,.6)';ctx.lineWidth=2;for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(-10,-210+k*26);ctx.quadraticCurveTo(0,-204+k*26,10,-210+k*26);ctx.stroke()}strawTuft(-12,-150,-1.8,28,5,T);strawTuft(12,-180,1.8,26,5,T)}
  else for(let k=0;k<5;k++)circ(0,-222+k*24,3.5,'#d8ccb4');
  if(o.torn){ctx.fillStyle='rgba(20,14,8,.85)';for(let k=0;k<5;k++){ctx.beginPath();ctx.ellipse(-30+R0(k)*60,-220+R0(k+2)*100,6+R0(k+4)*9,4+R0(k+6)*8,R0(k)*3,0,7);ctx.fill()}}
  strawTuft(0,-238,Math.PI,22,7,T)}
 else{ctx.fillStyle='#c8a850';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-170,40,70,0,0,7);ctx.fill();ctx.stroke();for(let k=0;k<6;k++)strawTuft(-30+k*12,-120,0.1*(k-3),30,4,T)}
 // đầu
 ctx.save();ctx.translate(0,-288);ctx.rotate(o.turn??0);
 if(o.face==='tam'){circ(0,0,54,'#b8b098',INK,4);ctx.fillStyle='#121212';ctx.beginPath();ctx.arc(0,0,56,Math.PI*1.03,Math.PI*1.97);ctx.lineTo(48,-18);ctx.lineTo(-48,-18);ctx.closePath();ctx.fill();
  for(const sd of [-1,1]){ctx.fillStyle='#050505';ctx.beginPath();ctx.ellipse(sd*20,6,14,15,0,0,7);ctx.fill();strawTuft(sd*20,6,sd*-2.2,26,6,T);strawTuft(sd*20,8,sd*-0.9,20,5,T)}
  ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-14,32);ctx.quadraticCurveTo(0,38,14,32);ctx.stroke();strawTuft(0,34,0,24,5,T);
  ctx.fillStyle='rgba(60,50,30,.35)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*34,26,10,16,0,0,7);ctx.fill()}}
 else{circ(0,0,54,'#b09868',INK,4);ctx.strokeStyle='rgba(70,50,20,.5)';ctx.lineWidth=1.5;for(let k=-4;k<=4;k++){ctx.beginPath();ctx.moveTo(k*12,-50);ctx.lineTo(k*12,50);ctx.stroke();ctx.beginPath();ctx.moveTo(-50,k*12);ctx.lineTo(50,k*12);ctx.stroke()}
  ctx.strokeStyle=INK;ctx.lineWidth=4;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*20-9,-3);ctx.lineTo(sd*20+9,15);ctx.moveTo(sd*20+9,-3);ctx.lineTo(sd*20-9,15);ctx.stroke()}
  if(o.eyes2){for(const sd of [-1,1]){halo(sd*20,6,30,'255,40,30',0.8*o.eyes2);circ(sd*20,6,5,'#ff3020')}}
  ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-22,30);for(let k=0;k<=6;k++){ctx.lineTo(-22+k*7.3,30+(k%2?6:-2)+(o.grin?k*(6-k)*1.2:0))}ctx.stroke();
  ctx.fillStyle='#8a7040';ctx.fillRect(-40,46,80,10);strawTuft(-30,54,0.3,20,4,T);strawTuft(30,54,-0.3,20,4,T)}
 // nón lá rách
 ctx.fillStyle='#c8b070';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-96,-24);ctx.lineTo(0,-104);ctx.lineTo(96,-24);ctx.quadraticCurveTo(0,-12,-96,-24);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.strokeStyle='rgba(90,70,30,.6)';ctx.lineWidth=2;for(let k=1;k<5;k++){ctx.beginPath();ctx.moveTo(-96+k*19,-24-k*16+2);ctx.lineTo(96-k*19,-24-k*16+2);ctx.stroke()}
 ctx.fillStyle='#14100a';ctx.beginPath();ctx.moveTo(40,-48);ctx.lineTo(62,-34);ctx.lineTo(48,-30);ctx.closePath();ctx.fill();
 ctx.restore();ctx.restore()}
// đống rơm mục (bù nhìn đổ sụp)
function strawPile(x,y,s,T){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#8a7440';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,-30,150,34,0,0,7);ctx.fill();ctx.stroke();for(let k=0;k<14;k++)strawTuft(-130+k*20,-40,(R0(k)-0.5)*2.4,40,5,T,'#a8904a');
 ctx.fillStyle='#b8a060';ctx.beginPath();ctx.moveTo(40,-50);ctx.lineTo(110,-110);ctx.lineTo(170,-56);ctx.quadraticCurveTo(110,-44,40,-50);ctx.fill();ctx.stroke();ctx.restore()}

// ===== NGƯỜI CHỦ CŨ — tạo hình riêng =====
// Phúc: thợ hồ, tóc rẽ ngôi, râu lún phún, áo bà ba xanh chàm đậm. o.bowl bưng chén trước ngực; o.sleep mộng du (mắt lờ đờ, tái)
function phuc(x,y,s,o={}){const T=o.T||0;let armA=(o.armA||[undefined,undefined]).slice();if(o.bowl)armA=[-0.62,0.62];if(o.lamp)armA[1]=-0.55;
 const skin=o.sleep?'#b8b4a0':'#c8986e';
 person(x,y,s,Object.assign({shirt:'#2c3a5a',pants:'#18181c',skin,hair:'#101010',eyes:o.sleep?0.32:o.eyes},o,{armA,eyes:o.sleep?0.32:o.eyes}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){babaDeco();ctx.fillStyle='#101010';ctx.beginPath();ctx.moveTo(-58,-300);ctx.quadraticCurveTo(-20,-345,30,-336);ctx.lineTo(10,-318);ctx.quadraticCurveTo(-20,-320,-58,-300);ctx.fill();
  ctx.fillStyle='rgba(20,20,20,.45)';for(let k=0;k<26;k++){ctx.beginPath();ctx.arc(-26+R0(k)*52,-250+R0(k+9)*26,1.6,0,7);ctx.fill()}
  for(const sd of [-1,1]){ctx.fillStyle=skin;ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.fillRect(sd*16-11,-6,22,10);ctx.strokeRect(sd*16-11,-6,22,10)}}
 if(o.sleep&&!o.back){ctx.fillStyle='rgba(60,50,70,.35)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*21,-262,18,12,0,0,7);ctx.fill()}}
 if(o.bowl){ctx.save();ctx.translate(0,-160);ctx.fillStyle='#e8e4d8';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-30,0);ctx.quadraticCurveTo(0,40,30,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle=o.maggot?'#d8d0a8':'#f6f4ec';ctx.beginPath();ctx.ellipse(0,0,30,9,0,Math.PI,0);ctx.fill();if(o.maggot){ctx.fillStyle='#efe6c8';for(let k=0;k<6;k++){ctx.beginPath();ctx.ellipse(-20+k*8,-4+Math.sin(T*6+k)*2,4,2,Math.sin(T*3+k),0,7);ctx.fill()}}ctx.restore();for(const sd of [-1,1]){const [hx,hy]=HPP(sd,sd*0.62);circ(hx,hy,9,skin,INK,3)}}
 if(o.lamp){const [hx,hy]=HPP(1,-0.55);lamp(hx+4,hy+46,0.9,T);circ(hx,hy,9,skin,INK,3)}
 if(o.mutter&&!o.back){if(Math.sin(T*9)>0){ctx.fillStyle='#2a1a1a';ctx.beginPath();ctx.ellipse(0,-244,5,4,0,0,7);ctx.fill()}}
 ctx.restore()}
// Liên: tóc dài rẽ ngôi lệch, kẹp sau tai, áo bà ba vàng nghệ sẫm. o.paper giấy mua bán; o.lamp; o.grab giật chén (tay vươn)
function lien(x,y,s,o={}){const T=o.T||0;const arm=(o.arm||[undefined,undefined]).slice();if(o.lamp)arm[1]=-0.55;if(o.paper){arm[0]=-0.55;arm[1]=0.55}if(o.grab)arm[1]=-1.5;if(o.pull)arm[0]=1.3;if(o.cover)arm[1]=-2.9;if(o.beg){arm[0]=-1.2;arm[1]=1.2}
 const skin=o.pale?'#dcd2c2':'#e8c8a4';
 woman(x,y,s,Object.assign({shirt:'#8a6420',pants:'#18181e',skin,smile:false},o,{arm,mouth:o.mouth}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){babaDeco();ctx.fillStyle=HAIR;ctx.beginPath();ctx.moveTo(-56,-284);ctx.quadraticCurveTo(-30,-344,40,-326);ctx.quadraticCurveTo(-4,-318,-30,-282);ctx.closePath();ctx.fill();circ(44,-300,5,'#c83a3a')}
 if(!o.sit){for(const sd of [-1,1]){const lift=o.walk!==undefined?Math.max(0,Math.sin(o.walk+(sd>0?Math.PI:0)))*12:0;ctx.fillStyle='#2a2018';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*22,4-lift,17,7,0,0,7);ctx.fill();ctx.stroke()}}
 else{for(const sd of [-1,1]){ctx.fillStyle='#2a2018';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*25+4,2,17,7,0,0,7);ctx.fill();ctx.stroke()}}
 if(o.tears){ctx.strokeStyle='rgba(170,210,240,.9)';ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*20,-262);ctx.lineTo(sd*21,-240+(T*20)%12);ctx.stroke()}}
 if(o.lamp){const [hx,hy]=HPW(1,-0.55);lamp(hx+4,hy+46,0.9,T);circ(hx,hy,8,skin,INK,3)}
 if(o.paper){ctx.save();ctx.translate(0,-150);ctx.rotate(-0.05);ctx.fillStyle='#ece4cc';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.fillRect(-40,-34,80,60);ctx.strokeRect(-40,-34,80,60);ctx.strokeStyle='rgba(40,40,60,.6)';ctx.lineWidth=2;for(let k=0;k<5;k++){ctx.beginPath();ctx.moveTo(-32,-24+k*10);ctx.lineTo(28-(k%2)*14,-24+k*10);ctx.stroke()}ctx.fillStyle='#b8302a';ctx.beginPath();ctx.arc(22,16,7,0,7);ctx.fill();ctx.restore();for(const sd of [-1,1]){const [hx,hy]=HPW(sd,sd*0.55);circ(hx,hy,8,skin,INK,3)}}
 if(o.cover&&!o.back){circ(10,-262,12,skin,INK,3)}
 ctx.restore()}
// bà Bảy: bà già mập, tóc bạc xoăn ngắn, kính tròn, áo bà ba nâu đỏ, nhai trầu
function baBay(x,y,s,o={}){const T=o.T||0;const arm=(o.arm||[undefined,undefined]).slice();if(o.point)arm[1]=-1.6;
 woman(x,y,s,Object.assign({old:true,shirt:'#6a3a34',pants:'#1a1618',skin:'#dcb894',smile:false},o,{arm}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 const hy=-278;if(!o.back){ctx.save();ctx.globalCompositeOperation='destination-out';ctx.fillRect(-34,hy-100,68,42);ctx.restore();
  ctx.fillStyle='#d0cec8';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,hy,59,Math.PI*1.0,Math.PI*2.0);ctx.lineTo(56,hy+14);ctx.quadraticCurveTo(0,hy-30,-56,hy+14);ctx.closePath();ctx.fill();ctx.stroke();for(let k=0;k<7;k++)circ(-42+k*14,hy-46+Math.abs(k-3)*4,7,'#d8d6d0')
  ctx.strokeStyle=INK;ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.arc(sd*20,hy+6,17,0,7);ctx.stroke()}ctx.beginPath();ctx.moveTo(-3,hy+6);ctx.lineTo(3,hy+6);ctx.stroke();
  ctx.fillStyle='#8a1a1e';ctx.beginPath();ctx.ellipse(0,hy+33,8,4+(Math.sin(T*5)>0?2:0),0,0,7);ctx.fill();
  ctx.fillStyle='rgba(210,110,100,.3)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*34,hy+24,10,6,0,0,7);ctx.fill()}babaDeco(0,'#c8b8a0')}
 ctx.fillStyle='#6a3a34';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-52,-200);ctx.quadraticCurveTo(-64,-150,-52,-108);ctx.lineTo(-44,-108);ctx.lineTo(-42,-200);ctx.fill();ctx.beginPath();ctx.moveTo(52,-200);ctx.quadraticCurveTo(64,-150,52,-108);ctx.lineTo(44,-108);ctx.lineTo(42,-200);ctx.fill();
 for(const sd of [-1,1]){ctx.fillStyle='#2a2018';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*22,4,17,7,0,0,7);ctx.fill();ctx.stroke()}
 ctx.restore()}
// ông Tư: hốc hác, tóc muối tiêu rối, râu lởm chởm bạc, quầng mắt thâm, áo bà ba đen bạc màu. o.shake run rẩy; o.kneel; o.dead gục, miệng đầy gạo
function ongTu(x,y,s,o={}){const T=o.T||0;let armA=(o.armA||[undefined,undefined]).slice();if(o.beg)armA=[-0.55,0.55];
 const sh=o.shake?Math.sin(T*40)*2:0;
 person(x+sh,y,s,Object.assign({shirt:'#2a2a2e',pants:'#141416',skin:o.dead?'#a8aa9c':'#bfa080',hair:'#5e5e5a',tilt:o.dead?0.5:undefined,eyes:o.dead?0.05:o.eyes},o,{armA,eyes:o.dead?0.05:o.eyes,tilt:o.dead?0.5:o.tilt}));ctx.save();ctx.translate(x+sh,y);ctx.scale(s,s);
 if(!o.back){ctx.save();ctx.translate(0,-278);ctx.rotate(o.dead?0.5:(o.tilt||0));
  
  ctx.fillStyle='rgba(50,40,50,.45)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*21,22,16,8,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(sd*40,26,8,16,0,0,7);ctx.fill()}
  ctx.fillStyle='rgba(200,200,190,.8)';for(let k=0;k<30;k++){ctx.beginPath();ctx.arc(-28+R0(k)*56,30+R0(k+7)*24,1.5,0,7);ctx.fill()}
  if(o.dead){ctx.fillStyle='#f0ead8';ctx.beginPath();ctx.ellipse(0,36,16,10,0,0,7);ctx.fill();for(let k=0;k<14;k++){ctx.beginPath();ctx.ellipse(-20+R0(k)*40,40+R0(k+4)*30,3,1.8,R0(k)*3,0,7);ctx.fill()}}
  ctx.restore()
  for(const sd of [-1,1]){ctx.fillStyle='#bfa080';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.fillRect(sd*16-11,-6,22,10);ctx.strokeRect(sd*16-11,-6,22,10)}}
 if(o.tears&&!o.back){ctx.strokeStyle='rgba(170,210,240,.9)';ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*21,-262);ctx.lineTo(sd*22,-240+(T*20)%12);ctx.stroke()}}
 if(o.potHug){ctx.fillStyle='#1a1a1a';ctx.strokeStyle='#555';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-130,46,34,0,0,7);ctx.fill();ctx.stroke()}
 ctx.restore()}
// ma bà Sáu: ốm trơ xương, tóc bạc dài xõa, mắt trắng dã, má hóp, miệng nhai; áo bà ba trắng ngà lấm bẩn. o.ladle cầm vá xới cơm; o.reach
function baSau(x,fy,s,T,o={}){ctx.save();ctx.globalAlpha=o.a??0.97;halo(x,fy-280*s,260*s,'200,220,200',0.12*(o.glow??1));
 const arm=(o.arm||[undefined,undefined]).slice();if(o.ladle)arm[1]=-0.9+0.25*Math.sin(T*2.5);if(o.reach){arm[0]=-1.35;arm[1]=1.35}
 ctx.save();ctx.translate(x,fy);ctx.scale(s,s);
 // tóc bạc sau lưng
 ctx.restore();
 woman(x,fy,s,{shirt:'#cfc6b0',pants:'#2a2624',skin:'#b8bcae',smile:false,eyes:0.01,arm});
 ctx.translate(x,fy);ctx.scale(s,s);
 ctx.fillStyle='rgba(90,70,40,.45)';for(let k=0;k<8;k++){ctx.beginPath();ctx.ellipse(-30+R0(k)*60,-210+R0(k+3)*90,4+R0(k+5)*8,3+R0(k+7)*6,0,0,7);ctx.fill()}
 ctx.save();ctx.translate(0,-278);ctx.rotate(o.tilt??Math.sin(T*0.5)*0.06);
 ghostFace(T,{noTeeth:true,skin:'#a3ab9f',open:o.chew===false?0.35:0.3+0.5*Math.max(0,Math.sin(T*7)),glow:0.5});
 for(const sd of [-1,1]){circ(sd*21,10,6,'#f4f6ee');halo(sd*21,10,22,'230,245,235',0.6)}
 if(o.chew!==false){ctx.fillStyle='#e8e2d0';for(let k=0;k<6;k++){ctx.beginPath();ctx.ellipse(-14+k*6,48+R0(k)*10+((T*30+k*7)%20),2.4,1.4,0,0,7);ctx.fill()}}
 ctx.restore();
 if(o.ladle){const [hx,hy]=HPW(1,arm[1]);ctx.save();ctx.translate(hx,hy);ctx.rotate(arm[1]+0.6);ctx.fillStyle='#8a6a3a';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.fillRect(-4,-8,8,60);ctx.strokeRect(-4,-8,8,60);ctx.beginPath();ctx.ellipse(0,62,14,18,0,0,7);ctx.fill();ctx.stroke();ctx.restore();circ(hx,hy,8,'#b8bcae',INK,3)}
 for(const sd of [-1,1]){ctx.fillStyle='#9aa094';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*22,4,15,6,0,0,7);ctx.fill();ctx.stroke()}
 ctx.restore()}

// ===== NGƯỜI CHỦ CŨ (bản hiện đại) =====
// Vy: dân văn phòng, tóc ngang vai, áo len cardigan hồng đất ngoài áo thun trắng, quần jean
function vy(x,y,s,o={}){const T=o.T||0;const arm=(o.arm||[undefined,undefined]).slice();if(o.phone){arm[0]=-0.5;arm[1]=0.5}if(o.grab)arm[1]=-1.5;if(o.pull)arm[0]=1.3;if(o.cover)arm[1]=-2.9;if(o.beg){arm[0]=-1.2;arm[1]=1.2}if(o.hug){arm[0]=-0.9;arm[1]=0.9}if(o.paper){arm[0]=-0.55;arm[1]=0.55}if(o.bowl){arm[0]=-0.6;arm[1]=0.6}
 const skin=o.pale||o.sleep?'#d8d2c4':'#ecccaa';if(o.sleep)o=Object.assign({},o,{eyes:0.3});
 woman(x,y,s,Object.assign({shirt:'#a8655a',pants:'#2c3a58',skin,smile:false},o,{arm,mouth:o.mouth}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){ctx.fillStyle='#f2efe8';ctx.beginPath();ctx.moveTo(-16,-222);ctx.lineTo(16,-222);ctx.lineTo(12,-112);ctx.lineTo(-12,-112);ctx.closePath();ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.stroke();
  ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=2;for(let k=0;k<6;k++){ctx.beginPath();ctx.moveTo(-40,-200+k*16);ctx.lineTo(-18,-200+k*16);ctx.moveTo(18,-200+k*16);ctx.lineTo(40,-200+k*16);ctx.stroke()}
  ctx.fillStyle=HAIR;ctx.beginPath();ctx.moveTo(-54,-300);ctx.quadraticCurveTo(-10,-340,52,-306);ctx.quadraticCurveTo(10,-312,-20,-290);ctx.closePath();ctx.fill()}
 for(const sd of [-1,1]){const lift=o.walk!==undefined&&!o.sit?Math.max(0,Math.sin(o.walk+(sd>0?Math.PI:0)))*12:0;ctx.fillStyle='#e8e4dc';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*(o.sit?25:22)+(o.sit?4:0),4-lift,17,7,0,0,7);ctx.fill();ctx.stroke()}
 if(o.tears){ctx.strokeStyle='rgba(170,210,240,.9)';ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*20,-262);ctx.lineTo(sd*21,-240+(T*20)%12);ctx.stroke()}}
 if(o.phone){ctx.fillStyle='#16161a';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.fillRect(-18,-170,36,58);ctx.strokeRect(-18,-170,36,58);halo(0,-170,110,'170,200,255',0.35);ctx.fillStyle='rgba(190,215,255,.95)';ctx.fillRect(-14,-166,28,50);for(const sd of [-1,1]){const [hx,hy]=HPW(sd,sd*0.5);circ(hx,hy,8,skin,INK,3)}}
 if(o.paper){ctx.fillStyle='#f4f2ec';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.fillRect(-40,-184,80,62);ctx.strokeRect(-40,-184,80,62);ctx.strokeStyle='rgba(40,40,60,.6)';ctx.lineWidth=2;for(let k=0;k<5;k++){ctx.beginPath();ctx.moveTo(-32,-174+k*10);ctx.lineTo(28,-174+k*10);ctx.stroke()}for(const sd of [-1,1]){const [hx,hy]=HPW(sd,sd*0.55);circ(hx,hy,8,skin,INK,3)}}
 if(o.cover&&!o.back)circ(10,-262,12,skin,INK,3);
 if(o.bowl){ctx.save();ctx.translate(0,-160);ctx.fillStyle='#f4f2ec';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-30,0);ctx.quadraticCurveTo(0,40,30,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#fbfaf4';ctx.beginPath();ctx.ellipse(0,0,30,9,0,Math.PI,0);ctx.fill();ctx.restore();for(const sd of [-1,1]){const [hx,hy]=HPW(sd,sd*0.6);circ(hx,hy,8,skin,INK,3)}}
 if(o.riceMouth&&!o.back){ctx.fillStyle='#f4f0e2';for(let k=0;k<7;k++){ctx.beginPath();ctx.ellipse(-12+R0(k)*24,-246+R0(k+3)*14,2.4,1.4,R0(k)*3,0,7);ctx.fill()}}
 ctx.restore()}
// Su: bé gái 6 tuổi, tóc ngắn kẹp nơ, đồ ngủ xanh có chấm; o.bowl bưng bát; o.sleep mắt lờ đờ
function su(x,y,s,o={}){const T=o.T||0;const sc=s*0.62;const arm=(o.arm||[undefined,undefined]).slice();if(o.bowl){arm[0]=-0.6;arm[1]=0.6}
 const skin=o.sleep?'#d0d0c4':'#f2dcc6';
 woman(x,y,sc,Object.assign({shirt:'#7a9cc8',pants:'#7a9cc8',skin,smile:!!o.smileF},o,{arm,mouth:o.mouth,eyes:o.sleep?0.3:o.eyes}));ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);
 if(!o.back){ctx.fillStyle='rgba(255,255,255,.6)';for(let k=0;k<8;k++){ctx.beginPath();ctx.arc(-34+R0(k)*68,-210+R0(k+3)*180,4,0,7);ctx.fill()}ctx.fillStyle='#e85a8a';ctx.beginPath();ctx.moveTo(30,-320);ctx.lineTo(56,-332);ctx.lineTo(56,-306);ctx.closePath();ctx.moveTo(30,-320);ctx.lineTo(4,-332);ctx.lineTo(4,-306);ctx.closePath();ctx.fill()}
 if(o.sleep&&!o.back){ctx.fillStyle='rgba(70,60,90,.35)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*20,-262,16,11,0,0,7);ctx.fill()}}
 for(const sd of [-1,1]){const lift=o.walk!==undefined?Math.max(0,Math.sin(o.walk+(sd>0?Math.PI:0)))*12:0;ctx.fillStyle='#f0a0b8';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*(o.sit?26:22),3-lift,17,7,0,0,7);ctx.fill();ctx.stroke()}
 if(o.bowl){ctx.save();ctx.translate(0,-160);ctx.fillStyle='#f4f2ec';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-34,0);ctx.quadraticCurveTo(0,44,34,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#f6f4ec';ctx.beginPath();ctx.ellipse(0,0,34,10,0,Math.PI,0);ctx.fill();ctx.restore();for(const sd of [-1,1]){const [hx,hy]=HPW(sd,sd*0.6);circ(hx,hy,8,skin,INK,3)}}
 if(o.covered){ctx.fillStyle='#ecccaa';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(6,-246,30,18,0.1,0,7);ctx.fill();ctx.stroke()}
 ctx.restore()}
// bác Hùng: ông hàng xóm ngoài 60, tóc bạc húi ngắn, ria mép bạc, áo polo nâu
function bacHung(x,y,s,o={}){const T=o.T||0;let armA=(o.armA||[undefined,undefined]).slice();if(o.point)armA[1]=-1.6;
 person(x,y,s,Object.assign({shirt:'#7a5a3a',pants:'#3a3a40',skin:'#d0a880',hair:'#a8a8a2'},o,{armA}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){ctx.fillStyle='#e8e6e0';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-20,-252);ctx.quadraticCurveTo(0,-262,20,-252);ctx.quadraticCurveTo(10,-246,0,-249);ctx.quadraticCurveTo(-10,-246,-20,-252);ctx.fill();ctx.stroke();
  ctx.fillStyle='#6a4a2c';ctx.beginPath();ctx.moveTo(-20,-222);ctx.lineTo(0,-196);ctx.lineTo(20,-222);ctx.lineTo(10,-222);ctx.lineTo(0,-208);ctx.lineTo(-10,-222);ctx.closePath();ctx.fill();ctx.stroke();for(let k=0;k<2;k++)circ(0,-190+k*14,3,'#e8dcc8');
  ctx.strokeStyle='rgba(90,60,40,.5)';ctx.lineWidth=2;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*36,-276);ctx.lineTo(sd*44,-272);ctx.stroke()}}
 for(const sd of [-1,1]){ctx.fillStyle='#4a3a2a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*20,4,17,7,0,0,7);ctx.fill();ctx.stroke()}
 ctx.restore()}

// ===== MA bà Sáu kiểu manga (đơn giản mà rợn) — v: 1 hốc mắt+miệng há, 2 cười toét, 3 nghiêng đầu ló =====
function softHole(cx,cy,rx,ry){const g=ctx.createRadialGradient(cx,cy,0,cx,cy,1);g.addColorStop(0,'#000');g.addColorStop(0.55,'#060606');g.addColorStop(0.8,'rgba(30,30,30,.55)');g.addColorStop(1,'rgba(60,60,60,0)');ctx.save();ctx.translate(cx,cy);ctx.scale(rx,ry);ctx.translate(-cx,-cy);ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,1,0,7);ctx.fill();ctx.restore()}
function mangaGhost(x,fy,s,T,o={}){const v=o.v||1;ctx.save();ctx.globalAlpha=o.a??0.97;
 const arm=(o.arm||[undefined,undefined]).slice();if(o.ladle)arm[1]=-0.9+0.2*Math.sin(T*2.5);if(o.reach){arm[0]=-1.3;arm[1]=1.3}
 ctx.translate(x,fy);ctx.scale(s,s);
 // tóc dài sau lưng
 ctx.fillStyle='#0a0a0a';ctx.beginPath();ctx.moveTo(-66,-330);ctx.quadraticCurveTo(-92,-200,-74+Math.sin(T*1.1)*4,-70);ctx.lineTo(74+Math.sin(T*1.1+1)*4,-70);ctx.quadraticCurveTo(92,-200,66,-330);ctx.fill();
 ctx.restore();ctx.save();ctx.globalAlpha=o.a??0.97;
 woman(x,fy,s,{shirt:'#d6d0c2',pants:'#2a2624',skin:'#e6e4dc',smile:false,eyes:0.01,arm,headless:false});
 ctx.translate(x,fy);ctx.scale(s,s);
 ctx.fillStyle='rgba(90,80,60,.25)';for(let k=0;k<5;k++){ctx.beginPath();ctx.ellipse(-26+R0(k)*52,-200+R0(k+2)*80,6,4,0,0,7);ctx.fill()}
 const tilt=o.tilt??(v===2?0.35:v===3?-0.55:0.04)+Math.sin(T*0.5)*0.03;
 ctx.save();ctx.translate(0,-282);ctx.rotate(tilt);
 ctx.save();ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.ellipse(0,0,70,80,0,0,7);ctx.fill();ctx.restore();
 // khối tóc
 ctx.fillStyle='#0a0a0a';ctx.beginPath();ctx.ellipse(0,-4,68,78,0,0,7);ctx.fill();ctx.scale(0.88,0.88);
 // mặt dài trắng bệch
 ctx.fillStyle='#f2f1ec';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-44,-50);ctx.quadraticCurveTo(-58,20,-34,70);ctx.quadraticCurveTo(-4,100,30,72);ctx.quadraticCurveTo(58,20,44,-50);ctx.quadraticCurveTo(0,-70,-44,-50);ctx.fill();ctx.stroke();
 ctx.strokeStyle='rgba(0,0,0,.22)';ctx.lineWidth=1.2;for(const sd of [-1,1])for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(sd*(40-k*2),10+k*9);ctx.lineTo(sd*(30-k*2),16+k*9);ctx.stroke()}
 ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(-3,22);ctx.quadraticCurveTo(-7,34,2,36);ctx.stroke();
 if(v===2){for(const sd of [-1,1]){ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(sd*19,2,17,14,0,0,7);ctx.fill();ctx.fillStyle='#fbfaf6';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sd*19,2,13,10,0,0,7);ctx.fill();ctx.stroke();circ(sd*19+(o.look||0)*3,3,5.5,'#000')}
  ctx.fillStyle='#000';ctx.beginPath();ctx.moveTo(-34,46);ctx.quadraticCurveTo(0,58,34,42);ctx.quadraticCurveTo(18,86,0,87);ctx.quadraticCurveTo(-22,86,-34,46);ctx.fill();ctx.fillStyle='#f2f1ec';ctx.beginPath();ctx.moveTo(-30,48);ctx.quadraticCurveTo(0,58,30,45);ctx.quadraticCurveTo(0,64,-30,48);ctx.fill()}
 else{softHole(-19,4,17,21);softHole(19,6,17,21);const op=o.open??(v===1?0.8+0.2*Math.sin(T*2):0.5);softHole(0,58,11+op*5,14+op*20)}
 // mái + sợi tóc xõa qua mặt
 ctx.fillStyle='#0a0a0a';ctx.beginPath();ctx.moveTo(-46,-52);ctx.quadraticCurveTo(0,-76,46,-52);ctx.lineTo(36,-28);ctx.quadraticCurveTo(10,-46,-6,-36);ctx.quadraticCurveTo(-26,-46,-46,-20);ctx.fill();
 ctx.strokeStyle='#0a0a0a';ctx.lineCap='round';for(const [x0,dx,len,w] of [[-26,-8,120,2.2],[22,6,105,1.6]]){ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x0,-40);ctx.bezierCurveTo(x0+dx,0,x0-dx,40,x0+dx*2+Math.sin(T+x0)*2,-40+len);ctx.stroke()}
 ctx.strokeStyle='#8a8a86';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(30,-44);ctx.quadraticCurveTo(40,10,34,70);ctx.stroke();
 if(o.rice){ctx.fillStyle='#f6f2e4';for(let k=0;k<5;k++){ctx.beginPath();ctx.ellipse(-8+k*4,70+((T*30+k*9)%24),2.2,1.3,0,0,7);ctx.fill()}}
 ctx.restore();
 if(o.ladle){const [hx,hy]=HPW(1,arm[1]);ctx.save();ctx.translate(hx,hy);ctx.rotate(arm[1]+0.6);ctx.fillStyle='#8a6a3a';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.fillRect(-4,-8,8,60);ctx.strokeRect(-4,-8,8,60);ctx.beginPath();ctx.ellipse(0,62,14,18,0,0,7);ctx.fill();ctx.stroke();ctx.restore()}
 for(const sd of [-1,1]){ctx.fillStyle='#d8d6ce';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*22,4,15,6,0,0,7);ctx.fill();ctx.stroke()}
 ctx.restore()}

// ===== CĂN NHÀ BỎ HOANG =====
// mặt ma "sạch": hốc mắt đen, đồng tử trắng mờ, miệng há đen, KHÔNG răng, KHÔNG máu, KHÔNG gân đỏ
function ghostClean(T,o={}){const R0=58,sk=o.skin||'#c4cabe',open=o.open??0.6;
 halo(0,10,170,'200,220,230',0.12*(o.glow??1));
 circ(0,0,R0,sk,INK,4);
 ctx.fillStyle='rgba(40,60,50,.28)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*36,28,10,18,sd*0.3,0,7);ctx.fill()}
 for(const sd of [-1,1]){ctx.fillStyle='#030303';ctx.beginPath();ctx.ellipse(sd*21,8,16,o.closed?3:19,sd*0.15,0,7);ctx.fill();
  if(!o.closed){halo(sd*21+(o.look||0)*5,10,14,'230,240,240',0.55);circ(sd*21+(o.look||0)*5,10,3,'#e8eeee')}}
 const mh=10+open*12;ctx.fillStyle='#0c0606';ctx.beginPath();ctx.ellipse(0,40,12+open*4,mh*0.6,0,0,7);ctx.fill();
 if(o.male){ctx.fillStyle=HAIR;ctx.beginPath();ctx.arc(0,0,R0+3,Math.PI*1.02,Math.PI*1.98);for(let i=0;i<=8;i++){ctx.lineTo(R0-i*(2*R0/8),-24+(i%2?12:0))}ctx.closePath();ctx.fill();return}
 ctx.fillStyle=HAIR;ctx.beginPath();ctx.arc(0,0,R0+4,Math.PI*0.95,Math.PI*2.05);ctx.quadraticCurveTo(R0*0.5,-R0*0.6,4,-R0*0.62);ctx.quadraticCurveTo(-R0*0.5,-R0*0.6,-R0-4,R0*0.1);ctx.fill();
 for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*(R0-4),-24);ctx.quadraticCurveTo(sd*(R0+8),40,sd*(R0-6),R0+60);ctx.lineTo(sd*(R0+14),R0+70);ctx.quadraticCurveTo(sd*(R0+18),0,sd*(R0+4),-30);ctx.fill()}
 ctx.strokeStyle=HAIR;ctx.lineCap='round';for(const [x0,w] of [[-10,3],[14,2.5],[30,2]]){ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x0,-36);ctx.quadraticCurveTo(x0-4,10,x0+2+Math.sin(T+x0)*2,56);ctx.stroke()}
 if(!DRY){ctx.fillStyle='rgba(150,190,210,.8)';for(let k=0;k<3;k++){const yy=(T*40+k*30)%90;ctx.beginPath();ctx.ellipse(-R0+4+k*3,40+yy,2,3,0,0,7);ctx.fill()}}}
// ma đàn bà tóc dài ướt sũng, áo bà ba trắng cũ; o.sitBack ngồi quay lưng; o.wave vẫy tay
function maDanBa(x,fy,s,T,o={}){ctx.save();ctx.globalAlpha=o.a??0.95;halo(x,fy-280*s,260*s,'190,215,230',0.15*(o.glow??1));
 const arm=(o.arm||[undefined,undefined]).slice();if(o.wave)arm[1]=-2.6+0.35*Math.sin(T*3);if(o.baby){arm[0]=-0.7;arm[1]=o.wave?arm[1]:0.7}if(o.reach){arm[0]=-1.3;arm[1]=1.3}
 woman(x,fy,s,{shirt:o.shirt||'#d8d4c8',pants:o.pants||'#2a2a2a',skin:'#c4cabe',back:!!o.sitBack,sit:!!(o.sitBack||o.sit),smile:false,eyes:0.01,arm,t:T});
 ctx.translate(x,fy);ctx.scale(s,s);
 if(!DRY){ctx.fillStyle='rgba(120,140,150,.35)';for(let k=0;k<6;k++){ctx.beginPath();ctx.ellipse(-30+R0(k)*60,-200+R0(k+2)*100,8,5,0,0,7);ctx.fill()}}
 if(o.baby){ctx.save();ctx.translate(-6,-160);ctx.rotate(-0.25);ctx.fillStyle='#e4e0d4';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,52,30,0,0,7);ctx.fill();ctx.stroke();if(!o.sitBack){circ(-30,-6,20,'#c8cec2',INK,3);for(const sd of [-1,1]){ctx.fillStyle='#050505';ctx.beginPath();ctx.ellipse(-30+sd*7,-8,4.5,5.5,0,0,7);ctx.fill();circ(-30+sd*7,-8,1.2,'#e8eeee')}ctx.fillStyle='#0c0606';ctx.beginPath();ctx.ellipse(-30,4,4,3+Math.max(0,Math.sin(T*6))*3,0,0,7);ctx.fill()}ctx.restore();if(!o.wave)for(const sd of [-1,1]){const [hx,hy]=HPW(sd,sd*0.7);circ(hx,hy,8,'#c4cabe',INK,3)}}
 if(o.sitBack){ctx.fillStyle=HAIR;ctx.beginPath();ctx.moveTo(-58,-300);ctx.quadraticCurveTo(-70,-180,-50,-110);ctx.lineTo(50,-110);ctx.quadraticCurveTo(70,-180,58,-300);ctx.fill();ctx.fillStyle='rgba(150,190,210,.8)';for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(-40+k*26,-100+((T*40+k*20)%60),2,3,0,0,7);ctx.fill()}}
 else{ctx.translate(0,-278);ctx.rotate(o.tilt??Math.sin(T*0.6)*0.05);ghostClean(T,{open:o.open??(0.4+0.3*Math.max(0,Math.sin(T*2.4))),look:o.look,glow:o.glow})}
 ctx.restore()}
// ông nội: tóc bạc chải ngược, ria bạc, áo bà ba trắng ngà, quần đen
function ongNoi(x,y,s,o={}){person(x,y,s,Object.assign({shirt:'#e2dccc',pants:'#1a1a1e',skin:'#cfa47c',hair:'#c8c8c4'},o));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){ctx.fillStyle='#ecebe6';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-22,-252);ctx.quadraticCurveTo(0,-264,22,-252);ctx.quadraticCurveTo(0,-244,-22,-252);ctx.fill();ctx.stroke();for(let k=0;k<5;k++)circ(0,-208+k*20,3,'#9a948a');
  ctx.strokeStyle='rgba(90,60,40,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-24,-322);ctx.quadraticCurveTo(0,-328,24,-322);ctx.stroke()}
 for(const sd of [-1,1]){ctx.fillStyle='#3a2a1a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*20,4,16,7,0,0,7);ctx.fill();ctx.stroke()}
 ctx.restore()}
// thầy pháp: gầy, tóc muối tiêu cắt ngắn, râu dê bạc, áo bà ba nâu đậm, cầm xấp bùa vàng
function thayPhap(x,y,s,o={}){const T=o.T||0;let armA=(o.armA||[undefined,undefined]).slice();if(o.bua)armA[1]=-1.4+0.15*Math.sin(T*3);if(o.lamp)armA[1]=-0.55;
 person(x,y,s,Object.assign({shirt:'#4a3424',pants:'#1a1a1a',skin:'#c49a72',hair:'#7a7a76',beard:true},o,{armA}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back)for(let k=0;k<5;k++)circ(0,-208+k*20,3,'#c8b890');
 if(o.bua){const [hx,hy]=HPP(1,armA[1]);ctx.save();ctx.translate(hx,hy-10);ctx.rotate(-0.2);ctx.fillStyle='#e8c84a';ctx.strokeStyle='#8a1a10';ctx.lineWidth=2;ctx.fillRect(-12,-44,24,48);ctx.strokeRect(-12,-44,24,48);ctx.beginPath();ctx.moveTo(-6,-36);ctx.lineTo(6,-28);ctx.lineTo(-6,-18);ctx.lineTo(6,-8);ctx.stroke();ctx.restore()}
 for(const sd of [-1,1]){ctx.fillStyle='#2a2018';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*20,4,16,7,0,0,7);ctx.fill();ctx.stroke()}
 ctx.restore()}
// người cháu (Khôi): 20 tuổi, tóc ngắn, áo thun xám, quần jean, dép; o.torch cầm đèn pin
function chau(x,y,s,o={}){const T=o.T||0;let armA=(o.armA||[undefined,undefined]).slice();if(o.torch)armA[1]=-0.9;
 const skin='#d0a27a';
 person(x,y,s,Object.assign({shirt:'#8a8e94',pants:'#2e3e5e',skin,hair:'#121212'},o,{armA}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){ctx.fillStyle='#121212';ctx.beginPath();ctx.moveTo(-58,-306);ctx.quadraticCurveTo(-10,-352,58,-310);ctx.lineTo(50,-292);ctx.quadraticCurveTo(0,-318,-50,-290);ctx.fill();
  ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-16,-226);ctx.quadraticCurveTo(0,-214,16,-226);ctx.stroke()}
 for(const sd of [-1,1]){ctx.fillStyle='#5a4a3a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*18,4,16,6,0,0,7);ctx.fill();ctx.stroke()}
 if(o.torch){const [hx,hy]=HPP(1,-0.9);ctx.save();ctx.translate(hx,hy);ctx.rotate(-0.9);ctx.fillStyle='#2a2a2e';ctx.fillRect(-6,-4,12,34);halo(0,40,90,'255,250,220',0.5);ctx.restore();circ(hx,hy,9,skin,INK,3)}
 ctx.restore()}
// ma con nít: nhỏ, tóc ngắn ướt bết, áo trắng cũ, mặt hốc mắt đen (không máu)
function maCon(x,fy,s,T,o={}){maDanBa(x,fy,s*0.6,T,Object.assign({glow:0.8},o))}
// ma đàn ông: áo bà ba đen cũ, da tái, hốc mắt đen
function maOng(x,fy,s,T,o={}){ctx.save();ctx.globalAlpha=o.a??0.95;halo(x,fy-280*s,260*s,'190,215,230',0.15*(o.glow??1));
 person(x,fy,s,{shirt:'#2e2e30',pants:'#1a1a1a',skin:'#c4cabe',eyes:0.01,armA:o.armA||[undefined,undefined]});
 ctx.translate(x,fy);ctx.scale(s,s);ctx.translate(0,-278);ctx.rotate(o.tilt??Math.sin(T*0.5)*0.04);ghostClean(T,{male:true,open:o.open??0.35,glow:o.glow});ctx.restore()}
// anh Hòa: 35 tuổi, tóc ngắn, áo sơ mi xanh nhạt, quần tây; chị Ngân: tóc dài, áo thun hồng đất, quần đen; bà Năm: tóc bạc, áo bà ba xanh xám
function anhHoa(x,y,s,o={}){const T=o.T||0;let armA=(o.armA||[undefined,undefined]).slice();if(o.lamp)armA[1]=-0.55;
 person(x,y,s,Object.assign({shirt:'#7c9cbc',pants:'#2a2a30',skin:'#c99a72',hair:'#121212'},o,{armA}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){ctx.fillStyle='#e8eef4';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-22,-222);ctx.lineTo(0,-198);ctx.lineTo(22,-222);ctx.lineTo(10,-222);ctx.lineTo(0,-210);ctx.lineTo(-10,-222);ctx.closePath();ctx.fill();ctx.stroke();for(let k=0;k<5;k++)circ(0,-190+k*16,2.6,'#e8eef4')}
 for(const sd of [-1,1]){ctx.fillStyle='#3a2a1a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*20,4,17,7,0,0,7);ctx.fill();ctx.stroke()}
 if(o.lamp){const [hx,hy]=HPP(1,-0.55);lamp(hx+4,hy+46,0.9,T);circ(hx,hy,9,'#c99a72',INK,3)}
 if(o.bundle){ctx.fillStyle='#8a7a5a';ctx.strokeStyle=INK;ctx.lineWidth=3.5;ctx.beginPath();ctx.ellipse(0,-120,52,34,0,0,7);ctx.fill();ctx.stroke()}
 ctx.restore()}
function chiNgan(x,y,s,o={}){vy(x,y,s,Object.assign({shirt:'#a8566a',pants:'#1c1c22'},o));if(o.bundle){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#6a5a7a';ctx.strokeStyle=INK;ctx.lineWidth=3.5;ctx.beginPath();ctx.ellipse(0,-118,46,30,0,0,7);ctx.fill();ctx.stroke();ctx.restore()}}
function baNam(x,y,s,o={}){baBay(x,y,s,Object.assign({shirt:'#4e5e6e'},o))}
// ===== BA HỒN CHÍN VÍA =====
// Thư: 24 tuổi, công nhân, tóc cột đuôi ngựa, áo sơ mi xanh công nhân, quần tây đen; o.bike dắt xe đạp; o.vacant mắt trân trân; o.blush hồng hào
function thu(x,y,s,o={}){const T=o.T||0;const arm=(o.arm||[undefined,undefined]).slice();if(o.bike){arm[1]=-0.5}
 const skin=o.vacant?'#d4d0c4':'#ecc8a4';
 if(o.bike){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle='#1a1a1a';ctx.lineWidth=6;for(const wx of [30,190]){ctx.beginPath();ctx.arc(wx,-48,46,0,7);ctx.stroke();ctx.lineWidth=2;for(let k=0;k<6;k++){ctx.beginPath();ctx.moveTo(wx,-48);ctx.lineTo(wx+Math.cos(k)*44,-48+Math.sin(k)*44);ctx.stroke()}ctx.lineWidth=6}
  ctx.strokeStyle='#3a5a8a';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(30,-48);ctx.lineTo(90,-120);ctx.lineTo(170,-120);ctx.lineTo(190,-48);ctx.moveTo(90,-120);ctx.lineTo(110,-48);ctx.lineTo(190,-48);ctx.moveTo(170,-120);ctx.lineTo(165,-150);ctx.stroke();ctx.fillStyle='#2a2a2a';ctx.fillRect(70,-132,40,10);ctx.strokeStyle='#888';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(150,-152);ctx.lineTo(185,-152);ctx.stroke();ctx.restore()}
 woman(x,y,s,Object.assign({shirt:'#5a7aa0',pants:'#1c1c22',skin,smile:false},o,{arm,mouth:o.mouth,eyes:o.vacant?0.55:o.eyes,look:o.vacant?0:o.look,pupil:o.vacant?2:o.pupil}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){ctx.fillStyle='#e8eef4';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-20,-222);ctx.lineTo(0,-200);ctx.lineTo(20,-222);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=2;ctx.strokeRect(-34,-196,18,14);
  ctx.fillStyle=HAIR;ctx.beginPath();ctx.moveTo(-52,-300);ctx.quadraticCurveTo(0,-326,52,-300);ctx.lineTo(46,-290);ctx.quadraticCurveTo(0,-304,-46,-290);ctx.fill();
  if(o.blush){ctx.fillStyle='rgba(230,120,120,.35)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*32,-254,10,6,0,0,7);ctx.fill()}}
  if(o.vacant){ctx.fillStyle='rgba(60,60,80,.3)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*20,-262,17,12,0,0,7);ctx.fill()}}}
 // đuôi ngựa
 ctx.fillStyle=HAIR;ctx.beginPath();ctx.moveTo(40,-320);ctx.quadraticCurveTo(80+Math.sin(T*2)*4,-280,64,-220);ctx.lineTo(54,-222);ctx.quadraticCurveTo(64,-280,32,-312);ctx.fill();
 for(const sd of [-1,1]){const lift=o.walk!==undefined?Math.max(0,Math.sin(o.walk+(sd>0?Math.PI:0)))*12:0;ctx.fillStyle='#2a2a2a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*(o.sit?25:22),4-lift,17,7,0,0,7);ctx.fill();ctx.stroke()}
 ctx.restore()}
// bà Sáu Mai: má Thư, tóc muối tiêu búi thấp không trâm -> để xõa ngang vai, áo bà ba tím than; o.shirtHold cầm áo con; o.bowl chén gạo; o.incense nhang
function baSau2(x,y,s,o={}){const T=o.T||0;const arm=(o.arm||[undefined,undefined]).slice();if(o.shirtHold){arm[0]=-0.9;arm[1]=0.9}if(o.incense)arm[1]=-1.2;
 woman(x,y,s,Object.assign({shirt:o.shirt||'#4a3a5a',pants:'#141418',skin:'#d8b48e',smile:false},o,{arm,mouth:o.mouth}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){ctx.fillStyle='#8a8884';ctx.beginPath();ctx.arc(0,-278,60,Math.PI*1.0,Math.PI*2.0);ctx.lineTo(56,-250);ctx.quadraticCurveTo(0,-310,-56,-250);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(90,60,40,.5)';ctx.lineWidth=2;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*34,-262);ctx.quadraticCurveTo(sd*38,-250,sd*32,-240);ctx.stroke()}if(!o.modern)babaDeco(0,'#a898b0')}
 for(const sd of [-1,1]){ctx.fillStyle='#2a2018';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*22,4,16,7,0,0,7);ctx.fill();ctx.stroke()}
 if(o.shirtHold){ctx.save();ctx.translate(0,-150);ctx.fillStyle='#5a7aa0';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-60,-20);ctx.lineTo(60,-20);ctx.lineTo(52,60);ctx.lineTo(-52,60);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
 if(o.incense){const [hx,hy]=HPW(1,-1.2);ctx.strokeStyle='#8a2a1a';ctx.lineWidth=3;for(let k=-1;k<=1;k++){ctx.beginPath();ctx.moveTo(hx+k*5,hy);ctx.lineTo(hx+k*7,hy-60);ctx.stroke();circ(hx+k*7,hy-60,3,'#ff7a30')}ctx.strokeStyle='rgba(200,200,200,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(hx,hy-62);ctx.bezierCurveTo(hx+20,hy-90,hx-15,hy-120,hx+10+Math.sin(T)*8,hy-160);ctx.stroke()}
 ctx.restore()}
// ông Tư: thầy gọi vía, áo bà ba trắng ngà, râu dê bạc, cầm đèn dầu / chén gạo
function ongTuVia(x,y,s,o={}){thayPhap(x,y,s,Object.assign({shirt:'#dcd6c6'},o));if(o.lamp){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const [hx,hy]=HPP(1,-0.55);lamp(hx+4,hy+46,0.9,o.T||0);ctx.restore()}}

// ===== Chuyến xe cuối đèo =====
// Khoa: tài xế 28 tuổi, nón lưỡi trai xanh rêu, áo khoác xanh than kéo khóa, da rám nắng
function khoa(x,y,s,o={}){const T=o.T||0;const armA=(o.armA||[undefined,undefined]).slice();
 person(x,y,s,Object.assign({shirt:'#3a4c6a',pants:'#26282e',skin:'#d2a67e',hair:'#16120e'},o,{armA,arms:o.drive?'hold':o.arms,sit:!!o.sit}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-224);ctx.lineTo(0,-120);ctx.stroke();ctx.fillStyle='#2c4a3e';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,-282,62,Math.PI*1.0,Math.PI*2.0);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.ellipse(34,-292,56,12,0.08,0,7);ctx.fill();ctx.stroke();
  if(o.sweat){ctx.fillStyle='rgba(200,225,240,.9)';ctx.beginPath();ctx.ellipse(-50,-262+o.sweat*28,5,9,0,0,7);ctx.fill()}}
 else{ctx.fillStyle='#2c4a3e';ctx.beginPath();ctx.arc(0,-282,62,Math.PI,0);ctx.fill()}
 for(const sd of [-1,1]){ctx.fillStyle='#22201e';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*20,4,17,8,0,0,7);ctx.fill();ctx.stroke()}
 ctx.restore()}
// ông Sáu: ~65 tuổi, tóc bạc, ria bạc, áo khoác xanh rêu cũ + tạp dề nâu, dép; o.incense cầm 3 nén nhang; o.point chỉ tay
function ongSau(x,y,s,o={}){const T=o.T||0;const armA=(o.armA||[undefined,undefined]).slice();if(o.point)armA[1]=-1.6;if(o.incense)armA[1]=-1.2;
 person(x,y,s,Object.assign({shirt:'#566048',pants:'#38362e',skin:'#c4926a',hair:'#d4d2c8'},o,{armA}));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){ctx.fillStyle='#5a4128';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-30,-196);ctx.lineTo(30,-196);ctx.lineTo(38,-112);ctx.lineTo(-38,-112);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#e6e3da';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(0,-252);ctx.quadraticCurveTo(-24,-256,-34,-238);ctx.quadraticCurveTo(-14,-242,0,-242);ctx.quadraticCurveTo(14,-242,34,-238);ctx.quadraticCurveTo(24,-256,0,-252);ctx.fill();ctx.stroke();
  ctx.strokeStyle='rgba(70,45,30,.55)';ctx.lineWidth=2;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*40,-312);ctx.lineTo(sd*18,-318);ctx.moveTo(sd*36,-262);ctx.lineTo(sd*28,-244);ctx.stroke()}}
 for(const sd of [-1,1]){ctx.fillStyle='#3a2a1a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*20,4,17,7,0,0,7);ctx.fill();ctx.stroke()}
 if(o.incense){const [hx,hy]=HPP(1,-1.2);ctx.strokeStyle='#8a2a1a';ctx.lineWidth=3;for(let k=-1;k<=1;k++){ctx.beginPath();ctx.moveTo(hx+k*5,hy);ctx.lineTo(hx+k*7,hy-60);ctx.stroke();circ(hx+k*7,hy-60,3,'#ff7a30')}}
 ctx.restore()}
// Hạnh (ma): cô sinh viên 22 tuổi, áo mưa xanh, mặt rõ, khô ráo (không nhỏ nước)
function hanhMa(x,fy,s,T,o={}){maDanBa(x,fy,s,T,Object.assign({shirt:'#2f6fb0',pants:'#27344a',glow:0.7},o))}
// bà Lụa: mẹ Hạnh, ~60 tuổi, thành phố: áo thun tím nhạt, tóc muối tiêu búi thấp; o.helmet ôm chiếc mũ bảo hiểm xanh
function baLua(x,y,s,o={}){const T=o.T||0;const arm=(o.arm||[undefined,undefined]).slice();if(o.helmet){arm[0]=-0.95;arm[1]=0.95}
 baSau2(x,y,s,Object.assign({shirt:'#8a7aa0',modern:true,arm},o));
 if(o.helmet){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.translate(0,-150);ctx.fillStyle='#2f6fd0';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,50,Math.PI,0);ctx.lineTo(50,16);ctx.lineTo(-50,16);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#14202c';ctx.fillRect(-40,2,80,14);ctx.restore()}}
// ===== nét "bean" (đầu tròn, thân hạt đậu, tay chân que) =====
function bean(x,y,s,o={}){const T=o.T||0;ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.lineCap='round';ctx.lineJoin='round';
 const sk=o.skin||'#f4ece0',sh=o.shirt||'#4a7ab8',ghost=o.ghost,lw=7;
 const arm=(o.armA||o.arm||[undefined,undefined]).slice();let aL=arm[0]??-0.18,aR=arm[1]??0.18;
 if(o.drive){aL=0.75;aR=-0.75}if(o.point)aR=1.6;if(o.wave)aR=2.6+0.35*Math.sin(T*6);if(o.incense)aR=1.0;if(o.helmet){aL=0.95;aR=-0.95}if(o.reach){aL=-1.3;aR=1.3}
 if(o.drive){aL=-0.9;aR=0.9}if(o.point)aR=-1.6;if(o.wave)aR=-2.6+0.35*Math.sin(T*6);if(o.incense)aR=-1.2;if(o.helmet){aL=-0.95;aR=0.95}if(o.reach){aL=-1.3;aR=1.3}
 // chân que
 const lift=k=>o.walk!==undefined?Math.sin(o.walk+(k>0?Math.PI:0))*0.35:0;
 ctx.strokeStyle='#111';ctx.lineWidth=lw;
 for(const k of[-1,1]){ctx.beginPath();ctx.moveTo(k*16,-96);if(o.sit){ctx.lineTo(k*20,-60);ctx.lineTo(k*22,-4)}else{const a=lift(k);ctx.lineTo(k*16+Math.sin(a)*94,-96+Math.cos(a)*94)}ctx.stroke();
  const fx=o.sit?k*22:k*16+Math.sin(lift(k))*94,fy=o.sit?-4:-96+Math.cos(lift(k))*94;ctx.fillStyle='#111';ctx.beginPath();ctx.ellipse(fx+k*6,fy,13,7,0,0,7);ctx.fill()}
 // thân hạt đậu
 ctx.fillStyle=sh;ctx.strokeStyle='#111';ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(-38,-212,76,124,36);ctx.fill();ctx.stroke();
 ctx.fillStyle='rgba(255,255,255,.18)';ctx.beginPath();ctx.roundRect(-30,-204,16,96,8);ctx.fill();
 if(o.tie){ctx.fillStyle=o.tie;ctx.beginPath();ctx.moveTo(-6,-206);ctx.lineTo(6,-206);ctx.lineTo(8,-150);ctx.lineTo(0,-140);ctx.lineTo(-8,-150);ctx.closePath();ctx.fill()}
 if(o.zip){ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-208);ctx.lineTo(0,-92);ctx.stroke()}
 if(o.apron){ctx.fillStyle='#7a5038';ctx.strokeStyle='#111';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(-26,-170,52,72,10);ctx.fill();ctx.stroke()}
 // tay que
 ctx.strokeStyle='#111';ctx.lineWidth=lw;const HP=[];
 for(const [k,a] of[[-1,aL],[1,aR]]){const sx=k*34,sy=-196;const px=sx+Math.sin(a)*92,py=sy+Math.cos(a)*92;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(px,py);ctx.stroke();ctx.fillStyle=ghost?sk:'#111';ctx.beginPath();ctx.arc(px,py,9,0,7);ctx.fill();HP.push([px,py])}
 // đầu
 const hy=-270;
 if(o.hair==='long'){ctx.fillStyle='#111';ctx.beginPath();ctx.ellipse(0,hy+40,68,96,0,0,7);ctx.fill()}
 ctx.fillStyle=sk;ctx.strokeStyle='#111';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,hy,62,0,7);ctx.fill();ctx.stroke();
 ctx.fillStyle='rgba(0,0,0,.08)';ctx.beginPath();ctx.arc(10,hy+6,56,-0.6,1.9);ctx.fill();
 // tóc
 ctx.fillStyle=o.hairC||'#111';
 if(o.hair==='short'){ctx.beginPath();ctx.arc(0,hy,64,Math.PI*1.05,Math.PI*1.95);ctx.quadraticCurveTo(10,hy-30,-50,hy-26);ctx.closePath();ctx.fill()}
 if(o.hair==='white'){ctx.fillStyle='#d8d8d8';ctx.beginPath();ctx.arc(0,hy,64,Math.PI*1.1,Math.PI*1.9);ctx.quadraticCurveTo(0,hy-44,-58,hy-24);ctx.closePath();ctx.fill();ctx.strokeStyle='#111';ctx.lineWidth=4;ctx.stroke()}
 if(o.hair==='bun'){ctx.fillStyle=o.hairC||'#8a8a8a';ctx.beginPath();ctx.arc(0,hy,64,Math.PI*1.05,Math.PI*1.95);ctx.quadraticCurveTo(0,hy-36,-60,hy-20);ctx.closePath();ctx.fill();ctx.beginPath();ctx.arc(0,hy-66,20,0,7);ctx.fill()}
 if(o.hair==='long'){ctx.fillStyle='#111';ctx.beginPath();ctx.arc(0,hy,66,Math.PI*1.02,Math.PI*1.98);ctx.quadraticCurveTo(20,hy-36,-62,hy-6);ctx.closePath();ctx.fill()}
 if(o.cap){ctx.fillStyle=o.cap;ctx.strokeStyle='#111';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,hy-6,64,Math.PI,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.ellipse(36,hy-8,46,10,0.05,0,7);ctx.fill();ctx.stroke()}
 // mặt
 const eo=o.eyes??1,lk=(o.look||0)*6;
 for(const k of[-1,1]){const ex=k*22,ey=hy+4;
  if(ghost){ctx.fillStyle='#050505';ctx.beginPath();ctx.ellipse(ex,ey,14,20,0,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ex+3,ey-6,3.5,0,7);ctx.fill()}
  else if(eo<0.15){ctx.strokeStyle='#111';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(ex-8,ey);ctx.lineTo(ex+8,ey);ctx.stroke()}
  else if(eo>1.3){ctx.fillStyle='#fff';ctx.strokeStyle='#111';ctx.lineWidth=3;ctx.beginPath();ctx.arc(ex,ey,15,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(ex+lk*0.5,ey,4,0,7);ctx.fill()}
  else{ctx.fillStyle='#111';ctx.beginPath();ctx.ellipse(ex+lk,ey,6,8*eo,0,0,7);ctx.fill()}
  if(!ghost){ctx.strokeStyle='#111';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(ex-10,ey-18+(o.angry?k*-3:0));ctx.lineTo(ex+10,ey-20+(o.angry?k*3:0));ctx.stroke()}}
 if(o.blush||o.tears)for(const k of[-1,1]){ctx.fillStyle='rgba(240,120,120,.35)';ctx.beginPath();ctx.ellipse(k*36,hy+22,10,6,0,0,7);ctx.fill()}
 if(o.tears){ctx.fillStyle='rgba(120,190,255,.9)';for(const k of[-1,1]){ctx.beginPath();ctx.ellipse(k*24,hy+24+((T*30)%20),3.5,6,0,0,7);ctx.fill()}}
 if(o.sweat){ctx.fillStyle='rgba(140,200,255,.95)';ctx.beginPath();ctx.ellipse(-50,hy-14+((T*25)%18),6,10,0,0,7);ctx.fill()}
 if(o.must){ctx.fillStyle='#e0e0e0';ctx.strokeStyle='#111';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(-12,hy+30,14,6,-0.2,0,7);ctx.ellipse(12,hy+30,14,6,0.2,0,7);ctx.fill();ctx.stroke()}
 const op=ghost?(o.open??0.4):(o.mouth==='o'?1:0);
 if(op>0){ctx.fillStyle='#2a0a0a';ctx.beginPath();ctx.ellipse(0,hy+40,8+op*2,6+op*7,0,0,7);ctx.fill()}else{ctx.strokeStyle='#111';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-10,hy+38);ctx.quadraticCurveTo(0,hy+(o.smileF?46:40),10,hy+38);ctx.stroke()}
 // đạo cụ
 if(o.helmet){ctx.fillStyle='#2f6fd0';ctx.strokeStyle='#111';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,-130,40,Math.PI,0);ctx.lineTo(40,-118);ctx.lineTo(-40,-118);ctx.closePath();ctx.fill();ctx.stroke()}
 if(o.incense){const [hx,hy2]=HP[1];ctx.strokeStyle='#8a2a1a';ctx.lineWidth=3;for(let k=-1;k<=1;k++){ctx.beginPath();ctx.moveTo(hx+k*5,hy2);ctx.lineTo(hx+k*7,hy2-56);ctx.stroke();circ(hx+k*7,hy2-56,3,'#ff7a30')}}
 ctx.restore()}
function khoa(x,y,s,o={}){bean(x,y,s,Object.assign({skin:'#f2d8bc',shirt:'#2f6a9a',hair:'short',cap:'#2f8a5a',zip:true},o))}
function ongSau(x,y,s,o={}){bean(x,y,s,Object.assign({skin:'#e8caa8',shirt:'#6a8a48',hair:'white',must:true,apron:true},o))}
function baLua(x,y,s,o={}){bean(x,y,s,Object.assign({skin:'#f0d8c0',shirt:'#9a7ab8',hair:'bun',hairC:'#8a8a8a'},o))}
function hanhMa(x,fy,s,T,o={}){ctx.save();ctx.globalAlpha=o.a??0.96;halo(x,fy-280*s,240*s,'170,210,255',0.18*(o.glow??1));bean(x,fy,s,Object.assign({skin:'#d8e2ea',shirt:'#3a7ae0',hair:'long',ghost:true,T},o));ctx.restore()}
function khach(x,y,s,o={}){bean(x,y,s,Object.assign({shirt:o.c||'#8a6a3a',hair:'short'},o))}
