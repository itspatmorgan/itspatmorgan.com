import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowDown01Icon, ArrowRight02Icon, Book01Icon, Cancel01Icon, CircleIcon, CodeIcon, Cursor01Icon, DiamondIcon, Eraser01Icon, HandIcon,
  Menu01Icon, MinusSignIcon, PencilIcon, Presentation01Icon, Search01Icon, Shapes01Icon, SquareIcon, SquareUnlock02Icon, TextIcon,
} from '@hugeicons/core-free-icons';
import { SceneFrame, useScene, useStage } from '../case-study/scene';
import { Frame, Rail, Thumb, icon } from './StudioUI';

// The hero: one project in the internal Studio, Patrick's Mailbox Takeover Signals (Drive: sublime-prototype-canvas.png). The section
// sidebar keeps the project's context (explorations and team reviews, as canvases) beside its code (views grouped by round and
// release); the canvas lays out each workflow from the project's live views, annotated. The canvas zooms in on the first workflow,
// then pans to the second, as a person would with the canvas's own zoom; its zoom readout follows.
// Copy, frame titles and notes are the canvas's own. Liberties: the frames are drawn as thumbnails (on the canvas they are the live
// React views at 35%, too small to read either way); the canvas's Excalidraw tools are matched with Hugeicons; Workflow 2's third
// branch (No incidents), below the fold in the source, is left out.
const timings = [2600, 3400, 3600];
const captions = [
  'A project keeps its explorations and reviews beside its code',
  'Its canvas lays out each workflow from the live screens',
  'Branches cover every path through the feature',
];

const views = [
  { x: 30, y: 84, s: .54, zoom: '35%' },
  { x: 8, y: 70, s: .96, zoom: '65%' },
  { x: 8, y: -196, s: .9, zoom: '60%' },
];

const W = 250;
const flow1 = [
  ['Round 5: At-risk mailboxes', 'The queue lists mailboxes with an unresolved incident: risk, findings, signals sent, and when it started. Click a row.'],
  ['Round 5: mailbox page', 'The mailbox page, under Admin › Mailboxes. The active incident leads, then details and history.'],
  ['Round 5 mailbox: resolving', 'Resolve asks what the team found, with a note. It records the outcome.'],
  ['Round 5 mailbox: just resolved', 'The incident moves to the top of Incidents. Nothing takes its place: no active incident, nothing to act on.'],
  ['Round 5 queue: Resolved', 'The Resolved tab is the team record: outcome, findings, signals, and time frame.'],
] as const;

function Arrow({ d }: { d: string }) {
  return <path d={d} markerEnd="url(#sc-head)" />;
}

function Board() {
  return <>
    <div className="sc-section" style={{ left: 0, top: 0, width: 1286, height: 218 }}>
      <p>Workflow 1: Respond to a possible takeover (Detect &amp; Respond → At-risk mailboxes)</p>
      {flow1.map(([title, note], i) => <Frame key={title} title={title} note={note} x={24 + i * W} y={26}><Thumb dialog={i === 2} dark={i === 1} rows={i === 3 ? 4 : 6} /></Frame>)}
    </div>
    <div className="sc-section" style={{ left: 0, top: 300, width: 1060, height: 486 }}>
      <p>Workflow 2: Check on a mailbox (Admin → Mailboxes)</p>
      <p style={{ position: 'absolute', left: 24, top: 222, fontSize: 11, color: 'var(--sc-ink)' }}>Start: every mailbox</p>
      <Frame title="Round 5: mailboxes list" note="Every mailbox. The Incidents column shows an active incident with its risk, past incidents, or none. Active incidents sort first." x={24} y={244}><Thumb rows={7} /></Frame>
      <p style={{ position: 'absolute', left: 290, top: 22, fontSize: 11, color: 'var(--sc-ink)' }}>Filter to Active incident</p>
      <Frame title="Round 5 mailboxes: filtered to active incidents" note="Filters › Incidents: Active incident. The same set as the At-risk mailboxes queue." x={290} y={44}><Thumb rows={5} /></Frame>
      <Frame title="Round 5: mailbox page" note="A mailbox with an active incident. The incident leads, with Resolve." x={556} y={44}><Thumb dark rows={5} /></Frame>
      <p style={{ position: 'absolute', left: 290, top: 270, fontSize: 11, color: 'var(--sc-ink)' }}>Filter to Past incidents only</p>
      <Frame title="Round 5 mailboxes: filtered to past incidents" note="Filters › Incidents: Past incidents only. Mailboxes to keep an eye on." x={290} y={292}><Thumb rows={5} /></Frame>
      <Frame title="Round 5 mailbox: no active incident" note="A mailbox with past incidents only: details, then its history." x={556} y={292}><Thumb rows={3} /></Frame>
      <Frame title="Round 5 mailbox: past incident open" note="Open a past incident to see its Analysis, Response, and Resolution." x={822} y={292}><Thumb rows={4} /></Frame>
    </div>
    <svg className="sc-arrow" width="1300" height="820" style={{ left: 0, top: 0 }} aria-hidden="true">
      <defs><marker id="sc-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1 9 5 0 9" fill="none" stroke="currentColor" strokeWidth="1.4" /></marker></defs>
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        {[0, 1, 2, 3].map(i => <Arrow key={i} d={`M${220 + i * W} ${96 + (i % 2 ? -10 : 10)} L${268 + i * W} ${96 + (i % 2 ? 10 : -10)}`} />)}
        <Arrow d="M220 620 L284 412" />
        <Arrow d="M220 632 L284 660" />
        <Arrow d="M486 412 L550 426" />
        <Arrow d="M486 660 L550 662" />
        <Arrow d="M752 662 L816 670" />
      </g>
    </svg>
  </>;
}

/** Mailbox Takeover Signals in the internal Studio: context and code in the sidebar, workflows on the canvas. */
export default function Workspace() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000, height: 760 });
  const step = scene.reduced ? 0 : scene.step;
  const v = views[step];
  const tool = [SquareUnlock02Icon, HandIcon, Cursor01Icon, SquareIcon, DiamondIcon, CircleIcon, ArrowRight02Icon, MinusSignIcon, PencilIcon, TextIcon, Eraser01Icon, Shapes01Icon];
  return <SceneFrame scene={scene} stage={stage} title="the project workspace" focus={{ x: 300, y: 40, w: 680, align: 'start', zoom: 1.3 }}
    label="A project in Sublime's Design Studio, Mailbox Takeover Signals: a sidebar lists its context (explorations and team reviews) and its code (views grouped by review round and release); a canvas lays out two workflows as annotated sequences of the product's screens">
    <div className="sc-app" style={{ height: stage.box.height }}>
      <Rail on="prototypes" />
      <aside className="sc-side" aria-hidden="true">
        <h4>Mailbox Takeover Signals</h4>
        <h5>Context</h5>
        <ul>
          {['Detail Explorations', 'List Explorations', 'Mailbox Experience (Round 5)', 'Team Review (Oct 29)'].map((t, i) => <li key={t} className={i === 2 ? 'is-on' : ''}>{icon(Presentation01Icon, 15)}{t}</li>)}
        </ul>
        <h5>Code <span style={{ display: 'flex', gap: 10, color: 'var(--sc-weak)' }}>{icon(Search01Icon, 14)}{icon(Cancel01Icon, 14)}</span></h5>
        <ul>
          <li className="is-group">{icon(ArrowDown01Icon, 13)}Team review (Oct 29)</li>
          {['Detail: resolved by me', 'Detail: resolved by a team…', 'Detail: ongoing', 'List: Resolved', 'List: Unresolved'].map(t => <li key={t} className="is-child">{icon(CodeIcon, 14)}{t}</li>)}
          <li className="is-group">{icon(ArrowDown01Icon, 13)}Mailboxes (production copy)</li>
          <li className="is-child">{icon(CodeIcon, 14)}Mailboxes</li>
          <li className="is-group">{icon(ArrowDown01Icon, 13)}Private beta</li>
          {['Mailbox', 'Settings', 'Flagged mailboxes'].map(t => <li key={t} className="is-child">{icon(CodeIcon, 14)}{t}</li>)}
          <li className="is-group">{icon(ArrowDown01Icon, 13)}Public beta</li>
          {['Settings', 'Mailbox'].map(t => <li key={t} className="is-child">{icon(CodeIcon, 14)}{t}</li>)}
        </ul>
      </aside>
      <div className="sc-main" aria-hidden="true">
        <div className="sc-canvas">
          <span style={{ position: 'absolute', zIndex: 2, left: 12, top: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, border: '1px solid var(--sc-line)', borderRadius: 8, background: 'var(--sc-bg)' }}>{icon(Menu01Icon, 16)}</span>
          <div className="sc-toolbar">{tool.map((t, i) => <span key={i} className={i === 2 ? 'is-on' : ''}><HugeiconsIcon icon={t} size={15} strokeWidth={1.6} /></span>)}</div>
          <span style={{ position: 'absolute', zIndex: 2, right: 12, top: 12, display: 'flex', alignItems: 'center', gap: 8, height: 34, padding: '0 12px', border: '1px solid var(--sc-line)', borderRadius: 8, background: 'var(--sc-bg)', fontSize: 13 }}>{icon(Book01Icon, 15)}Library</span>
          <div className="sc-board sc-scroll" style={{ transform: `translate(${v.x}px, ${v.y}px) scale(${v.s})` }}><Board /></div>
          <div className="sc-zoomctl"><span>−</span><span style={{ minWidth: 34, textAlign: 'center' }}>{v.zoom}</span><span>+</span></div>
        </div>
      </div>
    </div>
  </SceneFrame>;
}
