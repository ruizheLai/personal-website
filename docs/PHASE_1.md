# Portfolio website — Phase 1 handoff

## Implementation

The existing `workspace/models/workspace_v2.glb` is copied byte for byte to
`public/models/workspace_v2.glb`; the source has not been regenerated or edited.
The web audit confirms 211 nodes, 182 meshes and 21 materials. It checks the actual
navigation assemblies, orthographic camera, and `Chair_Root` Y-up metadata and
identity default rotation before web assets are synchronized.

The camera takes its position and quaternion from `WorkspaceCamera`. Its orientation
is fixed. Only the orthographic projection's zoom changes. Initial world widths
are 7.4 m on desktop, 6.1 m on tablet and 4.5 m on mobile, with responsive aspect
ratio. The 1440 × 900 default composition occupies approximately 46% of the viewport
width and leaves the chair, backpack and bin visible.

Wheel handling is scoped to the central workspace area. Ctrl/Meta-wheel browser
zoom remains available, and listeners are removed on unmount. Zoom and chair motion
use delta-time damping; reduced-motion preference disables chair tracking and
removes interpolation. Touch input does not require hover or mouse tracking.

R3F raycasting walks actual ancestors named `WallFrame`, `Monitor` and `Smartphone`.
Only material clones are highlighted; color, roughness and hierarchy of the source
asset remain intact. Keyboard controls are normal DOM buttons projected to object
positions, sharing the page's React tree. Tooltips exist only for active hover/focus.
No Drei HTML sub-roots, post-processing, physics or animation libraries are used.

The existing PBR floor receives a neutral emissive studio fill for a seamless light
page, plus a transparent shadow catcher using the same geometry. Other PBR base
properties are preserved. The renderer uses AgX tone mapping, capped DPR (1.5 desktop,
1.25 mobile), 1024/512 shadow maps and demand-driven frames that stop when animations
settle. Cached geometry remains owned by the GLTF loader; owned materials and event
listeners are cleaned up on unmount.

## Validation performed

- `npm run check:model`: required names/camera/pivot checked; served source hash matches.
- `npm run typecheck`: passed.
- `npm run build`: passed, with all four requested routes and the not-found route generated.
- npm install/package-lock audit: 0 vulnerabilities in 109 installed packages.
- Desktop review at 1440 × 900: no permanent labels or extra hero text, complete default framing.
- Mobile review at 390 × 844 and tablet review at 1024 × 768: no horizontal overflow.
- Mobile Projects grid: one column; all header links remain visible.
- Three actual canvas clicks: wall frame → `/about`, monitor → `/projects`, phone → `/contact`.
- Hover labels: About Me, View Projects and Get in Touch appeared only on their targets.
- Keyboard Tab focus exposed the Projects tooltip; Enter navigated successfully.
- Zoom limits measured from projected DOM control spacing: 1.7× maximum, 0.90000019× minimum.
- Chair visibly tracked left and right, then returned to neutral on pointer leave.
- Intentional GLB 404 through an isolated localhost proxy: saved-render fallback and retry appeared.
- Restored model response plus Try again: interactive scene recovered successfully.
- Normal-route browser session: no runtime errors after clean reload and route cycling.

Review screenshots are `docs/previews/home-desktop.png` and `home-mobile.png`.
The temporary QA proxy was stopped. The normal development preview uses
`http://127.0.0.1:3000`.

## Remaining scope and limits

About, education, experience, contact details and case-study descriptions are
intentional placeholders. Only the verified GitHub URL is used; there is no fake
contact form. The GLB remains static except for chair rotation and navigation hover
feedback. Backpack/skills, trash physics, steam and monitor-entry transitions belong
to later phases.

The WebGL-unavailable and reduced-motion branches are implemented and code-reviewed;
the browser tooling did not force those OS/GPU settings. Model-load failure and retry
were verified in the browser. Testing used responsive browser viewports, not physical
mobile/tablet hardware. The installed Three.js/R3F combination emits an upstream
`THREE.Clock` deprecation warning in development; it does not affect functionality.
