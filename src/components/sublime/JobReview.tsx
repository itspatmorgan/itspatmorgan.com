import type { ReactNode } from 'react';
import { NativeStage, DemoControls, DemoCursor } from '../case-study/NativeStage';
import { useDemoLoop } from '../case-study/useDemoLoop';
import { CheckCircle, Icon, Page, Recommendation, Zoom, job, ruleName, useAim } from './SublimeUI';

// The ADÉ job page (patrick/ade-workflow ade/ade-job-completed-review, AdeJobTimeline and JobCompletedCard): ADÉ's recommended rule
// waits for review, and accepting it runs through the product's Accept Recommendation modal. Copy is the source's; dates are its sample data.
const W = 940;
const timings = [1200, 900, 500, 2200, 500, 3800];
const captions = ['ADÉ’s recommendation: a rule in MQL', 'Review the rule', 'Accept', 'Accept and activate', 'Accept and activate', 'The rule is live, and stays editable'];

/** Page heading for an ADÉ job. */
export function JobHeading({ duration = '17m' }: { duration?: string }) {
  return <div style={{ display: 'grid', gap: 6 }}>
    <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 22, fontWeight: 600, lineHeight: '30px' }}>{job.subject}<span style={{ color: 'var(--sb-link)', display: 'inline-flex' }}>{Icon.external}</span></p>
    <p className="sb-label">Job ID: {job.id}</p>
    <span className="sb-verdict sb-body"><CheckCircle size={14} color="var(--sb-button)" />Completed in {duration}</span>
  </div>;
}

/** The accepted outcome at the top of the timeline (AcceptedTimelineItem). */
export function Accepted({ by, auto = false }: { by: string; auto?: boolean }) {
  return <div className="sb-accepted">
    <div className="sb-accepted-head"><span><b style={{ fontWeight: 700 }}>{by}</b> {auto ? 'auto-' : ''}accepted and activated the recommended rule</span><span style={{ fontSize: 12 }}>Jul 3, 2026, 2:31 PM</span></div>
    <div style={{ display: 'grid', gap: 16, padding: 20 }}>
      <div className="sb-field"><span>Rule Detail</span><span className="sb-ext" style={{ width: 'fit-content', maxWidth: 420 }}><span>{ruleName}</span>{Icon.external}</span></div>
      <div className="sb-field"><span>Flagged Message</span><span className="sb-ext" style={{ width: 'fit-content' }}>View Flagged Messages{Icon.external}</span></div>
    </div>
  </div>;
}

export function TimelineItem({ dot, children }: { dot?: 'active' | 'success'; children: ReactNode }) {
  return <div className="sb-tl-item">
    <span className={`sb-tl-dot ${dot ? `is-${dot}` : ''}`}>{dot === 'success' ? Icon.check : <i style={{ width: 7, height: 7, borderRadius: '50%', background: dot ? '#fff' : 'var(--sb-weak)' }} />}</span>
    {children}
  </div>;
}

/** Review ADÉ's rule, then accept it. */
export default function JobReview() {
  const loop = useDemoLoop(timings, timings.length - 1);
  const step = loop.step;
  const aim = useAim(step);
  const accepted = step === 5;
  const modal = step === 3 || step === 4;
  const cursor = step === 0 ? aim.at('rest') : step <= 2 ? aim.at('accept') : aim.at('activate');
  return <figure className={`qb-demo ${loop.resetting ? 'qb-loop-reset' : ''}`} ref={loop.ref} aria-label="An ADÉ job page: the recommendation shows the rule's name, severity, description, labels, action and MQL. Accept opens a confirmation, then the rule is accepted and activated">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom width={W} zoomRef={aim.ref} style={{ height: 1200 }}>
          <Page crumbs={['Agents', 'ADÉ', job.subject]} style={{ display: 'grid', gap: 28, padding: '28px 40px' }}>
            <JobHeading />
            <div className="sb-timeline">
              <div className={`sb-collapse ${accepted ? 'is-open' : ''}`} style={{ marginBottom: accepted ? 0 : -24 }}><div><TimelineItem dot="success"><Accepted by="Patrick Morgan" /></TimelineItem></div></div>
              <TimelineItem dot={accepted ? undefined : 'active'}><Recommendation actions={!accepted} /></TimelineItem>
            </div>
          </Page>
          <span data-target="rest" style={{ position: 'absolute', left: 600, top: 300 }} />
          <div className={`sb-scrim ${modal ? '' : 'is-out'}`}>
            <div className="sb-modal">
              <p style={{ padding: '16px 20px', fontSize: 16, fontWeight: 600, borderBottom: '1px solid var(--sb-border)' }}>Accept Recommendation</p>
              <div style={{ display: 'grid', gap: 20, padding: '20px' }} className="sb-body">
                <p>This will create the recommended detection rule and apply an Auto-Quarantine action. You’ll be able to edit the Rule at any time after it’s created.</p>
                <div style={{ display: 'grid', gap: 8 }}><span className="sb-label">Leave a comment (optional)</span><div className="sb-textarea">Comment</div></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 20px', borderTop: '1px solid var(--sb-border)' }}><span className="sb-btn is-secondary">Cancel</span><span className="sb-btn" data-target="activate">Accept &amp; Activate Rule</span></div>
            </div>
          </div>
          <DemoCursor x={cursor.x} y={cursor.y} visible={step < 5} reduced={loop.reduced} pressing={step === 2 || step === 4} />
        </Zoom>
      </div>
    </NativeStage>
    <DemoControls loop={loop} title="the rule review" caption={captions[step]} />
  </figure>;
}
