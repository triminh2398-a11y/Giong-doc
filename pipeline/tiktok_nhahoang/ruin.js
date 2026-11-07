// ================= NHÀ NGÓI GIỮA BÃI CỎ (ngoại cảnh) =================
const ruin=new THREE.Scene();ruin.background=new THREE.Color(0x8fb8e0);ruin.fog=new THREE.Fog(0x8fb8e0,25,70);
const RG=new THREE.Group();ruin.add(RG);
{const g=new THREE.Mesh(new THREE.PlaneGeometry(160,160),M({color:0x5f8a3a}));g.rotation.x=-Math.PI/2;g.receiveShadow=true;RG.add(g)}
const wallRT=ctex(512,256,(g,w,h)=>{g.fillStyle='#e6e2d6';g.fillRect(0,0,w,h);for(let k=0;k<400;k++){g.fillStyle=`rgba(90,90,70,${R(k)*0.06})`;g.fillRect(R(k*3)*w,R(k*7)*h,8,8)}},[2,1]);
const mossT=ctex(512,256,(g,w,h)=>{g.fillStyle='#b8b4a2';g.fillRect(0,0,w,h);for(let k=0;k<160;k++){g.fillStyle=`rgba(${R(k)>0.5?40:70},${R(k)>0.5?60:70},${R(k)>0.5?30:50},${0.15+R(k+1)*0.3})`;g.beginPath();g.ellipse(R(k*3)*w,R(k*7)*h*0.6+h*0.4,10+R(k)*40,6+R(k+2)*30,0,0,7);g.fill()}for(let k=0;k<40;k++){g.strokeStyle='rgba(30,30,25,.5)';g.lineWidth=1.5;g.beginPath();const x=R(k*5)*w;g.moveTo(x,R(k)*h);g.lineTo(x+(R(k+1)-0.5)*40,R(k)*h+30+R(k+2)*40);g.stroke()}},[2,1]);
const ventT=ctex(512,64,(g,w,h)=>{g.fillStyle='#e8e4d8';g.fillRect(0,0,w,h);for(let x=4;x<w;x+=32){g.fillStyle='#2a2a26';g.fillRect(x,10,24,44);g.fillStyle='#e8e4d8';g.beginPath();g.arc(x+12,32,9,0,7);g.fill();g.fillStyle='#2a2a26';g.fillRect(x+10,14,4,36);g.fillRect(x+2,30,20,4)}},[4,1]);
const tileRT=ctex(512,512,(g,w,h)=>{g.fillStyle='#8a3a24';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=24)for(let x=0;x<w;x+=36){g.fillStyle=`rgba(${R(x+y)>0.5?40:120},${R(x+y)>0.5?16:50},${R(x+y)>0.5?10:30},.35)`;g.beginPath();g.arc(x+18+((y/24)%2)*18,y+22,18,Math.PI,0);g.fill();g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=2;g.stroke()}},[4,3]);
const plankGT=ctex(256,256,(g,w,h)=>{g.fillStyle='#7a7a74';g.fillRect(0,0,w,h);for(let x=0;x<w;x+=20){g.fillStyle=`rgba(0,0,0,${0.15+R(x)*0.2})`;g.fillRect(x,0,3,h);for(let k=0;k<8;k++){g.fillStyle='rgba(30,30,30,.25)';g.fillRect(x+4+R(x+k)*12,R(x*k)*h,2,20+R(k)*30)}}});
const HW=9,HD=6,HH=3.0;const HOUSE2=new THREE.Group();RG.add(HOUSE2);
const wallMat=M({map:wallRT});
box(HW,HH,0.25,wallMat,0,HH/2,-HD/2,HOUSE2);box(0.25,HH,HD,wallMat,-HW/2,HH/2,0,HOUSE2);box(0.25,HH,HD,wallMat,HW/2,HH/2,0,HOUSE2);
// mặt trước lùi vào làm hiên, cột vuông
box(HW,HH,0.25,wallMat,0,HH/2,HD/2-1.4,HOUSE2);
for(const x of [-HW/2+0.15,-1.5,1.5,HW/2-0.15])box(0.32,HH,0.32,wallMat,x,HH/2,HD/2,HOUSE2);
box(HW,0.5,0.3,wallMat,0,HH-0.25,HD/2,HOUSE2);
{const v=new THREE.Mesh(new THREE.PlaneGeometry(HW,0.38),M({map:ventT}));v.position.set(0,HH-0.25,HD/2+0.16);HOUSE2.add(v)}
box(HW+0.4,0.12,1.6,M({color:0x9a968a}),0,0.06,HD/2-0.6,HOUSE2);
// cửa chính 2 cánh + 2 cửa sổ song sắt
const doorWT=plank('#5a3a22');const DOORL=box(0.8,2.1,0.08,M({map:doorWT}),-0.4,1.05,HD/2-1.25,HOUSE2),DOORR=box(0.8,2.1,0.08,M({map:doorWT}),0.4,1.05,HD/2-1.25,HOUSE2);
const winHT=ctex(128,128,(g,w,h)=>{g.fillStyle='#0a0a0c';g.fillRect(0,0,w,h);g.strokeStyle='#3a3a3a';g.lineWidth=7;for(let x=16;x<w;x+=24){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}});
const WIN2=[];for(const x of [-2.8,2.8]){const m=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.2),new THREE.MeshStandardMaterial({map:winHT,emissive:0x000000}));m.position.set(x,1.6,HD/2-1.26);HOUSE2.add(m);WIN2.push(m)}
// bùa trên cửa (đếm được, tăng dần)
const buaE=[];for(let k=0;k<6;k++){const b=new THREE.Mesh(new THREE.PlaneGeometry(0.16,0.42),new THREE.MeshStandardMaterial({map:buaT,transparent:true}));b.position.set(-0.6+(k%3)*0.6+(k>2?0.12:0),1.6+(k>2?-0.25:0),HD/2-1.2);b.rotation.z=(R(k)-0.5)*0.3;HOUSE2.add(b);buaE.push(b)}
// mái: 2 mái dốc + đầu hồi gỗ
const roofM=M({map:tileRT}),RS=Math.atan2(1.6,HD/2+0.6);
for(const sd of [-1,1]){const r=new THREE.Mesh(new THREE.BoxGeometry(HW+0.8,0.12,Math.hypot(1.6,HD/2+0.6)),roofM);r.position.set(0,HH+0.8,sd*(HD/2+0.6)/2);r.rotation.x=sd*RS;r.castShadow=true;HOUSE2.add(r)}
for(const sd of [-1,1]){const sh=new THREE.Shape();sh.moveTo(-HD/2-0.3,0);sh.lineTo(HD/2+0.3,0);sh.lineTo(0,1.55);sh.lineTo(-HD/2-0.3,0);const gm=new THREE.Mesh(new THREE.ShapeGeometry(sh),M({map:plankGT,side:THREE.DoubleSide}));gm.rotation.y=Math.PI/2;gm.position.set(sd*(HW/2+0.02),HH,0);HOUSE2.add(gm)}
// cây xanh xung quanh
for(let k=0;k<10;k++){const a=k/10*7+0.4,r=13+R(k)*10;const t=new THREE.Group();t.position.set(Math.cos(a)*r,0,Math.sin(a)*r-6);RG.add(t);box(0.3,3+R(k)*2,0.3,M({color:0x4a3a28}),0,1.6,0,t);for(let j=0;j<4;j++){const s=new THREE.Mesh(new THREE.SphereGeometry(1.4+R(k*j)*0.8,10,8),M({color:R(k+j)>0.5?0x3a6a2a:0x2e5a24}));s.position.set((R(k+j)-0.5)*2,3.8+R(j)*1.4,(R(k*3+j)-0.5)*2);s.castShadow=true;t.add(s)}}
// cỏ dại (cao khi bỏ hoang)
const grassGeo=new THREE.PlaneGeometry(0.08,1);grassGeo.translate(0,0.5,0);const NG=5000;const GRASS=new THREE.InstancedMesh(grassGeo,new THREE.MeshStandardMaterial({color:0x6a9a3a,side:THREE.DoubleSide}),NG);
{const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler();let n=0;for(let i=0;i<NG*3&&n<NG;i++){const x=(R(i)-0.5)*30,z=(R(i+9999)-0.5)*24+4;if(Math.abs(x)<HW/2+0.4&&z<HD/2+0.2&&z>-HD/2-0.4)continue;e.set((R(i+3)-0.5)*0.5,R(i+5)*6,(R(i+7)-0.5)*0.5);q.setFromEuler(e);m4.compose(new THREE.Vector3(x,0,z),q,new THREE.Vector3(1,0.6+R(i+11)*0.8,1));GRASS.setMatrixAt(n++,m4)}GRASS.count=n}
RG.add(GRASS);
const rHemi=new THREE.HemisphereLight(0xe8f0ff,0x4a5a30,1.0);ruin.add(rHemi);const rSun=new THREE.DirectionalLight(0xfff2dc,1.8);rSun.position.set(8,12,10);rSun.castShadow=true;Object.assign(rSun.shadow.camera,{left:-15,right:15,top:15,bottom:-15});rSun.shadow.mapSize.set(2048,2048);ruin.add(rSun);
const rMoon=new THREE.DirectionalLight(0x8aa0d0,0);rMoon.position.set(-6,10,8);ruin.add(rMoon);
const winGlow=new THREE.PointLight(0xb8d0e0,0,5,1.5);winGlow.position.set(2.8,1.6,HD/2-0.4);ruin.add(winGlow);
const rFill=new THREE.PointLight(0xc8d0e0,0,8,1.4);ruin.add(rFill);
function ruinMode(m,old){const ruined=!old;GRASS.scale.set(1,ruined?1.6:0.25,1);GRASS.material.color.set(ruined?0x6a9a3a:0x7aaa4a);wallMat.map=ruined?mossT:wallRT;wallMat.needsUpdate=true;
 if(m==='day'){ruin.background.set(0x8fb8e0);ruin.fog.color.set(0x8fb8e0);rHemi.intensity=1.0;rHemi.color.set(0xe8f0ff);rSun.intensity=1.8;rMoon.intensity=0}
 else if(m==='dusk'){ruin.background.set(0x6a5a6a);ruin.fog.color.set(0x5a4a5a);rHemi.intensity=0.55;rHemi.color.set(0xd0a890);rSun.intensity=0.7;rMoon.intensity=0}
 else{ruin.background.set(0x070a12);ruin.fog.color.set(0x070a12);rHemi.intensity=0.22;rHemi.color.set(0x6070a0);rSun.intensity=0;rMoon.intensity=0.9}}
function buaN(n,fade){buaE.forEach((b,k)=>{b.visible=k<n;b.material.color.set(fade?0x9a9a8a:0xffffff)})}
function ruinReset(){winGlow.intensity=0;rFill.intensity=0;buaN(0);DOORL.rotation.y=0;DOORR.rotation.y=0;WIN2.forEach(w=>w.material.emissive.set(0x000000))}
