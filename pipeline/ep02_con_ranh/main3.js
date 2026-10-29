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
