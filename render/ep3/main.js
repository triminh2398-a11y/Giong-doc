import * as THREE from 'three';
const QS=new URLSearchParams(location.search);const VERT=QS.get('v')==='1';const T0=+(QS.get('t0')||0);const SDUR=+(QS.get('d')||0);const NOSUB=QS.get('nosub')==='1';const WM=QS.get('wm')==='1';const RW=VERT?720:1280,RH=VERT?1280:720;
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(1);renderer.setSize(RW,RH);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.outputColorSpace=THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);
const ov=document.createElement('canvas');ov.width=RW;ov.height=RH;document.body.appendChild(ov);const g2=ov.getContext('2d');
const flat=document.createElement('canvas');flat.width=1280;flat.height=720;
const cam=new THREE.PerspectiveCamera(40,RW/RH,0.05,400);
const R=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};
function ctex(w,h,fn,rep){const c=document.createElement('canvas');c.width=w;c.height=h;const old=ctx;ctx=c.getContext('2d');fn(ctx,w,h);ctx=old;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1])}t.anisotropy=8;return t}
const plank=(base,rep)=>ctex(512,512,(g,w,h)=>{g.fillStyle=base;g.fillRect(0,0,w,h);const n=8;for(let i=0;i<n;i++){const y=i*h/n;g.fillStyle=`rgba(${R(i+3)>0.5?255:0},${R(i+3)>0.5?220:0},${R(i+3)>0.5?180:0},${0.04+R(i)*0.06})`;g.fillRect(0,y,w,h/n);g.fillStyle='rgba(0,0,0,.45)';g.fillRect(0,y,w,3);for(let j=0;j<30;j++){g.strokeStyle=`rgba(0,0,0,${0.06+R(i*50+j)*0.08})`;g.lineWidth=1+R(j)*2;g.beginPath();const yy=y+R(i*7+j)*h/n;g.moveTo(0,yy);g.bezierCurveTo(w*0.3,yy+(R(j)-0.5)*8,w*0.7,yy+(R(j+1)-0.5)*8,w,yy+(R(j+2)-0.5)*6);g.stroke()}}},rep);
const woodT=plank('#6b4a2c',[2,2]);
const laT=ctex(512,512,(g,w,h)=>{g.fillStyle='#6a5634';g.fillRect(0,0,w,h);for(let r=0;r<10;r++){const y=r*h/10;for(let k=0;k<60;k++){const x=R(r*99+k)*w;g.strokeStyle=`rgba(${R(k)>0.5?150:40},${R(k)>0.5?125:30},${R(k)>0.5?70:12},.5)`;g.lineWidth=3;g.beginPath();g.moveTo(x,y);g.lineTo(x+(R(k+r)-0.5)*14,y+h/10+6);g.stroke()}g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,y+h/10-4,w,4);g.fillStyle='rgba(60,40,20,.8)';g.fillRect(0,y+4,w,3)}},[2,1.2]);
const thatchT=ctex(512,512,(g,w,h)=>{g.fillStyle='#5c4a2a';g.fillRect(0,0,w,h);for(let k=0;k<2500;k++){g.strokeStyle=`rgba(${R(k)>0.5?160:30},${R(k)>0.5?130:22},${R(k)>0.5?70:10},.35)`;g.lineWidth=1.5;const x=R(k*3)*w,y=R(k*5)*h;g.beginPath();g.moveTo(x,y);g.lineTo(x+(R(k)-0.5)*10,y+30+R(k+7)*30);g.stroke()}},[6,3]);
const dirtT=ctex(512,512,(g,w,h)=>{g.fillStyle='#5a4a36';g.fillRect(0,0,w,h);for(let k=0;k<900;k++){g.fillStyle=`rgba(${R(k)>0.5?120:20},${R(k)>0.5?100:15},${R(k)>0.5?70:10},${0.1+R(k+1)*0.15})`;g.beginPath();g.ellipse(R(k*3)*w,R(k*7)*h,2+R(k)*10,1+R(k+2)*5,R(k)*3,0,7);g.fill()}},[6,6]);
const yardT=ctex(512,512,(g,w,h)=>{g.fillStyle='#4a4430';g.fillRect(0,0,w,h);for(let k=0;k<1500;k++){g.fillStyle=`rgba(${R(k)>0.6?70:30},${R(k)>0.6?90:30},${R(k)>0.6?40:18},${0.2+R(k+1)*0.2})`;g.beginPath();g.ellipse(R(k*3)*w,R(k*7)*h,3+R(k)*12,2+R(k+2)*6,R(k)*3,0,7);g.fill()}},[40,40]);
const matT=ctex(256,256,(g,w,h)=>{g.fillStyle='#b8a070';g.fillRect(0,0,w,h);for(let i=0;i<w;i+=8){g.fillStyle=`rgba(0,0,0,${0.08+R(i)*0.1})`;g.fillRect(i,0,3,h)}g.strokeStyle='#8a2a2a';g.lineWidth=6;g.strokeRect(14,14,w-28,h-28)},[1,1]);
const khanT=new THREE.CanvasTexture(KR);khanT.colorSpace=THREE.SRGBColorSpace;khanT.wrapS=khanT.wrapT=THREE.RepeatWrapping;khanT.repeat.set(3,2);
const dustTex=ctex(64,64,(g)=>{const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64)});
const M=o=>new THREE.MeshStandardMaterial(Object.assign({roughness:0.9,metalness:0},o));
function box(w,h,d,m,x,y,z,par,cast=true){const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=cast;b.receiveShadow=true;par.add(b);return b}
function cyl(rt,rb,h,m,x,y,z,par,seg=14){const b=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),m);b.position.set(x,y,z);b.castShadow=true;b.receiveShadow=true;par.add(b);return b}
function jar(r,x,z,par,col=0x5a3a28,sy=1.25){const j=new THREE.Mesh(new THREE.SphereGeometry(r,20,14),M({color:col,roughness:0.45}));j.scale.y=sy;j.position.set(x,r*sy*0.95,z);j.castShadow=true;j.receiveShadow=true;par.add(j);cyl(r*0.55,r*0.6,0.06,M({color:col}),x,r*sy*1.9,z,par);return j}
function cardTex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const old=ctx;ctx=c.getContext('2d');fn(ctx);ctx=old;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
function flatCard(tex,w,h,x,y,z,par,ry){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tex,transparent:true,alphaTest:0.3,side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.y=ry||0;m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:tex,alphaTest:0.3});par.add(m);return m}
const banT=cardTex(512,512,g=>{banana(256,512,1.6,0,'#2f4a32')});
const grassT=cardTex(256,128,g=>{for(let i=0;i<40;i++){g.strokeStyle=`rgb(${50+R(i)*30},${80+R(i+1)*40},${40})`;g.lineWidth=3;g.beginPath();const x=10+R(i*3)*236;g.moveTo(x,128);g.quadraticCurveTo(x+(R(i)-0.5)*30,70,x+(R(i+5)-0.5)*40,10+R(i+9)*60);g.stroke()}});
const riceT=cardTex(256,128,g=>{for(let i=0;i<70;i++){g.strokeStyle=`rgb(${70+R(i)*40},${120+R(i+1)*50},${40})`;g.lineWidth=2.5;g.beginPath();const x=4+R(i*3)*248;g.moveTo(x,128);g.quadraticCurveTo(x+(R(i)-0.5)*20,60,x+(R(i+5)-0.5)*30,4+R(i+9)*40);g.stroke()}});
const chickT=cardTex(256,256,g=>{chicken(128,200,1.4,{})});
const nipaT=cardTex(512,512,g=>{for(let i=0;i<9;i++){g.save();g.translate(256,512);g.rotate(-1.2+i*0.3+(R(i)-0.5)*0.1);g.strokeStyle='#2a3a22';g.lineWidth=7;g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(20,-250,60*(R(i)-0.5),-470+R(i+2)*60);g.stroke();for(let k=1;k<26;k++){const t=k/26,y=-t*440,x=20*t*(1-t)*4;g.fillStyle=`rgba(${40+R(i*k)*20},${70+R(k)*30},${34},.95)`;for(const sd of [-1,1]){g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+sd*40,y+6,x+sd*70*(1-t*0.5),y+30);g.lineTo(x+sd*6,y+10);g.fill()}}g.restore()}});
const palmT=cardTex(512,1024,g=>{g.strokeStyle='#4a3a28';g.lineWidth=22;g.beginPath();g.moveTo(256,1024);g.quadraticCurveTo(230,600,280,190);g.stroke();for(let k=0;k<20;k++){g.strokeStyle='rgba(30,20,10,.5)';g.lineWidth=3;const y=1000-k*42;g.beginPath();g.moveTo(244,y);g.lineTo(272,y-4);g.stroke()}for(let i=0;i<11;i++){g.save();g.translate(280,190);g.rotate(-Math.PI/2+(i-5)*0.42);g.strokeStyle='#2c4428';g.lineWidth=6;g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(110,-20,230,50);g.stroke();for(let k=1;k<20;k++){const t=k/20;const x=230*t,y=-20*Math.sin(t*3)+70*t*t;g.strokeStyle='#33502c';g.lineWidth=4;g.beginPath();g.moveTo(x,y);g.lineTo(x+14,y+40);g.moveTo(x,y);g.lineTo(x+18,y-30);g.stroke()}g.restore()}circ(270,205,16,'#3a5a24',null);circ(296,200,15,'#3a5a24',null)});
const bambooCard=(seed,col='#0e1a16')=>{const t=cardTex(256,1024,g=>{bamboo(40,1024,5,900,0,seed,col)});const m=new THREE.Mesh(new THREE.PlaneGeometry(3,12),new THREE.MeshStandardMaterial({map:t,transparent:true,alphaTest:0.3,side:THREE.DoubleSide}));m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:0.3});return m};
// ---------- cards nhân vật ----------
function mk(h,fn,wide){const c=document.createElement('canvas');c.width=wide?1024:512;c.height=1024;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
 const mat=new THREE.MeshStandardMaterial({map:t,transparent:true,alphaTest:0.4,side:THREE.DoubleSide,roughness:1,emissive:0xffffff,emissiveMap:t,emissiveIntensity:0.16});const m=new THREE.Mesh(new THREE.PlaneGeometry(wide?h:h*0.5,h),mat);m.castShadow=true;
 m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:0.4});m.userData={o:{},h,fn,wide};
 m.userData.paint=(T)=>{const old=ctx;ctx=c.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,c.width,1024);if(wide)ctx.translate(256,0);ctx.globalAlpha=m.userData.o.a??1;fn(T,m.userData.o);ctx.globalAlpha=1;ctx=old;t.needsUpdate=true};return m}
const DRAW={
 TAM:[2.0,(T,o)=>tam(256,1000,2.6,Object.assign({t:T},o)),1],LOC:[2.0,(T,o)=>loc(256,1000,2.6,Object.assign({t:T},o)),1],LOCF:[2.0,(T,o)=>loc(256,1000,2.6,Object.assign({t:T,fake:true},o)),1],
 NHAN:[2.0,(T,o)=>nhan(256,1000,2.6,Object.assign({t:T},o)),1],THUY:[2.0,(T,o)=>thuy(256,1000,2.6,Object.assign({t:T},o)),1],BNL:[2.0,(T,o)=>bnl(256,1000,2.6,Object.assign({t:T},o)),1],HOA:[2.0,(T,o)=>hoa(256,1000,2.6,Object.assign({t:T},o)),1],
 D1:[2.0,(T,o)=>danNam(256,1000,2.6,Object.assign({t:T,shirt:'#4a5048'},o)),1],D2:[2.0,(T,o)=>danNam(256,1000,2.6,Object.assign({t:T+0.7,shirt:'#3a3a52',hair:'#3a3a3a'},o)),1],D3:[2.0,(T,o)=>danNam(256,1000,2.6,Object.assign({t:T+1.3,shirt:'#5a4a3a'},o)),1],
 N1:[2.0,(T,o)=>danNu(256,1000,2.6,Object.assign({t:T,shirt:'#6a5a44'},o)),1],N2:[2.0,(T,o)=>danNu(256,1000,2.6,Object.assign({t:T,ph:1.5,shirt:'#4a5a6a',old:true},o)),1],
 MA:[2.8,(T,o)=>maRung(256,1000,1.5,T,o),1],MUC:[0.8,(T,o)=>muc(256,1000,4,Object.assign({t:T},o)),1]};
function cast(scene){const C={};for(const k in DRAW){const [h,fn,w]=DRAW[k];C[k]=mk(h,fn,!!w);C[k].visible=false;scene.add(C[k])}
 {const m=C.MA.material;m.emissive=new THREE.Color(0x9aa0a0);m.emissiveIntensity=0.3}return C}
// thẻ nằm (phẳng)
function lying(fn,h=1.75){const c=document.createElement('canvas');c.width=512;c.height=1024;const old=ctx;ctx=c.getContext('2d');fn();ctx=old;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
 const m=new THREE.Mesh(new THREE.PlaneGeometry(h*0.5,h),new THREE.MeshStandardMaterial({map:t,transparent:true,alphaTest:0.4,side:THREE.DoubleSide,emissive:0xffffff,emissiveMap:t,emissiveIntensity:0.3}));m.rotation.set(-Math.PI/2,0,Math.PI/2);m.receiveShadow=true;m.visible=false;
 m.userData.repaint=(f)=>{const old=ctx;ctx=c.getContext('2d');ctx.clearRect(0,0,512,1024);f();ctx=old;t.needsUpdate=true};return m}
// em bé quấn khăn rằn (3D)
function babyMesh(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CapsuleGeometry(0.11,0.24,6,12),M({map:khanT}));b.rotation.z=Math.PI/2;b.castShadow=true;g.add(b);
 const ft=ctex(128,128,(c,w,h)=>{c.fillStyle='#e6d8c8';c.fillRect(0,0,w,h);c.fillStyle='#141414';c.beginPath();c.arc(64,20,60,Math.PI,0);c.fill();c.beginPath();c.arc(50,64,6,0,7);c.arc(78,64,6,0,7);c.fill()});
 const f=new THREE.Mesh(new THREE.SphereGeometry(0.085,16,12),M({map:ft}));f.position.set(-0.2,0.04,0);f.rotation.y=-Math.PI/2;f.rotation.x=-0.6;g.add(f);g.visible=false;return g}

// ================= NỘI THẤT NHÀ LÁ =================
const inn=new THREE.Scene();inn.background=new THREE.Color(0x07080c);inn.fog=new THREE.FogExp2(0x0b0d12,0.035);
const WALLM=M({map:laT,color:0xb8a080});
box(10,0.2,8,M({map:dirtT}),0,-0.1,0,inn);
// tường sau có cửa sau (x=2.6)
box(6.65,3.2,0.15,WALLM,-1.175,1.6,-3.2,inn);box(1.45,3.2,0.15,WALLM,3.775,1.6,-3.2,inn);box(0.9,1.1,0.15,WALLM,2.6,2.65,-3.2,inn);
const backOut=new THREE.Mesh(new THREE.PlaneGeometry(0.9,2.1),new THREE.MeshBasicMaterial({color:0x0c1422}));backOut.position.set(2.6,1.05,-3.35);inn.add(backOut);
// tường trái có cửa sổ (z=0.3)
box(0.15,3.2,3.0,WALLM,-4.5,1.6,-1.7,inn);box(0.15,3.2,2.6,WALLM,-4.5,1.6,2.1,inn);box(0.15,1.0,1.0,WALLM,-4.5,0.5,0.3,inn);box(0.15,1.3,1.0,WALLM,-4.5,2.55,0.3,inn);
const winOut=new THREE.Mesh(new THREE.PlaneGeometry(1.0,0.9),new THREE.MeshBasicMaterial({color:0x1a2a44}));winOut.position.set(-4.62,1.45,0.3);winOut.rotation.y=Math.PI/2;inn.add(winOut);
for(let i=0;i<4;i++)box(0.05,0.9,0.05,M({color:0x3a2818}),-4.5,1.45,-0.1+i*0.27,inn);
box(0.15,3.2,8,WALLM,4.5,1.6,0,inn);
// cột + kèo
const POSTM=M({color:0x4a3420});for(const [x,z] of [[-0.9,0.6],[1.5,0.6],[-4.4,-3.1],[4.4,-3.1],[-4.4,3.6],[4.4,3.6]])cyl(0.09,0.1,3.3,POSTM,x,1.65,z,inn,10);
for(let i=-3;i<=3;i++)box(0.12,0.16,8.2,M({color:0x3a2818}),i*1.4,3.25,0,inn);box(9.2,0.18,0.18,M({color:0x3a2818}),0,3.15,-3.1,inn);box(9.2,0.18,0.18,M({color:0x3a2818}),0,3.15,0.6,inn);
const ceil=box(10,0.1,8,M({map:thatchT}),0,3.4,0,inn,false);
// bàn thờ
const ALT=new THREE.Group();inn.add(ALT);ALT.position.set(0,0,-2.85);
box(1.6,0.08,0.55,M({map:woodT,color:0x8a5a3a}),0,1.1,0,ALT);for(const sx of [-0.7,0.7])for(const sz of [-0.2,0.2])box(0.06,1.1,0.06,M({color:0x3a2414}),sx,0.55,sz,ALT);
box(1.6,0.5,0.02,M({color:0x8a1a18}),0,0.82,0.28,ALT);
const portT=ctex(256,320,(g,w,h)=>{g.fillStyle='#d8d0b8';g.fillRect(0,0,w,h);g.fillStyle='#1a1a1a';g.fillRect(8,8,w-16,h-16);g.fillStyle='#9a968a';g.fillRect(16,16,w-32,h-32);const old=ctx;ctx=g;person(128,560,1.2,{shirt:'#2a2a2a',eyes:1,hair:'#555'});ctx=old});
{const p=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.43,0.03),M({map:portT}));p.position.set(-0.45,1.36,-0.1);p.rotation.x=-0.08;ALT.add(p)}
cyl(0.09,0.07,0.12,M({color:0xb08850,metalness:0.4,roughness:0.4}),0.05,1.2,0,ALT);
const BOWLS=[];for(let i=0;i<5;i++){const b=cyl(0.045,0.035,0.06,M({color:0xd8d0c0,roughness:0.5}),0.28+i*0.1,1.17,0.08,ALT,10);BOWLS.push(b)}
const STICKS=[];for(let i=0;i<5;i++){const s=cyl(0.004,0.004,0.16,M({color:0xb06a30,emissive:0x331000}),0.28+i*0.1,1.27,0.08,ALT,4);STICKS.push(s)}
for(let k=-1;k<=1;k++)cyl(0.004,0.004,0.22,M({color:0xb06a30,emissive:0x552010}),0.05+k*0.03,1.32,0,ALT,4);
for(const sx of [-0.65,0.65])cyl(0.025,0.025,0.16,M({color:0xe8e0d0,emissive:0x3a2a10}),sx,1.22,0.1,ALT,8);
const innG=new THREE.PointLight(0x90ffc0,0,5,2);inn.add(innG);
const altL=new THREE.PointLight(0xff9a50,1.2,3,2);altL.position.set(0,1.5,-2.5);inn.add(altL);
// bộ ván + chiếu + gối + mùng
const VAN=new THREE.Group();inn.add(VAN);VAN.position.set(-3.1,0,-1.75);
box(2.1,0.1,1.5,M({map:woodT,color:0x9a6a40}),0,0.45,0,VAN);for(const sx of [-0.95,0.95])for(const sz of [-0.65,0.65])box(0.08,0.42,0.08,M({color:0x3a2414}),sx,0.21,sz,VAN);
box(2.0,0.02,1.4,M({map:matT}),0,0.51,0,VAN);box(0.5,0.1,0.32,M({color:0xd8d0bc}),-0.75,0.57,-0.35,VAN);box(0.5,0.1,0.32,M({color:0xd8d0bc}),-0.75,0.57,0.35,VAN);
const NET=new THREE.Mesh(new THREE.BoxGeometry(2.0,1.5,1.45),new THREE.MeshStandardMaterial({color:0xeeeeee,transparent:true,opacity:0.1,side:THREE.DoubleSide,depthWrite:false}));NET.position.set(0,1.27,0);VAN.add(NET);
const COFFIN=box(0.75,0.28,0.36,M({map:woodT,color:0xa07a50}),0.2,0.66,0,VAN);COFFIN.visible=false;
// võng
const VONG=new THREE.Group();inn.add(VONG);VONG.position.set(0.3,1.5,0.6);
{const geo=new THREE.PlaneGeometry(1.7,0.75,24,8);const p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);const u=x/0.85,v=y/0.375;p.setZ(i,0);p.setY(i,-0.62*(1-u*u)+0.12*v*v*(1-u*u*0.6));p.setX(i,x);p.setZ(i,y*(0.55+0.45*u*u))}geo.computeVertexNormals();
 const vm=new THREE.Mesh(geo,M({color:0x8a5a5a,side:THREE.DoubleSide,map:khanT}));vm.castShadow=true;VONG.add(vm);
 for(const sd of [-1,1]){const r=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,0.4,4),M({color:0x6a5a40}));r.position.set(sd*1.0,0.02,0);r.rotation.z=sd*1.2;VONG.add(r)}}
const VBABY=new THREE.Group();
// bàn tròn + ghế + đèn dầu
cyl(0.5,0.5,0.05,M({map:woodT,color:0x8a5a3a}),2.5,0.75,1.2,inn,24);cyl(0.06,0.08,0.72,M({color:0x3a2414}),2.5,0.37,1.2,inn);
for(const [x,z] of [[1.8,1.6],[3.2,1.7]])cyl(0.18,0.18,0.42,M({map:woodT,color:0x7a4a2a}),x,0.21,z,inn,12);
cyl(0.05,0.06,0.12,M({color:0xc8c0b0,roughness:0.3}),2.75,0.84,1.05,inn,10);cyl(0.035,0.04,0.07,M({color:0xc8c0b0}),2.6,0.81,1.35,inn,10);
const lampG=new THREE.Group();inn.add(lampG);lampG.position.set(2.3,0.78,1.0);
{const b=cyl(0.07,0.09,0.1,M({color:0x6a5030,roughness:0.5,metalness:0.3}),0,0.05,0,lampG);const gl=new THREE.Mesh(new THREE.SphereGeometry(0.08,16,12),new THREE.MeshStandardMaterial({color:0xffe0a0,transparent:true,opacity:0.35,roughness:0.1}));gl.scale.y=1.6;gl.position.y=0.22;
 const fl=new THREE.Mesh(new THREE.SphereGeometry(0.025,10,8),new THREE.MeshBasicMaterial({color:0xffd27a}));fl.scale.y=1.8;fl.position.y=0.2;lampG.add(gl,fl);lampG.userData.fl=fl}
const STOOL=cyl(0.17,0.17,1,M({map:woodT,color:0x7a4a2a}),0,0.5,0,inn,12);STOOL.visible=false;
function lampAt(x,z,h=0.55){STOOL.visible=true;STOOL.scale.y=h;STOOL.position.set(x,h/2,z);lampG.position.set(x,h,z)}
const lampL=new THREE.PointLight(0xffa850,14,10,1.5);lampL.position.set(2.3,1.05,1.0);lampL.castShadow=true;lampL.shadow.mapSize.set(1024,1024);lampL.shadow.bias=-0.003;inn.add(lampL);
// lu nước, khạp gạo, bao gạo, rổ, nón, dây phơi
jar(0.42,3.75,-2.5,inn);jar(0.3,3.8,-1.6,inn,0x6a4a30,1.0);jar(0.22,-3.9,2.8,inn,0x4a3020,1.3);
for(let i=0;i<2;i++){const s2=new THREE.Mesh(new THREE.CapsuleGeometry(0.24,0.36,4,10),M({color:0xc8b890}));s2.position.set(3.9,0.42,2.4-i*0.55);s2.castShadow=true;inn.add(s2)}
for(let i=0;i<3;i++){const b=new THREE.Mesh(new THREE.CylinderGeometry(0.24,0.16,0.14,14,1,true),M({color:0x9a7a48,side:THREE.DoubleSide}));b.position.set(4.38,2.0,-1.2+i*0.6);b.rotation.z=Math.PI/2;inn.add(b)}
{const n=new THREE.Mesh(new THREE.ConeGeometry(0.36,0.2,24,1,true),M({color:0xd8c48a,side:THREE.DoubleSide}));n.position.set(4.38,2.3,1.4);n.rotation.z=Math.PI/2;inn.add(n)}
box(0.02,0.02,4,M({color:0x3a2a1a}),-3.9,2.5,1.5,inn);for(const [z,c] of [[0.4,0x6a5a3a],[1.2,0x8a4a3a],[2.2,0x3c5060]]){const cl=new THREE.Mesh(new THREE.PlaneGeometry(0.55,0.8),M({color:c,side:THREE.DoubleSide}));cl.position.set(-3.9,2.08,z);cl.rotation.y=Math.PI/2;cl.castShadow=true;inn.add(cl)}
{const lb=new THREE.Mesh(new THREE.SphereGeometry(0.3,16,8,0,Math.PI*2,0,Math.PI/2),M({color:0x9a7a48,side:THREE.DoubleSide}));lb.position.set(2.5,0.78,1.4);lb.scale.set(0.7,0.6,0.7);inn.add(lb)}
// ánh trăng qua cửa sổ, cửa sau
const moonL=new THREE.SpotLight(0x8fb0ff,30,14,0.45,0.6,1.2);moonL.position.set(-7,3.0,0.3);moonL.target.position.set(-1,0,0.3);moonL.castShadow=true;inn.add(moonL,moonL.target);
const doorL=new THREE.SpotLight(0x9ab8ff,0,10,0.5,0.5,1);doorL.position.set(2.6,1.8,-6);doorL.target.position.set(2.6,0,0);doorL.castShadow=true;inn.add(doorL,doorL.target);
const dayL=new THREE.DirectionalLight(0xfff0d8,0);dayL.position.set(-8,6,4);dayL.target.position.set(0,0,0);dayL.castShadow=true;dayL.shadow.mapSize.set(2048,2048);Object.assign(dayL.shadow.camera,{left:-6,right:6,top:6,bottom:-6,far:30});inn.add(dayL,dayL.target);
const innAmb=new THREE.AmbientLight(0x1a2030,0.6);inn.add(innAmb);const innHemi=new THREE.HemisphereLight(0xd8e0e8,0x4a3a28,0);inn.add(innHemi);
const motes=[];for(let i=0;i<60;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:dustTex,color:0xbcd0ff,transparent:true,opacity:0.5,depthWrite:false}));s.scale.setScalar(0.025+R(i)*0.03);inn.add(s);motes.push(s)}
const CI=cast(inn);
const IL={};const BLANKET=new THREE.Mesh(new THREE.CapsuleGeometry(0.3,1.0,6,12),M({map:khanT,color:0x9a8a8a}));BLANKET.rotation.z=Math.PI/2;BLANKET.scale.set(1,1,0.6);BLANKET.castShadow=true;BLANKET.visible=false;VAN.add(BLANKET);BLANKET.position.set(0.35,0.62,0.2);
const IB=[];
function innMode(m){const day=m==='day';dayL.intensity=day?2.4:0;innHemi.intensity=day?1.1:0;moonL.intensity=day?0:30;winOut.material.color.set(day?0xe8e8d8:0x1a2a44);backOut.material.color.set(day?0x8a9a78:0x0c1422);inn.fog.density=day?0.01:0.035;inn.background.set(day?0x2a2a24:0x07080c);
 lampL.visible=!day;lampG.visible=true;renderer.toneMappingExposure=day?1.0:1.15;innAmb.intensity=day?0.3:0.6}
function bowls(n){BOWLS.forEach((b,i)=>b.visible=i<n);STICKS.forEach((b,i)=>b.visible=i<n)}

// ================= NGOẠI CẢNH: xóm Rạch Mây =================
const ext=new THREE.Scene();ext.background=new THREE.Color(0x0a1220);ext.fog=new THREE.FogExp2(0x1a2638,0.035);
const mkSky=(stops,stars)=>ctex(512,256,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);stops.forEach(([p,c])=>gr.addColorStop(p,c));g.fillStyle=gr;g.fillRect(0,0,w,h);if(stars)for(let i=0;i<300;i++){g.fillStyle=`rgba(255,255,255,${R(i)*0.8})`;g.fillRect(R(i*3)*w,R(i*5)*h*0.5,1,1)}});
const skyNight=mkSky([[0,'#02040a'],[0.55,'#14223a'],[1,'#2a3a52']],1),skyDay=mkSky([[0,'#6f8faa'],[0.6,'#c9d2cc'],[1,'#e2d6b8']]),skyDusk=mkSky([[0,'#1e2440'],[0.6,'#7a4a4a'],[1,'#d88a50']]),skyRain=mkSky([[0,'#04060a'],[1,'#1a2028']]);
const skyM=new THREE.Mesh(new THREE.SphereGeometry(200,32,16),new THREE.MeshBasicMaterial({side:THREE.BackSide,fog:false,map:skyNight}));ext.add(skyM);
const moon=new THREE.Mesh(new THREE.SphereGeometry(3,24,16),new THREE.MeshBasicMaterial({color:0xf2f0e2,fog:false}));moon.position.set(-40,50,-110);ext.add(moon);
const grd=new THREE.Mesh(new THREE.PlaneGeometry(400,400),M({map:yardT}));grd.rotation.x=-Math.PI/2;grd.receiveShadow=true;ext.add(grd);
// nhà lá
function nhaLa(x,z,s,ry,lit){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry||0;g.scale.setScalar(s);ext.add(g);
 box(8,2.6,6,M({map:laT,color:0xa89070}),0,1.3,0,g);for(const sd of [-1,1]){const r=new THREE.Mesh(new THREE.BoxGeometry(9.2,0.25,4.4),M({map:thatchT}));r.position.set(0,3.55,sd*1.75+ (sd>0?0.4:0));r.rotation.x=sd*0.5;r.castShadow=true;r.receiveShadow=true;g.add(r)}
 // hiên
 const hr=new THREE.Mesh(new THREE.BoxGeometry(9.2,0.15,2.2),M({map:thatchT}));hr.position.set(0,2.55,4.0);hr.rotation.x=0.18;hr.castShadow=true;g.add(hr);for(const px of [-4.2,-1.4,1.4,4.2])cyl(0.08,0.09,2.5,M({color:0x4a3420}),px,1.25,4.9,g,8);
 const door=new THREE.Mesh(new THREE.PlaneGeometry(1.0,2.0),new THREE.MeshBasicMaterial({color:lit?0x2a1a0c:0x0a0806}));door.position.set(0.6,1.0,3.01);g.add(door);
 const wm=new THREE.MeshBasicMaterial({color:0xffb860});for(const wx of [-2.4,2.6]){const w=new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.7),wm);w.position.set(wx,1.5,3.01);g.add(w)}
 const bd=new THREE.Mesh(new THREE.PlaneGeometry(0.9,2.0),new THREE.MeshBasicMaterial({color:0x2a1a0c}));bd.position.set(2.6,1.0,-3.01);bd.rotation.y=Math.PI;g.add(bd);
 g.userData={wm,door};return g}
const HOUSE=nhaLa(0,0,1,0,true);
const porchL=new THREE.PointLight(0xffa850,6,9,1.6);porchL.position.set(0.6,2.1,5.6);porchL.castShadow=true;porchL.shadow.mapSize.set(1024,1024);ext.add(porchL);
{const hl=new THREE.Group();ext.add(hl);hl.position.set(0.6,1.95,4.3);cyl(0.06,0.07,0.08,M({color:0x6a5030}),0,0,0,hl);const gl=new THREE.Mesh(new THREE.SphereGeometry(0.07,12,8),new THREE.MeshBasicMaterial({color:0xffd890}));gl.position.y=0.12;hl.add(gl)}
const BATHO_H=nhaLa(-18,3,0.8,0.5,true),NAM_H=nhaLa(16,1,0.8,-0.4,false);nhaLa(-10,26,0.7,Math.PI,false);nhaLa(9,27,0.75,Math.PI+0.2,false);nhaLa(26,-6,0.7,-0.8,false);
const bthL=new THREE.PointLight(0xffa850,0,8,1.6);bthL.position.set(-16.3,2,6.4);ext.add(bthL);
// rạch + bến + xuồng
const waterM=new THREE.MeshStandardMaterial({color:0x3a2416,roughness:0.12,metalness:0.55});
const water=new THREE.Mesh(new THREE.PlaneGeometry(200,10),waterM);water.rotation.x=-Math.PI/2;water.position.set(0,0.03,16.5);water.receiveShadow=true;ext.add(water);
for(let i=0;i<5;i++)box(0.5,0.06,1.2,M({map:woodT}),2+i*0.0,0.05+i*0.0,11.0+i*0.0,ext);box(0.9,0.08,2.4,M({map:woodT,color:0x8a6a48}),2,0.12,11.6,ext);for(const z of [11.0,12.7])for(const x of [1.6,2.4])cyl(0.05,0.05,1.2,M({color:0x3a2a18}),x,0.2,z,ext,6);
function xuong(){const g=new THREE.Group();const hm=M({map:woodT,color:0x7a5a3a});box(2.6,0.28,0.75,hm,0,0.14,0,g);for(const sd of [-1,1]){const c=new THREE.Mesh(new THREE.ConeGeometry(0.42,1.0,4),hm);c.rotation.z=sd*Math.PI/2;c.rotation.x=Math.PI/4;c.scale.set(1,1,0.45);c.position.set(sd*1.75,0.18,0);c.castShadow=true;g.add(c)}box(2.3,0.04,0.6,M({color:0x2a1e12}),0,0.29,0,g);ext.add(g);return g}
const XUONG=xuong();XUONG.position.set(4.5,0.04,13.2);
// dừa nước dọc bờ, dừa, chuối, tre
for(let i=0;i<26;i++){const x=-38+i*3+R(i)*2;if(Math.abs(x-2)<2.5)continue;if(x>-44&&x<9)continue;flatCard(nipaT,3,3,x,1.4,10.9+R(i+4)*0.6,ext,R(i)*0.6-0.3)}
for(let i=0;i<30;i++){flatCard(nipaT,3.4,3.4,-40+i*2.8+R(i+9),1.6,22.4+R(i+3),ext,R(i)*0.5)}
for(const [x,z,s] of [[-6,8.8,9],[6.5,9.5,10],[-12,-4,10],[10,-7,9],[-4,-6.5,8.5],[13,8,9.5]]){flatCard(palmT,s*0.5,s,x,s/2,z,ext,R(x)*2);flatCard(palmT,s*0.5,s,x,s/2,z,ext,R(x)*2+1.6)}
for(const [x,z,s] of [[-5,5,3],[7,4,3.4],[-11,-1,3],[12,-2,3.2],[5.5,-5,2.8],[-7.5,-7,3]]){flatCard(banT,s,s,x,s/2,z,ext,R(x)*3);flatCard(banT,s,s,x,s/2,z,ext,R(x)*3+1.6)}
// bụi tre đầu ngõ (-9,8)
const NGO={x:-12.5,z:5.5};for(let i=0;i<6;i++){const b=bambooCard(i+50);b.position.set(NGO.x-1.5+i*0.6,6,NGO.z-1.2+R(i)*0.8);b.rotation.y=R(i)*0.6;ext.add(b)}
const path=new THREE.Mesh(new THREE.PlaneGeometry(30,1.8),M({color:0x5a4a32}));path.rotation.x=-Math.PI/2;path.position.set(-14,0.012,NGO.z+1.6);ext.add(path);
flatCard(palmT,4.5,9,NGO.x+3.6,4.5,NGO.z+2.2,ext,0.4);flatCard(palmT,4.5,9,NGO.x+3.6,4.5,NGO.z+2.2,ext,2.0);
const DEADCHK=flatCard(cardTex(256,256,g=>{g.fillStyle='#8a7a48';g.beginPath();g.ellipse(128,205,118,42,0,0,7);g.fill();g.strokeStyle='#5a4a28';g.lineWidth=3;for(let i=0;i<14;i++){g.beginPath();g.moveTo(20+i*16,190);g.lineTo(30+i*15,225);g.stroke()}for(const [x,y] of [[60,200],[190,205],[170,185]]){g.fillStyle='#f0ece0';g.beginPath();g.moveTo(x,y);g.lineTo(x+14,y-10);g.lineTo(x+20,y+4);g.lineTo(x+8,y+12);g.closePath();g.fill();g.strokeStyle='#222';g.lineWidth=2;g.stroke()}g.fillStyle='#e8e2d4';g.strokeStyle='#111';g.lineWidth=4;g.beginPath();g.ellipse(125,165,62,34,0.15,0,7);g.fill();g.stroke();g.beginPath();g.arc(70,150,18,0,7);g.fill();g.stroke();g.fillStyle='#c42020';g.beginPath();g.ellipse(64,130,10,7,0,0,7);g.fill();g.strokeStyle='#d8a020';g.lineWidth=5;for(const dx of [110,140]){g.beginPath();g.moveTo(dx,135);g.lineTo(dx+6,92);g.moveTo(dx+6,92);g.lineTo(dx-4,84);g.moveTo(dx+6,92);g.lineTo(dx+14,84);g.stroke()}g.strokeStyle='#111';g.lineWidth=3;g.beginPath();g.moveTo(63,144);g.lineTo(73,154);g.moveTo(73,144);g.lineTo(63,154);g.stroke()}),0.9,0.9,14.2,0.3,5.4,ext,0.3);DEADCHK.visible=false;
{const bx=-16.4,bz=5.8;box(2.2,0.08,0.6,M({map:woodT}),bx+0.8,0.45,bz-0.25,ext);for(const dx of [-0.2,1.8])box(0.08,0.42,0.5,M({color:0x3a2414}),bx+dx,0.21,bz-0.25,ext)}
const MAT=new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.6),M({map:matT}));MAT.rotation.x=-Math.PI/2;MAT.position.set(NGO.x+0.4,0.03,NGO.z+0.7);ext.add(MAT);MAT.visible=false;
// hàng rào trúc, lu, rơm, gà, cỏ, dây phơi
for(let i=0;i<20;i++){box(0.06,1.0,0.06,M({color:0x6a5a3a}),-10+i*1.05,0.5,-4.8,ext)}box(21,0.05,0.05,M({color:0x6a5a3a}),0,0.8,-4.8,ext);box(21,0.05,0.05,M({color:0x6a5a3a}),0,0.4,-4.8,ext);
jar(0.4,-3.2,4.4,ext);jar(0.32,-2.4,4.0,ext,0x6a4a30,1.0);{const h=new THREE.Mesh(new THREE.ConeGeometry(1.0,1.6,14),M({color:0x9a8a50}));h.position.set(6,0.8,6.5);h.castShadow=true;ext.add(h)}
const CHK=[];for(const [x,z] of [[-1.5,7],[0.2,7.6],[2.8,6.8]])CHK.push(flatCard(chickT,0.6,0.6,x,0.3,z,ext,R(x)*2));
for(let i=0;i<70;i++){const x=-20+R(i)*40,z=-15+R(i+3)*26;if(Math.abs(x)<4.5&&z>-3.5&&z<6)continue;flatCard(grassT,1.2,0.5,x,0.25,z,ext,R(i+7)*3)}
box(0.03,0.03,5,M({color:0x3a2a1a}),-6.5,1.8,2,ext);for(const z of [0.5,1.4,2.6])cyl(0.03,0.03,1.8,M({color:0x3a2a1a}),-6.5,0.9,z-0.4+((z>2)?1.6:0),ext,6);
// gò mả sau vườn
const GRAVES=[];const gpos=[[-1.8,-10.2,1.0,1],[-0.6,-11.3,0.9,1],[0.6,-10.4,0.95,1],[1.8,-11.0,0.85,0],[3.0,-10.3,0.85,0]];
gpos.forEach(([x,z,s,old],i)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(0.55,20,12,0,Math.PI*2,0,Math.PI/2),M({color:old?0x4a4630:0x6a5236,map:dirtT}));m.scale.set(s*0.75,0.55,s*1.1);m.position.set(x,0,z);m.castShadow=true;m.receiveShadow=true;ext.add(m);
 if(old)for(let k=0;k<3;k++)flatCard(grassT,0.6,0.3,x+(R(i*5+k)-0.5)*0.6,0.18,z+(R(i+k)-0.5)*0.6,ext,R(k+i)*3);
 const st=[];for(let k=-1;k<=1;k++){st.push(cyl(0.006,0.006,0.3,M({color:0xb06a30,emissive:0x662010}),x+k*0.05,0.42,z+0.55,ext,4))}
 GRAVES.push({m,st,x,z})});
const HOLE=new THREE.Mesh(new THREE.CircleGeometry(0.12,12),new THREE.MeshBasicMaterial({color:0x140c06}));HOLE.rotation.x=-Math.PI/2+0.5;HOLE.position.set(1.8,0.27,-10.75);ext.add(HOLE);HOLE.visible=false;
const OFFER=new THREE.Group();ext.add(OFFER);OFFER.position.set(-0.6,0,-10.55);cyl(0.07,0.05,0.05,M({color:0xe8e0d0}),0,0.33,0,OFFER);{const e=new THREE.Mesh(new THREE.SphereGeometry(0.04,10,8),M({color:0xf0e8d8}));e.scale.y=1.3;e.position.set(0.12,0.33,0);OFFER.add(e)}OFFER.visible=false;
for(let i=0;i<9;i++){const b=bambooCard(i+70,'#142018');b.position.set(-4+i*1.1+R(i)*0.6,6,-13.2-R(i+2)*1.2);b.rotation.y=(R(i)-0.5)*0.5;ext.add(b)}
const graveL=new THREE.PointLight(0xff8a40,0,4,2);graveL.position.set(0.6,0.6,-9.6);ext.add(graveL);
// đồng lúa + mộ bà Mười (x=60)
const FD=60;{const f=new THREE.Mesh(new THREE.PlaneGeometry(40,30),M({color:0x4a6a30}));f.rotation.x=-Math.PI/2;f.position.set(FD,0.015,0);f.receiveShadow=true;ext.add(f);for(let i=0;i<160;i++)flatCard(riceT,1.4,0.6,FD-18+R(i+400)*36,0.3,-14+R(i+401)*28,ext,R(i)*0.4);
 const m=new THREE.Mesh(new THREE.SphereGeometry(0.7,20,12,0,Math.PI*2,0,Math.PI/2),M({color:0x5a5038,map:dirtT}));m.scale.set(0.8,0.55,1.2);m.position.set(FD,0,0);m.castShadow=true;ext.add(m);for(let k=0;k<5;k++)flatCard(grassT,0.7,0.35,FD+(R(k+90)-0.5)*0.9,0.2,(R(k+91)-0.5)*1.2,ext,R(k)*3);
 for(let k=-1;k<=1;k++)cyl(0.006,0.006,0.3,M({color:0xb06a30,emissive:0x662010}),FD+k*0.05,0.42,0.75,ext,4);for(const [x,z,s] of [[FD-8,-9,9],[FD+9,-11,10]])flatCard(palmT,s*0.5,s,x,s/2,z,ext,0.3)}
// ngã ba sông (x=-80)
const RV=-80;{const w=new THREE.Mesh(new THREE.PlaneGeometry(70,70),waterM);w.rotation.x=-Math.PI/2;w.position.set(RV,0.035,0);ext.add(w);for(let i=0;i<36;i++){const a=i/36*Math.PI*2;if(Math.abs(Math.sin(a))<0.25&&Math.cos(a)>0)continue;flatCard(nipaT,4,4,RV+Math.cos(a)*(17+R(i)*3),1.8,Math.sin(a)*(17+R(i+1)*3),ext,a)}}
const XUONG2=xuong();XUONG2.position.set(RV,0.04,0);
const rvL=new THREE.PointLight(0xffb060,0,8,1.6);ext.add(rvL);
const moonDir=new THREE.DirectionalLight(0x9ab4ff,2.0);moonDir.position.set(-15,25,25);moonDir.castShadow=true;moonDir.shadow.mapSize.set(2048,2048);Object.assign(moonDir.shadow.camera,{left:-18,right:18,top:18,bottom:-18,far:90});ext.add(moonDir,moonDir.target);
const hemi=new THREE.HemisphereLight(0x3a4a6a,0x101010,1.3);ext.add(hemi);
const sunD=new THREE.DirectionalLight(0xfff0d8,0);sunD.position.set(20,30,15);sunD.castShadow=true;sunD.shadow.mapSize.set(2048,2048);Object.assign(sunD.shadow.camera,{left:-25,right:25,top:25,bottom:-25,far:120});ext.add(sunD,sunD.target);
const fogS=[];for(let i=0;i<50;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:dustTex,color:0x9aaac0,transparent:true,opacity:0.12,depthWrite:false}));s.scale.set(8,2.5,1);s.position.set(-20+R(i)*40,0.6+R(i+1)*0.8,-16+R(i+2)*28);ext.add(s);fogS.push(s)}
const C=cast(ext);
const EL={};
const EB=new THREE.Group();
const ghostL=new THREE.PointLight(0x90ffc0,0,5,2);ext.add(ghostL);
let RAIN=0;
function tod(m){const day=m==='day',dusk=m==='dusk',dawn=m==='dawn',rain=m==='rain';skyM.material.map=day?skyDay:dawn?skyDawn:dusk?skyDusk:rain?skyRain:skyNight;skyM.material.needsUpdate=true;moon.visible=!(day||rain);
 sunD.intensity=day?2.6:(dusk||dawn)?1.2:0;sunD.color.set(dusk||dawn?0xffa060:0xfff0d8);moonDir.intensity=day?0:rain?0.8:2.0;hemi.intensity=day?1.3:1.0;hemi.color.set(day?0xc8d8e8:0x3a4a6a);
 ext.fog.color.set(day?0xb8c0b8:(dusk||dawn)?0x6a5050:rain?0x101418:0x1a2638);ext.fog.density=day?0.008:rain?0.05:0.035;HOUSE.userData.wm.color.set(day?0x3a2e20:0xffb860);porchL.intensity=day?0:6;fogS.forEach(f=>f.visible=!day);renderer.toneMappingExposure=day?1.0:1.15;RAIN=rain?1:0}
function graves(n,new2){GRAVES.forEach((g,i)=>{g.m.visible=i<n;g.st.forEach(s=>s.visible=false)})}
function lightIncense(idx){(idx==='all'?[0,1,2,3,4]:idx).forEach(i=>GRAVES[i].st.forEach(s=>s.visible=true))}

// ================= RỪNG TRÀM U MINH (x 145..240) =================
const skyDawn=mkSky([[0,'#2a3040'],[0.6,'#5a6270'],[1,'#8a8a88']]);
const RX=150,KX=166,KZ=-1.6,GX=206,GZ=0;
const barkT=ctex(256,512,(g,w,h)=>{g.fillStyle='#bdb8aa';g.fillRect(0,0,w,h);for(let k=0;k<170;k++){const l=R(k)>0.5;g.fillStyle=`rgba(${l?235:70},${l?230:64},${l?218:56},${0.25+R(k+1)*0.35})`;g.fillRect(R(k*3)*w,R(k*5)*h,4+R(k)*34,10+R(k+2)*70)}
 for(let k=0;k<40;k++){g.strokeStyle='rgba(40,36,30,.45)';g.lineWidth=1.5;g.beginPath();const x=R(k*7)*w;g.moveTo(x,0);g.bezierCurveTo(x+10,h*0.3,x-10,h*0.6,x+(R(k)-0.5)*20,h);g.stroke()}},[1,2]);
const barkM=M({map:barkT,color:0xd8d4c8});
const swampM=new THREE.MeshStandardMaterial({color:0x2a2116,roughness:0.12,metalness:0.45});
{const w=new THREE.Mesh(new THREE.PlaneGeometry(100,96),swampM);w.rotation.x=-Math.PI/2;w.position.set(RX+50+2,0.04,0);w.receiveShadow=true;ext.add(w)}
const fernT=cardTex(256,256,g=>{for(let i=0;i<7;i++){g.save();g.translate(128,256);g.rotate(-1.0+i*0.33+(R(i)-0.5)*0.15);g.strokeStyle='#24401e';g.lineWidth=4;g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(10,-120,0,-220+R(i)*30);g.stroke();
 for(let k=2;k<22;k++){const y=-k*10,ln=26*(1-k/24)+6;g.fillStyle=`rgb(${40+R(i*k)*30},${78+R(k)*40},${34})`;for(const sd of [-1,1]){g.beginPath();g.moveTo(0,y);g.quadraticCurveTo(sd*ln*0.6,y-6,sd*ln,y+4);g.lineTo(0,y+5);g.fill()}}g.restore()}});
const choaiT=cardTex(512,512,g=>{for(let i=0;i<46;i++){const x=40+R(i)*430,y=512;g.strokeStyle=`rgb(${28+R(i)*20},${54+R(i+1)*30},${26})`;g.lineWidth=5;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+(R(i+2)-0.5)*120,300,x+(R(i+3)-0.5)*200,60+R(i+4)*160);g.stroke();
 for(let k=0;k<14;k++){const t=k/14,px=x+(R(i+3)-0.5)*200*t,py=y-(y-60-R(i+4)*160)*t;g.fillStyle=`rgba(${34+R(k+i)*30},${70+R(k)*50},${30},.95)`;g.beginPath();g.ellipse(px+(k%2?14:-14),py,16,6,(k%2?0.5:-0.5),0,7);g.fill()}}});
const leafT=cardTex(512,256,g=>{for(let k=0;k<420;k++){const x=R(k)*512,y=40+R(k+1)*200;g.fillStyle=`rgba(${36+R(k+2)*30},${64+R(k+3)*40},${36},.92)`;g.beginPath();g.ellipse(x,y,16,4,R(k+4)*3,0,7);g.fill()}});
const TREES=[];
function tram(x,z,r,h,lean=0,par=ext){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.z=lean;g.rotation.y=R(x*3+z)*6;par.add(g);
 const t=new THREE.Mesh(new THREE.CylinderGeometry(r*0.7,r,h,9),barkM);t.position.y=h/2;t.castShadow=true;t.receiveShadow=true;g.add(t);
 if(R(x+z*7)>0.35){for(let k=0;k<2;k++){const f=new THREE.Mesh(new THREE.PlaneGeometry(4,2),new THREE.MeshStandardMaterial({map:leafT,transparent:true,alphaTest:0.3,side:THREE.DoubleSide}));f.position.y=h-0.6;f.rotation.y=k*1.57;g.add(f)}}
 TREES.push(g);return g}
for(let i=0;i<300;i++){const x=RX+1+R(i+700)*86,z=-44+R(i+701)*88;
 if(Math.hypot(x-GX,z-GZ)<6.5)continue;if(Math.hypot(x-KX,z-KZ)<2.2)continue;if(x<200&&Math.abs(z)<1.3)continue;if(Math.hypot(x-RX+2,z-2.5)<2.5)continue;
 tram(x,z,0.09+R(i)*0.08,9+R(i+3)*5,(R(i+4)-0.5)*0.06)}
// bìa rừng: hàng tràm thưa
for(let i=0;i<30;i++){const z=-40+i*2.8+R(i+900);if(Math.abs(z-2.5)<3)continue;tram(RX-0.5+R(i+901)*1.5,z,0.1,10+R(i)*3,0)}
const FERNS=[];for(let i=0;i<420;i++){const x=RX+R(i+1200)*88,z=-40+R(i+1201)*80;if(x<200&&Math.abs(z)<0.8)continue;if(Math.hypot(x-GX,z-GZ)<3.5)continue;const s=0.6+R(i)*0.7;FERNS.push(flatCard(fernT,s*1.2,s,x,s/2,z,ext,R(i)*3))}
// bụi choại quanh gò + rải rác
const CHOAI=[];for(const [x,z,s] of [[GX+2.2,1.9,1.5],[GX+3.2,0.4,1.4],[GX-2.6,2.4,1.3],[GX-3.4,-1.6,1.5],[GX+1,-3.6,1.6],[GX+3.8,-2.4,1.3],[178,-3.5,1.2],[186,3.2,1.3],[193,-2.8,1.2],[171,3.4,1.1]]){CHOAI.push(flatCard(choaiT,s*1.4,s,x,s/2,z,ext,R(x)*2));CHOAI.push(flatCard(choaiT,s*1.4,s,x,s/2,z,ext,R(x)*2+1.4))}
// miếu ông Tà ở đầu đường mòn
const MIEU=new THREE.Group();ext.add(MIEU);MIEU.position.set(RX-2.2,0,2.5);
cyl(0.06,0.07,1.05,M({color:0x4a3420}),0,0.52,0,MIEU,8);box(0.7,0.04,0.5,M({map:woodT}),0,1.06,0,MIEU);
box(0.66,0.46,0.04,M({map:woodT,color:0x8a6a48}),0,1.3,-0.22,MIEU);for(const sd of [-1,1])box(0.04,0.46,0.46,M({map:woodT,color:0x8a6a48}),sd*0.32,1.3,0,MIEU);
for(const sd of [-1,1]){const r=new THREE.Mesh(new THREE.BoxGeometry(0.84,0.03,0.42),M({map:thatchT}));r.position.set(0,1.62,sd*0.16);r.rotation.x=sd*0.55;r.castShadow=true;MIEU.add(r)}
box(0.6,0.12,0.02,M({color:0xa01818}),0,1.5,0.235,MIEU);
const MBOWL=cyl(0.06,0.045,0.06,M({color:0xd8d0c0,roughness:0.5}),0,1.11,0.04,MIEU,10);const MSTICK=[];for(let k=-1;k<=1;k++)MSTICK.push(cyl(0.004,0.004,0.2,M({color:0xb06a30,emissive:0x662010}),k*0.02,1.22,0.04,MIEU,4));
const MCUP=cyl(0.035,0.03,0.03,M({color:0xe8e2d6}),0.18,1.1,0.08,MIEU,10);const MHONEY=new THREE.Mesh(new THREE.CircleGeometry(0.1,14),M({color:0xd89a20,roughness:0.15}));MHONEY.rotation.x=-Math.PI/2;MHONEY.position.set(0.16,1.085,0.1);MIEU.add(MHONEY);
for(const [x,z] of [[-0.12,0.0],[-0.2,0.06]])cyl(0.03,0.03,0.04,M({color:0x1a1a1a,roughness:0.3}),x,1.1,z,MIEU,8);
function mieu(st){const over=st==='over';MBOWL.rotation.z=over?1.6:0;MBOWL.position.set(over?0.05:0,over?1.1:1.11,0.04);MCUP.rotation.z=over?1.5:0;MHONEY.visible=over;MHONEY.scale.setScalar(over?1.6:0.5);MSTICK.forEach(s=>s.visible=st==='lit')}
// đường mòn đất từ xóm ra bìa rừng
{const p=new THREE.Mesh(new THREE.PlaneGeometry(150,1.6),M({color:0x4e4030}));p.rotation.x=-Math.PI/2;p.position.set(75,0.013,2.5);ext.add(p)}
// kèo ong
function keoOng(x,z,big){const g=new THREE.Group();g.position.set(x,0,z);ext.add(g);const L=big?0:3.8;
 if(!big){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.07,L,8),barkM);p.position.set(0,1.1,0);p.rotation.z=-1.05;p.castShadow=true;g.add(p);
  const st=cyl(0.04,0.05,2.1,M({color:0x5a4430}),1.4,1.05,0,g,6);}
 const comb=new THREE.Group();g.add(comb);const cm=new THREE.Mesh(new THREE.SphereGeometry(0.5,20,14,0,Math.PI*2,Math.PI/2,Math.PI/2),M({color:0xd09a2a,roughness:0.35,map:combT,side:THREE.DoubleSide}));cm.scale.set(1,1.1,0.2);comb.add(cm);cm.castShadow=true;
 const dk=new THREE.Mesh(new THREE.SphereGeometry(0.5,20,14,0,Math.PI*2,Math.PI/2,Math.PI/2),M({color:0x8a5a1a,roughness:0.6}));dk.scale.set(0.45,0.5,0.22);dk.position.set(-0.05,0,0);comb.add(dk);
 comb.position.set(big?0:0.9,big?0:1.62,0);g.userData={comb,cm,dk};return g}
const combT=ctex(256,256,(g,w,h)=>{g.fillStyle='#d8a030';g.fillRect(0,0,w,h);g.strokeStyle='rgba(120,70,10,.6)';g.lineWidth=2;for(let y=0;y<h;y+=14)for(let x=0;x<w;x+=16){const xx=x+((y/14)%2)*8;g.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3;g.lineTo(xx+7*Math.cos(a),y+7*Math.sin(a))}g.closePath();g.stroke()}});
const KEO1=keoOng(KX,KZ,false);
// bầy ong
const BEES=[];for(let i=0;i<60;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({color:0x1a1408,transparent:true,opacity:0.9}));s.scale.setScalar(0.035);ext.add(s);s.visible=false;BEES.push(s)}
function bees(on,cx,cy,cz,T,r=1.2){BEES.forEach((b,i)=>{b.visible=on;if(!on)return;const a=T*(1.5+R(i)*2)+R(i+3)*6;b.position.set(cx+Math.cos(a)*r*R(i+5),cy+Math.sin(a*1.3)*0.6*R(i+6)+R(i)*0.6,cz+Math.sin(a)*r*R(i+7))})}
// gò ông Tà
{const m=new THREE.Mesh(new THREE.SphereGeometry(5,32,16,0,Math.PI*2,0,Math.PI/2),M({map:dirtT,color:0x6a5a40}));m.scale.set(1,0.18,1);m.position.set(GX,0,GZ);m.receiveShadow=true;ext.add(m);
 for(let k=0;k<26;k++){const a=R(k+40)*6.28,r=1+R(k+41)*3.6;flatCard(grassT,0.9,0.4,GX+Math.cos(a)*r,0.2+0.9*(1-r*r/25)*0.9,GZ+Math.sin(a)*r,ext,R(k)*3)}}
const GH=0.86;// độ cao mặt gò quanh gốc
const OLDT=new THREE.Group();ext.add(OLDT);OLDT.position.set(GX,0,GZ-1.2);
{const t=new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.55,15,12),barkM);t.position.y=7.5;t.castShadow=true;OLDT.add(t);
 const b=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.17,4.4,9),barkM);b.position.set(1.9,4.0,0.2);b.rotation.z=-1.12;b.castShadow=true;OLDT.add(b);
 for(let k=0;k<3;k++){const f=new THREE.Mesh(new THREE.PlaneGeometry(6,3),new THREE.MeshStandardMaterial({map:leafT,transparent:true,alphaTest:0.3,side:THREE.DoubleSide}));f.position.set(0,14.5,0);f.rotation.y=k*1.05;OLDT.add(f)}
 // rễ
 for(let k=0;k<6;k++){const a=k*1.05+0.3;const r=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.14,1.4,6),barkM);r.position.set(Math.cos(a)*0.7,GH-0.15,Math.sin(a)*0.7);r.rotation.z=Math.cos(a)*1.2;r.rotation.x=-Math.sin(a)*1.2;OLDT.add(r)}}
const KEOTA=keoOng(GX+2.3,GZ-1.0,true);KEOTA.position.y=3.0;KEOTA.userData.comb.scale.setScalar(2.2);
function keota(st){const c=KEOTA.userData;c.cm.visible=st==='full';c.dk.visible=st==='full';c.comb.visible=st!=='none';
 if(st==='dead'){c.comb.visible=true;c.cm.visible=true;c.cm.material=c.cm.userData.dm||(c.cm.userData.dm=M({color:0x1a120a,roughness:0.9}))}else if(c.cm.userData.dm){c.cm.material=c.cm.userData.lm||(c.cm.userData.lm=M({color:0xd09a2a,roughness:0.35,map:combT}))}}
// đồ người mất tích dưới gốc
const RELICS=new THREE.Group();ext.add(RELICS);RELICS.position.set(GX+0.9,GH,GZ+0.1);
{for(const [x,z,r] of [[0,0,0.3],[0.22,0.12,-0.2]]){const d=box(0.11,0.025,0.26,M({color:0x6a3a2a}),x,0.012,z,RELICS);d.rotation.y=r}
 const n=new THREE.Mesh(new THREE.ConeGeometry(0.34,0.16,20,1,true),M({color:0xb8a470,side:THREE.DoubleSide}));n.position.set(-0.6,0.12,0.35);n.rotation.z=1.2;RELICS.add(n);
 const kp=box(0.1,0.02,0.03,M({color:0x9a2a24,metalness:0.5,roughness:0.4}),0.45,0.02,0.45,RELICS);
 const kp2=box(0.06,0.02,0.02,M({color:0x6a5a40}),0.5,0.02,0.45,RELICS)}
const MATPOOL=new THREE.Mesh(new THREE.CircleGeometry(0.7,20),M({color:0xd89a20,roughness:0.1,emissive:0x2a1a00}));MATPOOL.rotation.x=-Math.PI/2;MATPOOL.position.set(GX+0.4,GH+0.02,GZ-0.5);ext.add(MATPOOL);MATPOOL.visible=false;
const GSTICK=[];for(let k=-1;k<=1;k++)GSTICK.push(cyl(0.005,0.005,0.3,M({color:0xb06a30,emissive:0x662010}),GX+0.6+k*0.05,GH+0.15,GZ+0.4,ext,4));
// xác Sáu Lộc
const CORPSE=lying(()=>locCorpse(),1.75);ext.add(CORPSE);
// đèn đuốc + đèn ma xanh
const torchL=new THREE.PointLight(0xffa050,0,14,1.3);torchL.castShadow=true;torchL.shadow.mapSize.set(512,512);torchL.shadow.bias=-0.004;ext.add(torchL);
const torchL2=new THREE.PointLight(0xffa050,0,12,1.4);ext.add(torchL2);
const WISP=[];for(let i=0;i<6;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:dustTex,color:0x80ffb0,transparent:true,opacity:0.0,depthWrite:false,fog:false}));s.scale.setScalar(0.35);ext.add(s);WISP.push(s)}
function wisps(on,T,cx,cz){WISP.forEach((s,i)=>{s.visible=on;s.material.opacity=on?0.55+0.3*Math.sin(T*3+i):0;s.position.set(cx+Math.sin(T*0.3+i*2)*3+R(i)*4-2,0.9+Math.sin(T*1.1+i)*0.3,cz-2-R(i+3)*4)})}
// ghe lái mật ở vàm kênh
const GHE=new THREE.Group();ext.add(GHE);GHE.position.set(-34,0.05,16.5);
{const hm=M({map:woodT,color:0x6a4a2a});box(6,0.6,1.8,hm,0,0.3,0,GHE);for(const sd of [-1,1]){const c=new THREE.Mesh(new THREE.ConeGeometry(0.95,1.6,4),hm);c.rotation.z=sd*Math.PI/2;c.rotation.x=Math.PI/4;c.scale.set(1,1,0.6);c.position.set(sd*3.7,0.35,0);GHE.add(c)}
 const mui=new THREE.Mesh(new THREE.CylinderGeometry(1.0,1.0,2.6,16,1,true,0,Math.PI),M({map:thatchT,side:THREE.DoubleSide}));mui.rotation.z=Math.PI/2;mui.position.set(-0.6,0.6,0);mui.castShadow=true;GHE.add(mui);
 for(let i=0;i<4;i++){const k=jar(0.25,0.9+i*0.55,0,GHE,0x7a5a3a,1.0);k.position.y=0.85}
 const lt=new THREE.Mesh(new THREE.SphereGeometry(0.1,10,8),new THREE.MeshBasicMaterial({color:0xffd090}));lt.position.set(1.5,1.5,0.3);GHE.add(lt)}
const gheL=new THREE.PointLight(0xffb060,0,9,1.5);gheL.position.set(-32.5,1.6,16.8);ext.add(gheL);
const XUONGN=xuong();XUONGN.position.set(-30.5,0.04,15.0);
// tràm gần máy quay thì ẩn (khỏi che)
function hideNear(){for(const g of TREES){const dx=g.position.x-cam.position.x,dz=g.position.z-cam.position.z;g.visible=dx*dx+dz*dz>1.7}}
function forest(m){// m: 'day' | 'night' | 'dawn'
 tod(m==='day'?'day':m==='dawn'?'dawn':'night');if(m==='dawn'){skyM.material.map=skyDawn;skyM.material.needsUpdate=true}ext.fog.density=m==='day'?0.03:m==='dawn'?0.045:0.055;ext.fog.color.set(m==='day'?0x8a9a88:m==='dawn'?0x5a5a62:0x0a1018);
 if(m==='day'){sunD.intensity=1.6;sunD.position.set(RX+40,30,20);sunD.target.position.set(RX+40,0,0)}else{sunD.position.set(20,30,15);sunD.target.position.set(0,0,0)}
 moonDir.position.set(RX+20,25,25);moonDir.target.position.set(RX+40,0,0);if(m==='night')moonDir.intensity=0.7;hemi.intensity=m==='day'?1.1:0.55}

// ================= engine =================
const ACT=[];
function put(c,x,z,o,base=0){c.visible=true;c.userData.o=o||{};c.position.set(x,c.userData.h*0.4766+base,z);ACT.push(c);return c}
function lie(m,x,y,z,ry=0,tilt=0.6){m.visible=true;m.position.set(x,y+0.44*Math.sin(tilt)*0.9,z);m.rotation.set(-Math.PI/2+tilt,0,Math.PI/2+ry);return m}
let SI=0;
function siOf(lt,ls){let s=0;for(let i=0;i<ls.length;i++)if(lt>=ls[i]-0.05)s=i;return s}
function cams(lt,ls,list,D){const si=siOf(lt,ls);const c=list[si%list.length];const t0=si===0?0:ls[si],t1=si+1<ls.length?ls[si+1]:D;const p=sm((lt-t0)/Math.max(0.5,t1-t0));
 const [P,L,f,dP,dL]=c;cam.fov=f||40;cam.position.set(P[0]+(dP?dP[0]*p:0),P[1]+(dP?dP[1]*p:0),P[2]+(dP?dP[2]*p:0));cam.lookAt(L[0]+(dL?dL[0]*p:0),L[1]+(dL?dL[1]*p:0),L[2]+(dL?dL[2]*p:0));return si}
function talk(lt,on=true){return on&&Math.sin(lt*13)>0?'o':undefined}
let CURT=0;
function TK(code,si){const i=SI_BASE+si;if((TLD.spk||[])[i]!==code)return undefined;const v=(TLD.vox||[])[i]||[];for(const [a,b] of v)if(CURT>=a&&CURT<b)return Math.sin(CURT*15)>-0.2?'o':undefined;return undefined}
// người nói trong câu si (để mấp máy môi)
function spk(si){return (TLD.spk||[])[SI_BASE+si]}
let SI_BASE=0;
function drawFlat(){if(VERT){const sc=RH/720*0.62;const w=1280*sc,h=720*sc;g2.fillStyle='#000';g2.fillRect(0,0,RW,RH);g2.drawImage(flat,(RW-w)/2,(RH-h)/2-60,w,h)}else g2.drawImage(flat,0,0,RW,RH)}
function flat2(fn,...a){const old=ctx;ctx=flat.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.save();fn(...a);ctx.restore();ctx=old;drawFlat();return 'flat'}
function resetAll(t){for(const c of ACT)c.visible=false;ACT.length=0;for(const k in C)C[k].visible=false;for(const k in CI)CI[k].visible=false;
 for(const k in IL)IL[k].visible=false;for(const k in EL)EL[k].visible=false;EB.visible=false;IB.forEach(b=>b.visible=false);VBABY.visible=false;
 bowls(3);COFFIN.visible=false;NET.visible=true;MAT.visible=false;HOLE.visible=false;OFFER.visible=false;graves(5);graveL.intensity=0;ghostL.intensity=0;innG.intensity=0;DEADCHK.visible=false;rvL.intensity=0;bthL.intensity=0;doorL.intensity=0;
 VONG.rotation.x=0;ALT.visible=true;lampG.position.set(2.3,0.78,1.0);STOOL.visible=false;XUONG.position.set(4.5,0.04,13.2);XUONG.visible=true;XUONG.rotation.set(0,0,0);XUONG2.rotation.set(0,0,0);RAIN=0;TINT=null;moonL.color.set(0x8fb0ff);graves(0);BLANKET.visible=false;CORPSE.visible=false;MATPOOL.visible=false;GSTICK.forEach(s=>s.visible=false);torchL.intensity=0;torchL2.intensity=0;gheL.intensity=0;wisps(false,0,0,0);bees(false);mieu('ok');keota('dead');RELICS.visible=true;
 moonDir.position.set(-15,25,25);moonDir.target.position.set(0,0,0);sunD.position.set(20,30,15);sunD.target.position.set(0,0,0);XUONGN.position.set(-30.5,0.04,15.0);ext.fog.density=0.035;
 const fl=1+Math.sin(t*13)*0.08+Math.sin(t*7.3)*0.06+Math.sin(t*23)*0.04;lampL.intensity=14*fl;lampG.userData.fl.scale.set(1,1.8*fl,1);lampL.position.set(lampG.position.x,lampG.position.y+0.27,lampG.position.z)}
let TINT=null;
function rain(t,a=1){g2.save();g2.strokeStyle='rgba(190,205,225,.35)';g2.lineWidth=1.4;for(let i=0;i<260;i++){const x=(R(i)*RW*1.2+t*90)%(RW*1.2)-60,y=(R(i+7)*RH+t*1300*(0.8+R(i)*0.4))%(RH+80)-40;g2.beginPath();g2.moveTo(x,y);g2.lineTo(x-7,y+26);g2.stroke()}g2.restore()}
function subs(t){for(const [a,b,str,sp] of TLD.subs){if(t<a||t>=b)continue;const al=Math.min(sm((t-a)/0.12),sm((b-t)/0.12));g2.save();g2.globalAlpha=al;g2.textAlign='center';g2.lineJoin='round';g2.font='bold 40px "DejaVu Sans"';
 const ws=str.split(' ');const L=[];let c='';for(const w of ws){const tt=c?c+' '+w:w;if(g2.measureText(tt).width>(VERT?620:1080)&&c){L.push(c);c=w}else c=tt}if(c)L.push(c);const lh=52;const y0=(VERT?RH*0.8:662)-(L.length-1)*lh;
 const fem=['NHAN','THUY','BNL','HOA'].includes(sp);const col=sp.startsWith('G')?'#ff5050':fem?'#ff9a9a':sp==='N'?'#ffffff':'#ffd76a';
 L.forEach((l,i)=>{g2.lineWidth=9;g2.strokeStyle='#000';g2.strokeText(l,RW/2,y0+i*lh);g2.fillStyle=col;g2.fillText(l,RW/2,y0+i*lh)});g2.restore()}}
function watermark(t){const k=Math.floor(t/6)%4;const pos=[[0.5,0.42],[0.76,0.18],[0.26,0.66],[0.7,0.56]][k];g2.save();g2.globalAlpha=0.16;g2.font='bold 28px "DejaVu Sans"';g2.textAlign='center';g2.translate(RW*pos[0],RH*pos[1]);g2.rotate(-0.08);g2.fillStyle='#ffffff';g2.strokeStyle='rgba(0,0,0,.6)';g2.lineWidth=3;g2.strokeText('@chuyendongtaykimco',0,0);g2.fillText('@chuyendongtaykimco',0,0);g2.restore()}
function jump(dt,t){if(dt<0.07){g2.fillStyle='rgba(255,255,255,.85)';g2.fillRect(0,0,RW,RH)}g2.fillStyle=`rgba(140,0,0,${0.22*(1-sm(dt/0.9))})`;g2.fillRect(0,0,RW,RH)}
function jumpShake(t){for(const [jt] of TLD.jumps){const dt=t-jt;if(dt>=0&&dt<0.9){const k=(1-dt/0.9)*(dt<0.12?1:0.45);cam.position.x+=(Math.random()-0.5)*0.12*k;cam.position.y+=(Math.random()-0.5)*0.12*k;cam.fov*=1-0.12*(1-sm(dt/0.15))}}}
function hookText(a,l1,l2){g2.save();g2.globalAlpha=a;g2.textAlign='center';g2.lineJoin='round';g2.font='900 50px "DejaVu Sans"';g2.lineWidth=10;g2.strokeStyle='#000';g2.strokeText(l1,RW/2,90);g2.fillStyle='#fff';g2.fillText(l1,RW/2,90);g2.font='900 70px "DejaVu Sans"';g2.strokeText(l2,RW/2,170);g2.fillStyle='#ff2a2a';g2.fillText(l2,RW/2,170);g2.restore()}
const S={};

// ================= CẢNH TẬP 3: MA GIẤU RỪNG U MINH =================
const m=(code,si)=>TK(code,si);
const IN=(md)=>{innMode(md);return 'inn'};
const fl=(T)=>1+Math.sin(T*13)*0.1+Math.sin(T*7.3)*0.08;
function torch3(x,y,z,T,k=1,L=torchL){L.position.set(x,y,z);L.intensity=9*k*fl(T)}
// thêm tràm sau xóm ("lưng dựa vô rừng tràm")
for(let i=0;i<46;i++){const x=-34+R(i+3100)*70,z=-16-R(i+3101)*16;tram(x,z,0.09+R(i)*0.06,9+R(i+2)*4,0)}
// dấu chân bùn
const FOOT=[];{const ft=cardTex(128,256,g=>{g.fillStyle='rgba(30,20,12,.95)';g.beginPath();g.ellipse(64,170,30,62,0,0,7);g.fill();for(let k=0;k<5;k++){g.strokeStyle='rgba(30,20,12,.95)';g.lineWidth=9;g.lineCap='round';g.beginPath();g.moveTo(44+k*10,120);g.quadraticCurveTo(30+k*16,40,20+k*22,8+Math.abs(k-2)*10);g.stroke()}});
 for(let i=0;i<10;i++){const p=new THREE.Mesh(new THREE.PlaneGeometry(0.16,0.32),new THREE.MeshBasicMaterial({map:ft,transparent:true,depthWrite:false}));p.rotation.x=-Math.PI/2;ext.add(p);p.visible=false;FOOT.push(p)}}
function feet(on,x0,z0,dx,dz){FOOT.forEach((p,i)=>{p.visible=on;if(!on)return;const k=i;p.position.set(x0+dx*k+(k%2?0.12:-0.12)*dz,0.02,z0+dz*k+(k%2?0.12:-0.12)*-dx);p.rotation.z=Math.atan2(dx,dz)+Math.PI})}
const THAU3=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.22,0.08,24),M({color:0xc99a3a,metalness:0.6,roughness:0.35}));THAU3.position.set(RX-3.8,0.05,5.3);THAU3.rotation.z=0.15;ext.add(THAU3);
const _ra=resetAll;resetAll=function(t){_ra(t);feet(false);THAU3.visible=false;KEOTA.position.y=3.3;GHE.visible=true}
// -------- thẻ phẳng --------
S.title=(lt,D,T)=>flat2(F.title,lt,D,T);
S.cta0=(lt,D,T)=>flat2(F.cta,lt,D,T,false);
S.ctamid=(lt,D,T)=>flat2(F.cta,lt,D,T,false);
S.cta1=(lt,D,T)=>flat2(F.cta,lt,D,T,true);
S.chap1=(lt,D,T)=>flat2(F.chap,lt,D,T,'MỘT','Kèo ong ông Tà');
S.chap2=(lt,D,T)=>flat2(F.chap,lt,D,T,'HAI','Gõ thau tìm người');
S.chap3=(lt,D,T)=>flat2(F.chap,lt,D,T,'BA','Người đi phía trước');
S.chap4=(lt,D,T)=>flat2(F.chap,lt,D,T,'BỐN','Tiếng thau không được dứt');
S.chap5=(lt,D,T)=>flat2(F.chap,lt,D,T,'NĂM','Người về từ rừng');
// -------- MỞ ĐẦU --------
S.hook=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);put(C.MA,190,-0.4,{a:si===0?0.75:1,open:si===0?0.3:0.9,glow:si===0?0.5:1.5,arms:[0.15,-0.15]},-0.22);ghostL.position.set(188.8,1.6,0.3);ghostL.color.set(0xff6050);ghostL.intensity=si===0?1.2:5;wisps(true,T,190,-1);
 cams(lt,ls,[[[174,1.5,1.4],[190,1.6,-0.3],40,[4,0.1,-0.3]],[[187.4,1.95,0.35],[190,2.0,-0.4],32,[0.5,0,-0.1]]],D);return 'ext'};
S.hook2=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);put(C.N1,RX-3.4,1.2,{thau:true});put(C.N2,RX-4.4,3.6,{thau:true});put(C.D1,RX-2.6,4.6,{torch:true});put(C.D2,RX-5.2,0.2,{torch:true});
 torch3(RX-2.3,2.0,4.8,T);torch3(RX-4.9,2.0,0.4,T,0.8,torchL2);put(C.MA,RX+5,1.5,{a:0.8,glow:0.6,arms:[0.15,-0.15]},-0.22);ghostL.position.set(RX+4,1.5,2);ghostL.color.set(0xff6050);ghostL.intensity=1.0;
 cams(lt,ls,[[[RX-12,1.8,6],[RX-2,1.4,2],40,[2,0,-1]],[[RX-8,1.6,-3.5],[RX+5,1.8,1.5],30,[0.8,0,0]]],D);return 'ext'};
S.hook3=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===0){forest('night');put(C.NHAN,RX-3,2.5,{thau:true,gonk:1});torch3(RX-3.4,1.8,4,T,0.9);
  cams(lt,ls,[[[RX-7.5,1.5,6.5],[RX-2.6,1.3,2.2],38,[1,0,-0.8]]],D);return 'ext'}
 innMode('night');NET.visible=false;lampAt(-1.8,0.2,0.5);lampL.intensity*=0.6;put(CI.NHAN,-3.0,-1.3,{sit:true,eyes:1.25,look:0.6},0.12);put(CI.TAM,-2.4,-2.2,{sit:true,back:true,fake:true},0.12);
 cams(lt,ls,[[],[[-2.0,1.5,1.6],[-3.0,1.0,-1.7],38,[-0.2,0,-0.3]]],D);return 'inn'};
// -------- CHƯƠNG 1 --------
S.xom=(lt,D,T,ls)=>{tod('day');XUONG.position.x=4.5-lt*0.25;put(C.D1,XUONG.position.x,13.2,{},0.25);put(C.N1,-3.4,6.4,{});put(C.D2,6,6.8,{});
 cams(lt,ls,[[[-14,5,26],[0,1.5,6],42,[6,-1,-2]],[[10,2.2,20],[0,1.5,3],40,[-3,0,-1]],[[8,1.6,9],[0,1,16],40,[-1,0,0]]],D);return 'ext'};
S.keo=(lt,D,T,ls)=>{forest('day');const si=siOf(lt,ls);bees(true,KX+0.9,1.3,KZ,T,1.4);if(si>=1)put(C.TAM,KX-0.6,KZ+1.6,{cui:si===1,t:T},-0.22);if(si===2)put(C.LOC,KX-2.0,KZ+2.0,{look:0.6},-0.22);
 cams(lt,ls,[[[KX-3,1.4,KZ+4],[KX+0.8,1.3,KZ],36,[0.6,0,-0.6]],[[KX-3.6,1.5,KZ+4.6],[KX,1.2,KZ+0.4],38,[0.5,0,-0.4]],[[KX-2.2,1.5,KZ+5.6],[KX-0.8,1.2,KZ+1.4],36,[0,0,-0.6]]],D);return 'ext'};
S.nha=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.TAM,-1.8,5.4,{sit:true},0.0);if(si>=1){put(C.NHAN,0.9,6.2,{});put(C.THUY,2.0,6.6,{smile:true})}
 cams(lt,ls,[[[-0.8,1.5,9.5],[-1.6,1.1,5.2],36,[0,0,-0.8]],[[1.8,1.5,9.4],[1.4,1.3,6.3],34,[0,0,-0.6]],[[0.2,1.7,11],[0,1.2,5.6],40,[0,0,-1]]],D);return 'ext'};
S.nha2=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);NET.visible=false;put(CI.TAM,-2.8,-0.75,{sit:true,mouth:m('TAM',si)},0.0);put(CI.NHAN,-1.6,-0.3,{bowl:true,mouth:m('NHAN',si),arm:[0.12,-0.6]});if(si===2)put(CI.THUY,0.6,0.3,{});
 cams(lt,ls,[[[-1.0,1.5,2.8],[-2.2,1.1,-0.6],36,[-0.2,0,-0.3]],[[-1.8,1.4,2.0],[-2.8,1.15,-0.8],30],[[0.6,1.6,4.0],[-1.4,1.1,-0.4],40,[-0.3,0,-0.4]]],D);return 'inn'};
S.loc=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);bthL.intensity=0;put(C.LOC,-15.6,7.2,{look:-0.3});if(si===2){put(C.HOA,-16.8,7.6,{tear:true});put(C.D3,-13.0,6.4,{look:-1})}
 cams(lt,ls,[[[-12.8,1.6,10.2],[-15.8,1.3,6.8],36,[-0.5,0,-0.4]],[[-14.4,1.5,10.2],[-15.6,1.35,7.2],30],[[-11.8,1.6,10.2],[-15.2,1.2,7.6],40,[0,0,-0.4]]],D);return 'ext'};
S.loc2=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.TAM,-0.4,6.0,{mouth:m('TAM',si),look:-0.6});put(C.LOC,-1.6,6.5,{mouth:m('LOC',si),look:0.6});
 cams(lt,ls,[[[-2.4,1.5,9.0],[-1.4,1.4,6.4],30],[[0.6,1.5,9.0],[-0.5,1.4,6.0],30],[[-2.4,1.5,9.0],[-1.4,1.4,6.4],30],[[-1.0,1.7,10.4],[-1.0,1.2,6.2],38,[0,0,-0.8]]],D);return 'ext'};
const mieuSet=(T,st)=>{forest('day');mieu(st)};
S.mieu=(lt,D,T,ls)=>{const si=siOf(lt,ls);mieuSet(T,si===2?'lit':'ok');put(C.TAM,RX-3.0,3.6,{back:si!==1,look:0.6});put(C.LOC,RX-4.0,4.6,{look:0.4});
 cams(lt,ls,[[[RX-5.5,1.6,6.5],[RX-2.2,1.3,2.5],34,[0.6,0,-0.5]],[[RX-0.8,1.5,4.6],[RX-2.2,1.25,2.5],32,[-0.2,0,-0.2]],[[RX-6,1.6,7],[RX-2.6,1.3,3],38,[0.4,0,-0.4]]],D);return 'ext'};
S.mieu2=(lt,D,T,ls)=>{const si=siOf(lt,ls);mieuSet(T,'lit');put(C.TAM,RX-2.0,3.6,{mouth:m('TAM',si),look:-0.5});put(C.LOC,RX-3.4,4.4,{mouth:m('LOC',si),look:0.5});
 const A=[[RX-5.4,1.5,6.0],[RX-3.2,1.4,4.4],30],B=[[RX-0.6,1.5,7.0],[RX-2.0,1.4,3.6],30],W=[[RX-6.2,1.7,8.0],[RX-2.6,1.2,3.6],38,[0.4,0,-0.6]];
 cams(lt,ls,[A,B,B,B,A,B,W],D);return 'ext'};
const walk=(lt,x0,v)=>x0+lt*v;
S.rung=(lt,D,T,ls)=>{forest('day');const si=siOf(lt,ls);if(si<2){const x=walk(lt,154,0.45);put(C.TAM,x,0.2,{phase:T*4},-0.22);put(C.LOC,x-1.4,-0.2,{phase:T*4+1,bucket:true},-0.22);ls.x=x}else{put(C.TAM,KX-0.8,KZ+1.6,{look:0.6},-0.22);put(C.LOC,KX-1.9,KZ+2.1,{look:0.6,bucket:true},-0.22)}bees(si===2,KX+0.9,1.3,KZ,T);
 cams(lt,ls,[[[walk(lt,154,0.45)+1.5,1.6,4.5],[walk(lt,154,0.45)-0.5,1.3,0],40],[[walk(lt,154,0.45)+4,1.5,1.6],[walk(lt,154,0.45),1.4,0],36],[[KX-3.4,1.5,KZ+5],[KX+0.4,1.3,KZ],38,[0.5,0,-0.5]]],D);return 'ext'};
S.anong=(lt,D,T,ls)=>{forest('day');const si=siOf(lt,ls);bees(true,KX+0.9,1.3,KZ,T,1.6);put(C.TAM,KX+0.2,KZ+1.2,{cui:si<2,armR:si===1?-2.6:-0.1,mouth:m('TAM',si)},-0.22);put(C.LOC,KX-1.3,KZ+1.3,{bucket:true,honey:si>=2,mouth:m('LOC',si),look:0.6},-0.22);
 cams(lt,ls,[[[KX-2.4,1.4,KZ+4.6],[KX+0.6,1.3,KZ+0.4],34,[0.4,0,-0.3]],[[KX-1.4,1.5,KZ+4.4],[KX+0.5,1.4,KZ+0.6],34],[[KX-2.6,1.5,KZ+4.0],[KX-1.2,1.4,KZ+1.9],30],[[KX-1.4,1.5,KZ+4.6],[KX+0.1,1.4,KZ+1.2],30],[[KX-2.0,1.5,KZ+4.4],[KX-1.2,1.4,KZ+1.9],28]],D);return 'ext'};
S.keota=(lt,D,T,ls)=>{forest('dawn');keota('full');const si=siOf(lt,ls);bees(true,GX+2.3,3.0,GZ-1,T,2.4);RELICS.visible=false;
 cams(lt,ls,[[[GX-6.5,2.0,4.5],[GX+1,2.6,-1],40,[1,0,-0.5]],[[GX-3,1.6,5],[GX+2.3,3.3,-1],38,[0.5,0.2,-0.5]],[[GX+5,2.0,6.5],[GX+1,2.4,-1],40,[-1,0,-0.5]],[[GX-1.5,1.4,4.5],[GX,3,-1.2],44,[0,0.3,-0.4]]],D);return 'ext'};
S.keota2=(lt,D,T,ls)=>{forest('day');const si=siOf(lt,ls);bees(true,KX+0.9,1.3,KZ,T,1.2);put(C.TAM,KX-0.6,KZ+1.8,{mouth:m('TAM',si),look:-0.5},-0.22);put(C.LOC,KX-1.9,KZ+1.8,{mouth:m('LOC',si),look:0.5,bucket:true,honey:true},-0.22);
 if(si===4){put(C.MA,KX-3.6,KZ-4.6,{a:0.95,glow:1.2,open:0.8,look:0.5},-0.22);ghostL.position.set(KX-3.2,2.2,KZ-3.6);ghostL.color.set(0xff5040);ghostL.intensity=3}
 const A=[[KX+0.2,1.5,KZ+4.8],[KX-0.6,1.4,KZ+1.8],28],B=[[KX-2.6,1.5,KZ+4.8],[KX-1.9,1.4,KZ+1.8],28];cams(lt,ls,[A,A,[[KX-0.3,1.45,KZ+4.0],[KX-0.6,1.45,KZ+1.8],24,[0,0,-0.2]],B,[[KX-1.2,1.7,KZ+4.6],[KX-3.6,2.0,KZ-4.6],22,[-0.4,0.05,-1.2]]],D);return 'ext'};
S.luat=(lt,D,T,ls)=>{forest('day');const si=siOf(lt,ls);put(C.TAM,KX-0.6,KZ+1.8,{mouth:m('TAM',si),look:-0.5},-0.22);put(C.LOC,KX-1.9,KZ+1.8,{back:si===3,look:0.5,bucket:true,honey:true},-0.22);
 cams(lt,ls,[[[KX+0.2,1.45,KZ+4.4],[KX-0.6,1.45,KZ+1.8],26],[[KX-0.3,1.5,KZ+4.2],[KX-0.6,1.4,KZ+1.8],24,[0,0,-0.2]],[[KX-1.2,1.5,KZ+5.4],[KX-1.2,1.3,KZ+1.8],34],[[KX-4.6,1.6,KZ+6.2],[KX+6,1.6,KZ-4],40,[0.5,0,-0.4]]],D);return 'ext'};
S.dem1=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si<2){tod('dusk');put(C.TAM,-0.8,6.4,{bucket:true,honey:true});put(C.LOC,0.6,6.8,{bucket:true,honey:true,look:-0.4});
  cams(lt,ls,[[[-1.5,1.6,10.2],[0,1.2,6],38,[0.5,0,-0.8]],[[1.6,1.5,9.8],[0.6,1.35,6.8],30]],D);return 'ext'}
 tod('night');if(si===2){put(C.LOC,20-lt*0.3,2.6,{back:true,torch:true,bucket:true});torch3(20.3-lt*0.3,1.9,2.8,T,0.8);
  cams(lt,ls,[[],[],[[4,1.6,9.5],[18,1.3,2.6],34,[0,0,0],[-1,0,0]]],D);return 'ext'}
 put(C.MUC,0.4,5.2,{growl:true});cams(lt,ls,[[],[],[],[[2.0,0.6,7.0],[0.4,0.35,5.2],36,[-0.2,0,-0.3]]],D);return 'ext'};
S.hoa=(lt,D,T,ls)=>{tod('dawn');const si=siOf(lt,ls);put(C.HOA,-0.2,6.2,{mouth:m('HOA',si),tear:true,look:-0.5});if(si>=2)put(C.TAM,-1.4,5.6,{mouth:m('TAM',si),eyes:1.3,look:0.5,torch:si===4});if(si===4)torch3(-1.0,2.0,5.8,T,0.6);
 cams(lt,ls,[[[0.8,1.6,10.5],[-0.4,1.3,5.8],38,[0,0,-0.8]],[[-1.0,1.5,8.4],[-0.2,1.4,6.2],30],[[-1.2,1.5,8.6],[-0.2,1.4,6.2],30],[[0.6,1.5,8.6],[-1.4,1.4,5.6],28],[[-6,1.7,9.8],[2,1.3,5],40,[2,0,-0.6]]],D);return 'ext'};
S.mieu3=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);mieu('over');if(si<2)put(C.TAM,RX-3.6,3.3,{torch:true,eyes:1.3,look:0.5});else put(C.TAM,walk(lt-ls[2],RX+2,0.4),0.3,{torch:true,back:true,phase:T*4},-0.22);
 torch3(si<2?RX-3.2:RX+2.4+(lt-ls[2])*0.4,2.0,si<2?4.2:0.5,T,0.7);
 cams(lt,ls,[[[RX-1.4,1.4,4.8],[RX-2.4,1.15,2.5],32,[-0.1,-0.05,-0.3]],[[RX-0.8,1.3,2.0],[RX+5,0.5,0],38,[0.6,0,0]],[[RX-1,1.6,2.0],[RX+6,1.4,0],38,[2,0,0],[2,0,0]]],D);return 'ext'};
S.truoc=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);const lx=176+lt*0.25;put(C.LOC,lx,0.1,{back:true,phase:T*2.5},-0.25);put(C.TAM,170+lt*0.08,0.3,{torch:true,mouth:m('TAM',si),back:si===0||si>=3,eyes:1.3},-0.22);torch3(170.4+lt*0.08,1.9,0.5,T,0.7);
 cams(lt,ls,[[[166,1.6,1.8],[176,1.5,0],36,[1,0,0],[1,0,0]],[[173.5,1.5,2.4],[170.3,1.4,0.3],32],[[174,1.5,2.2],[170.3,1.4,0.3],34],[[168.6,1.5,1.8],[lx,1.0,0],36],[[168.2,1.8,2.6],[171,1.3,0.2],34,[0.3,0,0]]],D);return 'ext'};
S.truoc2=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);put(C.TAM,171,0.3,{torch:true,back:si===1,eyes:1.3,look:0.6},-0.22);torch3(171.4,1.9,0.5,T,0.7);const lx=180+lt*0.15;put(C.LOC,lx,0.1,{back:true,phase:T*2.5},-0.25);if(si===1)put(C.MA,lx+0.9,-0.4,{back:true,arms:[0.4,-0.1],a:0.92,walk:true,glow:0.4},-0.25);
 cams(lt,ls,[[[173.4,1.5,2.4],[171,1.4,0.3],30,[-0.2,0,-0.2]],[[169.4,1.7,1.2],[181,1.6,-0.2],34,[0.5,0,0]]],D);return 'ext'};
S.jump1=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);const lx=182.6;put(C.LOC,lx,0.1,{back:true},-0.25);put(C.MA,lx+0.95,-0.4,{back:si===0,arms:[0.4,-0.1],glow:si===1?1.6:0.5,open:0.9,look:-0.6},-0.25);ghostL.position.set(lx+0.6,2.2,0.8);ghostL.color.set(0xff5040);ghostL.intensity=si===1?4:0.8;
 cams(lt,ls,[[[172,1.7,1.0],[182.6,1.6,-0.2],30,[2,0,0]],[[180.4,2.2,0.7],[lx+0.95,2.05,-0.4],30,[0.5,0,-0.1]]],D);return 'ext'};
// -------- CHƯƠNG 2 --------
const lhX=-15.6,lhZ=7.2;
S.xom2=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.TAM,lhX+0.3,lhZ-0.6,{sit:true,eyes:1.2},0);put(C.HOA,lhX-1.6,lhZ+0.4,{tear:true});put(C.D1,lhX+2.2,lhZ+1.2,{});put(C.D2,lhX+3.2,lhZ+0.2,{});put(C.N1,lhX-2.8,lhZ+1.6,{});if(si===1)put(C.BNL,lhX+1.2,lhZ+1.8,{look:-0.5});
 cams(lt,ls,[[[lhX+1,1.8,lhZ+6.5],[lhX+0.4,1.1,lhZ],38,[0,0,-0.8]],[[lhX+3.4,1.5,lhZ+5.2],[lhX+1.2,1.3,lhZ+1.8],32,[-0.3,0,-0.3]]],D);return 'ext'};
S.banam=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.BNL,lhX+1.2,lhZ+1.8,{mouth:m('BNL',si),look:-0.4,point:si===3});put(C.HOA,lhX-0.2,lhZ+2.2,{tear:true,mouth:m('HOA',si),look:0.5});put(C.TAM,lhX+2.4,lhZ+2.6,{mouth:m('TAM',si),look:-0.6});put(C.D1,lhX+3.4,lhZ+1.0,{});
 const B=[[lhX+0.2,1.5,lhZ+5.4],[lhX+1.2,1.4,lhZ+1.8],28],H=[[lhX+1.4,1.5,lhZ+5.6],[lhX-0.2,1.4,lhZ+2.2],28],TT=[[lhX+0.6,1.5,lhZ+6.0],[lhX+2.4,1.4,lhZ+2.6],28];
 cams(lt,ls,[B,H,B,[[lhX+0.6,1.6,lhZ+6.6],[lhX+1.4,1.3,lhZ+2],36,[0,0,-0.6]],TT,B],D);return 'ext'};
const lineVil=(T,x0,z0)=>{put(C.D1,x0,z0-2.0,{torch:true,back:true},-0.22);put(C.D2,x0+0.3,z0+1.6,{torch:true,back:true},-0.22);put(C.D3,x0-0.2,z0+3.6,{torch:true,back:true},-0.22);put(C.N1,x0-1.8,z0-0.6,{thau:true},-0.22);put(C.N2,x0-1.9,z0+2.2,{thau:true},-0.22);
 torch3(x0+0.4,1.8,z0-1.6,T,0.9);torch3(x0+0.6,1.8,z0+2.4,T,0.8,torchL2)};
S.dem2=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);lineVil(T,160+lt*0.15,0);if(si===2)put(C.NHAN,158.4+lt*0.15,1.0,{thau:true,gonk:1,mouth:m('NHAN',si)},-0.22);
 cams(lt,ls,[[[152,2.4,2],[160,1.4,0.6],40,[1.5,0,0],[1.5,0,0]],[[154.5,1.6,-1.2],[159,1.2,1.6],36,[0.5,0,0]],[[156.4,1.5,2.8],[158.6,1.4,1.0],30,[0.4,0,0]],[[166,1.9,5.5],[160,1.3,0.5],40,[0,0,-0.5]]],D);return 'ext'};
S.vong=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);lineVil(T,166,0);put(C.BNL,164.0,1.2,{mouth:m('BNL',si),point:si===6},-0.22);
 const lk=[[[158,1.7,1.0],[170,1.6,-5],38,[0.5,0,0]],[[158,1.6,-2.5],[175,2.0,-8],40],[[159,1.7,3.5],[165,1.3,0],36],[[159,1.6,4],[176,2,9],40],[[158,2.4,-1],[165,1.2,1],42,[0,0,0],[0,1.5,0]],[[166,1.0,6],[166,4,-2],46,[0,0,-0.5]],[[161.2,1.5,0.4],[164.0,1.4,1.2],30]];
 cams(lt,ls,lk,D);return 'ext'};
S.dem3=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);put(C.THUY,176,0.6,{mam:true,mouth:m('THUY',si),look:si===2?0.8:0},-0.22);put(C.NHAN,174.8,0.2,{thau:true,gonk:1,mouth:m('NHAN',si),look:0.6},-0.22);put(C.D1,178.5,-0.4,{torch:true,back:true},-0.22);torch3(178.9,1.8,-0.2,T,0.9);
 wisps(si>=1,T,186,-2);if(si===4)put(C.MA,188,-3.5,{a:0.7,glow:0.5,closed:false},-0.25);
 const A=[[173.2,1.5,3.0],[175.6,1.3,0.4],34],TH=[[175.0,1.5,3.0],[176,1.4,0.6],28],NH=[[176.8,1.5,3.0],[174.8,1.4,0.2],28];
 cams(lt,ls,[A,[[174.4,1.5,2.0],[186,1.0,-2],36,[0.4,0,0]],TH,NH,[[175.4,1.6,2.4],[188,1.6,-3.5],32,[0.8,0,-0.2]]],D);return 'ext'};
S.sang3=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);const x=si<3?192+lt*0.12:GX-4.2;put(C.TAM,x,0.4,{thau:true,gonk:1,mouth:m('TAM',si)},-0.22);
 cams(lt,ls,[[[186,1.8,4.5],[x,1.3,0.3],40,[1.5,0,-0.5]],[[x+2.4,1.5,2.6],[x,1.4,0.4],30],[[x-2.2,1.5,2.4],[x,1.4,0.4],28],[[GX-6.4,1.5,3.2],[GX-2.6,0.9,2.4],34,[0.3,0,-0.2]],[[GX-5.4,1.2,3.6],[GX-2.6,0.8,2.4],36,[0.4,0,-0.3]]],D);return 'ext'};
S.jump2=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);put(C.LOCF,GX-2.3,2.1,{sit:true,mud:true,eyes:1.2,grin:si===2,tilt:si===2?Math.min(0.5,(lt-ls[2])*0.6):0,look:si===2?1:0,muddy:true},0.0);put(C.TAM,GX-5.4,2.8,{thau:true,eyes:1.3,look:0.6},-0.2);ghostL.position.set(GX-2.6,1.4,3.4);ghostL.color.set(0xa0ffc0);ghostL.intensity=si===2?2.5:0.8;
 cams(lt,ls,[[[GX-3.4,1.5,5.0],[GX-2.4,0.9,2.1],32,[0.2,0,-0.4]],[[GX-3.0,1.2,4.4],[GX-2.3,1.0,2.1],26],[[GX-2.8,1.15,3.9],[GX-2.3,1.12,2.1],24,[0.2,0,-0.4]]],D);return 'ext'};
S.ve=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);if(si===0){put(C.TAM,lhX+1.6,lhZ+1.8,{bucket:true,honey:true,eyes:1.2});put(C.LOC,lhX+0.4,lhZ+1.4,{eyes:0.6,mud:true,muddy:true,pale:true,look:0.4});put(C.HOA,lhX-1.2,lhZ+2,{tear:true})}
 else{put(C.LOC,lhX+0.2,lhZ+1.0,{sit:true,pale:true,mud:si===1,eyes:si===1?0.5:0.9,muddy:true},-0.42);put(C.BNL,lhX+1.3,lhZ+1.5,{look:-0.8});put(C.HOA,lhX-1.0,lhZ+1.4,{tear:true,look:0.6});if(si===3)put(C.TAM,lhX+2.6,lhZ+2.2,{look:-0.6})}
 cams(lt,ls,[[[lhX+1,1.6,lhZ+6.6],[lhX+0.6,1.2,lhZ+1.6],36,[0,0,-0.6]],[[lhX+0.8,1.2,lhZ+4.2],[lhX+0.4,0.8,lhZ+1.1],30],[[lhX+0.2,1.3,lhZ+4.4],[lhX-0.2,0.9,lhZ+1.2],34],[[lhX+3.8,1.6,lhZ+6],[lhX+1,1.1,lhZ+1.4],38,[0,0,-0.5]]],D);return 'ext'};
S.ve2=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);const x=-8.5,z=0.5;put(C.BNL,x,z,{mouth:m('BNL',si),look:0.6});put(C.TAM,x+1.2,z+0.4,{mouth:m('TAM',si),look:-0.6});
 const B=[[x+1.6,1.5,z+3.6],[x,1.4,z],28],TT=[[x-0.6,1.5,z+3.8],[x+1.2,1.4,z+0.4],28];cams(lt,ls,[[[x+0.6,1.7,z+5],[x+0.6,1.2,z],38,[0,0,-0.6]],TT,B,B,B],D);return 'ext'};
S.mat=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.HOA,lhX-0.2,lhZ+1.2,{tear:true,mouth:m('HOA',si),look:0.5});put(C.BNL,lhX+1.2,lhZ+1.5,{look:-0.5});
 cams(lt,ls,[[[lhX+0.6,1.6,lhZ+5.8],[lhX+0.4,1.3,lhZ+1.3],36,[0,0,-0.4]],[[lhX+1.2,1.5,lhZ+4.6],[lhX-0.2,1.4,lhZ+1.2],28],[[lhX-0.6,1.5,lhZ+4.6],[lhX+1.2,1.4,lhZ+1.5],28],[[lhX-1,1.5,lhZ+4],[60,2.2,-10],40,[0,0,0],[0,0,0]]],D);return 'ext'};
S.la=(lt,D,T,ls)=>{tod('dusk');const si=siOf(lt,ls);put(C.LOC,-8.4,10.6,{sit:true,back:true,pale:true},-0.42);if(si===0)put(C.HOA,-10.6,7.4,{bowl:true});
 cams(lt,ls,[[[-8.6,1.7,6.0],[-8.4,0.9,10.6],38,[0,0,0.4]],[[-6.2,1.3,8.2],[-8.4,0.8,10.6],34,[0,0,0.2]]],D);return 'ext'};
S.la2=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.LOC,lhX+0.2,lhZ-0.4,{sit:true,pale:true,eyes:1,mouth:m('GLOC',si),look:0.4},0);put(C.TAM,lhX+1.6,lhZ+1.0,{eyes:si>=2?1.3:1,look:-0.6});if(si===3)put(C.MUC,lhX+2.6,lhZ+1.8,{growl:true});
 cams(lt,ls,[[[lhX+2.8,1.5,lhZ+4.2],[lhX+0.4,1.0,lhZ-0.2],32,[-0.2,0,-0.3]],[[lhX+1.4,1.3,lhZ+2.6],[lhX+0.2,1.05,lhZ-0.4],26],[[lhX-0.4,1.5,lhZ+3.6],[lhX+1.6,1.4,lhZ+1.0],28],[[lhX+3.6,1.0,lhZ+4.4],[lhX+2.6,0.5,lhZ+1.8],34]],D);return 'ext'};
S.la3=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si<2){tod('dusk');put(C.LOC,-6+lt*0.2,12.4,{back:si===0,eyes:1,pale:true},-0.75);put(C.TAM,-2.6,7.0,{back:true});
  cams(lt,ls,[[[-1.8,1.7,6.2],[-5.6,0.6,12.4],34,[0,0,0.2]],[[-4.4,0.5,10.2],[-5.2,0.2,12.4],34,[0.3,0,0]]],D);return 'ext'}
 innMode('night');NET.visible=false;lampAt(-1.4,0.2,0.5);put(CI.TAM,-2.6,-0.8,{sit:true,mouth:m('TAM',si),look:0.5},0);put(CI.NHAN,-1.4,-0.6,{mouth:m('NHAN',si),look:-0.5});
 cams(lt,ls,[[],[],[[-0.6,1.4,2.0],[-2.6,1.05,-0.8],28],[[-3.4,1.5,2.0],[-1.4,1.4,-0.6],28]],D);return 'inn'};
S.jump3=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===0){innMode('night');NET.visible=false;lampL.intensity=0;put(CI.THUY,-3.9,0.4,{eyes:1.2,look:-1},0);
  cams(lt,ls,[[[-1.4,1.5,2.4],[-4.2,1.4,0.3],36,[-0.4,0,-0.3]]],D);return 'inn'}
 tod('night');const sq=si>=3;put(C.LOCF,-3.2,10.8,{sit:true,back:!sq,mud:true,eyes:1.2,grin:si>=4,armR:sq?0:-2.6},-0.42);ghostL.position.set(-3.2,1.4,9.8);ghostL.color.set(0xa0ffc0);ghostL.intensity=sq?2:0.5;
 cams(lt,ls,[[],[[-4.4,1.5,2.0],[-3.2,0.6,10.8],32,[0.1,0,0.3]],[[-4.4,1.4,4.0],[-3.2,0.7,10.8],26,[0.1,0,0.4]],[[-3.6,1.15,8.2],[-3.2,1.0,10.8],24,[0.1,-0.02,0.4]],[[-3.5,1.1,8.6],[-3.2,1.0,10.8],22],[[-3.4,1.05,9.0],[-3.2,1.0,10.8],20]],D);return 'ext'};
// -------- CHƯƠNG 3 --------
S.sang4=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.TAM,lhX+1.6,lhZ+1.6,{look:-0.5});if(si>=1)put(C.HOA,lhX-0.4,lhZ+0.6,{sit:true,tear:true},-0.42);if(si===3)feet(true,lhX+0.6,lhZ+0.2,0.3,0.55);
 cams(lt,ls,[[[lhX+1,1.6,lhZ+6],[lhX+1.2,1.2,lhZ+1.4],38,[0,0,-0.6]],[[lhX+1.8,1.3,lhZ+4.4],[lhX-0.4,0.9,lhZ+0.6],30],[[lhX+0.4,1.4,lhZ+4.6],[lhX-0.2,0.9,lhZ+0.6],34],[[lhX+1.4,1.3,lhZ+3.6],[lhX+1.2,0.0,lhZ+1.4],44,[0,0,-0.2]]],D);return 'ext'};
S.banam2=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);const x=-1.0,z=6.0;put(C.BNL,x,z,{mouth:m('BNL',si),look:0.6,point:si===4});put(C.TAM,x+1.3,z+0.4,{mouth:m('TAM',si),look:-0.6,eyes:si===2?1.3:1});
 const B=[[x-0.6,1.5,z+3.8],[x,1.4,z],28],TT=[[x+2.2,1.5,z+3.8],[x+1.3,1.4,z+0.4],28];cams(lt,ls,[B,[[x+0.6,1.7,z+5],[x+0.6,1.2,z],38,[0,0,-0.6]],TT,B,B],D);return 'ext'};
const sleep2=(T,thuyIn=true)=>{innMode('night');NET.visible=true;lampAt(-1.6,0.6,0.5);lampL.intensity*=0.5;BLANKET.visible=true;BLANKET.position.set(0.15,0.55,0);BLANKET.scale.set(1,0.8,1.0);
 put(CI.NHAN,-3.95,-2.05,{eyes:0.05},-0.55);if(thuyIn)put(CI.THUY,-3.95,-1.4,{eyes:0.05},-0.55)};
S.dem4=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===0){innMode('night');NET.visible=false;lampAt(1.2,1.6,0.5);lampL.intensity*=0.6;put(CI.TAM,1.4,0.6,{sit:true,eyes:1.2},0);
  cams(lt,ls,[[[2.6,1.5,3.6],[1.4,1.0,0.6],34,[-0.2,0,-0.3]]],D);return 'inn'}
 sleep2(T,true);if(si>=3){doorL.intensity=4;doorL.color.set(0x9ab8ff)}
 cams(lt,ls,[[],[[0.2,1.9,-1.4],[-3.9,0.9,-1.7],34,[-0.3,0,0]],[[-1.4,1.7,0.2],[-3.9,0.95,-2.0],30,[-0.2,0,0]],[[0.4,1.6,1.6],[2.6,1.2,-3.3],38,[0,0,0]],[[-1.4,1.7,0.0],[-3.95,0.95,-2.05],26,[-0.2,0,-0.1]]],D);return 'inn'};
S.jump4=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si<=1){sleep2(T,false);CI.NHAN.userData.o.eyes=1.25;if(si===1){CI.NHAN.position.y+=0.35;CI.NHAN.userData.o.mouth=m('NHAN',si)}doorL.intensity=6;
  cams(lt,ls,[[[0.2,1.9,-1.4],[-3.9,0.9,-1.6],34,[-0.3,0,0]],[[-1.6,1.6,0.0],[-3.95,1.3,-2.05],26]],D);return 'inn'}
 tod('night');feet(true,2.6,-3.6,0.0,-0.55);put(C.TAM,2.6,-3.4,{back:si===2,eyes:1.3,look:0,torch:true},0);torch3(3.0,2.0,-3.6,T,0.9);put(C.MA,3.4,-11.5,{a:si===3?0.95:0.0,glow:1.4,open:0.9},0);ghostL.position.set(3.2,2.2,-10);ghostL.color.set(0xff5040);ghostL.intensity=si===3?4:0;
 cams(lt,ls,[[],[],[[5.5,1.8,-6.8],[2.6,0.5,-3.8],40,[-0.3,0,0]],[[2.6,2.0,-4.6],[3.4,2.1,-11.5],24,[0.1,0,-1.2]],[[1.0,1.6,-6.0],[2.6,1.3,-3.4],34]],D);return 'ext'};
S.cuu=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);const x=-4.6,z=7.6;put(C.BNL,x,z,{mouth:m('BNL',si),look:0.5,point:si>=2&&si<=4});put(C.TAM,x+1.5,z+0.2,{torch:true,look:-0.6,eyes:1.2});put(C.NHAN,x+2.6,z+0.8,{tear:true,look:-0.6});torch3(x+1.9,2.0,z+0.4,T);
 const B=[[x+1.4,1.5,z+3.4],[x,1.4,z],26],W=[[x+1.0,1.7,z+5.2],[x+1.2,1.2,z+0.3],38,[0,0,-0.6]];cams(lt,ls,[W,B,[[x+2.2,1.5,z+3.6],[x+0.4,1.4,z],30],B,[[x+1.0,1.4,z+2.6],[x,1.45,z],22],B],D);return 'ext'};
S.cuu2=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);const x=-4.6,z=7.6;put(C.BNL,x,z,{mouth:m('BNL',si),look:0.5});put(C.TAM,x+1.5,z+0.2,{torch:true,look:-0.6,mouth:m('TAM',si)});put(C.NHAN,x+2.6,z+0.8,{look:-0.6,mouth:m('NHAN',si)});torch3(x+1.9,2.0,z+0.4,T);
 const B=[[x+1.4,1.5,z+3.4],[x,1.4,z],26];cams(lt,ls,[B,[[x+0.8,1.4,z+2.6],[x,1.45,z],22],B,[[x+1.0,1.4,z+2.6],[x,1.45,z],22],[[x-0.4,1.5,z+3.6],[x+1.5,1.4,z+0.2],28],[[x+4.2,1.5,z+3.4],[x+2.6,1.4,z+0.8],28]],D);return 'ext'};
S.chuoc=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);gheL.intensity=7*fl(T);torch3(-32.4,1.9,16.6,T,0.9,torchL2);torch3(-30.0,1.4,14.6,T,0.45);moonDir.intensity=2.6;put(C.NHAN,XUONGN.position.x,15.0,{mouth:m('NHAN',si),tear:si>=3,look:-0.6},0.25);put(C.D3,-33.2,16.0,{look:0.6},0.55);
 cams(lt,ls,[[[-22,2.2,9],[-32,1.2,16],40,[-2,0,1]],[[-29.6,1.9,11.4],[-33,1.6,16],32],[[-31.6,1.6,11.6],[-30.5,1.5,15.0],28],[[-31.0,1.6,11.4],[-30.5,1.55,15.0],24],[[-27,1.9,10.5],[-32,1.3,15.6],36,[0,0,0.5]]],D);return 'ext'};
S.biarung=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);mieu(si===4?'lit':'ok');put(C.TAM,si===4?RX-2.0:RX-2.6,si===4?3.4:4.4,{torch:true,bucket:true,honey:true,mouth:m('TAM',si),look:0.5,back:si===4});put(C.NHAN,RX-4.0,5.0,{thau:true,gonk:si===4?1:undefined,mouth:m('NHAN',si),look:0.5,tear:si===2});torch3(RX-2.2,2.0,4.6,T);
 cams(lt,ls,[[[RX-8,1.7,9],[RX-3,1.3,4.4],38,[1,0,-0.6]],[[RX-4.6,1.5,8.2],[RX-2.6,1.4,4.4],28],[[RX-1.4,1.5,8.4],[RX-4.0,1.4,5.0],28],[[RX-6.4,1.5,8.0],[RX-3.2,1.3,4.6],34],[[RX-6.5,1.6,7.5],[RX-1,1.3,2.5],36,[0.4,0,-0.2]]],D);return 'ext'};
S.dem5=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);const x=158+lt*0.3;put(C.TAM,x,0.2,{torch:true,bucket:true,honey:true,back:si===2,phase:T*4},-0.22);torch3(x+0.4,1.9,0.4,T);
 cams(lt,ls,[[[x-4,1.4,2.4],[x+2,2.2,-0.5],40],[[x+3.0,1.5,1.6],[x,1.4,0.2],32],[[x-3.5,1.7,1.0],[x+4,1.4,0],36]],D);return 'ext'};
S.dem6=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);const tx=178;const hx=184+lt*0.18;put(C.TAM,tx,0.2,{torch:true,bucket:true,honey:true,back:si!==2,mouth:m('TAM',si),eyes:1.2},-0.22);torch3(tx+0.4,1.9,0.4,T);put(C.THUY,hx,0.0,{back:true,phase:T*2.4},-0.25);
 cams(lt,ls,[[[tx-2.4,2.0,2.4],[hx,1.3,0],32,[0.5,0,0]],[[tx+0.4,1.4,0.9],[hx,1.1,0],18,[0.4,0,0]],[[tx+2.6,1.5,1.4],[tx,1.4,0.2],30],[[tx-2.6,1.6,1.4],[hx,1.1,0],20,[0.6,0,0]],[[tx+1.4,0.6,1.1],[hx,0.2,0],34]],D);return 'ext'};
S.dem7=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);const tx=178;put(C.TAM,tx,0.2,{torch:true,bucket:true,honey:true,eyes:1.3,look:si===1?-0.8:0.6},-0.22);torch3(tx+0.4,1.9,0.4,T);if(si===0)put(C.THUY,187.2,0.0,{back:true,a:1-sm(lt/(ls[1]||D))},-0.25);
 cams(lt,ls,[[[tx-2.4,1.6,1.6],[187,1.1,0],22,[0.6,0,0]],[[tx+2.2,1.5,1.4],[tx,1.45,0.2],24,[-0.2,0,0]]],D);return 'ext'};
S.jump5=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);const tx=178;put(C.TAM,tx,0.2,{torch:true,bucket:true,honey:true,eyes:1.3,look:0.8},-0.22);torch3(tx+0.4,1.9,0.4,T,0.8);put(C.MA,tx-1.1,-0.7,{a:0.96,glow:1.2,open:si===1?0.95:0.4,look:1,tilt:0.25,arms:[0.2,-0.9]},-0.95);
 ghostL.position.set(tx-0.6,1.8,0.3);ghostL.color.set(0xff5040);ghostL.intensity=si===1?3:1.2;
 cams(lt,ls,[[[tx+2.4,1.5,1.8],[tx-0.4,1.45,-0.2],28,[-0.3,0,-0.2]],[[tx+1.0,1.55,1.6],[tx-1.1,1.4,-0.7],24,[-0.2,0,-0.1]]],D);return 'ext'};
// -------- CHƯƠNG 4 --------
S.nhan=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);put(C.NHAN,RX-4.0,5.0,{thau:true,gonk:si===1?undefined:1,blood:true,mouth:m('NHAN',si),look:0.5,eyes:si===3?1.2:1},0);torch3(RX-3.4,1.2,5.6,T,0.7);
 cams(lt,ls,[[[RX-6.4,1.5,8.0],[RX-4.0,1.3,5],30,[0.2,0,-0.3]],[[RX-6,1.6,6.6],[RX+8,1.6,0],34,[0,0,0],[0,0,0]],[[RX-4.4,1.4,7.0],[RX-4,1.45,5],22],[[RX-5.0,1.6,7.6],[RX-4,1.3,5],30],[[RX-4.4,1.4,7.0],[RX-4,1.45,5],22]],D);return 'ext'};
S.nhan2=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);const kneel=si===1;put(C.NHAN,RX-4.0,5.0,{thau:!kneel,gonk:si===2?1:undefined,sit:kneel,blood:true,arm:kneel?[0.6,-0.6]:undefined,eyes:1.2,look:kneel?0:0.5},kneel?-0.5:0);torch3(RX-3.4,1.2,5.6,T,0.7);
 cams(lt,ls,[[[RX-5.2,1.5,7.4],[RX-3.8,1.2,5],34,[0,-0.1,-0.2]],[[RX-5.4,1.2,7.2],[RX-4.0,0.6,5],32,[0.2,0,-0.2]],[[RX-6.8,1.6,8.4],[RX-4,1.3,5],36,[0.4,0,-0.4]]],D);return 'ext'};
S.tam=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);const tx=178;put(C.TAM,tx,0.2,{torch:true,bucket:true,honey:true,eyes:si===0?0.05:1,look:0.6},-0.22);torch3(tx+0.4,1.9,0.4,T,0.8);if(si===0)put(C.MA,tx-1.1,-0.7,{a:0.9,glow:0.9,open:0.4,look:1,tilt:0.25},-0.95);
 cams(lt,ls,[[[tx+1.0,1.55,1.6],[tx-0.6,1.4,-0.4],24],[[tx+1.6,1.5,1.8],[tx,1.45,0.2],26],[[tx+2.6,1.6,2.4],[tx,1.4,0.2],32,[0.3,0,0.2]],[[tx-3,1.7,1.6],[tx+6,1.4,0],36,[1.5,0,0],[1.5,0,0]]],D);return 'ext'};
const goTam=(o,lt,T)=>{put(C.TAM,GX-2.2,1.3,Object.assign({torch:true},o),-0.08);torch3(GX-1.8,2.6,1.5,T,0.9)};
S.go=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);keota('dead');goTam({bucket:true,honey:true,back:si<=1,look:0.4},lt,T);
 cams(lt,ls,[[[GX-9,1.8,4.5],[GX,3.5,-1],40,[1.5,0.2,-0.5]],[[GX-1,1.6,4.6],[GX+2.3,3.3,-1],36,[0,0.2,-0.4]],[[GX-0.4,1.6,2.4],[GX+0.9,0.9,0.2],36,[0.2,-0.1,-0.2]],[[GX+0.6,1.3,1.4],[GX+1.4,0.9,0.5],30,[0.05,-0.05,-0.1]]],D);return 'ext'};
S.xac=(lt,D,T,ls)=>{forest('dawn');lie(CORPSE,GX+0.6,0.45,3.4,0.3,0.9);goTam({bucket:true,honey:true,eyes:1.3,look:0.8},lt,T);
 cams(lt,ls,[[[GX-1.0,1.7,6.2],[GX+0.6,0.6,3.4],34,[0.2,0,-0.3]],[[GX-0.2,1.5,5.4],[GX+0.6,0.6,3.4],26,[0,-0.05,-0.2]],[[GX-0.6,1.5,3.6],[GX-2.2,1.4,1.3],28]],D);return 'ext'};
S.dom=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);MATPOOL.visible=true;MATPOOL.scale.setScalar(si===0?Math.max(0.05,sm(lt/(ls[1]||D))):1);GSTICK.forEach(s=>s.visible=si>=1);
 const call=[2,4,6].includes(si);goTam({bucket:si===0,honey:true,mouth:m('TAM',si),eyes:call?1.2:1,look:call?0:0.5,armR:si===0?-1.2:undefined},lt,T);
 cams(lt,ls,[[[GX-0.6,1.5,3.8],[GX-1.0,0.9,0.4],34,[0,0,-0.2]],[[GX-1.0,1.3,2.6],[GX+0.5,0.8,0.4],32],[[GX-0.4,1.6,3.4],[GX-2.2,1.6,1.3],28],[[GX-6,2.0,4],[GX-2.2,1.4,1.3],38],[[GX-0.6,1.5,3.4],[GX-2.2,1.4,1.3],28],[[GX-3.4,3.2,4.4],[GX-2.2,0.9,1.3],38],[[GX-0.6,1.5,3.4],[GX-2.2,1.4,1.3],28]],D);return 'ext'};
S.tl=(lt,D,T,ls)=>{forest('dawn');MATPOOL.visible=true;GSTICK.forEach(s=>s.visible=true);goTam({eyes:1.3,look:Math.sin(T*1.5)},lt,T);wisps(true,T,GX-2,2);
 cams(lt,ls,[[[GX-4.5,4.5,4.5],[GX-2.2,0.9,1.3],44],[[GX-0.6,1.5,3.6],[GX-2.2,1.5,1.3],30],[[GX-2.2+Math.sin(lt*0.6)*3,1.6,1.3+Math.cos(lt*0.6)*3],[GX-2.2,1.4,1.3],34],[[GX-4.4,1.5,3.6],[GX-2.2,1.5,1.3],28]],D);return 'ext'};
S.tl2=(lt,D,T,ls)=>{forest('dawn');MATPOOL.visible=true;GSTICK.forEach(s=>s.visible=true);put(C.TAM,GX-1.4+Math.min(lt,2)*0.6,2.2,{torch:true,look:1},-0.05);torch3(GX-0.8+Math.min(lt,2)*0.6,2.5,2.4,T,0.9);
 cams(lt,ls,[[[GX-4.2,1.6,4.8],[GX+1.6,1.0,1.9],34,[0.6,0,-0.2]],[[GX-2,1.5,5],[GX+2.2,0.9,1.9],32,[0.5,0,-0.3]]],D);return 'ext'};
const lairX=GX+2.7,lairZ=2.4;
S.jump6=(lt,D,T,ls)=>{forest('dawn');keota('none');const si=siOf(lt,ls);put(C.THUY,lairX,lairZ,{sit:true,mud:true,eyes:0.45,pale:true,tilt:-0.2},-0.12);const up=si>=2;
 put(C.MA,lairX+1.0,lairZ-0.5,{crouch:!up,arms:up?[0.35,-0.35]:[0.2,-1.0],mudHand:up?0:1,open:up?0.95:0.4,glow:up?1.6:0.6,look:-0.6},-0.12);put(C.TAM,lairX-1.8,lairZ+1.2,{torch:true,eyes:1.3,look:0.8},-0.08);torch3(lairX-1.4,2.4,lairZ+1.4,T,0.9);
 ghostL.position.set(lairX+0.6,2.2,lairZ+0.6);ghostL.color.set(0xff5040);ghostL.intensity=up?3.5:1.2;
 cams(lt,ls,[[[lairX-0.6,1.4,lairZ+3.0],[lairX+0.4,0.8,lairZ],32,[0,0,-0.3]],[[lairX+0.2,1.3,lairZ+2.4],[lairX+0.8,1.0,lairZ-0.4],28],[[lairX-0.6,1.2,lairZ+3.2],[lairX+1.0,2.2,lairZ-0.5],38,[0,0,-0.2],[0,0.4,0]],[[lairX-1.8,1.4,lairZ+3.4],[lairX+0.5,1.6,lairZ-0.2],40],[[lairX-0.4,1.5,lairZ+3.0],[lairX+1.0,2.6,lairZ-0.5],32,[0.2,0,-0.4]]],D);return 'ext'};
S.ma=(lt,D,T,ls)=>{forest('dawn');keota('none');const si=siOf(lt,ls);put(C.THUY,lairX,lairZ,{sit:true,mud:true,eyes:0.4,pale:true,tilt:-0.2},-0.12);put(C.MA,lairX+1.0,lairZ-0.5,{arms:[0.35,-0.35],open:si===2?0.9:0.6,wide:si===2,glow:1.4,look:-0.6,tilt:si===2?0.3:0},-0.15);put(C.TAM,lairX-1.8,lairZ+1.2,{torch:true,mouth:m('TAM',si),eyes:1.3,look:0.8},-0.08);torch3(lairX-1.4,2.4,lairZ+1.4,T,0.9);ghostL.position.set(lairX+0.6,2.2,lairZ+0.6);ghostL.color.set(0xff5040);ghostL.intensity=3;
 cams(lt,ls,[[[lairX-0.2,1.6,lairZ+3.4],[lairX+1.0,2.4,lairZ-0.5],32,[0,0,-0.3]],[[lairX+0.2,1.5,lairZ+3.6],[lairX-1.8,1.4,lairZ+1.2],28],[[lairX+0.2,2.0,lairZ+2.4],[lairX+1.0,2.3,lairZ-0.5],28,[0,0,-0.3]]],D);return 'ext'};
S.ma2=(lt,D,T,ls)=>{forest('dawn');keota('none');const si=siOf(lt,ls);const pull=si>=1;put(C.THUY,pull?lairX-0.8:lairX,lairZ+(pull?0.8:0),{sit:!pull,mud:si<2,eyes:0.8,pale:true},pull?-0.08:-0.12);put(C.MA,lairX+1.4+(si>=1?0.6:0),lairZ-0.9,{arms:[0.6,-0.6],open:0.95,glow:1.2,look:-0.6,tilt:-0.2},-0.15);put(C.TAM,lairX-1.8,lairZ+1.2,{torch:true,eyes:1.3,look:0.8},-0.08);torch3(lairX-1.4,2.4,lairZ+1.4,T,0.9);ghostL.position.set(lairX+0.8,2.2,lairZ+0.2);ghostL.color.set(0xff5040);ghostL.intensity=2;
 cams(lt,ls,[[[lairX-3,1.7,lairZ+4.4],[lairX+0.4,1.6,lairZ],38],[[lairX-1.0,1.5,lairZ+3.8],[lairX-0.6,1.3,lairZ+0.8],32],[[lairX-1.6,1.5,lairZ+3.6],[lairX-1.2,1.3,lairZ+1.0],30],[[lairX-4,1.7,lairZ+3],[lairX,1.4,lairZ],38,[-1,0,0]]],D);return 'ext'};
S.ra=(lt,D,T,ls)=>{forest('dawn');const x=198-lt*0.5;put(C.THUY,x-1.0,0.1,{phase:T*5,pale:true,eyes:1.1,look:-1},-0.25);put(C.TAM,x,0.3,{torch:true,phase:T*5,eyes:1.3,look:-1},-0.22);torch3(x+0.4,1.9,0.5,T);
 cams(lt,ls,[[[x-5,1.6,1.6],[x,1.4,0.2],34],[[x-4.4,1.5,1.4],[x,1.4,0.2],30],[[x+3.6,1.6,1.4],[x,1.4,0.2],32],[[x-3.6,1.5,1.2],[x+0.2,1.45,0.3],24],[[x-4.4,1.6,1.6],[x,1.4,0.2],30]],D);return 'ext'};
S.ra2=(lt,D,T,ls)=>{forest('dawn');const x=180-lt*0.5;put(C.THUY,x-1.0,0.1,{phase:T*5,pale:true,eyes:1.1,look:-1},-0.25);put(C.TAM,x,0.3,{torch:true,phase:T*5,eyes:1.3,look:-1},-0.22);torch3(x+0.4,1.9,0.5,T);
 cams(lt,ls,[[[x-3.4,1.5,1.2],[x+0.2,1.45,0.3],24],[[x-3.6,1.5,1.4],[x-1.0,1.3,0.1],26],[[x-2.4,0.5,1.0],[x-1.0,0.0,0.1],34,[-0.5,0,0],[-0.5,0,0]]],D);return 'ext'};
S.bia=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);const run=si===3;const rp=run?Math.min(lt-ls[3],2):0;put(C.NHAN,RX-4.0+rp*0.6,5.0-rp*0.6,{thau:!run,gonk:si<2?1:undefined,blood:true,tear:si>=1,eyes:1.1,look:0.6,arm:run?[0.5,-0.5]:undefined},0);
 put(C.THUY,RX+1.6,1.2,{pale:true,eyes:1,look:-1},-0.3);THAU3.visible=run;put(C.TAM,RX+2.8,1.0,{torch:true,look:-1},-0.22);torch3(RX+3.2,1.9,1.2,T,0.6);
 cams(lt,ls,[[[RX-6,1.6,6],[RX+3,1.4,1.0],36,[0.5,0,0]],[[RX-6.4,1.5,8.0],[RX-4.0,1.3,5],28],[[RX-5.6,1.6,7.4],[RX-3,1.3,4],34],[[RX-7.4,1.7,6.5],[RX-1,1.3,3],40,[0.5,0,-0.3]]],D);return 'ext'};
S.bia2=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);THAU3.visible=true;put(C.NHAN,RX-0.6,4.6,{tear:true,arm:[0.6,-0.6],eyes:0.4},0);put(C.THUY,RX-0.1,4.3,{pale:true,eyes:0.3},0);const out=si===3;put(C.TAM,out?RX+0.3:RX+1.0,out?3.8:2.0,{torch:!out,eyes:si===2?1.3:0.9,look:-1},out?0:-0.12);
 if(si===2)put(C.MA,RX+2.3,1.0,{a:0.9,glow:0.7,open:0.4,look:-1,tilt:0.2},-0.6);if(!out)torch3(RX+1.4,1.9,2.2,T,0.6);
 cams(lt,ls,[[[RX-4,1.5,7.5],[RX-0.4,1.3,4.2],30,[0.2,0,-0.2]],[[RX-3,1.5,6.6],[RX+1,1.4,2],30,[0.3,0,0]],[[RX-1.2,1.6,4.6],[RX+1.5,1.6,1.4],28,[0.1,0,-0.1]],[[RX-4.5,1.7,8],[RX-0.2,1.5,4],38,[0.4,0.2,-0.4]]],D);return 'ext'};
// -------- CHƯƠNG 5 --------
S.sau=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===0){innMode('day');NET.visible=false;BLANKET.visible=true;BLANKET.position.set(0.35,0.62,0.0);put(CI.THUY,-3.8,-1.75,{eyes:0.6,pale:true},-0.3);put(CI.NHAN,-2.2,-0.8,{bowl:true,arm:[0.12,-0.6],look:-0.6});
  cams(lt,ls,[[[-1.0,1.6,1.6],[-3.4,0.9,-1.6],36,[-0.2,0,-0.2]]],D);return 'inn'}
 tod('day');if(si===1){graves(1);put(C.D1,-0.8,-9.0,{back:true});put(C.D2,0.6,-8.6,{back:true});put(C.HOA,-2.6,-9.0,{tear:true});
  cams(lt,ls,[[],[[-1,1.7,-4.4],[-1.8,0.6,-10.2],38,[0,0,-0.4]]],D);return 'ext'}
 forest('day');mieu('lit');put(C.NHAN,RX-2.2,3.4,{back:true});cams(lt,ls,[[],[],[[RX-5,1.6,6.6],[RX-2.2,1.3,2.6],34,[0.5,0,-0.4]]],D);return 'ext'};
S.sau2=(lt,D,T,ls)=>{tod('dusk');const si=siOf(lt,ls);put(C.TAM,-1.6,5.4,{sit:true,fake:true,eyes:0.9,look:0.5},0);if(si>=1)put(C.MUC,1.4,6.4,{growl:true});
 cams(lt,ls,[[[-0.4,1.5,9.2],[-1.6,1.0,5.2],32,[0,0,-0.6]],[[-1.8,1.4,8.8],[0,0.8,5.6],36],[[2.4,0.7,8.2],[1.4,0.4,6.4],34,[-0.1,0,-0.3]]],D);return 'ext'};
S.thuy=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);NET.visible=false;lampAt(-1.8,0.0,0.5);BLANKET.visible=true;BLANKET.position.set(0.35,0.62,0.0);put(CI.THUY,-3.8,-1.75,{eyes:1.1,pale:true,mouth:m('THUY',si),look:0.6},-0.3);put(CI.NHAN,-1.7,-1.5,{sit:true,mouth:m('NHAN',si),look:-1,eyes:si===4?0.9:1},0.12);
 const TH=[[-2.9,1.4,0.7],[-3.7,1.0,-1.7],28],NH=[[-2.6,1.4,1.2],[-1.7,1.1,-1.5],28];cams(lt,ls,[TH,TH,TH,NH,[[-0.4,1.5,1.4],[-2.8,0.9,-1.3],36,[-0.2,0,-0.2]]],D);return 'inn'};
S.an=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);NET.visible=false;lampAt(-1.8,0.6,0.5);put(CI.TAM,-2.9,-0.8,{sit:true,fake:true,smile:si>=3,mouth:m('GTAM',si),look:0.6},0);put(CI.NHAN,-1.6,-0.3,{bowl:si<2,arm:si<2?[0.12,-0.6]:[0.3,-0.3],look:-0.6,eyes:si>=2?1.3:1});
 cams(lt,ls,[[[-0.6,1.5,2.6],[-2.2,1.1,-0.6],34,[-0.2,0,-0.3]],[[-1.8,1.3,1.4],[-2.9,1.05,-0.8],24],[[-2.6,1.4,1.8],[-1.6,1.3,-0.3],26],[[-1.8,1.3,1.4],[-2.9,1.05,-0.8],24],[[-2.2,0.6,1.2],[-2.9,0.1,-0.6],36,[0,0,-0.2]]],D);return 'inn'};
S.cuoi=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===0){sleep2(T,false);CI.NHAN.visible=false;
  cams(lt,ls,[[[0.2,1.9,-1.4],[-3.9,0.9,-1.7],34,[-0.3,0,0]]],D);return 'inn'}
 tod('night');put(C.TAM,1.2,10.9,{sit:true,back:true,fake:true,armR:-2.6},-0.42);if(si===1)put(C.NHAN,-1.4,6.4,{back:true});ghostL.position.set(1.2,1.5,10.0);ghostL.color.set(0x90ffc0);ghostL.intensity=1.6;moonDir.intensity=2.6;
 cams(lt,ls,[[],[[-3.2,1.8,6.0],[1.2,0.8,10.9],36,[0.3,0,0.4]],[[3.6,1.1,8.4],[1.2,0.8,10.9],30,[-0.2,0,0.2]]],D);return 'ext'};
S.cuoi2=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);put(C.TAM,1.2,10.9,{sit:true,fake:true,mud:true,smile:true,eyes:1,tilt:0.15,mouth:m('GTAM',si)},-0.42);ghostL.position.set(1.0,1.2,10.0);ghostL.color.set(0xa0ffc0);ghostL.intensity=1.2;
 cams(lt,ls,[[[1.0,1.3,8.0],[1.2,0.95,10.9],28,[0,-0.05,0.6]],[[1.1,1.15,8.8],[1.2,1.0,10.9],22,[0,0,0.3]]],D);return 'ext'};
S.final=(lt,D,T,ls)=>{const si=siOf(lt,ls);
 if(si<=2){tod('night');put(C.NHAN,-1.0,7.0,{eyes:1.3,look:0.8,tear:si>=2});put(C.TAM,1.2,10.9,{sit:true,back:true,fake:true},-0.42);
  cams(lt,ls,[[[-2.6,1.5,4.6],[-1.0,1.4,7.0],30,[0,0,0.3]],[[-1.4,1.7,5.4],[40,2.5,-4],34],[[-2.2,1.5,4.6],[-1.0,1.45,7.0],24,[0.1,0,0.3]]],D);return 'ext'}
 if(si<=4){forest('night');put(C.NHAN,RX-4.0,5.0,{thau:true,gonk:1,old:true,look:0.6},0);torch3(RX-3.4,1.2,5.6,T,0.6);if(si===4)put(C.MA,RX+4,1.0,{a:0.75,glow:0.6,open:0.3},-0.22);
  cams(lt,ls,[[],[],[],[[RX-8,1.7,9.5],[RX-3.6,1.3,4.6],36,[1,0,-0.8]],[[RX-6.6,1.6,7.4],[RX+3,1.6,1.4],34,[0.4,0,-0.2]]],D);return 'ext'}
 tod('dusk');put(C.TAM,1.2,10.9,{sit:true,fake:true,smile:true,eyes:1,look:-0.4},-0.42);
 cams(lt,ls,[[],[],[],[],[],[[3.6,1.4,7.0],[1.2,0.9,10.9],30,[-0.3,0,0.4]],[[2.0,1.2,8.2],[1.2,1.0,10.9],22,[0,0,0.3]]],D);return 'ext'};

// ================= vòng vẽ =================
window.draw=function(t0){const t=t0+T0;resetAll(t);
 motes.forEach((mm,i)=>{const p=(t*0.04+R(i))%1;mm.position.set(-4+(R(i+5))*1.5+p*2.5,0.3+((R(i+9)*3+t*0.05)%2.4),0.3+(R(i+3)-0.5)*1.2);mm.material.opacity=0.45*Math.sin(p*Math.PI)});
 fogS.forEach((s,i)=>{s.position.x=(s.userData.x0??(s.userData.x0=s.position.x))+((t*0.4+R(i)*10)%10)});
 CURT=t;const sc=TLD.scenes.find(s=>t>=s[1]&&t<s[2])||TLD.scenes[TLD.scenes.length-1];const [k,a,b,ls,li]=sc;const lt=t-a,D=b-a;SI_BASE=li;
 g2.clearRect(0,0,RW,RH);
 let mode='flat';try{mode=S[k](lt,D,t,ls)}catch(e){console.log('ERR',k,e.message);mode='flat'}
 [altL,innG,doorL,moonL,dayL,porchL,bthL,graveL,ghostL,rvL,moonDir,sunD,torchL,torchL2,gheL].forEach(l=>l.visible=l.intensity>0.01);lampL.visible=lampL.visible&&lampL.intensity>0.01;
 [lampL,moonL,doorL,moonDir,sunD,torchL].forEach(l=>l.castShadow=l.visible&&l.intensity>0.01);dayL.castShadow=false;porchL.castShadow=false;lampL.shadow.mapSize.set(512,512);
 lampL.position.set(lampG.position.x,lampG.position.y+0.3,lampG.position.z);
 if(window.DBGCAM){cam.position.set(...window.DBGCAM[0]);cam.lookAt(...window.DBGCAM[1]);cam.fov=50}
 jumpShake(t);if(VERT)cam.fov=Math.min(70,cam.fov*1.45);
 cam.aspect=RW/RH;cam.updateProjectionMatrix();
 const face=(c)=>{if(c.visible){c.userData.paint(t);c.lookAt(cam.position.x,c.position.y,cam.position.z)}};
 if(mode==='ext'||mode==='ext+'){hideNear();for(const kk in C)face(C[kk]);renderer.render(ext,cam)}
 else if(mode==='inn'){for(const kk in CI)face(CI[kk]);renderer.render(inn,cam)}
 else{renderer.setClearColor(0x000000,1);renderer.clear()}
 if(mode!=='flat'){if(TINT){g2.fillStyle=TINT;g2.fillRect(0,0,RW,RH)}if(RAIN)rain(t,RAIN);const vg=g2.createRadialGradient(RW/2,RH/2,RH*0.3,RW/2,RH/2,RH*0.95);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');g2.fillStyle=vg;g2.fillRect(0,0,RW,RH)}
 for(const [jt,jn] of TLD.jumps)if(t>=jt&&t<jt+0.9)jump(t-jt,t);
 const d=Math.min(t-a,b-t);if(d<0.1&&a>0){g2.fillStyle=`rgba(0,0,0,${1-d/0.1})`;g2.fillRect(0,0,RW,RH)}
 if(!NOSUB){if(WM)watermark(t);if(k!=='title')subs(t)}
 if(VERT)shortsFrame(t0)};
function shortsFrame(t0){g2.save();g2.textAlign='center';g2.lineJoin='round';g2.fillStyle='rgba(0,0,0,.55)';g2.fillRect(0,0,RW,150);g2.font='900 44px "DejaVu Sans"';g2.lineWidth=8;g2.strokeStyle='#000';g2.strokeText('MA GIẤU RỪNG U MINH',RW/2,70);g2.fillStyle='#ff3a3a';g2.fillText('MA GIẤU RỪNG U MINH',RW/2,70);g2.font='bold 26px "DejaVu Sans"';g2.fillStyle='#fff';g2.fillText('Truyện ma dân gian miền Tây',RW/2,115);
 g2.fillStyle='rgba(0,0,0,.55)';g2.fillRect(0,RH-120,RW,120);g2.font='bold 30px "DejaVu Sans"';g2.fillStyle='#ffd76a';g2.fillText('▶ Xem bản đầy đủ trên kênh',RW/2,RH-70);g2.font='bold 24px "DejaVu Sans"';g2.fillStyle='#fff';g2.fillText('@chuyendongtaykimco',RW/2,RH-32);
 if(SDUR&&t0>SDUR-3.2){const a=sm((t0-(SDUR-3.2))/0.4);g2.globalAlpha=a;g2.fillStyle='#050505';g2.fillRect(0,0,RW,RH);g2.font='900 46px "DejaVu Sans"';g2.fillStyle='#fff';g2.fillText('XEM BẢN ĐẦY ĐỦ',RW/2,RH*0.4);g2.fillText('TRÊN KÊNH',RW/2,RH*0.4+60);g2.fillStyle='#d6242a';g2.beginPath();g2.roundRect(RW/2-230,RH*0.52,460,96,48);g2.fill();g2.font='900 34px "DejaVu Sans"';g2.fillStyle='#fff';g2.fillText('Chuyện Đông Tây Kim Cổ',RW/2,RH*0.52+60);g2.font='bold 28px "DejaVu Sans"';g2.fillStyle='#ffd76a';g2.fillText('Đăng ký để nghe trọn truyện!',RW/2,RH*0.52+160)}g2.restore()}
window.READY=true;

