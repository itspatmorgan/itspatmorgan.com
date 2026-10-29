import { Icon, Page, Switch, VerdictIcon } from './SublimeUI';
import { Camera, Pointer, SceneFrame, frame, useScene, useShot, useStage, useTargets } from './scene';

// ADÉ Automation (patrick/ade-workflow ade/ade-automation-config): per verdict, whether ADÉ starts a job on its own and the rule
// auto-acceptance threshold. The scene walks one customer up the on-ramp for malicious mail. The threshold explainer is the column
// header's info popover; its copy and the recommended thresholds are the source's. It opens upward, as the product's popovers flip when the
// window has no room below. On a phone the table drops its Alerts column, and the popover opens downward over the rows.
// Spam and graymail sit as the source's sample data configures them (spam on at its recommended 85%, graymail off and on review). Liberty
// taken: the source's Slack alert is moved from malicious to spam, so one row shows an alert while malicious is the row the scene sets up.
const timings = [1300, 700, 400, 700, 3600, 700, 400, 600, 700, 700, 3400];
const captions = [
  'Manual: ADÉ runs only when someone triggers it',
  'Auto-start for malicious messages',
  'Auto-start for malicious messages',
  'A rule is auto-accepted once its hunt’s match rate meets the threshold',
  'A rule is auto-accepted once its hunt’s match rate meets the threshold',
  'Auto-accept at the recommended 90% match',
  'Auto-accept at the recommended 90% match',
  'Auto-accept at the recommended 90% match',
  'Auto-accept at the recommended 90% match',
  'Turn it on: ADÉ now starts and accepts on its own, within the bar you set',
  'Turn it on: ADÉ now starts and accepts on its own, within the bar you set',
];
const rows = [
  { verdict: 'malicious', label: 'Malicious', recommended: 90, on: false, alert: null },
  { verdict: 'spam', label: 'Spam', recommended: 85, on: true, alert: 'Send Slack alert' },
  { verdict: 'graymail', label: 'Graymail', recommended: 95, on: false, alert: null },
] as const;
const wideCols = 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.45fr) minmax(0, 1.45fr)';
const narrowCols = '92px 52px minmax(0, 1fr)';
// Where the pointer is, and whether it is pressing, at each step.
const path: ({ key: string; pressing?: boolean } | null)[] = [
  null, { key: 'switch' }, { key: 'switch', pressing: true }, { key: 'info' }, { key: 'info' },
  { key: 'threshold' }, { key: 'threshold', pressing: true }, { key: 'option' }, { key: 'option', pressing: true },
  { key: 'status' }, { key: 'status', pressing: true },
];

const slack = <svg width="12" height="12" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M94.12 315.1c0 25.9-21.16 47.06-47.06 47.06S0 341 0 315.1c0-25.9 21.16-47.06 47.06-47.06h47.06v47.06zm23.72 0c0-25.9 21.16-47.06 47.06-47.06s47.06 21.16 47.06 47.06v117.84c0 25.9-21.16 47.06-47.06 47.06s-47.06-21.16-47.06-47.06V315.1zm47.06-188.98c-25.9 0-47.06-21.16-47.06-47.06S139 32 164.9 32s47.06 21.16 47.06 47.06v47.06H164.9zm0 23.72c25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06H47.06C21.16 243.96 0 222.8 0 196.9s21.16-47.06 47.06-47.06H164.9zm188.98 47.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06h-47.06V196.9zm-23.72 0c0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06V79.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06V196.9zM283.1 385.88c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06v-47.06h47.06zm0-23.72c-25.9 0-47.06-21.16-47.06-47.06 0-25.9 21.16-47.06 47.06-47.06h117.84c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06H283.1z" /></svg>;

/** The source's alerts cell (AdeAutomationAlertsSelector): the chosen alert, or No Alert, beside the menu button. */
function Alerts({ alert }: { alert: string | null }) {
  return <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span className="sb-chip" style={{ flex: '1 1 auto', maxWidth: 224, height: 28, gap: 6 }}>{alert && slack}{alert ?? 'No Alert'}</span>
    <span className="sb-select" style={{ width: 32, padding: 0, justifyContent: 'center', flexShrink: 0, background: 'var(--sb-subtle)' }}>{Icon.chevron('down')}</span>
  </span>;
}

/** The on-ramp to autonomy, as settings. */
export default function AutomationConfig() {
  const scene = useScene(timings, captions);
  // The settings page ends below the table, so the card sits whole on the stage; at 1060 px it renders at its true size.
  const stage = useStage({ wide: 1060, height: 690, contained: true });
  const narrow = stage.narrow;
  const cols = narrow ? narrowCols : wideCols;
  const rowPad = narrow ? { padding: '0 12px', columnGap: 12 } : { columnGap: 32 };
  const step = scene.step;
  const t = useTargets(step, narrow);
  const autoStart = step >= 2;
  const explain = step === 4;
  const menuOpen = step >= 6 && step <= 7;
  const threshold = step >= 8;
  const active = step >= 10;
  const pointer = path[step];
  // On a phone the table sits below the fold: scroll down to it while the rows change, then back up for the status.
  const shot = narrow && step >= 1 && step <= 8 ? 'table' : null;
  const view = useShot(shot, shot ? frame(t.rect('table'), { ...stage.box, bottom: t.height }, { scale: 1, pad: 16, y: 'start' }) : null);
  return <SceneFrame scene={scene} stage={stage} title="the automation settings" label="ADÉ Automation settings: spam already starts ADÉ jobs on its own, accepts at the recommended 85% and sends a Slack alert, and graymail stays on review; for malicious messages, Automatically start ADÉ job is switched on; the threshold's info explains that a rule is auto-accepted once its hunt's match rate meets the threshold, with Sublime's recommendations of 90% for malicious, 85% for spam and 95% for graymail; the threshold changes from Require review to Recommended (90%), and the automation is set to Active">
    <Camera view={view} width={stage.W} height={stage.box.height} cameraRef={t.ref} reduced={scene.reduced}>
            <Page crumbs={['Agents', 'ADÉ', 'ADÉ Automation']} style={{ minHeight: stage.box.height - 48 }}>
              {/* Liberty taken: the source's three bordered boxes become one header (name, description, author, status) and the table. The
                  source's Trigger field is left out: the table says the same thing per verdict. */}
              <div style={{ display: 'flex', flexDirection: narrow ? 'column' : 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: narrow ? 16 : 32, padding: narrow ? '24px 16px 22px' : '32px 32px 28px' }}>
                <div><p style={{ fontSize: narrow ? 20 : 22, fontWeight: 600, lineHeight: '30px', letterSpacing: '-.2px' }}>ADÉ Automation</p><p className="sb-body" style={{ marginTop: 4, color: 'var(--sb-weak)' }}>Automatically run ADÉ and accept generated rules when validation meets your threshold.</p>
                  <p className="sb-body" style={{ marginTop: 12 }}><span className="sb-label" style={{ marginRight: 10 }}>Author</span>Sublime Security</p></div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}><span className="sb-label sb-verdict" style={{ gap: 4 }}>Status{Icon.info}</span>
                  <span className={`sb-select ${step === 10 ? 'is-pressed' : ''}`} data-target="status" style={{ width: 128 }}><span className="sb-verdict"><i className={`sb-status-dot ${active ? 'is-on' : ''}`} />{active ? 'Active' : 'Inactive'}</span>{Icon.chevron('down')}</span>
                </span>
              </div>
              <div style={{ display: 'grid', gap: 12, padding: narrow ? '22px 16px 32px' : '28px 32px 40px', borderTop: '1px solid var(--sb-border)' }}>
                <p style={{ fontSize: 15, fontWeight: 600 }}>Configure ADÉ Jobs</p>
                {/* Liberty taken: the source's two-sentence explainer is cut to one line, and its "Disposition" column is called Verdict. */}
                <p className="sb-body">Choose, by verdict, when ADÉ starts on its own and when it accepts the rule it writes.</p>
                <div className="sb-cells" style={{ marginTop: 8, overflow: 'visible' }} data-frame="table">
                  <div className="sb-row is-head" style={{ gridTemplateColumns: cols, ...rowPad, background: 'var(--sb-cell-head)', borderRadius: '4px 4px 0 0', overflow: 'visible' }}>
                    <span className="sb-verdict" style={{ fontSize: 11 }}>Verdict {Icon.info}</span><span>{narrow ? 'Auto-start' : 'Auto-start ADÉ job'}</span>{!narrow && <span>Alerts</span>}
                    <span className="sb-verdict" style={{ fontSize: 11, position: 'relative' }}>{narrow ? 'Auto-accept threshold' : 'Rule auto-acceptance threshold'} <span data-target="info" style={{ display: 'inline-flex', color: explain ? 'var(--sb-strong)' : undefined }}>{Icon.info}</span>
                      <span className={`sb-popover ${narrow ? '' : 'is-above'} ${explain ? '' : 'is-out'}`} role="tooltip">
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
                    return <div key={row.verdict} className="sb-row" style={{ gridTemplateColumns: cols, ...rowPad, minHeight: 60, borderTop: '1px solid var(--sb-border-strong)', overflow: 'visible' }}>
                      <span className="sb-chip" style={{ width: 'fit-content', gap: 6 }}><VerdictIcon verdict={row.verdict} size={14} />{row.label}</span>
                      <span data-target={first ? 'switch' : undefined} style={{ width: 'fit-content' }}><Switch on={first ? autoStart : row.on} /></span>
                      {!narrow && <Alerts alert={row.alert} />}
                      <span style={{ position: 'relative' }}>
                        <span className={`sb-select ${first && menuOpen ? 'is-open' : ''} ${first && step === 6 ? 'is-pressed' : ''}`} data-target={first ? 'threshold' : undefined}><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(first ? threshold : row.on) ? `Recommended (${row.recommended}%)` : 'Require review'}</span>{Icon.chevron('down')}</span>
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
    </Camera>
  </SceneFrame>;
}
