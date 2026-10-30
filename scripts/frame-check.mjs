// Frame check for case-study demos: plays each slide's scene in a real browser and saves a contact sheet of frames taken every
// few hundred milliseconds, at desktop and phone widths, so a camera move or transition can be checked frame by frame, not only its
// end state (see agent-os/skills/case-study-shaping).
//
//   node scripts/frame-check.mjs --url http://localhost:4321/work/sublime-agents [--slides hero,bet] [--widths 1300,390]
//                                [--every 250] [--duration 12000] [--theme light|dark] [--out frame-check]
//
// Start `pnpm dev` (or `pnpm preview`) first. Each slide's sheet lands at <out>/<width>/<slide>.png, and its frames beside it.
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, arg, i, all) => {
  if (arg.startsWith('--')) pairs.push([arg.slice(2), all[i + 1]?.startsWith('--') ? 'true' : all[i + 1] ?? 'true']);
  return pairs;
}, []));
if (!args.url) {
  console.error('Usage: node scripts/frame-check.mjs --url <page url> [--slides ids] [--widths 1300,390] [--every 250] [--duration 12000]');
  process.exit(1);
}
const widths = (args.widths ?? '1300,390').split(',').map(Number);
const every = Number(args.every ?? 250);
const duration = Number(args.duration ?? 12000);
const out = path.resolve(args.out ?? 'frame-check');
const only = args.slides ? new Set(args.slides.split(',')) : null;
const theme = args.theme ?? 'light';

const browser = await chromium.launch();
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: width <= 640 ? 844 : 900 }, deviceScaleFactor: 1, colorScheme: theme });
    await page.goto(args.url, { waitUntil: 'networkidle' });
    // Each slide is named by its headline's id; the hero has none, so it is "hero".
    const slides = await page.$$eval('.cs-slide', nodes => nodes.map((node, i) => node.querySelector('h2')?.id ?? (i === 0 ? 'hero' : `slide-${i}`)));
    for (const [i, id] of slides.entries()) {
      if (only && !only.has(id)) continue;
      const slide = page.locator('.cs-slide').nth(i);
      const stage = slide.locator('.cs-stage, .cs-demo, .cs-scene').first();
      if (!(await stage.count())) continue;
      // Scrolling the stage into view starts its scene from the first frame.
      await stage.scrollIntoViewIfNeeded();
      const dir = path.join(out, String(width), id);
      await mkdir(dir, { recursive: true });
      const frames = [];
      const started = Date.now();
      for (let t = 0; t <= duration; t += every) {
        const wait = started + t - Date.now();
        if (wait > 0) await page.waitForTimeout(wait);
        const shot = await slide.screenshot();
        const file = path.join(dir, `${String(t).padStart(5, '0')}.png`);
        await writeFile(file, shot);
        frames.push({ t, data: shot.toString('base64') });
      }
      await sheet(browser, frames, path.join(out, String(width), `${id}.png`), width);
      console.log(`${width}px ${id}: ${frames.length} frames`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}

/** Lays the frames out in a grid, each labeled with its time, and saves one image. */
async function sheet(browser, frames, file, width) {
  const columns = width <= 640 ? 8 : 4;
  const page = await browser.newPage({ viewport: { width: 2400, height: 800 } });
  await page.setContent(`<body style="margin:0;padding:16px;background:#222;font:12px ui-monospace,monospace;color:#ddd">
    <div style="display:grid;grid-template-columns:repeat(${columns},1fr);gap:12px">
      ${frames.map(f => `<figure style="margin:0"><img style="width:100%;display:block;background:#fff" src="data:image/png;base64,${f.data}"><figcaption>${f.t}ms</figcaption></figure>`).join('')}
    </div></body>`);
  await page.waitForLoadState('load');
  await page.screenshot({ path: file, fullPage: true });
  await page.close();
}
