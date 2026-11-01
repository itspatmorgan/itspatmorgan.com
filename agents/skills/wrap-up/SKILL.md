---
name: wrap-up
description: Turns the feedback and lessons from a finished piece of work into proposed edits to the site's principles, context, skills or checks, so the same correction never has to be made twice. Use when a pull request merges, a case study or Lab experiment launches, or Patrick says a piece of work is done.
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
   a skill step, or `AGENTS.md`.
4. **Write the rule, not the story.** One or two sentences in the target file's
   voice, with no date and no "Patrick rejected X on…". Say why only when the
   reason changes how someone would apply it.
5. **Propose.** Show Patrick the list: each rule, where it goes, and the exact
   wording. A principle or anything visitors would notice needs his approval.
6. **Apply** the approved edits in one small pull request, run `pnpm test` so
   the agent docs check passes, and merge when green if it only changes agent
   docs.

Facts about the project that aren't rules (what shipped, open questions, who
decided what) belong in project memory, not the repository.

## Guardrails

- Zero new rules is a fine outcome.
- Don't add a rule just to remember one past failure.
- Prefer editing an existing line to adding a new one.
