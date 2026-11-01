# Publishing

Writing on the site is a curated copy of selected Unknown Arts articles.
Obsidian owns each article's body; the website owns its `theme`, `visual` and
generated `image`. The `publish-article` skill runs the normal workflow.

## Writing sync

The normal path is targeted: one article per run.

```bash
pnpm sync-writing -- --title "Article Title" --theme AI --with-art --dry-run
pnpm sync-writing -- --title "Article Title" --theme AI --with-art
```

- Use `--slug article-slug` instead of `--title` when easier. Targeted sync
  won't overwrite an existing article unless you pass `--overwrite`, and even
  then it keeps the website-owned fields.
- Only notes with `website: true` sync. The script strips Obsidian-only fields,
  slugifies the title, removes newsletter boilerplate and writes
  `src/content/writing/<slug>.md`.
- The vault is on Patrick's computer, so a cloud session can't run this. Set
  `OBSIDIAN_VAULT` in the shell or in an untracked `.env.local` (see
  `.env.example`). The script reads `10 Writing/03 Published/`, falling back to
  `Newsletters/`. `OBSIDIAN_NEWSLETTERS_DIR` names an exact source folder and
  wins over the vault root. Shell values win over `.env.local`.
- Untargeted `pnpm sync-writing` re-syncs every article. It's maintenance, not
  publishing; preview it with `node scripts/sync-writing.mjs --dry-run`.
- Source notes can start with a blank line before the H1; the article's only
  H1 comes from `WritingLayout`.
- Articles may have no `image`.

## Editorial art

`pnpm generate:writing-art` makes a deterministic 1200x630 feature image at
`public/images/writing/<slug>/feature.jpg` and writes the article's `visual`
metadata and `image` path. It doesn't overwrite existing visual decisions unless
asked:

```bash
node scripts/generate-writing-art.mjs --slug article-slug --dry-run
node scripts/generate-writing-art.mjs --overwrite-visual
node scripts/generate-writing-art.mjs --overwrite-image
```

Keep the visual schema stable before adding new variants.

## Themes

Use `theme` for broad reader-facing groups (AI, Design, Systems Thinking,
Creative Practice, Career) and `tags` for finer metadata. Frontmatter is in
`content.md`.
