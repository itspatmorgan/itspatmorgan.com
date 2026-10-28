import { NativeStage } from '../case-study/NativeStage';
import { ART, Icon, Page, StatusPill, VerdictIcon, VerdictPanel, Zoom, job, ruleName } from './SublimeUI';
import { Camera, Expand, Pointer, SceneControls, focus, useScene, useTargets } from './scene';

// The message detail page (patrick/ade-workflow user-reports, MessageDetailView and AdeStatusCard): ASA's verdict on a message no rule caught.
// `gap` is the page before ADÉ, where the way to a rule ran through the Rule Editor. `handoff` adds ADÉ and runs a job from the page.
// Liberties taken for the case study: ASA's red banner is inverted to a tinted head, and the ADÉ card moves to the top of the sidebar
// and shows ADÉ's working steps (the job's agent messages in _ade-data.js) while it runs. Message and job copy are the prototype's sample data.
type Variant = 'gap' | 'handoff';
const W = 1000;
const H = 820 * W / 1020;
const timings: Record<Variant, number[]> = {
  gap: [1500, 2600, 2900, 3600],
  handoff: [1400, 1300, 450, 1000, 1000, 1000, 1000, 4000],
};
const captions: Record<Variant, string[]> = {
  gap: ['ASA calls the message malicious', 'No existing Detection Rule matched it', 'The way to a rule: send it to the Rule Editor and write one by hand', 'ASA knew the threat; the coverage still took a detection engineer'],
  handoff: ['ADÉ sits at the top of the sidebar', 'Trigger ADÉ', 'Trigger ADÉ', 'ADÉ works in the background', 'ADÉ works in the background', 'ADÉ works in the background', 'ADÉ works in the background', 'A recommended rule is ready for review'],
};
const classifications = ['malicious', 'spam', 'graymail', 'benign'] as const;
const other = ['Send EML to Rule Editor', 'Send EML to Sublime', 'Send to ThreadSafe', 'Share feedback'];
const work = ['Interpret ASA findings', 'Identify generalizable attack traits', 'Draft detection hypothesis', 'Validate with a 14-day hunt'];

function Spinner() {
  return <svg className="sb-spin" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.2" fill="none" stroke="var(--sb-border-strong)" strokeWidth="1.8" /><path d="M8 1.8a6.2 6.2 0 0 1 6.2 6.2" fill="none" stroke="var(--sb-button)" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}

/** The ADÉ card: ready, working through its steps, then ready for review. */
function AdeCard({ phase, done, pressed }: { phase: 'ready' | 'working' | 'review'; done: number; pressed: boolean }) {
  return <div className={`sb-ade-card ${phase === 'working' ? 'is-running' : ''}`} data-frame="ade"><div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--sb-border)' }}>
      <span className="sb-ade-mark"><img src={ART.ade} alt="" draggable={false} className="sb-art" /></span>
      <span style={{ flex: 1, minWidth: 0 }}><b style={{ display: 'block', fontSize: 14, fontWeight: 600, lineHeight: '18px' }}>ADÉ</b><span className="sb-label">Autonomous Detection Engineer</span></span>
      {Icon.info}
    </div>
    <div style={{ padding: 16 }}>
      <Expand open={phase === 'ready'}>
        <div style={{ display: 'grid', gap: 14, paddingBottom: 2 }}>
          <span className="sb-body">No Detection Rule matches this message. ADÉ can write one and test it against your mail.</span>
          <span className={`sb-btn ${pressed ? 'is-pressed' : ''}`} data-target="trigger" style={{ justifyContent: 'center' }}>Trigger ADÉ</span>
        </div>
      </Expand>
      <Expand open={phase === 'working'}>
        <div style={{ display: 'grid', gap: 12 }}>
          <span className="sb-verdict sb-body" style={{ fontWeight: 500 }}>{Icon.progress}In Progress <span className="sb-label" style={{ marginLeft: 'auto' }}>Started by Patrick Morgan</span></span>
          <ol style={{ display: 'grid', gap: 9 }}>{work.map((w, i) => <li key={w} className={`sb-work ${i < done ? 'is-done' : i === done ? 'is-now' : ''}`}>
            <span className="sb-work-icon">{i < done ? <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7.5" fill="var(--sb-success)" /><path className="sb-tick-path" d="M4.8 8.2l2.1 2.1 4.3-4.4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg> : i === done ? <Spinner /> : <i />}</span>{w}
          </li>)}</ol>
        </div>
      </Expand>
      <Expand open={phase === 'review'}>
        <div style={{ display: 'grid', gap: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><StatusPill status="review" /><span className="sb-label">Completed in 17m</span></span>
          <span className="sb-body"><span className="sb-label" style={{ display: 'block', marginBottom: 2 }}>Recommended rule</span>{ruleName}</span>
          <span className="sb-btn" style={{ justifyContent: 'center' }}>Review recommendation</span>
        </div>
      </Expand>
    </div>
  </div></div>;
}

/** A message ASA called malicious that no rule caught, before ADÉ and with it. */
export default function MessageDetail({ variant }: { variant: Variant }) {
  const scene = useScene(timings[variant]);
  const step = scene.step;
  const t = useTargets(step);
  const gap = variant === 'gap';

  let view = { x: 0, y: 0, s: 1 };
  let pointer: { key: string; pressing?: boolean } | null = null;
  if (gap) {
    if (step === 1) view = focus(t.rect('insight'), 1.65, W, H);
    if (step === 2) { view = focus(t.rect('other'), 1.65, W, H); pointer = { key: 'editor' }; }
  } else {
    if (step >= 1) view = focus(t.rect('ade'), 1.7, W, H, step >= 3 ? .5 : .62);
    if (step === 1 || step === 2) pointer = { key: 'trigger', pressing: step === 2 };
  }
  const phase = gap || step <= 2 ? 'ready' : step === 7 ? 'review' : 'working';
  const done = Math.max(0, step - 3);

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

  const insights = <div className="sb-cells">
    <div className="sb-cell-head">Message Insights (2)</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <span className="sb-verdict sb-body" style={{ alignItems: 'flex-start', padding: '14px 16px', borderRight: '1px solid var(--sb-border-strong)' }}><VerdictIcon verdict="malicious" />ASA determined that the message is a credential-phishing attempt.</span>
      <span style={{ padding: 6 }} data-frame="insight"><span className={`sb-mark sb-verdict sb-body ${gap && step >= 1 ? 'is-on' : ''}`} style={{ alignItems: 'flex-start', padding: '8px 10px' }}><VerdictIcon verdict="malicious" />No existing Detection Rule matched this message group.</span></span>
    </div>
  </div>;

  const content = <div className="sb-cells">
    <div className="sb-cell-head">Message Content</div>
    <div style={{ padding: '16px 20px', display: 'grid', gap: 14 }}>
      <div className="sb-tabs-row"><b>User View</b><span>Text View</span><span>HTML View</span><span>EML View</span></div>
      <div className="sb-mail">
        <p className="sb-mail-caution"><b>CAUTION:</b> This message originated outside of your organization.</p>
        <p className="sb-label">From: Payroll Operations &lt;payroll-verify@employee-benefits.co&gt;</p>
        <p style={{ fontSize: 22, lineHeight: '28px', margin: '10px 0 6px' }}>Action required</p>
        <p className="sb-body">Your payroll profile requires verification before the next pay cycle. Review and confirm your direct deposit details to avoid a delay in payment.</p>
        <span className="sb-mail-qr" aria-hidden="true" />
      </div>
    </div>
  </div>;

  const side = <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
    {!gap && <AdeCard phase={phase} done={done} pressed={step === 2} />}
    <div className="sb-cells">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 12px 12px' }}><span className="sb-body" style={{ fontWeight: 600 }}>Review Status</span><span className="sb-pill is-outline" style={{ height: 24, fontSize: 12 }}>⚠ Unreviewed</span></div>
      <div style={{ padding: '0 12px 12px' }}>
        <div style={{ borderRadius: 4, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px var(--sb-button)' }}>
          <div className="sb-list-row" style={{ background: 'var(--sb-button)', color: '#fff', fontWeight: 500 }}>Select Classification{Icon.info}</div>
          {classifications.map(v => <div key={v} className="sb-list-row" style={{ borderTop: '1px solid var(--sb-border)' }}><span className="sb-verdict"><VerdictIcon verdict={v} />{v[0].toUpperCase() + v.slice(1)}</span>{Icon.chevron()}</div>)}
        </div>
      </div>
    </div>
    <div className="sb-cells" data-frame="other">
      <div className="sb-cell-head">Other</div>
      {other.map((o, i) => <div key={o} className={`sb-list-row ${gap && i === 0 && step >= 2 ? 'is-hover sb-mark-row' : ''}`} data-target={i === 0 ? 'editor' : undefined} style={{ height: 38 }}>{o}{Icon.chevron()}</div>)}
    </div>
  </div>;

  return <figure className={`qb-demo ${scene.fade ? 'qb-loop-reset' : ''}`} ref={scene.ref} aria-label={gap
    ? 'The message detail page: ASA rates a payroll phishing message malicious, Message Insights notes that no existing Detection Rule matched it, and the remaining path is Send EML to Rule Editor'
    : 'The same page with ADÉ at the top of the sidebar: Trigger ADÉ starts a job that works through its steps in the background and returns a recommended rule for review'}>
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom key={scene.take} width={W}>
          <Camera view={view} cameraRef={t.ref}>
            <Page crumbs={['User Reports', job.subject]} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 312px', gap: 28, padding: '24px 32px 40px' }}>
              <div style={{ display: 'grid', gap: 20, alignContent: 'start' }}>{verdict}{insights}{content}</div>
              {side}
            </Page>
            <Pointer at={pointer ? t.at(pointer.key) : null} visible={!!pointer} pressing={pointer?.pressing} scale={view.s} reduced={scene.reduced} />
          </Camera>
        </Zoom>
      </div>
    </NativeStage>
    <SceneControls scene={scene} title={gap ? 'the missed threat' : 'the handoff to ADÉ'} caption={captions[variant][step]} />
  </figure>;
}
