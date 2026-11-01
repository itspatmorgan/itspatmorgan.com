---
name: share-cards
description: Use when a page or case study is added, renamed or gets a new headline, or when asked to make or refresh a share card (the 1200x630 image shown when a link is shared). Renders cards in the site's layout with scripts/share-card.mjs.
---

# Share Cards

## Purpose

Every public page has a 1200x630 share card that looks like the site: paper
background, a lockup, the page's own headline and one line, the URL, and a
real visual. This skill makes one in a single command and checks it against
the rules.

## Rules

The full rules are in `agents/conventions/assets.md` (Share Images). In short:

- **Lockup.** Company case studies (Sublime Security, JupiterOne, Signal
  Sciences) show their own logo, and both Design Studio cards show the Design
  Studio mark. Every other card, Lab pages included, says Patrick Morgan with
  the site mark.
- **Words.** The headline and line reuse the page's own heading and lead,
  word for word. For a case study, that's the entry's `title` and
  `caseStudy.subline`.
- **Visual.** Real content only, never decorative patterns: the case study's
  own hero screen, real photos, real product UI. Product screens bleed off the
  right and bottom edges. Everything else sits centered in the right region,
  inside the 64px margins.
- **Product page.** /design-studio is the open source project's own page, so
  its card is a launch card, not a portfolio card. Render it with
  `--layout product --title "Design with intent. Build with an agent." --name "Design Studio"
  --logo /images/studio-case/design-studio-mark.svg --capture http://localhost:4321/design-studio/ --selector ".hx-window"`.
- **Format.** JPG at `public/images/share/<name>.jpg`, passed to the page's
  layout as its image (`caseStudy.shareImage` for case studies). Writing
  articles use their generated `feature.jpg` instead.

## Workflow

1. Find the page's headline, line and route. Name the file after the route:
   `work-<slug>`, `lab-<slug>` or the page name.
2. Pick the visual. For a case study, capture the hero screen from a running
   site: start `pnpm dev`, then pass `--capture` with a selector that frames
   the screen itself (for Sublime, `.cs-hero .sb-page` is tighter than the
   whole stage). Otherwise use `--visual` with an image under `public/`.
3. Render:

   ```bash
   node scripts/share-card.mjs --out work-<slug> --title "<headline>" --line "<line>" \
     --path /work/<slug> --logo /images/logos/square-<company>.svg --name "<Company>" --invert \
     --capture http://localhost:4321/work/<slug> --selector "<selector>" --bleed --width 1000
   ```

   Leave out `--logo`, `--name` and `--invert` for a Patrick Morgan card.
   `--invert` darkens the white company marks, as the case study pages do.
4. Open the JPG and look at it beside two existing cards in
   `public/images/share/`. Check that the headline wraps evenly, the visual
   lands in its region and nothing is clipped that shouldn't be.
5. Point the page at the card, then build.

Cards whose visual is a composition (the About polaroids, the Community photo
grid, the Writing card with recent titles) were laid out by hand. To refresh
one, match the existing card, and remember the Writing card's titles go stale
when new articles publish.

## Verification

- `pnpm build` then `pnpm check:site`, which fails on a page whose share
  image is missing.
- Look at the card itself. A card is seen at thumbnail size in chat apps, so
  the headline has to read small.
