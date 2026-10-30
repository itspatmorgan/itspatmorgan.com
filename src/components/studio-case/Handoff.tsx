import { HugeiconsIcon } from '@hugeicons/react';
import { CanvasIcon, CodeIcon, File01Icon, Note01Icon, Robot01Icon, SourceCodeIcon } from '@hugeicons/core-free-icons';
import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, useScene } from '../case-study/scene';

// How engineering builds from a prototype, as Patrick described it (2026-10-30): the team hands off the whole prototype, and an
// engineer's agent runs skills engineering wrote to port it to production-compliant code. What a prototype holds is the archive's
// (views, canvases, documents, and the handoff guide the write-design-handoff skill writes). No UI exists for the port, so it is a diagram.
const timings = [1100, 1300, 1300, 3600];
const captions = ['A prototype holds its views, flows and context', 'The team hands off the whole prototype', 'An engineer’s agent runs engineering’s porting skills', 'Production code that follows the product’s rules'];

const holds: [typeof CodeIcon, string][] = [[CodeIcon, 'Interactive views'], [CanvasIcon, 'Flows on a canvas'], [File01Icon, 'Design brief'], [Note01Icon, 'Handoff guide']];

/** Prototype, handed off whole, ported by engineering's agent skills into production code. */
export default function Handoff() {
  const scene = useScene(timings, captions, { loop: false });
  const step = scene.reduced ? timings.length - 1 : scene.step;
  return <DemoFrame scene={scene} caption={false} stage="sc-plain" title="the engineering handoff"
    label="A Design Studio prototype, with its interactive views, flows on a canvas, design brief and handoff guide, is handed off whole. An engineer's agent runs porting skills that engineering wrote, and the result is production-compliant code in the production repo">
    <div className="cs-demo">
      <NativeStage width={960} height={697}>
        <div className="sc-dia">
          <svg className="sc-line" viewBox="0 0 960 697" aria-hidden="true">
            <defs><marker id="sc-ho" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 1 9 5 0 9" fill="none" stroke="var(--sc-accent)" strokeWidth="1.6" /></marker></defs>
            <path className={`is-accent ${step >= 1 ? '' : 'is-off'}`} d="M346 348 L440 348" markerEnd="url(#sc-ho)" />
            <path className={`is-accent ${step >= 3 ? '' : 'is-off'}`} d="M680 348 L744 348" markerEnd="url(#sc-ho)" />
          </svg>
          <div className="sc-node is-accent" style={{ left: 40, top: 198, width: 300, height: 300, justifyContent: 'flex-start', paddingTop: 26 }}>
            <span className="sc-tag is-good" style={{ alignSelf: 'flex-start' }}>Design Studio</span>
            <h3 style={{ marginTop: 6 }}>The prototype</h3>
            <div style={{ display: 'grid', gap: 12, marginTop: 14 }}>{holds.map(([i, t]) => <span key={t} className="sc-file" style={{ fontFamily: 'inherit', fontSize: 17 }}><HugeiconsIcon icon={i} size={19} strokeWidth={1.6} />{t}</span>)}</div>
          </div>
          <span className={`sc-axis-label ${step >= 1 ? '' : 'is-off'}`} style={{ left: 346, top: 302, width: 100, textAlign: 'center', whiteSpace: 'normal', lineHeight: '19px', fontSize: 14 }}>Handed off whole</span>
          <div className={`sc-node ${step >= 2 ? '' : 'is-off'}`} style={{ left: 452, top: 238, width: 220, height: 220 }}>
            <HugeiconsIcon icon={Robot01Icon} size={26} strokeWidth={1.5} />
            <h3>An engineer’s agent</h3>
            <p>Runs the porting skills engineering wrote</p>
          </div>
          <div className={`sc-node ${step >= 3 ? '' : 'is-off'}`} style={{ left: 752, top: 238, width: 176, height: 220, padding: '18px 18px' }}>
            <HugeiconsIcon icon={SourceCodeIcon} size={26} strokeWidth={1.5} />
            <h3>The production repo</h3>
            <p>Code that follows the product’s rules</p>
          </div>
        </div>
      </NativeStage>
    </div>
  </DemoFrame>;
}
