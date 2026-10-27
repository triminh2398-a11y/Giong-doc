import json, os, sys, time, torch
from diffusers import StableDiffusionPipeline, LCMScheduler, DPMSolverMultistepScheduler
J = json.load(open('imggen/job.json')); SH = int(os.environ.get('SHARD', 0)); NS = int(os.environ.get('NSHARD', 1))
torch.set_num_threads(os.cpu_count())
PIPES = {}
def get(m):
    if m not in PIPES:
        p = StableDiffusionPipeline.from_pretrained(m, torch_dtype=torch.float32, safety_checker=None)
        if J.get('lcm', True):
            p.scheduler = LCMScheduler.from_config(p.scheduler.config)
            p.load_lora_weights('latent-consistency/lcm-lora-sdv1-5'); p.fuse_lora()
        else:
            p.scheduler = DPMSolverMultistepScheduler.from_config(p.scheduler.config, use_karras_sigmas=True)
        PIPES[m] = p
    return PIPES[m]
out = f"imggen/out/{J['tag']}"; os.makedirs(out, exist_ok=True)
style = J.get('style', ''); neg = J.get('neg', '')
for i, it in enumerate(J['items']):
    if i % NS != SH: continue
    name = it['id']; f = f'{out}/{name}.png'
    if os.path.exists(f): continue
    t0 = time.time()
    g = torch.Generator().manual_seed(it.get('seed', 1000 + i))
    pipe = get(it.get('model', J.get('model', 'Lykon/dreamshaper-8')))
    img = pipe(prompt=it.get('style_pre', J.get('style_pre', '')) + it['p'] + ', ' + style, negative_prompt=neg, num_inference_steps=J.get('steps', 6), guidance_scale=J.get('cfg', 1.5), width=J.get('w', 912), height=J.get('h', 512), generator=g).images[0]
    img.save(f); print(name, round(time.time() - t0, 1), flush=True)
