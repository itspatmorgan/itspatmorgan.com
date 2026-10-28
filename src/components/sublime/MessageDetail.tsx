import { NativeStage } from '../case-study/NativeStage';
import { ART, Icon, JobHeading, Page, TimelineItem, TimelineTitle, Triggered, VerdictIcon, VerdictPanel, Zoom, job } from './SublimeUI';
import { Camera, Expand, Pointer, SceneControls, Screens, Typing, focus, useScene, useTargets } from './scene';

// The message detail page (patrick/ade-workflow user-reports, MessageDetailView and AdeStatusCard): ASA's verdict on a message no rule caught.
// `gap` is the page before ADÉ: a malicious verdict over an empty Matched Detection Rules section, and the way to coverage running through
// the Rule Editor. `handoff` adds ADÉ: Trigger ADÉ, then the job page while ADÉ works (InProgressTimelineItem over TriggeredTimelineItem).
// Liberties taken for the case study: ASA's red banner is a tinted head; Matched Detection Rules shows its empty state (the product hides
// the section when nothing matched); the ADÉ card leads the sidebar; the Rule Editor is redrawn; and the in-progress job names the step
// ADÉ is on (the job's agent messages in _ade-data.js). Message and job copy are the prototype's sample data.
type Variant = 'gap' | 'handoff';
const W = 1000;
const H = 820 * W / 1020;
const timings: Record<Variant, number[]> = {
  gap: [1400, 2800, 1100, 350, 5200],
  handoff: [1200, 1300, 350, 1500, 350, 1700, 1700, 3400],
};
const captions: Record<Variant, string[]> = {
  gap: ['ASA calls the message malicious', 'Malicious, and no Detection Rule matched it', 'The way to a rule: send the message to the Rule Editor', 'The way to a rule: send the message to the Rule Editor', 'And write the rule by hand, then test it'],
  handoff: ['ADÉ leads the sidebar', 'Trigger ADÉ', 'Trigger ADÉ', 'The job starts; open it', 'The job starts; open it', 'ADÉ works on the job page', 'ADÉ works on the job page', 'ADÉ works on the job page'],
};
const classifications = ['malicious', 'spam', 'graymail', 'benign'] as const;
const other = ['Send EML to Rule Editor', 'Send EML to Sublime', 'Send to ThreadSafe', 'Share feedback'];
const working = ['Collaborating with ASA on the threat report', 'Drafting the rule', 'Validating the rule with a 14-day hunt'];

/** The ADÉ card: ready to trigger, then running with the way into its job. */
function AdeCard({ running, pressed, viewPressed }: { running: boolean; pressed: boolean; viewPressed: boolean }) {
  return <div className={`sb-ade-card ${running ? 'is-running' : ''}`} data-frame="ade"><div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--sb-border)' }}>
      <span className="sb-ade-mark"><img src={ART.ade} alt="" draggable={false} className="sb-art" /></span>
      <span style={{ flex: 1, minWidth: 0 }}><b style={{ display: 'block', fontSize: 14, fontWeight: 600, lineHeight: '18px' }}>ADÉ</b><span className="sb-label">Autonomous Detection Engineer</span></span>
      {Icon.info}
    </div>
    <div style={{ padding: 16 }}>
      <Expand open={!running}>
        <div style={{ display: 'grid', gap: 14, paddingBottom: 2 }}>
          <span className="sb-body">No Detection Rule matches this message. ADÉ can write one and test it against your mail.</span>
          <span className={`sb-btn ${pressed ? 'is-pressed' : ''}`} data-target="trigger" style={{ justifyContent: 'center' }}>Trigger ADÉ</span>
        </div>
      </Expand>
      <Expand open={running}>
        <div style={{ display: 'grid', gap: 14, paddingBottom: 2 }}>
          <span className="sb-verdict sb-body" style={{ fontWeight: 500 }}>{Icon.progress}In Progress <span className="sb-label" style={{ marginLeft: 'auto' }}>Started by Patrick Morgan</span></span>
          <span className={`sb-btn is-secondary ${viewPressed ? 'is-pressed' : ''}`} data-target="view-job" style={{ justifyContent: 'center', gap: 6 }}>View ADÉ job{Icon.chevron()}</span>
        </div>
      </Expand>
    </div>
  </div></div>;
}

/** The job page while ADÉ works. */
function JobInProgress({ at, reduced }: { at: number; reduced: boolean }) {
  return <Page crumbs={['Agents', 'ADÉ', job.subject]} style={{ display: 'grid', gap: 40, padding: '40px 40px 48px' }}>
    <JobHeading status="running" />
    <div className="sb-timeline">
      <TimelineItem icon="spinner" tone="running">
        <div style={{ display: 'grid', gap: 16 }}>
          <TimelineTitle>ADÉ job in progress</TimelineTitle>
          <div className="sb-working"><div>
            <img src="/images/work/sublime/ade_octahedron.png" alt="" draggable={false} className="sb-octa sb-art" />
            <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
              <span className="sb-working-text">ADÉ is working...</span>
              <Screens id={reduced ? 'still' : String(at)}><span className="sb-label">{working[at]}</span></Screens>
            </div>
            <span className="sb-btn is-secondary">Cancel</span>
          </div></div>
        </div>
      </TimelineItem>
      <TimelineItem icon="play"><Triggered when="Jul 3, 2026, 2:12 PM" /></TimelineItem>
    </div>
  </Page>;
}

/** The Rule Editor, redrawn: the message attached and a rule started by hand. */
function RuleEditor({ run, reduced }: { run: boolean; reduced: boolean }) {
  return <Page crumbs={['Detection Rules', 'Rule Editor']}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
      <span><b style={{ fontSize: 18, fontWeight: 600 }}>Untitled rule</b><span className="sb-label" style={{ marginLeft: 10 }}>Draft</span></span>
      <span style={{ display: 'flex', gap: 8 }}><span className="sb-btn is-secondary">Test Rule</span><span className="sb-btn" style={{ opacity: .45 }}>Save Rule</span></span>
    </div>
    <div className="sb-editor">
      <div className="sb-editor-code">
        <span className="n">1</span><span><Typing text="type.inbound" run={run} reduced={reduced} /></span>
        <span className="n">2</span><span><span className="k"><Typing text="and " run={run} every={90} reduced={reduced} /></span><span className="sb-caret" /></span>
        {Array.from({ length: 26 }, (_, i) => <span key={i} style={{ display: 'contents' }}><span className="n">{i + 3}</span><span /></span>)}
      </div>
      <div className="sb-editor-side">
        <b className="sb-section-h">Test Messages</b>
        <span className="sb-eml" style={{ minWidth: 0 }}>{Icon.external}<span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.subject}.eml</span><VerdictIcon verdict="malicious" size={14} /></span>
        <div className="sb-empty" style={{ height: 180, fontSize: 13 }}>Test the rule to see if it matches.</div>
      </div>
    </div>
  </Page>;
}

/** A message ASA called malicious that no rule caught, before ADÉ and with it. */
export default function MessageDetail({ variant }: { variant: Variant }) {
  const scene = useScene(timings[variant]);
  const step = scene.step;
  const t = useTargets(step);
  const gap = variant === 'gap';
  const editor = gap && step === 4;
  const jobPage = !gap && step >= 5;

  let view = { x: 0, y: 0, s: 1 };
  let pointer: { key: string; pressing?: boolean } | null = null;
  if (gap) {
    if (step === 1) view = focus(t.rect('analysis'), 1.22, W, H, .5);
    if (step === 2 || step === 3) pointer = { key: 'editor', pressing: step === 3 };
  } else if (!jobPage) {
    if (step >= 1) view = focus(t.rect('ade'), 1.6, W, H, .6);
    if (step === 1 || step === 2) pointer = { key: 'trigger', pressing: step === 2 };
    if (step === 3 || step === 4) pointer = { key: 'view-job', pressing: step === 4 };
  }

  const verdict = <VerdictPanel>
    <div style={{ display: 'grid', gap: 18, padding: '18px 24px 22px' }}>
      <div style={{ display: 'grid', gap: 6 }}>
        <span className="sb-label">ASA Executive Summary</span>
        <p className="sb-body" style={{ lineHeight: '22px' }}>This message impersonates Payroll Operations and urges the recipient to verify their payroll profile through an unfamiliar domain. The sender fails DMARC, does not align with the organization’s trusted HR infrastructure, and uses credential-harvesting language under the pretext of an upcoming pay cycle.</p>
      </div>
      <div className="sb-body" style={{ display: 'grid', gridTemplateColumns: '84px 1fr', rowGap: 6 }}>
        <span className="sb-label" style={{ lineHeight: '20px' }}>Subject</span><span>{job.subject}</span>
        <span className="sb-label" style={{ lineHeight: '20px' }}>Sender</span><span>Payroll Operations &lt;payroll-verify@employee-benefits.co&gt;</span>
        <span className="sb-label" style={{ lineHeight: '20px' }}>Recipient</span><span>alex.morgan@acme.com</span>
      </div>
    </div>
  </VerdictPanel>;

  const matched = <section style={{ display: 'grid', gap: 12 }}>
    <p className="sb-section-h">Message Group Analysis</p>
    <div className={`sb-cells sb-mark ${gap && step === 1 ? 'is-on' : ''}`}>
      <div className="sb-cell-head">Matched Detection Rules (0)</div>
      <div className="sb-verdict sb-body" style={{ justifyContent: 'center', gap: 8, padding: '22px 16px', color: 'var(--sb-weak)' }}>{Icon.bullseye}No Detection Rules matched this message group.</div>
    </div>
  </section>;

  const content = <section style={{ display: 'grid', gap: 12 }}>
    <p className="sb-section-h">Message Content</p>
    <div className="sb-cells" style={{ padding: '16px 20px', display: 'grid', gap: 14 }}>
      <div className="sb-tabs-row"><b>User View</b><span>Text View</span><span>HTML View</span><span>EML View</span></div>
      <div className="sb-mail">
        <p className="sb-mail-caution"><b>CAUTION:</b> This message originated outside of your organization.</p>
        <p className="sb-label">From: Payroll Operations &lt;payroll-verify@employee-benefits.co&gt;</p>
        <p style={{ fontSize: 22, lineHeight: '28px', margin: '10px 0 6px' }}>Action required</p>
        <p className="sb-body">Your payroll profile requires verification before the next pay cycle. Review and confirm your direct deposit details to avoid a delay in payment.</p>
        <span className="sb-mail-qr" aria-hidden="true" />
      </div>
    </div>
  </section>;

  const side = <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
    {!gap && <AdeCard running={step >= 3} pressed={step === 2} viewPressed={step === 4} />}
    <div className="sb-cells">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12 }}><span className="sb-body" style={{ fontWeight: 600 }}>Review Status</span><span className="sb-pill is-outline" style={{ height: 24, fontSize: 12 }}>⚠ Unreviewed</span></div>
      <div style={{ padding: '0 12px 12px' }}>
        <div style={{ borderRadius: 4, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px var(--sb-button)' }}>
          <div className="sb-list-row" style={{ background: 'var(--sb-button)', color: '#fff', fontWeight: 500 }}>Select Classification{Icon.info}</div>
          {classifications.map(v => <div key={v} className="sb-list-row" style={{ borderTop: '1px solid var(--sb-border)' }}><span className="sb-verdict"><VerdictIcon verdict={v} />{v[0].toUpperCase() + v.slice(1)}</span>{Icon.chevron()}</div>)}
        </div>
      </div>
    </div>
    <div className="sb-cells">
      <div className="sb-cell-head">Other</div>
      {other.map((o, i) => <div key={o} className={`sb-list-row ${gap && i === 0 && step >= 2 ? 'is-hover' : ''} ${gap && i === 0 && step === 3 ? 'is-pressed' : ''}`} data-target={i === 0 ? 'editor' : undefined} style={{ height: 38 }}>{o}{Icon.chevron()}</div>)}
    </div>
  </div>;

  const message = <Page crumbs={['User Reports', job.subject]} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 312px', gap: 28, padding: '24px 32px 40px' }}>
    <div style={{ display: 'grid', gap: 24, alignContent: 'start' }}><div data-frame="analysis" style={{ display: 'grid', gap: 24 }}>{verdict}{matched}</div>{content}</div>
    {side}
  </Page>;

  return <figure className={`qb-demo ${scene.fade ? 'qb-loop-reset' : ''}`} ref={scene.ref} aria-label={gap
    ? 'The message detail page: ASA rates a payroll phishing message malicious and Matched Detection Rules is empty; Send EML to Rule Editor opens the Rule Editor, where the rule is written by hand'
    : 'The same page with ADÉ at the top of the sidebar: Trigger ADÉ starts a job, and View ADÉ job opens the job page, where ADÉ is working'}>
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom key={scene.take} width={W}>
          <Camera view={view} cameraRef={t.ref}>
            <Screens id={editor ? 'editor' : jobPage ? 'job' : 'message'}>
              {editor ? <RuleEditor run={editor} reduced={scene.reduced} /> : jobPage ? <JobInProgress at={Math.min(step - 5, 2)} reduced={scene.reduced} /> : message}
            </Screens>
            <Pointer at={pointer ? t.at(pointer.key) : null} visible={!!pointer} pressing={pointer?.pressing} scale={view.s} reduced={scene.reduced} />
          </Camera>
        </Zoom>
      </div>
    </NativeStage>
    <SceneControls scene={scene} title={gap ? 'the missed threat' : 'the handoff to ADÉ'} caption={captions[variant][step]} />
  </figure>;
}
