# Phase 5L implementation review

The cinematic journey is available at /design-lab/phase5l. It reuses the portrait, workspace, Capabilities, project exhibition, Contact and adaptive navigation from the existing portfolio. The controller covers all ten video actions and the three camera-only transitions in both directions. The [timeline and state diagram](CINEMATIC_TIMELINE.md) list every endpoint and cue.

## Interaction

Native document scroll chooses the first crossed boundary, even when the input delta spans several stages. The controller reserves the existing scrollbar gutter, pins the document at the departure anchor and prevents wheel, touch and scroll-key defaults during the action. It also corrects programmatic scroll or scrollbar movement back to that anchor. The sticky workspace stays in the same layout and renders through one persistent WebGL canvas.

The first decoded media frame starts the camera and the copy timing together. While a native-playing cut is waiting on data, the camera follows its last decoded media position. A camera-only action follows a single requestAnimationFrame timeline. Projects and Contact become interactive at the completed camera pose. Each endpoint still stays indefinitely while the visitor reads or interacts. Subsequent scroll uses a short hysteresis band and a fresh input gesture. The inertial re-arm waits for a 160 ms break between wheel events. A fresh pointer or touch start, or a nonrepeating scroll key, re-arms immediately.

The **Skip transition** button and Escape settle at the selected endpoint. Top Bar navigation and browser history cancel the action, release input, then restore the intended destination. Resizing within desktop retains the normalized anchor. Crossing into a static layout releases the lock and exposes all About copy. Native keyboard navigation and static content work below 900 px, below 640 px in height, and with reduced motion.

While preparing or buffering, the last stable pose remains visible. One neighbouring cut may be prefetched as a bounded Blob. The controller attaches one video at a time and releases its source on hold. The keyboard, touch and wheel handlers, media callbacks, pending prefetch and timers are cleaned up at unmount. Startup timeout, stalls and playback failures settle to the target still. A separate deadline also clears the lock if the render loop fails to consume recovery.

## Measured comparison with Phase 5K

The test used the same opening Clip 1 at 1440 × 900 in Windows Chromium with the local cache cleared between routes. Phase 5K traversed the entrance source frames over 5.1 seconds of scripted native scroll. Phase 5L crossed the entrance trigger once and played the native cut. Instrumentation was collected without continuous screen capture.

| Opening action | Phase 5K | Phase 5L |
| --- | ---: | ---: |
| Video seek writes | 120 | 0 |
| Native plays | 0 | 1 |
| Character draws to a 2D canvas | 120 | 0 |
| Character canvas uploads to WebGL | 0 | 0 |
| WebGL draw calls in the sample | 29,839 | 34,454 |
| Browser frame cadence, p95 | 16.8 ms | 16.8 ms |
| Main-thread tasks above 50 ms | 0 | 0 |
| Media requests including preparation | 7 | 2 |
| Media transfer including preparation | 1.03 MB | 1.32 MB |
| End-of-sample whole-page JS heap | 47.6 MB | 27.3 MB |
| Time from trigger to first decoded playback frame | — | 48 ms |
| Playback frames, dropped frames, waiting events | — | 121, 0, 0 |
| Time with document locked | — | 5.13 s |

Paused seeks and native playback expose different counters. Frame cadence is the browser animation callback interval rather than a GPU presentation measurement. The camera follows different curves over the entrance, so its draw-call count describes scene workload on this comparison path. JS heap excludes browser-managed image and decoder memory and GPU allocations. The media bytes include preparation of the following cut. Phase 5L trades more WebGL draws on this scene and a slightly larger cold transfer for continuous playback with no per-frame seek or canvas draw.

## Browser and visual verification

The entrance and all four Capabilities holds passed the initial test before the full walkthrough was evaluated. The full run covered all 13 actions in both directions, including the monitor opening and closing, the phone opening and returning to the desk, and repeated return to Home. Proof captures show the white workspace, frame approach, Capabilities and the return portrait. The four original Capabilities keyframes and copy accumulation remain intact. The workspace canvas remains mounted outside the portal layers.

The 26-action run without screen recording reported 1,582 decoded frames, zero dropped frames and zero post-start waiting events. Media startup across the 20 cuts was 16–32 ms, with a median of 17 ms. The Capabilities locks measured 1.85–2.55 s, the full entrance and recovery each measured about 5.1 s, and camera-only transitions measured 0.92–1.07 s.

Checks covered 1920 × 1080, 1440 × 900, 1024 × 768, 768 × 900, 390 × 844 and 375 × 812, and reduced motion. Forward and reverse desktop clearance was checked against the Top Bar. The stress check suppressed rapid wheel input, a continuous inertial tail, a touch swipe, scroll keys and an attempted programmatic jump. Resize, direct navigation, Projects browsing and Back preserved usable navigation. A delayed request held the camera in its departure pose. A blocked video recovered to the exact intended poster, unlocked, and left About accessible. FFmpeg checked all eight endpoints of the four new media files against the original stills, with a minimum 41.3 dB PSNR.

TypeScript and the existing workspace interaction checks passed. The local production build compiled and generated all 26 routes.

[Forward walkthrough](recordings/forward.mp4) · [Reverse walkthrough](recordings/reverse.mp4) · [Screenshot evidence](screenshots)

## Recommendation

Keep Phase 5L as a preview for now. It prevents scroll and playback from getting ahead of each other, and the controlled entrance test removed scrubbing work. The trade-off is an intentional lock of about five seconds for the entrance and the full fall and recovery. The lab and recordings do not establish how that feels on the device that showed the original stutter. The comparison with Phase 5K should include whether the native playback benefit is worth that wait.
