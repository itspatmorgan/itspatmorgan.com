# Architecture

How the site fits together and where each thing lives. Content rules are in
`content.md`; build and hosting are in `deployment.md`.

## Stack

- Astro 7, static output, `compressHTML: true`.
- Tailwind CSS v4 through `@tailwindcss/vite` (not PostCSS).
- React for stateful UI and demos; `.astro` for everything else.
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
| Snapshots | `src/pages/snapshots.astro` and `src/components/snapshots/`, fed by pm-studio's featured list (`src/data/featured.ts`) |
| Community and Kind Words | `src/pages/community.astro`, `src/data/community.ts`, `src/data/commendations.ts` |
| Career timeline | `src/data/experience.ts` |
| Design Studio landing page | `src/pages/design-studio.astro`, scenes in `packages/kit/src/design-studio/` |
| Design system reference | `/style-guide` (`src/pages/style-guide.astro`, noindex) |
| Tokens | `packages/kit/src/tokens.css` (colors and motion, shared with Studio) |
| Global styles | `src/styles/global.css` |
| Scripts | `scripts/` (checks, review, starters, share cards, frame check, writing sync, favicons) |

## The kit

`packages/kit` holds the code the site shares with Patrick's Design Studio (the `pm-prototypes` repo, deployed at
studio.itspatmorgan.com): the theme hooks, the scene player and stages, and the case study demos (Sublime, query builder, Expansion, Design Studio and its landing page scenes), and the generative art engine behind article visuals and the Pattern Engine.
The site imports it as `@itspatmorgan/kit/<path>`; Studio's Website system installs it from this repo at a pinned commit.
Both sides render the same files, so a demo changed here reaches Studio when its pin moves, and a piece prototyped in
Studio comes to the site by moving its file in.

The kit is an ordinary package, shaped the way we'd recommend any team ship shared components:

- Kit code is React and TypeScript under strict settings (`verbatimModuleSyntax`, no unused locals or parameters),
  set in `packages/kit/tsconfig.json`. It ships its source, which both consumers compile with Vite. It imports only
  itself, React, Motion, Hugeicons and the fonts it declares, never `@/`. A `.ts` module needs its own line in the
  kit's exports. The tests check all of this.
- Each component imports the stylesheets it uses, by relative path, so a page never has to remember them. Tokens
  are plain CSS variables on `:root`, with dark values on `.dark`, in `tokens.css`, which the site's
  `global.css` imports.
- A rule that overrides one from another kit stylesheet must win on specificity, never on file order: the bundler
  splits stylesheets into chunks whose order differs from page to page. Name the base too, as in
  `.cs-stage.sp-stage` or `.cs-native .ss-quote p`.
- Images are imported with `?url` beside the component, never `/images/` URLs, so they resolve in Astro and Vite. A
  stylesheet's `url()` points at a file beside it in the kit.
- Read the color mode with `useDark(ref)` from `hooks.ts`, passing the component's root: it follows the nearest
  `data-color-mode` boundary, then `.dark` on `<html>`.
- Nothing in the kit knows about Studio. Studio scopes the kit's plain CSS to its Website theme itself.
- The generative art engine's core (`generative-art/themes.ts` and `generative-art/generators/`) stays free of the DOM
  and React and imports with `.ts` extensions, so Node scripts run it as is. Article art comes from this one engine,
  live on the page and as share images; never copy a generator.
- Words stay in `src/content/`; Studio snapshots them separately.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home: hero, Work (with the Design Studio card), Writing, Community, Snapshots, closing line |
| `/about` | Personal narrative |
| `/work` | Career timeline and case studies |
| `/work/<slug>` | One case study per page. An entry with `draft: true` is hidden from Work and the homepage and not indexed |
| `/writing`, `/writing/<slug>` | Curated Unknown Arts articles with theme filters |
| `/snapshots` | Work featured in pm-studio, each opening in the Studio. `/lab` and its old entries redirect (`public/_redirects`, and `src/pages/lab/pattern-engine.astro`, which keeps an article's settings) |
| `/community` | Community story, photos and Kind Words |
| `/colophon` | How the site is made |
| `/design-studio` | Design Studio product page |
| `/design-studio/agent.txt` | Plain-text Design Studio brief for agents, shared with the page's Agent mode |
| `/design-studio-demo/` | Live Studio build, added at deploy time (see `deployment.md`) |
| `/style-guide` | Design system reference, not indexed |
| `/visuals` | Visual library: case study scenes drawn for slides and social posts (`src/visuals/`). Served by `astro dev` only, never built |

## Layouts

`BaseLayout` → `PageLayout` → `CaseStudyLayout` or `WritingLayout`.

`PageLayout` takes a `template`:

- `showcase`: 1024px of content in a 1136px shell. Home, case study stages,
  Design Studio.
- `reading` (default): a 720px column with the shared `PageHeader`. About,
  Work, Community, Snapshots, Writing, articles, Colophon.

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
