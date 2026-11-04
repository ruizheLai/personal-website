# Phase 2B.2 — Backpack and trash bin refinement

Implemented in the existing E: drive checkout, based on Phase 2B.1 (`861d9be`).

## Recording review

Reviewed the supplied 29.14-second recording before modifying the implementation, including sampled frames throughout the entire clip. It showed the rigid backpack grid and lateral focus shift, the separate bin lift gesture, and the existing tilt/release behavior. The video and temporary review tools are excluded from Git.

## Changes

- Normal left-button dragging now uses exactly the previous Shift-drag quaternion mapping: vertical pointer delta rotates X by delta × .012, horizontal delta rotates Z by -delta × .012, in the original multiplication order. The initial grab anchor stays fixed; the pointer does not translate it. Release retains bounded physical velocity. Floor contact can displace the bin naturally.
- Removed modifier/depth/translation modes and visible grab hints. Only the bin has pointer and keyboard grab handlers. Existing keyboard access uses the same tilt operation.
- All four paper balls remain dynamic colliding bodies, initially inside the bin. They have no picking, dragging, reinsertion controls, or instructions. The existing 6 bodies and 27 colliders remain; no Reset button.
- The six original PNGs are .24 world units, 60% of the former .40 size. They start at the actual transformed backpack opening, rise before spreading, and follow staggered curved paths into an asymmetric fan. Opening takes roughly .6–.8 seconds. Exit follows the same paths in reverse with shrinking scale and opacity.
- A shared hover region and short exit delay bridge the bag and floating objects. Focus keeps them visible. Returning from focus refreshes the cursor hit test, preserving hover when the pointer is still over the bag.
- Focus uses the existing camera controller and tween. It never relocates the workspace, backpack, or established fan. Default desktop focus zooms from 1 to 1.45 with identical camera position and orientation. Narrow viewports translate the camera only enough to contain the bag and fan; zoom is 1.9 at the tested mobile size. Small-screen fan spacing is consistent between hover and focus.
- All six plain labels fade in together after focus. Hover has no labels, cards, backgrounds, or extra icon scaling.
- Scene diagnostics expose actual camera, object, icon, and physics poses for repeatable browser verification.

## Validation

Passed:
- `npm run typecheck`
- `npm run check:interactions`
- `npm run check:model`
- `npm run build`
- `git diff --check`

The interaction checks compare the new pointer rotation against the legacy quaternion formula, exercise a real Rapier world for passive spill and floor settling, and run 20 repeat tilt/release cycles with constant body/collider counts. The spill scenario left two papers outside. Layout checks cover common origin, rise-before-spread, exact endpoints, miniature scale, asymmetric positions, fixed focus arrangement, and desktop/mobile camera containment.

Actual browser checks used both the development and production servers:
- Normal left-button grab and drag without Shift, release, re-grab, native settling, and passive spill. One development-browser spill left a paper outside and all bodies asleep; short production drags could settle upright, as expected for physical release.
- Captured a normal left-button hold with DOM state `held=bin`, `dragging=true`.
- Zero paper grab buttons, zero Reset buttons, zero grab-mode hints.
- Backpack emergence, settled hover without labels, reverse retraction, all six focused labels, empty-space return, and Escape return with pointer-over-bag hover retained.
- Camera/root/bag diagnostics confirmed default desktop focus changed zoom alone: camera (0, 3.4500000477, 8.5), root (0,0,0), and backpack (-1.4299999475, .0192581899, .7309972644) stayed fixed.
- Desktop 1440×900 and mobile 390×844 layouts; final mobile label spacing checked visually.
- Monitor preview/power-on and second-click Projects route, smartphone power-on and Contact route, frame/About route, home return, wheel zoom, coffee message/steam, and chair tracking in both pointer directions.
- No captured production console errors. Existing dependency deprecation notices remain.

The GLB remains SHA-256 `5271ed53d9c40f128da6b888fdf4a04ab5e50ff4c217a7c5bdb0fcf80dc535b1` (2,163,588 bytes, 205 nodes). Avatar, icon images, Blender files, and model geometry were not edited.

## Screenshots

All captures are actual browser output in [previews/phase-2b-2](previews/phase-2b-2/).

| Capture | State |
| --- | --- |
| [Default](previews/phase-2b-2/default.jpg) | Unfocused workspace |
| [Emergence](previews/phase-2b-2/backpack-emerging.jpg) | Staggered upward flight in progress |
| [Hover](previews/phase-2b-2/backpack-hover.jpg) | Miniature fan, no labels |
| [Focus](previews/phase-2b-2/backpack-focused.jpg) | Desktop zoom and all six labels |
| [Retraction](previews/phase-2b-2/backpack-retracting.jpg) | Reverse flight toward opening |
| [Bin held](previews/phase-2b-2/bin-dragging-no-shift.jpg) | Normal left-button hold, no Shift |
| [Bin released](previews/phase-2b-2/bin-after-release.jpg) | Fallen bin and passive paper spill |
| [Mobile](previews/phase-2b-2/mobile-focused.jpg) | Final narrow-screen focus |

## Limits

- Mobile viewport and layout were exercised with browser pointer input; physical touchscreen hardware was not tested.
- No hardware FPS benchmark was performed. Browser interaction stayed responsive; the existing demand rendering and visibility behavior remain, and no physics bodies or colliders were added.
- Icons remain camera-facing PNG planes. Slight scene overlap is intentional. The narrow-screen focus crops unrelated workspace objects to keep the bag/fan readable.
- Exact final bin and paper poses vary with drag speed and contact physics; papers are never forcibly ejected.
- Node prints an existing module-type warning when executing TypeScript helper imports in the checks; Three/Rapier print dependency deprecation notices.
- Temporary review tooling stays under ignored `.tools/`; the recording is not uploaded.

The original C: project directory remains untouched. Run `npm run dev` from `E:\Personal Website` for a local preview.
