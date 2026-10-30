import { Icon, Page, Switch, VerdictIcon } from './SublimeUI';
import { Camera, HOME, Pointer, SceneFrame, onCard, useScene, useStage, useTargets } from '../case-study/scene';

// ADÉ Automation (patrick/ade-workflow ade/ade-automation-config): per verdict, whether ADÉ starts a job on its own, who hears about it,
// and the rule auto-acceptance threshold. The scene walks the on-ramp in the order the case study tells it: everything starts off, the
// automation goes Active, malicious mail gets auto-start, then a Slack alert, then auto-acceptance at the recommended 99% (the product's real default, per Patrick; the prototype showed 90%). Spam
// and graymail stay off so nothing else on screen competes with that story. A phone crops to the control each step works in. The alert options are the source's (Send Slack alert, Send webhook); liberty taken: the webhook option's mark is the
// external-link icon, standing in for the source's webhook action icon.
type Step = { ms: number; caption: string; at?: string; press?: boolean; set?: 'active' | 'autoStart' | 'alert' | 'threshold'; menu?: 'alerts' | 'threshold'; hover?: boolean };
const C = {
  manual: 'At first, ADÉ runs only when someone starts it',
  active: 'Set the automation to Active',
  start: 'ADÉ starts on its own for malicious messages',
  alert: 'Alert the team in Slack',
  accept: 'ADÉ accepts rules that reach a 99% match',
  done: 'ADÉ now starts, alerts and accepts on its own, within the team’s limits',
};
const steps: Step[] = [
  { ms: 1400, caption: C.manual },
  { ms: 700, caption: C.active, at: 'status' },
  { ms: 600, caption: C.active, at: 'status', press: true, set: 'active' },
  { ms: 700, caption: C.start, at: 'switch' },
  { ms: 600, caption: C.start, at: 'switch', press: true, set: 'autoStart' },
  { ms: 700, caption: C.alert, at: 'alerts' },
  { ms: 400, caption: C.alert, at: 'alerts', press: true, menu: 'alerts' },
  { ms: 600, caption: C.alert, at: 'alert-option', menu: 'alerts', hover: true },
  { ms: 600, caption: C.alert, at: 'alert-option', press: true, set: 'alert' },
  { ms: 700, caption: C.accept, at: 'threshold' },
  { ms: 400, caption: C.accept, at: 'threshold', press: true, menu: 'threshold' },
  { ms: 600, caption: C.accept, at: 'option', menu: 'threshold', hover: true },
  { ms: 600, caption: C.accept, at: 'option', press: true, set: 'threshold' },
  { ms: 3400, caption: C.done },
];
const timings = steps.map(st => st.ms), captions = steps.map(st => st.caption);
const rows = [
  { verdict: 'malicious', label: 'Malicious', recommended: 99 },
  { verdict: 'spam', label: 'Spam', recommended: 85 },
  { verdict: 'graymail', label: 'Graymail', recommended: 95 },
] as const;
const cols = 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.45fr) minmax(0, 1.45fr)';
const slack = <svg width="14" height="14" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M94.12 315.1c0 25.9-21.16 47.06-47.06 47.06S0 341 0 315.1c0-25.9 21.16-47.06 47.06-47.06h47.06v47.06zm23.72 0c0-25.9 21.16-47.06 47.06-47.06s47.06 21.16 47.06 47.06v117.84c0 25.9-21.16 47.06-47.06 47.06s-47.06-21.16-47.06-47.06V315.1zm47.06-188.98c-25.9 0-47.06-21.16-47.06-47.06S139 32 164.9 32s47.06 21.16 47.06 47.06v47.06H164.9zm0 23.72c25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06H47.06C21.16 243.96 0 222.8 0 196.9s21.16-47.06 47.06-47.06H164.9zm188.98 47.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06h-47.06V196.9zm-23.72 0c0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06V79.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06V196.9zM283.1 385.88c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06v-47.06h47.06zm0-23.72c-25.9 0-47.06-21.16-47.06-47.06 0-25.9 21.16-47.06 47.06-47.06h117.84c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06H283.1z" /></svg>;

/** The source's alerts cell (AdeAutomationAlertsSelector): the chosen alert, or No Alert, beside the menu button that lists the
 *  alert actions. `live` marks the row the scene works in, so the pointer can find its button and option. */
function Alerts({ alert, live = false, open = false, pressed = false, hover = false }: { alert: boolean; live?: boolean; open?: boolean; pressed?: boolean; hover?: boolean }) {
  return <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    {/* Sized as a field, to match the menu button beside it and the threshold select. */}
    <span className="sb-chip" style={{ flex: '1 1 auto', maxWidth: 224, height: 32, gap: 8, padding: '0 10px', fontSize: 14, lineHeight: '20px', background: 'var(--sb-card)' }}>{alert && slack}{alert ? 'Send Slack alert' : 'No Alert'}</span>
    <span style={{ position: 'relative', flexShrink: 0 }}>
      <span className={`sb-select ${open ? 'is-open' : ''} ${pressed ? 'is-pressed' : ''}`} data-target={live ? 'alerts' : undefined} style={{ width: 32, padding: 0, justifyContent: 'center', background: 'var(--sb-subtle)' }}>{Icon.chevron('down')}</span>
      {live && <span className={`sb-menu ${open ? '' : 'is-out'}`} style={{ display: 'block', left: 'auto', right: 0, width: 190 }}>
        <div className={hover ? 'is-hover' : ''} data-target="alert-option" style={{ gap: 8 }}>{slack}Send Slack alert</div>
        <div style={{ gap: 8 }}>{Icon.external}Send webhook</div>
      </span>}
    </span>
  </span>;
}

/** The on-ramp to autonomy, as settings. */
export default function AutomationConfig() {
  // The settings page ends below the table, so the card sits whole on the stage; at 1060 px it renders at its true size.
  const stage = useStage({ wide: 1060, height: 690, contained: true });
  const scene = useScene(timings, captions);
  const rowPad = { columnGap: 32 };
  const step = scene.reduced ? steps.length - 1 : scene.step;
  const t = useTargets(step);
  const now = steps[step];
  const set = new Set(steps.slice(0, step + 1).map(st => st.set));
  const [active, autoStart, alert, threshold] = [set.has('active'), set.has('autoStart'), set.has('alert'), set.has('threshold')];
  const pointer = now.at ? { key: now.at, pressing: !!now.press } : null;
  // A phone opens on the page's header, follows the pointer from control to control, and ends on the first row's settings.
  const focus = now.at ? onCard(t.at(now.at), HOME, 'center') : step === 0 ? onCard(t.rect('head'), HOME) : onCard(t.at('alerts'), HOME, 'center');
  return <SceneFrame scene={scene} stage={stage} focus={focus} title="the automation settings" label="ADÉ Automation settings, everything off: the automation is set to Active; for malicious messages, Auto-start ADÉ job is switched on, a Send Slack alert is added, and the threshold changes from Require review to Recommended (99%); spam and graymail stay off">
    <Camera view={HOME} width={stage.W} height={stage.box.height} cameraRef={t.ref} reduced={scene.reduced}>
            <Page crumbs={['Agents', 'ADÉ', 'ADÉ Automation']} style={{ minHeight: stage.box.height - 48 }}>
              {/* Liberty taken: the source's three bordered boxes become one header (name, description, author, status) and the table. The
                  source's Trigger field is left out: the table says the same thing per verdict. */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32, padding: '32px 32px 28px' }} data-frame="head">
                <div><p style={{ fontSize: 22, fontWeight: 600, lineHeight: '30px', letterSpacing: '-.2px' }}>ADÉ Automation</p><p className="sb-body" style={{ marginTop: 4, color: 'var(--sb-weak)' }}>Automatically run ADÉ and accept generated rules when validation meets your threshold.</p>
                  <p className="sb-body" style={{ marginTop: 12 }}><span className="sb-label" style={{ marginRight: 10 }}>Author</span>Sublime Security</p></div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}><span className="sb-label">Status</span>
                  <span className={`sb-select ${now.at === 'status' && now.press ? 'is-pressed' : ''}`} data-target="status" style={{ width: 128 }}><span className="sb-verdict"><i className={`sb-status-dot ${active ? 'is-on' : ''}`} />{active ? 'Active' : 'Inactive'}</span>{Icon.chevron('down')}</span>
                </span>
              </div>
              <div style={{ display: 'grid', gap: 12, padding: '28px 32px 40px', borderTop: '1px solid var(--sb-border)' }}>
                <p style={{ fontSize: 15, fontWeight: 600 }}>Configure ADÉ Jobs</p>
                {/* Liberty taken: the source's two-sentence explainer is cut to one line, and its "Disposition" column is called Verdict. */}
                <p className="sb-body">Choose, by verdict, when ADÉ starts on its own and when it accepts the rule it writes.</p>
                <div className="sb-cells" style={{ marginTop: 8, overflow: 'visible' }} data-frame="table">
                  <div className="sb-row is-head" style={{ gridTemplateColumns: cols, ...rowPad, background: 'var(--sb-cell-head)', borderRadius: '4px 4px 0 0', overflow: 'visible' }}>
                    <span>Verdict</span><span>Auto-start ADÉ job</span><span>Alerts</span>
                    <span>Rule auto-acceptance threshold</span>
                  </div>
                  {rows.map((row, i) => {
                    const first = i === 0;
                    return <div key={row.verdict} className="sb-row" style={{ gridTemplateColumns: cols, ...rowPad, minHeight: 60, borderTop: '1px solid var(--sb-border-strong)', overflow: 'visible' }}>
                      <span className="sb-chip" style={{ width: 'fit-content', gap: 6 }}><VerdictIcon verdict={row.verdict} size={14} />{row.label}</span>
                      <span data-target={first ? 'switch' : undefined} style={{ width: 'fit-content' }}><Switch on={first && autoStart} /></span>
                      <Alerts alert={first && alert} live={first} open={first && now.menu === 'alerts'} pressed={first && now.at === 'alerts' && !!now.press} hover={first && now.at === 'alert-option' && !!now.hover} />
                      <span style={{ position: 'relative' }}>
                        <span className={`sb-select ${first && now.menu === 'threshold' ? 'is-open' : ''} ${first && now.at === 'threshold' && now.press ? 'is-pressed' : ''}`} data-target={first ? 'threshold' : undefined}><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{first && threshold ? `Recommended (${row.recommended}%)` : 'Require review'}</span>{Icon.chevron('down')}</span>
                        {first && <span className={`sb-menu ${now.menu === 'threshold' ? '' : 'is-out'}`} style={{ display: 'block' }}>
                          <div className={now.at === 'option' && now.hover ? 'is-hover' : ''} data-target="option">Recommended ({row.recommended}%)</div>
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
