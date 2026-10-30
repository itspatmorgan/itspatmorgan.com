import { ArrowDown01Icon, ArrowRight01Icon, CanvasIcon, CodeIcon, File01Icon, Folder01Icon } from '@hugeicons/core-free-icons';
import { SceneFrame, useScene, useStage } from '../case-study/scene';
import { icon } from './StudioUI';

// How engineering builds from a prototype, as Patrick tells it (2026-10-30): a prototype is just a folder, with its code, its canvas
// and any documents in it. Engineers learn the design from the canvas and its notes; to build it, they pull the repo, point their
// agent at the folder, and the agent translates it with skills the engineering team wrote. The folder is the real ADÉ Workflow
// prototype (archive: src/prototypes/patrick/ade-workflow), and the counts are its own (meta.json's 32 views; the canvas's 5 sections
// and 27 frames). Liberties: the tree is trimmed to fit and ordered for the story, the files an agent reads first and the screen folders after
// (ade-workflow's _lib, detection-rules, exclusions and messages folders are left out, and joe/ stands for the other contributors'
// folders); the muted notes beside rows are explanations, not part of an editor; the engineer's prompt and the agent's lines are illustrative, not a transcript.
// The open file is the canvas's own JSON (lines 291 to 308), with its \u escapes shown as the characters they stand for.
const timings = [3000, 2600, 4400];
const captions = [
  'A prototype is just a folder: its code, its canvas, its notes',
  'An engineer pulls the repo and points their agent at it',
  'Skills engineering wrote turn it into production code',
];

type Row = { name: string; depth: number; kind: 'folder' | 'open' | 'file' | 'canvas'; read?: boolean; note?: string };
const tree: Row[] = [
  { name: 'design-studio', depth: 0, kind: 'open' },
  { name: 'src/prototypes', depth: 1, kind: 'open' },
  { name: 'joe', depth: 2, kind: 'folder' },
  { name: 'patrick', depth: 2, kind: 'open' },
  { name: 'ade-workflow', depth: 3, kind: 'open', note: 'one prototype' },
  { name: 'meta.json', depth: 4, kind: 'file', read: true, note: 'title, owner, views' },
  { name: 'canvases', depth: 4, kind: 'open' },
  { name: 'ade-workflow.json', depth: 5, kind: 'canvas', read: true, note: 'the canvas' },
  { name: 'layout.jsx', depth: 4, kind: 'file', read: true, note: 'product shell' },
  { name: 'ade', depth: 4, kind: 'folder', note: 'screens' },
  { name: 'ade-module', depth: 4, kind: 'folder', note: 'screens' },
  { name: 'user-reports', depth: 4, kind: 'folder', note: 'screens' },
  { name: 'components', depth: 4, kind: 'folder', note: 'shared parts' },
  { name: 'agent-config', depth: 3, kind: 'folder' },
  { name: 'mttc', depth: 3, kind: 'folder' },
];
const json: [string, boolean?][] = [
  ['    {'],
  ['      "id": "manual-review",'],
  ['      "label": "4 · Needs Review",'],
  ['      "annotation": "ADÉ presents its generated rule, hunt evidence, reasoning, and analyst decisions.",', true],
  ['      "ref": {'],
  ['        "group": "ade",'],
  ['        "view": "ade-job-completed-review.jsx"'],
  ['      }'],
  ['    },'],
  ['    {'],
  ['      "id": "manual-accepted",'],
  ['      "label": "5 · Accepted",'],
  ['      "annotation": "The analyst accepted and activated the recommended detection rule.",', true],
  ['      "ref": {'],
  ['        "group": "ade",'],
  ['        "view": "ade-job-completed-accepted.jsx"'],
  ['      }'],
  ['    },'],
];
const reads = [
  ['meta.json', '32 views'],
  ['canvases/ade-workflow.json', '5 sections, 27 frames and their notes'],
  ['layout.jsx', 'the product shell'],
];

function Tree({ step }: { step: number }) {
  return <aside className="sc-tree" aria-hidden="true">
    <h5>Explorer</h5>
    <ul>{tree.map(row => {
      const inside = row.depth >= 4 || row.name === 'ade-workflow';
      const lit = step === 0 ? inside : step === 2 && !!row.read;
      const glyph = row.kind === 'open' ? ArrowDown01Icon : row.kind === 'folder' ? ArrowRight01Icon : null;
      const kind = row.kind === 'canvas' ? CanvasIcon : row.kind === 'file' ? (row.name.endsWith('.jsx') ? CodeIcon : File01Icon) : Folder01Icon;
      return <li key={row.name + row.depth} className={`${lit ? 'is-lit' : ''} ${row.name === 'ade-workflow' && step >= 1 ? 'is-on' : ''}`} style={{ paddingLeft: 10 + row.depth * 14 }}>
        <span className="sc-tree-chev">{glyph && icon(glyph, 12)}</span>
        {icon(kind, 14)}
        {row.name}
        {row.note && <span className="sc-tree-note">{row.note}</span>}
      </li>;
    })}</ul>
  </aside>;
}

function Code({ step }: { step: number }) {
  return <div className="sc-code" aria-hidden="true">
    <div className="sc-code-tab">{icon(CanvasIcon, 13)}canvases/ade-workflow.json</div>
    <ol>{json.map(([line, note], i) => <li key={i} className={note && step !== 1 ? 'is-lit' : ''}><code>{line}</code></li>)}</ol>
  </div>;
}

function Terminal({ step }: { step: number }) {
  const later = (ms: number) => ({ transitionDelay: step >= 2 ? `${ms}ms` : '0ms' });
  return <div className="sc-term" aria-hidden="true">
    <div className="sc-term-tabs"><span>Terminal</span></div>
    <div className="sc-term-body">
      <p><i>~/design-studio</i> git pull</p>
      <p className={step >= 1 ? '' : 'is-off'}><b>›</b> Build ADÉ Workflow in production from src/prototypes/patrick/ade-workflow</p>
      {reads.map(([file, note], i) => <p key={file} className={`sc-term-read ${step >= 2 ? '' : 'is-off'}`} style={later(300 + i * 600)}><b>●</b>Read {file}<span> · {note}</span></p>)}
      <p className={`sc-term-read ${step >= 2 ? '' : 'is-off'}`} style={later(2300)}><b className="is-accent">●</b>Porting with engineering’s skills</p>
    </div>
  </div>;
}

/** The ADÉ Workflow prototype as a folder in the Studio repo, and an engineer's agent reading it to build it in production. */
export default function Handoff() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000, height: 760 });
  const step = scene.step;
  return <SceneFrame scene={scene} stage={stage} title="the engineering handoff" focus={step >= 1 ? { x: 386, y: 330, w: 600, align: 'start', zoom: 1.76 } : null}
    label="The ADÉ Workflow prototype is a folder in the Design Studio repo, holding its code, its canvas and its metadata. An engineer pulls the repo and asks their agent to build ADÉ Workflow in production from that folder. The agent reads the prototype's metadata, its canvas of 27 frames and their notes, and its layout, then ports it with skills the engineering team wrote">
    <div className="sc-editor" style={{ height: stage.box.height }}>
      <Tree step={step} />
      <div className="sc-editor-main">
        <Code step={step} />
        <Terminal step={step} />
      </div>
    </div>
  </SceneFrame>;
}
