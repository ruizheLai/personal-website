# Phase 5F motion review

## Timeline

The Phase 5F preview reuses the Phase 5E Home, About, Projects and Contact artwork and layout. The positions below are vertical document travel in viewport heights.

| Segment | Phase 5E | Phase 5F |
| --- | --- | --- |
| Home | 0–0.22 | 0–0.26 |
| Frame approach | 0.22–0.88 | 0.26–1.08 |
| About reading | 0.88–4.58 | 1.08–4.93 |
| Frame departure | 4.58–5.15 | 4.93–5.68 |
| Re-established desk | 5.15–5.21 | 5.68–5.90 |
| Monitor approach | 5.21–5.86 | 5.90–6.72 |
| Projects exhibition | 5.86–7.44 | 6.72–8.58 |
| Monitor departure | 7.44–8.06 | 8.58–9.34 |
| Re-established desk | 8.06–8.12 | 9.34–9.56 |
| Phone approach | 8.12–8.74 | 9.56–10.36 |

The two desk holds are 0.22 viewport heights each. About assigns 0.77 viewport heights per chapter, with 0.16 viewport heights for each interior crossing. The three interior reading holds are 0.61 viewport heights at full opacity, up from 0.60. The introductory and closing chapters have longer uninterrupted holds. Text travel drops from 34 to 19 px per adjacent chapter. The existing avatar artwork and its animation architecture are reused.

The project coverage curves remain complementary, so closing one row opens the next. Each blend lasts 0.33 viewport heights using a quintic curve. The fully expanded stages have 0.44, 0.38 and 0.38 viewport heights respectively at their fully settled positions. Collapsed strips still navigate to stops inside those holds.

## Easing and synchronisation

The pinned presentation samples document scroll through the original passive listener. A monotonic exponential filter with a 36 ms time constant affects movement windows only. It caps displacement at 0.052 viewport heights, settles exactly to the target within 0.0008 viewport heights, and snaps to the input after very large jumps, explicit navigation, or a geometry change. Reading, exhibition and desk plateaus accept the native position directly. The existing one-frame queue runs only while motion needs convergence. No timer or second animation loop runs on a settled frame.

The camera and reveal sample one local entrance or exit passage. A quintic curve accelerates and decelerates the orthographic camera. The camera reaches its endpoint by 92% of the passage and holds its position while the reveal finishes. The reveal writes its progress to the same projection driver that draws the current camera. The projected screen bounds determine the clipping geometry and the monitor/phone placement. Opacity inside an active projection is applied alongside its geometry. A cached scroll sample feeds the damping tail without a repeat viewport read. Changes to that geometry invalidate the demand-rendered canvas even during the last part of the reveal, when the camera is parked. Exits run the same geometry in reverse. Screen texture sources and the no-nested-scroll rule are inherited from Phase 5E.

The presentation resets to an exact position for direct hash navigation and locates the same progress after a desktop resize. Keyboard and touch modes use the existing focus rules and normal flow at reduced motion and narrow widths.

## Top Bar

The Phase 5F bar uses opaque #111111 and #FFFFFF text across Home, About, Projects, Contact and camera transitions. The experiment does not set a destination-dependent colour attribute. Active anchor underlines and visible white keyboard focus are retained. The monochrome override is scoped to the Phase 5F wrapper.

## Baseline inspection

Before changing the motion, I reviewed the Phase 5E recording and ran the Chromium wheel profile against the existing Phase 5E build. The baseline reached both ends of the journey, returned the original camera to its neutral pose and retained one canvas. Median and 95th-percentile moving-frame intervals were 16.7 ms and 16.8 ms. [Phase 5E raw profile](performance-phase5e.json)

## Browser checks and media

The checks cover 1440 × 900, 1024 × 768, 768 × 900, 390 × 844, and 375 × 812, plus reduced motion. [Browser results](screenshots/browser-results.json)

- [Home](screenshots/1440-desk.png), [About](screenshots/1440-about-intro.png), [Projects](screenshots/1440-fixlens.png), and [Contact](screenshots/1440-contact.png) capture the same Top Bar.
- [Desk after About](screenshots/1440-desk-after-about.png), [desk after Projects](screenshots/1440-desk-after-projects.png), [monitor handoff](screenshots/1440-monitor-handoff.png), and [phone handoff](screenshots/1440-phone-handoff.png) show the same styling through the camera journey.
- [1024 px Projects](screenshots/1024-fixlens.png), [768 px About](screenshots/768-about.png), [390 px Contact](screenshots/390-contact.png), and [375 px Projects](screenshots/375-projects.png) cover the different viewport modes.
- [Slow and moderate wheel walkthrough](screenshots/forward-reverse.mp4) shows forward and reverse at each speed. It uses two native Chromium wheel step sizes and captures the resulting frames.
- [Original desk interactions](screenshots/workspace-checks.json) covers the chair, backpack, mug and trash bin. The existing interaction scripts also passed.

TypeScript and the local production build passed. The local build used Webpack and completed after retrying the existing Next.js advisory.

## Limits

Validation used Chromium, including emulated viewport sizes and small wheel deltas representing trackpad-style input. GPU presentation timing and physical trackpad behavior remain unmeasured. The 3D projection still approximates each screen as rectangular bounds during the short handoff. The readout and timing comparison describe the measured browser session.

## Matched Chromium profile

| Metric at 1440 × 900 | Phase 5E | Phase 5F |
| --- | ---: | ---: |
| One-way scroll travel | 7,866 px | 9,324 px |
| Median moving-frame interval | 16.7 ms | 16.7 ms |
| 95th-percentile moving-frame interval | 16.8 ms | 16.8 ms |
| Sampled moving frames above 25 ms | 0 of 170 | 0 of 202 |
| Layouts per 1,000 px of round-trip travel | 6.2 | 12.7 |
| Style recalculations per 1,000 px of round-trip travel | 12.0 | 25.4 |
| Total script time over the round trip | 465 ms | 626 ms |

Both runs received the same wheel steps and completed the round trip with one canvas. The sampled frame cadence held steady. Phase 5F incurred more style, layout and script work, including additional camera/portal samples while the bounded damping converged. The result supports comparable cadence on this machine. [Phase 5E raw profile](performance-phase5e.json) · [Phase 5F raw profile](performance-phase5f.json)
