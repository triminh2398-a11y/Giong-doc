const m=(code,si,lt)=>spk(si)===code?talk(lt):undefined;
const IN=(md)=>{innMode(md);return 'inn'};
// ---------- MỞ ĐẦU ----------
S.hook=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);NET.visible=false;lampAt(-1.4,0.1);if(si===0)put(CI.H,-2.4,-0.85,{sit:true,baby:true,eyes:0.8,tear:true,look:0.2});
 if(si===1){VONG.rotation.x=Math.sin(T*1.6)*0.25}
 cams(lt,ls,[[[-0.6,1.4,2.6],[-2.4,1.05,-0.85],34,[-0.3,0,-0.4]],[[1.4,1.4,3.4],[0.3,1.0,0.6],38,[-0.2,0,-0.5]]],D);if(si===1){/* võng trống đưa */}return 'inn'};
S.hook2=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);graves(5);lightIncense([3,4]);graveL.intensity=2.5;put(C.R,1.8,-9.9,{crouch:si===1,beckon:si===0});ghostL.position.set(1.8,1,-9.4);ghostL.intensity=3;
 cams(lt,ls,[[[3.5,1.3,-5.5],[1.2,0.6,-10.5],40,[-0.6,0,-0.6]],[[1.0,1.0,-7.6],[1.8,0.5,-10.5],38,[0.2,0,-0.4]]],D);return 'ext'};
S.hook3=(lt,D,T,ls)=>{tod('night');put(C.R,2.0,11.9,{beckon:true});ghostL.position.set(2,1.2,12.3);ghostL.intensity=2;cams(lt,ls,[[[-4,1.6,20.5],[1,1.4,6],40,[2,0,-1]],[[4,1.2,15.5],[2,1.0,11.8],36,[-0.6,0,-0.6]]],D);return 'ext+'};
S.title=(lt,D,T)=>flat2(F.title,lt,D,T);
S.cta0=(lt,D,T)=>flat2(F.cta,lt,D,T,false);
S.ctamid=(lt,D,T)=>flat2(F.cta,lt,D,T,false);
S.cta=(lt,D,T)=>flat2(F.cta,lt,D,T,true);
S.chap1=(lt,D,T)=>flat2(F.chap,lt,D,T,'MỘT','Dấu chàm trên vai');
S.chap2=(lt,D,T)=>flat2(F.chap,lt,D,T,'HAI','Đứa thứ hai');
S.chap3=(lt,D,T)=>flat2(F.chap,lt,D,T,'BA','Đêm bên bụi tre');
S.chap4=(lt,D,T)=>flat2(F.chap,lt,D,T,'BỐN','Món nợ ba mươi năm');
S.chap5=(lt,D,T)=>flat2(F.chap,lt,D,T,'NĂM','Người trả nợ');
// ---------- CHƯƠNG 1 ----------
S.xom=(lt,D,T,ls)=>{tod('day');XUONG.position.x=4.5-lt*0.25;put(C.G1,XUONG.position.x,13.2,{oar:true,armA:[null,-0.6]},0.3);put(C.G2,-3.4,6,{});
 cams(lt,ls,[[[-14,5,26],[0,1.5,8],42,[6,-1,-2]],[[8,2.2,19],[0,1.5,3],40,[-3,0,-1]],[[-1,1.7,9.5],[-8,1.6,7.5],40,[0.5,0,-0.5]]],D);return 'ext'};
S.cuoi=(lt,D,T,ls)=>{tod('day');put(C.H,0.1,6.2,{wed:true,eyes:1,happy:true});put(C.L,0.9,6.2,{wed:true});put(C.BT,-1.4,6.6,{});put(C.NAM,2.4,6.9,{});put(C.BA,-2.4,7.2,{});put(C.G2,3.4,7.4,{});
 cams(lt,ls,[[[0.5,1.6,11.5],[0.4,1.3,6],38,[0,0,-1.2]],[[2.6,1.5,9.2],[0.5,1.4,6.2],34,[-0.4,0,-0.3]],[[-1.6,1.7,9.6],[0.8,1.3,6.4],38,[0.6,0,-0.6]]],D);return 'ext'};
const muoiRoom=(lt,T,o)=>{innMode('night');ALT.visible=false;NET.visible=false;lie(IL.BM,-3.15,0.53,-1.4);put(CI.H,-2.3,-0.85,Object.assign({sit:true,eyes:1},o||{}));lampAt(-1.5,-0.2)};
S.cuoi2=(lt,D,T,ls)=>{muoiRoom(lt,T,{tear:true});cams(lt,ls,[[[-0.6,2.2,2.2],[-3.0,0.6,-1.6],40,[-0.3,0,-0.3]]],D);return 'inn'};
S.mamuoi=(lt,D,T,ls)=>{const si=siOf(lt,ls);muoiRoom(lt,T,{tear:si>=2,eyes:si===1?1.2:1});cams(lt,ls,[[[-1.5,1.9,1.4],[-3.3,0.7,-1.7],36,[-0.2,0,-0.2]],[[-2.2,1.4,1.4],[-2.4,1.1,-0.9],34],[[-0.4,2.4,2.6],[-3.2,0.6,-1.7],40],[[-1.5,2.6,1.0],[-3.4,0.5,-1.8],44,[0.3,0.2,0.2]]],D);return 'inn'};
S.nhangay=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);put(CI.BT,1.4,0.9,{mouth:m('BT',si,lt)});put(CI.H,0.5,1.0,{mouth:m('H',si,lt),eyes:si===2?0.6:1,happy:true});
 cams(lt,ls,[[[1.0,1.5,5.2],[1.0,1.1,0.8],38,[0,0,-0.6]],[[0.0,1.5,3.6],[1.4,1.4,0.9],32],[[2.0,1.5,3.6],[0.5,1.4,1.0],32],[[1.2,1.5,3.8],[1.4,1.4,0.9],30],[[0.8,1.7,4.4],[0.2,1.3,-2.6],40]],D);return 'inn'};
S.bantho=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);put(CI.H,-0.5,-1.5,{back:si===0,mouth:m('H',si,lt)});put(CI.BT,0.6,-1.4,{back:si===0,mouth:m('BT',si,lt),arm:si===3?[undefined,-0.3]:undefined});
 cams(lt,ls,[[[0.3,1.8,1.6],[0.3,1.2,-2.9],38,[0,-0.1,-0.5]],[[0.8,1.5,0.2],[-0.5,1.45,-1.5],30],[[-0.6,1.5,0.2],[0.6,1.45,-1.4],30],[[1.4,1.4,0.5],[0.4,1.2,-2.4],40]],D);return 'inn'};
S.bau=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.H,-0.4,6.0,{belly:true,happy:true});put(C.BT,0.6,6.1,{});if(si===1)put(C.BA,-1.6,6.9,{});cams(lt,ls,[[[1,1.6,11],[0,1.3,5.5],38,[0,0,-1]],[[-3.5,1.5,10],[-0.8,1.3,6.2],36]],D);return 'ext'};
const birth=(lt,T,si,o={})=>{innMode('night');NET.visible=false;lie(IL.H,-3.15,0.53,-1.4);put(CI.BA,-2.0,-0.55,Object.assign({mouth:m('BA',si,lt)},o));lampAt(-1.6,0.0);RAIN=0.6};
S.sanh=(lt,D,T,ls)=>{const si=siOf(lt,ls);birth(lt,T,si,si===2?{stand:true,baby:true}:{});cams(lt,ls,[[[-4.0,1.6,1.8],[-2.8,0.9,-1.2],40,[0.3,0,-0.2]],[[-1.0,2.0,1.6],[-2.8,0.8,-1.3],38],[[-0.8,1.5,1.8],[-2.2,1.2,-0.6],34]],D);return 'inn'};
S.sanh2=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===1)return flat2(F.be,lt-ls[1],ls[2]-ls[1],T,{look:0.2});birth(lt,T,si,{stand:true,baby:true,eyes:si===3?1.3:1});cams(lt,ls,[[[-0.8,1.5,1.8],[-2.2,1.2,-0.6],34],[],[[-0.6,1.6,2.0],[-2.2,1.25,-0.6],32],[[-1.2,1.4,1.6],[-2.0,1.3,-0.55],30]],D);return 'inn'};
S.vongngay=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);VBABY.visible=si<2;VONG.rotation.x=Math.sin(T*1.4)*0.08;
 if(si===0||si===1){put(CI.H,1.4,1.5,{happy:true});put(CI.BT,-0.8,1.6,{})}
 if(si===2){put(CI.BT,0.6,1.4,{baby:true,mouth:'o',eyes:1.3})}
 if(si>=3){put(CI.L,0.2,1.5,{hold:true,mouth:m('L',si,lt),look:-0.5});put(CI.H,1.2,1.6,{baby:true,mouth:m('H',si,lt),flipb:true});VBABY.visible=false}
 if(si===2){CI.BT.userData.o.arm=[-0.95,0.95]}
 cams(lt,ls,[[[0.3,1.6,4.8],[0.3,1.1,0.8],40,[0,0,-0.6]],[[0.6,1.6,4.4],[0.4,1.1,0.9],36],[[0.6,1.5,4.0],[0.6,1.4,1.4],30],[[0.0,1.5,4.0],[0.3,1.45,1.5],30],[[1.6,1.5,4.0],[1.0,1.45,1.6],30]],D);return 'inn'};
S.vongdem=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);VBABY.visible=true;VONG.rotation.x=Math.sin(T*1.5)*0.2;lampAt(1.3,2.2);
 put(CI.H,0.5,1.45,{sit:true,eyes:si===2?0.05:0.9,tilt:si===2?0.25:0,mouth:m('H',si,lt),arm:[undefined,-1.0]});
 cams(lt,ls,[[[1.8,1.4,4.4],[0.4,1.0,0.8],38,[-0.3,0,-0.5]],[[-1.2,1.3,3.4],[0.4,1.1,1.0],34],[[0.6,2.2,3.6],[0.4,0.8,0.8],40,[0,-0.2,-0.4]]],D);return 'inn'};
S.vongdem2=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);VBABY.visible=true;VONG.rotation.x=Math.sin(T*1.5)*0.2;lampAt(1.3,2.2);lampL.intensity*=0.6;
 if(si===1)return flat2(F.be,lt-ls[1],ls[2]-ls[1],T,{grin:0.9,look:1,dead:true});
 if(si<3)put(CI.H,0.5,1.45,{sit:true,eyes:si===0?0.6:1.3,mouth:m('H',si,lt),arm:[undefined,-1.0]});if(si===2)put(CI.R,3.3,-2.0,{crouch:true,a:0.9,calm:true});
 cams(lt,ls,[[[-1.4,1.5,3.4],[0.3,1.0,0.6],36,[0.2,0,-0.3]],[],[[0.0,1.4,3.6],[0.7,1.1,1.2],32],[[1.6,1.3,0.4],[3.6,0.7,-2.4],40,[0.2,0,-0.4]]],D);return 'inn'};
S.chet=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);NET.visible=false;put(CI.H,-2.4,-0.85,{sit:true,baby:true,tear:si>=1,mouth:m('H',si,lt),eyes:si===2?1.2:0.9});if(si>=1)put(CI.L,-1.4,-0.4,{look:-1});lampAt(-1.5,0.0);
 cams(lt,ls,[[[-0.6,1.4,3.0],[-2.4,1.1,-0.85],34,[0,0,-0.4]],[[-1.0,1.4,2.2],[-2.0,1.2,-0.7],34],[[-2.0,1.3,1.4],[-2.4,1.25,-0.85],28]],D);return 'inn'};
S.chet2=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si<=1)return flat2(F.be,lt,si===0?ls[1]:D,T,{dead:true,grin:0.5,look:0});innMode('night');NET.visible=false;put(CI.BA,-1.5,-0.5,{mouth:m('BA',si,lt),look:1});put(CI.H,-2.4,-0.85,{sit:true,baby:true,dead:true,tear:true});
 cams(lt,ls,[[],[],[[-0.6,1.5,2.4],[-1.6,1.3,-0.5],32]],D);return 'inn'};
S.chet2b=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);NET.visible=false;COFFIN.visible=true;put(CI.H,-2.6,-0.75,{sit:true,eyes:0.6,tear:true,mouth:m('H',si,lt),arm:[-0.6,0.6]});if(si>=2)put(CI.L,-1.5,-0.5,{mouth:m('L',si,lt),look:-1});
 cams(lt,ls,[[[-1.2,1.8,2.4],[-3.0,0.7,-1.5],38,[-0.3,0,-0.3]],[[-1.8,1.3,1.6],[-2.6,1.0,-0.8],32],[[-0.4,1.5,2.4],[-1.5,1.4,-0.5],30],[[-1.4,1.5,1.8],[-2.6,1.2,-0.75],30]],D);return 'inn'};
S.batho=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);put(C.BA,-0.2,4.4,{mouth:m('BA',si,lt),look:1});put(C.BT,0.9,4.4,{mouth:m('BT',si,lt),eyes:si>=4?1.2:1,look:-1});
 cams(lt,ls,[[[0.4,1.6,9],[0.3,1.3,4.4],38,[0,0,-1]],[[1.8,1.6,7.2],[-0.2,1.5,4.4],28],[[-1.2,1.6,7.2],[0.9,1.5,4.4],28]],D);return 'ext'};
S['dauchàm']=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);NET.visible=false;if(si===1)return flat2(F.vai,lt-ls[1],ls[2]-ls[1],T,'dead');
 IB[0].visible=true;IB[0].position.set(-2.7,0.62,-1.4);put(CI.BA,-2.5,-0.75,{sit:true,arm:[undefined,-1.3],look:-1});if(si>=2){put(CI.H,-2.0,0.6,{mouth:m('H',si,lt),eyes:1.2,tear:true})};if(si>=2)put(CI.BT,-1.45,0.8,{mouth:m('BT',si,lt),arm:[-0.9,undefined]});
 lampAt(-1.5,0.1);
 cams(lt,ls,[[[-0.8,2.0,1.8],[-2.7,0.6,-1.4],38,[0,-0.1,-0.1]],[],[[-2.4,1.5,3.6],[-1.75,1.4,0.7],32],[[-1.0,1.5,3.4],[-1.75,1.4,0.7],30],[[-2.6,1.5,3.2],[-1.6,1.45,0.8],28],[[-1.0,1.8,3.6],[-2.2,1.0,-0.6],40]],D);return 'inn'};
S.moday=(lt,D,T,ls)=>{tod('dusk');const si=siOf(lt,ls);graves(4);lightIncense([3]);put(C.H,0.4,-8.6,{mouth:m('H',si,lt),tear:true});put(C.BT,1.5,-8.4,{mouth:m('BT',si,lt),look:-1});put(C.L,-0.6,-8.3,{});
 cams(lt,ls,[[[0.6,1.6,-4.5],[0.6,0.7,-10.6],38,[0,0,-0.8]],[[0.6,1.2,-9.0],[0.6,0.4,-11],40],[[1.5,1.5,-6.6],[0.4,1.45,-8.6],30],[[-0.6,1.5,-6.6],[1.5,1.45,-8.4],30]],D);return 'ext'};
S.modem=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);graves(4);put(C.L,3.4,-4.0,{eyes:si>=1?1.3:1,mouth:m('L',si,lt),back:si===0});put(C.R,1.8,-10.2,{crouch:true,dig:si<3,back:si<3,calm:false});ghostL.position.set(1.8,0.8,-9.6);ghostL.intensity=1.5;
 cams(lt,ls,[[[5.2,1.9,-3.0],[1.8,0.6,-10.5],38,[-0.2,0,-0.5]],[[2.2,1.5,-6.0],[3.4,1.45,-4.0],32],[[2.4,1.2,-6.4],[1.8,0.5,-10.2],34,[0,0,-0.8]],[[1.9,0.8,-8.4],[1.8,0.55,-10.2],30,[0,0,-0.5]]],D);return 'ext'};
S.jump1=(lt,D,T,ls)=>{tod('night');graves(4);lie(EL.L,3.0,0.04,-4.4,0.3,0.3);cams(lt,ls,[[[2.0,2.2,-6.6],[3.0,0.2,-4.4],40,[0,0.2,0]]],D);return 'ext'};
S.modem2=(lt,D,T,ls)=>{tod('night');graves(4);HOLE.visible=true;put(C.L,0.6,-8.8,{lamp:true,eyes:1.3});put(C.BT,2.4,-8.6,{});put(C.H,1.4,-8.0,{eyes:1.2});rvL.position.set(0.4,1.4,-8.6);rvL.intensity=4;
 cams(lt,ls,[[[1.4,2.0,-4.8],[1.4,0.8,-10.2],38,[0,0,-0.8]],[[1.9,1.2,-9.4],[1.8,0.3,-10.8],34,[0,-0.1,-0.2]]],D);return 'ext'};
S.sangmo=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);graves(4);OFFER.visible=si>=1;lightIncense([2]);if(si!==1&&si!==4)put(C.BT,-0.5,-9.0,{hoe:si===0,mouth:m('BT',si,lt)});put(C.L,1.1,-8.7,{mouth:m('L',si,lt),look:-1});
 cams(lt,ls,[[[0.6,1.6,-5],[0,0.7,-10],38,[0,0,-0.6]],[[0.5,0.9,-8.4],[-0.6,0.35,-10.5],36],[[-1.4,1.5,-6.6],[1.1,1.45,-8.7],30],[[2.0,1.5,-6.6],[-0.5,1.45,-9.0],30],[[0.3,1.0,-8.6],[-0.6,0.35,-10.55],30,[0,0,-0.3]]],D);return 'ext'};
// ---------- CHƯƠNG 2 ----------
const newborn=(lt,T,si,o)=>{innMode('night');NET.visible=false;lie(IL.H,-3.15,0.53,-1.4);put(CI.BA,-2.3,-0.5,Object.assign({baby:true,mouth:m('BA',si,lt)},o||{}));lampAt(-1.6,0.1)};
S.bau2=(lt,D,T,ls)=>{const si=siOf(lt,ls);newborn(lt,T,si);cams(lt,ls,[[[-0.4,1.8,2.4],[-2.8,0.9,-1.2],38,[-0.3,0,-0.4]],[[-1.2,1.5,1.6],[-2.3,1.35,-0.5],32]],D);return 'inn'};
S.vai=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si<2)return flat2(F.vai,lt,ls[2],T,'baby');newborn(lt,T,si,{eyes:1.3});cams(lt,ls,[[],[],[[-1.2,1.5,1.6],[-2.3,1.4,-0.5],30]],D);return 'inn'};
S.vai2=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);NET.visible=false;put(CI.H,-2.4,-0.85,{sit:true,baby:true,mouth:m('H',si,lt),eyes:1});put(CI.BT,-0.75,0.85,{eyes:1.2,tilt:-0.08});
 cams(lt,ls,[[[-1.0,1.4,2.2],[-2.4,1.1,-0.85],32],[[-1.6,1.3,1.4],[-2.4,1.2,-0.85],28],[[0.4,1.5,3.4],[-0.75,1.4,0.85],30]],D);return 'inn'};
S.ten2=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===3){innMode('night');put(CI.BT,0.1,-2.1,{back:true});bowls(3);altL.intensity=2;cams(lt,ls,[[],[],[],[[0.8,1.5,0.4],[0.1,1.2,-2.6],38,[0,0,-0.4]]],D);return 'inn'}
 innMode('day');put(CI.H,0.4,1.0,{baby:true,mouth:m('H',si,lt)});put(CI.BT,1.4,1.0,{mouth:m('BT',si,lt),eyes:1.2});
 cams(lt,ls,[[[0.9,1.5,4.8],[0.9,1.2,1.0],36,[0,0,-0.5]],[[0.0,1.5,3.6],[1.4,1.4,1.0],30],[[2.0,1.5,3.6],[0.4,1.4,1.0],30]],D);return 'inn'};
S.lai=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);VBABY.visible=true;put(CI.BT,1.7,1.3,{mouth:m('BT',si,lt),eyes:si>=2?1.2:1});if(si>=2)put(CI.L,-0.9,1.4,{mouth:m('L',si,lt)});
 if(si===1)return flat2(F.be,lt-ls[1],ls[2]-ls[1],T,{look:1});
 cams(lt,ls,[[[0.3,1.8,3.0],[0.3,0.95,0.6],36,[0,-0.1,-0.3]],[],[[0.2,1.5,4.2],[1.7,1.4,1.3],30],[[1.4,1.5,4.0],[-0.9,1.4,1.4],30],[[0.6,1.5,4.0],[1.7,1.45,1.3],28]],D);return 'inn'};
S.xom2=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);CHK.forEach(c=>c.visible=si!==1);
 if(si===2){put(C.KID,15,5.5,{eyes:0.4,sit:true});put(C.NAM,16.2,5.8,{look:-1})}
 if(si===1){DEADCHK.visible=true}
 cams(lt,ls,[[[-6,2.5,16],[0,1.2,4],40,[3,0,-1]],[[13.2,1.0,6.8],[14.2,0.3,5.4],34],[[14,1.4,9],[15.5,0.9,5.6],34,[0,0,-0.6]]],D);return 'ext'};
S.namco=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.NAM,1.2,6.2,{mouth:m('NAM',si,lt),armUp:si===0?1:0,wave:T*3,look:-1});put(C.H,0.0,6.0,{baby:true,mouth:m('H',si,lt)});if(si===4)C.NAM.position.x=lerp(1.2,8,seg(lt,ls[4],D));
 cams(lt,ls,[[[-0.6,1.5,9.6],[1.2,1.45,6.2],30],[[1.9,1.5,9.4],[0.0,1.45,6.0],30],[[-1.2,1.5,9.8],[1.2,1.45,6.2],28],[[0.6,1.6,11],[0.6,1.3,6],38],[[0.6,1.7,12],[3,1.2,6],40]],D);return 'ext'};
S.matlai=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);VONG.rotation.x=Math.sin(T*1.2)*0.06;
 if(si===4)return flat2(F.lung,lt-ls[4],ls[5]-ls[4],T);
 if(si<=2){put(CI.H,0.8,1.8,{eyes:1.3,mouth:m('H',si,lt),look:-1});if(si>=1)put(CI.L,-0.2,1.9,{lamp:true,eyes:1.2})}
 if(si>=3){IB[0].visible=true;IB[0].position.set(2.6,0.1,-2.6);IB[0].rotation.y=Math.PI/2;doorL.intensity=60;put(CI.H,1.8,-1.4,{eyes:1.3,mouth:m('H',si,lt)});put(CI.L,3.3,-1.2,{lamp:true,eyes:1.2,mouth:m('L',si,lt)});if(si===6){CI.H.visible=false;put(CI.BT,0.6,-2.2,{eyes:1.3,look:1})}}
 cams(lt,ls,[[[0.3,1.6,4.6],[0.3,1.0,0.6],38,[0,0,-0.4]],[[1.6,1.5,4.4],[0.6,1.4,1.8],34],[[0.0,1.5,4.2],[0.6,1.2,1.6],38],[[2.4,1.3,-0.6],[2.6,0.2,-2.6],34,[0,0,-0.3]],[],[[3.2,1.5,0.6],[1.8,1.3,-1.4],32],[[2.0,1.5,0.8],[0.6,1.4,-2.2],30,[0,0,-0.3]]],D);return 'inn'};
S.thay=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);VBABY.visible=true;put(CI.TH,si<2?2.8:1.4,si<2?2.2:1.6,{mouth:m('TH',si,lt),tilt:si===1?Math.sin(T*3)*0.08:0,look:-1});put(CI.BT,3.2,0.0,{});
 cams(lt,ls,[[[0.6,1.6,5.6],[2.2,1.3,1.6],38,[0.4,0,-0.6]],[[1.4,1.5,4.6],[2.8,1.45,2.2],30],[[1.4,1.5,4.4],[2.6,1.45,2.0],28],[[2.2,1.5,3.6],[0.3,1.0,0.6],36],[[0.0,1.4,3.4],[0.3,0.95,0.6],30]],D);return 'inn'};
S.thay2=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);VBABY.visible=true;if(si===1)return flat2(F.be,lt-ls[1],ls[2]-ls[1],T,{grin:1,look:0.4});
 put(CI.TH,1.4,1.6,{mouth:m('TH',si,lt),broken:si>=2,eyes:si>=2?1.3:1,look:-1});
 cams(lt,ls,[[[2.4,1.5,3.6],[0.6,1.2,1.0],34],[],[[1.2,1.5,3.4],[1.4,1.2,1.6],30,[0,0,-0.3]],[[0.4,1.5,3.8],[1.4,1.45,1.6],28]],D);return 'inn'};
const hien_out=(lt,si,o={})=>{tod('day');put(C.TH,-0.9,4.5,{mouth:m('TH',si,lt),look:1});put(C.H,0.3,4.6,Object.assign({mouth:m('H',si,lt),look:-1},o));put(C.L,1.6,4.5,{mouth:m('L',si,lt),look:-1});put(C.BT,0.6,3.15,{eyes:1.1})};
S.thaynoi=(lt,D,T,ls)=>{const si=siOf(lt,ls);hien_out(lt,si);if(si>=5)C.BT.userData.o={eyes:1.4,mouth:'o',arm:[0.5,-0.5]};
 cams(lt,ls,[[[0.6,1.6,10],[0.5,1.3,4.4],36,[0,0,-1]],[[1.8,1.6,7.4],[-0.6,1.5,4.5],28],[[-1.2,1.6,7.6],[1.6,1.5,4.5],28],[[1.8,1.6,7.4],[-0.6,1.5,4.5],28],[[-1.6,1.6,7.6],[0.4,1.5,3.6],30],[[1.25,1.6,5.8],[0.6,1.5,3.15],28,[0,0,-0.3]]],D);return 'ext'};
S.cach=(lt,D,T,ls)=>{const si=siOf(lt,ls);hien_out(lt,si,{eyes:si===1?1.3:1});
 cams(lt,ls,[[[1.8,1.6,7.4],[-0.6,1.5,4.5],28],[[-1.0,1.6,7.4],[0.6,1.5,4.6],28],[[1.8,1.6,7.6],[-0.6,1.5,4.5],30],[[0.6,1.7,9.6],[0.3,1.4,4.4],38],[[-0.4,1.6,7.0],[0.6,1.45,4.6],30,[0,0,-0.4]]],D);return 'ext'};
// ---------- CHƯƠNG 3 ----------
const ngo=(o)=>{tod('night');MAT.visible=true;EB.visible=true;EB.position.set(NGO.x+0.4,0.12,NGO.z+0.7);EB.rotation.y=0.3};
S.buitre=(lt,D,T,ls)=>{const si=siOf(lt,ls);ngo();if(si===0)put(C.H,NGO.x+1.2,NGO.z+1.3,{arm:[-0.6,0.6],tear:true});if(si===1||si===2)put(C.TH,NGO.x+2.4,NGO.z+1.8,{mouth:m('TH',si,lt),look:-1});if(si===2)put(C.H,NGO.x+1.4,NGO.z+2.0,{tear:true,look:1});if(si===3){put(C.H,NGO.x+4.0,NGO.z+2.7,{look:-1,eyes:1.2})}
 cams(lt,ls,[[[NGO.x+3,1.4,NGO.z+5],[NGO.x+0.6,0.6,NGO.z+0.8],36,[-0.4,0,-0.6]],[[NGO.x+1.5,1.6,NGO.z+6],[NGO.x+1.4,0.9,NGO.z+1.2],38],[[NGO.x+3.6,1.5,NGO.z+4.6],[NGO.x+2,1.4,NGO.z+1.8],30],[[NGO.x+6.0,1.5,NGO.z+4.4],[NGO.x+3.8,1.3,NGO.z+2.5],34,[0.2,0,-0.3]]],D);return 'ext'};
S.buitre2=(lt,D,T,ls)=>{const si=siOf(lt,ls);ngo();const p=si>=1?sm(seg(lt,ls[1],D)):0;if(si>=1){put(C.R,lerp(NGO.x-0.6,NGO.x-0.1,p),lerp(NGO.z-0.2,NGO.z+0.5,p),{crouch:true,calm:true});ghostL.position.set(NGO.x,0.8,NGO.z+1);ghostL.intensity=2}
 if(si===3)put(C.H,NGO.x+4.0,NGO.z+2.7,{eyes:1.3,mouth:m('H',si,lt),look:-1});
 cams(lt,ls,[[[NGO.x+1.5,1.2,NGO.z+4],[NGO.x,1.6,NGO.z],42,[0,0,-0.4],[0,0.4,0]],[[NGO.x+2.6,1.0,NGO.z+3.4],[NGO.x-0.2,0.5,NGO.z+0.3],36],[[NGO.x+1.2,0.8,NGO.z+2.4],[NGO.x-0.1,0.55,NGO.z+0.5],30,[0,0,-0.3]],[[NGO.x+5.4,1.5,NGO.z+4.2],[NGO.x+4.0,1.45,NGO.z+2.7],30]],D);return 'ext'};
S.buitre3=(lt,D,T,ls)=>{const si=siOf(lt,ls);ngo();put(C.R,NGO.x+0.1,NGO.z+0.65,{crouch:true,calm:si!==1,tilt:0.5});ghostL.position.set(NGO.x,0.8,NGO.z+1.2);ghostL.intensity=2;
 if(si>=2)return flat2(F.be,lt-ls[2],D-ls[2],T,{grin:1.2,look:-1,dead:true});
 cams(lt,ls,[[[NGO.x+1.8,0.9,NGO.z+2.6],[NGO.x+0.2,0.45,NGO.z+0.7],34,[-0.3,0,-0.3]],[[NGO.x+1.0,0.6,NGO.z+1.6],[NGO.x+0.2,0.45,NGO.z+0.7],28,[0,0,-0.2]]],D);return 'ext'};
S.jump2=(lt,D,T,ls)=>{ngo();put(C.H,NGO.x+0.6,NGO.z+1.3,{sit:true,baby:true,eyes:1.3,mouth:'o'},-0.42);EB.visible=false;cams(lt,ls,[[[NGO.x+2.6,1.3,NGO.z+3.6],[NGO.x+0.6,0.9,NGO.z+1.3],32,[-0.3,0,-0.4]]],D);return 'ext'};
S.buitre4=(lt,D,T,ls)=>{const si=siOf(lt,ls);ngo();EB.visible=false;put(C.H,NGO.x+0.6,NGO.z+1.3,{sit:true,baby:true,eyes:1.2,tear:true,mouth:m('H',si,lt)},-0.42);put(C.BA,NGO.x+1.8,NGO.z+1.8,{lamp:true,mouth:m('BA',si,lt),look:-1});rvL.position.set(NGO.x+1.4,1.3,NGO.z+2);rvL.intensity=4;
 if(si===4)return flat2(F.dautay,lt-ls[4],D-ls[4],T);
 cams(lt,ls,[[[NGO.x+3.2,1.5,NGO.z+5],[NGO.x+1.1,0.9,NGO.z+1.5],34,[0,0,-0.6]],[[NGO.x-0.2,1.5,NGO.z+4.6],[NGO.x+1.6,1.3,NGO.z+1.8],36],[[NGO.x+2.4,1.3,NGO.z+4.0],[NGO.x+0.6,0.95,NGO.z+1.3],28],[[NGO.x+2.2,1.5,NGO.z+4.8],[NGO.x+1.2,1.1,NGO.z+1.5],34]],D);return 'ext'};
const rainyRoom=(lt,T,si,o)=>{innMode('night');NET.visible=false;RAIN=0.5;put(CI.H,-2.4,-0.85,Object.assign({sit:true,baby:true,mouth:m('H',si,lt),tear:true},o||{}));lampAt(-1.5,0.0)};
S.chet3=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===4)return flat2(F.be,lt-ls[4],D-ls[4],T,{dead:true,grin:0.5});if(si===3)return flat2(F.be,lt-ls[3],ls[4]-ls[3],T,{look:0});rainyRoom(lt,T,si,{eyes:si===0?1.1:0.8});
 cams(lt,ls,[[[-0.6,1.4,3.0],[-2.4,1.1,-0.85],34,[0,0,-0.4]],[[-1.4,1.3,1.6],[-2.4,1.2,-0.85],28],[[-2.0,1.3,1.2],[-2.4,1.25,-0.85],26]],D);return 'inn'};
S.rach=(lt,D,T,ls)=>{tod('rain');const si=siOf(lt,ls);XUONG2.rotation.z=Math.sin(T*1.7)*0.06;XUONG2.rotation.x=Math.sin(T*1.3)*0.05;put(C.L,RV-0.8,0,{oar:true,armA:[null,-0.6+Math.sin(T*3)*0.3],eyes:si>=2?1.3:1,mouth:m('L',si,lt),lamp:si===2||si===3},0.3);
 rvL.position.set(RV-0.9,1.3,0.3);rvL.intensity=si>=2?5:2;if(si>=2&&si<=4){put(C.R,RV+1.1,0,{back:si===2,crouch:true,calm:si===3},0.3);ghostL.position.set(RV+1.1,1.0,0.4);ghostL.intensity=1.5}
 cams(lt,ls,[[[RV+5,2.0,7],[RV,0.6,0],40,[-1,0,-1]],[[RV+2.6,1.2,3.4],[RV,0.8,0],36],[[RV-2.8,1.6,1.6],[RV+1.1,0.7,0],34,[0,0,-0.3]],[[RV-1.6,1.4,2.2],[RV-0.8,1.6,0],30],[[RV+2.6,1.0,1.4],[RV+1.1,0.75,0],28],[[RV+4,1.8,6],[RV,0.7,0],40]],D);return 'ext'};
S['lóng']=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);NET.visible=false;put(CI.TH,0.4,0.8,{mouth:m('TH',si,lt),look:-1});put(CI.H,-2.4,-0.85,{sit:true,baby:true,dead:true,mouth:m('H',si,lt),eyes:si>=2?1.3:0.9,tear:true});put(CI.BT,1.4,0.6,{});
 cams(lt,ls,[[[1.4,1.5,4.0],[0.4,1.4,0.8],30],[[2.4,1.5,4.2],[0.4,1.45,0.8],28],[[-1.2,1.4,1.8],[-2.4,1.15,-0.85],30],[[-0.4,1.7,2.8],[-2.4,1.0,-0.85],36,[0,0,-0.4]],[[0.8,1.5,3.6],[-0.6,1.2,-0.2],40]],D);return 'inn'};
S['lóng2']=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===1)return flat2(F.tay,lt-ls[1],ls[2]-ls[1],T,'wrap');
 if(si===2){tod('night');XUONG.position.set(lerp(4.5,14,sm(seg(lt,ls[2],ls[3]))),0.04,14.8);put(C.TH,XUONG.position.x,14.8,{oar:true,stick:false,back:true},0.3);cams(lt,ls,[[],[],[[2,1.4,10],[8,1,15],40]],D);return 'ext'}
 innMode('night');NET.visible=false;lie(IL.H,-3.15,0.53,-1.4);
 if(si===0)put(CI.BT,lerp(0.0,-1.8,sm(seg(lt,0,ls[1]))),-0.4,{knife:true,eyes:1.2});
 if(si>=3){IL.H.visible=false;put(CI.H,-2.4,-0.8,{mouth:m('H',si,lt),eyes:1.3,tear:true});put(CI.BT,-1.2,-0.4,{mouth:m('BT',si,lt),tear:si>=4})}
 cams(lt,ls,[[[-0.6,1.8,3.0],[-2.0,0.9,-1.0],40],[],[],[[-0.4,1.5,2.6],[-2.4,1.45,-0.8],28],[[-2.4,1.5,2.2],[-1.2,1.45,-0.4],28],[[-1.0,1.6,3.6],[-1.8,1.3,-0.6],36,[0,0,-0.5]]],D);return 'inn'};
S.mo2=(lt,D,T,ls)=>{tod('dusk');const si=siOf(lt,ls);graves(5);lightIncense([3,4]);put(C.H,0.6,-8.4,{mouth:m('H',si,lt)});put(C.L,1.8,-8.3,{mouth:m('L',si,lt),eyes:si>=5?1.2:1,look:-1});
 cams(lt,ls,[[[0.6,1.7,-4],[0.6,0.6,-10.6],40,[0,0,-0.8]],[[-0.8,1.5,-6.2],[1.0,1.3,-8.6],34],[[2.6,1.5,-6.4],[0.6,1.45,-8.4],28],[[-0.6,1.5,-6.4],[1.8,1.45,-8.3],28],[[-0.6,1.5,-6.4],[1.8,1.45,-8.3],28,[0,0,-0.3]],[[2.6,1.5,-6.4],[0.6,1.45,-8.4],28],[[4.2,1.4,-7.2],[1.2,1.2,-9.6],38,[-0.6,0,0]]],D);return 'ext'};
// ---------- CHƯƠNG 4 ----------
const dream=(lt,T,si,o)=>{innMode('night');lie(IL.H,-3.15,0.53,-1.4);moonL.color.set(0x7aa0ff);TINT='rgba(30,60,120,.18)'};
S.bau3=(lt,D,T,ls)=>{const si=siOf(lt,ls);dream();NET.visible=false;if(si>=1){put(CI.R,-1.75,-1.6,{nofinger:true,wrap:true,calm:true});innG.position.set(-1.6,1.0,-1.0);innG.intensity=3}
 cams(lt,ls,[[[-1.2,2.2,1.6],[-3.2,0.6,-1.8],38,[-0.3,0,-0.3]],[[-1.9,1.3,1.4],[-1.75,0.8,-1.6],32,[0,0,-0.3]],[[-1.2,1.6,2.2],[-2.6,0.8,-1.5],38]],D);return 'inn'};
S.mo3=(lt,D,T,ls)=>{const si=siOf(lt,ls);dream();NET.visible=false;if(si===3){TINT=null;VONG.rotation.x=Math.sin(T*1.4)*0.25;IL.H.visible=false;put(CI.H,-2.4,-0.85,{sit:true,eyes:1.3,look:1});cams(lt,ls,[[],[],[],[[1.4,1.4,4.2],[0.3,1.0,0.6],38,[-0.2,0,-0.4]]],D);return 'inn'}
 put(CI.R,-1.75,-1.6,{nofinger:true,wrap:true,calm:si!==2,beckon:si===0});innG.position.set(-1.6,1.0,-1.0);innG.intensity=3;if(si===1){IL.H.visible=false;put(CI.H,-2.9,-0.85,{sit:true,mouth:m('H',si,lt),eyes:1.3,look:1})}
 cams(lt,ls,[[[-1.9,1.0,1.2],[-1.75,0.8,-1.6],30],[[-1.6,1.4,2.0],[-2.4,1.0,-1.0],34],[[-1.8,0.9,0.4],[-1.75,0.85,-1.6],26,[0,0,-0.2]]],D);return 'inn'};
S.sanh3=(lt,D,T,ls)=>{const si=siOf(lt,ls);newborn(lt,T,si,{eyes:1.2});cams(lt,ls,[[[-0.4,1.8,2.4],[-2.8,0.9,-1.2],38],[[-1.2,1.5,1.6],[-2.3,1.35,-0.5],30,[0,0,-0.2]]],D);return 'inn'};
S.tay=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si<2)return flat2(F.tay,lt,ls[2],T,'scar');newborn(lt,T,si,{eyes:1.3});cams(lt,ls,[[],[],[[-1.2,1.5,1.5],[-2.3,1.4,-0.5],28]],D);return 'inn'};
S.tay2=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);NET.visible=false;
 if(si===0){put(CI.BT,2.6,-2.4,{sit:true,eyes:1.3,mouth:'o'},-0.42);put(CI.BA,-2.5,-0.6,{baby:true});cams(lt,ls,[[[1.6,1.3,0.6],[2.6,0.8,-2.4],34,[0,0,-0.3]]],D);return 'inn'}
 lampAt(-1.5,0.0);put(CI.H,-2.4,-0.85,{sit:true,baby:true,eyes:si===2?0.05:si>=4?1.2:0.8});
 cams(lt,ls,[[],[[-0.8,1.4,2.6],[-2.4,1.1,-0.85],34],[[-1.6,1.25,1.2],[-2.4,1.2,-0.85],28,[0,0,-0.2]],[[-1.9,1.25,0.8],[-2.4,1.25,-0.85],24],[[-0.6,1.6,2.8],[-2.2,1.0,-1.2],38]],D);return 'inn'};
const bathoPorch=(lt,si,o={})=>{tod('day');const bx=-16.4,bz=5.55;put(C.BA,bx,bz,Object.assign({sit:true,mouth:m('BA',si,lt),look:1},o.ba||{}));put(C.H,bx+1.5,bz,Object.assign({sit:true,baby:true,mouth:m('H',si,lt),look:-1},o.h||{}));return [bx,bz]};
const BC=(bx,bz)=>[[[bx+0.75,1.3,bz+4.6],[bx+0.75,0.9,bz],38,[0,0,-0.6]],[[bx+0.2,1.25,bz+2.8],[bx,1.15,bz],28],[[bx+1.3,1.25,bz+2.8],[bx+1.5,1.15,bz],28]];
S.baba=(lt,D,T,ls)=>{const si=siOf(lt,ls);const [bx,bz]=bathoPorch(lt,si,si===0?{h:{sit:false}}:{});cams(lt,ls,BC(bx,bz),D);return 'ext'};
S.momuoi=(lt,D,T,ls)=>{tod('day');const si=siOf(lt,ls);put(C.H,FD+0.3,1.2,{sit:si>=1,baby:si===0,mouth:m('H',si,lt),tear:si>=1,back:si===3},si>=1?-0.42:0);
 cams(lt,ls,[[[FD+6,2.2,9],[FD,0.6,0],40,[-2,0,-2]],[[FD+2.4,1.1,3.2],[FD+0.2,0.7,0.6],32],[[FD-1.6,1.0,2.6],[FD+0.3,0.9,1.2],30],[[FD+2.6,1.4,4.2],[FD,0.8,-2],40,[0,0,-0.6]]],D);return 'ext'};
S.baba2=(lt,D,T,ls)=>{const si=siOf(lt,ls);const [bx,bz]=bathoPorch(lt,si);cams(lt,ls,BC(bx,bz).concat([BC(bx,bz)[1]]),D);return 'ext'};
S.hoiky=(lt,D,T,ls)=>{const si=siOf(lt,ls);const [bx,bz]=bathoPorch(lt,si,{h:{eyes:si>=4?1.3:1}});const c=BC(bx,bz);cams(lt,ls,[c[1],c[1],c[1],c[2],[[bx+1.6,1.2,bz+1.8],[bx,1.15,bz],24,[0,0,-0.3]]],D);return 'ext'};
S.twist=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===0)return flat2(F.be,lt,ls[1],T,{look:-1,grin:0.3});const [bx,bz]=bathoPorch(lt,si,{h:{eyes:1.3,tear:true}});const c=BC(bx,bz);cams(lt,ls,[[],c[1],c[2],c[1],c[0],[[bx+0.1,1.25,bz+2.2],[bx,1.2,bz],26]],D);return 'ext'};
S.twist2=(lt,D,T,ls)=>{innMode('day');const si=siOf(lt,ls);if(si===2)return flat2(F.vai,lt-ls[2],D-ls[2],T,'adult');lie(IL.L,0.3,1.05,0.6);put(CI.H,1.7,1.3,{baby:true,mouth:m('H',si,lt),eyes:1.2,look:-1});
 cams(lt,ls,[[[-0.8,2.0,3.2],[0.6,1.0,0.8],38],[[0.2,2.2,2.6],[0.6,1.0,0.7],34]],D);return 'inn'};
S.jump3=(lt,D,T,ls)=>flat2(F.tay,lt,D,T,'black');
// ---------- CHƯƠNG 5 ----------
const confront=(lt,si,o={})=>{innMode('night');put(CI.H,0.0,1.0,Object.assign({baby:true,mouth:m('H',si,lt),eyes:1.1},o.h||{}));put(CI.BT,1.2,1.0,Object.assign({mouth:m('BT',si,lt)},o.bt||{}))};
S.doi=(lt,D,T,ls)=>{const si=siOf(lt,ls);confront(lt,si,{bt:{eyes:si===2?1.3:1}});cams(lt,ls,[[[0.6,1.5,5],[0.6,1.2,1.0],36,[0,0,-0.6]],[[1.9,1.5,3.6],[0.0,1.45,1.0],28],[[-0.6,1.5,3.6],[1.2,1.45,1.0],28],[[1.9,1.5,3.6],[0.0,1.45,1.0],28]],D);return 'inn'};
S.doi2=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===0){confront(lt,si,{bt:{eyes:1.2}});return (cams(lt,ls,[[[0.2,1.4,2.8],[0.0,1.3,1.0],30]],D),'inn')}
 confront(lt,si,{bt:{sit:true,tear:true,arm:[-0.8,0.8]}});CI.BT.position.x=0.6;CI.BT.position.z=1.3;if(si===4)put(CI.L,-1.0,0.4,{sick:true,eyes:1.2,mouth:'o',tilt:0.1});
 cams(lt,ls,[[],[[1.6,1.1,3.4],[0.6,0.9,1.3],30],[[-0.4,1.0,3.2],[0.6,0.85,1.3],28],[[1.2,1.6,3.6],[0.3,1.0,1.1],34],[[0.6,1.5,3.6],[-1.0,1.4,0.4],30]],D);return 'inn'};
S.goi=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);if(si<=1){lie(IL.L,0.3,1.05,0.6);VONG.rotation.x=Math.sin(T*1.1)*0.05}else{put(CI.L,0.3,1.6,{sick:true,eyes:1.3,mouth:m('L',si,lt),look:1})}
 put(CI.H,1.7,1.1,{sit:true,fan:si<2,mouth:m('H',si,lt),eyes:si>=3?1.3:0.9,look:-1});
 cams(lt,ls,[[[-0.8,2.0,3.4],[0.6,0.9,0.8],38],[[-0.2,1.5,3.6],[1.2,1.0,1.0],32],[[0.4,1.5,4.2],[0.3,1.45,1.6],30,[0,0,-0.4]],[[2.0,1.5,4.0],[1.0,1.2,1.2],30],[[-0.4,1.5,3.8],[0.9,1.3,1.3],30]],D);return 'inn'};
S.goi2=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);const lz=si===0?lerp(7.5,11.3,sm(seg(lt,0,ls[1]))):si===1?lerp(12.0,14.2,sm(seg(lt,ls[1],ls[2]))):si<=3?14.2:lerp(14.2,11.6,sm(seg(lt,ls[4],ls[5])));
 const ly=lz>11.5?-Math.min(1.25,(lz-11.5)*0.6):0;put(C.L,2.0,lz,{sick:true,eyes:0.5,back:si<=1,look:0},ly);
 if(si>=1&&si<=4){put(C.R,2.2,16.6,{beckon:true,calm:si===1});ghostL.position.set(2.2,1,16.2);ghostL.intensity=3}
 if(si>=1)put(C.H,si>=4?2.5:2.6,si>=4?lz+0.3:11.4,{mouth:m('H',si,lt),eyes:1.3,arm:si>=4?[undefined,-1.4]:undefined},si>=4?ly*0.6:0);
 cams(lt,ls,[[[3.4,1.8,5.2],[2,1.0,12],40,[0,0,1.5]],[[-1,1.4,9.2],[2.2,0.9,15.5],36],[[-0.6,1.3,10.2],[2.2,0.9,16.4],30],[[4.4,1.3,10],[2.4,0.9,13.6],32],[[-0.6,1.5,9],[2.2,0.8,12.8],34],[[3.6,1.0,15.4],[2.2,0.9,16.6],34,[0,0,-0.6]]],D);return 'ext'};
S.thay3=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);VBABY.visible=true;VONG.rotation.x=Math.sin(T*1.3)*0.06;put(CI.TH,-1.0,1.4,{mouth:m('TH',si,lt),look:1});put(CI.BT,1.6,1.5,{mouth:m('BT',si,lt),arm:si===2?[-1.2,1.2]:undefined});put(CI.H,2.4,1.9,{});put(CI.L,-1.8,1.9,{sick:true});
 if(si===5)return flat2(F.be,lt-ls[5],D-ls[5],T,{grin:1.1,look:0.5,dead:true});
 cams(lt,ls,[[[0.3,1.6,5.6],[0.3,1.2,1.2],38,[0,0,-0.6]],[[0.4,1.5,4.2],[-1.0,1.45,1.4],28],[[-0.4,1.5,4.2],[1.6,1.45,1.5],28],[[0.6,1.5,4.2],[-1.0,1.45,1.4],26],[[0.4,1.5,4.2],[-1.0,1.45,1.4],26,[0,0,-0.4]]],D);return 'inn'};
S.tra=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);graves(5);const p=sm(lt/D);put(C.BT,lerp(2.6,1.2,p),lerp(-3.6,-8.2,p),{back:true,incense:true});if(si===1)put(C.H,3.6,-4.0,{baby:true,eyes:1.2,look:-1});
 cams(lt,ls,[[[6.4,1.6,-5.4],[1.6,0.9,-8.5],40,[0,0,-0.6]],[[6.0,1.5,-7.0],[3.6,1.3,-4.0],36]],D);return 'ext'};
S.tra2=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);graves(5);lightIncense('all');graveL.intensity=2;put(C.BT,0.6,-8.6,{sit:true,back:si===0,incense:si===0,mouth:m('BT',si,lt),tear:true},-0.42);
 cams(lt,ls,[[[0.6,1.4,-5.2],[0.6,0.6,-10.4],36,[0,0,-0.6]],[[2.4,1.0,-10.6],[0.6,1.0,-8.6],30],[[-0.9,1.0,-10.2],[0.6,1.0,-8.6],28]],D);return 'ext'};
const ghosts=(n,p,lead)=>{const K=['R','R2','R3','R4','R5'];for(let i=0;i<n;i++){const g=GRAVES[i];const k=K[i];put(C[k],g.x,g.z+0.6,{crouch:p<0.5,calm:i!==3,nofinger:i===3,a:0.9},-0.5*(1-p));}ghostL.position.set(0.6,1.2,-9.8);ghostL.intensity=4};
S.tra3=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);graves(5);lightIncense('all');graveL.intensity=1;put(C.BT,0.6,-8.6,{sit:true,eyes:1.3,mouth:m('BT',si,lt)},-0.42);
 if(si>=1)ghosts(5,sm(seg(lt,ls[1],ls[1]+3)));if(si>=3){C.R4.userData.o={calm:false,nofinger:true,reach:true,a:0.95};C.R4.position.set(1.0,C.R4.userData.h*0.4766,-9.4)}
 cams(lt,ls,[[[2.2,1.0,-6.6],[0.6,0.5,-10.6],34],[[0.6,1.0,-6.0],[0.6,0.5,-10.4],38,[0,0,-0.5]],[[2.8,0.9,-8.8],[1.8,0.6,-10.6],30],[[2.6,1.0,-8.2],[1.0,0.6,-9.4],30,[0,0,-0.3]],[[2.2,1.1,-7.2],[0.6,1.0,-8.6],28]],D);return 'ext'};
S.jump4=(lt,D,T,ls)=>{tod('night');graves(5);put(C.BT,0.6,-8.6,{sit:true,eyes:1.3,mouth:'o'},-0.42);const K=['R','R2','R3','R4','R5'];K.forEach((k,i)=>put(C[k],0.6+Math.cos(i*1.26)*0.55,-8.6+Math.sin(i*1.26)*0.4-0.1,{reach:true,a:0.9}));ghostL.position.set(0.6,1.2,-8.2);ghostL.intensity=5;
 cams(lt,ls,[[[0.6,1.4,-5.6],[0.6,0.8,-8.6],34,[0,0,0.6]]],D);return 'ext'};
S.tra4=(lt,D,T,ls)=>{tod('night');const si=siOf(lt,ls);graves(5);put(C.H,3.4,-5.4,{baby:true,eyes:1.3,tear:true,look:-1});
 cams(lt,ls,[[[4.2,1.5,-3.6],[3.4,1.45,-5.4],28],[[5.2,1.6,-3.2],[1,0.7,-9.4],38,[0,0,-0.8]]],D);return 'ext'};
S.sang=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===1)return flat2(F.vai,lt-ls[1],ls[2]-ls[1],T,'old');if(si===2){innMode('day');put(CI.L,0.2,1.2,{sit:true,arm:[-1.0,undefined]});put(CI.H,1.2,1.4,{baby:true});cams(lt,ls,[[],[],[[0.8,1.4,4],[0.6,1.1,1.2],34]],D);return 'inn'}
 tod('dawn');graves(5);lie(EL.BT,0.7,0.04,-9.0,0.3,0.3);put(C.NAM,-1.6,-7.6,{});put(C.G2,-2.4,-7.2,{});cams(lt,ls,[[[0.8,3.0,-6.2],[0.7,0,-9.2],44,[0,-0.4,-0.4]]],D);return 'ext'};
S.sang2=(lt,D,T,ls)=>{tod('dawn');const si=siOf(lt,ls);graves(5);lie(EL.BT,0.7,0.04,-9.0,0.3,0.3);put(C.TH,-0.6,-7.8,{mouth:m('TH',si,lt),arm:[-0.9,0.9],stick:false});
 cams(lt,ls,[[[1.6,1.8,-5.2],[0.2,0.6,-8.8],36],[[0.6,1.5,-5.6],[-0.6,1.45,-7.8],28]],D);return 'ext'};
S.ket=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===3){innMode('day');bowls(5);put(CI.H,-0.4,-1.5,{back:true});put(CI.L,0.6,-1.5,{back:true});cams(lt,ls,[[],[],[],[[0.2,1.6,1.6],[0.2,1.2,-2.8],36,[0,0,-0.5]]],D);return 'inn'}
 tod('day');put(C.H,0.0,6.0,{baby:si===0,happy:true});if(si>=1)put(C.KID,1.0,6.3,{smile:true,armA:[0.3,-0.3]});put(C.L,1.9,6.1,{});
 cams(lt,ls,[[[1,1.6,11],[0.8,1.2,6],38,[0,0,-1]],[[1.0,1.3,9.8],[1.0,0.9,6.3],38],[[-3,2.2,10.2],[0.5,1.2,5],40,[1,0,-0.6]]],D);return 'ext'};
S.ket2=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);bowls(5);altL.intensity=2;put(CI.KID,0.2,-2.0,{sit:true,back:si===0,mouth:m('BE',si,lt),look:si===2?-1:0});put(CI.H,-1.3,-0.7,{mouth:m('H',si,lt),eyes:si===3?1.3:1,look:1});lampAt(-0.6,-0.2);
 cams(lt,ls,[[[1.2,1.2,-0.3],[0.2,0.75,-2.0],38,[-0.2,0,-0.2]],[[0.6,1.5,1.6],[-1.3,1.4,-0.7],30],[[0.9,0.9,0.2],[0.2,0.75,-2.0],30],[[-2.6,1.6,1.6],[-0.5,1.0,-1.4],38]],D);return 'inn'};
S.ket3=(lt,D,T,ls)=>{innMode('night');const si=siOf(lt,ls);NET.visible=false;lie(IL.KID,-3.45,0.53,-1.4);put(CI.H,-2.2,-0.75,{sit:true,eyes:si>=2?1.3:0.9,look:-1});lampAt(-1.4,0.1);if(si>=2)put(CI.BT,-4.0,-2.6,{a:0.55,eyes:0.6});
 cams(lt,ls,[[[-1.4,2.2,1.4],[-3.1,0.6,-1.7],38],[[-2.6,1.9,0.2],[-3.4,0.6,-1.8],34,[0,0,-0.2]],[[-0.6,1.5,1.8],[-2.6,1.0,-1.2],36],[[-1.0,1.7,1.6],[-3.6,1.1,-2.3],36,[0,0,-0.4]]],D);return 'inn'};
S.final=(lt,D,T,ls)=>{const si=siOf(lt,ls);if(si===1)return flat2(F.vai,lt-ls[1],D-ls[1],T,'kid');tod('night');graves(5);lightIncense('all');graveL.intensity=2;put(C.TH,0.6,-7.6,{mouth:m('TH',si,lt),stick:false});cams(lt,ls,[[[0.6,1.5,-4.8],[0.6,1.3,-8.6],32,[0,0,-0.6]]],D);return 'ext'};
