# itspatmorgan.com

Personal portfolio site for Patrick Morgan, built with [Astro](https://astro.build), Tailwind CSS, and shadcn/ui.

This repository contains the source for [itspatmorgan.com](https://itspatmorgan.com): a warm, minimal, editorial portfolio for product, design, technology, writing, and lab work.

## Start here

- [System map](agent-os/system-map.md) explains how the project is structured, how content works, and how to verify changes.
- [Agent instructions](AGENTS.md) are the shared working guide for Codex, Claude, and other coding agents.
- [Agent OS](agent-os/README.md) contains strategy, conventions, and learnings for AI-assisted work on the project.
- [Project board](https://github.com/users/itspatmorgan/projects/2) and [issues](https://github.com/itspatmorgan/itspatmorgan.com/issues) track planned and active work.

## Local development

Prerequisites:

- Node.js 22.23.4+ (Node 24 is pinned in `.mise.toml` and `.nvmrc`, and used in CI)
- pnpm 10+

Recommended local location:

```text
~/Developer/itspatmorgan.com
```

This repo includes a `.mise.toml` for local tool versions. If you use
[mise](https://mise.jdx.dev/), run:

```bash
mise trust
mise install
```

```bash
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:4321`.

For writing sync, copy `.env.example` to `.env.local` and configure your vault
root or explicit published-articles folder. `.env.local` stays untracked.

## Deployment

The site is hosted on Cloudflare Workers as static assets (`wrangler.jsonc`).
GitHub Actions builds and deploys `main` to
[itspatmorgan.com](https://itspatmorgan.com) on every push. Each pull request
gets its own preview at `https://pr-<number>-itspatmorgan.itspatmorgan.workers.dev`,
posted as a comment on the PR.

For build, sync, deployment, content, and architecture details, use the [system map](agent-os/system-map.md).
