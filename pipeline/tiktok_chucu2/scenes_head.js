// ================= cảnh: NGƯỜI CHỦ CŨ (nhà phố hiện đại) =================
const S={};let ctaFlag=false,BLACK=0,TITLE=false,RED=0,RAIN=0,FLASH=0,NOW=0,CCTV=0;
const JUMPS=[['hook2',0.05,0.45,1],['cam',0.72,0.45,1],['gs',0.3,0.4,1],['turn',0.45,0.45,1]];
const SOFT=[['gs2',0.4,0.25,0]];
const TK=sp=>{for(const [a,b,s] of TLD.vox){if(s===sp&&NOW>=a&&NOW<b)return Math.sin(NOW*14)>-0.2?'o':undefined}return undefined};
const flick=T=>0.85+0.15*Math.sin(T*11)*Math.sin(T*3.7);
const GX=3.3,GZ=-1.72;// chỗ bà cụ đứng (trước mặt tủ bếp)
const SUX=3.05,SUZ=-1.0;
const CAMV=(T)=>{CCTV=1;cm([6.2,2.6,0.75],[3.2,0.8,-1.2],60)};
const KC=(d=0)=>cm([3.4,1.45,1.9-d],[3.3,0.95,-1.0],44);
const sitSu=(o)=>put(C.su,SUX,SUZ,Object.assign({sit:true,T:NOW},o),0.22);
// ---- mở đầu ----
S.hook=(lt,D,T)=>{CUR='mod';modNight(0.25,T);nightKL.intensity=0.6;mbowls(3,{upright:true});const p=sm(lt/D);cm([lerp(-1.5,2.4,p),1.6,lerp(3.2,1.4,p)],[3.3,0.8,-0.8],lerp(50,42,p));return 'mod'};
S.hook2=(lt,D,T)=>{CUR='mod';modNight(0.5,T,true);STREAM.visible=true;put(C.gs,2.4,-1.72,{a:0.97,chew:true,tilt:lerp(-0.7,0,sm(seg(lt,0,0.35)))});CAMV(T);if(lt>D*0.3){CCTV=0;const c=C.gs;cm([c.position.x+0.3,1.3,c.position.z+lerp(2.0,1.6,sm(lt/D))],[c.position.x,1.2,c.position.z],36)}RED=0.1*(1-sm(lt/D));return 'mod'};
S.title=(lt,D,T)=>{CUR='mod';modNight(0.35,T);nightKL.intensity=0.9;TITLE=true;mbowls(3,{upright:true});cm([3.4,1.5,1.2],[3.4,0.8,-0.5],44);return 'mod'};
// ---- mua nhà ----
S.buy=(lt,D,T)=>{CUR='mod';modDay();const p=sm(lt/D);put(C.vy,-1.6,0.4,{eyes:1,smileF:true,T});put(C.su,-1.0,0.6,{smileF:true,eyes:1,T});const tx=lerp(-2.4,-4.2,sm(seg(lt,D*0.45,D)));put(C.tuan,tx,1.4,{shake:true,eyes:1.2,walk:T*7,phase:T*7,look:-1,T});
 cm([lerp(0.8,0.2,p),1.6,4.4],[lerp(-1.6,-2.6,p),1.0,0.6],46);return 'mod'};
S.hung=(lt,D,T)=>{CUR='mod';modDay();put(C.hung,1.6,0.2,{eyes:1,look:1,T});put(C.vy,0.6,0.5,{eyes:1,look:1,T});cm([0.4,1.6,3.6],[2.2,1.0,-0.5],46);return 'mod'};
S.hung1=(lt,D,T)=>{CUR='mod';modDay();put(C.hung,1.6,0.2,{eyes:1.1,point:lt>D*0.55,mouth:TK('HU'),T});close(C.hung,lerp(1.3,1.1,sm(lt/D)),36,0.25);return 'mod'};
// ---- đêm đầu ----
S.water=(lt,D,T)=>{CUR='mod';if(lt<D*0.4){modNight(0,T);mLamp.intensity=0.6;mInBed(C.vy,-1,{eyes:1.35,pupil:2,look:1,T});mInBed(C.su,1,{eyes:0.05,T});cm([MBED.position.x+0.3,1.7,MBED.position.z+2.0],[MBED.position.x,1.0,MBED.position.z-0.6],44);return 'mod'}
 modNight(0.12,T,true);nightKL.intensity=0.8;STREAM.visible=true;MPUDDLE.visible=true;MPUDDLE.scale.setScalar(lerp(0.3,0.8,sm(seg(lt,D*0.4,D))));cm([2.6,1.3,-0.6],[2.4,0.9,-2.2],42);return 'mod'};
S.check=(lt,D,T)=>{CUR='mod';modNight(1,T);STREAM.visible=true;MPUDDLE.visible=true;MPUDDLE.scale.setScalar(1.2);const p=sm(lt/D);put(C.vy,lerp(0.4,2.2,p),lerp(-1.0,-1.2,p),{eyes:1.3,pupil:2,walk:T*4,T});
 if(lt<D*0.55)cm([1.0,1.6,1.6],[2.2,0.9,-1.6],46);else cm([2.9,1.45,-0.7],[2.4,0.95,-2.2],44);return 'mod'};
S.cam=(lt,D,T)=>{CUR='mod';if(lt<D*0.25){modDay();put(C.vy,-2.4,0.4,{phone:true,eyes:1.1,T});close(C.vy,1.1,36,0.2);return 'mod'}
 modNight(0.4,T);const q=sm(seg(lt,D*0.5,D*0.75));put(C.gs,2.4,-1.72,{a:0.97,chew:true,tilt:lerp(-1.2,0,q),glow:0.6});CAMV(T);if(lt>D*0.72){CCTV=1;cm([2.9,1.55,-0.4],[2.4,1.25,-1.72],40)}return 'mod'};
S.offer=(lt,D,T)=>{CUR='mod';modDay();if(lt<D*0.5){MOFFER.userData.fruit.forEach(f=>f.visible=false);put(C.vy,-0.9,-1.3,{eyes:1.2,look:1,T});cm([-0.1,1.7,0.6],[-0.6,1.6,-2.4],42);return 'mod'}
 COOKER.children[1].position.y=0.32;cm([3.35,1.4,-1.3],[3.35,0.95,-2.2],40);return 'mod'};
S.bowls=(lt,D,T)=>{CUR='mod';modDay();mbowls(2,{upright:true});if(lt<D*0.55){cm([3.4,1.35,0.5],[3.4,0.8,-0.6],40);return 'mod'}put(C.vy,4.6,-0.1,{eyes:1.4,pupil:2,T});close(C.vy,1.2,36,-0.2);return 'mod'};
S.su1=(lt,D,T)=>{CUR='mod';modDay();put(C.su,-1.2,0.5,{sleep:true,smileF:lt>D*0.5,eyes:0.7,T});put(C.vy,-0.3,0.4,{eyes:1.1,look:-1,T});cm([-0.6,1.25,3.0],[-0.8,0.8,0.4],44);return 'mod'};
S.su=(lt,D,T)=>{CUR='mod';modDay();put(C.su,-1.2,0.5,{smileF:true,eyes:0.8,mouth:TK('SU'),T});const c=C.su;cm([c.position.x+0.2,0.85,c.position.z+1.4],[c.position.x,0.72,c.position.z],36);return 'mod'};
S.hung2=(lt,D,T)=>{CUR='mod';modNight(0,T);mLamp.intensity=1.6;put(C.hung,-1.6,0.6,{eyes:1.2,mouth:TK('HU'),T});put(C.vy,-0.7,0.9,{eyes:1.2,look:-1,T});close(C.hung,lerp(1.3,1.1,sm(lt/D)),36,0.35);return 'mod'};
S.hung3=(lt,D,T)=>{CUR='mod';modNight(0,T);mLamp.intensity=1.6;put(C.hung,-1.6,0.6,{eyes:1.3,pupil:2.4,point:lt>D*0.6,mouth:TK('HU'),T});close(C.hung,lerp(1.15,0.9,sm(lt/D)),36,-0.25);return 'mod'};
// ---- tìm Tuấn ----
S.find=(lt,D,T)=>{if(lt<D*0.4){CUR='mod';modDay();put(C.vy,-1.4,0.4,{paper:true,eyes:1.1,T});close(C.vy,1.0,36,0.25);return 'mod'}
 CUR='mkt';mktMode(true);const k=sm(seg(lt,D*0.4,D));put(C.tuan,-7.2,-7.6,{eyes:1.1,look:-1,shake:true,T});put(C.vy,-6.3,-7.4,{sit:true,beg:true,tears:true,look:-1,eyes:1,T},-0.2);cm([lerp(-5.0,-5.6,k),1.5,-4.6],[-6.8,1.1,-7.6],42);return 'mkt'};
S.tu1=(lt,D,T)=>{CUR='mkt';mktMode(true);put(C.tuan,-7.2,-7.6,{eyes:1.35,pupil:2,shake:true,mouth:TK('TU'),T});close(C.tuan,lerp(1.4,1.15,sm(lt/D)),36,0.3);return 'mkt'};
S.tu2=(lt,D,T)=>{CUR='mod';modNight(0,T);mLamp.intensity=1.2;const p=sm(lt/D);put(C.vy,lerp(-3.6,-1.4,p),1.6,{walk:T*6,eyes:1,T});put(C.tuan,lerp(-4.4,-2.2,p),1.9,{walk:T*6,phase:T*6,shake:true,eyes:1.2,T});cm([0.6,1.6,4.4],[lerp(-3.4,-1.6,p),1.05,1.6],44);return 'mod'};
// ---- nửa đêm dưới bếp ----
const kitchen=(T,o={})=>{modNight(0.9,T,true);mbowls(3,{upright:true});sitSu(Object.assign({sleep:true,bowl:true},o.S||{}));if(o.G!==false)put(C.gs,GX,GZ,Object.assign({ladle:true,a:0.97},o.G||{}))};
S.night=(lt,D,T)=>{CUR='mod';kitchen(T);const p=sm(lt/D);cm([lerp(2.2,3.2,p),1.5,lerp(2.4,1.6,p)],[3.2,1.0,-1.2],lerp(48,40,p));return 'mod'};
S.gs=(lt,D,T)=>{CUR='mod';kitchen(T,{G:{ladle:true,tilt:0.15}});const c=C.gs;cm([c.position.x+0.5,1.3,c.position.z+lerp(2.0,1.6,sm(lt/D))],[c.position.x,1.2,c.position.z],36);return 'mod'};
S.stop=(lt,D,T)=>{CUR='mod';const g=lt>D*0.25;kitchen(T,{S:g?{bowl:false,eyes:0.5}:{}});put(C.vy,2.4,-0.6,{grab:true,eyes:1.4,pupil:2,T});MSPILL.visible=g;
 if(lt<D*0.55)cm([2.6,1.5,1.6],[3.1,0.9,-0.9],44);else cm([3.5,1.15,0.1],[3.5,0.78,-0.5],38);return 'mod'};
S.turn=(lt,D,T)=>{CUR='mod';kitchen(T,{S:{bowl:false},G:{tilt:lerp(-0.6,0,sm(seg(lt,0,D*0.45))),chew:true,reach:lt>D*0.6}});MSPILL.visible=true;const c=C.gs;cm([c.position.x+0.5,1.3,c.position.z+lerp(2.2,1.5,sm(lt/D))],[c.position.x,1.22,c.position.z],36);return 'mod'};
S.tu3=(lt,D,T)=>{CUR='mod';kitchen(T,{S:{bowl:false}});MSPILL.visible=true;put(C.tuan,1.5,-0.9,{beg:true,tears:true,shake:true,eyes:1.2,mouth:TK('TU'),T});close(C.tuan,1.2,36,0.3);return 'mod'};
S.gs2=(lt,D,T)=>{CUR='mod';kitchen(T,{S:{bowl:false},G:{reach:true,chew:false}});MSPILL.visible=true;C.gs.position.set(lerp(3.0,2.3,sm(lt/D)),0.98,-1.3);put(C.tuan,1.5,-0.9,{beg:true,shake:true,eyes:1.4,T});cm([1.6,1.5,1.8],[2.2,1.1,-1.1],42);return 'mod'};
S.door=(lt,D,T)=>{CUR='mod';modNight(0,T);mLamp.intensity=1.0;const sl=sm(seg(lt,0,0.25));kdoor(1-sl);const p=sm(seg(lt,D*0.1,D*0.5));put(C.vy,lerp(0.3,-1.8,p),lerp(-0.8,0.6,p),{hug:true,walk:T*8,eyes:1.4,T});put(C.su,lerp(0.6,-1.3,p),lerp(-0.6,0.8,p),{walk:T*8,eyes:1.2,T});
 const hit=lt>D*0.3&&lt<D*0.8;KDOOR.position.x+=hit?0.02*Math.sin(T*40):0;if(hit&&Math.sin(T*9)>0.6)RED=0.14;cm([-2.4,1.5,2.6],[0.9,1.1,-1.0],46);return 'mod'};
S.morning=(lt,D,T)=>{CUR='mod';modDay();MSPILL.visible=true;mbowls(3,{upright:true});put(C.tuan,SUX+0.55,SUZ,{sit:true,dead:true,potHug:true,T},-0.05);if(lt<D*0.45)KC();else{const c=C.tuan;cm([c.position.x+0.2,1.3,c.position.z+2.1],[c.position.x,1.0,c.position.z],38)}return 'mod'};
S.end=(lt,D,T)=>{CUR='mod';modDay();put(C.su,-1.0,0.2,{smileF:true,eyes:1,T});put(C.vy,-0.2,0.0,{eyes:0.9,look:-1,T});cm([-0.4,1.6,2.8],[-0.6,1.2,-1.0],44);return 'mod'};
S.end2=(lt,D,T)=>{CUR='mod';if(lt<D*0.35){modNight(0,T);mLamp.intensity=0.3;put(C.vy,MBED.position.x-0.35,MBED.position.z-0.75,{phone:true,eyes:1.35,pupil:2,T},-0.18);const c=C.vy;cm([c.position.x+0.25,1.4,c.position.z+1.7],[c.position.x,1.15,c.position.z],38);return 'mod'}
 modNight(0.45,T);mbowls(3,{full:true,upright:true});put(C.gs,SUX+0.7,SUZ,{sit:true,a:0.95,chew:true},-0.12);put(C.tuan,SUX,SUZ,{sit:true,eyes:0.05,T},-0.12);CHAIRS[2].position.z=KM[1]+lerp(0.62,0.95,sm(seg(lt,D*0.7,D*0.9)));CAMV(T);return 'mod'};
S.gs3=(lt,D,T)=>{CUR='mod';modNight(0,T);mLamp.intensity=0.4;mFill.color.set(0x9ab0c8);mFill.intensity=2.4;mFill.position.set(0.3,1.6,0.2);kdoor(0.6);put(C.gs,0.9,-0.8,{a:0.92,chew:false,arm:[undefined,-0.9+0.2*Math.sin(T*2)],glow:0.6});cm([-2.0,1.45,1.8],[0.9,1.25,-0.8],40);return 'mod'};
S.cta=(lt,D,T)=>{CUR='mod';modNight(0.5,T,true);ctaFlag=true;mbowls(3,{full:true,upright:true});cm([3.4,1.4,lerp(1.4,1.1,sm(lt/D))],[3.4,0.8,-0.5],44);return 'mod'};
function cctvOv(t){g2.save();g2.strokeStyle='rgba(255,255,255,.06)';for(let y=0;y<RH;y+=4){g2.beginPath();g2.moveTo(0,y);g2.lineTo(RW,y);g2.stroke()}
 g2.font='bold 30px "DejaVu Sans Mono"';g2.fillStyle='#ffffff';g2.strokeStyle='#000';g2.lineWidth=4;const s=Math.floor(t*1)%60;const ts=`03:00:${String(12+s%48).padStart(2,'0')}`;g2.strokeText('CAM 01 - BẾP',30,60);g2.fillText('CAM 01 - BẾP',30,60);g2.strokeText(ts,RW-210,60);g2.fillText(ts,RW-210,60);
 if(Math.sin(t*6)>0){g2.fillStyle='#ff2a2a';g2.beginPath();g2.arc(40,100,10,0,7);g2.fill();g2.fillStyle='#fff';g2.fillText('REC',60,111)}g2.restore()}
