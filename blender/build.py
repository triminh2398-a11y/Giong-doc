# Luật Đèn - Roblox-style horror short, built entirely in Blender from code.
# usage: python3 build.py stills OUT [scale]     -> mid-shot stills (50%, 12 spp)
#        python3 build.py frames OUT A B         -> full frames A..B-1 (1080x1920, 32 spp)
import bpy, bmesh, math, os, sys, json, random
from mathutils import Vector, Euler
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
FPS = 30
TJ = json.load(open(os.path.join(HERE, 'timing.json')))
WORDS = TJ['words']
TM, TMW, TMEND, END = TJ['TM'], TJ['TMW'], TJ['TMEND'], TJ['END']
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
ramp.color_ramp.elements[0].color = lin4('#212B54'); ramp.color_ramp.elements[1].color = lin4('#060917')
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

MOON = light('moon', 'SUN', 0.55, '#9EB8FF', rot=(52 * D2R, 0, -35 * D2R), angle=0.6 * D2R)

# ---------------------------------------------------------------- ground
grass = noise_mat('grass', '#336B24', '#42802B', 1.4)
GRASS_P = WETMATS[-1][0]
asph = noise_mat('asph', '#212126', '#2E2E33', 6)
side = noise_mat('side', '#7E7E86', '#8E8E96', 3)
yline = mat('yline', '#FAC726', 0.6)
box('grass', (600, 600, 0.2), (0, 0, -0.1), grass)
box('road', (600, 12, 0.1), (0, 0, 0.0), asph)
box('walkN', (600, 4, 0.3), (0, 8, 0.0), side)
box('walkS', (600, 4, 0.3), (0, -8, 0.0), side)
for x in range(-180, 181, 7): box('dash', (3.5, 0.35, 0.12), (x, 0, 0.01), yline)

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
FACES = ['smile', 'stern', 'angry', 'determined', 'worried', 'scared', 'panic', 'shock', 'cry']
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
mm = bpy.data.materials.new('face_monster'); mm.use_nodes = True; nt = mm.node_tree
for n in list(nt.nodes):
    if n.type != 'OUTPUT_MATERIAL': nt.nodes.remove(n)
it = nt.nodes.new('ShaderNodeTexImage'); it.image = bpy.data.images.load(face_img('monster')); it.extension = 'CLIP'
pb = nt.nodes.new('ShaderNodeBsdfPrincipled'); pb.inputs['Base Color'].default_value = lin4('#0D0D0F'); pb.inputs['Roughness'].default_value = 1
if 'Specular IOR Level' in pb.inputs: pb.inputs['Specular IOR Level'].default_value = 0.1
em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Strength'].default_value = 3.0
nt.links.new(it.outputs['Color'], em.inputs['Color'])
ms = nt.nodes.new('ShaderNodeMixShader')
nt.links.new(it.outputs['Alpha'], ms.inputs[0]); nt.links.new(pb.outputs[0], ms.inputs[1]); nt.links.new(em.outputs[0], ms.inputs[2])
nt.links.new(ms.outputs[0], nt.nodes['Material Output'].inputs['Surface'])
MON_FACE_EM = em.inputs['Strength']

# ---------------------------------------------------------------- characters
class Kid:
    def __init__(s, name, torso, legs, hair, scale=1.0, cap=None, pig=False):
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
        box(name + '_pocket', (0.55, 0.05, 0.45), (0.5, -0.52, 1.45), dk, s.body)
        s.arm = {}; s.leg = {}
        for side, sx in (('L', 1.5), ('R', -1.5)):
            a = empty(name + '_arm' + side, (sx, 0, 2), s.body)
            box(name + '_armm' + side, (1, 1, 2), (0, 0, -1), sk if side else sk, a)
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
            s.cap = box(name + '_capc', (1.62, 1.62, 0.5), (0, 0, 1.55), cm, s.neck)
            box(name + '_brim', (1.4, 0.9, 0.12), (0, -1.05, 1.36), cm, s.neck)
        else:
            box(name + '_hair', (1.62, 1.62, 0.42), (0, 0.04, 1.42), hm, s.neck)
            box(name + '_hairf', (1.62, 0.35, 0.32), (0, -0.66, 1.2), hm, s.neck)
            box(name + '_hairb', (1.62, 0.35, 1.0), (0, 0.66, 0.95), hm, s.neck)
            if pig:
                for sx in (-1, 1): box(name + '_pig', (0.45, 0.45, 0.8), (sx * 0.95, 0.3, 0.8), hm, s.neck)
        s.face = 'stern'; s.flash = None
    def place(s, x, y, heading_deg):
        s.root.location = (x, y, 0); s.root.rotation_euler = (0, 0, (heading_deg + 90) * D2R)
    def hide(s): s.root.location = (0, 0, -500)
    def pose(s, P):
        g = lambda k: P.get(k, 0.0) * D2R
        s.body.rotation_euler = (g('lean'), 0, g('yaw'))
        s.arm['L'].rotation_euler = (g('armL'), 0, 0); s.arm['L'].rotation_euler.y = g('armLz')
        s.arm['R'].rotation_euler = (g('armR'), 0, 0); s.arm['R'].rotation_euler.y = -g('armRz')
        s.leg['L'].rotation_euler = (g('legL'), 0, 0); s.leg['R'].rotation_euler = (g('legR'), 0, 0)
        s.neck.rotation_euler = (g('headx'), g('headroll'), g('head'))
        f = P.get('face', 'stern')
        if f != s.face:
            s.head.material_slots[0].material = FMAT[f]; s.face = f

class Monster:
    def __init__(s):
        k = mat('mon', '#0D0D0F', 1.0)
        s.root = empty('mon')
        for sx in (-0.55, 0.55):
            box('mleg', (0.62, 0.62, 4.4), (sx, 0, 2.2), k, s.root)
        s.hip = empty('mhip', (0, 0, 4.4), s.root)
        box('mchest', (1.6, 0.7, 3.4), (0, 0, 1.7), k, s.hip)
        s.arm = {}
        for side, sx in (('L', 1.05), ('R', -1.05)):
            a = empty('marm' + side, (sx, 0, 3.25), s.hip)
            box('marmm', (0.34, 0.34, 5.8), (0, 0, -2.9), k, a)
            for j, fx in enumerate((-0.14, 0.0, 0.14)):
                f = empty('mfing', (fx, 0, -5.8), a); f.rotation_euler = ((j - 1) * 14 * D2R, (j - 1) * 10 * D2R, 0)
                box('mf', (0.09, 0.09, 1.1), (0, 0, -0.55), k, f)
            s.arm[side] = a
        s.neck = empty('mneck', (0, 0, 3.4), s.hip)
        box('mneckm', (0.3, 0.3, 0.35), (0, 0, 0.17), k, s.neck)
        s.head = lathe('mhead', 0.86, 1.8, 0.3, mm, s.neck, (0, 0, 0.3), zc=1.0)
    def place(s, x, y, heading_deg):
        s.root.location = (x, y, 0); s.root.rotation_euler = (0, 0, (heading_deg + 90) * D2R)
    def hide(s): s.root.location = (0, 0, -600)
    def pose(s, P):
        g = lambda k: P.get(k, 0.0) * D2R
        s.hip.rotation_euler = (g('bend'), 0, 0)
        s.arm['L'].rotation_euler = (g('armL'), 0, g('armLz')); s.arm['R'].rotation_euler = (g('armR'), 0, -g('armRz'))
        s.neck.rotation_euler = (g('headx'), g('headroll'), g('head'))

BIN = Kid('bin', '#2F6FD6', '#23262E', '#2A1B12')
NA = Kid('na', '#F2588F', '#7B4FC9', '#5A3A22', 0.8, pig=True)
TEO = Kid('teo', '#3FA34D', '#2E3A8C', '#111111', cap='#D62F2F')
RUN = [Kid('r1', '#E8812F', '#2B2B33', '#3B2615'), Kid('r2', '#8E44AD', '#1F4E79', '#111111'), Kid('r3', '#16A085', '#5B3A1E', '#6B4A2A', 0.85)]
MON = Monster()
KIDS = [BIN, NA, TEO] + RUN

# flashlight on Bin's right hand
fl_m = mat('flash', '#2E2E33', 0.4)
hand = empty('hand', (0, 0, -2.0), BIN.arm['R'])
cyl('flashb', 0.22, 0.9, fl_m, hand, (0, -0.2, 0.0), rot=(-28 * D2R + math.pi / 2, 0, 0))
FL = light('flashL', 'SPOT', 1400, '#FFE3B0', hand, (0, -0.6, -0.1), rot=(-28 * D2R, 0, 0), spot_size=34 * D2R, spot_blend=0.25, shadow_soft_size=0.05)
FL.rotation_euler = ((-28 + 180) * D2R, 0, 0) if False else (-28 * D2R, 0, 0)
FL.data.energy = 0
beam_m = bpy.data.materials.new('beam'); beam_m.use_nodes = True; nt = beam_m.node_tree
for n in list(nt.nodes):
    if n.type != 'OUTPUT_MATERIAL': nt.nodes.remove(n)
tr = nt.nodes.new('ShaderNodeBsdfTransparent'); be = nt.nodes.new('ShaderNodeEmission')
be.inputs['Color'].default_value = lin4('#FFE3B0'); be.inputs['Strength'].default_value = 0.12
bms = nt.nodes.new('ShaderNodeMixShader'); bms.inputs[0].default_value = 0.06
nt.links.new(tr.outputs[0], bms.inputs[1]); nt.links.new(be.outputs[0], bms.inputs[2])
nt.links.new(bms.outputs[0], nt.nodes['Material Output'].inputs['Surface'])
try: beam_m.surface_render_method = 'BLENDED'
except Exception: beam_m.blend_method = 'BLEND'
bmb = bmesh.new(); bmesh.ops.create_cone(bmb, cap_ends=False, segments=24, radius1=0.12, radius2=14 * math.tan(17 * D2R), depth=14)
bmesh.ops.translate(bmb, verts=bmb.verts, vec=(0, 0, -7))
me = bpy.data.meshes.new('beam'); bmb.to_mesh(me); bmb.free(); me.materials.append(beam_m)
BEAM = link(bpy.data.objects.new('beam', me), FL)
try: BEAM.visible_shadow = False
except Exception: pass
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
FLASH_BULB = mat('flbulb', '#444444', 0.4, '#FFE3B0', 0)
sphere('flbulbm', 0.13, FLASH_BULB, FL, (0, 0, 0.05))

# ---------------------------------------------------------------- houses
HCOL = ['#C94F3D', '#3F7FBF', '#E0B33A', '#5BAA5B', '#8E5BB5', '#E07A3A', '#D8D8D0', '#3FB0B0']
roof_m = mat('roof', '#3A2E2E', 0.9); frame_m = mat('frame', '#F4F1E8', 0.7); door_m = mat('door', '#6B3E22', 0.8)
black_m = mat('void', '#000000', 1.0)
if 'Specular IOR Level' in black_m.node_tree.nodes['Principled BSDF'].inputs:
    black_m.node_tree.nodes['Principled BSDF'].inputs['Specular IOR Level'].default_value = 0
HOUSES = []
class House:
    def __init__(s, idx, x, north):
        s.idx = idx; s.x = x; s.north = north
        y = 16 if north else -16
        s.root = empty('house%d' % idx, (x, y, 0)); s.root.rotation_euler = (0, 0, 0 if north else math.pi)
        hm = mat('wall%d' % idx, HCOL[idx % len(HCOL)], 0.85)
        box('body', (12, 9, 9), (0, 0, 4.5), hm, s.root)
        me = bpy.data.meshes.new('roof')
        v = [(-6.6, -5, 9), (6.6, -5, 9), (6.6, 5, 9), (-6.6, 5, 9), (-6.6, 0, 13.5), (6.6, 0, 13.5)]
        me.from_pydata(v, [], [(0, 1, 5, 4), (3, 4, 5, 2), (0, 4, 3), (1, 2, 5), (0, 3, 2, 1)]); me.materials.append(roof_m)
        link(bpy.data.objects.new('roof', me), s.root)
        box('porch', (5, 1.6, 0.4), (0, -5.3, 0.2), side, s.root)
        box('doorway', (3.2, 0.02, 6.2), (0, -4.52, 3.1), black_m, s.root)
        box('dframe', (3.8, 0.2, 0.3), (0, -4.55, 6.35), frame_m, s.root)
        s.door = empty('doorpiv', (-1.6, -4.62, 0), s.root)
        box('door', (3.2, 0.2, 6.2), (1.6, 0, 3.1), door_m, s.door)
        box('knob', (0.2, 0.2, 0.2), (2.8, -0.15, 3.0), mat('knob', '#E8C25A', 0.3), s.door)
        s.win = mat('win%d' % idx, '#3A2A10', 0.5, '#FCC773', 6.0)
        for wx in (-3.9, 3.9):
            box('wglass', (2.6, 0.05, 2.6), (wx, -4.53, 5.0), s.win, s.root)
            box('wf1', (3.0, 0.25, 0.25), (wx, -4.6, 6.4), frame_m, s.root); box('wf2', (3.0, 0.25, 0.25), (wx, -4.6, 3.6), frame_m, s.root)
            box('wf3', (0.25, 0.25, 3.0), (wx - 1.4, -4.6, 5.0), frame_m, s.root); box('wf4', (0.25, 0.25, 3.0), (wx + 1.4, -4.6, 5.0), frame_m, s.root)
            box('wf5', (0.12, 0.2, 2.6), (wx, -4.58, 5.0), frame_m, s.root)
        s.wl = light('winL%d' % idx, 'AREA', 260, '#FCC773', s.root, (0, -5.6, 5.0), (-90 * D2R, 0, 0), shadow=False, shape='RECTANGLE', size=10, size_y=3)
        s.porch_m = mat('porchm%d' % idx, '#555555', 0.4, '#FFD08A', 8)
        box('lantern', (0.5, 0.5, 0.7), (2.3, -4.85, 6.9), s.porch_m, s.root)
        s.pl = light('porchL%d' % idx, 'POINT', 650, '#FFC27A', s.root, (2.3, -5.6, 6.6), shadow=False, shadow_soft_size=0.3)
        s.shutter = None
        HOUSES.append(s)
    def set(s, lit, door_open):
        set_emit(s.win, 6.0 if lit else 0.0); s.wl.data.energy = 260 if lit else 0
        set_emit(s.porch_m, 8 if lit else 0); s.pl.data.energy = 650 if lit else 0
        s.door.rotation_euler = (0, 0, -105 * D2R * door_open)

NX = [-32, -16, 0, 16, 32, 48, 64]
for i, x in enumerate(NX): House(i, x, True)
for j, x in enumerate([-32, -16, 0, 16, 32]): House(7 + j, x, False)
H = {h.idx: h for h in HOUSES}
H_TEO, H_SHUT, H_CHAIR, H_BIN, H_NB = H[1], H[0], H[3], H[5], H[6]
# shutter on H_SHUT left window
shm = mat('shutter', '#9AA0A8', 0.6)
H_SHUT.shutter = box('shutter', (3.2, 0.3, 4.6), (0, 0, -2.3), shm, H_SHUT.root, (-3.9, -4.8, 8.0))
box('shbox', (3.4, 0.6, 0.6), (-3.9, -4.85, 8.2), shm, H_SHUT.root)
# rocking chair on H_CHAIR porch
cm_ = mat('chair', '#8A5A33', 0.8)
CHAIR = empty('chair', (4.2, -6.0, 0.4), H_CHAIR.root)
box('seat', (1.6, 1.6, 0.2), (0, 0, 1.4), cm_, CHAIR); box('back', (1.6, 0.2, 2.0), (0, 0.75, 2.4), cm_, CHAIR)
for sx in (-0.7, 0.7):
    box('legc', (0.15, 0.15, 1.3), (sx, -0.6, 0.75), cm_, CHAIR); box('legc', (0.15, 0.15, 1.3), (sx, 0.6, 0.75), cm_, CHAIR)
    box('rocker', (0.15, 2.4, 0.15), (sx, 0, 0.08), cm_, CHAIR)

# ---------------------------------------------------------------- streetlamps
pole_m = mat('pole', '#3C3F46', 0.5)
LAMPS = {}
for x in (-48, -18, 12, 42):
    r = empty('lamp', (x, -8.6, 0))
    box('pole', (0.4, 0.4, 13.2), (0, 0, 6.6), pole_m, r); box('arm', (0.3, 3.8, 0.3), (0, 1.8, 13.0), pole_m, r)
    box('lhead', (1.2, 1.6, 0.5), (0, 3.6, 12.9), pole_m, r)
    bm_ = mat('bulb%d' % x, '#777777', 0.4, '#FFBD6B', 9)
    sphere('bulb', 0.4, bm_, r, (0, 3.6, 12.55))
    L = light('lampL', 'SPOT', 4200, '#FFBD6B', r, (0, 3.6, 12.3), spot_size=118 * D2R, spot_blend=0.35, shadow_soft_size=0.4)
    bc = beam_cone('lbeam', 12.2, 26, r, (0, 3.6, 12.3), strength=0.12, color='#FFC98A')
    LAMPS[x] = (L, bm_, bc)
GX, GY = 58, -9.0
gr = empty('globe', (GX, GY, 0))
box('gpole', (0.45, 0.45, 9.6), (0, 0, 4.8), pole_m, gr)
GLOBE_M = mat('globem', '#777777', 0.3, '#FFD9A0', 14)
sphere('glob', 1.0, GLOBE_M, gr, (0, 0, 10.4))
GLOBE = light('globeL', 'POINT', 9000, '#FFC98A', gr, (0, 0, 10.4), shadow_soft_size=0.9)
GBEAM = beam_cone('gbeam', 9.6, 32, gr, (0, 0, 10.0), strength=0.14, color='#FFD9A0')

# swings near the globe
sw = empty('swings', (68, -18, 0))
for x in (-4, 4):
    for y in (-1.2, 1.2): box('sp', (0.3, 0.3, 6.8), (x, y * 1.0, 3.2), pole_m, sw, rot=(y * 0.12, 0, 0))
box('sbar', (8.6, 0.3, 0.3), (0, 0, 6.6), pole_m, sw)
SWINGS = []
for x, c in ((-1.8, '#D62F2F'), (1.8, '#2F6FD6')):
    p = empty('swp', (x, 0, 6.5), sw)
    for dx in (-0.6, 0.6): box('ch', (0.06, 0.06, 4.5), (dx, 0, -2.25), pole_m, p)
    box('seat', (1.5, 0.7, 0.15), (0, 0, -4.55), mat('sw' + c, c, 0.7), p)
    SWINGS.append(p)

# the cap left behind
CAPOBJ = empty('capobj', (0, 0, -500))
cm2 = mat('teo_cap', '#D62F2F', 0.7)
cyl('capc', 0.68, 0.42, cm2, CAPOBJ, (0, 0, 0.0), center=False)
box('capb', (1.1, 0.8, 0.1), (0, -0.85, 0.05), cm2, CAPOBJ)

# ---------------------------------------------------------------- interior set (clock + bolt)
IX, IY = 0, 300
wall_m = mat('iwall', '#C9B48A', 0.9)
box('iwall', (30, 0.4, 16), (IX, IY + 0.2, 8), wall_m); box('ifloor', (30, 12, 0.2), (IX, IY - 6, 0), mat('ifl', '#6B4A2E', 0.8))
box('idoor', (3.4, 0.25, 6.4), (IX + 5, IY - 0.1, 3.2), door_m)
plate_m = mat('brass', '#C9A24A', 0.35)
box('bplate', (0.3, 0.12, 0.6), (IX + 3.6, IY - 0.32, 4.0), plate_m)
box('bkeep', (0.4, 0.12, 0.5), (IX + 2.9, IY - 0.32, 4.0), plate_m)
BOLT = box('bolt', (1.4, 0.16, 0.18), (0, 0, 0), plate_m, None, (IX + 4.1, IY - 0.42, 4.0))
box('bknob', (0.12, 0.3, 0.12), (0.2, -0.15, 0.15), plate_m, BOLT)
CLK = empty('clock', (IX - 5, IY - 0.3, 7.5), rot=None) if False else empty('clock', (IX - 5, IY - 0.3, 7.5))
cyl('cface', 1.9, 0.2, mat('cface', '#F7F3E8', 0.6), CLK, rot=(math.pi / 2, 0, 0))
cyl('crim', 2.05, 0.15, mat('crim', '#2B2B2B', 0.5), CLK, (0, 0.06, 0), rot=(math.pi / 2, 0, 0))
k_m = mat('ink', '#111111', 0.8)
for i in range(12):
    a = i * 30 * D2R
    box('tick', (0.12, 0.05, 0.4 if i % 3 == 0 else 0.22), (0, 0, 0), k_m, CLK, (1.6 * math.sin(a), -0.12, 1.6 * math.cos(a)), (0, a, 0))
def hand_(name, L_, w, m_):
    p = empty(name, (0, -0.16, 0), CLK); box(name + 'm', (w, 0.05, L_), (0, 0, L_ / 2 - 0.15), m_, p); return p
HOUR = hand_('hourh', 1.0, 0.16, k_m); MINU = hand_('minh', 1.5, 0.11, k_m); SEC = hand_('sech', 1.65, 0.05, mat('red', '#EC1C24', 0.5))
light('ilamp', 'POINT', 900, '#FFC27A', None, (IX - 2, IY - 7, 9), shadow_soft_size=0.6)
light('ilamp2', 'POINT', 260, '#FFC27A', None, (IX + 1.5, IY - 3.5, 6.5), shadow_soft_size=0.4)

# ---------------------------------------------------------------- floodlight towers
TOWERS = []
steel = mat('steel', '#2B2F38', 0.5)
for tx, ty, yaw in ((-58, 22, -0.5), (84, -26, 2.4), (26, 34, 0.2)):
    tr0 = empty('tower', (tx, ty, 0)); tr0.rotation_euler = (0, 0, yaw)
    for sx in (-1.6, 1.6):
        for sy in (-1.6, 1.6):
            box('tleg', (0.35, 0.35, 24), (sx * 0.8, sy * 0.8, 12), steel, tr0, rot=(-sy * 0.055, sx * 0.055, 0))
    for z in range(2, 24, 3):
        w_ = 3.4 - z * 0.06
        box('tb1', (w_, 0.2, 0.2), (0, -w_ / 2, z), steel, tr0); box('tb2', (w_, 0.2, 0.2), (0, w_ / 2, z), steel, tr0)
        box('tb3', (0.2, w_, 0.2), (-w_ / 2, 0, z), steel, tr0); box('tb4', (0.2, w_, 0.2), (w_ / 2, 0, z), steel, tr0)
        box('tx', (0.15, w_ * 1.35, 0.15), (0, -w_ / 2, z + 1.5), steel, tr0, rot=(0.8, 0, math.pi / 2))
    hd = empty('thead', (0, 0, 24.5), tr0); hd.rotation_euler = (-0.55, 0, 0)
    box('tframe', (6.2, 0.6, 2.4), (0, 0.35, 0), steel, hd)
    pm_ = mat('tpanel%d' % tx, '#DDDDDD', 0.3, '#F4F6FF', 12)
    for px in (-2.0, 0, 2.0): box('tpanel', (1.7, 0.1, 1.9), (px, 0.0, 0), pm_, hd)
    L_ = light('towerL', 'SPOT', 3500, '#EEF2FF', hd, (0, -0.4, 0), rot=(math.pi / 2, 0, 0), spot_size=70 * D2R, spot_blend=0.4, shadow_soft_size=1.0)
    bs_ = [beam_cone('tbeam', 46, 11, hd, (px, -0.2, 0), rot=(math.pi / 2, 0, 0), strength=0.07, color='#EEF2FF') for px in (-2.0, 0, 2.0)]
    TOWERS.append((L_, pm_, bs_))

# ---------------------------------------------------------------- city skyline with lit windows
skm = bpy.data.materials.new('skyline'); skm.use_nodes = True; nt = skm.node_tree; pB = nt.nodes['Principled BSDF']
pB.inputs['Base Color'].default_value = lin4('#3A4258'); pB.inputs['Roughness'].default_value = 0.8
tcs = nt.nodes.new('ShaderNodeTexCoord'); sp = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tcs.outputs['Object'], sp.inputs['Vector'])
def mth(op, a=None, b=None):
    n = nt.nodes.new('ShaderNodeMath'); n.operation = op
    for i, v in enumerate((a, b)):
        if v is None: continue
        if isinstance(v, (int, float)): n.inputs[i].default_value = v
        else: nt.links.new(v, n.inputs[i])
    return n.outputs[0]
hcoord = mth('MULTIPLY', mth('ADD', sp.outputs['X'], sp.outputs['Y']), 1 / 2.6)
vcoord = mth('MULTIPLY', sp.outputs['Z'], 1 / 3.2)
fu = mth('FRACT', hcoord); fv = mth('FRACT', vcoord)
winu = mth('MULTIPLY', mth('GREATER_THAN', fu, 0.28), mth('LESS_THAN', fu, 0.72))
winv = mth('MULTIPLY', mth('GREATER_THAN', fv, 0.32), mth('LESS_THAN', fv, 0.78))
cell = nt.nodes.new('ShaderNodeCombineXYZ')
nt.links.new(mth('FLOOR', hcoord), cell.inputs['X']); nt.links.new(mth('FLOOR', vcoord), cell.inputs['Y'])
oi = nt.nodes.new('ShaderNodeObjectInfo'); nt.links.new(mth('MULTIPLY', oi.outputs['Random'], 97.0), cell.inputs['Z'])
wn_ = nt.nodes.new('ShaderNodeTexWhiteNoise'); wn_.noise_dimensions = '3D'; nt.links.new(cell.outputs[0], wn_.inputs['Vector'])
lit = mth('GREATER_THAN', wn_.outputs['Value'], 0.55)
win = mth('MULTIPLY', mth('MULTIPLY', winu, winv), lit)
mcol = nt.nodes.new('ShaderNodeMix'); mcol.data_type = 'RGBA'
mcol.inputs[6].default_value = lin4('#FFE2A6'); mcol.inputs[7].default_value = lin4('#CFE0FF')
nt.links.new(mth('GREATER_THAN', wn_.outputs['Value'], 0.8), mcol.inputs['Factor'])
nt.links.new(mcol.outputs[2], pB.inputs['Emission Color'])
skw = mth('MULTIPLY', win, 2.2); nt.links.new(skw, pB.inputs['Emission Strength'])
SKYW = skw.node.inputs[1]
nt.links.new(mth('MULTIPLY', win, 0.0), pB.inputs['Roughness']) if False else None
rs = random.Random(11)
for i in range(70):
    a = 2 * math.pi * i / 70 + rs.uniform(-0.03, 0.03); rr = rs.uniform(190, 280)
    w_ = rs.uniform(12, 26); h_ = rs.uniform(22, 60) if rs.random() > 0.2 else rs.uniform(60, 90)
    o_ = box('bld', (w_, w_ * rs.uniform(0.7, 1.2), h_), (0, 0, h_ / 2), skm, None, (rr * math.cos(a), rr * math.sin(a), 0))
    o_.rotation_euler = (0, 0, a + math.pi / 2)

# ---------------------------------------------------------------- camera
CAM = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); link(CAM); S.camera = CAM
CAM.data.sensor_fit = 'VERTICAL'; CAM.data.sensor_height = 24; CAM.data.clip_start = 0.1; CAM.data.clip_end = 1000
CAM.data.dof.use_dof = False
def cam_set(p, tgt, fov):
    CAM.location = p
    d = Vector(tgt) - Vector(p); CAM.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    CAM.data.lens = 12 / math.tan(fov * D2R / 2)

# ---------------------------------------------------------------- timing helpers
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
def run(t, P=None, flash=False):
    P = dict(P or {}); ph = math.sin(2 * math.pi * 2.5 * t)
    P['legL'] = 52 * ph; P['legR'] = -52 * ph; P['armL'] = -58 * ph; P['armR'] = -52 if flash else 58 * ph
    P['lean'] = 9
    return P
def flicker(t, td):
    """light dying at td (=word+0.06): flicker 0.12 s before, off after."""
    if t >= td: return False
    if t >= td - 0.12: return math.sin(61 * t) + math.sin(37 * t) > -0.25
    return True

# key moments, all keyed to word indices
T_BINDARK = W(66) + 0.06
T_LAMP = {42: W(71) + 0.06, 12: W(79) + 0.06, -18: W(84) + 0.06}
T_BO = W(111) + 0.06
T_BACK = W(112) - 0.04
T_POP0 = W(30) - 0.04
T_FLASH = W(62)

def world_state(t):
    bo = T_BO <= t < T_BACK
    SKY.default_value = 0.12 if bo else 1.7
    MOON.data.energy = 0.04 if bo else 1.1
    TWINKLE.default_value = t * 0.35
    wet = t >= W(47) - 0.04
    for p_, r0 in WETMATS:
        p_.inputs['Roughness'].default_value = (0.12 if r0 < 0.95 and p_ is not GRASS_P else 0.45) if wet else r0
        if 'Specular IOR Level' in p_.inputs: p_.inputs['Specular IOR Level'].default_value = 0.6 if wet else 0.15
    STARG.default_value = 1.6 / 0.12 * 0.6 if bo else 1.6
    for h in HOUSES:
        lit = not bo
        if h is H_TEO and 2.3 <= t < 5.9: lit = False
        if T_POP0 <= t < W(36) - 0.04 and t < T_POP0 + 0.12 + 0.09 * ((h.idx * 5) % 12): lit = False
        if h is H_BIN and t >= T_BINDARK: lit = False
        door = 1.0 if (t >= T_BACK and h is not H_BIN) else 0.0
        h.set(lit, door)
    for x, (L, bm_, bc) in LAMPS.items():
        on = not bo
        if x in T_LAMP and T_LAMP[x] - 0.12 <= t < T_BACK: on = flicker(t, T_LAMP[x])
        L.data.energy = 4200 if on else 0; set_emit(bm_, 9 if on else 0); bc.hide_render = not on
    gon = flicker(t, T_BO) if t < T_BACK else True
    GLOBE.data.energy = 9000 if gon else 0; set_emit(GLOBE_M, 14 if gon else 0); GBEAM.hide_render = not gon
    for L_, pm_, bs_ in TOWERS:
        L_.data.energy = 0 if bo else 3500; set_emit(pm_, 0 if bo else 12)
        for b_ in bs_: b_.hide_render = bo
    SKYW.default_value = 0 if bo else 1.5
    fon = (t >= T_FLASH) and not bo
    FL.data.energy = 1400 if fon else 0; BEAM.hide_render = not fon; set_emit(FLASH_BULB, 2.5 if fon else 0)
    # props that always move
    for i, p in enumerate(SWINGS):
        f, a = (0.38, 13) if i == 0 else (0.34, 8)
        p.rotation_euler = (a * D2R * math.sin(2 * math.pi * f * t + i), 0, 0)
    CHAIR.rotation_euler = (9 * D2R * math.sin(2 * math.pi * 0.75 * t), 0, 0)
    SEC.rotation_euler = (0, math.floor(t * 2) * 6 * D2R, 0)
    nine = t >= W(28) - 0.04
    MINU.rotation_euler = (0, (0 if nine else 354) * D2R, 0); HOUR.rotation_euler = (0, (270 if nine else 269.5) * D2R, 0)
    if H_SHUT.shutter:
        k = back((t - (W(42) - 0.04)) / 0.14) if t >= W(42) - 0.04 else 0
        H_SHUT.shutter.scale = (1, 1, 0.05 + 0.95 * k)
    kb = back((t - W(46)) / 0.14) if t >= W(46) else 0
    BOLT.location.x = IX + 4.1 - 1.0 * kb
    if t >= W(160) - 0.04:  # Bin's door creaks open onto black
        H_BIN.door.rotation_euler = (0, 0, -100 * D2R * smooth((t - (W(160) - 0.04)) / 1.0))

def reset():
    for k in KIDS: k.hide(); k.pose({})
    MON.hide(); MON.pose({}); CAPOBJ.location = (0, 0, -500)

# ---------------------------------------------------------------- shots
def cut(i): return W(i) - 0.04
SHOTS = []
def shot(t0, cam0, cam1, tg0, tg1, fov, setup):
    SHOTS.append(dict(t0=t0, c0=cam0, c1=cam1, g0=tg0, g1=tg1, fov=fov, setup=setup))
nothing = lambda t, u: None

# S1 wide town obeying
shot(0.0, (-72, -9, 27), (-64, -8, 24), (14, 6, 3), (14, 6, 3), 62, nothing)
# S2 row of lit windows
shot(cut(4), (-10, -6, 6.5), (-6, -4, 6.4), (18, 12, 5.5), (18, 12, 5.5), 50, nothing)
# S3 Teo alone in front of his dark house
def s3(t, u):
    TEO.place(-15, 8.6, -90); TEO.pose(keyed([(0, {'face': 'worried', 'head': 25}), (W(15), {'face': 'worried', 'head': -20})], t))
shot(cut(12), (-15, -3, 4.5), (-15, -1.5, 4.5), (-15, 9, 4.0), (-15, 9, 4.0), 50, s3)
# S4 the thing looms behind Teo
def s4(t, u):
    TEO.place(-15, 8.0, -90); TEO.pose(keyed([(0, {'face': 'worried'}), (W(16), {'face': 'panic', 'head': 140, 'armL': -40, 'armR': -40})], t))
    MON.place(-15, 11.0, -90); MON.pose({'bend': 18 + 34 * smooth(u), 'armL': -40 * smooth(u), 'armR': -55 * smooth(u)})
shot(cut(15), (-13.5, -2, 3.0), (-13.8, 0.5, 3.2), (-15, 9, 6.5), (-15, 9, 6.0), 50, s4)
# S5 empty sidewalk, cap lying
def capset(t, rate=1.0):
    CAPOBJ.location = (-14, 8.4, 0.16); CAPOBJ.rotation_euler = (0, 10 * D2R * math.sin(2 * math.pi * 1.1 * t) * math.exp(-(t - W(17)) * 0.5), 0.6)
shot(cut(17), (-26, -1, 3.2), (-24.5, -0.5, 3.0), (-14, 8.4, 0.8), (-14, 8.4, 0.8), 52, lambda t, u: capset(t))
# S6 close of the cap rocking
shot(cut(20), (-18.6, 3.4, 3.0), (-18.0, 4.0, 2.7), (-14, 8.4, 0.3), (-14, 8.4, 0.3), 36, lambda t, u: capset(t))
# S7 clock ticks over to nine
shot(cut(27), (IX - 5, IY - 9, 7.5), (IX - 5, IY - 7, 7.5), (IX - 5, IY, 7.5), (IX - 5, IY, 7.5), 34, nothing)
# S8 every light pops on
shot(cut(30), (-44, -1, 11), (-40, -0.5, 10.5), (16, 12, 4), (16, 12, 4), 60, nothing)
# S9 everyone runs home
def s9(t, u):
    for i, (k, x0) in enumerate(zip(RUN, (-6, 0, 7))):
        y = -3 + 9 * u + i * 0.6; k.place(x0 + i, y, 90); k.pose(run(t + i * 0.13, {'face': 'scared'}))
shot(cut(36), (-16, -4.5, 4.5), (-14, -4.2, 4.4), (4, 4, 3), (4, 4, 3), 58, s9)
# S10 shutter slams
shot(cut(42), (-35.9, 2.0, 5.2), (-35.9, 3.0, 5.2), (-35.9, 11.4, 5.4), (-35.9, 11.4, 5.4), 38, nothing)
# S11 bolt slides
shot(10.30, (IX + 3.0, IY - 6.0, 4.8), (IX + 3.1, IY - 5.2, 4.7), (IX + 3.6, IY, 4.0), (IX + 3.6, IY, 4.0), 34, nothing)
# S12 Bin on his porch, looking down the street
def binporch(t, P):
    BIN.place(46.5, 10.3, -90); BIN.pose(P)
shot(cut(47), (40, 1, 5.5), (40.8, 2.0, 5.4), (46.5, 10.3, 4.6), (46.5, 10.3, 4.6), 46,
     lambda t, u: binporch(t, keyed([(0, {'face': 'worried', 'head': -50}), (W(49) + 0.1, {'face': 'worried', 'head': -70, 'headx': -6})], t)))
# S13 the empty swing (she never came home)
shot(cut(50), (62, -27, 4.8), (63, -25.5, 4.6), (68, -18, 3), (68, -18, 3), 46, nothing)
# S14 Bin decides
shot(cut(57), (46.0, 3.2, 4.9), (46.2, 4.6, 4.9), (46.5, 10.3, 4.8), (46.5, 10.3, 4.8), 36,
     lambda t, u: binporch(t, keyed([(0, {'face': 'worried', 'head': -30}), (W(58), {'face': 'determined', 'head': 0}), (W(59), {'face': 'determined', 'armR': -70})], t)))
# S15 flashlight clicks on
shot(cut(61), (41.4, 5.6, 4.6), (41.9, 5.9, 4.5), (46.2, 9.2, 3.6), (46.2, 9.2, 3.6), 46,
     lambda t, u: binporch(t, {'face': 'determined', 'armR': -52}))
# S16 Bin runs out, his house goes dark behind him
def s16(t, u):
    BIN.place(47 - 9 * u, 10.0 - 4.5 * u, -150); BIN.pose(run(t, {'face': 'determined'}, flash=True))
shot(cut(64), (30, -6, 6), (31, -5, 6), (46, 12, 4.5), (46, 12, 4.5), 54, s16)
# S17 running toward camera, a lamp dies behind him
def s17(t, u):
    BIN.place(34 - 7 * u, -2.0, 180); BIN.pose(run(t, {'face': 'scared'}, flash=True))
shot(cut(67), (14, -4, 4.2), (15, -3.8, 4.1), (36, -1, 5), (36, -1, 5), 50, s17)
# S18 Bin looks back
def s18(t, u):
    BIN.place(22 - 4 * u, -1.5, 180)
    BIN.pose(keyed([(0, run(t, {'face': 'scared'}, flash=True)), (W(73), dict(run(t, {'face': 'panic', 'head': -120}, flash=True)))], t))
shot(cut(72), (16.5, -4.5, 5.0), (17.0, -4.3, 5.0), (22, -1.5, 4.6), (22, -1.5, 4.6), 36, s18)
# S19-21 the thing steps closer on every "bước"
def mstep(t, xs, ws):
    i = sum(1 for w in ws if t >= W(w))
    a, b = xs[max(0, i - 1)], xs[i]
    k = back((t - W(ws[i - 1])) / 0.16) if i > 0 else 1
    x = a + (b - a) * k if i > 0 else xs[0]
    MON.place(x, 0.5, 180); MON.pose({'bend': 14, 'armL': -12, 'armR': -18, 'headx': 10})
shot(cut(75), (-34, -1, 2.2), (-34, -1, 2.2), (0, 0.5, 6), (0, 0.5, 6), 44, lambda t, u: mstep(t, [14, 4], [76]))
shot(cut(77), (-34, -1, 2.2), (-33.5, -1, 2.2), (0, 0.5, 6.5), (0, 0.5, 6.5), 44, lambda t, u: mstep(t, [4, -8], [79]))
shot(cut(81), (-34, -1, 2.2), (-33.5, -1, 2.2), (-16, 0.5, 7), (-16, 0.5, 7.5), 44, lambda t, u: mstep(t, [-8, -20], [84]))
# S22 finds Na under the last light
def kidsglobe(t, bp, nap):
    NA.place(GX + 1.5, GY + 1.6, 110); NA.pose(nap)
    BIN.place(GX - 1.6, GY + 2.4, 75); BIN.pose(bp)
def s22(t, u):
    NA.place(GX + 1.5, GY + 1.6, 110); NA.pose({'face': 'cry', 'armL': -20, 'armR': -20, 'headx': 12})
    BIN.place(GX - 9 + 6.4 * smooth(u * 1.4), GY + 3.2, -10); BIN.pose(run(t, {'face': 'worried'}, flash=True) if u < 0.7 else {'face': 'worried', 'armR': -52})
shot(cut(85), (GX - 1, GY + 17, 5.0), (GX - 0.8, GY + 15.5, 4.9), (GX - 1, GY + 1.5, 3.0), (GX - 1, GY + 1.5, 3.0), 56, s22)
# S23 low wide: the two of them in the last pool of light
shot(cut(90), (GX - 14, GY + 16, 1.2), (GX - 12, GY + 14.5, 1.3), (GX, GY, 6.5), (GX, GY, 6.5), 64,
     lambda t, u: kidsglobe(t, {'face': 'worried', 'armR': -52}, {'face': 'scared', 'head': 40}))
# S24 "Chạy!"
shot(cut(95), (GX - 0.9, GY + 7.6, 4.9), (GX - 1.0, GY + 6.8, 4.9), (GX - 1.6, GY + 2.4, 4.8), (GX - 1.6, GY + 2.4, 4.8), 34,
     lambda t, u: kidsglobe(t, keyed([(0, {'face': 'scared', 'armR': -52}), (W(95), {'face': 'panic', 'armR': -52, 'armL': -110, 'head': 30, 'headx': -8})], t), {'face': 'scared'}))
# S25 pounding on the neighbour's door
NBX = 64
def s25(t, u):
    ks = [(0, {'face': 'panic', 'armR': -52})]
    for j, w in enumerate((98, 100, 101, 103)):
        ks.append((W(w) - 0.06, {'face': 'panic', 'armR': -52, 'armL': -125}))
        ks.append((W(w) + 0.06, {'face': 'panic', 'armR': -52, 'armL': -95}))
    BIN.place(NBX + 0.3, 9.3, 90); BIN.pose(keyed(ks, t, 0.1))
    NA.place(NBX - 2.0, 8.2, 60); NA.pose({'face': 'scared', 'head': -50})
shot(cut(98), (NBX + 8, 3.5, 5.0), (NBX + 7.2, 4.2, 5.0), (NBX, 10.5, 4.2), (NBX, 10.5, 4.2), 46, s25)
# S26 nobody answers
def atdoor(t, bp, nap):
    BIN.place(NBX + 0.3, 9.3, 90); BIN.pose(bp); NA.place(NBX - 2.0, 8.4, 70); NA.pose(nap)
shot(cut(102), (NBX - 2.0, 0.5, 6.0), (NBX - 1.8, 1.6, 5.8), (NBX - 0.3, 11.4, 4.2), (NBX - 0.3, 11.4, 4.2), 46,
     lambda t, u: atdoor(t, keyed([(0, {'face': 'panic', 'armL': -95}), (W(104), {'face': 'scared', 'armL': 0, 'head': -60})], t), {'face': 'scared', 'head': -40}))
# S27 the last light flickers - seen from the door, over the kids
def turned(t, u, bf='scared'):
    BIN.place(NBX + 0.3, 9.6, -90); BIN.pose({'face': bf, 'armR': -52}); NA.place(NBX - 2.0, 9.2, -80); NA.pose({'face': 'scared'})
shot(cut(106), (NBX + 1.2, 11.0, 6.4), (NBX + 1.0, 10.7, 6.4), (GX, GY, 7.0), (GX, GY, 7.5), 52, turned)
# S28 it dies -> black
shot(cut(111), (NBX + 1.2, 11.0, 6.4), (NBX + 1.2, 10.6, 6.4), (GX, GY, 7.5), (GX, GY, 7.8), 58, turned)
# S29 three seconds of silence: only roofs against the stars
shot(26.30, (8, -2, 1.0), (8, -1.4, 1.0), (8, 16, 16), (8, 16, 16.5), 64, nothing)
# S30 the lights come back: same wide, every door open
shot(cut(112), (-72, -9, 27), (-66, -8.2, 24.8), (14, 6, 3), (14, 6, 3), 62, nothing)
# S31 slow slide along the empty houses
shot(cut(116), (-20, 1.5, 4.5), (2, 1.5, 4.5), (-12, 12, 3.6), (10, 12, 3.6), 56, nothing)
# S32 rocking chair, still rocking, nobody home
shot(cut(122), (H_CHAIR.x - 1.5, 3.2, 4.2), (H_CHAIR.x - 0.8, 4.2, 4.0), (H_CHAIR.x + 4.0, 10.6, 2.0), (H_CHAIR.x + 4.0, 10.6, 2.0), 46, nothing)
# S33-S35 the twist over the two of them
KX, KY = 52.5, 7.6
def twokids(t, bp, nap):
    BIN.place(KX, KY, -90); BIN.pose(bp); NA.place(KX + 1.9, KY - 0.3, -90); NA.pose(nap)
shot(cut(129), (KX + 1.0, KY - 8.5, 4.6), (KX + 1.0, KY - 7.4, 4.5), (KX + 1.0, KY, 3.9), (KX + 1.0, KY, 3.9), 42,
     lambda t, u: twokids(t, {'face': 'scared', 'armR': -52}, {'face': 'scared', 'armL': -30}))
shot(cut(138), (36, -4, 5.0), (39, -1.5, 5.2), (48, 12, 5.0), (48, 12, 5.0), 50, lambda t, u: twokids(t, {'face': 'scared', 'armR': -52}, {'face': 'scared'}))
def s35(t, u):
    BIN.place(KX, KY, -90 + 210 * smooth(u * 1.3)); BIN.pose({'face': 'shock' if u > 0.35 else 'scared', 'armR': -52})
    NA.place(KX + 1.9, KY - 0.3, -90 + 200 * smooth(u * 1.1 - 0.2)); NA.pose({'face': 'scared'})
shot(cut(148), (KX + 1.2, KY - 9.5, 4.6), (KX + 1.2, KY - 8.4, 4.5), (KX + 1.0, KY, 3.9), (KX + 1.0, KY, 3.9), 46, s35)
# S36 his own door creaks open onto black
shot(cut(156), (51, 1.5, 4.0), (50.4, 3.0, 4.0), (48, 11.4, 3.4), (48, 11.4, 3.4), 44,
     lambda t, u: twokids(t, {'face': 'shock', 'armR': -52}, {'face': 'scared'}))
# S37 the tall thing bends down out of the doorway
def s37(t, u):
    MON.place(48, 12.6, -48); MON.pose({'bend': 72 * smooth(u * 1.15), 'armL': -30 * u, 'armR': -40 * u, 'headx': -50 * smooth(u * 1.15)})
    twokids(t, {'face': 'panic', 'armR': -52}, {'face': 'panic'})
    BIN.place(KX, KY, 130); NA.place(KX + 1.9, KY - 0.3, 135)
    return {'c': lambda k: (43.6 + 0.4 * k, 4.2 + 0.4 * k, 2.2), 'g': lambda k: tuple(lerp((48.5, 11.0, 6.0), tuple(mhead()), 0.4 + 0.5 * k))}
shot(cut(164), (52.5, 3.0, 2.0), (52.2, 3.6, 2.2), (48, 11.0, 6.5), (48, 10.5, 6.0), 58, s37)
# S38 from its height, looking down at two terrified faces
def mpose_end(t):
    snap = back((t - TMW) / 0.14) if t >= TMW else 0
    return {'bend': 72, 'armL': -55, 'armR': -65, 'headx': -50, 'headroll': 24 * snap}
def mhead():
    return MON.head.matrix_world @ Vector((0, 0, 1.0))
def mfwd():
    return (MON.head.matrix_world.to_3x3() @ Vector((0, -1, 0))).normalized()
def kidc(): return Vector((KX + 0.9, KY - 0.3, 3.6))
def s38(t, u, close=False):
    MON.place(48, 12.6, -48); MON.pose(mpose_end(t))
    BIN.place(KX, KY, 132); BIN.pose({'face': 'panic', 'armR': -52, 'headx': -22})
    NA.place(KX + 1.9, KY - 0.3, 138); NA.pose({'face': 'panic', 'headx': -22, 'armL': -40, 'armR': -40})
    if not close:
        return {'c': lambda k: tuple(mhead() + mfwd() * 1.5 + Vector((0, 0, 0.6)) + 0.25 * k * (kidc() - mhead())), 'g': lambda k: tuple(kidc())}
    def cc(k):
        h = mhead(); f = mfwd(); return tuple(h + f * (4.2 - 0.6 * k) + Vector((0, 0, -0.4)))
    return {'c': cc, 'g': lambda k: tuple(mhead())}
shot(TM - 0.04, (51.4, 9.0, 8.4), (52.0, 8.8, 8.0), (KX + 0.9, KY - 0.3, 4.0), (KX + 0.9, KY - 0.3, 4.0), 46, s38)
# S39 its face: the line, head snaps sideways on the last word, hold
shot(TM + 0.95 - 0.04, (55.2, 6.2, 5.4), (54.6, 6.8, 5.6), (50.6, 9.4, 7.2), (50.6, 9.4, 7.2), 40, lambda t, u: s38(t, u, True))

for i, s in enumerate(SHOTS): s['t1'] = SHOTS[i + 1]['t0'] if i + 1 < len(SHOTS) else END

def apply(t):
    reset(); world_state(t)
    s = next(s for s in reversed(SHOTS) if t >= s['t0'])
    u = (t - s['t0']) / (s['t1'] - s['t0'])
    ov = s['setup'](t, u) or {}
    k = smooth(u)
    c, g = lerp(s['c0'], s['c1'], k), lerp(s['g0'], s['g1'], k)
    if ov:
        bpy.context.view_layer.update()
        c, g = ov['c'](k), ov['g'](k)
    i_ = SHOTS.index(s)
    if not ov and i_ not in (18, 19, 20, 28):
        sgn = 1 if i_ % 2 else -1
        a = sgn * 7 * D2R * (k - 0.5)
        d = Vector(c) - Vector(g)
        d = Vector((d.x * math.cos(a) - d.y * math.sin(a), d.x * math.sin(a) + d.y * math.cos(a), d.z))
        c = tuple(Vector(g) + d + Vector((0, 0, 0.35 * (k - 0.5))))
    cam_set(c, g, s['fov'])
    MON_FACE_EM.default_value = 3.0

# ---------------------------------------------------------------- main
if __name__ == '__main__':
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    mode, out = argv[0], os.path.abspath(argv[1]); os.makedirs(out, exist_ok=True)
    if mode == 'stills':
        S.render.resolution_percentage = int(argv[2]) if len(argv) > 2 else 50
        E.taa_render_samples = 12
        only = [int(x) for x in argv[3].split(',')] if len(argv) > 3 else range(len(SHOTS))
        for i in only:
            s = SHOTS[i]; t = (s['t0'] + s['t1']) / 2
            apply(t); S.render.filepath = os.path.join(out, 's%02d.png' % i)
            bpy.ops.render.render(write_still=True); print('still', i, round(t, 2), flush=True)
    elif mode == 'frames':
        A, B = int(argv[2]), int(argv[3])
        for f in range(A, B):
            apply(f / FPS); S.render.filepath = os.path.join(out, 'f%05d.png' % f)
            bpy.ops.render.render(write_still=True); print('frame', f, flush=True)
        print('done', flush=True)
    elif mode == 'info':
        for i, s in enumerate(SHOTS): print(i, round(s['t0'], 2), round(s['t1'] - s['t0'], 2))
