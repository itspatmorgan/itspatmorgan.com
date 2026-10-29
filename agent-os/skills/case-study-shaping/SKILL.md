---
name: case-study-shaping
description: Use when shaping, restructuring, or redesigning a Work case study on this site into the slide-like format proven by the Query Builder and Expansion case studies. Covers fact-finding (including pulling exact values from Figma or prototype code), the story outline, copy rules, native demos, motion, layout rhythm, review, launch, and cleanup.
---

# Case Study Shaping

## Purpose

Turn an existing Work entry into a case study a hiring manager can read in two
minutes: one point per slide, visuals carrying the argument, and every claim
true to what Patrick actually did.

Two reference implementations exist:

- Query Builder: `src/pages/work/query-language.astro` with demos in
  `src/components/query-builder/`
- Expansion: `src/pages/work/expansion.astro` with screens rebuilt from Figma in
  `src/components/expansion/`
- Shared layout and rhythm: `src/components/case-study/case-study.css`
- Shared demo plumbing in `src/components/case-study/`: `NativeStage`,
  `DemoControls` and `DemoCursor` (`NativeStage.tsx`), `useDemoLoop.ts` and
  `useRevealOnce.ts`. Stage and playback styles still live in
  `query-builder.css`, which every case-study page imports.

Reuse these patterns before inventing new ones.

## Skill Contract

- Facts come from Patrick and his source material, not from inference. Ask
  before stating any number, date, attribution, ship status, or team detail you
  cannot verify.
- All copy is a draft for Patrick's own words. Keep it short so it is easy to
  rewrite, and say so when presenting it.
- Outline before building. Get the headline sequence approved before touching
  layout.
- Build on a preview route that is not linked or indexed. Swap it onto the live
  slug only when Patrick says to.
- Present one coherent pass at a time, not a menu of options.
- Show only what the product really does. A scene may compress time or skip
  steps, but never invent behavior, dialogs, or states the product lacks.
- Name every liberty taken with a source screen in a code comment beside it,
  and flag illustrative values (sample counts, durations) to Patrick.

## Inputs

- The current entry in `src/content/projects/<slug>.{md,mdx}` and its images
- Any linked deck, Figma file, or video the entry embeds
- `agent-os/conventions/content.md` and `agent-os/conventions/styling.md`
- The roles Patrick is targeting, if he names them
- Patrick's answers to the fact-finding questions below

## Workflow

### 1. Read the sources, then fact-find

Read everything first: the entry, its embedded deck, and its Figma frames. Then
ask, in one batch, only what those sources don't answer:

- When was it, and what was Patrick's title? Who was on the team, and for how long?
- What was the problem in the user's own terms?
- What was the expected answer, and what did Patrick bet on instead?
- Which parts did Patrick design for this project, and which existed already?
- What changed, and how was it measured? Did it ship?
- Is there a quote, and who said it, in what capacity?
- What did Patrick learn, in his own words?

Write down anything unverified as an open question. Never smooth it over in the
copy. If there is no hard outcome, say so plainly rather than implying one.

### 2. Get exact values from the source

When source screens exist, rebuild them from the source's values, not by eye.

When the source is prototype code (the Sublime agents case study came from the
Design Studio archive):

- Inventory the real screens and their states first, and map each slide to one
  before building anything.
- Copy tokens, spacing, and icon paths from the source components. Never redraw
  an icon by hand; a hand-drawn mark reads as broken.
- Keep components where they sit in the real layout and keep the real order of
  content. A change that improves the design is welcome when it is named.

When the source is Figma:

- Prefer the Figma connector (`get_design_context`). If it is unavailable or
  rate-limited, use the signed-in browser: right-click the frame's layer, choose
  Copy/Paste as → Copy as code → CSS (all layers), and read the clipboard with
  `pbpaste`. That gives position, size, type, color, and radius for every layer.
- Use Copy as SVG for vector shapes (chart lines, logos). Its text is outlined,
  so it is not a substitute for real text.
- Layer names can be stale. Confirm visible text against a zoomed view of the frame.
- Extract repeated data (chart bars, sparklines) with a script into a data
  module, as in `src/components/expansion/figma-bars.ts`.
- Diagrams with no source frame follow the deck's visual style instead.

### 3. Outline the story

Draft the outline as a Claude Doc with one row per slide: headline, one-line
support, and the visual. Keep the doc in sync as copy changes. The arc that has
worked twice:

1. **Hero**: company mark, headline, one-line subline, and a brief with When /
   Role / Team / Outcome. Then the strongest visual.
2. **Problem**: what users faced, shown as it was.
3. **Bet**: the expected answer, and what Patrick bet on instead.
4. **Two or three moves**, each with its own visual.
5. **Ending**: what Patrick learned, plus what actually happened. If there is no
   measured outcome, pair the transferable lesson with the honest ending.
   Lessons are ideas, not screens: no product UI there, only quiet drawings on
   the same backdrop.

Put the bet directly after the problem, so the reader meets the why before the
how. Make each idea once: a point a demo makes doesn't need a principle that
repeats it. To show a metric, start from the surface the product built for it
(a dashboard tile, a report) rather than staging a run that produces it.

Cut any slide that only repeats the one before it. Merge an outcome slide and a
lessons slide when they make the same point.

### 4. Write the copy

- First person, past tense.
- Frame the strategy, not the feature. Expansion's hero is the go-to-market
  move ("for a new use case"), not the first use case ("bot defense").
- Each headline says why its step mattered. No sequence words ("First,",
  "Then,", "And"), no eyebrows, no step numbers.
- One supporting line per slide, one line at desktop width. Treat it as a hard
  limit: a slide that needs more is two slides, or belongs in an interview.
  Never text beside a headline.
- Keep brief values tight. Outcome can be qualitative ("A repeatable kit
  pattern") when there is no metric.
- Check every visual and value against the claim. Flag illustrative values
  (example inputs, sample counts) to Patrick.
- Use non-breaking hyphens (`‑`) in compound words that break badly on phones.
- Update the entry's `title` and `description` to match the new framing.

### 5. Build the visuals

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

### 6. Set the motion

- Loop only the visuals that explain a process (Expansion's agent flow and
  Signals sequence). Everything else plays once on scroll and holds
  (`useDemoLoop(..., once = true)` or `useRevealOnce`).
- Looping demos start on a complete frame. Under reduced motion, every demo
  shows its final frame without animating.
- On a loop restart, fade out, jump to the first frame with transitions off,
  then fade in. Never animate backward through the steps.
- Fade a text-heavy screen out before the next fades in. Keep shared chrome
  (the card) still and fade only its content.
- Prefer one live diagram whose elements move between states over crossfading
  whole frames.
- Show playback controls only on looping demos, pinned to the stage corner.
- Tune timing until there are no dead pauses.
- Each step changes one thing. When several things change at once, the
  in-between frames look broken even if the end state is right.

Camera and pointer scenes (zooms, pans, a cursor that clicks):

- A zoom frames one whole component with padding, and its crop lands at a
  layout gutter, never mid-word or past the page edge. Skip a zoom that only
  trims edges.
- Camera moves and pointer moves get separate steps. The pointer appears only
  after the camera lands.
- A new page arrives at full frame, never zoomed. Overlays that would run off
  the frame flip, as the product does.
- Direct attention with the camera, never with highlight rings or outlines that
  could pass for UI.

### 7. Lay out the page

Use the shared rhythm in `case-study/case-study.css`:

- Section titles cap at 40px; the hero title at 52px.
- One 960px measure: titles and stages fit within it, descriptions up to 840px
  with `text-wrap: pretty`.
- Spacing scale: 24 within a group, 48 to its visual, 72 from the hero brief,
  144 between sections (88 on phones).
- The brief stays on one row whenever it fits, via a container query.
- Navigation is "← Work" only.
- Check 390px, about 1140px, 1300px, and 1600px for wrapping, overflow, and
  centering.

### 8. Review holistically

Do this before Patrick's first round of comments, and again before launch.
Slide-by-slide comment rounds fix screens but let the arc drift.

Review in the browser in light and dark across narrative, layout, spacing, and
typography. Measure, don't eyeball: line counts per headline and description,
stage widths and heights, ring and radius on screen. Present ranked findings
(must fix, should fix, worth considering) before changing anything.

### Previewing for Patrick

The repo has no deploy previews, so Patrick reviews a published preview:

- Build, then publish the preview route's page and only the files it reaches
  as a private artifact. Rewrite absolute paths to relative ones (including
  JS template strings) and rename `_astro/` to `assets/`.
- The artifact viewer blocks browser storage. Test the page with
  `localStorage` throwing: the theme must still follow the system and the
  toggle must still switch it.
- Work through his comments one thread at a time. Reply with what changed, then
  resolve the thread. Republish to the same artifact so the link stays the same.

### 9. Launch

On Patrick's go-ahead:

1. Move the page onto the live slug and remove `noindex` and draft comments.
2. Exclude that slug from `src/pages/work/[...slug].astro`.
3. Update the homepage card summary in `featuredProjectDescriptions`
   (`src/pages/index.astro`), which is separate from the entry description.
4. Build, open a PR, merge on his say-so, and confirm the deploy and live page.

### 10. Clean up

- Delete merged branches (local, and on GitHub if permitted).
- Stop dev servers you started, and any orphaned ones running from removed
  dependencies.
- Ask before deleting untracked files; their deletion is permanent.

## Guardrails

- Never invent metrics, quotes, team members, dates, or ship status.
- Don't ship to the live site, merge, or publish without explicit approval.
- Keep pages free of text-heavy sections. If something needs a paragraph, it
  probably belongs in an interview, not on the page.
- No per-page note that the screens are recreated in code. The site says once,
  on the landing page, that this is shipped work rebuilt from Patrick's own
  prototypes.

## Gotchas

- After installing dependencies or restarting work, the dev server can serve a
  stale render (hydration mismatches, old styles). Touch the changed files, or
  stop and restart the server with `pnpm astro dev stop`.
- Don't mix the `transition` shorthand with `transitionDelay` in React inline
  styles; use separate properties.
- Flex containers drop spaces around inline elements; wrap mixed text in a span.

## Verification

- `pnpm build` passes.
- In the browser at 390px, about 1140px, and 1600px, in light and dark: no
  horizontal overflow, no console errors, and every description on one line at
  desktop width.
- Every animated scene checked frame by frame (contact sheets about 250ms
  apart) at desktop and phone widths before each publish, not only its end
  state.
- The theme works with browser storage blocked.
- Every claim on the page maps to an answer from fact-finding or a source.
