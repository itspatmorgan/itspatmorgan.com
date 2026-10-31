import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { checkSite, localUrls } from './check-site.mjs';

const head = (image = 'https://itspatmorgan.com/images/share/home.jpg') =>
  `<title>Page</title><meta name="description" content="About the page"><meta property="og:image" content="${image}">`;

function site(pages) {
  const dist = mkdtempSync(join(tmpdir(), 'check-site-'));
  mkdirSync(join(dist, 'images/share'), { recursive: true });
  writeFileSync(join(dist, 'images/share/home.jpg'), '');
  for (const [path, html] of Object.entries(pages)) {
    mkdirSync(join(dist, path, '..'), { recursive: true });
    writeFileSync(join(dist, path), html);
  }
  return dist;
}

test('reads local URLs from links, images, srcset and share tags', () => {
  const html = `<a href="/work/?x=1#top">Work</a><a href="https://example.com/a">Out</a><a href="//cdn.example.com/x">CDN</a>
    <img src="/a.png" srcset="/a-1x.png 1x, /a-2x.png 2x"><meta property="og:image" content="https://itspatmorgan.com/b.jpg">`;
  assert.deepEqual(localUrls(html), ['/work/', '/a.png', '/b.jpg', '/a-1x.png', '/a-2x.png']);
});

test('passes a site whose links resolve', () => {
  const dist = site({
    'index.html': `${head()}<a href="/work/">Work</a><a href="/about">About</a>`,
    'work/index.html': `${head()}<a href="/">Home</a>`,
    'about/index.html': head(),
  });
  assert.deepEqual(checkSite(dist).problems, []);
});

test('reports broken links, missing metadata and a missing share image', () => {
  const dist = site({
    'index.html': `${head()}<a href="/gone/">Gone</a><img src="/images/missing.png">`,
    'work/index.html': '<title></title>',
    'about/index.html': head('https://itspatmorgan.com/images/share/about.jpg'),
  });
  assert.deepEqual(checkSite(dist).problems.sort(), [
    '/about/index.html: broken local link /images/share/about.jpg',
    '/index.html: broken local link /gone/',
    '/index.html: broken local link /images/missing.png',
    '/work/index.html: missing <title>',
    '/work/index.html: missing meta description',
    '/work/index.html: missing og:image',
  ]);
});

test('skips links into the Design Studio demo only when the build has no demo', () => {
  const pages = { 'index.html': `${head()}<a href="/design-studio-demo/">Demo</a>` };
  assert.deepEqual(checkSite(site(pages)).problems, []);
  const dist = site(pages);
  mkdirSync(join(dist, 'design-studio-demo/assets'), { recursive: true });
  assert.deepEqual(checkSite(dist).problems, ['/index.html: broken local link /design-studio-demo/']);
});

test('treats Design Studio demo routes as resolved once the demo is there, but still checks its files', () => {
  const dist = site({
    'index.html': `${head()}<a href="/design-studio-demo/prototypes/abc">Prototype</a><img src="/design-studio-demo/assets/gone.png">`,
    'design-studio-demo/index.html': `${head()}<div id="root"></div>`,
  });
  assert.deepEqual(checkSite(dist).problems, ['/index.html: broken local link /design-studio-demo/assets/gone.png']);
});
