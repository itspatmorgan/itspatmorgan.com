import { HuntEntry, JobHeading, Page, Recommendation, TimelineItem, TimelineTitle, Triggered, Worked, job } from './SublimeUI';
import { SceneFrame, useScene, useStage } from './scene';

// The result, as one job runs: the ADÉ job page (patrick/ade-workflow ade/ade-job-completed-review, AdeJobTimeline; the running state is
// InProgressTimelineItem). The timeline is newest first, so each step stacks a new entry on top and pushes the rest down: the trigger, then
// ADÉ at work, then the hunt, then the recommended rule, as the heading turns to how long the job took. Every entry is the full component.
// Liberties taken: the product doesn't stream entries in one by one like this, so the pacing is staged for the story; and the running
// entry sits where the worked entry lands, and becomes it when the job is done, rather than staying on top. The 48-minute run is
// illustrative (see `job`); the under-two-hour average in the slide's copy is the real figure.
const timings = [1800, 2000, 2800, 2400, 4600];
const captions = [
  '2:12 PM: a missed threat reaches ADÉ, and the job starts',
  'ADÉ works with ASA on a threat report and drafts a rule',
  'ADÉ hunts its rule across 14 days of mail',
  'ADÉ recommends the rule, ready to accept',
  'Completed in 48 minutes, from missed threat to a rule',
];

/** One ADÉ job, running to a recommended rule. */
export default function Coverage() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000 });
  const narrow = stage.narrow;
  const step = scene.reduced ? 4 : scene.step;
  const done = step >= 3;
  return <SceneFrame scene={scene} stage={stage} title="one ADÉ job" label="An ADÉ job page as the job runs: Patrick Morgan triggers ADÉ at 2:12 PM on a malicious payroll message; ADÉ works with ASA, then hunts its rule across 14 days, a 93% match with 40 malicious matches; the recommended rule lands on top, ready to accept, and the heading reads Completed in 48m">
    <Page crumbs={['Agents', 'ADÉ', job.subject]} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: narrow ? 24 : 36, padding: narrow ? '24px 16px 40px' : '36px 40px 48px' }}>
      <JobHeading status={done ? 'done' : 'running'} animate={!scene.reduced} />
      <div className="sb-timeline">
        <TimelineItem open={done} icon="shield" tone="active"><Recommendation actions={done} /></TimelineItem>
        <TimelineItem open={step >= 2} icon="hunt"><HuntEntry run={step >= 2} reduced={scene.reduced} /></TimelineItem>
        <TimelineItem open={step >= 1} icon={done ? 'clipboard' : 'spinner'} tone={done ? undefined : 'running'}>{done ? <Worked /> : <TimelineTitle>ADÉ job in progress</TimelineTitle>}</TimelineItem>
        <TimelineItem icon="play"><Triggered /></TimelineItem>
      </div>
    </Page>
  </SceneFrame>;
}
