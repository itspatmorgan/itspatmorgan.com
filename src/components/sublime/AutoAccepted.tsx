import { Accepted, HuntEntry, JobHeading, Page, Recommendation, TimelineItem, Triggered, Worked, job } from './SublimeUI';
import { Camera, SceneFrame, frame, onCard, useScene, useShot, useStage, useTargets } from '../case-study/scene';

// The same job when automation is on (patrick/ade-workflow ade/ade-job-completed-auto-accepted): ADÉ accepted its own rule because the
// hunt's match cleared the threshold. The scene reads it the way a reviewer would: the match in the recommendation, the hunt it came from
// and that hunt's results, then the outcome at the top of the timeline. No pointer: nothing here waits on a person. Liberties taken: the
// hunt's match is stated in the recommendation's header, and the outcome's green bar is a tint. Counts and results are the source's sample data.
const timings = [1600, 1700, 1900, 1500, 4000];
const captions = [
  'With automation on, the rule arrives with its hunt result',
  'The 99% match comes from ADÉ’s 14-day hunt',
  'The hunt lists the messages the rule matched',
  'The match meets the team’s threshold',
  'ADÉ accepts the rule and turns it on',
];

/** The evidence, then the outcome it earned. */
export default function AutoAccepted() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000 });
  const step = scene.step;
  const t = useTargets(step);
  const box = { ...stage.box, bottom: t.height };
  // At the page's own scale, scroll down to the hunt; the closed hunt sits near the page's end, so it comes only partway up. As its
  // results open the page grows, and the camera follows it to the top of the frame, the way a reader would scroll. Then back to the top.
  const shot = step === 1 ? 'hunt' : step === 2 || step === 3 ? 'results' : null;
  const view = useShot(shot, shot ? frame(t.rect('hunt'), shot === 'results' ? { ...box, bottom: 0 } : box, { scale: 1, pad: 24, y: 'start' }) : null);
  const accepted = step === 4;
  // A phone crops to what each step reads: the match in the recommendation, the hunt and its results, the outcome.
  const focus = onCard(t.rect(step === 0 ? 'rec-head' : step === 4 ? 'accepted' : 'hunt'), view);
  return <SceneFrame scene={scene} stage={stage} focus={focus} title="the auto-accepted job" label="An ADÉ job page with automation on: the recommendation shows a 99% match from a 14-day hunt; the hunt below it says the rule is a 99% match with 40 malicious matches, opens onto the matched messages, and meets the threshold to auto-accept; ADÉ then auto-accepted and activated the rule">
    <Camera view={view} width={stage.W} height={stage.box.height} cameraRef={t.ref} reduced={scene.reduced}>
      <Page crumbs={['Agents', 'ADÉ', job.subject]} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 36, padding: '36px 40px 48px' }}>
        <JobHeading />
        <div className="sb-timeline">
          <TimelineItem open={accepted} icon="check" tone="success"><div data-frame="accepted"><Accepted by="ADÉ" auto /></div></TimelineItem>
          <TimelineItem icon="shield" tone={accepted ? undefined : 'active'}><Recommendation actions={false} /></TimelineItem>
          <TimelineItem icon="hunt"><HuntEntry run={step >= 1} reduced={scene.reduced} open={step >= 2} meets={step >= 3} /></TimelineItem>
          <TimelineItem icon="clipboard"><Worked /></TimelineItem>
          <TimelineItem icon="play"><Triggered /></TimelineItem>
        </div>
      </Page>
    </Camera>
  </SceneFrame>;
}
