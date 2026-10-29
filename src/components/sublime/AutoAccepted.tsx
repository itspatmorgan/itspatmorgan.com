import { NativeStage } from '../case-study/NativeStage';
import { Accepted, HuntEntry, JobHeading, Page, Recommendation, TimelineItem, Triggered, Worked, Zoom, job } from './SublimeUI';
import { Camera, Pointer, SceneControls, frame, useScene, useShot, useTargets } from './scene';

// The same job when automation is on (patrick/ade-workflow ade/ade-job-completed-auto-accepted): ADÉ accepted its own rule because the
// hunt's match cleared the threshold. The scene ties the three together: the match in the recommendation, the hunt it came from and that
// hunt's results, then the outcome at the top of the timeline. Liberties taken: the hunt's match is stated in the recommendation's
// header, and the outcome's green bar is a tint. Counts and results are the source's sample data.
const W = 940;
const H = 820 * W / 1020;
const timings = [1600, 2000, 1200, 800, 350, 1700, 1500, 4200];
const captions = [
  'An ADÉ job, with the rule’s hunt result beside the recommendation',
  'The 93% match comes from ADÉ’s hunt',
  'The hunt below it',
  'The hunt below it',
  'Its results: the messages the rule matched',
  'Its results: the messages the rule matched',
  'The match meets the auto-accept threshold',
  'So ADÉ accepted and activated the rule itself',
];

/** The evidence, then the outcome it earned. */
export default function AutoAccepted() {
  const scene = useScene(timings);
  const step = scene.step;
  const t = useTargets(step);
  // Close in on the recommendation's header, where the match is stated; then, at full scale, travel down to the hunt that backs it and
  // hold while its results open; then come back to the top for the outcome. The pointer moves only once the camera has landed.
  const box = { width: W, height: H, bottom: t.height };
  // The closed hunt sits near the page's end, so the camera can only bring it partway up; as its results open the page grows, and the
  // camera follows it to the top of the frame, the way a reader would scroll.
  const shot = step === 1 ? 'head' : step >= 2 && step <= 4 ? 'hunt' : step === 5 || step === 6 ? 'results' : null;
  const view = useShot(shot, shot === 'head' ? frame(t.rect('rec-head'), box, { scale: 1.35, pad: 88, x: 'start' })
    : shot ? frame(t.rect('hunt'), shot === 'results' ? { ...box, bottom: 0 } : box, { scale: 1, pad: 28, y: 'start' }) : null);
  const pointer = step === 3 || step === 4 ? { key: 'hunt-toggle', pressing: step === 4 } : null;
  return <figure className={`qb-demo ${scene.fade ? 'qb-loop-reset' : ''}`} ref={scene.ref} aria-label="An ADÉ job page with automation on: the recommendation shows a 93% match from a 14-day hunt; the hunt below it says the rule is a 93% match with 40 malicious matches, opens onto the matched messages, and meets the threshold to auto-accept; ADÉ then auto-accepted and activated the rule">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom key={scene.take} width={W}>
          <Camera view={view} width={W} height={H} cameraRef={t.ref} reduced={scene.reduced}>
            <Page crumbs={['Agents', 'ADÉ', job.subject]} style={{ display: 'grid', gap: 40, padding: '40px 40px 48px' }}>
              <JobHeading />
              <div className="sb-timeline">
                <TimelineItem open={step === 7} icon="check" tone="success"><Accepted by="ADÉ" auto /></TimelineItem>
                <TimelineItem icon="shield" tone={step === 7 ? undefined : 'active'}><Recommendation /></TimelineItem>
                <TimelineItem icon="hunt"><HuntEntry run={step >= 2} reduced={scene.reduced} open={step >= 5} meets={step >= 6} /></TimelineItem>
                <TimelineItem icon="clipboard"><Worked /></TimelineItem>
                <TimelineItem icon="play"><Triggered /></TimelineItem>
              </div>
            </Page>
            <Pointer at={pointer ? t.at(pointer.key) : null} visible={!!pointer} pressing={pointer?.pressing} reduced={scene.reduced} />
          </Camera>
        </Zoom>
      </div>
    </NativeStage>
    <SceneControls scene={scene} title="the auto-accepted job" caption={captions[step]} />
  </figure>;
}
