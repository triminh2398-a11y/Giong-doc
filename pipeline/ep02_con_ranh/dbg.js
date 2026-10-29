const { chromium } = require('playwright');const path=require('path'),http=require('http'),fs=require('fs');
(async()=>{const [t,cp,cl,out]=process.argv.slice(2);const root='/home/claude/giong-doc/render/ep2';
 const srv=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':{'.html':'text/html','.js':'text/javascript'}[path.extname(f)]||'application/octet-stream'});r.end(d)})}).listen(8804);
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>console.log('PAGEERR',e.message));
 await p.goto('http://localhost:8804/index.html');await p.waitForFunction(()=>window.READY===true);
 if(cp)await p.evaluate(([a,b])=>{window.DBGCAM=[a,b]},[JSON.parse(cp),JSON.parse(cl)]);
 for(let k=0;k<2;k++)await p.evaluate(t=>draw(t),+t);await p.screenshot({path:out,type:'jpeg',quality:80});await b.close();srv.close()})();
