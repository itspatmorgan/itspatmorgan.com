// Agent docs check: keeps AGENTS.md, agents/ and the skills honest as the site changes. It fails when a skill's metadata is
// wrong, when a skill named in AGENTS.md doesn't exist, or when the docs point at a repository path that is gone.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, readlinkSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const skillsDir = path.join(root, 'agents/skills');

function markdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.name.endsWith('.md') ? [full] : [];
  });
}

const docs = [path.join(root, 'AGENTS.md'), ...markdownFiles(path.join(root, 'agents'))];
const skills = readdirSync(skillsDir, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name);

function frontmatter(file) {
  const match = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  return Object.fromEntries(match[1].split('\n').map(line => line.match(/^(\w+):\s*(.*)$/)).filter(Boolean).map(m => [m[1], m[2].trim()]));
}

test('every skill has a SKILL.md whose name matches its folder and whose description says when to use it', () => {
  assert.ok(skills.length > 0);
  for (const skill of skills) {
    const file = path.join(skillsDir, skill, 'SKILL.md');
    assert.ok(existsSync(file), `${skill} has no SKILL.md`);
    const meta = frontmatter(file);
    assert.ok(meta, `${skill}/SKILL.md has no frontmatter`);
    assert.equal(meta.name, skill, `${skill}/SKILL.md is named "${meta.name}"`);
    assert.match(skill, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${skill} is not lowercase-hyphenated`);
    assert.ok(meta.description, `${skill} has no description`);
    assert.ok(meta.description.length <= 1024, `${skill}'s description is over 1,024 characters`);
    assert.match(meta.description, /\bUse (when|before)\b/, `${skill}'s description doesn't say when to use it`);
  }
});

test('every skill AGENTS.md routes to exists', () => {
  const agents = readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
  const named = [...agents.matchAll(/\|\s*`([a-z0-9-]+)`\s*\|\s*$/gm)].map(m => m[1]);
  assert.ok(named.length > 0, 'AGENTS.md lists no skills');
  for (const skill of named) assert.ok(skills.includes(skill), `AGENTS.md routes to a missing skill: ${skill}`);
  for (const skill of skills) assert.ok(named.includes(skill), `AGENTS.md doesn't route to ${skill}`);
});

test('Claude and other agents load the same instructions and skills', () => {
  assert.match(readFileSync(path.join(root, 'CLAUDE.md'), 'utf8'), /^@AGENTS\.md$/m, 'CLAUDE.md must import AGENTS.md');
  for (const link of ['.claude/skills', '.agents/skills']) {
    assert.equal(readlinkSync(path.join(root, link)), '../agents/skills', `${link} should link to agents/skills`);
  }
});

// Paths in backticks that start at a repository root folder, and relative Markdown links, must exist. Placeholders and
// globs (`<slug>`, `*`, `{md,mdx}`) are skipped.
const rooted = /^(src|scripts|agents|public|\.github)\//;
const placeholder = /[<>*{}]|\.\.\./;

test('every repository path the agent docs mention exists', () => {
  const missing = [];
  for (const file of docs) {
    const text = readFileSync(file, 'utf8');
    for (const [, ref] of text.matchAll(/`([^`\s]+)`/g)) {
      if (!rooted.test(ref) || placeholder.test(ref)) continue;
      if (!existsSync(path.join(root, ref.replace(/[.,:;)]+$/, '')))) missing.push(`${path.relative(root, file)}: ${ref}`);
    }
    for (const [, ref] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^(https?:|mailto:|#)/.test(ref) || placeholder.test(ref)) continue;
      const target = path.resolve(path.dirname(file), ref.split('#')[0]);
      if (!existsSync(target)) missing.push(`${path.relative(root, file)}: ${ref}`);
    }
  }
  assert.deepEqual(missing, [], `Agent docs point at missing paths:\n${missing.join('\n')}`);
});

test('skill reference files are linked from their SKILL.md', () => {
  for (const skill of skills) {
    const refs = path.join(skillsDir, skill, 'references');
    if (!existsSync(refs) || !statSync(refs).isDirectory()) continue;
    const body = readFileSync(path.join(skillsDir, skill, 'SKILL.md'), 'utf8');
    for (const name of readdirSync(refs)) {
      assert.ok(body.includes(`references/${name}`), `${skill}/references/${name} isn't linked from SKILL.md`);
    }
  }
});
