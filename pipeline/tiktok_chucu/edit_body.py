b=open('body.part').read()
b=b.replace("{const c=new THREE.Mesh(new THREE.PlaneGeometry(1.22,0.5),M({map:redClothT}));c.position.set(4.5,0.55,-1.86);HOUSE.add(c)}","")
b=b.replace("for(const x of [3.9,5.1]){const b=new THREE.Mesh(new THREE.PlaneGeometry(0.16,0.4),M({map:buaT}));b.position.set(x,1.7,-2.49);HOUSE.add(b)}","")
b=b.replace("nhang(HOUSE,4.1,0.8,-2.1);","")
b=b.replace("box(1.2,0.8,0.55,M({color:0x5a2a1a}),4.5,0.4,-2.15,HOUSE);","box(1.6,0.8,0.55,M({map:plank('#5a4030')}),4.5,0.4,-2.15,HOUSE);")
i=b.index('// ================= nhân vật =================')
add='''FOUND.visible=false;
// ===== BẾP (buồng x 3..6) =====
const STOVE=new THREE.Group();HOUSE.add(STOVE);STOVE.position.set(4.0,0.8,-2.15);
{const s=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.25,0.18,14),M({color:0x6a3a24}));s.position.y=0.09;STOVE.add(s);
 const pot=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.16,0.22,18),M({color:0x1a1a1a,metalness:0.5,roughness:0.5}));pot.position.y=0.29;STOVE.add(pot);
 const lid=new THREE.Mesh(new THREE.CylinderGeometry(0.21,0.21,0.03,18),M({color:0x2a2a2a,metalness:0.5}));lid.position.y=0.41;STOVE.add(lid);STOVE.userData.lid=lid}
const stoveL=new THREE.PointLight(0xff7a30,0,3,1.5);stoveL.position.set(4.0,0.85,-1.8);HOUSE.add(stoveL);
// bàn ăn trong bếp + 2 ghế đẩu
const KT=[4.5,-0.75];
box(1.1,0.06,0.7,M({map:plank('#6a4426')}),KT[0],0.62,KT[1],HOUSE);for(const [a,c] of [[-0.48,-0.28],[0.48,-0.28],[-0.48,0.28],[0.48,0.28]])box(0.05,0.62,0.05,M({color:0x4a2a16}),KT[0]+a,0.31,KT[1]+c,HOUSE);
function mkBowl(x,z,o={}){const g=new THREE.Group();g.position.set(x,0.65,z);HOUSE.add(g);const b=new THREE.Mesh(new THREE.SphereGeometry(0.065,14,10,0,Math.PI*2,Math.PI/2,Math.PI/2),M({color:0xe8e4d8,side:THREE.DoubleSide}));b.rotation.x=Math.PI;b.position.y=0.065;g.add(b);
 const r=new THREE.Mesh(new THREE.SphereGeometry(0.058,12,8),M({color:0xf4f2ea}));r.scale.y=0.45;r.position.y=0.07;g.add(r);g.userData.rice=r;
 const ch=new THREE.Group();for(const sd of [-1,1]){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.004,0.004,0.24,4),M({color:0x6a4a2a}));c.position.set(sd*0.008,0.18,0);ch.add(c)}g.add(ch);g.userData.ch=ch;return g}
const BW=[mkBowl(KT[0]-0.25,KT[1]-0.1),mkBowl(KT[0]+0.25,KT[1]-0.1),mkBowl(KT[0],KT[1]+0.18)];
function bowls(n,o={}){BW.forEach((b,k)=>{b.visible=k<n;b.userData.ch.visible=k===0&&!!o.upright;b.userData.rice.visible=k===0||!!o.full})}
// gạo sống + giòi đổ ra bàn
const SPILL=new THREE.Group();HOUSE.add(SPILL);SPILL.position.set(KT[0]+0.1,0.655,KT[1]);
for(let k=0;k<70;k++){const r=new THREE.Mesh(new THREE.SphereGeometry(0.006+R(k)*0.004,5,4),M({color:k%7?0xe8e2d0:0xd8d0a8}));r.scale.set(1,0.6,1.8);r.position.set((R(k+1)-0.5)*0.36,0,(R(k+2)-0.5)*0.24);r.rotation.y=R(k)*3;SPILL.add(r)}SPILL.visible=false;
// lu nước trong bếp + vũng nước tràn
const LU=new THREE.Group();HOUSE.add(LU);LU.position.set(5.5,0,-0.1);{const lu=new THREE.Mesh(new THREE.SphereGeometry(0.32,16,12),M({color:0x5a3a24,roughness:0.6}));lu.scale.y=1.2;lu.position.y=0.38;lu.castShadow=true;LU.add(lu);const lid=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,0.04,16),M({map:plank('#6a4a2a')}));lid.position.y=0.78;LU.add(lid)}
const PUDDLE=new THREE.Mesh(new THREE.CircleGeometry(1,28),new THREE.MeshStandardMaterial({color:0x22303a,roughness:0.05,metalness:0.6,transparent:true,opacity:0.85}));PUDDLE.rotation.x=-Math.PI/2;PUDDLE.position.set(5.0,0.006,-0.3);PUDDLE.scale.set(1,1,1);HOUSE.add(PUDDLE);PUDDLE.visible=false;
const kitL=new THREE.PointLight(0xffa850,0,6,1.4);kitL.position.set(4.6,1.5,-0.6);inn.add(kitL);
'''
b=b[:i]+add+b[i:]
b=b.replace("const defs={","const defs={phuc:(T,o)=>phuc(256,1000,2.25,Object.assign({T},o)),lien:(T,o)=>lien(256,1000,2.25,Object.assign({T},o)),bay:(T,o)=>baBay(256,1000,2.25,Object.assign({T},o)),tu:(T,o)=>ongTu(256,1000,2.25,Object.assign({T},o)),gs:(T,o)=>baSau(256,1000,2.25,T,o),")
# remove old 'tu'/'bay' keys in defs
b=b.replace("tu:(T,o)=>thayTu(256,1000,2.25,Object.assign({T},o)),","").replace("bay:(T,o)=>thayBay(256,1000,2.25,Object.assign({T},o)),","")
b=b.replace("if(k==='ma'||k==='ml'||k==='bm'||k==='gb')","if(k==='ma'||k==='ml'||k==='bm'||k==='gb'||k==='gs')")
b=b.replace("eFill.intensity=0}","eFill.intensity=0;stoveL.intensity=0;kitL.intensity=0;SPILL.visible=false;PUDDLE.visible=false;bowls(0);POT.visible=false}")
open('body.part','w').write(b)
