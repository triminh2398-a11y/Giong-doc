// ===== MA TRÀNH — TikTok 9:16, nét Ma Lai =====
const TAM={shirt:'#35485a',pants:'#22252b'};
function tam(x,y,s,o={}){person(x,y,s,Object.assign({},TAM,o))}
function sau(x,y,s,o={}){person(x,y,s,Object.assign({beard:true,hair:'#a6a49d',shirt:'#3d4636',pants:'#2a2a26',skin:'#d6cfc1'},o))}
function me(x,y,s,o={}){woman(x,y,s,Object.assign({shirt:'#5a4636',pants:'#1c1c20',smile:false},o))}
function talk(lt,on=true){return on&&Math.sin(lt*13)>0?'o':undefined}
// ---------- con cọp ----------
function tigerHead(x,y,s,T,o={}){const vis=o.vis??1;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 ctx.globalAlpha=vis;
 for(const sd of [-1,1]){poly([[sd*70,-96],[sd*128,-138],[sd*120,-70]],'#8a4a1c',INK,5)}
 // mặt + bờm má nhọn
 ctx.fillStyle='#a8581e';ctx.strokeStyle=INK;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(0,-118);ctx.quadraticCurveTo(110,-118,128,-40);
 const pts=[[170,-10],[140,20],[178,48],[132,70],[150,104],[96,104],[60,140],[0,150]];for(const [px,py] of pts)ctx.lineTo(px,py);
 for(const [px,py] of pts.slice(0,-1).reverse())ctx.lineTo(-px,py);ctx.lineTo(-128,-40);ctx.quadraticCurveTo(-110,-118,0,-118);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle='#d9cdb8';ctx.beginPath();ctx.moveTo(-30,10);ctx.quadraticCurveTo(-96,40,-80,96);ctx.quadraticCurveTo(-40,140,0,146);ctx.quadraticCurveTo(40,140,80,96);ctx.quadraticCurveTo(96,40,30,10);ctx.closePath();ctx.fill();
 ctx.fillStyle='#0c0807';
 for(const [dx,len] of [[-30,46],[0,58],[30,46]]){ctx.beginPath();ctx.moveTo(dx-8,-116);ctx.lineTo(dx+8,-116);ctx.lineTo(dx,-116+len);ctx.closePath();ctx.fill()}
 for(const sd of [-1,1]){for(const [yy,len] of [[-60,60],[-20,70],[22,62],[60,50]]){ctx.beginPath();ctx.moveTo(sd*150,yy-12);ctx.lineTo(sd*150,yy+12);ctx.lineTo(sd*(150-len),yy+2);ctx.closePath();ctx.fill()}
  // lông mày dữ: sọc đen xéo xuống giữa
  ctx.beginPath();ctx.moveTo(sd*92,-56);ctx.lineTo(sd*14,-30);ctx.lineTo(sd*20,-18);ctx.lineTo(sd*90,-40);ctx.closePath();ctx.fill()}
 // nếp nhăn sống mũi
 ctx.strokeStyle='#2a1208';ctx.lineWidth=4;for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(-14,8+k*9);ctx.quadraticCurveTo(0,2+k*9,14,8+k*9);ctx.stroke()}
 // mõm gầm
 ctx.fillStyle='#1a0606';ctx.beginPath();ctx.moveTo(-58,74);ctx.quadraticCurveTo(0,58,58,74);ctx.quadraticCurveTo(48,138,0,142);ctx.quadraticCurveTo(-48,138,-58,74);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.stroke();
 ctx.fillStyle='#7a1e22';ctx.beginPath();ctx.ellipse(0,120,26,12,0,0,7);ctx.fill();
 ctx.fillStyle='#efeadc';for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*44,72);ctx.lineTo(sd*28,72);ctx.lineTo(sd*34,112);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(sd*40,138);ctx.lineTo(sd*26,136);ctx.lineTo(sd*34,108);ctx.closePath();ctx.fill()}
 ctx.fillStyle='#2a1410';ctx.beginPath();ctx.moveTo(-24,40);ctx.lineTo(24,40);ctx.lineTo(0,62);ctx.closePath();ctx.fill();
 // bóng tối phủ (nổi lên từ bóng đêm)
 const hp=new Path2D();hp.moveTo(0,-118);hp.quadraticCurveTo(110,-118,128,-40);for(const [px,py] of pts)hp.lineTo(px,py);for(const [px,py] of pts.slice(0,-1).reverse())hp.lineTo(-px,py);hp.lineTo(-128,-40);hp.quadraticCurveTo(-110,-118,0,-118);hp.closePath();
 for(const sd of [-1,1]){hp.moveTo(sd*70,-96);hp.lineTo(sd*128,-138);hp.lineTo(sd*120,-70);hp.closePath()}
 ctx.save();ctx.clip(hp);const g=ctx.createRadialGradient(0,-10,40,0,0,200);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.75)');ctx.fillStyle=g;ctx.fillRect(-220,-220,440,420);ctx.restore();
 ctx.globalAlpha=1;
 // mắt phát sáng (luôn rõ)
 for(const sd of [-1,1]){halo(sd*48,-14,80,'255,200,50',0.45);ctx.save();ctx.translate(sd*48,-14);ctx.rotate(sd*0.32);ctx.fillStyle='#ffd83a';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-26,0);ctx.quadraticCurveTo(0,-16,26,0);ctx.quadraticCurveTo(0,14,-26,0);ctx.fill();ctx.stroke();ctx.fillStyle='#0a0a0a';ctx.beginPath();ctx.ellipse(0,0,4,12,0,0,7);ctx.fill();ctx.restore()}
 ctx.restore()}
function tigerEyes(x,y,s,T,a=1){const b=Math.sin(T*0.7)>0.96?0.15:1;ctx.save();ctx.translate(x,y);ctx.scale(s,s);for(const sd of [-1,1]){halo(sd*46,0,80,'255,200,60',0.4*a);ctx.save();ctx.translate(sd*46,0);ctx.rotate(sd*0.18);ctx.scale(1,b);ctx.globalAlpha=a;ctx.fillStyle='#f6d63a';ctx.beginPath();ctx.moveTo(-24,0);ctx.quadraticCurveTo(0,-20,24,0);ctx.quadraticCurveTo(0,18,-24,0);ctx.fill();ctx.fillStyle='#0a0a0a';ctx.beginPath();ctx.ellipse(0,0,4,14,0,0,7);ctx.fill();ctx.restore()}ctx.globalAlpha=1;ctx.restore()}
// ---------- ma trành ----------
const TR_SKIN='#b7c3bf';
function hollow(x,y,s,T){for(const sd of [-1,1]){ctx.fillStyle='#050607';ctx.beginPath();ctx.ellipse(x+sd*21*s,y+7*s,16*s,18*s,0,0,7);ctx.fill();circ(x+sd*21*s,y+9*s,2.6*s,'#dfe8e4',null)}
 ctx.strokeStyle='rgba(10,12,12,.7)';ctx.lineWidth=3*s;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(x+sd*21*s,y+24*s);ctx.lineTo(x+sd*23*s,y+44*s);ctx.stroke()}}
function claws(x,y,s){ctx.strokeStyle='rgba(90,14,16,.9)';ctx.lineWidth=7*s;ctx.lineCap='round';for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x-30*s+i*18*s,y-40*s);ctx.lineTo(x-6*s+i*18*s,y+30*s);ctx.stroke()}}
function tranh(x,fy,s,T,o={}){const bob=Math.sin(T*1.4)*7*s,y=fy-16*s+bob;ctx.save();ctx.globalAlpha=o.a??0.88;
 halo(x,y-200*s,300*s,'150,215,200',0.22);
 const wav=o.beckon?-2.0+Math.sin(T*3.2)*0.35:null;
 if(o.woman){woman(x,y,s,{shirt:'#5d5650',pants:'#2a2c2e',skin:TR_SKIN,arm:o.beckon?[undefined,wav]:undefined,eyes:1,smile:false});hollow(x,y-278*s,s,T)}
 else{person(x,y,s,{shirt:'#566260',pants:'#343c3c',skin:TR_SKIN,hair:'#121416',armA:o.beckon?[null,wav]:undefined});hollow(x,y-278*s,s,T);claws(x,y-170*s,s)}
 ctx.restore();ctx.globalAlpha=1}
// ---------- bối cảnh ----------
function forest(T,o={}){const d=o.day||0;sky(lerpC('#05080e','#9aa6a0',d),lerpC('#121a22','#c8c2a6',d),1100);if(o.moon!==false&&d<0.5)moon(o.mx??800,o.my??260,44,1);
 mountains(820,lerpC('#0a1018','#7d8a86',d),11,200);treeLine(980,lerpC('#070b0e','#4c5a4c',d),T,3,1.6);treeLine(1100,lerpC('#05080a','#3d4a3e',d),T,8,1.3);
 ctx.fillStyle=lerpC('#0b0e0f','#5d5a44',d);ctx.fillRect(-600,1120,W+1200,1400);
 bamboo(-60,1240,5,900,T,2,lerpC('#0a1012','#2c3a30',d));bamboo(930,1240,5,860,T,6,lerpC('#0a1012','#2c3a30',d));if(d<0.5)mist(T,1080,0.12)}
function stilt(x,y,s,o={}){ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 for(const px of [-230,-80,80,230]){ctx.fillStyle='#2e2418';ctx.fillRect(px-10,-170,20,170);ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.strokeRect(px-10,-170,20,170)}
 poly([[-270,-170],[270,-170],[270,-195],[-270,-195]],'#3d3022',INK,5);
 poly([[-240,-195],[240,-195],[240,-400],[-240,-400]],o.wall||'#4a3b2c',INK,5);
 ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=3;for(let i=-220;i<240;i+=34){ctx.beginPath();ctx.moveTo(i,-200);ctx.lineTo(i,-396);ctx.stroke()}
 poly([[-300,-385],[300,-385],[140,-600],[-140,-600]],'#3a3426',INK,5);ctx.strokeStyle='rgba(0,0,0,.3)';for(let i=-280;i<290;i+=26){ctx.beginPath();ctx.moveTo(i,-388);ctx.lineTo(i*0.47,-596);ctx.stroke()}
 const dc=o.open?'#05070a':'#2a1e14';poly([[-45,-195],[45,-195],[45,-330],[-45,-330]],dc,INK,4);if(o.open){ctx.save();ctx.globalAlpha=0.5;halo(0,-260,120,'170,190,210',0.4);ctx.restore()}
 for(const sd of [-1,1]){poly([[sd*150-38,-250],[sd*150+38,-250],[sd*150+38,-320],[sd*150-38,-320]],o.lit?'#e8b860':'#15120e',INK,4);if(o.lit)halo(sd*150,-285,160,'255,190,100',0.28)}
 ctx.strokeStyle='#3a2c1e';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(-60,0);ctx.lineTo(-30,-185);ctx.moveTo(30,0);ctx.lineTo(10,-185);ctx.stroke();ctx.lineWidth=7;for(let k=1;k<6;k++){const t=k/6;ctx.beginPath();ctx.moveTo(-60+30*t,-185*t);ctx.lineTo(30-20*t,-185*t);ctx.stroke()}
 ctx.restore()}
function ground(col='#3b3226'){ctx.fillStyle=col;ctx.fillRect(-600,-600,W+1200,H+1200);for(let i=0;i<220;i++){ctx.fillStyle=`rgba(0,0,0,${0.08+rnd(i)*0.12})`;ctx.beginPath();ctx.ellipse(rnd(i*3)*W*1.3-120,rnd(i*7)*H*1.2-100,6+rnd(i)*20,3+rnd(i*5)*8,rnd(i*2)*3,0,7);ctx.fill()}}
function paw(x,y,s,r,col='rgba(20,14,10,.85)'){ctx.save();ctx.translate(x,y);ctx.rotate(r);ctx.scale(s,s);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-40,10);ctx.quadraticCurveTo(-46,-26,-16,-24);ctx.quadraticCurveTo(0,-14,16,-24);ctx.quadraticCurveTo(46,-26,40,10);ctx.quadraticCurveTo(0,44,-40,10);ctx.fill();for(const [tx,ty] of [[-42,-50],[-15,-66],[15,-66],[42,-50]]){ctx.beginPath();ctx.ellipse(tx,ty,13,17,tx*0.006,0,7);ctx.fill()}ctx.restore()}
function foot(x,y,s,r,left,col='rgba(20,14,10,.8)'){ctx.save();ctx.translate(x,y);ctx.rotate(r);ctx.scale(left?-s:s,s);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-14,30);ctx.quadraticCurveTo(-20,-10,-14,-34);ctx.quadraticCurveTo(0,-46,14,-30);ctx.quadraticCurveTo(10,-6,16,14);ctx.quadraticCurveTo(14,40,-14,30);ctx.fill();for(let k=0;k<5;k++){ctx.beginPath();ctx.arc(-12+k*7,-46+Math.abs(k-1)*2,4.5-k*0.5,0,7);ctx.fill()}ctx.restore()}
function trackRow(kind,x0,y0,x1,y1,n,s,a=1){for(let i=0;i<n;i++){const t=i/(n-1),x=lerp(x0,x1,t)+(i%2?16:-16)*s,y=lerp(y0,y1,t);const r=Math.atan2(x1-x0,-(y1-y0));if(kind==='paw')paw(x,y,s,r,`rgba(20,14,10,${0.85*a})`);else foot(x,y,s,r,i%2,`rgba(20,14,10,${0.8*a})`)}}
function nonla(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);circ(0,0,80,'#d9c58e',INK,4);ctx.strokeStyle='rgba(120,90,40,.5)';ctx.lineWidth=3;for(const r of [62,44,26])circ(0,0,r,null,'rgba(120,90,40,.5)',3);circ(0,0,8,'#b89a5a');ctx.restore()}
function stream(T,y,d=1){ctx.fillStyle=lerpC('#0c1620','#5a7a86',d);ctx.fillRect(-600,y,W+1200,170);ctx.strokeStyle=`rgba(230,240,245,${0.25+0.2*d})`;ctx.lineWidth=4;for(let i=0;i<9;i++){const xx=((i*170+T*40)%1500)-200;ctx.beginPath();ctx.moveTo(xx,y+30+i%3*45);ctx.quadraticCurveTo(xx+40,y+20+i%3*45,xx+90,y+30+i%3*45);ctx.stroke()}
 for(const [rx,rs] of [[120,1],[860,1.3],[620,0.8]]){ctx.fillStyle=lerpC('#14181a','#6a6a62',d);ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(rx,y+170,60*rs,26*rs,0,0,7);ctx.fill();ctx.stroke()}}
function pile(x,y,s,col,col2){ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 poly([[-110,0],[110,0],[104,-40],[-104,-40]],col2,INK,4);ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-10,-38);ctx.lineTo(-10,-2);ctx.stroke();
 poly([[-96,-40],[96,-40],[92,-96],[-92,-96]],col,INK,4);
 ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*62,-94);ctx.lineTo(sd*62,-42);ctx.stroke()}
 poly([[-34,-96],[0,-60],[34,-96]],'rgba(0,0,0,.25)',INK,3);poly([[-34,-96],[-12,-96],[0,-78],[12,-96],[34,-96],[0,-64]],col,INK,3);
for(let k=0;k<2;k++)circ(0,-54+k*7,3.5,'#e0d8c6',INK,1.5);
 ctx.restore()}
function shrine(x,y,s,T){ctx.save();ctx.translate(x,y);ctx.scale(s,s);poly([[-120,0],[120,0],[110,-60],[-110,-60]],'#8a8478',INK,5);poly([[-100,-60],[100,-60],[100,-260],[-100,-260]],'#a39c8c',INK,5);poly([[-140,-250],[140,-250],[90,-340],[-90,-340]],'#5a2e22',INK,5);
 poly([[-70,-80],[70,-80],[70,-230],[-70,-230]],'#7a1e1a',INK,4);ctx.restore();tigerHead(x,y-155*s,0.42*s,T,{glow:false});ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 poly([[-60,-60],[60,-60],[52,-90],[-52,-90]],'#3a2a1c',INK,3);ctx.strokeStyle='#c8902a';ctx.lineWidth=3;for(let k=-1;k<=1;k++){ctx.beginPath();ctx.moveTo(k*14,-90);ctx.lineTo(k*16,-130);ctx.stroke();circ(k*16,-131,3,'#ff7030')}
 ctx.strokeStyle='rgba(220,220,220,.35)';ctx.lineWidth=3;for(let k=-1;k<=1;k++){ctx.beginPath();ctx.moveTo(k*16,-134);ctx.quadraticCurveTo(k*16+Math.sin(T*2+k)*14,-180,k*16+6,-230);ctx.stroke()}ctx.restore()}
function interior(T,o={}){room(T,Object.assign({win:true,wx:640,wy:330,ww:240,wh:300},o));bed(T);if(o.lamp!==false)lamp(960,1150,1.0,T,{a:o.la??1})}
function tears(x,y,s,T){ctx.fillStyle='rgba(190,215,235,.9)';for(const sd of [-1,1]){const k=(T*0.8+(sd>0?0.5:0))%1;ctx.beginPath();ctx.ellipse(x+sd*21*s,y+(26+k*40)*s,5*s,8*s,0,0,7);ctx.fill()}}
function spear(x0,y0,x1,y1){ctx.strokeStyle='#5a4028';ctx.lineWidth=9;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();const a=Math.atan2(y1-y0,x1-x0);ctx.save();ctx.translate(x1,y1);ctx.rotate(a);poly([[0,-12],[46,0],[0,12]],'#9aa0a4',INK,3);ctx.restore()}
function huddle2(x,fy,s,T){ctx.save();ctx.beginPath();ctx.rect(-2000,-2000,5000,fy+2000);ctx.clip();tam(x,fy+100*s,s,{sit:true,eyes:1.25,pupil:2,look:1,sweat:(T*0.7)%1,armA:[-0.45,0.45]});ctx.restore();
 ctx.save();ctx.translate(x,fy);ctx.scale(s,s);for(const sd of [-1,1]){ctx.save();ctx.translate(sd*24,0);ctx.rotate(sd*0.08);ctx.fillStyle='#22252b';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.roundRect(-20,-100,40,100,18);ctx.fill();ctx.stroke();ctx.fillStyle='#222';ctx.beginPath();ctx.ellipse(sd*6,2,20,8,0,0,7);ctx.fill();ctx.restore()}ctx.restore();
 for(const sd of [-1,1])circ(x+sd*20*s,fy-96*s,10*s,SKIN,INK,3)}
function bigTitle(s1,y,size,col,a,T,lt){const sh=lt<0.5?(Math.random()-0.5)*12:0;txt(s1,540+sh,y,size,col,a,{glow:'rgba(255,0,0,.6)'});ctx.globalAlpha=a;ctx.fillStyle='#8a1418';for(let i=0;i<8;i++){const x=200+i*95,len=(30+rnd(i+3)*90)*sm(seg(lt,0.4,2.5));ctx.fillRect(x,y+5,10,len);circ(x+5,y+5+len,9,'#8a1418')}ctx.globalAlpha=1}
// ---------- cảnh ----------
SH.hook=(lt,D,T,ls)=>{camera(540,980,1+0.1*sm(lt/D));forest(T,{mx:860,my:560});tigerEyes(760,880,0.75,T,0.6+0.4*sm(lt/D));tranh(470,1250,1.2,T,{beckon:true});
 ctx.setTransform(1,0,0,1,0,0);txt('NGƯỜI CHẾT GỌI TÊN',540,250,84,'#ffffff',1,{stroke:14,w:'900',f:'"DejaVu Sans"'});txt('ĐỪNG TRẢ LỜI!',540,370,110,'#ff2a2a',1,{stroke:16,w:'900',f:'"DejaVu Sans"'})};
SH.hook2=(lt,D,T,ls)=>{const p=sm(seg(lt,0,D*0.8));camera(560,900,1.25+0.35*p);forest(T,{mx:860,my:560});tigerHead(720,830,0.95+0.2*p,T,{vis:0.2+0.7*p});tranh(470,1250,1.2,T,{beckon:true})};
SH.title=(lt,D,T,ls)=>{ctx.fillStyle='#040506';ctx.fillRect(0,0,W,H);halo(540,600,700,'60,90,80',0.25);tigerHead(540,470+Math.sin(T)*6,1.5,T,{vis:0.8});tranh(540,1060,0.95,T,{beckon:true,a:0.95});
 const a=sm(seg(lt,0.1,0.6));bigTitle('MA TRÀNH',1230,165,'#c41e24',a,T,lt);txt('Hồn người dẫn cọp về làng',540,1400,58,'#e8dcc0',sm(seg(lt,0.5,1.1)),{w:'italic bold'})};
SH.village=(lt,D,T,ls)=>{camera(540,1000,1+0.05*sm(lt/D));village(T,{day:1})};
SH.shrine=(lt,D,T,ls)=>{camera(540,1020,1.15+0.05*sm(lt/D));village(T,{day:0.85});shrine(560,1240,1.3,T);woman(330,1300,1.05,{old:true,shirt:'#4a4038',back:true})};
SH.loss=(lt,D,T,ls)=>{const p=sm(lt/D);camera(540,1000,1.05);forest(T,{day:0.6,moon:false});ctx.fillStyle='#4a4636';ctx.beginPath();ctx.moveTo(380,1400);ctx.lineTo(700,1400);ctx.lineTo(560,1120);ctx.lineTo(520,1120);ctx.closePath();ctx.fill();
 const s=lerp(1.0,0.45,p),y=lerp(1360,1180,p);person(540,y,s,{shirt:'#6a5a3a',pants:'#2e2a22',back:true,phase:T*6});ctx.save();ctx.translate(540,y);ctx.scale(s,s);poly([[-38,-250],[38,-250],[30,-130],[-30,-130]],'#8a6a3a',INK,4);ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=3;for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(-34,-230+k*28);ctx.lineTo(34,-230+k*28);ctx.stroke()}ctx.restore()};
SH.clothes=(lt,D,T,ls)=>{camera(540,1100,1.25+0.15*sm(lt/D));forest(T,{day:0.7,moon:false});stream(T,1130,0.8);ctx.fillStyle='#4e4a38';ctx.fillRect(-600,1300,W+1200,800);pile(540,1290,1.1,'#6a5a3a','#2e2a22')};
SH.prints=(lt,D,T,ls)=>{camera(540,960,1.1+0.1*sm(lt/D));ground('#4a3f2c');trackRow('paw',300,1500,760,500,5,1.7);nonla(760,1180,1.05);pile(260,700,0.8,'#6a5a3a','#2e2a22')};
SH.oldman=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.5);
 if(lt<t1){camera(540,1050,1.2);forest(T,{day:0.7,moon:false});stream(T,1130,0.8);ctx.fillStyle='#4e4a38';ctx.fillRect(-600,1300,W+1200,800);pile(380,1330,0.9,'#6a5a3a','#2e2a22');sau(680,1330,1.15,{look:-1,tilt:Math.sin(T*5)*0.07});return}
 camera(540,880,1.9);forest(T,{day:0.7,moon:false});sau(540,1330,1.25,{look:0.3,mouth:talk(lt),eyes:0.8})};
SH.procession=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.5);camera(540,980,1.05);forest(T,{mx:850,my:240});
 if(lt<t1){const p=lt/t1;const x=lerp(150,760,p);tigerEyes(x-330,900,0.6,T,0.9);tranh(x,1240,1.0,T,{});return}
 house(860,1180,0.9,{lit:true});tigerEyes(250,920,0.6,T,0.9);tranh(560,1240,1.0,T,{beckon:true})};
SH.oldman2=(lt,D,T,ls)=>{camera(540,880,2.0);forest(T,{day:0.6,moon:false});sau(540,1330,1.25,{look:0,mouth:talk(lt),eyes:0.75})};
SH.stilt=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.5);
 if(lt<t1){camera(540,1000,1.05+0.05*sm(lt/t1));village(T,{});stilt(540,1250,1.1,{lit:true});return}
 camera(540,920,1.5);interior(T);sitUp(560,1.3,Object.assign({},TAM,{eyes:1.2,pupil:2.4,look:-1+Math.sin(lt*1.5)*0.3,sweat:(lt*0.7)%1}))};
SH.yard=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.5);
 if(lt<t1){camera(540,1000,1.05);village(T,{});stilt(760,1250,0.9,{lit:true});tigerEyes(160,1000,0.5,T,0.8);tranh(470,1290,1.05,T,{beckon:true});return}
 camera(500,900,1.8);village(T,{});tranh(470,1290,1.05,T,{beckon:true})};
function onBed(fn,x,s){ctx.save();ctx.beginPath();ctx.rect(-2000,-2000,5000,3150);ctx.clip();fn(1150+110*s);ctx.restore()}
function blanket(x0,x1){ctx.fillStyle='#5a6a80';ctx.strokeStyle=INK;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x0,1152);ctx.quadraticCurveTo(x0+5,1085,x0+70,1088);ctx.quadraticCurveTo((x0+x1)/2,1070,x1-60,1100);ctx.quadraticCurveTo(x1-10,1120,x1,1152);ctx.closePath();ctx.fill();ctx.stroke()}
SH.mom=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.5);camera(540,900,1.6);interior(T);const s=1.3,hy=1150+110*s-278*s;
 onBed(fy=>me(540,fy,s,lt<t1?{sit:true,eyes:1.2}:{sit:true,eyes:1.25,mouth:'o',arm:[undefined,-1.5]}),540,s);blanket(450,1100);tears(540,hy,s,T)};
SH.hold=(lt,D,T,ls)=>{camera(540,900,1.45);interior(T,{dawn:sm(seg(lt,D*0.6,D))*0.8});const s=1.2;
 onBed(fy=>{me(630,fy,s,{sit:true,eyes:1.1,arm:[undefined,-1.4]});tam(430,fy,s,{sit:true,eyes:1.2,pupil:2.4,look:1,mouth:L_(ls,1,D)>lt?talk(lt):undefined,armA:[null,-1.15]})},540,s);blanket(330,1100);tears(630,1150+110*s-278*s,s,T)};
SH.tracks=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.5);camera(540,960,1.05+0.1*sm(lt/D));ground('#4a3f2c');ctx.fillStyle='#2e2418';for(const [px,py] of [[160,300],[880,300]])ctx.fillRect(px,py,40,40);
 trackRow('paw',200,1650,640,250,6,1.25,lt<t1?1:0.6);trackRow('foot',430,1600,860,200,9,1.3,lt<t1?0.8:1)};
SH.warn=(lt,D,T,ls)=>{camera(540,960,1.35);village(T,{day:0.9});sau(400,1330,1.15,{look:1,mouth:talk(lt)});tam(690,1330,1.15,{look:-1,eyes:1.15})};
SH.ash=(lt,D,T,ls)=>{const p=lt/D;camera(540,1000,1.05);village(T,{day:0.35});stilt(540,1250,1.1,{lit:true});
 ctx.fillStyle='rgba(160,158,150,.55)';ctx.beginPath();ctx.ellipse(540,1290,430,60,0,0,7);ctx.ellipse(540,1290,380,40,0,0,7);ctx.fill('evenodd');
 if(p<0.55){const x=lerp(200,880,p/0.55);sau(x,1320,0.85,{armA:[null,-1.1]});ctx.fillStyle='rgba(200,198,190,.8)';for(let k=0;k<10;k++){const f=(T*1.5+k*0.1)%1;circ(x+60+k*3,1320-215*0.85+f*160,3,'rgba(200,198,190,.8)')}return}
 sau(350,1215,0.8,{sit:true,eyes:1});spear(300,1260,420,1000)};
SH.sleep=(lt,D,T,ls)=>{const e=1-sm(seg(lt,D*0.3,D*0.9));camera(540,920,1.5);interior(T,{la:0.6});sitUp(560,1.3,Object.assign({},TAM,{eyes:Math.max(0.05,e),tilt:(1-e)*0.25}))};
SH.wake=(lt,D,T,ls)=>{camera(540,900,1.7);interior(T,{la:lt<0.6?1:0.15});sitUp(560,1.3,Object.assign({},TAM,{eyes:1.3,pupil:2,look:-1,sweat:(lt*0.8)%1,mouth:'o'}));ctx.strokeStyle='rgba(200,215,230,.35)';ctx.lineWidth=5;for(let k=0;k<5;k++){const xx=((lt*900+k*260)%1500)-300;ctx.beginPath();ctx.moveTo(xx,700+k*90);ctx.quadraticCurveTo(xx+120,680+k*90,xx+240,700+k*90);ctx.stroke()}};
SH.empty=(lt,D,T,ls)=>{camera(540,950,1.2);room(T,{win:false});ctx.fillStyle='#05070a';ctx.fillRect(140,560,230,610);ctx.strokeStyle='#2a1e14';ctx.lineWidth=18;ctx.strokeRect(140,560,230,610);halo(255,860,260,'170,190,215',0.3);mist(T,1100,0.2);
 bed(T);poly([[440,1150],[600,1150],[590,1110],[450,1110]],'#d9d2c0',INK,3);poly([[440,1152],[780,1152],[775,1135],[445,1135]],'#5a6a80',INK,3);
 sitUp(860,1.25,Object.assign({},TAM,{eyes:1.3,pupil:2,look:-1,sweat:(lt*0.8)%1}))};
SH.three=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.45);camera(540,960,1.05+0.08*sm(lt/D));ground('#3e3528');ctx.fillStyle='rgba(175,172,165,.85)';ctx.fillRect(-600,600,W+1200,760);
 trackRow('paw',260,1700,300,150,7,1.15);trackRow('foot',560,1700,560,150,10,1.2);trackRow('foot',820,1700,800,150,11,0.95);
 if(lt>=t1){const k=Math.floor((lt-t1)/0.9);const xs=[300,560,810];ctx.strokeStyle='rgba(255,60,60,.8)';ctx.lineWidth=8;for(let i=0;i<=Math.min(k,2);i++){ctx.beginPath();ctx.ellipse(xs[i],980,110,520,0,0,7);ctx.stroke()}}};
SH.porch=(lt,D,T,ls)=>{camera(470,960,2.1);village(T,{day:0.55});stilt(540,1250,1.1,{open:true});sau(400,1066,0.8,{sit:true,eyes:0.05,tilt:0.55});spear(300,1080,520,1040)};
SH.clothes2=(lt,D,T,ls)=>{camera(540,1080,1.2+0.12*sm(lt/D));forest(T,{day:0.5,moon:false});stream(T,1130,0.6);ctx.fillStyle='#4e4a38';ctx.fillRect(-600,1300,W+1200,800);pile(540,1300,1.15,'#5a4636','#1c1c20');tam(820,1330,0.9,{eyes:1.1,look:-1})};
SH.inside=(lt,D,T,ls)=>{camera(540,900,1.6);room(T,{win:true,wx:600,wy:340,ww:240,wh:300});ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(340,-400);ctx.lineTo(340,1262);ctx.stroke();lamp(820,1262,0.9,T,{small:0.6});huddle2(500,1268,1.25,T)};
SH.call=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.5);
 if(lt<t1){camera(540,1000,1.05);village(T,{});stilt(780,1250,0.85,{lit:true});tigerEyes(170,980,0.5,T,0.8);tranh(480,1290,1.05,T,{woman:true,beckon:true});return}
 camera(480,900,1.9);village(T,{});tranh(480,1290,1.05,T,{woman:true,beckon:true})};
SH.free=(lt,D,T,ls)=>{const p=sm(lt/D);ctx.fillStyle='#0a0c10';ctx.fillRect(0,0,W,H);camera(540,900,1);halo(540,500,900,'255,240,200',0.35+0.2*p);ctx.strokeStyle='rgba(255,240,210,.12)';ctx.lineWidth=40;for(let k=-3;k<=3;k++){ctx.beginPath();ctx.moveTo(540+k*60,-200);ctx.lineTo(540+k*190,1600);ctx.stroke()}
 ctx.save();ctx.globalAlpha=1-0.6*p;person(540,1250-260*p,1.2,{shirt:'#6a5a3a',pants:'#2e2a22',eyes:0.05});ctx.restore()};
SH.final=(lt,D,T,ls)=>{const p=sm(lt/D);ctx.fillStyle='#040506';ctx.fillRect(0,0,W,H);camera(540,900,1+0.15*p);tigerHead(540,600,1.9,T,{vis:0.6+0.3*p});tranh(540,1290,1.25,T,{woman:true,beckon:true,a:0.95})};
SH.cta=(lt,D,T,ls)=>{ctx.fillStyle='#040506';ctx.fillRect(0,0,W,H);tigerEyes(540,560,1.6,T,1);txt('CHUYỆN ĐÔNG TÂY KIM CỔ',540,900,60,'#e8dcc0',1,{w:'900',f:'"DejaVu Sans"'});ctx.fillStyle='#d6242a';ctx.beginPath();ctx.roundRect(330,950,420,96,48);ctx.fill();txt('THEO DÕI',540,1016,52,'#fff',1,{w:'900',f:'"DejaVu Sans"'})};
function subs(T){for(const [a,b,s,sp] of TL.subs){if(T<a||T>=b)continue;const al=Math.min(sm((T-a)/0.12),sm((b-T)/0.12));ctx.save();ctx.globalAlpha=al;ctx.textAlign='center';ctx.lineJoin='round';
 const fem=['ME','GME'].includes(sp);ctx.font='bold 58px "DejaVu Sans"';const lines=wrapText(s,900);const lh=74;const y0=1560-(lines.length-1)*lh/2;
 lines.forEach((l,i)=>{ctx.lineWidth=12;ctx.strokeStyle='#000';ctx.strokeText(l,W/2,y0+i*lh);ctx.fillStyle=sp.startsWith('G')?'#ff5050':fem?'#ff9a9a':sp==='N'?'#ffffff':'#ffd76a';ctx.fillText(l,W/2,y0+i*lh)});ctx.restore()}}
function draw(TT){const T=TT;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
 let cur=null;for(const sc of TL.scenes){if(TT>=sc[1]&&TT<sc[2]){cur=sc;break}}
 if(cur){ctx.save();SH[cur[0]](T-cur[1],cur[2]-cur[1],T,cur[3]);ctx.restore()}
 ctx.setTransform(1,0,0,1,0,0);
 if(cur){octx.drawImage(cv,0,0);ctx.filter='saturate(0.85) contrast(1.05) brightness(1.06)';ctx.drawImage(OFF,0,0);ctx.filter='none'}
 if(cur){const d=Math.min(TT-cur[1],cur[2]-TT);if(d<0.1&&cur[1]>0){ctx.fillStyle=`rgba(0,0,0,${1-d/0.1})`;ctx.fillRect(0,0,W,H)}}
 if(!cur||cur[0]!=='title')subs(T)}

// ===== Trành đáng sợ kiểu Ma Lai (thay tranh cũ) =====
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
function tranh(x,fy,s,T,o={}){const bob=Math.sin(T*1.4)*7,y=fy-22*s+bob*s/2.3;const a=o.a??0.95;ctx.save();ctx.globalAlpha=a;
 halo(x,y-190*s,330*s,'120,255,160',0.2);ctx.translate(x,y);ctx.scale(s,s);ctx.lineJoin='round';ctx.lineCap='round';
 const top=-236,hy=top-50,shirt=o.woman?'#3e3a36':'#3a4440',pants=o.woman?'#1c1d20':'#262c2c',skin=o.skin||'#b9c2b8';
 // chân gầy, mũi chân thõng (lơ lửng)
 if(!o.woman){for(const sd of [-1,1]){ctx.strokeStyle=INK;ctx.lineWidth=20;ctx.beginPath();ctx.moveTo(sd*14,-112);ctx.lineTo(sd*12+Math.sin(T+sd)*2,-8);ctx.stroke();ctx.strokeStyle=pants;ctx.lineWidth=13;ctx.stroke();ctx.fillStyle=skin;ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*12,0,8,12,0,0,7);ctx.fill();ctx.stroke()}}
 // thân: áo rách tả tơi
 ctx.save();ctx.rotate(o.woman?0:0.04);
 ctx.fillStyle=shirt;ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-38,top+10);ctx.lineTo(38,top+10);ctx.lineTo(o.woman?60:44,o.woman?-20:-110);
 const hem=o.woman?-20:-110;for(let k=0;k<=8;k++){const xx=(o.woman?60:44)-k*((o.woman?120:88)/8);ctx.lineTo(xx,hem+(k%2?18:0)+rnd(k)*8)}ctx.closePath();ctx.fill();ctx.stroke();
 // vết cào cọp đẫm máu
 ctx.strokeStyle='#5a0a0e';ctx.lineWidth=7;for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(-26+k*14,top+40);ctx.lineTo(-4+k*14,top+120);ctx.stroke()}ctx.strokeStyle='rgba(160,20,24,.8)';ctx.lineWidth=2.5;for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(-25+k*14,top+42);ctx.lineTo(-5+k*14,top+118);ctx.stroke()}
 ctx.restore();
 // cổ
 ctx.fillStyle=skin;ctx.fillRect(-9,top-8,18,20);
 // tay: một tay buông dài quá gối, một tay vẫy gọi với ngón dài cong
 const arm=(sd,ang,len,beck)=>{ctx.save();ctx.translate(sd*36,top+20);ctx.rotate(ang);ctx.strokeStyle=INK;ctx.lineWidth=18;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,len);ctx.stroke();ctx.strokeStyle=shirt;ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,len*0.55);ctx.stroke();ctx.strokeStyle=skin;ctx.beginPath();ctx.moveTo(0,len*0.55);ctx.lineTo(0,len);ctx.stroke();
  ctx.translate(0,len);circ(0,0,9,skin,INK,3);const cr=beck?0.6+0.5*Math.sin(T*3.2):0.15;for(let f=0;f<4;f++){ctx.save();ctx.rotate((f-1.5)*0.22);ctx.strokeStyle=INK;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,4);ctx.quadraticCurveTo(0,22,-cr*14,30+f%2*4);ctx.lineTo(-cr*22,34+f%2*4);ctx.stroke();ctx.strokeStyle=skin;ctx.lineWidth=2.6;ctx.stroke();ctx.restore()}ctx.restore()};
 arm(-1,0.08+Math.sin(T*0.9)*0.03,150,false);
 if(o.beckon)arm(1,-2.0+Math.sin(T*3.2)*0.3,118,true);else arm(1,-0.08,150,false);
 // đầu nghiêng
 ctx.save();ctx.translate(0,hy);ctx.rotate(o.tilt??(0.18+Math.sin(T*0.7)*0.05));scaryFace(T,{woman:o.woman,look:o.look});ctx.restore();
 ctx.restore()}
