# Phase 3D — FixLens motion redesign review

Date: 9 November 2026. Route: `/projects/fixlens`.

## Branch and scope

- Active repository: `E:\Personal Website`.
- Branch: `codex/fixlens-phase-3d-motion-redesign`, created directly from fetched `origin/main` at `127757edaa60df7a51dd8a047e4e3c0ef47cde1c`.
- No Taste or Phase 3B experimental branch was merged. Main, production, the workspace, models, About, Contact and other projects were not edited.
- Pre-existing untracked `.taste-skill/` files were left untouched and excluded from this commit.
- The final chat delivery records the verified remote SHA and immutable Vercel Preview URL after this report is committed. No production promotion is authorized or performed.

## Design and Finesse UI

Installed the official `mouse-lin/finesse-skill` package through the Codex skill installer, using its `skills/finesse-ui` directory. Verified `SKILL.md` version 0.22.0 at `C:\Users\17526\.codex\skills\finesse-ui\SKILL.md`.

Applied redesign, divergence, animate/motion and audit/preflight guidance. The existing page was reviewed before implementation. Its mature research, authentic sketch details, evaluation and iteration claims were protected. The rejected default was another white document with repeated text/image rows. The composition instead uses a layered product stage, a reconnecting problem illustration, aligned reveal stages, a horizontal reporting sequence and varied full-width/paired/detail product compositions.

Design read: a portfolio with a connected-product story; white and electric blue, editorial type, authentic UI and soft atmospheric depth. The promise was a large two-sided product stage and native scrolling that drives the challenge, comparisons and reporting journey. These are present in the rendered page. This checkout had no previous Finesse rotation log; the first build is stamped in the scoped CSS and recorded in the local ignored log.

Explicit user instructions override skill defaults: pure white is retained; no generated imagery or grain is added; several scroll narratives are deliberate; implementation proceeds without a separate design approval; real browser validation is performed. The task remains a portfolio redesign, not an invented product dashboard.

## Implementation

| File | Responsibility |
| --- | --- |
| `app/projects/fixlens/page.tsx` | New hero, visible notes, removal of section navigation/disclosures, new evolution journey and retained evidence |
| `components/fixlens/MotionStory.tsx` | Reusable native-scroll controller, challenge, matched reveal, reporting journey |
| `app/projects/fixlens/motion-story.css` | Route-scoped art direction, sticky stages, responsive/static compositions, reduced-motion styling |
| `lib/fixlens-assets.ts` | Typed records for authorized Figma derivatives |
| `public/images/projects/fixlens/md-*.webp` | Four lossless native-size Figma crops; close-up retained as an authenticated companion asset |
| `docs/phase3d-asset-provenance.json` | Original filenames, crop coordinates, source hashes and owner authorization |
| `docs/phase3d-finesse-detector.json` | Saved Finesse static detector output |
| `docs/reviews/phase3d/` | Actual browser captures and responsive/route smoke results |

No dependency was added. The existing image zoom provider and evaluation components are reused. The main site header and keyboard skip link remain intact.

## Motion and accessibility

- Hero: one brief CSS entrance; a dedicated mobile arrangement keeps the foreground phone readable.
- Challenge: separated description, evidence and follow-up fragments converge around a case as connector strokes appear. It is explicitly labelled an editorial interpretation, not a tested interface.
- Home and Overview: stationary 390×844 images; only the Mid-fi mask and reveal boundary change. Scroll progress is reversible. Native labelled range inputs also work with Home/End and arrows. Complete originals remain directly accessible.
- Reporting: five genuine safe-path states in a temporarily sticky horizontal track. Vertical scroll maps continuously to the track's available travel. Numbered keyboard/touch shortcuts are optional. Danger guidance is a separate alternative, never a required normal step.
- Product scenes: restrained depth changes support the reporting/review and follow-up compositions. Evaluation retains its once-only count/bar animation.
- Enhancements run only at widths of at least 1000px and heights of at least 650px without reduced motion. Smaller/reduced-motion compositions expose the reporting steps in a regular grid/vertical sequence, and both comparison originals remain available.
- No wheel interception, timer autoplay, global scroll locking or WebGL. Passive scroll/resize listeners schedule one animation frame. Listeners, media-query subscriptions, observer and pending frame are cleaned up on unmount. Endpoint calculation includes scenes passed during fast scrolling.
- No-JavaScript HTML contains the complete reporting sequence, comparison originals, notes and final metric values. The unenhanced CSS provides a static composition. The range enhancement is not required to access either original.
- Product images retain aspect ratio and use containment. Mobile product pairs become readable vertical presentations. Iteration panels have explicit responsive widths to prevent unloaded-image shrinkage/layout shifts. Only the intentional reporting viewport clips the moving track; it does not crop individual screen content vertically.

## Authenticity and publication

Reviewed the final-assets publication checklist and asset manifest. Its older holds are resolved only where the owner explicitly authorized them in this conversation: all reporting demo values are safe to publish, Brad is fictional, and the Overview/Close-up photographs are authorized for portfolio publication. These authorizations are recorded in the Phase 3D provenance file; the original audit documents were not rewritten.

The new property, description, Overview and Close-up assets are direct lossless 390×844 crops at `(80,48)` from authentic PNG Figma exports in `E:\UX project\high fidelity prototype`. Reporting summary, safety, danger and safe-capture states reuse the already-cleared authentic exports. Recreated `report 1–6.png` remain excluded. Raw interviews and participant-identifying research records were not copied into this repository.

The research remains eight exploratory interviews (six renters, two landlords). The six-person Hi-fi prototype evaluation retains SUS 91.7/100 and adapted task ease 4.30/5. PM tasks were role-played; these are not deployed-product retest results. Editable fields and timeline predate evaluation. Video was planned, not delivered. The implemented application remains an AI-assisted functional exhibition application, with its existing scope limitations visible. No measured post-implementation improvement is claimed.

## Validation performed

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed on the final implementation |
| `npm run build` | Passed; all seven routes generated |
| `npm run check:interactions` | Passed backpack and trash regression checks; existing Node module-type warnings remain |
| Asset prebuild audit | Passed; 205 GLB nodes and 2,163,588-byte model preserved |
| Finesse detector | Ran from the installed skill; zero P0 findings; advisory findings reviewed below |
| Desktop/tablet/mobile widths | Actual browser checked at 1440, 1024, 768, 390 and 375; no horizontal page overflow; no broken images |
| Section navigation / accordions | Removed; browser confirmed zero case-study `details` elements |
| Comparison scroll | Observed 15→54→100% during initial testing; final implementation also observed 26.6→44.4→31.6% through native downward/upward keys |
| Manual comparison | Home/End reached 0/100% on desktop and narrow-screen controls |
| Reporting journey | Observed progress 0, 0.5 and 1, changing track translation; upward PageUp returned to about 0.497; stages release into ordinary content |
| Image boundaries | Actual iteration images loaded, retain native ratios and `object-fit: contain`; no vertical image clipping; mobile solution images 270×584.3px |
| Evaluation | Actual browser showed final 91.7, 4.30 and six, with all task bars reaching scaleX(1) |
| Image zoom / keyboard | Reporting image opened with Enter; Escape closed it and focus returned to its opener |
| Other routes | `/`, `/projects`, `/about`, `/contact` opened with expected titles and main content; source files unchanged |
| Console | No errors observed on the final local case-study page |

Finesse advisory review: white is an explicit art-direction requirement. Missing-stamp warnings for TSX files are false positives for a page with an external stamped stylesheet. Existing factual prose punctuation is retained. The detector's side-stripe finding was corrected to a restrained top rule. No unreviewed P0 detector finding remains. This does not assert a perfect score against every optional brand-site rule.

## Captures

See `docs/reviews/phase3d/`:

- `hero-desktop.png`, `hero-mobile-390.png`, `hero-mobile-375.png`
- `challenge.png`
- `comparison-midfi.png`, `comparison-scroll-middle.png`, `comparison-hifi.png`
- `capture-comparison-midfi.png`, `capture-comparison-hifi.png`
- `reporting-start.png`, `reporting-middle.png`, `reporting-end.png`, `report-mobile.png`
- `solution-section.png`, `solution-mobile.png`
- `evaluation-section.png`, `iteration-section.png`, `iteration-mobile.png`
- `full-desktop.png`, `responsive-checks.json`, `route-smoke-checks.json`

Full-page screenshots cannot represent all sticky states simultaneously; the separate progress captures document those moments. The full desktop image includes the document's natural sticky-stage spacers.

## Known limits

- No physical touchscreen, cross-browser matrix, mid-range-device frame-rate measurement or assistive-technology session was performed.
- The narrow static path and manual controls were exercised in the browser. OS-level reduced-motion switching and disabling JavaScript were not emulated by the available browser controls; their media-query/effect branches, server HTML and static CSS were inspected instead. Do not treat those source checks as physical-device tests.
- Still captures were supplied rather than a demonstration video.
- The experimental preview requires visual approval before any future merge. Main and the production URL are preserved.
