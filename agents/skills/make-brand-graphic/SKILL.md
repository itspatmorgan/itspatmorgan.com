---
name: make-brand-graphic
description: Makes on-brand static graphics that aren't recreated product screens, such as diagrams, illustrations, charts, closing-lesson drawings, hero compositions and card art. Use when a page needs one. Product demos use build-case-study-demo; share cards use make-share-card.
---

# Make a Brand Graphic

## Purpose

Make graphics that look like they belong to the site: quiet, warm and
precise, so they support the work instead of competing with it. Patrick's
feedback on past graphics is the brief.

Read `agents/principles/design.md` and the design system at `/style-guide`
(`src/pages/style-guide.astro`) first.

## First, ask whether it should be a graphic at all

- If a real product screen can make the point, use the screen (see
  build-case-study-demo). Graphics are for points with no interface: a strategy, a
  system, a lesson, a comparison over time.
- If the slide's headline and line already make the point, the graphic may
  not be needed.

## Rules

- **The site's palette and type only.** Neutrals from the color tokens, the
  copper `accent` for the one thing to notice, Geist and Geist Mono. No
  bright infographic backgrounds, gradients or glass effects.
- **One idea, one path for the eye.** Emphasize the point by quieting
  everything else. Five box-and-line diagrams in a row read as filler; vary
  the form or cut some.
- **Real content, never stand-ins.** No gray-bar thumbnails, invented
  documents or lorem text. Use the real names, numbers and artifacts.
- **Lead with the benefit.** Diagram labels say what something does for
  people, not what it is.
- **Sentence case, no all-caps labels or eyebrows.**
- **Both themes are first-class.** Build with the color tokens so dark mode
  follows; terminals and code panes follow the page theme, never a forced
  dark panel.
- **Precision.** Logos and icons optically centered, even spacing, lines
  snapped to whole pixels, nothing almost aligned.
- **Before and after reads as time.** When a graphic shows a change over
  time, make the jump obvious with a date marker, not only a caption.
- **Lessons are quiet.** Closing-lesson slides use simple drawings on the
  textured stage, with no product UI.

## Workflow

1. Write the single point the graphic makes, in one sentence.
2. Sketch two or three directions in code (HTML/SVG or a React component on
   the case study stage) and pick the one that makes the point fastest. Show
   Patrick the pick and an alternative when the choice is his.
3. Build it with tokens and the shared stage, so it matches its neighbors.
4. Review it beside the slides or cards around it, in both themes and at
   390px.

## Verification

- Light, dark and phone screenshots look intentional side by side.
- Every label is true and specific. Nothing in it is invented.
- `pnpm check` and `pnpm build` pass.
