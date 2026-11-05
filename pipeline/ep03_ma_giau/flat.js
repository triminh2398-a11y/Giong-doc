// ===== 2D cận cảnh / thẻ chữ (khung 1280x720) =====
const FW=1280,FH=720;
function ftxt(s,x,y,size,col,o={}){ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`${o.w||'900'} ${size}px ${o.f||'"DejaVu Sans"'}`;let fs=size;const mw=o.max||FW*0.85;const tw=ctx.measureText(s).width;if(tw>mw){fs=size*mw/tw;ctx.font=`${o.w||'900'} ${fs}px ${o.f||'"DejaVu Sans"'}`}
 ctx.globalAlpha=o.a??1;ctx.lineJoin='round';if(o.glow){ctx.shadowColor=o.glow;ctx.shadowBlur=30}if(o.stroke!==0){ctx.lineWidth=o.stroke||Math.max(6,fs*0.12);ctx.strokeStyle='#000';ctx.strokeText(s,x,y)}ctx.shadowBlur=0;ctx.fillStyle=col;ctx.fillText(s,x,y);ctx.restore()}
function fbg(T,rgb='60,90,80',a=0.25){ctx.fillStyle='#050607';ctx.fillRect(0,0,FW,FH);halo(FW/2,FH*0.45,700,rgb,a);for(let k=0;k<6;k++){const x=((T*20+k*260)%1700)-200;ctx.fillStyle='rgba(160,180,175,.05)';ctx.beginPath();ctx.ellipse(x,FH*0.75+Math.sin(k)*40,320,60,0,0,7);ctx.fill()}}
function lampLight(x,y,r=900,a=0.35){halo(x,y,r,'255,180,100',a)}
function vig(a=0.75){const g=ctx.createRadialGradient(FW/2,FH/2,FH*0.3,FW/2,FH/2,FH*0.95);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${a})`);ctx.fillStyle=g;ctx.fillRect(0,0,FW,FH)}
const F={};
F.title=(lt,D,T)=>{fbg(T,'140,60,50',0.25);ctx.save();ctx.translate(FW/2,560+Math.sin(T)*4);maRung(0,0,0.9,T,{arms:[0.3,-0.3],glow:1.4});ctx.restore();
 ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(0,440,FW,280);
 const a=sm(seg(lt,0.1,0.6)),sh=lt<0.5?(Math.random()-0.5)*10:0;ftxt('MA GIẤU RỪNG U MINH',FW/2+sh,540,104,'#c41e24',{a,f:'"DejaVu Serif"',w:'bold',glow:'rgba(255,0,0,.7)'});
 ftxt('Tiếng thau không được dứt',FW/2,640,48,'#f0d890',{a:sm(seg(lt,0.5,1.1)),w:'italic bold',f:'"DejaVu Serif"'});vig()};
F.chap=(lt,D,T,n,t)=>{fbg(T,'120,60,50',0.22);const a=sm(seg(lt,0.1,0.7));ftxt('CHƯƠNG '+n,FW/2,250,44,'#e8dcc0',{a,w:'bold',f:'"DejaVu Serif"'});ftxt(t.toUpperCase(),FW/2,350,86,'#d42a2a',{a:sm(seg(lt,0.3,1.0)),f:'"DejaVu Serif"',w:'bold',glow:'rgba(255,0,0,.5)'});
 ctx.globalAlpha=a*0.7;ctx.fillStyle='#e8dcc0';ctx.fillRect(FW/2-160,420,320,3);ctx.globalAlpha=a;const sh=Math.sin(T*9)>0.6?3:0;thauAt(FW/2+sh,540,70);ctx.globalAlpha=1;vig()};
F.cta=(lt,D,T,end)=>{fbg(T,'90,140,110',0.2);ctx.save();ctx.translate(250,700);maRung(0,0,0.95,T,{arms:[0.2,end?-2.2:-0.3],a:0.95});ctx.restore();
 ftxt('CHUYỆN ĐÔNG TÂY KIM CỔ',780,200,56,'#e8dcc0',{w:'900'});const p=1+0.04*Math.sin(T*4);ctx.save();ctx.translate(780,330);ctx.scale(p,p);ctx.fillStyle='#d6242a';rrect(-230,-52,460,104,52);ctx.fill();ctx.restore();ftxt('ĐĂNG KÝ KÊNH',780,332,54,'#fff',{stroke:0});
 ftxt(end?'Bạn sẽ ở lại, hay vô rừng tìm người thật?':'Truyện ma dân gian ít ai kể',780,450,34,'#f0c060',{w:'bold'});ftxt('@chuyendongtaykimco',780,520,30,'#bbb',{w:'bold'});vig(0.6)};
