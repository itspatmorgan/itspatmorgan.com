import { Accepted, HuntEntry, JobHeading, Page, Recommendation, TimelineItem, Triggered, Worked, job } from './SublimeUI';
import { Camera, HOME, Pointer, SceneFrame, onCard, useScene, useStage, useTargets } from '../case-study/scene';

// The ADÉ job page (patrick/ade-workflow ade/ade-job-completed-review, AdeJobTimeline and JobCompletedCard): ADÉ's recommended rule
// waits for review, and accepting it runs through the product's Accept Recommendation modal. Copy is the source's; dates are its sample data.
const timings = [1700, 800, 300, 1700, 300, 3200];
const captions = [
  'ADÉ recommends a rule, with the hunt that tested it',
  'A person accepts it and leaves a note for the team', 'A person accepts it and leaves a note for the team', 'A person accepts it and leaves a note for the team', 'A person accepts it and leaves a note for the team',
  'The rule is live, and the team can still edit it',
];

function AcceptModal({ open, pressed }: { open: boolean; pressed: boolean }) {
  return <div className={`sb-scrim ${open ? '' : 'is-out'}`}>
    <div className="sb-modal" data-frame="modal">
      <p style={{ padding: '16px 20px', fontSize: 16, fontWeight: 600, borderBottom: '1px solid var(--sb-border)' }}>Accept Recommendation</p>
      <div style={{ display: 'grid', gap: 20, padding: '20px' }} className="sb-body">
        <p>This will create the recommended detection rule and apply an Auto-Quarantine action. You’ll be able to edit the Rule at any time after it’s created.</p>
        <div style={{ display: 'grid', gap: 8 }}><span className="sb-label">Leave a comment (optional)</span><div className="sb-textarea">Comment</div></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 20px', borderTop: '1px solid var(--sb-border)' }}><span className="sb-btn is-secondary">Cancel</span><span className={`sb-btn ${pressed ? 'is-pressed' : ''}`} data-target="activate">Accept &amp; Activate Rule</span></div>
    </div>
  </div>;
}

/** Read ADÉ's rule, then accept it. */
export default function JobReview() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000 });
  const step = scene.step;
  const t = useTargets(step);
  const accepted = step === 5;
  const modal = step === 3 || step === 4;
  // The whole recommendation fits a laptop frame, so the camera stays put. A phone crops to the recommendation's header, then to its
  // buttons, the confirmation, and the accepted rule at the top of the timeline.
  const focus = step === 0 ? onCard(t.rect('rec-head'), HOME) : step < 3 ? onCard(t.rect('rec-head'), HOME, 'end') : modal ? onCard(t.rect('modal'), HOME, 'end') : onCard(t.rect('accepted'), HOME);
  const pointer = step === 1 || step === 2 ? { key: 'accept', pressing: step === 2 } : modal ? { key: 'activate', pressing: step === 4 } : null;
  return <SceneFrame scene={scene} stage={stage} focus={focus} title="the rule review" label="An ADÉ job page: the recommendation shows the rule's name, severity, description, labels, action and MQL. Accept opens a confirmation, then the rule is accepted and activated">
    <Camera view={HOME} width={stage.W} height={stage.box.height} cameraRef={t.ref} reduced={scene.reduced}>
      <Page crumbs={['Agents', 'ADÉ', job.subject]} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 36, padding: '36px 40px 48px' }}>
        <JobHeading />
        <div className="sb-timeline">
          <TimelineItem open={accepted} icon="check" tone="success"><div data-frame="accepted"><Accepted by="Patrick Morgan" /></div></TimelineItem>
          <TimelineItem icon="shield" tone={accepted ? undefined : 'active'}><div data-frame="rec"><Recommendation actions={!accepted} pressed={step === 2} /></div></TimelineItem>
          <TimelineItem icon="hunt"><HuntEntry /></TimelineItem>
          <TimelineItem icon="clipboard"><Worked /></TimelineItem>
          <TimelineItem icon="play"><Triggered /></TimelineItem>
        </div>
      </Page>
      <AcceptModal open={modal} pressed={step === 4} />
      <Pointer at={pointer ? t.at(pointer.key) : null} visible={!!pointer} pressing={pointer?.pressing} reduced={scene.reduced} />
    </Camera>
  </SceneFrame>;
}
