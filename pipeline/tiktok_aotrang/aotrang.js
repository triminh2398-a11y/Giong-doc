// ================= BẢN MƯỜNG: NHÀ SÀN / NGOÀI BẢN / MIỆNG HANG =================
const nuaT=ctex(512,512,(g,w,h)=>{g.fillStyle='#b89a62';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=16)for(let x=0;x<w;x+=32){g.fillStyle=((x/32+y/16)%2)?'rgba(120,90,40,.35)':'rgba(255,235,180,.18)';g.fillRect(x+((y/16)%2)*16,y,30,14)}},[3,2]);
const sanFloorT=plank('#7a5636',[3,3]);
const limeT2=ctex(512,512,(g,w,h)=>{g.fillStyle='#9a9a90';g.fillRect(0,0,w,h);for(let k=0;k<260;k++){g.fillStyle=`rgba(${R(k)>0.5?200:40},${R(k)>0.5?200:44},${R(k)>0.5?190:40},${0.12+R(k+1)*0.2})`;g.beginPath();g.ellipse(R(k*3)*w,R(k*7)*h,6+R(k)*40,3+R(k+2)*18,R(k)*3,0,7);g.fill()}for(let k=0;k<30;k++){g.strokeStyle='rgba(40,40,36,.35)';g.lineWidth=2;g.beginPath();const x=R(k+50)*w;g.moveTo(x,0);g.bezierCurveTo(x+20,h*0.3,x-20,h*0.6,x+10,h);g.stroke()}},[3,3]);
// ---- trong nhà sàn ----
const san=new THREE.Scene();san.background=new THREE.Color(0x14100c);san.fog=new THREE.FogExp2(0x16120e,0.04);
const SN=new THREE.Group();san.add(SN);
{const f=new THREE.Mesh(new THREE.PlaneGeometry(8,6),M({map:sanFloorT}));f.rotation.x=-Math.PI/2;f.receiveShadow=true;SN.add(f)}
const nuaM=M({map:nuaT});box(8,3,0.1,nuaM,0,1.5,-3,SN);box(0.1,3,6,nuaM,-4,1.5,0,SN);box(0.1,3,6,nuaM,4,1.5,0,SN);
for(const x of[-2.5,0,2.5])box(0.18,3.2,0.18,M({color:0x4a3220}),x,1.6,-2.9,SN);
box(8,0.12,0.16,M({color:0x4a3220}),0,2.4,-2.9,SN);
// bếp lửa giữa sàn
const HEARTH=new THREE.Group();HEARTH.position.set(0.4,0,0.6);SN.add(HEARTH);box(1.2,0.12,1.2,M({color:0x6a5a48}),0,0.06,0,HEARTH);
for(let k=0;k<3;k++){const st=new THREE.Mesh(new THREE.DodecahedronGeometry(0.12,0),M({color:0x3a3632}));st.position.set(Math.cos(k*2.1)*0.25,0.2,Math.sin(k*2.1)*0.25);HEARTH.add(st)}
const FIRE=[];for(let k=0;k<5;k++){const f=new THREE.Mesh(new THREE.ConeGeometry(0.08+R(k)*0.05,0.3+R(k+1)*0.2,8),new THREE.MeshBasicMaterial({color:k%2?0xffb040:0xff6a20,transparent:true,opacity:0.85}));f.position.set((R(k)-0.5)*0.2,0.28,(R(k+3)-0.5)*0.2);HEARTH.add(f);FIRE.push(f)}
const fireL=new THREE.PointLight(0xff8a40,4,7,1.4);fireL.position.set(0.4,0.8,0.6);san.add(fireL);
// chiếu + chăn
const CHIEU=box(1.6,0.03,2.0,M({color:0xc8b078}),-2.2,0.02,0.2,SN);const CHAN=box(1.2,0.12,1.0,M({color:0x6a3a4a}),-2.2,0.08,0.7,SN);
// sào phơi đồ, rổ ngô
box(3,0.04,0.04,M({color:0x5a4228}),1.6,2.1,-2.6,SN);
const RO=new THREE.Group();RO.position.set(2.6,0,-1.6);SN.add(RO);{const r=new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.24,0.25,14,1,true),M({color:0x9a7a4a,side:THREE.DoubleSide}));r.position.y=0.13;RO.add(r);for(let k=0;k<6;k++){const c=new THREE.Mesh(new THREE.CapsuleGeometry(0.05,0.18,4,8),M({color:0xe8c040}));c.position.set((R(k)-0.5)*0.4,0.28,(R(k+2)-0.5)*0.4);c.rotation.z=R(k)*3;RO.add(c)}}
// váy trắng nằm cuối chiếu (cảnh hét)
const VAY=new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.9),M({color:0xf2f0ea,side:THREE.DoubleSide}));VAY.rotation.x=-Math.PI/2;VAY.position.set(-2.1,0.06,-0.6);SN.add(VAY);VAY.visible=false;
const TORCH=new THREE.PointLight(0xffa050,0,6,1.4);san.add(TORCH);
const sHemi=new THREE.HemisphereLight(0x8a7a6a,0x2a2018,0.9);san.add(sHemi);const sDay=new THREE.DirectionalLight(0xfff0d8,0);sDay.position.set(3,4,5);sDay.castShadow=true;san.add(sDay);
const sCold=new THREE.PointLight(0xb8d0e0,0,5,1.4);san.add(sCold);
function sanMode(m){const day=m==='day';san.background.set(day?0x3a3020:0x14100c);sHemi.intensity=day?1.6:0.9;sDay.intensity=day?2.0:0;fireL.intensity=day?1.5:4}
function sanAnim(T){FIRE.forEach((f,i)=>{f.scale.y=0.8+0.35*Math.sin(T*9+i*2);f.position.x=(R(i)-0.5)*0.2+0.02*Math.sin(T*7+i)});fireL.intensity*=0.9+0.12*Math.sin(T*13)*Math.sin(T*5.3)}
function sanReset(){VAY.visible=false;TORCH.intensity=0;sCold.intensity=0;sanMode('night')}
// ---- ngoài bản: ruộng bậc thang + nhà sàn ----
const ban=new THREE.Scene();ban.background=new THREE.Color(0xa8c4e0);ban.fog=new THREE.Fog(0xc8d8e4,14,70);
const BN=new THREE.Group();ban.add(BN);
{const g=new THREE.Mesh(new THREE.PlaneGeometry(120,120),M({color:0x6a8a3a}));g.rotation.x=-Math.PI/2;g.receiveShadow=true;BN.add(g)}
for(let i=0;i<9;i++){const r=7+i*1.6;const t=new THREE.Mesh(new THREE.CylinderGeometry(r,r+0.4,0.38,48,1,false,Math.PI*0.9,Math.PI*1.2),M({color:i%2?0x8ab040:0x9ac050}));t.position.set(-10,0.19+i*0.38-0.2,-14);BN.add(t);t.receiveShadow=true}
{const w=new THREE.Mesh(new THREE.PlaneGeometry(30,3),new THREE.MeshStandardMaterial({color:0x8ab0c8,roughness:0.1,metalness:0.3}));w.rotation.x=-Math.PI/2;w.position.set(-10,0.02,-6);BN.add(w)}
// núi đá vôi xa
for(let k=0;k<10;k++){const h=8+R(k)*10;const m=new THREE.Mesh(new THREE.CylinderGeometry(1.5+R(k)*2,4+R(k+1)*3,h,7),M({map:limeT2,color:0xa8aaa4}));m.position.set(-30+k*7,h/2-0.5,-30-R(k+4)*12);m.rotation.y=R(k)*3;BN.add(m);const top=new THREE.Mesh(new THREE.SphereGeometry(2+R(k)*1.5,8,6),M({color:0x4a6a3a}));top.position.set(m.position.x,h-0.4,m.position.z);top.scale.y=0.5;BN.add(top)}
// nhà sàn
const NS=new THREE.Group();NS.position.set(3.5,0,-3);BN.add(NS);
for(const x of[-1.8,0,1.8])for(const z of[-1.2,1.2])box(0.16,1.6,0.16,M({color:0x4a3220}),x,0.8,z,NS);
box(4,0.14,2.8,M({map:sanFloorT}),0,1.6,0,NS);box(3.9,1.6,2.6,M({map:nuaT}),0,2.45,0,NS);
{const r=new THREE.Mesh(new THREE.ConeGeometry(3.4,1.8,4),M({color:0x8a6a3a}));r.position.y=4.1;r.rotation.y=Math.PI/4;r.scale.set(1.25,1,0.95);NS.add(r)}
box(0.9,1.3,0.06,M({color:0x2a1e14}),0,2.3,1.33,NS);
for(let k=0;k<6;k++)box(0.7,0.05,0.12,M({color:0x5a4228}),0,0.3+k*0.25,1.6+k*0.12,NS);
// cò trắng bay
const CO=new THREE.Group();ban.add(CO);{const b=new THREE.Mesh(new THREE.SphereGeometry(0.18,10,8),M({color:0xf4f4f0}));b.scale.set(1.6,0.7,0.7);CO.add(b);for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.PlaneGeometry(0.7,0.25),M({color:0xf0f0ec,side:THREE.DoubleSide}));w.position.set(0,0.05,s*0.35);w.rotation.x=Math.PI/2;CO.add(w);CO.userData['w'+s]=w}const n=box(0.04,0.04,0.35,M({color:0xf4f4f0}),0.32,0.08,0,CO);n.rotation.y=Math.PI/2}CO.visible=false;
const bHemi2=new THREE.HemisphereLight(0xd0e0f4,0x6a7a4a,1.4);ban.add(bHemi2);const bSun=new THREE.DirectionalLight(0xfff0d8,2.4);bSun.position.set(-8,12,6);bSun.castShadow=true;bSun.shadow.mapSize.set(1024,1024);Object.assign(bSun.shadow.camera,{left:-14,right:14,top:14,bottom:-14});ban.add(bSun);
function banMode(m){const d=m==='day',e=m==='dusk';ban.background.set(d?0xa8c4e0:e?0xd8a880:0x1c2438);ban.fog.color.set(d?0xc8d8e4:e?0xe0b890:0x222c40);bHemi2.intensity=d?1.4:e?1.1:0.9;bSun.intensity=d?2.4:e?1.6:0.6;bSun.color.set(e?0xffc090:0xfff0d8)}
function banReset(){CO.visible=false;banMode('day')}
// ---- miệng hang đá vôi ----
const hang=new THREE.Scene();hang.background=new THREE.Color(0xb0c4d4);hang.fog=new THREE.Fog(0xc0ccd4,10,50);
const HG=new THREE.Group();hang.add(HG);
{const g=new THREE.Mesh(new THREE.PlaneGeometry(60,60),M({map:limeT2,color:0x8a8a80}));g.rotation.x=-Math.PI/2;g.receiveShadow=true;HG.add(g)}
// vách đá: khối lớn có lỗ hang (vòm tối)
const cliffM2=M({map:limeT2,color:0xb4b4aa});
box(5,9,3,cliffM2,-4.6,4.5,-4.2,HG);box(5,9,3,cliffM2,4.6,4.5,-4.2,HG);box(14,4.5,3,cliffM2,0,6.75,-4.2,HG);
{const arch=new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.1,3,24,1,false,0,Math.PI),cliffM2);arch.rotation.z=Math.PI/2;arch.rotation.y=Math.PI/2;arch.position.set(0,4.5,-4.2);arch.scale.set(1,1,1)}
const HOLE=new THREE.Mesh(new THREE.PlaneGeometry(4.2,4.6),new THREE.MeshBasicMaterial({color:0x020304}));HOLE.position.set(0,2.3,-2.72);HG.add(HOLE);
{const top=new THREE.Mesh(new THREE.CircleGeometry(2.1,24,0,Math.PI),new THREE.MeshBasicMaterial({color:0x020304}));top.position.set(0,4.55,-2.71);HG.add(top)}
for(let k=0;k<18;k++){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(0.4+R(k)*0.9,0),cliffM2);r.position.set((R(k)-0.5)*12,0.2,-2.4+R(k+3)*3*(Math.abs(R(k)-0.5)>0.2?1:-0.2));if(Math.abs(r.position.x)<2.2&&r.position.z>-2.6)r.position.x+=r.position.x<0?-2.4:2.4;r.rotation.set(R(k)*3,R(k+1)*3,0);r.castShadow=true;HG.add(r)}
// khe đá trong hang (tối sâu) trước miệng hang
const KHE=new THREE.Mesh(new THREE.PlaneGeometry(1.4,0.35),new THREE.MeshBasicMaterial({color:0x000000}));KHE.rotation.x=-Math.PI/2;KHE.position.set(0.6,0.012,-2.0);HG.add(KHE);
// dây leo, cây
for(let k=0;k<10;k++){const t=new THREE.Group();t.position.set((k%2?1:-1)*(3+R(k)*5),0,1+R(k+5)*5);HG.add(t);box(0.14,1.4+R(k),0.14,M({color:0x4a3a28}),0,0.7,0,t);const s=new THREE.Mesh(new THREE.SphereGeometry(0.8+R(k)*0.4,10,8),M({color:0x4a7a3a}));s.position.y=1.8+R(k);t.add(s)}
// đống tro / lửa đốt váy
const PYRE=new THREE.Group();PYRE.position.set(0,0,-0.6);HG.add(PYRE);const DRESS=new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.9),M({color:0xf2f0ea,side:THREE.DoubleSide}));DRESS.rotation.x=-Math.PI/2.3;DRESS.position.y=0.12;PYRE.add(DRESS);
const PFIRE=[];for(let k=0;k<7;k++){const f=new THREE.Mesh(new THREE.ConeGeometry(0.1+R(k)*0.08,0.5+R(k+1)*0.4,8),new THREE.MeshBasicMaterial({color:k%2?0xffb040:0xff5a1a,transparent:true,opacity:0.85}));f.position.set((R(k)-0.5)*0.5,0.35,(R(k+3)-0.5)*0.4);PYRE.add(f);PFIRE.push(f)}
const pyreL=new THREE.PointLight(0xff8a40,0,8,1.4);pyreL.position.set(0,1,-0.4);hang.add(pyreL);
const hHemi=new THREE.HemisphereLight(0xd0dcec,0x5a5a4a,1.4);hang.add(hHemi);const hSun=new THREE.DirectionalLight(0xfff2dc,2.4);hSun.position.set(6,10,8);hSun.castShadow=true;hSun.shadow.mapSize.set(1024,1024);Object.assign(hSun.shadow.camera,{left:-10,right:10,top:10,bottom:-10});hang.add(hSun);
const hCold=new THREE.PointLight(0xb8d0e8,0,6,1.4);hang.add(hCold);
const hMist=[];for(let k=0;k<8;k++){const m=new THREE.Mesh(new THREE.PlaneGeometry(3,1.2),new THREE.MeshBasicMaterial({map:dustTex,transparent:true,opacity:0,depthWrite:false,color:0xe0e8f0}));m.position.set((R(k)-0.5)*3,0.5+R(k)*1.2,-2.4+k*0.35);hang.add(m);hMist.push(m)}
function hangMode(m){const d=m==='day',e=m==='dawn';hang.background.set(d?0xb0c4d4:e?0xc8b8b0:0x2a3240);hang.fog.color.set(d?0xc0ccd4:e?0xd0c0b8:0x2a3240);hHemi.intensity=d?1.4:e?1.2:0.8;hSun.intensity=d?2.4:e?1.4:0.4;hSun.color.set(e?0xffd0a8:0xfff2dc)}
function pyre(q,T){DRESS.visible=q<0.95;DRESS.material.color.setRGB(lerp(0.95,0.15,q),lerp(0.94,0.12,q),lerp(0.92,0.1,q));PFIRE.forEach((f,i)=>{f.visible=q>0.02;f.scale.setScalar((0.6+q*0.8)*(0.8+0.3*Math.sin(T*9+i)))});pyreL.intensity=q>0.02?(2+q*5)*(0.9+0.1*Math.sin(T*13)):0}
function mist(a,T){hMist.forEach((m,i)=>{m.material.opacity=a*(0.25+0.1*Math.sin(T+i));m.position.z=-2.4+((T*0.3+i*0.35)%3)})}
function hangReset(){pyre(0,0);hCold.intensity=0;mist(0,0);hangMode('day')}
