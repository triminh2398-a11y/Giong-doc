// ================= cảnh: NGƯỜI CHỦ CŨ =================
const S={};let ctaFlag=false,BLACK=0,TITLE=false,RED=0,RAIN=0,FLASH=0,NOW=0;
const JUMPS=[['hook2',0.05,0.45,1],['gs',0.3,0.4,1],['turn',0.45,0.45,1]];
const SOFT=[['gs2',0.4,0.25,0]];
const TK=sp=>{for(const [a,b,s] of TLD.vox){if(s===sp&&NOW>=a&&NOW<b)return Math.sin(NOW*14)>-0.2?'o':undefined}return undefined};
const flick=T=>0.85+0.15*Math.sin(T*11)*Math.sin(T*3.7);
const bedNight=(l=0.6)=>{night();lampL.intensity=l;moonSpot.intensity=4};
const kNight=(T,l=1.2)=>{night();lampL.intensity=0.25;moonSpot.intensity=2;kitL.color.set(0xa8b4d0);kitL.intensity=l*1.3*flick(T);LAMP2.visible=true};
const kDay=()=>{kitL.color.set(0xfff0d8);day();dayL.intensity=0.9;kitL.intensity=0.8;LAMP2.visible=false};
const KCAM=(T,d=0)=>cm([4.1,1.5,1.6-d],[4.55,0.9,-0.9],44);
const sitAt=(c,o,x=4.5,z=-0.35)=>put(c,x,z,Object.assign({sit:true},o),-0.22);
// ---- mở đầu ----
S.hook=(lt,D,T)=>{CUR='ext';extMode('night');const p=sm(lt/D);cm([lerp(5.5,2.2,p),lerp(2.4,1.6,p),lerp(9,4.0,p)],[1.2,1.3,1.6],lerp(46,38,p));return 'ext'};
S.hook2=(lt,D,T)=>{CUR='inn';kNight(T,1.4);stoveL.intensity=0.7*flick(T);put(C.gs,4.05,-1.6,{ladle:true,a:0.97});const c=C.gs;cm([c.position.x+0.1,1.3,c.position.z+lerp(2.2,1.7,sm(lt/D))],[c.position.x,1.2,c.position.z],36);RED=0.12*(1-sm(lt/D));return 'inn'};
S.title=(lt,D,T)=>{CUR='inn';kNight(T,1.0);TITLE=true;bowls(3,{upright:true});stoveL.intensity=0.8;cm([4.5,1.3,0.45],[4.5,0.7,-0.75],44);return 'inn'};
// ---- mua nhà ----
S.buy=(lt,D,T)=>{CUR='ext';extMode('day');const p=sm(lt/D);put(C.phuc,-0.6,2.4,{eyes:1,smileF:true,T});put(C.lien,0.3,2.5,{eyes:1,T});const tx=lerp(-2.2,-6.5,sm(seg(lt,D*0.45,D)));put(C.tu,tx,2.9,{shake:true,eyes:1.2,walk:T*7,phase:T*7,look:1,T});
 cm([lerp(1.8,0.4,p),1.7,7.2],[lerp(-0.2,-2.0,p),1.0,2.5],46);return 'ext'};
S.bay=(lt,D,T)=>{CUR='inn';kDay();bowls(0);put(C.bay,4.0,-0.3,{eyes:1,look:-1,T});put(C.lien,5.1,-0.1,{eyes:1,look:-1,T});KCAM(T);return 'inn'};
S.bay1=(lt,D,T)=>{CUR='inn';kDay();put(C.bay,4.0,-0.3,{eyes:1.1,point:lt>D*0.5,mouth:TK('BA'),T});close(C.bay,lerp(1.3,1.1,sm(lt/D)),36,0.2);return 'inn'};
// ---- đêm đầu ----
S.water=(lt,D,T)=>{CUR='inn';if(lt<D*0.4){bedNight(0.9);inBed(C.phuc,1,{eyes:1.3,look:1,T});inBed(C.lien,-1,{eyes:1.3,look:1,T});cm([BED.position.x+0.3,1.75,BED.position.z+2.0],[BED.position.x,1.0,BED.position.z-0.6],44);return 'inn'}
 kNight(T,0.4);STOVE.userData.lid.rotation.z=0.08*Math.sin(T*25);PUDDLE.visible=true;PUDDLE.scale.setScalar(lerp(0.3,0.9,sm(seg(lt,D*0.4,D))));cm([4.2,1.2,0.4],[5.0,0.5,-1.0],46);return 'inn'};
S.check=(lt,D,T)=>{CUR='inn';kNight(T,0.3);PUDDLE.visible=true;PUDDLE.scale.setScalar(1.1);const p=sm(lt/D);put(C.phuc,lerp(3.4,4.6,p),lerp(-1.1,-0.2,p),{lamp:true,eyes:1.2,walk:T*5,phase:T*5,T});lampL.intensity=1.5;lampL.position.set(C.phuc.position.x+0.3,1.0,C.phuc.position.z+0.2);
 if(lt<D*0.55)cm([3.5,1.5,0.45],[4.6,0.9,-0.6],46);else cm([5.0,0.9,0.4],[5.5,0.5,-0.1],40);return 'inn'};
S.offer=(lt,D,T)=>{CUR='inn';if(lt<D*0.5){day();dayL.intensity=0.7;put(C.lien,0.8,0.1,{eyes:1.1,look:1,T});BOWL.visible=true;cm([1.6,1.5,2.2],[1.2,0.9,0.3],42);return 'inn'}
 kDay();STOVE.userData.lid.position.y=0.5;cm([4.0,1.25,-1.4],[4.0,0.85,-2.15],40);return 'inn'};
S.bowls=(lt,D,T)=>{CUR='inn';kDay();kitL.intensity=0.5;bowls(2,{upright:true});if(lt<D*0.5){cm([4.5,1.35,0.6],[4.5,0.68,-0.8],40);return 'inn'}put(C.lien,5.2,-0.2,{eyes:1.4,pupil:2,T});close(C.lien,1.2,36,-0.2);return 'inn'};
// ---- mộng du ----
S.sleep=(lt,D,T)=>{CUR='inn';kNight(T,0.6);bowls(2,{upright:true});if(lt<D*0.5){const p=sm(lt/(D*0.5));put(C.phuc,lerp(3.3,4.4,p),lerp(-1.1,-0.4,p),{sleep:true,walk:T*3,phase:T*3,armA:[-0.6,0.6],T});cm([3.6,1.5,0.45],[4.4,0.9,-0.8],46);return 'inn'}
 sitAt(C.phuc,{sleep:true,bowl:true,T});KCAM(T);return 'inn'};
S.phuc=(lt,D,T)=>{CUR='inn';kNight(T,0.7);bowls(2,{upright:true});sitAt(C.phuc,{sleep:true,bowl:true,mouth:TK('PH'),T});const c=C.phuc;cm([c.position.x+0.15,1.05,c.position.z+1.6],[c.position.x,0.9,c.position.z],36);return 'inn'};
S.lien=(lt,D,T)=>{CUR='inn';kNight(T,0.6);bowls(2,{upright:true});sitAt(C.phuc,{sleep:true,bowl:true,mutter:true,T});put(C.lien,3.3,-0.9,{lamp:true,eyes:1.35,pupil:2,cover:lt>D*0.5,T});lampL.intensity=1.2;lampL.position.set(3.6,1.0,-0.7);
 if(lt<D*0.45)cm([4.6,1.45,0.4],[3.4,1.2,-1.0],40);else{close(C.lien,1.2,36,0.3)}return 'inn'};
// ---- bà Bảy kể ----
S.bay2=(lt,D,T)=>{CUR='ext';extMode('dusk');eHemi.intensity=1.1;put(C.lien,-3.0,2.7,{eyes:1.2,look:-1,T});put(C.bay,-3.9,2.5,{eyes:1.1,mouth:TK('BA'),T});close(C.bay,lerp(1.3,1.1,sm(lt/D)),36,0.35);return 'ext'};
S.bay3=(lt,D,T)=>{CUR='ext';extMode('dusk');eHemi.intensity=1.1;put(C.bay,-3.9,2.5,{eyes:1.3,pupil:2.4,point:lt>D*0.6,mouth:TK('BA'),T});close(C.bay,lerp(1.15,0.9,sm(lt/D)),36,-0.25);return 'ext'};
// ---- tìm ông Tư ----
S.find=(lt,D,T)=>{if(lt<D*0.4){CUR='inn';day();dayL.intensity=0.7;put(C.lien,0.8,0.1,{paper:true,eyes:1.1,T});close(C.lien,1.0,36,0.25);return 'inn'}
 CUR='mkt';const k=sm(seg(lt,D*0.4,D));put(C.tu,-7.2,-7.6,{eyes:1.1,look:-1,shake:true,T});put(C.lien,-6.3,-7.4,{sit:true,beg:true,tears:true,look:-1,eyes:1,T},-0.2);cm([lerp(-5.0,-5.6,k),1.5,-4.6],[-6.8,1.1,-7.6],42);return 'mkt'};
S.tu1=(lt,D,T)=>{CUR='mkt';put(C.tu,-7.2,-7.6,{eyes:1.35,pupil:2,shake:true,mouth:TK('TU'),T});close(C.tu,lerp(1.4,1.15,sm(lt/D)),36,0.3);return 'mkt'};
S.tu2=(lt,D,T)=>{CUR='ext';extMode('dusk');const p=sm(lt/D);const x=lerp(-6.5,-1.6,p);put(C.lien,x+0.9,2.7,{walk:T*6,eyes:1,T});put(C.tu,x,3.0,{walk:T*6,phase:T*6,shake:true,eyes:1.2,T});cm([x+1.6,1.6,6.6],[x+0.4,1.05,2.8],44);return 'ext'};
// ---- nửa đêm dưới bếp ----
const kitchenScene=(T,o={})=>{kNight(T,0.9);stoveL.intensity=0.6*flick(T);LAMP2.visible=true;bowls(3,{upright:true});sitAt(C.phuc,Object.assign({sleep:true,bowl:true,T},o.P||{}));if(o.G!==false)put(C.gs,4.6,-1.45,Object.assign({ladle:true,a:0.97},o.G||{}))};
S.night=(lt,D,T)=>{CUR='inn';kitchenScene(T);const p=sm(lt/D);cm([lerp(3.4,4.1,p),1.45,lerp(0.45,0.3,p)],[4.55,1.0,-1.0],lerp(48,40,p));return 'inn'};
S.gs=(lt,D,T)=>{CUR='inn';kitchenScene(T,{G:{ladle:true,tilt:0.15}});const c=C.gs;cm([c.position.x+0.45,1.3,c.position.z+lerp(2.0,1.6,sm(lt/D))],[c.position.x,1.2,c.position.z],36);return 'inn'};
S.stop=(lt,D,T)=>{CUR='inn';const g=lt>D*0.25;kitchenScene(T,{P:g?{bowl:false,armA:[-0.4,0.4],eyes:0.5}:{}});put(C.lien,4.0,-0.2,{grab:true,eyes:1.4,pupil:2,T});SPILL.visible=g;
 if(lt<D*0.55)cm([4.0,1.45,0.45],[4.5,0.9,-0.7],44);else cm([4.6,1.05,-0.35],[4.6,0.65,-0.8],38);return 'inn'};
S.turn=(lt,D,T)=>{CUR='inn';kitchenScene(T,{G:{tilt:lerp(-0.6,0,sm(seg(lt,0,D*0.45))),chew:true,reach:lt>D*0.6}});SPILL.visible=true;const c=C.gs;cm([c.position.x+0.45,1.3,c.position.z+lerp(2.2,1.5,sm(lt/D))],[c.position.x,1.22,c.position.z],36);return 'inn'};
S.tu3=(lt,D,T)=>{CUR='inn';kitchenScene(T,{P:{bowl:false}});SPILL.visible=true;put(C.tu,3.4,-1.0,{beg:true,tears:true,shake:true,eyes:1.2,mouth:TK('TU'),T});close(C.tu,1.2,36,0.3);return 'inn'};
S.gs2=(lt,D,T)=>{CUR='inn';kitchenScene(T,{P:{bowl:false},G:{reach:true,chew:false}});SPILL.visible=true;C.gs.position.set(lerp(4.4,3.9,sm(lt/D)),0.98,-1.1);put(C.tu,3.4,-1.0,{beg:true,shake:true,eyes:1.4,T});cm([3.1,1.45,0.4],[3.9,1.1,-1.1],42);return 'inn'};
S.door=(lt,D,T)=>{CUR='inn';bedNight(0.5);lampL.position.set(1.0,1.2,0.6);const sl=sm(seg(lt,0,0.25));buongDoor(1-sl);const p=sm(seg(lt,D*0.1,D*0.5));put(C.lien,lerp(2.3,0.6,p),lerp(-0.9,0.4,p),{pull:true,walk:T*8,eyes:1.4,T});put(C.phuc,lerp(2.7,1.1,p),lerp(-1.0,0.2,p),{sleep:true,walk:T*8,phase:T*8,T});
 const hit=lt>D*0.3&&lt<D*0.8;bDoor.position.x+=hit?0.02*Math.sin(T*40):0;if(hit&&Math.sin(T*9)>0.6)RED=0.12;altarL.intensity=0;cm([0.2,1.5,1.6],[2.8,1.1,-1.1],46);return 'inn'};
S.morning=(lt,D,T)=>{CUR='inn';kDay();kitL.intensity=0.6;SPILL.visible=true;bowls(3,{upright:true});sitAt(C.tu,{dead:true,potHug:true,T});if(lt<D*0.45)KCAM(T);else{const c=C.tu;cm([c.position.x+0.2,1.25,c.position.z+1.1],[c.position.x,1.0,c.position.z],36)}return 'inn'};
S.end=(lt,D,T)=>{CUR='inn';day();dayL.intensity=0.8;BOWL.visible=true;put(C.phuc,0.6,-0.2,{eyes:0.9,T});put(C.lien,1.6,-0.1,{eyes:0.9,look:-1,T});cm([1.2,1.5,2.6],[1.1,1.0,-0.3],44);return 'inn'};
S.end2=(lt,D,T)=>{CUR='inn';if(lt<D*0.45){bedNight(0.3);inBed(C.lien,-1,{eyes:1.35,look:1,T});inBed(C.phuc,1,{eyes:0.05,T});const c=C.lien;cm([c.position.x+0.25,1.55,c.position.z+1.7],[c.position.x,1.25,c.position.z],38);return 'inn'}
 kNight(T,0.7);stoveL.intensity=1.0*flick(T);PUDDLE.visible=true;bowls(3,{full:true,upright:true});const q=sm(seg(lt,D*0.45,D));cm([lerp(3.6,4.3,q),1.35,lerp(0.45,0.2,q)],[4.5,0.75,-0.8],lerp(46,40,q));return 'inn'};
S.gs3=(lt,D,T)=>{CUR='inn';kNight(T,0.5);stoveL.intensity=0.9*flick(T);bowls(3,{full:true,upright:true});fillL.color.set(0x9ab0c8);fillL.intensity=2.2;fillL.position.set(2.6,1.5,-0.4);put(C.gs,3.25,-1.1,{a:0.9,chew:false,arm:[undefined,-0.9+0.2*Math.sin(T*2)],glow:0.6});cm([1.4,1.45,0.3],[3.2,1.25,-1.1],40);return 'inn'};
S.cta=(lt,D,T)=>{CUR='inn';kNight(T,0.6);ctaFlag=true;stoveL.intensity=0.8*flick(T);bowls(3,{full:true,upright:true});cm([4.5,1.25,lerp(0.45,0.3,sm(lt/D))],[4.5,0.7,-0.75],44);return 'inn'};
