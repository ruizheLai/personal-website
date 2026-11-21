# Phase 5J rendering comparison

The [Phase 5H scroll map](../../app/design-lab/phase5h/timeline.ts) drives both Phase 5J engines. It supplies all five clip times, the four Capabilities holds, copy cues, camera movement and portal reveal. The renderers quantize source time to the nearest original 24 fps frame. There is no playback clock.

| Route | Frame source | Presentation |
| --- | --- | --- |
| `/design-lab/phase5j?engine=sequence` | 640 × 640 WebP frames from the five originals | A decoded image replaces the preceding image in the DOM |
| `/design-lab/phase5j?engine=video` | Paused 640 × 640 H.264, GOP 6 | One reusable 2D canvas on the DOM stage |
| `/design-lab/phase5j?engine=video&gop=1` | The same video cut with all-intra H.264 | Same video renderer |
| `/design-lab/phase5j?engine=video&gop=2` | The same video cut with two-frame GOPs | Same video renderer |

Append `&perf=1` to see desired and presented frames, lag and cache or decoder counters. With no query, the overlay stays hidden. Both modes keep Projects, Contact and the workspace controls from the previous route.

## Paused MP4

One paused decoder has at most one seek in flight. Incoming scroll overwrites the desired frame, and a completed in-flight request is eligible only while it moves the displayed frame closer to the current target. Switching clips invalidates the old request. The previous successfully drawn frame stays on screen through the new clip's initial load. Repeated positions inside a flat reading interval perform no new work.

Matching media times from `requestVideoFrameCallback()` confirm that Chromium has submitted a decoded target frame. A guarded fallback waits one animation frame after `seeked` when the compositor callback is unavailable or late. Drawing to a stable canvas single-buffers the accepted frame so the raw video element cannot display a pending seek. The canvas stays in the DOM during both 3D portal transitions. The workspace also keeps its two loaded static portrait textures for Home and the return.

| Encode at 640 × 640 | Files | Total transfer if all five files are fetched |
| --- | ---: | ---: |
| GOP 1 | 5 | 12.70 MB |
| GOP 2 | 5 | 13.29 MB |
| GOP 6 | 5 | 7.98 MB |

The derivatives are H.264, CRF 20, silent, 24 fps with B frames disabled and fast-start headers. The size figures are encoded file lengths. Byte-range requests and file reuse can change the transfer on a particular path. GOP 2 and GOP 1 are both near all-intra at this cadence. The bake uses the source resolution for scaling input and keeps original frame cadence, duration and content.

## Image sequence

The WebP set contains 797 squares at quality 82, occupying 18.19 MB on disk. The foreground target takes priority among up to four outstanding decodes. Directional prefetch fills a small window ahead and some frames behind, including across clip boundaries. The cache evicts older decoded images and retains the current visible image and desired frame. A source jump keeps the most recent valid image until an appropriate candidate in the new clip is decoded.

The renderer retains at most 26 cached images and four pending decodes. At four bytes per pixel this is approximately 40.6 MiB cached or 46.9 MiB including the in-flight images. The estimate excludes HTTP cache, browser image pools and GPU backing. `Image.decode()` lets the already decoded image itself become the DOM surface. `createImageBitmap()` would require a canvas or bitmap-backed presentation, so it was unnecessary for this engine.

Reproduce media from the original files by running `node scripts/encode-phase5j.mjs <ffmpeg> <original clips directory>`.
