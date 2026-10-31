import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowDown01Icon, ArrowRight01Icon, CodeIcon, Copy01Icon, File01Icon, Flowchart01Icon, MoreHorizontalIcon, PaintBoardIcon, Presentation01Icon,
  Search01Icon, SourceCodeIcon, Tick02Icon, UnfoldMoreIcon,
} from '@hugeicons/core-free-icons';
import { OsRail, icon } from '../studio-case/StudioUI';
import { Canvas, Detail, Doc, Flow, Inbox, Overview } from './StudioShapes';
import { Editor } from './StudioDocs';
import { H, W, themeStyle, useDark, useFit, useReduced } from './explore/StudioWindow';
import './studio-shapes.css';
import './explore/explore.css';
import './studio-hero.css';

// The landing page's hero: the open-source Studio's prototype view with the Feedback Inbox sample, worked the way the Studio is
// worked. Artifacts open from the sidebar. A screen's menu makes it lo-fi or hi-fi (the file's `/** @lofi */` marker, FileTree's
// "Make lo-fi"). The prototype's menu duplicates it with another system, as a rebuild request does (prototypes README, "Duplication
// and system rebuilds"); here the Marketing copy appears at once, styled with the Marketing system's tokens. A document's menu opens
// its source. A short tour shows each move once, and hands over the moment the visitor touches the window.

type Screen = 'overview' | 'inbox' | 'detail' | 'lofi';
type View = Screen | 'handoff' | 'flow' | 'context';
type System = 'product' | 'marketing';
type Menu = { kind: 'screen'; view: Screen } | { kind: 'doc' } | { kind: 'proto' } | null;
const screens: Screen[] = ['overview', 'inbox', 'detail', 'lofi'];
const isScreen = (v: View): v is Screen => (screens as string[]).includes(v);

type Row = { label: string; i: typeof CodeIcon; view?: View; child?: boolean } | { group: string; open: boolean };
const rows: Row[] = [
  { label: 'About This Prototype', i: File01Icon },
  { label: 'Eng Handoff', i: Presentation01Icon, view: 'handoff' },
  { group: 'App', open: true },
  { label: 'Overview', i: CodeIcon, view: 'overview', child: true },
  { label: 'Feedback Inbox', i: CodeIcon, view: 'inbox', child: true },
  { label: 'Feedback Detail', i: CodeIcon, view: 'detail', child: true },
  { group: 'States', open: false },
  { group: 'Discovery', open: true },
  { label: 'Lo-fi Inbox', i: CodeIcon, view: 'lofi', child: true },
  { label: 'Breadboard', i: Presentation01Icon, child: true },
  { label: 'Feedback Flow', i: Flowchart01Icon, view: 'flow', child: true },
  { label: 'Project Context', i: File01Icon, view: 'context', child: true },
];

const start = { view: 'inbox' as View, system: 'product' as System, lofi: { overview: false, inbox: false, detail: false, lofi: true } as Record<Screen, boolean>, source: false };

const captions = {
  open: 'Open any artifact from the sidebar',
  lofi: 'Make a screen lo-fi from its menu, and back again',
  system: 'Duplicate the prototype with another design system',
  shapes: 'Flows, canvases and documents sit beside the screens',
  source: 'Every document is Markdown your agent reads and writes',
  yours: 'Your turn: click around',
};

function screenOf(view: Screen) {
  return view === 'overview' ? <Overview /> : view === 'detail' ? <Detail /> : <Inbox />;
}

function MenuBox({ at, children }: { at: { left: number; top: number }; children: ReactNode }) {
  return <div className="hx-menu" style={{ left: at.left, top: at.top }} role="menu" onPointerDown={e => e.stopPropagation()}>{children}</div>;
}
function Item({ hx, i, children, on, checked }: { hx: string; i: typeof CodeIcon; children: ReactNode; on: () => void; checked?: boolean }) {
  return <button type="button" role="menuitem" className="hx-item" data-hx={hx} onClick={on}>{icon(i, 15)}<span>{children}</span>{checked && <em>{icon(Tick02Icon, 14)}</em>}</button>;
}

export default function StudioHero() {
  const { ref: box, s, x } = useFit(0.62, 1, 'start');
  const dark = useDark();
  const reduced = useReduced();
  const os = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>(start.view);
  const [system, setSystem] = useState<System>(start.system);
  const [lofi, setLofi] = useState(start.lofi);
  const [source, setSource] = useState(start.source);
  const [menu, setMenu] = useState<Menu>(null);
  const [menuAt, setMenuAt] = useState({ left: 0, top: 0 });
  const [caption, setCaption] = useState(captions.open);
  const [touring, setTouring] = useState(false);
  const [pointer, setPointer] = useState({ x: 700, y: 520, shown: false, pressing: false });
  const run = useRef(0);

  // Where something sits inside the window, in the window's own (unscaled) pixels.
  const place = useCallback((hx: string, aim: 'end' | 'start' | 'center' = 'center') => {
    const root = os.current, el = root?.querySelector<HTMLElement>(`[data-hx="${hx}"]`);
    if (!root || !el) return null;
    const r = el.getBoundingClientRect(), o = root.getBoundingClientRect(), k = o.width / W;
    const left = (r.left - o.left) / k, top = (r.top - o.top) / k, width = r.width / k, height = r.height / k;
    return { left, top, width, height, x: aim === 'end' ? left + width - 14 : aim === 'start' ? left + 28 : left + width / 2, y: top + height * 0.62 };
  }, []);

  const openMenu = useCallback((next: Menu, hx: string) => {
    const at = place(hx);
    if (!at) return;
    setMenuAt({ left: Math.min(at.left + at.width - 12, W - 236), top: at.top + at.height + 4 });
    setMenu(next);
  }, [place]);
  const open = (v: View) => { setView(v); setSource(false); setMenu(null); };
  const toggleLofi = (v: Screen) => { setLofi(l => ({ ...l, [v]: !l[v] })); setMenu(null); };
  const duplicate = (next: System) => { setSystem(next); setMenu(null); };

  // The tour: each step moves the pointer, presses, then does what the press does.
  const tour = useCallback(async () => {
    const id = ++run.current;
    const alive = () => run.current === id;
    const wait = (ms: number) => new Promise<void>(done => window.setTimeout(done, ms));
    const go = async (hx: string, aim: 'end' | 'start' | 'center', act: () => void, hold: number) => {
      const at = place(hx, aim);
      if (!alive() || !at) return false;
      setPointer(p => ({ ...p, x: at.x, y: at.y, shown: true }));
      await wait(820); if (!alive()) return false;
      setPointer(p => ({ ...p, pressing: true })); await wait(140); if (!alive()) return false;
      setPointer(p => ({ ...p, pressing: false })); act();
      await wait(hold); return alive();
    };
    setView(start.view); setSystem(start.system); setLofi(start.lofi); setSource(false); setMenu(null);
    setTouring(true); setCaption(captions.open);
    await wait(1600); if (!alive()) return;
    setCaption(captions.lofi);
    if (!await go('more-inbox', 'center', () => openMenu({ kind: 'screen', view: 'inbox' }, 'row-inbox'), 520)) return;
    if (!await go('menu-lofi', 'start', () => toggleLofi('inbox'), 2300)) return;
    if (!await go('more-inbox', 'center', () => openMenu({ kind: 'screen', view: 'inbox' }, 'row-inbox'), 520)) return;
    if (!await go('menu-lofi', 'start', () => toggleLofi('inbox'), 1400)) return;
    setCaption(captions.system);
    if (!await go('more-proto', 'center', () => openMenu({ kind: 'proto' }, 'proto-head'), 520)) return;
    if (!await go('menu-marketing', 'start', () => duplicate('marketing'), 2600)) return;
    setCaption(captions.shapes);
    if (!await go('row-flow', 'end', () => open('flow'), 2200)) return;
    if (!await go('row-handoff', 'end', () => open('handoff'), 2400)) return;
    setCaption(captions.source);
    if (!await go('row-context', 'end', () => open('context'), 1300)) return;
    if (!await go('more-context', 'center', () => openMenu({ kind: 'doc' }, 'row-context'), 520)) return;
    if (!await go('menu-source', 'start', () => { setSource(true); setMenu(null); }, 2800)) return;
    if (!await go('row-inbox', 'end', () => open('inbox'), 900)) return;
    setPointer(p => ({ ...p, shown: false }));
    setTouring(false); setCaption(captions.yours);
  }, [place, openMenu]);

  useEffect(() => {
    if (reduced) { setCaption(captions.yours); return; }
    const el = box.current;
    if (!el) return;
    // Starts once the window is mostly in view.
    const io = new IntersectionObserver(([e]) => { if (e.intersectionRatio > 0.35) { io.disconnect(); void tour(); } }, { threshold: [0, 0.35, 0.6] });
    io.observe(el);
    return () => { io.disconnect(); run.current++; };
  }, [reduced, tour, box]);

  // Any touch hands the window over: the tour stops where it is.
  const takeOver = () => {
    if (!touring) return;
    run.current++;
    setTouring(false); setPointer(p => ({ ...p, shown: false, pressing: false })); setCaption(captions.yours);
  };

  // A menu sits under the row or header that owns it; any other click in the window closes it.
  const more = (hx: string, next: Menu, anchor: string) => <span className="hx-more" data-hx={hx} role="button" aria-label="More actions"
    onClick={e => { e.stopPropagation(); if (menu && JSON.stringify(menu) === JSON.stringify(next)) setMenu(null); else openMenu(next, anchor); }}>{icon(MoreHorizontalIcon, 15)}</span>;

  const title = 'Feedback Inbox';
  const pane = view === 'context'
    ? (source ? <Editor onDone={() => setSource(false)} /> : <Doc />)
    : view === 'flow' ? <Flow /> : view === 'handoff' ? <Canvas /> : <div className="ss-pane">
      <div className="ss-app">{screenOf(view)}</div>
      <div className={`ss-app is-lofi ss-lofi-layer ${lofi[view] ? 'is-shown' : ''}`}>{screenOf(view)}</div>
    </div>;

  return <div className="hx">
    <div ref={box} className="dx-window hx-window" style={{ height: H * s }} onPointerDownCapture={takeOver}>
      <div className="sc cs-native dx-native" style={{ width: W, height: H, transform: `translateX(${x}px) scale(${s})` }}>
        <div ref={os} className="sc-os ss-os dx-os hx-os" style={themeStyle(system === 'marketing' ? 'marketing' : 'green', dark)} onClick={() => setMenu(null)}>
          <OsRail on="prototypes" />
          <aside className="sc-side ss-side">
            <h4 data-hx="proto-head"><span className="hx-title">{title}</span>{more('more-proto', { kind: 'proto' }, 'proto-head')}</h4>
            <p className="ss-side-system">System · {system === 'marketing' ? 'Marketing' : 'Product'} ↗</p>
            <h5>Artifacts <span>{icon(Search01Icon, 15)}{icon(UnfoldMoreIcon, 15)}</span></h5>
            <ul>
              {rows.map(r => 'group' in r
                ? <li key={r.group} className="is-group">{icon(r.open ? ArrowDown01Icon : ArrowRight01Icon, 14)}{r.group}</li>
                : <li key={r.label} data-hx={r.view ? `row-${r.view}` : undefined}
                  className={`${r.child ? 'is-child' : ''} ${r.view === view ? 'is-on' : ''} ${r.view ? 'is-pickable' : ''}`}
                  onClick={r.view ? e => { e.stopPropagation(); open(r.view!); } : undefined}
                  onContextMenu={r.view && (isScreen(r.view) || r.view === 'context') ? e => { e.preventDefault(); e.stopPropagation(); openMenu(r.view === 'context' ? { kind: 'doc' } : { kind: 'screen', view: r.view as Screen }, `row-${r.view}`); } : undefined}>
                  {icon(r.i, 15)}<span className="hx-label">{r.label}</span>
                  {r.view && isScreen(r.view) && lofi[r.view] && r.view !== 'lofi' && <em className="hx-tag">lo-fi</em>}
                  {r.view && (isScreen(r.view) || r.view === 'context') && more(`more-${r.view}`, r.view === 'context' ? { kind: 'doc' } : { kind: 'screen', view: r.view as Screen }, `row-${r.view}`)}
                </li>)}
            </ul>
          </aside>
          <div className="ss-panes"><div key={view === 'context' ? `context-${source}` : view} className="dx-pane">{pane}</div></div>
          {menu && <MenuBox at={menuAt}>
            {menu.kind === 'screen' && <Item hx="menu-lofi" i={PaintBoardIcon} on={() => toggleLofi(menu.view)}>{lofi[menu.view] ? 'Make hi-fi' : 'Make lo-fi'}</Item>}
            {menu.kind === 'doc' && <Item hx="menu-source" i={SourceCodeIcon} on={() => { open('context'); setSource(s => !s); }}>{source && view === 'context' ? 'View page' : 'Edit source'}</Item>}
            {menu.kind === 'proto' && <>
              <p className="hx-menu-head">Duplicate with a system</p>
              <Item hx="menu-product" i={Copy01Icon} on={() => duplicate('product')} checked={system === 'product'}>Product</Item>
              <Item hx="menu-marketing" i={Copy01Icon} on={() => duplicate('marketing')} checked={system === 'marketing'}>Marketing</Item>
            </>}
          </MenuBox>}
          <svg className={`hx-pointer ${pointer.shown ? 'is-shown' : ''} ${pointer.pressing ? 'is-pressing' : ''}`} style={{ transform: `translate(${pointer.x}px, ${pointer.y}px)` }} width="22" height="26" viewBox="0 0 22 26" aria-hidden="true">
            <path d="M2 1.5v19.2l5.1-4.6 3.3 7.6 3.5-1.5-3.2-7.4 6.9-.4L2 1.5z" />
          </svg>
        </div>
      </div>
    </div>
    <div className="hx-caption">
      <p aria-live="polite">{caption}</p>
      <button type="button" onClick={() => { if (touring) takeOver(); else void tour(); }}>{touring ? 'Skip tour' : 'Replay tour'}</button>
    </div>
  </div>;
}
