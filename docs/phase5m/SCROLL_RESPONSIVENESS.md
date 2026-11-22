# Phase 5M scroll responsiveness

The controller still starts an action only after native scrolling crosses a boundary. It locks while the media or camera plays, discards further scrolling during that action, lands at a stable pose and releases. It has no action queue and holds have no time limit.

## What changed

| Mechanism | Phase 5L | Phase 5M |
| --- | --- | --- |
| Ordinary gap between cinematic actions | Variable, often half to nearly a full viewport | 0.076 viewport heights |
| Anchor clearance | 0.022 viewport heights | 0.013 viewport heights |
| Directional hysteresis | 0.008 viewport heights | 0.005 viewport heights |
| Post-lock input | Wait for 160 ms between wheel events | A pause between inputs, a renewed impulse, or a deliberate reversal can re-arm |
| Projects reading | 1.86 viewport heights | 1.86 viewport heights |

At 900 px high, the normal next-action distance from a completed hold is about **61 px**, compared with **752 px from Phase 5L’s Introduction hold to Design**. The Phase 5M Home trigger takes about 81 px. Consecutive reverse actions have the same 61 px spacing. Reversing the action just completed crosses its nearby reverse boundary in about 16 px. Holding for reading never requires advancing through this space until the visitor wants to continue.

The distance between actions was the dominant cost. The old hysteresis added only about 7 px at 900 px high, and putting the anchor 20 px beyond the departed action actually removed 20 px of the gap. The 160 ms quiet rule added a separate delay chiefly when a wheel or trackpad was still sending events near unlock.

With Phase 5M, pixel-mode input re-arms after a 100 ms quiet gap. Line or page input re-arms after 55 ms. A substantial renewed pixel impulse can re-arm from 44 ms. A clear reversal can re-arm from 18 ms. Continuous decaying movement stays suppressed until it meets one of those intent conditions. Fresh touch or pointer input and a nonrepeating scroll key can still re-arm directly. Browsers sometimes report both a wheel and a trackpad in pixel mode. The heuristic uses the observed motion and event spacing, so very similar same-direction pulses within 100 ms can still be treated as one gesture.

Direct navigation and browser history cancel the lock. Skip Transition and Escape settle the selected action. Reduced-motion and narrow layouts use the existing static About content and ordinary scrolling. A load error still settles the intended pose and releases.

## Chromium measurements

At 1440 × 900, a controlled comparison started at each phase’s settled Introduction anchor and used identical 74 px wheel deltas. Phase 5L reached the Design trigger after 11 inputs. Phase 5M reached it after one, with 17.9 ms from the wheel event to the lock in that run. In a separate stress test a decaying pixel-mode tail left the page pinned after unlock, and the next renewed impulse engaged the Design lock in 17.1 ms.

One wheel input per action started all 12 forward and all 12 reverse actions in the walkthrough. For Monitor Out and the reverse Monitor In, the test first scrolled normally to the corresponding side of the Projects reading span. Both passes kept the entrance document position fixed across source time 5.042 s and retained the same media source through the cut and the final pose. The entrance locks lasted 10.17 s forward and 10.14 s reverse in those captures.

The follow-up passed slow accumulated precision-style input, large wheel input during playback, residual inertia, renewed input, reversal, Escape, direct navigation, Back, resize and blocked media recovery. It also passed the desktop frame-clearance and static-fallback checks at 1920 × 1080, 1440 × 900, 1024 × 768, 768 × 900, 390 × 844 and 375 × 812, plus reduced motion. These are Chromium measurements with emulated deltas. Similar same-direction gestures on the user’s hardware still need a hands-on check.

TypeScript, the workspace interaction checks and the local production build passed. The build succeeded on retry.
