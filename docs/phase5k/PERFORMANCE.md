# Phase 5K paused-video performance

Phase 5K uses the Phase 5J paused H.264 renderer for About with a revised seek scheduler. The same piecewise scroll map drives the camera, portal, character source time and copy. Source timing stays at 24 fps. The video elements are always paused. Each newly drawn frame matches the latest requested frame. During an unresolved seek the canvas keeps the last valid image.

## Decoder and seek policy

- A single 640 × 640 canvas remains the visible surface. No character video frame is uploaded to the workspace canvas.
- A decoder retains one request in flight. Scroll updates replace its desired target. If a request is at least 42 ms old and eight source frames away from the new target, the scheduler cancels its callbacks and seeks to the latest frame. The scheduler also skips a seek when the canvas already shows the target.
- The browser's decoded-frame callback verifies the actual media timestamp where available. The guarded fallback accepts the matching paused position after seek completion. Releasing a source aborts its registered callbacks. A late completion from the neighbouring decoder cannot draw.
- The two-decoder candidate prepares one adjacent clip within 24 source frames of a boundary in the current direction. Forward preparation loads the first frame. Reverse preparation seeks to the last. Around a boundary the outgoing decoder can stay available for a quick reversal. The outgoing clip can stay attached while adjacent, then is released or reused to prepare the next boundary. Both sources are released when leaving About.
- Direct jumps use metadata-first loading. The predicted neighbour may buffer eagerly. Waiting for initial frame data before an active seek avoids competing with the source's initial request. Only a reverse neighbour initiates its tail seek at metadata readiness.

The browser can still hold the last accepted frame briefly after a large jump when the newly requested compressed frame has not arrived. No scroll easing was added, and the five existing clips, reading intervals, project routes and adaptive workspace navigation are shared with Phase 5J.

## Reproducing the preview choices

| Address | Setting |
| --- | --- |
| `/design-lab/phase5k` | Default paused-video configuration |
| `/design-lab/phase5k?slots=1&gop=6` | Single decoder for comparison |
| `/design-lab/phase5k?slots=2&gop=6` | Two decoders with GOP 6 |
| `/design-lab/phase5k?slots=2&gop=2` or `?slots=2&gop=1` | Alternate keyframe intervals |
| `/design-lab/phase5k?perf=1` | Exposes target, shown frame, seeks and prepared boundary handoffs |
| `/design-lab/phase5j?engine=video` | Phase 5J paused-video baseline |

The three GOP sets reuse the same originals and encodes from Phase 5J. Across all five clips the encoded totals are 7.98 MB for GOP 6, 13.29 MB for GOP 2, and 12.70 MB for GOP 1. Actual transfer depends on the ranges requested and cache reuse.

## Test method

Windows Chromium ran the same 11.4-second native document scroll at 1440 × 900 for each configuration. A simulated 60 ms network delay and 4 MiB/s downlink made media boundaries observable across loopback. Each cold run cleared the browser cache, followed by a warm run on that mode. The trace crossed each adjacent boundary in both directions, paused at reading poses, and included rapid changes across several clips. Presentation measurements were taken without screen capture. A separate input test used native wheel events with mixed deltas and direction changes.

Boundary latency is the elapsed time from the first sampled target in an adjacent clip to the first accepted frame in that clip. A zero means both were observed in the same browser sample. The exact-target rate counts frames that were visible within 50 ms before the target moved. The internal seek metric is timed from dispatch to a verified compositor callback or guarded fallback. For Phase 5J the analogous metric is the duration attached to its published frame, and can include a stale result. Browser Resource Timing measured transfer. End-of-trace JS heap is a whole-page snapshot and excludes codec buffers and GPU allocations. Peak attached media sources provide the reliable bound on decoder count.

## Results

| Configuration | Cache | Boundary median / p95 | Adjacent crossings superseded before a frame appeared | Seek-to-frame p95 | Exact targets within 50 ms | Stale frames drawn | Video transfer | End JS heap |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Phase 5J, GOP 6 | cold | 83.4 / 100.1 ms | 3 / 16 | 29.6 ms | 42.6% | 147 | 1.04 MB | 26.1 MB |
| Phase 5J, GOP 6 | warm | 83.4 / 116.7 ms | 3 / 16 | 22 ms | 56.9% | 86 | 0.66 MB | 48.2 MB |
| Phase 5K, one decoder, GOP 6 | cold | 0 / 633.3 ms | 5 / 16 | 16.6 ms | 53.6% | 0 | 2.42 MB | 34.3 MB |
| Phase 5K, one decoder, GOP 6 | warm | 0 / 616.8 ms | 5 / 16 | 16.5 ms | 55.7% | 0 | 1.71 MB | 46.3 MB |
| Phase 5K, two decoders, GOP 6 | cold | 0 / 50 ms | 1 / 16 | 16.6 ms | 93.8% | 0 | 10.13 MB | 26.7 MB |
| Phase 5K, two decoders, GOP 6 | warm | 0 / 66.6 ms | 0 / 16 | 16.5 ms | 94.7% | 0 | 10.03 MB | 47.3 MB |
| Phase 5K, two decoders, GOP 2 | cold | 0 / 66.7 ms | 0 / 16 | 16.6 ms | 95.6% | 0 | 17.59 MB | 34.9 MB |
| Phase 5K, two decoders, GOP 2 | warm | 0 / 0 ms | 3 / 16 | 16.6 ms | 75.1% | 0 | 12.09 MB | 46.9 MB |
| Phase 5K, two decoders, GOP 1 | cold | 0 / 66.7 ms | 0 / 16 | 16.6 ms | 95.4% | 0 | 16.53 MB | 63.0 MB |
| Phase 5K, two decoders, GOP 1 | warm | 0 / 0 ms | 3 / 16 | 16.6 ms | 75.4% | 0 | 11.94 MB | 34.5 MB |

## Clip-boundary checks

These are the first forward crossings in the throttled cold trace.

| Boundary | Phase 5J | Phase 5K default |
| --- | ---: | ---: |
| 1 → 2 | 100 ms | 0 ms |
| 2 → 3 | 100.1 ms | 0 ms |
| 3 → 4 | 100.1 ms | 0 ms |
| 4 → 5 | 100.1 ms | 0 ms |

Rapid reversals and larger scroll jumps still sometimes wait for a media range. The default completed 15 of 16 adjacent crossings in the cold trace and 16 of 16 after the browser was primed. The single-decoder Phase 5K completed 11 of 16 in each run. On the cold trace, the longest continuous period sampled more than one source frame away from target was 750 ms in Phase 5J and 216.7 ms in Phase 5K. This includes intentionally abrupt jumps. No run reported a long task over 50 ms or called video playback.

The pure-white desktop scene, corrected zoom clearance and return portrait were checked at 1920 × 1080, 1440 × 900 and 1024 × 768. The four capability entries build in the same order as Phase 5J and stop on the intended source frames. Static About remained accessible at 768 × 900, 390 × 844 and 375 × 812, and with reduced motion. Keyboard About navigation, Projects, Contact, and browser Back were checked in Chromium.

## Recommended setting

Use two paused decoders, GOP 6, and adjacent-only eager preparation. The default improved exact-frame delivery and reduced the sampled stalls on both cold and warm runs. GOP 1 and GOP 2 were slightly ahead on cold exact-target rate in this trace, but transferred more bytes and completed fewer warm boundary crossings. The browser can still load more bytes with two slots than with the Phase 5J single decoder on the same scroll path.

An eager-all prototype transferred 11.19 MB cold. A metadata-only prototype transferred 3.70 MB, with some cold reversals taking longer. The selected approach moved 10.13 MB while keeping the forward handoffs and reducing the tail on fast reversals. Compressed and decoded media memory is browser-managed. At most two video sources are attached, and their samples are reused for each direction. The capacity is a deliberate comparison trade-off.

TypeScript, the local Next.js webpack build, and the existing workspace interaction checks passed. The build emitted the existing Next.js advisory and continued.

The recordings are sampled visual walkthroughs. The timing figures come from the separate browser trace without screen capture.

[Forward walkthrough](recordings/forward.mp4) · [Reverse walkthrough](recordings/reverse.mp4) · [Screenshots](screenshots)
