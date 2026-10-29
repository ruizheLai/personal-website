# Phase 2A.1 — Workspace visual refinement

## Result

The active application uses `workspace/models/workspace_v3.glb`, copied byte for
byte to `public/models/workspace_v3.glb`. The previous v1/v2 Blender and GLB files,
previous avatar, and prior previews remain intact. No furniture was rebuilt.
Only the wall treatment, picture-frame geometry/material and avatar source changed.

### Seamless white wall

The original bounded mesh was named `Wall`, independently parented to
`Environment`. It was first hidden on a cloned Three.js scene and visually
reviewed before editing the Blender source. That trial screenshot is preserved.

The v3 source removes that bounded rounded box. It adds `SeamlessWall`, a large
200 × 200 m white support surface at the original panel's front surface, with
its boundaries outside every supported camera composition. It uses the floor's
neutral material. Frame, shelf, books, desk, chair, backpack and bin retain their
positions and parent hierarchies. The mounting depth matches the original wall
surface; no new hardware or visible supporting edge is introduced.

On the web, the same neutral studio fill used by the existing floor is applied
to the support. It does not cast a large wall shadow. A transparent shadow layer
reuses its geometry at a 1 mm forward offset, receiving restrained frame/shelf
and furniture shadows. Its owned material is disposed on unmount. The floor
and original ground-shadow layer remain separate and unchanged.

### Square frame and new portrait

The frame's outer local dimensions are 0.56 × 0.56 m. Its internal artwork is
0.496 × 0.496 m. Thin 32 mm rails retain the original shallow depth and bevels,
with a dedicated matte-black material (roughness 0.65, metallic 0.05).
The `WallFrame` center and transform are unchanged. The slight vertical
foreshortening visible in screenshots comes from the preserved camera pitch,
not from non-square geometry or a stretched texture.

The new supplied image was found at `C:/Users/17526/Downloads/avatar.png`.
It matches the brief's 3D cartoon portrait and was copied unchanged to
`public/images/about-avatar-v2.png`: 1254 × 1254 pixels, SHA-256
`a11e037d2f651b30b503bfd859ed725b8a2378960f3cbc0ad243e830e4ee6a38`.
The prior `public/images/about-avatar.png` remains unchanged.

The existing reusable artwork renderer still handles the portrait: sRGB texture,
linear/mipmap filtering, no tone mapping or desaturation, local XY UVs, 0.5 mm
forward offset and original aspect ratio. Idle square artwork shows the full
square image; hover/focus retains the prior subtle 3% image emphasis. There is no
new facial or tie animation. Swap `ARTWORK.default` in
`lib/workspace-config.ts` to select future variants.

The native Blender file includes a packed sRGB portrait with a relative source
path. Old abstract graphic nodes remain hidden in that editable source for
recoverability and are excluded from the new GLB. The GLB exports the separate
artwork surface with a neutral replaceable material, avoiding a second embedded
copy of the same portrait; the website supplies its configurable texture.

## Preserved interaction architecture

Frame raycasting still uses the actual `WallFrame` assembly. Focus centers,
responsive zoom and transition overlay bounds are derived from the actual
`FrameArtwork` mesh, so the new geometry automatically updates all three.
The existing camera controller, chair controller, zoom settings, interaction
state machine, header, routes, content, monitor and phone screen UI are unchanged.

A small compatibility fix was necessary for the new image: the HTML transition
overlay previously could paint a white rectangle before the avatar decoded.
`PageTransitionProvider` now waits for the actual image `decode()` promise
while keeping the 3D portrait visible. Only then does its existing expansion
start. Route completion and animation cancellation still use their real lifecycle
signals. A decode error is logged and falls back to direct route navigation
instead of leaving the interaction locked.

## Reproduce the versioned source

Run the refinement against the saved v2 source, never against an empty rebuilt
scene. The script resolves all outputs relative to its E-drive project folder:

```powershell
Set-Location -LiteralPath 'E:\Personal Website'
& "$env:LOCALAPPDATA\Microsoft\WindowsApps\blender-launcher.exe" --background --python 'E:\Personal Website\workspace\scripts\refine_workspace_v3.py'
```

For a regular Blender installation, use its `blender.exe` with the same arguments.
The Store launcher may return before its child process finishes; completion is
confirmed by `workspace/reports/workspace_v3_validation.json` reporting
`status: passed`, not by launcher exit alone.

The script loads `workspace/blender/workspace_v2.blend`, edits only the intended
objects, saves `workspace_v3.blend`, renders `workspace_v3_preview.png`,
exports `workspace_v3.glb`, then reimports that GLB to validate it. Earlier
generation scripts retain their v1/v2 outputs; this final v3 refinement is the
documented next stage and cannot overwrite those source files.

Run `npm run assets` afterwards. Both predev and prebuild also synchronize v3.
The sync script now rejects a bounded `Wall`, missing `SeamlessWall`, or
non-square artwork, in addition to the existing named-node/camera/chair checks.
It refreshes the web fallback render to the matching v3 preview.

## Validation

- Blender 5.2.3 LTS reimport: passed, no errors; names, parents, world matrices
  within 0.1 mm, material slots, screen UVs and extras verified.
- 205 imported/exported nodes, 177 mesh nodes, 137,108 triangles.
- 207 existing source objects had unchanged geometry and transforms outside the
  explicitly edited objects. Frame center and camera transform are unchanged.
- Native Blender preview was rendered and visually inspected.
- Previous v2 source/model and previous avatar hashes verified unchanged.
- New source GLB and served GLB hashes match:
  `5271ed53d9c40f128da6b888fdf4a04ab5e50ff4c217a7c5bdb0fcf80dc535b1`.
- Desktop browser review at 1440 × 900: no panel boundary, complete default
  composition, mounted-object shadows, unchanged furniture positions.
- Frame hover, centered focus, correct portrait orientation and proportions,
  About expansion and committed destination were visually checked.
- Transition screenshot confirms a decoded 1254 × 1254 image remains visible.
- Monitor wake/focus/Projects entry and phone wake/focus/Contact entry passed.
- Keyboard Enter focus and second Enter into Projects passed after the decode fix.
- Wheel zoom in/out and chair left/right/reset were verified in the browser.
- Mobile viewport 390 × 844: no horizontal overflow; square-frame focus remained
  unclipped, header accessible, and Escape restored the default composition.
- TypeScript checks and production build: passed.
- Normal browser testing produced no runtime errors.

Screenshots are in `docs/previews/phase-2a-1/`: default, frame hover, frame focus,
About expansion, mobile layout, and the original wall-hidden trial. The native
render is `workspace/previews/workspace_v3_preview.png`.

Testing used browser viewports, not physical touch hardware. Reduced-motion and
WebGL-unavailable branches were not forcibly emulated in this refinement. The
existing upstream Three.js/R3F development `THREE.Clock` warning remains.
No dependencies, physics, new routes or new content were added.
