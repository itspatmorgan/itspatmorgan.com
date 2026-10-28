import { NativeStage } from '../case-study/NativeStage';
import { useRevealOnce } from '../case-study/useRevealOnce';
import { ART, CheckCircle, Icon, Page, StatusPill, VerdictLabel, Zoom, type Status } from './SublimeUI';

// The ADÉ page with data (patrick/mttc ade-states/active): the agent header and its jobs, most of them started and accepted by ADÉ.
// Rows are sample data from the prototypes' job lists; the Performance tiles are the active state's (mttc ade-states/active).
const jobs: { subject: string; verdict: 'malicious' | 'spam' | 'graymail'; by: string; started: string; report: 'Completed' | 'In Progress'; status: Status | null }[] = [
  { subject: 'Invoice payment confirmation required today', verdict: 'malicious', by: 'ADÉ', started: '9h ago', report: 'In Progress', status: null },
  { subject: 'Benefits enrollment form from rare sender', verdict: 'graymail', by: 'ADÉ', started: '18h ago', report: 'Completed', status: 'auto' },
  { subject: 'DocuSign: updated employee handbook signature request', verdict: 'spam', by: 'ADÉ', started: '1d ago', report: 'Completed', status: 'accepted' },
  { subject: 'Action required: payroll profile verification', verdict: 'malicious', by: 'ADÉ', started: '1d ago', report: 'Completed', status: 'review' },
  { subject: 'Calendar invite with external benefits link', verdict: 'spam', by: 'AJ Williams', started: '1d ago', report: 'Completed', status: 'rejected' },
  { subject: 'Urgent wire transfer details for review', verdict: 'malicious', by: 'ADÉ', started: '2d ago', report: 'Completed', status: 'auto' },
  { subject: 'Shared voicemail transcript is ready', verdict: 'graymail', by: 'Fatima Al-Sayed', started: '12d ago', report: 'Completed', status: 'accepted' },
  { subject: 'Payroll QR credential harvest report', verdict: 'malicious', by: 'ADÉ', started: '15d ago', report: 'Completed', status: 'auto' },
];
const cols = '1fr 120px 128px 84px 128px 160px';

/** The agent's work, to monitor and steer. */
export default function AdeJobs() {
  const reveal = useRevealOnce<HTMLElement>();
  return <figure className="qb-demo" ref={reveal.ref} aria-label="The ADÉ page: a list of jobs, most started by ADÉ, with rules auto-accepted, accepted, rejected or waiting for review">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom width={1000}>
          <Page crumbs={['Agents', 'ADÉ']} style={{ padding: '28px 32px 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 64, height: 64, border: '1px solid var(--sb-border)', borderRadius: 4 }}><img src={ART.ade} alt="" draggable={false} className="sb-art" style={{ width: 44 }} /></span>
              <div style={{ flex: 1, paddingTop: 6 }}>
                <p className="sb-h">ADÉ (Autonomous Detection Engineer)</p>
                <p className="sb-body" style={{ fontWeight: 500 }}>Creates detections tailored to your environment.</p>
              </div>
              <span className="sb-btn is-secondary">Go to Settings</span>
            </div>
            <p style={{ marginTop: 28, fontSize: 14, fontWeight: 600 }}>Performance <span className="sb-label" style={{ fontWeight: 400, marginLeft: 4 }}>(Last 30 days)</span></p>
            <div style={{ display: 'flex', marginTop: 10 }}>
              {[['50 mins', 'Time to Coverage'], ['1.1k', 'Hours Saved'], ['55k', 'Attacks Blocked']].map(([value, label], i) => <div key={label} className={`sb-fade ${reveal.shown ? '' : 'is-out'}`} style={{ width: 180, padding: '14px 16px', border: '1px solid var(--sb-border)', marginLeft: i ? -1 : 0, transitionDelay: `${100 + i * 90}ms` }}><p style={{ fontSize: 22, fontWeight: 500, lineHeight: '28px' }}>{value}</p><p className="sb-label sb-verdict" style={{ fontSize: 11, gap: 4 }}>{label}{Icon.info}</p></div>)}
            </div>
            <p style={{ marginTop: 28, fontSize: 14, fontWeight: 600 }}>Jobs</p>
            <span className="sb-chip" style={{ marginTop: 10, height: 28, gap: 8, background: 'var(--sb-secondary)' }}>Recommendation Status <b style={{ fontWeight: 500 }}>All</b></span>
            <div style={{ marginTop: 12, border: '1px solid var(--sb-border)', borderRadius: 4 }}>
              <div className="sb-row is-head" style={{ gridTemplateColumns: cols }}>
                {['Message Subject', 'ASA Verdict', 'Started By', 'Started', 'Report Status', 'Recommendation Status'].map(h => <span key={h}>{h}</span>)}
              </div>
              {jobs.map((job, i) => <div key={job.subject} className={`sb-row sb-fade ${reveal.shown ? '' : 'is-out'}`} style={{ gridTemplateColumns: cols, transitionDelay: `${200 + i * 110}ms` }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.subject}</span>
                <VerdictLabel verdict={job.verdict} />
                <span>{job.by}</span>
                <span>{job.started}</span>
                <span className="sb-verdict">{job.report === 'Completed' ? <CheckCircle size={13} color="var(--sb-button)" /> : Icon.progress}{job.report}</span>
                <span>{job.status ? <StatusPill status={job.status} /> : '—'}</span>
              </div>)}
            </div>
          </Page>
        </Zoom>
      </div>
    </NativeStage>
  </figure>;
}
