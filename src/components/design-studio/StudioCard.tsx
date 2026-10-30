import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CanvasIcon, CodeIcon, File01Icon, Flowchart01Icon, Layers01Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { ProjectCardStage } from '../case-study/ProjectCardStage';
import { useDemoLoop } from '../case-study/useDemoLoop';
import './studio-card.css';

// The homepage's Design Studio visual: one idea, in every shape Studio can give it. In front, the five kinds of artifact its landing page
// names; behind, the artifact selected. It rests on the interactive prototype; hovering walks the list from the wireframe down and the
// panel becomes each artifact in turn, so the hover shows what the list only names.
// Drawn at 560 × 315 because the Open source card's visual column is wider than a Work card, which puts type at the Work cards' size.
// Phones, where that column is a Work card's width, get the same composition drawn at the Work cards' 400 × 225.
// Content is the Feedback Inbox sample project that ships with Design Studio (see the home-*.png captures). Liberties: the list's
// icons are Hugeicons standing in for Studio's own; the wireframe keeps Studio's grays and outlines but not its sketch typeface; the
// canvas shows the handoff canvas's screens as outlines; the inbox keeps three of its five filters and drops its description, and the
// diagram and document are trimmed to fit.
const icon = (i: typeof CodeIcon, size = 14) => <HugeiconsIcon icon={i} size={size} strokeWidth={1.6} />;

const rows = [
  ['Export to CSV is missing columns', 'New'],
  ['Let me bulk-assign items to a teammate', 'Planned'],
  ['Search should look inside the description', 'New'],
  ['I cannot tell which items are mine', 'Triaged'],
  ['Notification emails link to the wrong page', 'Resolved'],
  ['Import from a spreadsheet drops line breaks', 'Planned'],
] as const;

function Prototype({ lofi = false }: { lofi?: boolean }) {
  return <div className={`dc-view dc-inbox ${lofi ? 'is-lofi' : ''}`}>
    <div className="dc-head">
      <p className="dc-h">Feedback inbox</p>
      <span className="dc-btn">{icon(PlusSignIcon, 12)}New feedback</span>
    </div>
    <div className="dc-tabs"><span className="is-on">All</span><span>New</span><span>Planned</span></div>
    <div className="dc-table">
      <div className="dc-row dc-th"><span>Feedback</span><span>Status</span></div>
      {rows.map(([text, status]) => <div className="dc-row" key={text}><span className="dc-cell">{text}</span><span className={`dc-badge is-${status.toLowerCase()}`}>{status}</span></div>)}
    </div>
  </div>;
}

function Diagram() {
  return <div className="dc-view">
    <p className="dc-h">Feedback Flow</p>
    <svg viewBox="0 0 300 140" className="dc-flow" aria-hidden="true">
      <defs><marker id="dc-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 8 4 0 8z" fill="currentColor" /></marker></defs>
      <g className="dc-flow-lines"><path d="M76 86h14" /><path d="M166 74l18-30" /><path d="M166 98l18 22" /></g>
      <text className="dc-flow-note" x="150" y="40">Act now</text><text className="dc-flow-note" x="150" y="132">Later</text>
      <rect x="0" y="70" width="76" height="32" rx="2" /><text x="38" y="90">Record</text>
      <path d="M128 52l36 34-36 34-36-34z" /><text x="128" y="90">Review</text>
      <rect x="186" y="22" width="100" height="32" rx="2" /><text x="236" y="42">Address</text>
      <rect x="186" y="110" width="100" height="32" rx="2" /><text x="236" y="130">Keep for review</text>
    </svg>
  </div>;
}

function Canvas() {
  const screen = (title: string, lines: number) => <div className="dc-screen"><p>{title}</p>{Array.from({ length: lines }, (_, i) => <span key={i} style={{ width: `${88 - i * 13}%` }} />)}</div>;
  return <div className="dc-view dc-canvas">
    <p className="dc-h">Eng Handoff</p>
    <div className="dc-board">
      <div className="dc-step">{screen('Overview', 4)}<p className="dc-sticky">Land on the overview: open issues up top.</p></div>
      <span className="dc-link">click a number</span>
      <div className="dc-step">{screen('Open issues', 5)}<p className="dc-sticky">The inbox opens, already filtered.</p></div>
    </div>
  </div>;
}

function Doc() {
  return <div className="dc-view dc-doc">
    <p className="dc-doc-h">Project Context</p>
    <p className="dc-doc-p">The problem, working assumptions, and explorations behind the feedback tracker.</p>
    <p className="dc-doc-h2">The problem</p>
    <p className="dc-doc-p">Customer feedback is scattered across email, chat, interviews, surveys, and support tickets.</p>
    <p className="dc-doc-h2">Who it’s for</p>
    <p className="dc-doc-p"><b>Priya, product manager:</b> triage new items and track planned work.</p>
  </div>;
}

// Listed in the landing page's order. The hover walks them from the wireframe down, then comes back up to rest on the prototype.
const artifacts: { name: string; icon: typeof CodeIcon; view: ReactNode }[] = [
  { name: 'Interactive prototype', icon: CodeIcon, view: <Prototype /> },
  { name: 'Wireframe', icon: Layers01Icon, view: <Prototype lofi /> },
  { name: 'Diagram', icon: Flowchart01Icon, view: <Diagram /> },
  { name: 'Canvas', icon: CanvasIcon, view: <Canvas /> },
  { name: 'Document', icon: File01Icon, view: <Doc /> },
];
const order = [1, 2, 3, 4, 0];
const timings = [1400, 1400, 1400, 1400, 2200];

/** Phones draw the card at the Work cards' size. */
function useCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)');
    const sync = () => setCompact(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  return compact;
}

/** One idea in every shape: the artifact types in front, the one selected behind. */
export default function StudioCard() {
  const loop = useDemoLoop(timings, timings.length - 1, false, true);
  const compact = useCompact();
  const current = order[loop.reduced ? order.length - 1 : loop.step];
  return <ProjectCardStage loop={loop} width={compact ? 400 : 560} height={compact ? 225 : 315} className={`dc ${compact ? 'is-compact' : ''}`} label="Design Studio's artifact types, interactive prototype, wireframe, diagram, canvas and document, each shown in turn">
    {/* Every artifact stays mounted, stacked, so the outgoing one fades away before the next fades in, with nothing remounting. */}
    <div className="pc-bg dc-panel">{artifacts.map((a, n) => <div key={a.name} className={`dc-layer ${n === current ? 'is-on' : ''}`}>{a.view}</div>)}</div>
    <div className="pc-fg dc-list">
      <p className="pc-title">Artifacts</p>
      {/* One selection that glides from row to row, rather than one row's highlight fading out as the next fades in. */}
      <ul style={{ '--dc-at': current } as CSSProperties}>
        <span className="dc-select" aria-hidden="true" />
        {artifacts.map((a, n) => <li key={a.name} className={n === current ? 'is-on' : ''}>{icon(a.icon)}<span>{a.name}</span></li>)}
      </ul>
    </div>
  </ProjectCardStage>;
}
