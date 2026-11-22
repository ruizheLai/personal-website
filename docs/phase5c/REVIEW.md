# Phase 5C Workspace Journey

## Navigation architecture

The experiment lives at /design-lab/phase5c. A single showcase owns the document timeline and mounts the existing workspace scene once. Each destination is server-rendered DOM. The canvas uses the original GLB, object hit targets and secondary interactions. An optional driver supplies alternate surface textures, scroll poses and projected screen bounds. The default route still uses the original focus, Escape and second-click transition behavior.

A shared Next.js layout could retain a canvas across route navigation, but route-level scroll restoration and history transitions would compete with the continuous timeline. This prototype keeps native scroll in one document and uses fragment links for direct access to Projects, About and Contact. Explicit navigation updates history and moves focus to the destination. Passive scrolling leaves the URL alone. Existing case study links navigate normally. Mobile and reduced-motion visitors get the same content in normal document flow and can use the desk objects or header links.

## Scroll and camera storyboard

| Document travel in viewport heights | Scene |
| --- | --- |
| 0 to 0.22 | Full desk. The GLB monitor, frame and phone show lightweight content previews. |
| 0.22 to 0.90 | The orthographic camera approaches the monitor. The real projected rectangle guides the DOM reveal, expanding it to the edges as the preview recedes. |
| 0.90 to 2.56 | FixLens, Sippy and WillDo share one display. The incoming room covers the previous one during each short blend. |
| 2.56 to 3.24 | The exhibition contracts into the monitor and the camera returns to the full desk. |
| 3.29 to 4.97 | The camera approaches the frame, opens the About folio, then returns to the desk. |
| 5.02 to 5.52 | The phone opens Contact, the end of the journey. |

Native scroll follows the same poses in reverse. The lab disables the workspace's legacy wheel zoom so a wheel movement scrolls the document. A sticky viewport leaves the rest of the document in charge. Mouse and keyboard object actions remain available when the workspace is active.

## Project interactions

- FixLens preserves the cleared manager dashboard and renter screen. Each is a separate full-size link to the case study. Hover or focus brings its plane forward. The other recedes on mouse hover.
- Sippy uses the real plush cutout in a green light well. The full scene opens the case study. Hover or focus enlarges the prototype with a small lift and tilt.
- WillDo has an equal screen on the same exhibition and a typographic composition with its In Development status. There is no invented interface or case study link.

## About and Contact

About feels like opening a printed folio from the frame. The title and personal statement sit opposite four short observations about product design, interaction, making and an evidenced interest in expressive objects and everyday gestures. These are grounded in the published FixLens handoff, reporting and recovery work and Sippy's gestures and physical prototyping. The site supplied no verified details about unrelated hobbies.

Contact extends the phone screen into a single readable note with the verified GitHub profile as its sole action. The frame and phone textures use the same typography, colors and subject as their corresponding HTML content.

## Performance, accessibility and limits

- The surface WebP previews total about 18 KB. There are no live HTML render targets or additional WebGL contexts. The original demand-driven frame loop and DPR caps are retained.
- The clip uses projected screen bounds. It is rectangular and does not reproduce each corner of the perspective silhouette. The content is never dependent on WebGL; the header links and readable HTML are also available with the static workspace fallback.
- Offstage panels are inert during the desktop journey. Keyboard focus is assigned on explicit in-page navigation. Reduced motion removes both the camera journey and project hover movement.
- Desktop camera mode starts at 900 × 640 CSS pixels with motion enabled. Thumbnail textures are intentionally illustrative. Case studies remain real full pages.
- Phase 5C review routes are fragments of a single lab page. Publishing and search indexing stay separate from this noindex preview.

## Review evidence

- [Browser walkthrough, forward and reverse](screenshots/workspace-forward-reverse.mp4)
- [Desk](screenshots/desktop-home.png), [monitor approach](screenshots/desktop-monitor-approach.png), [FixLens](screenshots/desktop-fixlens.png), [manager hover](screenshots/desktop-hover-manager.png), [renter hover](screenshots/desktop-hover-renter.png), [Sippy](screenshots/desktop-sippy.png), [WillDo](screenshots/desktop-willdo.png)
- [Frame approach](screenshots/desktop-frame-approach.png), [About](screenshots/desktop-about.png), [phone approach](screenshots/desktop-phone-approach.png), [Contact](screenshots/desktop-contact.png)
- [Mobile desk](screenshots/mobile-home.png), [FixLens](screenshots/mobile-fixlens.png), [Sippy](screenshots/mobile-sippy.png), [WillDo](screenshots/mobile-willdo.png), [About](screenshots/mobile-about.png), [Contact](screenshots/mobile-contact.png)

TypeScript and the existing workspace interaction checks passed. The local production build passed using Webpack after the Turbopack CSS worker failed to start on Windows. The pre-existing Next.js dependency advisory remains outside this phase.

Chromium verified the full sequence at 1440 × 900, touch navigation at 390 × 844 and reduced motion at 1280 × 800. The checks measured camera restoration, retained canvas identity, native small wheel input, keyboard hotspot activation and focus, both FixLens hover targets, real case study links and browser Back, direct Contact refresh, and the public and Phase 5B routes. The recording was captured in Chromium and successfully decoded. GPU frame rates on physical phones and browser coverage beyond Chromium were not measured. [Browser check results](screenshots/browser-results.json)
