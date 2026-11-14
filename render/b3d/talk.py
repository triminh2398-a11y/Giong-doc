import bpy, math, mathutils, random, sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import retarget as RT
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
F0, F1, OUT = (int(ARGS[0]), int(ARGS[1]), ARGS[2]) if len(ARGS) >= 3 else (30, 30, '/home/claude/b3dv/frames')
HERE = os.path.dirname(os.path.abspath(__file__))
A='/home/claude/assets3d/CharacterCreator/output/'
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene
def imp(f):
    before=set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=A+f); return [o for o in bpy.data.objects if o not in before]
def person(name, x, y, rotz, action='idle', frame=10):
    before=set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=HERE+'/chars/'+name+'.glb'); objs=[o for o in bpy.data.objects if o not in before]
    root=[o for o in objs if o.parent is None][0]
    arm=[o for o in objs if o.type=='ARMATURE'][0]; arm.name=name
    body=RT.jaw_key(objs)
    act=RT.bake(arm, action, name=name+'_'+action)
    root.location=(x,y,0); root.rotation_euler=(0,0,rotz)
    return arm, objs
random.seed(1)
# ---- world: water, pier, far bank, mist
bpy.ops.mesh.primitive_plane_add(size=400, location=(0,0,0)); w=bpy.context.object; wm=bpy.data.materials.new('water'); wm.use_nodes=True; b=wm.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value=(0.02,0.03,0.035,1); b.inputs['Roughness'].default_value=.06
nt=wm.node_tree; n=nt.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value=3; bump=nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value=.12; nt.links.new(n.outputs['Fac'],bump.inputs['Height']); nt.links.new(bump.outputs['Normal'],b.inputs['Normal']); w.data.materials.append(wm)
def boxm(name,col,rough=.9):
    m=bpy.data.materials.new(name); m.use_nodes=True; bb=m.node_tree.nodes['Principled BSDF']; bb.inputs['Base Color'].default_value=(*col,1); bb.inputs['Roughness'].default_value=rough; return m
wood=boxm('wood',(0.16,0.10,0.06))
def box(loc,dim,mat,rot=(0,0,0)):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot); o=bpy.context.object; o.scale=(dim[0]/2,dim[1]/2,dim[2]/2); o.data.materials.append(mat); return o
for i in range(26): box((0, -1+i*.42, .55),(2.2,.38,.06),wood,(0,0,random.uniform(-.02,.02)))
for i in range(0,26,5):
    for x in (-1,1): bpy.ops.mesh.primitive_cylinder_add(radius=.07,depth=2.2,location=(x,-1+i*.42,-.4)); bpy.context.object.data.materials.append(wood)
# far bank: hills + stilt house silhouettes
hill=boxm('hill',(0.04,0.06,0.04))
for i in range(9): bpy.ops.mesh.primitive_uv_sphere_add(radius=random.uniform(18,34), location=(random.uniform(-90,90),80+random.uniform(0,30),-12)); o=bpy.context.object; o.scale.z=.55; o.data.materials.append(hill)
hut=boxm('hut',(0.10,0.08,0.06))
for x in (-14,-4,9): box((x,46,2.6),(5,3.5,2.2),hut); box((x,46,4.2),(6,4,0.4),boxm('roof',(0.06,0.05,0.04)),(0.0,0,0))
# ---- people
luc, lobjs = person('luc', 0, 6.6, math.pi, action='Idle_Talking_Loop')
ENV = json.load(open(HERE+'/talk_env.json'))  # mouth openness per frame from the line's audio
def jaw(f):
    v = ENV[f] if f < len(ENV) else 0
    for o in lobjs:
        if o.type=='MESH' and o.data.shape_keys and 'jaw_open' in o.data.shape_keys.key_blocks: o.data.shape_keys.key_blocks['jaw_open'].value = v
# ---- light: overcast dawn, cool sky + warm lantern
world=bpy.data.worlds.new('w'); sc.world=world; world.use_nodes=True; bg=world.node_tree.nodes['Background']; bg.inputs[0].default_value=(.42,.48,.58,1); bg.inputs[1].default_value=1.4
bpy.ops.mesh.primitive_cube_add(location=(0,70,6)); fog=bpy.context.object; fog.scale=(120,50,10); fm=bpy.data.materials.new('fog'); fm.use_nodes=True; nt=fm.node_tree; nt.nodes.remove(nt.nodes['Principled BSDF']); v=nt.nodes.new('ShaderNodeVolumePrincipled'); v.inputs['Density'].default_value=.02; v.inputs['Color'].default_value=(.75,.8,.9,1); nt.links.new(v.outputs[0], nt.nodes['Material Output'].inputs['Volume']); fog.data.materials.append(fm)
bpy.ops.object.light_add(type='SUN', rotation=(math.radians(80),0,math.radians(160))); s=bpy.context.object; s.data.energy=3.5; s.data.color=(1,.82,.7); s.data.angle=math.radians(8)
bpy.ops.object.light_add(type='AREA', location=(3,3,4), rotation=(math.radians(-50),0,math.radians(30))); a=bpy.context.object; a.data.energy=180; a.data.size=4; a.data.color=(.7,.8,1)
bpy.ops.object.light_add(type='POINT', location=(-1.1,8.6,2.2)); p=bpy.context.object; p.data.energy=25; p.data.color=(1,.6,.3); p.data.shadow_soft_size=.15
# ---- camera MCU on Lực
bpy.ops.object.camera_add(location=(-.7,4.9,1.55)); cam=bpy.context.object; sc.camera=cam; cam.data.lens=55
tgt=mathutils.Vector((0.1,6.6,1.45)); cam.data.dof.use_dof=True; cam.data.dof.aperture_fstop=2.0
sc.render.engine='CYCLES'; sc.cycles.device='CPU'; sc.cycles.samples=int(os.environ.get('SAMPLES', 32)); sc.cycles.use_denoising=True
sc.render.resolution_x=int(os.environ.get('RX', 540)); sc.render.resolution_y=int(os.environ.get('RY', 960)); sc.view_settings.view_transform='AgX'
os.makedirs(OUT, exist_ok=True); NF = 120
for f in range(F0, F1 + 1):
    sc.frame_set(f % 70); jaw(f)
    u = f / NF; cam.location = mathutils.Vector((-.7 + .15 * u, 4.9 + .35 * u, 1.55)); d = tgt - cam.location; cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); cam.data.dof.focus_distance = d.length
    sc.render.filepath = f'{OUT}/{f:04d}.png'; bpy.ops.render.render(write_still=True)
