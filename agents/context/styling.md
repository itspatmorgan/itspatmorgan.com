# Styling

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
- Motion: the `--motion-*` easing and route tokens. The rules are in
  `motion.md`.
- Layout: the showcase and reading templates (see `architecture.md`).

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
- Section dividers use `border-t border-border`.
- Sentence case everywhere, in the body font. No all-caps labels.
- Do not add eyebrow labels above headings. Establish hierarchy with headings,
  supporting copy, spacing, and grouping.
- Markdown prose uses custom `.prose` styles in `global.css`, not
  `@tailwindcss/typography`.
- Keep visual work readable and consistent with the current portfolio aesthetic.
- Render primary content in its final visible position. Route, load and
  scroll motion follow `motion.md`.

## Related Files

- `src/styles/global.css`
- `src/components/`
- `src/layouts/`
- `src/pages/`
