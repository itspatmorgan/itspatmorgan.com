---
name: publish-article
description: Brings one Unknown Arts article from Patrick's Obsidian vault into the site's Writing section, with its generated feature art. Use when Patrick wants an article added or updated on the site.
---

# Publish an Article

## Purpose

Bring one finished Unknown Arts article from Obsidian into Writing, with its
theme and generated feature image, without touching any other article.

## Where it runs

The source is Patrick's Obsidian vault on his computer
(`10 Writing/03 Published`, configured in `.env.local`). A cloud session
can't reach it: run this on his machine, or ask him to.

## Workflow

1. Confirm the exact article title and its theme, one of those already in
   use: AI, Design, Systems Thinking, Creative Practice or Career.
   The source note needs `website: true` and a title, description and
   published date.
2. Preview the change:

   ```bash
   pnpm sync-writing -- --title "Article Title" --theme AI --with-art --dry-run
   ```

3. Run it without `--dry-run`. Add `--overwrite` only to update an article
   that's already on the site; the website-owned `theme`, `visual` and
   `image` fields are kept.
4. Look at the result: `src/content/writing/<slug>.md` and the feature image
   at `public/images/writing/<slug>/feature.jpg`. The article's H1 comes from
   the layout, so the body shouldn't start with one.
5. Build and check:

   ```bash
   pnpm check && pnpm build && pnpm check:site
   ```

6. Open a pull request. Mention that the Writing share card
   (`public/images/share/writing.jpg`) lists recent titles and may want a
   refresh with the make-share-card skill.

## Guardrails

- One article per run. Untargeted `pnpm sync-writing` re-syncs everything and
  is a maintenance task, not publishing.
- Don't edit the article body on the website side; Obsidian owns it. Fix the
  source and sync again.

## Related

- `agents/context/publishing.md`
- `scripts/sync-writing.mjs`, `scripts/generate-writing-art.mjs`
