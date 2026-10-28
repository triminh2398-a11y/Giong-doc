const {chromium}=require('playwright');const {spawn}=require('child_process');
(async()=>{const [html,out,i0,i1]=process.argv.slice(2);const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1920,height:1080}});
p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('file://'+html);
const ff=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate','30','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p',out],{stdio:['pipe','inherit','inherit']});
for(let i=+i0;i<+i1;i++){await p.evaluate(t=>draw(t),i/30);const buf=await p.screenshot({type:'jpeg',quality:90});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r))}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close()})();
