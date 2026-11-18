# Sippy Phase 4B.6 review

## Branch and deployment

- Base: `origin/codex/sippy-phase-4b5-storytelling` at `0c665b8c69e6ed6ba956192c65eb0b6a64b50a8b`.
- Fetch confirmed the remote approved branch had not advanced beyond that commit. The existing checkout was clean before creating the new branch.
- Review branch: `codex/sippy-phase-4b6-visual-polish`.
- Implementation commit: `2b7e83e0310c758100c77cc0cc279d68dfe06343`.
- Vercel Preview and verification: [verified implementation Preview](https://personal-website-drdtbjp0p-brad-s-team2.vercel.app/projects/sippy). Vercel deployment `Htx5H5FZi5cTfLLWNwbrDvMKVEC6` is Ready, Environment Preview, source branch and implementation SHA verified in the dashboard. The deployed page hydrates both centred story tracks, contains the new software section and seven hardware nodes, and switches to Cup interaction and Making stage 1 through browser scroll. The final review/evidence commit also adds a scene-boundary clipping guard, so translated photography cannot extend beyond its opaque layer. The branch Preview is rechecked after that commit..
- No main merge, production deployment, force push or reset of another worktree. The existing main reference is `e5c8163`.

## What changed

The approved forest green, warm cream, serif headlines, source-based hardware and photographic identity remain. The journey is now Meet Sippy → Look Inside → See It in Action → Behind the Response → From Idea to Companion → Evaluation → Reflection.

### Hero and Construction

The approach and settling sequence, shell separation, cup-free disassembly, genuine Structure Only assembly and seven shared hardware nodes remain. Roomy desktop viewports give the central mechanism and selected individual parts greater presence. Horizontal positions use viewport-relative anchors with a capped spread; individual asset sizing is adjusted rather than enlarging the entire scene. Narrower layouts retain the established arrangement. Sensing and amplifier remain separated, and the same seven DOM elements travel into their measured Construction destinations and reverse back.

Construction's Control copy now describes the physical controller briefly. The fuller software path lives in its own section. The source distinction between the report's HX711 and the representative photograph marked HX710 remains unchanged. Evaluation statistics, SippyResults and Reflection are unchanged from Phase 4B.5.

### Action: a centred film composition

One video remains, with three authentic edited source excerpts. On desktop, the complete media/text composition sticks within available viewport space, measured from the actual header and viewport height. The active description and film stage share a vertical centre. The 16:10 crops and media files are unchanged; there is no added tall letterbox.

Native document scroll continuously moves a clipped editorial text track. The active chapter is crisp and dominant at its centre. Adjacent chapters expose approximately 16% of their content, at reduced opacity, light blur and scale, with gradient masking. Per-paragraph measurements prevent shorter chapters disappearing entirely from the neighbouring hint. Intermediate positions and reverse scrolling are supported without wheel interception, snapping or chapter navigation controls. Chapter-based source switching remains at the chapter midpoint.

Playback remains muted and inline. Pause persists between chapters, offscreen media pauses, blocked autoplay exposes Play clip, and the control works with a keyboard. The software explanation has been removed from this section.

### Behind the Response

Two complementary panels use large HTML labels rather than a dense SVG network:

1. Gesture to movement: Camera → MediaPipe + Python → Bleak / BLE → ESP32 / Arduino C++ → motor driver and motors.
2. Cup state: load cell / documented amplifier → ESP32 → BLE / Python. CUP_ON enables gesture control; CUP_OFF disables it and Python coordinates Unity's drink animation until the cup returns.

The project report's software and electronics description (extracted report pages 2–3) supports this summary. The connection and node dots gain restrained scroll-linked emphasis; the explanatory text stays readable throughout. Reduced motion and no JavaScript show the complete static explanation. This is a reported architecture, not telemetry, protocol documentation or measured latency. The concise source note distinguishes the team's 10-second demo interval from a validated everyday reminder schedule.

### Making: five photographic scenes

The five approved stages remain in semantic order, centred with their current copy on desktop. Its restrained image reveal and photographic compositions differ from Action's moving text track. Previous and next stage names provide faint continuity without adding a chapter-navigation interface. The active copy receives a short opacity transition; image layers reveal the next composition through native scroll progress, with small shifts in position and scale. This avoids ghosting two full photographs over one another.

- Exploration: enlarged, overlapping authentic sketch papers with subtle depth.
- Physical prototyping: a large open grey shell, with a smaller grey prototype detail.
- Fabrication and assembly: principal load-cell/chassis integration photograph plus a smaller fur-making detail.
- Testing and iteration: controlled bench photograph alongside the authentic camera-preview still.
- Final showcase: a crop of the accepted photograph gives plush Sippy the main visual area; the wider scene is a small context image.

The new `showcase-focus.webp` is a 390 × 380 crop of the already permitted `showcase.webp`, with no generation, enlargement or alteration to the original. The crop box, source hash and permission continuity are recorded in `docs/sippy-phase-4b6-asset-update.json`. No dated chronology is inferred from WhatsApp import timestamps, and photographed tests are not presented as proof that an issue was resolved.

## Responsive, accessibility and performance

At 900px and below, Action uses the existing single sticky film with natural-flow descriptions; Making presents complete image/copy stages vertically. The architecture becomes a large vertical path, followed by the two readable cup states. No desktop clipping or blur is applied to the mobile paragraphs.

Reduced motion removes the centred scroll tracks, restores complete inline process imagery and native video controls, pauses autoplay, and presents the full static software path. Without JavaScript, three explicit video links, native controls and all five inline process stages remain available. Hidden enhanced-mode links do not remain keyboard focus targets. Duplicate desktop photograph layers are hidden from assistive technology when inactive, while the complete semantic chapter copy remains in document order.

The implementation reuses native rAF and existing dependencies. No new library, generated imagery or extra video player is added. Scroll handlers schedule one frame, and listeners, observers and pending frames are cleaned up on unmount. Images stay lazy-loaded except the existing principal hero asset. Pixel quality remains limited by the authentic source material; the focus crop is not enlarged beyond its 390px source width. No claim is made about performance on a physical low-powered device.

## Validation

Production build and TypeScript validation passed. `npm run check:interactions` passed the existing homepage/backpack and trash interaction checks. `git diff --check` passed.

Chrome production-build review covered:

| Viewport | Result |
| --- | --- |
| 1440 × 900 | Centred Action/Making, all chapter reversals, hero and handoff pass |
| 1024 × 768 | Centred desktop stories and hero bounds pass |
| 768 × 1024 | Natural-flow tablet layout and all stages pass |
| 390 × 844 | Mobile media, text and process imagery pass |
| 375 × 812 | Mobile layout, reduced motion and autoplay denial pass |
| 1920 × 1080 | Expanded hero remains within bounds; photographic transition reviewed |
| 414 × 896, 320 × 812 | Narrow-layout overflow and hardware bounds pass |

Across the five required sizes: seven shared nodes, no cup in disassembly, intact central mechanism before separation, no component/label collisions, no clipped hero parts or horizontal overflow, stable forward/reverse state, and destination landing error below 0.001 CSS px. Action chapter sequence 0→1→2→1→0 and Making sequence 0→1→2→3→4→2→0 pass. One muted video remains, manual Pause persists, and offscreen video pauses. Supplemental keyboard Space playback, desktop reduced-motion and desktop no-script checks pass. No browser runtime exceptions were observed.

Client navigation cleanup, re-entry to Sippy, FixLens, Projects, About, Contact and the GLB homepage pass; the homepage model returns HTTP 200. The source-integrity receipt verifies all 41 original project files are byte-identical to the Phase 4B.5 snapshot. Only the documented new crop is added to public media.

The targeted Finesse detector reports zero P0 findings. Its remaining P2 findings are black alpha-mask stops (not visible page colours) and CSS-stamp checks on TSX files; the CSS carries the build stamp. The broader previous-phase template checker findings remain outside this identity-preserving refinement, as documented in the Phase 4B.5 review. No unrelated CTAs, grain overlays or restyling were introduced to satisfy generic template rules.

Evidence: [desktop overview](screenshots/sippy-phase-4b6/DESKTOP_REVIEW.png), [mobile overview](screenshots/sippy-phase-4b6/MOBILE_REVIEW.png), [forward/reverse walkthrough](screenshots/sippy-phase-4b6/SIPPY_STORY_FORWARD_REVERSE.mp4). Individual captures and machine-readable `BROWSER_QA.json`, `SUPPLEMENTAL_QA.json`, `REGRESSION_QA.json` and `SOURCE_INTEGRITY.json` are in the same directory. The walkthrough is 280 actual Chrome screenshots at 10fps, forward then reverse, captured from implementation commit `2b7e83e` before the final scene-boundary clipping guard. The individual screenshots and five-size browser checks were refreshed after that guard. The recording is review evidence rather than a device-performance benchmark.

Reproduce against a running production server with `SIPPY_TEST_URL` if using another port:

```text
node scripts/qa-sippy-polish.mjs --record
node scripts/qa-sippy-polish-fallbacks.mjs
node scripts/qa-sippy-polish-routes.mjs
```

## Remaining limitations

- Authentic footage and process photographs retain their original recording quality. The final-showcase crop cannot reveal additional photographic detail.
- Software paths are a report-supported conceptual summary. Exact gesture mappings, command payloads, thresholds, wiring and response latency are not verified or invented.
- This pass does not establish everyday reminder effectiveness or resolve the reported sensing, movement and cup-stability limitations; Evaluation and Reflection retain their original evidence and qualifications.
- The existing Next.js 16.4.3 build emitted a security advisory and stopped once; retry completed the build. A framework security upgrade is recommended separately. No dependency or lockfile was changed in this visual-polish branch. Existing Node module-type warnings in the homepage interaction checks also remain.
