import json, os, sys, time, torch
from diffusers import StableDiffusionPipeline, LCMScheduler
J = json.load(open('imggen/job.json')); SH = int(os.environ.get('SHARD', 0)); NS = int(os.environ.get('NSHARD', 1))
torch.set_num_threads(os.cpu_count())
pipe = StableDiffusionPipeline.from_pretrained(J.get('model', 'Lykon/dreamshaper-8'), torch_dtype=torch.float32, safety_checker=None)
pipe.scheduler = LCMScheduler.from_config(pipe.scheduler.config)
pipe.load_lora_weights('latent-consistency/lcm-lora-sdv1-5'); pipe.fuse_lora()
out = f"imggen/out/{J['tag']}"; os.makedirs(out, exist_ok=True)
style = J.get('style', ''); neg = J.get('neg', '')
for i, it in enumerate(J['items']):
    if i % NS != SH: continue
    name = it['id']; f = f'{out}/{name}.png'
    if os.path.exists(f): continue
    t0 = time.time()
    g = torch.Generator().manual_seed(it.get('seed', 1000 + i))
    img = pipe(prompt=it['p'] + ', ' + style, negative_prompt=neg, num_inference_steps=J.get('steps', 6), guidance_scale=J.get('cfg', 1.5), width=J.get('w', 912), height=J.get('h', 512), generator=g).images[0]
    img.save(f); print(name, round(time.time() - t0, 1), flush=True)
