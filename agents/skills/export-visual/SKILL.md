---
name: export-visual
description: Draws case study scenes for formats beyond the site, such as a slide deck or a social post, from the visual library in src/visuals, and records them. Use when a case study's visuals are needed outside the site, or when adding a format, a visual or a detail (a close look at one part of a screen) to the library. Building or changing the demos themselves belongs to build-case-study-demo.
---

# Export a visual

## Purpose

One source for each piece of work, drawn correctly for each place it is shown. The case study scenes in `src/components/sublime/`
and `src/components/studio-case/` are the source: real product screens, recreated natively. The site shows them in its responsive
stage. The library (`src/visuals/`) draws the same scenes in fixed formats, a 1920 × 1080 slide or a 4:5 social post, laid out for
that format rather than cropped from the site's stage, and records them for use elsewhere.

The deck and the site tell the same story at different depths: the site is a quick look for recruiters and hiring managers, the
deck a 45 to 60 minute conversation. They don't need one-to-one parity, but they draw from this one library, so a fix to a
product screen reaches both.

## How it fits together

- `src/components/case-study/scene.tsx`: `FormatContext`. Under it, `useStage` lays the scene's screen out for the format and
  `SceneFrame` draws the stage at exactly the format's size, with no tour. Without it, nothing changes: the site never sets it.
- `src/visuals/formats.ts`: the formats. Each is a stage size with the card's inset, top and ring, in the format's pixels.
- `src/visuals/library.ts`: the visuals. Each names a scene (by lazy import), its props, its project, its `poster` step and its
  details.
- `src/visuals/Gallery.tsx` at `/visuals`: every visual in every format, plus its details. It exists only under `pnpm dev`
  (the `visualLibrary` integration in `astro.config.mjs`) and never reaches the built site.
- `scripts/visuals-record.mjs`: records a visual's card as an mp4 of one cycle plus its poster still, or a detail as a still, into
  `visuals-out/` (ignored by git).

## Guardrails

- **The site must not change.** Any change to `scene.tsx` or a scene keeps the site's output identical: same built HTML and CSS
  as `main` (hashed asset names aside), and the same pixels on every case study at 1440 and 390 wide. Check it before merging
  (Verification).
- **Lay out, never squash or slice.** A format changes the stage the screen lays out in, so a taller format shows more of the page
  and a wider one more across. If the story doesn't fit a format, change the format or pick a detail; never crop the action,
  the result or a real word.
- **The visual is the point.** In a slide, the screen takes the space and a one-line headline is the most it shares the frame
  with. If a layout hides most of the screen (a split that crops it, a headline that pushes it down), change the layout or show
  a detail.
- **One gutter.** The card sits the same distance from the format's sides and top (the site's stage uses about 5% of its width)
  and runs off the bottom, unless the screen ends (`contained`), when it sits whole with that gutter all round.
- **The poster tells the story.** Most people see one frame: a slide printout, a thumbnail, a post before it plays. Set `poster`
  to the step whose frame says it all with the result on screen, never one caught mid-change.
- **A detail is a close look with its context.** Frame a whole component (the tiles with their heading, a table with its header
  row) and its own padding, drawn natively at the larger size, not an upscaled crop. In a slide, a detail sits in front of its
  screen like a satellite: straddling the screen's edge or over its margin, not floating apart and not hiding the thing it shows.
- **Fades only at the foot.** A screen may fade out over filler at its bottom edge; never fade a side or the subject.

These adapt the framing and rehearsal rules of Benji Taylor's Stageshow skill
(https://github.com/benjitaylor/skills/tree/main/stageshow, MIT) to real designs: Stageshow simplifies a product into an
illustration, while this library shows the actual screens, so its word budgets and placeholder bars don't apply.

## Workflow

1. **Name the point.** For each place a visual will appear, write the one thing it shows. Pick the format, and whether the whole
   screen, a detail or both carry it.
2. **Add or reuse the visual** in `library.ts`. Mark any region a detail needs with `data-frame` in the scene if it isn't marked
   already (an attribute only, so the site is unchanged).
3. **Look at it** in `/visuals` at its true size (`?id=<id>&format=<format>[&detail=<id>]`). Judge it the way the most exacting
   designer you know would: what does the eye land on first, and is it the point? Fix framing first, then hierarchy, then
   motion, then polish.
4. **Record it**: `node scripts/visuals-record.mjs <id> --format slide` (or `--detail <id>`, or `--all`). Step through the mp4's
   frames (a contact sheet with ffmpeg) and the poster before using them.
5. **Place it.** The deck or post draws the backdrop (the site's texture) and the card's ring; the recording is the card alone, so
   the same file works on any layout.

## Adding a format

Add it to `formats.ts` with its size and the card's inset, top and ring. Keep the gutter rule. Add its size to `sizes` in
`scripts/visuals-record.mjs`. Check every visual in `/visuals`: a format that leaves a screen with empty bands or cuts its point
needs a different inset or isn't right for that visual.

## Verification

- `/visuals` renders every visual in every format with no console errors; a recorded loop starts and ends on the same frame.
- The site is unchanged: build `main` and the branch, compare every page's HTML and the CSS (normalizing hashed asset names), and
  compare full-page screenshots of the case studies at 1440 and 390 with reduced motion. Rerun any page that differs; pages with
  live or lazy content (the home page, `/design-studio`) differ run to run on `main` too.
- `pnpm build`, `node scripts/check-site.mjs` and `pnpm test` pass, and `dist/` has no `visuals` route.
