# Phase 5E journey polish

## Scroll timeline

The lab at /design-lab/phase5e shares the Phase 5D journey and workspace. Phase 5E selects a longer timeline and two new screen textures. The approved order, original frame artwork and original desk interactions are preserved.

| Document travel, viewport heights | Visible experience |
| --- | --- |
| 0–0.22 | Full desk and original welcome copy |
| 0.22–0.88 | Frame approach and About reveal |
| 0.88–4.58 | About story |
| 4.58–5.15 | About exit and return to desk |
| 5.21–5.86 | Monitor approach and opening exhibition |
| 5.86–7.44 | FixLens, Sippy, then WillDo |
| 7.44–8.06 | Exhibition exit and return to desk |
| 8.12–8.74 | Phone approaches and opens Contact |

| About beat | Allocated interval | Full opacity interval |
| --- | --- | --- |
| Introduction | 0.88–1.62 | 0.88–1.55 |
| Product Design | 1.62–2.36 | 1.69–2.29 |
| Interaction Design | 2.36–3.10 | 2.43–3.03 |
| Technology & Building | 3.10–3.84 | 3.17–3.77 |
| Beyond the Screen | 3.84–4.58 | 3.91–4.58 |

Each beat gets 0.74 viewport heights. The four crossings are 0.14 viewport heights wide, with smooth, position-based interpolation. The interior beats each hold for 0.60 viewport heights at full opacity. The first and last transitions are the frame entry and exit. The active description stays vertically aligned. All five beats are readable together on mobile and with reduced motion. The original cartoon asset remains the illustrated subject.

## Nested-scroll fault and fix

The Phase 5D viewport pins one presentation to the document, but its absolute destination layer uses overflow: auto. That establishes an independent scroll mechanism. The translated project rows and paint clips control what is drawn while their boxes can still contribute to overflow. Wheel input can then be consumed by a destination layer before document progress advances. Variations in viewport height and focused descendants made the problem intermittent.

Phase 5E uses overflow: clip on the pinned viewport, destination layers, project rows and project bodies. This clips paint without creating a secondary scroll container, including for programmatic scroll and focus. The mobile and reduced-motion layout remains an ordinary part of the document. One passive, frame-coalesced listener samples the document position. Project row measurements are stable and CSS transforms and clips draw the changes. A collapsed strip is an optional shortcut that moves the same document position, then focuses the expanded region.

At 1440 × 900, 1024 × 768 and 940 × 645, the Phase 5D Projects layer accepted an 80 px programmatic scroll across the measured substages. The same Phase 5E layer stayed at zero in every case, even though its clipped child bounds produced the same overflow measurement. Small wheel input over the expanded artwork moved the document in both directions. The browser smoke test also confirmed chair movement, backpack opening and dismissal, the mug's status message, and keyboard grab, tilt and release for the trash bin. [Object and scroll-container checks](screenshots/workspace-checks.json)

## Project links and texture sources

FixLens has one anchor covering its expanded body. The dashboard and phone are figures within that anchor. Hover raises the targeted figure and recedes the other. Keyboard focus gives the full link an outline and emphasizes the visual group. Sippy keeps its existing full-body link. WillDo has a selectable exhibition strip and a static In Development body.

The monitor WebP is a 768 px-wide browser capture of the actual opening Projects DOM at 1440 × 900, cropped to the destination layer. Its FixLens manager and renter screens are FX02 and FX03. The two compact strips use the same names, surfaces and order as the full exhibition. To regenerate, load the Phase 5E preview at that viewport, use the Projects header link, wait for the two images, remove the keyboard focus outline, crop the screenshot to the Projects region and save as WebP. The original dark idle and hover-to-wake behavior uses this lightweight image only when active. During the reveal, the DOM stack is first fitted to the projected monitor bounds. It then expands with the screen clip into the stable exhibition viewport.

## Phone source and asset provenance

The phone texture is a crop of the actual portrait handset drawn in Contact. Its four app marks, system indicators and three dock icons are local SVGs from Bootstrap Icons v1.13.1. The asset directory includes the upstream MIT license. The original handset layout uses a dark blue wallpaper, status indicators, app labels, and a distinct dock. The phone concept is illustrative. The separate GitHub link is the sole active contact method. [Pinned icon source and license](https://github.com/twbs/icons/tree/v1.13.1) · [WeChat glyph](https://icons.getbootstrap.com/icons/wechat/) · [GitHub glyph](https://icons.getbootstrap.com/icons/github/)

The raster is cropped to the visible handset at 1440 × 900. Wait for the Contact header jump and icon loads, remove the destination focus outline, crop to the handset bounds and export WebP. The workspace shares this image via its existing texture layer. Contact uses the same handset, wallpaper and icons in readable DOM. The handset tracks the projected screen during the handoff and settles alongside the copy, which fades in after the screen starts to expand. The two texture files total 23.1 KiB.

## Validation and review media

TypeScript, the production build on retry using Webpack, and the existing workspace interaction checks passed. The Chromium journey suite covered 1440 × 900, 1024 × 768, 768 × 900, 390 × 844, and 375 × 812, plus reduced motion. It checked both ends of each About reading hold in both directions, project fitting, attempted inner scroll, real small-delta and rapid wheel input, hover on both FixLens figures, a click near the FixLens panel edge, the Sippy link, Back from both case studies, strip focus, direct refresh, touch, and prior public and lab routes. [Browser results](screenshots/browser-results.json)

- [Slow and rapid forward/reverse walkthrough](screenshots/forward-reverse.mp4)
- [Idle desk](screenshots/1440-desk.png), [awake monitor](screenshots/1440-monitor-awake.png), [monitor handoff](screenshots/1440-monitor-handoff.png), [awake phone](screenshots/1440-phone-awake.png), [phone handoff](screenshots/1440-phone-handoff.png)
- [About introduction](screenshots/1440-about-intro.png), [Product](screenshots/1440-about-design.png), [Interaction](screenshots/1440-about-interaction.png), [Building](screenshots/1440-about-building.png), [Interests](screenshots/1440-about-interests.png)
- [FixLens](screenshots/1440-fixlens.png), [expanding stack](screenshots/1440-stack-transition.png), [Sippy](screenshots/1440-sippy.png), [WillDo](screenshots/1440-willdo.png), [Contact](screenshots/1440-contact.png)
- [1024 px exhibition](screenshots/1024-fixlens.png), [768 px fallback](screenshots/768-projects.png), [390 px phone design](screenshots/390-contact.png), [375 px exhibition](screenshots/375-projects.png)

The local build continues to report the existing Next.js dependency advisory. The handset was composed from the supplied written brief. Its two captured views retain the approximation of rectangular projected bounds during the short 3D-to-DOM handoff. Browser and performance results cover Chromium with emulated sizes and trackpad-style wheel deltas. Physical touch hardware and GPU paint timing remain outside the measurements.

## Matched wheel profile

| Metric at 1440 × 900 | Phase 5D | Phase 5E |
| --- | ---: | ---: |
| One-way scroll travel | 6,102 px | 7,866 px |
| Median moving-frame interval | 16.7 ms | 16.7 ms |
| 95th-percentile moving-frame interval | 16.8 ms | 16.8 ms |
| Sampled moving frames above 25 ms | 0 of 132 | 0 of 170 |
| Style recalculations per 1,000 px of round-trip travel | 15.3 | 12.1 |
| Layouts per 1,000 px of round-trip travel | 6.9 | 6.2 |
| Total script time over the round trip | 287 ms | 411 ms |

The same Chromium wheel steps reached the bottom and returned to the top in both builds. The longer journey reduced style and layout counts per distance and maintained the sampled frame cadence. Total script time increased. These results describe the profiled machine and leave physical trackpad and GPU timing open. [Phase 5D raw profile](performance-phase5d.json) · [Phase 5E raw profile](performance-phase5e.json)
