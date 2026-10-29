import * as THREE from 'three';
const RW=1280,RH=720;
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
 H:[2.0,(T,o)=>hien(256,1000,2.6,Object.assign({t:T},o))],L:[2.0,(T,o)=>loi(256,1000,2.6,Object.assign({t:T},o))],
 BT:[2.0,(T,o)=>batu(256,1000,2.6,Object.assign({t:T},o))],BA:[2.0,(T,o)=>batho(256,1000,2.6,Object.assign({t:T},o))],
 TH:[2.0,(T,o)=>thayBay(256,1000,2.6,o)],NAM:[2.0,(T,o)=>namco(256,1000,2.6,o)],BM:[2.0,(T,o)=>bamuoi(256,1000,2.6,o)],
 G1:[2.0,(T,o)=>namco(256,1000,2.6,Object.assign({shirt:'#4a5a6a',hair:'#222'},o))],G2:[2.0,(T,o)=>woman(256,1000,2.6,Object.assign({shirt:'#6a7a4a'},o))],
 R:[1.15,(T,o)=>ranh(256,1000,3.2,T,o)],R2:[1.15,(T,o)=>ranh(256,1000,3.2,T+1.3,o)],R3:[1.15,(T,o)=>ranh(256,1000,3.2,T+2.1,o)],R4:[1.15,(T,o)=>ranh(256,1000,3.2,T+3.3,o)],R5:[1.15,(T,o)=>ranh(256,1000,3.2,T+4.4,o)],
 KID:[1.15,(T,o)=>kid(256,1000,3.3,o)]};
function cast(scene){const C={};for(const k in DRAW){const [h,fn]=DRAW[k];C[k]=mk(h,fn,false);C[k].visible=false;scene.add(C[k])}
 if(true){for(const k of ['R','R2','R3','R4','R5']){const m=C[k].material;m.emissive=new THREE.Color(0x7aa09a);m.emissiveMap=m.map;m.emissiveIntensity=0.4}}return C}
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
const VBABY=babyMesh();VBABY.position.set(0,-0.5,0);VONG.add(VBABY);
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
const IL={H:lying(()=>hien(256,1010,2.9,{eyes:0.05,closed:true})),BM:lying(()=>bamuoi(256,1010,2.9,{eyes:0.05,closed:true})),L:lying(()=>loi(256,1010,2.9,{eyes:0.05,sick:true})),KID:lying(()=>kid(256,1010,3.6,{eyes:0.05}),1.1)};for(const k in IL)inn.add(IL[k]);
const IB=[babyMesh(),babyMesh()];IB.forEach(b=>inn.add(b));
const BLK=new THREE.Mesh(new THREE.CapsuleGeometry(0.3,0.9,6,14),new THREE.MeshStandardMaterial({color:0x5a3a4a,roughness:0.95}));BLK.rotation.z=Math.PI/2;BLK.scale.set(1,1.2,0.75);BLK.castShadow=true;BLK.receiveShadow=true;BLK.visible=false;inn.add(BLK);
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
const waterM=new THREE.MeshStandardMaterial({color:0x2a3a34,roughness:0.12,metalness:0.55});
const water=new THREE.Mesh(new THREE.PlaneGeometry(200,10),waterM);water.rotation.x=-Math.PI/2;water.position.set(0,0.03,16.5);water.receiveShadow=true;ext.add(water);
for(let i=0;i<5;i++)box(0.5,0.06,1.2,M({map:woodT}),2+i*0.0,0.05+i*0.0,11.0+i*0.0,ext);box(0.9,0.08,2.4,M({map:woodT,color:0x8a6a48}),2,0.12,11.6,ext);for(const z of [11.0,12.7])for(const x of [1.6,2.4])cyl(0.05,0.05,1.2,M({color:0x3a2a18}),x,0.2,z,ext,6);
function xuong(){const g=new THREE.Group();const hm=M({map:woodT,color:0x7a5a3a});box(2.6,0.28,0.75,hm,0,0.14,0,g);for(const sd of [-1,1]){const c=new THREE.Mesh(new THREE.ConeGeometry(0.42,1.0,4),hm);c.rotation.z=sd*Math.PI/2;c.rotation.x=Math.PI/4;c.scale.set(1,1,0.45);c.position.set(sd*1.75,0.18,0);c.castShadow=true;g.add(c)}box(2.3,0.04,0.6,M({color:0x2a1e12}),0,0.29,0,g);ext.add(g);return g}
const XUONG=xuong();XUONG.position.set(4.5,0.04,13.2);
// dừa nước dọc bờ, dừa, chuối, tre
for(let i=0;i<26;i++){const x=-38+i*3+R(i)*2;if(Math.abs(x-2)<2.5)continue;flatCard(nipaT,3,3,x,1.4,10.9+R(i+4)*0.6,ext,R(i)*0.6-0.3)}
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
const EL={BT:lying(()=>batu(256,1000,2.4,{eyes:1.0,smile:true})),L:lying(()=>loi(256,1000,2.4,{eyes:1.2,mouth:'o'}))};for(const k in EL)ext.add(EL[k]);
const EB=babyMesh();ext.add(EB);
const ghostL=new THREE.PointLight(0x90ffc0,0,5,2);ext.add(ghostL);
let RAIN=0;
function tod(m){const day=m==='day',dusk=m==='dusk',dawn=m==='dawn',rain=m==='rain';skyM.material.map=day?skyDay:(dusk||dawn)?skyDusk:rain?skyRain:skyNight;skyM.material.needsUpdate=true;moon.visible=!(day||rain);
 sunD.intensity=day?2.6:(dusk||dawn)?1.2:0;sunD.color.set(dusk||dawn?0xffa060:0xfff0d8);moonDir.intensity=day?0:rain?0.8:2.0;hemi.intensity=day?1.3:1.0;hemi.color.set(day?0xc8d8e8:0x3a4a6a);
 ext.fog.color.set(day?0xb8c0b8:(dusk||dawn)?0x6a5050:rain?0x101418:0x1a2638);ext.fog.density=day?0.008:rain?0.05:0.035;HOUSE.userData.wm.color.set(day?0x3a2e20:0xffb860);porchL.intensity=day?0:6;fogS.forEach(f=>f.visible=!day);renderer.toneMappingExposure=day?1.0:1.15;RAIN=rain?1:0}
function graves(n,new2){GRAVES.forEach((g,i)=>{g.m.visible=i<n;g.st.forEach(s=>s.visible=false)})}
function lightIncense(idx){(idx==='all'?[0,1,2,3,4]:idx).forEach(i=>GRAVES[i].st.forEach(s=>s.visible=true))}

// ================= engine =================
const ACT=[];
function put(c,x,z,o,base=0){c.visible=true;c.userData.o=o||{};c.position.set(x,c.userData.h*0.4766+base,z);ACT.push(c);return c}
function lie(m,x,y,z,ry=0,tilt=0.6){m.visible=true;if(typeof BLK!=='undefined'&&y>0.4&&y<0.8){BLK.visible=true;BLK.position.set(x+0.5,y+0.12,z)}m.position.set(x,y+0.44*Math.sin(tilt)*0.9,z);m.rotation.set(-Math.PI/2+tilt,0,Math.PI/2+ry);return m}
let SI=0;
function siOf(lt,ls){let s=0;for(let i=0;i<ls.length;i++)if(lt>=ls[i]-0.05)s=i;return s}
function cams(lt,ls,list,D){const si=siOf(lt,ls);const c=list[si%list.length];const t0=si===0?0:ls[si],t1=si+1<ls.length?ls[si+1]:D;const p=sm((lt-t0)/Math.max(0.5,t1-t0));
 const [P,L,f,dP,dL]=c;cam.fov=f||40;cam.position.set(P[0]+(dP?dP[0]*p:0),P[1]+(dP?dP[1]*p:0),P[2]+(dP?dP[2]*p:0));cam.lookAt(L[0]+(dL?dL[0]*p:0),L[1]+(dL?dL[1]*p:0),L[2]+(dL?dL[2]*p:0));return si}
function talk(lt,on=true){return on&&Math.sin(lt*13)>0?'o':undefined}
// người nói trong câu si (để mấp máy môi)
function spk(si){return (TLD.spk||[])[SI_BASE+si]}
let SI_BASE=0;
function flat2(fn,...a){const old=ctx;ctx=flat.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.save();fn(...a);ctx.restore();ctx=old;g2.drawImage(flat,0,0,RW,RH);return 'flat'}
function resetAll(t){for(const c of ACT)c.visible=false;ACT.length=0;for(const k in C)C[k].visible=false;for(const k in CI)CI[k].visible=false;
 for(const k in IL)IL[k].visible=false;BLK.visible=false;for(const k in EL)EL[k].visible=false;EB.visible=false;IB.forEach(b=>b.visible=false);VBABY.visible=false;
 bowls(3);COFFIN.visible=false;NET.visible=true;MAT.visible=false;HOLE.visible=false;OFFER.visible=false;graves(5);graveL.intensity=0;ghostL.intensity=0;innG.intensity=0;DEADCHK.visible=false;rvL.intensity=0;bthL.intensity=0;doorL.intensity=0;
 VONG.rotation.x=0;ALT.visible=true;lampG.position.set(2.3,0.78,1.0);STOOL.visible=false;XUONG.position.set(4.5,0.04,13.2);XUONG.rotation.set(0,0,0);XUONG2.rotation.set(0,0,0);RAIN=0;TINT=null;moonL.color.set(0x8fb0ff);
 const fl=1+Math.sin(t*13)*0.08+Math.sin(t*7.3)*0.06+Math.sin(t*23)*0.04;lampL.intensity=14*fl;lampG.userData.fl.scale.set(1,1.8*fl,1);lampL.position.set(lampG.position.x,lampG.position.y+0.27,lampG.position.z)}
let TINT=null;
function rain(t,a=1){g2.save();g2.strokeStyle='rgba(190,205,225,.35)';g2.lineWidth=1.4;for(let i=0;i<260;i++){const x=(R(i)*RW*1.2+t*90)%(RW*1.2)-60,y=(R(i+7)*RH+t*1300*(0.8+R(i)*0.4))%(RH+80)-40;g2.beginPath();g2.moveTo(x,y);g2.lineTo(x-7,y+26);g2.stroke()}g2.restore()}
function subs(t){for(const [a,b,str,sp] of TLD.subs){if(t<a||t>=b)continue;const al=Math.min(sm((t-a)/0.12),sm((b-t)/0.12));g2.save();g2.globalAlpha=al;g2.textAlign='center';g2.lineJoin='round';g2.font='bold 40px "DejaVu Sans"';
 const ws=str.split(' ');const L=[];let c='';for(const w of ws){const tt=c?c+' '+w:w;if(g2.measureText(tt).width>1080&&c){L.push(c);c=w}else c=tt}if(c)L.push(c);const lh=52;const y0=662-(L.length-1)*lh;
 const fem=['H','BT','BA','BE'].includes(sp);const col=sp.startsWith('G')?'#ff5050':fem?'#ff9a9a':sp==='N'?'#ffffff':'#ffd76a';
 L.forEach((l,i)=>{g2.lineWidth=9;g2.strokeStyle='#000';g2.strokeText(l,RW/2,y0+i*lh);g2.fillStyle=col;g2.fillText(l,RW/2,y0+i*lh)});g2.restore()}}
function watermark(t){const k=Math.floor(t/6)%4;const pos=[[0.5,0.42],[0.76,0.18],[0.26,0.66],[0.7,0.56]][k];g2.save();g2.globalAlpha=0.16;g2.font='bold 28px "DejaVu Sans"';g2.textAlign='center';g2.translate(RW*pos[0],RH*pos[1]);g2.rotate(-0.08);g2.fillStyle='#ffffff';g2.strokeStyle='rgba(0,0,0,.6)';g2.lineWidth=3;g2.strokeText('@chuyendongtaykimco',0,0);g2.fillText('@chuyendongtaykimco',0,0);g2.restore()}
function jump(dt,t){const k=1-sm(dt/0.15);const sc=1+0.4*k;const sh=dt<0.5?1:0.3;const sx=(Math.random()-0.5)*40*sh,sy=(Math.random()-0.5)*40*sh;
 const old=ctx;ctx=flat.getContext('2d');ctx.setTransform(1,0,0,1,0,0);jumpFace(dt,t);ctx=old;
 g2.save();g2.translate(RW/2+sx,RH/2+sy);g2.scale(sc,sc);g2.drawImage(flat,-RW/2,-RH/2,RW,RH);g2.restore();g2.fillStyle='rgba(120,0,0,.15)';g2.fillRect(0,0,RW,RH);if(dt<0.07){g2.fillStyle='rgba(255,255,255,.85)';g2.fillRect(0,0,RW,RH)}}
function hookText(a,l1,l2){g2.save();g2.globalAlpha=a;g2.textAlign='center';g2.lineJoin='round';g2.font='900 50px "DejaVu Sans"';g2.lineWidth=10;g2.strokeStyle='#000';g2.strokeText(l1,RW/2,90);g2.fillStyle='#fff';g2.fillText(l1,RW/2,90);g2.font='900 70px "DejaVu Sans"';g2.strokeText(l2,RW/2,170);g2.fillStyle='#ff2a2a';g2.fillText(l2,RW/2,170);g2.restore()}
const S={};

const m=(code,si,lt)=>spk(si)===code?talk(lt):undefined;
const IN=(md)=>{innMode(md);return 'inn'};
// ---------- MỞ ĐẦU ----------
S.hook=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);NET.visible=false;lampAt(-1.4,0.1);if(si===0)put(CI.H,-2.4,-0.85,{sit:true,baby:true,eyes:0.8,tear:true,look:0.2});
 if(si===1){VONG.rotation.x=Math.sin(T*1.6)*0.25}
 cams(lt,ls,[[[-0.6,1.4,2.6],[-2.4,1.05,-0.85],34,[-0.3,0,-0.4]],[[1.4,1.4,3.4],[0.3,1.0,0.6],38,[-0.2,0,-0.5]]],D);if(si===1){/* võng trống đưa */}return 'inn'};
S.hook2=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);graves(5);lightIncense([3,4]);graveL.intensity=2.5;put(C.R,1.8,-9.9,{crouch:si===1,beckon:si===0});ghostL.position.set(1.8,1,-9.4);ghostL.intensity=3;
 cams(lt,ls,[[[3.5,1.3,-5.5],[1.2,0.6,-10.5],40,[-0.6,0,-0.6]],[[1.0,1.0,-7.6],[1.8,0.5,-10.5],38,[0.2,0,-0.4]]],D);return 'ext'};
S.hook3=(lt,D,T,ls)=>{tod('night');put(C.R,2.0,11.9,{beckon:true});ghostL.position.set(2,1.2,12.3);ghostL.intensity=2;cams(lt,ls,[[[-4,1.6,20.5],[1,1.4,6],40,[2,0,-1]],[[4,1.2,15.5],[2,1.0,11.8],36,[-0.6,0,-0.6]]],D);return 'ext+'};
S.title=(lt,D,T)=>flat2(F.title,lt,D,T);
S.cta0=(lt,D,T)=>flat2(F.cta,lt,D,T,false);
S.ctamid=(lt,D,T)=>flat2(F.cta,lt,D,T,false);
S.cta=(lt,D,T)=>flat2(F.cta,lt,D,T,true);
S.chap1=(lt,D,T)=>flat2(F.chap,lt,D,T,'MỘT','Dấu chàm trên vai');
S.chap2=(lt,D,T)=>flat2(F.chap,lt,D,T,'HAI','Đứa thứ hai');
S.chap3=(lt,D,T)=>flat2(F.chap,lt,D,T,'BA','Đêm bên bụi tre');
S.chap4=(lt,D,T)=>flat2(F.chap,lt,D,T,'BỐN','Món nợ ba mươi năm');
S.chap5=(lt,D,T)=>flat2(F.chap,lt,D,T,'NĂM','Người trả nợ');
// ---------- CHƯƠNG 1 ----------
S.xom=(lt,D,T,ls)=>{tod('day');XUONG.position.x=4.5-lt*0.25;put(C.G1,XUONG.position.x,13.2,{oar:true,armA:[null,-0.6]},0.3);put(C.G2,-3.4,6,{});
 cams(lt,ls,[[[-14,5,26],[0,1.5,8],42,[6,-1,-2]],[[8,2.2,19],[0,1.5,3],40,[-3,0,-1]],[[-1,1.7,9.5],[-8,1.6,7.5],40,[0.5,0,-0.5]]],D);return 'ext'};
S.cuoi=(lt,D,T,ls)=>{tod('day');put(C.H,0.1,6.2,{wed:true,eyes:1,happy:true});put(C.L,0.9,6.2,{wed:true});put(C.BT,-1.4,6.6,{});put(C.NAM,2.4,6.9,{});put(C.BA,-2.4,7.2,{});put(C.G2,3.4,7.4,{});
 cams(lt,ls,[[[0.5,1.6,11.5],[0.4,1.3,6],38,[0,0,-1.2]],[[2.6,1.5,9.2],[0.5,1.4,6.2],34,[-0.4,0,-0.3]],[[-1.6,1.7,9.6],[0.8,1.3,6.4],38,[0.6,0,-0.6]]],D);return 'ext'};
const muoiRoom=(lt,T,o)=>{innMode('night');ALT.visible=false;NET.visible=false;lie(IL.BM,-3.15,0.53,-1.4);put(CI.H,-2.3,-0.85,Object.assign({sit:true,eyes:1},o||{}));lampAt(-1.5,-0.2)};
S.cuoi2=(lt,D,T,ls)=>{muoiRoom(lt,T,{tear:true});cams(lt,ls,[[[-0.6,2.2,2.2],[-3.0,0.6,-1.6],40,[-0.3,0,-0.3]]],D);return 'inn'};
S.mamuoi=(lt,D,T,ls)=>{const si=siOf(lt,ls);muoiRoom(lt,T,{tear:si>=2,eyes:si===1?1.2:1});cams(lt,ls,[[[-1.5,1.9,1.4],[-3.3,0.7,-1.7],36,[-0.2,0,-0.2]],[[-2.2,1.4,1.4],[-2.4,1.1,-0.9],34],[[-0.4,2.4,2.6],[-3.2,0.6,-1.7],40],[[-1.5,2.6,1.0],[-3.4,0.5,-1.8],44,[0.3,0.2,0.2]]],D);return 'inn'};
S.nhangay=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);put(CI.BT,1.4,0.9,{mouth:m('BT',si,lt)});put(CI.H,0.5,1.0,{mouth:m('H',si,lt),eyes:si===2?0.6:1,happy:true});
 cams(lt,ls,[[[1.0,1.5,5.2],[1.0,1.1,0.8],38,[0,0,-0.6]],[[0.0,1.5,3.6],[1.4,1.4,0.9],32],[[2.0,1.5,3.6],[0.5,1.4,1.0],32],[[1.2,1.5,3.8],[1.4,1.4,0.9],30],[[0.8,1.7,4.4],[0.2,1.3,-2.6],40]],D);return 'inn'};
S.bantho=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);put(CI.H,-0.5,-1.5,{back:si===0,mouth:m('H',si,lt)});put(CI.BT,0.6,-1.4,{back:si===0,mouth:m('BT',si,lt),arm:si===3?[undefined,-0.3]:undefined});
 cams(lt,ls,[[[0.3,1.8,1.6],[0.3,1.2,-2.9],38,[0,-0.1,-0.5]],[[0.8,1.5,0.2],[-0.5,1.45,-1.5],30],[[-0.6,1.5,0.2],[0.6,1.45,-1.4],30],[[1.4,1.4,0.5],[0.4,1.2,-2.4],40]],D);return 'inn'};
S.bau=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.H,-0.4,6.0,{belly:true,happy:true});put(C.BT,0.6,6.1,{});if(si===1)put(C.BA,-1.6,6.9,{});cams(lt,ls,[[[1,1.6,11],[0,1.3,5.5],38,[0,0,-1]],[[-3.5,1.5,10],[-0.8,1.3,6.2],36]],D);return 'ext'};
const birth=(lt,T,si,o={})=>{innMode('night');NET.visible=false;lie(IL.H,-3.15,0.53,-1.4);put(CI.BA,-2.0,-0.55,Object.assign({mouth:m('BA',si,lt)},o));lampAt(-1.6,0.0);RAIN=0.6};
S.sanh=(lt,D,T,ls)=>{const si=siOf(lt,ls);birth(lt,T,si,si===2?{stand:true,baby:true}:{});cams(lt,ls,[[[-4.0,1.6,1.8],[-2.8,0.9,-1.2],40,[0.3,0,-0.2]],[[-1.0,2.0,1.6],[-2.8,0.8,-1.3],38],[[-0.8,1.5,1.8],[-2.2,1.2,-0.6],34]],D);return 'inn'};
S.sanh2=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===1)return flat2(F.be,lt-ls[1],ls[2]-ls[1],T,{look:0.2});birth(lt,T,si,{stand:true,baby:true,eyes:si===3?1.3:1});cams(lt,ls,[[[-0.8,1.5,1.8],[-2.2,1.2,-0.6],34],[],[[-0.6,1.6,2.0],[-2.2,1.25,-0.6],32],[[-1.2,1.4,1.6],[-2.0,1.3,-0.55],30]],D);return 'inn'};
S.vongngay=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);VBABY.visible=si<2;VONG.rotation.x=Math.sin(T*1.4)*0.08;
 if(si===0||si===1){put(CI.H,1.4,1.5,{happy:true});put(CI.BT,-0.8,1.6,{})}
 if(si===2){put(CI.BT,0.6,1.4,{baby:true,mouth:'o',eyes:1.3})}
 if(si>=3){put(CI.L,0.2,1.5,{hold:true,mouth:m('L',si,lt),look:-0.5});put(CI.H,1.2,1.6,{baby:true,mouth:m('H',si,lt),flipb:true});VBABY.visible=false}
 if(si===2){CI.BT.userData.o.arm=[-0.95,0.95]}
 cams(lt,ls,[[[0.3,1.6,4.8],[0.3,1.1,0.8],40,[0,0,-0.6]],[[0.6,1.6,4.4],[0.4,1.1,0.9],36],[[0.6,1.5,4.0],[0.6,1.4,1.4],30],[[0.0,1.5,4.0],[0.3,1.45,1.5],30],[[1.6,1.5,4.0],[1.0,1.45,1.6],30]],D);return 'inn'};
S.vongdem=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);VBABY.visible=true;VONG.rotation.x=Math.sin(T*1.5)*0.2;lampAt(1.3,2.2);
 put(CI.H,0.5,1.45,{sit:true,eyes:si===2?0.05:0.9,tilt:si===2?0.25:0,mouth:m('H',si,lt),arm:[undefined,-1.0]});
 cams(lt,ls,[[[1.8,1.4,4.4],[0.4,1.0,0.8],38,[-0.3,0,-0.5]],[[-1.2,1.3,3.4],[0.4,1.1,1.0],34],[[0.6,2.2,3.6],[0.4,0.8,0.8],40,[0,-0.2,-0.4]]],D);return 'inn'};
S.vongdem2=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);VBABY.visible=true;VONG.rotation.x=Math.sin(T*1.5)*0.2;lampAt(1.3,2.2);lampL.intensity*=0.6;
 if(si===1)return flat2(F.be,lt-ls[1],ls[2]-ls[1],T,{grin:0.9,look:1,dead:true});
 if(si<3)put(CI.H,0.5,1.45,{sit:true,eyes:si===0?0.6:1.3,mouth:m('H',si,lt),arm:[undefined,-1.0]});if(si===2)put(CI.R,3.3,-2.0,{crouch:true,a:0.9,calm:true});
 cams(lt,ls,[[[-1.4,1.5,3.4],[0.3,1.0,0.6],36,[0.2,0,-0.3]],[],[[0.0,1.4,3.6],[0.7,1.1,1.2],32],[[1.6,1.3,0.4],[3.6,0.7,-2.4],40,[0.2,0,-0.4]]],D);return 'inn'};
S.chet=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);NET.visible=false;put(CI.H,-2.4,-0.85,{sit:true,baby:true,tear:si>=1,mouth:m('H',si,lt),eyes:si===2?1.2:0.9});if(si>=1)put(CI.L,-1.4,-0.4,{look:-1});lampAt(-1.5,0.0);
 cams(lt,ls,[[[-0.6,1.4,3.0],[-2.4,1.1,-0.85],34,[0,0,-0.4]],[[-1.0,1.4,2.2],[-2.0,1.2,-0.7],34],[[-2.0,1.3,1.4],[-2.4,1.25,-0.85],28]],D);return 'inn'};
S.chet2=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si<=1)return flat2(F.be,lt,si===0?ls[1]:D,T,{dead:true,grin:0.5,look:0});innMode('night');NET.visible=false;put(CI.BA,-1.5,-0.5,{mouth:m('BA',si,lt),look:1});put(CI.H,-2.4,-0.85,{sit:true,baby:true,dead:true,tear:true});
 cams(lt,ls,[[],[],[[-0.6,1.5,2.4],[-1.6,1.3,-0.5],32]],D);return 'inn'};
S.chet2b=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);NET.visible=false;COFFIN.visible=true;put(CI.H,-2.6,-0.75,{sit:true,eyes:0.6,tear:true,mouth:m('H',si,lt),arm:[-0.6,0.6]});if(si>=2)put(CI.L,-1.5,-0.5,{mouth:m('L',si,lt),look:-1});
 cams(lt,ls,[[[-1.2,1.8,2.4],[-3.0,0.7,-1.5],38,[-0.3,0,-0.3]],[[-1.8,1.3,1.6],[-2.6,1.0,-0.8],32],[[-0.4,1.5,2.4],[-1.5,1.4,-0.5],30],[[-1.4,1.5,1.8],[-2.6,1.2,-0.75],30]],D);return 'inn'};
S.batho=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);put(C.BA,-0.2,4.4,{mouth:m('BA',si,lt),look:1});put(C.BT,0.9,4.4,{mouth:m('BT',si,lt),eyes:si>=4?1.2:1,look:-1});
 cams(lt,ls,[[[0.4,1.6,9],[0.3,1.3,4.4],38,[0,0,-1]],[[1.8,1.6,7.2],[-0.2,1.5,4.4],28],[[-1.2,1.6,7.2],[0.9,1.5,4.4],28]],D);return 'ext'};
S['dauchàm']=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);NET.visible=false;if(si===1)return flat2(F.vai,lt-ls[1],ls[2]-ls[1],T,'dead');
 IB[0].visible=true;IB[0].position.set(-2.7,0.62,-1.4);put(CI.BA,-2.5,-0.75,{sit:true,arm:[undefined,-1.3],look:-1});if(si>=2){put(CI.H,-2.0,0.6,{mouth:m('H',si,lt),eyes:1.2,tear:true})};if(si>=2)put(CI.BT,-1.45,0.8,{mouth:m('BT',si,lt),arm:[-0.9,undefined]});
 lampAt(-1.5,0.1);
 cams(lt,ls,[[[-0.8,2.0,1.8],[-2.7,0.6,-1.4],38,[0,-0.1,-0.1]],[],[[-2.4,1.5,3.6],[-1.75,1.4,0.7],32],[[-1.0,1.5,3.4],[-1.75,1.4,0.7],30],[[-2.6,1.5,3.2],[-1.6,1.45,0.8],28],[[-1.0,1.8,3.6],[-2.2,1.0,-0.6],40]],D);return 'inn'};
S.moday=(lt,D,T,ls)=>{tod('dusk');const si=siOf(lt,ls);graves(4);lightIncense([3]);put(C.H,0.4,-8.6,{mouth:m('H',si,lt),tear:true});put(C.BT,1.5,-8.4,{mouth:m('BT',si,lt),look:-1});put(C.L,-0.6,-8.3,{});
 cams(lt,ls,[[[0.6,1.6,-4.5],[0.6,0.7,-10.6],38,[0,0,-0.8]],[[0.6,1.2,-9.0],[0.6,0.4,-11],40],[[1.5,1.5,-6.6],[0.4,1.45,-8.6],30],[[-0.6,1.5,-6.6],[1.5,1.45,-8.4],30]],D);return 'ext'};
S.modem=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);graves(4);put(C.L,3.4,-4.0,{eyes:si>=1?1.3:1,mouth:m('L',si,lt),back:si===0});put(C.R,1.8,-10.2,{crouch:true,dig:si<3,back:si<3,calm:false});ghostL.position.set(1.8,0.8,-9.6);ghostL.intensity=1.5;
 cams(lt,ls,[[[5.2,1.9,-3.0],[1.8,0.6,-10.5],38,[-0.2,0,-0.5]],[[2.2,1.5,-6.0],[3.4,1.45,-4.0],32],[[2.4,1.2,-6.4],[1.8,0.5,-10.2],34,[0,0,-0.8]],[[1.9,0.8,-8.4],[1.8,0.55,-10.2],30,[0,0,-0.5]]],D);return 'ext'};
S.jump1=(lt,D,T,ls)=>{tod('night');graves(4);lie(EL.L,3.0,0.04,-4.4,0.3,0.3);cams(lt,ls,[[[2.0,2.2,-6.6],[3.0,0.2,-4.4],40,[0,0.2,0]]],D);return 'ext'};
S.modem2=(lt,D,T,ls)=>{tod('night');graves(4);HOLE.visible=true;put(C.L,0.6,-8.8,{lamp:true,eyes:1.3});put(C.BT,2.4,-8.6,{});put(C.H,1.4,-8.0,{eyes:1.2});rvL.position.set(0.4,1.4,-8.6);rvL.intensity=4;
 cams(lt,ls,[[[1.4,2.0,-4.8],[1.4,0.8,-10.2],38,[0,0,-0.8]],[[1.9,1.2,-9.4],[1.8,0.3,-10.8],34,[0,-0.1,-0.2]]],D);return 'ext'};
S.sangmo=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);graves(4);OFFER.visible=si>=1;lightIncense([2]);if(si!==1&&si!==4)put(C.BT,-0.5,-9.0,{hoe:si===0,mouth:m('BT',si,lt)});put(C.L,1.1,-8.7,{mouth:m('L',si,lt),look:-1});
 cams(lt,ls,[[[0.6,1.6,-5],[0,0.7,-10],38,[0,0,-0.6]],[[0.5,0.9,-8.4],[-0.6,0.35,-10.5],36],[[-1.4,1.5,-6.6],[1.1,1.45,-8.7],30],[[2.0,1.5,-6.6],[-0.5,1.45,-9.0],30],[[0.3,1.0,-8.6],[-0.6,0.35,-10.55],30,[0,0,-0.3]]],D);return 'ext'};
// ---------- CHƯƠNG 2 ----------
const newborn=(lt,T,si,o)=>{innMode('night');NET.visible=false;lie(IL.H,-3.15,0.53,-1.4);put(CI.BA,-2.3,-0.5,Object.assign({baby:true,mouth:m('BA',si,lt)},o||{}));lampAt(-1.6,0.1)};
S.bau2=(lt,D,T,ls)=>{const si=siOf(lt,ls);newborn(lt,T,si);cams(lt,ls,[[[-0.4,1.8,2.4],[-2.8,0.9,-1.2],38,[-0.3,0,-0.4]],[[-1.2,1.5,1.6],[-2.3,1.35,-0.5],32]],D);return 'inn'};
S.vai=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si<2)return flat2(F.vai,lt,ls[2],T,'baby');newborn(lt,T,si,{eyes:1.3});cams(lt,ls,[[],[],[[-1.2,1.5,1.6],[-2.3,1.4,-0.5],30]],D);return 'inn'};
S.vai2=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);NET.visible=false;put(CI.H,-2.4,-0.85,{sit:true,baby:true,mouth:m('H',si,lt),eyes:1});put(CI.BT,-0.75,0.85,{eyes:1.2,tilt:-0.08});
 cams(lt,ls,[[[-1.0,1.4,2.2],[-2.4,1.1,-0.85],32],[[-1.6,1.3,1.4],[-2.4,1.2,-0.85],28],[[0.4,1.5,3.4],[-0.75,1.4,0.85],30]],D);return 'inn'};
S.ten2=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===3){innMode('night');put(CI.BT,0.1,-2.1,{back:true});bowls(3);altL.intensity=2;cams(lt,ls,[[],[],[],[[0.8,1.5,0.4],[0.1,1.2,-2.6],38,[0,0,-0.4]]],D);return 'inn'}
 innMode('day');put(CI.H,0.4,1.0,{baby:true,mouth:m('H',si,lt)});put(CI.BT,1.4,1.0,{mouth:m('BT',si,lt),eyes:1.2});
 cams(lt,ls,[[[0.9,1.5,4.8],[0.9,1.2,1.0],36,[0,0,-0.5]],[[0.0,1.5,3.6],[1.4,1.4,1.0],30],[[2.0,1.5,3.6],[0.4,1.4,1.0],30]],D);return 'inn'};
S.lai=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);VBABY.visible=true;put(CI.BT,1.7,1.3,{mouth:m('BT',si,lt),eyes:si>=2?1.2:1});if(si>=2)put(CI.L,-0.9,1.4,{mouth:m('L',si,lt)});
 if(si===1)return flat2(F.be,lt-ls[1],ls[2]-ls[1],T,{look:1});
 cams(lt,ls,[[[0.3,1.8,3.0],[0.3,0.95,0.6],36,[0,-0.1,-0.3]],[],[[0.2,1.5,4.2],[1.7,1.4,1.3],30],[[1.4,1.5,4.0],[-0.9,1.4,1.4],30],[[0.6,1.5,4.0],[1.7,1.45,1.3],28]],D);return 'inn'};
S.xom2=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);CHK.forEach(c=>c.visible=si!==1);
 if(si===2){put(C.KID,15,5.5,{eyes:0.4,sit:true});put(C.NAM,16.2,5.8,{look:-1})}
 if(si===1){DEADCHK.visible=true}
 cams(lt,ls,[[[-6,2.5,16],[0,1.2,4],40,[3,0,-1]],[[13.2,1.0,6.8],[14.2,0.3,5.4],34],[[14,1.4,9],[15.5,0.9,5.6],34,[0,0,-0.6]]],D);return 'ext'};
S.namco=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.NAM,1.2,6.2,{mouth:m('NAM',si,lt),armUp:si===0?1:0,wave:T*3,look:-1});put(C.H,0.0,6.0,{baby:true,mouth:m('H',si,lt)});if(si===4)C.NAM.position.x=lerp(1.2,8,seg(lt,ls[4],D));
 cams(lt,ls,[[[-0.6,1.5,9.6],[1.2,1.45,6.2],30],[[1.9,1.5,9.4],[0.0,1.45,6.0],30],[[-1.2,1.5,9.8],[1.2,1.45,6.2],28],[[0.6,1.6,11],[0.6,1.3,6],38],[[0.6,1.7,12],[3,1.2,6],40]],D);return 'ext'};
S.matlai=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);VONG.rotation.x=Math.sin(T*1.2)*0.06;
 if(si===4)return flat2(F.lung,lt-ls[4],ls[5]-ls[4],T);
 if(si<=2){put(CI.H,0.8,1.8,{eyes:1.3,mouth:m('H',si,lt),look:-1});if(si>=1)put(CI.L,-0.2,1.9,{lamp:true,eyes:1.2})}
 if(si>=3){IB[0].visible=true;IB[0].position.set(2.6,0.1,-2.6);IB[0].rotation.y=Math.PI/2;doorL.intensity=60;put(CI.H,1.8,-1.4,{eyes:1.3,mouth:m('H',si,lt)});put(CI.L,3.3,-1.2,{lamp:true,eyes:1.2,mouth:m('L',si,lt)});if(si===6){CI.H.visible=false;put(CI.BT,0.6,-2.2,{eyes:1.3,look:1})}}
 cams(lt,ls,[[[0.3,1.6,4.6],[0.3,1.0,0.6],38,[0,0,-0.4]],[[1.6,1.5,4.4],[0.6,1.4,1.8],34],[[0.0,1.5,4.2],[0.6,1.2,1.6],38],[[2.4,1.3,-0.6],[2.6,0.2,-2.6],34,[0,0,-0.3]],[],[[3.2,1.5,0.6],[1.8,1.3,-1.4],32],[[2.0,1.5,0.8],[0.6,1.4,-2.2],30,[0,0,-0.3]]],D);return 'inn'};
S.thay=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);VBABY.visible=true;put(CI.TH,si<2?2.8:1.4,si<2?2.2:1.6,{mouth:m('TH',si,lt),tilt:si===1?Math.sin(T*3)*0.08:0,look:-1});put(CI.BT,3.2,0.0,{});
 cams(lt,ls,[[[0.6,1.6,5.6],[2.2,1.3,1.6],38,[0.4,0,-0.6]],[[1.4,1.5,4.6],[2.8,1.45,2.2],30],[[1.4,1.5,4.4],[2.6,1.45,2.0],28],[[2.2,1.5,3.6],[0.3,1.0,0.6],36],[[0.0,1.4,3.4],[0.3,0.95,0.6],30]],D);return 'inn'};
S.thay2=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);VBABY.visible=true;if(si===1)return flat2(F.be,lt-ls[1],ls[2]-ls[1],T,{grin:1,look:0.4});
 put(CI.TH,1.4,1.6,{mouth:m('TH',si,lt),broken:si>=2,eyes:si>=2?1.3:1,look:-1});
 cams(lt,ls,[[[2.4,1.5,3.6],[0.6,1.2,1.0],34],[],[[1.2,1.5,3.4],[1.4,1.2,1.6],30,[0,0,-0.3]],[[0.4,1.5,3.8],[1.4,1.45,1.6],28]],D);return 'inn'};
const hien_out=(lt,si,o={})=>{tod('day');put(C.TH,-0.9,4.5,{mouth:m('TH',si,lt),look:1});put(C.H,0.3,4.6,Object.assign({mouth:m('H',si,lt),look:-1},o));put(C.L,1.6,4.5,{mouth:m('L',si,lt),look:-1});put(C.BT,0.6,3.15,{eyes:1.1})};
S.thaynoi=(lt,D,T,ls)=>{const si=siOf(lt,ls);hien_out(lt,si);if(si>=5)C.BT.userData.o={eyes:1.4,mouth:'o',arm:[0.5,-0.5]};
 cams(lt,ls,[[[0.6,1.6,10],[0.5,1.3,4.4],36,[0,0,-1]],[[1.8,1.6,7.4],[-0.6,1.5,4.5],28],[[-1.2,1.6,7.6],[1.6,1.5,4.5],28],[[1.8,1.6,7.4],[-0.6,1.5,4.5],28],[[-1.6,1.6,7.6],[0.4,1.5,3.6],30],[[1.25,1.6,5.8],[0.6,1.5,3.15],28,[0,0,-0.3]]],D);return 'ext'};
S.cach=(lt,D,T,ls)=>{const si=siOf(lt,ls);hien_out(lt,si,{eyes:si===1?1.3:1});
 cams(lt,ls,[[[1.8,1.6,7.4],[-0.6,1.5,4.5],28],[[-1.0,1.6,7.4],[0.6,1.5,4.6],28],[[1.8,1.6,7.6],[-0.6,1.5,4.5],30],[[0.6,1.7,9.6],[0.3,1.4,4.4],38],[[-0.4,1.6,7.0],[0.6,1.45,4.6],30,[0,0,-0.4]]],D);return 'ext'};
// ---------- CHƯƠNG 3 ----------
const ngo=(o)=>{tod('night');MAT.visible=true;EB.visible=true;EB.position.set(NGO.x+0.4,0.12,NGO.z+0.7);EB.rotation.y=0.3};
S.buitre=(lt,D,T,ls)=>{const si=siOf(lt,ls);ngo();if(si===0)put(C.H,NGO.x+1.2,NGO.z+1.3,{arm:[-0.6,0.6],tear:true});if(si===1||si===2)put(C.TH,NGO.x+2.4,NGO.z+1.8,{mouth:m('TH',si,lt),look:-1});if(si===2)put(C.H,NGO.x+1.4,NGO.z+2.0,{tear:true,look:1});if(si===3){put(C.H,NGO.x+4.0,NGO.z+2.7,{look:-1,eyes:1.2})}
 cams(lt,ls,[[[NGO.x+3,1.4,NGO.z+5],[NGO.x+0.6,0.6,NGO.z+0.8],36,[-0.4,0,-0.6]],[[NGO.x+1.5,1.6,NGO.z+6],[NGO.x+1.4,0.9,NGO.z+1.2],38],[[NGO.x+3.6,1.5,NGO.z+4.6],[NGO.x+2,1.4,NGO.z+1.8],30],[[NGO.x+6.0,1.5,NGO.z+4.4],[NGO.x+3.8,1.3,NGO.z+2.5],34,[0.2,0,-0.3]]],D);return 'ext'};
S.buitre2=(lt,D,T,ls)=>{const si=siOf(lt,ls);ngo();const p=si>=1?sm(seg(lt,ls[1],D)):0;if(si>=1){put(C.R,lerp(NGO.x-0.6,NGO.x-0.1,p),lerp(NGO.z-0.2,NGO.z+0.5,p),{crouch:true,calm:true});ghostL.position.set(NGO.x,0.8,NGO.z+1);ghostL.intensity=2}
 if(si===3)put(C.H,NGO.x+4.0,NGO.z+2.7,{eyes:1.3,mouth:m('H',si,lt),look:-1});
 cams(lt,ls,[[[NGO.x+1.5,1.2,NGO.z+4],[NGO.x,1.6,NGO.z],42,[0,0,-0.4],[0,0.4,0]],[[NGO.x+2.6,1.0,NGO.z+3.4],[NGO.x-0.2,0.5,NGO.z+0.3],36],[[NGO.x+1.2,0.8,NGO.z+2.4],[NGO.x-0.1,0.55,NGO.z+0.5],30,[0,0,-0.3]],[[NGO.x+5.4,1.5,NGO.z+4.2],[NGO.x+4.0,1.45,NGO.z+2.7],30]],D);return 'ext'};
S.buitre3=(lt,D,T,ls)=>{const si=siOf(lt,ls);ngo();put(C.R,NGO.x+0.1,NGO.z+0.65,{crouch:true,calm:si!==1,tilt:0.5});ghostL.position.set(NGO.x,0.8,NGO.z+1.2);ghostL.intensity=2;
 if(si>=2)return flat2(F.be,lt-ls[2],D-ls[2],T,{grin:1.2,look:-1,dead:true});
 cams(lt,ls,[[[NGO.x+1.8,0.9,NGO.z+2.6],[NGO.x+0.2,0.45,NGO.z+0.7],34,[-0.3,0,-0.3]],[[NGO.x+1.0,0.6,NGO.z+1.6],[NGO.x+0.2,0.45,NGO.z+0.7],28,[0,0,-0.2]]],D);return 'ext'};
S.jump2=(lt,D,T,ls)=>{ngo();put(C.H,NGO.x+0.6,NGO.z+1.3,{sit:true,baby:true,eyes:1.3,mouth:'o'},-0.42);EB.visible=false;cams(lt,ls,[[[NGO.x+2.6,1.3,NGO.z+3.6],[NGO.x+0.6,0.9,NGO.z+1.3],32,[-0.3,0,-0.4]]],D);return 'ext'};
S.buitre4=(lt,D,T,ls)=>{const si=siOf(lt,ls);ngo();EB.visible=false;put(C.H,NGO.x+0.6,NGO.z+1.3,{sit:true,baby:true,eyes:1.2,tear:true,mouth:m('H',si,lt)},-0.42);put(C.BA,NGO.x+1.8,NGO.z+1.8,{lamp:true,mouth:m('BA',si,lt),look:-1});rvL.position.set(NGO.x+1.4,1.3,NGO.z+2);rvL.intensity=4;
 if(si===4)return flat2(F.dautay,lt-ls[4],D-ls[4],T);
 cams(lt,ls,[[[NGO.x+3.2,1.5,NGO.z+5],[NGO.x+1.1,0.9,NGO.z+1.5],34,[0,0,-0.6]],[[NGO.x-0.2,1.5,NGO.z+4.6],[NGO.x+1.6,1.3,NGO.z+1.8],36],[[NGO.x+2.4,1.3,NGO.z+4.0],[NGO.x+0.6,0.95,NGO.z+1.3],28],[[NGO.x+2.2,1.5,NGO.z+4.8],[NGO.x+1.2,1.1,NGO.z+1.5],34]],D);return 'ext'};
const rainyRoom=(lt,T,si,o)=>{innMode('night');NET.visible=false;RAIN=0.5;put(CI.H,-2.4,-0.85,Object.assign({sit:true,baby:true,mouth:m('H',si,lt),tear:true},o||{}));lampAt(-1.5,0.0)};
S.chet3=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===4)return flat2(F.be,lt-ls[4],D-ls[4],T,{dead:true,grin:0.5});if(si===3)return flat2(F.be,lt-ls[3],ls[4]-ls[3],T,{look:0});rainyRoom(lt,T,si,{eyes:si===0?1.1:0.8});
 cams(lt,ls,[[[-0.6,1.4,3.0],[-2.4,1.1,-0.85],34,[0,0,-0.4]],[[-1.4,1.3,1.6],[-2.4,1.2,-0.85],28],[[-2.0,1.3,1.2],[-2.4,1.25,-0.85],26]],D);return 'inn'};
S.rach=(lt,D,T,ls)=>{tod('rain');const si=siOf(lt,ls);XUONG2.rotation.z=Math.sin(T*1.7)*0.06;XUONG2.rotation.x=Math.sin(T*1.3)*0.05;put(C.L,RV-0.8,0,{oar:true,armA:[null,-0.6+Math.sin(T*3)*0.3],eyes:si>=2?1.3:1,mouth:m('L',si,lt),lamp:si===2||si===3},0.3);
 rvL.position.set(RV-0.9,1.3,0.3);rvL.intensity=si>=2?5:2;if(si>=2&&si<=4){put(C.R,RV+1.1,0,{back:si===2,crouch:true,calm:si===3},0.3);ghostL.position.set(RV+1.1,1.0,0.4);ghostL.intensity=1.5}
 cams(lt,ls,[[[RV+5,2.0,7],[RV,0.6,0],40,[-1,0,-1]],[[RV+2.6,1.2,3.4],[RV,0.8,0],36],[[RV-2.8,1.6,1.6],[RV+1.1,0.7,0],34,[0,0,-0.3]],[[RV-1.6,1.4,2.2],[RV-0.8,1.6,0],30],[[RV+2.6,1.0,1.4],[RV+1.1,0.75,0],28],[[RV+4,1.8,6],[RV,0.7,0],40]],D);return 'ext'};
S['lóng']=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);NET.visible=false;put(CI.TH,0.4,0.8,{mouth:m('TH',si,lt),look:-1});put(CI.H,-2.4,-0.85,{sit:true,baby:true,dead:true,mouth:m('H',si,lt),eyes:si>=2?1.3:0.9,tear:true});put(CI.BT,1.4,0.6,{});
 cams(lt,ls,[[[1.4,1.5,4.0],[0.4,1.4,0.8],30],[[2.4,1.5,4.2],[0.4,1.45,0.8],28],[[-1.2,1.4,1.8],[-2.4,1.15,-0.85],30],[[-0.4,1.7,2.8],[-2.4,1.0,-0.85],36,[0,0,-0.4]],[[0.8,1.5,3.6],[-0.6,1.2,-0.2],40]],D);return 'inn'};
S['lóng2']=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===1)return flat2(F.tay,lt-ls[1],ls[2]-ls[1],T,'wrap');
 if(si===2){tod('night');XUONG.position.set(lerp(4.5,14,sm(seg(lt,ls[2],ls[3]))),0.04,14.8);put(C.TH,XUONG.position.x,14.8,{oar:true,stick:false,back:true},0.3);cams(lt,ls,[[],[],[[2,1.4,10],[8,1,15],40]],D);return 'ext'}
 innMode('night');NET.visible=false;lie(IL.H,-3.15,0.53,-1.4);
 if(si===0)put(CI.BT,lerp(0.0,-1.8,sm(seg(lt,0,ls[1]))),-0.4,{knife:true,eyes:1.2});
 if(si>=3){IL.H.visible=false;put(CI.H,-2.4,-0.8,{mouth:m('H',si,lt),eyes:1.3,tear:true});put(CI.BT,-1.2,-0.4,{mouth:m('BT',si,lt),tear:si>=4})}
 cams(lt,ls,[[[-0.6,1.8,3.0],[-2.0,0.9,-1.0],40],[],[],[[-0.4,1.5,2.6],[-2.4,1.45,-0.8],28],[[-2.4,1.5,2.2],[-1.2,1.45,-0.4],28],[[-1.0,1.6,3.6],[-1.8,1.3,-0.6],36,[0,0,-0.5]]],D);return 'inn'};
S.mo2=(lt,D,T,ls)=>{tod('dusk');const si=siOf(lt,ls);graves(5);lightIncense([3,4]);put(C.H,0.6,-8.4,{mouth:m('H',si,lt)});put(C.L,1.8,-8.3,{mouth:m('L',si,lt),eyes:si>=5?1.2:1,look:-1});
 cams(lt,ls,[[[0.6,1.7,-4],[0.6,0.6,-10.6],40,[0,0,-0.8]],[[-0.8,1.5,-6.2],[1.0,1.3,-8.6],34],[[2.6,1.5,-6.4],[0.6,1.45,-8.4],28],[[-0.6,1.5,-6.4],[1.8,1.45,-8.3],28],[[-0.6,1.5,-6.4],[1.8,1.45,-8.3],28,[0,0,-0.3]],[[2.6,1.5,-6.4],[0.6,1.45,-8.4],28],[[4.2,1.4,-7.2],[1.2,1.2,-9.6],38,[-0.6,0,0]]],D);return 'ext'};
// ---------- CHƯƠNG 4 ----------
const dream=(lt,T,si,o)=>{innMode('night');lie(IL.H,-3.15,0.53,-1.4);moonL.color.set(0x7aa0ff);TINT='rgba(30,60,120,.18)'};
S.bau3=(lt,D,T,ls)=>{const si=siOf(lt,ls);dream();NET.visible=false;if(si>=1){put(CI.R,-1.75,-1.6,{nofinger:true,wrap:true,calm:true});innG.position.set(-1.6,1.0,-1.0);innG.intensity=3}
 cams(lt,ls,[[[-1.2,2.2,1.6],[-3.2,0.6,-1.8],38,[-0.3,0,-0.3]],[[-1.9,1.3,1.4],[-1.75,0.8,-1.6],32,[0,0,-0.3]],[[-1.2,1.6,2.2],[-2.6,0.8,-1.5],38]],D);return 'inn'};
S.mo3=(lt,D,T,ls)=>{const si=siOf(lt,ls);dream();NET.visible=false;if(si===3){TINT=null;VONG.rotation.x=Math.sin(T*1.4)*0.25;IL.H.visible=false;put(CI.H,-2.4,-0.85,{sit:true,eyes:1.3,look:1});cams(lt,ls,[[],[],[],[[1.4,1.4,4.2],[0.3,1.0,0.6],38,[-0.2,0,-0.4]]],D);return 'inn'}
 put(CI.R,-1.75,-1.6,{nofinger:true,wrap:true,calm:si!==2,beckon:si===0});innG.position.set(-1.6,1.0,-1.0);innG.intensity=3;if(si===1){IL.H.visible=false;put(CI.H,-2.9,-0.85,{sit:true,mouth:m('H',si,lt),eyes:1.3,look:1})}
 cams(lt,ls,[[[-1.9,1.0,1.2],[-1.75,0.8,-1.6],30],[[-1.6,1.4,2.0],[-2.4,1.0,-1.0],34],[[-1.8,0.9,0.4],[-1.75,0.85,-1.6],26,[0,0,-0.2]]],D);return 'inn'};
S.sanh3=(lt,D,T,ls)=>{const si=siOf(lt,ls);newborn(lt,T,si,{eyes:1.2});cams(lt,ls,[[[-0.4,1.8,2.4],[-2.8,0.9,-1.2],38],[[-1.2,1.5,1.6],[-2.3,1.35,-0.5],30,[0,0,-0.2]]],D);return 'inn'};
S.tay=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si<2)return flat2(F.tay,lt,ls[2],T,'scar');newborn(lt,T,si,{eyes:1.3});cams(lt,ls,[[],[],[[-1.2,1.5,1.5],[-2.3,1.4,-0.5],28]],D);return 'inn'};
S.tay2=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);NET.visible=false;
 if(si===0){put(CI.BT,2.6,-2.4,{sit:true,eyes:1.3,mouth:'o'},-0.42);put(CI.BA,-2.5,-0.6,{baby:true});cams(lt,ls,[[[1.6,1.3,0.6],[2.6,0.8,-2.4],34,[0,0,-0.3]]],D);return 'inn'}
 lampAt(-1.5,0.0);put(CI.H,-2.4,-0.85,{sit:true,baby:true,eyes:si===2?0.05:si>=4?1.2:0.8});
 cams(lt,ls,[[],[[-0.8,1.4,2.6],[-2.4,1.1,-0.85],34],[[-1.6,1.25,1.2],[-2.4,1.2,-0.85],28,[0,0,-0.2]],[[-1.9,1.25,0.8],[-2.4,1.25,-0.85],24],[[-0.6,1.6,2.8],[-2.2,1.0,-1.2],38]],D);return 'inn'};
const bathoPorch=(lt,si,o={})=>{tod('day');const bx=-16.4,bz=5.55;put(C.BA,bx,bz,Object.assign({sit:true,mouth:m('BA',si,lt),look:1},o.ba||{}));put(C.H,bx+1.5,bz,Object.assign({sit:true,baby:true,mouth:m('H',si,lt),look:-1},o.h||{}));return [bx,bz]};
const BC=(bx,bz)=>[[[bx+0.75,1.3,bz+4.6],[bx+0.75,0.9,bz],38,[0,0,-0.6]],[[bx+0.2,1.25,bz+2.8],[bx,1.15,bz],28],[[bx+1.3,1.25,bz+2.8],[bx+1.5,1.15,bz],28]];
S.baba=(lt,D,T,ls)=>{const si=siOf(lt,ls);const [bx,bz]=bathoPorch(lt,si,si===0?{h:{sit:false}}:{});cams(lt,ls,BC(bx,bz),D);return 'ext'};
S.momuoi=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.H,FD+0.3,1.2,{sit:si>=1,baby:si===0,mouth:m('H',si,lt),tear:si>=1,back:si===3},si>=1?-0.42:0);
 cams(lt,ls,[[[FD+6,2.2,9],[FD,0.6,0],40,[-2,0,-2]],[[FD+2.4,1.1,3.2],[FD+0.2,0.7,0.6],32],[[FD-1.6,1.0,2.6],[FD+0.3,0.9,1.2],30],[[FD+2.6,1.4,4.2],[FD,0.8,-2],40,[0,0,-0.6]]],D);return 'ext'};
S.baba2=(lt,D,T,ls)=>{const si=siOf(lt,ls);const [bx,bz]=bathoPorch(lt,si);cams(lt,ls,BC(bx,bz).concat([BC(bx,bz)[1]]),D);return 'ext'};
S.hoiky=(lt,D,T,ls)=>{const si=siOf(lt,ls);const [bx,bz]=bathoPorch(lt,si,{h:{eyes:si>=4?1.3:1}});const c=BC(bx,bz);cams(lt,ls,[c[1],c[1],c[1],c[2],[[bx+1.6,1.2,bz+1.8],[bx,1.15,bz],24,[0,0,-0.3]]],D);return 'ext'};
S.twist=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===0)return flat2(F.be,lt,ls[1],T,{look:-1,grin:0.3});const [bx,bz]=bathoPorch(lt,si,{h:{eyes:1.3,tear:true}});const c=BC(bx,bz);cams(lt,ls,[[],c[1],c[2],c[1],c[0],[[bx+0.1,1.25,bz+2.2],[bx,1.2,bz],26]],D);return 'ext'};
S.twist2=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);if(si===2)return flat2(F.vai,lt-ls[2],D-ls[2],T,'adult');lie(IL.L,0.3,1.05,0.6);put(CI.H,1.7,1.3,{baby:true,mouth:m('H',si,lt),eyes:1.2,look:-1});
 cams(lt,ls,[[[-0.8,2.0,3.2],[0.6,1.0,0.8],38],[[0.2,2.2,2.6],[0.6,1.0,0.7],34]],D);return 'inn'};
S.jump3=(lt,D,T,ls)=>flat2(F.tay,lt,D,T,'black');
// ---------- CHƯƠNG 5 ----------
const confront=(lt,si,o={})=>{innMode('night');put(CI.H,0.0,1.0,Object.assign({baby:true,mouth:m('H',si,lt),eyes:1.1},o.h||{}));put(CI.BT,1.2,1.0,Object.assign({mouth:m('BT',si,lt)},o.bt||{}))};
S.doi=(lt,D,T,ls)=>{const si=siOf(lt,ls);confront(lt,si,{bt:{eyes:si===2?1.3:1}});cams(lt,ls,[[[0.6,1.5,5],[0.6,1.2,1.0],36,[0,0,-0.6]],[[1.9,1.5,3.6],[0.0,1.45,1.0],28],[[-0.6,1.5,3.6],[1.2,1.45,1.0],28],[[1.9,1.5,3.6],[0.0,1.45,1.0],28]],D);return 'inn'};
S.doi2=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===0){confront(lt,si,{bt:{eyes:1.2}});return (cams(lt,ls,[[[0.2,1.4,2.8],[0.0,1.3,1.0],30]],D),'inn')}
 confront(lt,si,{bt:{sit:true,tear:true,arm:[-0.8,0.8]}});CI.BT.position.x=0.6;CI.BT.position.z=1.3;if(si===4)put(CI.L,-1.0,0.4,{sick:true,eyes:1.2,mouth:'o',tilt:0.1});
 cams(lt,ls,[[],[[1.6,1.1,3.4],[0.6,0.9,1.3],30],[[-0.4,1.0,3.2],[0.6,0.85,1.3],28],[[1.2,1.6,3.6],[0.3,1.0,1.1],34],[[0.6,1.5,3.6],[-1.0,1.4,0.4],30]],D);return 'inn'};
S.goi=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);if(si<=1){lie(IL.L,0.3,1.05,0.6);VONG.rotation.x=Math.sin(T*1.1)*0.05}else{put(CI.L,0.3,1.6,{sick:true,eyes:1.3,mouth:m('L',si,lt),look:1})}
 put(CI.H,1.7,1.1,{sit:true,fan:si<2,mouth:m('H',si,lt),eyes:si>=3?1.3:0.9,look:-1});
 cams(lt,ls,[[[-0.8,2.0,3.4],[0.6,0.9,0.8],38],[[-0.2,1.5,3.6],[1.2,1.0,1.0],32],[[0.4,1.5,4.2],[0.3,1.45,1.6],30,[0,0,-0.4]],[[2.0,1.5,4.0],[1.0,1.2,1.2],30],[[-0.4,1.5,3.8],[0.9,1.3,1.3],30]],D);return 'inn'};
S.goi2=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);const lz=si===0?lerp(7.5,11.3,sm(seg(lt,0,ls[1]))):si===1?lerp(12.0,14.2,sm(seg(lt,ls[1],ls[2]))):si<=3?14.2:lerp(14.2,11.6,sm(seg(lt,ls[4],ls[5])));
 const ly=lz>11.5?-Math.min(1.25,(lz-11.5)*0.6):0;put(C.L,2.0,lz,{sick:true,eyes:0.5,back:si<=1,look:0},ly);
 if(si>=1&&si<=4){put(C.R,2.2,16.6,{beckon:true,calm:si===1});ghostL.position.set(2.2,1,16.2);ghostL.intensity=3}
 if(si>=1)put(C.H,si>=4?2.5:2.6,si>=4?lz+0.3:11.4,{mouth:m('H',si,lt),eyes:1.3,arm:si>=4?[undefined,-1.4]:undefined},si>=4?ly*0.6:0);
 cams(lt,ls,[[[3.4,1.8,5.2],[2,1.0,12],40,[0,0,1.5]],[[-1,1.4,9.2],[2.2,0.9,15.5],36],[[-0.6,1.3,10.2],[2.2,0.9,16.4],30],[[4.4,1.3,10],[2.4,0.9,13.6],32],[[-0.6,1.5,9],[2.2,0.8,12.8],34],[[3.6,1.0,15.4],[2.2,0.9,16.6],34,[0,0,-0.6]]],D);return 'ext'};
S.thay3=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);VBABY.visible=true;VONG.rotation.x=Math.sin(T*1.3)*0.06;put(CI.TH,-1.0,1.4,{mouth:m('TH',si,lt),look:1});put(CI.BT,1.6,1.5,{mouth:m('BT',si,lt),arm:si===2?[-1.2,1.2]:undefined});put(CI.H,2.4,1.9,{});put(CI.L,-1.8,1.9,{sick:true});
 if(si===5)return flat2(F.be,lt-ls[5],D-ls[5],T,{grin:1.1,look:0.5,dead:true});
 cams(lt,ls,[[[0.3,1.6,5.6],[0.3,1.2,1.2],38,[0,0,-0.6]],[[0.4,1.5,4.2],[-1.0,1.45,1.4],28],[[-0.4,1.5,4.2],[1.6,1.45,1.5],28],[[0.6,1.5,4.2],[-1.0,1.45,1.4],26],[[0.4,1.5,4.2],[-1.0,1.45,1.4],26,[0,0,-0.4]]],D);return 'inn'};
S.tra=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);graves(5);const p=sm(lt/D);put(C.BT,lerp(2.6,1.2,p),lerp(-3.6,-8.2,p),{back:true,incense:true});if(si===1)put(C.H,3.6,-4.0,{baby:true,eyes:1.2,look:-1});
 cams(lt,ls,[[[6.4,1.6,-5.4],[1.6,0.9,-8.5],40,[0,0,-0.6]],[[6.0,1.5,-7.0],[3.6,1.3,-4.0],36]],D);return 'ext'};
S.tra2=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);graves(5);lightIncense('all');graveL.intensity=2;put(C.BT,0.6,-8.6,{sit:true,back:si===0,incense:si===0,mouth:m('BT',si,lt),tear:true},-0.42);
 cams(lt,ls,[[[0.6,1.4,-5.2],[0.6,0.6,-10.4],36,[0,0,-0.6]],[[2.4,1.0,-10.6],[0.6,1.0,-8.6],30],[[-0.9,1.0,-10.2],[0.6,1.0,-8.6],28]],D);return 'ext'};
const ghosts=(n,p,lead)=>{const K=['R','R2','R3','R4','R5'];for(let i=0;i<n;i++){const g=GRAVES[i];const k=K[i];put(C[k],g.x,g.z+0.6,{crouch:p<0.5,calm:i!==3,nofinger:i===3,a:0.9},-0.5*(1-p));}ghostL.position.set(0.6,1.2,-9.8);ghostL.intensity=4};
S.tra3=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);graves(5);lightIncense('all');graveL.intensity=1;put(C.BT,0.6,-8.6,{sit:true,eyes:1.3,mouth:m('BT',si,lt)},-0.42);
 if(si>=1)ghosts(5,sm(seg(lt,ls[1],ls[1]+3)));if(si>=3){C.R4.userData.o={calm:false,nofinger:true,reach:true,a:0.95};C.R4.position.set(1.0,C.R4.userData.h*0.4766,-9.4)}
 cams(lt,ls,[[[2.2,1.0,-6.6],[0.6,0.5,-10.6],34],[[0.6,1.0,-6.0],[0.6,0.5,-10.4],38,[0,0,-0.5]],[[2.8,0.9,-8.8],[1.8,0.6,-10.6],30],[[2.6,1.0,-8.2],[1.0,0.6,-9.4],30,[0,0,-0.3]],[[2.2,1.1,-7.2],[0.6,1.0,-8.6],28]],D);return 'ext'};
S.jump4=(lt,D,T,ls)=>{tod('night');graves(5);put(C.BT,0.6,-8.6,{sit:true,eyes:1.3,mouth:'o'},-0.42);const K=['R','R2','R3','R4','R5'];K.forEach((k,i)=>put(C[k],0.6+Math.cos(i*1.26)*0.55,-8.6+Math.sin(i*1.26)*0.4-0.1,{reach:true,a:0.9}));ghostL.position.set(0.6,1.2,-8.2);ghostL.intensity=5;
 cams(lt,ls,[[[0.6,1.4,-5.6],[0.6,0.8,-8.6],34,[0,0,0.6]]],D);return 'ext'};
S.tra4=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);graves(5);put(C.H,3.4,-5.4,{baby:true,eyes:1.3,tear:true,look:-1});
 cams(lt,ls,[[[4.2,1.5,-3.6],[3.4,1.45,-5.4],28],[[5.2,1.6,-3.2],[1,0.7,-9.4],38,[0,0,-0.8]]],D);return 'ext'};
S.sang=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===1)return flat2(F.vai,lt-ls[1],ls[2]-ls[1],T,'old');if(si===2){innMode('day');put(CI.L,0.2,1.2,{sit:true,arm:[-1.0,undefined]});put(CI.H,1.2,1.4,{baby:true});cams(lt,ls,[[],[],[[0.8,1.4,4],[0.6,1.1,1.2],34]],D);return 'inn'}
 tod('dawn');graves(5);lie(EL.BT,0.7,0.04,-9.0,0.3,0.3);put(C.NAM,-1.6,-7.6,{});put(C.G2,-2.4,-7.2,{});cams(lt,ls,[[[0.8,3.0,-6.2],[0.7,0,-9.2],44,[0,-0.4,-0.4]]],D);return 'ext'};
S.sang2=(lt,D,T,ls)=>{tod('dawn');const si=siOf(lt,ls);graves(5);lie(EL.BT,0.7,0.04,-9.0,0.3,0.3);put(C.TH,-0.6,-7.8,{mouth:m('TH',si,lt),arm:[-0.9,0.9],stick:false});
 cams(lt,ls,[[[1.6,1.8,-5.2],[0.2,0.6,-8.8],36],[[0.6,1.5,-5.6],[-0.6,1.45,-7.8],28]],D);return 'ext'};
S.ket=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===3){innMode('day');bowls(5);put(CI.H,-0.4,-1.5,{back:true});put(CI.L,0.6,-1.5,{back:true});cams(lt,ls,[[],[],[],[[0.2,1.6,1.6],[0.2,1.2,-2.8],36,[0,0,-0.5]]],D);return 'inn'}
 tod('day');put(C.H,0.0,6.0,{baby:si===0,happy:true});if(si>=1)put(C.KID,1.0,6.3,{smile:true,armA:[0.3,-0.3]});put(C.L,1.9,6.1,{});
 cams(lt,ls,[[[1,1.6,11],[0.8,1.2,6],38,[0,0,-1]],[[1.0,1.3,9.8],[1.0,0.9,6.3],38],[[-3,2.2,10.2],[0.5,1.2,5],40,[1,0,-0.6]]],D);return 'ext'};
S.ket2=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);bowls(5);altL.intensity=2;put(CI.KID,0.2,-2.0,{sit:true,back:si===0,mouth:m('BE',si,lt),look:si===2?-1:0});put(CI.H,-1.3,-0.7,{mouth:m('H',si,lt),eyes:si===3?1.3:1,look:1});lampAt(-0.6,-0.2);
 cams(lt,ls,[[[1.2,1.2,-0.3],[0.2,0.75,-2.0],38,[-0.2,0,-0.2]],[[0.6,1.5,1.6],[-1.3,1.4,-0.7],30],[[0.9,0.9,0.2],[0.2,0.75,-2.0],30],[[-2.6,1.6,1.6],[-0.5,1.0,-1.4],38]],D);return 'inn'};
S.ket3=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);NET.visible=false;lie(IL.KID,-3.45,0.53,-1.4);put(CI.H,-2.2,-0.75,{sit:true,eyes:si>=2?1.3:0.9,look:-1});lampAt(-1.4,0.1);if(si>=2)put(CI.BT,-4.0,-2.6,{a:0.55,eyes:0.6});
 cams(lt,ls,[[[-1.4,2.2,1.4],[-3.1,0.6,-1.7],38],[[-2.6,1.9,0.2],[-3.4,0.6,-1.8],34,[0,0,-0.2]],[[-0.6,1.5,1.8],[-2.6,1.0,-1.2],36],[[-1.0,1.7,1.6],[-3.6,1.1,-2.3],36,[0,0,-0.4]]],D);return 'inn'};
S.final=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===1)return flat2(F.vai,lt-ls[1],D-ls[1],T,'kid');tod('night');graves(5);lightIncense('all');graveL.intensity=2;put(C.TH,0.6,-7.6,{mouth:m('TH',si,lt),stick:false});cams(lt,ls,[[[0.6,1.5,-4.8],[0.6,1.3,-8.6],32,[0,0,-0.6]]],D);return 'ext'};

// ================= vòng vẽ =================
window.draw=function(t){resetAll(t);
 motes.forEach((mm,i)=>{const p=(t*0.04+R(i))%1;mm.position.set(-4+(R(i+5))*1.5+p*2.5,0.3+((R(i+9)*3+t*0.05)%2.4),0.3+(R(i+3)-0.5)*1.2);mm.material.opacity=0.45*Math.sin(p*Math.PI)});
 fogS.forEach((s,i)=>{s.position.x=(s.userData.x0??(s.userData.x0=s.position.x))+((t*0.4+R(i)*10)%10)});
 const sc=TLD.scenes.find(s=>t>=s[1]&&t<s[2])||TLD.scenes[TLD.scenes.length-1];const [k,a,b,ls,li]=sc;const lt=t-a,D=b-a;SI_BASE=li;
 g2.clearRect(0,0,RW,RH);
 let mode='flat';try{mode=S[k](lt,D,t,ls)}catch(e){console.log('ERR',k,e.message);mode='flat'}
 [altL,innG,doorL,moonL,dayL,porchL,bthL,graveL,ghostL,rvL,moonDir,sunD].forEach(l=>l.visible=l.intensity>0.01);lampL.visible=lampL.visible&&lampL.intensity>0.01;
 [lampL,moonL,doorL,moonDir,sunD].forEach(l=>l.castShadow=l.visible&&l.intensity>0.01);dayL.castShadow=false;porchL.castShadow=false;lampL.shadow.mapSize.set(512,512);
 lampL.position.set(lampG.position.x,lampG.position.y+0.3,lampG.position.z);
 if(window.DBGCAM){cam.position.set(...window.DBGCAM[0]);cam.lookAt(...window.DBGCAM[1]);cam.fov=50}
 cam.aspect=RW/RH;cam.updateProjectionMatrix();
 const face=(c)=>{if(c.visible){c.userData.paint(t);c.lookAt(cam.position.x,c.position.y,cam.position.z)}};
 if(mode==='ext'||mode==='ext+'){for(const kk in C)face(C[kk]);renderer.render(ext,cam)}
 else if(mode==='inn'){for(const kk in CI)face(CI[kk]);renderer.render(inn,cam)}
 else{renderer.setClearColor(0x000000,1);renderer.clear()}
 if(mode!=='flat'){if(TINT){g2.fillStyle=TINT;g2.fillRect(0,0,RW,RH)}if(RAIN)rain(t,RAIN);const vg=g2.createRadialGradient(RW/2,RH/2,RH*0.3,RW/2,RH/2,RH*0.95);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');g2.fillStyle=vg;g2.fillRect(0,0,RW,RH)}
 if(k==='hook3')hookText(sm(seg(lt,0.2,0.7)),'CON RANH CON LỘN','ĐỨA CON ĐÒI NỢ');
 //no full-screen jumpscare
 const d=Math.min(t-a,b-t);if(d<0.1&&a>0){g2.fillStyle=`rgba(0,0,0,${1-d/0.1})`;g2.fillRect(0,0,RW,RH)}
 watermark(t);if(k!=='title')subs(t)};
window.READY=true;

