# Styling Conventions

## Visual Direction

The site should feel warm, minimal, editorial, and professional. Favor
restrained, content-first design over decorative complexity.

## Design System

`/style-guide` (`src/pages/style-guide.astro`, not indexed) is the visual
reference: color, type, layout, shape, motion, shared components and prose,
rendered with the real tokens. Keep it current when a token or shared piece
changes. The values live in `src/styles/global.css`:

- Color: semantic OKLCH tokens (`--background`, `--foreground`, `--card`,
  `--muted`, `--muted-foreground`, `--accent`, `--border`, `--destructive`),
  redefined under `.dark`.
- Type: `font-sans` (Geist), `font-mono` (Geist Mono), `font-pixel` (Geist
  Pixel, the hero dissolve only).
- Shape: one radius scale from `--radius`.
- Motion: easing curves `--motion-ease-out`, `--motion-ease-out-quick`,
  `--motion-ease-in-out` and `--motion-ease-standard`, and route timings
  `--motion-route-out` (90ms) and `--motion-route-in` (180ms). Use a token
  instead of writing a curve by hand; add a new one only when none fits.
- Layout: the showcase and reading templates (see `PageLayout.astro`).

## Rules

- Tailwind CSS v4 is configured through the Vite plugin, not PostCSS.
- CSS custom properties use OKLCH tokens in `src/styles/global.css`.
- Use semantic Tailwind tokens such as `text-muted-foreground`, `bg-card`,
  `border-border`, and `hover:text-accent`.
- Use Hugeicons for standard UI icons: geometry from `@hugeicons/core-free-icons`,
  `src/components/icons/Icon.astro` for static Astro surfaces, and
  `HugeiconsIcon` from `@hugeicons/react` inside React islands. Do not add a second
  icon library. Keep decorative icons hidden from assistive technology and put
  accessible names on their controls. Custom logos and illustrations remain SVGs.
- Dark mode is class-based with `.dark` on `<html>`.
- Home page sections generally use `mx-auto max-w-3xl px-6 py-16`.
- Section dividers use `border-t border-border`.
- Do not add eyebrow labels above headings. Establish hierarchy with headings,
  supporting copy, spacing, and grouping.
- Markdown prose uses custom `.prose` styles in `global.css`, not
  `@tailwindcss/typography`.
- Keep visual work readable and consistent with the current portfolio aesthetic.
- Render primary content in its final visible position. All pages using the shared layout have a
  native document fade (old page out in 90ms, new page in over
  180ms with a 4px rise; keep route motion under ~250ms). Links prefetch on
  hover through Astro's `prefetch` config, opted in by `BaseLayout.astro` and styled in
  `global.css`. Do not layer page or scroll entrance animations onto it. Browsers
  without transition support use ordinary document navigation; reduced motion
  disables the route transition.
- Keep automatic load effects off the navigation logo. Preserve intentional
  hover, click, tabs, and demo effects. Home pixel effects live in
  `src/scripts/home-interactions.ts`: the hero headline's quick pixel-to-sans
  dissolve on the first home visit of a session, and the same dissolve on the
  closing line when it scrolls into view. Those two are the only home load and
  scroll motion; keep them on the fast `dissolvePixelWave`, not the slower
  glyph-cycling `pixelWave`.
- Navigation remains document-based; there is no Astro ClientRouter. If one is
  introduced later, review script initialization and timer/observer cleanup
  before relying on `astro:*` lifecycle listeners.

## Related Files

- `src/styles/global.css`
- `src/components/`
- `src/layouts/`
- `src/pages/`
