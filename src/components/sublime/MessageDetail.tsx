import { Icon, JobHeading, Page, TimelineItem, TimelineTitle, Triggered, VerdictIcon, VerdictPanel, job } from './SublimeUI';
import { useEffect, useState } from 'react';
import { Camera, Expand, Pointer, SceneFrame, Screens, Typing, frame, useNarrowLayout, useScene, useShot, useStage, useTargets } from './scene';

// The message detail page (patrick/ade-workflow user-reports, MessageDetailView and AdeStatusCard): ASA's verdict on a message no rule caught.
// `gap` is the page before ADÉ: a malicious verdict over an empty Matched Detection Rules section, and the way to coverage running through
// Send EML to Rule Editor into the Rule Editor. `handoff` adds ADÉ: Trigger ADÉ, then the job page while ADÉ works (InProgressTimelineItem
// over TriggeredTimelineItem).
// The sidebar keeps the source's order (MessageDetailSidebar): Review Status, Other, then the ADÉ card (AdeStatusCard), whose copy and
// states are the source's. Liberties taken for the case study: ASA's red banner is a tinted head; section headings sit flat on the page
// instead of in gray bars; Matched Detection Rules shows its empty state (the product hides the section when nothing matched); the
// Rule Editor is drawn for the story (the archive has no Rule Editor screen; the prototypes stop at its button), as a bare MQL editor
// with a rule begun by hand; and on phones the page stacks into one column. Message and job copy are the prototype's sample data.
type Variant = 'gap' | 'handoff';
const timings: Record<Variant, number[]> = {
  gap: [2400, 700, 800, 350, 4400],
  // The last step shows the working phrases once (four, 2 s each) and holds the last one before the scene restarts.
  handoff: [1200, 1000, 700, 300, 700, 700, 700, 300, 8600],
};
const captions: Record<Variant, string[]> = {
  gap: [
    'ASA marks the message malicious, and no rule caught it',
    'To cover it, someone opens the rule editor', 'To cover it, someone opens the rule editor', 'To cover it, someone opens the rule editor',
    'An engineer writes and tests the rule by hand',
  ],
  handoff: [
    'ADÉ waits on the same page as the verdict', 'ADÉ waits on the same page as the verdict',
    'One click starts ADÉ', 'One click starts ADÉ', 'One click starts ADÉ',
    'The job starts, with a link to its report', 'The job starts, with a link to its report', 'The job starts, with a link to its report',
    'The job page shows each step ADÉ takes',
  ],
};
const classifications = ['malicious', 'spam', 'graymail', 'benign'] as const;
// Liberty taken: the source's Other list (Send EML to Rule Editor, Send EML to Sublime, Send to ThreadSafe, Share feedback) is cut to the
// action the story needs and the last one.
const other = ['Send EML to Rule Editor', 'Share feedback'];

// While ADÉ works, the shimmering status cycles through what it is doing, in plain words for the steps the prototype's job shows
// (Interpret ASA findings, Identify generalizable attack traits, Draft detection hypothesis, Prepare validation hunt). Liberty taken:
// the product shows one fixed "ADÉ is working..."; the phrases are its own step titles, reworded. They run once, 2 s apart, and stop on
// the last; the scene's last step is timed to show them all and hold. Reduced motion keeps the first phrase.
const workingPhrases = ['ADÉ is working…', 'Reading ASA’s findings…', 'Drafting a detection rule…', 'Testing it on past email…'];
const PHRASE_MS = 2000;

/** The working status, one phrase at a time, each fading into the next, ending on the last. */
function WorkingText() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (i >= workingPhrases.length - 1) return;
    const timer = window.setTimeout(() => setI(i + 1), PHRASE_MS);
    return () => window.clearTimeout(timer);
  }, [i]);
  return <span className="sb-working-phrase" key={i}><span className="sb-working-text">{workingPhrases[i]}</span></span>;
}

/** AdeStatusCard: ready to trigger, starting, then the running job with the way into its report. */
function AdeCard({ phase, pressed, viewPressed }: { phase: 'ready' | 'starting' | 'running'; pressed: boolean; viewPressed: boolean }) {
  return <section className="sb-sec" data-frame="ade-side">
    <p className="sb-sec-h"><span>ADÉ (Autonomous Detection Engineer)</span></p>
    <div className={`sb-ade-card ${phase !== 'ready' ? 'is-running' : ''}`}><div style={{ padding: 20 }}>
      <Expand open={phase !== 'running'}>
        <div style={{ display: 'grid', gap: 16, paddingBottom: 2 }}>
          <span className="sb-body">ADÉ recommends new Detection Rules for malicious, spam, or graymail messages that do not match any Detection Rules.</span>
          <span className={`sb-btn ${pressed ? 'is-pressed' : ''}`} data-target="trigger" style={{ width: 'fit-content', opacity: phase === 'starting' ? .7 : 1 }}>{phase === 'starting' ? 'Starting ADÉ…' : 'One click starts ADÉ'}</span>
        </div>
      </Expand>
      <Expand open={phase === 'running'}>
        <div style={{ display: 'grid', gap: 16, paddingBottom: 2 }}>
          <span className="sb-body" style={{ display: 'grid', gap: 8 }}>
            <span className="sb-verdict">{Icon.progress}In Progress</span>
            <span className="sb-verdict">{Icon.stopwatch}Started on July 3, 2026 at 2:12 PM</span>
            <span className="sb-verdict">{Icon.user}Started by Patrick Morgan</span>
          </span>
          <span className={`sb-btn is-secondary ${viewPressed ? 'is-pressed' : ''}`} data-target="view-job" style={{ width: 'fit-content' }}>View Report</span>
        </div>
      </Expand>
    </div></div>
  </section>;
}

/** The job page while ADÉ works. */
function JobInProgress() {
  const narrow = useNarrowLayout();
  return <Page crumbs={['Agents', 'ADÉ', job.subject]} style={{ display: 'grid', gap: narrow ? 28 : 40, padding: narrow ? '28px 20px 40px' : '40px 40px 48px' }}>
    <JobHeading status="running" />
    <div className="sb-timeline">
      <TimelineItem icon="spinner" tone="running">
        <div style={{ display: 'grid', gap: 16 }}>
          <TimelineTitle>ADÉ job in progress</TimelineTitle>
          <div className="sb-working"><div>
            <WorkingText />
            <span className="sb-btn is-secondary">Cancel</span>
          </div></div>
        </div>
      </TimelineItem>
      <TimelineItem icon="play"><Triggered when="Jul 3, 2026, 2:12 PM" /></TimelineItem>
    </div>
  </Page>;
}

/** The Rule Editor, drawn for the story: a rule started by hand. */
function RuleEditor({ run, reduced }: { run: boolean; reduced: boolean }) {
  const narrow = useNarrowLayout();
  return <Page crumbs={['Detection Rules', 'Rule Editor']}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: narrow ? '14px 16px' : '16px 24px' }}>
      <span style={{ whiteSpace: 'nowrap' }}><b style={{ fontSize: 18, fontWeight: 600 }}>Untitled rule</b><span className="sb-label" style={{ marginLeft: 10 }}>Draft</span></span>
      <span style={{ display: 'flex', gap: 8 }}><span className="sb-btn is-secondary">Test Rule</span>{!narrow && <span className="sb-btn" style={{ opacity: .45 }}>Save Rule</span>}</span>
    </div>
    <div className="sb-editor-code">
      <span className="n">1</span><span><Typing text="type.inbound" run={run} reduced={reduced} /></span>
      <span className="n">2</span><span><span className="k"><Typing text="and " run={run} every={90} reduced={reduced} /></span><span className="sb-caret" /></span>
      {Array.from({ length: narrow ? 18 : 26 }, (_, i) => <span key={i} style={{ display: 'contents' }}><span className="n">{i + 3}</span><span /></span>)}
    </div>
  </Page>;
}

/** The message page: ASA's verdict and the empty Matched Detection Rules on the left, the review sidebar on the right (one column on a phone). */
function MessagePage({ gap, step }: { gap: boolean; step: number }) {
  const narrow = useNarrowLayout();
  const verdict = <VerdictPanel>
    <div style={{ display: 'grid', gap: 18, padding: narrow ? '16px 18px 18px' : '18px 24px 22px' }}>
      <div style={{ display: 'grid', gap: 6 }}>
        <span className="sb-label">Executive Summary</span>
        <p className="sb-body" style={{ lineHeight: '22px' }}>This message impersonates Payroll Operations and urges the recipient to verify their payroll profile through an unfamiliar domain. The sender fails DMARC, does not align with the organization’s trusted HR infrastructure, and uses credential-harvesting language under the pretext of an upcoming pay cycle.</p>
      </div>
    </div>
  </VerdictPanel>;

  // Liberty taken: a short header names the email (subject, sender, recipient) above the verdict; the source page
  // opens on the verdict, with these fields in its details further down.
  const header = <header style={{ display: 'grid', gap: 8, gridColumn: '1 / -1' }}>
    <p style={{ fontSize: narrow ? 19 : 22, fontWeight: 600, lineHeight: narrow ? '26px' : '30px', letterSpacing: '-.2px' }}>{job.subject}</p>
    <div className="sb-body" style={{ display: 'flex', flexWrap: 'wrap', columnGap: 28, rowGap: 4 }}>
      <span style={{ overflowWrap: 'anywhere' }}><span className="sb-label" style={{ marginRight: 8 }}>From</span>Payroll Operations &lt;payroll-verify@employee-benefits.co&gt;</span>
      <span><span className="sb-label" style={{ marginRight: 8 }}>To</span>alex.morgan@acme.com</span>
    </div>
  </header>;

  const matched = <section className="sb-sec">
    <p className="sb-sec-h">Matched Detection Rules (0)</p>
    <div className="sb-cells sb-verdict sb-body" style={{ justifyContent: 'center', gap: 8, padding: '22px 16px', color: 'var(--sb-weak)' }}>{Icon.bullseye}No Detection Rules matched this message group.</div>
  </section>;

  const content = <section className="sb-sec">
    <p className="sb-sec-h">Message Content</p>
    <div className="sb-cells" style={{ padding: '16px 20px', display: 'grid', gap: 14 }}>
      <div className="sb-tabs-row"><b>User View</b><span>Text View</span><span>HTML View</span>{!narrow && <span>EML View</span>}</div>
      <div className="sb-mail">
        <p className="sb-mail-caution"><b>CAUTION:</b> This message originated outside of your organization.</p>
        <p className="sb-label">From: Payroll Operations &lt;payroll-verify@employee-benefits.co&gt;</p>
        <p style={{ fontSize: 22, lineHeight: '28px', margin: '10px 0 6px' }}>Action required</p>
        <p className="sb-body">Your payroll profile requires verification before the next pay cycle. Review and confirm your direct deposit details to avoid a delay in payment.</p>
        <span className="sb-mail-qr" aria-hidden="true" />
      </div>
    </div>
  </section>;

  const side = <div style={{ display: 'grid', gap: 24, alignContent: 'start' }}>
    <section className="sb-sec">
      <p className="sb-sec-h">Review Status</p>
      <div className="sb-box" style={{ display: 'grid', gap: 16, padding: 16 }}>
        <div style={{ display: 'grid', gap: 8 }}><span className="sb-label">Review Status</span><span className="sb-pill is-outline" style={{ height: 24, fontSize: 12, width: 'fit-content' }}>⚠ Unreviewed</span></div>
        <div>
          <div style={{ borderRadius: 4, overflow: 'hidden', border: '1px solid var(--sb-border-strong)' }}>
            <div className="sb-list-row sb-label" style={{ height: 32 }}>Select Classification</div>
            {classifications.map(v => <div key={v} className="sb-list-row" style={{ borderTop: '1px solid var(--sb-border)' }}><span className="sb-verdict"><VerdictIcon verdict={v} />{v[0].toUpperCase() + v.slice(1)}</span>{Icon.chevron()}</div>)}
          </div>
        </div>
      </div>
    </section>
    <section className="sb-sec" data-frame="other">
      <p className="sb-sec-h">Other</p>
      <div className="sb-cells">
        {other.map((o, i) => <div key={o} className={`sb-list-row ${gap && i === 0 && step >= 2 ? 'is-hover' : ''} ${gap && i === 0 && step === 3 ? 'is-pressed' : ''}`} data-target={i === 0 ? 'editor' : undefined} style={{ height: 40, padding: '0 16px', borderTop: i ? '1px solid var(--sb-border)' : undefined }}>{o}{Icon.chevron()}</div>)}
      </div>
    </section>
    {!gap && <AdeCard phase={step >= 5 ? 'running' : step === 4 ? 'starting' : 'ready'} pressed={step === 3} viewPressed={step === 7} />}
  </div>;

  return <Page crumbs={['User Reports', job.subject]} style={narrow
    ? { display: 'grid', gap: 28, padding: '20px 16px 40px' }
    : { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 32, padding: '28px 32px 40px' }}>
    {header}
    <div style={{ display: 'grid', gap: 28, alignContent: 'start' }}>{verdict}{matched}{!narrow && content}</div>
    {side}
    {narrow && content}
  </Page>;
}

/** A message ASA called malicious that no rule caught, before ADÉ and with it. */
export default function MessageDetail({ variant }: { variant: Variant }) {
  const scene = useScene(timings[variant], captions[variant]);
  const stage = useStage({ wide: 1000 });
  const step = scene.step;
  const t = useTargets(step, stage.narrow);
  const gap = variant === 'gap';
  const editor = gap && step === 4;
  const jobPage = !gap && step >= 8;
  const box = { ...stage.box, bottom: t.height };

  // The camera only scrolls, at the page's own scale. It moves on steps of its own, and the pointer moves only once it has landed.
  // Gap: scroll down to the sidebar's Other section before the pointer comes in. Handoff: scroll to the ADÉ card.
  const shot = gap ? (step >= 1 && step <= 3 ? 'other' : null) : !jobPage && step >= 1 ? 'ade-side' : null;
  const view = useShot(shot ? `${shot}-${stage.narrow}` : null, shot ? frame(t.rect(shot), box, { scale: 1, pad: 24, y: stage.narrow ? 'start' : 'center' }) : null);
  let pointer: { key: string; pressing?: boolean } | null = null;
  if (gap && (step === 2 || step === 3)) pointer = { key: 'editor', pressing: step === 3 };
  if (!gap && (step === 2 || step === 3)) pointer = { key: 'trigger', pressing: step === 3 };
  if (!gap && (step === 6 || step === 7)) pointer = { key: 'view-job', pressing: step === 7 };

  return <SceneFrame scene={scene} stage={stage} title={gap ? 'the missed threat' : 'the handoff to ADÉ'} label={gap
    ? 'The message detail page: ASA rates a payroll phishing message malicious and Matched Detection Rules is empty; Send EML to Rule Editor opens the Rule Editor, where the rule is written by hand'
    : 'The same page with ADÉ in the sidebar under Review Status and Other: Trigger ADÉ starts a job, and View Report opens the job page, where ADÉ is working'}>
    <Screens id={editor ? 'editor' : jobPage ? 'job' : 'message'}>
      {editor ? <RuleEditor run={editor} reduced={scene.reduced} /> : jobPage ? <JobInProgress /> : <Camera view={view} width={stage.W} height={stage.box.height} cameraRef={t.ref} reduced={scene.reduced}>
        <MessagePage gap={gap} step={step} />
        <Pointer at={pointer ? t.at(pointer.key) : null} visible={!!pointer} pressing={pointer?.pressing} reduced={scene.reduced} />
      </Camera>}
    </Screens>
  </SceneFrame>;
}
