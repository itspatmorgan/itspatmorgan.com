# Agents Folder

## Rule

Durable agent context lives in the tool-neutral `agents/` folder: audience,
principles, strategy, the system map, conventions, learnings and skills.
Tool-specific folders hold only tool-specific state, and link to `agents/`
rather than copying it. `.claude/skills` and `.agents/skills` are symlinks to
`agents/skills`.

## Why

These are project assets, not Claude, Codex or Cursor internals. One copy,
visible to every agent, keeps them from drifting apart.

## Use When

- Planning non-trivial work.
- Capturing reusable knowledge after a task.
- Creating or changing a skill.
- Deciding whether guidance belongs in `agents/`, `AGENTS.md` or `CLAUDE.md`.

## Gotchas

- Add skills under `agents/skills/`, never inside `.claude/` or `.agents/`;
  those are links.
- Keep plans, QA notes and scratch work out of the repository.
- Do not turn learning notes into long postmortems.

## Verification

```bash
ls .claude/skills/ .agents/skills/   # both list the same skills
rg "agent-os" --glob '!src/content/writing/**'   # no stale references
```

## Related Files

- `AGENTS.md`
- `CLAUDE.md`
- `agents/README.md`
