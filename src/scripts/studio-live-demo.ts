// Embed the deployed Studio; navigation and product behavior stay in Design Studio.
const base = '/design-studio-demo/';
const publicOrigin = 'https://itspatmorgan.com';

export function initStudioLiveDemo(root: HTMLElement) {
  const panel = root.querySelector<HTMLElement>('[data-demo-panel]')!;
  const status = root.querySelector<HTMLElement>('[data-demo-status]')!;
  const label = root.querySelector<HTMLElement>('[data-demo-status-label]')!;
  const open = root.querySelector<HTMLAnchorElement>('[data-demo-open]')!;
  const address = root.querySelector<HTMLElement>('[data-demo-address]')!;
  const frame = root.querySelector<HTMLIFrameElement>('[data-demo-studio]')!;
  root.querySelector<HTMLElement>('[data-studio-tab-bar]')!.hidden = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animation: Animation | undefined;
  let observer: MutationObserver | undefined;
  let revealDelay: ReturnType<typeof setTimeout>;
  let loading = false;
  let everReady = false;
  let watchdog: ReturnType<typeof setTimeout>;
  let href = '';
  let ready = false;
  let collapsed = false;
  const introducedProjects = new Set<string>();
  let syncingTheme = false;
  let removeClickListener: (() => void) | undefined;

  function showStatus(message: string, busy = false) {
    animation?.cancel();
    label.textContent = message;
    status.dataset.loading = String(busy);
    panel.setAttribute('aria-busy', String(busy));
    if (message) status.hidden = false;
    else if (!status.hidden && !reducedMotion.matches) {
      animation = status.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 100, easing: 'ease-out' });
      animation.onfinish = () => { status.hidden = true; };
    } else status.hidden = true;
  }
  function beginLoading() {
    if (loading) return;
    loading = true;
    ready = false;
    clearTimeout(revealDelay);
    clearTimeout(watchdog);
    panel.setAttribute('aria-busy', 'true');
    // Fast in-app routes finish before any overlay appears.
    if (everReady) revealDelay = setTimeout(() => showStatus('Loading Design Studio…', true), 120);
    else showStatus('Loading Design Studio…', true);
    watchdog = setTimeout(() => showStatus('Studio is taking longer than expected. Open the current page using the address bar.'), 20000);
  }
  function sync() {
    const doc = frame.contentDocument;
    const win = frame.contentWindow;
    if (!doc || !win) return;
    // SPA routes do not fire iframe load events. Observe DOM changes and check
    // location periodically to also cover history and hash-only navigation.
    let url: URL;
    try { url = new URL(win.location.href); } catch { return; }
    if (url.origin !== location.origin || !url.pathname.startsWith(base)) return;
    const next = url.pathname + url.search + url.hash;
    if (next !== href) {
      href = next;
      open.href = publicOrigin + next;
      address.textContent = 'itspatmorgan.com' + next;
      beginLoading();
    }
    const theme = doc.querySelector<HTMLButtonElement>('button[aria-label="Light mode"], button[aria-label="Dark mode"]');
    if (!theme) return;
    // Keep the application control available to this adapter, but remove it
    // from the embedded UI and keyboard navigation. The parent owns the theme.
    theme.style.setProperty('display', 'none', 'important');
    const dark = document.documentElement.classList.contains('dark');
    if (doc.documentElement.classList.contains('dark') !== dark) {
      if (!syncingTheme) { syncingTheme = true; theme.click(); }
      return;
    }
    syncingTheme = false;
    if (!collapsed) {
      const hide = doc.querySelector<HTMLButtonElement>('button[aria-label^="Hide navigation"]');
      if (hide) { hide.click(); return; }
      if (doc.querySelector('button[aria-label^="Show navigation"]')) collapsed = true;
    }
    // Introduce each prototype or system's navigation once, then respect the
    // visitor's choice to collapse it while exploring that project.
    const project = new RegExp(`^${base}(prototypes|systems)/([0-9a-z]{16})(?:/|$)`).exec(url.pathname);
    const projectKey = project && `${project[1]}/${project[2]}`;
    if (projectKey && !introducedProjects.has(projectKey)) {
      const show = doc.querySelector<HTMLButtonElement>('button[aria-label^="Show navigation"]');
      const hide = doc.querySelector<HTMLButtonElement>('button[aria-label^="Hide navigation"]');
      if (show) { introducedProjects.add(projectKey); show.click(); return; }
      if (hide) introducedProjects.add(projectKey);
    }
    if (ready) return;
    // The overlay covers the route only: Studio has hydrated (its theme control exists, checked above) and an artifact page has its
    // content in place. Previews, diagrams and canvases embedded in that content show their own loading states, so the overlay doesn't
    // wait for them; waiting kept it over a page that was already there.
    if (url.pathname.includes('/artifacts/') && !doc.querySelector('[data-artifact-identity], article .prose, [data-canvas-opening]')) return;
    // Reveal as soon as the route's content is ready.
    ready = true;
    everReady = true;
    loading = false;
    clearTimeout(revealDelay);
    frame.style.visibility = '';
    clearTimeout(watchdog);
    showStatus('');
  }
  function onLoad() {
    observer?.disconnect();
    removeClickListener?.();
    collapsed = false;
    syncingTheme = false;
    beginLoading();
    const doc = frame.contentDocument;
    if (!doc) return;
    const clicked = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element)?.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, frame.contentWindow!.location.href);
      if (url.origin === location.origin && url.pathname.startsWith(base) && url.href !== frame.contentWindow!.location.href) beginLoading();
    };
    doc.addEventListener('click', clicked);
    removeClickListener = () => doc.removeEventListener('click', clicked);
    observer = new MutationObserver(sync);
    observer.observe(doc.documentElement, { attributes: true, childList: true, subtree: true, attributeFilter: ['class', 'aria-label', 'data-preview-state', 'data-artifact-phase', 'data-canvas-opening', 'role'] });
    sync();
  }
  frame.addEventListener('load', onLoad);
  const themeObserver = new MutationObserver(sync);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  // Only inspect location here; content readiness is driven by DOM changes.
  const navigation = setInterval(() => {
    try {
      const current = frame.contentWindow?.location;
      if (current && current.pathname.startsWith(base) && current.pathname + current.search + current.hash !== href) sync();
    } catch { /* An external destination is outside the Studio adapter. */ }
  }, 200);
  beginLoading();
  frame.src = base;
  document.addEventListener('astro:before-swap', () => {
    clearTimeout(revealDelay); clearTimeout(watchdog); clearInterval(navigation);
    observer?.disconnect(); themeObserver.disconnect(); removeClickListener?.(); animation?.cancel();
  }, { once: true });
}
