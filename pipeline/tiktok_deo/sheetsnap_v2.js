const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const root=process.argv[2];
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':{'.html':'text/html','.js':'text/javascript','.json':'application/json'}[path.extname(f)]||'application/octet-stream'});r.end(d)})}).listen(8825);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1500}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8825/vec2.html'+(process.argv[4]||''));await p.waitForFunction(()=>window.READY===true,null,{timeout:30000});await p.locator('#c').screenshot({path:process.argv[3]});await b.close();srv.close()})();
