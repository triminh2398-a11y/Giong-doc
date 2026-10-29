const { chromium } = require('playwright');const path=require('path'),http=require('http'),fs=require('fs');
(async()=>{const [q,outp,...ts]=process.argv.slice(2);const root='/home/claude/giong-doc/render/ep2';
 const srv=http.createServer((qq,r)=>{const f=path.join(root,decodeURIComponent(qq.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':{'.html':'text/html','.js':'text/javascript'}[path.extname(f)]||'application/octet-stream'});r.end(d)})}).listen(8805);
 const vert=q.includes('v=1');const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:vert?720:1280,height:vert?1280:720}});p.on('pageerror',e=>console.log('PAGEERR',e.message));
 await p.goto('http://localhost:8805/index.html?'+q);await p.waitForFunction(()=>window.READY===true);
 for(const t of ts){await p.evaluate(t=>draw(t),+t);await p.evaluate(t=>draw(t),+t);await p.screenshot({path:`${outp}_${t}.jpg`,type:'jpeg',quality:85})}await b.close();srv.close()})();
