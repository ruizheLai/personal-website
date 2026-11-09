# Taste design plan — FixLens

Kind: software subject within a UX designer’s portfolio; one reader action: View application.
Deal: triptych Hero; Sora / Figtree (first pairing); branded white #fff, ink #14283d, blue #285ee8, surface #f1f7ff. The first blush/aubergine palette conflicts with the explicitly required white/blue identity, so Taste's client-brand path replaces it. Pinned-chapters in Final Solution and counter-rolls in Evaluation are the two dealt moments. No WebGL, stock imagery, generated UI, pricing, customer proof or replacement navigation.

Voice: facts-only with first-person design decisions. Exact project nouns, short mechanism-led copy, no invented quote, outcome or commercial promise. The copy names each evidence stage and keeps qualifications in reading notes.

## Screen plan and copy

- Hero (1 desktop screen; whole product): FixLens — Rental maintenance, connected. Renter phone, issue-understanding screen and PM dashboard in a three-part editorial composition. Date and individual role in the right column; View application. One entrance; no timed swapping of authentic evidence.
- Challenge (1 screen; explanatory diagram): A report can lose its context. Description, evidence and follow-up diverge across channels; the design opportunity reconnects them around a case. A new HTML diagram based on existing research themes, explicitly an editorial interpretation, no invented UI or testimonial.
- Research (1 screen; evidence typography): Relevant information beats more photographs. Eight interviews (six renters, two landlords) beside three editorial finding/design-direction rows. No testimonial cards.
- Exploration (1 screen; authentic sketches): A conversation takes shape. Three curated native sketch crops at different scales in one open composition.
- Evolution (2+ content-led screens; comparisons and journey): From structure to interaction. Matched Home and Overview reveal sliders; five genuine reporting states visible in one simple rail. Danger stays an alternative. Capture prototype scope remains distinct from the implementation.
- Final Solution (2-screen chapter moment plus 1-screen PM application; product and detail): The report stays with the case. Structured interpretation, camera recovery and connected follow-up share one chapter stage. A full-width management dashboard and request-detail complete the two-sided story. Static full screens on mobile/reduced motion.
- Evaluation (1 screen; figures and task graphic): A strong score still left friction. SUS 91.7/100, adapted ease 4.30/5, six-person Hi-fi study; task bars and unresolved findings. Counter rolls once, never displays fabricated intermediate metrics as evidence.
- Iteration (2 content-led screens; before/after pairs and field detail): From prototype to working application. Home outstanding requests, real report editing and manual PM decisions. No post-implementation improvement claim.
- Reflection (1 screen; type-led closing): Good evidence needs continuity. First-person learning and the next research questions, followed by real portfolio links.

## Adaptations required by the user brief and environment

Retain Next.js architecture and existing shared header; do not convert the whole website to a static starter or apply global kit styles. Original screenshots override Taste's live mock UI fragments. The nine evidence sections and content-led mobile heights override rigid one/two-screen tiling when necessary for readable full phones. Asymmetrical balanced compositions override a universal repeated split. White atmosphere overrides dark bands. No extra shader/scene. No raw research or recreated report images. Previous explicit publication confirmations apply to the four clean derivatives.

Use unmodified selected Taste modules in isolated React-owned HTML islands with teardown; integrate the kit's microinteraction CSS only. Browser QA uses the authorized CUA controller; headless browser scripts are not used because the environment requires browser actions through CUA. Report that gate limitation honestly rather than claim a Taste gate pass.
