"""Extend the saved v1 scene; never rebuild the existing workspace.
Run inside Blender: runpy.run_path(<this file>, run_name='__main__').
All paths derive from this script's E-drive workspace location.
"""
import bpy
import math
import json
import runpy
import hashlib
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view

BASE = Path(__file__).resolve().parents[1]
if BASE != Path('E:/Personal Website/workspace'):
    raise RuntimeError('This extension must run from E:/Personal Website/workspace')
H = runpy.run_path(str(BASE/'scripts'/'build_workspace.py'), run_name='workspace_helpers')
I = runpy.run_path(str(BASE/'scripts'/'inspect_workspace.py'), run_name='inspection_helpers')
empty, box, cylinder, material = (H[k] for k in ('empty','box','cylinder','material'))
SNAPSHOT = I['snapshot']
REPORT = BASE/'reports'/'workspace_v2_validation.json'
FLOOR_Z = -.005


def mesh(name, vertices, faces, parent, mat):
    data = bpy.data.meshes.new(name+'Mesh')
    data.from_pydata(vertices, [], faces)
    data.update()
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.parent = parent
    data.materials.append(mat)
    for poly in data.polygons:
        poly.use_smooth = True
    return obj


def signed(value, exponent):
    return math.copysign(abs(value)**exponent, value)


def pillow(name, center, dimensions, parent, mat, vertical=False, taper=0.0, curve=0.0):
    # Closed superellipsoid: soft caps and rounded corners instead of bevelled cubes.
    w, d, h = dimensions
    vertices, faces = [], []
    around, layers = 64, 28
    for j in range(1,layers):
        lat = -math.pi/2 + math.pi*j/layers
        for k in range(around):
            lon = 2*math.pi*k/around
            x = w/2 * signed(math.cos(lat),.36)*signed(math.cos(lon),.40)
            y = d/2 * signed(math.cos(lat),.36)*signed(math.sin(lon),.40)
            z = h/2 * signed(math.sin(lat),.36)
            x *= 1-taper*max(0,z/(h/2))**2
            if vertical:
                y += curve*(z/(h/2))**2
            vertices.append((x+center[0], y+center[1], z+center[2]))
    for j in range(layers-2):
        for k in range(around):
            a=j*around+k; b=j*around+(k+1)%around
            faces.append((a,b,b+around,a+around))
    bottom=len(vertices); vertices.append((center[0],center[1]+curve,center[2]-h/2))
    top=len(vertices); vertices.append((center[0],center[1]+curve,center[2]+h/2))
    for k in range(around):
        faces.append((bottom,(k+1)%around,k))
        a=(layers-2)*around+k; b=(layers-2)*around+(k+1)%around
        faces.append((a,b,top))
    return mesh(name,vertices,faces,parent,mat)


def interpolate(points, steps=7, closed=False):
    pts=[Vector(p) for p in points]
    result=[]
    count=len(pts) if closed else len(pts)-1
    for i in range(count):
        p0=pts[(i-1)%len(pts)] if closed or i else pts[0]
        p1=pts[i]; p2=pts[(i+1)%len(pts)]
        p3=pts[(i+2)%len(pts)] if closed or i+2<len(pts) else pts[-1]
        for n in range(steps):
            t=n/steps
            result.append(.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t*t*t))
    if not closed:
        result.append(pts[-1])
    return result


def tube(name, points, radius, parent, mat, closed=False, sides=8, steps=5):
    pts=interpolate(points,steps,closed)
    vertices=[]; faces=[]
    for i,p in enumerate(pts):
        prev=pts[(i-1)%len(pts)] if closed or i else p
        nxt=pts[(i+1)%len(pts)] if closed or i+1<len(pts) else p
        tangent=(nxt-prev).normalized()
        normal=tangent.cross(Vector((0,1,0)))
        if normal.length < .01:
            normal=tangent.cross(Vector((0,0,1)))
        normal.normalize(); binormal=tangent.cross(normal).normalized()
        for k in range(sides):
            angle=2*math.pi*k/sides
            vertices.append(tuple(p+radius*(normal*math.cos(angle)+binormal*math.sin(angle))))
    for i in range(len(pts) if closed else len(pts)-1):
        for k in range(sides):
            a=i*sides+k; b=i*sides+(k+1)%sides
            j=(i+1)%len(pts)
            faces.append((a,b,j*sides+(k+1)%sides,j*sides+k))
    if not closed:
        faces.extend([tuple(reversed(range(sides))),tuple((len(pts)-1)*sides+k for k in range(sides))])
    return mesh(name,vertices,faces,parent,mat)


def outline(width,height,y,z,curve=0):
    points=[]
    for i in range(48):
        angle=2*math.pi*i/48
        x=width/2*signed(math.cos(angle),.35)
        dz=height/2*signed(math.sin(angle),.35)
        points.append((x,y+curve*(dz/(height/2))**2,z+dz))
    return points


def ribbon(name, points, width, thickness, parent, mat, width_axis=(1,0,0)):
    pts=interpolate(points,9)
    axis=Vector(width_axis).normalized()
    vertices=[]; faces=[]
    for i,p in enumerate(pts):
        tangent=(pts[min(i+1,len(pts)-1)]-pts[max(i-1,0)]).normalized()
        side=(axis-tangent*axis.dot(tangent)).normalized()
        normal=tangent.cross(side).normalized()
        for s,t in ((-1,-1),(1,-1),(1,1),(-1,1)):
            vertices.append(tuple(p+side*width/2*s+normal*thickness/2*t))
    for i in range(len(pts)-1):
        for k in range(4):
            faces.append((4*i+k,4*i+(k+1)%4,4*(i+1)+(k+1)%4,4*(i+1)+k))
    faces.extend([(3,2,1,0),tuple(4*(len(pts)-1)+k for k in range(4))])
    obj=mesh(name,vertices,faces,parent,mat)
    bevel=obj.modifiers.new('Rounded webbing edges','BEVEL'); bevel.width=.002; bevel.segments=2
    bpy.context.view_layer.objects.active=obj
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    return obj


def bounds(objects):
    bpy.context.view_layer.update()
    points=[o.matrix_world@v.co for o in objects if o.type=='MESH' for v in o.data.vertices]
    return [min(p[i] for p in points) for i in range(3)], [max(p[i] for p in points) for i in range(3)]


def build_chair(parent):
    root=empty('Chair_Root',parent,(0,-.98,FLOOR_Z))
    root['rotation_axis_gltf']='Y'
    root['rotation_limit_degrees']=18
    root['pivot']='central support column, floor datum; Blender Z / glTF Y'
    plastic=material('Chair | satin black polymer',(.012,.014,.016),.56)
    back=material('Chair | rear inset shell',(.020,.022,.023),.72)
    fabric=material('Chair | charcoal upholstery',(.014,.016,.018),.91)
    rubber=material('Chair | caster rubber',(.008,.009,.010),.86)
    steel=material('Chair | dark metal',(.024,.027,.030),.37,.55)
    seam=material('Chair | edge piping',(.028,.030,.031),.72)
    pillow('Chair_BackrestFrame',(0,-.19,.91),(.735,.093,.75),root,plastic,True,.07,.032)
    pillow('Chair_BackrestRearInset',(0,-.245,.91),(.677,.028,.689),root,back,True,.065,.032)
    pillow('Chair_BackrestUpholstery',(0,-.130,.91),(.67,.040,.677),root,fabric,True,.065,.032)
    tube('Chair_BackrestPiping',outline(.681,.695,-.264,.91,.032),.004,root,seam,True,8,2)
    pillow('Chair_SeatPan',(0,.075,.489),(.72,.58,.069),root,plastic)
    pillow('Chair_SeatCushion',(0,.083,.552),(.744,.612,.112),root,fabric)
    seat_line=[(x,z,.569) for x,_,z in outline(.713,.57,0,.083)]
    # Reorient the perimeter into the seat's horizontal XY plane.
    tube('Chair_SeatPiping',seat_line,.003,root,seam,True,8,2)
    for side in (-1,1):
        tag='Left' if side<0 else 'Right'
        tube('Chair_'+tag+'BackSupport',[(side*.245,.09,.46),(side*.29,-.10,.49),(side*.30,-.185,.59),(side*.29,-.18,.76)],.021,root,plastic,sides=12)
        tube('Chair_'+tag+'ArmSupport',[(side*.28,.13,.478),(side*.421,.13,.515),(side*.443,.12,.61),(side*.456,.10,.795)],.025,root,plastic,sides=12)
        pillow('Chair_'+tag+'ArmrestBase',(side*.455,.08,.813),(.137,.33,.045),root,plastic)
        pillow('Chair_'+tag+'ArmrestPad',(side*.455,.08,.843),(.143,.335,.054),root,back)
        box('Chair_'+tag+'HeightButton',(side*.484,.12,.74),(.009,.035,.014),steel,root,.003)
    cylinder('Chair_ColumnSleeve',(0,0,.285),.052,.19,plastic,root,.004)
    cylinder('Chair_GasLift',(0,0,.402),.029,.115,steel,root,.003)
    pillow('Chair_TiltMechanism',(0,.01,.46),(.23,.27,.065),root,plastic)
    tube('Chair_AdjustmentLever',[(.08,-.04,.451),(.22,-.10,.445),(.27,-.13,.432)],.009,root,steel)
    pillow('Chair_AdjustmentGrip',(.28,-.14,.432),(.074,.035,.021),root,plastic)
    cylinder('Chair_BaseHub',(0,0,.18),.075,.085,plastic,root,.008)
    for i in range(5):
        angle=-math.pi/2+i*2*math.pi/5
        direction=Vector((math.cos(angle),math.sin(angle),0))
        tangent=Vector((-math.sin(angle),math.cos(angle),0))
        vertices=[]
        for radius,halfwidth,top,bottom in ((.045,.043,.215,.15),(.23,.036,.184,.133),(.475,.026,.137,.102)):
            for side,z in ((-1,bottom),(1,bottom),(1,top),(-1,top)):
                p=direction*radius+tangent*halfwidth*side; p.z=z; vertices.append(tuple(p))
        faces=[(3,2,1,0),(8,9,10,11)]
        for j in range(2):
            for k in range(4):
                faces.append((j*4+k,j*4+(k+1)%4,(j+1)*4+(k+1)%4,(j+1)*4+k))
        spoke=mesh('Chair_BaseSpoke_%02d'%(i+1),vertices,faces,root,plastic)
        mod=spoke.modifiers.new('Soft cast edges','BEVEL');mod.width=.009;mod.segments=3
        bpy.context.view_layer.objects.active=spoke;bpy.ops.object.modifier_apply(modifier=mod.name)
        caster=empty('Chair_Caster_%02d'%(i+1),root,tuple(direction*.475))
        cylinder('Chair_CasterStem_%02d'%i,(0,0,.118),.014,.044,steel,caster)
        pillow('Chair_CasterFork_%02d'%i,(0,0,.083),(.075,.067,.047),caster,plastic)
        for sign in (-1,1):
            pos=tangent*.016;pos.z=.051
            wheel=cylinder('Chair_Wheel_%02d_%s'%(i,'A' if sign<0 else 'B'),tuple(pos if sign>0 else Vector((-pos.x,-pos.y,pos.z))),.051,.024,rubber,caster,.004)
            wheel.rotation_euler=Vector(tangent).to_track_quat('Z','Y').to_euler()
    return root


def zipper_pull(name,x,y,z,parent,metal,angle=0):
    obj=pillow(name,(0,0,0),(.012,.005,.049),parent,metal)
    obj.location=(x,y,z);obj.rotation_euler.y=math.radians(angle)
    tube(name+'_Eye',[(x-.004,y,z+.026),(x-.005,y-.003,z+.034),(x+.005,y-.003,z+.034),(x+.004,y,z+.026)],.0018,parent,metal)


def build_backpack(parent):
    root=empty('Backpack_Root',parent,(-1.43,-.74,0))
    root['role']='Skills and Interests; independent asset'
    root.rotation_euler=(math.radians(-12),math.radians(8),math.radians(-4))
    fabric=material('Backpack | matte black fabric',(.013,.015,.017),.94)
    panel=material('Backpack | front woven panel',(.019,.021,.023),.91)
    webbing=material('Backpack | padded webbing',(.010,.012,.014),.94)
    piping=material('Backpack | stitched binding',(.025,.027,.029),.83)
    metal=material('Backpack | graphite zipper',(.028,.032,.036),.42,.55)
    body=pillow('Backpack_MainCompartment',(0,0,.307),(.445,.25,.604),root,fabric,True,.16,.010)
    pillow('Backpack_FrontPanel',(0,-.127,.315),(.411,.030,.554),root,panel,True,.15,.008)
    tube('Backpack_MainSeam',outline(.418,.554,-.150,.315,.008),.0025,root,piping,True,8,2)
    tube('Backpack_MainZipperOuter',outline(.426,.565,-.146,.315,.008),.0021,root,metal,True,8,2)
    tube('Backpack_MainZipperInner',outline(.412,.551,-.155,.315,.008),.0017,root,metal,True,8,2)
    zipper_pull('Backpack_MainPull_Left',-.015,-.175,.546,root,metal,-10)
    zipper_pull('Backpack_MainPull_Right',.013,-.175,.544,root,metal,8)
    pocket=empty('Backpack_FrontPocket',root,(0,-.169,.358))
    pocket['hinge']='top edge; local X for future opening animation'
    pillow('Backpack_PocketBody',(0,0,-.155),(.385,.079,.310),pocket,panel)
    tube('Backpack_PocketPiping',outline(.367,.290,-.043,-.155),.0028,pocket,piping,True,8,2)
    tube('Backpack_PocketZipUpper',[(-.165,-.044,-.087),(0,-.045,-.090),(.165,-.044,-.087)],.002,pocket,metal,steps=12)
    tube('Backpack_PocketZipLower',[(-.165,-.045,-.094),(0,-.046,-.097),(.165,-.045,-.094)],.0015,pocket,piping,steps=12)
    zipper_pull('Backpack_PocketPull',-.155,-.052,-.118,pocket,metal,-5)
    # Carry handle is a flat woven ribbon, not a circular rubber tube.
    ribbon('Backpack_CarryHandle',[(-.085,.02,.588),(-.078,.02,.676),(0,.02,.716),(.078,.02,.676),(.085,.02,.588)],.006,.031,root,webbing,(0,1,0))
    for side in (-1,1):
        tag='Left' if side<0 else 'Right'
        ribbon('Backpack_'+tag+'ShoulderStrap',[(side*.11,.115,.55),(side*.15,.205,.48),(side*.18,.242,.28),(side*.145,.195,.10)],.054,.016,root,webbing)
        ribbon('Backpack_'+tag+'AdjustmentWebbing',[(side*.145,.195,.10),(side*.13,.18,.055),(side*.12,.13,.095)],.026,.004,root,webbing)
        pillow('Backpack_'+tag+'StrapAdjuster',(side*.145,.195,.105),(.040,.020,.025),root,metal)
        # Low side slip pocket and reinforced curved seam.
        tube('Backpack_'+tag+'SidePocketSeam',[(side*.216,-.065,.11),(side*.224,.015,.10),(side*.212,.10,.13),(side*.210,.10,.255)],.002,root,piping)
    # Lean against the front of the left leg, with strap contact and no penetration.
    bpy.context.view_layer.update()
    leg=bpy.data.objects['LeftLeg']
    leg_points=[leg.matrix_world@Vector(c) for c in leg.bound_box]
    leg_min_x=min(p.x for p in leg_points);leg_max_x=max(p.x for p in leg_points)
    leg_front=min(p.y for p in leg_points)
    candidates=[o.matrix_world@v.co for o in root.children_recursive if o.type=='MESH' for v in o.data.vertices]
    contact=[p for p in candidates if leg_min_x-.003<=p.x<=leg_max_x+.003 and .20<p.z<.70]
    if not contact:
        raise RuntimeError('No backpack contact region aligns with desk leg')
    root.location.y += leg_front-.001-max(p.y for p in contact)
    low,_=bounds(root.children_recursive)
    root.location.z += FLOOR_Z-low[2]
    bpy.context.view_layer.update()
    return root


def bvh(obj):
    return BVHTree.FromPolygons([obj.matrix_world@v.co for v in obj.data.vertices],
                               [tuple(p.vertices) for p in obj.data.polygons])


def rotations_and_contact(chair,bag):
    scene=bpy.context.scene; data=[]
    bag_leg_intersections=[o.name for o in bag.children_recursive if o.type=='MESH' and bvh(o).overlap(bvh(bpy.data.objects['LeftLeg']))]
    obstacles=[bpy.data.objects[n] for n in ('Tabletop','LeftLeg','CabinetShell','MonitorHousing','KeyboardBase')]
    obstacle_trees={o.name:bvh(o) for o in obstacles}
    original=chair.rotation_euler.copy()
    width,height=scene.render.resolution_x,scene.render.resolution_y
    samples=scene.cycles.samples
    for degrees in (-18,0,18):
        chair.rotation_euler.z=math.radians(degrees);bpy.context.view_layer.update()
        intersections=[]
        for component in chair.children_recursive:
            if component.type!='MESH':continue
            tree=bvh(component)
            for name,other in obstacle_trees.items():
                if tree.overlap(other):intersections.append([component.name,name])
        low,high=bounds(chair.children_recursive)
        wheels=[o for o in chair.children_recursive if o.name.startswith('Chair_Wheel_')]
        wheel_heights=[bounds([o])[0][2] for o in wheels]
        data.append(dict(degrees=degrees,bounds=[low,high],furniture_intersections=intersections,
                         wheel_floor_error_m=max(abs(v-FLOOR_Z) for v in wheel_heights)))
        if degrees:
            scene.render.resolution_x=1000;scene.render.resolution_y=round(height/width*1000)
            scene.cycles.samples=64
            suffix='minus18' if degrees<0 else 'plus18'
            scene.render.filepath='//../previews/workspace_v2_chair_'+suffix+'.png'
            bpy.ops.render.render(write_still=True)
    chair.rotation_euler=original
    scene.render.resolution_x=width;scene.render.resolution_y=height;scene.cycles.samples=samples
    scene.render.filepath='//../previews/workspace_v2_preview.png'
    bpy.context.view_layer.update()
    leg=bpy.data.objects['LeftLeg']
    target=Vector((-1.31,-.501,.27))
    direction=scene.camera.matrix_world.to_quaternion()@Vector((0,0,-1))
    hit,point,normal,index,obj,matrix=scene.ray_cast(bpy.context.evaluated_depsgraph_get(),target-direction*10,direction,distance=20)
    bag_min,bag_max=bounds(bag.children_recursive)
    return dict(chair_rotations=data,backpack_leg_intersections=bag_leg_intersections,default_rotation_restored=list(chair.rotation_euler),
                backpack_bounds=[bag_min,bag_max],backpack_floor_error_m=abs(bag_min[2]-FLOOR_Z),
                backpack_occludes_leg_at_test_ray=bool(hit and obj.name.startswith('Backpack_')),
                test_ray_first_hit=obj.name if hit else None,
                checks='BVH surface intersections against tabletop, leg, cabinet, monitor housing and keyboard; floor contact and camera ray occlusion')


def normalize_paths():
    # No linked image/library/text assets exist in v1. Keep future additions portable.
    old_prefix='C:/Users/17526/OneDrive/Documents/ChatGPT/Personal Website'
    for sequence in (bpy.data.images,bpy.data.libraries,bpy.data.texts):
        for item in sequence:
            path=getattr(item,'filepath','')
            if not path or path.startswith('<'):continue
            normalized=path.replace('\\','/')
            if normalized.startswith(old_prefix):
                normalized='E:/Personal Website'+normalized[len(old_prefix):]
            item.filepath=bpy.path.relpath(normalized,start=str(BASE/'blender'))
    bpy.context.scene.render.filepath='//../previews/workspace_v2_preview.png'


def main(load_source=True):
    if load_source:
        REPORT.write_text(json.dumps(dict(status='building')),encoding='utf-8')
        bpy.ops.wm.open_mainfile(filepath=str(BASE/'blender'/'workspace.blend'))
        # A new UI context becomes available after the file-load callback returns.
        bpy.app.timers.register(lambda: guarded_main(False) and None, first_interval=.25)
        return
    before=SNAPSHOT()
    audit=json.loads((BASE/'reports'/'workspace_v1_structure.json').read_text(encoding='utf-8'))
    if audit['status']!='passed':raise RuntimeError('v1 inspection must pass first')
    original_hashes=audit['source_sha256']
    for relative,expected in original_hashes.items():
        if hashlib.sha256((BASE/relative).read_bytes()).hexdigest()!=expected:
            raise RuntimeError('v1 changed since inspection: '+relative)
    for name in ('Chair_Placeholder','Backpack_Placeholder'):
        obj=bpy.data.objects.get(name)
        if obj is None or obj.type!='EMPTY' or obj.children:
            raise RuntimeError('Unexpected placeholder structure: '+name)
        bpy.data.objects.remove(obj,do_unlink=True)
    normalize_paths()
    parent=bpy.data.objects['Interactive']
    chair=build_chair(parent);bag=build_backpack(parent)
    after=SNAPSHOT()
    changes=[]
    for name,entry in before.items():
        if name in ('Chair_Placeholder','Backpack_Placeholder'):continue
        if after.get(name)!=entry:changes.append(name)
    if changes:raise RuntimeError('Existing scene unexpectedly changed: '+', '.join(changes))
    # Preserve the existing light rig, camera, view transform, resolution and samples.
    blend=BASE/'blender'/'workspace_v2.blend'
    bpy.ops.wm.save_as_mainfile(filepath=str(blend))
    checks=rotations_and_contact(chair,bag)
    errors=[]
    for pose in checks['chair_rotations']:
        if pose['furniture_intersections']:errors.append('Chair intersection at '+str(pose['degrees']))
        if pose['wheel_floor_error_m']>.001:errors.append('Wheel floor contact failed')
    if checks['backpack_floor_error_m']>.001:errors.append('Backpack floor contact failed')
    if not checks['backpack_occludes_leg_at_test_ray']:errors.append('Backpack does not occlude desk leg test ray')
    if checks['backpack_leg_intersections']:errors.append('Backpack intersects desk leg')
    if errors:
        REPORT.write_text(json.dumps(dict(status='failed',errors=errors,placement=checks),indent=2),encoding='utf-8')
        raise RuntimeError('; '.join(errors))
    bpy.ops.render.render(write_still=True)
    # Store the restored default pose and portable render path.
    bpy.ops.wm.save_as_mainfile(filepath=str(blend))
    root=bpy.data.objects['Workspace'];scene=bpy.context.scene
    bpy.ops.object.select_all(action='DESELECT')
    objects=[root,*root.children_recursive,scene.camera]
    for obj in objects:obj.select_set(True)
    bpy.context.view_layer.update()
    expected={o.name:[list(row) for row in o.matrix_world] for o in objects}
    parents={o.name:o.parent.name if o.parent else None for o in objects}
    screens={n:bpy.data.objects[n].data.materials[0].name for n in ('MonitorScreen','FrameArtwork','PhoneScreen')}
    material_values={}
    for mat in bpy.data.materials:
        if not mat.use_nodes:continue
        shader=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
        if shader:
            material_values[mat.name]={key:list(shader.inputs[key].default_value) if key=='Base Color' else float(shader.inputs[key].default_value) for key in ('Base Color','Roughness','Metallic')}
    source_inventory=SNAPSHOT()
    path_audit=I['paths']()
    if 'C:\\Users\\17526\\OneDrive\\Documents\\ChatGPT\\Personal Website' in json.dumps(path_audit):
        raise RuntimeError('Outdated path remains')
    glb=BASE/'models'/'workspace_v2.glb'
    bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',use_selection=True,
        export_extras=True,export_yup=True,export_cameras=True,export_lights=False,
        export_apply=True,export_materials='EXPORT',export_animations=False)
    result=H['validate'](glb,expected,parents,screens)
    pbr_errors=[]
    for name,expected_values in material_values.items():
        mat=bpy.data.materials.get(name)
        shader=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None) if mat and mat.use_nodes else None
        if shader is None:
            pbr_errors.append('Missing PBR shader: '+name);continue
        for key,value in expected_values.items():
            actual=shader.inputs[key].default_value
            deviation=max(abs(a-b) for a,b in zip(actual,value)) if isinstance(value,list) else abs(actual-value)
            if deviation>1e-5:pbr_errors.append('PBR value mismatch: '+name+' '+key)
    result['errors'].extend(pbr_errors)
    result['pbr_materials_verified']=len(material_values)
    result['pbr_errors']=pbr_errors
    result['objects']=source_inventory
    imported_chair=bpy.data.objects.get('Chair_Root')
    imported_bag=bpy.data.objects.get('Backpack_Root')
    if not imported_chair or imported_chair.get('rotation_axis_gltf')!='Y':
        result['errors'].append('Chair root metadata missing')
    if not imported_bag or not bpy.data.objects.get('Backpack_FrontPocket'):
        result['errors'].append('Independent backpack/pocket hierarchy missing')
    if bpy.data.objects.get('Chair_Placeholder') or bpy.data.objects.get('Backpack_Placeholder'):
        result['errors'].append('Replaced placeholders still exported')
    for relative,expected_hash in original_hashes.items():
        if hashlib.sha256((BASE/relative).read_bytes()).hexdigest()!=expected_hash:
            result['errors'].append('v1 file modified: '+relative)
    result.update(status='passed' if not result['errors'] else 'failed',placement=checks,
                  existing_objects_preserved=len(before)-2,existing_scene_changes=changes,
                  paths=path_audit,glb_bytes=glb.stat().st_size,
                  source_files_unchanged=True,preview='previews/workspace_v2_preview.png',
                  limitations=['Fabric uses PBR roughness and modeled seams rather than a woven texture.',
                               'Zippers and adjustment mechanisms are simplified; no interaction or physics implemented.'])
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8')
    bpy.ops.wm.open_mainfile(filepath=str(blend))
    if result['status']!='passed':raise RuntimeError('; '.join(result['errors']))
    print('WORKSPACE V2 VALIDATED',json.dumps(result))


def guarded_main(load_source=True):
    try:
        main(load_source)
    except Exception:
        import traceback
        detail = traceback.format_exc()
        previous = json.loads(REPORT.read_text(encoding='utf-8')) if REPORT.exists() else {}
        previous.update(status='failed', traceback=detail)
        REPORT.write_text(json.dumps(previous,indent=2),encoding='utf-8')
        raise

if __name__=='__main__':
    guarded_main()
