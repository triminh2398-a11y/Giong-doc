const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const [root,outdir,times]=process.argv.slice(2);const T=times.split(',').map(Number);
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(f.endsWith('/'))f+='full.html';fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}const ext=path.extname(f);r.writeHead(200,{'Content-Type':{'.html':'text/html','.js':'text/javascript'}[ext]||'application/octet-stream'});r.end(d)})}).listen(8811);
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:720,height:1280}});p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('CERR',m.text())});
await p.goto('http://localhost:8811/full.html');await p.waitForFunction(()=>window.READY===true,null,{timeout:60000});fs.mkdirSync(outdir,{recursive:true});
for(const t of T){await p.evaluate(t=>draw(t),t);await p.evaluate(t=>draw(t),t);await p.screenshot({path:`${outdir}/${t.toFixed(2)}.jpg`,type:'jpeg',quality:80})}
await b.close();srv.close()})();
