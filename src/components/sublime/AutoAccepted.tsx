import { NativeStage } from '../case-study/NativeStage';
import { Accepted, Icon, JobHeading, Page, Recommendation, TimelineItem, VerdictIcon, Zoom, job } from './SublimeUI';
import { CountUp, Expand as Open, SceneControls, useScene } from './scene';

// The same job when automation is on (patrick/ade-workflow ade/ade-job-completed-auto-accepted): ADÉ accepted its own rule because the
// hunt's match cleared the threshold. The scene plays cause, then effect: the hunt's counts land, the threshold line follows, and the
// accepted entry opens at the top of the timeline. Liberties taken: the hunt sits directly under the outcome so the two read together, and the outcome's green bar is a tint.
// Counts are the source's sample data.
const W = 940;
const timings = [2200, 1500, 4200];
const captions = ['ADÉ hunted with its rule: a 93% match', 'That meets the auto-accept threshold', 'ADÉ auto-accepted and activated the rule'];

/** The hunt summary (HuntSummaryContent), with its counts landing as the scene reaches them. */
function Hunt({ run, meets, reduced }: { run: boolean; meets: boolean; reduced: boolean }) {
  const n = (to: number) => <CountUp to={to} run={run} reduced={reduced} />;
  return <div style={{ display: 'grid', gap: 12 }}>
    <p style={{ fontSize: 15, fontWeight: 600 }}>ADÉ hunted across 14 days and found {n(43)} message groups ({n(58)} total messages)</p>
    <div className="sb-box" style={{ padding: '16px 20px', display: 'grid', gap: 12 }}>
      <span className="sb-verdict">{Icon.bullseye}<span>Recommended Rule is a <b style={{ fontWeight: 600 }}><CountUp to={93} run={run} reduced={reduced} format={v => `${Math.round(v)}%`} /></b> match with {n(40)} malicious matches and may introduce {n(2)} false positives (Benign).</span></span>
      <Open open={meets}><span className="sb-meets">{Icon.sparkles}It meets the threshold to auto-accept the Rule.</span></Open>
      <div style={{ display: 'flex', gap: 20 }}><span className="sb-verdict"><VerdictIcon verdict="malicious" />{n(40)} Malicious</span><span className="sb-verdict"><VerdictIcon verdict="spam" />{n(1)} Spam</span><span className="sb-verdict"><VerdictIcon verdict="benign" />{n(2)} Benign</span></div>
    </div>
  </div>;
}

/** The evidence, then the outcome it earned. */
export default function AutoAccepted() {
  const scene = useScene(timings);
  const step = scene.step;
  return <figure className={`qb-demo ${scene.fade ? 'qb-loop-reset' : ''}`} ref={scene.ref} aria-label="An ADÉ job page with automation on: the hunt summary says the rule is a 93% match with 40 malicious matches and meets the threshold to auto-accept, and ADÉ auto-accepted and activated the recommended rule">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom key={scene.take} width={W}>
          <div style={{ minHeight: 1100 }}>
            <Page crumbs={['Agents', 'ADÉ', job.subject]} style={{ display: 'grid', gap: 28, padding: '28px 40px' }}>
              <JobHeading />
              <div className="sb-timeline">
                <TimelineItem open={step === 2} dot="success"><Accepted by="ADÉ" auto /></TimelineItem>
                <TimelineItem dot={step === 2 ? undefined : 'active'}><Hunt run={scene.seen} meets={step >= 1} reduced={scene.reduced} /></TimelineItem>
                <TimelineItem><Recommendation /></TimelineItem>
              </div>
            </Page>
          </div>
        </Zoom>
      </div>
    </NativeStage>
    <SceneControls scene={scene} title="the auto-accepted job" caption={captions[step]} />
  </figure>;
}
