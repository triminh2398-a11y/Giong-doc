# Con Số Trên Đầu - Roblox-style story short, built entirely in Blender from code.
# usage: python3 build.py stills OUT [scale]     -> mid-shot stills (50%, 12 spp)
#        python3 build.py frames OUT A B         -> full frames A..B-1 (1080x1920, 32 spp)
import bpy, bmesh, math, os, sys, json, random
from mathutils import Vector, Euler
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
FPS = 30
TJ = json.load(open(os.path.join(HERE, 'timing.json')))
WORDS = TJ['words']
END = TJ['END']; LINES = TJ['lines']  # per line: [start, end, first word index]
def W(i): return WORDS[i][0]
D2R = math.pi / 180

# ---------------------------------------------------------------- colours
def lin(h):
    h = h.lstrip('#'); c = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    return tuple((x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c)
def lin4(h): return lin(h) + (1.0,)

# ---------------------------------------------------------------- scene
bpy.ops.wm.read_factory_settings(use_empty=True)
S = bpy.context.scene
engines = [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items]
S.render.engine = 'BLENDER_EEVEE' if 'BLENDER_EEVEE' in engines else 'BLENDER_EEVEE_NEXT'
S.render.fps = FPS
S.render.resolution_x, S.render.resolution_y = 1080, 1920
S.render.use_motion_blur = False
S.view_settings.view_transform = 'Standard'
S.view_settings.look = 'None'
S.view_settings.exposure = 0
S.view_settings.gamma = 1
E = S.eevee
for k, v in (('use_shadows', True), ('use_raytracing', True), ('taa_render_samples', 32)):
    try: setattr(E, k, v)
    except Exception: pass
try: E.ray_tracing_options.resolution_scale = '2'
except Exception: pass
COL = S.collection

def link(o, parent=None):
    COL.objects.link(o)
    if parent is not None: o.parent = parent
    return o

def empty(name, loc=(0, 0, 0), parent=None):
    o = bpy.data.objects.new(name, None); o.location = loc
    return link(o, parent)

# ---------------------------------------------------------------- materials
MATS = {}
def mat(name, hexc, rough=0.85, emit=None, strength=0.0):
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = lin4(hexc)
    p.inputs['Roughness'].default_value = rough
    if 'Specular IOR Level' in p.inputs: p.inputs['Specular IOR Level'].default_value = 0.2
    if emit:
        p.inputs['Emission Color'].default_value = lin4(emit)
        p.inputs['Emission Strength'].default_value = strength
    MATS[name] = m
    return m
def set_emit(m, s):
    m.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = s

WETMATS = []
def noise_mat(name, h1, h2, scale, rough=0.9):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; p = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); nz = nt.nodes.new('ShaderNodeTexNoise')
    nz.inputs['Scale'].default_value = scale; nz.inputs['Detail'].default_value = 2
    cr = nt.nodes.new('ShaderNodeValToRGB')
    cr.color_ramp.elements[0].position = 0.4; cr.color_ramp.elements[0].color = lin4(h1)
    cr.color_ramp.elements[1].position = 0.6; cr.color_ramp.elements[1].color = lin4(h2)
    nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
    nt.links.new(nz.outputs['Fac'], cr.inputs['Fac'])
    nt.links.new(cr.outputs['Color'], p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = rough
    if 'Specular IOR Level' in p.inputs: p.inputs['Specular IOR Level'].default_value = 0.15
    WETMATS.append((p, rough))
    return m

# ---------------------------------------------------------------- meshes
def box(name, size, center=(0, 0, 0), m=None, parent=None, loc=(0, 0, 0), rot=(0, 0, 0)):
    sx, sy, sz = [s / 2 for s in size]; cx, cy, cz = center
    v = [(cx + x * sx, cy + y * sy, cz + z * sz) for x in (-1, 1) for y in (-1, 1) for z in (-1, 1)]
    f = [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]
    me = bpy.data.meshes.new(name); me.from_pydata(v, [], f); me.update()
    o = bpy.data.objects.new(name, me); o.location = loc; o.rotation_euler = rot
    if m: me.materials.append(m)
    return link(o, parent)

def lathe(name, R, H, b, m=None, parent=None, loc=(0, 0, 0), N=64, face_w=None, face_h=None, zc=None, sq=2.0):
    prof = [(0.0, 0.0)]
    for k in range(5):
        a = -math.pi / 2 + k * (math.pi / 2) / 4
        prof.append((R - b + b * math.cos(a), b + b * math.sin(a)))
    for k in range(5):
        a = k * (math.pi / 2) / 4
        prof.append((R - b + b * math.cos(a), H - b + b * math.sin(a)))
    prof.append((0.0, H))
    bm = bmesh.new(); uvl = bm.loops.layers.uv.new()
    rings = []
    for j in range(N):
        ph = 2 * math.pi * j / N - math.pi
        k_ = 1.0 / ((abs(math.cos(ph)) ** sq + abs(math.sin(ph)) ** sq) ** (1.0 / sq))
        rings.append([bm.verts.new((r * k_ * math.sin(ph), -r * k_ * math.cos(ph), z)) for r, z in prof])
    phis = [2 * math.pi * j / N - math.pi for j in range(N)]
    fw = face_w or (2 * math.pi * R * 130 / 360); fh = face_h or fw * 578 / 1024
    zc = zc if zc is not None else H / 2
    span = 130 * D2R
    for j in range(N):
        j2 = (j + 1) % N
        for i in range(len(prof) - 1):
            vs = [rings[j][i], rings[j2][i], rings[j2][i + 1], rings[j][i + 1]]
            try: f = bm.faces.new(vs)
            except ValueError: continue
            for lp in f.loops:
                vv = lp.vert.co
                ph = math.atan2(vv.x, -vv.y)
                if j2 == 0 and abs(ph + math.pi) < 1e-6: ph = math.pi
                lp[uvl].uv = (0.5 + ph / span, 0.5 + (vv.z - zc) / fh)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    o = bpy.data.objects.new(name, me); o.location = loc
    if m: me.materials.append(m)
    return link(o, parent)

def cyl(name, r, h, m=None, parent=None, loc=(0, 0, 0), rot=(0, 0, 0), n=24, center=True):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=n, radius1=r, radius2=r, depth=h)
    if not center: bmesh.ops.translate(bm, verts=bm.verts, vec=(0, 0, h / 2))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); o.location = loc; o.rotation_euler = rot
    if m: me.materials.append(m)
    return link(o, parent)

def sphere(name, r, m=None, parent=None, loc=(0, 0, 0)):
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=24, v_segments=12, radius=r)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    o = bpy.data.objects.new(name, me); o.location = loc
    if m: me.materials.append(m)
    return link(o, parent)

def light(name, kind, energy, hexc, parent=None, loc=(0, 0, 0), rot=(0, 0, 0), shadow=True, **kw):
    L = bpy.data.lights.new(name, kind); L.energy = energy; L.color = lin(hexc)
    L.use_shadow = shadow
    for k, v in kw.items(): setattr(L, k, v)
    o = bpy.data.objects.new(name, L); o.location = loc; o.rotation_euler = rot
    return link(o, parent)

# ---------------------------------------------------------------- world
WORLD = bpy.data.worlds.new('W'); S.world = WORLD; WORLD.use_nodes = True
wn = WORLD.node_tree; bg = wn.nodes['Background']
tc = wn.nodes.new('ShaderNodeTexCoord'); sep = wn.nodes.new('ShaderNodeSeparateXYZ')
wn.links.new(tc.outputs['Generated'], sep.inputs['Vector'])
mr = wn.nodes.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = 0.0; mr.inputs['From Max'].default_value = 0.7
wn.links.new(sep.outputs['Z'], mr.inputs['Value'])
ramp = wn.nodes.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].color = lin4('#212B54'); ramp.color_ramp.elements[1].color = lin4('#060917'); RAMP = ramp.color_ramp.elements
wn.links.new(mr.outputs['Result'], ramp.inputs['Fac'])
vor = wn.nodes.new('ShaderNodeTexVoronoi'); vor.inputs['Scale'].default_value = 160
wn.links.new(tc.outputs['Generated'], vor.inputs['Vector'])
st = wn.nodes.new('ShaderNodeMapRange'); st.inputs['From Min'].default_value = 0.06; st.inputs['From Max'].default_value = 0.0
wn.links.new(vor.outputs['Distance'], st.inputs['Value'])
tw = wn.nodes.new('ShaderNodeTexNoise'); tw.noise_dimensions = '4D'; tw.inputs['Scale'].default_value = 40
wn.links.new(tc.outputs['Generated'], tw.inputs['Vector'])
TWINKLE = tw.inputs['W']
twm = wn.nodes.new('ShaderNodeMapRange'); twm.inputs['From Min'].default_value = 0.45; twm.inputs['From Max'].default_value = 0.6
wn.links.new(tw.outputs['Fac'], twm.inputs['Value'])
up = wn.nodes.new('ShaderNodeMapRange'); up.inputs['From Min'].default_value = 0.03; up.inputs['From Max'].default_value = 0.2
wn.links.new(sep.outputs['Z'], up.inputs['Value'])
m1 = wn.nodes.new('ShaderNodeMath'); m1.operation = 'MULTIPLY'
m2 = wn.nodes.new('ShaderNodeMath'); m2.operation = 'MULTIPLY'
m3 = wn.nodes.new('ShaderNodeMath'); m3.operation = 'MULTIPLY'; m3.inputs[1].default_value = 1.6
STARG = m3.inputs[1]
wn.links.new(st.outputs['Result'], m1.inputs[0]); wn.links.new(twm.outputs['Result'], m1.inputs[1])
wn.links.new(m1.outputs[0], m2.inputs[0]); wn.links.new(up.outputs['Result'], m2.inputs[1])
wn.links.new(m2.outputs[0], m3.inputs[0])
add = wn.nodes.new('ShaderNodeMix'); add.data_type = 'RGBA'; add.blend_type = 'ADD'
add.inputs['Factor'].default_value = 1.0
wn.links.new(ramp.outputs['Color'], add.inputs[6]); wn.links.new(m3.outputs[0], add.inputs[7])
wn.links.new(add.outputs[2], bg.inputs['Color'])
SKY = bg.inputs['Strength']
# puffy clouds for the daytime sky
cn = wn.nodes.new('ShaderNodeTexNoise'); cn.inputs['Scale'].default_value = 3.5; cn.inputs['Detail'].default_value = 4; cn.inputs['Roughness'].default_value = 0.55
vm = wn.nodes.new('ShaderNodeVectorMath'); vm.operation = 'MULTIPLY'; vm.inputs[1].default_value = (1.0, 1.0, 3.0)
wn.links.new(tc.outputs['Generated'], vm.inputs[0]); wn.links.new(vm.outputs[0], cn.inputs['Vector'])
cr_ = wn.nodes.new('ShaderNodeMapRange'); cr_.inputs['From Min'].default_value = 0.52; cr_.inputs['From Max'].default_value = 0.66
wn.links.new(cn.outputs['Fac'], cr_.inputs['Value'])
hz_ = wn.nodes.new('ShaderNodeMapRange'); hz_.inputs['From Min'].default_value = 0.02; hz_.inputs['From Max'].default_value = 0.25
wn.links.new(sep.outputs['Z'], hz_.inputs['Value'])
cm1 = wn.nodes.new('ShaderNodeMath'); cm1.operation = 'MULTIPLY'; wn.links.new(cr_.outputs['Result'], cm1.inputs[0]); wn.links.new(hz_.outputs['Result'], cm1.inputs[1])
cm2 = wn.nodes.new('ShaderNodeMath'); cm2.operation = 'MULTIPLY'; wn.links.new(cm1.outputs[0], cm2.inputs[0]); cm2.inputs[1].default_value = 0.0
CLOUDK = cm2.inputs[1]
cmix = wn.nodes.new('ShaderNodeMix'); cmix.data_type = 'RGBA'; cmix.inputs[7].default_value = lin4('#F6F8FF')
wn.links.new(add.outputs[2], cmix.inputs[6]); wn.links.new(cm2.outputs[0], cmix.inputs['Factor'])
wn.links.new(cmix.outputs[2], bg.inputs['Color'])

MOON = light('moon', 'SUN', 0.55, '#9EB8FF', rot=(52 * D2R, 0, -35 * D2R), angle=0.6 * D2R)

# ---------------------------------------------------------------- faces
FDIR = os.path.join(HERE, 'faces'); os.makedirs(FDIR, exist_ok=True)
def face_img(kind):
    im = Image.new('RGBA', (1024, 578), (0, 0, 0, 0)); d = ImageDraw.Draw(im); K = (0, 0, 0, 255)
    L, R = 412, 612
    def eyes(h=64, w=42, y=270):
        for x in (L, R):
            d.ellipse((x - w / 2, y - h / 2, x + w / 2, y + h / 2), fill=K)
            d.ellipse((x - w / 2 + 6, y - h / 2 + 8, x - w / 2 + 20, y - h / 2 + 22), fill=(255, 255, 255, 255))
    def brows(dl, dr, y=200, wdt=16):  # dl: inner-end offset (neg = raised)
        d.line((L - 50, y, L + 40, y + dl), fill=K, width=wdt); d.line((R + 50, y, R - 40, y + dr), fill=K, width=wdt)
    if kind == 'smile':
        eyes(); d.arc((430, 300, 594, 430), 20, 160, fill=K, width=18)
    elif kind == 'stern':
        eyes(); brows(0, 0, 205, 14); d.line((462, 400, 562, 400), fill=K, width=18)
    elif kind == 'angry':
        eyes(44); brows(34, 34, 195, 20); d.arc((452, 385, 572, 470), 200, 340, fill=K, width=18)
    elif kind == 'determined':
        eyes(46); brows(26, 26, 200, 18); d.line((455, 405, 570, 392), fill=K, width=18)
    elif kind == 'worried':
        eyes(); brows(-24, -24, 205, 14); d.arc((462, 392, 562, 450), 200, 340, fill=K, width=16)
    elif kind == 'scared':
        eyes(70, 40); brows(-34, -34, 192, 14)
        d.line([(452, 410), (477, 395), (502, 410), (527, 395), (552, 410), (572, 398)], fill=K, width=12)
    elif kind == 'panic':
        for x in (L, R): d.ellipse((x - 36, 232, x + 36, 316), outline=K, width=14)
        brows(-36, -36, 180, 14); d.ellipse((462, 360, 562, 480), fill=K)
    elif kind == 'shock':
        for x in (L - 10, R + 10): d.ellipse((x - 15, 255, x + 15, 285), fill=K)
        d.arc((L - 60, 170, L + 50, 230), 200, 330, fill=K, width=14); d.arc((R - 50, 170, R + 60, 230), 210, 340, fill=K, width=14)
        d.ellipse((485, 370, 539, 450), fill=K)
    elif kind == 'cry':
        eyes(); brows(-26, -26, 205, 14); d.arc((462, 392, 562, 450), 200, 340, fill=K, width=16)
        for x in (L, R): d.line((x, 300, x - 4, 380), fill=K, width=8)
    elif kind == 'laugh':
        for x in (L, R): d.arc((x - 34, 240, x + 34, 300), 200, 340, fill=K, width=14)
        d.chord((440, 330, 584, 470), 0, 180, fill=K)
        d.chord((470, 400, 554, 462), 0, 180, fill=(220, 60, 60, 255))
    elif kind == 'happy':
        for x in (L, R): d.arc((x - 34, 240, x + 34, 300), 200, 340, fill=K, width=14)
        d.arc((430, 300, 594, 430), 20, 160, fill=K, width=18)
    elif kind == 'smug':
        for x in (L, R):
            d.ellipse((x - 21, 238, x + 21, 302), fill=K); d.rectangle((x - 30, 225, x + 30, 262), fill=(0, 0, 0, 0))
            d.line((x - 30, 262, x + 30, 262), fill=K, width=12)
        brows(18, -10, 205, 14); d.arc((470, 330, 600, 420), 20, 120, fill=K, width=16)
    elif kind == 'talk':
        eyes(); d.ellipse((472, 370, 552, 450), fill=K)
    elif kind == 'shout':
        eyes(50); brows(30, 30, 195, 18); d.chord((432, 340, 592, 490), 0, 180, fill=K); d.rectangle((440, 340, 584, 415), fill=K)
    elif kind == 'sleep':
        for x in (L, R): d.arc((x - 34, 250, x + 34, 300), 20, 160, fill=K, width=12)
        d.arc((480, 380, 544, 420), 20, 160, fill=K, width=12)
    elif kind == 'sad':
        eyes(); brows(-20, -20, 210, 14); d.arc((462, 392, 562, 450), 200, 340, fill=K, width=16)
    elif kind == 'monster':
        W_ = (255, 255, 255, 255)
        d.ellipse((150, 10, 874, 570), fill=W_)
        for sgn in (-1, 1):
            cx, cy = 512 + sgn * 150, 210
            pts = []
            for k in range(24):
                a = 2 * math.pi * k / 24
                x, y = 78 * math.cos(a), 34 * math.sin(a) * (1.3 if math.sin(a) > 0 else 0.8)
                ang = sgn * 22 * D2R
                pts.append((cx + x * math.cos(ang) - y * math.sin(ang), cy + x * math.sin(ang) + y * math.cos(ang)))
            d.polygon(pts, fill=K)
        top = [(512 + x, 350 + 0.00028 * x * x * x * x / 1e3 * 0 - 60 * (1 - (x / 330) ** 2) * 0 + 100 * (x / 330) ** 2 * -1) for x in range(-330, 331, 10)]
        top = [(512 + x, 330 - 95 * (x / 330) ** 2) for x in range(-330, 331, 10)]
        bot = [(512 + x, 330 + 120 * (1 - (x / 330) ** 2) - 95 * (x / 330) ** 2) for x in range(330, -331, -10)]
        d.polygon(top + bot, fill=K)
        for k, x in enumerate(range(-290, 291, 46)):
            yt = 330 - 95 * (x / 330) ** 2
            d.rectangle((512 + x - 15, yt + 6, 512 + x + 15, yt + 52), fill=W_)
            yb = 330 + 120 * (1 - (x / 330) ** 2) - 95 * (x / 330) ** 2
            if abs(x) < 260: d.rectangle((512 + x + 8, yb - 46, 512 + x + 34, yb - 6), fill=W_)
    p = os.path.join(FDIR, kind + '.png'); im.save(p); return p

SKIN = '#F5CD30'
FACES = ['smile', 'stern', 'angry', 'determined', 'worried', 'scared', 'panic', 'shock', 'cry', 'laugh', 'happy', 'smug', 'talk', 'shout', 'sleep', 'sad']
FMAT = {}
for k in FACES:
    m = bpy.data.materials.new('face_' + k); m.use_nodes = True; nt = m.node_tree; p = nt.nodes['Principled BSDF']
    it = nt.nodes.new('ShaderNodeTexImage'); it.image = bpy.data.images.load(face_img(k)); it.extension = 'CLIP'
    it.interpolation = 'Closest'
    mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'
    mx.inputs[6].default_value = lin4(SKIN)
    nt.links.new(it.outputs['Alpha'], mx.inputs['Factor']); nt.links.new(it.outputs['Color'], mx.inputs[7])
    nt.links.new(mx.outputs[2], p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = 0.75
    if 'Specular IOR Level' in p.inputs: p.inputs['Specular IOR Level'].default_value = 0.2
    FMAT[k] = m

def beam_cone(name, length, half_deg, parent, loc=(0, 0, 0), rot=(0, 0, 0), strength=0.10, color='#FFD9A0'):
    bmc = bpy.data.materials.new(name + '_m'); bmc.use_nodes = True; nt_ = bmc.node_tree
    for n in list(nt_.nodes):
        if n.type != 'OUTPUT_MATERIAL': nt_.nodes.remove(n)
    tr_ = nt_.nodes.new('ShaderNodeBsdfTransparent'); be_ = nt_.nodes.new('ShaderNodeEmission')
    be_.inputs['Color'].default_value = lin4(color); be_.inputs['Strength'].default_value = strength
    lw = nt_.nodes.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = 0.35
    inv = nt_.nodes.new('ShaderNodeMath'); inv.operation = 'MULTIPLY'; inv.inputs[1].default_value = 0.09
    one = nt_.nodes.new('ShaderNodeMath'); one.operation = 'SUBTRACT'; one.inputs[0].default_value = 1.0
    nt_.links.new(lw.outputs['Facing'], one.inputs[1]); nt_.links.new(one.outputs[0], inv.inputs[0])
    ms_ = nt_.nodes.new('ShaderNodeMixShader')
    nt_.links.new(inv.outputs[0], ms_.inputs[0]); nt_.links.new(tr_.outputs[0], ms_.inputs[1]); nt_.links.new(be_.outputs[0], ms_.inputs[2])
    nt_.links.new(ms_.outputs[0], nt_.nodes['Material Output'].inputs['Surface'])
    try: bmc.surface_render_method = 'BLENDED'
    except Exception: bmc.blend_method = 'BLEND'
    b_ = bmesh.new(); bmesh.ops.create_cone(b_, cap_ends=False, segments=32, radius1=0.15, radius2=length * math.tan(half_deg * D2R), depth=length)
    bmesh.ops.translate(b_, verts=b_.verts, vec=(0, 0, -length / 2))
    me_ = bpy.data.meshes.new(name); b_.to_mesh(me_); b_.free(); me_.materials.append(bmc)
    o_ = bpy.data.objects.new(name, me_); o_.location = loc; o_.rotation_euler = rot
    try: o_.visible_shadow = False
    except Exception: pass
    return link(o_, parent)

pole_m = mat('pole', '#3C3F46', 0.5); frame_m = mat('frame', '#F4F1E8', 0.7); door_m = mat('door', '#6B3E22', 0.8)
black_m = mat('void', '#000000', 1.0)
# ---------------------------------------------------------------- city (inserted into build.py)
def node_math(nt, op, a=None, b=None):
    n = nt.nodes.new('ShaderNodeMath'); n.operation = op
    for i, v in enumerate((a, b)):
        if v is None: continue
        if isinstance(v, (int, float)): n.inputs[i].default_value = v
        else: nt.links.new(v, n.inputs[i])
    return n.outputs[0]

def tile_mat(name, c1, c2, mortar, scale, mortar_size=0.02, rough=0.7):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; p = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); br = nt.nodes.new('ShaderNodeTexBrick')
    br.offset = 0.0; br.squash = 1.0
    br.inputs['Color1'].default_value = lin4(c1); br.inputs['Color2'].default_value = lin4(c2)
    br.inputs['Mortar'].default_value = lin4(mortar); br.inputs['Scale'].default_value = scale
    br.inputs['Mortar Size'].default_value = mortar_size; br.inputs['Brick Width'].default_value = 1.0; br.inputs['Row Height'].default_value = 1.0
    nt.links.new(tc.outputs['Object'], br.inputs['Vector']); nt.links.new(br.outputs['Color'], p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = rough
    if 'Specular IOR Level' in p.inputs: p.inputs['Specular IOR Level'].default_value = 0.15
    WETMATS.append((p, rough))
    return m

# ---- ground
asph = noise_mat('asph', '#2A2A30', '#34343A', 6, 0.8)
walk_m = tile_mat('walk', '#B9B4AA', '#AFAAA0', '#8C877E', 0.55)
plaza_m = tile_mat('plazat', '#E6E0D4', '#DCD5C7', '#A8A196', 0.22, 0.012, 0.6)
grass = noise_mat('grass', '#5DBB3A', '#6CCB45', 1.4, 0.9)
GRASS_P = WETMATS[-1][0]
box('ground', (900, 900, 0.2), (0, 0, -0.12), asph)
box('road', (900, 14, 0.1), (0, 0, -0.02), asph)
for sy in (1, -1):
    box('walk', (900, 5.2, 0.32), (0, sy * 9.6, 0.0), walk_m)
    box('curb', (900, 0.3, 0.36), (0, sy * 7.05, 0.0), mat('curb', '#9A968E', 0.6))
wline = mat('wline', '#F2F2F2', 0.6); yline = mat('yline', '#FAC726', 0.6)
for x in range(-300, 301, 8): box('dash', (4, 0.3, 0.06), (x, 3.5, 0.04), wline); box('dash', (4, 0.3, 0.06), (x, -3.5, 0.04), wline)
box('yl', (900, 0.25, 0.06), (0, 0.18, 0.04), yline); box('yl', (900, 0.25, 0.06), (0, -0.18, 0.04), yline)
for cx_ in (-46, 46, -150, 150):
    for k in range(-6, 7): box('zebra', (5.5, 0.9, 0.06), (cx_, k * 1.05, 0.05), wline)
    box('xroad', (13, 900, 0.1), (cx_, 0, -0.03), asph) if abs(cx_) == 150 else None

# ---- building facades: windows from object-space coords, wall colour from the object colour
fac = bpy.data.materials.new('facade'); fac.use_nodes = True; nt = fac.node_tree; pB = nt.nodes['Principled BSDF']
tcs = nt.nodes.new('ShaderNodeTexCoord'); sp = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tcs.outputs['Object'], sp.inputs['Vector'])
oi = nt.nodes.new('ShaderNodeObjectInfo')
M = lambda op, a=None, b=None: node_math(nt, op, a, b)
hcoord = M('MULTIPLY', M('ADD', sp.outputs['X'], sp.outputs['Y']), 1 / 3.0)
vcoord = M('MULTIPLY', M('SUBTRACT', sp.outputs['Z'], 4.6), 1 / 3.4)
fu = M('FRACT', hcoord); fv = M('FRACT', vcoord)
winu = M('MULTIPLY', M('GREATER_THAN', fu, 0.22), M('LESS_THAN', fu, 0.78))
winv = M('MULTIPLY', M('GREATER_THAN', fv, 0.26), M('LESS_THAN', fv, 0.84))
upper = M('GREATER_THAN', sp.outputs['Z'], 4.8)
# frame band around each window
fru = M('MULTIPLY', M('GREATER_THAN', fu, 0.17), M('LESS_THAN', fu, 0.83))
frv = M('MULTIPLY', M('GREATER_THAN', fv, 0.20), M('LESS_THAN', fv, 0.90))
win = M('MULTIPLY', M('MULTIPLY', winu, winv), upper)
frame = M('MULTIPLY', M('SUBTRACT', M('MULTIPLY', fru, frv), M('MULTIPLY', winu, winv)), upper)
cell = nt.nodes.new('ShaderNodeCombineXYZ')
nt.links.new(M('FLOOR', hcoord), cell.inputs['X']); nt.links.new(M('FLOOR', vcoord), cell.inputs['Y'])
nt.links.new(M('MULTIPLY', oi.outputs['Random'], 97.0), cell.inputs['Z'])
wn_ = nt.nodes.new('ShaderNodeTexWhiteNoise'); wn_.noise_dimensions = '3D'; nt.links.new(cell.outputs[0], wn_.inputs['Vector'])
litw = M('MULTIPLY', M('GREATER_THAN', wn_.outputs['Value'], 0.45), win)
# shop floor: one big glass band
shop = M('MULTIPLY', M('MULTIPLY', M('LESS_THAN', sp.outputs['Z'], 3.6), M('GREATER_THAN', sp.outputs['Z'], 0.5)), M('MULTIPLY', M('GREATER_THAN', fu, 0.1), M('LESS_THAN', fu, 0.9)))
glass = M('MAXIMUM', win, shop)
c1 = nt.nodes.new('ShaderNodeMix'); c1.data_type = 'RGBA'
nt.links.new(oi.outputs['Color'], c1.inputs[6]); c1.inputs[7].default_value = lin4('#F4F1E8'); nt.links.new(frame, c1.inputs['Factor'])
c2 = nt.nodes.new('ShaderNodeMix'); c2.data_type = 'RGBA'
nt.links.new(c1.outputs[2], c2.inputs[6]); c2.inputs[7].default_value = lin4('#1C2638'); nt.links.new(glass, c2.inputs['Factor'])
nt.links.new(c2.outputs[2], pB.inputs['Base Color'])
rg = nt.nodes.new('ShaderNodeMix'); rg.data_type = 'FLOAT'; rg.inputs[2].default_value = 0.85; rg.inputs[3].default_value = 0.06
nt.links.new(glass, rg.inputs['Factor']); nt.links.new(rg.outputs[0], pB.inputs['Roughness'])
if 'Specular IOR Level' in pB.inputs: nt.links.new(M('ADD', M('MULTIPLY', glass, 0.8), 0.2), pB.inputs['Specular IOR Level'])
wc = nt.nodes.new('ShaderNodeMix'); wc.data_type = 'RGBA'
wc.inputs[6].default_value = lin4('#FFD9A0'); wc.inputs[7].default_value = lin4('#CFE0FF')
nt.links.new(M('GREATER_THAN', wn_.outputs['Value'], 0.85), wc.inputs['Factor'])
nt.links.new(wc.outputs[2], pB.inputs['Emission Color'])
emis = M('ADD', litw, M('MULTIPLY', shop, 0.8))
fw = M('MULTIPLY', emis, 0.0); FACW = fw.node.inputs[1]
nt.links.new(fw, pB.inputs['Emission Strength'])

PASTEL = ['#E8B4A0', '#F2D49B', '#A8C8E8', '#B8D8B0', '#E8C8D8', '#F0E0C0', '#C8B8E0', '#E09A7A', '#9CC0D8', '#F4C27A', '#D8D0C0', '#B0D0D0']
GLASSY = ['#5A6E8C', '#6E8CA8', '#4E5E78', '#8098B0', '#5C7894']
roofm = mat('roofb', '#5A5A62', 0.8); corn = mat('cornice', '#EDE8DC', 0.7)
AWN = [mat('awn' + c, c, 0.8) for c in ('#D62F2F', '#2F6FD6', '#3FA34D', '#E07A3A', '#8E44AD', '#FAC726')]
BLD = []
def building(x, y, w, d, h, col, yaw=0.0, awning=True, rs=None):
    r = empty('bld', (x, y, 0)); r.rotation_euler = (0, 0, yaw)
    o = box('bldm', (w, d, h), (0, 0, h / 2), fac, r); o.color = lin4(col)
    box('corn', (w + 0.6, d + 0.6, 0.7), (0, 0, h + 0.35), corn, r)
    box('roofb', (w - 0.4, d - 0.4, 0.4), (0, 0, h + 0.5), roofm, r)
    if rs and rs.random() < 0.6: box('ac', (2.2, 1.6, 1.4), (rs.uniform(-w / 3, w / 3), rs.uniform(-d / 4, d / 4), h + 1.4), mat('acm', '#B8BCC4', 0.5), r)
    if rs and rs.random() < 0.3: cyl('tank', 1.2, 2.4, mat('tankm', '#7A5A44', 0.8), r, (rs.uniform(-w / 3, w / 3), 0, h + 0.7), center=False)
    if awning:
        am = AWN[int(abs(x * 7 + y)) % len(AWN)]
        box('awn', (w * 0.8, 1.8, 0.25), (0, -d / 2 - 0.9, 4.0), am, r, rot=(0, 0, 0))
        box('sign', (w * 0.5, 0.2, 0.9), (0, -d / 2 - 0.12, 4.9), mat('signm', '#F4F1E8', 0.5, '#FFF4DD', 0.6), r)
    BLD.append(o)
    return r
rsb = random.Random(21)
def street_row(side, x0, x1, skip=()):
    x = x0
    while x < x1:
        w = rsb.uniform(11, 17)
        if x + w > x1: w = x1 - x
        if w < 6: break
        if not any(a <= x + w / 2 <= b for a, b in skip):
            h = rsb.choice((15.0, 18.4, 21.8, 25.2, 28.6, 35.4))
            d = 14
            building(x + w / 2, side * (12 + d / 2), w, d, h, rsb.choice(PASTEL), 0 if side > 0 else math.pi, rs=rsb)
        x += w + 0.2
# north row (gap for the plaza and an alley), south row all along
street_row(1, -260, -76.2); street_row(1, -70, -44); street_row(1, 44, 260)
street_row(-1, -260, 260)
# plaza (north of the avenue)
PX, PY = 0, 54
box('plaza', (88, 84, 0.3), (PX, PY, 0.0), plaza_m)
rsp = random.Random(4)
for side_x in (-1, 1):   # buildings framing the plaza
    y = 16
    while y < 96:
        d = rsp.uniform(11, 16); h = rsp.choice((18.4, 21.8, 25.2, 28.6))
        building(PX + side_x * 51, y + d / 2, d, 14, h, rsp.choice(PASTEL), -side_x * math.pi / 2, rs=rsp); y += d + 0.2
x = -44
while x < 44:
    w = rsp.uniform(11, 16); h = rsp.choice((21.8, 25.2, 28.6, 32.0))
    building(PX + x + w / 2, PY + 49, w, 14, h, rsp.choice(PASTEL), math.pi, rs=rsp); x += w + 0.2
# skyscrapers all round
rss = random.Random(11)
for i in range(64):
    a = 2 * math.pi * i / 64 + rss.uniform(-0.02, 0.02); rr = rss.uniform(150, 270)
    w_ = rss.uniform(16, 30); h_ = rss.uniform(55, 150)
    o_ = box('sky', (w_, w_ * rss.uniform(0.8, 1.2), h_), (0, 0, h_ / 2), fac, None, (rr * math.cos(a), 30 + rr * math.sin(a), 0))
    o_.rotation_euler = (0, 0, a + math.pi / 2); o_.color = lin4(rss.choice(GLASSY))

# ---- trees: puffy, bright
leaf_ms = [mat('leaf' + c, c, 0.9) for c in ('#7BD444', '#6CC43A', '#8FE055')]
trunk_m = mat('trunk', '#8A5A33', 0.9)
def tree(x, y, s=1.0, rs=None):
    r = empty('tree', (x, y, 0)); r.scale = (s, s, s)
    cyl('trunk', 0.35, 4.2, trunk_m, r, (0, 0, 0), center=False)
    rs = rs or random.Random(int(x * 13 + y))
    lm = leaf_ms[rs.randrange(3)]
    for k in range(5):
        ico = bpy.data.meshes.new('leaf'); bm_ = bmesh.new(); bmesh.ops.create_icosphere(bm_, subdivisions=2, radius=rs.uniform(1.3, 1.9))
        bm_.to_mesh(ico); bm_.free(); ico.materials.append(lm)
        for p in ico.polygons: p.use_smooth = True
        o = link(bpy.data.objects.new('leaf', ico), r)
        o.location = (rs.uniform(-1.1, 1.1), rs.uniform(-1.1, 1.1), 5.0 + rs.uniform(-0.4, 1.4))
    return r
for x in range(-250, 251, 16):
    for sy in (1, -1):
        if sy > 0 and -44 < x < 44: continue
        tree(x + 3, sy * 10.9, 0.95)
# ---- street lamps (light only near the action)
LAMPS = []
lampm = mat('lamphead', '#E8E8E8', 0.3, '#FFE6B8', 0)
for x in range(-240, 241, 24):
    for sy in (1, -1):
        r = empty('slamp', (x - 8, sy * 7.6, 0))
        box('slp', (0.3, 0.3, 9.5), (0, 0, 4.75), pole_m, r); box('sla', (0.25, 2.4, 0.25), (0, -sy * 1.1, 9.4), pole_m, r)
        box('slh', (0.8, 1.2, 0.3), (0, -sy * 2.2, 9.25), lampm, r)
        L = light('slL', 'SPOT', 0, '#FFD9A0', r, (0, -sy * 2.2, 9.0), spot_size=110 * D2R, spot_blend=0.4, shadow=False) if (-120 < x < 20 or abs(x) < 50) else None
        LAMPS.append(L)
# ---- parked cars
CARC = ['#D62F2F', '#2F6FD6', '#F2F2F2', '#FAC726', '#3FA34D', '#222226', '#E07A3A']
tyre = mat('tyre', '#1E1E22', 0.8); cglass = mat('cglass', '#1C2638', 0.08)
def car(x, y, yaw, col):
    r = empty('car', (x, y, 0)); r.rotation_euler = (0, 0, yaw)
    cm = mat('car' + col, col, 0.25)
    box('cbody', (4.6, 2.0, 1.1), (0, 0, 0.95), cm, r); box('ccab', (2.6, 1.8, 0.9), (-0.2, 0, 1.95), cm, r)
    box('cwin', (2.62, 1.82, 0.6), (-0.2, 0, 1.98), cglass, r)
    for sx in (-1.5, 1.5):
        for sy in (-1.0, 1.0): cyl('tyre', 0.45, 0.35, tyre, r, (sx, sy, 0.45), rot=(math.pi / 2, 0, 0))
    box('hl', (0.1, 1.6, 0.25), (2.31, 0, 1.05), mat('hlm', '#FFFFFF', 0.3, '#FFF6E0', 1.0), r)
rsc = random.Random(8)
for x in range(-240, 241, 11):
    if rsc.random() < 0.55 and not (-56 < x < 56) and not (-118 < x < -96):
        car(x, -5.4, 0, rsc.choice(CARC))
    if rsc.random() < 0.45 and not (-56 < x < 56) and not (-118 < x < -50):
        car(x, 5.4, math.pi, rsc.choice(CARC))

# ---- plaza furniture: fountain, flower beds, trees, benches, floodlight towers, flags
fm = mat('fount', '#E4DED2', 0.5)
cyl('basin', 6.0, 1.2, fm, None, (PX, PY, 0.15), n=64, center=False)
WATER = mat('water', '#3FA7D6', 0.05, '#7FD8FF', 0.4)
cyl('water', 5.5, 1.15, WATER, None, (PX, PY, 0.17), n=64, center=False)
cyl('pillar', 0.8, 4.4, fm, None, (PX, PY, 0.15), center=False); cyl('bowl', 2.0, 0.5, fm, None, (PX, PY, 4.4), center=False)
cyl('bowlw', 1.8, 0.52, WATER, None, (PX, PY, 4.42), center=False)
JET = cyl('jet', 0.22, 1.8, WATER, None, (PX, PY, 4.9), center=False)
FLOWER = [mat('fl' + c, c, 0.7) for c in ('#FF6FA8', '#FFD24A', '#B08CFF', '#FF8C4A', '#7FD8FF')]
for bx, by in ((-24, -22), (24, -22), (-24, 22), (24, 22), (-24, 0), (24, 0)):
    gx, gy = PX + bx, PY + by
    box('bed', (12, 7, 0.5), (gx, gy, 0.0), grass)
    box('bedrim', (12.6, 7.6, 0.35), (gx, gy, 0.0), mat('rim', '#CFC8BA', 0.6))
    rr = random.Random(int(bx * 3 + by))
    for k in range(10):
        sphere('flower', 0.42, FLOWER[k % 5], None, (gx + rr.uniform(-5, 5), gy + rr.uniform(-2.8, 2.8), 0.6)).scale = (1, 1, 0.55)
    tree(gx - 3.5, gy, 1.15); tree(gx + 3.5, gy + 0.5, 1.0)
for a in range(8):
    aa = a * math.pi / 4 + math.pi / 8
    box('bench', (3.2, 1.0, 0.3), (PX + 11 * math.cos(aa), PY + 11 * math.sin(aa), 1.0), mat('wood', '#8A5A33', 0.8), rot=(0, 0, aa + math.pi / 2))
TOWERS = []
steel = mat('steel', '#2B2F38', 0.5)
for tx, ty in ((-38, 18), (38, 18), (-38, 90), (38, 90)):
    tx += PX; yaw = math.atan2(PY - ty, PX - tx) - math.pi / 2
    tr0 = empty('tower', (tx, ty, 0)); tr0.rotation_euler = (0, 0, yaw)
    for sx in (-1.6, 1.6):
        for sy in (-1.6, 1.6):
            box('tleg', (0.35, 0.35, 30), (sx * 0.8, sy * 0.8, 15), steel, tr0, rot=(-sy * 0.05, sx * 0.05, 0))
    for z in range(2, 30, 3):
        w_ = 3.4 - z * 0.05
        box('tb1', (w_, 0.2, 0.2), (0, -w_ / 2, z), steel, tr0); box('tb2', (w_, 0.2, 0.2), (0, w_ / 2, z), steel, tr0)
        box('tb3', (0.2, w_, 0.2), (-w_ / 2, 0, z), steel, tr0); box('tb4', (0.2, w_, 0.2), (w_ / 2, 0, z), steel, tr0)
        box('tx', (0.15, w_ * 1.35, 0.15), (0, -w_ / 2, z + 1.5), steel, tr0, rot=(0.8, 0, math.pi / 2))
    hd = empty('thead', (0, 0, 30.5), tr0); hd.rotation_euler = (-0.5, 0, 0)
    box('tframe', (7.2, 0.6, 3.6), (0, 0.35, 0), steel, hd)
    pm_ = mat('tpanel%d' % len(TOWERS), '#DDDDDD', 0.3, '#F4F6FF', 0)
    for px in (-2.4, 0, 2.4):
        for pz in (-0.85, 0.85): box('tpanel', (2.0, 0.1, 1.5), (px, 0.0, pz), pm_, hd)
    L_ = light('towerL', 'SPOT', 0, '#EEF2FF', hd, (0, -0.4, 0), rot=(math.pi / 2, 0, 0), spot_size=60 * D2R, spot_blend=0.4, shadow_soft_size=1.0)
    bs_ = [beam_cone('tbeam', 60, 9, hd, (px, -0.2, 0), rot=(math.pi / 2, 0, 0), strength=0.06, color='#EEF2FF') for px in (-2.4, 0, 2.4)]
    TOWERS.append((L_, pm_, bs_))
FLAGS = []
for a in range(6):
    x, y = PX - 30 + a * 12, PY + 40
    box('fpole', (0.25, 0.25, 11), (x, y, 5.5), pole_m)
    FLAGS.append(box('flag', (0.05, 3.0, 1.8), (0, 1.5, 0), mat('flag%d' % a, ['#D62F2F', '#2F6FD6', '#FAC726', '#3FA34D', '#8E44AD', '#E07A3A'][a], 0.8), None, (x, y, 10.0)))

# ---- Bin's apartment window (one candle in the blackout): south row, facing the avenue
APX = -88
CWIN_M = mat('cwinm', '#20180E', 0.3, '#FF9E45', 0)
box('candlewin', (2.2, 0.05, 2.2), (APX, -11.9, 4.6 + 3.4 * 2 + 1.75), CWIN_M)

# ---------------------------------------------------------------- camera
CAM = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); link(CAM); S.camera = CAM
CAM.data.sensor_fit = 'VERTICAL'; CAM.data.sensor_height = 24; CAM.data.clip_start = 0.1; CAM.data.clip_end = 1000
CAM.data.dof.use_dof = False
def cam_set(p, tgt, fov):
    CAM.location = p
    d = Vector(tgt) - Vector(p); CAM.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    CAM.data.lens = 12 / math.tan(fov * D2R / 2)

# ---------------------------------------------------------------- timing helpers
def LS(i): return LINES[i][0]
def LE(i): return LINES[i][1]
def WI(i, j): return WORDS[LINES[i][2] + j][0]      # start of word j of line i
def cut(i, j=0): return (WI(i, j) if j else LS(i)) - 0.04
def smooth(x): x = min(1, max(0, x)); return x * x * (3 - 2 * x)
def back(x, c1=2.2):
    x = min(1, max(0, x)); c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2
def lerp(a, b, k): return tuple(ai + (bi - ai) * k for ai, bi in zip(a, b))
def keyed(keys, t, dur=0.14):
    """keys: list of (time, dict). Hold, then snap with back ease."""
    cur = keys[0][1]; prev = cur; tk = -99
    for tt, P in keys:
        if t >= tt: prev, cur, tk = cur, P, tt
    k = back((t - tk) / dur)
    out = {}
    for name in set(prev) | set(cur):
        if name == 'face': continue
        a, b = prev.get(name, 0.0), cur.get(name, 0.0); out[name] = a + (b - a) * k
    out['face'] = cur.get('face', 'stern')
    return out
def talking(t, t0, t1, P, base='smile'):
    """mouth flaps while a character speaks between t0 and t1"""
    P = dict(P); P['face'] = ('talk' if (t0 <= t < t1 and int((t - t0) * 7) % 2 == 0) else base)
    return P
def walk(t, P=None, amp=32, f=1.6):
    P = dict(P or {}); ph = math.sin(2 * math.pi * f * t)
    P['legL'] = amp * ph; P['legR'] = -amp * ph; P['armL'] = P.get('armL', -amp * ph); P['armR'] = P.get('armR', amp * ph)
    return P
def sit(P=None):
    P = dict(P or {}); P['legL'] = 90; P['legR'] = 90; return P

# ---------------------------------------------------------------- the numbers above every head
NUMFONT = bpy.data.fonts.load(os.path.join(HERE, 'font.ttf'))
NCOL = {'white': '#FFF6E0', 'blue': '#7FD8FF', 'red': '#FF4A3D', 'gold': '#FFC93C', 'grey': '#9A9AA6', 'green': '#7DFF8A'}
class NumTag:
    def __init__(s, parent, z):
        cu = bpy.data.curves.new('num', 'FONT'); cu.body = '0'; cu.font = NUMFONT
        cu.align_x = 'CENTER'; cu.align_y = 'CENTER'; cu.size = 1.15; cu.extrude = 0.05
        s.m = bpy.data.materials.new('numm'); s.m.use_nodes = True
        p = s.m.node_tree.nodes['Principled BSDF']; p.inputs['Base Color'].default_value = (0.02, 0.02, 0.02, 1)
        s.ec = p.inputs['Emission Color']; s.es = p.inputs['Emission Strength']
        cu.materials.append(s.m)
        s.o = link(bpy.data.objects.new('num', cu), parent); s.o.location = (0, 0, z); s.z = z
        c = s.o.constraints.new('TRACK_TO'); c.target = CAM; c.track_axis = 'TRACK_Z'; c.up_axis = 'UP_Y'
        s.hide()
    def hide(s): s.o.hide_render = True
    def set(s, text, col='white', t=0.0, tc=None, glow=5.0):
        """show text; tc = time the value last changed (pop + flash)"""
        s.o.hide_render = False
        if s.o.data.body != text: s.o.data.body = text
        s.ec.default_value = lin4(NCOL.get(col, col))
        k = 1.0; fl = 1.0
        if tc is not None and t >= tc:
            k = 0.55 + 0.45 * back((t - tc) / 0.18); fl = 1 + 2.5 * math.exp(-(t - tc) * 7)
        s.o.scale = (k, k, k); s.es.default_value = glow * fl
        s.o.location.z = s.z + 0.08 * math.sin(2 * math.pi * 0.6 * t)   # gentle float
def count(t, keys):
    """keys [(time, value)] -> (value, time it changed)"""
    v, tc = keys[0][1], None
    for tt, val in keys:
        if t >= tt: v, tc = val, tt
    return v, tc

# ---------------------------------------------------------------- characters
class Kid:
    def __init__(s, name, torso, legs, hair, scale=1.0, cap=None, pig=False, long_hair=False, glasses=False, beard=None):
        s.name = name; s.scale = scale
        s.root = empty(name); s.root.scale = (scale,) * 3
        sk = mat('skin', SKIN, 0.75); tm = mat(name + '_t', torso, 0.8); lm = mat(name + '_l', legs, 0.85)
        shoe = mat('shoe', '#F2F2F2', 0.7); hm = mat(name + '_h', hair, 0.9)
        s.body = empty(name + '_body', (0, 0, 2), s.root)
        box(name + '_torso', (2, 1, 2), (0, 0, 1), tm, s.body)
        dk = mat('belt', '#26262B', 0.6)
        box(name + '_belt', (2.04, 1.04, 0.24), (0, 0, 0.12), dk, s.body)
        box(name + '_buckle', (0.34, 0.06, 0.2), (0, -0.53, 0.12), mat('buckle', '#D8C060', 0.3), s.body)
        box(name + '_collar', (1.2, 1.06, 0.18), (0, 0, 1.93), mat(name + '_col', '#F4F1E8', 0.7), s.body)
        if scale > 1.0: box(name + '_pocket', (0.55, 0.05, 0.45), (0.5, -0.52, 1.45), dk, s.body)
        s.arm = {}; s.leg = {}
        for side, sx in (('L', 1.5), ('R', -1.5)):
            a = empty(name + '_arm' + side, (sx, 0, 2), s.body)
            box(name + '_armm' + side, (1, 1, 2), (0, 0, -1), sk, a)
            box(name + '_sleeve' + side, (1.04, 1.04, 0.7), (0, 0, -0.33), tm, a)
            s.arm[side] = a
            g = empty(name + '_leg' + side, (sx / 3, 0, 0), s.body)
            box(name + '_legm' + side, (1, 1, 1.62), (0, 0, -0.81), lm, g)
            box(name + '_shoe' + side, (1.02, 1.04, 0.38), (0, -0.02, -1.81), shoe, g)
            s.leg[side] = g
        s.neck = empty(name + '_neck', (0, 0, 2), s.body)
        s.head = lathe(name + '_head', 0.74, 1.40, 0.30, FMAT['stern'], s.neck, face_w=1.75, sq=5.0)
        s.head.material_slots[0].link = 'OBJECT'; s.head.material_slots[0].material = FMAT['stern']
        if cap:
            cm = mat(name + '_cap', cap, 0.7)
            box(name + '_capc', (1.62, 1.62, 0.5), (0, 0, 1.55), cm, s.neck)
            box(name + '_brim', (1.4, 0.9, 0.12), (0, -1.05, 1.36), cm, s.neck)
        else:
            box(name + '_hair', (1.62, 1.62, 0.42), (0, 0.04, 1.42), hm, s.neck)
            box(name + '_hairf', (1.62, 0.35, 0.32), (0, -0.66, 1.2), hm, s.neck)
            box(name + '_hairb', (1.62, 0.35, 1.0 if not long_hair else 2.3), (0, 0.66, 0.95 if not long_hair else 0.3), hm, s.neck)
            if long_hair:
                for sx in (-1, 1): box(name + '_hairs', (0.3, 1.3, 1.9), (sx * 0.84, 0.15, 0.55), hm, s.neck)
            if pig:
                for sx in (-1, 1): box(name + '_pig', (0.45, 0.45, 0.8), (sx * 0.95, 0.3, 0.8), hm, s.neck)
        if glasses:
            gm = mat('glass', '#1A1A1A', 0.4)
            for sx in (-0.3, 0.3): box(name + '_gl', (0.42, 0.06, 0.3), (sx, -0.77, 0.86), gm, s.neck)
            box(name + '_glb', (0.2, 0.06, 0.06), (0, -0.77, 0.9), gm, s.neck)
        if beard:
            box(name + '_mus', (0.7, 0.08, 0.16), (0, -0.78, 0.48), mat(name + '_b', beard, 0.9), s.neck)
        rsk = random.Random(sum(map(ord, name)))
        if not cap:   # chunky locks of hair over the fringe
            for k in range(5):
                box(name + '_lock', (rsk.uniform(0.35, 0.55), 0.42, rsk.uniform(0.3, 0.5)), (0, 0, 0), hm, s.neck,
                    (-0.62 + k * 0.31, -0.6 + rsk.uniform(-0.05, 0.05), 1.5 + rsk.uniform(-0.05, 0.08)), (rsk.uniform(-0.3, -0.1), rsk.uniform(-0.25, 0.25), rsk.uniform(-0.2, 0.2)))
        if scale <= 1.0:   # hoodie: hood, drawstrings, striped cuffs
            box(name + '_hood', (1.5, 0.5, 0.9), (0, 0.62, 1.75), tm, s.body)
            wm = mat('string', '#F4F4F4', 0.6)
            for sx in (-0.28, 0.28): box(name + '_str', (0.08, 0.06, 0.6), (sx, -0.53, 1.55), wm, s.body)
            for side in ('L', 'R'):
                box(name + '_stripe', (1.06, 1.06, 0.12), (0, 0, -0.5), wm, s.arm[side]); box(name + '_stripe', (1.06, 1.06, 0.12), (0, 0, -0.75), wm, s.arm[side])
            box(name + '_pouch', (1.3, 0.06, 0.5), (0, -0.52, 0.55), mat(name + '_pch', torso, 0.75), s.body)
        s.face = 'stern'
        s.tag = NumTag(s.root, 7.25)
    def place(s, x, y, heading_deg, z=0.0):
        s.root.location = (x, y, z); s.root.rotation_euler = (0, 0, (heading_deg + 90) * D2R)
    def hide(s): s.root.location = (0, 0, -500); s.tag.hide()
    def pose(s, P):
        g = lambda k: P.get(k, 0.0) * D2R
        s.body.rotation_euler = (g('lean'), 0, g('yaw'))
        s.body.location.z = 2 - P.get('drop', 0.0)
        s.arm['L'].rotation_euler = (g('armL'), -g('armLz'), 0)
        s.arm['R'].rotation_euler = (g('armR'), g('armRz'), 0)
        s.leg['L'].rotation_euler = (-g('legL'), 0, 0); s.leg['R'].rotation_euler = (-g('legR'), 0, 0)
        s.neck.rotation_euler = (g('headx'), g('headroll'), g('head'))
        f = P.get('face', 'stern')
        if f != s.face:
            s.head.material_slots[0].material = FMAT[f]; s.face = f

BIN = Kid('bin', '#2F6FD6', '#23262E', '#2A1B12')
NA = Kid('na', '#F2588F', '#7B4FC9', '#5A3A22', 0.8, pig=True)
TEO = Kid('teo', '#3FA34D', '#2E3A8C', '#111111', cap='#D62F2F')
MOM = Kid('mom', '#E9A23B', '#4A3B6B', '#3B2416', 1.22, long_hair=True)
TEACH = Kid('teach', '#B43C5C', '#2B2B33', '#1A1A1A', 1.22, long_hair=True, glasses=True)
ICE = Kid('ice', '#F4F4F4', '#3A5A8C', '#8A8A8A', 1.22, cap='#F4F4F4', beard='#8A8A8A')
TMOM = Kid('tmom', '#3FA3A3', '#5A3A2A', '#6B2A1A', 1.22, long_hair=True)
WH = [Kid('w1', '#E8812F', '#2B2B33', '#3B2615'), Kid('w2', '#8E44AD', '#1F4E79', '#111111', pig=True)]
CROWD_C = [('#C0392B', '#2C3E50', '#111111', 1.0), ('#16A085', '#5B3A1E', '#6B4A2A', 0.9), ('#F1C40F', '#34495E', '#2A1B12', 1.2),
           ('#9B59B6', '#2B2B33', '#3B2615', 1.22), ('#E67E22', '#1F4E79', '#111111', 0.85), ('#1ABC9C', '#2C3E50', '#5A3A22', 1.22),
           ('#D35400', '#4A3B6B', '#1A1A1A', 1.0), ('#2980B9', '#5B3A1E', '#8A8A8A', 1.22), ('#27AE60', '#23262E', '#3B2416', 0.95),
           ('#E84393', '#2B2B33', '#111111', 1.22), ('#6C5CE7', '#34495E', '#2A1B12', 1.0), ('#FD79A8', '#1F4E79', '#5A3A22', 1.22)]
CROWD = [Kid('c%d' % i, a, b, c, s_, long_hair=(i % 3 == 1 and s_ > 1.1), pig=(i % 4 == 2 and s_ < 1.1)) for i, (a, b, c, s_) in enumerate(CROWD_C)]
CROWD_N = [512, 87, 340, 236, 45, 701, 133, 418, 66, 290, 158, 823]
KIDS = [BIN, NA, TEO, MOM, TEACH, ICE, TMOM] + WH + CROWD

# ---------------------------------------------------------------- day light
SUN = light('sun', 'SUN', 0.0, '#FFF1D8', rot=(50 * D2R, 0, 28 * D2R), angle=2.0 * D2R)

# ---------------------------------------------------------------- classroom (CX, CY)
CX, CY = 0, 400
cw = mat('cwall', '#E8DCC0', 0.9); cfl = mat('cfloor', '#A8784E', 0.7)
box('cfloor', (34, 30, 0.2), (CX, CY, -0.1), cfl)
box('cback', (34, 0.4, 14), (CX, CY + 12, 7), cw)
box('cleft', (0.4, 30, 14), (CX - 15, CY, 7), cw); box('cright', (0.4, 30, 14), (CX + 15, CY, 7), cw)
box('cceil', (34, 30, 0.3), (CX, CY, 14), cw)
box('board', (14, 0.2, 5.0), (CX, CY + 11.75, 7.2), mat('board', '#24483A', 0.9))
box('bframe', (14.6, 0.3, 0.4), (CX, CY + 11.7, 4.6), mat('wood', '#8A5A33', 0.8))
chalk = mat('chalk', '#F2F2F2', 0.9, '#FFFFFF', 0.3)
for i, (x0, z0, w_) in enumerate(((-5.5, 8.6, 3.5), (-1.0, 8.6, 2.0), (2.8, 8.6, 2.6), (-5.5, 7.2, 5.0), (1.5, 7.2, 1.2), (-5.5, 5.8, 2.5))):
    box('chalkl', (w_, 0.05, 0.22), (CX + x0 + w_ / 2, CY + 11.62, z0), chalk)
skyw = mat('cwin', '#BFE3FF', 0.3, '#CFEAFF', 2.5)
for wy in (-7, 0, 7):
    box('cwin', (0.1, 4.0, 4.2), (CX - 14.75, CY + wy, 7.5), skyw)
    light('cwinL', 'AREA', 900, '#DDEEFF', None, (CX - 14.2, CY + wy, 7.5), (0, -90 * D2R, 0), shadow=False, shape='RECTANGLE', size=4.2, size_y=4.0)
for lx in (-6, 6):
    light('cceilL', 'AREA', 1300, '#FFF4E0', None, (CX + lx, CY, 13.6), shape='RECTANGLE', size=6, size_y=10)
desk_m = mat('desk', '#C08A55', 0.7); leg_m = mat('dleg', '#4A4A52', 0.5)
SEATS = []
for row, dy in enumerate((-4.0, 1.0)):
    for col, dx in enumerate((-7.5, -2.5, 2.5, 7.5)):
        x, y = CX + dx, CY + dy
        box('desk', (3.4, 1.8, 0.2), (x, y + 1.5, 3.0), desk_m)
        for sx in (-1.5, 1.5): box('dleg', (0.15, 0.15, 2.9), (x + sx, y + 1.5, 1.45), leg_m)
        box('chair', (1.8, 1.6, 0.18), (x, y - 0.3, 1.75), desk_m)
        box('chback', (1.8, 0.15, 1.8), (x, y - 1.05, 2.75), desk_m)
        for sx in (-0.75, 0.75): box('cleg', (0.12, 0.12, 1.7), (x + sx, y - 0.3, 0.85), leg_m)
        SEATS.append((x, y - 0.1))
box('tdesk', (5, 2.2, 0.25), (CX + 4.5, CY + 8.5, 3.2), desk_m); box('tdeskb', (5, 0.2, 3.0), (CX + 4.5, CY + 7.5, 1.6), desk_m)
def seat(k, i, P, head=90):
    x, y = SEATS[i]; k.place(x, y, head, z=1.84 - 2.0 + 0.0); k.pose(sit(P))

# ---------------------------------------------------------------- living room (IX, IY)
IX, IY = 0, 300
iw = mat('iwall', '#C9B48A', 0.9)
box('iwall', (34, 0.4, 16), (IX, IY + 0.2, 8), iw)
box('iwallL', (0.4, 22, 16), (IX - 12, IY - 10, 8), iw); box('iwallR', (0.4, 22, 16), (IX + 13, IY - 10, 8), iw)
box('ifloor', (34, 24, 0.2), (IX, IY - 10, -0.1), mat('ifl', '#6B4A2E', 0.8))
box('rug', (10, 7, 0.06), (IX - 1, IY - 6, 0.03), mat('rug', '#8C2F39', 0.95))
box('idoorway', (3.4, 0.05, 6.4), (IX + 7, IY - 0.02, 3.2), black_m)
IDOOR = empty('idoorpiv', (IX + 5.3, IY - 0.15, 0))
box('idoor', (3.4, 0.25, 6.4), (1.7, 0, 3.2), door_m, IDOOR)
box('iknob', (0.2, 0.2, 0.2), (3.0, -0.18, 3.1), mat('knob', '#E8C25A', 0.3), IDOOR)
OUTL = light('outL', 'POINT', 0, '#AFC4FF', None, (IX + 7, IY + 2.5, 4), shadow_soft_size=0.6)
CLK = empty('clock', (IX - 5, IY - 0.3, 9.5))
cyl('cface', 1.6, 0.2, mat('cface', '#F7F3E8', 0.6), CLK, rot=(math.pi / 2, 0, 0))
cyl('crim', 1.75, 0.15, mat('crim', '#2B2B2B', 0.5), CLK, (0, 0.06, 0), rot=(math.pi / 2, 0, 0))
# frames on wall
for fx, fc in ((-1.0, '#5BAA5B'), (1.8, '#3F7FBF')):
    box('pframe', (1.8, 0.12, 1.4), (IX + fx, IY - 0.1, 9.0), mat('pf', '#3A2A1A', 0.6)); box('pic', (1.5, 0.14, 1.1), (IX + fx, IY - 0.12, 9.0), mat('pic' + fc, fc, 0.8))
sofa_m = mat('sofa', '#4E6A8C', 0.95)
SX_, SY_ = IX - 2.0, IY - 3.2
box('sofab', (8.4, 2.6, 1.6), (SX_, SY_, 0.8), sofa_m); box('sofaback', (8.4, 0.9, 2.2), (SX_, SY_ + 1.6, 2.4), sofa_m)
for sx in (-4.5, 4.5): box('sofaarm', (0.8, 3.3, 2.4), (SX_ + sx, SY_ + 0.3, 1.2), sofa_m)
box('cushion', (3.8, 2.3, 0.4), (SX_ - 1.95, SY_ - 0.1, 1.8), sofa_m); box('cushion', (3.8, 2.3, 0.4), (SX_ + 1.95, SY_ - 0.1, 1.8), sofa_m)
box('ctable', (3.4, 2.0, 0.25), (SX_, SY_ - 4.2, 1.5), mat('wood', '#8A5A33', 0.8))
for sx in (-1.4, 1.4):
    for sy in (-0.8, 0.8): box('ctl', (0.18, 0.18, 1.4), (SX_ + sx, SY_ - 4.2 + sy, 0.7), leg_m)
CANDLE_M = mat('candlef', '#FFB347', 0.5, '#FFB347', 0)
cyl('candle', 0.16, 0.7, mat('wax', '#F4F1E8', 0.6), None, (SX_ + 0.6, SY_ - 4.2, 1.62), center=False)
FLAME = sphere('flame', 0.1, CANDLE_M, None, (SX_ + 0.6, SY_ - 4.2, 2.45)); FLAME.scale = (1, 1, 1.8)
CANDLE = light('candleL', 'POINT', 0, '#FF9E45', None, (SX_ + 0.6, SY_ - 4.6, 2.9), shadow_soft_size=0.15)
JAR = empty('jar', (SX_ - 0.6, SY_ - 4.2, 1.62))
cyl('jarm', 0.5, 1.0, mat('jarg', '#CFE6F0', 0.15), JAR, center=False); cyl('jarlid', 0.55, 0.15, mat('lid', '#D62F2F', 0.6), JAR, (0, 0, 1.05), center=False)
for i in range(4): cyl('cookie', 0.18, 0.06, mat('cookie', '#B07A3C', 0.9), JAR, (0.7 + 0.25 * i, -0.3 + 0.2 * (i % 2), 0.0), center=False)
IWIN = mat('iwin', '#1A2233', 0.3, '#5F78A8', 0.0)
box('iwinp', (0.1, 4.2, 4.0), (IX - 11.75, IY - 6, 7.0), IWIN)
for dz in (-2.1, 2.1): box('iwf', (0.3, 4.6, 0.25), (IX - 11.7, IY - 6, 7.0 + dz), frame_m)
for dy in (-2.2, 0, 2.2): box('iwf', (0.3, 0.2, 4.4), (IX - 11.7, IY - 6 + dy, 7.0), frame_m)
WINL = light('iwinL', 'AREA', 0, '#BFD3FF', None, (IX - 11.3, IY - 6, 7.0), (0, -90 * D2R, 0), shadow=True, shape='RECTANGLE', size=4.0, size_y=4.2)
ILAMP = [light('ilamp', 'POINT', 1100, '#FFC27A', None, (IX - 2, IY - 9, 11), shadow_soft_size=0.6),
         light('ilamp2', 'POINT', 350, '#FFC27A', None, (IX + 4, IY - 4.5, 7.5), shadow_soft_size=0.4)]
FILL = light('ifill', 'AREA', 0, '#6F86C8', None, (IX, IY - 16, 9), (60 * D2R, 0, 0), shadow=False, shape='RECTANGLE', size=14, size_y=6)

# ---------------------------------------------------------------- ice cream cart
KCX, KCY = -104, 6.6
cart = empty('cart', (KCX, KCY, 0))
box('cartb', (3.6, 1.8, 1.7), (0, 0, 1.75), mat('cartw', '#F7F3EA', 0.5), cart)
box('cartst', (3.62, 1.82, 0.35), (0, 0, 1.6), mat('cartp', '#F2588F', 0.6), cart)
box('carttop', (3.8, 2.0, 0.15), (0, 0, 2.65), mat('cartp', '#F2588F', 0.6), cart)
for sx in (-1.3, 1.3): cyl('wheel', 0.55, 0.3, mat('tyre', '#222226', 0.8), cart, (sx, -0.95, 0.55), rot=(math.pi / 2, 0, 0))
box('upole', (0.12, 0.12, 4.0), (0, 0.6, 4.5), pole_m, cart)
um = bpy.data.meshes.new('umb'); bmu = bmesh.new()
bmesh.ops.create_cone(bmu, cap_ends=True, segments=12, radius1=3.0, radius2=0.1, depth=1.2); bmu.to_mesh(um); bmu.free()
um.materials.append(mat('umb', '#FFD24A', 0.7)); uo = link(bpy.data.objects.new('umb', um), cart); uo.location = (0, 0.6, 6.6)
for i, c in enumerate(('#F2588F', '#7FD8FF', '#FFE08A')):
    sphere('scoop', 0.32, mat('scoop' + c, c, 0.8), cart, (-1.0 + i * 1.0, -0.2, 3.0))
CONE = empty('cone', (0, 0, -500))
cm_c = mat('wafer', '#D9A55B', 0.8)
bmc_ = bmesh.new(); bmesh.ops.create_cone(bmc_, cap_ends=True, segments=12, radius1=0.02, radius2=0.28, depth=0.8); mec = bpy.data.meshes.new('conem'); bmc_.to_mesh(mec); bmc_.free()
mec.materials.append(cm_c); link(bpy.data.objects.new('conem', mec), CONE).location = (0, 0, 0.4)
sphere('cscoop', 0.3, mat('scoop#F2588F', '#F2588F', 0.8), CONE, (0, 0, 0.85))

# ---------------------------------------------------------------- world: day / storm night
T_NIGHT = cut(26)
T_OUT = WI(26, 9) + 0.04          # "mất điện"
LIGHTNING = [WI(26, 3) - 0.05, WI(29, 3), LS(31) - 0.35, LS(41) + 0.6]
def bolt(t):
    for tl in LIGHTNING:
        d = t - tl
        if 0 <= d < 0.45: return max(0, 1 - d / 0.08) + 0.7 * max(0, 1 - abs(d - 0.2) / 0.07)
    return 0.0
T_BIN0 = WI(33, 6)
T_REVEAL = WI(38, 6)

def world_state(t):
    day = t < T_NIGHT; out = t >= T_OUT; fl = 0 if day else bolt(t)
    if day:
        RAMP[0].color = lin4('#CFE8FF'); RAMP[1].color = lin4('#3C8CE6'); SKY.default_value = 1.0; STARG.default_value = 0
        SUN.data.energy = 4.5; MOON.data.energy = 0; CLOUDK.default_value = 0.9
    else:
        RAMP[0].color = lin4('#2B3245'); RAMP[1].color = lin4('#0A0D15'); SKY.default_value = 1.2 + 9 * fl; STARG.default_value = 0
        SUN.data.energy = 0; MOON.data.energy = 0.35 + 4 * fl; CLOUDK.default_value = 0.0
    TWINKLE.default_value = t * 0.35
    wet = not day
    for p_, r0 in WETMATS:
        p_.inputs['Roughness'].default_value = (0.12 if p_ is not GRASS_P else 0.45) if wet else r0
        if 'Specular IOR Level' in p_.inputs: p_.inputs['Specular IOR Level'].default_value = 0.6 if wet else 0.15
    city_on = (not day) and (t < T_OUT or (t < T_OUT + 0.6 and False))
    if not day and T_OUT <= t < T_OUT + 0.6:     # the blackout ripples across the city
        city_on = (math.sin(53 * t) + math.sin(31 * t)) > 0.2 * (1 + (t - T_OUT) / 0.3)
    FACW.default_value = 2.4 if city_on else 0.0
    set_emit(CWIN_M, 3.0 * (0.85 + 0.15 * math.sin(19 * t)) if (not day and t >= T_OUT + 0.6) else 0)
    for L in LAMPS:
        if L: L.data.energy = 2600 if city_on else 0
    set_emit(lampm, 10 if city_on else 0)
    for L_, pm_, bs_ in TOWERS:
        L_.data.energy = 9000 if city_on else 0; set_emit(pm_, 14 if city_on else 0)
        for b_ in bs_: b_.hide_render = not city_on
    for i, f_ in enumerate(FLAGS): f_.rotation_euler = (0, 0, 0.25 * math.sin(2 * math.pi * 0.9 * t + i))
    JET.scale = (1, 1, 1 + 0.08 * math.sin(2 * math.pi * 3 * t))
    # interior
    night_in = not day
    for L_, e_ in zip(ILAMP, (1100, 350)): L_.data.energy = 0 if (night_in and out) else e_
    cf = 0.8 + 0.2 * math.sin(23 * t) * math.sin(7.3 * t)
    CANDLE.data.energy = (90 * cf) if (night_in and out) else 0; set_emit(CANDLE_M, 6 * cf if (night_in and out) else 0)
    FILL.data.energy = 180 if night_in else 0
    WINL.data.energy = (60 + 5000 * fl) if night_in else 700; set_emit(IWIN, (0.3 + 8 * fl) if night_in else 3.0)
    IWIN.node_tree.nodes['Principled BSDF'].inputs['Emission Color'].default_value = lin4('#5F78A8' if night_in else '#CFEAFF')
    CLK.rotation_euler = (0, 0, 0)

def reset():
    for k in KIDS: k.hide(); k.pose({})
    CONE.location = (0, 0, -500); CONE.parent = None
    IDOOR.rotation_euler = (0, 0, 0); OUTL.data.energy = 0
    JAR.location.z = 1.62

# ---------------------------------------------------------------- what each head shows
T_POP = WI(0, 10) - 0.04
def teo_val(t):
    if t < cut(11, 1): return 999, None
    keys = [(0, 999), (WI(11, 8), 998), (WI(12, 5), 997)]
    if t < LS(16): return count(t, keys)
    a, b = LS(16) + 0.3, WI(17, 0)
    if t < WI(17, 0):  # rattling lies off non-stop
        k = smooth((t - a) / (b - a)) if t > a else 0; return int(round(997 - (997 - 301) * k)), (t if t > a else None)
    if t < WI(19, 0) - 0.04:
        ks = [(WI(17, 0), 300), (WI(17, 2), 200), (WI(17, 4), 100)]
        v, tc = count(t, ks)
        if t >= LS(18) - 0.04:
            a, b = LS(18), WI(19, 0) - 0.1; k = smooth((t - a) / (b - a)); return int(round(100 - 96 * k)), t
        return v, tc
    return count(t, [(WI(19, 0) - 0.04, 3), (WI(19, 1), 2), (WI(19, 2), 1), (WI(21, 7), 0)])
T_TEO0 = None
NUMFN = {
    BIN: lambda t: ('1', 'blue', WI(4, 7)) if t < T_BIN0 else ('0', 'grey', T_BIN0),
    NA: lambda t: ('640', 'white', None), TEACH: lambda t: ('214', 'white', None), ICE: lambda t: ('392', 'white', None),
    TMOM: lambda t: ('268', 'white', None), MOM: lambda t: ('0', 'gold', T_REVAL_POP),
}
T_REVAL_POP = T_REVEAL
def teo_fn(t):
    v, tc = teo_val(t); return (str(v), 'red' if v < 10 else ('grey' if v == 0 else 'white'), tc)
def teo_fn2(t):
    v, tc = teo_val(t)
    return (str(v), 'grey' if v == 0 else ('red' if v < 10 else 'white'), tc)
NUMFN[TEO] = teo_fn2
NUMFN[WH[0]] = lambda t: count(t, [(0, '87'), (WI(25, 7), '86')])[0:1] + ('white', count(t, [(0, 0), (WI(25, 7), 1)])[1])
NUMFN[WH[1]] = lambda t: count(t, [(0, '45'), (WI(25, 7) + 0.12, '44')])[0:1] + ('white', count(t, [(0, 0), (WI(25, 7) + 0.12, 1)])[1])
for i, c in enumerate(CROWD):
    def f(t, i=i):
        n = CROWD_N[i]; tc = T_POP + 0.05 * (i % 6)
        if i == 3 and t >= WI(3, 7): return (str(n - 1), 'red' if t < WI(3, 7) + 0.6 else 'white', WI(3, 7))
        return (str(n), 'white', tc)
    NUMFN[c] = f
SHOWTAG = set(KIDS) - {MOM}
def tags(t):
    for k in KIDS:
        if k.root.location.z < -100: continue
        if t < T_POP: k.tag.hide(); continue
        if k is MOM and t < T_REVEAL - 0.04: k.tag.hide(); continue
        txt, col, tc = NUMFN[k](t)
        k.tag.set(txt, col, t, tc, glow=(7.0 if col == 'gold' else 5.0) if (k is not BIN or t < T_BIN0) else 2.0)

# ---------------------------------------------------------------- shots
SHOTS = []
def shot(t0, cam0, cam1, tg0, tg1, fov, setup, rain=False, still=False):
    SHOTS.append(dict(t0=t0, c0=cam0, c1=cam1, g0=tg0, g1=tg1, fov=fov, setup=setup, rain=rain, still=still))
nothing = lambda t, u: None
def hz(k): return 4.7 * k.scale      # face height

# crowd strolling the street in the daytime
def stroll(t, u, n=12, x0=-120, spread=70):
    rs = random.Random(5)
    for i, c in enumerate(CROWD[:n]):
        lane = rs.choice((-8.8, -9.9, 8.8, 9.9)); dirn = 1 if lane > 0 else -1
        x = x0 + rs.uniform(0, spread) + dirn * 3.2 * t
        x = (x + 200) % 160 - 200
        c.place(x, lane, 0 if dirn > 0 else 180); c.pose(walk(t + i * 0.37, {'face': rs.choice(['smile', 'stern', 'happy', 'smile'])}))
# L0 a: wide crane over the town in the morning
shot(0.0, (-162, -3, 46), (-148, -2, 38), (-70, 4, 4), (-66, 4, 4), 58, stroll)
# L0 b: street level, numbers pop above every head
shot(cut(0, 10), (-94.0, -3.5, 3.6), (-91.0, -3.0, 3.8), (-84.0, 8, 6.6), (-82.0, 8, 7.0), 54, lambda t, u: stroll(t, u, 12, -106, 40))
# L1 one adult, his number up close
def l1(t, u):
    c = CROWD[2]; c.place(-86.0, 8.4, -90); c.pose(keyed([(0, {'face': 'smile'}), (WI(1, 3), {'face': 'smile', 'head': -12})], t))
shot(cut(1), (-86.4, 1.8, 6.8), (-86.2, 2.6, 7.4), (-86.0, 8.4, 7.2), (-86.0, 8.4, 8.0), 40, l1)
# L2 three grown-ups, hundreds each
def l2(t, u):
    for j, (ci, x) in enumerate(((3, -89), (5, -85), (9, -81))):
        c = CROWD[ci]; c.place(x, 8.6 + 0.4 * (j % 2), -90); c.pose({'face': ['smile', 'stern', 'happy'][j], 'head': (j - 1) * 10})
shot(cut(2), (-85.0, -2, 6.5), (-85.0, -1.2, 6.8), (-85.0, 8.6, 7.4), (-85.0, 8.6, 7.6), 52, l2)
# L3 a lie ticks one off
def l3(t, u):
    c = CROWD[3]; c.place(-110.0, 7.8, -60)
    c.pose(talking(t, LS(3), WI(3, 4), {'armR': -40 if t < WI(3, 4) else -10}, base='smug'))
    o = CROWD[1]; o.place(-107.3, 6.4, 120); o.pose({'face': 'smile'})
shot(cut(3), (-104.4, -1.6, 7.0), (-104.9, -0.8, 7.2), (-109.4, 7.6, 7.2), (-109.4, 7.6, 7.6), 46, l3)
# L4 Bin, born with exactly one
def l4(t, u):
    BIN.place(-66.0, 8.4, -90); BIN.pose(keyed([(0, {'face': 'smile'}), (WI(4, 7), {'face': 'happy', 'headx': -14})], t))
shot(cut(4), (-66.0, 1.0, 5.2), (-66.0, 2.6, 5.5), (-66.0, 8.4, 5.6), (-66.0, 8.4, 6.6), 44, l4)
# L5 the whole class laughs
def classroom(t, laugh=False, bin_face='smile', bin_seat=5):
    faces = ['laugh', 'laugh', 'happy', 'laugh', 'laugh', None, 'laugh', 'laugh']
    who = [CROWD[1], CROWD[4], CROWD[8], WH[0], WH[1], None, CROWD[10], CROWD[6]]
    for i, k in enumerate(who):
        if k is None: continue
        f_ = faces[i] if laugh else 'stern'
        P = {'face': f_, 'lean': (-8 + 6 * math.sin(2 * math.pi * 3 * t + i)) if laugh else 0, 'head': 0}
        if laugh and i in (0, 3): P.update(armR=-80 if i == 0 else -70, armRz=-20)
        if laugh: P['head'] = -60 if SEATS[i][0] < SEATS[bin_seat][0] else 60
        seat(k, i, P)
    seat(BIN, bin_seat, {'face': bin_face})
def l5(t, u):
    classroom(t, laugh=True)
    TEO.place(CX + 0.0, CY - 7.5, 70); TEO.pose(talking(t, WI(5, 5), LE(5), {'armR': -95, 'face': 'laugh', 'lean': -6}, base='laugh'))
shot(cut(5), (CX - 10, CY - 12, 7.5), (CX - 8.5, CY - 11.0, 7.2), (CX + 1, CY - 2, 3.4), (CX + 1.5, CY - 2, 3.4), 60, l5)
# L6 Bin doesn't mind
def l6(t, u):
    classroom(t, laugh=True, bin_face='smile')
    BIN.pose(sit(keyed([(0, {'face': 'smile'}), (WI(6, 3), {'face': 'happy', 'armL': -30, 'armR': -30, 'armLz': 25, 'armRz': 25})], t)))
shot(cut(6), (CX + 2.5, CY - 4.6, 3.8), (CX + 2.3, CY - 4.0, 3.9), SEATS[5] + (2.9,), SEATS[5] + (3.0,), 40, l6)
# L7 he has never lied
def l7(t, u):
    classroom(t, bin_face='smile')
shot(cut(7), (CX + 2.5, CY - 8.5, 6.2), (CX + 2.5, CY - 7.5, 6.5), SEATS[5] + (4.8,), SEATS[5] + (5.6,), 36, l7)
# L8 a: everyone trusts him (hand up in class)
def l8a(t, u):
    classroom(t); BIN.pose(sit({'face': 'happy', 'armR': -170}))
shot(cut(8), (CX - 4, CY - 11, 4.5), (CX - 3.2, CY - 10.2, 4.6), (CX + 2.5, CY - 1, 3.6), (CX + 2.5, CY - 1, 3.6), 54, l8a)
# L8 b: the teacher nods
def l8b(t, u):
    TEACH.place(CX + 4.5, CY + 10.4, -90); TEACH.pose(keyed([(0, {'face': 'smile'}), (WI(8, 5) + 0.2, {'face': 'happy', 'headx': 14}), (WI(8, 5) + 0.45, {'face': 'happy'})], t))
shot(cut(8, 5), (CX + 4.0, CY + 1.2, 6.4), (CX + 4.2, CY + 2.4, 6.6), (CX + 4.5, CY + 10.4, 6.0), (CX + 4.5, CY + 10.4, 6.4), 42, l8b)
# L8 c: friends high-five him
def l8c(t, u):
    BIN.place(-84.0, 7.6, 0); WH[0].place(-81.4, 7.6, 180); WH[1].place(-82.6, 9.6, -90)
    hf = WI(8, 8) + 0.1
    BIN.pose(keyed([(0, {'face': 'happy'}), (hf - 0.15, {'face': 'happy', 'armR': -150, 'armRz': 10})], t))
    WH[0].pose(keyed([(0, {'face': 'happy'}), (hf - 0.15, {'face': 'laugh', 'armL': -150, 'armLz': 10})], t))
    WH[1].pose({'face': 'happy', 'armL': -60, 'armR': -60})
shot(cut(8, 8), (-82.6, -0.5, 5.0), (-82.8, 0.4, 5.2), (-82.6, 8.2, 5.0), (-82.6, 8.2, 5.4), 50, l8c)
# L8 d: even the ice cream man hands one over, no questions
def l8d(t, u):
    ICE.place(KCX + 0.2, KCY + 2.3, -90); BIN.place(KCX + 0.6, KCY - 2.3, 90)
    give = WI(8, 14) - 0.1
    ICE.pose(keyed([(0, {'face': 'smile'}), (give, {'face': 'happy', 'armR': -80})], t))
    BIN.pose(keyed([(0, {'face': 'smile'}), (give + 0.2, {'face': 'happy', 'armL': -75})], t))
    bpy.context.view_layer.update()
    h = BIN.arm['L'] if t >= give + 0.2 else ICE.arm['R']
    p = h.matrix_world @ Vector((0, 0, -2.1)); CONE.location = p
shot(cut(8, 11), (KCX + 6.5, KCY - 4.5, 5.0), (KCX + 5.5, KCY - 4.0, 5.2), (KCX + 0.4, KCY, 4.6), (KCX + 0.4, KCY, 4.8), 50, l8d)
# L9 but Teo is the opposite
def teostreet(t, P):
    TEO.place(-60.0, -2.0, -90); TEO.pose(P)
shot(cut(9), (-60.0, -10, 3.0), (-60.0, -9, 3.4), (-60.0, -2, 5.5), (-60.0, -2, 6.8), 48, lambda t, u: teostreet(t, keyed([(0, {'face': 'smug'}), (WI(9, 3), {'face': 'smug', 'armL': -20, 'armLz': 40, 'armR': -20, 'armRz': 40})], t)))
# L10 999 lies, spent like small change
def l10(t, u):
    teostreet(t, keyed([(0, {'face': 'smug', 'armLz': 40, 'armRz': 40}), (WI(10, 9), {'face': 'laugh', 'armR': -120, 'armLz': 40})], t))
shot(cut(10), (-58.5, -6.0, 3.0), (-58.8, -5.5, 2.8), (-60.0, -2, 7.4), (-60.0, -2, 7.8), 46, l10)
# L11 the dog ate my homework (998)
def l11(t, u):
    TEACH.place(CX + 5.2, CY + 7.4, -120); TEACH.pose({'face': 'stern', 'armL': -10, 'armR': -10})
    TEO.place(CX + 1.0, CY + 1.6, 70); TEO.pose(talking(t, LS(11), WI(11, 8) - 0.1, {'armR': -60, 'armL': -60}, base='worried'))
shot(cut(11), (CX - 4.5, CY - 4.5, 5.2), (CX - 3.8, CY - 4.0, 5.4), (CX + 1.6, CY + 3.0, 5.6), (CX + 1.6, CY + 3.0, 6.2), 46, l11)
# L12 I didn't eat the cookies (997)
def l12(t, u):
    TMOM.place(IX - 5.2, IY - 6.0, -10); TMOM.pose({'face': 'stern', 'armL': -35, 'armR': -35, 'armLz': -30, 'armRz': -30})
    TEO.place(IX - 1.6, IY - 6.4, 175); TEO.pose(talking(t, LS(12), WI(12, 5) - 0.1, {'armR': -20, 'armL': -20}, base='smug'))
shot(cut(12), (IX - 3.4, IY - 14.5, 5.2), (IX - 3.3, IY - 13.5, 5.6), (IX - 3.4, IY - 6.0, 5.4), (IX - 3.4, IY - 6.0, 6.4), 44, l12)
# L13 a rumour behind the houses
def whisper(t, talker=True):
    WH[0].place(-71.6, 14.6, 180); WH[1].place(-73.1, 14.2, 0)
    WH[0].pose(talking(t, LS(14), LE(14), {'armR': -40, 'headroll': 8}, base='smug') if talker else {'face': 'smug'})
    WH[1].pose({'face': 'shock' if t > WI(14, 8) else 'stern', 'headroll': -6})
    TEO.place(-74.4, 11.0, 30); TEO.pose({'face': 'shock' if t > WI(14, 8) else 'worried', 'lean': -10, 'head': 30})
shot(cut(13), (-71.0, 2.5, 4.4), (-71.4, 3.4, 4.6), (-72.7, 13.4, 4.4), (-72.7, 13.4, 4.6), 50, lambda t, u: whisper(t, False))
# L14 "use it all up and everything you say comes true"
shot(cut(14), (-69.4, 12.6, 5.6), (-69.7, 12.9, 5.6), (-72.4, 14.4, 4.9), (-72.4, 14.4, 5.0), 38, lambda t, u: whisper(t))
shot(cut(14, 8), (-76.4, 7.6, 4.6), (-76.1, 8.0, 4.8), (-74.4, 11.0, 4.7), (-74.4, 11.0, 4.8), 34, lambda t, u: whisper(t))
# L15 his eyes light up
def l15(t, u):
    TEO.place(-74.4, 11.0, -60); TEO.pose(keyed([(0, {'face': 'shock'}), (WI(15, 3), {'face': 'smug', 'headx': -10})], t))
shot(cut(15), (-73.7, 6.4, 4.9), (-73.9, 7.6, 4.9), (-74.4, 11.0, 4.7), (-74.4, 11.0, 5.4), 34, l15)
# L16-25 the plaza
CRING = []
rs_ = random.Random(3)
for i in range(12):
    a = -math.pi / 2 + (i - 5.5) * 0.24; r = 12.5 + rs_.uniform(-0.8, 1.8)
    CRING.append((PX + r * math.cos(a), PY - 4.6 + r * math.sin(a) + 4.6, math.degrees(math.atan2(PY - 4.6 - (PY - 4.6 + r * math.sin(a)), PX - (PX + r * math.cos(a))))))
TEOP = (PX, PY - 5.75)
def teo_plaza(t, P):
    TEO.place(TEOP[0], TEOP[1], -90, z=1.35); TEO.pose(P)
def crowd_plaza(t, gather=1.0, face='stern', who=12, P=None):
    for i, c in enumerate(CROWD[:who]):
        x, y, h = CRING[i]
        if gather < 1:
            k = smooth(gather * 1.6 - (i % 5) * 0.12)
            x = x + (1 - k) * (x - PX) * 1.6; y = y + (1 - k) * (y - PY) * 1.6
            c.place(x, y, h); c.pose(walk(t + i * 0.3, {'face': face}) if k < 1 else {'face': face})
        else:
            c.place(x, y, h); c.pose(dict(P or {}, face=face))
    WH[0].place(PX - 9.6, PY - 15.2, 70); WH[1].place(PX - 8.3, PY - 15.8, 75)
    WH[0].pose({'face': 'smug'}); WH[1].pose({'face': 'smug'})
def lies(t, t0, t1, P):
    return talking(t, t0, t1, P, base='smug')
def l16(t, u):
    teo_plaza(t, lies(t, WI(16, 6), LE(16) + 0.4, {'armR': -60 + 20 * math.sin(9 * t), 'armL': -40}))
    crowd_plaza(t, gather=0.15 + 0.3 * u, who=5)
shot(cut(16), (PX - 30, PY - 34, 22), (PX - 24, PY - 30, 18), (PX, PY, 3), (PX, PY, 3), 56, l16)
shot(cut(16, 6), (PX - 1.4, PY - 11, 3.4), (PX - 1.0, PY - 10, 3.6), (PX, PY - 5.75, 7.0), (PX, PY - 5.75, 7.6), 42, l16)
def l17(t, u):
    teo_plaza(t, lies(t, LS(17), LE(17) + 0.3, {'armR': -70 + 25 * math.sin(11 * t), 'armL': -50}))
    crowd_plaza(t, gather=0.6, who=8)
for j, (cp, tg) in enumerate((((PX + 1.6, PY - 8.0, 8.3), (PX, PY - 5.75, 10.0)), ((PX - 2.0, PY - 7.6, 8.8), (PX, PY - 5.75, 10.0)), ((PX + 0.3, PY - 7.0, 9.4), (PX, PY - 5.75, 10.0)))):
    shot(cut(17, 2 * j), cp, (cp[0], cp[1] + 0.5, cp[2]), tg, tg, 40 - 4 * j, l17)
# L18 the whole town comes to watch
def l18(t, u):
    teo_plaza(t, lies(t, LS(18), LE(18) + 0.3, {'armR': -70 + 25 * math.sin(11 * t), 'armL': -50}))
    crowd_plaza(t, gather=0.55 + 0.55 * u)
shot(cut(18), (PX + 2, PY - 28, 13), (PX + 1, PY - 25, 11), (PX, PY - 6, 3.5), (PX, PY - 6, 3.5), 52, l18)
# L19 three, two, one
def l19(t, u):
    teo_plaza(t, lies(t, LS(19), LE(19), {'armR': -90, 'armL': -90}))
    crowd_plaza(t)
for j in range(3):
    shot(cut(19, j), (PX + (-1.2, 1.2, 0)[j], PY - 6.8 + 0.4 * j, 9.6 - 0.2 * j), (PX + (-1.0, 1.0, 0)[j], PY - 6.2 + 0.4 * j, 9.6), (PX, PY - 5.75, 10.0), (PX, PY - 5.75, 10.0), 30 - 3 * j, l19)
# L20 "I'm the richest in town!"
def l20(t, u):
    teo_plaza(t, talking(t, LS(20), LE(20), {'armR': -165, 'armL': -165, 'armRz': 20, 'armLz': 20, 'headx': -12}, base='shout'))
    crowd_plaza(t, face='shock')
shot(cut(20), (PX + 2.8, PY - 9.5, 2.4), (PX + 2.4, PY - 9.0, 2.2), (PX, PY - 5.75, 7.6), (PX, PY - 5.75, 8.2), 50, l20)
# L21 his number hits zero
def l21(t, u):
    teo_plaza(t, {'face': 'happy', 'armR': -165, 'armL': -165, 'armRz': 20, 'armLz': 20, 'headx': -16}); crowd_plaza(t, face='shock')
shot(cut(21), (PX + 0.6, PY - 8.6, 8.6), (PX + 0.5, PY - 8.0, 9.2), (PX, PY - 5.75, 9.0), (PX, PY - 5.75, 10.1), 34, l21)
# L22 everyone holds their breath
def l22(t, u):
    teo_plaza(t, {'face': 'happy', 'armR': -165, 'armL': -165, 'armRz': 20, 'armLz': 20, 'headx': -16})
    crowd_plaza(t, face='shock', P={'headx': -8})
shot(cut(22), (PX - 3, PY - 3.8, 6.4), (PX - 3.2, PY - 4.6, 6.2), (PX - 3, PY - 15, 4.4), (PX - 2.5, PY - 15, 4.4), 48, l22)
# L23 ...and nothing happens
def l23(t, u):
    teo_plaza(t, keyed([(0, {'face': 'happy', 'armR': -165, 'armL': -165, 'armRz': 20, 'armLz': 20, 'headx': -16}), (WI(23, 4), {'face': 'worried', 'armR': -120, 'armL': -120, 'armRz': 20, 'armLz': 20, 'head': 30})], t, 0.4))
    crowd_plaza(t, face='stern')
shot(cut(23), (PX - 9, PY - 20, 24), (PX - 8, PY - 19, 25), (PX, PY - 5, 2), (PX, PY - 5, 2), 50, l23)
# L24 "I'm the king!" ... still nothing; the crowd drifts off
def l24(t, u):
    teo_plaza(t, talking(t, WI(24, 3), WI(24, 6), {'armR': -165, 'armL': -100, 'headx': -8}, base='angry'))
    crowd_plaza(t, face='stern')
    if t >= WI(24, 6):
        for i, c in enumerate(CROWD):
            x, y, h = CRING[i]; k = (t - WI(24, 6)) * 1.8
            c.place(x - math.cos(h * D2R) * k, y - math.sin(h * D2R) * k, h + 180); c.pose(walk(t + i * 0.3, {'face': 'stern'}))
shot(cut(24), (PX - 2.4, PY - 9.4, 4.0), (PX - 2.0, PY - 8.8, 3.8), (PX, PY - 5.75, 7.0), (PX, PY - 5.75, 7.4), 46, l24)
shot(cut(24, 6), (PX + 10, PY - 26, 9), (PX + 9, PY - 25, 8.5), (PX, PY - 6, 3.4), (PX, PY - 6, 3.4), 54, l24)
# L25 the rumour was just a lie: the two whisperers each lose one
def l25(t, u):
    teo_plaza(t, {'face': 'sad', 'armL': 0, 'armR': 0, 'headx': 20})
    WH[0].place(PX - 9.6, PY - 15.2, 210); WH[1].place(PX - 8.3, PY - 15.8, 215)
    WH[0].pose(keyed([(0, {'face': 'smug'}), (WI(25, 7), {'face': 'laugh', 'armR': -60})], t)); WH[1].pose(keyed([(0, {'face': 'smug'}), (WI(25, 7) + 0.12, {'face': 'laugh'})], t))
shot(cut(25), (PX - 12.6, PY - 22.8, 4.6), (PX - 12.2, PY - 22.0, 4.9), (PX - 8.9, PY - 15.5, 5.4), (PX - 8.9, PY - 15.5, 6.6), 40, l25)

# ---- night
# L26 the storm, the blackout sweeps the street
shot(cut(26), (-150, -14, 30), (-142, -12, 26), (-66, 6, 3), (-66, 6, 3), 62, nothing, rain=True)
shot(cut(26, 6), (-100, -3, 5.4), (-98, -2.5, 5.4), (-60, 14, 9), (-56, 14, 9), 60, nothing, rain=True)
# L27-34 the candle-lit living room
def sofa(t, bp, nap, bin_x=SX_ + 1.6, na_x=SX_ - 0.4):
    BIN.place(bin_x, SY_ - 0.2, -90, z=1.9 - 2.0); BIN.pose(sit(bp))
    NA.place(na_x, SY_ + 0.2, -75, z=(1.9 - 1.6)); NA.pose(sit(nap))
def l27(t, u):
    sofa(t, {'face': 'worried', 'head': 20}, {'face': 'scared', 'lean': 8, 'armR': -70, 'armRz': -10, 'head': -20}, na_x=SX_ + 0.2)
shot(cut(27), (SX_ + 1.5, SY_ - 11.5, 5.2), (SX_ + 1.2, SY_ - 10.4, 5.0), (SX_ + 1.0, SY_, 3.4), (SX_ + 1.0, SY_, 3.6), 48, l27)
def l28(t, u):
    sofa(t, {'face': 'worried', 'head': 20}, talking(t, LS(28), LE(28), {'lean': 8, 'armR': -70, 'head': -40, 'headx': -12}, base='scared'), na_x=SX_ + 0.2)
shot(cut(28), (SX_ - 1.6, SY_ - 3.8, 3.6), (SX_ - 1.4, SY_ - 3.4, 3.7), (SX_ + 0.2, SY_ + 0.2, 3.6), (SX_ + 0.2, SY_ + 0.2, 3.7), 38, l28)
def l29(t, u):
    sofa(t, keyed([(0, {'face': 'scared', 'head': 15}), (WI(29, 3), {'face': 'panic', 'head': -35})], t), {'face': 'scared', 'lean': 8, 'armR': -70, 'head': -20}, na_x=SX_ + 0.2)
shot(cut(29), (SX_ + 2.6, SY_ - 4.2, 4.6), (SX_ + 2.5, SY_ - 3.8, 4.6), (SX_ + 1.6, SY_ - 0.2, 4.6), (SX_ + 1.6, SY_ - 0.2, 4.6), 34, l29)
def l30(t, u):
    sofa(t, {'face': 'worried', 'headx': -28}, {'face': 'scared', 'lean': 8, 'armR': -70, 'head': -20}, na_x=SX_ + 0.2)
shot(cut(30), (SX_ + 1.0, SY_ - 3.2, 2.2), (SX_ + 1.1, SY_ - 3.0, 2.0), (SX_ + 1.6, SY_ - 0.2, 7.4), (SX_ + 1.6, SY_ - 0.2, 7.2), 44, l30)
def l31(t, u):
    sofa(t, keyed([(0, {'face': 'worried'}), (WI(31, 2) - 0.2, {'face': 'determined', 'head': 30})], t, 0.3), {'face': 'scared', 'lean': 8, 'armR': -70, 'head': -20}, na_x=SX_ + 0.2)
shot(cut(31), (SX_ + 2.2, SY_ - 3.4, 4.6), (SX_ + 2.0, SY_ - 2.8, 4.6), (SX_ + 1.6, SY_ - 0.2, 4.5), (SX_ + 1.6, SY_ - 0.2, 4.5), 30, l31)
def l32(t, u):
    sofa(t, talking(t, LS(32), LE(32), {'head': 35, 'armL': -45, 'armLz': -25}, base='happy'), {'face': 'worried', 'lean': 8, 'armR': -70, 'head': -30}, na_x=SX_ + 0.2)
shot(cut(32), (SX_ + 0.9, SY_ - 5.6, 4.2), (SX_ + 0.9, SY_ - 5.0, 4.2), (SX_ + 0.9, SY_, 3.9), (SX_ + 0.9, SY_, 3.9), 40, l32)
def l33(t, u):
    sofa(t, {'face': 'happy', 'head': 35, 'armL': -45, 'armLz': -25}, {'face': 'smile', 'lean': 8, 'armR': -70, 'head': -30}, na_x=SX_ + 0.2)
shot(cut(33), (SX_ + 1.0, SY_ - 3.0, 7.2), (SX_ + 1.0, SY_ - 2.6, 7.3), (SX_ + 1.6, SY_ - 0.2, 7.2), (SX_ + 1.6, SY_ - 0.2, 7.3), 30, l33)
def l34(t, u):
    sofa(t, {'face': 'happy', 'armL': -55, 'armLz': -30, 'head': 20}, keyed([(0, {'face': 'smile', 'lean': 14, 'armR': -80, 'armL': -80, 'head': -30}), (WI(34, 7), {'face': 'sleep', 'lean': 18, 'armR': -80, 'armL': -80, 'head': -30, 'headroll': -14})], t, 0.5), na_x=SX_ + 0.6)
shot(cut(34), (SX_ + 0.2, SY_ - 8.2, 4.4), (SX_ + 0.4, SY_ - 7.4, 4.2), (SX_ + 0.9, SY_, 3.4), (SX_ + 0.9, SY_, 3.4), 40, l34)
# L35 mum comes in and holds them both (framed below her head)
def momin(t, u):
    o = smooth((t - LS(35)) / 0.8); IDOOR.rotation_euler = (0, 0, -100 * D2R * o); OUTL.data.energy = 300 * o
    if t < WI(35, 5):
        k = smooth((t - LS(35) - 0.3) / 1.0); MOM.place(IX + 7 - 6.0 * k, IY - 1.0 - 2.0 * k, -110); MOM.pose(walk(t, {'face': 'smile'}) if k < 1 else {'face': 'smile'})
    else:
        MOM.place(SX_ + 0.6, SY_ - 1.9, 90); MOM.pose({'face': 'happy', 'armL': -75, 'armR': -75, 'armLz': 25, 'armRz': 25, 'lean': 22})
    sofa(t, {'face': 'happy' if t > WI(35, 5) else 'smile', 'head': 0, 'headx': -10}, {'face': 'sleep', 'lean': 18, 'armR': -80, 'armL': -80, 'head': -30, 'headroll': -14}, na_x=SX_ + 0.6)
shot(cut(35), (SX_ + 3.2, SY_ - 9.8, 2.8), (SX_ + 2.8, SY_ - 9.0, 2.8), (SX_ + 2.6, SY_, 3.6), (SX_ + 1.4, SY_, 3.6), 52, momin)
# L36 "everything will be okay"
def l36(t, u):
    MOM.place(SX_ + 0.6, SY_ - 1.9, 90); MOM.pose(talking(t, WI(36, 2), LE(36), {'armL': -75, 'armR': -75, 'armLz': 25, 'armRz': 25, 'lean': 22}, base='happy'))
    sofa(t, {'face': 'happy', 'headx': -10}, {'face': 'sleep', 'lean': 18, 'armR': -80, 'armL': -80, 'head': -30, 'headroll': -14}, na_x=SX_ + 0.6)
shot(cut(36), (SX_ - 2.6, SY_ - 3.6, 4.6), (SX_ - 2.4, SY_ - 3.3, 4.6), (SX_ + 0.4, SY_ - 1.6, 5.0), (SX_ + 0.4, SY_ - 1.6, 5.0), 34, l36)
# L37 Bin looks up at her head
def hold(t, bfx=-34, bf='smile'):
    MOM.place(SX_ + 0.6, SY_ - 1.9, 90); MOM.pose({'face': 'happy', 'armL': -75, 'armR': -75, 'armLz': 25, 'armRz': 25, 'lean': 22})
    sofa(t, {'face': bf, 'headx': bfx}, {'face': 'sleep', 'lean': 18, 'armR': -80, 'armL': -80, 'head': -30, 'headroll': -14}, na_x=SX_ + 0.6)
shot(cut(37), (SX_ + 2.0, SY_ - 3.0, 6.8), (SX_ + 1.9, SY_ - 2.8, 6.9), (SX_ + 1.6, SY_ - 0.2, 4.4), (SX_ + 1.6, SY_ - 0.2, 4.4), 38, lambda t, u: hold(t, bfx=-34 * smooth(u * 2), bf='worried'))
# L38 her number is zero -> tilt up from her face to it
def momtop(): return (SX_ + 0.6, SY_ - 1.9 - 1.5, 7.25 * 1.22 * 0.92)
shot(cut(38), (SX_ + 1.9, SY_ - 0.6, 3.6), (SX_ + 1.9, SY_ - 0.6, 3.6), (SX_ + 0.6, SY_ - 3.3, 5.6), (SX_ + 0.6, SY_ - 3.2, 8.4), 50, lambda t, u: hold(t))
# L39 zero for a very long time
shot(cut(39), (SX_ + 0.6, SY_ - 9.5, 7.6), (SX_ + 0.6, SY_ - 8.5, 7.8), (SX_ + 0.6, SY_ - 2.6, 7.6), (SX_ + 0.6, SY_ - 2.6, 8.2), 44, lambda t, u: hold(t, -20, 'happy'))
# L40 she spent every one of them on that sentence, every night
shot(cut(40), (SX_ - 4, SY_ - 14, 7.6), (SX_ - 2.6, SY_ - 12.6, 7.2), (SX_ + 0.6, SY_ - 1, 4.6), (SX_ + 0.6, SY_ - 1, 4.8), 50, lambda t, u: hold(t, -20, 'happy'))
# L41 outside in the rain, the one candle-lit window; pull away
shot(cut(41), (APX + 1, 1.0, 9.0), (APX + 3, 6.5, 8.0), (APX, -12, 12.6), (APX, -12, 14.0), 46, nothing, rain=True)

for i, s in enumerate(SHOTS): s['t1'] = SHOTS[i + 1]['t0'] if i + 1 < len(SHOTS) else END

def apply(t):
    reset(); world_state(t)
    s = next(s for s in reversed(SHOTS) if t >= s['t0'])
    u = (t - s['t0']) / (s['t1'] - s['t0'])
    ov = s['setup'](t, u) or {}
    k = smooth(u)
    c, g = lerp(s['c0'], s['c1'], k), lerp(s['g0'], s['g1'], k)
    i_ = SHOTS.index(s)
    if not s['still']:
        sgn = 1 if i_ % 2 else -1
        a = sgn * 5 * D2R * (k - 0.5)
        d = Vector(c) - Vector(g)
        d = Vector((d.x * math.cos(a) - d.y * math.sin(a), d.x * math.sin(a) + d.y * math.cos(a), d.z))
        c = tuple(Vector(g) + d + Vector((0, 0, 0.25 * (k - 0.5))))
    cam_set(c, g, s['fov'])
    bpy.context.view_layer.update()
    tags(t)

# ---------------------------------------------------------------- main
if __name__ == '__main__':
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    mode, out = argv[0], os.path.abspath(argv[1]); os.makedirs(out, exist_ok=True)
    if mode == 'stills':
        S.render.resolution_percentage = int(argv[2]) if len(argv) > 2 else 50
        E.taa_render_samples = 12
        only = [int(x) for x in argv[3].split(',')] if len(argv) > 3 else range(len(SHOTS))
        for i in only:
            s = SHOTS[i]; t = s['t0'] + 0.6 * (s['t1'] - s['t0'])
            apply(t); S.render.filepath = os.path.join(out, 's%02d.png' % i)
            bpy.ops.render.render(write_still=True); print('still', i, round(t, 2), flush=True)
    elif mode == 'frames':
        A, B = int(argv[2]), int(argv[3])
        for f in range(A, B):
            apply(f / FPS); S.render.filepath = os.path.join(out, 'f%05d.png' % f)
            bpy.ops.render.render(write_still=True); print('frame', f, flush=True)
        print('done', flush=True)
    elif mode == 'list':   # preview stills at given frames, half resolution
        S.render.resolution_percentage = 50; E.taa_render_samples = 16
        for f in [int(x) for x in argv[2].split(',')]:
            apply(f / FPS); i = SHOTS.index(next(s for s in reversed(SHOTS) if f / FPS >= s['t0']))
            S.render.filepath = os.path.join(out, 's%02d_f%05d.png' % (i, f))
            bpy.ops.render.render(write_still=True); print('still', i, f, flush=True)
    elif mode == 'events':
        pops = [T_POP + 0.05 * k for k in range(6)] + [WI(3, 7), WI(4, 7), WI(11, 8), WI(12, 5), WI(17, 0), WI(17, 2), WI(17, 4),
                WI(19, 0) - 0.04, WI(19, 1), WI(19, 2), WI(25, 7), WI(25, 7) + 0.12]
        ev = dict(T_NIGHT=T_NIGHT, T_OUT=T_OUT, LIGHTNING=LIGHTNING, T_BIN0=T_BIN0, T_REVEAL=T_REVEAL, T_TEO0=WI(21, 7), pops=pops,
                  rattle=[[LS(16) + 0.3, WI(17, 0)], [LS(18), WI(19, 0) - 0.1]], laugh=LS(5), laugh2=WI(25, 7), door=LS(35),
                  plaza=[cut(16), cut(26)], classroom=[[cut(5), cut(9)], [cut(11), cut(12)]], silence=[WI(21, 7) + 0.5, LS(25)],
                  sparkle=[WI(14, 13), T_REVEAL - 0.15], whoosh=[cut(16), T_NIGHT], END=END, lines=LINES,
                  shots=[[s['t0'], s['t1'], int(s['rain'])] for s in SHOTS])
        json.dump(ev, open(os.path.join(out, 'events.json'), 'w'))
    elif mode == 'info':
        for i, s in enumerate(SHOTS): print(i, round(s['t0'], 3), round(s['t1'] - s['t0'], 3), int(s['rain']))
