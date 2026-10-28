// Shims so the v2 scenes use the ORIGINAL Ma Lai drawing style (person/woman from lib_ml)
const CAST5={codau:{}};
function fig5(x,y,s,o={}){woman(x,y,s*0.95,{dress:true,shirt:o.skin?'#e6e2ea':'#ece8e0',skin:o.skin,closed:o.em==='closed',eyes:o.em==='closed'?0.05:1,tilt:o.tilt||0,smile:false})}
function ch(n,x,y,s,o={}){
 if(n==='ghost')return woman(x,y,s*0.95,{creepy:true,dress:true,shirt:'#e8e6e0',t:o.t||0,grin:0.6,tilt:o.tilt||0});
 if(n==='cuthach')return cuThach(x,y,s*0.85,{});
 if(n==='codau')return woman(x,y,s*0.95,{dress:true,shirt:'#ece8e0'});
 return person(x,y,s,o)}
