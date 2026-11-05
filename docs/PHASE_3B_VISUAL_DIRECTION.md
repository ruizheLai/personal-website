# Phase 3B — FixLens visual direction

Date: 5 November 2026. Scope: local visual review of Hero, Design Evolution and Final Solution at /projects/fixlens. The six other sections, verified content and approved assets stay intact. Stable baseline: main at 0d17c079f45a7f115422bd8316d338af1d818f45. No main push or public deployment is authorized for this review.

## Reference inspection — before implementation

All three supplied Behance projects were inspected in the browser. The web text reader failed (including a 403 for Niva), but browser images loaded. Observations below concern the actual presentation, not inferred font names or unverified motion behavior. No reference images or layouts will be copied.

### BaseCase
[BaseCase — Fintech & Financial Services Website](https://www.behance.net/gallery/256814481/BaseCase-Fintech-Financial-Services-Website)

Observed a dominant tablet/laptop presentation on a pale lavender environment; bold geometric sans headings with a restrained italic serif accent; small metadata pills; sharply different scale between editorial captions and product scenes. Later modules alternate environmental mockups, a large color-system board and website overviews with soft color transitions. Screens are composed as objects with depth rather than dropped into uniform grids.

Adaptation: establish a single dominant product scene; frame the PM dashboard as a broad browser surface with the renter experience in the foreground. Reuse FixLens blue, preserve the existing site type family, and use ambient blue only where it supports the product.

### Niva
[Niva — AI family assistant](https://www.behance.net/gallery/241915081/Niva-AI-family-assistant)

Observed large editorial statements, neutral rounded scene surfaces and a prominent upright phone. Floating calendar/task details surround a central interface, connecting the product to its story. Later compositions pair a bold color field with one focused screen. The warm orange/yellow/blue visual identity and an opening Vimeo presentation are visible; the visual emphasis changes from scene to scene.

Adaptation: make each FixLens feature a distinct composition. Use existing authentic interface details (status, requests and reviewed responses) as supporting evidence around complete screens. Do not add stock photographs, fabricated UI chips, a fake demo, or pretend that the screenshots respond like the product.

### VELORA
[VELORA — Finance App UI/UX Design](https://www.behance.net/gallery/257727533/VELORA-Finance-App-UIUX-Design-Fintech-Mobile-App)

Observed an oversized blue wordmark behind a perspective monitor, pale blue/white environments, large dark/gray editorial type, lifestyle/device scenes and floating UI details. Its type board names Urbanist and shows 46px H1, 22px H2 and 16/14px body sizes; the palette labels background #EEF3F9 and surface #FFFFFF. A later scene staggers three large phones at different heights rather than equal cards. Some reference scenes deliberately crop device edges.

Adaptation: vary scale, alignment and background rhythm; use larger staggered screens with lightbox access to the full original. Retain FixLens and the existing website typography rather than importing VELORA's design system. Essential UI will remain visible. No authored product motion was verified; FixLens motion below is a proposed presentation enhancement.

## Design system for this review

- **Type:** retain Arial/Helvetica. Hero wordmark approximately 100–140px desktop; preserved subtitle approximately 25–32px; feature statements 34–48px; body 15–16px, with the original readable measure. Changes are scoped to the three review sections.
- **Spacing:** 8px rhythm for controls and details; 24–48px scene insets; 64–100px between feature stories. Use asymmetry deliberately, not empty space around tiny artifacts.
- **Color:** current FixLens blue, near-black/navy, white and cool pale-blue surfaces. Gentle radial light belongs behind product scenes; it will not wash across body text.
- **Images:** keep source dimensions, alpha, captions, provenance and lightbox fallback. Add CSS presentation frames without fake camera cutouts, status bars or product controls. Do not add assets or modify PNG/WebP masters.
- **Rhythm:** airy opening → unchanged evidence narrative → dark evolution workspace → varied light product stories → unchanged evaluation/iteration/reflection.

## A. Hero composition

Move from a flat screenshot-on-blue rectangle to a larger, layered product environment. Give the authentic dashboard a subtle perspective/browser frame, and make the renter phone a substantial independent foreground object. Separate labels describe the two audiences; do not invent UI. Keep the subtitle, overview, facts and outcome verbatim. A soft blue glow and restrained shadow provide depth.

Motion is limited to entrance and small hover/focus changes that clarify the independent layers. Touch and reduced-motion views stay still. Both screenshots remain directly enlargable.

## B. Design Evolution

Replace repeated three-column fidelity grids with a single interactive evolution workspace. Visitors choose Home, Evidence capture or Case tracking, then select the genuine available fidelity stage. A large active artifact provides focus; a stage rail keeps historical progression explicit. Provide an all-stages view/static fallback so no evidence is available only through animation.

Use only:
- Home: homeSketch → FX11 → FX16.
- Capture: captureSketch → FX12 (two available stages; no invented Hi-fi substitute).
- Tracking: trackingSketch → FX13 → FX19.

Keep each existing explanation and caveat verbatim. Guided reporting remains a separate chronological filmstrip: FX17 → FX37 → FX38 → FX39, then danger FX40 OR safe FX41. Fidelity selection is not presented as a product interaction or as six fidelity iterations. Do not hide newly inserted content behind the existing one-shot reveal observer.

Use a dark navy section environment to separate design development from the surrounding report, with clear labels and keyboard controls.

## C. Final Solution — four distinct visual stories

1. **Guided reporting:** a broad pale-blue scene with staggered, large interpretation/review screens (FX25/FX26). Preserve the original two explanatory paragraphs and captions.
2. **Capture and recovery:** a quieter split composition with the recovery screen (FX29) and a differently scaled safety-report detail (FX30), plus the existing normal-two-photo limitation. Do not imply physical camera validation.
3. **Connected follow-up:** a large tenant Home device (FX01), focused status detail (FX27), and the wide reviewed-response artifact (FX33). Compose the authentic details around the complete screen; original wording remains.
4. **PM workflow:** a wide dashboard scene (FX02), supporting request dialog (FX32), and existing explanation of specific requests/manual actions. Preserve the caption that a request was not sent in that capture. Do not add a simulated backend action.

The scenes should alternate vertical layering, focused detail and wide desktop scale; not four identical left-text/right-image rows.

## Motion, responsiveness and review gates

- No new animation or 3D dependency. Use existing reveal infrastructure, CSS transitions and a small React selector.
- Stage changes are explicit presentation controls, labelled and keyboard accessible. No autoplay or fabricated product demo.
- Respect prefers-reduced-motion in CSS and JavaScript. Base server HTML stays readable without scripting.
- At 1440/1024px, compose large layers; at 768px, simplify perspective and allow readable controls; at 390/375px, stack critical screens and use a single focused evolution artifact with explicit stage navigation.
- Maintain original uncropped lightbox access, close/Escape/backdrop and focus return.
- Validate TypeScript, production build, approved asset hashes, unchanged non-target section content and existing homepage checks.
- Capture desktop and mobile views of all three redesigned sections, a full-page preview, and a documented before/after comparison using existing Phase 3A screenshots.
- Keep all work on codex/fixlens-phase-3b-visual-review. The user reviews the local result before any merge/main push or deployment.
