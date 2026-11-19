# Art direction plan — Phase 5B

A digital playground curated like a gallery. A near-white shell and graphite surfaces frame real images. Space Grotesk carries names and headings, Instrument Sans carries reading text, and the existing IBM Plex Mono serves instrument labels. The blue and forest green belong to the work.

| Page | Visual mechanism | Interaction and purpose | Still and mobile composition |
| --- | --- | --- | --- |
| Projects | A continuous exhibition floor divided by a moving seam. FixLens is an arrangement of two separated display planes. Sippy is an unframed object on a green light pool. | One short, reversible scroll passage changes the relative weight of the two worlds. The FixLens role controls bring either interface forward. A small Sippy approach lets the viewer inspect the tangible object. The role controls are specific to a product with two users. The approach belongs to a physical companion. | The direct case-study links are visible above the floor. On narrow screens and with reduced motion the rooms sit in the natural document flow. Touch and keyboard can still use both role choices and the Sippy view. WillDo is the final line of the exhibition, with its development status only. |
| About | A workbench drawn as a circuit, with four physical-looking terminals and a single evidence window. | Selecting Design, Technology, Interaction or Making lights its trace and swaps in a real project artifact. The relationship between a discipline and a piece of work is visible. The layout can host additional evidence later. | The active trace and readout work without hover. On phones the terminals move to a compact two-by-two rail above the evidence. The default view has useful content before any input. |
| Contact | A single cable crosses a dark field from an origin to one large output socket. | The free end follows a pointer inside the field, then aligns with the GitHub port on hover or focus. Pulling toward a real destination makes connection legible. | One native anchor is the only destination. Touch and reduced motion see the completed connection. No simulated form or unsupported contact channels. |
| Home | A small identity at the edge of the existing full-screen workspace. | The Monitor, Frame, Phone and the rest of the live scene remain the interaction. The lab navigation gives every prototype a direct route. | The identity moves above the scene on small screens. The existing static fallback remains available when WebGL is unavailable. |

## Decisions from 5A

Phase 5A established a useful type palette and authentic project imagery. Its editorial split, single changing index preview, and paired exhibit layouts still used familiar gallery structures. This round keeps both works on one responsive floor, with distinct mechanisms and no portrait-driven About. The existing 5A lab remains a historical comparison.

## Motion budget

Only Projects uses scroll progress. About changes on explicit selection. Contact follows a pointing device when available and settles on focus. The home frame uses the established workspace motion. No new animation or rendering dependencies are needed.
