// ================= RỪNG TRÀM U MINH (x 145..240) =================
const skyDawn=mkSky([[0,'#2a3040'],[0.6,'#5a6270'],[1,'#8a8a88']]);
const RX=150,KX=166,KZ=-1.6,GX=206,GZ=0;
const barkT=ctex(256,512,(g,w,h)=>{g.fillStyle='#bdb8aa';g.fillRect(0,0,w,h);for(let k=0;k<170;k++){const l=R(k)>0.5;g.fillStyle=`rgba(${l?235:70},${l?230:64},${l?218:56},${0.25+R(k+1)*0.35})`;g.fillRect(R(k*3)*w,R(k*5)*h,4+R(k)*34,10+R(k+2)*70)}
 for(let k=0;k<40;k++){g.strokeStyle='rgba(40,36,30,.45)';g.lineWidth=1.5;g.beginPath();const x=R(k*7)*w;g.moveTo(x,0);g.bezierCurveTo(x+10,h*0.3,x-10,h*0.6,x+(R(k)-0.5)*20,h);g.stroke()}},[1,2]);
const barkM=M({map:barkT,color:0xd8d4c8});
const swampM=new THREE.MeshStandardMaterial({color:0x2a2116,roughness:0.12,metalness:0.45});
{const w=new THREE.Mesh(new THREE.PlaneGeometry(100,96),swampM);w.rotation.x=-Math.PI/2;w.position.set(RX+50+2,0.04,0);w.receiveShadow=true;ext.add(w)}
const fernT=cardTex(256,256,g=>{for(let i=0;i<7;i++){g.save();g.translate(128,256);g.rotate(-1.0+i*0.33+(R(i)-0.5)*0.15);g.strokeStyle='#24401e';g.lineWidth=4;g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(10,-120,0,-220+R(i)*30);g.stroke();
 for(let k=2;k<22;k++){const y=-k*10,ln=26*(1-k/24)+6;g.fillStyle=`rgb(${40+R(i*k)*30},${78+R(k)*40},${34})`;for(const sd of [-1,1]){g.beginPath();g.moveTo(0,y);g.quadraticCurveTo(sd*ln*0.6,y-6,sd*ln,y+4);g.lineTo(0,y+5);g.fill()}}g.restore()}});
const choaiT=cardTex(512,512,g=>{for(let i=0;i<46;i++){const x=40+R(i)*430,y=512;g.strokeStyle=`rgb(${28+R(i)*20},${54+R(i+1)*30},${26})`;g.lineWidth=5;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+(R(i+2)-0.5)*120,300,x+(R(i+3)-0.5)*200,60+R(i+4)*160);g.stroke();
 for(let k=0;k<14;k++){const t=k/14,px=x+(R(i+3)-0.5)*200*t,py=y-(y-60-R(i+4)*160)*t;g.fillStyle=`rgba(${34+R(k+i)*30},${70+R(k)*50},${30},.95)`;g.beginPath();g.ellipse(px+(k%2?14:-14),py,16,6,(k%2?0.5:-0.5),0,7);g.fill()}}});
const leafT=cardTex(512,256,g=>{for(let k=0;k<420;k++){const x=R(k)*512,y=40+R(k+1)*200;g.fillStyle=`rgba(${36+R(k+2)*30},${64+R(k+3)*40},${36},.92)`;g.beginPath();g.ellipse(x,y,16,4,R(k+4)*3,0,7);g.fill()}});
const TREES=[];
function tram(x,z,r,h,lean=0,par=ext){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.z=lean;g.rotation.y=R(x*3+z)*6;par.add(g);
 const t=new THREE.Mesh(new THREE.CylinderGeometry(r*0.7,r,h,9),barkM);t.position.y=h/2;t.castShadow=true;t.receiveShadow=true;g.add(t);
 if(R(x+z*7)>0.35){for(let k=0;k<2;k++){const f=new THREE.Mesh(new THREE.PlaneGeometry(4,2),new THREE.MeshStandardMaterial({map:leafT,transparent:true,alphaTest:0.3,side:THREE.DoubleSide}));f.position.y=h-0.6;f.rotation.y=k*1.57;g.add(f)}}
 TREES.push(g);return g}
for(let i=0;i<300;i++){const x=RX+1+R(i+700)*86,z=-44+R(i+701)*88;
 if(Math.hypot(x-GX,z-GZ)<6.5)continue;if(Math.hypot(x-KX,z-KZ)<2.2)continue;if(x<200&&Math.abs(z)<1.3)continue;if(Math.hypot(x-RX+2,z-2.5)<2.5)continue;
 tram(x,z,0.09+R(i)*0.08,9+R(i+3)*5,(R(i+4)-0.5)*0.06)}
// bìa rừng: hàng tràm thưa
for(let i=0;i<30;i++){const z=-40+i*2.8+R(i+900);if(Math.abs(z-2.5)<3)continue;tram(RX-0.5+R(i+901)*1.5,z,0.1,10+R(i)*3,0)}
const FERNS=[];for(let i=0;i<420;i++){const x=RX+R(i+1200)*88,z=-40+R(i+1201)*80;if(x<200&&Math.abs(z)<0.8)continue;if(Math.hypot(x-GX,z-GZ)<3.5)continue;const s=0.6+R(i)*0.7;FERNS.push(flatCard(fernT,s*1.2,s,x,s/2,z,ext,R(i)*3))}
// bụi choại quanh gò + rải rác
const CHOAI=[];for(const [x,z,s] of [[GX+2.2,1.9,1.5],[GX+3.2,0.4,1.4],[GX-2.6,2.4,1.3],[GX-3.4,-1.6,1.5],[GX+1,-3.6,1.6],[GX+3.8,-2.4,1.3],[178,-3.5,1.2],[186,3.2,1.3],[193,-2.8,1.2],[171,3.4,1.1]]){CHOAI.push(flatCard(choaiT,s*1.4,s,x,s/2,z,ext,R(x)*2));CHOAI.push(flatCard(choaiT,s*1.4,s,x,s/2,z,ext,R(x)*2+1.4))}
// miếu ông Tà ở đầu đường mòn
const MIEU=new THREE.Group();ext.add(MIEU);MIEU.position.set(RX-2.2,0,2.5);
cyl(0.06,0.07,1.05,M({color:0x4a3420}),0,0.52,0,MIEU,8);box(0.7,0.04,0.5,M({map:woodT}),0,1.06,0,MIEU);
box(0.66,0.46,0.04,M({map:woodT,color:0x8a6a48}),0,1.3,-0.22,MIEU);for(const sd of [-1,1])box(0.04,0.46,0.46,M({map:woodT,color:0x8a6a48}),sd*0.32,1.3,0,MIEU);
for(const sd of [-1,1]){const r=new THREE.Mesh(new THREE.BoxGeometry(0.84,0.03,0.42),M({map:thatchT}));r.position.set(0,1.62,sd*0.16);r.rotation.x=sd*0.55;r.castShadow=true;MIEU.add(r)}
box(0.6,0.12,0.02,M({color:0xa01818}),0,1.5,0.235,MIEU);
const MBOWL=cyl(0.06,0.045,0.06,M({color:0xd8d0c0,roughness:0.5}),0,1.11,0.04,MIEU,10);const MSTICK=[];for(let k=-1;k<=1;k++)MSTICK.push(cyl(0.004,0.004,0.2,M({color:0xb06a30,emissive:0x662010}),k*0.02,1.22,0.04,MIEU,4));
const MCUP=cyl(0.035,0.03,0.03,M({color:0xe8e2d6}),0.18,1.1,0.08,MIEU,10);const MHONEY=new THREE.Mesh(new THREE.CircleGeometry(0.1,14),M({color:0xd89a20,roughness:0.15}));MHONEY.rotation.x=-Math.PI/2;MHONEY.position.set(0.16,1.085,0.1);MIEU.add(MHONEY);
for(const [x,z] of [[-0.12,0.0],[-0.2,0.06]])cyl(0.03,0.03,0.04,M({color:0x1a1a1a,roughness:0.3}),x,1.1,z,MIEU,8);
function mieu(st){const over=st==='over';MBOWL.rotation.z=over?1.6:0;MBOWL.position.set(over?0.05:0,over?1.1:1.11,0.04);MCUP.rotation.z=over?1.5:0;MHONEY.visible=over;MHONEY.scale.setScalar(over?1.6:0.5);MSTICK.forEach(s=>s.visible=st==='lit')}
// đường mòn đất từ xóm ra bìa rừng
{const p=new THREE.Mesh(new THREE.PlaneGeometry(150,1.6),M({color:0x4e4030}));p.rotation.x=-Math.PI/2;p.position.set(75,0.013,2.5);ext.add(p)}
// kèo ong
function keoOng(x,z,big){const g=new THREE.Group();g.position.set(x,0,z);ext.add(g);const L=big?0:3.8;
 if(!big){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.07,L,8),barkM);p.position.set(0,1.1,0);p.rotation.z=-1.05;p.castShadow=true;g.add(p);
  const st=cyl(0.04,0.05,2.1,M({color:0x5a4430}),1.4,1.05,0,g,6);}
 const comb=new THREE.Group();g.add(comb);const cm=new THREE.Mesh(new THREE.SphereGeometry(0.5,20,14,0,Math.PI*2,Math.PI/2,Math.PI/2),M({color:0xd09a2a,roughness:0.35,map:combT,side:THREE.DoubleSide}));cm.scale.set(1,1.1,0.2);comb.add(cm);cm.castShadow=true;
 const dk=new THREE.Mesh(new THREE.SphereGeometry(0.5,20,14,0,Math.PI*2,Math.PI/2,Math.PI/2),M({color:0x8a5a1a,roughness:0.6}));dk.scale.set(0.45,0.5,0.22);dk.position.set(-0.05,0,0);comb.add(dk);
 comb.position.set(big?0:0.9,big?0:1.62,0);g.userData={comb,cm,dk};return g}
const combT=ctex(256,256,(g,w,h)=>{g.fillStyle='#d8a030';g.fillRect(0,0,w,h);g.strokeStyle='rgba(120,70,10,.6)';g.lineWidth=2;for(let y=0;y<h;y+=14)for(let x=0;x<w;x+=16){const xx=x+((y/14)%2)*8;g.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3;g.lineTo(xx+7*Math.cos(a),y+7*Math.sin(a))}g.closePath();g.stroke()}});
const KEO1=keoOng(KX,KZ,false);
// bầy ong
const BEES=[];for(let i=0;i<60;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({color:0x1a1408,transparent:true,opacity:0.9}));s.scale.setScalar(0.035);ext.add(s);s.visible=false;BEES.push(s)}
function bees(on,cx,cy,cz,T,r=1.2){BEES.forEach((b,i)=>{b.visible=on;if(!on)return;const a=T*(1.5+R(i)*2)+R(i+3)*6;b.position.set(cx+Math.cos(a)*r*R(i+5),cy+Math.sin(a*1.3)*0.6*R(i+6)+R(i)*0.6,cz+Math.sin(a)*r*R(i+7))})}
// gò ông Tà
{const m=new THREE.Mesh(new THREE.SphereGeometry(5,32,16,0,Math.PI*2,0,Math.PI/2),M({map:dirtT,color:0x6a5a40}));m.scale.set(1,0.18,1);m.position.set(GX,0,GZ);m.receiveShadow=true;ext.add(m);
 for(let k=0;k<26;k++){const a=R(k+40)*6.28,r=1+R(k+41)*3.6;flatCard(grassT,0.9,0.4,GX+Math.cos(a)*r,0.2+0.9*(1-r*r/25)*0.9,GZ+Math.sin(a)*r,ext,R(k)*3)}}
const GH=0.86;// độ cao mặt gò quanh gốc
const OLDT=new THREE.Group();ext.add(OLDT);OLDT.position.set(GX,0,GZ-1.2);
{const t=new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.55,15,12),barkM);t.position.y=7.5;t.castShadow=true;OLDT.add(t);
 const b=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.17,4.4,9),barkM);b.position.set(1.9,4.0,0.2);b.rotation.z=-1.12;b.castShadow=true;OLDT.add(b);
 for(let k=0;k<3;k++){const f=new THREE.Mesh(new THREE.PlaneGeometry(6,3),new THREE.MeshStandardMaterial({map:leafT,transparent:true,alphaTest:0.3,side:THREE.DoubleSide}));f.position.set(0,14.5,0);f.rotation.y=k*1.05;OLDT.add(f)}
 // rễ
 for(let k=0;k<6;k++){const a=k*1.05+0.3;const r=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.14,1.4,6),barkM);r.position.set(Math.cos(a)*0.7,GH-0.15,Math.sin(a)*0.7);r.rotation.z=Math.cos(a)*1.2;r.rotation.x=-Math.sin(a)*1.2;OLDT.add(r)}}
const KEOTA=keoOng(GX+2.3,GZ-1.0,true);KEOTA.position.y=3.0;KEOTA.userData.comb.scale.setScalar(2.2);
function keota(st){const c=KEOTA.userData;c.cm.visible=st==='full';c.dk.visible=st==='full';c.comb.visible=st!=='none';
 if(st==='dead'){c.comb.visible=true;c.cm.visible=true;c.cm.material=c.cm.userData.dm||(c.cm.userData.dm=M({color:0x1a120a,roughness:0.9}))}else if(c.cm.userData.dm){c.cm.material=c.cm.userData.lm||(c.cm.userData.lm=M({color:0xd09a2a,roughness:0.35,map:combT}))}}
// đồ người mất tích dưới gốc
const RELICS=new THREE.Group();ext.add(RELICS);RELICS.position.set(GX+0.9,GH,GZ+0.1);
{for(const [x,z,r] of [[0,0,0.3],[0.22,0.12,-0.2]]){const d=box(0.11,0.025,0.26,M({color:0x6a3a2a}),x,0.012,z,RELICS);d.rotation.y=r}
 const n=new THREE.Mesh(new THREE.ConeGeometry(0.34,0.16,20,1,true),M({color:0xb8a470,side:THREE.DoubleSide}));n.position.set(-0.6,0.12,0.35);n.rotation.z=1.2;RELICS.add(n);
 const kp=box(0.1,0.02,0.03,M({color:0x9a2a24,metalness:0.5,roughness:0.4}),0.45,0.02,0.45,RELICS);
 const kp2=box(0.06,0.02,0.02,M({color:0x6a5a40}),0.5,0.02,0.45,RELICS)}
const MATPOOL=new THREE.Mesh(new THREE.CircleGeometry(0.7,20),M({color:0xd89a20,roughness:0.1,emissive:0x2a1a00}));MATPOOL.rotation.x=-Math.PI/2;MATPOOL.position.set(GX+0.4,GH+0.02,GZ-0.5);ext.add(MATPOOL);MATPOOL.visible=false;
const GSTICK=[];for(let k=-1;k<=1;k++)GSTICK.push(cyl(0.005,0.005,0.3,M({color:0xb06a30,emissive:0x662010}),GX+0.6+k*0.05,GH+0.15,GZ+0.4,ext,4));
// xác Sáu Lộc
const CORPSE=lying(()=>locCorpse(),1.75);ext.add(CORPSE);
// đèn đuốc + đèn ma xanh
const torchL=new THREE.PointLight(0xffa050,0,14,1.3);torchL.castShadow=true;torchL.shadow.mapSize.set(512,512);torchL.shadow.bias=-0.004;ext.add(torchL);
const torchL2=new THREE.PointLight(0xffa050,0,12,1.4);ext.add(torchL2);
const WISP=[];for(let i=0;i<6;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:dustTex,color:0x80ffb0,transparent:true,opacity:0.0,depthWrite:false,fog:false}));s.scale.setScalar(0.35);ext.add(s);WISP.push(s)}
function wisps(on,T,cx,cz){WISP.forEach((s,i)=>{s.visible=on;s.material.opacity=on?0.55+0.3*Math.sin(T*3+i):0;s.position.set(cx+Math.sin(T*0.3+i*2)*3+R(i)*4-2,0.9+Math.sin(T*1.1+i)*0.3,cz-2-R(i+3)*4)})}
// ghe lái mật ở vàm kênh
const GHE=new THREE.Group();ext.add(GHE);GHE.position.set(-34,0.05,16.5);
{const hm=M({map:woodT,color:0x6a4a2a});box(6,0.6,1.8,hm,0,0.3,0,GHE);for(const sd of [-1,1]){const c=new THREE.Mesh(new THREE.ConeGeometry(0.95,1.6,4),hm);c.rotation.z=sd*Math.PI/2;c.rotation.x=Math.PI/4;c.scale.set(1,1,0.6);c.position.set(sd*3.7,0.35,0);GHE.add(c)}
 const mui=new THREE.Mesh(new THREE.CylinderGeometry(1.0,1.0,2.6,16,1,true,0,Math.PI),M({map:thatchT,side:THREE.DoubleSide}));mui.rotation.z=Math.PI/2;mui.position.set(-0.6,0.6,0);mui.castShadow=true;GHE.add(mui);
 for(let i=0;i<4;i++){const k=jar(0.25,0.9+i*0.55,0,GHE,0x7a5a3a,1.0);k.position.y=0.85}
 const lt=new THREE.Mesh(new THREE.SphereGeometry(0.1,10,8),new THREE.MeshBasicMaterial({color:0xffd090}));lt.position.set(1.5,1.5,0.3);GHE.add(lt)}
const gheL=new THREE.PointLight(0xffb060,0,9,1.5);gheL.position.set(-32.5,1.6,16.8);ext.add(gheL);
const XUONGN=xuong();XUONGN.position.set(-30.5,0.04,15.0);
// tràm gần máy quay thì ẩn (khỏi che)
function hideNear(){for(const g of TREES){const dx=g.position.x-cam.position.x,dz=g.position.z-cam.position.z;g.visible=dx*dx+dz*dz>1.7}}
function forest(m){// m: 'day' | 'night' | 'dawn'
 tod(m==='day'?'day':m==='dawn'?'dawn':'night');if(m==='dawn'){skyM.material.map=skyDawn;skyM.material.needsUpdate=true}ext.fog.density=m==='day'?0.03:m==='dawn'?0.045:0.055;ext.fog.color.set(m==='day'?0x8a9a88:m==='dawn'?0x5a5a62:0x0a1018);
 if(m==='day'){sunD.intensity=1.6;sunD.position.set(RX+40,30,20);sunD.target.position.set(RX+40,0,0)}else{sunD.position.set(20,30,15);sunD.target.position.set(0,0,0)}
 moonDir.position.set(RX+20,25,25);moonDir.target.position.set(RX+40,0,0);if(m==='night')moonDir.intensity=0.7;hemi.intensity=m==='day'?1.1:0.55}
