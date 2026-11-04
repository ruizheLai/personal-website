# Phase 2B.1 — Interactive Workspace Refinement

Implemented in E:\Personal Website on 4 November 2026, building on ca0d8fc.

## Experience

The supplied cartoon portrait replaces the frame image through ARTWORK.default in lib/workspace-config.ts. The source PNG is copied unchanged to public/images/about-avatar-v3.png. It remains square, centered, sRGB, unmirrored and fully visible during hover. The existing frame geometry is unchanged. Previous avatars and Blender/GLB versions are preserved.

The old backpack panel is replaced by six transparent billboard image planes: Football, Basketball, Running, UI/UX Design, Product Design and AI Development. Hover opens the existing pocket/pulls and reveals only images, with staggered emergence from the actual bag opening and a small asynchronous float. Clicking or pressing Enter/Space focuses the whole bag/cluster through the shared camera controller. All six plain text labels appear together after camera focus completes. Empty-space click/tap or Escape returns to the prior workspace zoom; the backpack never navigates. A transparent interaction region bridges gaps between the bag and icons without adding visible UI. The narrow layout places the cluster higher to keep the frame, phone and labels clear.

Primary frame, monitor and phone focus now show only “Click again to enter”, with no Back button or filled container. Their second activation still navigates to About, Projects and Contact. Coffee steam and the coffee message remain; the message now uses plain text. The white background, header, default composition and chair tracking are retained.

## Reusable physical manipulation

The bin and all four papers share usePhysicsGrab and GrabbableBody. They remain dynamic Rapier rigid bodies while held. A camera-facing ray/plane projection drives bounded linear velocity toward the held target; quaternion error drives bounded angular velocity. This keeps collision response active instead of teleporting visible meshes. Release preserves and clamps motion, with recent pointer velocity contributing to throws. No joints or bodies are created during a grab.

Controls:

| Input | Action |
| --- | --- |
| Left press and drag | Grab and move/lift the bin or a paper |
| Shift + drag while held | Rotate around two axes |
| Wheel while held | Adjust depth without zooming the camera |
| Second touch pointer while held | Drag the second finger to rotate |
| Keyboard focus, Space/Enter | Grab or release an individual body |
| Arrows | Move the keyboard-held body |
| Shift + arrows | Rotate the keyboard-held body |
| Page Up / Page Down | Adjust depth |
| Home | Orient the keyboard-held body upright through the same angular controller |
| Escape | Release a held body; otherwise leave camera focus |

The keyboard controls have invisible projected focus targets and a temporary text instruction while holding. There are no permanent rotation buttons.

The bin still uses a hollow compound collider: a bottom disk and 16 convex wall wedges, with an open top. The papers have individual lightweight ball colliders and irregular faceted visual meshes. Scripted tipping and outward paper-release impulses were removed. Spill and reinsertion now follow gravity and collisions.

There is no Reset control, one-shot activation flag, timeout reset or reset on focus/settling. Body transforms and momentum persist during normal play. Client route changes preserve plain-number pose snapshots in memory; returning Home restores both the sleeping body transforms and their visible meshes. A full browser reload initializes a fresh workspace.

Invisible floor/side/depth/ceiling colliders keep the five movable objects recoverable in a corridor to the right of the furniture. Only these objects participate in physics; desk and chair cannot be pushed. Stationary bodies sleep, and the independent simulation pauses once settled or when the workspace is hidden or camera focus is active. Drag release suppresses stray clicks, and camera wheel handling is locked during grabbing. Pointer up/cancel/blur/unmount release capture and listeners.

## Supplied assets

The six local PNG copies are under public/images/backpack-icons/. Original artwork colours and proportions are retained. Preparation trims excess padding using alpha > 32 bounds with 16 pixels of breathing room and clears alpha values below 12 to remove near-invisible background speckles. Source Downloads files are untouched. Runtime alpha testing removes low-opacity rectangular fringes; textures use sRGB and unlit materials without tone mapping.

scripts/prepare-refinement-assets.mjs accepts --avatar <supplied PNG> and --icons <source directory>. It records source SHA-256 values and crop dimensions in backpack-icons/manifest.json. Sharp 0.35.5 is an explicit development dependency.

Avatar SHA-256:
0bc851c1df8022566443d69f120a917f8d7ed4004bc4f1407d3725e00aeb4072

Unchanged workspace_v3 GLB SHA-256:
5271ed53d9c40f128da6b888fdf4a04ab5e50ff4c217a7c5bdb0fcf80dc535b1
(2,163,588 bytes; 205 nodes; 177 meshes.)

No Blender or GLB edits or exports were necessary.

## Validation

Commands:

- npm run typecheck — passed.
- npm run check:interactions — passed.
- npm run check:model — passed; source/served hash and scene hierarchy preserved.
- npm run build — passed; all existing routes prerendered.
- npm install dependency audit — 0 vulnerabilities.

The asset/layout test verifies the exact copied avatar hash and 1:1 aspect, six supplied PNGs with alpha channels and sufficient resolution, unique configuration entries and world-space focus bounds.

The native Rapier test uses the shared velocity/angular controller and hollow wall generator. It executes lift, natural spill without paper impulses, re-grab, standing the bin upright, and returning paper through the opening. Forty repeated grab/release cycles keep the world at exactly 6 rigid bodies and 27 colliders. It also checks floor contact tolerance and equivalent-quaternion stability. This is a bounded object-count stress check, not a hardware memory/FPS benchmark.

Actual browser checks at 1440 × 900 and 390 × 844:

- Supplied avatar visible in the square frame, including camera focus.
- Six images appear on backpack hover without text; crossing the image region keeps it open.
- Backpack click/tap focus reveals all six labels together, with no cards, pills or borders.
- Focused labels and images remain usable in the narrow layout.
- Empty-space click/tap and Escape leave backpack focus.
- Pointer lift/throw/re-grab of the bin; keyboard lift, rotation, release, re-grab and upright recovery.
- Paper 1 lifted from the floor, moved above the opening, lowered, released and retained inside the bin. Observed center after return: approximately (1.655, 0.052, 0.543), with the bin approximately (1.657, -0.006, 0.527). Escaped-paper count changed from 4 to 3.
- Papers 2–4 independently grabbed, moved and released.
- Fixed body/collider counts throughout the observed continuous visit.
- All three primary objects focus and navigate to their expected routes; Projects page preview and phone app artwork remain visible.
- Empty background exits primary focus; no Back/Reset controls remain.
- Header Home/About links work. A played bin/paper arrangement survives navigation away and back with matching physical poses and visible transforms.
- Coffee steam/click message and pointer-driven chair response remain.
- Wheel zoom moves the projected controls; returning from backpack focus restores the exact previous projected position in the observed check.
- Production navigation while a bin is held releases cleanly; no runtime errors in the final production interval. Two dependency deprecation warnings remain.
- Production runtime smoke checks and screenshots.

### Limits

The PNGs remain flat billboard art; they are not newly modeled 3D objects. Pocket/pull motion is still a restrained rigid-part approximation, not a functional zipper or cloth simulation. Paper collision spheres approximate their faceted meshes.

Depth positioning can require the wheel or keyboard depth keys. Invisible physical boundaries can stop a throw, and solver/contact tolerances allow small settling offsets. Touch rotation is implemented but was not verified on a physical multi-touch device. Rotation/upright recovery was exercised through keyboard controls; the Shift-drag pointer branch was reviewed in code. Narrow-viewport click/tap behavior is browser testing, not a physical-device certification. Reduced-motion branches disable ambient icon movement and camera easing; OS preference switching and GPU/memory profiling were not separately exercised.

Dependency deprecation warnings for THREE.Clock and Rapier initialization remain. No patch to vendored dependencies was made.

## Screenshots

docs/previews/phase-2b-1/ contains:

- default.jpg
- backpack-hover.jpg
- backpack-focus.jpg
- backpack-focus-mobile.jpg
- bin-grabbed.jpg
- bin-thrown.jpg
- bin-released.jpg
- paper-above-bin.jpg
- paper-at-opening.jpg
- paper-returned.jpg
- frame-focused.jpg
- monitor-focused.jpg

The paper sequence documents placement through the opening; final paper is naturally occluded by the bin walls. Keyboard focus outlines in manipulation captures are accessibility feedback, not permanent control containers.

All project writes were on E:. The preserved old C: project directory was untouched.
