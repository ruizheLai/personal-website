# Phase 5I implementation review

## Interaction

The preview at /design-lab/phase5i uses 12 beats across the existing five clips. Crossing a threshold starts one local MP4 at normal speed. The video can finish after scrolling stops. The matching WebP then takes over, the video source is released, and the copy updates. The Capabilities holds build from one entry to all four. The reverse cuts use the same video element and also play at normal speed.

Directional hysteresis absorbs small scroll changes around a boundary. A multi-beat jump, a navigation change, a resize, or a reversal during an active cut settles on the latest relevant keyframe. A visitor who resumes moving by one beat from that hold sees the next cut. The original editorial boundaries between clips remain visible.

The responsive and reduced-motion layout presents all the About text beside or below static character imagery. The cinematic layout uses the document scroll and reuses the persistent, demand-rendered WebGL workspace. The poster and video share one square DOM surface. During the projected handoffs it tracks the actual FrameArtwork corners; in the reading position it is composited directly by the browser.

## Workspace image

The initial pan compensates for changing orthographic zoom. This keeps the frame's projected center between the Home and focused positions. The pull opens the portal with the movement in the source clip. The return waits for the frame border and hands off to the corresponding Chelsea portrait in the workspace. Home navigation restores the original suit portrait.

The workspace scene background and the visible wall and floor use #FFFFFF, matching the page and portal. The frame artwork no longer casts a 3D shadow. The floor and wall still receive the other objects' shadows. The narrow shading drawn into the frame border in the supplied footage remains. A small edge blend and brightness adjustment soften the supplied footage's off-white perimeter.

## Media verification

The cuts were extracted frame by frame with FFmpeg from the user-supplied 940 × 940, 24 fps source videos. The 24 silent H.264 files use 768 × 768 at the original frame rate and have fast-start headers. The 17 WebPs are extracted from the same source frame indices. The entire new media set is 9.13 MB. A visit requests individual cuts on demand. All 48 decoded MP4 endpoints were checked against their corresponding stills. The lowest comparison was 40.47 dB PSNR after encoding.

## Local build

TypeScript and the workspace interaction checks passed. Next.js compiled and generated all 23 static pages, which served the Chromium checks. The local webpack build command returned code 1 after generation and emitted a Next.js security advisory.

## Browser verification

Windows Chromium ran against the local production build. The 1440 × 900 walkthrough exercised all 12 beats forward and all 12 in reverse. It also checked natural playback on scroll stop, capability accumulation, fast jumps, a mid-action reversal, threshold hysteresis, small wheel deltas, both workspace holds, section navigation, portrait activation, viewport resizing, Back and Forward, and the return from FixLens to the same exhibition position. Static fallback was tested at 768 × 900, 390 × 844 and 375 × 812 and with reduced motion at 1440 × 900. Each fallback kept all content accessible with the video source empty.

| Desktop viewport | Minimum clearance below the Top Bar during approach | Reverse clearance |
| --- | ---: | ---: |
| 1920 × 1080 | 113 px | 113 px |
| 1440 × 900 | 97 px | 97 px |
| 1024 × 768 | 81 px | 81 px |

[Forward walkthrough](recordings/forward.mp4) · [Reverse walkthrough](recordings/reverse.mp4) · [Screenshots](screenshots) · [Full beat timeline](ANIMATION_BEATS.md)

## Performance comparison

Both previews received the same scripted 8.2-second native scroll from Home to 4.00 viewport heights, followed by a 2.8-second stop, in 1440 × 900 Chromium. A rapid adjacent crossing can interrupt a beat in this run. The full walkthrough separately verifies every natural action to completion.

| Measurement | Phase 5H | Phase 5I |
| --- | ---: | ---: |
| Video seek writes | 266 | 0 |
| Native segment starts | 0 | 2 |
| Character canvas frames presented | 268 | 0 |
| Character canvas uploads to WebGL | 96 | 0 |
| Main-thread tasks above 50 ms | 0 | 0 |
| Chromium animation-frame cadence, p50 / p95 / p99 | 16.7 / 16.8 / 16.8 ms | 16.7 / 16.8 / 16.8 ms |

Phase 5H's first measured seek rounded to 0 ms in this warmed local comparison. Phase 5I reported 34 and 67 ms from requesting its two segments to their first usable frames. Across all 24 uninterrupted starts in the walkthrough, the median was 50 ms and the range was 33–67 ms. These timings describe different operations. Phase 5H pauses and seeks its decoder, so native playback-stall and dropped-frame counts are incomparable. In the walkthrough without recording, Chromium reported zero post-start waiting events and zero drops across 1,586 decoded frames. Concurrent screenshot capture caused dropped frames during the recordings, so the attached 15 fps walkthrough files demonstrate the beats and composition. The playback measurements use the run without screenshot capture during the actions.

Phase 5I removes the visible dependence of motion on scroll cadence. Each completed action has continuous native playback and a stable reading pose. Average frame cadence in the lab run was the same for the two builds. Confirmation on the machine that exhibited severe Phase 5H stuttering remains open.
