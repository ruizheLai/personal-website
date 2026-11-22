# Phase 5N implementation review

Phase 5N is available at `/design-lab/phase5n`. Phase 5M remains the comparison at `/design-lab/phase5m`. The existing scroll-triggered stages, reading holds, source footage and workspace interactions are shared.

## About

The rectangle had two causes. In the original video, sampled background pixels were RGB 250–252. The extracted Education and Capabilities WebP holds measured 253–254. In Phase 5M, the more specific Phase 5J fallback rule also kept a second image behind the video and poster. The edge mask exposed that image along the boundary, even where the foreground filter had already made the source white. A 1440 × 900 Education hold measured 251 at the visible boundary against a 255 page.

Phase 5N removes the background-image fallback once the cinematic surface is painted. It uses an sRGB transfer curve on unframed video, stills and posters. Values at or below 89% stay at their original level. Above that, the curve rolls the brightest pixels toward white. Applying the transfer separately to the color channels keeps the dark outlines and most colored detail. The existing 1.5% video edge blend stays in place. There is no new crop, geometry change, border or shadow. The framed entrance and exit keep their existing treatment. Some pale near-white details share the same tone as the source backdrop, so the highlight correction affects those pixels too. Contact shadows around the shoes and sports props remain visible.

Most sampled background pixels along the previous boundary now match the page at RGB 255. A few samples near source shadows were 254. At the former horizontal edge at y = 150, every sampled point across all three 1440 × 900 holds measured 255.

Education keeps “From Design to Technology.” The entries are Bachelor of Design, University of Melbourne, 2022 – 2025 and Master of Information Technology, University of Melbourne, 2025 – 2027. The outfit cues still select the current entry. Both entries are available in static layouts without progression.

## Projects

All three headers use two columns. FixLens, Sippy and WillDo align left, with their categories aligned to the right content edge. Collapsed rows keep their full-width buttons, keyboard activation, focus treatment and expansion state.

The FixLens layout uses the existing screenshots at their source proportions. The darker external panel, border, padding, shadow and perspective transforms were removed. The grid gives the property manager screenshot the larger share and constrains the renter screenshot by the available height. Captions remain beneath each image, and the exhibition still opens the FixLens case study.

At 1440 × 900, the visible property manager screenshot grew from about 692 to 945 px wide, and the renter screenshot from about 171 to 264 px. The older measurements include the perspective transform.

## Browser validation

Chrome desktop used real wheel input to open every About stage and continue into Projects and Contact. The walkthrough checks the entrance across the original clip seam and the expected hold poster after each stage. Capabilities still accumulate one entry at a time.

| Viewport | Layout | FixLens widths, manager / renter |
| --- | --- | --- |
| 1920 × 1080 | Cinematic | 966 / 270 px |
| 1440 × 900 | Cinematic | 945 / 264 px |
| 1024 × 768 | Cinematic | 668 / 187 px |
| 768 × 900 | Static | 498 / 140 px |
| 390 × 844 | Static | 258 / 72 px |
| 375 × 812 | Static | 246 / 69 px |

All six sizes kept category labels aligned to the right and the images within the viewport width at their source aspect ratios. Both credentials appeared in the accessibility tree at the three static sizes. Keyboard activation opened the Sippy header, and Back from the FixLens case study returned to Projects. TypeScript, the existing workspace interaction checks and the local production build passed. The build emitted a Next.js dependency advisory. The browser checks ran against the generated production files.

## Captures

| Screenshot | What to inspect |
| --- | --- |
| [Bachelor of Design](screenshots/education-bachelor.png) | Drawing outfit and first credential |
| [Education](screenshots/education.png) | Programmer outfit and both credentials |
| [Capabilities](screenshots/capabilities.png) | All four accumulated capabilities |
| [Beyond Work](screenshots/beyond-work.png) | Jersey, bicycle, shoes and both balls |
| [Projects headers](screenshots/projects-headers.png) | Left titles and right categories on all three rows |
| [FixLens enlargement](screenshots/fixlens-enlarged.png) | Borderless desktop and mobile screenshots |
| [White workspace](screenshots/white-workspace.png) | White desk scene and the intentional picture frame |

The [navigation review](NAVIGATION_REWIND.md) includes the rewind recordings and recovery checks.
