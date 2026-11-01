// Render a 1200x630 share card in the site's card layout (see agents/conventions/assets.md and the share-cards skill):
// paper background, a lockup top left, the page's headline and one line, the URL in Geist Mono, and a visual on the right.
//
//   node scripts/share-card.mjs --out work-sublime-agents --title "Headline" --line "One line" --path /work/sublime-agents \
//     [--logo /images/logos/square-sublime.svg --name "Sublime Security" --invert] \
//     [--visual /images/... | --capture http://localhost:4321/work/sublime-agents --selector ".cs-hero .cs-native"] [--bleed --width 900]
//
// Without --logo the lockup is the site mark and "Patrick Morgan". The company marks in /images/logos/square-*.svg are white, so
// pass --invert to show them dark on the paper, as the case study pages do. --visual is a file under public/; --capture screenshots an
// element of a running page (start `pnpm dev` or `pnpm preview` first). --bleed runs a product screen off the right and bottom
// edges at --width px wide (default 900), as case study cards do; otherwise the visual is centered in the right region. Writes public/images/share/<out>.jpg.
//
// --layout product is the launch card for a product's own page (only /design-studio today): the logo and --name as a centered
// wordmark, --title as the tagline under it, a dot field, and the --capture or --visual window rising from the bottom edge. It has no URL or line.
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, arg, i, all) => {
  if (arg.startsWith('--')) pairs.push([arg.slice(2), all[i + 1]?.startsWith('--') ? 'true' : all[i + 1] ?? 'true']);
  return pairs;
}, []));
if (!args.out || !args.title || !args.path) {
  console.error('Usage: node scripts/share-card.mjs --out <name> --title <headline> --line <line> --path </route> [--logo --name] [--visual | --capture --selector] [--bleed]');
  process.exit(1);
}

const root = process.cwd();
const dataUrl = async (file, type) => `data:${type};base64,${(await readFile(file)).toString('base64')}`;
const mime = (file) => ({ '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' })[path.extname(file)];
const publicFile = (url) => path.join(root, 'public', url);
const escape = (text = '') => text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const browser = await chromium.launch();
try {
  let visual = '';
  if (args.capture) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
    await page.goto(args.capture, { waitUntil: 'networkidle' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const target = page.locator(args.selector ?? 'main').first();
    // Islands below the fold hydrate when they scroll into view (client:visible), so bring the element in and let it settle.
    await target.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2500);
    // The product card draws the window's corners, ring and shadow itself, so capture the window square and bare.
    if (args.layout === 'product') await target.evaluate((el) => { el.style.borderRadius = '0'; el.style.boxShadow = 'none'; });
    const shot = await target.screenshot();
    visual = `data:image/png;base64,${shot.toString('base64')}`;
    await page.close();
  } else if (args.visual) {
    visual = await dataUrl(publicFile(args.visual), mime(args.visual));
  }

  const sans = await dataUrl(path.join(root, 'node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2'), 'font/woff2');
  const mono = await dataUrl(path.join(root, 'node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2'), 'font/woff2');
  const logo = await dataUrl(publicFile(args.logo ?? '/favicon.svg'), mime(args.logo ?? '/favicon.svg'));
  const bleed = args.bleed === 'true';
  const bleedWidth = Number(args.width ?? 900);
  const invert = args.invert === 'true';
  const product = args.layout === 'product';

  const productCard = `
    .dots { position: absolute; inset: 0; background-image: radial-gradient(oklch(0.17 0.01 60 / 0.16) 1.2px, transparent 1.6px); background-size: 16px 16px;
      background-position: 8px 8px; -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000, transparent 75%); }
    .head { position: absolute; top: 58px; left: 0; right: 0; text-align: center; }
    .wordmark { display: inline-flex; align-items: center; gap: 16px; font-size: 52px; font-weight: 600; letter-spacing: -0.03em; }
    .wordmark img { width: 52px; height: 52px; ${invert ? 'filter: invert(1);' : ''} }
    .tagline { margin-top: 14px; font-size: 26px; letter-spacing: -0.01em; color: oklch(0.50 0.01 60); }
    /* One hairline ring drawn over the screenshot's edge (so it stays crisp against both paper and UI), then a tight contact
       shadow and a long soft one, like the page's own Studio windows. */
    .window { position: absolute; left: 150px; top: 236px; width: 900px; height: 480px; overflow: hidden; border-radius: 14px; background: oklch(0.99 0.003 80);
      box-shadow: 0 1px 2px oklch(0.15 0.01 60 / 0.06), 0 10px 24px -8px oklch(0.15 0.01 60 / 0.10), 0 40px 80px -28px oklch(0.15 0.01 60 / 0.22); }
    .window::after { content: ''; position: absolute; inset: 0; border-radius: inherit; box-shadow: inset 0 0 0 1px oklch(0.15 0.01 60 / 0.11); pointer-events: none; }
    .window img { display: block; width: 100%; }`;

  const html = `<!doctype html><html><head><style>
    @font-face { font-family: Geist; src: url(${sans}); font-weight: 100 900; }
    @font-face { font-family: 'Geist Mono'; src: url(${mono}); font-weight: 100 900; }
    * { margin: 0; box-sizing: border-box; }
    body { width: 1200px; height: 630px; overflow: hidden; position: relative; background: oklch(0.98 0.004 80); color: oklch(0.15 0.01 60); font-family: Geist; }
    .lockup { position: absolute; left: 64px; top: 56px; display: flex; align-items: center; gap: 14px; font-size: 26px; }
    .lockup img { width: 34px; height: 34px; ${invert ? 'filter: invert(1);' : ''} }
    .copy { position: absolute; left: 64px; top: 160px; width: 470px; }
    h1 { font-size: 52px; font-weight: 500; line-height: 1.1; letter-spacing: -0.02em; text-wrap: balance; }
    p { margin-top: 26px; font-size: 24px; line-height: 1.35; color: oklch(0.50 0.01 60); text-wrap: pretty; }
    .url { position: absolute; left: 64px; bottom: 52px; font-family: 'Geist Mono'; font-size: 20px; color: oklch(0.35 0.01 60); }
    .region { position: absolute; left: 600px; top: 64px; right: 64px; bottom: 64px; display: grid; place-items: center; }
    .region img { max-width: 100%; max-height: 100%; }
    .bleed { position: absolute; left: 616px; top: 56px; right: 0; bottom: 0; border-radius: 16px 0 0 0; overflow: hidden; box-shadow: 0 0 0 1px oklch(0.90 0.008 80), 0 20px 50px oklch(0.15 0.01 60 / 0.10); }
    .bleed img { display: block; width: ${bleedWidth}px; max-width: none; }
    ${product ? productCard : ''}
  </style></head><body>${product ? `
    <div class="dots"></div>
    <div class="head"><div class="wordmark"><img src="${logo}" alt="">${escape(args.name ?? 'Patrick Morgan')}</div><div class="tagline">${escape(args.title)}</div></div>
    ${visual ? `<div class="window"><img src="${visual}" alt=""></div>` : ''}` : `
    <div class="lockup"><img src="${logo}" alt="">${escape(args.name ?? 'Patrick Morgan')}</div>
    <div class="copy"><h1>${escape(args.title)}</h1>${args.line ? `<p>${escape(args.line)}</p>` : ''}</div>
    <div class="url">itspatmorgan.com${escape(args.path === '/' ? '' : args.path)}</div>
    ${visual ? (bleed ? `<div class="bleed"><img src="${visual}" alt=""></div>` : `<div class="region"><img src="${visual}" alt=""></div>`) : ''}`}
  </body></html>`;

  const card = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await card.setContent(html, { waitUntil: 'load' });
  await card.evaluate(() => document.fonts.ready);
  const out = path.join(root, 'public/images/share', `${args.out}.jpg`);
  await card.screenshot({ path: out, type: 'jpeg', quality: 88 });
  console.log(`Wrote ${path.relative(root, out)}`);
} finally {
  await browser.close();
}
