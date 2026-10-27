# Workspace v2 — Chair and Backpack

The active project is `E:\Personal Website`. V2 extends the saved v1 Blender scene;
it does not reconstruct the desk, environment, navigation objects or lighting.
The original `workspace.blend`, `workspace.glb` and preview remain preserved.

## Outputs

- `blender/workspace_v2.blend`: editable scene, default chair rotation 0°.
- `models/workspace_v2.glb`: independent named nodes and PBR materials.
- `previews/workspace_v2_preview.png`: existing fixed camera, 1600 × 1067.
- `previews/workspace_v2_chair_minus18.png` and `workspace_v2_chair_plus18.png`:
  rotation review renders from the same camera.
- `reports/workspace_v1_structure.json`: full v1 hierarchy and path audit.
- `reports/workspace_v2_validation.json`: current validation status and inventory.
- `references/chair_reference.png` and `backpack_reference.png`: supplied references.

## Structure and modeled details

```text
Workspace (EMPTY)
├── Environment (EMPTY) → Wall, Floor, Desk, Shelf
├── Navigation (EMPTY)
│   ├── Monitor (EMPTY) → MonitorHousing, MonitorScreen, stand meshes
│   ├── WallFrame (EMPTY) → FrameArtwork, frame rails, artwork graphic
│   └── Smartphone (EMPTY) → PhoneBody, PhoneScreen, PhoneSpeaker
├── PhoneStand (EMPTY) → separate base, upright and cradle meshes
├── Decorations (EMPTY) → Keyboard, Mouse, Notebook, CoffeeMug, Books
├── Interactive (EMPTY)
│   ├── TrashBin (MESH)
│   ├── Chair_Root (EMPTY)
│   │   ├── curved backrest frame, rear inset, upholstery and edge piping (MESH)
│   │   ├── seat pan, cushion, curved supports and adjustable armrests (MESH)
│   │   ├── gas lift, column, tilt mechanism and adjustment lever (MESH)
│   │   ├── five tapered base spokes (MESH)
│   │   └── five caster assemblies (EMPTY) → stems, forks, paired wheels (MESH)
│   └── Backpack_Root (EMPTY)
│       ├── main compartment, front panel, seams and zipper tracks (MESH)
│       ├── carrying handle, shoulder straps and adjusters (MESH)
│       └── Backpack_FrontPocket (EMPTY) → pocket body, piping, zipper and pull (MESH)
└── Placeholders (EMPTY) → DeskPlant_Placeholder, ShelfPlant_Placeholder
```

These are parent-child groups, not merged environment geometry. The chair and
backpack replace their respective empty placeholders. Existing navigation surfaces
remain independent UV-mapped meshes. The chair root sits on the support column's
vertical axis and carries `rotation_axis_gltf = Y` and an 18° limit hint. In Blender
rotate its local Z axis; in standard glTF/Three.js coordinates rotate local Y.
The backpack pocket has a separate top-edge pivot for future opening animation.
No interaction, physics, rigging or animation has been implemented.

The chair is about 1.05 m wide and 1.285 m tall in its default pose. The backpack's
leaning assembly, including handle and rear straps, is about 0.49 × 0.53 × 0.72 m.
It is tilted backward 12° and toward the desk leg by 8°, with a small sideways yaw.
The upper strap/leg contact clearance is approximately 1 mm. The bag rests on the
floor and occludes the left desk leg from the existing fixed camera.

## Reproduce

Use Blender 5.2.3 LTS (the version verified here), or a compatible newer Blender.
The Microsoft Store executable may deny direct command-line launch; use the app's
Python Console. Select Python Console from the editor-type menu and execute:

```python
import runpy; runpy.run_path(r'E:\Personal Website\workspace\scripts\inspect_workspace.py', run_name='__main__')
```

After inspection completes, select Python Console again and execute:

```python
import runpy; runpy.run_path(r'E:\Personal Website\workspace\scripts\extend_workspace_v2.py', run_name='__main__')
```

The extension intentionally loads `blender/workspace.blend`, then defers modeling
until Blender has refreshed the loaded file's context. It writes only the v2
outputs above; rerunning replaces the previous generated v2 outputs. Save any
unrelated in-app work first. Keep the three scripts together: the extension reuses
geometry/material helpers and the inspection snapshot functions. Do not run the
v1 builder to regenerate v2.

The new Blender scene uses `//../previews/workspace_v2_preview.png` for render
output. Input and GLB export paths derive from the script directory. The v1 build
script also now saves relative render/report paths. V1's original stored render
path is recorded as historical evidence in the inspection audit; v1 itself was
not resaved. All new Blender, GLB, preview and report files are under the E: workspace.

## Validation and limitations

Validation compares unchanged v1 geometry fingerprints, transforms, hierarchy,
material assignments, camera and light properties. It renders -18°, 0° and +18°
chair poses, checks floor contact and BVH intersections with nearby furniture,
and tests backpack/leg occlusion with a camera ray. V2 is exported and reimported
into a clean Blender scene, then checked for names, hierarchy, world transforms,
screen UVs, material assignments and PBR base colour/roughness/metallic values.
The current machine-readable report records actual results and any failures.

The fabric appearance uses matte PBR roughness, rounded volume and modeled seams;
there is no woven fabric texture or photoreal microdetail. Zippers, caster forks
and adjustment mechanisms are simplified. Connected mechanical parts and sewn
panels intentionally overlap at their joins. Collision checks are static surface
checks, not a complete rigid-body or ergonomic simulation. The two plants remain
reserved for later work. Further refinement is optional rather than a required
repair; the hero camera is the primary composition target.
