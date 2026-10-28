import { NativeStage, DemoControls } from '../case-study/NativeStage';
import { useDemoLoop } from '../case-study/useDemoLoop';
import { CheckCircle, RuleCode, Zoom, ruleName } from './SublimeUI';

// An ADÉ job (blueprints/ade: JobCompletedCard, AcceptedTimelineItem and the hunt summary), with the backtest pulled up beside the outcome.
// The 90% auto-accept threshold is the prototype's recommended default for Malicious (mttc _ade-data.js). The three match rates and
// the floor below which ADÉ makes no recommendation are illustrative.
const THRESHOLD = 90;
const FLOOR = 50;
const states = [
  { match: 96, outcome: 'auto' },
  { match: 78, outcome: 'review' },
  { match: 41, outcome: 'retry' },
] as const;
const timings = [3400, 3400, 3400];

function Header({ outcome }: { outcome: typeof states[number]['outcome'] }) {
  if (outcome === 'auto') return <div className="sb-job-head is-auto"><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={18} color="#fff" check="var(--sb-success)" /><b style={{ fontWeight: 700 }}>ADÉ</b> auto-accepted and activated the recommended rule</span></div>;
  if (outcome === 'review') return <div className="sb-job-head"><div><p className="sb-body" style={{ fontWeight: 600 }}>ADÉ Recommendation</p><p className="sb-body" style={{ marginTop: 4 }}>Create a new rule and set it as active in your environment.</p></div><div style={{ display: 'flex', gap: 8 }}><span className="sb-btn">Accept</span><span className="sb-btn is-secondary">Reject</span></div></div>;
  return <div className="sb-job-head"><div><p className="sb-body" style={{ fontWeight: 600 }}>No rule recommended</p><p className="sb-body" style={{ marginTop: 4 }}>The match was too weak to recommend, so ADÉ is trying a different approach.</p></div></div>;
}

/** The backtest decides: auto-accept, review, or try again. */
export default function BacktestReview() {
  const loop = useDemoLoop(timings, 0);
  const { match, outcome } = states[loop.step];
  const tone = outcome === 'auto' ? 'var(--sb-success)' : outcome === 'review' ? 'var(--sb-spam)' : 'var(--sb-border-strong)';
  return <figure className={`qb-demo ${loop.resetting ? 'qb-loop-reset' : ''}`} ref={loop.ref} aria-label={`A recommended rule's backtest against the auto-accept threshold of ${THRESHOLD}%: a 96% match is accepted automatically, a 78% match waits for review, and a 41% match is not recommended`}>
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom width={840}>
          <div style={{ padding: '32px 32px 0', display: 'grid', gap: 20 }}>
            <div>
              <p style={{ fontSize: 20, fontWeight: 600, lineHeight: '28px' }}>Action required: payroll profile verification</p>
              <p className="sb-label" style={{ marginTop: 4 }}>ADÉ hunted across 14 days and found 43 message groups</p>
            </div>
            <div className="sb-job">
              <Header outcome={outcome} />
              <div style={{ padding: '20px 24px', display: 'grid', gap: 14, borderBottom: '1px solid var(--sb-border)' }}>
                <p className="sb-body">The rule is a <b style={{ fontWeight: 600 }}>{match}% match</b> with the messages ADÉ hunted.</p>
                <div style={{ position: 'relative', paddingBottom: 26 }}>
                  <div className="sb-meter"><i style={{ width: `${match}%`, background: tone }} /></div>
                  <span className="sb-tick" style={{ left: `${FLOOR}%` }} />
                  <span className="sb-tick is-threshold" style={{ left: `${THRESHOLD}%` }} />
                  <span className="sb-zone" style={{ left: 0, width: `${FLOOR}%` }}>Not recommended</span>
                  <span className="sb-zone" style={{ left: `${FLOOR}%`, width: `${THRESHOLD - FLOOR}%` }}>Needs your review</span>
                  <span className="sb-zone is-strong" style={{ left: `${THRESHOLD}%`, width: `${100 - THRESHOLD}%`, justifyContent: 'flex-end' }}>Auto‑accept at {THRESHOLD}%</span>
                </div>
              </div>
              <div className="sb-dim" style={{ padding: '20px 24px', display: 'grid', gap: 10, opacity: outcome === 'retry' ? .35 : 1 }}>
                <p className="sb-label">Rule MQL</p>
                <p className="sb-body" style={{ fontWeight: 500 }}>{ruleName}</p>
                <RuleCode />
              </div>
            </div>
          </div>
        </Zoom>
      </div>
    </NativeStage>
    <DemoControls loop={loop} title="the backtest outcomes" caption={outcome === 'auto' ? `${match}% match: accepted automatically` : outcome === 'review' ? `${match}% match: waits for review` : `${match}% match: not recommended`} />
  </figure>;
}
