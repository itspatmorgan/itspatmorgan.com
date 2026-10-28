import { motion } from 'motion/react';
import { NativeStage } from '../case-study/NativeStage';
import { ART, CheckCircle, Icon, Page, StatusPill, VerdictLabel, Zoom, type Status } from './SublimeUI';
import { CountUp, Expand, SceneControls, useScene } from './scene';

// The ADÉ page with data (patrick/mttc ade-states/active): the agent header and its jobs, most of them started and accepted by ADÉ.
// Rows are sample data from the prototypes' job lists; the Performance tiles are the active state's (mttc ade-states/active).
// The scene: the page settles, then a job ADÉ started on its own arrives at the top, runs, and lands auto-accepted.
const timings = [1400, 1400, 2600, 4200];
const captions = ['ADÉ’s page: what it has done for coverage', 'ADÉ starts a job on its own', 'ADÉ works the job in the background', 'The rule cleared the threshold: auto-accepted, with no one waiting on it'];
const tiles = [
  { to: 50, format: (n: number) => `${Math.round(n)} mins`, label: 'Time to Coverage' },
  { to: 1.1, format: (n: number) => `${n.toFixed(1)}k`, label: 'Hours Saved' },
  { to: 55, format: (n: number) => `${Math.round(n)}k`, label: 'Attacks Blocked' },
];
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
  const scene = useScene(timings);
  const step = scene.step;
  const shown = scene.reduced || scene.seen;
  const row = (job: typeof jobs[number], i: number, live = false) => {
    const done = !live || step >= 3;
    return <motion.div key={job.subject} className={`sb-row ${live && step < 3 ? 'is-new' : ''}`} style={{ gridTemplateColumns: cols }}
      initial={live || scene.reduced ? false : { opacity: 0, y: 6 }} animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ delay: live ? 0 : .25 + i * .06, duration: .4, ease: [.23, 1, .32, 1] }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.subject}</span>
      <VerdictLabel verdict={job.verdict} />
      <span>{job.by}</span>
      <span>{live ? 'Just now' : job.started}</span>
      <span className="sb-verdict">{done && (live || job.report === 'Completed') ? <CheckCircle size={13} color="var(--sb-button)" /> : <span className="sb-spin" style={{ display: 'inline-flex' }}>{Icon.progress}</span>}{live ? (done ? 'Completed' : 'In Progress') : job.report}</span>
      <span>{live ? (done ? <motion.span style={{ display: 'inline-flex' }} initial={scene.reduced ? false : { opacity: 0, scale: .9, filter: 'blur(2px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: .35, ease: [.23, 1, .32, 1] }}><StatusPill status="auto" /></motion.span> : '—') : job.status ? <StatusPill status={job.status} /> : '—'}</span>
    </motion.div>;
  };
  return <figure className={`qb-demo ${scene.fade ? 'qb-loop-reset' : ''}`} ref={scene.ref} aria-label="The ADÉ page: Performance shows 50 mins Time to Coverage, 1.1k Hours Saved and 55k Attacks Blocked; a job ADÉ started on its own arrives at the top of the jobs list and finishes auto-accepted, above jobs whose rules were auto-accepted, accepted, rejected or are waiting for review">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom key={scene.take} width={1000}>
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
              {tiles.map((tile, i) => <div key={tile.label} className="sb-tile" style={{ marginLeft: i ? -1 : 0 }}><p><CountUp to={tile.to} run={shown} duration={1.3} format={tile.format} reduced={scene.reduced} /></p><span className="sb-label sb-verdict" style={{ fontSize: 11, gap: 4 }}>{tile.label}{Icon.info}</span></div>)}
            </div>
            <p style={{ marginTop: 28, fontSize: 14, fontWeight: 600 }}>Jobs</p>
            <span className="sb-filter" style={{ marginTop: 12 }}>Recommendation Status<b>All</b></span>
            <div style={{ marginTop: 12, border: '1px solid var(--sb-border)', borderRadius: 4 }}>
              <div className="sb-row is-head" style={{ gridTemplateColumns: cols }}>
                {['Message Subject', 'ASA Verdict', 'Started By', 'Started', 'Report Status', 'Recommendation Status'].map(h => <span key={h}>{h}</span>)}
              </div>
              <Expand open={step >= 1}>{row(jobs[0], 0, true)}</Expand>
              {jobs.slice(1).map((job, i) => row(job, i))}
            </div>
          </Page>
        </Zoom>
      </div>
    </NativeStage>
    <SceneControls scene={scene} title="the ADÉ page" caption={captions[step]} />
  </figure>;
}
