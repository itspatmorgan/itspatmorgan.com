import { ArrowDown01Icon, ArrowRight01Icon, CanvasIcon, CodeIcon, File01Icon, Folder01Icon, Note01Icon } from '@hugeicons/core-free-icons';
import { SceneFrame, useScene, useStage } from '../case-study/scene';
import { icon } from './StudioUI';

// How engineering builds from a prototype, as Patrick tells it (2026-10-30): a prototype is just a folder, with its code, its canvas
// and any documents in it. Engineers learn the design from the canvas and its notes; to build it, they pull the repo, point their
// agent at the folder, and the agent translates it with skills the engineering team wrote. The folder is the Phishing Training Beta
// prototype from the hero (archive: src/prototypes/patrick/phishing-training-beta), tidied into a demo folder at Patrick's ask
// (2026-10-30) so its shape reads at a glance. Liberties: the view groups are named lofi/ and hifi/ (really landing-page/ and
// private-beta-product/) and hold the three private-beta screens under short names; _components, archive, assets and the public-beta
// group are left out; joe/ and vendor-management/ stand for the other folders. The engineer's prompt and the agent's lines are
// illustrative, not a transcript. The open file is the canvas's own JSON (landing-page-flow.json, lines 84 to 101).
const timings = [3000, 2600, 4400];
const captions = [
  'A prototype is just a folder: its documents, its canvas, its screens',
  'An engineer pulls the repo and points their agent at it',
  'Skills engineering wrote turn it into production code',
];

type Row = { name: string; depth: number; kind: 'folder' | 'open' | 'file' | 'canvas' | 'doc'; read?: boolean };
const tree: Row[] = [
  { name: 'design-studio', depth: 0, kind: 'open' },
  { name: 'src/prototypes', depth: 1, kind: 'open' },
  { name: 'joe', depth: 2, kind: 'folder' },
  { name: 'patrick', depth: 2, kind: 'open' },
  { name: 'phishing-training-beta', depth: 3, kind: 'open' },
  { name: 'meta.json', depth: 4, kind: 'file', read: true },
  { name: 'documents', depth: 4, kind: 'open' },
  { name: 'design-handoff.mdx', depth: 5, kind: 'doc', read: true },
  { name: 'design-context.mdx', depth: 5, kind: 'doc' },
  { name: 'canvases', depth: 4, kind: 'open' },
  { name: 'landing-page-flow.json', depth: 5, kind: 'canvas', read: true },
  { name: 'lofi', depth: 4, kind: 'folder' },
  { name: 'hifi', depth: 4, kind: 'open', read: true },
  { name: 'notice.jsx', depth: 5, kind: 'file' },
  { name: 'learn.jsx', depth: 5, kind: 'file' },
  { name: 'done.jsx', depth: 5, kind: 'file' },
  { name: 'vendor-management', depth: 3, kind: 'folder' },
];
const json: [string, boolean?][] = [
  ['  "frames": ['],
  ['    {'],
  ['      "id": "landing-handoff",'],
  ['      "ref": {'],
  ['        "document": "design-handoff"'],
  ['      },'],
  ['      "label": "Handoff: start here",'],
  ['      "annotation": "What to build for the recipient training landing. Older explorations are on Archive - landing page.",', true],
  ['    },'],
  ['    {'],
  ['      "id": "landing-audit",'],
  ['      "ref": {'],
  ['        "document": "design-context"'],
  ['      },'],
  ['      "label": "Design context",'],
  ['      "annotation": "Why this shape: problem, Sam\'s source, direction, and open questions."', true],
  ['    },'],
  ['    {'],
];
const reads = [
  ['meta.json', 'Notice, Learn, Done'],
  ['documents/design-handoff.mdx', 'what to build'],
  ['canvases/landing-page-flow.json', 'the flow and its notes'],
];

function Tree({ step }: { step: number }) {
  return <aside className="sc-tree" aria-hidden="true">
    <h5>Explorer</h5>
    <ul>{tree.map(row => {
      const inside = row.depth >= 4 || row.name === 'phishing-training-beta';
      const lit = step === 0 ? inside : step === 2 && !!row.read;
      const glyph = row.kind === 'open' ? ArrowDown01Icon : row.kind === 'folder' ? ArrowRight01Icon : null;
      const kind = row.kind === 'canvas' ? CanvasIcon : row.kind === 'doc' ? Note01Icon : row.kind === 'file' ? (row.name.endsWith('.jsx') ? CodeIcon : File01Icon) : Folder01Icon;
      return <li key={row.name + row.depth} className={`${lit ? 'is-lit' : ''} ${row.name === 'phishing-training-beta' && step >= 1 ? 'is-on' : ''}`} style={{ paddingLeft: 10 + row.depth * 14 }}>
        <span className="sc-tree-chev">{glyph && icon(glyph, 12)}</span>
        {icon(kind, 14)}
        {row.name}
      </li>;
    })}</ul>
  </aside>;
}

function Code({ step }: { step: number }) {
  return <div className="sc-code" aria-hidden="true">
    <div className="sc-code-tab">{icon(CanvasIcon, 13)}canvases/landing-page-flow.json</div>
    <ol>{json.map(([line, note], i) => <li key={i} className={note && step !== 1 ? 'is-lit' : ''}><code>{line}</code></li>)}</ol>
  </div>;
}

function Terminal({ step }: { step: number }) {
  const later = (ms: number) => ({ transitionDelay: step >= 2 ? `${ms}ms` : '0ms' });
  return <div className="sc-term" aria-hidden="true">
    <div className="sc-term-tabs"><span>Terminal</span></div>
    <div className="sc-term-body">
      <p><i>~/design-studio</i> git pull</p>
      <p className={step >= 1 ? '' : 'is-off'}><b>›</b> Build src/prototypes/patrick/phishing-training-beta in production</p>
      {reads.map(([file, note], i) => <p key={file} className={`sc-term-read ${step >= 2 ? '' : 'is-off'}`} style={later(300 + i * 600)}><b>●</b>Read {file}<span> · {note}</span></p>)}
      <p className={`sc-term-read ${step >= 2 ? '' : 'is-off'}`} style={later(2300)}><b className="is-accent">●</b>Porting with engineering’s skills</p>
    </div>
  </div>;
}

/** The Phishing Training Beta prototype as a folder in the Studio repo, and an engineer's agent reading it to build it in production. */
export default function Handoff() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000, height: 760 });
  const step = scene.step;
  return <SceneFrame scene={scene} stage={stage} title="the engineering handoff" focus={step >= 1 ? { x: 346, y: 330, w: 640, align: 'start', zoom: 1.65 } : null}
    label="The Phishing Training Beta prototype is a folder in the Design Studio repo: meta.json, a documents folder with the design handoff and design context, a canvases folder with the flow, and lofi and hifi folders of screens. An engineer pulls the repo and asks their agent to build Phishing Training Beta from that folder. The agent reads the metadata, the handoff and the canvas with its notes, then ports it with skills the engineering team wrote">
    <div className="sc-editor" style={{ height: stage.box.height }}>
      <Tree step={step} />
      <div className="sc-editor-main">
        <Code step={step} />
        <Terminal step={step} />
      </div>
    </div>
  </SceneFrame>;
}
