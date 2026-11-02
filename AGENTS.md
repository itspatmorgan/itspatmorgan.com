# AGENTS.md

Patrick Morgan's portfolio and publishing site, itspatmorgan.com: a static Astro 7
site on Cloudflare Workers. The repository is public and is part of the work, so
treat it as production.

## Commands

```bash
pnpm dev          # localhost:4321
pnpm check        # type check
pnpm test         # script tests and the agent docs check
pnpm build        # writes dist/ (never edit dist/ by hand)
pnpm check:site   # after a build: links, titles, descriptions, share images
pnpm new case-study|lab <slug> "Title"   # start a draft from the site's patterns
pnpm image <file>  # resize a new image and save it as WebP (share cards stay JPG)
```

Node 24 and pnpm 10 are pinned in `.mise.toml`.

## Before you start

- For anything visitors see, read [audience](agents/audience.md) and the
  [design principles](agents/principles/design.md). For everything else, the
  [engineering principles](agents/principles/engineering.md).
- Run `git status`. Build on changes you find; never revert them.
- If a skill below fits the task, use it. Read the [context](agents/context/)
  file for the area the task touches.

## Rules for every task

- No plans, QA notes, screenshots or scratch files in the repository.
- Use the system before inventing: the showcase and reading page templates,
  Geist and Geist Mono, the color and motion tokens in `src/styles/global.css`,
  and the shared scene player.
- Light and dark, phones at 390px and reduced motion are all first-class.
- Sentence case. No all-caps labels or eyebrows.
- Words live in `src/content/`; components place the visuals.
- Show real product, never stand-ins. Never invent metrics, quotes or dates.
- No "hire me" or availability language.
- `@/` imports. Astro by default, React for interactive pieces. Add a library
  only when it clearly removes more work than it adds.

## Done means

- `pnpm check`, `pnpm test`, `pnpm build` and `pnpm check:site` pass.
- A visible change is reviewed before Patrick sees it: run the review-change
  loop (review, fix, repeat until clean, three rounds at most), then send him
  the preview link, before and after shots, and only what you couldn't settle.
- A change visitors can't see can merge when checks are green. Anything visible
  waits for Patrick.
- Before closing, run wrap-up: every correction Patrick made becomes a rule, and
  a check where one can run.

## Skills

Skills live in `agents/skills/` and load automatically through `.claude/skills`
and `.agents/skills`.

| When the task is | Use |
| --- | --- |
| Shaping or rewriting a case study's story and copy | `shape-case-study` |
| Building or animating a case study demo | `build-case-study-demo` |
| A live visual for a Work card | `build-project-card` |
| A case study visual for a slide, social post or other fixed format | `export-visual` |
| A diagram, illustration or other graphic | `make-brand-graphic` |
| A 1200x630 share card | `make-share-card` |
| Publishing an Unknown Arts article | `publish-article` |
| Checking a change before Patrick sees it, or reviewing an area for cleanup | `review-change` |
| Finishing a piece of work | `wrap-up` |

How the agent docs are organized, and where a new rule goes:
[agents/README.md](agents/README.md).
