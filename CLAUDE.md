# CLAUDE.md

This repository uses [AGENTS.md](AGENTS.md) as the shared guidance file for
Claude, Codex, and other coding agents.

Claude should treat `AGENTS.md` as the primary instruction source, then use
`agents/` for the audience, principles, strategy, system map, conventions,
learnings, and skills. `.claude/skills` is a symlink to `agents/skills`.

Do not duplicate durable project conventions here. Add shared guidance to
`AGENTS.md` or the relevant `agents/` file instead.

Claude-specific operational notes can live here when needed.
