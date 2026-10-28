# Native Query Builder source notes

The runtime presentation uses React, CSS, local WOFF2 fonts, and native SVG paths.
The frame exports in `frames/` are local QA references only; no full-frame images
are served by the demos.

Source: Figma `JXS8636MGkJVpYxvgYNgEX`, page `76:1120`. Sequence node IDs and
export rectangles are recorded in `export-provenance.json`. Original fonts were
confirmed in the authenticated Figma desktop inspector: Lato for controls,
Ubuntu Mono for query syntax and structural labels. The site shell stays Geist.

Query comparison retains the original 456/544 split in a 1000 × 716 canvas.
Its inner UI scales by .855. Entity selection uses a 932 × 565 canvas; property
filtering 600 × 400; direction source is 577 × 351. Both paired detail demos use a common 600 × 400
presentation canvas so their frames, UI scale, and origins match. Stages scale proportionally rather than
reflowing the original design into a different interface.

AccessPolicy and UserGroup use paths exported from original nodes 191:41351 and
191:41424. Other original-era glyphs use Material/MDI geometry stored locally in
`source-glyphs.json`; their licenses are in `public/fonts/query-builder/`.
Google Cloud retains its multicolor source mark. Standard presentation controls
use the site's existing Hugeicons package.

Original UI exists only in light mode. Dark mode is an adaptation: warm neutral
surfaces, lighter semantic teal/blue/green/cyan/gold, and preserved hierarchy.
The original `google_aim_binding` label typo is normalized to `google_iam_binding`.

Playback follows the demonstrated sequences, loops automatically while visible,
pauses offscreen or in background, and initially pauses for reduced motion.
Pausing enables the specific demonstrated controls. The code/UI comparison is a
presentation, not a general query editor. Syntax spotlight is a new native
presentation treatment of the original language breakdown.


The fidelity follow-up corrected the picker sequence to 13.2148px tree labels
and 11.5625px category/type text; summary body is 12px. Category colors were sampled
from the original lossless export. Structural query labels are 14px. Closed
selection frames use a 1.55× presentation close-up; opening returns to the full
original picker composition. The camera transform also remaps the demo cursor.
A 180ms reset fade separates the end and beginning of each automatic loop.

Presentation chrome was subsequently removed: no outer stage cards, chapter
navigation, replay controls, progress ticks, or visible script captions. One
accessible pause/play icon remains per autoplay visual. Syntax uses one concept
label beneath the native query.

The subsequent framing pass restored one quiet neutral container and introduced
a shared 480 × 340 camera crop for both 600 × 400 detail canvases. UI dimensions
stay native; the camera pans to the original right-edge filter actions while
retaining exactly the same zoom as the direction demo.
