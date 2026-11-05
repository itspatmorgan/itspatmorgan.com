// Writes studio/*.css: the kit's stylesheets scoped for Design Studio, where every selector sits under the Website system's
// theme class. The site imports src/ as written; Studio imports studio/. Run it after changing a kit stylesheet
// (`pnpm --filter @itspatmorgan/kit studio-css`); the site's tests fail while the two disagree.
// - every selector is placed under .website-theme
// - html.dark / .dark / :root.dark become .website-theme[data-color-mode="dark"]
// - :root, html and body become the theme boundary itself
// - keyframes gain the website-theme- prefix, and their uses are renamed
// - sibling selectors are wrapped in :is(), because Studio's scope check accepts only descendant and child combinators
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SHEETS = [
  'case-study/case-study.css',
  'case-study/project-card.css',
  'sublime/sublime.css',
  'query-builder/query-builder.css',
  'expansion/expansion.css',
];
const THEME = '.website-theme';
const DARK = `${THEME}[data-color-mode="dark"]`;

function scope(selector) {
  let s = selector.trim();
  const dark = /^(?::root|html)?\.dark(?=[\s.:[>+~]|$)|^:is\(html\.dark\)/;
  if (dark.test(s)) {
    s = s.replace(dark, '').trim();
    return s ? `${DARK} ${s}` : DARK;
  }
  const rootLike = /^(?::root|html|body)(?=[\s.:[>+~]|$)/;
  if (rootLike.test(s)) {
    s = s.replace(rootLike, '').trim();
    return s ? `${THEME} ${s}` : THEME;
  }
  return `${THEME} ${s}`;
}

function wrapSiblings(selector) {
  for (const head of [DARK, THEME]) {
    if (!selector.startsWith(head + ' ')) continue;
    let rest = selector.slice(head.length + 1);
    if (!/(^|[^\\(])\s*[+~]\s*(?![^(]*\))/.test(rest)) return selector;
    const pseudo = rest.match(/(::[\w-]+(\([^)]*\))?)$/);
    if (pseudo) rest = rest.slice(0, -pseudo[1].length);
    return `${head} :is(${rest})${pseudo ? pseudo[1] : ''}`;
  }
  return selector;
}

/** The Studio version of one kit stylesheet. */
export function studioCss(sheet) {
  const file = path.join(KIT, 'src', sheet);
  const root = postcss.parse(fs.readFileSync(file, 'utf8'), { from: file });
  const frames = new Map();
  root.walkAtRules(/keyframes$/i, rule => {
    frames.set(rule.params, `website-theme-${rule.params}`);
    rule.params = `website-theme-${rule.params}`;
  });
  root.walkRules(rule => {
    if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
    rule.selectors = rule.selectors.map(scope).map(wrapSiblings);
  });
  root.walkDecls(/^(animation|animation-name)$/, decl => {
    for (const [from, to] of frames) decl.value = decl.value.replace(new RegExp(`(^|[\\s,])${from}(?=$|[\\s,])`, 'g'), `$1${to}`);
  });
  // A url() names a file beside the stylesheet in the kit. Bare package paths don't resolve in Studio's CSS pipeline, and
  // site paths don't exist there, so both are refused; relative paths are rewritten for the copy in studio/.
  root.walkDecls(decl => {
    decl.value = decl.value.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (match, quote, url) => {
      if (url.startsWith('data:')) return match;
      if (!url.startsWith('./') && !url.startsWith('../')) throw new Error(`${sheet}: ${url} must be a file in the kit, referenced by a relative path`);
      const file = path.join(KIT, 'src', path.dirname(sheet), url);
      if (!fs.existsSync(file)) throw new Error(`${sheet}: ${url} does not exist`);
      return `url('${path.relative(path.join(KIT, 'studio'), file)}')`;
    });
  });
  return `/* Generated from src/${sheet} by scripts/studio-css.mjs. Edit the source, then run it again. */\n${root.toString()}`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const sheet of SHEETS) {
    const out = path.join(KIT, 'studio', path.basename(sheet));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, studioCss(sheet));
    console.log(`studio/${path.basename(sheet)}`);
  }
}
