// ================= cảnh: CHUYẾN XE CUỐI ĐÈO =================
const S={};let ctaFlag=false,BLACK=0,TITLE=false,RED=0,RAIN=0,FLASH=0,NOW=0,CCTV=0;
const JUMPS=[['title',0.02,0.4,1],['face',0.3,0.45,1]];
const SOFT=[['spk',0.2,0.25,0]];
const TK=sp=>{for(const [a,b,s] of TLD.vox){if(s===sp&&NOW>=a&&NOW<b)return Math.sin(NOW*14)>-0.2?'o':undefined}return undefined};
const flick=T=>0.85+0.15*Math.sin(T*11)*Math.sin(T*3.7);
// vị trí chuẩn trong cabin
const KH=[-0.55,0.05],HN=[0.55,0.05];
const inCab=(T,o={})=>{cabReset();put(C.khoa,KH[0],KH[1],Object.assign({sit:true,drive:true,eyes:1,T},o.K||{}),0);put(C.hanh,HN[0],HN[1],Object.assign({sit:true,a:0.95,open:0.2},o.H||{}),0);cabAnim(T,o.spd||1)};
const hideH=()=>{C.hanh.visible=false};
const rd=T=>{RAIN=0.5};
// ---- mở đầu: SÁNG, không hù ----
S.hook=(lt,D,T)=>{CUR='pas';pasMode('dusk');const p=sm(lt/D);truckAt(1.4,0,lerp(-16,-3,p),0);put(C.hanh,-1.6,-4.2,{a:0.9,wave:true,open:0.15,glow:0.5,T},0);cm([lerp(-1.8,-0.6,p),1.5,6],[0.2,1.0,-5],lerp(52,46,p));return 'pas'};
S.hook2=(lt,D,T)=>{CUR='cab';inCab(T,{H:{open:0.1,look:-1},K:{eyes:1.05,look:1}});cHemi.intensity=1.5;cDome.intensity=3.4;cab.background.set(0x4a5c7c);cab.fog.color.set(0x4a5c7c);cab.fog.density=0.02;cm([0.1,1.2,lerp(3.4,3.0,sm(lt/D))],[0,0.9,0],46);return 'cab'};
S.title=(lt,D,T)=>{CUR='pas';pasMode('dusk');TITLE=true;truckAt(1.2,0,lerp(-5,-1,sm(lt/D)),0);cm([-1.6,1.4,4.6],[0.6,1.0,-1.5],48);return 'pas'};
S.intro=(lt,D,T)=>{CUR='pas';pasMode('night');RAIN=0.35;const p=sm(lt/D);truckAt(1.5,0,lerp(12,-12,p),Math.PI);cm([-4.4,2.0,lerp(5,-5,p)],[0.8,1.2,lerp(8,-8,p)],44);return 'pas'};
S.wave=(lt,D,T)=>{CUR='pas';pasMode('night');RAIN=0.35;const p=sm(lt/D);truckAt(1.3,0,lerp(8,3.2,p),Math.PI);put(C.hanh,-2.5,-2.0,{a:0.95,wave:true,open:0.15,glow:0.6,T},0);pCold.intensity=2.5;pCold.position.set(-2.0,1.4,-0.5);cm([-4.2,1.8,lerp(8.5,7.2,p)],[-1.0,1.0,-1.2],50);return 'pas'};
S.ask=(lt,D,T)=>{CUR='pas';pasMode('night');RAIN=0.3;truckAt(1.3,0,0.6,Math.PI);put(C.hanh,-1.2,0.4,{a:0.95,open:0.25,mouth:TK('GT'),glow:0.6,T},0);pCold.intensity=2.2;pCold.position.set(-0.8,1.4,2.4);close(C.hanh,lerp(1.5,1.2,sm(lt/D)),38,0.25);return 'pas'};
S.ride=(lt,D,T)=>{CUR='cab';inCab(T);RAIN=0;cm([lerp(0.9,0.3,sm(lt/D)),1.2,lerp(3.6,3.0,sm(lt/D))],[0,0.9,0],46);return 'cab'};
S.face=(lt,D,T)=>{CUR='cab';inCab(T,{K:{eyes:lt>D*0.3?1.45:1,pupil:lt>D*0.3?1.8:undefined,sweat:lt>D*0.3?1:undefined},H:{open:lt>D*0.3?0.6:0.2,look:lt>D*0.3?0:-1,tilt:lt>D*0.3?0.1:0}});cCold.intensity=lt>D*0.3?3:0;if(lt<D*0.3){cm([0.1,1.2,3.2],[0,0.9,0],46);return 'cab'}close(C.hanh,lerp(1.6,1.2,sm(seg(lt,D*0.3,D))),36,0.1);return 'cab'};
S.fear=(lt,D,T)=>{CUR='cab';inCab(T,{spd:2,K:{eyes:1.4,pupil:2,sweat:1},H:{open:0.15}});cCold.intensity=1.6;const sh=0.01*Math.sin(T*40);cm([0.15+sh,1.2,lerp(3.4,3.0,sm(lt/D))],[0,0.95,0],46);return 'cab'};
S.curve=(lt,D,T)=>{CUR='pas';pasMode('night');RAIN=0.4;const p=sm(lt/D);truckAt(lerp(0.8,3.0,p),0,lerp(6,-0.6,p),Math.PI-lerp(0,1.15,sm(seg(lt,D*0.3,D))));cm([-2.4,2.0,lerp(7,3.6,p)],[lerp(1,3,p),0.9,lerp(2,-0.6,p)],50);return 'pas'};
S.brake=(lt,D,T)=>{CUR='pas';pasMode('night');RAIN=0.3;const p=sm(lt/D);truckAt(3.55,0,-0.5,Math.PI-1.15,lerp(0,0.2,sm(seg(lt,0,D*0.4))));cm([lerp(-1.6,-0.6,p),2.4,lerp(3.8,3.2,p)],[3.6,0.8,-0.5],56);return 'pas'};
S.spk=(lt,D,T)=>{CUR='pas';pasMode('night');RAIN=0.25;truckAt(3.55,0,-0.5,Math.PI-1.15,0.2);put(C.hanh,5.4,-3.4,{a:0.95,open:0.3+0.2*Math.max(0,Math.sin(T*7)),mouth:TK('GT'),glow:0.7,T},0.3);pCold.intensity=3.5;pCold.position.set(5.2,1.8,-1.4);const q=sm(lt/D);cm([5.5,1.5,lerp(-0.2,-0.9,q)],[5.4,1.2,-3.4],36);return 'pas'};
S.light=(lt,D,T)=>{CUR='pas';pasMode('night');pas.fog.density=0.008;pHemi.intensity=2.4;RAIN=0.2;truckAt(3.55,0,-0.5,Math.PI-1.15,0.2);HELM.material.emissiveIntensity=2.2;pFill.intensity=18;pFill.distance=10;pFill.position.set(5.6,-6.6,1.2);const p=sm(lt/D);cm([lerp(4.2,5.6,p),lerp(0.6,-4.2,p),lerp(1.2,0.9,p)],[6.4,-8.0,-0.1],lerp(42,34,p));return 'pas'};
S.back=(lt,D,T)=>{CUR='pas';pasMode('night');RAIN=0.25;const p=sm(lt/D);truckAt(lerp(3.55,1.6,p),0,lerp(-0.5,0.7,p),Math.PI-lerp(1.15,0.2,p),lerp(0.2,0,sm(seg(lt,0.3,D*0.8))));cm([-3.2,1.8,-3.6],[1.8,0.8,0.3],50);return 'pas'};
S.dawn=(lt,D,T)=>{CUR='pas';pasMode('dawn');truckAt(1.5,0,-6,Math.PI);put(C.sau,-3.0,-0.2,{eyes:1,T},0);put(C.khoa,-1.9,0.2,{eyes:1.1,look:-1,T},0);const p=sm(lt/D);cm([lerp(-0.2,-0.8,p),1.5,lerp(4.6,3.8,p)],[-3.0,1.0,-1.8],lerp(46,42,p));return 'pas'};
S.os1=(lt,D,T)=>{CUR='pas';pasMode('dawn');put(C.sau,-3.0,-0.2,{eyes:1,mouth:TK('OS'),T},0);put(C.khoa,-1.9,0.3,{eyes:1.1,look:-1,T},0);close(C.sau,lerp(1.5,1.2,sm(lt/D)),38,0.2);return 'pas'};
S.os2=(lt,D,T)=>{CUR='pas';pasMode('dawn');put(C.sau,-3.0,-0.2,{eyes:1.05,mouth:TK('OS'),point:lt>D*0.4,T},0);put(C.khoa,-1.9,0.3,{eyes:1.2,look:-1,T},0);if(lt<D*0.5){close(C.sau,1.2,38,-0.2);return 'pas'}cm([-1.6,1.4,2.4],[-3.0,1.1,-0.2],44);return 'pas'};
S.down=(lt,D,T)=>{CUR='pas';pasMode('dawn');truckAt(1.2,0,-7,Math.PI);put(C.sau,3.0,-1.6,{point:true,eyes:1,T},0);put(C.khoa,2.8,0.0,{eyes:1.1,look:1,T},0);put(C.x1,2.9,-3.2,{eyes:1,T},0);put(C.x2,2.8,1.6,{eyes:1,T},0);const p=sm(lt/D);cm([lerp(0.2,1.0,p),1.7,lerp(4.4,3.4,p)],[3.8,lerp(0.9,-0.4,p),-0.8],50);return 'pas'};
S.mother=(lt,D,T)=>{CUR='mod';modDay();put(C.lua,2.6,0.2,{helmet:true,tears:true,eyes:1.05,T},0);put(C.khoa,3.7,0.5,{eyes:1,look:-1,T},0);cm([3.1,1.4,lerp(4.4,3.4,sm(lt/D))],[3.1,1.0,0.3],44);return 'mod'};
S.end=(lt,D,T)=>{CUR='pas';pasMode('dawn');AMSL.intensity=1.6;put(C.sau,-2.6,3.6,{incense:true,eyes:1,T},0);put(C.lua,-1.5,4.0,{eyes:1,tears:true,T},0);put(C.khoa,-0.8,3.8,{eyes:1,look:-1,T},0);truckAt(1.5,0,-2,Math.PI);cm([lerp(-0.4,-1.0,sm(lt/D)),1.4,8.4],[-2.2,0.9,3.4],42);return 'pas'};
S.end2=(lt,D,T)=>{CUR='pas';pasMode('dusk');const p=sm(lt/D);truckAt(0.9,0,lerp(-10,4,p),0);cm([-2.6,1.6,lerp(7,3,p)],[0.4,1.0,-1],46);return 'pas'};
S.cta=(lt,D,T)=>{CUR='pas';pasMode('dusk');ctaFlag=true;truckAt(1.0,0,-4,0);cm([-1.8,1.5,6],[0.6,1.0,-3],48);return 'pas'};
S.cta2=S.cta;
