# Layout

Use the shared rhythm in `src/components/case-study/case-study.css`:

- Section titles cap at 40px; the hero title at 52px.
- One 960px measure: titles and stages fit within it, descriptions up to 840px
  with `text-wrap: pretty`.
- Spacing scale: 24 within a group, 48 to its visual, 72 from the hero brief,
  144 between sections (88 on phones).
- The brief stays on one row whenever it fits, via a container query.
- Navigation is "← Work" only.
- Check 390px, about 1140px, 1300px, and 1600px for wrapping, overflow, and
  centering.

## Gotchas

- A page imports `case-study.css` first, then its product's stylesheet, so
  product rules win over the shared ones at equal specificity. Don't import a
  product stylesheet from inside a component: production puts component CSS
  ahead of page CSS, which flips that order.
- After installing dependencies or restarting work, the dev server can serve a
  stale render (hydration mismatches, old styles). Touch the changed files, or
  stop and restart the server with `pnpm astro dev stop`.
- Don't mix the `transition` shorthand with `transitionDelay` in React inline
  styles; use separate properties.
- Flex containers drop spaces around inline elements; wrap mixed text in a span.
- Animation gotchas, such as never animating to `height: auto`, are in
  `agents/context/motion.md`.
