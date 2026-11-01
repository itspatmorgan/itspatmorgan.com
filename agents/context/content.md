# Content

- Always use the full, capitalized product name **Design Studio** in public
  copy, including setup prompts and Agent descriptions. Use **Design Studios**
  for the plural. Do not shorten the product name to “studio.” Preserve literal
  source paths, commands, and upstream system names where required.

## Design Studio installation and publishing

- Use “agent harness” for the environment where someone works with their coding agent.
- The starter repository owns the [installation guide](https://github.com/itspatmorgan/design-studio/blob/main/src/platform/context/installing.md). Link to that guide rather than maintaining separate installation methods on the landing page.
- Keep plugins out of the current launch flow. Agent harness logos are examples, not plugin installation choices.
- Present installation and optional publishing as distinct steps in one setup flow: Design Studio builds a static website; the person's agent helps configure their chosen host using the Design Studio [publishing guide](https://github.com/itspatmorgan/design-studio/blob/main/src/platform/context/publishing.md).
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

Work entries live in `src/content/projects/*.md`. Each live case study has its
own page, `src/pages/work/<slug>.astro`, which places the visuals; the entry
holds the words. An entry with no page is a draft and does not render.

Common frontmatter:

```yaml
title: "Project Title"          # also the case study headline
type: "professional"
description: "Short description" # the Work page card
skills: ["Skill 1", "Skill 2"]
sortOrder: 1
draft: false
summary: "Homepage card line"    # optional; falls back to description
caseStudy:
  company: { name: "Company", logo: "/images/logos/square-company.svg" }
  subline: "One line under the headline"
  shareDescription: "Search and share text, when it differs from the subline"
  shareImage: "/images/share/work-slug.jpg"
  brief: { when: "2024", role: "Role", team: "Team", outcome: "Outcome" }
  slides:
    problem:
      title: "Slide headline"
      line: "Optional one line under it"
```

The page renders a slide with `<Slide {...slide('problem')}>`; a slide id the
entry lacks fails the build. Thumbnails (`thumbnail`, `thumbnailDark`,
`thumbnailWide`, `thumbnailWideDark`) are optional, for a card without a live
visual. Drafts that need embeds can use MDX.

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
