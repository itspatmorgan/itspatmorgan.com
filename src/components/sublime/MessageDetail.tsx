import { NativeStage, DemoControls, DemoCursor } from '../case-study/NativeStage';
import { useDemoLoop } from '../case-study/useDemoLoop';
import { Icon, Page, StatusPill, VerdictIcon, Zoom, job, useAim } from './SublimeUI';

// The message detail page (patrick/ade-workflow user-reports, MessageDetailView and AdeStatusCard): ASA's verdict on a message no rule caught.
// `gap` is the page before ADÉ, where the way to a rule was the Rule Editor. `handoff` adds the ADÉ card and runs a job from it.
// Message, verdict and job copy are the prototype's sample data.
type Variant = 'gap' | 'handoff';
const W = 1000;
const timings: Record<Variant, number[]> = {
  gap: [1400, 1800, 3200],
  handoff: [1000, 900, 700, 2800, 3600],
};
const captions: Record<Variant, string[]> = {
  gap: ['ASA flags the message as malicious', 'No existing rule matched it', 'The way to a rule: send it to the Rule Editor and write one'],
  handoff: ['ADÉ sits beside the verdict', 'Trigger ADÉ', 'Starting ADÉ', 'ADÉ hunts, writes and tests a rule', 'A recommendation is ready for review'],
};
const classifications = ['malicious', 'spam', 'graymail', 'benign'] as const;
const other = ['Send EML to Rule Editor', 'Send EML to Sublime', 'Send to ThreadSafe', 'Share feedback'];

function AdeCard({ phase }: { phase: 'trigger' | 'starting' | 'running' | 'review' }) {
  const isJob = phase === 'running' || phase === 'review';
  return <div className={`sb-ade-card ${phase === 'running' || phase === 'starting' ? 'is-running' : ''}`}><div>
    <div className="sb-cell-head" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--sb-border-strong)' }}>ADÉ (Autonomous Detection Engineer){Icon.info}</div>
    <div style={{ display: 'grid', padding: 16 }}>
      <div className={`sb-swap ${isJob ? 'is-out' : ''}`} style={{ gridArea: '1 / 1', display: 'grid', gap: 16, alignContent: 'start' }}>
        <span className="sb-body">ADÉ recommends new Detection Rules for malicious, spam, or graymail messages that do not match any Detection Rules.</span>
        <span className="sb-btn" data-target="trigger" style={{ width: 'fit-content', opacity: phase === 'starting' ? .6 : 1 }}>{phase === 'starting' ? 'Starting ADÉ…' : 'Trigger ADÉ'}</span>
      </div>
      <div className={`sb-swap ${isJob ? '' : 'is-out'}`} style={{ gridArea: '1 / 1', display: 'grid', gap: 14, alignContent: 'start' }}>
        {phase === 'review' && <span><StatusPill status="review" /></span>}
        <div style={{ display: 'grid', gap: 8 }} className="sb-body">
          {phase === 'review'
            ? <span className="sb-verdict"><span style={{ color: 'var(--sb-button)', display: 'inline-flex' }}><svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7.5" fill="currentColor" /><path d="M4.8 8.2l2.1 2.1 4.3-4.4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg></span>Completed in 17m</span>
            : <><span className="sb-verdict">{Icon.progress}In Progress</span><span className="sb-verdict">{Icon.stopwatch}Started on July 3, 2026 at 2:12 PM</span></>}
          <span className="sb-verdict">{Icon.user}Started by Patrick Morgan</span>
        </div>
        <span className="sb-btn is-secondary" style={{ width: 'fit-content' }}>View Report</span>
      </div>
    </div>
  </div></div>;
}

/** A message ASA called malicious that no rule caught, before and with ADÉ. */
export default function MessageDetail({ variant }: { variant: Variant }) {
  const loop = useDemoLoop(timings[variant], timings[variant].length - 1);
  const step = loop.step;
  const aim = useAim(step);
  const gap = variant === 'gap';
  const marked = gap && step >= 1;
  const hoverEditor = gap && step === 2;
  const phase = step <= 1 ? 'trigger' : step === 2 ? 'starting' : step === 3 ? 'running' : 'review';
  const cursor = gap
    ? { visible: step === 2, ...aim.at('editor'), pressing: false }
    : { visible: step <= 2, ...aim.at(step === 0 ? 'rest' : 'trigger'), pressing: step === 2 };
  return <figure className={`qb-demo ${loop.resetting ? 'qb-loop-reset' : ''}`} ref={loop.ref} aria-label={gap
    ? 'The message detail page: ASA rates a payroll phishing message malicious, Message Insights notes that no existing Detection Rule matched it, and the remaining path is Send EML to Rule Editor'
    : 'The same page with ADÉ: Trigger ADÉ starts a job beside the verdict, which runs in the background and returns a recommendation that needs review'}>
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom width={W} zoomRef={aim.ref}>
          <Page crumbs={['User Reports', job.subject]} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 32, padding: '24px 32px' }}>
            <div style={{ display: 'grid', gap: 24, alignContent: 'start' }}>
              <div className="sb-box" style={{ overflow: 'hidden' }}>
                <div className="sb-banner">
                  <div><span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>Verdict (ASA){Icon.info}</span><p style={{ marginTop: 4, fontSize: 22, fontWeight: 600, lineHeight: '28px' }}>Malicious</p></div>
                  <svg width="40" height="44" viewBox="0 0 16 17.6" aria-hidden="true"><path d="M8 .8l6.6 3.8v8.4L8 16.8 1.4 13V4.6z" fill="#fff" /><path d="M8 5.4v4.6M8 12.4v.2" stroke="#CC4837" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </div>
                <div style={{ display: 'grid', gap: 20, padding: '20px 28px 24px' }}>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <span className="sb-label">ASA Executive Summary</span>
                    <p className="sb-body" style={{ lineHeight: '22px' }}>This message impersonates Payroll Operations and urges the recipient to verify their payroll profile through an unfamiliar domain. The sender fails DMARC, does not align with the organization’s trusted HR infrastructure, and uses credential-harvesting language under the pretext of an upcoming pay cycle. ASA assessed the message as malicious credential phishing.</p>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <span className="sb-label">Message Group Summary</span>
                    <div className="sb-body" style={{ display: 'grid', gridTemplateColumns: '84px 1fr', rowGap: 6 }}>
                      <span className="sb-label" style={{ lineHeight: '20px' }}>Type</span><span>Inbound</span>
                      <span className="sb-label" style={{ lineHeight: '20px' }}>Subject</span><span>{job.subject}</span>
                      <span className="sb-label" style={{ lineHeight: '20px' }}>Sender</span><span>Payroll Operations &lt;payroll-verify@employee-benefits.co&gt;</span>
                      <span className="sb-label" style={{ lineHeight: '20px' }}>Recipient</span><span>alex.morgan@acme.com</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sb-cells">
                <div className="sb-cell-head" data-target="rest">Message Insights (2)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <span className="sb-verdict sb-body" style={{ alignItems: 'flex-start', padding: '14px 16px', borderRight: '1px solid var(--sb-border-strong)' }}><VerdictIcon verdict="malicious" />ASA determined that the message is a credential-phishing attempt.</span>
                  <span style={{ padding: 6 }}><span className={`sb-mark sb-verdict sb-body ${marked ? 'is-on' : ''}`} style={{ alignItems: 'flex-start', padding: '8px 10px' }}><VerdictIcon verdict="malicious" />No existing Detection Rule matched this message group.</span></span>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
              <p className="sb-h">Review Status</p>
              <div className="sb-cells">
                <div style={{ display: 'grid', gap: 8, padding: '12px 12px 14px' }}><span className="sb-label">Review Status</span><span className="sb-pill is-outline" style={{ width: 'fit-content' }}>⚠ Unreviewed</span></div>
                <div style={{ padding: 12 }}>
                  <div style={{ borderRadius: 4, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px var(--sb-button)' }}>
                    <div className="sb-list-row" style={{ background: 'var(--sb-button)', color: '#fff', fontWeight: 500 }}>Select Classification{Icon.info}</div>
                    {classifications.map(v => <div key={v} className="sb-list-row" style={{ borderTop: '1px solid var(--sb-border)' }}><span className="sb-verdict"><VerdictIcon verdict={v} />{v[0].toUpperCase() + v.slice(1)}</span>{Icon.chevron()}</div>)}
                  </div>
                </div>
              </div>
              <div className="sb-cells">
                <div className="sb-cell-head">Other</div>
                {other.map((o, i) => <div key={o} className={`sb-list-row ${hoverEditor && i === 0 ? 'is-hover' : ''}`} data-target={i === 0 ? 'editor' : undefined} style={{ height: 38 }}>{o}{Icon.chevron()}</div>)}
              </div>
              {!gap && <AdeCard phase={phase} />}
            </div>
          </Page>
          <DemoCursor x={cursor.x} y={cursor.y} visible={cursor.visible} reduced={loop.reduced} pressing={cursor.pressing} />
        </Zoom>
      </div>
    </NativeStage>
    <DemoControls loop={loop} title={gap ? 'the missed threat' : 'the handoff to ADÉ'} caption={captions[variant][step]} />
  </figure>;
}
