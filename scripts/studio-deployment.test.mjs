import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const selectSource = require('./select-studio-source.cjs');
const repository = { id: 1401250166, name: 'design-studio', full_name: 'itspatmorgan/design-studio', owner: { login: 'itspatmorgan' } };
const passingRun = { head_sha: 'a'.repeat(40), head_repository: { id: repository.id }, html_url: 'https://github.com/itspatmorgan/design-studio/actions/runs/1' };

test('source selection follows repository identity after a rename and requires a successful main push', async () => {
  const outputs = {};
  await selectSource({
    github: {
      request: async (endpoint, input) => {
        assert.equal(input.repository_id, repository.id);
        return { data: repository };
      },
      rest: { actions: { listWorkflowRuns: async input => {
        assert.equal(input.repo, 'design-studio');
        assert.equal(input.branch, 'main');
        assert.equal(input.event, 'push');
        assert.equal(input.status, 'success');
        return { data: { workflow_runs: [passingRun] } };
      } } },
    },
    core: { setOutput: (key, value) => { outputs[key] = value; }, info() {} },
  });
  assert.deepEqual(outputs, { repository: repository.full_name, sha: passingRun.head_sha });
});

test('missing or foreign source runs cannot publish an unverified demo', async () => {
  for (const runs of [[], [{ ...passingRun, head_repository: { id: 1 } }]]) {
    await assert.rejects(selectSource({
      github: {
        request: async () => ({ data: repository }),
        rest: { actions: { listWorkflowRuns: async () => ({ data: { workflow_runs: runs } }) } },
      },
      core: { setOutput() { assert.fail('No checkout output should be emitted'); }, info() {} },
    }), /No successful Design Studio/);
  }
});

const fallback = fs.readFileSync(new URL('../src/pages/404.astro', import.meta.url), 'utf8').match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
async function runFallback(url, unavailable = false) {
  const parsed = new URL(url, 'https://itspatmorgan.com');
  const state = { fetched: [], written: [], redirects: [], style: {} };
  vm.runInNewContext(fallback, {
    location: { pathname: parsed.pathname, search: parsed.search, hash: parsed.hash, replace: url => state.redirects.push(url) },
    document: { documentElement: { style: state.style }, open() {}, write: html => state.written.push(html), close() {} },
    fetch: async url => {
      state.fetched.push(url);
      return { ok: !unavailable, text: async () => '<html>Studio entry</html>' };
    },
  });
  await new Promise(resolve => setImmediate(resolve));
  return state;
}

test('old demo links preserve artifact paths, search and fragments', async () => {
  const state = await runFallback('/design-studio-starter/prototypes/example?mode=source#section');
  assert.deepEqual(state.redirects, ['/design-studio-demo/prototypes/example?mode=source#section']);
  assert.deepEqual(state.fetched, []);
});

test('direct demo application links load the entry while product and missing asset paths retain the website 404', async () => {
  const state = await runFallback('/design-studio-demo/prototypes/example/artifacts/document?mode=source#section');
  assert.deepEqual(state.fetched, ['/design-studio-demo/index.html']);
  assert.deepEqual(state.written, ['<html>Studio entry</html>']);
  assert.deepEqual(state.redirects, []);
  assert.equal(state.style.visibility, '');
  for (const url of ['/design-studio/', '/design-studio/missing', '/design-studio-demo/assets/missing.js', '/missing']) {
    const ignored = await runFallback(url);
    assert.deepEqual(ignored.fetched, []);
    assert.deepEqual(ignored.redirects, []);
  }
  const unavailable = await runFallback('/design-studio-demo/systems', true);
  assert.equal(unavailable.style.visibility, '');
  assert.deepEqual(unavailable.written, []);
});

test('assembly requires the demo base path and preserves the website product page and root fallback', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-website-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'dist/design-studio'), { recursive: true });
  fs.mkdirSync(path.join(root, 'studio-dist'), { recursive: true });
  fs.writeFileSync(path.join(root, 'dist/index.html'), 'Website');
  fs.writeFileSync(path.join(root, 'dist/404.html'), 'Website fallback');
  fs.writeFileSync(path.join(root, 'dist/design-studio/index.html'), 'Product page');
  const source = path.join(root, 'studio-dist/index.html');
  const assemble = () => spawnSync(process.execPath, [new URL('./include-studio-demo.mjs', import.meta.url).pathname, path.dirname(source)], { cwd: root });
  fs.writeFileSync(source, '<script src="/assets/index.js"></script>');
  assert.notEqual(assemble().status, 0);
  assert.equal(fs.existsSync(path.join(root, 'dist/design-studio-demo')), false);
  fs.writeFileSync(source, '<script src="/design-studio-demo/assets/index.js"></script>');
  assert.equal(assemble().status, 0);
  assert.equal(fs.readFileSync(path.join(root, 'dist/design-studio/index.html'), 'utf8'), 'Product page');
  assert.equal(fs.readFileSync(path.join(root, 'dist/404.html'), 'utf8'), 'Website fallback');
  assert.notEqual(assemble().status, 0, 'An existing demo must not be partially overwritten');
});
