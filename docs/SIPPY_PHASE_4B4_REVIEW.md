# Sippy Phase 4B.4 case study

Implemented 15 November 2026 on `codex/sippy-phase-4b4-case-study`, based on `origin/main` at `e5c8163e6579a7b76a6547deaf52a18582cec1f7` (approved FixLens Phase 3D.1 production release). A managed worktree isolates this work; the original main checkout and its untracked `.taste-skill/` folder were left intact.

## Page structure and integration

`/projects/sippy` is a native Next.js App Router page, not an iframe. It uses the existing header, skip link, routing and React conventions. Only the Sippy card changes at `/projects`. FixLens, About, Contact, workspace components, global CSS, GLB assets and dependencies are unchanged.

1. **Meet Sippy:** forest-green desktop, original plush visual and upright cup; gentle approach, finite settling sway, vertical shell opening, intact mechanism, sequential component separation.
2. **How a Small Companion Was Built:** the same seven component elements travel into five functional explanations: Sensing, Control, Power, Motorised Movement and Construction. A concise statement credits the team project and the user's major contribution.
3. **See Sippy in Action:** three controlled, silent excerpts from the original project video. No video autoplays or starts audio.
4. **From Idea to Companion:** Coffee Time exploration, a cup-holder sketch, grey physical prototype and authentic plush exhibition still. Coffee Time is described as an early direction, not a working prototype or an invented dated sequence.
5. **Did People Notice?:** verified 20-response showcase findings, restrained counters and labelled aggregate charts, with limits beside the evidence.
6. **When Distraction Becomes Care:** timing, user control, technical reliability and long-term acceptance; natural navigation back to Projects.

The warm cream/green editorial layout differs from FixLens's blue digital-product direction. Styling is scoped beneath `.sp-page`, with a conditional header colour only while the Sippy page exists. There are no global CSS edits. The only additional motion outside the hero is the brief evaluation count-up; substantive figures are rendered as their final values on the server and remain accessible without animation.

## Structure Only and cup

Mandatory source: **`E:\portfolio source\sippy\structure only.png`**, located case-insensitively in the actual source folder. It is RGBA, 1920×1080, with alpha range 0–255 and content bounds `[574,67,1436,1014]`.

`public/images/sippy/structure-only.webp` uses that genuine source. Only completely transparent exterior canvas is trimmed; its existing object alpha and structural detail are preserved. There is no new hand-drawn mask, composite reconstruction or missing part crop. The old Phase 4B.3 `central-assembly.webp` is neither copied nor referenced.

Upper and lower shells and the intact plush are byte-identical copies of the accepted Phase 4B.3 presentation assets. A separate source-derived white cup supports the controlled viewpoint match during shell opening and the intact-core hold. It remains upright and follows the cup holder's general position; it fades with the intact assembly before the conceptual component layout. This is explanatory layered imagery, not a mechanically exact simulation. Neither the genuine complete assembly nor the shell photographs has been rebuilt as 3D geometry.

## Component source mapping

The full machine-readable mapping is [sippy-asset-provenance.json](sippy-asset-provenance.json), including source filenames, original paths, source hashes where available, transformations, model uncertainty and permission status. Optimized runtime media lives under `public/images/sippy/`.

| Runtime asset | Source and interpretation |
|---|---|
| `plush.webp`, `upper-shell.webp`, `lower-shell.webp` | Accepted Phase 4B.3 assets, unchanged. Plush originates in the original project's front-view presentation graphic at approximately 02:30; shell layers retain the earlier original-project provenance. |
| `structure-only.webp` | Genuine `structure only.png`; full complete object with original transparency, only empty exterior trimmed. |
| `cup.webp` | Cup isolated from the accepted plush presentation asset; source-based cutout, not a newly invented feature. |
| `load-cell.webp` | Retained Core Electronics CE08423 catalogue reference; beam form representative, installed capacity/maker unverified. |
| `adc.webp` | Retained Makerverse amplifier catalogue reference, photographed marking HX710; neutral visual label. |
| `esp32.webp` | Retained Kattni Rembor / Adafruit Feather ESP32 V2 catalogue reference, CC BY-SA 3.0, background removed. Installed revision remains unconfirmed. |
| `motor-driver.webp` | Retained Makerverse two-channel driver family reference. Exact installed revision remains unconfirmed. |
| `battery-pack.webp` | `ChatGPT Image Nov 15, 2026, 07_41_25 PM-1.png`: three blue cells installed in their holder, kept as one visual. |
| `chassis.webp` | `ChatGPT Image Nov 15, 2026, 07_41_26 PM-2.png`: supplied circular, Pololu-marked plate. Source-based/reconstructed illustration; exact cut pattern/model not verified. No logo or marking removed. |
| `motor.webp` | `ChatGPT Image Nov 15, 2026, 07_41_27 PM-3.png`: supplied gearmotor; ratio, dimensions and exact installed model unverified. |
| `lipo.webp` | `ChatGPT Image Nov 15, 2026, 07_41_28 PM-4.png`: supplied LiPo illustration. Printed ratings are not transferred to the system description. |
| `caster.webp` | `ChatGPT Image Nov 15, 2026, 07_41_29 PM-5.png`: supplied caster; exact material/diameter unverified. |
| `wheel.webp` | `ChatGPT Image Nov 15, 2026, 07_41_33 PM-6.png`: supplied wheel; exact diameter/model unverified. |
| `coffee-time.webp` | `coffee time.png`, original individual idea exploration. |
| `cup-sketch.webp` | `sketch 1.png`, original mechanical cup-holder sketch. |
| `grey-prototype.webp` | `shell.png`, authentic grey-shell product image, full source frame. |
| `exhibition.webp` | Face-free cropped still from the authentic movement excerpt, not a generated final-product photograph. |
| `project-cover.jpg` | Accepted plush presentation asset composed on green with a title for social sharing. |

The six newly supplied files were inspected by content, not inferred from generic filenames. They are documented as user-supplied reconstructed/source-based component visuals; no claim is made that they are untouched photographs of the installed hardware. No old power, drive or chassis schematic SVG is copied or used. The movement visuals are grouped for explanation without inventing an exact assembled gearbox/wheel configuration.

Original online references retained:

- [Controller photograph and asset-specific licence](https://learn.adafruit.com/assets/117185), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).
- [Makerverse amplifier](https://core-electronics.com.au/makerverse-load-cell-amplifier.html).
- [Makerverse two-channel motor driver](https://core-electronics.com.au/makerverse-motor-driver-2-channel.html).
- [Representative beam load cell](https://core-electronics.com.au/load-cell-3kg.html).

## HX711 / HX710 decision

Supporting engineering copy follows the formal report: **HX711 Load Cell Amplifier**. The animated functional label is **Load Cell Amplifier**. The source photograph visibly reads HX710 and is retained as a representative amplifier reference, not called a verified HX711 photograph. Markings are not altered. A short footer source note and the manifest preserve that distinction without turning the main narrative into a model investigation.

## Timeline and shared components

The approved native-scroll progression is adapted into a cleanup-safe React effect. Scroll and resize events batch one `requestAnimationFrame`; there is no wheel interception, direction-state machine, autoplay timeline or reset animation.

| Hero progress | Behaviour |
|---|---|
| 0–.06 | Establish farther away. |
| .06–.22 | Gentle approach, cup upright, no rotation. |
| .22–.30 | Finite scroll-encoded settling sway, not an endless timer loop. |
| .30–.345 | Controlled front-view to structural-image appearance match. |
| .34–.43 | Shells separate vertically; their X coordinates stay constant. |
| .43–.52 | Genuine complete assembly holds intact with cup. No detached components visible. |
| .52–.57 | Intact mechanism/cup lose emphasis before independent references emerge. |
| .57–.92 | Sensing, amplifier, controller, power, driver, motor/wheel/caster group, then chassis separate in overlapping small bands. |
| .92–1 | Readable complete exploded hold; no forward reassembly. |
| Handoff h0–1 | Same seven nodes travel to their measured Construction targets as the sticky hero releases. |

Every component stays in its semantic Construction article in the React DOM. Enhancement changes its rendered position with fixed transforms; there is no DOM reparenting or image cloning. Source and target centres are measured in document coordinates, interpolated, then converted to viewport coordinates. Uniform scale preserves proportions. At arrival, the elements follow the real slot rectangles as the reader continues scrolling. Text appears after the moving graphics clear the Construction heading. Resizing remeasures targets.

The hero is 3.2 viewports desktop / 3 mobile; the handoff adds about one viewport in normal flow. Portrait composition uses shorter paths and separately arranged parts. On reduced motion the hero becomes one static viewport and all components align directly with native destinations. With JavaScript disabled, the same media already sits in the five normal-flow articles. No substantive story or result depends on reaching an animation trigger.

## Demonstration footage and evaluation accuracy

All clips come from `Group N64 - INFO90003.mp4`. They are silent H.264 MP4s with fast-start metadata, native controls and `preload="none"`.

| Clip | Source window | Crop |
|---|---|---|
| Gesture | 120.15–122.85s | 1740×580 from x200/y470, downscaled to 960×320. |
| Movement | 136.2–143.2s | Tight product crop, 800×600 from x1090/y380. |
| Cup handling | 128.0–130.8s | 1020×540 from x850/y500, downscaled to 960×508. |

Fixed crops exclude faces throughout the selected excerpts; hands, clothing and equipment remain. The cup excerpt starts with the cup already off the holder and includes subsequent handling. It is not described as one uninterrupted lift/drink/return cycle. No narration or identifiable participant portrait is carried into these clips.

The report's 20-response aggregate findings are used as reported: 65% physical versus 35% screen preference, and 90% giving movement a 4/5 or 5/5 noticeability rating. The chart distribution is 0, 0, 2, 7, 11 across scores 1–5. Counts 13 and 18 follow directly from the percentages and sample size. No raw questionnaire file was supplied. Nine team-marked functional checks are distinguished from independently measured reliability. No hydration, health, long-term habit or causal benefit is asserted.

## Publication permissions

The previous audit recorded unresolved team/media and Core Electronics photo permissions. During this phase the user was explicitly asked about all Sippy team imagery/video, the six supplied images and the Core catalogue references, and replied **“all permitted”**. This implementation relies on that user confirmation. It does not claim an independently inspected new written vendor licence or participant-release document. Adafruit's existing CC BY-SA 3.0 attribution and modification notice remain visible in the page footer and manifest. Hardware repository licensing is not used as a substitute for catalogue-photo permission.

No participant faces are included in selected crops, even with the user's permission confirmation. Model uncertainty remains distinct from publication permission. All original source files remain unchanged; preservation checks and hashes are recorded in `sippy-validation.json`.

## Validation and review artifacts

Final results are recorded in `sippy-validation.json` and `screenshots/sippy-phase-4b4/BROWSER_QA.json`. The browser script is `scripts/qa-sippy.mjs`. Desktop/mobile captures and `SIPPY_FORWARD_REVERSE.mp4` are stored alongside that report. The demonstration is actual headless-Chrome browser capture after native scroll events, not an animation video embedded in the implementation.

TypeScript, production build, existing workspace interaction checks, five-width browser checks, reduced-motion/static fallbacks, image decoding, source preservation and the restricted file-change scope are verified before the review-branch push. General design checker findings are recorded separately with their scope limitations; they are not substituted for interaction testing or claimed as a clean pass.

## Local review

From the managed worktree, install existing locked dependencies with `npm ci` if needed, then:

```powershell
npm run build
npm run start -- --port 3104
```

Visit `http://127.0.0.1:3104/projects/sippy` and `/projects`. Development mode is also available with `npm run dev -- --port 3104`. No external service is needed to view the page; runtime media is included and there are no new packages.

For browser QA, run `node scripts/qa-sippy.mjs` from this checkout while the server is running. The script defaults to Windows Chrome and the existing FFmpeg path in the source machine; set `SIPPY_CHROME`, `SIPPY_FFMPEG`, `SIPPY_QA_OUTPUT` and `SIPPY_TEST_URL` for other environments.

## Remaining limits

The hero is an explanatory reconstruction with different source viewpoints, not exact physical disassembly. Supplied component illustrations do not establish exact SKUs, capacities or wiring. The final plush footage comes from an edited showcase film rather than a dedicated clean product shoot or long-term trial. Automated responsive browser emulation is not a substitute for testing on physical touch hardware or with assistive technology. Real-device frame-time performance was not measured. No source files, previous prototype documents, production branch or production deployment are modified.


### Recorded final outcomes

- `npm run typecheck`: passed. Final `npm run build`: passed with all eight routes generated and no build warnings.
- `npm run check:interactions`: both existing workspace checks passed. Existing Node module-type advisory warnings are unchanged.
- All five requested viewport sizes passed: reversible state, paused stability, same seven nodes, intact assembly hold, loaded media, no sampled clipping/overflow, zero arrival error and zero resize-target error.
- Browser navigation from Sippy to Projects and back passed; no runtime exceptions were recorded. Reduced motion composes a one-viewport still with readable content. JavaScript-disabled screenshots show the static hero; native article media remains in the server-rendered DOM.
- The final mobile-only finish hides the optional tiny project metadata line at 390/375px so it cannot touch the opening upper shell. Its separate browser check passed and refreshed mobile hero/reduced/no-script captures. Scroll geometry is unchanged. The 16-second desktop forward/reverse recording remains representative of the final desktop implementation.
- All 31 current source files are unchanged. The complete assembly derivative's alpha exactly matches the original alpha after empty-canvas trimming. Eleven runtime component/structure derivatives have nontrivial transparent alpha channels. The approved plush/shell/controller/sensor/driver inputs are retained; no old central crop or schematic SVG is present.
- The general frontend gate ended with **42 open findings and 27 warnings, not a clean pass**, preserved in `sippy-general-design-gate.json`. Its landing-page criteria conflict with the approved multiviewport pinned hero, minimal product-name title, no hero button, text reflection, source credits and custom section classes. It also objects to editorial column alignment, context-dependent heading sizes and section heights. Contrast findings sample hidden/transitional content or expect 7:1 body contrast; final readable light-section text uses `#52685a` on `#f1ede3`. These findings are disclosed rather than treated as a passed generic gate or used to replace the approved direction.
- The Finesse detector reports one P0 on the CSS file because it cannot see the native `requestAnimationFrame` engine imported in the separate TSX component; that engine is present and browser-tested. Its two missing-stamp notices concern TSX files; the committed stylesheet has the required stamp. Full findings are retained in `sippy-finesse-detector.json`.

The final readable desktop/mobile layouts were visually reviewed in addition to the automated checks. These results are not a claim of comprehensive accessibility certification or hardware reliability.
