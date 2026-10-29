function scaryFace(T,o={}){const R0=58,skin=o.skin||'#b9c2b8';
 if(o.woman){ctx.fillStyle='rgba(8,8,10,.97)';const sw=Math.sin(T*1.3)*8;ctx.beginPath();ctx.moveTo(-66,-20);ctx.quadraticCurveTo(-104,140,-86+sw,330);ctx.lineTo(86+sw,330);ctx.quadraticCurveTo(104,140,66,-20);ctx.fill()}
 circ(0,0,R0,skin,INK,4);
 // gò má hóp + vết nứt
 ctx.fillStyle='rgba(40,60,50,.28)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*34,26,12,20,sd*0.3,0,7);ctx.fill()}
 ctx.strokeStyle='rgba(40,30,40,.55)';ctx.lineWidth=1.6;for(let k=0;k<5;k++){ctx.beginPath();ctx.moveTo(-44+k*20,-40+rnd(k)*10);ctx.lineTo(-38+k*20+rnd(k+3)*8,-20);ctx.lineTo(-42+k*21,-4);ctx.stroke()}
 // hốc mắt đen sâu + đồng tử phát sáng
 for(const sd of [-1,1]){ctx.fillStyle='#020202';ctx.beginPath();ctx.ellipse(sd*22,6,17,o.closed?3:21,sd*0.18,0,7);ctx.fill();
  if(!o.closed){halo(sd*22,8,36,'190,255,200',0.6);circ(sd*22+(o.look||0)*5,9,3.4,'#eaffef')}
  ctx.strokeStyle='rgba(10,10,10,.95)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(sd*22,26);ctx.quadraticCurveTo(sd*24,44,sd*21,62+((T*12)%10));ctx.stroke()}
 // miệng há răng nhọn + máu
 const op=o.open??(0.6+0.25*Math.sin(T*2));ctx.fillStyle='#140404';ctx.beginPath();ctx.moveTo(-26,30);ctx.quadraticCurveTo(0,36,26,30);ctx.quadraticCurveTo(0,40+34*op,-26,30);ctx.fill();
 ctx.fillStyle='#d8d4c2';for(let k=-3;k<=3;k++){ctx.beginPath();ctx.moveTo(k*7-3,32);ctx.lineTo(k*7+3,32);ctx.lineTo(k*7,40);ctx.fill();const yb=36+30*op;ctx.beginPath();ctx.moveTo(k*6-3,yb);ctx.lineTo(k*6+3,yb);ctx.lineTo(k*6,yb-7);ctx.fill()}
 ctx.fillStyle='#5a0a0e';for(let k=0;k<2;k++){const x=-8+k*16,len=14+((T*24+k*13)%40);ctx.fillRect(x-2,44+20*op,4,len);circ(x,44+20*op+len,3.5,'#5a0a0e')}
 // tóc ướt rủ xuống che mặt
 ctx.fillStyle=HAIR;ctx.beginPath();ctx.arc(0,0,R0+3,Math.PI*0.95,Math.PI*2.05);ctx.quadraticCurveTo(26,-30,4,-20);ctx.quadraticCurveTo(-28,-32,-R0-3,6);ctx.fill();
 ctx.strokeStyle='rgba(6,6,8,.95)';ctx.lineWidth=4;const nH=o.woman?11:7;for(let k=0;k<nH;k++){const x=-52+k*(104/(nH-1));if(!o.woman&&k>2&&k<5)continue;ctx.beginPath();ctx.moveTo(x*0.7,-56);ctx.quadraticCurveTo(x+Math.sin(T*1.8+k)*6,0,x*1.12+Math.sin(T*1.5+k)*8,(o.woman?120:50)+rnd(k)*60);ctx.stroke()}}
