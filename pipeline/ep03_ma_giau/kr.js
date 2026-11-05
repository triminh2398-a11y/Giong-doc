function khanRan(w,h){const c=document.createElement('canvas');c.width=64;c.height=64;const g=c.getContext('2d');g.fillStyle='#e8e2d2';g.fillRect(0,0,64,64);g.fillStyle='#1a1a1e';for(let i=0;i<4;i++)for(let j=0;j<4;j++)if((i+j)%2===0)g.fillRect(i*16,j*16,16,16);g.fillStyle='rgba(26,26,30,.5)';for(let i=0;i<4;i++){g.fillRect(i*16+6,0,4,64);g.fillRect(0,i*16+6,64,4)}return c}
const KR=khanRan();let KRP=null;
function krFill(){if(!KRP||KRP._ctx!==ctx){KRP=ctx.createPattern(KR,'repeat');KRP._ctx=ctx}return KRP}
