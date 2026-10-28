import { NativeStage } from '../case-study/NativeStage';
import { useDemoLoop } from '../case-study/useDemoLoop';
import { Glass, Zoom } from './SublimeUI';

// "What you control" from the How ADÉ works dialog (patrick/mttc AdeEducationShot): the three levels as glass panes,
// each with who does each step. Plays through the levels once, then holds on all three.
const LEVELS = [
  { title: 'Manual', body: 'You choose which missed threats to send to ADÉ, and you accept or reject every recommendation.', owners: ['You', 'ADÉ', 'You'] },
  { title: 'Auto-start', body: 'ADÉ starts on missed threats by itself. You still accept or reject every recommendation.', owners: ['ADÉ', 'ADÉ', 'You'] },
  { title: 'Auto-accept', body: 'ADÉ also accepts recommendations that meet the threshold you set, so rules go live without waiting for you.', owners: ['ADÉ', 'ADÉ', 'ADÉ'] },
];
const STEPS = ['Send a threat', 'Build a rule', 'Accept a rule'];
const timings = [1600, 1600, 1600, 4000];

/** Manual, then auto-start, then auto-accept. */
export default function AutonomyLevels() {
  const loop = useDemoLoop(timings, 0, false, true);
  const level = loop.step; // 0-2 brings in each level; 3 holds all three
  return <figure className="qb-demo" ref={loop.ref} aria-label="Three levels of control. Manual: you send threats to ADÉ and accept every rule. Auto-start: ADÉ starts by itself and you accept. Auto-accept: ADÉ also accepts rules that meet your threshold">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <div className="sb-stage-g" />
        <Zoom width={760}>
          <ol style={{ padding: '120px 24px 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {LEVELS.map((l, i) => <li key={l.title} className={`sb-fade ${i <= level ? '' : 'is-out'}`} style={{ display: 'flex' }}>
              <Glass className={`sb-level sb-dim ${level < 3 && i !== level ? 'is-dim' : ''}`}>
                <span aria-hidden="true" style={{ display: 'flex', height: 18, alignItems: 'flex-end', gap: 4 }}>
                  {[8, 13, 18].map((h, n) => <i key={n} style={{ width: 5, height: h, borderRadius: 2, background: n <= i ? 'var(--sb-brand)' : 'var(--sb-g-placeholder)' }} />)}
                </span>
                <p style={{ marginTop: 16, fontSize: 20, fontWeight: 500, lineHeight: '28px', letterSpacing: '-.2px' }}>{l.title}</p>
                <p className="sb-g-weak" style={{ marginTop: 8, minHeight: 84, fontSize: 13, lineHeight: '21px' }}>{l.body}</p>
                <dl style={{ marginTop: 12, paddingTop: 8, borderTop: '.5px solid var(--sb-g-hairline)' }}>
                  {STEPS.map((step, j) => <div key={step} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '6px 0', fontSize: 12, lineHeight: '16px' }}>
                    <dt className="sb-g-weak">{step}</dt>
                    <dd style={{ fontWeight: 500, color: l.owners[j] === 'ADÉ' ? 'var(--sb-g-ade)' : 'var(--sb-g-strong)' }}>{l.owners[j]}</dd>
                  </div>)}
                </dl>
              </Glass>
            </li>)}
          </ol>
        </Zoom>
      </div>
    </NativeStage>
    <figcaption className="sr-only">{level < 3 ? LEVELS[level].title : 'Manual, Auto-start and Auto-accept'}</figcaption>
  </figure>;
}
