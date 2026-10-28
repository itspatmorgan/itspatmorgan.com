import type { ReactNode } from 'react';
import { NativeStage } from '../case-study/NativeStage';
import { useRevealOnce } from '../case-study/useRevealOnce';
import { ART, CheckCircle, VerdictLabel, Zoom } from './SublimeUI';

// The ADÉ page with data (patrick/mttc ade-states/active): the agent header and its jobs, most of them started and accepted by ADÉ.
// Rows are sample data from the prototypes' job lists. The Performance tiles are left out: their values in the prototype are mock.
type Status = 'auto' | 'accepted' | 'review' | 'rejected' | null;
const jobs: { subject: string; verdict: 'malicious' | 'spam' | 'graymail'; by: string; started: string; report: 'Completed' | 'In Progress'; status: Status }[] = [
  { subject: 'Invoice payment confirmation required today', verdict: 'malicious', by: 'ADÉ', started: '9h ago', report: 'In Progress', status: null },
  { subject: 'Benefits enrollment form from rare sender', verdict: 'graymail', by: 'ADÉ', started: '18h ago', report: 'Completed', status: 'auto' },
  { subject: 'DocuSign: updated employee handbook signature request', verdict: 'spam', by: 'ADÉ', started: '1d ago', report: 'Completed', status: 'accepted' },
  { subject: 'Action required: payroll profile verification', verdict: 'malicious', by: 'ADÉ', started: '1d ago', report: 'Completed', status: 'review' },
  { subject: 'Calendar invite with external benefits link', verdict: 'spam', by: 'AJ Williams', started: '1d ago', report: 'Completed', status: 'rejected' },
  { subject: 'Urgent wire transfer details for review', verdict: 'malicious', by: 'ADÉ', started: '2d ago', report: 'Completed', status: 'auto' },
  { subject: 'Shared voicemail transcript is ready', verdict: 'graymail', by: 'Fatima Al-Sayed', started: '12d ago', report: 'Completed', status: 'accepted' },
  { subject: 'Payroll QR credential harvest report', verdict: 'malicious', by: 'ADÉ', started: '15d ago', report: 'Completed', status: 'auto' },
];
const statusPill: Record<Exclude<Status, null>, ReactNode> = {
  auto: <span className="sb-pill is-success"><CheckCircle size={16} />Auto-Accepted</span>,
  accepted: <span className="sb-pill is-success"><CheckCircle size={16} />Accepted</span>,
  review: <span className="sb-pill is-review"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7.5" fill="var(--sb-spam)" /><path d="M8 4.6v4.2M8 11.2v.2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>Needs Review</span>,
  rejected: <span className="sb-pill is-muted"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7.5" fill="var(--sb-weak)" /><path d="M5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg>Rejected</span>,
};
const cols = '1fr 120px 128px 84px 128px 160px';

/** The agent's work, to monitor and steer. */
export default function AdeJobs() {
  const reveal = useRevealOnce<HTMLElement>();
  return <figure className="qb-demo" ref={reveal.ref} aria-label="The ADÉ page: a list of jobs, most started by ADÉ, with rules auto-accepted, accepted, rejected or waiting for review">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom width={1000}>
          <div style={{ padding: '28px 24px 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 64, height: 64, border: '1px solid var(--sb-border)', borderRadius: 4 }}><img src={ART.ade} alt="" draggable={false} className="sb-art" style={{ width: 44 }} /></span>
              <div style={{ flex: 1, paddingTop: 6 }}>
                <p className="sb-h">ADÉ (Autonomous Detection Engineer)</p>
                <p className="sb-body" style={{ fontWeight: 500 }}>Creates detections tailored to your environment.</p>
              </div>
              <span className="sb-btn is-secondary">Go to Settings</span>
            </div>
            <p style={{ marginTop: 36, fontSize: 14, fontWeight: 600 }}>Jobs</p>
            <div style={{ marginTop: 12, border: '1px solid var(--sb-border)', borderRadius: 4 }}>
              <div className="sb-row is-head" style={{ gridTemplateColumns: cols }}>
                {['Message Subject', 'ASA Verdict', 'Started By', 'Started', 'Report Status', 'Recommendation Status'].map(h => <span key={h}>{h}</span>)}
              </div>
              {jobs.map((job, i) => <div key={job.subject} className={`sb-row sb-fade ${reveal.shown ? '' : 'is-out'}`} style={{ gridTemplateColumns: cols, transitionDelay: `${200 + i * 110}ms` }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.subject}</span>
                <VerdictLabel verdict={job.verdict} />
                <span>{job.by}</span>
                <span>{job.started}</span>
                <span className="sb-verdict">{job.report === 'Completed' ? <CheckCircle size={13} color="var(--sb-button)" /> : <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.6" fill="none" stroke="var(--sb-strong)" strokeWidth="1.6" /><path d="M8 1.4A6.6 6.6 0 0 1 8 14.6z" fill="var(--sb-strong)" /></svg>}{job.report}</span>
                <span>{job.status ? statusPill[job.status] : '—'}</span>
              </div>)}
            </div>
          </div>
        </Zoom>
      </div>
    </NativeStage>
  </figure>;
}
