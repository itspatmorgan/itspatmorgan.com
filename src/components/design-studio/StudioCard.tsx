import type { ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, CodeIcon, DashboardSquare01Icon, File01Icon, Flowchart01Icon, Layers01Icon, PaintBoardIcon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { ProjectCardStage } from '../case-study/ProjectCardStage';
import { useDemoLoop } from '../case-study/useDemoLoop';
import './studio-card.css';

// Explorations for the homepage's Design Studio visual, on the project card system. Drawn at 560 × 315 rather than 400 × 225 because the
// Open source card's visual column runs wider than a Work card, so type lands at the same apparent size as the cards above it.
// Content comes from the Feedback Inbox sample project that ships with Design Studio and the artifact types its landing page names.
// Liberties, for review: sidebar icons are Hugeicons standing in for Studio's own; the wireframe is Studio's grayscale treatment without
// its sketch typeface; the Empty and Error states and the regrouped names in the scaffold concept are illustrative, not the sample's.
const W = 560, H = 315;
type Icon = typeof CodeIcon;
const icon = (i: Icon, size = 13) => <HugeiconsIcon icon={i} size={size} strokeWidth={1.6} />;

const rows = [
  ['Export to CSV is missing columns', 'New'],
  ['Let me bulk-assign items to a teammate', 'Planned'],
  ['Search should look inside the description', 'New'],
  ['I cannot tell which items are mine', 'Triaged'],
  ['Notification emails link to the wrong page', 'Resolved'],
  ['Import from a spreadsheet drops line breaks', 'Planned'],
] as const;

/* ── Artifact views, shown in the panel behind ─────────────────────────────── */

type InboxState = 'ready' | 'empty' | 'error';
function Prototype({ lofi = false, state = 'ready' }: { lofi?: boolean; state?: InboxState }) {
  return <div className={`dc-view dc-inbox ${lofi ? 'is-lofi' : ''}`}>
    <div className="dc-head">
      <div><p className="dc-h">Feedback inbox</p><p className="dc-sub">Everything customers have told us, newest first.</p></div>
      <span className="dc-btn">{icon(PlusSignIcon, 12)}New feedback</span>
    </div>
    <div className="dc-tabs"><span className="is-on">All</span><span>New</span><span>Triaged</span><span>Planned</span><span>Resolved</span></div>
    {state === 'error' && <div className="dc-alert"><b>Couldn’t load feedback.</b> Check your connection. <u>Try again</u></div>}
    <div className="dc-table">
      <div className="dc-row dc-th"><span>Feedback</span><span>Status</span></div>
      {state === 'ready' && rows.map(([text, status]) => <div className="dc-row" key={text}><span className="dc-cell">{text}</span><span className={`dc-badge is-${status.toLowerCase()}`}>{status}</span></div>)}
      {state === 'empty' && <div className="dc-empty"><p className="dc-empty-h">No feedback yet</p><p>Add the first thing a customer told you.</p></div>}
      {state === 'error' && [0, 1, 2, 3].map((i) => <div className="dc-row is-ghost" key={i}><span className="dc-bar" style={{ width: `${70 - i * 9}%` }} /><span className="dc-bar is-short" /></div>)}
    </div>
  </div>;
}

function Diagram() {
  return <div className="dc-view dc-diagram">
    <p className="dc-h">Feedback flow</p>
    <svg viewBox="0 0 300 150" className="dc-flow" aria-hidden="true">
      <defs><marker id="dc-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 8 4 0 8z" fill="currentColor" /></marker></defs>
      <g className="dc-flow-lines" markerEnd="url(#dc-arrow)"><path d="M82 92h20" /><path d="M174 80l20-28" /><path d="M174 104l20 22" /></g>
      <rect x="0" y="76" width="82" height="32" rx="3" /><text x="41" y="96">Record</text>
      <path d="M138 60l36 32-36 32-36-32z" /><text x="138" y="96">Review</text>
      <rect x="196" y="28" width="96" height="32" rx="3" /><text x="244" y="48">Address</text>
      <rect x="196" y="116" width="96" height="32" rx="3" /><text x="244" y="136">Keep for later</text>
    </svg>
  </div>;
}

function Doc() {
  return <div className="dc-view dc-doc">
    <p className="dc-doc-h">Project Context</p>
    <p className="dc-doc-p">The problem, working assumptions, and explorations behind the feedback tracker.</p>
    <p className="dc-doc-h2">The problem</p>
    <p className="dc-doc-p">Customer feedback is scattered across email, chat, interviews, surveys, and support tickets. The team needs one place to capture it.</p>
    <p className="dc-doc-h2">Who it’s for</p>
    <p className="dc-doc-p"><b>Luis, support lead:</b> capture feedback quickly.</p>
  </div>;
}

function System() {
  return <div className="dc-view dc-system">
    <p className="dc-doc-h">Button</p>
    <p className="dc-doc-p">Starts an action. Keep one primary button per view.</p>
    <p className="dc-doc-h2">Variants</p>
    <div className="dc-swatch"><span className="dc-b is-primary">Primary</span><span className="dc-b is-secondary">Secondary</span><span className="dc-b is-outline">Outline</span><span className="dc-b">Ghost</span></div>
    <p className="dc-doc-h2">Sizes</p>
    <div className="dc-swatch"><span className="dc-b is-primary is-xs">Small</span><span className="dc-b is-primary">Default</span><span className="dc-b is-primary is-lg">Large</span></div>
  </div>;
}

/* ── Concepts ──────────────────────────────────────────────────────────────── */

/** One step per hover beat; the card rests on the last. */
function useSteps(count: number, beat = 1100) {
  const loop = useDemoLoop([...Array(count - 1).fill(beat), 2200], count - 1, false, true);
  return { loop, step: loop.reduced ? count - 1 : loop.step };
}

function Row({ i, label, on }: { i: Icon; label: string; on: boolean }) {
  return <li className={on ? 'is-on' : ''}>{icon(i)}<span>{label}</span></li>;
}

/** 1 · Shapes. In front, the five kinds of artifact Studio makes; behind, the one selected. Hover walks through them, and the panel
 *  becomes each one. Rests on the prototype. */
const types: [Icon, string, ReactNode][] = [
  [Layers01Icon, 'Wireframe', <Prototype lofi />],
  [Flowchart01Icon, 'Diagram', <Diagram />],
  [File01Icon, 'Document', <Doc />],
  [PaintBoardIcon, 'Design system', <System />],
  [CodeIcon, 'Prototype', <Prototype />],
];
export function StudioCardShapes() {
  const { loop, step } = useSteps(types.length);
  return <ProjectCardStage loop={loop} width={W} height={H} className="dc dc-side" label="Design Studio's artifact types: wireframe, diagram, document, design system and prototype">
    <div className="pc-bg dc-panel"><div className="dc-swap" key={step}>{types[step][2]}</div></div>
    <div className="pc-fg dc-tree">
      <p className="pc-title">One idea, every shape</p>
      <ul className="dc-types">{types.map(([i, label], n) => <Row key={label} i={i} label={label} on={n === step} />)}</ul>
    </div>
  </ProjectCardStage>;
}

/** 2 · Scaffold. The sidebar renamed to say what Studio sets up: the screens, the states every app needs, and the context around them.
 *  Hover steps through states (empty, error) and lands back on the screen; the panel shows each. */
const scaffold: { pick: string; view: ReactNode }[] = [
  { pick: 'Empty', view: <Prototype state="empty" /> },
  { pick: 'Error', view: <Prototype state="error" /> },
  { pick: 'Brief', view: <Doc /> },
  { pick: 'Inbox', view: <Prototype /> },
];
export function StudioCardScaffold() {
  const { loop, step } = useSteps(scaffold.length);
  const on = (label: string) => scaffold[step].pick === label;
  const group = (title: string, items: [Icon, string][]) => <>
    <p className="dc-group">{icon(ArrowDown01Icon, 12)}{title}</p>
    <ul>{items.map(([i, label]) => <Row key={label} i={i} label={label} on={on(label)} />)}</ul>
  </>;
  return <ProjectCardStage loop={loop} width={W} height={H} className="dc dc-side" label="A prototype scaffold: its screens, its states, and the context around it">
    <div className="pc-bg dc-panel"><div className="dc-swap" key={step}>{scaffold[step].view}</div></div>
    <div className="pc-fg dc-tree is-scaffold">
      {group('Screens', [[CodeIcon, 'Inbox'], [CodeIcon, 'Detail']])}
      {group('States', [[DashboardSquare01Icon, 'Empty'], [DashboardSquare01Icon, 'Error']])}
      {group('Context', [[File01Icon, 'Brief'], [Flowchart01Icon, 'User flow'], [PaintBoardIcon, 'Design system']])}
    </div>
  </ProjectCardStage>;
}

/** 3 · Context. The prototype stays put behind; in front, the context that lives with it, one tab per kind. Hover steps through the
 *  brief, the flow and the design system, then rests on the brief. */
const context: [string, ReactNode][] = [
  ['Flow', <Diagram />],
  ['System', <System />],
  ['Brief', <Doc />],
];
export function StudioCardContext() {
  const { loop, step } = useSteps(context.length, 1300);
  return <ProjectCardStage loop={loop} width={W} height={H} className="dc dc-ctx" label="A working prototype with its brief, flow and design system kept beside it">
    <div className="pc-bg dc-panel"><Prototype /></div>
    <div className="pc-fg dc-note">
      <p className="pc-title">Context{icon(ArrowDown01Icon, 12)}</p>
      <div className="dc-seg">{context.map(([label], n) => <span key={label} className={n === step ? 'is-on' : ''}>{label}</span>)}</div>
      <div className="dc-note-body"><div className="dc-swap" key={step}>{context[step][1]}</div></div>
    </div>
  </ProjectCardStage>;
}

/** 4 · Canvas. Behind, the prototype's states laid out side by side as on Studio's handoff canvas; in front, the screen you're in. */
const canvasStates: [string, InboxState][] = [['Ready', 'ready'], ['Empty', 'empty'], ['Error', 'error']];
export function StudioCardCanvas() {
  const { loop, step } = useSteps(canvasStates.length + 1, 1000);
  const pick = step % canvasStates.length;
  return <ProjectCardStage loop={loop} width={W} height={H} className="dc dc-canvas" label="A prototype's states laid out together on a canvas, with notes">
    <div className="pc-bg dc-panel">
      <div className="dc-board">
        {canvasStates.map(([label, state], n) => <div key={label} className={`dc-frame ${n === pick ? 'is-on' : ''}`}>
          <p className="dc-frame-label">{label}</p>
          <div className="dc-frame-shot"><Prototype state={state} /></div>
        </div>)}
        <p className="dc-sticky">States your engineer needs: what loads, what’s empty, what fails.</p>
      </div>
    </div>
    <div className="pc-fg dc-tree dc-zoom">
      <p className="pc-title">{icon(CodeIcon)}Inbox · {canvasStates[pick][0]}</p>
      <div className="dc-zoom-shot"><div className="dc-swap" key={pick}><Prototype state={canvasStates[pick][1]} /></div></div>
    </div>
  </ProjectCardStage>;
}
