// ================= cảnh: CĂN NHÀ BỎ HOANG (gia đình dọn về) =================
const S={};let ctaFlag=false,BLACK=0,TITLE=false,RED=0,RAIN=0,FLASH=0,NOW=0,CCTV=0;
const JUMPS=[['hook2',0.55,0.45,1],['title',0.02,0.4,1],['mirror',0.55,0.45,1],['gm',0.3,0.45,1]];
const SOFT=[['night2',0.4,0.25,0]];
const TK=sp=>{for(const [a,b,s] of TLD.vox){if(s===sp&&NOW>=a&&NOW<b)return Math.sin(NOW*14)>-0.2?'o':undefined}return undefined};
const flick=T=>0.85+0.15*Math.sin(T*11)*Math.sin(T*3.7);
const strobe=T=>(Math.sin(T*23)*Math.sin(T*7.3)>0.2?1:0.08);
const bedNight=(l=0.6)=>{night();lampL.intensity=l;moonSpot.intensity=4};
const FZ=HD/2+0.2;const RV=(m,old)=>ruinMode(m,old);
const cold=(x,y,z,i=2.6)=>{fillL.color.set(0xa8c0d8);fillL.intensity=i;fillL.position.set(x,y,z)};
const KCAM=()=>cm([4.1,1.5,1.6],[4.55,0.9,-0.9],44);
// ---- mở đầu ----
S.hook=(lt,D,T)=>{CUR='ruin';RV('night');buaN(6,true);winGlow.intensity=0.6*flick(T);const p=sm(lt/D);cm([lerp(-6,-2,p),lerp(2.2,1.7,p),lerp(16,9.5,p)],[0,1.4,0],lerp(48,42,p));return 'ruin'};
S.hook2=(lt,D,T)=>{CUR='ruin';RV('night');buaN(6,true);winGlow.intensity=strobe(T)*1.2;if(lt<D*0.5){cm([1.5,1.9,FZ+7],[2.8,1.5,FZ-1],40);return 'ruin'}rFill.color.set(0xa8c0d8);rFill.intensity=3.5;rFill.position.set(2.8,1.6,FZ+1.5);put(C.gw,2.8,FZ-0.9,{a:0.95,baby:true});cm([2.8,1.55,FZ+lerp(2.4,1.9,sm(seg(lt,D*0.5,D)))],[2.8,1.3,FZ-0.9],38);return 'ruin'};
S.title=(lt,D,T)=>{CUR='ruin';RV('night');TITLE=true;buaN(6,true);rFill.color.set(0xa8c0d8);rFill.intensity=4;rFill.position.set(0,1.8,FZ+3);put(C.gw,0,FZ-0.7,{a:0.95,baby:true});cm([0,1.75,FZ+lerp(4.4,3.8,sm(lt/D))],[0,1.2,FZ-0.7],40);BLACK=0.35;return 'ruin'};
// ---- dọn về ----
S.move=(lt,D,T)=>{CUR='ruin';RV('day',true);const p=sm(lt/D);const z=lerp(FZ+6,FZ+1.2,p);put(C.hoa,-0.8,z,{bundle:true,phase:T*6,eyes:1,T});put(C.ngan,0.1,z+0.3,{bundle:true,walk:T*6,eyes:1,T});put(C.nam,0.9,z+0.5,{walk:T*5,eyes:1,T});cm([lerp(2.5,1.5,p),1.7,FZ+9],[0,1.1,z],44);return 'ruin'};
// ---- nước chảy, bếp ----
S.water=(lt,D,T)=>{CUR='inn';bedNight(0.2);PUDDLE.visible=true;PUDDLE.scale.setScalar(lerp(0.5,1.2,sm(lt/D)));if(lt<D*0.35){cm([4.6,1.0,1.4],[5.4,0.5,-0.2],44);return 'inn'}const p=sm(seg(lt,D*0.35,D));put(C.hoa,lerp(3.4,4.6,p),lerp(0.4,0.1,p),{lamp:true,phase:T*4,eyes:1.3,pupil:2,T});lampL.intensity=1.4;lampL.position.set(C.hoa.position.x+0.3,1.0,C.hoa.position.z+0.3);cm([3.6,1.5,2.0],[5.0,0.7,-0.2],44);return 'inn'};
S.kitchen=(lt,D,T)=>{CUR='inn';if(lt<D*0.55){bedNight(0.05);kitL.intensity=0.15;STOVE.userData.lid.rotation.z=0.12*Math.sin(T*30);KCAM();return 'inn'}night();kitL.color.set(0xfff0d8);kitL.intensity=2.2;bowls(3);put(C.hoa,3.4,0.6,{eyes:1.35,pupil:2,T});cm([3.2,1.5,1.9],[4.5,0.75,-0.75],42);return 'inn'};
S.cry=(lt,D,T)=>{CUR='inn';bedNight(0.35);inBed(C.hoa,1,{eyes:1.35,pupil:2,look:-1,T});inBed(C.ngan,-1,{eyes:1.4,pupil:2,look:1,T});if(lt<D*0.55){cm([BED.position.x+0.3,1.7,BED.position.z+2.0],[BED.position.x,1.0,BED.position.z-0.6],44);return 'inn'}cm([0.2,1.7,0.4],[0.6,1.8,-2.49],40);return 'inn'};
S.light=(lt,D,T)=>{CUR='inn';bedNight(0.9*strobe(T));BLACK=strobe(T)<0.5?0.55:0;buongDoor(Math.max(0,Math.sin(lt*2.2))*(lt<D*0.8?1:0));put(C.nam,0.4,0.6,{eyes:1.35,pupil:2,look:1,T});cm([-0.6,1.6,2.2],[1.8,1.2,-0.8],46);return 'inn'};
// ---- gương ----
S.mirror=(lt,D,T)=>{CUR='inn';bedNight(0.6);lampL.position.set(0.6,1.6,-0.6);cold(0.4,1.6,-1.0,1.4);MIRROR.material.map=lt>D*0.5?mirG:mirN;MIRROR.material.needsUpdate=true;put(C.ngan,-0.25,-1.75,{back:true,T});const q=sm(lt/D);cm([lerp(1.1,0.75,q),1.5,lerp(0.3,-0.6,q)],[0.4,1.5,-2.47],lerp(40,30,q));return 'inn'};
S.turn=(lt,D,T)=>{CUR='inn';bedNight(0.5);cold(0.4,1.4,0.4,1.6);put(C.ngan,0.4,-1.55,{eyes:1.45,pupil:1.6,pale:true,T});PUDDLE.visible=true;PUDDLE.position.set(0.6,0.006,-0.9);PUDDLE.scale.setScalar(0.45);if(lt<D*0.5)close(C.ngan,1.1,36,0.2);else cm([0.9,1.0,0.3],[0.6,0.05,-0.9],46);return 'inn'};
// ---- trấn yểm ----
S.thay=(lt,D,T)=>{CUR='ruin';RV('day',true);buaN(Math.min(6,1+Math.floor(lt/D*4)));put(C.thay2,0.9,FZ-0.9,{bua:true,eyes:1,look:-1,T});put(C.nam,2.0,FZ+0.2,{eyes:1,look:-1,T});cm([1.6,1.5,FZ+3.4],[0.3,1.3,FZ-1.2],44);return 'ruin'};
S.thay1=(lt,D,T)=>{CUR='ruin';RV('day',true);buaN(4);put(C.thay2,0.9,FZ-0.5,{eyes:1.05,mouth:TK('TH'),T});close(C.thay2,lerp(1.4,1.15,sm(lt/D)),36,0.25);return 'ruin'};
S.cycle=(lt,D,T)=>{CUR='ruin';const k=Math.min(3,Math.floor(lt/(D*0.25)));RV(k%2?'dusk':'day',true);buaN(3+k);cm([0.2,1.55,FZ+lerp(2.6,1.6,sm(lt/D))],[0,1.45,FZ-1.25],40);return 'ruin'};
// ---- đêm nặng nhất ----
S.heavy=(lt,D,T)=>{CUR='inn';bedNight(0.3*strobe(T*0.5)+0.1);cold(BED.position.x+0.6,1.8,BED.position.z+0.8,2.2);inBed(C.hoa,1,{eyes:lt>D*0.4?1.45:0.05,pupil:1.6,T});inBed(C.ngan,-1,{eyes:0.05,T});
 if(lt>D*0.5)put(C.gm,BED.position.x+0.9,BED.position.z-0.4,{a:0.95,tilt:0.25});cm([BED.position.x+0.6,1.7,BED.position.z+2.4],[BED.position.x+0.4,1.1,BED.position.z-0.4],44);return 'inn'};
S.gm=(lt,D,T)=>{CUR='inn';bedNight(0.25);cold(BED.position.x+0.9,1.7,BED.position.z+1.0,2.8);put(C.gm,BED.position.x+0.9,BED.position.z-0.4,{a:0.95,tilt:0.2,open:0.3+0.4*Math.max(0,Math.sin(T*9))});const c=C.gm;cm([c.position.x+0.25,1.32,c.position.z+lerp(1.9,1.5,sm(lt/D))],[c.position.x+0.25,1.2,c.position.z],38);return 'inn'};
S.night2=(lt,D,T)=>{CUR='inn';bedNight(0.25);cold(2.4,1.6,-0.4,2.8);buongDoor(1);put(C.gw,2.75,-1.1,{a:0.95,baby:true,open:0.7});inBed(C.hoa,1,{eyes:1.45,pupil:1.6,look:1,T});cm([BED.position.x+0.7,1.6,BED.position.z+1.8],[2.7,1.2,-1.1],lerp(46,36,sm(lt/D)));return 'inn'};
// ---- bỏ đi ----
S.leave=(lt,D,T)=>{CUR='ruin';RV('day',true);buaN(6);const p=sm(lt/D);put(C.hoa,lerp(-0.6,-4,p),lerp(FZ+1,FZ+4,p),{bundle:true,phase:T*6,eyes:0.9,T});put(C.ngan,lerp(0.2,-3.2,p),lerp(FZ+1.2,FZ+4.2,p),{bundle:true,walk:T*6,eyes:0.9,T});put(C.nam,lerp(0.9,-2.4,p),lerp(FZ+1.1,FZ+4.1,p),{walk:T*5,eyes:0.9,T});cm([3,1.6,FZ+8],[-1.5,1.0,FZ+2],44);return 'ruin'};
S.end=(lt,D,T)=>{CUR='ruin';RV('night');buaN(6,true);winGlow.intensity=1.0*strobe(T);const p=sm(lt/D);cm([lerp(-4,-1,p),1.6,lerp(15,9.5,p)],[0,1.3,0],lerp(46,40,p));return 'ruin'};
S.cta=(lt,D,T)=>{CUR='ruin';RV('night');ctaFlag=true;buaN(6,true);winGlow.intensity=0.6*strobe(T);cm([2,1.6,15],[0,1.5,0],46);return 'ruin'};
