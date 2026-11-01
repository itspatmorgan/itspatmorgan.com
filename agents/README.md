# Agents

Everything a coding agent needs beyond [AGENTS.md](../AGENTS.md): Claude,
Codex, Cursor or anything else that reads Markdown. Each file owns one subject
and links to its neighbors instead of repeating them.

| Path | Holds | Read it when |
| --- | --- | --- |
| `audience.md` | Who the site is for, the bar, positioning, non-goals | Anything visitors see |
| `principles/design.md` | How to decide what visitors see and feel | Any visual, copy or interaction work |
| `principles/engineering.md` | How to build and change the site | Any code change |
| `principles/references.md` | Classic principle sets, with when each helps | A decision needs a second opinion |
| `context/architecture.md` | Stack, routes, layouts, content model | Changing structure or adding a page |
| `context/content.md` | Terminology and frontmatter | Writing or editing content |
| `context/styling.md` | Tokens, type, templates, icons | Any styling |
| `context/motion.md` | Every motion rule: routes, scenes, cards, phones | Anything that moves |
| `context/assets.md` | Images, share cards, favicons, embeds | Adding or changing images |
| `context/publishing.md` | Writing sync and editorial art | Publishing an article |
| `context/deployment.md` | Builds, previews, the Studio demo, security | CI, hosting or dependencies |
| `skills/<name>/SKILL.md` | Procedures for recurring jobs, in the [Agent Skills](https://agentskills.io) format | The task matches a skill |

## Skills

`.claude/skills` and `.agents/skills` are symlinks to `agents/skills`, so Claude
Code, Codex and other agents load skills automatically. Add skills here, never
in those folders.

A skill holds judgment, order and review. Commands and scripts hold the
mechanics. Keep `SKILL.md` short (well under 500 lines) and move detail that
only some runs need into a `references/` file beside it, linked from
`SKILL.md`, one level deep. The `name` matches the folder, is verb-first, and
the `description` says what the skill does and when to use it.

## Where a new rule goes

When the same instruction comes up twice, write it down once, in the first
place that fits:

1. A check that fails the build, a type or a script, if the rule can run.
2. A principle, if it's about judgment across the whole site.
3. A context file, if it's a fact or rule about how the site works.
4. A skill step, if it only matters while doing that job.
5. `AGENTS.md`, only if every task needs it.

State the rule itself, not the story of how it was learned, and don't date it.
The `wrap-up` skill does this at the end of a piece of work. Plans, QA notes and
scratch files never go in the repository.

`pnpm test` checks the agent docs: every skill's name matches its folder and has
a description, and every repository path the docs mention exists.
