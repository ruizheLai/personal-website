# Phase 3B.1 — Local visual & interaction review

5 November 2026 · `codex/fixlens-phase-3b-visual-review`

**Local review only. Nothing pushed, merged or deployed.** Work is confined to `E:\Personal Website`; original FixLens application/research assets and the old C: project are untouched. The previous review remains in commit `dbbe129`; stable `main` is preserved.

## Preview

[Open the local production preview](http://127.0.0.1:3010/projects/fixlens).

If the review process has stopped, run from `E:\Personal Website`:

```powershell
npm run build
npm run start -- --port 3010
```

## What changed

- All nine sections now share a pure white canvas, consistent typography, spacing, blue accents and fading elliptical environments. The layered tenant/PM Hero remains; role, dates and exhibition scope are integrated into the introduction. The live application is a quiet text link.
- An unframed image viewer expands from the actual source position and returns using FLIP-style rotation, translation and uniform scale. It preserves aspect ratio, independent corner radii, transparency and the safe CSS mask. Escape, outside click, Tab/Shift+Tab containment and focus restoration work; resize and interrupted transitions settle safely.
- A purpose-built HTML/SVG Challenge illustration connects unclear descriptions, fragmented evidence/communication and uncertain responsibility. It introduces no new research claims.
- Three authentic sketch excerpts form one curated composition. Original sheets remain in an expandable area. The Home Mid-fi/Hi-fi reveal replaces the dark workspace and nested selectors; tracking remains a separate two-screen comparison, stacked on mobile.
- Four solution stories retain their genuine screens with larger UI, lighter framing and soft blue environments. Repeated copy/captions are reduced; necessary qualifications remain in native expandable notes.
- Evaluation counts and bars animate once on entry over 780ms, with static accessible final values. The verified values remain **91.7 SUS**, **4.30/5** mean adapted ease, **6 participants / 5 tasks**, and task means **5.00 / 4.67 / 3.67 / 4.33 / 3.83**.
- Iteration cleanup is CSS-only: transparent surroundings, source-matched corners and a 7.362% left mask on FX18 to hide its 24px grey gutter. No interface fields are removed. The viewer carries the same mask.

## Validation

| Check | Result |
| --- | --- |
| 1440 / 1024 / 768 / 390 / 375px | All nine sections retained; no horizontal overflow in settled layouts. Tablet/mobile ambient overflow and a mobile caption overlap were corrected. |
| Image zoom | Mouse and Enter open; Escape/outside close; Tab and Shift+Tab stay in viewer; focus returns; body scroll and source visibility restore. Desktop/mobile images fit inside the viewport. Safe crop and resizing while open checked. |
| Comparison slider | 50% default; native drag tested at desktop and 390px; keyboard Home/Arrow keys checked. At 25/50/75%, both image rectangles remain identical and stationary; only the mask changes. |
| Gallery & navigation | Reporting gallery arrows and keyboard scroll checked. Homepage → Projects → FixLens route verified. |
| Evaluation | Intermediate count values observed on entry, then exact final values/bar widths. Results remain final on revisit. |
| Build / regressions | `npm run typecheck`, `npm run build`, `npm run check:interactions`, `npm run check:model` pass. No dependencies added. |
| Assets & evidence | All 31 published image hashes unchanged; no new source imagery or raw participant material. Visible assets loaded successfully. Required prototype/product, fixture and no-retest limitations remain accessible. |

The existing homepage emits its Three.js clock and physics-initialization deprecation warnings. No case-study browser errors were observed. The model audit preserves the 205-node, 2,163,588-byte workspace GLB.

### Verification limits

- The available browser control exposes viewport sizing and mouse/keyboard input, not true touch or media-preference emulation. Native range dragging was tested at mobile width; physical touchscreen behavior and an actual reduced-motion preference switch remain manual checks. Reduced-motion branches and CSS fallbacks were reviewed: motion settles immediately and final content remains readable.
- No controlled Lighthouse/LCP baseline comparison was performed. Existing image binaries are unchanged, lazy loading remains, optional sheets/flows are collapsed, no dependencies were added, and the production preview remained responsive during testing.
- Hero perspective is approximated as 2D rotation/uniform scale during expansion to preserve screenshot proportions.

## Captures

All images are in `docs/screenshots/phase-3b1/`.

| Area | Capture |
| --- | --- |
| Hero | [Desktop](screenshots/phase-3b1/hero-desktop.jpg) |
| Challenge | [Desktop](screenshots/phase-3b1/challenge-desktop.jpg) · [390px](screenshots/phase-3b1/mobile-390-challenge.jpg) |
| Curated sketches | [Desktop](screenshots/phase-3b1/sketches-desktop.jpg) · [390px](screenshots/phase-3b1/mobile-390-sketches.jpg) |
| Mid-fi/Hi-fi | [25%](screenshots/phase-3b1/slider-25-desktop.jpg) · [50%](screenshots/phase-3b1/slider-50-desktop.jpg) · [75%](screenshots/phase-3b1/slider-75-desktop.jpg) · [390px](screenshots/phase-3b1/mobile-390-evolution.jpg) |
| Final solution | [All four stories](screenshots/phase-3b1/solution-desktop.jpg) · [Reporting](screenshots/phase-3b1/solution-guided-desktop.jpg) · [Recovery](screenshots/phase-3b1/solution-recovery-desktop.jpg) · [Follow-up](screenshots/phase-3b1/solution-followup-desktop.jpg) · [PM](screenshots/phase-3b1/solution-manager-desktop.jpg) |
| Evaluation | [Desktop](screenshots/phase-3b1/evaluation-desktop.jpg) · [390px](screenshots/phase-3b1/mobile-390-evaluation.jpg) |
| Iteration | [Desktop](screenshots/phase-3b1/iteration-desktop.jpg) |
| Image zoom | [Desktop](screenshots/phase-3b1/natural-zoom-desktop.jpg) · [Mobile detail](screenshots/phase-3b1/natural-zoom-mobile.jpg) |
| Responsive Hero | [1024px](screenshots/phase-3b1/layout-1024.jpg) · [768px](screenshots/phase-3b1/layout-768.jpg) · [390px](screenshots/phase-3b1/mobile-390-hero.jpg) · [375px](screenshots/phase-3b1/mobile-375-hero.jpg) |
| Full page | [Desktop](screenshots/phase-3b1/full-desktop.jpg) · [390px](screenshots/phase-3b1/full-mobile-390.jpg) · [375px](screenshots/phase-3b1/full-mobile-375.jpg) |

Supporting geometry and hash checks: [phase-3b1-validation.json](phase-3b1-validation.json).

The pre-existing `next-env.d.ts` change is preserved byte-for-byte and excluded from the review commit. Visual approval and the manual device/preference checks above are the remaining review steps.
