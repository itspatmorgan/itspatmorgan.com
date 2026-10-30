import { ArrowDown01Icon, ArrowRight01Icon, CanvasIcon, CodeSquareIcon, Menu01Icon } from '@hugeicons/core-free-icons';
import type { ReactNode } from 'react';
import { SceneFrame, Screens, useScene, useStage } from '../case-study/scene';
import { Accepted, HuntEntry, JobHeading, Page, Recommendation, TimelineItem, Triggered, Worked, job } from '../sublime/SublimeUI';
import { Rail, icon } from './StudioUI';

// The hero: Patrick's ADÉ Workflow prototype in the internal Studio (archive: src/prototypes/patrick/ade-workflow), the project
// behind the Sublime agents case study. Its canvas (canvases/ade-workflow.json) lays out each flow from the prototype's live views;
// here, Flow 1's last three frames, with the section's own title, its description shortened, and each frame's own label and note under it, as the canvas shows them (studio/app/canvas/Frame.jsx). The frames
// are the real job pages, rebuilt for the Sublime case study (src/components/sublime) and scaled as the canvas scales its live
// views. Then Needs Review opens at full size, as clicking a frame does.
// Liberties: the sidebar shows the ADÉ group open and the other groups closed; view names follow meta.json's descriptions, shortened.
const timings = [4400, 4800];
const captions = [
  'A prototype’s canvas lays out each flow, with a note on every screen',
  'Each frame opens as the working view',
];

const SRC_W = 1000, SRC_H = 760, S = .25;
const views = ['Job in progress', 'Job completed: review', 'Job completed: accepted', 'Automation config', 'Jobs list'];

function Live({ children, scale }: { children: ReactNode; scale: number }) {
  return <div className="sc-live" style={{ width: SRC_W * scale, height: SRC_H * scale }}>
    <div className="sb sb-embed" style={{ width: SRC_W, height: SRC_H, transform: `scale(${scale})` }}>{children}</div>
  </div>;
}

const pad = { display: 'grid', gap: 36, padding: '36px 40px' };

function Working() {
  return <Page crumbs={['Agents', 'ADÉ', job.subject]} style={pad}>
    <JobHeading status="running" />
    <div className="sb-timeline">
      <TimelineItem icon="hunt" tone="running"><HuntEntry run={false} /></TimelineItem>
      <TimelineItem icon="play"><Triggered /></TimelineItem>
    </div>
  </Page>;
}

function Review() {
  return <Page crumbs={['Agents', 'ADÉ', job.subject]} style={pad}>
    <JobHeading />
    <div className="sb-timeline">
      <TimelineItem icon="shield" tone="active"><Recommendation actions /></TimelineItem>
      <TimelineItem icon="clipboard"><Worked /></TimelineItem>
    </div>
  </Page>;
}

function Done() {
  return <Page crumbs={['Agents', 'ADÉ', job.subject]} style={pad}>
    <JobHeading />
    <div className="sb-timeline">
      <TimelineItem open icon="check" tone="success"><Accepted by="Patrick Morgan" /></TimelineItem>
      <TimelineItem icon="shield"><Recommendation /></TimelineItem>
    </div>
  </Page>;
}

const frames: [string, string, () => ReactNode][] = [
  ['3 · ADÉ working', 'The job timeline uses the agent motion graphic while rule generation and validation run; then Needs Review appears in place.', Working],
  ['4 · Needs Review', 'ADÉ presents its generated rule, hunt evidence, reasoning, and analyst decisions.', Review],
  ['5 · Accepted', 'The analyst accepted and activated the recommended detection rule.', Done],
];

function Side({ open }: { open: boolean }) {
  return <aside className="sc-side" aria-hidden="true">
    <h4>ADÉ Workflow</h4>
    <h5>Context</h5>
    <ul><li className={open ? '' : 'is-on'}>{icon(CanvasIcon, 15)}ADÉ Workflow</li></ul>
    <h5>Code</h5>
    <ul>
      <li className="is-group">{icon(ArrowRight01Icon, 13)}User Reports</li>
      <li className="is-group">{icon(ArrowDown01Icon, 13)}ADÉ</li>
      {views.map(v => <li key={v} className={`is-child ${open && v === 'Job completed: review' ? 'is-on' : ''}`}>{icon(CodeSquareIcon, 14)}{v}</li>)}
      <li className="is-group">{icon(ArrowRight01Icon, 13)}ADÉ Module</li>
      <li className="is-group">{icon(ArrowRight01Icon, 13)}Message Baselines</li>
    </ul>
  </aside>;
}

function Canvas() {
  return <div className="sc-canvas">
    <span className="sc-canvas-menu">{icon(Menu01Icon, 16)}</span>
    <div className="sc-board">
      <div className="sc-flow-section">
        <h3>Flow 1 · Manual start, review, and acceptance</h3>
        <p>Trigger ADÉ → In Progress → View Report → watch the job complete → Accept/Reject</p>
        <div className="sc-flow-frames">
          {frames.map(([title, note, View], i) => <div key={title} className="sc-flow-cell">
            <div className="sc-flow-card">
              <Live scale={S}><View /></Live>
              <div className="sc-flow-caption"><b>{title}</b><p>{note}</p></div>
            </div>
            {i < frames.length - 1 && <svg className="sc-flow-arrow" viewBox="0 0 22 10" aria-hidden="true"><path d="M1 5h18M15 1l4 4-4 4" /></svg>}
          </div>)}
        </div>
      </div>
    </div>
    <div className="sc-zoomctl"><span>−</span><span style={{ minWidth: 34, textAlign: 'center' }}>25%</span><span>+</span></div>
  </div>;
}

/** ADÉ Workflow in the internal Studio: its canvas of live views, a closer look, then one view opened. */
export default function Workspace() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000, height: 760 });
  const step = scene.step;
  const open = step >= 1;
  const mainW = SRC_W - 48 - 236;
  return <SceneFrame scene={scene} stage={stage} title="the project workspace"
    label="Patrick's ADÉ Workflow prototype in Sublime's Design Studio. Its canvas lays out the manual flow as three of the prototype's live job pages: ADÉ working, the recommended rule needing review, and the rule accepted. The Needs Review frame then opens as the working view">
    <div className="sc-app" style={{ height: stage.box.height }}>
      <Rail on="prototypes" />
      <Side open={open} />
      <div className="sc-main" aria-hidden="true">
        <Screens id={open ? 'view' : 'canvas'}>
          <div style={{ position: 'relative', height: stage.box.height, overflow: 'hidden' }}>
            {open ? <Live scale={mainW / SRC_W}><Review /></Live> : <Canvas />}
          </div>
        </Screens>
      </div>
    </div>
  </SceneFrame>;
}
