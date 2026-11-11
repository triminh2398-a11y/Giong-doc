// ================= ĐÈO + XE TẢI + CABIN =================
const pas=new THREE.Scene();pas.background=new THREE.Color(0x7a8aa8);pas.fog=new THREE.FogExp2(0xa8b4c8,0.02);
const PG=new THREE.Group();pas.add(PG);
const asphT=ctex(512,512,(g,w,h)=>{g.fillStyle='#3a3c40';g.fillRect(0,0,w,h);for(let k=0;k<900;k++){g.fillStyle=`rgba(${R(k)>0.5?90:10},${R(k)>0.5?92:10},${R(k)>0.5?96:12},.18)`;g.fillRect(R(k*3)*w,R(k*7)*h,3,3)}g.fillStyle='#d8d4b8';for(let y=20;y<h;y+=128)g.fillRect(w/2-4,y,8,60)},[1,10]);
const road=new THREE.Mesh(new THREE.PlaneGeometry(6.4,60),M({map:asphT,roughness:0.55}));road.rotation.x=-Math.PI/2;road.position.set(0,0,-8);road.receiveShadow=true;PG.add(road);
{const e=box(0.5,0.12,60,M({color:0x4a4a44}),3.45,0,-8,PG);box(0.5,0.12,60,M({color:0x4a4a44}),-3.45,0,-8,PG)}
// vách đồi bên trái
const rockPM=M({color:0x5a5e52,roughness:1});
for(let k=0;k<14;k++){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(1.6+R(k)*1.4,0),rockPM);r.position.set(-5.2-R(k+1)*1.5,1.2+R(k+2)*1.8,-30+k*3.4);r.rotation.set(R(k)*3,R(k+3)*3,0);r.castShadow=true;PG.add(r)}
const hillM=M({color:0x3a5230});const hill=new THREE.Mesh(new THREE.BoxGeometry(8,6,64),hillM);hill.position.set(-9.2,2.2,-8);PG.add(hill);
// lan can bên phải, có chỗ hở z -1.4..0.6
const rail=M({color:0xc8c4b8,metalness:0.4,roughness:0.5});
for(let z=-30;z<=14;z+=1.6){if(z>-1.8&&z<1.0)continue;box(0.12,0.9,0.12,M({color:0x6a6a64}),3.95,0.45,z,PG);}
box(0.1,0.22,13.2,rail,3.95,0.85,8.4,PG);box(0.1,0.22,27.6,rail,3.95,0.85,-16.8,PG);
// gãy lan can: 2 đoạn gập ở hai mép chỗ hở
{const a=box(0.1,0.22,1.1,rail,4.2,0.55,-1.7,PG);a.rotation.set(0,-0.5,0.5);const b=box(0.1,0.22,1.1,rail,4.2,0.55,1.1,PG);b.rotation.set(0,0.5,0.5)}
// thung lũng
const RAV=new THREE.Mesh(new THREE.PlaneGeometry(60,70),M({color:0x2c4026}));RAV.rotation.x=-Math.PI/2;RAV.position.set(26,-9,-8);PG.add(RAV);
for(let k=0;k<40;k++){const t=new THREE.Group();t.position.set(7+R(k)*30,-9,-30+R(k+9)*50);PG.add(t);const h=2+R(k+2)*2.5;box(0.2,h,0.2,M({color:0x2a2018}),0,h/2,0,t);const s=new THREE.Mesh(new THREE.SphereGeometry(1+R(k)*0.8,8,6),M({color:0x24421e}));s.position.y=h+0.4;t.add(s)}
const cliffM=new THREE.Mesh(new THREE.BoxGeometry(0.6,9.2,70),M({color:0x4a4034}));cliffM.position.set(4.6,-4.6,-8);PG.add(cliffM);
// xe máy nát + mũ bảo hiểm xanh dưới vực
const WRK=new THREE.Group();WRK.position.set(6.4,-9,-0.2);PG.add(WRK);
{box(0.9,0.25,0.3,M({color:0x6a2a2a}),0,0.35,0,WRK).rotation.z=0.5;for(const x of[-0.55,0.55]){const w=new THREE.Mesh(new THREE.TorusGeometry(0.28,0.05,6,14),M({color:0x1a1a1a}));w.position.set(x,0.28,0);w.rotation.y=1.2;WRK.add(w)}box(0.06,0.5,0.06,M({color:0x3a2a1a}),1.0,0.5,0.4,WRK)}
const HELM=new THREE.Mesh(new THREE.SphereGeometry(0.2,14,10,0,Math.PI*2,0,Math.PI*0.62),M({color:0x2f6fd0,roughness:0.35,emissive:0x0c2a50,emissiveIntensity:0.6}));HELM.position.set(1.0,1.3,0.4);WRK.add(HELM);
// am thờ ven đường
const AMS=new THREE.Group();AMS.position.set(-3.7,0,3.2);PG.add(AMS);
box(0.8,0.7,0.6,M({color:0x8a8478}),0,0.35,0,AMS);box(0.95,0.1,0.75,M({color:0x6a2a20}),0,0.78,0,AMS);{const r=new THREE.Mesh(new THREE.ConeGeometry(0.7,0.35,4),M({color:0x7a2a20}));r.position.y=1.0;r.rotation.y=Math.PI/4;AMS.add(r)}
box(0.6,0.4,0.06,M({color:0x14100c}),0,0.35,0.3,AMS);
const AMSL=new THREE.PointLight(0xff9a50,0.8,3,1.6);AMSL.position.set(0,0.5,0.8);AMS.add(AMSL);
const AMSN=new THREE.Group();AMS.add(AMSN);for(let k=0;k<5;k++){const s=new THREE.Mesh(new THREE.CylinderGeometry(0.006,0.006,0.3,4),M({color:0x8a2a1a}));s.position.set(-0.2+k*0.1,0.12,0.42);AMSN.add(s);const t=new THREE.Mesh(new THREE.SphereGeometry(0.014,6,4),new THREE.MeshBasicMaterial({color:0xff7a30}));t.position.set(s.position.x,0.28,0.42);AMSN.add(t)}
// quán vá xe (cảnh sáng)
const SHP=new THREE.Group();SHP.position.set(-4.6,0,-3);PG.add(SHP);
box(2.6,0.1,2.0,M({color:0x7a5a38}),0,2.1,0,SHP);for(const x of[-1.2,1.2])box(0.1,2.1,0.1,M({color:0x4a3a28}),x,1.05,0.9,SHP);box(2.6,2.1,0.1,M({color:0x6a5a48}),0,1.05,-0.95,SHP);
for(let k=0;k<4;k++){const t=new THREE.Mesh(new THREE.TorusGeometry(0.34,0.14,8,16),M({color:0x1a1a1a}));t.position.set(-0.9,0.14+k*0.28,-0.3);t.rotation.x=Math.PI/2;SHP.add(t)}
{const t=new THREE.Mesh(new THREE.TorusGeometry(0.34,0.14,8,16),M({color:0x1a1a1a}));t.position.set(0.6,0.5,-0.6);t.rotation.y=0.2;SHP.add(t)}
SHP.visible=false;
// xe tải
function mkTruck(){const T=new THREE.Group();const body=M({color:0xc83a2a,roughness:0.5});const cont=M({color:0xe8e4da,roughness:0.6});
 box(2.3,1.2,2.2,body,0,1.15,-1.9,T);box(2.3,0.9,1.6,body,0,1.0,-0.4,T);box(2.2,0.7,1.2,body,0,1.7,-1.9,T,false);
 {const g=box(2.0,0.65,0.05,M({color:0x20303c,roughness:0.1,metalness:0.5,emissive:0x0a1420,emissiveIntensity:0.5}),0,1.78,-1.31,T,false)}
 box(2.5,2.6,5.4,cont,0,1.9,2.2,T);box(2.5,0.12,5.6,M({color:0x2a2a2a}),0,0.5,1.8,T);
 for(const sx of[-1.15,1.15])for(const z of[-1.4,1.8,3.3]){const w=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,0.4,16),M({color:0x141414}));w.rotation.z=Math.PI/2;w.position.set(sx,0.5,z);w.castShadow=true;T.add(w)}
 const heads=[];for(const sx of[-0.8,0.8]){const h=new THREE.Mesh(new THREE.SphereGeometry(0.14,10,8),new THREE.MeshBasicMaterial({color:0xfff2c8}));h.position.set(sx,0.95,0.42);T.add(h);const sp=new THREE.SpotLight(0xfff0d0,0,28,0.5,0.55,1.1);sp.position.set(sx,0.95,0.5);sp.target.position.set(sx*0.7,0.2,6);T.add(sp);T.add(sp.target);heads.push(sp)}
 const cone=new THREE.Mesh(new THREE.ConeGeometry(2.0,9,18,1,true),new THREE.MeshBasicMaterial({color:0xfff2c8,transparent:true,opacity:0.07,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));cone.rotation.x=-Math.PI/2;cone.position.set(0,0.95,5);T.add(cone);
 T.userData={heads,cone};return T}
// xe tải: đầu xe hướng +z local; đặt rotation.y=Math.PI để chạy về -z
const TRK=mkTruck();PG.add(TRK);
function truckLights(on){for(const s of TRK.userData.heads)s.intensity=on?90:0;TRK.userData.cone.visible=on}
function truckAt(x,y,z,yaw,pitch=0){TRK.position.set(x,y,z);TRK.rotation.set(pitch,yaw,0,'YXZ')}
const pHemi=new THREE.HemisphereLight(0xb8c4e0,0x4a5a40,1.0);pas.add(pHemi);const pSun=new THREE.DirectionalLight(0xffe8c0,1.8);pSun.position.set(-6,10,8);pSun.castShadow=true;pSun.shadow.mapSize.set(1024,1024);pSun.shadow.camera.left=-12;pSun.shadow.camera.right=12;pSun.shadow.camera.top=12;pSun.shadow.camera.bottom=-12;pas.add(pSun);
const pFill=new THREE.PointLight(0xffd8a0,0,8,1.4);pas.add(pFill);const pCold=new THREE.PointLight(0xa8c4e8,0,6,1.4);pas.add(pCold);
const pMist=[];for(let k=0;k<12;k++){const m=new THREE.Mesh(new THREE.PlaneGeometry(6,1.6),new THREE.MeshBasicMaterial({map:dustTex,transparent:true,opacity:0.2,depthWrite:false,color:0xd8e0ec}));m.position.set((R(k)-0.3)*16,0.7,-14+R(k+2)*20);m.rotation.x=-Math.PI/2.4;pas.add(m);pMist.push(m)}
const rainD=[];{const g=new THREE.BufferGeometry();const n=500,p=new Float32Array(n*3);for(let i=0;i<n;i++){p[i*3]=(R(i)-0.5)*14;p[i*3+1]=R(i+1)*7;p[i*3+2]=-16+R(i+2)*24}g.setAttribute('position',new THREE.BufferAttribute(p,3));var RAINP=new THREE.Points(g,new THREE.PointsMaterial({color:0xcfe0f0,size:0.05,transparent:true,opacity:0.5}));pas.add(RAINP)}
function pasMode(m){const night=m==='night',dawn=m==='dawn',dusk=m==='dusk';
 pas.background.set(night?0x2a3856:dawn?0xc4d0dc:0x9aa8c4);pas.fog.color.set(night?0x2c3a58:dawn?0xcad4de:0xb4bed0);pas.fog.density=night?0.03:0.016;
 pHemi.intensity=night?1.15:dawn?1.5:1.35;pHemi.color.set(night?0x7a90c8:0xc8d4ec);pSun.intensity=night?0.9:dawn?2.0:2.2;pSun.color.set(night?0x9ab0e8:dusk?0xffd098:0xfff0d8);
 SHP.visible=dawn;RAINP.visible=night;truckLights(night||dusk);AMSN.visible=true}
function pasReset(){pFill.intensity=0;pCold.intensity=0;SHP.visible=false;HELM.material.emissiveIntensity=0.6;truckAt(0,0,30,Math.PI);TRK.visible=false;pasMode('night')}
// ----- CABIN -----
const cab=new THREE.Scene();cab.background=new THREE.Color(0x1a2438);cab.fog=new THREE.FogExp2(0x1a2438,0.05);
const CB=new THREE.Group();cab.add(CB);
box(2.5,0.1,2.4,M({color:0x2a2a2e}),0,0,0,CB);box(2.5,0.12,2.4,M({color:0x6a6a70}),0,2.0,0,CB,false);box(0.1,2,2.4,M({color:0x4a4e58}),-1.25,1,0,CB);box(0.1,2,2.4,M({color:0x4a4e58}),1.25,1,0,CB);box(2.5,2,0.1,M({color:0x3a3e48}),0,1,-1.2,CB);
const seatM=M({color:0x30343c,roughness:0.9});for(const x of[-0.55,0.55]){box(0.7,0.4,0.7,seatM,x,0.28,-0.1,CB);box(0.7,0.9,0.14,seatM,x,0.9,-0.52,CB)}
const WHEEL=new THREE.Mesh(new THREE.TorusGeometry(0.22,0.03,8,20),M({color:0x14141a}));WHEEL.position.set(-0.55,0.85,0.55);WHEEL.rotation.x=-0.5;CB.add(WHEEL);
box(0.04,0.5,0.04,M({color:0x14141a}),-0.55,0.65,0.45,CB).rotation.x=-0.5;
// cửa sổ bên: vệt đèn chạy
const streakT=ctex(256,256,(g,w,h)=>{g.fillStyle='#12202e';g.fillRect(0,0,w,h);for(let k=0;k<14;k++){g.fillStyle=`rgba(255,${200+R(k)*40|0},150,${0.25+R(k)*0.4})`;g.fillRect(R(k)*w,R(k+4)*h,10+R(k)*60,3+R(k+2)*4)}for(let k=0;k<40;k++){g.fillStyle='rgba(180,210,240,.5)';g.fillRect(R(k+9)*w,R(k+11)*h,2,12+R(k)*16)}},[1,1]);streakT.wrapS=streakT.wrapT=THREE.RepeatWrapping;
const CWIN=[];for(const sx of[-1,1]){const w=new THREE.Mesh(new THREE.PlaneGeometry(1.6,0.8),new THREE.MeshBasicMaterial({map:streakT.clone()}));w.material.map.needsUpdate=true;w.position.set(sx*1.19,1.35,-0.05);w.rotation.y=-sx*Math.PI/2;CB.add(w);CWIN.push(w)}
{const w=new THREE.Mesh(new THREE.PlaneGeometry(1.8,0.7),new THREE.MeshBasicMaterial({map:streakT.clone()}));w.material.map.needsUpdate=true;w.position.set(0,1.4,-1.14);CB.add(w);CWIN.push(w)}
const cHemi=new THREE.HemisphereLight(0xb8c8e8,0x2a2a30,0.9);cab.add(cHemi);const cDash=new THREE.PointLight(0x9cf0c0,2.4,4,1.4);cDash.position.set(0,0.8,1.0);cab.add(cDash);const cDome=new THREE.PointLight(0xffe8c8,2.2,4,1.4);cDome.position.set(0,1.8,0.2);cab.add(cDome);const cCold=new THREE.PointLight(0xa8c4e8,0,4,1.4);cCold.position.set(0.55,1.2,1.0);cab.add(cCold);
function cabAnim(T,spd=1){CWIN.forEach((w,i)=>{w.material.map.offset.x=-(T*0.6*spd)%1;w.material.map.offset.y=(T*0.3)%1});WHEEL.rotation.z=Math.sin(T*0.8)*0.06}
function cabReset(){cCold.intensity=0;cDome.intensity=2.2;cDash.intensity=2.4;cHemi.intensity=0.9;cab.background.set(0x1a2438);cab.fog.color.set(0x1a2438)}
