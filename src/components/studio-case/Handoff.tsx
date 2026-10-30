import { HugeiconsIcon } from '@hugeicons/react';
import { CanvasIcon, CodeIcon, File01Icon, Note01Icon } from '@hugeicons/core-free-icons';
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
            <defs><marker id="sc-ho" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 1 9 5 0 9" fill="none" stroke="var(--sc-ink-weak)" strokeWidth="1.6" /></marker></defs>
            <path className={step >= 1 ? '' : 'is-off'} d="M318 348 L362 348" markerEnd="url(#sc-ho)" />
            <path className={step >= 3 ? '' : 'is-off'} d="M618 348 L662 348" markerEnd="url(#sc-ho)" />
          </svg>
          <div className="sc-node sc-step" style={{ left: 50, top: 208, width: 260, height: 280 }}>
            <h3>The prototype</h3>
            <p>Handed off whole</p>
            <div className="sc-step-list">{holds.map(([i, t]) => <span key={t}><HugeiconsIcon icon={i} size={17} strokeWidth={1.6} />{t}</span>)}</div>
          </div>
          <div className={`sc-node sc-step ${step >= 2 ? '' : 'is-off'}`} style={{ left: 370, top: 268, width: 240, height: 160 }}>
            <h3>An engineer’s agent</h3>
            <p>Runs the porting skills engineering wrote for prototypes</p>
          </div>
          <div className={`sc-node sc-step ${step >= 3 ? '' : 'is-off'}`} style={{ left: 670, top: 268, width: 240, height: 160 }}>
            <h3>Production code</h3>
            <p>Code that follows the production repo’s rules</p>
          </div>
        </div>
      </NativeStage>
    </div>
  </DemoFrame>;
}
