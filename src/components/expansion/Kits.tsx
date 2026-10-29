import { NativeStage } from '../case-study/NativeStage';
import { useDemoLoop } from '../case-study/useDemoLoop';

// The deck's "Defense Kits" diagram: the same three pieces, regrouped for each use case. No ship status.
const kits = ['Bot Kit', 'API Security Kit', 'OWASP Attack Kit'];
const pieces = ['Signals', 'Rules & Alerts', 'Dashboards'];
const timings = [700, 1300, 1300, 1300, 3600];

/** One pattern, many kits. */
export default function Kits() {
  const loop = useDemoLoop(timings, 0, true, true);
  const built = loop.step;
  return <figure className={`qb-demo xp-kits ${loop.resetting ? 'qb-loop-reset' : ''}`} ref={loop.ref} aria-label="Bot, API Security, and OWASP Attack kits, each made of Signals, Rules and Alerts, and Dashboards">
    <NativeStage width={960} height={697}>
      <div className="xp-kits">{kits.map((kit, k) => <div key={kit} className={`xp-fade ${k < built ? '' : 'xp-dim'}`}>
        <span className="xp-kitname">{kit}</span>
        <div className="xp-kitrow">{pieces.map((piece, i) => <span key={piece} style={{ display: 'contents' }}>{i > 0 && <b aria-hidden="true">+</b>}<span>{piece}</span></span>)}</div>
      </div>)}</div>
    </NativeStage>
    <figcaption className="sr-only">{built >= kits.length ? 'Three kits from the same three pieces' : built ? `${kits[built - 1]} from the same three pieces` : 'Three kits, one pattern'}</figcaption>
  </figure>;
}
