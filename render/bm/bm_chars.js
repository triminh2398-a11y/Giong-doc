// ===== BLOODY MARY (Halloween, Sài Gòn) — nhân vật nét Ma Lai =====
function wetHair(R0,T,side){ctx.save();ctx.lineCap='round';ctx.fillStyle='rgba(8,8,10,.97)';ctx.beginPath();ctx.arc(0,0,R0+4,Math.PI*0.97,Math.PI*2.03);ctx.quadraticCurveTo(R0*0.5,-R0*0.45,R0*0.1,-R0*0.3);ctx.quadraticCurveTo(-R0*0.5,-R0*0.5,-R0-4,R0*0.05);ctx.fill();
 for(let k=0;k<13;k++){if(side&&k>3&&k<9)continue;const x=-R0+k*(2*R0/12);const len=R0*1.6+rnd(k)*R0*1.2;ctx.strokeStyle='rgba(6,6,8,.96)';ctx.lineWidth=3.5+rnd(k+3)*2.5;ctx.beginPath();ctx.moveTo(x*0.75,-R0*0.75);ctx.bezierCurveTo(x*0.95+Math.sin(T*0.8+k)*2,-R0*0.1,x*1.05-Math.sin(T*0.7+k)*3,R0*0.5,x*1.1+Math.sin(T*0.9+k)*3,len);ctx.stroke()}
 ctx.fillStyle='rgba(170,210,235,.75)';for(let k=0;k<3;k++){const xx=-R0*0.8+k*R0*0.8,yy=R0*1.2+((T*60+k*41)%60);ctx.beginPath();ctx.ellipse(xx,yy,2.5,5,0,0,7);ctx.fill()}ctx.restore()}
// vị trí bàn tay theo góc tay (khớp woman(): vai (sd*38,-210), dài 92)
const HP=(sd,a)=>[sd*38-92*Math.sin(a),-210+92*Math.cos(a)];
function candleDraw(x,y,T,out){ctx.save();ctx.translate(x,y);ctx.fillStyle='#ece4cc';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.fillRect(-7,-46,14,46);ctx.strokeRect(-7,-46,14,46);if(!out){const f=1+Math.sin(T*13)*0.12;halo(0,-60,150,'255,180,90',0.45*f);ctx.fillStyle='#ffd27a';ctx.beginPath();ctx.ellipse(0,-58,5*f,12*f,0,0,7);ctx.fill()}ctx.restore()}
function mirrorBack(x,y,sc,glow,T){ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);if(glow)halo(0,0,120,'80,150,255',0.55*glow);ctx.fillStyle='#3a2416';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,30,40,0,0,7);ctx.fill();ctx.stroke();ctx.strokeStyle='#8a6a3a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,22,31,0,0,7);ctx.stroke();ctx.fillStyle='#3a2416';ctx.fillRect(-5,38,10,26);ctx.strokeRect(-5,38,10,26);ctx.restore()}
function paleHand(x,y,ang,T){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle='#b9c2b8';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-34,18,24,0,0,7);ctx.fill();ctx.stroke();for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(-12+k*8,-14);ctx.quadraticCurveTo(-14+k*8,8,-12+k*8.5,22+(k===1||k===2?6:0));ctx.lineWidth=8;ctx.strokeStyle=INK;ctx.stroke();ctx.lineWidth=5;ctx.strokeStyle='#b9c2b8';ctx.stroke()}ctx.fillStyle='rgba(20,20,20,.7)';ctx.fillRect(-2,-90,4,40);ctx.fillStyle='rgba(170,210,235,.8)';ctx.beginPath();ctx.ellipse(-6,30+((T*50)%30),2.5,5,0,0,7);ctx.fill();ctx.restore()}
// Vy: áo hoodie xám. o.candle (tay trái cầm nến trước ngực), o.mirror (tay phải giơ gương qua vai), o.hug (ôm gương), o.hand (bàn tay ma trên vai), o.hairOver
function vy(x,y,s,o={}){const T=o.T||0;const arm=[o.candle?-0.9:o.hug?-0.95:undefined,o.mirror?-2.67:o.hug?0.95:undefined];
 woman(x,y,s,Object.assign({shirt:'#5a6270',pants:'#22252e',skin:'#ecdccc',smile:false,arm},o));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){ctx.fillStyle='#4a525e';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-44,-232);ctx.quadraticCurveTo(0,-212,44,-232);ctx.lineTo(40,-222);ctx.quadraticCurveTo(0,-200,-40,-222);ctx.closePath();ctx.fill();ctx.stroke()}
 if(o.tears){ctx.strokeStyle='rgba(170,210,240,.9)';ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*20,-262);ctx.lineTo(sd*21,-240+(T*20)%12);ctx.stroke()}}
 if(o.candle){const [hx,hy]=HP(-1,-0.9);candleDraw(hx,hy-4,T,o.out)}
 if(o.mirror){const [hx,hy]=HP(1,-2.67);mirrorBack(hx+6,hy-46,1,o.mglow||0,T)}
 if(o.hug){mirrorBack(0,-150,1.1,o.mglow||0,T)}
 if(o.hand)paleHand(-64,-196,0.12,T);
 if(o.hairOver){ctx.save();ctx.lineCap='round';for(let k=0;k<9;k++){ctx.strokeStyle='rgba(6,6,8,.95)';ctx.lineWidth=4+rnd(k)*3;const x0=-120+k*9;ctx.beginPath();ctx.moveTo(x0,-520);ctx.bezierCurveTo(x0+Math.sin(T+k)*4,-430,x0-10,-360,x0-6+Math.sin(T*0.8+k)*4,-300+rnd(k+2)*60);ctx.stroke()}ctx.restore()}
 ctx.restore()}
// Thảo: tóc ngắn, áo đỏ. o.phone (tay phải giơ điện thoại), o.flash, o.shout (tay trái giơ lên)
function thao(x,y,s,o={}){const T=o.T||0;const arm=[o.shout?2.4:o.armA?o.armA[0]:undefined,o.phone?-2.2:o.armA?o.armA[1]:undefined];
 woman(x,y,s,Object.assign({shirt:'#a8323a',pants:'#1c2030',skin:'#eedcc8',smile:!!o.laugh,arm},o));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){ctx.fillStyle=HAIR;for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*50,-246,13,30,0,0,7);ctx.fill()}}
 if(o.tears){ctx.strokeStyle='rgba(170,210,240,.9)';ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*20,-262);ctx.lineTo(sd*21,-240+(T*20)%12);ctx.stroke()}}
 if(o.phone){const [hx,hy]=HP(1,-2.2);ctx.save();ctx.translate(hx,hy-24);ctx.fillStyle='#16181e';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(-15,-28,30,56,5);ctx.fill();ctx.stroke();if(o.flash){halo(0,-18,110,'255,255,255',0.7);circ(0,-18,5,'#fff')}ctx.restore()}
 ctx.restore()}
// Mary: da tái, tóc đen ướt rủ, hốc mắt chảy máu, váy đen
function mary(x,fy,s,T,o={}){ctx.save();ctx.globalAlpha=o.a??0.95;woman(x,fy,s,{shirt:'#1e1a22',pants:'#141018',dress:true,skin:'#b9c2b8',creepy:true,grin:0.4,eyes:1,t:T,arm:o.arm});
 ctx.translate(x,fy);ctx.scale(s,s);ctx.translate(0,-278);if(o.face){halo(0,0,200,'120,255,180',0.18);scaryFace(T,{woman:true,open:0.55,skin:'#a8b0a6'})}wetHair(56,T,!o.face);
 ctx.fillStyle='#7a0a10';for(const sd of [-1,1]){ctx.fillRect(sd*20-2,14,4,24+((T*20)%14));circ(sd*20,40+((T*20)%14),3,'#7a0a10')}ctx.restore()}
function oldgirl(x,y,s,o={}){const T=o.T||0;woman(x,y,s,Object.assign({shirt:'#e8dcc0',pants:'#5a4a3a',dress:true,skin:'#f0e4d4',smile:false,arm:[-0.9,-2.67]},o));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 ctx.fillStyle='#f4f0e4';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-334,58,22,0,Math.PI,0);ctx.fill();ctx.stroke();// mũ trùm vải
 {const [hx,hy]=HP(-1,-0.9);candleDraw(hx,hy-4,T)}{const [hx,hy]=HP(1,-2.67);mirrorBack(hx+6,hy-46,1,0,T)}ctx.restore()}
// ---- hình trong gương (vẽ lên texture mặt gương) ----
function mirrorView(g,w,h,mode,T,q){g.save();g.fillStyle='#060708';g.fillRect(0,0,w,h);
 const blue=['mary2','thao','crawl','blue'].includes(mode),sep=['groom','skull'].includes(mode);
 const gr=g.createRadialGradient(w/2,h*0.45,10,w/2,h/2,w*0.75);gr.addColorStop(0,blue?'rgba(70,130,255,.4)':sep?'rgba(230,180,110,.35)':'rgba(255,160,70,.3)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);
 // bậc thang tối phía sau
 g.strokeStyle=blue?'rgba(100,140,200,.25)':'rgba(140,120,100,.28)';g.lineWidth=4;for(let k=0;k<8;k++){const y=h*0.62+k*k*5;g.beginPath();g.moveTo(w*0.1-k*10,y);g.lineTo(w*0.9+k*10,y);g.stroke()}
 const old=ctx;ctx=g;ctx.save();ctx.translate(w*0.5,h*0.36);
 if(mode==='man'){ctx.globalAlpha=0.6*q;person(30,560,1.9,{shirt:'#2a2a30',eyes:0.9,skin:'#c8c4bc'})}
 if(mode==='groom'){ctx.globalAlpha=0.75;person(0,560,1.9,{shirt:'#3a3020',eyes:1,skin:'#e0d0b8'})}
 if(mode==='change'){ctx.globalAlpha=0.6*(1-q);person(30,560,1.9,{shirt:'#2a2a30',eyes:0.9,skin:'#c8c4bc'});ctx.globalAlpha=Math.min(1,q*1.3);mary(30,580,1.95,T,{face:q>0.75})}
 if(mode==='mary'||mode==='mary2'){const z=1+0.35*q;ctx.scale(z,z);mary(10,580,1.95,T,{face:true})}
 if(mode==='skull'){ctx.globalAlpha=0.9;ctx.translate(0,-30);ctx.scale(2.2,2.2);circ(0,0,58,'#d8d4c4',INK,4);ctx.fillStyle='#060606';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*22,4,16,19,0,0,7);ctx.fill()}ctx.beginPath();ctx.moveTo(0,22);ctx.lineTo(-8,36);ctx.lineTo(8,36);ctx.fill();ctx.fillStyle='#d8d4c4';ctx.fillRect(-28,44,56,18);ctx.fillStyle='#060606';for(let k=-3;k<=3;k++)ctx.fillRect(k*8-1,44,2,18)}
 if(mode==='thao'||mode==='crawl'){if(mode==='crawl'){ctx.save();ctx.globalAlpha=0.95;const k=sm(q);ctx.translate(lerp(150,40,k),lerp(120,10,k));ctx.scale(lerp(0.6,1.25,k),lerp(0.6,1.25,k));mary(0,560,1.6,T,{face:true,arm:[-1.6,1.6]});ctx.restore()}
  ctx.save();ctx.translate(-40,30);thao(0,470,1.3,{eyes:1.4,pupil:2,mouth:'o',tears:true,armA:[2.9,-2.9],T});ctx.restore();
  for(const sd of [-1,1]){const yy=150-Math.abs(Math.sin(T*7+sd))*16;ctx.save();ctx.translate(-40+sd*115,yy);ctx.scale(1.5,1.5);paleHand(0,0,Math.PI+sd*0.25,T);ctx.restore()}}
 ctx.restore();ctx=old;
 if(mode==='crawl'||mode==='thao'){g.strokeStyle='rgba(220,230,255,.55)';g.lineWidth=2;const n=mode==='crawl'?7:3;for(let k=0;k<n;k++){g.beginPath();g.moveTo(w*0.32,h*0.4);let x=w*0.32,y=h*0.4;for(let j=0;j<4;j++){x+=(rnd(k*7+j)-0.5)*120;y+=(rnd(k*5+j+1)-0.5)*140;g.lineTo(x,y)}g.stroke()}}
 g.restore()}
