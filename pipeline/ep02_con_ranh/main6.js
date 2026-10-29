// ================= vòng vẽ =================
window.draw=function(t0){const t=t0+T0;resetAll(t);
 motes.forEach((mm,i)=>{const p=(t*0.04+R(i))%1;mm.position.set(-4+(R(i+5))*1.5+p*2.5,0.3+((R(i+9)*3+t*0.05)%2.4),0.3+(R(i+3)-0.5)*1.2);mm.material.opacity=0.45*Math.sin(p*Math.PI)});
 fogS.forEach((s,i)=>{s.position.x=(s.userData.x0??(s.userData.x0=s.position.x))+((t*0.4+R(i)*10)%10)});
 const sc=TLD.scenes.find(s=>t>=s[1]&&t<s[2])||TLD.scenes[TLD.scenes.length-1];const [k,a,b,ls,li]=sc;const lt=t-a,D=b-a;SI_BASE=li;
 g2.clearRect(0,0,RW,RH);
 let mode='flat';try{mode=S[k](lt,D,t,ls)}catch(e){console.log('ERR',k,e.message);mode='flat'}
 [altL,innG,doorL,moonL,dayL,porchL,bthL,graveL,ghostL,rvL,moonDir,sunD].forEach(l=>l.visible=l.intensity>0.01);lampL.visible=lampL.visible&&lampL.intensity>0.01;
 [lampL,moonL,doorL,moonDir,sunD].forEach(l=>l.castShadow=l.visible&&l.intensity>0.01);dayL.castShadow=false;porchL.castShadow=false;lampL.shadow.mapSize.set(512,512);
 lampL.position.set(lampG.position.x,lampG.position.y+0.3,lampG.position.z);
 if(window.DBGCAM){cam.position.set(...window.DBGCAM[0]);cam.lookAt(...window.DBGCAM[1]);cam.fov=50}
 if(VERT)cam.fov=Math.min(70,cam.fov*1.45);
 cam.aspect=RW/RH;cam.updateProjectionMatrix();
 const face=(c)=>{if(c.visible){c.userData.paint(t);c.lookAt(cam.position.x,c.position.y,cam.position.z)}};
 if(mode==='ext'||mode==='ext+'){for(const kk in C)face(C[kk]);renderer.render(ext,cam)}
 else if(mode==='inn'){for(const kk in CI)face(CI[kk]);renderer.render(inn,cam)}
 else{renderer.setClearColor(0x000000,1);renderer.clear()}
 if(mode!=='flat'){if(TINT){g2.fillStyle=TINT;g2.fillRect(0,0,RW,RH)}if(RAIN)rain(t,RAIN);const vg=g2.createRadialGradient(RW/2,RH/2,RH*0.3,RW/2,RH/2,RH*0.95);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');g2.fillStyle=vg;g2.fillRect(0,0,RW,RH)}
 if(k==='hook3')hookText(sm(seg(lt,0.2,0.7)),'CON RANH CON LỘN','ĐỨA CON ĐÒI NỢ');
 for(const [jt,jn] of TLD.jumps)if(t>=jt&&t<jt+0.9)jump(t-jt,t);
 const d=Math.min(t-a,b-t);if(d<0.1&&a>0){g2.fillStyle=`rgba(0,0,0,${1-d/0.1})`;g2.fillRect(0,0,RW,RH)}
 if(!NOSUB){watermark(t);if(k!=='title')subs(t)}
 if(VERT)shortsFrame(t0)};
function shortsFrame(t0){g2.save();g2.textAlign='center';g2.lineJoin='round';g2.fillStyle='rgba(0,0,0,.55)';g2.fillRect(0,0,RW,150);g2.font='900 44px "DejaVu Sans"';g2.lineWidth=8;g2.strokeStyle='#000';g2.strokeText('CON RANH CON LỘN',RW/2,70);g2.fillStyle='#ff3a3a';g2.fillText('CON RANH CON LỘN',RW/2,70);g2.font='bold 26px "DejaVu Sans"';g2.fillStyle='#fff';g2.fillText('Truyện ma dân gian miền Tây',RW/2,115);
 g2.fillStyle='rgba(0,0,0,.55)';g2.fillRect(0,RH-120,RW,120);g2.font='bold 30px "DejaVu Sans"';g2.fillStyle='#ffd76a';g2.fillText('▶ Xem bản đầy đủ trên kênh',RW/2,RH-70);g2.font='bold 24px "DejaVu Sans"';g2.fillStyle='#fff';g2.fillText('@chuyendongtaykimco',RW/2,RH-32);
 if(SDUR&&t0>SDUR-3.2){const a=sm((t0-(SDUR-3.2))/0.4);g2.globalAlpha=a;g2.fillStyle='#050505';g2.fillRect(0,0,RW,RH);g2.font='900 46px "DejaVu Sans"';g2.fillStyle='#fff';g2.fillText('XEM BẢN ĐẦY ĐỦ',RW/2,RH*0.4);g2.fillText('TRÊN KÊNH',RW/2,RH*0.4+60);g2.fillStyle='#d6242a';g2.beginPath();g2.roundRect(RW/2-230,RH*0.52,460,96,48);g2.fill();g2.font='900 34px "DejaVu Sans"';g2.fillStyle='#fff';g2.fillText('Chuyện Đông Tây Kim Cổ',RW/2,RH*0.52+60);g2.font='bold 28px "DejaVu Sans"';g2.fillStyle='#ffd76a';g2.fillText('Đăng ký để nghe trọn truyện!',RW/2,RH*0.52+160)}g2.restore()}
window.READY=true;
