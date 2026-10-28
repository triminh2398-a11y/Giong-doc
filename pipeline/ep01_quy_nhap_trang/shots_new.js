// ===== v2 new scenes (char2 style) =====
function paperWindow(x,y,w,h,T,glow){poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],'#3a2a1a',INK,6);const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,`rgba(120,140,160,${0.35+glow})`);g.addColorStop(1,`rgba(70,85,100,${0.35+glow})`);ctx.fillStyle=g;ctx.fillRect(x+10,y+10,w-20,h-20);ctx.strokeStyle='#2a1c10';ctx.lineWidth=5;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x+i*w/4,y);ctx.lineTo(x+i*w/4,y+h);ctx.stroke()}for(let i=1;i<3;i++){ctx.beginPath();ctx.moveTo(x,y+i*h/3);ctx.lineTo(x+w,y+i*h/3);ctx.stroke()}}
function door(x,y,w,h,shake){ctx.save();ctx.translate(x+(shake||0),y);poly([[0,0],[w,0],[w,h],[0,h]],'#3a2616',INK,6);ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=4;for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(i*w/5,6);ctx.lineTo(i*w/5,h-6);ctx.stroke()}ctx.fillStyle='#8a6a2a';ctx.fillRect(w-40,h*0.5,14,30);ctx.restore()}
function book(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);poly([[-40,-6],[0,0],[40,-6],[40,40],[0,46],[-40,40]],'#e8dfc8',INK,3);ctx.strokeStyle='rgba(60,40,30,.5)';ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-32,6+i*8);ctx.lineTo(-6,10+i*8);ctx.moveTo(6,10+i*8);ctx.lineTo(32,6+i*8);ctx.stroke()}ctx.restore()}
function smoke(x,y,T,n=3,a=0.35){ctx.save();ctx.strokeStyle=`rgba(220,220,210,${a})`;ctx.lineWidth=2.5;for(let i=0;i<n;i++){ctx.beginPath();for(let k=0;k<50;k++)ctx.lineTo(x-6+i*6+Math.sin(k*0.25+T*1.5+i*2)*(4+k*0.25),y-k*7);ctx.stroke()}ctx.restore()}
function banana(x,y,s,T,k){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#3a5a2a';ctx.fillRect(-14,-260,28,260);for(let i=0;i<6;i++){ctx.save();ctx.translate(0,-250);ctx.rotate(-1.4+i*0.55+Math.sin(T*1.6+i+k)*0.08);ctx.fillStyle=i%2?'#4f7a34':'#3e6a2a';ctx.beginPath();ctx.ellipse(130,0,140,34,0,0,7);ctx.fill();ctx.strokeStyle='#2a4a1a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(260,0);ctx.stroke();ctx.restore()}ctx.restore()}
function oldPhoto(x,y,s,T,glowEyes){ctx.save();ctx.translate(x,y);ctx.scale(s,s);poly([[-120,-160],[120,-160],[120,160],[-120,160]],'#5a3a20',INK,6);ctx.fillStyle='#cbb894';ctx.fillRect(-100,-140,200,280);
 ctx.save();ctx.beginPath();ctx.rect(-100,-140,200,280);ctx.clip();ctx.filter='sepia(0.8) contrast(0.9)';fig5(0,250,0.92,Object.assign({},CAST5.codau,{em:'calm',pose:{la:[0.5,2.0],ra:[-0.5,-2.0]}}));ctx.filter='none';
 ctx.save();ctx.translate(0,120);ctx.fillStyle='#120e0c';ctx.beginPath();ctx.ellipse(0,0,36,26,0,0,7);ctx.fill();ctx.beginPath();ctx.arc(-8,-26,18,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-22,-36);ctx.lineTo(-20,-56);ctx.lineTo(-10,-40);ctx.moveTo(0,-40);ctx.lineTo(8,-58);ctx.lineTo(10,-34);ctx.fill();for(const sd of [-1,1]){if(glowEyes>0)halo(-8+sd*7,-28,14,'255,210,60',glowEyes*0.6);ctx.fillStyle=glowEyes>0?'#ffd23a':'#8a7a3a';ctx.beginPath();ctx.ellipse(-8+sd*7,-28,3.5,2.6,0,0,7);ctx.fill()}ctx.restore();
 ctx.fillStyle='rgba(90,60,30,.25)';for(let i=0;i<60;i++)ctx.fillRect(-100+rnd(i)*200,-140+rnd(i+3)*280,3+rnd(i+7)*6,2);ctx.restore();ctx.restore()}


SH.night1_steps=(lt,D,T,ls)=>{const t3=L_(ls,3,D*0.5),t4=L_(ls,4,D*0.7),t5=L_(ls,5,D*0.85);
 const closeup=lt>t5;camera(closeup?1150:1000,closeup?600:560,closeup?1.45:1.08);
 hall(T,{});paperWindow(1260,260,420,300,T,0.0);door(1720,180,170,FLOOR-180,lt>t4&&lt<t5?Math.sin(lt*40)*1.5:0);
 // silhouette circling behind the paper window
 if(lt<t3+0.6){const p=(lt*0.22)%1;const sx=1260+p*420;ctx.save();ctx.beginPath();ctx.rect(1270,270,400,280);ctx.clip();ctx.fillStyle='rgba(8,8,12,.75)';ctx.beginPath();ctx.ellipse(sx,330,34,40,0,0,7);ctx.fill();ctx.fillRect(sx-40,360,80,200);ctx.restore()}
 phan(820,FLOOR-10);corpse(860,FLOOR-10,0.9,T,{});lamp(400,FLOOR-40,1.2,T,{});ctx.fillStyle='#2a1c10';ctx.fillRect(340,FLOOR-40,120,40);
 const fear=lt>L_(ls,2,0);lam(1250,FLOOR+80,1.15,{sit:true,look:1,eyes:fear?1.2:1,sweat:lt>t3?((lt*0.8)%1):0,mouth:lt>t5&&Math.sin(lt*9)>0?'o':undefined,arms:lt>t5?'hold':undefined});
 if(lt>t5)book(1250,FLOOR-170,1.0);
 if(lt>t4&&lt<t5){ctx.save();ctx.setTransform(1,0,0,1,0,0);const k=Math.floor((lt-t4)*1.6)%3;label(['rột…','rột… rột…','rột… rột… rột…'][k],1540,300,70,'#c9c2b0',0.9);ctx.restore()}
 lightMask(500,640,1100,0.55);rainFx(T,0.08)};

SH.ruin=(lt,D,T,ls)=>{const t1=L_(ls,1,2),t3=L_(ls,3,D*0.4),t4=L_(ls,4,D*0.5),t5=L_(ls,5,D*0.6),t6=L_(ls,6,D*0.7),t7=L_(ls,7,D*0.85);
 if(lt>=t3&&lt<t5){ // photo close-up
  camera(960,540,lt<t4?1.0+0.1*sm(seg(lt,t3,t4)):1.35);ctx.fillStyle='#3a3a36';ctx.fillRect(-500,-500,W+1000,H+1000);poly([[400,700],[1520,700],[1600,1200],[320,1200]],'#5a5a54',INK,6);
  oldPhoto(960,500,1.6,T,lt>t4?sm(seg(lt,t4,t4+1)):0);smoke(700,690,T,3,0.3);smoke(1220,690,T,3,0.3);if(lt>t4){ctx.save();ctx.translate(960,500);ctx.scale(1.6,1.6);ctx.restore()}return}
 camera(lt<t1?lerp(700,900,sm(lt/t1)):960,560,1.05+(lt>t7?0.25:0));sky('#9aa49a','#c8c8b4',620);mountains(620,'#7a8a78',3,90);
 ctx.fillStyle='#4a5a34';ctx.fillRect(-800,620,W+1600,700);
 banana(250,700,1.1,T,0);banana(1650,690,1.25,T,2);banana(1820,720,0.9,T,4);
 // ruined posts
 for(const [px,h,r] of [[620,260,-0.05],[880,200,0.08],[1260,300,0.02],[1460,180,-0.1]]){ctx.save();ctx.translate(px,760);ctx.rotate(r);poly([[-14,0],[14,0],[12,-h],[-12,-h+10]],'#4a3a2a',INK,4);ctx.restore()}
 poly([[560,760],[1520,760],[1560,800],[520,800]],'#6a6458',INK,4);
 // stone altar
 poly([[900,840],[1060,840],[1050,740],[910,740]],'#8a8478',INK,5);ctx.fillStyle='#5a3a20';ctx.fillRect(950,690,60,50);ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.strokeRect(950,690,60,50);smoke(970,736,T,2,0.35);
 // tall grass in front
 ctx.fillStyle='#3a4a26';for(let i=0;i<90;i++){const gx=-200+i*26,gh=60+rnd(i)*70;ctx.beginPath();ctx.moveTo(gx,1080);ctx.quadraticCurveTo(gx+8+Math.sin(T*2+i)*6,1080-gh*0.6,gx+4+Math.sin(T*2+i)*10,1080-gh-60);ctx.lineTo(gx+16,1080);ctx.fill()}
 const turned=lt>t7;const walking=lt<t1;
 lam(walking?lerp(300,760,sm(lt/t1)):760,980,1.2,walking?{back:false,phase:T*6,look:1}:{back:!turned&&lt<t5,look:turned?-1:1,eyes:turned?1.25:1,mouth:turned?'o':undefined,sweat:turned?(lt%1):0});
 if(lt>t5&&lt<t7){const a=0.35*sm(seg(lt,t5,t5+1))*(1-sm(seg(lt,t6+1.2,t7)));ctx.save();ctx.globalAlpha=a;ch('ghost',560,980,0.9,{t:T});ctx.restore()}
 if(lt>t6&&lt<t7){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='rgba(255,255,255,0)';ctx.restore()}
 mist(T,820,0.12)};

SH.corpse_altar=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.3),t2=L_(ls,2,D*0.6);
 if(lt>=t2){ // view through window slit to rainy yard with ghost
  camera(960,540,1.0+0.15*sm(seg(lt,t2,D)));nightSky(T,700);ctx.fillStyle='#14181a';ctx.fillRect(-500,640,W+1000,600);mangoTree(400,700,1.1,T,{});
  const fl=flashAt(lt,[t2+1.2,t2+4.5]);ch('ghost',1100,860,1.05,{t:T,wind:Math.sin(T)*0.4});rainFx(T,0.9);flash(fl);
  ctx.fillStyle='#0a0705';ctx.fillRect(-500,-500,W+1000,620);ctx.fillRect(-500,960,W+1000,600);ctx.fillRect(-500,-500,560,H+1000);ctx.fillRect(1460,-500,1000,H+1000);for(let i=0;i<5;i++)ctx.fillRect(560+i*200+90,120,22,840);return}
 camera(960,560,1.12);hall(T,{});
 const fall=sm(seg(lt,t1+0.8,t1+1.3));
 ctx.save();ctx.translate(1300,FLOOR-20);poly([[-220,0],[220,0],[200,-160],[-200,-160]],'#3a2416',INK,5);
 // incense bowl
 ctx.save();ctx.translate(lerp(0,170,fall),lerp(-180,150,fall*fall));ctx.rotate(fall*2.4);poly([[-30,0],[30,0],[22,-26],[-22,-26]],'#7a5a2a',INK,2);ctx.restore();
 // portrait
 if(fall<0.5){poly([[-60,-160],[60,-160],[50,-320],[-50,-320]],'#1a1410',INK,4);ctx.save();ctx.beginPath();ctx.rect(-40,-305,80,130);ctx.clip();ctx.translate(0,-160);ctx.filter='grayscale(1)';ch('cuthach',0,140,0.35,{});ctx.filter='none';ctx.restore()}
 else{ctx.save();ctx.translate(-90,150);ctx.rotate(0.1);poly([[-60,-14],[60,-14],[60,10],[-60,10]],'#1a1410',INK,3);ctx.strokeStyle='#d8d2c0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-40,-10);ctx.lineTo(-10,6);ctx.lineTo(10,-8);ctx.lineTo(40,8);ctx.stroke();ctx.restore()}
 ctx.restore();
 const hop=Math.abs(Math.sin(lt*2.2))*30;const cx=lt<t1?lerp(500,980,sm(lt/t1)):980;
 corpseStand(cx,FLOOR+30-0,1.4,T,{dir:1,hop,tilt:Math.sin(T*1.3)*0.2,mouth:0.6,armDrop:lt>t1&&lt<t1+1?-0.6*Math.sin((lt-t1)*3):0});
 lightMask(cx,560,1100,0.55)};

SH.epilogue=(lt,D,T,ls)=>{const t2=L_(ls,2,D*0.2),t3=L_(ls,3,D*0.3),t4=L_(ls,4,D*0.45),t5=L_(ls,5,D*0.6),t6=L_(ls,6,D*0.7),t7=L_(ls,7,D*0.9);
 if(lt>=t6){ // Khoa in corner on rainy night
  camera(lt>t7?1000:960,600,lt>t7?1.35:1.1);hut(T);ctx.fillStyle='rgba(20,30,50,.25)';ctx.fillRect(-800,-600,W+1600,H+1200);door(1400,240,230,FLOOR-240,0);
  khoa(820,FLOOR+70,1.2,{sit:true,look:1,eyes:1.25,arms:'hold',tilt:Math.sin(T*1.1)*0.05,mouth:Math.sin(lt*9)>0&&lt>t7?'o':undefined,sweat:(lt*0.6)%1});
  if(lt>t7){const a=0.55*sm(seg(lt,t7+1.2,t7+2.5));ctx.save();ctx.fillStyle=`rgba(0,0,0,${a})`;ctx.fillRect(1420,FLOOR,200,24);ctx.restore();ctx.save();ctx.globalAlpha=a*0.8;ctx.beginPath();ctx.rect(1410,250,210,FLOOR-250);ctx.clip();ctx.translate(0,0);ctx.fillStyle='rgba(0,0,0,.0)';ctx.restore();ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillRect(1500,FLOOR-6,60,8);ctx.restore()}
  rainFx(T,0.25);lightMask(820,620,900,0.55);return}
 const day=sm(seg(lt,0,t2))*0.4+0.4;camera(lt>t3?900:960,560,lt>t3&&lt<t5?1.25:1.05);mansionExt(T,{day,moon:false});
 mangoTree(560,800,1.2,T,{});smoke(660,800,T,3,0.4);ctx.fillStyle='#7a5a2a';ctx.fillRect(650,770,30,30);
 const fade=lt<t3?0:(lt<t5?sm(seg(lt,t3,t3+1.5)):1-sm(seg(lt,t5-1.5,t5)));
 if(fade>0){ctx.save();ctx.globalAlpha=fade*0.9;fig5(560,940,1.0,Object.assign({},CAST5.codau,{skin:'#e8e6ee',em:lt>t4&&lt<t4+1.6?'closed':'sad',tilt:lt>t4&&lt<t4+1.6?0.25:0,pose:{la:[0.5,2.0],ra:[-0.5,-2.0]}}));cat(560,745,0.5,T,{pose:'sit'});ctx.restore();halo(560,700,300,'230,235,255',fade*0.15)}
 lam(1080,960,1.15,{look:-1,arms:lt<t3?'hold':undefined,eyes:fade>0.2?1.15:1});
 mist(T,860,0.15+0.15*fade)};
