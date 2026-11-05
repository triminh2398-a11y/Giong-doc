set -e
cd /home/claude/ep3
ffmpeg -v error -y -i voice.wav -i sfx.wav -filter_complex "[1:a]volume=0.55[s];[0:a]asplit=2[v][vk];[s][vk]sidechaincompress=threshold=0.04:ratio=5:attack=20:release=350[sd];[v][sd]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.84,loudnorm=I=-14:TP=-1.5:LRA=11[o]" -map "[o]" -ar 48000 -ac 2 mix_ln.wav
ffmpeg -v error -y -i mix_ln.wav -i jump.wav -filter_complex "[1:a]volume=1.6[j];[0:a][j]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.98[o]" -map "[o]" -c:a pcm_s16le -ar 48000 mix.wav
echo done
