# Phase 5A art direction

Quiet Future makes the portfolio feel like a gallery of working objects. The first object is the existing workspace. FixLens introduces colour through its actual interface and Sippy introduces colour through its material and form. The type carries the point of view. The project media supplies the evidence.

## Reference review

- Santal Architecture places an oversized wordmark against long stretches of neutral space. Navigation follows a strict horizontal axis and the small studio statement has a separate column. The rendered page briefly displayed an empty entrance before settling. The influence here is alignment and scale contrast. Navigation and the main scene are available as soon as the lab renders. [Santal Architecture](https://santalarch.com/)
- Inacio Nakiti uses a dark stage to give an interactive portrait visual priority. The work and contact links remain visible beside the immersive element. The site also offers controls for alternate experiences and access to individual content sections. Kinetic Index takes the idea of keeping controls stable while the visual state changes. It uses real project media and an explicit click or tap to persist a selection. [Inacio Nakiti](https://inacionakiti.com/?v=site)
- Moiséz uses oversized type, small image windows and a visible grid to make orientation part of the composition. The embedded images link directly to projects. Digital Atelier takes the principle that visual material and identity can occupy different scales in the same frame. Its warm mat, serif signature and exhibition layout come from this portfolio's workspace and assets. [Moiséz](https://moisez.com/)

All three homepages were opened in the browser and their settled compositions inspected. The reference review focused on rendered composition, visible navigation and controls. It did not audit every reference hover state or page transition, and it does not depend on a specific animation implementation.

## Design decisions

| | A · Quiet Future Gallery | B · Kinetic Index | C · Digital Atelier |
| --- | --- | --- | --- |
| Canvas | `#fafaf9` and `#151719` | `#161819` and `#f4f3ef` | `#f3efe7` and `#24221e` |
| Home | Left identity and a large interactive workspace room | Dark, two-column pairing of tightly set type and a framed still | Two-line serif signature and a warm, matted workspace still |
| Projects | Wide FixLens feature, smaller reversed Sippy feature and a quiet future entry | Persistent project names, changing media stage and a static future entry | Wide digital interface opposite a tall, offset Sippy exhibit |
| Motion | Device layers respond at different rates, so the two real interfaces read as separate planes | Short mask when the preview changes, while title position and buttons stay stable | The matte frames a restrained crop shift. Sippy leans slightly on hover or keyboard focus. |

Phase 5A adds a route-local comparison and four lab pages. The lab's navigation links to its own section studies. The public routes retain their structure and theme. The live workspace in A uses the existing scene, transitions and original object destinations. B and C use a WebP crop from the rendered production workspace and link to the live scene. The crop removes only surrounding space and site navigation. No third-party reference assets or new project UI are included.

The largest time-based effect is the brief initial reveal of the identity. Native scrolling and local CSS state changes handle the other motions. Coarse pointers get a stable image plus explicit controls. Reduced motion settles the entrance and transforms immediately. About and Contact are deliberately concise content studies. The only contact destination is the existing GitHub account.
