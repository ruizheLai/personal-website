# Phase 5N navigation rewind

Projects → About pulls out of the monitor using the live 3D camera, briefly shows the desk, then reverses the original picture-frame return into About. Contact → About starts with the equivalent phone retreat. Contact → Projects retreats from the phone and moves into the monitor using the two existing camera views.

| Path | Authored timing | Recording |
| --- | --- | --- |
| Projects → About | 570 ms monitor retreat, 130 ms desk pause, 1.867 s montage | [Projects → About](recordings/projects-to-about.mp4) |
| Contact → About | 520 ms phone retreat, 130 ms desk pause, 1.867 s montage | |
| Contact → Projects | 520 ms phone retreat, 130 ms desk pause, 850 ms monitor approach | [Contact → Projects](recordings/contact-to-projects.mp4) |

The [forward walkthrough](recordings/forward.mp4) shows the existing scroll-driven journey. The [About entrance and exit](recordings/about-entrance-and-exit.mp4) isolate the picture-frame transitions.

## Montage

One 381,074-byte, 768 × 768 H.264 video uses 56 selected frames at 30 FPS. The five excerpts are assembled from the supplied original clips.

| Montage frames, zero-based | Source frames, zero-based |
| --- | --- |
| 0–19 | Clip 5, 216 → 115, picture frame and sports |
| 20–28 | Clip 4, 216 → 183, build |
| 29–36 | Clip 4, 121 → 94, research and interface |
| 37–46 | Clip 3, 120 → 72, education |
| 47–55 | Clip 2, 101 → 120, introductory pose |

The first shot uses the existing return-camera curve in reverse. Its projected position and frame treatment follow the video frame presented by the decoder. The subsequent cuts intentionally compress the later About states. The last nine frames let the original intro pose settle before handing over to the same intro poster and `.823`-viewport scroll anchor as direct About navigation.

## Input and recovery

Rewind is a separate state in the existing cinematic controller. It uses the shared scroll lock and one video element. The montage can load during the camera retreat. Its camera cues start once a frame has been presented, so a cold media request can briefly lengthen the desk hold. The decoder releases its source after settlement.

Repeated clicks on the same destination are ignored while it is in flight. A different Top Bar destination cancels the rewind and acts immediately. Wheel input stays at the scroll anchor while the camera moves. The outgoing history entry records the current scroll position, including the selected Project. Back and Forward restore positions directly. Escape and media failure settle at the requested destination and unlock. Changing to a static layout cancels the cinematic run and follows the destination hash. Reduced-motion visitors and static layouts navigate directly. Focus moves to the destination once its controls are available.

## Browser observations

Local production-mode Chrome at 1440 × 900 measured 2.63 s for Projects → About, 2.58 s for Contact → About and 1.55 s for Contact → Projects, from lock to release. Both About rewinds reported 56 video frames and zero drops. The first rewind in the browser session presented its first video frame after 747 ms, which includes the 700 ms authored camera and desk phase. The subsequent Contact rewind presented its first frame after 698 ms, including its 650 ms phase. Contact → Projects uses the 3D camera alone.

The recording samples viewport screenshots with wall-clock timestamps and is encoded at 15 FPS. Decoder counts come from Chrome’s playback-quality counter, separate from the recording. Slow remote connections and other browser or GPU combinations can vary.
