// ================= NHÀ PHỐ HIỆN ĐẠI: phòng khách + bếp =================
const mod=new THREE.Scene();mod.background=new THREE.Color(0x050608);mod.fog=new THREE.FogExp2(0x07080b,0.04);
const tileM=M({map:ctex(512,512,(g,w,h)=>{g.fillStyle='#b8b4ac';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=128)for(let x=0;x<w;x+=128){g.fillStyle=`rgba(${R(x+y)>0.5?255:0},${R(x+y)>0.5?255:0},${R(x+y)>0.5?255:0},.05)`;g.fillRect(x,y,128,128);g.strokeStyle='rgba(60,60,60,.5)';g.lineWidth=3;g.strokeRect(x,y,128,128)}},[6,6]),roughness:0.35});
const paintM=M({map:ctex(256,256,(g,w,h)=>{g.fillStyle='#d8d6cf';g.fillRect(0,0,w,h);for(let k=0;k<300;k++){g.fillStyle=`rgba(80,80,70,${R(k)*0.05})`;g.fillRect(R(k*3)*w,R(k*7)*h,6,6)}},[3,2])});
const MH=new THREE.Group();mod.add(MH);
{const f=new THREE.Mesh(new THREE.PlaneGeometry(11,8),tileM);f.rotation.x=-Math.PI/2;f.position.set(1,0,0.5);f.receiveShadow=true;MH.add(f)}
box(11,0.12,8,M({color:0xe8e6e0}),1,3.0,0.5,MH,false);
box(11,3,0.2,paintM,1,1.5,-2.6,MH);box(0.2,3,8,paintM,-4.5,1.5,0.5,MH);box(0.2,3,8,paintM,6.5,1.5,0.5,MH);
// vách ngăn bếp | phòng khách (x=0.9) chừa ô cửa z -1.6..-0.4
box(0.15,3,1.0,paintM,0.9,1.5,-2.1,MH);box(0.15,0.8,1.2,paintM,0.9,2.6,-1.0,MH);
const KDOOR=box(0.05,2.2,1.2,M({color:0xece8e0,roughness:0.6}),0.9,1.1,-1.0,MH);function kdoor(q){KDOOR.rotation.y=q*1.35;KDOOR.position.set(0.9+0.6*Math.sin(q*1.35),1.1,-1.6+0.6*Math.cos(q*1.35))}
// tủ bếp dưới + mặt đá + tủ treo
const cabM=M({color:0x3a3f46,roughness:0.5}),topM=M({color:0xe8e8e4,roughness:0.2,metalness:0.1});
box(4.6,0.86,0.62,cabM,3.6,0.43,-2.2,MH);box(4.7,0.05,0.66,topM,3.6,0.885,-2.2,MH);
box(3.4,0.7,0.36,cabM,3.2,2.1,-2.38,MH);
for(let k=0;k<6;k++)box(0.02,0.7,0.02,M({color:0x9a9a9a,metalness:0.8}),1.6+k*0.7,0.5,-1.88,MH);
// bồn rửa + vòi + dòng nước
box(0.7,0.04,0.42,M({color:0x6a6e74,metalness:0.8,roughness:0.25}),2.4,0.9,-2.15,MH);box(0.62,0.18,0.36,M({color:0x22262a,metalness:0.7}),2.4,0.82,-2.15,MH);
const FAU=new THREE.Group();MH.add(FAU);FAU.position.set(2.4,0.91,-2.4);{const m=M({color:0xc8ccd0,metalness:0.9,roughness:0.2});const p=new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.022,0.32,10),m);p.position.y=0.16;FAU.add(p);const a=new THREE.Mesh(new THREE.CylinderGeometry(0.016,0.016,0.2,10),m);a.rotation.x=Math.PI/2;a.position.set(0,0.31,0.09);FAU.add(a)}
const STREAM=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.02,0.3,10),new THREE.MeshStandardMaterial({color:0xcfe4f4,transparent:true,opacity:0.7,emissive:0x4a6a8a,emissiveIntensity:0.6}));STREAM.position.set(2.4,1.07,-2.21);MH.add(STREAM);STREAM.visible=false;
// bếp từ + nồi cơm điện + thớt dao
box(0.6,0.02,0.5,M({color:0x101012,roughness:0.1,metalness:0.4}),4.4,0.92,-2.15,MH);
const COOKER=new THREE.Group();MH.add(COOKER);COOKER.position.set(3.35,0.91,-2.2);{const b=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.15,0.22,20),M({color:0xf2f2f0,roughness:0.4}));b.position.y=0.11;COOKER.add(b);const l=new THREE.Mesh(new THREE.SphereGeometry(0.15,20,10,0,Math.PI*2,0,Math.PI/2),M({color:0xe8e8e6}));l.scale.y=0.4;l.position.y=0.22;COOKER.add(l);const led=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.02,0.01),new THREE.MeshBasicMaterial({color:0xff4020}));led.position.set(0,0.12,0.151);COOKER.add(led)}
box(0.4,0.02,0.26,M({color:0x8a6a3a}),2.95,0.92,-2.1,MH);
// tủ lạnh
const FRIDGE=box(0.8,1.9,0.7,M({color:0xb8bcc0,metalness:0.6,roughness:0.3}),6.0,0.95,-2.15,MH);
// bàn ăn + 3 ghế
const KT=[3.4,-0.5];
box(1.4,0.05,0.8,M({map:plank('#7a5a3a')}),KT[0],0.75,KT[1],MH);for(const [a,c] of [[-0.62,-0.33],[0.62,-0.33],[-0.62,0.33],[0.62,0.33]])box(0.05,0.75,0.05,M({color:0x2a2a2a}),KT[0]+a,0.375,KT[1]+c,MH);
const CHAIRS=[];function chair(x,z,ry){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;MH.add(g);box(0.42,0.05,0.42,M({color:0x5a4030}),0,0.46,0,g);box(0.42,0.5,0.05,M({color:0x5a4030}),0,0.72,-0.19,g);for(const [a,c] of [[-0.18,-0.18],[0.18,-0.18],[-0.18,0.18],[0.18,0.18]])box(0.03,0.46,0.03,M({color:0x2a2a2a}),a,0.23,c,g);CHAIRS.push(g);return g}
chair(KT[0]-0.35,KT[1]-0.62,0);chair(KT[0]+0.35,KT[1]-0.62,0);chair(KT[0],KT[1]+0.62,Math.PI);
function mkBowlM(x,z){const g=new THREE.Group();g.position.set(x,0.78,z);MH.add(g);const b=new THREE.Mesh(new THREE.SphereGeometry(0.065,14,10,0,Math.PI*2,Math.PI/2,Math.PI/2),M({color:0xf4f4f0,side:THREE.DoubleSide}));b.position.y=0.065;g.add(b);
 const r=new THREE.Mesh(new THREE.SphereGeometry(0.058,12,8),M({color:0xfbfaf4}));r.scale.y=0.45;r.position.y=0.07;g.add(r);g.userData.rice=r;
 const ch=new THREE.Group();for(const sd of [-1,1]){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.004,0.004,0.24,4),M({color:0x3a2a1a}));c.position.set(sd*0.008,0.18,0);ch.add(c)}g.add(ch);g.userData.ch=ch;return g}
const BWM=[mkBowlM(KT[0]-0.35,KT[1]-0.18),mkBowlM(KT[0]+0.35,KT[1]-0.18),mkBowlM(KT[0],KT[1]+0.2)];
function mbowls(n,o={}){BWM.forEach((b,k)=>{b.visible=k<n;b.userData.ch.visible=k===0&&!!o.upright;b.userData.rice.visible=k===0||!!o.full})}
const MSPILL=new THREE.Group();MH.add(MSPILL);MSPILL.position.set(KT[0]+0.1,0.78,KT[1]);
for(let k=0;k<80;k++){const r=new THREE.Mesh(new THREE.SphereGeometry(0.006+R(k)*0.004,5,4),M({color:k%6?0xe8e2d0:0xd8d0a8}));r.scale.set(1,0.6,1.8);r.position.set((R(k+1)-0.5)*0.4,0,(R(k+2)-0.5)*0.26);r.rotation.y=R(k)*3;MSPILL.add(r)}MSPILL.visible=false;
const MPUDDLE=new THREE.Mesh(new THREE.CircleGeometry(1,28),new THREE.MeshStandardMaterial({color:0x8aa0b0,roughness:0.02,metalness:0.7,transparent:true,opacity:0.55}));MPUDDLE.rotation.x=-Math.PI/2;MPUDDLE.position.set(2.5,0.006,-1.4);MH.add(MPUDDLE);MPUDDLE.visible=false;
// camera an ninh góc tường
{const g=new THREE.Group();g.position.set(6.3,2.7,0.8);MH.add(g);box(0.1,0.1,0.18,M({color:0xf0f0f0}),0,0,0,g);const d=new THREE.Mesh(new THREE.SphereGeometry(0.07,12,8),M({color:0x111111,roughness:0.1}));d.position.set(-0.06,-0.05,-0.08);g.add(d);const led=new THREE.Mesh(new THREE.SphereGeometry(0.012,6,4),new THREE.MeshBasicMaterial({color:0xff2020}));led.position.set(-0.03,0.03,-0.1);g.add(led)}
// đèn trần (panel) + chập chờn
const PANEL=new THREE.Mesh(new THREE.PlaneGeometry(1.2,0.6),new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xf0f4ff,emissiveIntensity:1.2}));PANEL.rotation.x=Math.PI/2;PANEL.position.set(3.4,2.93,-0.6);MH.add(PANEL);
const ceilL=new THREE.PointLight(0xe8eeff,0,9,1.2);ceilL.position.set(3.4,2.7,-0.6);ceilL.castShadow=true;mod.add(ceilL);
const nightKL=new THREE.PointLight(0x9ab0d8,0,8,1.4);nightKL.position.set(4.6,2.2,0.8);mod.add(nightKL);
const fridgeL=new THREE.PointLight(0xdfe8ff,0,3,1.5);fridgeL.position.set(5.4,1.0,-1.6);mod.add(fridgeL);
// phòng khách: sofa, bàn thờ treo, cửa sổ, giường gấp (Vy ngủ dưới phòng khách với con)
box(2.0,0.45,0.8,M({color:0x5a6a7a}),-2.6,0.225,-2.0,MH);box(2.0,0.5,0.2,M({color:0x5a6a7a}),-2.6,0.6,-2.35,MH);
box(1.0,0.05,0.35,M({color:0x7a2a18}),-0.6,1.8,-2.42,MH);{const p=new THREE.Mesh(new THREE.PlaneGeometry(0.22,0.3),M({map:photoT}));p.position.set(-0.6,2.04,-2.49);MH.add(p)}
nhang(MH,-0.85,1.83,-2.42);
const MOFFER=new THREE.Group();MH.add(MOFFER);MOFFER.position.set(-0.4,1.83,-2.42);{const pl=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.12,0.02,16),M({color:0xe8e4d8}));MOFFER.add(pl);for(let k=0;k<5;k++){const f=new THREE.Mesh(new THREE.SphereGeometry(0.04,10,8),fruitM[k%4]);f.position.set((R(k)-0.5)*0.16,0.04,(R(k+3)-0.5)*0.12);MOFFER.add(f)}MOFFER.userData.fruit=MOFFER.children.slice(1)}
const mWin=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.2),winM);mWin.position.set(-2.2,1.8,-2.49);MH.add(mWin);
const MBED=new THREE.Group();MH.add(MBED);MBED.position.set(-3.2,0,0.6);box(1.6,0.3,2.0,M({color:0xe8e4dc}),0,0.15,0,MBED);box(1.6,0.6,0.08,M({color:0x6a5a4a}),0,0.45,-1.0,MBED);
const mbA=new THREE.Mesh(new THREE.CapsuleGeometry(0.22,1.2,6,12),M({color:0x8a9ab8,roughness:1}));mbA.rotation.x=Math.PI/2;mbA.scale.set(1.3,1,0.7);mbA.position.set(-0.35,0.42,0.25);MBED.add(mbA);
const mbB=new THREE.Mesh(new THREE.CapsuleGeometry(0.16,0.7,6,12),M({color:0xd8a0b0,roughness:1}));mbB.rotation.x=Math.PI/2;mbB.scale.set(1.3,1,0.7);mbB.position.set(0.35,0.4,0.05);MBED.add(mbB);
function mInBed(c,side,o,sc){put(c,MBED.position.x+side*0.35,MBED.position.z-0.75,o,-0.18)}
const mHemi=new THREE.HemisphereLight(0x3a4058,0x0a0a0a,0.4);mod.add(mHemi);
const mDay=new THREE.HemisphereLight(0xfff8f0,0x8a8070,0);mod.add(mDay);const mSunL=new THREE.DirectionalLight(0xfff4e0,0);mSunL.position.set(-4,6,6);mSunL.castShadow=true;Object.assign(mSunL.shadow.camera,{left:-8,right:8,top:8,bottom:-8});mod.add(mSunL);
const mLamp=new THREE.PointLight(0xffb070,0,6,1.5);mLamp.position.set(-2.0,1.6,0.2);mod.add(mLamp);
const mFill=new THREE.PointLight(0xc8c8d8,0,6,1.5);mod.add(mFill);
function modDay(){mod.background.set(0xbfd8ea);mDay.intensity=1.1;mSunL.intensity=1.4;ceilL.intensity=1.6;PANEL.material.emissiveIntensity=1.2;mWin.material=new THREE.MeshBasicMaterial({map:dayWinT});mHemi.intensity=0.4}
function modNight(k=1,T=0,flk=false){mod.background.set(0x050608);mDay.intensity=0;mSunL.intensity=0;const f=flk?(Math.sin(T*23)*Math.sin(T*7.1)>0.25?0.15:1):1;ceilL.intensity=1.4*k*f;PANEL.material.emissiveIntensity=1.2*k*f;nightKL.intensity=1.2;mHemi.intensity=0.35;mWin.material=winM}
function modReset(){STREAM.visible=false;MPUDDLE.visible=false;MSPILL.visible=false;mbowls(0);kdoor(0);fridgeL.intensity=0;mLamp.intensity=0;mFill.intensity=0;nightKL.intensity=0;ceilL.intensity=0;PANEL.material.emissiveIntensity=0;MOFFER.userData.fruit.forEach(f=>f.visible=true);MBED.visible=true}
