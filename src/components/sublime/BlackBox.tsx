import { NativeStage } from '../case-study/NativeStage';
import { useDemoLoop } from '../case-study/useDemoLoop';
import { ART, RuleCode, VerdictIcon, Zoom, ruleName } from './SublimeUI';

// The bet as one toggle on the full stage: the same missed threat through a black-box agent and through ADÉ.
// The black-box side is drawn for the comparison in the product's style; the ADÉ side is the recommendation card from the blueprint.
const timings = [3000, 4000];
const modes = ['Black-box agent', 'ADÉ'];

function Arrow() {
  return <svg width="40" height="16" viewBox="0 0 40 16" aria-hidden="true"><path d="M2 8h34M30 3l6 5-6 5" fill="none" stroke="var(--sb-weak)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

/** What you can do with the answer: wait on a vendor, or read and own the rule. */
export default function BlackBox() {
  const loop = useDemoLoop(timings, 0, false, true);
  const ade = loop.step === 1;
  return <figure className="qb-demo" ref={loop.ref} aria-label="A black-box agent returns a verdict you can't read or change. ADÉ returns a detection rule in MQL that you can read, accept, edit or reject">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom width={840}>
          <div style={{ padding: '32px 32px 0', display: 'grid', justifyItems: 'center', gap: 32 }}>
            <div className="sb-toggle" role="group" aria-label="Compare">
              {modes.map((mode, i) => <button key={mode} type="button" aria-pressed={loop.step === i} onClick={() => loop.choose(i)}>{mode}</button>)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 236, padding: '10px 12px', border: '1px solid var(--sb-border)', borderRadius: 6, display: 'grid', gap: 4 }}>
                <span style={{ fontSize: 11, lineHeight: '16px', color: 'var(--sb-weak)' }}>payroll-verify@employee-benefits.co</span>
                <span style={{ fontSize: 13, fontWeight: 500, lineHeight: '18px' }}>Action required: payroll profile verification</span>
                <span className="sb-chip" style={{ width: 'fit-content', height: 20, fontSize: 11, color: 'var(--sb-weak)' }}>No rule matched</span>
              </div>
              <Arrow />
              <div style={{ position: 'relative', width: 96, height: 96 }}>
                <div className={`sb-swap ${ade ? 'is-out' : ''}`} style={{ position: 'absolute', inset: 8, borderRadius: 10, background: 'var(--sb-box)', display: 'grid', placeItems: 'center', color: 'var(--sb-box-ink)', fontSize: 30, fontWeight: 500 }}>?</div>
                <img src={ART.ade} alt="" draggable={false} className={`sb-swap sb-art ${ade ? '' : 'is-out'}`} style={{ position: 'absolute', inset: 0, width: 96, height: 96, objectFit: 'contain' }} />
              </div>
              <Arrow />
              <span style={{ position: 'relative', width: 140, height: 20, fontSize: 14, fontWeight: 600 }}>
                <span className={`sb-swap ${ade ? 'is-out' : ''}`} style={{ position: 'absolute', inset: 0 }}>A verdict</span>
                <span className={`sb-swap ${ade ? '' : 'is-out'}`} style={{ position: 'absolute', inset: 0 }}>A rule you can read</span>
              </span>
            </div>
            <div style={{ position: 'relative', width: 776, height: 560 }}>
              <div className={`sb-swap ${ade ? 'is-out' : ''}`} style={{ position: 'absolute', inset: 0, display: 'grid', alignContent: 'start', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 24px', background: 'var(--sb-subtle)', border: '1px solid var(--sb-border)', borderRadius: 4 }}>
                  <VerdictIcon verdict="malicious" size={20} /><span style={{ fontSize: 18, fontWeight: 600 }}>Malicious</span>
                </div>
                <div style={{ display: 'grid', gap: 10, padding: '20px 24px', border: '1px dashed var(--sb-border-strong)', borderRadius: 4, color: 'var(--sb-weak)', fontSize: 14, lineHeight: '20px' }}>
                  <p><b style={{ fontWeight: 600, color: 'var(--sb-strong)' }}>Why?</b> The model doesn’t say.</p>
                  <p><b style={{ fontWeight: 600, color: 'var(--sb-strong)' }}>Something new got through?</b> Report it to the vendor and wait for their next model update.</p>
                </div>
              </div>
              <div className={`sb-swap ${ade ? '' : 'is-out'}`} style={{ position: 'absolute', inset: 0, border: '1px solid var(--sb-border)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', padding: 20, background: 'var(--sb-subtle)', borderBottom: '1px solid var(--sb-border)' }}>
                  <div><p className="sb-body" style={{ fontWeight: 600 }}>ADÉ Recommendation</p><p className="sb-body" style={{ marginTop: 4 }}>Create a new rule and set it as active in your environment.</p></div>
                  <div style={{ display: 'flex', gap: 8 }}><span className="sb-btn">Accept</span><span className="sb-btn is-secondary">Reject</span></div>
                </div>
                <div style={{ padding: 20, display: 'grid', gap: 10 }}>
                  <p className="sb-body" style={{ fontWeight: 500 }}>{ruleName}</p>
                  <RuleCode />
                </div>
              </div>
            </div>
          </div>
        </Zoom>
      </div>
    </NativeStage>
    <figcaption className="sr-only" aria-live="polite">{ade ? 'ADÉ: a rule you can read, accept, edit or reject' : 'A black-box agent: a verdict, with no way to see or change why'}</figcaption>
  </figure>;
}
