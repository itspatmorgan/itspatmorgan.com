---
name: case-study-shaping
description: Use when shaping, restructuring, or redesigning a Work case study on this site (for example the Expansion or Characters entries) into the slide-like format proven by the Query Builder case study. Covers fact-finding, the story outline, copy rules, native demos, layout rhythm, review, and launch.
---

# Case Study Shaping

## Purpose

Turn an existing Work entry into a case study a hiring manager can read in two
minutes: one point per slide, visuals carrying the argument, and every claim
true to what Patrick actually did.

The reference implementation is the Query Builder case study:

- Page: `src/pages/work/query-language.astro`
- Layout and rhythm: `src/components/query-builder/case-study.css`
- Native demos and tokens: `src/components/query-builder/` (`NativeUI.tsx`,
  `useDemoLoop.ts`, `query-builder.css`, and the demo components)

Reuse its patterns before inventing new ones. If a second case study needs the
same pieces, propose extracting them into shared components first.

## Skill Contract

- Facts come from Patrick, not from inference. Ask before stating any number,
  date, attribution, or team detail you cannot verify in the repo.
- All copy is a draft for Patrick's own words. Keep it short so it is easy to
  rewrite, and say so when presenting it.
- Outline before building. Get the headline sequence approved before touching
  layout.
- Build on a preview route that is not linked or indexed. Swap it onto the live
  slug only when Patrick says to.
- Present one coherent pass at a time, not a menu of options.

## Inputs

- The current entry in `src/content/projects/<slug>.mdx` and its images
- `agent-os/conventions/content.md` and `agent-os/conventions/styling.md`
- The roles Patrick is targeting, if he names them
- Patrick's answers to the fact-finding questions below

## Workflow

### 1. Fact-find

Ask in one batch, and only for what the current entry doesn't already answer:

- When was it, and what was true about the world then that matters?
- What was Patrick's role, and who else was on the team? How long did it take?
- What was the problem in the user's own terms?
- What did Patrick believe that others didn't, and was it actually a bet?
- What were the two or three moves that solved it?
- What changed, and how was it measured? Is there a before and after?
- Is there a quote, and who said it, in what capacity?
- With hindsight, what would Patrick do differently today?

Write down anything unverified as an open question. Never smooth it over in the
copy.

### 2. Outline the story

Draft the outline as a Claude Doc (or in chat if Patrick prefers) with one row
per slide: headline, optional one-line support, and the visual. The arc that
worked:

1. **Hero**: company mark, headline (the achievement), one-line subline, and a
   brief with When / Role / Team / Outcome. Then the strongest demo.
2. **Problem**: what users faced, shown as it was.
3. **Insight or bet**: the belief that shaped the solution.
4. **Two to three moves**: "First, I…", "Then, I…", "And I…", each with its
   own visual.
5. **Outcome**: a before/after graphic plus at most one quote.
6. **Today**: what Patrick would do now. Only include it if it's true for him.

Cut any slide that is just another example of the previous one. Fold it into
the slide it supports or drop it.

Keep the outline doc in sync with the page as copy changes.

### 3. Write the copy

- First person, past tense ("I designed", "New customers were querying").
- The headline is the point. If the slide needs a label to explain it, rewrite
  the headline.
- At most one supporting line per slide, and never text set beside a headline.
- No eyebrows, step numbers, or A/B labels.
- Let headlines wrap naturally. Never force line breaks.
- Keep brief values tight ("2022, pre-ChatGPT", not a clause). Outcome is a
  comparison ("First query in 1 day, not 21").
- Name things the way the user knows them, and explain jargon only once
  ("hundreds of cyber asset types", not "classes").
- Check every visual against the claim. A demo that implies a capability the
  product didn't have is a false claim.

### 4. Build the visuals

- Prefer native React demos over screenshots or videos. Render them at a fixed
  canvas inside `NativeStage` so they scale crisply.
- Every demo works in both light and dark. Use the `--q-*` token pattern. In
  dark mode, surfaces step lighter with elevation: page, then stage, then
  window, then popover.
- Stages use the site's `texture-bg` class, not a dot grid.
- Use one window width across the page (880px in the reference).
- When two representations of one thing need comparing, use a toggle that
  takes the full stage, not a side-by-side split.
- Loops run through `useDemoLoop`. They play only when visible, respect
  reduced motion, and can be paused. Start on the final frame when the end
  state is the point.
- Tune the timing until there are no dead pauses or lingering hovers.
- Give every interactive state one consistent treatment: the same hover fill,
  outlined badges, and radii (6px for chips and fields, 8px for panels and
  menus). Brand accent colors are not hover states.
- Show outcomes visually, such as day blocks for 21 versus 1. Don't repeat the
  numbers in prose.

### 5. Lay out the page

Match the reference rhythm in `case-study.css`:

- Slides are centered, with 168px between them.
- Headline to supporting line is 20px. Line to stage is 48px.
- The hero headline is smaller than the slide headlines it introduces.
- Navigation is "← Work" only, with no footer CTA unless Patrick asks for one.
- The brief stays on one row whenever it fits. Use a container query, not a
  viewport breakpoint, and fall back to a 2×2 grid.
- Check 390px, about 965px, and 1300px or wider for wrapping, overflow, and
  centering.

### 6. Review holistically

Before calling a pass done, review it in the browser in light and dark across
four lenses:

- **Narrative**: does each slide make exactly one true point, in order?
- **Layout**: centering, alignment, and consistent widths.
- **Spacing**: is the vertical rhythm the same everywhere, with no cramped hover
  padding?
- **Typography**: wrapping, size steps, and no orphaned words in headlines.

Fix what you find, then report what changed in a few bullets.

### 7. Launch

On Patrick's go-ahead:

1. Move the page onto the live slug.
2. Exclude that slug from `src/pages/work/[...slug].astro`.
3. Remove `noindex` and draft comments.
4. Build, open a PR, and merge on his say-so.
5. Confirm the live URL loads without console errors.

List any open fact questions in the closing message.

## Guardrails

- Never invent metrics, quotes, team members, or dates.
- Don't ship to the live site, merge, or publish without explicit approval.
- Don't delete original assets. Leave unused ones and mention them.
- Keep pages free of text-heavy sections. If something needs a paragraph, it
  probably belongs in an interview, not on the page.

## Verification

- Run `pnpm build` cleanly.
- Check in the browser at 390px, about 965px, and 1300px, in light and dark,
  with no horizontal overflow and no console errors.
- Every claim on the page maps to an answer from fact-finding or the original
  entry.
