/**
 * Generate deterministic editorial feature images for writing articles.
 *
 * Run from the repo root:
 *   node scripts/generate-writing-art.mjs [--slug article-slug] [--dry-run] [--overwrite-visual] [--overwrite-image]
 *
 * The website repo owns `visual` and generated `image` frontmatter. Obsidian
 * sync preserves those fields, but does not need to carry them in draft notes.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import sharp from 'sharp';
import YAML from 'yaml';
// One engine for article art: the same generators draw the live visual on the page and this share image.
import { brand, resolveLayerColor, CANVAS_W as W, CANVAS_H as H } from '@itspatmorgan/kit/generative-art/themes';
import { generateFlowField } from '@itspatmorgan/kit/generative-art/generators/flowField';
import { generateDotGrid } from '@itspatmorgan/kit/generative-art/generators/dotGrid';
import { generateIsolines } from '@itspatmorgan/kit/generative-art/generators/isoline';
import { generateVoronoi } from '@itspatmorgan/kit/generative-art/generators/voronoi';
import { makeRng } from '@itspatmorgan/kit/generative-art/generators/noise';

const CLI = parseArgs(process.argv.slice(2));
const DRY_RUN = CLI.flags.has('dry-run');
const OVERWRITE_VISUAL = CLI.flags.has('overwrite-visual');
const OVERWRITE_IMAGE = CLI.flags.has('overwrite-image');
const TARGET_SLUG = CLI.options.slug;

const WRITING_DIR = resolve('src/content/writing');
const IMAGE_ROOT = resolve('public/images/writing');

const themeDefaults = {
  AI: {
    seedOffset: 42,
    visual: { theme: 'AI', background: 'warm-dark-gray', generator: { type: 'strange-attractor', seed: 42, opacity: 85, color: 'copper' }, texture: 20, grain: 24 },
  },
  Design: {
    seedOffset: 137,
    visual: { theme: 'Design', background: 'warm-dark-gray', generator: { type: 'isoline', seed: 137, levels: 12, scale: 350, strokeWidth: 0.7, opacity: 75, color: 'copper' }, texture: 0, grain: 24 },
  },
  'Systems Thinking': {
    seedOffset: 73,
    visual: { theme: 'Systems Thinking', background: 'warm-dark-gray', generator: { type: 'voronoi', seed: 73, count: 60, jitter: 60, strokeWidth: 0.6, opacity: 75, color: 'copper' }, texture: 0, grain: 24 },
  },
  'Creative Practice': {
    seedOffset: 256,
    visual: { theme: 'Creative Practice', background: 'warm-dark-gray', generator: { type: 'flow-field', seed: 256, density: 150, steps: 100, scale: 320, curl: 30, strokeWidth: 1.0, opacity: 75, color: 'copper' }, texture: 20, grain: 24 },
  },
  Career: {
    seedOffset: 512,
    visual: { theme: 'Career', background: 'warm-dark-gray', generator: { type: 'dot-grid', seed: 512, spacing: 22, scale: 300, dotSize: 70, opacity: 70, color: 'copper' }, texture: 0, grain: 24 },
  },
  default: {
    seedOffset: 256,
    visual: { theme: 'default', background: 'warm-dark-gray', generator: { type: 'flow-field', seed: 256, density: 150, steps: 100, scale: 320, curl: 30, strokeWidth: 1.0, opacity: 75, color: 'copper' }, texture: 20, grain: 24 },
  },
};

let updated = 0;
let generated = 0;
let skipped = 0;
let errors = 0;

function parseArgs(argv) {
  const flags = new Set();
  const options = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--') continue;
    if (!arg.startsWith('--')) continue;

    const [rawKey, inlineValue] = arg.slice(2).split(/=(.*)/s);
    if (inlineValue !== undefined) {
      options[rawKey] = inlineValue;
      continue;
    }

    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      options[rawKey] = next;
      i++;
    } else {
      flags.add(rawKey);
    }
  }

  return { flags, options };
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  return { raw: match[1], body: match[2] };
}

function serializeFrontmatter(fields) {
  const order = [
    'title', 'description', 'publishedDate', 'categories', 'theme', 'tags',
    'visual', 'image', 'canonicalUrl', 'draft',
  ];
  const lines = [];

  for (const key of order) {
    if (fields[key] !== undefined) appendField(lines, key, fields[key]);
  }
  for (const [key, value] of Object.entries(fields)) {
    if (!order.includes(key)) appendField(lines, key, value);
  }

  return lines.join('\n');
}

function appendField(lines, key, value) {
  if (value === '' || value === null || value === undefined) return;

  if (Array.isArray(value)) {
    if (value.length === 0) {
      lines.push(`${key}: []`);
      return;
    }
    lines.push(`${key}:`);
    for (const item of value) lines.push(`  - ${item}`);
    return;
  }

  if (typeof value === 'object') {
    lines.push(`${key}:`);
    const nested = YAML.stringify(value, { lineWidth: 0 }).trimEnd();
    for (const line of nested.split('\n')) lines.push(`  ${line}`);
    return;
  }

  if (typeof value === 'boolean') {
    lines.push(`${key}: ${value}`);
    return;
  }

  const stringValue = String(value);
  const needsQuotes = /[:#\[\]{}&*!|>'"%@`]/.test(stringValue) || stringValue.startsWith(' ');
  lines.push(`${key}: ${needsQuotes ? `"${stringValue.replace(/"/g, '\\"')}"` : stringValue}`);
}

function slugSeed(slug) {
  let hash = 2166136261;
  for (const char of slug) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % 999 + 1;
}

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function deriveVisual(fields, slug) {
  const theme = fields.theme || 'default';
  const defaults = themeDefaults[theme] ?? themeDefaults.default;
  const visual = structuredClone(defaults.visual);
  visual.theme = theme;
  visual.generator.seed = ((slugSeed(slug) + defaults.seedOffset - 1) % 999) + 1;
  return {
    version: 1,
    ...visual,
  };
}

function generatedImagePath(slug) {
  return `/images/writing/${slug}/feature.jpg`;
}

function backgroundColor(visual) {
  if (visual.background === 'paper') return brand.paper;
  if (visual.background === 'off-white') return brand.offWhite;
  return brand.warmDarkGray;
}

function isRichAttractor(a, b, c, d) {
  const grid = 32;
  const seen = new Uint8Array(grid * grid);
  let uniqueCells = 0;
  let x = 0.1;
  let y = 0.2;

  for (let i = 0; i < 2500; i++) {
    const nx = Math.sin(a * y) + c * Math.cos(a * x);
    const ny = Math.sin(b * x) + d * Math.cos(b * y);
    x = nx;
    y = ny;

    if (i > 100) {
      const gx = Math.floor(((x + 3) / 6) * grid);
      const gy = Math.floor(((y + 3) / 6) * grid);
      if (gx >= 0 && gx < grid && gy >= 0 && gy < grid) {
        const idx = gy * grid + gx;
        if (seen[idx] === 0) {
          seen[idx] = 1;
          uniqueCells++;
          if (uniqueCells >= 120) return true;
        }
      }
    }
  }

  return false;
}

function cliffordParams(seed) {
  for (let attempt = 0; attempt < 20; attempt++) {
    const rng = makeRng(seed * 2053 + 7919 + attempt * 31337);
    const a = rng() * 3.6 - 1.8;
    const b = rng() * 3.6 - 1.8;
    const c = rng() * 3.6 - 1.8;
    const d = rng() * 3.6 - 1.8;
    if (isRichAttractor(a, b, c, d)) return [a, b, c, d];
  }
  return [-1.4, 1.6, 1.0, 0.7];
}

function renderAttractorBuffer(visual) {
  const generator = visual.generator;
  const bg = hexToRgb(backgroundColor(visual));
  const fg = hexToRgb(resolveLayerColor(generator.color));
  const iterations = 250000;
  const warmup = 300;
  const pad = 0.07;

  const buildDensity = ([a, b, c, d]) => {
    const density = new Uint32Array(W * H);
    let x = 0.1;
    let y = 0.2;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < iterations + warmup; i++) {
      const nx = Math.sin(a * y) + c * Math.cos(a * x);
      const ny = Math.sin(b * x) + d * Math.cos(b * y);
      x = nx;
      y = ny;
      if (i >= warmup) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    let maxDensity = 0;
    let uniquePixels = 0;
    x = 0.1;
    y = 0.2;

    for (let i = 0; i < iterations + warmup; i++) {
      const nx = Math.sin(a * y) + c * Math.cos(a * x);
      const ny = Math.sin(b * x) + d * Math.cos(b * y);
      x = nx;
      y = ny;

      if (i >= warmup) {
        const cx = Math.floor(((x - minX) / rangeX * (1 - 2 * pad) + pad) * W);
        const cy = Math.floor(((y - minY) / rangeY * (1 - 2 * pad) + pad) * H);
        if (cx >= 0 && cx < W && cy >= 0 && cy < H) {
          const idx = cy * W + cx;
          if (density[idx] === 0) uniquePixels++;
          const val = ++density[idx];
          if (val > maxDensity) maxDensity = val;
        }
      }
    }

    return { density, maxDensity, uniquePixels };
  };

  let result = buildDensity(cliffordParams(generator.seed));
  if (result.uniquePixels < 4000) {
    result = buildDensity([-1.4, 1.6, 1.0, 0.7]);
  }

  const output = Buffer.alloc(W * H * 3);
  const logMax = Math.log1p(result.maxDensity) || 1;
  const maxA = (generator.opacity / 100) * 0.92;

  for (let i = 0; i < W * H; i++) {
    const count = result.density[i];
    const alpha = count === 0 ? 0 : (Math.log1p(count) / logMax) * maxA;
    const px = i * 3;
    output[px] = Math.round(bg[0] * (1 - alpha) + fg[0] * alpha);
    output[px + 1] = Math.round(bg[1] * (1 - alpha) + fg[1] * alpha);
    output[px + 2] = Math.round(bg[2] * (1 - alpha) + fg[2] * alpha);
  }

  return output;
}

const point = (x, y) => `${x.toFixed(1)},${y.toFixed(1)}`;
const segment = ([x1, y1, x2, y2]) => `M ${point(x1, y1)} L ${point(x2, y2)}`;

function renderGenerator(generator) {
  const color = resolveLayerColor(generator.color);

  if (generator.type === 'flow-field') {
    const paths = generateFlowField(generator)
      .map(({ points }) => `<path d="${points.map(([x, y], i) => `${i ? 'L' : 'M'} ${point(x, y)}`).join(' ')}" />`)
      .join('');
    return `<g stroke="${color}" fill="none" stroke-width="${generator.strokeWidth}" opacity="${(generator.opacity / 100) * 0.65}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;
  }

  if (generator.type === 'dot-grid') {
    const dots = generateDotGrid(generator).map((dot) => `<circle cx="${dot.cx.toFixed(1)}" cy="${dot.cy.toFixed(1)}" r="${dot.r.toFixed(2)}" />`).join('');
    return `<g fill="${color}" opacity="${(generator.opacity / 100) * 0.80}">${dots}</g>`;
  }

  if (generator.type === 'isoline') {
    const paths = generateIsolines(generator).map((level) => `<path d="${level.map(segment).join(' ')}" />`).join('');
    return `<g stroke="${color}" fill="none" stroke-width="${generator.strokeWidth}" opacity="${(generator.opacity / 100) * 0.70}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;
  }

  if (generator.type === 'voronoi') {
    const d = generateVoronoi(generator).map(segment).join(' ');
    return `<g stroke="${color}" fill="none" stroke-width="${generator.strokeWidth}" opacity="${(generator.opacity / 100) * 0.75}" stroke-linecap="round" stroke-linejoin="round"><path d="${d}" /></g>`;
  }

  throw new Error(`No share image renderer for ${generator.type}`);
}

function renderSvg(visual) {
  const bg = backgroundColor(visual);
  const layer = renderGenerator(visual.generator);

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${bg}" />
  <filter id="grain" x="0%" y="0%" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.72 0.68" numOctaves="4" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
  </filter>
  ${layer}
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="${(visual.grain / 100) * 0.16}" style="mix-blend-mode:screen" />
</svg>`;
}

async function writeOptimizedImage(visual, outPath) {
  if (DRY_RUN) return;
  mkdirSync(dirname(outPath), { recursive: true });

  if (visual.generator.type === 'strange-attractor') {
    await sharp(renderAttractorBuffer(visual), {
      raw: { width: W, height: H, channels: 3 },
    })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toFile(outPath);
    return;
  }

  const svg = renderSvg(visual);
  await sharp(Buffer.from(svg))
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(outPath);
}

async function processFile(fileName) {
  const slug = fileName.replace(/\.md$/, '');
  const filePath = join(WRITING_DIR, fileName);
  const content = readFileSync(filePath, 'utf8');
  const parsed = parseFrontmatter(content);
  if (!parsed) {
    skipped++;
    return;
  }

  const fields = YAML.parse(parsed.raw) ?? {};
  let changed = false;

  if (!fields.visual || OVERWRITE_VISUAL) {
    fields.visual = deriveVisual(fields, slug);
    changed = true;
  }

  const imagePath = generatedImagePath(slug);
  const imageOutPath = join(IMAGE_ROOT, slug, 'feature.jpg');
  const imageIsGenerated = fields.image === imagePath;
  const imageExists = existsSync(imageOutPath);

  if (!imageIsGenerated || !imageExists || OVERWRITE_IMAGE) {
    await writeOptimizedImage(fields.visual, imageOutPath);
    fields.image = imagePath;
    changed = true;
    generated++;
  }

  if (changed) {
    const next = `---\n${serializeFrontmatter(fields)}\n---\n${parsed.body}`;
    if (DRY_RUN) {
      console.log(`  DRY RUN -> ${slug}`);
    } else {
      writeFileSync(filePath, next, 'utf8');
      console.log(`  updated -> ${slug}`);
    }
    updated++;
  } else {
    skipped++;
  }
}

const files = readdirSync(WRITING_DIR)
  .filter((file) => file.endsWith('.md'))
  .filter((file) => !TARGET_SLUG || file === `${TARGET_SLUG}.md`)
  .sort();

if (TARGET_SLUG && files.length === 0) {
  console.error(`No writing article found for slug "${TARGET_SLUG}".`);
  process.exit(1);
}

console.log(`Generating writing art for ${files.length} article${files.length === 1 ? '' : 's'}${TARGET_SLUG ? ' (targeted)' : ''}${DRY_RUN ? ' (dry run)' : ''}...\n`);

for (const file of files) {
  try {
    await processFile(file);
  } catch (err) {
    errors++;
    console.error(`  ERROR: ${file} — ${err.message}`);
  }
}

console.log(`\nDone. ${updated} updated, ${generated} images generated, ${skipped} unchanged, ${errors} errors.`);
if (errors > 0) process.exit(1);
