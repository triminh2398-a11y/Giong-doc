import sys,glob,os,subprocess,numpy as np
from scipy.io import wavfile
SR=48000
def load(f):
    return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',f,'-ac','1','-ar',str(SR),'-f','s16le','-'],capture_output=True).stdout,np.int16)/32768
def trim(x):
    idx=np.where(np.abs(x)>0.01)[0];return x[max(0,idx[0]-1200):idx[-1]+2400] if len(idx) else x
def stretch_pauses(x,factor=1.5,extra=0.08):
    h=480;e=np.array([np.sqrt((x[i:i+h]**2).mean()) for i in range(0,len(x)-h,h)]);sil=20*np.log10(e+1e-9)<-38
    out=[];i=0;n=len(sil)
    while i<n:
        j=i
        if sil[i]:
            while j<n and sil[j]: j+=1
            L=j-i;seg=x[i*h:j*h]
            if 8<=L<=60 and i>0 and j<n:  # 80-600 ms internal pause (comma)
                add=int(len(seg)*(factor-1)+extra*SR);out.append(seg);out.append(np.zeros(add)*0)
            else: out.append(seg)
        else:
            while j<n and not sil[j]: j+=1
            out.append(x[i*h:j*h])
        i=j
    out.append(x[n*h:]);return np.concatenate(out)
def slow(x,tempo):
    wavfile.write('/tmp/_s.wav',SR,(x*32767).astype(np.int16))
    y=subprocess.run(['ffmpeg','-v','error','-i','/tmp/_s.wav','-af',f'rubberband=tempo={tempo}:pitchq=quality:transients=smooth:formant=preserved','-f','s16le','-'],capture_output=True).stdout
    return np.frombuffer(y,np.int16)/32768
def process_sentences(files,tempo=0.93,gap=0.6):
    parts=[slow(stretch_pauses(trim(load(f))),tempo) for f in files]
    g=np.zeros(int(gap*SR));return parts,np.concatenate(sum([[p,g] for p in parts],[]))
if __name__=='__main__':
    jobdir,outdir=sys.argv[1],sys.argv[2];os.makedirs(outdir,exist_ok=True)
    for vd in sorted(glob.glob(jobdir+'/*/')):
        fs=sorted(glob.glob(vd+'*.wav'))
        if not fs: continue
        _,x=process_sentences(fs);name=os.path.basename(vd.rstrip('/'))
        wavfile.write('/tmp/_v.wav',SR,(x/np.abs(x).max()*0.9*32767).astype(np.int16))
        subprocess.run(['ffmpeg','-y','-v','error','-i','/tmp/_v.wav','-af','bass=g=1.5:f=200,aecho=0.85:0.5:60|110:0.10|0.06,loudnorm=I=-16','-b:a','160k',f'{outdir}/{name}.mp3'],check=True)
        print(name,round(len(x)/SR,1))
