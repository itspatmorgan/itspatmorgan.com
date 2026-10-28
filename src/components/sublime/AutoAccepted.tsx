import { useEffect, useRef, useState } from 'react';
import { NativeStage, DemoControls } from '../case-study/NativeStage';
import { useDemoLoop } from '../case-study/useDemoLoop';
import { HuntSummary, Icon, Page, Recommendation, Zoom, job } from './SublimeUI';
import { Accepted, JobHeading, TimelineItem } from './JobReview';

// The same job when automation is on (patrick/ade-workflow ade/ade-job-completed-auto-accepted): ADÉ accepted its own rule because the
// hunt's match cleared the threshold. The page scrolls from the outcome down to the hunt that justified it. Counts are the source's sample data.
const W = 940;
const timings = [1200, 2200, 4200];
const captions = ['A finished job', 'ADÉ auto-accepted and activated the rule', 'Because the rule’s hunt cleared the auto-accept threshold'];

/** The outcome, then the evidence for it. */
export default function AutoAccepted() {
  const loop = useDemoLoop(timings, timings.length - 1);
  const step = loop.step;
  const hunt = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  // Measured in source pixels once the outcome has opened, so the scroll lands the hunt just under the heading space.
  useEffect(() => {
    const root = page.current, target = hunt.current;
    if (!root || !target) return;
    const box = root.getBoundingClientRect();
    setOffset(Math.max(0, (target.getBoundingClientRect().top - box.top) / (box.width / root.offsetWidth || 1) - 220));
  }, [step]);
  return <figure className={`qb-demo ${loop.resetting ? 'qb-loop-reset' : ''}`} ref={loop.ref} aria-label="An ADÉ job page with automation on: ADÉ auto-accepted and activated the recommended rule. Further down, the hunt summary says the rule is a 93% match with 40 malicious matches and meets the threshold to auto-accept">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom width={W}>
          <Page crumbs={['Agents', 'ADÉ', job.subject]}>
            <div ref={page} className="sb-scroll" style={{ position: 'relative', display: 'grid', gap: 28, padding: '28px 40px', transform: step === 2 ? `translateY(${-offset}px)` : 'none' }}>
              <JobHeading />
              <div className="sb-timeline">
                <div className={`sb-collapse ${step >= 1 ? 'is-open' : ''}`} style={{ marginBottom: step >= 1 ? 0 : -24 }}><div><TimelineItem dot="success"><Accepted by="ADÉ" auto /></TimelineItem></div></div>
                <TimelineItem><Recommendation /></TimelineItem>
                <div ref={hunt}><TimelineItem><div className={`sb-mark ${step === 2 ? 'is-on' : ''}`} style={{ margin: -8, padding: 8 }}><HuntSummary autoAccepted /></div></TimelineItem></div>
                <TimelineItem>
                  <div style={{ display: 'grid', gap: 12 }}>
                    <p style={{ fontSize: 15, fontWeight: 600 }}>ADÉ worked for 17m</p>
                    <div className="sb-box sb-body" style={{ display: 'grid', gap: 8, padding: '16px 20px' }}><span className="sb-verdict">{Icon.sparkles}Collaborated with ASA Agent to generate a threat report</span><span className="sb-verdict">{Icon.bullseye}Validated recommendation with 1 hunt</span></div>
                  </div>
                </TimelineItem>
              </div>
            </div>
          </Page>
        </Zoom>
      </div>
    </NativeStage>
    <DemoControls loop={loop} title="the auto-accepted job" caption={captions[step]} />
  </figure>;
}
