# usage: stills.sh "t1 t2 ..." out.jpg cols
cd /home/claude/mada && rm -f still_*.jpg
VW=1920 VH=1080 ANIM=/home/claude/ep1/ep1.html node render.js stills $1 2>&1 | grep -v "^\s*at " | head -5
python3 -c "
from PIL import Image
ts='$1'.split();c=int('$3')
W=Image.new('RGB',(384*c,216*((len(ts)+c-1)//c)))
for i,t in enumerate(ts):
  t=('%g' % float(t))
  W.paste(Image.open(f'still_{t}.jpg').resize((384,216)),((i%c)*384,(i//c)*216))
W.save('$2')"
