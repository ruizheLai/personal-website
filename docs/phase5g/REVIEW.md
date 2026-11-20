# Phase 5G workspace pacing review

Phase 5G uses the Phase 5F camera easing, bounded visual damping, native document scroll, and projected DOM handoffs. The experiment is isolated under /design-lab/phase5g.

## Timeline

Positions are measured in viewport heights from the start of the document.

| Segment | Phase 5F | Phase 5G |
| --- | --- | --- |
| Home | 0–0.26 | 0–0.26 |
| Frame approach | 0.26–1.08 | 0.26–1.08 |
| About | 1.08–4.93 | 1.08–4.93 |
| Frame exit | 4.93–5.68 | 4.93–5.68 |
| Interactive desk before Projects | 5.68–5.90 | 5.68–6.36 |
| Monitor approach | 5.90–6.72 | 6.36–7.18 |
| Projects | 6.72–8.58 | 7.18–9.04 |
| Monitor exit | 8.58–9.34 | 9.04–9.80 |
| Interactive desk before Contact | 9.34–9.56 | 9.80–10.48 |
| Phone approach | 9.56–10.36 | 10.48–11.28 |

Each return has a 0.68-viewport-height interactive hold, up from 0.22. They account for the entire 0.92-viewport-height increase in travel. The camera is home, the workspace controls are enabled, and header and desk object activation can leave either hold directly. Reading and project durations use the existing Phase 5F values.

## Header theme

A single theme setter updates one data attribute when the visible environment changes. The allowed pairs are white over #111111 and #111111 over white. On desktop the neutral desk, About, and the light portion of a handoff use the light pair. Projects and Contact switch to the dark pair as their portal fills the view. The dark threshold is 72% reveal, and the return to light occurs at 62%. This narrow buffer prevents oscillation on tiny wheel changes. In normal-flow and reduced-motion mode, a viewport observer samples the narrow band just below the sticky bar to follow the visible section.

Foreground, background, and border use a coordinated 70 ms discrete transition to keep the two contrast pairs intact. Reduced motion removes the wait. The existing dimensions, typography, underline, links, and keyboard focus are retained. The desktop bar uses the existing visual timeline sample and updates only when the theme flips.

## Welcome placement and visibility

The Phase 5F copy was set at the lower left, close to the backpack and floor silhouette. Inspecting the 1440, 1024, 768, 390, and 375 px captures showed an uninterrupted band above the scene. The same heading and instruction now sit in that band, aligned with the existing content edge. A narrower treatment handles short desktop windows while leaving the desk composition and 3D camera framing intact.

At Home the copy stays fully visible through 0.24 viewport heights. It fades through the first part of the frame approach and is hidden by 0.51. The two later desk intervals omit it. Scrolling back into the initial Home zone reveals it again. A direct object visit from the initial desk uses the corresponding entrance fade. The normal-flow layout places the introduction in its Home section.

- [1440 px before](screenshots/1440-before.png) · [1440 px after](screenshots/1440-desk.png)
- [1024 px before](screenshots/1024-before.png) · [1024 px after](screenshots/1024-desk.png)
- [390 px before](screenshots/390-before.png) · [390 px after](screenshots/390-desk.png)

## Browser validation and media

Chromium passed 1440 × 900, 1024 × 768, 768 × 900, 390 × 844, and 375 × 812, plus reduced motion. The welcome region was sampled with the copy temporarily hidden. Its bounds contained zero dark scene pixels at the checked widths, and the captures were visually reviewed for overlap. The desktop tests verified fading at initial entry, zero welcome opacity throughout both desk holds, and full opacity upon reversing to Home. A slow forward/reverse wheel sequence crossed the monitor theme threshold once each way, with sampled frames using only the two exact colour pairs. The mobile and reduced-motion cases exercised direct navigation and normal-flow themes.

The tests also checked stable home camera poses across the longer holds, original object controls inside the holds, phone activation from the second hold and Back to the same scroll position, projection at the same position in both directions, no nested scroll, direct navigation and Back, resize, and the original public and case-study routes. TypeScript, the production build on retry with Webpack, and the existing workspace scripts passed. The local build retains its existing Next.js dependency advisory. [Browser results](screenshots/browser-results.json) · [Desk interaction check](screenshots/workspace-checks.json)

- [Home, light](screenshots/1440-desk.png) · [About, light](screenshots/1440-about-intro.png) · [Projects, dark](screenshots/1440-fixlens.png) · [Contact, dark](screenshots/1440-contact.png)
- [Desk before Projects](screenshots/1440-desk-after-about.png) · [Desk before Contact](screenshots/1440-desk-after-projects.png) · [Monitor handoff](screenshots/1440-monitor-handoff.png) · [Phone handoff](screenshots/1440-phone-handoff.png)
- [1024 px Projects](screenshots/1024-fixlens.png) · [768 px About](screenshots/768-about.png) · [390 px Contact](screenshots/390-contact.png) · [375 px Home](screenshots/375-desk.png)
- [Forward and reverse Chromium walkthrough](screenshots/forward-reverse.mp4)

## Matched Chromium profile

| Metric at 1440 × 900 | Phase 5F | Phase 5G |
| --- | ---: | ---: |
| One-way travel | 9,324 px | 10,152 px |
| Median moving-frame interval | 16.7 ms | 16.7 ms |
| 95th-percentile moving-frame interval | 16.8 ms | 16.8 ms |
| Moving-frame samples over 25 ms | 2 of 202 | 5 of 220 |
| Moving-frame samples over 50 ms | 0 | 0 |
| Style recalculations per 1,000 px round trip | 25.1 | 19.3 |
| Layouts per 1,000 px round trip | 12.2 | 11.5 |
| Total script time round trip | 420 ms | 503 ms |

Both builds used the same wheel steps, retained one canvas, and returned to the original camera pose. Phase 5G sampled the same p95 and more isolated intervals above 25 ms. Style and layout counts fell per distance, while total script time increased over the longer journey. [Phase 5F profile](performance-phase5f.json) · [Phase 5G profile](performance-phase5g.json)

## Known limits

The profile used one Chromium configuration with emulated viewport sizes and wheel input. Physical trackpad behavior and GPU presentation timing remain unmeasured. The theme buffer intentionally permits the current colour pair to persist within a narrow mixed-background region during a reversal. The original rectangular screen projection remains a visual approximation at the edges of the handoff.
