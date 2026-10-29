const { chromium } = require('playwright');const path=require('path'),http=require('http'),fs=require('fs');
(async()=>{const root='/home/claude/giong-doc/render/ep2';
 const srv=http.createServer((qq,r)=>{const f=path.join(root,decodeURIComponent(qq.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':{'.html':'text/html','.js':'text/javascript'}[path.extname(f)]||'application/octet-stream'});r.end(d)})}).listen(8806);
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>console.log('PAGEERR',e.message));
 await p.goto('http://localhost:8806/index.html?nosub=1');await p.waitForFunction(()=>window.READY===true);await p.evaluate(()=>document.fonts.ready);
 const t=+process.argv[2];await p.evaluate(t=>draw(t),t);await p.evaluate(t=>draw(t),t);
 await p.evaluate(()=>{const cvs=document.querySelectorAll('canvas');const ov=cvs[cvs.length-1];const g=ov.getContext('2d');
  g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,0,1280,720);
  const gr=g.createLinearGradient(0,0,700,0);gr.addColorStop(0,'rgba(0,0,0,.85)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,760,720);
  const old=ctx;ctx=g;halo(930,330,520,'120,255,160',0.32);ctx.save();ctx.translate(940,330);ctx.scale(4.6,4.6);ctx.rotate(0.14);scaryFace(1.3,{open:0.9});ctx.restore();
  // dấu chữ thập xanh chàm trên vai
  ctx=old;
  const T=(s,x,y,size,fill,sw)=>{g.font=`900 ${size}px "DejaVu Sans"`;g.lineJoin='round';g.lineWidth=sw;g.strokeStyle='#000';g.strokeText(s,x,y);g.fillStyle=fill;g.fillText(s,x,y)};
  g.textAlign='left';T('CON RANH',40,200,128,'#ffe14a',22);T('CON LỘN',40,350,128,'#ff2a2a',22);
  g.fillStyle='#d6242a';g.beginPath();g.roundRect(40,410,520,84,14);g.fill();T('ĐỨA CON ĐÒI NỢ',62,472,54,'#ffffff',8);
  T('Truyện ma dân gian miền Tây',44,560,36,'#f0e6d0',7);
  });
 await p.screenshot({path:process.argv[3],type:'png'});await b.close();srv.close()})();
