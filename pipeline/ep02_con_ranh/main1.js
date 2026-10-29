import * as THREE from 'three';
const QS=new URLSearchParams(location.search);const VERT=QS.get('v')==='1';const T0=+(QS.get('t0')||0);const SDUR=+(QS.get('d')||0);const NOSUB=QS.get('nosub')==='1';const RW=VERT?720:1280,RH=VERT?1280:720;
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
