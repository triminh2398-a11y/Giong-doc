// ===== BỮA TỐI CÂM LẶNG (Halloween, Ireland) — nhân vật nét Ma Lai =====
function scarfDraw(y,col='#2f7a4a'){ctx.save();ctx.fillStyle=col;ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,y,46,14,0,0,7);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(14,y+6);ctx.lineTo(30,y+70);ctx.lineTo(10,y+72);ctx.lineTo(2,y+8);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=2;for(let k=-3;k<=3;k++){ctx.beginPath();ctx.moveTo(k*12,y-10);ctx.lineTo(k*12,y+10);ctx.stroke()}ctx.restore()}
function seaweed(R0,T,side){ctx.save();ctx.strokeStyle='#2e5a2a';ctx.lineWidth=5;for(let k=0;k<7;k++){if(side&&k>1&&k<5)continue;const x=-R0+k*(2*R0/6);ctx.beginPath();ctx.moveTo(x*0.8,-R0*0.7);ctx.quadraticCurveTo(x+Math.sin(T*1.3+k)*6,0,x*1.1,R0*0.9+rnd(k)*30);ctx.stroke()}ctx.restore()}
function drips(x,y,T,n=4){ctx.save();ctx.fillStyle='rgba(170,210,235,.85)';for(let k=0;k<n;k++){const yy=y+((T*90+k*37)%120);ctx.beginPath();ctx.ellipse(x+(k-n/2)*14,yy,3,6,0,0,7);ctx.fill()}ctx.restore()}
// Maeve: váy nâu, khăn len xanh (o.scarf)
function maeve(x,y,s,o={}){woman(x,y,s,Object.assign({shirt:'#6a3a2a',pants:'#3a2418',dress:true,skin:'#e8dccc',smile:false},o));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(o.scarf&&!o.back)scarfDraw(-226);
 if(o.blood){ctx.fillStyle='#8a0a10';ctx.fillRect(5,-246,4,10+((o.T||0)*8)%10);circ(7,-234+((o.T||0)*8)%10,3,'#8a0a10')}
 if(o.tears){ctx.strokeStyle='rgba(170,210,240,.9)';ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*20,-262);ctx.lineTo(sd*21,-240+((o.T||0)*20)%12);ctx.stroke()}}
 ctx.restore()}
// Nora: bé gái 12 tuổi, bím tóc, váy xanh; o.wet = ướt, rong biển
function nora(x,y,s,o={}){mai(x,y,s,Object.assign({shirt:'#2f4a6a',pants:'#1e2a3a',skin:o.wet?'#c8d2d6':'#ecdccc'},o));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(o.wet){ctx.translate(0,-278);seaweed(56,o.T||0);ctx.translate(0,278);drips(0,-200,o.T||0,5)}ctx.restore()}
// Bà ngoại: tóc bạc, khăn choàng; o.lamp = cầm đèn củ cải
function bangoai(x,y,s,o={}){woman(x,y,s,Object.assign({old:true,shirt:'#4a3a4a',pants:'#2a2228',smile:false},o));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 ctx.fillStyle='#5a2a3a';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-52,-226);ctx.quadraticCurveTo(0,-180,52,-226);ctx.lineTo(60,-150);ctx.quadraticCurveTo(0,-110,-60,-150);ctx.closePath();ctx.fill();ctx.stroke();
 if(o.lamp){ctx.translate(58,-120);turnipDraw(0,0,0.8,o.T||0);}ctx.restore()}
function turnipDraw(x,y,s,T){ctx.save();ctx.translate(x,y);ctx.scale(s,s);halo(0,0,90,'255,170,60',0.5);ctx.fillStyle='#e8e0c8';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,34,30,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#9a5aa0';ctx.beginPath();ctx.ellipse(0,-22,26,10,0,Math.PI,0);ctx.fill();
 const f=0.7+0.3*Math.sin(T*12);ctx.fillStyle=`rgba(255,${150+60*f},40,1)`;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*16,-6);ctx.lineTo(sd*6,-2);ctx.lineTo(sd*14,4);ctx.fill()}ctx.beginPath();ctx.moveTo(-16,12);for(let k=0;k<=6;k++)ctx.lineTo(-16+k*5.3,12+(k%2?6:0));ctx.lineTo(16,18);ctx.lineTo(-16,18);ctx.fill();ctx.restore()}
// Liam: ngư dân chết đuối — da xanh tái, áo len ướt, rong biển; o.rot = mặt rữa (scaryFace); o.ring = chìa nhẫn
function liam(x,fy,s,T,o={}){const skin='#b8c8cc';person(x,fy,s,Object.assign({shirt:'#3a4a5a',pants:'#22282e',skin,eyes:o.rot?1:0.9,look:o.look||0},o));ctx.save();ctx.translate(x,fy);ctx.scale(s,s);
 ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=3;for(let k=0;k<5;k++){ctx.beginPath();ctx.moveTo(-38,-200+k*18);ctx.lineTo(38,-200+k*18);ctx.stroke()}
 if(o.scarf)scarfDraw(-226);
 ctx.save();ctx.translate(0,-278);if(o.rot){halo(0,0,220,'120,255,180',0.25);scaryFace(T,{open:0.6,skin:'#9aa89a'})}seaweed(58,T,!o.rot);ctx.restore();
 drips(-30,-150,T,3);drips(30,-60,T,3);
 if(o.ring){ctx.save();ctx.translate(40,-210);ctx.rotate(-1.3);ctx.translate(0,96);halo(0,8,40,'220,230,255',0.6);ctx.strokeStyle='#d8d8e8';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,10,9,5,0,0,7);ctx.stroke();drips(0,16,T,2);ctx.restore()}
 ctx.restore()}
// Nora hồn ma (kết)
function noraGhost(x,y,s,T,o={}){ctx.save();ctx.globalAlpha=0.92;mai(x,y,s,{shirt:'#2a3a4a',pants:'#1a2228',skin:'#b8c6c8',creepy:true,grin:0.3,eyes:1,T});ctx.translate(x,y);ctx.scale(s,s);ctx.translate(0,-278);seaweed(56,T);ctx.translate(0,278);drips(0,-200,T,5);ctx.restore()}
