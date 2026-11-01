// Review sheets for a change: what a page looked like before and after, and the checks a person would otherwise do by eye.
// The review-change skill runs it; the rules it checks are in agents/context/motion.md and agents/principles/design.md.
//
//   node scripts/review.mjs --pages /work/sublime-agents,/design-studio [--after http://localhost:4321]
//                           [--before https://itspatmorgan.com] [--out review] [--motion] [--scenes 1,3] [--square] [--duration 10000]
//
// For each page it saves, under <out>/<page>/:
//   compare-<theme>-<width>.png  before and after side by side, in light and dark at 1300px and 390px. Demos show their final frame
//                                (reduced motion), so the two sides differ only where the change does.
//   posters.png                  with --motion: each scene's first frame (as it scrolls in) beside its resting frame.
//   snaps/                       with --motion: frame pairs where a scene changed a lot in a single frame with stillness either side.
// and prints a report (also saved as <out>/report.md): horizontal overflow, clipped text, all-caps text, console errors, phone stage
// shapes (with --square, any phone stage that isn't square is flagged), poster frames that are blank, and possible snaps.
// A stage is a `.cs-stage` (the scene player's frame) or any element marked `data-stage`.
//
// Start `pnpm dev` or `pnpm preview` first, or pass a PR preview link as --after. Keep the output out of the repository.
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, arg, i, all) => {
  if (arg.startsWith('--')) pairs.push([arg.slice(2), all[i + 1]?.startsWith('--') ? 'true' : all[i + 1] ?? 'true']);
  return pairs;
}, []));
if (!args.pages) {
  console.error('Usage: node scripts/review.mjs --pages /path,/other [--after url] [--before url] [--out dir] [--motion] [--square]');
  process.exit(1);
}
const pages = args.pages.split(',');
const after = (args.after ?? 'http://localhost:4321').replace(/\/$/, '');
const before = args.before === 'none' ? null : (args.before ?? 'https://itspatmorgan.com').replace(/\/$/, '');
const out = path.resolve(args.out ?? 'review');
const duration = Number(args.duration ?? 10000);
const scenes = args.scenes ? new Set(args.scenes.split(',').map(Number)) : null;
const widths = [1300, 390];
const themes = ['light', 'dark'];
// Findings, merged when the same one shows up in several themes or widths: "text clipped in …" → ["1300px light", "390px dark"].
const findings = new Map();
const note = (page, line, where = '') => {
  const key = `${page}: ${line}`;
  if (!findings.has(key)) findings.set(key, []);
  if (where) findings.get(key).push(where);
};

const browser = await chromium.launch();
try {
  for (const route of pages) {
    const dir = path.join(out, route.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home');
    await mkdir(dir, { recursive: true });
    for (const width of widths) {
      for (const theme of themes) {
        const shots = [];
        for (const base of [before, after]) {
          if (!base) { shots.push(null); continue; }
          const page = await open(base + route, { width, theme, reduced: true });
          if (!page) { shots.push(null); continue; }
          if (base === after) await audit(page, route, width, theme);
          shots.push((await page.screenshot({ fullPage: true })).toString('base64'));
          await page.close();
        }
        await sideBySide(shots, path.join(dir, `compare-${theme}-${width}.png`), width);
      }
    }
    if (args.motion) await motion(route, dir);
  }
} finally {
  await browser.close();
}

const lines = [...findings].map(([key, where]) => `- ${key}${where.length ? ` (${where.join(', ')})` : ''}`);
const text = `# Review\n\nAfter: ${after}\nBefore: ${before ?? 'none'}\n\n${lines.length ? lines.join('\n') : 'No findings.'}\n`;
await mkdir(out, { recursive: true });
await writeFile(path.join(out, 'report.md'), text);
console.log(text);

/** Opens a page in a theme and width, with motion reduced when asked; null when it doesn't load (a new page has no "before"). */
async function open(url, { width, theme, reduced }) {
  const page = await browser.newPage({ viewport: { width, height: width <= 640 ? 844 : 900 }, deviceScaleFactor: 1, colorScheme: theme, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  page.errors = [];
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) page.errors.push(m.text()); });
  page.on('pageerror', e => page.errors.push(e.message));
  // The site picks its theme from storage first, then the system; set both so the theme is certain.
  await page.addInitScript(t => { try { localStorage.setItem('theme', t); } catch {} }, theme);
  const response = await page.goto(url, { waitUntil: 'networkidle' }).catch(() => null);
  if (!response || response.status() >= 400) {
    note(url.replace(/(https?:\/\/[^/]+).*/, '$1'), `couldn't load ${url} (${response ? response.status() : 'no response'}); that side of the sheet is empty`);
    await page.close();
    return null;
  }
  // Scroll through once so every island hydrates and lazy images load, then return to the top.
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 600) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(60); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  return page;
}

/** The checks a reviewer would otherwise do by eye, on the "after" page. */
async function audit(page, route, width, theme) {
  const where = `${width}px ${theme}`;
  const found = await page.evaluate(() => {
    // Screen-reader-only text (a 1px box) is meant to be clipped, so it doesn't count.
    const visible = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 2 && r.height > 2 && s.visibility !== 'hidden' && s.opacity !== '0'; };
    const label = el => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''} "${(el.textContent ?? '').trim().slice(0, 40)}"`;
    const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
    const clipped = [], caps = [];
    for (const el of document.querySelectorAll('body *')) {
      if (!el.childNodes.length || !visible(el) || el.closest('[aria-hidden="true"], svg')) continue;
      const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
      if (!own) continue;
      const s = getComputedStyle(el);
      if ((s.overflowX !== 'visible' || s.textOverflow === 'ellipsis') && el.scrollWidth > el.clientWidth + 1) clipped.push(label(el));
      if (s.textTransform === 'uppercase' && /[a-z]/i.test(el.textContent)) caps.push(label(el));
    }
    const stages = [...document.querySelectorAll('.cs-stage, [data-stage]')].filter(visible).map(el => { const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), at: label(el.closest('section') ?? el) }; });
    return { overflow, clipped: clipped.slice(0, 8), caps: caps.slice(0, 8), stages };
  });
  if (found.overflow) note(route, 'the page scrolls sideways', where);
  for (const c of found.clipped) note(route, `text clipped in ${c}`, where);
  for (const c of found.caps) note(route, `all-caps text in ${c}`, where);
  for (const e of page.errors.slice(0, 5)) note(route, `console error "${e.slice(0, 120)}"`, where);
  if (width <= 640 && theme === 'light') {
    for (const s of found.stages) {
      const ratio = s.w / s.h;
      if (args.square && Math.abs(ratio - 1) > .02) note(route, `stage in ${s.at} is ${s.w}×${s.h}, not square`, '390px');
    }
  }
}

/** Poster frames and single-frame snaps for each scene on the page, at both widths, in light. */
async function motion(route, dir) {
  const posters = [];
  for (const width of widths) {
    const live = await open(after + route, { width, theme: 'light', reduced: false });
    const rest = await open(after + route, { width, theme: 'light', reduced: true });
    if (!live || !rest) continue;
    const count = await live.locator('.cs-stage, [data-stage]').count();
    for (let i = 0; i < count; i++) {
      if (scenes && !scenes.has(i + 1)) continue;
      const name = `${width}px scene ${i + 1}`;
      // Reload so the scene hasn't been seen yet; scrolling it into view starts it from its first frame. Screenshots clip the
      // viewport rather than the element, since a stage that is always moving never counts as "stable".
      await live.reload({ waitUntil: 'load' });
      const shoot = await framer(live, i);
      const first = await shoot();
      const frames = [first];
      const started = Date.now();
      while (Date.now() - started < duration) frames.push(await shoot());
      const still = await (await framer(rest, i))().catch(() => null);
      posters.push({ name, first: first.toString('base64'), rest: still?.toString('base64') ?? null });
      const diffs = await compare(frames.map(f => f.toString('base64')));
      if (diffs.blank[0]) note(route, `${name}: the first frame is nearly empty`);
      // A snap: a big change between two frames, with the stage still just before and just after.
      for (let f = 2; f < diffs.change.length - 1; f++) {
        if (diffs.change[f] > .04 && diffs.change[f - 1] < .004 && diffs.change[f + 1] < .004) {
          const snaps = path.join(dir, 'snaps');
          await mkdir(snaps, { recursive: true });
          const file = path.join(snaps, `${width}-scene${i + 1}-frame${f}.png`);
          await sideBySide([frames[f - 1].toString('base64'), frames[f].toString('base64')], file, width);
          note(route, `${name}: possible snap around frame ${f} (${Math.round(diffs.change[f] * 100)}% of the stage changed at once), see ${path.relative(out, file)}`);
        }
      }
    }
    await live.close(); await rest.close();
  }
  if (posters.length) await posterSheet(posters, path.join(dir, 'posters.png'));
}

/** Scrolls stage `i` to the middle of the viewport and returns a function that screenshots it. */
async function framer(page, i) {
  const box = await page.evaluate(i => {
    const el = document.querySelectorAll('.cs-stage, [data-stage]')[i];
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: Math.min(r.width, innerWidth), height: Math.min(r.height, innerHeight) };
  }, i);
  return () => page.screenshot({ clip: box, animations: 'allow' });
}

/** For a run of frames: the share of pixels that changed between each frame and the one before, and which frames are nearly blank. */
async function compare(frames) {
  const page = await browser.newPage();
  const result = await page.evaluate(async list => {
    const load = src => new Promise(done => { const img = new Image(); img.onload = () => done(img); img.src = `data:image/png;base64,${src}`; });
    const pixels = img => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, c.width, c.height).data; };
    const change = [0], blank = [];
    let previous = null;
    for (const src of list) {
      const data = pixels(await load(src));
      let varied = 0, moved = 0;
      for (let p = 0; p < data.length; p += 16) {
        if (Math.abs(data[p] - data[0]) + Math.abs(data[p + 1] - data[1]) + Math.abs(data[p + 2] - data[2]) > 24) varied++;
        if (previous && Math.abs(data[p] - previous[p]) + Math.abs(data[p + 1] - previous[p + 1]) + Math.abs(data[p + 2] - previous[p + 2]) > 24) moved++;
      }
      const total = data.length / 16;
      if (previous) change.push(moved / total);
      blank.push(varied / total < .01);
      previous = data;
    }
    return { change, blank };
  }, frames);
  await page.close();
  return result;
}

async function sideBySide([left, right], file, width) {
  const cell = (src, label) => `<figure style="margin:0;flex:1"><figcaption style="padding:0 0 8px">${label}</figcaption>${src ? `<img style="width:100%;display:block" src="data:image/png;base64,${src}">` : '<p>Not available</p>'}</figure>`;
  await render(`<div style="display:flex;gap:24px">${cell(left, 'Before')}${cell(right, 'After')}</div>`, file, width <= 640 ? 900 : 2000);
}

async function posterSheet(posters, file) {
  const img = src => (src ? `<img style="width:100%;display:block" src="data:image/png;base64,${src}">` : '<p>Not available</p>');
  await render(`<div style="display:grid;grid-template-columns:auto 1fr 1fr;gap:16px;align-items:start">
    <b></b><b>First frame</b><b>Resting frame</b>
    ${posters.map(p => `<span>${p.name}</span>${img(p.first)}${img(p.rest)}`).join('')}</div>`, file, 1800);
}

async function render(body, file, width) {
  const page = await browser.newPage({ viewport: { width, height: 600 } });
  await page.setContent(`<body style="margin:0;padding:24px;background:#222;color:#ddd;font:14px ui-monospace,monospace">${body}</body>`);
  await page.waitForLoadState('load');
  await page.screenshot({ path: file, fullPage: true });
  await page.close();
}
