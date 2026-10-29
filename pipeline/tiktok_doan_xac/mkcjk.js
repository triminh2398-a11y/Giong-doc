const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.setContent('<html><body></body></html>');
const r=await p.evaluate(async()=>{const mk=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c.toDataURL('image/png')};
 await document.fonts.load('bold 64px "Noto Sans CJK SC"');
 const plaque=mk(380,100,(g,w,h)=>{g.fillStyle='#1a0e08';g.fillRect(0,0,w,h);g.strokeStyle='#c9a227';g.lineWidth=6;g.strokeRect(6,6,w-12,h-12);g.fillStyle='#e0b840';g.font='bold 64px "Noto Serif CJK SC","Noto Sans CJK SC"';g.textAlign='center';g.textBaseline='middle';g.fillText('客 棧',w/2,h/2+2)});
 const cp=s=>mk(68,300,(g,w,h)=>{g.fillStyle='#a8141a';g.fillRect(0,0,w,h);g.fillStyle='#e0b840';g.font='bold 44px "Noto Serif CJK SC","Noto Sans CJK SC"';g.textAlign='center';for(let k=0;k<4;k++)g.fillText(s[k],w/2,60+k*68)});
 return {plaque,c1:cp('福壽安康'),c2:cp('出入平安')}});
fs.writeFileSync('cjk.js','window.CJK='+JSON.stringify(r)+';');await b.close()})();
