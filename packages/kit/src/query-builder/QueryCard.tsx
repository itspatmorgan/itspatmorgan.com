import type { ReactNode } from 'react';
import { ProjectCardStage } from '../case-study/ProjectCardStage';
import { useDemoLoop } from '../case-study/useDemoLoop';
import { EntityPill, SourceIcon } from './NativeUI';

// The project card: every control maps to a piece of the language. Behind, the query in the visual builder; in front, the same query as
// J1QL, over the builder's top edge and aligned with the controls. Each part of the code lights with the control it became, one pair at a
// time, all four light together, and it rests clean. Each highlight fades out just before the next fades in, so the light passes from
// pair to pair without a blink and two pairs are never lit at once. The query, controls and colors are the hero demo's
// (QueryBuilderDemo); the layout follows the card system in ProjectCardStage.
const timings = [600, 750, 750, 750, 750, 650, 2000];

/** One query, as code and as controls, matched part by part. */
export default function QueryCard() {
  const loop = useDemoLoop(timings, timings.length - 1, false, true);
  const step = loop.reduced ? 6 : loop.step;
  // Pair i lights on step i + 1, all four light on step 5, and the last step rests with none lit.
  const on = (i: number) => (step === i + 1 || step === 5 ? 'is-on' : '');
  const part = (i: number, children: ReactNode) => <span className={`qc-part ${on(i)}`}>{children}</span>;
  return <ProjectCardStage loop={loop} className="qc" label="The query FIND DataStore WITH tag.pltfm_env = production in the visual builder, with the same query as J1QL code in front, matched part by part">
    <div className="pc-bg qc-builder">
      <span className="q-keyword">FIND</span>
      <div className="qc-tree">
        <span className={`qc-control ${on(0)}`}><EntityPill name="DataStore" removable={false} /></span>
        <span className="q-keyword">WITH</span>
        <span className="qc-fields">
          <span className={`q-field qc-control ${on(1)}`}><span>pltfm_env</span><SourceIcon name="ArrowDropDown" size={18} /></span>
          <span className={`q-field qc-control ${on(2)}`}><span>=</span><SourceIcon name="ArrowDropDown" size={18} /></span>
          <span className={`q-field qc-control ${on(3)}`}><span>“production”</span></span>
        </span>
      </div>
    </div>
    <div className="pc-fg qc-code"><code>
      <span><span className="q-code-keyword">FIND</span> {part(0, 'DataStore')}</span>
      <span><span className="q-code-keyword">WITH</span> {part(1, 'tag.pltfm_env')} {part(2, <span className="q-code-arrow">=</span>)} {part(3, '“production”')}</span>
    </code></div>
  </ProjectCardStage>;
}
