// Record visual library entries (src/visuals) as an mp4 of one cycle plus a still, from the dev server's /visuals page.
//
//   node scripts/visuals-record.mjs <id> [--format slide|social] [--detail <id>] [--out visuals-out] [--url http://localhost:4321]
//   node scripts/visuals-record.mjs --all [--format slide]
//
// A visual records only its card (a detail, the whole detail): the slide or post draws the backdrop and ring itself, so the screen
// can sit on any layout. A scene that cycles records from one restart to the next; one that holds records until its end state, then
// holds it. A detail is a still of the scene's end state. Needs `pnpm dev` running, Playwright (as for frame-check.mjs; playwright-core
// works too) with Chrome installed, and ffmpeg.
import { createRequire } from 'node:module';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = (() => { try { return require('playwright'); } catch { return require('playwright-core'); } })();

const args = process.argv.slice(2);
const option = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const base = option('url', 'http://localhost:4321');
const format = option('format', 'slide');
const detail = option('detail');
const out = path.resolve(option('out', 'visuals-out'));
const SCALE = 2;
const HOLD = 2500;
const sizes = { slide: [1920, 1080], social: [1080, 1350] };

// The screencast follows the window, not the page's viewport, so the window is the format's size at the recording scale.
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: [`--force-device-scale-factor=${SCALE}`, `--window-size=${sizes[format].join(',')}`] });
let ids = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
if (args.includes('--all')) {
  const page = await browser.newPage();
  await page.goto(`${base}/visuals`, { waitUntil: 'networkidle' });
  ids = await page.$$eval('article h3 code', codes => codes.map(c => c.textContent));
  await page.close();
}
if (!ids.length) { console.error('Name a visual id, or pass --all.'); process.exit(1); }

for (const id of ids) {
  const [width, height] = sizes[format];
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: SCALE });
  const page = await ctx.newPage();
  const name = `${id}-${format}${detail ? `-${detail}` : ''}`;
  await mkdir(out, { recursive: true });
  // Note when each take begins: the scene's restart fade ends and a new cycle starts at step 0.
  await page.addInitScript(() => {
    window.__takes = [];
    new MutationObserver(list => {
      for (const m of list) {
        if (m.attributeName !== 'class' || !m.target.classList?.contains('cs-scene')) continue;
        if ((m.oldValue || '').includes('cs-loop-reset') && !m.target.classList.contains('cs-loop-reset')) window.__takes.push(Date.now());
      }
    }).observe(document, { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class'] });
  });
  await page.goto(`${base}/visuals?id=${id}&format=${format}${detail ? `&detail=${detail}` : ''}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.vl-visual[data-ready="true"] .cs-scene', { timeout: 15000 });
  const target = detail ? '.vl-visual' : '.vl-visual .cs-card';

  if (detail) {
    await page.waitForSelector('.cs-scene[data-done="true"]', { timeout: 60000 });
    await page.waitForTimeout(1600);
    await page.locator(target).screenshot({ path: path.join(out, `${name}.png`) });
    console.log(name, 'still');
    await ctx.close();
    continue;
  }

  const cycle = await page.$eval('.cs-scene', el => el.dataset.cycle === 'true');
  const cdp = await ctx.newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
    frames.push({ t: metadata.timestamp * 1000, data });
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  let from, to;
  if (cycle) {
    // Record exactly one cycle: from the next take's start to the one after.
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, everyNthFrame: 1, maxWidth: width * SCALE, maxHeight: height * SCALE });
    const takes = await page.evaluate(() => window.__takes.length);
    await page.waitForFunction(n => window.__takes.length > n, takes, { timeout: 90000, polling: 50 });
    from = await page.evaluate(() => window.__takes.at(-1));
    await page.waitForFunction(n => window.__takes.length > n + 1, takes, { timeout: 90000, polling: 50 });
    to = await page.evaluate(() => window.__takes.at(-1)) - 240;
  } else {
    // A scene that holds plays from its first frame: reload so the screencast catches the start, then hold the end state.
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, everyNthFrame: 1, maxWidth: width * SCALE, maxHeight: height * SCALE });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.vl-visual[data-ready="true"] .cs-scene');
    from = Date.now();
    await page.waitForSelector('.cs-scene[data-done="true"]', { timeout: 60000 });
    to = Date.now() + HOLD;
    await page.waitForTimeout(HOLD + 300);
  }
  await cdp.send('Page.stopScreencast');
  const box = await page.locator(target).boundingBox();
  // The still is the visual's poster step, settled: the frame that tells the story on its own.
  await page.waitForFunction(() => {
    const el = document.querySelector('.cs-scene'), poster = document.querySelector('.vl-visual')?.dataset.poster;
    return el && Number(el.dataset.step) === (poster ? Number(poster) : Number(el.dataset.steps) - 1) && !el.classList.contains('cs-loop-reset');
  }, null, { timeout: 90000, polling: 50 });
  await page.waitForTimeout(1200);
  await page.locator(target).screenshot({ path: path.join(out, `${name}.png`) });

  // Frames → a concat list with their real durations → a 30fps mp4 cropped to the card.
  const dir = path.join(out, `${name}-frames`);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir);
  const kept = [];
  let before = null;
  for (const f of frames) { if (f.t < from) before = f; else if (f.t <= to) kept.push(f); }
  if (before) kept.unshift({ ...before, t: from });
  let list = '';
  for (let k = 0; k < kept.length; k++) {
    const file = `${String(k).padStart(5, '0')}.jpg`;
    await writeFile(path.join(dir, file), Buffer.from(kept[k].data, 'base64'));
    const next = k + 1 < kept.length ? kept[k + 1].t : to;
    list += `file '${file}'\nduration ${Math.max(0.001, (next - kept[k].t) / 1000).toFixed(4)}\n`;
  }
  list += `file '${String(kept.length - 1).padStart(5, '0')}.jpg'\n`;
  await writeFile(path.join(dir, 'list.txt'), list);
  const even = n => Math.floor(n * SCALE / 2) * 2;
  const crop = `crop=${even(box.width)}:${even(Math.min(box.height, height - box.y))}:${Math.round(box.x * SCALE)}:${Math.round(box.y * SCALE)}`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'),
    '-vf', `${crop},fps=30`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'slow', '-movflags', '+faststart', '-an',
    path.join(out, `${name}.mp4`)]);
  await rm(dir, { recursive: true, force: true });
  console.log(name, `${kept.length} frames`, `${((to - from) / 1000).toFixed(1)}s`);
  await ctx.close();
}
await browser.close();
