// Starts a new case study or Lab experiment from the site's own patterns, as a draft: hidden from Work, Lab and the homepage, and
// kept out of search engines, until its entry's `draft` turns false.
//
//   pnpm new case-study <slug> "Title"
//   pnpm new lab <slug> "Title"
//
// A case study gets its entry (src/content/projects/<slug>.md, words only), its page (src/pages/work/<slug>.astro, visuals only),
// a product stylesheet and one scene on the shared scene player. A Lab experiment gets its entry (src/content/lab/<slug>.mdx) and a
// page on LabLayout. Every placeholder says TODO, and a test fails if a published entry still has one.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const usage = 'Usage: pnpm new case-study|lab <slug> "Title"';

/** The files a starter writes, as { path: contents }, relative to the repository root. */
export function starter(kind, slug, title, root = process.cwd()) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug ?? '')) throw new Error(`The slug must be lowercase words joined by hyphens. ${usage}`);
  if (!title?.trim()) throw new Error(`A title is needed. ${usage}`);
  if (kind === 'case-study') return caseStudy(slug, title.trim(), root);
  if (kind === 'lab') return lab(slug, title.trim());
  throw new Error(usage);
}

const quote = s => JSON.stringify(s);
const pascal = slug => slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');

function nextSortOrder(root) {
  const dir = path.join(root, 'src/content/projects');
  if (!existsSync(dir)) return 1;
  const orders = readdirSync(dir).map(f => readFileSync(path.join(dir, f), 'utf8').match(/^sortOrder:\s*(\d+)/m)?.[1]).filter(Boolean).map(Number);
  return orders.length ? Math.max(...orders) + 1 : 1;
}

function caseStudy(slug, title, root) {
  const name = pascal(slug);
  // The product's namespace class scopes its stylesheet, as `sb`, `sc`, `xp` and `qb` do for the others.
  const ns = slug.split('-').map(w => w[0]).join('').slice(0, 3);
  return {
    [`src/content/projects/${slug}.md`]: `---
title: ${quote(title)}
type: "professional"
description: "TODO: one sentence for the Work page."
skills: ["TODO"]
sortOrder: ${nextSortOrder(root)}
# A draft stays off Work and the homepage, and out of search engines. Set it to false at launch.
draft: true
# The project card summary on the homepage.
summary: "TODO: one line for the homepage card."
# The words on this case study's page. Slides appear in the order the page places them, by id; each needs a title here, and the
# line is optional. Shape the story with the shape-case-study skill before writing these.
caseStudy:
  company:
    name: "TODO: company or product"
    logo: /favicon.svg
  subline: "TODO: what it is and who it's for, in one or two sentences."
  # Make the real card with the make-share-card skill before launch.
  shareImage: /images/share/home.jpg
  brief:
    when: "TODO"
    role: "TODO"
    team: "TODO"
    outcome: "TODO"
  slides:
    problem:
      title: "TODO: the first point, as a headline"
      line: "TODO: one line that backs it up."
---
`,
    [`src/pages/work/${slug}.astro`]: `---
import CaseStudyLayout from '@/layouts/CaseStudyLayout.astro';
import Slide from '@/components/case-study/Slide.astro';
import { getCaseStudy } from '@/lib/case-study';
import ${name}Problem from '@/components/${slug}/${name}Problem';
import '@/components/case-study/case-study.css';
import '@/components/${slug}/${slug}.css';

// The words live in src/content/projects/${slug}.md; this page places the visuals, one Slide per point.
const { project, slide } = await getCaseStudy('${slug}');
---

<CaseStudyLayout project={project} product="${ns}" noindex={project.data.draft}>
  <Slide {...slide('problem')}>
    <${name}Problem client:visible />
  </Slide>
</CaseStudyLayout>
`,
    [`src/components/${slug}/${slug}.css`]: `/* ${title}: the product's own styles, scoped by its namespace class. Shared layout and rhythm are in case-study.css. */
.${ns} .${ns}-screen { display: grid; place-items: center; aspect-ratio: 16 / 10; padding: 32px; }
`,
    [`src/components/${slug}/${name}Problem.tsx`]: `import { DemoFrame, Screens, useScene } from '@/components/case-study/scene';

// TODO: the first scene. Show the real product (screens rebuilt from Figma or the product's code), never a stand-in, and follow the
// build-case-study-demo skill. Each step is one beat; the last holds at least 2s so the payoff reads (agents/context/motion.md).
const timings = [1600, 1600, 2400];
const captions = ['TODO: what the first beat shows', 'TODO: what changes', 'TODO: the payoff'];

export default function ${name}Problem() {
  const scene = useScene(timings, captions, { loop: false });
  // With reduced motion the scene shows its finished state, so the payoff is the poster.
  const step = scene.reduced ? timings.length - 1 : scene.step;
  return <DemoFrame scene={scene} title="TODO: what the scene shows" label="TODO: a full description of the scene for screen readers">
    <Screens id={String(step)}>
      <div className="${ns}-screen">TODO: step {step + 1}</div>
    </Screens>
  </DemoFrame>;
}
`,
  };
}

function lab(slug, title) {
  return {
    [`src/content/lab/${slug}.mdx`]: `---
title: ${quote(title)}
description: "TODO: one line on what it is."
slug: ${quote(slug)}
# The card on the Lab page and homepage. Add a live preview for this name in src/components/lab/LabPreview.astro before launch.
preview: ${quote(slug)}
# demo: a page about the experiment, with the experiment on it. app: the experiment is the whole page.
experience: "demo"
# A draft stays off the Lab page and the homepage. Set it to false at launch.
draft: true
---

TODO: a few short paragraphs on why it exists and what you found.
`,
    [`src/pages/lab/${slug}.astro`]: `---
import LabLayout from "@/layouts/LabLayout.astro";
import { getEntry, render } from "astro:content";

const entry = await getEntry("lab", "${slug}");
if (!entry) throw new Error("Missing Lab entry: ${slug}");

const { Content } = await render(entry);
---

<!-- Make the share card with the make-share-card skill before launch, then pass it as image="/images/share/lab-${slug}.jpg". -->
<LabLayout entry={entry}>
  <Fragment slot="intro"><Content /></Fragment>

  <section class="mx-auto max-w-3xl px-6 pb-16" data-lab-content>
    <div class="flex min-h-80 items-center justify-center rounded-lg border border-border bg-card texture-bg">
      TODO: the experiment
    </div>
  </section>
</LabLayout>
`,
  };
}

/** Writes the starter's files, refusing to touch any that already exist. */
export function write(files, root = process.cwd()) {
  const taken = Object.keys(files).filter(file => existsSync(path.join(root, file)));
  if (taken.length) throw new Error(`Already exists, so nothing was written:\n${taken.join('\n')}`);
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), text);
  }
  return Object.keys(files);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [kind, slug, ...words] = process.argv.slice(2);
  try {
    const written = write(starter(kind, slug, words.join(' ')));
    const url = kind === 'lab' ? `/lab/${slug}` : `/work/${slug}`;
    console.log(`Wrote:\n${written.map(f => `  ${f}`).join('\n')}\n\nRun pnpm dev and open http://localhost:4321${url}. Fill every TODO before setting draft to false.`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
