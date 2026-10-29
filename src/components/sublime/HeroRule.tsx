import { useEffect, useState } from 'react';
import { HuntEntry, JobHeading, Page, Recommendation, TimelineItem, Triggered, Worked, job } from './SublimeUI';
import { Camera, SceneFrame, frame, useScene, useShot, useStage, useTargets } from './scene';

// The hero: ADÉ's recommended rule on its job page (patrick/ade-workflow ade/ade-job-completed-review, JobCompletedCard), the one frame
// that carries the case study's argument. The MQL arrives a line at a time, as if from the agent, and then the rule waits for review.
// Copy is the source's; the hunt result in the header is the same liberty taken on the job slides.
const timings = [1700, 2000];
const captions = ['ADÉ writes a rule your team can read', 'ADÉ writes a rule your team can read'];
const RULE_LINES = 13;

/** The recommended rule, written and waiting for review. */
export default function HeroRule() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000, height: 720 });
  const t = useTargets(scene.step, stage.narrow);
  const [lines, setLines] = useState(0);
  const start = scene.reduced || scene.seen;
  useEffect(() => {
    if (scene.reduced) { setLines(RULE_LINES); return; }
    if (!start) return;
    setLines(0);
    let n = 0;
    const timer = window.setInterval(() => { n += 1; setLines(n); if (n >= RULE_LINES) window.clearInterval(timer); }, 85);
    return () => window.clearInterval(timer);
  }, [start, scene.reduced, scene.take]);
  // On a phone, open on the recommendation itself rather than the page heading above it.
  const view = useShot(stage.narrow ? 'rec' : null, stage.narrow ? frame(t.rect('rec'), { ...stage.box, bottom: t.height }, { scale: 1, pad: 16, y: 'start' }) : null);
  const narrow = stage.narrow;
  return <SceneFrame scene={scene} stage={stage} controls={false} title="the recommended rule" label="An ADÉ job page: ADÉ's recommended rule, a 93% match in a 14-day hunt with 40 malicious matches and 2 possible false positives, shows its name, severity, description, labels, action and the MQL it wrote, with Accept and Reject">
    <Camera view={view} width={stage.W} height={stage.box.height} cameraRef={t.ref} reduced={scene.reduced}>
      <Page crumbs={['Agents', 'ADÉ', job.subject]} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: narrow ? 24 : 36, padding: narrow ? '24px 16px 40px' : '36px 40px 48px' }}>
        <JobHeading />
        {/* The rest of the job's timeline runs on below the fold, so the recommendation reads as one entry on it. */}
        <div className="sb-timeline">
          <TimelineItem icon="shield" tone="active"><div data-frame="rec"><Recommendation actions={scene.step >= 1 || scene.reduced} codeLines={lines} /></div></TimelineItem>
          <TimelineItem icon="hunt"><HuntEntry /></TimelineItem>
          <TimelineItem icon="clipboard"><Worked /></TimelineItem>
          <TimelineItem icon="play"><Triggered /></TimelineItem>
        </div>
      </Page>
    </Camera>
  </SceneFrame>;
}
