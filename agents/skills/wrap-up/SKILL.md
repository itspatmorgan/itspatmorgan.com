---
name: wrap-up
description: Turns Patrick's corrections and the lessons from a finished piece of work into rules in the site's principles, context or skills, and into review checks where they can run, so the same correction never has to be made twice. Use when a pull request merges, a case study or Lab experiment launches, or Patrick says a piece of work is done.
---

# Wrap Up

Patrick's feedback is the most valuable input this repository gets. Capture
what should outlast the work, in the right place, and nothing more.

## Workflow

1. **Collect.** Reread the conversation and the pull request comments. List
   every correction Patrick made, every rule he stated, and every gotcha that
   cost more than one attempt.
2. **Filter.** Keep an item only if it will matter again. Drop one-off
   preferences about a single screen, and anything the code already enforces.
   Check `agents/` first; if the rule already exists, the fix may be making it
   clearer or turning it into a check.
3. **Place each one** in the first home that fits, following "Where a new rule
   goes" in `agents/README.md`: a check or script, a principle, a context file,
   a skill step, or `AGENTS.md`. A correction about how things look or read
   goes in `agents/principles/design.md` or the context file for its area.
4. **Make it a check** when a browser can measure it in a few lines: text
   case, wrapping, overflow, sizes and ratios, timing. Add it to the audit or
   motion pass in `scripts/review.mjs`, so the next review loop catches it
   before Patrick does. Keep checks cheap and local, never in CI, and make
   them flag candidates rather than fail on taste. Run the check against the
   page it came from to confirm it fires there and stays quiet elsewhere.
5. **Write the rule, not the story.** One or two sentences in the target file's
   voice, with no date and no "Patrick rejected X on…". Say why only when the
   reason changes how someone would apply it.
6. **Apply.** A correction Patrick gave is already his decision: write it
   down and add its check without asking again. A rule you inferred
   yourself, or a change to a principle beyond his words, goes to him first
   with the exact wording.
7. **Ship** the edits in one small pull request, run `pnpm test` so the agent
   docs check passes, and merge when green if it only changes agent docs and
   scripts.

Facts about the project that aren't rules (what shipped, open questions, who
decided what) belong in project memory, not the repository.

## Guardrails

- Zero new rules is a fine outcome.
- Don't add a rule just to remember one past failure.
- Prefer editing an existing line to adding a new one.
