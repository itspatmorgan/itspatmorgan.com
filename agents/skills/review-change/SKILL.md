---
name: review-change
description: Reviews a change against the site's principles and checks before Patrick sees it, with screenshots, frame-by-frame motion and ranked findings, or reviews one area of the repository for cleanup. Use before asking Patrick to review a pull request, before launch, or when asked for a maintenance or refactor pass.
---

# Review a Change

Catch what Patrick would catch, before he has to. A review reports first and
fixes after: present ranked findings, then change only what's agreed or
clearly in scope.

Read `agents/audience.md`, `agents/principles/design.md` and
`agents/principles/engineering.md`. They are the standard.

## Mode 1: a change

1. **Scope.** List the pages, components and content the change touches, from
   the diff. Note which visitors see.
2. **Checks.** Run `pnpm check`, `pnpm test`, `pnpm build` and
   `pnpm check:site`. Save long output to a temporary log and report only
   failures and warnings.
3. **Look at it.** For anything visible, capture each touched page before
   (production) and after (the PR preview link, or `pnpm dev`), in light and
   dark, at desktop (about 1300px) and 390px. Lay them side by side.
4. **Look at the motion.** For each touched scene or card, run
   `node scripts/frame-check.mjs --url <page> --slides <ids>` and read the
   contact sheets against `agents/context/motion.md`: poster frames complete,
   one change per step, no single-frame snaps, the loop seam, the payoff hold,
   and phone framing. Check reduced motion lands on the final frame.
5. **Read it.** Every headline, line and caption against the copy rules: one
   point, plain and specific, sentence case, one line where the rules say one
   line, no text overflowing its box.
6. **Judge it** as the audience would, at a glance and then up close: does
   each surface make one point, does it look like real product, does it match
   its neighbors?
7. **Report** in the conversation:

   ```md
   ## Review: <change>
   Checks: pass | failures listed
   Must fix: …
   Should fix: …
   Worth considering: …
   Not verified: states, widths or themes that couldn't be checked
   ```

   Attach the before/after and contact sheets as files outside the repository.

## Mode 2: an area

When asked for a maintenance or refactor pass, review one focused slice rather
than the whole repository: routes, content and schemas, scripts, Lab, shared
components, agent docs, or CI. Look for dead code, duplication, rules that only
live in docs but could be checks, and anything that makes the next change
harder. Report ranked findings with the scope and verification for each, and
implement only what Patrick approves.

## Guardrails

- Report before fixing. Don't weaken a check or a rule to make a review pass.
- Distinguish a broken rule from a suggestion.
- Say what you couldn't verify. A green build doesn't prove a page looks right.
- Screenshots and sheets never go in the repository.
