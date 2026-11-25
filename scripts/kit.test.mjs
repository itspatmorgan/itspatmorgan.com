// The kit is an ordinary package: the site imports it from this workspace, and Patrick's Design Studio (studio.itspatmorgan.com)
// installs it at a pinned commit. These checks keep it portable: kit code can't reach back into the site, every module has an export,
// and the code type checks under the kit's own strict settings (packages/kit/tsconfig.json).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const kit = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../packages/kit');

test('kit code imports only itself and its declared packages', () => {
  const allowed = /^(\.{1,2}\/|react$|react\/|motion\/react$|@hugeicons\/)/;
  const files = readdirSync(path.join(kit, 'src'), { recursive: true }).filter(f => /\.tsx?$/.test(f));
  for (const file of files) {
    const source = readFileSync(path.join(kit, 'src', file), 'utf8');
    for (const [, spec] of source.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g))
      assert.match(spec, allowed, `src/${file} imports ${spec}; the kit can't use site paths such as @/`);
    // A component imports the stylesheets it uses, from inside the kit, so no consumer has to remember them.
    for (const [, sheet] of source.matchAll(/^import\s+['"]([^'"]+\.css)['"]/gm))
      assert.match(sheet, /^\.{1,2}\//, `src/${file} imports ${sheet}; import the kit's own stylesheets by relative path`);
  }
});

test('every kit module can be imported by path', () => {
  const exports = Object.values(JSON.parse(readFileSync(path.join(kit, 'package.json'), 'utf8')).exports);
  const modules = readdirSync(path.join(kit, 'src'), { recursive: true }).filter(f => /\.ts$/.test(f) && !f.endsWith('.d.ts'));
  for (const file of modules) assert.ok(exports.includes(`./src/${file}`), `add "./${file.replace(/\.ts$/, '')}" to the kit's exports: only .tsx files match "./*"`);
});

test("kit code type checks under its own strict settings", () => {
  const tsc = path.resolve(kit, '../../node_modules/.bin/tsc');
  try { execFileSync(tsc, ['-p', kit], { encoding: 'utf8' }); }
  catch (error) { assert.fail(`tsc -p packages/kit failed:\n${error.stdout}`); }
});
