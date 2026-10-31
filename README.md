# itspatmorgan.com

Source for [itspatmorgan.com](https://itspatmorgan.com), Patrick Morgan's portfolio. Built with [Astro](https://astro.build), Tailwind CSS and shadcn/ui.

## Development

Requires Node 24 and pnpm 10 (versions pinned in `.mise.toml`).

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # static build in dist/
```

To sync articles from Obsidian, copy `.env.example` to `.env.local`, set your vault path, and run `pnpm sync-writing`.

## Deployment

The site runs on Cloudflare Workers. GitHub Actions deploys `main` on every push, and each pull request gets a preview link posted as a comment.

## Docs

- [AGENTS.md](AGENTS.md): working guide for coding agents
- [System map](agents/system-map.md): architecture, content, build and deployment details
