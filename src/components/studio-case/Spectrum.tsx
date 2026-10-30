import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, useScene } from '../case-study/scene';

// The two usual ways to prototype with AI, as Patrick framed them in the Maven talk: one-off prototypes in an AI tool at one end, the
// production repo at the other. The problem slide draws the two ends; the bet slide places Design Studio between them, taking
// something from each. No product UI exists for this point, so it is a diagram, drawn in the site's quiet style.
type Variant = 'problem' | 'bet';
const plans: Record<Variant, { timings: number[]; captions: string[] }> = {
  problem: {
    timings: [700, 1500, 3200],
    captions: ['Two usual ways to prototype with AI', 'One-off prototypes in an AI tool', 'Or prototypes in the production repo'],
  },
  bet: {
    timings: [900, 1500, 3400],
    captions: ['Between the two ends', 'Design Studio: a codebase the team owns', 'It takes speed from one end and the product from the other'],
  },
};

/** One-off tools at one end, the production repo at the other, and (on the bet slide) Design Studio between them. */
export default function Spectrum({ variant }: { variant: Variant }) {
  const { timings, captions } = plans[variant];
  const scene = useScene(timings, captions, { loop: false });
  const step = scene.reduced ? timings.length - 1 : scene.step;
  const bet = variant === 'bet';
  const left = bet || step >= 1, right = bet || step >= 2, middle = bet && step >= 1, links = bet && step >= 2;
  const ends = bet ? 'is-dim' : '';
  return <DemoFrame scene={scene} caption={false} stage="sc-plain" title={bet ? 'where Design Studio sits' : 'the two usual ways'}
    label={bet
      ? 'Design Studio sits between one-off AI prototypes and the production repo: it is a codebase the team owns, fast and separate enough for divergent design, and aware of the product’s components, tokens and principles'
      : 'Two usual ways to prototype with AI: one-off prototypes in Claude, v0 or Figma Make, which connect to nothing and start from scratch; or the production repo, built to ship a large product and slow for divergent design'}>
    <div className="cs-demo">
      <NativeStage width={960} height={697}>
        <div className="sc-dia" style={bet ? undefined : { transform: 'translateY(-100px)' }}>
          <div className="sc-axis" style={{ left: 96, right: 96, top: 520 }} />
          <span className="sc-axis-label" style={{ left: 96, top: 540 }}>Fast, and gone after one use</span>
          <span className="sc-axis-label" style={{ right: 96, top: 540 }}>Durable, and heavy</span>

          <div className={`sc-node ${left ? ends : 'is-off'}`} style={{ left: 56, top: 260, width: 270, height: 210 }}>
            <h3>One-off prototypes</h3>
            <p>Claude, v0, Figma Make</p>
            <div className="sc-tags"><span className="sc-tag">Not connected to anything</span><span className="sc-tag">Starts from scratch</span></div>
          </div>
          <div className={`sc-node ${right ? ends : 'is-off'}`} style={{ right: 56, top: 260, width: 270, height: 210 }}>
            <h3>The production repo</h3>
            <p>Built to ship a large product</p>
            <div className="sc-tags"><span className="sc-tag">Slow to change</span><span className="sc-tag">Hard to diverge</span></div>
          </div>

          {bet && <>
            <svg className="sc-line" viewBox="0 0 960 697" aria-hidden="true">
              <path className={`is-accent is-dash ${links ? '' : 'is-off'}`} d="M240 258 C 240 196, 300 190, 348 190" />
              <path className={`is-accent is-dash ${links ? '' : 'is-off'}`} d="M720 258 C 720 196, 660 190, 612 190" />
            </svg>
            <div className={`sc-node is-accent ${middle ? '' : 'is-off'}`} style={{ left: 350, top: 90, width: 260, height: 200, transform: middle ? 'none' : 'translateY(12px)' }}>
              <h3>Design Studio</h3>
              <p>A codebase the team owns</p>
              <div className="sc-tags"><span className="sc-tag is-good">Fast and separate</span><span className="sc-tag is-good">Knows the product</span></div>
            </div>
            <span className={`sc-axis-label ${links ? '' : 'is-off'}`} style={{ left: 56, top: 92, width: 240, whiteSpace: 'normal', lineHeight: '21px' }}>Room to move fast and try many directions</span>
            <span className={`sc-axis-label ${links ? '' : 'is-off'}`} style={{ right: 56, top: 92, width: 240, whiteSpace: 'normal', lineHeight: '21px', textAlign: 'right' }}>The product’s components, tokens and principles</span>
            <span className={`${middle ? '' : 'is-off'}`} style={{ position: 'absolute', left: 479, top: 512, width: 18, height: 18, marginLeft: -9, borderRadius: 999, background: 'var(--sc-accent)', boxShadow: '0 0 0 5px var(--sc-accent-soft)' }} />
            <svg className="sc-line" viewBox="0 0 960 697" aria-hidden="true"><path className={`is-accent ${middle ? '' : 'is-off'}`} d="M480 290 L480 504" /></svg>
          </>}
        </div>
      </NativeStage>
    </div>
  </DemoFrame>;
}
