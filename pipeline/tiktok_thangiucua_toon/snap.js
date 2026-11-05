const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const [root,outdir,times,ext]=process.argv.slice(2);
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(f.endsWith('/'))f+='index.html';fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':{'.html':'text/html','.js':'text/javascript','.json':'application/json'}[path.extname(f)]||'application/octet-stream'});r.end(d)})}).listen(8823);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('CERR',m.text())});
await p.goto('http://localhost:8823/index.html');await p.waitForFunction(()=>window.READY===true,null,{timeout:60000});fs.mkdirSync(outdir,{recursive:true});
for(const t of times.split(',').map(Number)){await p.evaluate(t=>render(t),t);await p.locator('#c').screenshot({path:`${outdir}/${t.toFixed(2)}.${ext||'jpg'}`,type:ext==='png'?'png':'jpeg',quality:ext==='png'?undefined:85})}
await b.close();srv.close()})();
