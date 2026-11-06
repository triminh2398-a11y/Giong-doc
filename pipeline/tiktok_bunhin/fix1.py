s=open('scenes_head.js').read()
R=[("cm([lerp(-2.5,0.5,p),2.0,9.5],[lerp(-4,-0.5,p),0.9,2.6],46)","cm([lerp(-3.2,-0.4,p),1.7,6.6],[lerp(-4.4,-1.0,p),0.95,2.7],44)"),
("cm([BP[0][0]-1.6,1.7,BP[0][1]-4.6],[BP[0][0]-1.0,1.0,BP[0][1]-0.4],44)","cm([BP[0][0]-2.4,1.6,BP[0][1]-5.4],[BP[0][0]-1.6,1.0,BP[0][1]-0.6],46)"),
("put(C.hanh,-1.0,2.1,{eyes:1.2,T});const p=sm(lt/D);\n cm([-1.6,1.75,lerp(0.9,1.3,p)],[BP[1][0],1.1,BP[1][1]],lerp(46,40,p))","put(C.hanh,-0.6,2.6,{eyes:1.2,back:true,T});const p=sm(lt/D);\n cm([-1.6,1.75,lerp(1.85,2.1,p)],[BP[1][0],1.1,BP[1][1]],lerp(46,40,p))"),
("if(k<3){cm([-0.8,1.9,1.2],[2.6,1.0,6],44);return 'ext'}put(C.tam,0.4,2.3,{pale:true,eyes:0.7,T});cm([-1.2,1.7,0.6],[1.4,1.0,3.4],44)","if(k<3){cm([-1.4,2.0,2.2],[2.6,1.0,6],44);return 'ext'}put(C.tam,0.6,2.4,{pale:true,eyes:0.7,T});cm([-1.4,1.7,1.9],[1.6,1.0,3.6],44)"),
("cm([BED.position.x+0.3,1.6,BED.position.z+1.6],[BED.position.x,0.7,BED.position.z-0.6],44);return 'inn'};\nS.call","cm([BED.position.x+0.3,1.75,BED.position.z+2.0],[BED.position.x,1.0,BED.position.z-0.6],44);return 'inn'};\nS.call"),
("if(lt<D*0.45){cm([BED.position.x+0.3,1.6,BED.position.z+1.6],[BED.position.x,0.7,BED.position.z-0.6],44)","if(lt<D*0.45){cm([BED.position.x+0.3,1.75,BED.position.z+2.0],[BED.position.x,1.0,BED.position.z-0.6],44)"),
("const c=C.tam;cm([c.position.x+0.15,1.65,c.position.z+1.15],[c.position.x-0.15,1.25,c.position.z],38)","const c=C.tam;cm([c.position.x+0.25,1.55,c.position.z+1.7],[c.position.x-0.1,1.25,c.position.z],38)"),
("cm([lerp(1.5,-3,p),1.8,7.2],[lerp(-0.5,-5,p),1.0,2.5],44)","cm([lerp(1.0,-3.6,p),1.7,6.4],[lerp(-0.5,-5.6,p),1.0,2.5],44)"),
("cm([1.0,1.5,1.2],[2.4,1.0,3.9],44)","cm([1.2,1.55,1.85],[2.4,1.0,3.9],44)"),
("bnAt(BP[0],{shirt:HANH_SHIRT});if(lt<D*0.35)","bnAt(BP[0],{shirt:HANH_SHIRT});eLight(BP[0][0],BP[0][1],1.6);if(lt<D*0.35)"),
]
for a,b in R:
    assert a in s,a[:50];s=s.replace(a,b)
open('scenes_head.js','w').write(s)
