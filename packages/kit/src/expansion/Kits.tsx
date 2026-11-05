import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, useScene } from '../case-study/scene';

// The deck's "Defense Kits" diagram: the same three pieces, regrouped for each use case. No ship status.
const kits = ['Bot Kit', 'API Security Kit', 'OWASP Attack Kit'];
const pieces = ['Signals', 'Rules & Alerts', 'Dashboards'];
const timings = [700, 1300, 1300, 1300, 3600];
const captions = ['A Bot Kit from Signals, rules and dashboards', 'A Bot Kit from Signals, rules and dashboards', 'An API Security Kit from the same pieces', 'An OWASP Attack Kit from the same pieces', 'An OWASP Attack Kit from the same pieces'];

/** One pattern, many kits. */
export default function Kits() {
  const scene = useScene(timings, captions, { loop: false });
  const built = scene.step;
  return <DemoFrame scene={scene} caption={false} stage="xp-frame" title="the kits" label="Bot, API Security, and OWASP Attack kits, each made of Signals, Rules and Alerts, and Dashboards"><div className="cs-demo xp-kits">
    <NativeStage width={960} height={697}>
      <div className="xp-kits">{kits.map((kit, k) => <div key={kit} className={`xp-fade ${k < built ? '' : 'xp-dim'}`}>
        <span className="xp-kitname">{kit}</span>
        <div className="xp-kitrow">{pieces.map((piece, i) => <span key={piece} style={{ display: 'contents' }}>{i > 0 && <b aria-hidden="true">+</b>}<span>{piece}</span></span>)}</div>
      </div>)}</div>
    </NativeStage>
  </div></DemoFrame>;
}
