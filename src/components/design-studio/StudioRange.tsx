import { DemoFrame, useScene } from '../case-study/scene';
import './studio-shapes.css';

// Where Design Studio sits, as one spectrum: flexible to explore at one end, true to your product at the other. One-off prototypes
// hold the flexible end, the production repo (the source of truth) holds the other, and gold guides draw in from both to Design
// Studio in the middle. Drawn in the site's own line work (a hairline with square handles) and its ink and gold.
const timings = [1000, 1000, 4600];
const captions = [
  'One-off prototypes are flexible, but connect to nothing',
  'The production repo is the source of truth, but slow to explore in',
  'Design Studio sits between them: flexible to explore, true to your product',
];

/** A spectrum from one-off prototypes to the production repo, with Design Studio between them. */
export default function StudioRange() {
  const scene = useScene(timings, captions, { loop: false });
  const step = scene.step;
  // The payoff is the poster: with reduced motion the spectrum shows its finished state, not the first beat.
  const joined = step >= 2 || scene.reduced;
  const state = (i: number) => joined ? '' : step === i ? 'is-lit' : 'is-dim';
  return <DemoFrame scene={scene} caption={false} stage="sp-stage" title="where Design Studio sits"
    label="A spectrum from flexible to explore to true to your product. One-off prototypes sit at the flexible end and connect to nothing. The production repo, the source of truth, sits at the other end and is slow to explore in. Design Studio sits between them, flexible to explore and true to your product">
    <div className="sp">
      <span className={`sp-end is-start ${state(0) === 'is-dim' ? 'is-dim' : ''}`}>Flexible to explore</span>
      <span className={`sp-end is-end ${state(1) === 'is-dim' ? 'is-dim' : ''}`}>True to your product</span>
      <div className="sp-line">
        <span className="sp-guide is-from-start" data-on={joined || undefined} />
        <span className="sp-guide is-from-end" data-on={joined || undefined} />
        <div className={`sp-point is-start ${state(0)}`}><i /><b>One-off prototypes</b></div>
        <div className={`sp-point is-main ${joined ? 'is-lit' : 'is-off'}`}><i /><b>Design Studio</b></div>
        <div className={`sp-point is-end ${state(1)}`}><i /><b>The production repo</b></div>
      </div>
    </div>
  </DemoFrame>;
}
