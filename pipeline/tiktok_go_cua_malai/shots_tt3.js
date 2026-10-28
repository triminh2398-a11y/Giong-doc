// ===== "Tiếng gõ cửa lúc 3 giờ sáng" — Ma Lai drawing style (helpers.js + shots.js lib) =====
const L_=(ls,i,d=0)=>ls[i]??d;
function doorM(x,y,w,h,o={}){const dx=o.shake||0;poly([[x-16+dx,y-16],[x+w+16+dx,y-16],[x+w+16+dx,y+h],[x-16+dx,y+h]],'#2a1e14',INK,5);poly([[x+dx,y],[x+w+dx,y],[x+w+dx,y+h],[x+dx,y+h]],o.col||'#4a3624',INK,5);
 ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=4;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x+dx+i*w/4,y+8);ctx.lineTo(x+dx+i*w/4,y+h-8);ctx.stroke()}poly([[x+w-70+dx,y+h*0.5-12],[x+w-20+dx,y+h*0.5-12],[x+w-20+dx,y+h*0.5+8],[x+w-70+dx,y+h*0.5+8]],'#7a6a4a',INK,3);
 if(o.under){halo(x+w/2,y+h+10,w*0.7,o.under,0.5);ctx.fillStyle=`rgba(${o.under},.9)`;ctx.fillRect(x+dx,y+h-5,w,6)}
 if(o.prints){ctx.fillStyle='rgba(40,28,18,.9)';o.prints.forEach(([px,py,r],k)=>{ctx.save();ctx.translate(x+px,y+py);ctx.rotate(r);ctx.scale(o.ps||1,o.ps||1);ctx.beginPath();ctx.ellipse(0,0,30,36,0,0,7);ctx.fill();for(let f=0;f<4;f++){ctx.beginPath();ctx.ellipse(-21+f*14,-50,6,20,0,0,7);ctx.fill()}ctx.beginPath();ctx.ellipse(32,-8,7,18,0.8,0,7);ctx.fill();ctx.fillRect(-3,28,6,36+k*6);ctx.restore()})}}
function clockM(x,y,r,h,m){circ(x,y,r,'#e6dfcf',INK,6);ctx.strokeStyle=INK;for(let i=0;i<12;i++){const a=i*Math.PI/6;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+Math.sin(a)*r*0.82,y-Math.cos(a)*r*0.82);ctx.lineTo(x+Math.sin(a)*r*0.92,y-Math.cos(a)*r*0.92);ctx.stroke()}
 const ah=(h%12+m/60)*Math.PI/6,am=m*Math.PI/30;ctx.lineCap='round';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(ah)*r*0.5,y-Math.cos(ah)*r*0.5);ctx.stroke();ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(am)*r*0.78,y-Math.cos(am)*r*0.78);ctx.stroke();circ(x,y,8,INK)}
function knockM(lt,times){let k=0;for(const t0 of times){const d=lt-t0;if(d>=0&&d<0.2)k=Math.max(k,1-d/0.2)}return k}
function feetM(cx,y,s,col='#e6e8ec'){ctx.save();ctx.translate(cx,y);ctx.scale(s,s);for(const sd of [-1,1]){ctx.save();ctx.translate(sd*64,0);
 ctx.fillStyle=col;ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-30,-40);ctx.quadraticCurveTo(-40,40,-22,66);ctx.quadraticCurveTo(0,84,22,66);ctx.quadraticCurveTo(40,40,30,-40);ctx.closePath();ctx.fill();ctx.stroke();
 for(let f=0;f<5;f++)circ(-24+f*12,-48,7,col,INK,3);ctx.restore()}ctx.restore()}
function phoneM(x,y,s){ctx.save();ctx.translate(x,y);ctx.rotate(-0.2);ctx.scale(s,s);halo(0,0,160,'150,200,255',0.4);poly([[-30,-64],[30,-64],[30,64],[-30,64]],'#1a1c22',INK,4);ctx.fillStyle='#9fd0ff';ctx.fillRect(-24,-54,48,100);ctx.restore()}
function headLying(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(-Math.PI/2);circ(0,0,58,SKIN,INK,4);ctx.fillStyle=HAIR;ctx.beginPath();ctx.arc(0,0,60,Math.PI*1.03,Math.PI*1.97);for(let i=0;i<=8;i++){const x=58-i*(116/8);ctx.lineTo(x,-20+(i%2?10:0))}ctx.closePath();ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.arc(sd*21,6,10,0.2,Math.PI-0.2);ctx.stroke()}ctx.beginPath();ctx.moveTo(-8,34);ctx.lineTo(8,34);ctx.stroke();ctx.restore()}
function hungSleep(px,y,s,T){ctx.save();ctx.translate(px,y);ctx.scale(s,s);poly([[-80,-6],[70,-6],[62,-58],[-72,-58]],'#d9d2c0',INK,3);
 const br=1+Math.sin(T*1.6)*0.02;ctx.fillStyle='#5a6a80';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(40,0);ctx.quadraticCurveTo(60,-130*br,200,-120*br);ctx.quadraticCurveTo(520,-110,640,-60);ctx.quadraticCurveTo(680,-20,690,0);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=3;for(const x of [180,320,460]){ctx.beginPath();ctx.moveTo(x,-110);ctx.quadraticCurveTo(x+20,-60,x,-4);ctx.stroke()}
 ctx.restore();headLying(px+0*s,y-60*s,0.95*s)}
function huddle(x,fy,s,T){ctx.save();ctx.beginPath();ctx.rect(-2000,-2000,5000,fy+2000);ctx.clip();
 person(x,fy+100*s,s,{shirt:'#4a3a2a',pants:'#22252b',sit:true,eyes:1.25,pupil:2,look:1,sweat:(T*0.7)%1,armA:[-0.45,0.45]});ctx.restore();
 ctx.save();ctx.translate(x,fy);ctx.scale(s,s);for(const sd of [-1,1]){ctx.save();ctx.translate(sd*24,0);ctx.rotate(sd*0.08);ctx.fillStyle='#22252b';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.roundRect(-20,-100,40,100,18);ctx.fill();ctx.stroke();ctx.fillStyle='#222';ctx.beginPath();ctx.ellipse(sd*6,2,20,8,0,0,7);ctx.fill();ctx.restore()}
 ctx.restore();phoneM(x,fy-112*s,0.45*s/1.25);for(const sd of [-1,1])circ(x+sd*20*s,fy-96*s,10*s,SKIN,INK,3)}
function feetSide(x,y,s,dir,o={}){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const col=o.col||'#e6e2d8';
 for(const dx of [0,46]){ctx.save();ctx.translate(dx,0);ctx.fillStyle=o.leg||col;ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.fillRect(-14,-170,28,140);ctx.strokeRect(-14,-170,28,140);
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-16,-40);ctx.lineTo(16,-40);ctx.quadraticCurveTo(dir*100,-20,dir*110,0);ctx.lineTo(-dir*24,0);ctx.quadraticCurveTo(-dir*30,-30,-16*dir,-40);ctx.closePath();ctx.fill();ctx.stroke();
  for(let f=0;f<3;f++)circ(dir*(104-f*10),-4-f*3,5,col,INK,2);ctx.restore()}
 if(o.skirt){poly([[-60,-300],[110,-300],[120,-150],[-70,-150]],o.skirt,INK,4)}ctx.restore()}
function sitUp(x,s,o){ctx.save();ctx.beginPath();ctx.rect(-2000,-2000,5000,3150);ctx.clip();hung(x,1150+110*s,s,Object.assign({sit:true},o));ctx.restore();
 ctx.fillStyle='#5a6a80';ctx.strokeStyle=INK;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-75*s,1152);ctx.quadraticCurveTo(x-70*s,1085,x,1088);ctx.quadraticCurveTo(x+300,1070,x+520,1100);ctx.quadraticCurveTo(x+600,1120,x+620,1152);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=3;for(const dx of [140,300,450]){ctx.beginPath();ctx.moveTo(x+dx,1082);ctx.quadraticCurveTo(x+dx+18,1115,x+dx,1150);ctx.stroke()}}
function hung(x,y,s,o={}){person(x,y,s,Object.assign({shirt:'#4a3a2a',pants:'#22252b'},o))}
function bachu(x,y,s,o={}){woman(x,y,s,Object.assign({old:true,shirt:'#4a4038',smile:false},o))}
function nightRoom(T,o={}){room(T,Object.assign({win:false},o))}
function dayVillage(T){village(T,{day:1})}
function knockTxt(kf){if(kf>0)txt('CỐC',540,420,120,'#e8e2d4',kf,{stroke:14,w:'900',f:'"DejaVu Sans"'})}
SH.hook=(lt,D,T,ls)=>{camera(540,900,1+0.08*sm(lt/D));nightRoom(T);doorM(300,520,480,740,{under:'255,200,120'});ctx.setTransform(1,0,0,1,0,0);
 txt('GÕ 4 TIẾNG',540,300,96,'#ff3a3a',1,{stroke:14,w:'900',f:'"DejaVu Sans"'});txt('= ĐỪNG MỞ CỬA',540,410,82,'#ffffff',1,{stroke:14,w:'900',f:'"DejaVu Sans"'})};
SH.title=(lt,D,T,ls)=>{ctx.fillStyle='#050404';ctx.fillRect(0,0,W,H);clockM(540,640,190,3,0);const a=sm(seg(lt,0.2,0.9));txt('TIẾNG GÕ CỬA',540,1020,104,'#d6242a',a,{glow:'#7a0a0e'});txt('Lúc ba giờ sáng',540,1110,58,'#e8dcc0',a,{w:'italic'})};
SH.rent=(lt,D,T,ls)=>{const t2=L_(ls,2,D*0.4),t3=L_(ls,3,D*0.5),t4=L_(ls,4,D*0.8);
 if(lt>=t2+1.3&&lt<t3){camera(550,1020,1.45);dayVillage(T);house(540,1180,1.3,{});bachu(460,1320,1.15,{look:1,arm:[undefined,-0.41]});hung(640,1320,1.15,{look:-1,armA:[0.41,null]});circ(551,1196,11,SKIN,INK,3);return}
 if(lt>=t3&&lt<t4){camera(540,900,1.9);dayVillage(T);house(540,1180,1.3,{});bachu(540,1300,1.5,{look:0.2,mouth:Math.sin(lt*12)>0?'o':undefined});return}
 camera(540,1000,1+0.05*sm(lt/D));dayVillage(T);house(540,1180,1.3,{});bachu(330,1320,1.15,{look:1});hung(760,1320,1.15,{look:-1,smile:lt>t4});};
SH.night1=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.5);
 if(lt<t1){camera(540,1000,1.1);nightRoom(T,{win:true,wx:640,wy:320});bed(T);hungSleep(150,1150,1.0,T);lamp(1000,1150,1.1,T,{small:0.6});return}
 ctx.fillStyle='#0a0908';ctx.fillRect(0,0,W,H);camera(540,800,1+0.1*sm(seg(lt,t1,D)));clockM(540,800,260,2,59+sm(seg(lt,t1+0.4,t1+1.0)));halo(540,800,500,'180,200,255',0.15)};
SH.knock=(lt,D,T,ls)=>{const t2=L_(ls,2,D*0.6),k=TL.knocks.filter(x=>x[2]===4&&x[0]>=TL.sc.knock-0.1&&x[0]<TL.sc.knock+D).map(x=>x[0]-TL.sc.knock);
 if(lt>=t2){camera(540,880,1.6);nightRoom(T);bed(T);sitUp(540,1.3,{eyes:1.25,pupil:2,look:lt>L_(ls,3,D)?1:0,sweat:(lt*0.7)%1,mouth:'o'});halo(1000,1100,500,'160,190,255',0.25);return}
 const kf=knockM(lt,k);camera(540,880,1.05);nightRoom(T);doorM(300,520,480,740,{under:'190,210,255',shake:kf*4});ctx.setTransform(1,0,0,1,0,0);knockTxt(kf)};
SH.door=(lt,D,T,ls)=>{camera(540,940,1.1+0.05*sm(lt/D));nightRoom(T);doorM(330,560,420,700,{under:'190,210,255'});hung(470,1262,1.84,{back:true,armA:[null,-1.36]})};
SH.phone=(lt,D,T,ls)=>{const t3=L_(ls,2,D*0.4),t4=L_(ls,4,D*0.65),t5=L_(ls,5,D*0.8);
 if(lt>=t4&&lt<t5){const k=TL.knocks.filter(x=>x[2]===4&&x[0]>=TL.sc.phone).map(x=>x[0]-TL.sc.phone);const kf=knockM(lt,k);camera(540,880,1.05);nightRoom(T);doorM(300,520,480,740,{under:'190,210,255',shake:kf*4});ctx.setTransform(1,0,0,1,0,0);knockTxt(kf);return}
 if(lt>=t5){camera(540,900,1.1+0.08*sm(seg(lt,t5,D)));nightRoom(T);doorM(300,520,480,740,{under:'210,225,255'});halo(540,1270,300,'220,230,255',0.35+0.15*Math.sin(T*3));return}
 camera(560,860,1.9);nightRoom(T);hung(540,1300,1.3,{eyes:1.2,pupil:2,look:-0.5,sweat:(lt*0.7)%1,mouth:(lt>=t3&&lt<t3+1.8&&Math.sin(lt*12)>0)?'o':undefined,phone:1})};
SH.crack=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.3),t2=L_(ls,2,D*0.7);
 if(lt<t1){ctx.fillStyle='#0c0a08';ctx.fillRect(0,0,W,H);camera(540,1100,1.0);ctx.fillStyle='#3a2c1e';ctx.fillRect(-200,700,W+400,520);ctx.fillStyle='#d8e0f0';ctx.fillRect(-200,1220,W+400,24);halo(540,1232,600,'210,225,255',0.3);ctx.fillStyle='#1c1610';ctx.fillRect(-200,1244,W+400,800);return}
 if(lt<t2){ctx.fillStyle='#0a0a0e';ctx.fillRect(0,0,W,H);camera(540,800,1+0.06*sm(seg(lt,t1,t2)));halo(540,700,600,'200,215,255',0.25);feetM(540,700,1.6);ctx.fillStyle='#1c1610';ctx.fillRect(-200,860,W+400,1200);return}
 camera(540,900,1.7);nightRoom(T);ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(760,-400);ctx.lineTo(760,1262);ctx.stroke();ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(760,-400,800,1662);huddle(620,1268,1.25,T)};
SH.morning=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.2),t2=L_(ls,2,D*0.4),t3=L_(ls,3,D*0.8);
 if(lt<t1){camera(540,1050,2.2);dayVillage(T);house(540,1180,1.3,{});ctx.save();ctx.translate(540,1180);ctx.scale(1.3,1.3);doorM(-40,-130,80,130,{col:'#7a5a3e',prints:[[18,34,-0.2],[60,26,0.15],[22,84,0.1],[62,78,-0.1]],ps:0.32});ctx.restore();return}
 if(lt>=t2&&lt<t3){camera(540,900,1.9);dayVillage(T);house(540,1180,1.3,{});bachu(540,1300,1.5,{look:0,mouth:Math.sin(lt*12)>0?'o':undefined});return}
 camera(540,1000,1.05);dayVillage(T);house(540,1180,1.3,{});bachu(330,1320,1.15,{look:1});hung(760,1320,1.15,{look:-1,eyes:1.2,sweat:(lt*0.7)%1})};
SH.night2=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.6);
 if(lt<t1){camera(540,960,1.3);nightRoom(T,{win:true,wx:640,wy:320});bed(T);sitUp(420,1.25,{eyes:1.15,look:Math.sin(T*1.2),sweat:(lt*0.7)%1});clockM(300,470,100,2,58+Math.floor(lt));lamp(900,1150,1.1,T,{});return}
 ctx.fillStyle='#0a0908';ctx.fillRect(0,0,W,H);camera(540,800,1+0.15*sm(seg(lt,t1,D)));clockM(540,800,260,3,0);halo(540,800,500,'255,200,120',0.15)};
SH.knock2=(lt,D,T,ls)=>{const t2=L_(ls,2,D*0.5),t3=L_(ls,3,D*0.7);
 if(lt>=t2&&lt<t3){camera(540,880,1.6);nightRoom(T);bed(T);sitUp(540,1.3,{eyes:1.2,look:1,mouth:'o'});lamp(900,1150,1.1,T,{});return}
 const k=TL.knocks.filter(x=>x[2]===3).map(x=>x[0]-TL.sc.knock2);const kf=knockM(lt,k);camera(540,880,1.05);nightRoom(T);doorM(300,520,480,740,{under:'255,200,120',shake:kf*4});ctx.setTransform(1,0,0,1,0,0);knockTxt(kf)};
SH.open=(lt,D,T,ls)=>{const t2=L_(ls,2,D*0.5),t3=L_(ls,3,D*0.75);
 if(lt>=t3){ctx.fillStyle='#0c0a08';ctx.fillRect(0,0,W,H);camera(540,800,1+0.1*sm(seg(lt,t3,D)));halo(540,700,600,'255,200,130',0.25);ctx.fillStyle='#2a2018';ctx.fillRect(-200,1000,W+400,1200);ctx.fillStyle='#3a2c20';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.fillRect(470,990,90,18);ctx.strokeRect(470,990,90,18);ctx.fillRect(480,300,70,690);ctx.strokeRect(480,300,70,690);feetSide(250,1000,1.3,1,{col:SKIN,leg:'#22252b'});feetSide(700,1000,1.3,1,{col:'#d8d0c4',skirt:'#1c1c20'});return}
 camera(540,950,1.05);ctx.fillStyle='#14110d';ctx.fillRect(-200,-200,W+400,H+400);ctx.fillStyle='#0a0c14';ctx.fillRect(240,300,600,1000);halo(540,380,520,'255,200,130',0.45);circ(540,340,24,'#ffd890',INK,3);
 ctx.save();ctx.beginPath();ctx.rect(240,300,600,1000);ctx.clip();bachu(540,1300,1.7,{arm:[-0.9,0.9],look:0,smile:true});
 ctx.fillStyle='#e8e2d6';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(540,1010,62,22,0,0,7);ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(240,240,240,.5)';ctx.lineWidth=3;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(522+i*18,990);ctx.quadraticCurveTo(515+i*18+Math.sin(T*2+i)*8,930,525+i*18,870);ctx.stroke()}ctx.restore();
 poly([[200,1300],[880,1300],[1000,1600],[80,1600]],'#2a2018',INK,4);
 if(lt>=t2){ctx.fillStyle='rgba(0,0,0,.55)';ctx.beginPath();ctx.moveTo(380,1600);ctx.lineTo(520,1600);ctx.lineTo(600,1900);ctx.lineTo(280,1900);ctx.fill()}};
SH.reveal=(lt,D,T,ls)=>{ctx.fillStyle='#050404';ctx.fillRect(0,0,W,H);camera(540,735,3.3+0.7*sm(lt/0.5)+0.06*lt);bachu(540,1000,1.0,{creepy:true,grin:1,t:T,tilt:-0.2});ctx.setTransform(1,0,0,1,0,0);shade(0.1,'80,0,0')};
SH.after=(lt,D,T,ls)=>{camera(540,1100,1.4+0.2*sm(lt/D));dayVillage(T);house(540,1180,1.3,{});ctx.save();ctx.translate(540,1180);ctx.scale(1.3,1.3);doorM(-40,-130,80,130,{col:'#7a5a3e',prints:[[18,34,-0.2],[60,26,0.15],[22,84,0.1],[62,78,-0.1]],ps:0.32});ctx.restore();for(const sd of [-1,1]){ctx.fillStyle='#3a5a7a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(540+sd*26,1200,20,9,sd*0.2,0,7);ctx.fill();ctx.stroke()}};
SH.end=(lt,D,T,ls)=>{ctx.fillStyle='#050404';ctx.fillRect(0,0,W,H);clockM(540,620,170,3,0);txt('CHUYỆN ĐÔNG TÂY KIM CỔ',540,940,60,'#e8dcc0',1,{w:'900',f:'"DejaVu Sans"'});ctx.fillStyle='#d6242a';ctx.beginPath();ctx.roundRect(330,990,420,96,48);ctx.fill();txt('THEO DÕI',540,1056,52,'#fff',1,{w:'900',f:'"DejaVu Sans"'})};
// subtitles & draw (override Ma Lai versions to this timeline format)
function subs(T){for(const [a,b,s,sp] of TL.subs){if(T<a||T>=b)continue;const al=Math.min(sm((T-a)/0.12),sm((b-T)/0.12));ctx.save();ctx.globalAlpha=al;ctx.textAlign='center';ctx.lineJoin='round';
 const fem=['BC','GBC','NA','GNA'].includes(sp);ctx.font='bold 58px "DejaVu Sans"';const lines=wrapText(s,900);const lh=74;const y0=1330-(lines.length-1)*lh/2;
 lines.forEach((l,i)=>{ctx.lineWidth=12;ctx.strokeStyle='#000';ctx.strokeText(l,W/2,y0+i*lh);ctx.fillStyle=sp.startsWith('G')?'#ff5050':fem?'#ff9a9a':sp==='N'?'#ffffff':'#ffd76a';ctx.fillText(l,W/2,y0+i*lh)});ctx.restore()}}
function draw(TT){const T=TT;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
 let cur=null;for(const sc of TL.scenes){if(TT>=sc[1]&&TT<sc[2]){cur=sc;break}}
 if(cur){ctx.save();SH[cur[0]](T-cur[1],cur[2]-cur[1],T,cur[3]);ctx.restore()}
 ctx.setTransform(1,0,0,1,0,0);
 if(cur&&cur[0]!=='reveal'){octx.drawImage(cv,0,0);ctx.filter='saturate(0.8) contrast(1.05) brightness(1.06)';ctx.drawImage(OFF,0,0);ctx.filter='none'}
 if(cur){const d=Math.min(TT-cur[1],cur[2]-TT);if(d<0.1&&cur[1]>0){ctx.fillStyle=`rgba(0,0,0,${1-d/0.1})`;ctx.fillRect(0,0,W,H)}}
 subs(T)}
