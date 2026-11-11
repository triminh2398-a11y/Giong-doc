// ================= CẦU VÁN QUA BÃI THA MA =================
const brg=new THREE.Scene();brg.background=new THREE.Color(0x06080e);brg.fog=new THREE.FogExp2(0x0a0e16,0.06);
const BG=new THREE.Group();brg.add(BG);
{const g=new THREE.Mesh(new THREE.PlaneGeometry(80,80),M({color:0x2e3a22}));g.rotation.x=-Math.PI/2;g.receiveShadow=true;BG.add(g)}
const bWater=new THREE.Mesh(new THREE.PlaneGeometry(60,4),new THREE.MeshStandardMaterial({color:0x0a1218,roughness:0.08,metalness:0.6}));bWater.rotation.x=-Math.PI/2;bWater.position.set(0,-0.25,0);BG.add(bWater);
{const c=new THREE.Mesh(new THREE.BoxGeometry(60,0.3,4),M({color:0x1a1410}));c.position.set(0,-0.42,0);BG.add(c)}
for(const sd of [-1,1]){const bank=new THREE.Mesh(new THREE.BoxGeometry(60,0.4,0.6),M({color:0x3a3020}));bank.position.set(0,-0.1,sd*2.2);bank.rotation.x=sd*0.5;BG.add(bank)}
// cầu ván
const plankM=M({map:plank('#5a4a36')});box(0.9,0.06,4.8,plankM,0,0.12,0,BG);
for(const z of [-2,-0.7,0.7,2])for(const x of [-0.4,0.4])box(0.07,0.9,0.07,M({color:0x3a2c1c}),x,-0.2,z,BG);
for(const x of [-0.45,0.45])box(0.04,0.04,4.8,M({color:0x4a3a26}),x,0.75,0,BG);
for(const z of [-2,-0.7,0.7,2])for(const x of [-0.45,0.45])box(0.04,0.65,0.04,M({color:0x4a3a26}),x,0.45,z,BG);
// bãi tha ma bên kia (z<-2.5)
const graveM=M({color:0x5a5040}),stoneM=M({color:0x8a8a82});
for(let k=0;k<14;k++){const x=(R(k)-0.5)*16,z=-4-R(k+3)*8;const m=new THREE.Mesh(new THREE.SphereGeometry(0.7,12,8,0,Math.PI*2,0,Math.PI/2),graveM);m.scale.set(1,0.45,1.4);m.position.set(x,0,z);BG.add(m);box(0.35,0.55,0.08,stoneM,x,0.3,z+0.95,BG)}
// nhang cắm hai đầu cầu (cảnh kết)
const NHANG=new THREE.Group();BG.add(NHANG);for(let k=0;k<16;k++){const s=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,0.4,4),M({color:0x8a2a1a}));s.position.set((k%2?0.7:-0.7)+(R(k)-0.5)*0.3,0.2,(k<8?2.6:-2.6)+(R(k+5)-0.5)*0.4);NHANG.add(s);const t=new THREE.Mesh(new THREE.SphereGeometry(0.015,6,4),new THREE.MeshBasicMaterial({color:0xff6a20}));t.position.set(s.position.x,0.41,s.position.z);NHANG.add(t)}NHANG.visible=false;
// cây
for(let k=0;k<8;k++){const t=new THREE.Group();t.position.set((k%2?1:-1)*(3+R(k)*6),0,(R(k+1)-0.5)*14);BG.add(t);box(0.25,3+R(k)*2,0.25,M({color:0x2a2018}),0,1.5,0,t);for(let j=0;j<3;j++){const s=new THREE.Mesh(new THREE.SphereGeometry(1.2+R(k*j)*0.6,10,8),M({color:0x1e3018}));s.position.set((R(k+j)-0.5)*1.6,3.4+R(j)*1.2,(R(k*3+j)-0.5)*1.6);t.add(s)}}
const bHemi=new THREE.HemisphereLight(0x5a6a9a,0x0a0a0a,0.35);brg.add(bHemi);const bMoon=new THREE.DirectionalLight(0x9ab0e0,0.9);bMoon.position.set(-5,9,6);bMoon.castShadow=true;brg.add(bMoon);
const bLamp=new THREE.PointLight(0xffb070,0,6,1.5);brg.add(bLamp);const bCold=new THREE.PointLight(0xa8c0d8,0,5,1.5);brg.add(bCold);
const bMist=[];for(let k=0;k<10;k++){const m=new THREE.Mesh(new THREE.PlaneGeometry(4,1),new THREE.MeshBasicMaterial({map:dustTex,transparent:true,opacity:0.12,depthWrite:false,color:0xc8d0e0}));m.position.set((R(k)-0.5)*14,0.3,(R(k+2)-0.5)*8);m.rotation.x=-Math.PI/2.2;brg.add(m);bMist.push(m)}
function brgReset(){bLamp.intensity=0;bCold.intensity=0;NHANG.visible=false}
