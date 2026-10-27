// Adapter: old person()/woman()/char2 calls -> char5 Korean-horror style
const C5S=0.95;
function _c5(o,base){const r=Object.assign({},CAST5[base]||{});const living=!['corpse','ghost'].includes(base);
 if(o.back)r.back=true;if(o.sit)r.sit=true;if(o.tilt)r.tilt=o.tilt;if(o.sweat)r.sweat=o.sweat;if(o.flip)r.flip=true;
 if(o.look!==undefined){r.look=o.look;r.turn=Math.max(-0.4,Math.min(0.4,(o.look||0)*0.3))}
 let e=o.eyes;if(e===true||e===undefined)e=1;if(e===false)e=0.05;
 if(typeof e==='number'){if(e>1.05)r.em='fear';else if(e<0.15&&!r.em)r.em='closed'}
 if(o.em)r.em=o.em;if(o.pupil!==undefined&&o.pupil<2.6)r.em='fear';
 if(o.mouth==='o'||o.mouth==='scream')r.mouth=r.em==='fear'?'teeth':'o';else if(typeof o.mouth==='number')r.mouth=o.mouth>0.5?'o':'calm';else if(o.mouth)r.mouth=o.mouth;
 if(o.smile)r.mouth='smile';
 if(o.phase!==undefined&&!o.sit)r.walk=o.phase;if(o.walk!==undefined&&!o.sit)r.walk=o.walk;
 const P={};if(o.armUp){const a=-2.4+Math.sin(o.wave||0)*0.35;if(o.armUp>0)P.ra=[-a,-0.3];else P.la=[a,0.3]}
 if(o.arms==='hold'){P.la=[0.9,1.6];P.ra=[-0.9,-1.6]}
 if(o.pose)Object.assign(P,o.pose);if(Object.keys(P).length)r.pose=P;
 if(o.khan)r.khan=true;if(o.khandong)r.khandong=true;if(o.beard)r.beard=true;if(o.robe&&!r.cloth)r.cloth='aothe';
 if(o.shirt&&typeof o.shirt==='string'&&!CAST5[base]?.shirt)r.shirt=o.shirt;
 if(o.shirt&&typeof o.shirt==='string'&&base==='dan')r.shirt=o.shirt;
 if(o.t!==undefined)r.t=o.t;if(o.tears)r.tears=o.tears;
 return r}
person=function(cx,fy,s,o={}){fig5(cx,fy,s*C5S,_c5(o,o.__b||'dan'))};
woman=function(cx,fy,s,o={}){fig5(cx,fy,s*C5S,_c5(o,o.old?'batu':(o.__b||'me')))};
thay=function(cx,fy,s,o={}){person(cx,fy,s,Object.assign({},o,{__b:'thay'}))};
lam=function(cx,fy,s,o={}){person(cx,fy,s,Object.assign({},o,{__b:'lam'}))};
khoa=function(cx,fy,s,o={}){person(cx,fy,s*1.04,Object.assign({},o,{__b:'khoa'}))};
quan=function(cx,fy,s,o={}){person(cx,fy,s,Object.assign({},o,{__b:'quan'}))};
cuThach=function(cx,fy,s,o={}){person(cx,fy,s,Object.assign({},o,{__b:'cuthach'}))};
baTu=function(cx,fy,s,o={}){person(cx,fy,s,Object.assign({},o,{__b:'batu'}))};
ch=function(n,x,y,s,o={}){const map={ghost:'ghost',cuthach:'cuthach',codau:'codau',lam:'lam',khoa:'khoa',thay:'thay',batu:'batu',corpse:'corpse'};fig5(x,y,s*C5S,Object.assign(_c5(o,map[n]||'dan'),o.pose?{pose:o.pose}:{}))};
// corpse head (old R=56 frame)
function c2head(o,turn){ctx.save();ctx.translate(0,4);ctx.scale(0.5,0.5);const k=LWK;LWK=1.5;
 face5(Object.assign({},CAST5.corpse,{em:o.eyes?(o.white?'white':'fear'):'closed',mouth:o.mouth?'o':undefined,skipBack:true}));LWK=k;ctx.restore()}
corpseStand=function(x,fy,s,T,o={}){const d=o.dir||1;fig5(x,fy-(o.hop||0),s*1.0,Object.assign({},CAST5.corpse,{flip:d<0,tilt:o.tilt||0,em:'white',mouth:'o',claws:true,pose:{la:[1.45+(o.armDrop||0)*0.4,0.05],ra:[1.6+(o.armDrop||0)*0.4,-0.05]}}))};
