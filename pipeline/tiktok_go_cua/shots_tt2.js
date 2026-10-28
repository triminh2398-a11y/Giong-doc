// TikTok 1080x1920 — "Tiếng gõ cửa lúc 3 giờ sáng" — char5 (bug-eye, cel) style
const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),sm=x=>{x=cl(x);return x*x*(3-2*x)},seg=(t,a,b)=>cl((t-a)/(b-a)),lerp=(a,b,k)=>a+(b-a)*k;
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const L_=(ls,i,d=0)=>ls[i]??d;
const HUNG={hair:'messy',bug:true,cel:true,skin:'#e8cbbb',skin2:'#c8a8a0'};
const BACHU={hair:'bun',hairCol:'#b8b2ae',wrinkles:true,bug:true,cel:true,skin:'#dcc0ac',skin2:'#bca08c'};
function bust(x,y,s,rot,shirt,fo,collar='#1c1a20'){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(s,s);
 q(()=>{ctx.moveTo(-230,420);ctx.quadraticCurveTo(-215,220,-100,172);ctx.lineTo(-34,154);ctx.lineTo(34,154);ctx.lineTo(100,172);ctx.quadraticCurveTo(215,220,230,420);ctx.lineTo(230,900);ctx.lineTo(-230,900);ctx.closePath()},shirt,2.8);
 ctx.save();ctx.beginPath();ctx.rect(60,150,200,800);ctx.clip();ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(60,150,200,800);ctx.restore();
 if(collar)q(()=>{ctx.moveTo(-34,154);ctx.lineTo(0,224);ctx.lineTo(34,154)},collar,2.4);
 face5(fo);ctx.restore()}
function blink(T,s){return ((T*0.29+s)%1)<0.035}
function talk(lt,on){return on&&Math.sin(lt*13)>0.1?'teeth':undefined}
function light(pools,amb){const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.fillStyle=amb;g.fillRect(0,0,W,H);g.globalCompositeOperation='lighter';for(const [x,y,r,col] of pools){const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,W,H)}ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='multiply';ctx.drawImage(c,0,0);ctx.restore()}
function cam(z,cx=540,cy=960){ctx.translate(cx,cy);ctx.scale(z,z);ctx.translate(-cx,-cy)}
function wallIn(c1='#3a3040',c2='#2a2430'){ctx.fillStyle=c1;ctx.fillRect(-300,-300,W+600,H+600);for(let x=-300;x<W+300;x+=120){ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(x+114,-300,6,H+600)}ctx.fillStyle=c2;ctx.fillRect(-300,1380,W+600,900);ln([[-300,1380],[W+300,1380]],3)}
function door(x,y,w,h,o={}){q(()=>ctx.rect(x-18,y-18,w+36,h+18),'#2a1e16',3);q(()=>ctx.rect(x,y,w,h),o.col||'#5a4030',3);
 for(let i=1;i<4;i++)ln([[x+i*w/4,y+10],[x+i*w/4,y+h-10]],2,'rgba(0,0,0,.35)');q(()=>ctx.rect(x+w-70,y+h*0.5-14,50,18),'#8a7a5a',2.4);
 if(o.under){const g=ctx.createLinearGradient(0,y+h-4,0,y+h+120);g.addColorStop(0,`rgba(${o.under},.55)`);g.addColorStop(1,`rgba(${o.under},0)`);ctx.fillStyle=g;ctx.fillRect(x,y+h,w,120);ctx.fillStyle=`rgba(${o.under},.9)`;ctx.fillRect(x,y+h-5,w,5)}
 if(o.prints){ctx.fillStyle='rgba(40,28,18,.85)';o.prints.forEach(([px,py,r],k)=>{ctx.save();ctx.translate(x+px,y+py);ctx.rotate(r);ctx.beginPath();ctx.ellipse(0,0,34,40,0,0,7);ctx.fill();for(let f=0;f<4;f++){ctx.beginPath();ctx.ellipse(-24+f*16,-56-Math.abs(f-1.5)*-4,7,24,0,0,7);ctx.fill()}ctx.beginPath();ctx.ellipse(36,-10,8,20,0.8,0,7);ctx.fill();ctx.fillRect(-4,30,8,40+k*6);ctx.restore()})}}
function knockFx(lt,times){let k=0;for(const t0 of times){const d=lt-t0;if(d>=0&&d<0.18)k=Math.max(k,1-d/0.18)}return k}
function clock(x,y,r,h,m){q(()=>ctx.arc(x,y,r,0,7),'#e8e2d4',4);for(let i=0;i<12;i++){const a=i*Math.PI/6;ln([[x+Math.sin(a)*r*0.82,y-Math.cos(a)*r*0.82],[x+Math.sin(a)*r*0.92,y-Math.cos(a)*r*0.92]],3)}
 const ah=(h%12+m/60)*Math.PI/6,am=m*Math.PI/30;ln([[x,y],[x+Math.sin(ah)*r*0.5,y-Math.cos(ah)*r*0.5]],8);ln([[x,y],[x+Math.sin(am)*r*0.78,y-Math.cos(am)*r*0.78]],5);q(()=>ctx.arc(x,y,7,0,7),'#141014',0)}
function phone(x,y,s){ctx.save();ctx.translate(x,y);ctx.rotate(-0.2);ctx.scale(s,s);q(()=>{ctx.roundRect?ctx.roundRect(-38,-80,76,160,12):ctx.rect(-38,-80,76,160)},'#1a1c22',3);ctx.fillStyle='#9fd0ff';ctx.fillRect(-30,-68,60,120);ctx.restore()}
function feetRev(cx,y,s,col='#e8eaee'){ctx.save();ctx.translate(cx,y);ctx.scale(s,s);for(const sd of [-1,1]){ctx.save();ctx.translate(sd*70,0);
 q(()=>{ctx.moveTo(-34,-40);ctx.quadraticCurveTo(-44,40,-26,70);ctx.quadraticCurveTo(0,90,26,70);ctx.quadraticCurveTo(44,40,34,-40);ctx.closePath()},col,3); // heel facing us
 ctx.fillStyle='rgba(120,130,150,.35)';ctx.beginPath();ctx.ellipse(0,40,20,26,0,0,7);ctx.fill();
 for(let f=0;f<5;f++)q(()=>ctx.ellipse(-28+f*14,-50-Math.abs(f-2)*-3,7,10,0,0,7),col,2); // toes pointing away (behind)
 ctx.strokeStyle='rgba(60,70,110,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-10,-20);ctx.lineTo(-4,20);ctx.moveTo(8,-30);ctx.lineTo(12,10);ctx.stroke();ctx.restore()}ctx.restore()}
function houseDay(T){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#9aa6b4');g.addColorStop(1,'#c8c4b4');ctx.fillStyle=g;ctx.fillRect(-300,-300,W+600,H+600);
 ctx.fillStyle='#6a7a6a';ctx.beginPath();ctx.moveTo(-300,900);for(let x=-300;x<=W+300;x+=60)ctx.lineTo(x,820-rnd(x)*60);ctx.lineTo(W+300,H);ctx.lineTo(-300,H);ctx.fill();
 q(()=>ctx.rect(120,640,840,560),'#bfb6a6',3);q(()=>{ctx.moveTo(80,660);ctx.lineTo(540,470);ctx.lineTo(1000,660);ctx.closePath()},'#6a6e78',3);for(let i=0;i<14;i++)ln([[100+i*64,650-(i<7?i:13-i)*0],[540+(i-7)*8,480]],1.5,'rgba(0,0,0,.25)');
 door(440,860,200,340,{col:'#6a4a32'});q(()=>ctx.rect(190,860,160,140),'#2a2a34',3);q(()=>ctx.rect(730,860,160,140),'#2a2a34',3);
 ctx.fillStyle='#8a8070';ctx.fillRect(-300,1200,W+600,900);ln([[-300,1200],[W+300,1200]],3)}
function sub(T){for(const [a,b,t,sp] of TL.subs){if(T<a||T>b)continue;const fem=['BC','GBC','NA','GNA'].includes(sp),qt=sp!=='N';ctx.save();ctx.font='bold 54px "DejaVu Sans"';ctx.textAlign='center';ctx.lineJoin='round';
 const words=t.split(' ');const lines=[];let cur='';for(const w of words){const tt=cur?cur+' '+w:w;if(ctx.measureText(tt).width>900){lines.push(cur);cur=w}else cur=tt}lines.push(cur);
 lines.forEach((l,i)=>{const y=1330+i*68-(lines.length-1)*34;ctx.lineWidth=10;ctx.strokeStyle='#000';ctx.strokeText(l,540,y);ctx.fillStyle=sp.startsWith('G')?'#ff7070':fem?'#ffb0b0':qt?'#ffd76a':'#fff';ctx.fillText(l,540,y)});ctx.restore()}}
const SH={};
SH.hook=(lt,D,T,ls)=>{wallIn('#241e28','#1a161e');cam(1+0.08*sm(lt/D),540,900);door(290,520,500,860,{under:'255,200,120'});light([[540,1400,700,'#ffcf90']],'#4a4862');ctx.setTransform(1,0,0,1,0,0);
 ctx.save();ctx.font='900 92px "DejaVu Sans"';ctx.textAlign='center';ctx.lineWidth=14;ctx.strokeStyle='#000';ctx.strokeText('GÕ 4 TIẾNG',540,300);ctx.fillStyle='#ff3a3a';ctx.fillText('GÕ 4 TIẾNG',540,300);ctx.font='900 80px "DejaVu Sans"';ctx.strokeText('= ĐỪNG MỞ CỬA',540,400);ctx.fillStyle='#fff';ctx.fillText('= ĐỪNG MỞ CỬA',540,400);ctx.restore()};
SH.title=(lt,D,T,ls)=>{ctx.fillStyle='#08070a';ctx.fillRect(-300,-300,W+600,H+600);clock(540,700,200,3,0);const a=sm(seg(lt,0.2,0.9));ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.font='900 90px "DejaVu Serif"';ctx.lineWidth=12;ctx.strokeStyle='#000';ctx.strokeText('TIẾNG GÕ CỬA',540,1080);ctx.fillStyle='#f0e8dc';ctx.fillText('TIẾNG GÕ CỬA',540,1080);ctx.font='900 76px "DejaVu Serif"';ctx.strokeText('LÚC 3 GIỜ SÁNG',540,1180);ctx.fillStyle='#d62a2a';ctx.fillText('LÚC 3 GIỜ SÁNG',540,1180);ctx.restore()};
SH.rent=(lt,D,T,ls)=>{const t3=L_(ls,3,D*0.5),t4=L_(ls,4,D*0.8);
 if(lt>=t3&&lt<t4){houseDay(T);cam(1.0);bust(540,820,2.0,0.02,'#5e5456',Object.assign({},BACHU,{em:'sad',look:0.2,mouth:talk(lt,1),eyesClosed:0}));light([[540,500,1100,'#fff4e6']],'#8a8496');return}
 houseDay(T);cam(1+0.05*sm(lt/D));bust(330,980,1.25,0.0,'#5e5456',Object.assign({},BACHU,{em:'calm',look:0.6}));bust(780,960,1.3,0,'#6a6070',Object.assign({},HUNG,{em:lt>t4?'calm':'calm',look:-0.6,mouth:lt>t4?'smile':undefined}),'#2a2830');light([[540,500,1200,'#fff4e6']],'#8e8a9a')};
SH.night1=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.5);wallIn('#262230','#1c1a24');
 if(lt<t1){cam(1.25+0.05*sm(lt/t1),540,900);q(()=>ctx.rect(-100,900,1300,1100),'#3a3a5a',3);q(()=>ctx.ellipse(420,980,300,90,0,0,7),'#d8d4cc',3);
  ctx.save();ctx.translate(440,900);ctx.rotate(-1.35);ctx.scale(1.25,1.25);face5(Object.assign({},HUNG,{em:'closed'}));ctx.restore();
  q(()=>{ctx.moveTo(-100,1050);ctx.quadraticCurveTo(300,980,600,1040);ctx.quadraticCurveTo(900,1000,1200,1060);ctx.lineTo(1200,2000);ctx.lineTo(-100,2000);ctx.closePath()},'#4a5a7a',3);
  light([[300,700,700,'#8aa0c8']],'#3a3e56');return}
 cam(1+0.1*sm(seg(lt,t1,D)),540,700);clock(540,700,260,2,59+sm(seg(lt,t1+0.4,t1+1.0)));light([[540,700,700,'#b8c8e8']],'#383c50')};
SH.knock=(lt,D,T,ls)=>{const t3=L_(ls,3,D*0.8),k=TL.knocks.filter(x=>x[2]===4&&x[0]>=TL.sc.knock-0.1&&x[0]<TL.sc.knock+D).map(x=>x[0]-TL.sc.knock);
 if(lt>=t3||(lt>=L_(ls,2,D*0.6)&&lt<t3)){ // Hùng wakes / listens
  wallIn('#262230','#1c1a24');cam(1.0);bust(540,800,2.1,0.03,'#6a6070',Object.assign({},HUNG,{em:'fear',look:lt>=t3?0.8:0.3,sweat:lt>=t3,mouth:lt>=t3?'teeth':undefined}),'#2a2830');light([[200,600,900,'#8aa0c8']],'#383c50');return}
 wallIn('#241e28','#1a161e');const kf=knockFx(lt,k);cam(1.05);ctx.save();ctx.translate(kf*3,0);door(290,520,500,860,{under:'200,220,255'});ctx.restore();
 if(kf>0){ctx.save();ctx.globalAlpha=kf;ctx.font='900 110px "DejaVu Sans"';ctx.textAlign='center';ctx.lineWidth=12;ctx.strokeStyle='#000';ctx.strokeText('CỐC',540,420);ctx.fillStyle='#e8e2d4';ctx.fillText('CỐC',540,420);ctx.restore()}
 light([[540,1400,600,'#c8d8ff']],'#42405a')};
SH.door=(lt,D,T,ls)=>{wallIn('#262230','#1c1a24');cam(1.1+0.05*sm(lt/D),540,900);door(290,420,500,960,{under:'200,220,255'});
 fig5(560,1500,1.9,Object.assign({},CAST5.lam||{},{hair:'messy',back:true,shirt:'#6a6070',pants:'#2a2830',pose:{la:[0.1,-0.1],ra:[-1.0,-0.9]}}));
 light([[540,1400,700,'#c8d8ff']],'#3c3e56')};
SH.phone=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.2),t3=L_(ls,3,D*0.5),t4=L_(ls,4,D*0.65),t5=L_(ls,5,D*0.8);
 if(lt>=t4&&lt<t5){SH.knock(lt-t4+0.01,1,T,[0,99,99,99]);return}
 if(lt>=t5){wallIn('#1a1620','#141218');cam(1.1+0.08*sm(seg(lt,t5,D)),540,900);door(290,520,500,860,{under:'200,220,255'});
  ctx.save();ctx.globalAlpha=0.35+0.2*Math.sin(T*3);const g=ctx.createRadialGradient(540,1420,10,540,1420,260);g.addColorStop(0,'rgba(220,230,255,.6)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,1200,W,400);ctx.restore();light([[540,1400,600,'#c8d8ff']],'#363650');return}
 ctx.fillStyle='#16141c';ctx.fillRect(-300,-300,W+600,H+600);cam(1.0);const speaking=(lt>=t3-0.1&&lt<t3+1.8);
 bust(560,820,2.1,0.05,'#6a6070',Object.assign({},HUNG,{em:'fear',look:-0.2,sweat:true,mouth:speaking?talk(lt,1):undefined}),'#2a2830');phone(800,680,1.6);
 light([[820,700,700,'#a0c8ff'],[820,700,260,'#d8ecff']],'#30303e')};
SH.crack=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.3),t2=L_(ls,2,D*0.7);
 if(lt<t2){ctx.fillStyle='#0c0b10';ctx.fillRect(-300,-300,W+600,H+600);cam(lt<t1?1:1.15+0.05*sm(seg(lt,t1,t2)),540,1100);
  q(()=>ctx.rect(-300,700,W+600,520),'#3a2c22',3);ctx.fillStyle='#d8e0f0';ctx.fillRect(-300,1220,W+600,26);
  ctx.save();ctx.beginPath();ctx.rect(-300,1220,W+600,26);ctx.clip();ctx.translate(0,0);if(lt>=t1)feetRev(540,1300,0.42,'#eef0f4');ctx.restore();
  ctx.fillStyle='#2a2420';ctx.fillRect(-300,1246,W+600,700);
  if(lt>=t1){ctx.save();ctx.globalAlpha=sm(seg(lt,t1,t1+0.5));ctx.fillStyle='#0c0b10';ctx.fillRect(-300,-300,W+600,1000);ctx.restore();ctx.save();ctx.translate(0,-120);feetRev(540,700,1.6,'#eceef2');ctx.restore();
   }
  light([[540,1230,700,'#d8e4ff']],'#34344c');return}
 wallIn('#1e1a24','#16141c');cam(1.0);bust(540,880,1.9,0.08,'#6a6070',Object.assign({},HUNG,{em:'fear',look:0.6,sweat:true,eyesClosed:0}),'#2a2830');phone(380,1180,1.3);light([[380,1100,600,'#a0c8ff']],'#30303e')};
SH.morning=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.2),t2=L_(ls,2,D*0.4),t3=L_(ls,3,D*0.8);
 if(lt<t1){houseDay(T);cam(1.6,540,1000);door(440,860,200,340,{col:'#6a4a32',prints:[[40,90,-0.2],[150,60,0.15],[60,230,0.1],[160,210,-0.1]]});light([[540,600,1100,'#fff4e6']],'#9a96a6');return}
 if(lt>=t2&&lt<t3){houseDay(T);cam(1.0);bust(540,820,2.0,0.0,'#5e5456',Object.assign({},BACHU,{em:'sad',look:0,mouth:talk(lt,1)}));light([[540,500,1100,'#fff4e6']],'#8a8496');return}
 houseDay(T);cam(1.05);bust(330,980,1.25,0,'#5e5456',Object.assign({},BACHU,{em:'sad',look:0.6}));bust(780,960,1.3,0,'#6a6070',Object.assign({},HUNG,{em:'fear',look:-0.6,sweat:lt<t2}),'#2a2830');light([[540,500,1200,'#fff4e6']],'#8e8a9a')};
SH.night2=(lt,D,T,ls)=>{const t1=L_(ls,1,D*0.6);wallIn('#262230','#1c1a24');
 if(lt<t1){cam(1.0);bust(540,860,2.0,0,'#6a6070',Object.assign({},HUNG,{em:'fear',look:Math.sin(T*1.3)*0.6,sweat:true}),'#2a2830');clock(870,380,120,2,58+Math.floor(lt));light([[540,700,900,'#ffcf90']],'#3c3a50');return}
 cam(1+0.15*sm(seg(lt,t1,D)),540,700);clock(540,700,260,3,0);light([[540,700,700,'#ffcf90']],'#3a3a50')};
SH.knock2=(lt,D,T,ls)=>{const t2=L_(ls,2,D*0.5),t3=L_(ls,3,D*0.7);
 if(lt>=t2&&lt<t3){wallIn('#262230','#1c1a24');bust(540,800,2.1,0,'#6a6070',Object.assign({},HUNG,{em:'fear',look:0.5,mouth:talk(lt,1)}),'#2a2830');light([[540,700,900,'#ffcf90']],'#3c3a50');return}
 const k=TL.knocks.filter(x=>x[2]===3).map(x=>x[0]-TL.sc.knock2);wallIn('#241e28','#1a161e');const kf=knockFx(lt,k);cam(1.05);ctx.save();ctx.translate(kf*3,0);door(290,520,500,860,{under:'255,200,120'});ctx.restore();
 if(kf>0){ctx.save();ctx.globalAlpha=kf;ctx.font='900 110px "DejaVu Sans"';ctx.textAlign='center';ctx.lineWidth=12;ctx.strokeStyle='#000';ctx.strokeText('CỐC',540,420);ctx.fillStyle='#e8e2d4';ctx.fillText('CỐC',540,420);ctx.restore()}
 light([[540,1400,700,'#ffcf90']],'#42405a')};
SH.open=(lt,D,T,ls)=>{const t2=L_(ls,2,D*0.5),t3=L_(ls,3,D*0.75);
 if(lt>=t3){ctx.fillStyle='#14121a';ctx.fillRect(-300,-300,W+600,H+600);cam(1+0.1*sm(seg(lt,t3,D)),540,1000);q(()=>ctx.rect(-300,1100,W+600,900),'#3a3030',3);feetRev(540,1100,1.5,'#d8d0c4');light([[540,900,700,'#ffcf90']],'#3c3a50');return}
 // doorway view from inside: bà chủ outside under porch lamp, bowl with steam; Hùng's shadow on floor, none for her
 ctx.fillStyle='#14121a';ctx.fillRect(-300,-300,W+600,H+600);q(()=>ctx.rect(200,300,680,1200),'#0a0c14',4);
 const lampG=ctx.createRadialGradient(540,380,10,540,380,500);lampG.addColorStop(0,'rgba(255,210,140,.7)');lampG.addColorStop(1,'rgba(255,210,140,0)');ctx.fillStyle=lampG;ctx.fillRect(200,300,680,1200);q(()=>ctx.ellipse(540,340,30,22,0,0,7),'#ffd890',2);
 ctx.save();ctx.beginPath();ctx.rect(200,300,680,1200);ctx.clip();fig5(540,1420,2.2,{hair:'bun',hairCol:'#b8b2ae',wrinkles:true,bug:true,cel:true,skin:'#dcc0ac',skin2:'#bca08c',shirt:'#5e5456',pants:'#2a2628',em:'calm',mouth:'smile',pose:{la:[0.55,1.7],ra:[-0.55,-1.7]}});
 q(()=>ctx.ellipse(540,1090,66,24,0,0,7),'#eae4d8',3);for(let i=0;i<3;i++)ln([[520+i*20,1070],[515+i*20+Math.sin(T*2+i)*8,1000],[525+i*20,940]],3,'rgba(240,240,240,.5)');ctx.restore();
 if(lt>=t2){ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.moveTo(300,1500);ctx.lineTo(500,1500);ctx.lineTo(560,1900);ctx.lineTo(200,1900);ctx.fill();ctx.save();ctx.font='bold 44px "DejaVu Sans"';ctx.textAlign='center';ctx.fillStyle='rgba(255,255,255,.7)';ctx.fillText('chỉ có bóng của Hùng',540,1560);ctx.restore()}
 light([[540,600,900,'#ffd8a0']],'#42405a')};
SH.reveal=(lt,D,T,ls)=>{ctx.fillStyle='#0e0c12';ctx.fillRect(-300,-300,W+600,H+600);const z=1+0.3*sm(lt/0.5)+0.04*lt;cam(z,540,820);
 ctx.save();ctx.translate(540,820);ctx.rotate(-0.25);ctx.scale(2.6,2.6);face5({hair:'bun',hairCol:'#b8b2ae',wrinkles:true,em:'grin',ghostShade:true,skin:'#e2e2e6',skin2:'#b0b2be'});ctx.restore();
 light([[540,1100,900,'#d0d8f0']],'#3a3a50')};
SH.after=(lt,D,T,ls)=>{houseDay(T);cam(1.2+0.15*sm(lt/D),540,1150);door(440,860,200,340,{col:'#6a4a32',prints:[[40,90,-0.2],[150,60,0.15],[60,230,0.1],[160,210,-0.1]]});
 for(const sd of [-1,1])q(()=>ctx.ellipse(540+sd*30,1230,22,10,sd*0.2,0,7),'#3a5a7a',2.4);light([[540,600,1100,'#f0f0f0']],'#8a8a96')};
SH.end=(lt,D,T,ls)=>{ctx.fillStyle='#08070a';ctx.fillRect(-300,-300,W+600,H+600);clock(540,620,180,3,0);
 ctx.save();ctx.textAlign='center';ctx.font='900 62px "DejaVu Sans"';ctx.fillStyle='#f0e8dc';ctx.fillText('CHUYỆN ĐÔNG TÂY KIM CỔ',540,960);ctx.fillStyle='#d62a2a';ctx.beginPath();ctx.roundRect(330,1010,420,96,48);ctx.fill();ctx.fillStyle='#fff';ctx.font='900 52px "DejaVu Sans"';ctx.fillText('THEO DÕI',540,1076);ctx.restore()};
function draw(T){ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
 for(const [k,a,b,ls] of TL.scenes){if(T>=a&&T<b){ctx.save();(SH[k]||(()=>{}))(T-a,b-a,T,ls);ctx.restore();
  ctx.setTransform(1,0,0,1,0,0);const d=Math.min(T-a,b-T);if(d<0.1&&a>0){ctx.fillStyle=`rgba(0,0,0,${1-d/0.1})`;ctx.fillRect(0,0,W,H)}break}}
 ctx.setTransform(1,0,0,1,0,0);sub(T)}
