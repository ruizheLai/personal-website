# FixLens — Editorial, visual & interaction refinement

5 November 2026 · `codex/fixlens-phase-3b-visual-review`

Local review of `/projects/fixlens` in `E:\Personal Website`, based on commit `d1e0fba`. The nine-section narrative, routes, authentic design work and verified research/evaluation facts are preserved. No push, merge or deployment was performed.

[Open the local production preview](http://127.0.0.1:3010/projects/fixlens).

## Changes

- **Reading scale:** desktop section headings 48–64px, body 18px, captions 15px, eyebrows 14px and story links 16px. Mobile uses a separate hierarchy rather than uniform scaling. Supporting text has stronger contrast; blue and selective teal accents establish hierarchy.
- **Editorial rhythm:** removed generic introductions from image-led sections, kept essential research/evaluation context, and promoted the guided-conversation decision into a 25–27px lead. One restrained handwritten annotation connects the original sketches to the process.
- **Comparison composition:** the report-editing explanation and larger prototype field detail now share a column beside the complete implemented review screen. Related content is closer and the original interface remains intact. Comparison images reserve their aspect ratio before lazy loading.
- **Story rail:** sticky segmented links expand on desktop hover/focus over 420ms, retain readable neighbours, track scrolling with IntersectionObserver, preserve hash/history behavior and smoothly navigate with measured offsets. Keyboard activation focuses the destination heading. Mobile uses an internally scrollable rail.
- **Interaction and motion:** one visible “Drag to compare” hint, separate screen-reader instructions, larger fidelity labels and a responsive handle. Heading, image, research and comparison entrances vary intentionally. Three selected compositions use at most ±8px native scroll-linked drift on supported desktop browsers. Text never automatically fades out while being read. Existing zoom, galleries and disclosures remain.

## Authentic demo assets restored

The masks were baked into prepared images, not webpage overlays. Following the owner's confirmation that Brad is fictional demo data, six website derivatives were regenerated directly from authentic originals with native orientation/crops, lossless WebP and no generated content:

| Keys | Restored content |
| --- | --- |
| FX10 / homeSketch | Original handwritten greeting and paper texture |
| FX11 / FX16 | Original Mid-fi / Hi-fi Home greeting |
| FX13 / FX19 | Authored demo case reference `FL-1024` |

All six match the authentic source RGBA pixels exactly after their recorded crop/orientation. `captureSketch` needed a metadata correction only. FX17/FX37 still protect unverified full contact/property values and are byte-identical to the previous version. No raw participant material or contact-bearing clean exports were copied into the repository. Source manifests and original UX/FixLens files remain untouched.

The publication map still contains 31 images; 25 binaries are unchanged. Exact source/output hashes, native crop parameters and retained protections are recorded in [fixlens-assets.json](fixlens-assets.json).

## Main files

| Area | Files |
| --- | --- |
| Narrative, compositions and hooks | `app/projects/fixlens/page.tsx` |
| Typography, colour and spacing | `app/projects/fixlens/fixlens-editorial.css` |
| Navigation | `components/fixlens/StoryNavigation.tsx`, `app/projects/fixlens/story-navigation.css` |
| Entrances, progressive parallax, galleries | `components/fixlens/CaseStudyExperience.tsx`, `app/projects/fixlens/editorial-motion.css` |
| Comparison hint/accessibility | `components/fixlens/MatchedComparison.tsx` |
| Image descriptions and provenance | `lib/fixlens-assets.ts`, `docs/fixlens-assets.json`, six existing public WebPs |
| Single handwriting accent | `public/fonts/caveat-annotation.ttf`, license and source notes |

The main sans-serif is unchanged. The self-hosted Caveat annotation subset is 11,040 bytes; it makes no runtime request to Google. The [official source](https://github.com/google/fonts/tree/main/ofl/caveat) and its retained [OFL license](../public/fonts/Caveat-OFL.txt) document the font provenance. No packages or animation libraries were added.

## Validation

| Check | Result |
| --- | --- |
| TypeScript / production build | `npm run typecheck` and `npm run build` pass. No lint script exists in the project. |
| Existing workspace regressions | `npm run check:interactions` and `npm run check:model` pass; GLB source remains unchanged. |
| Widths | 1440, 1024, 768, 390 and 375px checked; no horizontal page overflow. Mobile rail overflow stays internal. |
| Navigation | Hover expansion measured from roughly 165px to 289px while neighbours remain readable at 16px. Active scrolling progresses through all seven links. Desktop and mobile arrival gaps are approximately 24px below the rail. Hash Back behavior and keyboard heading focus verified. |
| Comparison | Default 50%; Home/Arrow keys and native pointer dragging checked at desktop and mobile width. Two image rectangles remain stationary; only the mask changes. Exactly one visible hint remains. |
| Gallery / zoom | Gallery keyboard scrolling and buttons work. Enter opens zoom; Tab remains on its close control; Escape returns focus and restores page scrolling/source visibility. The complete enlarged image fits the mobile viewport. |
| Layout / images | Reserved image geometry stays stable before/after lazy loading. Visible assets load successfully. No case-study console errors observed. |
| Links / facts | Header → homepage → Projects → FixLens route verified. Eight interviews (six renters/two landlords), SUS 91.7, mean ease 4.30, six people/five tasks and task means 5.00/4.67/3.67/4.33/3.83 remain unchanged. Scope and no-retest qualifications remain accessible. |

The existing Node module-format warnings in workspace regression scripts remain. No unrelated dependency/configuration change was made to suppress them. The pre-existing `next-env.d.ts` edit is preserved and excluded from this review checkpoint.

## Screenshots

Captures are in `docs/screenshots/fixlens-editorial/`.

| Area | Views |
| --- | --- |
| Hero | [Desktop](screenshots/fixlens-editorial/hero-desktop.jpg) · [1024](screenshots/fixlens-editorial/hero-1024.jpg) · [768](screenshots/fixlens-editorial/hero-768.jpg) · [390](screenshots/fixlens-editorial/hero-390.jpg) · [375](screenshots/fixlens-editorial/hero-375.jpg) |
| Rail | [Research](screenshots/fixlens-editorial/navigation-research.jpg) · [Hover](screenshots/fixlens-editorial/navigation-hover-desktop.jpg) · [Mobile](screenshots/fixlens-editorial/navigation-mobile.jpg) |
| Challenge / research | [Challenge](screenshots/fixlens-editorial/challenge-desktop.jpg) · [Research](screenshots/fixlens-editorial/research-desktop.jpg) |
| Sketches | [Desktop](screenshots/fixlens-editorial/exploration-desktop.jpg) · [Mobile](screenshots/fixlens-editorial/exploration-mobile.jpg) |
| Comparisons | [Evolution](screenshots/fixlens-editorial/evolution-desktop.jpg) · [Editing composition](screenshots/fixlens-editorial/editing-comparison-desktop.jpg) |
| Evaluation / iteration | [Evaluation](screenshots/fixlens-editorial/evaluation-desktop.jpg) · [Iteration](screenshots/fixlens-editorial/iteration-desktop.jpg) |
| Full story / zoom | [Full desktop](screenshots/fixlens-editorial/full-desktop.jpg) · [Mobile zoom](screenshots/fixlens-editorial/zoom-mobile.jpg) |

## Remaining verification limits

The controller provides mouse/keyboard input and viewport sizing, but no true touch or media-preference emulation. Native dragging at mobile width passed; physical touchscreen input and an actual reduced-motion preference toggle remain device checks. Reduced-motion handling was reviewed across entrances, navigation, metrics, parallax and zoom; final content remains available without motion. No controlled Lighthouse or low-powered-device benchmark was performed.

FX17/FX37 retain the legitimate privacy protections described above. No other functional issue was found during this review.
