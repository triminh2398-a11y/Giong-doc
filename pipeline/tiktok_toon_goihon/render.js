const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const [root,outdir,fps]=process.argv.slice(2);
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(f.endsWith('/'))f+='index.html';fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':{'.html':'text/html','.js':'text/javascript','.json':'application/json'}[path.extname(f)]||'application/octet-stream'});r.end(d)})}).listen(8824);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8824/index.html');await p.waitForFunction(()=>window.READY===true,null,{timeout:60000});fs.mkdirSync(outdir,{recursive:true});
const dur=await p.evaluate(()=>DUR);const n=Math.ceil(dur*fps);
for(let i=0;i<n;i++){const d=await p.evaluate(t=>{render(t);return document.getElementById('c').toDataURL('image/jpeg',0.93)},i/fps);fs.writeFileSync(`${outdir}/${String(i).padStart(5,'0')}.jpg`,Buffer.from(d.split(',')[1],'base64'))}
console.log('frames',n);await b.close();srv.close()})();
