# Phase 5H integration review

Phase 5H adds the animated About journey at /design-lab/phase5h. The Phase 5G route remains available. Projects, Contact, and the original GLB model remain the sources for the rest of the journey.

## Media audit and derivatives

The source folder contains 1.mp4 through 5.mp4. I visually sampled all five clips at quarter-second intervals and decoded their initial and final pictures. Each source has one initial I-frame, dimensions 940 × 940 and a 24 FPS frame rate. Clips 1–3 run 5.042 seconds each. Clips 4–5 run 9.042 seconds each. The source folder was read directly and the derivative files are in public/images/phase5h.

The derivatives retain the resolution and rate, remove audio, use H.264 with six-frame GOPs and fast-start metadata, and total 11.39 MB compared with 19.98 MB for the originals. Nearby clips and static fallback frames come from the supplied footage. The small white-point adjustment is limited to the unframed stage and responsive stills. [Full cue sheet](ANIMATION_TIMELINE.md)

## Scrubbing and loading

Native document scroll determines the camera pose, portal extent and target frame. The video player maps target seconds to the nearest 24 FPS frame and clamps the seek to duration metadata. Two paused, muted, inline video slots serve the current clip and a directional neighbour. The player coalesces newer targets while a seek is in flight. The 2D canvas is updated after the requested frame decodes. The stage retains the last valid pixels while the next clip loads. An unresolved request falls back to a local still, and the requested copy can appear after 450 ms of media delay so it remains readable.

Text is normally driven by the frame that was copied. The four capability holds use the same monotonic cue map in both directions. They freeze at 1.75, 3.75, 6.10 and 8.55 seconds. Prior capabilities remain visible as later ones accumulate. Responsive and reduced-motion About uses four sequential sections with the corresponding source stills. Those modes fetch no MP4s.

## Frame and scene continuity

The Phase 5H scene clone hides the original frame backing and the four trim meshes, retaining the original artwork surface and interaction anchor. The idle texture is the first picture of Clip 1, with its own white trim. The projected About canvas shares the decoded raster with the physical desk surface when the latter is visible. The mesh uses one reusable texture, with uploads limited to new decoded frames during the frame approach or retreat. The GLB file and all other scene objects retain their existing code paths.

Clip 1's pull, beginning around 2.75 seconds, drives the transition from projected rectangle into the fixed left-hand character area. The opaque clip expands with that projected position, so the frame and stage share one visual instead of crossfading two copies. The copy sits to the right of the art. Clip 5's baked trim returns during the closing passage and the jersey portrait stays on the desk until the visitor scrolls back into the earlier narrative. Explicit Home navigation restores the initial suit portrait.

At the file cuts the source poses are close but the separately generated clips contain minor pose, crop and lighting differences. The existing decoded frame is kept until the next one is ready. The cut preserves the original motion without adding transition footage. A projected rectangular bound still approximates the edges of the tilted physical frame. [Entrance](screenshots/1440-pull-handoff.png) · [Exit](screenshots/1440-exit.png) · [Completed desk](screenshots/1440-completed-frame.png)

## Review media

- [Forward and reverse walkthrough](screenshots/forward-reverse.mp4)
- [Initial desk](screenshots/1440-home.png), [animated frame](screenshots/1440-frame-awake.png), [pull-in](screenshots/1440-pull-handoff.png), [arrival](screenshots/1440-arrival.png), [introduction](screenshots/1440-introduction.png)
- [Design](screenshots/1440-design.png), [Technology](screenshots/1440-it.png)
- [Capability 01](screenshots/1440-capability-1.png), [Capability 02](screenshots/1440-capability-2.png), [Capability 03](screenshots/1440-capability-3.png), [All four](screenshots/1440-capability-4.png)
- [Beyond Work](screenshots/1440-interests.png), [framed return](screenshots/1440-exit.png), [original portrait restored](screenshots/1440-return-home.png)
- [1024 px](screenshots/1024-about.png), [768 px fallback](screenshots/768-about-fallback.png), [390 px fallback](screenshots/390-about-fallback.png), [375 px fallback](screenshots/375-about-fallback.png), [reduced motion](screenshots/1280-about-fallback.png)

## Validation and performance

Chromium passed at 1440 × 900, 1024 × 768, 768 × 900, 390 × 844 and 375 × 812, plus 1280 × 800 in reduced motion. The suite verified initial no-video loading, the five clip cues, all four text accumulation stages, exact sampled-pixel equality when revisiting a held pose, static frames with ceased input, rapid reversals, Back and direct navigation, one persistent WebGL canvas, and no nested Projects scroll. Blocking the Clip 2 request still let its introduction copy appear. The desk test exercised the chair, backpack, mug and bin in the shifted holds, then opened Contact and returned to the same position with Back. TypeScript, the production build on retry using Webpack, and existing workspace scripts passed. [Browser samples](screenshots/browser-results.json) · [Desk interaction test](screenshots/workspace-checks.json)

Sixteen target changes that drew a newly requested canvas frame had a median scroll-request-to-canvas time of 9.6 ms. The first cold draw took 117 ms. The other measured changes took up to 35 ms. Sixteen non-zero decoder samples in those checkpoints took a median of 2 ms from seek dispatch to copied frame, with a maximum of 4 ms. These are loopback Chromium measurements of canvas writes, and exclude physical display presentation delay. The results supported the short-GOP paused MP4 implementation for this prototype.

| Matched wheel test, 1440 × 900 | Phase 5G | Phase 5H |
| --- | ---: | ---: |
| Maximum one-way travel | 10,152 px | 16,956 px |
| Median moving-frame interval | 16.7 ms | 16.7 ms |
| 95th-percentile moving-frame interval | 16.8 ms | 16.8 ms |
| Samples above 25 ms | 5 of 220 | 7 of 366 |
| Samples above 50 ms | 0 | 0 |
| Script time for the round trip | 503 ms | 970 ms |

The longer Phase 5H test had more total work and similar sampled frame cadence on this machine. [Phase 5G raw profile](performance-phase5g.json) · [Phase 5H raw profile](performance-phase5h.json)

## Known limitations

Safari and WebKit remain untested. Network cold-start times will vary, and mobile sizes were emulated in Chromium. A fast path may omit intervening animation poses to catch up to the scroll position. The normal-flow and reduced-motion modes expose all four text sections with static artwork. Separately generated clip boundaries retain their original differences. The local build reports an existing Next.js dependency advisory.
