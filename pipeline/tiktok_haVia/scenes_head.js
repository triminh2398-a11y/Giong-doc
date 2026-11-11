// ================= cảnh: BA HỒN CHÍN VÍA =================
const S={};let ctaFlag=false,BLACK=0,TITLE=false,RED=0,RAIN=0,FLASH=0,NOW=0,CCTV=0;
const JUMPS=[['hook2',0.6,0.45,1],['title',0.02,0.4,1],['cross',0.62,0.45,1],['ghost',0.3,0.45,1]];
const SOFT=[['gt2',0.4,0.25,0]];
const TK=sp=>{for(const [a,b,s] of TLD.vox){if(s===sp&&NOW>=a&&NOW<b)return Math.sin(NOW*14)>-0.2?'o':undefined}return undefined};
const flick=T=>0.85+0.15*Math.sin(T*11)*Math.sin(T*3.7);
const bedNight=(l=0.6)=>{night();lampL.intensity=l;moonSpot.intensity=4};
const FZ=HD/2+0.2;
const onB=(c,x,z,o)=>put(c,x,z,o,0.15);
const ghostUnder=(o={},x=0.75,z=-0.4)=>{put(C.gw,x,z,Object.assign({a:0.95},o),-0.45);bCold.intensity=4.5;bCold.position.set(x+0.3,0.8,z+1.2)};
// ---- mở đầu ----
S.hook=(lt,D,T)=>{CUR='brg';const p=sm(lt/D);cm([lerp(3,1.2,p),lerp(2.0,1.4,p),lerp(9,5,p)],[0,0.4,0],lerp(48,42,p));return 'brg'};
S.hook2=(lt,D,T)=>{CUR='brg';NHANG2.visible=false;if(lt<D*0.5){cm([1.4,1.0,4.5],[0.3,0.1,0],44);return 'brg'}ghostUnder({tilt:0.2});const c=C.gw;cm([c.position.x+0.3,0.75,c.position.z+lerp(2.0,1.5,sm(seg(lt,D*0.5,D)))],[c.position.x,0.55,c.position.z],38);return 'brg'};
S.title=(lt,D,T)=>{CUR='brg';TITLE=true;ghostUnder({},0,-1.0);bCold.intensity=4;cm([0,1.3,lerp(4.2,3.6,sm(lt/D))],[0,0.6,-1.0],40);BLACK=0.3;return 'brg'};
// ---- rớt vía ----
S.fall=(lt,D,T)=>{CUR='brg';const p=sm(lt/D);onB(C.thu,-0.1,lerp(3.5,0.6,p),{bike:true,walk:T*5,eyes:1,T});bLamp.intensity=0.6;bLamp.position.set(0,1.2,lerp(3.5,0.6,p)+0.8);cm([2.4,1.6,lerp(6,4,p)],[0,0.8,lerp(3,0.6,p)],44);return 'brg'};
S.cross=(lt,D,T)=>{CUR='brg';onB(C.thu,-0.1,0.3,{bike:true,eyes:lt>D*0.3?1.45:1,pupil:lt>D*0.3?1.6:undefined,look:1,T});if(lt<D*0.55){cm([1.4,1.4,2.6],[0,0.9,0.3],42);return 'brg'}ghostUnder({tilt:0.3},0.8,0.3);const c=C.gw;cm([c.position.x-0.4,0.55,c.position.z+lerp(1.8,1.3,sm(seg(lt,D*0.55,D)))],[c.position.x,0.6,c.position.z],38);return 'brg'};
S.sick=(lt,D,T)=>{CUR='inn';bedNight(0.5);put(C.thu,BED.position.x+0.2,BED.position.z+0.6,{sit:true,vacant:true,T},-0.12);const c=C.thu;cm([c.position.x+0.3,1.2,c.position.z+lerp(2.2,1.6,sm(lt/D))],[c.position.x,1.0,c.position.z],38);return 'inn'};
S.me=(lt,D,T)=>{CUR='inn';day();dayL.intensity=0.7;put(C.thu,BED.position.x+0.2,BED.position.z+0.6,{sit:true,vacant:true,T},-0.12);put(C.mai,BED.position.x+1.2,BED.position.z+0.9,{eyes:1.1,look:-1,tears:true,T});put(C.tuv,BED.position.x+2.1,BED.position.z+1.0,{eyes:1,look:-1,T});cm([BED.position.x+1.0,1.6,BED.position.z+3.6],[BED.position.x+1.0,1.0,BED.position.z+0.7],46);return 'inn'};
S.tu1=(lt,D,T)=>{CUR='inn';day();dayL.intensity=0.7;put(C.tuv,BED.position.x+2.1,BED.position.z+1.0,{eyes:1.05,mouth:TK('TU'),T});close(C.tuv,lerp(1.3,1.1,sm(lt/D)),36,0.25);return 'inn'};
S.tu2=(lt,D,T)=>{CUR='inn';day();dayL.intensity=0.6;put(C.tuv,BED.position.x+2.1,BED.position.z+1.0,{eyes:1.2,pupil:2.4,mouth:TK('TU'),armA:[undefined,lt>D*0.4?-1.6:undefined],T});close(C.tuv,lerp(1.15,0.9,sm(lt/D)),36,-0.25);return 'inn'};
// ---- gọi vía ----
const ritual=(T,o={})=>{onB(C.mai,-0.15,2.0,Object.assign({shirtHold:true,eyes:1.1,T},o.M||{}));onB(C.thu,0.3,2.25,Object.assign({eyes:0.8,vacant:true,T},o.Th||{}));put(C.tuv,-0.85,1.3,Object.assign({lamp:true,eyes:1,T},o.U||{}),0.15);bLamp.intensity=1.8*flick(T);bLamp.position.set(-0.6,1.2,1.8)};
S.night=(lt,D,T)=>{CUR='brg';ritual(T);const p=sm(lt/D);cm([lerp(2.4,1.6,p),1.6,lerp(6,4.6,p)],[0,0.9,2.2],44);return 'brg'};
S.call=(lt,D,T)=>{CUR='brg';ritual(T,{M:{mouth:TK('MA')}});close(C.mai,1.8,36,0.3);return 'brg'};
S.ans=(lt,D,T)=>{CUR='brg';ritual(T,{Th:{mouth:lt<D*0.3?'o':undefined}});if(lt<D*0.5){close(C.thu,1.8,36,-0.2);return 'brg'}cm([1.2,1.2,3.2],[0.4,0.2,1.2],44);return 'brg'};
S.count=(lt,D,T)=>{CUR='brg';const q=sm(lt/D);ritual(T,{Th:{vacant:q<0.5,blush:q>0.5,eyes:lerp(0.8,1,q)}});cm([lerp(-1.4,1.4,q),1.5,4.8],[0,0.9,2.2],44);return 'brg'};
S.ninth=(lt,D,T)=>{CUR='brg';ritual(T,{M:{eyes:1.3,pupil:2}});cm([0.8,1.3,3.6],[-0.1,1.1,2.0],38);return 'brg'};
S.call9=(lt,D,T)=>{CUR='brg';ritual(T,{M:{mouth:TK('MA'),eyes:1.3}});close(C.mai,1.6,36,0.3);return 'brg'};
S.two=(lt,D,T)=>{CUR='brg';ritual(T,{Th:{blush:true,eyes:1}});if(lt<D*0.4){close(C.thu,1.8,36,-0.2);return 'brg'}ghostUnder({},0.75,0.6);cm([1.7,0.95,1.9],[0.75,0.45,0.6],40);return 'brg'};
S.ghost=(lt,D,T)=>{CUR='brg';ritual(T);ghostUnder({tilt:0.15,open:0.3+0.4*Math.max(0,Math.sin(T*9))},0.75,0.6);const c=C.gw;cm([c.position.x-0.2,0.6,c.position.z+lerp(1.6,1.2,sm(lt/D))],[c.position.x,0.55,c.position.z],36);RED=lt<D*0.4?0.1:0;return 'brg'};
S.run=(lt,D,T)=>{CUR='brg';const p=sm(lt/D);const z=lerp(2.0,6,p);onB(C.mai,-0.15,z,{shirtHold:true,walk:T*10,eyes:1.4,pupil:2,T});onB(C.thu,0.3,z+0.3,{walk:T*10,eyes:1.3,T});put(C.tuv,0.2,z+1.0,{lamp:true,phase:T*10,eyes:1.3,T});bLamp.intensity=1.5;bLamp.position.set(0.2,1.2,z+1.2);if(lt>D*0.5){ghostUnder({a:0.6},0.2,lerp(1.5,3,p))}cm([2.8,1.5,z+3.5],[0,0.9,z],46);return 'brg'};
// ---- trước cửa nhà ----
S.door=(lt,D,T)=>{CUR='inn';bedNight(0.6);buongDoor(lt<D*0.2?1-sm(lt/(D*0.2)):0);put(C.tuv,2.4,-0.6,{bua:true,eyes:1.2,T});put(C.mai,0.8,0.2,{eyes:1.35,pupil:2,T});put(C.thu,0.2,0.4,{eyes:1.2,T});const hit=lt>D*0.4;bDoor.position.x+=hit?0.015*Math.sin(T*30):0;cm([0.2,1.6,2.6],[2.0,1.1,-0.8],46);return 'inn'};
S.gt2=(lt,D,T)=>{CUR='ruin';ruinMode('night',true);buaN(2);rFill.color.set(0xa8c0d8);rFill.intensity=3.5;rFill.position.set(0,1.6,FZ+1.5);put(C.gw,0.2,FZ-0.9,{a:0.95,arm:[undefined,-2.0+0.4*Math.sin(T*6)]});cm([0.6,1.5,FZ+lerp(4.4,3.0,sm(lt/D))],[0.1,1.3,FZ-1.1],40);return 'ruin'};
S.dawn=(lt,D,T)=>{CUR='ruin';ruinMode('dusk',true);buaN(2);DOORL.rotation.y=-0.6;DOORR.rotation.y=0.6;HPR.visible=false;FOOT.visible=true;cm([0.8,2.0,FZ+3.2],[0,0.3,FZ+0.4],46);return 'ruin'};
S.end=(lt,D,T)=>{CUR='inn';day();dayL.intensity=0.9;put(C.thu,0.2,0.2,{blush:true,eyes:1,smileF:true,T});put(C.mai,0.9,0.4,{eyes:1,look:-1,T});put(C.tuv,1.7,0.3,{eyes:1.05,armA:[undefined,-1.6],T});cm([0.9,1.5,3.4],[0.9,1.1,0.2],46);return 'inn'};
S.end2=(lt,D,T)=>{CUR='brg';NHANG2.visible=true;const p=sm(lt/D);if(lt>D*0.7)ghostUnder({a:0.7},0.75,0.2);cm([lerp(3,1.2,p),lerp(1.8,1.0,p),lerp(7,3.6,p)],[0.3,0.3,0.2],lerp(46,38,p));return 'brg'};
S.cta=(lt,D,T)=>{CUR='brg';ctaFlag=true;NHANG2.visible=true;cm([2,1.6,7],[0,0.5,0],46);return 'brg'};
