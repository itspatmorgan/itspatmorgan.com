import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, useScene } from '../case-study/scene';

// The bet, as Patrick framed it in the Maven talk: one-off prototypes in an AI tool at one end, the production repo at the other,
// and Design Studio between them, taking speed from one and the product from the other. Design Studio is on the drawing from the
// start, grayed out, so the middle reads as a gap. Each end lights in turn, then Design Studio lights and the line connects all three.
// No product UI exists for this point, so it is a diagram, drawn in the site's quiet style.
const timings = [2600, 2600, 4200];
const captions = [
  'Prototypes in AI tools are fast, but connect to nothing',
  'The production repo is durable, but too heavy to explore in',
  'Design Studio takes speed from one and the product from the other',
];
const AXIS = 560, LEFT = 191, MID = 480, RIGHT = 769;

/** One-off tools at one end, the production repo at the other, and Design Studio grayed out between them until it connects both. */
export default function Spectrum() {
  const scene = useScene(timings, captions, { loop: false });
  const step = scene.step;
  const joined = step >= 2;
  const end = (i: number) => joined ? '' : step === i ? 'is-lit' : 'is-dim';
  const dot = (x: number, state: string) => <span className={`sc-dot ${state}`} style={{ left: x, top: AXIS + 1 }} />;
  return <DemoFrame scene={scene} caption={false} stage="sc-plain" title="where Design Studio sits"
    label="Two usual ways to prototype with AI: one-off prototypes in Claude, v0 or Figma Make, which connect to nothing; or the production repo, too heavy to explore in. Design Studio sits between them: fast to explore and true to the product, with the product's own components and rules in one repo the team shares, so work compounds">
    <div className="cs-demo">
      <NativeStage width={960} height={697}>
        <div className="sc-dia sc-spectrum">
          <div className="sc-axis" style={{ left: 96, right: 96, top: AXIS }} />
          <span className={`sc-axis-label ${end(0)}`} style={{ left: 96, top: 580 }}>Fast, and gone after one use</span>
          <span className={`sc-axis-label ${end(1)}`} style={{ right: 96, top: 580 }}>Durable, and heavy</span>

          <svg className="sc-line" viewBox="0 0 960 697" aria-hidden="true">
            <path className={joined ? 'is-accent' : end(0)} d={`M${LEFT} 500 L${LEFT} ${AXIS}`} />
            <path className={joined ? 'is-accent' : end(1)} d={`M${RIGHT} 500 L${RIGHT} ${AXIS}`} />
            <path className={`is-dash ${joined ? 'is-off' : 'is-dim'}`} d={`M${MID} 296 L${MID} ${AXIS}`} />
            <path className={`is-accent is-draw ${joined ? 'is-on' : ''}`} pathLength={1} d={`M${MID} 296 L${MID} ${AXIS}`} />
            <path className={`is-accent is-draw ${joined ? 'is-on' : ''}`} pathLength={1} d={`M${LEFT} ${AXIS + 1} L${MID} ${AXIS + 1}`} />
            <path className={`is-accent is-draw ${joined ? 'is-on' : ''}`} pathLength={1} d={`M${RIGHT} ${AXIS + 1} L${MID} ${AXIS + 1}`} />
            <path className={`is-accent is-dash ${joined ? '' : 'is-off'}`} d={`M${LEFT} 328 C ${LEFT} 230, 240 196, 316 196`} />
            <path className={`is-accent is-dash ${joined ? '' : 'is-off'}`} d={`M${RIGHT} 328 C ${RIGHT} 230, 720 196, 644 196`} />
          </svg>

          <div className={`sc-node ${end(0)}`} style={{ left: 56, top: 330, width: 270, height: 170 }}>
            <h3>One-off prototypes</h3>
            <p>Claude, v0, Figma Make</p>
            <p className="sc-node-note">Connect to nothing, so nothing compounds</p>
          </div>
          <div className={`sc-node ${end(1)}`} style={{ right: 56, top: 330, width: 270, height: 170 }}>
            <h3>The production repo</h3>
            <p>Built to ship a large product</p>
            <p className="sc-node-note">Too heavy to explore many directions</p>
          </div>
          <div className={`sc-node ${joined ? 'is-accent' : 'is-ghost'}`} style={{ left: 320, top: 96, width: 320, height: 200 }}>
            <h3>Design Studio</h3>
            <p>Fast to explore, true to the product</p>
            <p className={`sc-node-note ${joined ? '' : 'is-off'}`}>The product’s own components and rules, in one repo the team shares, so work compounds</p>
          </div>

          {dot(LEFT, joined ? 'is-accent' : end(0))}
          {dot(RIGHT, joined ? 'is-accent' : end(1))}
          {dot(MID, joined ? 'is-accent is-big' : 'is-ghost')}
        </div>
      </NativeStage>
    </div>
  </DemoFrame>;
}
