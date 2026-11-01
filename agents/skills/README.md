# Skills

Skills are repeatable, self-contained agent capabilities.

Use a skill when the work is not a single known change, but an invokable
capability: inspect the project, apply a specialized workflow, produce a defined
output, and follow explicit guardrails.

## Standard Shape

Each skill lives in its own folder:

```text
skill-name/
  SKILL.md
```

`SKILL.md` must include YAML frontmatter:

```yaml
---
name: skill-name
description: Clear trigger description for when the skill should be used.
---
```

The body should stay concise and include only the procedural knowledge needed to
run the skill: purpose, inputs, workflow, outputs, guardrails, and verification.

Detailed examples, scripts, or references can be added later as bundled
resources when a skill needs them.

## Operating Rules

- Skills should produce small, reviewable outputs.
- Skills should not make broad changes without approval.
- Skills should link to canonical files in `agents/` instead of duplicating them.
- Skills can be run manually now and scheduled through automation later.

| Skill | Purpose |
| --- | --- |
| `case-study-shaping/` | Shape a Work entry into a slide-like case study, from fact-finding to launch |
| `case-study-demos/` | Build and animate the native product demos on a case study |
| `visual-library/` | Draw and record case study scenes for slides, social posts and other fixed formats |
| `project-card-visuals/` | Build the live visual on a case study's project card, in place of a thumbnail |
| `brand-graphics/` | Make diagrams, illustrations and other graphics that stay on brand |
| `share-cards/` | Make or refresh a page's 1200x630 share card with `scripts/share-card.mjs` |
| `publish-article/` | Bring one Unknown Arts article from Obsidian into Writing, with its art |
| `refactor-radar/` | Find targeted refactors and maintenance opportunities for approval |
