"""Generate the Phase 1 portfolio workspace using Blender's bundled Python.

Run: blender --background --python build_workspace.py -- --output-dir <workspace>
Coordinates: metres, X right, Y toward wall, Z up; camera faces from negative Y.
Requires Blender 4.2+ with its bundled glTF exporter. No third-party dependencies.
"""
import argparse
import json
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector


def arguments():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path,
                        default=Path(__file__).resolve().parents[1])
    parser.add_argument("--samples", type=int, default=128)
    parser.add_argument("--resolution", type=int, default=1600,
                        help="Preview width; height is two thirds of width")
    return parser.parse_args(argv)


def empty(name, parent=None, location=(0, 0, 0)):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    obj.parent = parent
    obj.location = location
    obj.empty_display_type = "PLAIN_AXES"
    obj.empty_display_size = 0.12
    return obj


def material(name, color, roughness=0.65, metallic=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = next(node for node in mat.node_tree.nodes if node.type == "BSDF_PRINCIPLED")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return mat


def finish(obj, name, parent, mat, bevel=0):
    obj.name = name
    obj.parent = parent
    if mat:
        obj.data.materials.append(mat)
    if bevel:
        modifier = obj.modifiers.new("Soft manufactured edges", "BEVEL")
        modifier.width = bevel
        modifier.segments = 3
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    if obj.type == "MESH":
        modifier = obj.modifiers.new("Weighted corner normals", "WEIGHTED_NORMAL")
        modifier.keep_sharp = True
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    return obj


def box(name, location, dimensions, mat, parent, bevel=0.003):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, name, parent, mat, bevel)


def cylinder(name, location, radius, depth, mat, parent, bevel=0.002):
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=radius, depth=depth,
                                      location=location)
    return finish(bpy.context.object, name, parent, mat, bevel)


def surface(name, location, width, height, radius, mat, parent):
    """Rounded, camera-facing -Y plane with full 0..1 UVs for web content."""
    vertices = []
    for cx, cz, start in ((width / 2 - radius, -height / 2 + radius, -90),
                          (width / 2 - radius, height / 2 - radius, 0),
                          (-width / 2 + radius, height / 2 - radius, 90),
                          (-width / 2 + radius, -height / 2 + radius, 180)):
        for step in range(5):
            angle = math.radians(start + step * 22.5)
            vertices.append((cx + radius * math.cos(angle), 0,
                             cz + radius * math.sin(angle)))
    mesh = bpy.data.meshes.new(name + "Mesh")
    mesh.from_pydata(vertices, [], [tuple(range(len(vertices)))])
    mesh.update()
    uv = mesh.uv_layers.new(name="ContentUV")
    for loop in mesh.loops:
        x, _, z = vertices[loop.vertex_index]
        uv.data[loop.index].uv = (x / width + .5, z / height + .5)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    return finish(obj, name, parent, mat)


def lathe(name, profile, location, mat, parent, segments=64):
    """Closed revolved cross section: outer shell, lip, inner cavity and base."""
    vertices = []
    for radius, z in profile:
        for i in range(segments):
            angle = 2 * math.pi * i / segments
            vertices.append((radius * math.cos(angle), radius * math.sin(angle), z))
    faces = []
    for j in range(len(profile)):
        next_j = (j + 1) % len(profile)
        for i in range(segments):
            k = (i + 1) % segments
            faces.append((j * segments + i, j * segments + k,
                          next_j * segments + k, next_j * segments + i))
    mesh = bpy.data.meshes.new(name + "Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    return finish(obj, name, parent, mat)


def area(name, location, energy, size, target):
    bpy.ops.object.light_add(type="AREA", location=location)
    obj = bpy.context.object
    obj.name = name
    obj.data.energy = energy
    obj.data.shape = "DISK"
    obj.data.size = size
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()
    return obj


def build():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.scale_length = 1.0
    root = empty("Workspace")
    root["units"] = "metres"
    root["front_axis"] = "-Y in Blender; +Z in glTF"
    environment = empty("Environment", root)
    nav = empty("Navigation", root)
    decor = empty("Decorations", root)
    interactive = empty("Interactive", root)
    placeholders = empty("Placeholders", root)

    black = material("Furniture | matte charcoal", (0.023, 0.025, 0.026), 0.74)
    edge = material("Electronics | satin graphite", (0.012, 0.015, 0.018), 0.36, 0.18)
    wall = material("Wall | warm neutral gray", (0.30, 0.295, 0.285), 0.92)
    white = material("Floor | studio white", (0.88, 0.88, 0.875), 0.86)
    paper = material("Paper | warm ivory", (0.79, 0.77, 0.72), 0.91)
    ceramic = material("Ceramic | soft off-white", (0.82, 0.81, 0.775), 0.27)
    screen = material("Monitor | replaceable display", (0.72, 0.79, 0.83), 0.32)
    display_shader = next(node for node in screen.node_tree.nodes if node.type == "BSDF_PRINCIPLED")
    display_shader.inputs["Emission Color"].default_value = (0.72, 0.79, 0.83, 1)
    display_shader.inputs["Emission Strength"].default_value = 0.18
    glass = material("Phone | replaceable dark glass", (0.009, 0.014, 0.019), 0.20, 0.12)
    gray = material("Print | gray ink", (0.29, 0.29, 0.28), 0.90)
    bookmat = material("Book | slate cloth", (0.075, 0.09, 0.10), 0.90)

    # Panel and furniture. Bevelled panel silhouette gives soft upper corners.
    box("Wall", (0, 0.39, .945), (2.54, 0.10, 1.89), wall, environment, 0.065)
    box("Floor", (0, 0, -0.055), (200, 200, 0.10), white, environment, 0)
    desk = empty("Desk", environment)
    box("Tabletop", (0, -0.13, 0.86), (2.80, 0.82, 0.065), black, desk, 0.006)
    box("LeftLeg", (-1.31, -0.14, 0.418), (0.065, 0.72, 0.83), black, desk, 0.004)
    cabinet = empty("DrawerCabinet", desk)
    box("CabinetShell", (1.08, -0.125, 0.414), (0.60, 0.76, 0.823), black, cabinet)
    for i, (z, h) in enumerate(((0.701, 0.215), (0.475, 0.215), (0.185, 0.34)), 1):
        box("DrawerFront_%02d" % i, (1.08, -0.518, z), (0.514, 0.023, h), black, cabinet)
    shelf = empty("Shelf", environment)
    box("ShelfBoard", (0.79, 0.235, 1.57), (0.68, 0.30, 0.045), black, shelf)
    books = empty("Books", decor)
    for i, (x, w, h, tilt, mat) in enumerate(((0.55, .053, .25, 0, edge),
                                             (.615, .043, .245, 0, black),
                                             (.686, .045, .242, 9, paper)), 1):
        obj = box("ShelfBook_%02d" % i, (x, .255, 1.594 + h / 2),
                  (w, .145, h), mat, books, .002)
        obj.rotation_euler.y = math.radians(-tilt)

    # Monitor: physical size about 87 x 52 cm, screen is independent and UV mapped.
    monitor = empty("Monitor", nav, (0, 0.02, 1.29))
    box("MonitorHousing", (0, 0, 0), (.89, .052, .525), edge, monitor, .021)
    display = surface("MonitorScreen", (0, -.028, 0), .837, .474, .007, screen, monitor)
    display["role"] = "Projects; replace material or map content to front (-Y) face"
    box("MonitorNeck", (0, .035, -.322), (.145, .06, .138), black, monitor, .004)
    box("MonitorBase", (0, -.004, -.3895), (.33, .225, .016), edge, monitor, .006)

    frame = empty("WallFrame", nav, (-.82, .304, 1.58))
    box("FrameBacking", (0, 0, 0), (.59, .028, .52), black, frame, .003)
    art = surface("FrameArtwork", (0, -.019, 0), .526, .455, .001, paper, frame)
    art["role"] = "About Me; replace artwork material or child graphic nodes"
    # Real frame rails, so the off-white insert sits within a raised black border.
    for name, loc, dims in (
        ("FrameTop", (0, -.023, .246), (.59, .035, .032)),
        ("FrameBottom", (0, -.023, -.246), (.59, .035, .032)),
        ("FrameLeft", (-.279, -.023, 0), (.032, .035, .46)),
        ("FrameRight", (.279, -.023, 0), (.032, .035, .46)),
    ):
        box(name, loc, dims, edge, frame, .002)
    graphic = empty("ArtworkGraphic", art)
    dot = cylinder("ArtworkCircle", (0, -.006, .11), .043, .002, edge, graphic, 0)
    dot.rotation_euler.x = math.pi / 2
    for i, (z, width) in enumerate(((.02, .28), (-.02, .28), (-.06, .22), (-.115, .10)), 1):
        box("ArtworkLine_%02d" % i, (0, -.006, z), (width, .002, .013), gray, graphic, 0)

    # Stand and phone are separate assemblies, leaving 7 mm between phone and deck.
    stand = empty("PhoneStand", root, (-.61, -.235, .893))
    box("PhoneStandBase", (0, 0, .008), (.15, .14, .016), edge, stand)
    box("PhoneStandUpright", (0, .045, .052), (.065, .014, .08), black, stand)
    box("PhoneStandCradle", (0, -.012, .022), (.13, .058, .013), edge, stand)
    phone = empty("Smartphone", nav, (-.61, -.238, 1.033))
    phone.rotation_euler.x = math.radians(-14)
    box("PhoneBody", (0, 0, 0), (.109, .014, .226), edge, phone, .008)
    ps = surface("PhoneScreen", (0, -.008, 0), .096, .208, .006, glass, phone)
    ps["role"] = "Contact; front (-Y) surface, separate replaceable material"
    box("PhoneSpeaker", (0, -.0095, .094), (.023, .001, .002), black, phone, .0005)

    keyboard = empty("Keyboard", decor, (-.035, -.357, .900))
    box("KeyboardBase", (0, 0, 0), (.73, .18, .017), edge, keyboard, .004)
    for row in range(5):
        for col in range(13):
            # Last row has a single long space bar and fewer modifier keys.
            if row == 4 and 3 <= col <= 9:
                if col == 3:
                    box("Key_Space", (-.055, -.065, .014), (.28, .024, .009), black, keyboard, .002)
                continue
            box("Key_%02d_%02d" % (row, col), (-.335 + col * .043, .062 - row * .032, .014),
                (.035, .024, .009), black, keyboard, .002)
    # Numpad block, visually separated at right.
    for row in range(4):
        for col in range(2):
            box("Numpad_%d_%d" % (row, col), (.283 + col * .04, .052 - row * .033, .014),
                (.031, .024, .009), black, keyboard, .002)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, location=(.47, -.373, .915))
    mouse = bpy.context.object
    mouse.scale = (.052, .074, .024)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    finish(mouse, "Mouse", decor, edge)
    box("MouseWheel", (.47, -.344, .938), (.008, .022, .004), black, mouse, .001)
    # Parent above has nonzero location: use local offset for its child.
    bpy.data.objects["MouseWheel"].location = (0, .029, .023)

    notebook = empty("Notebook", decor, (.82, -.32, .92))
    notebook.rotation_euler.z = math.radians(-5)
    box("NotebookPages", (0, 0, 0), (.25, .295, .033), paper, notebook, .003)
    for name, z in (("NotebookLowerCover", -.020), ("NotebookUpperCover", .020)):
        box(name, (0, 0, z), (.263, .308, .006), bookmat, notebook, .002)
    box("NotebookSpine", (-.13, 0, 0), (.007, .307, .042), bookmat, notebook, .002)

    mug = empty("CoffeeMug", decor, (1.035, .047, .894))
    lathe("MugBody", ((.001, 0), (.048, 0), (.065, .015), (.069, .125),
                       (.068, .151), (.062, .153), (.060, .145), (.059, .025),
                       (.048, .015), (.001, .015)), (0, 0, 0), ceramic, mug)
    # Full curved handle with its inner edge embedded in the outside of the cup.
    bpy.ops.mesh.primitive_torus_add(major_segments=40, minor_segments=12,
        location=(.075, 0, .082), major_radius=.041, minor_radius=.008,
        rotation=(math.pi / 2, 0, 0))
    finish(bpy.context.object, "MugHandle", mug, ceramic)

    # Hollow, tapered wastebasket. Pivot at floor contact for later rigid-body use.
    trash = lathe("TrashBin", ((.001, 0), (.123, 0), (.139, .02), (.155, .39),
        (.153, .403), (.143, .403), (.143, .39), (.128, .026), (.001, .026)),
        (1.63, -.55, .001), black, interactive)
    trash["role"] = "Independent movable wastebasket"
    trash["pivot"] = "bottom centre; local Z up"
    trash["collision_hint"] = "Use convex hull for exterior collision; compound mesh for usable cavity"

    # GLB exports these as empty nodes, with size hints in extras; no visible boxes.
    for name, loc, dims in (
        ("Chair_Placeholder", (0, -.92, 0), (.98, .91, 1.24)),
        ("Backpack_Placeholder", (-1.43, -.61, 0), (.48, .30, .66)),
        ("DeskPlant_Placeholder", (-.96, -.02, .893), (.48, .37, .47)),
        ("ShelfPlant_Placeholder", (.99, .23, 1.593), (.40, .34, .45)),
    ):
        obj = empty(name, placeholders, loc)
        obj.empty_display_type = "CUBE"
        obj.empty_display_size = max(dims) / 2
        obj["asset_dimensions_m"] = list(dims)
        obj["anchor"] = "bottom centre of future asset"
        obj["placeholder"] = True
        if name == "ShelfPlant_Placeholder":
            obj["trailing_foliage_drop_m"] = .25

    bpy.ops.object.camera_add(location=(0, -8.5, 3.45))
    camera = bpy.context.object
    camera.name = "WorkspaceCamera"
    target = Vector((0, -.05, .70))
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 4.20
    camera.data.lens = 50
    camera.data.clip_end = 300
    scene.camera = camera
    area("Key_Softbox", (-3.5, -4.5, 6), 420, 4.0, (0, 0, .8))
    area("Fill_Softbox", (4, -2, 3.5), 180, 3.5, (0, 0, 1))
    area("Top_Softbox", (0, 1, 5), 250, 3.0, (0, -.2, .6))
    scene.world.use_nodes = True
    background = next(node for node in scene.world.node_tree.nodes if node.type == "BACKGROUND")
    background.inputs["Color"].default_value = (.85, .85, .85, 1)
    background.inputs["Strength"].default_value = .45
    scene.render.engine = "CYCLES"
    scene.cycles.use_denoising = True
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.exposure = .6
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    return root


def validate(glb_path, expected, parents, screen_materials):
    """Reimport into an empty scene and compare names, parentage and transforms."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(glb_path))
    imported = {obj.name: obj for obj in bpy.context.scene.objects}
    errors = []
    for name, matrix in expected.items():
        obj = imported.get(name)
        if obj is None:
            errors.append("Missing node: " + name)
            continue
        parent_name = obj.parent.name if obj.parent else None
        if parent_name != parents[name]:
            errors.append("Parent mismatch: " + name)
        deviation = max(abs(obj.matrix_world[r][c] - matrix[r][c])
                        for r in range(4) for c in range(4))
        if deviation > .0001:
            errors.append("World transform mismatch: " + name)
        if obj.type == "MESH" and not obj.data.materials:
            errors.append("No imported material: " + name)
    for name, mat_name in screen_materials.items():
        obj = imported.get(name)
        if obj and (obj.type != "MESH" or not obj.data.uv_layers):
            errors.append("Missing UV-mapped mesh: " + name)
        if obj and not any(mat and mat.name.startswith(mat_name) for mat in obj.data.materials):
            errors.append("Screen material mismatch: " + name)
    for name in ("Chair_Placeholder", "Backpack_Placeholder", "DeskPlant_Placeholder", "ShelfPlant_Placeholder"):
        obj = imported.get(name)
        if obj and (not obj.get("placeholder") or "asset_dimensions_m" not in obj):
            errors.append("Missing placeholder metadata: " + name)
    meshes = [obj for obj in imported.values() if obj.type == "MESH"]
    return {"status": "passed" if not errors else "failed", "errors": errors,
            "imported_nodes": len(imported), "mesh_nodes": len(meshes),
            "triangles": sum(len(p.vertices) - 2 for obj in meshes for p in obj.data.polygons),
            "checks": ["names", "hierarchy", "world transforms (0.1 mm tolerance)",
                       "mesh materials", "screen UVs", "placeholder extras"],
            "blender_version": bpy.app.version_string}


def main():
    args = arguments()
    if bpy.app.version < (4, 2, 0):
        raise RuntimeError("Use Blender 4.2 or newer")
    output = args.output_dir.resolve()
    for folder in ("models", "blender", "previews"):
        (output / folder).mkdir(parents=True, exist_ok=True)
    report_path = output / "models" / "validation_report.json"
    # Remove a stale success report before a new attempt.
    report_path.write_text(json.dumps({"status": "building"}, indent=2), encoding="utf-8")
    root = build()
    scene = bpy.context.scene
    scene.cycles.samples = max(1, args.samples)
    scene.render.resolution_x = max(300, args.resolution)
    scene.render.resolution_y = round(scene.render.resolution_x * 2 / 3)
    scene.render.resolution_percentage = 100
    scene.render.filepath = str(output / "previews" / "workspace_preview.png")
    bpy.context.view_layer.update()
    blend = output / "blender" / "workspace.blend"
    bpy.ops.wm.save_as_mainfile(filepath=str(blend))
    bpy.ops.render.render(write_still=True)

    bpy.ops.object.select_all(action="DESELECT")
    export_objects = [root, *root.children_recursive, scene.camera]
    for obj in export_objects:
        obj.select_set(True)
    expected = {obj.name: [list(row) for row in obj.matrix_world] for obj in export_objects}
    parents = {obj.name: obj.parent.name if obj.parent else None for obj in export_objects}
    surfaces = {name: bpy.data.objects[name].data.materials[0].name
                for name in ("MonitorScreen", "FrameArtwork", "PhoneScreen")}
    glb = output / "models" / "workspace.glb"
    bpy.ops.export_scene.gltf(filepath=str(glb), export_format="GLB",
        use_selection=True, export_extras=True, export_yup=True,
        export_cameras=True, export_lights=False, export_apply=True,
        export_materials="EXPORT", export_animations=False)
    report = validate(glb, expected, parents, surfaces)
    report["glb_bytes"] = glb.stat().st_size
    report["preview"] = str(output / "previews" / "workspace_preview.png")
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    # Restore the editable studio scene after the deliberately destructive import test.
    bpy.ops.wm.open_mainfile(filepath=str(blend))
    if report["status"] != "passed":
        raise RuntimeError("GLB validation failed: " + "; ".join(report["errors"]))
    print("WORKSPACE COMPLETE: " + str(output))
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
