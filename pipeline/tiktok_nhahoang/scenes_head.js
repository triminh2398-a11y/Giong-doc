// ================= cảnh: CĂN NHÀ BỎ HOANG =================
const S={};let ctaFlag=false,BLACK=0,TITLE=false,RED=0,RAIN=0,FLASH=0,NOW=0,CCTV=0;
const JUMPS=[['hook2',0.06,0.45,1],['gm',0.3,0.45,1]];
const SOFT=[['night2',0.75,0.25,0]];
const TK=sp=>{for(const [a,b,s] of TLD.vox){if(s===sp&&NOW>=a&&NOW<b)return Math.sin(NOW*14)>-0.2?'o':undefined}return undefined};
const flick=T=>0.85+0.15*Math.sin(T*11)*Math.sin(T*3.7);
const bedNight=(l=0.6)=>{night();lampL.intensity=l;moonSpot.intensity=4};
const FZ=HD/2+0.2;// mép hiên
const RV=(m,old)=>{ruinMode(m,old)};
// ---- mở đầu ----
S.hook=(lt,D,T)=>{CUR='ruin';RV('night');buaN(6,true);winGlow.intensity=0.6*flick(T);const p=sm(lt/D);cm([lerp(-6,-2,p),lerp(2.2,1.6,p),lerp(16,9,p)],[0,1.4,0],lerp(48,42,p));return 'ruin'};
S.hook2=(lt,D,T)=>{CUR='inn';bedNight(0.25);fillL.color.set(0xa8c0d8);fillL.intensity=2.6;fillL.position.set(-1.0,1.6,0.6);put(C.gw,-1.2,-0.6,{a:0.95,baby:true,open:0.7});const c=C.gw;cm([c.position.x+0.1,1.3,c.position.z+lerp(2.0,1.6,sm(lt/D))],[c.position.x,1.15,c.position.z],38);RED=0.08*(1-sm(lt/D));return 'inn'};
S.title=(lt,D,T)=>{CUR='ruin';RV('dusk');buaN(6,true);cm([3,1.5,15],[0,1.6,0],46);return 'ruin'};
// ---- ông nội cất nhà ----
S.intro=(lt,D,T)=>{CUR='ruin';RV('day',true);put(C.noi,-1.2,FZ+1.4,{eyes:1,look:1,T});const p=sm(lt/D);cm([lerp(5,2,p),1.6,lerp(13,9,p)],[0,1.4,0.5],46);return 'ruin'};
S.first=(lt,D,T)=>{CUR='inn';bedNight(0.3);if(lt<D*0.5){const q=sm(seg(lt,D*0.25,D*0.5));buongDoor(q);cm([0.6,1.5,1.6],[3.0,1.2,-1.1],44);return 'inn'}put(C.noi,0.6,0.2,{eyes:1.35,pupil:2,T});lampL.intensity=1.0;close(C.noi,1.2,36,0.25);return 'inn'};
S.cry=(lt,D,T)=>{CUR='inn';bedNight(0.4);inBed(C.noi,1,{eyes:1.35,pupil:2,look:-1,T});if(lt<D*0.5){cm([BED.position.x+0.3,1.7,BED.position.z+2.0],[BED.position.x,1.0,BED.position.z-0.6],44);return 'inn'}cm([BED.position.x+0.2,0.25,BED.position.z+1.4],[BED.position.x,0.15,BED.position.z],50);return 'inn'};
// ---- trấn yểm ----
S.thay=(lt,D,T)=>{CUR='ruin';RV('day',true);buaN(Math.min(6,1+Math.floor(lt/D*4)));put(C.thay2,0.9,FZ-0.9,{bua:true,eyes:1,look:-1,T});put(C.noi,2.0,FZ+0.2,{eyes:1,look:-1,T});cm([1.6,1.5,FZ+3.4],[0.3,1.3,FZ-1.2],44);return 'ruin'};
S.thay1=(lt,D,T)=>{CUR='ruin';RV('day',true);buaN(4);put(C.thay2,0.9,FZ-0.5,{eyes:1.05,mouth:TK('TH'),T});close(C.thay2,lerp(1.4,1.15,sm(lt/D)),36,0.25);return 'ruin'};
S.cycle=(lt,D,T)=>{CUR='ruin';const k=Math.min(3,Math.floor(lt/(D*0.25)));RV(k%2?'dusk':'day',true);buaN(3+k);cm([0.2,1.55,FZ+lerp(2.6,1.6,sm(lt/D))],[0,1.45,FZ-1.25],40);return 'ruin'};
// ---- con cháu thay nhau ở rồi đi ----
S.turns=(lt,D,T)=>{CUR='ruin';RV('dusk',true);buaN(6);const k=Math.min(2,Math.floor(lt/(D/3)));const q=(lt-k*D/3)/(D/3);const who=[C.phuc,C.lien,C.bay][k];put(who,lerp(-0.4,-5,q),lerp(FZ+0.8,FZ+4,q),{bundle:true,walk:T*6,phase:T*6,eyes:0.9,look:-1,T});cm([3,1.6,FZ+8],[-1.5,1.0,FZ+1.5],44);return 'ruin'};
// ---- người cháu ở thử ----
S.grand=(lt,D,T)=>{CUR='ruin';RV('day',true);buaN(6,true);const p=sm(lt/D);put(C.chau,lerp(-3,-0.5,p),lerp(FZ+5,FZ+0.8,p),{phase:T*6,eyes:1,T});cm([lerp(-1,1,p),1.6,FZ+8],[lerp(-2,-0.4,p),1.0,FZ+1],44);return 'ruin'};
S.night1=(lt,D,T)=>{CUR='inn';bedNight(0.3);if(lt<D*0.45){inBed(C.chau,0,{eyes:1.35,pupil:2,look:1,T});cm([BED.position.x+0.3,1.7,BED.position.z+2.0],[BED.position.x,1.0,BED.position.z-0.6],44);return 'inn'}
 HPR.visible=true;lampL.intensity=1.4;lampL.position.set(BED.position.x+0.3,0.3,BED.position.z+0.9);cm([BED.position.x+0.25,0.3,BED.position.z+1.5],[BED.position.x,0.02,BED.position.z+0.6],48);return 'inn'};
S.night2=(lt,D,T)=>{CUR='inn';bedNight(0.35);fillL.color.set(0xa8c0d8);fillL.intensity=2.6;fillL.position.set(BED.position.x+1.4,1.6,BED.position.z+1.6);inBed(C.chau,0,{eyes:1.4,pupil:2,T});put(C.gw,BED.position.x+0.1,BED.position.z+0.9,{sitBack:true,baby:true,a:0.93},-0.2);
 if(lt>D*0.6){const q=sm(seg(lt,D*0.6,D));put(C.gm,BED.position.x+1.6,BED.position.z+0.2,{a:0.9*q})}
 cm([BED.position.x+0.6,1.6,BED.position.z+2.6],[BED.position.x+0.8,1.0,BED.position.z+0.2],46);return 'inn'};
S.gm=(lt,D,T)=>{CUR='inn';bedNight(0.35);fillL.color.set(0xa8c0d8);fillL.intensity=2.6;fillL.position.set(BED.position.x+1.4,1.6,BED.position.z+1.6);put(C.gm,BED.position.x+1.2,BED.position.z+0.5,{a:0.95,open:0.3+0.4*Math.max(0,Math.sin(T*9))});put(C.gw,BED.position.x+1.9,BED.position.z+0.1,{a:0.9,baby:true});const c=C.gm;cm([c.position.x+0.3,1.3,c.position.z+lerp(2.0,1.6,sm(lt/D))],[c.position.x+0.3,1.15,c.position.z],40);return 'ruin'===0?0:'inn'};
S.run=(lt,D,T)=>{CUR='ruin';RV('night');buaN(6,true);if(lt<D*0.45){const p=sm(lt/(D*0.45));put(C.chau,lerp(-0.4,-2.4,p),lerp(FZ+0.6,FZ+5,p),{phase:T*10,eyes:1.4,pupil:2,T});cm([1.5,1.9,FZ+9],[-1.2,1.0,FZ+2.5],44);return 'ruin'}
 winGlow.intensity=1.2*flick(T);rFill.color.set(0xa8c0d8);rFill.intensity=3.5;rFill.position.set(2.8,1.6,FZ+1.5);put(C.gm,2.4,FZ-1.0,{a:0.9});put(C.gw,3.2,FZ-1.0,{a:0.9,baby:true,wave:true});const q=sm(seg(lt,D*0.45,D));cm([lerp(-1,2.4,q),1.9,FZ+lerp(8,5.6,q)],[2.8,1.25,FZ-1],lerp(40,30,q));return 'ruin'};
S.leave=(lt,D,T)=>{CUR='ruin';RV('day',true);buaN(6);const p=sm(lt/D);put(C.phuc,lerp(-0.6,-4,p),lerp(FZ+1,FZ+4,p),{bundle:true,walk:T*6,phase:T*6,eyes:0.9,T});put(C.lien,lerp(0.2,-3.2,p),lerp(FZ+1.2,FZ+4.2,p),{bundle:true,walk:T*6,eyes:0.9,T});put(C.chau,lerp(0.9,-2.4,p),lerp(FZ+1.1,FZ+4.1,p),{phase:T*6,eyes:0.9,T});cm([3,1.6,FZ+8],[-1.5,1.0,FZ+2],44);return 'ruin'};
S.end=(lt,D,T)=>{CUR='ruin';RV('night');buaN(6,true);winGlow.intensity=0.5*flick(T);const p=sm(lt/D);cm([lerp(-4,-1,p),1.5,lerp(15,9,p)],[0,1.3,0],lerp(46,40,p));return 'ruin'};
S.cta=(lt,D,T)=>{CUR='ruin';RV('night');ctaFlag=true;buaN(6,true);winGlow.intensity=0.4*flick(T);cm([2,1.5,15],[0,1.5,0],46);return 'ruin'};
