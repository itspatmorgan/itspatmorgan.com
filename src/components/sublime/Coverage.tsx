import { HuntEntry, JobHeading, Page, Recommendation, TimelineItem, TimelineTitle, Triggered, Worked, job } from './SublimeUI';
import { SceneFrame, useScene, useStage } from './scene';

// The result, as one job runs: the ADÉ job page (patrick/ade-workflow ade/ade-job-completed-review, AdeJobTimeline; the running state is
// InProgressTimelineItem). The timeline is newest first, and each step adds one entry, which opens in place: the hunt lands under the running
// entry, the job finishes, the running entry gives way and the worked entry says how long it took, and then the recommendation arrives
// on top. Entries already shown keep their size.
// Liberties taken: the product doesn't stream entries in one by one like this, so the pacing is staged for the story. The running entry is
// its title line alone, without the source's large working panel; the trigger and worked entries show their title lines, and the
// recommendation only its header, so the whole run from trigger to result stays in one frame. The 48-minute run is illustrative (see
// `job`); the under-two-hour average in the slide's copy is the real figure.
const timings = [2000, 3000, 2000, 5200];
const captions = [
  '2:12 PM: a missed threat reaches ADÉ, and the job starts',
  'ADÉ works with ASA, drafts a rule and hunts it across 14 days of mail',
  'Done 48 minutes after it started',
  'A recommended rule lands, ready to accept',
];

/** One ADÉ job, running to a recommended rule. */
export default function Coverage() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000 });
  const narrow = stage.narrow;
  const step = scene.reduced ? 3 : scene.step;
  const done = step >= 2;
  return <SceneFrame scene={scene} stage={stage} title="one ADÉ job" label="An ADÉ job page as the job runs: Patrick Morgan triggers ADÉ at 2:12 PM on a malicious payroll message; ADÉ hunts its rule across 14 days, a 93% match with 40 malicious matches; ADÉ worked for 48 minutes, and the recommended rule waits for review; the heading reads Completed in 48m">
    <Page crumbs={['Agents', 'ADÉ', job.subject]} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: narrow ? 24 : 36, padding: narrow ? '24px 16px 40px' : '36px 40px 48px' }}>
      <JobHeading status={done ? 'done' : 'running'} />
      <div className="sb-timeline">
        <TimelineItem open={step === 3} icon="shield" tone="active"><Recommendation actions={step === 3} compact /></TimelineItem>
        <TimelineItem open={!done} icon="spinner" tone="running"><TimelineTitle>ADÉ job in progress</TimelineTitle></TimelineItem>
        <TimelineItem open={step >= 1} icon="hunt"><HuntEntry run={step >= 1} reduced={scene.reduced} /></TimelineItem>
        <TimelineItem open={done} icon="clipboard"><Worked brief /></TimelineItem>
        <TimelineItem icon="play"><Triggered brief /></TimelineItem>
      </div>
    </Page>
  </SceneFrame>;
}
