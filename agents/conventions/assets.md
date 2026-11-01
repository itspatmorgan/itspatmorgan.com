# Asset Conventions

## Images

Favicons use `public/favicon.svg` as the canonical dots mark. After changing it,
run `node scripts/generate-favicons.mjs` to regenerate every PNG, Apple touch
icon, and ICO fallback. Raster variants use the light-theme palette; the SVG
adapts to the browser color scheme. Keep favicon URLs stable for crawlers.
The generator also updates the legacy `images/brand/logo-{dark,light}-256.png`
URLs with the current mark so external references cannot fetch retired branding.

| Pattern | Purpose |
| --- | --- |
| `thumbnail-*` | Square work thumbnails, typically 2400x2400 |
| `thumbnail-wide*` | Wide work thumbnails for responsive cards |
| `feature-*` | 16:9 work hero images, typically 1920x1080 |
| `career-*.svg` | Company logos |
| `/images/profiles/` | Kind Words author headshots |
| `/images/writing/<slug>/feature.jpg` | Generated writing feature images |
| `/images/share/*.jpg` | 1200x630 share cards for pages and case studies |

## Share Images

Every public page passes a 1200x630 JPG as `image` to its layout; pages without one fall back to
`/images/share/home.jpg`. Cards follow the Design Studio case study card (`/images/share/work-design-studio.jpg`): paper background, logo and name top
left, the page headline, one short line, the URL in Geist Mono, and real UI or photos on the right.
Case study cards crop the page's own hero screen. The one exception is the /design-studio product page, whose card is a product launch card (`--layout product`): the centered Design Studio wordmark, the page headline as its tagline, a dot field, and the Studio window rising from the bottom edge, with no URL or line, so it sits beside other community tools. The top-left lockup is the company logo on company
case studies and the Design Studio mark on both Design Studio cards; every other card says Patrick Morgan with the site mark. Use JPG or PNG, not WebP, since some apps ignore
WebP previews. Writing articles use their generated `feature.jpg`. Render cards with
`scripts/share-card.mjs`; the `share-cards` skill has the workflow.

## Embeds

Project detail pages support:

- YouTube embeds through `astro-embed`
- Figma Slides embeds through `src/components/FigmaEmbed.astro`

Figma presentation embeds should use `/deck/` URLs, not `/slides/` editor URLs.

## Related Files

- `public/images/`
- `src/components/FigmaEmbed.astro`
- `src/content/projects/`
