const { chromium } = require('playwright');const path=require('path'),http=require('http'),fs=require('fs');
(async()=>{const [dir,outp,...ts]=process.argv.slice(2);const root=path.resolve(dir);
 const srv=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':{'.html':'text/html','.js':'text/javascript','.png':'image/png'}[path.extname(f)]||'application/octet-stream'});r.end(d)})}).listen(8801);
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1280,height:720}});
 p.on('pageerror',e=>console.log('PAGEERR',e.message));p.on('console',m=>{const s=m.text();if(s.startsWith('ERR'))console.log(s)});
 await p.goto('http://localhost:8801/index.html');await p.waitForFunction(()=>window.READY===true,{timeout:120000});
 for(let k=0;k<2;k++){await p.evaluate(t=>draw(t),+ts[0]);await p.screenshot({type:'jpeg',quality:10})}
 const t0=Date.now();for(const t of ts){await p.evaluate(t=>draw(t),+t);await p.screenshot({path:`${outp}_${(+t).toFixed(2)}.jpg`,type:'jpeg',quality:80})}
 console.log('ms/frame',(Date.now()-t0)/ts.length);await b.close();srv.close()})();
