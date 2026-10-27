const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const sm=x=>{x=cl(x);return x*x*(3-2*x)};
const seg=(t,a,b)=>cl((t-a)/(b-a));
const lerp=(a,b,k)=>a+(b-a)*k;
const rnd=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const INK='#0c0c0c',SKIN='#c4c3b8',HAIR='#141414';
const ST=TL.starts; // sentence start times (global)
const grains=[];for(let g=0;g<6;g++){const c=document.createElement('canvas');c.width=480;c.height=270;const x=c.getContext('2d');const d=x.createImageData(480,270);for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0);grains.push(c)}
function poly(pts,fill,stroke,lw=5){ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.lineJoin='round';ctx.stroke()}}
function circ(x,y,r,fill,stroke,lw=5){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.stroke()}}
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function camera(cx,cy,z,sx=0,sy=0){ctx.translate(W/2+sx,H/2+sy);ctx.scale(z,z);ctx.translate(-cx,-cy)}
function sky(top,bot,y1){const g=ctx.createLinearGradient(0,0,0,y1);g.addColorStop(0,top);g.addColorStop(1,bot);ctx.fillStyle=g;ctx.fillRect(-500,-500,W+1000,y1+500)}
function moon(x,y,r,a=1){ctx.globalAlpha=a*.18;circ(x,y,r*2.4,'#d8dcc8');ctx.globalAlpha=a*.3;circ(x,y,r*1.5,'#e2e4d2');ctx.globalAlpha=a;circ(x,y,r,'#eceadb');ctx.globalAlpha=1}
function bamboo(x0,y0,n,h,t,seed,col='#1f2a26'){for(let i=0;i<n;i++){const bx=x0+i*26+rnd(seed+i)*14,hh=h*(0.75+rnd(seed+i*3)*0.35),lean=(rnd(seed+i*7)-0.5)*0.25+Math.sin(t*0.9+i)*0.025;ctx.save();ctx.translate(bx,y0);ctx.rotate(lean);ctx.strokeStyle=col;ctx.lineWidth=11;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(10,-hh*0.5,lean*200,-hh);ctx.stroke();for(let k=1;k<6;k++){const yy=-hh*k/6;ctx.fillStyle=col;ctx.save();ctx.translate(lean*200*(k/6)**2,yy);for(let l=0;l<4;l++){ctx.save();ctx.rotate((l-1.5)*0.5+Math.sin(t*1.3+k+l+i)*0.08);ctx.beginPath();ctx.ellipse(28,0,34,7,0.2,0,Math.PI*2);ctx.fill();ctx.restore()}ctx.restore()}ctx.restore()}}
function banana(x,y,s,t,col='#1c2622'){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=col;ctx.lineWidth=16;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-260);ctx.stroke();ctx.fillStyle=col;for(let i=0;i<6;i++){ctx.save();ctx.translate(0,-250);ctx.rotate(-2.6+i*0.9+Math.sin(t*0.7+i)*0.04);ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(120,-50,230,10);ctx.quadraticCurveTo(120,30,0,8);ctx.fill();ctx.restore()}ctx.restore()}
function person(cx,fy,s,o={}){
 const ph=o.phase||0,sw=Math.sin(ph)*0.3;ctx.save();ctx.translate(cx,fy);ctx.scale(s,s);ctx.lineJoin='round';ctx.lineCap='round';
 const shirt=o.shirt||'#2e3138',pants=o.pants||'#26282e';
 if(!o.sit){for(const sd of [-1,1]){ctx.save();ctx.translate(sd*16,-110);ctx.rotate(sd*sw*0.5);ctx.fillStyle=pants;ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.rect(-11,0,22,108);ctx.fill();ctx.stroke();ctx.fillStyle='#222';ctx.beginPath();ctx.ellipse(sd*4,110,15,6,0,0,7);ctx.fill();ctx.restore()}}
 else{ctx.fillStyle=pants;ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.rect(-40,-118,80,24);ctx.fill();ctx.stroke();ctx.beginPath();ctx.rect(14,-100,22,100);ctx.rect(-36,-100,22,100);ctx.fill();ctx.stroke()}
 const robe=o.robe;const top=-232;
 if(robe){poly([[-42,top+10],[42,top+10],[58,-20],[-58,-20]],shirt,INK,4)}else poly([[-40,top+10],[40,top+10],[46,-112],[-46,-112]],shirt,INK,4);
 for(const sd of [-1,1]){ctx.save();ctx.translate(sd*40,top+22);let a=o.armUp&&sd===o.armUp?-sd*2.2+Math.sin(o.wave||0)*0.35:sd*0.1-sd*sw*0.3;if(o.arms==='hold')a=sd*-0.9;ctx.rotate(a);ctx.strokeStyle=INK;ctx.lineWidth=24;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,92);ctx.stroke();ctx.strokeStyle=shirt;ctx.lineWidth=17;ctx.stroke();circ(0,96,9,SKIN,INK,3);ctx.restore()}
 ctx.fillStyle=SKIN;ctx.fillRect(-10,top-6,20,18);
 const hy=top-46,R=58,skin=o.skin||SKIN;ctx.save();ctx.translate(0,hy);ctx.rotate(o.tilt||0);
 circ(0,0,R,skin,INK,4);
 if(o.back){ctx.save();ctx.beginPath();ctx.arc(0,0,R,0,7);ctx.clip();ctx.fillStyle=HAIR;ctx.fillRect(-R,-R,2*R,R*1.5);ctx.restore();circ(0,0,R,null,INK,4)}
 else{
  ctx.fillStyle=o.hair||HAIR;ctx.beginPath();ctx.arc(0,0,R+2,Math.PI*1.03,Math.PI*1.97);for(let i=0;i<=8;i++){const x=R-i*(2*R/8);ctx.lineTo(x,-20+(i%2?10:0))}ctx.closePath();ctx.fill();
  const eo=o.eyes??1;const p=o.pupil??3.2;for(const sd of [-1,1]){ctx.fillStyle='rgba(30,25,35,.22)';ctx.beginPath();ctx.ellipse(sd*21,11,18,15,0,0,7);ctx.fill()}
  for(const sd of [-1,1]){if(eo<0.15){ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sd*21-11,8);ctx.lineTo(sd*21+11,8);ctx.stroke()}else{ctx.save();ctx.translate(sd*21,6);ctx.scale(1,eo);circ(0,0,15,'#f4f2ea',INK,3);circ((o.look||0)*6,1,p,INK);ctx.restore()}}
  ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();if(o.mouth==='o'){ctx.ellipse(0,34,5,7,0,0,7);ctx.fillStyle='#3a2a2a';ctx.fill()}else{ctx.moveTo(-8,34);ctx.lineTo(8,34)}ctx.stroke();
  if(o.beard){poly([[-26,30],[26,30],[0,92]],'#e8e6df',INK,3)}
  if(o.sweat){ctx.fillStyle='rgba(200,225,240,.9)';ctx.beginPath();ctx.ellipse(48,-6+o.sweat*30,6,10,0,0,7);ctx.fill()}
 }
 if(o.khan){ctx.fillStyle='#f2f0ea';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.rect(-R-2,-34,2*R+4,20);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(R-6,-24);ctx.quadraticCurveTo(R+30,-10,R+20,40);ctx.lineTo(R+8,38);ctx.quadraticCurveTo(R+14,-4,R-14,-16);ctx.fill();ctx.stroke()}
 if(o.khandong){ctx.fillStyle='#262a3a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-40,R+6,26,0,0,7);ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.15)';for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(i*16,-60);ctx.lineTo(i*16+8,-18);ctx.stroke()}}
 ctx.restore();ctx.restore();
}
function wrapText(text,maxW){const words=text.split(' ');const lines=[];let cur='';for(const w of words){const tt=cur?cur+' '+w:w;if(ctx.measureText(tt).width>maxW&&cur){lines.push(cur);cur=w}else cur=tt}if(cur)lines.push(cur);return lines}
