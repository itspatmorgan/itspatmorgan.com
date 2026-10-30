import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight02Icon, Cursor01Icon, CodeIcon, File01Icon, HandIcon, PencilIcon, Presentation01Icon, SquareIcon, TextIcon,
} from '@hugeicons/core-free-icons';
import { SceneFrame, Screens, useScene, useStage } from '../case-study/scene';
import { Rail, icon } from './StudioUI';

// The hero: one project in the internal Studio, Patrick's Mailbox Takeover Signals (Drive: sublime-prototype-canvas.png), drawn for
// the idea rather than the file tree: a project keeps its brief, its flows and its working screens together. The scene moves from
// the brief to the canvas to one screen, and the sidebar follows.
// Liberties, all for clarity (Patrick, 2026-10-30: "make the structure a lot simpler to understand"):
// - The real sidebar groups ~20 items under Context and Code; here three groups (Brief, Canvas, Screens) hold eight.
// - The brief is condensed from the canvas's own frame notes; the real project keeps its context as canvases and reviews.
// - The canvas shows Workflow 1's first four frames with their notes shortened; "Round 5" prefixes and Workflow 2 are left out.
// - The At-risk mailboxes screen follows its frame note (risk, findings, signals sent, when it started); the rows are illustrative.
const timings = [3000, 3400, 3800];
const captions = [
  'A project starts from its brief',
  'Its canvas lays out the flow from live screens',
  'Every frame is a working screen',
];

const flow = [
  ['At-risk mailboxes', 'Every mailbox with an unresolved incident'],
  ['Mailbox page', 'The active incident leads'],
  ['Resolve', 'Records what the team found'],
  ['Resolved', 'The team’s record of outcomes'],
] as const;

const rows = [
  ['Dana Whitfield', 'High', 4, 3, '2h ago'],
  ['Marcus Bell', 'High', 3, 2, '5h ago'],
  ['Priya Raman', 'Medium', 2, 2, 'Yesterday'],
  ['Owen Castillo', 'Medium', 2, 1, 'Yesterday'],
  ['Lena Fischer', 'Low', 1, 1, '2 days ago'],
] as const;

function Side({ on }: { on: string }) {
  const item = (key: string, glyph: typeof CodeIcon, label = key) =>
    <li key={key} className={on === key ? 'is-on' : ''}>{icon(glyph, 15)}{label}</li>;
  return <aside className="sc-side sc-side-simple" aria-hidden="true">
    <h4>Mailbox Takeover Signals</h4>
    <h5>Brief</h5>
    <ul>{item('Project brief', File01Icon)}{item('Team review (Oct 29)', Presentation01Icon)}</ul>
    <h5>Canvas</h5>
    <ul>{item('Respond to a takeover', Presentation01Icon)}</ul>
    <h5>Screens</h5>
    <ul>{flow.map(([t]) => item(t, CodeIcon))}</ul>
  </aside>;
}

function Brief() {
  return <div className="sc-doc">
    <h1>Mailbox Takeover Signals</h1>
    <p className="sc-doc-sub">Project brief</p>
    <p>When a mailbox may be taken over, the team needs to see it, act on it, and keep a record of what it found.</p>
    <h3>The flow</h3>
    <ol>
      <li>At-risk mailboxes lists every mailbox with an unresolved incident.</li>
      <li>The mailbox page leads with the active incident.</li>
      <li>Resolve asks what the team found, and records it.</li>
      <li>The Resolved tab keeps the team’s record.</li>
    </ol>
    <h3>Reviews</h3>
    <p className="sc-doc-link">{icon(Presentation01Icon, 15)}Team review, Oct 29</p>
  </div>;
}

function Mini({ i }: { i: number }) {
  return <div className={`sc-mini ${i === 2 ? 'is-dim' : ''}`}>
    <span className="sc-mini-nav" />
    <span className="sc-mini-page">
      <i className="is-h" />
      {i === 1 ? <><i className="is-card" /><i /><i /></> : Array.from({ length: i === 3 ? 4 : 5 }, (_, r) => <span key={r} className="sc-mini-row"><i /><i className="is-pill" /><i /></span>)}
    </span>
    {i === 2 && <span className="sc-mini-dialog" />}
  </div>;
}

function Canvas() {
  const tools = [Cursor01Icon, HandIcon, SquareIcon, ArrowRight02Icon, PencilIcon, TextIcon];
  return <div className="sc-canvas">
    <div className="sc-toolbar">{tools.map((t, i) => <span key={i} className={i === 0 ? 'is-on' : ''}><HugeiconsIcon icon={t} size={15} strokeWidth={1.6} /></span>)}</div>
    <div className="sc-flow">
      <p>Respond to a possible takeover</p>
      <div className="sc-flow-row">
        {flow.map(([title, note], i) => <div key={title} className="sc-flow-step">
          <div className="sc-flow-frame"><b>{title}</b><Mini i={i} /></div>
          <span>{note}</span>
          {i < flow.length - 1 && <svg className="sc-flow-arrow" viewBox="0 0 22 10" aria-hidden="true"><path d="M1 5h18M15 1l4 4-4 4" /></svg>}
        </div>)}
      </div>
    </div>
  </div>;
}

function Queue() {
  return <div className="sc-queue">
    <span className="sc-queue-nav">{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</span>
    <div className="sc-queue-page">
      <h2>At-risk mailboxes</h2>
      <p>Mailboxes with an unresolved incident</p>
      <div className="sc-queue-tabs"><span className="is-on">Unresolved</span><span>Resolved</span></div>
      <table>
        <thead><tr><th>Mailbox</th><th>Risk</th><th>Findings</th><th>Signals sent</th><th>Started</th></tr></thead>
        <tbody>{rows.map(([name, risk, f, s, when]) => <tr key={name}>
          <td>{name}</td><td><span className={`sc-risk is-${risk.toLowerCase()}`}>{risk}</span></td><td>{f}</td><td>{s}</td><td>{when}</td>
        </tr>)}</tbody>
      </table>
    </div>
  </div>;
}

/** Mailbox Takeover Signals in the internal Studio: the brief, the flow on its canvas, then one of its working screens. */
export default function Workspace() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000, height: 760 });
  const step = scene.step;
  const on = ['Project brief', 'Respond to a takeover', 'At-risk mailboxes'][step];
  return <SceneFrame scene={scene} stage={stage} title="the project workspace"
    label="A project in Sublime's Design Studio, Mailbox Takeover Signals. Its sidebar groups the project's brief, its canvas and its screens. The brief describes the flow; the canvas lays out the flow's four screens with notes; each frame opens as a working screen, such as the At-risk mailboxes queue">
    <div className="sc-app" style={{ height: stage.box.height }}>
      <Rail on="prototypes" />
      <Side on={on} />
      <div className="sc-main" aria-hidden="true">
        <Screens id={String(step)}>
          <div style={{ position: 'relative', height: stage.box.height, overflow: 'hidden' }}>
            {step === 0 ? <Brief /> : step === 1 ? <Canvas /> : <Queue />}
          </div>
        </Screens>
      </div>
    </div>
  </SceneFrame>;
}
