# Sippy Phase 4B.7 release

Phase 4B.7 begins at the approved `origin/codex/sippy-phase-4b6-visual-polish` commit `34c7ddfdbc3a19852a1805b887d5394181819569`. The release branch is `codex/sippy-phase-4b7-final-release`.

## Copy and credits

Removed the Construction contribution paragraph, Action footage note, architecture and 10-second demo note, Making provenance note, and Evaluation's two qualifications. Also removed the hero's rotating captions, the Construction eyebrow and battery-image qualification, the redundant cup path caption, and the footer's editorial descriptions. The evaluation introduction retains the 20 showcase questionnaire responses and the charts retain 65% and 90%.

The footer retains Kattni Rembor / Adafruit, the CC BY-SA 3.0 link and the background-removal disclosure, and credits Core Electronics. The earlier review documents and asset manifests preserve the provenance, HX710/HX711 distinction, and research limitations. The public media and original project material are untouched by the 4B.7 diff.

## Implementation

- `app/projects/sippy/page.tsx`, `components/sippy/BehaviourStory.tsx`, and `components/sippy/MakingStory.tsx` carry the copy edits. `components/sippy/SippyExperience.tsx` drops the code that updated the removed hero caption.
- `components/sippy/ResponseArchitecture.tsx` measures the five marker centres. A passive scroll listener schedules one frame, places the signal on the horizontal or vertical line, and highlights the node nearest the signal. A second progress range begins as the cup cards enter view. It transfers the weight of the rules and lifts the cup icon above its base.
- `app/projects/sippy/refinement.css` renders the signal and cup states. `sippy.css` and `storytelling.css` drop the obsolete note rules. Both sequences follow the scroll position directly and keep every label visible. Reduced motion and static HTML show the complete path and both states. The section stays in normal document flow.

## Verification

TypeScript, production build after the advisory reminder, and existing homepage interaction checks passed. Chrome verified the gesture sequence and reversal, both cup states, footer credits and the Evaluation counters at 1440, 1024, 768, 390 and 375 px. The existing browser checks cover seven shared hardware nodes, the intact structure, cup removal, reverse scroll, measured Construction landing, single-player chapter switching, manual Pause, Making progression, overflow and runtime errors. Reduced motion, blocked autoplay, keyboard playback, no JavaScript, route cleanup, FixLens, Projects, About, Contact and homepage GLB checks also passed.

| Evidence | Captures |
| --- | --- |
| Full page | [Desktop](screenshots/sippy-phase-4b7/1440-full-page.jpg), [mobile](screenshots/sippy-phase-4b7/390-full-page.jpg) |
| Removed notes | [Construction](screenshots/sippy-phase-4b7/1440-construction-end.png), [Action](screenshots/sippy-phase-4b7/1440-action-end.png), [Making](screenshots/sippy-phase-4b7/1440-making-end.png), [Evaluation](screenshots/sippy-phase-4b7/1440-evaluation.png) |
| Gesture | [Recognition](screenshots/sippy-phase-4b7/1440-signal-0.26.png), [BLE](screenshots/sippy-phase-4b7/1440-signal-0.51.png), [ESP32](screenshots/sippy-phase-4b7/1440-signal-0.76.png), [motors](screenshots/sippy-phase-4b7/1440-signal-1.01.png), [vertical layout](screenshots/sippy-phase-4b7/390-signal-0.51.png) |
| Cup states | [Present](screenshots/sippy-phase-4b7/1440-cup-on.png), [removed](screenshots/sippy-phase-4b7/1440-cup-off.png), [mobile present](screenshots/sippy-phase-4b7/390-cup-on.png), [mobile removed](screenshots/sippy-phase-4b7/390-cup-off.png) |
| Browser receipts | [Response](screenshots/sippy-phase-4b7/RESPONSE_QA.json), [Sippy](screenshots/sippy-phase-4b7/BROWSER_QA.json), [fallbacks](screenshots/sippy-phase-4b7/SUPPLEMENTAL_QA.json), [routes](screenshots/sippy-phase-4b7/REGRESSION_QA.json) |

Full-page screenshots use the static layout so all sections and photos fit in a single document view. The viewport captures show the live scenes at their intended scroll positions. [Forward and reverse scroll recording](screenshots/sippy-phase-4b7/RESPONSE_FORWARD_REVERSE.mp4). The targeted design checker found zero P0 issues.

## Release readiness

The reviewed branch includes Sippy and the Projects card. The diff against production contains no changes to FixLens, the homepage model, other routes, or dependencies.

The installed Next.js 16.4.3 package has two moderate advisories involving root parameters and specific `use cache` configurations. The site has static routes, no Cache Components configuration, and no `use cache` or `unstable_cache` usage in application code. These advisory prerequisites are absent, so the warnings do not block this release. The dependency remains flagged for a separate patch update. The existing Node module-type warnings are informational. [First advisory](https://github.com/advisories/GHSA-mfr8-8qww-v76h) · [Second advisory](https://github.com/advisories/GHSA-vc7v-qv4w-wrv8)
