const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>console.log(e.message));await p.goto('file:///home/claude/ep1/thumb.html');await p.evaluate(()=>thumb());await p.screenshot({path:'/home/claude/ep1/thumb_qnt.png'});await b.close()})();
