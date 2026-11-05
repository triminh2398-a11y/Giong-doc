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
