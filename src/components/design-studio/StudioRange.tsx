import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, useScene } from '../case-study/scene';
import './studio-shapes.css';

// Where Design Studio sits, as one quiet chart instead of boxes and arrows: how freely you can explore across, how true the work is
// to your product up. A one-off prototype is flexible and untethered (bottom right), the production repo is true but slow (top left),
// and the top-right corner stays empty until Design Studio lands there, taking its flexibility from one and its truth from the other.
// The case study keeps its own Spectrum diagram; this one is for the landing page.
const timings = [2400, 2400, 4400];
const captions = [
  'Prototypes in AI tools are flexible, but connect to nothing',
  'The production repo is true to the product, but slow to explore in',
  'Design Studio takes flexibility from one and the product from the other',
];

const X0 = 120, X1 = 880, Y0 = 470, Y1 = 70;
const ONE = { x: 740, y: 390 }, PROD = { x: 260, y: 150 }, DS = { x: 740, y: 150 };

/** A two-axis chart: one-off prototypes, the production repo, and Design Studio in the corner neither reaches. */
export default function StudioRange() {
  const scene = useScene(timings, captions, { loop: false });
  const step = scene.step;
  const joined = step >= 2;
  const state = (i: number) => joined ? '' : step === i ? 'is-lit' : 'is-dim';
  return <DemoFrame scene={scene} caption={false} stage="sc-plain" title="where Design Studio sits"
    label="A chart with flexibility to explore across and truth to your product up. One-off prototypes in Claude, v0 or Figma Make are flexible but connect to nothing. The production repo is true to the product but slow to explore in. Design Studio sits in the corner neither reaches: as flexible as a one-off and as true as production">
    <div className="cs-demo">
      <NativeStage width={960} height={560}>
        <div className="sc-dia rg-dia">
          <svg className="sc-line" viewBox="0 0 960 560" aria-hidden="true">
            <path className="rg-axis" d={`M${X0} ${Y1} L${X0} ${Y0} L${X1} ${Y0}`} />
            <path className="rg-tick" d={`M${X0 - 6} ${Y1 + 8} L${X0} ${Y1} L${X0 + 6} ${Y1 + 8} M${X1 - 8} ${Y0 - 6} L${X1} ${Y0} L${X1 - 8} ${Y0 + 6}`} />
            <path className={`is-accent is-draw ${joined ? 'is-on' : ''}`} pathLength={1} d={`M${ONE.x} ${ONE.y - 12} L${DS.x} ${DS.y + 14}`} />
            <path className={`is-accent is-draw ${joined ? 'is-on' : ''}`} pathLength={1} d={`M${PROD.x + 12} ${PROD.y} L${DS.x - 14} ${DS.y}`} />
          </svg>
          <span className="sc-axis-label rg-y" style={{ left: X0 - 6, top: Y1 - 40 }}>True to your product</span>
          <span className="sc-axis-label rg-x" style={{ right: 960 - X1, top: Y0 + 16 }}>Flexibility to explore</span>

          <span className={`sc-dot ${joined ? 'is-lit' : state(0)}`} style={{ left: ONE.x, top: ONE.y }} />
          <div className={`rg-label is-end ${state(0)}`} style={{ right: 960 - ONE.x + 24, top: ONE.y - 22 }}>
            <b>One-off prototypes</b><span>Claude, v0, Figma Make</span>
          </div>

          <span className={`sc-dot ${joined ? 'is-lit' : state(1)}`} style={{ left: PROD.x, top: PROD.y }} />
          <div className={`rg-label ${state(1)}`} style={{ left: PROD.x - 16, top: PROD.y + 24 }}>
            <b>The production repo</b><span>Built to ship, not to explore</span>
          </div>

          <span className={`sc-dot ${joined ? 'is-accent is-big' : 'is-ghost'}`} style={{ left: DS.x, top: DS.y }} />
          <div className={`rg-label is-end is-accent ${joined ? '' : 'is-off'}`} style={{ right: 960 - DS.x + 26, top: DS.y - 62 }}>
            <b>Design Studio</b><span>As flexible as a one-off, as true as production</span>
          </div>
        </div>
      </NativeStage>
    </div>
  </DemoFrame>;
}
