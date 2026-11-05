// The kit is shared with Patrick's Design Studio (studio.itspatmorgan.com), which imports it at a pinned commit. These checks keep
// it importable there: Studio's copy of each stylesheet must match its source, kit code can't reach back into the site, every module
// has an export, and the code type checks under Studio's stricter settings (packages/kit/tsconfig.json).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SHEETS, studioCss } from '../packages/kit/scripts/studio-css.mjs';

const kit = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../packages/kit');

test('the Studio stylesheets match their sources', () => {
  for (const sheet of SHEETS) {
    const written = readFileSync(path.join(kit, 'studio', path.basename(sheet)), 'utf8');
    assert.equal(written, studioCss(sheet), `studio/${path.basename(sheet)} is stale: run pnpm --filter @itspatmorgan/kit studio-css`);
  }
});

test('kit code imports only itself and its declared packages', () => {
  const allowed = /^(\.{1,2}\/|react$|react\/|motion\/react$|@hugeicons\/)/;
  const files = readdirSync(path.join(kit, 'src'), { recursive: true }).filter(f => /\.tsx?$/.test(f));
  for (const file of files) {
    const source = readFileSync(path.join(kit, 'src', file), 'utf8');
    for (const [, spec] of source.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g))
      assert.match(spec, allowed, `src/${file} imports ${spec}; the kit can't use site paths such as @/`);
    // Stylesheets are imported by whoever renders the component: the site's pages, or Studio's theme (scoped).
    assert.doesNotMatch(source, /^import\s+['"][^'"]+\.css['"]/m, `src/${file} imports a stylesheet; import it where the component is used`);
  }
});

test('every kit module can be imported by path', () => {
  const exports = Object.values(JSON.parse(readFileSync(path.join(kit, 'package.json'), 'utf8')).exports);
  const modules = readdirSync(path.join(kit, 'src'), { recursive: true }).filter(f => /\.ts$/.test(f) && !f.endsWith('.d.ts'));
  for (const file of modules) assert.ok(exports.includes(`./src/${file}`), `add "./${file.replace(/\.ts$/, '')}" to the kit's exports: only .tsx files match "./*"`);
});

test("kit code type checks under Studio's settings", () => {
  const tsc = path.resolve(kit, '../../node_modules/.bin/tsc');
  try { execFileSync(tsc, ['-p', kit], { encoding: 'utf8' }); }
  catch (error) { assert.fail(`tsc -p packages/kit failed:\n${error.stdout}`); }
});
