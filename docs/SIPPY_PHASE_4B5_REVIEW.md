# Sippy Phase 4B.5 — interaction storytelling

Prepared 16 November 2026 (Australia/Sydney). Branch: `codex/sippy-phase-4b5-storytelling`. Base: latest fetched `origin/codex/sippy-phase-4b4-case-study`, approved commit `a86472e13c7f803abce42093a8b0999d6802c1f7`. The working tree was clean before branching. This phase does not start from main, merge main or deploy to Production.

## Scope and retained design

The forest-green/cream palette, typography, original plush character, approach/settle mathematics, seven shared hardware nodes, measured Construction destinations, Construction copy, project card, evaluation and reflection are retained. No new package or global CSS change is introduced. Changes are scoped to `/projects/sippy`, Sippy components and selected media, plus this phase's documentation/tests.

The narrative remains Meet Sippy → Construction → See Sippy in Action → From Idea to Companion → evaluation → reflection. The two middle sections now explain behaviour and making through scrolling rather than presenting video files and a four-column grid.

## Source review and new assets

The source directory was searched recursively again: **41 files**, versus 31 at Phase 4B.4. There are **nine newly added JPEG photographs and one six-second MP4**, all named WhatsApp imports dated 16 November. No new sketch file was present. Existing authentic Sippy sketches are used alongside the new photographs; import timestamps are not presented as creation dates.

`sippy-phase-4b5-assets.json` records the new-file inventory, source hashes, selected derivatives, exact source/output paths, selection reasons, video ranges and permission confirmation. `screenshots/sippy-phase-4b5/NEW_PROCESS_CONTACT.jpg` covers all nine photographs. `NEW_TEST_VIDEO_CONTACT.jpg` samples the new test video. Original files were not modified.

| Newly supplied source suffix | Content inspected | Use |
|---|---|---|
| `2.26.40 PM (1).jpeg` | Motor, driver and ESP32/breadboard wiring | Testing stage, `process/motor-bench.webp` |
| `2.26.40 PM.jpeg` | Chassis wiring, wheels and controller | Inspected; closer selected integration images avoid repetition |
| `2.26.44 PM (1).jpeg` | Open chassis and controller beside a laptop | Testing stage, `process/bench-test.webp` |
| `2.26.44 PM (2).jpeg` | Open grey shells, cup holder and packed hardware | Physical prototyping, `process/open-shell.webp` |
| `2.26.44 PM.jpeg` | Load cell beside chassis and controller | Assembly, `process/loadcell-integration.webp` |
| `2.26.45 PM (1).jpeg` | Fur covering, scissors and glue gun | Assembly, `process/fur-fabrication.webp` |
| `2.26.45 PM (2).jpeg` | Wider worktable and open-shell view | Inspected; redundant wide composition, not published |
| `2.26.45 PM (3).jpeg` | Final plush prototype and laptop camera interface | Final showcase, `process/showcase.webp` |
| `2.26.45 PM.jpeg` | Exposed structure in a plush-covered shell | Physical prototyping detail, `process/plush-assembly.webp` |
| `Video ... 2.26.43 PM.mp4` | Hand gestures, laptop camera preview with landmarks, wired chassis responding | One cropped still in Testing, `process/gesture-test-still.webp`; low-resolution original video is not enlarged into the main film |

The source-based hardware illustrations/catalogue references from Phase 4B.4 are unchanged. New JPEGs are authentic project process photographs, not product renders. The test detail is a real video still, cropped from 352×624 to 352×474 to exclude the background faces and avoid enlargement. The existing `sketch 4.png` becomes `process/shell-study.webp`. All photo conversion transposes EXIF orientation, scales down only and retains the complete source frame unless an explicit crop is recorded.

## Hero changes

The extra white cup was a standalone `cup.webp` overlay. It has been removed from the opening sequence and DOM. The cup embedded in the original intact plush is still present during approach and settling, then fades with the intact front view during progress .30–.345. Reverse scrolling restores that same source view and cup. There is no separate cup reset or timer.

The genuine `Structure Only` image is unchanged. Its top cylinder is the structural cup holder; it is preserved rather than retouched as though it were an unwanted drinking cup. The central assembly holds intact at .43–.52 before the component reveal. No cropped composite mechanism or rebuilt assembly is introduced.

The desktop arrangement changes from a crowded sensing/amplifier cluster to three clear upper groups and three middle groups, with Structure lower-left. Source coordinates are document-independent world coordinates; Construction destinations still come from current DOM rectangles.

| Group | Desktop world centre / target box |
|---|---|
| Weight Sensing | `[230,240,240,165]` |
| Load Cell Amplifier | `[575,235,175,145]` |
| ESP32 | `[890,245,245,205]` |
| Motor Driver | `[230,505,195,180]` |
| Motorised Movement | `[560,510,260,205]` |
| Power | `[890,525,255,205]` |
| Structure | `[300,735,190,150]` |

Portrait coordinates are composed independently. The lower Structure group is moved to `[350,940,170,140]` and the lower shell uses `[350,1070,180,100]`, leaving room beneath Power/Movement without pushing its label into the shell. Label size remains compensated for screen scale. The same seven React-owned component elements continue through the measured handoff; no destination clones are created.

## One cinematic behaviour stage

`BehaviourStory.tsx` renders **one video element**. Scroll position selects Gesture, Movement or Cup Interaction from measured chapter centres. No per-frame seeking, wheel interception, timed chapter advancement or direction state is used. Changing chapter pauses the old source, assigns the new clip/poster and requests muted inline playback when the stage is sufficiently visible. Only the selected clip plays. Leaving the stage or hiding the document pauses playback; a user's Pause choice persists across chapters.

The native control bar is hidden during the automatic presentation. One small keyboard-accessible Play/Pause button remains. A rejected autoplay promise changes it to “Play clip”. Reduced motion uses native controls and no autoplay or sticky behaviour. Without JavaScript, the first video has native controls and all three chapters include direct excerpt links. There are never three simultaneously visible video players.

The clips are new, consistently framed 16:10 edits of the original `Group N64 - INFO90003.mp4`, not fabricated interactions:

| Runtime clip | Original source range | Operation |
|---|---|---|
| `gesture-story.mp4` | 120.15–122.85s | Crop 1440×900 at x280/y180, downscale to 960×600 |
| `movement-story.mp4` | 136.2–143.2s | Crop 800×500 at x1090/y430, retain native resolution |
| `cup-story.mp4` | 128.0–130.35s | Crop 960×600 at x850/y480, retain native resolution; ends before the next title graphic |

All are silent, 30fps H.264/CRF24 with fast-start metadata and corresponding WebP posters. These are separate edited moments; the cup footage begins with the cup off and includes handling/replacement. It is not claimed to be one uninterrupted lift/drink/return cycle. The old clips remain as prior-phase artifacts but are not referenced by the revised page.

## Software and interaction evidence

The source paper's pp2–3 (Design and Implementation / Technical Evaluation) establish the following relationships. No native Python, Arduino, MediaPipe configuration or Unity project source was supplied; these are report-supported implementation descriptions, supported visually by the new test video, not a fresh code audit.

| Presented relationship | Source support and boundary |
|---|---|
| Camera frames → MediaPipe → Python | The report names MediaPipe gesture recognition and the Python control program; the new test footage shows a camera preview with hand landmarks. No particular pose-to-command map, classifier confidence or threshold is invented. |
| Python/Bleak → BLE → ESP32 | The report explicitly states that Python uses Bleak to connect to ESP32 via Bluetooth and send movement commands. |
| ESP32 Arduino C++ → motor driver / DC motors | Explicitly described in the implementation and supported by bench hardware photographs. No unsupported speed, distance or path-accuracy claim. |
| Load cell / documented HX711 → cup state → control logic | The report describes CUP_ON enabling gestures and CUP_OFF disabling them. The retained HX710-marked photograph remains a representative amplifier visual; the Phase 4B.4 source note is preserved. |
| Python → Unity state animations | The report lists six team animations and specifies the drink animation while the cup is off. The diagram says Unity status and the text explains its role; no fictional monitor notification is added to the hero. |
| Timed return | The technical demonstration used a 10-second interval after stopping. The page identifies this as a demo interval, not a validated daily reminder schedule. |

The compact system path changes emphasis with the chapter. Gesture highlights camera/recognition/communication; Movement highlights controller/driver/physical response; Cup Interaction shows the sensing/status path. It is labelled as reported system flow, not actual telemetry. Text descriptions carry the meaning independently of line colour or motion.

## Making-of storyboard

Desktop uses one sticky visual composition, progressing through five thematic stages. Its active image is selected from the current measured chapter position, so scrolling back restores earlier evidence. The process is approximately 2.5 viewports of normal document content, not a long scroll lock. Mobile removes the sticky image stage and presents large, varied image compositions with each short description in natural vertical order.

1. **Exploration:** original Coffee Time and shell/cup-holder sketches, subtly fanned. Coffee Time is an early direction, not a working robot.
2. **Physical prototyping:** the open grey shell and packed internals, with a source photograph of the cup-holder/structure in the plush base.
3. **Fabrication and assembly:** load-cell/chassis integration and the fur covering on the workbench. These group real making evidence without guessing exact assembly dates.
4. **Testing and iteration:** motor bench wiring, laptop/chassis test setup and the camera-preview still. The copy acknowledges report-supported sensing/movement/cup-stability and crowded-desk gesture limits; no photographed activity is claimed to prove a particular bug was fixed.
5. **Final showcase:** authentic plush Sippy beside its computer interface, reconnecting with the hero's presentation character.

Without JavaScript or with reduced motion, all five image compositions and descriptions remain in normal flow. Reduced motion also removes the sketch rotations and image entrance transitions. Resize/media-query listeners, observers and scheduled animation frames are cleaned up on unmount.

## Validation and artifacts

The final checks and source-preservation records are in `sippy-phase-4b5-validation.json`; browser details are in `screenshots/sippy-phase-4b5/BROWSER_QA.json`. The test script is `scripts/qa-sippy-story.mjs` (add `--record` for the browser demonstration). Screenshots cover the complete explosion, handoff, three video/system-flow chapters and five process stages on desktop/mobile. `SIPPY_STORY_FORWARD_REVERSE.mp4` is scripted native scrolling captured from the actual rendered Chrome browser, not the page's implementation.

Validation includes TypeScript, production build, existing workspace interaction checks, five responsive widths (1440/1024/768/390/375), cup removal/restoration, full reverse state equality, actual DOM landing errors, label/group bounding-box separation, one-video count, muted playback, manual Pause persistence, inactivity pause, simulated autoplay denial, reduced motion and JavaScript-disabled content. Source and protected-file checks verify that original media, evaluation/reflection, the project card, FixLens and the GLB workspace remain unchanged.

The first build hit a cached Turbopack CSS-worker startup failure. The failed generated cache was preserved under ignored `.tools/`; a clean standard Turbopack production build then succeeded. No dependency or configuration change was needed. Existing workspace tests retain their pre-existing Node module-type advisory warning.

## Permissions and remaining gaps

The user explicitly confirmed on 16 November that the earlier “all permitted” statement covers the new WhatsApp photos/video for the branch preview. Existing catalogue attribution and source identity are retained. This records the user's confirmation, not a claim to have independently inspected vendor licences or signed participant-release documents.

No exact gesture thresholds, editable application source, raw technical trial logs, calibration record, dated fabrication sequence or long-term study was supplied. Process images establish making/testing context, not measured reliability or a resolved failure history. The existing 20-response evaluation and its 65%/90% figures remain unchanged. Real touch hardware, assistive technology and real-device frame-time performance are outside the automated browser checks.

For local review: `npm run build`, then `npm run start -- --port 3105`, and open `http://127.0.0.1:3105/projects/sippy`. The new branch is pushed for a Vercel Preview only; no main merge or Production deployment is performed.


### Recorded final results

- TypeScript and the final standard production build passed; all eight routes generated. Existing backpack-layout and trash-physics tests passed.
- All five widths passed: cup removal/restoration, exact sampled reverse state, seven retained nodes, no hero clipping/overflow, no label or component-group bounding-box intersections, and actual DOM landing error below 0.001 CSS pixels.
- Gesture → Movement → Cup → Movement → Gesture selected correctly at every width. The single video played muted without native bars; Pause persisted when changing chapter, and playback paused outside the behaviour stage.
- All five making-of stages selected correctly in both directions on desktop/tablet, and all inline mobile process images loaded without overflow. Autoplay-denial fallback, reduced-motion static presentation and JavaScript-disabled excerpt links/inline images passed.
- Keyboard Tab reached the skip link first. Client navigation to Projects, FixLens, the 3D homepage and back to Sippy passed. The hero diagnostics were removed on unmount; homepage canvas/fallback and the GLB asset loaded; no browser exceptions were recorded.
- All 41 source files remain unchanged. Fourteen accepted hero/component images, including the genuine complete structure, remain byte-identical to Phase 4B.4. Evaluation/reflection markup and the evaluation counter component are unchanged, as are the project card, shared layout, FixLens and workspace files.
- The forward/reverse demonstration contains 280 actual browser frames at 10fps (28 seconds) covering the hero, behaviour stage and making-of sequence. It and all three new runtime clips decode without FFmpeg errors.
- The targeted Finesse static detector reports no P0 findings. It reports three P2 missing-stamp notices on TS/TSX files; the styling stamp is in CSS and the approved main stylesheet retains its full design coordinates. No clean pass of the broader Phase 4B.4 landing-page template gate is claimed or needed to justify replacing its approved identity.

Final desktop/mobile visual review covered every video/flow and making-of stage. Crops were adjusted to fill a consistent 16:10 stage; the cup clip ends before the next source-film title graphic. Mobile Structure spacing, lower-shell clearance, diagram label sizing and large process-photo compositions were refined from the actual browser review.
