// ===== 2D cận cảnh / thẻ chữ (khung 1280x720) =====
const FW=1280,FH=720;
function ftxt(s,x,y,size,col,o={}){ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`${o.w||'900'} ${size}px ${o.f||'"DejaVu Sans"'}`;let fs=size;const mw=o.max||FW*0.85;const tw=ctx.measureText(s).width;if(tw>mw){fs=size*mw/tw;ctx.font=`${o.w||'900'} ${fs}px ${o.f||'"DejaVu Sans"'}`}
 ctx.globalAlpha=o.a??1;ctx.lineJoin='round';if(o.glow){ctx.shadowColor=o.glow;ctx.shadowBlur=30}if(o.stroke!==0){ctx.lineWidth=o.stroke||Math.max(6,fs*0.12);ctx.strokeStyle='#000';ctx.strokeText(s,x,y)}ctx.shadowBlur=0;ctx.fillStyle=col;ctx.fillText(s,x,y);ctx.restore()}
function fbg(T,rgb='60,90,80',a=0.25){ctx.fillStyle='#050607';ctx.fillRect(0,0,FW,FH);halo(FW/2,FH*0.45,700,rgb,a);for(let k=0;k<6;k++){const x=((T*20+k*260)%1700)-200;ctx.fillStyle='rgba(160,180,175,.05)';ctx.beginPath();ctx.ellipse(x,FH*0.75+Math.sin(k)*40,320,60,0,0,7);ctx.fill()}}
function lampLight(x,y,r=900,a=0.35){halo(x,y,r,'255,180,100',a)}
function vig(a=0.75){const g=ctx.createRadialGradient(FW/2,FH/2,FH*0.3,FW/2,FH/2,FH*0.95);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${a})`);ctx.fillStyle=g;ctx.fillRect(0,0,FW,FH)}
const F={};
F.title=(lt,D,T)=>{fbg(T,'90,140,110',0.25);ctx.save();ctx.translate(FW/2,250+Math.sin(T)*4);ctx.scale(2.6,2.6);scaryFace(T,{});ctx.restore();
 const a=sm(seg(lt,0.1,0.6)),sh=lt<0.5?(Math.random()-0.5)*10:0;ftxt('CON RANH CON LỘN',FW/2+sh,520,118,'#c41e24',{a,f:'"DejaVu Serif"',w:'bold',glow:'rgba(255,0,0,.7)'});
 ctx.fillStyle='#8a1418';ctx.globalAlpha=a;for(let i=0;i<10;i++){const x=260+i*84,len=(20+rnd(i+3)*70)*sm(seg(lt,0.4,2.5));ctx.fillRect(x,560,8,len);circ(x+4,560+len,7,'#8a1418')}ctx.globalAlpha=1;
 ftxt('Đứa con đòi nợ',FW/2,640,48,'#e8dcc0',{a:sm(seg(lt,0.5,1.1)),w:'italic bold',f:'"DejaVu Serif"'});vig()};
F.chap=(lt,D,T,n,t)=>{fbg(T,'120,60,50',0.22);const a=sm(seg(lt,0.1,0.7));ftxt('CHƯƠNG '+n,FW/2,270,44,'#e8dcc0',{a,w:'bold',f:'"DejaVu Serif"'});ftxt(t.toUpperCase(),FW/2,370,92,'#d42a2a',{a:sm(seg(lt,0.3,1.0)),f:'"DejaVu Serif"',w:'bold',glow:'rgba(255,0,0,.5)'});
 ctx.globalAlpha=a*0.7;ctx.fillStyle='#e8dcc0';ctx.fillRect(FW/2-160,440,320,3);ctx.globalAlpha=1;ctx.save();ctx.translate(FW/2,560);ctx.scale(1.4,1.4);bundle(0,0,1,{stare:true});ctx.restore();vig()};
F.cta=(lt,D,T,end)=>{fbg(T,'90,140,110',0.2);ctx.save();ctx.translate(250,640);ranh(0,0,1.7,T,{beckon:true,calm:!end,a:0.95});ctx.restore();
 ftxt('CHUYỆN ĐÔNG TÂY KIM CỔ',780,200,56,'#e8dcc0',{w:'900'});const p=1+0.04*Math.sin(T*4);ctx.save();ctx.translate(780,330);ctx.scale(p,p);ctx.fillStyle='#d6242a';rrect(-230,-52,460,104,52);ctx.fill();ctx.restore();ftxt('ĐĂNG KÝ KÊNH',780,332,54,'#fff',{stroke:0});
 ftxt(end?'Bình luận: bạn có dám nuôi đứa thứ ba?':'Truyện ma dân gian ít ai kể',780,450,34,'#f0c060',{w:'bold'});ftxt('@chuyendongtaykimco',780,520,30,'#bbb',{w:'bold'});vig(0.6)};
// cận cảnh vai có dấu chữ thập
F.vai=(lt,D,T,kind)=>{const sk0={dead:'#a8b2ae',baby:'#e6d4c2',adult:'#c9b8a2',old:'#b8ab98',kid:'#dcc8b2'}[kind],sk=sk0;ctx.fillStyle='#120c08';ctx.fillRect(0,0,FW,FH);lampLight(1000,120,900,0.25);
 const z=1+0.08*sm(lt/D);ctx.save();ctx.translate(FW/2,FH/2);ctx.scale(z,z);ctx.translate(-FW/2,-FH/2);
 if(kind==='baby'||kind==='dead'){ctx.fillStyle=krFill();ctx.fillRect(-50,470,FW+100,400)}else{ctx.fillStyle=kind==='old'?'#1e1e24':'#34465a';ctx.beginPath();ctx.moveTo(-50,520);ctx.quadraticCurveTo(400,430,700,560);ctx.lineTo(700,800);ctx.lineTo(-50,800);ctx.fill()}
 ctx.fillStyle=sk;ctx.strokeStyle=INK;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-60,560);ctx.quadraticCurveTo(300,250,760,300);ctx.quadraticCurveTo(1100,330,1360,520);ctx.lineTo(1360,800);ctx.lineTo(-60,800);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=3;if(kind==='old')for(let k=0;k<7;k++){ctx.beginPath();ctx.moveTo(500+k*60,380+k*8);ctx.quadraticCurveTo(540+k*60,370+k*8,580+k*60,385+k*8);ctx.stroke()}
 const a=kind==='kid'?0.25+0.5*sm(seg(lt,0.5,D)):kind==='adult'?0.55:0.95;ctx.globalAlpha=a;ctx.strokeStyle=CROSS;ctx.lineCap='round';ctx.lineWidth=kind==='baby'?22:16;
 if(kind==='adult'){ctx.filter='blur(6px)';ctx.lineWidth=34}
 ctx.beginPath();ctx.moveTo(620,430);ctx.lineTo(820,430);ctx.moveTo(720,340);ctx.lineTo(720,530);ctx.stroke();ctx.filter='none';
 if(kind==='dead'){ctx.strokeStyle='rgba(120,20,24,.7)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(625,430);ctx.lineTo(815,430);ctx.moveTo(720,345);ctx.lineTo(720,525);ctx.stroke()}
 ctx.globalAlpha=1;ctx.restore();vig()};
// cận cảnh bàn tay trái
F.tay=(lt,D,T,kind)=>{ctx.fillStyle='#120c08';ctx.fillRect(0,0,FW,FH);lampLight(300,100,1100,0.45);const z=1+0.1*sm(lt/D);ctx.save();ctx.translate(FW/2,FH/2+40);ctx.scale(z,z);
 const adult=kind==='black',sk=adult?'#c4b4a0':kind==='wrap'?'#c4c8c0':'#e6d4c2',S=adult?1.15:1.6;ctx.scale(S,S);
 ctx.fillStyle=adult?'#34465a':krFill();ctx.fillRect(-700,90,1400,400);
 ctx.fillStyle=sk;ctx.strokeStyle=INK;ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(0,40,120,95,0,0,7);ctx.fill();ctx.stroke();ctx.fillRect(-60,80,120,80);
 const fing=[[-95,-30,-0.5,95],[-45,-75,-0.15,120],[10,-82,0.05,128],[62,-70,0.25,112],[105,-20,0.55,80]];// ngón cái..út? (út là ngón cuối)
 fing.forEach(([fx,fy,a,len],i)=>{const pinky=i===4;if(pinky&&(kind==='scar'))return;ctx.save();ctx.translate(fx,fy);ctx.rotate(a);ctx.fillStyle=sk;ctx.strokeStyle=INK;ctx.lineWidth=5;rrect(-17,-len*0.6,34,len,16);ctx.fill();ctx.stroke();
  if(pinky&&kind==='wrap'){ctx.fillStyle='#f0eee6';rrect(-20,-len*0.5,40,len*0.8,14);ctx.fill();ctx.stroke();ctx.fillStyle='rgba(140,20,24,.6)';ctx.beginPath();ctx.ellipse(0,-len*0.4,10,8,0,0,7);ctx.fill()}
  if(pinky&&kind==='black'){const g=ctx.createLinearGradient(0,-len*0.6,0,len*0.4);g.addColorStop(0,'#141018');g.addColorStop(1,'rgba(40,30,50,0.2)');ctx.fillStyle=g;rrect(-17,-len*0.6,34,len,16);ctx.fill()}
  ctx.restore()});
 if(kind==='scar'){ctx.fillStyle='#c24a48';ctx.strokeStyle='#7a2020';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(118,-18,16,13,0.5,0,7);ctx.fill();ctx.stroke()}
 ctx.restore();vig()};
// cận mặt em bé
F.be=(lt,D,T,o={})=>{ctx.fillStyle='#0e0a08';ctx.fillRect(0,0,FW,FH);lampLight(1050,150,1000,0.4);const z=1+0.1*sm(lt/D);ctx.save();ctx.translate(FW/2,FH/2+30);ctx.scale(z,z);
 ctx.fillStyle=krFill();ctx.beginPath();ctx.ellipse(0,40,420,260,0,0,7);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=6;ctx.stroke();
 const sk=o.dead?'#aebab6':'#e6d4c2';circ(0,-20,190,sk,INK,6);if(o.dead){for(const sd of [-1,1]){ctx.fillStyle='rgba(40,50,70,.45)';ctx.beginPath();ctx.ellipse(sd*70,-12,52,42,0,0,7);ctx.fill()}}ctx.fillStyle=HAIR;ctx.beginPath();ctx.arc(0,-20,192,Math.PI*1.12,Math.PI*1.88);ctx.quadraticCurveTo(0,-150,-160,-110);ctx.fill();
 for(const sd of [-1,1]){ctx.save();ctx.translate(sd*70,-20);if(o.closed){ctx.strokeStyle=INK;ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,0,26,0.2,Math.PI-0.2);ctx.stroke()}else{ctx.fillStyle='#f2efe6';ctx.strokeStyle=INK;ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(0,0,34,26,0,0,7);ctx.fill();ctx.stroke();const lk=o.look??0;circ(lk*10,2,o.dead?9:19,'#0a0a0a');if(!o.dead)circ(lk*10-6,-5,4,'#fff')}ctx.restore()}
 ctx.strokeStyle='#4a1a1a';ctx.lineWidth=7;ctx.beginPath();if(o.grin){const g=o.grin;ctx.moveTo(-60,60);ctx.quadraticCurveTo(0,60+50*g,60,60);ctx.quadraticCurveTo(70,50,76,40)}else{ctx.moveTo(-22,70);ctx.lineTo(22,70)}ctx.stroke();
 ctx.fillStyle='rgba(220,120,120,.18)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*110,40,34,20,0,0,7);ctx.fill()}
 ctx.restore();if(o.dark)halo(FW/2,FH/2,800,'0,0,0',0);vig(0.8)};
// lưng em bé có 5 dấu tay bùn
F.lung=(lt,D,T)=>{ctx.fillStyle='#0c0c10';ctx.fillRect(0,0,FW,FH);halo(300,80,1000,'150,180,230',0.3);const z=1+0.08*sm(lt/D);ctx.save();ctx.translate(FW/2,FH/2);ctx.scale(z,z);
 ctx.fillStyle='#3a2a1e';ctx.fillRect(-800,-400,1600,800);ctx.fillStyle='#e6d4c2';ctx.strokeStyle=INK;ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(0,40,330,240,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle=krFill();ctx.fillRect(-340,200,680,120);
 ctx.strokeStyle='rgba(0,0,0,.15)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,-180);ctx.lineTo(0,200);ctx.stroke();
 const hp=[[-150,-90,-0.4],[120,-110,0.3],[-60,40,0.1],[170,60,0.6],[-190,110,-0.7]];hp.forEach(([x,y,a],i)=>{if(lt<0.35*i)return;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle='rgba(60,42,24,.88)';ctx.beginPath();ctx.ellipse(0,10,30,36,0,0,7);ctx.fill();for(let f=0;f<5;f++){ctx.save();ctx.rotate(-0.9+f*0.42);ctx.beginPath();ctx.ellipse(0,-46,8,20,0,0,7);ctx.fill();ctx.restore()}ctx.restore()});
 ctx.restore();vig(0.8)};
// mặt ma nhảy ra (jumpscare)
function jumpFace(dt,T){ctx.fillStyle='#030303';ctx.fillRect(0,0,FW,FH);halo(FW/2,FH/2,700,'120,255,160',0.2);ctx.save();ctx.translate(FW/2,FH/2-40);ctx.scale(5.4,5.4);ctx.rotate(0.12);scaryFace(dt*3+T,{open:0.85});ctx.restore()}

// dấu tay bùn trên đất dẫn về gò mả
F.dautay=(lt,D,T)=>{ctx.fillStyle='#5a4a34';ctx.fillRect(0,0,FW,FH);for(let i=0;i<400;i++){ctx.fillStyle=`rgba(${rnd(i)>0.5?90:20},${rnd(i)>0.5?75:15},${50},.35)`;ctx.beginPath();ctx.ellipse(rnd(i*3)*FW,rnd(i*7)*FH,3+rnd(i)*14,2+rnd(i+1)*6,rnd(i)*3,0,7);ctx.fill()}
 halo(420,600,900,'255,180,100',0.45);const z=1+0.06*sm(lt/D);ctx.save();ctx.translate(FW/2,FH/2);ctx.scale(z,z);ctx.translate(-FW/2,-FH/2);
 for(let i=0;i<9;i++){const t=i/8,x=lerp(380,820,t)+(i%2?-34:34)*(1-t),y=lerp(690,210,t),s=lerp(1.25,0.45,t);if(lt<0.25*i)continue;ctx.save();ctx.translate(x,y);ctx.scale(s,s*0.55);ctx.rotate((i%2?0.3:-0.3));ctx.fillStyle='rgba(22,14,6,.95)';ctx.beginPath();ctx.ellipse(0,10,26,30,0,0,7);ctx.fill();for(let f=0;f<5;f++){ctx.save();ctx.rotate(-0.9+f*0.42);ctx.beginPath();ctx.ellipse(0,-40,7,17,0,0,7);ctx.fill();ctx.restore()}ctx.restore()}
 ctx.restore();ctx.fillStyle='#a8905e';ctx.fillRect(0,FH-70,FW*0.45,70);ctx.strokeStyle='#7a2a2a';ctx.lineWidth=5;ctx.strokeRect(10,FH-60,FW*0.45-20,80);vig(0.85)};
