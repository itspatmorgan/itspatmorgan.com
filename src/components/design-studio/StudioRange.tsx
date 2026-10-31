import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, useScene } from '../case-study/scene';
import './studio-shapes.css';

// Where Design Studio sits, as a quiet two-by-two instead of boxes and arrows: how freely you can explore across, how true the work is
// to your product up. A one-off prototype is flexible and untethered (bottom right), the production repo is true but slow (top left),
// and the top-right corner stays empty until Design Studio lands there, taking its flexibility from one and its truth from the other.
// The case study keeps its own Spectrum diagram; this one is for the landing page.
const timings = [2400, 2400, 4400];
const captions = [
  'Prototypes in AI tools are flexible, but connect to nothing',
  'The production repo is true to the product, but slow to explore in',
  'Design Studio takes flexibility from one and the product from the other',
];

const X0 = 120, X1 = 880, Y0 = 500, Y1 = 64;
const G = 12, CW = (X1 - X0 - 24 - G) / 2, CH = (Y0 - Y1 - 24 - G) / 2;
const cell = (col: number, row: number) => ({ left: X0 + 24 + col * (CW + G), top: Y1 + row * (CH + G), width: CW, height: CH });

/** A two-by-two: the production repo top left, one-off prototypes bottom right, and Design Studio in the corner neither reaches. */
export default function StudioRange() {
  const scene = useScene(timings, captions, { loop: false });
  const step = scene.step;
  const joined = step >= 2;
  const state = (i: number) => joined ? '' : step === i ? 'is-lit' : 'is-dim';
  return <DemoFrame scene={scene} caption={false} stage="sc-plain" title="where Design Studio sits"
    label="A two-by-two with flexibility to explore across and truth to your product up. One-off prototypes in Claude, v0 or Figma Make are flexible but connect to nothing. The production repo is true to the product but slow to explore in. Design Studio sits in the corner neither reaches: as flexible as a one-off and as true as production">
    <div className="cs-demo">
      <NativeStage width={960} height={560}>
        <div className="sc-dia rg-dia">
          <svg className="sc-line" viewBox="0 0 960 560" aria-hidden="true">
            <path className="rg-axis" d={`M${X0} ${Y1} L${X0} ${Y0} L${X1} ${Y0}`} />
            <path className="rg-tick" d={`M${X0 - 6} ${Y1 + 8} L${X0} ${Y1} L${X0 + 6} ${Y1 + 8} M${X1 - 8} ${Y0 - 6} L${X1} ${Y0} L${X1 - 8} ${Y0 + 6}`} />
          </svg>
          <span className="sc-axis-label" style={{ left: X0 - 6, top: Y1 - 40 }}>True to your product</span>
          <span className="sc-axis-label" style={{ right: 960 - X1, top: Y0 + 16 }}>Flexibility to explore</span>

          <div className={`rg-cell ${state(1)}`} style={cell(0, 0)}>
            <b>The production repo</b><span>True to the product, built to ship, slow to explore in</span>
          </div>
          <div className={`rg-cell rg-ds ${joined ? 'is-accent' : 'is-ghost'}`} style={cell(1, 0)}>
            <b>Design Studio</b><span className={joined ? '' : 'is-off'}>As flexible as a one-off, as true as production</span>
          </div>
          <div className="rg-cell is-ghost" style={cell(0, 1)} />
          <div className={`rg-cell ${state(0)}`} style={cell(1, 1)}>
            <b>One-off prototypes</b><span>Flexible to explore, quick to make, connected to nothing</span>
          </div>
        </div>
      </NativeStage>
    </div>
  </DemoFrame>;
}
