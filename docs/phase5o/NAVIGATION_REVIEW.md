# Phase 5O navigation review

## Forward and object entry

About → Projects and About → Contact use a 57-frame edit of the original footage at 30 FPS. Each reading hold maps to an offset in that edit. The runtime seeks once before starting playback, using the selected hold as the first pose. Presented video frames drive the picture-frame return. The camera then shows the desk for 130 ms and spends 860 ms moving into the chosen portal. About → Contact opens the phone directly from the desk.

Projects → Contact pulls out of the live monitor over 570 ms, holds the desk for 130 ms and moves into the phone over 850 ms. From the desk, monitor and phone entry use a single 1,120 ms camera move. Top Bar and object activation use the same plans, and the projected monitor or phone surface grows into its existing full-screen content.

The picture-frame click from Home uses a 65-frame, 30 FPS cut of the original two entrance clips. The camera uses the same source-frame alignment for the reach, pull and introduction. Clicking the frame after About reverses the completed portrait using the existing montage and settles at the same intro. The journey keeps its single-activation semantics and uses the existing workspace controls and hover affordances. The standalone workspace keeps its separate click-to-focus interaction.

## Rewind, cancellation and accessibility

The Phase 5N backward sequences remain the same. All cinematic navigation uses one shared lock and one video element. A repeat click on the active target is ignored. Another Top Bar target replaces the interrupted history entry and lands directly. Wheel and touch input are gated during playback. Escape, missing media and the safety timeout release the lock and land at the requested destination. The browser’s Back and Forward restore the saved scroll state directly, including an About or Projects hold reached by scrolling.

Reduced motion and static breakpoints navigate directly. Desktop resizing preserves an active transition. Switching to a static layout settles at the destination hash. Focus moves to the destination when it becomes available. The visible Skip button stays removed.

## Recordings

| Recording | Scenario |
| --- | --- |
| [Full About walkthrough](recordings/full-about.mp4) | Normal wheel-driven entrance, all About holds and the frame return |
| [About → Projects](recordings/about-to-projects.mp4) | Outgoing montage, desk and monitor |
| [About → Contact](recordings/about-to-contact.mp4) | Outgoing montage, desk and phone |
| [Projects → About](recordings/projects-to-about.mp4) | Phase 5N rewind in the new route |
| [Monitor click](recordings/monitor-to-projects.mp4) | Pointer activation from Home |
| [Picture frame click](recordings/frame-to-about.mp4) | Projected entrance and introduction |
| [Phone click](recordings/phone-to-contact.mp4) | Projected approach and four-app Contact |

The recordings sample the browser with wall-clock timestamps and are encoded at 15 FPS. Video playback and the camera projection are measured separately. Remote media startup and device rendering performance can vary.

## Local Chrome timings

These measurements use the time from scroll lock to release at 1440 × 900.

| Path | Observed time |
| --- | ---: |
| About → Projects | 2.96 s |
| About → Contact | 2.96 s |
| Projects → Contact | 1.61 s |
| Projects → About | 2.62 s |
| Contact → Projects | 1.56 s |
| Contact → About | 2.57 s |
| Home → Projects or Contact | 1.19 s |
| Monitor or phone pointer activation | 1.17–1.18 s |
| Picture-frame pointer activation from Home | 2.28 s |
| Sports hold → Projects | 1.84 s |

The late About case confirmed that the video starts near the sports hold and skips the earlier excerpts. The checks also covered object activation from the workspace after About and after Projects, native wheel input during a lock, repeated and conflicting clicks, restore and focus after Back and Forward, direct hashes, resizing, blocked media, Escape and reduced motion.

Chrome reported all 57 frames with zero drops on each full About forward route and all 65 frames with zero drops on the Home picture-frame entry. The later picture-frame rewind from the desk reported one dropped frame out of 56.
