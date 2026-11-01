// Image prep: images come out upright, no wider than asked, in the format their folder needs, and never enlarged.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { plan, prepare } from './image.mjs';

const dir = mkdtempSync(path.join(tmpdir(), 'image-'));
const make = (file, width, height, options = {}) =>
  sharp({ create: { width, height, channels: 3, background: '#c08040' } }).withMetadata(options).png().toFile(file);

test('plans WebP for site images, JPG for share cards, and leaves SVG and GIF alone', () => {
  assert.deepEqual(plan('public/images/a/shot.png', 3000), { format: 'webp', out: 'public/images/a/shot.webp', width: 2400 });
  assert.deepEqual(plan('public/images/share/work-x.png', 1200), { format: 'jpeg', out: 'public/images/share/work-x.jpg', width: 1200 });
  assert.equal(plan('public/images/a/logo.svg', 0).skip, 'SVG is kept as it is');
  assert.equal(plan('public/images/a/loop.gif', 0).skip, 'GIF is kept as it is');
});

test('scales a wide image down to the width and writes WebP beside it', async () => {
  const file = path.join(dir, 'wide.png');
  await make(file, 3200, 1600);
  const r = await prepare(file);
  assert.equal(r.out, path.join(dir, 'wide.webp'));
  assert.deepEqual([r.width, r.height], [2400, 1200]);
  assert.equal((await sharp(r.out).metadata()).format, 'webp');
  assert.ok(existsSync(file), 'the original stays without --replace');
});

test('never enlarges, and --replace removes the original', async () => {
  const file = path.join(dir, 'small.png');
  await make(file, 800, 600);
  const r = await prepare(file, { replace: true });
  assert.deepEqual([r.width, r.height], [800, 600]);
  assert.ok(!existsSync(file));
});

test('turns a sideways photo upright', async () => {
  const file = path.join(dir, 'turned.png');
  await make(file, 400, 200, { orientation: 6 });
  const r = await prepare(file);
  assert.deepEqual([r.width, r.height], [200, 400]);
});

test('share cards stay JPG', async () => {
  mkdirSync(path.join(dir, 'images/share'), { recursive: true });
  const file = path.join(dir, 'images/share/card.png');
  await make(file, 1200, 630);
  const r = await prepare(file);
  assert.equal(path.extname(r.out), '.jpg');
  assert.equal((await sharp(r.out).metadata()).format, 'jpeg');
});
