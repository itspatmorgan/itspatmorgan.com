---
name: case-study-demos
description: Use when building or changing an animated product demo on a Work case study (a hero or slide visual recreated as native React and played by the shared scene player), including camera and pointer moves, captions, timing, loops and phone zooms. Story, copy and page layout belong to case-study-shaping; homepage project cards to project-card-visuals.
---

# Case Study Demos

## Purpose

Recreate a real product screen as a native demo and animate it so a visitor
understands the step in a glance. Demos are the strongest proof on the site
and the easiest place to look approximate, so they follow one pattern.

Read `agents/principles/design.md` first, especially "Show the real work",
"Feel is part of the design" and "The whole picture on every screen".

## Inputs

- The slide's point and line, from the entry's `caseStudy` block
- The source: prototype code, Figma or screenshots (see case-study-shaping,
  step 2, for pulling exact values)
- Shared plumbing in `src/components/case-study/`: `NativeStage`,
  `useDemoLoop.ts`, and `scene.tsx` (`useScene`, `SceneFrame`, `DemoFrame`,
  `SceneTour`, `Camera`, `Pointer`, `Zoom`, `Expand`, `Screens`, `CountUp`,
  `Typing`). The Sublime scenes are the most current pattern.

## Build the visuals

- Prefer native React demos over screenshots. Render each screen at its source
  frame size inside `NativeStage` so it scales crisply.
- Every demo works in light and dark. Namespace demo tokens (`--x-*`, `--q-*`).
  Never reuse site token names like `--radius` or `--ring`.
- One backdrop for every slide: the stage's `texture-bg`. No extra dark panels
  or nested containers.
- Give every stage the same proportions (1240 × 900) so the slides keep an even
  rhythm. Crop larger frames rather than letting stages differ in height.
- Frame cards share one ring and radius on screen. A frame drawn at another
  size sets `--x-card-ring` and `--x-card-radius` scaled by its width over 1240.
- Charts: fewer, thinner bars read better at card size than every source
  column. Snap bars to device pixels on one shared baseline, and stack merged
  series in legend order (see `Bars` in `ExpansionUI.tsx`).
- When two representations of one thing need comparing, use a toggle that
  takes the full stage, not a side-by-side split.
- Strip UI that doesn't serve the story: info icons, unused controls,
  decorative chrome.
- Shape sample data to support the story where the source allows it (a jobs
  list where a person starts one job, not only the agent), and fit table
  columns to their widest content so the main column gets the room.

## Set the motion

- Every demo runs on `useScene(timings, captions, { loop })` inside
  `SceneFrame` or `DemoFrame`. It starts when it scrolls into view.
- A flow's last screen rarely tells the whole story, so a process scene cycles
  rather than stopping on its end state (the default). Hold (`loop: false`,
  which shows Replay) only a scene whose end state is the slide's point: a
  metric, a chart drawing in, a diagram that builds to its answer.
- Looping demos start on a complete frame. Under reduced motion, every demo
  shows its final frame without animating.
- On a loop restart, fade out, jump to the first frame with transitions off,
  then fade in. Never animate backward through the steps.
- Fade a text-heavy screen out before the next fades in. Keep shared chrome
  (the card) still and fade only its content.
- Prefer one live diagram whose elements move between states over crossfading
  whole frames.
- Give each animated demo a tour under its stage (`SceneTour` in
  `src/components/case-study/scene.tsx`): a visible caption naming what the
  current step shows, one segment per step that fills as it plays and jumps to
  that step when clicked, and a Pause/Play button (Replay on a demo that holds
  its end). Steps that share a caption form one segment. Write captions as
  plain statements, one line at desktop width, no trailing period. This is the
  only playback pattern, on every case study, hero included.
- Show a caption only when it names something the picture and the slide's
  copy don't already say (a step in a product flow, the intent behind a
  screen). When the demo explains itself (a two-step loop, a diagram with its
  own titles, a chart drawing in), pass `caption={false}`: the segments and
  button sit alone at the right, and the captions still name each segment for
  screen readers. Of the first 20 demos, 11 kept captions: the Sublime flows,
  the three Query Builder flows, the rule editor and the signal chain.
- Tune timing until there are no dead pauses.
- Each step changes one thing. When several things change at once, the
  in-between frames look broken even if the end state is right.

### Camera and pointer scenes (zooms, pans, a cursor that clicks)

- A zoom frames one whole component with padding, and its crop lands at a
  layout gutter, never mid-word or past the page edge. Skip a zoom that only
  trims edges.
- Camera moves and pointer moves get separate steps. The pointer appears only
  after the camera lands.
- A new page arrives at full frame, never zoomed. Overlays that would run off
  the frame flip, as the product does.
- Direct attention with the camera, never with highlight rings or outlines that
  could pass for UI.

## Phones

Phones (640px and below) show each demo's whole desktop frame at its desktop
proportions, small. Patrick rejected crops that change the aspect ratio
(2026-10-30): at rest, a phone must see everything. Never lay a screen out again
for a phone, because that shows a product that never shipped. No phone-only
note or Share button: Patrick had one removed (2026-10-30).

- Closer looks keep the frame's proportions and zoom in by `PHONE_ZOOM` (1.6).
  When the step's subject is wider than that (a button and the dialog it opens,
  a row of fields with their labels), ease off with a focus `zoom` (1.2 to 1.3)
  or `zoomCrop`'s `zoom` argument. Patrick's rule (2026-10-30): the gist matters
  more than detail, and no zoom beats a wrong one. A crop must never cut the
  step's key fact (a headline metric, a title, the field a value belongs to).
- Hold one view per chapter rather than chasing the pointer step by step, and
  end a scene on the whole frame when its last chapter sums up the page.
- Scene card (`SceneFrame`): step 0 and reduced motion always show the whole
  stage. Pass a `focus` for the later steps, usually
  `onCard(t.rect(key), view)` with the alignment `'start'`, `'center'` (for a
  pointer target) or `'end'` (for buttons at a row's right).
- Plain stage (`DemoFrame`): no crop by default. When a step needs a closer
  look, pass `NativeStage` the result of `zoomCrop(width, height, at)`. Pass
  `null` as `at` for the other steps, so the view eases in and out.
- Check every step at 390px: the first frame is whole, and each zoom keeps
  the step's subject in view.

## Verification

- `node scripts/frame-check.mjs --url http://localhost:4321/work/<slug>
  --slides <ids>` saves frame-by-frame contact sheets at desktop and phone
  widths. Check every camera move and transition, not only end states.
- Both themes, reduced motion (lands on the final frame), and 390px.
- Compare against the source screen before showing Patrick; anything slightly
  off from the real UI reads as approximate.
- `pnpm check` and `pnpm build` pass.
