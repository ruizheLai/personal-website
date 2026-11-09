# Phase 3D.1 — Experience polish and complete reporting journey

10 November 2026 · `/projects/fixlens` · `E:\Personal Website`

## Scope and branch

Branch `codex/fixlens-phase-3d1-polish` starts at the latest fetched Phase 3D commit, `a5551bb68b9c7625915e8b708778303798cc02e7`. It does not start from main or merge an earlier experiment. Main and production are unchanged. Existing untracked `.taste-skill/` files are preserved and excluded.

The current blue/white palette, gradients, hero composition, typography and product stories are retained. This is a targeted refinement. The final delivery message supplies the verified remote SHA and actual Vercel Preview URL after the review commit is pushed.

## What changed

- Removed the hero's lower-left development caption and redundant floating product label. The application link remains understated, with positive clearance below the dashboard at every tested width.
- Removed the Challenge footnote. Its connection to research is expressed once in the visible research context.
- Removed comparison instructions and separate original-image links. Each stationary matched pair has one small native slider beneath the image, with an accessible name and short Mid-fi/Hi-fi endpoint labels.
- Manual comparison input holds its value until intentional native scroll input resumes. Focus/layout scrolling does not take ownership away. Keyboard input keeps the complete phone in view. The boundary disappears at 0/100%.
- Expanded the reporting story from five to twelve authentic prototype screens, ending at submission confirmation. Removed all numbered gallery buttons and duplicated instructions.
- Moved danger guidance beside Safety Choice as an unnumbered alternative. It is not in the safe primary sequence.
- Added consistent phone silhouette masks, visible keyboard-only focus treatment, and a fully hidden-until-focused skip link.
- Added the interview count and one-shot staggered research themes. Refined evaluation timing with the same reusable entry hook. Shortened repetitive support copy while retaining research findings and application limitations.

## Files

| File | Change |
| --- | --- |
| `app/projects/fixlens/page.tsx` | Targeted copy removal, concise qualifications, research motion and complete journey |
| `components/fixlens/MotionStory.tsx` | Twelve-screen track, safety branch, travel-based pin duration, input ownership and keyboard framing |
| `components/fixlens/ViewportMotion.tsx` | Shared one-shot viewport progress, interview counter and theme arrivals |
| `components/fixlens/EvaluationResults.tsx` | Reuses shared timing; verified values and layout unchanged |
| `components/fixlens/CaseStudyExperience.tsx` | Identifies full phone presentations for route-scoped masking |
| `app/projects/fixlens/experience-polish.css` | Scoped phone edges, focus, comparisons, journey sizing and responsive refinements |
| `lib/fixlens-assets.ts` | Typed records for five new authentic Figma derivatives |
| `public/images/projects/fixlens/md1-*.webp` | Five lossless native-resolution crops |
| `docs/phase3d1-asset-provenance.json` | Sources, hashes, crop coordinates and pixel verification |
| `docs/phase3d1-finesse-detector.json` | Saved final static quality check |
| `docs/reviews/phase3d1/` | Browser review captures and responsive results |

No package, global stylesheet, homepage implementation, project card, Blender file or GLB was changed.

## Reporting source audit

Inspected image contents in `E:\UX project\high fidelity prototype` and the final-assets manifests/publication checklist. All twelve primary screens below are Hi-fi Figma prototype exports. No implemented-product-only screen is inserted into this journey.

| Order | Genuine original export | Story stage / asset |
| --- | --- | --- |
| 1 | `01 · Confirm property.png` | Property and contact · existing `propertyClean` |
| 2 | `02 · Describe issue.png` | Issue description · existing `descriptionClean` |
| 3 | `03 · Review AI summary.png` | Structured summary · existing FX38 |
| 4 | `04 · Safety choice.png` | Safety decision · existing FX39 |
| 5 | `06 · Guided capture plan.png` | Safe capture introduction · existing FX41 |
| 6 | `Capture Overview.png` | Overview capture · existing `captureOverview` |
| 7 | `Overview Review.png` | Retake/annotation and use-photo state · new `overviewReview` |
| 8 | `Capture Close-up.png` | Close-up capture · existing `captureCloseup` |
| 9 | `Close-up Review.png` | Close-up annotation/review · new `closeupReview` |
| 10 | `Evidence Captured.png` | Evidence-ready state · new `evidenceReady` |
| 11 | `Review Report.png` | Authentic report-review viewport · new `reportReviewHifi` |
| 12 | `Report Submitted.png` | Full submission confirmation · new `reportSubmittedHifi` |

`05 · Danger guidance.png` (FX40) is shown directly beside step 4 with “Alternative: danger reported” and “Stop unsafe capture.” Annotation/review follows the corresponding photograph, matching the supplied prototype states.

`Submitted Report.png` is a later submitted-case record, rather than a required pre-submission screen. `Capture Video.png` and `Video Review.png` were inspected but are not inserted into this selected photo-reporting story. The authentic capture plan/evidence exports retain their proposed-video labels; a concise visible scope sentence makes clear that complete recording was not delivered in the application. No fabricated “photo-only” UI was substituted.

### Remaining source limits

- `Review Report.png` is a phone viewport, not a long full-scroll export. Its lower Description row continues beneath the original message composer, and the Submit action is not visible in this supplied viewport. No fuller authentic review export was found. The entire supplied phone boundary is preserved; the next authentic confirmation demonstrates the submitted state without fabricating a missing button.
- Exact export-to-evaluated-version timestamps remain unproved. These are authentic Hi-fi artifacts, not a claim that each export is independently timestamp-certified as the evaluated build.
- A complete working application recording flow remains undelivered. Video-background publication rights were not newly assumed. Overview/Close-up photography and all reporting demonstration values were already explicitly authorized by the owner; those permissions support the selected derivatives and thumbnails.
- Recreated `report 1–6.png`, raw interviews and participant-identifying research material remain excluded.

## Image presentation

The five new files are lossless 390×844 crops at `(80,48)` from 550×1004 originals. Automated RGBA comparison found **zero visible pixel differences** between each native crop and its WebP derivative. Originals are unchanged. Source and derivative SHA-256 hashes are recorded.

Phone presentation uses a CSS silhouette of `10.2564% / 4.7393%`, corresponding to approximately 40 native pixels at 390×844. This removes the exterior square-corner canvas/shadow appearance while retaining the interface. Both comparison layers use the same mask. Existing implemented viewport captures receive the same presentation radius; details and dashboards keep their appropriate boundaries. Zoom inherits the source radius. Genuine grey interface backgrounds inside the phone are preserved.

Keyboard focus remains visible. Ordinary pointer use was checked: the slider had `:focus-visible=false` and no outline, and an image closed by its pointer-operated close button returned focus without a blue outline. The skip link was measured at bottom −8px when inactive, appeared at top 20px with Tab, and disappeared after Enter focused `main-content`.

## Motion implementation

- Native scroll + one scheduled animation frame remains the engine; no dependency added, no wheel/touch interception or scroll locking.
- Track travel determines the journey's vertical distance (72% of available horizontal travel, with a minimum). The final 180px holds the complete final screen before sticky release.
- The native slider owns its mask during manual input. Passive wheel/touch and scroll keys hand control back to the scroll story. Focus, resize and layout changes do not reset manual input.
- Keyboard Tab follows the actual list of image links and aligns the focused reporting stage, including the contextual branch. No visible gallery navigation is added.
- Counts use a 1,250ms cubic ease-out and a one-shot viewport trigger. Research themes use 720ms restrained arrivals with an 85ms stagger. Small up/down scrolls do not restart them.
- Reduced-motion branches show final counts, cancel theme arrivals, and use static complete comparisons/journey content. Narrow layouts retain the native manual comparison and a vertical reporting sequence. Server HTML contains all states and final accessible numerical values.
- Listeners, media-query subscriptions, observers, animation frames and theme animations are cleaned up on unmount.

## Validation

| Check | Observed result |
| --- | --- |
| TypeScript | `npm run typecheck` passed on final source |
| Production | `npm run build` passed; all seven routes generated |
| Existing regressions | Backpack/trash checks passed; existing Node module-type warnings remain |
| Model audit | Prebuild verified 205 nodes and 2,163,588 bytes; model unchanged |
| SSR availability | All twelve stages found in chronological order; removed instructions absent; verified evaluation values and no-retest qualification present |
| Asset integrity | Five new crops: zero visible pixel differences; no broken loaded images in responsive checks |
| 1440 / 1024 / 768 / 390 / 375 | Browser checked; no horizontal overflow, twelve stages, zero gallery buttons at every width |
| Hero clearance | Approximately 29 / 19 / 78 / 48 / 54px respectively below the dashboard |
| Comparison | Native keyboard verified 0/50/100% for Home and Capture; stationary image bounds, synchronized boundary, manual value stable; upward/downward native keys observed reveal about 42→60% |
| Reporting scroll | Native PageDown observed progress 0→.242→.484→.726→.968→1; PageUp reversed to .726 |
| Final screen hold | At progress 1, final image bounds were approximately x994–1272, y262–862 inside the viewport; the parent still extended to y1065, leaving time before release |
| Sticky release | Following PageDown moved report bottom to y278 and solution heading region into view; no trap |
| Research | Browser observed 0→8; themes sampled at opacity .786 with 4.6px translation and the next at .35/14px; count remained 8 on reversal |
| Evaluation | Browser observed zero values then 91.7/4.30/6; task bars sampled at scaleX(.407), then all 1; final widths 100%, 93.4%, 73.4%, 86.6%, 76.6% |
| Pointer / keyboard | Narrow pointer click set reveal to 50 with no persistent focus outline; keyboard focus and skip link remained visible/functional |
| Phone geometry | Browser verified original aspect ratios and consistent masks; complete submission phone and controls visible |
| Unchanged routes | Homepage canvas reached ready; Projects loaded with its FixLens link; no console errors observed |
| Finesse | Installed 0.22.0 reused, no reinstall; final detector zero P0/P1 findings. TSX missing-stamp advisories refer to external CSS; existing factual punctuation retained |

The Finesse motion and preflight workflows were applied within the user's preservation boundary. The current white/blue identity and composition intentionally do not rotate to a new aesthetic. Preflight questions were checked against the rendered result: the story reaches confirmation; safety branches at the choice; manual input and scrolling do not compete; all UI boundaries remain intact; factual qualifications remain visible.

## Captures

`docs/reviews/phase3d1/` contains:

- `hero-desktop.png`, `hero-mobile.png`
- `home-0.png`, `home-50.png`, `home-100.png`
- `capture-0.png`, `capture-50.png`, `capture-100.png`
- `reporting-start.png`, `reporting-safety.png`, `reporting-capture.png`, `reporting-submission.png`
- `research-desktop.png`, `evaluation.png`
- `solution-desktop.png`, `solution-mobile.png`, `iteration-desktop.png`
- `safety-mobile.png`, `safety-1024.png`, `reporting-768.png`
- `full-desktop.png`, `responsive-checks.json`

Keyboard capture images intentionally retain their legitimate focus indicator. A full-page still cannot show every sticky state simultaneously; the separate journey/reveal captures supply that evidence.

## Known limitations

- No physical touch device or assistive-technology session was used. Narrow pointer/keyboard input and 44px slider targets were checked; physical touch is not claimed.
- Available browser controls did not emulate OS reduced motion or disable JavaScript. Their effect branches, static CSS and generated server HTML were inspected; those are source/SSR checks, not claimed runtime emulation.
- No cross-browser/device performance benchmark or video recording was produced. Native scroll motion was exercised in the browser and documented with stills.
- The source review viewport limit above is preserved honestly. No new usability outcome or post-deployment retest is claimed.
- This is a review-branch preview only; main and production require a separate future instruction.
