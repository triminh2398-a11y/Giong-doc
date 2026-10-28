#!/bin/bash
# usage: watermark.sh in.mp4 out.mp4  (watermark mờ đổi vị trí mỗi 6s)
F=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
P='mod(floor(t/6),4)'
ffmpeg -y -i "$1" -vf "drawtext=fontfile=$F:text='@chuyendongtaykimco':fontsize=h*0.021:fontcolor=white@0.16:borderw=2:bordercolor=black@0.25:x='w*(if(eq($P,0),0.5,if(eq($P,1),0.72,if(eq($P,2),0.3,0.68))))-tw/2':y='h*(if(eq($P,0),0.42,if(eq($P,1),0.2,if(eq($P,2),0.75,0.6))))'" -c:v libx264 -crf 24 -preset veryfast -pix_fmt yuv420p -c:a copy "$2"
