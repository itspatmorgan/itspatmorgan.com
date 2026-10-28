import type { ReactNode } from 'react';
import { NativeStage, DemoControls } from '../case-study/NativeStage';
import { useDemoLoop } from '../case-study/useDemoLoop';
import { ART, CheckCircle, Glass, VerdictIcon, Zoom } from './SublimeUI';

// "What ADÉ does" from the How ADÉ works dialog (patrick/mttc AdeEducationShot, Design OS product-shot style): four glass panes on the
// aqua and mint stage, with Time to Coverage under the three steps it measures. The dialog's "under 2 hours" is a mock figure, so it is left out.
const steps: { title: string; body: string; art: ReactNode; later?: boolean }[] = [
  { title: 'A threat gets through', body: 'A message your rules missed is sent to ADÉ.', art: <div className="sb-g-message"><span className="sb-g-weak" style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>notify@share-mail.net</span><span style={{ fontSize: 12, fontWeight: 500 }}>Shared file for review</span><span className="sb-g-tag">No rule matched</span></div> },
  { title: 'ASA analyzes it', body: 'ASA gives ADÉ the context to draft a strong rule.', art: <div style={{ display: 'grid', justifyItems: 'center', gap: 4 }}><img src={ART.asa} alt="" draggable={false} className="sb-art" style={{ height: 72 }} /><span className="sb-g-verdict"><VerdictIcon verdict="malicious" size={12} />Malicious</span></div> },
  { title: 'ADÉ writes and tests a rule', body: 'ADÉ drafts, tests and revises until the rule is ready.', art: <img src={ART.ade} alt="" draggable={false} className="sb-art" style={{ height: 76 }} /> },
  { title: 'The rule goes live', body: 'Once accepted, the rule catches similar threats.', art: <CheckCircle size={40} color="var(--sb-brand)" />, later: true },
];
const timings = [1600, 1600, 1600, 1600, 2600];

/** Two agents hand off in the background; people come in at the end. */
export default function AgentHandoff() {
  const loop = useDemoLoop(timings, timings.length - 1);
  const active = loop.step; // 0-3 walks the steps; 4 shows the whole loop
  const all = active === steps.length;
  return <figure className={`qb-demo ${loop.resetting ? 'qb-loop-reset' : ''}`} ref={loop.ref} aria-label="ADÉ's loop: a threat gets through, ASA analyzes it, ADÉ writes and tests a rule, and once accepted the rule goes live. Time to Coverage measures the first three steps">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <div className="sb-stage-g" />
        <Zoom width={760}>
          <div style={{ padding: '140px 24px 0', display: 'grid', gap: 20 }}>
            <ol style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 20 }}>
              {steps.map((s, i) => <li key={s.title} className={`sb-dim ${all || i === active ? '' : 'is-dim'}`} style={{ position: 'relative', display: 'flex' }}>
                <Glass back={s.later} className="sb-g-step">
                  <div style={{ display: 'flex', height: 88, alignItems: 'center', justifyContent: 'center' }}>{s.art}</div>
                  <div style={{ display: 'grid', gap: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, lineHeight: '20px' }}>{s.title}</p>
                    <p className="sb-g-weak" style={{ fontSize: 12, lineHeight: '18px' }}>{s.body}</p>
                  </div>
                </Glass>
                {i < steps.length - 1 && <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" style={{ position: 'absolute', right: -18, top: 56, opacity: .6 }} fill="none" stroke="var(--sb-g-strong)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3l5 5-5 5" /></svg>}
              </li>)}
            </ol>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 20 }}>
              <div style={{ gridColumn: 'span 3', display: 'grid', justifyItems: 'center', gap: 8 }}>
                <span className="sb-g-track"><i style={{ width: `${(all ? 3 : Math.min(active + 1, 3)) / 3 * 100}%` }} /></span>
                <span style={{ fontSize: 12, lineHeight: '16px', fontWeight: 500 }}>Time to Coverage</span>
              </div>
            </div>
          </div>
        </Zoom>
      </div>
    </NativeStage>
    <DemoControls loop={loop} title="the agent handoff" caption={all ? 'The whole loop' : steps[active].title} />
  </figure>;
}
