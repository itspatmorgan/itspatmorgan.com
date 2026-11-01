---
name: build-case-study-demo
description: Builds and animates a native product demo on a Work case study or the Design Studio page, a real screen recreated in React and played by the shared scene player, including camera and pointer moves, captions, timing, loops and phone views. Use when adding or changing a demo. Story and copy belong to shape-case-study; Work cards to build-project-card.
---

# Build a Case Study Demo

Recreate a real product screen as a native demo and animate it so a visitor
understands the step at a glance. Demos are the strongest proof on the site and
the easiest place to look approximate, so they follow one pattern.

Read `agents/principles/design.md` ("Show the real work", "Feel is part of the
design", "The whole picture on every screen") and `agents/context/motion.md`
first. Motion rules live there; this skill covers how to build.

## Inputs

- The slide's point and line, from the entry's `caseStudy` block.
- The source: prototype code, Figma or screenshots, with exact values pulled as
  in the `shape-case-study` fact-finding reference.
- Shared plumbing in `src/components/case-study/`: `NativeStage`,
  `useDemoLoop.ts`, and `scene.tsx` (`useScene`, `SceneFrame`, `DemoFrame`,
  `SceneTour`, `Camera`, `Pointer`, `Zoom`, `Expand`, `Screens`, `CountUp`,
  `Typing`). The Sublime scenes are the most current pattern.

## Build the screen

- Prefer native React over screenshots. Render each screen at its source frame
  size inside `NativeStage` so it scales crisply.
- Every demo works in light and dark. Namespace demo tokens (`--x-*`, `--q-*`);
  never reuse site token names like `--radius` or `--ring`.
- One backdrop for every slide: the stage's `texture-bg`. No extra dark panels
  or nested containers.
- Every stage has the same proportions (1240 × 900). Crop larger frames rather
  than letting stages differ in height.
- Frame cards share one ring and radius on screen. A frame drawn at another size
  sets `--x-card-ring` and `--x-card-radius` scaled by its width over 1240.
- Charts: fewer, thinner bars read better than every source column. Snap bars to
  device pixels on one shared baseline and stack merged series in legend order
  (see `Bars` in `ExpansionUI.tsx`).
- To compare two representations of one thing, use a toggle that takes the full
  stage, not a side-by-side split.
- Overlays that would run off the frame flip, as the product does.
- Strip UI that doesn't serve the story: info icons, unused controls, chrome.
- Shape sample data to support the story where the source allows it, and fit
  table columns to their widest content so the main column gets the room.

## Animate it

1. Write the steps first: one change per step, camera and pointer moves on
   separate steps. Decide loop or hold by whether the end state is the point
   (`motion.md`, Scenes).
2. Run it on `useScene(timings, captions, { loop })` inside `SceneFrame` (a
   screen in the card that bleeds off the stage) or `DemoFrame` (a demo on the
   plain stage). `SceneTour` adds the controls.
3. Write captions only where they add something; otherwise pass
   `caption={false}`. Captions still name each segment for screen readers.
4. Tune timings to the payoff hold and loop seam in `motion.md` until there
   are no dead pauses.
5. Check the poster frames: the first and resting frames are complete.

## Phones

Case study demos keep the whole desktop frame on phones (`motion.md`, Phones).

- `SceneFrame`: step 0 and reduced motion show the whole stage. Pass a `focus`
  for later steps, usually `onCard(t.rect(key), view)` with `'start'`,
  `'center'` (a pointer target) or `'end'` (buttons at a row's right).
- `DemoFrame`: no crop by default. For a closer look, pass `NativeStage` the
  result of `zoomCrop(width, height, at)`, and `null` as `at` on other steps so
  the view eases in and out.
- Product and landing page visuals (the Design Studio page) get their own phone
  design in the page's square frame instead (`motion.md`, Phones).

## Other formats

The same scenes are drawn for slides and social posts by the visual library
(`export-visual`). Keep a scene's layout driven by `useStage` (`stage.W`,
`stage.box`) rather than fixed stage numbers, so it lays out in any format, and
mark the regions a close look would frame with `data-frame`.

## Verification

- `node scripts/frame-check.mjs --url http://localhost:4321/work/<slug> --slides <ids>`
  saves frame-by-frame contact sheets at desktop and phone widths. Look at every
  camera move, transition and the loop seam, not only end states.
- Both themes, reduced motion (lands on the final frame), and 390px.
- Compare against the source screen before showing Patrick; anything slightly
  off from the real UI reads as approximate.
- `pnpm check` and `pnpm build` pass.
