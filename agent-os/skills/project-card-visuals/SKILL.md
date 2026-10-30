---
name: project-card-visuals
description: Use when creating or refining the live visual on a case study's project card (the homepage Work cards and the Work page cards), in place of a static thumbnail. Covers choosing the one idea a card shows, the shared two-layer card system, composing it from the case study's real product components, motion, review, and verification.
---

# Project Card Visuals

## Purpose

A project card has one job: make a recruiter or hiring manager, scanning the
homepage, want to open the case study. Its visual is not a shrunken screen and
not the case study's hero. It is a small composition, drawn for the card, that
shows the one idea of that case study in about a second.

Reference implementations, one per case study:

- `src/components/sublime/SublimeCard.tsx`: an agent and its result. ADÉ's hub
  card with its artwork behind; the rule it auto-accepted in front.
- `src/components/query-builder/QueryCard.tsx`: a translation. The builder
  behind; the same query as code in front; each pair lights together.
- `src/components/expansion/ExpansionCard.tsx`: a result. The product's stacked
  bar chart behind; its legend in front.
- `src/components/design-studio/StudioCard.tsx`: a range. Design Studio's
  artifact types in front; behind, the artifact selected. Hover walks the list
  and the panel becomes each one, so the hover adds what the list only names.
  It sits in the wide Design Studio card beneath the homepage's two Work cards, so it is drawn at 560 × 315
  (`ProjectCardStage` takes `width` and `height`), and at 400 × 225 on phones
  and on its Work page card (`size="card"`).

Shared plumbing:

- `src/components/case-study/ProjectCardStage.tsx` and `project-card.css`: the
  400 × 225 frame, the `pc-bg` / `pc-fg` layers, `pc-title`, the hover lift and
  the play-once-and-replay-on-hover behavior.
- `src/components/ProjectDemo.astro`: renders a slug's card visual inside an
  inert frame. List the slug in `src/data/project-demos.ts`.
- `src/components/ProjectCard.astro`: a card with a `visual` slot becomes a box
  with one stretched link, because a demo can hold links and links can't nest.

## Skill Contract

- Show only what the product really does, built from the case study's own
  components and data. A card may stage, crop, simplify or reduce (fewer bars,
  fewer rows), but never invents UI, states or numbers. Name every liberty in a
  comment beside the component.
- The card and the case study's hero don't have to match. Each does its own job.
- Present a recommended concept with one or two real alternatives before
  building, and say why. Then build one at a time.
- Judge it beside its neighbors. Cards that sit together must not say the same
  thing (two cards that are both "a panel of code" cancel each other out).

## Workflow

### 1. Find the one idea

Name, in a few words, what makes this case study different from the others,
from a recruiter's point of view: a translation (code becomes controls), an
agent and the trust it earns, a result on a dashboard. The card shows that and
nothing else.

- Lead with the product's most distinctive asset when it has one (Sublime's
  agent artwork). It carries more than any amount of UI chrome.
- Settings forms, tables and screens of controls read as admin chrome. Avoid
  them unless the controls are the idea, and even then show the fewest.
- Look at strong marketing sites for the shape of the answer, not their
  styling. Stripe's feature cards (one simple visual behind, one crisp card in
  front, one anchor) and Linear's (real UI at real size, a quiet layer behind)
  are the closest to this format.

### 2. Compose on the shared system

- Draw at 400 × 225, close to the card's real size (330 to 580px wide), so text
  stays at UI sizes: 12 to 15px, titles 13px semibold (`pc-title`), one larger
  anchor number at most.
- Two layers, no more. Behind (`pc-bg`): one large, simple panel, 28px from the
  left, running off the right and bottom edges, which fade. In front
  (`pc-fg`): one small, crisp card with the thing to read, placed where the
  panel behind is empty.
- A front card that overlaps the panel sits inset from the panel's sides and
  crosses one of its edges, like a card set down on another (Sublime's status
  over the agent card's bottom edge; Query Builder's code over the builder's
  top edge). Never line a front card's edge up exactly with the panel's edge:
  tangent edges read as one jagged shape.
- No dead zones. When a panel's fade leaves empty space under the front card,
  make the panel whole (all four corners) instead, and balance the margins:
  measure them, top and bottom equal.
- One accent per card, from the product's own palette. Mute everything else.
- Front cards share one spec: 16 × 18 padding, 10px radius, the shared shadow.
- Align to something. A front card's edge lines up with a column, a control or
  the content behind it, not with nothing.
- Charts keep the product's chart type (stacked bars stay stacked bars). Show
  only series whose source chart and legend agree, in the source's colors and
  stacking order, with the legend in front matching them. Use fewer, wider
  bars than the source so they read at card size.

### 3. Set the motion

- One focused change per card: pairs light up, a status settles, bars rise.
- A card rests on its last frame, and that frame makes the point by itself:
  it is what most visitors see, and all that touch devices ever show.
- It plays only on hover, never on load or scroll. A card that starts by
  itself is often caught half on screen or mid-step as the page loads, which
  reads as broken. Hovering plays it from its first frame back to the last,
  with no fade, and lifts the front card a few pixels.
- The first frame is complete too. No blank chart, no hidden rows, no empty
  second line, since the hover starts there.
- When text changes between states, keep the layout still: fixed column widths
  and a second line that is always filled (the prototype's own in-progress
  copy, then the result).
- Reduced motion shows the last frame only.
- Cards use `useDemoLoop(timings, timings.length - 1, false, true)`, which
  starts on the last step, and `ProjectCardStage`, which replays on hover.

### 4. Review

Review in the browser at real card sizes, then in a large temporary frame for
detail. Check against:

- Clarity: can the point be said with less? Would it make someone click?
- Hierarchy and focus: one anchor, the eye lands there first.
- Gestalt: related things grouped by proximity, linked by similarity (a
  legend's color matches its series; a code token lights with its control).
- Spacing and alignment: measured margins, equal where they should be.
- Noise: nothing decorative that doesn't serve the idea.
- The neighbors: does the set read as one system without repeating itself?

Present ranked findings before changing anything, as with case studies.

## Guardrails

- No static thumbnails for case studies with live cards.
- Never invent numbers. When the source mock-up disagrees with itself, show
  only what agrees, and say why in a comment.
- No links inside the visual; the card is one link.
- Keep each card's styles in its product's stylesheet, namespaced (`sb-pc-*`,
  `qc-*`, `xc-*`), using the product's tokens.

## Gotchas

- Set a card's own variables (`--pc-surface`, `--pc-line`, accents) on the
  element where the product's tokens are defined. Query Builder's tokens live on
  `.cs-native`, so its card variables are set there, not on the figure.
- Production bundles the stylesheets in a different order from development, so
  equal-specificity rules can resolve differently once deployed. The shared
  base rules (`.pc-bg`, `.pc-fg`, `.pc-title`, `.pc-cue`) are wrapped in
  `:where()` so a card's own rules always win; keep new shared rules that way.
  Check cards in a production build (`pnpm build`, then the `preview` launch
  configuration on port 4322) before shipping, not only in `pnpm dev`.
- The dev server often keeps serving old modules and styles after edits to
  these components. Restart it before judging a change.
- Background browser tabs pause the card's timers. Test motion and hover in a
  tab that is in front.
- Measure text and column widths with a DOM `Range` in canvas units before
  fixing widths; grid items report their column's width, not their text's.

## Verification

- `pnpm build` passes.
- The homepage and the Work page, at about 390px, 1140px and 1600px, in light
  and dark: no overflow, no clipped text, no console errors.
- Each card loads on its last frame without moving, and plays from its first
  frame on hover, checked in a visible tab.
- Margins and alignments measured, not eyeballed.
- Every value on the card traces to the case study's source data.
