import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowDown01Icon, ArrowRight01Icon, CodeIcon, CursorInWindowIcon, File01Icon, FileEditIcon, Flowchart01Icon,  
  Link01Icon, Message01Icon, MoreHorizontalIcon, PaintBoardIcon, PlusSignIcon, Presentation01Icon, Search01Icon, Shapes01Icon,
} from '@hugeicons/core-free-icons';
import { Pointer, SceneFrame, Screens, useScene, useStage, useTargets } from '../case-study/scene';
import { OsRail, icon } from './StudioUI';

// The open-source Studio, rebuilt from scratch (itspatmorgan/design-studio). Its home (platform/app/pages/home) lists the latest
// prototypes and the systems; a prototype opens with its artifacts in the section nav: the app's views, their states, and the
// discovery work behind them (the Feedback Inbox sample, prototypes/parker/feedback-inbox). Any view turns lo-fi from the file
// tree's menu ("Make lo-fi"), which draws it in grayscale with handwritten type (modules/view/lofi.css).
// Copy, names and sample data are the product's (Drive: 02-home.png, 12-view-feedback-inbox.png). Liberties: the context menu shows
// three of its items; the inbox shows five of its eight rows.
const timings = [2200, 1300, 2800, 1500, 700, 3400];
const captions = [
  'The open-source Studio: prototypes and systems in one place',
  'The open-source Studio: prototypes and systems in one place',
  'A prototype keeps its screens, states and discovery side by side',
  'Any screen switches to lo-fi from its menu',
  'Any screen switches to lo-fi from its menu',
  'Any screen switches to lo-fi from its menu',
];

const rows = [
  ['Export to CSV is missing columns', 'Maya Chen', 'Email', 'High', 'New', 'Sep 28'],
  ['Dark mode makes the status badges hard to read', 'Luis Ortega', 'Chat', 'Medium', 'Triaged', 'Sep 27'],
  ['Let me bulk-assign items to a teammate', 'Priya Nair', 'Interview', 'High', 'Planned', 'Sep 25'],
  ['Search should look inside the description', 'Tom Becker', 'Survey', 'Medium', 'New', 'Sep 26'],
  ['Notification emails link to the wrong page', 'Aiko Tanaka', 'Email', 'Low', 'Resolved', 'Sep 20'],
] as const;

function Home({ hover }: { hover: boolean }) {
  const item = (i: typeof Shapes01Icon, name: string, who?: string, target?: string, on = false) => <div className={`sc-os-item ${on ? 'is-hover' : ''}`} data-target={target}>
    <span className="sc-os-icon">{icon(i, 15)}</span>{name}{who && <small>{who}</small>}
  </div>;
  return <div className="sc-main"><div className="sc-os-home">
    <h1>Design Studio</h1>
    <div className="sc-os-panel">
      <div className="sc-os-search">{icon(Search01Icon, 16)}Search the studio<kbd>⌘K</kbd></div>
      <div className="sc-os-group">
        <p>Latest prototypes {icon(ArrowRight01Icon, 12)}</p>
        {item(CursorInWindowIcon, 'Design Studio Marketing', 'Parker')}
        {item(CursorInWindowIcon, 'Feedback Inbox', 'Parker', 'inbox', hover)}
      </div>
      <div className="sc-os-group" style={{ paddingTop: 4 }}>
        <p>Systems {icon(ArrowRight01Icon, 12)}</p>
        {item(Shapes01Icon, 'Marketing')}
        {item(Shapes01Icon, 'Product')}
      </div>
    </div>
  </div></div>;
}

function Prototype({ lofi, menu, pick }: { lofi: boolean; menu: boolean; pick: boolean }) {
  const li = (i: typeof CodeIcon, t: string, cls = '', target?: string) => <li className={cls} data-target={target}>{icon(i, 14)}{t}</li>;
  return <>
    <aside className="sc-side" style={{ width: 226 }}>
      <h4 style={{ display: 'flex', justifyContent: 'space-between' }}>Feedback Inbox <span style={{ color: 'var(--os-weak)' }}>{icon(MoreHorizontalIcon, 15)}</span></h4>
      <p style={{ padding: '4px 8px 0', fontSize: 12.5, color: 'var(--os-weak)' }}>System · Product ↗</p>
      <h5>Artifacts</h5>
      <ul>
        {li(File01Icon, 'About This Prototype')}
        {li(Presentation01Icon, 'Eng Handoff')}
        <li className="is-group">{icon(ArrowDown01Icon, 13)}App</li>
        {li(CodeIcon, 'Overview', 'is-child')}
        {li(CodeIcon, 'Feedback Inbox', 'is-child is-on', 'view')}
        {li(CodeIcon, 'Feedback Detail', 'is-child')}
        <li className="is-group">{icon(ArrowDown01Icon, 13)}States</li>
        <li className="is-child is-group">{icon(ArrowDown01Icon, 13)}Inbox</li>
        {['Open Issues', 'Empty', 'No Matches', 'New Feedback'].map(t => <li key={t} className="is-child" style={{ paddingLeft: 44 }}>{icon(CodeIcon, 14)}{t}</li>)}
        <li className="is-group">{icon(ArrowDown01Icon, 13)}Discovery</li>
        {li(CodeIcon, 'Lo-fi Inbox', 'is-child')}
        {li(Presentation01Icon, 'Breadboard', 'is-child')}
        {li(Flowchart01Icon, 'Feedback Flow', 'is-child')}
        {li(File01Icon, 'Project Context', 'is-child')}
      </ul>
    </aside>
    <div className={`sc-menu ${menu ? '' : 'is-off'}`} style={{ left: 200, top: 222 }}>
      <div>{icon(FileEditIcon, 15)}Edit source</div>
      <div>{icon(Link01Icon, 15)}Copy link</div>
      <hr />
      <div className={pick ? 'is-hover' : ''} data-target="lofi">{icon(PaintBoardIcon, 15)}Make lo-fi</div>
    </div>
    <div className={`sc-echo ${lofi ? 'is-lofi' : ''}`}>
      <div className="sc-echo-top">
        <b><i>{icon(Message01Icon, 13)}</i>Echo</b><span>Overview</span><span className="is-on">Feedback inbox</span>
        <span style={{ marginLeft: 'auto' }}>Reset sample data</span><span className="sc-echo-pm" style={{ marginLeft: 0 }}>PM</span>
      </div>
      <div className="sc-echo-body">
        <div className="sc-echo-head">
          <h2>Feedback inbox</h2>
          <span className="sc-echo-btn">{icon(PlusSignIcon, 14)}New feedback</span>
        </div>
        <div className="sc-echo-tabs"><span className="is-on">All</span><span>New</span><span>Triaged</span><span>Planned</span><span>Resolved</span></div>
        <div className="sc-echo-table">
          <div className="sc-echo-row is-head"><span>Feedback</span><span>From</span><span>Priority</span><span>Status</span><span>Received</span></div>
          {rows.map(([title, who, via, priority, status, date]) => <div className="sc-echo-row" key={title}>
            <span>{title}</span><span>{who} <small>· {via}</small></span>
            <span className={`sc-badge is-${priority.toLowerCase()}`}>{priority}</span>
            <span className={`sc-badge is-${status.toLowerCase()}`}>{status}</span>
            <span>{date}</span>
          </div>)}
        </div>
      </div>
    </div>
  </>;
}

/** The open-source Studio: its home, the Feedback Inbox sample prototype, and a view made lo-fi. */
export default function OpenStudio() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000, height: 760 });
  const step = scene.reduced ? 5 : scene.step;
  const t = useTargets(step);
  const at = step === 1 ? t.at('inbox') : step === 3 ? t.at('view') : step === 4 ? t.at('lofi') : null;
  return <SceneFrame scene={scene} stage={stage} title="the open-source Studio" focus={step >= 3 ? { x: 0, y: 80, w: 760, align: 'start', zoom: 1.3 } : null}
    label="The open-source Design Studio: a home that lists the latest prototypes and the systems; the Feedback Inbox sample prototype, with its views, states and discovery work in a sidebar beside a working inbox; then the same inbox switched to lo-fi, in grayscale with handwritten type">
    <div ref={t.ref} style={{ position: 'relative', height: stage.box.height }} aria-hidden="true">
      <div className="sc-os">
        <OsRail on={step >= 2 ? 'prototypes' : 'home'} />
        <Screens id={step >= 2 ? 'proto' : 'home'}>
          <div style={{ position: 'relative', display: 'flex', height: stage.box.height, width: 952 }}>
            {step >= 2 ? <Prototype lofi={step >= 5} menu={step === 3 || step === 4} pick={step === 4} /> : <Home hover={step === 1} />}
          </div>
        </Screens>
      </div>
      <Pointer at={at} visible={!!at} pressing={step === 4} reduced={scene.reduced} />
    </div>
  </SceneFrame>;
}
