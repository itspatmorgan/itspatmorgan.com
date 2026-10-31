# Agent OS

## Rule

Durable project memory should live in tool-neutral paths. Use `agent-os/` for
strategy, the system map, conventions, learnings, and skills; keep
tool-specific folders for tool-specific state only.

## Why

Strategy, conventions, learnings, and skills are project assets, not
Claude, Codex, or Cursor internals. Keeping them visible and tool-neutral lets
future agents inspect the same context before making changes.

## Use When

- Planning non-trivial work.
- Capturing reusable knowledge after a task.
- Creating repeatable agent capabilities.
- Deciding whether guidance belongs in `agent-os/`, `AGENTS.md`, or `CLAUDE.md`.

## Gotchas

- Keep plans, QA notes, and scratch work out of the repository.
- Do not turn learning notes into long postmortems.

## Verification

Search for stale references before completing operating-system refactors:

```bash
rg "\.claude/plans|docs/|TODO.md|site-system|routines"
```

## Related Files

- `AGENTS.md`
- `CLAUDE.md`
- `agent-os/system-map.md`
- `agent-os/README.md`
- `agent-os/conventions/README.md`
- `agent-os/learnings/README.md`
- `agent-os/skills/README.md`
