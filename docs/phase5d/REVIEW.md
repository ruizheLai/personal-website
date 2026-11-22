# Phase 5D implementation review

## Journey and interaction

The production routes and the Phase 5C review route retain their existing entry points. The Phase 5D route reuses the same GLB, canvas, destination media and prior case studies. The home scene shows the original v3 cartoon in the frame. The monitor and phone wake independently on hover, keyboard focus or camera approach. The monitor preview includes all three projects. The phone concept gives GitHub a distinct treatment and presents other services as decoration.

| Native scroll travel in viewport heights | Destination |
| --- | --- |
| 0–0.22 | Full desk and object interactions |
| 0.22–0.88 | Picture frame approach and handoff to About |
| 0.88–2.62 | Five About story beats in order |
| 2.62–3.19 | Frame exit and return to desk |
| 3.25–3.90 | Monitor approach and handoff to Projects |
| 3.90–5.48 | FixLens, Sippy, then WillDo, with the same three project strips on screen |
| 5.48–6.10 | Monitor exit and return to desk |
| 6.16–6.78 | Phone approach and Contact |

The same native scroll offsets run in reverse. A desk object activation animates directly to its destination for 720 ms. User scrolling cancels the direct approach and restores the position-based timeline. Explicit navigation adds a fragment entry and moves focus into the destination. The header jumps directly, and a refreshed fragment opens its destination. On smaller or short viewports and with reduced motion, the same document is laid out in readable sequential sections. The case-study visuals remain full-size links.

## Avatar motion and asset requirements

The repository contains three portrait variants. The v3 artwork is the existing cartoon used by the GLB frame. The other variants depict a more realistic person. This prototype uses a resized WebP conversion of v3, with reversible whole-image position, rotation and scale. The intro holds the framed image. The middle beats bring it slightly forward and change the emphasis as each text block enters. The last beat eases it back into the frame. Illustrating new hand poses would require a matched asset set.

| Beat | Desired future pose |
| --- | --- |
| Intro | Open hand reaching slightly toward the viewer |
| Product design | Pointing toward the headline or presenting a sketch |
| Interaction design | A small tap or swipe gesture |
| Building | Holding a small neutral prototype |
| Exit | Relaxed posture and a brief wave |

An export set needs consistent face, glasses, outfit, camera angle and lighting, with the same crop and anchor point for each pose. Transparent WebP frames or separable illustrated layers would allow scroll sampling in either direction and a single still for reduced-motion users. The route uses static artwork and scroll-driven transforms.

## Performance approach

I profiled Phase 5C in a real Chromium session with repeated wheel input in both directions before changing the implementation. The rewrite separates resize-time measurements from scroll-time samples. The camera only requests a new demand frame when its pose changes. During a camera visit, only the portal surface projects into screen coordinates and only during its handoff. Secondary object projection and physics debug writes are paused while the controls are offstage. Physics bodies and the canvas remain mounted. The three exhibition rooms retain fixed artwork bounds, and the strip positions and overflow masks change through transforms and insets. Once a destination settles, its portal geometry stays untouched until the return.

### Chromium wheel profile

| Metric | Phase 5C | Phase 5D |
| --- | ---: | ---: |
| One-way scroll distance | 4,968 px | 6,102 px |
| Median frame interval | 16.7 ms | 16.7 ms |
| 95th-percentile frame interval | 16.8 ms | 16.8 ms |
| Frames over 25 ms in moving samples | 0 / 108 | 0 / 132 |
| Style recalculations per 1,000 px of round-trip scroll | 30.6 | 15.3 |
| Layouts per 1,000 px of round-trip scroll | 7.4 | 6.9 |
| Total script time for the round trip | 180 ms | 461 ms |

The single 1440 × 900 Chromium run used the same wheel steps for both versions. Style recalculations fell by about 50% per distance. Script time rose, with more travel, five story beats and an animated three-row exhibition. The baseline already sampled at roughly 60 Hz, so this run establishes less style work, with the same sampled frame cadence. The prior implementation's repeated geometry reads, full-canvas invalidation and hidden-object projection were plausible sources of extra work. GPU paint timing, hardware-specific stutter, and real phone performance remain unmeasured. [Baseline data](performance-baseline.json) · [Refined data](performance-refined.json)

## Validation and review media

TypeScript, the production build on retry using Webpack and the workspace interaction checks passed. Chromium ran at 1440, 1024, 768, 390 and 375 px. It verified the canvas identity, forward and reverse destination sequence, all five About beats, object entry, desktop keyboard focus, Back from FixLens and Sippy, direct fragment changes, refresh, mobile touch, reduced motion, and public route isolation. The pre-existing Next.js advisory remains. [Browser results](screenshots/browser-results.json)

- [Forward and reverse browser recording](screenshots/forward-reverse.mp4)
- [Idle desk](screenshots/1440-desk.png), [monitor awake](screenshots/1440-monitor-awake.png), [phone awake](screenshots/1440-phone-awake.png)
- [About intro](screenshots/1440-about-intro.png), [Product Design](screenshots/1440-about-product.png), [Interaction Design](screenshots/1440-about-interaction.png), [Building](screenshots/1440-about-building.png), [Beyond the Screen](screenshots/1440-about-interests.png), [frame exit](screenshots/1440-about-exit.png)
- [FixLens](screenshots/1440-projects-fixlens.png), [stack transition](screenshots/1440-projects-transition.png), [Sippy](screenshots/1440-projects-sippy.png), [WillDo](screenshots/1440-projects-willdo.png), [Contact](screenshots/1440-contact.png)
- [Mobile desk](screenshots/390-desk.png), [Mobile About](screenshots/390-about.png), [Mobile Projects](screenshots/390-projects.png), [Mobile Contact](screenshots/390-contact.png)
