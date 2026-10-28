import { NativeStage } from '../case-study/NativeStage';
import { Accepted, HuntEntry, JobHeading, Page, Recommendation, TimelineItem, Triggered, Worked, Zoom, job } from './SublimeUI';
import { Camera, Pointer, SceneControls, focus, useScene, useTargets } from './scene';

// The ADÉ job page (patrick/ade-workflow ade/ade-job-completed-review, AdeJobTimeline and JobCompletedCard): ADÉ's recommended rule
// waits for review, and accepting it runs through the product's Accept Recommendation modal. Copy is the source's; dates are its sample data.
const W = 940;
const H = 820 * W / 1020;
const timings = [2400, 1000, 350, 2100, 350, 3800];
const captions = ['ADÉ’s recommendation: a rule your team can read, with the hunt result that backs it', 'Accept', 'Accept', 'Accept and activate', 'Accept and activate', 'The rule is live, and stays editable'];

/** Read ADÉ's rule, then accept it. */
export default function JobReview() {
  const scene = useScene(timings);
  const step = scene.step;
  const t = useTargets(step);
  const accepted = step === 5;
  const modal = step === 3 || step === 4;
  // Open on the rule itself, scaled so the whole card width stays in frame, then step back to the page for the decision.
  const rule = t.rect('rule');
  const view = step === 0 && rule ? { ...focus(rule, W / (rule.w + 32), W, H), y: Math.max(0, rule.y - 20) } : { x: 0, y: 0, s: 1 };
  const pointer = step === 1 || step === 2 ? { key: 'accept', pressing: step === 2 } : modal ? { key: 'activate', pressing: step === 4 } : null;
  return <figure className={`qb-demo ${scene.fade ? 'qb-loop-reset' : ''}`} ref={scene.ref} aria-label="An ADÉ job page: the recommendation shows the rule's name, severity, description, labels, action and MQL. Accept opens a confirmation, then the rule is accepted and activated">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom key={scene.take} width={W}>
          <Camera view={view} cameraRef={t.ref} style={{ minHeight: 1600 }}>
            <Page crumbs={['Agents', 'ADÉ', job.subject]} style={{ display: 'grid', gap: 40, padding: '40px 40px 48px' }}>
              <JobHeading />
              <div className="sb-timeline">
                <TimelineItem open={accepted} icon="check" tone="success"><Accepted by="Patrick Morgan" /></TimelineItem>
                <TimelineItem icon="shield" tone={accepted ? undefined : 'active'}><div data-frame="rule"><Recommendation actions={!accepted} pressed={step === 2} /></div></TimelineItem>
                <TimelineItem icon="hunt"><HuntEntry /></TimelineItem>
                <TimelineItem icon="clipboard"><Worked /></TimelineItem>
                <TimelineItem icon="play"><Triggered /></TimelineItem>
              </div>
            </Page>
            <div className={`sb-scrim ${modal ? '' : 'is-out'}`}>
              <div className="sb-modal">
                <p style={{ padding: '16px 20px', fontSize: 16, fontWeight: 600, borderBottom: '1px solid var(--sb-border)' }}>Accept Recommendation</p>
                <div style={{ display: 'grid', gap: 20, padding: '20px' }} className="sb-body">
                  <p>This will create the recommended detection rule and apply an Auto-Quarantine action. You’ll be able to edit the Rule at any time after it’s created.</p>
                  <div style={{ display: 'grid', gap: 8 }}><span className="sb-label">Leave a comment (optional)</span><div className="sb-textarea">Comment</div></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 20px', borderTop: '1px solid var(--sb-border)' }}><span className="sb-btn is-secondary">Cancel</span><span className={`sb-btn ${step === 4 ? 'is-pressed' : ''}`} data-target="activate">Accept &amp; Activate Rule</span></div>
              </div>
            </div>
            <Pointer at={pointer ? t.at(pointer.key) : null} visible={!!pointer} pressing={pointer?.pressing} scale={view.s} reduced={scene.reduced} />
          </Camera>
        </Zoom>
      </div>
    </NativeStage>
    <SceneControls scene={scene} title="the rule review" caption={captions[step]} />
  </figure>;
}
