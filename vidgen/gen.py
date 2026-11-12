import json, os, gc, time, torch
from PIL import Image
from diffusers import LTXImageToVideoPipeline
from diffusers.utils import export_to_video
from transformers import T5EncoderModel, T5TokenizerFast
J = json.load(open('vidgen/job.json')); SH = int(os.environ.get('SHARD', 0)); NS = int(os.environ.get('NSHARD', 1))
torch.set_num_threads(os.cpu_count()); M = J.get('model', 'Lightricks/LTX-Video'); dt = torch.bfloat16
items = [it for i, it in enumerate(J['items']) if i % NS == SH]
neg = J.get('neg', 'worst quality, inconsistent motion, blurry, jittery, distorted, deformed face')
tok = T5TokenizerFast.from_pretrained(M, subfolder='tokenizer')
te = T5EncoderModel.from_pretrained(M, subfolder='text_encoder', torch_dtype=dt)
def enc(p):
    t = tok(p, padding='max_length', max_length=128, truncation=True, return_tensors='pt')
    with torch.no_grad(): e = te(t.input_ids)[0]
    return e, t.attention_mask
E = {it['id']: (enc(it['p']), enc(neg)) for it in items}
del te; gc.collect()
pipe = LTXImageToVideoPipeline.from_pretrained(M, text_encoder=None, tokenizer=None, torch_dtype=dt)
os.makedirs(f"vidgen/out/{J['tag']}", exist_ok=True)
for it in items:
    t0 = time.time(); (pe, pm), (ne, nm) = E[it['id']]
    v = pipe(image=Image.open('vidgen/' + it['img']).convert('RGB'), prompt_embeds=pe, prompt_attention_mask=pm, negative_prompt_embeds=ne, negative_prompt_attention_mask=nm,
             width=J.get('w', 480), height=J.get('h', 832), num_frames=J.get('frames', 97), num_inference_steps=J.get('steps', 20), guidance_scale=J.get('cfg', 3.0),
             generator=torch.Generator().manual_seed(it.get('seed', 0))).frames[0]
    export_to_video(v, f"vidgen/out/{J['tag']}/{it['id']}.mp4", fps=24); print(it['id'], round(time.time() - t0), flush=True)
