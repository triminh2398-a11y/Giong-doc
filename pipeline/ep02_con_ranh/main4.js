// ================= engine =================
const ACT=[];
function put(c,x,z,o,base=0){c.visible=true;c.userData.o=o||{};c.position.set(x,c.userData.h*0.4766+base,z);ACT.push(c);return c}
function lie(m,x,y,z,ry=0,tilt=0.6){m.visible=true;m.position.set(x,y+0.44*Math.sin(tilt)*0.9,z);m.rotation.set(-Math.PI/2+tilt,0,Math.PI/2+ry);return m}
let SI=0;
function siOf(lt,ls){let s=0;for(let i=0;i<ls.length;i++)if(lt>=ls[i]-0.05)s=i;return s}
function cams(lt,ls,list,D){const si=siOf(lt,ls);const c=list[si%list.length];const t0=si===0?0:ls[si],t1=si+1<ls.length?ls[si+1]:D;const p=sm((lt-t0)/Math.max(0.5,t1-t0));
 const [P,L,f,dP,dL]=c;cam.fov=f||40;cam.position.set(P[0]+(dP?dP[0]*p:0),P[1]+(dP?dP[1]*p:0),P[2]+(dP?dP[2]*p:0));cam.lookAt(L[0]+(dL?dL[0]*p:0),L[1]+(dL?dL[1]*p:0),L[2]+(dL?dL[2]*p:0));return si}
function talk(lt,on=true){return on&&Math.sin(lt*13)>0?'o':undefined}
// người nói trong câu si (để mấp máy môi)
function spk(si){return (TLD.spk||[])[SI_BASE+si]}
let SI_BASE=0;
function drawFlat(){if(VERT){const sc=RH/720*0.62;const w=1280*sc,h=720*sc;g2.fillStyle='#000';g2.fillRect(0,0,RW,RH);g2.drawImage(flat,(RW-w)/2,(RH-h)/2-60,w,h)}else g2.drawImage(flat,0,0,RW,RH)}
function flat2(fn,...a){const old=ctx;ctx=flat.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.save();fn(...a);ctx.restore();ctx=old;drawFlat();return 'flat'}
function resetAll(t){for(const c of ACT)c.visible=false;ACT.length=0;for(const k in C)C[k].visible=false;for(const k in CI)CI[k].visible=false;
 for(const k in IL)IL[k].visible=false;for(const k in EL)EL[k].visible=false;EB.visible=false;IB.forEach(b=>b.visible=false);VBABY.visible=false;
 bowls(3);COFFIN.visible=false;NET.visible=true;MAT.visible=false;HOLE.visible=false;OFFER.visible=false;graves(5);graveL.intensity=0;ghostL.intensity=0;innG.intensity=0;DEADCHK.visible=false;rvL.intensity=0;bthL.intensity=0;doorL.intensity=0;
 VONG.rotation.x=0;ALT.visible=true;lampG.position.set(2.3,0.78,1.0);STOOL.visible=false;XUONG.position.set(4.5,0.04,13.2);XUONG.rotation.set(0,0,0);XUONG2.rotation.set(0,0,0);RAIN=0;TINT=null;moonL.color.set(0x8fb0ff);
 const fl=1+Math.sin(t*13)*0.08+Math.sin(t*7.3)*0.06+Math.sin(t*23)*0.04;lampL.intensity=14*fl;lampG.userData.fl.scale.set(1,1.8*fl,1);lampL.position.set(lampG.position.x,lampG.position.y+0.27,lampG.position.z)}
let TINT=null;
function rain(t,a=1){g2.save();g2.strokeStyle='rgba(190,205,225,.35)';g2.lineWidth=1.4;for(let i=0;i<260;i++){const x=(R(i)*RW*1.2+t*90)%(RW*1.2)-60,y=(R(i+7)*RH+t*1300*(0.8+R(i)*0.4))%(RH+80)-40;g2.beginPath();g2.moveTo(x,y);g2.lineTo(x-7,y+26);g2.stroke()}g2.restore()}
function subs(t){for(const [a,b,str,sp] of TLD.subs){if(t<a||t>=b)continue;const al=Math.min(sm((t-a)/0.12),sm((b-t)/0.12));g2.save();g2.globalAlpha=al;g2.textAlign='center';g2.lineJoin='round';g2.font='bold 40px "DejaVu Sans"';
 const ws=str.split(' ');const L=[];let c='';for(const w of ws){const tt=c?c+' '+w:w;if(g2.measureText(tt).width>(VERT?620:1080)&&c){L.push(c);c=w}else c=tt}if(c)L.push(c);const lh=52;const y0=(VERT?RH*0.8:662)-(L.length-1)*lh;
 const fem=['H','BT','BA','BE'].includes(sp);const col=sp.startsWith('G')?'#ff5050':fem?'#ff9a9a':sp==='N'?'#ffffff':'#ffd76a';
 L.forEach((l,i)=>{g2.lineWidth=9;g2.strokeStyle='#000';g2.strokeText(l,RW/2,y0+i*lh);g2.fillStyle=col;g2.fillText(l,RW/2,y0+i*lh)});g2.restore()}}
function watermark(t){const k=Math.floor(t/6)%4;const pos=[[0.5,0.42],[0.76,0.18],[0.26,0.66],[0.7,0.56]][k];g2.save();g2.globalAlpha=0.16;g2.font='bold 28px "DejaVu Sans"';g2.textAlign='center';g2.translate(RW*pos[0],RH*pos[1]);g2.rotate(-0.08);g2.fillStyle='#ffffff';g2.strokeStyle='rgba(0,0,0,.6)';g2.lineWidth=3;g2.strokeText('@chuyendongtaykimco',0,0);g2.fillText('@chuyendongtaykimco',0,0);g2.restore()}
function jump(dt,t){const k=1-sm(dt/0.15);const sc=1+0.4*k;const sh=dt<0.5?1:0.3;const sx=(Math.random()-0.5)*40*sh,sy=(Math.random()-0.5)*40*sh;
 const old=ctx;ctx=flat.getContext('2d');ctx.setTransform(1,0,0,1,0,0);jumpFace(dt,t);ctx=old;
 g2.save();g2.translate(RW/2+sx,RH/2+sy);g2.scale(sc,sc);if(VERT){const k2=RH/720;g2.drawImage(flat,-640*k2,-360*k2,1280*k2,720*k2)}else g2.drawImage(flat,-RW/2,-RH/2,RW,RH);g2.restore();g2.fillStyle='rgba(120,0,0,.15)';g2.fillRect(0,0,RW,RH);if(dt<0.07){g2.fillStyle='rgba(255,255,255,.85)';g2.fillRect(0,0,RW,RH)}}
function hookText(a,l1,l2){g2.save();g2.globalAlpha=a;g2.textAlign='center';g2.lineJoin='round';g2.font='900 50px "DejaVu Sans"';g2.lineWidth=10;g2.strokeStyle='#000';g2.strokeText(l1,RW/2,90);g2.fillStyle='#fff';g2.fillText(l1,RW/2,90);g2.font='900 70px "DejaVu Sans"';g2.strokeText(l2,RW/2,170);g2.fillStyle='#ff2a2a';g2.fillText(l2,RW/2,170);g2.restore()}
const S={};
