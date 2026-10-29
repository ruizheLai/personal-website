"""Phase 2A.1: refine the saved v2 scene, preserving all earlier source files.
Run Blender --background --python workspace/scripts/refine_workspace_v3.py
All output paths are relative to this script's E-drive project.
"""
import bpy, json, hashlib, math, runpy
from pathlib import Path
from mathutils import Vector

BASE = Path(__file__).resolve().parents[1]
ROOT = BASE.parent
H = runpy.run_path(str(BASE / 'scripts/build_workspace.py'), run_name='workspace_helpers')
REPORT = BASE / 'reports/workspace_v3_validation.json'
SOURCES = [BASE/'blender/workspace_v2.blend', BASE/'models/workspace_v2.glb',
           ROOT/'public/images/about-avatar.png']

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def signature(obj):
    return dict(parent=obj.parent.name if obj.parent else None,
        matrix=[round(v,7) for row in obj.matrix_world for v in row],
        vertices=[[round(v,7) for v in point.co] for point in obj.data.vertices] if obj.type=='MESH' else None,
        polygons=[list(p.vertices) for p in obj.data.polygons] if obj.type=='MESH' else None)

def dimensions(obj):
    points=[v.co for v in obj.data.vertices]
    return [max(v[i] for v in points)-min(v[i] for v in points) for i in range(3)]

def resize_mesh(obj, targets):
    current=dimensions(obj)
    for v in obj.data.vertices:
        for axis, dimension in targets.items():
            v.co[axis] *= dimension/current[axis]
    obj.data.update()

def main():
    before_hashes={str(path.relative_to(ROOT)):sha(path) for path in SOURCES}
    bpy.ops.wm.open_mainfile(filepath=str(BASE/'blender/workspace_v2.blend'))
    scene=bpy.context.scene
    bpy.context.view_layer.update()
    before={o.name:signature(o) for o in scene.objects}
    wall=bpy.data.objects['Wall']
    assert wall.type=='MESH' and wall.parent.name=='Environment'
    bpy.data.objects.remove(wall, do_unlink=True)
    # Replace the bounded gray panel with an edge-free white wall support.
    data=bpy.data.meshes.new('SeamlessWallMesh')
    data.from_pydata([(-100,.34,-100),(100,.34,-100),(100,.34,100),(-100,.34,100)],[],[(0,1,2,3)])
    data.update()
    support=bpy.data.objects.new('SeamlessWall',data)
    scene.collection.objects.link(support)
    support.parent=bpy.data.objects['Environment']
    data.materials.append(bpy.data.objects['Floor'].data.materials[0])
    support['role']='Unbounded white support for frame/shelf shadows; no panel edge in camera view'

    # Keep the actual object hierarchy and center; edit only local mesh coordinates.
    resize_mesh(bpy.data.objects['FrameBacking'], {0:.56,2:.56})
    for name, sign in [('FrameTop',1),('FrameBottom',-1)]:
        obj=bpy.data.objects[name]
        resize_mesh(obj,{0:.56})
        obj.location.z=sign*.264
    for name, sign in [('FrameRight',1),('FrameLeft',-1)]:
        obj=bpy.data.objects[name]
        resize_mesh(obj,{2:.496})
        obj.location.x=sign*.264
    art=bpy.data.objects['FrameArtwork']
    resize_mesh(art,{0:.496,2:.496})
    art['aspect_ratio']=1.0
    art['image_source']='public/images/about-avatar-v2.png'
    matte=bpy.data.objects['FrameTop'].data.materials[0].copy()
    matte.name='Frame | matte black v3'
    shader=next(n for n in matte.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    shader.inputs['Roughness'].default_value=.65
    shader.inputs['Metallic'].default_value=.05
    for name in ('FrameTop','FrameBottom','FrameLeft','FrameRight'):
        bpy.data.objects[name].data.materials[0]=matte

    # Preserve obsolete graphic nodes in the editable source, but hide/exclude them.
    graphic=bpy.data.objects['ArtworkGraphic']
    hidden={graphic.name,*[o.name for o in graphic.children_recursive]}
    for name in hidden:
        obj=bpy.data.objects[name]
        obj.hide_render=True
        obj.hide_set(True)
    original_art_material=art.data.materials[0]
    portrait=bpy.data.materials.new('Avatar | exact sRGB v2 portrait')
    portrait.use_nodes=True
    nodes=portrait.node_tree.nodes
    nodes.clear()
    output=nodes.new('ShaderNodeOutputMaterial')
    emission=nodes.new('ShaderNodeEmission')
    texture=nodes.new('ShaderNodeTexImage')
    image=bpy.data.images.load(str(ROOT/'public/images/about-avatar-v2.png'),check_existing=True)
    assert image.size[0]==image.size[1]
    image.colorspace_settings.name='sRGB'
    image.pack()
    image.filepath='//../../public/images/about-avatar-v2.png'
    texture.image=image
    texture.interpolation='Linear'
    portrait.node_tree.links.new(texture.outputs['Color'],emission.inputs['Color'])
    portrait.node_tree.links.new(emission.outputs['Emission'],output.inputs['Surface'])
    art.data.materials[0]=portrait
    bpy.data.objects['Workspace']['asset_version']=3
    bpy.context.view_layer.update()
    modified={'Wall','FrameBacking','FrameTop','FrameBottom','FrameLeft','FrameRight','FrameArtwork'}
    unexpected=[name for name,old in before.items() if name not in modified and signature(bpy.data.objects[name])!=old]
    assert not unexpected, unexpected
    frame=bpy.data.objects['WallFrame']
    assert signature(frame)==before['WallFrame']
    assert abs(dimensions(art)[0]-dimensions(art)[2])<1e-6
    scene.render.filepath='//../previews/workspace_v3_preview.png'
    blend=BASE/'blender/workspace_v3.blend'
    bpy.ops.wm.save_as_mainfile(filepath=str(blend))
    # Native render includes the packed portrait. Web screens remain configurable.
    original_samples=scene.cycles.samples
    scene.cycles.samples=64
    bpy.ops.render.render(write_still=True)
    scene.cycles.samples=original_samples
    bpy.ops.wm.save_as_mainfile(filepath=str(blend))
    # Keep the web GLB light and interchangeable: the avatar is a standalone web asset,
    # while the editable Blender source retains the full packed image.
    art.data.materials[0]=original_art_material
    bpy.ops.object.select_all(action='DESELECT')
    root=bpy.data.objects['Workspace']
    objects=[o for o in [root,*root.children_recursive,scene.camera] if o.name not in hidden]
    for obj in objects:
        obj.hide_set(False)
        obj.select_set(True)
    expected={o.name:[list(row) for row in o.matrix_world] for o in objects}
    parents={o.name:o.parent.name if o.parent else None for o in objects}
    screens={n:bpy.data.objects[n].data.materials[0].name for n in ('MonitorScreen','FrameArtwork','PhoneScreen')}
    glb=BASE/'models/workspace_v3.glb'
    bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',use_selection=True,
        export_extras=True,export_yup=True,export_cameras=True,export_lights=False,
        export_apply=True,export_materials='EXPORT',export_animations=False)
    result=H['validate'](glb,expected,parents,screens)
    assert bpy.data.objects.get('Wall') is None
    assert bpy.data.objects.get('SeamlessWall') is not None
    imported_art=bpy.data.objects['FrameArtwork']
    imported_dims=dimensions(imported_art)
    assert abs(imported_dims[0]-imported_dims[2])<1e-5, imported_dims
    assert all(sha(ROOT/relative)==value for relative,value in before_hashes.items())
    result.update(status='passed' if not result['errors'] else 'failed',
        source_sha256=before_hashes,previous_sources_unchanged=True,
        unchanged_existing_objects=len(before)-len(modified),unexpected_changes=unexpected,
        square_artwork_m=imported_dims,square_frame_outer_m=[.56,.56],
        removed_panel='Wall',added_support='SeamlessWall',hidden_source_graphics=sorted(hidden),
        avatar_source='public/images/about-avatar-v2.png',avatar_sha256=sha(ROOT/'public/images/about-avatar-v2.png'),
        glb_sha256=sha(glb),glb_bytes=glb.stat().st_size,
        blender='blender/workspace_v3.blend',glb='models/workspace_v3.glb',
        preview='previews/workspace_v3_preview.png')
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8')
    assert result['status']=='passed',result['errors']
    bpy.ops.wm.open_mainfile(filepath=str(blend))
    print('WORKSPACE V3 VALIDATED',json.dumps({k:result[k] for k in ('status','glb_bytes','previous_sources_unchanged','square_artwork_m')}))

if __name__=='__main__':
    try:
        main()
    except Exception:
        import traceback
        REPORT.write_text(json.dumps(dict(status='failed',traceback=traceback.format_exc()),indent=2),encoding='utf-8')
        raise
