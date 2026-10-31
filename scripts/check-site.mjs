/**
 * Check the built site for broken links and missing page metadata.
 *
 * Run after `pnpm build`:
 *   node scripts/check-site.mjs [dist]
 *
 * Every page needs a title, a description and a share image that exists.
 * Every local link, image, video and stylesheet must resolve to a file in the
 * build. The Design Studio demo is added by CI after the Astro build, so a
 * local build skips links into it. The demo is a single-page app: its routes
 * (paths without a file extension) load through the root 404 page, so they
 * only need the demo to be there.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';

const SITE = 'https://itspatmorgan.com';
const STUDIO_DEMO = '/design-studio-demo/';

export function pagesIn(dir) {
  return readdirSync(dir, { recursive: true })
    .filter((file) => file.endsWith('.html'))
    .map((file) => join(dir, file));
}

/** The local paths a page points at: href, src, srcset, poster and share image URLs. */
export function localUrls(html) {
  const urls = [];
  const attribute = /\s(href|src|poster|content)=["']([^"']*)["']/g;
  for (const [, , value] of html.matchAll(attribute)) urls.push(value);
  for (const [, value] of html.matchAll(/\ssrcset=["']([^"']*)["']/g)) {
    for (const candidate of value.split(',')) urls.push(candidate.trim().split(/\s+/)[0]);
  }
  return urls
    .map((url) => (url.startsWith(SITE + '/') ? url.slice(SITE.length) : url))
    .filter((url) => url.startsWith('/') && !url.startsWith('//'))
    .map((url) => decodeURI(url.split(/[?#]/)[0]));
}

/** Whether a site path resolves to a file in the build, as the Worker serves it. */
export function resolves(dist, path) {
  if (path.startsWith(STUDIO_DEMO) && !/\.[a-z0-9]+$/i.test(path)) return existsSync(join(dist, STUDIO_DEMO, 'index.html'));
  const target = join(dist, path);
  if (existsSync(target) && statSync(target).isFile()) return true;
  return existsSync(join(target, 'index.html')) || existsSync(`${target.replace(/\/$/, '')}.html`);
}

export function metaProblems(html) {
  const problems = [];
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1].trim();
  if (!title) problems.push('missing <title>');
  if (!/<meta name="description" content="[^"]+"/.test(html)) problems.push('missing meta description');
  if (!/<meta property="og:image" content="[^"]+"/.test(html)) problems.push('missing og:image');
  return problems;
}

export function checkSite(dist) {
  const skipStudio = !existsSync(join(dist, STUDIO_DEMO));
  const problems = [];
  for (const file of pagesIn(dist)) {
    const html = readFileSync(file, 'utf8');
    const page = '/' + relative(dist, file);
    // Redirect stubs and the 404 page carry no share metadata of their own.
    if (!/http-equiv="refresh"/.test(html) && !page.endsWith('/404.html')) {
      for (const problem of metaProblems(html)) problems.push(`${page}: ${problem}`);
    }
    for (const url of new Set(localUrls(html))) {
      if (skipStudio && url.startsWith(STUDIO_DEMO)) continue;
      if (!resolves(dist, url)) problems.push(`${page}: broken local link ${url}`);
    }
  }
  return { problems, skipStudio };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dist = resolve(process.argv[2] ?? 'dist');
  const { problems, skipStudio } = checkSite(dist);
  if (skipStudio) console.log(`Skipped links into ${STUDIO_DEMO}; CI adds the demo after the build.`);
  if (problems.length) {
    console.error(problems.join('\n'));
    console.error(`\n${problems.length} problem(s) in ${dist}`);
    process.exit(1);
  }
  console.log(`Checked ${pagesIn(dist).length} pages in ${relative(process.cwd(), dist) || '.'}: no broken links or missing metadata.`);
}
