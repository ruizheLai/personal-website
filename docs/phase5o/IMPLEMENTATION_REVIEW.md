# Phase 5O implementation review

Phase 5O is available at `/design-lab/phase5o`. The Phase 5N comparison remains at `/design-lab/phase5n`.

## About copy timing

The scroll timeline uses the same media files, animation bounds, landing poses and reading holds as Phase 5N. The change is confined to the copy projected alongside the frames. The table uses zero-based source frame numbers. Introduction uses the joined entrance cut and retains its existing timing.

| Action | Phase 5N fade range | Phase 5O fade range | Cue |
| --- | --- | --- | --- |
| Introduction | 218–241 | 218–241 | The introductory hand extension |
| Bachelor of Design | 63–73 | 35–48 | Artist and easel emerge |
| Master of Information Technology | 114–120 | 107–115 | Programmer outfit and laptop are recognisable |
| Understand the Problem | 52–60 | 26–42 | Problem graphics settle around the character |
| Research the People | 112–120 | 81–98 | The research board comes into view |
| Design the Experience | 168–175 | 137–155 | Interface mockups are visible |
| Build & Iterate | 211–216 | 191–205 | The working phone and laptop replace the mockups |
| Beyond Work | 99–115 | 59–86 | The Chelsea shirt is established as the equipment arrives |

Cross-chapter changes keep the previous copy in view until a seven-frame fade into the next cue. Same-chapter changes add the new line while keeping the previous ones visible. Both directions use the same frame mapping. In the abbreviated frame entry, the Introduction still follows the same original gesture.

In the 1440 × 900 Chrome wheel walkthrough, the Introduction first appeared at 91% of the entrance, effectively full at 99%. The earlier copy was effectively full at 64% and 87% for the two Education actions, 68%, 59%, 60% and 68% for the four Capabilities, and 72% for Beyond Work. The programmer cue remains later in its action so the outfit change can finish.

## Projects and Contact

Project category labels use `.04em` tracking. The labels stay secondary to the project names and retain the Phase 5N right alignment across both expanded and collapsed headers.

The Contact phone keeps WeChat, Facebook, LinkedIn and GitHub in its original top row. The browser-rendered screen was captured as the new in-scene phone texture so the zoom and fully opened Contact view show the same four apps. The full address `bradleylai6@gmail.com` appears above GitHub, with an underlined `mailto:` link and visible keyboard focus.

## Verification

TypeScript, the production build and the existing workspace interaction checks passed. The build emitted a Next.js dependency advisory.

Chrome verified both expanded and collapsed labels on the cinematic layouts at 1920 × 1080, 1440 × 900 and 1024 × 768. The 768 × 900, 390 × 844 and 375 × 812 layouts kept aligned labels and readable Contact content in the static flow. At all six sizes the full email was a link in the accessibility tree and fit within the layout. The tablet resize exercise exposed stale coordinates for offscreen 3D controls, so the static workspace now clips its own scene projections to its bounds.

| Screenshot | What to inspect |
| --- | --- |
| [Education](screenshots/education.png) | Programmer outfit and both education credentials |
| [Bachelor of Design](screenshots/education-bachelor.png) | Earlier cue during the drawing action |
| [Capabilities](screenshots/capabilities.png) | Accumulated capabilities before the hold |
| [Beyond Work](screenshots/beyond-work.png) | Earlier heading during the sports sequence |
| [Projects labels](screenshots/projects-labels.png) | Right-aligned category text across the three headers |
| [Contact phone](screenshots/contact-phone.png) | Four apps, status bar and home indicator |
| [Contact email](screenshots/contact-email.png) | Full address above GitHub |
| [Contact mobile](screenshots/contact-mobile.png) | Layout and full address at 390 × 844 |

The [navigation review](NAVIGATION_REVIEW.md) contains the recordings, timings and recovery checks.
