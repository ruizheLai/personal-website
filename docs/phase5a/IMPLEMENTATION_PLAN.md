# From exploration to implementation

Base `3bec89240c82e5f43b1885502338b6d5f05200e5` from verified `origin/main`. Review branch `codex/phase5a-global-design-exploration`. The lab layout adds noindex and nofollow. The CSS and font use are scoped to the lab. Public page sources, layouts, interaction code, dependencies and assets remain outside this diff.

## Phase 5B

1. Select a concept after reviewing the Home and Projects sections at desktop and phone widths. Confirm headline, wordmark, global canvas and the relative importance of FixLens and Sippy.
2. Port the chosen frame around the existing workspace. Reuse its GLB, Canvas lifecycle, pointer handlers, fallback, focus controls and surface transitions. Keep the identity beside or above the scene, outside the interactive bounds. Test the computer, picture frame, phone, backpack, chair, mug and trash bin on a physical phone and desktop.
3. Move the selected gallery to the production Projects route. Reuse the project records and media component. Preserve the two case-study URLs and their visual identities. Give WillDo a live link only when its case study is ready.
4. Consolidate only the selected fonts and scoped variables into the public typography system. Audit wraps, touch targets, keyboard focus, colour contrast, loading and interaction latency. Keep one WebGL canvas and let the still preview render while it loads.

## Phase 5C

Add verified About and Contact copy when ready. Integrate the typography and navigation where they frame a case study without changing project-specific storytelling. Review the shared header and route transitions on slow connections, reduced motion, touch and desktop. Retire the unselected experimental routes once a production direction is approved.

The lab is a prototype. A uses the original workspace navigation destinations. B and C show a source-derived still, with a link to the current live workspace. This keeps comparing concepts inexpensive and allows a production selection before integrating all object interactions into the chosen frame.

## Validation

TypeScript, the production build and existing backpack and trash interaction tests passed. The build continued after the existing Next.js advisory reminder. No dependency change is included.

Chrome checked the comparison and all three concepts at 1440, 1024, 768, 390 and 375 px. It verified navigation, page bounds, loaded media, noindex metadata, the sole live canvas and object focus with Escape, pointer depth, pointer preview reset, keyboard and tap selection, and reduced motion. The six public routes loaded, and the original homepage rendered its workspace canvas. A source diff against main confirms the GLB, production route files, original interaction components and existing case-study assets are unchanged.

[Browser results](screenshots/QA.json) · [Desktop review board](desktop-review.png) · [Mobile review board](mobile-review.png)
