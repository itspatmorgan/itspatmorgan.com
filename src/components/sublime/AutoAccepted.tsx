import { NativeStage } from '../case-study/NativeStage';
import { Accepted, HuntEntry, JobHeading, Page, Recommendation, TimelineItem, Triggered, Worked, Zoom, job } from './SublimeUI';
import { Camera, Pointer, SceneControls, focus, useScene, useTargets } from './scene';

// The same job when automation is on (patrick/ade-workflow ade/ade-job-completed-auto-accepted): ADÉ accepted its own rule because the
// hunt's match cleared the threshold. The scene ties the three together: the match in the recommendation, the hunt it came from and that
// hunt's results, then the outcome at the top of the timeline. Liberties taken: the match is repeated in the recommendation's header, and
// the outcome's green bar is a tint. Counts and results are the source's sample data.
const W = 940;
const H = 820 * W / 1020;
const timings = [1800, 1300, 900, 400, 1700, 1400, 4200];
const captions = [
  'An ADÉ job, with the rule’s hunt result beside the recommendation',
  'The 93% match comes from ADÉ’s hunt',
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
  const hunt = t.rect('hunt');
  // Hold on the recommendation, travel down to the hunt that backs it, then come back up for the outcome.
  const head = t.rect('rec-head');
  const view = step === 1 && head ? focus(head, 1.3, W, H, .5) : step >= 2 && step <= 5 && hunt ? { x: 0, y: Math.max(0, hunt.y - 150), s: 1 } : { x: 0, y: 0, s: 1 };
  const pointer = step === 2 || step === 3 ? { key: 'hunt-toggle', pressing: step === 3 } : null;
  return <figure className={`qb-demo ${scene.fade ? 'qb-loop-reset' : ''}`} ref={scene.ref} aria-label="An ADÉ job page with automation on: the recommendation shows a 93% match from a 14-day hunt; the hunt below it says the rule is a 93% match with 40 malicious matches, opens onto the matched messages, and meets the threshold to auto-accept; ADÉ then auto-accepted and activated the rule">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom key={scene.take} width={W}>
          <Camera view={view} cameraRef={t.ref} style={{ minHeight: 1900 }}>
            <Page crumbs={['Agents', 'ADÉ', job.subject]} style={{ display: 'grid', gap: 40, padding: '40px 40px 48px' }}>
              <JobHeading />
              <div className="sb-timeline">
                <TimelineItem open={step === 6} icon="check" tone="success"><Accepted by="ADÉ" auto /></TimelineItem>
                <TimelineItem icon="shield" tone={step === 6 ? undefined : 'active'}><Recommendation /></TimelineItem>
                <TimelineItem icon="hunt"><HuntEntry run={step >= 2} reduced={scene.reduced} open={step >= 4} meets={step >= 5} /></TimelineItem>
                <TimelineItem icon="clipboard"><Worked /></TimelineItem>
                <TimelineItem icon="play"><Triggered /></TimelineItem>
              </div>
            </Page>
            <Pointer at={pointer ? t.at(pointer.key) : null} visible={!!pointer} pressing={pointer?.pressing} scale={view.s} reduced={scene.reduced} />
          </Camera>
        </Zoom>
      </div>
    </NativeStage>
    <SceneControls scene={scene} title="the auto-accepted job" caption={captions[step]} />
  </figure>;
}
