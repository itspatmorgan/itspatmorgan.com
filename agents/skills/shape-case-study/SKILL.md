---
name: shape-case-study
description: Shapes a Work case study into the site's slide-like format, from fact-finding and the story outline to copy, page layout, review and launch. Use when creating, restructuring or rewriting a case study. Demos use build-case-study-demo; the Work card uses build-project-card.
---

# Shape a Case Study

Turn a Work entry into a case study a design leader can read in two minutes:
one point per slide, visuals carrying the argument, and every claim true to
what Patrick did. Read `agents/audience.md` and `agents/principles/design.md`
first; they set the bar.

## How a case study is built

- Words live in the entry's `caseStudy` block in `src/content/projects/<slug>.md`:
  company, subline, share text and image, brief, and each slide's title and line
  by id (format in `agents/context/content.md`). Copy edits never touch the page.
- The page, `src/pages/work/<slug>.astro`, places visuals only:
  `getCaseStudy('<slug>')` from `src/lib/case-study.ts`, `CaseStudyLayout`, then
  one `<Slide {...slide('<id>')}>` per point.
- Shared layout and rhythm are in `src/components/case-study/case-study.css`
  (`cs-` classes). Each product has its own stylesheet and namespace (`qb-*`,
  `xp`, `sb`, `sc`), passed to the layout as `product`.
- References: Sublime agents (`src/components/sublime/`, the most current scene
  pattern), Query Builder, Expansion, and Design Studio
  (`src/components/studio-case/`, a tool shown through real work made in it).

Reuse these patterns before inventing new ones.

## Contract

- Facts come from Patrick and his sources, never inference. Ask before stating
  any number, date, attribution, ship status or team detail you can't verify.
- Copy is a draft for Patrick's own words: short, easy to rewrite, and
  presented as a draft.
- Outline before building. Get the headline sequence approved first.
- Build behind `noindex` with the entry `draft: true` until Patrick says launch.
- Present one coherent pass at a time, not a menu of options.
- Show only what the product does. A scene may compress time or skip steps,
  never invent behavior. Name every liberty in a code comment beside it, and
  flag illustrative values to Patrick.

## Workflow

1. **Fact-find.** Read every source, then ask one batch of questions about
   what they don't answer. Pull exact values from Figma or prototype code.
   See [fact-finding](references/fact-finding.md).
2. **Outline.** One row per slide: headline, one line, the visual. Use the arc
   and cutting rules in [story and copy](references/story-and-copy.md). Keep
   the outline in the conversation or a Claude Doc, never the repository.
3. **Write the copy** to the rules in [story and copy](references/story-and-copy.md).
4. **Build the demos** with the `build-case-study-demo` skill.
5. **Lay out the page** to the shared rhythm in [layout](references/layout.md).
6. **Review the whole page** before Patrick's first round and again before
   launch: narrative, layout, spacing and type, in both themes, through the
   eyes of the readers in `agents/audience.md`. Measure, don't eyeball. Run the
   `review-change` skill and present ranked findings (must fix, should fix,
   worth considering) before changing anything.
7. **Share for review.** Open a pull request; Patrick reviews on its preview
   link. Work through his comments one at a time and push to the same branch.
8. **Launch** on Patrick's go-ahead: move to the live slug, drop `noindex` and
   `draft`, update the entry's `summary` (the homepage card line), give the card
   a live visual with `build-project-card`, and make a share card with
   `make-share-card`.
9. **Wrap up** with the `wrap-up` skill.

## Guardrails

- Never invent metrics, quotes, team members, dates or ship status.
- No text-heavy sections. Something that needs a paragraph belongs in an
  interview, not on the page.
- No per-page note that the screens are recreated in code.

## Verification

- `pnpm check`, `pnpm build` and `pnpm check:site` pass.
- At 390px, about 1140px and 1600px, in light and dark: no overflow, no console
  errors, every description on one line at desktop width.
- Every scene checked frame by frame (`build-case-study-demo`).
- Every claim on the page maps to a source or one of Patrick's answers.
