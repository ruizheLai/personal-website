# Phase 2B — Playful Workspace Interactions

Implemented and validated on 4 November 2026 in `E:\Personal Website`.

## Result

The existing composition, camera reference, route transitions, chair controller, Blender sources and workspace_v3 GLB are preserved. Backpack, mug and bin are secondary interactions and never navigate.

- Backpack hover opens the existing front pocket by about 8 degrees and moves the independent zipper pulls. Eight monochrome HTML tokens emerge with 75 ms staggering. A 240 ms exit delay bridges the bag/content gap. Click pins/toggles; Enter/Space opens, Escape and outside click close. Closed content is inert. Projected placement clamps to the viewport and scores overlap with frame, monitor and phone.
- Mug uses three narrow shader ribbons with transparent edge/height fading and gentle sway. Hover increases opacity; click adds a short damped wiggle and a 2.4-second “Coffee break?” message. Steam updates are requested at 24 Hz desktop / 16 Hz narrow viewport; reduced motion uses static faint steam and no wiggle.
- Bin uses Rapier 2.2.0 with a bottom disk plus 16 convex wall wedges, leaving the top open. Four irregular faceted off-white paper meshes use low-cost spherical colliders. Gravity, CCD, friction and damping produce a floor spill and settling. Pointer capture supports bounded drag; substantial drags add release angular velocity, while small nudges can rock back upright. Tap/keyboard applies a tipping impulse.
- A small reset affordance appears after activation. Reset clears forces, torques, linear/angular velocity and restores all bodies. Two synchronization steps update interpolated visible transforms before physics pauses.
- Collision mass properties and collider transforms are explicitly synchronized before first interaction, avoiding a cold-start impulse instability.
- Only the bin, four papers, floor and boundary colliders exist in the physics world. Other furniture is unaffected. Main focus, page transitions and hidden/offscreen workspace pause secondary simulation. Dragging blocks wheel zoom and primary activation.
- Physics is isolated behind a lazy import, Suspense and an error boundary. The original bin remains available before initialization or if initialization fails. No source asset export was required.

## Inspected model and limitations

Actual nodes: `Backpack_Root`, `Backpack_FrontPocket`, the pocket/main pull and eye meshes, `CoffeeMug` with `MugBody/MugHandle`, and `TrashBin`.

The bin is approximately 0.31 m wide and 0.403 m tall, with a bottom pivot at world (1.63, 0.001, 0.55). The mug is approximately 0.138 m wide and 0.153 m high at (1.035, 0.894, -0.047). The backpack root is approximately (-1.43, 0.0193, 0.731), with an existing leaning rotation. Its front pocket has an independent top pivot.

The backpack animation is a rigid-pocket/pull approximation: there is no deformable cloth or physically functional zipper. Steam is three ribbons, not a fluid simulation. Paper collision shapes are spherical approximations. A small outward paper impulse at a sufficiently tipped opening helps the pieces escape; subsequent movement uses gravity and collision response. Spill count depends on drag direction and strength.

The source GLB SHA-256 remains:
`5271ed53d9c40f128da6b888fdf4a04ab5e50ff4c217a7c5bdb0fcf80dc535b1`
(2,163,588 bytes, 205 nodes, 177 meshes). No Blender or GLB files changed.

## Validation performed

- `npm run typecheck`: passed.
- `npm run check:interactions`: passed. Desktop/mobile placement stays within margins and avoids the supplied primary surface rectangles. Native Rapier tests cover cold and settled initialization, upright containment, tipping, four escaped papers, floor contact tolerance, low final velocities and zero-velocity reset.
- `npm run check:model`: passed; served/source GLB hash and existing scene hierarchy preserved.
- `npm run build`: passed; home, About, Projects and Contact prerendered.
- Browser: desktop 1440 × 900 and narrow viewport 390 × 844, including production preview.
- Backpack: actual mesh hover, all eight labels, movement into content without flicker, outside close, Enter/Space and Escape. Zoomed projected content remains in view without covering primary navigation surfaces.
- Mug: actual mesh click displays the message; subtle steam visible above the rim. Message disappears after its timer.
- Bin: desktop tap tipped and spilled four papers; substantial diagonal drag spilled three papers and settled. Production narrow-viewport tap spilled four papers and settled after 287 simulation steps (about 4.8 seconds of simulation time). Paper centers remained above the floor in the browser observations.
- Reset was visually checked: upright bin, no floor paper, zero escaped paper and simulation counter reset. Repeated activation/reset works.
- Primary regression: frame, monitor and phone first-click focus and second activation navigate to About, Projects and Contact respectively. Header Home links return. Secondary controls disable during focus; Escape restores the workspace.
- Production physics pause: step counter remained at 3 while monitor focus was active, then resumed after Escape.
- Wheel zoom changed projected object positions; backpack content remained clamped at the zoomed size. Chair response to pointer movement was visually observed.
- Production console: no errors in the clean verification interval. Existing Three.Clock and Rapier initialization-signature deprecation warnings remain in dependencies.

Viewport testing uses a desktop browser at a narrow size, not a physical touchscreen device. Reduced-motion and document-visibility branches were reviewed in code; reduced-motion OS settings and background-tab power usage were not separately benchmarked. No hardware FPS or memory benchmark is claimed. Rapier adds a lazy JavaScript/WASM payload (largest generated chunk approximately 2.24 MB uncompressed); main navigation does not wait for it.

## Screenshots

See `docs/previews/phase-2b/`:

- `default-reset.jpg`: restored idle workspace.
- `backpack-desktop.jpg`, `backpack-mobile.jpg`, `backpack-zoomed.jpg`: floating content and responsive placement.
- `coffee.jpg`: coffee message and steam.
- `bin-settled.jpg`, `bin-drag.jpg`, `bin-mobile.jpg`: physical spill and reset affordance.

## Maintenance

Object names, content and animation values are in `lib/secondary-config.ts`; collider dimensions, masses, impulses and bounds are in `lib/trash-physics.ts`. React controllers live in `components/workspace/secondary/`. Run the interaction checks with Node 24 or newer (native TypeScript stripping). Node may print a harmless module-type detection warning for the imported TypeScript utilities.

All project writes were made on E:. The preserved former C: project directory was untouched.
