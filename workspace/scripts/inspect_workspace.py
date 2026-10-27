import bpy, json, hashlib
from pathlib import Path
from collections import Counter
BASE = Path(__file__).resolve().parents[1]
OLD = BASE / 'blender' / 'workspace.blend'
GLB = BASE / 'models' / 'workspace.glb'

def matrix(o):
    return [[float(v) for v in row] for row in o.matrix_world]

def geometry(o):
    if o.type != 'MESH':
        return None
    h = hashlib.sha256()
    for v in o.data.vertices:
        h.update(repr(tuple(v.co)).encode())
    for p in o.data.polygons:
        h.update(repr(tuple(p.vertices)).encode())
    return h.hexdigest()

def snapshot():
    bpy.context.view_layer.update()
    out = {}
    for o in bpy.context.scene.objects:
        entry = dict(type=o.type, parent=o.parent.name if o.parent else None,
                     matrix=matrix(o), dimensions=list(o.dimensions), geometry=geometry(o))
        if o.type == 'MESH':
            entry['vertices'] = len(o.data.vertices)
            entry['materials'] = [m.name if m else None for m in o.data.materials]
        if o.type == 'LIGHT':
            entry['light'] = dict(type=o.data.type, energy=o.data.energy, size=o.data.size)
        if o.type == 'CAMERA':
            entry['camera'] = dict(type=o.data.type, ortho_scale=o.data.ortho_scale)
        out[o.name] = entry
    return out

def paths():
    return dict(blend=bpy.data.filepath, render=bpy.context.scene.render.filepath,
                images=[dict(name=x.name, path=x.filepath) for x in bpy.data.images if x.filepath],
                libraries=[x.filepath for x in bpy.data.libraries],
                texts=[dict(name=x.name, path=x.filepath) for x in bpy.data.texts if x.filepath])

def inspect():
    bpy.ops.wm.open_mainfile(filepath=str(OLD))
    before = snapshot()
    path_audit = paths()
    existing_materials = {}
    for mat in bpy.data.materials:
        if mat.use_nodes:
            shader = next((n for n in mat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
            if shader:
                existing_materials[mat.name] = {key: list(shader.inputs[key].default_value) if key == 'Base Color' else float(shader.inputs[key].default_value) for key in ('Base Color','Roughness','Metallic')}
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(GLB))
    imported = snapshot()
    errors = []
    expected = {n:e for n,e in before.items() if e['type'] != 'LIGHT'}
    for name, entry in expected.items():
        actual = imported.get(name)
        if not actual:
            errors.append('Missing GLB node: ' + name)
            continue
        if entry['type'] != actual['type'] or entry['parent'] != actual['parent']:
            errors.append('Type/hierarchy mismatch: ' + name)
        if max(abs(entry['matrix'][r][c] - actual['matrix'][r][c]) for r in range(4) for c in range(4)) > 1e-4:
            errors.append('Transform mismatch: ' + name)
        if entry.get('materials') != actual.get('materials'):
            errors.append('Material assignment mismatch: ' + name)
    for name in ('MonitorScreen','PhoneScreen','FrameArtwork','Tabletop','LeftLeg','TrashBin'):
        if imported.get(name,{}).get('type') != 'MESH':
            errors.append('Independent mesh missing: ' + name)
    report = dict(status='passed' if not errors else 'failed', errors=errors,
                  source_blend='blender/workspace.blend', source_glb='models/workspace.glb',
                  source_sha256={str(p.relative_to(BASE)):hashlib.sha256(p.read_bytes()).hexdigest() for p in (OLD,GLB)},
                  counts=dict(Counter(e['type'] for e in before.values())),
                  objects=before, materials=existing_materials, original_paths=path_audit,
                  glb_node_count=len(imported), glb_objects=imported,
                  conclusion='Existing navigation surfaces and furniture remain separate meshes under empty parent groups; no corrective merging/splitting required.')
    (BASE/'reports'/'workspace_v1_structure.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    if errors:
        raise RuntimeError('; '.join(errors))
    print('V1 INSPECTION PASSED', dict(Counter(e['type'] for e in before.values())))
    print('ORIGINAL PATHS', json.dumps(path_audit))
    bpy.ops.wm.open_mainfile(filepath=str(OLD))
    return report

if __name__ == '__main__':
    inspect()