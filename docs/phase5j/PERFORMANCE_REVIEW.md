# Phase 5J performance review

Phase 5J restores the Phase 5H scroll map for About. Moving the document selects the source frame, changing direction reverses it, and stopping leaves the selected frame on screen. The four Capabilities holds keep their original range and accumulated copy. Both engines use the same camera, portal and text cues. The Phase 5I white environment, safe frame approach and selective shadow fix carry forward.

## What Phase 5H was doing

Phase 5H issues a paused MP4 seek when its target changes, then draws the decoded frame on `seeked`. During the workspace handoff that canvas also becomes a Three.js texture. The baseline moved through 671 seek writes, 671 canvas draws and 127 live texture uploads in the cold test. Its seek callback reported a p95 of 11 ms, yet the displayed pose was four source frames behind or ahead at p95. The baseline also eases its presented progress in the two camera windows. That easing contributes to its mismatch against raw scroll, so the gap cannot be attributed to decoding alone.

The new engines keep the character in the DOM during the entire cinematic sequence, including the projected workspace rectangle. The static workspace portrait is hidden underneath that rectangle during the handoff and returns at the desk. This removes live WebGL character uploads. The MP4 engine uses one paused decoder with one request in flight and checks the submitted media time. The sequence engine can present a cached image directly.

## Matched scroll traces

Chromium on Windows used the same 19.6-second native document scroll at 1440 × 900. The path included gradual forward and reverse movement, distinct clip changes, faster multi-clip jumps, rapid direction changes, stops and both frame handoffs. It compared the intended source frame from raw scroll with the actual DOM-presented frame at each animation-frame sample. A target counted as delivered if an exact frame was sampled within 50 ms of its first observed target and before the target changed. These continuous-trace results were collected without screenshot capture.

| Engine and cache | Exact targets within the deadline | p95 source frame error | Video seeks | 2D canvas draws | Live character texture uploads |
| --- | ---: | ---: | ---: | ---: | ---: |
| Phase 5H cold | 499 / 672 (74.3%) | 4 | 671 | 671 | 127 |
| Phase 5H warm | 504 / 676 (74.6%) | 4 | 674 | 678 | 147 |
| Phase 5J sequence cold | 672 / 676 (99.4%) | 0 | 0 | 0 | 0 |
| Phase 5J sequence warm | 673 / 676 (99.6%) | 0 | 0 | 0 | 0 |
| Phase 5J MP4 GOP 6 cold | 673 / 677 (99.4%) | 0 | 672 | 673 | 0 |
| Phase 5J MP4 GOP 2 cold | 672 / 676 (99.4%) | 0 | 672 | 673 | 0 |
| Phase 5J MP4 GOP 2 warm | 668 / 669 (99.9%) | 0 | 668 | 669 | 0 |
| Phase 5J MP4 GOP 1 cold | 668 / 672 (99.4%) | 0 | 668 | 669 | 0 |

No run used video playback or reported a main-thread long task over 50 ms. Camera-window requestAnimationFrame p95 was 16.8 ms across the three engines. The longest uninterrupted run sampled more than one frame off target was 1.27 s for the cold baseline and about one display interval for either Phase 5J engine. Deliberate rapid movement can skip source frames. The Phase 5J misses clustered around faster jumps and clip changes, and the engines recovered on the latest target without playing missed animation.

For the sequence, frame preparation at p95 was 3.9 ms cold and 0.7 ms warm, with 91–92% of target requests hitting the decoded-image cache. For the MP4 derivatives, p95 measured dispatch to decoded-frame confirmation at 16.6 ms for all tested GOPs. The baseline measured dispatch to `seeked`, which is a different point in the pipeline. At the end of the cold trace Chromium reported roughly 23 MB of total page JS heap for Phase 5H and 35 MB for each Phase 5J mode. The JS-heap sample excludes the decoded image and video buffers, GPU allocations and the network cache.

## Exact pose arrival and transfer

A second run made 24 discrete jumps, reaching matching frames before advancing, from Home through the entrance, every chapter and back. The elapsed time runs from the native scroll write to the first exact frame observed in an animation-frame callback. Transfer is the character media reported by browser Resource Timing for that run. All 24 targets landed in each run.

| Engine and cache | Median | p95 | Slowest | Character bytes transferred | Media entries |
| --- | ---: | ---: | ---: | ---: | ---: |
| Phase 5H cold | 27.7 ms | 52.8 ms | 122.7 ms | 16.26 MB | 13 |
| Phase 5H warm | 24.0 ms | 34.5 ms | 36.4 ms | 16.10 MB | 13 |
| Phase 5J MP4 GOP 6 cold | 23.9 ms | 34.8 ms | 39.7 ms | 1.44 MB | 56 |
| Phase 5J MP4 GOP 6 warm | 27.7 ms | 33.1 ms | 40.4 ms | 1.22 MB | 62 |
| Phase 5J sequence cold | 23.6 ms | 33.0 ms | 33.0 ms | 5.34 MB | 225 |
| Phase 5J sequence warm | 24.1 ms | 32.8 ms | 32.9 ms | 0.14 MB | 227 |

The baseline and video loaded different ranges and sizes. The sequence loaded individual files with multiple small prefetch requests. These measurements describe this path and local server cache behaviour. Actual CDN, browser and connection behaviour can change both figures.

## Recommendation and validation

Use the image sequence by default. It held a lower frame-preparation latency and had the smallest pose error under warm-cache reversal. The paused GOP 6 mode is a viable option for high-latency or bandwidth-limited sessions. It had comparable scroll accuracy, substantially lower cold transfer on the discrete path, and used a smaller aggregate encode than GOP 1 or 2. The preview includes both choices for direct comparison. Playback on the user's original device and remote cold-cache latency remain unverified.

All three implementations were exercised at 1920 × 1080, 1440 × 900, 1024 × 768, 768 × 900, 390 × 844 and 375 × 812, plus reduced motion at 1440 × 900. Phase 5J kept the complete frame below the top bar in both directions on the three desktop sizes. Its four Capabilities holds kept the exact frame and copy after scrolling stopped. Both Phase 5J engines passed keyboard entry and focus checks, kept inactive destinations inert, preserved the engine query on Home navigation and kept mobile About content accessible without motion or nested scroll.

TypeScript and workspace interaction checks passed. The local webpack build compiled and generated 24 pages used for Chromium testing. It returned code 1 after reporting a Next.js security advisory.

[Forward walkthrough](recordings/forward.mp4) · [Reverse walkthrough](recordings/reverse.mp4) · [Matched comparison](recordings/comparison.mp4) · [Screenshots](screenshots) · [Rendering details](RENDERING_COMPARISON.md)
