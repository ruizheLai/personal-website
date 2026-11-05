# Phase 3A — FixLens case study

Implemented 5 November 2026 in `E:\Personal Website`.

## Result and scope

The complete case study is available at `/projects/fixlens`. Projects now has an authentic, linked FixLens preview. The page uses the existing Arial typography, shared header, Next.js App Router, React, TypeScript and existing Tailwind environment, with scoped editorial CSS. No dependencies, extra 3D scene, homepage redesign, model edits or public deployment were introduced.

The narrative was adapted from `E:\UX project\portfolio draft\portfolio content draft.docx`, with visual organization and evidence limits checked against:

- VISUAL_STORYBOARD_FINAL.md
- SELECTED_VISUALS_FINAL.md
- DESIGN_EVOLUTION.md
- PROTOTYPE_PRODUCT_COMPARISON.md
- final-assets/manifests/ASSET_MANIFEST.md and ASSET_MANIFEST.json
- final-assets/manifests/PUBLICATION_CHECKLIST.md
- Existing evaluation evidence for the five task-level means.

All source UX materials and the FixLens application were read-only. No interview transcripts, participant records, original research documents or unapproved screenshots were copied.

## Routes and files

| File | Purpose |
| --- | --- |
| app/projects/fixlens/page.tsx | Server-rendered narrative, metadata and nine-section composition |
| app/projects/fixlens/fixlens.css | Scoped typography, layouts, breakpoints, lightbox and motion |
| components/fixlens/CaseStudyExperience.tsx | Client-only enhancement: native modal, image links, observer and scroll controls |
| lib/fixlens-assets.ts | Typed dimensions, descriptive alt text and published image paths |
| public/images/projects/fixlens/ | 31 approved WebP files |
| app/projects/page.tsx | Existing Projects route; linked FixLens preview replaces its placeholder |
| app/projects/projects.css | Scoped preview image composition |
| docs/fixlens-assets.json | Per-file provenance, operations, hashes, dimensions and alpha verification |
| docs/phase-3a-validation.json | Check results and validation boundaries |
| docs/screenshots/phase-3a/ | Desktop sections, mobile, full-page and regression screenshots |
| docs/PHASE_3A_FIXLENS.md | This implementation record |

Shared navigation and transition logic, global styles, other routes, GLB/Blender assets, package versions and package lock were not edited.

## Content organization

1. **Hero / overview:** independent PM dashboard and rounded tenant-screen presentation layers, role, August–October 2026 timeline, platforms and exhibition outcome.
2. **Challenge:** current reporting-flow artifact and a concise communication-continuity opportunity.
3. **Research:** eight interviews (six renters, two landlords), three evidenced insights connected to design principles.
4. **Low-fi exploration:** recognizable original sketches, one leading sheet and two supporting groups.
5. **Design evolution:** Home, reporting, capture and tracking; exact sketch details and authentic Mid-fi/Hi-fi exports.
6. **Final solution:** four feature stories covering interpretation, contextual capture/recovery, follow-up and PM workflow.
7. **Hi-fi prototype evaluation:** SUS 91.7/100, mean adapted task ease 4.30/5, six participants, five tasks and an accessible HTML bar chart.
8. **Iteration / development:** three correctly qualified comparisons, followed by the bounded AI and technical implementation overview.
9. **Reflection:** evidence relevance, two-sided service continuity, implementation learning and future evaluation.

Task-ease chart values, in the original task order: **5.00, 4.67, 3.67, 4.33, 3.83**. Scores belong to the Hi-fi formative study, not the deployed product. PM tasks were role-played; there was no formal deployed-product retest.

Prototype flow: **FX17 → FX37 → FX38 → FX39 → danger FX40 OR safe FX41**. The branches are explicitly separate. Timeline and editing controls are not portrayed as newly invented after evaluation. The PM comparison retains the warning that approval remains visually primary and bias was not demonstrated to be eliminated.

## Asset provenance and privacy

Only publication-cleared derivatives from `E:\UX project\portfolio draft\final-assets` were used.

- 28 native lossless WebP derivatives and three exact sketch crops: **31 files, 5,709,962 bytes**.
- Source and destination SHA256, width, height, alpha and Ready status were independently verified.
- Source manifest SHA256: `d98012209d7471d5f91ef405025645d046658cdc2d63e37701bab710c6fecaf1`.
- Publication checklist SHA256: `bcb0e27ad230d3e78f555ed9ec3bc4b87c86370d65c7ab0f2b714fd5d019a56b`.
- Native derivative filenames use `fxNN-` prefixes. Pixel dimensions and alpha were preserved.
- Sketch details were cropped only from approved prepared PNG derivatives, without redrawing or scaling: FX10 Home (0, 0, 405, 610); FX10 capture (0, 610, 405, 1234); FX09 tracking (415, 590, 810, 1164). The full cleared sheets remain available in the page's sketch gallery.
- FX03's rounded presentation mask is disclosed; the separate unmasked tenant Home is used in the solution/comparison.
- Implemented captures use isolated fictional local demonstration fixtures. They are not production records or evidence of a fresh hosted-backend/model test.
- Existing redactions remain intact. No recreated report images or PV review boards were copied.
- **Held FX23 and FX24** (photographic capture rights) and **FX34** (enabled-state recapture needed) are excluded from all code, public files and screenshots.
- Every copied map key is used; there are no extra files in this page's public asset folder.
- Source files and manifest/checklist hashes remained unchanged during preparation.

The complete source paths and per-file operations are recorded in `docs/fixlens-assets.json`. Source path references are traceability metadata, not bundled raw source documents.

## Interactions and accessibility

- All narrative and image links are server-rendered.
- Image anchors link directly to the displayed file as a no-JavaScript fallback. Normal clicks/Enter progressively open a native modal dialog.
- Lightbox supports a labelled Close button, native Escape, backdrop dismissal, focus on entry and restored focus on exit. Background scrolling is locked and restored.
- Tall screens remain at readable/native width and scroll vertically; the header stays available while scrolling. Small original detail crops are not artificially enlarged inline.
- The reporting gallery has labelled 44px controls, native horizontal scrolling, scroll snap, a keyboard-focusable region and Left/Right key browsing. Important content does not depend on hover.
- Reveals use a small 14px translation and fade. Content starts visible in server HTML. The animation class is applied only after observer setup.
- CSS and JavaScript respect prefers-reduced-motion, including preference changes. Gallery scrolling becomes immediate under reduced motion.
- Alt text describes the evidence rather than repeating filenames. The task chart uses real text, labels and values; bars are decorative.
- The existing skip link and main landmark remain functional. One h1 and ordered section headings are used.

## Responsive behavior

The desktop uses a maximum 1280px editorial container with comfortable text widths, paired phone screens and alternating feature compositions. At tablet widths the three-stage evolution comparisons stack into labelled rows with 280px screenshots. On small screens, paired solution screens and prototype/product comparisons stack vertically, the contents navigation wraps, and the six-state reporting story keeps native horizontal browsing.

Browser-verified viewport widths and document widths:

| Viewport | Height used | Document client / scroll width | Horizontal page overflow |
| --- | --- | --- | --- |
| 1440 | 1000 | 1425 / 1425 | None |
| 1024 | 1000 (also 900) | 1009 / 1009 | None |
| 768 | 1000 (also 900) | 753 / 753 | None |
| 390 | 844 (also 900) | 375 / 375 | None |
| 375 | 1000 (also 900) | 360 / 360 | None |

The 15px difference is the browser scrollbar. The horizontal gallery scrolls inside its own region. Mobile controls and the modal were exercised at 390px. These are desktop browser viewport checks, not physical-device or touch-hardware tests.

## Performance

- Static prerendered route; only interactive primitives are client components.
- No new animation library, charting library, UI framework or 3D canvas.
- Already optimized lossless WebP derivatives are served directly through next/image with explicit dimensions; offscreen images are lazy-loaded.
- Only two hero layers are preloaded. Reused images share URLs and browser caching.
- The hero has an explicit aspect ratio; regular images carry source width/height to reserve their layout.
- Original PNG masters, research files and preview boards are not served.
- Screenshots are documentation artifacts under docs, outside public.

## Validation results

| Check | Result |
| --- | --- |
| npm run typecheck | Passed: Next route generation and TypeScript |
| npm run build | Passed after final layout refinements; all routes prerendered |
| npm run check:interactions | Passed existing backpack and trash checks |
| npm run check:model | Passed; 205 GLB nodes, unchanged model SHA256 5271ed53d9c40f128da6b888fdf4a04ab5e50ff4c217a7c5bdb0fcf80dc535b1 |
| Lint | No lint script/configuration in the existing project; not run |
| Asset verification | All 31 hashes/dimensions/alpha/status records passed, no held/extra files |
| Browser route / Projects link | Passed both directions |
| Desktop / tablet / mobile layout | Passed the five widths above |
| Modal | Enter, Close, Escape, backdrop, entry focus and focus restoration passed |
| Gallery | Previous/Next state and movement; keyboard Right and mobile viewport browsing passed |
| Full-page pass | Scrolled through the page; all five reveal targets revealed, all images loaded, none broken |
| Case-study console | No warnings or errors during dedicated case-study checks |
| Homepage regression | Canvas ready; backpack expanded with all six skill/interest labels; Projects navigation returned correctly |
| Server HTML | All nine content sections, 35 image fallback links, no hidden-reveal class in SSR |
| Whitespace | git diff --check passed before commit |

The final production build was tested locally on port 3010. It is not a public deployment. The homepage emitted existing dependency deprecation warnings about THREE.Clock and physics initialization parameters; no runtime errors were observed. Existing interaction checks also emit Node's existing module-type advisory.

**Validation boundaries:** Reduced-motion behavior was verified by CSS/JavaScript source inspection; the browser API did not expose media emulation. No-JavaScript readiness was verified through server HTML and fallback/source inspection, not a browser session with scripting disabled. No automated accessibility scanner, quantitative CLS/Lighthouse run, physical-camera test or real-device touch test was performed. Screenshots and manual keyboard/semantic checks support the observations above without replacing those additional audits.

## Screenshots

All paths are relative to `E:\Personal Website\docs\screenshots\phase-3a`:

| Screenshot | View |
| --- | --- |
| 01-hero-desktop.jpg | Final layered hero |
| 02-research-desktop.jpg | Research insights and design principles |
| 03-exploration-desktop.jpg | Original sketch exploration |
| 04-evolution-desktop.jpg | Home evolution |
| 05-solution-desktop.jpg | Final solution and first feature story |
| 06-evaluation-desktop.jpg | Prototype metrics and task-ease chart |
| 07-iteration-desktop.jpg | Prototype-to-product comparison |
| 08-mobile-390.jpg | Mobile hero and shared navigation |
| 09-full-desktop.jpg | Full desktop page after scrolling through all reveals and images |
| 10-projects-desktop.jpg | Linked Projects preview |
| 11-homepage-regression.jpg | Existing backpack interaction |
| responsive-1024.jpg / responsive-768.jpg / responsive-375.jpg | Additional breakpoint captures |

## Local preview

A production preview was left running at **http://127.0.0.1:3010/projects/fixlens**.

To restart it from PowerShell:

```powershell
Set-Location -LiteralPath 'E:\Personal Website'
npm run build
npm run start -- --port 3010
```

For development, use `npm run dev -- --port 3010` instead of the production start command. Stop a process already using that port before restarting.

## Remaining limitations and publication blockers

- Held photographic Hi-fi capture visuals can be considered after rights clearance; they are optional and currently excluded.
- A new enabled-state written-response capture can replace the held FX34 later; approved response/history evidence supports the current story.
- No new product evaluation was conducted. The case study does not claim improved deployed-product usability, eliminated decision bias, complete video/AR, autonomous maintenance diagnosis or a complete PM inbox/contact integration.
- A Live Product link was optional and has not been added; current hosted availability was not re-verified for this implementation.
- No public deployment was initiated.

## Git handling

Work is on the existing `main` branch and origin `https://github.com/ruizheLai/personal-website.git`, preserving its history. The authenticated local Windows Git connection was verified with ls-remote; the separate GitHub connector did not have access to this private repository.

The pre-existing local `next-env.d.ts` modification (development-generated type paths) was backed up before checks and restored byte-for-byte after validation. It is excluded from the case-study commit. No other unrelated changes are included.
