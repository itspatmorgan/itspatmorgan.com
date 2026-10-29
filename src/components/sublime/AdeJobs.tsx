import { motion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { FilterHorizontalIcon } from '@hugeicons/core-free-icons';
import { ART, CheckCircle, Icon, Page, StatusPill, VerdictLabel, type Status } from './SublimeUI';
import { Camera, CountUp, SceneFrame, frame, useScene, useShot, useStage, useTargets } from './scene';

// The ADÉ page with data (patrick/mttc ade-states/active): the agent header and its jobs, most of them started and accepted by ADÉ.
// Rows are sample data from the prototypes' job lists; one of the visible rows was started by a person, so the list shows people start
// jobs too, not only ADÉ. The Performance tiles are neutral sample values for one team's 30 days, sized to
// agree with the stated outcome (under 2 hours on average): they are placeholders, not Sublime's figures.
// The scene holds still: the slide is about the metric, and the auto-accept moment belongs to the evidence slide. The page settles, and
// on a phone the camera then moves down to the jobs, keeping the subject and the recommendation status, the two columns a team watches.
const timings = [1300, 2400];
const captions = ['ADÉ’s page: the time to cover a missed threat, and the jobs behind it', 'ADÉ’s page: the time to cover a missed threat, and the jobs behind it'];
const tiles = [
  { to: 1.6, format: (n: number) => `${n.toFixed(1)} hrs`, label: 'Time to Coverage' },
  { to: 240, format: (n: number) => `${Math.round(n)}`, label: 'Hours Saved' },
  { to: 1.2, format: (n: number) => `${n.toFixed(1)}k`, label: 'Attacks Blocked' },
];
const jobs: { subject: string; verdict: 'malicious' | 'spam' | 'graymail'; by: string; started: string; report: 'Completed' | 'In Progress'; status: Status | null }[] = [
  { subject: 'Invoice payment confirmation required today', verdict: 'malicious', by: 'ADÉ', started: '9h ago', report: 'In Progress', status: null },
  { subject: 'Benefits enrollment form from rare sender', verdict: 'graymail', by: 'ADÉ', started: '18h ago', report: 'Completed', status: 'auto' },
  { subject: 'DocuSign: updated employee handbook signature request', verdict: 'spam', by: 'AJ Williams', started: '1d ago', report: 'Completed', status: 'accepted' },
  { subject: 'Action required: payroll profile verification', verdict: 'malicious', by: 'ADÉ', started: '1d ago', report: 'Completed', status: 'review' },
  { subject: 'Calendar invite with external benefits link', verdict: 'spam', by: 'AJ Williams', started: '1d ago', report: 'Completed', status: 'rejected' },
  { subject: 'Urgent wire transfer details for review', verdict: 'malicious', by: 'ADÉ', started: '2d ago', report: 'Completed', status: 'auto' },
  { subject: 'Shared voicemail transcript is ready', verdict: 'graymail', by: 'Fatima Al-Sayed', started: '12d ago', report: 'Completed', status: 'accepted' },
  { subject: 'Payroll QR credential harvest report', verdict: 'malicious', by: 'ADÉ', started: '15d ago', report: 'Completed', status: 'auto' },
];
// Each column fits its widest content (header or value) with a little air; the subject takes what is left, so fewer subjects are cut.
const wideCols = 'minmax(0, 1fr) 96px 112px 64px 108px 144px';
const narrowCols = 'minmax(0, 1fr) 132px';

/** The agent's work, to monitor and steer. */
export default function AdeJobs() {
  const scene = useScene(timings, captions, { loop: false });
  const stage = useStage({ wide: 1000 });
  const narrow = stage.narrow;
  const cols = narrow ? narrowCols : wideCols;
  const step = scene.step;
  // On a phone the jobs sit below the fold: scroll to them once the page has settled.
  const t = useTargets(step, narrow);
  const shot = narrow && step >= 1 ? 'jobs' : null;
  const view = useShot(shot, shot ? frame(t.rect('jobs'), { ...stage.box, bottom: t.height }, { scale: 1, pad: 16, y: 'start' }) : null);
  const shown = scene.reduced || scene.seen;
  const row = (job: typeof jobs[number], i: number) => {
    return <motion.div key={job.subject} className="sb-row" style={{ gridTemplateColumns: cols }}
      initial={scene.reduced ? false : { opacity: 0, y: 6 }} animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ delay: .25 + i * .06, duration: .4, ease: [.23, 1, .32, 1] }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.subject}</span>
      {!narrow && <>
      <VerdictLabel verdict={job.verdict} />
      <span>{job.by}</span>
      <span>{job.started}</span>
      <span className="sb-verdict">{job.report === 'Completed' ? <CheckCircle size={13} color="var(--sb-button)" /> : <span className="sb-spin" style={{ display: 'inline-flex' }}>{Icon.progress}</span>}{job.report}</span>
      </>}
      <span>{job.status ? <StatusPill status={job.status} /> : '—'}</span>
    </motion.div>;
  };
  return <SceneFrame scene={scene} stage={stage} title="the ADÉ page" label="The ADÉ page: Performance shows 1.6 hrs Time to Coverage, 240 Hours Saved and 1.2k Attacks Blocked; below it, the jobs list shows a job in progress and jobs whose rules were auto-accepted, accepted, rejected or are waiting for review">
    <Camera view={view} width={stage.W} height={stage.box.height} cameraRef={t.ref} reduced={scene.reduced}>
          <Page crumbs={['Agents', 'ADÉ']} style={{ padding: narrow ? '20px 16px 0' : '28px 32px 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: narrow ? 14 : 20 }}>
              <span style={{ display: 'grid', placeItems: 'center', flexShrink: 0, width: narrow ? 52 : 64, height: narrow ? 52 : 64, border: '1px solid var(--sb-border)', borderRadius: 4 }}><img src={ART.ade} alt="" draggable={false} className="sb-art" style={{ width: narrow ? 36 : 44 }} /></span>
              <div style={{ flex: 1, paddingTop: narrow ? 0 : 6 }}>
                <p className="sb-h">{narrow ? 'ADÉ' : 'ADÉ (Autonomous Detection Engineer)'}</p>
                <p className="sb-body" style={{ fontWeight: 500, marginTop: 4 }}>Creates detections tailored to your environment.</p>
              </div>
              {!narrow && <span className="sb-btn is-secondary">Go to Settings</span>}
            </div>
            <p style={{ marginTop: 28, fontSize: 14, fontWeight: 600 }}>Performance <span className="sb-label" style={{ fontWeight: 400, marginLeft: 4 }}>(Last 30 days)</span></p>
            <div style={{ display: 'flex', marginTop: 10 }}>
              {tiles.map((tile, i) => <div key={tile.label} className="sb-tile" style={{ marginLeft: i ? -1 : 0, ...(narrow ? { width: 'auto', flex: 1, padding: '12px 12px' } : {}) }}><p><CountUp to={tile.to} run={shown} duration={1.3} format={tile.format} reduced={scene.reduced} /></p><span className="sb-label" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{tile.label}</span></div>)}
            </div>
            {/* Liberty taken: the source's purple "Recommendation Status | All" chip becomes a filter dropdown that says what it shows, with a
                filter icon, on the Jobs heading's line rather than below it. */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 28 }} data-frame="jobs">
              <p style={{ fontSize: 14, fontWeight: 600 }}>Jobs</p>
              <span className="sb-select sb-jobs-filter"><HugeiconsIcon icon={FilterHorizontalIcon} size={14} strokeWidth={1.8} /><span>{narrow ? 'All statuses' : 'All recommendation statuses'}</span>{Icon.chevron('down')}</span>
            </div>
            <div style={{ marginTop: 12, border: '1px solid var(--sb-border)', borderRadius: 4 }}>
              <div className="sb-row is-head" style={{ gridTemplateColumns: cols }}>
                {(narrow ? ['Message Subject', 'Recommendation'] : ['Message Subject', 'ASA Verdict', 'Started By', 'Started', 'Report Status', 'Recommendation Status']).map(h => <span key={h}>{h}</span>)}
              </div>
              {jobs.map((job, i) => row(job, i))}
            </div>
          </Page>
    </Camera>
  </SceneFrame>;
}
