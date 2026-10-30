import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, CodeIcon, File01Icon, Flowchart01Icon, Layers01Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { ProjectCardStage } from '../case-study/ProjectCardStage';
import { useDemoLoop } from '../case-study/useDemoLoop';
import './studio-card.css';

// The homepage's Design Studio visual, on the project card system. Drawn at 560 × 315 rather than 400 × 225 because the Open source
// card's visual column runs wider than a Work card, so type lands at the same apparent size as the cards above it.
// Names, rows, statuses and artifacts are the Feedback Inbox sample project that ships with Design Studio (home-*.png captures).
// Liberties: the inbox keeps two columns of five; sidebar icons are Hugeicons standing in for Studio's own; the lo-fi pass is shown
// as Studio's grayscale treatment without its sketch typeface.
const W = 560, H = 315;
const rows = [
  ['Export to CSV is missing columns', 'New'],
  ['Let me bulk-assign items to a teammate', 'Planned'],
  ['Search should look inside the description', 'New'],
  ['I cannot tell which items are mine', 'Triaged'],
  ['Notification emails link to the wrong page', 'Resolved'],
  ['Import from a spreadsheet drops line breaks', 'Planned'],
] as const;

const icon = (i: typeof CodeIcon) => <HugeiconsIcon icon={i} size={13} strokeWidth={1.6} />;

function Inbox({ lofi, className = '' }: { lofi: boolean; className?: string }) {
  return <div className={`dc-inbox ${lofi ? 'is-lofi' : ''} ${className}`}>
    <div className="dc-head">
      <div><p className="dc-h">Feedback inbox</p><p className="dc-sub">Everything customers have told us, newest first.</p></div>
      <span className="dc-btn">{icon(PlusSignIcon)}New feedback</span>
    </div>
    <div className="dc-tabs"><span className="is-on">All</span><span>New</span><span>Triaged</span><span>Planned</span><span>Resolved</span></div>
    <div className="dc-table">
      <div className="dc-row dc-th"><span>Feedback</span><span>Status</span></div>
      {rows.map(([text, status]) => <div className="dc-row" key={text}><span className="dc-cell">{text}</span><span className={`dc-badge is-${status.toLowerCase()}`}>{status}</span></div>)}
    </div>
  </div>;
}

/** Concept A: one prototype and everything around it. Behind, the Feedback Inbox prototype; in front, its artifact tree. The selection
 *  moves from the Lo-fi Inbox to the real one, and the prototype behind goes from grayscale to finished. */
export function StudioCardArtifacts() {
  const loop = useDemoLoop([900, 2200], 1, false, true);
  const done = loop.reduced || loop.step >= 1;
  const item = (name: string, i: typeof CodeIcon, on = false) => <li className={on ? 'is-on' : ''}>{icon(i)}{name}</li>;
  return <ProjectCardStage loop={loop} width={W} height={H} className="dc dc-a" label="Design Studio: the Feedback Inbox prototype beside its artifacts, from a lo-fi pass to the finished prototype">
    <div className="pc-bg dc-panel"><Inbox lofi={!done} /></div>
    <div className="pc-fg dc-tree">
      <p className="pc-title">Feedback Inbox</p>
      <p className="dc-meta">System · Product</p>
      <p className="dc-group">{icon(ArrowDown01Icon)}App</p>
      <ul>{item('Feedback Inbox', CodeIcon, done)}{item('Feedback Detail', CodeIcon)}</ul>
      <p className="dc-group">{icon(ArrowDown01Icon)}Discovery</p>
      <ul>{item('Lo-fi Inbox', CodeIcon, !done)}{item('Breadboard', Layers01Icon)}{item('Feedback Flow', Flowchart01Icon)}{item('Project Context', File01Icon)}</ul>
    </div>
  </ProjectCardStage>;
}

/** Concept B: sketch to product. Behind, the lo-fi inbox; in front, the finished table rising over its bottom edge. */
export function StudioCardFidelity() {
  const loop = useDemoLoop([700, 2200], 1, false, true);
  const done = loop.reduced || loop.step >= 1;
  return <ProjectCardStage loop={loop} width={W} height={H} className="dc dc-b" label="Design Studio: a lo-fi Feedback Inbox and the finished prototype in front of it">
    <div className="pc-bg dc-panel"><Inbox lofi /></div>
    <div className={`pc-fg dc-front ${done ? 'is-up' : ''}`}><Inbox lofi={false} className="is-rows" /></div>
  </ProjectCardStage>;
}
