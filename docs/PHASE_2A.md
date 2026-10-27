# Phase 2A — Workspace navigation and transitions

## What changed

The Phase 1 layout and source Blender/GLB assets are preserved. The default workspace
still uses the exported orthographic camera orientation and small centered framing.
There are no new dependencies, furniture, physics or secondary-object interactions.

- The supplied portrait is copied unchanged to `public/images/about-avatar.png`.
- `FrameArtwork` is a planar 0.526 × 0.455 m surface. Only its `ArtworkGraphic`
  child is hidden on a cloned web scene. The physical four-piece border remains.
- `MonitorScreen` is 0.837 × 0.474 m; `PhoneScreen` is 0.096 × 0.208 m.
  Both use their actual local XY geometry and world transforms, including phone tilt.
- `SurfaceArtwork` reuses cloned surface geometry, generates local XY UVs, and
  applies centered cover cropping. It preserves image aspect ratio, uses sRGB
  textures and untone-mapped display materials, and offsets the image 0.5 mm toward
  the viewer to avoid z-fighting. Owned image clones/materials/geometry are disposed.
  All texture sources are loaded together through one Suspense boundary.
- Monitor and phone base screen materials are near-black PBR glass. The bodies,
  stands and bezels retain their original materials. Hover/focus fades a separate
  image layer in with damped ~300 ms wake-up. The portrait instead changes its UV
  crop by 3%; its geometry and frame stay stationary.
- `public/images/phone-home.svg` is a directly editable monochrome UI with Email,
  LinkedIn and GitHub icons. These are visual previews with no fabricated links.

## Shared interaction architecture

`WorkspaceScene` owns idle/hovered/focusing/focused/transitioning state. One
selection exists at a time. The first click/tap/Enter/Space focuses; the second
enters. Conflicting object clicks during motion are ignored. Escape and Back can
interrupt focus movement; appropriate empty/static scene clicks exit completed
focus. Header links navigate directly and cancel an in-progress page transition.

`CameraController` derives each focus composition from actual surface bounds.
It translates along camera right/up vectors and computes zoom from the projected
surface width/height and responsive viewport fractions. Quaternion and viewing
depth remain fixed. Focus takes 760 ms; return takes 680 ms, restoring home position
and 1.0 zoom. Idle wheel limits remain 0.9–1.7. There are no orbit or pan controls.

The three projected HTML buttons preserve keyboard focus during animation, have
visible focus outlines and updated Focus/Enter names, and use the same activation
handler as raycasting. Pointer propagation stops at the nearest hit. Back is
visible only during object focus. Touch users do not need hover or wheel input. Coarse-pointer devices also get
transparent 44 px HTML activation targets centered on the actual objects.

`PageTransitionProvider` lives in the persistent root layout. On entry, a matching
image overlay starts at the surface's measured viewport bounds and expands over
720 ms using the Web Animations API. Navigation starts only when that animation's
`finished` promise resolves. The overlay survives the route change and fades away
only after `usePathname` observes the committed destination. The real page then
receives keyboard focus. Cancellation, animation cleanup and route interruptions
do not depend on guessed route-loading delays.

Reduced-motion preference removes camera interpolation, disables chair tracking
and shortens overlay expansion/reveal to 80/50 ms. CSS also disables the loading
fade. This branch was code-reviewed; the current browser tool cannot force the
OS/browser motion preference.

## Loading and chair corrections

The gray loading rectangle came from `HeroFallback` displaying the original
Blender preview render before the GLB loaded. Loading now renders only an invisible
accessible status; the header and clean page background appear immediately.
The complete scene remains opacity 0 until model, images and initial camera have
rendered, then fades in over 420 ms. Error/WebGL-unavailable fallback remains
separate and still exposes real errors and navigation. Retry clears both failed
model and texture cache entries.

The chair's local forward direction is -Z in glTF: its seat is toward Blender +Y,
while its rear shell is toward Blender -Y. From the exported camera, negative
local Y rotation turns that forward vector toward screen-right. The pointer sign
is therefore reversed using configurable `chair.direction = -1`. The ±18° limit,
central column pivot, damping and stationary position are retained.

## Preview regeneration

`projects-preview.png` is a screenshot of the actual existing `/projects` page,
captured at approximately 1440 × 815 (the monitor's 1.766:1 ratio). To refresh it:

1. Run `npm run dev` and open `http://127.0.0.1:3000/projects`.
2. Set the browser viewport to 1440 × 815, scroll to the top and remove keyboard focus.
3. Capture the viewport PNG to `public/images/projects-preview.png`.
4. Reload Home to inspect the image on the actual screen.

No embedded browser or unrelated mock interface is used. The actual page's current
header, placeholder project grid and content are visible. The transition blends
this static desktop snapshot into the responsive real page; mobile layouts are
revealed by the coordinated crossfade rather than an exact pixel match.

## Future avatar variants

Change `ARTWORK.default` in `lib/workspace-config.ts` to select another source.
The reusable `SurfaceArtwork` component accepts a loaded texture and handles
aspect-ratio crop, orientation and hover emphasis independently of frame geometry.
A future expression/pose variant can be switched here without editing Blender.
No avatar facial or tie animation is implemented in this phase.

## Validation performed

- TypeScript type generation and `tsc --noEmit`: passed.
- Production build: passed; all existing routes are statically generated.
- Source model audit and byte-for-byte public copy: passed; SHA-256 remains
  `9a7275e0c53bb3e79c9132f6eea6f58ee1360997fd3278aac9e60265c9ca8b72`.
- Desktop visual review at 1440 × 900: default, monitor/phone/frame hover,
  all three focused views, chair left/right/reset, and in-progress expansion.
- First click remained on Home; second click entered each correct real route.
- Avatar orientation, centered aspect-preserving crop, physical frame and absence
  of old graphic shapes were visually verified at close range.
- Phone focused view showed all three named icons without distortion.
- Escape restored original framing; mobile Back and empty-space exit were checked.
- Keyboard Enter focused the portrait, retained button focus, and entered About
  with the second Enter. Space activation was also checked.
- Conflicting monitor/frame clicks during focusing kept the monitor selection.
- Header Contact interrupted an expanding Projects overlay and opened Contact.
- Header Home interrupted expansion on the same route and restored a usable default scene.
- Mobile viewport 390 × 844: default framing, no horizontal overflow, monitor
  focus/Back and phone two-stage entry passed. Header routes stayed usable.
- An isolated localhost proxy delayed the GLB 4 seconds: loading screenshot
  contained only the header and light background; zero fallback images were
  rendered, canvas opacity was 0, and its configured transition was 0.42 s.
- The same proxy intentionally returned GLB 404: real error fallback/Retry appeared.
  Restoring the response and using Retry recovered the scene. Proxy was stopped.
- Normal final browsing produced no runtime errors. The intentionally failed
  model generated expected errors in its separate QA tab.

Screenshots are in `docs/previews/phase-2a/`. Physical touch hardware, forced
WebGL-unavailable and reduced-motion emulation were not available. The upstream
Three.js/R3F development `THREE.Clock` deprecation warning remains. Destination
page layouts and their factual-content placeholders are unchanged. The final
overlay uses the axis-aligned projected surface bounds; this fixed orthographic
composition does not require arbitrary perspective/corner-warp transitions.
