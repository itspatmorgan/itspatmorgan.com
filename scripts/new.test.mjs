// The starters write a draft that follows the site's patterns, never overwrite work, and published entries never keep a TODO.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { starter, write } from './new.mjs';

const root = path.resolve(import.meta.dirname, '..');

test('a case study starter writes a draft entry, its page, a stylesheet and one scene', () => {
  const files = starter('case-study', 'acme-search', 'Making search fast', root);
  assert.deepEqual(Object.keys(files).sort(), [
    'src/components/acme-search/AcmeSearchProblem.tsx',
    'src/components/acme-search/acme-search.css',
    'src/content/projects/acme-search.md',
    'src/pages/work/acme-search.astro',
  ]);
  const entry = files['src/content/projects/acme-search.md'];
  assert.match(entry, /^draft: true$/m);
  assert.match(entry, /^title: "Making search fast"$/m);
  assert.match(files['src/pages/work/acme-search.astro'], /noindex=\{project\.data\.draft\}/);
  assert.match(files['src/pages/work/acme-search.astro'], /slide\('problem'\)/);
  assert.match(entry, /^    problem:$/m);
});

test('a Lab starter writes a draft entry and a page on LabLayout', () => {
  const files = starter('lab', 'ink-flow', 'Ink Flow');
  assert.match(files['src/content/lab/ink-flow.mdx'], /^draft: true$/m);
  assert.match(files['src/pages/lab/ink-flow.astro'], /<LabLayout entry=\{entry\}>/);
});

test('starters reject bad slugs and never overwrite a file', () => {
  assert.throws(() => starter('lab', 'Ink Flow', 'Ink Flow'), /slug/);
  assert.throws(() => starter('lab', 'ink-flow', ''), /title/);
  assert.throws(() => starter('poster', 'ink-flow', 'Ink Flow'), /Usage/);
  const dir = mkdtempSync(path.join(tmpdir(), 'starter-'));
  write(starter('lab', 'ink-flow', 'Ink Flow'), dir);
  assert.ok(existsSync(path.join(dir, 'src/pages/lab/ink-flow.astro')));
  assert.throws(() => write(starter('lab', 'ink-flow', 'Ink Flow'), dir), /Already exists/);
});

test('no published case study or Lab entry still has a TODO', () => {
  const leftovers = [];
  for (const [content, pages] of [['src/content/projects', 'src/pages/work'], ['src/content/lab', 'src/pages/lab']]) {
    for (const file of readdirSync(path.join(root, content))) {
      const text = readFileSync(path.join(root, content, file), 'utf8');
      if (/^draft:\s*true\b/m.test(text)) continue;
      const page = path.join(root, pages, file.replace(/\.mdx?$/, '.astro'));
      for (const [name, body] of [[path.join(content, file), text], [path.relative(root, page), existsSync(page) ? readFileSync(page, 'utf8') : '']]) {
        if (/\bTODO\b/.test(body)) leftovers.push(name);
      }
    }
  }
  assert.deepEqual(leftovers, [], `Published, but still has a TODO:\n${leftovers.join('\n')}`);
});
