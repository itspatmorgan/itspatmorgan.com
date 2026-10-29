import { motion } from 'motion/react';
import { ART, CheckCircle, Icon, Page, StatusPill, VerdictLabel, type Status } from './SublimeUI';
import { Camera, CountUp, Expand, SceneFrame, frame, useScene, useShot, useStage, useTargets } from './scene';

// The ADÉ page with data (patrick/mttc ade-states/active): the agent header and its jobs, most of them started and accepted by ADÉ.
// Rows are sample data from the prototypes' job lists; the Performance tiles are the active state's (mttc ade-states/active).
// The scene: the page settles, then a job ADÉ started on its own arrives at the top, runs, and lands auto-accepted. On a phone the jobs
// list keeps the subject and the recommendation status, the two columns a team watches.
const timings = [1300, 1200, 2200, 3800];
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
const wideCols = 'minmax(0, 1fr) 120px 128px 84px 128px 160px';
const narrowCols = 'minmax(0, 1fr) 132px';

/** The agent's work, to monitor and steer. */
export default function AdeJobs() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000 });
  const narrow = stage.narrow;
  const cols = narrow ? narrowCols : wideCols;
  const step = scene.step;
  // On a phone the jobs sit below the fold: scroll to them as the new job arrives.
  const t = useTargets(step, narrow);
  const shot = narrow && step >= 1 ? 'jobs' : null;
  const view = useShot(shot, shot ? frame(t.rect('jobs'), { ...stage.box, bottom: t.height }, { scale: 1, pad: 16, y: 'start' }) : null);
  const shown = scene.reduced || scene.seen;
  const row = (job: typeof jobs[number], i: number, live = false) => {
    const done = !live || step >= 3;
    return <motion.div key={job.subject} className={`sb-row ${live && step < 3 ? 'is-new' : ''}`} style={{ gridTemplateColumns: cols }}
      initial={live || scene.reduced ? false : { opacity: 0, y: 6 }} animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ delay: live ? 0 : .25 + i * .06, duration: .4, ease: [.23, 1, .32, 1] }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.subject}</span>
      {!narrow && <>
      <VerdictLabel verdict={job.verdict} />
      <span>{job.by}</span>
      <span>{live ? 'Just now' : job.started}</span>
      <span className="sb-verdict">{done && (live || job.report === 'Completed') ? <CheckCircle size={13} color="var(--sb-button)" /> : <span className="sb-spin" style={{ display: 'inline-flex' }}>{Icon.progress}</span>}{live ? (done ? 'Completed' : 'In Progress') : job.report}</span>
      </>}
      <span>{live ? (done ? <motion.span style={{ display: 'inline-flex' }} initial={scene.reduced ? false : { opacity: 0, scale: .9, filter: 'blur(2px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: .35, ease: [.23, 1, .32, 1] }}><StatusPill status="auto" /></motion.span> : (narrow ? <span className="sb-verdict sb-label"><span className="sb-spin" style={{ display: 'inline-flex' }}>{Icon.progress}</span>Running</span> : '—')) : job.status ? <StatusPill status={job.status} /> : '—'}</span>
    </motion.div>;
  };
  return <SceneFrame scene={scene} stage={stage} title="the ADÉ page" label="The ADÉ page: Performance shows 50 mins Time to Coverage, 1.1k Hours Saved and 55k Attacks Blocked; a job ADÉ started on its own arrives at the top of the jobs list and finishes auto-accepted, above jobs whose rules were auto-accepted, accepted, rejected or are waiting for review">
    <Camera view={view} width={stage.W} height={stage.box.height} cameraRef={t.ref} reduced={scene.reduced}>
          <Page crumbs={['Agents', 'ADÉ']} style={{ padding: narrow ? '20px 16px 0' : '28px 32px 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: narrow ? 14 : 20 }}>
              <span style={{ display: 'grid', placeItems: 'center', flexShrink: 0, width: narrow ? 52 : 64, height: narrow ? 52 : 64, border: '1px solid var(--sb-border)', borderRadius: 4 }}><img src={ART.ade} alt="" draggable={false} className="sb-art" style={{ width: narrow ? 36 : 44 }} /></span>
              <div style={{ flex: 1, paddingTop: narrow ? 0 : 6 }}>
                <p className="sb-h">{narrow ? 'ADÉ' : 'ADÉ (Autonomous Detection Engineer)'}</p>
                <p className="sb-body" style={{ fontWeight: 500 }}>Creates detections tailored to your environment.</p>
              </div>
              {!narrow && <span className="sb-btn is-secondary">Go to Settings</span>}
            </div>
            <p style={{ marginTop: 28, fontSize: 14, fontWeight: 600 }}>Performance <span className="sb-label" style={{ fontWeight: 400, marginLeft: 4 }}>(Last 30 days)</span></p>
            <div style={{ display: 'flex', marginTop: 10 }}>
              {tiles.map((tile, i) => <div key={tile.label} className="sb-tile" style={{ marginLeft: i ? -1 : 0, ...(narrow ? { width: 'auto', flex: 1, padding: '12px 12px' } : {}) }}><p><CountUp to={tile.to} run={shown} duration={1.3} format={tile.format} reduced={scene.reduced} /></p><span className="sb-label sb-verdict" style={{ fontSize: 11, gap: 4, whiteSpace: 'nowrap' }}>{tile.label}{!narrow && Icon.info}</span></div>)}
            </div>
            {/* Liberty taken: the source's purple filter chip goes gray, and sits on the Jobs heading's line rather than below it. */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 28 }} data-frame="jobs">
              <p style={{ fontSize: 14, fontWeight: 600 }}>Jobs</p>
              <span className="sb-filter">{narrow ? 'Status' : 'Recommendation Status'}<b>All</b></span>
            </div>
            <div style={{ marginTop: 12, border: '1px solid var(--sb-border)', borderRadius: 4 }}>
              <div className="sb-row is-head" style={{ gridTemplateColumns: cols }}>
                {(narrow ? ['Message Subject', 'Recommendation'] : ['Message Subject', 'ASA Verdict', 'Started By', 'Started', 'Report Status', 'Recommendation Status']).map(h => <span key={h}>{h}</span>)}
              </div>
              <Expand open={step >= 1}>{row(jobs[0], 0, true)}</Expand>
              {jobs.slice(1).map((job, i) => row(job, i))}
            </div>
          </Page>
    </Camera>
  </SceneFrame>;
}
