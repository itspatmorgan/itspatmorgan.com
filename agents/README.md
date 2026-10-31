# Agents

This folder is the home base for every coding agent working on the site:
Claude, Codex, Cursor or anything else that reads plain Markdown. It holds who
the site is for, the principles that guide decisions, how the site is built,
and the skills for work that comes up again and again.

`AGENTS.md` at the repository root is the starting point. It points here.

## Structure

| Path | Purpose |
| --- | --- |
| `audience.md` | Who the site speaks to, and the bar the work has to clear |
| `principles/design.md` | Design principles for what visitors see and feel |
| `principles/engineering.md` | Engineering principles for how the site is built and changed |
| `principles/references.md` | Classic principle sets to consult, with when each one helps |
| `strategy.md` | Purpose, active tracks and non-goals |
| `system-map.md` | Routes, ownership, workflows and deployment |
| `conventions/` | Current rules for architecture, content, styling, assets and security |
| `learnings/` | Reusable lessons from completed work |
| `skills/` | Repeatable procedures, one folder per skill |

Read in that order when starting something new: the audience and principles
say what good looks like, the conventions say how this site does it, and the
skills say how to do a recurring job end to end.

## How agents find this

- Every agent reads `AGENTS.md` at the root. `CLAUDE.md` defers to it.
- Skills live in `skills/<name>/SKILL.md` in the [Agent Skills](https://agentskills.io)
  format. `.claude/skills` and `.agents/skills` are symlinks to `agents/skills`,
  so Claude Code and agents that read `.agents/skills` (such as Codex) load them
  automatically. Add a skill here, never in those folders.
- Nothing else in this folder is loaded automatically. Skills and `AGENTS.md`
  link to the files they need.

## Keeping it useful

- Each file owns one kind of context and links to its neighbors rather than
  repeating them.
- Plans, QA notes and scratch work stay out of the repository. Keep them in
  the conversation or a planning tool.
- When the same instruction comes up twice, write it down here: as a
  convention, a principle, a skill step, or better, a check that fails the
  build. See `principles/engineering.md`.
- After non-trivial work, decide whether it produced a learning, a convention
  change, a skill update or nothing. Nothing is a fine answer.
