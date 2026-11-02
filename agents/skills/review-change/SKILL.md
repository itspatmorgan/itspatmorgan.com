---
name: review-change
description: Reviews a change against the site's principles and checks before Patrick sees it, fixing what it finds and repeating until clean, with screenshots, frame-by-frame motion and ranked findings; or reviews one area of the repository for cleanup. Use before asking Patrick to look at any visible change, before launch, or when asked for a maintenance or refactor pass.
---

# Review a Change

Catch what Patrick would catch, before he has to. For your own change, review
and fix in a loop until it's clean, so he only sees work that already passes.
For anyone else's work or a wider area, report first and fix only what's
agreed.

Read `agents/audience.md`, `agents/principles/design.md` and
`agents/principles/engineering.md`. They are the standard.

## Mode 1: a change

One round is the steps below. Run rounds until the change is clean (see "The
loop").

1. **Scope.** List the pages, components and content the change touches, from
   the diff. Note which visitors see.
2. **Checks.** Run `pnpm check`, `pnpm test`, `pnpm build` and
   `pnpm check:site`. Save long output to a temporary log and report only
   failures and warnings.
3. **Make the sheets.** With `pnpm dev` running (or the PR preview link as
   `--after`), run:

   ```bash
   node scripts/review.mjs --pages /work/<slug>,/design-studio --motion --out <scratch>/review
   ```

   It saves before/after sheets for each page in light and dark at 1300px and
   390px (demos at their final frame), each scene's first frame beside its
   resting frame, and frame pairs for possible single-frame snaps. It reports
   sideways scrolling, clipped text, all-caps text, a last word alone on its
   line in short text, captions that wrap at desktop width, console errors,
   blank first frames, snaps, and phone zooms that are fast or back to back. Add `--square` for product pages whose phone visuals share
   a square frame, and `--scenes 2,4` to limit the motion pass. Production is
   the default "before"; a new page has none.
4. **Look at the motion.** Open the sheets and read them against
   `agents/context/motion.md`: poster frames complete, one change per step, the
   loop seam, the payoff hold and phone framing. For a camera move or
   transition that needs a closer look, run
   `node scripts/frame-check.mjs --url <page> --slides <ids>` for contact sheets
   every 250ms. The script flags candidates; you decide which are real.
5. **Read it.** Every headline, line and caption against the copy rules: one
   point, plain and specific, sentence case, one line where the rules say one
   line, no text overflowing its box.
6. **Judge it** as the audience would, at a glance and then up close: does
   each surface make one point, does it look like real product, does it match
   its neighbors?
7. **Rank** what you found: must fix (breaks a rule or a check), should fix,
   worth considering.

## The loop

Before Patrick sees a visible change:

1. Run a round. Fix every must fix and should fix that belongs to the change.
2. Run another round on what the fixes touched. Keep it fast: review the
   local build (`pnpm build && pnpm preview`), limit `--pages` and `--scenes`
   to what changed, and add `--motion` only when motion changed.
3. Stop when a round finds nothing to fix, or after three rounds. A finding
   that survives three rounds is a judgment call, so stop and hand it over
   instead of guessing.
4. Run the last round against the PR preview link (`--after`), so what you
   show is what deployed.

Then send Patrick, briefly:

- The preview link and the pages to look at.
- Before and after sheets for those pages, light and dark, desktop and phone,
  attached as files outside the repository.
- What changed in a line or two, and anything you couldn't settle or verify,
  each with your recommendation. Leave out what you fixed along the way.

If he corrects something, fix it, run a round on it, and note the correction
for wrap-up.

## Mode 2: an area

When asked for a maintenance or refactor pass, review one focused slice rather
than the whole repository: routes, content and schemas, scripts, Lab, shared
components, agent docs, or CI. Look for dead code, duplication, rules that only
live in docs but could be checks, and anything that makes the next change
harder. Report ranked findings with the scope and verification for each, and
implement only what Patrick approves.

## Guardrails

- On someone else's work or a wider area, report before fixing. Never weaken a
  check or a rule to make a review pass.
- Distinguish a broken rule from a suggestion.
- Say what you couldn't verify. A green build doesn't prove a page looks right.
- Screenshots and sheets never go in the repository.
