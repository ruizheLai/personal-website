# Portfolio workspace — Phase 1

## Current delivery status

`scripts/build_workspace.py` has been executed in the Microsoft Store installation
of Blender 5.2.3 LTS. The `.blend`, `.glb` and Cycles preview have been generated.
GLB reimport validation passed: 133 nodes, 110 meshes, 22,890 triangles, with node
names, hierarchy, transforms, mesh materials, screen UVs and placeholder extras
checked. See `models/validation_report.json` for the latest run's actual status.
The script uses node types rather than localized default shader node names.

## Regenerate locally

Use Blender 4.2 or newer with its bundled glTF import/export support. No pip
packages, textures, or downloaded assets are required. In PowerShell, from this
repository directory, run (adjust the Blender executable to your installation):

```powershell
& 'C:\Program Files\Blender Foundation\Blender 4.5\blender.exe' --background --python-exit-code 1 --python '.\workspace\scripts\build_workspace.py'
```

For a faster first preview, append `-- --samples 32 --resolution 900`.
Default render: Cycles CPU, 128 samples with denoising, 1600 × 1067 PNG.
Custom output directory:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 4.5\blender.exe' --background --python-exit-code 1 --python '.\workspace\scripts\build_workspace.py' -- --output-dir 'C:\path\to\workspace'
```

Alternatively open Blender, switch to Scripting, open `build_workspace.py`, and
choose Run Script. The script replaces the current scene; save other work first.
When run from Blender's Text Editor, save the script to disk first so its output
directory can be resolved from `__file__`.

For the Microsoft Store installation, you can also use Blender's Python Console
(select it from the editor-type menu) and execute the following. This is the
method used to generate these deliverables:

```python
import runpy; runpy.run_path(r'E:\Personal Website\workspace\scripts\build_workspace.py', run_name='__main__')
```

The command writes:

```text
workspace/
├── models/
│   ├── workspace.glb
│   └── validation_report.json
├── blender/
│   └── workspace.blend
├── scripts/
│   └── build_workspace.py
└── previews/
    └── workspace_preview.png
```

The script saves the editable scene, renders it, exports selected workspace nodes
and the orthographic camera, then imports the GLB into a clean Blender scene. It
checks node names, parent relationships, world transforms, mesh material presence,
screen UVs/materials and placeholder metadata. It records the actual imported
node/triangle counts in the report and raises an error if a check fails. It then
reopens the saved studio scene, so the reimport test does not replace the source
project. Studio area lights remain in the `.blend` only; configure web lighting
later. The script does not implement Three.js interactions.

## Scene design

The script models a rounded gray wall panel, white studio floor, black desk with
separate tabletop/left support/cabinet and three drawer fronts, floating shelf,
three upright books, framed abstract print, monitor with stand, upright phone and
separate stand, geometric keyboard keys, mouse, closed notebook, hollow ceramic
mug with separate curved handle, and a hollow tapered wastebasket. All are real
meshes with PBR materials. Furniture bevels are applied before export.

Dimensions are in metres:

| Element | Width | Depth | Height |
| --- | ---: | ---: | ---: |
| Desk (top included) | 2.80 | 0.82 | 0.893 |
| Wall panel | 2.54 | 0.10 | 1.89 |
| Monitor housing | 0.89 | 0.052 | 0.525 |
| Wastebasket | 0.31 diameter | 0.31 diameter | 0.403 |
| Furnished composition, including reserved assets | about 3.4 | about 1.9 | about 2.04 |

The oversized studio floor is 200 × 200 m to avoid a visible horizon. The camera
is centred on X, orthographic, with a modest downward pitch so the tabletop is
visible. There is no horizontal camera angle. The phone tilts backward 14°.

`MonitorScreen`, `FrameArtwork` and `PhoneScreen` are independently named,
UV-mapped mesh objects. Their front is local -Y. These rounded planar surfaces
have full 0–1 UV coordinates ready for future image/video/canvas textures.
The frame's abstract graphic
is separate geometry under `FrameArtwork`; hide/remove `ArtworkGraphic` when
replacing the art. Navigation assemblies have useful central parent pivots.
The wastebasket origin is at its bottom centre and it remains under `Interactive`.

## Differences from the reference and review

The chair, backpack, desk plant and trailing shelf plant are intentionally absent
from renders. Four exact-name empty nodes reserve their locations and carry
`asset_dimensions_m`, `anchor`, and `placeholder` extras through the GLB.
Dimensions are in Blender XYZ; the exported GLB uses glTF Y-up coordinates.
Blender viewport empty display sizes are only markers; use the metadata for
future asset sizing. The shelf plant also has `trailing_foliage_drop_m`.

The scene will appear substantially emptier in the foreground and on the left
without those later assets. The finish is procedural, with simplified keys,
smooth walls, no photoreal microtextures, and approximate proportions inferred
from the single image. The panel has softly rounded corners at the bottom too.

The preview was compared visually with the supplied reference. The first render
had excess wall space above the monitor; a corrective pass lowered the wall and
wall decorations, raised the monitor slightly and adjusted the camera framing.
The floor exposure was also raised for a lighter studio appearance.

For future edits, open `previews/workspace_preview.png` beside the reference.
Check the wall/desk silhouette, monitor centring, upper-left frame, upper-right
shelf, phone clearance, notebook/mug spacing and bin placement. Inspect the
imported model for material appearance in your target renderer; structural
validation is not a visual comparison. Adjust positions/dimensions in `build()`
and rerun until the composition is satisfactory. Final colour and lighting in
Three.js will depend on that renderer's lighting, exposure and tone mapping.
