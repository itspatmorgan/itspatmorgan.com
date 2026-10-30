import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, useScene } from '../case-study/scene';

// The bet, as Patrick framed it in the Maven talk: one-off prototypes in an AI tool at one end, the production repo at the other,
// and Design Studio between them, taking speed from one and the product from the other. One drawing that moves from the problem
// (the two ends) to the bet (the middle). No product UI exists for this point, so it is a diagram, drawn in the site's quiet style.
const timings = [2400, 1600, 3600];
const captions = ['Two usual ways to prototype with AI', 'Design Studio sits between them', 'It takes speed from one end and the product from the other'];

/** One-off tools at one end, the production repo at the other, then Design Studio between them. */
export default function Spectrum() {
  const scene = useScene(timings, captions, { loop: false });
  const step = scene.step;
  const middle = step >= 1, links = step >= 2;
  const ends = middle ? 'is-dim' : '';
  return <DemoFrame scene={scene} caption={false} stage="sc-plain" title="where Design Studio sits"
    label="Two usual ways to prototype with AI: one-off prototypes in Claude, v0 or Figma Make, which connect to nothing; or the production repo, too heavy to explore in. Design Studio sits between them: fast to explore and true to the product, with the product's own components and rules in one repo the team shares, so work builds up">
    <div className="cs-demo">
      <NativeStage width={960} height={697}>
        <div className="sc-dia">
          <div className="sc-axis" style={{ left: 96, right: 96, top: 560 }} />
          <span className="sc-axis-label" style={{ left: 96, top: 580 }}>Fast, and gone after one use</span>
          <span className="sc-axis-label" style={{ right: 96, top: 580 }}>Durable, and heavy</span>

          <div className={`sc-node ${ends}`} style={{ left: 56, top: 330, width: 270, height: 170 }}>
            <h3>One-off prototypes</h3>
            <p>Claude, v0, Figma Make</p>
            <p className="sc-node-note">Connect to nothing, so nothing builds up</p>
          </div>
          <div className={`sc-node ${ends}`} style={{ right: 56, top: 330, width: 270, height: 170 }}>
            <h3>The production repo</h3>
            <p>Built to ship a large product</p>
            <p className="sc-node-note">Too heavy to explore many directions</p>
          </div>

          <svg className="sc-line" viewBox="0 0 960 697" aria-hidden="true">
            <path className={`is-accent is-dash ${links ? '' : 'is-off'}`} d="M191 328 C 191 230, 240 196, 316 196" />
            <path className={`is-accent is-dash ${links ? '' : 'is-off'}`} d="M769 328 C 769 230, 720 196, 644 196" />
            <path className={`is-accent ${middle ? '' : 'is-off'}`} d="M480 296 L480 546" />
          </svg>
          <div className={`sc-node is-accent ${middle ? '' : 'is-off'}`} style={{ left: 320, top: 96, width: 320, height: 200, transform: middle ? 'none' : 'translateY(12px)' }}>
            <h3>Design Studio</h3>
            <p>Fast to explore, true to the product</p>
            <p className={`sc-node-note ${links ? '' : 'is-off'}`}>The product’s own components and rules, in one repo the team shares, so work builds up</p>
          </div>
          <span className={middle ? '' : 'is-off'} style={{ position: 'absolute', left: 480, top: 551, width: 18, height: 18, marginLeft: -9, borderRadius: 999, background: 'var(--sc-accent)', boxShadow: '0 0 0 5px var(--sc-accent-soft)' }} />
        </div>
      </NativeStage>
    </div>
  </DemoFrame>;
}
