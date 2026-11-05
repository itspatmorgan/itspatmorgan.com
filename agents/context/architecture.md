# Architecture

How the site fits together and where each thing lives. Content rules are in
`content.md`; build and hosting are in `deployment.md`.

## Stack

- Astro 7, static output, `compressHTML: true`.
- Tailwind CSS v4 through `@tailwindcss/vite` (not PostCSS).
- React for stateful UI, demos and Lab experiences; `.astro` for everything else.
- shadcn/ui primitives (base-nova style, `components.json`) in `src/components/ui/`.
- Content collections with Zod 4 schemas from `astro/zod`, in `src/content.config.ts`.
- Markdown and MDX run through `unified()` from `@astrojs/markdown-remark` in
  `astro.config.mjs`, which keeps the image-caption rehype transform.
- `@/` imports map to `src/`.
- A pnpm workspace: the site at the root, and `packages/kit` (`@itspatmorgan/kit`), the code it shares with
  Patrick's Design Studio.

## Where things live

| Area | Source of truth |
| --- | --- |
| Shell: layout, navigation, footer, theme, metadata | `src/layouts/`, `src/components/layout/`, `src/data/site-config.ts` |
| Work case studies | Words in `src/content/projects/<slug>.md`, page in `src/pages/work/<slug>.astro`, demos in `src/components/<product>/` or, once shared, `packages/kit/src/<product>/` |
| Shared case study system | `packages/kit/src/case-study/` (stage, scene player, project cards); `Slide.astro` stays in `src/components/case-study/` |
| Code shared with Studio | `packages/kit` (see below) |
| Visual library | `src/visuals/` (formats, visuals, the `/visuals` gallery), recorded with `scripts/visuals-record.mjs` |
| Writing | `src/content/writing/`, synced from Obsidian (see `publishing.md`) |
| Lab | Entry in `src/content/lab/<slug>.mdx`, page in `src/pages/lab/<slug>.astro`, code in `src/lab/<slug>/` |
| Community and Kind Words | `src/pages/community.astro`, `src/data/community.ts`, `src/data/commendations.ts` |
| Career timeline | `src/data/experience.ts` |
| Design Studio landing page | `src/pages/design-studio.astro`, scenes in `src/components/design-studio/` |
| Design system reference | `/style-guide` (`src/pages/style-guide.astro`, noindex) |
| Tokens and global styles | `src/styles/global.css` |
| Scripts | `scripts/` (checks, review, starters, share cards, frame check, writing sync, favicons) |

## The kit

`packages/kit` holds the code the site shares with Patrick's Design Studio (the `pm-prototypes` repo, deployed at
studio.itspatmorgan.com): the theme hooks, the scene player and stages, and the case study demos moved so far (Sublime).
The site imports it as `@itspatmorgan/kit/<path>`; Studio's Website system installs it from this repo at a pinned commit.
Both sides render the same files, so a demo changed here reaches Studio when its pin moves, and a piece prototyped in
Studio comes to the site by moving its file in.

- Kit code is React and TypeScript that passes Studio's stricter settings (`verbatimModuleSyntax`, no unused locals
  or parameters). It imports only itself, React, Motion and Hugeicons, never `@/` (a test checks).
- Images are imported with `?url` beside the component, never `/images/` URLs, so they resolve in Astro and Vite.
- Studio scopes every style under its theme class. After changing a kit stylesheet, run
  `pnpm --filter @itspatmorgan/kit studio-css` to rewrite `studio/`; the tests fail while they disagree.
- Words stay in `src/content/`; Studio snapshots them separately.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home: hero, Work (with the Design Studio card), Writing, Community, Lab, closing line |
| `/about` | Personal narrative |
| `/work` | Career timeline and case studies |
| `/work/<slug>` | One case study per page. An entry with `draft: true` is hidden from Work and the homepage and not indexed |
| `/writing`, `/writing/<slug>` | Curated Unknown Arts articles with theme filters |
| `/lab`, `/lab/<slug>` | Lab experiments |
| `/community` | Community story, photos and Kind Words |
| `/colophon` | How the site is made |
| `/design-studio` | Design Studio product page |
| `/design-studio/agent.txt` | Plain-text Design Studio brief for agents, shared with the page's Agent mode |
| `/design-studio-demo/` | Live Studio build, added at deploy time (see `deployment.md`) |
| `/style-guide` | Design system reference, not indexed |
| `/visuals` | Visual library: case study scenes drawn for slides and social posts (`src/visuals/`). Served by `astro dev` only, never built |

## Layouts

`BaseLayout` → `PageLayout` → `CaseStudyLayout`, `LabLayout` or `WritingLayout`.

`PageLayout` takes a `template`:

- `showcase`: 1024px of content in a 1136px shell. Home, case study stages,
  Design Studio.
- `reading` (default): a 720px column with the shared `PageHeader`. About,
  Work, Community, Lab, Writing, articles, Colophon.

Photo rows may break out to `max-w-5xl`; the footer follows the template. Don't
add other widths.

## Rules

- New interactive pieces read the theme, reduced motion and the phone breakpoint
  through `useDark`, `useReduced` and `usePhone` in `packages/kit/src/hooks.ts`, never
  their own media queries or observers.
- Query content with `getCollection()` and filter drafts before rendering lists.
- Keep words people edit in content files, not component code.
- Navigation is document-based, with no Astro ClientRouter. If one is added,
  review script initialization and timer cleanup first.
