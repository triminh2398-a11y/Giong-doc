// ================= CẢNH TẬP 3: MA GIẤU RỪNG U MINH =================
const m=(code,si)=>TK(code,si);
const IN=(md)=>{innMode(md);return 'inn'};
const fl=(T)=>1+Math.sin(T*13)*0.1+Math.sin(T*7.3)*0.08;
function torch3(x,y,z,T,k=1,L=torchL){L.position.set(x,y,z);L.intensity=9*k*fl(T)}
// thêm tràm sau xóm ("lưng dựa vô rừng tràm")
for(let i=0;i<46;i++){const x=-34+R(i+3100)*70,z=-16-R(i+3101)*16;tram(x,z,0.09+R(i)*0.06,9+R(i+2)*4,0)}
// dấu chân bùn
const FOOT=[];{const ft=cardTex(128,256,g=>{g.fillStyle='rgba(30,20,12,.95)';g.beginPath();g.ellipse(64,170,30,62,0,0,7);g.fill();for(let k=0;k<5;k++){g.strokeStyle='rgba(30,20,12,.95)';g.lineWidth=9;g.lineCap='round';g.beginPath();g.moveTo(44+k*10,120);g.quadraticCurveTo(30+k*16,40,20+k*22,8+Math.abs(k-2)*10);g.stroke()}});
 for(let i=0;i<10;i++){const p=new THREE.Mesh(new THREE.PlaneGeometry(0.16,0.32),new THREE.MeshBasicMaterial({map:ft,transparent:true,depthWrite:false}));p.rotation.x=-Math.PI/2;ext.add(p);p.visible=false;FOOT.push(p)}}
function feet(on,x0,z0,dx,dz){FOOT.forEach((p,i)=>{p.visible=on;if(!on)return;const k=i;p.position.set(x0+dx*k+(k%2?0.12:-0.12)*dz,0.02,z0+dz*k+(k%2?0.12:-0.12)*-dx);p.rotation.z=Math.atan2(dx,dz)+Math.PI})}
const THAU3=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.22,0.08,24),M({color:0xc99a3a,metalness:0.6,roughness:0.35}));THAU3.position.set(RX-3.8,0.05,5.3);THAU3.rotation.z=0.15;ext.add(THAU3);
const _ra=resetAll;resetAll=function(t){_ra(t);feet(false);THAU3.visible=false;KEOTA.position.y=3.3;GHE.visible=true}
// -------- thẻ phẳng --------
S.title=(lt,D,T)=>flat2(F.title,lt,D,T);
S.cta0=(lt,D,T)=>flat2(F.cta,lt,D,T,false);
S.ctamid=(lt,D,T)=>flat2(F.cta,lt,D,T,false);
S.cta1=(lt,D,T)=>flat2(F.cta,lt,D,T,true);
S.chap1=(lt,D,T)=>flat2(F.chap,lt,D,T,'MỘT','Kèo ong ông Tà');
S.chap2=(lt,D,T)=>flat2(F.chap,lt,D,T,'HAI','Gõ thau tìm người');
S.chap3=(lt,D,T)=>flat2(F.chap,lt,D,T,'BA','Người đi phía trước');
S.chap4=(lt,D,T)=>flat2(F.chap,lt,D,T,'BỐN','Tiếng thau không được dứt');
S.chap5=(lt,D,T)=>flat2(F.chap,lt,D,T,'NĂM','Người về từ rừng');
// -------- MỞ ĐẦU --------
S.hook=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);put(C.MA,190,-0.4,{a:si===0?0.75:1,open:si===0?0.3:0.9,glow:si===0?0.5:1.5,arms:[0.15,-0.15]},-0.22);ghostL.position.set(188.8,1.6,0.3);ghostL.color.set(0xff6050);ghostL.intensity=si===0?1.2:5;wisps(true,T,190,-1);
 cams(lt,ls,[[[174,1.5,1.4],[190,1.6,-0.3],40,[4,0.1,-0.3]],[[187.4,1.95,0.35],[190,2.0,-0.4],32,[0.5,0,-0.1]]],D);return 'ext'};
S.hook2=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);put(C.N1,RX-3.4,1.2,{thau:true});put(C.N2,RX-4.4,3.6,{thau:true});put(C.D1,RX-2.6,4.6,{torch:true});put(C.D2,RX-5.2,0.2,{torch:true});
 torch3(RX-2.3,2.0,4.8,T);torch3(RX-4.9,2.0,0.4,T,0.8,torchL2);put(C.MA,RX+5,1.5,{a:0.8,glow:0.6,arms:[0.15,-0.15]},-0.22);ghostL.position.set(RX+4,1.5,2);ghostL.color.set(0xff6050);ghostL.intensity=1.0;
 cams(lt,ls,[[[RX-12,1.8,6],[RX-2,1.4,2],40,[2,0,-1]],[[RX-8,1.6,-3.5],[RX+5,1.8,1.5],30,[0.8,0,0]]],D);return 'ext'};
S.hook3=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===0){forest('night');put(C.NHAN,RX-3,2.5,{thau:true,gonk:1});torch3(RX-3.4,1.8,4,T,0.9);
  cams(lt,ls,[[[RX-7.5,1.5,6.5],[RX-2.6,1.3,2.2],38,[1,0,-0.8]]],D);return 'ext'}
 innMode('night');NET.visible=false;lampAt(-1.8,0.2,0.5);lampL.intensity*=0.6;put(CI.NHAN,-3.0,-1.3,{sit:true,eyes:1.25,look:0.6},0.12);put(CI.TAM,-2.4,-2.2,{sit:true,back:true,fake:true},0.12);
 cams(lt,ls,[[],[[-2.0,1.5,1.6],[-3.0,1.0,-1.7],38,[-0.2,0,-0.3]]],D);return 'inn'};
// -------- CHƯƠNG 1 --------
S.xom=(lt,D,T,ls)=>{tod('day');XUONG.position.x=4.5-lt*0.25;put(C.D1,XUONG.position.x,13.2,{},0.25);put(C.N1,-3.4,6.4,{});put(C.D2,6,6.8,{});
 cams(lt,ls,[[[-14,5,26],[0,1.5,6],42,[6,-1,-2]],[[10,2.2,20],[0,1.5,3],40,[-3,0,-1]],[[8,1.6,9],[0,1,16],40,[-1,0,0]]],D);return 'ext'};
S.keo=(lt,D,T,ls)=>{forest('day');const si=siOf(lt,ls);bees(true,KX+0.9,1.3,KZ,T,1.4);if(si>=1)put(C.TAM,KX-0.6,KZ+1.6,{cui:si===1,t:T},-0.22);if(si===2)put(C.LOC,KX-2.0,KZ+2.0,{look:0.6},-0.22);
 cams(lt,ls,[[[KX-3,1.4,KZ+4],[KX+0.8,1.3,KZ],36,[0.6,0,-0.6]],[[KX-3.6,1.5,KZ+4.6],[KX,1.2,KZ+0.4],38,[0.5,0,-0.4]],[[KX-2.2,1.5,KZ+5.6],[KX-0.8,1.2,KZ+1.4],36,[0,0,-0.6]]],D);return 'ext'};
S.nha=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.TAM,-1.8,5.4,{sit:true},0.0);if(si>=1){put(C.NHAN,0.9,6.2,{});put(C.THUY,2.0,6.6,{smile:true})}
 cams(lt,ls,[[[-0.8,1.5,9.5],[-1.6,1.1,5.2],36,[0,0,-0.8]],[[1.8,1.5,9.4],[1.4,1.3,6.3],34,[0,0,-0.6]],[[0.2,1.7,11],[0,1.2,5.6],40,[0,0,-1]]],D);return 'ext'};
S.nha2=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);NET.visible=false;put(CI.TAM,-2.8,-0.75,{sit:true,mouth:m('TAM',si)},0.0);put(CI.NHAN,-1.6,-0.3,{bowl:true,mouth:m('NHAN',si),arm:[0.12,-0.6]});if(si===2)put(CI.THUY,0.6,0.3,{});
 cams(lt,ls,[[[-1.0,1.5,2.8],[-2.2,1.1,-0.6],36,[-0.2,0,-0.3]],[[-1.8,1.4,2.0],[-2.8,1.15,-0.8],30],[[0.6,1.6,4.0],[-1.4,1.1,-0.4],40,[-0.3,0,-0.4]]],D);return 'inn'};
S.loc=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);bthL.intensity=0;put(C.LOC,-15.6,7.2,{look:-0.3});if(si===2){put(C.HOA,-16.8,7.6,{tear:true});put(C.D3,-13.0,6.4,{look:-1})}
 cams(lt,ls,[[[-12.8,1.6,10.2],[-15.8,1.3,6.8],36,[-0.5,0,-0.4]],[[-14.4,1.5,10.2],[-15.6,1.35,7.2],30],[[-11.8,1.6,10.2],[-15.2,1.2,7.6],40,[0,0,-0.4]]],D);return 'ext'};
S.loc2=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.TAM,-0.4,6.0,{mouth:m('TAM',si),look:-0.6});put(C.LOC,-1.6,6.5,{mouth:m('LOC',si),look:0.6});
 cams(lt,ls,[[[-2.4,1.5,9.0],[-1.4,1.4,6.4],30],[[0.6,1.5,9.0],[-0.5,1.4,6.0],30],[[-2.4,1.5,9.0],[-1.4,1.4,6.4],30],[[-1.0,1.7,10.4],[-1.0,1.2,6.2],38,[0,0,-0.8]]],D);return 'ext'};
const mieuSet=(T,st)=>{forest('day');mieu(st)};
S.mieu=(lt,D,T,ls)=>{const si=siOf(lt,ls);mieuSet(T,si===2?'lit':'ok');put(C.TAM,RX-3.0,3.6,{back:si!==1,look:0.6});put(C.LOC,RX-4.0,4.6,{look:0.4});
 cams(lt,ls,[[[RX-5.5,1.6,6.5],[RX-2.2,1.3,2.5],34,[0.6,0,-0.5]],[[RX-0.8,1.5,4.6],[RX-2.2,1.25,2.5],32,[-0.2,0,-0.2]],[[RX-6,1.6,7],[RX-2.6,1.3,3],38,[0.4,0,-0.4]]],D);return 'ext'};
S.mieu2=(lt,D,T,ls)=>{const si=siOf(lt,ls);mieuSet(T,'lit');put(C.TAM,RX-2.0,3.6,{mouth:m('TAM',si),look:-0.5});put(C.LOC,RX-3.4,4.4,{mouth:m('LOC',si),look:0.5});
 const A=[[RX-5.4,1.5,6.0],[RX-3.2,1.4,4.4],30],B=[[RX-0.6,1.5,7.0],[RX-2.0,1.4,3.6],30],W=[[RX-6.2,1.7,8.0],[RX-2.6,1.2,3.6],38,[0.4,0,-0.6]];
 cams(lt,ls,[A,B,B,B,A,B,W],D);return 'ext'};
const walk=(lt,x0,v)=>x0+lt*v;
S.rung=(lt,D,T,ls)=>{forest('day');const si=siOf(lt,ls);if(si<2){const x=walk(lt,154,0.45);put(C.TAM,x,0.2,{phase:T*4},-0.22);put(C.LOC,x-1.4,-0.2,{phase:T*4+1,bucket:true},-0.22);ls.x=x}else{put(C.TAM,KX-0.8,KZ+1.6,{look:0.6},-0.22);put(C.LOC,KX-1.9,KZ+2.1,{look:0.6,bucket:true},-0.22)}bees(si===2,KX+0.9,1.3,KZ,T);
 cams(lt,ls,[[[walk(lt,154,0.45)+1.5,1.6,4.5],[walk(lt,154,0.45)-0.5,1.3,0],40],[[walk(lt,154,0.45)+4,1.5,1.6],[walk(lt,154,0.45),1.4,0],36],[[KX-3.4,1.5,KZ+5],[KX+0.4,1.3,KZ],38,[0.5,0,-0.5]]],D);return 'ext'};
S.anong=(lt,D,T,ls)=>{forest('day');const si=siOf(lt,ls);bees(true,KX+0.9,1.3,KZ,T,1.6);put(C.TAM,KX+0.2,KZ+1.2,{cui:si<2,armR:si===1?-2.6:-0.1,mouth:m('TAM',si)},-0.22);put(C.LOC,KX-1.3,KZ+1.3,{bucket:true,honey:si>=2,mouth:m('LOC',si),look:0.6},-0.22);
 cams(lt,ls,[[[KX-2.4,1.4,KZ+4.6],[KX+0.6,1.3,KZ+0.4],34,[0.4,0,-0.3]],[[KX-1.4,1.5,KZ+4.4],[KX+0.5,1.4,KZ+0.6],34],[[KX-2.6,1.5,KZ+4.0],[KX-1.2,1.4,KZ+1.9],30],[[KX-1.4,1.5,KZ+4.6],[KX+0.1,1.4,KZ+1.2],30],[[KX-2.0,1.5,KZ+4.4],[KX-1.2,1.4,KZ+1.9],28]],D);return 'ext'};
S.keota=(lt,D,T,ls)=>{forest('dawn');keota('full');const si=siOf(lt,ls);bees(true,GX+2.3,3.0,GZ-1,T,2.4);RELICS.visible=false;
 cams(lt,ls,[[[GX-6.5,2.0,4.5],[GX+1,2.6,-1],40,[1,0,-0.5]],[[GX-3,1.6,5],[GX+2.3,3.3,-1],38,[0.5,0.2,-0.5]],[[GX+5,2.0,6.5],[GX+1,2.4,-1],40,[-1,0,-0.5]],[[GX-1.5,1.4,4.5],[GX,3,-1.2],44,[0,0.3,-0.4]]],D);return 'ext'};
S.keota2=(lt,D,T,ls)=>{forest('day');const si=siOf(lt,ls);bees(true,KX+0.9,1.3,KZ,T,1.2);put(C.TAM,KX-0.6,KZ+1.8,{mouth:m('TAM',si),look:-0.5},-0.22);put(C.LOC,KX-1.9,KZ+1.8,{mouth:m('LOC',si),look:0.5,bucket:true,honey:true},-0.22);
 if(si===4){put(C.MA,KX-3.6,KZ-4.6,{a:0.95,glow:1.2,open:0.8,look:0.5},-0.22);ghostL.position.set(KX-3.2,2.2,KZ-3.6);ghostL.color.set(0xff5040);ghostL.intensity=3}
 const A=[[KX+0.2,1.5,KZ+4.8],[KX-0.6,1.4,KZ+1.8],28],B=[[KX-2.6,1.5,KZ+4.8],[KX-1.9,1.4,KZ+1.8],28];cams(lt,ls,[A,A,[[KX-0.3,1.45,KZ+4.0],[KX-0.6,1.45,KZ+1.8],24,[0,0,-0.2]],B,[[KX-1.2,1.7,KZ+4.6],[KX-3.6,2.0,KZ-4.6],22,[-0.4,0.05,-1.2]]],D);return 'ext'};
S.luat=(lt,D,T,ls)=>{forest('day');const si=siOf(lt,ls);put(C.TAM,KX-0.6,KZ+1.8,{mouth:m('TAM',si),look:-0.5},-0.22);put(C.LOC,KX-1.9,KZ+1.8,{back:si===3,look:0.5,bucket:true,honey:true},-0.22);
 cams(lt,ls,[[[KX+0.2,1.45,KZ+4.4],[KX-0.6,1.45,KZ+1.8],26],[[KX-0.3,1.5,KZ+4.2],[KX-0.6,1.4,KZ+1.8],24,[0,0,-0.2]],[[KX-1.2,1.5,KZ+5.4],[KX-1.2,1.3,KZ+1.8],34],[[KX-4.6,1.6,KZ+6.2],[KX+6,1.6,KZ-4],40,[0.5,0,-0.4]]],D);return 'ext'};
S.dem1=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si<2){tod('dusk');put(C.TAM,-0.8,6.4,{bucket:true,honey:true});put(C.LOC,0.6,6.8,{bucket:true,honey:true,look:-0.4});
  cams(lt,ls,[[[-1.5,1.6,10.2],[0,1.2,6],38,[0.5,0,-0.8]],[[1.6,1.5,9.8],[0.6,1.35,6.8],30]],D);return 'ext'}
 tod('night');if(si===2){put(C.LOC,20-lt*0.3,2.6,{back:true,torch:true,bucket:true});torch3(20.3-lt*0.3,1.9,2.8,T,0.8);
  cams(lt,ls,[[],[],[[4,1.6,9.5],[18,1.3,2.6],34,[0,0,0],[-1,0,0]]],D);return 'ext'}
 put(C.MUC,0.4,5.2,{growl:true});cams(lt,ls,[[],[],[],[[2.0,0.6,7.0],[0.4,0.35,5.2],36,[-0.2,0,-0.3]]],D);return 'ext'};
S.hoa=(lt,D,T,ls)=>{tod('dawn');const si=siOf(lt,ls);put(C.HOA,-0.2,6.2,{mouth:m('HOA',si),tear:true,look:-0.5});if(si>=2)put(C.TAM,-1.4,5.6,{mouth:m('TAM',si),eyes:1.3,look:0.5,torch:si===4});if(si===4)torch3(-1.0,2.0,5.8,T,0.6);
 cams(lt,ls,[[[0.8,1.6,10.5],[-0.4,1.3,5.8],38,[0,0,-0.8]],[[-1.0,1.5,8.4],[-0.2,1.4,6.2],30],[[-1.2,1.5,8.6],[-0.2,1.4,6.2],30],[[0.6,1.5,8.6],[-1.4,1.4,5.6],28],[[-6,1.7,9.8],[2,1.3,5],40,[2,0,-0.6]]],D);return 'ext'};
S.mieu3=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);mieu('over');if(si<2)put(C.TAM,RX-3.6,3.3,{torch:true,eyes:1.3,look:0.5});else put(C.TAM,walk(lt-ls[2],RX+2,0.4),0.3,{torch:true,back:true,phase:T*4},-0.22);
 torch3(si<2?RX-3.2:RX+2.4+(lt-ls[2])*0.4,2.0,si<2?4.2:0.5,T,0.7);
 cams(lt,ls,[[[RX-1.4,1.4,4.8],[RX-2.4,1.15,2.5],32,[-0.1,-0.05,-0.3]],[[RX-0.8,1.3,2.0],[RX+5,0.5,0],38,[0.6,0,0]],[[RX-1,1.6,2.0],[RX+6,1.4,0],38,[2,0,0],[2,0,0]]],D);return 'ext'};
S.truoc=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);const lx=176+lt*0.25;put(C.LOC,lx,0.1,{back:true,phase:T*2.5},-0.25);put(C.TAM,170+lt*0.08,0.3,{torch:true,mouth:m('TAM',si),back:si===0||si>=3,eyes:1.3},-0.22);torch3(170.4+lt*0.08,1.9,0.5,T,0.7);
 cams(lt,ls,[[[166,1.6,1.8],[176,1.5,0],36,[1,0,0],[1,0,0]],[[173.5,1.5,2.4],[170.3,1.4,0.3],32],[[174,1.5,2.2],[170.3,1.4,0.3],34],[[168.6,1.5,1.8],[lx,1.0,0],36],[[168.2,1.8,2.6],[171,1.3,0.2],34,[0.3,0,0]]],D);return 'ext'};
S.truoc2=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);put(C.TAM,171,0.3,{torch:true,back:si===1,eyes:1.3,look:0.6},-0.22);torch3(171.4,1.9,0.5,T,0.7);const lx=180+lt*0.15;put(C.LOC,lx,0.1,{back:true,phase:T*2.5},-0.25);if(si===1)put(C.MA,lx+0.9,-0.4,{back:true,arms:[0.4,-0.1],a:0.92,walk:true,glow:0.4},-0.25);
 cams(lt,ls,[[[173.4,1.5,2.4],[171,1.4,0.3],30,[-0.2,0,-0.2]],[[169.4,1.7,1.2],[181,1.6,-0.2],34,[0.5,0,0]]],D);return 'ext'};
S.jump1=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);const lx=182.6;put(C.LOC,lx,0.1,{back:true},-0.25);put(C.MA,lx+0.95,-0.4,{back:si===0,arms:[0.4,-0.1],glow:si===1?1.6:0.5,open:0.9,look:-0.6},-0.25);ghostL.position.set(lx+0.6,2.2,0.8);ghostL.color.set(0xff5040);ghostL.intensity=si===1?4:0.8;
 cams(lt,ls,[[[172,1.7,1.0],[182.6,1.6,-0.2],30,[2,0,0]],[[180.4,2.2,0.7],[lx+0.95,2.05,-0.4],30,[0.5,0,-0.1]]],D);return 'ext'};
// -------- CHƯƠNG 2 --------
const lhX=-15.6,lhZ=7.2;
S.xom2=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.TAM,lhX+0.3,lhZ-0.6,{sit:true,eyes:1.2},0);put(C.HOA,lhX-1.6,lhZ+0.4,{tear:true});put(C.D1,lhX+2.2,lhZ+1.2,{});put(C.D2,lhX+3.2,lhZ+0.2,{});put(C.N1,lhX-2.8,lhZ+1.6,{});if(si===1)put(C.BNL,lhX+1.2,lhZ+1.8,{look:-0.5});
 cams(lt,ls,[[[lhX+1,1.8,lhZ+6.5],[lhX+0.4,1.1,lhZ],38,[0,0,-0.8]],[[lhX+3.4,1.5,lhZ+5.2],[lhX+1.2,1.3,lhZ+1.8],32,[-0.3,0,-0.3]]],D);return 'ext'};
S.banam=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.BNL,lhX+1.2,lhZ+1.8,{mouth:m('BNL',si),look:-0.4,point:si===3});put(C.HOA,lhX-0.2,lhZ+2.2,{tear:true,mouth:m('HOA',si),look:0.5});put(C.TAM,lhX+2.4,lhZ+2.6,{mouth:m('TAM',si),look:-0.6});put(C.D1,lhX+3.4,lhZ+1.0,{});
 const B=[[lhX+0.2,1.5,lhZ+5.4],[lhX+1.2,1.4,lhZ+1.8],28],H=[[lhX+1.4,1.5,lhZ+5.6],[lhX-0.2,1.4,lhZ+2.2],28],TT=[[lhX+0.6,1.5,lhZ+6.0],[lhX+2.4,1.4,lhZ+2.6],28];
 cams(lt,ls,[B,H,B,[[lhX+0.6,1.6,lhZ+6.6],[lhX+1.4,1.3,lhZ+2],36,[0,0,-0.6]],TT,B],D);return 'ext'};
const lineVil=(T,x0,z0)=>{put(C.D1,x0,z0-2.0,{torch:true,back:true},-0.22);put(C.D2,x0+0.3,z0+1.6,{torch:true,back:true},-0.22);put(C.D3,x0-0.2,z0+3.6,{torch:true,back:true},-0.22);put(C.N1,x0-1.8,z0-0.6,{thau:true},-0.22);put(C.N2,x0-1.9,z0+2.2,{thau:true},-0.22);
 torch3(x0+0.4,1.8,z0-1.6,T,0.9);torch3(x0+0.6,1.8,z0+2.4,T,0.8,torchL2)};
S.dem2=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);lineVil(T,160+lt*0.15,0);if(si===2)put(C.NHAN,158.4+lt*0.15,1.0,{thau:true,gonk:1,mouth:m('NHAN',si)},-0.22);
 cams(lt,ls,[[[152,2.4,2],[160,1.4,0.6],40,[1.5,0,0],[1.5,0,0]],[[154.5,1.6,-1.2],[159,1.2,1.6],36,[0.5,0,0]],[[156.4,1.5,2.8],[158.6,1.4,1.0],30,[0.4,0,0]],[[166,1.9,5.5],[160,1.3,0.5],40,[0,0,-0.5]]],D);return 'ext'};
S.vong=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);lineVil(T,166,0);put(C.BNL,164.0,1.2,{mouth:m('BNL',si),point:si===6},-0.22);
 const lk=[[[158,1.7,1.0],[170,1.6,-5],38,[0.5,0,0]],[[158,1.6,-2.5],[175,2.0,-8],40],[[159,1.7,3.5],[165,1.3,0],36],[[159,1.6,4],[176,2,9],40],[[158,2.4,-1],[165,1.2,1],42,[0,0,0],[0,1.5,0]],[[166,1.0,6],[166,4,-2],46,[0,0,-0.5]],[[161.2,1.5,0.4],[164.0,1.4,1.2],30]];
 cams(lt,ls,lk,D);return 'ext'};
S.dem3=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);put(C.THUY,176,0.6,{mam:true,mouth:m('THUY',si),look:si===2?0.8:0},-0.22);put(C.NHAN,174.8,0.2,{thau:true,gonk:1,mouth:m('NHAN',si),look:0.6},-0.22);put(C.D1,178.5,-0.4,{torch:true,back:true},-0.22);torch3(178.9,1.8,-0.2,T,0.9);
 wisps(si>=1,T,186,-2);if(si===4)put(C.MA,188,-3.5,{a:0.7,glow:0.5,closed:false},-0.25);
 const A=[[173.2,1.5,3.0],[175.6,1.3,0.4],34],TH=[[175.0,1.5,3.0],[176,1.4,0.6],28],NH=[[176.8,1.5,3.0],[174.8,1.4,0.2],28];
 cams(lt,ls,[A,[[174.4,1.5,2.0],[186,1.0,-2],36,[0.4,0,0]],TH,NH,[[175.4,1.6,2.4],[188,1.6,-3.5],32,[0.8,0,-0.2]]],D);return 'ext'};
S.sang3=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);const x=si<3?192+lt*0.12:GX-4.2;put(C.TAM,x,0.4,{thau:true,gonk:1,mouth:m('TAM',si)},-0.22);
 cams(lt,ls,[[[186,1.8,4.5],[x,1.3,0.3],40,[1.5,0,-0.5]],[[x+2.4,1.5,2.6],[x,1.4,0.4],30],[[x-2.2,1.5,2.4],[x,1.4,0.4],28],[[GX-6.4,1.5,3.2],[GX-2.6,0.9,2.4],34,[0.3,0,-0.2]],[[GX-5.4,1.2,3.6],[GX-2.6,0.8,2.4],36,[0.4,0,-0.3]]],D);return 'ext'};
S.jump2=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);put(C.LOCF,GX-2.3,2.1,{sit:true,mud:true,eyes:1.2,grin:si===2,tilt:si===2?Math.min(0.5,(lt-ls[2])*0.6):0,look:si===2?1:0,muddy:true},0.0);put(C.TAM,GX-5.4,2.8,{thau:true,eyes:1.3,look:0.6},-0.2);ghostL.position.set(GX-2.6,1.4,3.4);ghostL.color.set(0xa0ffc0);ghostL.intensity=si===2?2.5:0.8;
 cams(lt,ls,[[[GX-3.4,1.5,5.0],[GX-2.4,0.9,2.1],32,[0.2,0,-0.4]],[[GX-3.0,1.2,4.4],[GX-2.3,1.0,2.1],26],[[GX-2.8,1.15,3.9],[GX-2.3,1.12,2.1],24,[0.2,0,-0.4]]],D);return 'ext'};
S.ve=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);if(si===0){put(C.TAM,lhX+1.6,lhZ+1.8,{bucket:true,honey:true,eyes:1.2});put(C.LOC,lhX+0.4,lhZ+1.4,{eyes:0.6,mud:true,muddy:true,pale:true,look:0.4});put(C.HOA,lhX-1.2,lhZ+2,{tear:true})}
 else{put(C.LOC,lhX+0.2,lhZ+1.0,{sit:true,pale:true,mud:si===1,eyes:si===1?0.5:0.9,muddy:true},-0.42);put(C.BNL,lhX+1.3,lhZ+1.5,{look:-0.8});put(C.HOA,lhX-1.0,lhZ+1.4,{tear:true,look:0.6});if(si===3)put(C.TAM,lhX+2.6,lhZ+2.2,{look:-0.6})}
 cams(lt,ls,[[[lhX+1,1.6,lhZ+6.6],[lhX+0.6,1.2,lhZ+1.6],36,[0,0,-0.6]],[[lhX+0.8,1.2,lhZ+4.2],[lhX+0.4,0.8,lhZ+1.1],30],[[lhX+0.2,1.3,lhZ+4.4],[lhX-0.2,0.9,lhZ+1.2],34],[[lhX+3.8,1.6,lhZ+6],[lhX+1,1.1,lhZ+1.4],38,[0,0,-0.5]]],D);return 'ext'};
S.ve2=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);const x=-8.5,z=0.5;put(C.BNL,x,z,{mouth:m('BNL',si),look:0.6});put(C.TAM,x+1.2,z+0.4,{mouth:m('TAM',si),look:-0.6});
 const B=[[x+1.6,1.5,z+3.6],[x,1.4,z],28],TT=[[x-0.6,1.5,z+3.8],[x+1.2,1.4,z+0.4],28];cams(lt,ls,[[[x+0.6,1.7,z+5],[x+0.6,1.2,z],38,[0,0,-0.6]],TT,B,B,B],D);return 'ext'};
S.mat=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.HOA,lhX-0.2,lhZ+1.2,{tear:true,mouth:m('HOA',si),look:0.5});put(C.BNL,lhX+1.2,lhZ+1.5,{look:-0.5});
 cams(lt,ls,[[[lhX+0.6,1.6,lhZ+5.8],[lhX+0.4,1.3,lhZ+1.3],36,[0,0,-0.4]],[[lhX+1.2,1.5,lhZ+4.6],[lhX-0.2,1.4,lhZ+1.2],28],[[lhX-0.6,1.5,lhZ+4.6],[lhX+1.2,1.4,lhZ+1.5],28],[[lhX-1,1.5,lhZ+4],[60,2.2,-10],40,[0,0,0],[0,0,0]]],D);return 'ext'};
S.la=(lt,D,T,ls)=>{tod('dusk');const si=siOf(lt,ls);put(C.LOC,-8.4,10.6,{sit:true,back:true,pale:true},-0.42);if(si===0)put(C.HOA,-10.6,7.4,{bowl:true});
 cams(lt,ls,[[[-8.6,1.7,6.0],[-8.4,0.9,10.6],38,[0,0,0.4]],[[-6.2,1.3,8.2],[-8.4,0.8,10.6],34,[0,0,0.2]]],D);return 'ext'};
S.la2=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.LOC,lhX+0.2,lhZ-0.4,{sit:true,pale:true,eyes:1,mouth:m('GLOC',si),look:0.4},0);put(C.TAM,lhX+1.6,lhZ+1.0,{eyes:si>=2?1.3:1,look:-0.6});if(si===3)put(C.MUC,lhX+2.6,lhZ+1.8,{growl:true});
 cams(lt,ls,[[[lhX+2.8,1.5,lhZ+4.2],[lhX+0.4,1.0,lhZ-0.2],32,[-0.2,0,-0.3]],[[lhX+1.4,1.3,lhZ+2.6],[lhX+0.2,1.05,lhZ-0.4],26],[[lhX-0.4,1.5,lhZ+3.6],[lhX+1.6,1.4,lhZ+1.0],28],[[lhX+3.6,1.0,lhZ+4.4],[lhX+2.6,0.5,lhZ+1.8],34]],D);return 'ext'};
S.la3=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si<2){tod('dusk');put(C.LOC,-6+lt*0.2,12.4,{back:si===0,eyes:1,pale:true},-0.75);put(C.TAM,-2.6,7.0,{back:true});
  cams(lt,ls,[[[-1.8,1.7,6.2],[-5.6,0.6,12.4],34,[0,0,0.2]],[[-4.4,0.5,10.2],[-5.2,0.2,12.4],34,[0.3,0,0]]],D);return 'ext'}
 innMode('night');NET.visible=false;lampAt(-1.4,0.2,0.5);put(CI.TAM,-2.6,-0.8,{sit:true,mouth:m('TAM',si),look:0.5},0);put(CI.NHAN,-1.4,-0.6,{mouth:m('NHAN',si),look:-0.5});
 cams(lt,ls,[[],[],[[-0.6,1.4,2.0],[-2.6,1.05,-0.8],28],[[-3.4,1.5,2.0],[-1.4,1.4,-0.6],28]],D);return 'inn'};
S.jump3=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===0){innMode('night');NET.visible=false;lampL.intensity=0;put(CI.THUY,-3.9,0.4,{eyes:1.2,look:-1},0);
  cams(lt,ls,[[[-1.4,1.5,2.4],[-4.2,1.4,0.3],36,[-0.4,0,-0.3]]],D);return 'inn'}
 tod('night');const sq=si>=3;put(C.LOCF,-3.2,10.8,{sit:true,back:!sq,mud:true,eyes:1.2,grin:si>=4,armR:sq?0:-2.6},-0.42);ghostL.position.set(-3.2,1.4,9.8);ghostL.color.set(0xa0ffc0);ghostL.intensity=sq?2:0.5;
 cams(lt,ls,[[],[[-4.4,1.5,2.0],[-3.2,0.6,10.8],32,[0.1,0,0.3]],[[-4.4,1.4,4.0],[-3.2,0.7,10.8],26,[0.1,0,0.4]],[[-3.6,1.15,8.2],[-3.2,1.0,10.8],24,[0.1,-0.02,0.4]],[[-3.5,1.1,8.6],[-3.2,1.0,10.8],22],[[-3.4,1.05,9.0],[-3.2,1.0,10.8],20]],D);return 'ext'};
// -------- CHƯƠNG 3 --------
S.sang4=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.TAM,lhX+1.6,lhZ+1.6,{look:-0.5});if(si>=1)put(C.HOA,lhX-0.4,lhZ+0.6,{sit:true,tear:true},-0.42);if(si===3)feet(true,lhX+0.6,lhZ+0.2,0.3,0.55);
 cams(lt,ls,[[[lhX+1,1.6,lhZ+6],[lhX+1.2,1.2,lhZ+1.4],38,[0,0,-0.6]],[[lhX+1.8,1.3,lhZ+4.4],[lhX-0.4,0.9,lhZ+0.6],30],[[lhX+0.4,1.4,lhZ+4.6],[lhX-0.2,0.9,lhZ+0.6],34],[[lhX+1.4,1.3,lhZ+3.6],[lhX+1.2,0.0,lhZ+1.4],44,[0,0,-0.2]]],D);return 'ext'};
S.banam2=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);const x=-1.0,z=6.0;put(C.BNL,x,z,{mouth:m('BNL',si),look:0.6,point:si===4});put(C.TAM,x+1.3,z+0.4,{mouth:m('TAM',si),look:-0.6,eyes:si===2?1.3:1});
 const B=[[x-0.6,1.5,z+3.8],[x,1.4,z],28],TT=[[x+2.2,1.5,z+3.8],[x+1.3,1.4,z+0.4],28];cams(lt,ls,[B,[[x+0.6,1.7,z+5],[x+0.6,1.2,z],38,[0,0,-0.6]],TT,B,B],D);return 'ext'};
const sleep2=(T,thuyIn=true)=>{innMode('night');NET.visible=true;lampAt(-1.6,0.6,0.5);lampL.intensity*=0.5;BLANKET.visible=true;BLANKET.position.set(0.15,0.55,0);BLANKET.scale.set(1,0.8,1.0);
 put(CI.NHAN,-3.95,-2.05,{eyes:0.05},-0.55);if(thuyIn)put(CI.THUY,-3.95,-1.4,{eyes:0.05},-0.55)};
S.dem4=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===0){innMode('night');NET.visible=false;lampAt(1.2,1.6,0.5);lampL.intensity*=0.6;put(CI.TAM,1.4,0.6,{sit:true,eyes:1.2},0);
  cams(lt,ls,[[[2.6,1.5,3.6],[1.4,1.0,0.6],34,[-0.2,0,-0.3]]],D);return 'inn'}
 sleep2(T,true);if(si>=3){doorL.intensity=4;doorL.color.set(0x9ab8ff)}
 cams(lt,ls,[[],[[0.2,1.9,-1.4],[-3.9,0.9,-1.7],34,[-0.3,0,0]],[[-1.4,1.7,0.2],[-3.9,0.95,-2.0],30,[-0.2,0,0]],[[0.4,1.6,1.6],[2.6,1.2,-3.3],38,[0,0,0]],[[-1.4,1.7,0.0],[-3.95,0.95,-2.05],26,[-0.2,0,-0.1]]],D);return 'inn'};
S.jump4=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si<=1){sleep2(T,false);CI.NHAN.userData.o.eyes=1.25;if(si===1){CI.NHAN.position.y+=0.35;CI.NHAN.userData.o.mouth=m('NHAN',si)}doorL.intensity=6;
  cams(lt,ls,[[[0.2,1.9,-1.4],[-3.9,0.9,-1.6],34,[-0.3,0,0]],[[-1.6,1.6,0.0],[-3.95,1.3,-2.05],26]],D);return 'inn'}
 tod('night');feet(true,2.6,-3.6,0.0,-0.55);put(C.TAM,2.6,-3.4,{back:si===2,eyes:1.3,look:0,torch:true},0);torch3(3.0,2.0,-3.6,T,0.9);put(C.MA,3.4,-11.5,{a:si===3?0.95:0.0,glow:1.4,open:0.9},0);ghostL.position.set(3.2,2.2,-10);ghostL.color.set(0xff5040);ghostL.intensity=si===3?4:0;
 cams(lt,ls,[[],[],[[5.5,1.8,-6.8],[2.6,0.5,-3.8],40,[-0.3,0,0]],[[2.6,2.0,-4.6],[3.4,2.1,-11.5],24,[0.1,0,-1.2]],[[1.0,1.6,-6.0],[2.6,1.3,-3.4],34]],D);return 'ext'};
S.cuu=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);const x=-4.6,z=7.6;put(C.BNL,x,z,{mouth:m('BNL',si),look:0.5,point:si>=2&&si<=4});put(C.TAM,x+1.5,z+0.2,{torch:true,look:-0.6,eyes:1.2});put(C.NHAN,x+2.6,z+0.8,{tear:true,look:-0.6});torch3(x+1.9,2.0,z+0.4,T);
 const B=[[x+1.4,1.5,z+3.4],[x,1.4,z],26],W=[[x+1.0,1.7,z+5.2],[x+1.2,1.2,z+0.3],38,[0,0,-0.6]];cams(lt,ls,[W,B,[[x+2.2,1.5,z+3.6],[x+0.4,1.4,z],30],B,[[x+1.0,1.4,z+2.6],[x,1.45,z],22],B],D);return 'ext'};
S.cuu2=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);const x=-4.6,z=7.6;put(C.BNL,x,z,{mouth:m('BNL',si),look:0.5});put(C.TAM,x+1.5,z+0.2,{torch:true,look:-0.6,mouth:m('TAM',si)});put(C.NHAN,x+2.6,z+0.8,{look:-0.6,mouth:m('NHAN',si)});torch3(x+1.9,2.0,z+0.4,T);
 const B=[[x+1.4,1.5,z+3.4],[x,1.4,z],26];cams(lt,ls,[B,[[x+0.8,1.4,z+2.6],[x,1.45,z],22],B,[[x+1.0,1.4,z+2.6],[x,1.45,z],22],[[x-0.4,1.5,z+3.6],[x+1.5,1.4,z+0.2],28],[[x+4.2,1.5,z+3.4],[x+2.6,1.4,z+0.8],28]],D);return 'ext'};
S.chuoc=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);gheL.intensity=7*fl(T);torch3(-32.4,1.9,16.6,T,0.9,torchL2);torch3(-30.0,1.4,14.6,T,0.45);moonDir.intensity=2.6;put(C.NHAN,XUONGN.position.x,15.0,{mouth:m('NHAN',si),tear:si>=3,look:-0.6},0.25);put(C.D3,-33.2,16.0,{look:0.6},0.55);
 cams(lt,ls,[[[-22,2.2,9],[-32,1.2,16],40,[-2,0,1]],[[-29.6,1.9,11.4],[-33,1.6,16],32],[[-31.6,1.6,11.6],[-30.5,1.5,15.0],28],[[-31.0,1.6,11.4],[-30.5,1.55,15.0],24],[[-27,1.9,10.5],[-32,1.3,15.6],36,[0,0,0.5]]],D);return 'ext'};
S.biarung=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);mieu(si===4?'lit':'ok');put(C.TAM,si===4?RX-2.0:RX-2.6,si===4?3.4:4.4,{torch:true,bucket:true,honey:true,mouth:m('TAM',si),look:0.5,back:si===4});put(C.NHAN,RX-4.0,5.0,{thau:true,gonk:si===4?1:undefined,mouth:m('NHAN',si),look:0.5,tear:si===2});torch3(RX-2.2,2.0,4.6,T);
 cams(lt,ls,[[[RX-8,1.7,9],[RX-3,1.3,4.4],38,[1,0,-0.6]],[[RX-4.6,1.5,8.2],[RX-2.6,1.4,4.4],28],[[RX-1.4,1.5,8.4],[RX-4.0,1.4,5.0],28],[[RX-6.4,1.5,8.0],[RX-3.2,1.3,4.6],34],[[RX-6.5,1.6,7.5],[RX-1,1.3,2.5],36,[0.4,0,-0.2]]],D);return 'ext'};
S.dem5=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);const x=158+lt*0.3;put(C.TAM,x,0.2,{torch:true,bucket:true,honey:true,back:si===2,phase:T*4},-0.22);torch3(x+0.4,1.9,0.4,T);
 cams(lt,ls,[[[x-4,1.4,2.4],[x+2,2.2,-0.5],40],[[x+3.0,1.5,1.6],[x,1.4,0.2],32],[[x-3.5,1.7,1.0],[x+4,1.4,0],36]],D);return 'ext'};
S.dem6=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);const tx=178;const hx=184+lt*0.18;put(C.TAM,tx,0.2,{torch:true,bucket:true,honey:true,back:si!==2,mouth:m('TAM',si),eyes:1.2},-0.22);torch3(tx+0.4,1.9,0.4,T);put(C.THUY,hx,0.0,{back:true,phase:T*2.4},-0.25);
 cams(lt,ls,[[[tx-2.4,2.0,2.4],[hx,1.3,0],32,[0.5,0,0]],[[tx+0.4,1.4,0.9],[hx,1.1,0],18,[0.4,0,0]],[[tx+2.6,1.5,1.4],[tx,1.4,0.2],30],[[tx-2.6,1.6,1.4],[hx,1.1,0],20,[0.6,0,0]],[[tx+1.4,0.6,1.1],[hx,0.2,0],34]],D);return 'ext'};
S.dem7=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);const tx=178;put(C.TAM,tx,0.2,{torch:true,bucket:true,honey:true,eyes:1.3,look:si===1?-0.8:0.6},-0.22);torch3(tx+0.4,1.9,0.4,T);if(si===0)put(C.THUY,187.2,0.0,{back:true,a:1-sm(lt/(ls[1]||D))},-0.25);
 cams(lt,ls,[[[tx-2.4,1.6,1.6],[187,1.1,0],22,[0.6,0,0]],[[tx+2.2,1.5,1.4],[tx,1.45,0.2],24,[-0.2,0,0]]],D);return 'ext'};
S.jump5=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);const tx=178;put(C.TAM,tx,0.2,{torch:true,bucket:true,honey:true,eyes:1.3,look:0.8},-0.22);torch3(tx+0.4,1.9,0.4,T,0.8);put(C.MA,tx-1.1,-0.7,{a:0.96,glow:1.2,open:si===1?0.95:0.4,look:1,tilt:0.25,arms:[0.2,-0.9]},-0.95);
 ghostL.position.set(tx-0.6,1.8,0.3);ghostL.color.set(0xff5040);ghostL.intensity=si===1?3:1.2;
 cams(lt,ls,[[[tx+2.4,1.5,1.8],[tx-0.4,1.45,-0.2],28,[-0.3,0,-0.2]],[[tx+1.0,1.55,1.6],[tx-1.1,1.4,-0.7],24,[-0.2,0,-0.1]]],D);return 'ext'};
// -------- CHƯƠNG 4 --------
S.nhan=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);put(C.NHAN,RX-4.0,5.0,{thau:true,gonk:si===1?undefined:1,blood:true,mouth:m('NHAN',si),look:0.5,eyes:si===3?1.2:1},0);torch3(RX-3.4,1.2,5.6,T,0.7);
 cams(lt,ls,[[[RX-6.4,1.5,8.0],[RX-4.0,1.3,5],30,[0.2,0,-0.3]],[[RX-6,1.6,6.6],[RX+8,1.6,0],34,[0,0,0],[0,0,0]],[[RX-4.4,1.4,7.0],[RX-4,1.45,5],22],[[RX-5.0,1.6,7.6],[RX-4,1.3,5],30],[[RX-4.4,1.4,7.0],[RX-4,1.45,5],22]],D);return 'ext'};
S.nhan2=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);const kneel=si===1;put(C.NHAN,RX-4.0,5.0,{thau:!kneel,gonk:si===2?1:undefined,sit:kneel,blood:true,arm:kneel?[0.6,-0.6]:undefined,eyes:1.2,look:kneel?0:0.5},kneel?-0.5:0);torch3(RX-3.4,1.2,5.6,T,0.7);
 cams(lt,ls,[[[RX-5.2,1.5,7.4],[RX-3.8,1.2,5],34,[0,-0.1,-0.2]],[[RX-5.4,1.2,7.2],[RX-4.0,0.6,5],32,[0.2,0,-0.2]],[[RX-6.8,1.6,8.4],[RX-4,1.3,5],36,[0.4,0,-0.4]]],D);return 'ext'};
S.tam=(lt,D,T,ls)=>{forest('night');const si=siOf(lt,ls);const tx=178;put(C.TAM,tx,0.2,{torch:true,bucket:true,honey:true,eyes:si===0?0.05:1,look:0.6},-0.22);torch3(tx+0.4,1.9,0.4,T,0.8);if(si===0)put(C.MA,tx-1.1,-0.7,{a:0.9,glow:0.9,open:0.4,look:1,tilt:0.25},-0.95);
 cams(lt,ls,[[[tx+1.0,1.55,1.6],[tx-0.6,1.4,-0.4],24],[[tx+1.6,1.5,1.8],[tx,1.45,0.2],26],[[tx+2.6,1.6,2.4],[tx,1.4,0.2],32,[0.3,0,0.2]],[[tx-3,1.7,1.6],[tx+6,1.4,0],36,[1.5,0,0],[1.5,0,0]]],D);return 'ext'};
const goTam=(o,lt,T)=>{put(C.TAM,GX-2.2,1.3,Object.assign({torch:true},o),-0.08);torch3(GX-1.8,2.6,1.5,T,0.9)};
S.go=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);keota('dead');goTam({bucket:true,honey:true,back:si<=1,look:0.4},lt,T);
 cams(lt,ls,[[[GX-9,1.8,4.5],[GX,3.5,-1],40,[1.5,0.2,-0.5]],[[GX-1,1.6,4.6],[GX+2.3,3.3,-1],36,[0,0.2,-0.4]],[[GX-0.4,1.6,2.4],[GX+0.9,0.9,0.2],36,[0.2,-0.1,-0.2]],[[GX+0.6,1.3,1.4],[GX+1.4,0.9,0.5],30,[0.05,-0.05,-0.1]]],D);return 'ext'};
S.xac=(lt,D,T,ls)=>{forest('dawn');lie(CORPSE,GX+0.6,0.45,3.4,0.3,0.9);goTam({bucket:true,honey:true,eyes:1.3,look:0.8},lt,T);
 cams(lt,ls,[[[GX-1.0,1.7,6.2],[GX+0.6,0.6,3.4],34,[0.2,0,-0.3]],[[GX-0.2,1.5,5.4],[GX+0.6,0.6,3.4],26,[0,-0.05,-0.2]],[[GX-0.6,1.5,3.6],[GX-2.2,1.4,1.3],28]],D);return 'ext'};
S.dom=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);MATPOOL.visible=true;MATPOOL.scale.setScalar(si===0?Math.max(0.05,sm(lt/(ls[1]||D))):1);GSTICK.forEach(s=>s.visible=si>=1);
 const call=[2,4,6].includes(si);goTam({bucket:si===0,honey:true,mouth:m('TAM',si),eyes:call?1.2:1,look:call?0:0.5,armR:si===0?-1.2:undefined},lt,T);
 cams(lt,ls,[[[GX-0.6,1.5,3.8],[GX-1.0,0.9,0.4],34,[0,0,-0.2]],[[GX-1.0,1.3,2.6],[GX+0.5,0.8,0.4],32],[[GX-0.4,1.6,3.4],[GX-2.2,1.6,1.3],28],[[GX-6,2.0,4],[GX-2.2,1.4,1.3],38],[[GX-0.6,1.5,3.4],[GX-2.2,1.4,1.3],28],[[GX-3.4,3.2,4.4],[GX-2.2,0.9,1.3],38],[[GX-0.6,1.5,3.4],[GX-2.2,1.4,1.3],28]],D);return 'ext'};
S.tl=(lt,D,T,ls)=>{forest('dawn');MATPOOL.visible=true;GSTICK.forEach(s=>s.visible=true);goTam({eyes:1.3,look:Math.sin(T*1.5)},lt,T);wisps(true,T,GX-2,2);
 cams(lt,ls,[[[GX-4.5,4.5,4.5],[GX-2.2,0.9,1.3],44],[[GX-0.6,1.5,3.6],[GX-2.2,1.5,1.3],30],[[GX-2.2+Math.sin(lt*0.6)*3,1.6,1.3+Math.cos(lt*0.6)*3],[GX-2.2,1.4,1.3],34],[[GX-4.4,1.5,3.6],[GX-2.2,1.5,1.3],28]],D);return 'ext'};
S.tl2=(lt,D,T,ls)=>{forest('dawn');MATPOOL.visible=true;GSTICK.forEach(s=>s.visible=true);put(C.TAM,GX-1.4+Math.min(lt,2)*0.6,2.2,{torch:true,look:1},-0.05);torch3(GX-0.8+Math.min(lt,2)*0.6,2.5,2.4,T,0.9);
 cams(lt,ls,[[[GX-4.2,1.6,4.8],[GX+1.6,1.0,1.9],34,[0.6,0,-0.2]],[[GX-2,1.5,5],[GX+2.2,0.9,1.9],32,[0.5,0,-0.3]]],D);return 'ext'};
const lairX=GX+2.7,lairZ=2.4;
S.jump6=(lt,D,T,ls)=>{forest('dawn');keota('none');const si=siOf(lt,ls);put(C.THUY,lairX,lairZ,{sit:true,mud:true,eyes:0.45,pale:true,tilt:-0.2},-0.12);const up=si>=2;
 put(C.MA,lairX+1.0,lairZ-0.5,{crouch:!up,arms:up?[0.35,-0.35]:[0.2,-1.0],mudHand:up?0:1,open:up?0.95:0.4,glow:up?1.6:0.6,look:-0.6},-0.12);put(C.TAM,lairX-1.8,lairZ+1.2,{torch:true,eyes:1.3,look:0.8},-0.08);torch3(lairX-1.4,2.4,lairZ+1.4,T,0.9);
 ghostL.position.set(lairX+0.6,2.2,lairZ+0.6);ghostL.color.set(0xff5040);ghostL.intensity=up?3.5:1.2;
 cams(lt,ls,[[[lairX-0.6,1.4,lairZ+3.0],[lairX+0.4,0.8,lairZ],32,[0,0,-0.3]],[[lairX+0.2,1.3,lairZ+2.4],[lairX+0.8,1.0,lairZ-0.4],28],[[lairX-0.6,1.2,lairZ+3.2],[lairX+1.0,2.2,lairZ-0.5],38,[0,0,-0.2],[0,0.4,0]],[[lairX-1.8,1.4,lairZ+3.4],[lairX+0.5,1.6,lairZ-0.2],40],[[lairX-0.4,1.5,lairZ+3.0],[lairX+1.0,2.6,lairZ-0.5],32,[0.2,0,-0.4]]],D);return 'ext'};
S.ma=(lt,D,T,ls)=>{forest('dawn');keota('none');const si=siOf(lt,ls);put(C.THUY,lairX,lairZ,{sit:true,mud:true,eyes:0.4,pale:true,tilt:-0.2},-0.12);put(C.MA,lairX+1.0,lairZ-0.5,{arms:[0.35,-0.35],open:si===2?0.9:0.6,wide:si===2,glow:1.4,look:-0.6,tilt:si===2?0.3:0},-0.15);put(C.TAM,lairX-1.8,lairZ+1.2,{torch:true,mouth:m('TAM',si),eyes:1.3,look:0.8},-0.08);torch3(lairX-1.4,2.4,lairZ+1.4,T,0.9);ghostL.position.set(lairX+0.6,2.2,lairZ+0.6);ghostL.color.set(0xff5040);ghostL.intensity=3;
 cams(lt,ls,[[[lairX-0.2,1.6,lairZ+3.4],[lairX+1.0,2.4,lairZ-0.5],32,[0,0,-0.3]],[[lairX+0.2,1.5,lairZ+3.6],[lairX-1.8,1.4,lairZ+1.2],28],[[lairX+0.2,2.0,lairZ+2.4],[lairX+1.0,2.3,lairZ-0.5],28,[0,0,-0.3]]],D);return 'ext'};
S.ma2=(lt,D,T,ls)=>{forest('dawn');keota('none');const si=siOf(lt,ls);const pull=si>=1;put(C.THUY,pull?lairX-0.8:lairX,lairZ+(pull?0.8:0),{sit:!pull,mud:si<2,eyes:0.8,pale:true},pull?-0.08:-0.12);put(C.MA,lairX+1.4+(si>=1?0.6:0),lairZ-0.9,{arms:[0.6,-0.6],open:0.95,glow:1.2,look:-0.6,tilt:-0.2},-0.15);put(C.TAM,lairX-1.8,lairZ+1.2,{torch:true,eyes:1.3,look:0.8},-0.08);torch3(lairX-1.4,2.4,lairZ+1.4,T,0.9);ghostL.position.set(lairX+0.8,2.2,lairZ+0.2);ghostL.color.set(0xff5040);ghostL.intensity=2;
 cams(lt,ls,[[[lairX-3,1.7,lairZ+4.4],[lairX+0.4,1.6,lairZ],38],[[lairX-1.0,1.5,lairZ+3.8],[lairX-0.6,1.3,lairZ+0.8],32],[[lairX-1.6,1.5,lairZ+3.6],[lairX-1.2,1.3,lairZ+1.0],30],[[lairX-4,1.7,lairZ+3],[lairX,1.4,lairZ],38,[-1,0,0]]],D);return 'ext'};
S.ra=(lt,D,T,ls)=>{forest('dawn');const x=198-lt*0.5;put(C.THUY,x-1.0,0.1,{phase:T*5,pale:true,eyes:1.1,look:-1},-0.25);put(C.TAM,x,0.3,{torch:true,phase:T*5,eyes:1.3,look:-1},-0.22);torch3(x+0.4,1.9,0.5,T);
 cams(lt,ls,[[[x-5,1.6,1.6],[x,1.4,0.2],34],[[x-4.4,1.5,1.4],[x,1.4,0.2],30],[[x+3.6,1.6,1.4],[x,1.4,0.2],32],[[x-3.6,1.5,1.2],[x+0.2,1.45,0.3],24],[[x-4.4,1.6,1.6],[x,1.4,0.2],30]],D);return 'ext'};
S.ra2=(lt,D,T,ls)=>{forest('dawn');const x=180-lt*0.5;put(C.THUY,x-1.0,0.1,{phase:T*5,pale:true,eyes:1.1,look:-1},-0.25);put(C.TAM,x,0.3,{torch:true,phase:T*5,eyes:1.3,look:-1},-0.22);torch3(x+0.4,1.9,0.5,T);
 cams(lt,ls,[[[x-3.4,1.5,1.2],[x+0.2,1.45,0.3],24],[[x-3.6,1.5,1.4],[x-1.0,1.3,0.1],26],[[x-2.4,0.5,1.0],[x-1.0,0.0,0.1],34,[-0.5,0,0],[-0.5,0,0]]],D);return 'ext'};
S.bia=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);const run=si===3;const rp=run?Math.min(lt-ls[3],2):0;put(C.NHAN,RX-4.0+rp*0.6,5.0-rp*0.6,{thau:!run,gonk:si<2?1:undefined,blood:true,tear:si>=1,eyes:1.1,look:0.6,arm:run?[0.5,-0.5]:undefined},0);
 put(C.THUY,RX+1.6,1.2,{pale:true,eyes:1,look:-1},-0.3);THAU3.visible=run;put(C.TAM,RX+2.8,1.0,{torch:true,look:-1},-0.22);torch3(RX+3.2,1.9,1.2,T,0.6);
 cams(lt,ls,[[[RX-6,1.6,6],[RX+3,1.4,1.0],36,[0.5,0,0]],[[RX-6.4,1.5,8.0],[RX-4.0,1.3,5],28],[[RX-5.6,1.6,7.4],[RX-3,1.3,4],34],[[RX-7.4,1.7,6.5],[RX-1,1.3,3],40,[0.5,0,-0.3]]],D);return 'ext'};
S.bia2=(lt,D,T,ls)=>{forest('dawn');const si=siOf(lt,ls);THAU3.visible=true;put(C.NHAN,RX-0.6,4.6,{tear:true,arm:[0.6,-0.6],eyes:0.4},0);put(C.THUY,RX-0.1,4.3,{pale:true,eyes:0.3},0);const out=si===3;put(C.TAM,out?RX+0.3:RX+1.0,out?3.8:2.0,{torch:!out,eyes:si===2?1.3:0.9,look:-1},out?0:-0.12);
 if(si===2)put(C.MA,RX+2.3,1.0,{a:0.9,glow:0.7,open:0.4,look:-1,tilt:0.2},-0.6);if(!out)torch3(RX+1.4,1.9,2.2,T,0.6);
 cams(lt,ls,[[[RX-4,1.5,7.5],[RX-0.4,1.3,4.2],30,[0.2,0,-0.2]],[[RX-3,1.5,6.6],[RX+1,1.4,2],30,[0.3,0,0]],[[RX-1.2,1.6,4.6],[RX+1.5,1.6,1.4],28,[0.1,0,-0.1]],[[RX-4.5,1.7,8],[RX-0.2,1.5,4],38,[0.4,0.2,-0.4]]],D);return 'ext'};
// -------- CHƯƠNG 5 --------
S.sau=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===0){innMode('day');NET.visible=false;BLANKET.visible=true;BLANKET.position.set(0.35,0.62,0.0);put(CI.THUY,-3.8,-1.75,{eyes:0.6,pale:true},-0.3);put(CI.NHAN,-2.2,-0.8,{bowl:true,arm:[0.12,-0.6],look:-0.6});
  cams(lt,ls,[[[-1.0,1.6,1.6],[-3.4,0.9,-1.6],36,[-0.2,0,-0.2]]],D);return 'inn'}
 tod('day');if(si===1){graves(1);put(C.D1,-0.8,-9.0,{back:true});put(C.D2,0.6,-8.6,{back:true});put(C.HOA,-2.6,-9.0,{tear:true});
  cams(lt,ls,[[],[[-1,1.7,-4.4],[-1.8,0.6,-10.2],38,[0,0,-0.4]]],D);return 'ext'}
 forest('day');mieu('lit');put(C.NHAN,RX-2.2,3.4,{back:true});cams(lt,ls,[[],[],[[RX-5,1.6,6.6],[RX-2.2,1.3,2.6],34,[0.5,0,-0.4]]],D);return 'ext'};
S.sau2=(lt,D,T,ls)=>{tod('dusk');const si=siOf(lt,ls);put(C.TAM,-1.6,5.4,{sit:true,fake:true,eyes:0.9,look:0.5},0);if(si>=1)put(C.MUC,1.4,6.4,{growl:true});
 cams(lt,ls,[[[-0.4,1.5,9.2],[-1.6,1.0,5.2],32,[0,0,-0.6]],[[-1.8,1.4,8.8],[0,0.8,5.6],36],[[2.4,0.7,8.2],[1.4,0.4,6.4],34,[-0.1,0,-0.3]]],D);return 'ext'};
S.thuy=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);NET.visible=false;lampAt(-1.8,0.0,0.5);BLANKET.visible=true;BLANKET.position.set(0.35,0.62,0.0);put(CI.THUY,-3.8,-1.75,{eyes:1.1,pale:true,mouth:m('THUY',si),look:0.6},-0.3);put(CI.NHAN,-1.7,-1.5,{sit:true,mouth:m('NHAN',si),look:-1,eyes:si===4?0.9:1},0.12);
 const TH=[[-2.9,1.4,0.7],[-3.7,1.0,-1.7],28],NH=[[-2.6,1.4,1.2],[-1.7,1.1,-1.5],28];cams(lt,ls,[TH,TH,TH,NH,[[-0.4,1.5,1.4],[-2.8,0.9,-1.3],36,[-0.2,0,-0.2]]],D);return 'inn'};
S.an=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);NET.visible=false;lampAt(-1.8,0.6,0.5);put(CI.TAM,-2.9,-0.8,{sit:true,fake:true,smile:si>=3,mouth:m('GTAM',si),look:0.6},0);put(CI.NHAN,-1.6,-0.3,{bowl:si<2,arm:si<2?[0.12,-0.6]:[0.3,-0.3],look:-0.6,eyes:si>=2?1.3:1});
 cams(lt,ls,[[[-0.6,1.5,2.6],[-2.2,1.1,-0.6],34,[-0.2,0,-0.3]],[[-1.8,1.3,1.4],[-2.9,1.05,-0.8],24],[[-2.6,1.4,1.8],[-1.6,1.3,-0.3],26],[[-1.8,1.3,1.4],[-2.9,1.05,-0.8],24],[[-2.2,0.6,1.2],[-2.9,0.1,-0.6],36,[0,0,-0.2]]],D);return 'inn'};
S.cuoi=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===0){sleep2(T,false);CI.NHAN.visible=false;
  cams(lt,ls,[[[0.2,1.9,-1.4],[-3.9,0.9,-1.7],34,[-0.3,0,0]]],D);return 'inn'}
 tod('night');put(C.TAM,1.2,10.9,{sit:true,back:true,fake:true,armR:-2.6},-0.42);if(si===1)put(C.NHAN,-1.4,6.4,{back:true});ghostL.position.set(1.2,1.5,10.0);ghostL.color.set(0x90ffc0);ghostL.intensity=1.6;moonDir.intensity=2.6;
 cams(lt,ls,[[],[[-3.2,1.8,6.0],[1.2,0.8,10.9],36,[0.3,0,0.4]],[[3.6,1.1,8.4],[1.2,0.8,10.9],30,[-0.2,0,0.2]]],D);return 'ext'};
S.cuoi2=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);put(C.TAM,1.2,10.9,{sit:true,fake:true,mud:true,smile:true,eyes:1,tilt:0.15,mouth:m('GTAM',si)},-0.42);ghostL.position.set(1.0,1.2,10.0);ghostL.color.set(0xa0ffc0);ghostL.intensity=1.2;
 cams(lt,ls,[[[1.0,1.3,8.0],[1.2,0.95,10.9],28,[0,-0.05,0.6]],[[1.1,1.15,8.8],[1.2,1.0,10.9],22,[0,0,0.3]]],D);return 'ext'};
S.final=(lt,D,T,ls)=>{const si=siOf(lt,ls);
 if(si<=2){tod('night');put(C.NHAN,-1.0,7.0,{eyes:1.3,look:0.8,tear:si>=2});put(C.TAM,1.2,10.9,{sit:true,back:true,fake:true},-0.42);
  cams(lt,ls,[[[-2.6,1.5,4.6],[-1.0,1.4,7.0],30,[0,0,0.3]],[[-1.4,1.7,5.4],[40,2.5,-4],34],[[-2.2,1.5,4.6],[-1.0,1.45,7.0],24,[0.1,0,0.3]]],D);return 'ext'}
 if(si<=4){forest('night');put(C.NHAN,RX-4.0,5.0,{thau:true,gonk:1,old:true,look:0.6},0);torch3(RX-3.4,1.2,5.6,T,0.6);if(si===4)put(C.MA,RX+4,1.0,{a:0.75,glow:0.6,open:0.3},-0.22);
  cams(lt,ls,[[],[],[],[[RX-8,1.7,9.5],[RX-3.6,1.3,4.6],36,[1,0,-0.8]],[[RX-6.6,1.6,7.4],[RX+3,1.6,1.4],34,[0.4,0,-0.2]]],D);return 'ext'}
 tod('dusk');put(C.TAM,1.2,10.9,{sit:true,fake:true,smile:true,eyes:1,look:-0.4},-0.42);
 cams(lt,ls,[[],[],[],[],[],[[3.6,1.4,7.0],[1.2,0.9,10.9],30,[-0.3,0,0.4]],[[2.0,1.2,8.2],[1.2,1.0,10.9],22,[0,0,0.3]]],D);return 'ext'};
