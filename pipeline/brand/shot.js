const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const [k,w,h] of [['avatar',800,800],['banner',2560,1440],['thumb',1280,720]]){const p=await b.newPage({viewport:{width:w,height:h}});p.on('pageerror',e=>console.log(k,e.message));await p.goto('file:///home/claude/brand/'+k+'.html');await p.waitForTimeout(300);await p.screenshot({path:`/home/claude/brand/${k}.png`});}
await b.close()})();
