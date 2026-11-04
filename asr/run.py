import os,json,glob
from faster_whisper import WhisperModel
os.makedirs('asr/out',exist_ok=True)
m=WhisperModel('medium',device='cpu',compute_type='int8')
for f in sorted(glob.glob('asr/in/*.mp3')):
    o='asr/out/'+os.path.basename(f)[:-4]+'.json'
    if os.path.exists(o):continue
    segs,_=m.transcribe(f,language='vi',word_timestamps=True,vad_filter=False,beam_size=5)
    W=[[w.start,w.end,w.word] for s in segs for w in s.words]
    json.dump(W,open(o,'w'),ensure_ascii=False);print(f,len(W))
