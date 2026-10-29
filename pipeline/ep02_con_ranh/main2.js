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
function innMode(m){const day=m==='day';dayL.intensity=day?2.4:0;innHemi.intensity=day?1.1:0;moonL.intensity=day?0:30;winOut.material.color.set(day?0xe8e8d8:0x1a2a44);backOut.material.color.set(day?0x8a9a78:0x0c1422);inn.fog.density=day?0.01:0.035;inn.background.set(day?0x2a2a24:0x07080c);
 lampL.visible=!day;lampG.visible=true;renderer.toneMappingExposure=day?1.0:1.15;innAmb.intensity=day?0.3:0.6}
function bowls(n){BOWLS.forEach((b,i)=>b.visible=i<n);STICKS.forEach((b,i)=>b.visible=i<n)}
