# Retarget Quaternius Universal Animation Library clips (Rigify DEF names) onto CharacterCreator/MakeHuman rigs (UE-style names),
# and add a procedural jaw-open shape key so characters can mouth their lines.
import bpy, mathutils
import os
UAL = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ual', 'AnimationLibrary_Godot_Standard.gltf')
MAP = {'DEF-hips': 'pelvis', 'DEF-spine.001': 'spine_01', 'DEF-spine.002': 'spine_02', 'DEF-spine.003': 'spine_03', 'DEF-neck': 'neck_01', 'DEF-head': 'head'}
for s, t in (('L', 'l'), ('R', 'r')):
    MAP.update({f'DEF-shoulder.{s}': f'clavicle_{t}', f'DEF-upper_arm.{s}': f'upperarm_{t}', f'DEF-forearm.{s}': f'lowerarm_{t}', f'DEF-hand.{s}': f'hand_{t}',
                f'DEF-thigh.{s}': f'thigh_{t}', f'DEF-shin.{s}': f'calf_{t}', f'DEF-foot.{s}': f'foot_{t}', f'DEF-toe.{s}': f'ball_{t}'})
    for f in ('index', 'middle', 'pinky', 'ring'):
        for k in (1, 2, 3): MAP[f'DEF-f_{f}.0{k}.{s}'] = f'{f}_0{k}_{t}'
    for k in (1, 2, 3): MAP[f'DEF-thumb.0{k}.{s}'] = f'thumb_0{k}_{t}'
_src = None
def source():
    global _src
    if _src and _src.name in bpy.data.objects: return _src
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=UAL); new = [o for o in bpy.data.objects if o not in before]
    _src = [o for o in new if o.type == 'ARMATURE'][0]
    for o in new:
        if o is not _src: o.hide_render = True; o.hide_viewport = True
    _src.hide_render = True; _src.location = (0, -500, 0); return _src
def order(arm):
    out = [];
    def walk(b): out.append(b.name); [walk(c) for c in b.children]
    for b in arm.data.bones:
        if b.parent is None: walk(b)
    return out
def bake(tgt, clip, name=None, f0=None, f1=None, step=1, hips_scale=None):
    """Bake UAL clip onto target armature as a new action; returns the action."""
    src = source(); src.animation_data_create(); src.animation_data.action = bpy.data.actions[clip]
    a0, a1 = bpy.data.actions[clip].frame_range; f0 = int(a0 if f0 is None else f0); f1 = int(a1 if f1 is None else f1)
    srest = {b.name: b.matrix_local.to_quaternion() for b in src.data.bones}; trest = {b.name: b.matrix_local.to_quaternion() for b in tgt.data.bones}
    inv = {v: k for k, v in MAP.items()}; ordr = [n for n in order(tgt) if n in inv]
    # rest postures differ (UAL is a T-pose, MakeHuman an A-pose): per bone, the rotation taking the target's rest direction onto the source's
    def dirs(arm, names):
        d = {}
        for n in names:
            b = arm.data.bones[n]; kids = [c for c in b.children if c.name in names]
            d[n] = ((kids[0].head_local - b.head_local) if kids else (b.tail_local - b.head_local)).normalized()
        return d
    sd = dirs(src, list(MAP.keys())); td = dirs(tgt, list(MAP.values())); CORR = {}
    for tn in order(tgt):
        if tn not in inv: continue
        b = tgt.data.bones[tn]; kids = [c for c in b.children if c.name in inv]
        if kids: CORR[tn] = td[tn].rotation_difference(sd[inv[tn]])
        else: CORR[tn] = CORR.get(b.parent.name, mathutils.Quaternion()) if b.parent else mathutils.Quaternion()
    if hips_scale is None: hips_scale = tgt.data.bones['pelvis'].head_local.length / max(1e-4, src.data.bones['DEF-hips'].head_local.length)
    hip0 = src.data.bones['DEF-hips'].head_local.copy()
    act = bpy.data.actions.new(name or f'{tgt.name}_{clip}'); tgt.animation_data_create(); tgt.animation_data.action = act
    sc = bpy.context.scene
    for f in range(f0, f1 + 1, step):
        sc.frame_set(f); bpy.context.view_layer.update()
        for tn in ordr:
            sn = inv[tn]; spb = src.pose.bones[sn]; tpb = tgt.pose.bones[tn]
            q = spb.matrix.to_quaternion() @ srest[sn].inverted() @ CORR[tn] @ trest[tn]
            m = q.to_matrix().to_4x4(); m.translation = tpb.matrix.translation
            if tn == 'pelvis': m.translation = tgt.data.bones['pelvis'].head_local + (spb.matrix.translation - hip0) * hips_scale
            tpb.matrix = m; bpy.context.view_layer.update()
        for tn in ordr:
            tpb = tgt.pose.bones[tn]; tpb.rotation_mode = 'QUATERNION'; tpb.keyframe_insert('rotation_quaternion', frame=f - f0)
            if tn == 'pelvis': tpb.keyframe_insert('location', frame=f - f0)
    src.animation_data.action = None; return act
def jaw_key(objs, head_bone_z=None, angle=14.0):
    """Add a 'jaw_open' shape key to the face meshes: vertices below the mouth line rotate around a hinge near the ears."""
    body = [o for o in objs if o.type == 'MESH' and o.name.startswith('Body')][0]
    teeth = [o for o in objs if o.type == 'MESH' and o.name.startswith('Teeth')]
    tb = [teeth[0].matrix_world @ mathutils.Vector(c) for c in teeth[0].bound_box] if teeth else None
    zt = min(v.z for v in tb); zt2 = max(v.z for v in tb); ymid = sum(v.y for v in tb) / 8; mouth_z = (zt + zt2) / 2
    hinge = mathutils.Vector((0, ymid + .07, zt2 + .005))  # behind the teeth, a bit above (ear/condyle line)
    R = mathutils.Matrix.Rotation(__import__('math').radians(angle), 4, 'X')
    for o in [body] + teeth + [x for x in objs if x.type == 'MESH' and x.name.startswith('Tongue')]:
        if not o.data.shape_keys: o.shape_key_add(name='Basis')
        k = o.shape_key_add(name='jaw_open', from_mix=False); mw = o.matrix_world; mi = mw.inverted()
        for i, v in enumerate(o.data.vertices):
            p = mw @ v.co
            if p.z > mouth_z + .004 or p.z < zt - .09 or abs(p.x) > .075 or p.y > ymid + .06: continue
            w = min(1, max(0, (mouth_z + .004 - p.z) / .012)) * min(1, max(0, (p.z - (zt - .09)) / .03)) * min(1, max(0, (.075 - abs(p.x)) / .02))
            q = hinge + (R @ (p - hinge)); k.data[i].co = mi @ p.lerp(q, w)
    return body
