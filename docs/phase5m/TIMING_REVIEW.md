# Phase 5M timing review

Phase 5M uses the Phase 5L cinematic controller with a shorter scroll map and revised media. The workspace, portal projection, copy, Projects and Contact remain the same. [Compare the original source frames side by side](endpoint-comparison.png).

## Visually checked holds

The contact sheet places the Phase 5L frame, the selected Phase 5M frame and the next source frame or clip in the same row. All indices are zero-based. Source timestamps use 24 fps.

| Action | Source | Phase 5L endpoint | Phase 5M endpoint | Source time | Selection |
| --- | --- | ---: | ---: | ---: | --- |
| Design | Clip 3 | 48 | 73 | 3.041667 s | Keeps the completed easel pose. The first smoke appears at frame 74. |
| Technology | Clip 3 | 120 | 120 | 5.000000 s | Both devices are clear on the last frame, immediately before Clip 4. |
| Understand the Problem | Clip 4 | 42 | 60 | 2.500000 s | The pointing hand has reached the puzzle. The research sweep first enters at frame 61. |
| Research the People | Clip 4 | 90 | 120 | 5.000000 s | The character has settled with the tablet. The interface sweep first enters at frame 121. |
| Design the Experience | Clip 4 | 146 | 175 | 7.291667 s | The UI arrangement is complete. Frame 176 starts the purple sweep into building. |
| Build & Iterate | Clip 4 | 205 | 216 | 9.000000 s | The character settles with the laptop and finished phone screen at the source clip's final frame. |

## Cinematic timeline

Scroll positions are measured in viewport heights. Reading holds last as long as the visitor chooses. The same transitions play in reverse with restored camera and copy.

| Action | Scroll interval | Forward source range | Reverse source range | Forward duration |
| --- | --- | --- | --- | ---: |
| Entrance and Introduction | 0.085–0.785 | Clip 1 frames 0–120, then Clip 2 frames 0–120 | Clip 2 frames 120–0, then Clip 1 frames 120–0 | 10.083 s |
| Design | 0.861–1.161 | Clip 3 frames 0–73 | 72–0 | 3.083 s |
| Technology | 1.237–1.537 | Clip 3 frames 74–120 | 119–73 | 1.958 s |
| Understand the Problem | 1.613–1.913 | Clip 4 frames 0–60 | 59–0 | 2.542 s |
| Research the People | 1.989–2.289 | Clip 4 frames 61–120 | 119–60 | 2.500 s |
| Design the Experience | 2.365–2.665 | Clip 4 frames 121–175 | 174–120 | 2.292 s |
| Build & Iterate | 2.741–3.041 | Clip 4 frames 176–216 | 215–175 | 1.708 s |
| Sports | 3.117–3.497 | Clip 5 frames 0–115 | 115–0 | 4.833 s |
| Return to workspace | 3.573–4.033 | Clip 5 frames 115–216 | 216–115 | 4.250 s |
| Monitor in | 4.109–4.929 | Camera only | Camera only | 1.000 s |
| Monitor out | 6.789–7.549 | Camera only | Camera only | 0.850 s |
| Phone in | 7.625–8.425 | Camera only | Camera only | 0.950 s |

The joined forward and reverse files each contain all 242 original frames. In the forward file the cut falls between output frames 120 and 121 at 5.042 s. The camera tracks only the original Clip 1 portion. It stays in its About pose through the fall and recovery. The Introduction copy starts appearing around joined frame 219 (9.125 s). The native media clock continues through the original editorial cut under one lock and one play call. In reverse the same clock fades the Introduction and returns to the frame.

For the Education and Capabilities recuts, each forward cut after an existing hold begins at the next source frame. The reverse cut begins one source frame earlier than the already visible pose and ends at the preceding hold. This keeps source-frame order continuous across the new boundaries. The exact pause poster takes over on hold. The Capabilities copy adds each new entry over the final 14% of its action, with earlier entries still visible.

The new media uses the original footage, H.264 at 768 × 768 and 24 fps, silent audio, and fast-start headers. FFmpeg checked 32 decoded frames including both sides of the joined cut and the affected segment endpoints against source-derived WebPs. The lowest match was 41.34 dB PSNR. The source files were left intact.

[Forward walkthrough](recordings/forward.mp4) · [Reverse walkthrough](recordings/reverse.mp4) · [Scroll responsiveness](SCROLL_RESPONSIVENESS.md)
