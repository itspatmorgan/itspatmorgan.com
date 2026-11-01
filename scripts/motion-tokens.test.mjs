// The scene player's easing curves (src/components/case-study/motion.ts) must match the CSS tokens of the same name in
// src/styles/global.css, so demos and the rest of the site move with one set of curves.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const css = readFileSync(path.join(root, 'src/styles/global.css'), 'utf8');
const ts = readFileSync(path.join(root, 'src/components/case-study/motion.ts'), 'utf8');
const numbers = text => text.split(',').map(n => Number(n.trim()));

test('scene player curves match the CSS motion tokens', () => {
  const curves = [...ts.matchAll(/^\s+(\w+): \[([^\]]+)\],$/gm)];
  assert.ok(curves.length >= 2, 'no curves found in motion.ts');
  for (const [, name, values] of curves) {
    const token = css.match(new RegExp(`--motion-ease-${name}:\\s*cubic-bezier\\(([^)]+)\\)`));
    assert.ok(token, `global.css has no --motion-ease-${name}`);
    assert.deepEqual(numbers(values), numbers(token[1]), `--motion-ease-${name} and EASE.${name} differ`);
  }
});
