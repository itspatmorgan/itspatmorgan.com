# Content Conventions

- Always use the full, capitalized product name **Design Studio** in public
  copy, including setup prompts and Agent descriptions. Use **Design Studios**
  for the plural. Do not shorten the product name to “studio.” Preserve literal
  source paths, commands, and upstream system names where required.

## Design Studio installation and publishing

- Use “agent harness” for the environment where someone works with their coding agent.
- The starter repository owns the installation guide at `src/platform/context/installing.md`. Link to that guide rather than maintaining separate installation methods on the landing page.
- Keep plugins out of the current launch flow. Agent harness logos are examples, not plugin installation choices.
- Present installation and optional publishing as distinct steps in one setup flow: Design Studio builds a static website; the person's agent helps configure their chosen host using `src/platform/context/publishing.md`.
- Use Vercel, Netlify, and Cloudflare as hosting examples, while making clear that other static-site hosts work too.
- Keep the Human page and `/design-studio/agent.txt` aligned about installation, repository ownership, updates, and publishing.

## Public Terminology

- Use "Work", not "Projects" or "Experience", for the public portfolio/career section.
- Use "Writing", not "Blog".
- Use "Lab", not "Tools", for hosted experiments, utilities, and interaction showcases.
- Use "Kind Words", not "Commendations" or "Testimonials".

The internal content collection for Work is still named `projects`; do not
rename it casually.

## Work

Work entries live in `src/content/projects/*.{md,mdx}` and render publicly under
`/work/<slug>`.

Common frontmatter:

```yaml
title: "Project Title"
type: "professional"
description: "Short description"
skills: ["Skill 1", "Skill 2"]
thumbnail: "/images/projects/slug/thumbnail-image.jpg"
thumbnailDark: "/images/projects/slug/thumbnail-image-dark.jpg"
thumbnailWide: "/images/projects/slug/thumbnail-wide.jpg"
thumbnailWideDark: "/images/projects/slug/thumbnail-wide-dark.jpg"
heroImage: "/images/projects/slug/feature-image.jpg"
sortOrder: 1
draft: false
```

Dark, wide, and hero images are optional. Work entries that need embeds can use
MDX.

## Writing

Writing lives in `src/content/writing/*.md`.

Common frontmatter:

```yaml
title: "Article Title"
description: "Short description"
publishedDate: 2026-02-22
categories: ["Category"]
theme: "AI"
tags: ["tag1", "tag2"]
image: "/images/writing/article-slug/feature.jpg"
canonicalUrl: "https://www.unknownarts.com/p/article-slug"
draft: false
```

Writing can be synced from the local Obsidian vault with `pnpm sync-writing`.
The website owns `theme`, `visual`, and generated `image` frontmatter for
writing. Obsidian sync preserves those fields.

Use `theme` for broad reader-facing grouping, such as `AI`, `Design`, `Systems
Thinking`, or `Creative Practice`. Use `tags` for lower-level metadata.

## Lab

Lab entries live in `src/content/lab/*.mdx` and are hosted under `/lab/<slug>`.

Common frontmatter:

```yaml
title: "Lab Item"
description: "Short description"
slug: "lab-item"
preview: "lab-item"
experience: "demo"
draft: false
```

Use `experience: "app"` for immersive tools and `experience: "demo"` for
focused interaction showcases. Put implementation code under `src/lab/<slug>/`
when an item needs dedicated components, React islands, or supporting logic.
