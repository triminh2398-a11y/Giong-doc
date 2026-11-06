// ================= cảnh: BÙ NHÌN MẶC ÁO NGƯỜI =================
const S={};let ctaFlag=false,BLACK=0,TITLE=false,RED=0,RAIN=0,FLASH=0,NOW=0;
const JUMPS=[['hook2',0.05,0.45,1],['gt',0.5,0.4,1],['gt2',0.35,0.42,1],['turn',0.5,0.45,1]];
const SOFT=[];
const TK=sp=>{for(const [a,b,s] of TLD.vox){if(s===sp&&NOW>=a&&NOW<b)return Math.sin(NOW*14)>-0.2?'o':undefined}return undefined};
const flick=T=>0.85+0.15*Math.sin(T*11)*Math.sin(T*3.7);
const bedNight=(l=0.6)=>{night();lampL.intensity=l;moonSpot.intensity=4};
const BP=[[4.6,12.6],[2.8,8.6],[2.6,4.6]];
const OLD='#6a4a2a',TSH='#6b707a';
const nightE=()=>{extMode('night');eFill.intensity=0};
const bnAt=(p,o)=>put(C.bn,p[0],p[1],o);
const eLight=(x,z,i=2)=>{eFill.intensity=i;eFill.position.set(x,1.4,z-1.2)};
S.hook=(lt,D,T)=>{CUR='ext';nightE();const p=sm(lt/D);bnAt(BP[0],{shirt:OLD,torn:true});eLight(BP[0][0],BP[0][1],1.6);
 cm([lerp(BP[0][0]-3.5,BP[0][0]-0.8,p),lerp(2.2,1.5,p),lerp(BP[0][1]-7,BP[0][1]-2.6,p)],[BP[0][0],1.2,BP[0][1]],lerp(44,38,p));return 'ext'};
S.hook2=(lt,D,T)=>{CUR='ext';nightE();const q=sm(seg(lt,0,0.4));bnAt(BP[0],{shirt:OLD,torn:true,eyes2:q,glow:q,turn:lerp(0.5,0,q)});eLight(BP[0][0],BP[0][1],2.2);RED=0.12*(1-sm(lt/D));
 cm([BP[0][0]+0.1,1.42,BP[0][1]-lerp(1.5,1.2,sm(lt/D))],[BP[0][0],1.34,BP[0][1]],36);return 'ext'};
S.title=(lt,D,T)=>{CUR='ext';nightE();TITLE=true;bnAt(BP[0],{shirt:OLD,torn:true,eyes2:0.6});eLight(BP[0][0],BP[0][1],1.0);cm([BP[0][0]-1.2,1.2,BP[0][1]-4.5],[BP[0][0],1.4,BP[0][1]],46);return 'ext'};
S.rent=(lt,D,T)=>{CUR='ext';extMode('day');const p=sm(lt/D);const x=lerp(-6,-1.6,p);put(C.tam,x,2.6,{bundle:true,phase:T*6,eyes:1,T});put(C.hanh,x-0.8,2.9,{bundle:true,walk:T*6,eyes:1,T});bnAt(BP[0],{shirt:OLD,torn:true});
 cm([x+0.6,1.7,6.8],[x-0.3,0.95,2.7],44);return 'ext'};
S.scare=(lt,D,T)=>{CUR='ext';extMode('day');bnAt(BP[0],{shirt:OLD,torn:true});if(lt<D*0.55){const q=sm(lt/(D*0.55));cm([BP[0][0]-0.9,lerp(1.6,1.45,q),BP[0][1]-lerp(2.2,1.6,q)],[BP[0][0],1.35,BP[0][1]],40);return 'ext'}
 const q=sm(seg(lt,D*0.55,D));cm([BP[0][0]+2.5,1.3,BP[0][1]+2.0],[lerp(BP[0][0],0.5,q),lerp(1.3,1.2,q),lerp(BP[0][1],1.6,q)],44);return 'ext'};
S.chin=(lt,D,T)=>{CUR='ext';extMode('day');const p=sm(lt/D);bnAt(BP[0],{shirt:OLD,torn:true});put(C.tam,BP[0][0]-0.6,BP[0][1]-0.4,{reach:true,eyes:1,T});const cx=lerp(BP[0][0]-3.5,BP[0][0]-1.4,p);put(C.chin,cx,BP[0][1]-0.9,{point:p>0.6,eyes:1.2,walk:T*5,T});
 cm([BP[0][0]-2.4,1.6,BP[0][1]-5.4],[BP[0][0]-1.6,1.0,BP[0][1]-0.6],46);return 'ext'};
S.chin1=(lt,D,T)=>{CUR='ext';extMode('day');bnAt(BP[0],{shirt:OLD,torn:true});put(C.chin,BP[0][0]-1.4,BP[0][1]-0.9,{eyes:1.15,point:lt>D*0.55,mouth:TK('CH'),T});closeN(C.chin,lerp(1.4,1.15,sm(lt/D)),36,0.3);return 'ext'};
S.tam1=(lt,D,T)=>{CUR='ext';extMode('day');bnAt(BP[0],{shirt:OLD,torn:true});put(C.tam,BP[0][0]-0.6,BP[0][1]-0.4,{eyes:1,look:-1,mouth:TK('TA'),T});closeN(C.tam,1.3,36,-0.3);return 'ext'};
S.swap=(lt,D,T)=>{CUR='ext';extMode('dusk');const ch=lt>D*0.55;fire(BP[0][0]-1.2,BP[0][1]-0.7,T,ch?0.8:0.4);
 bnAt(BP[0],ch?{shirt:TSH}:{shirt:null});put(C.tam,BP[0][0]-0.65,BP[0][1]-0.35,ch?{eyes:1,look:1,T}:{shirtIn:true,reach:true,eyes:1,T});
 cm([BP[0][0]-1.0,1.5,BP[0][1]-3.4],[BP[0][0]-0.4,1.05,BP[0][1]],42);return 'ext'};
S.burn=(lt,D,T)=>{CUR='ext';extMode('dusk');fire(BP[0][0]-1.2,BP[0][1]-0.7,T,0.9);bnAt(BP[0],{shirt:TSH});
 if(lt<D*0.4){cm([BP[0][0]-1.0,0.6,BP[0][1]-1.8],[BP[0][0]-1.2,0.15,BP[0][1]-0.7],40);return 'ext'}
 put(C.hanh,BP[0][0]-1.9,BP[0][1]-1.1,{comb:true,eyes:1.3,pupil:2.2,T});closeN(C.hanh,lerp(1.25,1.0,sm(seg(lt,D*0.4,D))),36,0.25);return 'ext'};
S.near=(lt,D,T)=>{CUR='ext';extMode('day');eHemi.intensity=1.0;bnAt(BP[1],{shirt:TSH});put(C.hanh,-0.6,2.6,{eyes:1.2,back:true,T});const p=sm(lt/D);
 cm([-1.6,1.75,lerp(1.85,2.1,p)],[BP[1][0],1.1,BP[1][1]],lerp(46,40,p));return 'ext'};
S.ha1=(lt,D,T)=>{CUR='ext';extMode('day');eHemi.intensity=1.0;bnAt(BP[1],{shirt:TSH});put(C.hanh,-1.0,2.1,{eyes:1.15,look:1,mouth:TK('HA'),T});close(C.hanh,1.25,36,0.3);return 'ext'};
S.tam2=(lt,D,T)=>{CUR='ext';extMode('day');eHemi.intensity=1.0;bnAt(BP[1],{shirt:TSH});put(C.tam,-0.2,2.3,{eyes:0.9,look:-1,mouth:TK('TA'),T});close(C.tam,1.3,36,-0.3);return 'ext'};
S.near2=(lt,D,T)=>{CUR='ext';extMode('dusk');const k=Math.min(3,Math.floor(lt/(D*0.25)));const P=[[2.75,7.4],[2.7,6.3],[2.65,5.4],BP[2]][k];bnAt(P,{shirt:TSH});
 if(k<3){cm([-1.4,2.0,2.2],[2.6,1.0,6],44);return 'ext'}put(C.tam,0.6,2.4,{pale:true,eyes:0.7,T});cm([-1.4,1.7,1.9],[1.6,1.0,3.6],44);return 'ext'};
S.sick=(lt,D,T)=>{CUR='inn';if(lt<D*0.5){day();dayL.intensity=0.5;put(C.tam,0.4,-0.6,{pale:true,eyes:0.6,straw:1,T});close(C.tam,1.2,36,0.3);return 'inn'}
 bedNight(0.9);inBed(C.tam,1,{pale:true,eyes:0.7,straw:2,T});inBed(C.hanh,-1,{eyes:1.3,pupil:2,look:1,T});cm([BED.position.x+0.3,1.75,BED.position.z+2.0],[BED.position.x,1.0,BED.position.z-0.6],44);return 'inn'};
S.call=(lt,D,T)=>{CUR='inn';bedNight(0.8);winM.map=winScT;inBed(C.tam,1,{pale:true,eyes:1.2,straw:2,T});inBed(C.hanh,-1,{eyes:1.4,pupil:2,look:1,T});
 if(lt<D*0.45){cm([BED.position.x+0.3,1.75,BED.position.z+2.0],[BED.position.x,1.0,BED.position.z-0.6],44);return 'inn'}const q=sm(seg(lt,D*0.45,D));cm([0.6,1.75,lerp(-0.6,-1.4,q)],[0.6,1.8,-2.49],40);return 'inn'};
S.gt=(lt,D,T)=>{CUR='ext';nightE();bnAt([1.2,2.35],{shirt:TSH,bulge:true,eyes2:1,glow:1,grin:true,turn:Math.sin(T*1.2)*0.08});eFill.intensity=2.4;eFill.position.set(1.2,1.4,3.4);
 if(lt<D*0.45){cm([2.6,1.5,5.0],[1.2,1.3,1.8],44);return 'ext'}cm([1.32,1.42,3.5],[1.2,1.36,2.35],36);return 'ext'};
S.cover=(lt,D,T)=>{CUR='inn';bedNight(0.85);winM.map=winScT;const cov=lt>D*0.62;inBed(C.tam,1,{pale:true,eyes:1.35,pupil:1.5,straw:2,mouth:!cov&&lt>D*0.3?'o':undefined,covered:cov,T});inBed(C.hanh,-1,{eyes:1.3,look:1,T});
 const c=C.tam;cm([c.position.x+0.25,1.55,c.position.z+1.7],[c.position.x-0.1,1.25,c.position.z],38);return 'inn'};
S.run=(lt,D,T)=>{CUR='ext';extMode('dusk');eHemi.intensity=1.1;const p=sm(lt/D);const x=lerp(0,-5,p);put(C.hanh,x,2.6,{walk:T*9,eyes:1.2,T});put(C.chin,-6.2,2.4,{eyes:1,T});cm([lerp(1.0,-3.6,p),1.7,6.4],[lerp(-0.5,-5.6,p),1.0,2.5],44);return 'ext'};
S.chin2=(lt,D,T)=>{CUR='ext';extMode('dusk');eHemi.intensity=1.1;put(C.hanh,-5.4,2.7,{eyes:1.2,T});put(C.chin,-6.2,2.4,{eyes:1.2,mouth:TK('CH'),T});close(C.chin,lerp(1.4,1.2,sm(lt/D)),36,0.35);return 'ext'};
S.chin3=(lt,D,T)=>{CUR='ext';extMode('dusk');eHemi.intensity=1.1;put(C.chin,-6.2,2.4,{eyes:1.25,pupil:2.4,point:lt>D*0.3&&lt<D*0.7,mouth:TK('CH'),T});close(C.chin,lerp(1.25,0.95,sm(lt/D)),36,-0.25);return 'ext'};
S.night=(lt,D,T)=>{CUR='ext';nightE();const p=sm(lt/D);const z=lerp(2.4,3.3,p);put(C.hanh,lerp(1.6,2.4,p),z,{lamp:true,walk:T*5,eyes:1.2,T});bnAt(BP[2],{shirt:TSH,bulge:true});eFill.intensity=2.4;eFill.position.set(lerp(1.7,2.5,p),1.1,z+0.2);
 cm([lerp(0.6,1.4,p),1.7,lerp(0.4,1.7,p)],[2.6,1.1,4.4],44);return 'ext'};
S.strip=(lt,D,T)=>{CUR='ext';nightE();const op=lt>D*0.62;put(C.hanh,2.45,3.4,{unbutton:true,eyes:1.25,T});bnAt(BP[2],{shirt:TSH,bulge:true,open:op});eFill.intensity=2.6;eFill.position.set(2.5,1.3,3.7);
 if(!op){cm([1.5,1.5,2.0],[2.55,1.1,4.2],40);return 'ext'}cm([2.65,1.15,3.8],[2.6,0.95,4.6],36);return 'ext'};
S.gt2=(lt,D,T)=>{CUR='ext';nightE();bnAt(BP[2],{shirt:TSH,bulge:true,open:true,eyes2:1,glow:1,grin:true,turn:0.1*Math.sin(T*3)});eFill.intensity=2.6;eFill.position.set(2.5,1.3,3.7);cm([2.72,1.45,3.4],[2.6,1.36,4.6],36);return 'ext'};
S.turn=(lt,D,T)=>{CUR='ext';nightE();const q=sm(seg(lt,0,D*0.5));bnAt(BP[2],{shirt:TSH,bulge:true,open:true,face:q>0.5?'tam':'sack',turn:lerp(-1.4,0,q),glow:1});eFill.intensity=2.8;eFill.position.set(2.5,1.4,3.6);
 cm([2.65,1.4,lerp(3.0,3.5,q)],[2.6,1.37,4.6],34);return 'ext'};
S.pull=(lt,D,T)=>{CUR='ext';nightE();const off=lt>D*0.25;bnAt(BP[2],off?{shirt:null}:{shirt:TSH,open:true,face:'tam'});put(C.hanh,2.3,3.35,off?{shirtHold:true,eyes:0.05,T}:{unbutton:true,eyes:0.05,T});
 if(lt>D*0.4){fire(2.0,3.0,T,lerp(0.4,1.4,sm(seg(lt,D*0.4,D*0.55))));if(lt<D*0.6)RED=0.18}eFill.intensity=1.6;eFill.position.set(2.4,1.3,3.5);
 cm([1.2,1.55,1.85],[2.4,1.0,3.9],44);return 'ext'};
S.morning=(lt,D,T)=>{if(lt<D*0.5){CUR='inn';day();dayL.intensity=0.8;put(C.tam,-1.5,-0.9,{sit:true,vomit:true,pale:true,eyes:1.2,T},-0.12);put(C.hanh,-0.6,-0.4,{eyes:1.1,look:-1,tears:true,T});cm([0.4,1.25,1.4],[-1.1,0.9,-0.8],44);return 'inn'}
 CUR='ext';extMode('dusk');eHemi.intensity=1.3;eSun.intensity=1.6;put(C.pile,BP[2][0],BP[2][1],{});cm([1.4,1.4,2.4],[2.6,0.3,4.6],40);return 'ext'};
S.end=(lt,D,T)=>{CUR='ext';extMode('day');const p=sm(lt/D);const x=lerp(-0.8,-5.5,p);put(C.tam,x,2.6,{bundle:true,phase:T*6,eyes:0.9,T});put(C.hanh,x+0.9,2.9,{bundle:true,walk:T*6,eyes:0.9,T});cm([lerp(0.5,-3.5,p),1.9,8.5],[lerp(-1,-4.5,p),0.9,2.6],46);return 'ext'};
S.end2=(lt,D,T)=>{CUR='ext';extMode('dusk');eHemi.intensity=0.9;bnAt(BP[0],{shirt:HANH_SHIRT});eLight(BP[0][0],BP[0][1],1.6);if(lt<D*0.35){put(C.hanh,-5.5,2.9,{eyes:1.1,look:1,T});close(C.hanh,1.3,36,0.3);return 'ext'}
 const q=sm(seg(lt,D*0.35,D));cm([lerp(BP[0][0]-3,BP[0][0]-0.6,q),lerp(1.8,1.45,q),lerp(BP[0][1]-6,BP[0][1]-2.2,q)],[BP[0][0],1.25,BP[0][1]],42);return 'ext'};
S.gh=(lt,D,T)=>{CUR='ext';nightE();bnAt(BP[0],{shirt:HANH_SHIRT,turn:Math.sin(T*0.8)*0.15,eyes2:0.5});eLight(BP[0][0],BP[0][1],1.4);cm([BP[0][0]+0.1,1.42,BP[0][1]-lerp(2.0,1.4,sm(lt/D))],[BP[0][0],1.34,BP[0][1]],38);return 'ext'};
S.cta=(lt,D,T)=>{CUR='ext';nightE();ctaFlag=true;bnAt(BP[0],{shirt:HANH_SHIRT,eyes2:0.4});eLight(BP[0][0],BP[0][1],1.0);cm([BP[0][0]-1.0,1.3,BP[0][1]-lerp(5,4.2,sm(lt/D))],[BP[0][0],1.3,BP[0][1]],44);return 'ext'};
// close-up nhìn từ phía nhà (−z) cho cảnh ở đầu ruộng
function closeN(c,dist,fov=36,side=0.3){const hy=HY+(c.position.y-0.98);cm([c.position.x+side,hy+0.05,c.position.z-dist-0.8],[c.position.x,hy-0.12,c.position.z],fov)}
