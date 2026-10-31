import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowDown01Icon, ArrowRight01Icon, CodeIcon, File01Icon, Flowchart01Icon, MoreHorizontalIcon, PaintBoardIcon, Presentation01Icon,
  Search01Icon, SourceCodeIcon, Tick02Icon, UnfoldMoreIcon,
} from '@hugeicons/core-free-icons';
import { OsRail, icon } from '../studio-case/StudioUI';
import { Canvas, Detail, Doc, Flow, Inbox, Overview } from './StudioShapes';
import { Editor } from './StudioDocs';
import StepBar from './StepBar';
import { H, W, themeStyle, useDark, useFit, useReduced } from './explore/StudioWindow';
import './studio-shapes.css';
import './explore/explore.css';
import './studio-hero.css';

// The landing page's browse section: the open-source Studio's prototype view with the Feedback Inbox sample, worked the way the Studio is
// worked. Artifacts open from the sidebar. A screen's menu makes it lo-fi or hi-fi (the file's `/** @lofi */` marker, FileTree's
// "Make lo-fi"). A document's menu opens its source. A short tour shows each move once, and hands over the moment the visitor touches the window.

type Screen = 'overview' | 'inbox' | 'detail' | 'lofi';
type View = Screen | 'handoff' | 'flow' | 'context';
type Menu = { kind: 'screen'; view: Screen } | { kind: 'doc' } | null;
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

const start = { view: 'inbox' as View, lofi: { overview: false, inbox: false, detail: false, lofi: true } as Record<Screen, boolean>, source: false };

// The tour's chapters, each with its caption and running time (the time is what its segment takes to fill: each pointer move is
// 820ms of travel and a 140ms press, plus the hold after it).
const MOVE = 960;
const chapters = [
  { label: 'Every artifact your agent makes is listed in the sidebar', ms: 1600 },
  { label: 'Make a screen lo-fi or hi-fi from its menu', ms: 4 * MOVE + 520 + 2300 + 520 + 1400 },
  { label: 'Open a flow or the handoff canvas beside the screens', ms: 2 * MOVE + 2200 + 2400 },
  { label: 'Open a document’s Markdown source to edit it yourself', ms: 4 * MOVE + 1300 + 520 + 2800 + 900 },
];
const yours = 'Your turn: click around';

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
  const [lofi, setLofi] = useState(start.lofi);
  const [source, setSource] = useState(start.source);
  const [menu, setMenu] = useState<Menu>(null);
  const [menuAt, setMenuAt] = useState({ left: 0, top: 0 });
  const [chapter, setChapter] = useState(0);
  const [touring, setTouring] = useState(false);
  const [done, setDone] = useState(false);
  // The visitor clicked in the window: the tour stops and the caption hands over.
  const [handed, setHanded] = useState(false);
  const [cut, setCut] = useState(0);
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

  // The tour: each step moves the pointer, presses, then does what the press does. It runs chapter by chapter from `from`; jumping
  // to a chapter (or resuming one) starts it from the Studio's opening state.
  const tour = useCallback(async (from = 0) => {
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
    const steps: (() => Promise<boolean>)[] = [
      async () => { await wait(chapters[0].ms); return alive(); },
      async () => await go('more-inbox', 'center', () => openMenu({ kind: 'screen', view: 'inbox' }, 'row-inbox'), 520)
        && await go('menu-lofi', 'start', () => toggleLofi('inbox'), 2300)
        && await go('more-inbox', 'center', () => openMenu({ kind: 'screen', view: 'inbox' }, 'row-inbox'), 520)
        && await go('menu-lofi', 'start', () => toggleLofi('inbox'), 1400),
      async () => await go('row-flow', 'end', () => open('flow'), 2200)
        && await go('row-handoff', 'end', () => open('handoff'), 2400),
      async () => await go('row-context', 'end', () => open('context'), 1300)
        && await go('more-context', 'center', () => openMenu({ kind: 'doc' }, 'row-context'), 520)
        && await go('menu-source', 'start', () => { setSource(true); setMenu(null); }, 2800)
        && await go('row-inbox', 'end', () => open('inbox'), 900),
    ];
    setView(start.view); setLofi(start.lofi); setSource(false); setMenu(null);
    setTouring(true); setDone(false); setHanded(false);
    for (let i = from; i < steps.length; i++) {
      setChapter(i); setCut(n => n + 1);
      if (!await steps[i]()) return;
    }
    setPointer(p => ({ ...p, shown: false }));
    setTouring(false); setDone(true);
  }, [place, openMenu]);

  useEffect(() => {
    if (reduced) { setDone(true); return; }
    const el = box.current;
    if (!el) return;
    // Starts once the window is mostly in view.
    const io = new IntersectionObserver(([e]) => { if (e.intersectionRatio > 0.35) { io.disconnect(); void tour(); } }, { threshold: [0, 0.35, 0.6] });
    io.observe(el);
    return () => { io.disconnect(); run.current++; };
  }, [reduced, tour, box]);

  const stop = () => { run.current++; setTouring(false); setPointer(p => ({ ...p, shown: false, pressing: false })); };
  // Any touch hands the window over: the tour stops where it is, and Play picks it up again.
  const takeOver = () => {
    if (!touring) return;
    stop(); setHanded(true);
  };
  const toggle = () => { if (touring) stop(); else void tour(done ? 0 : chapter); };
  const jump = (i: number) => { void tour(i); };

  // A menu sits under the row or header that owns it; any other click in the window closes it.
  const more = (hx: string, next: Menu, anchor: string) => <span className="hx-more" data-hx={hx} role="button" aria-label="More actions"
    onClick={e => { e.stopPropagation(); if (menu && JSON.stringify(menu) === JSON.stringify(next)) setMenu(null); else openMenu(next, anchor); }}>{icon(MoreHorizontalIcon, 15)}</span>;

  const pane = view === 'context'
    ? (source ? <Editor onDone={() => setSource(false)} /> : <Doc />)
    : view === 'flow' ? <Flow /> : view === 'handoff' ? <Canvas /> : <div className="ss-pane">
      <div className="ss-app">{screenOf(view)}</div>
      <div className={`ss-app is-lofi ss-lofi-layer ${lofi[view] ? 'is-shown' : ''}`}>{screenOf(view)}</div>
    </div>;

  return <div className="hx">
    <div ref={box} className="dx-window hx-window" style={{ height: H * s }} onPointerDownCapture={takeOver}>
      <div className="sc cs-native dx-native" style={{ width: W, height: H, transform: `translateX(${x}px) scale(${s})` }}>
        <div ref={os} className="sc-os ss-os dx-os hx-os" style={themeStyle('green', dark)} onClick={() => setMenu(null)}>
          <OsRail on="prototypes" />
          <aside className="sc-side ss-side">
            <h4><span className="hx-title">Feedback Inbox</span><span>{icon(MoreHorizontalIcon, 16)}</span></h4>
            <p className="ss-side-system">System · Product ↗</p>
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
          </MenuBox>}
          <svg className={`hx-pointer ${pointer.shown ? 'is-shown' : ''} ${pointer.pressing ? 'is-pressing' : ''}`} style={{ transform: `translate(${pointer.x}px, ${pointer.y}px)` }} width="22" height="26" viewBox="0 0 22 26" aria-hidden="true">
            <path d="M2 1.5v19.2l5.1-4.6 3.3 7.6 3.5-1.5-3.2-7.4 6.9-.4L2 1.5z" />
          </svg>
        </div>
      </div>
    </div>
    <StepBar title="the Studio tour" caption={done || handed ? yours : chapters[chapter].label} steps={chapters} current={chapter} done={done}
      playing={touring} cut={cut} reduced={reduced} onJump={jump} onToggle={toggle} />
  </div>;
}
