// ===== ĐOÀN XÁC TƯƠNG TÂY — nhân vật nét Ma Lai =====
const PHUC={shirt:'#2f4a5e',pants:'#1e2228'};
function phuc(x,y,s,o={}){person(x,y,s,Object.assign({},PHUC,o));if(o.paper){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const side=o.armA&&o.armA[1]!=null&&o.armA[0]==null?1:-1;const a=o.armA?(o.armA[side>0?1:0]??side*0.1):side*0.1;ctx.translate(side*40,-210);ctx.rotate(a);ctx.translate(0,104);ctx.rotate(-a);ctx.fillStyle=o.paper==='bua'?'#e8c23a':'#e8d8a8';ctx.strokeStyle='#a01818';ctx.lineWidth=3;ctx.fillRect(-16,-22,32,44);ctx.strokeRect(-16,-22,32,44);if(o.blood){}ctx.restore()}if(o.lamp){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const sd=o.lamp;ctx.translate(sd*44,-140);halo(0,0,120,'255,170,80',0.45);ctx.fillStyle='#3a2a18';ctx.fillRect(-3,-36,6,22);ctx.fillStyle='#ffcf70';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,14,18,0,0,7);ctx.fill();ctx.stroke();ctx.restore()}}
// Mai: bím tóc, áo hồng; o.scratch = vết móng tím trên cổ
function mai(x,y,s,o={}){woman(x,y,s,Object.assign({shirt:'#9a4a5a',pants:'#2a1e24',skin:'#e4ddd2',smile:false},o));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(!o.back){for(const sd of [-1,1]){ctx.strokeStyle=HAIR;ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(sd*52,-262);ctx.quadraticCurveTo(sd*64,-215,sd*56,-180);ctx.stroke();circ(sd*56,-176,6,'#c03040')}}
 if(o.scratch){ctx.strokeStyle='rgba(90,40,110,.95)';ctx.lineWidth=3.5;for(let k=0;k<5;k++){ctx.beginPath();ctx.moveTo(-14+k*7,-238);ctx.lineTo(-17+k*7,-222);ctx.stroke()}}
 if(o.tears){ctx.strokeStyle='rgba(170,210,240,.9)';ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*20,-262);ctx.lineTo(sd*21,-240+((o.T||0)*20)%12);ctx.stroke()}}
 ctx.restore()}
// Thầy dắt xác: áo đạo bào vàng, mũ đen, chuông đồng
function daosi(x,y,s,T,o={}){const aa=[o.talisman?1.9:null,o.ring?-1.9:null];person(x,y,s,Object.assign({robe:true,shirt:'#c9a227',pants:'#2a2418',beard:true,hair:'#6a6864',armA:aa},o));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 const hy=-278;ctx.fillStyle='#161616';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-46,hy-44);ctx.lineTo(46,hy-44);ctx.lineTo(34,hy-80);ctx.lineTo(-34,hy-80);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#c9a227';ctx.fillRect(-8,hy-72,16,18);
 // dây thái cực trên áo
 ctx.strokeStyle='#7a1414';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-50,-150);ctx.lineTo(50,-150);ctx.stroke();
 if(o.bell!==false){const sd=o.bellSide||1;const sw=Math.sin(T*(o.ring?18:3))*(o.ring?0.5:0.15);ctx.save();ctx.translate(sd*40,-210);ctx.rotate(o.ring?-sd*1.9:sd*0.1);ctx.translate(0,96);ctx.rotate(sw);ctx.fillStyle='#b8862a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-12,0);ctx.lineTo(12,0);ctx.lineTo(18,30);ctx.lineTo(-18,30);ctx.closePath();ctx.fill();ctx.stroke();circ(0,34,4,'#6a4a10');ctx.restore()}
 if(o.talisman){ctx.save();ctx.translate(-40,-210);ctx.rotate(-1.9);ctx.translate(0,100);ctx.fillStyle='#e8c23a';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.fillRect(-14,0,28,62);ctx.strokeRect(-14,0,28,62);ctx.strokeStyle='#b01818';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(0,6);ctx.lineTo(-6,20);ctx.lineTo(6,30);ctx.lineTo(-5,44);ctx.lineTo(4,56);ctx.stroke();if(o.burn){halo(0,30,70,'255,120,30',0.8)}ctx.restore()}
 ctx.restore()}
// Bùa vàng (vẽ tại chỗ)
function bua(x,y,w,h,burn,T){ctx.save();ctx.translate(x,y);ctx.fillStyle=burn?'#b8862a':'#e8c23a';ctx.strokeStyle='#6a4a10';ctx.lineWidth=2;ctx.fillRect(-w/2,0,w,h);ctx.strokeRect(-w/2,0,w,h);ctx.strokeStyle='#b01818';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,h*0.08);ctx.lineTo(-w*0.25,h*0.3);ctx.lineTo(w*0.25,h*0.48);ctx.lineTo(-w*0.2,h*0.68);ctx.lineTo(w*0.15,h*0.9);ctx.stroke();ctx.fillStyle='#b01818';ctx.fillRect(-w*0.3,h*0.12,w*0.6,3);
 if(burn){halo(0,h*0.6,w*2.4,'255,130,30',0.85);for(let k=0;k<5;k++){const fx=(rnd(k)-0.5)*w,fh=h*0.4*(0.6+0.4*Math.sin(T*20+k));ctx.fillStyle=k%2?'#ffb030':'#ff5a10';ctx.beginPath();ctx.moveTo(fx-8,h);ctx.quadraticCurveTo(fx,h-fh,fx+8,h);ctx.fill()}ctx.fillStyle='#1a1008';ctx.fillRect(-w/2,h*0.75,w,h*0.25)}
 ctx.restore()}
// Cương thi: áo thụng đen nhà Thanh, nón rộng vành, bùa vàng rủ trước mặt
// o.back: quay lưng; o.nohat: đã lột nón; o.nobua; o.thread: chỉ đỏ cổ tay; o.open: mở mắt; o.grab: hai tay giơ chụp; o.small: dáng con gái
function cuongthi(x,fy,s,T,o={}){ctx.save();ctx.translate(x,fy);ctx.scale(s,s);ctx.lineJoin='round';ctx.lineCap='round';
 const sm2=o.small?0.86:1;ctx.scale(sm2,sm2);const robe=o.small?'#5a2a3a':'#15171d',trim='#5a1414',skin=o.skin||'#aeb8ae',top=-236,hy=top-48;
 if(o.glow)halo(0,hy,300,'120,255,160',0.22);
 // chân cứng, giày vải đen
 for(const sd of [-1,1]){ctx.fillStyle='#0a0a0c';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sd*16,-6,18,8,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#e8e4da';ctx.fillRect(sd*16-12,-26,24,16)}
 // áo thụng dài tới mắt cá, viền đỏ
 ctx.fillStyle=robe;ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-40,top+8);ctx.lineTo(40,top+8);ctx.lineTo(60,-24);ctx.lineTo(-60,-24);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.strokeStyle=trim;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-58,-30);ctx.lineTo(58,-30);ctx.stroke();if(!o.back){ctx.beginPath();ctx.moveTo(-18,top+10);ctx.lineTo(14,top+60);ctx.lineTo(14,-30);ctx.stroke();for(let k=0;k<4;k++)circ(16,top+70+k*36,4,'#c9a227')}
 // tay cứng
 const arm=(sd,ang)=>{ctx.save();ctx.translate(sd*38,top+20);ctx.rotate(ang);ctx.strokeStyle=INK;ctx.lineWidth=26;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,118);ctx.stroke();ctx.strokeStyle=robe;ctx.lineWidth=19;ctx.stroke();ctx.strokeStyle=trim;ctx.lineWidth=19;ctx.beginPath();ctx.moveTo(0,104);ctx.lineTo(0,118);ctx.stroke();
  ctx.translate(0,124);circ(0,0,10,skin,INK,3);for(let f=0;f<4;f++){ctx.save();ctx.rotate((f-1.5)*0.25);ctx.strokeStyle=INK;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,4);ctx.lineTo(0,26);ctx.lineTo(o.grab?-6:0,34);ctx.stroke();ctx.strokeStyle='#d8d8c8';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(0,26);ctx.lineTo(o.grab?-6:0,34);ctx.stroke();ctx.restore()}
  if(o.thread&&sd===1){ctx.strokeStyle='#e01e2a';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-12,-8);ctx.lineTo(12,-6);ctx.stroke();halo(0,-7,22,'255,40,50',0.35)}ctx.restore()};
 const aL=o.reach?o.reach*-1.45:(o.grab?2.4:0.05),aR=o.reach?o.reach*-1.45:(o.grab?-2.4:-0.05);arm(-1,aL);arm(1,aR);
 // cổ + đầu
 ctx.fillStyle=skin;ctx.fillRect(-10,top-8,20,20);
 ctx.save();ctx.translate(0,hy);ctx.rotate(o.tilt||0);
 if(o.back){circ(0,0,58,HAIR,INK,4);ctx.strokeStyle='#0a0a0a';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(0,40);ctx.quadraticCurveTo(8,120,-4,200);ctx.stroke()}
 else if(o.nohat||o.open){scaryFace(T,{closed:!o.open,open:o.open?0.75:0.05,skin,woman:o.small});if(o.small){/* bím tóc Mai */for(const sd of [-1,1]){ctx.strokeStyle=HAIR;ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(sd*50,8);ctx.quadraticCurveTo(sd*62,78,sd*54,128);ctx.stroke();circ(sd*54,132,6,'#c03040')}}}
 else{circ(0,0,58,skin,INK,4);ctx.fillStyle='#050505';for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*22,8,15,4,0,0,7);ctx.fill()}}
 // nón rộng vành
 if(!o.nohat){ctx.save();ctx.translate(0,-28);ctx.fillStyle='#4a3a22';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,0,104,22,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#5a4628';ctx.beginPath();ctx.moveTo(-50,-4);ctx.quadraticCurveTo(0,-70,50,-4);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(20,12,4,.5)';ctx.lineWidth=2;for(let k=-4;k<=4;k++){ctx.beginPath();ctx.moveTo(k*10,-4);ctx.lineTo(k*4,-38);ctx.stroke()}ctx.restore()}
 // bùa vàng rủ trước mặt
 if(!o.back&&((!o.nobua&&!o.nohat)||o.forceBua)){bua(0,o.forceBua&&o.nohat?-46:-14,o.forceBua?46:40,o.forceBua?104:96,o.burn,T);if(o.forceBua){ctx.fillStyle='rgba(160,10,14,.9)';ctx.fillRect(-12,-36,24,4);ctx.fillRect(-4,-30,4,40)}}
 ctx.restore();ctx.restore()}
// cha khi còn sống (thợ mỏ)
function cha(x,y,s,o={}){person(x,y,s,Object.assign({shirt:'#5a5040',pants:'#2a2620',khan:false},o));if(o.thread){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const a=o.armA?o.armA[1]:0.1;ctx.translate(40,-210);ctx.rotate(a);ctx.strokeStyle='#e01e2a';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-10,84);ctx.lineTo(10,86);ctx.stroke();ctx.restore()}
 if(o.bag){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#6a5a3a';ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.roundRect(-70,-220,40,90,10);ctx.fill();ctx.stroke();ctx.restore()}}
