// ===== Ma Lai: vertical 1080x1920 =====
function halo(x,y,r,rgb,a){if(a<=0)return;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r)}
function txt(s,x,y,size,col,a=1,o={}){ctx.save();ctx.globalAlpha=a;ctx.font=`${o.w||'bold'} ${size}px ${o.f||'"DejaVu Serif"'}`;ctx.textAlign='center';if(o.stroke){ctx.lineWidth=o.stroke;ctx.strokeStyle='#000';ctx.lineJoin='round';ctx.strokeText(s,x,y)}if(o.glow){ctx.shadowColor=o.glow;ctx.shadowBlur=30}ctx.fillStyle=col;ctx.fillText(s,x,y);ctx.restore()}
function shade(a,col='0,0,0'){if(a<=0)return;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=`rgba(${col},${a})`;ctx.fillRect(0,0,W,H);ctx.restore()}

// ---------- characters ----------
function fhead(x,y,s,T,o={}){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(o.rot||0);
 halo(0,120,380,'110,255,150',0.25*(o.glow??1));
 // hair curtain behind
 const sw=Math.sin(T*1.6)*10;ctx.fillStyle='rgba(10,10,12,.95)';ctx.beginPath();ctx.moveTo(-60,-14);ctx.quadraticCurveTo(-96,150,-74+sw,320);ctx.lineTo(-34+sw*0.6,270);ctx.quadraticCurveTo(-44,120,-34,40);ctx.lineTo(34,40);ctx.quadraticCurveTo(44,120,34+sw*0.6,270);ctx.lineTo(74+sw,320);ctx.quadraticCurveTo(96,150,60,-14);ctx.fill();
 // entrails
 ctx.lineCap='round';ctx.lineJoin='round';
 if(!o.noGuts)for(let k=0;k<6;k++){const ox=(k-2.5)*12;const len=(170+rnd(k+3)*170)*(o.len??1);ctx.beginPath();ctx.moveTo(ox,44);
  for(let j=1;j<=14;j++){const yy=44+len*j/14;const xx=ox+Math.sin(T*2.3+j*0.55+k*1.7)*(5+j*2.6)+(k-2.5)*j*1.6;ctx.lineTo(xx,yy)}
  ctx.strokeStyle='#5e1c22';ctx.lineWidth=15-(k%3)*3;ctx.shadowColor='rgba(120,255,150,.95)';ctx.shadowBlur=26;ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle='rgba(170,255,185,.6)';ctx.lineWidth=3.5;ctx.stroke()}
 if(!o.noGuts){circ(-12,66,24,'#6a1e24');circ(16,80,19,'#561a20')}
 // face
 circ(0,0,58,o.skin||'#bfc4b8',INK,4);
 ctx.fillStyle=HAIR;ctx.beginPath();ctx.arc(0,0,61,Math.PI*0.98,Math.PI*2.02);ctx.quadraticCurveTo(30,-26,6,-14);ctx.quadraticCurveTo(-26,-30,-60,4);ctx.fill();
 for(let k=0;k<4;k++){ctx.strokeStyle='rgba(70,40,60,.35)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-40+k*25,-30);ctx.lineTo(-34+k*25+rnd(k)*10,-10);ctx.lineTo(-38+k*25,8);ctx.stroke()}
 for(const sd of [-1,1]){ctx.fillStyle='#030303';ctx.beginPath();ctx.ellipse(sd*21,8,16,o.closed?3:19,sd*0.15,0,7);ctx.fill();
  if(!o.closed){const c=o.glowEyes?'255,40,30':'200,255,210';halo(sd*21,10,34,c,0.55);circ(sd*21+(o.look||0)*5,10,3.2,o.glowEyes?'#ff3020':'#eaffef')}}
 ctx.fillStyle='#120404';ctx.beginPath();ctx.moveTo(-34,24);ctx.quadraticCurveTo(0,40,34,24);ctx.quadraticCurveTo(0,66,-34,24);ctx.fill();
 ctx.fillStyle='#d6d2c0';for(let k=-4;k<=4;k++){ctx.beginPath();ctx.moveTo(k*7-3,30+Math.abs(k)*-0.6);ctx.lineTo(k*7+3,30);ctx.lineTo(k*7,40-Math.abs(k));ctx.fill();ctx.beginPath();ctx.moveTo(k*7-3,50-Math.abs(k)*1.5);ctx.lineTo(k*7+3,50-Math.abs(k)*1.5);ctx.lineTo(k*7,42-Math.abs(k));ctx.fill()}
 ctx.strokeStyle='rgba(8,8,8,.95)';ctx.lineWidth=5;for(let k=0;k<8;k++){const x=-50+k*14;ctx.beginPath();ctx.moveTo(x*0.7,-55);ctx.quadraticCurveTo(x+Math.sin(T*2+k)*6,0,x*1.15+Math.sin(T*1.7+k)*10,70+rnd(k)*60);ctx.stroke()}
 ctx.fillStyle='#5a0a0e';for(let k=0;k<3;k++){const x=-14+k*14,len=20+((T*30+k*17)%50);ctx.fillRect(x-2,52,4,len);circ(x,52+len,4,'#5a0a0e')}
 ctx.restore()}
function woman(cx,fy,s,o={}){ctx.save();ctx.translate(cx,fy);ctx.scale(s,s);ctx.lineJoin='round';ctx.lineCap='round';
 const top=-232,R=56,hy=top-46,t=o.t||0;o.skin=o.skin||'#d2d1c6';const shirt=o.shirt||'#d9d4c6',pants=o.pants||'#1c1c20';
 if(o.back){ctx.save();ctx.translate(0,hy);circ(0,0,R,HAIR,INK,4);ctx.fillStyle=HAIR;ctx.fillRect(-R+4,0,2*R-8,200);ctx.restore()}
 if(!o.headless&&!o.old&&!o.back){ctx.fillStyle=HAIR;ctx.beginPath();ctx.moveTo(-R+2,hy);ctx.quadraticCurveTo(-R-18,hy+110,-48+Math.sin(t*1.3)*4,hy+210);ctx.lineTo(48+Math.sin(t*1.3+1)*4,hy+210);ctx.quadraticCurveTo(R+18,hy+110,R-2,hy);ctx.fill()}
 if(o.sit){poly([[-46,-112],[46,-112],[60,-60],[-40,-60]],pants,INK,4)}
 else poly([[-44,-112],[44,-112],[46,0],[-46,0]],pants,INK,4);
 if(o.dress)poly([[-38,top+10],[38,top+10],[56,-40],[-56,-40]],shirt,INK,4);else poly([[-40,top+10],[40,top+10],[48,-108],[-48,-108]],shirt,INK,4);
 for(const sd of [-1,1]){ctx.save();ctx.translate(sd*38,top+22);const a=(o.arm&&o.arm[sd>0?1:0]!==undefined)?o.arm[sd>0?1:0]:sd*0.12;ctx.rotate(a);ctx.strokeStyle=INK;ctx.lineWidth=22;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,88);ctx.stroke();ctx.strokeStyle=shirt;ctx.lineWidth=15;ctx.stroke();circ(0,92,8,SKIN,INK,3);ctx.restore()}
 if(o.back){}else if(o.headless){ctx.fillStyle='#d8d3c6';ctx.fillRect(-11,top-10,22,20);ctx.save();ctx.translate(0,top-10);ctx.scale(1,0.38);circ(0,0,13,'#3a0c10','#7a1a20',5);ctx.restore()}
 else{ctx.fillStyle=SKIN;ctx.fillRect(-10,top-6,20,18);
  ctx.save();ctx.translate(0,hy);ctx.rotate(o.tilt||0);circ(0,0,R,o.skin||'#e8e4da',INK,4);
  if(o.old){ctx.fillStyle='#8f8e8a';ctx.beginPath();ctx.arc(0,0,R+2,Math.PI*1.02,Math.PI*1.98);ctx.quadraticCurveTo(0,-30,-R,-6);ctx.fill();circ(0,-R-10,20,'#8f8e8a',INK,3)}
  else{ctx.fillStyle=HAIR;ctx.beginPath();ctx.arc(0,0,R+3,Math.PI*0.96,Math.PI*2.04);ctx.quadraticCurveTo(28,-24,4,-14);ctx.quadraticCurveTo(-28,-28,-R-2,6);ctx.fill()}
  const eo=o.eyes??1;for(const sd of [-1,1]){ctx.fillStyle='rgba(30,25,35,.22)';ctx.beginPath();ctx.ellipse(sd*20,9,17,14,0,0,7);ctx.fill()}
  if(o.creepy){for(const sd of [-1,1]){ctx.fillStyle='#050505';ctx.beginPath();ctx.ellipse(sd*20,6,14,15*(eo>0.15?1:0.15),0,0,7);ctx.fill();if(eo>0.15){circ(sd*20+(o.look||0)*4,6,2.6,'#e8e4d8');halo(sd*20,6,30,'120,255,160',0.15)}}
   ctx.fillStyle='#1a0808';ctx.beginPath();ctx.moveTo(-24,24);ctx.quadraticCurveTo(0,30+(o.grin||0)*16,24,24);ctx.quadraticCurveTo(0,34+(o.grin||0)*30,-24,24);ctx.fill();if(o.grin){ctx.fillStyle='#d8d4c4';for(let k=-3;k<=3;k++)ctx.fillRect(k*6-2,27+o.grin*2,4,5+o.grin*4)}
   ctx.strokeStyle='rgba(10,10,10,.9)';ctx.lineWidth=2.5;for(let k=0;k<9;k++){if(k>2&&k<6)continue;const x=-48+k*12+(rnd(k)*6);ctx.beginPath();ctx.moveTo(x*0.6,-50);ctx.quadraticCurveTo(x+Math.sin(t+k)*3,0,x*1.1+(rnd(k+4)-0.5)*20,60+rnd(k+2)*40);ctx.stroke()}}
  else for(const sd of [-1,1]){if(o.glowEyes){halo(sd*20,8,40,'255,70,50',0.6);circ(sd*20,8,6,'#ff3a2a')}else if(eo<0.15||o.closed){ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.arc(sd*20,4,10,0.2,Math.PI-0.2);ctx.stroke()}else{ctx.save();ctx.translate(sd*20,6);ctx.scale(1,eo);circ(0,0,13,'#f4f2ea',INK,3);circ((o.look||0)*5,1,o.pupil??4.5,INK);ctx.restore()}}
  if(!o.creepy){ctx.strokeStyle=o.old?INK:'#5a2a2a';ctx.lineWidth=3.5;ctx.beginPath();if(o.mouth==='o'){ctx.ellipse(0,32,6,8,0,0,7);ctx.stroke()}else if(o.smile===false){ctx.moveTo(-8,32);ctx.lineTo(8,32);ctx.stroke()}else{ctx.arc(0,24,11,0.45,Math.PI-0.45);ctx.stroke()}}
  if(false){ctx.fillStyle='rgba(210,110,110,.25)';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*32,22,9,5,0,0,7);ctx.fill()}}
  ctx.restore()}
 if(o.seam){ctx.strokeStyle='rgba(150,20,26,.9)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-11,top-6);ctx.quadraticCurveTo(0,top-2,11,top-6);ctx.stroke()}
 if(o.scarf){const fl=Math.sin(t*5)*0.5+0.5;ctx.fillStyle='#f6f4ee';ctx.strokeStyle=INK;ctx.lineWidth=3;rrect(-26,top-4,52,28,12);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(14,top+18);ctx.quadraticCurveTo(40+fl*(o.wind||0)*30,top+40,30+(o.wind||0)*(60+fl*30),top+90-(o.wind||0)*40);ctx.lineTo(16+(o.wind||0)*(50+fl*20),top+92-(o.wind||0)*40);ctx.quadraticCurveTo(22,top+40,2,top+10);ctx.fill();ctx.stroke()}
 ctx.restore()}
function tu(cx,fy,s,o={}){person(cx,fy,s,Object.assign({shirt:'#4a3a2a',pants:'#22252b'},o))}
function thay(cx,fy,s,o={}){person(cx,fy,s,Object.assign({shirt:'#1e2433',robe:true,khandong:true,beard:true,skin:'#d4cfc3'},o))}

// ---------- props & places ----------
function lamp(x,y,s,T,o={}){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const f=1+Math.sin(T*13)*0.12+Math.sin(T*7.7)*0.1;
 halo(0,-70,260,'255,190,110',0.32*(o.a??1)*f);
 poly([[-34,0],[34,0],[24,-30],[-24,-30]],'#5a4632',INK,3);ctx.globalAlpha=.55;ctx.fillStyle='#d9e3e0';ctx.beginPath();ctx.ellipse(0,-62,26,40,0,0,7);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-62,26,40,0,0,7);ctx.stroke();
 ctx.fillStyle=o.blue?'#9fd0ff':'#ffd27a';ctx.beginPath();ctx.ellipse(0,-64,6*f,14*f*(o.small||1),0,0,7);ctx.fill();ctx.restore()}
function room(T,o={}){const g=ctx.createLinearGradient(0,0,0,1300);g.addColorStop(0,'#1b1916');g.addColorStop(1,'#2a251f');ctx.fillStyle=g;ctx.fillRect(-800,-800,W+1600,2100+800);
 ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=4;for(let x=-760;x<W+800;x+=78){ctx.beginPath();ctx.moveTo(x,-800);ctx.lineTo(x,1260);ctx.stroke()}
 if(o.win!==false){const wx=o.wx??700,wy=o.wy??330,ww=o.ww??260,wh=o.wh??330;const d=o.dawn||0;
  const sg=ctx.createLinearGradient(0,wy,0,wy+wh);sg.addColorStop(0,lerpC('#0a1020','#6f7f99',d));sg.addColorStop(1,lerpC('#1a2436','#c9b49a',d));ctx.fillStyle=sg;ctx.fillRect(wx,wy,ww,wh);
  if(d<0.6){ctx.save();ctx.beginPath();ctx.rect(wx,wy,ww,wh);ctx.clip();moon(wx+ww*0.7,wy+90,30,1-d);ctx.fillStyle='#070a10';for(let i=0;i<8;i++){ctx.beginPath();ctx.arc(wx+i*40,wy+wh+20,50+rnd(i)*30,0,7);ctx.fill()}ctx.restore()}
  if(o.inWin)o.inWin(wx,wy,ww,wh);
  ctx.strokeStyle='#2a1e14';ctx.lineWidth=18;ctx.strokeRect(wx,wy,ww,wh);ctx.lineWidth=9;for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(wx+ww*i/5,wy);ctx.lineTo(wx+ww*i/5,wy+wh);ctx.stroke()}}
 ctx.fillStyle='#14110d';ctx.fillRect(-800,1260,W+1600,1400)}
function lerpC(a,b,k){const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const A=p(a),B=p(b);return 'rgb('+A.map((v,i)=>Math.round(lerp(v,B[i],cl(k)))).join(',')+')'}
function bed(T){ctx.fillStyle='#3a2c1e';ctx.fillRect(-60,1170,1200,70);ctx.strokeStyle=INK;ctx.lineWidth=5;ctx.strokeRect(-60,1170,1200,70);ctx.fillStyle='#2b2016';for(const x of [0,1000])ctx.fillRect(x,1240,40,90);
 ctx.fillStyle='#7a6745';ctx.fillRect(-40,1150,1160,24);ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=2;for(let x=-40;x<1120;x+=16){ctx.beginPath();ctx.moveTo(x,1150);ctx.lineTo(x,1174);ctx.stroke()}}
// lying wife: pillow at px, body to the right. cover 1=full, 0=pulled to waist
function wifeLying(px,y,s,T,o={}){ctx.save();ctx.translate(px,y);ctx.scale(s,s);
 poly([[-70,-10],[90,-10],[80,-60],[-60,-60]],'#d9d2c0',INK,3);
 const c=o.cover??1;
 // shoulders/body (seen from back)
 if(c<1){poly([[40,-120],[200,-130],[230,-10],[20,-10]],'#e7e2d6',INK,4);
  if(o.back){}else if(o.headless){ctx.fillStyle='#d8d3c6';ctx.fillRect(0,-92,46,26);ctx.save();ctx.translate(0,-79);ctx.scale(0.35,1);circ(0,0,15,'#3a0c10','#7a1a20',5);ctx.restore();
   ctx.strokeStyle='rgba(120,20,26,.8)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-4,-70);ctx.quadraticCurveTo(-30,-50,-40,-20);ctx.stroke()}
  else{circ(-10,-80,52,HAIR,INK,3)}}
 const bx=lerp(-80,200,1-c);ctx.fillStyle='#5b6a7a';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(bx,-10);ctx.quadraticCurveTo(bx-20,-150,bx+60,-150);ctx.quadraticCurveTo(300,-170,520,-110);ctx.quadraticCurveTo(620,-80,640,-10);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=3;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(bx+80+i*120,-140+i*8);ctx.quadraticCurveTo(bx+120+i*120,-80,bx+90+i*120,-20);ctx.stroke()}
 ctx.restore()}
function house(x,y,s,o={}){ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 poly([[-200,0],[200,0],[200,-190],[-200,-190]],o.wall||'#4a3b2c',INK,5);
 poly([[-250,-180],[250,-180],[150,-330],[-150,-330]],o.roof||'#2d2a22',INK,5);ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=3;for(let i=-220;i<230;i+=30){ctx.beginPath();ctx.moveTo(i,-182);ctx.lineTo(i*0.62,-326);ctx.stroke()}
 poly([[-40,0],[40,0],[40,-130],[-40,-130]],o.door||'#2a1e14',INK,4);
 for(const sd of [-1,1]){const lit=o.lit;poly([[sd*120-40,-90],[sd*120+40,-90],[sd*120+40,-150],[sd*120-40,-150]],lit?'#e8b860':'#15120e',INK,4);if(lit)halo(sd*120,-120,140,'255,190,100',0.25)}
 if(o.thorn){ctx.strokeStyle='#2a2216';ctx.lineWidth=5;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*120-55,-158);ctx.lineTo(sd*120+55,-158);ctx.stroke();for(let k=0;k<9;k++){const xx=sd*120-50+k*12;ctx.beginPath();ctx.moveTo(xx,-158);ctx.lineTo(xx+(k%2?6:-6),-158+(k%2?14:-14));ctx.stroke()}}}
 ctx.restore()}
function treeLine(y,col,T,seed,h=1){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-600,y+200);for(let x=-600;x<=W+600;x+=40){ctx.lineTo(x,y-(40+rnd(x*0.1+seed)*110)*h)}ctx.lineTo(W+600,y+200);ctx.fill()}
function mountains(y,col,seed,amp=260){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-600,y+300);for(let x=-600;x<=W+600;x+=120)ctx.lineTo(x,y-rnd(x+seed)*amp);ctx.lineTo(W+600,y+300);ctx.fill()}
function village(T,o={}){const d=o.day||0;sky(lerpC('#070b16','#b8c4c8',d),lerpC('#1e2838','#e9dfc4',d),1100);if(d<0.5)moon(820,300,46,1-2*d);else{halo(800,320,300,'255,240,200',0.6);circ(800,320,70,'#fff6d8')}
 mountains(900,lerpC('#0d1420','#8c9a9c',d),3);treeLine(1060,lerpC('#0a0f14','#58665a',d),T,7);
 ctx.fillStyle=lerpC('#0e1215','#7c7a5c',d);ctx.fillRect(-600,1080,W+1200,1300);
 house(250,1180,0.8,{lit:o.lit,thorn:o.thorn});house(820,1120,0.55,{lit:o.lit,thorn:o.thorn});
 banana(560,1150,0.9,T,lerpC('#10161a','#3e5040',d));bamboo(-40,1200,4,700,T,5,lerpC('#0d1316','#35463a',d));bamboo(980,1200,4,640,T,9,lerpC('#0d1316','#35463a',d))}
function crow(x,y,s,T,k){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const f=Math.sin(T*10+k)*0.6;ctx.fillStyle='#08080a';ctx.beginPath();ctx.ellipse(0,0,22,9,0,0,7);ctx.fill();for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*4,0);ctx.quadraticCurveTo(sd*30,-30*f-10,sd*60,-20*f);ctx.quadraticCurveTo(sd*30,4,sd*4,4);ctx.fill()}ctx.restore()}
function chicken(x,y,s,o={}){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(o.dead?Math.PI/2*0.95:0);
 ctx.fillStyle=o.col||'#b9a27a';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,-40,52,38,0,0,7);ctx.fill();ctx.stroke();circ(42,-86,22,o.col||'#b9a27a',INK,4);
 poly([[60,-90],[80,-84],[60,-78]],'#d9a22a',INK,3);poly([[34,-106],[40,-118],[46,-108],[52,-118],[54,-104]],'#b3262a',INK,3);
 if(o.dead){ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(42,-94);ctx.lineTo(54,-82);ctx.moveTo(54,-94);ctx.lineTo(42,-82);ctx.stroke()}else circ(48,-90,4,INK);
 ctx.strokeStyle='#a07a3a';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-10,-4);ctx.lineTo(-14,20);ctx.moveTo(10,-4);ctx.lineTo(12,20);ctx.stroke();
 if(o.rooster){ctx.fillStyle='#2b3a2e';ctx.beginPath();ctx.moveTo(-40,-50);ctx.quadraticCurveTo(-100,-130,-70,-10);ctx.fill()}
 ctx.restore()}
function cradle(x,y,s,T,o={}){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const sw=Math.sin(T*1.8)*0.12;
 ctx.strokeStyle='#3a2c1e';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-200,-380);ctx.lineTo(0,-380);ctx.moveTo(200,-380);ctx.lineTo(0,-380);ctx.stroke();ctx.rotate(sw);ctx.translate(0,-380);
 ctx.strokeStyle='#8a7a5a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-150,260);ctx.moveTo(0,0);ctx.lineTo(150,260);ctx.stroke();
 ctx.fillStyle='#8c3b30';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-160,250);ctx.quadraticCurveTo(0,380,160,250);ctx.closePath();ctx.fill();ctx.stroke();
 circ(-50,262,34,o.pale?'#b9c9c9':'#e9d9c9',INK,3);
 if(o.cry){ctx.fillStyle='#3a1a1a';ctx.beginPath();ctx.ellipse(-50,276,9,11,0,0,7);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(-50+sd*8-6,256);ctx.lineTo(-50+sd*8+6,252);ctx.stroke()}}
 ctx.restore()}
function cryLines(x,y,T,a=1){ctx.save();ctx.strokeStyle=`rgba(230,230,220,${0.7*a})`;ctx.lineWidth=5;ctx.lineCap='round';for(let i=0;i<3;i++){const r=40+((T*120+i*40)%120);ctx.globalAlpha=a*(1-((T*120+i*40)%120)/120);for(const sd of [-1,1]){ctx.beginPath();ctx.arc(x,y,r,sd>0?-0.6:Math.PI-0.6,sd>0?0.6:Math.PI+0.6);ctx.stroke()}}ctx.restore()}
function sun(x,y,T){halo(x,y,520,'255,220,120',0.6);ctx.save();ctx.translate(x,y);ctx.rotate(T*0.1);ctx.strokeStyle='rgba(255,230,150,.5)';ctx.lineWidth=10;for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);ctx.beginPath();ctx.moveTo(110,0);ctx.lineTo(170,0);ctx.stroke()}ctx.restore();circ(x,y,90,'#fff2c0')}
function mist(T,y,a=0.25){ctx.fillStyle=`rgba(180,195,200,${a})`;for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(((T*20*(i+1))%1400)-200+i*120,y+i*30,520,40,0,0,7);ctx.fill()}}
function blood(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#4a0d10';ctx.beginPath();for(let i=0;i<=24;i++){const a=i/24*Math.PI*2,r=120+rnd(i+4)*60+(i%5==0?50:0);ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r*0.45)}ctx.fill();ctx.fillStyle='rgba(120,20,26,.6)';ctx.beginPath();ctx.ellipse(-20,-6,70,22,0,0,7);ctx.fill();ctx.restore()}
function scarfItem(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#f3f1ea';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-120,0);ctx.quadraticCurveTo(-60,-60,0,-20);ctx.quadraticCurveTo(60,-70,140,-10);ctx.quadraticCurveTo(80,30,20,10);ctx.quadraticCurveTo(-50,40,-120,0);ctx.fill();ctx.stroke();ctx.restore()}
function mat(){ctx.fillStyle='#7a6745';ctx.fillRect(-200,1000,W+400,500);ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=3;for(let x=-200;x<W+200;x+=22){ctx.beginPath();ctx.moveTo(x,1000);ctx.lineTo(x,1500);ctx.stroke()}}

