import { NativeStage } from '../case-study/NativeStage';
import { Icon, Page, VerdictIcon, Zoom } from './SublimeUI';
import { Pointer, SceneControls, useScene, useTargets } from './scene';

// ADÉ Automation (patrick/ade-workflow ade/ade-automation-config): per disposition, whether ADÉ starts a job on its own and the rule
// auto-acceptance threshold. The scene walks one customer up the on-ramp for malicious mail. The threshold explainer is the column
// header's info popover; its copy and the recommended thresholds are the source's. It opens upward, as the product's popovers flip when the
// window has no room below.
const W = 820;
const timings = [1400, 800, 900, 800, 4200, 800, 900, 700, 900, 800, 3800];
const captions = [
  'Manual: ADÉ runs only when someone triggers it',
  'Auto-start for malicious messages',
  'Auto-start for malicious messages',
  'What the threshold means',
  'A rule is auto-accepted once its hunt’s match rate meets the threshold',
  'Set when ADÉ may accept its own rules',
  'Set when ADÉ may accept its own rules',
  'Set when ADÉ may accept its own rules',
  'Auto-accept at the recommended 90% match',
  'Turn the automation on',
  'ADÉ now starts and accepts on its own, within the bar you set',
];
const rows = [
  { verdict: 'malicious', label: 'Malicious', recommended: 90 },
  { verdict: 'spam', label: 'Spam', recommended: 85 },
  { verdict: 'graymail', label: 'Graymail', recommended: 95 },
] as const;
const cols = '120px 140px minmax(0, 1fr) 206px';
// Where the pointer is, and whether it is pressing, at each step.
const path: ({ key: string; pressing?: boolean } | null)[] = [
  null, { key: 'switch' }, { key: 'switch', pressing: true }, { key: 'info' }, { key: 'info' },
  { key: 'threshold' }, { key: 'threshold', pressing: true }, { key: 'option' }, { key: 'option', pressing: true },
  { key: 'status' }, { key: 'status', pressing: true },
];

function Switch({ on }: { on: boolean }) {
  return <span className={`sb-switch ${on ? 'is-on' : ''}`}><i>{on ? Icon.check : Icon.x}</i></span>;
}

/** The on-ramp to autonomy, as settings. */
export default function AutomationConfig() {
  const scene = useScene(timings);
  const step = scene.step;
  const t = useTargets(step);
  const autoStart = step >= 2;
  const explain = step === 4;
  const menuOpen = step >= 6 && step <= 7;
  const threshold = step >= 8;
  const active = step >= 10;
  const pointer = path[step];
  return <figure className={`qb-demo ${scene.fade ? 'qb-loop-reset' : ''}`} ref={scene.ref} aria-label="ADÉ Automation settings: for malicious messages, Automatically start ADÉ job is switched on; the threshold's info explains that a rule is auto-accepted once its hunt's match rate meets the threshold, with Sublime's recommendations of 90% for malicious, 85% for spam and 95% for graymail; the threshold changes from Require review to Recommended (90%), and the automation is set to Active">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom key={scene.take} width={W}>
          <div ref={t.ref} style={{ position: 'relative' }}>
            <Page crumbs={['Agents', 'ADÉ', 'ADÉ Automation']} style={{ minHeight: 900 }}>
              {/* Liberty taken: the source's three bordered boxes become one header, a quiet details row, and the table. */}
              <div style={{ display: 'grid', gap: 22, padding: '32px 32px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32 }}>
                  <div><p style={{ fontSize: 22, fontWeight: 600, lineHeight: '30px', letterSpacing: '-.2px' }}>ADÉ Automation</p><p className="sb-body" style={{ marginTop: 4, color: 'var(--sb-weak)' }}>Automatically run ADÉ and accept generated rules when validation meets your threshold.</p></div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}><span className="sb-label sb-verdict" style={{ gap: 4 }}>Status{Icon.info}</span>
                    <span className={`sb-select ${step === 10 ? 'is-pressed' : ''}`} data-target="status" style={{ width: 128 }}><span className="sb-verdict"><i className={`sb-status-dot ${active ? 'is-on' : ''}`} />{active ? 'Active' : 'Inactive'}</span>{Icon.chevron('down')}</span>
                  </span>
                </div>
                <div className="sb-body" style={{ display: 'flex', gap: 40, whiteSpace: 'nowrap' }}>
                  <span><span className="sb-label" style={{ marginRight: 10 }}>Trigger</span>Unflagged Message Classified, Manually Triggered</span>
                  <span><span className="sb-label" style={{ marginRight: 10 }}>Author</span>Sublime Security</span>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 12, padding: '28px 32px 40px', borderTop: '1px solid var(--sb-border)' }}>
                <p style={{ fontSize: 15, fontWeight: 600 }}>Configure ADÉ Jobs</p>
                <p className="sb-body">ADÉ can run automatically when a message group is unflagged but has a disposition of Malicious, Spam, or Graymail. It can also automatically accept a new generated Rule based on how well its Hunt results match the disposition of the originating message group.</p>
                <div className="sb-cells" style={{ marginTop: 8, overflow: 'visible' }}>
                  <div className="sb-row is-head" style={{ gridTemplateColumns: cols, background: 'var(--sb-cell-head)', borderRadius: '4px 4px 0 0', overflow: 'visible' }}>
                    <span className="sb-verdict" style={{ fontSize: 11 }}>Disposition {Icon.info}</span><span>Auto-start ADÉ job</span><span>Alerts</span>
                    <span className="sb-verdict" style={{ fontSize: 11, position: 'relative' }}>Rule auto-acceptance threshold <span data-target="info" style={{ display: 'inline-flex', color: explain ? 'var(--sb-strong)' : undefined }}>{Icon.info}</span>
                      <span className={`sb-popover is-above ${explain ? '' : 'is-out'}`} role="tooltip">
                        <span>ADÉ uses the rule to hunt for similar message groups from the last 14 days and checks how often the verdict matches the original message.</span>
                        <span>A rule is auto-accepted once the match rate meets the threshold.</span>
                        <span><span className="sb-label" style={{ display: 'block', marginBottom: 4 }}>Sublime recommendations</span>
                          <dl>{rows.flatMap(r => [<dt key={`t-${r.label}`} className="sb-verdict"><VerdictIcon verdict={r.verdict} size={13} />{r.label}</dt>, <dd key={`d-${r.label}`}>{r.recommended}%</dd>])}</dl>
                        </span>
                        <span className="sb-label">Custom thresholds and manual review are also supported.</span>
                      </span>
                    </span>
                  </div>
                  {rows.map((row, i) => {
                    const first = i === 0;
                    return <div key={row.verdict} className="sb-row" style={{ gridTemplateColumns: cols, minHeight: 60, borderTop: '1px solid var(--sb-border-strong)', overflow: 'visible' }}>
                      <span className="sb-chip" style={{ width: 'fit-content', gap: 6 }}><VerdictIcon verdict={row.verdict} size={14} />{row.label}</span>
                      <span data-target={first ? 'switch' : undefined} style={{ width: 'fit-content' }}><Switch on={first && autoStart} /></span>
                      <span className="sb-select" style={{ maxWidth: 200 }}>No Alert{Icon.chevron('down')}</span>
                      <span style={{ position: 'relative' }}>
                        <span className={`sb-select ${first && menuOpen ? 'is-open' : ''} ${first && step === 6 ? 'is-pressed' : ''}`} data-target={first ? 'threshold' : undefined}>{first && threshold ? `Recommended (${row.recommended}%)` : 'Require review'}{Icon.chevron('down')}</span>
                        {first && <span className={`sb-menu ${menuOpen || step === 8 ? '' : 'is-out'}`} style={{ display: 'block' }}>
                          <div className={step >= 7 ? 'is-hover' : ''} data-target="option">Recommended ({row.recommended}%)</div>
                          <div>Custom</div>
                          <div>Require review</div>
                        </span>}
                      </span>
                    </div>;
                  })}
                </div>
              </div>
            </Page>
            <Pointer at={pointer ? t.at(pointer.key) : null} visible={!!pointer} pressing={pointer?.pressing} reduced={scene.reduced} />
          </div>
        </Zoom>
      </div>
    </NativeStage>
    <SceneControls scene={scene} title="the automation settings" caption={captions[step]} />
  </figure>;
}
