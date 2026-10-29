import json,sys,os
from PIL import Image,ImageDraw,ImageFont
T=json.load(open('tl.json'));S=[l.rstrip('\n').split('|',2) for l in open('/home/claude/giong-doc/pipeline/ep02_con_ranh/script.txt') if l.strip()]
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',13)
a,b=int(sys.argv[1]),int(sys.argv[2]);pre=sys.argv[3] if len(sys.argv)>3 else 'f'
idx=list(range(a,min(b,len(S))));cols=4;tw,th=426,240;rows=(len(idx)+cols-1)//cols
W=Image.new('RGB',(cols*tw,rows*(th+34)),'white');d=ImageDraw.Draw(W)
for n,i in enumerate(idx):
    f=f'st/{pre}_{T["starts"][i]+0.5:.2f}.jpg'
    x,y=(n%cols)*tw,(n//cols)*(th+34)
    if os.path.exists(f):W.paste(Image.open(f).resize((tw,th)),(x,y))
    t=f'{i} {S[i][0]} {S[i][1]}: {S[i][2]}';d.text((x+2,y+th+1),t[:58],fill='black',font=F);d.text((x+2,y+th+16),t[58:116],fill='black',font=F)
W.save(f'st/sheet_{a}.jpg',quality=80)
