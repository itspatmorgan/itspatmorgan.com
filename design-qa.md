# Query Builder presentation QA

Reviewed 2026-10-24 on `codex/query-builder-presentation`.

## Scope and references

New noindex route: `/work/query-builder-preview`. The existing
`/work/query-language` route is unchanged. Focused vertical composition is retained.

- Original deck: https://www.figma.com/deck/UlMqhnukdHWCr2yrdVgcx2/Slides---J1-Query-Builder?node-id=12-921
- Original UI: https://www.figma.com/design/JXS8636MGkJVpYxvgYNgEX/?node-id=76-1120
- Query2Ways 191:40836; selection 138:28111; filter 152:31165;
  direction 138:28986; syntax 268:10272.

All displayed UI is native text, CSS, and SVG geometry. Full-frame raster assets
were moved to `.reference/query-builder/frames/` and are not runtime assets.
Figma MCP quota was exhausted; original exports and the authenticated desktop
inspector supplied the source measurements, fonts, and custom vectors.

## Visual review

Compared original exports and rendered native states side by side. Local captures:
`/private/tmp/query-builder-qa/final-hero.png`, `final-select.png`,
`final-direction.png`, and earlier `native-filter-comparison.png`.
Source controls and typography were reviewed against the reference, including
Lato/Ubuntu Mono, chip glyphs, relationship indentation, property fields,
entity tree, summary, and original semantic colors. Fixed initial font assumptions,
chip dimensions, prompt background, tree spacing, control widths, UI scale, and
query label size. Neutral page framing replaces the invented blue/green stages.

Light and adapted dark UI inspected at desktop width 1280. Mobile at 390 × 844:
measured document scroll width 390; all native canvases visible. Stages retain
source proportions, so dense desktop UI is small on phones; this is a faithful
scaled presentation rather than a redesigned mobile query builder.

Fixed a pre-hydration blank-stage issue: CSS container scaling now renders native
content before ResizeObserver measurements, and demo islands load immediately.
Final captures: `native-final-light.jpg`, `native-final-dark.jpg`, `native-mobile.jpg`.

## Interaction review

- Default automatic playback observed advancing without clicks; end-state playback
  returned to earlier steps. Offscreen flow steps remained at zero during hero playback.
- Play, pause, replay, and manual chapter selection checked.
- Selection: open picker, select Channel and four types, close, remove checked.
- Filtering: action menu → add filter → pltfm_env → Equal to → production checked.
- Direction: bidirectional → source → target checked.
- Syntax: seven native token concepts, explanatory copy, and selection indicator.
- Manual actions pause playback. Only demonstrated flows are supported.
- Reduced motion is handled in the shared playback hook, MotionConfig, and CSS;
  OS-level reduced-motion preference was not changed during this review.
- Fresh production-preview browser warnings/errors were empty.

## Validation and remaining limits

`pnpm build` passed with 45 static routes. `git diff --check` passed.
No screenshot-based UI, query execution, or external service calls in the demos.
No merge, deployment, or publication performed.

Ready for visual review. Source fidelity is substantially improved, but this is
not a claim of a zero-difference pixel audit across every animation frame.
Dark mode and the syntax spotlight are intentional adaptations. Final taste and
motion pacing remain subject to the designer's review.


## Follow-up: reference portfolio comparison and fidelity pass

Revisited Daniel Destefanis’s Code Layers case study and Emil Kowalski’s Sonner
article in the browser. Captured both in the current review; exercised Emil’s
transition-based Add toast example. These are qualitative presentation/motion
references, not claims of identical content or an objective craft score.

1. Hero presentation: improved. Removed the outer card around the comparison,
   constrained the overall width, softened the heading scale, and starts at the
   complete query. Original composition is retained.
2. Entity selection: improved. Matching-state comparison corrected tree/title
   sizing, checkbox inset, exact category colors, and summary rhythm. Opens at
   the substantive picker state; short closed states use a deliberate close-up.
3. Filter/direction details: improved. Corrected structural label sizing and
   removed an inactive filter button from the direction-only context. Curated
   property flow and selection/removal were exercised again.

Loop resets now fade out/in instead of abruptly removing the entire query.
Shorter empty holds and quiet step markers make playback easier to follow.
Observed a visible mobile hero advance from final step6 to earlier step3 without
input, verifying wrap. At390px, scroll width remains390px. Dark rendering was
checked after the shared asynchronous theme transition settled. Browser warning
and error logs were empty. Full accessibility or motion-performance certification
is not implied; frame-by-frame timing/velocity parity with Emil was not measured.

Evidence: `/private/tmp/query-builder-qa/fidelity-pass/` contains fresh reference
captures, before/after page captures, combined source/native comparisons for hero,
picker, filter, and direction, plus mobile dark capture. Small native screenshots
are upscaled in some comparisons, so JPEG rasterization should not be mistaken
for live native text sharpness. Some offscreen video frames in reference-page
full captures were blank; no claim is made about their complete playback.

Assessment: closer to Daniel’s work-first presentation, still short of claiming
his level of overall curation or Emil’s interaction finish. Dense desktop UI
continues to scale down on phones; breakpoint-specific editorial crops would be
the next significant presentation improvement.


Paired demo sizing annotation: both details now use the same 600 × 400 canvas
and identical padding, without flex growth tied to the descriptions. Browser
measurements confirmed equal frame width/height, canvas top/size, playback row
position, and heading baseline. Build and diff whitespace checks passed.


Presentation simplification: removed outer film cards, padded backplanes, hero
chapter navigation, progress indicators, replay buttons, and repeated visible
captions. Native UI remains intact with transparent presentation backing. Each
visual retains one accessible pause/play icon. Syntax is now bare animated code
with a single concept label. At desktop, paired stages remain identical; at 390px,
both are 350 × 233.328px and document width remains 390px. Pause labels toggled as
expected. Updated proof: `query-builder/unframed-demos.png` in task artifacts.


Tighter framing follow-up: restored one neutral container per graphic while
keeping the minimal pause control. Paired details share a 480 × 340 crop of their
600 × 400 source canvases; all native UI dimensions remain unchanged. Browser
matrices matched exactly: desktop 1.11042 and mobile 0.666667 at 390px. Filter action
states pan within the same zoom; dropdown and tooltip extents were checked.
Overflow uses clip to prevent focus from introducing an unintended scroll offset.
The complete property flow was exercised after the change. No mobile overflow.


Syntax editor annotation: added a noninteractive filename tab, language label,
line-number gutter, and compact concept footer around the existing native query.
Seven-concept autoplay and the single pause control remain. Desktop capture
inspected; at 390px the editor is 350px wide, code scroll width equals its 348px
content width, and document scroll width is 390px. Build and diff checks passed.
