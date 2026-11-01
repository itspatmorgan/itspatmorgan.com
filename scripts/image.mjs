// Prepares images for the site: drop a screenshot, photo or export anywhere under public/images/, then run
//
//   pnpm image public/images/<folder>/<file>.png [more files] [--width 2400] [--quality 80] [--replace]
//
// Each image is turned upright, stripped of metadata, scaled down to --width (never up; 2400px covers the 1200px showcase stage at
// 2x) and saved as WebP beside the original. Share cards in public/images/share/ stay JPG, since some apps ignore WebP previews.
// --replace removes the original once the new file is written. It prints each file's size before and after, and the width and
// height to put on its <img> so the page doesn't shift as it loads. SVGs and GIFs are left as they are.
import { existsSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SKIP = new Set(['.svg', '.gif']);
const RASTER = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.tif', '.tiff']);

/** Where an image goes and in what format, from its path and current width. */
export function plan(file, width, { maxWidth = 2400 } = {}) {
  const ext = path.extname(file).toLowerCase();
  if (SKIP.has(ext)) return { skip: `${ext.slice(1).toUpperCase()} is kept as it is` };
  if (!RASTER.has(ext)) return { skip: `not an image this script prepares (${ext || 'no extension'})` };
  const share = file.split(path.sep).join('/').includes('/images/share/');
  const format = share ? 'jpeg' : 'webp';
  const out = file.slice(0, -ext.length) + (share ? '.jpg' : '.webp');
  return { format, out, width: Math.min(width, maxWidth) };
}

/** Prepares one image and returns what changed. */
export async function prepare(file, { maxWidth = 2400, quality = 80, replace = false } = {}) {
  const input = sharp(file).rotate();
  const meta = await input.metadata();
  // EXIF orientations 5 to 8 turn the image a quarter turn, so its upright width is the stored height.
  const width = (meta.orientation ?? 1) >= 5 ? meta.height : meta.width;
  const step = plan(file, width, { maxWidth });
  if (step.skip) return { file, skip: step.skip };
  const before = statSync(file).size;
  const pipeline = input.resize({ width: step.width, withoutEnlargement: true });
  const output = step.format === 'jpeg' ? pipeline.jpeg({ quality: Math.max(quality, 85), mozjpeg: true }) : pipeline.webp({ quality });
  // Writing to a buffer first lets a file be prepared in place (a large WebP made smaller).
  const { data, info } = await output.toBuffer({ resolveWithObject: true });
  await sharp(data).toFile(step.out);
  if (replace && path.resolve(step.out) !== path.resolve(file)) rmSync(file);
  return { file, out: step.out, before, after: data.length, width: info.width, height: info.height };
}

const kb = n => `${Math.round(n / 1024)} KB`;

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const option = name => { const i = args.indexOf(`--${name}`); return i === -1 ? undefined : args.splice(i, 2)[1]; };
  const maxWidth = Number(option('width') ?? 2400);
  const quality = Number(option('quality') ?? 80);
  const replace = args.includes('--replace');
  const files = args.filter(a => a !== '--replace');
  if (!files.length) {
    console.error('Usage: pnpm image <file> [more files] [--width 2400] [--quality 80] [--replace]');
    process.exit(1);
  }
  let failed = false;
  for (const file of files) {
    if (!existsSync(file)) { console.error(`${file}: not found`); failed = true; continue; }
    try {
      const r = await prepare(file, { maxWidth, quality, replace });
      if (r.skip) { console.log(`${file}: skipped, ${r.skip}`); continue; }
      const site = path.relative(path.resolve('public'), path.resolve(r.out));
      console.log(`${r.out}: ${r.width}x${r.height}, ${kb(r.before)} to ${kb(r.after)}${replace && r.out !== file ? ', original removed' : ''}`);
      if (!site.startsWith('..')) console.log(`  <img src="/${site.split(path.sep).join('/')}" width="${r.width}" height="${r.height}" alt="What the image shows" loading="lazy" />`);
    } catch (error) {
      console.error(`${file}: ${error.message}`);
      failed = true;
    }
  }
  if (failed) process.exit(1);
}
